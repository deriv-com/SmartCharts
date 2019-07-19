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
 * The following chart types are supported: line, mountain, baseline_delta.
 *
 * Chart aggregations such as Kagi, Renko, Range Bars, etc. are not supported.
 *
 * **Animation displays more gracefully when updates are sent into the chart one at a time using {@link CIQ.ChartEngine#updateChartData}
 * instead of in batches using a [QuoteFeed]{@link CIQ.ChartEngine#attachQuoteFeed}. Sending data in batches will produce a ‘jumping’ effect.**
 *
 * By default there will be a flashing beacon created using a canvas circles. If instead you want to use a custom animation beacon, you will be able to extend the functionality yourself as follows:
 * - In js/addOns.js, at the bottom of the CIQ.Animation function, there is an stx.append("draw") function.
 * - Make a copy of this function so you can override the behavior.
 * - In there you will see it determine var x and y, which are the coordinates for the center of the beacon.
 * - At the bottom of this append function, where we draw the beacon by using the Canvas arc() function to draw a circle and then fill() to make the circle solid.
 * - You can replace this circle and fill instructions with an image using [CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Drawing_images) .
 *
 * Animation Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/6fqw652z/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
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


import { calculateGranularity } from '../../utils';

Math.linearTween = function (t, b, c, d) {
    return c * t / d + b;
};

export default function animateChart(stx, animationParameters, easeMachine) {
    let params = {
        stayPut: false,
        ticksFromEdgeOfScreen: 5,
        granularity: 1000000,
    };
    animationParameters = CIQ.extend(params, animationParameters);

    if (params.tension) stx.chart.tension = animationParameters.tension;
    stx.tickAnimator = easeMachine || new CIQ.EaseMachine(Math.easeOutCubic, 1000);

    stx.addEventListener(['symbolChange', 'layout'], function (obj) {
        stx.chart.granularity = calculateGranularity(this.layout.interval, this.layout.timeUnit);

        if (stx.chart.granularity === 0) {
            stx.chart.lockScroll = true;
        } else {
            stx.chart.lockScroll = false;
        }

        if (stx.animations.liveScroll && (stx.animations.liveScroll.running || stx.chart.granularity === 0)) {
            stx.animations.liveScroll.stop();
        }
    });

    stx.prepend('updateCurrentMarketData', function (data, chart, symbol, params) {
        if (!chart) chart = this.chart;
        if (params && params.fromTrade && (chart.closePendingAnimation || chart.closePendingAnimation === 0)) {
            params.finalClose = chart.closePendingAnimation;
        }
    });

    stx.prepend('updateChartData', function (appendQuotes, chart, params) {
        if (this.scrollwheel_is_on) {
            this.scrollwheel_is_on = false;
            return false; // skipt the animation
        }
        const self = this;
        if (!chart) {
            chart = self.chart;
        }
        if (!chart || !chart.defaultChartStyleConfig || chart.defaultChartStyleConfig == 'none') return;

        if (params !== undefined) {
            if (params.animationEntry || params.secondarySeries) return;
        }

        function completeLastBar(record) {
            if (chart.masterData && chart.masterData.length) {
                for (let md = chart.masterData.length - 1; md >= 0; md--) {
                    const bar = chart.masterData[md];
                    if (bar.Close || bar.Close === 0) {
                        bar.Close = record.Close;
                        if (record.LastSize) bar.LastSize = record.LastSize;
                        if (record.LastTime) bar.LastTime = record.LastTime;
                        self.updateCurrentMarketData({ Close:bar.Close, DT:bar.DT, LastSize:bar.LastSize, LastTime:bar.LastTime });
                        self.createDataSet(null, null, { appending:true });
                        return;
                    }
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
                const close = chart.closePendingAnimation;
                chart.closePendingAnimation = null;
                completeLastBar({ Close:close });
            }
        }

        const tickAnimator = self.tickAnimator;
        // These chart types are the only types supported by animation
        const supportedChartType = this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation;
        if (supportedChartType) {
            if (!tickAnimator) {
                console.warn('Animation plug-in can not run because the tickAnimator has not been declared. See instructions in animation.js');
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
        if (!newParams) newParams = {};
        newParams.animationEntry = true;
        newParams.bypassGovernor = true;
        newParams.noCreateDataSet = false;
        // newParams.allowReplaceOHL = true;
        newParams.firstLoop = true;
        const symbol = this.chart.symbol;
        const period = this.layout.periodicity;
        const interval = this.layout.interval;
        const timeUnit = this.layout.timeUnit;

        function cb(quote, prevQuote, chartJustAdvanced) {
            return function (newData) {
                const newClose = newData.Close;
                if (!chart.dataSet.length || symbol != chart.symbol || period != self.layout.periodicity || interval != self.layout.interval || timeUnit != self.layout.timeUnit) {
                    tickAnimator.stop();
                    unanimateScroll();
                    return; // changed symbols mid animation
                }
                const q = CIQ.clone(quote);
                q.Close = Math.round(newClose * animationParameters.granularity) / animationParameters.granularity; // <<------ IMPORTANT! Use 1000000 for small price increments, otherwise animation will be in increments of .0001
                if (chartJustAdvanced) {
                    if (!q.Open && q.Open !== 0) q.Open = q.Close;
                    if (!q.High && q.High !== 0) q.High = Math.max(q.Open, q.Close);
                    if (!q.Low && q.Low !== 0) q.Low = Math.min(q.Open, q.Close);
                } else {
                    if (quote.Close > prevQuote.High) q.High = q.Close;
                    if (quote.Close < prevQuote.Low) q.Low = q.Close;
                }
                newParams.updateDataSegmentInPlace = !tickAnimator.hasCompleted;

                const updateQuotes = [q];
                if (chartJustAdvanced) updateQuotes.unshift(prevQuote);
                self.updateChartData(updateQuotes, chart, newParams);
                newParams.firstLoop = false;
                if (tickAnimator.hasCompleted) {
                    unanimateScroll();
                }
            };
        } /* end function */

        if (supportedChartType) {
            const quote = appendQuotes[appendQuotes.length - 1];
            this.prevQuote = this.currentQuote();  // <---- prevQuote logic has been changed to prevent forward/back jitter when more than one tick comes in between animations
            let chartJustAdvanced = false; // When advancing, we need special logic to deal with the open
            if (period == 1 && appendQuotes.length == 2) {  // Don't do this if consolidating
                this.prevQuote = appendQuotes[0];
                completeLastBar(this.prevQuote);
            }
            if (!quote || !quote.Close || !this.prevQuote || !this.prevQuote.Close) return false;

            let barSpan = period;
            if (interval == 'second' || timeUnit == 'second') barSpan *= 1000;
            else if (interval == 'minute' || timeUnit == 'minute') barSpan *= 60000;
            if (!isNaN(interval)) barSpan *= interval;
            if (interval == 'day' || timeUnit == 'day') chartJustAdvanced = quote.DT.getDate() != this.prevQuote.DT.getDate();
            else if (interval == 'week' || timeUnit == 'week') chartJustAdvanced = quote.DT.getDate() >= this.prevQuote.DT.getDate() + 7;
            else if (interval == 'month' || timeUnit == 'month') chartJustAdvanced = quote.DT.getMonth() != this.prevQuote.DT.getMonth();
            else chartJustAdvanced = quote.DT.getTime() >= this.prevQuote.DT.getTime() + barSpan;

            const linearChart = (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) && !this.standaloneBars[this.layout.chartType];

            let beginningOffset = 0;
            if (chartJustAdvanced) {
                if (!this.animations.zoom.hasCompleted) {
                    return false;
                }
            }
            chart.closePendingAnimation = quote.Close;
            const start = (chartJustAdvanced && !linearChart) ? quote.Open : this.prevQuote.Close;

            tickAnimator.run(cb(quote, CIQ.clone(this.prevQuote), chartJustAdvanced), {
                Close: start,
                micropixels: this.nextMicroPixels,
                lineOffset: beginningOffset,
            }, { Close: quote.Close, micropixels: this.micropixels, lineOffset: 0 });

            return true; // bypass default behavior if the animation is on
        }
    });

    stx.prepend('updateChartData', function (newQuotes) {
        stx.prevQuote = this.currentQuote() || newQuotes[0];
        stx.isNewTick = !this.prevQuote || newQuotes.slice(-1)[0].DT > this.prevQuote.DT;
        stx.chart.granularity = calculateGranularity(this.layout.interval, this.layout.timeUnit);
        stx.chart.lockScroll = !stx.chart.granularity;
    });

    stx.append('updateChartData', function (newQuotes) {
        if (stx.isHome() && !stx.chart.lockAutoScroll && newQuotes && newQuotes.length && stx.isNewTick) {
            const timeInterval = newQuotes.slice(-1)[0].DT - this.prevQuote.DT;

            if (stx.animations.liveScroll) {
                this.chart.scroll--;
                this.micropixels = this.micropixels > 0 ? this.layout.candleWidth - this.micropixels : this.layout.candleWidth + this.micropixels;
            }

            stx.animations.liveScroll = stx.animations.liveScroll || new CIQ.EaseMachine(Math.linearTween, timeInterval + 1000);

            if (stx.animations.liveScroll.running) {
                stx.animations.liveScroll.stop();
            }

            stx.animations.liveScroll.run((bar) => {
                this.micropixels = -bar;
                this.draw();
            }, 0, stx.layout.candleWidth);
        } else if (!stx.isHome() || stx.chart.lockAutoScroll) {
            if (stx.animations.liveScroll) {
                stx.animations.liveScroll.stop();
            }

            if (stx.chart.lockAutoScroll) {
                if (stx.isNewTick && this.chart.entryTick !== null && this.chart.entryTick !== undefined) {
                    const visibleTicks = this.chart.dataSet.length - (this.chart.entryTick || 0) + 1;
                    this.setMaxTicks(visibleTicks + 3);
                } else if (stx.isNewTick) {
                    this.setMaxTicks(this.chart.dataSet.length + (Math.floor(this.chart.dataSet.length / 5) || 2));
                    this.chart.scroll = this.chart.dataSet.length + (Math.floor(this.chart.dataSet.length / 10) || 1);
                }

                this.micropixels = 0;
                this.draw();
            }
        }
    });
}
