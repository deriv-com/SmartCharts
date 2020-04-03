//-------------------------------------------------------------------------------------------
// Copyright 2012-2019 by ChartIQ, Inc.
// All rights reserved
//-------------------------------------------------------------------------------------------
;(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['chartiq/js/chartiq'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('chartiq/js/chartiq'));
	} else {
		factory(root);
	}
})(this, function(_exports) {
	var CIQ = _exports.CIQ;


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
	 * By default, there will be a flashing beacon created using a canvas circle. If instead you want to use a custom animation beacon, you will be able to extend the functionality yourself as follows:
	 * - In js/addOns.js, at the bottom of the CIQ.Animation function, there is an stx.append("draw") function.
	 * - Make a copy of this function so you can override the behavior.
	 * - In there you will see it determine var x and y, which are the coordinates for the center of the beacon.
	 * - At the bottom of this append function, we draw the beacon by using the Canvas arc() function to draw a circle and then fill() to make the circle solid.
	 * - You can replace  the canvas circle with an image using [CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D#Drawing_images) .
	 * - Example:
	 * 
	 *   ```
	 *   var image = document.getElementById('beacon'); // include a hidden image on your HTML
	 *   context.drawImage(image, x-10, y-10, 20, 20); // add the image on the canvas. Offset the x and y values by the radius of the beacon.
	 *   ```

	 *
	 * Animation Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/6fqw652z/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 *
	 * You can disable animation after each different [chart type is activated]{@link CIQ.ChartEngine#setChartType} by calling:
	 * ```
	 * stxx.mainSeriesRenderer.supportsAnimation=false;
	 * ```
	 * Keep in mind that changing to a different chart type, may once again enable animation. You can override this by [adding an event listener]{@link CIQ.ChartEngine#addEventListener} on [layout changes]{@link layoutEventListener}.
	 *
	 * @param {object} params The constructor parameters
	 * @param {CIQ.ChartEngine} params.stx The chart object
	 * @param {object} [params.animationParameters] Configuration parameters
	 * @param {boolean} [params.animationParameters.stayPut=false] Set to true for last tick to stay in position it was scrolled and have rest of the chart move backwards as new ticks are added instead of having new ticks advance forward and leave the rest of the chart in place.
	 * @param {number} [params.animationParameters.ticksFromEdgeOfScreen=5] Number of ticks from the right edge the chart should stop moving forward so the last tick never goes off screen (only applicable if stayPut=false)
	 * @param {number} [params.animationParameters.granularity=1000000] Set to a value that will give enough granularity for the animation.  The larger the number the smaller the price jump between frames, which is good for charts that need a very slow smooth animation either because the price jumps between ticks are very small, or because the animation was set up to run over a large number of frames when instantiating the CIQ.EaseMachine.
	 * @param {number} [params.animationParameters.tension=null] Splining tension for smooth curves around data points (range 0-1).  Must include splines.js for this to be effective.
	 * @param {CIQ.EaseMachine} params.easeMachine Override the default easeMachine.  Default is `new CIQ.EaseMachine(Math.easeOutCubic, 1000);`
	 * @constructor
	 * @name  CIQ.Animation
	 * @since
	 * <br>&bull; 3.0.0 Now part of addOns.js. Previously provided as a standalone animation.js file
	 * <br>&bull; 4.0.0 beacon only flashes for line charts. On Candles or bars it is suppressed as it produces an unnatural effect.
	 * <br>&bull; 7.0.2 Now takes one configuration object as its constructor. Must have a reference to a chart engine
	 * @example
	 * 	new CIQ.Animation({stx: stxx, animationParameters: {tension:0.3}});  //Default animation with splining tension of 0.3
	 *
	 */
	CIQ.Animation=function(config){
		if(!config) throw new Error("Invalid constructor arguments.");
		var stx, animationParameters, easeMachine;
		if (config instanceof CIQ.ChartEngine) { // legacy constructor
			stx=arguments[0];
			animationParameters=arguments[1];
			easeMachine=arguments[2];
		}
		else {
			stx=config.stx;
			animationParameters=config.animationParameters;
			easeMachine=config.easeMachine;
		}
		if (!stx) return console.warn("No CIQ.ChartEngine provided. Cannot properly create CIQ.Animation instance");
		var params={
			stayPut:false,
			ticksFromEdgeOfScreen:5,
			granularity:1000000
		};
		animationParameters=CIQ.extend(params,animationParameters);

		if(params.tension) stx.chart.tension=animationParameters.tension;
		stx.tickAnimator=easeMachine || new CIQ.EaseMachine(Math.easeOutCubic, 1000);
		var scrollAnimator = new CIQ.EaseMachine(Math.easeInOutCubic, 1000);

		var flashingColors=['#0298d3','#19bcfc','#5dcffc','#9ee3ff'];
		var flashingColorIndex=0;
		var flashingColorThrottle=20;
		var flashingColorThrottleCounter=0;

		var filterSession=false;
		var nextBoundary=null;

		function initMarketSessionFlags(){
			filterSession=false;
			nextBoundary=null;
		}

		stx.addEventListener(["symbolChange","layout"],function(obj){
			initMarketSessionFlags();
		});

		stx.prepend("updateCurrentMarketData", function(data, chart, symbol, params) {
			if(!chart) chart=this.chart;
			if(params && params.fromTrade && (chart.closePendingAnimation || chart.closePendingAnimation===0)){
				params.finalClose=chart.closePendingAnimation;
			}
		});

		stx.prepend("updateChartData", function(appendQuotes, chart, params) {
		    var self=this;
		    if (!chart) {
		        chart = self.chart;
		    }
			if (!chart || !chart.defaultChartStyleConfig || chart.defaultChartStyleConfig=="none") return;

			if (params !== undefined){
				if(params.animationEntry || params.secondarySeries) return;
			}

			function completeLastBar(record){
				if(!chart.masterData) return;
				for(var md=chart.masterData.length-1;md>=0;md--){
					var bar=chart.masterData[md];
					if(bar.Close || bar.Close===0){
						bar.Close = record.Close;
						if(record.LastSize) bar.LastSize = record.LastSize;
						if(record.LastTime) bar.LastTime = record.LastTime;
						self.updateCurrentMarketData({Close:bar.Close, DT:bar.DT, LastSize:bar.LastSize, LastTime:bar.LastTime});
						self.createDataSet(null,null,{appending:true});
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
				if (chart.closePendingAnimation!==null) {
					var close=chart.closePendingAnimation;
					chart.closePendingAnimation = null;
					completeLastBar({Close:close});
				}
			}
			var tickAnimator = self.tickAnimator;
			// These chart types are the only types supported by animation
			var supportedChartType=this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation;
			if(supportedChartType){
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
			var newParams = CIQ.clone(params);
			if (!newParams) newParams = {};
			newParams.animationEntry = true;
			newParams.bypassGovernor = true;
			newParams.noCreateDataSet = false;
			newParams.appending = true;
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
					q.Adj_Close = null;  // Don't use this, it will mess up our calculated close
					q.Close = Math.round(newClose * animationParameters.granularity) / animationParameters.granularity; //<<------ IMPORTANT! Use 1000000 for small price increments, otherwise animation will be in increments of .0001
					//q.Close = Math.round(newClose*chart.roundit)/chart.roundit; // to ensure decimal points don't go out too far for interim values
					if (chartJustAdvanced) {
						if (!q.Open && q.Open !== 0) q.Open = q.Close;
						if (!q.High && q.High !== 0) q.High = Math.max(q.Open,q.Close);
						if (!q.Low && q.Low !== 0) q.Low = Math.min(q.Open,q.Close);
					}else{
						if (quote.Close > prevQuote.High) q.High = q.Close;
						if (quote.Close < prevQuote.Low) q.Low = q.Close;
					}
					if (chart.animatingHorizontalScroll) {
						self.micropixels = newData.micropixels;
						chart.lastTickOffset = newData.lineOffset;
					}
					newParams.updateDataSegmentInPlace = !tickAnimator.hasCompleted;
					//console.log("animating: Old",symbol,' New : ',chart.symbol);
					var updateQuotes=[q];
					// Don't include previous quote if tick mode. It will append, duplicating the quote
					if(chartJustAdvanced && self.layout.interval !== 'tick') updateQuotes.unshift(prevQuote);  
					self.updateChartData(updateQuotes, chart, newParams);
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
			if(supportedChartType){
				var quote = appendQuotes[appendQuotes.length - 1];
				this.prevQuote = this.currentQuote();  // <---- prevQuote logic has been changed to prevent forward/back jitter when more than one tick comes in between animations
				var chartJustAdvanced = false; // When advancing, we need special logic to deal with the open
				var dontScroll = false;
				if (period == 1 && appendQuotes.length == 2) {  // Don't do this if consolidating
					this.prevQuote = appendQuotes[0];
					var dataSetLength = chart.dataSet.length;
					completeLastBar(this.prevQuote);
					if(dataSetLength==chart.dataSet.length) dontScroll = true;
				}
				if (!quote || !quote.Close || !this.prevQuote || !this.prevQuote.Close) return false;

				if (this.extendedHours && chart.market.market_def) {
					// Filter out unwanted sessions
					var dtToFilter = quote.DT;
					if (CIQ.ChartEngine.isDailyInterval(interval)) {
						filterSession = !chart.market.isMarketDate(dtToFilter);
					} else {
						if (!nextBoundary || nextBoundary <= dtToFilter) {
							var session = chart.market.getSession(dtToFilter);
							filterSession = (session !== "" && (!this.layout.marketSessions || !this.layout.marketSessions[session]));
							nextBoundary = chart.market[filterSession ? "getNextOpen" : "getNextClose"](dtToFilter);
						}
					}
					if (filterSession) {
						this.draw();
						return false;
					}
				}

				var barSpan = period;
				if (interval == "second" || timeUnit == "second") barSpan *= 1000;
				else if (interval == "minute" || timeUnit == "minute") barSpan *= 60000;
				if (!isNaN(interval)) barSpan *= interval;
				if (interval == "day" || timeUnit == "day") chartJustAdvanced = quote.DT.getDate() != this.prevQuote.DT.getDate();
				else if (interval == "week" || timeUnit == "week") chartJustAdvanced = quote.DT.getDate() >= this.prevQuote.DT.getDate() + 7;
				else if (interval == "month" || timeUnit == "month") chartJustAdvanced = quote.DT.getMonth() != this.prevQuote.DT.getMonth();
				else chartJustAdvanced = quote.DT.getTime() >= this.prevQuote.DT.getTime() + barSpan;

			    var linearChart=(!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) && !this.standaloneBars[this.layout.chartType];

				var beginningOffset = 0;
				if (chartJustAdvanced) {
					if(this.animations.zoom.hasCompleted){
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
							if(!dontScroll) chart.scroll++;
						}
					}else{
						return false;
					}
				}
				chart.closePendingAnimation = quote.Close;
				var start = (chartJustAdvanced && !linearChart) ? quote.Open : this.prevQuote.Close;
				tickAnimator.run(cb(quote, CIQ.clone(this.prevQuote), chartJustAdvanced), {
					"Close": start,
					"micropixels": this.nextMicroPixels,
					"lineOffset": beginningOffset
				}, {"Close": quote.Close, "micropixels": this.micropixels, "lineOffset": 0});
				return true; // bypass default behavior in favor of animation
			}
		});

		stx.prepend("renderYAxis", function(chart){
			if(this.grabbingScreen || !this.isHome()) return;
			// When display style doesn't support animation
			var supportedChartType=this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation;
			if(!supportedChartType) return;

			var panel = chart.panel;
			var yAxis=panel.yAxis;
			if(yAxis.priceFormatter==CIQ.Comparison.priceFormat) return;  // too difficult to animate y-axis change when it changes on every tick due to percentage axis on comparison

			function closure(self){
				return function(values){
					chart.animatedLow=values.low;
					chart.animatedHigh=values.high;
					self.draw();
				};
			}
            // initialize prev values
    		if(!chart.prevLowValue && chart.prevLowValue!==0){
        		chart.prevLowValue=chart.animatedLow=chart.lowValue;
    		}
    		if(!chart.prevHighValue && chart.prevHighValue!==0){
        		chart.prevHighValue=chart.animatedHigh=chart.highValue;
    		}

    		// check for a change, if so we will spin off an animation
    		if(!scrollAnimator.running) chart.animatingVerticalScroll=false;
    		if(chart.prevLowValue>=chart.lowValue && chart.prevHighValue<=chart.highValue){
    			if(chart.animatingVerticalScroll){
    				yAxis.highValue=chart.animatedHigh;
    				yAxis.lowValue=chart.animatedLow;
    			}
    			return;
    		}
    		if(scrollAnimator.running) scrollAnimator.stop();
    		if(!chart.lowValue && !chart.highValue) return;  // chart just reset, don't animate yet
    		var prevLow=chart.prevLowValue, prevHigh=chart.prevHighValue;
    		chart.prevLowValue=chart.lowValue;
    		chart.prevHighValue=chart.highValue;
    		chart.animatingVerticalScroll=true;
    		scrollAnimator.run(closure(this), {"low": prevLow, "high": prevHigh}, {"low":chart.lowValue, "high":chart.highValue});

			yAxis.lowValue=chart.animatedLow;
			yAxis.highValue=chart.animatedHigh;
		});

		/*stx.prepend("draw", function() {
			if(this.chart.animatingVerticalScroll) {
				this.renderYAxis(this.chart);
				return true;
			}
		});*/

		stx.append("draw", function() {
			if(filterSession) return;
			if (this.chart.dataSet && this.chart.dataSet.length && this.mainSeriesRenderer && this.mainSeriesRenderer.supportsAnimation ) {
				if(flashingColorThrottleCounter%flashingColorThrottle===0) {
					flashingColorIndex++;
					flashingColorThrottleCounter=0;
				}
				flashingColorThrottleCounter++;

			    var context = this.chart.context;
			    var panel = this.chart.panel;
			    var currentQuote = this.currentQuote();
			    if(!currentQuote) return;
			    var price = currentQuote.Close;
			    var x = this.pixelFromTick(currentQuote.tick, this.chart);
			    if( this.chart.lastTickOffset ) x = x + this.chart.lastTickOffset;
			    var y = this.pixelFromPrice(price, panel);
			    if (this.chart.yAxis.left > x &&
			    	this.chart.yAxis.top <= y &&
			    	this.chart.yAxis.bottom >= y) {
			      if(flashingColorIndex >= flashingColors.length) flashingColorIndex = 0;
			      context.beginPath();
			      context.moveTo(x, y);
			      context.arc(x, y, 2+flashingColorIndex*1.07, 0, Math.PI * 2, false);
				  context.fillStyle = flashingColors[flashingColorIndex];
				  context.fill();
			    }
			}
		});
	};





	/**
	 * Add-On that allows a "continuous zoom", changing periodicities as the maxTicks and/or candlewidth hits a set boundary.
	 * 
	 * Although this feature is available for all chart styles, it shows best on continuous renderings such as lines and mountains, vs. candles and bars. 
	 * This is because some users may find the changes in candle width, that takes place as the same range is displayed in a different periodicity, unnatural. 
	 * The effect can be mitigated by increasing the number of boundaries so periodicities change more often, preventing large candle width changes; 
	 * and by using the periodicity roll up feature instead of fetching new data from a quote feed. See examples.
	 * 
	 * See {@link CIQ.ChartEngine#setPeriodicity} and {@link CIQ.ChartEngine#createDataSet}
	 *
	 * Requires `addOns.js`
	 *
	 * The feature will not work without supplying at least one element within the periodicities array,
	 * and at least one property within the boundaries object.
	 *
	 * @param {object} params Configuration parameters
	 * @param {CIQ.ChartEngine} params.stx The chart object
	 * @param {array} params.periodicities Set this array with eligible periodicities here, in any order. These will be the periodicities which will be used by the continuous zooming once a boundary is hit.
	 * 										The periodicities are objects with period, interval, [timeUnit] properties (see {@link CIQ.ChartEngine#setPeriodicity}).
	 * @param {object} params.boundaries Optional boundary cases to trigger the periodicity change. Hitting a max boundary will switch to the next larger periodicity; hitting a min boundary will switch to the next smaller periodicity.
	 * @param {number} [params.boundaries.maxCandleWidth] largest size of candle in pixels to display before switching
	 * @param {number} [params.boundaries.minCandleWidth] smallest size of candle in pixels to display before switching
	 * @param {number} [params.boundaries.maxTicks] most number of ticks to display before switching
	 * @param {number} [params.boundaries.minTicks] least number of ticks to display before switching
	 * @constructor
	 * @name  CIQ.ContinuousZoom
     * @since 7.0.0
     * @example
     * new CIQ.ContinuousZoom({
     *	stx: stxx,
     *	periodicities:[
     *		{period:1,   interval:"month"},
     *		{period:1,   interval:"day"},
     *		{period:2,   interval:30},
     *		{period:1,   interval:5},
     *		{period:15,  interval:1,  timeUnit:"second"},
     *		{period:1,   interval:1,  timeUnit:"second"}
     *	],
     *	boundaries:{
     *		maxCandleWidth: 100,
     *		minCandleWidth: 3,
     *		maxTicks: 500,
     *		minTicks: 10
     *	}
     * });
     * @example
//smother periodicity change by rolling daily into weekly and monthly. 
// Also try reusing the same interval data and have the chart roll it instead of fetching new data.
stxx.dontRoll=false; 
new CIQ.ContinuousZoom({
    stx: stxx,
    periodicities:[
    	// daily interval data
        {period:1,   interval:"month"},
        {period:2,   interval:"week"},
        {period:1,   interval:"week"},
        {period:3,   interval:"day"},
        {period:1,   interval:"day"},
        // 30 minute interval data
        {period:16,   interval:30},
        {period:8,   interval:30},
        {period:4,   interval:30},
        {period:2,   interval:30},
        // one minute interval data
        {period:30,   interval:1},
        {period:15,   interval:1},
        {period:10,   interval:1},
        {period:5,   interval:1},
        {period:2,   interval:1},
        {period:1,   interval:1},
        // one second interval data
        {period:30,  interval:1,  timeUnit:"second"},
        {period:15,  interval:1,  timeUnit:"second"},
        {period:5,   interval:1,  timeUnit:"second"},
        {period:2,   interval:1,  timeUnit:"second"},
        {period:1,   interval:1,  timeUnit:"second"},
    ],
    boundaries:{
        maxCandleWidth: 15,
        minCandleWidth: 3
   }
});
     */
	CIQ.ContinuousZoom=function(params){
		this.update(params);
		this.stx.continuousZoom=this;

		//Attaches SmartZoom button to HTML DOM inside .chartSize element
		this.addSmartZoomButton=function(){
			// Don't add a button if one already exists
			var smartZoomButton = this.stx.registerChartControl(
				'stx-smart-zoom',
				'SmartZoom',
				(function(self){return function(e){ self.smartZoomToggle(e); e.stopPropagation(); };})(this)
			);
			if(smartZoomButton){
				// Listen for a layout changed event and refresh the toggle state of the button
				this.stx.addEventListener("layout", function(event){
					if(event.stx.layout.smartzoom === true){
						CIQ.appendClassName(smartZoomButton, 'active');
					}else{
						CIQ.unappendClassName(smartZoomButton,"active");
					}
				});
				// Piggyback off of symbolImport event to detect smartzoom set to false from layout import
				this.stx.addEventListener("symbolImport", function(event){
					if(event.stx.layout.smartzoom === false) CIQ.unappendClassName(smartZoomButton,"active");
				});
			}
		};

		//Click event handler for the Smart Zoom button. Sets smartzoom property of layout to its inverse
		this.smartZoomToggle=function(e){
			this.smartZoomEnable(!this.stx.layout.smartzoom);
		};

		//Sets smartzoom property of layout and notifies attached ChartEngine of change
		this.smartZoomEnable=function(state){
			this.stx.layout.smartzoom = state;
			this.stx.changeOccurred("layout");
		};

		// Add the SmartZoom button to chartControls 
		this.addSmartZoomButton();
		// Enable SmartZoom by default
		this.smartZoomEnable(true);
	};

	/**
	 * Updates continuous zoom parameters
	 * @param  {object} params Configuration parameters.  See constructor for details
	 * @memberof CIQ.ContinuousZoom
	 * @since 7.0.0
	 * @private
	 */
	CIQ.ContinuousZoom.prototype.update=function(params){
		if(!params) params={};
		this.stx=params.stx;
		this.periodicities=params.periodicities;
		this.boundaries=params.boundaries;
	};

	/**
	 * Potentially performs a continuous zoom after a zoom event
	 * @param  {boolean} [zoomOut] True for a zoomOut operation, otherwise zoomIn
	 * @memberof CIQ.ContinuousZoom
	 * @since 7.0.0
	 * @private
	 */
	CIQ.ContinuousZoom.prototype.execute=function(zoomOut){
		// assign a weight to a periodicity setting, the higher the length, the higher the weight
		function valuate(periodicity){
			var period=periodicity.period || periodicity.periodicity,
					interval=periodicity.interval,
					timeUnit=periodicity.timeUnit || "minute";
			if(isNaN(interval)) {
				timeUnit=interval;
				interval=1;
			}
			switch(timeUnit){
			case "month":
				interval*=4.35; /* falls through */
			case "week":
				interval*=7; /* falls through */
			case "day":
				interval*=1440; /* falls through */
			case "minute":
				interval*=60; /* falls through */
			case "second":
				break;
			case "millisecond":
				interval/=1000;
				break;
			default:
				return null;
			}
			return period*interval;
		}
		if(!this.stx || !this.stx.layout.smartzoom) return;
		var periodicities=this.periodicities,
			boundaries=this.boundaries,
			stx=this.stx, layout=stx.layout, chart=stx.chart;
		if(!periodicities || !boundaries) return;

		if((!zoomOut && boundaries.maxCandleWidth && layout.candleWidth>boundaries.maxCandleWidth) ||
			(zoomOut && boundaries.minCandleWidth && layout.candleWidth<boundaries.minCandleWidth) ||
			(!zoomOut && boundaries.minTicks && chart.maxTicks<boundaries.minTicks) ||
			(zoomOut && boundaries.maxTicks && chart.maxTicks>boundaries.maxTicks)) {
			var next={value:zoomOut?Number.MAX_VALUE:0};
			var myValue=valuate(layout);
			for(var p=0;p<periodicities.length;p++){
				var value=valuate(periodicities[p]);
				if((value>myValue && value<next.value && zoomOut) ||
					(value<myValue && value>next.value && !zoomOut)) {
						next={value:value, periodicity:periodicities[p]};
				}
			}
			var newPeriodicity=next.periodicity;
			if(newPeriodicity) {
				stx.setRange({dtLeft:chart.xaxis[0].DT,
								dtRight:chart.xaxis[chart.xaxis.length-1].DT,
								dontSaveRangeToLayout:true,
								periodicity:newPeriodicity});
			}
		}
	};





	/**
	 * Use this constructor to initialize filtering and visualization styles of extended hours by the use of shading and delimitation lines.
	 *
	 * Requires `addOns.js`
	 *
	 * This visualization will only work if data for the corresponding sessions is provided from your quote feed and the market definitions have the corresponding entries.
	 * See {@link CIQ.Market} for details on how to define extended (non-default) hours.
	 *
	 * By default all extended hour sessions are disabled unless explicitly enabled using {@link CIQ.ExtendedHours.prepare} or {@link CIQ.ExtendedHours.set}.
	 *
	 * All possible market sessions needed to be shaded at any given time should be enabled at once with this method.
	 *
	 * Your fetch should load the required data based on the `params.stx.layout.extended` and `params.stx.layout.marketSessions` settings.
	 *
	 * Remember that when `params.filter` is set to true, this module performs a filter of already loaded masterData when {@link CIQ.ExtendedHours.set} is invoked,
	 * rather than calling {@link CIQ.ChartEngine#loadChart} to reload the data from the server every time you enable or disable this feature.
	 * So you must always return all requested sessions on your fetch responses if this flag is set.
	 *
	 *CSS info:
	 * - The styles for the shading of each session is determined by the corresponding CSS class in the form of "stx_market_session."+session_name (Example: `stx_market_session.pre`)
	 * - The divider line is determined by the CSS class "stx_market_session.divider".
	 *
	 * **Important:** This module must be initialized before {@link CIQ.ChartEngine#importLayout} or the sessions will not be able to be restored.
	 *
	 * Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/g2vvww67/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 *
	 * @param {object} params The constructor parameters
	 * @param {CIQ.ChartEngine} [params.stx] The chart object
	 * @param {boolean} [params.filter] Setting to true performs a filter of masterData when {@link CIQ.ExtendedHours.set} is invoked, rather than calling {@link CIQ.ChartEngine#loadChart} to reload the data from the server.
	 * @constructor
	 * @name  CIQ.ExtendedHours
	 * @example
	 * // Call this only once to initialize the market sessions display manager.
		new CIQ.ExtendedHours({stx:stxx, filter:true});

		// By default all sessions are disabled unless explicitly enabled.
		// This forces the extended hours sessions ["pre","post"] to be enabled when the chart is initially loaded.
		stxx.extendedHours.prepare(true);

		//Now display your chart
		stxx.loadChart(stxx.chart.symbol, {}, function() {});

	 * @example
		// once your chart is displayed, you can call this from any UI interface to turn on extended hours.
		stx.extendedHours.set(true);

		// or call this from any UI interface to turn off extended hours.
		stx.extendedHours.set(false);

	 * @example
	 * 	// CSS entries for a session divider and sessions named "pre" and "post"
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
	CIQ.ExtendedHours=function(params){
		var stx=params.stx;
		this.filter=params.filter;
		if(!stx) { // backwards compatibility
			stx=params;
			this.filter=false;
		}
		var styles={};
		this.stx=stx;
		this.stx.extendedHours=this;

		stx.addEventListener("theme", function(tObject){
			// reinitialize the session colors after a theme change
			styles={};
			for(var sess in stx.layout.marketSessions) {
				if(!styles.session) styles.session={};
				styles.session[sess]=stx.canvasStyle("stx_market_session "+sess);
			}
		});

		stx.addEventListener("symbolChange", function(tObject){
			// check if extended hours exists for this security
			if(tObject.action=="master" && stx.layout.extended && !(stx.chart.market.market_def && stx.chart.market.sessions.length)) {
				CIQ.alert('There are no Extended Hours for this instrument.');
			}
		});

       /**
         * Prepares the extended hours settings and classes for the session names enumerated in the arguments without actually displaying or loading the data.
         *
         * This method can be used to force a particular session to load by default by calling it before {@link CIQ.ChartEngine#loadChart}.
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
		this.prepare=function(enable,sessions){
			stx.layout.extended=enable;
			for(var sess in stx.layout.marketSessions) {
				styles.session={};
				stx.chart.market.disableSession(sess);
			}
			stx.layout.marketSessions={};
			if(enable){
				if(!sessions) sessions=["pre","post"];
				if(sessions.length){
					for(var s=0;s<sessions.length;s++){
						stx.layout.marketSessions[sessions[s]]=true;
					}
				}else{
					stx.layout.marketSessions=sessions;
				}
			}
			for(sess in stx.layout.marketSessions) {
				if(!styles.session) styles.session={};
				styles.session[sess]=stx.canvasStyle("stx_market_session "+sess);
				stx.chart.market.disableSession(sess,true);
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
		this.complete=function(cb){
			stx.changeOccurred("layout");
			if( !stx.chart.market.market_def) {
				// possibly a 24 hours Market. Not necessarily an error but nothing to do for ExtendedHours
				if(cb) cb();
				return;
			}
			if(this.filter){
				stx.createDataSet();
				stx.draw();
				if(cb) cb();
			}else{
				stx.loadChart(stx.chart.symbol, cb);
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
		this.set=function(enable,sessions,cb){
			this.prepare(enable,sessions);
			this.complete(cb);
		};

		// This injection shades the after hours portion of the chart for each yaxis.
		// Only the panel to which the yaxis belongs will get shading.
		// This means yaxes of overlays will bypass the shading block.
		this.stx.append("createYAxis", function(panel, parameters){
			if(!this.layout.extended) return;
			if(panel.yAxis!=parameters.yAxis || panel.shareChartXAxis===false || panel.hidden) return;
			var chart=panel.chart;
			if(CIQ.ChartEngine.isDailyInterval(this.layout.interval)) return;
			styles.divider=this.canvasStyle("stx_market_session divider");
			if(styles.session){
				var m=chart.market;
				var ranges=[];
				var range={};
				var nextBoundary, thisSession;
				for(var i=0;i<chart.dataSegment.length;i++){
					var ds=chart.dataSegment[i];
					if(!ds || !ds.DT) continue;
					var c=null;
					if(m.market_def){
						if(!nextBoundary || nextBoundary<=ds.DT){
							thisSession=m.getSession(ds.DT);
							var filterSession=(thisSession!=="" && (!this.layout.marketSessions || !this.layout.marketSessions[thisSession]));
							nextBoundary=m[filterSession?"getNextOpen":"getNextClose"](ds.DT);
						}
					}

					var s=styles.session[thisSession];
					if(s) c=s.backgroundColor;
					if(range.color && range.color!=c){
						ranges.push({start:range.start,end:range.end,color:range.color});
						range={};
					}
					if(c){
						var cw=this.layout.candleWidth;
						if(ds.candleWidth) cw=ds.candleWidth;
						range.end=this.pixelFromBar(i,chart)+cw/2;
						if(!range.start && range.start!==0) range.start=range.end-cw+1;
						range.color=c;
					}else{
						range={};
					}
				}
				if(range.start || range.start===0) ranges.push({start:range.start,end:range.end,color:range.color});
				var noDashes=CIQ.isTransparent(styles.divider.backgroundColor);
				var dividerLineWidth=styles.divider.width.replace(/px/g, '');
				var dividerStyle={pattern: "dashed", lineWidth: dividerLineWidth};
				this.startClip(panel.name);
				if(stx.highlightedDraggable) chart.context.globalAlpha*=0.3;
				for(i=0;i<ranges.length;i++){
					chart.context.fillStyle=ranges[i].color;
					if(!noDashes && ranges[i].start>chart.left) this.plotLine(ranges[i].start, ranges[i].start, panel.bottom, panel.top, styles.divider.backgroundColor, "line", chart.context, panel, dividerStyle);
					chart.context.fillRect(ranges[i].start,panel.top,ranges[i].end-ranges[i].start,panel.bottom-panel.top);
					if(!noDashes && ranges[i].end<chart.right) this.plotLine(ranges[i].end, ranges[i].end, panel.bottom, panel.top, styles.divider.backgroundColor, "line", chart.context, panel, dividerStyle);
				}
				this.endClip();
			}
		});
	};




	/**
	 * Creates the add-on that sets the chart UI to full-screen mode. In full-screen mode, a class `full-screen` is added
	 * to the context element used for styling. In addition, elements with the class `full-screen-hide` are hidden.
	 * Elements with the class `full-screen-show` that are normally hidden are shown.
	 *
	 * Requires `addOns.js`.
	 *
	 * @param {object} params Configuration parameters
	 * @param {CIQ.ChartEngine} [params.stx] The chart object
	 * @constructor
	 * @name CIQ.FullScreen
	 * @example
	 * 	new CIQ.FullScreen({stx:stxx});
	 * @since 7.3.0
	 */
	CIQ.FullScreen=function(params){
		if(!params) params={};
		if(!params.stx){ console.warn("The Full Screen addon requires an stx parameter"); return; }
		this.stx=params.stx;
		this.stx.fullScreen=this;
		this.fullScreenButton = null;
		this.fullScreenState = false;

		//Attaches FullScreen button to HTML DOM inside .chartSize element
		this.addFullScreenButton=function(){
			this.fullScreenButton = this.stx.registerChartControl(
				'stx-full-screen',
				'Full Screen',
				(function(self){return function(e){ self.fullScreenToggle(e); e.stopPropagation(); };})(this)
			);
		};

		//Click event handler for the Full Screen button.
		this.fullScreenToggle=function(e){
			// First check for availability of the requestFullScreen function
			if(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || document.documentElement.mozRequestFullscreen ||  document.documentElement.msRequestFullscreen ){
				// Check if full screen is already enabled
				if(this.getFullScreenElement()){
					if(document.exitFullscreen) document.exitFullscreen();
					else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
					else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
					else if(document.msExitFullscreen) document.msExitFullscreen();
				}else{
					// requestFullscreen methods need to be checked for again here because the browser will not allow the method to be stored in a local var
					if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
					else if(document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
					else if(document.documentElement.mozRequestFullscreen) document.documentElement.mozRequestFullscreen();
					else if(document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
				}
			}else{
				//If the full screen api isn't available, manually trigger the fullScreen styling
				this.fullScreenState = !this.fullScreenState;
				this.fullScreenRender();
			}
		};

		// Append/remove full-screen class to context or body and update button state
		this.fullScreenRender=function(){
			var containerElement = null;
			containerElement = CIQ.findClosestParent(this.stx.container, '*[cq-context], cq-context, body');
			if(containerElement){
				if(this.fullScreenState === true){
					CIQ.appendClassName(this.fullScreenButton, "active");
					CIQ.appendClassName(containerElement, "full-screen");
				}else{
					CIQ.unappendClassName(this.fullScreenButton, "active");
					CIQ.unappendClassName(containerElement, "full-screen");
				}
				// Trigger a resize event to update the chart size
				window.dispatchEvent(new Event('resize'));
			}
		};

		//Handle full screen change
		this.onFullScreenChange=function(){
			if(this.getFullScreenElement()){
				this.fullScreenState = true;
			}else{
				this.fullScreenState = false;
			}
			this.fullScreenRender();
		};

		this.getFullScreenElement=function(){
			return document.fullscreenElement || document.webkitCurrentFullScreenElement|| document.mozFullScreenElement || document.msFullscreenElement;
		};

		document.addEventListener("fullscreenchange", this.onFullScreenChange.bind(this), false);
		document.addEventListener("webkitfullscreenchange", this.onFullScreenChange.bind(this), false);
		document.addEventListener("mozfullscreenchange", this.onFullScreenChange.bind(this), false);
		document.addEventListener("MSFullscreenChange", this.onFullScreenChange.bind(this), false);

		// Add the FullScreen button to chartControls
		this.addFullScreenButton();
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
	 * 									Set to non-zero positive number or defaults to 60.
	 * @param {function} [params.wakeCB] Optional callback function after waking
	 * @param {function} [params.sleepCB] Optional callback function after sleeping
	 * @constructor
	 * @name  CIQ.InactivityTimer
	 * @since 3.0.0
	 * @example
	 * 	new CIQ.InactivityTimer({stx:stxx, minutes:30, interval:15});  //30 minutes of inactivity will put chart into sleep mode, updating every 15 seconds
	 *
	 */
	CIQ.InactivityTimer=function(params){
		if(!params.minutes) return;
		if(!params.interval || params.interval<0) params.interval=60;
		this.stx=params.stx;
		this.timeout=params.minutes;
		this.interval=params.interval;
		this.wakeCB=params.wakeCB;
		this.sleepCB=params.sleepCB;
		this.sleepTimer=null;
		this.sleeping=false;
		this.last=new Date().getTime();
		this.wakeChart=function(){
			clearTimeout(this.sleepTimer);
			this.last=new Date().getTime();
			if(this.sleeping) {
				if(this.stx.quoteDriver) this.stx.quoteDriver.updateChartLoop();
				this.sleeping=false;
				CIQ.unappendClassName(document.body,"ciq-sleeping");
			}
			this.sleepTimer=setTimeout(this.sleepChart.bind(this), this.timeout*60000);
			if(this.wakeCB) this.wakeCB();
		};
		this.sleepChart=function(){
			if(!this.sleeping) {
				if(this.stx.quoteDriver) this.stx.quoteDriver.updateChartLoop(this.interval);
				this.sleeping=true;
				CIQ.appendClassName(document.body,"ciq-sleeping");
			}
			if(this.sleepCB) this.sleepCB();
		};
		$(document).on(
				"mousemove mousedown touchstart touchmove pointerdown pointermove keydown wheel",
				$("body"),
				function(self){ return function(e){ self.wakeChart(); };}(this)
			);
		this.wakeChart();
	};





	/**
	 * Add-On that allows a series to complement another series.
	 *
	 * The complementary series is a permanent fixture of the series which it complements.
	 * It moves in tandem with the series, and gets removed with the series.
	 * In all other respects, though, it behaves like its own series. It shows separately in the panel legend and plots using its own renderer.
	 * The addon instance is attached to the chart engine as a member of the `stxx.plotComplementers` array.
	 *
	 * **Note:** The series created by this add-on is not exported with the layout, since it is created in tandem with the series it complements.
	 * Currently this feature works only with non-comparison series (parameters.isComparison!==true)
	 *
	 * @param {object} params Configuration parameters.
	 * @param {CIQ.ChartEngine} params.stx The chart object.
	 * @param {string} [params.id] Unique key used by the add-on to identify itself. If not supplied, a random key is chosen.
	 * @param {object} [params.quoteFeed] If provided, attaches the quote feed to the quote driver to satisfy any quote requests for any series created by the add-on.
	 * @param {object} [params.behavior] If provided, used as the behavior for the quote feed supplied in this parameter list.
	 * @param {object} [params.filter] If provided, used as the filter for the quote feed supplied in this parameter list.
	 * @param {object} [params.decorator] Object on which a modifier for the symbol and/or display can be set.
	 * @param {string} [params.decorator.symbol] If provided, adds this string onto the ID when creating the complementary series. Otherwise, a unique ID is used.
	 * @param {string} [params.decorator.display] If provided, customizes the display value of the series.
	 * @param {object} [params.renderingParameters] This is a collection of parameters that override the default rendering parameters.
	 * 					The default parameters determine how the forecast renderer is created. These are a line of width 1 px and 0.5 opacity.
	 * 					One can always change the rendering on the fly by setting this instance's `renderingParameters` property to a different object.
	 * 					The default parameters can be restored by calling `this.resetRenderingParameters()` where `this` is the add-on instance.
	 * 					Here are a few examples of rendering parameters:
	 * ```javascript
	 * {chartType:"scatterplot", opacity:0.5, field:"Certainty"}
	 * {chartType:"histogram", border_color:"transparent", opacity:0.3}
	 * {chartType:"channel", opacity:0.5, pattern:"dotted"}
	 * {chartType:"candle", opacity:0.5, color:"blue", border_color:"blue"}
	 * ```
	 * @constructor
	 * @name CIQ.PlotComplementer
	 * @since 7.3.0
	 * @example <caption>Use for Forecasting</caption>
		new CIQ.PlotComplementer({
			stx:stxx,
			id:"forecast",
			quoteFeed: fcstFeed.quoteFeedForecastSimulator,
			behavior: {refreshInterval:60},
			decorator: {symbol:"_fcst",display:" Forecast"},
			renderingParameters: {chartType:"channel", opacity:0.5, pattern:"dotted"}
		});
	 */
	CIQ.PlotComplementer=function(params){
		var stx=params.stx;
		var unique=CIQ.uniqueID();
		if(!params.decorator) params.decorator={};
		var symbolDecorator=params.decorator.symbol || "_"+unique;
		var displayDecorator=params.decorator.display || " (addl)";
		if(!stx.plotComplementers) stx.plotComplementers=[];
		stx.plotComplementers.push(this);

		this.id=params.id || unique;

		this.defaultRenderingParameters={
			chartType:"line",
			width:1,
			opacity:0.5
		};

		if(params.renderingParameters) this.defaultRenderingParameters=params.renderingParameters;

		var self=this;
		function addSeries(stx, symbol, parameters, id){
			function verifyQuoteFeed(stx){
				if(!stx.quoteDriver) return;
				if(!params.quoteFeed) return;
				for(var qf=0;qf<stx.quoteDriver.quoteFeeds.length;qf++){
					if(stx.quoteDriver.quoteFeeds[qf].engine==params.quoteFeed) return;
				}
				return "err";
			}
			if(verifyQuoteFeed(stx)=="err") return;
			if(!id) id=symbol;
			if(stx.isEquationChart(symbol)) return;
			if(!parameters) parameters={};
			if(parameters.isComparison) return;
			if(id && id.indexOf(symbolDecorator)==-1) {
				var fId=id+symbolDecorator,fSymbol=symbol+symbolDecorator;
				var masterRenderer=stx.getRendererFromSeries(id);
				var myParms=CIQ.extend({
					display: symbol+ displayDecorator,
					name: fId,
					symbol: fSymbol,
					symbolObject: {symbol:fSymbol, generator:self.id, masterSymbol:symbol},
					overChart: false,
					gapDisplayStyle: true,
					permanent: true,
					panel: parameters.panel,
					yAxis: parameters.yAxis,
					shareYAxis: true,
					loadData: !!self.quoteFeed,
					dependentOf: masterRenderer?masterRenderer.params.name:stx.mainSeriesRenderer.params.name
				}, self.renderingParameters);
				if(!myParms.color) myParms.color=parameters.color || "auto";
				stx.addSeries(fId, myParms, function(error, obj){
					if(error) stx.removeSeries(fId, stx.chart);
					if(stx.chart.seriesRenderers[fId]){
						stx.chart.seriesRenderers[fId].params.display=myParms.display;
					}
				});
			}
		}

		function removeSeries(stx, id, chart){
			if(id && id.indexOf(symbolDecorator)==-1) stx.removeSeries(id+symbolDecorator, chart);
		}

		function symbolChange(obj){
			if(obj.action=="master") {
				if(!obj.prevSymbol) obj.prevSymbol=obj.symbol;
				removeSeries(obj.stx, obj.prevSymbol, obj.stx.chart);
				addSeries(obj.stx, obj.symbol);
			}else if(obj.action=="add-series"){
				removeSeries(obj.stx, obj.id, obj.stx.chart);
				addSeries(obj.stx, obj.symbol, obj.parameters, obj.id);
			}else if(obj.action=="remove-series"){
				removeSeries(obj.stx, obj.id, obj.stx.chart);
			}
		}

		stx.addEventListener("symbolChange", symbolChange);
		stx.addEventListener("symbolImport", symbolChange);

		/**
		 * Resets rendering parameters back to the default settings.
		 * These are the settings used when creating a `PlotComplementer`.
		 * If not provided when creating a `PlotComplementer`, will use the following default: `{ chartType:"line", width:1, opacity:0.5 }`.
		 * The rendering parameters may be set at any time after creating `PlotComplementer` to set an ad-hoc rendering right
		 * before adding a series.
		 *
		 * @memberof CIQ.PlotComplementer
		 * @since 7.3.0
		 */
		this.resetRenderingParameters=function(){
			this.renderingParameters=this.defaultRenderingParameters;
		};

		/**
		 * Sets a quote feed for the `PlotComplementer`.
		 * Automatically called when a quote feed is provided in the constructor argument object.
		 *
		 * @param {object} params.quoteFeed Quote feed to attach to the quote driver to satisfy any quote requests for any series created by the add-on.
		 * @param {object} params.behavior Behavior for the quote feed supplied in this parameter list.
		 * @param {object} [params.filter] If provided, used as the filter for the quote feed supplied in this parameter list.
		 * @memberof CIQ.PlotComplementer
		 * @since 7.3.0
		 */
		this.setQuoteFeed=function(params){
			if(!params.quoteFeed || !params.behavior) return;
			var behavior=CIQ.clone(params.behavior);
			behavior.generator=this.id;
			var existingFilter=params.filter;
			var filter=function(params){
				if(existingFilter && !existingFilter(params)) return false;
				return params.symbolObject.generator==behavior.generator;
			};
			stx.attachQuoteFeed(params.quoteFeed, behavior, filter);
			this.quoteFeed=params.quoteFeed;
		};

		this.setQuoteFeed(params);
		this.resetRenderingParameters();
	};





	/**
	 * Add-On that puts a range slider under the chart. 
	 * 
	 * This allows the `dataSegment` to be selectable as a portion of the dataset.
	 *
	 * Requires `addOns.js` and `jquery`.
	 * 
	 * It also requires additional CSS. <br>
	 * Either add:
	 * ```
	 * <link rel="stylesheet" type="text/css" href="css/chartiq.css" media="screen" />
	 * ```
	 * Or explicitly include this CSS:
	 * ```
	 * .stx_range_slider.shading {
	 * 		background-color: rgba(128, 128, 128, 0.3);
	 * 		border: solid 2px #0090b7;
	 * 		width: 5px; 
	 * }
	 * ```
	 * Once instantiated, it can be displayed or hidden by simply  setting the `rangeSlider` parameter of the primary chart's **layout object**, 
	 * and then issuing a layout change event to trigger the new status. 
	 * Make sure to use the callback to enable the slider on initial load to prevent 'out of sequence' issues.
	 * See examples for exact syntax.
	 * 
	 * Remember, a range slider is simply just another chart. So you configure it and customize it using the same parameters as you would the primary chart. 
	 * The only difference is that the slider object will be a sub element of the primary chart, living inside the `slider.slider` object.
	 * <br>For example, if you wanted to turn off the x axis on the slider, assuming a chart instantiated as `stxx`, you would execute:
	 * ```
	 * stxx.slider.slider.xaxisHeight=0;
	 * ```
	 *
	 * If using chartIQ Web Components, the slider needs to be created **before** the UI manager (startUI) is called for custom themes to apply.
	 * 
	 * It is important to note that the range slider chart container will 'create itself' **UNDER** the primary chart container, not **INSIDE**. 
	 * As such, to ensure styling is shared between the 2 containers, so they match in look and feel, all the styling must be on a parent div container rather than the primary chart container itself.
	 * <br>For example, do this:
```
<div class="all-charts">
  <div style="grid-column: span 6;grid-row: span 2;">
    <div class="chartwrap"> <!-- begin of wrapper with desired styling -->
      <div class="chartContainer1" style="width:100%;height:100%;position:relative"></div>
      <!-- the slider will be added here -->
    </div>
  </div> <!-- end of wrapper -->
</div>

```
Not this:
```HTML
<div class="all-charts">
  <div class="chartwrap" style="grid-column: span 6;grid-row: span 2;">
    <div class="chartContainer1" style="width:100%;height:100%;position:relative"></div>
  </div>
</div>
```
	 *
	 * Range Slider working example: <iframe width="800" height="600" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/dtug29yx/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 *
	 * @param {object} params Configuration parameters
	 * @param {CIQ.ChartEngine} [params.stx] The chart object
	 * @param {number} [params.height=95] Height of range slider panel
	 * @param {object} [params.yAxis] optional yAxis parameters
	 * @param {number} [params.chartContainer=stxx.container] jquery handle to the main chart container
	 * @constructor
	 * @name  CIQ.RangeSlider
	 * @since 4.0.0
	 * @since 6.1.0 added yAxis parameter
	 * @example <caption> Declare a range slider and enable by default using the loadChart callback</caption>
	 * var stxx=new CIQ.ChartEngine({container:$$$(".chartContainer")}); 
	 * 
	 * stxx.attachQuoteFeed(quoteFeedSimulator,{refreshInterval:1,bufferSize:200});
	 * 
	 * // instantiate a range slider
	 * new CIQ.RangeSlider({stx:stxx});
	 * 
	 * function displayChart(){
	 * 		stxx.newChart("SPY", null, null,function(){
	 *			// for smoother visualization, enable AFTER THE MAIN CHART HAS COMPLETED LOADING ITS DATA.
	 *			stxx.layout.rangeSlider=true; // show the slider
	 *			stxx.changeOccurred("layout"); // signal the change to force a redraw.
	 * 		}
	 * });	 
	 * @example <caption> Declare a range slider and enable/disable using commands to be triggered from a menu</caption>
	 * var stxx=new CIQ.ChartEngine({container:$$$(".chartContainer")}); 
	 * 
	 * // instantiate a range slider
	 * new CIQ.RangeSlider({stx:stxx});
	 *
	 * // To display the slider from a menu use:
	 * stxx.layout.rangeSlider=true; // show the slider
	 * stxx.changeOccurred("layout"); // signal the change to force a redraw.
	 *
	 * // To hide the slider from a menu use:
	 * stxx.layout.rangeSlider=false; // hide the slider
	 * stxx.changeOccurred("layout"); // signal the change to force a redraw.
	 */
	CIQ.RangeSlider=function(params){
		var stx=params.stx;
		stx.slider=this;
		var sliderHeight=params.height?params.height:95;
		var chartContainer=params.chartContainer?$(params.chartContainer):$(params.stx.container);

		var ciqSlider=$('<div class="ciq-chart"></div>');
		var sliderContainer=$('<div class="chartContainer"></div>');
		ciqSlider.insertAfter(chartContainer.parent()).append(sliderContainer);
		ciqSlider.css("height",sliderHeight+"px").css("padding-top","5px").hide();
		sliderContainer.css('height', '100%');
		sliderContainer.prop("dimensionlessCanvas",true);
		var self=this.slider=new CIQ.ChartEngine({container:sliderContainer[0], preferences:{labels:false, whitespace:0}});
		self.xaxisHeight=30;
		self.manageTouchAndMouse=false;
		self.minimumCandleWidth=0;
		self.container.style.cursor="ew-resize";
		var yAxis=self.chart.panel.yAxis;
		yAxis.drawCurrentPriceLabel=false;
		Object.defineProperty(yAxis, 'position', {
			get: function() { return stx.slider.yAxisPosition || stx.chart.panel.yAxis.position; },
			set: function(position) {  stx.slider.yAxisPosition=position; }
		});
		Object.defineProperty(yAxis, 'width', {
			get: function() { if(stx.slider.yAxisWidth===0) return 0; return stx.slider.yAxisWidth || stx.chart.panel.yAxis.width; },
			set: function(width) { stx.slider.yAxisWidth=width; }
		});
		CIQ.extend(yAxis, params.yAxis);
		self.chart.baseline.userLevel=false;
		if(self.controls.home) self.controls.home.style.width=0;
		self.initializeChart();
		var subholder=self.chart.panel.subholder;
		var style=stx.canvasStyle("stx_range_slider shading");

		this.display=function(on){
			if(stx.layout.rangeSlider!==on){  // do this the way it was intended
				stx.layout.rangeSlider=on;
				stx.changeOccurred("layout");
				return;
			}
			ciqSlider[on?"show":"hide"]();
			stx.resizeChart();
			$(window).resize();
			if(!on) return;
			self.resizeChart();
			self.initializeChart();
			self.draw();
			this.drawSlider();
		};
		this.setSymbol=function(symbol){
			self.chart.panel.display=self.chart.symbol=symbol;
			self.setMainSeriesRenderer();
			self.resizeChart();
			this.adjustRange(stx.chart);
			self.draw();
			this.drawSlider();
		};
		this.acceptLayoutChange=function(layout){
			var doDraw=false;
			if(self.layout.rangeSlider!==layout.rangeSlider){
				stx.slider.display(layout.rangeSlider);
			}
			var relevantLayoutPropertiesForRedraw=[ "chartType","aggregationType",
				"periodicity","interval","timeUnit","chartScale","rangeSlider","flipped",
				"extended","marketSessions","kagi","rangebars","renko","priceLines","pandf" ];
			relevantLayoutPropertiesForRedraw.forEach(function(x){
				if(!CIQ.equals(self.layout[x],layout[x])){
					self.layout[x]=layout[x];
					doDraw=true;
				}
			});
			if(!ciqSlider.is(":visible")) return;
			if(doDraw) {
				self.setMainSeriesRenderer();
				self.draw();
				this.drawSlider();
			}
		};
		this.adjustRange=function(chart){
			if(!chart.dataSet) return;
			var myChart=self.chart;
			if(!myChart.width) return;
			var scrollOffset=0, ticksOffset=0;
			if(stx.quoteDriver){
				var behaviorParams={
					symbol:chart.symbol,
					symbolObject:chart.symbolObject,
					interval:stx.layout.interval
				};
				if((behaviorParams.interval=="month" || behaviorParams.interval=="week") && !stx.dontRoll){
					behaviorParams.interval="day";
				}
				var behavior=stx.quoteDriver.getQuoteFeed(behaviorParams).behavior;
				if(behavior && behavior.bufferSize){
					if(chart.moreAvailable) scrollOffset=behavior.bufferSize;
					if(stx.isHistoricalMode()) ticksOffset=behavior.bufferSize;
				}
			}
			myChart.baseline.defaultLevel=chart.baseline.actualLevel;
			myChart.scroll=Math.max(0,chart.dataSet.length-stx.tickFromDate(chart.endPoints.begin)-scrollOffset)+1;
			myChart.maxTicks=myChart.scroll-ticksOffset+1;
			self.layout.candleWidth=myChart.width/myChart.maxTicks;
		};
		this.copyData=function(chart){
			if(!chart.dataSet) return;
			var myChart=self.chart;
			myChart.masterData=self.masterData=chart.masterData;
			myChart.dataSet=chart.dataSet;
			myChart.state=chart.state;
			self.draw();
			this.drawSlider();
		};
		this.calculateYAxisPosition=function(){
			var panel=self.chart.panel;
			var currentPosition=self.getYAxisCurrentPosition(panel.yAxis,panel);
			if(currentPosition!=panel.yAxis.position)
				self.calculateYAxisPositions();
		};
		this.drawSlider=function(){
			if(!ciqSlider.is(":visible")) return;
			if(!stx.chart.dataSet || !stx.chart.dataSet.length) return;
			var chartPanel=stx.chart.panel, ctx=self.chart.context, segmentImage=self.chart.segmentImage || [], halfCandle=self.layout.candleWidth/2;
			var left=self.tickLeft=Math.max(stx.tickFromPixel(chartPanel.left+halfCandle), 0);
			var right=self.tickRight=Math.min(stx.tickFromPixel(chartPanel.right-halfCandle),stx.chart.dataSet.length-1);
			var pLeft=self.pixelLeft=self.pixelFromTick(left)-(segmentImage[left]?segmentImage[left].candleWidth/2:halfCandle);
			var pRight=self.pixelRight=self.pixelFromTick(right)+(segmentImage[right]?segmentImage[right].candleWidth/2:halfCandle);
			var leftBoundary=subholder.offsetLeft, rightBoundary=leftBoundary+subholder.offsetWidth;
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle=style.backgroundColor;
			ctx.fillRect(leftBoundary, subholder.offsetTop, pLeft-leftBoundary, subholder.offsetHeight);
			ctx.fillRect(rightBoundary, subholder.offsetTop, pRight-rightBoundary, subholder.offsetHeight);
			ctx.strokeStyle=style.borderTopColor;
			ctx.lineWidth=parseInt(style.borderWidth,10);
			ctx.moveTo(pLeft,subholder.offsetTop);
			ctx.lineTo(pLeft,subholder.offsetTop+subholder.offsetHeight);
			ctx.moveTo(pRight,subholder.offsetTop);
			ctx.lineTo(pRight,subholder.offsetTop+subholder.offsetHeight);
			ctx.stroke();
			ctx.beginPath();
			ctx.lineWidth=parseInt(style.width,10);
			ctx.lineCap="round";
			ctx.moveTo(pLeft,subholder.offsetTop+subholder.offsetHeight/4);
			ctx.lineTo(pLeft,subholder.offsetTop+3*subholder.offsetHeight/4);
			ctx.moveTo(pRight,subholder.offsetTop+subholder.offsetHeight/4);
			ctx.lineTo(pRight,subholder.offsetTop+3*subholder.offsetHeight/4);
			ctx.stroke();
			ctx.restore();
		};
		stx.addEventListener("layout",function(obj){
			obj.stx.slider.acceptLayoutChange(obj.stx.layout);
		});
		stx.addEventListener("preferences",function(obj){
			var language=obj.stx.preferences.language;
			if(CIQ.I18N && self.preferences.language!=language){
				CIQ.I18N.localize(self, language);
			}
			self.preferences.language=language;
			self.draw();
		});
		stx.addEventListener("symbolChange",function(obj){
			if(obj.action=="master") obj.stx.slider.setSymbol(obj.symbol);
		});
		stx.addEventListener("symbolImport",function(obj){
			if(obj.action=="master") obj.stx.slider.setSymbol(obj.symbol);
			obj.stx.slider.acceptLayoutChange(obj.stx.layout);
		});
		stx.addEventListener("theme",function(obj){
			self.clearPixelCache();
			self.styles={};
			self.chart.container.style.backgroundColor="";
			var helper=new CIQ.ThemeHelper({stx:obj.stx});
			helper.params.stx=self;
			helper.update();
		});
		stx.append("createDataSet",function(){
			this.slider.adjustRange(this.chart);
			this.slider.copyData(this.chart);
		});
		stx.append("draw",function(){
			if(!ciqSlider.is(":visible")) return;
			if(!self.chart.dataSet) return;
			this.slider.adjustRange(this.chart);
			this.slider.calculateYAxisPosition();
			self.draw();
			this.slider.drawSlider();
		});
		stx.prepend("resizeChart",function(){
			var ciqChart=chartContainer.parent(), chartArea=ciqChart.parent();
			var heightOffset=ciqChart.height()-chartContainer.height();
			var totalHeightOfContainers=chartArea.height();
			chartArea.find(".chartContainer").each(function(){
				if(this!==chartContainer[0] && $(this).is(":visible")) totalHeightOfContainers-=$(this).parent().outerHeight(true);
			});
			ciqChart.height(totalHeightOfContainers);
			chartContainer.height(ciqChart.height()-heightOffset);
			if(this.layout.rangeSlider){
				ciqSlider.show();
				self.resizeChart();
				self.initializeChart();
				self.draw();
				this.slider.drawSlider();
			}else{
				ciqSlider.hide();
			}
		});
		$(subholder).on("mousedown touchstart pointerdown", function(e){
			var start=e.offsetX;
			if(!start && start!==0) start=e.originalEvent.layerX;
			if(!start && start!==0) return; // wrong event
			var s=$(self);
			s.prop("startDrag",start)
			 .prop("startPixelLeft",self.pixelLeft)
			 .prop("startPixelRight",self.pixelRight);
			var bw=parseInt(style.borderLeftWidth,10);
			start+=this.offsetLeft;
			if(start<self.pixelRight-bw) s.prop("needsLeft",true);
			if(start>self.pixelLeft+bw) s.prop("needsRight",true);
			if(CIQ.touchDevice) return;
			CIQ.appendClassName(e.target,"stx-drag-chart");
		});
		$(subholder).on("mouseup mouseout touchend pointerup", function(e){
			CIQ.unappendClassName(e.target, "stx-drag-chart");
			var s=$(self);
			self.container.style.cursor="ew-resize";
			s.prop("startDrag",null)
			 .prop("needsLeft",false)
			 .prop("needsRight",false);
		});
		$(subholder).on("mousemove touchmove pointermove", function(e){
			var s=$(self);
			var startDrag=s.prop("startDrag");
			if(!startDrag && startDrag!==0) return;
			var touches=e.originalEvent.touches;
			var movement=(touches && touches.length) ? self.backOutX(touches[0].pageX) - e.target.offsetLeft : e.offsetX;
			if(!movement && movement!==0) return;  // wrong event
			self.container.style.cursor="grab";
			movement-=startDrag;
			var tickLeft=self.tickLeft,tickRight=self.tickRight;
			var startPixelLeft=s.prop("startPixelLeft"), startPixelRight=s.prop("startPixelRight");
			var needsLeft=s.prop("needsLeft"), needsRight=s.prop("needsRight");
			if(needsLeft){
				if(startPixelLeft+movement<self.chart.left) movement=self.chart.left-startPixelLeft;
				if(needsRight && startPixelRight+movement>=self.chart.right) {
					movement=self.chart.right-startPixelRight;
					if(!self.isHome()) movement+=self.layout.candleWidth/2;  // force a right scroll
				}
				tickLeft=self.tickFromPixel(startPixelLeft+movement);
				if(needsRight) tickRight=tickLeft+self.tickRight-self.tickLeft;
			}
			else if(needsRight){
				tickRight=Math.min(self.tickFromPixel(startPixelRight+movement),stx.chart.dataSet.length-1);
			}
			else return;

			var newCandleWidth=stx.chart.width/(tickRight-tickLeft+1);
			if(tickRight>=tickLeft && newCandleWidth>=stx.minimumCandleWidth){
				self.tickLeft=tickLeft;
				self.tickRight=tickRight;
				stx.chart.scroll=stx.chart.dataSet.length-tickLeft;
				if(!needsLeft || !needsRight){
					stx.setCandleWidth(newCandleWidth);
				}
				stx.micropixels=0;
				stx.draw();
			}
		});
		this.adjustRange(stx.chart);
		this.copyData(stx.chart);
	};





	/**
	 * Add-On that creates a hovering "tooltip" as mouse is moved over the chart when the cross-hairs are active.
	 *
	 * Tooltip Example <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/5kux6j8p/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 *
	 * The tool-tip is directly linked to the cross-hairs. So if you disable the cross hairs, the tool-tip also goes away.
	 *
	 * To toggle cross-hairs use <a href="CIQ.ChartEngine.html#layout%5B%60crosshair%60%5D">CIQ.ChartEngine.layout.crosshair</a>. Set to `true` or `false` as needed.
	 *
	 * Requires `jquery` and `addOns.js`; as well as `markers.js` to be bundled in `chartiq.js`.
	 *
	 * There can be only one CIQ.Tooltip per chart.
	 *
	 * Color and layout can be customized via `stx-hu-tooltip` and related CSS classes. Defaults can be found in `stx-chart.css`.
	 *
	 * CIQ.Tooltip automatically creates its own HTML inside the chart container.
	 * Here is an example of the structure (there will be one field tag per displayed element):
	 * ```
	 * <stx-hu-tooltip>
	 * 		<stx-hu-tooltip-field>
	 * 			<stx-hu-tooltip-field-name></stx-hu-tooltip-field-name>
	 * 			<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
	 * 		</stx-hu-tooltip-field>
	 * </stx-hu-tooltip>
	 * ```
	 * By default, the `stx-hu-tooltip-field` elements are inserted in the following order:
	 * - DT
	 * - Open
	 * - High
	 * - Low
	 * - Close
	 * - Volume
	 * - series
	 * - studies
	 *
	 * But the default layout can be changed. You can override the order of fields or change the labels by manually inserting
	 * the HTML that the tooltip would otherwise have created for that field.
	 * If no override HTML is found for a particular field, the default will be used.
	 * This HTML must be placed *inside the chart container*.
	 *
	 * All of the code is provided in `addOns.js` and can be fully customized by copying the source code from the library and overriding
	 * the functions with your changes. Be sure to never modify a library file as this will hinder upgrades.
	 * 
	 * For example, concatenating the field name ( ie: 'Jaw' ) with the study name ( ie: 'Alligator' ) is the default behavior of the tooltip for displaying the value title.
	 * Feel free to override this behavior by creating your own custom version of the renderFunction() for the CIQ.Tooltip.
	 * To do this, copy the entire CIQ.Tooltip code (found in addOns.js) and make the changes to your custom version. Load your custom version instead.
	 * Specifically, look for the following code in renderFunction() that pushes out the text for each study field:
	 * ```
	 * $("<stx-hu-tooltip-field auto></stx-hu-tooltip-field>")
	 * .append($("<stx-hu-tooltip-field-name>"+this.translateIf(fieldName)+"</stx-hu-tooltip-field-name>"))
	 * .append($("<stx-hu-tooltip-field-value>"+fieldValue+"</stx-hu-tooltip-field-value>"))
	 * .appendTo(node);
	 * ```
	 * Replace `fieldName` with anything you want to use as the field title and push that instead.
	 *
	 * Visual Reference:<br>
	 * ![stx-hu-tooltip](stx-hu-tooltip.png "stx-hu-tooltip")
	 *
	 * @param {object} tooltipParams The constructor parameters.
	 * @param {CIQ.ChartEngine} [tooltipParams.stx] The chart object.
	 * @param {boolean} [tooltipParams.ohl] set to true to show OHL data (Close is always shown).
	 * @param {boolean} [tooltipParams.volume] set to true to show Volume.
	 * @param {boolean} [tooltipParams.series] set to true to show value of series.
	 * @param {boolean} [tooltipParams.studies] set to true to show value of studies.
	 * @param {boolean} [tooltipParams.showOverBarOnly] set to true to show tooltip only when over the primary line/bars.
	 * @param {boolean} [tooltipParams.change] set to true to show the change in daily value when isDailyInterval
	 * @param {boolean} [tooltipParams.interpolation] set to true to show the estimated value when there is no data between bars. **Note** that a value of `null` is not considered missing data. 
	 * @param {boolean} [tooltipParams.useDataZone] set to true to show the date in the dataZone, false to use the displayZone
	 * @constructor
	 * @name  CIQ.Tooltip
	 * @example <caption>Adding a hover tool tip to a chart:</caption>
	 *
	 * //First declare your chart engine
	 * var stxx=new CIQ.ChartEngine({container:$$$(".chartContainer")[0]});
	 *
	 * //Then link the tooltip to that chart.
	 * //Note how we've enabled OHL, Volume, Series and Studies.
	 * new CIQ.Tooltip({stx:stxx, ohl:true, volume:true, series:true, studies:true});
	 *
	 * @example <caption>Customize the order, layout or text in tooltip labels:</caption>
	 * // In this example, we've rearranged the HTML to display the Close field first, then the DT
	 * // We are also labeling the DT 'Date/Time' and the Close 'Last'
	 * // The rest of the fields will be then displayed in their default order.
	 *
	  	<stx-hu-tooltip>
			<stx-hu-tooltip-field field="Close">
				<stx-hu-tooltip-field-name>Last</stx-hu-tooltip-field-name>
				<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
			</stx-hu-tooltip-field>
			<stx-hu-tooltip-field field="DT">
				<stx-hu-tooltip-field-name>Date/Time</stx-hu-tooltip-field-name>
				<stx-hu-tooltip-field-value></stx-hu-tooltip-field-value>
			</stx-hu-tooltip-field>
		</stx-hu-tooltip>
	 *
	 * @example
	 * // Sample CSS for the hover tool tip. Working sample found in stx-chart.css
		stx-hu-tooltip {
			position: absolute;
			left: -50000px;
			z-index: 30;
			white-space: nowrap;
			padding: 6px;
			border: 1px solid gray;
			background-color: rgba(42,81,208,.5);
			color: white;
		}

		stx-hu-tooltip-field {
			display:table-row;
		}

		stx-hu-tooltip-field-name {
			display:table-cell;
			font-weight:bold;
			padding-right:5px;
		}

		stx-hu-tooltip-field-name:after {
			content:':';
		}

		stx-hu-tooltip-field-value {
			display:table-cell;
			text-align:right;
		}
	 * @since
	 * <br>&bull; 09-2016-19
	 * <br>&bull; 5.0.0 now `tooltipParams.showOverBarOnly` available to show tooltip only when over the primary line/bars.
	 * <br>&bull; 5.1.1 [tooltipParams.change] set to true to show the change in daily value when displaying a daily interval.
	 * <br>&bull; 6.2.5 New interpolation flag to show estimated value for missing series data points
	 * <br>&bull; 7.0.0 New useDataZone flag to show the DT in either the dataZone or displayZone date/time
	 */

	CIQ.Tooltip=function(tooltipParams){
		var stx=tooltipParams.stx;
		var showOhl=tooltipParams.ohl;
		var showChange=tooltipParams.change;
		var showVolume=tooltipParams.volume;
		var showSeries=tooltipParams.series;
		var showStudies=tooltipParams.studies;
		var showOverBarOnly=tooltipParams.showOverBarOnly;
		var showInterpolation=tooltipParams.interpolation;
		var useDataZone=tooltipParams.useDataZone;

		var node=$(stx.chart.container).find("stx-hu-tooltip")[0];
		if(!node){
			node=$("<stx-hu-tooltip></stx-hu-tooltip>").appendTo($(stx.chart.container))[0];
		}
		CIQ.Marker.Tooltip=function(params){
			if(!this.className) this.className="CIQ.Marker.Tooltip";
			params.label="tooltip";
			CIQ.Marker.call(this, params);
		};

		CIQ.Marker.Tooltip.ciqInheritsFrom(CIQ.Marker,false);

		CIQ.Marker.Tooltip.sameBar=function(bar1, bar2){
			if(!bar1 || !bar2) return false;
			if(+bar1.DT!=+bar2.DT) return false;
			if(bar1.Close!=bar2.Close) return false;
			if(bar1.Open!=bar2.Open) return false;
			if(bar1.Volume!=bar2.Volume) return false;
			return true;
		};

		CIQ.Marker.Tooltip.placementFunction=function(params){
			var offset=30;
			var stx=params.stx;
			for(var i=0;i<params.arr.length;i++){
				var marker=params.arr[i];
				var bar=stx.barFromPixel(stx.cx);
				var quote = stx.chart.dataSegment[bar];
				var goodBar;
				var overBar = true;
				var highPx, lowPx;

				if( quote != "undefined" && quote && quote.DT) {
					goodBar=true;
					if( quote.High ) highPx=stx.pixelFromPrice(quote.High);
					if( quote.Low ) lowPx=stx.pixelFromPrice(quote.Low);
					if( !stx.highLowBars[stx.layout.chartType] ) {
						if( quote.Close ) {
							highPx=stx.pixelFromPrice(quote.Close) - 15;
							lowPx=stx.pixelFromPrice(quote.Close) + 15;
						}
					}
					if( showOverBarOnly && !(stx.cy >= highPx && stx.cy <= lowPx) ) overBar= false;
				}

				if(
				//	(stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
				//	(stx.controls.crossY && stx.controls.crossY.style.display=="none") ||
					!(stx.insideChart &&
						stx.layout.crosshair &&
						stx.displayCrosshairs &&
				//		!stx.overXAxis &&
				//		!stx.overYAxis &&
						!stx.openDialog &&
						!stx.activeDrawing &&
						!stx.grabbingScreen &&
						goodBar &&
						overBar)
				){
					marker.node.style.left="-50000px";
					marker.node.style.right="auto";
					marker.lastBar={};
					return;
				}
				if(CIQ.Marker.Tooltip.sameBar(stx.chart.dataSegment[bar], marker.lastBar) && bar!=stx.chart.dataSegment.length-1) return;
				marker.lastBar=stx.chart.dataSegment[bar];
				var cw=marker.lastBar.candleWidth || stx.layout.candleWidth;
				if(parseInt(getComputedStyle(marker.node).width,10)+stx.chart.panel.left+offset+cw<stx.backOutX(CIQ.ChartEngine.crosshairX)){
					marker.node.style.left="auto";
					marker.node.style.right=Math.round(stx.container.clientWidth-stx.pixelFromBar(bar)+offset)+"px";
				}else{
					marker.node.style.left=Math.round(stx.pixelFromBar(bar)+offset)+"px";
					marker.node.style.right="auto";
				}
				var height=parseInt(getComputedStyle(marker.node).height,10);
				var top=Math.round(CIQ.ChartEngine.crosshairY-stx.top-height/2);
				if(top+height>stx.height) top=stx.height-height;
				if(top<0) top=0;
				marker.node.style.top=top+"px";
			}
			// temporarily disable overXAxis, overYAxis so the crosshairs don't hide if touch device and over Y axis (this can happen
			// due to the offset which we apply)
			var overXAxis=stx.overXAxis, overYAxis=stx.overYAxis;
			stx.overXAxis=stx.overYAxis=false;
			stx.doDisplayCrosshairs();
			stx.overXAxis=overXAxis;
			stx.overYAxis=overYAxis;
		};

		function renderFunction(){
			// the tooltip has not been initialized with this chart.
			if(!this.huTooltip) return;

			// crosshairs are not on
			if(
				(stx.controls.crossX && stx.controls.crossX.style.display=="none") ||
				(stx.controls.crossY && stx.controls.crossY.style.display=="none")
			) return;

			var bar=this.barFromPixel(this.cx), data=this.chart.dataSegment[bar];
			if(!data) {
				this.positionMarkers();
				return;
			}
			if(CIQ.Marker.Tooltip.sameBar(data, this.huTooltip.lastBar) && bar!=this.chart.dataSegment.length-1) return;
			var node=$(this.huTooltip.node);
			node.find("[auto]").remove();
			node.find("stx-hu-tooltip-field-value").html();

			var panel=this.chart.panel;
			var yAxis=panel.yAxis;
			var dupMap={};
			var fields=[];
			fields.push({member:"DT", display:"DT", panel:panel, yAxis:yAxis});
			fields.push({member:"Close", display:"Close", panel:panel, yAxis:yAxis});
			dupMap.DT=dupMap.Close=1;
			if(showChange && CIQ.ChartEngine.isDailyInterval(this.layout.interval)){
				fields.push({member:"Change", display:"Change", panel:panel, yAxis:yAxis});
			}
			if(showOhl) {
				fields.push({member:"Open", display:"Open", panel:panel, yAxis:yAxis});
				fields.push({member:"High", display:"High", panel:panel, yAxis:yAxis});
				fields.push({member:"Low", display:"Low", panel:panel, yAxis:yAxis});
				dupMap.Open=dupMap.High=dupMap.Low=1;
			}
			if(showVolume) {
				fields.push({member:"Volume", display:"Volume", panel:null, yAxis:null});  // null yAxis use raw value
				dupMap.Volume=1;
			}
			if(showSeries){
				var renderers=this.chart.seriesRenderers;
				for(var renderer in renderers) {
					var rendererToDisplay = renderers[renderer];
					if(rendererToDisplay===this.mainSeriesRenderer) continue;
					panel=this.panels[rendererToDisplay.params.panel];
					yAxis=rendererToDisplay.params.yAxis;
					if(!yAxis && rendererToDisplay.params.shareYAxis) yAxis=panel.yAxis;
					for(var id=0;id<rendererToDisplay.seriesParams.length;id++){
						var seriesParams=rendererToDisplay.seriesParams[id];
						// if a series has a symbol and a field then it maybe a object chain
						var sKey = seriesParams.symbol;
						var subField=seriesParams.field;
						if(!sKey) sKey = subField;
						else if (subField && sKey!=subField) sKey=CIQ.createObjectChainNames(sKey,subField)[0];
						var display=seriesParams.display || seriesParams.symbol || seriesParams.field;
						if(sKey && !dupMap[display]){
							fields.push({member:sKey, display:display, panel:panel, yAxis:yAxis, isSeries:true});
							dupMap[display]=1;
						}
					}
				}
			}
			if(showStudies){
				for(var study in this.layout.studies) {
					var sd=this.layout.studies[study];
					panel=this.panels[sd.panel];
					yAxis = panel && sd.getYAxis(this);
					for(var output in this.layout.studies[study].outputMap) {
						if(output && !dupMap[output]) {
							fields.push({member:output, display:output, panel:panel, yAxis:yAxis});
							dupMap[output]=1;
						}
					}
					if(!dupMap[study+"_hist"]){
						fields.push({member:study+"_hist", display:study+"_hist", panel:panel, yAxis:yAxis});
						fields.push({member:study+"_hist1", display:study+"_hist1", panel:panel, yAxis:yAxis});
						fields.push({member:study+"_hist2", display:study+"_hist2", panel:panel, yAxis:yAxis});
						dupMap[study+"_hist"]=1;
					}
				}
			}
			for(var f=0;f<fields.length;f++){
				var obj=fields[f];
				var name = obj.member;
				var displayName = obj.display;
				var isRecordDate=(name=="DT");
				if(isRecordDate && !useDataZone && !CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) name="displayDate"; // display date is timezone adjusted
				panel = obj.panel;
				yAxis = obj.yAxis;
				var labelDecimalPlaces=null;
				if(yAxis){
					if(!panel || panel!==panel.chart.panel){
						// If a study panel, use yAxis settings to determine decimal places
						if(yAxis.decimalPlaces || yAxis.decimalPlaces===0) labelDecimalPlaces=yAxis.decimalPlaces;
						else if(yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces===0) labelDecimalPlaces=yAxis.maxDecimalPlaces;
					}else{
						// If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
						// but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
						labelDecimalPlaces=Math.max(yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
						//	... and never display more decimal places than the symbol is supposed to be quoting at
						if(yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces===0) labelDecimalPlaces=Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces);
					}
				}
				var dsField=null;
				// account for object chains
				var tuple=CIQ.existsInObjectChain(data,name);
				if(tuple) dsField=tuple.obj[tuple.member];
				else if(name=="Change") dsField=data.Close-data.iqPrevClose;

				var fieldName=displayName.replace(/^(Result )(.*)/,"$2");

				if(showInterpolation && fields[f].isSeries && (dsField === null || typeof(dsField)=="undefined")) { // do this only for additional series and not the main series
					var seriesPrice = this.valueFromInterpolation(bar, fieldName, "Close", panel, yAxis);
					if(seriesPrice === null) break;
					dsField = seriesPrice;
				}
				if((dsField || dsField===0) &&
					(isRecordDate || typeof dsField!=="object" || dsField.Close || dsField.Close===0)
				){
					var fieldValue="";
					if(dsField.Close || dsField.Close===0) dsField=dsField.Close;
					if(dsField.constructor==Number){
						if(!yAxis){  // raw value
							fieldValue=dsField;
						}else if(yAxis.originalPriceFormatter && yAxis.originalPriceFormatter.func){ // in comparison mode with custom formatter
							fieldValue=yAxis.originalPriceFormatter.func(this, panel, dsField, labelDecimalPlaces);
						}else if(yAxis.priceFormatter && yAxis.priceFormatter!=CIQ.Comparison.priceFormat){  // using custom formatter
							fieldValue=yAxis.priceFormatter(this, panel, dsField, labelDecimalPlaces);
						}else{
							fieldValue=this.formatYAxisPrice(dsField, panel, labelDecimalPlaces, yAxis);
						}
					}else if(dsField.constructor==Date){
						if( isRecordDate && this.controls.floatDate && this.controls.floatDate.innerHTML ) {
							if(this.chart.xAxis.noDraw) fieldValue="N/A";
							else fieldValue=CIQ.displayableDate(this,panel.chart,dsField);
						} else {
							fieldValue=CIQ.yyyymmdd(dsField);
							if(!CIQ.ChartEngine.isDailyInterval(this.layout.interval)){
								fieldValue+=" "+dsField.toTimeString().substr(0,8);
							}
						}
					}else{
						fieldValue=dsField;
					}
					var dedicatedField=node.find('stx-hu-tooltip-field[field="'+fieldName+'"]');
					if(dedicatedField.length){
						dedicatedField.find("stx-hu-tooltip-field-value").html(fieldValue);
						var fieldNameField=dedicatedField.find("stx-hu-tooltip-field-name");
						if(fieldNameField.html()==="")
							fieldNameField.html(this.translateIf(fieldName));
					}else{
						$("<stx-hu-tooltip-field auto></stx-hu-tooltip-field>")
							.append($("<stx-hu-tooltip-field-name>"+this.translateIf(fieldName)+"</stx-hu-tooltip-field-name>"))
							.append($("<stx-hu-tooltip-field-value>"+fieldValue+"</stx-hu-tooltip-field-value>"))
							.appendTo(node);
					}
				}else{
					var naField=node.find('stx-hu-tooltip-field[field="'+fieldName+'"]');
					if(naField.length){
						var naFieldNameField=naField.find("stx-hu-tooltip-field-name");
						if(naFieldNameField.html()!=="")
							naField.find("stx-hu-tooltip-field-value").html("n/a");
					}
				}
			}
			this.huTooltip.render();
		}

		CIQ.ChartEngine.prototype.append("undisplayCrosshairs",function(){
			var tt=this.huTooltip;
			if( tt && tt.node ) {
				var node=$(tt.node);
				if( node && node[0]){
					node[0].style.left="-50000px";
					node[0].style.right="auto";
					tt.lastBar={};
				}
			}
		});
		CIQ.ChartEngine.prototype.append("deleteHighlighted",function(){
			this.huTooltip.lastBar={};
			this.headsUpHR();
		});
		CIQ.ChartEngine.prototype.append("headsUpHR", renderFunction);
		CIQ.ChartEngine.prototype.append("createDataSegment", renderFunction);
		stx.huTooltip=new CIQ.Marker.Tooltip({ stx:stx, xPositioner:"bar", chartContainer:true, node:node });
	};




	return _exports;
});
