import { CIQ } from '../../js/chartiq';
import ContextTag from './UI/ContextTag';


/**
 * Show Range web component `<cq-show-range>`.
 *
 * @namespace WebComponents.cq-show-range
 * @example
     <cq-show-range>
        <div stxtap="set(1,'today');">1d</div>
        <div stxtap="set(5,'day',30,2);">5d</div>
        <div stxtap="set(1,'month',30,8);">1m</div>
        <div class="hide-sm" stxtap="set(3,'month');">3m</div>
        <div class="hide-sm" stxtap="set(6,'month');">6m</div>
        <div class="hide-sm" stxtap="set(1,'YTD');">YTD</div>
        <div stxtap="set(1,'year');">1y</div>
        <div class="hide-sm" stxtap="set(5,'year','week',1);">5y</div>
        <div class="hide-sm" stxtap="set(1,'all','month',1);">All</div>
   </cq-show-range>
 */
class ShowRange extends ContextTag {
/**
 * Proxies UI requests for span changes to the kernel
 * @param {Object} activator Activation information
 * @param {Number} multiplier   The period that will be passed to {@link CIQ.ChartEngine#setSpan}
 * @param {Number} base The interval that will be passed to {@link CIQ.ChartEngine#setSpan}
 * @param {Number} [interval] Optional chart interval to use (leave empty for autodetect)
 * @param {Number} [period] Optional chart period to use (leave empty for autodetect)
 * @alias set
 * @memberof WebComponents.cq-show-range
 */
    set(activator, multiplier, base, interval, period) {
        let self = this;
        if (self.context.loader) self.context.loader.show();
        let params = {
            multiplier,
            base,
        };
        if (interval) {
            params.periodicity = {
                interval,
                period: period || 1,
            };
        }
        self.context.stx.setSpan(params, () => {
            if (self.context.loader) self.context.loader.hide();
        });
    }
}
export default ShowRange;
CIQ.UI.ShowRange = document.registerElement('cq-show-range', ShowRange);
