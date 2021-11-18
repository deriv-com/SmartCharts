export const overrideResizeObserver = () => {
    CIQ.resizeObserver = function (element, listener, resizeHandle, timeout) {
        if (timeout) {
            if (typeof ResizeObserver !== 'undefined') {
                if (!resizeHandle) {
                    resizeHandle = new ResizeObserver(listener);
                    resizeHandle.observe(element);
                }
            } else {
                if (resizeHandle) clearInterval(resizeHandle);
                resizeHandle = setInterval(listener, timeout);
            }
        } else {
            if (resizeHandle) {
                if (typeof ResizeObserver !== 'undefined' && typeof resizeHandle.disconnect === 'function') {
                    resizeHandle.disconnect();
                } else {
                    clearInterval(resizeHandle);
                }
            }
            resizeHandle = null;
        }
        return resizeHandle;
    };
};
