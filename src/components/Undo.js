import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';

/**
 * Undo web component `<cq-undo>`.
 *
 * @namespace WebComponents.cq-undo
 * @example
 <cq-undo-section>
     <cq-undo class="ciq-btn">Undo</cq-undo>
     <cq-redo class="ciq-btn">Redo</cq-redo>
 </cq-undo-section>
 */

class Undo extends ContextTag {
    createdCallback() {
        super.createdCallback();
        this.redoButton = null;
        this.undostack = [];
        this.redostack = [];
        this.contexts = [];
    }

    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.attached = true;
        let self = this;
        this.addEventListener('stxtap', () => {
            self.undo();
        });
    }

    setContext(context) {
        this.manageContext(this.context);

        let self = this;
        this.addInjection('append', 'initializeChart', () => {
            self.undostack = [];
            self.redostack = [];
            self.clear();
        });
    }


    handleEvent(context, type, data) {
        this.undostack.push({
            context,
            drawings: data.before,
        });
        this.redostack = [];
        this.setButtonStyle();
    }

    manageContext(context) {
        this.addClaim(this);
        let self = this;
        context.stx.addEventListener('undoStamp', (data) => {
            self.handleEvent(context, 'undoStamp', data);
        });
        this.contexts.push(context);
    }

    keyStroke(hub, key, e, keystroke) {
        if (key === 90 && (keystroke.ctrl || keystroke.cmd)) { // ctrl-z
            if (keystroke.shift) {
                this.redo();
            } else {
                this.undo();
            }
            return true;
        }
        if (key === 89 && (keystroke.ctrl || keystroke.cmd)) { // ctrl-y
            this.redo();
            return true;
        }
    }
    /**
     * Reverts last drawing made.
     * @alias undo
     * @memberof WebComponents.cq-undo
     */
    undo() {
        // If a drawing tool is in action, then pressing undo will kill the current tool
        let foundOne = false;
        for (let i = 0; i < this.contexts.length; i++) {
            if (this.contexts[i].stx.activeDrawing) {
                this.contexts[i].stx.undo();
                foundOne = true;
            }
        }
        if (foundOne) return;

        // otherwise proceed to popping off the stack
        let state = this.undostack.pop();
        if (state) {
            let context = state.context;
            this.redostack.push({
                context,
                drawings: CIQ.shallowClone(context.stx.drawingObjects),
            });
            let drawings = state.drawings;
            context.stx.drawingObjects = CIQ.shallowClone(drawings);
            context.stx.changeOccurred('vector');
            context.stx.draw();
        }
        this.setButtonStyle();
    }

    /**
     * Reverts latest undone drawing.
     * @alias redo
     * @memberof WebComponents.cq-undo
     */
    redo() {
        let state = this.redostack.pop();
        if (state) {
            let context = state.context;
            this.undostack.push({
                context,
                drawings: CIQ.shallowClone(context.stx.drawingObjects),
            });
            let drawings = state.drawings;
            context.stx.drawingObjects = CIQ.shallowClone(drawings);
            context.stx.changeOccurred('vector');
            context.stx.draw();
        }
        this.setButtonStyle();
    }

    /**
     * Clears the stack of all redo or undo operations for the context
     * @param  {CIQ.UI.Context} context The context to clear
     * @alias clear
     * @memberof WebComponents.cq-undo
     */
    clear(context) {
        this.setButtonStyle();
    }

    /**
     * @private
     */
    setButtonStyle() {
        if (this.undostack.length) {
            $(this).attr('cq-active', 'true');
        } else {
            $(this).removeAttr('cq-active');
        }
        if (this.redoButton) {
            if (this.redostack.length) {
                $(this.redoButton).attr('cq-active', 'true');
            } else {
                $(this.redoButton).removeAttr('cq-active');
            }
        }
    }
}

document.registerElement('cq-undo', Undo);
export default Undo;
