import { CIQ } from '../../../js/chartiq';
import BaseComponent from './BaseComponent';

/**
 * A tag that is inside of a cq-dialog.
 *
 * Inherits {@link CIQ.UI.BaseComponent}
 * @namespace CIQ.UI.DialogContentTag
 * @memberof CIQ.UI
 */
class DialogContentTag extends BaseComponent {
    /**
     * Opens the parent dialog
     * @param {Object} [params] Optional params
     * @param {CIQ.UI.Context} [params.context] Optionally pass in a context to set
     */
    open(params) {
        if (params && params.context) this.setContext(params.context);
        let tagName = this.tagName.toLowerCase();
        this.node.closest('cq-dialog,cq-menu').each(() => {
            this.addActiveAttribute(tagName);
            this.open(params);
        });
    }

    /**
     * Close the dialog
     */
    close() {
        this.node.parents('cq-dialog')[0].close();
        this.node.find('cq-swatch').each(() => {
            if (this.colorPicker) this.colorPicker.close();
        });
    }

    attachedCallback() {
        super.attachedCallback.apply(this);
    }

    createdCallback() {
        super.createdCallback.apply(this);
    }

    detachedCallback() {
        super.detachedCallback.apply(this);
    }

    /**
     * Dynamically set the context for a dialog, so that it knows which chart to change when there
     * are more than one chart on the screen.
     * @param {CIQ.UI.Context} context The context to set
     */
    setContext(context) {
        this.context = context;
    }
}

export default DialogContentTag;
CIQ.UI.DialogContentTag = DialogContentTag;
