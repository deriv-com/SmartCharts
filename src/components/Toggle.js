import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';


/**
 * Toggle web component `<cq-toggle>`.
 *
 * UI Helper that binds a toggle to an object member, or callbacks when toggled
 * cq-member Object member to observe. If not provided then callbacks will be used exclusively.
 * cq-action default="class" Action to take
 * cq-value default="active" Value for action (i.e. class name)
 * cq-toggles A comma separated list of valid values which will be toggled through with each click. List may include "null".
 *
 * use registerCallback to receive a callback every time the toggle changes. When a callback is registered, any automatic
 * class changes are bypassed
 *
 * @name CIQ.UI.Toggle
 * @namespace WebComponents.cq-toggle
 * @example
 * $("cq-toggle").registerCallback(function(value){
 *    console.log("current value is " + value);
 *    if(value!=false) this.node.addClass("active");
 * })
 */
class Toggle extends ContextTag {
    setContext(/* context */) {
        this.currentValue = false;
        this.params.obj = this.context.stx.layout;
        let member = this.node.attr('cq-member');
        if (member) this.params.member = member;
        let action = this.node.attr('cq-action');
        if (action) this.params.action = action;
        let value = this.node.attr('cq-value');
        if (value) this.params.value = value;
        let toggles = this.node.attr('cq-toggles');
        if (toggles) this.params.toggles = toggles.split(',');
        for (let i = 0; i < this.params.toggles.length; i++) {
            if (this.params.toggles[i] === 'null') this.params.toggles[i] = null;
        }
        this.begin();
    }

    attachedCallback() {
        if (this.attached) return;
        this.params = {
            member: null,
            obj: null,
            action: 'class',
            value: 'active',
            toggles: [],
            callbacks: [],
        };
        ContextTag.attachedCallback.apply(this);
        this.attached = true;
    }

    registerCallback(fc, immediate) {
        if (immediate !== false) immediate = true;
        this.params.callbacks.push(fc);
        if (immediate) fc.call(this, this.currentValue);
    }

    /**
 * @param params
 * @alias updateFromBinding
 * @memberof WebComponents.cq-toggle
 */
    updateFromBinding(params) {
        this.currentValue = params.obj[params.member];
        if (!this.params.callbacks.length) {
            if (this.params.action === 'class') {
                if (this.currentValue) {
                    this.node.addClass(this.params.value);
                } else {
                    this.node.removeClass(this.params.value);
                }
            }
        } else {
            for (let i = 0; i < this.params.callbacks.length; i++) {
                this.params.callbacks[i].call(this, this.currentValue);
            }
        }

        if (params.member === 'crosshair' && this.currentValue === false) this.context.stx.doDisplayCrosshairs();
    }

    /**
 * @param value
 * @alias set
 * @memberof WebComponents.cq-toggle
 */
    set(value) {
        if (this.params.member) {
            this.params.obj[this.params.member] = value;
        } else {
            this.currentValue = value;
            for (let i = 0; i < this.params.callbacks.length; i++) {
                this.params.callbacks[i].call(this, this.currentValue);
            }
        }
    }

    /**
 * @alias begin
 * @memberof WebComponents.cq-toggle
 */
    begin() {
        let self = this;
        let stx = this.context.stx;
        if (this.params.member) {
            CIQ.UI.observe({
                selector: this.node,
                obj: this.params.obj,
                member: this.params.member,
                action: 'callback',
                value(params) {
                    self.updateFromBinding(params);
                },
            });
        }
        this.node.stxtap(() => {
            let toggles = self.params.toggles;
            let obj = self.params.obj;
            if (toggles.length > 1) { // Cycle through each field in the array with each tap
                let i;
                for (i = 0; i < toggles.length; i++) {
                    let toggle = toggles[i];
                    if (self.currentValue === toggle) {
                        if (i < toggles.length - 1) { self.set(toggles[i + 1]); } else { self.set(toggles[0]); }
                        break;
                    }
                }
                if (i === toggles.length) { // default to first item in toggle
                    self.set(toggles[0]);
                }
            } else if (self.currentValue) {
                self.set(false);
            } else {
                self.set(true);
            }
            stx.draw();
            if (obj === stx.layout) stx.changeOccurred('layout');
        });
    }
}
export default Toggle;
CIQ.UI.Toggle = document.registerElement('cq-toggle', Toggle);
