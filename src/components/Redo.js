import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';

/**
 * Redo web component `<cq-redo>`.
 *
 * Pairs with {@link WebComponents.cq-undo} to redo changes to a drawing.
 * @namespace WebComponents.cq-redo
 * @example
 <cq-undo-section>
     <cq-undo class="ciq-btn">Undo</cq-undo>
     <cq-redo class="ciq-btn">Redo</cq-redo>
 </cq-undo-section>
 */

class Redo extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        CIQ.UI.ContextTag.attachedCallback.apply(this);
        this.attached = true;
    }
    /**
 * Finds {@link WebComponents.cq-undo} and pairs with it to find the last undo and reverse it.
 * @alias pairUp
 * @memberof WebComponents.cq-redo
 */
    pairUp(undo) {
        this.undo = $(undo)[0];
        this.undo.redoButton = this;
        let self = this;
        $(this).stxtap(() => {
            self.undo.redo();
        });
    }
}
export default Redo;
CIQ.UI.Redo = document.registerElement('cq-redo', Redo);
