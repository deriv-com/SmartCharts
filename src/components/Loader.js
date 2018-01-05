import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';

/**
 * Loader web component `<cq-loader>`.
 *
 * CSS loading icon.
 * @namespace WebComponents.cq-loader
 * @example
 <cq-loader><cq-loader>
 */
class Loader extends ContextTag {
    setContext(/* context */) {
        this.context.setLoader(this);
    }
    /**
 * Shows the loading icon.
 * @alias show
 * @memberof WebComponents.cq-loader
 */
    show() {
        $(this).addClass('stx-show');
    }

    /**
 * Hides the loading icon.
 * @alias hide
 * @memberof WebComponents.cq-loader
 */
    hide() {
        $(this).removeClass('stx-show');
    }
}
export default Loader;
CIQ.UI.Loader = document.registerElement('cq-loader', Loader);

