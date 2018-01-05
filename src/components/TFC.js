import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';

/**
 * Trade From Chart web component `<cq-tfc>`.
 *
 * @namespace WebComponents.cq-tfc
 * @example
     <cq-tfc></cq-tfc>
 */
class TFC extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        CIQ.UI.ContextTag.attachedCallback.apply(this);
        this.attached = true;
    }

    setContext(/* context */) {
        this.initialize();
    }

    /**
 * @alias start
 * @memberof WebComponents.cq-tfc
 */
    start() {
        $('.stx-trade-panel').appendTo($('cq-side-panel'));
        let stx = this.context.stx;

        stx.account = new CIQ.Account.Demo();
        let tfcConfig = {
            stx,
            account: stx.account,
        };
        stx.tfc = new CIQ.TFC(tfcConfig);
        // stx.tfc.setResizeCallback(resizeScreen);

        let self = this;
        $('.stx-trade-nav .stx-trade-ticket-toggle').stxtap(() => {
            $('.stx-trade-nav').removeClass('active');
            $('.stx-trade-info').addClass('active');
            $('cq-side-panel')[0].resizeMyself();
        });
        $('.stx-trade-info .stx-trade-ticket-toggle').stxtap(() => {
            $('.stx-trade-nav').addClass('active');
            $('.stx-trade-info').removeClass('active');
            $('cq-side-panel')[0].resizeMyself();
        });

        stx.tfc.selectSymbol = function (symbol) {
            symbol = symbol.toUpperCase();
            self.context.changeSymbol({ symbol });
        };
    }

    initialize() {
        let self = this;
        function acc(err) {
            if (err) {
                console.log(err);
            } else {
                CIQ.loadScript('plugins/tfc/tfc-demo.js', self.start.bind(self));
            }
        }
        CIQ.loadWidget('plugins/tfc/tfc', acc);
    }
}
export default TFC;
CIQ.UI.TFC = document.registerElement('cq-tfc', TFC);
