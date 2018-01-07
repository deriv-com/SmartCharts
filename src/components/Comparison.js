import { ModalTag } from './componentUI';
import { CIQ } from '../../js/chartiq';

/**
 * Symbol comparison component `<cq-comparison>`.
 *
 * Add attribute cq-marker in order to have the component insert itself as a marker on the chart
 *
 * @namespace WebComponents.cq-comparison
 * @example
<cq-comparison cq-marker>
    <cq-menu class="cq-comparison-new">
        <cq-comparison-add-label>
            <cq-comparison-plus></cq-comparison-plus><span>Compare</span><span>...</span>
        </cq-comparison-add-label>
        <cq-comparison-add>
            <cq-comparison-lookup-frame>
                <cq-lookup cq-keystroke-claim>
                    <cq-lookup-input cq-no-close>
                        <input type="text" cq-focus spellcheck="off" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="Enter Symbol">
                        <cq-lookup-icon></cq-lookup-icon>
                    </cq-lookup-input>
                    <cq-lookup-results>
                        <cq-lookup-filters cq-no-close>
                            <cq-filter class="true">ALL</cq-filter>
                            <cq-filter>STOCKS</cq-filter>
                            <cq-filter>FX</cq-filter>
                            <cq-filter>INDEXES</cq-filter>
                            <cq-filter>FUNDS</cq-filter>
                            <cq-filter>FUTURES</cq-filter>
                        </cq-lookup-filters>
                        <cq-scroll></cq-scroll>
                    </cq-lookup-results>
                </cq-lookup>
            </cq-comparison-lookup-frame>
            <cq-swatch cq-no-close></cq-swatch>
            <span><cq-accept-btn class="stx-btn">ADD</cq-accept-btn></span>
        </cq-comparison-add>
    </cq-menu>
    <cq-comparison-key>
        <template cq-comparison-item>
            <cq-comparison-item>
                <cq-comparison-swatch></cq-comparison-swatch>
                <cq-comparison-label>AAPL</cq-comparison-label>
                <!-- cq-comparison-price displays the current price with color animation -->
                <cq-comparison-price cq-animate></cq-comparison-price>
                <!-- cq-comparison-tick-price displays the price for the active crosshair item -->
                <!-- <cq-comparison-tick-price></cq-comparison-tick-price>    -->
                <cq-comparison-loader></cq-comparison-loader>
                <div class="stx-btn-ico ciq-close"></div>
            </cq-comparison-item>
        </template>
    </cq-comparison-key>
</cq-comparison>
     */
    class Comparison extends ModalTag {
        attachedCallback() {
            if (this.attached) return;
            super.attachedCallback();
            this.attached = true;
            this.swatchColors = ['#8ec648', '#00afed', '#ee652e', '#912a8e', '#fff126',
                '#e9088c', '#ea1d2c', '#00a553', '#00a99c', '#0056a4', '#f4932f', '#0073ba', '#66308f', '#323390',
            ];
            this.loading = [];
        }
        /**
         * Handles removing a series from the comparison.
         * @param {string} symbol Name of series as a string.
         * @param {object}  series Object containing info on series.
         * @alias removeSeries
         * @memberof WebComponents.cq-comparison
         */
        removeSeries(symbol, series) {
            // console.log(typeof symbol, symbol);
            // console.log(typeof series, series);
            this.context.stx.removeSeries(symbol);
        }
    
        /**
         * Picks a color to display the new comparison as.
         * Loops through preset colors and picks the next one on the list.
         * If the all colors are taken then the last color will be repeated.
         * @alias pickSwatchColor
         * @memberof WebComponents.cq-comparison
         */
        pickSwatchColor() {
            let node = $(this);
            let stx = this.context.stx;
            let swatch = node.find('cq-swatch');
            if (!swatch.length) return;
            let currentColor = swatch[0].style.backgroundColor;
    
            let usedColors = {};
            for (let s in stx.chart.series) {
                let series = stx.chart.series[s];
                if (!series.parameters.isComparison) continue;
                usedColors[series.parameters.color] = true;
            }
    
            if (currentColor !== '' && !usedColors[currentColor]) return; // Currently picked color not in use then allow it
            for (let i = 0; i < this.swatchColors.length; i++) { // find first unused color from available colors
                if (!usedColors[this.swatchColors[i]]) {
                    swatch[0].style.backgroundColor = this.swatchColors[i];
                    return;
                }
            }
            // Uh oh, all colors take. Last color will keep getting used.
        }
    
        /**
         * The legend gets re-rendered whenever we createDataSet() (wherein the series may have changed).
         * We re-render the entire thing each time, but we use a virtual DOM to determine whether
         * to actually change anything on the screen (so as to avoid unnecessary flickering)
         * @alias renderLegend
         * @memberof WebComponents.cq-comparison
         */
        renderLegend() {
            let node = $(this);
            let key = node.find('cq-comparison-key').cqvirtual();
            let stx = this.context.stx;
            let q = stx.currentQuote();
            for (let s in stx.chart.series) {
                let series = stx.chart.series[s];
                if (!series.parameters.isComparison) continue;
                let frag = CIQ.UI.makeFromTemplate(this.template);
                let swatch = frag.find('cq-comparison-swatch');
                let label = frag.find('cq-comparison-label');
                let description = frag.find('cq-comparison-description');
                let price = frag.find('cq-comparison-price');
                let loader = frag.find('cq-comparison-loader');
                let btn = frag.find('.ciq-close');
                swatch.css({
                    'background-color': series.parameters.color,
                });
                label.text(stx.translateIf(series.display));
                description.text(stx.translateIf(series.description));
                frag.attr('cq-symbol', s);
    
                let symbol = series.parameters.symbol;
                if (price.length && q) {
                    price.text(stx.padOutPrice(q[symbol]));
                }
    
                if (this.loading[series.parameters.symbolObject.symbol]) loader.addClass('stx-show');
                else loader.removeClass('stx-show');
                if (series.parameters.error) frag.attr('cq-error', true);
                if (series.parameters.permanent) btn.hide();
                else {
                    btn.stxtap(function (self, s, series) {
                        return function () {
                            self.nomore = true;
                            self.removeSeries(s, series);
                            self.modalEnd(); // tricky, we miss mouseout events when we remove items from under ourselves
                        };
                    }(this, s, series));
                }
                key.append(frag);
            }
            key.cqrender();
            this.pickSwatchColor();
        }
    
        /**
         * Loops thru `stxx.chart.series` to update the current price of all comparisons.
         * @alias updatePrices
         * @memberof WebComponents.cq-comparison
         */
        updatePrices() {
            let key; // lazy eval this to prevent jquery work when no comparisons exist
            let stx = this.context.stx;
            let q = stx.currentQuote();
            if (q) {
                for (let s in stx.chart.series) {
                    if (!key) key = this.node.find('cq-comparison-key');
                    let price = key.find(`cq-comparison-item[cq-symbol="${s}"] cq-comparison-price`);
                    if (price.length) {
                        let oldPrice = parseFloat(price.text());
                        let symbol = stx.chart.series[s].parameters.symbol;
                        let newPrice = q[symbol];
                        if (!newPrice) newPrice = stx.chart.series[s].lastQuote;
                        price.text(stx.padOutPrice(newPrice));
                        if (typeof (price.attr('cq-animate')) !== 'undefined') {
                            CIQ.UI.animatePrice(price, newPrice, oldPrice);
                        }
                    }
                }
            }
        }
    
        /**
         * Adds an injection to the ChartEngine that tracks the price of Comparisons.
         * @param {number} updatePrices
         * @alias startPriceTracker
         * @memberof WebComponents.cq-comparison
         */
        startPriceTracker(updatePrices) {
            let self = this;
            this.addInjection('append', 'createDataSet', function () {
                if (updatePrices) self.updatePrices();
                if (this.chart.dataSet && this.chart.dataSet.length) self.node.attrBetter('cq-show');
                else self.node.removeAttrBetter('cq-show');
            });
        }
    
        position() {
            let stx = this.context.stx;
            let bar = stx.barFromPixel(stx.cx);
            this.tick = stx.tickFromPixel(stx.cx);
            let prices = stx.chart.xaxis[bar];
            let self = this;
    
            function printValues() {
                let key;
                self.timeout = null;
                for (let s in stx.chart.series) {
                    if (!key) key = self.node.find('cq-comparison-key');
                    let price = key.find(`cq-comparison-item[cq-symbol="${s}"] cq-comparison-tick-price`);
                    price.textBetter('');
                    if (price.length && prices && prices.data) {
                        let symbol = stx.chart.series[s].parameters.symbol;
                        price.textBetter(stx.padOutPrice(prices.data[symbol]));
                    }
                }
            }
            if (this.tick !== this.prevTick) {
                if (this.timeout) clearTimeout(this.timeout);
                let ms = 0; // IE and FF struggle to keep up with the dynamic head's up.
                this.timeout = setTimeout(printValues, ms);
            }
            this.prevTick = this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
        }
    
        startTickPriceTracker() {
            this.prevTick = null;
            this.addInjection('prepend', 'headsUpHR', (function (self) {
                return function () {
                    self.position();
                };
            }(this)));
        }
    
        setContext(context) {
            let chart = this.context.stx.chart;
            this.node.attr('cq-show', 'true');
            // if attribute cq-marker then detach and put ourselves in the chart holder
            this.configureUI();
            let self = this;
            CIQ.UI.observe({
                obj: chart.series,
                action: 'callback',
                value() {
                    self.renderLegend();
                },
            });
            let frag = CIQ.UI.makeFromTemplate(this.template);
            this.startPriceTracker(frag.find('cq-comparison-price').length);
            if (frag.find('cq-comparison-tick-price')) {
                this.startTickPriceTracker();
            }
        }
    
        /**
         * Fires whenever a new security is added as a comparison.
         * Handles all the necessary events to update the chart with the new comparison.
         * @param {object} context `CIQ.UI.Context` The context of the chart.
         * @param {object} obj The object holding info on a security.
         * @alias selectItem
         * @memberof WebComponents.cq-comparison
         */
        selectItem(context, obj) {
            let self = this;
    
            function cb(err, series) {
                if (err) {
                    series.parameters.error = true;
                }
                self.loading[series.parameters.symbolObject.symbol] = false;
                self.renderLegend();
            }
            let swatch = this.node.find('cq-swatch');
            let color = 'auto',
                pattern = null,
                width = 1;
            if (swatch[0]) {
                let style = swatch[0].style;
                color = style.backgroundColor;
                // TODO: need a UI to grab pattern and width from, for now use the existing swatch
                pattern = style.borderTopStyle;
                width = style.width;
            }
            let stx = context.stx;
            this.loading[obj.symbol] = true;
            let params = {
                symbolObject: obj,
                isComparison: true,
                color,
                pattern,
                width,
                data: {
                    useDefaultQuoteFeed: true,
                },
                forceData: true,
            };
    
            // don't allow symbol if same as main chart, comparison already exists, or just white space
            let exists = stx.getSeries({
                symbolObject: obj,
            });
            for (let i = 0; i < exists.length; i++) {
                if (exists[i].parameters.isComparison) return;
            }
    
            // don't allow symbol if same as main chart or just white space
            if (context.stx.chart.symbol.toLowerCase() !== obj.symbol.toLowerCase() &&
                obj.symbol.trim().length > 0) {
                stx.addSeries(obj.symbol, params, cb);
            }
        }
    
        /**
         * Initializes all the children UI elements that make up `<cq-comparison>`.
         * @alias configureUI
         * @memberof WebComponents.cq-comparison
         */
        configureUI() {
            let node = this.node;
            let addNew = node.find('cq-accept-btn');
            this.template = node.find('*[cq-comparison-item]');
            let swatchColors = node.find('cq-swatch').attr('cq-colors');
            if (swatchColors) this.swatchColors = swatchColors.split(',');
            for (let i = 0; i < this.swatchColors.length; i++) {
                this.swatchColors[i] = CIQ.convertToNativeColor(this.swatchColors[i]);
            }
            let lookup = node.find('cq-lookup');
            if (lookup.length) {
                lookup[0].setCallback(function (self) {
                    return function () {
                        self.selectItem(...arguments);
                    };
                }(this));
            }
            addNew.stxtap((e) => {
                lookup[0].forceInput();
                e.stopPropagation();
            });
            let input = node.find('input');
            input.stxtap(function () {
                this.focus();
            });
        }
    }
    
    
    document.registerElement('cq-comparison', Comparison);
    export default Comparison;
    