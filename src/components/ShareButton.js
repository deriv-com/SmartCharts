import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';

/**
 * Share Button web component `<cq-share-button>`.
 *
 * @namespace WebComponents.cq-share-button
 * @example
 <cq-share-button>
     <div stxtap="tap();">Share</div>
 </cq-share-button>
 */
class ShareButton extends ContextTag {
/**
 * Opens a customizable dialog that can share a chart.
 * @alias tap
 * @memberof WebComponents.cq-share-button
 */
    tap(e) {
        let context = this.context;
        $('cq-share-dialog').each(function () {
            this.open({ context });
        });
    }
}

export default ShareButton;
CIQ.UI.ShareButton = document.registerElement('cq-share-button', ShareButton);

