export const stickyInterior = (option) => {
    // monkey patching to handle radius and height for `current price label`
    CIQ.ChartEngine.prototype.displaySticky = function (params) {
        const m = this.controls.mSticky;
        if (!m) return;
        const mi = m.querySelector('.mStickyInterior');
        if (!mi) return;
        const overlayTrashCan = m.querySelector('.overlayTrashCan');
        const overlayEdit = m.querySelector('.overlayEdit');
        const mouseDeleteInstructions = m.querySelector('.mouseDeleteInstructions');
        const longPressText = m.querySelector('.stickyLongPressText');
        CIQ.unappendClassName(mouseDeleteInstructions, 'no_edit');
        // backwards compatibility:
        if (!params || typeof (params) !== 'object') {
            params = {
                message: arguments[0], // eslint-disable-line prefer-rest-params
                backgroundColor: arguments[1], // eslint-disable-line prefer-rest-params
                forceShow: arguments[2], // eslint-disable-line prefer-rest-params
                noDelete: arguments[3], // eslint-disable-line prefer-rest-params
                type: arguments[4], // eslint-disable-line prefer-rest-params
            };
        }

        let message = params.message, backgroundColor = params.backgroundColor;
        const type = params.type,
            noEdit = params.noEdit,
            forceShow = params.forceShow,
            noDelete = params.noDelete;
        if (!forceShow && !message) {
            mi.innerHTML = '';
            m.style.display = 'none';
            if (overlayTrashCan) overlayTrashCan.style.display = 'none';
            if (overlayEdit) overlayEdit.style.display = 'none';
            if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'none';
            if (longPressText) longPressText.style.display = 'none';
        } else {
            if (!message) message = '';
            if (backgroundColor === 'auto') backgroundColor = this.defaultColor;
            if (forceShow && !message) {
                mi.style.backgroundColor = '';
                mi.style.color = '';
                mi.style.display = 'none';
            } else if (backgroundColor) {
                mi.style.backgroundColor = backgroundColor;
                mi.style.color = CIQ.chooseForegroundColor(backgroundColor);
                mi.style.display = 'inline-block';
            } else {
                mi.style.backgroundColor = '';
                mi.style.color = '';
                mi.style.display = 'inline-block';
            }

            // This line ony changed
            const nameObj = option.prepareIndicatorName(message);
            mi.innerHTML = nameObj.bars ? `${nameObj.name} (${nameObj.bars})` : nameObj.name;

            const rtClick = m.querySelector('.mStickyRightClick');
            rtClick.className = 'mStickyRightClick';  // reset
            if (type) CIQ.appendClassName(rtClick, `rightclick_${type}`);
            rtClick.style.display = '';
            m.style.display = 'inline-block';
            if (noDelete || this.bypassRightClick === true || this.bypassRightClick[type]) {
                rtClick.style.display = 'none';
            } else if (this.highlightViaTap || this.touches.length) {
                if (overlayTrashCan) overlayTrashCan.style.display = 'inline-block';
                if (overlayEdit && !noEdit) overlayEdit.style.display = 'inline-block';
                if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'none';
                if (longPressText) longPressText.style.display = 'none';
                CIQ[`${message === '' ? '' : 'un'}appendClassName`](m, 'hide');
            } else {
                if (noEdit) CIQ.appendClassName(mouseDeleteInstructions, 'no_edit');
                if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'block';
                if (longPressText) {
                    longPressText.style.display = 'none';
                    const drag = this.preferences.dragging;
                    if (drag && params.panel && !params.panel.noDrag) {
                        if ((drag === true || drag.study) && type === 'study') longPressText.style.display = 'block';
                        else if ((drag === true || drag.series) && type === 'series') longPressText.style.display = 'block';
                    }
                }
            }
            this.positionSticky(m);
        }
    };
};
