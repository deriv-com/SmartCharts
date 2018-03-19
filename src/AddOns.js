// TODO => Move to es6
import CIQ from 'chartiq';
import $ from 'jquery';
//-------------------------------------------------------------------------------------------
// Copyright 2012-2016 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------

/**
 * Use this constructor to initialize visualization styles of extended hours by the use of shading and delimitation lines.
 *
 * Requires `addOns.js`
 *
 * This visualization will only work if data for the corresponding sessions is provided from your quote feed and the market definitions have the corresponding entries.
 * See {@link CIQ.Market} for details on how to define extended (non-default) hours.
 *
 * By default all sessions are disabled unless explicitly enabled using {@link CIQ.ExtendedHours.prepare} or {@link CIQ.ExtendedHours.set}.
 *
 * All possible market sessions needed to be shaded at any given time should be enabled at once with this method.
 *
 * Your fetch should load the required data based on the `params.stx.layout.extended` and `params.stx.layout.marketSessions` settings.
 * Remember that setting `params.filter` to true, performs a filter of masterData when {@link CIQ.ExtendedHours.set} is invoked,
 * rather than calling {@link CIQ.ChartEngine#newChart} to reload the data from the server
 * every time you enable or disable this feature. So you must always return all sessions on your fetch responses.
 *
 *CSS info:
 * - The styles for the shading of each session is determined by the corresponding CSS class in the form of "stx_market_session."+session_name (Example: `stx_market_session.pre`)
 * - The divider line is determined by the CSS class "stx_market_session.divider".
 *
 * ** Important:** This module must be initialized before {@link CIQ.ChartEngine#importLayout} or the sessions will not be able to be restored.
 *
 * Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/g2vvww67/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * @param {object} params The constructor parameters
 * @param {CIQ.ChartEngine} [params.stx] The chart object
 * @param {boolean} [params.filter] Setting to true performs a filter of masterData when {@link CIQ.ExtendedHours.set} is invoked, rather than calling {@link CIQ.ChartEngine#newChart} to reload the data from the server.
 * @constructor
 * @name  CIQ.ExtendedHours
 * @example
 * // Call this only once to initialize the market sessions display manager.
 new CIQ.ExtendedHours({stx:stxx, filter:true});

 // By default all sessions are disabled unless explicitly enabled.
 // This forces the extended hours sessions ["pre","post"] to be enabled when the chart is initially loaded.
 stxx.extendedHours.prepare(true);

 //Now display your chart
 stxx.newChart(stxx.chart.symbol, null, null, function(){});

 * @example
 // once your chart is displayed, you can call this from any UI interface to turn on extended hours.
 stx.extendedHours.set(true);

 // or call this from any UI interface to turn off extended hours.
 stx.extendedHours.set(false);

 * @example
 *    // CSS entries for a session divider and sessions named "pre" and "post"
 .stx_market_session.divider {
			background-color: rgba(0,255,0,0.8);
			width: 1px;
		}
 .stx_market_session.pre {
			background-color: rgba(255,255,0,0.1);
		}
 .stx_market_session.post {
			background-color: rgba(0,0,255,0.2);
		}
 * @since
 * <br>&bull; 06-2016-02
 * <br>&bull; 3.0.0 changed argument to an object to support filter
 * <br>&bull; 3.0.0 no longer necessary to explicitly call new Chart to re-load data. Instead call {@link CIQ.ExtendedHours.set} function.
 * <br>&bull; 5.0.0 no longer necessary to explicitly set `stx.layout.marketSessions` or 1stx.layout.extended` to manage sessions; instead call {@link CIQ.ExtendedHours.prepare} or {@link CIQ.ExtendedHours.set}
 */
CIQ.ExtendedHours = function (params) {
    var stx = params.stx;
    var filter = params.filter;
    if (!stx) { // backwards compatibility
        stx = params;
        filter = false;
    }
    var styles = {};
    this.stx = stx;
    this.stx.extendedHours = this;

    stx.addEventListener('theme', function (tObject) {
        // reinitialize the session colors after a theme change
        styles = {};
        for (var sess in stx.layout.marketSessions) {
            if (!styles.session) {styles.session = {};}
            styles.session[sess] = stx.canvasStyle(`stx_market_session ${sess}`);
        }
    });

    /**
     * Prepares the extended hours settings and classes for the session names enumerated in the arguments without actually displaying or loading the data.
     *
     * This method can be used to force a particular session to load by default by calling it before {@link CIQ.ChartEngine#newChart}.
     * Otherwise the chart will be loaded with all sessions disabled until {@link CIQ.ExtendedHours.set} is invoked.
     *
     * {@link CIQ.ChartEngine#importLayout} will also call this method to ensure the sessions are restored as previously saved.
     *
     * @param  {boolean} enable Set to turn on/off the extended-hours visualization.
     * @param  {array} sessions The sessions to visualize when enable is true.  Any sessions previously visualized will be disabled.  If set to null, will default to ["pre","post"].
     * @memberof CIQ.ExtendedHours
     * @method prepare
     * @since 5.0.0
     */
    this.prepare = function (enable, sessions) {
        stx.layout.extended = enable;
        for (var sess in stx.layout.marketSessions) {
            styles.session = {};
            stx.chart.market.disableSession(sess);
        }
        stx.layout.marketSessions = {};
        if (enable) {
            if (!sessions) {sessions = ['pre', 'post'];}
            if (sessions.length) {
                for (var s = 0; s < sessions.length; s++) {
                    stx.layout.marketSessions[sessions[s]] = true;
                }
            } else {
                stx.layout.marketSessions = sessions;
            }
        }
        for (sess in stx.layout.marketSessions) {
            if (!styles.session) {styles.session = {};}
            styles.session[sess] = stx.canvasStyle(`stx_market_session ${sess}`);
            stx.chart.market.disableSession(sess, true);
        }
    };


    /**
     * gathers and renders the extended hours for the preset session names enumerated in prepare().
     * @param  {function} cb Optional callback function to be invoked once chart is reloaded with extended hours data.
     * @memberof CIQ.ExtendedHours
     * @method complete
     * @private
     * @since 5.0.0
     */
    this.complete = function (cb) {
        stx.changeOccurred('layout');
        if (!stx.chart.market.market_def) {
            // possibly a 24 hours Market. Not necessarily an error but nothing to do for ExtendedHours
            if (cb) {cb();}
            return;
        }
        if (filter) {
            stx.createDataSet();
            stx.draw();
            if (cb) {cb();}
        } else {
            stx.newChart(stx.chart.symbol, null, null, cb);
        }
    };

    /**
     * Turns on or off extended hours for the session names enumerated in the arguments.
     * @param  {boolean} enable Set to turn on/off the extended-hours visualization.
     * @param  {array} sessions The sessions to visualize when enable is true.  Any sessions previously visualized will be disabled.  If set to null, will default to ["pre","post"].
     * @param  {function} cb Optional callback function to be invoked once chart is reloaded with extended hours data.
     * @memberof CIQ.ExtendedHours
     * @method set
     */
    this.set = function (enable, sessions, cb) {
        this.prepare(enable, sessions);
        this.complete(cb);
    };

    this.stx.append('createYAxis', function (panel) {
        if (!this.layout.extended) {return;}
        var chart = panel.chart;
        if (CIQ.ChartEngine.isDailyInterval(this.layout.interval)) {return;}
        styles.divider = this.canvasStyle('stx_market_session divider');
        if (styles.session) {
            var m = chart.market;
            var ranges = [];
            var range = {};
            var nextBoundary,
                thisSession;
            for (var i = 0; i < chart.dataSegment.length; i++) {
                var ds = chart.dataSegment[i];
                if (!ds || !ds.DT) {continue;}
                var c = null;
                if (m.market_def) {
                    if (!nextBoundary || nextBoundary <= ds.DT) {
                        thisSession = m.getSession(ds.DT, this.dataZone);
                        var filterSession = (thisSession !== '' && (!this.layout.marketSessions || !this.layout.marketSessions[thisSession]));
                        nextBoundary = m[filterSession ? 'getNextOpen' : 'getNextClose'](ds.DT, this.dataZone, this.dataZone);
                    }
                }

                var s = styles.session[thisSession];
                if (s) {c = s.backgroundColor;}
                if (range.color && range.color != c) {
                    ranges.push({
                        start: range.start,
                        end: range.end,
                        color: range.color
                    });
                    range = {};
                }
                if (c) {
                    var cw = this.layout.candleWidth;
                    if (ds.candleWidth) {cw = ds.candleWidth;}
                    range.end = this.pixelFromBar(i, chart) + cw / 2;
                    if (!range.start && range.start !== 0) {range.start = range.end - cw + 1;}
                    range.color = c;
                } else {
                    range = {};
                }
            }
            if (range.start || range.start === 0) {
                ranges.push({
                    start: range.start,
                    end: range.end,
                    color: range.color
                });
            }
            var noDashes = CIQ.isTransparent(styles.divider.backgroundColor);
            var dividerLineWidth = styles.divider.width.replace(/px/g, '');
            for (var p in this.panels) {
                var thisPanel = this.panels[p];
                if (thisPanel.shareChartXAxis === false) {continue;}
                if (thisPanel.hidden) {continue;}
                this.startClip(p);
                for (i = 0; i < ranges.length; i++) {
                    chart.context.fillStyle = ranges[i].color;
                    if (!noDashes && ranges[i].start > chart.left) {
                        this.plotLine(ranges[i].start, ranges[i].start, thisPanel.bottom, thisPanel.top, styles.divider.backgroundColor, 'line', chart.context, thisPanel, {
                            pattern: 'dashed',
                            lineWidth: dividerLineWidth
                        });
                    }
                    chart.context.fillRect(ranges[i].start, thisPanel.top, ranges[i].end - ranges[i].start, thisPanel.bottom - thisPanel.top);
                    if (!noDashes && ranges[i].end < chart.right) {
                        this.plotLine(ranges[i].end, ranges[i].end, thisPanel.bottom, thisPanel.top, styles.divider.backgroundColor, 'line', chart.context, thisPanel, {
                            pattern: 'dashed',
                            lineWidth: dividerLineWidth
                        });
                    }
                }
                this.endClip();
            }
        }
    });
};

/**
 * Add-On that puts the chart into "sleep mode" after a period of inactivity.
 *
 * Requires `addOns.js`
 *
 * In sleep mode, a class "ciq-sleeping" will be added to the body.  This will dim out the chart.
 * Sleep mode is ended when interaction with the chart is detected.
 *
 * @param {object} params Configuration parameters
 * @param {CIQ.ChartEngine} [params.stx] The chart object
 * @param {number} [params.minutes] Inactivity period in _minutes_.  Set to 0 to disable the sleep mode.
 * @param {number} [params.interval] Sleeping quote update interval in _seconds_.  During sleep mode, this is used for the update loop.
 *                                    Set to non-zero positive number or defaults to 60.
 * @param {function} [params.wakeCB] Optional callback function after waking
 * @param {function} [params.sleepCB] Optional callback function after sleeping
 * @constructor
 * @name  CIQ.InactivityTimer
 * @since 3.0.0
 * @example
 *    new CIQ.InactivityTimer({stx:stxx, minutes:30, interval:15});  //30 minutes of inactivity will put chart into sleep mode, updating every 15 seconds
 *
 */
CIQ.InactivityTimer = function (params) {
    if (!params.minutes) {return;}
    if (!params.interval || params.interval < 0) {params.interval = 60;}
    this.stx = params.stx;
    this.timeout = params.minutes;
    this.interval = params.interval;
    this.wakeCB = params.wakeCB;
    this.sleepCB = params.sleepCB;
    this.sleepTimer = null;
    this.sleeping = false;
    this.last = new Date().getTime();
    this.wakeChart = function () {
        window.clearTimeout(this.sleepTimer);
        this.last = new Date().getTime();
        if (this.sleeping) {
            if (this.stx.quoteDriver) {this.stx.quoteDriver.updateChartLoop();}
            this.sleeping = false;
            CIQ.unappendClassName(document.body, 'ciq-sleeping');
        }
        this.sleepTimer = window.setTimeout(this.sleepChart.bind(this), this.timeout * 60000);
        if (this.wakeCB) {wakeCB();}
    };
    this.sleepChart = function () {
        if (!this.sleeping) {
            if (this.stx.quoteDriver) {this.stx.quoteDriver.updateChartLoop(this.interval);}
            this.sleeping = true;
            CIQ.appendClassName(document.body, 'ciq-sleeping');
        }
        if (this.sleepCB) {sleepCB();}
    };
    $(document)
        .on(
            'mousemove mousedown touchstart touchmove pointerdown pointermove keydown wheel',
            $('body'),
            function (self) {
                return function (e) {
                    self.wakeChart();
                };
            }(this)
        );
    this.wakeChart();
};


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
 * Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/q1qdp8yj/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
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
    var params = {
        stayPut: false,
        ticksFromEdgeOfScreen: 5,
        granularity: 1000000
    };
    animationParameters = CIQ.extend(params, animationParameters);

    if (params.tension) {stx.chart.tension = animationParameters.tension;}
    stx.tickAnimator = easeMachine || new CIQ.EaseMachine(Math.easeOutCubic, 1000);
    var scrollAnimator = new CIQ.EaseMachine(Math.easeInOutCubic, 1000);

    var flashingColors = ['#0298d3', '#19bcfc', '#5dcffc', '#9ee3ff'];
    var flashingColorIndex = 0;
    var flashingColorThrottle = 20;
    var flashingColorThrottleCounter = 0;

    var filterSession = false;
    var nextBoundary = null;

    function initMarketSessionFlags() {
        filterSession = false;
        nextBoundary = null;
    }

    stx.addEventListener(['symbolChange', 'layout'], function (obj) {
        initMarketSessionFlags();
    });

    stx.prepend('updateChartData', function (appendQuotes, chart, params) {
        var self = this;
        if (!chart) {
            chart = self.chart;
        }
        if (!chart || !chart.defaultChartStyleConfig || chart.defaultChartStyleConfig == 'none') {return;}
        if (params && params.animationEntry) {return;}

        function completeLastBar(value) {
            for (var md = chart.masterData.length - 1; md >= 0; md--) {
                var bar = chart.masterData[md];
                if (bar.Close || bar.Close === 0) {
                    bar.Close = value;
                    return;
                }
            }
        }

        function unanimateScroll() {
            if (chart.animatingHorizontalScroll) {
                chart.animatingHorizontalScroll = false;
                self.micropixels = self.nextMicroPixels = self.previousMicroPixels; // <-- Reset self.nextMicroPixels here
                chart.lastTickOffset = 0;
            }
            if (chart.closePendingAnimation !== null) {
                completeLastBar(chart.closePendingAnimation);
                chart.closePendingAnimation = null;
            }
        }

        var tickAnimator = self.tickAnimator;
        // These chart types are the only types supported by animation
        var supportedChartType = this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation;
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
        var newParams = CIQ.clone(params);
        if (!newParams) {newParams = {};}
        newParams.animationEntry = true;
        newParams.bypassGovernor = true;
        newParams.noCreateDataSet = false;
        //newParams.allowReplaceOHL = true;
        newParams.firstLoop = true;
        var symbol = this.chart.symbol;
        var period = this.layout.periodicity;
        var interval = this.layout.interval;
        var timeUnit = this.layout.timeUnit;

        function cb(quote, prevQuote, chartJustAdvanced) {
            return function (newData) {
                var newClose = newData.Close;
                if (!chart.dataSet.length || symbol != chart.symbol || period != self.layout.periodicity || interval != self.layout.interval || timeUnit != self.layout.timeUnit) {
                    //console.log ("---- STOP animating: Old",symbol,' New : ',chart.symbol, Date())
                    tickAnimator.stop();
                    unanimateScroll();
                    return; // changed symbols mid animation
                }
                var q = CIQ.clone(quote);
                q.Close = Math.round(newClose * animationParameters.granularity) / animationParameters.granularity; //<<------ IMPORTANT! Use 1000000 for small price increments, otherwise animation will be in increments of .0001
                //q.Close = Math.round(newClose*chart.roundit)/chart.roundit; // to ensure decimal points don't go out too far for interim values
                if (chartJustAdvanced) {
                    if (!q.Open && q.Open !== 0) {q.Open = q.Close;}
                    if (!q.High && q.High !== 0) {q.High = Math.max(q.Open, q.Close);}
                    if (!q.Low && q.Low !== 0) {q.Low = Math.min(q.Open, q.Close);}
                } else {
                    if (quote.Close > prevQuote.High) {q.High = q.Close;}
                    if (quote.Close < prevQuote.Low) {q.Low = q.Close;}
                }
                if (chart.animatingHorizontalScroll) {
                    self.micropixels = newData.micropixels;
                    chart.lastTickOffset = newData.lineOffset;
                }
                newParams.updateDataSegmentInPlace = !tickAnimator.hasCompleted;
                //console.log("animating: Old",symbol,' New : ',chart.symbol);
                self.updateChartData([q], chart, newParams);
                newParams.firstLoop = false;
                if (tickAnimator.hasCompleted) {
                    //console.log( 'animator has completed') ;
                    //self.pendingScrollAdvance=false;
                    //var possibleYAxisChange = chart.animatingHorizontalScroll;
                    unanimateScroll();
                    /*if (possibleYAxisChange) { // <---- Logic no longer necessary
                     // After completion, one more draw for good measure in case our
                     // displayed high and low have changed, which would trigger
                     // the y-axis animation
                     setTimeout(function(){
                     self.draw();
                     }, 0);
                     }*/
                }
            };
        }

        if (supportedChartType) {
            var quote = appendQuotes[appendQuotes.length - 1];
            this.prevQuote = this.currentQuote(); // <---- prevQuote logic has been changed to prevent forward/back jitter when more than one tick comes in between animations
            var chartJustAdvanced = false; // When advancing, we need special logic to deal with the open
            if (period == 1 && appendQuotes.length == 2) { // Don't do this if consolidating
                this.prevQuote = appendQuotes[0];
                completeLastBar(this.prevQuote.Close);
                appendQuotes.splice(1, 1);
            }
            if (!quote || !this.prevQuote) {return false;}

            var dataZone = this.dataZone;
            if (this.extendedHours && chart.market.market_def) {
                // Filter out unwanted sessions
                var dtToFilter = quote.DT;
                if (CIQ.ChartEngine.isDailyInterval(interval)) {
                    filterSession = !chart.market.isMarketDate(dtToFilter);
                } else if (!nextBoundary || nextBoundary <= dtToFilter) {
                    var session = chart.market.getSession(dtToFilter, dataZone);
                    filterSession = (session !== '' && (!this.layout.marketSessions || !this.layout.marketSessions[session]));
                    nextBoundary = chart.market[filterSession ? 'getNextOpen' : 'getNextClose'](dtToFilter, dataZone, dataZone);
                }
                if (filterSession) {
                    this.draw();
                    return false;
                }
            }

            var barSpan = period;
            if (interval == 'second' || timeUnit == 'second') {
                barSpan *= 1000;
            } else if (interval == 'minute' || timeUnit == 'minute') {barSpan *= 60000;}
            if (!isNaN(interval)) {barSpan *= interval;}
            if (interval == 'day' || timeUnit == 'day') {
                chartJustAdvanced = quote.DT.getDate() != this.prevQuote.DT.getDate();
            } else if (interval == 'week' || timeUnit == 'week') {
                chartJustAdvanced = quote.DT.getDate() >= this.prevQuote.DT.getDate() + 7;
            } else if (interval == 'month' || timeUnit == 'month') {
                chartJustAdvanced = quote.DT.getMonth() != this.prevQuote.DT.getMonth();
            } else {
                chartJustAdvanced = quote.DT.getTime() >= this.prevQuote.DT.getTime() + barSpan;
            }

            var linearChart = (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) && !this.standaloneBars[this.layout.chartType];

            var beginningOffset = 0;
            if (chartJustAdvanced) {
                if (this.animations.zoom.hasCompleted) {
                    var candleWidth = this.layout.candleWidth;
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
            var start = (chartJustAdvanced && !linearChart) ? quote.Open : this.prevQuote.Close;
            tickAnimator.run(cb(quote, CIQ.clone(this.prevQuote), chartJustAdvanced), {
                'Close': start,
                'micropixels': this.nextMicroPixels,
                'lineOffset': beginningOffset
            }, {
                'Close': quote.Close,
                'micropixels': this.micropixels,
                'lineOffset': 0
            });
            return true; // bypass default behavior in favor of animation
        }
    });

    stx.append('draw', function () {
        if (filterSession) {return;}
        if (this.chart.dataSet && this.chart.dataSet.length && this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation) {
            if (flashingColorThrottleCounter % flashingColorThrottle === 0) {
                flashingColorIndex++;
                flashingColorThrottleCounter = 0;
            }
            flashingColorThrottleCounter++;

            var context = this.chart.context;
            var panel = this.chart.panel;
            var currentQuote = this.currentQuote();
            if (!currentQuote) {return;}
            var price = currentQuote.Close;
            var x = this.pixelFromTick(currentQuote.tick, this.chart);
            if (this.chart.lastTickOffset) {x = x + this.chart.lastTickOffset;}
            var y = this.pixelFromPrice(price, panel);
            if (this.chart.yAxis.left > x &&
                this.chart.yAxis.top <= y &&
                this.chart.yAxis.bottom >= y) {
                if (flashingColorIndex >= flashingColors.length) {flashingColorIndex = 0;}
                context.beginPath();
                context.moveTo(x, y);
                context.arc(x, y, 2 + flashingColorIndex * 1.07, 0, Math.PI * 2, false);
                context.fillStyle = flashingColors[flashingColorIndex];
                context.fill();
            }
        }
    });
};


/**
 * Add-On that puts a range slider under the chart. This allows the datasegment to be selectable as a portion of the dataset.
 *
 * Requires `addOns.js`
 *
 * Once instantiated, use the slider `display(true/false)` function to add it or remove it from the chart. See example.
 *
 * If using chatIQ webComponents, it needs to be created before the UI manager (startUI) is called for custom themes to apply.
 *
 * Visual Reference:<br>
 * ![rangeSlider](img-rangeSlider.png "rangeSlider")
 *
 * @param {object} params Configuration parameters
 * @param {CIQ.ChartEngine} [params.stx] The chart object
 * @param {number} [params.height=95] Height of range slider panel
 * @param {number} [params.chartContainer=$("#chartContainer")] jquery handle to the main chart container
 * @constructor
 * @name  CIQ.RangeSlider
 * @since 4.0.0
 * @example
 *  // instantiate a range slider
 *    new CIQ.RangeSlider({stx:stxx,height:95,chartContainer:$("#chartContainer")});
 *
 *  // display the slider
 *    stxx.slider.display(true);
 *
 *  // hide the slider
 *    stxx.slider.display(false);
 */
CIQ.RangeSlider = function (params) {
    var stx = params.stx;
    stx.slider = this;
    var sliderHeight = params.height ? params.height : 95;
    var chartContainer = params.chartContainer ? $(params.chartContainer) : $(params.stx.container);

    var ciqSlider = $('<div class="ciq-slider"></div>');
    var sliderContainer = $('<div class="chartContainer" id="sliderContainer"></div>');
    ciqSlider.insertAfter(chartContainer.parent())
        .append(sliderContainer);
    ciqSlider.css('height', `${sliderHeight}px`)
        .css('padding-top', '5px')
        .hide();
    sliderContainer.css('height', `${ciqSlider.height()}px`);
    sliderContainer.prop('dimensionlessCanvas', true);
    var self = this.slider = new CIQ.ChartEngine({
        container: sliderContainer[0],
        preferences: {
            labels: false,
            whitespace: 0
        }
    });
    self.xaxisHeight = 30;
    self.manageTouchAndMouse = false;
    self.chart.yAxis.drawCurrentPriceLabel = false;
    self.chart.baseline.userLevel = false;
    self.initializeChart();
    var subholder = self.chart.panel.subholder;
    var style = stx.canvasStyle('stx_range_slider shading');

    this.display = function (on) {
        ciqSlider[on ? 'show' : 'hide']();
        stx.resizeChart();
        if (!on) {return;}
        self.resizeChart();
        self.initializeChart();
        self.draw();
        this.drawSlider();
    };
    this.setSymbol = function (symbol) {
        self.chart.symbol = symbol;
        self.adjustPanelPositions();
        self.setMainSeriesRenderer();
        self.resizeChart();
        this.drawSlider();
    };
    this.acceptLayoutChange = function (layout) {
        var doDraw = false;
        if (self.layout.rangeSlider !== layout.rangeSlider) {
            stx.slider.display(layout.rangeSlider);
        }
        var relevantLayoutPropertiesForRedraw = ['chartType', 'aggregationType',
            'periodicity', 'interval', 'timeUnit',
            'chartScale', 'extended', 'marketSessions', 'rangeSlider',
            'kagi', 'range', 'renko', 'priceLines', 'pandf'];
        relevantLayoutPropertiesForRedraw.forEach(function (x) {
            if (!CIQ.equals(self.layout[x], layout[x])) {
                self.layout[x] = layout[x];
                doDraw = true;
            }
        });
        if (!ciqSlider.is(':visible')) {return;}
        if (doDraw) {
            self.setMainSeriesRenderer();
            self.draw();
            this.drawSlider();
        }
    };
    this.copyData = function (chart) {
        //if(!ciqSlider.is(":visible")) return;
        if (!chart.dataSet) {return;}
        var scrollOffset = 0;
        if (stx.quoteDriver && stx.quoteDriver.behavior && stx.quoteDriver.behavior.bufferSize) {
            scrollOffset = stx.quoteDriver.behavior.bufferSize;
        }

        var myChart = self.chart;
        myChart.symbol = chart.symbol;
        myChart.masterData = self.masterData = chart.masterData;
        myChart.dataSet = chart.dataSet;
        myChart.state = chart.state;
        myChart.baseline.defaultLevel = chart.baseline.actualLevel;
        myChart.scroll = myChart.dataSet.length - scrollOffset;
        myChart.maxTicks = myChart.scroll + 1;
        self.layout.candleWidth = chart.width / (myChart.maxTicks + 1);
        self.draw();
        this.drawSlider();
    };
    this.drawSlider = function () {
        if (!stx.chart.dataSet || !stx.chart.dataSet.length) {return;}
        var chartSubholder = stx.chart.panel.subholder,
            ctx = self.chart.context,
            segmentImage = self.chart.segmentImage || [],
            halfCandle = self.layout.candleWidth / 2;
        var left = self.tickLeft = Math.max(stx.tickFromPixel(chartSubholder.offsetLeft), 0);
        var right = self.tickRight = Math.min(left + stx.chart.maxTicks - 2, stx.chart.dataSet.length - 1);
        var pLeft = self.pixelLeft = self.pixelFromTick(left) - (segmentImage[left] ? segmentImage[left].candleWidth / 2 : halfCandle);
        var pRight = self.pixelRight = self.pixelFromTick(right) + (segmentImage[right] ? segmentImage[right].candleWidth / 2 : halfCandle);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(subholder.offsetLeft, subholder.offsetTop, pLeft - subholder.offsetLeft, subholder.offsetHeight);
        ctx.fillRect(subholder.offsetWidth, subholder.offsetTop, pRight - subholder.offsetWidth, subholder.offsetHeight);
        ctx.strokeStyle = style.borderColor;
        ctx.lineWidth = parseInt(style.borderWidth, 10);
        ctx.moveTo(pLeft, subholder.offsetTop);
        ctx.lineTo(pLeft, subholder.offsetTop + subholder.offsetHeight);
        ctx.moveTo(pRight, subholder.offsetTop);
        ctx.lineTo(pRight, subholder.offsetTop + subholder.offsetHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = parseInt(style.width, 10);
        ctx.lineCap = 'round';
        ctx.moveTo(pLeft, subholder.offsetTop + subholder.offsetHeight / 4);
        ctx.lineTo(pLeft, subholder.offsetTop + 3 * subholder.offsetHeight / 4);
        ctx.moveTo(pRight, subholder.offsetTop + subholder.offsetHeight / 4);
        ctx.lineTo(pRight, subholder.offsetTop + 3 * subholder.offsetHeight / 4);
        ctx.stroke();
        ctx.restore();
    };
    stx.addEventListener('layout', function (obj) {
        obj.stx.slider.acceptLayoutChange(obj.stx.layout);
    });
    stx.addEventListener('symbolChange', function (obj) {
        if (obj.action == 'master') {obj.stx.slider.setSymbol(obj.symbol);}
    });
    stx.addEventListener('symbolImport', function (obj) {
        if (obj.action == 'master') {obj.stx.slider.setSymbol(obj.symbol);}
        obj.stx.slider.acceptLayoutChange(obj.stx.layout);
    });
    stx.addEventListener('theme', function (obj) {
        self.clearPixelCache();
        self.styles = {};
        self.chart.container.style.backgroundColor = '';
        var helper = new CIQ.ThemeHelper({ stx: obj.stx });
        helper.params.stx = self;
        helper.update();
    });
    stx.append('createDataSet', function () {
        this.slider.copyData(this.chart);
    });
    stx.append('draw', function () {
        if (!ciqSlider.is(':visible')) {return;}
        if (!self.chart.dataSet) {return;}
        self.chart.baseline.defaultLevel = this.chart.baseline.actualLevel;
        self.draw();
        this.slider.drawSlider();
    });
    stx.prepend('resizeChart', function () {
        var ciqChart = chartContainer.parent();
        var heightOffset = ciqChart.height() - chartContainer.height();
        ciqChart.height(ciqChart.parent()
            .height() - (ciqSlider.is(':visible') ? sliderHeight : 0));
        chartContainer.height(ciqChart.height() - heightOffset);
    });
    $(subholder)
        .on('mousedown touchstart pointerdown', function (e) {
            var start = e.offsetX || e.originalEvent.layerX;
            if (!start && start !== 0) {return;} // wrong event
            var s = $(self);
            s.prop('startDrag', start)
                .prop('startPixelLeft', self.pixelLeft)
                .prop('startPixelRight', self.pixelRight);
            var bw = parseInt(style.borderLeftWidth, 10);
            if (start < self.pixelRight - bw) {s.prop('needsLeft', true);}
            if (start > self.pixelLeft + bw) {s.prop('needsRight', true);}
            if (CIQ.touchDevice) {return;}
            CIQ.appendClassName(e.target, 'stx-drag-chart');
        });
    $(subholder)
        .on('mouseup mouseout touchend pointerup', function (e) {
            CIQ.unappendClassName(e.target, 'stx-drag-chart');
            var s = $(self);
            s.prop('startDrag', null)
                .prop('needsLeft', false)
                .prop('needsRight', false);
        });
    $(subholder)
        .on('mousemove touchmove pointermove', function (e) {
            var s = $(self);
            var startDrag = s.prop('startDrag');
            if (!startDrag && startDrag !== 0) {return;}
            var touches = e.originalEvent.touches;
            var movement = (touches && touches.length) ? touches[0].pageX - e.target.offsetLeft : e.offsetX;
            if (!movement && movement !== 0) {return;} // wrong event
            movement -= startDrag;
            var tickLeft = self.tickLeft,
                tickRight = self.tickRight;
            var startPixelLeft = s.prop('startPixelLeft'),
                startPixelRight = s.prop('startPixelRight');
            var needsLeft = s.prop('needsLeft'),
                needsRight = s.prop('needsRight');
            if (needsLeft) {
                if (startPixelLeft + movement < 0) {movement = -startPixelLeft;}
                tickLeft = self.tickFromPixel(startPixelLeft + movement);
                if (needsRight) {tickRight = self.tickRight + tickLeft - self.tickLeft;}
            }
            else if (needsRight) {
                tickRight = Math.min(self.tickFromPixel(startPixelRight + movement), stx.chart.dataSet.length - 1);
            }
            else {
                return;
            }

            var newCandleWidth = stx.chart.width / (tickRight - tickLeft + 1);
            if (tickRight >= tickLeft && newCandleWidth >= stx.minimumCandleWidth) {
                self.tickLeft = tickLeft;
                self.tickRight = tickRight;
                stx.chart.scroll = stx.chart.dataSet.length - tickLeft;
                if (!needsLeft || !needsRight) {
                    stx.setCandleWidth(newCandleWidth);
                }
                stx.micropixels = 0;
                stx.draw();
            }
        });
    this.copyData(stx.chart);
};
