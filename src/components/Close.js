import { BaseComponent } from './componentUI';
import { CIQ } from '../../js/chartiq';

class Close extends BaseComponent {
    /**
     * Close web component `<cq-close>`.
     *
     * cq-close web component will close it's containing (parent or up) component
     * by calling its close() method
     * @namespace WebComponents.cq-close
     * @example
     * <cq-item>
     *         <cq-label></cq-label>
     *         <cq-close></cq-close>
     * </cq-item>
     *
     */
    attachedCallback() {
        if (this.attached) return;
        let self = this;

        function closure() {
            self.tap();
        }
        $(this).stxtap(closure);
        super.attachedCallback();
        this.attached = true;
    }
    /**
     * @alias tap
     * @memberof WebComponents.cq-close
     */
    tap() {
        CIQ.UI.containerExecute(this, 'close');
    }
}

document.registerElement('cq-close', Close);
export default Close;
