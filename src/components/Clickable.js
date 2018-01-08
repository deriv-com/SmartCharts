import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';

/**
 * clickable web component `<cq-clickable>`. When tapped/clicked this component can run a method on any
 * other component. Set cq-selector attribute to a selector for the other component. Set cq-method
 * to the method to run on that component. The parameter to the method will be an object that contains
 * the context for this clickable (if available) and a reference to this button ("caller").
 *
 * @namespace WebComponents.cq-clickable
 * @example
 * <cq-clickable cq-selector="cq-sample-dialog" cq-method="open">Settings</span></cq-clickable>
 * runs
 * $("cq-sample-dialog")[0].open({context: this.context, caller: this});
 * @since 3.0.9
 */

class Clickable extends ContextTag {
    createdCallback() {
        ContextTag.createdCallback.apply(this);
    }

    attachedCallback() {
        if (this.attached) return;
        ContextTag.attachedCallback.apply(this);
        this.attached = true;
        let self = this;

        $(this).stxtap(() => {
            self.runMethod();
        });
    }

    /**
 * Runs the clickable
 * @memberof WebComponents.cq-theme-dialog
 */
    runMethod() {
        let selector = this.node.attr('cq-selector');
        let method = this.node.attr('cq-method');

        let clickable = this;
        $(selector).each(function () {
            if (this[method]) this[method].call(this, { context: clickable.context, caller: clickable });
        });
    }
}

export default Clickable;
CIQ.UI.Clickable = document.registerElement('cq-clickable', Clickable);
