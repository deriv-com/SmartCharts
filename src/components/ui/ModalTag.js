import $ from 'jquery';
import ContextTag from './ContextTag';

/**
 * A tag that is modally aware of the chart
 *
 * Inherits {@link CIQ.UI.ContextTag}
 * @namespace CIQ.UI.ModalTag
 * @memberof CIQ.UI
 */
class ModalTag extends ContextTag {
    /**
     *
     * @kind function
     * @memberof CIQ.UI.ModalTag
     */
    modalBegin() {
        if (!this.context) return;
        this.context.stx.modalBegin();
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ModalTag
     */
    modalEnd() {
        if (!this.context) return;
        if (this.uiManager.activeMenuStack.length) return; // If an active menu then don't turn off the modal. Let uiManager handle it.
        this.context.stx.modalEnd();
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ModalTag
     */
    attachedCallback() {
        if (this.attached) return;
        let node = $(this);
        let self = this;
        node.mouseover(() => {
            self.modalBegin();
        });
        node.mouseout(() => {
            self.modalEnd();
        });
        super.attachedCallback();
    }
}

export default ModalTag;
