/* TAKEN OUT OF ADDONS.JS */
/* eslint-disable no-unused-vars,eqeqeq,no-shadow,no-alert,no-restricted-globals,prefer-const,prefer-destructuring */

/**
 * Add-On that animates the chart.
 *
 * Requires `addOns.js`
 *
 * The chart is animated in three ways:
 * 1.  The current price pulsates
 * 2.  The current price appears to move smoothly from the previous price
 * 3.  The chart's y-axis smoothly expands/contracts when a new high or low is reached
 *
 * The following chart types are supported: line, mountain, baseline_delta
 *
 * Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/6fqw652z/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * @param {CIQ.ChartEngine} stx The chart object
 * @param {object} animationParameters Configuration parameters
 * @param {boolean} [animationParameters.stayPut=false] Set to true for last tick to stay in position it was scrolled and have rest of the chart move backwards as new ticks are added instead of having new ticks advance forward and leave the rest of the chart in place.
 * @param {number} [animationParameters.ticksFromEdgeOfScreen=5] Number of ticks from the right edge the chart should stop moving forward so the last tick never goes off screen (only applicable if stayPut=false)
 * @param {number} [animationParameters.granularity=1000000] Set to a value that will give enough granularity for the animation.  The larger the number the smaller the price jump between frames, which is good for charts that need a very slow smooth animation either because the price jumps between ticks are very small, or because the animation was set up to run over a large number of frames when instantiating the CIQ.EaseMachine.
 * @param {number} [animationParameters.tension=null] Splining tension for smooth curves around data points (range 0-1).  Must include splines.js for this to be effective.
 * @param {CIQ.EaseMachine} easeMachine Override the default easeMachine.  Default is `new CIQ.EaseMachine(Math.easeOutCubic, 1000);`
 * @constructor
 * @name  CIQ.Animation
 * @since
 * <br>&bull; 3.0.0 Now part of addOns.js. Previously provided as a standalone animation.js file
 * <br>&bull; 4.0.0 beacon only flashes for line charts. On Candles or bars it is suppressed as it produces an unnatural effect.
 * @example
 *    new CIQ.Animation(stxx, {tension:0.3});  //Default animation with splining tension of 0.3
 *
 */
CIQ.Animation = function (stx, animationParameters, easeMachine) {
    let params = {
        stayPut: false,
        ticksFromEdgeOfScreen: 5,
        granularity: 1000000,
    };
    animationParameters = CIQ.extend(params, animationParameters);

    if (params.tension) stx.chart.tension = animationParameters.tension;
    stx.tickAnimator = easeMachine || new CIQ.EaseMachine(Math.easeOutCubic, 1000);
    let scrollAnimator = new CIQ.EaseMachine(Math.easeInOutCubic, 1000);

    let filterSession = false;
    let nextBoundary = null;

    let currentSpotElement;

    function initMarketSessionFlags() {
        filterSession = false;
        nextBoundary = null;
    }

    stx.addEventListener(['symbolChange', 'layout'], (obj) => {
        initMarketSessionFlags();
    });

    stx.prepend('updateChartData', function (appendQuotes, chart, params) {
        let self = this;
        if (!chart) {
            chart = self.chart;
        }
        if (!chart || !chart.defaultChartStyleConfig || chart.defaultChartStyleConfig == 'none') return;

        if (params !== undefined && params.animationEntry) return;

        function completeLastBar(value) {
            for (let md = chart.masterData.length - 1; md >= 0; md--) {
                let bar = chart.masterData[md];
                if (bar.Close || bar.Close === 0) {
                    bar.Close = value;
                    return;
                }
            }
        }

        function unanimateScroll() {
            if (chart.animatingHorizontalScroll) {
                chart.animatingHorizontalScroll = false;
                self.micropixels = self.nextMicroPixels = self.previousMicroPixels;  // <-- Reset self.nextMicroPixels here
                chart.lastTickOffset = 0;
            }
            if (chart.closePendingAnimation !== null) {
                completeLastBar(chart.closePendingAnimation);
                chart.closePendingAnimation = null;
            }
        }

        let tickAnimator = self.tickAnimator;
        // These chart types are the only types supported by animation
        let supportedChartType = this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation;
        if (supportedChartType) {
            if (!tickAnimator) {
                alert('Animation plug-in can not run because the tickAnimator has not been declared. See instructions in animation.js');
                return;
            }

            // If symbol changes then reset all of our variables
            if (this.prevSymbol != chart.symbol) {
                this.prevQuote = 0;
                chart.closePendingAnimation = null;
                this.prevSymbol = chart.symbol;
            }
            unanimateScroll();
            tickAnimator.stop();
            if (appendQuotes.length > 2) {
                return;
            }
        }
        let newParams = CIQ.clone(params);
        if (!newParams) { newParams = {}; }
        newParams.animationEntry = true;
        newParams.bypassGovernor = true;
        newParams.noCreateDataSet = false;
        // newParams.allowReplaceOHL = true;
        newParams.firstLoop = true;
        let symbol = this.chart.symbol;
        let period = this.layout.periodicity;
        let interval = this.layout.interval;
        let timeUnit = this.layout.timeUnit;

        function cb(quote, prevQuote, chartJustAdvanced) {
            return function (newData) {
                let newClose = newData.Close;
                if (!chart.dataSet.length || symbol != chart.symbol || period != self.layout.periodicity || interval != self.layout.interval || timeUnit != self.layout.timeUnit) {
                    // console.log ("---- STOP animating: Old",symbol,' New : ',chart.symbol, Date())
                    tickAnimator.stop();
                    unanimateScroll();
                    return; // changed symbols mid animation
                }
                let q = CIQ.clone(quote);
                q.Close = Math.round(newClose * animationParameters.granularity) / animationParameters.granularity; // <<------ IMPORTANT! Use 1000000 for small price increments, otherwise animation will be in increments of .0001
                // q.Close = Math.round(newClose*chart.roundit)/chart.roundit; // to ensure decimal points don't go out too far for interim values
                if (chartJustAdvanced) {
                    if (!q.Open && q.Open !== 0) { q.Open = q.Close; }
                    if (!q.High && q.High !== 0) { q.High = Math.max(q.Open, q.Close); }
                    if (!q.Low && q.Low !== 0) { q.Low = Math.min(q.Open, q.Close); }
                } else {
                    if (quote.Close > prevQuote.High) { q.High = q.Close; }
                    if (quote.Close < prevQuote.Low) { q.Low = q.Close; }
                }
                if (chart.animatingHorizontalScroll) {
                    self.micropixels = newData.micropixels;
                    chart.lastTickOffset = newData.lineOffset;
                }
                newParams.updateDataSegmentInPlace = !tickAnimator.hasCompleted;
                // console.log("animating: Old",symbol,' New : ',chart.symbol);
                self.updateChartData([q], chart, newParams);
                newParams.firstLoop = false;
                if (tickAnimator.hasCompleted) {
                    // console.log( 'animator has completed') ;
                    // self.pendingScrollAdvance=false;
                    // var possibleYAxisChange = chart.animatingHorizontalScroll;
                    unanimateScroll();
                    /* if (possibleYAxisChange) { // <---- Logic no longer necessary
                     // After completion, one more draw for good measure in case our
                     // displayed high and low have changed, which would trigger
                     // the y-axis animation
                     setTimeout(function(){
                     self.draw();
                     }, 0);
                     } */
                }
            };
        }

        if (supportedChartType) {
            let quote = appendQuotes[appendQuotes.length - 1];
            this.prevQuote = this.currentQuote();  // <---- prevQuote logic has been changed to prevent forward/back jitter when more than one tick comes in between animations
            let chartJustAdvanced = false; // When advancing, we need special logic to deal with the open
            if (period == 1 && appendQuotes.length == 2) {  // Don't do this if consolidating
                this.prevQuote = appendQuotes[0];
                completeLastBar(this.prevQuote.Close);
                appendQuotes.splice(1, 1);
            }
            if (!quote || !quote.Close || !this.prevQuote || !this.prevQuote.Close) return false;

            if (this.extendedHours && chart.market.market_def) {
                // Filter out unwanted sessions
                let dtToFilter = quote.DT;
                if (CIQ.ChartEngine.isDailyInterval(interval)) {
                    filterSession = !chart.market.isMarketDate(dtToFilter);
                } else if (!nextBoundary || nextBoundary <= dtToFilter) {
                    let session = chart.market.getSession(dtToFilter);
                    filterSession = (session !== '' && (!this.layout.marketSessions || !this.layout.marketSessions[session]));
                    nextBoundary = chart.market[filterSession ? 'getNextOpen' : 'getNextClose'](dtToFilter);
                }
                if (filterSession) {
                    this.draw();
                    return false;
                }
            }

            let barSpan = period;
            if (interval == 'second' || timeUnit == 'second') {
                barSpan *= 1000;
            } else if (interval == 'minute' || timeUnit == 'minute') { barSpan *= 60000; }
            if (!isNaN(interval)) { barSpan *= interval; }
            if (interval == 'day' || timeUnit == 'day') {
                chartJustAdvanced = quote.DT.getDate() != this.prevQuote.DT.getDate();
            } else if (interval == 'week' || timeUnit == 'week') {
                chartJustAdvanced = quote.DT.getDate() >= this.prevQuote.DT.getDate() + 7;
            } else if (interval == 'month' || timeUnit == 'month') {
                chartJustAdvanced = quote.DT.getMonth() != this.prevQuote.DT.getMonth();
            } else {
                chartJustAdvanced = quote.DT.getTime() >= this.prevQuote.DT.getTime() + barSpan;
            }

            let linearChart = (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) && !this.standaloneBars[this.layout.chartType];

            let beginningOffset = 0;
            if (chartJustAdvanced) {
                if (this.animations.zoom.hasCompleted) {
                    let candleWidth = this.layout.candleWidth;
                    if (chart.scroll <= chart.maxTicks) {
                        while (this.micropixels > 0) { // If micropixels is larger than a candle then scroll back further
                            chart.scroll++;
                            this.micropixels -= candleWidth;
                        }
                    }
                    if (chart.scroll <= chart.maxTicks) {
                        this.previousMicroPixels = this.micropixels;
                        this.nextMicroPixels = this.micropixels + candleWidth;
                        beginningOffset = candleWidth * -1;
                        if (chart.dataSegment.length < chart.maxTicks - animationParameters.ticksFromEdgeOfScreen && !animationParameters.stayPut) {
                            this.nextMicroPixels = this.micropixels;
                            chart.scroll++;
                        }
                        chart.animatingHorizontalScroll = linearChart; // When the chart advances we also animate the horizontal scroll by incrementing micropixels
                        chart.previousDataSetLength = chart.dataSet.length;
                    } else {
                        chart.scroll++;
                    }
                } else {
                    return false;
                }
            }
            chart.closePendingAnimation = quote.Close;
            let start = (chartJustAdvanced && !linearChart) ? quote.Open : this.prevQuote.Close;
            tickAnimator.run(cb(quote, CIQ.clone(this.prevQuote), chartJustAdvanced), {
                Close: start,
                micropixels: this.nextMicroPixels,
                lineOffset: beginningOffset,
            }, {
                Close: quote.Close,
                micropixels: this.micropixels,
                lineOffset: 0,
            });
            return true; // bypass default behavior in favor of animation
        }
    });

    stx.append('draw', function () {
        if (filterSession) { return; }
        if (this.chart.dataSet && this.chart.dataSet.length && this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation) {
            let context = this.chart.context;
            let panel = this.chart.panel;
            let currentQuote = this.currentQuote();
            if (!currentQuote) { return; }
            let price = currentQuote.Close;
            let x = this.pixelFromTick(currentQuote.tick, this.chart);
            if (this.chart.lastTickOffset) { x += this.chart.lastTickOffset; }
            let y = this.pixelFromPrice(price, panel);
            if (this.chart.yAxis.left > x &&
                this.chart.yAxis.top <= y &&
                this.chart.yAxis.bottom >= y) {
                if (!currentSpotElement) {
                    currentSpotElement = document.createElement('span');
                    currentSpotElement.className = 'cq-marker-spot';
                    this.chart.panel.holder.parentElement.appendChild(currentSpotElement);
                } else {
                    currentSpotElement.style.top = `${y - 3}px`;
                    currentSpotElement.style.left = `${x - 3}px`;
                }
            }
        }
    });
};

