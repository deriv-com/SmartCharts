import { CIQ } from '../../js/chartiq';
import ModalTag from './ModalTag';

/**
 * Chart Title web component `<cq-chart-title>`.
 *
 * Note, if the `cq-marker` is added to the element, and it is placed within the
 * chartArea, the element will sit above the chart bars.
 *
 * `<cq-symbol></cq-symbol>` will display the raw symbol for the chart (`chart.symbol`).<br>
 * `<cq-symbol-description></cq-symbol-description>` will display the `chart.symbolDisplay`. See {@link CIQ.ChartEngine.Chart#symbolDisplay} for more details.
 *
 * Set attribute "cq-browser-tab" to true in order to get the stock symbol and latest price to update in the browser tab.
 *
 * Set member previousClose to the prior day's closing price in order to calculate and display change.
 * If previousClose is not set, then iqPrevClose from the dataSet will be the default
 *
 * @namespace WebComponents.cq-chart-title
 * @since 06-15-16
 * @example
 * <cq-chart-title>
 *  <cq-symbol></cq-symbol>
 *  <cq-chart-price>
 *      <cq-current-price></cq-current-price>
 *      <cq-change>
 *          <div class="ico"></div> <cq-todays-change></cq-todays-change> (<cq-todays-change-pct></cq-todays-change-pct>)
 *      </cq-change>
 *  </cq-chart-price>
 * </cq-chart-title>
 * @since  4.0.0
 * Browser tab now updates with stock symbol and latest price using cq-browser-tab attribute
 */
class ChartTitle extends ModalTag {
    constructor() {
        super();
        /**
         * Keep this value up to date in order to calculate change from yesterday's close
         * @type {Float}
         * @alias previousClose
         * @memberof WebComponents.cq-chart-title
         */
        this.previousClose = null;
    }
    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback.apply(this);
        this.attached = true;
    }

    setContext(context) {
        let self = this;
        CIQ.UI.observe({
            obj: self.context.stx.chart.symbolObject,
            action: 'callback',
            value: () => {
                if (self.context.stx.currentQuote()) self.previousClose = self.context.stx.currentQuote().iqPrevClose;
            },
        });
        this.initialize();
    }


    /**
     * Begins the Title helper. This observes the chart and updates the title elements as necessary.
     * @alias begin
     * @memberof WebComponents.cq-chart-title
     */
    begin() {
        let self = this;
        this.addInjection('append', 'createDataSet', () => {
            self.update();
        });
        this.update();
    }

    initialize(params) {
        this.params = params || {};
        if (typeof this.params.autoStart === 'undefined') this.params.autoStart = true;
        this.marker = null;

        if (this.params.autoStart) this.begin();
    }

    /**
     * Updates the values in the node
     * @alias update
     * @memberof WebComponents.cq-chart-title
     */
    update() {
        let stx = this.context.stx;

        let node = $(this);
        if (stx.chart.dataSet && stx.chart.dataSet.length) node.addClass('stx-show');
        else node.removeClass('stx-show');
        let symbolDiv = node.find('cq-symbol');
        let symbolDescriptionDiv = node.find('cq-symbol-description');
        let currentPriceDiv = node.find('cq-current-price');
        let todaysChangeDiv = node.find('cq-todays-change');
        let todaysChangePctDiv = node.find('cq-todays-change-pct');
        let chartPriceDiv = node.find('cq-chart-price');
        let changeDiv = node.find('cq-change');
        let doUpdateBrowserTab = this.node.truthyAttr('cq-browser-tab');
        let doUpdatePrice = chartPriceDiv.length;
        let symbol = stx.chart.symbol,
            symbolDisplay = stx.chart.symbolDisplay;
        let internationalizer = stx.internationalizer;
        let priceChanged = false;

        symbolDiv.textBetter(symbol);

        let todaysChange = '',
            todaysChangePct = 0,
            todaysChangeDisplay = '',
            currentPrice = '';
        let currentQuote = stx.currentQuote();
        currentPrice = currentQuote ? currentQuote.Close : '';
        if (currentPrice && doUpdatePrice) {
            let oldPrice = parseFloat(currentPriceDiv.text());
            if (currentPriceDiv.textBetter(stx.formatYAxisPrice(currentPrice, stx.chart.panel))) {
                priceChanged = true;
                if (typeof (currentPriceDiv.attr('cq-animate')) !== 'undefined') {
                    CIQ.UI.animatePrice(currentPriceDiv, currentPrice, oldPrice);
                }
            }
        }

        symbolDescriptionDiv.textBetter(symbolDisplay || symbol);

        if ((doUpdatePrice || doUpdateBrowserTab) && symbol && priceChanged) {
            // Default to iqPrevClose if the developer hasn't set this.previousClose
            let previousClose = this.previousClose ? this.previousClose : (currentQuote ? currentQuote.iqPrevClose : null);

            if (currentQuote && previousClose) {
                todaysChange = CIQ.fixPrice(currentQuote.Close - previousClose);
                todaysChangePct = todaysChange / previousClose * 100;
                if (internationalizer) {
                    todaysChangeDisplay = internationalizer.percent2.format(todaysChangePct / 100);
                } else {
                    todaysChangeDisplay = `${todaysChangePct.toFixed(2) }%`;
                }
                changeDiv.css({
                    display: 'block',
                });
            } else {
                changeDiv.css({
                    display: 'none',
                });
            }
            let todaysChangeAbs = Math.abs(todaysChange);
            if (todaysChangeAbs) {
                todaysChangeDiv.textBetter(stx.formatYAxisPrice(todaysChangeAbs, stx.chart.panel));
            }
            todaysChangePctDiv.textBetter(todaysChangeDisplay);
            if (todaysChangeDisplay !== '' && todaysChangePct > 0) {
                chartPriceDiv.removeClass('stx-down').addClass('stx-up');
            } else if (todaysChangeDisplay !== '' && todaysChangePct < 0) {
                chartPriceDiv.removeClass('stx-up').addClass('stx-down');
            } else {
                chartPriceDiv.removeClass('stx-down').removeClass('stx-up');
            }

            // These strange characters create some spacing so that the title appears
            // correctly in a browser tab
            this.title = `${symbol } \u200b \u200b ${currentPrice} \u200b \u200b \u200b `;
            if (todaysChangePct > 0) {
                this.title += `\u25b2 ${  todaysChangeAbs}`;
            } else if (todaysChangePct < 0) {
                this.title += `\u25bc ${  todaysChangeAbs}`;
            }
            if (doUpdateBrowserTab) {
                document.title = this.title;
            }
        }
    }
}

CIQ.UI.ChartTitle = document.registerElement('cq-chart-title', ChartTitle);
