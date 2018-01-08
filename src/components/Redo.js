import $ from 'jquery';
import ContextTag from './ui/ContextTag';

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
        super.attachedCallback();
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
        this.addEventListener('stxtap', () => {
            self.undo.redo();
        });
    }
}

document.registerElement('cq-redo', Redo);
export default Redo;

