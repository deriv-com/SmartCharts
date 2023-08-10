// This is needed to download the canvas as image. Context of the chart has preserveDrawingBuffer as false by default.
// @ts-ignore
HTMLCanvasElement.prototype.getContext = (function (origFn) {
    return function (type: string, attribs: WebGLContextAttributes) {
        attribs = attribs || {};
        attribs.preserveDrawingBuffer = true;
        // @ts-ignore
        return origFn.call(this, type, attribs);
    };
})(HTMLCanvasElement.prototype.getContext);
