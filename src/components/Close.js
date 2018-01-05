import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import BaseComponent from './UI/BaseComponent';

class Close extends BaseComponent {
/**
 * Close web component `<cq-close>`.
 *
 * cq-close web component will close it's containing (parent or up) component
 * by calling its close() method
 * @namespace WebComponents.cq-close
 * @example
 * <cq-item>
 *      <cq-label></cq-label>
 *      <cq-close></cq-close>
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
        CIQ.UI.BaseComponent.attachedCallback.apply(this);
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
export default Close;
CIQ.UI.Close = document.registerElement('cq-close', Close);

