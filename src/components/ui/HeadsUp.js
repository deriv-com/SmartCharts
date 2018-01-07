import Helper from './Helper';

/**
 * UI Helper that keeps the "head's up" display operating. There are three modes:
 * params.followMouse=true - The head's up display will follow the mouse
 * params.staticNode=true - The head's up will simply update a DOM node managed by you
 * default - The head's up will be a marker within the chart, positioned in the chart panel unless overidden
 *
 * @param {HtmlElement} node The node which should be the template for the head's up.
 * @param {CIQ.UI.Context} context The context
 * @param {Object} [params] Optional parameters
 * @param {Boolean} [autoStart=true] If true then start the head's up on construction
 * @param {boolean} [followMouse=false] If true then the head's up will follow the mouse. In this case, the node should be a template
 * that will be removed from the document and then added dynamically into the chart container.
 * @param {Boolean} [staticNode=false] If true then the node will not be added as a marker
 * @param {string} [showClass="stx-show"] The class that will be added to display the head's up
 * @name CIQ.UI.HeadsUp
 * @constructor
 * @since 3.0.0
 */

class HeadsUp extends Helper {
    constructor(node, context, params) {
        super(node, context, params);
        this.params = params || {};
        if (typeof this.params.autoStart === 'undefined') this.params.autoStart = true;
        this.node = $(node);
        this.node.detach();
        this.context = context;
        this.maxVolume = { lastCheckDate: null, value: 0 }; // This contains the maximum volume in the dataSet, used to generate the volume icon element
        if (this.params.autoStart) this.begin();
    }
    /**
     * Begins the head's up operation. This uses injections to manage the contents and location of the display. See {@link CIQ.UI.HeadsUp#end} to stop
     * the head's up.
     * @memberof CIQ.UI.HeadsUp
     */
    begin() {
        let params;
        if (this.params.followMouse) {
            this.node.css({ top: 'auto' }); // allow style.bottom to override the default top value
            params = {
                stx: this.context.stx,
                label: 'headsup',
                xPositioner: 'bar',
                chartContainer: true,
                x: 0,
                node: this.node[0],
            };
            this.marker = new CIQ.Marker.HeadsUp(params, this.params.showClass);
            // this.node.addClass(this.params.showClass);

            this.addInjection('append', 'handleMouseOut', (function (self) {
                return function () {
                    self.followMouse(-1);
                };
            }(this)));
        } else if (this.params.staticNode) {
            // placeholder
        } else {
            this.node.css({ top: '', left: '' }); // Remove any existing styles
            params = {
                stx: this.context.stx,
                label: 'headsup',
                xPositioner: 'none',
                chartContainer: false,
                node: this.node[0],
            };
            $.extend(params, this.params); // Override default marker setup by passing marker parameters into CIQ.UI.HaedsUp
            this.marker = new CIQ.Marker(params);
            // this.node.addClass(this.params.showClass);
        }

        // enable the crosshairs for touch devices
        if (CIQ.isMobile) {
            this.context.stx.layout.crosshair = true;
        }

        this.calculateMaxVolume();
        this.addInjection('prepend', 'headsUpHR', (function (self) { return function () { self.position(); }; }(this)));
        this.addInjection('append', 'createXAxis', (function (self) { return function () { self.position(); }; }(this)));
        this.addInjection('append', 'createDataSet', (function (self) { return function (dontRoll, whichChart, params) { self.calculateMaxVolume(params.appending); }; }(this)));
    }

    /**
     * Stops the head's up from operating by removing injections and hiding. You can start it again by calling {@link CIQ.UI.HeadsUp#begin}.
     * @memberOf CIQ.UI.HeadsUp
     */
    end() {
        if (CIQ.isMobile) {
            this.context.stx.layout.crosshair = false;
        }
        if (this.marker) this.marker.remove();
        this.destroy();
        this.marker = null;
    }

    /**
     * @memberof CIQ.UI.HeadsUp
     * @param {boolean} appending
     */
    calculateMaxVolume(appending) {
        if (!appending) this.maxVolume = { lastCheckDate: null, value: 0 };
        let dataSet = this.context.stx.chart.dataSet;
        if (!dataSet || !dataSet.length) return;
        for (let i = dataSet.length - 1; i >= 0; i--) {
            let q = dataSet[i];
            if (q.DT < this.maxVolume.lastCheckDate) break;
            if (q.Volume > this.maxVolume.value) this.maxVolume.value = q.Volume;
        }
        this.maxVolume.lastCheckDate = dataSet[dataSet.length - 1].DT;
    }

    /**
     * Determines information inside of the HeadsUp display based on position.
     * @memberof CIQ.UI.HeadsUp
     * @private
     */
    position() {
        let stx = this.context.stx;
        let bar = stx.barFromPixel(stx.cx);
        this.tick = stx.tickFromPixel(stx.cx);
        let prices = stx.chart.xaxis[bar];
        let currentQuote = stx.chart.currentQuote;
        let plotField = stx.chart.defaultPlotField;
        if (!plotField || stx.highLowBars[stx.layout.chartType]) plotField = 'Close';

        let node = this.node;
        let self = this;

        function printValues() {
            self.timeout = null;
            node.find('cq-hu-price').text('');
            node.find('cq-hu-open').text('');
            node.find('cq-hu-close').text('');
            node.find('cq-hu-high').text('');
            node.find('cq-hu-low').text('');
            node.find('cq-hu-date').text('');
            node.find('cq-hu-volume').text('');
            node.find('cq-volume-rollup').text('');
            if (prices) {
                if (prices.data) {
                    node.find('cq-hu-open').text(stx.formatPrice(prices.data.Open));
                    node.find('cq-hu-price').text(stx.formatPrice(prices.data[plotField]));
                    node.find('cq-hu-close').text(stx.formatPrice(prices.data.Close));
                    node.find('cq-hu-high').text(stx.formatPrice(prices.data.High));
                    node.find('cq-hu-low').text(stx.formatPrice(prices.data.Low));

                    let volume = CIQ.condenseInt(prices.data.Volume);
                    let rollup = volume.charAt(volume.length - 1);
                    if (rollup > '9') {
                        volume = volume.substring(0, volume.length - 1);
                        node.find('cq-volume-rollup').text(rollup.toUpperCase());
                    }
                    node.find('cq-hu-volume').text(volume);
                    let tickDate = prices.data.displayDate;
                    if (!tickDate) tickDate = prices.data.DT;
                    if (CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
                        node.find('cq-hu-date').text(CIQ.mmddyyyy(CIQ.yyyymmddhhmm(tickDate)));
                    } else {
                        node.find('cq-hu-date').text(CIQ.mmddhhmm(CIQ.yyyymmddhhmmssmmm(tickDate)));
                    }
                    let visuals = node.find('cq-volume-visual');
                    if (visuals.length) {
                        let relativeCandleSize = self.maxVolume.value ? prices.data.Volume / self.maxVolume.value : 0;
                        visuals.css({ width: `${Math.round(relativeCandleSize * 100)}%` });
                    }
                }
                if (currentQuote && currentQuote[plotField] && self.tick === stx.chart.dataSet.length - 1) {
                    node.find('cq-hu-price').text(stx.formatPrice(currentQuote[plotField]));
                }
            }
        }
        if (this.tick !== this.prevTick || (stx.chart.dataSegment && bar === stx.chart.dataSegment.length - 1)) {
            if (this.timeout) clearTimeout(this.timeout);
            let ms = this.params.followMouse ? 0 : 0; // IE and FF struggle to keep up with the dynamic head's up.
            this.timeout = setTimeout(printValues, ms);
        }
        this.prevTick = this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
        if (this.params.followMouse) {
            if (stx.openDialog) this.tick = -1; // Turn off the headsup when a modal is on
            this.followMouse(this.tick);
        }
    }

    followMouse(tick) {
        this.marker.params.x = tick;
        let self = this;
        self.marker.render();
    }
}

export default HeadsUp;
