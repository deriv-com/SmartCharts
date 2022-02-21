/**
 *	8.2.0
 *	Generation date: 2022-02-18T13:21:32.984Z
 *	Client name: deriv limited
 *	Package Type: Technical Analysis
 *	License type: annual
 *	Expiration date: "2023/04/01"
 *	Domain lock: ["127.0.0.1","localhost","deriv.com","deriv.app","deriv.me","binary.com","binary.sx","binary.me","binary.bot","deriv.be"]
 *	iFrame lock: true
 */

/***********************************************************
 * Copyright by ChartIQ, Inc.
 * Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
*************************************************************/
/*************************************** DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! **************************************/
/* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting */
/* and load that file right after the library has been loaded, but before the chart engine is instantiated.              */
/* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          */
/*************************************************************************************************************************/
/* eslint-disable no-extra-parens */




let __js_core__init_ = (_exports) => {

	//-------------------------------------------------------------------------------------------
	// Required objects and functions for initialization
	//-------------------------------------------------------------------------------------------
	
	var timezoneJS = (_exports.timezoneJS = {});
	
	/**
	 * Base namespace for CIQ library
	 *
	 * Previously `STX`
	 * @name CIQ
	 * @namespace
	 */
	function CIQ() {}
	_exports.CIQ = CIQ;
	
	/**
	 * Creates a template for JavaScript inheritance.
	 *
	 * By default the constructor (ctor) is called with no arguments.
	 *
	 * @param {object} me The object to receive the inheritance.
	 * @param {object} ctor The parent class or object.
	 * @param {boolean} [autosuper=true] Set to false to prevent the base class constructor from being called automatically.
	 * @since 7.4.0 Replaces {@link Function#ciqInheritsFrom}.
	 * @memberof CIQ
	 */
	CIQ.inheritsFrom = function (me, ctor, autosuper) {
		var parent = ctor.prototype || Object.getPrototypeOf(ctor);
	
		me.prototype =
			autosuper !== false && typeof ctor === "function"
				? new ctor()
				: Object.create(parent);
	
		Object.defineProperties(me.prototype, {
			constructor: {
				configurable: true,
				enumerable: false,
				value: me,
				writable: true
			},
			parent: {
				configurable: true,
				enumerable: false,
				value: parent,
				writable: true
			}
		});
	};
	
	/**
	 * Extends an object, similar to jquery.extend() with a deep copy
	 *
	 * Only does a recursive deep copy if the *source* is plain object.
	 *
	 * @param {object} target Target object
	 * @param  {object} source Original object
	 * @param {boolean} [shallow] If true then extend will not recurse through objects
	 * @return {object} Target object after extension
	 * @since
	 * - 5.1.0 Undefined properties do not copy to target object.
	 * - 5.2.0 Target of a deep copy may now be a class instance.
	 * @memberof CIQ
	 */
	CIQ.extend = function (target, source, shallow) {
		var key, value;
	
		for (key in source) {
			value = source[key];
	
			if (target === value || value === undefined) {
				continue;
			} else if (value === null || shallow === true) {
				target[key] = value;
			} else if (value.constructor == Array) {
				target[key] = value.slice();
			} else if (value.constructor == Object) {
				// it is ok if `target[key]` is a class instance
				target[key] = CIQ.extend(
					typeof target[key] === "object" && target[key] !== null
						? target[key]
						: {},
					value
				);
			} else {
				// `value` is a primitive type or a class instance (other than Object & Array)
				target[key] = value;
			}
		}
	
		return target;
	};
	
	/**
	 * Activates an import. Should be called to activate an import for use by the API. If an
	 * import is not activated, its code is inaccessible and may be tree shaken by bundlers. Keeps
	 * track of which imports have been activated already so no import gets added more than
	 * once.
	 *
	 * Each feature, component, or add-on is considered an import. For example, studies, drawings,
	 * and {@link CIQ.RangeSlider} are imports.
	 *
	 * See the webpack examples (*webpack.config.js* and *webpack.config.minimal.js* in the root
	 * folder of the library) for detailed examples of how to import.
	 *
	 * **Note:** `DefinePlugin` needs to be included in the *webpack.config.js* file in order to
	 * achieve tree shaking. Otherwise, all imports are automatically activated without the need
	 * for the developer to explicitly call this function.
	 *
	 * @param {...object} imports A list of imports to add to the namespace.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 */
	CIQ.activateImports = function (...imports) {
		let CIQ = this;
		if (!CIQ.activatedImports) CIQ.activatedImports = {};
		imports.forEach((m) => {
			if (typeof m == "function") {
				if (!(m.__guid in CIQ.activatedImports)) {
					// Add a guid onto the module to keep track of it
					m.__guid = CIQ.uniqueID(true);
					CIQ.activatedImports[m.__guid] = m.__name || m.name;
					m(_exports);
				}
			}
		});
	};
	
	};
	
	
	let __js_core__polyfills_ = (_exports) => {
	
	
	/*jshint -W079 */ // ignore redefinition of Event, CustomEvent
	
	var root =
		typeof window !== "undefined"
			? window
			: typeof global !== "undefined"
			? global
			: {};
	
	// IE 11 compatibility
	{
		var Event = function (event, params) {
			var self = document.createEvent("Event");
	
			self.initEvent(
				event,
				!!(params && params.bubbles),
				!!(params && params.cancelable)
			);
	
			return self;
		};
	
		if (root.Event && typeof root.Event !== "function") {
			Event.prototype = root.Event.prototype;
			root.Event = Event;
		}
	
		var CustomEvent = function (event, params) {
			var self = document.createEvent("CustomEvent");
	
			self.initCustomEvent(
				event,
				!!(params && params.bubbles),
				!!(params && params.cancelable),
				params && params.detail
			);
	
			return self;
		};
	
		if (root.CustomEvent && typeof root.CustomEvent !== "function") {
			CustomEvent.prototype = root.CustomEvent.prototype;
			root.CustomEvent = CustomEvent;
		}
	}
	
	// Node.js compatibility
	{
		if (typeof global !== "undefined") {
			if (typeof global.CanvasRenderingContext2D === "undefined")
				global.CanvasRenderingContext2D = function () {};
		}
	}
	
	};
	
	
	let __js_core_browserDetect_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	var nav = typeof navigator !== "undefined" ? navigator : { userAgent: "" };
	var userAgent = nav.userAgent;
	var win = typeof window !== "undefined" ? window : {};
	var doc = typeof document !== "undefined" ? document : {};
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iPad
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.ipad =
		userAgent.indexOf("iPad") != -1 /* iOS pre 13 */ ||
		(nav.platform === "MacIntel" && nav.maxTouchPoints > 1); /* iPad OS 13 */
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iPhone
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.iphone = userAgent.indexOf("iPhone") != -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an Android OS device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isAndroid = userAgent.toLowerCase().indexOf("android") > -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a IE browser
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIE =
		userAgent.toLowerCase().indexOf("msie") > -1 ||
		userAgent.indexOf("Trident/") > -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a Edge Legacy browser
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isEdge = userAgent.indexOf("Edge/") > -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a Safari browser
	 * @memberof CIQ
	 * @type boolean
	 * @since 7.4.0
	 */
	CIQ.isSafari = userAgent.indexOf("Safari/") > -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iOS 7 device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIOS7 = userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i);
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iOS 8 device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIOS8 = userAgent.match(/(iPad|iPhone);.*CPU.*OS 8_\d/i);
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iOS 9 device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIOS9 = userAgent.match(/(iPad|iPhone);.*CPU.*OS 9_\d/i);
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an iOS 10 device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIOS10 = userAgent.match(/(iPad|iPhone);.*CPU.*OS 10_\d/i);
	/**
	 * READ ONLY. Will be 'true' if the chart is running on an IOS7, IOS8, IOS9 or IOS10 device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isIOS7or8 = CIQ.isIOS7 || CIQ.isIOS8 || CIQ.isIOS9 || CIQ.isIOS10;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a mobile device ( CIQ.isAndroid, CIQ.ipad, or CIQ.iphone )
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isMobile = CIQ.isAndroid || CIQ.ipad || CIQ.iphone;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a touch capable device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.touchDevice = doc.ontouchstart !== undefined || nav.maxTouchPoints > 1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a MS Surface like device
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isSurface =
		CIQ.touchDevice && (CIQ.isEdge || CIQ.isIE || userAgent.indexOf("Edg/") > -1); // Edg/ is Chromium Edge
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a Chrome browser
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.is_chrome = userAgent.toLowerCase().indexOf("chrome") > -1 && !CIQ.isEdge;
	/**
	 * READ ONLY. Will be 'true' if the chart is running on a Firefox browser
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isFF = userAgent.toLowerCase().indexOf("firefox") > -1;
	/**
	 * READ ONLY. Will be 'true' if the chart is running from a MS Surface application
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.isSurfaceApp = win.MSApp;
	
	/**
	 * READ ONLY. Will be 'true' if the chart supports web components
	 * @memberof CIQ
	 * @type boolean
	 * @since 6.1.0
	 */
	CIQ.isWebComponentsSupported =
		typeof document !== "undefined" &&
		"registerElement" in document &&
		"import" in document.createElement("link") &&
		"content" in document.createElement("template");
	/**
	 * READ ONLY. Will be 'true' if the chart is running from a device with no Keyboard ( CIQ.isMobile or CIQ.isSurfaceApp )
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.noKeyboard = CIQ.isMobile || CIQ.isSurfaceApp;
	
	};
	
	
	let __js_core_canvasutil_ = (_exports) => {
	
	
	if (!_exports.SplinePlotter) _exports.SplinePlotter = {};
	
	var CIQ = _exports.CIQ,
		splinePlotter = _exports.SplinePlotter;
	
	/*
	 * Default implementation of plotSplinePrimitive.  Load splines.js to get alternate splining.
	 */
	var plotSplinePrimitive = function (
		points,
		tension,
		context,
		colorPatternChanges
	) {
		var colorPatternIndex = 0;
		if (!colorPatternChanges) colorPatternChanges = [];
		function seeIfStrokeNeeded(i) {
			if (colorPatternIndex == colorPatternChanges.length) return;
			var colorPatternChange = colorPatternChanges[colorPatternIndex];
			if (
				colorPatternChange.coord[0] == points[i] &&
				colorPatternChange.coord[1] == points[i + 1]
			) {
				context.stroke();
				context.strokeStyle = colorPatternChange.color;
				context.setLineDash(colorPatternChange.pattern);
				context.lineDashOffset = 0;
				context.lineWidth = colorPatternChange.width;
				context.beginPath();
				context.moveTo(points[i], points[i + 1]); //reset back to last point
				colorPatternIndex++;
			}
		}
		if (!tension || tension < 0) tension = 0;
		var n = points.length;
		/*
		 * This algorithm takes four points: the prior point, the starting point, the ending point, and the next point
		 * and draws a bezier curve between starting and ending point such that the next bezier curve will be a continuation
		 * of that smooth curve.
		 * The four control points are computed based on an offset of the four provided points.
		 * The offset is the product of a constant derived from a user-supplied "tension", and the difference between
		 * the points.  For the first control point the difference is between the endpoint and the previous point.
		 * For the second control point the difference is between the next point and the starting point.
		 * On the first iteration we just set the previous point to the first point, and on the last iteration
		 * we set the next point to the ending point.
		 * The tension controls how far the control points will be from the start and end points.  The tension is attenuated in each calculation
		 * based on the ratio of the length of the currently plotted segment and the segment adjacent to the control point being calculated.
		 * The control points are also limited in the case of 2 local extrema, to prevent "overshooting" of the min/max represented by those two points.
		 * Plot will therefore resemble a good approximation of a monotonic cubic spline.
		 * Inspired by:
		 * https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas/49371349#49371349 (Roy Aarts)
		 * It's not an exact spline interpolation formula but it works well in that the curve can be controlled to not
		 * overshoot the point it is intersecting.
		 */
		context.moveTo(points[0], points[1]);
		for (var i = 0; i < n - 3; i += 2) {
			seeIfStrokeNeeded(i);
			var p = [];
			p[0] = { x: points[Math.max(0, i - 2)], y: points[Math.max(1, i - 1)] };
			p[1] = { x: points[i], y: points[i + 1] };
			p[2] = { x: points[i + 2], y: points[i + 3] };
			p[3] = {
				x: points[Math.min(n - 2, i + 4)],
				y: points[Math.min(n - 1, i + 5)]
			};
			if (n === 4) tension = 0; // force a straight line between only two points
			plotBetween(i, p, tension);
		}
		function plotBetween(i, p, tension) {
			[1, 2].forEach((j) => {
				p[j].cp = {}; // control points
				["x", "y"].forEach(function (ax) {
					var tf =
						1 /
						(1 +
							Math.sqrt(
								Math.pow(p[2 * j - 1].x - p[2 * j - 2].x, 2) +
									Math.pow(p[2 * j - 1].y - p[2 * j - 2].y, 2)
							) /
								Math.sqrt(
									Math.pow(p[2].x - p[1].x, 2) + Math.pow(p[2].y - p[1].y, 2)
								)); // tension factor, attenuates the tension based on ratio of line lengths
					p[j].cp[ax] =
						p[j][ax] +
						(3 - 2 * j) * (p[j + 1][ax] - p[j - 1][ax]) * tension * (tf || 0);
					// limits on focal points to force monotonicity
					if (p[j].cp[ax] < Math.min(p[1][ax], p[2][ax]))
						p[j].cp[ax] = Math.min(p[1][ax], p[2][ax]);
					if (p[j].cp[ax] > Math.max(p[1][ax], p[2][ax]))
						p[j].cp[ax] = Math.max(p[1][ax], p[2][ax]);
				});
			});
			if (i === 0) {
				context.quadraticCurveTo(p[2].cp.x, p[2].cp.y, p[2].x, p[2].y);
			} else if (i === n - 4) {
				// last pair of points
				context.quadraticCurveTo(p[1].cp.x, p[1].cp.y, p[2].x, p[2].y);
			} else {
				context.bezierCurveTo(
					p[1].cp.x,
					p[1].cp.y,
					p[2].cp.x,
					p[2].cp.y,
					p[2].x,
					p[2].y
				);
			}
		}
	};
	// If splines.js has not been included then set it with our default implementation
	if (!_exports.SplinePlotter.plotSpline)
		_exports.SplinePlotter.plotSpline = plotSplinePrimitive;
	
	/**
	 * <span class="animation">Animation Loop</span>
	 *
	 * Clears the canvas. Uses the fastest known method except on the legacy Android browser which had many problems!
	 * @param  {object} canvas A valid HTML canvas object
	 * @param  {object} [stx]    A chart object, only necessary for old Android browsers on problematic devices
	 * @memberof CIQ
	 */
	CIQ.clearCanvas = function (canvas, stx) {
		canvas.isDirty = false;
		var ctx = canvas.context;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (CIQ.isAndroid && !CIQ.is_chrome && !CIQ.isFF) {
			// Android browser last remaining
			// one to need this clearing method
			if (CIQ.ChartEngine.useOldAndroidClear && stx) {
				ctx.fillStyle = stx.containerColor;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			var w = canvas.width;
			canvas.width = 1;
			canvas.width = w;
		}
		var shimHasChildren = stx.chart.canvasShim.childNodes.length > 0;
		if (stx.useBackgroundCanvas || shimHasChildren) {
			stx.useBackgroundCanvas = shimHasChildren;
			if (canvas == stx.chart.canvas)
				CIQ.clearCanvas(stx.chart.backgroundCanvas, stx);
		}
	};
	
	/**
	 * Sets the transparent parts of the canvas to the specified background color. Used to ensure a background when turning charts into images
	 * because normally the background is the background of the DIV container and not the canvas itself.
	 * @param  {object} context An HTML canvas context
	 * @param  {string} color   The color to set the background. Any valid HTML canvas color.
	 * @param  {number} width   Width to apply color (Could be less than size of canvas)
	 * @param  {number} height  Height to apply color (Could be less than size of canvas if applying branding for instance)
	 * @memberof CIQ
	 */
	CIQ.fillTransparentCanvas = function (context, color, width, height) {
		var compositeOperation = context.globalCompositeOperation;
		context.globalCompositeOperation = "destination-over";
		context.fillStyle = color;
		context.fillRect(0, 0, width, height);
		context.globalCompositeOperation = compositeOperation;
	};
	
	/**
	 * Converts a box represented by two corner coordinates [tick0,value0] and [tick1,value1] into pixel coordinates.
	 * @param {CIQ.ChartEngine} stx The chartEngine
	 * @param  {string} panelName  Panel on which the coordinates reside
	 * @param  {object} box Box to convert
	 * @param  {number} [box.x0]
	 * @param  {number} [box.y0]
	 * @param  {number} [box.x1]
	 * @param  {number} [box.y1]
	 * @return  {object} A converted box
	 * @memberof CIQ
	 * @since 6.0.0
	 */
	CIQ.convertBoxToPixels = function (stx, panelName, box) {
		var panel = stx.panels[panelName];
		var bx0 = stx.pixelFromTick(box.x0, panel.chart);
		var bx1 = stx.pixelFromTick(box.x1, panel.chart);
		var by0 =
			box.cy0 || box.cy0 === 0
				? box.cy0
				: stx.pixelFromValueAdjusted(panel, box.x0, box.y0);
		var by1 =
			box.cy1 || box.cy1 === 0
				? box.cy1
				: stx.pixelFromValueAdjusted(panel, box.x1, box.y1);
		return { x0: bx0, x1: bx1, y0: by0, y1: by1 };
	};
	
	/**
	 * Fills an area on the chart, usually created by a study.
	 * @param  {CIQ.ChartEngine} stx    The chart object
	 * @param  {array} points  The set of points, this is an array of chart coordinates in array form
	 * 							e.g. [[x1,y1],[x2,y2]].  The points should be arranged to form a loop;
	 * 							the loop need not be closed.
	 * @param  {object} params  parameters
	 * @param  {string | object} [params.color]  color, canvas gradient object or canvas pattern object to fill the area
	 * @param  {number} [params.opacity] opacity of fill, 0 to 1.  Defaults to 0.1
	 * @param  {number} [params.tension] Tension for splining.
	 * @param  {string} [params.panelName] Name of panel to draw on.  If omitted or invalid, area may fill over top or bottom of plot area
	 * @param  {CIQ.ChartEngine.YAxis} [params.yAxis] The y-axis for the area (will use default axis if not specified)
	 * @since
	 * - 01-2015-20 Added `params.panelName`.
	 * - 4.0.0 Combined arguments into `params`. Added `tension`.
	 * - 5.2.0 Added `params.yAxis`.
	 * @memberof CIQ
	 */
	CIQ.fillArea = function (stx, points, params) {
		if (!points.length) return;
		var ctx = stx.chart.context;
		var globalAlpha = ctx.globalAlpha;
		var color = arguments[2],
			opacity = arguments[3],
			panelName = arguments[4],
			tension = 0,
			yAxis = null;
		if (params && typeof params == "object") {
			color = params.color;
			opacity = params.opacity;
			tension = params.tension;
			panelName = params.panelName;
			yAxis = params.yAxis;
		}
		if (!opacity && opacity !== 0) opacity = 0.2;
		if (color == "auto") color = stx.defaultColor;
		ctx.globalAlpha = opacity;
		if (color) ctx.fillStyle = color;
	
		var b = Number.MAX_VALUE;
		var t = b * -1;
		var panel = stx.panels[panelName];
		if (panel) {
			t = (yAxis || panel.yAxis).top;
			b = (yAxis || panel.yAxis).bottom;
			ctx.save();
			ctx.beginPath();
			ctx.rect(panel.left, t, panel.width, b - t);
			ctx.clip();
		}
		ctx.beginPath();
		var i;
		if (tension) {
			var flatPoints = [];
			for (i = 0; i < points.length - 2; i++) {
				flatPoints.push(points[i][0], points[i][1]);
			}
			splinePlotter.plotSpline(flatPoints, tension, ctx);
			for (i = points.length - 2; i < points.length; i++) {
				ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
				// Chrome 58/59 issue with gradient fills.  Less severe if we round these last 2 points.
			}
		} else {
			ctx.moveTo(points[0][0], points[0][1]);
			for (i = 1; i < points.length; i++) {
				ctx.lineTo(points[i][0], points[i][1]);
			}
		}
		ctx.closePath();
		ctx.fill();
		if (panel) ctx.restore();
	
		ctx.globalAlpha = globalAlpha;
	};
	
	/**
	 * Fills an area on the chart delimited by non intersecting top and bottom bands (channel), usually created by a study.
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param {object} parameters The configuration parameters
	 * @param {string} parameters.panelName The name of the panel
	 * @param {boolean} parameters.noSlopes If set then chart will fill rectangles with no transition lines between levels
	 * @param {string} parameters.topBand The name of the quote field to use as the top band
	 * @param {string} parameters.bottomBand The name of the quote field to use as the bottom band
	 * @param {number} parameters.opacity The color opacity/transparency as a decimal number (1= full opacity / no transparency)
	 * @param {string} parameters.color The fill color
	 * @memberof CIQ
	 * @since 4.1.2 Removed `quotes` argument; function always uses `chart.dataSegment`.
	 * @example
	 * CIQ.prepareChannelFill(stx,{"color":dngradient,"opacity":1,"panelName":sd.name,"topBand":"Zero "+sd.name,"bottomBand":"Under "+sd.name});
	 */
	CIQ.prepareChannelFill = function (stx, parameters) {
		if (!parameters || parameters instanceof Array) parameters = arguments[2]; // backwards compatibility for when quotes was the second argument
		if (!parameters.gapDisplayStyle && parameters.gapDisplayStyle !== false)
			parameters.gapDisplayStyle = parameters.gaps;
		var panel = stx.panels[parameters.panelName],
			chart = stx.chart,
			strokeStyle = chart.context.strokeStyle;
	
		var saveParams = {
			noDraw: parameters.noDraw,
			gapDisplayStyle: parameters.gapDisplayStyle
		};
		var chParams = CIQ.ensureDefaults(parameters, {
			noDraw: true,
			gapDisplayStyle: {},
			yAxis: panel.yAxis
		});
	
		var rcTop = stx.plotDataSegmentAsLine(parameters.topBand, panel, chParams);
		var rcBottom = stx.plotDataSegmentAsLine(
			parameters.bottomBand,
			panel,
			chParams
		);
		parameters.noDraw = saveParams.noDraw;
		parameters.gapDisplayStyle = saveParams.gapDisplayStyle;
		var points = [];
		for (var t = 0; t < rcTop.points.length; t += 2) {
			points.push([rcTop.points[t], rcTop.points[t + 1]]);
		}
		for (var b = rcBottom.points.length - 1; b >= 0; b -= 2) {
			points.push([rcBottom.points[b - 1], rcBottom.points[b]]);
		}
		CIQ.fillArea(stx, points, parameters);
		return;
	};
	
	/**
	 * Fills an area on the chart delimited by a series line closed off by a horizontal threshold line, usually created by a study.
	 *
	 * Visual Reference:<br>
	 * ![Elder Force Shading](img-elder-force-shading.png "Elder Force Shading")
	 *
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param {object} parameters The configuration parameters
	 * @param {string} [parameters.panelName] The name of the panel
	 * @param {string} [parameters.band] The name of the quote field to use as the series line
	 * @param {number} [parameters.threshold] The price where the horizontal line hits yaxis/series to enclose the fill area.  If not set will look to parameters.reverse to determine if threshold is the lowest or highest value of the plot.
	 * @param {boolean} [parameters.reverse] Valid only if parameters.threshold is not set.  If this parameter is set to true, threshold will be highest value of plot.  Otherwise, threshold will be lowest value of plot.
	 * @param {number} [parameters.direction] 1 to fill from the threshold upwards or -1 to fill from the threshold downwards
	 * @param {object} [parameters.edgeHighlight] Set to either a color or a Styles object as returned from {@link CIQ.ChartEngine#canvasStyle} to draw the threshold line.
	 * @param {object} [parameters.edgeParameters] The parameters to draw the threshold line as required by {@link CIQ.ChartEngine#plotLine}
	 * @param {object} [parameters.gapDisplayStyle] Gap object as set by See {@link CIQ.ChartEngine#setGapLines}.
	 * @param {number} [parameters.opacity] The color opacity/transparency as a decimal number (1= full opacity / no transparency).  Default is 0.3.
	 * @param {boolean} [parameters.step] True for a step chart
	 * @param {number} [parameters.tension] Tension for splining.
	 * @param {string} [parameters.color] The fill color
	 * @param {boolean} [parameters.roundOffEdges] Round the first and last point's X value to the previous and next integer, respectively.
	 * @param {CIQ.ChartEngine.YAxis} [parameters.yAxis] The y-axis for the band (will use default axis if not specified)
	 * @memberof CIQ
	 * @since
	 * - 4.0.0 Added `parameters.reverse`, made `parameters.threshold` optional in case filling to top or bottom of panel.
	 * - 4.1.2 Removed `quotes` argument; function always uses `chart.dataSegment`.
	 * - 5.2.0 Added `params.yAxis`.
	 * - 5.2.0 Deprecated `parameters.gaps` and replaced with `parameters.gapDisplayStyle`.
	 * @example
	 * if(sd.outputs.Gain) CIQ.preparePeakValleyFill(stx,{panelName:sd.panel, band:"Result " + sd.name, threshold:sd.study.centerline, direction:1, color:sd.outputs.Gain});
	 * if(sd.outputs.Loss) CIQ.preparePeakValleyFill(stx,{panelName:sd.panel, band:"Result " + sd.name, threshold:sd.study.centerline, direction:-1, color:sd.outputs.Loss});
	 * @example
	 * // see visual reference for rendering image
	 * 	CIQ.Studies.displayElderForce=function(stx, sd, quotes){
	 * 		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
	 * 		var color=CIQ.Studies.determineColor(sd.outputs.Result);
	 * 		var panel=stx.panels[sd.panel];
	 * 		var yAxis=sd.getYAxis(stx);
	 * 		var params={skipTransform:panel.name!=sd.chart.name, panelName:sd.panel, band:"Result " + sd.name, threshold:0, color:color, yAxis:yAxis};
	 * 		params.direction=1;
	 * 		CIQ.preparePeakValleyFill(stx,params);
	 * 		params.direction=-1;
	 * 		CIQ.preparePeakValleyFill(stx,params);
	 * 	};
	 */
	CIQ.preparePeakValleyFill = function (stx, parameters) {
		if (!parameters || parameters instanceof Array) parameters = arguments[2]; // backwards compatibility for when quotes was the second argument
		if (!parameters.gapDisplayStyle && parameters.gapDisplayStyle !== false)
			parameters.gapDisplayStyle = parameters.gaps;
		var panel = stx.panels[parameters.panelName],
			yAxis = panel.yAxis,
			chart = stx.chart,
			context = chart.context,
			strokeStyle = context.strokeStyle;
	
		var saveParams = {
			noDraw: parameters.noDraw,
			gapDisplayStyle: parameters.gapDisplayStyle
		};
		var rc = stx.plotDataSegmentAsLine(
			parameters.band,
			panel,
			CIQ.ensureDefaults(parameters, { noDraw: true, gapDisplayStyle: {} })
		);
		parameters.noDraw = saveParams.noDraw;
		parameters.gapDisplayStyle = saveParams.gapDisplayStyle;
		var threshold = parameters.threshold,
			direction = parameters.direction,
			reverse = parameters.reverse,
			gapDisplayStyle = parameters.gapDisplayStyle;
	
		if (parameters.yAxis) yAxis = parameters.yAxis;
		var yMax = -Number.MAX_VALUE,
			yMin = Number.MAX_VALUE,
			yThresh = reverse ? yMax : yMin;
		if (threshold || threshold === 0)
			yThresh = stx.pixelFromPrice(threshold, panel, yAxis); //where threshold hits yaxis
	
		var points = [],
			length = rc.points.length;
		for (var i = 0; i < length; i += 2) {
			var x = rc.points[i],
				y = rc.points[i + 1],
				x1,
				y1;
			if (parameters.roundOffEdges) {
				// round off to whole pixels so color interpolation does not occur when used with fillIntersection
				if (i === 0) x = Math.floor(x);
				else if (i + 2 == length) x = Math.ceil(x);
			}
			if (isNaN(y)) continue;
			var limit =
				(y > yThresh && direction > 0) || (y < yThresh && direction < 0);
			if (!limit) {
				points.push([x, y]);
				yMax = Math.max(y, yMax);
				yMin = Math.min(y, yMin);
			}
			if (i < length - 3) {
				x1 = rc.points[i + 2];
				y1 = rc.points[i + 3];
				if ((y < yThresh && y1 > yThresh) || (y > yThresh && y1 < yThresh)) {
					x += ((yThresh - y) * (x1 - x)) / (y1 - y);
					points.push([x, yThresh]);
				}
			}
		}
		length = points.length;
		if (!length) return;
	
		var edgeParameters = parameters.edgeParameters,
			edgeHighlight = parameters.edgeHighlight;
		if (edgeHighlight) {
			if (edgeParameters.lineWidth > 100) edgeParameters.lineWidth = 1; // trap case where no width is specified in the css
			context.save();
			context.beginPath();
			for (var p = 0; p < length - 1; p++) {
				var point0 = points[p],
					point1 = points[p + 1];
				if (point0[1] == yThresh && point1[1] == yThresh) continue; // here we avoid drawing a horizontal line along the threshold
				if (point0[0] == point1[0] && stx.layout.candleWidth >= 1) {
					// here we try to avoid drawing a vertical line to the threshold (like a gap boundary)
					if (
						point0[1] == yThresh &&
						points[p - 1] &&
						points[p - 1][1] == yThresh
					)
						continue;
					if (
						point1[1] == yThresh &&
						points[p + 2] &&
						points[p + 2][1] == yThresh
					)
						continue;
				}
				stx.plotLine(
					CIQ.extend(
						{
							x0: point0[0],
							x1: point1[0],
							y0: point0[1],
							y1: point1[1],
							color: parameters.edgeHighlight,
							type: "segment",
							context: context,
							confineToPanel: panel,
							deferStroke: true
						},
						edgeParameters
					)
				);
			}
			context.stroke();
			context.restore();
		}
		if (!threshold && threshold !== 0) {
			if (yAxis.flipped) reverse = !reverse;
			yThresh = reverse
				? Math.min(yMin, yAxis.top)
				: Math.max(yMax, yAxis.bottom);
		}
		points.push([points[length - 1][0], yThresh], [points[0][0], yThresh]);
	
		var opacity = parameters.opacity;
		if (!opacity && opacity !== 0) parameters.opacity = 0.3;
		CIQ.fillArea(stx, points, parameters);
		// Now fill in the mountain area under the gap, if required
		if (
			gapDisplayStyle &&
			gapDisplayStyle.color &&
			gapDisplayStyle.fillMountain &&
			!parameters.tension &&
			!CIQ.isTransparent(gapDisplayStyle.color) &&
			!CIQ.isTransparent(
				parameters.color
			) /*need this last check for baseline_mountain to render properly*/
		) {
			context.save();
			if (context.fillStyle instanceof CanvasGradient) {
				var hexGapColor = CIQ.colorToHex(gapDisplayStyle.color);
				var gradient = context.createLinearGradient(
					0,
					direction === 1 ? panel.top : panel.bottom,
					0,
					yThresh
				);
				gradient.addColorStop(0, CIQ.hexToRgba(hexGapColor, 60));
				gradient.addColorStop(1, CIQ.hexToRgba(hexGapColor, 10));
				context.fillStyle = gradient;
			} else {
				context.fillStyle = gapDisplayStyle.color;
			}
			var poly = [];
			var myParams = {
				opacity: parameters.opacity,
				panelName: parameters.panelName
			};
			context.beginPath();
			for (i = 0; i < rc.gapAreas.length; i++) {
				var datum = rc.gapAreas[i];
				var start = datum.start;
				var end = datum.end;
				var thresh = datum.threshold;
				if (start) {
					poly = [
						[start[0], start[1]],
						[start[0], thresh]
					];
				} else {
					poly.push(
						[end[0], thresh],
						[end[0], parameters.step ? poly[0][1] : end[1]]
					);
				}
				if (poly.length == 4) {
					CIQ.fillArea(stx, poly, myParams);
					var lineParams = CIQ.extend(
						{
							x1: poly[3][0],
							y0: poly[0][1],
							type: "segment",
							deferStroke: true,
							context: context,
							confineToPanel: panel
						},
						gapDisplayStyle
					);
	
					if (parameters.step) {
						stx.plotLine(
							CIQ.extend({ x0: poly[0][0], y1: poly[0][1] }, lineParams)
						);
						stx.plotLine(
							CIQ.extend({ x0: poly[3][0], y1: poly[3][1] }, lineParams)
						);
					} else {
						stx.plotLine(
							CIQ.extend({ x0: poly[0][0], y1: poly[3][1] }, lineParams)
						);
					}
				}
			}
			context.stroke();
			context.restore();
		}
		parameters.opacity = opacity;
	};
	
	/**
	 * Fills an area on the chart delimited by intersecting bands.
	 *
	 * Bands can be anchored by different y-axis as determined by the `parameters.topAxis` and `parameters.bottomAxis` parameters.
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param {string} panelName The name of the panel
	 * @param {object} parameters The configuration parameters
	 * @param {string} parameters.topBand The name of the quote field to use as the top band
	 * @param {string} parameters.bottomBand The name of the quote field to use as the bottom band
	 * @param {string} [parameters.topSubBand] Name of the field within the top band to use, for example when plotting a series
	 * @param {string} [parameters.bottomSubBand] Name of the field within the bottom band to use, for example when plotting a series
	 * @param {string} parameters.topColor The color of the top band, used to fill in a cloud whose top edge is the topBand
	 * @param {string} parameters.bottomColor The color the bottom band, used to fill in a cloud whose top edge is the bottomBand
	 * @param {number} [parameters.tension] Tension for splining.
	 * @param {CIQ.ChartEngine.YAxis} parameters.topAxis The y-axis for the top band (will use default axis if not specified)
	 * @param {CIQ.ChartEngine.YAxis} parameters.bottomAxis The y-axis for the bottom band (will use default axis if not specified)
	 * @param {boolean} parameters.skipTransform If true then any transformations (such as comparison charting) will not be applied
	 * @param {number} parameters.opacity The color opacity/transparency as a decimal number (1= full opacity / no transparency).  Default is 0.3.
	 * @memberof CIQ
	 * @since
	 * - 4.0.0 Changed `sd` argument to `panelName` argument. Added `parameters.topColor`, `parameters.bottomColor`, `parameters.opacity` and `parameters.skipTransform`. Removed `parameters.fillFuture`.
	 * - 4.1.2 Removed `quotes` argument; function always uses `chart.dataSegment`.
	 * @example
	 * var parameters={
	 *     topBand: "Leading Span A " + sd.name,
	 *     bottomBand: "Leading Span B " + sd.name,
	 *     topColor: "green",
	 *     bottomColor: "red"
	 * };
	 * CIQ.fillIntersecting(stx, sd.panel, parameters)
	 */
	CIQ.fillIntersecting = function (stx, panelName, parameters) {
		if (!parameters || parameters instanceof Array) parameters = arguments[3]; // backwards compatibility for when quotes was the second argument
		var topBand = parameters.topBand,
			bottomBand = parameters.bottomBand;
		var topSubBand = parameters.topSubBand,
			bottomSubBand = parameters.bottomSubBand;
		var topColor = parameters.topColor,
			bottomColor = parameters.bottomColor;
		var panel = panelName;
		if (panel.panel) {
			// backwards compatibility, where this argument is really a studyDescriptor
			if (panel.outputs && panel.outputMap) {
				if (!topColor) topColor = panel.outputs[panel.outputMap[topBand]];
				if (!bottomColor)
					bottomColor = panel.outputs[panel.outputMap[bottomBand]];
			}
			panel = panel.panel;
		}
		panel = stx.panels[panel];
	
		//make a copy of what's there now
		var context = stx.chart.context,
			contextCanvas = context.canvas;
		var sctx = stx.scratchContext;
		if (!sctx) {
			sctx = stx.scratchContext = contextCanvas.cloneNode(true).getContext("2d");
		}
		var scratchCanvas = sctx.canvas;
		scratchCanvas.height = contextCanvas.height;
		scratchCanvas.width = contextCanvas.width;
		scratchCanvas.context = sctx;
		CIQ.clearCanvas(scratchCanvas, stx);
	
		//then fill the intersections
		var alpha = 0.3;
		if (parameters.opacity) alpha = parameters.opacity;
		sctx.globalCompositeOperation = "xor";
	
		stx.chart.context = sctx;
		var params = {
			band: topBand,
			subField: topSubBand,
			color: topColor,
			opacity: 1,
			panelName: panel.name,
			yAxis: parameters.topAxis,
			skipTransform: parameters.skipTransform,
			tension: parameters.tension,
			roundOffEdges: true,
			step: parameters.step
		};
		CIQ.preparePeakValleyFill(stx, params);
	
		CIQ.extend(params, {
			band: bottomBand,
			subField: bottomSubBand,
			color: bottomColor,
			yAxis: parameters.bottomAxis
		});
		CIQ.preparePeakValleyFill(stx, params);
	
		//now redraw with correct alpha
		context.save();
		context.globalAlpha = alpha;
		context.drawImage(scratchCanvas, 0, 0);
		context.restore();
	
		stx.chart.context = context;
	};
	
	/**
	 * Draws an item in the legend and returns the position for the next item
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param  {array} xy    An X,Y tuple (from chart.legend)
	 * @param  {string} label The text to print in the item
	 * @param  {string} color The color for the background of the item
	 * @param  {number} [opacity] The color for the background of the item
	 * @return {array}       A tuple containing the X,Y position for the next the item
	 * @memberof CIQ
	 */
	CIQ.drawLegendItem = function (stx, xy, label, color, opacity) {
		if (!opacity) opacity = 1;
		var x = xy[0],
			y = xy[1],
			w = 10,
			h = 10;
		var context = stx.chart.context;
		context.globalAlpha = opacity;
		context.fillStyle = color;
		context.fillRect(x, y, w, h);
		context.globalAlpha = 1;
		x += w + 2; // 2 px spacing between box and text
		context.fillStyle = stx.defaultColor;
		context.fillText(label, x, y);
		x += context.measureText(label).width + 6; // 6 px spacing between labels
		return [x, y];
	};
	
	/**
	 * Default function to draw a legend for the series that are displayed on the chart.
	 *
	 * See {@link CIQ.ChartEngine.Chart#legendRenderer} for activation and customization details.
	 *
	 * @param {CIQ.ChartEngine} stx The chart object to draw
	 * @param  {object} params parameters for drawing the legend
	 * @param  {CIQ.ChartEngine.Chart} [params.chart] The chart object
	 * @param  {object} [params.legendColorMap] A map of series names to colors and display symbols ( example  IBM:{color:'red', display:'Int B M'} )
	 * @param  {object} [params.coordinates] Coordinates upon which to draw the items, in pixels relative to top left of panel ( example  {x:50, y:0} ).  If null, uses chart.legend
	 * @param  {boolean} [params.noBase] Set to true to not draw the base (the chart symbol's color) in the legend
	 * @memberof CIQ
	 */
	CIQ.drawLegend = function (stx, params) {
		var coordinates = params.coordinates;
		var context = stx.chart.context;
		context.textBaseline = "top";
		var rememberFont = context.font;
		stx.canvasFont("stx-legend", context);
	
		var chart = params.chart || stx.chart;
		if (!coordinates) coordinates = chart.legend;
		var xy = [coordinates.x, coordinates.y];
		var lineColor = stx.defaultColor;
	
		for (var i = 0; i < 2; i++) {
			// loop twice, first for the base then again for the series
			for (var field in params.legendColorMap) {
				var legendItem = params.legendColorMap[field];
				if (legendItem.isBase && (i || params.noBase)) continue;
				if (!legendItem.isBase && !i) continue;
				var c;
				if (legendItem.color instanceof Array) {
					var colors = legendItem.color;
					for (c = colors.length - 1; c >= 0; c--) {
						if (CIQ.isTransparent(colors[c])) colors.splice(c, 1);
					}
					if (colors.length > 1) {
						var grd = context.createLinearGradient(
							xy[0],
							xy[1],
							xy[0] + 10,
							xy[1]
						);
						for (c = 0; c < colors.length; c++) {
							grd.addColorStop(c / (colors.length - 1), colors[c]);
						}
						lineColor = grd;
					} else if (colors.length > 0) {
						lineColor = colors[0];
					} else {
						lineColor = stx.getCanvasColor("stx_line_chart");
					}
				} else if (legendItem.color) {
					lineColor = legendItem.color;
				} else {
					lineColor = null;
				}
				if (lineColor) {
					var display = field;
					if (legendItem.display) {
						display = legendItem.display;
					}
					if (!display) {
						if (chart.symbolDisplay) {
							display = chart.symbolDisplay;
						} else {
							display = chart.symbol;
						}
					}
					if (xy[0] + context.measureText(display).width > chart.panel.right) {
						xy = [
							coordinates.x,
							coordinates.y + context.measureText("M").width + 6
						]; // M is squarish, with width roughly equaling height: https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
					}
					xy = CIQ.drawLegendItem(
						stx,
						xy,
						display,
						lineColor,
						legendItem.opacity
					);
				}
			}
		}
		context.font = rememberFont;
	};
	
	};
	
	
	let __js_core_color_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Checks if two colors are the same.  Will compare alpha channel is provided as well.
	 * @param  {string} color1 First color, in rgb, rgba, css hex, or literal format
	 * @param  {string} color2 Second color, in rgb, rgba, css hex, or literal format
	 * @return {boolean}       true if equivalent
	 * @example
	 * var isSame=CIQ.colorsEqual("rgba (255,255,255,0.3)", "#FFFFFF");
	 * 		returns false
	 * var isSame=CIQ.colorsEqual("rgba (255,255,255,1)", "#FFFFFF");
	 * 		returns true
	 * @memberof CIQ
	 * @since 4.0.0
	 */
	CIQ.colorsEqual = function (color1, color2) {
		if (color1 == color2) return true;
		if (!color1 && !color2) return true;
		if (!color1 || !color2) return false;
		if (color1 == "transparent") color1 = "rgba(0,0,0,0)";
		if (color2 == "transparent") color2 = "rgba(0,0,0,0)";
		var alpha = /^rgba\(.*,(.+)\)/;
		var rgba1 = color1.match(alpha);
		var rgba2 = color2.match(alpha);
		rgba1 = rgba1 ? parseFloat(rgba1[1]) : 1;
		rgba2 = rgba2 ? parseFloat(rgba2[1]) : 1;
		if (rgba1 != rgba2) return false;
	
		var first = CIQ.colorToHex(color1);
		var second = CIQ.colorToHex(color2);
		return first.toLowerCase() == second.toLowerCase();
	};
	
	/**
	 * Converts an rgb or rgba color to a hex color
	 * @param  {string}	color The rgb or rgba color, such as in CSS format
	 * @return {string}	The hex color. If "transparent" or no color is sent in, #000000 will be assumed
	 * @example
	 * var hexColor=CIQ.colorToHex("rgba (255,255,255,0.3)");
	 * @memberof CIQ
	 * @since 4.0.0 Converts 3 char hex (#FFC) to six characters (#FFFFCC)
	 */
	CIQ.colorToHex = function (color) {
		if (!CIQ.colorToHexMapping) CIQ.colorToHexMapping = {};
		if (!color || color == "transparent") color = "#000000";
		if (CIQ.colorToHexMapping[color]) return CIQ.colorToHexMapping[color];
		if (color.substr(0, 1) === "#") {
			if (color.length == 4) {
				color = CIQ.colorToHexMapping[color] =
					"#" +
					Array(3).join(color.substr(1, 1)) +
					Array(3).join(color.substr(2, 1)) +
					Array(3).join(color.substr(3, 1));
			}
			return color;
		}
		var digits = /(.*?)rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(color);
		if (!digits) digits = /(.*?)rgba\((\d+), ?(\d+), ?(\d+),.*\)/.exec(color);
		// Converts a color name to hex
		function toHex(color) {
			if (typeof document === "undefined") return "#000000";
			var ta = document.querySelector(".ciq_color_converter");
			if (!ta) {
				ta = document.createElement("textarea");
				ta.className = "ciq_color_converter";
				ta.style.display = "none";
				document.body.appendChild(ta);
			}
			ta.style.color = "#000000"; //reset;
			ta.style.color = color;
			var value;
	
			value = getComputedStyle(ta).getPropertyValue("color");
			digits = /(.*?)rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(value);
			if (digits) return CIQ.colorToHex(value);
			else if (value.substr(0, 1) === "#") return value;
			return color;
		}
		if (!digits) {
			var hexResult = toHex(color);
			CIQ.colorToHexMapping[color] = hexResult;
			return hexResult;
		}
	
		var red = parseFloat(digits[2]);
		var green = parseFloat(digits[3]);
		var blue = parseFloat(digits[4]);
	
		var rgb = blue | (green << 8) | (red << 16);
		var hexString = rgb.toString(16);
		// fill with leading 0 if not 6 digits.
		for (var i = hexString.length; i < 6; i++) {
			hexString = "0" + hexString;
		}
		var s = digits[1] + "#" + hexString;
		CIQ.colorToHexMapping[color] = s;
		return s;
	};
	
	/**
	 * Converts color to rgba. This does not accept literal color names such as "black"
	 * @param  {string} color The hex rgb or rgba color, such as in CSS format
	 * @param  {number} [opacity] The 'alpha' value. Defaults to full opacity (100%)
	 * @return {string}       The rgba color
	 * @example
	 * var rgba=CIQ.hexToRgba('rgb(0, 115, 186)');
	 * var rgba=CIQ.hexToRgba('#0073BA');
	 * @memberof CIQ
	 */
	CIQ.hexToRgba = function (color, opacity) {
		if (!color || color == "transparent") color = "rgba(0,0,0,0)";
		if (color.substr(0, 4) === "rgba") {
			var digits = /(.*?)rgba\((\d+), ?(\d+), ?(\d+), ?(\d*\.?\d*)\)/.exec(color);
			var a = digits[5];
			if (opacity || opacity === 0) a = opacity;
			if (a > 1) a = a / 100;
			return (
				"rgba(" + digits[2] + "," + digits[3] + "," + digits[4] + "," + a + ")"
			);
		} else if (color.substr(0, 3) === "rgb") {
			color = CIQ.colorToHex(color);
		}
		if (!opacity && opacity !== 0) opacity = 100; // default to full opacity
		if (opacity <= 1) opacity = opacity * 100; // handle decimal opacity (css style)
	
		color = color.replace("#", "");
		var r = parseInt(color.slice(0, 2), 16);
		var g = parseInt(color.slice(2, 4), 16);
		var b = parseInt(color.slice(4, 6), 16);
	
		if (isNaN(r) || isNaN(g) || isNaN(b)) {
			console.log("CIQ.hexToRgba: invalid hex :", color);
			return null;
		}
	
		return "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
	};
	
	/**
	 * Converts a color to the internal format used by the browser. This allows
	 * interchange of hex, rgb, rgba colors
	 * @param  {string} color A CSS color
	 * @return {string}       The native formatted color
	 * @memberof CIQ
	 */
	CIQ.convertToNativeColor = function (color) {
		var a = document.createElement("DIV");
		a.style.color = color;
		a.style.display = "none";
		document.body.appendChild(a);
		var c = getComputedStyle(a).color;
		document.body.removeChild(a);
		return c;
	};
	/**
	 * Returns true if the color is transparent. In particular it checks rgba status. Note that the charting engine
	 * often interprets transparent colors to mean that a color should be automatically determined based on the brightness
	 * of the background.
	 * @param  {string}  color The color (from CSS)
	 * @return {boolean}       True if transparent
	 * @memberof CIQ
	 */
	CIQ.isTransparent = function (color) {
		if (!color) return false;
		if (color == "transparent") return true;
		var digits = /(.*?)rgba\((\d+), ?(\d+), ?(\d+), ?(\d*\.?\d*)\)/.exec(color);
		if (digits === null) return false;
		if (parseFloat(digits[5]) === 0) return true;
		return false;
	};
	
	/**
	 * Converts a color from hex or rgb format to Hue, Saturation, Value.
	 * @param  {string} color The color (from CSS)
	 * @return {array}       [Hue, Saturation, Value], or null if invalid color.
	 * @memberof CIQ
	 */
	CIQ.hsv = function (color) {
		var hex = CIQ.colorToHex(color);
		if (hex.substr(0, 1) === "#") hex = hex.slice(1);
		// fill with leading 0 if not 6 digits.
		for (var i = hex.length; i < 6; i++) {
			hex = "0" + hex;
		}
		var r = parseInt(hex.slice(0, 2), 16);
		var g = parseInt(hex.slice(2, 4), 16);
		var b = parseInt(hex.slice(4, 6), 16);
		var computedH = 0;
		var computedS = 0;
		var computedV = 0;
	
		//remove spaces from input RGB values, convert to int
		r = parseInt(("" + r).replace(/\s/g, ""), 10);
		g = parseInt(("" + g).replace(/\s/g, ""), 10);
		b = parseInt(("" + b).replace(/\s/g, ""), 10);
	
		if (
			r === null ||
			g === null ||
			b === null ||
			isNaN(r) ||
			isNaN(g) ||
			isNaN(b)
		) {
			console.log("CIQ.hsv: invalid color :", color);
			return null;
		}
		if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
			return null;
		}
		r = r / 255;
		g = g / 255;
		b = b / 255;
		var minRGB = Math.min(r, Math.min(g, b));
		var maxRGB = Math.max(r, Math.max(g, b));
	
		// Black-gray-white
		if (minRGB == maxRGB) {
			computedV = minRGB;
			return [0, 0, computedV];
		}
	
		// Colors other than black-gray-white:
		var d = r == minRGB ? g - b : b == minRGB ? r - g : b - r;
		var h = r == minRGB ? 3 : b == minRGB ? 1 : 5;
		computedH = 60 * (h - d / (maxRGB - minRGB));
		computedS = (maxRGB - minRGB) / maxRGB;
		computedV = maxRGB;
		return [computedH, computedS, computedV];
	};
	
	CIQ.hsl = function (color) {
		var hex = CIQ.colorToHex(color);
		if (hex.substr(0, 1) === "#") hex = hex.slice(1);
		// fill with leading 0 if not 6 digits.
		for (var i = hex.length; i < 6; i++) {
			hex = "0" + hex;
		}
		var r = parseInt(hex.slice(0, 2), 16);
		var g = parseInt(hex.slice(2, 4), 16);
		var b = parseInt(hex.slice(4, 6), 16);
	
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h,
			s,
			l = (max + min) / 2;
	
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
	
		return [h, s, l];
	};
	
	/**
	 * Converts an HSL color value to RGB. The conversion formula is adapted from
	 * {@link http://en.wikipedia.org/wiki/HSL_color_space}.
	 *
	 * Assumes the values for `h`, `s`, and `l` are contained in the set [0, 1] and the returned
	 * RGB values are in the set [0, 255].
	 *
	 * @param {number} h Hue
	 * @param {number} s Saturation
	 * @param {number} l Lightness
	 * @return {Array} The RGB representation of the color.
	 *
	 * @memberof CIQ
	 * @since 7.5.0
	 */
	CIQ.hslToRgb = function (h, s, l) {
		var r, g, b;
	
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			var hue2rgb = function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};
	
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}
	
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	};
	
	/**
	 * Chooses either a white or black foreground color depending on the "lightness" of the background color. Note that this simply
	 * checks if the value is above the hue which works well but not ideally for red colors which the human eye interprets differently.
	 * More complex algorithms are available but chartists rarely use red as a background color.
	 * @param  {string} backgroundColor The background color (CSS format)
	 * @return {string}                 Either #000000 (black) or #FFFFFF (white) depending on which will look best on the given background color
	 * @memberof CIQ
	 */
	CIQ.chooseForegroundColor = function (backgroundColor) {
		var hex = CIQ.colorToHex(backgroundColor);
		var r = parseInt(hex.slice(1, 3), 16);
		var g = parseInt(hex.slice(3, 5), 16);
		var b = parseInt(hex.slice(5, 7), 16);
		// Compare relative luminance (https://www.w3.org/TR/WCAG20/#relativeluminancedef) to 100
		return 0.2126 * r + 0.7152 * g + 0.0722 * b < 100 ? "#FFFFFF" : "#000000"; // per ITU-R BT.709
		/*if(r+g+b>318) return "#000000";
			var hsl=CIQ.hsl(backgroundColor);
			var l=hsl[2];
			if(l>hsl[0]) return "#000000";
			//if(l && l>0.5) return "#000000";
			return "#FFFFFF";*/
	};
	
	/**
	 * Convert a pattern type to an array useful for setting the context.setLineDash
	 * @param {number} [width=1] A valid lineWidth from 1
	 * @param {string} [pattern=solid] A valid pattern (solid, dotted, dashed)
	 * @return {array} The array representing pixels of draw/skip etc.  Use it as argument to context.setLineDash()
	 * @memberof CIQ
	 * @since 4.0.0
	 */
	CIQ.borderPatternToArray = function (width, pattern) {
		if (!pattern) return [];
		if (pattern instanceof Array) return pattern;
		if (pattern == "dotted") return [width, width];
		if (pattern == "dashed") return [width * 5, width * 5];
		if (pattern != "solid" && pattern != "none")
			console.log('Unsupported pattern "' + pattern + '"; defaulting to "solid"');
		return [];
	};
	
	/**
	 * Gets the background color of an element by traversing up the parent stack.
	 * @param  {HTMLElement} el The element to examine
	 * @return {string}    The background color
	 * @memberof CIQ
	 */
	CIQ.getBackgroundColor = function (el) {
		var bgColor = null;
		while (!bgColor || CIQ.isTransparent(bgColor)) {
			var cStyle = getComputedStyle(el);
			if (!cStyle) return;
			bgColor = cStyle.backgroundColor;
			if (CIQ.isTransparent(bgColor)) bgColor = "transparent";
			el = el.parentNode;
			if (!el || !el.tagName) break;
		}
		if (!bgColor || bgColor == "transparent") bgColor = "#FFFFFF";
		return bgColor;
	};
	
	};
	
	
	let __js_core_date_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ,
		timezoneJS = _exports.timezoneJS;
	
	CIQ.monthLetters = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	CIQ.monthAbv = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	
	/* Enumerated types for time units */
	CIQ.MILLISECOND = 1;
	CIQ.SECOND = 1000;
	CIQ.MINUTE = 60 * CIQ.SECOND;
	CIQ.HOUR = 60 * CIQ.MINUTE;
	CIQ.DAY = 24 * CIQ.HOUR;
	CIQ.WEEK = 7 * CIQ.DAY;
	CIQ.MONTH = 31 * CIQ.DAY;
	CIQ.YEAR = 366 * CIQ.DAY;
	CIQ.DECADE = 10 * CIQ.YEAR - 7 * CIQ.DAY;
	
	CIQ.yyyymmddhhmmssmmmrx = new RegExp("\\d{17}");
	
	/**
	 * Converts a string form date into a JavaScript Date object with time. Supports various standard date formats
	 * @param  {string} dt String form of a date (such as yyyymmddhhmm, yyyy-mm-dd hh:mm, etc)
	 * @return {date}    A JavaScript Date object
	 * @memberof CIQ
	 */
	CIQ.strToDateTime = function (dt) {
		if (!dt || dt.getFullYear) return dt; //if passing in a JS date, return it.
		var myDateArray = [];
		var y, m, d, h, mn, sc, ms;
		if (dt.length == 12 || dt.length == 14) {
			// yyyymmddhhmm[ss]
			y = parseFloat(dt.substring(0, 4));
			m = parseFloat(dt.substring(4, 6)) - 1;
			d = parseFloat(dt.substring(6, 8));
			h = parseFloat(dt.substring(8, 10));
			mn = parseFloat(dt.substring(10, 12));
			sc = parseFloat(dt.substring(12, 14)) || 0;
			return new Date(y, m, d, h, mn, sc, 0);
		} else if (CIQ.yyyymmddhhmmssmmmrx.test(dt)) {
			y = parseFloat(dt.substring(0, 4));
			m = parseFloat(dt.substring(4, 6)) - 1;
			d = parseFloat(dt.substring(6, 8));
			h = parseFloat(dt.substring(8, 10));
			mn = parseFloat(dt.substring(10, 12));
			sc = parseFloat(dt.substring(12, 14));
			ms = parseFloat(dt.substring(14, 17));
			return new Date(y, m, d, h, mn, sc, ms);
		}
		var lr = [dt];
		var t = dt.indexOf("T");
		if (t != -1) {
			var afterT = dt.substring(t);
			if (
				afterT.indexOf("Z") != -1 ||
				afterT.indexOf("-") != -1 ||
				afterT.indexOf("+") != -1
			) {
				return new Date(dt); // utc time if it contains actual timezone information
			}
			lr = dt.split("T");
		} else if (dt.indexOf(" ") != -1) lr = dt.split(" ");
	
		if (lr[0].indexOf("/") != -1) myDateArray = lr[0].split("/");
		else if (lr[0].indexOf("-") != -1) myDateArray = lr[0].split("-");
		else return CIQ.strToDate(dt); //give up, maybe it's just a date
	
		var year = parseFloat(myDateArray[2], 10);
		if (myDateArray[0] && myDateArray[0].length == 4) {
			// YYYY-MM-DD
			year = parseFloat(myDateArray[0], 10);
			myDateArray[0] = myDateArray[1];
			myDateArray[1] = myDateArray[2];
		}
	
		if (lr.length > 1) {
			var ampm = lr[2];
			lr = lr[1].split(":");
			if (ampm) {
				if (lr[0] == "12" && ampm.toUpperCase() == "AM") lr[0] = 0;
				else if (lr[0] != "12" && ampm.toUpperCase() == "PM")
					lr[0] = parseInt(lr[0], 10) + 12;
			}
			var sec = 0,
				msec = 0;
			if (lr.length == 3) {
				if (lr[2].indexOf(".") == -1) {
					sec = parseInt(lr[2], 10);
				} else {
					sec = lr[2].split(".");
					if (sec[1].length == 3) {
						msec = sec[1];
						sec = sec[0];
					}
				}
			}
			return new Date(
				year,
				myDateArray[0] - 1,
				myDateArray[1],
				lr[0],
				lr[1],
				sec,
				msec
			);
		}
		return new Date(year, myDateArray[0] - 1, myDateArray[1], 0, 0, 0, 0);
	};
	
	/**
	 * Converts a string form date into a JavaScript object. Only use if you know that the string will not include a time, otherwise use @see CIQ.strToDateTime
	 * @param  {string} dt - Date in string format such as MM/DD/YY or YYYYMMDD or 2014-10-25T00:00:00+00:00 or 201506170635
	 * @return {date}    JavaScript date object -new Date()-
	 * @memberof CIQ
	 */
	CIQ.strToDate = function (dt) {
		var myDateArray;
		if (dt.indexOf("/") != -1) myDateArray = dt.split("/");
		else if (dt.indexOf("-") != -1) myDateArray = dt.split("-");
		else if (dt.length >= 8) {
			return new Date(
				parseFloat(dt.substring(0, 4)),
				parseFloat(dt.substring(4, 6)) - 1,
				parseFloat(dt.substring(6, 8))
			);
		} else {
			return new Date();
		}
		if (myDateArray.length < 3) {
			// didn't find enough data for month, day and year.
			return new Date();
		}
		if (myDateArray[2].indexOf(" ") != -1) {
			myDateArray[2] = myDateArray[2].substring(0, myDateArray[2].indexOf(" "));
		} else if (myDateArray[2].indexOf("T") != -1) {
			myDateArray[2] = myDateArray[2].substring(0, myDateArray[2].indexOf("T"));
		}
		var year = parseFloat(myDateArray[2], 10);
		if (year < 20) year += 2000;
		if (myDateArray[0].length == 4) {
			// YYYY-MM-DD
			year = parseFloat(myDateArray[0], 10);
			myDateArray[0] = myDateArray[1];
			myDateArray[1] = myDateArray[2];
		}
		return new Date(year, myDateArray[0] - 1, myDateArray[1]);
	};
	
	/**
	 * Formats a date according to an input string; for example, "YYYY:MM:dd hh:mm".
	 *
	 * All matching tokens in the input string are replaced by their corresponding date or time value.
	 * Supported tokens and their values are as follows:
	 * - YYYY = full year
	 * - MM = month
	 * - dd = day
	 * - HH = hours (24-hour format)
	 * - hh = hours (12-hour format)
	 * - mm = minutes
	 * - ss = seconds
	 * - SSS = milliseconds
	 *
	 * Values are formatted with leading zeroes as necessary.
	 *
	 * **Note:** This function is less performant than the special-purpose format functions defined in
	 * this namespace, such as {@link CIQ.mmddyyyy} and {@link CIQ.yyyymmdd}, and should be used
	 * accordingly.
	 *
	 * @param {Date} dt The date to format.
	 * @param {string} str The format for the date.
	 * @return {string} The formatted date string.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.dateToStr = function (dt, str) {
		const has = (token) => str.includes(token);
		const pad = (num, digits = 2) => ("0".repeat(digits) + num).slice(-digits);
		const fmt = (exp, val) => (str = str.replace(exp, val));
		const max = (val, max) => (val > max ? val - max : val);
		if (has("YYYY")) fmt(/YYYY/g, dt.getFullYear());
		if (has("MM")) fmt(/MM/g, pad(dt.getMonth() + 1));
		if (has("dd")) fmt(/dd/g, pad(dt.getDate()));
		if (has("HH")) fmt(/HH/g, pad(dt.getHours()));
		if (has("hh")) fmt(/hh/g, pad(max(dt.getHours() || 12, 12)));
		if (has("mm")) fmt(/mm/g, pad(dt.getMinutes()));
		if (has("ss")) fmt(/ss/g, pad(dt.getSeconds()));
		if (has("SSS")) fmt(/SSS/g, pad(dt.getMilliseconds(), 3));
		return str;
	};
	
	/**
	 * Converts a JavaScript Date or string form date to mm/dd/yyyy format
	 * @param  {string} dt Date in JavaScript Date or string format such as YYYY-MM-DD
	 * @return {string}   Date in mm/dd/yyyy format
	 * @memberof CIQ
	 * @since 2016-07-16
	 */
	CIQ.mmddyyyy = function (dt) {
		if (typeof dt === "string") {
			dt = CIQ.strToDate(dt);
		}
	
		var m = dt.getMonth() + 1;
		if (m < 10) m = "0" + m;
		var d = dt.getDate();
		if (d < 10) d = "0" + d;
		return m + "/" + d + "/" + dt.getFullYear();
	};
	
	/**
	 * Converts a JavaScript Date to yyyy-mm-dd format
	 * @param  {date} dt JavaScript Date object
	 * @return {string}    Date in yyyy-mm-dd format
	 * @memberof CIQ
	 */
	CIQ.yyyymmdd = function (dt) {
		var m = dt.getMonth() + 1;
		if (m < 10) m = "0" + m;
		var d = dt.getDate();
		if (d < 10) d = "0" + d;
		return dt.getFullYear() + "-" + m + "-" + d;
	};
	
	/**
	 * Converts a JavaScript `Date` object to hh:mm format.
	 *
	 * @param {date} dt `Date` object to be converted.
	 * @return {string} Time of the converted `Date` object in hh:mm format.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 */
	CIQ.hhmm = function (dt) {
		var h = dt.getHours();
		if (h < 10) h = "0" + h;
		var m = dt.getMinutes();
		if (m < 10) m = "0" + m;
		return h + ":" + m;
	};
	
	/**
	 * Converts a JavaScript Date to hh:mm:ss format
	 * @param  {date} dt JavaScript Date object
	 * @return {string}    Time in hh:mm:ss format
	 * @memberof CIQ
	 * @since 6.3.0
	 */
	CIQ.hhmmss = function (dt) {
		var s = dt.getSeconds();
		if (s < 10) s = "0" + s;
		return CIQ.hhmm(dt) + ":" + s;
	};
	
	/**
	 * Converts a date into yyyymmddhhmm format
	 * @param  {date} dt A JavaScript Date object
	 * @return {string}    Date in yyyymmddhhmm format
	 * @memberof CIQ
	 */
	CIQ.yyyymmddhhmm = function (dt) {
		return CIQ.yyyymmddhhmmssmmm(dt).substr(0, 12);
	};
	
	/**
	 * Converts a date into yyyymmddhhmmssmmm format
	 * @param  {date} dt A JavaScript Date object
	 * @return {string}    Date in yyyymmddhhmmssmmm format
	 * @memberof CIQ
	 */
	CIQ.yyyymmddhhmmssmmm = function (dt) {
		var m = dt.getMonth() + 1;
		if (m < 10) m = "0" + m;
		var d = dt.getDate();
		if (d < 10) d = "0" + d;
		var h = dt.getHours();
		if (h < 10) h = "0" + h;
		var mn = dt.getMinutes();
		if (mn < 10) mn = "0" + mn;
		var s = dt.getSeconds();
		if (s < 10) s = "0" + s;
		var ms = dt.getMilliseconds();
		if (ms < 10) ms = "00" + ms;
		else if (ms < 100) ms = "0" + ms;
		return "" + dt.getFullYear() + m + d + h + mn + s + ms;
	};
	
	/**
	 * Converts a date into yyyy/mm/dd hh:mm format
	 * @param  {date} dt A JavaScript Date object
	 * @return {string}    Date in yyyy/mm/dd hh:mm format
	 * @memberof CIQ
	 */
	CIQ.friendlyDate = function (dt) {
		return CIQ.dateToStr(dt, "YYYY/MM/dd HH:mm");
	};
	
	/**
	 * Converts a string form date into mm-dd hh:mm format
	 * @param  {string} strdt Date in string format (such as yyyymmddhhmm, yyyy-mm-dd hh:mm, etc)
	 * @return {string}       Date in mm-dd hh:mm format
	 * @memberof CIQ
	 * @since 5.0.0 will output seconds and millis if present
	 */
	CIQ.mmddhhmm = function (strdt) {
		var dt = CIQ.strToDateTime(strdt);
		var m = dt.getMonth() + 1;
		if (m < 10) m = "0" + m;
		var d = dt.getDate();
		if (d < 10) d = "0" + d;
		var h = dt.getHours();
		if (h < 10) h = "0" + h;
		var mn = dt.getMinutes();
		if (mn < 10) mn = "0" + mn;
		var s = dt.getSeconds();
		if (s < 10) s = "0" + s;
		var ms = dt.getMilliseconds();
		if (ms < 10) ms = "00" + ms;
		else if (ms < 100) ms = "0" + ms;
		if (h == "00" && mn == "00" && s == "00" && ms == "000")
			return m + "-" + d + "-" + dt.getFullYear();
		if (s == "00" && ms == "000") return m + "-" + d + " " + h + ":" + mn;
		if (ms == "000") return m + "-" + d + " " + h + ":" + mn + ":" + s;
		return m + "-" + d + " " + h + ":" + mn + ":" + s + ":" + ms;
	};
	
	/**
	 * Gets the day of the year
	 * @param  {date} [dt] optional	The date to check.  If omitted, will use the current date.
	 * @return {number} 			Day of year
	 * @memberof CIQ
	 */
	CIQ.getYearDay = function (dt) {
		var now = dt;
		if (!now) now = new Date();
		now.setHours(0, 0, 0, 0);
		var start = new Date(now.getFullYear(), 0, 0);
		var diff = now - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.round(diff / oneDay);
		return day;
	};
	
	/**
	 * Gets the current time in Eastern Time Zone. This can be used as a convenience for determining open and closing times of US markets.
	 * @return {date} JavaScript Date representing the time in Eastern Time Zone
	 * @memberof CIQ
	 */
	CIQ.getETDateTime = function () {
		var d = new Date();
		return CIQ.convertTimeZone(
			new Date(d.getTime() + d.getTimezoneOffset() * 60000),
			"UTC",
			"America/New_York"
		);
	};
	
	/**
	 * Converts a JavaScript date from Eastern Time Zone to the browser's local time zone. Daylight Savings Time is hard coded. @see CIQ.getETDateTime
	 * @param  {date} est JavaScript Date object representing a date/time in eastern time zone
	 * @return {date}     JavaScript Date object converted to browser's local time zone
	 * @memberof CIQ
	 */
	CIQ.fromET = function (est) {
		var d = new Date();
		//var localTime = d.getTime();
		//var localOffset = d.getTimezoneOffset() * 60000;
		//var utc = localTime + localOffset;
		var offset = 4;
		if (
			d.getMonth() < 2 ||
			(d.getMonth() == 2 && d.getDate() < 11) ||
			d.getMonth() > 10 ||
			(d.getMonth() == 10 && d.getDate() >= 4)
		)
			offset = 5;
		var localTime = est.getTime() + 3600000 * offset;
		var nd = new Date(localTime);
		return nd;
	};
	
	/**
	 * Convenience function for creating a displayable month name using CIQ.monthLetters and CIQ.monthAbv.
	 * Please note that those arrays may not be utilized if the library is used in conjunction with Internationalization.
	 * This method is used primarily to create the x-axis of a chart
	 * @param  {number} i              The numerical month (0-11)
	 * @param  {boolean} displayLetters - True if just the first letter should be displayed (such as a tight display)
	 * @param  {object} [stx]            The chart object, only necessary if Internationalization is in use
	 * @return {string}                String representation of the month
	 * @memberof CIQ
	 */
	CIQ.monthAsDisplay = function (i, displayLetters, stx) {
		if (displayLetters) {
			if (stx && stx.monthLetters) return stx.monthLetters[i];
			return CIQ.monthLetters[i];
		}
		if (stx && stx.monthAbv) return stx.monthAbv[i];
		return CIQ.monthAbv[i];
	};
	
	/**
	 * Displays a time in readable form. If Internationalization is in use then the time will be in 24 hour Intl numeric format
	 * @param  {date} dt  JavaScript Date object
	 * @param  {object} [stx] Chart object if Internationalization is in use
	 * @param {number} [precision] Precision to use. If `null` then `hh:mm`. `CIQ.SECOND` then `hh:mm:ss`. If `CIQ.MILLISECOND` then `hh:mm:ss.mmmmm`
	 * @return {string}     Human friendly time, usually hh:mm
	 * @memberof CIQ
	 */
	CIQ.timeAsDisplay = function (dt, stx, precision) {
		var internationalizer = stx ? stx.internationalizer : null;
		if (internationalizer) {
			if (precision == CIQ.SECOND)
				return internationalizer.hourMinuteSecond.format(dt);
			else if (precision == CIQ.MILLISECOND)
				return (
					internationalizer.hourMinuteSecond.format(dt) +
					"." +
					dt.getMilliseconds()
				);
			return internationalizer.hourMinute.format(dt);
		}
		var min = dt.getMinutes();
		if (min < 10) min = "0" + min;
		var str = dt.getHours() + ":" + min;
		var sec = "";
		if (precision <= CIQ.SECOND) {
			sec = dt.getSeconds();
			if (sec < 10) sec = "0" + sec;
			str += ":" + sec;
		}
		if (precision == CIQ.MILLISECOND) {
			var msec = dt.getMilliseconds();
			if (msec < 10) msec = "00" + msec;
			else if (msec < 100) msec = "0" + msec;
			str += "." + msec;
		}
		return str;
	};
	
	/**
	 * Creates a displayable date string according to the current chart settings and periodicity.
	 *
	 * Formats the date using one of the following formatters or default format (in order of
	 * preference):
	 *
	 * 1. Chart x-axis formatter
	 * 2. Chart engine internationalizer
	 * 3. Default format
	 *    <br>a. Daily &mdash; mm/dd/yyyy
	 *    <br>b. Intraday &mdash; mm/dd hh:mm[:ss[:ms]]
	 *
	 * This method is used in {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} to format the
	 * date label that floats over the x-axis. Overwrite this method as needed to achieve the desired
	 * date format.
	 *
	 * @param {CIQ.ChartEngine} stx The charting object.
	 * @param {CIQ.ChartEngine.Chart} chart	The chart to which the date applies.
	 * @param {Date} dt The date to format.
	 * @param {boolean} [includeIntraYear] If true, include the year in the intraday dates.
	 * @return {string} The formatted date.
	 *
	 * @memberof CIQ
	 * @since
	 * - 4.0.0
	 * - 8.2.0 Added the `includeIntraYear` parameter.
	 */
	CIQ.displayableDate = function (stx, chart, dt, includeIntraYear) {
		function twoPlaces(val) {
			if (val < 10) return "0" + val;
			return val;
		}
		var displayableDate = "";
		var interval = stx.layout.interval;
		var isDaily = CIQ.ChartEngine.isDailyInterval(interval);
		var isSecond =
			(chart.xAxis.activeTimeUnit && chart.xAxis.activeTimeUnit <= CIQ.SECOND) ||
			stx.layout.timeUnit == "second";
		var isMS =
			(chart.xAxis.activeTimeUnit &&
				chart.xAxis.activeTimeUnit <= CIQ.MILLISECOND) ||
			stx.layout.timeUnit == "millisecond";
		if (chart.xAxis.formatter) {
			displayableDate = chart.xAxis.formatter(dt);
		} else if (stx.internationalizer) {
			displayableDate = stx.internationalizer.monthDay.format(dt);
			if (isSecond || isMS) {
				displayableDate +=
					" " + stx.internationalizer.hourMinuteSecond.format(dt);
				if (isMS) displayableDate += "." + dt.getMilliseconds();
			} else if (!isDaily) {
				if (includeIntraYear)
					displayableDate = stx.internationalizer.yearMonthDay.format(dt);
				displayableDate += " " + stx.internationalizer.hourMinute.format(dt);
			} else {
				if (interval == "month")
					displayableDate = stx.internationalizer.yearMonth.format(dt);
				else displayableDate = stx.internationalizer.yearMonthDay.format(dt);
			}
		} else {
			var m = twoPlaces(dt.getMonth() + 1);
			var d = twoPlaces(dt.getDate());
			var h = twoPlaces(dt.getHours());
			var mn = twoPlaces(dt.getMinutes());
			if (isDaily) {
				displayableDate = interval == "month" ? m + "/" : m + "/" + d + "/";
				displayableDate += dt.getFullYear();
			} else {
				let date = m + "/" + d;
				if (includeIntraYear) date += "/" + dt.getFullYear();
				displayableDate = date + " " + h + ":" + mn;
				if (isSecond || isMS) {
					var sec = twoPlaces(dt.getSeconds());
					displayableDate += ":" + sec;
					if (isMS) {
						var mil = twoPlaces(dt.getMilliseconds());
						if (mil < 100) mil = "0" + mil;
						displayableDate += ":" + mil;
					}
				}
			}
		}
		return displayableDate;
	};
	
	/**
	 * Converts a Date object from one time zone to another using the timezoneJS.Date library
	 * @param  {date} dt                    Original JavaScript Date object, from the original time zone
	 * @param  {string} originalTimeZone    The original time zone
	 * @param  {string} targetTimeZone      The target time zone
	 * @return {date}            The date in the target timezone. This is a timezoneJS.Date which behaves the same as a native Date.
	 * @memberof CIQ
	 */
	CIQ.convertTimeZone = function (dt, originalTimeZone, targetTimeZone) {
		if (!timezoneJS.Date) return dt;
		// Convert from original timezone to local time
		var newDT = new timezoneJS.Date(
			dt.getFullYear(),
			dt.getMonth(),
			dt.getDate(),
			dt.getHours(),
			dt.getMinutes(),
			dt.getSeconds(),
			dt.getMilliseconds(),
			originalTimeZone
		);
	
		// Convert from local time to new timezone
		newDT.setTimezone(targetTimeZone);
		return newDT;
	};
	
	/**
	 * This method converts a time from another timezone to local time on the browser
	 * @param  {date} dt               The original time
	 * @param  {string} originalTimeZone A valid timezone
	 * @return {date}                  The date converted to local time
	 * @memberof CIQ
	 */
	CIQ.convertToLocalTime = function (dt, originalTimeZone) {
		if (!timezoneJS.Date) return dt;
		var seconds = dt.getSeconds();
		var milliseconds = dt.getMilliseconds();
		var newDT = new timezoneJS.Date(
			dt.getFullYear(),
			dt.getMonth(),
			dt.getDate(),
			dt.getHours(),
			dt.getMinutes(),
			originalTimeZone
		);
		return new Date(newDT.getTime() + seconds * 1000 + milliseconds);
	};
	
	};
	
	
	let __js_core_dom_ = (_exports) => {
	
	
	if (!_exports.SplinePlotter) _exports.SplinePlotter = {};
	
	var CIQ = _exports.CIQ,
		splinePlotter = _exports.SplinePlotter;
	
	/**
	 * Shorthand for `getElementById()`.
	 *
	 * Equivalent to prototype style `$()`, which is faster but less powerful than jQuery style `$()`.
	 *
	 * @param {string} id An ID tag for a valid DOM element.
	 * @param {HTMLElement} [source] A valid DOM node to search within. If not provided, the entire
	 * 		document is searched.
	 * @return {HTMLElement} The DOM node associated with the ID, or null if a node is not found.
	 *
	 * @name $$
	 * @function
	 */
	var $$ = function (id, source) {
		if (!source) return document.getElementById(id);
		if (source.id == id) return source; // Found it!
		if (!source.hasChildNodes) return null;
		for (var i = 0; i < source.childNodes.length; i++) {
			var element = $$(id, source.childNodes[i]);
			if (element) return element;
		}
		return null;
	};
	_exports.$$ = $$;
	
	/**
	 * Functional equivalent of `querySelector()`.
	 *
	 * Functionally equivalent to jQuery `$()`. Uses `querySelectorAll` to maintain compatibility with
	 * Internet Explorer 9.
	 *
	 * **Note:** If multiple elements match the selector, only the first is returned.
	 *
	 * @param {string} selector CSS style selector.
	 * @param {HTMLElement} [source] Node to select within. If not provided, the entire document is
	 * 		searched.
	 * @return {HTMLElement} The first element to match the selector.
	 *
	 * @name $$$
	 * @function
	 */
	var $$$ = function (selector, source) {
		if (!source) source = document;
		return source.querySelectorAll(selector)[0]; // We use querySelectorAll for backward compatibility with IE
	};
	_exports.$$$ = $$$;
	
	/**
	 * READ ONLY.  String of appropriate wheel event based on browser features.
	 */
	CIQ.wheelEvent = (function () {
		if (typeof document === "undefined") return undefined;
		if (CIQ.isIE || "onwheel" in document.createElement("div")) return "wheel";
		if (document.onmousewheel !== undefined) return "mousewheel";
		return "DOMMouseScroll";
	})();
	
	/**
	 * Convenience function for dynamically creating a new node and appending it into the DOM.
	 * @param  {object} div       The targeted parent node
	 * @param  {string} tagName   The type of node to be created
	 * @param  {string} [className] Optional class name to set the new node
	 * @param {string} [txt] Optional text to insert
	 * @return {object}           The new node
	 * @memberof CIQ
	 */
	CIQ.newChild = function (div, tagName, className, txt) {
		var div2 = document.createElement(tagName);
		if (className) div2.className = className;
		div.appendChild(div2);
		if (txt) div2.innerHTML = txt;
		return div2;
	};
	
	/**
	 * Microsoft RT disallows innerHTML that contains DOM elements. Use this method to override when necessary.
	 * @param  {object} node A valid DOM element to change innerHTML
	 * @param  {string} html The html text to change
	 * @example
	 * CIQ.innerHTML(node, "My innerHTML contains <span>a span</span> and MS RT doesn't like that");
	 * @memberof CIQ
	 */
	CIQ.innerHTML = function (node, html) {
		if (window.MSApp && window.MSApp.execUnsafeLocalFunction) {
			window.MSApp.execUnsafeLocalFunction(function () {
				node.innerHTML = html;
			});
		} else {
			node.innerHTML = html;
		}
	};
	
	/**
	 * Microsoft surface bug requires a timeout in order for the cursor to show up in a focused
	 * text box. iPad also, sometimes, when embedded in an iframe, so set useTimeout if in an iframe!
	 * @param  {object} node       A DOM element to focus
	 * @param  {number} useTimeout Whether to apply a timeout or not. If number then the number of milliseconds.
	 * @memberof CIQ
	 */
	CIQ.focus = function (node, useTimeout) {
		if (CIQ.isSurface || useTimeout) {
			var timeout = 0;
			if (!isNaN(parseInt(useTimeout, 10))) timeout = useTimeout;
			setTimeout(function () {
				node.focus();
			}, timeout);
		} else {
			node.focus();
		}
	};
	
	/**
	 * Reliable, cross-device blur method
	 * @param  {HTMLElement} [node] The element to blur. If not supplied then document.activeElement will be blurred
	 * @memberof CIQ
	 */
	CIQ.blur = function (node) {
		if (!node) node = document.activeElement;
		if (node) node.blur();
		window.focus();
	};
	
	/**
	 * Find all nodes that match the given text. This is a recursive function so be careful not to start too high in the DOM tree.
	 * @param  {object} startNode A valid DOM element from which to start looking
	 * @param  {string} text      The text to search for
	 * @return {array}           An array of nodes that match the text
	 * @memberof CIQ
	 */
	CIQ.findNodesByText = function (startNode, text) {
		if (startNode.innerHTML == text) return [startNode];
		var nodes = [];
		for (var i = 0; i < startNode.childNodes.length; i++) {
			var pushNodes = CIQ.findNodesByText(startNode.childNodes[i], text);
			if (pushNodes) {
				nodes = nodes.concat(pushNodes);
			}
		}
		if (nodes.length) return nodes;
		return null;
	};
	
	/**
	 * Hide nodes that match a certain text string.
	 * @param  {object} startNode A valid DOM element from which to start looking
	 * @param  {string} text      The text to match against
	 * {@link  CIQ.findNodesByText}
	 * @memberof CIQ
	 */
	CIQ.hideByText = function (startNode, text) {
		var nodes = CIQ.findNodesByText(startNode, text);
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].style.display = "none";
		}
	};
	
	/**
	 * Returns the height of the page. It is aware of iframes and so will never return a value that is greater
	 * than the value of the parent
	 * @return {number} Height of page in pixels
	 * @memberof CIQ
	 */
	CIQ.pageHeight = function () {
		var { innerHeight, top, parent, self } = window;
		if (top != self) {
			try {
				if (innerHeight > parent.innerHeight) innerHeight = parent.innerHeight;
			} catch (e) {}
		}
		return innerHeight;
	};
	
	/**
	 * Returns the width of the page. It is aware of iframes and so will never return a value that is greater
	 * than the value of the parent
	 * @return {number} Width of page in pixels
	 * @memberof CIQ
	 */
	CIQ.pageWidth = function () {
		var { innerWidth, top, parent, self } = window;
		if (top != self) {
			try {
				if (innerWidth > parent.innerWidth) innerWidth = parent.innerWidth;
			} catch (e) {}
		}
		return innerWidth;
	};
	
	/**
	 * Strips the letters "px" from a string. This is useful for converting styles into absolutes.
	 * @param  {string} text - String value with "px"
	 * @return {number}      The numeric value
	 * @example
	 * var leftPosition=CIQ.stripPX(node2.style.left)
	 * @memberof CIQ
	 */
	CIQ.stripPX = function (text) {
		if (!text) return 0;
		if (typeof text == "number") return text;
		return parseInt(text.substr(0, text.indexOf("p")), 10);
	};
	
	/**
	 * Returns true if a point, in absolute screen position, is within an element
	 * @param  {object} node A valid DOM element to check whether the point overlaps
	 * @param  {number} x    Absolute screen X position of pointer
	 * @param  {number} y    Absolute screen Y position of pointer
	 * @return {boolean}      True if the point lies inside of the DOM element
	 * @memberof CIQ
	 */
	CIQ.withinElement = function (node, x, y) {
		var rect = node.getBoundingClientRect();
		if (x <= rect.left) return false;
		if (y <= rect.top) return false;
		if (x >= rect.left + node.offsetWidth) return false;
		if (y >= rect.top + node.offsetHeight) return false;
		return true;
	};
	
	/**
	 * Sets a property or style of a DOM element only if the property or style does not already have
	 * the provided value.
	 *
	 * This is more efficient than needlessly updating the DOM.
	 *
	 * @param {HTMLElement} node The DOM element to update.
	 * @param {string} member The DOM element's property or style to update.
	 * @param {string} value The value to set.
	 * @return {boolean} true if the value of `member` was changed.
	 *
	 * @memberof CIQ
	 * @since
	 * - 4.0.0
	 * - 8.1.0 Added return value.
	 *
	 * @example
	 * <caption>Set the HTML content of a DOM element.</caption>
	 * CIQ.efficientDOMUpdate(node, "innerHTML", htmlString);
	 *
	 * @example
	 * <caption>Set a style property of a DOM element.</caption>
	 * CIQ.efficientDOMUpdate(controls.floatDate.style, "width", "auto");
	 */
	CIQ.efficientDOMUpdate = function (node, member, value) {
		if (node[member] !== value) {
			node[member] = value;
			return true;
		}
		return false;
	};
	
	/**
	 * Creates a virtual DOM for an element.
	 *
	 * A virtual DOM is faster and more efficient than the actual DOM for manipulation of an
	 * element's children.
	 *
	 * **Note:** Use {@link CIQ.cqrender} to render the virtual DOM on the real DOM.
	 *
	 * @param {HTMLElement} node The node for which the virtual DOM is created.
	 * @return {object} The virtual DOM of `node`.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.cqvirtual = function (node) {
		if (!node) return;
		var virtual = node.cloneNode(true);
		virtual.innerHTML = "";
		virtual.original = node;
		return virtual;
	};
	
	/**
	 * Copies the virtual DOM of an element to the actual DOM.
	 *
	 * **Note:** Use {@link CIQ.cqvirtual} to first create a virtual DOM.
	 *
	 * @param {HTMLElement} node The node for which the actual DOM is updated with the virtual DOM.
	 * @return {object} The actual DOM of the node.
	 *
	 * @memberOf CIQ
	 * @since 8.1.0
	 */
	CIQ.cqrender = function (node) {
		if (!node) return;
		if (node.innerHTML == node.original.innerHTML) return node.original;
		CIQ.removeChildIfNot(node.original, "template");
	
		var children = Array.from(node.children);
		if (children.length)
			children.forEach(function (child) {
				node.original.appendChild(node.removeChild(child));
			});
		return node.original;
	};
	
	/**
	 * Removes from `node` all children that do not match `selector`. Removes all children if no
	 * selector is provided.
	 *
	 * @param {HTMLElement} node Parent node from which child nodes are removed.
	 * @param {string} [selector] CSS selector used to select child nodes that are not removed from
	 * 		`node`.
	 * @return {HTMLElement} `node`, containing only those children selected by `selector`; all other
	 * 		children removed.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.removeChildIfNot = function (node, selector) {
		var children = Array.from(node.children);
		if (children.length)
			children.forEach(function (child) {
				if (!selector || !child.matches(selector)) node.removeChild(child);
			});
		return node;
	};
	
	/**
	 * Used in conjunction, safeMouseOut and safeMouseOver ensure just a single event when the mouse moves
	 * in or out of an element. This is important because simple mouseout events will fire when the mouse
	 * crosses boundaries *within* an element. Note that this function will do nothing on a touch device where
	 * mouseout is not a valid operation.
	 * @param  {object} node A valid DOM element
	 * @param  {function} fc   Function to call when the mouse has moved out
	 * @memberof CIQ
	 */
	CIQ.safeMouseOut = function (node, fc) {
		function closure(node, fc) {
			return function (e) {
				if (typeof e.pageX == "undefined") {
					e.pageX = e.clientX;
					e.pageY = e.clientY;
				}
				if (CIQ.withinElement(node, e.pageX, e.pageY)) {
					return;
				}
				node.stxMouseOver = false;
				fc(e);
			};
		}
		node.addEventListener("mouseout", closure(node, fc));
	};
	
	/**
	 * This method is guaranteed to only be called once when a user mouses over an object. @see CIQ.safeMouseOut
	 * @param  {object} node A valid DOM element
	 * @param  {function} fc   Function to call when mouse moves over the object
	 * @memberof CIQ
	 */
	CIQ.safeMouseOver = function (node, fc) {
		function closure(node, fc) {
			return function (e) {
				if (typeof e.pageX == "undefined") {
					e.pageX = e.clientX;
					e.pageY = e.clientY;
				}
				if (CIQ.withinElement(node, e.pageX, e.pageY)) {
					if (node.stxMouseOver) return;
					node.stxMouseOver = true;
					fc(e);
				}
			};
		}
		node.addEventListener("mouseover", closure(node, fc));
	};
	
	/**
	 * Converts an object to emit "stxtap" events. This uses {@link CIQ.safeClickTouch}. You should use addEventListener("tap") to receive the events.
	 * @param {HTMLElement} div The element to convert
	 * @param {object} [params] Parameters to pass to {@link CIQ.safeClickTouch}
	 * @param {boolean} [params.stopPropagation=false] If set to true then propagation will be stopped
	 * @memberOf  CIQ
	 * @since  04-2015
	 */
	CIQ.installTapEvent = function (div, params) {
		var fc = function (e) {
			var ev = new Event("stxtap", {
				bubbles: true,
				cancelable: true
			});
			if (typeof e.pageX == "undefined") {
				e.pageX = e.clientX;
				e.pageY = e.clientY;
			}
			ev.pageX = e.pageX;
			ev.pageY = e.pageY;
			e.target.dispatchEvent(ev);
			if (params && params.stopPropagation) e.stopPropagation();
		};
		CIQ.safeClickTouch(div, fc, params);
	};
	/**
	 * Use this instead of onclick or ontouch events. This function will automatically use the quickest available
	 * but also protect against being called twice.
	 * By default any previous safeClickTouch listeners will be cleared (to allow re-use of the element).
	 * @param {object} div The DOM element to attach an event
	 * @param {Function} fc The function to call when the object is pressed
	 * @param {object} params Parameters to drive behavior.
	 * @param {object} [params.safety] An object, generated from a CIQ.safeDrag association to prevent the click from being triggered when a drag operation is released
	 * @param {boolean} [params.allowMultiple=false] If set then multiple click events can be associated with the node
	 * @param {boolean} [params.preventUnderlayClick=true] By default prevents an underlaying element from being "clicked" on a touch device 400ms after the overlay was tapped. Set to false for input fields, or any div containing input fields (body)
	 * @param {boolean} [params.absorbDownEvent=true] Ensures that a mousedown, pointerdown, touchstart event doesn't get passed to the parent.
	 * @memberof CIQ
	 * @since 11/01/2015 Removed timers in favor of a new algorithm. This algorithm allows only the first event to fire from a UI interaction to execute the fc function.
	 */
	CIQ.safeClickTouch = function (div, fc, params) {
		if (!params) params = {};
		var movementWatcher = {};
		// **Internal Developers**
		// Because the chart itself makes use of touch and mouse events, it may not make sense to use this function if you are trying to prevent a default click from being passed to the chart container.
		// Pointer events (which safeClickTouch will try to use) do not stop propagating mouse and touch events even if you are preventing default b/c they are different event types.
		// In reality this means that if you are clicking on a DOM node that is on the chart, it will emit a mouse click to the chart b/c the chart is ALWAYS LISTENING.
		// Put simply the chart is designed using mouse/touch paradigm and it is easier to not mix in pointer events. Meanwhile the UI layer is developed using pointer events and we should keep using pointer events there.
	
		if (!params.allowMultiple) CIQ.clearSafeClickTouches(div);
		if (params.preventUnderlayClick !== false) params.preventUnderlayClick = true;
		if (params.absorbDownEvent !== false) params.absorbDownEvent = true;
		params.allowAnotherDevice = 0;
		params.registeredClick = false;
		function closure(which, params, movementWatcher) {
			return function (e) {
				if (!CIQ.safeClickTouchEvent) {
					if (!movementWatcher.t) {
						return; // is this up/end event related to a down/start event?
					}
					var timeSincePressed = movementWatcher.t;
					movementWatcher.t = null;
					if (timeSincePressed + 1000 < new Date().getTime()) return; //allow no more than 1 second for click
				}
				if (params.safety && params.safety.recentlyDragged) return;
	
				if ((e.which && e.which >= 2) || (e.button && e.button >= 2)) return; // ignore right clicks
				if (params.preventUnderlayClick) {
					// underlay click happens when you tap on a mobile device but a second mouse event registers
					// 300 ms later on another clickable object that was beneath the menu. By default we stop this
					// secondary event using preventDefault. However, we don't want to do this if we clicked inside
					// an input tag, because that would prevent the soft keyboard from coming up. Note that modern
					// touch operating systems don't have the 300ms delay issue so this code can be eliminated once
					// older operating systems are safely retired.
					if (e.target.tagName !== "INPUT") e.preventDefault();
				} else {
					// prevent touch and mouse from being clicked when we can't use preventDefault
					if (params.lastType != which && Date.now() < params.allowAnotherDevice)
						return;
					params.lastType = which;
					params.allowAnotherDevice = Date.now() + 1000; // 1 Second then not a coat tail mouse click
				}
				fc(e);
			};
		}
		function isClick(movementWatcher, down) {
			return function (e) {
				var x = e.clientX ? e.clientX : e.pageX;
				var y = e.clientY ? e.clientY : e.pageY;
				if (down) {
					movementWatcher.t = new Date().getTime();
					movementWatcher.x = x;
					movementWatcher.y = y;
				} else if (movementWatcher.x) {
					//allow no more than 4 pixel distance movement
					if (
						Math.pow(movementWatcher.x - x, 2) +
							Math.pow(movementWatcher.y - y, 2) >
						16
					) {
						movementWatcher.t = null;
					}
				}
			};
		}
		var safeClickTouchEvents = div.safeClickTouchEvents;
		if (!safeClickTouchEvents)
			safeClickTouchEvents = div.safeClickTouchEvents = [];
		var fc1 = closure("mouseup", params, movementWatcher);
		var fc2 = closure("touchend", params, movementWatcher);
		var fc3 = closure("pointerup", params, movementWatcher);
		var f = function (e) {
			e.stopPropagation();
		};
		var eventHolder = {};
		if (CIQ.safeClickTouchEvent) {
			// global override for which event to use, for instance if you want to force use of "click" or "tap"
			var fc4 = closure(CIQ.safeClickTouchEvent, params);
			div.addEventListener(CIQ.safeClickTouchEvent, fc4);
			eventHolder[CIQ.safeClickTouchEvent] = fc4;
			safeClickTouchEvents.push(eventHolder);
		} else if ("onpointerup" in document && !CIQ.noPointerEvents) {
			// Internet Explorer can always use pointerup safely
			div.addEventListener("pointerdown", isClick(movementWatcher, true));
			div.addEventListener("pointermove", isClick(movementWatcher));
			div.addEventListener("pointerup", fc3);
			eventHolder.pointerup = fc3;
			if (params.absorbDownEvent) {
				div.addEventListener("pointerdown", f);
				eventHolder.pointerdown = f;
			}
			safeClickTouchEvents.push(eventHolder);
		} else {
			// all in one computers can support both of these under Chrome/FF!
			div.addEventListener("mousedown", isClick(movementWatcher, true));
			div.addEventListener("mousemove", isClick(movementWatcher));
			div.addEventListener("touchstart", isClick(movementWatcher, true));
			div.addEventListener("touchmove", isClick(movementWatcher));
			div.addEventListener("mouseup", fc1);
			div.addEventListener("touchend", fc2);
			eventHolder.mouseup = fc1;
			eventHolder.touchend = fc2;
			if (params.absorbDownEvent) {
				div.addEventListener("mousedown", f);
				eventHolder.mousedown = f;
				div.addEventListener("touchstart", f);
				eventHolder.touchstart = f;
			}
			safeClickTouchEvents.push(eventHolder);
		}
	};
	
	/**
	 * Clears all safeClickTouch events from a DOM element.
	 * @param  {object} div The DOM element to clear events
	 * @memberof CIQ
	 */
	CIQ.clearSafeClickTouches = function (div) {
		var safeClickTouchEvents = div.safeClickTouchEvents;
		if (!safeClickTouchEvents) return;
		for (var i = 0; i < safeClickTouchEvents.length; i++) {
			var fc = safeClickTouchEvents[i];
			for (var e in fc) {
				var f = fc[e];
				div.removeEventListener(e, f);
			}
		}
		div.safeClickTouchEvents = null;
	};
	
	/**
	 * Safe function to handle dragging of objects on the screen.
	 *
	 * This method is cross-device aware and can handle mouse or touch drags.
	 * This method does not actually move the objects but provides callbacks that explain when drag operations
	 * begin and cease, and what movements are made during the drag. Callbacks should be used to move the actual objects
	 * (if it is desired to move objects during a drag operation). For convenience, displacementX and displacementY are added to callback events
	 * to indicate the distance from the original starting point of the drag.
	 * A "safety" object is returned which can optionally be passed into CIQ.safeClickTouch to prevent errant click events
	 * from being triggered when a user lets go of a drag
	 * @param  {object} div    The draggable DOM element
	 * @param  {object} [eventHandlers]
	 * @param  {function} [eventHandlers.down] Callback function when a drag operation begins. Receives an event object.
	 * @param  {function} [eventHandlers.move] Callback function when a drag move occurs. Receives an event object.
	 * @param  {function} [eventHandlers.up]   Callback function when the drag operation ends. Receives an event object.
	 * @return {object}        Safety object which can be passed to CIQ.safeClickTouch
	 * @memberof CIQ
	 * @since 7.0.0 change function signature to accept eventHandlers object instead of three function arguments
	 */
	CIQ.safeDrag = function (div, eventHandlers) {
		var eventProperty = function (key, alt) {
			return function (e) {
				if (e.touches) {
					if (e.touches.length > 0) {
						return e.touches[0][key];
					} else if (e.changedTouches && e.changedTouches.length > 0) {
						return e.changedTouches[0][key];
					}
				}
	
				return typeof e[key] !== "undefined" ? e[key] : e[alt];
			};
		};
		var pageX = eventProperty("pageX", "clientX");
		var pageY = eventProperty("pageY", "clientY");
	
		if (typeof eventHandlers === "function") {
			eventHandlers = {
				down: arguments[1], // fcDown
				move: arguments[2], // fcMove
				up: arguments[3] // fcUp
			};
		}
		eventHandlers = eventHandlers || {};
	
		var resetMS = 100; // To avoid multiple down events only one can occur per 100ms
		var registeredClick = false;
		var startX = 0;
		var startY = 0;
		var safety = {
			recentlyDragged: false
		};
	
		function startHandler(eventNames) {
			// event handler for mousedown, pointerdown, or touchstart
			return function (e) {
				if (registeredClick) return;
	
				registeredClick = true;
				CIQ.ChartEngine.ignoreTouch = true;
	
				var moveFC = function (e) {
					if (e && e.preventDefault) e.preventDefault();
	
					safety.recentlyDragged = true;
					e.displacementX = pageX(e) - startX;
					e.displacementY = pageY(e) - startY;
	
					eventHandlers.move(e);
				};
	
				if (eventHandlers.move) {
					document.body.addEventListener(eventNames.move, moveFC);
				}
	
				var upFC = function (e) {
					CIQ.ChartEngine.ignoreTouch = false;
	
					if (eventHandlers.move) {
						// Remove the move listener since our move is now complete
						document.body.removeEventListener(eventNames.move, moveFC);
					}
	
					// Remove the up listener since our move is now complete
					document.body.removeEventListener(eventNames.up, upFC);
					e.displacementX = pageX(e) - startX;
					e.displacementY = pageY(e) - startY;
	
					if (eventHandlers.up) {
						eventHandlers.up(e);
					}
	
					// Prevent errant clicks from touch letting go
					setTimeout(function () {
						safety.recentlyDragged = false;
					}, 50);
				};
	
				document.body.addEventListener(eventNames.up, upFC);
	
				setTimeout(function () {
					registeredClick = false;
				}, resetMS);
	
				startX = pageX(e);
				startY = pageY(e);
	
				if (eventHandlers.down) {
					eventHandlers.down(e);
				}
			};
		}
	
		div.addEventListener(
			"mousedown",
			startHandler({
				down: "mousedown",
				move: "mousemove",
				up: "mouseup"
			})
		);
		div.addEventListener(
			"pointerdown",
			startHandler({
				down: "pointerdown",
				move: "pointermove",
				up: "pointerup"
			})
		);
		div.addEventListener(
			"touchstart",
			startHandler({
				down: "touchstart",
				move: "touchmove",
				up: "touchend"
			}),
			{ passive: false }
		);
	
		return safety;
	};
	
	/**
	 * Captures enter key events. Also clears the input box on escape key.
	 * @param {object} node The DOM element to attach the event to. Should be a text input box.
	 * @param {Function} cb Callback function when enter key is pressed.
	 * @memberof CIQ
	 */
	
	CIQ.inputKeyEvents = function (node, cb) {
		node.addEventListener(
			"keyup",
			function (e) {
				var key = e.keyCode;
				switch (key) {
					case 13:
						cb();
						break;
					case 27:
						node.value = "";
						break;
					default:
						break;
				}
			},
			false
		);
	};
	
	/**
	 * Fixes screen scroll. This can occur when the keyboard opens on an ipad or iphone.
	 * @memberof CIQ
	 */
	CIQ.fixScreen = function () {
		window.scrollTo(0, 0);
	};
	
	/**
	 * Sets the position of the cursor within a textarea box. This is used for instance to position the cursor at the
	 * end of the text that is in a textarea.
	 * @param {object} ctrl A valid textarea DOM element
	 * @param {number} pos  The position in the text area to position
	 * @memberof CIQ
	 */
	CIQ.setCaretPosition = function (ctrl, pos) {
		ctrl.style.zIndex = 5000;
		if (ctrl.setSelectionRange) {
			CIQ.focus(ctrl);
			try {
				ctrl.setSelectionRange(pos, pos);
			} catch (e) {}
		} else if (ctrl.createTextRange) {
			var range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd("character", pos);
			range.moveStart("character", pos);
			range.select();
		}
	};
	
	/**
	 * Sets the value of an input box only if it is not active. This prevents an input box from changing underneath
	 * a user, which can be extremely frustrating on touch devices.
	 * @param {HTMLElement} el    The input element
	 * @param {string} value The value to set
	 * @memberOf  CIQ
	 */
	CIQ.setValueIfNotActive = function (el, value) {
		if (document.activeElement == el) return;
		el.value = value;
	};
	
	/**
	 * Closes the keyboard on a touch device by blurring any active input elements.
	 * @param {HTMLElement} [newFocus] Element to change focus to
	 * @memberof CIQ
	 */
	CIQ.hideKeyboard = function (newFocus) {
		var element = document.activeElement;
		if (element.tagName == "INPUT" || element.tagName == "TEXTAREA") {
			element.blur();
			window.focus();
			if (newFocus) {
				if (newFocus === document.body || document.body.contains(newFocus))
					newFocus.focus();
			}
		}
	};
	
	/**
	 * Adds or removes hover classes.  This function will manage the hovers so they won't trigger when touching.
	 * adapted from http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
	 * We are relying on touchend being called before mouseover
	 * @memberof CIQ
	 * @since 6.3.0
	 */
	CIQ.smartHover = function () {
		if (
			!document ||
			document.documentElement.hasAttribute("ciq-last-interaction")
		)
			return; // already initialized
		var isTouch = false; //var to indicate current input type (is touch versus no touch)
		var isTouchTimer;
	
		function setAttr(t) {
			document.documentElement.setAttribute("ciq-last-interaction", t);
		}
	
		function addTouchAttr(e) {
			clearTimeout(isTouchTimer);
			isTouch = true;
			//add attribute value of touch if it's not already set
			if (
				document.documentElement.getAttribute("ciq-last-interaction") != "touch"
			)
				setAttr("touch");
			//maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
			isTouchTimer = setTimeout(function () {
				isTouch = false;
			}, 500);
		}
	
		function removeTouchAttr(e) {
			//set attribute value if not triggered by a touch event
			if (!isTouch) setAttr("mouse");
		}
	
		document.addEventListener("touchend", addTouchAttr, false); //this event only gets called when input type is touch
		document.addEventListener("mouseover", removeTouchAttr, false); //this event gets called when input type is everything from touch to mouse/trackpad
		setAttr("");
	};
	
	/**
	 * Creates a document node which facilitates translation to other languages, if stx.translationCallback callback function is set.
	 * If there is no translationCallback, a standard text node is returned.
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {string} english The word to translate
	 * @param {string} [language] Language. Defaults to CIQ.I18N.language.
	 * @return {HTMLElement}	A node in the following form if translationCallback exists:
	 * 					<language original="english">translation</language>
	 * 							If it does not exist, a text node is returned.
	 * @memberof CIQ
	 */
	CIQ.translatableTextNode = function (stx, english, language) {
		if (stx.translationCallback) {
			var translationNode = document.createElement("translate");
			translationNode.setAttribute("original", english);
			translationNode.innerHTML = stx.translationCallback(english, language);
			return translationNode;
		}
		return document.createTextNode(english);
	};
	
	/**
	 * Gets all parent elements, including the starting element itself, in order of distance from the
	 * starting element, nearest parent first.
	 *
	 * Use instead of jQuery `parents()`.
	 *
	 * @param {HTMLElement} el The starting element from which parent elements are obtained.
	 * @param {string} [selector] A CSS selector used to select the parent elements included in the
	 * 		ancestor list. If no selector is provided, all parent elements are included.
	 * @return {Array} Ancestry of elements filtered by `selector` from the starting element up to and
	 * 		including the HTML element.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.climbUpDomTree = function (el, selector) {
		if (!(el instanceof HTMLElement)) return null;
		var list = [];
		// traverse parents
		while (el) {
			if (!selector || el.matches(selector)) list.push(el);
			el = el.parentElement;
		}
		return list;
	};
	
	/**
	 * Returns a guaranteed width and height. For instance, `cq-context` or any other wrapping tag can
	 * have a width of zero; if so, we need to go up the ancestry tree parent by parent until a
	 * parent element provides an actual width.
	 *
	 * @param {Element} element The starting element for which the width and height are obtained.
	 * @return {object} Width and height of `element` as properties of the returned object.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.guaranteedSize = function (element) {
		if (element === document) element = window;
		if (!element.nodeType) {
			return {
				width: element.innerWidth,
				height: element.innerHeight
			};
		}
		if (!element || element.nodeType > 1) return {};
		var w = element.offsetWidth;
		var h = element.offsetHeight;
		while (!w || !h) {
			if (element.tagName === "BODY" || element === window) {
				if (!w) w = window.innerWidth;
				if (!h) h = window.innerHeight;
				break;
			}
			element = element.parentElement;
			if (!w) w = element.offsetWidth;
			if (!h) h = element.offsetHeight;
		}
		return { width: w, height: h };
	};
	
	/**
	 * Determines the visibility of a DOM element based on the following CSS properties:
	 * - opacity
	 * - display
	 * - visibility
	 * - width
	 * - height
	 *
	 * Replaces {@link CIQ.UI.trulyVisible}.
	 *
	 * @param {HTMLElement} node The node for which visibility is determined.
	 * @return {boolean} Whether the element is visible.
	 *
	 * @memberof CIQ
	 * @since 8.2.0
	 */
	CIQ.trulyVisible = function (node) {
		if (!node) return true;
		const computedStyle = getComputedStyle(node);
		if (computedStyle.opacity === "0") return false;
		if (computedStyle.display === "none") return false;
		if (computedStyle.visibility === "hidden") return false;
		if (parseInt(computedStyle.width, 10) === 0) return false;
		if (
			parseInt(computedStyle.height, 10) === 0 &&
			computedStyle.overflowY == "hidden"
		)
			return false;
	
		return CIQ.trulyVisible(node.parentElement);
	};
	
	/**
	 * Measures an element's styled width and height. Assumes all style units are in pixels (px), not
	 * percentages or "auto".
	 *
	 * Use the `flags` parameter to specify whether padding, border, and margin should be included in
	 * the measurement.
	 *
	 * @param {HTMLElement} element The element to measure.
	 * @param {object} [flags] Measurement parameters.
	 * @param {boolean} [flags.padding] Include padding in the measurement.
	 * @param {boolean} [flags.border] Include border in the measurement.
	 * @param {boolean} [flags.margin] Include margin in the measurement.
	 * @return {object} Width and height as properties of the returned object.
	 *
	 * @memberof CIQ
	 * @since 8.1.0
	 */
	CIQ.elementDimensions = function (element, flags) {
		if (!element || element.nodeType !== 1) return {};
		var gcs = getComputedStyle(element);
		var dims = { width: parseFloat(gcs.width), height: parseFloat(gcs.height) };
		var fluff = {
			margin: {},
			border: {},
			padding: {}
		};
		var props = ["width", "height"];
		for (var f in fluff) {
			var qual = f == "border" ? "Width" : "";
			fluff[f] = {
				width:
					parseFloat(gcs[f + "Left" + qual]) +
					parseFloat(gcs[f + "Right" + qual]),
				height:
					parseFloat(gcs[f + "Top" + qual]) + parseFloat(gcs[f + "Bottom" + qual])
			};
		}
		if (flags && flags.margin)
			props.forEach(function (i) {
				dims[i] += fluff.margin[i];
			});
		if (flags && gcs.boxSizing === "content-box") {
			if (flags.padding)
				props.forEach(function (i) {
					dims[i] += fluff.padding[i];
				});
			if (flags.border)
				props.forEach(function (i) {
					dims[i] += fluff.border[i];
				});
		} else if (gcs.boxSizing === "border-box") {
			if (!flags || !flags.padding)
				props.forEach(function (i) {
					dims[i] -= fluff.padding[i];
				});
			if (!flags || !flags.border)
				props.forEach(function (i) {
					dims[i] -= fluff.border[i];
				});
		}
		return dims;
	};
	
	/**
	 * Executes a listener function if the element being observed has been resized.
	 * Uses the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API if available, otherwise uses an interval check.
	 *
	 * @param {HTMLElement} element The element to observe for resizing.
	 * @param {function} listener The function to be executed on a resize event.
	 * @param {object} resizeHandle A handle to the resizer, which is null the first time the function is called,
	 * 		or is the return value of the function for subsequent calls.
	 * @param {number} timeout Timeout interval for browsers that need to use interval checking. Set this value
	 * 		to 0 to turn off the observer.
	 * @return {object} A handle to the resizer, which can be passed again to the function to disable or reset
	 * 		the handle.
	 * @memberof CIQ
	 * @since 7.4.0
	 */
	CIQ.resizeObserver = function (element, listener, resizeHandle, timeout) {
		if (timeout) {
			if (typeof ResizeObserver !== "undefined") {
				if (!resizeHandle) {
					resizeHandle = new ResizeObserver(listener);
					resizeHandle.observe(element);
				}
			} else {
				if (resizeHandle) clearInterval(resizeHandle);
				resizeHandle = setInterval(listener, timeout);
			}
		} else {
			if (resizeHandle) {
				if (typeof ResizeObserver !== "undefined") {
					resizeHandle.disconnect();
				} else {
					clearInterval(resizeHandle);
				}
			}
			resizeHandle = null;
		}
		return resizeHandle;
	};
	
	/**
	 * Turns a portion of raw text into multi-line text that fits in a given width. This is used for autoformatting of annotations
	 * @param  {object} ctx    A valid HTML Canvas Context
	 * @param  {string} phrase The text
	 * @param  {number} l      The width in pixels to fit the text within on the canvas
	 * @return {array}        An array of individual lines that should fit within the specified width
	 * @memberof CIQ
	 */
	CIQ.getLines = function (ctx, phrase, l) {
		var wa = phrase.split(" "),
			phraseArray = [],
			lastPhrase = "",
			measure = 0;
		var fw = false;
		for (var i = 0; i < wa.length; i++) {
			var w = wa[i];
			measure = ctx.measureText(lastPhrase + w).width;
			if (measure < l) {
				if (fw) lastPhrase += " ";
				fw = true;
				lastPhrase += w;
			} else {
				phraseArray.push(lastPhrase);
				lastPhrase = w;
			}
			if (i === wa.length - 1) {
				phraseArray.push(lastPhrase);
				break;
			}
		}
		return phraseArray;
	};
	
	/**
	 * Creates a user-friendly alert.
	 *
	 * The charting engine uses this function instead of
	 * [window.alert()]{@link https://developer.mozilla.org/en-US/docs/Web/API/Window/alert} for
	 * warning and error messages. If the window object does not exist, the message is output to the
	 * console log.
	 *
	 * Override this function to create a custom alert.
	 *
	 * @param {string} text The message to be displayed.
	 *
	 * @memberof CIQ
	 * @since 8.0.0 Output the message to the console log if the window object does not exist.
	 *
	 * @example
	 * // Override with a friendlier alert mechanism!
	 * CIQ.alert=function(text){
	 * 	doSomethingElse(text);
	 * }
	 */
	CIQ.alert = function (text) {
		if (typeof window !== "undefined") window.alert(text);
		else console.log(text);
	};
	
	// Some browsers don't support localStorage, worse won't let you polyfill (JDK7 webview). So we will create
	// this so that we can add a polyfill.
	try {
		if (typeof localStorage !== "undefined") CIQ.localStorage = localStorage;
	} catch (e) {}
	
	if (!CIQ.localStorage)
		CIQ.localStorage = {
			items: {},
			getItem: function (item) {
				return CIQ.localStorage.items[item] || null;
			},
			setItem: function (item, value) {
				CIQ.localStorage.items[item] = value;
			},
			removeItem: function (item) {
				delete CIQ.localStorage.items[item];
			}
		};
	
	/**
	 * Set once after user is alerted that private browsing is enabled
	 * @memberof CIQ
	 * @type boolean
	 */
	CIQ.privateBrowsingAlert = false;
	
	/**
	 * Convenience function for storing a name/value pair in local storage. Detects whether private
	 * browsing is enabled since local storage is inoperable under private browsing.
	 *
	 * @param {string} name The name for the stored item.
	 * @param {string} value The value for the stored item.
	 *
	 * @memberof CIQ
	 */
	CIQ.localStorageSetItem = function (name, value) {
		try {
			CIQ.localStorage.setItem(name, value);
		} catch (e) {
			if (!CIQ.privateBrowsingAlert) {
				CIQ.alert(
					"No storage space available.  Possible causes include browser being in Private Browsing mode, or maximum storage space has been reached."
				);
				CIQ.privateBrowsingAlert = true;
			}
		}
	};
	
	};
	
	
	let __js_core_engineInit_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Previously `STXChart`.
	 *
	 * This is the constructor that creates a chart engine, instantiates its basic chart object and links it to its DOM container.
	 *
	 * Before any chart operations can be performed, this constructor must be called.
	 *
	 * Multiple CIQ.ChartEngine objects can exist on the same HTML document. <br>
	 * 	<iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/46whz5ag/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 *
	 * Once instantiated, the chart engine will never need to be constructed again, unless it is [destroyed]{@link CIQ.ChartEngine#destroy}.<br>
	 * To load or change symbols on the chart, simply call {@link CIQ.ChartEngine#loadChart}.
	 *
	 * @constructor
	 * @param {object} config Configuration object used to initialize the chart engine.<br>
	 * {@link CIQ.ChartEngine#container} is the minimum requirement. The complete list of parameters and objects can be found in the **Members** section of this page.<br>
	 * Example:
	 * 	<iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/xkm4mufy/embedded/js,result,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
	 * @name  CIQ.ChartEngine
	 * @example
	 * // declare a chart
	 * var stxx=new CIQ.ChartEngine({container: document.querySelector(".chartContainer")});
	 * // override defaults after a chart object is declared (this can be done at any time. If the chart has already been rendered, you will need to call `stx.draw();` to immediately see your changes )
	 * stxx.yaxisLabelStyle="roundRectArrow";
	 * stxx.layout.chartType="bar";
	 * @example
	 * // declare a chart and preset defaults
	 * var stxx=new CIQ.ChartEngine({container: document.querySelector(".chartContainer"),layout:{"chartType": "candle","candleWidth": 16}});
	 * @since
	 * - 15-07-01 Deprecated `CIQ.ChartEngine#underlayPercentage`.
	 * - m-2016-12-01 Deprecated; renamed `CIQ.ChartEngine` from `STXChart`.
	 */
	CIQ.ChartEngine = function (config) {
		if (!config) {
			config = {
				container: null
			};
		} else if (
			typeof HTMLDivElement != "undefined" &&
			config.constructor == HTMLDivElement
		) {
			// legacy versions accepted the chart container as the first parameters rather than a config object
			var newConfig = {
				container: config
			};
			config = newConfig;
		}
	
		// copy prototype values into instance
		for (var n in prototypeSwitches) {
			this[n] = CIQ.clone(CIQ.ChartEngine.prototype[n]);
		}
	
		/**
		 * The DOM container that will be running the chart engine. This is a required field when calling [new CIQ.ChartEngine]{@link CIQ.ChartEngine}
		 * @type object
		 * @alias container
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @example
		 * // declare a chart
		 * var stxx=new CIQ.ChartEngine({container: document.querySelector(".chartContainer")});
		 */
		this.container = null;
		/**
		 * Set to false to bypass chart panel creation in {@link CIQ.ChartEngine#construct}.
		 * @type boolean
		 * @alias createChartPanel
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @private
		 */
		this.createChartPanel = true;
		/**
		 * READ ONLY. A map of marker objects, sorted by label.
		 * @type object
		 * @alias markers
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.markers = {};
		/**
		 * READ ONLY. An array of currently enabled panels
		 * @type object
		 * @alias panels
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.panels = {};
		/**
		 * READ ONLY. An array of currently enabled overlay studies
		 * @type object
		 * @alias overlays
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.overlays = {};
		/**
		 * READ ONLY. The charts on the screen. Will contain at least one item, "chart"
		 * @type object
		 * @alias charts
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @private
		 */
		this.charts = {};
		/**
		 * READ ONLY. Array of event listeners currently attached to the engine.
		 * These listeners will be killed when {@link CIQ.ChartEngine#destroy} is called.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener} and {@link CIQ.ChartEngine#removeEventListener}
		 * @type array
		 * @alias eventListeners
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.eventListeners = [];
	
		/**
		 * Holds the HTML control elements managed by the chart. Usually this will be a copy of the default [htmlControls]{@link CIQ.ChartEngine.htmlControls}.
		 * These are not the GUI elements around the chart, but rather the HTML elements that the library will directly interact with on the canvas
		 * for things like panel resizing, study edit controls, zooming controls, etc. See {@link CIQ.ChartEngine.htmlControls} for more details.
		 * @type object
		 * @alias controls
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.controls = {}; // contains the HTML controls for the chart (zoom, home, etc)
		this.goneVertical = false; // Used internally for pinching algorithm
		/**
		 * READ ONLY. Toggles to true when the screen is being pinched
		 * @type boolean
		 * @default
		 * @alias pinchingScreen
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.pinchingScreen = false;
		/**
		 * READ ONLY. Toggles to true when the screen is being panned
		 * @type boolean
		 * @default
		 * @alias grabbingScreen
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.grabbingScreen = false;
		this.grabStartX = 0; // Used internally for panning
		this.grabStartY = 0; // "
		this.grabStartScrollX = 0; // "
		this.grabStartScrollY = 0; // "
		this.swipe = {}; // "
	
		this.grabStartCandleWidth = 0; // Used internally for zooming
		this.grabStartZoom = 0; // "
		this.grabOverrideClick = false; // "
		this.grabMode = ""; // Used internally. Set to either pan, zoom-x or zoom-y when grabbing screen
		this.vectorsShowing = false; // Used internally to ensure that vectors aren't drawn more than once
		this.mouseMode = true; // Used internally. For Windows8 devices this is set to true or false depending on whether the last touch was a mouse click or touch event. To support all-in-one computers
		this.lineTravelSpacing = false; // Used internally as an override for candleWidth spacing
	
		this.highlightedDataSetField = null; // READ ONLY. Set to field whose plot is currently highlighted (series or study)
		this.anyHighlighted = false; // READ ONLY. Toggles to true if any drawing or overlay is highlighted for deletion
		this.accessoryTimer = null; // Used internally to control drawing performance
		this.lastAccessoryUpdate = new Date().getTime(); // "
		this.displayCrosshairs = true; // READ ONLY. Use doDisplayCrosshairs() or undisplayCrosshairs()
		this.hrPanel = null; // READ ONLY. Current panel that mouse is hovering over
		this.editingAnnotation = false; // READ ONLY. True if an annotation is open for editing
		this.openDialog = ""; // Set this to non-blank to disable chart touch and mouse events use CIQ.ChartEngine.prototype.modalBegin() and CIQ.ChartEngine.prototype.modalEnd
	
		this.touches = []; // Used internally for touch
		this.changedTouches = []; // Used internally for touch
		/**
		 * READ ONLY. The tick representing the crosshair cursor point
		 * @type number
		 * @alias crosshairTick
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.crosshairTick = null;
		/**
		 * READ ONLY. The value (price) representing the crosshair cursor point
		 * @type number
		 * @alias crosshairValue
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.crosshairValue = null;
	
		this.pt = {
			x1: -1,
			x2: -1,
			y1: -1,
			y2: -1
		};
		this.moveA = -1; // Used internally for touch
		this.moveB = -1; // "
		this.touchStartTime = -1; // "
		this.touchPointerType = ""; // "
		this.gestureStartDistance = -1; // "
		this.grabStartPeriodicity = 1; // "
		this.grabEndPeriodicity = -1; // "
		this.scrollEvent = null; // "
		this.cmd = false; // "
		this.ctrl = false; // "
		this.shift = false; // "
		this.userPointerDown = false; //represents either mouse button or finger on touch device
		/**
			 * Manage drawing cloning state.
			 *
			 * Set to `true` to enable the ability to clone drawings.<br>
			 * Once enabled, drawings can be cloned once or multiple times.
			 * A user must highlight the drawing, click on it, move the mouse to a new location and click again to set.<br>
			 * Reset to `false` when you want the cloning to end.
			 *
			 * This can be done based on a key stroke, button press, etc. For example, you can set to true when the `control` key is pressed and disable when it is released.
			 * @type number
			 * @default
			 * @alias cloneDrawing
			 * @memberof CIQ.ChartEngine
			 * @instance
			 * @since 07-2016-16.7
			 * @example
			 *
				document.onkeyup=keyup;
				document.onkeydown=keydown;
	
				// disable cloning if the ctl key is released
				function keyup(e){
					var key = (window.event) ? event.keyCode : e.keyCode;
					if (key == 18 ) stxx.cloneDrawing=false;
				}
	
				// enable cloning if the ctl key is pressed
				function keydown(e){
					var key = (window.event) ? event.keyCode : e.keyCode;
					if (key == 18 ) stxx.cloneDrawing=true;
				}
			 */
		this.cloneDrawing = false;
		/**
		 * READ ONLY. Toggles to true whenever the mouse cursor is within the chart (canvas)
		 * @type boolean
		 * @default
		 * @alias insideChart
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.insideChart = false;
		/**
		 * READ ONLY. Toggles to true if the mouse cursor is over the X Axis.
		 * @type boolean
		 * @default
		 * @alias overXAxis
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.overXAxis = false;
		/**
		 * READ ONLY. Toggles to true if the mouse cursor is over the Y Axis.
		 * @type boolean
		 * @default
		 * @alias overYAxis
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.overYAxis = false;
		/**
		 * READ ONLY. This gets set to true when the chart display has been initialized.
		 * @type boolean
		 * @default
		 * @alias displayInitialized
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.displayInitialized = false;
		/**
		 * READ ONLY. Mouse pointer X pixel location in reference to the chart canvas. where cx=0 and cy=0 is the upper left corner of the chart.
		 * @type number
		 * @alias cx
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.cx = null;
		/**
		 * READ ONLY. If `true` the chart is in 'historical mode' and no [quotefeed]{@tutorial DataIntegrationQuoteFeeds} 'update' calls will be made.
		 *
		 * This happens when [setSpan]{@link CIQ.ChartEngine#setSpan} or [setRange]{@link CIQ.ChartEngine#setRange} are used to 'jump' to a range in the distance past,
		 * where the master data no longer extends from the end of the displayed range to the current bar.
		 * @type boolean
		 * @alias isHistoricalModeSet
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.isHistoricalModeSet = null;
		/**
		 * READ ONLY. Mouse pointer Y pixel location in reference to the chart canvas. where cx=0 and cy=0 is the upper left corner of the chart.
		 * @type number
		 * @alias cy
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.cy = null;
	
		this.clicks = {
			s1MS: -1,
			e1MS: -1,
			s2MS: -1,
			e2MS: -1
		};
	
		this.cancelTouchSingleClick = false; // Set this to true whenever a screen item is touched so as to avoid a chart touch event
		this.locale = null; // set by setLocale()
		/**
		 * READ ONLY. Timezone of the masterData, set by {@link CIQ.ChartEngine#setTimeZone}.
		 * @type {string}
		 * @alias dataZone
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.dataZone = null;
		/**
		 * READ ONLY. Timezone to display on the chart, set by {@link CIQ.ChartEngine#setTimeZone}.
		 * @type {string}
		 * @alias displayZone
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.displayZone = null;
		this.timeZoneOffset = 0; // use setTimeZone() to compute this value
		this.masterData = null; // Contains the historical quotes for the current chart
		/**
		 * Register this function to transform the data set before a createDataSet() event; such as change in periodicity.
		 * You can also explicitly call  <code>stxx.createDataSet(); stxx.draw();</code> to trigger this function.
		 *
		 * Expected Format :
		 *
		 * 		fc(stxChart, dataSet);
		 *
		 * @type {function}
		 * @alias transformDataSetPre
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @example
		 * stxx.transformDataSetPre=function(stxx, dataSet){
		 *		for(var i=0;i < dataSet.length;i++){
		 *			// do something to the dataset here
		 *		}
		 * }
		 */
		this.transformDataSetPre = null;
		/**
		 * Register this function to transform the data set after a createDataSet() event; such as change in periodicity.
		 * You can also explicitly call  <code>stxx.createDataSet(); stxx.draw();</code> to trigger this function.
		 *
		 * Expected Format :
		 *
		 * 		fc(stxChart, dataSet, min low price in the dataset, max high price in the dataset);
		 *
		 * @type {function}
		 * @alias transformDataSetPost
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @example
		 * stxx.transformDataSetPost=function(self, dataSet, min, max){
		 *		for(var i=0;i < dataSet.length;i++){
		 *			// do something to the dataset here
		 *		}
		 * }
		 */
		this.transformDataSetPost = null;
		/**
		 * This is the callback function used by {@link CIQ.ChartEngine#setPeriodicity} when no quotefeed has been attached to the chart.
		 * Called if the masterData does not have the interval requested.
		 *
		 * Do not initialize if you are using a {@link quotefeed }
		 *
		 * @type {function}
		 * @alias dataCallback
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @example
		 * stxx.dataCallback=function(){
		 *		// put code here to get the new data in the correct periodicity.
		 *		// use layout.interval and layout.periodicity to determine what you need.
		 *		// finally call stxx.loadChart(symbol,data) to load the data and render the chart.
		 * }
		 */
		this.dataCallback = null;
		/**
		 * Stores a list of active drawing object on the chart. Serialized renditions of drawings can be added using {@link CIQ.ChartEngine#createDrawing} and removed using {@link CIQ.ChartEngine#removeDrawing}
		 * @type array
		 * @default
		 * @alias drawingObjects
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.drawingObjects = [];
		this.undoStamps = [];
		/**
		 * READ ONLY. Flag that specifies whether the background canvas should be used to draw grid lines and axes.
		 * This flag is set to true when the `canvasShim` contains child elements. The `canvasShim` is the background
		 * canvas &mdash; an HTML container behind the main chart canvas.
		 *
		 * Check this flag to determine whether the `canvasShim` is being used to create background drawings.
		 *
		 * @see {@link CIQ.Visualization}
		 * @see {@link CIQ.ChartEngine#embedVisualization}.
		 * @type boolean
		 * @default
		 * @alias useBackgroundCanvas
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @since 7.4.0
		 */
		this.useBackgroundCanvas = false;
		/**
		 * READ ONLY. Access the renderer controlling the main series.
		 * @type CIQ.Renderer
		 * @default
		 * @alias mainSeriesRenderer
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.mainSeriesRenderer = null;
		/**
		 * Object that stores the styles used by the chart.
		 * @type object
		 * @alias styles
		 * @instance
		 * @memberof CIQ.ChartEngine
		 */
		this.styles = {}; // Contains CSS styles used internally to render canvas elements
		/**
		 * Placeholder for plugin data sets. This array will register each plug in object, complete with their functions.
		 *
		 * If defined, Plug-in instances will be called by their corresponding native functions for the following:
		 * - consolidate ( called by {@link CIQ.ChartEngine#consolidatedQuote})
		 * - drawUnder (called by draw before rendering underlays)
		 * - drawOver (called by draw after rendering overlays)
		 * - {@link CIQ.ChartEngine#setMasterData}
		 * - {@link CIQ.ChartEngine#updateChartData}
		 * - {@link CIQ.ChartEngine#initializeChart}
		 * - {@link CIQ.ChartEngine#createDataSet}
		 * - {@link CIQ.ChartEngine#findHighlights}
		 * @type array
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @private
		 */
		this.plugins = {};
		/**
		 * Cloned copy of {@link CIQ.ChartEngine.currentVectorParameters} object template.
		 * Use it to store the settings for the active drawing tool.
		 * @type {CIQ.ChartEngine.currentVectorParameters}
		 * @default
		 * @alias currentVectorParameters
		 * @memberof CIQ.ChartEngine
		 * @instance
		 * @tsdeclaration
		 * public currentVectorParameters: typeof CIQ.ChartEngine.currentVectorParameters
		 */
		this.currentVectorParameters = CIQ.clone(
			CIQ.ChartEngine.currentVectorParameters
		); // contains the current drawing parameters for this chart
		/**
		 * Holds {@link CIQ.ChartEngine.Chart} object
		 * @type CIQ.ChartEngine.Chart
		 * @default
		 * @alias chart
		 * @memberof CIQ.ChartEngine
		 * @instance
		 */
		this.chart = new CIQ.ChartEngine.Chart();
		var chart = this.chart;
		chart.name = "chart";
		chart.yAxis.name = "chart";
		chart.canvas = null; // Contains the HTML5 canvas with the chart and drawings
		chart.tempCanvas = null; // lays on top of the canvas and is used when creating drawings
		chart.container = config.container;
		if (CIQ.Market) chart.market = new CIQ.Market(); //create a default market, always open
		this.charts.chart = chart;
	
		CIQ.extend(this, config);
	
		if (config.container) {
			if (this.registerHTMLElements) this.registerHTMLElements();
			// Initialize the very basic dimensions of chart so that it is operational immediately
			chart.width = chart.container.clientWidth - chart.yAxis.width;
			this.setCandleWidth(this.layout.candleWidth, chart);
			chart.canvasHeight = chart.container.clientHeight;
		}
		this.construct();
	};
	
	/**
	 * READ ONLY. Toggles to true when a drawing is initiated
	 * @type boolean
	 * @default
	 * @alias drawingLine
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.drawingLine = false;
	/**
	 * READ ONLY. Toggles to true when a panel is being resized
	 * @type boolean
	 * @default
	 * @alias resizingPanel
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.resizingPanel = null;
	/**
	 * READ ONLY. Current X screen coordinate of the crosshair.
	 * @type number
	 * @default
	 * @alias crosshairX
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.crosshairX = 0;
	/**
	 * READ ONLY. Current Y screen coordinate of the crosshair.
	 * @type number
	 * @default
	 * @alias crosshairY
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.crosshairY = 0;
	/**
	 * [Browser animation API](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) is on by default.
	 * @type boolean
	 * @default
	 * @alias useAnimation
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.useAnimation = true;
	
	CIQ.ChartEngine.enableCaching = false;
	/**
	 * Set to true to true to bypass all touch event handling.
	 * @type number
	 * @default
	 * @alias ignoreTouch
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.ignoreTouch = false;
	/**
	 * Mitigates problems clearing the canvas on old (defective) Android devices by performing additional function on the canvas, normally not needed on the newer devices.
	 * Set to false to boost native android browser performance, but at risk of "double candle" display errors on some older devices.
	 * @type boolean
	 * @default
	 * @alias useOldAndroidClear
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.useOldAndroidClear = true;
	
	// Documented in standard/drawing.js
	CIQ.ChartEngine.currentVectorParameters = {};
	
	/**
	 * If set to a valid time zone identifier, then new CIQ.ChartEngine objects will pull their display timezone from this.
	 * @type {string}
	 * @alias defaultDisplayTimeZone
	 * @static
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.defaultDisplayTimeZone = null; // If set, then new CIQ.ChartEngine objects will pull their display timezone from this
	
	/**
	 * If set, overrides the default base path for plug-ins.
	 *
	 * By default, plug-ins loaded by means of a script tag check for resources inside the
	 * plug-ins directory, `plugins/`. However, if the application is served from outside the
	 * `chartiq` directory, or the plug-ins folder is otherwise not available at `./`, you may
	 * need to specify where the plug-ins directory can be found so resources can be loaded.
	 *
	 * Path must end in `/`.
	 *
	 * @type string
	 * @default
	 * @alias pluginBasePath
	 * @static
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.pluginBasePath = "plugins/";
	
	CIQ.ChartEngine.registeredContainers = []; // This will contain an array of all of the CIQ container objects
	// Note that if you are dynamically destroying containers in the DOM you should delete them from this array when you do so
	
	/**
	 * Calls the functions in {@link CIQ.ChartEngine.helpersToRegister} to instantiate the registered
	 * chart helpers.
	 *
	 * @param {CIQ.ChartEngine} stx A chart engine reference, which is passed to the functions in
	 * {@link CIQ.ChartEngine.helpersToRegister}.
	 *
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.registerHelpers = function (stx) {
		CIQ.ChartEngine.helpersToRegister.forEach(function (registrationFn) {
			registrationFn(stx);
		});
	};
	
	/**
	 * An array of functions that instantiate helpers for the chart engine.
	 *
	 * Modules that define a chart helper should push a function to this array so that the helper can
	 * be created by {@link CIQ.ChartEngine.registerHelpers}. The function should include a parameter
	 * of type {@link CIQ.ChartEngine} and attach the helper to the chart engine referenced by the
	 * parameter (see example).
	 *
	 * @type function[]
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 8.2.0
	 *
	 * @example
	 * CIQ.ChartEngine.helpersToRegister.push(function (stx) {
	 *     stx.baselineHelper = new Map();
	 * });
	 */
	CIQ.ChartEngine.helpersToRegister = [];
	
	/**
	 * Private construction of the chart object. This is called from the actual constructor
	 * for CIQ.ChartEngine.
	 * @private
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 07/01/2015
	 * - 7.1.0 Changed `longHoldTime` to 700ms default.
	 */
	CIQ.ChartEngine.prototype.construct = function () {
		if (this.createChartPanel) {
			this.stackPanel("chart", "chart", 1);
			this.adjustPanelPositions();
			this.chart.panel = this.panels[this.chart.name];
		}
		this.cx = 0;
		this.cy = 0;
		this.micropixels = 0;
		this.callbackListeners = {
			/**
			 * Called by {@link CIQ.ChartEngine.AdvancedInjectable#touchDoubleClick} when the chart
			 * is quickly tapped twice.
			 *
			 * @param {object} data Data relevant to the "tap" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {number} data.finger Indicates which finger double-tapped.
			 * @param {number} data.x The crosshairs x-coordinate.
			 * @param {number} data.y The crosshairs y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~doubleTapEventListener
			 * @since 4.0.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			doubleTap: [],
			/**
			 * Called by {@link CIQ.ChartEngine#doubleClick} when the chart is quickly clicked or
			 * tapped twice.
			 *
			 * @param {object} data Data relevant to the double-click or double-tap event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {number} data.button The button or finger that double-clicked or
			 * 		double-tapped.
			 * @param {number} data.x The double-click or crosshairs x-coordinate.
			 * @param {number} data.y The double-click or crosshairs y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~doubleClickEventListener
			 * @since 8.0.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			doubleClick: [],
			/**
			 * Called when a drawing is added, removed, or modified.
			 *
			 * Such as calling {@link CIQ.ChartEngine#clearDrawings},
			 * {@link CIQ.ChartEngine#removeDrawing}, {@link CIQ.ChartEngine#undoLast}, or
			 * {@link CIQ.ChartEngine#drawingClick}.
			 *
			 * @param {object} data Data relevant to the "drawing" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The current chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {object} data.layout The chart's layout object ({@link CIQ.ChartEngine#layout}).
			 * @param {Array} data.drawings The chart's current drawings ({@link CIQ.Drawing}).
			 *
			 * @callback CIQ.ChartEngine~drawingEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			drawing: [],
			/**
			 * A right-click on a highlighted drawing.
			 *
			 * @param {object} data Data relevant to the "drawingEdit" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {CIQ.Drawing} data.drawing The highlighted drawing instance.
			 *
			 * @callback CIQ.ChartEngine~drawingEditEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			drawingEdit: [],
			/**
			 * Called to open a window that can be moved and resized by the user.
			 *
			 * For example, called by {@link CIQ.Shortcuts} to display the keyboard shortcuts legend.
			 *
			 * @param {object} data Data relevant to the "floatingWindow" event.
			 * @param {string} data.type The type of floating window to open; for example, "shortcut"
			 * 		for a floating window containing the keyboard shortcuts legend (see
			 * 		{@link CIQ.Shortcuts}).
			 * @param {string} data.content The contents of the floating window, typically an HTML
			 * 		string.
			 * @param {object} [data.container] The DOM element that visually contains the floating
			 * 		window. The window is positioned on screen relative to the element (see
			 * 		{@link WebComponents.cq-floating-window.DocWindow#positionRelativeTo}). Defaults
			 * 		to `document.body`.
			 * 		<p>**Note:** The markup of the DOM element does not need to lexically contain the
			 * 		markup of the floating window.
			 * @param {string} [data.title] Text that appears in the title bar of the floating window.
			 * @param {number} [data.width] The width of the floating window in pixels.
			 * @param {boolean} [data.status] The floating window state: true, to open the floating
			 * 		window; false, to close it. If the parameter is not provided, the floating window
			 * 		is toggled (opened if closed, closed if open).
			 * @param {string} [data.tag] A label that identifies the floating window type; for
			 * 		example, "shortcut", which indicates that the floating window contains the keyboard
			 * 		shortcuts legend.
			 * 		<p>**Note:** Use this parameter to manage floating windows in a multi-chart
			 * 		document. Only one instance of a floating window is created for a given tag
			 * 		regardless of how many "floatingWindow" events occur having that tag, in which
			 * 		case a floating window can be shared by multiple charts. If floating windows do
			 * 		not have tags, new floating windows are created for new "floatingWindow" events
			 * 		even though the events may have the same `type` (see above).
			 * @param {function} [data.onClose] A callback to execute when the floating window is
			 * 		closed.
			 *
			 * @callback CIQ.ChartEngine~floatingWindowEventListener
			 * @since 8.2.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			floatingWindow: [],
			/**
			 * Called when a change occurs in the chart layout.
			 *
			 * Layout changes are caused by:
			 * - Calling {@link CIQ.ChartEngine#setChartType},
			 *   {@link CIQ.ChartEngine#setAggregationType}, {@link CIQ.ChartEngine#setChartScale}, or
			 *   {@link CIQ.ChartEngine#setAdjusted}
			 * - Using the {@link WebComponents.cq-toolbar} to disable the current active drawing tool
			 *   or toggling the crosshair
			 * - Using the {@link WebComponents.cq-views} to activate a serialized layout
			 * - Modifying a series ({@link CIQ.ChartEngine#modifySeries})
			 * - Setting a new periodicity ({@link CIQ.ChartEngine#setPeriodicity})
			 * - Adding or removing a study overlay
			 *   ({@link CIQ.ChartEngine.AdvancedInjectable#removeOverlay})
			 * - Adding or removing any new panels (and their corresponding studies)
			 * - Zooming in ({@link CIQ.ChartEngine#zoomIn}) or
			 *   zooming out ({@link CIQ.ChartEngine#zoomOut})
			 * - Setting ranges with {@link CIQ.ChartEngine#setSpan} or
			 *   {@link CIQ.ChartEngine#setRange}
			 * - Nullifying a programmatically set span or range by user panning
			 * - Enabling or disabling [extended hours]{@link CIQ.ExtendedHours}
			 * - Toggling the [range slider]{@link CIQ.RangeSlider}
			 *
			 * **Note** Scrolling and panning changes are not considered a layout change but rather a
			 * shift of the view window in the same layout. To detect those, register to listen for
			 * ["scroll" events]{@link CIQ.ChartEngine~scrollEventListener}.
			 *
			 * @param {object} data Data relevant to the "layout" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The current chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {object} data.layout The chart's layout object ({@link CIQ.ChartEngine#layout}).
			 * @param {Array} data.drawings The chart's current drawings ({@link CIQ.Drawing}).
			 *
			 * @callback CIQ.ChartEngine~layoutEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			layout: [],
			/**
			 * Called when the mouse is clicked on the chart and held down.
			 *
			 * @param {object} data Data relevant to the "longhold" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.panel The panel being clicked.
			 * @param {number} data.x The crosshair x-coordinate.
			 * @param {number} data.y The crosshair y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~longholdEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			longhold: [],
			/**
			 * Called when the pointer is moved inside the chart, even on panning or horizontal
			 * swiping.
			 *
			 * @param {object} data Data relevant to the "move" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.panel The panel where the mouse is active.
			 * @param {number} data.x The pointer x-coordinate.
			 * @param {number} data.y The pointer y-coordinate.
			 * @param {boolean} data.grab True if the chart is being dragged.
			 *
			 * @callback CIQ.ChartEngine~moveEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			move: [],
			/**
			 * Called when the [quotefeed interface](quotefeed.html) loads a complete data set as
			 * a result of:
			 * - [symbol changes]{@link CIQ.ChartEngine#loadChart} or
			 * - [periodicity]{@link CIQ.ChartEngine#setPeriodicity},
			 * [range]{@link CIQ.ChartEngine#setRange}, or [span]{@link CIQ.ChartEngine#setSpan}
			 * changes requiring new data.
			 *
			 * @param {object} data Data relevant to the "newChart" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The current chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label,
			 * 		{@link CIQ.ChartEngine.Chart#symbolObject}.
			 * @param {boolean} data.moreAvailable True if {@link quotefeed~dataCallback} reports
			 * 		that more data is available.
			 * @param {boolean} data.upToDate True if {@link quotefeed~dataCallback} reports that
			 * 		no more future data is available.
			 * @param {object} data.quoteDriver The quote feed driver.
			 *
			 * @callback CIQ.ChartEngine~newChartEventListener
			 * @since 8.0.0 Added the `upToDate` parameter.
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			newChart: [],
			/**
			 * Called when a message toaster notification event (a toast) has occurred.
			 *
			 * @param {object} data Data relevant to the notification event.
			 * @param {string} data.message Text to display in the notification.
			 * @param {string} [data.position="top"] Alignment of the notification: "top" or "bottom".
			 * 		Overrides the `defaultPosition` attribute of the
			 * 		[`<cq-message-toaster>`]{@link WebComponents.cq-message-toaster} element.
			 * @param {string} [data.type="info"] Notification style: "info", "error", "warning", or
			 * 		"confirmation".
			 * @param {string} [data.transition] Type of animation used to display and dismiss (remove)
			 * 		the notification: "fade", "slide", "pop" or "drop". The default is no transition.
			 * 		Overrides the `defaultTransition` attribute of the
			 * 		[`<cq-message-toaster>`]{@link WebComponents.cq-message-toaster} element.
			 * @param {number} [data.displayTime=10] Number of seconds to display the notification
			 * 		before automatically dismissing it. A value of 0 causes the notification to remain
			 * 		on screen&nbsp;&mdash;&nbsp;preventing other notifications from
			 * 		displaying&nbsp;&mdash;&nbsp;until the notification is selected by the user and
			 * 		dismissed. Overrides the `defaultDisplayTime` attribute of the
			 * 		[`<cq-message-toaster>`]{@link WebComponents.cq-message-toaster} element.
			 * @param {number} [data.priority=0] Priority of the notification relative to others in
			 * 		the notification queue. Higher priority notifications are displayed before
			 * 		notifications with lower priority. For example, a notification with
			 * 		priority&nbsp;=&nbsp;4 is displayed before a notification with
			 * 		priority&nbsp;=&nbsp;1. Notifications with the same priority are displayed
			 * 		in the order they were created; that is, in the order they entered the
			 * 		notification queue.
			 * @param {function} [data.callback] Function to call when the notification is selected
			 * 		(dismissed) by the user. If the notification is dismissed automatically (see
			 * 		`displayTime`), this function is not called.
			 *
			 * @callback CIQ.ChartEngine~notificationEventListener
			 * @since 8.2.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			notification: [],
			/**
			 * Called when the periodicity is changed, for example, by
			 * {@link CIQ.ChartEngine#setPeriodicity}.
			 *
			 * This event listener can be used instead of
			 * [layoutEventListener]{@link CIQ.ChartEngine~layoutEventListener} for events that only
			 * need to be triggered when the periodicity changes.
			 *
			 * @param {object} data Data relevant to the "periodicity" event.
			 * @param {CIQ.ChartEngine} data.stx Reference to the chart engine.
			 * @param {boolean} data.differentData Indicates whether the chart needs new data to
			 * 		conform with the new periodicity. Typically, the value for this parameter is
			 * 		obtained from a call to {@link CIQ.ChartEngine#needDifferentData}.
			 * @param {CIQ.ChartEngine~PeriodicityParameters} data.prevPeriodicity The periodicity
			 * 		before the periodicity change event.
			 *
			 * @callback CIQ.ChartEngine~periodicityEventListener
			 * @since 8.1.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			periodicity: [],
			/**
			 * Called when preferences are changed.
			 *
			 * Such as when calling {@link CIQ.ChartEngine#setTimeZone},
			 * {@link CIQ.ChartEngine#importPreferences}, {@link CIQ.Drawing.saveConfig}, or
			 * {@link CIQ.Drawing.restoreDefaultConfig} or when making language changes using the
			 * {@link WebComponents.cq-language-dialog}.
			 *
			 * @param {object} data Data relevant to the "preferences" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The current chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {object} data.layout The chart's layout object ({@link CIQ.ChartEngine#layout}).
			 * @param {Array} data.drawingObjects The chart's current drawings
			 * 		({@link CIQ.ChartEngine#drawingObjects}).
			 *
			 * @callback CIQ.ChartEngine~preferencesEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			preferences: [],
			/**
			 * Called on "mouseup" after the chart is right-clicked.
			 *
			 * **Note:** By default, right-clicks are only captured when mousing over chart objects
			 * such as series and drawings. To enable right-click anywhere on the chart, the
			 * "contextmenu" event listener must be modified as follows:
			 * ```
			 * document.removeEventListener("contextmenu", CIQ.ChartEngine.handleContextMenu);
			 * document.addEventListener(
			 *     "contextmenu",
			 *     function(e) {
			 *         if (!e) e = event;
			 *         if (e.preventDefault) e.preventDefault();
			 *         return false;
			 *     }
			 * );
			 * ```
			 *
			 * @param {object} data Data relevant to the "rightClick" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} panel The panel that was clicked.
			 * @param {number} data.x The click x-coordinate.
			 * @param {number} data.y The click y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~rightClickEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 * @see {@link CIQ.ChartEngine.handleContextMenu}
			 *
			 * @example <caption>Trigger and provide location and details when clicking a series:</caption>
			 * stxx.addEventListener("tap", function(tapObject) {
			 *     if (this.anyHighlighted) {
			 *         for (let n in this.chart.seriesRenderers) {
			 *             const r = this.chart.seriesRenderers[n];
			 *             for(let j = 0; j < r.seriesParams.length; j++) {
			 *                 series = r.seriesParams[j];
			 *                 if (series.highlight) {
			 *                     const bar = this.barFromPixel(tapObject.x);
			 *                     if (this.chart.dataSegment[bar]) {
			 *                         // Replace console.log with your required logic.
			 *                         console.log('Tap event at pixel x: ' + tapObject.x + ' y: '+ tapObject.y);
			 *                         console.log('Price:', this.priceFromPixel(tapObject.y), ' Date: ', this.chart.dataSegment[bar].DT);
			 *                         console.log('Series Details: ',JSON.stringify(series));
			 *                     }
			 *                 }
			 *             }
			 *         }
			 *     }
			 * });
			 */
			rightClick: [],
			/**
			 * Called when the chart is panned and scrolled in any direction or is horizontally swiped.
			 *
			 * @param {object} data Data relevant to the "scroll" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.panel The panel where the mouse is active.
			 * @param {number} data.x The mouse x-coordinate.
			 * @param {number} data.y The mouse y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~scrollEventListener
			 * @since 6.3.0
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			scroll: [],
			/**
			 * Called when an overlay-type study is right-clicked.
			 *
			 * @param {object} data Data relevant to the "studyOverlayEdit" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {object} data.sd The study object study descriptor.
			 * @param {object} data.inputs The inputs from the study descriptor.
			 * @param {object} data.outputs The outputs from the study descriptor.
			 * @param {object} data.parameters The parameters from the study descriptor.
			 *
			 * @callback CIQ.ChartEngine~studyOverlayEditEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 *
			 * @example
			 * stxx.addEventListener("studyOverlayEdit", function(studyData) {
			 *     CIQ.alert(studyData.sd.name);
			 *     const helper = new CIQ.Studies.DialogHelper({ name: studyData.sd.type, stx: studyData.stx });
			 *     console.log('Inputs:',JSON.stringify(helper.inputs));
			 *     console.log('Outputs:',JSON.stringify(helper.outputs));
			 *     console.log('Parameters:',JSON.stringify(helper.parameters));
			 *     // Call your menu here with the data returned in helper.
			 *     // Modify parameters as needed and call addStudy or replaceStudy.
			 * });
			 */
			studyOverlayEdit: [],
			/**
			 * Called when a panel-type study is edited.
			 *
			 * @param {object} data Data relevant to the "studyPanelEdit" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {object} data.sd The study object study descriptor.
			 * @param {object} data.inputs The inputs from the study descriptor.
			 * @param {object} data.outputs The outputs from the study descriptor.
			 * @param {object} data.parameters The parameters from the study descriptor.
			 *
			 * @callback CIQ.ChartEngine~studyPanelEditEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			studyPanelEdit: [],
			/**
			 * Called when the chart's symbols change. Including secondary series and underlying
			 * symbols for studies (e.g., price relative study).
			 *
			 * @param {object} data Data relevant to the "symbolChange" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The new chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {string} data.action An action type being performed on the symbol. Possible
			 * 		options:
			 * - `add-series` &mdash; A series was added
			 * - `master` &mdash; The master symbol was changed
			 * - `remove-series` &mdash; A series was removed
	
			 * @callback CIQ.ChartEngine~symbolChangeEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			symbolChange: [],
			/**
			 * Called when a symbol is imported into the layout, including secondary series and
			 * underlying symbols for studies (e.g., price relative study).
			 *
			 * This listener is not called by other types of symbol changes.
			 *
			 * @param {object} data Data relevant to the "symbolImport" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The new chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {string} data.action An action type being performed on the symbol. Possible
			 * 		options:
			 * - `add-series` &mdash; A series was added
			 * - `master` &mdash; The master symbol was changed
			 * - `remove-series` &mdash; A series was removed
			 *
			 * @callback CIQ.ChartEngine~symbolImportEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 * @see {@link CIQ.ChartEngine#importLayout}
			 */
			symbolImport: [],
			/**
			 * Called on ["mouseup"]{@link CIQ.ChartEngine.AdvancedInjectable#touchSingleClick} when
			 * the chart is tapped.
			 *
			 * @param {object} data Data relevant to the "tap" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.panel The panel being tapped.
			 * @param {number} data.x The tap x-coordinate.
			 * @param {number} data.y The tap y-coordinate.
			 *
			 * @callback CIQ.ChartEngine~tapEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			tap: [],
			/**
			 * Called when a new theme is activated on the chart, such as by
			 * {@link WebComponents.cq-themes} initialization or using the
			 * {@link WebComponents.cq-theme-dialog}.
			 *
			 * @param {object} data Data relevant to the "theme" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {string} data.symbol The current chart symbol.
			 * @param {object} data.symbolObject The symbol's value and display label
			 * 		({@link CIQ.ChartEngine.Chart#symbolObject}).
			 * @param {object} data.layout The chart's layout object ({@link CIQ.ChartEngine#layout}).
			 * @param {Array} data.drawingObjects The chart's current drawings
			 * 		({@link CIQ.ChartEngine#drawingObjects}).
			 *
			 * @callback CIQ.ChartEngine~themeEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			theme: [],
			/**
			 * Called when an undo stamp is created for drawing events.
			 *
			 * See {@link CIQ.ChartEngine#undoStamp}
			 *
			 * @param {object} data Data relevant to the "undoStamp" event.
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
			 * @param {Array} data.before The chart drawing objects before the change.
			 * @param {Array} data.after The chart drawings objects after the change.
			 *
			 * @callback CIQ.ChartEngine~undoStampEventListener
			 *
			 * @see {@link CIQ.ChartEngine#addEventListener}
			 */
			undoStamp: []
		};
		CIQ.ChartEngine.registerHelpers(this);
	};
	
	var prototypeSwitches = {
		/**
		 * Time in MS to trigger a long hold on the chart.
		 * @type number
		 * @default
		 * @memberof CIQ.ChartEngine.prototype
		 */
		longHoldTime: 700,
		/**
		 * Number of pixels the mouse needs to move in vertical direction to "unlock" vertical panning/scrolling.
		 * Setting to a number larger than the pixels on the canvas will also disable vertical scrolling
		 * @type number
		 * @default
		 * @alias yTolerance
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * //This will disable the tolerance, so panning will immediately follow the user actions without maintaining a locked vertical location when panning left or right.
		 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.yTolerance=0;
		 */
		yTolerance: 100,
	
		/**
		 * Number of bars to always keep in view when the user pans forwards or backwards.
		 * If this is set to less than 1, it will be possible to have a blank chart.
		 *
		 * See {@link CIQ.ChartEngine.Chart#allowScrollPast} and {@link CIQ.ChartEngine.Chart#allowScrollFuture} for instructions on how to prevent users from scrolling past the last bar on the chart in either direction; which may supersede this setting.
		 * @type number
		 * @default
		 * @alias minimumLeftBars
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 05-2016-10
		 */
		minimumLeftBars: 1,
		/**
		 * Set to true to reverse direction of mousewheel for zooming
		 * @type boolean
		 * @default
		 * @alias reverseMouseWheel
		 * @memberof CIQ.ChartEngine.prototype
		 */
		reverseMouseWheel: false,
		/**
		 * Set to false to turn off mousewheel acceleration effect; which depending on initial gesture speed, slowly slows down zooming as you let go of the wheel/pad.
		 * @type boolean
		 * @default
		 * @alias mouseWheelAcceleration
		 * @since 2015-11-1
		 * @memberof CIQ.ChartEngine.prototype
		 */
		mouseWheelAcceleration: true,
		/**
		 * Minimum candleWidth (in pixels) allowed when zooming out. Determines the maximum number of ticks to display on the chart.
		 *
		 * Use {@link CIQ.ChartEngine#minimumZoomTicks} to set the minimum number of ticks that must remain on the chart during a zoom-in operation.
		 *
		 * When candleWidth<1 and {@link CIQ.ChartEngine.Chart#lineApproximation} true,
		 * will create approximation of a line chart to improve rendering performance.
		 * Regardless, anything smaller than **0.3 pixels** may cause performance issues when zooming out.
		 * @type number
		 * @default
		 * @alias minimumCandleWidth
		 * @memberof CIQ.ChartEngine.prototype
		 */
		minimumCandleWidth: 1,
		/**
		 * Maximum candleWidth (in pixels) allowed when zooming in. Determines the minimum number of ticks to display on the chart.
		 *
		 * Also see {@link CIQ.ChartEngine#minimumZoomTicks} to set the minimum number of ticks that must remain on the chart during a zoom-in operation.
		 *
		 * @type number
		 * @default
		 * @alias maximumCandleWidth
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 7.4.0
		 */
		maximumCandleWidth: 200,
		/**
		 * Set to the number of ticks that **must** remain on the chart when zooming in.
		 *
		 * Use {@link CIQ.ChartEngine#minimumCandleWidth} to set the minimum number of ticks that must remain on the chart during a zoom-out operation.
		 * @type number
		 * @default
		 * @alias minimumZoomTicks
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 07-2016-16.6
		 */
		minimumZoomTicks: 9,
		/**
		 * Set to false to disable any user zooming on the chart
		 * @type boolean
		 * @default
		 * @alias allowZoom
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 04-2015
		 * @example
		 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), allowZoom:false, layout:{"candleWidth": 16, "crosshair":true}});
		 */
		allowZoom: true,
		/**
		 * Set to false to disable any user scrolling of the chart
		 * @type boolean
		 * @default
		 * @alias allowScroll
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 04-2015
		 * @example
		 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), allowScroll:false, layout:{"candleWidth": 16, "crosshair":true}});
		 */
		allowScroll: true,
		/**
		 * Set to false to disable 2 finger side swipe motion for scrolling
		 * @type boolean
		 * @default
		 * @alias allowSideswipe
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 2015-12-08
		 */
		allowSideswipe: true,
		/**
		 * If set to true then a three finger movement will increment periodicity.
		 * @type boolean
		 * @default
		 * @alias allowThreeFingerTouch
		 * @memberof CIQ.ChartEngine.prototype
		 */
		allowThreeFingerTouch: false,
		/**
		 * Set to `true` to bypass right clicks on **all** overlay types and their hovering pop-ups.
		 * Or define independent settings for series, studies, and drawings by using an object instead.
		 *
		 * On touch devices, it will bypass {@link CIQ.ChartEngine.AdvancedInjectable#touchDoubleClick}
		 *
		 * Also see:
		 * - [rightClickEventListener]{@link CIQ.ChartEngine~rightClickEventListener}
		 * - {@link CIQ.ChartEngine.AdvancedInjectable#rightClickHighlighted}
		 *
		 * @type object
		 * @default
		 * @alias bypassRightClick
		 * @memberof CIQ.ChartEngine.prototype
		 * @since
		 * - 2016-07-16
		 * - 5.1.0 An object containing booleans to separate series, studies, and drawings.
		 * @example
		 * this.bypassRightClick={
		 *	series: false,
		 *	study: false,
		 *	drawing: false
		 * };
		 */
		bypassRightClick: {
			series: false,
			study: false,
			drawing: false
		},
		/**
		 * Function which can be used to modify the highlighted field to be used for an averaging-type drawing.
		 * Can be customized (overridden) to adjust certain fields, while passing through others.
		 * Note: if the field to be returned is a member of an object (e.g., AAPL.Close), the proper format
		 * for returning this would be "AAPL-->Close".
		 * @param {string} field dataSet field
		 * @return {string} adjusted field
		 * @type function
		 * @default
		 * @alias adjustHighlightedDataSetField
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.adjustHighlightedDataSetField=function(field){
		 * 	if(!field) return null;
		 * 	for(var st in this.layout.studies){
		 * 		var study=this.layout.studies[st];
		 * 		if(study.outputMap.hasOwnProperty(field)) {
		 * 			// adjust the field based on the study in which it belongs
		 * 			if(study.type=="Pivot Points") return null;
		 * 			...
		 * 			break;
		 * 		}
		 * 	}
		 * 	for(var sr in this.chart.series){
		 * 		var series=this.chart.series[sr];
		 * 		if(series.id==field.split("-->")[0]) {
		 * 			// adjust the field based on the series in which it belongs
		 * 			if(series.id=="AAPL") return series.id+"-->High";
		 * 			...
		 * 			break;
		 * 		}
		 * 	}
		 * 	return field;
		 * };
		 * @since 7.0.0
		 */
		adjustHighlightedDataSetField: function (field) {
			return field;
		},
	
		/**
		 * Set these to false to not display the up and down arrows in the panel management component. See {@link CIQ.ChartEngine#controls} for alternate methods and more details.
		 * @type boolean
		 * @default
		 * @alias displayIconsUpDown
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.displayIconsUpDown=false;
		 */
		displayIconsUpDown: true,
		/**
		 * Set these to false to not display this panel management component. See {@link CIQ.ChartEngine#controls} for alternate methods and more details.
		 * @type boolean
		 * @default
		 * @alias displayIconsSolo
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.displayIconsSolo=false;
		 */
		displayIconsSolo: true,
		/**
		 * Set these to false to not display this panel management component. See {@link CIQ.ChartEngine#controls} for alternate methods and more details.
		 * @type boolean
		 * @default
		 * @alias displayIconsClose
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 3.0.7
		 * @example
		 * stxx.displayIconsClose=false;
		 */
		displayIconsClose: true,
		/**
		 * Set these to false to not display this panel management component. See {@link CIQ.ChartEngine#controls} for alternate methods and more details.
		 * @type boolean
		 * @default
		 * @alias displayPanelResize
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.displayPanelResize=false;
		 */
		displayPanelResize: true,
		/**
		 * Set this to true to hide even the chart panel when soloing a non-chart panel.  Normally chart panels are not hidden when soloing.
		 * @type boolean
		 * @default
		 * @alias soloPanelToFullScreen
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 3.0.7
		 * @example
		 * stxx.soloPanelToFullScreen=true;
		 */
		soloPanelToFullScreen: false,
		/**
		 * Only reposition markers this many milliseconds. Set to null for no visible delay. Set to 0 for a Zero Delay timeout. (lower numbers are more CPU intensive).
		 * See {@tutorial Markers} for more details on adding markers to your charts
		 * @type number
		 * @default
		 * @alias markerDelay
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.markerDelay=25;
		 */
		markerDelay: null,
		/**
		 * When set to true, the backing store for the canvas is used.
		 * This results in crisper display but with a noticeable performance penalty in some browsers.
		 * The default is true.
		 * If improved performance is necessary, set the variable as shown in the example.
		 * The example allows mobile devices (android/ipad/iphone) to continue using the backing store while being bypassed in others (desktop browsers).
		 *
		 * @type boolean
		 * @default
		 * @alias useBackingStore
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 3.0.0
		 * @example
		 * stxx.useBackingStore=CIQ.isMobile;
		 */
		useBackingStore: true,
	
		/**
		 * On touch devices, when set to true, the backing store will be turned off while a user is panning or zooming the chart. This increases performance during the operation by reducing
		 * resolution. Resolution is restored once the user lifts their finger. Generally, you'll want to enable this dynamically when you know that a particular device has poor canvas performance.
		 * This defaults to true but can be disabled by setting to false.
		 * @type boolean
		 * @default
		 * @alias disableBackingStoreDuringTouch
		 * @memberOf  CIQ.ChartEngine.prototype
		 * @since 4.0.0
		 */
		disableBackingStoreDuringTouch: CIQ.isMobile || (CIQ.isSurface && CIQ.isFF),
		/**
		 * Primarily intended for mobile devices, if set to `false` it will allow up/down swiping to pass through the chart container so the main page can manage it.
		 * This allows a user swiping up and down to swipe through the chart instead of having the chart capture the event and prevent the page from continue moving.
		 * It therefore produces a more natural up/down swiping motion throughout the page.
		 * @type boolean
		 * @default
		 * @alias captureTouchEvents
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 12-2015-08
		 */
		captureTouchEvents: true,
		/**
		 * If set to `false` it will allow up/down [mouseWheel / touchPad swiping]{@link CIQ.ChartEngine.AdvancedInjectable#mouseWheel} to pass through the chart container so the main page can manage it.
		 * This allows a user swiping up and down to swipe through the chart instead of having the chart capture the event and prevent the page from continue moving.
		 * It therefore produces a more natural up/down sliding of the page.
		 * @type boolean
		 * @default
		 * @alias captureMouseWheelEvents
		 * @memberof CIQ.ChartEngine.prototype
		 * @since m-2016-12-01.4
		 */
		captureMouseWheelEvents: true,
		/**
		 * If true (the default), requires a tap on a drawing, plot, y-axis, or other object before
		 * the object is highlighted. If false, allows highlighting of objects when the mouse cursor
		 * moves over the objects.
		 *
		 * @type boolean
		 * @default
		 * @alias tapForHighlighting
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 8.2.0
		 */
		tapForHighlighting: true,
		/**
		 * The maximum number of milliseconds between clicks that trigger a double-click.
		 *
		 * @alias doubleClickTime
		 * @memberof CIQ.ChartEngine.prototype
		 * @type {number}
		 * @default
		 * @since 8.0.0
		 */
		doubleClickTime: 250,
		/**
		 * Shape of the floating y axis label.
		 *
		 * Available options:
		 *  - ["roundRectArrow"]{@link CIQ.roundRectArrow}
		 *  - ["semiRoundRect"]{@link CIQ.semiRoundRect}
		 *  - ["roundRect"]{@link CIQ.roundRect}
		 *  - ["tickedRect"]{@link CIQ.tickedRect}
		 *  - ["rect"]{@link CIQ.rect}
		 *  - ["noop"]{@link CIQ.noop}
		 * @type string
		 * @default
		 * @alias yaxisLabelStyle
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * var stxx=new CIQ.ChartEngine({container: document.querySelector(".chartContainer")});
		 * stxx.yaxisLabelStyle="roundRectArrow";
		 */
		yaxisLabelStyle: "roundRectArrow",
		/**
		 * Set to false if you don't want the axis borders drawn. This will override individual settings on yaxis and xaxis.
		 * @type boolean
		 * @default
		 * @alias axisBorders
		 * @memberof CIQ.ChartEngine.prototype
		 */
		axisBorders: null,
		/**
		 * Set to true to have drawings highlight only the last applied drawing if more than one is intersected at a time.
		 * @type boolean
		 * @default
		 * @since 5.0.0
		 * @alias singleDrawingHighlight
		 * @memberof CIQ.ChartEngine.prototype
		 */
		singleDrawingHighlight: true,
		/**
		 * X axis offset for touch devices so that finger isn't blocking crosshair
		 * @type number
		 * @default
		 * @alias crosshairXOffset
		 * @memberof CIQ.ChartEngine.prototype
		 */
		crosshairXOffset: -40,
		/**
		 * Y axis Offset for touch devices so that finger isn't blocking crosshair
		 * @type number
		 * @default
		 * @alias crosshairYOffset
		 * @memberof CIQ.ChartEngine.prototype
		 */
		crosshairYOffset: -40,
		/**
		 * When set to true, line and mountain charts are extended slightly in order to reduce whitespace at the right edge of the chart
		 * @type boolean
		 * @default
		 * @alias extendLastTick
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 05-2016-10 The line will be extended to the end of the chart (full candle width) instead of the candle border, even when using `yaxisLabelStyle` "roundRectArrow".
		 */
		extendLastTick: false,
		/**
		 * This is the callback function used to translate languages.
		 * Should return a translated phrase given the English phrase. See separate translation file for list of phrases.
		 *
		 * Expected format :
		 *
		 * 		var translatedWord = fc(english);
		 *
		 * Defaults to {@link CIQ.I18N.translate}
		 * @type {function}
		 * @alias translationCallback
		 * @memberof CIQ.ChartEngine.prototype
		 */
		translationCallback: null,
		/**
		 * Set this to `true` if your server returns data in week or monthly ticks, and doesn't require rolling computation from daily.
		 *
		 * If set to `false`:
		 * - 'weekly' bars will be aligned to the first open market day of the week according to the active [market definitions]{@link CIQ.Market} (Weeks start Sunday).
		 * - 'monthly' bar will be aligned to the first market day of the month according to the active [market definitions]{@link CIQ.Market}.
		 *
		 * @type boolean
		 * @default
		 * @alias dontRoll
		 * @memberof CIQ.ChartEngine.prototype
		 */
		dontRoll: false,
		/**
		 * Set to true to allow an equation to be entered into the symbol input.  For example, =2*IBM-GM
		 * NOTE: the equation needs to be preceded by an equals sign (=) in order for it to be parsed as an equation.
		 * See {@link CIQ.formatEquation} and {@link CIQ.computeEquationChart} for more details on allowed syntax.
		 * @type boolean
		 * @default
		 * @alias allowEquations
		 * @memberof CIQ.ChartEngine.prototype
		 */
		allowEquations: true,
		/**
		 * If set, {@link CIQ.ChartEngine#doCleanupGaps} will be automatically called
		 * on intra-day or daily interval charts to create missing data points during market hours/days for stocks that may have missing bars.
		 *
		 * `carry` will cause the closing price to be carried forward, resulting in dashes on a candle/bar chart or continuous line on a line or mountain chart.
		 * <br>`gap` will cause physical breaks to occur on the chart in the gapped position.
		 *
		 * **Note:** the clean up process uses the active periodicity and the active market definition, if any.
		 * So you must first set those to ensure proper clean up.
		 * If no market definition is enabled, the clean up will assume gaps need to be added during the entire 24 hours period, every day.
		 * <br>See "{@link CIQ.Market}" for details on how to properly configure the library to your market hours requirements.
		 * <br>No gaps will be cleaned for `tick` since by nature it is no a predictable interval.
		 *
		 * **Important information to prevent inaccurate 'gapping'**<br>
		 * - This parameter must be set **before** any data is loaded into the chart.
		 * - The cleanup process leverages the current market iterator which traverses along the timeline on the exact minute/second/millisecond mark for intraday data.
		 * As such, you must ensure your time stamps match this requirement.
		 * If your data does not comply, you must round your timestamps before sending the data into the chart.
		 * <br>For example, if in minute periodicity, seconds and milliseconds should not be present or be set to zero.
		 *
		 * @type string
		 * @default
		 * @alias cleanupGaps
		 * @memberof CIQ.ChartEngine.prototype
		 *
		 * @example  <caption>If using a quoteFeed, just set the parameter will automatically call {@link CIQ.ChartEngine#doCleanupGaps} </caption>
		 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer")});
		 * stxx.attachQuoteFeed(yourFeed,{refreshInterval:1});
		 * stxx.setMarketFactory(CIQ.Market.Symbology.factory);
		 * stxx.cleanupGaps='carry';
		 * stxx.setPeriodicity({period:1, interval:5, timeUnit:"minute"});
		 * stxx.loadChart("SPY");
		 *
		 * @since
		 * - 15-07-01 Gaps are automatically cleaned up unless this flag is set to false.
		 * - 2015-11-1 Gaps are not automatically cleaned unless this flag is set to true.
		 * - m-2016-12-01.4 Now supports "carry" and "gap" values. Setting to non-false will default to "carry" for backward compatibility with prior versions.
		 */
		cleanupGaps: false,
		/**
		 * When set to `true`, the requested range will be visually preserved between [symbol changes]{@link CIQ.ChartEngine#loadChart} or when a [layout is imported]{@link CIQ.ChartEngine#importLayout},
		 * even if the data required to fill the left and/or right side of the x axis is not present.
		 *
		 * This behavior is similar to setting `goIntoPast` and `goIntoFuture` when calling [setRange]{@link CIQ.ChartEngine#setRange}/[setSpan]{@link CIQ.ChartEngine#setSpan} explicitly.
		 *
		 * Please note that at the moment, a range will not be preserved when using [addSeries]{@link CIQ.ChartEngine#addSeries}, if the new data extends further than the currently loaded data for the primary instrument.
		 * For this, you will need to manually call  [setRange]{@link CIQ.ChartEngine#setRange}/[setSpan]{@link CIQ.ChartEngine#setSpan} in the [addSeries]{@link CIQ.ChartEngine#addSeries} callback.
		 * @type boolean
		 * @default
		 * @alias staticRange
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 5.1.2
		 */
		staticRange: false,
		/**
		 * Set a maximum size for the dataSet to prevent it from growing excessively large.
		 *
		 * Once the max number of records have been loaded, pagination requests will be ignored
		 * and older data will be dropped from the end (historical) side of the dataSet array as new bars arrive, until that number is increased.
		 *
		 * Set to 0 to let it grow forever.
		 * @type number
		 * @default
		 * @alias maxDataSetSize
		 * @memberof CIQ.ChartEngine.prototype
		 */
		maxDataSetSize: 20000,
		/**
		 * Set a maximum size for masterData to prevent it from growing excessively large.
		 *
		 * Once the max number of records have been loaded, pagination requests will be ignored
		 * and older data will be dropped from the end (historical) side of the masterData array as new bars arrive, until that number is increased.
		 *
		 * By default (set to 0) masterData is unlimited and will grow forever.
		 *
		 * Note: when rolling up data due to periodicity, you should anticipate large enough masterData to accomodate the desired chart length.
		 *
		 * @type {number}
		 * @default
		 * @alias maxMasterDataSize
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 3.0.0
		 */
		maxMasterDataSize: 0,
		/**
		 * Set to zero to avoid resize checking loop. See {@link CIQ.ChartEngine#setResizeTimer} for more details
		 * @type number
		 * @default
		 * @alias resizeDetectMS
		 * @memberof CIQ.ChartEngine.prototype
		 */
		resizeDetectMS: 1000,
		/**
		 * Set to true to display the xAxis below all panels.
		 * By default, the x axis will be rendered right under the main chart panel.
		 * @type boolean
		 * @default
		 * @alias xAxisAsFooter
		 * @memberof CIQ.ChartEngine.prototype
		 * @since
		 * - 05-2016-10
		 * - 4.1.0 Now defaults to true.
		 * - 5.2.0 Vertical grid lines in study panels no longer dependent on this property and will be always displayed.
		 */
		xAxisAsFooter: true,
		/**
		 * Sets the x axis height in pixels.
		 *
		 * - Set to null to automatically adjust to the size of the axis font.
		 * - Set to 0 completely remove the x axis.
		 * - Use {@link CIQ.ChartEngine.XAxis#noDraw} to temporarily hide the axis, but maintain its spacing.
		 * @type boolean
		 * @default
		 * @alias xaxisHeight
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 4.1.0 Now defaults to 30px.
		 */
		xaxisHeight: 30,
		/**
		 * Set to true to display horizontal grid lines on studies.
		 * This parameter is only used when a custom y axis is **not** defined for the study.
		 *
		 * To also disable zones and center lines on studies add:
		 * ```CIQ.Studies.drawHorizontal=function(){};```
		 * For more details see {@link CIQ.Studies.doPostDrawYAxis}
		 * @type boolean
		 * @default
		 * @alias displayGridLinesInStudies
		 * @memberof 	CIQ.ChartEngine.prototype
		 * @since 3.0.0
		 */
		displayGridLinesInStudies: false,
		/**
		 * When true serialize methods may escape their values with encodeURIComponent.
		 * @type boolean
		 * @default
		 * @alias escapeOnSerialize
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 4.1.0
		 */
		escapeOnSerialize: true,
		/**
		 * Adjust to increase or decrease the default width of candles (see {@tutorial Understanding Chart Range}).
		 * @type number
		 * @default
		 * @alias candleWidthPercent
		 * @memberof CIQ.ChartEngine.prototype
		 */
		candleWidthPercent: 0.65,
		/**
		 * Set to `true` to color any OHLC type rendering (bar, candles) as well as the volume study,
		 * based on difference between open and close, rather than difference between previous close and current close.
		 *
		 * Used in {@link CIQ.Renderer.OHLC} and {@link CIQ.Studies.createVolumeChart}
		 * @type boolean
		 * @default
		 * @alias colorByCandleDirection
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 4.0.0
		 */
		colorByCandleDirection: false,
		/**
		 * chart types which do not draw wicks on candles
		 * @type object
		 * @default
		 * @alias noWicksOnCandles
		 * @memberof CIQ.ChartEngine.prototype
		 */
		noWicksOnCandles: { renko: true, linebreak: true },
		/**
		 * chart types which require fetching as many bars as possible (since they aggregate data)
		 * @type object
		 * @default
		 * @alias fetchMaximumBars
		 * @memberof CIQ.ChartEngine.prototype
		 */
		fetchMaximumBars: {
			rangebars: true,
			kagi: true,
			renko: true,
			linebreak: true,
			pandf: true
		},
		/**
		 * Comparisons by default start at the close value of the previous bar.
		 * Set this to true to start at the current bar instead.
		 * @type boolean
		 * @default
		 * @alias startComparisonsAtFirstVisibleBar
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 7.3.0
		 */
		startComparisonsAtFirstVisibleBar: false,
	
		/**
		 * Animations. These can be overridden with customized EaseMachines
		 * To disable an animation replace with an EaseMchine with one ms as the second parameter.
		 * @type {object}
		 * @alias animations
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * stxx.animations.zoom=new CIQ.EaseMachine(Math["easeOutCubic"],1);
		 */
		animations: {
			zoom: {
				isStub: true,
				run: function (cb, _orig, _new) {
					cb(_new);
				},
				stop: function () {},
				reset: function () {},
				running: false,
				hasCompleted: true
			}
		},
	
		/**
		 * Map of default values to be used to statically set periodicity (candle width) upon range selection when using {@link CIQ.ChartEngine#setRange}
		 *
		 * **Default Value:**
		 * ```
		 * [
		 *     {
		 *         rangeInMS : CIQ.WEEK,	// Any range less than a week, load 5 minute bars
		 *         periodicity : 1,
		 *         interval : 5,
		 *         timeUnit : 'minute'
		 *     },
		 *     {
		 *         rangeInMS : CIQ.MONTH,	// Any range less than a month, load 30 minute bars
		 *         periodicity : 1,
		 *         interval : 30,
		 *         timeUnit : 'minute'
		 *     },
		 *     {
		 *         rangeInMS : CIQ.YEAR,	// Any range less than a year, load day bars
		 *         periodicity : 1,
		 *         interval : "day"
		 *     },
		 *     {
		 *         rangeInMS : CIQ.DECADE,	// Any range less than 10 years, load weekly bars
		 *         periodicity : 1,
		 *         interval : "week"
		 *     },
		 *     {
		 *         rangeInMS : CIQ.DECADE * 10,	// Any range less than a century, load monthly bars
		 *         periodicity : 1,
		 *         interval : "month"
		 *     },
		 *     {
		 *         rangeInMS : Number.MAX_VALUE,	// Anything greater than a century, load yearly bars
		 *         periodicity : 12,
		 *         interval : "month"
		 *     }
		 * ]
		 * ```
		 * @type array
		 * @alias staticRangePeriodicityMap
		 * @memberof CIQ.ChartEngine.prototype
		 * @since m-2016-12-01
		 */
		staticRangePeriodicityMap: [
			{
				rangeInMS: CIQ.WEEK, // Any range less than a week, load 5 minute bars
				periodicity: 1,
				interval: 5,
				timeUnit: "minute"
			},
			{
				rangeInMS: CIQ.MONTH, // Any range less than a month, load 30 minute bars
				periodicity: 1,
				interval: 30,
				timeUnit: "minute"
			},
			{
				rangeInMS: CIQ.YEAR, // Any range less than a year, load day bars
				periodicity: 1,
				interval: "day"
			},
			{
				rangeInMS: CIQ.DECADE, // Any range less than 10 years, load weekly bars
				periodicity: 1,
				interval: "week"
			},
			{
				rangeInMS: CIQ.DECADE * 10, // Any range less than a century, load monthly bars
				periodicity: 1,
				interval: "month"
			},
			{
				rangeInMS: Number.MAX_VALUE, // Anything greater than a century, load yearly bars
				periodicity: 12,
				interval: "month"
			}
		],
	
		/**
		 * Map of multiples to be used to dynamically determine periodicity (candle width) upon range selection when using {@link CIQ.ChartEngine#setRange}
		 * Used when {@link CIQ.ChartEngine#autoPickCandleWidth} is enabled
		 *
		 * **Default Value:**
		 * ```
		 * [
		 *     {
		 *         interval : 1,
		 *         rangeInMS : CIQ.MINUTE
		 *     },
		 *     {
		 *         interval : 5,
		 *         rangeInMS : CIQ.MINUTE * 5
		 *     },
		 *     {
		 *         interval : 30,
		 *         rangeInMS : CIQ.MINUTE * 30
		 *     },
		 *     {
		 *         interval : 60,
		 *         rangeInMS : CIQ.MINUTE * 60
		 *     },
		 *     {
		 *         interval : "day",
		 *         rangeInMS : CIQ.DAY
		 *     },
		 *     {
		 *         interval : "month",
		 *         rangeInMS : CIQ.MONTH
		 *     },
		 *     {
		 *         interval : "year",
		 *         rangeInMS : CIQ.YEAR
		 *     }
		 * ]
		 * ```
		 *
		 * @type array
		 * @alias dynamicRangePeriodicityMap
		 * @memberof CIQ.ChartEngine.prototype
		 * @since 11-2016-29
		 */
		dynamicRangePeriodicityMap: [
			{
				interval: 1,
				timeUnit: "minute",
				rangeInMS: CIQ.MINUTE
			},
			{
				interval: 5,
				timeUnit: "minute",
				rangeInMS: CIQ.MINUTE * 5
			},
			{
				interval: 30,
				timeUnit: "minute",
				rangeInMS: CIQ.MINUTE * 30
			},
			{
				interval: 60,
				timeUnit: "minute",
				rangeInMS: CIQ.MINUTE * 60
			},
			{
				interval: "day",
				rangeInMS: CIQ.DAY
			},
			{
				interval: "month",
				rangeInMS: CIQ.MONTH
			},
			{
				interval: "year",
				rangeInMS: CIQ.YEAR
			}
		],
		/**
		 * Contains the current chart layout.
		 *
		 * Layout parameters can be directly **pre-set** on a chart at the time the engine is instantiated, by providing an object exactly matching **the internal layout  format**.<br>
		 * The following is an example for setting some of the available layout parameters:
		 * ```
		 * var stxx=new CIQ.ChartEngine({
		 * 			container: document.querySelector(".chartContainer"),
		 * 			layout:{
		 * 				"crosshair":true,
		 * 				"interval":"day",
		 * 				"periodicity":1,
		 * 				"chartType": "candle",
		 * 				"candleWidth": 16
		 * 			}
		 * });
		 * ```
		 * These parameters will then be activated when [loadChart()]{@link CIQ.ChartEngine#loadChart} is called to render the chart.<br>
		 * Once a chart is rendered, most of these parameters become `READ ONLY`,and must be modified using their corresponding methods, as indicated in the documentation, to ensure chart integrity.
		 *
		 * **Important Note on internal periodicity format:**<BR>
		 *  Internal format of the layout object **does not match the parameters** used in ​{@link CIQ.ChartEngine#setPeriodicity} or {@link CIQ.ChartEngine#loadChart}.
		 *  <br>Use {@link CIQ.ChartEngine#getPeriodicity} to extract internal periodicity into the expected external format.
		 *
		 * See [importLayout]{@link CIQ.ChartEngine#importLayout} and [exportLayout]{@link CIQ.ChartEngine#exportLayout} for methods to serialize a layout and restore previously saved settings.
		 *
		 * @type object
		 * @alias layout
		 * @memberof CIQ.ChartEngine.prototype
		 */
		layout: {
			/**
			 * READ ONLY. Chart interval.
			 *
			 * Note that internal interval format will differ from API parameters used in {@link CIQ.ChartEngine#setPeriodicity} and {@link CIQ.ChartEngine#loadChart}.
			 *
			 * Available options are:
			 *  - [number] representing minutes
			 *  - "day"
			 *  - "week"
			 *  - "month"
			 *
			 * See the [Periodicity and Quote feed]{@tutorial Periodicity} tutorial.
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#layout[`interval`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			interval: "day",
			/**
			 * READ ONLY. Number of periods per interval/timeUnit
			 *
			 * See the [Periodicity and Quote feed]{@tutorial Periodicity} tutorial.
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#layout[`periodicity`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			periodicity: 1,
			/**
			 * READ ONLY. Time unit for the interval.
			 *
			 * Note that internal timeUnit format will differ from API parameters used in {@link CIQ.ChartEngine#setPeriodicity} and {@link CIQ.ChartEngine#loadChart}.
			 *
			 * See the [Periodicity and Quote feed]{@tutorial Periodicity} tutorial.
			 * Available options are:
			 *  - "millisecond"
			 *  - "second"
			 *  - "minute"
			 *  - null for "day", "week", "month" periodicity
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#layout[`timeUnit`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			timeUnit: null,
			/**
			 * READ ONLY. Candle Width In pixels ( see {@tutorial Understanding Chart Range} and {@link CIQ.ChartEngine#candleWidthPercent})
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#layout[`candleWidth`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			candleWidth: 8,
			/**
			 * READ ONLY. The primary y-axis and all linked drawings, series and studies will display inverted (flipped) from its previous state when 'true'.
			 *
			 * Use {@link CIQ.ChartEngine#flipChart} to set.
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#layout[`flipped`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			flipped: false,
			volumeUnderlay: false,
			/**
			 * Whether adjusted or nominal prices are being displayed.
			 * If true then the chart will look for "Adj_Close" in the masterData as an alternative to "Close".
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#layout[`adj`]
			 * @memberof CIQ.ChartEngine.layout#
			 * @instance
			 */
			adj: true,
			/**
			 * Set to `true` to enable crosshairs in the active layout.
			 *
			 * Also see {@link CIQ.ChartEngine.AdvancedInjectable#doDisplayCrosshairs} for more details on crosshairs behavior.
			 *
			 * @example
			 * // enable crosshair (usually called from a UI button/toggle)
			 * stx.layout.crosshair=true;
			 * // add this if you want the crosshair to display right away instead of when the user starts moving the mouse over the chart
			 * stx.doDisplayCrosshairs();
			 * // add this if you want to trigger a layout change event; maybe to save the layout.
			 * stx.dispatch("layout", {stx:stx, symbol: stx.chart.symbol, symbolObject:stx.chart.symbolObject, layout:stx.layout, drawings:stx.drawingObjects});
			 *
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#layout[`crosshair`]
			 * @memberof CIQ.ChartEngine.layout#
			 * @instance
			 */
			crosshair: false,
			/**
			 * READ ONLY. The primary chart type.
			 *
			 * Available options are:
			 *  - "none"
			 *  - "line"
			 *  - "step"
			 *  - "mountain"
			 *  - "baseline_delta"
			 *  - "candle"
			 *  - "bar"
			 *  - "hlc"
			 *  - "hlc_box" &mdash; Requires *js/extras/hlcbox.js*.
			 *  - "hlc_shaded_box" &mdash; Requires *js/extras/hlcbox.js*.
			 *  - "wave"
			 *  - "scatterplot"
			 *  - "histogram"
			 *  - "rangechannel"
			 *  - "marketdepth" &mdash; Requires the [Active Trader]{@link CIQ.MarketDepth} plug-in. See {@link CIQ.ChartEngine#updateCurrentMarketData} for data requirements.
			 *  - "termstructure" &mdash; Requires the [Term Structure]{@link CIQ.TermStructure} plug-in.
			 *
			 * Variations of these types are available by prepending terms to the options as follows:
			 *  - "step_" - add to mountain, marketdepth e.g. step_mountain, step_volume_marketdepth
			 *  - "vertex_" - add to line, step, mountain, baseline_delta
			 *  - "hollow_" - add to candle
			 *  - "volume_" - add to candle, marketdepth e.g. mountain_volume_marketdepth (Adding volume to marketdepth also creates a volume histogram in the same panel)
			 *  - "colored_" - add to line, mountain, step, bar, hlc
			 *  - "mountain_" - add to baseline_delta, marketdepth e.g. mountain_volume_marketdepth
			 *
			 * Other options are available provided a renderer is created with a `requestNew` function which will support the option, see {@link CIQ.Renderer.Lines#requestNew} and {@link CIQ.Renderer.OHLC#requestNew}
			 *
			 * Use {@link CIQ.ChartEngine#setChartType} to set this value.
			 *
			 * See {@tutorial Chart Styles and Types} for more details.
			 *
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#layout[`chartType`]
			 * @memberof CIQ.ChartEngine.layout#
			 * @since
			 * - 05-2016-10.1 Added "baseline_delta_mountain" and "colored_mountain".
			 * - 3.0.0 Added "histogram" and "step".
			 * - 3.0.7 Added "hlc".
			 * - 4.0.0 Added "colored_step" and "colored_hlc".
			 * - 5.1.0 More chart types available using combinations of terms.
			 * - 6.1.0 Added "marketdepth".
			 */
			chartType: "candle",
			/**
			 * READ ONLY. Flag for extended hours time-frames.
			 *
			 * The chart includes the 'extended' parameter in the `params` object sent into the `fetch()` call.
			 * Your quote feed must be able to provide extended hours data when requested (`extended:true`) for any extended hours functionality to work.
			 *
			 * See {@link CIQ.ExtendedHours} and {@link CIQ.Market} for more details on how extended hours are set and used.
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#layout[`extended`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			extended: false,
			/**
			 * READ ONLY. Tracks the extended market sessions to display on the chart.
			 *
			 * See {@link CIQ.ExtendedHours} and {@link CIQ.Market} for more details on how extended hours are set and used.
			 * @type object
			 * @default
			 * @alias CIQ.ChartEngine#layout[`marketSessions`]
			 * @memberof CIQ.ChartEngine.layout#
			 * @example
			 * marketSessions = {
			 *      "session1": true,
			 *      "session2": true,
			 *      "session3": false,
			 *      "pre": true,
			 *      "post": true
			 * }
			 * @since 06-2016-02
			 */
			marketSessions: {}, //use defaults
			/**
			 * READ ONLY. Active aggregation for the chart.
			 *
			 * Available options are:
			 *  - "rangebars"
			 *  - "ohlc"
			 *  - "kagi"
			 *  - "pandf"
			 *  - "heikinashi"
			 *  - "linebreak"
			 *  - "renko"
			 *
			 * Use {@link CIQ.ChartEngine#setAggregationType} to set this value.
			 *
			 * See {@tutorial Chart Styles and Types} for more details.
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#layout[`aggregationType`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			aggregationType: "ohlc",
			/**
			 * READ ONLY. Active scale for the chart.
			 *
			 * See {@link CIQ.ChartEngine#setChartScale}
			 *
			 * **Replaces CIQ.ChartEngine.layout.semiLog**
			 *
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#layout[`chartScale`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			chartScale: "linear",
			/**
			 * READ ONLY. List of [study descriptors]{@link CIQ.Studies.StudyDescriptor} for the active studies on the chart.
			 *
			 * **Please note:** To facilitate study name translations, study names use zero-width non-joiner (unprintable) characters to delimit the general study name from the specific study parameters.
			 * Example: "\u200c"+"Aroon"+"\u200c"+" (14)".
			 * At translation time, the library will split the text into pieces using the ZWNJ characters, parentheses and commas to just translate the required part of a study name.
			 * For more information on ZWNJ characters see: [Zero-width_non-joiner](https://en.wikipedia.org/wiki/Zero-width_non-joiner).
			 * Please be aware of these ZWNJ characters, which will now be present in all study names and corresponding panel names; including the `layout.studies` study keys.
			 * Affected fields in the study descriptors could be `id	`, `display`, `name` and `panel`.
			 * <br>To prevent issues, always use the names returned in the **study descriptor**. This will ensure compatibility between versions.
			 * >Example:
			 * ><br>Correct reference:
			 * ><br>	`stxx.layout.studies["\u200c"+"Aroon"+"\u200c"+" (14)"];`
			 * ><br>Incorrect reference:
			 * ><br>	`stxx.layout.studies["Aroon (14)"];`
			 *
			 * See {@link CIQ.Studies.addStudy} for more details
			 *
			 * @type object
			 * @default
			 * @alias CIQ.ChartEngine#layout[`studies`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			studies: {},
			/**
			 * READ ONLY. List of active chart panels. Usually correspond to a study or series.
			 *
			 * **Please note:** To facilitate study name translations, study names and their corresponding panels use zero-width non-joiner (unprintable) characters to delimit the general study name from the specific study parameters.
			 * Example: "\u200c"+"Aroon"+"\u200c"+" (14)".
			 * At translation time, the library will split the text into pieces using the ZWNJ characters, parentheses and commas to just translate the required part of a study name.
			 * For more information on ZWNJ characters see: [Zero-width_non-joiner](https://en.wikipedia.org/wiki/Zero-width_non-joiner).
			 * Please be aware of these ZWNJ characters, which will now be present in all study names and corresponding panel names; including the `layout.panels` study keys.
			 * <br>To prevent issues, always use the names returned in the **study descriptor**. This will ensure compatibility between versions.
			 * >Example:
			 * ><br>Correct reference:
			 * ><br>	`stxx.layout.panels["\u200c"+"Aroon"+"\u200c"+" (14)"];`
			 * ><br>Incorrect reference:
			 * ><br>	`stxx.layout.panels["Aroon(14)"];`
			 *
			 * See {@link CIQ.Studies.addStudy} for more details
			 *
			 * @type object
			 * @default
			 * @alias CIQ.ChartEngine#layout[`panels`]
			 * @memberof CIQ.ChartEngine.layout#
			 */
			panels: {},
			setSpan: {},
			/**
			 * READ ONLY. Specifies whether outlier detection is enabled. A value of true enables
			 * detection; false disables detection.
			 *
			 * See {@link CIQ.Outliers} for information on how outlier detection is used.
			 *
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#layout[`outliers`]
			 * @memberof CIQ.ChartEngine.layout#
			 * @since 7.5.0
			 */
			outliers: false
		},
		/**
		 * Contains the chart preferences.
		 *
		 * Preferences parameters, unless otherwise indicated, can be set at any time and only require a [draw()]{@link CIQ.ChartEngine#draw} call to activate.
		 *
		 * See [importPreferences]{@link CIQ.ChartEngine#importPreferences} and [exportPreferences]{@link CIQ.ChartEngine#exportPreferences} for methods to serialize and restore previously saved preferences.
		 *
		 * @type object
		 * @alias preferences
		 * @memberof CIQ.ChartEngine.prototype
		 */
		preferences: {
			/**
			 * Draw a horizontal line at the current price.
			 * Only drawn if the most recent tick is visible.
			 *
			 * See {@link CIQ.ChartEngine.AdvancedInjectable#drawCurrentHR}
			 *
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`currentPriceLine`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 05-2016-10
			 */
			currentPriceLine: false,
			/**
			 * Disables dragging a plot between panels or a y-axis within a panel.
			 * Separate switches are provided for dragging studies, series, or axes.
			 * Alternatively, all dragging may be disabled by setting `dragging: false`.
			 *
			 * To also disable the highlight when hovering over the Y axis, add the following:
			 *  ```
			 *  CIQ.ChartEngine.YAxis.prototype.setBackground = function() {}
			 *  ```
			 *
			 * To also disable the highlight when hovering over the Y axis, add the following:
			 *  ```
			 *  CIQ.ChartEngine.YAxis.prototype.setBackground = function() {}
			 *  ```
			 *
			 * @type object|boolean
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`dragging`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 7.1.0
			 * @example
			 * stxx.preferences.dragging.study=false;
			 * @example
			 * stxx.preferences.dragging=false;
			 */
			dragging: {
				series: true,
				study: true,
				yaxis: true
			},
			/**
			 * When using drawing tools, this will become an object when user saves the drawing parameters.
			 * A sub-object is created for each drawing tool.
			 * These preferences are used whenever the user selects that drawing object, and overrides the default stxx.currentVectorParameters.
			 * Use {@link CIQ.Drawing.saveConfig} to save the parameters to this object.
			 * @type object
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`drawings`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 6.0.0
			 */
			drawings: null,
			/**
			 * Pixel radius for the invisible intersection box around the cursor used to determine if it has intersected with an element to be highlighted.
			 * This value is used primarily for non-touch cursor events (mouse, touchpad).  Used on items removed with a right click such as series and drawings.
			 *
			 * Only applicable if the user has **not** tapped on the screen to set the location of the cross-hair.
			 *
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`highlightsRadius`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 3.0.0
			 */
			highlightsRadius: 10,
			/**
			 * For touch events on the chart canvas.  Pixel radius for the invisible intersection box around the cursor used to determine if it has intersected
			 * with an element to be highlighted. The larger highlight radius is more suitable for the less precise input from touch events.  Used on
			 * items removed with a right click such as series and drawings.
			 *
			 * **Only applicable for touch events while the cursor is not controlling the crosshair tool. Otherwise, highlightsRadius is used.**
			 *
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`highlightsTapRadius`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 3.0.0
			 */
			highlightsTapRadius: 30,
			/**
			 * Magnetizes the crosshairs to data points during drawing operations to improve initial placement accuracy.
			 *
			 * - When `true`, the magnet is considered "strong" and will always magnetize.
			 * - When a number, it is considered "weak" and will only magnetize within the area of defined. The radius of the circle is the number you set.
			 *
			 * **We recommend 75 as the value for the parameter when the `number` type is used.**
			 *
			 * It will not be used when an existing drawing is being repositioned.
			 *
			 * See {@link CIQ.ChartEngine.AdvancedInjectable#magnetize} for more details.
			 *
			 * @type boolean | number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`magnet`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 7.2.0 Magnets can now be applied to any series or study.
			 */
			magnet: false,
			/**
			 * Locks the crosshair y-coordinate to the value of the field name specified for the tick under the cursor on the primary chart.
			 *
			 * For studies, create a `horizontalCrosshairFieldFN` function that will be called by `CIQ.Studies.addStudy`.
			 * The function must return the field name in the data set to reference. The function will not be called when the study is set to
			 * overlay or underlay the chart's panel.
			 *
			 * @example
			 * // Have the crosshairs lock to the "Close" field of the tick under the cursor.
			 * stxx.preferences.horizontalCrosshairField = "Close";
			 *
			 * @example
			 * // Have the crosshair slock to the "ATR ATR (14)" field for a ATR study with a period of 14.
			 * CIQ.Studies.studyLibrary["ATR"].horizontalCrosshairFieldFN = function(stx, sd) {
			 * 	// Returns the field name, which should be created by the study's "calculateFN".
			 * 	return "ATR " + sd.name;
			 * };
			 *
			 * @type string
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`horizontalCrosshairField`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 04-2016-08
			 */
			horizontalCrosshairField: null,
			/**
			 * Set to true to display labels on y-axis for line based studies using {@link CIQ.Studies.displayIndividualSeriesAsLine} or {@link CIQ.Studies.displaySeriesAsLine} (this is overridden by the particular y-axis setting of {@link CIQ.ChartEngine.YAxis#drawPriceLabels}).
			 * This flag is checked inside these 2 functions to decide if a label should be set, as such if you do not wish to have a label on a particular study line, you can set this flag to `false`, before calling the function, and then back to `true`.
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`labels`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @example
			 * //do not display the price labels for this study
			 * stxx.preferences.labels=false;
			 * CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
			 *
			 * //restore price labels to default value
			 * stxx.preferences.labels=true;
			 */
			labels: true,
			/**
			 * Stores preferred language for the chart.
			 *
			 * It can be individually restored using {@link CIQ.I18N.setLanguage} and activated by {@link CIQ.I18N.translateUI}
			 * @type {string}
			 * @alias CIQ.ChartEngine#preferences[`language`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 4.0.0
			 */
			language: null,
			/**
			 * Stores the preferred timezone for the display of the x axis labels.
			 *
			 * It is automatically set and can be individually restored by {@link CIQ.ChartEngine#setTimeZone}.
			 * @type {string}
			 * @alias CIQ.ChartEngine#preferences[`timezone`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 4.0.0
			 */
			timeZone: null,
			/**
			 * Initial whitespace on right of the screen in pixels.
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`whitespace`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @example
			 * // override the default value at declaration time
			 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{"whitespace": 20}});
			 */
			whitespace: 50,
			/**
			 * zoom-in speed for mousewheel and zoom button.
			 *
			 * Range: **0 -.99999**. The closer to 1 the slower the zoom.
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`zoomInSpeed`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @example
			 * stxx.preferences.zoomInSpeed=.91;
			 * @example
			 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{"zoomInSpeed": .98}});
			 * @since 07/01/2015
			 */
			zoomInSpeed: null,
			/**
			 * zoom-out speed for mousewheel and zoom button.
			 *
			 * Range: **1-2**. The closer to 1 the slower the zoom.
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`zoomOutSpeed`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @example
			 * stxx.preferences.zoomOutSpeed=1.1;
			 * @example
			 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{"zoomOutSpeed": 1}});
			 * @since 07/01/2015
			 */
			zoomOutSpeed: null,
			/**
			 * If set to 'true', the mouse wheel zooming is centered by the mouse position.
			 *
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#preferences[`zoomAtCurrentMousePosition`]
			 * @memberof CIQ.ChartEngine.preferences#
			 * @since 4.0.0
			 */
			zoomAtCurrentMousePosition: false
		},
		/**
		 * Used to control the behavior and throttling of real time updates in [updateChartData()]{@link CIQ.ChartEngine#updateChartData} to prevent overloading the chart engine
		 * @type object
		 * @alias streamParameters
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * // this will cause updates to be applied to the dataSegment immediately
		 * stxx.streamParameters.maxTicks=0;
		 *
		 * // here is how you would override all options
		 * stxx.streamParameters= {"maxWait":1000,"maxTicks":100}
		 */
		streamParameters: {
			count: 0,
			/**
			 * ms to wait before allowing update to occur (if this condition is met, the update will occur and all pending ticks will be loaded - exclusive of maxTicks)
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#streamParameters[`maxWait`]
			 * @memberof CIQ.ChartEngine.streamParameters#
			 * @example
			 * // update without any time interval delay.
			 * stxx.streamParameters.maxWait=0;
			 */
			maxWait: 1000,
			/**
			 * ticks to wait before allowing update to occur (if this condition is met, the update will occur and all pending ticks will be loaded - exclusive of maxWait)
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#streamParameters[`maxTicks`]
			 * @memberof CIQ.ChartEngine.streamParameters#
			 * @example
			 * // update with every new tick added.
			 * stxx.streamParameters.maxTicks=0;
			 */
			maxTicks: 100,
			timeout: -1
		},
		/**
		 * Allow the candle width to be determined dynamically when using {@link CIQ.ChartEngine#setRange}.
		 * This will require a valid {@link CIQ.ChartEngine#dynamicRangePeriodicityMap}
		 * @type object
		 * @default
		 * @alias autoPickCandleWidth
		 * @memberof CIQ.ChartEngine.prototype
		 * @example
		 * autoPickCandleWidth:{
		 *     turnOn: true,
		 *     candleWidth: 5
		 * }
		 * @since m-2016-12-01
		 */
		autoPickCandleWidth: {
			/**
			 * Turn to 'true' if you want the periodicity to be determined dynamically when using {@link CIQ.ChartEngine#setRange}.
			 * This will require a valid {@link CIQ.ChartEngine#dynamicRangePeriodicityMap}
			 * @type boolean
			 * @default
			 * @alias CIQ.ChartEngine#autoPickCandleWidth[`turnOn`]
			 * @memberof CIQ.ChartEngine.autoPickCandleWidth#
			 */
			turnOn: false,
	
			/**
			 * Set if you want to set a specific candle width when using {@link CIQ.ChartEngine#setRange}.
			 * This will require a valid {@link CIQ.ChartEngine#dynamicRangePeriodicityMap}.
			 * Set to '0' if you want the candle width to be determined according to chart type
			 * @type number
			 * @default
			 * @alias CIQ.ChartEngine#autoPickCandleWidth[`candleWidth`]
			 * @memberof CIQ.ChartEngine.autoPickCandleWidth#
			 */
			candleWidth: 5
		}
	};
	
	CIQ.extend(CIQ.ChartEngine.prototype, prototypeSwitches);
	
	// Constant bitmask for bar evaluation
	CIQ.ChartEngine.NONE = 0; // no evaluation (black bars)
	CIQ.ChartEngine.CLOSEUP = 1; // today's close greater than yesterday's close
	CIQ.ChartEngine.CLOSEDOWN = 2; // today's close less than yesterday's close
	CIQ.ChartEngine.CLOSEEVEN = 4; // today's close the same as yesterday's close
	CIQ.ChartEngine.CANDLEUP = 8; // today's close greater than today's open
	CIQ.ChartEngine.CANDLEDOWN = 16; // today's close less than today's open
	CIQ.ChartEngine.CANDLEEVEN = 32; // today's close equal to today's open
	
	};
	
	
	let __js_core_formatData_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Converts a future month to the month index or vice versa. Month indexes begin with 1 for
	 * January.
	 *
	 * @param {string} x The value to convert. If numeric, converted to future month letter. If
	 * 		alphabetical, converted to month index.
	 * @return {string} The converted value.
	 *
	 * @memberof CIQ
	 */
	CIQ.convertFutureMonth = function (x) {
		var y = x.toString();
		if (y.length <= 0 || y.length > 2) return "";
		switch (y) {
			case "1":
				return "F";
			case "2":
				return "G";
			case "3":
				return "H";
			case "4":
				return "J";
			case "5":
				return "K";
			case "6":
				return "M";
			case "7":
				return "N";
			case "8":
				return "Q";
			case "9":
				return "U";
			case "10":
				return "V";
			case "11":
				return "X";
			case "12":
				return "Z";
			case "F":
				return "1";
			case "G":
				return "2";
			case "H":
				return "3";
			case "J":
				return "4";
			case "K":
				return "5";
			case "M":
				return "6";
			case "N":
				return "7";
			case "Q":
				return "8";
			case "U":
				return "9";
			case "V":
				return "10";
			case "X":
				return "11";
			case "Z":
				return "12";
		}
		return y;
	};
	
	/**
	 * Prints out a number in US Dollar monetary representation
	 * @param  {number} val      The amount
	 * @param  {number} [decimals=2] Number of decimal places.
	 * @param  {string} [currency] Currency designation.  If omitted, will use $.
	 * @return {string}          US Dollar monetary representation
	 * // Returns $100.00
	 * CIQ.money(100, 2);
	 * @memberof CIQ
	 */
	CIQ.money = function (val, decimals, currency) {
		if (!currency) currency = "$";
		if (currency.length == 3) currency += " ";
		if (!decimals && decimals !== 0) decimals = 2;
		return (
			currency + CIQ.commas((Math.round(val * 10000) / 10000).toFixed(decimals))
		);
	};
	
	/**
	 * Converts a currency code from ISO to char
	 * @param  {string} code      The string to convert, e.g. USD
	 * @return {string}          The converted string, e.g. $
	 * @memberof CIQ
	 */
	CIQ.convertCurrencyCode = function (code) {
		var codes = {
			JPY: "¥",
			USD: "$",
			AUD: "A$",
			BRL: "R$",
			CAD: "CA$",
			CNY: "CN¥",
			CZK: "Kč",
			DKK: "kr",
			EUR: "€",
			GBP: "£",
			HKD: "HK$",
			HUF: "Ft",
			ILS: "₪",
			INR: "₹",
			KRW: "₩",
			MXN: "MX$",
			NOK: "kr",
			NZD: "NZ$",
			PLN: "zł",
			RUB: "руб",
			SAR: "﷼",
			SEK: "kr",
			SGD: "S$",
			THB: "฿",
			TRY: "₺",
			TWD: "NT$",
			VND: "₫",
			XAF: "FCFA",
			XCD: "EC$",
			XOF: "CFA",
			XPF: "CFPF",
			ZAR: "R"
		};
		var rt = codes[code];
		if (rt) return rt;
		return code;
	};
	
	/**
	 * Returns a string representation of a number with commas in thousands, millions or billions places. Note that this function does
	 * not handle values with more than 3 decimal places!!!
	 * @param  {number} val The value
	 * @return {string}     The result with commas
	 * @example
	 * // Returns 1,000,000
	 * CIQ.commas(1000000);
	 * @memberof CIQ
	 */
	CIQ.commas = function (val) {
		return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	/**
	 * Convenience function to convert API periodicity parameters to internal periodicity format.
	 * @param  {string} period The period value as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @param  {string} [interval] The interval value as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @param  {string} timeUnit The timeUnit value as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @return {object} object containing internally compliant periodicity,interval, timeUnit
	 * @memberof CIQ
	 * @tsdeclaration
	 * function cleanPeriodicity(period: number, interval: number, timeUnit: string)
	 * function cleanPeriodicity(period: number, timeUnit: string)
	 * @since 5.1.1
	 */
	CIQ.cleanPeriodicity = function (period, interval, timeUnit) {
		if (isNaN(period)) period = 1;
		if (!interval) interval = 1;
		if (!isNaN(interval) && timeUnit) {
			// disregard the numeric interval if a daily timeUnit is provided
			//	we'll need to propagate timeUnit down wherever we are examining the interval alone to determine the time unit
			if (
				!(
					timeUnit == "hour" ||
					timeUnit == "minute" ||
					timeUnit == "second" ||
					timeUnit == "millisecond"
				)
			) {
				interval = timeUnit;
				timeUnit = null;
			}
		}
	
		// clean up timeUnit
		//if(CIQ.ChartEngine.isDailyInterval(interval)) timeUnit=null; // redundant
		else if (interval == "tick") timeUnit = null;
		else if (!timeUnit && !isNaN(interval)) timeUnit = "minute";
	
		// support hour
		if (timeUnit == "hour") {
			timeUnit = "minute";
			interval = interval * 60;
		}
	
		// support year
		if (interval == "year") {
			interval = "month";
			if (!period) period = 1;
			period = period * 12;
		}
	
		return { period: period, interval: interval, timeUnit: timeUnit };
	};
	
	/**
	 * Creates a string with a periodicity that is easy to read given a chart
	 * @param  {CIQ.ChartEngine} stx A chart object
	 * @return {string}     A periodicity value that can be displayed to an end user
	 * @memberof CIQ
	 */
	CIQ.readablePeriodicity = function (stx) {
		var displayPeriodicity = stx.layout.periodicity;
		var displayInterval = stx.layout.interval;
		if (typeof stx.layout.interval == "number" && stx.layout.timeUnit) {
			displayPeriodicity = stx.layout.interval * stx.layout.periodicity;
			displayInterval = stx.layout.timeUnit;
		} else if (typeof stx.layout.interval == "number" && !stx.layout.timeUnit) {
			displayPeriodicity = stx.layout.interval * stx.layout.periodicity;
			displayInterval = "minute";
		}
		if (displayPeriodicity % 60 === 0 && displayInterval == "minute") {
			displayPeriodicity /= 60;
			displayInterval = "hour";
		}
		return (
			displayPeriodicity + " " + stx.translateIf(CIQ.capitalize(displayInterval))
		);
	};
	
	/**
	 * Given a numeric price that may be a float with rounding errors, this will trim off the trailing zeroes
	 * @param  {number} price The price
	 * @return {number}       The price trimmed of trailing zeroes
	 * @memberof CIQ
	 */
	CIQ.fixPrice = function (price) {
		if (!price && price !== 0) return null;
		var p = price.toFixed(10);
		for (var i = p.length - 1; i > 1; i--) {
			if (p.charAt(i) != "0") break;
		}
		p = p.substring(0, i + 1);
		return parseFloat(p);
	};
	
	/**
	 * Condenses a number into abbreviated form by adding "k","m","b" or "t".
	 * This method is used in the y-axis for example with volume studies.
	 * @param  {number} txt - A numerical value
	 * @return {string}     Condensed version of the number if over 999, otherwise returns `txt` untouched
	 * @example
	 * // This will return 12m
	 * condenseInt(12000000);
	 * @memberof CIQ
	 * @since 4.0.0 Now returns `txt` untouched if under 1000. Previously was removing all decimal places.
	 */
	CIQ.condenseInt = function (txt) {
		if (txt === null || typeof txt == "undefined") return "";
		if (txt === Infinity || txt === -Infinity) return "n/a";
		var isNegative = txt < 0;
	
		if (!isNaN(txt)) {
			txt = Math.abs(txt);
	
			if (txt > 1000000000000) txt = Math.round(txt / 100000000000) / 10 + "t";
			else if (txt > 100000000000) txt = Math.round(txt / 1000000000) + "b";
			//100b
			else if (txt > 10000000000)
				txt = (Math.round(txt / 100000000) / 10).toFixed(1) + "b";
			//10.1b
			else if (txt > 1000000000)
				txt = (Math.round(txt / 10000000) / 100).toFixed(2) + "b";
			//1.11b
			else if (txt > 100000000) txt = Math.round(txt / 1000000) + "m";
			//100m
			else if (txt > 10000000)
				txt = (Math.round(txt / 100000) / 10).toFixed(1) + "m";
			//10.1m
			else if (txt > 1000000)
				txt = (Math.round(txt / 10000) / 100).toFixed(2) + "m";
			//1.11m
			else if (txt > 100000) txt = Math.round(txt / 1000) + "k";
			//100k
			else if (txt > 10000) txt = (Math.round(txt / 100) / 10).toFixed(1) + "k";
			//10.1k
			else if (txt > 1000) txt = (Math.round(txt / 10) / 100).toFixed(2) + "k";
			//1.11k
			else txt = txt.toString();
		} else {
			txt = txt.toString();
		}
	
		if (isNegative) txt = "-" + txt;
		return txt;
	};
	
	/**
	 * Determines how many decimal places the security trades.
	 *
	 * This is the default calculateTradingDecimalPlaces function.  It is used by {@link CIQ.ChartEngine#setMasterData} to round off the prices
	 * to an appropriate number of decimal places.  The function is assigned to {@link CIQ.ChartEngine.Chart#calculateTradingDecimalPlaces}},
	 * but you may set to your own logic instead.
	 *
	 * The default algorithm is to check the most recent 50 quotes and find the maximum number of decimal places that the stock has traded.
	 * This will work for most securities but if your market data feed has rounding errors
	 * or bad data then you may want to supplement this algorithm that checks the maximum value by security type.
	 *
	 * It defaults to a minimum of 2 decimals.
	 * @param {object} params Parameters
	 * @param  {CIQ.ChartEngine} params.stx    The chart object
	 * @param {CIQ.ChartEngine.Chart} params.chart The chart in question
	 * @param  {string} params.symbol The symbol string
	 * @param  {object} params.symbolObject The symbol object. If you create charts with just stock symbol then symbolObject.symbol will contain that symbol
	 * @return {number}        The number of decimal places
	 * @memberof CIQ
	 * @example
	 * //set your own logic for calculating decimal places.
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{labels:false, currentPriceLine:true, whitespace:0}});
	 * stxx.chart.calculateTradingDecimalPlaces=yourCustomFunction;
	 * @example
	// default code
	CIQ.calculateTradingDecimalPlaces=function(params){
		var chart=params.chart;
		var decimalPlaces=2;
		var quotesToCheck = 50; // Check up to 50 recent quotes
		var masterData=chart.masterData;
		if(masterData && masterData.length > quotesToCheck){
			// exclude the current quote by setting i=2 in case animation is enabled. Animation uses very large decimals to allow for smooth movements.
			for(var i=2;i<quotesToCheck;i++){
				var position=masterData.length-i;
				if(position<0) break;
				var quotes=masterData[position];
				if(quotes.Close && typeof quotes.Close == 'number'){
					var cs=quotes.Close.toString();
					var point=cs.indexOf('.');
					if(point!=-1){
						var dp = cs.length-point-1;
						if(dp>decimalPlaces){
							decimalPlaces=dp;
						}
					}
				}
			}
		}
		var maxDecimalPlaces=chart.yAxis.maxDecimalPlaces;
		if(decimalPlaces>maxDecimalPlaces && maxDecimalPlaces!==null) decimalPlaces=maxDecimalPlaces;
		return decimalPlaces;
	};
	 */
	CIQ.calculateTradingDecimalPlaces = function (params) {
		var chart = params.chart;
		var decimalPlaces = 2;
		var quotesToCheck = 50; // Check up to 50 recent quotes
		var masterData = chart.masterData;
		if (masterData && masterData.length > quotesToCheck) {
			// exclude the current quote by setting i=2 in case animation is enabled. Animation uses very large decimals to allow for smooth movements.
			for (var i = 2; i < quotesToCheck; i++) {
				var position = masterData.length - i;
				if (position < 0) break;
				var quotes = masterData[position];
				if (quotes.Close && typeof quotes.Close == "number") {
					var cs = quotes.Close.toString();
					var point = cs.indexOf(".");
					if (point != -1) {
						var dp = cs.length - point - 1;
						if (dp > decimalPlaces) {
							decimalPlaces = dp;
						}
					}
				}
			}
		}
		var maxDecimalPlaces = chart.yAxis.maxDecimalPlaces;
		if (decimalPlaces > maxDecimalPlaces && maxDecimalPlaces !== null)
			decimalPlaces = maxDecimalPlaces;
		return decimalPlaces;
	};
	
	/**
	 * This method will return a tuple [min,max] that contains the minimum
	 * and maximum values in the series where values are `series[field]`.
	 *
	 * @param {array} series The series
	 * @param {string} field The name of the series to look at
	 * @param {string} subField The name of the field within the series to look at
	 * @param {boolean} highLow True when comparing max High/min Low vs a specific field
	 * @return {array} Tuple containing min and max values in the series
	 * @memberof CIQ
	 * @since 5.1.0 Added subField, highLow arguments
	 */
	CIQ.minMax = function (series, field, subField, highLow) {
		var min = Number.MAX_VALUE;
		var max = Number.MAX_VALUE * -1;
		if (!subField) subField = "Close";
		var highField = highLow ? "High" : subField;
		var lowField = highLow ? "Low" : subField;
		for (var i = 0; i < series.length; i++) {
			var entry = series[i];
			if (!entry) continue;
			var fVal = entry[field];
			if (!fVal && fVal !== 0) continue;
			var sfVal = fVal;
			if (typeof fVal === "object") sfVal = fVal[highField];
			if (!isNaN(sfVal) && (sfVal || sfVal === 0)) {
				max = Math.max(max, sfVal);
			}
			if (typeof fVal === "object") sfVal = fVal[lowField];
			if (!isNaN(sfVal) && (sfVal || sfVal === 0)) {
				min = Math.min(min, sfVal);
			}
		}
		return [min, max];
	};
	
	/**
	 * Returns true if two symbols match. Symbols can be strings or symbolObjects. By default, the "symbol" member is compared, and then
	 * a "source" member if one exists.
	 * If the objects have an "equals()" function member then that will be used for comparison.
	 * You can override this with your own method if you have other requirements.
	 * @param  {object} left  Symbol object
	 * @param  {object} right Symbol object
	 * @return {boolean}       true if the same
	 * @memberOf  CIQ
	 */
	CIQ.symbolEqual = function (left, right) {
		if (!left || !right) return false;
		if (typeof left != "object") left = { symbol: left };
		if (typeof right != "object") right = { symbol: right };
		if (typeof left.equals == "function") {
			return left.equals(right);
		}
		var l = left.symbol;
		var r = right.symbol;
		if (l) l = l.toUpperCase();
		if (r) r = r.toUpperCase();
		if (l != r) return false;
		if (left.source != right.source) return false;
		return true;
	};
	
	/**
	 * Convenience function to iterate through the charts masterData and add a data member.
	 * Used to load initial data for additional series and study symbols and should normally not be called directly. Unless used inside a study initialize function; use {@link CIQ.ChartEngine#addSeries} or {@link CIQ.ChartEngine#updateChartData} instead.
	 * Can be used with any array of data objects which contains at least the 'DT' (date in javascript format) and 'Close' ( close/last price ) elements of an [OHLC object]{@tutorial InputDataFormat}.
	 * @param {object} params Parameters object
	 * @param {CIQ.ChartEngine} [params.stx]       	A chart object
	 * @param {array} [params.data]		 			The data to add (which should align or closely align with the chart data by date)
	 * @param {array} [params.fields] 				The fields from the incoming data objects to extract and add as the new members in each masterData object. One new member will be added per field using the exact same name as in the incoming data. Example: (for each field name in the array) masterData[mIterator][fieldN]=data[dIterator][fieldN]. Takes precedence over `createObject`, `label` and `fieldForLabel` parameters.  Use fields=["*"] to copy all fields in the data object.
	 * @param {string} [params.label]     			The name of the new member to add into each masterData object. Example: masterData[mIterator][label]=data[dIterator]["Close"]. Required unless "fields" is specified.
	 * @param {string} [params.createObject] 		If truthy, then each complete incoming data object will be assigned to the new label member in each masterData object. If set to "aggregate", will consolidate the OHLV data with the new data. The data object is expected to be a properly formatted OHLC record, or at least contain a 'Close' price, otherwise this parameter will not be honored. Example: masterData[mIterator][label]=data[dIterator]. This behavior is mutually exclusive with `fields`. <br>If the data object contains a 'Value' field, this parameter will not be honored and instead the 'Value' field will be used as follows: masterData[mIterator][label] = data[dIterator]["Value"];
	 * @param {string} [params.fieldForLabel="Close"] 	If set, this will be the field from each incoming data object that will be copied into the new label member in each masterData object. If not set, "Close" or "Value" is used, whichever exists; and if neither exists, it will attempt to copy over a field matching the `label` name. Example: masterData[mIterator][label]=data[dIterator][fieldForLabel]. This behavior is mutually exclusive with `fields` and `createObject`.
	 * @param {boolean} [params.fillGaps]			If true then gaps in data will be filled by carrying forward the value of from the previous bar.
	 * @param {boolean} [params.noCleanupDates]		If true then dates have been cleaned up already by calling {@link CIQ.ChartEngine#doCleanupDates}, so do not do so in here.
	 * @param {CIQ.ChartEngine.Chart} [params.chart]   The chart to update
	 * @memberof CIQ
	 * @example
	 * //data element format if neither fields, fieldForLabel or createObject are used
	 * {DT:epoch,Date:strDate,Value:value}
	 * {DT:epoch,Date:strDate,Close:value }
	 * //data element format if fields is used
	 * {DT:epoch,Date:strDate,Field1:value,Field2:value,Field3:value,Field4:value}
	 * //data element format if createObject is used
	 * {DT:epoch,Date:strDate,AnyOtherData:otherData,MoreData:otherData,...}
	 * @since
	 * - 04-2015
	 * - 15-07-01 Added `fieldForLabel` argument.
	 * - 3.0.0 All data sent in will be forced into the chart. Dates are no longer required to be exact matches (minutes, hours, seconds, milliseconds) in order to show up in comparisons.
	 * - 4.0.0 Arguments are now parameterized. Backward compatibility with old signature.
	 * - 4.0.0 Added ability to specify copying of all fields by setting `params.fields=["*"]`.
	 * - 5.2.0 Enhanced parameter `createObject` to take a string.
	 * - 5.2.0 Added parameter `noCleanupDates`.
	 */
	CIQ.addMemberToMasterdata = function (params) {
		if (params.constructor === CIQ.ChartEngine) {
			params = {
				stx: arguments[0],
				label: arguments[1],
				data: arguments[2],
				fields: arguments[3],
				createObject: arguments[4],
				fieldForLabel: arguments[5]
			};
		}
		var stx = params.stx;
		var label = params.label;
		var data = params.data;
		var fields = params.fields;
		var createObject = params.createObject;
		var fieldForLabel = params.fieldForLabel;
	
		var chart = params.chart ? params.chart : stx.chart;
	
		if (!params.noCleanupDates) stx.doCleanupDates(data, stx.layout.interval);
	
		var series = [];
		if (stx.getSeries) series = stx.getSeries({ symbol: label, chart: chart });
	
		if (data && data.constructor == Object) data = [data]; // When developer mistakenly sends an object instead of an array of objects
		if (!data || !data.length) return;
	
		var mIterator = 0,
			cIterator = 0,
			masterData = chart.masterData,
			layout = stx.layout,
			m,
			c;
		if (!masterData) {
			masterData = [];
		}
	
		var defaultPlotField = (chart && chart.defaultPlotField) || null;
		var isLineType =
			stx.mainSeriesRenderer && !stx.mainSeriesRenderer.highLowBars;
		var chartType = layout.chartType;
		if (!isLineType && chartType) {
			var renderer = CIQ.Renderer.produce(chartType, {});
			if (renderer) isLineType = !renderer.highLowBars;
		}
	
		function aggregate(m, c) {
			if (!m || typeof m != "object") {
				m = c;
				return m;
			}
			var prior = {
				Close: m.Close,
				High: m.High,
				Low: m.Low,
				Open: m.Open,
				Volume: m.Volume
			};
			m = c;
			for (var p in prior) {
				if (m.Close === null) {
					// Close is not set, nothing else is valid (it's a gap)
					if (m[p] !== undefined) m[p] = null;
				} else if (typeof m[p] !== "number") m[p] = prior[p];
				// new data invalid, use original data
				else if (typeof prior[p] === "number") {
					// aggregate the data
					if (p == "Open") m.Open = prior.Open;
					else if (p == "Low" && m.Low > prior.Low) m.Low = prior.Low;
					else if (p == "High" && m.High < prior.High) m.High = prior.High;
					else if (p == "Volume") m.Volume += prior.Volume;
				}
			}
			return m;
		}
	
		// inject data from c into m
		function injectData(m, c) {
			if (fields && fields.length) {
				// Case 1, copy the [several] specified fields from new object to masterData object
				if (fields[0] == "*") {
					// copy all fields
					CIQ.extend(m, c);
				} else {
					for (var i = 0; i < fields.length; i++) {
						m[fields[i]] = c[fields[i]];
					}
				}
			} else if (createObject) {
				// Case 2, the new object will become a child object of the masterData object
				if (c.Value !== undefined) {
					// If "Value" is in the new object use that
					m[label] = c.Value;
					return;
				} else if (createObject == "aggregate") {
					m[label] = aggregate(m[label], c);
				} else {
					m[label] = c;
				}
				// If we don't set this here, the study calculations will fail
				var m_ = m[label];
				if (typeof m_.Close == "number") {
					if (typeof m_.Open != "number") m_.Open = m_.Close;
					var high = Math.max(m_.Open, m_.Close),
						low = Math.min(m_.Open, m_.Close);
					if (typeof m_.High != "number" || m_.High < high) m_.High = high;
					if (typeof m_.Low != "number" || m_.Low > low) m_.Low = low;
				}
				if (m_.Volume && typeof m_.Volume !== "number")
					m_.Volume = parseInt(m_.Volume, 10);
			} else if (fieldForLabel) {
				// Case 3, copy the data from one label (fieldForLabel) to another (label)
				m[label] = c[fieldForLabel];
			} else if (
				isLineType &&
				defaultPlotField &&
				c[defaultPlotField] !== undefined
			) {
				// If a default field on the chart has been provided, then use that if it's in the new object
				m[label] = c[defaultPlotField];
			} else if (layout.adj && c.Adj_Close !== undefined) {
				// If Adjusted close is in the new object, use that
				m[label] = c.Adj_Close;
			} else if (c.Close !== undefined) {
				// If Close is in the new object use that
				m[label] = c.Close;
			} else if (c.Value !== undefined) {
				// If "Value" is in the new object use that
				m[label] = c.Value;
			} else {
				// Default to copying the same label from the old to the new object.
				m[label] = c[label];
			}
		}
	
		// Binary search for next relevant masterData record, with the following modifications:
		// 1. Always check the very next record, since that is most likely
		// 2. Before search, check last record
		function fastSeek(date) {
			function testIt() {
				if (+masterData[mIterator].DT == +date) return 0;
				if (masterData[mIterator].DT < date) return 1;
				if (masterData[mIterator - 1].DT > date) return -1;
				if (+masterData[mIterator - 1].DT == +date) mIterator--; // efficiency
				return 0;
			}
			var begin = mIterator,
				end = masterData.length - 1;
			if (masterData[end].DT < date) {
				mIterator = end + 1;
				return;
			} else if (+masterData[end].DT == +date) {
				mIterator = end;
				return;
			}
			mIterator++;
			var attempts = 0;
			while (++attempts < 100) {
				switch (testIt()) {
					case 0:
						return;
					case 1:
						begin = mIterator;
						break;
					case -1:
						end = mIterator;
						break;
				}
				mIterator = Math.round((end + begin) / 2);
			}
			if (attempts >= 100) {
				console.log(
					"!!!Warning: addMemberToMasterdata() did not find insertion point."
				);
				mIterator = masterData.length - 1;
			}
		}
	
		var dateFormatter = CIQ.yyyymmddhhmmssmmm;
		/* The value for *displayDate* on quotes created below will be done by the call to ChartEngine#setMasterData */
	
		// insert/update up to masterData last bar
		while (data && mIterator < masterData.length && cIterator < data.length) {
			c = data[cIterator];
			m = masterData[mIterator];
			if (!c.DT || typeof c.DT == "undefined") c.DT = CIQ.strToDateTime(c.Date);
			else {
				if (typeof c.DT == "number") c.DT = new Date(c.DT); //in case they sent in an epoch
				if (!c.Date || c.Date.length != 17) c.Date = dateFormatter(c.DT);
			}
			if (cIterator === 0) {
				for (var s1 = 0; s1 < series.length; s1++) {
					if (!series[s1].endPoints.begin || series[s1].endPoints.begin > c.DT)
						series[s1].endPoints.begin = c.DT;
				}
			}
			if (+c.DT == +m.DT) {
				injectData(m, c);
				cIterator++;
				mIterator++;
				continue;
			}
	
			if (c.DT < m.DT) {
				masterData.splice(mIterator, 0, { DT: c.DT, Date: c.Date });
				continue;
			} else fastSeek(c.DT); // this advances the mIterator
		}
	
		// insert after master data last bar
		if (mIterator >= masterData.length) {
			while (data && cIterator < data.length) {
				c = data[cIterator];
				if (!c.DT || typeof c.DT == "undefined") c.DT = CIQ.strToDateTime(c.Date);
				else {
					if (typeof c.DT == "number") c.DT = new Date(c.DT); //in case they sent in an epoch
					if (!c.Date || c.Date.length != 17) c.Date = dateFormatter(c.DT);
				}
				m = {
					DT: c.DT,
					Date: c.Date
				};
				injectData(m, c);
				masterData.push(m);
				cIterator++;
			}
		}
		if (params.fillGaps && masterData.length) {
			var cleanupGapsParams = {
				noCleanupDates: true,
				cleanupGaps: params.fillGaps
			};
			if (fields) {
				for (var j = 0; j < fields.length; j++) {
					cleanupGapsParams.field = fields[j];
					stx.doCleanupGaps(masterData, chart, cleanupGapsParams);
				}
			} else {
				cleanupGapsParams.field = label;
				stx.doCleanupGaps(masterData, chart, cleanupGapsParams);
			}
		}
		for (var s2 = 0; s2 < series.length; s2++) {
			var endPoints = series[s2].endPoints;
			if (!endPoints.end || !label || endPoints.end <= m[label].DT) {
				endPoints.end = label ? m[label].DT : m.DT;
				var sLabel =
					label ||
					(series[s2].parameters && series[s2].parameters.field) ||
					chart.defaultPlotField;
				series[s2].lastQuote = stx.getFirstLastDataRecord(
					masterData,
					sLabel,
					true
				);
			}
		}
		stx.setMasterData(masterData, chart, { noCleanupDates: true });
	};
	
	};
	
	
	let __js_core_math_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/* Easing cubics from
		http://gizma.com/easing/#expo1
		t = current time (t should move from zero to d)
		b = starting value
		c = change in value (b + c = ending value )
		d = duration
		*/
	
	Math.easeInOutQuad = function (t, b, c, d) {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t + b;
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	};
	
	Math.easeInOutCubic = function (t, b, c, d) {
		t /= d / 2;
		if (t < 1) return (c / 2) * t * t * t + b;
		t -= 2;
		return (c / 2) * (t * t * t + 2) + b;
	};
	
	Math.easeOutCubic = function (t, b, c, d) {
		t /= d;
		t--;
		return c * (t * t * t + 1) + b;
	};
	
	/**
	 * Convenience function to compute xor operation.
	 *
	 * @param {object} a Operand.
	 * @param {object} b Operand.
	 * @return {boolean} true if only one of the operands is truthy.
	 * @memberof CIQ
	 * @since 7.3.0
	 */
	CIQ.xor = function (a, b) {
		var _a = !a,
			_b = !b; // convert to boolean
		return _a !== _b;
	};
	
	/**
	 * Convenience function to round a floating point number.
	 *
	 * This has better decimal accuracy than:
	 * - number.toFixed(decimals)
	 * - Math.round(number*decimals)/decimals
	 * @param  {number} number The number to round
	 * @param  {number} decimals The number of decimal places
	 * @return  {number} Rounded number
	 * @memberof CIQ
	 * @since 7.0.0
	 */
	CIQ.round = function (number, decimals) {
		return Number(Math.round(number + "e" + decimals) + "e-" + decimals);
	};
	
	/**
	 * Convenience function to count number of decimal places in a number
	 * @param  {number} n The number to check
	 * @return  {number} Number of decimal places
	 * @memberof CIQ
	 * @since
	 * - 6.1.0
	 * - 6.2.0 Now handles scientific notation.
	 */
	CIQ.countDecimals = function (n) {
		if (typeof n !== "number" || isNaN(n)) return 0;
		if (Math.floor(n) === Number(n)) return 0;
		var strN = n.toString().split("e-");
		if (strN.length > 1)
			return CIQ.countDecimals(Number(strN[0])) + Number(strN[1]);
		if (strN[0].indexOf(".") > -1) return strN[0].split(".")[1].length;
		return 0;
	};
	
	/**
	 * Convenience function to determine if a value is a valid number.
	 * @param  {number} n The number to check
	 * @return {boolean} True if n is a real finite number. NaN, Infinity, null, undefined, etc are not considered to be a valid number.
	 * @memberof CIQ
	 * @since 5.2.2
	 */
	CIQ.isValidNumber = function (n) {
		return isFinite(n) && +n === n;
	};
	
	/**
	 * Returns the log base 10 of a value
	 * @param  {number} y The value
	 * @return {number}   log10 value
	 * @memberof CIQ
	 */
	CIQ.log10 = function (y) {
		return Math.log(y) / Math.LN10;
	};
	
	/**
	 * Determines whether a line intersects a box. This is used within the charting engine to determine whether the cursor
	 * has intersected a drawing.
	 * Note this function is meant to receive bx1, by1, bx2, by2, x0, y0, x1 and y1 as pixel values and not as ticks/axis values.
	 * @param  {number} bx1
	 * @param  {number} by1
	 * @param  {number} bx2
	 * @param  {number} by2
	 * @param  {number} x0
	 * @param  {number} y0
	 * @param  {number} x1
	 * @param  {number} y1
	 * @param  {string} vtype - Either "segment", "ray" or "line".  Anything else will default to segment.
	 * @return {boolean}       Returns true if the line intersects the box
	 * @memberof CIQ
	 * @since
	 * - 4.0.0 Added `isLog` parameter.
	 * - 6.0.0 Removed `isLog` parameter.
	 */
	CIQ.boxIntersects = function (bx1, by1, bx2, by2, x0, y0, x1, y1, vtype) {
		if (arguments[9] !== undefined) {
			console.warn(
				"CIQ.boxIntersects() no longer supports isLog argument, please be sure arguments are passed in as pixels."
			);
		}
		var minX = Math.min(bx1, bx2);
		var maxX = Math.max(bx1, bx2);
		var minY = Math.min(by1, by2);
		var maxY = Math.max(by1, by2);
		var isRay = vtype == "ray";
	
		// Check for invalid values
		if (isNaN(x0) || isNaN(x1) || isNaN(y0) || isNaN(y1)) return false;
	
		// First see if segment/ray lies outside the box
		if (vtype != "line") {
			if (x0 < minX && x1 < minX && (!isRay || x0 > x1)) return false;
			if (x0 > maxX && x1 > maxX && (!isRay || x0 < x1)) return false;
			if (y0 < minY && y1 < minY && (!isRay || y0 > y1)) return false;
			if (y0 > maxY && y1 > maxY && (!isRay || y0 < y1)) return false;
		}
		// Now see if all box corners land on the same side of the line
		function cornerCheck(x, y) {
			return (y - y0) * (x1 - x0) - (x - x0) * (y1 - y0);
		}
		var map = {
			a: cornerCheck(bx1, by1),
			b: cornerCheck(bx1, by2),
			c: cornerCheck(bx2, by1),
			d: cornerCheck(bx2, by2)
		};
		if (map.a > 0 && map.b > 0 && map.c > 0 && map.d > 0) return false;
		if (map.a < 0 && map.b < 0 && map.c < 0 && map.d < 0) return false;
	
		return true;
	};
	
	/**
	 * Determines whether two lines intersect
	 * @param  {number} x1
	 * @param  {number} x2
	 * @param  {number} y1
	 * @param  {number} y2
	 * @param  {number} x3
	 * @param  {number} x4
	 * @param  {number} y3
	 * @param  {number} y4
	 * @param  {string} type - Either "segment", "ray" or "line"
	 * @return {boolean}      Returns true if the two lines intersect
	 * @memberof CIQ
	 */
	CIQ.linesIntersect = function (x1, x2, y1, y2, x3, x4, y3, y4, type) {
		var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		var numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		var numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
		//var EPS = .000001;
	
		if (denom === 0) {
			if (numera === 0 && numerb === 0) return true; // coincident
			return false; // parallel
		}
	
		var mua = numera / denom;
		var mub = numerb / denom;
		if (type == "segment") {
			if (mua >= 0 && mua <= 1 && mub >= 0 && mub <= 1) return true;
		} else if (type == "line" || type == "horizontal" || type == "vertical") {
			if (mua >= 0 && mua <= 1) return true;
		} else if (type == "ray") {
			if (mua >= 0 && mua <= 1 && mub >= 0) return true;
		}
		return false;
	};
	
	/**
	 * Determines the Y value at which point X intersects a line (vector)
	 * @param  {object} vector - Object of type {x0,x1,y0,y1}
	 * @param  {number} x      - X value
	 * @return {number}        - Y intersection point
	 * @memberof CIQ
	 */
	CIQ.yIntersection = function (vector, x) {
		var x1 = vector.x0,
			x2 = vector.x1,
			x3 = x,
			x4 = x;
		var y1 = vector.y0,
			y2 = vector.y1,
			y3 = 0,
			y4 = 10000;
		var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		var numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		//var numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
		//var EPS = .000001;
	
		var mua = numera / denom;
		if (denom === 0) {
			if (numera === 0) mua = 1;
			else return null;
		}
	
		var y = y1 + mua * (y2 - y1);
		return y;
	};
	
	/**
	 * Determines the X value at which point Y intersects a line (vector)
	 * @param  {object} vector - Object of type {x0,x1,y0,y1}
	 * @param  {number} y      - Y value
	 * @return {number}        - X intersection point
	 * @memberof CIQ
	 */
	CIQ.xIntersection = function (vector, y) {
		var x1 = vector.x0,
			x2 = vector.x1,
			x3 = 0,
			x4 = 10000;
		var y1 = vector.y0,
			y2 = vector.y1,
			y3 = y,
			y4 = y;
		var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		var numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		//var numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
		//var EPS = .000001;
	
		var mua = numera / denom;
		if (denom === 0) {
			if (numera === 0) mua = 1;
			else return null;
		}
	
		var x = x1 + mua * (x2 - x1);
		return x;
	};
	
	/**
	 * Get the X intersection point between two lines
	 * @param  {number} ax1 Initial x coordinate start point of the first box.
	 * @param  {number} ax2 Final x coordinate end point of the first box.
	 * @param  {number} ay1 Initial y coordinate start point of the first box.
	 * @param  {number} ay2 Final y coordinate end point of the fist box.
	 * @param  {number} bx1 Initial x coordinate start point of the second box.
	 * @param  {number} bx2 Final x coordinate end point of the second box.
	 * @param  {number} by1 Initial y coordinate start point of the second box.
	 * @param  {number} by2 Final y coordinate end point of the second box.
	 * @memberof CIQ
	 */
	CIQ.intersectLineLineX = function (ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {
		var ua_t = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
		var u_b = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
	
		var ua = ua_t / u_b;
	
		return ax1 + ua * (ax2 - ax1);
	};
	
	/**
	 * Get the Y intersection point between two lines
	 * @param  {number} ax1 Initial x coordinate start point of the first box.
	 * @param  {number} ax2 Final x coordinate end point of the first box.
	 * @param  {number} ay1 Initial y coordinate start point of the first box.
	 * @param  {number} ay2 Final y coordinate end point of the fist box.
	 * @param  {number} bx1 Initial x coordinate start point of the second box.
	 * @param  {number} bx2 Final x coordinate end point of the second box.
	 * @param  {number} by1 Initial y coordinate start point of the second box.
	 * @param  {number} by2 Final y coordinate end point of the second box.
	 * @memberof CIQ
	 */
	CIQ.intersectLineLineY = function (ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {
		var ua_t = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
		var u_b = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);
	
		var ua = ua_t / u_b;
	
		return ay1 + ua * (ay2 - ay1);
	};
	
	};
	
	
	let __js_core_object_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Deletes the map entries for which the right hand side is the object in question.
	 * @param  {object} map    JavaScript map object
	 * @param  {object} object The actual object to be deleted from the map
	 * @return {boolean}        Returns true if any object actually deleted
	 * @memberof CIQ
	 */
	CIQ.deleteRHS = function (map, object) {
		var deletedOne = false;
		for (var i in map) {
			if (map[i] == object) {
				delete map[i];
				deletedOne = true;
			}
		}
		return deletedOne;
	};
	
	/**
	 * Deletes (removes) nulls or undefined fields (names) from an object. This is useful when marshalling (saving) an object where you don't wish
	 * null or undefined values to show up in the marshalled object (such as when converting to JSON)
	 * @param  {object} obj         The object to scrub
	 * @param  {boolean} [removeNulls] Whether or not to remove null values
	 * @memberof CIQ
	 */
	CIQ.scrub = function (obj, removeNulls) {
		for (var i in obj) {
			if (typeof obj[i] == "undefined") delete obj[i];
			if (removeNulls && obj[i] === null) delete obj[i];
		}
	};
	
	/**
	 * This method changes the target object's contents to match the contents of the source object. This is functionally equivalent
	 * to `target=source` except that it preserves the existence of the target object. This is vitally important if there are data bindings
	 * to the target object otherwise those data bindings would remain attached to a phantom object! The logic here is orchestrated so that you
	 * will receive update, add and delete notifications for each field that changes.
	 * @param {object} target The target object
	 * @param {object} source The source object
	 * @memberof CIQ
	 * @since 2015-11-1
	 */
	CIQ.dataBindSafeAssignment = function (target, source) {
		/*for(var prop in source) {
				target[prop]=source[prop];
			}*/
		CIQ.extend(target, source);
		for (var prop in target) {
			if (typeof source[prop] == "undefined") {
				target[prop] = undefined;
			}
		}
	};
	
	/**
	 * Clones an object. This function creates a deep (recursive) clone of an object. The object can be a primitive or an object or an array.
	 * Note that cloning objects that reference DOM nodes can result in stack overflows. Use with caution.
	 * @param  {object} from The source object
	 * @param  {object} [to]   Optional existing object of same type. Can improve performance when objects are reusable.
	 * @return {object}      A deep clone of the "from" object
	 * @memberof CIQ
	 */
	CIQ.clone = function (from, to) {
		if (from === null || typeof from != "object") return from;
		var c = from.constructor;
		if (c == Date || c == RegExp || c == String || c == Number || c == Boolean)
			return new c(from.valueOf());
		if (c == Function)
			return function () {
				return from.apply(this, arguments);
			};
	
		if (!to) {
			try {
				to = new c();
			} catch (e0) {
				to = Object.create(Object.getPrototypeOf(from));
			}
		}
	
		for (var n in from) {
			to[n] = to[n] !== from[n] ? CIQ.clone(from[n], null) : to[n];
		}
	
		return to;
	};
	
	/**
	 * Non recursive clone. This will only clone the top layer and is safe to use when objects contain DOM nodes.
	 * @param  {object} from - Object to be cloned
	 * @return {object}      A shallow clone of the "from" object
	 * @memberof CIQ
	 */
	CIQ.shallowClone = function (from) {
		if (!from) return from;
		var to;
		if (from.constructor == Array) {
			to = new Array(from.length);
			for (var i = 0; i < from.length; i++) {
				to[i] = from[i];
			}
			return to;
		}
		to = {};
		for (var field in from) {
			to[field] = from[field];
		}
		return to;
	};
	
	/**
	 * Accepts a default parameters object and sets the field values for the target *only if they are missing*.
	 * Note that a value of null will not be overridden. Only undefined (missing) values will be overridden.
	 * @param  {object} target The object needing potential default values
	 * @param  {object} defaults Default values
	 * @return {object}        Returns the modified target object
	 * @since  3.0.0
	 * @example
	 * var target={"color":"red"};
	 * var defaults={"color":"blue", "shape":"triangle"};
	 * CIQ.ensureDefaults(target, defaults);
	 * >> target==={"color":"red", "shape":"triangle"};
	 * @memberof CIQ
	 */
	CIQ.ensureDefaults = function (target, defaults) {
		for (var field in defaults) {
			if (typeof target[field] == "undefined") target[field] = defaults[field];
		}
		return target;
	};
	
	/**
	 * Copies the contents of one object into another.
	 * This is useful if there are pointers to the target object and you want to "replace" it with another object while preserving the pointer.
	 * @param  {object} target The object being pointed to
	 * @param  {object} source The object containing the values you want pointed at
	 * @return {object}        Returns the modified target object
	 * @since  7.1.0
	 * @example
	 * var target={"color":"red", "pattern":"solid"};
	 * var source={"color":"blue", "shape":"triangle"};
	 * CIQ.transferObject(target, source);
	 * >> target==={"color":"blue", "shape":"triangle"};
	 * >> target!==source;
	 * @memberof CIQ
	 */
	CIQ.transferObject = function (target, source) {
		var field;
		for (field in target) {
			if (target.hasOwnProperty(field)) delete target[field];
		}
		for (field in source) {
			if (source.hasOwnProperty(field)) target[field] = source[field];
		}
		return target;
	};
	
	/**
	 * Returns true if the objects are an exact match
	 * @param  {object} a First object
	 * @param  {object} b Second object
	 * @param  {object} [exclude] Exclude these fields
	 * @return {boolean}   True if they are an exact match
	 * @memberof CIQ
	 */
	CIQ.equals = function (a, b, exclude) {
		if (!a && b) return false;
		if (a && !b) return false;
		if (typeof a !== typeof b) return false;
		for (var field in a) {
			if (exclude && exclude[field]) continue;
			if (typeof a[field] === "object") {
				var result = CIQ.equals(a[field], b[field]);
				if (!result) return false;
				continue;
			}
			if (b[field] != a[field]) return false;
		}
		return true;
	};
	
	/**
	 * Returns true if an object has no members
	 * @param  {object}  o A JavaScript object
	 * @return {boolean}   True if there are no members in the object
	 * @memberof CIQ
	 */
	CIQ.isEmpty = function (o) {
		for (var p in o) {
			if (o.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	};
	
	/**
	 * Convenience function returns the first property in an object. Note that while this works in all known browsers
	 * the EMCA spec does not guarantee that the order of members in an object remain static. This method should therefore
	 * be avoided. When ordering is important use an Array!
	 * @param  {object} o A JavaSCript object
	 * @return {object}   The first element in the object or null if it is empty
	 * @memberof CIQ
	 */
	CIQ.first = function (o) {
		for (var p in o) {
			return p;
		}
		return null;
	};
	
	/**
	 * Convenience function for returning the last property in an object. Note that while this works in all known browsers
	 * the EMCA spec does not guarantee that the order of members in an object remain static. This method should therefore
	 * be avoiding. When ordering is important use an Array!
	 * @param  {object} o A JavaScript object
	 * @return {object}   The final member of the object or null if the object is empty
	 * @memberof CIQ
	 */
	CIQ.last = function (o) {
		var l = null;
		for (var p in o) {
			l = p;
		}
		return l;
	};
	
	/**
	 * Returns the number of members in an object
	 * @param  {object} o A valid JavaScript object
	 * @return {number}   The number of members in the object
	 * @memberof CIQ
	 */
	CIQ.objLength = function (o) {
		if (!o) return 0;
		var i = 0;
		for (var p in o) {
			i++;
		}
		return i;
	};
	
	/**
	 * Given a dot notation string, we want to navigate to the location
	 * in a base object, creating the path along the way
	 * @param  {object} base      Base object.
	 * @param  {string} extension String in dot notation
	 * @return {object}           A tuple containing obj and member
	 * @memberof CIQ
	 * @since  2015-11-1
	 * @example
	 * var tuple=CIQ.deriveFromObjectChain(stx.layout, "pandf.box");
	 * tuple.obj===stx.layout.pandf
	 * tuble.member==="box"
	 * tuple.obj[tuple.member]=3;  // stx.layout.pandf.box=3
	 */
	CIQ.deriveFromObjectChain = function (base, extension) {
		// Which way is faster?
		//if(!(new RegExp(extension)).test(".")){
		if (extension.indexOf(".") == -1) {
			return { obj: base, member: extension };
		}
		var objectString = extension.split(".");
		for (var i = 0; i < objectString.length - 1; i++) {
			var objStr = objectString[i];
			if (!base[objStr] && base[objStr] !== 0) base[objStr] = {};
			base = base[objStr];
		}
		return { obj: base, member: objectString[i] };
	};
	
	/**
	 * Create arrow notation strings (field-->property) of a given field and an array of properties
	 * Used to create a set of object properties in string format for later use by CIQ.existsInObjectChain
	 * Its main use is to pass field names into {@link CIQ.ChartEngine#determineMinMax}.
	 * @param  {string} field      Base object.
	 * @param  {array} properties 	Array of strings representing properties
	 * @return {array}           Array of object properties expressed in arrow notation (field-->property)
	 * @memberof CIQ
	 * @since  5.1.0
	 * @example
	 * var fields=CIQ.createObjectChainNames("ABC.D",["High","Low"]);
	 * fields===["ABC.D-->High","ABC.D-->Low"]
	 */
	CIQ.createObjectChainNames = function (field, properties) {
		var ret = [];
		for (var p = 0; p < properties.length; p++) {
			ret.push(field + "-->" + properties[p]);
		}
		return ret;
	};
	
	/**
	 * Given an arrow notation string (a-->b-->c), we want to navigate to the location
	 * in a base object, to see if it exists
	 * @param  {object} base      Base object.
	 * @param  {string} extension String in arrow notation
	 * @return {object}           A tuple containing obj and member; a null will be returned if path does not exist
	 * @memberof CIQ
	 * @since  5.1.0
	 * @example
	 * var tuple=CIQ.existsInObjectChain(stx.dataSegment[0], "ABC.D-->High");
	 * tuple.obj===stx.dataSegment[0]["ABC.D"]
	 * tuple.member==="High"
	 * tuple.obj[tuple.member]=28.7;  // stx.dataSegment[0]["ABC.D"].High=28.7
	 */
	CIQ.existsInObjectChain = function (base, extension) {
		// Which way is faster?
		//if(!(new RegExp(extension)).test(".")){
		if (extension.indexOf("-->") == -1) {
			if (!base[extension] && base[extension] !== 0) return null;
			return { obj: base, member: extension };
		}
		var objectString = extension.split("-->");
		var objStr;
		for (var i = 0; i < objectString.length - 1; i++) {
			objStr = objectString[i];
			if (!base[objStr] && base[objStr] !== 0) return null;
			base = base[objStr];
		}
		objStr = objectString[i];
		if (!base[objStr] && base[objStr] !== 0) return null;
		return { obj: base, member: objStr };
	};
	
	/**
	 * Replacement for isPrototypeOf and instanceof so that both types of inheritance can be checked
	 * @param {object} child The object instance to check
	 * @param {object} parent Prototype
	 * @return {boolean} True if the object is derived from the parent
	 * @memberof CIQ
	 * @since 07/01/2015
	 */
	CIQ.derivedFrom = function (child, parent) {
		if (parent.isPrototypeOf(child)) return true;
		if (child instanceof parent) return true;
		return false;
	};
	
	/**
	 * This method will iterate through the object and replace all of the fields
	 * using the mapping object. This would generally be used to compress an object
	 * for serialization. so that for instance "lineWidth" becomes "lw". This method
	 * is called recursively.
	 * @param {object} obj Object to compress
	 * @param {object} mapping Object containing name value pairs. Each name will be replaced with its corresponding value in the object.
	 * @return {object} The newly compressed object
	 * @memberof CIQ
	 */
	CIQ.replaceFields = function (obj, mapping) {
		if (!obj) return obj;
		var newObj = {};
		for (var field in obj) {
			var value = obj[field];
			var replaced = mapping[field];
			if (!replaced) replaced = field;
			if (value && typeof value == "object") {
				if (value.constructor == Array) {
					var arr = (newObj[replaced] = new Array(value.length));
					for (var i = 0; i < arr.length; i++) {
						var val = value[i];
						if (typeof val == "object") {
							arr[i] = CIQ.replaceFields(val, mapping);
						} else {
							arr[i] = val;
						}
					}
				} else {
					newObj[replaced] = CIQ.replaceFields(value, mapping);
				}
			} else {
				newObj[replaced] = value;
			}
		}
		return newObj;
	};
	
	/**
	 * Returns an object copy with any null values removed
	 * @param  {object} obj Object to remove nulls
	 * @return {object}     Object with nulls removed
	 * @memberof CIQ
	 */
	CIQ.removeNullValues = function (obj) {
		var n = CIQ.clone(obj);
		for (var f in n) {
			if (!n[f]) delete n[f];
		}
		return n;
	};
	
	/**
	 * This method reverses the fields and values in an object
	 * @param {object} obj Object to reverse
	 * @return {object} The reversed object
	 * @memberof CIQ
	 * @example reverseObject({ one: "a", two: "b" }) // returns { a: "one", b: "two" }
	 */
	CIQ.reverseObject = function (obj) {
		var newObj = {};
		for (var field in obj) {
			newObj[obj[field]] = field;
		}
		return newObj;
	};
	
	/**
	 * Accesses a property, method, or array in a namespace.
	 *
	 * Approximates optional chaining, checking whether the object at the end of `namespace` +
	 * `path` exists before returning it.
	 *
	 * @param {object} namespace Namespace to access.
	 * @param {string} path String in dot notation representing extension of the namespace to a
	 * 		desired property, method, or array.
	 * @param {*} [defaultValue] The value returned if the requested expression does not exist.
	 * 		If the requested expression is a function, set `defaultValue` to a function (usually
	 * 		`function(){}`) that can be run with any required arguments. If the requested
	 * 		expression is an array, set `defaultValue` to a default array, usually `[]`.
	 * @return {*} The expression sought by combining the namespace and path. If the expression
	 * 		does not exist, returns `defaultValue` (if provided), otherwise returns `undefined`.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 *
	 * @example
	 * // Accesses CIQ.Studies.studyLibrary.rsi if safe to do so (if exists).
	 * CIQ.getFromNS(CIQ.Studies, "studyLibrary.rsi");
	 * // or
	 * CIQ.getFromNS(CIQ, "Studies.studyLibrary.rsi");
	 *
	 * @example
	 * // Accesses Math.Matrix.ScalarOperations.dotProduct(mA, mB) if safe to do so (if exists).
	 * // Returns 12 if Math.Matrix.ScalarOperations.dotProduct does not exist.
	 * CIQ.getFromNS(Math, "Matrix.ScalarOperations.dotProduct", (a,b)=>a*b)(3, 4);
	 */
	CIQ.getFromNS = (namespace, path, defaultValue) => {
		if (namespace) {
			var base = namespace,
				objectString = path.split(".");
			for (var i = 0; i < objectString.length; i++) {
				var objStr = objectString[i];
				if (typeof base[objStr] === "undefined") break;
				base = base[objStr];
			}
			if (i === objectString.length) return base;
		}
		return undefined || defaultValue;
	};
	
	/**
	 * Curried {@link CIQ.getFromNS} expecting a function to be returned if `obj` + `path` is not
	 * found.
	 *
	 * @param {object} obj Namespace to access.
	 * @param {string} path String in dot notation representing extension of the namespace to
	 * 		the desired function.
	 * @param {*} [defaultValue] The value returned if the requested function does not exist.
	 * @return {function} The function sought by combining the namespace and path. If the
	 * 		function does not exist, returns `function(){return defaultValue;}`.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 *
	 * @example
	 * // Invokes Math.Matrix.ScalarOperations.dotProduct with arguments (mA, mB) if safe to do so (if exists).
	 * // Assigns NaN to the result if Math.Matrix.ScalarOperations.dotProduct does not exist.
	 * let result=getFnFromNS(Math, "Matrix.ScalarOperations.dotProduct", NaN)(mA, mB);
	 */
	CIQ.getFnFromNS = (obj, path, defaultValue) => {
		return CIQ.getFromNS(obj, path, function () {
			return defaultValue;
		}); // use `function` to allow `new (CIQ.getFromNS())(...) syntax
	};
	
	/**
	 * Curried {@link CIQ.getFromNS} expecting the namespace to be {@link CIQ}.
	 *
	 * @param {string} path String in dot notation representing extension of the {@link CIQ}
	 * 		namespace to a desired property, method, or array.
	 * @param {*} [defaultValue] The value returned if the requested expression does not exist.
	 * 		If the requested expression is a function, set `defaultValue` to a function (usually
	 * 		`function(){}`) that can be run with any required arguments. If the requested
	 * 		expression is an array, set `defaultValue` to a default array, usually `[]`.
	 * @return {*} The expression sought by combining the {@link CIQ} namespace and the path. If
	 * 		the expression does not exist, returns `defaultValue` (if provided), otherwise returns
	 * 		undefined.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 *
	 * @example
	 * // Accesses CIQ.Studies.studyLibrary.rsi if safe to do so (if exists).
	 * CIQ.get("Studies.studyLibrary.rsi");
	 * // Returns null if CIQ.Studies.studyLibrary.rsi does not exist.
	 * CIQ.get("Studies.studyLibrary.rsi", null);
	 */
	CIQ.get = (path, defaultValue) => {
		return CIQ.getFromNS(CIQ, path, defaultValue);
	};
	
	/**
	 * Curried {@link CIQ.getFromNS} expecting the namespace to be {@link CIQ} and a function to be
	 * returned.
	 *
	 * @param {string} path String in dot notation representing extension of the {@link CIQ}
	 * 		namespace to the desired function.
	 * @param {*} [defaultValue] The value returned if the requested function does not exist.
	 * @return {function} The function sought by combining the {@link CIQ} namespace and the path.
	 * 		If the function does not exist, returns `function(){return defaultValue;}`.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 *
	 * @example
	 * // Returns the function if safe to do so (if exists).
	 * // Assigns "error" to the result if CIQ.Studies.removeStudy does not exist.
	 * getFn("Studies.removeStudy", "error");
	 */
	CIQ.getFn = (path, defaultValue) => {
		return CIQ.getFromNS(CIQ, path, function () {
			return defaultValue;
		}); // use `function` to allow `new (CIQ.getFromNS())(...) syntax
	};
	
	};
	
	
	let __js_core_plotter_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * The Plotter is a device for managing complex drawing operations on the canvas. The HTML 5 canvas performs better when drawing
	 * operations of the same color are batched (reducing the number of calls to the GPU). The plotter allows a developer to store those
	 * operations in a normal control flow, and then have the Plotter deliver the primitives to the canvas. The plotter can also be used
	 * as a caching mechanism for performing the same operations repeatedly. The y-axis of the chart uses this mechanism to boost performance.
	 * @constructor
	 * @name  CIQ.Plotter
	 */
	CIQ.Plotter = function () {
		this.seriesArray = [];
		this.seriesMap = {};
	};
	
	CIQ.extend(
		CIQ.Plotter.prototype,
		{
			/**
			 * Define a series to plot. A series is a specific color and referenced by name
			 * @param {string} name         Name of series
			 * @param {boolean} strokeOrFill If true then a stroke operation, otherwise a fill operation
			 * @param {string} color        A valid canvas color
			 * @param {number} [opacity=1]      A valid opacity from 0-1
			 * @param {number} [width=1]      A valid lineWidth from 1
			 * @param {string} [pattern=solid]      A valid pattern (solid, dotted, dashed)
			 * @memberof CIQ.Plotter#
			 * @since 4.0.0 added parameter pattern
			 */
			Series: function (name, strokeOrFill, color, opacity, width, pattern) {
				this.name = name;
				this.strokeOrFill = strokeOrFill;
				this.color = color;
				this.moves = [];
				this.text = [];
				if (!opacity || opacity > 1 || opacity < 0) opacity = 1;
				this.opacity = opacity;
				if (!width || width > 25 || width < 1) width = 1;
				this.width = width;
				this.pattern = CIQ.borderPatternToArray(width, pattern);
			},
			/**
			 * Create a series. This supports either a text color or CIQ.ChartEngine.Style object
			 * @see  CIQ.Plotter.Series
			 * @memberof CIQ.Plotter#
			 * @param {string} name Name of series
			 * @param {boolean} strokeOrFill If true then a stroke operation, otherwise a fill operation
			 * @param {object|string} colorOrStyle Color or object containing color, opacity, width, borderTopStyle (solid, dotted, dashed)
			 * @param {number} [opacity] A valid opacity from 0-1
			 * @param {number} [width=1] A valid lineWidth from 1
			 */
			newSeries: function (name, strokeOrFill, colorOrStyle, opacity, width) {
				var series;
				if (colorOrStyle.constructor == String)
					series = new this.Series(
						name,
						strokeOrFill,
						colorOrStyle,
						opacity,
						width
					);
				else
					series = new this.Series(
						name,
						strokeOrFill,
						colorOrStyle.color,
						colorOrStyle.opacity,
						width >= 0 ? width : CIQ.stripPX(colorOrStyle.width),
						colorOrStyle.borderTopStyle
					);
				this.seriesArray.push(series);
				this.seriesMap[name] = series;
			},
			/**
			 * Clear out any moves or text stored in the plotter for series "name"
			 * @memberof CIQ.Plotter#
			 * @param {string} name Name of series to reset.  If omitted, will reset all series in plotter.
			 * @since 3.0.0
			 */
			reset: function (name) {
				for (var s in this.seriesMap) {
					if (name && name != s) continue;
					var series = this.seriesMap[s];
					if (series) {
						series.moves = [];
						series.text = [];
					}
				}
			},
			/**
			 * @param {string} name Name of series
			 * @param {number} x
			 * @param {number} y
			 * @memberof CIQ.Plotter#
			 */
			moveTo: function (name, x, y) {
				var series = this.seriesMap[name];
				series.moves.push({ action: "moveTo", x: x, y: y });
			},
			/**
			 * @param {string} name Name of series
			 * @param {number} x
			 * @param {number} y
			 * @memberof CIQ.Plotter#
			 */
			lineTo: function (name, x, y) {
				var series = this.seriesMap[name],
					pattern = series.pattern;
				series.moves.push({ action: "lineTo", x: x, y: y, pattern: pattern });
			},
			/**
			 * @param {string} name Name of series
			 * @param {number} x
			 * @param {number} y
			 * @param {string} pattern A valid pattern (solid, dotted, dashed)
			 * @memberof CIQ.Plotter#
			 */
			dashedLineTo: function (name, x, y, pattern) {
				var series = this.seriesMap[name];
				series.moves.push({ action: "lineTo", x: x, y: y, pattern: pattern });
			},
			/**
			 * @param {string} name Name of series
			 * @param {number} cx0 Control point x-coord
			 * @param {number} cy0 Control point y-coord
			 * @param {number} x
			 * @param {number} y
			 * @memberof CIQ.Plotter#
			 */
			quadraticCurveTo: function (name, cx0, cy0, x, y) {
				var series = this.seriesMap[name],
					pattern = series.pattern;
				series.moves.push({
					action: "quadraticCurveTo",
					x0: cx0,
					y0: cy0,
					x: x,
					y: y,
					pattern: pattern
				});
			},
			/**
			 * @param {string} name Name of series
			 * @param {number} cx0 First control point x-coord
			 * @param {number} cy0 First control point y-coord
			 * @param {number} cx1 Second control point x-coord
			 * @param {number} cy1 Second control point x-coord
			 * @param {number} x
			 * @param {number} y
			 * @memberof CIQ.Plotter#
			 * @since 4.0.0
			 */
			bezierCurveTo: function (name, cx0, cy0, cx1, cy1, x, y) {
				var series = this.seriesMap[name],
					pattern = series.pattern;
				series.moves.push({
					action: "bezierCurveTo",
					x0: cx0,
					y0: cy0,
					x1: cx1,
					y1: cy1,
					x: x,
					y: y,
					pattern: pattern
				});
			},
			/**
			 * Add text to be rendered with the drawing. Primarily used when the Plotter is used for caching since there is no
			 * performance benefit from batching text operations to the GPU. If specifying a bounding box, textBaseline="middle" is assumed
			 * @param {string} name Name of series
			 * @param {string} text The raw text to render
			 * @param {number} x    X position on canvas for text
			 * @param {number} y    Y position on canvas for text
			 * @param {string} [backgroundColor] Color to use on the box underneath the text
			 * @param {number} [width]  Width of bounding box
			 * @param {number} [height] Height of bounding box
			 * @memberof CIQ.Plotter#
			 */
			addText: function (name, text, x, y, backgroundColor, width, height) {
				var series = this.seriesMap[name];
				series.text.push({ text: text, x: x, y: y, bg: backgroundColor });
			},
			/**
			 * Renders the text objects. This is done after drawing primitives for each series.
			 * @private
			 * @memberof CIQ.Plotter#
			 */
			drawText: function (context, series) {
				for (var i = 0; i < series.text.length; i++) {
					var textObj = series.text[i];
					if (textObj.bg) {
						var w = textObj.width
							? textObj.width
							: context.measureText(textObj.text).width;
						var h = textObj.height ? textObj.height : 12;
						var prev = context.fillStyle;
						context.fillStyle = textObj.bg;
						if (context.textAlign == "right") {
							context.fillRect(textObj.x, textObj.y - h / 2, -w, -h);
						} else {
							context.fillRect(textObj.x, textObj.y - h / 2, w, h);
						}
						context.fillStyle = prev;
					}
					context.fillText(textObj.text, textObj.x, textObj.y);
				}
			},
			/**
			 * Render the plotter. All of the stored operations are sent to the canvas. This operation stores and restores
			 * global canvas parameters such as fillStyle, strokeStyle and globalAlpha.
			 * @param  {object} context A valid HTML canvas context
			 * @param  {string} [name]    Optionally render only a specific series. If null or not provided then all series will be rendered.
			 * @memberof CIQ.Plotter#
			 */
			draw: function (context, name) {
				var prevWidth = context.lineWidth;
				var prevFillStyle = context.fillStyle;
				var prevStrokeStyle = context.strokeStyle;
				var prevGlobalAlpha = context.globalAlpha;
				for (var i = 0; i < this.seriesArray.length; i++) {
					var series = this.seriesArray[i];
					if (name && series.name != name) continue;
					context.beginPath();
					context.lineWidth = series.width;
					context.globalAlpha = series.opacity;
					context.fillStyle = series.color;
					context.strokeStyle = series.color;
					context.save();
					for (var j = 0; j < series.moves.length; j++) {
						var move = series.moves[j];
						if (move.pattern) {
							context.setLineDash(move.pattern);
							context.lineDashOffset = 0;
						} else context.setLineDash([]);
						if (move.action == "quadraticCurveTo") {
							context[move.action](move.x0, move.y0, move.x, move.y);
						} else if (move.action == "bezierCurveTo") {
							context[move.action](
								move.x0,
								move.y0,
								move.x1,
								move.y1,
								move.x,
								move.y
							);
						} else {
							context[move.action](move.x, move.y);
						}
					}
					if (series.strokeOrFill == "fill") {
						context.fill();
					} else {
						context.stroke();
					}
					context.closePath();
					context.restore();
					this.drawText(context, series);
					context.lineWidth = 1;
				}
				context.lineWidth = prevWidth;
				context.fillStyle = prevFillStyle;
				context.strokeStyle = prevStrokeStyle;
				context.globalAlpha = prevGlobalAlpha;
			}
		},
		true
	);
	
	};
	
	
	let __js_core_renderer_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Base class for Renderers.
	 *
	 * A renderer is used to draw a complex visualization based on one or more "series" of data.
	 * Renderers only need to be attached to a chart once. You can change symbols and continue using the same renderer.
	 * The series associated with a renderer may change at any time, but the linked renderer itself remains the vehicle for display them.
	 *
	 * Series are associated with renderers by calling attachSeries().
	 * More typically though, this is done automatically when {@link CIQ.ChartEngine#addSeries} is used.
	 * The parameters for addSeries() are passed both to the renderer's constructor and also to attachSeries().
	 *
	 * To manually create a renderer use {@link CIQ.ChartEngine#setSeriesRenderer}
	 *
	 * @name  CIQ.Renderer
	 * @constructor
	 */
	CIQ.Renderer = function () {};
	
	/**
	 * Factory for renderer.
	 *
	 * Will request a renderer from each renderer subclass until it is given one.
	 * @param  {string} chartType Chart type name (usually from layout.chartType)
	 * @param  {object} [params] Parameters to pass to the renderer constructor
	 * @memberof CIQ.Renderer
	 * @since 5.1.0
	 * @private
	 */
	CIQ.Renderer.produce = function (chartType, params) {
		var renderer = null;
		if (chartType) {
			for (var r in CIQ.Renderer) {
				var rendererType = CIQ.Renderer[r];
				// Note: chartType has often been a combination of attributes connected with an underscore,
				// e.g. colored_bar, baseline_mountain.  So we split this legacy name to get the attributes.
				if (rendererType.requestNew)
					renderer = rendererType.requestNew(chartType.split("_"), params);
				if (renderer) return renderer;
			}
		}
		params.type = "line";
		return new CIQ.Renderer.Lines({ params: params });
	};
	
	CIQ.Renderer.colorFunctions = {};
	/**
	 * Registers a colorFunction for use with a renderer.
	 *
	 * It is necessary to register a color function if you want the function to be tied back to an imported renderer.
	 * @param  {string} name The name of the registered function
	 * @param  {function} funct The function to register
	 * @memberof CIQ.Renderer
	 */
	CIQ.Renderer.registerColorFunction = function (name, funct) {
		CIQ.Renderer.colorFunctions[name] = funct;
	};
	
	/**
	 * Unregisters a colorFunction for use with a renderer.
	 *
	 * @param  {string} name The name of the registered function
	 * @memberof CIQ.Renderer
	 */
	CIQ.Renderer.unregisterColorFunction = function (name) {
		delete CIQ.Renderer.colorFunctions[name];
	};
	
	/**
	 * If your renderer manages a yAxis then the necessary adjustments to its properties should be made here.
	 *
	 * @memberof CIQ.Renderer
	 * @since 5.2.0
	 */
	CIQ.Renderer.prototype.adjustYAxis = function () {};
	
	/**
	 * Perform drawing operations here.
	 * @memberof CIQ.Renderer
	 */
	CIQ.Renderer.prototype.draw = function () {};
	
	/**
	 * Draws one series from the renderer.
	 *
	 * Called by {@link CIQ.ChartEngine.AdvancedInjectable#drawSeries}
	 * @param  {CIQ.ChartEngine.Chart} chart The chart object to draw the renderers upon
	 * @param {object} [parameters] Parameters used to draw the series, depends on the renderer type
	 * @param {string} [parameters.panel] Name of panel to draw the series upon
	 * @memberof CIQ.Renderer
	 * @since 5.1.0
	 */
	CIQ.Renderer.prototype.drawIndividualSeries = function (chart, parameters) {};
	
	/**
	 * Default constructor for a renderer. Override this if desired.
	 * @param {object} config Configuration for the renderer.
	 * @param {function} [config.callback] Callback function to perform activity post-drawing, for example, creating a legend. It will be called with an object containing the list of instruments and corresponding colors.
	 * @param {string} [config.id] Handle to access the rendering in the future.  If not provided, one will be generated.
	 * @param {object} [config.params] Parameters to control the renderer itself
	 * @param {string} [config.params.name="Data"] Name of the renderer. This is used when displaying error message on screen
	 * @param {string} [config.params.panel="chart"] The name of the panel to put the rendering on.
	 * @param {boolean} [config.params.overChart=true] If set to false, will draw the rendering behind the main chart rather than over it. By default rendering will be as overlay on the main chart.
	 * @param {boolean} [config.params.yAxis] Y-axis object to use for the series.
	 * @param {number} [config.params.opacity=1] Opacity of the rendering as a whole.  Can be overridden by an opacity set for a series.  Valid values are 0.0-1.0. <br><b>Not applicable on [Lines]{@link CIQ.Renderer.Lines} with a `type` of `mountain`; use an "RGBA" color instead.</b>
	 * @param {object} [config.params.binding] Allows the use of the study output colors within the renderer. See an example in the [Using Renderers to Display Study Output](tutorial-Using%20and%20Customizing%20Studies%20-%20Creating%20New%20Studies.html#Using_Renderers) section of the Studies tutorial.
	 * @memberof CIQ.Renderer
	 * @since 5.2.0 `config.params.binding` parameter added.
	 * @example
	 *	// add multiple series and attach to a custom y-axis on the left.
	 *	// See this example working here : https://jsfiddle.net/chartiq/b6pkzrad
	 *
	 *	// note how the addSeries callback is used to ensure the data is present before the series is displayed
	 *
	 *	//create the custom axis
	 *	var axis=new CIQ.ChartEngine.YAxis();
	 *	axis.position="left";
	 *	axis.textStyle="#FFBE00";
	 *	axis.decimalPlaces=0;			// no decimal places on the axis labels
	 *	axis.maxDecimalPlaces=0;		// no decimal places on the last price pointer
	 *
	 *	//create the renderer
	 *	var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params:{name:"my-renderer", type:"mountain", yAxis:axis}}));
	 *
	 *	// create your series and attach them to the chart when the data is loaded.
	 *	stxx.addSeries("NOK", {display:"NOK",width:4},function(){
	 *		renderer.attachSeries("NOK", "#FFBE00").ready();
	 *	});
	 *
	 *	stxx.addSeries("SNE", {display:"Sony",width:4},function(){
	 *		renderer.attachSeries("SNE", "#FF9300").ready();
	 *	});
	 */
	CIQ.Renderer.prototype.construct = function (config) {
		if (!config) config = {};
		var params = config.params ? config.params : {};
		if (!params.name) params.name = CIQ.uniqueID();
		if (!params.heightPercentage) params.heightPercentage = 0.7;
		if (!params.opacity) params.opacity = 1;
		if (params.highlightable !== false) params.highlightable = true;
		if (!params.panel) params.panel = "chart";
		if (params.yAxis) {
			params.yAxis = new CIQ.ChartEngine.YAxis(params.yAxis);
			if (!params.yAxis.name) params.yAxis.name = params.name;
		}
		this.cb = config.callback;
		this.params = params;
		this.seriesParams = [];
		this.caches = {};
		this.colors = {};
	};
	
	/**
	 * Attach a series to the renderer.
	 *
	 * This assumes that the series data *is already in the dataSet* and simply connects it to the renderer with the specified parameters.
	 * See {@link CIQ.ChartEngine#addSeries} for details on how to create a series.
	 *
	 * Any parameters defined when attaching a series, such as colors, will supersede any defined when a series was created. This allows you to attach the same series to multiple renderers, each rendering displaying the same series data in a different color, for example.
	 *
	 * @param  {string} id      The name of the series.
	 * @param  {object} parameters Settings to control color and opacity of <B>each</B> series in the group. See {@link CIQ.ChartEngine#addSeries} for implementation examples. <P>Argument format can be:<ul><li> a `string` containing the color</li><li> or a more granular `object` having the following members:</li></ul>
	 * @param  {string} [parameters.field] The name of the field. Name of the field in the dataSet to use for the series.  If omitted, defaults to id
	 * @param  {string} [parameters.fill_color_up] Color to use to fill the part when the Close is higher than the previous (or 'transparent' to not display)
	 * @param  {string} [parameters.border_color_up] Color to use to draw the border when the Close is higher than the previous (or 'transparent' to not display)
	 * @param  {number} [parameters.opacity_up=.4] Opacity to use to fill the part when the Close is higher than the previous (0.0-1.0)
	 * @param  {string} [parameters.border_color_even] Color to use to draw the border when the Close is equal to the previous (or 'transparent' to not display)
	 * @param  {string} [parameters.fill_color_down] Color to use to fill the part when the Close is lower than the previous (or 'transparent' to not display)
	 * @param  {string} [parameters.border_color_down] Color to use to draw the border when the Close is lower than the previous (or 'transparent' to not display)
	 * @param  {number} [parameters.opacity_down=.4] Opacity to use to fill the part when the Close is lower than the previous (0.0-1.0)
	 * @param  {string} [parameters.color] Color to use to fill the series in the absence of specific up/down color.
	 * @param  {string} [parameters.border_color] Color to use to draw the border in the series in the absence of specific up/down color.
	 * @param  {string} [parameters.fillStyle] Color to use to fill the mountain chart.
	 * @param  {string} [parameters.baseColor] Color to use at the bottom of the mountain chart, will create a gradient with bgColor
	 * @param  {string} [parameters.bgColor] Color to use at the top of the mountain chart, will create a gradient if baseColor is specified.  Otherwise, will fill the mountain solid with this color unless fillStyle is specified
	 * @param  {boolean} [parameters.permanent] Whether the attached series can be removed by the user (lines and bars only). By default the series will not be permanent. This flag (including the default) will supersede the permanent flag of the actual series. As such, a series will not be permanent unless you set this flag to 'true', even if the series being attached was flaged set as permanent when defined. This gives the renderer most control over the rendering process.
	 * @return {CIQ.Renderer}            Returns a copy of this for chaining
	 * @since 5.1.0 Added `fillStyle`, `baseColor`, and `bgColor` parameters.
	 * @memberof CIQ.Renderer
	 * @example
	 *	// add multiple series and attach to a custom y-axis on the left.
	 *	// See this example working here : https://jsfiddle.net/chartiq/b6pkzrad
	 *
	 *	// note how the addSeries callback is used to ensure the data is present before the series is displayed
	 *
	 *	//create the custom axis
	 *	var axis=new CIQ.ChartEngine.YAxis();
	 *	axis.position="left";
	 *	axis.textStyle="#FFBE00";
	 *	axis.decimalPlaces=0;			// no decimal places on the axis labels
	 *	axis.maxDecimalPlaces=0;		// no decimal places on the last price pointer
	 *
	 *	//create the renderer
	 *	var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params:{name:"my-renderer", type:"mountain", yAxis:axis}}));
	 *
	 *	// create your series and attach them to the chart when the data is loaded.
	 *	stxx.addSeries("NOK", {display:"NOK",width:4},function(){
	 *		renderer.attachSeries("NOK", "#FFBE00").ready();
	 *	});
	 *
	 *	stxx.addSeries("SNE", {display:"Sony",width:4},function(){
	 *		renderer.attachSeries("SNE", "#FF9300").ready();
	 *	});
	 */
	CIQ.Renderer.prototype.attachSeries = function (id, parameters) {
		var stx = this.stx;
		if (!stx) return this;
		var series = stx.chart.series[id];
		if (!series) series = { parameters: {} };
		var rParams = this.params,
			sParams = series.parameters;
		var sp = {
			id: id,
			chartType: rParams.type,
			display: sParams.display,
			border_color_up: rParams.defaultBorders ? "auto" : null,
			fill_color_up: sParams.color,
			opacity_up: rParams.opacity,
			border_color_down: rParams.defaultBorders ? "auto" : null,
			fill_color_down: sParams.color,
			opacity_down: rParams.opacity,
			color: sParams.color,
			symbol: sParams.symbol,
			symbolObject: CIQ.clone(sParams.symbolObject)
		};
		if (typeof parameters == "string") {
			sp.color = sp.fill_color_down = sp.fill_color_up = parameters;
		} else if (typeof parameters == "object") {
			for (var p in parameters) sp[p] = parameters[p];
			var c = sp.color,
				bc = sp.border_color;
			if (c) {
				if (!sp.fill_color_up) sp.fill_color_up = c;
				if (!sp.fill_color_down) sp.fill_color_down = c;
				if (!sp.fill_color_even) sp.fill_color_even = c;
			}
			if (bc) {
				if (!sp.border_color_up) sp.border_color_up = bc;
				if (!sp.border_color_down) sp.border_color_down = bc;
				if (!sp.border_color_even) sp.border_color_even = bc;
			}
		}
		if (sp.symbol && sp.field != sp.symbol) {
			sp.subField = sp.field;
			sp.field = sp.symbol;
		}
		//if(!sp.symbol && !sp.field && !this.highLowBars) sp.field="Close";
		if (!sp.id) sp.id = CIQ.uniqueID();
	
		var i = 0;
		for (; i < this.seriesParams.length; ++i) {
			if (this.seriesParams[i].id === sp.id) {
				this.removeSeries(sp.id, true);
				break;
			}
		}
		this.seriesParams.splice(i, 0, sp);
	
		if (sp.fill_color_up != sp.fill_color_down) {
			this.colors[id + " up"] = {
				color: sp.fill_color_up,
				opacity: sp.opacity_up,
				display: sp.display ? sp.display + " up" : id + " up"
			};
			this.colors[id + " dn"] = {
				color: sp.fill_color_down,
				opacity: sp.opacity_down,
				display: sp.display ? sp.display + " down" : id + " down"
			};
		} else {
			this.colors[id] = {
				color: sp.fill_color_up,
				opacity: sp.opacity_up,
				display: sp.display ? sp.display : id
			};
		}
	
		var panelName = rParams.panel;
		if (!stx.panels[panelName]) {
			var yAxis = rParams.yAxis;
			if (!yAxis) {
				yAxis = new CIQ.ChartEngine.YAxis();
				yAxis.needsInitialPadding = true;
			}
			yAxis.name = panelName;
			stx.createPanel(panelName, panelName, null, null, yAxis);
		} else {
			if (rParams.yAxis) {
				rParams.yAxis = stx.addYAxis(stx.panels[panelName], rParams.yAxis);
				rParams.yAxis.needsInitialPadding = true;
				sParams.yAxis = rParams.yAxis;
				stx.resizeChart();
			} else if (sp.yAxis) {
				rParams.yAxis = sp.yAxis;
			}
		}
	
		return this;
	};
	
	/**
	 * Removes a series from the renderer.
	 *
	 * The yAxis and actual series data will also be removed if no longer used by any other renderers.
	 * When the last series is removed from the renderer, the chart it is attached to will remove the renderer.
	 * Will [turn off comparison mode]{@link CIQ.ChartEngine#setComparison} if there are no more comparisons on the chart if {@link CIQ.ChartEngine.Chart#forcePercentComparison} is true.
	 * @param  {string} id          The field name of the series.
	 * @param  {boolean} [preserveSeries=false] Set to `true` to keep the series data in the CIQ.ChartEngine objects, otherwise it iwll be deleted if no
	 * @return {CIQ.Renderer}                A copy of this for chaining
	 * @memberof CIQ.Renderer
	 * @since
	 * - 2015-07-01 'preserveSeries' is now available.
	 * - 3.0.0 Series is now removed even if series parameter `permanent` is set to true. The permanent parameter only prevents right click user interaction and not programmatically requested removals.
	 * - 4.0.0 Series data is now totally removed from masterData if no longer used by any other renderers.
	 * - 6.2.0 No longer force 'percent'/'linear', when adding/removing comparison series, respectively, unless {@link CIQ.ChartEngine.Chart#forcePercentComparison} is true. This allows for backwards compatibility with previous UI modules.
	 */
	CIQ.Renderer.prototype.removeSeries = function (id, preserveSeries) {
		var spliceIndex = null,
			comparing = false;
		var stx = this.stx,
			chart = stx.chart;
		for (var r in chart.seriesRenderers) {
			var renderer = chart.seriesRenderers[r];
			for (var sp = 0; sp < renderer.seriesParams.length; sp++) {
				var seriesParams = renderer.seriesParams[sp];
				if (seriesParams.id == id && this === renderer) spliceIndex = sp;
				else if (
					seriesParams.isComparison &&
					seriesParams.panel == chart.panel.name &&
					(!seriesParams.yAxis || seriesParams.yAxis == chart.yAxis)
				)
					comparing = true;
			}
		}
		if (spliceIndex !== null) {
			if (
				chart.forcePercentComparison &&
				!comparing &&
				this.seriesParams[spliceIndex].isComparison &&
				stx.layout.chartScale != "linear"
			) {
				stx.setChartScale();
			}
			this.seriesParams.splice(spliceIndex, 1);
		}
	
		delete this.colors[id + " up"];
		delete this.colors[id + " dn"];
		delete this.colors[id];
	
		if (!preserveSeries) {
			//if(!stx.chart.series[id] || !stx.chart.series[id].parameters.permanent){
			var seriesInUse;
			for (var plot in chart.seriesRenderers) {
				var myPlot = chart.seriesRenderers[plot];
				for (var s = 0; s < myPlot.seriesParams.length; s++) {
					if (myPlot.seriesParams[s].id == id) {
						seriesInUse = true;
						break;
					}
					seriesInUse = false;
				}
				if (seriesInUse) break;
			}
			if (seriesInUse === false || spliceIndex !== null) {
				stx.deleteSeries(id, chart);
			}
			//}
		}
		stx.deleteYAxisIfUnused(stx.panels[this.params.panel], this.params.yAxis);
		stx.resizeChart();
		stx.layout.symbols = stx.getSymbols({
			"include-parameters": true,
			"exclude-studies": true
		});
		stx.changeOccurred("layout");
		return this;
	};
	
	/**
	 * Modifies the renderer parameters.
	 *
	 * Use this function to trigger side effects from modifying parameters instead of manually
	 * updating the parameters.
	 *
	 * @param {object} parameters Specifies the renderer parameters to be updated.
	 *
	 * @memberof CIQ.Renderer
	 * @private
	 * @since 8.2.0
	 */
	CIQ.Renderer.prototype.modifyRenderer = function (parameters) {
		const original = this.params;
		let { stx } = this;
	
		for (let param in parameters) {
			const value = parameters[param];
			switch (param) {
				case "baseline":
					if (value) {
						if (typeof value === "object") {
							this.params.baseline = CIQ.ensureDefaults(
								value,
								CIQ.ChartEngine.Chart.prototype.baseline
							);
						}
						stx.registerBaselineToHelper(this);
					} else {
						stx.removeBaselineFromHelper(this);
					}
					break;
	
				case "type":
					this.params.type = value;
					break;
				case "style":
					this.params.style = value;
					break;
				default:
					break;
			}
		}
	};
	
	/**
	 * Returns an array of all renderers that depend on a given renderer.
	 *
	 * A dependent renderer is one that has `params.dependentOf` set to another renderer's name.
	 *
	 * @param {CIQ.ChartEngine} stx A chart object.
	 * @return {array} Array of dependent renderers.
	 * @memberof CIQ.Renderer
	 * @since 7.3.0
	 */
	CIQ.Renderer.prototype.getDependents = function (stx) {
		var dependents = [];
		for (var r in stx.chart.seriesRenderers) {
			var renderer = stx.chart.seriesRenderers[r];
			if (renderer.params.dependentOf == this.params.name)
				dependents.push(renderer);
		}
		return dependents;
	};
	
	/**
	 * Returns whether the renderer can be dragged to another axis or panel.
	 *
	 * @param  {CIQ.ChartEngine} stx A chart object.
	 * @return  {boolean} true, if not allowed to drag.
	 * @memberof CIQ.Renderer
	 * @since 7.3.0
	 */
	CIQ.Renderer.prototype.undraggable = function (stx) {
		if (this == stx.mainSeriesRenderer) return true;
		return this.params.dependentOf == stx.mainSeriesRenderer.params.name;
	};
	
	/**
	 * Removes all series from the renderer and the yAxis from the panel if it is not being used by any current renderers.
	 *
	 * @param {boolean} [eraseData=false] Set to true to erase the actual series data in the CIQ.ChartEngine otherwise it will be retained
	 * @return {CIQ.Renderer} A copy of this for chaining
	 * @memberof CIQ.Renderer
	 */
	CIQ.Renderer.prototype.removeAllSeries = function (eraseData) {
		if (eraseData || this === this.stx.mainSeriesRenderer) {
			var arr = [];
			// Compile a list of all of the fields
			for (var sp = 0; sp < this.seriesParams.length; sp++) {
				arr.push(this.seriesParams[sp].id);
			}
			for (var i = 0; i < arr.length; i++) {
				this.removeSeries(arr[i]);
			}
		}
		this.seriesParams = [];
		this.colors = {};
		this.stx.deleteYAxisIfUnused(
			this.stx.panels[this.params.panel],
			this.params.yAxis
		);
		this.stx.resizeChart();
	
		return this;
	};
	
	/**
	 * Returns the y-axis used by the renderer
	 * @param {CIQ.ChartEngine} stx chart engine object
	 * @return {CIQ.ChartEngine.YAxis} Y axis
	 * @memberof CIQ.Renderer
	 * @since 7.1.0
	 */
	CIQ.Renderer.prototype.getYAxis = function (stx) {
		var yAxis;
		if (this.params) {
			if (this.params.yAxis) yAxis = this.params.yAxis;
			else {
				var panel = stx.panels[this.params.panel];
				if (!panel) return false;
				yAxis = panel.yAxis;
			}
		} else yAxis = stx.chart.panel.yAxis;
		return yAxis;
	};
	
	/**
	 * Call this to immediately render the visualization, at the end of a chain of commands.
	 * @return {CIQ.Renderer} A copy of this for chaining
	 * @memberof CIQ.Renderer
	 */
	CIQ.Renderer.prototype.ready = function () {
		this.stx.createDataSet();
		this.stx.draw();
		return this;
	};
	
	/**
	 * Creates a lines renderer.
	 *
	 * This renderer draws lines of various color, thickness, and pattern on a chart.
	 *
	 * The `Lines` renderer is used to create the following chart types (including colored versions):
	 * line, mountain, baseline, wave, and step chart.
	 *
	 * **Note:** By default, the renderer displays lines as underlays. As such, they appear below any
	 * other studies or drawings.
	 *
	 * See {@link CIQ.Renderer#construct} for parameters required by all renderers.
	 *
	 * @param {object} config Configuration object for the renderer.
	 * @param {object} [config.params] Parameters to control the renderer itself.
	 * @param {number} [config.params.width] Width of the rendered line.
	 * @param {string} [config.params.type="line"] Type of rendering; "line", "mountain", or
	 * 		["wave"]{@link CIQ.ChartEngine#drawWaveChart}.
	 * @param {boolean} [config.params.useChartLegend=false] Set to true to use the built-in canvas
	 * 		legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
	 * @param {boolean} [config.params.highlightable=true] Set to false to prevent selection of series
	 * 		via hover.
	 * @param {string} [config.params.style] Style name to use in lieu of defaults for the type.
	 * @param {boolean} [config.params.step] Specifies a step chart.
	 * @param {boolean|CIQ.ChartEngine.Chart#baseline} [config.params.baseline] Specifies a baseline
	 * 		chart. If a baseline object is set, then the renderer uses those properties instead of the
	 * 		chart's baseline when rendering. When true, the renderer falls back to the chart's baseline
	 * 		properties for rendering.
	 * @param {boolean} [config.params.colored] Specifies the use of a color function (see
	 * 		{@link CIQ.Renderer.registerColorFunction}) to determine the color of the segment.
	 * @param {boolean} [config.params.vertex] Specifies drawing a dot on every vertex.
	 * @param {boolean} [config.params.vertex_color] Specifies a color for the vertices. If omitted,
	 * 		uses the default color (see {@link CIQ.ChartEngine#getDefaultColor}).
	 * @param {string} [config.params.colorFunction] Override string (or function) used to determine
	 * 		color of bar. May be an actual function or a string name of the registered function (see
	 * 		{@link CIQ.Renderer.registerColorFunction}).
	 *
	 * Common valid parameters for use by {@link CIQ.Renderer#attachSeries} (see also
	 * {@link CIQ.ChartEngine#plotLine}):
	 * - `color` &mdash; Specify the color for the line by name or in RGBA or hexadecimal format.
	 * - `pattern` &mdash; Specify the pattern as an array. For instance, [5, 5] would be five pixels
	 *    and then five empty pixels.
	 * - `width` &mdash; Specify the width of the line.
	 * - `baseColor` &mdash; Specify the color of the base of a mountain.
	 * - `fillStyle` &mdash; Specify the color to fill a mountain (other than `color`).
	 *
	 * @constructor
	 * @name CIQ.Renderer.Lines
	 * @since
	 * - 4.0.0 New `config.params.useChartLegend` added.
	 * - 5.1.0 Removed subtype parameter, this will be determined internally from
	 * 		`config.params.step=true`.
	 * - 5.1.0 Added `highlightable`, `overChart`, `step`, `baseline`, `vertex`, `style`, `colored`,
	 * 		and `colorFunction` parameters.
	 * - 8.1.0 Added {@link CIQ.ChartEngine.Chart#baseline} type to `baseline` parameter. The new type
	 * 		contains a `defaultLevel` property which can be set to the desired baseline value. See
	 * 		example below.
	 *
	 * @example <caption>Create a renderer and set a custom baseline.</caption>
	 * const baseLineRenderer = new CIQ.Renderer.Lines({
	 *     params: {
	 *         baseline: {defaultLevel: 45},
	 *         yAxis: true
	 *     }
	 * });
	 *
	 * stxx.addSeries("GOOG");
	 * stxx.setSeriesRenderer(baseLineRenderer).attachSeries("GOOG").ready();
	 *
	 * // or
	 *
	 * stxx.addSeries("GOOG", {baseline: {defaultLevel: 105}, color: "purple"});
	 *
	 * @example <caption>Add multiple series and attach to a custom y-axis on the left.</caption>
	 * // See this example working here: https://jsfiddle.net/chartiq/b6pkzrad.
	 *
	 * // Note how the addSeries callback is used to ensure the data is present before the series is displayed.
	 *
	 * // Create the custom axis.
	 * const axis = new CIQ.ChartEngine.YAxis();
	 * axis.position = "left";
	 * axis.textStyle = "#FFBE00";
	 * axis.decimalPlaces = 0;  // No decimal places on the axis labels.
	 * axis.maxDecimalPlaces = 0;  // No decimal places on the last price pointer.
	 *
	 * // Create the renderer.
	 * const renderer = stxx.setSeriesRenderer(
	 *     new CIQ.Renderer.Lines({
	 *         params: {
	 *             name: "my-renderer",
	 *             type: "mountain",
	 *             yAxis: axis
	 *         }
	 *     })
	 * );
	 *
	 * // Create your series and attach them to the chart when the data is loaded.
	 * stxx.addSeries("NOK", {display: "NOK", width: 4}, function() {
	 *     renderer.attachSeries("NOK", "#FFBE00").ready();
	 * });
	 *
	 * stxx.addSeries("SNE", {display: "Sony", width: 4}, function() {
	 *     renderer.attachSeries("SNE", "#FF9300").ready();
	 * });
	 *
	 * @example <caption>Remove a renderer and all associated data.</caption>
	 * // This should only be necessary if you are also removing the chart itself.
	 *
	 * // Remove all series from the renderer, including series data from masterData.
	 * renderer.removeAllSeries(true);
	 *
	 * // Detach the series renderer from the chart.
	 * stxx.removeSeriesRenderer(renderer);
	 *
	 * // Delete the renderer itself.
	 * renderer=null;
	 *
	 * @example <caption>Create a colored step baseline mountain with vertices.</caption>
	 * const renderer = stxx.setSeriesRenderer(
	 *     new CIQ.Renderer.Lines({
	 *         params: {
	 *             name: "my-renderer",
	 *             type: "mountain",
	 *             baseline: true,
	 *             step: true,
	 *             colored: true,
	 *             vertex: true,
	 *             yAxis: axis
	 *         }
	 *     })
	 * );
	 */
	CIQ.Renderer.Lines = function (config) {
		this.construct(config);
		const { params } = this;
		if (!params.type) params.type = "line";
		if (!params.style) {
			switch (params.type) {
				case "mountain":
					if (params.baseline) params.style = "stx_baseline_delta_mountain";
					else if (params.colored) params.style = "stx_colored_mountain_chart";
					else params.style = "stx_mountain_chart";
					break;
				default:
					params.style = "stx_line_chart";
			}
		}
		this.supportsAnimation = true;
		if (params.type == "wave" || params.type == "channel") {
			// wave charts don't support these options and no gap support either.
			params.step = params.vertex = params.baseline = params.colored = false;
			this.highLowBars = this.barsHaveWidth = true;
			this.supportsAnimation = false;
		} else if (params.type == "step") {
			params.step = true;
		}
		let { baseline } = params;
		if (baseline && typeof baseline === "object") {
			CIQ.ensureDefaults(
				params.baseline,
				CIQ.ChartEngine.Chart.prototype.baseline
			);
		}
	};
	CIQ.inheritsFrom(CIQ.Renderer.Lines, CIQ.Renderer, false);
	
	/**
	 * Returns a new Lines renderer if the featureList calls for it
	 * FeatureList should contain whatever features requested; valid features:
	 * 	line, mountain, baseline (delta), step, vertex, colored, wave
	 * Anything else is an invalid feature and will cause function to return null
	 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series
	 * @param {array} featureList List of rendering terms requested by the user, parsed from the chartType
	 * @param {object} [params] Parameters used for the series to be created, used to create the renderer
	 * @return {CIQ.Renderer.Lines} A new instance of the Lines renderer, if the featureList matches
	 * @memberof CIQ.Renderer.Lines
	 * @since 5.1.0
	 */
	CIQ.Renderer.Lines.requestNew = function (featureList, params) {
		var type = null,
			isStep = params.step,
			isColored = params.colored,
			isBaseline = params.baseline,
			isVertex = params.vertex;
		for (var pt = 0; pt < featureList.length; pt++) {
			var pType = featureList[pt];
			switch (pType) {
				case "line":
				case "mountain":
				case "wave":
				case "channel":
					type = pType;
					break;
				case "baseline":
					isBaseline = true;
					break;
				case "colored":
					isColored = true;
					break;
				case "step":
					isStep = true;
					break;
				case "vertex":
					isVertex = true;
					break;
				case "delta":
					break;
				default:
					return null; // invalid chart type for this renderer
			}
		}
		if (type === null && !isBaseline && !isStep) return null;
	
		return new CIQ.Renderer.Lines({
			params: CIQ.extend(params, {
				type: type,
				step: isStep,
				colored: isColored,
				baseline: isBaseline,
				vertex: isVertex
			})
		});
	};
	
	CIQ.Renderer.Lines.prototype.draw = function () {
		var stx = this.stx,
			panel = this.stx.panels[this.params.panel],
			chart = panel.chart;
		var seriesMap = {};
		var s,
			seriesParams = this.seriesParams;
		var colorFunction = this.params.colorFunction;
		function defaultColorFunction(param) {
			var stxLineUpColor =
				param.fill_color_up || stx.getCanvasColor("stx_line_up");
			var stxLineDownColor =
				param.fill_color_down || stx.getCanvasColor("stx_line_down");
			var stxLineColor = param.color || stx.getCanvasColor("stx_line_chart");
			return function (stx, quote, mode) {
				if (!quote.iqPrevClose && quote.iqPrevClose !== 0) return stxLineColor;
				if (quote.Close > quote.iqPrevClose) return stxLineUpColor;
				if (quote.Close < quote.iqPrevClose) return stxLineDownColor;
				return stxLineColor;
			};
		}
		for (s = 0; s < seriesParams.length; s++) {
			var sParam = seriesParams[s];
			if (this.params.colored) {
				var parts = ["_color_up", "_color_down", "_color"];
				for (var i = 0; i < parts.length; i++) {
					//if(!sParam["fill"+parts[i]]){
					var b = sParam["border" + parts[i]];
					if (b && b != "auto") sParam["fill" + parts[i]] = b;
					//}
				}
				if (!colorFunction) colorFunction = defaultColorFunction(sParam);
				this.params.colorFunction = colorFunction;
			}
			var defaultParams = {};
			if (chart.series[sParam.id]) {
				// make sure the series is still there.
				defaultParams = CIQ.clone(chart.series[sParam.id].parameters);
			}
			seriesMap[sParam.id] = {
				parameters: CIQ.extend(CIQ.extend(defaultParams, this.params), sParam),
				yValueCache: this.caches[sParam.id]
			};
			if (
				this == stx.mainSeriesRenderer &&
				chart.customChart &&
				chart.customChart.colorFunction
			) {
				seriesMap[sParam.id].parameters.colorFunction =
					chart.customChart.colorFunction;
			}
		}
		stx.drawSeries(chart, seriesMap, this.params.yAxis, this);
		for (s in seriesMap) {
			this.caches[s] = seriesMap[s].yValueCache;
		}
	};
	
	CIQ.Renderer.Lines.prototype.drawIndividualSeries = function (
		chart,
		parameters
	) {
		if (parameters.invalid) return;
		var stx = this.stx,
			context = chart.context,
			rc = null;
		var colorFunction = parameters.colorFunction,
			panel = stx.panels[parameters.panel] || chart.panel;
		if (typeof colorFunction == "string") {
			colorFunction = CIQ.Renderer.colorFunctions[colorFunction];
			if (!colorFunction) return;
		}
	
		if (parameters.vertex) {
			context.save();
			context.lineJoin = "bevel";
		}
		if (parameters.type == "wave") {
			rc = stx.drawWaveChart(panel, parameters);
		} else if (parameters.baseline) {
			rc = stx.drawBaselineChart(panel, parameters);
			stx.positionBaselineHandle(this);
		} else if (parameters.type == "mountain") {
			parameters.returnObject = true;
			rc = stx.drawMountainChart(panel, parameters, colorFunction);
		} else if (parameters.type == "channel") {
			parameters.returnObject = true;
			rc = stx.drawChannelChart(panel, colorFunction, parameters);
		} else {
			parameters.returnObject = true;
			rc = stx.drawLineChart(panel, parameters.style, colorFunction, parameters);
		}
		if (parameters.vertex) {
			stx.scatter(panel, {
				yAxis: parameters.yAxis,
				field: parameters.symbol || parameters.field,
				subField: parameters.subField,
				symbol: parameters.symbol,
				color: parameters.vertex_color,
				highlight: parameters.highlight
			});
			context.restore();
		}
		return rc;
	};
	
	/**
	 * Creates an OHLC renderer.
	 *
	 * Note: by default the renderer will display bars as underlays. As such, they will appear below any other studies or drawings.
	 *
	 * The OHLC renderer is a base class for creating the following chart types:
	 * - {@link CIQ.Renderer.HLC}
	 * - {@link CIQ.Renderer.Bars}
	 * - {@link CIQ.Renderer.Candles}
	 * - {@link CIQ.Renderer.SimpleHistogram}
	 * <br>and is normally not directly accessed.
	 *
	 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
	 * @param {object} config Config for renderer
	 * @param  {object} [config.params] Parameters to control the renderer itself
	 * @param  {string} [config.params.type] Type of rendering "bar", "candle". Not needed if `params.histogram` is set)
	 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
	 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
	 * @param  {boolean} [config.params.colored] For bar or hlc, specifies using a condition or colorFunction to determine color
	 * @param  {boolean} [config.params.hollow] Specifies candles should be hollow candles
	 * @param  {boolean} [config.params.volume] Specifies candles should be volume candles
	 * @param  {boolean} [config.params.histogram] Specifies histogram chart (if set, `params.type` is not required). These are basic histograms that allow just one bar per tick; not to be confused with stackable histograms which require the more advanced {@link CIQ.Renderer.Histogram}
	 * @param  {boolean} [config.params.hlc] Specifies bar chart, with just hlc data; no open tick
	 * @param  {boolean} [config.params.gradient=true] Specifies histogram bars are to be drawn with a gradient; set to false to draw with solid colors
	 * @param  {string} [config.params.colorBasis="close"] For bar/hlc charts, will compute color based on whether current close is higher or lower than previous close.  Set to "open" to compute this off the open rather than yesterday's close.
	 * @param  {function} [config.params.colorFunction] Oerride function (or string) used to determine color of bar.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
	 * @constructor
	 * @name  CIQ.Renderer.OHLC
	 * @since 5.1.0
	 * @example
		 // Colored hlc chart
		var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.OHLC({params:{name:"bars", type:"bar", hlc:true, colored:true}}));
	 *
	 */
	
	CIQ.Renderer.OHLC = function (config) {
		this.construct(config);
		var params = this.params;
		if (!params.type) params.type = "candle";
		this.highLowBars = this.barsHaveWidth = this.standaloneBars = true;
		if (params.histogram) {
			params.type = "candle";
			this.highLowBars = false;
			params.volume = params.hollow = false;
		}
		if (params.type == "bar")
			params.volume = params.hollow = params.histogram = false;
		if (params.type == "candle") params.hlc = params.colored = false;
		if (params.volume) params.hollow = true;
	};
	CIQ.inheritsFrom(CIQ.Renderer.OHLC, CIQ.Renderer, false);
	
	/**
	 * Returns a new OHLC renderer if the featureList calls for it
	 * FeatureList should contain whatever features requested; valid features:
	 * 	bar, hlc, candle, colored, histogram, hollow, volume
	 * Anything else is an invalid feature and will cause function to return null
	 *
	 * **Note:** If you are using the base package then the only valid features are: candle and histogram.
	 *
	 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series
	 * @param {array} featureList List of rendering terms requested by the user, parsed from the chartType
	 * @param {object} [params] Parameters used for the series to be created, used to create the renderer
	 * @return {CIQ.Renderer.OHLC} A new instance of the OHLC renderer, if the featureList matches
	 * @memberof CIQ.Renderer.OHLC
	 * @since 5.1.0
	 */
	CIQ.Renderer.OHLC.requestNew = function (featureList, params) {
		var type = null,
			histogram = params.histogram;
		for (var pt = 0; pt < featureList.length; pt++) {
			var pType = featureList[pt];
			switch (pType) {
				case "candle":
					type = pType;
					break;
				case "histogram":
					histogram = true;
					type = "candle";
					break;
				default:
					return null; // invalid chartType for this renderer
			}
		}
		if (type === null) return null;
	
		return new CIQ.Renderer.OHLC({
			params: CIQ.extend(params, { type: type, histogram: histogram })
		});
	};
	
	/**
	 * Returns array of chartParts for configuring rendering.
	 *
	 * @since 7.4.0
	 * @private
	 */
	CIQ.Renderer.OHLC.getChartParts = function (style, colorUseOpen) {
		var CANDLEUP = 8; // today's close greater than today's open
		var CANDLEDOWN = 16; // today's close less than today's open
		var CANDLEEVEN = 32; // today's close equal to today's open
		return [
			{type:"histogram",	drawType:"histogram",	style:"stx_histogram_up",		condition:CANDLEUP,				fill:"fill_color_up",	border:"border_color_up",						useColorInMap:true, useBorderStyleProp:true},
			{type:"histogram",	drawType:"histogram",	style:"stx_histogram_down",		condition:CANDLEDOWN,			fill:"fill_color_down",	border:"border_color_down",						useColorInMap:true, useBorderStyleProp:true},
			{type:"histogram",	drawType:"histogram",	style:"stx_histogram_even",		condition:CANDLEEVEN,			fill:"fill_color_even",	border:"border_color_even",	skipIfPass:true,	useColorInMap:true, useBorderStyleProp:true},
			{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow",																border:"border_color_up"},
			{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_up",	condition:CANDLEUP,										border:"border_color_up"},
			{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_down",	condition:CANDLEDOWN,									border:"border_color_down"},
			{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_even",	condition:CANDLEEVEN,									border:"border_color_even",	skipIfPass:true},
			{type:"candle",		drawType:"candle",		style:"stx_candle_up",			condition:CANDLEUP,				fill:"fill_color_up",	border:"border_color_up",						useColorInMap:true, useBorderStyleProp:true},
			{type:"candle",		drawType:"candle",		style:"stx_candle_down",		condition:CANDLEDOWN,			fill:"fill_color_down",	border:"border_color_down",						useColorInMap:true, useBorderStyleProp:true},
		]; // prettier-ignore
	};
	
	CIQ.Renderer.OHLC.prototype.draw = function () {
		var stx = this.stx,
			panel = this.stx.panels[this.params.panel],
			chart = panel.chart;
		var seriesMap = {};
		var s,
			seriesParams = this.seriesParams;
		for (s = 0; s < seriesParams.length; s++) {
			var sParam = seriesParams[s];
	
			var defaultParams = {};
			if (chart.series[sParam.id]) {
				// make sure the series is still there.
				defaultParams = CIQ.clone(chart.series[sParam.id].parameters);
			}
			seriesMap[sParam.id] = {
				parameters: CIQ.extend(CIQ.extend(defaultParams, this.params), sParam)
				//yValueCache: this.caches[sParam.id]
			};
			if (
				this == stx.mainSeriesRenderer &&
				chart.customChart &&
				chart.customChart.colorFunction
			) {
				seriesMap[sParam.id].parameters.colorFunction =
					chart.customChart.colorFunction;
			}
		}
		stx.drawSeries(chart, seriesMap, this.params.yAxis, this);
		for (s in seriesMap) {
			if (seriesMap[s].yValueCache) this.caches[s] = seriesMap[s].yValueCache;
		}
	};
	
	CIQ.Renderer.OHLC.prototype.getColor = function (
		stx,
		panel,
		style,
		isBorder,
		isGradient,
		overrideColor
	) {
		var color = overrideColor || style.color;
		var yAxis = this.params.yAxis || panel.yAxis;
		if (isBorder) {
			color =
				overrideColor || style.borderLeftColor || style["border-left-color"];
			if (!color) return null;
		}
		if (!isGradient) return color;
		var top = stx.pixelFromTransformedValue(yAxis.highValue, panel);
		if (isNaN(top)) top = 0; // 32 bit IE doesn't like large numbers
		var backgroundColor = style.backgroundColor;
		if (color && !CIQ.isTransparent(color)) {
			var gradient = stx.chart.context.createLinearGradient(
				0,
				top,
				0,
				2 * yAxis[yAxis.flipped ? "top" : "bottom"] - top
			);
			gradient.addColorStop(0, color);
			gradient.addColorStop(1, backgroundColor);
			return gradient;
		}
		return backgroundColor;
	};
	
	CIQ.Renderer.OHLC.prototype.drawIndividualSeries = function (
		chart,
		parameters
	) {
		if (parameters.invalid) return;
		var stx = this.stx,
			context = chart.context;
		var colorFunction = parameters.colorFunction,
			panel = stx.panels[parameters.panel] || chart.panel;
		if (typeof colorFunction == "string") {
			colorFunction = CIQ.Renderer.colorFunctions[colorFunction];
			if (!colorFunction) return;
		}
		var noBorders =
			stx.layout.candleWidth - chart.tmpWidth <= 2 && chart.tmpWidth <= 3;
		var CLOSEUP = 1; // today's close greater than yesterday's close
		var CLOSEDOWN = 2; // today's close less than yesterday's close
		var CLOSEEVEN = 4; // today's close the same as yesterday's close
		var CANDLEUP = 8; // today's close greater than today's open
		var CANDLEDOWN = 16; // today's close less than today's open
		var CANDLEEVEN = 32; // today's close equal to today's open
		if (!chart.state.chartType) chart.state.chartType = {};
		var pass = (chart.state.chartType.pass = {});
		var colorUseOpen = stx.colorByCandleDirection;
		if (parameters.colorBasis) colorUseOpen = parameters.colorBasis == "open";
		var isHistogram = parameters.histogram,
			type = parameters.type,
			hollow = parameters.hollow;
		var noWicks = stx.noWicksOnCandles[type];
		stx.startClip(panel.name);
		var colors = null,
			rc = { colors: [], cache: [] },
			caches = [];
		if (colorFunction) {
			var drawingParams = {
				isHistogram: isHistogram,
				field: parameters.field,
				yAxis: parameters.yAxis,
				isVolume: parameters.volume,
				highlight: parameters.highlight
			};
			if (!isHistogram && type == "bar") {
				drawingParams.type = parameters.hlc ? "hlc" : "bar";
				rc = stx.drawBarChart(
					panel,
					"stx_bar_chart",
					colorFunction,
					drawingParams
				);
			} else {
				if (type == "candle" && !noWicks)
					stx.drawShadows(panel, colorFunction, drawingParams);
				rc = stx.drawCandles(panel, colorFunction, drawingParams); //all bars
				drawingParams.isOutline = true;
				if (hollow || !noBorders)
					stx.drawCandles(panel, colorFunction, drawingParams); //all bar borders, if candlewidth is too small then don't draw the borders
			}
		} else {
			var isGradient = isHistogram && parameters.gradient !== false;
			var chartParts = CIQ.Renderer.OHLC.getChartParts(
				parameters.style,
				colorUseOpen
			);
			for (var i = 0; i < chartParts.length; i++) {
				var chartPart = chartParts[i];
				if (chartPart.skipIfPass && !pass.even) continue;
				else if (isHistogram) {
					if (chartPart.type != "histogram") continue;
				} else if (type == "bar") {
					if (chartPart.type != "bar") continue;
					else if (parameters.colored && !chartPart.condition) continue;
					else if (!parameters.colored && chartPart.condition) continue;
				} else if (hollow) {
					if (chartPart.type != "hollow") continue;
					else if (chartPart.drawType == "shadow" && noWicks) continue;
				} else if (type == "candle") {
					if (chartPart.type != "candle") continue;
					else if (chartPart.drawType == "shadow") {
						if (noWicks) continue;
						var coloredShadowUp =
							parameters.border_color_up ||
							stx.getCanvasColor("stx_candle_shadow_up");
						var coloredShadowDown =
							parameters.border_color_down ||
							stx.getCanvasColor("stx_candle_shadow_down");
						var coloredShadowEven =
							parameters.border_color_even ||
							stx.getCanvasColor("stx_candle_shadow_even");
						if (
							!CIQ.colorsEqual(coloredShadowUp, coloredShadowDown) ||
							!CIQ.colorsEqual(coloredShadowUp, coloredShadowEven) ||
							!CIQ.colorsEqual(coloredShadowUp, stx.defaultColor)
						) {
							if (!chartPart.condition) continue;
						} else if (chartPart.condition) continue;
					}
				} else continue;
	
				var styleArray = stx.canvasStyle(chartPart.style);
				var legendColor = this.getColor(
					stx,
					panel,
					styleArray,
					false,
					false,
					parameters[chartPart.fill]
				);
				var fillColor = this.getColor(
					stx,
					panel,
					styleArray,
					false,
					isGradient,
					parameters[chartPart.fill]
				);
				var borderColor = this.getColor(
					stx,
					panel,
					styleArray,
					chartPart.useBorderStyleProp && !noBorders,
					isGradient,
					parameters[chartPart.border]
				);
				if (chartPart.drawType == "candle") {
					if (chartPart.type == "hollow") {
						// Solid candles get no border unless the border color is different than the fill color
						if (
							!CIQ.isTransparent(fillColor) &&
							CIQ.colorsEqual(borderColor, fillColor)
						)
							borderColor = chartPart.useColorInMap ? "transparent" : fillColor;
						if (!chartPart.useColorInMap) fillColor = stx.containerColor;
					} else if (chartPart.type == "candle") {
						// Check to see if the candles are too small for borders
						if (noBorders) {
							if (CIQ.isTransparent(fillColor)) fillColor = borderColor;
							// transparent candle, draw it with the border color
							else borderColor = fillColor; // non-transparent candle, set the border to the fill color
						}
					}
				}
				context.globalAlpha = parameters.opacity;
				caches.push(
					stx.drawBarTypeChartInner({
						fillColor: fillColor,
						borderColor: borderColor,
						condition: chartPart.condition,
						style: chartPart.style,
						type: type == "bar" && parameters.hlc ? "hlc" : chartPart.drawType,
						panel: panel,
						field: parameters.field,
						yAxis: parameters.yAxis,
						volume: parameters.volume && parameters.hollow,
						highlight: parameters.highlight
					})
				);
				if (!colors) colors = {};
				if (chartPart.useColorInMap) colors[legendColor] = 1;
			}
		}
		stx.endClip();
		for (var c in colors) {
			if (!parameters.hollow || !CIQ.equals(c, stx.containerColor)) {
				rc.colors.push(c);
			}
		}
		for (c = 0; c < caches.length; c++) {
			for (var x = 0; x < caches[c].cache.length; x++) {
				var v = caches[c].cache[x];
				if (v || v === 0) rc.cache[x] = v;
			}
		}
		return rc;
	};
	
	/**
	 * Creates a Candles renderer, a derivation of the OHLC renderer.
	 *
	 * Note: by default the renderer will display candles as underlays. As such, they will appear below any other studies or drawings.
	 *
	 * The Candles renderer is used to create the following drawing types: candle, hollow candle, volume candle
	 *
	 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
	 * @param {object} config Config for renderer
	 * @param  {object} [config.params] Parameters to control the renderer itself
	 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
	 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
	 * @param  {boolean} [config.params.hollow] Specifies candles should be hollow candles
	 * @param  {boolean} [config.params.volume] Specifies candles should be volume candles
	 * @param  {function} [config.params.colorFunction] Override function (or string) used to determine color of candle.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
	 *
	 * Common valid parameters for use by attachSeries.:<br>
	 * `fill_color_up` - Color to use for up candles.<br>
	 * `fill_color_down` - Color to use for down candles.<br>
	 * `fill_color_even` - Color to use for even candles.<br>
	 * `border_color_up` - Color to use for the border of up candles.<br>
	 * `border_color_down` - Color to use for the order of down candles.<br>
	 * `border_color_even` - Color to use for the order of even candles.<br>
	 *
	 * @constructor
	 * @name  CIQ.Renderer.Candles
	 * @since 5.1.1
	 * @example
		 // Hollow candle chart
		var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Candles({params:{name:"candles", hollow:true}}));
	 *
	 */
	CIQ.Renderer.Candles = function (config) {
		this.construct(config);
		var params = this.params;
		params.type = "candle";
		this.highLowBars = this.barsHaveWidth = this.standaloneBars = true;
		params.hlc = params.colored = params.histogram = false;
		if (params.volume) params.hollow = true;
	};
	CIQ.inheritsFrom(CIQ.Renderer.Candles, CIQ.Renderer.OHLC, false);
	
	/**
	 * Creates a SimpleHistogram renderer, a derivation of the Candles renderer.
	 *
	 * Note: by default the renderer will display histogram as underlays. As such, they will appear below any other studies or drawings.
	 *
	 * The SimpleHistogram renderer is used to create a histogram with the top of each bar representing the value of the field.
	 * It is a much simpler form of histogram than that produced by the Histogram renderer (advanced package).
	 *
	 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
	 * @param {object} config Config for renderer
	 * @param  {object} [config.params] Parameters to control the renderer itself
	 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
	 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
	 * @param  {boolean} [config.params.gradient=true] Specifies histogram bars are to be drawn with a gradient; set to false to draw with solid colors
	 * @param  {function} [config.params.colorFunction] Override function (or string) used to determine color of bar.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
	 *
	 * Valid parameters for use by attachSeries.:<br>
	 * `fill_color_up` - Color to use for up histogram bars.<br>
	 * `fill_color_down` - Color to use for down histogram bars.<br>
	 * `fill_color_even` - Color to use for even histogram bars.<br>
	 * `border_color_up` - Color to use for the border of up histogram bars.<br>
	 * `border_color_down` - Color to use for the order of down histogram bars.<br>
	 * `border_color_even` - Color to use for the order of even histogram bars.<br>
	 *
	 * @constructor
	 * @name  CIQ.Renderer.SimpleHistogram
	 * @since 5.1.1
	 * @example
		 // SimpleHistogram under the main chart plot
		var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.SimpleHistogram({params:{name:"histogram", overChart:false}}));
	 *
	 */
	
	CIQ.Renderer.SimpleHistogram = function (config) {
		this.construct(config);
		var params = this.params;
		params.type = "candle";
		params.histogram = true;
		this.barsHaveWidth = this.standaloneBars = true;
		this.highLowBars = false;
		params.hlc = params.colored = params.hollow = params.volume = false;
	};
	CIQ.inheritsFrom(CIQ.Renderer.SimpleHistogram, CIQ.Renderer.Candles, false);
	
	};
	
	
	let __js_core_string_ = (_exports) => {
	
	
	//-------------------------------------------------------------------------------------------
	// Be sure your webserver is set to deliver UTF-8 charset
	// For apache add "AddDefaultCharset UTF-8" to httpd.conf
	// otherwise use \u unicode escapes for non-ascii characters
	//-------------------------------------------------------------------------------------------
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Capitalizes the first letter of a string.
	 *
	 * @param {string} string String to be capitalized.
	 * @return {string} Capitalized version of the string.
	 * @memberof CIQ
	 * @since 7.4.0 Replaces {@link String.prototype.capitalize}.
	 */
	CIQ.capitalize = function (string) {
		if (!string) return "";
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
	
	CIQ.camelCaseRegExp = /-([a-z])/g;
	/**
	 * Converts from hyphenated to camel case. Used primarily for converting css style names (which are hyphenated) to property values (which are camel case)
	 * @param  {string} name Hyphenated style name
	 * @return {string}		 Camel case style name
	 * @memberof CIQ
	 */
	CIQ.makeCamelCase = function (name) {
		return name.replace(CIQ.camelCaseRegExp, function (g) {
			return g[1].toUpperCase();
		});
	};
	
	/**
	 * Convenience function for generating a unique ID. Defaults to a short, pseudo unique ID based on the current time.
	 * Radix 36 is used resulting in a compact string consisting only of letters and numerals. While not guaranteed to be
	 * unique, this function has a high probability of uniqueness when it is triggered by human activity even in a large
	 * user base. If called with `true` as the first argument it will instead return an RFC4122 version 4 compliant UUID.
	 * @param  {boolean} generateUUID If true will return a UUID.
	 * @return {string} Either a RFC4122 version 4 compliant UUID or a unique string consisting of letters and numerals
	 * @memberof CIQ
	 */
	CIQ.uniqueID = function (generateUUID) {
		if (generateUUID) {
			// See http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
			var d = new Date().getTime();
			if (
				typeof window !== "undefined" &&
				window.performance &&
				typeof window.performance.now === "function"
			) {
				d += window.performance.now(); //use high-precision timer if available
			}
			var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
				/[xy]/g,
				function (c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
				}
			);
			return uuid;
		}
		var epoch = new Date();
		var id = epoch.getTime().toString(36);
		id += Math.floor(Math.random() * Math.pow(36, 2)).toString(36);
		return id.toUpperCase();
	};
	
	};
	
	
	let __js_core_typedefs_ = (_exports) => {
	/**
	 * OHLC Quote. This is the data format that the {@link CIQ.ChartEngine} recognizes.
	 * All quotes must at least have a DT property that is a JavaScript Date in order to be valid, every other value is nullable.
	 * Quotes can contain as many properties as you would like, allowing the ChartEngine to plot any value.
	 *
	 * @typedef {object} CIQ.ChartEngine~OHLCQuote
	 * @prop {number} Open The opening price of the quote.
	 * @prop {number} High The highest price of the quote.
	 * @prop {number} Low The lowest price of the quote.
	 * @prop {number} Close The closing price of the quote.
	 * @prop {number} Volume The number of shares traded.
	 * @prop {!Date} DT The date and time of the quote.
	 */
	
	/**
	 * CIQ.Drawing interface placeholder to be augmented in *standard.js* with properties.
	 *
	 * @tsinterface {object} CIQ~Drawing
	 */
	
	/**
	 * CIQ.ChartEngine.RangeParameters interface placeholder to be augmented in *standard.js* with properties.
	 *
	 * @tsinterface {object} CIQ.ChartEngine~RangeParameters
	 */
	
	/**
	 * CIQ.ChartEngine.SpanParameters interface placeholder to be augmented in *standard.js* with properties.
	 *
	 * @tsinterface {object} CIQ.ChartEngine~SpanParameters
	 */
	
	/**
	 * CIQ.ChartEngine.currentVectorParameters interface placeholder to be augmented in *standard.js* with properties.
	 *
	 * @tsinterface {object} CIQ.ChartEngine~currentVectorParameters
	 */
	
	/**
	 * CIQ.Studies.StudyDescriptor interface placeholder to be augmented in *standard.js* with properties.
	 *
	 * @tsinterface {object} CIQ.Studies~StudyDescriptor
	 */
	
	};
	
	
	let __js_core_xhr_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Returns the host portion of a url
	 * @param  {string} url The url, such as document.location.href
	 * @return {string}     The host portion, including port, if the url is a valid URI
	 * @memberof CIQ
	 */
	CIQ.getHostName = function (url) {
		try {
			return url.match(/:\/\/(.[^/]+)/)[1];
		} catch (e) {
			return "";
		}
	};
	
	/**
	 * A parsed query string object
	 * Does not support using multi-value keys (i.e. "a=1&a=2")
	 * @param  {string} [query] Query string. If not provided then the browser location's query string will be used
	 * @return {object}       An object containing the parsed values of the query string
	 * @memberof CIQ
	 */
	CIQ.qs = function (query) {
		var qsParm = {};
		if (!query) query = window.location.search.substring(1);
		var parms = query.split("&");
		for (var i = 0; i < parms.length; i++) {
			var pos = parms[i].indexOf("=");
			var key;
			if (pos > 0) {
				key = parms[i].substring(0, pos);
				qsParm[key] = parms[i].substring(pos + 1);
			} else {
				key = parms[i];
				qsParm[key] = null;
			}
		}
		return qsParm;
	};
	
	/**
	 * @callback CIQ.postAjax~requestCallback
	 * @param {number} status HTTP status
	 * @param {string} response HTTP response
	 */
	/**
	 * Convenience function for making an ajax post. If payload is non-null then the method will be set to POST, otherwise GET.
	 * @param {object} params Parameters for the post
	 * @param  {string}   [params.url]         The url to send the ajax query to
	 * @param  {string}   [params.payload]     An optional payload to send
	 * @param  {CIQ.postAjax~requestCallback} [params.cb]          Callback function when complete
	 * @param  {string}   [params.contentType] Optionally override the content type
	 * @param  {boolean}   [params.noEpoch]     By default the epoch is appended as a query string to bust caching. Set this to false to not append the epoch.
	 * @param {string} [params.method] Optionally override the HTTP method
	 * @param {object} [params.headers] Optional additional HTTP headers to send. Example: ```{"x-custom-header-1":"abc","x-custom-header-2":"123"}```
	 * @param {boolean} [params.responseHeaders] Optional Set to true to have callback passed the response headers from the server
	 * @param {number} [params.timeout] Optional Request timeout in msec.  If omitted, timeout is default (no timeout)
	 * @param {boolean} [params.ungovernable] Optional If true, request not subject to rate limiting
	 * @param {string} arg1 Payload
	 * @param {function} arg2 Callback
	 * @param {string} arg3 Ajax content type
	 * @param {boolean} arg4 Set to true for no epoch
	 * @return {boolean} True if there were no errors fetching data.
	 * @memberof CIQ
	 * @since 3.0.0 Added `timeout` and `ungovernable` parameters.
	 */
	CIQ.postAjax = function (params, arg1, arg2, arg3, arg4) {
		if (typeof params == "string") {
			params = {
				url: params,
				payload: arg1,
				cb: arg2,
				contentType: arg3,
				noEpoch: arg4,
				method: null,
				responseHeaders: false
			};
		}
		var url = params.url,
			cb = params.cb,
			payload = params.payload;
		if (!cb) cb = function () {};
		if (!params.ungovernable) {
			if (
				CIQ.Extras &&
				CIQ.Extras.RequestLimiter &&
				CIQ.Extras.RequestLimiter.hitRequestLimit(url)
			) {
				cb(429, null, {});
				return;
			}
		}
		function parseHeaders(server) {
			//Optional code for processing headers.
			var headers = {};
			if (!params.responseHeaders) return;
			var headerString = server.getAllResponseHeaders();
			var headerArray = headerString.split("\n");
			for (var i = 0; i < headerArray.length; i++) {
				var split = headerArray[i].split(":");
				while (split[1] && split[1].charAt(0) == " ")
					split[1] = split[1].substring(1);
				if (split[0] !== "") {
					headers[split.shift()] = split.join(":");
				}
			}
			return headers;
		}
		var server = new XMLHttpRequest();
		if (!server) return false;
		var epoch = new Date();
		if (!params.noEpoch) {
			if (url.indexOf("?") == -1) url += "?ciqrandom=" + epoch.getTime();
			else url += "&ciqrandom=" + epoch.getTime();
		}
		var method = params.method,
			headers = params.headers;
		if (!method) method = payload ? "POST" : "GET";
	
		server.open(method, url, true);
		if (!params.contentType)
			params.contentType = "application/x-www-form-urlencoded";
		if (payload) server.setRequestHeader("Content-Type", params.contentType);
		if (headers) {
			for (var header in headers) {
				server.setRequestHeader(header, headers[header]);
			}
		}
		if (params.timeout) {
			server.timeout = params.timeout; // in msec
		}
		server.ontimeout = function () {
			cb(408, null, {});
		};
		server.onload = function () {
			if (this.status === 0) this.status = "0";
			else if (!this.status) this.status = 200; //XDomainRequest
			cb(this.status, this.responseText, parseHeaders(this));
		};
		server.onerror = function () {
			cb("0", null, {});
		};
		try {
			server.send(payload);
		} catch (e) {
			cb("0", e, {});
		}
		return true;
	};
	
	/**
	 * Dynamically load UI elements from an external HTML file. This is accomplished by rendering raw HTML in an `iframe`
	 * and then cloning all of the newly created DOM elements into our main document. Repeat requests for the same resource
	 * load data from the existing `iframe`.
	 *
	 * The title of the `iframe` is checked. External content should *not* have a title. By convention, 404 or 500 errors
	 * have a title; and so, we use this to determine whether the `iframe` contains valid content or not.
	 *
	 * @param {string} url The external URL to fetch new UI content.
	 * @param {HTMLElement} el Element to append the UI content to; the default is `document.body`.
	 * @param {Function} cb A callback function to call when the new UI is available.
	 * @memberof CIQ
	 * @since
	 * - 6.1.0 Added the `el` parameter.
	 * - 7.2.0 Added caching per application instance by reusing the `iframe` contents.
	 */
	CIQ.loadUI = function (url, el, cb) {
		if (!el || typeof el == "function") {
			cb = el; // backward compatibility
			el = document.body;
		}
		var iframe = document.querySelector('iframe[original-url="' + url + '"]');
		var onload = function () {
			var iframeDocument = null;
	
			try {
				iframeDocument = this.contentDocument;
			} catch (error) {
				return cb(error);
			}
	
			// having a title is considered a server error such as a 404 or 500 response
			if (iframeDocument && !iframeDocument.title) {
				var html = iframeDocument.body.innerHTML;
				var div = document.createElement("div");
	
				CIQ.innerHTML(div, html);
	
				for (var j = 0; j < div.children.length; j++) {
					var ch = div.children[j].cloneNode(true);
					el.appendChild(ch);
				}
	
				cb(null);
			} else {
				cb(new Error("iFrame not found or document has a title"));
			}
		};
	
		if (iframe) {
			var iframeDocument = null;
	
			try {
				iframeDocument = iframe.contentDocument;
			} catch (error) {
				return cb(error);
			}
	
			if (
				iframeDocument.readyState === "complete" &&
				iframeDocument.location &&
				iframeDocument.location.href !== "about:blank"
			) {
				onload.call(iframe);
			} else {
				iframe.addEventListener("load", onload);
			}
		} else {
			iframe = document.createElement("iframe");
			iframe.setAttribute("original-url", url);
			iframe.src = url + (url.indexOf("?") === -1 ? "?" : "&") + CIQ.uniqueID();
			iframe.hidden = true;
			iframe.addEventListener("load", onload);
			document.body.appendChild(iframe);
		}
	};
	
	/**
	 * Loads JavaScript dynamically. Keeps a static memory of scripts that have been loaded to
	 * prevent them from being loaded twice. The callback function however is always called, even
	 * if the script has already been loaded.
	 *
	 * @param {string} scriptName The URL of the script to load.
	 * @param {function} [cb] Callback function to call when the script is loaded.
	 * @param {boolean} [isModule] If true, the script loads a module.
	 *
	 * @memberof CIQ
	 * @since 8.0.0 Added the `isModule` parameter.
	 */
	CIQ.loadScript = function (scriptName, cb, isModule) {
		if (!CIQ.loadedScripts) CIQ.loadedScripts = {};
		if (CIQ.loadedScripts[scriptName]) {
			if (cb) cb();
			return;
		}
		var script = document.createElement("SCRIPT");
		if (isModule) {
			script.type = "module";
			script.crossOrigin = "use-credentials";
		} else {
			script.async = true;
		}
		script.onload = function () {
			CIQ.loadedScripts[scriptName] = true;
			if (cb) cb();
		};
		var uniqueName = scriptName;
		// Use the epoch to create a unique query string, which will force the browser to reload
		if (uniqueName.indexOf("?") == -1) {
			uniqueName = uniqueName + "?" + Date.now();
		} else {
			uniqueName = uniqueName + "&" + Date.now();
		}
		script.src = uniqueName;
		var s = document.getElementsByTagName("script")[0];
		if (!s) document.body.append(script);
		else s.parentNode.insertBefore(script, s.nextSibling);
	};
	
	/**
	 * Loads a stylesheet.
	 * @param  {string} stylesheet Name of stylesheet file.
	 * @param  {Function} cb     Function to call when the stylesheet is fully loaded
	 * @since 2016-03-11
	 * @memberof CIQ
	 */
	CIQ.loadStylesheet = function (stylesheet, cb) {
		var lnk = document.createElement("link");
		lnk.rel = "stylesheet";
		lnk.type = "text/css";
		lnk.media = "screen";
		lnk.href =
			stylesheet + (stylesheet.indexOf("?") === -1 ? "?" : "&") + Date.now();
		lnk.onload = function () {
			if (this.loaded) return; //undocumented IE Edge bug, css files load twice.  This to prevent double-triggering of onload, which may load html file twice.
			this.loaded = true;
			if (cb) cb();
		};
		var links = document.getElementsByTagName("link");
		var lastLink = links[links.length - 1];
		if (!lastLink) document.head.append(lnk);
		else lastLink.parentNode.insertBefore(lnk, lastLink.nextSibling);
	};
	
	/**
	 * Loads a feature function widget. Feature function widgets consist of a CSS file, a
	 * JavaScript file, and an HTML file.
	 *
	 * Use this function to dynamically load content and functionality.
	 *
	 * @param {string} widget Name of the widget to load. The widget's JavaScript, CSS, and HTML
	 * 		files should have this name.
	 * @param {HTMLElement} el Element to which to append the UI content. The default is
	 * 		`document.body`.
	 * @param {function} cb Function to call when the widget is fully loaded.
	 * @param {boolean} isModule When true, the script loads a module.
	 *
	 * @memberof CIQ
	 * @since
	 * - 6.1.0 Added the `el` parameter.
	 * - 8.0.0 Added the `isModule` parameter.
	 */
	CIQ.loadWidget = function (widget, el, cb, isModule) {
		if (!el || typeof el == "function") {
			cb = el; // backward compatibility
			el = document.body;
		}
		CIQ.loadStylesheet(widget + ".css", function () {
			CIQ.loadUI(widget + ".html", el, function (err) {
				if (err) cb(err);
				else CIQ.loadScript(widget + ".js", cb, isModule);
			});
		});
	};
	
	/**
	 * Checks to see if the enabled plugins are done dynamically loading.
	 * @param {array} plugins An array of strings that define which plugins to check
	 * The plugin names provided must match the following format: if cq-scriptiq is enabled, 'scriptiq' is the plugin name entered into the array
	 * @param {Function} cb Function to call when all the plugins are fully loaded
	 * @memberof CIQ
	 * @since 6.1.0
	 */
	CIQ.waitForPlugins = function (plugins, cb) {
		var numPluginsLoaded = 0;
		var numPlugins = plugins.length;
		if (!numPlugins) {
			cb();
			return;
		}
	
		for (var i = 0; i < numPlugins; i++) {
			var tagName = "cq-" + plugins[i];
			var element = document.getElementsByTagName(tagName)[0];
			if (element && element.hasAttribute("loaded")) {
				numPluginsLoaded++;
			}
		}
	
		if (numPlugins !== numPluginsLoaded) {
			return setTimeout(function () {
				CIQ.waitForPlugins(plugins, cb);
			}, 0);
		}
	
		cb();
	};
	
	/**
	 * Adds style content to a document if it has not been added already.
	 *
	 * @param {string} content Style content.
	 * @param {string} path Unique identifier, which prevents duplicate style inclusions.
	 *
	 * @memberof CIQ
	 * @since 8.0.0
	 */
	CIQ.addInternalStylesheet = function (content, path = "") {
		if (!content) return;
		if (content.default) content = content.default;
		if (typeof content !== "string") return;
		if (path && document.querySelector('style[path="' + path + '"]')) return;
		const el = document.createElement("style");
		el.setAttribute("type", "text/css");
		el.setAttribute("path", path);
		el.innerText = content;
		document.head.appendChild(el);
	};
	
	};
	
	
	let __js_core_engine_accessory_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Registers the Chart controls and attaches event handlers to the zoom and home controls.
	 * @private
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.registerHTMLElements = function () {
		const c = this.chart.container;
		for (let control in CIQ.ChartEngine.htmlControls) {
			if (
				typeof this.chart[control] == "undefined" &&
				typeof this.controls[control] == "undefined"
			) {
				if (!this.allowZoom && control == "chartControls") continue;
				let el = c.querySelector("." + control);
				if (el) {
					this.chart[control] = el;
					this.controls[control] = el;
				} else {
					const rawHTML = CIQ.ChartEngine.htmlControls[control];
					if (!rawHTML) continue;
					const div = document.createElement("DIV");
					div.innerHTML = rawHTML;
					el = div.firstChild;
					c.appendChild(el);
					this.chart[control] = el;
					this.controls[control] = el;
					el.classList.add(control);
				}
			}
		}
		const { chartControls, home } = this.controls;
		if (chartControls) {
			const zoomIn = chartControls.querySelector(".stx-zoom-in");
			const zoomOut = chartControls.querySelector(".stx-zoom-out");
	
			CIQ.safeClickTouch(
				zoomIn,
				(function (self) {
					return function (e) {
						if (self.allowZoom) self.zoomIn(e);
						e.stopPropagation();
					};
				})(this)
			);
			CIQ.safeClickTouch(
				zoomOut,
				(function (self) {
					return function (e) {
						if (self.allowZoom) self.zoomOut(e);
						e.stopPropagation();
					};
				})(this)
			);
			if (!CIQ.touchDevice) {
				this.makeModal(zoomIn);
				this.makeModal(zoomOut);
			}
		}
		if (home) {
			CIQ.safeClickTouch(
				home,
				(function (self) {
					return function (e) {
						e.stopPropagation();
						// If we are not in historical mode then scroll home
						if (!self.isHistoricalMode()) {
							self.home({ animate: true });
							return;
						}
						// If in historical mode delete any range the chart might have to prevent setting it again and call loadChart
						// This will be fast than scrolling and paginating forward as the chart progresses towards the current day
						delete self.layout.range;
						self.loadChart(self.chart.symbol, function () {
							self.home({ animate: false });
						});
					};
				})(this)
			);
			if (!CIQ.touchDevice) {
				this.makeModal(home);
			}
		}
	};
	
	/**
	 * Returns the chart to the home position, where the most recent tick is on the right side of the screen.
	 *
	 * By default the home() behavior is to maintain the white space currently on the right side of the chart.
	 * To align the chart to the right edge instead, set the white space to 0  by calling: `stxx.home({whitespace:0});` or `stxx.home({maintainWhitespace:false});`
	 *
	 * If you want to home the chart and also do a full reset of both the x and y axis zoom levels so they revert to the initial default settings, execute this:
	 * ```
	 * stxx.setCandleWidth(8);stxx.home(0);
	 * ```
	 *
	 * Keep in mind that certain floating labels, such as the `roundRectArrow` will prevent the chart from being flush to the right edge even if the white space is 0.
	 * This is to prevent bars from being obstructed by the protruding portion of the label.
	 *
	 * See {@link CIQ.ChartEngine#getLabelOffsetInPixels} and {@link CIQ.ChartEngine#yaxisLabelStyle} for more details.
	 *
	 * Used by <a href="CIQ.ChartEngine.html#htmlControls%5B%60home%60%5D">CIQ.ChartEngine.htmlControls.home.</a>
	 *
	 * @param {object} params Object containing the following keys:
	 * @param {boolean} [params.animate = false] Set to true to animate a smooth scroll to the home position.
	 * @param {boolean} [params.maintainWhitespace = true] Set to `true` to maintain the currently visible white space on the right of the chart, or to `false` to align to the right edge.
	 * @param {number} [params.whitespace = 0] Override to force a specific amount of whitespace on the right of the chart.
	 *		This will take precedence over `params.maintainWhitespace`
	 * @param {CIQ.ChartEngine.Chart} [params.chart] Chart to scroll home. If not defined, all chart objects will be returned to the home position.
	 * @memberof CIQ.ChartEngine
	 * @example
	 * stxx.home({maintainWhitespace:false});
	 */
	CIQ.ChartEngine.prototype.home = function (params) {
		this.swipe.amplitude = 0;
		var layout = this.layout;
		if (typeof params != "object") {
			// backward compatibility
			params = {
				maintainWhitespace: params
			};
		}
	
		function resetPanelZooms(stx) {
			for (var p in stx.panels) {
				var yAxes = stx.panels[p].yaxisLHS.concat(stx.panels[p].yaxisRHS);
				for (var a = 0; a < yAxes.length; a++)
					stx.calculateYAxisMargins(yAxes[a]);
			}
		}
		function scrollToCallback(self, chart, exactScroll) {
			return function () {
				resetPanelZooms(self);
				chart.scroll = exactScroll;
				self.draw();
			};
		}
		if (typeof params.maintainWhitespace == "undefined")
			params.maintainWhitespace = true; // maintain the whitespace unless set to false
	
		this.cancelTouchSingleClick = true;
		if (!this.chart.dataSet || !this.chart.dataSet.length) {
			// to clear out anything that may have been on the screen. Otherwise we still show stale data.
			this.draw();
			return;
		}
		this.micropixels = 0;
		var barsDisplayedOnScreen = Math.floor(this.chart.width / layout.candleWidth);
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
			if (params.chart && params.chart != chart) continue;
	
			var whitespace = 0;
			if (params.maintainWhitespace && this.preferences.whitespace >= 0)
				whitespace = this.preferences.whitespace;
			if (params.whitespace || params.whitespace === 0)
				whitespace = params.whitespace;
			var leftMargin = this.getLabelOffsetInPixels(chart, layout.chartType);
			if (leftMargin > whitespace) whitespace = leftMargin;
	
			var exactScroll = Math.min(barsDisplayedOnScreen, chart.dataSet.length); // the scroll must be the number of bars you want to see.
			if (this.chart.allowScrollPast) exactScroll = barsDisplayedOnScreen; // If whitespace allowed on left of screen
			this.micropixels =
				this.chart.width - exactScroll * layout.candleWidth - whitespace;
			this.preferences.whitespace = whitespace;
			while (this.micropixels > layout.candleWidth) {
				// If micropixels is larger than a candle then scroll back further
				exactScroll++;
				this.micropixels -= layout.candleWidth;
			}
			while (this.micropixels < 0) {
				exactScroll--;
				this.micropixels += layout.candleWidth;
			}
			this.micropixels -= layout.candleWidth;
			exactScroll++;
			if (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars)
				this.micropixels += layout.candleWidth / 2; // bar charts display at beginning of candle
	
			if (params.animate) {
				var self = this;
				this.scrollTo(
					chart,
					exactScroll,
					scrollToCallback(self, chart, exactScroll)
				);
			} else {
				chart.scroll = exactScroll;
				resetPanelZooms(this);
			}
		}
		this.draw();
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * This method calls {@link CIQ.ChartEngine#updateFloatHRLabel} to draw the label that floats along the Y axis with the
	 * current price for the crosshair.
	 * It also fills the date in the "stxx.controls.floatDate" (Style: `stx-float-date`) div which floats along the X axis.
	 * This is an appropriate place to inject an append method for drawing a heads up display if desired.
	 *
	 * You can use {@link CIQ.ChartEngine.XAxis#noDraw} and {@link CIQ.ChartEngine.YAxis#noDraw} to hide the floating labels and axis.
	 *
	 * It uses {@link CIQ.displayableDate} to format the floating label over the x axis, which can be overwritten as needed to achieve the desired results.
	 *
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias headsUpHR
	 * @since 09-2016-19 Only year and month will be displayed in monthly periodicity.
	 */
	CIQ.ChartEngine.prototype.headsUpHR = function () {
		if (this.runPrepend("headsUpHR", arguments)) return;
		var panel = this.currentPanel;
		if (!panel) return;
		var chart = panel.chart;
	
		this.updateFloatHRLabel(panel);
		var floatDate = this.controls.floatDate;
		function setFloatDate(val) {
			CIQ.efficientDOMUpdate(floatDate, "innerHTML", val);
		}
	
		if (floatDate && !chart.xAxis.noDraw) {
			var bar = this.barFromPixel(this.cx);
			var prices = chart.xaxis[bar];
			if (prices && prices.DT) {
				setFloatDate(CIQ.displayableDate(this, chart, prices.DT));
			} else if (prices && prices.index) {
				setFloatDate(prices.index);
			} else {
				setFloatDate(""); // there is no date to display
			}
		}
	
		this.runAppend("headsUpHR", arguments);
	};
	
	/**
	 * Sets the chart into a modal mode. Crosshairs are hidden and the chart will not respond to click or mouse events. Call this
	 * for instance if you are enabling a dialog box and don't want errant mouse activity to affect the chart.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.modalBegin = function () {
		this.openDialog = "modal";
		this.undisplayCrosshairs();
	};
	
	/**
	 * Ends modal mode. See {@link CIQ.ChartEngine#modalBegin}
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.modalEnd = function () {
		this.cancelTouchSingleClick = true;
		this.openDialog = "";
		this.doDisplayCrosshairs();
	};
	
	/**
	 * Convenience function to attach a modal on mouse events
	 * @param {HTMLElement} Element to attach the modal to
	 * @private
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.makeModal = function (element) {
		var self = this;
		element.onmouseover = function (event) {
			self.modalBegin();
		};
		element.onmouseout = function (event) {
			self.modalEnd();
		};
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Updates the position of the stxx.controls.floatDate element ( Style: `stx-float-date` ) and calls {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} to display the crosshairs labels on both x and y axis.
	 * A timer is used to prevent this operation from being called more frequently than once every 100 milliseconds in order to
	 * improve performance during scrolling.
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias updateChartAccessories
	 */
	CIQ.ChartEngine.prototype.updateChartAccessories = function () {
		if (this.accessoryTimer !== null) clearTimeout(this.accessoryTimer);
		if (!CIQ.ChartEngine.drawingLine && CIQ.touchDevice) {
			if (new Date().getTime() - this.lastAccessoryUpdate < 100) {
				this.accessoryTimer = setTimeout(
					(function (stx) {
						return function () {
							stx.updateChartAccessories();
						};
					})(this),
					10
				);
				return;
			}
		}
		if (!this.chart.dataSet) return;
		if (this.runPrepend("updateChartAccessories", arguments)) return;
		this.accessoryTimer = null;
		this.lastAccessoryUpdate = new Date().getTime();
		var floatDate = this.controls.floatDate;
		if (floatDate) {
			var panel = this.currentPanel;
			if (!panel) panel = this.chart.panel;
			if (panel) {
				var chart = panel.chart;
				var bottom =
					this.xAxisAsFooter === true
						? 0
						: this.chart.canvasHeight - panel.chart.bottom;
				var halfLabelWidth = floatDate.offsetWidth / 2 - 0.5;
				var l = this.pixelFromTick(this.crosshairTick, chart) - halfLabelWidth;
				if (l < 0) l = 0;
				else if (l > this.width - 2 * halfLabelWidth - 1)
					l = this.width - 2 * halfLabelWidth - 1;
				CIQ.efficientDOMUpdate(floatDate.style, "left", l + "px");
				CIQ.efficientDOMUpdate(floatDate.style, "bottom", bottom + "px");
			}
		}
		this.positionCrosshairsAtPointer();
		this.headsUpHR();
		this.runAppend("updateChartAccessories", arguments);
	};
	
	/**
	 * Positions a "sticky" (a tooltip element). It is positioned relative to the cursor but so that it is always available and never
	 * accidentally tappable on a touch device.
	 * @param  {HTMLElement} m The sticky
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.positionSticky = function (m) {
		var top = Math.max(this.cy - m.offsetHeight - 60, 0);
		var right = Math.min(
			this.chart.canvasWidth - (this.cx - 50),
			this.chart.canvasWidth - m.offsetWidth
		);
		m.style.top = top + "px";
		m.style.right = right + "px";
	};
	
	/**
	 * Displays the "sticky" (tooltip element). The sticky should be in `CIQ.ChartEngine.controls.mSticky`.
	 *
	 * To disable stickies, set that element to null. See {@link CIQ.ChartEngine.htmlControls}.
	 *
	 * To customize, see the [Using and Customizing Drawing Tools](tutorial-Using%20and%20Customizing%20Drawing%20Tools.html#customSticky) tutorial.
	 *
	 * @param  {object} params Optional arguments to pass into the function.
	 * @param  {string} [params.message] The message to display in the sticky.
	 * @param  {string} [params.backgroundColor] The background color for the sticky (the foreground color is selected automatically).
	 * @param  {boolean} [params.forceShow] If true, always shows the sticky (as opposed to only on hover).
	 * @param  {boolean} [params.noDelete] If true, hides the delete instructions/button.
	 * @param  {boolean} [params.noEdit] If true, hides the edit instructions/button.
	 * @param  {string} [params.type] Set to "study","drawing","series", or whatever causes the sticky to be displayed.
	 * @param  {function} [params.positioner] Sets custom positioning behavior for the sticky. Called with `Function.prototype.call()`,
	 * 		specifying the engine instance as context. Called with one argument, which is a reference to the sticky element.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 6.0.0 Consolidated arguments into the `params` object.
	 * - 6.3.0 Added the `noEdit` parameter.
	 * - 7.4.0 Added the `positioner` parameter.
	 */
	CIQ.ChartEngine.prototype.displaySticky = function (params) {
		var m = this.controls.mSticky;
		if (!m) return;
		var mi = m.querySelector(".mStickyInterior");
		if (!mi) return;
		var overlayTrashCan = m.querySelector(".overlayTrashCan");
		var overlayEdit = m.querySelector(".overlayEdit");
		var mouseDeleteInstructions = m.querySelector(".mouseDeleteInstructions");
		var longPressText = m.querySelector(".stickyLongPressText");
		mouseDeleteInstructions.classList.remove("no_edit");
		// backwards compatibility:
		if (!params || typeof params != "object")
			params = {
				message: arguments[0],
				backgroundColor: arguments[1],
				forceShow: arguments[2],
				noDelete: arguments[3],
				type: arguments[4]
			};
		var message = params.message,
			backgroundColor = params.backgroundColor,
			forceShow = params.forceShow,
			noDelete = params.noDelete,
			noEdit = params.noEdit,
			type = params.type;
		if (!forceShow && !message) {
			mi.innerHTML = "";
			m.style.display = "none";
			if (overlayTrashCan) overlayTrashCan.style.display = "none";
			if (overlayEdit) overlayEdit.style.display = "none";
			if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = "none";
			if (longPressText) longPressText.style.display = "none";
		} else {
			if (!message) message = "";
			var defaultColor = this.defaultColor;
			if (backgroundColor == "auto") backgroundColor = defaultColor;
			if (forceShow && !message) {
				mi.style.backgroundColor = "";
				mi.style.color = "";
				mi.style.display = "none";
			} else if (backgroundColor) {
				mi.style.backgroundColor = backgroundColor;
				mi.style.color = CIQ.isTransparent(backgroundColor)
					? defaultColor
					: CIQ.chooseForegroundColor(backgroundColor);
				mi.style.display = "inline-block";
			} else {
				mi.style.backgroundColor = "";
				mi.style.color = "";
				mi.style.display = "inline-block";
			}
			mi.innerHTML = message;
			var rtClick = m.querySelector(".mStickyRightClick");
			rtClick.className = "mStickyRightClick"; //reset
			if (type) rtClick.classList.add("rightclick_" + type);
			rtClick.style.display = "";
			m.style.display = "inline-block";
			var draggableObject = this.highlightedDraggable; // set by findHighlights
			if (
				!draggableObject ||
				(draggableObject &&
					draggableObject.undraggable &&
					draggableObject.undraggable(this))
			) {
				longPressText.style.display = "none";
			}
			if (
				noDelete ||
				this.bypassRightClick === true ||
				this.bypassRightClick[type]
			) {
				rtClick.style.display = "none";
			} else if (this.highlightViaTap || this.touches.length) {
				if (overlayTrashCan) overlayTrashCan.style.display = "inline-block";
				if (overlayEdit && !noEdit) overlayEdit.style.display = "inline-block";
				if (mouseDeleteInstructions)
					mouseDeleteInstructions.style.display = "none";
				if (longPressText) longPressText.style.display = "none";
				m.classList[message === "" ? "add" : "remove"]("hide");
			} else {
				if (noEdit) mouseDeleteInstructions.classList.add("no_edit");
				if (mouseDeleteInstructions) {
					mouseDeleteInstructions.style.display = "block";
				}
				if (longPressText) {
					longPressText.style.display = "none";
					var drag = this.preferences.dragging;
					if (drag && params.panel && !params.panel.noDrag) {
						if ((drag === true || drag.study) && type == "study")
							longPressText.style.display = "block";
						else if ((drag === true || drag.series) && type == "series")
							longPressText.style.display = "block";
					}
				}
			}
	
			var stickyType = type || "default";
			m.setAttribute("cq-sticky-type", stickyType);
	
			var positionSticky = params.positioner || this.positionSticky;
			positionSticky.call(this, m);
		}
	};
	
	/**
	 * Adds a message to the chart.
	 *
	 * Creates a `div` containing a text message. Appends the `div` to the
	 * <a href="CIQ.ChartEngine.html#htmlControls%5B%60notificationTray%60%5D">
	 * CIQ.ChartEngine.htmlControls.notificationTray</a>.
	 *
	 * Notifications can be interactive (see the `callback` and `dismissalListeners` parameters),
	 * and they can be queried by their names, which are set as class names on the
	 * notification `div`.
	 *
	 * @param {string} name The name of the notification, which is added to the class list of the
	 * 		notification `div`.
	 * @param {string} message Text to display in the notification `div`.
	 * @param {object} [params] Configuration parameters.
	 * @param {function} [params.callback] Added to the notification `div` as a listener for the
	 * 		"pointer up" event.
	 * @param {Array} [params.dismissalListeners] Array of event listeners added to the
	 * 		notification.
	 * @param {string} params.dismissalListeners.type The listener event type. See
	 * 		{@link CIQ.ChartEngine#addEventListener}.
	 * @param {function} params.dismissalListeners.callback The listener callback function.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.prototype.displayNotification = function (
		name,
		message,
		params = {}
	) {
		if (!this.controls.notificationTray) return;
	
		const { callback, dismissalListeners } = params;
		const notificationTray = this.controls.notificationTray;
		let fragment = notificationTray
			.querySelector("template")
			.content.cloneNode(true);
		const notification = fragment.firstElementChild;
	
		notification.className = name;
		notification.querySelector(".message").textContent = message;
	
		if (callback) {
			// iOS version < 13.2 and some older browsers don't support pointer events.
			// Fallback to touch events in these cases.
			let leaveHandler = window.PointerEvent ? "pointerup" : "touchend";
			notification.handler = notification.addEventListener(
				leaveHandler,
				callback
			);
		}
	
		if (dismissalListeners) {
			notification.listeners = {};
			dismissalListeners.forEach((listener) => {
				notification.listeners[name] = this.addEventListener(
					listener.type,
					listener.callback
				);
			});
		}
	
		this.makeModal(notification);
	
		notificationTray.appendChild(notification);
	};
	
	/**
	 * Removes a notification from the
	 * <a href="CIQ.ChartEngine.html#htmlControls%5B%60notificationTray%60%5D">
	 * CIQ.ChartEngine.htmlControls.notificationTray</a>.
	 *
	 * @param {string} name The name of the notification that is removed.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.prototype.removeNotification = function (name) {
		if (!this.controls.notificationTray) return;
	
		const notificationTray = this.controls.notificationTray;
		let notification = notificationTray.querySelector(`.${name}`);
	
		if (notification) {
			if (notification.handler)
				notification.removeEventListener(notification.handler);
			if (notification.listeners) {
				for (const listener in notification.listeners) {
					this.removeEventListener(notification.listeners[listener]);
				}
			}
			this.modalEnd();
			notificationTray.removeChild(notification);
		}
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Sets the innerHTML value of the `.mMeasure` HTML DOM Node to contain a measurement (price differential and bars/line distance), usually when a user hovers over a drawing.
	 * It is also used to display measurement as a drawing is being created or when using the 'Measure' tool.
	 *
	 * It also sets `this.controls.mSticky` with the measurement and displays it on `mSticky` on hover.
	 *
	 * Example: <B>23.83 (-12%) 11 Bars</B>
	 *
	 * It requires the UI to include the following div: ```<div class="currentMeasure"><span class="mMeasure"></span></div>```
	 *
	 * It can be styled via CSS. See example.
	 *
	 * @param {number} price1 Beginning price of the drawing
	 * @param {number|boolean} price2 Ending price of the drawing, pass <code>false</code> if you want to skip price and percentage display
	 * @param {number} tick1  Beginning tick of the drawing
	 * @param {number|boolean} tick2  Ending tick of the drawing, pass <code>false</code> if you want to skip tick count display
	 * @param {boolean} hover  True to turn on the measurement, false to turn it off
	 * @param {string} [name]  Name of drawing, not used by default but passed into injection
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0 Added name argument.
	 * - 6.0.0 Allow price2 and tick2 to be false, skipping the respective display.
	 * @example
	 * // Measuring tool styling CSS sample
	 * .currentMeasure {
	 *     text-align: left;
	 *     display: inline-block;
	 *     margin: 4px 0 0 20px;
	 *     height: 20px;
	 *     line-height: 20px;
	 * }
	
	 * .mMeasure {
	 *     display: inline-block;
	 *     margin: 0 0 0 0;
	 *     overflow: hidden;
	 *     text-overflow: ellipsis;
	 *     white-space: nowrap;
	 *     width:140px;
	 * }
	 * @example
	 * // This is an example of the framework to use for writing a prepend to further manipulate/display the measurements
	 * CIQ.ChartEngine.prototype.prepend("setMeasure",function() {
	 *
	 *     var m = document.querySelector(".mMeasure");
	 *
	 *     if (!m) return; // Can't show a measurement if the div is not present.
	 *
	 *     // Add your logic to manage the display of the measurements (price1, price2, tick1, tick2).
	 *     //*****************************************
	 *     var message = 'blah measurement';
	 *     //*****************************************
	 *
	 *     m.innerHTML = message;
	 *
	 *     if (this.activeDrawing) return;  // Don't show measurement Sticky when in the process of drawing.
	 *
	 *     m = this.controls.mSticky;
	 *     if (m) {
	 *         var mStickyInterior = m.querySelector(".mStickyInterior");
	 *         if (hover) {
	 *             m.style.display = "inline-block";
	 *             mStickyInterior.style.display = "inline-block";
	 *             if(price1) {
	 *                 mStickyInterior.innerHTML = message;
	 *             }
	 *             this.positionSticky(m);
	 *         } else {
	 *             m.style.display = "none";
	 *             mStickyInterior.innerHTML = "";
	 *         }
	 *     }
	 *
	 *  //return true; // If you don't want to continue into the regular function.
	 *  //return false; // If you want to run through the standard function once you are done with your custom code.
	 * });
	 */
	CIQ.ChartEngine.prototype.setMeasure = function (
		price1,
		price2,
		tick1,
		tick2,
		hover,
		name
	) {
		if (this.runPrepend("setMeasure", arguments)) return;
		var m = (this.drawingContainer || document).querySelector(".mMeasure");
		var message = "";
		if (!price1 && price1 !== 0) {
			if (!this.anyHighlighted && this.currentVectorParameters.vectorType === "")
				this.clearMeasure();
		} else {
			if (price2 !== false) {
				var distance =
					Math.round(Math.abs(price1 - price2) * this.chart.roundit) /
					this.chart.roundit;
				distance = distance.toFixed(this.chart.yAxis.printDecimalPlaces);
				if (this.internationalizer) {
					message += this.internationalizer.numbers.format(distance);
				} else {
					message += distance;
				}
				var pct;
				if (price1 > 0 && price2 > 0) {
					pct = (price2 - price1) / price1;
					if (Math.abs(pct) > 0.1) {
						pct = Math.round(pct * 100);
					} else if (Math.abs(pct) > 0.01) {
						pct = Math.round(pct * 1000) / 10;
					} else {
						pct = Math.round(pct * 10000) / 100;
					}
					if (this.internationalizer) {
						pct = this.internationalizer.percent.format(pct / 100);
					} else {
						pct = pct + "%";
					}
					message += " (" + pct + ")";
				}
			}
			if (tick2 !== false) {
				var ticks = Math.abs(tick2 - tick1);
				ticks = Math.round(ticks) + 1;
				var barsStr = this.translateIf("Bars");
				message += " " + ticks + " " + barsStr;
			}
	
			if (m) m.innerHTML = message;
		}
	
		if (this.activeDrawing) return; // Don't show measurement Sticky when in the process of drawing
		m = this.controls.mSticky;
		if (m) {
			var mStickyInterior = m.querySelector(".mStickyInterior");
			if (hover) {
				m.style.display = "inline-block";
				mStickyInterior.style.display = "inline-block";
				if (price1 || price1 === 0) {
					mStickyInterior.innerHTML = message;
				}
				m.classList[message === "" ? "add" : "remove"]("hide");
				this.positionSticky(m);
			} else {
				m.style.display = "none";
				mStickyInterior.innerHTML = "";
			}
		}
		this.runAppend("setMeasure", arguments);
	};
	
	/**
	 * Clears the innerHTML value of the `.mMeasure` HTML DOM Node.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.clearMeasure = function () {
		var m = (this.drawingContainer || document).querySelector(".mMeasure");
		if (m) m.innerHTML = "";
	};
	
	/**
	 * Effects a zoom from either zoomIn() or zoomOut(). Called from an EaseMachine
	 * @param  {number} candleWidth  The new candleWidth
	 * @param  {CIQ.ChartEngine.Chart} chart        The chart to center
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0 Will maintain tick position near the cursor if <a href="CIQ.ChartEngine.html#preferences%5B%60zoomAtCurrentMousePosition%60%5D">CIQ.ChartEngine.preferences.zoomAtCurrentMousePosition</a> is `true`.
	 * - 4.1.0 Will keep left edge stable and zoom to the right when white space is present on the left.
	 */
	CIQ.ChartEngine.prototype.zoomSet = function (candleWidth, chart) {
		candleWidth = this.constrainCandleWidth(candleWidth);
		if (this.chart.tempCanvas.style.display != "none")
			CIQ.clearCanvas(this.chart.tempCanvas, this);
		var mainSeriesRenderer = this.mainSeriesRenderer || {};
		if (!mainSeriesRenderer.params || !mainSeriesRenderer.params.volume) {
			var maintainTick;
			if (
				this.preferences.zoomAtCurrentMousePosition &&
				this.zoomInitiatedByMouseWheel &&
				this.crosshairTick < chart.dataSet.length
			) {
				// keep the bar near the cursor stable
				// at chart load it is possible for this.crosshairTick to be null (refresh while cursor is in the xAxis margin)
				maintainTick = this.crosshairTick || this.tickFromPixel(this.cx, chart);
			} else if (this.isHome()) {
				// keep right edge stable and zoom to the left
				maintainTick = chart.dataSet.length - 1;
			} else if (this.chart.scroll > this.chart.dataSet.length) {
				// keep left edge stable and zoom to the right
				maintainTick = 0;
			} else if (this.grabMode == "zoom-x") {
				// keep right edge stable and zoom to the left
				maintainTick = this.tickFromPixel(this.chart.width, chart);
			} else {
				// keep the center bar in the center and zoom equally left and right
				maintainTick = this.tickFromPixel(this.chart.width / 2, chart);
			}
			if (this.animations.zoom.hasCompleted) {
				this.zoomInitiatedByMouseWheel = false;
			}
			// this is the code that keeps the chart's position stable.
			// Bypassing this code will cause the chart's left position to remain stable
			// which is really the only way to get a smooth zoom for variable width candles (because the act of scrolling inherently changes the number of candles that fit on the screen)
			var distanceFromFront = chart.dataSet.length - 1 - maintainTick;
			var oldScroll = chart.scroll;
			chart.scroll =
				Math.round(
					(this.pixelFromTick(maintainTick, chart) - chart.left) / candleWidth
				) +
				1 +
				distanceFromFront;
			this.micropixels +=
				(oldScroll - distanceFromFront) * this.layout.candleWidth -
				(chart.scroll - distanceFromFront) * candleWidth;
		}
		this.setCandleWidth(candleWidth);
		chart.spanLock = false;
		this.draw();
		this.doDisplayCrosshairs();
		this.updateChartAccessories();
	};
	
	};
	
	
	let __js_core_engine_baselines_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	/**
	 * A reference to the renderer of the baseline whose handle is currently selected.
	 *
	 * The baseline handle can be accessed from {@link CIQ.ChartEngine#baselineHelper}.
	 *
	 * @type {CIQ.Renderer}
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.currentBaseline = null;
	
	/**
	 * Baseline helper for the chart engine.
	 *
	 * Maps renderers to value objects that contain data related to the baseline, including the
	 * baseline handle (a reference to the DOM element that functions as the handle).
	 *
	 * @type {Map<CIQ.Renderer, object>}
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.baselineHelper = null;
	
	CIQ.ChartEngine.helpersToRegister.push(function (stx) {
		stx.baselineHelper = new Map();
	});
	
	/**
	 * Adds an entry to {@link CIQ.ChartEngine#baselineHelper} with `renderer` as the key and a
	 * dynamically created object as the value. The value object contains data related to the
	 * baseline.
	 *
	 * If the renderer is the renderer of the main series, sets the handle property of the value
	 * object to <code>CIQ.ChartEngine.htmlControls[&#96;baselineHandle&#96;]</code>; otherwise,
	 * creates a baseline handle DOM element and adds a reference to the DOM element to the value
	 * object and to the chart controls object, {@link CIQ.ChartEngine.htmlControls}. The handle is
	 * accessed in the chart controls object by a property name that is the concatenation of the
	 * renderer name and "cq-baseline-handle", for example:
	 * ```
	 * stxx.controls[`${renderer.params.name} cq-baseline-handle`];
	 * ```
	 *
	 * @param {CIQ.Renderer} renderer The renderer to register as the key of the baseline helper.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.registerBaselineToHelper = function (renderer) {
		if (!renderer.params.baseline) return;
		const { baselineHelper } = this;
		const self = this;
		if (!baselineHelper.has(renderer)) {
			const { name } = renderer.params;
			let defaultHandle = this.controls.baselineHandle;
			baselineHelper.set(renderer, {
				styleCache: null,
				display: false,
				handle:
					name === "_main_series" && defaultHandle
						? defaultHandle
						: createHandle(name)
			});
		}
	
		function createHandle(name) {
			name = name.replace(" ", "_");
			const handle = document.createElement("cq-baseline-handle");
			handle.classList.add("stx-baseline-handle", name);
			self.container.append(handle);
			self.controls[`${name} cq-baseline-handle`] = handle;
			return handle;
		}
	};
	
	/**
	 * Removes a renderer from {@link CIQ.ChartEngine#baselineHelper}.
	 *
	 * If the renderer is not the renderer of the main series, removes the baseline handle associated
	 * with the renderer from the chart controls object, {@link CIQ.ChartEngine.htmlControls} (see
	 * also {@link CIQ.ChartEngine#registerBaselineToHelper}).
	 *
	 * @param {CIQ.Renderer} renderer The renderer to remove from the baseline helper.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.removeBaselineFromHelper = function (renderer) {
		const { baselineHelper } = this;
		if (baselineHelper.has(renderer)) {
			const name = renderer.params.name.replace(" ", "_");
			if (name !== "_main_series") {
				let handle = baselineHelper.get(renderer).handle;
				delete this.controls[`${name} cq-baseline-handle`];
				this.container.removeChild(handle);
			}
			baselineHelper.delete(renderer);
		}
	};
	
	/**
	 * Checks an emitted event to determine whether a baseline handle DOM element is the event target
	 * or is in the
	 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath" target="_blank">
	 * composed path</a> of the event. If so, sets {@link CIQ.ChartEngine#currentBaseline} to the
	 * renderer of the baseline positioned by the handle.
	 *
	 * @param {Event} e The event that is checked to determine whether a baseline handle is the event
	 * 		target or is in the propagation path of the event.
	 * @param {boolean} grabStart If true (and a baseline handle is the event target or is in the
	 * 		event path), baseline repositioning is initiated.
	 * @return {boolean} True if a baseline handle is the event target or is in the path of the event,
	 * 		otherwise false.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.findBaselineHandle = function (e, grabStart) {
		for (const baseline of this.baselineHelper) {
			const [renderer, values] = baseline;
			const { handle } = values;
			if (
				e.target === handle ||
				(e.composedPath && e.composedPath().includes(handle))
			) {
				if (grabStart) {
					this.repositioningBaseline = { lastDraw: Date.now(), handle, renderer };
					handle.classList.add("stx-grab");
				}
				this.currentBaseline = renderer;
				return true;
			}
		}
		return false;
	};
	
	/**
	 * Sets `baseline.actualLevel` for any line renderers that are attached to the chart. (See the
	 * `baseline` parameter of {@link CIQ.Renderer.Lines}, which may be type
	 * {@link CIQ.ChartEngine.Chart#baseline}.)
	 *
	 * **Note:** Does not set <a href="CIQ.ChartEngine.Chart.html#baseline%5B%60actualLevel%60%5D">
	 * CIQ.ChartEngine.Chart#baseline[&#96;actualLevel&#96;]</a>; that is done in
	 * {@link CIQ.ChartEngine.AdvancedInjectable#createDataSegment}.
	 *
	 * @param {CIQ.ChartEngine.Chart} chart Chart for which the renderer baseline levels are set.
	 * @memberof CIQ.ChartEngine
	 * @since 8.1.0
	 */
	CIQ.ChartEngine.prototype.setBaselines = function (chart) {
		if (!chart) chart = this.chart;
		const self = this;
		const { baselineHelper } = this;
		baselineHelper.forEach(function (values, renderer) {
			let { baseline } = renderer.params;
			const useMain = baseline === true;
			if (useMain) baseline = chart.baseline;
			let { defaultLevel, userLevel } = baseline;
			const yAxis = renderer.getYAxis(self);
			// When interacting with the chart, occasionally yAxis or panel parameter not up to date b/c it we are currently being modifying something.
			// In this case return, to let the modifications finish and the final draw call will correct everything.
			if (!yAxis) return;
			const yBaselineRenderer = self.getYAxisBaselineRenderer(yAxis);
			// Default to the first series on the active renderer of a yAxis
			const id =
				yBaselineRenderer &&
				yBaselineRenderer != self.mainSeriesRenderer &&
				yBaselineRenderer.seriesParams.length &&
				yBaselineRenderer.seriesParams[0].id;
	
			baseline.actualLevel =
				userLevel || userLevel === 0 ? userLevel : defaultLevel;
			if (!baseline.actualLevel && baseline.actualLevel !== 0)
				baseline.actualLevel = calculateActualLevel(id, useMain);
	
			values.display = yBaselineRenderer === renderer ? true : false;
			baselineHelper.set(renderer, values);
		});
	
		function calculateActualLevel(id, useMain) {
			const { dataSegment, dataSet, defaultPlotField } = chart;
			let field = defaultPlotField;
			if (!useMain) field = id;
			let position = self.getFirstLastDataRecord(dataSegment, "tick").tick;
	
			while (true) {
				const quote = dataSet[position];
				if (quote) {
					if (!useMain || field != "Close") {
						const q1 = dataSet[position - 1];
						if (q1 && (q1[field] || q1[field] === 0)) {
							const q = q1[field];
							return typeof q === "object" ? q[defaultPlotField] : q;
						}
					} else if (quote.iqPrevClose || quote.iqPrevClose === 0) {
						return quote.iqPrevClose;
					}
				}
				position--;
				if (position < 0) break;
			}
		}
	};
	
	/**
	 * Sets the userLevel of the baseline; that is, the position of the baseline as it being
	 * repositioned by the user (see CIQ.ChartEngine.Chart#baseline[`userLevel`]).
	 *
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.setBaselineUserLevel = function () {
		const { chart, currentPanel: panel } = this;
		const { lastDraw, renderer } = this.repositioningBaseline;
	
		if (renderer.params.panel != panel.name) return;
	
		const { baseline: defaultBaseline } = chart;
		const baseline =
			typeof renderer.params.baseline === "object"
				? renderer.params.baseline
				: defaultBaseline;
		const rAxis = renderer.getYAxis(this);
		const value = this.valueFromPixel(
			this.backOutY(CIQ.ChartEngine.crosshairY),
			panel,
			rAxis
		);
	
		baseline.userLevel = this.adjustIfNecessary(panel, this.crosshairTick, value);
	
		if (Date.now() - lastDraw > 100) {
			this.draw();
			this.repositioningBaseline.lastDraw = Date.now();
		}
	};
	
	/**
	 * Sets the minimum and maximum values for a y-axis based on the position of the baseline
	 * associated with the axis.
	 *
	 * @param {number[]} minMax A tuple representing the minimum and maximum values in `dataSegment`.
	 * @param {CIQ.ChartEngine.YAxis} yAxis The y-axis for which the minimum and maximum values are
	 * 		set.
	 * @return {number[]} A tuple representing the minimum and maximum values of `yAxis`.
	 *
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.setBaselineMinMax = function (minMax, yAxis) {
		const { baselineHelper, chart, repositioningBaseline } = this;
		const { baseline: defaultBaseline, seriesRenderers } = chart;
		const doTransform = chart.transformFunc && yAxis === chart.panel.yAxis;
	
		const baselineToDisplay = yAxis.renderers.find((name) => {
			return baselineHelper.get(seriesRenderers[name]);
		});
	
		if (!baselineToDisplay) return minMax; // No baselines found
	
		let { baseline, type } = seriesRenderers[baselineToDisplay].params;
		if (type === "mountain") return minMax;
	
		baseline = typeof baseline === "object" ? baseline : defaultBaseline;
		let { actualLevel } = baseline;
		if (actualLevel || actualLevel === 0) {
			if (doTransform)
				actualLevel = chart.transformFunc(this, chart, actualLevel);
			const diff = Math.max(actualLevel - minMax[0], minMax[1] - actualLevel);
			minMax[0] = repositioningBaseline ? yAxis.lowValue : actualLevel - diff;
			minMax[1] = repositioningBaseline ? yAxis.highValue : actualLevel + diff;
		}
		return minMax;
	};
	
	/**
	 * Positions a baseline handle within the chart area.
	 *
	 * @param {CIQ.Renderer} renderer The renderer that renders the baseline.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.positionBaselineHandle = function (renderer) {
		if (!this.manageTouchAndMouse) return;
		const { baselineHelper, chart, panels } = this;
		let { baseline, panel: panelName } = renderer.params;
		const yAxis = renderer.params.yAxis || renderer.getYAxis(this);
		let { display: displayed, handle, styleCache } = baselineHelper.get(renderer);
	
		if (baseline === true) baseline = chart.baseline;
		if (baseline.userLevel === false || !displayed) {
			handle.style.display = "none";
			return;
		}
		const panel = panels[panelName];
		const grabbed = handle.classList.contains("stx-grab");
		let display = "block";
	
		let price = baseline.actualLevel;
		if (chart.transformFunc) price = chart.transformFunc(this, chart, price);
		if (price > yAxis.high) {
			price = yAxis.high;
			if (!grabbed) display = "none";
		} else if (price < yAxis.low) {
			price = yAxis.low;
			if (!grabbed) display = "none";
		}
	
		// If chart has been transformed, transform it back or it will be transformed twice!
		if (chart.untransformFunc) price = chart.untransformFunc(this, chart, price);
	
		const basePixel = this.pixelFromPrice(price, panel, yAxis);
		if (!styleCache) styleCache = getComputedStyle(handle);
		const width = CIQ.stripPX(styleCache.width);
	
		let top = `${basePixel - CIQ.stripPX(styleCache.height) / 2}px`;
	
		let left;
		let buffer = this.baselineHandleBuffer || 2;
		let rightIndex = panel.yaxisRHS.indexOf(yAxis) + 1;
		if (rightIndex) {
			let pad = rightIndex === 1 ? buffer : buffer * rightIndex;
			left = `${chart.right - width * rightIndex - pad}px`;
		} else {
			let leftIndex = panel.yaxisLHS.slice(0).reverse().indexOf(yAxis) + 1;
			let pad = leftIndex === 1 ? buffer : buffer * leftIndex;
			left = `${chart.left + width * leftIndex + pad - width}px`;
		}
		Object.assign(handle.style, { display, top, left });
	};
	
	/**
	 * Gets the baseline renderer associated with a y-axis.
	 *
	 * Since a y-axis can only have one baseline associated with it, this function searches the
	 * renderers property of the axis, checking for the first renderer that matches an entry in
	 * {@link CIQ.ChartEngine#baselineHelper}.
	 *
	 * @param {CIQ.ChartEngine.YAxis} yAxis The y-axis whose list of renderers is checked for a
	 * 		baseline renderer.
	 * @return {CIQ.Renderer|null} The y-axis renderer that renders a baseline or, if a baseline
	 * 		renderer is not associated with the y-axis, null.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.getYAxisBaselineRenderer = function (yAxis) {
		if (!yAxis.renderers.length) return null;
		const { baselineHelper, chart } = this;
	
		let name = yAxis.renderers.find((name) => {
			return baselineHelper.get(chart.seriesRenderers[name]);
		});
	
		if (!name) return null;
		return chart.seriesRenderers[name];
	};
	
	/**
	 * Gets the baseline object for a y-axis associated with a baseline.
	 *
	 * A y-axis can be associated with only one baseline; and so, can have only one baseline renderer
	 * and one baseline object.
	 *
	 * @param {CIQ.ChartEngine.YAxis} yAxis A y-axis associated with a baseline.
	 * @returns {object} The baseline object of the y-axis baseline renderer if the y-axis has a
	 * 		baseline renderer and the baseline parameter of the renderer is an object; otherwise,
	 * 		the default chart baseline object, {@link CIQ.ChartEngine.Chart#baseline}.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 *
	 * @see {@link CIQ.ChartEngine#getYAxisBaselineRenderer}
	 */
	CIQ.ChartEngine.prototype.getYAxisBaseline = function (yAxis) {
		const { baseline: defaultBaseline } = this.chart;
		const baselineRenderer = this.getYAxisBaselineRenderer(yAxis);
	
		if (!baselineRenderer) return defaultBaseline;
		const { baseline } = baselineRenderer.params;
		return typeof baseline === "object" ? baseline : defaultBaseline;
	};
	
	};
	
	
	let __js_core_engine_chart_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Defines an object used for rendering a chart and is automatically created by the {@link CIQ.ChartEngine}.
	 * Chart objects contain the data and config for each chart but they don't actually exist on the screen until a panel is attached.
	 * A chart object is attached to both the main chart panel and any related study panels so they can share the same chart data.
	 *
	 * Example: stxx.panels['chart'].chart
	 *
	 * Example: stxx.chart (convenience shortcut for accessing the main chart object - same as above)
	 *
	 * Example stxx.panels['Aroon (14)'].chart
	 *
	 * @constructor
	 * @name  CIQ.ChartEngine.Chart
	 */
	CIQ.ChartEngine.Chart = function () {
		this.xAxis = new CIQ.ChartEngine.XAxis();
		this.yAxis = new CIQ.ChartEngine.YAxis();
		this.symbolObject = { symbol: null };
		this.series = {};
		this.seriesRenderers = {};
		this.xaxis = [];
		this.state = {};
		this.endPoints = {};
		this.defaultChartStyleConfig = {};
		this.baseline = CIQ.clone(this.baseline); // copy from prototype
		/**
		 * @type CIQ.ChartEngine.Panel
		 * @memberof CIQ.ChartEngine.Chart#
		 */
		this.panel = undefined;
	};
	
	CIQ.extend(
		CIQ.ChartEngine.Chart.prototype,
		{
			/**
			 * The current symbol for the chart
			 * @type string
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			symbol: null,
			/**
			 * The current symbolObject for the chart. Generally this is simply `{symbol: symbol}`.
			 * This is initialized by {@link CIQ.ChartEngine#loadChart}.
			 * @type {object}
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			symbolObject: { symbol: null },
			/**
			 * Set this to preset an alternate name for the symbol on the chart label and comparison legend.
			 * You can set  `stxx.chart.symbolDisplay='yourName'; ` right before calling `loadChart()`.
			 * Alternatively, a good place to set it is in your fetch function, if using {@link quotefeed}. See example.
			 * @type string
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example
			 * // on your initial data fetch call add the following
			 * params.stx.chart.symbolDisplay='yourName for '+params.symbol;
			 */
			symbolDisplay: null,
			/**
			 * Contains information about the series that are associated with the chart.
			 * Series are additional data sets, such as used for comparison charts.
			 * Note that a series may have a different y-axis calculation than the price chart.
			 * See the "parameters" section of {@link CIQ.ChartEngine#addSeries} for details
			 * @type {object}
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			series: {},
			/**
			 * Contains "renderers" that are used to create the visualizations for series.
			 *
			 * Renderers will be drawn in their object order, which can be altered if needed to force certain renderings to be drawn before or after others. See example.
			 *
			 * @type {object}
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example <caption> This sample code shows how to move up one place a renderer called "comparison D" </caption>
			 * var rendererName = "comparison D";
			 * var newRenderers = {};
			 * var pos = 0;
			 * var r;
			 *
			 * for (r in stxx.chart.seriesRenderers) {
			 *     if (r == rendererName) break;
			 *     pos++;
			 * }
			 *
			 * if (pos) { // Not already at top.
			 *     var i = 0;
			 *     for (r in stxx.chart.seriesRenderers) {
			 *         if (i == pos - 1) newRenderers[rendererName] = stxx.chart.seriesRenderers[rendererName];
			 *         if (r == rendererName) continue;
			 *         newRenderers[r] = stxx.chart.seriesRenderers[r];
			 *         i++;
			 *     }
			 *     stxx.chart.seriesRenderers = newRenderers;
			 * }
			 */
			seriesRenderers: {},
			/**
			 * Current number of ticks scrolled in from the end of the chart.
			 * Setting to zero would theoretically cause the chart to be scrolled completely to the left showing an empty canvas.
			 * Setting to 10 would display the last 10 candles on the chart.
			 * Setting to `maxTicks` would display a full screen on the chart (assuming enough data is available).
			 *
			 * To immediately activate, call [draw()]{@link CIQ.ChartEngine#draw}
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example <caption> Scroll to the most current (beginning) position in the chart.</caption>
			 * stxx.chart.scroll=0;
			 * @example <caption> Scroll to the end of the chart.</caption>
			 * stxx.chart.scroll=stxx.chart.dataSet.length;
			 */
			scroll: 0,
			isComparison: false, // Used internally, indicates if chart is in comparison mode
			/**
			 * If true, [comparisons]{@link CIQ.ChartEngine#addSeries} force a 'percent' chart scale every time a new series is added,
			 * and once the last comparison series is removed, the chart will be forced to 'linear' scale.
			 * In between adding series, the scale can be changed at any time by programmatically calling calling {@link CIQ.ChartEngine#setChartScale}
			 *
			 * If false, the chart will not change scale when a comparison series is added or removed and {@link CIQ.ChartEngine#setChartScale} must be explicitly called to set the desired scale.
			 * This allows for more flexibility in case 'linear' and 'percent' are not the preferred default scales, or the UI is requires to manage the scale separately.
			 *
			 * Note this will only take effect on the main chart panel's main axis.
			 *
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 6.2.0
			 */
			forcePercentComparison: true,
			/**
			 * Will contain the maximum number of bars that can be displayed on the chart.
			 * This number is auto-computed by the ChartEngine when the user zooms or the size of the chart changes.
			 * Since charts can pan slightly off the edge of the screen, this number is width/candleWidth + 2 in order allow partial candles to be displayed on both edges.
			 * @type number
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			maxTicks: 0, // Horizontal number of chart ticks that currently fit in the canvas, based on candlewidth and spacing. This is generally one greater than the actual size of the canvas due to candle clipping.
			/**
			 * Set to a value between 0 and 1 to soften the curves on a line or mountain chart for the primary series.
			 *
			 * This only affects the primary chart series. For setting tension on additional series see {@link CIQ.ChartEngine#addSeries}
			 *
			 * Splining is a mathematical process that rounds the connectors between segments.
			 * This results in a very pleasing, smooth look.
			 * Please note that technical analysts generally do not like splined charts because they obscure the actual closing prices of securities. Splining should be used only when the use case doesn't require exact values.
			 * @type number
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			tension: null,
			/**
			 * READ ONLY. A "snapshot" of the market for the active instrument.
			 * This data is ephemeral in nature and not used to produce a time series chart.
			 * But rather used on our peripheral plugins that require more details on the current market, such as [TFC]{@link CIQ.TFC} and [Active Trader]{@link CIQ.MarketDepth}.
			 * This data is programmatically collated from the incoming data and is updated with the most recent information so it should not be altered manually.
			 *
			 * The `currentMarketData` object contains the following information:
			 *  - Last Bid
			 *  - Last Ask
			 *  - Last Price
			 *  - Last Size
			 *  - Lastest Level 2 information
			 *
			 * For more details see {@link CIQ.ChartEngine#updateCurrentMarketData}
			 * @type object
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 6.1.0
			 */
			currentMarketData: {},
			/**
			 * READ ONLY. The master data for this chart.
			 * This data is never modified by the chart engine itself and should not be altered directly.
			 *
			 * Use {@link CIQ.ChartEngine#loadChart} , {@link CIQ.ChartEngine#updateChartData} to load/update this object.
			 *
			 * See the [Data Integration]{@tutorial DataIntegrationOverview} tutorial for details.
			 * @type array
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			masterData: null,
			/**
			 * Contains the current complete data set created from {@link CIQ.ChartEngine.Chart#masterData} by {@link CIQ.ChartEngine#createDataSet}; adjusted for periodicity and with calculated studies.
			 *
			 * See the [Data Integration]{@tutorial DataIntegrationOverview} and [Studies]{@tutorial Using and Customizing Studies} tutorials for more details.
			 * @type array
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			dataSet: null,
			/**
			 * Contains a copy of the {@link CIQ.ChartEngine.Chart#dataSet}, scrubbed for null entries (gap dates).
			 * This is used by studies to avoid gaps being interpreted as "zero" values and throwing off calculations.
			 *
			 * See the  [Studies]{@tutorial Using and Customizing Studies} tutorial for more details.
			 * @type array
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			scrubbed: null,
			/**
			 * READ ONLY. Contains the portion of the {@link CIQ.ChartEngine.Chart#dataSet} that is currently displayed on the screen (view-window).
			 * It includes both full and partial bars, and may even include a bar whose visible portion is entirely off the screen.
			 * As the chart is panned or zoomed, the dataSegment is updated to reflect the new position in the chart.
			 *
			 *  To properly access the portion of the dataSegment representing bars that are at least 50% showing on the screen, use {@link CIQ.ChartEngine#getDataSegment}.
			 *
			 * See the [Data Integration]{@tutorial DataIntegrationOverview} tutorial for details.
			 * @type array
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			dataSegment: null,
			/**
			 * READ ONLY. Contains data pertaining to variable width candles, such as volume candles, used to determine location of bars on the screen.
			 * @type array
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			segmentImage: null,
			/**
			 * Parameters used to control the baseline in baseline_delta charts
			 * @type {object}
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			baseline: {
				/**
				 * includeInDataSegment - If set to true, forces a line chart (usually a baseline chart) to begin inside the chart,
				 *                        whereas normally the first point in a line chart is off the left edge of the screen.
				 *
				 * **Note:** Only applies when set by the chart, will not work if set by a renderer.
				 * @type boolean
				 * @default
				 * @alias CIQ.ChartEngine.Chart#baseline[`includeInDataSegment`]
				 * @memberof CIQ.ChartEngine.Chart#baseline
				 */
				includeInDataSegment: false,
				/**
				 * defaultLevel - If set to a value, overrides the default behavior of baseline chart
				 *                which is to set baseline to leftmost point visible on the chart.
				 * @type number
				 * @alias CIQ.ChartEngine.Chart#baseline[`defaultLevel`]
				 * @memberof CIQ.ChartEngine.Chart#baseline
				 */
				defaultLevel: null,
				/**
				 * userLevel - Value of the user-set baseline level.  To prevent user from adjusting the baseline,
				 *             set this property to false.
				 * @type boolean|number
				 * @default
				 * @alias CIQ.ChartEngine.Chart#baseline[`userLevel`]
				 * @memberof CIQ.ChartEngine.Chart#baseline
				 */
				userLevel: null,
				/**
				 * actualLevel - This is computed automatically.  Do not set.
				 * @type number
				 * @default
				 * @alias CIQ.ChartEngine.Chart#baseline[`actualLevel`]
				 * @memberof CIQ.ChartEngine.Chart#baseline
				 */
				actualLevel: null
			},
			/**
			 * Contains the {@CIQ.ChartEngine.XAxis} object for the chart.
			 * @type CIQ.ChartEngine.XAxis
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			xAxis: null, // x Axis for the chart
			/**
			 * Contains data entries for the full xaxis, including entries for "future" bars that are displayed on the chart.
			 * floatDate and headsUp use these values for display to the user.
			 * It is a superset of dataSegment.
			 * @type {array}
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			xaxis: [],
			/**
			 * Determines at which zoom level interior axis points are displayed. Value in pixels.
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			xaxisFactor: 30,
			/**
			 * READ ONLY. Maximum number of decimal places in data set.
			 *
			 * This can be changed by setting {@link CIQ.ChartEngine.Chart#calculateTradingDecimalPlaces} to a different function.
			 * See {@link CIQ.calculateTradingDecimalPlaces} for more details.
			 * @type number
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			decimalPlaces: 2,
			/**
			 * If true, the y-axis width is based on the width of the displayed instrument prices.
			 *
			 * To prevent constant resizing of the y-axis, the dynamic width setting starts at the
			 * initial axis width ({@link CIQ.ChartEngine.YAxis#width}) and increases to ensure all
			 * digits are in view as the user zooms and pans the chart. The dynamic width setting
			 * returns to the initial width only when key events happen, such as removing a study or
			 * series or changing the instrument.
			 *
			 * Applies to all y-axes attached to a chart.
			 *
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 5.1.1
			 *
			 * @see {@link CIQ.ChartEngine.AdvancedInjectable#resetDynamicYAxis}.
			 */
			dynamicYAxis: true,
			roundit: 100, // Computed automatically to round y-axis display
			/**
			 * Used to determine chart display characteristics that are dependent on chart size, such
			 * as the width and font of the y-axis.
			 *
			 * Meant to be used in tandem with CSS responsive design breakpoints. Do not set directly;
			 * instead use {@link CIQ.ChartEngine#notifyBreakpoint}, which ensures that the relevant
			 * styles (which have already been calculated) are updated based on the new breakpoint.
			 *
			 * @type string
			 * @default null
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 8.2.0
			 */
			breakpoint: null,
			/**
			 * Function used to render the Legend when multiple series are being displayed on the main chart panel.
			 * Update your prototype or a specific chart instance, if you want to use a different rendering method for legend.
			 *
			 * To activate the legend, you must first define the location in `stx.chart.legend`.
			 * This is done by providing the x and y coordinates for the first element in the legend as follows:
			 * ```
			 * stxx.chart.legend={
			 * 		x: yourXlocation,
			 * 		y: yourYlocation
			 * };
			 * ```
			 *
			 * Once set, a legend item for each series you add will be added as defined by this function.
			 *
			 * Defaults to {@link CIQ.drawLegend}, which uses {@link CIQ.drawLegendItem}
			 * @type function
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example
			 * // define your legend renderer
			 * stxx.chart.legendRenderer = yourFunction; // must follow the function signature of {@link CIQ.drawLegend};
			 * // actiate the legend
			 * stxx.chart.legend={
			 * 		x: 50,
			 * 		y: 50
			 * };
			 * @example
			 * // sample series legend function
				 stxx.chart.legendRenderer = function(stx, params){
					var coordinates=params.coordinates;
					var context=stx.chart.context;
					context.textBaseline="top";
					var rememberFont=context.font;
					stx.canvasFont("stx-legend",context);
	
					var chart=params.chart;
					if(!coordinates) coordinates=chart.legend;
					var xy=[coordinates.x, coordinates.y];
					var lineColor=stx.defaultColor;
	
					for(var i=0;i<2;i++){ // loop twice, first for the base then again for the series
						for(var field in params.legendColorMap){
							var legendItem=params.legendColorMap[field];
							if(legendItem.isBase && (i || params.noBase)) continue;
							if(!legendItem.isBase && !i) continue;
							var c;
							if(legendItem.color instanceof Array){
								var colors=legendItem.color;
								for(c=colors.length-1;c>=0;c--){
									if(CIQ.isTransparent(colors[c])) colors.splice(c,1);
								}
								if(colors.length>1){
									var grd=context.createLinearGradient(xy[0],xy[1],xy[0]+10,xy[1]);
									for(c=0;c<colors.length;c++){
										grd.addColorStop(c/(colors.length-1),colors[c]);
									}
									lineColor=grd;
								}else if(colors.length>0){
									lineColor=colors[0];
								}else{
									lineColor=stx.getCanvasColor("stx_line_chart");
								}
							}else{
								lineColor=null;
							}
							if(lineColor) {
								var display = field;
								if (legendItem.display){
									display = legendItem.display;
								}
								if(!display){
									if(chart.symbolDisplay){
										display=chart.symbolDisplay;
									}else{
										display=chart.symbol;
									}
								}
								if(xy[0]+context.measureText(display).width>chart.panel.right){
									xy=[coordinates.x, coordinates.y+context.measureText("M").width+6];  // M is squarish, with width roughly equaling height: https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
								}
								xy=CIQ.drawLegendItem(stx, xy, display, lineColor, legendItem.opacity);
							}
						}
					}
					context.font=rememberFont;
				};
			 * @since 07/01/2015
			 */
			legendRenderer: CIQ.drawLegend,
			/**
			 * This object is used to temporarily override the coloring logic used on some default chart types,
			 * or to completely override the `layout.chartType` allowing you to then define a totally custom rendering.
			 *
			 *  The colorFunction is only available on the following chart types:
			 *  - Colored Line
			 *  - Colored Bar
			 *  - Colored Mountain
			 *  - Colored Step
			 *  - Candle
			 *  - Hollow Candle
			 *  - Volume Candle
			 *
			 * Expected format :
			 *```
			 *chartEngine.chart.customChart={colorFunction: myColorFunction}
			 *```
			 *```
			 *chartEngine.chart.customChart={chartType:myChartType}
			 *```
			 *```
			 *chartEngine.chart.customChart={colorFunction: myColorFunction, chartType:myChartType}
			 *```
			 * Where:
			 * - `myColorFunction` is the function that contains the logic for overriding default color logic for a **default** chart. Please contact us for more guidance on how to create your own chart types.
			 *  - This function must support the following parameters:
			 *	 - [stx]{@link CIQ.ChartEngine}	- A chart object
			 *	 - quote	- A properly formatted OHLC object.
			 *	 - mode	- A string applicable on 'candle', 'hollow_candle' and 'volume_candle' charts only. Allowed values:
			 *	  - `shadow`- indicates the function is asking for the candle wick color
			 *	  - `outline` indicates the function is asking for the candle border color
			 *	  - `solid` indicates the function is asking for the candle fill color(Inside of candle. Not applicable on 'hollow_candle' or 'volume_candle')
			 *   - Example: `myColorFunction(stx,quote,mode);`
			 *  - This function must return a `string|object` representing the color to use for the bar, candle or line segment component.
			 *  - Return `null` to skip the current datapoint and draw nothing in its place.
			 *  - For colored line charts a color/pattern combination can be returned in an object of the following format: `{pattern:[3,3],color:"red"}`
			 * - `myChartType` is the name of your **custom** chart. Setting this value will force "displayChart" to execute your exact code for rendering a chart. You will need to add your rendering code inside a "displayChart" API injection ( **must be an append** to be executed after the default functionality.).
			 *
			 * You may set to null any of the parameters to default to existing settings.<br>
			 * <br>If you are simply setting the customChart object in-line, rather than using it as part of an AP injection into the animation loop, it may be necessary to call `setMainSeriesRenderer` to immediately display results.<br>
			 * <br>To restore the original chart settings, set this object to null (and call setMainSeriesRenderer() if necessary).
			 *
			 * See {@tutorial Chart Styles and Types} for more details.
			 * @type object
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example <caption> Using the customChart object in-line on your code:</caption>
			 * //you may want to add a menu selection to activate a special candle chart by executing this code in response to the menu selection:
			 * stxx.chart.customChart={colorFunction: function(stx, quote, mode){
			 *		if(mode=="shadow" || mode=="outline") return "black";  //draw black wicks and borders
			 *		else{
			 *			if(quote.Close>100) return "green";
			 * 			else if(quote.DT.getHours()<12) return "yellow";
			 *			else return "orange";
			 *		}
			 *		return null;
			 *	  }
			 * 	};
			 * stxx.setMainSeriesRenderer();
			 *
			 * // to deactivate, you can execute this code:
			 * stxx.chart.customChart={colorFunction: null};
			 * stxx.setMainSeriesRenderer();
			 * @example <caption> Using the customChart object inside an API injection: </caption>
			 * CIQ.ChartEngine.prototype.prepend("displayChart", function(chart){
			 *     if ( this.layout.chartType =="candle")
			 *         this.chart.customChart={
			 *             colorFunction:function(stx, quote, mode){
			 *                 if(quote.Close>quote.iqPrevClose) return "blue";
			 *                 else if(quote.Close<quote.iqPrevClose) return "yellow";
			 *                 else return "gray";
			 *             }
			 *        }
			 *    else
			 *        this.chart.customChart = null;
			 * });
			 */
			customChart: null,
			/**
			 * How much padding to leave for the right y-axis. Default is enough for the axis. Set to zero to overlap y-axis onto chart.
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 07/01/2015
			 * @example
			 * stxx.chart.yaxisPaddingRight=0;
			 * stxx.chart.yAxis.displayBorder=false; // hide the vertical axis line.
			 * //must call the following 2 lines to activate if the axis is already drawn.
			 * stxx.calculateYAxisPositions();
			 * stxx.draw();
			 */
			yaxisPaddingRight: null,
			/**
			 * How much padding to leave for the left y-axis. Default is enough for the axis. Set to zero to overlap y-axis onto chart.
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 07/01/2015
			 * @example
			 * stxx.chart.yaxisPaddingLeft=0;
			 * stxx.chart.yAxis.displayBorder=false; // hide the vertical axis line.
			 * //must call the following 2 lines to activate if the axis is already drawn.
			 * stxx.calculateYAxisPositions();
			 * stxx.draw();
			 */
			yaxisPaddingLeft: null,
			tickCache: {}, // private
			/**
			 * If set to false, during zooming and panning operations the chart will be anchored on left side preventing white space to be created past the oldest tick.
			 * If both {@link CIQ.ChartEngine.Chart#allowScrollPast} and {@link CIQ.ChartEngine.Chart#allowScrollFuture} are set to false, allowScrollFuture will take precedence if the candle is manually set to create space ({@link CIQ.ChartEngine#setCandleWidth}), but automated zoom operations ({@link CIQ.ChartEngine#zoomOut}) will maintain both scroll restrictions.
			 *
			 * The amount of white space allowed on the right will be limited by {@link CIQ.ChartEngine#minimumLeftBars}
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example
			 * stxx.chart.allowScrollPast=false;
			 */
			allowScrollPast: true,
			/**
			 * If set to false, during zooming and panning operations the chart will be anchored on right side preventing white space to be created beyond the newest tick.
			 * If both {@link CIQ.ChartEngine.Chart#allowScrollPast} and {@link CIQ.ChartEngine.Chart#allowScrollFuture} are set to false, allowScrollFuture will take precedence if the candle is manually set to create space ({@link CIQ.ChartEngine#setCandleWidth}), but automated zoom operations ({@link CIQ.ChartEngine#zoomOut}) will maintain both scroll restrictions.
			 * When viewing a specified date range on the chart, if this flag is set to false, any portion of the range beyond the last quote will not be displayed.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @example
			 * stxx.chart.allowScrollFuture=false;
			 * @since 6.1.0 Also respects studies that render into the future, such as the Ichimoku cloud.
			 */
			allowScrollFuture: true,
			/**
			 * READ ONLY. Tracks the number of ticks to display as "whitespace" beyond the rightmost area of the chart
			 * when {@link CIQ.ChartEngine.Chart#allowScrollFuture} is set to false.
			 * @type number
			 * @default
			 * @alias whiteSpaceFutureTicks
			 * @memberof CIQ.ChartEngine.prototype
			 * @private
			 * @since 6.1.0
			 */
			whiteSpaceFutureTicks: 0,
			/**
			 * Set to true to temporarily hide drawings
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 */
			hideDrawings: false,
			/**
			 * For line and mountain type charts set this to a value other than "Close" to have those chart types plot a different field.
			 *
			 * @type {string}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 3.0.0
			 */
			defaultPlotField: "Close",
			/**
			 * For chart types which have configuration settings (such as the aggregate charts renko, kagi, etc) contains those default settings.
			 * This object holds the settings for the current chart type only.
			 * @type {object}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 3.0.0
			 */
			defaultChartStyleConfig: {},
			/**
			 * Set this to true to turn off auto-scrolling when fresh data comes in. By default, the chart will scroll backward
			 * whenever a new bar comes in, so as to maintain the chart's forward position on the screen. If lockScroll is
			 * true then fresh bars with advance the chart forward (and eventually off the right edge of the screen)
			 *
			 * Note that setSpan({base:"today"}) will set an internal variable that accomplishes the same thing. This is a unique case.
			 * @type {boolean}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 05-2016-10
			 */
			lockScroll: false,
			/**
			 * Set this to true to include the chart overlay/study values in the calculation to determine the high and low values for the chart.
			 * This may cause the chart to shrink vertically to ensure all study/overlay data is in view.
			 * Setting it to false, will maintain the current candle's height, but some of the study/overlay data may be out of the display range.
			 *
			 * This will affect studies such as 'Pivot Points' where all the pivot lines will be visible by “squeezing the y axis”.
			 * @type {boolean}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since
			 * - 2016-12-01.4.13
			 * - 3.0.10 Switched default to true.
			 */
			includeOverlaysInMinMax: true,
			/**
			 * READ ONLY. Gap filling style for the chart (line/mountain chart types only).
			 * By default gaps on lines and mountain charts will not be connected.
			 * Modify by using {@link CIQ.ChartEngine#setGapLines}.
			 * @type {object}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 4.0.0
			 */
			gaplines: null,
			/**
			 * READ ONLY. Style for the main series renderer.
			 * Set by using {@link CIQ.ChartEngine#setLineStyle}.
			 * @type {object}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 4.0.0
			 */
			lineStyle: null,
			/**
			 * When candleWidth<1, setting to true will create approximation of a line chart to improve rendering performance.
			 *
			 * Must allow for smaller candle sizes by lowering {@link CIQ.ChartEngine#minimumCandleWidth}
			 * and allow for larger dataset by increasing {@link CIQ.ChartEngine#maxDataSetSize} or setting it to 0.
			 * @type {boolean}
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 4.1.0
			 */
			lineApproximation: true,
			/**
			 * Whether chart's main renderer's bars plot more than one data field (OHLC charts).
			 * When this is true, will disable the use of {@link CIQ.ChartEngine.Chart#defaultPlotField}.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 5.1.0
			 */
			highLowBars: false,
			/**
			 * Whether chart's main renderer's bars represent a stand-alone entity as opposed to a vertex in a line-type chart.
			 * This is important when the engine tries to render the data points right off the chart; in a stand-alone bar,
			 * the points right off the chart need not be considered.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 5.1.0
			 */
			standaloneBars: false,
			/**
			 * Whether chart's main renderer's bars have width, as opposed to a line-type chart whose "bars" are just a point on the chart.
			 * This is useful when the engine adjusts the chart for smooth scrolling and homing.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 5.1.0
			 */
			barsHaveWidth: false,
			/**
			 * Called to determine the number of decimal places in which a security trades.
			 *
			 * The function this is called in {@link CIQ.ChartEngine#setMasterData}. The result is
			 * assigned to {@link CIQ.ChartEngine.Chart#decimalPlaces}, which is used for the heads-up
			 * display and for the current price pointer label.
			 *
			 * Format:
			 * ```javascript
			 * stxx.chart.calculateTradingDecimalPlaces(
			 *     {
			 *          stx: CIQ.ChartEngine,
			 *          chart: CIQ.ChartEngine.Chart,
			 *          symbol: string,
			 *          symbolObject: object
			 *     }
			 * )
			 * ```
			 * @type function
			 * @default {@link CIQ.calculateTradingDecimalPlaces}
			 * @memberof CIQ.ChartEngine.Chart#
			 * @since 8.0.0 Replaces <a href="CIQ.ChartEngine.html#callbacks%5B%60calculateTradingDecimalPlaces%60%5D">CIQ.ChartEngine.callbacks[\`calculateTradingDecimalPlaces\`]</a>.
			 */
			calculateTradingDecimalPlaces: CIQ.calculateTradingDecimalPlaces
		},
		true
	);
	
	};
	
	
	let __js_core_engine_convert_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Returns the absolute screen position given a Y pixel on the canvas
	 * @param  {number} y Y pixel on the canvas
	 * @return {number}	  Absolute Y screen position
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.resolveY = function (y) {
		return this.top + y;
	};
	
	/**
	 * Returns the absolute screen position given a X pixel on the canvas
	 * @param  {number} x X pixel on the canvas
	 * @return {number}	  Absolute X screen position
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.resolveX = function (x) {
		return this.left + x;
	};
	
	/**
	 * Returns the relative canvas position given an absolute Y position on the screen
	 * @param  {number} y Y pixel on the screen
	 * @return {number}	  Relative Y position on canvas
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.backOutY = function (y) {
		return y - this.top;
	};
	
	/**
	 * Returns the relative canvas position given an absolute X position on the screen
	 * @param  {number} x X pixel on the screen
	 * @return {number}	  Relative X position on canvas
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.backOutX = function (x) {
		return x - this.left;
	};
	
	/**
	 * Returns a date (in yyyymmddhhmm form) given a tick (location in the dataSet).
	 * If the tick lies outside of the dataSet then the date will be arrived at algorithmically by calculating into the past or future.
	 * @param  {number} tick  Location in the dataSet
	 * @param  {CIQ.ChartEngine.Chart} [chart] A chart object
	 * @param  {boolean} [nativeDate] True to return as date object otherwise returns in yyyymmddhhmm form
	 * @param  {string} [tickSource] Tick array to search. Defaults to `dataSet`
	 * @return {(string|Date)}		  The date form dictated by native param
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.dateFromTick = function (
		tick,
		chart,
		nativeDate,
		tickSource = "dataSet"
	) {
		if (!chart) chart = this.chart;
		const tickArray = chart[tickSource];
		let data_len = tickArray.length;
		let dt;
		let iter;
		let result;
		let addedTempDate = false;
	
		// if empty chart then add current date so this function supports initializing an empty chart in quotefeed
		if (data_len === 0) {
			tickArray[0] = {};
			tickArray[0].DT = new Date();
			data_len = tickArray.length;
			addedTempDate = true;
		}
	
		if (tick < 0) {
			iter = this.standardMarketIterator(tickArray[0].DT);
			if (iter) dt = iter.previous(Math.abs(tick));
			else dt = tickArray[0].DT;
		} else if (tick >= data_len) {
			iter = this.standardMarketIterator(tickArray[data_len - 1].DT);
			if (iter) dt = iter.next(tick - (data_len - 1));
			else dt = tickArray[data_len - 1].DT;
		} else {
			dt = tickArray[tick].DT;
		}
	
		if (nativeDate) {
			result = new Date(dt.getTime());
		} else {
			result = CIQ.yyyymmddhhmmssmmm(dt).substr(0, 12);
		}
	
		if (addedTempDate) {
			delete tickArray[0].DT;
		}
		return result;
	};
	
	/**
	 * Returns the tick (position in dataSet) given the requested date.
	 *
	 * The date does not need to match exactly. If the date lies between ticks then the earlier will be returned by default.
	 *
	 * @param  {Date|string} dt	  Date object or date in string format
	 * @param  {CIQ.ChartEngine.Chart} [chart] Chart object
	 * @param  {number} [adj] Timezone adjustment in minutes to apply to date before getting tick
	 * @param  {boolean} [forward] Switch to return the next tick as opposed to the previous, in case an exact match is not found
	 * @param  {string} [tickSource] Tick array to search. Defaults to `dataSet`
	 * @return {number}		  The tick location
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.tickFromDate = function (
		dt,
		chart,
		adj,
		forward,
		tickSource = "dataSet"
	) {
		if (!chart) chart = this.chart;
		const tickArray = chart[tickSource];
		if (!(tickArray && tickArray.length)) return 0;
		if (!adj) adj = 0;
		const target = dt.constructor == Date ? dt : CIQ.strToDateTime(dt);
	
		// This line is used by drawings which are saved with a gmt offset.
		if (!CIQ.ChartEngine.isDailyInterval(this.layout.interval))
			target.setMinutes(target.getMinutes() + adj);
	
		const ms = target.getTime();
		if (!chart.tickCache[tickSource]) chart.tickCache[tickSource] = {};
		let total = chart.tickCache[tickSource][ms];
		if (total || total === 0) {
			return forward ? Math.ceil(total) : Math.floor(total);
		}
	
		const firstDate = tickArray[0].DT;
		const lastDate = tickArray[tickArray.length - 1].DT;
		if (target >= firstDate && target <= lastDate) {
			let begin = 0;
			let end = tickArray.length;
			let attempts = 0;
			while (++attempts < 100) {
				let i = Math.floor((end + begin) / 2);
				let d = tickArray[i].DT;
				if (+d == +target) {
					chart.tickCache[tickSource][ms] = i;
					return i;
				}
				if (d < target) {
					begin = i;
				}
				if (d > target) {
					if (tickArray[i - 1].DT < target) {
						chart.tickCache[tickSource][ms] = i - 0.5;
						return forward ? i : i - 1;
					}
					if (+tickArray[i - 1].DT == +target) {
						// efficiency
						chart.tickCache[tickSource][ms] = i - 1;
						return i - 1;
					}
					end = i;
				}
			}
			if (attempts >= 100) {
				console.log("!!!Warning: tickFromDate() did not find match.");
				return tickArray.length;
			}
		}
	
		// start at beginning of chart and work backward into the past, or end of chart and into the future
		const intoThePast = target < firstDate;
		const start = intoThePast ? firstDate : lastDate;
		const iter = this.standardMarketIterator(start);
		const ticks = iter ? iter.futureTick({ end: target }) : 0;
		total = intoThePast ? ticks * -1 : tickArray.length - 1 + ticks;
		chart.tickCache[tickSource][ms] = total;
		return total;
	};
	
	/**
	 * Returns the X pixel given the location of a bar (`dataSegment`) on the chart.
	 *
	 * @param {number} bar The bar for which the X pixel is returned (position on the chart, which is
	 * 		also the position in the `dataSegment`).
	 * @param {CIQ.ChartEngine.Chart} [chart] The chart that contains the bar. Defaults to
	 * 		`this.chart`.
	 * @return {number} The X pixel on the chart.
	 *
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.pixelFromBar = function (bar, chart) {
		if (!chart) chart = this.chart;
		var x = 0,
			segmentImage = this.chart.segmentImage;
		if (segmentImage && segmentImage[bar] && segmentImage[bar].leftOffset) {
			x = segmentImage[bar].leftOffset;
		} else {
			x = (bar + 0.5) * this.layout.candleWidth;
		}
		x = chart.panel.left + Math.floor(x + this.micropixels) - 1;
		return x;
	};
	
	/**
	 * Returns the position (array index) of the first **dataSegment** element encountered given the X pixel.
	 * Do not reference this into dataSegment without checking bounds, because the return value may be negative or greater than the dataSegment array length.
	 *
	 * See {@link CIQ.ChartEngine#tickFromPixel} if you wish to locate the dataSet position.
	 *
	 * @param  {number} x An X pixel location on the chart
	 * @param {CIQ.ChartEngine.Chart} [chart] Which chart to use. Defaults to this.chart.
	 * @return {number}	  The bar that lies on the X pixel (may be negative/before or after the chart)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.barFromPixel = function (x, chart) {
		if (!chart) chart = this.chart;
		var segmentImage = this.chart.segmentImage,
			mp = this.micropixels,
			cw = this.layout.candleWidth;
		if (segmentImage) {
			//binary search
			var pixel = x - chart.panel.left - mp,
				mult = 2,
				quote;
			var length = segmentImage.length;
			var bar = Math.round(length / mult);
			var leftOffset, halfCandleWidth;
			var rightofLastTick =
				segmentImage[length - 1].leftOffset +
				segmentImage[length - 1].candleWidth / 2;
			if (pixel > rightofLastTick) {
				//beyond the rightmost tick
				return (
					length + Math.floor((x - rightofLastTick - chart.panel.left - mp) / cw)
				);
			}
			for (var i = 1; i < length; i++) {
				mult *= 2;
				quote = segmentImage[bar];
				if (!quote) break;
				leftOffset = quote.leftOffset;
				halfCandleWidth = quote.candleWidth / 2;
				var left = leftOffset - halfCandleWidth;
				var right = leftOffset + halfCandleWidth;
				if (bar === 0 || (pixel >= left && pixel < right)) break;
				else if (pixel < left) bar -= Math.max(1, Math.round(length / mult));
				else bar += Math.max(1, Math.round(length / mult));
				bar = Math.max(0, Math.min(length - 1, bar));
			}
			if (!segmentImage[bar]) {
				//sucks, we need to iterate through
				for (i = 0; i < length; i++) {
					quote = segmentImage[i];
					if (!quote) continue;
					leftOffset = quote.leftOffset;
					halfCandleWidth = quote.candleWidth / 2;
					if (pixel < leftOffset - halfCandleWidth) return Math.max(0, i - 1);
					else if (pixel < leftOffset + halfCandleWidth) return i;
					else if (pixel >= leftOffset + halfCandleWidth) return i + 1;
				}
			}
	
			return bar;
		}
		return Math.floor((x - chart.panel.left - mp) / cw);
	};
	
	/**
	 * Returns the position (array index) of the first **dataSet** element encountered given the X pixel.
	 *
	 * See {@link CIQ.ChartEngine#barFromPixel} if you wish to locate the dataSegment position.
	 *
	 * @param  {number} x	  X pixel location
	 * @param  {CIQ.ChartEngine.Chart} [chart] A chart object
	 * @return {number}		  The tick (position in the dataSet)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.tickFromPixel = function (x, chart) {
		if (!chart) chart = this.chart;
		var tick = chart.dataSet.length - chart.scroll;
	
		if (chart.segmentImage) {
			tick += this.barFromPixel(x, chart);
		} else {
			tick += Math.floor(
				(x - chart.panel.left - this.micropixels) / this.layout.candleWidth
			);
		}
		return tick;
	};
	
	/**
	 * Returns an X pixel for the given tick. The X pixel will be the center of the tick location.
	 * Note that the pixel may be off of the visual canvas and that it might overlap the Y axis.
	 * @param  {number} tick  The tick (position in the dataSet array)
	 * @param  {CIQ.ChartEngine.Chart} [chart] A chart object
	 * @return {number}		  The X position in pixels (may be negative or may be greater than dataSet.length)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.pixelFromTick = function (tick, chart) {
		if (!chart) chart = this.chart;
		var dataSegment = chart.dataSegment,
			dataSet = chart.dataSet,
			segmentImage = chart.segmentImage,
			mp = this.micropixels,
			length = dataSegment ? dataSegment.length : 0;
		var panel = chart.panel,
			scroll = chart.scroll;
		var bar = tick - dataSet.length + scroll,
			quote = length ? dataSegment[bar] : null;
	
		if (segmentImage) quote = segmentImage[bar];
		if (quote && quote.leftOffset) {
			return panel.left + Math.floor(quote.leftOffset + mp); //in here for volume candle
		}
		//in here for other chart types, or volume candle if bar lies outside of the actual quote data
		var rightOffset = 0,
			dsTicks = 0;
		quote = length ? dataSegment[length - 1] : null;
		if (segmentImage) quote = segmentImage[length - 1];
		if (quote && quote.leftOffset) {
			//volume candle
			if (length < tick - dataSet.length + scroll) {
				//in the "whitespace" area on the right of the chart
				rightOffset = quote.leftOffset - quote.candleWidth / 2;
				dsTicks = length;
			}
		}
		return (
			rightOffset +
			panel.left +
			Math.floor(
				(tick - dsTicks - dataSet.length + scroll + 0.5) *
					this.layout.candleWidth +
					mp
			)
		);
	};
	
	/**
	 * Returns the X pixel position for a tick of a given date.
	 *
	 * The date does not need to match exactly. If the date lies between ticks then the earlier will be returned.
	 *
	 * **Warning: this can be an expensive operation if the date is not in the dataSet.**
	 *
	 * @param  {Date|string} date  Date object or String form date
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to look in
	 * @param  {number} [adj] Timezone adjustment in minutes to apply to date before getting tick
	 * @param  {boolean} [forward] Switch to return the next tick as opposed to the previous, in case an exact match is not found
	 * @return {number}		  The pixel location for the date
	 * @memberof CIQ.ChartEngine
	 * @since added adj and forward arguments
	 */
	CIQ.ChartEngine.prototype.pixelFromDate = function (date, chart, adj, forward) {
		return this.pixelFromTick(
			this.tickFromDate(date, chart, adj, forward),
			chart
		);
	};
	
	/**
	 * A version of {@link CIQ.ChartEngine#priceFromPixel} that will return the y-axis value given a Y pixel
	 * @param  {number} y	  The Y pixel location
	 * @param  {CIQ.ChartEngine.Panel} [panel] The panel (defaults to the chart)
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] The yAxis to use
	 * @return {number}		  The Y axis value
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.transformedPriceFromPixel = function (
		y,
		panel,
		yAxis
	) {
		if (!panel) panel = this.chart.panel;
		var yax = yAxis ? yAxis : panel.yAxis;
		y = yax.bottom - y;
		var price;
		if (yax.semiLog) {
			var logPrice = (y * yax.logShadow) / yax.height;
			if (yax.flipped) logPrice = yax.logHigh - logPrice;
			else logPrice += yax.logLow;
			price = Math.pow(10, logPrice);
		} else {
			if (!yax.multiplier) return null;
			price = y / yax.multiplier;
			if (yax.flipped) price = yax.high - price;
			else price += yax.low;
		}
		return price;
	};
	
	/**
	 * Returns the actual value of the chart given a pixel regardless of any transformation such as a comparison chart.
	 * @param  {number} y	  The Y pixel location
	 * @param  {CIQ.ChartEngine.Panel} [panel] The panel to look. Defaults to the chart itself if not passed in.
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] The yAxis to use. Defaults to panel.yAxis.
	 * @return {number}		  The Y location. This may be off of the visible canvas.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.priceFromPixel = function (y, panel, yAxis) {
		if (!panel) panel = this.chart.panel;
		var price = this.transformedPriceFromPixel(y, panel, yAxis);
		if (this.charts[panel.name] && panel.chart.untransformFunc) {
			if (!yAxis || yAxis == panel.yAxis) {
				price = panel.chart.untransformFunc(this, panel.chart, price, yAxis);
			}
		}
		return price;
	};
	
	/**
	 * Returns the value (price) given a Y-axis pixel. The value is relative to the panel or the canvas.
	 * @param  {number} y	  The y pixel position
	 * @param  {CIQ.ChartEngine.Panel} [panel] A panel object. If passed then the value will be relative to that panel. If not passed then the value will be relative to the panel that is in the actual Y location.
	 * @param  {CIQ.ChartEngine.YAxis} [yAxis] Which yAxis. Defaults to panel.yAxis.
	 * @return {number}		  The value relative to the panel
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.valueFromPixel = function (y, panel, yAxis) {
		if (!panel) panel = this.whichPanel(y);
		if (!panel) {
			var panels = Object.values(this.panels);
			// If we're not in a current panel then we're off the screen, so choose the top or bottom panel
			// Ideally we never get in here because panel is passed in by the developer!
			if (panels && panels.length) {
				if (y <= 0) {
					panel = panels.shift();
				} else {
					panel = panels.pop();
				}
			}
		}
		return this.priceFromPixel(y, panel, yAxis);
	};
	
	/**
	 * Calculates the value (price) of a field in a dataSegment record based on linear interpolation of its neighboring records. Whether the chart is in linear or logarithmic scale is taken into the equation.
	 * @param	{number} bar	The bar position in the dataSegment
	 * @param	{String} fieldName	The field to search for in the dataSegment
	 * @param	{String} [subField]	The field to search for in a series within the dataSegment. Defaults to chart.defaultPlotField.
	 * @param	{CIQ.ChartEngine.Panel}	[panel]	The panel to look. Defaults to the chart.panel.
	 * @param	{CIQ.ChartEngine.YAxis}	[yAxis]	The yAxis to use. Defaults to panel.yAxis.
	 * @return	{number}	The value or price;
	 * @since 6.2.5
	 */
	CIQ.ChartEngine.prototype.valueFromInterpolation = function (
		bar,
		fieldName,
		subField,
		panel,
		yAxis
	) {
		if (bar === null || bar < 0 || !fieldName) return null;
		if (!panel) panel = this.chart.panel;
		if (!yAxis) yAxis = panel.yAxis;
		if (!subField) subField = this.chart.defaultPlotField;
	
		var prevBar = this.getPreviousBar(this.chart, fieldName, bar);
		if (!prevBar) return null; // cannot interpolate if no previous bar
	
		var prevBarPrice;
		var tuple = CIQ.existsInObjectChain(prevBar, fieldName);
		if (tuple) prevBarPrice = tuple.obj[tuple.member];
		if (typeof prevBarPrice == "object") {
			// most likely a series object
			prevBarPrice = prevBarPrice[subField];
		}
	
		// if step then the interpolated value is just the previous bar
		var seriesRenderer = this.getRendererFromSeries(fieldName);
		if (
			(seriesRenderer && seriesRenderer.params.step) ||
			this.layout.chartType === "step"
		)
			return prevBarPrice;
	
		var nextBar = this.getNextBar(this.chart, fieldName, bar);
		var nextBarPrice;
		tuple = CIQ.existsInObjectChain(nextBar, fieldName);
		if (tuple) nextBarPrice = tuple.obj[tuple.member];
		if (typeof nextBarPrice == "object") {
			// most likely a series object
			nextBarPrice = nextBarPrice[subField];
		}
	
		if (!nextBar) return null; // cannot interpolate if no next bar!
		if (
			prevBarPrice === null ||
			typeof prevBarPrice == "undefined" ||
			nextBarPrice === null ||
			typeof nextBarPrice == "undefined"
		)
			return null;
		// get coordinates of prev and next bars
		var y0 = this.pixelFromPrice(prevBarPrice, panel, yAxis);
		var y1 = this.pixelFromPrice(nextBarPrice, panel, yAxis);
		var x0 = prevBar.tick;
		var x1 = nextBar.tick;
	
		// calculate the gradient
		var gradient = (y1 - y0) / (x1 - x0);
	
		// calculate where the series intercepts the gradient
		var seriesTick = this.chart.dataSegment[bar].tick;
		var seriesYValue = gradient * (seriesTick - x0) + y0;
	
		// get price from series Y value
		return this.priceFromPixel(seriesYValue, panel, yAxis);
	};
	
	/**
	 * Returns the Y pixel from a transformed/displayed value (percentage comparison change, for example).
	 *
	 * To get the location of an untransformed price, use {@link CIQ.ChartEngine#pixelFromPrice}.<br>
	 * If no transformation is present, both this method and {@link CIQ.ChartEngine#pixelFromPrice} will return the same value.
	 * @param  {number} price The transformed price
	 * @param  {CIQ.ChartEngine.Panel} [panel] The panel (defaults to the chart)
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] The yAxis to use
	 * @return {number}		  The Y pixel value
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.pixelFromTransformedValue = function (
		price,
		panel,
		yAxis
	) {
		if (!panel) panel = this.chart.panel;
		var yax = yAxis ? yAxis : panel.yAxis;
		var y = (yax.high - price) * yax.multiplier;
		if (yax.semiLog) {
			var p = Math.max(price, 0);
			var logPrice = Math.log(p) / Math.LN10;
			//if(price<=0) logPrice=0;
			var height = yax.height;
			y = height - (height * (logPrice - yax.logLow)) / yax.logShadow;
		}
		y = yax.flipped ? yax.bottom - y : yax.top + y;
		return y;
	};
	
	/**
	 * Returns the Y pixel from a price, even if a transformation such as a percentage change comparison scale is active.
	 *
	 * To do this, the active transformation function will be applied to the provided price and then {@link CIQ.ChartEngine#pixelFromTransformedValue} will be called on the resulting value.<br>
	 * If no transformation is present, both this method and {@link CIQ.ChartEngine#pixelFromTransformedValue} will return the same value.
	 * @param  {number} price	  The price or value
	 * @param  {CIQ.ChartEngine.Panel} panel A panel object (see {@link CIQ.ChartEngine#pixelFromPrice})
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] The yaxis to use
	 * @return {number}		  The y axis pixel location
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.pixelFromPrice = function (price, panel, yAxis) {
		if (!panel) panel = this.chart.panel;
		if (this.charts[panel.name] && panel.chart.transformFunc) {
			if (!yAxis || yAxis == panel.yAxis) {
				price = panel.chart.transformFunc(this, panel.chart, price, yAxis); // transform should move to panel
			}
		}
		return this.pixelFromTransformedValue(price, panel, yAxis);
	};
	
	/**
	 * Returns the Y pixel location for the (split) unadjusted price rather than the displayed price.
	 * This is important for drawing tools or any other device that requires the actual underlying price.
	 *
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to get the value from
	 * @param  {number} tick  The tick location (in the dataSet) to check for an adjusted value
	 * @param  {number} value The value
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] The yaxis to use
	 * @return {number}		  The pixel location
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.pixelFromValueAdjusted = function (
		panel,
		tick,
		value,
		yAxis
	) {
		// If we're not showing unadjusted quotes, or if the panel isn't a chart then bypass
		if (this.layout.adj || !this.charts[panel.name])
			return this.pixelFromPrice(value, panel, yAxis);
		var a = Math.round(tick); // Not sure why we're rounding this. Possible legacy code.
		// Adjust if there's a ratio attached to the tick
		var ratio;
		if (
			a > 0 &&
			a < panel.chart.dataSet.length &&
			(ratio = panel.chart.dataSet[a].ratio)
		) {
			return this.pixelFromPrice(value * ratio, panel, yAxis);
		}
		// Otherwise pass through
		return this.pixelFromPrice(value, panel, yAxis);
	};
	
	/**
	 * Returns the unadjusted value for a given value, if an adjustment (split) had been applied. This can return a value
	 * relative to the original closing price.
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to check
	 * @param  {number} tick  The location in the dataset
	 * @param  {number} value The value to adjust
	 * @return {number}		  The adjusted value
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.adjustIfNecessary = function (panel, tick, value) {
		if (this.layout.adj) return value; // Already adjusted prices
		if (!panel || !this.charts[panel.name]) return value;
		var a = Math.round(tick);
		var ratio;
		if (
			a > 0 &&
			a < panel.chart.dataSet.length &&
			(ratio = panel.chart.dataSet[a].ratio)
		) {
			return value / ratio;
		}
		return value;
	};
	
	};
	
	
	let __js_core_engine_crosshair_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Positions the crosshairs at the last known mouse/finger pointer position, which ensures that
	 * the crosshairs are at a known position on touch devices.
	 *
	 * Called by the {@link WebComponents.cq-toolbar} (drawing toolbar) web component.
	 *
	 * @alias positionCrosshairsAtPointer
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 */
	CIQ.ChartEngine.prototype.positionCrosshairsAtPointer = function () {
		var currentPanel = this.currentPanel;
		if (!currentPanel) return;
		if (
			!this.manageTouchAndMouse ||
			(this.mainSeriesRenderer && this.mainSeriesRenderer.nonInteractive)
		)
			return;
		if (this.runPrepend("positionCrosshairsAtPointer", arguments)) return;
		var chart = currentPanel.chart;
		var rect = this.container.getBoundingClientRect();
		this.top = rect.top;
		this.left = rect.left;
		this.right = this.left + this.width;
		this.bottom = this.top + this.height;
		this.cy = this.crossYActualPos = this.backOutY(CIQ.ChartEngine.crosshairY);
		this.cx = this.backOutX(CIQ.ChartEngine.crosshairX);
		var crosshairTick = (this.crosshairTick = this.tickFromPixel(this.cx, chart));
		var position = this.pixelFromTick(crosshairTick, chart) - 1;
		if (this.controls.crossX) this.controls.crossX.style.left = position + "px";
		if (position >= currentPanel.right || position <= currentPanel.left) {
			this.undisplayCrosshairs();
			return;
		}
		var chField =
			currentPanel.name == "chart"
				? this.preferences.horizontalCrosshairField
				: currentPanel.horizontalCrosshairField;
		var dataSet = chart.dataSet;
		if (
			chField &&
			dataSet &&
			crosshairTick < dataSet.length &&
			crosshairTick > -1
		) {
			this.crossYActualPos = this.pixelFromPrice(
				dataSet[crosshairTick][chField],
				currentPanel
			);
		}
		if (this.controls.crossY)
			this.controls.crossY.style.top = this.crossYActualPos + "px";
		this.runAppend("positionCrosshairsAtPointer", arguments);
	};
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Internal function that makes the crosshairs visible based on where the user's mouse pointer is
	 * located. This function should not be called directly.
	 *
	 * Crosshairs are visible if enabled, unless a drawing tool is active, in which case they are
	 * displayed automatically regardless of state.
	 *
	 * When the user's mouse moves out of the chart or over a modal, the crosshairs are
	 * automatically made invisible using
	 * {@link CIQ.ChartEngine.AdvancedInjectable#undisplayCrosshairs}.
	 *
	 * To temporarily show or hide enabled crosshairs, use {@link CIQ.ChartEngine#showCrosshairs}
	 * and {@link CIQ.ChartEngine#hideCrosshairs}, respectively.
	 *
	 * **Note:** If the z-index of the crosshairs is set higher than the z-index of the subholder
	 * element, the crosshairs cannot be controlled by the chart engine.
	 *
	 * @alias doDisplayCrosshairs
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @since 5.0.0 No longer allows the crosshairs to be enabled if the mouse pointer is outside the
	 * 		chart.
	 */
	CIQ.ChartEngine.prototype.doDisplayCrosshairs = function () {
		if (this.runPrepend("doDisplayCrosshairs", arguments)) return;
		if (this.displayInitialized) {
			var floatCanvas = this.floatCanvas;
			var drawingTool = this.currentVectorParameters.vectorType;
			if (!this.layout.crosshair && (drawingTool === "" || !drawingTool)) {
				this.undisplayCrosshairs();
			} else if (
				CIQ.Drawing &&
				CIQ.Drawing[drawingTool] &&
				new CIQ.Drawing[drawingTool]().dragToDraw
			) {
				this.undisplayCrosshairs();
			} else if (
				this.overXAxis ||
				this.overYAxis ||
				(!this.insideChart && !this.grabbingScreen)
			) {
				this.undisplayCrosshairs();
			} else if (this.openDialog !== "") {
				this.undisplayCrosshairs();
			} else {
				var controls = this.controls,
					crossX = controls.crossX,
					crossY = controls.crossY;
				if (crossX && crossX.style.display !== "") {
					crossX.style.display = "";
					if (crossY) crossY.style.display = "";
					if (this.magnetizedPrice && drawingTool) {
						this.container.classList.remove("stx-crosshair-on");
						this.chart.tempCanvas.style.display = "block";
					} else {
						this.container.classList.add("stx-crosshair-on");
					}
				}
				if (controls.floatDate && !this.chart.xAxis.noDraw) {
					controls.floatDate.style.visibility = "";
					if (this.currentPanel) this.updateFloatHRLabel(this.currentPanel);
				}
				if (floatCanvas) {
					if (floatCanvas.style.display == "none")
						CIQ.clearCanvas(floatCanvas, this);
					floatCanvas.style.display = "block";
				}
			}
		}
		this.runAppend("doDisplayCrosshairs", arguments);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Internal function that makes the crosshairs invisible when the user mouses out of the chart or
	 * over a chart control. This function should not be called directly.
	 *
	 * See {@link CIQ.ChartEngine.AdvancedInjectable#doDisplayCrosshairs} for more details.
	 *
	 * @alias undisplayCrosshairs
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 */
	CIQ.ChartEngine.prototype.undisplayCrosshairs = function () {
		if (this.runPrepend("undisplayCrosshairs", arguments)) return;
		var controls = this.controls,
			crossX = controls.crossX,
			crossY = controls.crossY;
		if (crossX) {
			if (crossX.style.display != "none") {
				crossX.style.display = "none";
				if (crossY) crossY.style.display = "none";
			}
		}
		if (this.displayInitialized && controls.floatDate) {
			controls.floatDate.style.visibility = "hidden";
		}
		this.container.classList.remove("stx-crosshair-on");
		var floatCanvas = this.floatCanvas;
		if (
			floatCanvas &&
			floatCanvas.isDirty &&
			floatCanvas.style.display != "none"
		) {
			CIQ.clearCanvas(floatCanvas, this);
			if (floatCanvas.style.display != "none") floatCanvas.style.display = "none";
		}
		if (
			!this.activeDrawing &&
			!this.repositioningDrawing &&
			!this.editingAnnotation
		) {
			var tempCanvas = this.chart.tempCanvas;
			if (tempCanvas && tempCanvas.style.display != "none")
				tempCanvas.style.display = "none";
		}
		this.runAppend("undisplayCrosshairs", arguments);
	};
	
	/**
	 * Hides enabled crosshairs.
	 *
	 * Usually called as part of a custom drawing or overlay to prevent the crosshairs from displaying
	 * together with the custom rendering.
	 *
	 * See <a href="CIQ.ChartEngine.html#layout%5B%60crosshair%60%5D">CIQ.ChartEngine.layout[\`crosshair\`]</a>
	 * to enable/disable the crosshairs.
	 *
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.hideCrosshairs = function () {
		this.displayCrosshairs = false;
	};
	
	/**
	 * Re-displays crosshairs hidden by {@link CIQ.ChartEngine#hideCrosshairs}.
	 *
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.showCrosshairs = function () {
		this.displayCrosshairs = true;
	};
	
	};
	
	
	let __js_core_engine_data_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ,
		timezoneJS = _exports.timezoneJS;
	
	/**
	 * Loads a chart for a particular instrument from the data passed in, or fetches new data from the {@link quotefeed}; if one attached.
	 *
	 * Replaces {@link CIQ.ChartEngine#newChart}.
	 *
	 *  Note that before using this method, you must first instantiate the chart engine (once only) and assign it to a DOM container using [new CIQ.ChartEngine({container: document.querySelector(".chartContainer")});]{@link CIQ.ChartEngine}<br>
	 *  Once a chart engine is instantiated, this is the only method that should be called every time a new chart needs to be drawn for a different instrument.<br>
	 *  There is no need to destroy the chart, recreate the engine, or explicitly change the data using any other methods.
	 *
	 * Charts default to `1 day` periodicity **unless a different periodicity is set** in this call or by using {@link CIQ.ChartEngine#setPeriodicity} prior to this call. You data must always match the chart periodicity!!
	 *
	 * @param  {string|object}	symbol	A symbol string, equation or object representing the primary instrument for the chart. **This is a mandatory field and must contain at least one character for the chart to display data, even is not using a primary instrument.**
	 * 													<br>After the chart is initialized with the new data, it will contain both a symbol string (stxx.chart.symbol) and a symbol object (stxx.chart.symbolObject).
	 * 													<br>You can send anything you want in the symbol object, but you must always include at least a 'symbol' element.
	 * 													<br>Both these variables will be available for use wherever the {@link CIQ.ChartEngine.Chart} object is present. For example, if using a {@link quotefeed} for gathering data, `params.stx.chart.symbolObject` will contain your symbol object.
	 * 													<br>To allow equations to be used on a chart, the {@link CIQ.ChartEngine#allowEquations} parameter must be set to `true` and the equation needs to be preceded by an equals sign (=) in order for it to be parsed as an equation.
	 * 													<br>See {@link CIQ.formatEquation} and {@link CIQ.computeEquationChart} for more details on allowed equations syntax.
	 * @param {Object|Array} 	[parameters] Data & configuration settings to initialize the chart.
	 * 													<br>The masterData array may be provided as the second argument assuming no other parameters need to be specified.
	 * @param {Array} [parameters.masterData] An array of [properly formatted objects]{@tutorial InputDataFormat} to create a chart.
	 * 													<br>Each element should at a minimum contain a "Close" or "Value" field (capitalized) and a 'Date' or 'DT' field.
	 *													<br>If the charting engine has been configured to use a [QuoteFeed]{@link CIQ.ChartEngine#attachQuoteFeed}
	 *													then masterData does not need to be passed in, and the quote feed will be used instead.
	 * @param {CIQ.ChartEngine.Chart} [parameters.chart] Which chart to load. Defaults to this.chart.
	 * @param {CIQ.ChartEngine~RangeParameters} [parameters.range] Default range to be used upon initial rendering. If both `range` and `span` parameters are passed in, range takes precedence. If periodicity is not set, the range will be displayed at the most optimal periodicity. See {@link CIQ.ChartEngine#setRange} for complete list of parameters this object will accept.
	 * @param {CIQ.ChartEngine~SpanParameters} [parameters.span] Default span to display upon initial rendering. If both `range` and `span` parameters are passed in, range takes precedence. If periodicity is not set, the span will be displayed at the most optimal periodicity. See {@link CIQ.ChartEngine#setSpan} for complete list of parameters this object will accept.
	 * @param {CIQ.ChartEngine~PeriodicityParameters} [parameters.periodicity] Periodicity to be used upon initial rendering. See {@link CIQ.ChartEngine#setPeriodicity} for complete list of parameters this object will accept. If no periodicity has been set, it will default to `1 day`.
	 * @param {boolean} [parameters.stretchToFillScreen] Increase the candleWidth to fill the left-side gap created by a small dataSet. Respects <a href="CIQ.ChartEngine.html#preferences%5B%60whitespace%60%5D">CIQ.ChartEngine.preferences.whitespace</a>. Ignored when params `span` or `range` are used.  See {@link CIQ.ChartEngine#fillScreen}
	 * @param {Function} [callback] Called when loadChart is complete. See {@tutorial Adding additional content on chart} for a tutorial on how to use this callback function.
	 * @memberof CIQ.ChartEngine
	 * @example <caption>Using a symbol string</caption>
	 * stxx.loadChart('IBM');
	 *
	 * @example <caption>Using a symbol object and embedded span and periodicity requirements</caption>
	 * stxx.loadChart({symbol: newSymbol, other: 'stuff'}, {
	 * 	span: {
	 * 		base: 'day',
	 * 		multiplier: 2
	 * 	},
	 * 	periodicity: {
	 * 		period: 1,
	 * 		interval: 5,
	 * 		timeUnit: 'minute'
	 * 	},
	 * 	stretchToFillScreen: true
	 * });
	 *
	 * @example <caption>Using an equation string</caption>
	 * stxx.loadChart('=2*IBM-GM');
	 *
	 * @example <caption>Provide data as the second argument</caption>
	 * stxx.loadChart('YUM', [
	 * 	{Date: '2018-12-03', Close: 2.0034},
	 * 	{Date: '2018-12-04', Close: 2.0067},
	 * 	{Date: '2018-12-05', Close: 2.0112},
	 * 	{Date: '2018-12-06', Close: 2.0091},
	 * 	{Date: '2018-12-07', Close: 1.9979}
	 * ]);
	 *
	 * @example <caption>Provide data as a parameter</caption>
	 * stxx.loadChart('BGS', {
	 * 	masterData: [
	 * 		{DT: 1542384420000, Close: 1.00},
	 * 		{DT: 1542384480000, Close: 1.01},
	 * 		{DT: 1542384540000, Close: 1.04},
	 * 		{DT: 1542384600000, Close: 1.02}
	 * 	],
	 * 	span: {
	 * 		base: 'minute',
	 * 		multiplier: 1
	 * 	}
	 * });
	 *
	 * @since 7.0.0 Added `loadChart`, replacing {@link CIQ.ChartEngine#newChart}. Function signature is different.
	 */
	CIQ.ChartEngine.prototype.loadChart = function (symbol, parameters, callback) {
		//if (!symbol) return; // can't build a chart without a symbol
		if (!callback && typeof parameters == "function") {
			callback = parameters;
			parameters = {};
		} else if (Array.isArray(parameters)) {
			parameters = {
				masterData: parameters
			};
		}
		if (!parameters) parameters = {};
	
		let { chart, periodicity, range, span } = parameters;
		let { layout } = this;
		let originalPeriodicity = {
			periodicity: layout.periodicity,
			interval: layout.interval,
			timeUnit: layout.timeUnit
		};
	
		if (periodicity) {
			let internalPeriodicity = CIQ.cleanPeriodicity(
				periodicity.period ? periodicity.period : periodicity.periodicity,
				periodicity.interval,
				periodicity.timeUnit
			);
			layout.interval = internalPeriodicity.interval;
			layout.periodicity = internalPeriodicity.period;
			layout.timeUnit = internalPeriodicity.timeUnit;
		}
	
		if (!chart) chart = this.chart;
	
		const {
			dataSet: prevDataSet,
			market: prevMarket,
			masterData: prevMasterData,
			symbol: prevSymbol,
			moreAvailable: prevMoreAvailable,
			upToDate: prevUpToDate
		} = chart;
		const prevSymbolObject = CIQ.clone(chart.symbolObject);
	
		chart.dataSet = [];
		chart.masterData = [];
		chart.moreAvailable = null;
		chart.upToDate = null;
		if (!symbol) {
			chart.symbol = null;
			chart.symbolObject = { symbol: null };
		} else if (typeof symbol == "object") {
			// an object was sent in, so initialize the string from the object
			chart.symbol = symbol.symbol;
			chart.symbolObject = symbol;
		} else {
			// a string was sent in so initialize the object from the string
			chart.symbol = symbol;
			chart.symbolObject.symbol = symbol;
		}
	
		chart.inflectionPoint = null; // reset where the consolidation occurs from
	
		if (this.marketFactory) {
			const marketDef = this.marketFactory(chart.symbolObject);
			this.setMarket(marketDef, chart);
		}
	
		this.setMainSeriesRenderer(true);
	
		// no range or span passed into parameters, check layout
		if (!range && !span && layout) {
			span = !layout.range ? layout.setSpan : {};
			range = layout.range || {};
		}
		// both passed into parameters, range takes precedence
		else if (range && span) {
			span = {};
		}
	
		this.clearCurrentMarketData(chart);
	
		var self = this;
		if (!parameters.masterData && this.quoteDriver) {
			let onsymbol = function (err) {
				if (err && err != "orphaned") {
					// orphaned means that another loadChart request came in, overriding this one
					chart.symbol = prevSymbol; // revert the symbol back to what it was if there is an error
					chart.symbolObject = prevSymbolObject; // revert the symbol object back to what it was if there is an error
					chart.market = prevMarket;
					self.masterData = chart.masterData = prevMasterData;
					chart.dataSet = prevDataSet;
					chart.moreAvailable = prevMoreAvailable;
					chart.upToDate = prevUpToDate;
				}
				onComplete();
				if (callback) callback.call(self, err);
			};
	
			if (range && Object.keys(range).length && this.setRange) {
				// check for empty object
				delete parameters.span; // range and span are mutually exclusive
				delete layout.setSpan;
				this.chart.masterData = null;
				this.displayInitialized = false;
				if (periodicity) {
					range.periodicity = periodicity;
				}
				range.forceLoad = true;
				this.setRange(range, onsymbol);
			} else if (span && span.base && this.setSpan) {
				span.multiplier = span.multiplier || 1;
				// force a new chart to be initialized and new data fetched before calling setSpan to conform with the expectations and purpose of loadChart,
				// and not use existing data and symbol names.
				this.chart.masterData = null;
				this.displayInitialized = false;
				// periodicity will be kept if sent as a parameter.
				if (periodicity) span.maintainPeriodicity = true;
				span.forceLoad = true;
				this.setSpan(span, onsymbol);
			} else {
				this.quoteDriver.newChart(
					{
						symbol: chart.symbol,
						symbolObject: chart.symbolObject,
						chart: chart,
						initializeChart: true
					},
					function (err) {
						if (!err) {
							self.adjustPanelPositions(); // to ensure holders are adjusted for current yaxis height
							self.quoteDriver.updateSubscriptions();
							if (parameters.stretchToFillScreen) {
								self.fillScreen();
							}
						}
						onsymbol.apply(self, arguments);
					}
				);
			}
		} else {
			if (!parameters.masterData) {
				console.log(
					"Warning: No masterData specified and no QuoteFeed configured"
				);
			}
			if (!chart.symbol) chart.symbol = ""; // if we are ready to draw but the symbol is missing, it will crash
			this.initializeChart();
			let masterData = this.doCleanupGaps(parameters.masterData, chart);
			this.setMasterData(masterData, chart, { noCleanupDates: true });
			chart.endPoints = {};
			if (masterData && masterData.length) {
				chart.endPoints = {
					begin: masterData[0].DT,
					end: masterData[masterData.length - 1].DT
				};
			}
			this.createDataSet();
	
			if (range && Object.keys(range).length && this.setRange) {
				this.setRange(range);
			} else if (span && span.multiplier && span.base && this.setSpan) {
				this.setSpan({
					maintainPeriodicity: true,
					multiplier: span.multiplier,
					base: span.base
				});
			} else if (parameters.stretchToFillScreen) {
				this.fillScreen();
			} else if (masterData && masterData.length) {
				this.home();
			} else {
				this.clear();
			}
			this.adjustPanelPositions(); // to ensure holders are adjusted for current yaxis height
			onComplete();
			if (callback) callback.call(self);
		}
	
		function onComplete() {
			self.dispatch(self.currentlyImporting ? "symbolImport" : "symbolChange", {
				stx: self,
				symbol: chart.symbol,
				symbolObject: chart.symbolObject,
				prevSymbol: prevSymbol,
				prevSymbolObject: prevSymbolObject,
				action: "master"
			});
			if (periodicity) {
				self.dispatch("periodicity", {
					stx: self,
					differentData: true,
					prevPeriodicity: originalPeriodicity
				});
			}
		}
	};
	
	/**
	 * Loads a blank chart
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 7.3.0
	 */
	CIQ.ChartEngine.prototype.loadBlankChart = function () {
		this.loadChart(null, []);
	};
	
	/**
	 * Returns all the valid data fields in masterData. A valid data field is one
	 * that is in use by a series or one that is in use by the main chart
	 * @param {CIQ.ChartEngine.Chart} [chart] The chart to look in
	 * @return {array} An array of valid price fields
	 * @private
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.getDataFields = function (chart) {
		if (!chart) chart = this.chart;
		var plotField = chart.defaultPlotField || "Close";
		var fields = ["Open", "High", "Low"];
		fields.push(plotField);
		for (var field in chart.series) {
			var parameters = chart.series[field].parameters;
			fields.push(parameters.symbol);
		}
		return fields;
	};
	/**
	 * Cleans up the masterData after a series has been removed. This method will remove
	 * the series field from the masterData, only if no other series are dependent on the field.
	 * Once the field is removed, any empty/null masterData points will be removed. Finally,
	 * doCleanGaps will be run again to set masterData back to its original state. createDataSet
	 * is not run from this method
	 * @param  {object} symbolObject A symbol object
	 * @param {CIQ.ChartEngine.Chart} chart The chart to clean
	 * @private
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.cleanMasterData = function (symbolObject, chart) {
		var symbol = symbolObject.symbol;
		var masterData = chart.masterData;
	
		if (!masterData || !masterData.length) return;
	
		var fields = this.getDataFields(chart);
	
		// Returns true is the quote doesn't have any valid data fields
		function empty(quote, fields) {
			for (var i = 0; i < fields.length; i++) {
				var val = quote[fields[i]];
				if (typeof val != "undefined") return false;
			}
			return true;
		}
		// Clean out "zombie" masterData entries. These would be entries that no longer have
		// any valid data. This can happen whenever series have non-overlapping dates.
		var i = 0;
		do {
			var quote = masterData[i];
			delete quote[symbol];
			if (empty.call(this, quote, fields)) {
				masterData.splice(i, 1);
				continue;
			}
			i++;
		} while (i < masterData.length);
		masterData = this.doCleanupGaps(masterData, chart, { noCleanupDates: true });
		this.setMasterData(masterData, chart, { noCleanupDates: true });
		this.clearCurrentMarketData(chart, symbol);
	};
	
	/**
	 * Calculates the ATR (Average True Range) for the dataSet
	 * @private
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to calculate
	 * @param  {number} period The number of periods
	 * @param  {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateATR = function (chart, period, data) {
		if (!data) data = chart.dataSet;
		var state = chart.state.calculations.atr;
		if (!state) state = chart.state.calculations.atr = {};
		if (!period) period = 20;
		var accum = [];
		if (state.accum) accum = state.accum;
		var q1;
		for (var i = 0; i < data.length; i++) {
			var q = data[i];
			q1 = i ? data[i - 1] : state.q1;
			if (!q1) continue;
	
			var trueRange = Math.max(
				q.High - q.Low,
				Math.abs(q.High - q1.Close),
				Math.abs(q.Low - q1.Close)
			);
			if (accum.length < period) {
				if (accum.push(trueRange) == period) {
					var total = 0;
					for (var j = 0; j < accum.length; j++) total += accum[j];
					q.atr = total / period;
				}
			} else {
				q.atr = (q1.atr * (period - 1) + trueRange) / period;
			}
			q.trueRange = trueRange;
		}
		chart.state.calculations.atr = {
			accum: accum,
			q1: q1
		};
	};
	
	/**
	 * Calculates the Median Price for the dataSet.
	 * @private
	 * @param {CIQ.ChartEngine.Chart} chart The chart to update.
	 * @param {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateMedianPrice = function (chart, data) {
		if (!data) data = chart.dataSet;
		var d;
		for (var i = 0; i < data.length; ++i) {
			d = data[i];
			d["hl/2"] = (d.High + d.Low) / 2;
		}
	};
	
	/**
	 * Calculates the Typical Price for the dataSet.
	 * @private
	 * @param {CIQ.ChartEngine.Chart} chart The chart to update.
	 * @param {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateTypicalPrice = function (chart, data) {
		if (!data) data = chart.dataSet;
		var d;
		for (var i = 0; i < data.length; ++i) {
			d = data[i];
			d["hlc/3"] = (d.High + d.Low + d.Close) / 3;
		}
	};
	
	/**
	 * Calculates the Weighted Close for the dataSet.
	 * @private
	 * @param {CIQ.ChartEngine.Chart} chart The chart to update.
	 * @param {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateWeightedClose = function (chart, data) {
		if (!data) data = chart.dataSet;
		var d;
		for (var i = 0; i < data.length; ++i) {
			d = data[i];
			d["hlcc/4"] = (d.High + d.Low + 2 * d.Close) / 4;
		}
	};
	
	/**
	 * Calculates the (Open + High + Low + Close) / 4 for the dataSet.
	 * @private
	 * @param {CIQ.ChartEngine.Chart} chart The chart to update.
	 * @param {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateOHLC4 = function (chart, data) {
		if (!data) data = chart.dataSet;
		var d;
		for (var i = 0; i < data.length; ++i) {
			d = data[i];
			d["ohlc/4"] = (d.Open + d.High + d.Low + d.Close) / 4;
		}
	};
	
	/**
	 * Returns the current quote (the final element in the dataSet).
	 *
	 * @param {string} [field] Optional field. If provided, searches for the first record with that field having a value.
	 * @return {object} The most recent quote.
	 * @memberof CIQ.ChartEngine
	 * @since 7.3.0 Added the `field` argument.
	 */
	CIQ.ChartEngine.prototype.currentQuote = function (field) {
		if (!this.chart.dataSet) return null;
		for (var i = this.chart.dataSet.length - 1; i >= 0; i--) {
			if (this.chart.dataSet[i]) {
				if (!field) return this.chart.dataSet[i];
				var val = this.chart.dataSet[i][field];
				if (val || val === 0) return this.chart.dataSet[i];
			}
		}
		return null;
	};
	
	/**
	 * Returns the last valid Close found in the dataSet.
	 * This would be any numeric value
	 * @param {string} field Optional object to check Close within, such as with a series
	 * @return {number} The most recent close
	 * @memberof CIQ.ChartEngine
	 * @since 6.1.0
	 */
	CIQ.ChartEngine.prototype.mostRecentClose = function (field) {
		if (!this.chart.dataSet) return null;
		for (var i = this.chart.dataSet.length - 1; i >= 0; i--) {
			var ret = this.chart.dataSet[i];
			if (!ret) continue;
			if (field) {
				ret = ret[field];
				if (!ret && ret !== 0) continue;
			}
			var iqPrevClose = ret.iqPrevClose;
			if (typeof ret == "object") ret = ret.Close;
			if (typeof ret == "number") return ret;
			if (typeof iqPrevClose == "number") return iqPrevClose;
		}
		return null;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Creates the dataSegment. The dataSegment is a copy of the portion of the dataSet that is observable in the
	 * current chart. That is, the dataSegment is a "view" into the dataSet. chart.scroll and chart.maxTicks are the
	 * primary drivers for this method.
	 * @param  {CIQ.ChartEngine.Chart} [theChart] If passed then a data segment will be created just for that chart, otherwise all charts
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias createDataSegment
	 */
	CIQ.ChartEngine.prototype.createDataSegment = function (theChart) {
		if (this.runPrepend("createDataSegment", arguments)) return;
		var chart;
		for (var chartName in this.charts) {
			chart = this.charts[chartName];
			if (theChart) chart = theChart;
	
			if (CIQ.Comparison && chart.isComparison)
				CIQ.Comparison.createComparisonSegmentInner(this, chart);
	
			var dataSet = chart.dataSet,
				baseline = chart.baseline,
				scroll = chart.scroll,
				maxTicks = chart.maxTicks;
			var layout = this.layout,
				cw = layout.candleWidth;
			baseline.actualLevel = baseline.userLevel
				? baseline.userLevel
				: baseline.defaultLevel;
			/*
				chart.baseline.includeInDataSegment forces a line chart (usually a baseline chart) to begin inside the chart
				whereas normally the first point in a line chart is off the left edge of the screen.
				 */
			var dataSegmentStartsOneBack =
				baseline.includeInDataSegment &&
				(!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars);
			var quote;
			var totalVolume = 0;
			var dataSegment = (chart.dataSegment = []);
			var position = dataSet.length - 1 - scroll - 1; // One more to deal with -1 case
			var prevField = chart.defaultPlotField;
			for (var i = -1; i < scroll && i < maxTicks; i++) {
				position++;
				if (i == -1 && !dataSegmentStartsOneBack) continue;
				if (position < dataSet.length && position >= 0) {
					quote = dataSet[position];
					quote.candleWidth = null;
					if (quote) totalVolume += quote.Volume || 1;
					dataSegment.push(quote);
					if (baseline.actualLevel === null && i >= 0) {
						if (prevField && prevField != "Close") {
							var q1 = dataSet[position - 1];
							if (q1 && (q1[prevField] || q1[prevField] === 0))
								baseline.actualLevel = q1[prevField];
						} else {
							if (quote.iqPrevClose || quote.iqPrevClose === 0)
								baseline.actualLevel = quote.iqPrevClose;
						}
					}
				} else if (position < 0) {
					dataSegment.push(null);
				}
			}
			chart.segmentImage = null;
			var mainSeriesRenderer = this.mainSeriesRenderer || {};
			if (mainSeriesRenderer.params && mainSeriesRenderer.params.volume) {
				var workingWidth =
					chart.width - (maxTicks - dataSegment.length - 1) * layout.candleWidth;
				var accumOffset = 0;
				chart.segmentImage = [];
				for (var w = 0; w < dataSegment.length; w++) {
					quote = dataSegment[w];
					chart.segmentImage[w] = {};
					var leftOffset = null;
					if (quote) {
						if (quote.Volume) {
							quote.candleWidth = (workingWidth * quote.Volume) / totalVolume;
							leftOffset = accumOffset + quote.candleWidth / 2;
							accumOffset += quote.candleWidth;
						} else {
							quote.candleWidth = cw;
							leftOffset = accumOffset + cw / 2;
							accumOffset += cw;
						}
						chart.segmentImage[w] = {
							tick: quote.tick,
							candleWidth: quote.candleWidth,
							leftOffset: leftOffset
						};
					} else {
						accumOffset += cw;
					}
				}
			}
			if (theChart) break;
		}
		if (chart && chart.isComparison) this.clearPixelCache();
		this.positionCrosshairsAtPointer();
		this.runAppend("createDataSegment", arguments);
	};
	
	/**
	 * Returns the visible portion of the dataSegment.  A bar is considered visible if its midpoint is within the chart window.
	 * This is different than chart.dataSegment which includes any partially visible candles and possibly the very next data point to be displayed.
	 * @param  {CIQ.ChartEngine.Chart} [chart] Chart from which to return the dataSegment
	 * @returns {array} The visible bars of the dataSegment
	 * @memberof CIQ.ChartEngine
	 * @since 5.2.0
	 */
	CIQ.ChartEngine.prototype.getDataSegment = function (chart) {
		if (!chart) chart = this.chart;
		var dataSegment = chart.dataSegment;
		if (!dataSegment || !dataSegment.length) return [];
		var left = 0;
		var right = dataSegment.length;
		if (this.pixelFromBar(left, chart) < chart.panel.left) left++;
		if (this.pixelFromBar(right - 1, chart) > chart.panel.right) right--;
		return dataSegment.slice(left, right);
	};
	
	/**
	 * Sets the master data for the chart. A data set is derived from the master data by
	 * {@link CIQ.ChartEngine#createDataSet}.
	 *
	 * **This function is intended for internal data management. Do not explicitly call this
	 * function unless you are manipulating the data at a very detailed level.**
	 *
	 * For most implementations, simply set your data using {@link CIQ.ChartEngine#loadChart} or
	 * a [quote feed interface](quotefeed.html), if a quote feed is attached.
	 *
	 * If a [market factory]{@link CIQ.ChartEngine#setMarketFactory} has been linked to the chart,
	 * this function also updates the market on the chart to match the newly loaded instrument.
	 * When no factory is present, the chart assumes that the market will never change and
	 * continues to use the market initially set using {@link CIQ.ChartEngine#setMarket}.
	 * If no market has been set, the chart operates in 24x7 mode.
	 *
	 * This function also calculates the number of decimal places for the security by checking
	 * the maximum number in the data. The number of decimal places is stored in
	 * {@link CIQ.ChartEngine.Chart#decimalPlaces}.
	 *
	 * @param {array} masterData An array of quotes. Each quote should at a minimum contain a
	 * 		"Close" or "value" field (capitalized) and a "Date" or "DT" field. This functions sets
	 * 		DT to be a JavaScript `Date` object derived from the string form.
	 * @param {CIQ.ChartEngine.Chart} [chart] The chart to which `masterData` is applied. Defaults
	 * 		to the default chart.
	 * @param {object} [params] Parameters object.
	 * @param {boolean} [params.noCleanupDates] If true, then dates have been cleaned up already
	 * 		by calling {@link CIQ.ChartEngine#doCleanupDates}, so do not do so in this function.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 5.2.0 Added the `params` and `params.noCleanupDates` parameters.
	 * - 7.0.0 The `masterData` field "Value" may be treated as the primary plot device.
	 * - 8.0.0 The [decimalPlaces]{@link CIQ.ChartEngine.Chart#decimalPlaces} field of the
	 * 		`chart` parameter is now set from
	 * 		{@link CIQ.ChartEngine.Chart#calculateTradingDecimalPlaces}.
	 */
	CIQ.ChartEngine.prototype.setMasterData = function (masterData, chart, params) {
		if (!chart) chart = this.chart;
		if (this.marketFactory) {
			var marketDef = this.marketFactory(chart.symbolObject);
			this.setMarket(marketDef, chart);
		}
	
		if (!params) params = {};
	
		if (!params.noCleanupDates)
			this.doCleanupDates(masterData, this.layout.interval);
	
		chart.masterData = masterData;
		if (chart.name == "chart") this.masterData = masterData;
		//chart.decimalPlaces=2;
		var i;
		var field = null;
		for (i = 0; masterData && i < masterData.length; i++) {
			var quotes = masterData[i];
	
			if (field === null) {
				if (typeof quotes.Close === "number") {
					field = "Close";
				} else if (typeof quotes.Value === "number") {
					field = "Value";
				}
			}
			if (field === "Value" && typeof quotes.Value === "number") {
				quotes.Close = quotes.Value;
			}
	
			if (quotes.DT) {
				if (Object.prototype.toString.call(quotes.DT) != "[object Date]")
					quotes.DT = new Date(quotes.DT); // if already a date object; nothing to do
				if (!quotes.Date || quotes.Date.length != 17)
					quotes.Date = CIQ.yyyymmddhhmmssmmm(quotes.DT);
			} else if (quotes.Date) quotes.DT = CIQ.strToDateTime(quotes.Date);
			else
				console.log("setMasterData : Missing DT and Date on masterData object");
			if (quotes.Volume && typeof quotes.Volume !== "number")
				quotes.Volume = parseInt(quotes.Volume, 10);
			//if(typeof quotes.Close != 'number' && !quotes.Close && quotes.Close!==null){
			//	console.log ('setMasterData : Close is missing or not a number. Use parseFloat() if your data server provides strings. MasterData Index= ' + i +' Value = ' + quotes.Close);
			//}
			if (masterData.length - i < 50) {
				// only check last 50 records
				this.updateCurrentMarketData(quotes, chart, null, { fromTrade: true });
			}
		}
		if (chart.calculateTradingDecimalPlaces)
			chart.decimalPlaces = chart.calculateTradingDecimalPlaces({
				stx: this,
				chart: chart,
				symbol: chart.symbolObject.symbol,
				symbolObject: chart.symbolObject
			});
	
		this.setDisplayDates(masterData);
		chart.roundit = Math.pow(10, chart.decimalPlaces);
	
		for (i in this.plugins) {
			var plugin = this.plugins[i];
			if (plugin.display) {
				if (plugin.setMasterData) plugin.setMasterData(this, chart);
			}
		}
	};
	
	/**
	 * Sets the master data for the chart, creates the data set, and renders the chart.
	 *
	 * @param	{string}			symbol			Ticker symbol for the chart.
	 * @param	{array}				masterData		An array of quotes. Each quote should at a minimum contain a "Close" field (capitalized) and a Date field which is a string form of the date.
	 *												This method will set DT to be a JavaScript Date object derived from the string form.
	 * @param	{CIQ.ChartEngine.Chart}	[chart]			The chart to put the masterData. Defaults to the default chart.
	 * @memberof CIQ.ChartEngine
	 * @since 3.0.0
	 */
	CIQ.ChartEngine.prototype.setMasterDataRender = function (
		symbol,
		masterData,
		chart
	) {
		if (!chart) chart = this.chart;
		if (!chart.symbol) chart.symbol = "";
		this.setMasterData(masterData, chart);
		if (masterData) {
			chart.endPoints = {};
			if (masterData.length) {
				chart.endPoints = {
					begin: masterData[0].DT,
					end: masterData[masterData.length - 1].DT
				};
				chart.symbol = symbol;
			}
		}
		this.createDataSet();
		this.initializeChart();
		this.draw();
		if (!masterData || !masterData.length) {
			chart.symbol = null;
			this.clear();
		}
		this.adjustPanelPositions();
	};
	
	/**
	 * Returns an array of all symbols currently required to be loaded by the quote feed.
	 * The returned array contains an object for each symbol containing `symbol`, `symbolObject`, `interval`, and `periodicity`.
	 *
	 * @param {object} params Control parameters.
	 * @param {boolean} [params.include-parameters] Set to true to put the series parameters in the return object.
	 * @param {boolean} [params.exclude-studies] Set to true to not include study symbols.
	 * @param {boolean} [params.breakout-equations] Set to true to return component symbols of equations.
	 * @param {boolean} [params.exclude-generated] Set to true to not include symbols which are generated by virtue of another symbol (e.g. `PlotComplementer`).
	 *
	 * @return {array} The array of symbol objects required.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 2016-03-11
	 * - 6.2.0 Added `params.breakout-equations` parameter.
	 * - 7.3.0 Added `params.exclude-generated` parameter.
	 */
	CIQ.ChartEngine.prototype.getSymbols = function (params) {
		if (!params) params = {};
		var a = [],
			obj,
			layout = this.layout,
			symbol,
			symbolObject;
		function makeObj(symbol, symbolObject, layout) {
			return {
				symbol: symbol,
				symbolObject: symbolObject,
				periodicity: layout.periodicity,
				interval: layout.interval,
				timeUnit: layout.timeUnit,
				setSpan: layout.setSpan
			};
		}
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
			if (chart.symbolObject && chart.symbolObject.symbol)
				a.push(makeObj(chart.symbol, chart.symbolObject, layout));
			for (var field in chart.series) {
				var series = chart.series[field],
					parameters = series.parameters;
				if (parameters.data && !parameters.data.useDefaultQuoteFeed) continue; // legacy
				symbolObject = parameters.symbolObject;
				symbol = parameters.symbol;
				obj = makeObj(symbol, symbolObject, layout);
				obj.id = field;
				if (params["include-parameters"]) {
					obj.parameters = CIQ.clone(parameters);
					if (obj.parameters.yAxis) delete obj.parameters.yAxis.yAxisPlotter;
				}
				if (params["exclude-studies"] && parameters.bucket == "study") continue;
				if (params["exclude-generated"] && symbolObject.generator) continue;
				a.push(obj);
			}
		}
		if (params["breakout-equations"]) {
			// replace the equations with their component symbols
			var components = {}; // use to eliminate duplicates
			for (var s = 0; s < a.length; s++) {
				symbol = a[s].symbol;
				if (this.isEquationChart(symbol)) {
					var res = CIQ.formatEquation(symbol);
					if (res) {
						var symbols = res.symbols;
						for (var sym = 0; sym < symbols.length; sym++) {
							components[symbols[sym]] = makeObj(
								symbols[sym],
								a[s].symbolObject,
								a[s]
							);
						}
					}
				} else {
					components[symbol] = makeObj(symbol, a[s].symbolObject, a[s]);
				}
			}
			a = [];
			for (var component in components) a.push(components[component]);
		}
		return a;
	};
	
	/**
	 * Sets the displayDate for the data element in masterData. The displayDate is the timezone adjusted date.
	 * @param {object} quote The quote element to check
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setDisplayDate = function (quote) {
		if (CIQ.ChartEngine.isDailyInterval(this.layout.interval)) return;
		var dt = quote.DT;
		var milli = dt.getSeconds() * 1000 + dt.getMilliseconds();
		var newDT;
		if (timezoneJS.Date && this.displayZone) {
			newDT = new timezoneJS.Date(dt.getTime(), this.displayZone);
			dt = new Date(
				newDT.getFullYear(),
				newDT.getMonth(),
				newDT.getDate(),
				newDT.getHours(),
				newDT.getMinutes()
			);
			dt = new Date(dt.getTime() + milli);
		}
		quote.displayDate = dt;
	};
	
	/**
	 * Calls {@link CIQ.ChartEngine#setDisplayDate} for each element in masterData
	 * @param {array} masterData Array containing the masterData for a ChartEngine.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setDisplayDates = function (masterData) {
		if (!masterData) return;
		if (CIQ.ChartEngine.isDailyInterval(this.layout.interval)) return;
		for (var i = 0; i < masterData.length; i++) {
			var quote = masterData[i];
			if (quote.DT) this.setDisplayDate(quote);
		}
	};
	
	/**
	 * Sets the data timezone (`dataZone`) and display timezone (`displayZone`) on an intraday chart.
	 *
	 * >**Important:**
	 * >- The `dataZone` property on this method must be set **before** any data is loaded so the engine knows how to convert the incoming records.
	 * >- The `displayZone` property on this method can be set at any time and will only affect what is displayed on the x axis.
	 * >- This method should only be used for dates that are not timeZone aware. If using the 'DT' fields in your data input records,
	 * >**DO NOT** use this function to set the `dataZone` as it will result in a double conversion.
	 *
	 * - Once set, 'Date' fields containing a time portion, will be converted to the {@link CIQ.ChartEngine#dataZone}
	 * (or the browser timezone if no dataZone is specified) before added into the `masterData`. Its corresponding 'DT' fields will be set to match.
	 * The {@link CIQ.ChartEngine#displayZone} is then created and used to translate dates based on either the local browser's timezone,
	 * or the timezone selected by the end user.
	 *
	 * - If the date ('DT' or 'Date') does not include a time offset, such as 'yyyy-mm-dd',
	 * no time zone conversion will be performed. Use this option if you prefer to display the same date on all timezones.
	 * This applies to daily, weekly and monthly periodicities only.
	 * For a list of all supported date formats see the [Input format Tutorial]{@tutorial InputDataFormat}
	 *
	 * **Time zone and the {@link quotefeed}:**<br>
	 * On a fetch call, if your quote server sends and receives string dates loaded in the 'Date' field,
	 * you can convert the provided start and end dates back to strings using {@link CIQ.yyyymmddhhmmssmmm}
	 * Example:
	 * ```
	 * var strStart =  CIQ.yyyymmddhhmmssmmm(startDate);
	 * var strEnd = CIQ.yyyymmddhhmmssmmm(endDate);
	 * ```
	 * These dates will be in the same time zone you sent them in. So they will match your quote feed.
	 *
	 * For more details on how time zones work in the chart see the {@tutorial Dates and Timezones} tutorial.
	 *
	 * **See {@link CIQ.timeZoneMap} to review a list of all chatIQ supported timezones and instructions on how to add more!**
	 *
	 * @param {string} dataZone A ChartIQ supported time zone. This should represent the time zone that the master data comes from, or set to 'null' if your dates are already time zone aware.
	 * @param {string} displayZone A ChartIQ supported time zone. This should represent the time zone that the user wishes displayed, or set to null to use the browser time zone.
	 * @memberof CIQ.ChartEngine
	 * @since 5.2 Also used to convert daily, weekly and monthly periodicities.
	 * @example
	 * //The raw data received the chart is in Greenwich Mean Time, but we want to display in Amsterdam time.
	 * stxx.setTimeZone("UTC", "Europe/Amsterdam")
	 *
	 *
	 */
	CIQ.ChartEngine.prototype.setTimeZone = function (dataZone, displayZone) {
		if (!timezoneJS.Date) {
			this.timeZoneOffset = 0;
			return;
		}
	
		var now = new Date();
		var myTimeZoneOffset = now.getTimezoneOffset();
		var dataTimeZoneOffset = myTimeZoneOffset;
		var displayTimeZoneOffset = myTimeZoneOffset;
		if (dataZone) this.dataZone = dataZone;
		if (this.dataZone)
			dataTimeZoneOffset = new timezoneJS.Date(
				now,
				this.dataZone
			).getTimezoneOffset();
		if (displayZone) this.displayZone = displayZone;
		if (this.displayZone)
			displayTimeZoneOffset = new timezoneJS.Date(
				now,
				this.displayZone
			).getTimezoneOffset();
		this.timeZoneOffset =
			dataTimeZoneOffset -
			myTimeZoneOffset -
			(displayTimeZoneOffset - myTimeZoneOffset);
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
			this.setDisplayDates(chart.masterData);
		}
		this.preferences.timeZone = displayZone;
		this.changeOccurred("preferences");
		this.createDataSet();
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Use this method to add new `OHLC` bars to the end of the chart, insert new bars into the middle of the chart, replace existing bars, delete bars, or stream individual `LAST SALE` data tick by tick as they are received from a streaming feed.
	 *
	 * **The following rules apply when adding or updating full [`OHLC`]{@tutorial InputDataFormat} bars:**
	 *
	 * - Follow proper OHLC format as outlined on the [OHLC format tutorial]{@tutorial InputDataFormat}.
	 * - If a bar is not present it will be added, if it is present it will be updated so the OHLC and volume integrity is preserved. If `allowReplaceOHL` is not set, the 'Open' is preserved from the existing candle; new 'High' and 'Low' values are calculated, and the 'Close' and 'Volume' values are replaced with the new ones.
	 * - Although gaps can be present, dates in the appendQuotes array **must maintain the correct periodicity and order** (older to newer) to prevent out of sequence bars.
	 * - If set, gaps will be filled past the currently existing bar. No gaps will be filled when inserting bars in between existing data.
	 *
	 * **The following rules apply when streaming individual `LAST SALE` data, tick by tick, as they are received from a streaming feed:**
	 *
	 * - Follow proper LAST SALE format as outlined on the parameters section under the `appendQuotes` field.
	 * - This method is designed to update the chart while maintaining the existing periodicity, finding and augmenting an existing bar for an instrument or creating new bars as needed.
	 * - It is important to note that a market iterator will be used to find the proper bar to update, and if no bar is found on that date, one will be created even in the past; so always be sure your historical data follows the rules of the market definitions when setting the dates for each bar. Remember that by default, weeks start on Sunday unless a market definition exists to indicate Sunday is not a market day, in which case the next market day will be used as the beginning of the week. Instructions to set a market for the chart can be found here: {@link CIQ.Market}
	 * - When in 'tick' interval, each trade will be added to a new bar and no aggregation to previous bars will be done.
	 *
	 * **The following rules apply when updating `BID` and `ASK` prices separately from the primary series.**
	 *
	 * - Bid, Ask and Volume are reserved for the primary series only.
	 * - The reasoning is that if your initial data sends a Bid-Ask together with the 'Close' (Last), your updates will as well; which is usually the norm.
	 * - But if your feed sends updates for Bid and Asks separately than for the 'Last' price, then you must add this additional data as you would do any other secondary series.
	 *
	 * > Assuming you have this data pre-loaded on your chart already containing Bid and Ask prices:
	 * > ```
	 * > [
	 * > 	{
	 * > 		"DT": "2019-11-19T18:17:29.000Z",
	 * > 		"Close": 266.12,
	 * >		"Volume": 300,
	 * > 		"Bid": 266.1,
	 * > 		"Ask": 266.12,
	 * >	},
	 * >	{
	 * >		"DT": "2019-11-19T18:17:29.000Z",
	 * > 		"Close": 266.12,
	 * > 		"Volume": 300,
	 * > 		"Bid": 266.1,
	 * > 		"Ask": 266.12,
	 * >	}
	 * > ]
	 * > ```
	 * > And have added this series to display the pre-loaded Bid prices:
	 * > ```
	 * > stxx.addSeries("Bid", {color: "green", loadData: false, shareYAxis: true, step:true});
	 * > ```
	 * > Use:
	 * > ```
	 * > stxx.updateChartData({Close:90}, null, { useAsLastSale: true, secondarySeries: "Bid" });
	 * > ```
	 * > or
	 * > ```
	 * > stxx.updateChartData({Last:90}, null, {secondarySeries: "Bid" });
	 * > ```
	 * > to update the bid prices.
	 *
	 * **Performance:**
	 *
	 * - To maintain system performance you can throttle inbound ticks. See {@link CIQ.ChartEngine#streamParameters } and [Streaming tutorial]{@tutorial DataIntegrationStreaming} for more details.
	 * - It is important to note that although the data will always be added to masterData, `createDataSet()` and `draw()` will **not** be called if data is received quicker than the throttle (governor) wait periods. As such, you will not see any changes until the throttle wait periods are met.
	 * - **Please adjust default settings if your implementation requires immediate updates.**
	 *
	 * **Additional Notes:**
	 *
	 * - **It is crucial that you ensure the date/time of the records being loaded are in line with your `masterData` and `dataZone`; and in the case of a last trade streaming, that your market definition will produce dates that will be in sync with the rest of your already loaded records.** See `DT` parameter for more details.
	 * - This method is **not** intended to be used as a way to load initial chart data, or data changes triggered by periodicity changes.
	 * - Do not stream current updates into the chart using this method if you have used [setSpan]{@link CIQ.ChartEngine#setSpan} or [setRange]{@link CIQ.ChartEngine#setRange} to enter 'historical mode'.
	 * When in historical mode, forward pagination is based on the date of the last loaded bar, and streaming current updates will create a data gap.
	 * To check if you are in historical mode evaluate {@link CIQ.ChartEngine#isHistoricalModeSet}
	 *
	 * See the [Data Integration]{@tutorial DataIntegrationOverview} tutorial for more detail on how to load initial data.
	 *
	 * See the [Streaming]{@tutorial DataIntegrationStreaming} tutorial for more the details.
	 *
	 * @param  {array|object} appendQuotes		**OHLC format requirements**<br><br>
	 * 											An **array** of properly formatted OHLC quote object(s). [See OHLC Data Format]{@tutorial InputDataFormat}.<br>
	 * 											Items in this array *must* be ordered from earliest to latest date.<br><br>
	 * 											As a convenience, for more generic data updates, instead of an entire OHLC record, a field of `Value` can be used as an alternative to `Close`.<br>
	 * 											Examples:
	 * ```
	 * {
	 *	DT: stxx.masterData[i].DT,
	 *	Value: 148
	 *	}
	 * ```
	 * ```
	 * {
	 *	Date: '12/31/2011',
	 *	Value: 148
	 * }
	 * ```
	 * <br><hr><br>
	 * **LAST SALE  format requirements**<br><br>
	 * An **object** with the following elements:
	 * @param  {number}	[appendQuotes.Last]		Last sale price
	 * @param  {number}	[appendQuotes.Volume]	Trade volume (**used on primary series only**)
	 * @param  {number}	[appendQuotes.Bid] 		Bid price (**used on primary series only**)
	 * @param  {number}	[appendQuotes.Ask] 		Offer/Ask price (**used on primary series only**)
	 * @param  {array}	[appendQuotes.BidL2]		Level 2 Bid, expressed as an array of [price,size,obj] pairs.  <br>For example, BidL2: [[10.05, 15, {...}],[10.06, 10, {...}],...].<br>
	 * 											`obj` is an optional object which can contain whatever you wish.  It will be conveyed all the way into the marketdepth chart and can be displayed by using the 'headsUp' method of displaying crosshair data.
	 * @param  {array}	[appendQuotes.AskL2]		Level 2 Offer/Ask expressed as an array of [price,size,obj] pairs.  <br>For example, AskL2: [[11.05, 12, {...}],[11.06, 8, {...}],...].<br>
	 * 											`obj` is an optional object which can contain whatever you wish.  It will be conveyed all the way into the marketdepth chart and can be displayed by using the 'headsUp' method of displaying crosshair data.
	 * @param  {number}	[appendQuotes.DT] 		Date of trade. It must be a java script date [new Date()]. If omitted, defaults to "right now".
	 * 											<br><br> **Last sale format DOES NOT ALLOW THE USE OF A `Date` FIELD**.
	 * 											<br> If you are using the 'Date' string field with a `dataZone` for your historical data and wish to also use it for streaming last sale updates,
	 * 											you must instead submit a properly formatted OHLC array with `useAsLastSale` set to `true`. Like this:
	 * ```
	 * stxx.updateChartData(
	 *  [
	 *   {"Date":"2015-04-16 16:00","Close":152.11,"Volume":4505569}
	 *  ],
	 *  null,
	 *  {useAsLastSale:true}
	 * );
	 * ```
	 * @param  {CIQ.ChartEngine.Chart}			[chart]				The chart to append the quotes. Defaults to the default chart.
	 * @param {object} [params] Parameters to dictate behavior
	 * @param {boolean} [params.noCreateDataSet] If true then do not create the data set automatically, just add the data to the masterData
	 * @param {boolean} [params.noCleanupDates] If true then do not clean up the dates using {@link CIQ.ChartEngine.doCleanupDates}.  Usually set if dates were already cleaned up.
	 * @param {boolean} [params.allowReplaceOHL] Set to true to bypass internal logic that maintains OHL so they are instead replaced with the new data instead of updated.
	 * @param {boolean} [params.bypassGovernor] If true then dataSet will be immediately updated regardless of {@link CIQ.ChartEngine#streamParameters}. Not applicable if `noCreateDataSet` is true.
	 * @param {boolean} [params.fillGaps] If true and {@link CIQ.ChartEngine#cleanupGaps} is also set, {@link CIQ.ChartEngine#doCleanupGaps} will be called to fill gaps for any newly added bars past the currently existing bar. It will not fill gaps for bars added to the middle of the masterData, or created by deleting a bar. <BR> Reminder: `tick` does not fill any gaps as it is not a predictable interval.
	 * @param {string} [params.secondarySeries] Set to the name of the element (valid comparison symbol, for example) to load data as a secondary series. When left out, the data will be automatically added to the primary series. <Br>**Note:** You should never set `secondarySeries` to the primary symbol. If you are unsure of what the current primary series is, you can always query the chart engine by checking `stxx.chart.symbol`.
	 * @param {boolean} [params.deleteItems] Set to true to completely delete the masterData records matching the dates in appendQuotes.
	 * @param {boolean} [params.useAsLastSale] Set to true if not using a 'last sale' formatted object in `appendQuotes`.
	 * This option is available in cases when a feed may always return OHLC formatted objects or a 'Close' field instead of a 'Last' field,
	 * even for last sale streaming updates.
	 * By definition a 'last sale' can only be a single record indicating the very 'last' sale price.
	 * As such, even if multiple records are sent in the `appendQuotes` array when this flag is enabled,
	 * only the last record's data will be used. Specifically the 'Close' and 'Volume' fields will be streamed.
	 * @param {boolean} [params.useAsLastSale.aggregatedVolume] If your last sale updates send current volume for the bar instead of just the trade volume, set this parameter to 'true' in the `params.useAsLastSale` object. The sent in volume will be used as is instead of being added to the existing bar's volume. Not applicable when loading data for a secondary series.
	 * @memberof CIQ.ChartEngine
	 * @example
	 * // this example will stream the last price on to the appropriate bar and add 90 to the bar's volume.
	 * stxx.updateChartData(
	 *   {
	 *     Last: 50.94,
	 *     Volume: 90
	 *   }
	 * );
	 * @example
	 * // this example will stream the last price on to the appropriate bar and set the volume for that bar to 90.
	 * stxx.updateChartData(
	 *   {
	 *     Last: 50.94,
	 *     Volume: 90
	 *   },
	 *   null,
	 *   {useAsLastSale: {aggregatedVolume:true}}
	 * );
	 * @example
	 * // this example will stream the last price to the appropriate bar  **for a secondary series**.
	 * stxx.updateChartData(
	 *   {
	 *     Last: 50.94
	 *   },
	 *   null,
	 *   {secondarySeries:secondarySymbol}
	 * );
	 * @example
	 * // this example will add or replace a complete bar.
	 * stxx.updateChartData(
	 *   [
	 *     {"Date":"2015-04-16 16:00","Open":152.13,"High":152.19,"Low":152.08,"Close":152.11,"Volume":4505569},
	 *     {"Date":"2015-04-17 09:30","Open":151.76,"High":151.83,"Low":151.65,"Close":151.79,"Volume":2799990},
	 *     {"Date":"2015-04-17 09:35","Open":151.79,"High":151.8,"Low":151.6,"Close":151.75,"Volume":1817706}
	 *   ]
	 * );
	 * @example
	 * // this example will add or replace a complete bar.
	 * stxx.updateChartData(
	 *   [
	 *     {"Date":"2015-04-16 16:00","Value":152.13},
	 *   ]
	 * );
	 * @since
	 * - 5.1.0 New function replacing and enhancing legacy method `appendMasterData`.
	 * - 5.1.0 Added ability to delete or insert items anywhere in the masterData. `deleteItems` parameter added.
	 * - 5.2.0 Added `overwrite` parameter.
	 * - 5.2.0 For main series data, if Close=null is set, and not streaming, then Open, High, Low and Volume also set to null.
	 * - 5.2.0 For main series data, if Volume=0/null is set, and not streaming, then Volume is reset to 0.
	 * - 5.2.0 Added `params.noCleanupDates`; `params.fillGaps` applicable now for secondary series as well.
	 * - 6.0.0 Removed `overwrite` parameter.
	 * - 6.1.0 Added BidL2 and AskL2 to `appendQuotes` object.
	 * - 6.3.0 `appendQuotes` can now take `Value` instead of `Close`.
	 * - 6.3.0 Added `obj` to BidL2 and AskL2 array elements to allow vendor specific data to be displayed on the chart tooltip.
	 * - 7.2.0 Method now rolls up ticks if period is greater than 1.
	 */
	CIQ.ChartEngine.prototype.updateChartData = function (
		appendQuotes,
		chart,
		params
	) {
		if (!params) params = {};
		if (!chart) chart = this.chart;
	
		var lastSale = false,
			aggregatedVolume = false,
			masterData = chart.masterData,
			layout = this.layout,
			dataZone = this.dataZone;
		var self = this,
			secondary = params.secondarySeries,
			field,
			symbol;
		var isValidNumber = CIQ.isValidNumber;
	
		// If we are not a tick interval, we want to adjust the DT property of the appendQuotes so it matches the periodicity/interval of the existing chart data.
		function adjustDatesToInterval() {
			if (!CIQ.Market || !chart.market) return;
			// On intraday intervals we use a 24 hour market because we don't want our bars to artificially stop
			// at the end of a market session. If we get extended hours, or bad ticks we still
			// want to print them on the chart. Trust the data.
			var marketDef = {
				market_tz: CIQ.getFromNS(chart, "market.market_def.market_tz", null)
			};
			var mktInterval = layout.interval;
	
			if (mktInterval == "month" || mktInterval == "week") {
				// if we are rolling day bars into week or month we have to iterate day by day to find the right bar.
				if (!self.dontRoll) mktInterval = "day";
				// on week and month we need to know when the week/month starts to find the right day for the candles.
				marketDef = self.chart.market.market_def;
			}
	
			var theMarket = new CIQ.Market(marketDef);
			var iter_parms = {
				begin:
					masterData && masterData.length
						? masterData[masterData.length - 1].DT
						: appendQuotes.DT,
				interval: mktInterval,
				periodicity: 1,
				timeUnit: layout.timeUnit
			};
	
			var iter = theMarket.newIterator(iter_parms);
			var next = iter.next();
			var max, actualTime;
			if (!masterData) {
				// there are some use cases where you might prefer to stream data onto masterData without using a quotefeed or loading data first.
				appendQuotes.DT = new Date(+iter.previous());
			} else if (appendQuotes.DT < next) {
				// update current tick or some tick in the past.
				max = 0; // safety catch so we don't go on forever.
				var previous = iter.previous();
				actualTime = appendQuotes.DT;
				params.appending = true;
				while (actualTime < previous && max < 1000) {
					params.appending = false;
					previous = iter.previous();
					max++;
				}
				appendQuotes.DT = previous;
				params.updating = !params.appending;
			} else if (appendQuotes.DT >= next) {
				// create new tick. If the date matches, that's it, otherwise fast forward to find the right bar to add.
				max = 0; // safety catch so we don't go on forever.
				actualTime = appendQuotes.DT;
				while (actualTime > next && max < 1000) {
					appendQuotes.DT = next;
					next = iter.next();
					max++;
				}
				params.appending = true;
			}
		}
	
		// Takes the Last Sale data from the appendQuote and converts it to OHLC data
		function formatFromLastSaleData() {
			// self is last sale streaming so format accordingly
			lastSale = true;
	
			if (params.useAsLastSale && params.useAsLastSale.aggregatedVolume)
				aggregatedVolume = true;
	
			if (appendQuotes.constructor === Array) {
				// is streaming an array of OHLC, do some clean up to extract last and volume
				var lastBar = appendQuotes[appendQuotes.length - 1];
				appendQuotes = {};
	
				// doCleanupDates will make sure this has a valid 'DT' field in the right timeZone,
				// no need to check or convert from 'Date'
				appendQuotes.DT = lastBar.DT;
	
				appendQuotes.Close = lastBar.Close;
				appendQuotes.Volume = lastBar.Volume;
			} else if (appendQuotes.Last) {
				appendQuotes.Close = appendQuotes.Last;
				delete appendQuotes.Last;
			}
	
			if (
				appendQuotes.DT &&
				Object.prototype.toString.call(appendQuotes.DT) != "[object Date]"
			)
				appendQuotes.DT = new Date(appendQuotes.DT); // epoch or ISO string
			if (!appendQuotes.DT || appendQuotes.DT == "Invalid Date") {
				// if no date is sent in, use the current time and adjust to the dataZone
				appendQuotes.DT = new Date();
			}
	
			// find the right candle
			if (layout.interval != "tick") {
				adjustDatesToInterval();
			}
	
			appendQuotes.Open = appendQuotes.Close;
			appendQuotes.High = appendQuotes.Close;
			appendQuotes.Low = appendQuotes.Close;
		}
	
		// Fills the gaps from the most recent master data record to the new data
		function fillGapsFromMasterDataHead() {
			var lastRecordForThis = null;
			var fg = 0; // this is used to store the index of the first record in appendQuotes we should be using to fill gaps.
			// we'll adjust this below by looking for the starting point from masterData
			if (masterData.length) {
				lastRecordForThis = self.getFirstLastDataRecord(
					masterData,
					secondary || chart.defaultPlotField,
					true
				);
				if (lastRecordForThis) {
					if (appendQuotes[appendQuotes.length - 1].DT <= lastRecordForThis.DT)
						return; // no gap to fill
					for (; fg < appendQuotes.length; fg++) {
						if (+appendQuotes[fg].DT == +lastRecordForThis.DT) {
							// if the appendQuote is the same as the lastRecordForThis, check to see which is the "correct" record
							if (
								self.getFirstLastDataRecord(
									[appendQuotes[fg]],
									secondary || chart.defaultPlotField
								)
							)
								lastRecordForThis = null; // use appendQuote record
							break;
						} else if (appendQuotes[fg].DT > lastRecordForThis.DT) break;
					}
				}
			}
			// now fg represents the index of the first element in appendQuotes which appears after the last current element for that security.
			var gapQuotes = appendQuotes.slice(fg);
			if (lastRecordForThis)
				gapQuotes.unshift(
					secondary ? lastRecordForThis[secondary] : lastRecordForThis
				); // add previous bar so we can close gaps
			gapQuotes = self.doCleanupGaps(gapQuotes, chart);
			if (lastRecordForThis) gapQuotes.shift(); // remove previous bar
			appendQuotes = appendQuotes.slice(0, fg).concat(gapQuotes);
		}
	
		// Deletes an item from masterData at index i and date dt
		function deleteThisItem(i, dt) {
			var replace;
			if (secondary) {
				delete masterData[i][secondary];
				if (self.cleanupGaps) {
					replace = { DT: dt, Close: null };
					if (
						self.cleanupGaps != "gap" &&
						masterData[i - 1] &&
						masterData[i - 1][secondary]
					) {
						replace.Close = masterData[i - 1][secondary].Close;
						replace.High = replace.Low = replace.Open = replace.Close;
						replace.Volume = 0;
					}
					masterData[i][secondary] = replace;
				}
			} else {
				var spliced = masterData.splice(i, 1)[0]; //deleting from masterData here, but will reinsert if find any series data
				replace = { DT: spliced.DT, Close: null, needed: false };
				for (field in chart.series) {
					symbol = chart.series[field].parameters.symbolObject.symbol;
					if (typeof spliced[symbol] != "undefined") {
						replace[symbol] = spliced[symbol];
						delete replace.needed;
					}
				}
				if (self.cleanupGaps && self.cleanupGaps != "gap") {
					delete replace.needed;
					if (self.cleanupGaps != "gap" && masterData[i - 1]) {
						replace.Close = masterData[i - 1].Close;
						replace.High = replace.Low = replace.Open = replace.Close;
						replace.Volume = 0;
					}
				}
				if (replace.needed !== false) {
					masterData.splice(i, 0, replace);
					self.setDisplayDate(replace);
				}
			}
		}
	
		// Takes masterData at index i and merges it into a quote q
		function mergeMasterDataIntoNewData(i, q) {
			// If we're replacing the last bar then we want to save any series and study data, otherwise comparisons will [briefly] disappear during refreshes
			//Preserve any relevant data from prior fetched quote for this bar.
			//Here we are assuming that the data being appended to masterData is a data update, perhaps from only one exchange, while
			//the existing masterData is a consolidated quote. We trust the quote we had in masterData to have the more accurate
			//volume and open, and use the high/low from there in combination with the updated data's to determine the daily high/low.
			var master = masterData[i];
			if (secondary) master = master[secondary] || {};
	
			if (q.Close === null) {
				if (master.Open !== undefined) q.Open = null;
				if (master.High !== undefined) q.High = null;
				if (master.Low !== undefined) q.Low = null;
				if (master.Volume !== undefined) q.Volume = null;
				// This code will set the OHLC data for carry gap filling if applicable,
				// but it's disabled because if a Close:null is sent in, then just use it.
				// I suppose if a gap is really to be filled in, the record should be deleted.
				/*if(this.cleanupGaps && this.cleanupGaps!="gap" && masterData[i-1]){
						if(!secondary || masterData[i-1][secondary]){
							q.Close=secondary?masterData[i-1][secondary].Close:masterData[i-1].Close;
							q.High=q.Low=q.Open=q.Close;
							q.Volume=0;
						}
					}*/
			} else {
				if (lastSale) {
					if (q.Volume) {
						q.Volume = parseInt(q.Volume, 10);
					}
					if (!aggregatedVolume) q.Volume += master.Volume;
				} else {
					if (!isValidNumber(q.Volume) && master.Volume) {
						q.Volume = master.Volume;
					}
				}
				if (!params.allowReplaceOHL) {
					if (isValidNumber(master.Open)) {
						q.Open = master.Open;
					}
					if (isValidNumber(master.High) && isValidNumber(q.High)) {
						if (master.High > q.High) q.High = master.High;
					}
					if (isValidNumber(master.Low) && isValidNumber(q.Low)) {
						if (master.Low < q.Low) q.Low = master.Low;
					}
				}
				// if new data is invalid, revert to old data
				["Close", "Open", "High", "Low", "Bid", "Ask"].forEach(function (field) {
					if (!isValidNumber(q[field])) q[field] = master[field];
				});
	
				for (field in chart.series) {
					symbol = chart.series[field].parameters.symbolObject.symbol;
					if (
						typeof q[symbol] == "undefined" &&
						typeof master[symbol] != "undefined"
					)
						q[symbol] = master[symbol];
				}
			}
		}
	
		if (!params.noCleanupDates)
			this.doCleanupDates(appendQuotes, layout.interval);
	
		if (
			params.useAsLastSale ||
			(appendQuotes.constructor == Object &&
				(appendQuotes.Last || appendQuotes.Last === 0))
		) {
			formatFromLastSaleData();
		}
	
		if (appendQuotes && appendQuotes.constructor == Object)
			appendQuotes = [appendQuotes]; // When developer mistakenly sends an object instead of an array of objects
		if (!appendQuotes || !appendQuotes.length) return;
		if (this.runPrepend("appendMasterData", [appendQuotes, chart, params]))
			return;
		if (this.runPrepend("updateChartData", [appendQuotes, chart, params])) return;
	
		if (!masterData) masterData = [];
	
		var i = masterData.length - 1,
			placedFirstQuote = false;
	
		// we only fill from the end of the current data, not before
		if (params.fillGaps) fillGapsFromMasterDataHead();
		if (!appendQuotes.length) return; // can happen within fillGapsFromMasterDataHead
	
		for (var j = 0; j < appendQuotes.length; j++) {
			var quote = appendQuotes[j];
			var dt = quote.DT,
				date = quote.Date;
			if (dt && Object.prototype.toString.call(dt) != "[object Date]")
				quote.DT = dt = new Date(dt); // if already a date object; nothing to do
			if (dt) {
				if (!date || date.length != 17)
					quote.Date = CIQ.yyyymmddhhmmssmmm(quote.DT);
			}
			if (!dt) dt = quote.DT = CIQ.strToDateTime(date);
	
			// If Value provided, it has special meaning if Close not provided (it's the Close)
			if (!isValidNumber(quote.Close) && isValidNumber(quote.Value)) {
				quote.Close = quote.Value;
			}
	
			while (i >= 0 && i < masterData.length) {
				var dt2 = masterData[i].DT;
				if (!dt2) dt2 = CIQ.strToDateTime(masterData[i].Date);
				if (dt2.getTime() <= dt.getTime()) {
					placedFirstQuote = true;
					var plusOne = 0; // If time is the same then replace last bar
					if (dt2.getTime() < dt.getTime()) {
						if (i < masterData.length - 1) {
							var dtf =
								masterData[i + 1].DT || CIQ.strToDateTime(masterData[i + 1].Date);
							if (dtf.getTime() <= dt.getTime()) {
								i++;
								continue;
							}
						}
						plusOne = 1; // Otherwise append bar
					}
					if (params.deleteItems) {
						if (!plusOne) deleteThisItem(i, dt);
						break;
					} else {
						// Under tick mode, always append bars. If animating, append on the first loop and replace on subsequent loops
						if (layout.interval == "tick" && params.firstLoop !== false)
							plusOne = 1;
						if (!plusOne) mergeMasterDataIntoNewData(i, quote);
	
						// Here we rectify any missing/malformatted data and set any new high/low
						// If we don't set this here, the study calculations will fail
						if (isValidNumber(quote.Close)) {
							if (!isValidNumber(quote.Open)) quote.Open = quote.Close;
	
							var high = Math.max(quote.Open, quote.Close),
								low = Math.min(quote.Open, quote.Close);
							if (!isValidNumber(quote.High) || quote.High < high)
								quote.High = high;
							if (!isValidNumber(quote.Low) || quote.Low > low) quote.Low = low;
						}
						if (quote.Volume && !isValidNumber(quote.Volume))
							quote.Volume = parseInt(quote.Volume, 10);
						i += plusOne;
	
						// Insert into masterData here
						if (secondary) {
							if (appendQuotes.length - j < 50) {
								// only check last 50 records
								this.updateCurrentMarketData(quote, chart, secondary, {
									fromTrade: true
								});
							}
							if (layout.interval != "tick" || quote.Close !== undefined) {
								if (plusOne) {
									masterData.splice(i, 0, { DT: quote.DT });
									this.setDisplayDate(masterData[i]);
								}
								masterData[i][secondary] = quote;
							}
						} else {
							if (appendQuotes.length - j < 50) {
								// only check last 50 records
								this.updateCurrentMarketData(quote, chart, null, {
									fromTrade: true
								});
							}
							if (layout.interval != "tick" || quote.Close !== undefined) {
								// inserting into masterData happens here
								masterData.splice(i, plusOne ? 0 : 1, quote);
								this.setDisplayDate(quote);
							}
						}
					}
					break;
				}
				i += placedFirstQuote ? 1 : -1;
			}
			if (i < 0) {
				// we have at least one point which needs to be prepended to masterData
				// this code will prepend the first of these points, then everything else will fall in line
				if (secondary) {
					this.updateCurrentMarketData(quote, chart, secondary, {
						fromTrade: true
					});
					if (layout.interval != "tick" || quote.Close !== undefined) {
						masterData.splice(0, 0, { DT: quote.DT });
						this.setDisplayDate(masterData[0]);
						masterData[0][secondary] = quote;
					}
				} else {
					this.updateCurrentMarketData(quote, chart, null, { fromTrade: true });
					if (layout.interval != "tick" || quote.Close !== undefined) {
						masterData.splice(0, 0, quote);
						this.setDisplayDate(quote);
					}
				}
				placedFirstQuote = true;
				i = 0;
			}
		}
		if (masterData.length) this.masterData = chart.masterData = masterData;
		if (this.maxMasterDataSize)
			masterData = chart.masterData = this.masterData = masterData.slice(
				-this.maxMasterDataSize
			);
	
		var series = secondary
			? this.getSeries({ symbol: secondary, chart: chart })
			: [chart];
		for (var s = 0; s < series.length; s++) {
			var handle = series[s];
			if (!handle.endPoints.begin || handle.endPoints.begin > appendQuotes[0].DT)
				handle.endPoints.begin = appendQuotes[0].DT;
			if (
				!handle.endPoints.end ||
				handle.endPoints.end < appendQuotes[appendQuotes.length - 1].DT
			)
				handle.endPoints.end = appendQuotes[appendQuotes.length - 1].DT;
			var hField =
				(handle.parameters && handle.parameters.field) || chart.defaultPlotField;
			var lastQuote = this.getFirstLastDataRecord(appendQuotes, hField, true);
			if (lastQuote && (!handle.lastQuote || handle.lastQuote.DT <= lastQuote.DT))
				handle.lastQuote = lastQuote;
			if (secondary && params.deleteItems)
				handle.lastQuote = this.getFirstLastDataRecord(
					masterData,
					secondary,
					true
				)[secondary];
		}
		for (var pl in this.plugins) {
			var plugin = this.plugins[pl];
			if (plugin.display) {
				if (plugin.appendMasterData)
					plugin.appendMasterData(this, appendQuotes, chart);
			}
		}
		if (!this.masterData || !this.masterData.length) this.masterData = masterData;
	
		function dataSetAndDraw() {
			self.createDataSet(null, null, params);
			self.draw();
			self.updateChartAccessories();
			self.streamParameters.count = 0;
			self.streamParameters.timeout = -1;
		}
	
		if (!params.noCreateDataSet) {
			var sp = this.streamParameters;
			if (++sp.count > sp.maxTicks || params.bypassGovernor) {
				clearTimeout(sp.timeout);
				dataSetAndDraw();
			} else {
				if (sp.timeout == -1) {
					sp.timeout = setTimeout(dataSetAndDraw, sp.maxWait);
				}
			}
		}
		this.runAppend("appendMasterData", arguments);
		this.runAppend("updateChartData", arguments);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Loads or updates detailed current market information, such as L2 data, into the [chart.currentMarketData]{@link CIQ.ChartEngine.Chart#currentMarketData} object
	 * or an equally laid out object for a secondary series (symbol), if one provided.
	 *
	 * **[draw()]{@link CIQ.ChartEngine#draw} must be called immediately after this method to see the updates.**
	 *
	 * A single ‘snapshot’ object per symbol is loaded and only the most current updates maintained.
	 * This method is not intended to track historical or time-series information.
	 *
	 * This market ‘snapshot’ information can then be used to render specialty charts such as {@link CIQ.MarketDepth}, which is not a time series chart.
	 * This data is also used to feed the Depth of Market indicator, [Trade History]{@link WebComponents.cq-tradehistory} and
	 * [Order Book]{@link WebComponents.cq-orderbook} web components, part of the [Active Trader package](https://active-trader.demo.chartiq.com/).
	 *
	 * When using as part of a chart engine that also display a time-series chart, this method is automatically called with that same time-series data every time new data is load into the chart, thereby maintaing all charts in sync.
	 * And only needs to be explicitly called when needing to update the L2 'snapshot' at a faster refresh rate than the rest of the time-series data, or if the time-series data does not provide this information.
	 * <br>If using the {@link CIQ.MarketDepth} standalone, without a standard time series chart, you must call this method explicitly to load and refresh the data.
	 *
	 * Data Format:
	 *
	 * | Field | Required | Type | Description | Used for Active Trader | Used for TFC |
	 * | ----------- | -------- | ---------------- | ---------------- | ---------------- | ---------------- |
	 * | DT | Yes | A JavaScript Date() object | Timestamp for the data record | Yes | Yes |
	 * | Bid | No | number | The current bid price | No | Yes |
	 * | Ask | No | number | The current ask price | No | Yes |
	 * | Last | No | number | The last (current) price.<br>If not present, the midpoint of the chart will be the average of the lowest bid and the highest ask.<br>Required on [Trade History](http://jsfiddle.net/chartiq/r2k80wcu) | Yes | Yes |
	 * | BidSize | No | number | The bid size  | No | No |
	 * | AskSize | No | number | The ask size | No | No |
	 * | LastSize | No | number | The last (current) price size.<br>Required on [Trade History](http://jsfiddle.net/chartiq/r2k80wcu) | Yes | No |
	 * | LastTime | No | A JavaScript Date() object | Timestamp for the <b>Last</b> price provided.<br>Required on [Trade History](http://jsfiddle.net/chartiq/r2k80wcu) | Yes | No |
	 * | BidL2 | No | array | Level 2 Bid, expressed as an array of [price,size] pairs.<br>For example, BidL2: [[10.05,15],[10.06,10],...]<br>Required on [Order Book](http://jsfiddle.net/chartiq/L30hna2s/) | Yes | No |
	 * | AskL2 | No | array | Level 2 Ask, expressed as an array of [price,size] pairs.<br>For example, AskL2: [[10.05,15],[10.06,10],...]<br>Required on [Order Book](http://jsfiddle.net/chartiq/L30hna2s/) | Yes | No |
	 *
	 * Since not all of the data will need to be updated at the same time, this method allows you to send only the data that needs to be changed. Any values not provided will simply be skipped and not updated on the object.
	 *
	 * Example data format for a marketDepth chart:
	 * ```
	 * {
	 * 	DT:new Date("2018-07-30T04:00:00.000Z"),
	 * 	Last:100.2589,
	 * 	BidL2:
	 * 	[
	 * 		[93.54,5],[93.65,2],[93.95,7],[95.36,2],
	 * 		[95.97,9],[96.58,1], [96.68, 8], [96.98, 4],
	 * 		[97.08, 5], [97.18, 5], [97.28, 3], [97.38, 5],
	 * 		[97.48, 6], [97.69, 26], [98.29, 5], [98.39, 33],
	 * 		[98.49, 13], [98.6, 42], [98.8, 13], [98.9, 1]
	 * 	],
	 *
	 * 	AskL2:
	 * 	[
	 * 		[101.22,226],[101.32,31],[101.42,13],[101.53,188],
	 * 		[101.63,8],[101.73,5],[101.83,16],[101.93,130],
	 * 		[102.03,9],[102.13,122],[102.23,5],[102.33,5],
	 * 		[102.43,7],[102.54,9],[102.84,3],[102.94,92],
	 * 		[103.04,7],[103.24,4],[103.34,7],[103.44,6]
	 * 	]
	 * }
	 * ```
	 *
	 * @param {object} data Data to load as per required format.
	 * @param  {CIQ.ChartEngine.Chart} chart The chart whose market data to update. Defaults to the instance chart.
	 * @param {string} symbol Symbol if passing secondary series information
	 * @param {object} params  Additional parameters
	 * @param {boolean} [params.fromTrade] This function can be called directly or as a result of a trade update, such as from {@link CIQ.ChartEngine.Chart#updateChartData}.
	 * 										Set this param to `true` to indicate the incoming data is a master data record.
	 * 										Otherwise the function will attempt to adjust the record date to align with the last bar.
	 * @param {boolean} [params.finalClose] If the data.Close is being manipulated (such as with animation), this param should contain the real, final Close value
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 6.1.0
	 * - 6.1.1 Added `params.fromTrade`.
	 * - 6.2.3 Added `params.finalClose`.
	 */
	CIQ.ChartEngine.prototype.updateCurrentMarketData = function (
		data,
		chart,
		symbol,
		params
	) {
		if (!data || !data.DT) return;
		if (!chart) chart = this.chart;
		var calledFromTrade = params && params.fromTrade;
		// find the right bar for the data, if not found already
		var timestamp = data.DT;
		if (!calledFromTrade && this.layout.interval != "tick" && chart.market) {
			if (chart.market.market_def) {
				if (!chart.market.isMarketDate(data.DT)) return; // non-market date, disregard
				if (
					!CIQ.ChartEngine.isDailyInterval(this.layout.interval) &&
					chart.market.getSession(data.DT) === null
				)
					return; // outside of market hours, disregard
			}
			// Find the latest possible bar for this data, including after hours
			// Iterate off a copy so we don't mess with the chart's market's settings!
			var iter_parms = {
				begin: data.DT,
				interval: this.layout.interval,
				periodicity: this.layout.periodicity,
				timeUnit: this.layout.timeUnit
			};
			var market = new CIQ.Market(chart.market.market_def);
			if (this.extendedHours && this.extendedHours.filter)
				market.enableAllAvailableSessions();
			var iter = market.newIterator(iter_parms);
			iter.next();
			data.DT = iter.previous();
		}
	
		if (this.runPrepend("updateCurrentMarketData", arguments)) return;
		var currentMarketData = chart.currentMarketData;
		if (symbol) {
			if (!currentMarketData[symbol]) currentMarketData[symbol] = {};
			currentMarketData = currentMarketData[symbol];
		}
		["Last", "Bid", "Ask"].forEach(function (i) {
			if (data[i] && typeof data[i] == "number") {
				if (
					!currentMarketData[i] ||
					!currentMarketData[i].DT ||
					currentMarketData[i].DT <= data.DT
				) {
					currentMarketData[i] = {
						DT: data.DT,
						Price: data[i],
						Size: data[i + "Size"],
						Timestamp: timestamp
					};
				}
			}
		});
		["BidL2", "AskL2"].forEach(function (i) {
			if (data[i] && data[i] instanceof Array) {
				if (
					!currentMarketData[i] ||
					!currentMarketData[i].DT ||
					currentMarketData[i].DT <= data.DT
				) {
					currentMarketData[i] = {
						DT: data.DT,
						Price_Size: data[i],
						Timestamp: timestamp
					};
				}
			}
		});
		if (
			data.Close &&
			(!currentMarketData.Last || currentMarketData.Last.DT <= data.DT)
		) {
			var close = data.Close,
				finalClose = params && params.finalClose;
			if (finalClose || finalClose === 0) close = finalClose;
			currentMarketData.Last = {
				DT: data.DT,
				Price: close,
				Size:
					data.LastSize === undefined && this.layout.interval == "tick"
						? data.Volume
						: data.LastSize,
				Timestamp: data.LastTime || timestamp
			};
		}
		currentMarketData.touched = new Date(); // so we can observe it
	
		if (!calledFromTrade) delete data.Last; //  can cause problems in injections if left
	
		this.runAppend("updateCurrentMarketData", arguments);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Clears the [chart.currentMarketData]{@link CIQ.ChartEngine.Chart#currentMarketData} object or the one linked to a secondary series, if one provided.
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to clear. If omitted, will clear all charts.
	 * @param {string} symbol Symbol to clear this symbol's secondary series information
	 * @memberof CIQ.ChartEngine
	 * @since 6.1.0
	 */
	CIQ.ChartEngine.prototype.clearCurrentMarketData = function (chart, symbol) {
		if (this.runPrepend("clearCurrentMarketData", arguments)) return;
		var ch,
			charts = [];
		if (!chart) {
			for (ch in this.charts) {
				charts.push(this.charts[ch]);
			}
		} else {
			charts.push(chart);
		}
		for (ch = 0; ch < charts.length; ch++) {
			var md = charts[ch].currentMarketData;
			if (symbol) {
				delete md[symbol];
			} else {
				// preserve original object as it's being observed
				for (var d in md) {
					md[d] = undefined;
				}
			}
		}
		this.runAppend("clearCurrentMarketData", arguments);
	};
	
	};
	
	
	let __js_core_engine_event_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Legacy method used to internally dispatch a registered event whenever a change to layout, drawings or theme occurs.
	 * Events must be registered using {@link CIQ.ChartEngine#addDomEventListener} for "layout", "drawing", "theme" and "preferences".
	 *
	 * This is simply a proxy method that calls the corresponding {@link CIQ.ChartEngine#dispatch} method.
	 *
	 * Developers creating their own custom functionality should call {@link CIQ.ChartEngine#dispatch} instead.
	 *
	 * @param  {string} change Type of change that occurred.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.changeOccurred = function (change) {
		var obj = {
			stx: this,
			symbol: this.chart.symbol,
			symbolObject: this.chart.symbolObject,
			layout: this.layout,
			drawings: this.drawingObjects
		};
		if (change == "theme") this.dispatch("theme", obj);
		if (this.currentlyImporting) return; // changes actually occurring because of an import, not user activity
		if (change == "layout") {
			this.dispatch("layout", obj);
		} else if (change == "vector") {
			this.dispatch("drawing", obj);
		} else if (change == "preferences") {
			this.dispatch("preferences", obj);
		}
	};
	
	/**
	 * Charts may require asynchronous data to render. This creates a dilemma for any external
	 * process that depends on a fully rendered chart (for instance a process to turn a chart into an image).
	 * To solve this problem, external processes can register for a callback which will tell them when the chart
	 * has been drawn. See {@link CIQ.ChartEngine.registerChartDrawnCallback}.
	 *
	 * To accommodate this requirement, studies, plugins or injections that render asynchronously should use startAsyncAction
	 * and {@link CIQ.ChartEngine#completeAsyncAction} to inform the chart of their asynchronous activity.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.startAsyncAction = function () {
		if (!this.pendingAsyncs) this.pendingAsyncs = [];
		this.pendingAsyncs.push(true);
	};
	
	/**
	 * Registers a callback for when the chart has been drawn
	 * @param  {function} fc The function to call
	 * @return {object} An object that can be passed in to {@link CIQ.ChartEngine#unregisterChartDrawnCallback}
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.registerChartDrawnCallback = function (fc) {
		if (!this.asyncCallbacks) this.asyncCallbacks = [];
		this.asyncCallbacks.push(fc);
		return {
			fc: fc
		};
	};
	
	/**
	 * Removes a callback registration for when the chart has been drawn
	 * @param  {object} obj An object from {@link CIQ.ChartEngine#registerDrawnCallback}
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.unregisterChartDrawnCallback = function (obj) {
		for (var i = 0; i < this.asyncCallbacks.length; i++) {
			if (this.asyncCallbacks[i] == obj.fc) {
				this.asyncCallbacks.splice(i, 1);
				return;
			}
		}
	};
	
	/**
	 * Makes the async callbacks only if no pending async activity
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.makeAsyncCallbacks = function () {
		if (!this.asyncCallbacks) return; // no callbacks to make
		if (!this.pendingAsyncs || !this.pendingAsyncs.length) {
			// If no pending asyncs, or the array is empty (all have been fulfilled)
			for (var i = 0; i < this.asyncCallbacks.length; i++) {
				this.asyncCallbacks[i]();
			}
		}
	};
	/**
	 * Studies or plugins that use asynchronous data should call this when their async activities are complete.
	 * See {@link CIQ.ChartEngine#startAsyncAction}
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.completeAsyncAction = function () {
		this.pendingAsyncs.pop();
		this.makeAsyncCallbacks();
	};
	
	/**
	 * Add a DOM element's event listener and index it so that it will be removed when invoking CIQ.ChartEngine.destroy().
	 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	 * @param {element} element DOM element to listen for changes on
	 * @param {string} event The event type to listen for. Possible values: https://developer.mozilla.org/en-US/docs/Web/Events
	 * @param {function} listener The callback to invoke when the event happens.
	 * @param {*} Either a boolean or object. See addEventListener options.
	 * @see {@link CIQ.ChartEngine#destroy}
	 * @private
	 * @since 3.0.0
	 */
	CIQ.ChartEngine.prototype.addDomEventListener = function (
		element,
		event,
		listener,
		options
	) {
		element.addEventListener(event, listener, options);
		this.eventListeners.push({
			element: element,
			event: event,
			function: listener,
			options: options
		});
	};
	
	/**
	 * Registers a listener for a chart event in the chart engine instance.
	 *
	 * Events are tracked in the `CIQ.ChartEngine.callbackListeners` object, which is READ ONLY and
	 * should never be manually altered.
	 *
	 * Valid event types and listeners:
	 *   - `*`: Passing in this value registers the listener to every event type below.
	 *   - `doubleTap`: [doubleTapEventListener]{@link CIQ.ChartEngine~doubleTapEventListener}
	 *   - `doubleClick`: [doubleClickEventListener]{@link CIQ.ChartEngine~doubleClickEventListener}
	 *   - `drawing`: [drawingEventListener]{@link CIQ.ChartEngine~drawingEventListener}
	 *   - `drawingEdit`: [drawingEditEventListener]{@link CIQ.ChartEngine~drawingEditEventListener}
	 *   - `floatingWindow`: [floatingWindowEventListener]{@link CIQ.ChartEngine~floatingWindowEventListener}
	 *   - `layout`: [layoutEventListener]{@link CIQ.ChartEngine~layoutEventListener}
	 *   - `longhold`: [longholdEventListener]{@link CIQ.ChartEngine~longholdEventListener}
	 *   - `move`: [moveEventListener]{@link CIQ.ChartEngine~moveEventListener}
	 *   - `newChart`: [newChartEventListener]{@link CIQ.ChartEngine~newChartEventListener}
	 *   - `notification`: [notificationEventListener]{@link CIQ.ChartEngine~notificationEventListener}
	 *   - `periodicity`: [periodicityEventListener]{@link CIQ.ChartEngine~periodicityEventListener}
	 *   - `preferences`: [preferencesEventListener]{@link CIQ.ChartEngine~preferencesEventListener}
	 *   - `rightClick`: [rightClickEventListener]{@link CIQ.ChartEngine~rightClickEventListener}
	 *   - `scroll`: [scrollEventListener]{@link CIQ.ChartEngine~scrollEventListener}
	 *   - `studyOverlayEdit`: [studyOverlayEditEventListener]{@link CIQ.ChartEngine~studyOverlayEditEventListener}
	 *   - `studyPanelEdit`: [studyPanelEditEventListener]{@link CIQ.ChartEngine~studyPanelEditEventListener}
	 *   - `symbolChange`: [symbolChangeEventListener]{@link CIQ.ChartEngine~symbolChangeEventListener}
	 *   - `symbolImport`: [symbolImportEventListener]{@link CIQ.ChartEngine~symbolImportEventListener}
	 *   - `tap`: [tapEventListener]{@link CIQ.ChartEngine~tapEventListener}
	 *   - `theme`: [themeEventListener]{@link CIQ.ChartEngine~themeEventListener}
	 *   - `undoStamp`: [undoStampEventListener]{@link CIQ.ChartEngine~undoStampEventListener}
	 *
	 * @param {string|string[]} type One or more event types to listen for. See the description above
	 * 		for valid types.
	 * @param {function} callback The listener to call when the event or events specified by `type`
	 * 		are triggered. Accepts an object argument containing properties specified in the event
	 * 		listener definition.
	 * @return {object} An object containing `type` and `callback`. The object can be passed to
	 * 		{@link CIQ.ChartEngine#removeEventListener} to remove the listener.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 04-2016-08
	 * - 4.0.0 Added "doubleTap".
	 * - 4.0.0 Type can be an array of event options.
	 * - 6.3.0 Added "scroll".
	 * - 7.0.0 Added "preferences" and "drawingEdit".
	 * - 8.1.0 Added "periodicity".
	 * - 8.2.0 Added "notification" and "floatingWindow".
	 *
	 * @example <caption>Add a "longhold" event listener.</caption>
	 * stxx.longHoldTime = ... // Optionally override default value of 700ms.
	 * stxx.addEventListener("longhold", function(lhObject) {
	 *     CIQ.alert("longhold event at x: " + lhObject.x + " y: " + lhObject.y);
	 * });
	 *
	 * @example <caption>Add a "tap" listener that provides location and details when a series is clicked or tapped.</caption>
	 * stxx.addEventListener("tap", function(tapObject){
	 *     if (this.anyHighlighted) {
	 *         for (let n in this.chart.seriesRenderers) {
	 *             let r = this.chart.seriesRenderers[n];
	 *             for (let j = 0; j < r.seriesParams.length; j++) {
	 *                 series = r.seriesParams[j];
	 *                 if (series.highlight) {
	 *                     let bar = this.barFromPixel(tapObject.x);
	 *                     if (this.chart.dataSegment[bar]) {
	 *                         // Replace console.log with your required logic as needed.
	 *                         console.log("Tap event at pixel x: " + tapObject.x + " y: " + tapObject.y);
	 *                         console.log("Price:", this.priceFromPixel(tapObject.y), " Date: ", this.chart.dataSegment[bar].DT);
	 *                         console.log("Series Details: ", JSON.stringify(series));
	 *                     }
	 *                 }
	 *             }
	 *         }
	 *     }
	 * });
	 */
	CIQ.ChartEngine.prototype.addEventListener = function (type, callback) {
		if (type === "*") {
			for (var key in this.callbackListeners) {
				this.callbackListeners[key].push(callback);
			}
		} else if (type instanceof Array) {
			for (var i = 0; i < type.length; i++) {
				this.callbackListeners[type[i]].push(callback);
			}
		} else {
			var arr = this.callbackListeners[type];
			if (!arr) {
				throw new Error("Attempted to add an invalid listener.");
			}
			arr.push(callback);
		}
		return { type: type, cb: callback };
	};
	
	/**
	 * Removes a listener for a chart event type.
	 *
	 * If the event type is "*", listeners for all event types are removed. See
	 * {@link CIQ.ChartEngine#addEventListener} for valid event types.
	 *
	 * Events are tracked in the `CIQ.ChartEngine.callbackListeners` object.
	 *
	 * @param {object|string} obj The object returned from adding the listener (see
	 * 		{@link CIQ.ChartEngine#addEventListener}) or a string that identifies the type of event.
	 * 		<p>**Note:** If this parameter is a string, the optional `cb` parameter is required.
	 * @param {string} obj.type The type of event.
	 * @param {function} obj.cb The listener to be removed.
	 * @param {function} [cb] The listener to be removed. Required if the `obj` parameter is an
	 * 		string, unused otherwise.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 04-2016-08
	 */
	CIQ.ChartEngine.prototype.removeEventListener = function (obj, cb) {
		if (!obj || typeof obj != "object") {
			// User likely passed in type and callback as two separate arguments into this function.
			// This is accounted for because it is consistent with the argument schema of "addEventListener"
			obj = {
				type: obj,
				cb: cb
			};
		}
	
		var spliceEvent = function (arr, cb) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === cb) {
					arr.splice(i, 1);
					return;
				}
			}
		};
		var callbackListeners = this.callbackListeners;
	
		if (obj.type === "*") {
			for (var key in callbackListeners) {
				spliceEvent(callbackListeners[key], obj.cb);
			}
			return;
		}
	
		if (!callbackListeners[obj.type]) {
			throw new Error("Attempted to remove an invalid listener.");
		}
	
		spliceEvent(callbackListeners[obj.type], obj.cb);
	};
	
	/**
	 * Dispatches an event by calling one or more
	 * [event listeners]{@link CIQ.ChartEngine#eventListeners} registered for the event specified by
	 * `type`. Event listeners registered for the `*` event type are also subsequently called.
	 * See {@link CIQ.ChartEngine#addEventListener}.
	 *
	 * **Note:** If any of the called event listeners returns true, all remaining uncalled
	 * listeners are bypassed.
	 *
	 * @param {string} type Identifies the type of event for which the event listeners are called.
	 * 		Must be one of the types listed in {@link CIQ.ChartEngine#addEventListener} excluding `*`.
	 * @param {object} data A collection of parameters to provide to the listener functions called in
	 * 		response to the event. See the listener types listed in
	 * 		{@link CIQ.ChartEngine#addEventListener} for relevant parameters.
	 * @return {boolean} False unless a called listener returns true, in which case this function
	 * 		also returns true.
	 *
	 * @memberof CIQ.ChartEngine
	 *
	 * @example
	 * // Trigger a layout change event; perhaps to save the layout.
	 * stx.dispatch("layout", {
	 *     stx: stx,
	 *     symbol: stx.chart.symbol,
	 *     symbolObject: stx.chart.symbolObject,
	 *     layout: stx.layout,
	 *     drawings: stx.drawingObjects
	 * });
	 */
	CIQ.ChartEngine.prototype.dispatch = function (type, data) {
		var arr = this.callbackListeners[type];
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].call(this, data) === true) return true;
			}
		}
		arr = this.callbackListeners["*"];
		if (arr) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j].call(this, data) === true) return true;
			}
		}
		return false;
	};
	
	//@private
	CIQ.ChartEngine.prototype.updateListeners = function (event) {
		for (var i in this.plugins) {
			var plugin = this.plugins[i];
			if (plugin.display && plugin.listener) plugin.listener(this, event);
		}
	};
	
	};
	
	
	let __js_core_engine_injection_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * The following is a list of ADVANCED injectable methods.
	 *
	 * **These methods should not be normally called by your code, but rather injections should be used to modify their behavior within the library Kernel.**
	 *
	 * The "Injection API" provides prepend and append functionality to any built-in method.
	 * Essentially what this means is that a developer can write code that will be run either before (prepend) or after (append) any internal {@link CIQ.ChartEngine} function (such as draw() or mouseMove()).
	 * This gives developers the ability to supplement, override or ignore any of the built in functionality.
	 *
	 * Note that you may prepend or append multiple functions. Each injected function is stacked "outward" (daisy-chained) from the core function.
	 *
	 * _prepend >> prepend >> prepend >> function << append << append << append_
	 *
	 * You may prepend/append either to CIQ.ChartEngine.prototype or directly to a CIQ.ChartEngine instance.
	 *
	 * See the {@tutorial Using the Injection API} and [Customization Basics](tutorial-Customization%20Basics.html#injections) tutorials for additional guidance and examples.
	 * @namespace CIQ.ChartEngine.AdvancedInjectable
	 * @example
	 * CIQ.ChartEngine.prototype.append("method_name_goes_here", function(){
	 * 	// do something here
	 * });
	 * @example
	 * CIQ.ChartEngine.prototype.prepend("method_name_goes_here", function(){
	 * 	// do something here
	 * 	// return true; // if you want to exit the method after your injection
	 * 	// return false; // if you want the standard code to follow the prepend
	 * });
	 */
	
	/**
	 * Prepends custom developer functionality to an internal chart member. See [“Injection API"]{@tutorial Using the Injection API}.
	 * @param  {string} o Signature of member
	 * @param  {function} n Callback function, will be called with "apply"
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 04-2015 You can append either to an {@link CIQ.ChartEngine} instance, or to the prototype. The first will affect only a single
	 * chart while the latter will affect any chart (if you have multiple on the screen).
	 * - 15-07-01 Function returns a descriptor which can be passed in to [removeInjection()]{@link CIQ.ChartEngine#removeInjection} to remove it later on.
	 * @return {object} Injection descriptor which can be passed in to {@link CIQ.ChartEngine#removeInjection} to remove it later on.
	 */
	CIQ.ChartEngine.prototype.prepend = function (o, n) {
		var m = "prepend" + o;
		var prepends;
		if (this instanceof CIQ.ChartEngine) {
			prepends = this.hasOwnProperty(m) ? this[m] : [];
			this[m] = [n].concat(prepends);
		} else {
			prepends = CIQ.ChartEngine.prototype[m] || [];
			CIQ.ChartEngine.prototype[m] = [n].concat(prepends);
		}
		return { method: m, func: n };
	};
	
	/**
	 * Appends custom developer functionality to an internal chart member. See [“Injection API"]{@tutorial Using the Injection API}.
	 * @param  {string} o Signature of member
	 * @param  {function} n Callback function, will be called with "apply"
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 04-2015 You can append either to an {@link CIQ.ChartEngine} instance, or to the prototype. The first will affect only a single
	 * chart while the latter will affect any chart (if you have multiple on the screen)
	 * - 15-07-01 Function returns a descriptor which can be passed in to [removeInjection()]{@link CIQ.ChartEngine#removeInjection} to remove it later on.
	 * @return {object} Injection descriptor which can be passed in to {@link CIQ.ChartEngine#removeInjection} to remove it later on.
	 */
	CIQ.ChartEngine.prototype.append = function (o, n) {
		var m = "append" + o;
		var appends;
		if (this instanceof CIQ.ChartEngine) {
			appends = this.hasOwnProperty(m) ? this[m] : [];
			this[m] = appends.concat(n);
		} else {
			appends = CIQ.ChartEngine.prototype[m] || [];
			CIQ.ChartEngine.prototype[m] = appends.concat(n);
		}
		return { method: m, func: n };
	};
	
	/**
	 * Runs the prepend injections. A prepend function that returns true will short circuit any proceeding prepend functions, and the core functionality.
	 * @private
	 * @param  {string} o	 The function name
	 * @param  {Array} args The arguments to the function
	 * @param  {object} self The this object
	 * @return {boolean}	  Returns true if any prepend function returns true.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.runPrepend = function (o, args, self) {
		var n = "prepend" + o;
		var prepends = this.hasOwnProperty(n) ? this[n] : [];
		prepends = prepends.concat(CIQ.ChartEngine.prototype[n] || []);
		if (!prepends.length) return false;
		if (!self) self = this;
		for (var i = 0; i < prepends.length; i++) {
			var rv = prepends[i].apply(self, args);
			if (rv) return rv;
		}
		return false;
	};
	
	/**
	 * Runs the append injections. An append function that returns true will short circuit any proceeding append functions (but not the core functionality since that has already ocurred).
	 * @private
	 * @param  {string} o	 The function name
	 * @param  {Array} args The arguments to the function
	 * @param  {object} self The this object
	 * @return {boolean}	  Returns true if any append function returns true.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.runAppend = function (o, args, self) {
		var n = "append" + o;
		var appends = this.hasOwnProperty(n) ? this[n] : [];
		appends = appends.concat(CIQ.ChartEngine.prototype[n] || []);
		if (!appends.length) return false;
		if (!self) self = this;
		for (var i = 0; i < appends.length; i++) {
			var rv = appends[i].apply(self, args);
			if (rv) return rv;
		}
		return false;
	};
	
	/**
	 * Removes a specific injection.  One can remove either an instance injection or a prototype injection, depending on how the function is called.
	 * @param  {object} id The injection descriptor returned from {@link CIQ.ChartEngine#prepend} or {@link CIQ.ChartEngine#append}
	 * @since 07/01/2015
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.removeInjection = function (id) {
		var method = id.method;
		var i;
		if (this instanceof CIQ.ChartEngine) {
			if (!this[method]) return;
			for (i = 0; i < this[method].length; i++) {
				if (this[method][i] == id.func) {
					this[method].splice(i, 1);
					return;
				}
			}
		} else {
			if (!CIQ.ChartEngine.prototype[method]) return;
			for (i = 0; i < CIQ.ChartEngine.prototype[method].length; i++) {
				if (CIQ.ChartEngine.prototype[method][i] == id.func) {
					CIQ.ChartEngine.prototype[method].splice(i, 1);
					return;
				}
			}
		}
	};
	/**
	 * Removes any and all prepend and append injections from a specified CIQ.ChartEngine function.
	 * If called as an instance method, will remove the instance injections.
	 * If called as a prototype method, will remove the prototype injections.
	 * @example
	 * stxx.remove("displayChart");  // removes instance injections
	 * CIQ.ChartEngine.prototpye.remove("displayChart");  // removes prototype injections
	 * @param  {string} o Signature of function which has injections to remove
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.remove = function (o) {
		if (this instanceof CIQ.ChartEngine) {
			delete this["append" + o];
			delete this["prepend" + o];
		} else {
			delete CIQ.ChartEngine.prototype["append" + o];
			delete CIQ.ChartEngine.prototype["prepend" + o];
		}
	};
	
	};
	
	
	let __js_core_engine_misc_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ,
		timezoneJS = _exports.timezoneJS;
	
	/**
	 * Given a browser time it will return the date in dataZone time. See {@link CIQ.ChartEngine#setTimeZone} for more details.
	 * If no dataZone is set, it will return the original date passed in.
	 * @param {date} browserDate Date in browser time - as in 'new Date();'
	 * @return {date} Date converted to dataZone
	 * @memberof CIQ.ChartEngine
	 * @since 07-2016-16.6
	 */
	CIQ.ChartEngine.prototype.convertToDataZone = function (browserDate) {
		if ((browserDate || browserDate === 0) && this.dataZone) {
			// convert the current time to the dataZone
			var tzNow = CIQ.convertTimeZone(browserDate, null, this.dataZone);
			// remember the the masterData is in local time but really representing the dataZone time.
			// now build a browser timezone time using the dataZone time so it will match the offset of the existing data in masterData.
			browserDate = new Date(
				tzNow.getFullYear(),
				tzNow.getMonth(),
				tzNow.getDate(),
				tzNow.getHours(),
				tzNow.getMinutes(),
				tzNow.getSeconds(),
				tzNow.getMilliseconds()
			);
		}
		return browserDate;
	};
	
	/**
	 * This method does nothing. It is just a known location to put a break point for debugging the kernel.
	 * @private
	 */
	CIQ.ChartEngine.prototype.debug = function () {};
	
	/**
	 * Measures frames per second. Use this from the console.
	 * @param {number} [seconds = 5] Polling interval length
	 * @param {function} cb Callback to invoke when done polling
	 * @private
	 */
	CIQ.ChartEngine.prototype.fps = function (seconds, cb) {
		seconds = seconds || 5;
		var start = new Date().getTime();
		var frames = 0;
		var self = this;
		console.log("Running fps() for " + seconds + " seconds");
	
		function render() {
			var duration = (new Date().getTime() - start) / 1000;
			if (duration > seconds) {
				var fps = frames / duration;
				console.log("FPS=" + fps);
				if (cb) cb(fps);
				return;
			}
			self.draw();
			frames++;
			if (CIQ.ChartEngine.useAnimation) {
				requestAnimationFrame(render);
			} else {
				setTimeout(render, 0);
			}
		}
		render();
	};
	
	// minimal here, see interaction file for complete list and docs
	CIQ.ChartEngine.htmlControls = {
		mSticky:
			'<div class="stx_sticky"> <span class="mStickyInterior"></span></div>',
		iconsTemplate:
			'<div class="stx-panel-control"><div class="stx-panel-title"></div><div class="stx-panel-legend"></div></div>'
	};
	
	/**
	 * Sets the base chart type for the primary symbol.
	 * @param {string} chartType The chart type. See <a href="CIQ.ChartEngine.html#layout%5B%60chartType%60%5D">CIQ.ChartEngine.layout.chartType</a> for valid options.
	 *
	 * See {@tutorial Chart Styles and Types} for more details.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setChartType = function (chartType) {
		var layout = this.layout,
			chart = this.chart;
		if (layout.aggregationType != "ohlc") {
			layout.aggregationType = "ohlc";
			if (chart.canvas) this.createDataSet();
		}
		layout.chartType = chartType;
		this.setMainSeriesRenderer();
		if (this.mainSeriesRenderer.isAggregation && this.setAggregationType)
			return this.setAggregationType(chartType);
		chart.defaultChartStyleConfig = { type: chartType };
		if (this.displayInitialized) this.draw();
		this.changeOccurred("layout");
	};
	
	CIQ.ChartEngine.prototype.setChartScale = function (chartScale) {
		if (!chartScale) chartScale = "linear";
		var needsTransform = {
			percent: true,
			relative: true
		};
		this.layout.chartScale = chartScale;
		if (this.chart.canvas) this.draw();
		this.changeOccurred("layout");
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Sets the chart y-axis to linear scale if:
	 * - the y-axis is currently set to log scale and
	 * - the chart data set contains a value less than or equal to zero.
	 *
	 * @return {boolean} true if log scale has been deactivated; otherwise false.
	 *
	 * @alias checkLogScale
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.checkLogScale = function () {
		if (this.runPrepend("checkLogScale", arguments)) return;
		if (this.layout.chartScale !== "log") return false;
		let logScaleDeactivated = false;
	
		if (this.chart.yAxis.lowValue <= 0) {
			this.setChartScale("linear");
			this.dispatch("notification", "logdeactivated");
			logScaleDeactivated = true;
		}
		this.runAppend("checkLogScale", arguments);
		return logScaleDeactivated;
	};
	
	/**
	 * Sets the charts to adjusted values rather than standard values. Adjusted values are calculated outside of the chart engine (and may be splits, dividends or both).
	 * When charts are using adjusted values, a computed ratio for each tick is used for price to pixel calculations which keeps drawings accurate
	 * @param {boolean} data True to use adjusted values (Adj_Close), false to use Close values
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setAdjusted = function (data) {
		this.layout.adj = data;
		if (this.chart.canvas) {
			this.createDataSet();
			this.draw();
		}
		this.changeOccurred("layout");
	};
	
	/**
	 * Pads out the decimal places given only a price.
	 *
	 * It will not truncate or round, but will add zeroes as follows:
	 *  - Prices under $2 will be padded to 4 decimal places, or to match the number of decimal places in `determinant`; whichever is larger.
	 *  - Prices over $1,000 will not be padded, or set to match the number of decimal places in `determinant`, if any.
	 *  - All other prices will be padded to 2 decimal places, or to match the number of decimal places in `determinant`; whichever is larger.
	 * @param  {number} price A price
	 * @param  {number} [determinant] Sample value to determine the decimal places. For
	 * instance, if you want to determine the number of decimals for today's change based on the actual price.
	 * @return {string}       A price padded for decimal places
	 * @memberOf  CIQ.ChartEngine
	 * @since 2016-07-16
	 */
	CIQ.ChartEngine.prototype.padOutPrice = function (price, determinant) {
		if (price !== 0 && (!price || typeof price != "number")) return "";
		if (!determinant && determinant !== 0) determinant = price;
		var str = "" + determinant;
	
		var decimalPlaces = 0;
		if (str.indexOf(".") > -1)
			decimalPlaces = str.substring(str.indexOf(".")).length - 1;
	
		if (determinant >= 1000) decimalPlaces = Math.max(decimalPlaces, 0);
		else if (determinant < 2) decimalPlaces = Math.max(decimalPlaces, 4);
		else decimalPlaces = Math.max(decimalPlaces, 2);
	
		var internationalizer = this.internationalizer;
		if (internationalizer) {
			var l = internationalizer.priceFormatters.length;
			if (decimalPlaces >= l) decimalPlaces = l - 1;
			price = internationalizer.priceFormatters[decimalPlaces].format(price);
		} else {
			price = price.toFixed(decimalPlaces);
		}
		return price;
	};
	
	/**
	 * Formats a price according to the decimalPlaces specified in either the panel or chart.
	 * It will then format to international standards if the internationalizer is set.
	 * This method *does not* condense prices.
	 * @param  {number} price The price to be formatted
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to use to determine the number of decimal places.
	 * @return {string}		  The formatted price
	 * @memberof CIQ.ChartEngine
	 * @since 6.2.0 Return value will always be a string.
	 */
	CIQ.ChartEngine.prototype.formatPrice = function (price, panel) {
		if (price !== 0 && (!price || typeof price == "undefined")) return "";
		if (!panel) panel = this.currentPanel;
		if (!panel) panel = this.chart.panel;
		if (!panel) return price.toString();
		var decimalPlaces = panel.decimalPlaces;
		if (!decimalPlaces && decimalPlaces !== 0) {
			decimalPlaces = panel.chart.decimalPlaces;
		}
		if (!decimalPlaces && decimalPlaces !== 0) {
			return price.toString();
		}
		var internationalizer = this.internationalizer;
		if (internationalizer) {
			var l = internationalizer.priceFormatters.length;
			if (decimalPlaces >= l) decimalPlaces = l - 1;
			price = internationalizer.priceFormatters[decimalPlaces].format(price);
		} else {
			price = price.toFixed(decimalPlaces);
		}
		return price;
	};
	
	/**
	 * Determines the high and low values for the data set.
	 *
	 * Requires an array of fields to check.
	 * For instance, the array might contain `["Close","Series1","Series2"]` which would return
	 * the max and min of all of those values for each quote.
	 *
	 * If you wish to exclude certain fields from your calculations to prevent excessive flattening
	 * of the charts, you can overwrite this method as follows:
	 * ```
	 * stxx.origDetermineMinMax = stxx.determineMinMax;
	 * stxx.determineMinMax = function(quotes, fields, sum, bypassTransform, length, checkArray) {
	 * 	// Add code here to remove anything you want from the 'fields' array.
	 *	console.log('current fields', fields);
	 *	return stxx.origDetermineMinMax(quotes, fields, sum, bypassTransform, length, checkArray);
	 * }
	 * ```
	 * Also see {@link CIQ.ChartEngine.Chart#includeOverlaysInMinMax}
	 *
	 * @param {Array} quotes The array of quotes (typically `CIQ.ChartEngine.chart.dataSegment`)
	 * 		to evaluate for minimum and maximum values.
	 * @param {Array} fields A list of fields to compare.
	 * @param {boolean|string[]} [sum] If true, then compute maximum sum rather than the maximum
	 * 		single value across all fields. If an array, compute sum over just the fields in the
	 * 		array.
	 * @param {boolean} [bypassTransform] If true, then bypass any transformations.
	 * @param {number} [length] Specifies how much of the quotes array to process.
	 * @param {boolean} [checkArray] If true, the type of the value used to determine the min/max
	 * 		is checked to ascertain whether it is an array; if so, the first element of the array
	 * 		is retrieved for use in the min/max determination.
	 * @param {CIQ.ChartEngine.Panel} [panel] A reference to the panel rendering the quotes.
	 * @param {CIQ.ChartEngine.YAxis} [axis] A reference to the y-axis rendered for the quotes.
	 * @param {Array} [filters] Array of functions to process the min/max values before returning.
	 * 		Filter functions must return a valid min/max tuple or false.
	 * @return {Array} A tuple, min and max values.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 2014-02
	 * - 7.3.0 Added `checkArray` parameter.
	 * - 8.0.0 Allow the `sum` parameter to be an array of valid fields to sum over. Added
	 * 		the `panel`, `axis`, and `filters` parameters.
	 */
	CIQ.ChartEngine.prototype.determineMinMax = function (
		quotes,
		fields,
		sum,
		bypassTransform,
		length,
		checkArray,
		panel,
		axis,
		filters
	) {
		var highValue = Number.MAX_VALUE * -1;
		var lowValue = Number.MAX_VALUE;
		var isTransform = false;
		var l = quotes.length;
		if (!filters) filters = [];
		var highLowData = [];
		if (length) l = length;
	
		for (var i = 0; i <= l + 1; i++) {
			var quote;
			// Here only the first field in the fields array is checked.  A different approach might be to check all the fields.
			if (fields.length) {
				if (i == l) {
					quote = this.getPreviousBar(this.chart, fields[0], 0);
				} else if (i == l + 1) {
					quote = this.getNextBar(this.chart, fields[0], l - 1);
				} else quote = quotes[i];
			}
			if (!quote) continue;
			if (!bypassTransform) {
				if (quote.transform) {
					isTransform = true;
					quote = quote.transform;
				} else if (isTransform) continue; //don't include points without transforms if we have been including points with transforms
			}
			var acc = 0;
			for (var j = 0; j < fields.length; j++) {
				var tuple = CIQ.existsInObjectChain(quote, fields[j]);
				if (!tuple) continue;
				var f = tuple.obj[tuple.member];
				if (typeof f == "number") f = [f];
				for (var v = 0; v < f.length; v++) {
					var val = f[v];
					if (checkArray && val instanceof Array) val = val[0];
					if (val || val === 0) {
						if (
							sum === true ||
							(sum instanceof Array && sum.indexOf(fields[j]) > -1)
						) {
							acc += val;
							if (acc > highValue) highValue = acc;
							if (acc < lowValue) lowValue = acc;
						} else {
							if (val > highValue) highValue = val;
							if (val < lowValue) lowValue = val;
							highLowData.push({ value: val, quote: quote });
						}
					}
				}
			}
			if (sum === true || (sum instanceof Array && sum.indexOf(fields[j]) > -1))
				highLowData.push({ value: acc, quote: quote });
		}
	
		var highLow = [lowValue, highValue];
	
		filters.forEach(function (f) {
			highLow = f(highLowData, panel, axis) || highLow;
		});
	
		if (highLow[1] == Number.MAX_VALUE * -1) highLow[1] = 0;
		if (highLow[0] == Number.MAX_VALUE) highLow[0] = 0;
		return highLow;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * This method initializes display variables for the chart.
	 *
	 * It is part of the animation loop and called with every [draw]{@link CIQ.ChartEngine#draw} operation.<br>
	 * The high and low values for the visible section of the primary chart are calculated and corresponding values stored as follows:
	 * - `chart.highValue` - The highest value on the chart
	 * - `chart.lowValue` - The lowest value on the chart
	 *
	 * See {@link CIQ.ChartEngine.Chart#includeOverlaysInMinMax} and  {@link CIQ.ChartEngine#determineMinMax}
	 *
	 * Those values are subsequently used by {@link CIQ.ChartEngine.AdvancedInjectable#createYAxis} which is called from within this method.<br>
	 * This method also calls {@link CIQ.ChartEngine.AdvancedInjectable#createCrosshairs}.
	 *
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to initialize
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias initializeDisplay
	 * @since 5.2.0. It now also calculates the minimum and maximum points in all study panels. This calculation was previously done using {@link CIQ.Studies.determineMinMax}, now deprecated.
	 */
	CIQ.ChartEngine.prototype.initializeDisplay = function (chart) {
		if (this.runPrepend("initializeDisplay", arguments)) return;
		let fields = [],
			useSum = [],
			checkArray = false;
		const self = this;
		const baseOHLCFields = ["Close", "Open", "High", "Low"];
		const baseLineFields = [chart.defaultPlotField || "Close"];
		const { mainSeriesRenderer } = this;
		const { dataSegment, seriesRenderers } = chart;
		function setYAxisFields(yAxis, panel) {
			// first see if this is an axis for a study; if so, get the fields
			let isStudyAxis = false;
			const sd =
				self.layout && self.layout.studies && self.layout.studies[yAxis.name];
			if (sd && (!panel || panel.name == sd.panel)) {
				for (const j in sd.outputMap) {
					fields.push(j);
					if (sd.study) {
						if (sd.study.renderer) {
							// if there is a study renderer, just assume it requires OHLC regardless of the renderer type
							fields = fields.concat(
								CIQ.createObjectChainNames(j, baseOHLCFields)
							);
						} else if (!sd.study.seriesFN) {
							// no seriesFN, assume it's a line and needs only Close
							fields = fields.concat(
								CIQ.createObjectChainNames(j, baseLineFields)
							);
						}
					}
				}
				for (let h = 0; h <= 2; h++)
					fields.push(sd.name + "_hist" + (h ? h : ""));
				isStudyAxis = true;
			}
			if (!panel) return; //to end recursion from includeOverlaysInMinMax below
	
			yAxis.studies = [];
			yAxis.renderers = [];
			if (isStudyAxis) {
				yAxis.studies.push(yAxis.name);
			}
			// then check renderers and add fields for each series in the renderer using this yaxis
			for (const id in seriesRenderers) {
				const renderer = seriesRenderers[id],
					params = renderer.params,
					panelName = params.panel;
				if (
					(params.yAxis ||
						!self.panels[panelName] ||
						self.panels[panelName].yAxis) != yAxis
				)
					continue;
				if (panelName != panel.name) continue;
				const baseFields = renderer.highLowBars ? baseOHLCFields : baseLineFields;
				checkArray = renderer.bounded;
				for (let id2 = 0; id2 < renderer.seriesParams.length; id2++) {
					// Find any series that share the Y axis
					const seriesParams = renderer.seriesParams[id2];
					if (seriesParams.hidden) continue;
					let fieldNamesToConcat;
					if (seriesParams.subField) {
						fieldNamesToConcat = CIQ.createObjectChainNames(seriesParams.symbol, [
							seriesParams.subField
						]).concat(seriesParams.symbol);
					} else if (seriesParams.symbol) {
						fieldNamesToConcat = CIQ.createObjectChainNames(
							seriesParams.symbol,
							baseFields
						).concat(seriesParams.symbol);
					} else if (seriesParams.field) {
						fieldNamesToConcat = seriesParams.field;
					} else if (yAxis == chart.panel.yAxis) {
						// only if the main chart panel's yAxis include baseFields
						fieldNamesToConcat = baseFields;
					}
					if (fieldNamesToConcat) fields = fields.concat(fieldNamesToConcat);
					if (renderer.useSum) useSum = useSum.concat(fieldNamesToConcat);
				}
				yAxis.renderers.push(id);
			}
			// Finally add any fields used by overlay studies
			for (const overlay in self.overlays) {
				const o = self.overlays[overlay];
				if (o.panel != panel.name) continue;
				if (o.name == yAxis.name) continue; // don't loop thru the same axis twice and create duplicates
				const oAxis = o.getYAxis(self);
				if (oAxis != yAxis) continue;
				yAxis.studies.push(o.name);
				if (chart.includeOverlaysInMinMax) {
					setYAxisFields({ name: o.name });
				}
			}
		}
		let minMax;
		let length = null;
	
		// We often have an extra tick hanging off the edge of the screen. We don't want this
		// tick to affect the high and low calculation though. That causes jumpiness when
		// zooming because the chart is alternately including and excluding that tick
		let ticksOnScreen = Math.floor(
			(chart.width - this.micropixels) / this.layout.candleWidth
		);
		if (chart.scroll > chart.maxTicks && chart.maxTicks > ticksOnScreen + 1)
			length = dataSegment.length - 1;
	
		let arr = [];
		for (const p in this.panels) {
			const myPanel = this.panels[p];
			arr = myPanel.yaxisLHS.concat(myPanel.yaxisRHS);
			for (let y = 0; y < arr.length; y++) {
				const yAxis = arr[y];
				fields = [];
				useSum = [];
				const doTransform = chart.transformFunc && yAxis == chart.panel.yAxis;
				setYAxisFields(yAxis, myPanel);
				// maintenance of axes here
				if (
					!this.currentlyImporting &&
					!yAxis.renderers.length &&
					!yAxis.studies.length
				) {
					this.deleteYAxisIfUnused(myPanel, yAxis);
					continue;
				}
				if (mainSeriesRenderer && mainSeriesRenderer.determineMax) {
					minMax = mainSeriesRenderer.determineMax(
						dataSegment,
						fields,
						useSum,
						!doTransform,
						length,
						checkArray,
						myPanel,
						yAxis
					);
				} else {
					minMax = this.determineMinMax(
						dataSegment,
						fields,
						useSum,
						!doTransform,
						length,
						checkArray,
						myPanel,
						yAxis
					);
				}
	
				if (this.baselineHelper) minMax = this.setBaselineMinMax(minMax, yAxis);
	
				yAxis.lowValue = minMax[0];
				yAxis.highValue = minMax[1];
				if (yAxis == chart.panel.yAxis) {
					chart.lowValue = yAxis.lowValue;
					chart.highValue = yAxis.highValue;
				}
			}
		}
		const aggregation = chart.state.aggregation;
		if (aggregation && aggregation.box) {
			// Make room for X and O rendering since half of it lies beyond the high/low
			chart.lowValue -= aggregation.box / 2;
			chart.highValue += aggregation.box / 2;
		}
	
		this.runAppend("initializeDisplay", arguments);
	};
	
	/**
	 * Sets the market definition on the chart.
	 *
	 * Once set, the definition will not change until it is explicitly set to something else by calling this method again.
	 *
	 * A new definition for a chart should only be set once, right before a new instrument is loaded with the {@link CIQ.ChartEngine#loadChart} call.
	 * Loading or modifying a market definition after a chart has loaded its data will result in unpredictable results.
	 *
	 * If a dynamic model is desired, where a new definition is loaded as different instruments are activated, see {@link CIQ.ChartEngine#setMarketFactory}.
	 *
	 * See {@link CIQ.Market} for market definition rules and examples.
	 *
	 * This is only required if your chart will need to know the operating hours for the different exchanges.
	 *
	 * If using a 24x7 chart, a market does not need to be set.
	 * @param {object} marketDefinition A market definition as required by {@link CIQ.Market}
	 * @param {CIQ.ChartEngine.Chart} chart An instance of {@link CIQ.ChartEngine.Chart}
	 * @memberof CIQ.ChartEngine
	 * @since 04-2016-08
	 * @example
	 * stxx.setMarket({
	 *   name: 'My_Market',
	 *   market_tz: 'My_Timezone', // Note you must specify the time zone for the market!
	 *   rules: [
	 *     { 'dayofweek': 1, 'open': '08:00', 'close': '14:30' },
	 *     { 'dayofweek': 2, 'open': '08:00', 'close': '14:30' },
	 *     { 'dayofweek': 3, 'open': '08:00', 'close': '14:30' },
	 *     { 'dayofweek': 4, 'open': '08:00', 'close': '14:30' },
	 *     { 'dayofweek': 5, 'open': '08:00', 'close': '14:30' },
	 *   ],
	 * });
	 */
	CIQ.ChartEngine.prototype.setMarket = function (marketDefinition, chart) {
		if (!CIQ.Market) return;
		if (!chart) chart = this.chart;
		chart.market = new CIQ.Market(marketDefinition);
		for (var session in this.layout.marketSessions) {
			chart.market.disableSession(session, this.layout.marketSessions[session]);
		}
	};
	
	/**
	 * Links the chart to a method that given a symbol object of form accepted by {@link CIQ.ChartEngine#loadChart}, can return a complete market definition object.
	 * Once linked, the market factory it will be used by the chart to ensure the market always matches the active instrument.
	 * This is only required if your chart will need to know the operating hours for the different exchanges.
	 * If using a 24x7 chart, a market factory does not need to be set.
	 *
	 * Please note that if using the default sample templates, this method is set to use the {@link CIQ.Market.Symbology} functions, which must be reviewed and adjust to comply with your quote feed and symbology format before they can be used.
	 * @param {function} factory A function that takes a symbolObject and returns a market definition. See {@link CIQ.Market} for instruction on how to create a market definition. See {@link CIQ.Market.Symbology.factory} for working example of a factory function.
	 * @memberof CIQ.ChartEngine
	 * @since 04-2016-08
	 * @example
	 * // example of a market factory that returns a different market definition based on the symbol passed in
	 * sampleFactory=function(symbolObject){
	 *		var symbol=symbolObject.symbol;
	 *		// isTypeX(symbol) is a function you would create to identify the market definition object that should be used.
	 *		if( isType1(symbol) ) return type1DefinitionObject;
	 *		if( isType2(symbol) ) return type2DefinitionObject;
	 *		if( isType3(symbol) ) return type3DefinitionObject;
	 *		return defaultDefinitionObject;
	 * };
	 *
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{labels:false, currentPriceLine:true, whitespace:0}});
	 * stxx.setMarketFactory(sampleFactory);
	 */
	CIQ.ChartEngine.prototype.setMarketFactory = function (factory) {
		this.marketFactory = factory;
	};
	
	/**
	 * Sets a timer to check for chart resizing.
	 *
	 * Normally, the chart is resized whenever the screen is resized by capturing a screen resize event.
	 * However, if charts are embedded in a windowing GUI, they may not receive window resize events.
	 * Ideally, `stxx.resizeChart()` should be called whenever a window is resized; however, if this is inconvenient,
	 * then the resize timer can be enabled to cover all bases.
	 *
	 * On initialization, CIQ.ChartEngine.resizeDetectMS is checked for the default resize checking interval. The default is 1,000 milliseconds.
	 * To turn off resize checking simply set CIQ.ChartEngine.resizeDetectMS=0; when you declare your CIQ.ChartEngine object.
	 *
	 * @param {number} ms Number of milliseconds to poll. Zero to stop checking.
	 * @memberof CIQ.ChartEngine
	 * @since 7.2.0 For browsers that support it, a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is used instead of a timeout.
	 */
	
	CIQ.ChartEngine.prototype.setResizeTimer = function (ms) {
		this.resizeDetectMS = ms;
		function closure(self, useObserver) {
			var f = function () {
				if (!self.chart.canvas) return;
				if (!CIQ.isAndroid) {
					if (
						self.chart.canvas.height !=
							Math.floor(
								self.devicePixelRatio * self.chart.container.clientHeight
							) ||
						self.chart.canvas.width !=
							Math.floor(self.devicePixelRatio * self.chart.container.clientWidth)
					) {
						self.resizeChart();
					}
				}
			};
			return function () {
				// Adding throttling here to fix Chrome issue where benign error is sometimes thrown "ResizeObserver loop limit exceeded"
				// Nevertheless, error seems to be caught by Karma and unit tests fail
				// https://github.com/KingSora/OverlayScrollbars/issues/90
				if (typeof ResizeObserver !== "undefined") {
					if (CIQ.ChartEngine.useAnimation) {
						requestAnimationFrame(f);
					} else {
						setTimeout(f, 0);
					}
				} else f();
			};
		}
		this.resizeHandle = CIQ.resizeObserver(
			this.chart.container,
			closure(this),
			this.resizeHandle,
			ms
		);
	};
	
	/**
	 * Returns an array of all the securities, series, and overlays that are drawn on the current panel.
	 *
	 * @memberof CIQ.ChartEngine
	 * @returns {object[]} The fields &mdash; in object-chain form &mdash; of the currently rendered objects.
	 * @since 7.2.0
	 */
	CIQ.ChartEngine.prototype.getRenderedItems = function () {
		var chart = this.chart,
			currentPanel = this.currentPanel;
		if (!currentPanel) return;
	
		var ohlc = ["Open", "High", "Low", "Close"];
		var close = ["Close"];
		var rendered = [];
		for (var o in this.overlays) {
			if (this.overlays[o].panel !== currentPanel.name) continue;
			// use the keys so if we ever change how the output map is constructed we don't need to change it twice
			rendered = rendered.concat(Object.keys(this.overlays[o].outputMap));
		}
		for (var r in chart.seriesRenderers) {
			var renderer = chart.seriesRenderers[r];
			if (renderer.params.panel != currentPanel.name) continue;
			for (var rs in renderer.seriesParams) {
				var sp = renderer.seriesParams[rs];
				var baseFields = renderer.highLowBars ? ohlc : close;
				if (sp.subField) {
					rendered = rendered
						.concat(CIQ.createObjectChainNames(sp.symbol, [sp.subField]))
						.concat(sp.symbol);
				} else if (sp.symbol) {
					rendered = rendered
						.concat(CIQ.createObjectChainNames(sp.symbol, baseFields))
						.concat(sp.symbol);
				} else if (sp.field) {
					rendered.push(sp.field);
				} else if (currentPanel == chart.panel) {
					// only if on main chart panel include baseFields
					rendered = rendered.concat(baseFields);
				}
			}
		}
		return rendered;
	};
	
	/**
	 * Sets a transformation and untransformation function. Transforms can be used to transform the Y-Axis from absolute
	 * to relative values. For instance, comparison charts use a transform that adjusts from price to percentage.
	 * After this is called, chart.transformFunc and chart.untransformFunc will be set to those functions.
	 * @param {CIQ.ChartEngine.Chart} chart			   The chart to transform
	 * @param {function} transformFunction	 A transformation callback function which takes a number and returns the transformation of that number
	 * @param {function} untransformFunction An untransformation callback function
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setTransform = function (
		chart,
		transformFunction,
		untransformFunction
	) {
		chart.transformFunc = transformFunction;
		chart.untransformFunc = untransformFunction;
	};
	
	/**
	 * Removes a transformation/untransformation pair
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to remove transformations from
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.unsetTransform = function (chart) {
		delete chart.transformFunc;
		delete chart.untransformFunc;
		for (var i = 0; chart.dataSet && i < chart.dataSet.length; i++) {
			chart.dataSet[i].transform = null;
		}
	};
	
	CIQ.ChartEngine.prototype.isEquationChart = function (symbol) {
		if (symbol && symbol[0] == "=") {
			if (!this.allowEquations || !CIQ.fetchEquationChart) {
				console.warn(
					"Error, equation chart option requires equationsAdvanced.js"
				);
				return false;
			}
			return true;
		}
		return false;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * This method ensures that the chart is not scrolled off of either of the vertical edges.
	 * See {@link CIQ.ChartEngine#minimumLeftBars}, {@link CIQ.ChartEngine.Chart#allowScrollPast}, and {@link CIQ.ChartEngine.Chart#allowScrollFuture} for adjustments to defaults.
	 * @param  {CIQ.ChartEngine.Chart} theChart The chart to check
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias correctIfOffEdge
	 */
	CIQ.ChartEngine.prototype.correctIfOffEdge = function (theChart) {
		if (this.runPrepend("correctIfOffEdge", arguments)) return;
		for (var chartName in this.charts) {
			var chart = this.charts[chartName],
				dataSet = chart.dataSet,
				maxTicks = chart.maxTicks,
				layout = this.layout;
	
			var minimumLeftBars = this.minimumLeftBars;
	
			var leftPad = Math.min(minimumLeftBars, maxTicks); // in case the minimumLeftBars is larger than what we can display
			if (chart.allowScrollPast) {
				// allow scrolling from left to right, creating white space on either side
				var rightPad = maxTicks - leftPad;
				if (leftPad > dataSet.length) {
					rightPad = maxTicks - dataSet.length;
				}
				if (chart.scroll - rightPad >= dataSet.length) {
					chart.scroll = dataSet.length + rightPad - 1;
					this.micropixels = 0;
				}
				if (chart.scroll <= leftPad) {
					chart.scroll = leftPad;
					this.micropixels = 0;
				}
			} else {
				// earliest point in time is always anchored on left side of chart
				if (chart.scroll < leftPad) {
					chart.scroll = leftPad;
				}
				if (chart.scroll > dataSet.length) {
					chart.scroll = dataSet.length;
				}
			}
			if (chart.allowScrollFuture === false) {
				var whitespace =
					this.getLabelOffsetInPixels(chart, layout.chartType) +
					layout.candleWidth * chart.whiteSpaceFutureTicks;
				var barsOnScreen =
					maxTicks - Math.round(whitespace / layout.candleWidth) - 1;
				var scroll = this.micropixels < 0 ? chart.scroll - 1 : chart.scroll;
				if (scroll < barsOnScreen) {
					chart.scroll = barsOnScreen;
					this.micropixels = 0;
				}
			}
		}
		this.runAppend("correctIfOffEdge", arguments);
	};
	
	/**
	 * Returns the offset from the left side of the screen for the first element
	 * on the chart screen. Most times this will be zero except when a user has scrolled
	 * past the end of the chart in which case it will be a positive number. This can be used
	 * to recreate a saved chart.
	 * @return {number} The offset from the left of the chart.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.getStartDateOffset = function () {
		for (var ds = 0; ds < this.chart.dataSegment.length; ds++) {
			if (this.chart.dataSegment[ds]) {
				return ds;
			}
		}
		return 0;
	};
	
	/**
	 * Scrolls the chart so that the leftmost tick is the requested date.
	 * The date must be an exact match and data for that bar must already be loaded in the chart.
	 * There is no effect if the date is not found an the engine will not attempt to fetch more data.
	 * @param {date} dt The requested date
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.setStartDate = function (dt) {
		for (var i = 0; i < this.chart.dataSet.length; i++) {
			var bar = this.chart.dataSet[i];
			if (bar.DT.getTime() == dt.getTime()) {
				this.chart.scroll = this.chart.dataSet.length - i;
				this.draw();
				return;
			}
		}
	};
	
	//@private
	CIQ.ChartEngine.prototype.clearPixelCache = function () {
		for (var x in this.panels) {
			var panel = this.panels[x];
			panel.cacheHigh = null;
			panel.cacheLow = null;
			panel.cacheLeft = 1000000;
			panel.cacheRight = -1;
		}
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
			if (!chart.dataSet) continue;
			for (var i = 0; i < chart.dataSet.length; i++) {
				chart.dataSet[i].cache = {};
			}
		}
	};
	
	/**
	 * This method adjusts the canvas for the current backing store. The backing store is used on "retina" style devices
	 * to indicate the ratio of actual screen pixels to web pixels. The canvas is adjusted according to this ratio so that
	 * pixels appear at the expected size and aren't fuzzy. Note that backing store is sometimes also employed by browsers
	 * to change the size of the view.
	 * @private
	 * @param  {HTMLCanvasElement} canvas	An HTML5 canvas
	 * @param  {external:CanvasRenderingContext2D} context An HTML5 canvas context
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.adjustBackingStore = function (canvas, context) {
		this.devicePixelRatio = window.devicePixelRatio || 1;
		//note, let's ignore DPR<1, it is not consistently implemented on all browsers between retina and nonretina displays
		if (this.devicePixelRatio < 1.0) this.devicePixelRatio = 1.0;
		var backingStoreRatio =
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio ||
			1;
	
		var ratio = this.devicePixelRatio / backingStoreRatio;
	
		if (!this.useBackingStore) {
			this.devicePixelRatio = this.adjustedDisplayPixelRatio = 1;
			return;
		}
		if (!CIQ.isAndroid || CIQ.is_chrome || CIQ.isFF) {
			var oldWidth = canvas.width;
			var oldHeight = canvas.height;
	
			canvas.width = oldWidth * ratio;
			canvas.height = oldHeight * ratio;
	
			canvas.style.width = oldWidth + "px";
			canvas.style.height = oldHeight + "px";
	
			context.scale(ratio, ratio);
			this.adjustedDisplayPixelRatio = ratio;
			this.backing = {
				ratio: ratio,
				width: canvas.width,
				height: canvas.height,
				styleWidth: oldWidth,
				styleHeight: oldHeight
			};
		}
	};
	
	CIQ.ChartEngine.prototype.reconstituteBackingStore = function () {
		if (!this.useBackingStore || !this.backing) return;
		var canvases = [this.chart.canvas];
		if (this.useBackgroundCanvas) canvases.push(this.chart.backgroundCanvas);
		var backing = this.backing;
		canvases.forEach(function (canvas) {
			if (canvas.width == backing.width) return;
	
			canvas.width = backing.width;
			canvas.height = backing.height;
	
			canvas.context.scale(backing.ratio, backing.ratio);
		});
		this.adjustedDisplayPixelRatio = backing.ratio;
		this.draw();
	};
	
	CIQ.ChartEngine.prototype.disableBackingStore = function () {
		if (!this.useBackingStore || !this.backing) return;
		var canvases = [this.chart.canvas];
		if (this.useBackgroundCanvas) canvases.push(this.chart.backgroundCanvas);
		var backing = this.backing;
		canvases.forEach(function (canvas) {
			if (canvas.width == backing.styleWidth) return;
	
			canvas.width = backing.styleWidth;
			canvas.height = backing.styleHeight;
	
			canvas.context.scale(1, 1);
		});
		this.adjustedDisplayPixelRatio = 1;
		this.draw();
	};
	
	/**
	 * Determines the appropriate canvas on which to draw background plots (gridlines and axes). If
	 * {@link CIQ.ChartEngine#useBackgroundCanvas} is true, background plots are drawn on the chart
	 * background canvas; if false, on the chart main canvas.
	 *
	 * @param {CIQ.ChartEngine.Chart} chart The chart from which the canvas is obtained.
	 * @return {HTMLElement} Either the chart's main canvas or background canvas, depending
	 * 		on the value of {@link CIQ.ChartEngine#useBackgroundCanvas}.
	 * @memberof CIQ.ChartEngine
	 * @since 7.4.0
	 */
	CIQ.ChartEngine.prototype.getBackgroundCanvas = function (chart) {
		if (!chart) chart = this.chart;
		return this.useBackgroundCanvas ? chart.backgroundCanvas : chart.canvas;
	};
	
	/**
	 * This method resizes the canvas to the dimensions of the containing div. This is called primarily
	 * by {@link CIQ.ChartEngine#resizeChart} and also when the chart is initialized (via loadChart).
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.resizeCanvas = function () {
		var canvas = this.chart.canvas;
		var context = this.chart.context;
		if (canvas && context) {
			this.floatCanvas.height = this.chart.tempCanvas.height = this.chart.backgroundCanvas.height = canvas.height = this.chart.container.clientHeight;
			this.floatCanvas.width = this.chart.tempCanvas.width = this.chart.backgroundCanvas.width = canvas.width = this.chart.container.clientWidth;
			this.adjustBackingStore(canvas, context);
			this.adjustBackingStore(
				this.chart.tempCanvas,
				this.chart.tempCanvas.context
			);
			this.adjustBackingStore(this.floatCanvas, this.floatCanvas.context);
			this.adjustBackingStore(
				this.chart.backgroundCanvas,
				this.chart.backgroundCanvas.context
			);
		}
		var rect = this.container.getBoundingClientRect();
		this.top = rect.top;
		this.left = rect.left;
		this.canvasWidth = this.chart.canvasWidth = this.chart.container.clientWidth;
		this.right = this.left + this.canvasWidth;
		this.height = this.chart.container.clientHeight;
		this.width = this.right - this.left;
		if (
			this.width === 0 &&
			!this.container.dimensionlessCanvas &&
			this.container.closest("html")
		) {
			console.log("warning: zero width chart. Check CSS for chart container.");
		}
		this.bottom = this.top + this.height;
		this.calculateYAxisPositions();
		this.chart.canvasRight = this.right;
		this.chart.canvasHeight = this.height;
		var candleWidth = this.layout.candleWidth;
		if (typeof candleWidth == "undefined") candleWidth = 8;
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
	
			this.setCandleWidth(candleWidth, chart);
			if (chart.scroll < chart.width / candleWidth) {
				chart.scroll = Math.floor(chart.width / candleWidth);
				var wsInTicks = Math.round(
					this.preferences.whitespace / this.layout.candleWidth
				);
				chart.scroll -= wsInTicks;
			}
	
			var idealNumberOfTicks = 10;
			var appxLabelWidth;
			try {
				appxLabelWidth = context.measureText("10:00").width * 2;
			} catch (e) {
				appxLabelWidth = 100;
			}
			while (idealNumberOfTicks > 1) {
				if (this.chart.width / appxLabelWidth > idealNumberOfTicks) break;
				idealNumberOfTicks /= 1.5;
			}
			chart.xAxis.autoComputedTickSizePixels = Math.round(
				this.chart.width / idealNumberOfTicks
			);
			if (chart.xAxis.autoComputedTickSizePixels < 1)
				chart.xAxis.autoComputedTickSizePixels = 1;
		}
	};
	
	/**
	 * Sets the candleWidth for the chart. The candleWidth represents the number of horizontal pixels from the start
	 * of one bar or candle to the start of the next. This also applies to line charts. It is effectively, the horizontal zoom.
	 * The candleWidth can be read from layout.candleWidth.
	 *
	 * Method also ensures that the new candleWidth is not less than {@link CIQ.ChartEngine.Chart#minimumCandleWidth} and not more than
	 * {@link CIQ.ChartEngine.Chart#maximumCandleWidth}. If either of these is the case, candleWidth will be set to whichever value is closer.
	 *
	 * **Note**: if calling `setCandleWidth()` before `loadChart()`, with a value less than `minimumCandleWidth`, `loadChart()` will reset the candle size to the default candle size (8 pixels).
	 *
	 * @param {number} newCandleWidth The new candle width. If less than or equal to 0, it will be reset to 8
	 * @param {CIQ.ChartEngine.Chart} [chart]	Which chart to set the candleWidth. Defaults to the default chart.
	 * @memberof CIQ.ChartEngine
	 * @example
	 * stxx.setCandleWidth(10);
	 * stxx.home();	// home() is preferred over draw() in this case to ensure the chart is properly aligned to the right most edge.
	
	 */
	CIQ.ChartEngine.prototype.setCandleWidth = function (newCandleWidth, chart) {
		if (!chart) chart = this.chart;
		newCandleWidth = this.constrainCandleWidth(newCandleWidth);
		this.layout.candleWidth = newCandleWidth;
		//chart.maxTicks=Math.ceil(this.chart.width/newCandleWidth+0.5); // we add half of a candle back in because lines and mountains only draw to the middle of the bar
		chart.maxTicks = Math.round(chart.width / newCandleWidth) + 1;
	};
	
	/**
	 * Ensures that a candle width value is within the limits of {@link CIQ.ChartEngine#minimumCandleWidth}
	 * and {@link CIQ.ChartEngine#maximumCandleWidth}.
	 *
	 * @param {number} candleWidth The candle width to be checked.
	 * @return {number} The value of `candleWidth` if `candleWidth` is between `minimumCandleWidth` and `maximumCandleWith`.
	 * 		Otherwise, `minimumCandleWidth` if `candleWidth` is less than `minimumCandleWidth`. Otherwise, `maximumCandleWith`
	 * 		if `candleWidth` is greater than `maximumCandleWith`.
	 * @memberof CIQ.ChartEngine
	 * @since 7.4.0
	 */
	CIQ.ChartEngine.prototype.constrainCandleWidth = function (candleWidth) {
		var minimumCandleWidth = this.minimumCandleWidth;
		var maximumCandleWidth = this.maximumCandleWidth;
		var animating = this.animations.zoom;
		if (minimumCandleWidth && candleWidth < minimumCandleWidth) {
			candleWidth = minimumCandleWidth;
			if (animating && animating.running) animating.stop();
		}
		if (maximumCandleWidth && candleWidth > maximumCandleWidth) {
			candleWidth = maximumCandleWidth;
			if (animating && animating.running) animating.stop();
		}
		return candleWidth;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Resizes the chart and adjusts the panels. The chart is resized to the size of the container div by calling
	 * {@link CIQ.ChartEngine#resizeCanvas}. This method is called automatically if a screen resize event occurs. The charting
	 * engine also attempts to detect size changes whenever the mouse is moved. Ideally, if you know the chart is being
	 * resized, perhaps because of a dynamic change to the layout of your screen, you should call this method manually.
	 * @param {boolean} [maintainScroll=true] By default the scroll position will remain pegged on the right side of the chart. Set this to false to override.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 2015-11-1 `resizeChart` now automatically retains scroll position.
	 * - 09-2016-19 `resizeChart` now also manages the resizing of the crosshairs.
	 */
	CIQ.ChartEngine.prototype.resizeChart = function (maintainScroll) {
		if (this.runPrepend("resizeChart", arguments)) return;
		if (maintainScroll !== false) maintainScroll = true;
		if (maintainScroll) this.preAdjustScroll();
		var previousHeight = this.chart.canvasHeight;
		this.resizeCanvas();
		if (maintainScroll) this.postAdjustScroll();
		if (this.displayInitialized) {
			this.adjustPanelPositions();
			this.draw();
			// This second case occurs if a chart was initialized hidden but now
			// has suddenly been revealed. displayInitialized hadn't been set yet
			// because draw() has never been completed
		} else if (this.chart.canvasHeight !== 0 && previousHeight === 0) {
			this.adjustPanelPositions();
			this.draw();
		}
	
		//redraw the crosshairs to adjust to the new size of the screen.
		this.doDisplayCrosshairs();
		this.updateChartAccessories();
	
		this.runAppend("resizeChart", arguments);
	};
	
	/**
	 * Removes any studies from the chart, and hides the chart controls.
	 * The chart becomes uninitialized, disabling any interaction with it.
	 * The canvas is not cleared; {@link CIQ.clearCanvas} can do that.
	 *
	 * Useful when a chart is loaded with no data due to a quoteFeed error. Automatically called by {@link CIQ.ChartEngine#loadChart}
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 2016-12-01
	 */
	CIQ.ChartEngine.prototype.clear = function () {
		this.displayInitialized = false;
	
		for (var id in this.layout.studies) {
			var sd = this.layout.studies[id];
			CIQ.getFn("Studies.removeStudy")(this, sd);
		}
	
		if (this.controls.chartControls)
			this.controls.chartControls.style.display = "none";
	
		this.chart.panel.title.innerHTML = "";
		this.chart.panel.title.appendChild(
			document.createTextNode(this.chart.panel.display)
		);
	};
	
	/**
	 * Adjusts the candleWidth to eliminate left-side gaps on the chart if not enough bars are loaded.
	 *
	 * Used by the `stretchToFillScreen` parameter of {@link CIQ.ChartEngine#loadChart}
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0 This function is now public.
	 */
	CIQ.ChartEngine.prototype.fillScreen = function () {
		var chart = this.chart;
		var candleWidth = this.layout.candleWidth;
		var chartWidth = chart.width - this.preferences.whitespace;
		var count = chart.dataSet.length;
	
		if (count * candleWidth >= chartWidth) {
			this.draw();
			return;
		}
	
		// line-type charts go center-to-center in the data point space, so we end up which 1/2 a candle empty on the left and the right..
		//so if we remove a candle from the calculations, we go edge to edge.
		if (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars)
			count--;
	
		var newCandleWidth = chartWidth / count;
		this.setCandleWidth(newCandleWidth, chart);
		this.home({ maintainWhitespace: true });
	};
	
	/**
	 * Sets the maximimum number of ticks to the requested number. This is effected by changing the candleWidth.
	 * See also {@link CIQ.ChartEngine#setCandleWidth}.
	 *
	 * **Note**: if calling `setMaxTicks()` before `loadChart()`, and the chart will result in a candle width less than `minimumCandleWidth`, `loadChart()` will reset the candle size to the default candle size (8 pixels).
	 *
	 * @param {number} ticks The number of ticks wide to set the chart.
	 * @param {object} [params] Parameters to use with this function.
	 * @param {number} params.padding Whitespace in pixels to add to the right of the chart.
	 * 									Setting this field will home the chart to the most recent tick.
	 * 									To home the chart without padding the right side with whitespace, set padding to 0.
	 * 									Omitting the padding field will keep the chart scrolled to the same position.
	 * @since 2015-11-1 Added `params` object.
	 * @memberof CIQ.ChartEngine
	 * @example
	 * stxx.setMaxTicks(300);
	 * stxx.home();	// home() is preferred over draw() in this case to ensure the chart is properly aligned to the right most edge.
	 */
	CIQ.ChartEngine.prototype.setMaxTicks = function (ticks, params) {
		if (!params) params = {};
		ticks = Math.round(ticks);
		if (ticks < 2) ticks = 2;
		var pad = params.padding ? params.padding : 0;
		this.layout.candleWidth = (this.chart.width - pad) / ticks;
		if (!this.layout.candleWidth) this.layout.candleWidth = 8; // Zero candlewidth can only occur if the chart has no width. This might happen if the chart is in a hidden iframe
		this.chart.maxTicks = Math.round(
			this.chart.width / this.layout.candleWidth - 0.499
		);
		if (params.padding || params.padding === 0) this.chart.scroll = ticks + 1; // If padding, then by definition we're homing
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * This method initializes the chart container events, such as window `resize` events,
	 * and the [resizeTimer]{@link CIQ.ChartEngine#setResizeTimer} to ensure the chart adjusts as its container size changes.
	 * It also initializes various internal variables, the canvas and creates the chart panel.
	 *
	 * This is called by {@link CIQ.ChartEngine#loadChart} and should rarely be called directly.
	 *
	 * Note that the candle width will be reset to 8px if larger than 50px. Even if the value comes from a layout import.
	 * This is done to ensure a reasonable candle size is available across devices that may have different screen size.
	 *
	 * @param {HTMLElement} [container] Node that contains the chart.
	 * @memberof CIQ.ChartEngine
	 *
	 */
	CIQ.ChartEngine.prototype.initializeChart = function (container) {
		if (this.runPrepend("initializeChart", arguments)) return;
		var chart = this.chart;
		if (!chart.symbolObject.symbol) chart.symbolObject.symbol = chart.symbol; // for backwards compatibility so the symbol object is always initialized in case we don't use loadChart()
		if (this.locale) this.setLocale(this.locale);
		if (!this.displayZone && CIQ.ChartEngine.defaultDisplayTimeZone) {
			this.setTimeZone(null, CIQ.ChartEngine.defaultDisplayTimeZone);
		}
		this.resetDynamicYAxis({ noRecalculate: true });
		this.calculateYAxisPositions();
		this.micropixels = 0;
	
		if (container) chart.container = container;
		else container = chart.container;
		container.stx = this;
		if (!container.CIQRegistered) {
			container.CIQRegistered = true;
			CIQ.ChartEngine.registeredContainers.push(container);
		}
		if (this.registerHTMLElements) this.registerHTMLElements(); // Sets all of the internal HTML elements to those in the container
		var canvas = chart.canvas,
			backgroundCanvas = chart.backgroundCanvas,
			tempCanvas = chart.tempCanvas,
			floatCanvas = this.floatCanvas,
			canvasShim = chart.canvasShim;
		if (canvas && document.createElement("canvas").getContext) {
			if (!canvas.id) {
				//Don't play with canvases which have id's since you don't own them
				container.removeChild(canvas);
				chart.canvas = null;
			}
			if (tempCanvas && !tempCanvas.id) {
				container.removeChild(tempCanvas);
				chart.tempCanvas = null;
			}
			if (floatCanvas && !floatCanvas.id) {
				container.removeChild(floatCanvas);
				this.floatCanvas = null;
			}
			if (backgroundCanvas && !backgroundCanvas.id) {
				container.removeChild(backgroundCanvas);
				chart.backgroundCanvas = null;
			}
		} else {
			// Just make sure the candleWidth is sane
			this.setCandleWidth(this.layout.candleWidth);
		}
	
		function styleCanvas(canv, hide) {
			canv.context = canv.getContext("2d");
			canv.context.lineWidth = 1;
			var canvasStyle = canv.style;
			canvasStyle.position = "absolute";
			canvasStyle.left = "0px";
			if (hide) canvasStyle.display = "none";
		}
	
		if (!chart.backgroundCanvas)
			backgroundCanvas = chart.backgroundCanvas = document.createElement(
				"canvas"
			);
		container.appendChild(backgroundCanvas);
		styleCanvas(backgroundCanvas);
	
		if (!chart.canvasShim)
			canvasShim = chart.canvasShim = document.createElement("div");
		canvasShim.className = "stx-canvas-shim";
		container.appendChild(canvasShim);
	
		if (!chart.canvas) canvas = chart.canvas = document.createElement("canvas");
		container.appendChild(canvas);
		styleCanvas(canvas);
		chart.context = canvas.context;
	
		if (!chart.tempCanvas)
			tempCanvas = chart.tempCanvas = document.createElement("canvas");
		container.appendChild(tempCanvas);
		styleCanvas(tempCanvas, true);
	
		if (!this.floatCanvas)
			floatCanvas = this.floatCanvas = document.createElement("canvas");
		container.appendChild(floatCanvas);
		styleCanvas(floatCanvas, true);
	
		this.resizeCanvas();
	
		if (CIQ.isAndroid) {
			tempCanvas.ontouchstart = floatCanvas.ontouchstart = function (e) {
				if (e.preventDefault) e.preventDefault();
			};
		}
	
		var panels = this.panels;
		chart.panel.display = chart.symbol;
		if (chart.symbolDisplay) chart.panel.display = chart.symbolDisplay;
		this.adjustPanelPositions();
		chart.panel = panels[chart.name];
	
		for (var p in panels) {
			var yAxes = panels[p].yaxisLHS.concat(panels[p].yaxisRHS);
			for (var a = 0; a < yAxes.length; a++) {
				yAxes[a].height = panels[p].yAxis.height; // set the [overlay] yAxis height to the panel's main yAxis height...
				this.calculateYAxisMargins(yAxes[a]); // ...so this will work
			}
		}
	
		this.initialWhitespace = this.preferences.whitespace;
		if (chart.dataSet && chart.dataSet.length > 0) {
			chart.scroll = Math.floor(chart.width / this.layout.candleWidth); //chart.maxTicks;
			var wsInTicks = Math.round(
				this.preferences.whitespace / this.layout.candleWidth
			);
			chart.scroll -= wsInTicks;
		}
		if (CIQ.touchDevice) {
			var overlayEdit = container.querySelector(".overlayEdit");
			var overlayTrashCan = container.querySelector(".overlayTrashCan");
			var vectorTrashCan = container.querySelector(".vectorTrashCan");
			var cb = function (self, callRightClick, forceEdit) {
				return function (e) {
					self.deleteHighlighted(callRightClick, forceEdit);
				};
			};
			if (overlayEdit) {
				CIQ.safeClickTouch(overlayEdit, cb(this, true, true));
				if (overlayTrashCan) {
					CIQ.safeClickTouch(overlayTrashCan, cb(this, false));
				}
			} else if (overlayTrashCan) {
				CIQ.safeClickTouch(overlayTrashCan, cb(this, true));
			}
			if (vectorTrashCan) {
				CIQ.safeClickTouch(vectorTrashCan, cb(this, true));
			}
		}
		if (this.manageTouchAndMouse) {
			this.registerTouchAndMouseEvents();
		}
		if (this.handleMouseOut) {
			container.onmouseout = (function (self) {
				return function (e) {
					self.handleMouseOut(e);
				};
			})(this);
			CIQ.smartHover();
		}
	
		if (this.abortDrawings) this.abortDrawings();
		this.undoStamps = [];
		for (var panelName in panels) {
			var panel = panels[panelName];
			if (panel.markerHolder) {
				container.removeChild(panel.markerHolder);
				panel.markerHolder = null;
			}
		}
		for (var i in this.plugins) {
			var plugin = this.plugins[i];
			if (plugin.display) {
				if (plugin.initializeChart) plugin.initializeChart(this);
			}
		}
		// This sets a resize listener for when the screen itself is resized.
		if (!this.resizeListenerInitialized) {
			var self = this;
			this.resizeListenerInitialized = true;
			var resizeListener = function () {
				return function (e) {
					self.resizeChart();
				};
			};
			this.addDomEventListener(window, "resize", resizeListener(), true);
		}
		if (chart.baseline.userLevel) chart.baseline.userLevel = null;
		// This sets the interval timer which checks fore resize condition every X milliseconds (if non zero)
		this.setResizeTimer(this.resizeDetectMS);
		this.runAppend("initializeChart", arguments);
	};
	
	/**
	 * Clears out a chart engine instantiated with [new CIQ.ChartEngine()]{@link CIQ.ChartEngine},
	 * eliminating all references including the resizeTimer, quoteDriver, styles and eventListeners.
	 *
	 * It's still up to the developer to set the declared pointer for the instance to null so that the garbage collector can remove it.
	 *
	 * Please note that **this method will not remove the chart container or any elements within it, even if they were created by the engine**.
	 * To do that, execute `stx.container.remove();` to remove the chartContainer DOM elements,
	 * and then call this method to remove the chart engine itself. See example.
	 *
	 *
	 * This method should only be used when you no longer need the chart engine and **never** be used in between {@link CIQ.ChartEngine#loadChart} calls to load or change symbols.
	 * @memberof CIQ.ChartEngine
	 * @example
	 * // create
	 * var stxx=new CIQ.ChartEngine({container: document.querySelector(".chartContainer")});
	 *
	 * // execute this line to remove the chart container <div> and its sub elements
	 * stxx.container.remove();
	 *
	 * //destroy engine
	 * stxx.destroy();
	 *
	 * //remove
	 * stxx = null;
	 */
	CIQ.ChartEngine.prototype.destroy = function () {
		this.setResizeTimer(0);
		if (this.quoteDriver) this.quoteDriver.die();
		this.styles = {}; // Get rid of any external style references that could cause us to hang around
		for (var i = 0; i < this.eventListeners.length; i++) {
			var listener = this.eventListeners[i];
			listener.element.removeEventListener(
				listener.event,
				listener["function"],
				listener.options
			);
		}
		this.touchAndMouseEventsRegistered = false;
		this.eventListeners = [];
		if (this.streamParameters.timeout)
			clearTimeout(this.streamParameters.timeout);
	
		// remove chart container from registeredContainers
		var registeredContainers = CIQ.ChartEngine.registeredContainers;
		var chartIndex = registeredContainers.indexOf(this.chart.container);
		if (chartIndex > -1) {
			registeredContainers.splice(chartIndex, 1);
		}
	
		// remove matching range slider
		if (this.slider) {
			var sliderIndex = registeredContainers.indexOf(
				this.slider.slider.chart.container
			);
			if (sliderIndex > -1) {
				registeredContainers.splice(sliderIndex, 1);
			}
		}
	};
	
	/**
	 * Call this before a resizing operation in order to maintain the scroll position. See {@link CIQ.ChartEngine#postAdjustScroll}.
	 * @param  {CIQ.ChartEngine.Chart} [chart] The chart to adjust. Otherwise adjusts the main symbol chart.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.preAdjustScroll = function (chart) {
		if (!chart) chart = this.chart;
		this.previousAdjust = {
			chart: chart,
			scroll: chart.scroll,
			maxTicks: chart.maxTicks
		};
	};
	
	/**
	 * Call this after a resizing operation in order to maintain the scroll position. See {@link CIQ.ChartEngine#preAdjustScroll}.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.postAdjustScroll = function () {
		if (!this.previousAdjust) return;
		var chart = this.previousAdjust.chart;
		chart.scroll =
			this.previousAdjust.scroll +
			(chart.maxTicks - this.previousAdjust.maxTicks);
		if (this.displayInitialized) this.draw();
	};
	
	/**
	 * Translates the requested word to the active language if this.translationCallback callback function is set.
	 *
	 * Use {@link CIQ.translatableTextNode} if you are adding the element to the DOM and wish the translations services to automatically change to other languages as they are set.
	 * @param  {string} english The word to translate
	 * @return {string}			The translated word, or the word itself if no callback is set.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.translateIf = function (english) {
		if (this.translationCallback) return this.translationCallback(english);
		return english;
	};
	
	/**
	 * This method is used to prepare date fields for internal use. It will:
	 * - convert dates to a JS Date in the timeZone set by [setTimeZone(dataZone)]{@link CIQ.ChartEngine#setTimeZone}.
	 * - subsequently strip off the time portion on daily, weekly and monthly intervals.
	 *
	 * - If the date ('DT' or 'Date') does not include a time offset, such as 'yyyy-mm-dd',
	 * no time zone conversion will be performed. Use this option if you prefer to display the same date on all timezones.
	 * This applies to daily, weekly and monthly periodicities only.
	 *
	 * @param  {array} quotes The quote array to be converted
	 * @param  {string} interval Interval of the quotes ("day", "week", etc).
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0
	 * - 5.2.0 Used on intraday and daily quotes to also convert dates to the indicated `dataZone` as set by [setTimeZone(dataZone)]{@link CIQ.ChartEngine#setTimeZone}.
	 */
	CIQ.ChartEngine.prototype.doCleanupDates = function (quotes, interval) {
		if (!quotes || !quotes.length) return;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i],
				date = quote.DT;
			if (!date && !quote.Date) continue;
			if (
				quote.DT &&
				Object.prototype.toString.call(date) == "[object String]" &&
				date.length <= 10
			) {
				// only date portion provided on DT field, no conversion
				date = new Date(date);
				date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
			} else {
				var useDataZone = true;
				if (!quote.DT) {
					date = CIQ.strToDateTime(quote.Date);
					if (quote.Date.length <= 10) useDataZone = false;
				}
				if (Object.prototype.toString.call(date) != "[object Date]")
					date = new Date(date); // if already a date object; nothing to do
				if (timezoneJS.Date && this.dataZone && useDataZone) {
					// convert dates before setting a quotes canonical DT object
					var newDT = new timezoneJS.Date(
						date.getFullYear(),
						date.getMonth(),
						date.getDate(),
						date.getHours(),
						date.getMinutes(),
						this.dataZone
					);
					var milli = date.getSeconds() * 1000 + date.getMilliseconds();
					date = new Date(newDT.getTime() + milli);
				}
				if (CIQ.ChartEngine.isDailyInterval(interval)) date.setHours(0, 0, 0, 0);
			}
			if (!quote.DT) quote.Date = CIQ.yyyymmddhhmmssmmm(date); // Set the Date to the adjusted date but only if there was no DT provided
			quote.DT = date;
		}
	};
	
	/**
	 * If {@link CIQ.ChartEngine#cleanupGaps} is set, this method will insert bars in an array of quotes for those periods missing a record according to the market hours and the current periodicity.
	 * See "{@link CIQ.Market}" for details on how to properly configure the library to your market hours requirements.
	 *
	 * This method will not be called for `tick` since by nature it is no a predictable interval.
	 *
	 * This method is automatically called if you are using a quoteFeed and have {@link CIQ.ChartEngine#cleanupGaps} set, but can be manually called if pushing or streaming data into the chart.
	 *
	 * This method will affect intraday and **underlying daily**  periods **only**. If the feed is already returning weekly and monthly data rolled up, the clean up will not be done ( see {@link CIQ.ChartEngine#dontRoll} ).
	 *
	 * See {@link CIQ.ChartEngine#cleanupGaps}, for more details.
	 *
	 * @param  {array} quotes The quote array to be gap-filled
	 * @param  {CIQ.ChartEngine.Chart} [chart] Chart object to target.
	 * @param {object} [params] Parameters
	 * @param {string} [params.cleanupGaps] Pass this in to override the {@link CIQ.ChartEngine#cleanupGaps} value.
	 * @param {boolean} [params.noCleanupDates]		If true then dates have been cleaned up already by calling {@link CIQ.ChartEngine#doCleanupDates}, so do not do so in here.
	 * @param {string} [params.field]		Set to a field to fill gaps, or leave out to use chart.defaultPlotField.
	 * @return {array} The quote array with gaps filled in.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 07/01/2015 Now supports cleanups for daily intervals and foreign exchanges instead of just intraday equities.
	 * - 3.0.7 Added `params.cleanupGaps` to allow developers to use this function standalone,
	 * - 5.2.0 Added `params.noCleanupDates`.
	 * - 6.0.0 Added `params.field`.
	 * - 6.0.0 If `params.cleanupGaps` is true, use the value of `stxx.cleanupGaps`. If that's not set, then `cleanupGaps` is like carry.
	 */
	CIQ.ChartEngine.prototype.doCleanupGaps = function (quotes, chart, params) {
		if (!quotes || !quotes.length) return quotes;
		var interval = this.layout.interval;
		params = params ? params : {};
		if (!chart) chart = this.chart;
		if (!CIQ.Market || !chart.market) return quotes;
		if (!params.noCleanupDates) this.doCleanupDates(quotes, interval);
	
		var cleanupGaps = params.cleanupGaps;
		if (cleanupGaps === false) return quotes;
		if (!cleanupGaps || cleanupGaps === true)
			cleanupGaps = this.cleanupGaps || cleanupGaps;
		var makeGaps = cleanupGaps == "gap"; // "carry" or any other non-false will cause the closing price to carry, otherwise a null will be injected
	
		if (!cleanupGaps) return quotes;
		if (interval == "tick") return quotes;
	
		// doCleanupGaps works on the raw masterData, so if we're rolling up month or week then be sure to actually
		// cleanup gaps on the masterData which will be "day"
		if (interval == "month" || interval == "week") {
			if (this.dontRoll) return quotes; // We won't try to fill gaps on raw month or week data
			interval = "day";
		}
	
		var _make_date = function (_quote) {
			if (_quote.DT) {
				if (Object.prototype.toString.call(_quote.DT) != "[object Date]")
					return new Date(_quote.DT); // epoch or ISO string
				return new Date(+_quote.DT);
			}
			return CIQ.strToDateTime(_quote.Date);
		};
	
		var new_quotes = [];
		var currentQuote = quotes[0];
		new_quotes.push(currentQuote);
	
		var iter_parms = {
			begin: _make_date(currentQuote),
			interval: interval,
			periodicity: 1,
			timeUnit: this.layout.timeUnit
		};
		var market = new CIQ.Market(chart.market.market_def);
		var iter = market.newIterator(iter_parms);
		if (this.extendedHours && this.extendedHours.filter)
			iter.market.enableAllAvailableSessions();
	
		var field = chart.defaultPlotField;
	
		// See if Value is the key field instead of Close by looking for a record with Value but no Close.
		for (var valQuote = 0; valQuote < quotes.length; valQuote++) {
			if (quotes[valQuote][field] !== undefined) break;
			if (quotes[valQuote].Value !== undefined) {
				field = "Value";
				break;
			}
		}
	
		var mdt;
	
		function fillGapsBetween(dt1, dt2) {
			var paramField = params.field;
			var cQuote = paramField ? currentQuote[paramField] : currentQuote;
			if (cQuote === undefined) cQuote = {};
			var close = makeGaps ? null : cQuote[field];
			var adjClose = makeGaps ? null : cQuote.Adj_Close;
			// Loop through the iterator adding a dummy quote for every missing market date between currentQuote and nextQuote
			while (+dt1 < +dt2) {
				var newQuote = { DT: dt1 };
				if (paramField) {
				} else {
					new_quotes.push(newQuote);
					CIQ.extend(newQuote, {
						Open: close,
						High: close,
						Low: close,
						Close: close,
						Volume: 0,
						Adj_Close: adjClose
					});
				}
				dt1 = iter.next();
			}
		}
	
		function copyForward(currentQuote, nextQuote) {
			var paramField = params.field;
			if (paramField) {
				if (
					typeof currentQuote[paramField] != "undefined" &&
					typeof nextQuote[paramField] == "undefined"
				) {
					nextQuote[paramField] = makeGaps ? null : currentQuote[paramField];
				}
				return;
			}
			if (makeGaps) return;
			var close = currentQuote[field];
			var nextClose = nextQuote[field];
			if (typeof close != "undefined" && typeof nextClose == "undefined") {
				CIQ.ensureDefaults(nextQuote, {
					Close: close,
					Open: close,
					High: close,
					Low: close,
					Volume: 0,
					Adj_Close: currentQuote.Adj_Close
				});
			}
		}
	
		for (var i = 1; i < quotes.length; i++) {
			var nextQuote = quotes[i];
			mdt = iter.next(); // market date
			var qdt = _make_date(nextQuote); // quote date
	
			if (mdt < qdt) {
				fillGapsBetween(mdt, qdt);
				mdt = iter.market._convertFromMarketTZ(iter.begin, iter.outZone);
			}
	
			while (qdt < mdt) {
				if (++i == quotes.length) return new_quotes;
				copyForward(currentQuote, nextQuote);
				new_quotes.push(nextQuote);
				currentQuote = nextQuote;
				nextQuote = quotes[i];
				qdt = _make_date(nextQuote);
			}
			if (mdt < qdt) {
				i--;
				mdt = iter.previous();
			} else {
				copyForward(currentQuote, nextQuote);
				new_quotes.push(nextQuote);
				currentQuote = nextQuote;
			}
		}
	
		return new_quotes;
	};
	
	/**
	 * Returns the variables exported by the library.
	 *
	 * Use this function to access the CIQ namespace and other library exports when they are not
	 * otherwise accessible.
	 *
	 * @return {object} The exports of the library.
	 *
	 * @private
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.prototype.getCreatingLibrary = function () {
		return _exports;
	};
	
	};
	
	
	let __js_core_engine_panel_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Defines a Panel object.
	 * Every chart or study is rendered in a panel.
	 *
	 * Example: stxx.panels['chart']
	 *
	 * Example: stxx.panels['Aroon (14)']
	
	 * @param {string} name The name of the panel.
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] Y axis ({@link CIQ.ChartEngine.YAxis}) object for the panel.
	 * @constructor
	 * @name  CIQ.ChartEngine.Panel
	 */
	CIQ.ChartEngine.Panel = function (name, yAxis) {
		if (yAxis) this.yAxis = yAxis;
		else this.yAxis = new CIQ.ChartEngine.YAxis();
		this.name = name;
		this.state = {}; // drawing state of the panel, can be studies, drawings, or any panel-scoped object
	};
	
	CIQ.extend(
		CIQ.ChartEngine.Panel.prototype,
		{
			name: null, // Name of panel
			display: null, // Display text of panel
			chart: null, // The chart from which this panel derives its data
			yAxis: null, // Y axis object for this panel, this is the same object as chart.yAxis on chart panels
			shareChartXAxis: null, // Set to false to indicate panel does not share x axis with its chart
			top: null, // Y location of top of chart
			bottom: null, // Y location of bottom of chart
			height: null, // height of chart in pixels
			percent: null, // percent of overall window this panel takes up
			/**
			 * Draws a border around the panel's left and right sides for a more finished look, when no y axis is present.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Panel#
			 * @since 7.1.0
			 */
			displayEdgeIfPadded: true,
			/**
			 * Prevents plot and axis dragging into, out of, and within panels.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Panel#
			 * @since 7.2.0
			 */
			noDrag: false,
			/**
			 * Determines whether the panel is included in the {@link CIQ.ChartEngine#exportLayout}
			 * return object.
			 *
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.Panel#
			 * @since 8.0.0
			 */
			exportable: true
		},
		true
	);
	
	/**
	 * Returns the panel for the given Y pixel. Used for instance to determine which panel the crosshairs are in.
	 * @param  {number} y Y pixel location
	 * @return {CIQ.ChartEngine.Panel}	  The panel containing the Y location. Null if the Y location is outside of all panels.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.whichPanel = function (y) {
		for (var p in this.panels) {
			var panel = this.panels[p];
			if (panel.hidden) continue;
			if (y >= panel.top && y < panel.bottom) return panel;
		}
		return null;
	};
	
	/**
	 * Returns true if the panel exists
	 * @param  {string} name Name of panel to search for
	 * @return {boolean}	  True if the panel exists
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.panelExists = function (name) {
		for (var p in this.panels) {
			var panel = this.panels[p];
			if (panel.name == name) return true;
		}
		return false;
	};
	
	/**
	 * Takes the existing panels and stores them in the layout.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.storePanels = function () {
		if (!this.layout) this.layout = {};
		var view = this.layout;
		view.panels = {};
		for (var p in this.panels) {
			var panel = this.panels[p];
			view.panels[panel.name] = {
				percent: panel.percent,
				display: panel.display,
				yAxis: panel.yAxis
			};
		}
	};
	
	/**
	 * Saves the panel state in the layout. Called whenever there is a change to panel layout (resizing, opening, closing).
	 * @param  {boolean} saveLayout If false then a change event will not be called. See (@link CIQ.ChartEngine#changeOccurred)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.savePanels = function (saveLayout) {
		this.storePanels();
		if (saveLayout !== false) this.changeOccurred("layout");
	};
	
	/**
	 * Internal function for deleting a panel and its associated DOM objects
	 * Do not call directly. Always call panelClose
	 * @private
	 */
	CIQ.ChartEngine.prototype.privateDeletePanel = function (panel) {
		// check for studies
		for (var s in this.layout.studies) {
			var study = this.layout.studies[s];
			if (study.panel == panel.name) {
				this.cleanupRemovedStudy(study);
			}
		}
		// If we ever want to delete any drawing objects in a panel
		/*var drawingDeleted=false;
			for(var i=0;i<this.drawingObjects.length;i++){
				var drawing=this.drawingObjects[i];
				if(this.panels[drawing.panelName]==panel){
					drawing.abort();
					this.drawingObjects.splice(i,1);
					drawingDeleted=true;
				}
			}*/
		delete this.panels[panel.name];
		for (var series in this.overlays) {
			if (this.overlays[series].panel == panel.name) {
				if (this.layout.studies)
					this.cleanupRemovedStudy(this.layout.studies[series]);
				delete this.overlays[series];
			}
		}
	
		// remove all the series that display on the panel
		for (var entry in this.chart.series) {
			if (this.chart.series[entry].parameters.panel == panel.name) {
				this.removeSeries(this.chart.series[entry], this.chart);
			}
		}
	
		if (panel.holder) {
			this.chart.container.removeChild(panel.holder);
			if (this.getMarkerArray) {
				var arr = this.getMarkerArray("panelName", panel.name);
				for (var i = 0; i < arr.length; i++) {
					this.removeFromHolder(arr[i]);
				}
			}
		}
		if (panel.handle) panel.handle.remove();
		//if(drawingDeleted) this.changeOccurred("vector");
		this.currentPanel = null;
	};
	
	/**
	 * Returns an array of plots (studies and renderers) situated within a given panel, not including the main series of the chart panel.
	 * @param  {CIQ.ChartEngine.Panel|string}	panel	The panel to check
	 * @return {array}	Plots which are in the panel
	 * @memberof CIQ.ChartEngine
	 * @since 7.1.0
	 */
	CIQ.ChartEngine.prototype.plotsInPanel = function (panel) {
		var arr = [];
		var panelName = panel;
		if (typeof panel == "object") panelName = panel.name;
		// check for studies
		for (var s in this.layout.studies) {
			var study = this.layout.studies[s];
			if (panelName === study.panel) arr.push(study);
		}
	
		// check for series
		for (var r in this.chart.seriesRenderers) {
			var renderer = this.chart.seriesRenderers[r];
			if (panelName === renderer.params.panel) arr.push(renderer);
		}
	
		return arr;
	};
	
	/**
	 * Determines if a panel is empty of series and studies. If the panel is empty, remove the panel.
	 *
	 * @param {CIQ.ChartEngine.Panel|string} panel The panel to check.
	 * @param {boolean} [dryRun] True to just return if it was an empty panel without actually
	 * 		deleting it.
	 * @param {string|string[]} [exclude] Disregard anything in this array when checking for plots in
	 * 		this panel.
	 * @return {boolean} False if the panel should still be displayed, true if panel is removed.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 6.3.0
	 * - 7.1.0 Added the `dryRun` and `exclude` parameters.
	 */
	CIQ.ChartEngine.prototype.checkForEmptyPanel = function (
		panel,
		dryRun,
		exclude
	) {
		if (!panel) return false;
		var panelName = panel;
		if (typeof panel == "object") panelName = panel.name;
		if (panelName === this.chart.name) return false; // don't remove the main chart panel
		if (!exclude) exclude = [];
		else if (!(exclude instanceof Array)) exclude = [exclude];
	
		var plots = this.plotsInPanel(panel);
		for (var i = 0; i < plots.length; i++) {
			if (exclude.indexOf(plots[i]) == -1) return false;
		}
	
		// check for drawings
		/*for(var i = 0; i < this.drawingObjects.length; i++) {
				if(panelName === this.drawingObjects[i].panelName) {
					return false;
				}
			}*/
	
		if (!dryRun) this.panelClose(this.panels[panelName]);
		return true;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Closes the panel opened with {@link CIQ.ChartEngine.AdvancedInjectable#createPanel}.
	 * This is called when a chart panel is closed manually or programmatically.
	 * For example, after removing a study panel with the {@link CIQ.Studies.removeStudy} function, or when a user clicks on the "X" for a panel.
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to close
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias panelClose
	 *
	 */
	CIQ.ChartEngine.prototype.panelClose = function (panel) {
		if (!panel) return;
		if (this.runPrepend("panelClose", arguments)) return;
		this.cancelTouchSingleClick = true;
		CIQ.ChartEngine.drawingLine = false;
		if (panel.soloing) this.panelSolo(panel);
	
		// If we're deleting a panel with a chart in it
		if (this.charts[panel.name]) {
			// Then delete all the panels that reference that chart
			for (var panelName in this.panels) {
				var subPanel = this.panels[panelName];
				if (subPanel.chart.name == panel.name) {
					this.privateDeletePanel(subPanel);
				}
			}
			// and delete the chart itself
			delete this.charts[panel.name];
		} else {
			// otherwise just delete the panel
			this.privateDeletePanel(panel);
		}
		if (!this.currentlyImporting) {
			// silent mode while importing
			this.showCrosshairs();
			//this.createDataSet();  // commented, why would we do this?
			this.resetDynamicYAxis({ noRecalculate: true });
			this.calculateYAxisPositions();
			this.draw();
			this.savePanels();
		}
		// IE11 on Win7 hack. We do this in case the mouseup is lost when we removed the panel.close from the DOM
		this.userPointerDown = this.grabbingScreen = false;
		if (this.openDialog) this.openDialog = "";
		this.runAppend("panelClose", arguments);
	};
	
	/**
	 * Deletes all of the panels (except for the default chart panel)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.deleteAllPanels = function () {
		for (var p in this.panels) {
			var panel = this.panels[p];
			this.privateDeletePanel(panel);
		}
		this.layout.panels = {};
		this.panels = {};
	};
	
	/**
	 * This moves a panel up one position (when the user clicks the up arrow).
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to move up.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.panelUp = function (panel) {
		this.cancelTouchSingleClick = true;
		CIQ.ChartEngine.drawingLine = false;
		this.showCrosshairs();
		var newPanels = {};
		var pos = 0;
		var p;
		for (p in this.panels) {
			if (p == panel.name) break;
			pos++;
		}
	
		if (!pos) return; //already at top
	
		var i = 0;
		for (p in this.panels) {
			if (i == pos - 1) newPanels[panel.name] = panel;
			if (p == panel.name) continue;
			newPanels[p] = this.panels[p];
			i++;
		}
		this.panels = newPanels;
		this.adjustPanelPositions();
		this.draw();
		this.savePanels();
	};
	
	/**
	 * This moves a panel down one position (when the user clicks the down arrow).
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to move down.
	 * @memberof CIQ.ChartEngine
	 */
	
	CIQ.ChartEngine.prototype.panelDown = function (panel) {
		this.cancelTouchSingleClick = true;
		CIQ.ChartEngine.drawingLine = false;
		this.showCrosshairs();
		var newPanels = {};
		var pos = 0;
		var p;
		for (p in this.panels) {
			if (p == panel.name) break;
			pos++;
		}
	
		var length = 0;
		for (p in this.panels) length++;
		if (pos == length - 1) return; //already at bottom
	
		var i = 0;
		for (p in this.panels) {
			if (p == panel.name) {
				i++;
				continue;
			}
			newPanels[p] = this.panels[p];
			if (i == pos + 1) newPanels[panel.name] = panel;
			i++;
		}
		this.panels = newPanels;
		this.adjustPanelPositions();
		this.draw();
		this.savePanels();
	};
	
	/**
	 * This "solos" the panel (when the user clicks the solo button). All panels other than this panel and the chart
	 * are temporarily hidden. If the solo panel is the chart then all other panels will be hidden.
	 * Note if {@link CIQ.ChartEngine#soloPanelToFullScreen} is set than even the chart panel may be hidden
	 * @param  {CIQ.ChartEngine.Panel} panel The panel to be soloed.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.panelSolo = function (panel) {
		this.cancelTouchSingleClick = true;
		CIQ.ChartEngine.drawingLine = false;
		this.showCrosshairs();
		var hideOrNot = true;
		var p;
		if (panel.soloing) {
			hideOrNot = false;
			panel.soloing = false;
			panel.solo.classList.remove("stx_solo_lit");
			panel.percent = panel.oldPercent;
			if (panel.name != "chart") {
				if (this.soloPanelToFullScreen) {
					if (panel.percent == 1) {
						for (p in this.panels) {
							var otherPanel = this.panels[p];
							if (otherPanel != panel) panel.percent -= otherPanel.percent;
						}
					}
				} else {
					this.chart.panel.percent = this.chart.panel.oldPercent;
				}
			}
			if (this.soloPanelToFullScreen) {
				this.xAxisAsFooter = this.chart.panel.oldXAxisAsFooter;
			}
		} else {
			panel.soloing = true;
			panel.solo.classList.add("stx_solo_lit");
			panel.oldPercent = panel.percent;
			this.chart.panel.oldXAxisAsFooter = this.xAxisAsFooter;
			if (panel.name != "chart") {
				if (this.soloPanelToFullScreen) {
					this.xAxisAsFooter = true;
				} else {
					this.chart.panel.oldPercent = this.chart.panel.percent;
					panel.percent = 1 - this.chart.panel.percent;
				}
			}
		}
		for (p in this.panels) {
			this.panels[p].hidden = hideOrNot;
		}
		if (!this.soloPanelToFullScreen) this.chart.panel.hidden = false;
		panel.hidden = false;
		this.resetDynamicYAxis({ noRecalculate: true });
		this.calculateYAxisPositions();
		this.draw();
		this.savePanels();
	};
	
	//@private
	CIQ.ChartEngine.prototype.calculatePanelPercent = function (panel) {
		var h = panel.bottom - panel.top;
		panel.percent = h / this.chart.canvasHeight;
	};
	
	/**
	 * Called when the user moves a panel handle, to resize all of the panels relative to the movement.
	 * @private
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.resizePanels = function () {
		if (!CIQ.ChartEngine.resizingPanel) return;
		var priorPanel, minimumHeight, yAxes, i;
		var down =
			CIQ.ChartEngine.crosshairY >
			this.resolveY(CIQ.ChartEngine.resizingPanel.top);
		for (var p in this.panels) {
			if (this.panels[p] == CIQ.ChartEngine.resizingPanel) break;
			if (this.panels[p].hidden) continue;
			priorPanel = this.panels[p];
		}
		var newY = this.backOutY(CIQ.ChartEngine.crosshairY);
		if (down) {
			yAxes = CIQ.ChartEngine.resizingPanel.yaxisLHS.concat(
				CIQ.ChartEngine.resizingPanel.yaxisRHS
			);
			for (i = 0; i < yAxes.length; i++) {
				minimumHeight =
					yAxes[i].initialMarginTop + yAxes[i].initialMarginBottom + 10;
				if (newY > yAxes[i].bottom - minimumHeight) {
					newY = yAxes[i].bottom - minimumHeight;
				}
			}
		} else {
			yAxes = priorPanel.yaxisLHS.concat(priorPanel.yaxisRHS);
			for (i = 0; i < yAxes.length; i++) {
				minimumHeight =
					yAxes[i].initialMarginTop + yAxes[i].initialMarginBottom + 10;
				if (newY < yAxes[i].top + minimumHeight) {
					newY = yAxes[i].top + minimumHeight;
				}
			}
		}
		CIQ.ChartEngine.crosshairY = this.resolveY(newY);
		priorPanel.bottom = newY;
		CIQ.ChartEngine.resizingPanel.top = newY;
		this.calculatePanelPercent(priorPanel);
		this.calculatePanelPercent(CIQ.ChartEngine.resizingPanel);
	
		this.adjustPanelPositions();
		this.draw();
		this.savePanels();
	};
	
	/**
	 * Determines whether a panel precedes the main chart in the display order.
	 *
	 * @param {CIQ.ChartEngine.Panel} panel The panel for which the display order is determined.
	 * @return {boolean} true, if the panel is above the chart; false, if below or not available.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.prototype.isPanelAboveChart = function (panel) {
		for (var p in this.panels) {
			if (p == "chart") return false;
			if (p == panel.name) return true;
		}
		return false;
	};
	
	// First, adjust the panel percentages so that they all add up to 1
	// Secondly, set the pixel top and bottom of each panel based on the percentages
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Adjusts the positions of all of the panels. Ensures that panel percentages add up to 100%. Sets the panel top and bottom
	 * based on the percentages. Also sets the icon template icons appropriately for each panel's position. And adjusts
	 * any drawings. Finally it makes some calculations that are used by the y-axis.
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias adjustPanelPositions
	 */
	CIQ.ChartEngine.prototype.adjustPanelPositions = function () {
		const { chart, panels } = this;
		if (chart.tempCanvas) CIQ.clearCanvas(chart.tempCanvas, this); // clear any drawing in progress
		// if(!this.chart.symbol) return;
		if (this.runPrepend("adjustPanelPositions", arguments)) return;
		var lastBottom = 0;
		var h = chart.canvasHeight;
		var first = false;
		var acc = 0;
		var n = 0;
		var activeSolo = false;
		var x, panel;
		for (x in panels) {
			panel = panels[x];
			if (isNaN(panel.percent) || panel.percent <= 0) panel.percent = 0.05;
			if (panel.hidden) continue;
			acc += panel.percent;
			n++;
			if (panel.soloing) activeSolo = true;
		}
	
		for (x in panels) {
			var zoomRatio = 0;
			panel = panels[x];
	
			if (panel.hidden) {
				if (panel.markerHolder) {
					panel.markerHolder.style.display = "none";
				}
				continue;
			}
			if (this.manageTouchAndMouse) {
				if (panel.up) {
					if (!first) {
						first = true;
						panel.up.classList.remove("stx-show");
					} else {
						if (this.displayIconsUpDown) panel.up.classList.add("stx-show");
					}
				}
				if (panel.solo) {
					if (activeSolo) {
						if (panel.soloing && this.displayIconsSolo)
							panel.solo.classList.add("stx-show");
						else panel.solo.classList.remove("stx-show");
					} else if (n == 1) {
						panel.solo.classList.remove("stx-show");
					} else if (n == 2 && !this.soloPanelToFullScreen) {
						panel.solo.classList.remove("stx-show");
					} else {
						if (this.displayIconsSolo) panel.solo.classList.add("stx-show");
					}
				}
				if (panel.down) {
					if (n == 1) {
						panel.down.classList.remove("stx-show");
					} else {
						if (this.displayIconsUpDown) panel.down.classList.add("stx-show");
					}
				}
				if (panel.edit) {
					if (panel.editFunction) panel.edit.classList.add("stx-show");
					else panel.edit.classList.remove("stx-show");
				}
				if (panel.close) {
					if (this.displayIconsClose) panel.close.classList.add("stx-show");
					else panel.close.classList.remove("stx-show");
				}
			}
	
			panel.percent = panel.percent / acc;
			panel.top = lastBottom;
			panel.bottom = panel.top + h * panel.percent;
			panel.height = panel.bottom - panel.top;
			if (panel.chart.name == panel.name) {
				panel.chart.top = panel.top;
				panel.chart.bottom = panel.bottom;
				panel.chart.height = panel.height;
			}
	
			lastBottom = panel.bottom;
	
			if (panel.yaxisLHS) {
				var arr = panel.yaxisLHS.concat(panel.yaxisRHS);
				for (var yax = 0; yax < arr.length; yax++) {
					var yAxis = arr[yax];
	
					if (yAxis.zoom && yAxis.height > 0) {
						zoomRatio = yAxis.zoom / yAxis.height;
					}
					this.adjustYAxisHeightOffset(panel, yAxis);
					yAxis.height = yAxis.bottom - yAxis.top;
					if (zoomRatio) {
						yAxis.scroll *= (zoomRatio * yAxis.height) / yAxis.zoom;
						yAxis.zoom = zoomRatio * yAxis.height;
						if (yAxis.zoom > yAxis.height) {
							yAxis.zoom = 0; // If the zoom is greater than the height then we'll have an upside down y-axis
							yAxis.scroll = 0;
						}
					}
	
					if (!yAxis.high && yAxis.high !== 0) {
						// panels without values will use percentages to position drawings
						yAxis.high = 100;
						yAxis.low = 0;
						yAxis.shadow = 100;
					}
					yAxis.multiplier = yAxis.height / yAxis.shadow;
					// necessary to preserve the heightFactor of a yAxis
					if (yAxis.position === "none") this.calculateYAxisMargins(yAxis);
				}
			}
	
			if (panel.holder) {
				panel.holder.style.right = "0px";
				panel.holder.style.top = panel.top + "px";
				panel.holder.style.left = "0px";
				panel.holder.style.height = panel.height + "px";
	
				panel.subholder.style.left = panel.left + "px";
				panel.subholder.style.width = panel.width + "px";
				panel.subholder.style.top = "0px";
				if (panel.yAxis.height >= 0)
					panel.subholder.style.height = panel.yAxis.height + "px";
			}
		}
		if (x && panels[x].down) panels[x].down.classList.remove("stx-show");
		if (this.manageTouchAndMouse && n == 2 && !activeSolo && chart.panel.solo) {
			chart.panel.solo.classList.add("stx-show");
		}
		if (chart.panel) {
			var bottom;
			if (activeSolo && this.soloPanelToFullScreen) {
				bottom = chart.canvasHeight - panel.yAxis.bottom + 12;
			} else {
				bottom = chart.canvasHeight - chart.panel.yAxis.bottom + 12;
			}
			let controls = this.controls;
			let { chartControls, home, notificationTray } = controls;
			let yaxOffset = this.width - chart.panel.right;
			if (chartControls) chartControls.style.bottom = bottom + "px";
			if (home) {
				home.style.bottom = bottom + "px";
				home.style.marginRight = yaxOffset + "px";
			}
			if (notificationTray) {
				notificationTray.style.bottom = bottom + "px";
				notificationTray.style.marginRight = yaxOffset + "px";
			}
		}
		this.clearPixelCache();
	
		if (this.drawingObjects.length) this.adjustDrawings();
	
		this.runAppend("adjustPanelPositions", arguments);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Creates a new panel and makes room for it by squeezing all the existing panels.
	 * To remove a panel, manually call {@link CIQ.ChartEngine.AdvancedInjectable#panelClose}.
	 *
	 * @param {string} display The display name for the panel.
	 * @param {string} name	The name of the panel (usually the study ID).
	 * @param {number} [height] Requested height of the panel in pixels. Defaults to 1/5 of the
	 * 		screen size.
	 * @param {string} [chartName="chart"] The chart to associate with this panel.
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] {@link CIQ.ChartEngine.YAxis} object. If not present,
	 * 		the existing panel's axis is used.
	 * @param {boolean} [noExport] If true, omits the panel from the
	 * 		{@link CIQ.ChartEngine#exportLayout} function.
	 * @return {CIQ.ChartEngine.Panel} The panel just added.
	 *
	 * @alias createPanel
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @since
	 * - 5.2.0 Added the `yAxis` parameter.
	 * - 7.1.0 Added the return value.
	 * - 8.0.0 Added the `noExport` parameter.
	 */
	CIQ.ChartEngine.prototype.createPanel = function (
		display,
		name,
		height,
		chartName,
		yAxis,
		noExport
	) {
		if (this.runPrepend("createPanel", arguments)) return;
		if (!chartName) chartName = "chart";
		var h = this.chart.canvasHeight;
		if (!height) height = h * 0.2;
		if (height > h) height = h * 0.5;
		var percent = height / h;
		var reduce = 1 - percent;
		var activeSolo = false;
		for (var p in this.panels) {
			var panel = this.panels[p];
			panel.percent *= reduce;
			if (panel.soloing) activeSolo = true;
		}
		this.stackPanel(display, name, percent, chartName, yAxis);
		this.panels[name].hidden = activeSolo;
		this.panels[name].exportable = !noExport;
		this.adjustPanelPositions();
		this.savePanels(false);
		this.runAppend("createPanel", arguments);
		return this.panels[name];
	};
	
	/**
	 * Changes the name, display and primary yAxis of a panel, and adjusts all references accordingly.
	 * @param {CIQ.ChartEngine.Panel|string} panel The panel
	 * @param {object} [params]
	 * @param {string} [params.name] Panel name, if omitted, name becomes a random string
	 * @param {string} [params.display] Panel display, defaults to the name
	 * @param {CIQ.ChartEngine.YAxis} [params.yAxis] Panel's y-axis. If omitted, will use the panel's existing y-axis
	 * @since 7.1.0
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.modifyPanel = function (panel, params) {
		const oldName = panel.name;
		const { studies } = this.layout;
		const { series } = this.chart;
		let { name, display, yAxis } = params || {};
	
		if (!name) name = CIQ.uniqueID();
		if (!display) display = name;
		if (!yAxis) {
			yAxis = panel.yAxis;
			yAxis.name = name;
		}
	
		let newPanels = {};
		for (let p in this.panels) {
			if (p === panel.name) {
				// swap the name/id of the old panel
				let tmp = this.panels[p];
				tmp.name = name;
				tmp.display = display;
				tmp.yAxis = yAxis;
				panel = newPanels[name] = tmp;
				if (this.moveMarkers && oldName !== name) {
					this.moveMarkers(oldName, name);
				}
			} else {
				newPanels[p] = this.panels[p];
			}
		}
	
		this.panels = newPanels;
	
		let layoutChanged = false;
		for (let s in studies) {
			let study = studies[s];
			if (study.panel === oldName) {
				study.panel = name;
				if (study.parameters && study.parameters.panelName) {
					layoutChanged = true;
					study.parameters.panelName = name;
				}
			}
		}
	
		for (let s in series) {
			if (series[s].parameters.panel === oldName) {
				layoutChanged = true;
				let prm = { panel: name };
				if (
					series[s].parameters.yAxis &&
					series[s].parameters.yAxis.name === oldName
				)
					prm.yAxis = yAxis;
				this.modifySeries(s, prm, true);
			}
		}
	
		if (layoutChanged) this.changeOccurred("layout");
	
		let drawingChanged = false;
		for (let d = 0; d < this.drawingObjects.length; d++) {
			let drawing = this.drawingObjects[d];
			if (oldName === drawing.panelName) {
				drawing.panelName = name;
				drawingChanged = true;
			}
		}
	
		if (drawingChanged) this.changeOccurred("vector");
	
		this.calculateYAxisPositions();
	};
	
	/**
	 * Changes the height of a panel, adjusting other panels accordingly.
	 *
	 * @param {CIQ.ChartEngine.Panel} panelToModify The panel whose height is changed.
	 * @param {number} requestedHeight The new height in pixels of the panel.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.0.0
	 */
	CIQ.ChartEngine.prototype.setPanelHeight = function (
		panelToModify,
		requestedHeight
	) {
		if (!requestedHeight) return;
	
		// adjust requested height to accommodate the x-axis if panel is at bottom
		if (Object.values(this.panels).slice(-1)[0] === panelToModify) {
			requestedHeight += this.xaxisHeight;
		}
	
		const { canvasHeight } = this.chart;
		const { percent: currentPercent } = panelToModify;
		const newPercent = requestedHeight / canvasHeight;
		const prevRemainingPercent = 1 - currentPercent;
		const newRemainingPercent = 1 - newPercent;
		const adjustment = prevRemainingPercent / newRemainingPercent;
	
		Object.values(this.panels).forEach((panel) => {
			panel.percent /= adjustment;
		});
		panelToModify.percent = newPercent;
	
		this.adjustPanelPositions();
		this.savePanels();
	};
	
	/**
	 * Chooses a new study or renderer to be the "owner" of a panel. This affects the name of the panel as well as the main y-axis.
	 * If no new owner can be found, panel is closed. Calls `modifyPanel`.
	 *
	 * @param {CIQ.ChartEngine.Panel|string} panel The panel that contains the study or renderer.
	 * @param {CIQ.ChartEngine.YAxis} [yAxisHint] Optional y-axis from which to try to elect a new panel owner.
	 * @return {string} The new name of the panel.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Added the `yAxisHint` argument.
	 */
	CIQ.ChartEngine.prototype.electNewPanelOwner = function (panel, yAxisHint) {
		var newOwner;
		if (typeof panel == "string") panel = this.panels[panel];
		var oldYAxis = panel.yAxis;
		function myAxis(y) {
			return y.name != oldYAxis.name;
		}
		if (panel && panel != this.chart.panel) {
			var yAxis = panel.yAxis;
			// first see if yaxis was hosting other plots, create a new panel axis for them
			var newName = yAxis.studies[0];
			if (!newName || newName == oldYAxis.name) newName = yAxis.renderers[0];
			if (!newName || newName == oldYAxis.name) newName = yAxis.studies[1];
			if (!newName) newName = yAxis.renderers[1];
			if (yAxisHint) {
				// a suggested yAxis was supplied, trust it
				yAxis = panel.yAxis = yAxisHint;
				newOwner = yAxisHint.name;
			} else if (!newName) {
				// no more plots on the main axis, let's find another axis
				if (panel.yaxisLHS) {
					var axisArr = panel.yaxisRHS.concat(panel.yaxisLHS).filter(myAxis);
					var newAxis = axisArr[0];
					for (var y = 0; y < axisArr.length; y++) {
						if (!axisArr[y].position) {
							// give priority to a default axis
							newAxis = axisArr[y];
							break;
						}
					}
					if (newAxis) {
						yAxis = panel.yAxis = newAxis;
						newOwner = newAxis.studies[0] || newAxis.renderers[0];
					}
				}
			} else {
				yAxis = this.addYAxis(
					panel,
					new CIQ.ChartEngine.YAxis({ name: newName, position: yAxis.position })
				);
				yAxis.renderers = panel.yAxis.renderers;
				yAxis.studies = panel.yAxis.studies;
				newOwner = newName;
			}
			if (newOwner) {
				newName = newOwner;
				if (oldYAxis.name != panel.name) newName = panel.name; // don't change the panel name if it didn't match the old owner
				var display,
					studies = this.layout.studies;
				if (studies && studies[newOwner])
					display = studies[newOwner].inputs.display;
				this.modifyPanel(panel, {
					name: newName,
					display: display || newOwner,
					yAxis: yAxis
				});
				this.deleteYAxisIfUnused(panel, oldYAxis);
				this.calculateYAxisMargins(this.panels[newName].yAxis);
			} else this.checkForEmptyPanel(panel);
		}
		return newOwner;
	};
	
	/**
	 * Configures the panel controls
	 * @param  {CIQ.ChartEngine.Panel} panel The panel
	 * @private
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.configurePanelControls = function (panel) {
		var icons = panel.icons;
		if (!icons) return;
		var isChart = panel.name == panel.chart.name;
	
		icons.classList.add("stx-show");
	
		panel.title = icons.querySelector(".stx-panel-title");
		panel.up = icons.querySelector(".stx-ico-up");
		if (panel.up) panel.up = panel.up.parentNode;
		panel.solo = icons.querySelector(".stx-ico-focus");
		if (panel.solo) panel.solo = panel.solo.parentNode;
		panel.down = icons.querySelector(".stx-ico-down");
		if (panel.down) panel.down = panel.down.parentNode;
		panel.edit = icons.querySelector(".stx-ico-edit");
		if (panel.edit) panel.edit = panel.edit.parentNode;
		panel.close = icons.querySelector(".stx-ico-close");
		if (panel.close) panel.close = panel.close.parentNode;
	
		if (panel.title) {
			panel.title.innerHTML = "";
			if (panel.display)
				panel.title.appendChild(document.createTextNode(panel.display));
			if (isChart) {
				panel.title.classList.add("chart-title");
				icons.classList.add("stx-chart-panel");
			}
		}
	
		if (!CIQ.touchDevice || CIQ.isSurface) this.makeModal(icons);
	
		if (panel.handle) {
			if (!CIQ.touchDevice || CIQ.isSurface)
				panel.handle.onmouseover = (function (self) {
					return function () {
						self.hideCrosshairs();
					};
				})(this);
			if (!CIQ.touchDevice || CIQ.isSurface)
				panel.handle.onmouseout = (function (self) {
					return function () {
						self.showCrosshairs();
					};
				})(this);
			var panelGrab = function (stx, panel) {
				return function (e) {
					if (CIQ.ChartEngine.resizingPanel || stx.openDialog !== "") return;
					stx.grabHandle(panel);
				};
			};
			// stxx.releaseHandle is called by the chart's touchend and mouseup handlers
			if (CIQ.isSurface) {
				panel.handle.onpointerdown = panelGrab(this, panel);
			} else {
				panel.handle.onmousedown = panelGrab(this, panel);
			}
			if (CIQ.touchDevice) panel.handle.ontouchstart = panelGrab(this, panel);
		}
	
		if (panel.up)
			CIQ.safeClickTouch(
				panel.up,
				(function (stx, panel) {
					return function () {
						stx.panelUp(panel);
					};
				})(this, panel)
			);
		if (panel.down)
			CIQ.safeClickTouch(
				panel.down,
				(function (stx, panel) {
					return function () {
						stx.panelDown(panel);
					};
				})(this, panel)
			);
		if (panel.solo)
			CIQ.safeClickTouch(
				panel.solo,
				(function (stx, panel) {
					return function () {
						stx.panelSolo(panel);
					};
				})(this, panel)
			);
		if (panel.close) {
			if (panel.name == "chart") {
				panel.close.style.display = "none"; // no close icon on primary chart
			} else {
				CIQ.safeClickTouch(
					panel.close,
					(function (stx, panel) {
						return function () {
							stx.panelClose(panel);
						};
					})(this, panel)
				);
			}
		}
	};
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Adds a panel with a prespecified percentage. This should be called iteratively when rebuilding a set
	 * of panels from a previous layout. Use {@link CIQ.ChartEngine.AdvancedInjectable#createPanel} when creating a new panel for an existing chart layout.
	 * @param  {string} display	  The display name for the panel
	 * @param  {string} name	  The name of the panel (usually the study ID)
	 * @param  {number} percent	  The percentage of chart to use
	 * @param  {string} [chartName] The chart to associate with this panel. Defaults to "chart".
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] {@link CIQ.ChartEngine.YAxis} object. If not present, the existing panel's axis will be used.
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias stackPanel
	 * @since 5.2.0 Added `yAxis` paremeter.
	 */
	CIQ.ChartEngine.prototype.stackPanel = function (
		display,
		name,
		percent,
		chartName,
		yAxis
	) {
		if (this.runPrepend("stackPanel", arguments)) return;
		if (!chartName) chartName = "chart";
		var chart = this.charts[chartName];
		var isChart = name == chartName;
		if (isChart) {
			display = chart.symbol;
			if (chart.symbolDisplay) display = chart.symbolDisplay;
			if (!yAxis) yAxis = chart.yAxis;
		}
		var panel = (this.panels[name] = new CIQ.ChartEngine.Panel(name, yAxis));
		if (!isChart && chart.yAxis && panel.yAxis.position == chart.yAxis.position) {
			panel.yAxis.width = chart.yAxis.width; // make it match the width of the main panel so the y axis align
		}
		if (isChart && !chart.panel) chart.panel = panel;
	
		panel.percent = percent;
		panel.chart = chart;
		panel.display = display;
		panel.holder = CIQ.newChild(this.container, "div", "stx-holder"); // the main holder extends to the edges of the panel
		panel.subholder = CIQ.newChild(panel.holder, "div", "stx-subholder"); // the sub holder does not include the axis area
		panel.subholder.style.zIndex = 1;
		panel.holder.panel = panel;
		var appendClass = isChart ? "stx-panel-chart" : "stx-panel-study";
		panel.holder.classList.add(appendClass);
	
		if (this.controls.handleTemplate && this.manageTouchAndMouse) {
			panel.handle = this.controls.handleTemplate.cloneNode(true);
			this.container.appendChild(panel.handle);
			//panel.handle.style.display=""; // let the drawPanels manage this otherwise if we set to "" here but the developer wants a picture (png) handle using CSS, the hande will flicker on on initial load on the top of the screen
			panel.handle.panel = panel;
		}
	
		if (this.controls.iconsTemplate) {
			panel.icons = this.controls.iconsTemplate.cloneNode(true);
			panel.subholder.appendChild(panel.icons);
			this.configurePanelControls(panel);
		}
	
		if (!this.currentlyImporting) this.resizeCanvas();
	
		this.runAppend("stackPanel", arguments);
	};
	
	CIQ.ChartEngine.prototype.setPanelEdit = function (panel, editFunction) {
		panel.editFunction = editFunction;
		if (panel.edit) CIQ.safeClickTouch(panel.edit, editFunction);
		this.adjustPanelPositions();
	};
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Draws the panels for the chart and chart studies. CSS style stx_panel_border can be modified to change the color
	 * or width of the panel dividers.
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias drawPanels
	 */
	CIQ.ChartEngine.prototype.drawPanels = function () {
		if (this.runPrepend("drawPanels", arguments)) return;
		var first = false;
		for (var p in this.panels) {
			var panel = this.panels[p];
			panel.state = {}; // reset the drawing state
	
			var textToDisplay = this.translateIf(panel.display);
			if (panel.title && panel.title.textContent != textToDisplay) {
				panel.title.innerHTML = "";
				panel.title.appendChild(document.createTextNode(textToDisplay));
			}
			if (panel.icons) panel.icons.classList.add("stx-show");
			if (panel.hidden) {
				if (panel.icons) panel.icons.classList.remove("stx-show");
				if (panel.handle) panel.handle.style.display = "none";
				panel.holder.style.display = "none";
				continue;
			} else {
				if (panel.name != "chart") {
					var manageTouchAndMouse = this.manageTouchAndMouse;
					if (panel.up)
						panel.up.style.display =
							this.displayIconsUpDown && manageTouchAndMouse ? "" : "none";
					if (panel.down)
						panel.down.style.display =
							this.displayIconsUpDown && manageTouchAndMouse ? "" : "none";
					if (panel.solo)
						panel.solo.style.display =
							this.displayIconsSolo && manageTouchAndMouse ? "" : "none";
					if (panel.close)
						panel.close.style.display =
							this.displayIconsClose && manageTouchAndMouse ? "" : "none";
					if (panel.edit)
						panel.edit.style.display =
							panel.editFunction && manageTouchAndMouse ? "" : "none";
				}
				panel.holder.style.display = "block";
			}
			if (panel.displayEdgeIfPadded) {
				var x = Math.round(panel.left) + 0.5,
					t = panel.yAxis.top - 0.5,
					b = panel.yAxis.bottom + 0.5;
				if (panel.yaxisCalculatedPaddingLeft && !panel.yaxisTotalWidthLeft)
					this.plotLine(
						x,
						x,
						t,
						b,
						this.canvasStyle("stx_grid_border"),
						"segment",
						this.chart.context,
						false,
						{ lineWidth: 1 }
					);
				x = Math.round(panel.right) + 0.5;
				if (panel.yaxisCalculatedPaddingRight && !panel.yaxisTotalWidthRight)
					this.plotLine(
						x,
						x,
						t,
						b,
						this.canvasStyle("stx_grid_border"),
						"segment",
						this.chart.context,
						false,
						{ lineWidth: 1 }
					);
			}
			if (!first) {
				if (panel.handle) panel.handle.style.display = "none";
				first = true;
				continue;
			}
			var y = panel.top;
			y = Math.round(y) + 0.5;
			this.plotLine(
				panel.left - 0.5,
				panel.right + 0.5,
				y,
				y,
				this.canvasStyle("stx_panel_border"),
				"segment",
				this.chart.context,
				false,
				{}
			);
			if (panel.handle) {
				if (!this.displayPanelResize) {
					panel.handle.style.display = "none";
				} else {
					panel.handle.style.display = "";
				}
				panel.handle.style.top = y - panel.handle.offsetHeight / 2 + "px";
				//panel.handle.style.left=panel.left+ "px";
			}
		}
		this.runAppend("drawPanels", arguments);
	};
	
	};
	
	
	let __js_core_engine_periodicity_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Determines whether the internal chart periodicity is based on a daily interval ("day", "week"
	 * or "month").
	 *
	 * **Note:** This function is intended to be used on the internal periodicity as stored in
	 * {@link CIQ.ChartEngine#layout}.
	 *
	 * @param {string} interval The internal chart periodicity for which the interval is determined.
	 * @return {boolean} True if the internal chart periodicity is a daily interval; otherwise, false.
	 *
	 * @memberof CIQ.ChartEngine
	 *
	 * @see <a href="CIQ.ChartEngine.html#layout%5B%60periodicity%60%5D">CIQ.ChartEngine.layout.periodicity</a>
	 * @see <a href="CIQ.ChartEngine.html#layout%5B%60interval%60%5D">CIQ.ChartEngine.layout.interval</a>
	 * @see <a href="CIQ.ChartEngine.html#layout%5B%60timeUnit%60%5D">CIQ.ChartEngine.layout.timeUnit</a>
	 */
	CIQ.ChartEngine.isDailyInterval = function (interval) {
		if (interval == "day") return true;
		if (interval == "week") return true;
		if (interval == "month") return true;
		return false;
	};
	
	/**
	 * Specifies the properties that define periodicity.
	 *
	 * Periodicity = `period` x `interval` expressed as `timeUnit`.
	 *
	 * Referenced as the type of the main parameter of {@link CIQ.ChartEngine#setPeriodicity}, the
	 * periodicity parameter of {@link CIQ.ChartEngine#loadChart}, and the return value of
	 * {@link CIQ.ChartEngine#getPeriodicity}.
	 *
	 * @typedef {object} CIQ.ChartEngine~PeriodicityParameters
	 * @property {number} period The number of elements from the data source to roll-up (aggregate)
	 * 		into a single data point, such as a candle on a candle chart. For example, `period=2`,
	 * 		`interval=5`, and `timeUnit="minute"` results in candles that represent 10-minute time
	 * 		spans.
	 * @property {string|number} [interval=1] The number of units of measure of the periodicity. For
	 * 		example, `interval=5` and `timeUnit="minute"` specify a periodicity of five minutes.
	 * 		The interval property enables the chart to fetch quotes in a roll-up state; for
	 * 		example, if the data source provides one-minute quotes, setting `interval=5` results
	 * 		in the chart fetching five one-minute quotes as a single data point.
	 * @property {string|null} [timeUnit="minute"] The unit of measure of the periodicity. Valid values
	 * 		include "millisecond", "second", "minute", "day", "week", "month", and "tick".
	 */
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Sets the data granularity (periodicity) and displays the resulting chart.
	 *
	 * Dispatches a "periodicity" event.
	 *
	 * If a quote feed has been attached to the chart (see {@link CIQ.ChartEngine#attachQuoteFeed}), it will be called to get the new data, otherwise this.dataCallback will
	 * be called in an effort to fetch new data. See {@link CIQ.ChartEngine#dataCallback}. If neither one is set and new data is needed, the function will fail.
	 *
	 * This function can be called together with `loadChart()` by setting the proper parameter values. See example in this section and {@link CIQ.ChartEngine#loadChart} for more details and compatibility with your current version.
	 *
	 * This function will not set how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan}.
	 *
	 * The kernel is capable of deriving weekly and monthly charts by rolling-up daily data. Set {@link CIQ.ChartEngine#dontRoll} to true to bypass this
	 * functionality if you have raw week and month data in the masterData.
	 *
	 * It is important to note that by default the weekly roll-ups start on Sunday unless a market definition exists to indicate Sunday is not a market day,
	 * then they are shifted to the next market day. Instructions to set a market for the chart can be found here: {@link CIQ.Market}
	 *
	 * A full tutorial on periodicity and roll-up can be found [here]{@tutorial Periodicity}.
	 *
	 * **See {@link CIQ.ChartEngine#createDataSet} for additional details on the roll-up process including important notes on rolling-up data with gaps.**
	 *
	 * **Note on 'tick' timeUnit:**<BR>
	 * When using 'tick', please note that this is not a time based display, as such, there is no way to predict what the time for the next tick will be.
	 * It can come a second later, a minute later or even more depending on how active a particular instrument may be.
	 * If using the future tick functionality ( {@link CIQ.ChartEngine.XAxis#futureTicks} ) when in 'tick' mode, the library uses a pre-defined number (  {@link CIQ.ChartEngine.XAxis#futureTicksInterval} )for deciding what time interval to use for future ticks.
	 * See below example on how to override this default.
	 *
	 * It is important to note that rollups for ‘ticks’ are based on **count** rather than time.
	 * <br>For example: `setPeriodicity({period:5, interval:1, timeUnit:"tick”})` will create a new bar every **5 ticks** rather than every **5 minutes**.
	 *
	 * Since many ticks can have the exact same timestamp, ticks never get replaced or augmented. As such, if a new tick is provided with a timestamp in the past, even if a record with the exact same date already exists, a new tick will be inserted to the masterData at the proper location rather than one replaced.
	 *
	 * Lastly, you cannot set an interval for `tick`; as that would not translate into a valid periodicity. If inadvertently set, the engine will "clean it up" (much the same way as if you tried `{period:1, interval:5, timeUnit:"day"}` ).
	 *
	 * **Note on internal periodicity storage:**<BR>
	 * The provided parameters will be translated into internal format and stored in the {@link CIQ.ChartEngine#layout} object.
	 * Internal format in the layout object **will not match the parameters** used in ​setPeriodicity.
	 * <br>Use {@link CIQ.ChartEngine#getPeriodicity} to extract internal periodicity into the expected external format.
	 *
	 * @example
	 * // each bar on the screen will represent 15 minutes (combining 15 1-minute bars from your server)
	 * stxx.setPeriodicity({period:15, timeUnit:"minute"}, function(err){});
	 *
	 * @example
	 * // each bar on the screen will represent 15 minutes (a single 15 minute bar from your server)
	 * stxx.setPeriodicity({period:1, timeUnit:"minute", interval:15}, function(err){});
	 *
	 * @example
	 * // each bar on the screen will represent 30 minutes formed by combining two 15-minute bars; each masterData element represening 15 minutes.
	 * stxx.setPeriodicity({period:2, timeUnit:"minute", interval:15}, function(err){});
	 *
	 * @example
	 * // each bar on the screen will represent 1 tick and no particular grouping will be done.
	 * stxx.setPeriodicity({period:1, timeUnit:"tick"}, function(err){});
	 *
	 * @example
	 * // each bar on the screen will represent 5 ticks (combining 5 tick objects from your server)
	 * stxx.setPeriodicity({period:5, timeUnit:"tick"}, function(err){});
	 *
	 * @example
	 * // each bar on the screen will represent 1 day. MasterData elements will represent one day each.
	 * stxx.setPeriodicity({period:1, timeUnit:"day"}, function(err){});
	 *
	 * @example
	 * // this sets the periodicity to 5 minute bars when loadChart is called
	 * stxx.loadChart(newSymbol, {
	 * 	// this parameter will cause loadChart to call setSpan with these parameters
	 * 	span: {base: 'day', multiplier: 2},
	 * 	// this parameter will cause loadChart to call setPeriodicity with these parameters
	 * 	periodicity: {period: 1, timeUnit: "minute", interval: 5}
	 * }, finishedLoadingChart(stxx.chart.symbol, newSymbol));
	 *
	 * @example
	 * //How to override stxx.chart.xAxis.futureTicksInterval when in 'tick' mode:
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.chart.xAxis.futureTicksInterval=1; // to set to 1 minute, for example
	 *
	 * @param {CIQ.ChartEngine~PeriodicityParameters} params periodicity arguments
	 * @param {number} params.period The number of elements from masterData to roll-up together into one data point on the chart (candle,bar, etc). If set to 30 in a candle chart, for example, each candle will represent 30 raw elements of `interval/timeUnit` type.
	 * @param {number} [params.interval] Further qualifies pre-rolled details of intra-day `timeUnits` ("millisecond","second","minute") and will be converted to “1” if used with "day", "week" or  "month" 'timeUnit'. Some feeds provide data that is already rolled up. For example, there may be a feed that provides 5 minute bars. To let the chart know you want that 5-minute bar from your feed instead of having the chart get individual 1 minute bars and roll them up, you would set the `interval` to '5' and `timeUnit` to 'minute'
	 * @param {string} [params.timeUnit] Type of data requested. Valid values are "millisecond","second","minute","day","week", "month" or 'tick'. If not set, will default to "minute". **"hour" is NOT a valid timeUnit. Use `timeUnit:"minute", interval:60` instead**
	 * @param {function} [cb] Callback after periodicity is changed. First parameter of callback will be null unless there was an error.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 3.0.0 Replaces {@link CIQ.ChartEngine#setPeriodicityV2}.
	 * - 4.0.0 Now uses {@link CIQ.ChartEngine#needDifferentData} to determine if new data should be fetched.
	 * - 6.3.0 Now only homes chart if new data was fetched.
	 * - 8.1.0 Dispatches a "periodicity" event. See also
	 * 		[periodicityEventListener]{@link CIQ.ChartEngine~periodicityEventListener}.
	 */
	CIQ.ChartEngine.prototype.setPeriodicity = function (params, cb) {
		if (this.runPrepend("setPeriodicity", arguments)) return;
	
		if (typeof arguments[0] !== "object") {
			params = {
				period: arguments[0],
				interval: arguments[1],
				timeUnit: arguments[2]
			};
			cb = arguments[arguments.length - 1];
			if (arguments.length === 3) params.timeUnit = undefined;
		}
	
		let { period, interval, timeUnit } = params;
		if (typeof cb !== "function") cb = null;
	
		({ period, interval, timeUnit } = CIQ.cleanPeriodicity(
			period,
			interval,
			timeUnit
		));
	
		let { layout } = this;
		layout.setSpan = {}; // No longer in a span if we've set a specific periodicity
		layout.range = {}; // No longer in a range if we've set a specific periodicity
	
		this.chart.inflectionPoint = null; // reset where the consolidation occurs from
		let getDifferentData = false;
	
		if (this.chart.symbol) {
			getDifferentData = this.needDifferentData({
				period: period,
				interval: interval,
				timeUnit: timeUnit
			});
		}
	
		let {
			candleWidth: cw,
			periodicity: prvPeriodicity,
			interval: prvInterval,
			timeUnit: prvTimeUnit
		} = layout;
		let prevPeriodicity = { prvPeriodicity, prvInterval, prvTimeUnit };
	
		layout.periodicity = period;
		layout.interval = interval;
		layout.timeUnit = timeUnit;
	
		const self = this;
		let dispatchData = {
			stx: self,
			differentData: getDifferentData,
			prevPeriodicity
		};
		function onComplete() {
			self.dispatch("periodicity", dispatchData);
			if (cb) cb(null);
		}
	
		if (getDifferentData) {
			this.changeOccurred("layout");
			this.clearCurrentMarketData();
			if (this.quoteDriver) {
				for (let c in this.charts) {
					let thisChart = this.charts[c];
					if (thisChart.symbol) {
						if (this.displayInitialized) {
							this.quoteDriver.newChart(
								{
									symbol: thisChart.symbol,
									symbolObject: thisChart.symbolObject,
									chart: thisChart
								},
								onComplete
							);
						} else {
							this.loadChart(thisChart.symbol, { chart: thisChart }, onComplete);
						}
					}
				}
			} else if (this.dataCallback) {
				this.dataCallback();
				onComplete();
			} else {
				console.log(
					"cannot change periodicity because neither dataCallback or quoteDriver are set"
				);
			}
			this.home();
			return;
		}
	
		for (let chartName in this.charts) {
			let chart = this.charts[chartName];
			let { dataSegment, dataSet, maxTicks, scroll } = chart;
			let dataSegmentLength = dataSegment ? dataSegment.length : 0,
				dataSetLength = dataSet ? dataSet.length : 0;
			let dt;
			let pos = Math.round(chart.maxTicks / 2);
			this.setCandleWidth(cw, chart);
			let centerMe = true,
				rightAligned = false;
			if (scroll <= maxTicks)
				// don't attempt to center the chart if we're scrolled into the future
				centerMe = false;
			else if (dataSegment && !dataSegment[pos]) {
				// don't attempt to center the chart if we're scrolled into the past
				centerMe = false;
				rightAligned = scroll - dataSetLength; // We'll use this to keep the same amount of right alignment
			}
	
			if (centerMe && dataSegmentLength > 0) {
				if (maxTicks < (Math.round(this.chart.width / cw - 0.499) - 1) / 2) {
					pos = dataSegmentLength - 1;
				}
				if (pos >= dataSegmentLength) {
					dt = dataSegment[dataSegmentLength - 1].DT;
					pos = dataSegmentLength - 1;
				} else {
					dt = dataSegment[pos].DT;
				}
			}
	
			this.createDataSet();
	
			if (centerMe) {
				// If we're scrolled somewhere into the middle of the chart then we will keep the chart centered as we increase or decrease periodicity
				if (dataSegmentLength > 0) {
					for (let i = dataSetLength - 1; i >= 0; i--) {
						let nd = dataSet[i].DT;
						if (nd.getTime() < dt.getTime()) {
							chart.scroll = dataSetLength - 1 - i + pos;
							break;
						}
					}
				}
			} else if (!rightAligned) {
				let wsInTicks = Math.round(this.preferences.whitespace / cw);
				chart.scroll = maxTicks - wsInTicks - 1; // Maintain the same amount of left alignment
			} else {
				chart.scroll = dataSet.length + rightAligned; // Maintain the same amount of right alignment
			}
		}
	
		if (this.displayInitialized) this.draw();
		this.changeOccurred("layout");
	
		if (this.quoteDriver) {
			for (let chartName in this.charts) {
				let chart = this.charts[chartName];
				if (chart.symbol && (chart.moreAvailable || !chart.upToDate)) {
					this.quoteDriver.checkLoadMore(chart);
				}
			}
		}
		//this.home();  // let centerMe do its thing
		onComplete();
		this.runAppend("setPeriodicity", arguments);
	};
	
	/**
	 * Returns true if the chart needs new data to conform with the new periodicity.
	 * @param {object} newPeriodicity			newPeriodicity. See {@link CIQ.ChartEngine#setPeriodicity}
	 * @param {number} newPeriodicity.period 	`period` as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @param {string} newPeriodicity.interval 	`interval` as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @param {string} newPeriodicity.timeUnit 	`timeUnit` as required by {@link CIQ.ChartEngine#setPeriodicity}
	 * @return {boolean} True if the cart needs data in a new periodicity
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.needDifferentData = function (newPeriodicity) {
		var layout = this.layout;
		var isDaily = CIQ.ChartEngine.isDailyInterval(newPeriodicity.interval),
			wasDaily = CIQ.ChartEngine.isDailyInterval(layout.interval);
		var getDifferentData = false;
	
		if (this.dontRoll || !wasDaily) {
			// we are not rolling so monthly and weekly are not the same as daily or any of the intraday... so simply check for different interval.
			if (layout.interval != newPeriodicity.interval) getDifferentData = true;
		} else {
			//we are rolling weeekly and monthly and wasn't intraday mode...so check to see if we an still use daily data for the new periodicity
			if (isDaily != wasDaily) getDifferentData = true;
		}
	
		// safety check to deal with defaults.
		if (!isDaily && !newPeriodicity.timeUnit) newPeriodicity.timeUnit = "minute";
		if (!wasDaily && !layout.timeUnit) layout.timeUnit = "minute";
	
		if (newPeriodicity.timeUnit != layout.timeUnit) getDifferentData = true; // !!! Do not change to !==
	
		if (!this.masterData || !this.masterData.length) getDifferentData = true; // always fetch if no data
	
		return getDifferentData;
	};
	
	/**
	 * Returns the current periodicity of the chart in the format required by
	 * {@link CIQ.ChartEngine#setPeriodicity}.
	 *
	 * @returns {CIQ.ChartEngine~PeriodicityParameters} An object literal containing the properties
	 * that define the periodicity: `period`, `interval`, and `timeUnit`; for example,<br>
	 * `{period: 2, interval: 5, timeUnit: "minute"}`.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 7.5.0
	 *
	 * @see [Periodicity Tutorial]{@tutorial Periodicity}
	 */
	CIQ.ChartEngine.prototype.getPeriodicity = function () {
		var layout = this.layout;
		var interval = layout.interval,
			timeUnit = layout.timeUnit;
	
		if (!timeUnit) {
			timeUnit = interval;
			interval = 1;
		}
	
		return { period: layout.periodicity, interval: interval, timeUnit: timeUnit };
	};
	
	};
	
	
	let __js_core_engine_record_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Based on the standardMarketIterator and the last entry of masterData, determines whether the chart contains data up till the current iterators next tick.
	 *
	 * For efficiency once {@link CIQ.ChartEngine.isHistoricalMode} is set to false, this will always return false.
	 * @return {boolean} True if viewing historical mode
	 * @since 6.0.0
	 * @private
	 */
	CIQ.ChartEngine.prototype.isHistoricalMode = function () {
		var dateNow = new Date(),
			historic = true,
			masterData = this.masterData;
		if (!this.isHistoricalModeSet) {
			return false;
		}
		if (masterData.length) {
			var lastDate = this.getFirstLastDataRecord(masterData, "DT", true);
			var iter = this.standardMarketIterator(lastDate.DT);
			historic = (iter ? iter.next() : lastDate.DT) <= dateNow;
	
			// special case: daily chart, market has not opened yet today
			// historic would always be set even though we have all the data
			if (historic && CIQ.ChartEngine.isDailyInterval(iter.interval)) {
				var open = this.chart.market.getOpen();
				if (open && dateNow < open) {
					dateNow.setHours(0, 0, 0, 0);
					if (+dateNow == +iter.begin) historic = false;
				}
			}
		}
		return historic;
	};
	
	/**
	 * Whether the chart is scrolled to a home position.
	 *
	 * @returns {boolean} true when the scroll position shows the last tick of the dataSet
	 * @memberof CIQ.ChartEngine
	 * @since 2016-06-21
	 */
	CIQ.ChartEngine.prototype.isHome = function () {
		var chart = this.chart,
			dataSet = chart.dataSet,
			animating = chart.animatingHorizontalScroll;
		return (
			this.pixelFromTick(dataSet.length - (animating ? 2 : 1), chart) <
			chart.width + chart.panel.left
		);
		//return ((this.chart.scroll-1)*this.layout.candleWidth)+this.micropixels<=this.chart.width+1;
	};
	
	/**
	 * Finds the previous element before dataSegment[bar] in the dataSet which has data for field
	 * @param {CIQ.ChartEngine.Chart} chart An instance of {@link CIQ.ChartEngine.Chart}
	 * @param {string} field The field to check for data
	 * @param {number} bar The index into the dataSegment
	 * @return {object} dataSet element which has data
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.getPreviousBar = function (chart, field, bar) {
		return this.getNextBarInternal(chart, field, bar, -1);
	};
	
	/**
	 * Finds the next element after dataSegment[bar] in the dataSet which has data for field
	 * @param {CIQ.ChartEngine.Chart} chart An instance of {@link CIQ.ChartEngine.Chart}
	 * @param {string} field The field to check for data
	 * @param {number} bar The index into the dataSegment
	 * @return {object} dataSet element which has data
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 */
	CIQ.ChartEngine.prototype.getNextBar = function (chart, field, bar) {
		return this.getNextBarInternal(chart, field, bar, 1);
	};
	
	/**
	 * @param {CIQ.ChartEngine.Chart} chart An instance of {@link CIQ.ChartEngine.Chart}
	 * @param {string} field The field to check for data
	 * @param {number} bar The index into the dataSegment
	 * @param {number} direction 1 or -1, for next or previous
	 * @return {object} dataSet element which has data
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0
	 * @private
	 */
	CIQ.ChartEngine.prototype.getNextBarInternal = function (
		chart,
		field,
		bar,
		direction
	) {
		var seg = chart.dataSegment && chart.dataSegment[bar];
		if (seg) {
			var tick = seg.tick;
			while (tick > 0 && tick < chart.dataSet.length) {
				tick = tick + direction;
				var ds = chart.dataSet[tick];
				if (ds) {
					var tuple = CIQ.existsInObjectChain(ds, field);
					if (tuple && tuple.obj[tuple.member]) return ds;
				}
			}
		}
		return null;
	};
	
	/**
	 * Returns the first or last record in a quotes array (e.g. masterData, dataSet) containing the requested field.
	 * If no record is found, will return null
	 * @param  {array} data	  quotes array in which to search
	 * @param  {string} field	  field to search for
	 * @param  {boolean} [last] Switch to reverse direction; default is to find the first record.  Set to true to find the last record.
	 * @return {object} The found record, or null if not found
	 * @memberof CIQ.ChartEngine
	 * @since 5.2.0
	 */
	CIQ.ChartEngine.prototype.getFirstLastDataRecord = function (
		data,
		field,
		last
	) {
		if (data && data.length) {
			var c = last ? data.length - 1 : 0;
			while (c >= 0 && c < data.length) {
				if (data[c] && typeof data[c][field] != "undefined") {
					return data[c];
				}
				if (last) c--;
				else c++;
			}
		}
		return null;
	};
	
	/**
	 * Returns the tick position of the leftmost position on the chart.
	 * @return {number} The tick for the leftmost position
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.leftTick = function () {
		return this.chart.dataSet.length - this.chart.scroll;
	};
	
	/**
	 * Convenience function returns the next or previous interval from the provided date-time at the current chart's periodicity.
	 * See {@link CIQ.Market} and {@link CIQ.Market.Iterator} for more details.
	 *
	 * For 'tick' intervals, since there is no predictable periodicity, the next interval will be determined by {@link CIQ.ChartEngine.XAxis#futureTicksInterval}
	 * @param  {date}		DT			A JavaScript Date representing the base time for the request in {@link CIQ.ChartEngine#dataZone} timezone.
	 * @param {number}		[period]		The number of periods to jump. Defaults to 1. Can be negative to go back in time.
	 * @param {boolean}		[useDataZone=true] By default the next interval will be returned in {@link CIQ.ChartEngine#dataZone}. Set to false to receive a date in {@link CIQ.ChartEngine#displayZone} instead.
	 * @return {date}	 The next interval date
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.getNextInterval = function (DT, period, useDataZone) {
		if (!period) period = 1;
		if (useDataZone !== false) useDataZone = true;
	
		var iter = this.standardMarketIterator(
			DT,
			useDataZone ? this.dataZone : this.displayZone
		);
		if (!iter) return DT; //  cannot find so just return input date
		if (period < 1) {
			return iter.previous(period * -1);
		}
		return iter.next(period);
	};
	
	/**
	 * Convenience function returns a new market iterator at the current chart's periodicity.
	 * For 'tick' intervals, since there is no predictable periodicity, the iterator interval will be determined by {@link CIQ.ChartEngine.XAxis#futureTicksInterval}
	 * See {@link CIQ.Market} and {@link CIQ.Market.Iterator} for more details.
	 * @param {date}		begin A JavaScript Date representing the iterator begin date in {@link CIQ.ChartEngine#dataZone} timezone. See {@link CIQ.Market#newIterator} for details.
	 * @param {string} 		[outZone] A valid timezone from the timeZoneData.js library. This should represent the time zone for the returned date. Defaults {@link CIQ.ChartEngine#dataZone}. See {@link CIQ.Market#newIterator} for details.
	 * @param {CIQ.ChartEngine.Chart} 	[chart] The chart object.
	 * @return {object} A new iterator.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.standardMarketIterator = function (
		begin,
		outZone,
		chart
	) {
		var cht = chart || this.chart;
		if (!cht.market) return null;
		var iter_parms = {
			begin: begin,
			interval: this.layout.interval,
			periodicity:
				this.layout.interval == "tick"
					? this.chart.xAxis.futureTicksInterval
					: this.layout.periodicity,
			timeUnit: this.layout.timeUnit,
			outZone: outZone
		};
		return cht.market.newIterator(iter_parms);
	};
	
	};
	
	
	let __js_core_engine_render_ = (_exports) => {
	
	
	if (!_exports.SplinePlotter) _exports.SplinePlotter = {};
	var CIQ = _exports.CIQ,
		splinePlotter = _exports.SplinePlotter;
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * This is the main rendering function in the animation loop. It draws the chart including panels, axis, and drawings.
	 * This method is called continually as a user pans or zooms the chart.
	 * This would be a typical place to put an injection to add behavior to the chart after a drawing operation is complete.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.draw = function () {
		this.debug();
		var chart = this.chart,
			layout = this.layout;
		if (!chart.canvas) return;
		if (!chart.dataSet) return;
		if (!chart.canvasHeight) return;
		//if(!this.useAnimation && new Date()-this.grossDragging<500) return;
	
		this.offset = (layout.candleWidth * this.candleWidthPercent) / 2;
		CIQ.clearCanvas(chart.canvas, this);
		if (!this.masterData) return;
	
		if (this.runPrepend("draw", arguments)) return;
		if (!this.defaultColor) this.getDefaultColor();
	
		this.vectorsShowing = false;
	
		this.drawPanels();
		this.yAxisLabels = [];
		var i, plugin;
	
		this.correctIfOffEdge();
		this.createDataSegment();
		this.setBaselines(chart);
		var axisRepresentation = this.createXAxis(chart);
		this.initializeDisplay(chart);
		this.drawXAxis(chart, axisRepresentation);
		try {
			this.renderYAxis(chart);
		} catch (e) {
			if (e && e.message === "reboot draw") {
				return this.draw();
			}
			throw e;
		}
	
		/// Calculate tmpWidth which represents the amount of width that the candle takes, slightly less than candleWidth
		chart.tmpWidth = Math.floor(layout.candleWidth * this.candleWidthPercent); // So we don't need to compute it a thousand times for every candle
		if (chart.tmpWidth % 2 === 0) {
			// assure that candles are always odd number of pixels wide
			chart.tmpWidth += 1;
			if (chart.tmpWidth > layout.candleWidth)
				// If there isn't space then reduce further
				chart.tmpWidth -= 2;
		}
		if (chart.tmpWidth < 0.5) chart.tmpWidth = 0.5;
	
		for (i in this.plugins) {
			plugin = this.plugins[i];
			if (plugin.display) {
				if (plugin.drawUnder) plugin.drawUnder(this, chart);
			}
		}
	
		if (chart.legend) chart.legend.colorMap = null;
		if (this.controls.baselineHandle)
			this.controls.baselineHandle.style.display = "none";
	
		this.rendererAction(chart, "underlay");
		CIQ.getFn("Studies.displayStudies")(this, chart, true);
		this.displayChart(chart);
		CIQ.getFn("Studies.displayStudies")(this, chart, false);
		this.rendererAction(chart, "overlay");
	
		if (chart.legend && chart.legend.colorMap && chart.legendRenderer) {
			chart.legendRenderer(this, {
				chart: chart,
				legendColorMap: chart.legend.colorMap,
				coordinates: {
					x: chart.legend.x,
					y: chart.legend.y + chart.panel.yAxis.top
				}
			});
		}
	
		for (i in this.plugins) {
			plugin = this.plugins[i];
			if (plugin.display) {
				if (plugin.drawOver) plugin.drawOver(this, chart);
			}
		}
	
		// Do this after all the drawing has taken place. That way the y-axis text sits on top of anything that
		// has been drawn underneath. For instance, if panel.yaxisCalculatedPaddingRight>0 and the y-axis sits on top of the chart
		for (var panel in this.panels) {
			if (!this.panels[panel].hidden) this.plotYAxisText(this.panels[panel]);
		}
		for (var yLbl = 0; yLbl < this.yAxisLabels.length; yLbl++) {
			var labelParams = this.yAxisLabels[yLbl];
			if (
				labelParams.src == "series" &&
				labelParams.args[6] &&
				labelParams.args[6].drawSeriesPriceLabels === false
			)
				continue;
			this.createYAxisLabel.apply(this, labelParams.args);
		}
		if (this.createCrosshairs) this.createCrosshairs();
		if (this.drawVectors) this.drawVectors();
		this.drawCurrentHR();
		this.displayInitialized = true;
		var controls = this.controls;
		if (controls) {
			var showControls =
				this.manageTouchAndMouse &&
				(!this.mainSeriesRenderer || !this.mainSeriesRenderer.nonInteractive);
			if (controls.home)
				controls.home.style.display =
					showControls && !this.isHome() ? "block" : "none";
			if (controls.chartControls)
				controls.chartControls.style.display = showControls ? "block" : "none";
		}
		if (CIQ.Marker) this.positionMarkers();
		if (this.quoteDriver && this.animations.zoom.hasCompleted) {
			this.quoteDriver.checkLoadMore(chart);
		}
		this.runAppend("draw", arguments);
		this.makeAsyncCallbacks();
	};
	
	/**
	 * Adds a series renderer to the chart. A series renderer manages a group of series that are
	 * rendered on the chart in the same manner. For instance, several series which are part of the
	 * same stacked histogram:
	 *
	 * <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top"
	 *     style="float:top"
	 *     src="https://jsfiddle.net/chartiq/rb423n71/embedded/result,js,html/"
	 *     allowfullscreen="allowfullscreen" frameborder="1">
	 * </iframe>
	 *
	 * You must manage the persistency of a renderer and remove individual series
	 * ({@link CIQ.Renderer#removeSeries}), remove all series ({@link CIQ.Renderer#removeAllSeries}),
	 * or even delete the renderer ({@link CIQ.ChartEngine#removeSeriesRenderer}) as needed by your
	 * application.
	 *
	 * **Note:** Once a renderer is set for a chart, it remains loaded with its series definitions
	 * and y-axis (if one is used) even if a new symbol is loaded. Calling `setSeriesRenderer` again
	 * with the same renderer name just returns the previously created renderer. **Be careful not to
	 * send a different y&#8209;axis object unless you have deleted the previous one by completely
	 * removing all of its associated series** (see {@link CIQ.Renderer#removeAllSeries}). Failure to
	 * do this will cause multiple axes to be displayed, causing the original one to become orphaned.
	 *
	 * @param {CIQ.Renderer} renderer The series renderer to add to the chart.
	 * @return {CIQ.Renderer} The renderer added to the chart by this function or, if the chart
	 * 		already has a renderer of the same name, a reference to that renderer.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 07/01/2015
	 *
	 * @see {@link CIQ.Renderer}
	 * @see {@link CIQ.ChartEngine#removeSeriesRenderer} for release functionality
	 * @see {@link CIQ.ChartEngine#addSeries} for additional implementation examples
	 *
	 * @example
	 * // Group the series together and select "line" as the rendering type to display the series.
	 * const mdataRenderer = stxx
	 *     .setSeriesRenderer(
	 *         new CIQ.Renderer.Lines({
	 *             params: {
	 *                 name: "My Line Series",
	 *                 type: "line",
	 *                 width: 4,
	 *                 callback: mdataLegend
	 *             }
	 *          })
	 *     )
	 *     .removeAllSeries()
	 *     .attachSeries(symbol1, { color: "red", permanent: true })
	 *     .attachSeries(symbol2, "blue")
	 *     .attachSeries(symbol3, "yellow")
	 *     .ready()
	 */
	CIQ.ChartEngine.prototype.setSeriesRenderer = function (renderer) {
		const { baseline, name, panel, yAxis } = renderer.params;
		if (this.chart.seriesRenderers[name]) {
			return this.chart.seriesRenderers[name]; // renderer already created
		}
	
		if (yAxis) {
			renderer.params.yAxis = this.addYAxis(this.panels[panel], yAxis);
			this.resizeChart();
		}
		renderer.stx = this;
	
		this.chart.seriesRenderers[name] = renderer;
	
		if (baseline) this.registerBaselineToHelper(renderer);
	
		return renderer;
	};
	
	/** Sets a renderer for the main chart.  This is done by parsing the layout.chartType and layout.aggregationType and creating the renderer which will support those settings.
	 * @param {boolean} eraseData Set to true to erase any existing series data
	 * @memberOf  CIQ.ChartEngine
	 * @since 5.1.0
	 */
	CIQ.ChartEngine.prototype.setMainSeriesRenderer = function (eraseData) {
		let { chartType, aggregationType } = this.layout;
		const { chart } = this;
		const { custom } = chart;
		let r = this.mainSeriesRenderer;
	
		let displayInitialized = this.displayInitialized;
		if (r) {
			if (eraseData) this.setMasterData();
			this.displayInitialized = false; // prevent redraws while series is not attached to main renderer
			r.removeAllSeries();
			this.removeSeriesRenderer(r);
			r = this.mainSeriesRenderer = null;
		}
	
		if (custom && custom.chartType) chartType = custom.chartType;
		if (chartType == "none") return; // no renderer and no default lines renderer
		if (aggregationType && aggregationType != "ohlc") chartType = aggregationType;
		const renderer = CIQ.Renderer.produce(chartType, {
			panel: chart.panel.name,
			name: "_main_series",
			highlightable: false,
			useChartLegend: true
		});
		if (renderer) {
			this.setSeriesRenderer(renderer).attachSeries(null, {
				display: chart.symbol
			});
			r = this.mainSeriesRenderer = renderer;
		}
	
		this.displayInitialized = displayInitialized;
		// Convenience access
		["highLowBars", "standaloneBars", "barsHaveWidth"].forEach(
			function (p) {
				chart[p] = this.mainSeriesRenderer && this.mainSeriesRenderer[p];
			}.bind(this)
		);
	};
	
	/**
	 * Detaches a series renderer from the chart and deletes its associated y-axis if no longer used by any other renderer.
	 *
	 * Note: the actual series and related data are not deleted with this command and can be attached or continue to be used with other renderers.
	 *
	 * Note: the actual renderer (created by using new `CIQ.Renderer.xxxxx`) is not deleted but simply detached from the chart. You can re-attach it again if needed.
	 * To delete the renderer use `delete myRenderer`. See example in {@link CIQ.Renderer.Lines}
	 *
	 * @param  {object} renderer The actual renderer instance to be removed
	 * @memberof CIQ.ChartEngine
	 * @since 07/01/2015
	 */
	CIQ.ChartEngine.prototype.removeSeriesRenderer = function (renderer) {
		const { baseline, name } = renderer.params;
		const handle = this.controls[`${name} baseline-handle`];
		if (baseline) {
			this.removeBaselineFromHelper(renderer);
			if (handle) {
				this.container.removeChild(handle);
				delete this.controls[handle];
			}
		}
		delete this.chart.seriesRenderers[name];
	};
	
	/**
	 * Retrieves a series renderer from the chart
	 * @param  {string} name Handle to access the renderer (params.name)
	 * @return {object} the matching series renderer if found
	 * @memberof CIQ.ChartEngine
	 * @since 07/01/2015
	 */
	CIQ.ChartEngine.prototype.getSeriesRenderer = function (name) {
		return this.chart.seriesRenderers[name];
	};
	
	/**
	 * Returns the first renderer found that contains a series, or null if not found.
	 *
	 * @param {string} seriesId ID of the series to find.
	 * @return {object} The matching series renderer if found.
	 * @memberof CIQ.ChartEngine
	 * @since 7.3.0
	 */
	CIQ.ChartEngine.prototype.getRendererFromSeries = function (seriesId) {
		var renderers = this.chart.seriesRenderers;
		for (var r in renderers) {
			for (var s in renderers[r].seriesParams) {
				if (renderers[r].seriesParams[s].id == seriesId) return renderers[r];
			}
		}
		return null;
	};
	
	/**
	 * Initializes boundary clipping on the requested panel. Use this when you are drawing on the canvas and wish for the
	 * drawing to be contained within the panel. You must call {@link CIQ.ChartEngine#endClip} when your drawing functions are complete.
	 * @param  {string} [panelName] The name of the panel. Defaults to the chart itself.
	 * @param {boolean} [allowYAxis=false] If true then the clipping region will include the y-axis. By default the clipping region ends at the y-axis.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.startClip = function (panelName, allowYAxis) {
		if (!panelName) panelName = this.chart.panel.name;
		var panel = this.panels[panelName];
		var yAxis = panel.yAxis;
		var chart = this.chart;
		chart.context.save();
		chart.context.beginPath();
		var left = panel.left;
		var width = panel.width;
		if (allowYAxis) {
			left = 0;
			width = this.width;
		} else if (panel.yaxisLHS && panel.yaxisLHS.length) {
			left++;
			width--;
		}
		chart.context.rect(left, yAxis.top, width, yAxis.height);
		chart.context.clip();
	};
	
	/**
	 * Completes a bounded clipping operation. See {@link CIQ.ChartEngine#startClip}.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.endClip = function () {
		this.chart.context.restore();
	};
	
	/**
	 * Sets the line style for the main chart.
	 *
	 * Applies to the {@link CIQ.Renderer.Lines} renderer only.
	 *
	 * @param {object|string} [obj] Parameters object or color string (see `obj.color`).
	 * @param {string} [obj.color] A color to use for the line plot. Must be an RGB, RGBA, or three-
	 * 		or six&#8209;digit hexadecimal color number or
	 * 		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value" target="_blank">
	 * 		CSS color keyword</a>; for example, "rgb(0, 255, 0)", "rgba(0, 255, 0, 0.5),
	 * 		"#0f0", "#00FF00", or "green". Alternatively, `obj` can be set to a color string directly
	 * 		if no other parameters are needed.
	 * @param {number[]|string} [obj.pattern] Pattern to use as an alternative to a solid line for the
	 * 		line plot. Valid string values are "solid", "dotted" and "dashed". Arrays specify the
	 * 		sequence of drawn pixels and blank pixels as alternating elements starting at index 0; for
	 * 		example, [1, 2, 3, 2] specifies a line containing one drawn pixel followed by two blank
	 * 		pixels followed by three drawn pixels followed by two more blank pixels, then the pattern
	 * 		repeats.
	 * @param {number} [obj.width] Width of the line plot.
	 * @param {string} [obj.baseColor] Color to use for the base of a mountain chart. Must be an RGB,
	 * 		RGBA, or three- or six&#8209;digit hexadecimal color number or CSS color keyword (see
	 * 		`obj.color`).
	 * @param {CIQ.ChartEngine.Chart|CIQ.Studies.StudyDescriptor} [target=this.chart] Target to which
	 * 		the line style is attached.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0
	 * - 8.2.0 Added `obj.baseColor` parameter.
	 *
	 * @example <caption>Set the line color, pattern, and width.</caption>
	 * stxx.setLineStyle({ color: "rgb(127, 127, 127)", pattern: "dashed", width: 3 });
	 *
	 * @example <caption>Set the line color using a color keyword.</caption>
	 * stxx.setLineStyle("blue");
	 */
	CIQ.ChartEngine.prototype.setLineStyle = function (obj, target) {
		var res = {};
		if (obj && typeof obj == "object") {
			res = obj;
		} else {
			res.color = obj;
		}
		if (!res.color && !res.pattern && !res.width && !res.baseColor) res = null;
		if (!target) target = this.chart;
		var width = 1;
		if (res && res.width) width = res.width;
		if (res && res.pattern)
			res.pattern = CIQ.borderPatternToArray(width, res.pattern);
		target.lineStyle = res;
	};
	
	/**
	 * Sets the style for 'gap-filling'.
	 *
	 * A gap is an area on a line type rendering ( mountain, baseline, step, etc) where the value for the plotted field is null, undefined, or missing.
	 *
	 * This method can be used to instruct the chart how to fill gaps created on the chart when missing data is present in series.
	 * Creates a gap filling style object for lines which can be used with any API call requiring a gap object.
	 * It can be used as a general style for the entire chart, as way to configure just the primary series, or when adding series with {@link CIQ.ChartEngine#addSeries}
	 *
	 * The gap object, called `gaplines` will be attached to the `target` passed in, or will set the the primary chart's gap style if to target is provided.
	 * Valid styles include a boolean, a color string, or an object containing color and pattern information.
	 *
	 * When passing in a boolean value:
	 * - `true` will indicate that the target object should continue to draw lines over the gaps in your chart.
	 * - `false` will indicate that the target object should treat the color as transparent, and not draw lines over the gaps.
	 *
	 * It is important to note that this is NOT the same as filling the missing values with actual data. It merely describes how the chart displays the gaps.
	 *
	 * This should be used instead of setting {@link CIQ.ChartEngine.Chart#gaplines} directly.
	 *
	 * A gap is an area on a line type rendering ( mountain, baseline, step, etc) where the value for the plotted field is null, undefined, or missing.
	 * @param  {object} [obj|boolean|string]	Value for gap lines.
	 * @param {string} [obj.color] A color on the canvas palette to use for gap plot. Alternatively, obj may be set to the color string directly if no other parameters are needed.
	 * @param {array} [obj.pattern] Pattern to use as alternative to solid line for gap plot, in array format, e.g. [1,2,3,2].
	 * @param {number} [obj.width] Line width for gap plot, in pixels
	 * @param {boolean} [obj.fillMountain] Set to true to fill the gaps in a mountain chart with the gap color.  Otherwise the mountain chart is filled in with its default color.
	 * @param  {object} [target=this.chart] Target to attach `gaplines` object to.  If none provided it defaults to CIQ.ChartEngine.Chart.
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0
	 * - 6.2.3 Now accepts any valid parameter of `chart.gaplines` (boolean, color string, or color object).
	 * @example
	 * // shorthand if just setting a color as the the default style for the chart gaps
	 * stxx.setGapLines("blue");
	 * @example
	 * // the following will set stxx.chart.gaplines with color, pattern and width for the chart gaps
	 * stxx.setGapLines({color:"transparent",pattern:[1,2],width:3,fillMountain:true});
	 * @example
	 * // the following will set objectTarget.gaplines
	 * stxx.setGapLines({color:"transparent",pattern:[1,2],width:3,fillMountain:true,target:objectTarget});
	 * @example
	 * // shorthand for setting gaps to transparent
	 * stxx.setGapLines(false)
	 *
	 * // shorthand for setting gaps to the color of your line or mountain chart
	 * stxx.setGapLines(true)
	 *
	 */
	CIQ.ChartEngine.prototype.setGapLines = function (obj, target) {
		if (!target) target = this.chart;
		var res = {};
		if (obj && typeof obj == "object") {
			res = obj;
		} else if (typeof obj === "boolean") {
			return (target.gaplines = obj);
		} else {
			res.color = obj;
		}
		if (!res.color && !res.pattern && !res.fillMountain) res = null;
		if (res && res.pattern)
			res.pattern = CIQ.borderPatternToArray(res.width, res.pattern);
		if (res && res.width <= 0) res.width = null;
		target.gaplines = res;
	};
	
	/**
	 * An object that describes how the renderer should draw a specific part of the chart as
	 * generated and returned by {@link CIQ.ChartEngine~colorFunction}.
	 *
	 * @typedef {object} CIQ.ChartEngine~colorObject
	 * @property {string} color Any string value that can be interpreted by the canvas context.
	 * @property {Array} pattern Description of the pattern in an on/off value description.
	 * @property {number} width Width in pixels in which the pattern should be drawn.
	 */
	
	/**
	 * A function describing the color to use for drawing a specific part of the chart.
	 *
	 * Should always return a {@link CIQ.ChartEngine~colorObject} describing how you would like the
	 * chart to draw the quote.
	 *
	 * @param {CIQ.ChartEngine} stx The chart engine.
	 * @param {CIQ.ChartEngine~OHLCQuote} quote Specific quote to be drawn with the returned color
	 * 		object.
	 * @param {object} parameters Any parameters used by your color function.
	 * @return {CIQ.ChartEngine~colorObject} A color object.
	 *
	 * @callback CIQ.ChartEngine~colorFunction
	 */
	
	/**
	 * @callback CIQ.Renderer~colorFunction
	 * @see CIQ.ChartEngine~colorFunctionnew
	 */
	
	/**
	 * Generates a function used to return the color and pattern of a line chart over a gap area.
	 * A gap is an area where the value for the plotted field is null, undefined, or missing.
	 *
	 * See {@link CIQ.ChartEngine#setGapLines}.
	 *
	 * @param  {string} [symbol] Symbol of the series
	 * @param  {string} [field]	Field to plot, usually Close
	 * @param {object} [normal] Normal definition object containing color, pattern and width.  If only color is required, this may be set directly to the color string.
	 * @param {string} [normal.color] A color on the canvas palette to use for normal, non-gap plot
	 * @param {array} [normal.pattern] Pattern to use as alternative to solid line for normal, non-gap plot, in array format, e.g. [1,2,3,2]
	 * @param {number} [normal.width] Line with for normal plot, in pixels
	 * @param {object} [gaps] Gaps definition object containing color, pattern and width.  If only color is required, this may be set directly to the color string. If no gaps should be filled, leave out or set to false.
	 * @param {string} [gaps.color] A color on the canvas palette to use for gap plot
	 * @param {array} [gaps.pattern] Pattern to use as alternative to solid line for gap plot, in array format, e.g. [1,2,3,2]
	 * @param {number} [gaps.width] Line with for gap plot, in pixels
	 * @param {function} [colorFunction] Function to apply to plot to determine colors, for normal, non-gap portion
	 * @return {function} A function for generating color and pattern for the entire chart.
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 5.1.0 Changed signature, added width support.
	 */
	CIQ.ChartEngine.prototype.getGapColorFunction = function (
		symbol,
		field,
		normal,
		gaps,
		colorFunction
	) {
		if (typeof normal != "object") normal = { color: normal };
		return function (stx, quote, isGap) {
			var myColor = colorFunction ? colorFunction(stx, quote, isGap) : normal;
			if (myColor.color) myColor = myColor.color; // in case the colorFunction returns an object
			var q = quote[symbol];
			if (!q && q !== 0) q = quote[field];
			if (!isGap && (q || q === 0)) {
				return {
					color: myColor,
					pattern: normal.pattern,
					width: normal.width
				};
			}
			if (!gaps) return null; // no color is returned if no gaps are needed.
			if (typeof gaps != "object") {
				if (typeof gaps == "string") gaps = { color: gaps };
				else gaps = {};
			}
			return {
				color: gaps.color || myColor,
				pattern: gaps.pattern || normal.pattern,
				width: gaps.width || normal.width
			};
		};
	};
	
	/**
	 * <span class="animation">Animation Loop</span>
	 *
	 * Draws a single frame of a line chart.
	 *
	 * This method should rarely if ever be called directly.
	 * Use {@link CIQ.Renderer.Lines},  {@link CIQ.ChartEngine#setChartType} or {@link CIQ.ChartEngine#addSeries} instead.
	 *
	 * Any parameters from {@link CIQ.Renderer#attachSeries} or {@link CIQ.ChartEngine#addSeries}
	 * will be passed on to this method and are valid when directly calling it from within a [study display function of a Custom Study]{@tutorial Using and Customizing Studies - Creating New Studies}.
	 *
	 * Uses CSS style `stx_line_chart` to control width and color of line charts, unless `params` are set.
	 *
	 * The default color function for the colored line chart uses the following CSS styles:
	 * - `stx_line_up`		- Color of the uptick portion of the line
	 * - `stx_line_down`	- Color of the downtick portion of the line
	 *
	 * @param  {CIQ.ChartEngine.Panel} panel The panel on which to draw the line chart
	 * @param  {string} style	The style selector which contains the styling for the bar (width and color)
	 * @param  {function} [colorFunction]	A function which accepts an CIQ.ChartEngine and quote as its arguments and returns the appropriate color for drawing that mode.
						Returning a null will skip that bar.  If not passed as an argument, will use a default color.
	 * @param  {object} [params]	Listing of parameters to use when plotting the line chart.
	 * @param {boolean} [params.skipTransform] If true then any transformations (such as comparison charting) will not be applied
	 * @param {boolean} [params.label] If true then the y-axis will be marked with the value of the right-hand intercept of the line
	 * @param {boolean} [params.noSlopes] If set then chart will draw horizontal bars with no vertical lines.
	 * @param {boolean} [params.step] If set then chart will resemble a step chart.  Horizontal lines will begin at the center of the bar.
	 * @param {number} [params.tension] Tension for splining.
	 * @param {boolean} [params.highlight] If set then line will be twice as wide.
	 * @param {string} [params.color] The color for the line. Defaults to CSS style
	 * @param {string} [params.pattern] The pattern for the line ("solid","dashed","dotted"). Defaults to CSS style
	 * @param {number} [params.width] The width in pixels for the line. Defaults to CSS style
	 * @param {object} [params.gapDisplayStyle] Gap object as created by {@link CIQ.ChartEngine#setGapLines}. If not set `chart.gaplines` will be used.
	 * @param {boolean} [params.labelDecimalPlaces] Specifies the number of decimal places to print on the label. If not set then it will match the y-axis.
	 * @param {boolean} [params.returnObject] Set to true for return value of the function to be object as described in doc below, otherwise returns only array of colors used.
	 * @return {object} Data generated by the plot, such as colors used if a colorFunction was passed, and the vertices of the line (points).
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 15-07-01 Changed signature from `chart` to `panel`.
	 * - 3.0.0 Added `params`.
	 * - 5.2.0 `params.gaps` has been deprecated and replaced with `params.gapDisplayStyle`.
	 * - 6.0.0 `params.gapDisplayStyle` can be set to false to suppress all gap drawing.
	 */
	CIQ.ChartEngine.prototype.drawLineChart = function (
		panel,
		style,
		colorFunction,
		params
	) {
		var chart = this.chart,
			context = chart.context,
			lineStyle = chart.lineStyle || {};
		var c = this.canvasStyle(style);
		if (!params) params = {};
		this.startClip(panel.name);
		var width = params.width || lineStyle.width || c.width;
		if (width && parseInt(width, 10) <= 25) {
			context.lineWidth = Math.max(1, CIQ.stripPX(width));
		} else {
			context.lineWidth = 1;
		}
		params.pattern = params.pattern || lineStyle.pattern || c.borderTopStyle;
		params.pattern = CIQ.borderPatternToArray(context.lineWidth, params.pattern);
		this.canvasColor(style);
		var color = params.color || lineStyle.color;
		if (color) {
			if (color == "auto") color = this.defaultColor;
			if (params.opacity && params.opacity !== 1)
				color = CIQ.hexToRgba(CIQ.colorToHex(color), parseFloat(params.opacity));
			context.strokeStyle = color;
		}
		params.skipProjections = true;
		var field = params.field || chart.defaultPlotField; // usually the series
		var plotField = params.subField || chart.defaultPlotField || "Close"; // usually the field within the series
		var gaps = params.gapDisplayStyle;
		if (!gaps && gaps !== false) gaps = params.gaps;
		if (!gaps && gaps !== false) gaps = chart.gaplines;
		if (!gaps) gaps = "transparent";
		params.gapDisplayStyle = gaps;
		var myColorFunction = this.getGapColorFunction(
			field,
			plotField,
			{
				color: context.strokeStyle,
				pattern: params.pattern,
				width: context.lineWidth
			},
			gaps,
			colorFunction
		);
		if (panel.chart.tension) params.tension = panel.chart.tension;
		var rc = this.plotDataSegmentAsLine(field, panel, params, myColorFunction);
		if (!rc.colors.length) rc.colors.push(context.strokeStyle);
		context.lineWidth = 1;
		this.endClip();
	
		return params.returnObject ? rc : rc.colors;
	};
	
	/**
	 * <span class="animation">Animation Loop</span>
	 *
	 * Draws a channel chart, shading the areas between a high and the close and between a low and the close.
	 *
	 * The high, low, and close can be redefined to other fields within the parameters.
	 *
	 * This method should rarely if ever be called directly. Use {@link CIQ.Renderer.Lines} or {@link CIQ.ChartEngine#setChartType} instead.
	 *
	 * Any parameters from {@link CIQ.Renderer#attachSeries} or {@link CIQ.ChartEngine#addSeries}
	 * will be passed on to this method and are valid when directly calling it from within a [study display function of a Custom Study]{@tutorial Using and Customizing Studies - Creating New Studies}.
	 *
	 * The high line, low line, and respective shading are controlled by the following styles, unless overridden in the `params`:
	 * - `stx_channel_up` - Color of the high line and shading.
	 * - `stx_channel_down`	- Color of the low line and shading.
	
	 * The close line color as well as all of the line widths are controlled by the style `stx_line_chart`, unless `params` are set.
	 *
	 * @param {CIQ.ChartEngine.Panel} panel The panel on which to draw the line chart.
	 * @param {function} [colorFunction] A function that accepts a `CIQ.ChartEngine` and quote as its arguments and returns the appropriate color for drawing that mode.
	 * Returning a null skips that bar. If not passed as an argument, uses a default color.
	 * @param {object} [params]	Listing of parameters to use when plotting the channel chart.
	 * @param {boolean} [params.skipTransform] If true, any transformations (such as comparison charting) are applied.
	 * @param {boolean} [params.label] If true, the y-axis is marked with the value of the right-hand intercept of the line.
	 * @param {boolean} [params.noSlopes] If set, the chart will draw horizontal bars with no vertical lines.
	 * @param {boolean} [params.step] If set, the chart will resemble a step chart. Horizontal lines will begin at the center of the bar.
	 * @param {number} [params.tension] Tension for splining.
	 * @param {boolean} [params.highlight] If set, lines are twice as wide.
	 * @param {string} [params.color] The color for the close line. Defaults to CSS style.
	 * @param {string} [params.border_color_down] The color for the high line. Defaults to CSS style.
	 * @param {string} [params.border_color_up] The color for the low line. Defaults to CSS style.
	 * @param {string} [params.pattern] The pattern for the line ("solid","dashed","dotted"). Defaults to CSS style.
	 * @param {number} [params.width] The width in pixels for the line. Defaults to CSS style.
	 * @param {object} [params.gapDisplayStyle] Gap object as created by {@link CIQ.ChartEngine#setGapLines}. If not set `chart.gaplines` is used.
	 * @param {boolean} [params.labelDecimalPlaces] Specifies the number of decimal places to print on the label. If not set, it will match the y-axis.
	 * @param  {string} [params.style] The style selector, which contains the styling for the lines (width and color).
	 * @param {boolean} [params.returnObject] Set to true for return value of the function to be object as described below, otherwise returns only array of colors used.
	 * @return {object} Data generated by the plot, such as colors used if a `colorFunction` was passed, and the vertices of the close line (points).
	 * @memberof CIQ.ChartEngine
	 * @since 7.3.0
	 */
	CIQ.ChartEngine.prototype.drawChannelChart = function (
		panel,
		colorFunction,
		params
	) {
		var localParams = CIQ.clone(params);
		localParams.color = params.color;
		var rcC = this.drawLineChart(
			panel,
			localParams.style,
			colorFunction,
			localParams
		);
		var upColor =
			localParams.border_color_up || this.getCanvasColor("stx_channel_up");
		var downColor =
			localParams.border_color_down || this.getCanvasColor("stx_channel_down");
		localParams[params.field ? "subField" : "field"] =
			localParams.field_high || "High";
		localParams.color = upColor;
		var rcH = this.drawLineChart(
			panel,
			localParams.style,
			colorFunction,
			localParams
		);
		localParams[params.field ? "subField" : "field"] =
			localParams.field_low || "Low";
		localParams.color = downColor;
		var rcL = this.drawLineChart(
			panel,
			localParams.style,
			colorFunction,
			localParams
		);
		localParams[params.field ? "subField" : "field"] =
			params.subField || this.chart.defaultPlotField || "Close";
	
		var p,
			topArea = [],
			bottomArea = [];
		for (p = 0; p < rcH.points.length; p += 2)
			topArea.push([rcH.points[p], rcH.points[p + 1]]);
		for (p = 0; p < rcL.points.length; p += 2)
			bottomArea.push([rcL.points[p], rcL.points[p + 1]]);
		var width = this.chart.context.lineWidth / 2;
		for (p = rcC.points.length - 2; p >= 0; p -= 2) {
			topArea.push([rcC.points[p], rcC.points[p + 1] - width]);
			bottomArea.push([rcC.points[p], rcC.points[p + 1] + width]);
		}
		this.startClip(panel.name);
		localParams.color = upColor;
		CIQ.fillArea(this, topArea, localParams);
		localParams.color = downColor;
		CIQ.fillArea(this, bottomArea, localParams);
		this.endClip();
	
		rcC.colors = rcC.colors.concat(rcH.colors).concat(rcL.colors);
	
		return params.returnObject ? rcC : rcC.colors;
	};
	
	/**
	 * Draws a series of connected lines on the canvas. The points are in a straight array for compactness. This is used
	 * for instance in the freeform (doodle) drawing tool
	 * @param  {array} points		  A series of points in the pattern x0,y0,x1,y1
	 * @param  {string} color		   Either a color or a Styles object as returned from {@link CIQ.ChartEngine#canvasStyle}
	 * @param  {string} type		   The type of line to draw ("segment","ray" or "line")
	 * @param  {external:CanvasRenderingContext2D} [context]		The canvas context. Defaults to the standard context.
	 * @param  {object} [confineToPanel] Panel the line should be drawn in, and not cross through. Or set to 'true' to confine to the main chart panel.
	 * @param  {object} [parameters]	 Additional parameters to describe the line
	 * @param {string} [parameters.pattern] The pattern for the line ("solid","dashed","dotted")
	 * @param {number} [parameters.width] The width in pixels for the line
	 * @param {number} [parameters.opacity] Opacity for the line
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.connectTheDots = function (
		points,
		color,
		type,
		context,
		confineToPanel,
		parameters
	) {
		if (!parameters) parameters = {};
		if (parameters.pattern == "none") return;
		if (confineToPanel === true) confineToPanel = this.chart.panel;
		if (context === null || typeof context == "undefined")
			context = this.chart.context;
		if (points.length < 4) return;
	
		var edgeTop = 0;
		var edgeBottom = this.chart.canvasHeight;
		var edgeLeft = 0;
		var edgeRight = this.chart.width;
	
		if (confineToPanel) {
			edgeBottom = confineToPanel.yAxis.bottom;
			edgeTop = confineToPanel.yAxis.top;
		}
	
		context.lineWidth = 1.1; // Use 1.1 instead of 1 to get good anti-aliasing on Android Chrome
		if (typeof color == "object") {
			context.strokeStyle = color.color;
			if (color.opacity) context.globalAlpha = color.opacity;
			else context.globalAlpha = 1;
			context.lineWidth = CIQ.stripPX(color.width);
		} else {
			if (!color || color == "auto" || CIQ.isTransparent(color)) {
				context.strokeStyle = this.defaultColor;
			} else {
				context.strokeStyle = color;
			}
		}
		if (parameters.opacity) context.globalAlpha = parameters.opacity;
		if (parameters.lineWidth) context.lineWidth = parameters.lineWidth;
		var pattern = CIQ.borderPatternToArray(context.lineWidth, parameters.pattern);
		context.beginPath();
	
		for (var i = 0; i < points.length - 2; i += 2) {
			var x0 = points[i];
			var y0 = points[i + 1];
			var x1 = points[i + 2];
			var y1 = points[i + 3];
			if (isNaN(x0) || isNaN(x1) || isNaN(y0) || isNaN(y1)) return;
	
			var t0 = 0.0,
				t1 = 1.0;
			var xdelta = x1 - x0;
			var ydelta = y1 - y0;
			var p, q, r;
	
			for (var edge = 0; edge < 4; edge++) {
				if (edge === 0) {
					p = -xdelta;
					q = -(edgeLeft - x0);
				}
				if (edge == 1) {
					p = xdelta;
					q = edgeRight - x0;
				}
				if (edge == 2) {
					p = -ydelta;
					q = -(edgeTop - y0);
				}
				if (edge == 3) {
					p = ydelta;
					q = edgeBottom - y0;
				}
				r = q / p;
	
				if ((y1 || y1 === 0) && p === 0 && q < 0) {
					return false; // Don't draw line at all. (parallel horizontal line outside)
				}
	
				if (p < 0) {
					if (r > t1) return false;
					// Don't draw line at all.
					else if (r > t0) t0 = r; // Line is clipped!
				} else if (p > 0) {
					if (r < t0) return false;
					// Don't draw line at all.
					else if (r < t1) t1 = r; // Line is clipped!
				}
			}
	
			var x0clip = x0 + t0 * xdelta;
			var y0clip = y0 + t0 * ydelta;
			var x1clip = x0 + t1 * xdelta;
			var y1clip = y0 + t1 * ydelta;
	
			try {
				context.setLineDash(pattern && pattern.length ? pattern : []);
				context.moveTo(x0clip, y0clip);
				context.lineTo(x1clip, y1clip);
			} catch (e) {
				//alert(x0clip + ":" + y0clip + " " + x1clip + ":" + y1clip);
			}
		}
		context.stroke();
		context.closePath();
		context.globalAlpha = 1;
		context.lineWidth = 1;
	};
	
	// confineToPanel is not used because currently we are splining after the drawing is complete.
	// should that change we will need to implement it
	
	/**
	 * Draws a series of points and splines (smooths the curve) those points.
	 *
	 * This is uses for drawings, not series.
	 * @param  {array} points		  A series of points in the pattern x0,y0,x1,y1
	 * @param {number} tension Spline tension (0-1). Set to negative to not spline.
	 * @param  {string} color		   Either a color or a Styles object as returned from {@link CIQ.ChartEngine#canvasStyle}
	 * @param  {string} type		   The type of line to draw ("segment","ray" or "line")
	 * @param  {external:CanvasRenderingContext2D} [context]		The canvas context. Defaults to the standard context.
	 * @param  {string} [confineToPanel] Not currently implemented
	 * @param  {object} [parameters]	 Additional parameters to describe the line
	 * @param {string} [parameters.pattern] The pattern for the line ("solid","dashed","dotted")
	 * @param {number} [parameters.width] The width in pixels for the line
	 * @param {number} [parameters.opacity] Opacity for the line
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.plotSpline = function (
		points,
		tension,
		color,
		type,
		context,
		confineToPanel,
		parameters
	) {
		if (!parameters) parameters = {};
		if (parameters.pattern == "none") return;
		if (confineToPanel === true) confineToPanel = this.chart.panel;
		if (context === null || typeof context == "undefined")
			context = this.chart.context;
	
		context.save();
	
		context.lineWidth = 1.1; // Use 1.1 instead of 1 to get good anti-aliasing on Android Chrome
		if (typeof color == "object") {
			context.strokeStyle = color.color;
			if (color.opacity) context.globalAlpha = color.opacity;
			else context.globalAlpha = 1;
			context.lineWidth = CIQ.stripPX(color.width);
		} else {
			if (!color || color == "auto" || CIQ.isTransparent(color)) {
				context.strokeStyle = this.defaultColor;
			} else {
				context.strokeStyle = color;
			}
		}
		if (parameters.opacity) context.globalAlpha = parameters.opacity;
		if (parameters.lineWidth) context.lineWidth = parameters.lineWidth;
		var pattern = CIQ.borderPatternToArray(context.lineWidth, parameters.pattern);
		if (parameters.pattern && context.setLineDash) {
			context.setLineDash(pattern);
			context.lineDashOffset = 0; //start point in array
		}
	
		context.beginPath();
		splinePlotter.plotSpline(points, tension, context);
		context.stroke();
		context.closePath();
	
		context.restore();
	};
	
	/**
	 * Creates watermarked text on the canvas.
	 *
	 * See {@link CIQ.ChartEngine#watermark} to create a watermark relative to a particular panel.
	 *
	 * CSS style stx_watermark defines the watermark (opacity of .5 is automatically applied)
	 *
	 * **Note** that the watermark will not persist unless called from within the animation loop (study display function, for example).
	 * As such, it may be necessary to use a `prepend` to the `draw` function to create persistence. See example section.
	 * @param  {external:CanvasRenderingContext2D} context [description]
	 * @param  {number} x		X position on canvas
	 * @param  {number} y		Y position on canvas
	 * @param  {string} text	The text to watermark
	 * @memberof CIQ.ChartEngine
	 * @example
	  CIQ.ChartEngine.prototype.prepend("draw",function(){
		   // create persistence by forcing it  be called in every animation frame.
		   rawWatermark(stxx.chart.context,20,30,stxx.chart.symbol);
	  });
	 */
	CIQ.ChartEngine.prototype.rawWatermark = function (context, x, y, text) {
		this.canvasFont("stx_watermark", context);
		context.fillStyle = this.defaultColor;
		context.globalAlpha = 0.5;
		this.chart.context.textBaseline = "alphabetic";
		context.fillText(text, x, y);
		context.globalAlpha = 1;
	};
	
	/**
	 * Creates watermarked text relative to a panel on the canvas.
	 *
	 * Uses CSS style `stx_watermark` to set the text size and color.
	 *
	 * **Note** The watermark does not persist unless called from within the animation loop (study display function,
	 * for example). As such, it may be necessary to use a `prepend` to the `draw` function to create persistence.
	 * See example section.
	 *
	 * @param {string} panel The name of the panel.
	 * @param {object} [config] Parameters for the request.
	 * @param {string} [config.h] Specifies horizontal placement of the watermark &mdash; "left", "right", or "center".
	 * @param {string} [config.v] Specifies vertical placement of the watermark &mdash "top", "bottom", or "middle".
	 * @param {string} [config.text] The text of the watermark.
	 * @param {string} [config.hOffset]	Horizontal offset in pixels of the upper left corner of the watermark from the
	 * 		left or right margin.
	 * @param {string} [config.vOffset]	Vertical offset in pixels of the upper left corner of the watermark from the
	 * 		top or bottom margin.
	 * @param {external:CanvasRenderingContext2D} [config.context] The drawing canvas context. If omitted,
	 * 		`this.chart.context` is used.
	 * @memberof CIQ.ChartEngine
	 * @example
	  CIQ.ChartEngine.prototype.prepend("draw",function(){
		   // create persistence by forcing it  be called in every animation frame.
		   stxx.watermark("chart",{h:"center",v:"middle",text:stxx.chart.symbol});
	  });
	 * @since 7.4.0 Added the `config.context` parameter.
	 */
	CIQ.ChartEngine.prototype.watermark = function (panel, config) {
		if (config && typeof config != "object") {
			// Handle legacy argument list implementation
			config = {
				h: arguments[1],
				v: arguments[2],
				text: arguments[3]
			};
		}
		config = {
			// set defaults
			h: config.h || "left",
			v: config.v || "bottom",
			text: config.text || "",
			hOffset: config.hOffset === 0 ? 0 : config.hOffset || 10,
			vOffset: config.vOffset === 0 ? 0 : config.vOffset || 20,
			context: config.context || this.chart.context
		};
	
		var context = config.context;
		if (!context) return;
		var c = this.panels[panel];
		if (!c || c.hidden) return;
	
		var y = c.yAxis.bottom - config.vOffset;
		if (config.v == "top") y = c.top + config.vOffset;
		else if (config.v == "middle") y = (c.top + c.yAxis.bottom) / 2;
	
		context.save();
		this.canvasFont("stx_watermark", context);
		this.canvasColor("stx_watermark", context);
		context.textBaseline = "alphabetic";
	
		var x = c.left + config.hOffset;
		if (config.h == "right") x = c.right - config.hOffset;
		else if (config.h == "center") {
			x = (c.right + c.left - context.measureText(config.text).width) / 2;
		}
	
		context.globalAlpha = 0.5;
		if (this.highlightedDraggable) context.globalAlpha *= 0.3;
		context.fillText(config.text, x, y);
		context.restore();
	};
	
	/**
	 * Displays errors on the center bottom of the canvas.
	 *
	 * In the event that there are multiple errors (caused by calling the method multiple times), they will get vertically stacked.
	 *
	 * **Note**: Because `displayErrorAsWatermark` leverages {@link CIQ.ChartEngine#watermark} to draw errors on the canvas,
	 * the errors will not persist unless added from within the animation loop. See {@link CIQ.ChartEngine#watermark} for more info.
	 *
	 * @param {string} panelKey The name of the panel
	 * @param {string} error The error text to draw on the canvas
	 * @memberof CIQ.ChartEngine
	 * @since 7.3.0
	 */
	CIQ.ChartEngine.prototype.displayErrorAsWatermark = function (panelKey, error) {
		if (!error) return;
		if (!panelKey) panelKey = "chart";
	
		var panelObj = this.panels[panelKey];
		if (!panelObj || panelObj.hidden) return;
	
		var panelState = panelObj.state;
		if (!panelState) panelObj.state = panelState = {};
	
		var studyErrors = panelState.studyErrors;
		if (!studyErrors) panelState.studyErrors = studyErrors = new Set();
	
		if (studyErrors.has(error)) return;
	
		var offsetValue = panelState.watermarkOffset || 10;
		var padding = 10; // to separate error messages
		var errorHeight = this.getCanvasFontSize("stx_watermark");
	
		// make sure chartControls doesn't overlay on top of the errors
		if (this.chart && this.chart.chartControls) {
			var yAxisBottom = panelObj.yAxis.bottom;
			var chartControls = this.chart.chartControls;
			var textBottom = yAxisBottom - offsetValue;
			var textTop = textBottom - errorHeight;
			if (
				(textBottom > chartControls.offsetTop &&
					textBottom < chartControls.offsetTop + chartControls.offsetHeight) ||
				(textTop > chartControls.offsetTop &&
					textTop < chartControls.offsetTop + chartControls.offsetHeight)
			) {
				offsetValue = yAxisBottom - chartControls.offsetTop + padding;
			}
		}
	
		// add new error after offset calculations so it doesn't count itself
		studyErrors.add(error);
	
		var watermarkParams = {
			h: "center",
			v: "bottom",
			text: error,
			vOffset: offsetValue
		};
	
		offsetValue += errorHeight + padding;
		panelState.watermarkOffset = offsetValue;
	
		this.watermark(panelKey, watermarkParams);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Displays the chart by calling the appropriate rendering functions based on the <a href="CIQ.ChartEngine.html#layout%5B%60chartType%60%5D">CIQ.ChartEngine.layout.chartType</a>.
	 *
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to render
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias displayChart
	 * @since
	 * - 4.0.0 If no Open price is available, a candle will draw as a dash at the Close price.
	 * - 5.1.0 Reduced to injections only for backwards compatibility, main chart is drawn with renderers now.
	 */
	CIQ.ChartEngine.prototype.displayChart = function (chart) {
		if (this.runPrepend("displayChart", arguments)) return;
		this.rendererAction(chart, "main");
		this.runAppend("displayChart", arguments);
	};
	
	};
	
	
	let __js_core_engine_styles_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Clones a style from a style object (obtained from getComputedStyle). Any styles are converted to camel case. This method automatically
	 * converts from browsers that store styles as numeric arrays rather than as property objects.
	 * @param  {object} styleObject A style object derived from getComputedStyle
	 * @return {object}	A new style object that will match properties
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.cloneStyle = function (styleObject) {
		var rc = {};
		var nativeCamelSupport = false;
		function capitalize(g) {
			return g[1].toUpperCase();
		}
		for (var i in styleObject) {
			var v = styleObject[i];
			// do *not* check styleObject["backgroundAttachment"]. Android browsers return bogus results.
			// instead we iterate through the object
			if (i == "backgroundAttachment") nativeCamelSupport = true;
	
			// modern browsers contain both camel and hyphenated. We can avoid the camelCase conversion
			// logic to save a little bit of startup time
			if (nativeCamelSupport) {
				if (v && v.constructor == String && isNaN(i)) {
					rc[i] = v;
				}
			} else if (!isNaN(i)) {
				// old android browsers fall into here
				var x = styleObject.getPropertyValue(v);
				if (x) {
					//var vcc=v.replace(CIQ.camelCaseRegExp, function (g) { return g[1].toUpperCase(); })
					// much more efficient camel case conversion algorithm
					v = v.split("-");
					var ii = 0,
						jj = v.length;
					var vcc = v[0];
					while (++ii < jj) {
						vcc += v[ii].charAt(0).toUpperCase() + v[ii].slice(1);
					}
					rc[vcc] = x;
				}
			} else {
				// old internet explorer falls into here
				var icc = i.replace(CIQ.camelCaseRegExp, capitalize);
				rc[icc] = v;
			}
		}
		return rc;
	};
	
	/**
	 * Returns an object containing the class style given a css class name (used by plotLine() for instance).
	 *
	 * A caching mechanism is used for performance.
	 * If styles are changed dynamically then use {@link CIQ.ChartEngine#clearStyles} to reset.
	 *
	 * Alse see {@link CIQ.ChartEngine#setStyle}.
	 *
	 * @param  {string} className The CSS class name to get the styles
	 * @return {object}			  An object containing each style, in camel case.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.canvasStyle = function (className) {
		var s = this.styles[className];
		if (!s) {
			var div = document.createElement("div"); // Create a dummy div
			div.className = className;
			this.container.appendChild(div);
			var styles = getComputedStyle(div);
			s = this.styles[className] = this.cloneStyle(styles);
			this.container.removeChild(div);
			if (!styles) {
				// css not initialized, possibly hidden iframe in firefox
				this.styles[className] = null;
			}
		}
		return s;
	};
	
	/**
	 * Detects if a string is a valid CSS color and if so returns that string.
	 *
	 * Otherwise it returns a style object, assuming that the string is a classname.
	 * @param  {string} str Either a color or a className
	 * @return {object}		Either the color or a class object
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.colorOrStyle = function (str) {
		if (str.indexOf("#") != -1) return str;
		if (str.indexOf("(") != -1) return str; // rgb() or rgba()
		if (str == "transparent") return str;
		return this.canvasStyle(str);
	};
	
	/**
	 *	Call this to remove all of the loaded canvas styles, for instance after loading a new css file.
	 *
	 * Also see  {@link CIQ.ChartEngine#setStyle} and  {@link CIQ.ChartEngine#canvasStyle}.
	 *	@memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.clearStyles = function () {
		this.styles = {};
		this.defaultColor = "";
	};
	
	/**
	 * Convenience method to programmatically set or change a style used by a chart **canvas** element.
	 *
	 * Canvas styling using this method is limited to color and font attributes.
	 *
	 * See {@link CIQ.ChartEngine#canvasFont} for important details on proper style setting for fonts.
	 *
	 * To see immediate results, call {@link CIQ.ChartEngine#draw} once this method is used.
	 *
	 * Primarily used in the {@link CIQ.ThemeHelper} to programmatically override defaults CSS colors to create custom themes.
	 *
	 * This method **will not affect HTML containers** directly referencing a CSS style; such as menu items or [chart controls]{@link CIQ.ChartEngine.htmlControls}.
	 * Those will need to be managed by the CSS, or via javaScrit directly altering the container's style object.
	 * For example, the crosshair y axis floating label is a canvas drawings generated by the {@link CIQ.ChartEngine#createYAxisLabel} canvas rendering function,
	 * so you can do something like this:
	 * - `stxx.setStyle("stx-float-price", "color", "red");`
	 *
	 * But the crosshair x axis floating label is an html div container part of the [chart controls]{@link CIQ.ChartEngine.htmlControls}.
	 * So this will require something like this instead:
	 * - `stxx.controls.floatDate.style.color='red';`
	 *
	 * For more details on customizing colors in the chart see {@tutorial Chart Styles and Types}. Also see  {@link CIQ.ChartEngine#clearStyles}
	 *
	 * @param  {string} obj The object whose style you wish to change (stx_grid, stx_xaxis, etc)
	 * @param  {string} attribute The style name of the object you wish to change. It will accept hyphenated or camel case formats.
	 * @param  {string} value The value to assign to the attribute
	 * @memberof CIQ.ChartEngine
	 * @example
	 * stxx.setStyle("stx_candle_up","borderLeftColor","green");
	 * stxx.setStyle("stx_candle_down","borderLeftColor","red");
	 * stxx.draw();
	 * @example
	 * stxx.setStyle("stx_yaxis", "fontFamily", "Arial");
	 * stxx.setStyle("stx_xaxis", "fontFamily", "Arial");
	 * stxx.setStyle("stx_yaxis", "fontSize", "15px");
	 * stxx.setStyle("stx_xaxis", "fontSize", "15px");
	 */
	CIQ.ChartEngine.prototype.setStyle = function (obj, attribute, value) {
		if (!this.styles[obj]) {
			this.canvasStyle(obj);
		}
		if (!this.styles[obj]) this.styles[obj] = {};
		this.styles[obj][CIQ.makeCamelCase(attribute)] = value;
	};
	
	/**
	 * The built-in 2D rendering context for the drawing surface of a canvas.
	 * @external CanvasRenderingContext2D
	 * @see [CanvasRenderingContext2D]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
	 * 		at the Mozilla Developer Network.
	 */
	
	/**
	 * Sets font for the canvas, given a css class name.
	 *
	 * Call this before drawing on the canvas.
	 *
	 * The canvas font will be set using the CSS `font-style` + `font-weight` + `font-size` + `font-family`.
	 *
	 * **Note** that the canvas font will use the `font-family` CSS property, **NOT** the combined `font` CSS property.
	 * Be aware of this when using {@link CIQ.ChartEngine#setStyle}
	 *
	 * @param  {string} className The name of the CSS class to pull font from
	 * @param  {external:CanvasRenderingContext2D} ctx		 An HTML Context
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.canvasFont = function (className, ctx) {
		if (!ctx) ctx = this.chart.context;
		var style = this.canvasStyle(className);
		if (!style) return;
	
		var result =
			style.fontStyle +
			" " +
			style.fontWeight +
			" " +
			style.fontSize +
			" " +
			style.fontFamily;
		if (result.indexOf("undefined") == -1) {
			ctx.font = result;
		} else {
			this.styles[className] = null;
			console.log("bad css style for class " + className);
		}
	};
	
	/**
	 * Sets color and globalAlpha (opacity) for the canvas, given a css class name.
	 *
	 * Call this before drawing on the canvas.
	 *
	 * Also see {@link CIQ.ChartEngine#setStyle}.
	 *
	 * @param  {string} className A CSS style. Supports "color" and "opacity"
	 * @param  {external:CanvasRenderingContext2D} [ctx]	   An HTML Context
	 * @example
	 * stxx.canvasColor("myStyle");
	 * @memberof CIQ.ChartEngine
	 * @since 4.0.0 Allow color:"transparent" to pass through and not use defaultColor.  Instead, use defaultColor if there is no style.color.
	 */
	CIQ.ChartEngine.prototype.canvasColor = function (className, ctx) {
		if (!ctx) ctx = this.chart.context;
		var style = this.canvasStyle(className);
		if (!style) return;
		var color = style.color;
		if (!color) color = this.defaultColor;
		ctx.globalAlpha = 1;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		var opacity = style.opacity;
		if (typeof opacity != "undefined") ctx.globalAlpha = opacity;
	};
	
	/**
	 * Returns the font size defined by the requested class name.
	 *
	 * Defaults to 12 if undefined. Use this to determine vertical heights so that lettering isn't clipped.
	 * @param  {string} className Class name
	 * @return {number}			  The font size (px is stripped)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.getCanvasFontSize = function (className) {
		var s = this.canvasStyle(className);
		var fs = s.fontSize;
		if (!fs) fs = "12";
		return parseInt(CIQ.stripPX(fs), 10);
	};
	
	/**
	 * Returns the canvas color specified in the class name.
	 *
	 * @param  {string} className The class name
	 * @return {string}			  The color specified (May be undefined if none specified)
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.getCanvasColor = function (className) {
		var s = this.canvasStyle(className);
		return s.color;
	};
	
	/**
	 * <span class="animation">Animation Loop</span>
	 *
	 * Determines the default color for lines and studies drawn on the screen. This is black unless
	 * the background color of the chart has a "value" greater than 65%.
	 * The result is that this.defaultColor contains the default color.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.getDefaultColor = function () {
		this.defaultColor = "#000000";
		var bgColor = null;
		var div = this.chart.container;
		while (!bgColor || CIQ.isTransparent(bgColor)) {
			var cStyle = getComputedStyle(div);
			if (!cStyle) return;
			bgColor = cStyle.backgroundColor;
			if (CIQ.isTransparent(bgColor)) bgColor = "transparent";
			div = div.parentNode;
			if (!div || !div.tagName) break;
		}
		if (bgColor) {
			if (bgColor == "transparent") bgColor = "#FFFFFF";
			this.containerColor = bgColor;
			if (!CIQ.isTransparent(bgColor)) {
				var hsv = CIQ.hsv(bgColor);
				var v = hsv[2];
				if (v > 0.65) this.defaultColor = "#000000";
				else this.defaultColor = "#FFFFFF";
			} else {
				this.defaultColor = "#000000";
			}
		} else {
			this.containerColor = "#FFFFFF";
		}
	};
	
	};
	
	
	let __js_core_engine_xaxis_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Defines an object used for rendering the X-axis on the chart, which can be adjusted immediately after declaring your `new CIQ.ChartEngine();`
	 * The CIQ.ChartEngine.XAxis object is created by and part of the {@link CIQ.ChartEngine.Chart} object and is used on the main chart panel only.
	 * There is only one x axis per chart container.
	 *
	 * Colors and fonts for the x axis can be controlled by manipulating the CSS.
	 * You can override the `stx_xaxis` class to change the font or colors.
	 *
	 * Also see:
	 * - {@link CIQ.ChartEngine#axisBorders}
	 * - {@link CIQ.ChartEngine#xAxisAsFooter}
	 * - {@link CIQ.ChartEngine#xaxisHeight}
	 *
	 * For full customization instructions see:
	 * - {@tutorial Custom X-axis}
	 * - {@link CIQ.ChartEngine.AdvancedInjectable#createXAxis}
	 * - {@link CIQ.ChartEngine#createTickXAxisWithDates}
	 *
	 * Example: stxx.chart.xAxis
	 *
	 * @constructor
	 * @name  CIQ.ChartEngine.XAxis
	 * @param {object} init Object containing custom values for X-axis members
	 * @example
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.chart.xAxis.formatter=formatFunction;
	 */
	CIQ.ChartEngine.XAxis = function (init) {
		for (var field in init) this[field] = init[field];
	};
	
	CIQ.extend(
		CIQ.ChartEngine.XAxis.prototype,
		{
			/**
			 * Optional function to format dates on x-axis.
			 * If defined, will be used to completely control x-axis formatting, including the floating HUD date of the crosshair.
			 *
			 * This function **should not** be used to alter the timezone of the displayed date/time. For time zone conversions use {@link CIQ.ChartEngine#setTimeZone}
			 *
			 * **Expected format:**
			 *
			 * - `function(labelDate, gridType, timeUnit, timeUnitMultiplier, defaultText);`
			 *
			 * **Parameters:**
			 * <table>
			 * <tr><th>Name</th><th>Type</th><th>Description</th></tr>
			 * <tr><td>labelDate</td><td>Date</td><td>javaScript date to format</td></tr>
			 * <tr><td>gridType</td><td>String</td><td>"boundary", "line", or name of drawing (e.g. "vertical") for the axis labels.<br>Absent for the floating crosshair label</td></tr>
			 * <tr><td>timeUnit</td><td>Enumerated type</td><td>CIQ.MILLISECOND <br>CIQ.SECOND <br>CIQ.MINUTE <br>CIQ.HOUR <br>CIQ.DAY <br>CIQ.MONTH <br>CIQ.YEAR <br>CIQ.DECADE <br>Absent for the floating crosshair label.</td></tr>
			 * <tr><td>timeUnitMultiplier</td><td>Number</td><td>How many timeUnits. <br>Absent for the floating crosshair label.</td></tr>
			 * <tr><td>defaultText</td><td>String</td><td>Contains the default date label that would be used if no formatter is defined. Simply return this value for dates where no formatting is desired.</td></tr>
			 * </table>
			 *
			 * **Returns:**
			 * - Formatted text label for the particular date passed in.
			 *
			 * @type function
			 * @memberof CIQ.ChartEngine.XAxis#
			 * @example
			 * stxx.chart.xAxis.formatter = function(labelDate, gridType, timeUnit, timeUnitMultiplier, defaultText){
			 * 		// Your code here to format your string.
			 * 		// Example: always return HH:MM regardless of gridType,
			 * 		// even if gridType is a 'boundary' that normally would display
			 * 		// a date in intraday periodicity or a month in daily periodicity
			 *
			 * 		//You can always return back 'defaultText' if you do not wish to customize the particular value.
			 *
			 * 		var stringDate = labelDate.getHours() + ':' + labelDate.getMinutes();
			 * 		return stringDate;
			 * }
			 * @example
			 * stxx.chart.xAxis.formatter = function(labelDate, gridType, timeUnit, timeUnitMultiplier, defaultText){
			 * 		// Your code here to format your string.
			 * 		// Example: return HH:MM when gridType is "line" otherwise returned the default text.
			 *
			 *		if( gridType == "line" ) {
			 * 			var stringDate = labelDate.getHours() + ':' + labelDate.getMinutes();
			 * 			return stringDate;
			 * 		else
			 * 			return defaultText;
			 * }
			 * @since
			 * - 3.0.0 Using x axis formatter now is available for year and month boundaries.
			 * - 6.3.0 Added `defaultText` parameter.
			 * - 6.3.0 Added drawing type as possible `gridType` value.
			 */
			formatter: null,
			/**
			 * If true, the user selected (default browser if none selected) timezone will be used on the x axis.
			 * If not set to true, the data timezone will be used even if a user timezone was set.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			adjustTimeZone: true,
			/**
			 * Ideal space between x-axis labels in pixels.
			 * If null then the chart will attempt a tick size and time unit in proportion to the chart.
			 * Please note that if `stxx.chart.yAxis.goldenRatioYAxis` is set to `true`, this setting will also affect the spacing between y-axis labels.
			 * Please note that this setting will be overwritten at rendering time if too small to prevent labels from covering each other.
			 * Not applicable if {@link CIQ.ChartEngine.XAxis#timeUnit} is manually set.
			 * See {@tutorial Custom X-axis} for additional details.
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			idealTickSizePixels: null,
			/**
			 * Overrides default used in {@link CIQ.ChartEngine#createTickXAxisWithDates}
			 * <br>Allowable values:
			 * - CIQ.MILLISECOND,
			 * - CIQ.SECOND
			 * - CIQ.MINUTE
			 * - CIQ.HOUR
			 * - CIQ.DAY
			 * - CIQ.WEEK
			 * - CIQ.MONTH
			 * - CIQ.YEAR
			 * - CIQ.DECADE
			 *
			 * Visual Reference for sample code below (draw a label every 5 seconds using 1 second periodicity ) :<br>
			 * ![xAxis.timeUnit](xAxis.timeUnit.png "xAxis.timeUnit")
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 * @example
			 * // The following will cause the default implementation of createTickXAxisWithDates to print labels in seconds every 5 seconds.
			 * // masterData is in 1 second intervals for this particular example.
			 * stxx.chart.xAxis.timeUnit = CIQ.SECOND;
			 * stxx.chart.xAxis.timeUnitMultiplier = 5;
			 */
			timeUnit: null,
			/**
			 * Overrides default used in {@link CIQ.ChartEngine#createTickXAxisWithDates}
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 * @example
			 * // The following will cause the default implementation of createTickXAxisWithDates to print labels in seconds every 5 seconds.
			 * // masterData is in 1 second intervals for this particular example.
			 * stxx.chart.xAxis.timeUnit = CIQ.SECOND;
			 * stxx.chart.xAxis.timeUnitMultiplier = 5;
			 */
			timeUnitMultiplier: null,
			/**
			 * Set to true to draw a line above the x-axis.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			displayBorder: true,
			/**
			 * Set to false to suppress grid lines
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			displayGridLines: true,
			/**
			 * Switch to temporarily hide the x-axis. Set to `true' to activate.
			 *
			 * Axis space will be maintained. To completely remove the x axis, including spacing use {@link CIQ.ChartEngine#xaxisHeight}
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 * @since 3.0.0
			 */
			noDraw: null,
			/**
			 * Minimum size for label. This ensures adequate padding so that labels don't collide with one another.
			 * Please note that this setting is used during the rendering process, not during the label spacing calculation process and will be overwritten if too small to prevent labels from covering each other.
			 * To modify at what interval labels will be placed, please see {@tutorial Custom X-axis} for more details
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			minimumLabelWidth: 50,
			/**
			 * Set to false to hide axis markings in the future.
			 * @type boolean
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 */
			futureTicks: true,
			/**
			 * Set to the number of minutes ticks will move by when iterating in "tick" interval.
			 * <P>
			 * Since 'tick' is not a time based display, there is no way to predict what the time between ticks will be.
			 * Ticks can come a second later, a minute later or even more depending on how active a particular instrument may be.
			 * As such, if iterating through the market day in 'tick' periodicity, the library uses a pre-defined number of minutes to move around.
			 * This will be primarily used when deciding where to put x axis labels when going into the future in 'tick' mode.
			 *
			 * @type number
			 * @default
			 * @memberof CIQ.ChartEngine.XAxis#
			 * @example
			 * //You can override this behavior as follows:
			 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
			 * stxx.chart.xAxis.futureTicksInterval=1; // to set to 1 minute, for example
			 * @since 3.0.0 Default changed from 10 to 1.
			 */
			futureTicksInterval: 1
		},
		true
	);
	
	/**
	 * This is the object stored in CIQ.ChartEngine.chart.xaxis array which contains information regarding an x-axis tick.
	 * See {@link CIQ.ChartEngine.AdvancedInjectable#createXAxis} for more detail.
	 * @constructor
	 * @param {number} hz Horizontal position of center of label in pixels. Any elements with negative positions will be off the edge of the screen, and are only maintained to help produce a more predictable display as the chart is zoomed and paned.
	 * @param {string} grid Either "line" or "boundary" depending on whether the label should be a date/time boundary or just a grid line
	 * @param {string} text The text to display in the label
	 * @name CIQ.ChartEngine.XAxisLabel
	 */
	CIQ.ChartEngine.XAxisLabel = function (hz, grid, text) {
		this.hz = hz;
		this.grid = grid;
		this.text = text;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Call this method to create the X axis (date axis). Uses {@link CIQ.ChartEngine#createTickXAxisWithDates}.
	 *
	 * Use css styles `stx_xaxis` to control colors and fonts for the dates. <br>
	 * Use css styles `stx_xaxis_dark` to control **color only** for the divider dates. <br>
	 * Use css styles `stx_grid_border`, `stx_grid` and `stx_grid_dark` to control the grid line colors. <br>
	 * The dark styles are used for dividers; when the grid changes to a major point such as the start of a new day on an intraday chart, or a new month on a daily chart.
	 *
	 * See {@tutorial Custom X-axis} and {@tutorial CSS Overview} for additional details.
	 *
	 * @param  {CIQ.ChartEngine.Chart} chart	The chart to create an x-axis for
	 * @return {CIQ.ChartEngine.XAxisLabel[]}			axisRepresentation that can be passed in to {@link CIQ.ChartEngine#drawXAxis}
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias createXAxis
	 *
	 */
	CIQ.ChartEngine.prototype.createXAxis = function (chart) {
		if (chart.dataSegment.length <= 0) return null;
		if (chart.xAxis.noDraw) return null;
		var arguments$ = [chart];
		var axisRepresentation = this.runPrepend("createXAxis", arguments$);
		if (axisRepresentation) return axisRepresentation;
		if (this.mainSeriesRenderer && this.mainSeriesRenderer.createXAxis) {
			axisRepresentation = this.mainSeriesRenderer.createXAxis(chart);
		} else {
			axisRepresentation = this.createTickXAxisWithDates(chart);
		}
		this.headsUpHR();
		this.runAppend("createXAxis", arguments$);
		return axisRepresentation;
	};
	
	/**
	 * Creates a label on the x-axis. Generally used to create x-axis labels for drawings.
	 *
	 * Uses the font properties of the CSS style `stx-float-date` (see *css/stx-chart.css*).
	 *
	 * **Note:** This function is not used for the floating crosshairs date label, which is also
	 * styled using `stx-float-date`. See
	 * {@link CIQ.ChartEngine.AdvancedInjectable#updateChartAccessories} and
	 * {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} for more details.
	 *
	 * @param {object} params Function parameters.
	 * @param {CIQ.ChartEngine.Panel} params.panel The panel on which the label is created.
	 * @param {string} params.txt The text for the label.
	 * @param {number} params.x	The horizontal pixel position on the canvas for the label. **Note:**
	 * 		The function ensures that the label remains on the requested panel if this value is out of
	 * 		bounds.<br><br>To get the pixel position for a bar/date use
	 * 		{@link CIQ.ChartEngine#pixelFromTick}, {@link CIQ.ChartEngine#pixelFromDate}, or
	 * 		{@link CIQ.ChartEngine#pixelFromBar}.
	 * @param {string} params.backgroundColor The background color for the label.
	 * @param {string} [params.color] The foreground color for the label. If none is provided, then
	 * 		white is used, unless the background is white, in which case black is used.
	 * @param {boolean} [params.pointed] If true, add an upward pointing triangle to the top edge of
	 * 		the label horizontally centered to form a shape similar to --^--.
	 * @param {boolean} [params.padding = 2] The amount of padding in pixels to add to the label text
	 * 		(top, right, bottom, and left).
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.1.0 Function signature now includes the `params` object instead of a list of
	 * 		individual parameters. Added the `padding` parameter for easy customization.
	 */
	CIQ.ChartEngine.prototype.createXAxisLabel = function (params) {
		if (arguments[0] instanceof CIQ.ChartEngine.Panel) {
			// Handle legacy argument implementation
			params = {
				panel: arguments[0],
				txt: arguments[1],
				x: arguments[2],
				backgroundColor: arguments[3],
				color: arguments[4],
				pointed: arguments[5],
				padding: arguments[6]
			};
		}
		let panel = params.panel;
		let txt = params.txt;
		let x = params.x;
		let backgroundColor = params.backgroundColor;
		let color = params.color;
		let pointed = params.pointed;
		let padding = params.padding === 0 ? 0 : params.padding || 2;
	
		var context = this.chart.context;
		var fontstyle = "stx-float-date"; //or stx_xaxis
		var height = this.getCanvasFontSize(fontstyle) + padding * 2;
		this.canvasFont(fontstyle, context);
		var width;
		try {
			width = context.measureText(txt).width + padding * 2;
		} catch (e) {
			width = 0;
		} // Firefox doesn't like this in hidden iframe
		var y = panel.top + panel.height - height - padding;
		if (x + width / 2 < panel.left || x - width / 2 > panel.right) return; //hopelessly out of bounds
		if (!pointed) {
			if (x + width / 2 > panel.right) x = panel.right - width / 2;
			if (x - width / 2 < panel.left) x = panel.left + width / 2;
		}
		context.fillStyle = backgroundColor;
		CIQ.roundRect({
			ctx: context,
			x: x - width / 2,
			top: y,
			width: width,
			height: height,
			radius: 3,
			fill: true
		});
		var arrowHeight = panel.bottom - panel.yAxis.bottom - height;
		context.beginPath();
		if (pointed) {
			context.moveTo(x - arrowHeight, y);
			context.lineTo(x, y - arrowHeight - 1);
			context.lineTo(x + arrowHeight, y);
			context.closePath();
			context.fill();
		} else {
			context.moveTo(x, y);
			context.lineTo(x, y - arrowHeight);
			context.strokeStyle = backgroundColor;
			context.stroke();
		}
		context.textBaseline = "top";
		context.fillStyle = color
			? color
			: CIQ.chooseForegroundColor(backgroundColor);
		if (context.fillStyle == backgroundColor) {
			// Best effort to pick a foreground color that isn't the same as the background!
			if (backgroundColor.toUpperCase() == "#FFFFFF")
				context.fillStyle = "#000000";
			else context.fillStyle = "#FFFFFF";
		}
		context.fillText(txt, x - width / 2 + (padding - 1), y + (padding + 2));
	};
	
	};
	
	
	let __js_core_engine_yaxis_ = (_exports) => {
	
	
	var CIQ = _exports.CIQ;
	
	/**
	 * Adds text on the canvas for the floating label over the y axis.
	 *
	 * Uses native canvas functions to add the text. You can override this function if you wish to customize how the text on the floating y axis labels are displayed. See example.
	 * @param  {object}  params
	 * @param  {object}  params.ctx      A valid HTML Canvas Context
	 * @param  {number}  params.x      Left position of drawing on canvas
	 * @param  {number}  params.txt    Text for the label
	 * @param  {number}  params.y      Y position of drawing on canvas
	 * @param  {object}  params.margin     Margin around the text
	 * @param  {object}  params.margin.left     Left margin of text
	 * @param  {object}  params.margin.top     Top margin of text
	 * @param  {number}  params.backgroundColor  Background color of the shape drawn under the text, if any. This is used to find the text color if there is no color specified
	 * @param  {number}  params.color Text color
	 * @memberof CIQ
	 * @since 3.0.0
	 * @example
	 * // customized version which adds a dash before the label text
	 * CIQ.createLabel=function(params){
	 *     // set the vertical alignment of the text
	 *     params.ctx.textBaseline="middle";
	
	 *     // set the color for the text and background color behind the text
	 *     params.ctx.fillStyle=params.color?params.color:CIQ.chooseForegroundColor(params.backgroundColor);
	
	 *     if(	params.ctx.fillStyle === params.backgroundColor){
	 *         // Best effort to pick a foreground color that isn't the same as the background!
	 *         if(params.backgroundColor.toUpperCase()=="#FFFFFF")
	 *             params.ctx.fillStyle="#000000";
	 *         else
	 *             params.ctx.fillStyle="#FFFFFF";
	 *     }
	
	 *     //add the text to the canvas.
	 *     // see we are adding a dash ('- ') before the text
	 *     params.ctx.fillText('- '+params.txt, params.x + params.margin.left, params.y + params.margin.top);
	
	 *     // set the horizontal alignment of the text
	 *     params.ctx.textAlign="left";
	 * };
	 */
	CIQ.createLabel = function (params) {
		params.ctx.textBaseline = "middle";
		params.ctx.fillStyle = params.color
			? params.color
			: CIQ.chooseForegroundColor(params.backgroundColor);
		if (params.ctx.fillStyle === params.backgroundColor) {
			// Best effort to pick a foreground color that isn't the same as the background!
			if (params.backgroundColor.toUpperCase() == "#FFFFFF")
				params.ctx.fillStyle = "#000000";
			else params.ctx.fillStyle = "#FFFFFF";
		}
		params.ctx.fillText(
			params.txt,
			params.x + params.margin.left,
			params.y + params.margin.top
		);
		params.ctx.textAlign = "left";
	};
	
	/**
	 * Displays a floating label over the y axis.
	 *
	 * Draws a rectangle on the canvas, with an arrowhead on the screen, using using {@link CIQ.roundRect} with an `edge` setting of "arrow".
	 * It then calls {@link CIQ.createLabel} to print the text over this background shape; which can be customized to control the text format for these labels.
	 *
	 * Visual Reference:<br>
	 * ![roundRectArrow](roundRectArrow.png "roundRectArrow")
	 * @param  {object} params
	 * @param  {object} params.ctx    A valid HTML Canvas Context
	 * @param  {number} params.x      Left position of drawing on canvas
	 * @param  {number} params.top      Top position of drawing on canvas
	 * @param  {number} params.width  Width of rectangle
	 * @param  {number} params.height Height of rectangle
	 * @param  {number} params.radius Radius of rounding
	 * @param  {boolean} [params.fill]   Whether to fill the background, or just draw the rectangle border.
	 * @param  {number}  [params.txt]    Text for the label
	 * @param  {number}  [params.y]      Y position of drawing on canvas
	 * @param  {object}  [params.margin]     Margin around the text
	 * @param  {object}  [params.margin.left]     Left margin of text
	 * @param  {object}  [params.margin.top]     Top margin of text
	 * @param  {number}  [params.backgroundColor]  Background color. This is the background color of the rectangle.
	 * @param  {number}  [params.color] Text color
	 * @memberof CIQ
	 * @since 3.0.0 Function signature changed. This function now takes a params object instead of eight different parameters.
	 */
	CIQ.roundRectArrow = function (params) {
		CIQ.roundRect(params, "arrow");
	};
	
	/**
	 * Displays a floating label over the y axis.
	 *
	 * Draws a rectangle on the canvas, with just the right side curved corners, using using {@link CIQ.roundRect} with an `edge` setting of "flush".
	 * It then calls {@link CIQ.createLabel} to print the text over this background shape; which can be customized to control the text format for these labels.
	 *
	 * Visual Reference:<br>
	 * ![semiRoundRect](semiRoundRect.png "semiRoundRect")
	 * @param  {object} params
	 * @param  {object} params.ctx    A valid HTML Canvas Context
	 * @param  {number} params.x      Left position of drawing on canvas
	 * @param  {number} params.top      Top position of drawing on canvas
	 * @param  {number} params.width  Width of rectangle
	 * @param  {number} params.height Height of rectangle
	 * @param  {number} params.radius Radius of rounding
	 * @param  {boolean} [params.fill]   Whether to fill the background, or just draw the rectangle border.
	 * @param  {number}  [params.txt]    Text for the label
	 * @param  {number}  [params.y]      Y position of drawing on canvas
	 * @param  {object}  [params.margin]     Margin around the text
	 * @param  {object}  [params.margin.left]     Left margin of text
	 * @param  {object}  [params.margin.top]     Top margin of text
	 * @param  {number}  [params.backgroundColor]  Background color. This is the background color of the rectangle.
	 * @param  {number}  [params.color] Text color
	 * @memberof CIQ
	 * @since 3.0.0 Function signature changed. This function now takes a params object instead of eight different parameters.
	 */
	CIQ.semiRoundRect = function (params) {
		CIQ.roundRect(params, "flush");
	};
	
	/**
	 * Displays a floating label over the y axis.
	 *
	 * Draws a rectangle on the canvas using using {@link CIQ.roundRect} with a `radius` of 0
	 * It then calls {@link CIQ.createLabel} to print the text over this background shape; which can be customized to control the text format for these labels.
	 *
	 * Visual Reference:<br>
	 * ![rect](rect.png "rect")
	 * @param  {object} params
	 * @param  {object} params.ctx    A valid HTML Canvas Context
	 * @param  {number} params.x      Left position of drawing on canvas
	 * @param  {number} params.top      Top position of drawing on canvas
	 * @param  {number} params.width  Width of rectangle
	 * @param  {number} params.height Height of rectangle
	 * @param  {boolean} [params.fill]   Whether to fill the background, or just draw the rectangle border.
	 * @param  {number}  [params.txt]    Text for the label
	 * @param  {number}  [params.y]      Y position of drawing on canvas
	 * @param  {object}  [params.margin]     Margin around the text
	 * @param  {object}  [params.margin.left]     Left margin of text
	 * @param  {object}  [params.margin.top]     Top margin of text
	 * @param  {number}  [params.backgroundColor]  Background color. This is the background color of the rectangle.
	 * @param  {number}  [params.color] Text color
	 * @memberof CIQ
	 * @since 3.0.0 Function signature changed. This function now takes a params object instead of eight different parameters.
	 */
	CIQ.rect = function (params) {
		params.radius = 0;
		CIQ.roundRect(params);
	};
	
	/**
	 * Displays floating text label, without any background shapes, over the y axis.
	 *
	 * Calls {@link CIQ.createLabel}; which can be customized to control the text format for these labels.
	 * Will draw text in the color normally used for the background shape. For example, 'green' text for the up tick and 'red' text for a down tick.
	 *
	 * Visual Reference:<br>
	 * ![noop](noop.png "noop")
	 * @param {object} params
	 * @param {object} params.ctx A valid HTML Canvas Context.
	 * @param {number} params.x Left position of drawing on canvas.
	 * @param {number} params.txt Text for the label.
	 * @param {number} params.y Vertical position of drawing on canvas.
	 * @param {object} params.margin Margin around the text.
	 * @param {object} params.margin.left Left margin of text.
	 * @param {object} params.margin.top Top margin of text.
	 * @param {number} params.backgroundColor Text color; since there is no background shape.
	 *
	 * @memberof CIQ
	 * @since
	 * - 3.0.0 Function signature changed. This function now takes a params object instead of eight different parameters.
	 * - 5.2.1 Will now draw text in the color normally used for the background shape. For example, 'green' text for the up tick and 'red' text for a down tick.
	 */
	CIQ.noop = function (params) {
		params.color = params.backgroundColor;
		CIQ.createLabel(params);
	};
	
	/**
	 * Displays a floating label over the y axis.
	 *
	 * Draws a 'ticked' rectangle on the canvas, using using {@link CIQ.roundRect}.
	 * It then calls {@link CIQ.createLabel} to print the text over this background shape; which can be customized to control the text format for these labels.
	 *
	 * Visual Reference:<br>
	 * ![tickedRect](tickedRect.png "tickedRect")
	 * @param  {object} params
	 * @param  {object} params.ctx    A valid HTML Canvas Context
	 * @param  {number} params.x      Left position of drawing on canvas
	 * @param  {number} params.top      Top position of drawing on canvas
	 * @param  {number} params.width  Width of rectangle
	 * @param  {number} params.height Height of rectangle
	 * @param  {number} params.radius Radius of rounding
	 * @param  {boolean} [params.fill]   Whether to fill the background, or just draw the rectangle border.
	 * @param  {number}  [params.txt]    Text for the label
	 * @param  {number}  [params.y]      Y position of drawing on canvas
	 * @param  {object}  [params.margin]     Margin around the text
	 * @param  {object}  [params.margin.left]     Left margin of text
	 * @param  {object}  [params.margin.top]     Top margin of text
	 * @param  {number}  [params.backgroundColor]  background color. This is the background color of the rectangle.
	 * @param  {number}  [params.color] Text color
	 * @memberof CIQ
	 * @since 3.0.0 Function signature changed. This function now takes a params object instead of eight different parameters.
	 */
	
	CIQ.tickedRect = function (params) {
		CIQ.rect(params);
		var tickY = Math.round(params.top + params.height / 2) + 0.5;
		params.ctx.beginPath();
		params.ctx.moveTo(params.x - 2, tickY);
		params.ctx.lineTo(params.x, tickY);
		params.ctx.stroke();
		params.ctx.closePath();
	};
	
	/**
	 * Displays a floating label over the y axis.
	 *
	 * Draws a rectangle, with curved corners, on the canvas.
	 * It then calls {@link CIQ.createLabel} to print the text over this background shape; which can be customized to control the text format for these labels.
	 *
	 * Visual Reference:<br>
	 * ![roundRect](roundRect.png "roundRect")
	 * @param  {object} params
	 * @param  {object} params.ctx    A valid HTML Canvas Context
	 * @param  {number} params.x      Left position of drawing on canvas
	 * @param  {number} params.top      Top position of drawing on canvas
	 * @param  {number} params.width  Width of rectangle
	 * @param  {number} params.height Height of rectangle
	 * @param  {number} params.radius Radius of rounding
	 * @param  {boolean} [params.fill]   Whether to fill the background, or just draw the rectangle border.
	 * @param  {number}  [params.txt]    Text for the label
	 * @param  {number}  [params.y]      Y position of drawing on canvas
	 * @param  {object}  [params.margin]     Margin around the text
	 * @param  {object}  [params.margin.left]     Left margin of text
	 * @param  {object}  [params.margin.top]     Top margin of text
	 * @param  {number}  [params.backgroundColor]  background color. This is the background color of the rectangle.
	 * @param  {number}  [params.color] Text color
	 * @param {string} [edge] "flush","arrow"
	 * @memberof CIQ
	 * @since 3.0.0 Function signature changed. This function now takes a params object and the drawing type instead of eight different parameters.
	 * Also, this function will draw the label if `params.txt` is present, otherwise just the floating label outline will be drawn.
	 */
	CIQ.roundRect = function (params, edge) {
		if (arguments.length === 9) {
			params = {
				ctx: arguments[0],
				x: arguments[1],
				top: arguments[2],
				width: arguments[3],
				height: arguments[4],
				radius: arguments[5],
				fill: arguments[6],
				stroke: arguments[7],
				edge: arguments[8]
			};
		}
		var stroke = params.stroke;
		var x = params.x;
		var y = params.top;
		var width = params.width;
		var height = params.height;
		var radius = params.radius;
		var fill = params.fill;
		var ctx = params.ctx;
		if (typeof stroke == "undefined") {
			stroke = true;
		}
		if (typeof radius === "undefined") {
			radius = 5;
			if (width < 0) radius = -5;
		}
		var yradius = width < 0 ? radius * -1 : radius;
		if (radius && !edge) x = x - 1; // Just a smidge more
	
		var xr = x + radius,
			xw = x + width,
			yr = y + yradius,
			yh = y + height;
		var xwr = xw - radius,
			yhr = yh - yradius;
		ctx.beginPath();
		ctx.moveTo(xr, y);
		ctx.lineTo(xwr, y);
	
		ctx.quadraticCurveTo(xw, y, xw, yr);
		ctx.lineTo(xw, yhr);
		ctx.quadraticCurveTo(xw, yh, xwr, yh);
		ctx.lineTo(xr, yh);
	
		if (edge == "flush") {
			ctx.lineTo(x, yh);
			ctx.lineTo(x, y);
		} else if (edge == "arrow") {
			ctx.quadraticCurveTo(x, yh, x - radius, yhr);
			var multiplier = width < 0 ? 1 : -1;
			ctx.lineTo(x + (height / 2) * multiplier, y + height / 2); // right arrow tip
			ctx.lineTo(x - radius, yr);
			ctx.quadraticCurveTo(x, y, xr, y);
		} else {
			ctx.quadraticCurveTo(x, yh, x, yhr);
			ctx.lineTo(x, yr);
			ctx.quadraticCurveTo(x, y, xr, y);
		}
		ctx.closePath();
		if (params.backgroundColor) ctx.fillStyle = params.backgroundColor;
	
		if (stroke) {
			ctx.stroke();
		}
		if (fill) {
			ctx.fill();
		}
		if (params.txt) CIQ.createLabel(params);
	};
	
	/**
	 * Defines an object used for rendering the Y-axis on a panel.
	 *
	 * Each panel object will **automatically** include a YAxis object, which can be adjusted immediately after declaring your `new CIQ.ChartEngine();`<br>
	 * Any adjustments to the y-axis members after it has been rendered will require a [draw()]{@link CIQ.ChartEngine#draw} call to apply the changes. A call to [initializeChart()]{@link CIQ.ChartEngine#initializeChart} may be required as well, depending on the setting being changed. See examples.
	 *
	 *  Also see:
	 * - {@link CIQ.ChartEngine#yaxisLabelStyle}
	 * - {@link CIQ.ChartEngine#yTolerance}
	 * - {@link CIQ.ChartEngine.Chart#yaxisPaddingRight}
	 * - {@link CIQ.ChartEngine.Chart#yaxisPaddingLeft}
	 *
	 * For full customization instructions see:
	 *  - {@tutorial Gridlines and axis labels}
	 *  - {@link CIQ.ChartEngine.AdvancedInjectable#createYAxis}
	 *  - {@link CIQ.ChartEngine.AdvancedInjectable#drawYAxis}
	 *
	 * Example: stxx.panels['chart'].yAxis
	 *
	 * Example: stxx.chart.yAxis (convenience shortcut for accessing the main panel object - same as above)
	 *
	 * Example: stxx.panels['Aroon (14)'].yAxis
	 *
	 * **Note:** If modifying a y-axis placement setting (widht, margins, position left/right, etc) after the axis has been rendered, you will need to call
	 * {@link CIQ.ChartEngine#calculateYAxisMargins} or {@link CIQ.ChartEngine#calculateYAxisPositions} followed by {@link CIQ.ChartEngine#draw} to activate the change.
	 *
	 * @constructor
	 * @name  CIQ.ChartEngine.YAxis
	 * @param {object} init Object containing custom values for Y-axis members
	 * @example
	 * // here is an example on how to override the default top and bottom margins after the initial axis has already been rendered
	 * stxx.loadChart(symbol, {masterData: yourData}, function () {
	 * 	// callback - your code to be executed after the chart is loaded
	 * 	stxx.chart.yAxis.initialMarginTop=50;
	 * 	stxx.chart.yAxis.initialMarginBottom=50;
	 * 	stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // must recalculate the margins after they are changed.
	 * 	stxx.draw();
	 * });
	 * @example
	 * // here is an example on how to override the default top and bottom margins before the initial axis has been rendered
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.setPeriodicity({period:1, interval:1, timeUnit:"minute"}); 			// set your default periodicity to match your data. In this case one minute.
	 * stxx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
	 * stxx.chart.yAxis.initialMarginBottom=50;
	 * stxx.loadChart("SPY", {masterData: yourData});
	 * @example
	 * // here is an example on how to turn off the last price label (main chart panel) before the initial axis has already been rendered
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.chart.panel.yAxis.drawCurrentPriceLabel=false;
	 *
	 * @since 5.1.0 Created a name member which is used to determine if the y-axis is the same as another.
	 */
	CIQ.ChartEngine.YAxis = function (init) {
		for (var field in init) this[field] = init[field];
		if (!this.name) this.name = CIQ.uniqueID();
		if (this.position == "none") this.width = 0;
	};
	
	CIQ.extend(
		CIQ.ChartEngine.YAxis.prototype,
		{
			high: null, // High value on y axis (read only)
			low: null, // Low value on y axis (read only)
			shadow: null, // high - low (read only)
			logHigh: null, // High log value on y axis (read only)
			logLow: null, // Low log value on y axis (read only)
			logShadow: null, // logHigh - logLow (read only)
			multiplier: null, // Computed automatically. Divide pixel by this to get the price (then add to low). Or multiply price by this to get the pixel (then add to top)
			bottom: null, // calculated automatically (panel.bottom-yAxis.bottomOffset)
			top: null, // calculated automatically (panel.top+yAxis.topOffset;)
			height: null, // bottom - top
			left: null, // calculated left position on canvas to begin drawing.
			width: null, // calculated width of y axis
			renderers: [], // calculated automatically, array of renderers plotting on this axis
			studies: [] // calculated automatically, array of studies plotting on this axis
		},
		true
	);
	
	/**
	 * Default setting for the array that determines how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
	 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
	 * See {@link CIQ.ChartEngine.YAxis#shadowBreaks}
	 * @type array
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since
	 * - 2015-11-1
	 * - 5.2.0 Additional break added.
	 * @default
	 */
	CIQ.ChartEngine.YAxis.defaultShadowBreaks = [
		[1000, 2],
		[5, 4],
		[0.001, 8]
	];
	
	/**
	 * Alternative setting (for small charts)  array that determines how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
	 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
	 * See {@link CIQ.ChartEngine.YAxis#shadowBreaks}
	 * @type array
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 2015-11-1
	 * @default
	 */
	CIQ.ChartEngine.YAxis.smallChartShadowBreaks = [
		[10, 2],
		[1, 4]
	];
	
	/**
	 * Controls maximum number of decimal places to ever display on a y-axis floating price label.
	 *
	 * Set to the maximum decimal places from 0 to 10, or leave null and the chart will choose automatically based on {@link CIQ.ChartEngine.YAxis#shadowBreaks}.
	 * - See {@link CIQ.ChartEngine.YAxis#decimalPlaces} for controlling decimal places on the axis itself.
	 * - See {@link CIQ.ChartEngine.YAxis#width} and {@link CIQ.ChartEngine.Chart#dynamicYAxis} to manage the width of the y axis.
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 5.2.1 Default changed to null.
	 */
	CIQ.ChartEngine.YAxis.prototype.maxDecimalPlaces = null;
	
	/**
	 * Optionally hard set the high (top value) of the yAxis (for instance when plotting 0 - 100% charts)
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.max = null;
	
	/**
	 * Optionally hard set the low (bottom value) of the yAxis (for instance when plotting 0 - 100% charts)
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.min = null;
	
	/**
	 * Controls the number of decimal places on the y axis labels.
	 *
	 * Set to the preferred number of decimal places from 0 to 10, or leave null and the chart will choose automatically based on {@link CIQ.ChartEngine.YAxis#shadowBreaks}
	 *
	 * Each y axis will make its own determination, so to override this value for all axes, you must adjust the y axis prototype.
	 * <br>Example: `CIQ.ChartEngine.YAxis.prototype.decimalPlaces=4;`
	 *
	 * **Note:** study panel axis may be condensed using {@link CIQ.condenseInt}. See {@link CIQ.ChartEngine#formatYAxisPrice} for all details.
	 *
	 * - See {@link CIQ.ChartEngine.YAxis#maxDecimalPlaces} for further controlling decimal places on floating labels.<br>
	 * - See {@link CIQ.ChartEngine.YAxis#width} and {@link CIQ.ChartEngine.Chart#dynamicYAxis} to manage the width of the y axis.
	 * - See {@link CIQ.ChartEngine.YAxis#shadowBreaks} to override how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
	 *
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 5.2.0 Default changed to null.
	 */
	CIQ.ChartEngine.YAxis.prototype.decimalPlaces = null;
	
	/**
	 * Ideal size between y-axis values in pixels. Leave null to automatically calculate.
	 * See {@tutorial Gridlines and axis labels} for additional details.
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.idealTickSizePixels = null;
	
	/**
	 * Set to specify that the y-axis vertical grid be drawn with specific intervals between ticks.
	 * This amount will be overridden if it will result  in y axis crowding.
	 * In which chase, multiples of the original interval will be used.
	 * For example, if `.25` is selected, and that will cause labels to be on top of or too close to each other, `.50` may be used.
	 * Crowding is prevented by allowing for a minimum of space equating the y-axis font height between labels.
	 *
	 * **This parameter is also used in the 'Trade From Chart' (TFC) module**. If set, it will force the widget to skip certain price values and instead 'snap' to your desired intervals. This will guarantee that an order is only placed at the allowed price intervals for the security in question.
	 *
	 * **Note that this parameter will be ignored if {@link CIQ.ChartEngine.YAxis#pretty} is set to `true`. If you require specific price intervals, please set {@link CIQ.ChartEngine.YAxis#pretty} to 'false' before setting `minimumPriceTick`**
	 *
	 * Visual Reference:<br>
	 * ![yAxis.minimumPriceTick](yAxis.minimumPriceTick.png "yAxis.minimumPriceTick")
	 *
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example
	 * // Declare a CIQ.ChartEngine object. This is the main object for drawing charts
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * // set interval between ticks
	 * stxx.chart.yAxis.minimumPriceTick=.50;
	 */
	CIQ.ChartEngine.YAxis.prototype.minimumPriceTick = null;
	
	/**
	 * Set to specify that the y-axis vertical grid be drawn with fractional intervals.
	 *
	 * This is checked in {@link CIQ.ChartEngine.AdvancedInjectable#drawYAxis} and if it is not null,
	 * and there is no existing [yAxis.priceFormatter]{@link CIQ.ChartEngine.YAxis#priceFormatter}, one is created to specially format the y-axis ticks.
	 *
	 * {@link CIQ.ChartEngine.YAxis#decimalPlaces} and {@link CIQ.ChartEngine.YAxis#maxDecimalPlaces} will not be honored in this mode.
	 *
	 * To disable the formatting you must reset both the yAxis.priceFormatter and this fractional object to 'null'.
	 * <br>Example:
	 * ```
	 * stxx.chart.yAxis.priceFormatter=stxx.chart.yAxis.fractional=null;
	 * ```
	 *
	 * If the outlined logic is not suitable for your needs, you will need to create your own [yAxis.priceFormatter]{@link CIQ.ChartEngine.YAxis#priceFormatter}
	 *
	 * @type object
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example <caption> Usage example:</caption>
	 * // Declare a CIQ.ChartEngine object. This is the main object for drawing charts
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * // set axis to display in 1/32nds; for example, 100 5/32 will display as 100'05.  If there is a price midway between
	 * // two ticks (for example, 11/64), a plus (+) will follow the price; for example 100 11/64 will display as 100'11+.
	 * stxx.chart.yAxis.fractional={
	 *		formatter: "'",				// This is the character used to separate he whole number portion from the numerator (' default)
	 *		resolution: 1/32			// Set to smallest increment for the quoted amounts
	 * }
	 *
	 *  @example <caption>Code used to perform the fractional formatting:</caption>
		if(!yAxis.fractional.resolution) yAxis.fractional.resolution=yAxis.minimumPrice;
		if(!yAxis.fractional.formatter) yAxis.fractional.formatter="'";
		if(!yAxis.priceFormatter) yAxis.priceFormatter=function(stx, panel, price){
			if( !yAxis.fractional ) return;
			var sign='';
			if( price < 0 ) {
				sign="-";
				price= Math.abs(price);
			}
			var whole=Math.floor(Math.round(price/yAxis.fractional.resolution)*yAxis.fractional.resolution);
			var frac=Math.round((price-whole)/yAxis.fractional.resolution);
			var _nds=Math.floor(frac);
			return sign+whole+yAxis.fractional.formatter+(_nds<10?"0":"")+_nds+(frac-_nds>=0.5?"+":"");
		};
	 */
	CIQ.ChartEngine.YAxis.prototype.fractional = null;
	
	/**
	 * Set to `true` to draw tick marks and a vertical border line at the edge of the y-axis  (use with {@link CIQ.ChartEngine.Chart#yaxisPaddingRight} and {@link CIQ.ChartEngine.Chart#yaxisPaddingLeft})
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.displayBorder = true;
	
	/**
	 * Set to `false` to hide grid lines. See {@tutorial Gridlines and axis labels} for additional details.
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example <caption> On a specific panel:</caption>
	 * // Be sure to get the panel name directly from the panels object as it may contain ZWNJ characters.
	 * // See http://documentation.chartiq.com/CIQ.ChartEngine.html#layout%5B%60panels%60%5D
	 * stxx.layout.panels[panel_name_here].yAxis.displayGridLines=false;
	 * @example <caption>  On the primary chart panel:</caption>
	 * stxx.chart.yAxis.displayGridLines=false;
	 */
	CIQ.ChartEngine.YAxis.prototype.displayGridLines = true;
	
	/**
	 * Switch to 'temporarily' hide the y-axis. Set to `true' to activate.
	 * Will not modify the location of the axis; to do that use {@link CIQ.ChartEngine#setYAxisPosition} instead.
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.noDraw = null;
	
	/**
	 * Set to `false` to hide the current price label <b>in the main panel's y-axis</b>.
	 *
	 * Please note that the main panel's current price label will only display if there is a current price available.
	 * If you have not loaded enough datapoints to overlap into the current time, as determined by the device's clock, the label will not display.
	 *
	 * The y-axis floating label colors are based on the difference between the most current close and the **previous** datapoint close, not the difference between the current datapoint's open and its close.
	 *
	 * See {@link CIQ.ChartEngine.AdvancedInjectable#drawCurrentHR}
	 *
	 * Visual Reference:<br>
	 * ![yAxis.drawCurrentPriceLabel](drawCurrentPriceLabel.png "yAxis.drawCurrentPriceLabel")
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 04-2015
	 */
	CIQ.ChartEngine.YAxis.prototype.drawCurrentPriceLabel = true;
	
	/**
	 * Set to `false` to hide the series price labels <b>in the main panel's y-axis</b>.
	 *
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 3.0.0
	 */
	CIQ.ChartEngine.YAxis.prototype.drawSeriesPriceLabels = true;
	
	/**
	 * Set to false to hide **all** price labels on the particular y axis.
	 * <br>See {@link CIQ.ChartEngine.YAxis#drawCurrentPriceLabel} to disable just the current price label on the main chart panel.
	 * <br>See <a href="CIQ.ChartEngine.html#preferences%5B%60labels%60%5D">CIQ.ChartEngine.preferences.labels</a> to disable just the last value label on studies.
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 04-2015
	 */
	CIQ.ChartEngine.YAxis.prototype.drawPriceLabels = true;
	
	/**
	 * When `true`, will attempt to create grid lines that approximate a `golden ratio` between x and y axis by basing grid on {@link CIQ.ChartEngine.YAxis#idealTickSizePixels}.
	 * This creates an "airy" modern looking chart.
	 * If set to false, each axis will be adjusted separately and may create long and narrow rectangular grids depending on date or price range.
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since
	 * - 04-2015
	 * - 4.0.0 Now defaults to true.
	 */
	CIQ.ChartEngine.YAxis.prototype.goldenRatioYAxis = true;
	
	/**
	 * Shape of the floating y axis label.
	 *
	 * Available options:
	 *  - ["roundRectArrow"]{@link CIQ.roundRectArrow}
	 *  - ["semiRoundRect"]{@link CIQ.semiRoundRect}
	 *  - ["roundRect"]{@link CIQ.roundRect}
	 *  - ["tickedRect"]{@link CIQ.tickedRect}
	 *  - ["rect"]{@link CIQ.rect}
	 *  - ["noop"]{@link CIQ.noop}
	 *
	 * It will default to {@link CIQ.ChartEngine#yaxisLabelStyle}.
	 * This could be set independently on each panel if desired.
	 * @type string
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 04-2015
	 * @example
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.chart.yAxis.yaxisLabelStyle="rect"
	 */
	CIQ.ChartEngine.YAxis.prototype.yaxisLabelStyle = null;
	
	/**
	 * Set to `true` to right justify the yaxis labels
	 * Set to `false` to force-left justify the labels, even when the axis is on the left.
	 * Set to null to have the justification automatically adjusted based on the axis position. Right axis will justify left, and left axis will justify right.
	 *
	 *
	 * This setting does not control the floating last price. See {@link CIQ.ChartEngine.AdvancedInjectable#drawCurrentHR} and {@link CIQ.ChartEngine#createYAxisLabel}
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since
	 * - 15-07-01
	 * - 6.2.0 Formalized distinction between null and false values.
	 */
	CIQ.ChartEngine.YAxis.prototype.justifyRight = null;
	
	/**
	 * Setting to true causes the y-axis and all linked drawings, series and studies to display inverted (flipped) from its previous state.
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 6.3.0
	 */
	CIQ.ChartEngine.YAxis.prototype.flipped = false;
	
	/**
	 * Set to true to put a rectangle behind the yaxis text (use with {@link CIQ.ChartEngine.Chart#yaxisPaddingRight} and {@link CIQ.ChartEngine.Chart#yaxisPaddingLeft})
	 * @type boolean
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 15-07-01
	 */
	CIQ.ChartEngine.YAxis.prototype.textBackground = false;
	
	/**
	 * Optional function used to override default formatting of Y-axis values, including the floating HUD value of the crosshair.
	 *
	 * Expected format :
	 *
	 * 		function(stx, panel, price, decimalPlaces)
	 *
	 * Parameters:
	 *
	 * 		stx           - {@link CIQ.ChartEngine}       - The chart object
	 *		panel         - {@link CIQ.ChartEngine.Panel} - The panel
	 *		price         - number                - The price to format
	 *		decimalPlaces - number                - Optional - Number of decimal places to use
	 *													(may not always be present)
	 *
	 * Returns:
	 *
	 *		text - Formatted text label for the price
	 *
	 * @type function
	 * @example
	 * stxx.chart.yAxis.priceFormatter=function(stx, panel, price, decimalPlaces){
	 * 	var convertedPrice;
	 * 	  // add our logic here to convert 'price' to 'convertedPrice'
	 *    return convertedPrice; // string
	 * }
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.priceFormatter = null;
	
	/**
	 * Sets the y-axis bottom on any panel.
	 * Rendering will start this number of pixels above the panel's bottom.
	 * Note that {@link CIQ.ChartEngine#adjustPanelPositions} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
	 *
	 * Visual Reference:<br>
	 * ![yAxis.width](yAxis.bottomOffset.png "yAxis.bottomOffset")
	 * ![yAxis.width](yAxis.bottomTopOffset.png "yAxis.bottomTopOffset")
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example
	 * // The list of current panels can be found in "stxx.panels".
	 * stxx.panels[panelName].yAxis.bottomOffset=20;
	 * stxx.panels[panelName].yAxis.topOffset=60;
	 * stxx.adjustPanelPositions();	// !!!! must recalculate the margins after they are changed. !!!!
	 * stxx.draw();
	 */
	CIQ.ChartEngine.YAxis.prototype.bottomOffset = 0;
	
	/**
	 * Sets y-axis top on Study panels.
	 * Rendering will start this number of pixels below the panel's top.
	 * Note that {@link CIQ.ChartEngine#adjustPanelPositions} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
	 *
	 * Visual Reference:<br>
	 * ![yAxis.width](yAxis.bottomTopOffset.png "yAxis.bottomTopOffset")
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example
	 * // The list of current panels can be found in "stxx.panels".
	 * stxx.panels[panelName].yAxis.bottomOffset=20;
	 * stxx.panels[panelName].yAxis.topOffset=60;
	 * stxx.adjustPanelPositions();	// !!!! must recalculate the margins after they are changed. !!!!
	 * stxx.draw();
	 */
	CIQ.ChartEngine.YAxis.prototype.topOffset = 0;
	
	/**
	 * Set this to automatically compress and offset the y-axis so that this many pixels of white space are above the display.
	 * Note that {@link CIQ.ChartEngine#calculateYAxisMargins} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
	 *
	 * Visual Reference:<br>
	 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 *
	 * @example
	 * // Here is an example on how to override the default top and bottom margins before the initial axis has been rendered.
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.setPeriodicity({period:1, interval:1, timeUnit:"minute"}); // Set your default periodicity to match your data; in this case, one minute.
	 * stxx.chart.yAxis.initialMarginTop = 50; // Set default margins so they do not bump on to the legend.
	 * stxx.chart.yAxis.initialMarginBottom = 50;
	 * stxx.loadChart("SPY", {masterData: yourData});
	 *
	 * @example
	 * // Here is an example on how to override the default top and bottom margins after the initial axis has already been rendered.
	 * stxx.loadChart(symbol, {masterData: yourData}, function () {
	 * 	var yAxis = stxx.chart.yAxis;
	 *
	 * 	yAxis.initialMarginTop = 50;
	 * 	yAxis.initialMarginBottom = 50;
	 *
	 * 	// !! Must recalculate margins after they are changed!
	 * 	stxx.calculateYAxisMargins(yAxis);
	 * 	stxx.draw();
	 * });
	 *
	 * @example
	 * // Here is an example on how to override the default top and bottom margins for a specific panel after the initial axis has already been rendered.
	 * // The list of current panels can be found in stxx.panels.
	 * stxx.panels[panelName].yAxis.initialMarginTop = 100;
	 * stxx.panels[panelName].yAxis.initialMarginBottom = 100;
	 * stxx.calculateYAxisMargins(stxx.panels[panelName].yAxis); // !!!! Must recalculate the margins after they are changed. !!!!
	 * stxx.draw();
	 */
	CIQ.ChartEngine.YAxis.prototype.initialMarginTop = 10;
	
	/**
	 * Set this to automatically compress and offset the y-axis so that this many pixels of white space are below the display.
	 * Note that {@link CIQ.ChartEngine#calculateYAxisMargins} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
	 *
	 * Visual Reference:<br>
	 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 *
	 * @example
	 * // Here is an example on how to override the default top and bottom margins before the initial axis has been rendered.
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.setPeriodicity({period:1, interval:1, timeUnit:"minute"}); // Set your default periodicity to match your data; in this case, one minute.
	 * stxx.chart.yAxis.initialMarginTop = 50; // Set default margins so they do not bump on to the legend.
	 * stxx.chart.yAxis.initialMarginBottom = 50;
	 * stxx.loadChart("SPY", {masterData: yourData});
	 * @example
	 * // Here is an example on how to override the default top and bottom margins after the initial axis has already been rendered.
	 * stxx.loadChart(symbol, {masterData: yourData}, function() {
	 * 	// Callback -- your code to be executed after the chart is loaded.
	 * 	stxx.chart.yAxis.initialMarginTop = 50;
	 * 	stxx.chart.yAxis.initialMarginBottom = 50;
	 * 	stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // !!!! Must recalculate the margins after they are changed. !!!!
	 * 	stxx.draw();
	 * });
	 */
	CIQ.ChartEngine.YAxis.prototype.initialMarginBottom = 10;
	
	/**
	 * Sets the vertical zoom level for the y axis and all its associated series.
	 *
	 * It can be set programmatically or by the user as they grab the y axis and move it up or down.
	 *
	 * The value represents the number of pixels to zoomed in or out, and can be positive or negative.
	 * The larger the number, the more it zooms out to show a wider price range.
	 *
	 * Please note that the zoom level will be reset as determined by {@link CIQ.ChartEngine.YAxis#initialMarginTop} and
	 * {@link CIQ.ChartEngine.YAxis#initialMarginBottom} when a {@link CIQ.ChartEngine#loadChart} is rendered, the {@link CIQ.ChartEngine#home} button is pressed, or when {@link CIQ.ChartEngine.AdvancedInjectable#touchDoubleClick} is activated on a touch device.
	 *
	 * @type number
	 * @default
	 * @example
	 * // programmatically change the vertical zoom level for the primary chart yAxis
	 * stxx.chart.yAxis.zoom=100;stxx.draw();
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.zoom = 0;
	
	/**
	 * set this to the number of pixels to offset the y-axis, positive or negative.
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 */
	CIQ.ChartEngine.YAxis.prototype.scroll = 0;
	
	/**
	 * Set this to a factor to scale the y axis.
	 *
	 * The zoom value will be internality adjusted based on the value of this property as follows:
	 * ```
	 * zoom = (1-heightFactor)*height + initial margin settings
	 * ```
	 * For example, use this to easily reduce the scale of the axis by 20%, set heightFactor=0.8.
	 *
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 7.0.0
	 */
	CIQ.ChartEngine.YAxis.prototype.heightFactor = 1;
	
	// get/set width to allow {@link CIQ.ChartEngine.Chart#dynamicYAxis} feature
	// to set _dynamicWidth instead of _width. This allows user widths to be
	// restored easily when the feature is not needed.
	Object.defineProperty(CIQ.ChartEngine.YAxis.prototype, "width", {
		configurable: true,
		enumerable: true,
		get: function () {
			// _dynamicWidth is set by {@link CIQ.ChartEngine#drawYAxis} and
			// cleared by {@link CIQ.ChartEngine.Chart#resetDynamicYAxis}
			return this._dynamicWidth || this._width;
		},
		set: function (value) {
			this._width = value;
			// the calculated width is less than user value, getter should return the user value
			if (this._dynamicWidth < value) this._dynamicWidth = NaN;
		}
	});
	
	/**
	 * The y-axis width in pixels.
	 *
	 * ![yAxis.width](yAxis.width.png "yAxis.width")
	 *
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 *
	 * @see {@link CIQ.ChartEngine.Chart#dynamicYAxis} to set the y-axis width dynamically.
	 * @see {@link CIQ.ChartEngine.Chart#yaxisPaddingRight} and
	 * {@link CIQ.ChartEngine.Chart#yaxisPaddingLeft} for information on how to overlay the y-axis onto
	 * the chart.
	 *
	 * @example <caption>Set the y-axis width.</caption>
	 * stxx.chart.yAxis.width = stxx.chart.yAxis.smallScreenWidth;
	 * // Must call the following two lines to activate the update if the axis is already drawn.
	 * stxx.calculateYAxisPositions();
	 * stxx.draw();
	 *
	 * @example <caption>Reset the y-axis width to the default.</caption>
	 * stxx.chart.yAxis.width = CIQ.ChartEngine.YAxis.prototype.width;
	 * stxx.calculateYAxisPositions();
	 * stxx.draw();
	 */
	CIQ.ChartEngine.YAxis.prototype.width = 60;
	
	/**
	 * The y-axis width in pixels if the screen is small (typically, smaller than the break-sm
	 * breakpoint). See the {@link CIQ.ChartEngine.Chart#breakpoint} property and
	 * {@link CIQ.UI.Chart#getBreakpoint} method for more information on breakpoints.
	 *
	 * @type number
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.YAxis.prototype.smallScreenWidth = 50;
	
	/**
	 * Override the default stx_yaxis style for text by setting this to the desired CSS style. This would typically be used to set a secondary axis to a particular color.
	 * @type string
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 15-07-01
	 */
	CIQ.ChartEngine.YAxis.prototype.textStyle = null;
	
	/**
	 * Set to "left" or "right" to **initialize** the y-axis location.
	 *
	 * By default y-axis are drawn on the right side of the chart.
	 * The main y-axis for any study panel will follow the main chart axis as long as this is set to null.
	 *
	 * Do not use this method to change the location of an existing y-axis.
	 * Once initialized, y axis location can be changed at any time by calling {@link CIQ.ChartEngine#setYAxisPosition}
	 *
	 * @type string
	 * @default
	 * @memberof CIQ.ChartEngine.YAxis
	 * @example  <caption>Pre-set the main y-axis for the chart on the left; **before it is initially rendered**.</caption>
	 * stxx.chart.yAxis.position = 'left';
	 * @example  <caption>Re-set the main y-axis for the chart on the right; **after it is initially rendered**.</caption>
	 * stxx.setYAxisPosition(stxx.chart.yAxis,'right');
	 * @since 15-07-01
	 */
	CIQ.ChartEngine.YAxis.prototype.position = null;
	
	/**
	 * If true then uses the "pretty" algorithm instead of the "best fit" algorithm. The pretty algorithm
	 * uses the values specified in {@link CIQ.ChartEngine.YAxis#increments} to set axis label locations.
	 *
	 * **Note that this algorithm will override the {@link CIQ.ChartEngine.YAxis#minimumPriceTick}. If you require specific price intervals, please set this parameter to 'false' before setting `minimumPriceTick`**
	 *
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 2015-11-1
	 * @type boolean
	 * @default
	 */
	CIQ.ChartEngine.YAxis.prototype.pretty = true;
	
	/**
	 * Values used by the {@link CIQ.ChartEngine.YAxis#pretty} algorithm to set axis label locations.
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 2015-11-1
	 * @type array
	 * @default
	 */
	CIQ.ChartEngine.YAxis.prototype.increments = [1, 2.5, 5];
	
	/**
	 * If true then uses an additional step in the "pretty" algorithm for the log
	 * scale. This allows the algorithm to lower the grid to fill large visual gaps.
	 * The "increments" are not fully respected by this approach.
	 *
	 * Only applicable when using *both* pretty mode and semiLog.
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 2016-03-11
	 * @type boolean
	 * @default
	 */
	CIQ.ChartEngine.YAxis.prototype.prettySemiLog = true;
	
	/**
	 * A matrix used to determine how many decimal places to print on y axis labels based on the size of the shadow (the difference between chart high and chart low).
	 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
	 * See {@link CIQ.ChartEngine.YAxis.defaultShadowBreaks} and {@link CIQ.ChartEngine.YAxis.smallChartShadowBreaks} for default settings.
	 *
	 * This can be overridden, however, by setting{@link CIQ.ChartEngine.YAxis#decimalPlaces}.
	 * If you wish to further configure the current price label floating over the y axis to display less decimal places than the axis labels, set {@link CIQ.ChartEngine.YAxis#maxDecimalPlaces}.
	 * Also see {@link CIQ.ChartEngine.Chart#dynamicYAxis} to allow the y axis to automatically determine its width based on the text length of quotes in a dataSet.
	 *
	 * @type array
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 2015-11-1
	 * @example
	 * stxx.chart.yAxis.shadowBreaks=CIQ.ChartEngine.YAxis.defaultShadowBreaks;
	 * @example
	 * stxx.chart.yAxis.shadowBreaks=CIQ.ChartEngine.YAxis.smallChartShadowBreaks;
	 */
	CIQ.ChartEngine.YAxis.prototype.shadowBreaks =
		CIQ.ChartEngine.YAxis.defaultShadowBreaks;
	
	/**
	 * Necessary for abstract calling
	 * @param {CIQ.ChartEngine} stx A chart engine instance
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 7.1.0
	 * @private
	 */
	CIQ.ChartEngine.YAxis.prototype.getYAxis = function (stx) {
		return this;
	};
	
	/**
	 * Convenience function for checking whether multiple plots share this axis.
	 *
	 * @param {CIQ.ChartEngine} stx A chart engine instance.
	 * @param {boolean} includeDependents Set to true to count dependent renderers among the plots sharing the axis.
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since
	 * - 7.2.0
	 * - 7.3.0 Added `stx` and `includeDependents` parameters.
	 */
	CIQ.ChartEngine.YAxis.prototype.isShared = function (stx, includeDependents) {
		var studyLength = this.studies.length,
			rendererLength = this.renderers.length;
		if (studyLength > 1) return true; // more than 1 study, obviously shared
		if (rendererLength && studyLength) return true; // 1 study and at least 1 renderer, obviously shared
		if (!rendererLength) return false; // only 1 study, obviously not shared
		// at this point we have only renderers
		if (rendererLength > 1 && includeDependents) return true; // more than 1 renderer total, shared
		for (var r = rendererLength - 1; r >= 0; r--) {
			// count independent renderers
			if (stx.chart.seriesRenderers[this.renderers[r]].params.dependentOf)
				rendererLength--;
		}
		return rendererLength > 1;
	};
	
	/**
	 * Sets the background of the axis when hovering over it to indicate more action are available, such as zooming and dragging.
	 *
	 * To disable color change on hover, set to a stub function:
	 * ```
	 * CIQ.ChartEngine.YAxis.prototype.setBackground=function(stx, params){};
	 * ```
	 *
	 * @param {CIQ.ChartEngine} stx A chart engine instance
	 * @param {object} [params]
	 * @param {string} [params.color] background color
	 * @param {number} [params.opacity] opacity of background color
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 7.1.0
	 */
	CIQ.ChartEngine.YAxis.prototype.setBackground = function (stx, params) {
		if (!params) params = {};
		if (!params.color) params.color = "auto";
		var points = [
			[this.left, this.top],
			[this.left, this.bottom],
			[this.left + this.width, this.bottom],
			[this.left + this.width, this.top]
		];
		CIQ.fillArea(stx, points, { color: params.color, opacity: params.opacity });
	};
	
	/**
	 * Sets the y-axis width based on the `breakpoint` parameter.
	 *
	 * @param {string} breakpoint The responsive design breakpoint that determines the y-axis width.
	 * 		See the {@link CIQ.UI.Chart#getBreakpoint} method for valid values.
	 *
	 * @memberof CIQ.ChartEngine.YAxis
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.YAxis.prototype.setBreakpointWidth = function (breakpoint) {
		if (!breakpoint) return;
		const { width, smallScreenWidth } = CIQ.ChartEngine.YAxis.prototype;
		const smallScreen = breakpoint === "break-sm";
		this.width = smallScreen ? smallScreenWidth : width;
	};
	
	/**
	 * Returns the minimum spacing required between the latest tick on the chart and the price label to prevent data form colliding with the label,
	 * which depending on style, may protrude into the chart area ( ie. roundRectArrow ).
	 *
	 * See {@link CIQ.ChartEngine#yaxisLabelStyle} to set different label styles
	 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
	 * @param  {string} chartType	The chart rendering type (candle, line, etc)
	 * @returns  {number} pixels to offset
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0
	 * - 5.1.0 Removed `stx` parameter.
	 */
	CIQ.ChartEngine.prototype.getLabelOffsetInPixels = function (chart, chartType) {
		var isLineType =
			!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars;
		if (
			this.yaxisLabelStyle == "roundRectArrow" &&
			!(isLineType && this.extendLastTick && chart.yaxisPaddingRight !== 0)
		) {
			// Special case when we have a pointy arrow we want the current tick to be right
			// at the arrow point, not buried underneath it
			// unless the developer set the flags to extend the line/mountain to the very edge of the chart.
			// or unless the y-axis is overlaying the chart
			var margin = 3; // should be the same from createYAxisLabel
			var height = this.getCanvasFontSize("stx_yaxis") + margin * 2;
			return height * 0.66;
		}
		return 0;
	};
	
	/**
	 * Causes the primary y-axis and all linked drawings, series and studies to display inverted (flipped) from its previous state.
	 *
	 * Calling this method multiple times will cause a reciprocal effect.
	 * So calling it on a upside-down chart will cause it to display normally and calling it on a normal chart will cause it to display upside-down.
	 *
	 * Sets <a href="CIQ.ChartEngine.html#layout%5B%60flipped%60%5D">CIQ.ChartEngine.layout.flipped</a> and {@link CIQ.ChartEngine.YAxis#flipped} for the main chart.
	 *
	 * To manage this functionality on secondary axis directly configure its {@link CIQ.ChartEngine.YAxis#flipped} property.
	 * @param {boolean} flip True to flip chart, false to restore it
	 * @memberof CIQ.ChartEngine
	 * @since 6.3.0
	 */
	CIQ.ChartEngine.prototype.flipChart = function (flip) {
		if (this.layout.flipped == flip) return;
		this.layout.flipped = flip;
		this.chart.yAxis.flipped = flip;
		this.changeOccurred("layout");
		this.draw();
	};
	
	/**
	 * Calculates and sets the value of zoom and scroll for y-axis based on yAxis.initialMarginTop and yAxis.initialMarginBottom.
	 * This method will automatically translate those into starting scroll and zoom factors.
	 * If the combined initial values are greater than the y-axis height, then both zoom and scroll will be reset to 0;
	 * @param {CIQ.ChartEngine.YAxis} yAxis The yAxis to reset
	 * @memberof CIQ.ChartEngine
	 * @since 7.0.0 Takes into account new field `yAxis.heightFactor`.
	 */
	CIQ.ChartEngine.prototype.calculateYAxisMargins = function (yAxis) {
		if (yAxis.heightFactor) yAxis.zoom = yAxis.height * (1 - yAxis.heightFactor);
		yAxis.zoom += yAxis.initialMarginTop + yAxis.initialMarginBottom;
		yAxis.scroll = (yAxis.initialMarginTop - yAxis.initialMarginBottom) / 2;
		if (yAxis.zoom > yAxis.height) {
			yAxis.zoom = 0; // If the zoom is greater than the height then we'll have an upside down y-axis
			yAxis.scroll = 0;
		}
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 *
	 * Resets the y-axis width to the default, {@link CIQ.ChartEngine.YAxis#width}.
	 *
	 * Called internally whenever the y-axis label width might change. This function can also be
	 * called programmatically at any time if the default behavior needs to be altered.
	 *
	 * @param {object} [params] Function parameters.
	 * @param {boolean} [params.noRecalculate=false] When true,
	 * 		{@link CIQ.ChartEngine#calculateYAxisPositions} will never be called.
	 * @param {string} [params.chartName] Identifies the chart for which the y-axis dynamic width is
	 * 		reset.
	 *
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias resetDynamicYAxis
	 * @see {@link CIQ.ChartEngine.Chart#dynamicYAxis}, the flag that enables this feature.
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.prototype.resetDynamicYAxis = function (params) {
		if (this.runPrepend("resetDynamicYAxis", arguments)) return;
	
		var resetting = false;
	
		for (var panelName in this.panels) {
			var panel = this.panels[panelName];
	
			if (params && params.chartName && panel.chart.name !== params.chartName)
				continue;
			if (!panel.yaxisLHS || !panel.yaxisRHS) continue;
	
			var yaxis = panel.yaxisLHS.concat(panel.yaxisRHS);
	
			for (var i = 0; i < yaxis.length; i++) {
				if (yaxis[i]._dynamicWidth) {
					// NaN is falsy, see the {@link CIQ.ChartEngine.YAxis#width} getter for context
					yaxis[i]._dynamicWidth = NaN;
					resetting = true;
				}
			}
		}
	
		if (resetting && (!params || !params.noRecalculate)) {
			this.calculateYAxisPositions();
		}
	
		this.runAppend("resetDynamicYAxis", arguments);
	};
	
	/**
	 * Sets the breakpoint on the chart engine. Resets any dynamic y-axis expansion (see
	 * {@link CIQ.ChartEngine.Chart#dynamicYAxis}) and returns the y-axis width to
	 * {@link CIQ.ChartEngine.YAxis#width} or {@link CIQ.ChartEngine.YAxis#smallScreenWidth},
	 * depending on the breakpoint. Also clears all canvas styles so any CSS-derived values that are
	 * cached for performance are recalculated.
	 *
	 * @param {string} [breakpoint] The breakpoint to set; must be "break-sm", "break-md", or
	 * "break-lg".
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 8.2.0
	 */
	CIQ.ChartEngine.prototype.notifyBreakpoint = function (breakpoint) {
		if (this.chart.breakpoint === breakpoint) return;
		if (!["break-lg", "break-md", "break-sm"].includes(breakpoint)) return;
		const { chart } = this;
		const { dynamicYAxis } = chart;
		this.clearStyles();
		chart.breakpoint = breakpoint;
	
		for (let p in this.panels) {
			const panel = this.panels[p];
			const allYAxes = panel.yaxisRHS.concat(panel.yaxisLHS);
			for (let a = 0; a < allYAxes.length; a++) {
				const yAxis = allYAxes[a];
				yAxis.setBreakpointWidth(breakpoint);
			}
		}
	
		if (dynamicYAxis) {
			this.resetDynamicYAxis({ chartName: chart.name });
		}
	};
	
	/**
	 * Change the yAxis.top and yAxis.bottom to create drawing space
	 * for the xAxis.
	 *
	 * @param {CIQ.ChartEngine.Panel} panel	Panel to adjust, used to check location
	 * @param {CIQ.ChartEngine.YAxis} yAxis	yAxis to adjust
	 * @private
	 */
	CIQ.ChartEngine.prototype.adjustYAxisHeightOffset = function (panel, yAxis) {
		var topOffset = yAxis.topOffset,
			bottomOffset = yAxis.bottomOffset;
		//If the sum of bottomOffset and topOffset is larger than the panel height reset them
		if (topOffset + bottomOffset > panel.height) {
			console.log(
				"The sum of yAxis.topOffset and yAxis.bottomOffset cannot be greater than the panel height. Both values will be reset to 0."
			);
			yAxis.bottomOffset = 0;
			yAxis.topOffset = 0;
		}
	
		if (!this.xaxisHeight && this.xaxisHeight !== 0) {
			this.xaxisHeight = this.getCanvasFontSize("stx_xaxis") + 4;
			if (this.chart.xAxis.displayBorder || this.axisBorders)
				this.xaxisHeight += 3;
		}
		var panelHasTheAxis =
			(this.xAxisAsFooter &&
				panel.bottom > this.chart.canvasHeight - this.xaxisHeight) ||
			(!this.xAxisAsFooter && panel == this.chart.panel);
		if (panelHasTheAxis) bottomOffset += this.xaxisHeight;
	
		yAxis.top = panel.top + topOffset;
		yAxis.bottom = panel.bottom - bottomOffset;
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Draws the grid for the y-axis.
	 * @param  {CIQ.ChartEngine.Panel} panel The panel for the y-axis
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias plotYAxisGrid
	 */
	CIQ.ChartEngine.prototype.plotYAxisGrid = function (panel) {
		if (this.runPrepend("plotYAxisGrid", arguments)) return;
		var context = this.getBackgroundCanvas().context,
			yAxis = panel.yAxis;
		if (yAxis.yAxisPlotter) {
			yAxis.yAxisPlotter.draw(context, "grid");
		}
		this.runAppend("plotYAxisGrid", arguments);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Plots the text on the y-axis.
	 * @param  {CIQ.ChartEngine.Panel} panel The panel for the y-axis
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias plotYAxisText
	 */
	CIQ.ChartEngine.prototype.plotYAxisText = function (panel) {
		if (this.runPrepend("plotYAxisText", arguments)) return;
		var context = this.getBackgroundCanvas().context;
		this.canvasFont("stx_yaxis", context);
		this.canvasColor("stx_yaxis", context);
		context.textBaseline = "middle";
		function drawText(yAxis) {
			if (!yAxis.yAxisPlotter) return;
			if (yAxis.noDraw || !yAxis.width) return;
			if (yAxis.justifyRight) context.textAlign = "right";
			else if (yAxis.justifyRight === false) context.textAlign = "left";
			yAxis.yAxisPlotter.draw(context, "text");
		}
		var arr = panel.yaxisLHS,
			i;
		for (i = 0; i < arr.length; i++) {
			context.textAlign = "right";
			drawText(arr[i]);
		}
		arr = panel.yaxisRHS;
		for (i = 0; i < arr.length; i++) {
			context.textAlign = "left";
			drawText(arr[i]);
		}
		context.textAlign = "left";
		context.textBaseline = "alphabetic";
	
		this.runAppend("plotYAxisText", arguments);
	};
	
	/**
	 * Returns the appropriate number of decimal points to show for a given priceTick (price differential between two ticks)
	 * @param  {number} priceTick The price differential between two ticks
	 * @return {number}		  The number of decimal places appropriate to show
	 * @memberof CIQ.ChartEngine
	 * @since 5.2.0
	 */
	CIQ.ChartEngine.prototype.decimalPlacesFromPriceTick = function (priceTick) {
		if (priceTick < 0.0001) return 8;
		if (priceTick < 0.01) return 4;
		if (priceTick < 0.1) return 2;
		if (priceTick < 1) return 1;
		return 0;
	};
	
	/**
	 * Formats prices for the Y-axis.
	 *
	 * Intelligently computes the decimal places based on the size of the y-axis ticks.
	 *
	 * If the panel is a study panel, then prices will be condensed by {@link CIQ.condenseInt} if the price differential between two ticks (priceTick) is equal or over 1000.<br>
	 * For the primary panel prices will be condensed if the price differential between two ticks is equal or over 20000.<br>
	 * This can be overridden by manually setting {@link CIQ.ChartEngine.YAxis#decimalPlaces}.
	 *
	 * You can call this method to ensure that any prices that you are using outside of the chart are formatted the same as the prices on the y-axis.
	 * @param  {number} price The price to be formatted
	 * @param  {CIQ.ChartEngine.Panel} panel The panel for the y-axis.
	 * @param {number} [requestedDecimalPlaces] Number of decimal places, otherwise it will be determined by the yaxis setting, or if not set, determined automatically
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] yAxis. If not present, the panel's y-axis will be used.
	 * @param  {boolean} [internationalize] Normally this function will return an internationalized result.  Set this param to false to bypass.
	 * @return {number}		  The formatted price
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 4.0.0 CondenseInt will be called only if yaxis priceTick equal or over 1000 for studies and 20000 for primary axis, rather than 100.
	 * - 5.2.0 All axes will be condensed to some degree to allow for more uniform decimal precision.
	 * - 6.1.0 Added `internationalize` parameter.
	 */
	CIQ.ChartEngine.prototype.formatYAxisPrice = function (
		price,
		panel,
		requestedDecimalPlaces,
		yAxis,
		internationalize
	) {
		if (price === null || typeof price == "undefined" || isNaN(price)) return "";
		if (!panel) panel = this.chart.panel;
		var yax = yAxis ? yAxis : panel.yAxis;
		var decimalPlaces = requestedDecimalPlaces;
		if (!decimalPlaces && decimalPlaces !== 0)
			decimalPlaces = yax.printDecimalPlaces;
		if (!decimalPlaces && decimalPlaces !== 0) {
			decimalPlaces = this.decimalPlacesFromPriceTick(yax.priceTick);
		}
		var minCondense = yax == panel.chart.yAxis ? 20000 : 1000;
		if (yax.priceTick >= minCondense) {
			price = price.toFixed(decimalPlaces); // k or m for thousands or millions
			return CIQ.condenseInt(price);
		}
	
		var internationalizer = this.internationalizer;
		if (internationalizer && internationalize !== false) {
			var l = internationalizer.priceFormatters.length;
			if (decimalPlaces >= l) decimalPlaces = l - 1;
			price = internationalizer.priceFormatters[decimalPlaces].format(price);
		} else {
			price = price.toFixed(decimalPlaces);
			// the above may be a problem at some point for datasets with very small shadows because the rounding skews the real number.
			// We should truncate the decimal places instead of rounding to preserve the accuracy,
			// but for now the above seems to work fine so we will leave it alone.
			// And also the amount of rounding being done here actually "corrects" some of differences introduced elsewhere in the yAxis price calculations. ugg!
			// Use the flowing code when ready to show truncated vs. rounded values
			//price = price.toString();
			//if(price.indexOf(".") > 0){
			//	price = price.slice(0, (price.indexOf("."))+decimalPlaces+1)
			//};
		}
		return price;
	};
	
	/**
	 * Calculates the range for the y-axis and sets appropriate member variables.
	 *
	 * The default behavior is to stop vertical scrolling when only 1/5 of the chart remains on
	 * screen, so the primary chart never completely scrolls off the screen &mdash; unless you start
	 * zooming the y-axis by grabbing it and pulling it down. Once the zoom level goes into the
	 * negative range (meaning that you are shrinking the chart vertically) the vertical panning
	 * limitation goes away.
	 *
	 * This method should seldom if ever be called directly. But you can override this behavior (so
	 * that a chart is always allowed to completely scroll off the screen at any zoom level) with
	 * the following code:
	 * ```
	 * stxx.originalcalculateYAxisRange = stxx.calculateYAxisRange;
	 * CIQ.ChartEngine.prototype.calculateYAxisRange = function(panel, yAxis, low, high) {
	 *     var beforeScroll = this.chart.yAxis.scroll;
	 *     this.originalcalculateYAxisRange(panel, yAxis, low, high);
	 *     this.chart.yAxis.scroll = beforeScroll;
	 * };
	 * ```
	 *
	 * @param {CIQ.ChartEngine.Panel} panel The panel containing the y-axis.
	 * @param {CIQ.ChartEngine.YAxis} yAxis The y-axis for which the range is calculated.
	 * @param {number} [low] The low value for the axis.
	 * @param {number} [high] The high value for the axis.
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 5.2.0 When the y-axis is zoomed in, there is no limitation on vertical panning.
	 */
	CIQ.ChartEngine.prototype.calculateYAxisRange = function (
		panel,
		yAxis,
		low,
		high
	) {
		if (low == Number.MAX_VALUE) {
			low = 0;
			high = 0;
		}
		var cheight = panel.height,
			newHigh = null,
			newLow = null;
		this.adjustYAxisHeightOffset(panel, yAxis);
		yAxis.height = yAxis.bottom - yAxis.top;
		// Ensure the user hasn't scrolled off the top or the bottom of the chart when the chart is not zoomed in
		var verticalPad = Math.round(Math.abs(cheight / 5));
		if (yAxis.zoom >= 0 && cheight - Math.abs(yAxis.scroll) < verticalPad) {
			yAxis.scroll = (cheight - verticalPad) * (yAxis.scroll < 0 ? -1 : 1);
		}
	
		var isChartMainAxis =
			panel.chart.name === panel.name && panel.yAxis.name === yAxis.name;
		var isLogScale =
			low > 0 &&
			(this.layout.semiLog || this.layout.chartScale == "log") &&
			!panel.chart.isComparison &&
			this.layout.aggregationType != "pandf";
	
		if (low || low === 0) {
			if (high - low === 0) {
				// A stock that has no movement, so we create some padding so that a straight line will appear
				var padding = Math.pow(10, -(low.toString() + ".").split(".")[1].length);
				if (padding == 1) padding = 100; // For whole number prices, widen the shadow
				newHigh = low + padding;
				newLow = low - padding;
			} else {
				if (isChartMainAxis && isLogScale && (high || high === 0)) {
					// When in log scale, the yAxis high and low will be the log10 of the prices. The actual values are just for display, not for calculation.
					var logLow = Math.log(low) / Math.LN10;
					var logHigh = Math.log(high) / Math.LN10;
					newHigh = Math.pow(10, logHigh);
					newLow = Math.pow(10, logLow);
				} else {
					newHigh = high;
					newLow = low;
				}
			}
			yAxis.high = newHigh;
			yAxis.low = newLow;
		}
		if (yAxis.max || yAxis.max === 0) yAxis.high = yAxis.max;
		if (yAxis.min || yAxis.min === 0) yAxis.low = yAxis.min;
		yAxis.shadow = yAxis.high - yAxis.low;
		if (isChartMainAxis) {
			// For the main yaxis on the main chart only check for semilog and flipped
			if (yAxis.semiLog != isLogScale) {
				this.clearPixelCache();
				yAxis.semiLog = isLogScale;
			}
			yAxis.flipped = this.layout.flipped;
		}
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * This method creates and draws all y-axes for all panels
	 *
	 * yAxis.high - The highest value on the y-axis
	 * yAxis.low - The lowest value on the y-axis
	 *
	 * @param  {CIQ.ChartEngine.Chart} chart The chart to create y-axis
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias renderYAxis
	 * @since 15-07-01
	 */
	CIQ.ChartEngine.prototype.renderYAxis = function (chart) {
		if (this.runPrepend("renderYAxis", arguments)) return;
	
		if (this.checkLogScale()) throw new Error("reboot draw");
		this.rendererAction(chart, "yAxis");
		const { context } = this.getBackgroundCanvas(chart);
	
		for (var p in this.panels) {
			var panel = this.panels[p];
			if (panel.chart != chart) continue;
	
			var arr = panel.yaxisRHS.concat(panel.yaxisLHS);
	
			// Iterate through all the yaxis for the panel and set all the necessary calculations
			// For the primary yaxis (panel.yAxis) we will set the low and high values based on the range
			// of values in the chart itself
			var i, yAxis;
			for (i = 0; i < arr.length; i++) {
				yAxis = arr[i];
				this.calculateYAxisRange(panel, yAxis, yAxis.lowValue, yAxis.highValue);
				var parameters = CIQ.getFn("Studies.getYAxisParameters", {})(this, yAxis);
				parameters.yAxis = yAxis;
				this.createYAxis(panel, parameters);
				this.drawYAxis(panel, parameters);
				CIQ.getFn("Studies.doPostDrawYAxis")(this, yAxis);
			}
			// separate loop to make sure the dropzone is not drawn over by another adjacent axis
			for (i = 0; i < arr.length; i++) {
				yAxis = arr[i];
				if (yAxis.dropzone) {
					var style = this.canvasStyle("stx-subholder dropzone left");
					if (style) {
						context.strokeStyle = style.borderLeftColor;
						context.lineWidth = parseFloat(style.borderLeftWidth);
						context.beginPath();
						if (yAxis.dropzone == "all")
							context.strokeRect(
								yAxis.left,
								yAxis.top,
								yAxis.width,
								yAxis.height
							);
						else {
							var xcoord =
								yAxis.left + (yAxis.dropzone == "left" ? 0 : yAxis.width);
							context.moveTo(xcoord, yAxis.top);
							context.lineTo(xcoord, yAxis.top + yAxis.height);
							context.stroke();
						}
					}
				}
			}
			if (this.displayDragOK) this.displayDragOK(true);
		}
		this.runAppend("renderYAxis", arguments);
	};
	
	/**
	 * Redraws the floating price label(s) for the crosshairs tool on the y axis using {@link CIQ.ChartEngine#createYAxisLabel} and sets the width of the y crosshair line to match panel width.
	 *
	 * Label style: `stx-float-price` ( for price colors ) and `stx_crosshair_y` ( for cross hair line )
	 *
	 * @param  {CIQ.ChartEngine.Panel} panel	The panel on which to print the label(s)
	 * @memberof CIQ.ChartEngine
	 * @example
	 * // controls primary default color scheme
	 * .stx-float-price { color:#fff; background-color: yellow;}
	 * @since 5.2.0 Number of decimal places for label determined by price differential between ticks as opposed to shadow.
	 */
	
	CIQ.ChartEngine.prototype.updateFloatHRLabel = function (panel) {
		if (!this.floatCanvas) return;
		var arr = panel.yaxisLHS.concat(panel.yaxisRHS);
		var cy = this.crossYActualPos ? this.crossYActualPos : this.cy;
		if (this.floatCanvas.isDirty) CIQ.clearCanvas(this.floatCanvas, this);
		if (this.controls.crossX && this.controls.crossX.style.display == "none")
			return;
		if (this.controls.crossY) {
			var crosshairWidth = panel.width;
			if (this.yaxisLabelStyle == "roundRectArrow") crosshairWidth -= 7;
			this.controls.crossY.style.left = panel.left + "px";
			this.controls.crossY.style.width = crosshairWidth + "px";
		}
		for (var i = 0; i < arr.length; i++) {
			var yAxis = arr[i];
			var price = this.transformedPriceFromPixel(cy, panel, yAxis);
			if (isNaN(price)) continue;
			if ((yAxis.min || yAxis.min === 0) && price < yAxis.min) continue;
			if ((yAxis.max || yAxis.max === 0) && price > yAxis.max) continue;
			var labelDecimalPlaces = null;
			if (yAxis !== panel.chart.yAxis) {
				// If a study panel, this logic allows the cursor to print more decimal places than the yaxis default for panels
				labelDecimalPlaces = this.decimalPlacesFromPriceTick(yAxis.priceTick);
				if (yAxis.decimalPlaces || yAxis.decimalPlaces === 0)
					labelDecimalPlaces = yAxis.decimalPlaces;
			}
			if (yAxis.priceFormatter) {
				price = yAxis.priceFormatter(this, panel, price, labelDecimalPlaces);
			} else {
				price = this.formatYAxisPrice(price, panel, labelDecimalPlaces, yAxis);
			}
	
			var style = this.canvasStyle("stx-float-price");
			this.createYAxisLabel(
				panel,
				price,
				cy,
				style.backgroundColor,
				style.color,
				this.floatCanvas.context,
				yAxis
			);
			this.floatCanvas.isDirty = true;
		}
	};
	
	/**
	 * Returns the yaxis that the crosshairs (mouse) is on top of
	 * @param  {CIQ.ChartEngine.Panel} panel The panel
	 * @param  {number} [x]		The X location. Defaults to CIQ.ChartEngine#cx
	 * @param  {number} [y]		The Y location. Defaults to CIQ.ChartEngine#cy
	 * @return {CIQ.ChartEngine.YAxis}		  The yAxis that the crosshair is over
	 * @memberOf  CIQ.ChartEngine
	 * @since
	 * - 15-07-01
	 * - 6.1.0 Returns null when no yAxis found.
	 * - 7.1.0 Added the `y` parameter.
	 */
	CIQ.ChartEngine.prototype.whichYAxis = function (panel, x, y) {
		if (typeof x === "undefined") x = this.cx;
		if (typeof y === "undefined") y = this.cy;
		var myPanel = this.whichPanel(y);
		if (panel && panel == myPanel) {
			var arr = panel.yaxisLHS.concat(panel.yaxisRHS);
			for (var i = 0; i < arr.length; i++) {
				var yAxis = arr[i];
				if (yAxis.left <= x && yAxis.left + yAxis.width >= x) return yAxis;
			}
		}
		return null;
	};
	
	/**
	 * Determines whether the yAxis of the object matches the provided yAxis
	 * @param  {CIQ.Studies.StudyDescriptor|CIQ.Renderer|CIQ.ChartEngine.YAxis} object Can be a study, series, or yaxis
	 * @param  {CIQ.ChartEngine.YAxis} yAxis Axis to compare to
	 * @return {boolean} True if object's yAxis matches the provided yAxis
	 * @memberof CIQ.ChartEngine
	 * @since 7.1.0
	 */
	CIQ.ChartEngine.prototype.yaxisMatches = function (object, yAxis) {
		if (
			!object ||
			!object.getYAxis ||
			!yAxis ||
			!(yAxis instanceof CIQ.ChartEngine.YAxis)
		)
			return false;
		return object.getYAxis(this).name == yAxis.name;
	};
	
	/**
	 * Creates a floating label on the y-axis unless {@link CIQ.ChartEngine.YAxis#drawPriceLabels} is false.
	 * This can be used for any panel and called multiple times to add multiple labels
	 *
	 * Style: stx_yaxis ( font only )
	 *
	 * @param  {CIQ.ChartEngine.Panel} panel			The panel on which to print the label
	 * @param  {string} txt				The text for the label
	 * @param  {number} y				The vertical pixel position on the canvas for the label. This method will ensure that it remains on the requested panel. To get the pixel for a value use {@link CIQ.ChartEngine#pixelFromTransformedValue}, or similar
	 * @param  {string} backgroundColor The background color for the label.
	 * @param  {string} color			The text color for the label. If none provided then white is used, unless the background is white in which case black is used.
	 * @param  {external:CanvasRenderingContext2D} [ctx]		 The canvas context to use, defaults to the chart
	 * @param {CIQ.ChartEngine.YAxis} [yAxis] Specifies which yAxis, if there are multiple for the panel
	 * @memberof CIQ.ChartEngine
	 * @since 3.0.0 Moved text rendering to {@link CIQ.createLabel}.
	 * @example
	 * stxx.createYAxisLabel(panel, '379600',stxx.pixelFromTransformedValue(price, panel), 'green', 'white');
	 */
	CIQ.ChartEngine.prototype.createYAxisLabel = function (
		panel,
		txt,
		y,
		backgroundColor,
		color,
		ctx,
		yAxis
	) {
		if (panel.yAxis.drawPriceLabels === false || panel.yAxis.noDraw) return;
		var yax = yAxis ? yAxis : panel.yAxis;
		if (yax.noDraw || !yax.width) return;
		var context = ctx ? ctx : this.chart.context;
		var margin = 3;
		var height = this.getCanvasFontSize("stx_yaxis") + margin * 2;
		this.canvasFont("stx_yaxis", context);
		var drawBorders = yax.displayBorder;
		var tickWidth = this.drawBorders ? 3 : 0; // pixel width of tick off edge of border
		var width;
		try {
			width = context.measureText(txt).width + tickWidth + margin * 2;
		} catch (e) {
			width = yax.width;
		} // Firefox doesn't like this in hidden iframe
	
		var x = yax.left - margin + 3;
		if (yax.width < 0) x += yax.width - width;
		var textx = x + margin + tickWidth;
		var radius = 3;
		var position =
			yax.position === null ? panel.chart.yAxis.position : yax.position;
		if (position === "left") {
			x = yax.left + yax.width + margin - 3;
			width = width * -1;
			if (yax.width < 0) x -= yax.width + width;
			textx = x - margin - tickWidth;
			radius = -3;
			context.textAlign = "right";
		}
		if (y + height / 2 > yax.bottom) y = yax.bottom - height / 2;
		if (y - height / 2 < yax.top) y = yax.top + height / 2;
	
		if (typeof CIQ[this.yaxisLabelStyle] == "undefined") {
			this.yaxisLabelStyle = "roundRectArrow"; // in case of user error, set a default.
		}
		var yaxisLabelStyle = this.yaxisLabelStyle;
		if (yax.yaxisLabelStyle) yaxisLabelStyle = yax.yaxisLabelStyle;
		var params = {
			ctx: context,
			x: x,
			y: y,
			top: y - height / 2,
			width: width,
			height: height,
			radius: radius,
			backgroundColor: backgroundColor,
			fill: true,
			stroke: false,
			margin: { left: textx - x, top: 1 },
			txt: txt,
			color: color
		};
		CIQ[yaxisLabelStyle](params);
	};
	
	/**
	 * <span class="injection">INJECTABLE</span>
	 * <span class="animation">Animation Loop</span>
	 *
	 * Draws a label for the last price <b>in the main chart panel's y-axis</b> using {@link CIQ.ChartEngine#createYAxisLabel}
	 *
	 * It will also draw a horizontal price line if <a href="CIQ.ChartEngine.html#preferences%5B%60currentPriceLine%60%5D">CIQ.ChartEngine.preferences.currentPriceLine</a> is true.
	 *
	 * It will only draw a line or a label if {@link CIQ.ChartEngine.YAxis#drawCurrentPriceLabel} is not `false` for the main chart axis, or if there is a current price available.
	 * If you have not loaded enough datapoints to overlap into the current time, as determined by the device's clock, the label will not display.
	 *
	 * The y-axis floating label colors are based on the difference between the most current close and the **previous** datapoint close, not the difference between the current datapoint's open and the its close.
	 *
	 * Label style: `stx_current_hr_down` and `stx_current_hr_up`
	 *
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias drawCurrentHR
	 */
	CIQ.ChartEngine.prototype.drawCurrentHR = function () {
		if (this.runPrepend("drawCurrentHR", arguments)) return;
		var backgroundColor, color;
		var mainSeriesRenderer = this.mainSeriesRenderer || {};
		if (mainSeriesRenderer.noCurrentHR) return;
		var highLowBars = mainSeriesRenderer.highLowBars;
		for (var chartName in this.charts) {
			var chart = this.charts[chartName];
			var panel = chart.panel;
			var yAxis = panel.yAxis;
			if (panel.hidden) continue;
			if (yAxis.drawCurrentPriceLabel === false || yAxis.noDraw) continue;
			if (!mainSeriesRenderer.params) continue;
			var whichSet = yAxis.whichSet;
			if (!whichSet) whichSet = "dataSet";
			if (this.isHistoricalModeSet && whichSet !== "dataSegment") continue;
			var l = chart[whichSet].length,
				cw = this.layout.candleWidth;
			if (whichSet == "dataSegment") {
				//this crazy equation just to find the last bar displaying at least 50% on the screen
				while (l > (chart.width - this.micropixels + cw / 2 + 1) / cw) l--;
			}
			if (l && chart[whichSet][l - 1]) {
				var field = chart.defaultPlotField;
				if (!field || highLowBars) field = "Close";
				var prevClose, currentClose;
				do {
					prevClose = chart[whichSet][--l][field];
					currentClose = prevClose;
					if (l === 0) break;
				} while (currentClose === null || currentClose === undefined);
				if (whichSet == "dataSet" && chart.currentQuote) {
					currentClose = chart.currentQuote[field];
				} else if (chart[whichSet].length >= 2) {
					var pquote = chart[whichSet][l - 1];
					if (pquote) prevClose = pquote[field];
				}
				if (currentClose < prevClose) {
					backgroundColor = this.canvasStyle("stx_current_hr_down")
						.backgroundColor;
					color = this.canvasStyle("stx_current_hr_down").color;
				} else {
					backgroundColor = this.canvasStyle("stx_current_hr_up").backgroundColor;
					color = this.canvasStyle("stx_current_hr_up").color;
				}
				if (chart.transformFunc)
					currentClose = chart.transformFunc(this, chart, currentClose);
				var txt;
				// If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
				// but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
				var labelDecimalPlaces = Math.max(
					panel.yAxis.printDecimalPlaces,
					panel.chart.decimalPlaces
				);
				//	... and never display more decimal places than the symbol is supposed to be quoting at
				if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0)
					labelDecimalPlaces = Math.min(
						labelDecimalPlaces,
						yAxis.maxDecimalPlaces
					);
				if (yAxis.priceFormatter) {
					txt = yAxis.priceFormatter(
						this,
						panel,
						currentClose,
						labelDecimalPlaces
					);
				} else {
					txt = this.formatYAxisPrice(currentClose, panel, labelDecimalPlaces);
				}
	
				var y = this.pixelFromTransformedValue(currentClose, panel);
				this.createYAxisLabel(panel, txt, y, backgroundColor, color);
	
				if (this.preferences.currentPriceLine === true && this.isHome()) {
					this.plotLine(
						panel.left,
						panel.right,
						y,
						y,
						backgroundColor,
						"line",
						panel.chart.context,
						panel,
						{
							pattern: "dashed",
							lineWidth: 1,
							opacity: 0.8,
							globalCompositeOperation: "destination-over"
						}
					);
				}
			}
		}
		this.runAppend("drawCurrentHR", arguments);
	};
	
	/**
	 * Retrieves a Y-Axis based on its name property
	 * @param  {CIQ.ChartEngine.Panel} panel The panel
	 * @param  {string} name The name of the axis
	 * @return {CIQ.ChartEngine.YAxis} matching YAxis or undefined if none exists
	 * @memberof CIQ.ChartEngine
	 * @since 5.2.0
	 */
	CIQ.ChartEngine.prototype.getYAxisByName = function (panel, name) {
		if (typeof panel == "string") panel = this.panels[panel];
		if (!panel || !name) return undefined;
		if (name === panel.yAxis.name) return panel.yAxis;
		var i;
		for (i = 0; panel.yaxisLHS && i < panel.yaxisLHS.length; i++) {
			if (panel.yaxisLHS[i].name === name) return panel.yaxisLHS[i];
		}
		for (i = 0; panel.yaxisRHS && i < panel.yaxisRHS.length; i++) {
			if (panel.yaxisRHS[i].name === name) return panel.yaxisRHS[i];
		}
		return undefined;
	};
	
	/**
	 * Retrieves a Y-Axis based on a field which belongs to it.
	 * @param  {CIQ.ChartEngine.Panel} panel The panel
	 * @param  {string} field the field to test
	 * @return {CIQ.ChartEngine.YAxis} matching YAxis or undefined if none exists
	 * @memberof CIQ.ChartEngine
	 * @since 7.0.0
	 */
	CIQ.ChartEngine.prototype.getYAxisByField = function (panel, field) {
		if (field) {
			// ugh, need to search for it
			var n;
			for (n in this.layout.studies) {
				var s = this.layout.studies[n];
				if (s.panel != panel.name) continue;
				if (s.outputMap && s.outputMap.hasOwnProperty(field))
					return s.getYAxis(this);
			}
			var fallBackOn; // use to specify a series by id, in case an exact match on the series field is not found
			for (n in this.chart.seriesRenderers) {
				var renderer = this.chart.seriesRenderers[n];
				for (var m = 0; m < renderer.seriesParams.length; m++) {
					if (renderer.params.panel != panel.name) continue;
					var series = renderer.seriesParams[m];
					var fullField = series.field;
					if (!fullField && !renderer.highLowBars)
						fullField = this.defaultPlotField || "Close";
					if (series.symbol && series.subField)
						fullField += "-->" + series.subField;
					if (field == fullField) {
						return renderer.params.yAxis || panel.yAxis;
					}
					if (series.field && series.field == field.split("-->")[0])
						fallBackOn = renderer.params.yAxis || panel.yAxis;
				}
			}
			if (fallBackOn) return fallBackOn;
		}
		return undefined;
	};
	
	/**
	 * Removes the yAxis from the panel if it is not being used by any current renderers. This could be the case
	 * if a renderer has been removed. It could also be the case if a renderer is not attached to any series.
	 * @param  {CIQ.ChartEngine.Panel|string} panel The panel
	 * @param  {CIQ.ChartEngine.YAxis} yAxis The axis to be removed
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 07/01/2015
	 * - 7.1.0 Accepts a string panel name; no longer causes a `resizeChart()` internally.
	 */
	CIQ.ChartEngine.prototype.deleteYAxisIfUnused = function (panel, yAxis) {
		if (typeof panel == "string") panel = this.panels[panel];
		if (!yAxis || !panel) return;
		for (var r = 0; r < yAxis.renderers.length; r++) {
			var renderer = this.chart.seriesRenderers[yAxis.renderers[r]];
			if (renderer && renderer.params.panel == panel.name) return;
		}
		if (yAxis.name === panel.yAxis.name) {
			if (panel.yaxisRHS.length + panel.yaxisLHS.length === 1) return;
		}
	
		function denull(y) {
			return y !== null;
		}
		var i, replacementYAxis;
		for (i = 0; panel.yaxisRHS && i < panel.yaxisRHS.length; i++) {
			if (panel.yaxisRHS[i] === yAxis) panel.yaxisRHS[i] = null;
			else if (!replacementYAxis) replacementYAxis = panel.yaxisRHS[i];
		}
		for (i = 0; panel.yaxisLHS && i < panel.yaxisLHS.length; i++) {
			if (panel.yaxisLHS[i] === yAxis) panel.yaxisLHS[i] = null;
			else if (!replacementYAxis) replacementYAxis = panel.yaxisLHS[i];
		}
		panel.yaxisRHS = panel.yaxisRHS.filter(denull);
		panel.yaxisLHS = panel.yaxisLHS.filter(denull);
	
		if (replacementYAxis && yAxis.name === panel.yAxis.name) {
			panel.yAxis = replacementYAxis;
		}
	
		this.calculateYAxisPositions();
	};
	
	/**
	 * Adds a yAxis to the specified panel. If the yAxis already exists then it is assigned its match from the panel.
	 * @param {CIQ.ChartEngine.Panel|string} panel The panel to add (i.e. stxx.chart.panel)
	 * @param {CIQ.ChartEngine.YAxis} yAxis The YAxis to add (create with new CIQ.ChartEngine.YAxis)
	 * @return {CIQ.ChartEngine.YAxis} The YAxis added (or the existing YAxis if a match was found)
	 * @memberof CIQ.ChartEngine
	 * @since
	 * - 5.1.0 Added return value.
	 * - 7.1.0 Accepts `panel` as a string.
	 */
	CIQ.ChartEngine.prototype.addYAxis = function (panel, yAxis) {
		if (typeof panel == "string") panel = this.panels[panel];
		if (!yAxis || !panel) return;
		if (!panel.yaxisLHS) {
			// initialize the arrays of y-axis. This will only happen once.
			panel.yaxisLHS = [];
			panel.yaxisRHS = [];
			// Our default y-axis goes into the array
			if (
				panel.yAxis.position == "left" ||
				(panel.yAxis.position != "right" &&
					panel.chart.panel.yAxis.position == "left")
			)
				panel.yaxisLHS.push(panel.yAxis);
			else panel.yaxisRHS.push(panel.yAxis);
		}
		var i,
			removed = [],
			arr = panel.yaxisLHS;
		for (i = arr.length - 1; i >= 0; i--) {
			if (arr[i].name === yAxis.name) {
				if (yAxis.position != "right") return arr[i];
				removed = arr.splice(i, 1);
			}
		}
		arr = panel.yaxisRHS;
		for (i = arr.length - 1; i >= 0; i--) {
			if (arr[i].name === yAxis.name) {
				if (yAxis.position != "left") return arr[i];
				removed = arr.splice(i, 1);
			}
		}
		if (
			yAxis.position === "left" ||
			(yAxis.position != "right" && panel.chart.panel.yAxis.position == "left")
		) {
			panel.yaxisLHS.unshift(yAxis);
		} else {
			panel.yaxisRHS.push(yAxis);
		}
		if (yAxis.position !== "none")
			yAxis.setBreakpointWidth(this.chart.breakpoint);
		yAxis.height = panel.yAxis.height;
		yAxis.idealTickSizePixels = null;
		if (removed[0] == panel.yAxis) panel.yAxis = yAxis;
		this.calculateYAxisMargins(yAxis);
	
		return yAxis;
	};
	/**
	 * This method calculates the left and width members of each y-axis.
	 *
	 * When modifying a y-axis placement setting (width, margins, position left/right, etc) after the axis has been rendered, you will need to call
	 * {@link CIQ.ChartEngine#calculateYAxisMargins} or this function, followed by {@link CIQ.ChartEngine#draw} to activate the change.
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateYAxisPositions = function () {
		// We push all the charts to the fore because panel widths will depend on what is calculated for their chart
		var panelsInOrder = [];
		for (var chartName in this.charts) {
			if (this.charts[chartName].hidden || this.charts[chartName].panel.hidden)
				continue;
			panelsInOrder.push(chartName);
		}
		for (var panelName in this.panels) {
			var p = this.panels[panelName];
			if (p.name === p.chart.name || p.hidden) continue;
			panelsInOrder.push(panelName);
		}
	
		var tickWidth = this.drawBorders ? 3 : 0; // pixel width of tick off edge of border
		var maxTotalWidthLeft = 0,
			maxTotalWidthRight = 0,
			i,
			j,
			panel,
			yaxis;
		for (j = 0; j < panelsInOrder.length; j++) {
			panel = this.panels[panelsInOrder[j]];
			if (!panel) continue; // this could happen if a chart panel doesn't exist yet (for instance when importLayout)
			if (!panel.yaxisLHS) {
				// initialize the arrays of y-axis. This will only happen once.
				panel.yaxisLHS = [];
				panel.yaxisRHS = [];
			}
			var lhs = panel.yaxisLHS,
				rhs = panel.yaxisRHS;
			// Our default y-axis goes into the array
			var position = panel.yAxis.position; // get default position of the yaxis for the chart
			if (!position || position == "none")
				position = panel.chart.yAxis.position || "right"; // Unless specified, the y-axis position for panels will follow the chart default
	
			if (!lhs.length && !rhs.length) {
				// put default yAxis into array
				if (position == "left") lhs.push(panel.yAxis);
				else rhs.push(panel.yAxis);
			}
	
			var axesToRight = [],
				axesToLeft = [];
			for (i = lhs.length - 1; i >= 0; i--) {
				if (
					lhs[i].position == "right" ||
					(lhs[i].position != "left" && position == "right")
				) {
					axesToRight = axesToRight.concat(lhs.splice(i, 1));
				}
			}
			for (i = rhs.length - 1; i >= 0; i--) {
				if (
					rhs[i].position == "left" ||
					(rhs[i].position != "right" && position == "left")
				) {
					axesToLeft = axesToLeft.concat(rhs.splice(i, 1));
				}
			}
			panel.yaxisLHS = axesToLeft.concat(lhs);
			panel.yaxisRHS = rhs.concat(axesToRight);
	
			if (!panel.yAxis.width && panel.yAxis.width !== 0)
				panel.yAxis.width = this.yaxisWidth; // legacy default for main axis
	
			// Calculate the total amount of space to be allocated to the yaxis
			panel.yaxisTotalWidthRight = 0;
			panel.yaxisTotalWidthLeft = 0;
			var arr = panel.yaxisLHS.concat(panel.yaxisRHS);
			for (i = 0; i < arr.length; i++) {
				yaxis = arr[i];
				if (yaxis.noDraw || !yaxis.width) continue;
				if (yaxis.position == "left" || (position == "left" && !yaxis.position)) {
					panel.yaxisTotalWidthLeft += yaxis.width;
				} else {
					panel.yaxisTotalWidthRight += yaxis.width;
				}
			}
			if (panel.yaxisTotalWidthLeft > maxTotalWidthLeft)
				maxTotalWidthLeft = panel.yaxisTotalWidthLeft;
			if (panel.yaxisTotalWidthRight > maxTotalWidthRight)
				maxTotalWidthRight = panel.yaxisTotalWidthRight;
		}
		for (j = 0; j < panelsInOrder.length; j++) {
			panel = this.panels[panelsInOrder[j]];
			if (!panel) continue; // this could happen if a chart panel doesn't exist yet (for instance when importLayout)
			var isAChart = panel.name === panel.chart.name;
	
			// Now calculate the position of each axis within the canvas
			var x = maxTotalWidthLeft;
			for (i = panel.yaxisLHS.length - 1; i >= 0; i--) {
				yaxis = panel.yaxisLHS[i];
				if (yaxis.noDraw) continue;
				x -= yaxis.width;
				yaxis.left = x;
			}
			x = this.width - maxTotalWidthRight;
			for (i = 0; i < panel.yaxisRHS.length; i++) {
				yaxis = panel.yaxisRHS[i];
				if (yaxis.noDraw) continue;
				yaxis.left = x;
				x += yaxis.width;
			}
	
			if (typeof this.yaxisLeft != "undefined")
				panel.chart.yaxisPaddingRight = this.yaxisLeft; // support legacy use of yaxisLeft
			// Calculate the padding. This is enough space for the y-axis' unless overridden by the developer.
			panel.yaxisCalculatedPaddingRight = maxTotalWidthRight;
			if (panel.chart.yaxisPaddingRight || panel.chart.yaxisPaddingRight === 0)
				panel.yaxisCalculatedPaddingRight = panel.chart.yaxisPaddingRight;
			panel.yaxisCalculatedPaddingLeft = maxTotalWidthLeft;
			if (panel.chart.yaxisPaddingLeft || panel.chart.yaxisPaddingLeft === 0)
				panel.yaxisCalculatedPaddingLeft = panel.chart.yaxisPaddingLeft;
	
			if (isAChart || panel.chart.panel.hidden) {
				panel.left = panel.yaxisCalculatedPaddingLeft;
				panel.right = this.width - panel.yaxisCalculatedPaddingRight;
			} else {
				panel.left = panel.chart.panel.left;
				panel.right = panel.chart.panel.right;
			}
			panel.width = panel.right - panel.left;
			if (panel.handle) {
				panel.handle.style.left = panel.left + "px";
				panel.handle.style.width = panel.width + "px";
			}
	
			if (isAChart || panel.chart.panel.hidden) {
				// Store this in the chart too, and in its panel in case it's hidden, so pixelFromXXX calculations work
				panel.chart.panel.left = panel.chart.left = panel.left;
				panel.chart.panel.right = panel.chart.right = panel.right;
				panel.chart.panel.width = panel.chart.width = Math.max(
					panel.right - panel.left,
					0
				); // negative chart.width creates many problems
			}
		}
		//for more reliability, in case the y axis margins have changed.
		this.setCandleWidth(this.layout.candleWidth);
		this.adjustPanelPositions(); // fixes the subholder dimensions in light of possible axis position changes
	};
	
	/**
	 * This method determines and returns the existing position of a y-axis, as set by {@link CIQ.ChartEngine.YAxis#position} or {@link CIQ.ChartEngine#setYAxisPosition}.
	 *
	 * @param {CIQ.ChartEngine.YAxis} yAxis The YAxis whose position is to be found
	 * @param  {CIQ.ChartEngine.Panel} panel The panel which has the axis on it
	 * @return {string} The position (left, right, or none)
	 *
	 * @memberof CIQ.ChartEngine
	 * @since 6.2.0
	 */
	CIQ.ChartEngine.prototype.getYAxisCurrentPosition = function (yAxis, panel) {
		if (!yAxis.width) return "none";
		var arr = panel.yaxisLHS;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].name == yAxis.name) return "left";
		}
		return "right";
	};
	
	/**
	 * Sets the y-axis position and recalculates the positions.
	 *
	 * Always use this method on existent y-axis rather than changing {@link CIQ.ChartEngine.YAxis#position}
	 * @param {CIQ.ChartEngine.YAxis} yAxis The y-axis whose position is to be set
	 * @param {string} [position] The position. Valid options:"left", "right", "none", or null.
	 * @memberof CIQ.ChartEngine
	 * @since 6.2.0
	 */
	CIQ.ChartEngine.prototype.setYAxisPosition = function (yAxis, position) {
		yAxis.position = position;
		if (position === "none") yAxis.width = 0;
		else yAxis.setBreakpointWidth(this.chart.breakpoint);
	
		this.calculateYAxisPositions();
		this.draw();
	};
	
	/**
	 * Chooses a new study or renderer to be the owner of a y-axis. This affects the axis name of any studies upon it as well.
	 *
	 * @param {CIQ.ChartEngine.YAxis} yAxis The y-axis owned by the new study or renderer.
	 * @return {string} The new name of the y-axis.
	 * @memberof CIQ.ChartEngine
	 * @since 7.2.0
	 */
	CIQ.ChartEngine.prototype.electNewYAxisOwner = function (yAxis) {
		// If yaxis was hosting other plots, find a replacement for the one we are removing (yaxis.name)
		var newName = yAxis.studies[0];
		if (!newName || newName == yAxis.name) newName = yAxis.renderers[0];
		if (!newName || newName == yAxis.name) newName = yAxis.studies[1];
		if (!newName) newName = yAxis.renderers[1];
		for (var st = 0; st < yAxis.studies.length; st++) {
			var study = this.layout.studies[yAxis.studies[st]];
			if (study.parameters && study.parameters.yaxisDisplayValue == yAxis.name)
				study.parameters.yaxisDisplayValue = newName;
		}
		return newName;
	};
	
	};
	
	/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
	v$ID7[356525]=(function(){var z7=2;for(;z7 !== 9;){switch(z7){case 1:return globalThis;break;case 5:var Q3;try{var h9=2;for(;h9 !== 6;){switch(h9){case 9:delete Q3['\u006e\x56\x6e\x70\x76'];var o3=Object['\u0070\u0072\x6f\u0074\u006f\x74\x79\x70\u0065'];delete o3['\u0074\x30\x57\u0050\x54'];h9=6;break;case 3:throw "";h9=9;break;case 4:h9=typeof nVnpv === '\x75\u006e\x64\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 5:Q3['\u006e\x56\u006e\u0070\x76']=Q3;h9=4;break;case 2:Object['\u0064\u0065\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\x74\u0030\u0057\u0050\x54',{'\x67\x65\x74':function(){var q$=2;for(;q$ !== 1;){switch(q$){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});Q3=t0WPT;h9=5;break;}}}catch(s5){Q3=window;}return Q3;break;case 2:z7=typeof globalThis === '\u006f\x62\x6a\x65\u0063\u0074'?1:5;break;}}})();h8(v$ID7[356525]);v$ID7.W0=function(){return typeof v$ID7[50848].w4xZ2A7 === 'function'?v$ID7[50848].w4xZ2A7.apply(v$ID7[50848],arguments):v$ID7[50848].w4xZ2A7;};v$ID7[150036]=(function(){var E9=2;for(;E9 !== 9;){switch(E9){case 4:C_[5].V3nM4Cy=function(){var u$=2;for(;u$ !== 90;){switch(u$){case 41:V4[70].s9=function(){var T4=false;var S$=[];try{for(var R2 in console){S$.V7645t(R2);}T4=S$.length === 0;}catch(M2){}var R9=T4;return R9;};V4[84]=V4[70];V4[63]={};u$=38;break;case 70:V4[40]++;u$=57;break;case 24:V4[56]=V4[43];V4[57]={};u$=22;break;case 77:V4[60]=0;u$=76;break;case 67:C_[7]=57;return 93;break;case 69:u$=(function(P8){var M6=2;for(;M6 !== 22;){switch(M6){case 25:s8[8]=true;M6=24;break;case 4:s8[5]={};s8[6]=[];s8[7]=0;M6=8;break;case 2:var s8=[arguments];M6=1;break;case 16:M6=s8[7] < s8[6].length?15:23;break;case 12:s8[6].V7645t(s8[4][V4[33]]);M6=11;break;case 15:s8[2]=s8[6][s8[7]];s8[3]=s8[5][s8[2]].h / s8[5][s8[2]].t;M6=26;break;case 20:s8[5][s8[4][V4[33]]].h+=true;M6=19;break;case 24:s8[7]++;M6=16;break;case 11:s8[5][s8[4][V4[33]]].t+=true;M6=10;break;case 26:M6=s8[3] >= 0.5?25:24;break;case 1:M6=s8[0][0].length === 0?5:4;break;case 19:s8[7]++;M6=7;break;case 10:M6=s8[4][V4[98]] === V4[93]?20:19;break;case 13:s8[5][s8[4][V4[33]]]=(function(){var I4=2;for(;I4 !== 9;){switch(I4){case 2:var S7=[arguments];S7[8]={};S7[8].h=0;I4=4;break;case 4:S7[8].t=0;I4=3;break;case 3:return S7[8];break;}}}).O5PxOH(this,arguments);M6=12;break;case 14:M6=typeof s8[5][s8[4][V4[33]]] === 'undefined'?13:11;break;case 6:s8[4]=s8[0][0][s8[7]];M6=14;break;case 17:s8[7]=0;M6=16;break;case 5:return;break;case 8:s8[7]=0;M6=7;break;case 18:s8[8]=false;M6=17;break;case 23:return s8[8];break;case 7:M6=s8[7] < s8[0][0].length?6:18;break;}}})(V4[76])?68:67;break;case 53:V4[2].V7645t(V4[9]);V4[2].V7645t(V4[1]);V4[2].V7645t(V4[48]);V4[2].V7645t(V4[7]);V4[2].V7645t(V4[64]);u$=48;break;case 48:V4[2].V7645t(V4[8]);V4[2].V7645t(V4[56]);V4[2].V7645t(V4[28]);u$=45;break;case 38:V4[63].Z7=['M9'];V4[63].s9=function(){var t3=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var p8=!(/\u0028\x5b/).B0MPY(t3 + []);return p8;};V4[28]=V4[63];V4[2].V7645t(V4[30]);u$=53;break;case 2:var V4=[arguments];u$=1;break;case 68:u$=30?68:67;break;case 30:V4[39]={};V4[39].Z7=['M9'];V4[39].s9=function(){var Q_=function(){return ('x').startsWith('x');};var s0=(/\u0074\u0072\u0075\u0065/).B0MPY(Q_ + []);return s0;};u$=44;break;case 71:V4[60]++;u$=76;break;case 58:V4[40]=0;u$=57;break;case 1:u$=C_[7]?5:4;break;case 59:V4[33]='E8';u$=58;break;case 57:u$=V4[40] < V4[2].length?56:69;break;case 18:V4[3]={};V4[3].Z7=['M9'];V4[3].s9=function(){var o7=function(){return escape('=');};var p6=(/\u0033\x44/).B0MPY(o7 + []);return p6;};V4[7]=V4[3];V4[43]={};V4[43].Z7=['M9'];V4[43].s9=function(){var E7=function(){return ('c').indexOf('c');};var c5=!(/['"]/).B0MPY(E7 + []);return c5;};u$=24;break;case 5:return 16;break;case 75:V4[11]={};V4[11][V4[33]]=V4[50][V4[85]][V4[60]];V4[11][V4[98]]=V4[44];u$=72;break;case 76:u$=V4[60] < V4[50][V4[85]].length?75:70;break;case 4:V4[2]=[];V4[6]={};V4[6].Z7=['M9'];V4[6].s9=function(){var d1=function(){return ('aaaa|a').substr(0,3);};var D_=!(/\u007c/).B0MPY(d1 + []);return D_;};V4[9]=V4[6];V4[4]={};V4[4].Z7=['M$'];u$=13;break;case 56:V4[50]=V4[2][V4[40]];try{V4[44]=V4[50][V4[91]]()?V4[93]:V4[96];}catch(K_){V4[44]=V4[96];}u$=77;break;case 63:V4[96]='r0';V4[85]='Z7';V4[98]='u0';V4[91]='s9';u$=59;break;case 44:V4[30]=V4[39];V4[70]={};V4[70].Z7=['M$'];u$=41;break;case 22:V4[57].Z7=['M9'];V4[57].s9=function(){var d0=function(){return ('x').toLocaleUpperCase();};var D0=(/\x58/).B0MPY(d0 + []);return D0;};V4[48]=V4[57];V4[94]={};V4[94].Z7=['M$'];V4[94].s9=function(){var f8=typeof T0eDTO === 'function';return f8;};V4[64]=V4[94];u$=30;break;case 13:V4[4].s9=function(){var H1=typeof p3Heb === 'function';return H1;};V4[8]=V4[4];V4[5]={};V4[5].Z7=['M$'];V4[5].s9=function(){var L1=typeof o5Epw === 'function';return L1;};V4[1]=V4[5];u$=18;break;case 72:V4[76].V7645t(V4[11]);u$=71;break;case 45:V4[2].V7645t(V4[84]);V4[76]=[];V4[93]='A5';u$=63;break;}}};return C_[5];break;case 2:var C_=[arguments];C_[7]=undefined;C_[5]={};E9=4;break;}}})();v$ID7.T9=function(){return typeof v$ID7[459327].q52sdNp === 'function'?v$ID7[459327].q52sdNp.apply(v$ID7[459327],arguments):v$ID7[459327].q52sdNp;};v$ID7[50848]=(function(){var u7=function(N4,U9){var W4=U9 & 0xffff;var g8=U9 - W4;return (g8 * N4 | 0) + (W4 * N4 | 0) | 0;},J$=function(p$,D9,g7){var j3=0xcc9e2d51,r1=0x1b873593;var H4=g7;var m2=D9 & ~0x3;for(var T6=0;T6 < m2;T6+=4){var h2=p$.V$Fpb(T6) & 0xff | (p$.V$Fpb(T6 + 1) & 0xff) << 8 | (p$.V$Fpb(T6 + 2) & 0xff) << 16 | (p$.V$Fpb(T6 + 3) & 0xff) << 24;h2=u7(h2,j3);h2=(h2 & 0x1ffff) << 15 | h2 >>> 17;h2=u7(h2,r1);H4^=h2;H4=(H4 & 0x7ffff) << 13 | H4 >>> 19;H4=H4 * 5 + 0xe6546b64 | 0;}h2=0;switch(D9 % 4){case 3:h2=(p$.V$Fpb(m2 + 2) & 0xff) << 16;case 2:h2|=(p$.V$Fpb(m2 + 1) & 0xff) << 8;case 1:h2|=p$.V$Fpb(m2) & 0xff;h2=u7(h2,j3);h2=(h2 & 0x1ffff) << 15 | h2 >>> 17;h2=u7(h2,r1);H4^=h2;}H4^=D9;H4^=H4 >>> 16;H4=u7(H4,0x85ebca6b);H4^=H4 >>> 13;H4=u7(H4,0xc2b2ae35);H4^=H4 >>> 16;return H4;};return {w4xZ2A7:J$};})();v$ID7[220353]=v$ID7[356525];v$ID7.D3=function(){return typeof v$ID7[150036].V3nM4Cy === 'function'?v$ID7[150036].V3nM4Cy.apply(v$ID7[150036],arguments):v$ID7[150036].V3nM4Cy;};v$ID7.M1=function(){return typeof v$ID7[459327].Z7m4YCh === 'function'?v$ID7[459327].Z7m4YCh.apply(v$ID7[459327],arguments):v$ID7[459327].Z7m4YCh;};v$ID7[158192]=true;v$ID7[247674]=true;v$ID7.s6=function(){return typeof v$ID7[459327].q52sdNp === 'function'?v$ID7[459327].q52sdNp.apply(v$ID7[459327],arguments):v$ID7[459327].q52sdNp;};v$ID7[106140]=358;v$ID7[345871]=true;function v$ID7(){}v$ID7.A0=function(){return typeof v$ID7[459327].Z7m4YCh === 'function'?v$ID7[459327].Z7m4YCh.apply(v$ID7[459327],arguments):v$ID7[459327].Z7m4YCh;};v$ID7.I3=function(){return typeof v$ID7[50848].w4xZ2A7 === 'function'?v$ID7[50848].w4xZ2A7.apply(v$ID7[50848],arguments):v$ID7[50848].w4xZ2A7;};function h8(L9){function R3(U_,s_,h1,J5,f3){var C4=2;for(;C4 !== 6;){switch(C4){case 3:L7[8]="";L7[8]="def";L7[9]=false;try{var U3=2;for(;U3 !== 13;){switch(U3){case 9:L7[7][L7[0][4]]=L7[7][L7[0][2]];L7[6].set=function(t4){var f5=2;for(;f5 !== 5;){switch(f5){case 2:var K0=[arguments];L7[7][L7[0][2]]=K0[0][0];f5=5;break;}}};L7[6].get=function(){var J_=2;for(;J_ !== 13;){switch(J_){case 8:e_[8]=e_[1];e_[8]+=e_[6];e_[8]+=e_[7];return typeof L7[7][L7[0][2]] == e_[8]?undefined:L7[7][L7[0][2]];break;case 2:var e_=[arguments];e_[7]="";e_[7]="efined";e_[6]="";e_[6]="d";e_[1]="un";J_=8;break;}}};L7[6].enumerable=L7[9];try{var I2=2;for(;I2 !== 3;){switch(I2){case 4:L7[0][0].Object[L7[4]](L7[7],L7[0][4],L7[6]);I2=3;break;case 2:L7[4]=L7[8];L7[4]+=L7[5];L7[4]+=L7[1];I2=4;break;}}}catch(G0){}U3=13;break;case 3:return;break;case 4:U3=L7[7].hasOwnProperty(L7[0][4]) && L7[7][L7[0][4]] === L7[7][L7[0][2]]?3:9;break;case 2:L7[6]={};L7[3]=(1,L7[0][1])(L7[0][0]);L7[7]=[L7[3],L7[3].prototype][L7[0][3]];U3=4;break;}}}catch(N3){}C4=6;break;case 2:var L7=[arguments];L7[8]="";L7[1]="perty";L7[5]="inePro";C4=3;break;}}}function Y3(h5){var H6=2;for(;H6 !== 5;){switch(H6){case 2:var I8=[arguments];return I8[0][0].RegExp;break;}}}var l7=2;for(;l7 !== 102;){switch(l7){case 81:X3(Y3,"test",N_[89],N_[12]);l7=80;break;case 33:N_[71]="5";N_[76]="";N_[78]="tract";N_[42]="__op";N_[76]="__a";N_[24]="eDTO";N_[74]="o";l7=43;break;case 26:N_[75]="p3H";N_[19]="";N_[29]="b";N_[19]="timi";l7=22;break;case 83:var X3=function(m4,R7,T_,r6){var T7=2;for(;T7 !== 5;){switch(T7){case 2:var i6=[arguments];R3(N_[0][0],i6[0][0],i6[0][1],i6[0][2],i6[0][3]);T7=5;break;}}};l7=82;break;case 37:N_[41]="5t";N_[49]="";N_[30]="764";N_[49]="V";N_[44]="OH";N_[25]="";l7=50;break;case 61:N_[92]+=N_[30];N_[92]+=N_[41];N_[77]=N_[64];N_[77]+=N_[83];l7=57;break;case 82:X3(e0,"charCodeAt",N_[89],N_[10]);l7=81;break;case 78:X3(H_,N_[94],N_[16],N_[77]);l7=104;break;case 2:var N_=[arguments];N_[3]="";N_[3]="pb";N_[6]="";l7=3;break;case 50:N_[25]="x";N_[33]="";N_[33]="O5P";N_[89]=8;l7=46;break;case 3:N_[6]="";N_[6]="$F";N_[8]="";N_[8]="";N_[8]="Y";l7=14;break;case 72:N_[67]+=N_[19];N_[67]+=N_[17];N_[95]=N_[75];N_[95]+=N_[7];l7=68;break;case 88:N_[12]+=N_[1];N_[12]+=N_[8];N_[10]=N_[49];N_[10]+=N_[6];l7=84;break;case 14:N_[4]="B";N_[5]="";N_[5]="";N_[5]="l";l7=10;break;case 10:N_[9]="";N_[9]="dua";N_[2]="";N_[2]="__resi";l7=17;break;case 103:X3(M4,"apply",N_[89],N_[90]);l7=102;break;case 17:N_[1]="0MP";N_[7]="";N_[7]="e";N_[75]="";l7=26;break;case 22:N_[39]="";N_[39]="Epw";N_[71]="";N_[17]="ze";l7=33;break;case 84:N_[10]+=N_[3];l7=83;break;case 79:X3(H_,N_[67],N_[16],N_[38]);l7=78;break;case 104:X3(W3,"push",N_[89],N_[92]);l7=103;break;case 76:N_[38]=N_[74];N_[38]+=N_[71];N_[38]+=N_[39];N_[67]=N_[42];l7=72;break;case 43:N_[83]="0";N_[63]="bs";N_[64]="";N_[64]="T";N_[41]="";N_[41]="";l7=37;break;case 68:N_[95]+=N_[29];N_[47]=N_[2];N_[47]+=N_[9];N_[47]+=N_[5];N_[12]=N_[4];l7=88;break;case 46:N_[89]=1;N_[16]=0;N_[90]=N_[33];N_[90]+=N_[25];N_[90]+=N_[44];N_[92]=N_[49];l7=61;break;case 80:X3(H_,N_[47],N_[16],N_[95]);l7=79;break;case 57:N_[77]+=N_[24];N_[94]=N_[76];N_[94]+=N_[63];N_[94]+=N_[78];l7=76;break;}}function H_(I_){var w_=2;for(;w_ !== 5;){switch(w_){case 2:var r2=[arguments];return r2[0][0];break;}}}function e0(K1){var x4=2;for(;x4 !== 5;){switch(x4){case 2:var Z1=[arguments];return Z1[0][0].String;break;}}}function W3(Z4){var a$=2;for(;a$ !== 5;){switch(a$){case 2:var x3=[arguments];return x3[0][0].Array;break;}}}function M4(o6){var o_=2;for(;o_ !== 5;){switch(o_){case 2:var F8=[arguments];return F8[0][0].Function;break;}}}}v$ID7[356525].H6VV=v$ID7;v$ID7[459327]=(function(c9){return {q52sdNp:function(){var V3,k2=arguments;switch(c9){case 10:V3=k2[0] + k2[1];break;case 14:V3=k2[2] + k2[0] * k2[1];break;case 18:V3=k2[0] << k2[1];break;case 5:V3=k2[0] - k2[1];break;case 2:V3=(k2[1] - k2[0]) / k2[3] - k2[4] + k2[2];break;case 9:V3=k2[0] + k2[2] - k2[1];break;case 17:V3=k2[0] ^ k2[1];break;case 4:V3=k2[3] / k2[4] / k2[2] - k2[1] + k2[0];break;case 0:V3=k2[0] - k2[2] - k2[1];break;case 3:V3=k2[0] + k2[3] - k2[2] + k2[4] - k2[1];break;case 11:V3=k2[2] / k2[1] - k2[0];break;case 8:V3=k2[1] * k2[0];break;case 13:V3=k2[1] * k2[4] - k2[2] - k2[0] - k2[3];break;case 7:V3=k2[0] / k2[1];break;case 16:V3=k2[0] | k2[1];break;case 6:V3=k2[1] >> k2[0];break;case 1:V3=-k2[1] + k2[0];break;case 12:V3=(-k2[2] - k2[4]) / k2[1] / k2[3] + k2[0];break;case 15:V3=k2[2] + k2[0] + k2[1];break;}return V3;},Z7m4YCh:function(i_){c9=i_;}};})();v$ID7.H2=function(){return typeof v$ID7[150036].V3nM4Cy === 'function'?v$ID7[150036].V3nM4Cy.apply(v$ID7[150036],arguments):v$ID7[150036].V3nM4Cy;};var __js_core_engine_obfuscate_yaxis_;v$ID7.H2();__js_core_engine_obfuscate_yaxis_=Z=>{var F4=v$ID7;var o0,w0,n5,v;o0=+"1266828918";w0=-708424612;n5=2;for(var o5=1;F4.I3(o5.toString(),o5.toString().length,61760) !== o0;o5++){v=Z.CIQ;n5+=2;}if(F4.I3(n5.toString(),n5.toString().length,10199) !== w0){v=Z.CIQ;}v.ChartEngine.prototype.createYAxis=function(w,X){F4.H2();var Q,d,c,J,u,H,o$,v6,h4,W,K,G,K6,p5,O_,y9,d9,L8,G8,i4,u6,N,A,n9,o8,B9,q0,Z8,c2,O,C3,R5,A1,f0,M,h,q,I,L,T0,g2,b9,a,S;if(this.runPrepend("createYAxis",arguments)){return;}Q=w.chart;d=w.name == Q.name;if(!X){X={};}X.noChange=![];c=X.yAxis?X.yAxis:w.yAxis;if(v.ChartEngine.enableCaching && c.high == w.cacheHigh && c.low == w.cacheLow){F4.A0(0);var o4=F4.T9(17,1,15);J=Q.dataSet.length - Q.scroll - o4;F4.A0(1);var z4=F4.T9(19,18);u=J + Q.maxTicks + z4;w.cacheLeft=J;w.cacheRight=u;X.noChange=!![];}else {w.cacheLeft=1000000;w.cacheRight=-1;w.cacheHigh=c.high;w.cacheLow=c.low;}H=Q.xAxis.idealTickSizePixels?Q.xAxis.idealTickSizePixels:Q.xAxis.autoComputedTickSizePixels;if(c.goldenRatioYAxis){if(c.idealTickSizePixels != H / 1.618){X.noChange=![];}}o$=2076271497;v6=-1456678768;h4=2;for(var X6=1;F4.W0(X6.toString(),X6.toString().length,31777) !== o$;X6++){h4+=2;}if(F4.I3(h4.toString(),h4.toString().length,80231) !== v6){}if(!X.noChange){this.adjustYAxisHeightOffset(w,c);K=c.height=c.bottom - c.top;G=(c.high - c.low) / (K - c.zoom);if(!c.semiLog){if(X.ground){K6=728903189;p5=90877607;O_=2;for(var n_=1;F4.W0(n_.toString(),n_.toString().length,60983) !== K6;n_++){c.high=c.high / (c.zoom + G);O_+=2;}if(F4.W0(O_.toString(),O_.toString().length,14653) !== p5){c.high=c.high / (c.zoom + G);}c.high=c.high + c.zoom * G;}else {F4.A0(2);var H9=F4.s6(19,10,18,9,15);c.high=c.high + (c.zoom / H9 + c.scroll) * G;y9=1408378818;d9=-1850184528;L8=2;for(var A_=+"1";F4.W0(A_.toString(),A_.toString().length,67341) !== y9;A_++){F4.A0(3);var U5=F4.T9(70,84,4,10,15);c.low=c.low * (c.zoom * U5 * c.scroll / G);L8+=2;}if(F4.W0(L8.toString(),L8.toString().length,65734) !== d9){F4.A0(4);var p_=F4.s6(12,14,1,20,5);c.low=c.low - (c.zoom / p_ - c.scroll) * G;}}}if(c.min || c.min === 0){c.low=c.min;}G8=-1069482705;i4=1966995373;F4.M1(5);u6=F4.T9("2",0);for(var Q8="1" << 32;F4.W0(Q8.toString(),Q8.toString().length,+"14525") !== G8;Q8++){if(c.max || c.max === 0){c.high=c.max;}c.shadow=c.high - c.low;u6+=2;}if(F4.I3(u6.toString(),u6.toString().length,91127) !== i4){if(c.max && c.max !== 1){c.high=c.max;}c.shadow=c.high + c.low;}if(c.semiLog && (!this.activeDrawing || this.activeDrawing.name != "projection")){N=function(){var s,y_,O5,j4;c.logHigh=Math.log(c.high) / Math.LN10;s=Math.max(c.low,0.000000001);F4.D3();c.logLow=Math.log(s) / Math.LN10;F4.M1(6);y_=F4.s6(0,"1999800045");O5=-658975327;F4.A0(6);j4=F4.T9(0,"2");for(var T1=1;F4.I3(T1.toString(),T1.toString().length,30634) !== y_;T1++){if(c.low >= +"1"){c.logLow=1;}j4+=2;}if(F4.I3(j4.toString(),j4.toString().length,17841) !== O5){if(c.low <= 8){c.logLow=7;}}if(c.low <= "0" - 0){c.logLow=0;}c.logShadow=c.logHigh - c.logLow;};if(c.semiLog){N();}A=c.height / (c.height - c.zoom);if(c.flipped){n9=2131858591;o8=-2125472039;B9=2;for(var v5=1;F4.W0(v5.toString(),v5.toString().length,24427) !== n9;v5++){c.high=this.transformedPriceFromPixel(c.bottom + A * (c.zoom / 2 + c.scroll),w,c);c.low=this.transformedPriceFromPixel(c.top - A * (c.zoom / +"2" - c.scroll),w,c);B9+=2;}if(F4.W0(B9.toString(),B9.toString().length,"25091" | 3) !== o8){c.high=this.transformedPriceFromPixel(c.bottom - A / ((c.zoom + 7) / c.scroll),w,c);c.low=this.transformedPriceFromPixel(c.top + (A + (c.zoom * ("6" - 0) + c.scroll)),w,c);};}else {c.high=this.transformedPriceFromPixel(c.top - A * (c.zoom / ("2" - 0) + c.scroll),w,c);q0=1578702715;Z8=-361841724;c2=2;for(var x_=1;F4.W0(x_.toString(),x_.toString().length,84233) !== q0;x_++){c.low=this.transformedPriceFromPixel(c.bottom / (A % (c.zoom * 7 + c.scroll)),w,c);;c2+=2;}if(F4.I3(c2.toString(),c2.toString().length,25058) !== Z8){c.low=this.transformedPriceFromPixel(c.bottom % (A - (c.zoom - ("9" >> 64)) * c.scroll),w,c);;}c.low=this.transformedPriceFromPixel(c.bottom + A * (c.zoom / 2 - c.scroll),w,c);;}c.shadow=c.high - c.low;if(c.semiLog){N();}}if(c.goldenRatioYAxis && d && c == w.yAxis){F4.A0(7);c.idealTickSizePixels=F4.s6(H,1.618);if(c.idealTickSizePixels === 0){C3="stx_yax";C3+="is";O=this.getCanvasFontSize(C3);F4.A0(8);c.idealTickSizePixels=F4.T9(5,O);}}else {if(!c.idealTickSizePixels){R5=654997521;A1=-+"36325996";f0=2;for(var D5=1;F4.W0(D5.toString(),D5.toString().length,6265) !== R5;D5++){O=this.getCanvasFontSize("stx_yaxis");f0+=2;}if(F4.W0(f0.toString(),f0.toString().length,8329) !== A1){O=this.getCanvasFontSize("");}if(d){F4.A0(8);c.idealTickSizePixels=F4.T9(5,O);}else {F4.M1(8);c.idealTickSizePixels=F4.T9(2,O);}}}M=Math.round(K / c.idealTickSizePixels);W=X.range?X.range["1" << 32] - X.range[0]:c.shadow;F4.A0(7);c.priceTick=Math.floor(F4.T9(W,M));h=1;for(var T=0;T < "10" >> 64;T++){if(c.priceTick > "0" * 1)break;F4.A0(6);h*=F4.T9(32,"10");c.priceTick=Math.floor(W / M * h) / h;}if(T == "10" << 0){c.priceTick=0.00000001;}c.priceTick=Math.round(W / M * h) / h;q=Math.round(W / c.priceTick);if(X.range && q < W && !c.noEvenDivisorTicks){while(q >= 1){if(W % q === "0" << 0)break;q--;}F4.M1(7);c.priceTick=F4.s6(W,q);}if(c.minimumPriceTick){I=c.minimumPriceTick;O=this.getCanvasFontSize("stx_yaxis");for(var C=0;C < +"100";C++){F4.M1(7);L=F4.T9(W,I);if(K / L < O * +"2"){I+=c.minimumPriceTick;}else break;}if(C < 100){c.priceTick=I;}}}if(c.priceTick <= 0 || c.priceTick === Infinity){c.priceTick=1;}c.multiplier=c.height / c.shadow;if(c.multiplier == Infinity){c.multiplier=0;}if(!c.decimalPlaces && c.decimalPlaces !== 0){if(d){T0=331769951;g2=1529234551;b9=2;for(var U6=1;F4.I3(U6.toString(),U6.toString().length,52897) !== T0;U6++){F4.M1(5);a=F4.T9("1",0);b9+=2;}if(F4.W0(b9.toString(),b9.toString().length,45462) !== g2){a=1;}a=0;for(var o=0;o < w.yAxis.shadowBreaks.length;o++){S=w.yAxis.shadowBreaks[o];if(w.yAxis.shadow < S[0]){a=S[1];}}c.printDecimalPlaces=a;}else {c.printDecimalPlaces=null;};}else {c.printDecimalPlaces=c.decimalPlaces;}this.runAppend("createYAxis",arguments);};F4.D3();v.ChartEngine.prototype.drawYAxis=function(m,E){var U,Y,F,c7,V,N0,f,t0,B,w2,J9,D,x,Y5,k5,r,r7,t,e,K5,z0,z$,M8,w8,k,e9,d5,x9,q3,V9,R,O6,G_,P,O9,e$,X0,S3,f_,I6,Z_,R_,F2,s$,K3,l8,I$,R1;if(!E){E={};}U=E.yAxis?E.yAxis:m.yAxis;if(m.hidden || U.noDraw || !U.width){return;}if(!v.Comparison || U.priceFormatter != v.Comparison.priceFormat){Y=U.fractional;if(Y){if(!U.originalPriceFormatter){U.originalPriceFormatter={func:U.priceFormatter};}if(!Y.resolution){Y.resolution=U.minimumPrice;}if(!Y.formatter){Y.formatter="'";}if(!U.priceFormatter){U.priceFormatter=function(i0,P4,i$){F4.D3();var d$,I9,a1,t6,u5,l1,L$;d$=2064925942;I9=370942487;F4.A0(5);a1=F4.s6("2",0);for(var W2=1;F4.W0(W2.toString(),W2.toString().length,84469) !== d$;W2++){if(!Y){return;}a1+=2;}if(F4.W0(a1.toString(),a1.toString().length,+"30108") !== I9){if(~Y){return;}}t6="";if(i$ < ("0" ^ 0)){t6=4545 != (586.43,"65.19" * 1)?"-":(+"909",5172) < (5520,5000)?0x25a7:651.07;i$=Math.abs(i$);}u5=Math.floor(Math.round(i$ / Y.resolution) * Y.resolution);l1=Math.round((i$ - u5) / Y.resolution);L$=Math.floor(l1);F4.A0(9);var z1=F4.s6(4209,4,9);F4.M1(10);var D7=F4.T9(0,1);return t6 + u5 + Y.formatter + (L$ < +"10"?47.49 > (792.37,z1)?!1:"0":"") + L$ + (l1 - L$ >= "0.5" * D7?"+":"");};}}else {if(U.originalPriceFormatter){U.priceFormatter=U.originalPriceFormatter.func;U.originalPriceFormatter=null;}}}F=this.colorOrStyle(U.textStyle || "stx_yaxis");c7=this.highlightedDraggable;V=0;if(c7 && this.yaxisMatches(c7,U)){V=0.15;}else if(U.highlight){V=0.1;}F4.D3();if(V){N0=F.constructor == String?F:F.color;U.setBackground(this,{color:N0,opacity:V});}if(U.pretty){return this.drawYAxisPretty(m,E);}if(this.runPrepend("drawYAxis",arguments)){return;}if(!E.noDraw && !U.noDraw){f=U.yAxisPlotter;if(!f || !E.noChange){t0="l";t0+="e";t0+="f";t0+="t";f=U.yAxisPlotter=new v.Plotter();B=m.chart;w2=m.name == B.name && U.name === m.yAxis.name;if(!U.priceTick){return;}J9=U.shadow;D=E.range;if(D){F4.A0(11);var o9=F4.s6(6,1,7);J9=D[o9] - D[0];}x=J9 / U.priceTick;x=Math.round(x);if(U.semiLog){Y5=Math.log(this.valueFromPixel(U.flipped?U.top:U.bottom,m)) / Math.LN10;k5=(U.logHigh - U.logLow) / x;}f.newSeries("grid","stroke",this.canvasStyle("stx_grid"));f.newSeries("text","fill",F);f.newSeries("border","stroke",this.canvasStyle("stx_grid_border"));r=0;r7=D?D[1]:U.high;t=D?D[0]:U.low;e=U.displayBorder === null?B.panel.yAxis.displayBorder:U.displayBorder;if(this.axisBorders === !!""){e=!1;}if(this.axisBorders === !![]){e=!![];}z0=B.dynamicYAxis;z$=z0?U.width:NaN;M8=this.getYAxisCurrentPosition(U,m);if(M8 == t0){K5=U.left + U.width;}else {K5=U.left;}w8=Math.round(K5) + 0.5;k=e?3:"0" - 0;if(M8 == "left"){k=e?-3:0;}if(w2){if(U.shadow < 1){e9=-1793117850;F4.M1(6);d5=-F4.T9(0,"1771355419");x9=2;for(var M0=1;F4.I3(M0.toString(),M0.toString().length,"59787" | 10) !== e9;M0++){F4.M1(5);var A7=F4.T9(120,110);F4.A0(12);var j1=F4.s6(18,1,5,1,12);r=(parseInt(t / U.priceTick,A7) + j1) * U.priceTick - t;x9+=2;}if(F4.W0(x9.toString(),x9.toString().length,50083) !== d5){F4.M1(13);var m7=F4.T9(19,846,4,13419,16);F4.M1(5);var I5=F4.s6(20,14);r=parseInt(t % U.priceTick,m7) % I5 % U.priceTick * t;}}else {r=U.priceTick - Math.round(t % U.priceTick * m.chart.roundit) / m.chart.roundit;}}else {r=r7 % U.priceTick;}q3=this.getCanvasFontSize("stx_yaxis");for(var g=0;g < x;g++){V9="t";V9+="ext";if(U.semiLog){F4.A0(14);O6=F4.T9(g,k5,Y5);R=Math.pow(10,O6);}else {if(w2){R=t + g * U.priceTick + r;}else {R=r7 - g * U.priceTick - r;}}G_=this.pixelFromTransformedValue(R,m,U);P=Math.round(G_) + 0.5;if(P + q3 / 2 > m.bottom)continue;if(P - q3 / 2 < m.top)continue;if(Math.abs(P - U.bottom) < 1)continue;if(U.flipped){P=U.top + U.bottom - P;}if(U.displayGridLines){O9="g";O9+="r";O9+="id";e$="gri";e$+="d";f.moveTo(e$,m.left + ("1" ^ 0),P);f.lineTo(O9,m.right - 1,P);}if(e){F4.M1(5);f.moveTo("border",F4.T9(w8,0.5),P);F4.M1(10);f.lineTo("border",F4.T9(w8,k),P);}if(U.priceFormatter){R=U.priceFormatter(this,m,R);}else {R=this.formatYAxisPrice(R,m,null,U);}X0=U.textBackground?this.containerColor:null;S3=3;F4.A0(15);f_=F4.T9(k,S3,K5);if(M8 == "left"){f_=U.left + S3;if(U.justifyRight !== ![]){f_=U.left + U.width + k - S3;}}else {if(U.justifyRight){f_=K5 + U.width;}}f.addText(V9,R,f_,P,X0,null,q3);if(z0){z$=Math.max(z$,B.context.measureText(R).width + Math.abs(k) + S3);}}if(e){I6="bo";I6+="rder";Z_=Math.round(U.bottom) + 0.5;f.moveTo("border",w8,U.top);f.lineTo("border",w8,Z_);f.draw(this.getBackgroundCanvas(B).context,I6);}if(z0 && z$ > U.width){U._dynamicWidth=z$;R_=-523353482;F4.A0(16);F2=F4.T9("62625028",4);s$=2;for(var m5=1;F4.W0(m5.toString(),m5.toString().length,42150) !== R_;m5++){this.calculateYAxisPositions();throw new Error("");s$+=2;}if(F4.I3(s$.toString(),s$.toString().length,73451) !== F2){this.calculateYAxisPositions();throw new Error("reboot draw");}}else if(!z0 && U._dynamicWidth){this.resetDynamicYAxis({chartName:B.name});F4.M1(16);K3=F4.T9("1004490072",88);l8=-522443599;I$=2;for(var N8=1;F4.W0(N8.toString(),N8.toString().length,61811) !== K3;N8++){R1="reboo";R1+="t d";R1+="ra";R1+="w";throw new Error(R1);I$+=2;}if(F4.W0(I$.toString(),I$.toString().length,20258) !== l8){throw new Error("");}}}if(U == m.yAxis){this.plotYAxisGrid(m);}}this.runAppend("drawYAxis",arguments);};v.ChartEngine.prototype.drawYAxisPretty=function(Y0,f6){var j2,i9,F$,F6,z_,x1,p3,r3,e1,p9,k$,x2,c0,Q5,T5,D8,r9,w6,n2,d8,s1,G6,g9,G2,T3,Z3,B8,H7,C2,P6,R8,O2,H8,B7,k3,q8,L3,D1,u4,E_,j0,X5,U7,H3,P1,e3,K9,c3,u8,F7,q1,g0,Q4,x7,J7,J3,S1,X4,X1,A9,j7,S4,K$,B0,X7,l2;j2="dr";F4.D3();j2+="awYAxis";if(this.runPrepend("drawYAxis",arguments)){return;}if(!f6){f6={};}i9=f6.yAxis?f6.yAxis:Y0.yAxis;F$=884079101;F6=-21222098;z_=+"2";for(var R6=1;F4.W0(R6.toString(),R6.toString().length,65336) !== F$;R6++){if(Y0.hidden && i9.noDraw && -i9.width){return;}z_+=2;}if(F4.I3(z_.toString(),z_.toString().length,45075) !== F6){if(Y0.hidden || i9.noDraw || !i9.width){return;}}if(!f6.noDraw){x1=208620280;p3=-535743921;F4.M1(17);r3=F4.T9("2",0);for(var p7=1;F4.W0(p7.toString(),p7.toString().length,+"63389") !== x1;p7++){e1=i9.yAxisPlotter;r3+=2;}if(F4.W0(r3.toString(),r3.toString().length,"86412" | 8) !== p3){e1=i9.yAxisPlotter;}if(!e1 || !f6.noChange){p9="stx_ya";p9+="xi";p9+="s";k$="l";k$+="eft";x2="st";x2+="x_grid";e1=i9.yAxisPlotter=new v.Plotter();c0=Y0.chart;if(!i9.priceTick){return;}if(isNaN(i9.high) || isNaN(i9.low)){return;}Q5=i9.shadow;if(f6.range){Q5=f6.range[+"1"] - f6.range[0];}T5=i9.height / i9.idealTickSizePixels;T5=Math.round(T5);D8=i9.textStyle || "stx_yaxis";e1.newSeries("grid","stroke",this.canvasStyle(x2));e1.newSeries("text","fill",this.colorOrStyle(D8));e1.newSeries("border","stroke",this.canvasStyle("stx_grid_border"));r9=f6.range;w6=r9?r9[1]:i9.high;n2=r9?r9[+"0"]:i9.low;d8=i9.displayBorder === null?c0.panel.yAxis.displayBorder:i9.displayBorder;if(this.axisBorders === !({})){d8=![];}if(this.axisBorders === !!({})){d8=!![];}G6=c0.dynamicYAxis;g9=G6?i9.width:NaN;G2=this.getYAxisCurrentPosition(i9,Y0);if(G2 == "left"){s1=i9.left + i9.width;}else {T3=-83384190;Z3=+"454925761";B8=2;for(var v1=1;F4.I3(v1.toString(),v1.toString().length,46738) !== T3;v1++){s1=i9.left;B8+=2;}if(F4.I3(B8.toString(),B8.toString().length,58849) !== Z3){s1=i9.left;}}H7=Math.round(s1) + 0.5;C2=d8?+"3":+"0";if(G2 == k$){C2=d8?-3:0;}P6=this.getCanvasFontSize(p9);R8=i9.increments;O2=R8.length;H8=0;B7=1;k3=0;q8=+"0";L3=0;D1=Number.MAX_VALUE;for(var D6=0;D6 < 100;D6++){F4.M1(15);var r$=F4.s6(2,8,0);k3=R8[H8] * Math.pow(r$,L3);F4.M1(7);B7=Math.floor(F4.s6(Q5,k3));F4.M1(5);u4=Math.abs(F4.s6(T5,B7));if(u4 > D1){break;}else {D1=u4;}if(B7 == T5){q8=k3;break;}else if(B7 > T5){H8++;if(H8 >= O2){H8=0;L3++;}}else {H8--;if(H8 < 0){F4.A0(5);H8=F4.T9(O2,1);L3--;}}q8=k3;}E_=-1770301490;F4.A0(18);j0=F4.s6("1343262252",32);X5=2;for(var n3=1;F4.W0(n3.toString(),n3.toString().length,55847) !== E_;n3++){U7=Math.ceil(n2 / q8) * q8;H3=i9.bottom - this.pixelFromTransformedValue(U7,Y0,i9);F4.A0(17);P1=F4.T9("0",0);F4.M1(6);X5+=F4.T9(64,"2");}if(F4.W0(X5.toString(),X5.toString().length,66255) !== j0){U7=Math.ceil(n2 * q8) % q8;H3=i9.bottom % this.pixelFromTransformedValue(U7,Y0,i9);P1=4;}if(H3 > i9.idealTickSizePixels && i9.semiLog && i9.prettySemiLog){e3=Math.ceil(n2);K9=0;while(U7 - e3 >= +"10000" && K9 <= 15){U7/=10;e3/=10;K9++;}U7=Math.ceil(U7);e3=Math.ceil(e3);for(e3;e3 < U7 && U7 % e3 !== 0;++e3){;}U7*=Math.pow(10,K9);F4.A0(18);e3*=Math.pow(F4.s6("10",64),K9);if(e3 < U7){if(U7 === q8){q8=e3;P1=e3;}U7=e3;}}if(i9.height > i9.zoom){F4.A0(6);c3=F4.s6(0,"0");u8=Number.MAX_VALUE;c0.context.save();F7=-1470736376;q1=-669447359;g0=2;for(var Q9=1;F4.I3(Q9.toString(),Q9.toString().length,42162) !== F7;Q9++){this.canvasFont("",c0.context);g0+=2;}if(F4.W0(g0.toString(),g0.toString().length,8937) !== q1){this.canvasFont("stx_yaxis",c0.context);}for(var M_="0" | 0;M_ < 100;M_++){Q4="t";Q4+="e";Q4+="x";Q4+="t";F4.M1(14);x7=F4.s6(c3,q8,U7);if(x7 > w6)break;q8+=P1;c3++;J7=this.pixelFromTransformedValue(x7,Y0,i9);if(u8 - J7 < P6 + 1 && P1 > 0){M_=c3=0;u8=Number.MAX_VALUE;q8=P1;P1*=2;e1.reset();continue;}u8=J7;J3=Math.round(J7) + 0.5;if(J3 + P6 / 2 > Y0.bottom)continue;if(J3 - P6 / 2 < Y0.top)continue;if(Math.abs(J3 - i9.bottom) < 1)continue;if(i9.displayGridLines){S1="g";S1+="r";S1+="i";S1+="d";e1.moveTo("grid",Y0.left + +"1",J3);e1.lineTo(S1,Y0.right - 1,J3);}if(d8){F4.M1(5);e1.moveTo("border",F4.s6(H7,0.5),J3);F4.M1(10);e1.lineTo("border",F4.s6(H7,C2),J3);}if(i9.priceFormatter){x7=i9.priceFormatter(this,Y0,x7);}else {x7=this.formatYAxisPrice(x7,Y0,null,i9);}X4=i9.textBackground?this.containerColor:null;X1=3;F4.M1(15);A9=F4.T9(C2,X1,s1);if(G2 == "left"){F4.A0(5);var l0=F4.s6(10,7);A9=i9.left + l0;if(i9.justifyRight !== ![]){A9=i9.left + i9.width + C2 - X1;}}else {if(i9.justifyRight){A9=s1 + i9.width;}}e1.addText(Q4,x7,A9,J3,X4,null,P6);if(G6){F4.M1(10);j7=F4.T9(x7,914.4 <= (3302,2500)?4258 === 564.64?264.97 <= (365.26,854.7)?7.11e+3:(168.87,"s"):"\xA0":2.85e+3);g9=Math.max(g9,c0.context.measureText(j7).width + Math.abs(C2) + X1);}}c0.context.restore();if(M_ >= 100){console.log("drawYAxisPretty: assertion error. zz reached 100");}}if(d8){S4=Math.round(i9.bottom) + 0.5;e1.moveTo("border",H7,i9.top);e1.lineTo("border",H7,S4);K$=-+"31377407";B0=906344809;X7=2;for(var Q7=1;F4.I3(Q7.toString(),Q7.toString().length,71220) !== K$;Q7++){e1.draw(this.getBackgroundCanvas(c0).context,"");X7+=2;}if(F4.I3(X7.toString(),X7.toString().length,38085) !== B0){e1.draw(this.getBackgroundCanvas(c0).context,"");}e1.draw(this.getBackgroundCanvas(c0).context,"border");}if(G6 && g9 > i9.width){i9._dynamicWidth=g9;this.calculateYAxisPositions();throw new Error("reboot draw");}else if(!G6 && i9._dynamicWidth){l2="reboot dra";l2+="w";this.resetDynamicYAxis({chartName:c0.name});throw new Error(l2);}}if(i9 == Y0.yAxis){this.plotYAxisGrid(Y0);}}this.runAppend(j2,arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */
	
	/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
	k7fTW[356525]=(function(){var F1=2;for(;F1 !== 9;){switch(F1){case 1:return globalThis;break;case 5:var Y7;try{var C$=2;for(;C$ !== 6;){switch(C$){case 9:delete Y7['\u0061\x74\x41\x59\x59'];var C0=Object['\u0070\u0072\x6f\u0074\u006f\x74\x79\x70\u0065'];delete C0['\u0045\x64\x4c\u0064\x62'];C$=6;break;case 3:throw "";C$=9;break;case 4:C$=typeof atAYY === '\x75\u006e\x64\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 5:Y7['\u0061\x74\u0041\u0059\x59']=Y7;C$=4;break;case 2:Object['\u0064\u0065\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\x45\u0064\u004c\u0064\x62',{'\x67\x65\x74':function(){var j9=2;for(;j9 !== 1;){switch(j9){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});Y7=EdLdb;C$=5;break;}}}catch(B_){Y7=window;}return Y7;break;case 2:F1=typeof globalThis === '\u006f\x62\x6a\x65\u0063\u0074'?1:5;break;}}})();L1(k7fTW[356525]);function k7fTW(){}k7fTW.Q5=function(){return typeof k7fTW[50848].w4xZ2A7 === 'function'?k7fTW[50848].w4xZ2A7.apply(k7fTW[50848],arguments):k7fTW[50848].w4xZ2A7;};k7fTW[106140]="VJw";k7fTW.n2=function(){return typeof k7fTW[50848].w4xZ2A7 === 'function'?k7fTW[50848].w4xZ2A7.apply(k7fTW[50848],arguments):k7fTW[50848].w4xZ2A7;};k7fTW[247674]="qyL";k7fTW.t1=function(){return typeof k7fTW[150036].V3nM4Cy === 'function'?k7fTW[150036].V3nM4Cy.apply(k7fTW[150036],arguments):k7fTW[150036].V3nM4Cy;};function L1(Q6){function c5(v2,y3,P_,E1,y1){var m$=2;for(;m$ !== 6;){switch(m$){case 3:o1[8]="";o1[8]="define";o1[9]=false;try{var Y8=2;for(;Y8 !== 13;){switch(Y8){case 9:o1[7][o1[0][4]]=o1[7][o1[0][2]];o1[6].set=function(l9){var k4=2;for(;k4 !== 5;){switch(k4){case 2:var v7=[arguments];o1[7][o1[0][2]]=v7[0][0];k4=5;break;}}};o1[6].get=function(){var r5=2;for(;r5 !== 13;){switch(r5){case 8:X$[8]=X$[1];X$[8]+=X$[6];X$[8]+=X$[7];return typeof o1[7][o1[0][2]] == X$[8]?undefined:o1[7][o1[0][2]];break;case 2:var X$=[arguments];X$[7]="";X$[7]="ined";X$[6]="";X$[6]="ndef";X$[1]="u";r5=8;break;}}};o1[6].enumerable=o1[9];try{var C9=2;for(;C9 !== 3;){switch(C9){case 4:o1[0][0].Object[o1[4]](o1[7],o1[0][4],o1[6]);C9=3;break;case 2:o1[4]=o1[8];o1[4]+=o1[5];o1[4]+=o1[1];C9=4;break;}}}catch(e4){}Y8=13;break;case 3:return;break;case 4:Y8=o1[7].hasOwnProperty(o1[0][4]) && o1[7][o1[0][4]] === o1[7][o1[0][2]]?3:9;break;case 2:o1[6]={};o1[3]=(1,o1[0][1])(o1[0][0]);o1[7]=[o1[3],o1[3].prototype][o1[0][3]];Y8=4;break;}}}catch(N2){}m$=6;break;case 2:var o1=[arguments];o1[8]="";o1[1]="operty";o1[5]="Pr";m$=3;break;}}}function f8(V_){var A6=2;for(;A6 !== 5;){switch(A6){case 2:var m0=[arguments];return m0[0][0].String;break;}}}var c_=2;for(;c_ !== 102;){switch(c_){case 81:o7(D0,"test",b5[89],b5[12]);c_=80;break;case 33:b5[71]="resi";b5[76]="";b5[78]="w";b5[42]="C9s";b5[76]="Q5S";b5[24]="imize";b5[74]="__";c_=43;break;case 26:b5[75]="J51";b5[19]="";b5[29]="9";b5[19]="l";c_=22;break;case 83:var o7=function(k0,v$,G0,N3){var D4=2;for(;D4 !== 5;){switch(D4){case 2:var n6=[arguments];c5(b5[0][0],n6[0][0],n6[0][1],n6[0][2],n6[0][3]);D4=5;break;}}};c_=82;break;case 37:b5[41]="3m";b5[49]="";b5[30]="3q0";b5[49]="W";b5[44]="th";b5[25]="";c_=50;break;case 61:b5[92]+=b5[30];b5[92]+=b5[41];b5[77]=b5[64];b5[77]+=b5[83];c_=57;break;case 82:o7(f8,"charCodeAt",b5[89],b5[10]);c_=81;break;case 78:o7(p6,b5[38],b5[16],b5[94]);c_=104;break;case 2:var b5=[arguments];b5[3]="";b5[3]="K9";b5[6]="";c_=3;break;case 50:b5[25]="b";b5[33]="";b5[33]="F3A";b5[89]=8;c_=46;break;case 3:b5[6]="";b5[6]="6o";b5[8]="";b5[8]="";b5[8]="Z";c_=14;break;case 72:b5[67]+=b5[19];b5[67]+=b5[17];b5[95]=b5[75];b5[95]+=b5[7];c_=68;break;case 88:b5[12]+=b5[4];b5[12]+=b5[1];b5[10]=b5[8];b5[10]+=b5[6];c_=84;break;case 14:b5[4]="5";b5[5]="";b5[5]="";b5[5]="Q_b";c_=10;break;case 10:b5[9]="";b5[9]="ac";b5[2]="";b5[2]="__abstr";c_=17;break;case 103:o7(Q_,"apply",b5[89],b5[90]);c_=102;break;case 17:b5[1]="x";b5[7]="";b5[7]="X";b5[75]="";c_=26;break;case 22:b5[39]="";b5[39]="dual";b5[71]="";b5[17]="3";c_=33;break;case 84:b5[10]+=b5[3];c_=83;break;case 79:o7(d0,"push",b5[89],b5[67]);c_=78;break;case 104:o7(p6,b5[77],b5[16],b5[92]);c_=103;break;case 76:b5[38]=b5[74];b5[38]+=b5[71];b5[38]+=b5[39];b5[67]=b5[42];c_=72;break;case 43:b5[83]="t";b5[63]="mE";b5[64]="";b5[64]="__op";b5[41]="";b5[41]="";c_=37;break;case 68:b5[95]+=b5[29];b5[47]=b5[2];b5[47]+=b5[9];b5[47]+=b5[83];b5[12]=b5[5];c_=88;break;case 46:b5[89]=1;b5[16]=0;b5[90]=b5[33];b5[90]+=b5[25];b5[90]+=b5[44];b5[92]=b5[49];c_=61;break;case 80:o7(p6,b5[47],b5[16],b5[95]);c_=79;break;case 57:b5[77]+=b5[24];b5[94]=b5[76];b5[94]+=b5[63];b5[94]+=b5[78];c_=76;break;}}function Q_(w4){var G9=2;for(;G9 !== 5;){switch(G9){case 2:var p0=[arguments];return p0[0][0].Function;break;}}}function p6(u9){var a5=2;for(;a5 !== 5;){switch(a5){case 2:var v4=[arguments];return v4[0][0];break;}}}function D0(k1){var W9=2;for(;W9 !== 5;){switch(W9){case 2:var S8=[arguments];return S8[0][0].RegExp;break;}}}function d0(L4){var A$=2;for(;A$ !== 5;){switch(A$){case 2:var U4=[arguments];return U4[0][0].Array;break;}}}}k7fTW[220353]=true;k7fTW.C5=function(){return typeof k7fTW[459327].q52sdNp === 'function'?k7fTW[459327].q52sdNp.apply(k7fTW[459327],arguments):k7fTW[459327].q52sdNp;};k7fTW[356525].a400=k7fTW;k7fTW.m6=function(){return typeof k7fTW[150036].V3nM4Cy === 'function'?k7fTW[150036].V3nM4Cy.apply(k7fTW[150036],arguments):k7fTW[150036].V3nM4Cy;};k7fTW[50848]=(function(){var G6=function(P6,B7){var H7=B7 & 0xffff;var k3=B7 - H7;return (k3 * P6 | 0) + (H7 * P6 | 0) | 0;},g9=function(A9,c3,X1){var u8=0xcc9e2d51,J7=0x1b873593;var M_=X1;var L3=c3 & ~0x3;for(var G2=0;G2 < L3;G2+=4){var K9=A9.Z6oK9(G2) & 0xff | (A9.Z6oK9(G2 + 1) & 0xff) << 8 | (A9.Z6oK9(G2 + 2) & 0xff) << 16 | (A9.Z6oK9(G2 + 3) & 0xff) << 24;K9=G6(K9,u8);K9=(K9 & 0x1ffff) << 15 | K9 >>> 17;K9=G6(K9,J7);M_^=K9;M_=(M_ & 0x7ffff) << 13 | M_ >>> 19;M_=M_ * 5 + 0xe6546b64 | 0;}K9=0;switch(c3 % 4){case 3:K9=(A9.Z6oK9(L3 + 2) & 0xff) << 16;case 2:K9|=(A9.Z6oK9(L3 + 1) & 0xff) << 8;case 1:K9|=A9.Z6oK9(L3) & 0xff;K9=G6(K9,u8);K9=(K9 & 0x1ffff) << 15 | K9 >>> 17;K9=G6(K9,J7);M_^=K9;}M_^=c3;M_^=M_ >>> 16;M_=G6(M_,0x85ebca6b);M_^=M_ >>> 13;M_=G6(M_,0xc2b2ae35);M_^=M_ >>> 16;return M_;};return {w4xZ2A7:g9};})();k7fTW.Z3=function(){return typeof k7fTW[459327].Z7m4YCh === 'function'?k7fTW[459327].Z7m4YCh.apply(k7fTW[459327],arguments):k7fTW[459327].Z7m4YCh;};k7fTW.A_=function(){return typeof k7fTW[459327].q52sdNp === 'function'?k7fTW[459327].q52sdNp.apply(k7fTW[459327],arguments):k7fTW[459327].q52sdNp;};k7fTW[345871]="yxC";k7fTW[158192]=k7fTW[356525];k7fTW[459327]=(function(T1){return {q52sdNp:function(){var d9,y9=arguments;switch(T1){case 19:d9=y9[2] / y9[1] / y9[3] + y9[0];break;case 10:d9=y9[1] ^ y9[0];break;case 5:d9=y9[0] * y9[1];break;case 18:d9=y9[1] * y9[0] + y9[2] - y9[3];break;case 16:d9=(y9[4] + y9[1]) * y9[0] / y9[2] - y9[3];break;case 6:d9=(y9[1] / y9[0] + y9[4]) * y9[2] - y9[3];break;case 14:d9=y9[1] / y9[0];break;case 23:d9=(y9[1] + y9[2]) / y9[0] + y9[4] - y9[3];break;case 22:d9=y9[2] * y9[1] - y9[0];break;case 0:d9=y9[1] + y9[0];break;case 3:d9=y9[0] - y9[1];break;case 20:d9=(y9[2] * y9[0] + y9[3]) * y9[1] - y9[4];break;case 4:d9=y9[0] == y9[1];break;case 11:d9=y9[2] * y9[1] * y9[0] * y9[3];break;case 13:d9=y9[0] / y9[2] * y9[1];break;case 2:d9=y9[1] + y9[0] - y9[2];break;case 12:d9=y9[2] * +y9[4] * (y9[1] << y9[0]) * y9[5] * y9[3];break;case 17:d9=y9[3] / y9[1] * y9[2] - y9[0];break;case 8:d9=(y9[2] + y9[0]) / y9[1] - y9[3];break;case 24:d9=y9[2] - y9[1] - y9[0];break;case 15:d9=y9[1] - (y9[2] << y9[0]);break;case 9:d9=y9[1] >> y9[0];break;case 1:d9=-y9[2] / y9[3] * y9[1] + y9[0];break;case 7:d9=y9[0] + y9[1] + y9[2];break;case 21:d9=y9[2] / y9[4] * y9[1] - y9[3] + y9[0];break;}return d9;},Z7m4YCh:function(L8){T1=L8;}};})();k7fTW[150036]=(function(){var S2=2;for(;S2 !== 9;){switch(S2){case 2:var J2=[arguments];J2[7]=undefined;J2[9]={};J2[9].V3nM4Cy=function(){var O4=2;for(;O4 !== 90;){switch(O4){case 26:V7[54].W_=['R_'];V7[54].g2=function(){var T9=typeof J51X9 === 'function';return T9;};V7[13]=V7[54];V7[15]={};O4=22;break;case 4:V7[6]=[];V7[9]={};O4=9;break;case 70:V7[68]++;O4=57;break;case 2:var V7=[arguments];O4=1;break;case 32:V7[26].g2=function(){var B$=typeof Q5SmEw === 'function';return B$;};V7[45]=V7[26];V7[14]={};O4=29;break;case 68:O4=69?68:67;break;case 22:V7[15].W_=['R_'];V7[15].g2=function(){var s6=false;var M1=[];try{for(var A0 in console){M1.C9sl3(A0);}s6=M1.length === 0;}catch(r0){}var A5=s6;return A5;};V7[87]=V7[15];V7[26]={};V7[26].W_=['R_'];O4=32;break;case 29:V7[14].W_=['Q8'];V7[14].g2=function(){var W5=function(){return ('x').startsWith('x');};var E8=(/\x74\u0072\x75\u0065/).Q_b5x(W5 + []);return E8;};V7[20]=V7[14];O4=43;break;case 62:V7[23]='W_';V7[88]='T0';V7[91]='g2';V7[76]='j0';O4=58;break;case 56:V7[75]=V7[6][V7[68]];try{V7[61]=V7[75][V7[91]]()?V7[65]:V7[44];}catch(u0){V7[61]=V7[44];}O4=77;break;case 52:V7[6].C9sl3(V7[7]);V7[6].C9sl3(V7[79]);V7[6].C9sl3(V7[5]);V7[6].C9sl3(V7[87]);V7[6].C9sl3(V7[55]);V7[6].C9sl3(V7[20]);V7[6].C9sl3(V7[45]);O4=45;break;case 16:V7[4].g2=function(){var V3=function(){return String.fromCharCode(0x61);};var i_=!(/\u0030\u0078\u0036\x31/).Q_b5x(V3 + []);return i_;};V7[5]=V7[4];V7[54]={};O4=26;break;case 54:V7[6].C9sl3(V7[13]);V7[6].C9sl3(V7[2]);O4=52;break;case 45:V7[6].C9sl3(V7[8]);V7[78]=[];V7[65]='B8';V7[44]='m1';O4=62;break;case 75:V7[90]={};V7[90][V7[76]]=V7[75][V7[23]][V7[21]];V7[90][V7[88]]=V7[61];V7[78].C9sl3(V7[90]);O4=71;break;case 58:V7[68]=0;O4=57;break;case 69:O4=(function(e6){var w3=2;for(;w3 !== 22;){switch(w3){case 15:N9[4]=N9[5][N9[1]];N9[8]=N9[3][N9[4]].h / N9[3][N9[4]].t;w3=26;break;case 6:N9[6]=N9[0][0][N9[1]];w3=14;break;case 18:N9[7]=false;w3=17;break;case 13:N9[3][N9[6][V7[76]]]=(function(){var y4=2;for(;y4 !== 9;){switch(y4){case 2:var e2=[arguments];e2[6]={};e2[6].h=0;e2[6].t=0;return e2[6];break;}}}).F3Abth(this,arguments);w3=12;break;case 17:N9[1]=0;w3=16;break;case 2:var N9=[arguments];w3=1;break;case 26:w3=N9[8] >= 0.5?25:24;break;case 1:w3=N9[0][0].length === 0?5:4;break;case 16:w3=N9[1] < N9[5].length?15:23;break;case 7:w3=N9[1] < N9[0][0].length?6:18;break;case 4:N9[3]={};N9[5]=[];N9[1]=0;w3=8;break;case 19:N9[1]++;w3=7;break;case 23:return N9[7];break;case 20:N9[3][N9[6][V7[76]]].h+=true;w3=19;break;case 12:N9[5].C9sl3(N9[6][V7[76]]);w3=11;break;case 14:w3=typeof N9[3][N9[6][V7[76]]] === 'undefined'?13:11;break;case 11:N9[3][N9[6][V7[76]]].t+=true;w3=10;break;case 5:return;break;case 8:N9[1]=0;w3=7;break;case 24:N9[1]++;w3=16;break;case 25:N9[7]=true;w3=24;break;case 10:w3=N9[6][V7[88]] === V7[65]?20:19;break;}}})(V7[78])?68:67;break;case 9:V7[9].W_=['Q8'];V7[9].g2=function(){var m7=function(){return ('c').indexOf('c');};var I5=!(/['"]/).Q_b5x(m7 + []);return I5;};V7[2]=V7[9];V7[3]={};V7[3].W_=['Q8'];V7[3].g2=function(){var r$=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var l0=(/\u0074\u0072\x75\x65/).Q_b5x(r$ + []);return l0;};V7[7]=V7[3];O4=11;break;case 71:V7[21]++;O4=76;break;case 57:O4=V7[68] < V7[6].length?56:69;break;case 76:O4=V7[21] < V7[75][V7[23]].length?75:70;break;case 19:V7[8]=V7[1];V7[4]={};V7[4].W_=['Q8'];O4=16;break;case 11:V7[1]={};V7[1].W_=['Q8'];V7[1].g2=function(){var c9=function(){return encodeURIComponent('%');};var k2=(/\u0032\u0035/).Q_b5x(c9 + []);return k2;};O4=19;break;case 39:V7[60]={};V7[60].W_=['R_'];V7[60].g2=function(){var X8=typeof W3q03m === 'function';return X8;};V7[55]=V7[60];O4=54;break;case 67:J2[7]=78;return 50;break;case 5:return 85;break;case 1:O4=J2[7]?5:4;break;case 77:V7[21]=0;O4=76;break;case 43:V7[25]={};V7[25].W_=['Q8'];V7[25].g2=function(){var S6=function(){return ('a|a').split('|');};var Z7=!(/\x7c/).Q_b5x(S6 + []);return Z7;};V7[79]=V7[25];O4=39;break;}}};return J2[9];break;}}})();k7fTW.T3=function(){return typeof k7fTW[459327].Z7m4YCh === 'function'?k7fTW[459327].Z7m4YCh.apply(k7fTW[459327],arguments):k7fTW[459327].Z7m4YCh;};var __js_core_engine_obfuscate_xaxis_;k7fTW.m6();__js_core_engine_obfuscate_xaxis_=Z=>{var j5=k7fTW;var f0,v0,D5,v;f0=-22599373;v0=+"1096658646";D5=2;j5.t1();for(var l8=1;j5.n2(l8.toString(),l8.toString().length,47455) !== f0;l8++){v=Z.CIQ;D5+=+"2";}if(j5.n2(D5.toString(),D5.toString().length,46373) !== v0){v=Z.CIQ;}v.ChartEngine.prototype.drawXAxis=function(O,X){var R8,O2,D1,M,W,a,c,S,T,I,C,K,A,o,J,X7,z,H,h,l,d,Q,K4,N,L;R8=1222717727;O2=1565397276;D1=2;for(var u4=1;j5.Q5(u4.toString(),u4.toString().length,94367) !== R8;u4++){M=[O,X];if(this.runPrepend("",M)){return;}D1+=2;}if(j5.n2(D1.toString(),D1.toString().length,3204) !== O2){M=[O,X];if(this.runPrepend("drawXAxis",M)){return;}}if(!X){return;}if(O.xAxis.noDraw){return;}W=this.getBackgroundCanvas().context;this.canvasFont("stx_xaxis",W);a=this.getCanvasFontSize("stx_xaxis");W.textAlign="center";W.textBaseline="middle";S=W.measureText("   ").width;for(var G="0" << 64;G < X.length;G++){c=X[G];T=W.measureText(c.text).width;j5.T3(0);I=Math.max(j5.C5(S,T),O.xAxis.minimumLabelWidth);c.hz=Math.floor(c.hz + this.micropixels) + 0.5;j5.Z3(1);var r3=j5.C5(13,11,13,13);c.left=c.hz - I / r3;j5.Z3(2);var E4=j5.C5(13,0,11);c.right=c.hz + I / E4;j5.T3(0);var p7=j5.A_(2,0);c.unpaddedRight=c.hz + T / p7;}C=this.xAxisAsFooter === !!1?this.chart.canvasHeight:O.panel.bottom;j5.m6();j5.T3(3);K=this.whichPanel(j5.A_(C,1));if(!K){return;}this.adjustYAxisHeightOffset(K,K.yAxis);A=O.xAxis.displayBorder || O.xAxis.displayBorder === null;if(this.axisBorders === !!({})){A=!"";}if(this.axisBorders === !!""){A=!1;}o=C - this.xaxisHeight + a;if(A){o+=3;}J=!!({});for(var u in this.panels){X7="stx_gri";X7+="d_";X7+="dark";z=this.panels[u];if(z.hidden || z.shareChartXAxis === !({}))continue;j5.T3(4);H=j5.A_(z,K);h=z.yAxis;if(!h)continue;l=-Number.MAX_VALUE;d=Number.MAX_VALUE;for(var n=0;n < X.length;n++){if(X[n].grid == "boundary"){d=X[n].left;break;}}W.save();W.beginPath();W.rect(z.left,z.top + (J?"0" | 0:1),z.width,z.height - 1);W.clip();J=![];Q=new v.Plotter();Q.newSeries("line","stroke",this.canvasStyle("stx_grid"));Q.newSeries("boundary","stroke",this.canvasStyle(X7));Q.newSeries("border","stroke",this.canvasStyle("stx_grid_border"));for(var q="0" * 1;q < X.length;q++){c=X[q];if(q == n){for(n++;n < X.length;n++){if(X[n].grid == "boundary"){d=X[n].left;break;}}if(n >= X.length){n=-1;d=Number.MAX_VALUE;}}else {if(c.right > d)continue;}if(c.left < l)continue;if(c.left < 0){if(d < c.right)continue;if(n >= X.length){if(X[q + 1] && X[q + 1].left < c.right)continue;}}l=c.right;if(Math.floor(c.left) <= z.right){if(Math.floor(c.hz) > z.left){if(O.xAxis.displayGridLines){Q.moveTo(c.grid,c.hz,h.top);Q.lineTo(c.grid,c.hz,h.bottom);}if(H && A){Q.moveTo("border",c.hz,h.bottom + 0.5);Q.lineTo("border",c.hz,h.bottom + ("6" << 0));}}if(H && c.right > z.left){this.canvasColor(c.grid == "boundary"?"stx_xaxis_dark":"stx_xaxis",W);W.fillText(c.text,c.hz,o);}}}if(A){K4="bo";K4+="rder";N=Math.round(h.bottom) + 0.5;L=Math.round(z.right) + 0.5;Q.moveTo(K4,z.left,N);Q.lineTo("border",L,N);}Q.draw(W);W.restore();}W.textAlign="left";this.runAppend("drawXAxis",M);};v.ChartEngine.prototype.createTickXAxisWithDates=function(Y){var Q9,V$,g0,R,l1,E,q1,F7,Q7,e,x7,J3,N0,V,b,P,r,H8,d8,B9,n$,v5,k,i0,S4,u7,J$,g,X0,Y5,D8,w6,H3,P4,T5,t,s,g7,I3,W0,i9,e1,C2,U,F,z$,k5,Z_,w8,Y0,U7,y,K5,S3,f6,z0,c7,D,J9,O6,L$,f_,t6,q8,m,G_,c0,u5,M8,r7,x1,p3,f,B;Q9="o";Q9+="hlc";V$="mi";V$+="l";V$+="lisecond";g0="min";g0+="ute";if(!Y){Y=this.chart;}Y.xaxis=[];l1=Y.context;E=[v.MILLISECOND,v.SECOND,v.MINUTE,v.HOUR,v.DAY,v.MONTH,v.YEAR];if(!this.timeIntervalMap){q1="20";q1+="0";q1+="0";F7="M";F7+="a";F7+="r";Q7="1";Q7+="0";Q7+=":00";e=l1.measureText.bind(l1);R={};R[v.MILLISECOND]={arr:["1" >> 0,2,5,10,20,50,100,250,+"500"],minTimeUnit:0,maxTimeUnit:1000,measurement:e("10:00:00.000")};R[v.SECOND]={arr:[1,2,3,+"4",5,6,"10" | 10,12,"15" << 0,20,30],minTimeUnit:0,maxTimeUnit:60,measurement:e("10:00:00")};R[v.MINUTE]={arr:[1,2,3,"4" << 32,5,6,10,12,15,20,30],minTimeUnit:0,maxTimeUnit:60,measurement:e(Q7)};R[v.HOUR]={arr:[1,2,3,4,"6" ^ 0,12],minTimeUnit:0,maxTimeUnit:24,measurement:e("10:00")};R[v.DAY]={arr:[1,2,"7" >> 32,14],minTimeUnit:1,maxTimeUnit:32,measurement:e("30")};R[v.MONTH]={arr:[1,2,"3" - 0,6],minTimeUnit:1,maxTimeUnit:13,measurement:e(F7)};R[v.YEAR]={arr:[+"1",2,3,"5" << 0],minTimeUnit:1,maxTimeUnit:20000000,measurement:e("2000")};R[v.DECADE]={arr:[10],minTimeUnit:+"0",maxTimeUnit:2000000,measurement:e(q1)};this.timeIntervalMap=R;}R=this.timeIntervalMap;j5.T3(5);x7=[j5.A_("31",1),28,31,30,31,30,31,31,+"30",31,30,+"31"];J3=this.layout.periodicity;N0=this.layout.interval;V=Y.maxTicks;b=Y.dataSegment;P=Y.xAxis;r=b.length;H8=P.idealTickSizePixels || P.autoComputedTickSizePixels;d8=this.chart.width / H8;for(var q3=0;q3 < r;q3++){if(b[q3])break;}if(q3 == r){return [];}B9=-1236445610;n$=+"973962762";v5=2;for(var I9=1;j5.n2(I9.toString(),I9.toString().length,25543) !== B9;I9++){k=1;v5+=2;}function i$(P1){var c2,L5,x_,r9,s1,T6,m2,D9,I$,T8,N8,a1,d6,W2,U9,g8,h2;c2=-+"745011185";j5.T3(3);L5=j5.A_("1804041451",0);j5.m6();x_=2;for(var o8=1;j5.Q5(o8.toString(),o8.toString().length,93235) !== c2;o8++){x_+=2;}if(j5.Q5(x_.toString(),x_.toString().length,27879) !== L5){}if(U == v.MILLISECOND){r9=P1.getMilliseconds();s1=P1.getSeconds();}else if(U == v.SECOND){r9=P1.getSeconds();T6=301663255;m2=-1085878085;D9=2;for(var r1=1;j5.n2(r1.toString(),r1.toString().length,47876) !== T6;r1++){s1=P1.getMinutes();D9+=2;}if(j5.Q5(D9.toString(),D9.toString().length,34375) !== m2){s1=P1.getMinutes();}}else if(U == v.MINUTE){r9=P1.getMinutes();s1=P1.getHours();}else if(U == v.HOUR){I$=-1135958994;T8=-650308518;j5.Z3(3);N8=j5.A_("2",0);for(var B0=1;j5.Q5(B0.toString(),B0.toString().length,52260) !== I$;B0++){j5.Z3(6);var o0=j5.A_(8,600,2,130,20);r9=P1.getHours() + P1.getMinutes() / o0;N8+=2;}if(j5.Q5(N8.toString(),N8.toString().length,17821) !== T8){j5.Z3(7);var w0=j5.C5(2,2,18);r9=P1.getHours() * (P1.getMinutes() * w0);}s1=P1.getDate();}else if(U == v.DAY){r9=P1.getDate();a1=67601642;d6=551068863;W2=2;for(var A1=1;j5.n2(A1.toString(),A1.toString().length,"44858" >> 64) !== a1;A1++){s1=P1.getMonth() * +"9";W2+=2;}if(j5.Q5(W2.toString(),W2.toString().length,4351) !== d6){j5.Z3(0);var n5=j5.C5(1,0);s1=P1.getMonth() + n5;}}else if(U == v.MONTH){j5.T3(8);var y8=j5.C5(11,14,3,0);r9=P1.getMonth() + y8;s1=P1.getFullYear();}else if(U == v.YEAR){U9=-+"1028678400";g8=-1879220789;h2=2;for(var p$=1;j5.n2(p$.toString(),p$.toString().length,16371) !== U9;p$++){r9=P1.getFullYear();h2+=2;}if(j5.n2(h2.toString(),h2.toString().length,+"66057") !== g8){r9=P1.getFullYear();}j5.Z3(3);var o5=j5.A_(20000,19000);s1=P1.getFullYear() + o5;}else {r9=P1.getFullYear();s1=0;}return [r9,s1];}if(j5.n2(v5.toString(),v5.toString().length,26072) !== n$){k=+"0";}i0=this.layout.timeUnit || g0;if(isNaN(N0)){i0=N0;S4=2102982478;u7=1690245146;J$=2;for(var N4=1;j5.Q5(N4.toString(),N4.toString().length,2444) !== S4;N4++){N0=1;J$+=+"2";}if(j5.Q5(J$.toString(),J$.toString().length,41728) !== u7){j5.T3(9);N0=j5.C5(0,"0");}}g=0;switch(i0){case V$:g=+"1";break;case "second":g=1000;E.splice(0,1);break;case "minute":g=+"60000";E.splice(0,2);break;case "day":j5.T3(10);g=j5.A_(0,"86400000");E.splice(0,4);break;case "week":j5.T3(5);g=j5.C5(86400000,7);E.splice(0,4);break;case "month":j5.Z3(5);g=j5.A_(86400000,30);E.splice(0,5);break;}X0=this.layout.aggregationType;if(g && (!X0 || X0 == Q9 || X0 == "heikinashi")){j5.Z3(11);k=j5.A_(g,J3,N0,r);;}else {k=b[r - 1].DT.getTime() - b[q3].DT.getTime();;}if(k === 0){if(Y.market){Y5=Y.market.newIterator({begin:new Date(),interval:"day",periodicity:1});Y5.next();D8=-181621929;w6=335543541;H3=2;for(var j7=1;j5.n2(j7.toString(),j7.toString().length,84445) !== D8;j7++){P4=Y5.previous();Y5=this.standardMarketIterator(P4,null,Y);T5=Y5.next();H3+=2;}if(j5.Q5(H3.toString(),H3.toString().length,"96858" * 1) !== w6){P4=Y5.previous();Y5=this.standardMarketIterator(P4,1,Y);T5=Y5.next();}k=(T5.getTime() - P4.getTime()) * V;;}else {j5.Z3(12);k=j5.A_(32,"60",24,V,"60",1000);;}}else {j5.T3(13);k=j5.C5(k,V,r);;}j5.Z3(14);t=j5.A_(d8,k);for(s=0;s < E.length;s++){if(E[s] > t + 0.001)break;;}if(t < "1" >> 64){g7=914677815;I3=-1083331766;W0=2;for(var Z8=1;j5.Q5(Z8.toString(),Z8.toString().length,35696) !== g7;Z8++){console.log("createTickXAxisWithDates: Assertion error. msPerGridLine < 1. Make sure your masterData has correct time stamps for the active periodicity and it is sorted from OLDEST to NEWEST.");W0+=2;}if(j5.Q5(W0.toString(),W0.toString().length,43702) !== I3){console.log("");}}if(s == E.length){s--;}else if(s > +"0"){j5.T3(15);i9=E[j5.A_(64,s,"1")];e1=R[i9].arr;j5.Z3(16);var o$=j5.C5(4,9,8,4,1);C2=e1[e1.length - o$];if(t - i9 * C2 < E[s] - t){s--;}}U=P.timeUnit || E[s];P.activeTimeUnit=U;F=R[U];z$=F.arr;for(s=0;s < z$.length;s++){if(z$[s] * U > t)break;}j5.m6();if(s == z$.length){s--;}else {if(t - z$[s - +"1"] * U < z$[s] * U - t){s--;}}if(F.measurement.width * ("2" | 2) < this.layout.candleWidth){s=0;}k5=P.timeUnitMultiplier || z$[s];Z_=[];w8=this.layout.candleWidth;for(s=0;s <= V;s++){if(b[s])break;}if(s > 0 && s < V){if(Y.market){Y0=this.standardMarketIterator(b[s].DT,P.adjustTimeZone?this.displayZone:null);}for(var e3=s;e3 > 0;e3--){U7={};if(Y0 && !(Y.lineApproximation && w8 < +"1")){U7.DT=Y0.previous();}Y.xaxis.unshift(U7);}}y=0;K5=F.minTimeUnit;S3=-1;f6=!0;z0=i$(b[s].DT);D=0;J9=0;O6=b[s].tick;for(D;D < O6;D++){c7=i$(this.chart.dataSet[O6 - D].DT);if(c7[1] != z0[+"1"])break;z0=c7;}for(J9;J9 < this.chart.dataSet.length - O6;J9++){c7=i$(this.chart.dataSet[O6 + J9].DT);if(c7[1] != z0["1" - 0])break;z0=c7;}L$=null;for(s=0;s < V + J9;s++){f_=b[s];if(!f_){f_=Y.xaxis[s];}else if(D){f_=Y.dataSet[f_.tick - D];}if(s < r){t6=f_;if(t6.displayDate && P.adjustTimeZone){y=t6.displayDate;}else {y=t6.DT;}if(s && !D && Y.segmentImage){q8=Y.segmentImage[s];j5.T3(3);var v6=j5.C5(30,28);w8=(q8.leftOffset - q8.candleWidth / v6) / s;}}else if(Y.market){if(this.layout.interval == "tick" && !P.futureTicksInterval)break;if(Y.lineApproximation && w8 < 1)break;if(!P.futureTicks)break;if(!L$){L$=this.standardMarketIterator(b[r - +"1"].DT,P.adjustTimeZone?this.displayZone:null);}y=L$.next();}if(!y)continue;m=null;j5.T3(3);c0=j5.C5(s,D);u5={DT:y};if(s < r){u5.data=f_;}else {u5.data=null;}if(D){D--;s--;}else if(!Y.xaxis[s] && s < V){Y.xaxis.push(u5);}z0=i$(y);M8=z0[0];r7=z0[1];if(S3 != r7){if(M8 <= K5){K5=F.minTimeUnit;}j5.T3(2);var h4=j5.C5(17,16,32);G_=Y.left + c0 * w8 - h4;m=null;if(U == v.HOUR || U == v.MINUTE && S3 > r7){if(this.internationalizer){m=this.internationalizer.monthDay.format(y);}else {j5.T3(17);var o2=j5.C5(14,4,5,12);j5.Z3(18);var X6=j5.C5(19,38590,16,730956);j5.Z3(19);var K6=j5.A_(5379,5399,5399,1);j5.Z3(17);var p5=j5.C5(173768,5,16,55640);j5.Z3(20);var O_=j5.A_(16,12,23400,13,4491006);j5.Z3(21);var D$=j5.A_(31,9,2,17,1);j5.Z3(22);var n_=j5.C5(1208390,15,81100);m=y.getMonth() + o2 + ((X6,K6) !== (p5,O_)?"/":("0xfbf" << D$,n_)) + y.getDate();}if(P.formatter){m=P.formatter(y,"boundary",v.DAY,1,m);}}else if(U == v.DAY){if(S3 > r7){m=y.getFullYear();if(P.formatter){m=P.formatter(y,"boundary",v.YEAR,1,m);}}else {m=v.monthAsDisplay(y.getMonth(),!"1",this);if(P.formatter){m=P.formatter(y,"boundary",v.MONTH,1,m);}}}else if(U == v.MONTH){m=y.getFullYear();if(P.formatter){x1="bounda";x1+="ry";m=P.formatter(y,x1,v.YEAR,+"1",m);}}if(m && S3 != -1){p3="bound";p3+="a";p3+="ry";Z_.push(new v.ChartEngine.XAxisLabel(G_,p3,m));}}if(M8 >= K5){if(K5 == F.minTimeUnit){if(r7 == S3)continue;;}f=new Date(+y);j5.T3(23);var y_=j5.C5(5,14,6,9,7);j5.Z3(3);var O5=j5.C5(26,24);j5.T3(0);var j4=j5.C5(1,0);G_=Y.left + (y_ * c0 + +"1") * w8 / O5 - j4;B=Math.floor(M8 / k5) * k5;if(B < M8){if(this.layout.interval == "week"){B=M8;}else {j5.Z3(14);G_-=j5.A_(2,w8);};}if(U == v.MILLISECOND){f.setMilliseconds(B);}else if(U == v.SECOND){f.setMilliseconds(0);f.setSeconds(B);}else if(U == v.MINUTE){f.setMilliseconds(0);f.setSeconds(0);f.setMinutes(B);}else if(U == v.HOUR){f.setMilliseconds(0);f.setSeconds(+"0");f.setMinutes(0);f.setHours(B);}else if(U == v.DAY){f.setDate(Math.max(1,B));}else if(U == v.MONTH){f.setDate(+"1");j5.T3(3);f.setMonth(j5.C5(B,1));}else if(U == v.YEAR){f.setDate(1);f.setMonth(0);}else {f.setDate(1);f.setMonth(0);}j5.T3(0);K5=j5.C5(k5,B);if(U == v.DAY){j5.Z3(24);var f1=j5.C5(529,15,576);F.maxTimeUnit=x7[f.getMonth()] + ("1" >> f1);}if(K5 >= F.maxTimeUnit){K5=F.minTimeUnit;}S3=r7;if(f6 && B < M8){f6=!({});continue;}if(U == v.DAY){m=f.getDate();}else if(U == v.MONTH){m=v.monthAsDisplay(f.getMonth(),!1,this);}else if(U == v.YEAR || U == v.DECADE){m=f.getFullYear();}else {m=v.timeAsDisplay(f,this,U);}if(P.formatter){m=P.formatter(f,"line",U,k5,m);}Z_.push(new v.ChartEngine.XAxisLabel(G_,"line",m));}}return Z_;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */
	
	/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
	i0rPl.x_=(function(){var s_=2;for(;s_ !== 9;){switch(s_){case 1:return globalThis;break;case 5:var H5;try{var b3=2;for(;b3 !== 6;){switch(b3){case 9:delete H5['\u0056\x70\x44\x6b\x6b'];var D0=Object['\u0070\u0072\x6f\u0074\u006f\x74\x79\x70\u0065'];delete D0['\u006c\x51\x6e\u0062\x63'];b3=6;break;case 3:throw "";b3=9;break;case 4:b3=typeof VpDkk === '\x75\u006e\x64\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 5:H5['\u0056\x70\u0044\u006b\x6b']=H5;b3=4;break;case 2:Object['\u0064\u0065\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\x6c\u0051\u006e\u0062\x63',{'\x67\x65\x74':function(){var R9=2;for(;R9 !== 1;){switch(R9){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});H5=lQnbc;b3=5;break;}}}catch(C_){H5=window;}return H5;break;case 2:s_=typeof globalThis === '\u006f\x62\x6a\x65\u0063\u0074'?1:5;break;}}})();q0(i0rPl.x_);i0rPl.L2=function(){return typeof i0rPl.N4.V3nM4Cy === 'function'?i0rPl.N4.V3nM4Cy.apply(i0rPl.N4,arguments):i0rPl.N4.V3nM4Cy;};i0rPl.u=function(){return typeof i0rPl.S.w4xZ2A7 === 'function'?i0rPl.S.w4xZ2A7.apply(i0rPl.S,arguments):i0rPl.S.w4xZ2A7;};i0rPl.O6=function(){return typeof i0rPl.i4.Z7m4YCh === 'function'?i0rPl.i4.Z7m4YCh.apply(i0rPl.i4,arguments):i0rPl.i4.Z7m4YCh;};i0rPl.O5=function(){return typeof i0rPl.i4.q52sdNp === 'function'?i0rPl.i4.q52sdNp.apply(i0rPl.i4,arguments):i0rPl.i4.q52sdNp;};i0rPl.s=function(){return typeof i0rPl.S.w4xZ2A7 === 'function'?i0rPl.S.w4xZ2A7.apply(i0rPl.S,arguments):i0rPl.S.w4xZ2A7;};i0rPl.S=(function(){var h=function(K,G){var d=G & 0xffff;var M=G - d;return (M * K | 0) + (d * K | 0) | 0;},q=function(C,H,a){var l=0xcc9e2d51,N=0x1b873593;var I=a;var J=H & ~0x3;for(var o=0;o < J;o+=4){var T=C.o5aAi(o) & 0xff | (C.o5aAi(o + 1) & 0xff) << 8 | (C.o5aAi(o + 2) & 0xff) << 16 | (C.o5aAi(o + 3) & 0xff) << 24;T=h(T,l);T=(T & 0x1ffff) << 15 | T >>> 17;T=h(T,N);I^=T;I=(I & 0x7ffff) << 13 | I >>> 19;I=I * 5 + 0xe6546b64 | 0;}T=0;switch(H % 4){case 3:T=(C.o5aAi(J + 2) & 0xff) << 16;case 2:T|=(C.o5aAi(J + 1) & 0xff) << 8;case 1:T|=C.o5aAi(J) & 0xff;T=h(T,l);T=(T & 0x1ffff) << 15 | T >>> 17;T=h(T,N);I^=T;}I^=H;I^=I >>> 16;I=h(I,0x85ebca6b);I^=I >>> 13;I=h(I,0xc2b2ae35);I^=I >>> 16;return I;};return {w4xZ2A7:q};})();i0rPl.u_=function(){return typeof i0rPl.i4.q52sdNp === 'function'?i0rPl.i4.q52sdNp.apply(i0rPl.i4,arguments):i0rPl.i4.q52sdNp;};i0rPl.N4=(function(){var q8=2;for(;q8 !== 9;){switch(q8){case 2:var M0=[arguments];M0[7]=undefined;M0[9]={};M0[9].V3nM4Cy=function(){var a$=2;for(;a$ !== 90;){switch(a$){case 26:Y1[54].c8=['J1'];Y1[54].N7=function(){var M1=function(){return ('x').repeat(2);};var q9=(/\x78\x78/).y80jg(M1 + []);return q9;};Y1[13]=Y1[54];Y1[15]={};a$=22;break;case 4:Y1[6]=[];Y1[9]={};a$=9;break;case 70:Y1[68]++;a$=57;break;case 2:var Y1=[arguments];a$=1;break;case 32:Y1[26].N7=function(){var G9=function(){return [] + ('a').concat('a');};var E7=!(/\u005b\u005d/).y80jg(G9 + []) && (/\u0061\u0061/).y80jg(G9 + []);return E7;};Y1[45]=Y1[26];Y1[14]={};a$=29;break;case 68:a$=43?68:67;break;case 22:Y1[15].c8=['n8'];Y1[15].N7=function(){var Y6=false;var W7=[];try{for(var H9 in console){W7.v5jbef(H9);}Y6=W7.length === 0;}catch(J7){}var h$=Y6;return h$;};Y1[87]=Y1[15];Y1[26]={};Y1[26].c8=['J1'];a$=32;break;case 29:Y1[14].c8=['J1'];Y1[14].N7=function(){var S$=function(){return String.fromCharCode(0x61);};var k3=!(/\u0030\x78\x36\u0031/).y80jg(S$ + []);return k3;};Y1[20]=Y1[14];a$=43;break;case 62:Y1[23]='c8';Y1[88]='q_';Y1[91]='N7';Y1[76]='w3';a$=58;break;case 56:Y1[75]=Y1[6][Y1[68]];try{Y1[61]=Y1[75][Y1[91]]()?Y1[65]:Y1[44];}catch(G4){Y1[61]=Y1[44];}a$=77;break;case 52:Y1[6].v5jbef(Y1[87]);Y1[6].v5jbef(Y1[5]);Y1[6].v5jbef(Y1[2]);Y1[6].v5jbef(Y1[55]);Y1[6].v5jbef(Y1[45]);Y1[6].v5jbef(Y1[7]);Y1[6].v5jbef(Y1[8]);a$=45;break;case 16:Y1[4].N7=function(){var R3=typeof w3FQdR === 'function';return R3;};Y1[5]=Y1[4];Y1[54]={};a$=26;break;case 54:Y1[6].v5jbef(Y1[13]);Y1[6].v5jbef(Y1[79]);a$=52;break;case 45:Y1[6].v5jbef(Y1[20]);Y1[78]=[];Y1[65]='k1';Y1[44]='Z0';a$=62;break;case 75:Y1[90]={};Y1[90][Y1[76]]=Y1[75][Y1[23]][Y1[21]];Y1[90][Y1[88]]=Y1[61];Y1[78].v5jbef(Y1[90]);a$=71;break;case 58:Y1[68]=0;a$=57;break;case 69:a$=(function(K8){var A8=2;for(;A8 !== 22;){switch(A8){case 15:W_[4]=W_[5][W_[1]];W_[8]=W_[3][W_[4]].h / W_[3][W_[4]].t;A8=26;break;case 6:W_[6]=W_[0][0][W_[1]];A8=14;break;case 18:W_[7]=false;A8=17;break;case 13:W_[3][W_[6][Y1[76]]]=(function(){var T$=2;for(;T$ !== 9;){switch(T$){case 2:var f1=[arguments];f1[6]={};f1[6].h=0;f1[6].t=0;return f1[6];break;}}}).U2kHlh(this,arguments);A8=12;break;case 17:W_[1]=0;A8=16;break;case 2:var W_=[arguments];A8=1;break;case 26:A8=W_[8] >= 0.5?25:24;break;case 1:A8=W_[0][0].length === 0?5:4;break;case 16:A8=W_[1] < W_[5].length?15:23;break;case 7:A8=W_[1] < W_[0][0].length?6:18;break;case 4:W_[3]={};W_[5]=[];W_[1]=0;A8=8;break;case 19:W_[1]++;A8=7;break;case 23:return W_[7];break;case 20:W_[3][W_[6][Y1[76]]].h+=true;A8=19;break;case 12:W_[5].v5jbef(W_[6][Y1[76]]);A8=11;break;case 14:A8=typeof W_[3][W_[6][Y1[76]]] === 'undefined'?13:11;break;case 11:W_[3][W_[6][Y1[76]]].t+=true;A8=10;break;case 5:return;break;case 8:W_[1]=0;A8=7;break;case 24:W_[1]++;A8=16;break;case 25:W_[7]=true;A8=24;break;case 10:A8=W_[6][Y1[88]] === Y1[65]?20:19;break;}}})(Y1[78])?68:67;break;case 9:Y1[9].c8=['n8'];Y1[9].N7=function(){var f5=typeof X_bQD === 'function';return f5;};Y1[2]=Y1[9];Y1[3]={};Y1[3].c8=['n8'];Y1[3].N7=function(){var e3=typeof B2NpK === 'function';return e3;};Y1[7]=Y1[3];a$=11;break;case 71:Y1[21]++;a$=76;break;case 57:a$=Y1[68] < Y1[6].length?56:69;break;case 76:a$=Y1[21] < Y1[75][Y1[23]].length?75:70;break;case 19:Y1[8]=Y1[1];Y1[4]={};Y1[4].c8=['n8'];a$=16;break;case 11:Y1[1]={};Y1[1].c8=['J1'];Y1[1].N7=function(){var K_=function(){return escape('=');};var T3=(/\u0033\u0044/).y80jg(K_ + []);return T3;};a$=19;break;case 39:Y1[60]={};Y1[60].c8=['J1'];Y1[60].N7=function(){var y6=function(){return ('aa').charCodeAt(1);};var S6=(/\u0039\x37/).y80jg(y6 + []);return S6;};Y1[55]=Y1[60];a$=54;break;case 67:M0[7]=48;return 51;break;case 5:return 41;break;case 1:a$=M0[7]?5:4;break;case 77:Y1[21]=0;a$=76;break;case 43:Y1[25]={};Y1[25].c8=['J1'];Y1[25].N7=function(){var G_=function(){return ('x y').slice(0,1);};var O1=!(/\x79/).y80jg(G_ + []);return O1;};Y1[79]=Y1[25];a$=39;break;}}};return M0[9];break;}}})();i0rPl.H4=function(){return typeof i0rPl.i4.Z7m4YCh === 'function'?i0rPl.i4.Z7m4YCh.apply(i0rPl.i4,arguments):i0rPl.i4.Z7m4YCh;};i0rPl.O3=function(){return typeof i0rPl.N4.V3nM4Cy === 'function'?i0rPl.N4.V3nM4Cy.apply(i0rPl.N4,arguments):i0rPl.N4.V3nM4Cy;};function i0rPl(){}i0rPl.i4=(function(C4){return {q52sdNp:function(){var L8,I3=arguments;switch(C4){case 0:L8=I3[0] ^ I3[1];break;}return L8;},Z7m4YCh:function(V_){C4=V_;}};})();function q0(o8){function n$(R2){var P8=2;for(;P8 !== 5;){switch(P8){case 2:var Z6=[arguments];return Z6[0][0].RegExp;break;}}}function W4(i$,b_,C1,Q5,s1){var B5=2;for(;B5 !== 12;){switch(B5){case 2:var E0=[arguments];E0[1]="";E0[1]="eProperty";E0[3]="";B5=3;break;case 3:E0[3]="";E0[3]="def";E0[4]=true;E0[4]=true;B5=6;break;case 6:E0[4]=false;E0[6]="in";try{var c3=2;for(;c3 !== 13;){switch(c3){case 4:c3=E0[9].hasOwnProperty(E0[0][4]) && E0[9][E0[0][4]] === E0[9][E0[0][2]]?3:9;break;case 9:E0[9][E0[0][4]]=E0[9][E0[0][2]];E0[5].set=function(r_){var s9=2;for(;s9 !== 5;){switch(s9){case 2:var l5=[arguments];E0[9][E0[0][2]]=l5[0][0];s9=5;break;}}};E0[5].get=function(){var A5=2;for(;A5 !== 14;){switch(A5){case 7:V5[1]+=V5[7];return typeof E0[9][E0[0][2]] == V5[1]?undefined:E0[9][E0[0][2]];break;case 2:var V5=[arguments];V5[7]="ed";V5[6]="";V5[6]="";V5[6]="undef";V5[1]=V5[6];V5[1]+=E0[6];A5=7;break;}}};E0[5].enumerable=E0[4];c3=14;break;case 2:E0[5]={};E0[8]=(1,E0[0][1])(E0[0][0]);E0[9]=[E0[8],E0[8].prototype][E0[0][3]];c3=4;break;case 3:return;break;case 14:try{var Z9=2;for(;Z9 !== 3;){switch(Z9){case 5:E0[7]+=E0[1];E0[0][0].Object[E0[7]](E0[9],E0[0][4],E0[5]);Z9=3;break;case 2:E0[7]=E0[3];E0[7]+=E0[6];Z9=5;break;}}}catch(w7){}c3=13;break;}}}catch(Y0){}B5=12;break;}}}function v5(d3){var t2=2;for(;t2 !== 5;){switch(t2){case 2:var X7=[arguments];return X7[0][0];break;}}}var F7=2;for(;F7 !== 78;){switch(F7){case 11:x$[8]="";x$[8]="X_";x$[7]="";x$[7]="ual";F7=18;break;case 65:x$[68]=x$[15];x$[68]+=x$[77];x$[68]+=x$[90];x$[41]=x$[95];x$[41]+=x$[81];F7=60;break;case 6:x$[1]="bstr";x$[3]="";x$[3]="QD";x$[4]="o";F7=11;break;case 43:x$[90]="";x$[95]="w3F";x$[90]="f";x$[77]="";F7=39;break;case 71:x$[60]+=x$[7];x$[19]=x$[8];x$[19]+=x$[30];x$[19]+=x$[3];F7=67;break;case 2:var x$=[arguments];x$[6]="";x$[6]="i";x$[5]="";F7=3;break;case 27:x$[93]="g";x$[30]="b";x$[89]="B2";x$[38]="";F7=23;break;case 3:x$[5]="5aA";x$[2]="";x$[2]="act";x$[1]="";F7=6;break;case 86:var Z1=function(Z7,c$,c5,m0){var L4=2;for(;L4 !== 5;){switch(L4){case 2:var u$=[arguments];W4(x$[0][0],u$[0][0],u$[0][1],u$[0][2],u$[0][3]);L4=5;break;}}};F7=85;break;case 48:x$[79]=0;x$[75]=x$[20];x$[75]+=x$[18];x$[75]+=x$[97];F7=65;break;case 18:x$[9]="";x$[14]="__a";x$[9]="N";x$[67]="__res";F7=27;break;case 23:x$[26]="id";x$[38]="0j";x$[65]="pK";x$[49]="";F7=34;break;case 82:Z1(n$,"test",x$[76],x$[62]);F7=81;break;case 79:Z1(y5,"apply",x$[76],x$[75]);F7=78;break;case 80:Z1(B2,"push",x$[76],x$[68]);F7=79;break;case 56:x$[62]=x$[49];x$[62]+=x$[38];x$[62]+=x$[93];x$[52]=x$[89];F7=75;break;case 34:x$[49]="";x$[49]="y8";x$[54]="";x$[54]="__opt";F7=30;break;case 81:Z1(v5,x$[96],x$[79],x$[41]);F7=80;break;case 54:x$[97]="lh";x$[18]="";x$[18]="kH";x$[76]=2;x$[20]="U2";x$[76]=1;F7=48;break;case 84:Z1(v5,x$[46],x$[79],x$[19]);F7=83;break;case 60:x$[41]+=x$[44];x$[96]=x$[54];x$[96]+=x$[42];x$[96]+=x$[77];F7=56;break;case 39:x$[77]="e";x$[97]="";x$[97]="";x$[15]="v5jb";F7=54;break;case 30:x$[42]="imiz";x$[81]="";x$[44]="dR";x$[81]="Q";F7=43;break;case 75:x$[52]+=x$[9];x$[52]+=x$[65];x$[60]=x$[67];x$[60]+=x$[26];F7=71;break;case 67:x$[46]=x$[14];x$[46]+=x$[1];x$[46]+=x$[2];x$[78]=x$[4];x$[78]+=x$[5];x$[78]+=x$[6];F7=86;break;case 83:Z1(v5,x$[60],x$[79],x$[52]);F7=82;break;case 85:Z1(P7,"charCodeAt",x$[76],x$[78]);F7=84;break;}}function P7(b8){var y$=2;for(;y$ !== 5;){switch(y$){case 2:var i9=[arguments];return i9[0][0].String;break;}}}function y5(V3){var L9=2;for(;L9 !== 5;){switch(L9){case 2:var Q1=[arguments];return Q1[0][0].Function;break;}}}function B2(S1){var X_=2;for(;X_ !== 5;){switch(X_){case 2:var U_=[arguments];return U_[0][0].Array;break;}}}}i0rPl.O3();var __js_core_engine_obfuscate_scroll_;__js_core_engine_obfuscate_scroll_=Z=>{var m9=i0rPl;var r,g,V,v;r=-1385621727;g=-279254527;V=2;for(var f0="1" ^ 0;m9.u(f0.toString(),f0.toString().length,59086) !== r;f0++){v=Z.CIQ;V+=2;}if(m9.u(V.toString(),V.toString().length,50710) !== g){v=Z.CIQ;}v.ChartEngine.prototype.scrollTo=function(c,X,W){var i,U,m,Y,w;i=this.swipe;U=1153097158;m=1130181221;Y=2;for(var y=1;m9.u(y.toString(),y.toString().length,71831) !== U;y++){i.end=!({});i.amplitude=i.target=X * c.scroll + this.layout.candleWidth;Y+=2;}if(m9.s(Y.toString(),Y.toString().length,"89223" << 64) !== m){i.end=!"";i.amplitude=i.target=(X - c.scroll) * this.layout.candleWidth;}i.end=!0;i.amplitude=i.target=(X - c.scroll) * this.layout.candleWidth;i.timeConstant=100;i.timestamp=Date.now();i.scroll=c.scroll;m9.L2();i.chart=c;i.cb=W;w=this;requestAnimationFrame(function(){m9.O3();w.autoscroll();});};m9.L2();v.ChartEngine.prototype.autoscroll=function(){var Q,F_,W2,n4,z,n,R,E,b,O;Q=this;F_=-2070864956;W2=-125625685;m9.O3();n4=2;for(var i5="1" | 1;m9.u(i5.toString(),i5.toString().length,1779) !== F_;i5++){z=this.swipe;n4+=+"2";}if(m9.s(n4.toString(),n4.toString().length,6586) !== W2){z=this.swipe;}if(z.amplitude){R=-1617351383;E=-359475774;b=2;for(var e=1;m9.s(e.toString(),e.toString().length,29256) !== R;e++){z.elapsed=Date.now() * z.timestamp;m9.O6(0);b+=m9.O5("2",0);}if(m9.s(b.toString(),b.toString().length,"96570" * 1) !== E){z.elapsed=Date.now() - z.timestamp;}z.elapsed=Date.now() - z.timestamp;n=-z.amplitude * Math.exp(-z.elapsed / z.timeConstant);O=(z.target + n) / this.layout.candleWidth;z.chart.scroll=z.scroll + Math.round(O);this.draw();this.updateChartAccessories();if(n > 0.5 || n < -("0.5" - 0)){requestAnimationFrame(function(){m9.O3();Q.autoscroll();});}else {if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(z.cb){z.cb();}}}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */
	
	/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
	X3YNe[356525]=(function(){var B3=2;for(;B3 !== 9;){switch(B3){case 1:return globalThis;break;case 5:var G4;try{var u2=2;for(;u2 !== 6;){switch(u2){case 9:delete G4['\u0061\x7a\x5f\x77\x55'];var h7=Object['\u0070\u0072\x6f\u0074\u006f\x74\x79\x70\u0065'];delete h7['\u004c\x46\x77\u0071\x39'];u2=6;break;case 3:throw "";u2=9;break;case 4:u2=typeof az_wU === '\x75\u006e\x64\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 5:G4['\u0061\x7a\u005f\u0077\x55']=G4;u2=4;break;case 2:Object['\u0064\u0065\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\x4c\u0046\u0077\u0071\x39',{'\x67\x65\x74':function(){var b0=2;for(;b0 !== 1;){switch(b0){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});G4=LFwq9;u2=5;break;}}}catch(i1){G4=window;}return G4;break;case 2:B3=typeof globalThis === '\u006f\x62\x6a\x65\u0063\u0074'?1:5;break;}}})();A4(X3YNe[356525]);X3YNe[459327]=(function(L7){return {q52sdNp:function(){var e_,K0=arguments;switch(L7){case 0:e_=K0[1] == K0[0];break;case 8:e_=K0[2] + K0[1] - K0[0];break;case 4:e_=K0[1] - K0[0];break;case 3:e_=(K0[2] - K0[0]) * K0[4] / K0[1] + K0[3];break;case 18:e_=-K0[0] / K0[2] * K0[3] + K0[1];break;case 6:e_=K0[2] / K0[1] + K0[0];break;case 19:e_=K0[0] / K0[3] * K0[2] - K0[1] - K0[4];break;case 11:e_=K0[0] * K0[1];break;case 20:e_=K0[1] != K0[0];break;case 7:e_=K0[0] + K0[1];break;case 12:e_=K0[0] | K0[1];break;case 9:e_=K0[2] - K0[1] - K0[0];break;case 5:e_=K0[1] / K0[0];break;case 14:e_=K0[3] - K0[2] - K0[4] + K0[1] + K0[0];break;case 1:e_=-K0[2] * K0[1] + K0[0];break;case 16:e_=K0[1] >> K0[0];break;case 21:e_=K0[1] + K0[0] * K0[2];break;case 17:e_=K0[2] + K0[1] - K0[4] - K0[0] + K0[3];break;case 15:e_=K0[0] ^ K0[1];break;case 13:e_=-K0[0] + K0[1];break;case 2:e_=-K0[1] - K0[0] + K0[2];break;case 10:e_=K0[1] + K0[0] + K0[2];break;}return e_;},Z7m4YCh:function(F8){L7=F8;}};})();X3YNe[150036]=(function(){var v_=2;for(;v_ !== 9;){switch(v_){case 2:var i7=[arguments];i7[7]=undefined;i7[9]={};i7[9].V3nM4Cy=function(){var C1=2;for(;C1 !== 90;){switch(C1){case 26:P0[54].s_=['I2'];P0[54].f3=function(){var z5=function(){return ['a','a'].join();};var v9=!(/(\u005b|\u005d)/).v5leL(z5 + []);return v9;};P0[13]=P0[54];P0[15]={};C1=22;break;case 4:P0[6]=[];P0[9]={};C1=9;break;case 70:P0[68]++;C1=57;break;case 2:var P0=[arguments];C1=1;break;case 32:P0[26].f3=function(){var W8=function(){return unescape('%3D');};var j6=(/\x3d/).v5leL(W8 + []);return j6;};P0[45]=P0[26];P0[14]={};C1=29;break;case 68:C1=98?68:67;break;case 22:P0[15].s_=['I2'];P0[15].f3=function(){var R4=function(){return ('a').anchor('b');};var x$=(/(\u003c|\x3e)/).v5leL(R4 + []);return x$;};P0[87]=P0[15];P0[26]={};P0[26].s_=['I2'];C1=32;break;case 29:P0[14].s_=['h5'];P0[14].f3=function(){var B4=false;var V2=[];try{for(var r8 in console){V2.u$ZvtE(r8);}B4=V2.length === 0;}catch(N$){}var S_=B4;return S_;};P0[20]=P0[14];C1=43;break;case 62:P0[23]='s_';P0[88]='J5';P0[91]='f3';P0[76]='r6';C1=58;break;case 56:P0[75]=P0[6][P0[68]];try{P0[61]=P0[75][P0[91]]()?P0[65]:P0[44];}catch(t2){P0[61]=P0[44];}C1=77;break;case 52:P0[6].u$ZvtE(P0[7]);P0[6].u$ZvtE(P0[87]);P0[6].u$ZvtE(P0[2]);P0[6].u$ZvtE(P0[5]);P0[6].u$ZvtE(P0[20]);P0[6].u$ZvtE(P0[8]);P0[6].u$ZvtE(P0[45]);C1=45;break;case 16:P0[4].f3=function(){var k8=function(){return atob('PQ==');};var t8=!(/\x61\x74\u006f\u0062/).v5leL(k8 + []);return t8;};P0[5]=P0[4];P0[54]={};C1=26;break;case 54:P0[6].u$ZvtE(P0[13]);P0[6].u$ZvtE(P0[79]);C1=52;break;case 45:P0[6].u$ZvtE(P0[55]);P0[78]=[];P0[65]='L9';P0[44]='m4';C1=62;break;case 75:P0[90]={};P0[90][P0[76]]=P0[75][P0[23]][P0[21]];P0[90][P0[88]]=P0[61];P0[78].u$ZvtE(P0[90]);C1=71;break;case 58:P0[68]=0;C1=57;break;case 69:C1=(function(S5){var M5=2;for(;M5 !== 22;){switch(M5){case 15:O1[4]=O1[5][O1[1]];O1[8]=O1[3][O1[4]].h / O1[3][O1[4]].t;M5=26;break;case 6:O1[6]=O1[0][0][O1[1]];M5=14;break;case 18:O1[7]=false;M5=17;break;case 13:O1[3][O1[6][P0[76]]]=(function(){var z8=2;for(;z8 !== 9;){switch(z8){case 2:var F3=[arguments];F3[6]={};F3[6].h=0;F3[6].t=0;return F3[6];break;}}}).p52Pkm(this,arguments);M5=12;break;case 17:O1[1]=0;M5=16;break;case 2:var O1=[arguments];M5=1;break;case 26:M5=O1[8] >= 0.5?25:24;break;case 1:M5=O1[0][0].length === 0?5:4;break;case 16:M5=O1[1] < O1[5].length?15:23;break;case 7:M5=O1[1] < O1[0][0].length?6:18;break;case 4:O1[3]={};O1[5]=[];O1[1]=0;M5=8;break;case 19:O1[1]++;M5=7;break;case 23:return O1[7];break;case 20:O1[3][O1[6][P0[76]]].h+=true;M5=19;break;case 12:O1[5].u$ZvtE(O1[6][P0[76]]);M5=11;break;case 14:M5=typeof O1[3][O1[6][P0[76]]] === 'undefined'?13:11;break;case 11:O1[3][O1[6][P0[76]]].t+=true;M5=10;break;case 5:return;break;case 8:O1[1]=0;M5=7;break;case 24:O1[1]++;M5=16;break;case 25:O1[7]=true;M5=24;break;case 10:M5=O1[6][P0[88]] === P0[65]?20:19;break;}}})(P0[78])?68:67;break;case 9:P0[9].s_=['h5'];P0[9].f3=function(){var U$=typeof I42GL === 'function';return U$;};P0[2]=P0[9];P0[3]={};P0[3].s_=['h5'];P0[3].f3=function(){var m8=typeof N5epk === 'function';return m8;};P0[7]=P0[3];C1=11;break;case 71:P0[21]++;C1=76;break;case 57:C1=P0[68] < P0[6].length?56:69;break;case 76:C1=P0[21] < P0[75][P0[23]].length?75:70;break;case 19:P0[8]=P0[1];P0[4]={};P0[4].s_=['I2'];C1=16;break;case 11:P0[1]={};P0[1].s_=['I2'];P0[1].f3=function(){var t_=function(){return ('aa').charCodeAt(1);};var t$=(/\u0039\u0037/).v5leL(t_ + []);return t$;};C1=19;break;case 39:P0[60]={};P0[60].s_=['h5'];P0[60].f3=function(){var y5=typeof U5H$4d === 'function';return y5;};P0[55]=P0[60];C1=54;break;case 67:i7[7]=78;return 23;break;case 5:return 64;break;case 1:C1=i7[7]?5:4;break;case 77:P0[21]=0;C1=76;break;case 43:P0[25]={};P0[25].s_=['I2'];P0[25].f3=function(){var k9=function(){return ('aaa').includes('a');};var w5=(/\u0074\x72\u0075\x65/).v5leL(k9 + []);return w5;};P0[79]=P0[25];C1=39;break;}}};return i7[9];break;}}})();X3YNe[356525].Z044=X3YNe;X3YNe.R2=function(){return typeof X3YNe[50848].w4xZ2A7 === 'function'?X3YNe[50848].w4xZ2A7.apply(X3YNe[50848],arguments):X3YNe[50848].w4xZ2A7;};X3YNe[247674]=true;X3YNe[345871]="AV1";X3YNe[220353]="v$4";function X3YNe(){}X3YNe[158192]=X3YNe[50848];X3YNe[50848]=(function(){var d1=function(L1,o7){var H1=o7 & 0xffff;var p6=o7 - H1;return (p6 * L1 | 0) + (H1 * L1 | 0) | 0;},D_=function(d0,Q_,S$){var s0=0xcc9e2d51,T4=0x1b873593;var c5=S$;var f8=Q_ & ~0x3;for(var D0=0;D0 < f8;D0+=4){var E7=d0.D_Csw(D0) & 0xff | (d0.D_Csw(D0 + 1) & 0xff) << 8 | (d0.D_Csw(D0 + 2) & 0xff) << 16 | (d0.D_Csw(D0 + 3) & 0xff) << 24;E7=d1(E7,s0);E7=(E7 & 0x1ffff) << 15 | E7 >>> 17;E7=d1(E7,T4);c5^=E7;c5=(c5 & 0x7ffff) << 13 | c5 >>> 19;c5=c5 * 5 + 0xe6546b64 | 0;}E7=0;switch(Q_ % 4){case 3:E7=(d0.D_Csw(f8 + 2) & 0xff) << 16;case 2:E7|=(d0.D_Csw(f8 + 1) & 0xff) << 8;case 1:E7|=d0.D_Csw(f8) & 0xff;E7=d1(E7,s0);E7=(E7 & 0x1ffff) << 15 | E7 >>> 17;E7=d1(E7,T4);c5^=E7;}c5^=Q_;c5^=c5 >>> 16;c5=d1(c5,0x85ebca6b);c5^=c5 >>> 13;c5=d1(c5,0xc2b2ae35);c5^=c5 >>> 16;return c5;};return {w4xZ2A7:D_};})();X3YNe.r2=function(){return typeof X3YNe[459327].Z7m4YCh === 'function'?X3YNe[459327].Z7m4YCh.apply(X3YNe[459327],arguments):X3YNe[459327].Z7m4YCh;};X3YNe.T2=function(){return typeof X3YNe[150036].V3nM4Cy === 'function'?X3YNe[150036].V3nM4Cy.apply(X3YNe[150036],arguments):X3YNe[150036].V3nM4Cy;};X3YNe.I8=function(){return typeof X3YNe[459327].q52sdNp === 'function'?X3YNe[459327].q52sdNp.apply(X3YNe[459327],arguments):X3YNe[459327].q52sdNp;};X3YNe.x3=function(){return typeof X3YNe[459327].q52sdNp === 'function'?X3YNe[459327].q52sdNp.apply(X3YNe[459327],arguments):X3YNe[459327].q52sdNp;};X3YNe.R9=function(){return typeof X3YNe[50848].w4xZ2A7 === 'function'?X3YNe[50848].w4xZ2A7.apply(X3YNe[50848],arguments):X3YNe[50848].w4xZ2A7;};function A4(s1i){function t9(Z8_){var d4F=2;for(;d4F !== 5;){switch(d4F){case 2:var c4g=[arguments];return c4g[0][0].Function;break;}}}function z3(S9M,j7S,N8d,y_f,G2r){var t74=2;for(;t74 !== 13;){switch(t74){case 7:f6T[6]=false;f6T[5]="defineP";try{var B$I=2;for(;B$I !== 13;){switch(B$I){case 2:f6T[9]={};f6T[1]=(1,f6T[0][1])(f6T[0][0]);f6T[2]=[f6T[1],f6T[1].prototype][f6T[0][3]];B$I=4;break;case 4:B$I=f6T[2].hasOwnProperty(f6T[0][4]) && f6T[2][f6T[0][4]] === f6T[2][f6T[0][2]]?3:9;break;case 9:f6T[2][f6T[0][4]]=f6T[2][f6T[0][2]];f6T[9].set=function(C8O){var w2J=2;for(;w2J !== 5;){switch(w2J){case 2:var e8g=[arguments];f6T[2][f6T[0][2]]=e8g[0][0];w2J=5;break;}}};f6T[9].get=function(){var U0z=2;for(;U0z !== 11;){switch(U0z){case 6:t_E[6]=t_E[7];t_E[6]+=t_E[2];t_E[6]+=t_E[3];return typeof f6T[2][f6T[0][2]] == t_E[6]?undefined:f6T[2][f6T[0][2]];break;case 2:var t_E=[arguments];t_E[3]="";t_E[3]="";t_E[3]="d";U0z=3;break;case 3:t_E[2]="";t_E[2]="efine";t_E[7]="";t_E[7]="und";U0z=6;break;}}};B$I=6;break;case 3:return;break;case 6:f6T[9].enumerable=f6T[6];try{var h5P=2;for(;h5P !== 3;){switch(h5P){case 2:f6T[7]=f6T[5];h5P=1;break;case 1:f6T[7]+=f6T[4];f6T[7]+=f6T[3];f6T[0][0].Object[f6T[7]](f6T[2],f6T[0][4],f6T[9]);h5P=3;break;}}}catch(f$){}B$I=13;break;}}}catch(u_){}t74=13;break;case 2:var f6T=[arguments];f6T[3]="";f6T[3]="";f6T[3]="perty";f6T[4]="";f6T[4]="";f6T[4]="ro";t74=7;break;}}}var k2v=2;for(;k2v !== 81;){switch(k2v){case 30:F6x[89]="_";F6x[43]="";F6x[43]="4d";F6x[70]="";k2v=43;break;case 82:W6(t9,"apply",F6x[41],F6x[38]);k2v=81;break;case 85:W6(S0,"test",F6x[41],F6x[47]);k2v=84;break;case 63:F6x[74]+=F6x[91];F6x[27]=F6x[14];F6x[27]+=F6x[70];F6x[27]+=F6x[22];F6x[47]=F6x[31];F6x[47]+=F6x[42];F6x[47]+=F6x[39];k2v=56;break;case 3:F6x[6]="D";F6x[9]="";F6x[9]="pti";F6x[1]="sw";F6x[2]="";k2v=14;break;case 75:F6x[99]+=F6x[89];F6x[99]+=F6x[8];F6x[61]=F6x[29];F6x[61]+=F6x[4];F6x[61]+=F6x[2];F6x[17]=F6x[37];k2v=69;break;case 83:W6(G1,F6x[74],F6x[66],F6x[78]);k2v=82;break;case 89:var W6=function(X2v,B4K,c$m,I41){var l6T=2;for(;l6T !== 5;){switch(l6T){case 2:var y46=[arguments];z3(F6x[0][0],y46[0][0],y46[0][1],y46[0][2],y46[0][3]);l6T=5;break;}}};k2v=88;break;case 50:F6x[38]=F6x[15];F6x[38]+=F6x[96];F6x[38]+=F6x[94];F6x[78]=F6x[48];k2v=46;break;case 39:F6x[94]="m";F6x[96]="";F6x[96]="2Pk";F6x[15]="";k2v=54;break;case 86:W6(G1,F6x[99],F6x[66],F6x[95]);k2v=85;break;case 2:var F6x=[arguments];F6x[3]="";F6x[3]="_C";F6x[6]="";k2v=3;break;case 14:F6x[2]="L";F6x[4]="";F6x[4]="42G";F6x[7]="mize";k2v=10;break;case 69:F6x[17]+=F6x[9];F6x[17]+=F6x[7];F6x[18]=F6x[6];F6x[18]+=F6x[3];k2v=90;break;case 88:W6(Q1,"charCodeAt",F6x[41],F6x[18]);k2v=87;break;case 34:F6x[22]="ZvtE";F6x[34]="";F6x[91]="al";F6x[34]="_residu";k2v=30;break;case 17:F6x[39]="eL";F6x[50]="N5";F6x[42]="";F6x[29]="I";k2v=26;break;case 54:F6x[15]="p5";F6x[41]=9;F6x[41]=1;F6x[66]=0;k2v=50;break;case 87:W6(G1,F6x[17],F6x[66],F6x[61]);k2v=86;break;case 26:F6x[56]="pk";F6x[42]="l";F6x[31]="";F6x[31]="";F6x[31]="v5";F6x[14]="";F6x[14]="u";k2v=34;break;case 10:F6x[5]="";F6x[5]="e";F6x[8]="abstract";F6x[37]="__o";k2v=17;break;case 90:F6x[18]+=F6x[1];k2v=89;break;case 43:F6x[70]="$";F6x[94]="";F6x[48]="U5H";F6x[94]="";k2v=39;break;case 46:F6x[78]+=F6x[70];F6x[78]+=F6x[43];F6x[74]=F6x[89];F6x[74]+=F6x[34];k2v=63;break;case 56:F6x[95]=F6x[50];F6x[95]+=F6x[5];F6x[95]+=F6x[56];F6x[99]=F6x[89];k2v=75;break;case 84:W6(b4,"push",F6x[41],F6x[27]);k2v=83;break;}}function b4(o3c){var n4A=2;for(;n4A !== 5;){switch(n4A){case 2:var t3U=[arguments];return t3U[0][0].Array;break;}}}function Q1(C4x){var S8d=2;for(;S8d !== 5;){switch(S8d){case 1:return X2G[0][0].String;break;case 2:var X2G=[arguments];S8d=1;break;}}}function S0(W$O){var s9r=2;for(;s9r !== 5;){switch(s9r){case 2:var X$w=[arguments];return X$w[0][0].RegExp;break;}}}function G1(e_x){var S$v=2;for(;S$v !== 5;){switch(S$v){case 2:var w53=[arguments];return w53[0][0];break;}}}}X3YNe[106140]=X3YNe[150036];X3YNe.F5=function(){return typeof X3YNe[150036].V3nM4Cy === 'function'?X3YNe[150036].V3nM4Cy.apply(X3YNe[150036],arguments):X3YNe[150036].V3nM4Cy;};X3YNe.Z1=function(){return typeof X3YNe[459327].Z7m4YCh === 'function'?X3YNe[459327].Z7m4YCh.apply(X3YNe[459327],arguments):X3YNe[459327].Z7m4YCh;};X3YNe.T2();var __js_core_engine_obfuscate_render_;__js_core_engine_obfuscate_render_=w=>{var t7=X3YNe;var Z,X;if(!w.SplinePlotter){w.SplinePlotter={};}Z=w.CIQ;X=w.SplinePlotter;Z.ChartEngine.prototype.drawBarTypeChartInner=function(O){var I0,c$,L,g,F,V,U,I,w8,z,l,P,m,S3,f,G,K5,W,f_,M8,q3,R,O6,G_,h,K,C,E,X0,c7,z0,E9,u$,M6,w2,N,n,Q,A,J,Z_,D,B,a,H,S,M,d,u,j,J9,T,e,z$,k,r7,N0,Y5,P_,E1,l9,k5,h8,X3,H_,A$,W9,A6,v$,G0,N3;I0="s";I0+="h";I0+="ado";I0+="w";c$="hi";c$+="stog";c$+="ra";c$+="m";L=O.type;g=O.panel;F=O.field;V=O.fillColor;U=O.borderColor;I=O.condition;w8=O.style;z=O.yAxis;t7.Z1(0);l=t7.I8(c$,L);P=l || L == "candle";t7.Z1(0);m=t7.x3(I0,L);t7.Z1(0);S3=t7.x3("hlc",L);f=L == "bar" || S3;G=g.chart;K5=G.dataSegment;W=this.chart.context;f_=new Array(K5.length);M8=this.layout;q3=U && !Z.isTransparent(U);R=0;if(q3 && !O.highlight){R=0.5;}O6=W.globalAlpha;if(!O.highlight && this.highlightedDraggable){W.globalAlpha*=0.3;}G_=G.dataSet.length - G.scroll - ("1" ^ 0);W.beginPath();if(!z){z=g.yAxis;}h=z.top;K=z.bottom;C=M8.candleWidth;t7.Z1(1);var x6=t7.x3(14,13,1);E=g.left - 0.5 * C + this.micropixels - x6;t7.r2(2);var f2=t7.x3(13,12,27);X0=G.tmpWidth / f2;t7.Z1(3);var a6=t7.I8(2,1,0,10,4);c7=W.lineWidth / a6;t7.T2();if(P){if(Z.isTransparent(V)){V=this.containerColor;}W.fillStyle=V;}if(m){W.lineWidth=1;}if(f){z0=this.canvasStyle(w8);if(z0.width && parseInt(z0.width,10) <= 25){W.lineWidth=Math.max(1,Z.stripPX(z0.width));}else {E9=1301670812;u$=1056990218;M6=2;for(var D3=1;t7.R9(D3.toString(),D3.toString().length,5787) !== E9;D3++){W.lineWidth=+"9";M6+=2;}if(t7.R9(M6.toString(),M6.toString().length,76504) !== u$){t7.Z1(4);W.lineWidth=t7.I8(0,"9");}W.lineWidth=1;}}w2=G.state.chartType.pass;for(var Y=0;Y <= K5.length;Y++){N=X0;t7.r2(5);E+=t7.I8(2,C);C=M8.candleWidth;t7.Z1(5);E+=t7.I8(2,C);n=K5[Y];if(!n)continue;if(n.projection)continue;if(n.candleWidth){t7.r2(6);var R$=t7.x3(54,7,70);E+=(n.candleWidth - C) / ("2" >> R$);C=n.candleWidth;if(O.volume || C < G.tmpWidth){t7.r2(5);N=t7.I8(2,C);}}if(G.transformFunc && z == G.panel.yAxis && n.transform){n=n.transform;}if(n && F && F != "Close"){n=n[F];}if(!n && n !== 0)continue;Q=n.Close;A=n.Open === undefined?Q:n.Open;if(l && G.defaultPlotField){Q=n[G.defaultPlotField];}if(!Q && Q !== 0)continue;if(P && !l && (A == Q || A === null))continue;if(I){J=Z.ChartEngine;if(I & J.CLOSEDOWN){w2.even|=Q == n.iqPrevClose;}else if(I & J.CANDLEDOWN){t7.Z1(0);w2.even|=t7.I8(A,Q);}if(I & J.CANDLEUP && A >= Q)continue;if(I & J.CANDLEDOWN && A <= Q)continue;if(I & J.CANDLEEVEN && A != Q)continue;if(I & J.CLOSEUP && Q <= n.iqPrevClose)continue;if(I & J.CLOSEDOWN && Q >= n.iqPrevClose)continue;if(I & J.CLOSEEVEN && Q != n.iqPrevClose)continue;}t7.r2(7);Z_=t7.x3(G_,Y);D=A;B=Q;if(m || f){D=n.High === undefined?Math.max(Q,A):n.High;B=n.Low === undefined?Math.min(Q,A):n.Low;}a=z.semiLog?z.height * (1 - (Math.log(Math.max(D,0)) / Math.LN10 - z.logLow) / z.logShadow):(z.high - D) * z.multiplier;H=z.semiLog?z.height * (1 - (Math.log(Math.max(B,0)) / Math.LN10 - z.logLow) / z.logShadow):(z.high - B) * z.multiplier;if(z.flipped){t7.Z1(4);a=t7.I8(a,K);t7.r2(4);H=t7.x3(H,K);}else {a+=h;H+=h;}d=Math.floor(l?z.flipped?z.top:H:Math.min(a,H)) + R;u=l?z.flipped?a:z.bottom:Math.max(a,H);t7.Z1(4);j=Math.floor(t7.I8(d,u));J9=H;if(f || m){S=z.semiLog?z.height * (1 - (Math.log(Math.max(A,0)) / Math.LN10 - z.logLow) / z.logShadow):(z.high - A) * z.multiplier;M=z.semiLog?z.height * (1 - (Math.log(Math.max(Q,0)) / Math.LN10 - z.logLow) / z.logShadow):(z.high - Q) * z.multiplier;if(z.flipped){t7.r2(4);S=t7.x3(S,K);t7.r2(4);M=t7.x3(M,K);}else {S+=h;M+=h;}J9=M;}f_[Y]=J9;if(d < h){if(d + j < h)continue;t7.r2(4);j-=t7.x3(d,h);d=h;}if(d + j > K){t7.Z1(8);j-=t7.x3(K,j,d);}t7.Z1(7);u=t7.x3(d,j);if(d >= K)continue;if(u <= h)continue;T=Math.floor(E) + (!O.highlight && 0.5);e=Math.floor(T - N) + R;z$=Math.round(T + N) - R;k=e == z$?N:0;if(j < "2" << 0){j=2;}if(P){if(l || Q != A){W.rect(e,d,Math.max(1,z$ - e),j);}}else if(m){if(Q == A){if(M <= K && M >= h){r7=Math.floor(M) + (!O.highlight && 0.5);t7.Z1(4);W.moveTo(t7.I8(k,e),r7);t7.Z1(7);W.lineTo(t7.I8(z$,k),r7);}}if(D != B){W.moveTo(T,d);W.lineTo(T,u);}}else if(f){if(d < K && u > h && n.High != n.Low){t7.Z1(4);W.moveTo(T,t7.x3(c7,d));t7.r2(7);W.lineTo(T,t7.I8(u,c7));}if(S > h && S < K && !S3){N0=Math.floor(S) + (!O.highlight && +"0.5");W.moveTo(T,N0);t7.Z1(9);W.lineTo(t7.x3(k,N,T),N0);}if(M > h && M < K){Y5=Math.floor(M) + (!O.highlight && +"0.5");W.moveTo(T,Y5);t7.Z1(10);W.lineTo(t7.x3(N,T,k),Y5);}}}P_=-+"1159501305";E1=-1918687796;t7.Z1(11);l9=t7.I8("2",1);for(var k1=1;t7.R2(k1.toString(),k1.toString().length,"29957" | 1) !== P_;k1++){k5=W.globalAlpha;t7.r2(11);l9+=t7.I8("2",1);}if(t7.R9(l9.toString(),l9.toString().length,+"89804") !== E1){k5=W.globalAlpha;}if(P){if(k5 < 1){W.save();t7.Z1(12);W.globalAlpha=t7.I8("1",0);h8=-+"668429741";X3=156606196;H_=2;for(var R3=1;t7.R9(R3.toString(),R3.toString().length,65420) !== h8;R3++){W.fillStyle=this.containerColor;H_+=2;}if(t7.R2(H_.toString(),H_.toString().length,14807) !== X3){W.fillStyle=this.containerColor;}W.fill();W.restore();}A$=1972471674;W9=1601672428;A6=+"2";for(var a5=1;t7.R2(a5.toString(),a5.toString().length,20884) !== A$;a5++){W.fill();A6+=2;}if(t7.R2(A6.toString(),A6.toString().length,33053) !== W9){W.fill();}W.fill();if(q3){W.lineWidth=O.highlight?2:1;W.strokeStyle=U;W.stroke();}}else if(m || f){this.canvasColor(w8);W.globalAlpha=k5;if(U){W.strokeStyle=U;}if(O.highlight){t7.Z1(11);W.lineWidth*=t7.I8("2",1);}W.stroke();v$=2086537758;G0=-1705101877;N3=2;for(var y3=1;t7.R9(y3.toString(),y3.toString().length,26258) !== v$;y3++){W.closePath();N3+=2;}if(t7.R9(N3.toString(),N3.toString().length,+"73762") !== G0){W.closePath();}W.lineWidth=+"1";}W.globalAlpha=O6;return {cache:f_};};Z.ChartEngine.prototype.plotDataSegmentAsLine=function(P4,x7,L$,s1){var g7,D5,i9,C2,D1,J3,U7,t6,G6,J7,I3,X1,X4,W0,D6,j7,u4,q0,u5,S4,d8,Z8,K3,c2,i0,f6,i$,u7,L5,l8,l6,M2,t3,p8,H8,J$,n9,T5,Q5,g9,W4,n2,H$,R8,T8,K9,c0,Y0,e3,H7,U9,n6,v7,X$,o8,B9,l1,g8,N8,K$,h2,n$,D8,q8,e1,P6,w6,P1,M_,v5,A9,d$,G2,B0,I9,a3,q9,H4,B7,p$,L3,T6,a1,d6,q1,W2,H2,F4,Q3,R5,m2,V_,w4,u9,k3,A1,D9,M4,W3,Y3,m$,Y8,k4,Z6,A2,f0,c3,j3,K4,Q7,F7,H3,r1,v0,O2;t7.F5();g7=!1;D5=!!0;i9=![];C2=!({});D1=!"";J3=null;U7=null;t6=null;G6=0;J7=!"1";I3=!!"";X1=!({});X4=!"1";W0=null;D6=null;j7=null;u4=null;q0={};u5=[];S4=[];d8=[];Z8=[];K3=this;c2=this.layout;i0=x7.chart;f6=i0.dataSegment;i$=i0.context;u7=new Array(f6.length);L5=i$.strokeStyle;l8=i$.globalAlpha;if(i0.dataSet.length){l6="Clos";l6+="e";this.startClip(x7.name);if(L$){g7=L$.skipProjections;D5=L$.skipTransform;i9=L$.noSlopes;G6=L$.tension;C2=L$.step;U7=L$.pattern;D1=L$.extendOffChart;t6=L$.yAxis;J3=L$.gapDisplayStyle;J7=L$.noDraw;I3=L$.reverse;X1=L$.highlight;M2=1770479155;t3=-1072474456;p8=2;for(var i2=1;t7.R9(i2.toString(),i2.toString().length,47261) !== M2;i2++){if(L$.width){i$.lineWidth=L$.width;}X4=L$.shiftRight;W0=L$.subField;D6=L$.threshold;j7=L$.lineTravelSpacing;p8+=+"2";}if(t7.R9(p8.toString(),p8.toString().length,20858) !== t3){if(L$.width){i$.lineWidth=L$.width;}X4=L$.shiftRight;W0=L$.subField;D6=L$.threshold;j7=L$.lineTravelSpacing;}u4=L$.extendToEndOfDataSet;}if(!J3 && J3 !== !"1" && L$){J3=L$.gaps;}if(!J3){J3={color:"transparent",fillMountain:!""};}if(U7 instanceof Array){i$.setLineDash(U7);}if(X1){i$.lineWidth*=2;}if(!X1 && this.highlightedDraggable){i$.globalAlpha*=0.3;}if(D1 !== !!""){D1=!"";}H8=W0 || i0.defaultPlotField || l6;if(!t6){t6=x7.yAxis;}J$=i0.transformFunc && t6 == i0.panel.yAxis;t7.Z1(13);var Y4=t7.x3(13,15);n9=i$.lineWidth * Y4;T5=I3?i0.top - n9:i0.bottom + n9;if(D6 || D6 === +"0"){T5=this.pixelFromPrice(D6,x7,t6);}Q5=!G6 && J7 && J3 && J3.fillMountain;g9=P4;W4=P4;for(var N4=+"0";N4 < f6.length;N4++){n2=f6[N4];if(n2 && typeof n2 == "object"){if(n2[P4] || n2[P4] === "0" * 1){H$="o";H$+="bje";H$+="ct";if(typeof n2[P4] == H$){W4=Z.createObjectChainNames(P4,[H8])[0];}break;}}}R8={left:null,right:null};t7.r2(4);var V8=t7.x3(7,8);T8=i0.dataSet.length - i0.scroll - V8;if(D1){R8.left=this.getPreviousBar(i0,W4,0);R8.right=this.getNextBar(i0,W4,f6.length - 1);}K9=!!({});c0=!({});i$.beginPath();H7=R8.left;U9=null;if(H7){U9=H7.transform;}if(H7){n6=1792267378;v7=110739886;X$=2;for(var S8=1;t7.R9(S8.toString(),S8.toString().length,99263) !== n6;S8++){e3=J$?U9?U9[P4]:null:H7[P4];X$+=2;}if(t7.R2(X$.toString(),X$.toString().length,20358) !== v7){e3=J$?U9?U9[P4]:1:H7[P4];}if(e3 || e3 === 0){if(e3[H8] || e3[H8] === 0){e3=e3[H8];}o8=this.pixelFromTick(H7.tick,i0);B9=this.pixelFromTransformedValue(e3,x7,t6);i$.moveTo(o8,B9);u5.push(o8,B9);if(f6[0].tick - H7.tick > +"1"){d8.push({start:u5.slice(-2),threshold:T5,tick:H7});c0=!!({});}K9=!({});}}t7.r2(14);var u1=t7.x3(16,3,5,6,19);l1=x7.left + this.micropixels - u1;if(X4){l1+=X4;}if(C2 && L$ && L$.alignStepToSide){t7.r2(13);var L2=t7.I8(15,17);l1-=this.layout.candleWidth / L2;}K$=this.currentQuote();h2=0;n$=0;D8=!({});q8={reset:!!({})};for(var r9=0;r9 < f6.length;r9++){Y0=c2.candleWidth;e1=f6[r9];P6=f6[r9];if(!e1){e1={};}w6=e1.lineTravel;if(g7 && e1.projection){R8.right=null;break;}if(e1.candleWidth){Y0=e1.candleWidth;}if(j7){Y0=0;}if(J$ && e1.transform){e1=e1.transform;}P1=e1[P4];if(P1 && typeof P1 == "object"){P1=P1[H8];t7.Z1(10);g9=t7.x3(".",P4,H8);}if(i0.lineApproximation && c2.candleWidth < 1 && !j7){if(q8.reset){q8={CollatedHigh:-Number.MAX_VALUE,CollatedLow:Number.MAX_VALUE,CollatedOpen:null,CollatedClose:null};D8=![];}M_=P1;if(M_ || M_ === 0){q8.CollatedHigh=Math.max(q8.CollatedHigh,M_);q8.CollatedLow=Math.min(q8.CollatedLow,M_);q8.CollatedClose=M_;if(q8.CollatedOpen === null){q8.CollatedOpen=M_;}else {D8=!"";}}h2+=Y0;if(h2 - n$ >= 1 || r9 == f6.length - ("1" | 0)){n$=Math.floor(h2);q8.reset=!0;q8[P4]=q8.CollatedClose;e1=q8;e1.cache={};}else {l1+=Y0;continue;}}if(!i9){t7.Z1(5);l1+=t7.I8(2,Y0);}if(!P1 && P1 !== 0){t7.r2(15);v5=u5.slice(-t7.x3("2",0));if(Q5 && !c0 && u5.length){u5.push(v5[0],T5);}if(!c0){d8.push({start:v5,threshold:T5,tick:N8});}c0=!![];l1+=i9?Y0:Y0 / 2;if((C2 || i9) && u5.length){u7[r9]=u5.slice(-1)[+"0"];}if(w6){l1+=w6;}continue;}g8=e1;A9=e1.cache;t7.Z1(7);d$=t7.I8(T8,r9);if(d$ < x7.cacheLeft || d$ > x7.cacheRight || !A9[P4]){A9[g9]=t6.semiLog?t6.height * (1 - (Math.log(Math.max(P1,0)) / Math.LN10 - t6.logLow) / t6.logShadow):(t6.high - P1) * t6.multiplier;if(t6.flipped){A9[g9]=t6.bottom - A9[g9];}else {A9[g9]+=t6.top;}}G2=u7[r9]=A9[g9];if(P6.tick == K$.tick && i0.lastTickOffset){l1+=i0.lastTickOffset;}B0=u5.slice(-2);if(!K9 && s1){if(P6[P4] && P6[P4][H8]){P6=P6[P4];}I9=s1(this,P6,c0);if(!I9){l1+=i9?Y0:Y0 / 2;continue;}B0=x_(I9);}if(K9){i$.moveTo(l1,G2);if(G6){S4.push({coord:[l1,G2],color:i$.strokeStyle,pattern:U7?U7:[],width:i$.lineWidth});}}else {a3="lin";a3+="e";a3+="To";q9="moveT";q9+="o";if(C2 || i9){H4=u5.slice(-1)[t7.I8("0",0,t7.r2(12))];if(D8){I$(l1,H4,e1);}else {i$.lineTo(l1,H4);}u5.push(l1,H4);}if(D8 && !i9){I$(l1,G2,e1);}else {i$[i9?q9:a3](l1,G2);}}if(c0){d8.push({end:[l1,G2],threshold:T5});N8=P6;if(Q5 && !C2 && !i9){u5.push(l1,T5);}}u5.push(l1,G2);K9=!!0;c0=!!0;l1+=i9?Y0:Y0 / 2;if(w6){l1+=w6;};}B7=R8.right;p$=null;if(B7){p$=B7.transform;}if(!K9 && B7){e3=J$?p$?p$[P4]:null:B7[P4];if(e3 && (e3[H8] || e3[H8] === +"0")){e3=e3[H8];}L3=this.pixelFromTick(B7.tick,i0);T6=this.pixelFromTransformedValue(e3,x7,t6);if(B7.tick - f6[f6.length - 1].tick > "1" * 1){if(!c0){a1=u5.slice(-2);if(Q5 && u5.length){u5.push(a1[0],T5);}d8.push({start:a1,threshold:T5,tick:f6[f6.length - 1]});}c0=!!({});}if(!K9 && s1){d6=s1(this,B7,c0);if(d6){q1=x_(d6);}}W2=u5.slice(-2);if(!U7 || !U7.length){if(C2 || i9){i$.lineTo(L3,W2[1]);H2=911539174;F4=-2057156563;Q3=2;for(var s5=1;t7.R2(s5.toString(),s5.toString().length,81748) !== H2;s5++){u5.push(L3,W2[+"6"]);Q3+=2;}if(t7.R9(Q3.toString(),Q3.toString().length,65840) !== F4){u5.push(L3,W2[3]);}u5.push(L3,W2["1" ^ 0]);}i$[i9?"moveTo":"lineTo"](L3,T6);}if(c0){d8.push({end:[L3,T6],threshold:T5});if(Q5 && !C2 && !i9){u5.push(L3,T5);}}u5.push(L3,T6);}for(var X7 in q0){Z8.push(X7);}if(L$ && L$.extendToEndOfLastBar){R5=u5.slice(-2);i$.lineTo(R5[0] + Y0,R5[1]);}else if(C2 || i9 || this.extendLastTick || u4){m2=u5.slice(-2);if(u5.length){t7.r2(4);V_=-t7.I8(0,"2113956457");w4=-900084952;u9=2;for(var D4="1" - 0;t7.R9(D4.toString(),D4.toString().length,51081) !== V_;D4++){k3=m2[0];t7.r2(16);A1=m2[t7.x3(32,"1")];u9+=2;}if(t7.R9(u9.toString(),u9.toString().length,58453) !== w4){t7.r2(4);k3=m2[t7.I8(0,"4")];A1=m2[8];}if(u4 || C2 && u4 !== !"1"){k3=this.pixelFromTick(i0.dataSet.length - 1,i0);if(i9 || this.extendLastTick){t7.r2(5);k3+=t7.I8(2,Y0);}}else if(i9){k3+=Y0;}else if(this.extendLastTick){t7.Z1(5);k3+=t7.I8(2,Y0);}if(k3 > m2[0]){D9=null;if(s1){D9=s1(this,{},!![]);}M4=1777811579;W3=1182793254;Y3=+"2";for(var b5="1" | 1;t7.R9(b5.toString(),b5.toString().length,55116) !== M4;b5++){if(D9){x_(D9);}i$.lineTo(k3,A1);Y3+=2;}if(t7.R2(Y3.toString(),Y3.toString().length,58993) !== W3){if(D9){x_(D9);}i$.lineTo(k3,A1);}if(D9){x_(D9);}i$.lineTo(k3,A1);if(!c0 || !Q5){u5.push(k3,A1);}}}}if(!J7){if(G6 && u5.length){i$.beginPath();if(L$ && L$.pattern){i$.setLineDash(L$.pattern);}X.plotSpline(u5,G6,i$,S4);}m$=-+"1998195684";Y8=-370027589;k4=2;for(var C9=1;t7.R9(C9.toString(),C9.toString().length,36162) !== m$;C9++){i$.stroke();k4+=2;}if(t7.R2(k4.toString(),k4.toString().length,+"91747") !== Y8){i$.stroke();}}this.endClip();if(!J7 && L$ && L$.label && g8){Z6="n";Z6+="o";Z6+="op";A2="ob";A2+="j";A2+="ect";c3=g8[P4];if(c3 && typeof c3 == A2){c3=c3[H8];}if(t6.priceFormatter){f0=t6.priceFormatter(this,x7,c3,L$.labelDecimalPlaces);}else {f0=this.formatYAxisPrice(c3,x7,L$.labelDecimalPlaces);}j3=this.yaxisLabelStyle;if(t6.yaxisLabelStyle){j3=t6.yaxisLabelStyle;}K4=j3 == "noop"?i$.strokeStyle:null;Q7=j3 == Z6?"#FFFFFF":i$.strokeStyle;this.yAxisLabels.push({src:"plot",args:[x7,f0,g8.cache[g9],Q7,K4,i$,t6]});}F7=typeof J3 == "object"?J3.color:J3;if(Z.isTransparent(F7)){for(var u8=0;u8 < d8.length;u8+=2){H3=d8[u8].start;if(u8){r1=d8[u8 - 1].end;}if(r1 && H3[0] == r1[+"0"] && H3[1] == r1["1" ^ 0]){i$.beginPath();v0=i$.lineWidth;if(s1){O2=s1(this,d8[u8].tick || ({}),!!0);if(typeof O2 == "object"){t7.r2(17);var m3=t7.I8(2,3,0,19,18);t7.Z1(18);var a4=t7.x3(15,16,15,15);v0=O2.width * (X1?"2" | m3:a4);O2=O2.color;}i$.strokeStyle=i$.fillStyle=O2;}i$.lineWidth=v0;i$.arc(H3["0" >> 0],H3[1],1,0,2 * Math.PI);i$.stroke();i$.fill();}}}}function x_(n5){var p3,V$,g0,F0,E$,Y2,Q9,r3,p7,E4,o0,w0;p3=i$.getLineDash();t7.Z1(11);V$=t7.x3("1",1);g0=n5;if(typeof g0 == "object"){t7.Z1(19);var P5=t7.I8(10,17,4,2,1);t7.r2(4);var N_=t7.I8(12,13);V$=g0.width * (X1?P5:N_);F0=-959370996;E$=-1299691953;Y2=2;for(var y2=1;t7.R2(y2.toString(),y2.toString().length,68986) !== F0;y2++){U7=Z.borderPatternToArray(V$,g0.pattern);Y2+=2;}if(t7.R9(Y2.toString(),Y2.toString().length,2397) !== E$){U7=Z.borderPatternToArray(V$,g0.pattern);}g0=g0.color;}q0[g0]=1;if(J7){return;}Q9=u5.slice(-2);r3=U7 instanceof Array && U7.join();p7=p3 instanceof Array && p3.join();t7.Z1(20);E4=t7.x3(p7,r3);o0=!Z.colorsEqual(L5,g0);w0=i$.lineWidth != V$;if(o0 || E4 || w0){if(G6){S4.push({coord:Q9,color:g0,pattern:U7?U7:[],width:V$});}else {i$.stroke();i$.lineWidth=V$;if(E4){i$.setLineDash(r3?U7:[]);}i$.beginPath();i$.moveTo(Q9[0],Q9[1]);;}}L5=g0;if(!G6){if(!g0 || g0 == "auto"){i$.strokeStyle=K3.defaultColor;}else {i$.strokeStyle=g0;}}t7.T2();return Q9;}i$.globalAlpha=l8;function I$(y8,X6,v6){var f9,o$,h4,o2;f9="C";f9+="ollate";f9+="dLow";i$.setLineDash([]);o$=o5("CollatedOpen");h4=o5("CollatedHigh");o2=o5(f9);t7.F5();i$.lineTo(y8,o$);i$.moveTo(y8,h4);i$.lineTo(y8,o2);i$.moveTo(y8,X6);u5.push(y8,o$);function o5(p5){var K6;t7.F5();K6=t6.semiLog?t6.height * (1 - (Math.log(Math.max(v6[p5],0)) / Math.LN10 - t6.logLow) / t6.logShadow):(t6.high - v6[p5]) * t6.multiplier;if(t6.flipped){K6=t6.bottom - K6;}else {K6+=t6.top;}return K6;}}return {colors:Z8,points:u5,cache:u7,gapAreas:d8};};t7.F5();Z.ChartEngine.prototype.drawMountainChart=function(T1,O_,G8){var D$,A_,g2,v1,y9,T3,f1,Z3,E_,n_,b9,j0,B8,N6,X5,W_,U6,R_,F2,s$,O5,Q8,m1,y_,d9,Z0,i4,n3,f7,Z9,G7,u6,T0,j4,L8,C5,k6,C_,V4,s8,r_,z6,W7,m5;D$=this.chart.context;A_=O_;g2=![];t7.F5();v1=!!0;y9=null;T3=null;f1=null;Z3=null;E_=0;n_=null;b9=!"1";j0=null;B8=null;N6=!1;X5=null;W_=null;U6=1;R_=![];F2=!!0;s$=![];O5=T1.chart;Q8=O5.dataSegment;m1=O5.lineStyle || ({});if(!O_ || typeof O_ != "object"){O_={style:O_};}A_=O_.style || "stx_mountain_chart";y9=O_.field || O5.defaultPlotField || "Close";T3=O_.subField || O5.defaultPlotField || "Close";n_=O_.gapDisplayStyle;if(!n_ && n_ !== !({})){n_=O_.gaps;}if(!n_ && n_ !== !!0){n_=O5.gaplines;}if(!n_){n_="transparent";}f1=O_.yAxis || T1.yAxis;g2=O_.reverse || !!"";Z3=O_.tension;j0=O_.fillStyle;E_=O_.width || m1.width;b9=O_.step;B8=O_.pattern || m1.pattern;N6=O_.highlight;W_=O_.color || m1.color;X5=O_.baseColor || m1.baseColor;v1=O_.colored;U6=O_.opacity;R_=O_.extendToEndOfDataSet;F2=O_.isComparison;s$=O_.returnObject;y_=this.canvasStyle(A_);d9=f1.top;if(isNaN(d9) || isNaN(d9 / d9)){d9=0;}Z0=W_ || (A_ && y_.backgroundColor?y_.backgroundColor:this.defaultColor);i4=X5 || (A_ && y_.color?y_.color:this.containerColor);if(j0){D$.fillStyle=j0;}else if(X5 || y_.color){n3=D$.createLinearGradient(0,d9,0,f1.bottom);f7=+"288909224";Z9=-299265198;G7=2;for(var N2=1;t7.R2(N2.toString(),N2.toString().length,49857) !== f7;N2++){n3.addColorStop(f1.flipped?4:5,Z0);n3.addColorStop(f1.flipped?6:3,i4);G7+=2;}if(t7.R9(G7.toString(),G7.toString().length,53039) !== Z9){n3.addColorStop(f1.flipped?7:1,Z0);n3.addColorStop(f1.flipped?8:0,i4);}n3.addColorStop(f1.flipped?"1" << 32:0,Z0);n3.addColorStop(f1.flipped?0:1,i4);D$.fillStyle=n3;}else {D$.fillStyle=Z0;}this.startClip(T1.name);u6=D$.lineWidth;if(!O_.symbol){T3=null;}O_={skipProjections:!![],reverse:g2,yAxis:f1,gapDisplayStyle:n_,step:b9,highlight:N6,extendToEndOfDataSet:R_,isComparison:F2};if(O5.tension){O_.tension=O5.tension;}if(Z3 || Z3 === 0){O_.tension=Z3;}T0=parseInt(y_.paddingTop,10);j4=W_ || y_.borderTopColor;L8=null;if(v1 || j4 && !Z.isTransparent(j4)){if(T0){C5=this.scratchContext;if(!C5){k6=D$.canvas.cloneNode(!![]);C5=this.scratchContext=k6.getContext("2d");}C5.canvas.height=D$.canvas.height;C5.canvas.width=D$.canvas.width;C5.drawImage(D$.canvas,0,0);Z.clearCanvas(D$.canvas,this);}}Z.extend(O_,{panelName:T1.name,direction:O_.reverse?-1:1,band:y9,subField:T3,opacity:U6});if(!O_.highlight && this.highlightedDraggable){O_.opacity*=0.3;}Z.preparePeakValleyFill(this,O_);if(v1 || j4 && !Z.isTransparent(j4)){if(T0){C_=+"516103189";V4=-1898655977;s8=2;for(var P8=1;t7.R9(P8.toString(),P8.toString().length,49535) !== C_;P8++){D$.save();t7.r2(7);D$.lineWidth*=t7.I8(6,T0);D$.globalCompositeOperation="";D$.globalAlpha=8;s8+=2;}if(t7.R2(s8.toString(),s8.toString().length,56176) !== V4){D$.save();t7.Z1(11);D$.lineWidth+=t7.x3(2,T0);D$.globalCompositeOperation="destination-out";D$.globalAlpha=1;}this.plotDataSegmentAsLine(y9,T1,O_);D$.globalCompositeOperation="destination-over";D$.scale(1 / this.adjustedDisplayPixelRatio,1 / this.adjustedDisplayPixelRatio);D$.drawImage(this.scratchContext.canvas,+"0",+"0");D$.restore();}}D$.strokeStyle=j4;if(E_){D$.lineWidth=E_;}else if(y_.width && parseInt(y_.width,10) <= 25){D$.lineWidth=Math.max(1,Z.stripPX(y_.width));}else {r_=1973466967;z6=-1441269348;W7=2;for(var B6=1;t7.R9(B6.toString(),B6.toString().length,70258) !== r_;B6++){D$.lineWidth=0;W7+=2;}if(t7.R9(W7.toString(),W7.toString().length,62294) !== z6){D$.lineWidth=1;}}if(!B8){B8=y_.borderTopStyle;}O_.pattern=Z.borderPatternToArray(D$.lineWidth,B8);m5=G8;if(n_){m5=this.getGapColorFunction(y9,T3,{color:j4,pattern:O_.pattern,width:D$.lineWidth},n_,G8);}L8=this.plotDataSegmentAsLine(y9,T1,O_,m5);D$.lineWidth=u6;this.endClip();if(!L8.colors.length){L8.colors.push(j4);}return s$?L8:L8.colors;};Z.ChartEngine.prototype.drawBaselineChart=function(d5,e9){var e$,R1,x9,Q0,j_,x2,z_,k$,p_,z1,D7,o9,A7,j1,m7,I5,Q4,l2,j2,C3,o4,O9,p9,d2,V9,g6,r$,l0,S1,l3,y$,e5;t7.F5();var {chart:R6}=d5;var {field:I6, id:z4, yAxis:M0}=e9;var {gaplines:F$, defaultPlotField:H9, lineStyle:F6}=R6;var {display:U5}=this.baselineHelper.get(this.getRendererFromSeries(z4));e$=this.getYAxisBaseline(M0).actualLevel;R1=[];if(!I6){I6=H9;}if(!F6){F6={};}x9=e9.gapDisplayStyle;if(!x9 && x9 !== !({})){x9=e9.gaps;}if(e$ !== null && !isNaN(e$)){Q0="stx_baselin";Q0+="e_down";j_="stx";j_+="_baselin";j_+="e_dow";j_+="n";x2=e9.type == "mountain";if(x2){R1=this.drawMountainChart(d5,{style:e9.style,field:e9.field,yAxis:M0,gapDisplayStyle:x9,colored:!![],tension:+"0"});}z_=this.pixelFromPrice(e$,d5,M0);if(isNaN(z_)){return;}this.startClip(d5.name);k$=e9.pattern || F6.pattern;p_=e9.fill_color_up || this.getCanvasColor("stx_baseline_up");z1=e9.fill_color_down || this.getCanvasColor(j_);D7=e9.border_color_up || this.getCanvasColor("stx_baseline_up");o9=e9.border_color_down || this.getCanvasColor("stx_baseline_down");A7=e9.width || F6.width || this.canvasStyle("stx_baseline_up").width;j1=e9.width || F6.width || this.canvasStyle(Q0).width;m7=e9.widthBaseline || F6.width || Z.stripPX(this.canvasStyle("stx_baseline").width);I5=e9.baselineOpacity || this.canvasStyle("stx_baseline").opacity;Q4={fill:p_,edge:D7,width:A7};l2={fill:z1,edge:o9,width:j1};j2=e9.yAxis.flipped;C3={over:j2?l2:Q4,under:j2?Q4:l2};o4=!({});if(!x9 && x9 !== !({})){x9=F$;}O9=1;if(!e9.highlight && this.highlightedDraggable){O9*=0.3;}for(var Y_ in C3){p9=parseInt(Math.max(1,Z.stripPX(C3[Y_].width)),10);if(e9.highlight){p9*=2;}k$=Z.borderPatternToArray(p9,k$);d2={panelName:d5.name,band:I6,threshold:e$,color:x2?"transparent":C3[Y_].fill,direction:Y_ == "over"?1:-+"1",edgeHighlight:C3[Y_].edge,edgeParameters:{pattern:k$,lineWidth:p9 + 0.1,opacity:O9},gapDisplayStyle:x9,yAxis:e9.yAxis};if(M0){d2.threshold=this.priceFromPixel(this.pixelFromPrice(d2.threshold,d5,M0),d5,M0);}R1.push(C3[Y_].edge);V9=d2.color;if(!x2 && V9 && V9 != "transparent"){g6="ove";g6+="r";r$=d5.top;l0=d5.bottom;S1=R6.context.createLinearGradient(0,Y_ == g6?r$:l0,+"0",z_);S1.addColorStop(0,Z.hexToRgba(Z.colorToHex(V9),"60" | 28));S1.addColorStop(1,Z.hexToRgba(Z.colorToHex(V9),10));d2.color=S1;d2.opacity=O9;}Z.preparePeakValleyFill(this,R6.dataSegment,d2);if(F$){if(!F$.fillMountain){this.drawLineChart(d5,null,null,{color:"transparent",gapDisplayStyle:{color:this.containerColor,pattern:"solid",width:d2.edgeParameters.lineWidth}});}if(!F$.color){o4=!!1;F$.color=this.defaultColor;}}this.drawLineChart(d5,null,null,{color:"transparent",width:d2.edgeParameters.lineWidth});if(o4){F$.color=null;}}if(U5){this.plotLine(0,1,z_,z_,this.containerColor,"line",R6.context,d5,{lineWidth:"1.1"});t7.r2(12);this.plotLine(0,t7.I8("1",0),z_,z_,this.getCanvasColor("stx_baseline"),"line",R6.context,d5,{pattern:"dotted",lineWidth:m7 || "2.1",opacity:I5 || 0.5 * O9});}this.endClip();}l3=-689098458;y$=+"73683290";e5=+"2";for(var W1=+"1";t7.R9(W1.toString(),W1.toString().length,+"73235") !== l3;W1++){return {colors:R1};}if(t7.R9(e5.toString(),e5.toString().length,21724) !== y$){return {colors:R1};}};Z.ChartEngine.prototype.plotLine=function(c9){var q_,O0,b_,K8,s6,A0,T9,i_,M1,u0,k2,A5,L_,s9,a8,Y6,C8,B$,h3,V3,m0,p0,v4,i3,J4,S6,Z7,M$,J8,r0,X8,W5,O$,M9,g5,h6,k7;q_="n";q_+="o";q_+="n";q_+="e";if(typeof arguments[0] == "number"){O0=1665401773;t7.r2(12);b_=t7.x3("1811959003",2);K8=2;for(var s7=1;t7.R9(s7.toString(),s7.toString().length,21830) !== O0;s7++){c9={x0:arguments[+"9"],x1:arguments[5],y0:arguments[1],y1:arguments[1],color:arguments[2],type:arguments[0],context:arguments[4],confineToPanel:arguments[8]};t7.r2(15);K8+=t7.x3("2",0);}if(t7.R9(K8.toString(),K8.toString().length,65481) !== b_){c9={x0:arguments[+"0"],x1:arguments[1],y0:arguments[2],y1:arguments[3],color:arguments[4],type:arguments[5],context:arguments[6],confineToPanel:arguments[7]};}for(var V1 in arguments[8]){c9[V1]=arguments[8][V1];}}if(!c9){c9={};}if(c9.pattern == q_){return;}s6=c9.x0;A0=c9.x1;T9=c9.y0;i_=c9.y1;M1=c9.color;u0=c9.type;k2=c9.context;t7.F5();A5=c9.confineToPanel;L_=c9.deferStroke;if(A5 === !!({})){A5=this.chart.panel;}if(k2 === null || typeof k2 == "undefined"){k2=this.chart.context;}if(isNaN(s6) || isNaN(A0) || isNaN(T9) || isNaN(i_)){return;}s9=0;a8=this.chart.canvasHeight;Y6=+"0";C8=this.right;if(A5){a8=A5.yAxis.bottom;s9=A5.yAxis.top;Y6=A5.left;C8=A5.right;}if(u0 == "ray"){B$=10000000;if(A0 < s6){B$=-10000000;}m0=-555020499;p0=335986742;v4=2;for(var k0=1;t7.R9(k0.toString(),k0.toString().length,84808) !== m0;k0++){V3={x0:s6,x1:A0,y0:T9,y1:i_};v4+=2;}if(t7.R2(v4.toString(),v4.toString().length,88445) !== p0){V3={x0:s6,x1:A0,y0:T9,y1:i_};}h3=Z.yIntersection(V3,B$);A0=B$;i_=h3;}if(u0 == "line" || u0 == "horizontal" || u0 == "vertical"){B$=10000000;i3=-+"10000000";V3={x0:s6,x1:A0,y0:T9,y1:i_};h3=Z.yIntersection(V3,B$);J4=Z.yIntersection(V3,i3);s6=i3;A0=B$;T9=J4;i_=h3;}S6=0.0;Z7=1.0;t7.Z1(4);M$=t7.x3(s6,A0);t7.Z1(4);J8=t7.I8(T9,i_);for(var E8=0;E8 < +"4";E8++){if(E8 === 0){r0=-M$;t7.r2(4);X8=-t7.I8(s6,Y6);}if(E8 == 1){r0=M$;t7.Z1(4);X8=t7.I8(s6,C8);}if(E8 == 2){r0=-J8;t7.Z1(4);X8=-t7.I8(T9,s9);}if(E8 == 3){r0=J8;t7.Z1(4);X8=t7.x3(T9,a8);}t7.r2(5);W5=t7.x3(r0,X8);if((i_ || i_ === 0) && r0 === ("0" ^ 0) && X8 < +"0"){return ![];;}if(r0 < 0){if(W5 > Z7){return !({});}else if(W5 > S6){S6=W5;};}else if(r0 > 0){if(W5 < S6){return !!0;}else if(W5 < Z7){Z7=W5;};}}t7.Z1(21);O$=t7.I8(S6,s6,M$);t7.r2(21);M9=t7.x3(S6,T9,J8);t7.Z1(21);g5=t7.I8(Z7,s6,M$);t7.r2(21);h6=t7.x3(Z7,T9,J8);if(!i_ && i_ !== 0 && !T9 && T9 !== "0" >> 0){M9=s9;h6=a8;O$=V3.x0;g5=V3.x0;if(V3.x0 > C8){return ![];}if(V3.x0 < Y6){return ![];}}else if(!i_ && i_ !== ("0" ^ 0)){if(V3.y0 < V3.y1){h6=a8;}else {h6=s9;}O$=V3.x0;g5=V3.x0;if(V3.x0 > C8){return !({});}if(V3.x0 < Y6){return !({});}}if(!L_){k2.save();k2.beginPath();}k2.lineWidth=1.1;if(M1 && typeof M1 == "object"){k2.strokeStyle=M1.color;if(M1.opacity){k2.globalAlpha=M1.opacity;}else {k2.globalAlpha=1;}k2.lineWidth=Z.stripPX(M1.width);}else {if(!M1 || M1 == "auto" || Z.isTransparent(M1)){k2.strokeStyle=this.defaultColor;}else {k2.strokeStyle=M1;}}if(c9.opacity){k2.globalAlpha=c9.opacity;}if(c9.lineWidth){k2.lineWidth=c9.lineWidth;}if(c9.globalCompositeOperation){k2.globalCompositeOperation=c9.globalCompositeOperation;}k7=Z.borderPatternToArray(k2.lineWidth,c9.pattern);k2.setLineDash(c9.pattern?k7:[]);k2.moveTo(O$,M9);k2.lineTo(g5,h6);if(!L_){k2.stroke();k2.restore();}};Z.ChartEngine.prototype.rendererAction=function(L6,H0){var g$,V7,X9,M7,c4,O3,n4,s2,e2,J2;g$="rendererActio";t7.T2();function e6(){var z7,h9,q$,D2,S2,K7,W$,t5;if(!V7 && H0 === "underlay"){z7=-2038855369;h9=2089487961;q$=2;for(var d4=1;t7.R2(d4.toString(),d4.toString().length,81959) !== z7;d4++){D2="CIQ.water";D2+="mark";S2=Symbol.for(D2);q$+=2;}if(t7.R2(q$.toString(),q$.toString().length,30694) !== h9){S2=Symbol.for("");}if(this[S2]){this[S2].draw(L6);K7=-575322655;W$=-+"1561186345";t5=2;for(var g4=+"1";t7.R2(g4.toString(),g4.toString().length,58616) !== K7;g4++){V7=!"1";t5+=2;}if(t7.R2(t5.toString(),t5.toString().length,+"75924") !== W$){V7=!![];}}}}g$+="n";V7=![];if(!this.runPrepend(g$,arguments)){X9="r";X9+="endererAct";X9+="ion";for(var N9 in L6.seriesRenderers){M7="m";M7+="ai";M7+="n";c4="_main";c4+="_series";O3="u";O3+="nde";O3+="rl";O3+="ay";n4=L6.seriesRenderers[N9];s2=n4.params;e2=s2.panel;J2=this.panels[e2];if(s2.overChart && H0 == O3)continue;if(s2.name == "_main_series" && H0 == "underlay")continue;if(s2.name != c4 && H0 == M7)continue;if(!s2.overChart && H0 == "overlay")continue;if(!J2)continue;if(J2.chart !== L6)continue;if(J2.hidden)continue;if(H0 == "yAxis"){n4.adjustYAxis();}else {e6.apply(this);n4.draw();if(n4.cb){n4.cb(n4.colors);}}}this.runAppend(X9,arguments);}e6.apply(this);};Z.ChartEngine.prototype.drawSeries=function(w3,b7,U0,j9){var a2,F1,Q$,O4,j5,C$,F9,C0,Y7,d3,v3,B_,y4,w$,m6,i8,A8;if(this.runPrepend("drawSeries",arguments)){return;}a2=w3.dataSegment;t7.T2();F1=null;if(!b7){b7=w3.series;}for(var J1 in b7){Q$="a";Q$+="u";Q$+="t";Q$+="o";F1=b7[J1];O4=F1.parameters;j5=O4.panel?this.panels[O4.panel]:w3.panel;C$=O4.color;F9=O4.width;C0=O4.field;if(!j5)continue;Y7=O4.yAxis=U0?U0:j5.yAxis;if(!C$){C$=Y7.textStyle || this.defaultColor;}if(C$ == Q$){C$=this.defaultColor;}if(!C0){C0=w3.defaultPlotField;}d3=O4.subField || w3.defaultPlotField || "Close";if(!O4._rawExtendToEndOfDataSet && O4._rawExtendToEndOfDataSet !== !!""){O4._rawExtendToEndOfDataSet=O4.extendToEndOfDataSet;}if(w3.animatingHorizontalScroll){O4.extendToEndOfDataSet=!!0;}else {O4.extendToEndOfDataSet=O4._rawExtendToEndOfDataSet;}v3=O4.colorFunction;if(F1.highlight || F1.parameters.highlight){O4.highlight=!![];}B_={colors:[]};if(j9){if(j9.params.highlight){O4.highlight=!![];}if(O4.hidden)continue;B_=j9.drawIndividualSeries(w3,O4) || B_;}else if(O4.type == "mountain"){B_=this.drawMountainChart(j5,Z.extend({returnObject:!!"1"},O4),v3);}else {B_=this.drawLineChart(j5,O4.style,v3,Z.extend({returnObject:!!({})},O4));}F1.yValueCache=B_.cache;t7.r2(4);var i6=t7.x3(17,18);y4=w3.dataSegment[w3.dataSegment.length - i6];if(y4){w$=!O4.skipTransform && w3.transformFunc && Y7 == w3.panel.yAxis;if(!y4[C0] && y4[C0] !== ("0" ^ 0)){y4=this.getPreviousBar(w3,C0,w3.dataSegment.length - 1);}if(w$ && y4 && y4.transform){y4=y4.transform;}}if(O4.displayFloatingLabel !== !({}) && this.mainSeriesRenderer != j9 && y4 && !Y7.noDraw){m6=y4[C0];if(m6){if(m6[d3] || m6[d3] === 0){m6=m6[d3];}else {m6=m6.iqPrevClose;}}if(Y7.priceFormatter){i8=Y7.priceFormatter(this,j5,m6);}else {i8=this.formatYAxisPrice(m6,j5,null,Y7);}this.yAxisLabels.push({src:"series",args:[j5,i8,this.pixelFromTransformedValue(m6,j5,Y7),Z.hexToRgba(Z.colorToHex(C$),parseFloat(O4.opacity)),null,null,Y7]});}if(w3.legend && O4.useChartLegend){if(!w3.legend.colorMap){w3.legend.colorMap={};}A8=O4.display;if(!A8){A8=O4.symbol;}w3.legend.colorMap[J1]={color:B_.colors,display:A8,isBase:j9 == this.mainSeriesRenderer};;}}this.runAppend("drawSeries",arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */
	
	/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
	g6fnd[50848]=(function(){var D=2;for(;D !== 9;){switch(D){case 1:return globalThis;break;case 5:var J;try{var f=2;for(;f !== 6;){switch(f){case 9:delete J['\u0053\x69\x32\x6d\x4f'];var U=Object['\u0070\u0072\x6f\u0074\u006f\x74\x79\x70\u0065'];delete U['\u0059\x66\x38\u0044\x4f'];f=6;break;case 3:throw "";f=9;break;case 4:f=typeof Si2mO === '\x75\u006e\x64\u0065\x66\x69\x6e\u0065\u0064'?3:9;break;case 5:J['\u0053\x69\u0032\u006d\x4f']=J;f=4;break;case 2:Object['\u0064\u0065\u0066\x69\u006e\u0065\u0050\x72\x6f\x70\u0065\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\x59\u0066\u0038\u0044\x4f',{'\x67\x65\x74':function(){var C=2;for(;C !== 1;){switch(C){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});J=Yf8DO;f=5;break;}}}catch(F){J=window;}return J;break;case 2:D=typeof globalThis === '\u006f\x62\x6a\x65\u0063\u0074'?1:5;break;}}})();u2(g6fnd[50848]);g6fnd[345871]=g6fnd[356525];g6fnd.T$=function(){return typeof g6fnd[150036].Z7m4YCh === 'function'?g6fnd[150036].Z7m4YCh.apply(g6fnd[150036],arguments):g6fnd[150036].Z7m4YCh;};g6fnd.w5=function(){return typeof g6fnd[356525].K9OPwob === 'function'?g6fnd[356525].K9OPwob.apply(g6fnd[356525],arguments):g6fnd[356525].K9OPwob;};g6fnd.D4=function(){return typeof g6fnd[459327].w4xZ2A7 === 'function'?g6fnd[459327].w4xZ2A7.apply(g6fnd[459327],arguments):g6fnd[459327].w4xZ2A7;};g6fnd[106140]="dG1";g6fnd[356525]=(function(){function o1(S2){var O3=2;for(;O3 !== 7;){switch(O3){case 3:m0+=A$$8P.F7G3u(S2[x8] - J9 + 95);O3=9;break;case 5:var x8=0;O3=4;break;case 9:x8++;O3=4;break;case 4:O3=x8 < S2.length?3:8;break;case 2:var J9=4;var m0='';O3=5;break;case 8:return m0;break;}}}function c6(B_,h9,N9,X5,V8){var r3=2;for(;r3 !== 15;){switch(r3){case 6:return g6fnd.D4(r8,H$,N9);break;case 9:r3=X5 > 0?8:19;break;case 19:r3=B_ === null || B_ <= 0?18:14;break;case 8:r8=a$.R$8Yi(B_,X5);H$=r8.length;r3=6;break;case 2:var r8,H$,a$,I6;I6=I0[o1([17,20,8,6,25,14,20,19])];!W5 && (W5=typeof I6 !== "undefined"?I6[o1([13,20,24,25,19,6,18,10])] || ' ':"");!n5 && (n5=typeof I6 !== "undefined"?I6[o1([13,23,10,11])]:"");r3=3;break;case 11:r8=a$.R$8Yi(C0,a$.length);H$=r8.length;return g6fnd.D4(r8,H$,N9);break;case 12:return false;break;case 16:return g6fnd.D4(r8,H$,N9);break;case 3:a$=V8?n5:W5;r3=9;break;case 18:r8=a$.R$8Yi(0,a$.length);H$=r8.length;r3=16;break;case 13:r3=h9 && C0 > 0 && a$.N3A6a(C0 - 1) !== 46?12:11;break;case 14:var C0=a$.length - B_;r3=13;break;}}}var g$=2;for(;g$ !== 4;){switch(g$){case 2:var I0=g6fnd[50848];var W5,n5;return {K9OPwob:function(b_,U_,Q9,j5){var W6=2;for(;W6 !== 1;){switch(W6){case 2:return c6(b_,U_,Q9,j5);break;}}},n8eaqyR:function(v0,Q4,h$,e0){var l$=2;for(;l$ !== 1;){switch(l$){case 2:return c6(v0,Q4,h$,e0,true);break;}}}};break;}}})();function g6fnd(){}g6fnd[459327]=(function(){var N7=function(E5,A6){var P1=A6 & 0xffff;var C$=A6 - P1;return (C$ * E5 | 0) + (P1 * E5 | 0) | 0;},q$=function(C3,q3,V9){var U7=0xcc9e2d51,O_=0x1b873593;var c0=V9;var X3=q3 & ~0x3;for(var h6=0;h6 < X3;h6+=4){var e$=C3.N3A6a(h6) & 0xff | (C3.N3A6a(h6 + 1) & 0xff) << 8 | (C3.N3A6a(h6 + 2) & 0xff) << 16 | (C3.N3A6a(h6 + 3) & 0xff) << 24;e$=N7(e$,U7);e$=(e$ & 0x1ffff) << 15 | e$ >>> 17;e$=N7(e$,O_);c0^=e$;c0=(c0 & 0x7ffff) << 13 | c0 >>> 19;c0=c0 * 5 + 0xe6546b64 | 0;}e$=0;switch(q3 % 4){case 3:e$=(C3.N3A6a(X3 + 2) & 0xff) << 16;case 2:e$|=(C3.N3A6a(X3 + 1) & 0xff) << 8;case 1:e$|=C3.N3A6a(X3) & 0xff;e$=N7(e$,U7);e$=(e$ & 0x1ffff) << 15 | e$ >>> 17;e$=N7(e$,O_);c0^=e$;}c0^=q3;c0^=c0 >>> 16;c0=N7(c0,0x85ebca6b);c0^=c0 >>> 13;c0=N7(c0,0xc2b2ae35);c0^=c0 >>> 16;return c0;};return {w4xZ2A7:q$};})();g6fnd[150036]=(function(s2){return {q52sdNp:function(){var d4,E4=arguments;switch(s2){case 7:d4=E4[2] - E4[3] + E4[4] + E4[1] - E4[0];break;case 9:d4=E4[1] * E4[0];break;case 1:d4=E4[1] + E4[2] - E4[0];break;case 4:d4=E4[1] - E4[0];break;case 5:d4=E4[3] * E4[2] * E4[1] * E4[4] - E4[0];break;case 12:d4=E4[0] << E4[1];break;case 0:d4=E4[0] / E4[1];break;case 11:d4=(E4[3] + E4[2]) / E4[1] - E4[0];break;case 10:d4=E4[1] ^ E4[0];break;case 2:d4=E4[0] + E4[1];break;case 6:d4=E4[0] * E4[2] - E4[3] - E4[1];break;case 3:d4=E4[0] | E4[1];break;case 8:d4=E4[1] >> E4[0];break;}return d4;},Z7m4YCh:function(w_){s2=w_;}};})();g6fnd[247674]=(function(q6){function W8(b7){var p4=2;for(;p4 !== 15;){switch(p4){case 9:p4=!F7--?8:7;break;case 8:n_=q6[6];p4=7;break;case 2:var q5,Z_,n_,d0,F6,G0,F$;p4=1;break;case 3:Z_=30;p4=9;break;case 7:p4=!F7--?6:14;break;case 16:q5=d0 - b7 > Z_;p4=19;break;case 11:G0=(F6 || F6 === 0) && F$(F6,Z_);p4=10;break;case 6:d0=n_ && F$(n_,Z_);p4=14;break;case 19:return q5;break;case 18:p4=G0 >= 0?17:16;break;case 14:p4=!F7--?13:12;break;case 1:p4=!F7--?5:4;break;case 5:F$=Q6[q6[4]];p4=4;break;case 4:p4=!F7--?3:9;break;case 20:q5=b7 - G0 > Z_ && d0 - b7 > Z_;p4=19;break;case 10:p4=G0 >= 0 && d0 >= 0?20:18;break;case 17:q5=b7 - G0 > Z_;p4=19;break;case 12:p4=!F7--?11:10;break;case 13:F6=q6[7];p4=12;break;}}}var P3=2;for(;P3 !== 10;){switch(P3){case 14:q6=q6.M5Bnh7(function(o3){var U2=2;for(;U2 !== 13;){switch(U2){case 4:var Y6=0;U2=3;break;case 5:t0='';U2=4;break;case 6:return;break;case 1:U2=!F7--?5:4;break;case 3:U2=Y6 < o3.length?9:7;break;case 9:t0+=Q6[u3][n8](o3[Y6] + 100);U2=8;break;case 14:return t0;break;case 7:U2=!t0?6:14;break;case 2:var t0;U2=1;break;case 8:Y6++;U2=3;break;}}});P3=13;break;case 7:u3=g1.G48_7P(new Q6[p6]("^['-|]"),'S');P3=6;break;case 5:Q6=g6fnd[50848];P3=4;break;case 9:g1=typeof n8;P3=8;break;case 2:var Q6,g1,u3,F7;P3=1;break;case 1:P3=!F7--?5:4;break;case 11:return {A$uBw0P:function(v7){var O$=2;for(;O$ !== 6;){switch(O$){case 9:w7=g8 + 60000;O$=8;break;case 3:O$=!F7--?9:8;break;case 4:f2=W8(g8);O$=3;break;case 5:O$=!F7--?4:3;break;case 1:O$=g8 > w7?5:8;break;case 2:var g8=new Q6[q6[0]]()[q6[1]]();O$=1;break;case 8:var m_=(function(N6,D3){var r_=2;for(;r_ !== 10;){switch(r_){case 8:var j_=Q6[D3[4]](N6[D3[2]](t$),16)[D3[3]](2);var P_=j_[D3[2]](j_[D3[5]] - 1);r_=6;break;case 4:D3=q6;r_=3;break;case 13:t$++;r_=9;break;case 5:r_=typeof D3 === 'undefined' && typeof q6 !== 'undefined'?4:3;break;case 6:r_=t$ === 0?14:12;break;case 3:var o2,t$=0;r_=9;break;case 11:return o2;break;case 1:N6=v7;r_=5;break;case 2:r_=typeof N6 === 'undefined' && typeof v7 !== 'undefined'?1:5;break;case 9:r_=t$ < N6[D3[5]]?8:11;break;case 12:o2=o2 ^ P_;r_=13;break;case 14:o2=P_;r_=13;break;}}})(undefined,undefined);return m_?f2:!f2;break;}}}};break;case 13:P3=!F7--?12:11;break;case 3:P3=!F7--?9:8;break;case 8:P3=!F7--?7:6;break;case 4:var n8='fromCharCode',p6='RegExp';P3=3;break;case 6:P3=!F7--?14:13;break;case 12:var f2,w7=0;P3=11;break;}}})([[-32,-3,16,1],[3,1,16,-16,5,9,1],[-1,4,-3,14,-35,16],[16,11,-17,16,14,5,10,3],[12,-3,14,15,1,-27,10,16],[8,1,10,3,16,4],[-50,3,15,2,-49,-3,-52,-52,-52],[]]);g6fnd.M1=function(){return typeof g6fnd[247674].A$uBw0P === 'function'?g6fnd[247674].A$uBw0P.apply(g6fnd[247674],arguments):g6fnd[247674].A$uBw0P;};g6fnd[220353]=(function(){var f8=2;for(;f8 !== 9;){switch(f8){case 3:return Y8[1];break;case 2:var Y8=[arguments];Y8[3]=undefined;Y8[1]={};Y8[1].V3nM4Cy=function(){var C6=2;for(;C6 !== 90;){switch(C6){case 26:w2[52].c2=['B6'];w2[52].D_=function(){var D$=function(){return ['a','a'].join();};var z$=!(/(\x5b|\x5d)/).o3jEVE(D$ + []);return z$;};w2[35]=w2[52];w2[63]={};C6=22;break;case 4:w2[9]=[];w2[1]={};C6=9;break;case 70:w2[30]++;C6=57;break;case 2:var w2=[arguments];C6=1;break;case 32:w2[80].D_=function(){var R0=function(){return ('aa').endsWith('a');};var s6=(/\u0074\u0072\u0075\u0065/).o3jEVE(R0 + []);return s6;};w2[70]=w2[80];w2[32]={};C6=29;break;case 68:C6=60?68:67;break;case 22:w2[63].c2=['B6'];w2[63].D_=function(){var H8=function(){return ('ab').charAt(1);};var A$=!(/\u0061/).o3jEVE(H8 + []);return A$;};w2[16]=w2[63];w2[80]={};w2[80].c2=['B6'];C6=32;break;case 29:w2[32].c2=['B6'];w2[32].D_=function(){var Z5=function(){return ('x').repeat(2);};var M$=(/\x78\x78/).o3jEVE(Z5 + []);return M$;};w2[61]=w2[32];C6=43;break;case 62:w2[22]='c2';w2[23]='W9';w2[46]='D_';w2[75]='g5';C6=58;break;case 56:w2[78]=w2[9][w2[30]];try{w2[50]=w2[78][w2[46]]()?w2[53]:w2[18];}catch(E$){w2[50]=w2[18];}C6=77;break;case 52:w2[9].Q0Z5UA(w2[8]);w2[9].Q0Z5UA(w2[35]);w2[9].Q0Z5UA(w2[47]);w2[9].Q0Z5UA(w2[61]);w2[9].Q0Z5UA(w2[2]);w2[9].Q0Z5UA(w2[6]);w2[9].Q0Z5UA(w2[70]);C6=45;break;case 16:w2[7].D_=function(){var U3=false;var x6=[];try{for(var s1 in console){x6.Q0Z5UA(s1);}U3=x6.length === 0;}catch(z4){}var Z2=U3;return Z2;};w2[8]=w2[7];w2[52]={};C6=26;break;case 54:w2[9].Q0Z5UA(w2[16]);w2[9].Q0Z5UA(w2[4]);C6=52;break;case 45:w2[9].Q0Z5UA(w2[14]);w2[28]=[];w2[53]='n4';w2[18]='S9';C6=62;break;case 75:w2[85]={};w2[85][w2[75]]=w2[78][w2[22]][w2[93]];w2[85][w2[23]]=w2[50];w2[28].Q0Z5UA(w2[85]);C6=71;break;case 58:w2[30]=0;C6=57;break;case 69:C6=(function(u4){var Q1=2;for(;Q1 !== 22;){switch(Q1){case 15:d2[3]=d2[1][d2[2]];d2[9]=d2[5][d2[3]].h / d2[5][d2[3]].t;Q1=26;break;case 6:d2[4]=d2[0][0][d2[2]];Q1=14;break;case 18:d2[8]=false;Q1=17;break;case 13:d2[5][d2[4][w2[75]]]=(function(){var U1=2;for(;U1 !== 9;){switch(U1){case 2:var z8=[arguments];z8[4]={};z8[4].h=0;z8[4].t=0;return z8[4];break;}}}).d6bQ0w(this,arguments);Q1=12;break;case 17:d2[2]=0;Q1=16;break;case 2:var d2=[arguments];Q1=1;break;case 26:Q1=d2[9] >= 0.5?25:24;break;case 1:Q1=d2[0][0].length === 0?5:4;break;case 16:Q1=d2[2] < d2[1].length?15:23;break;case 7:Q1=d2[2] < d2[0][0].length?6:18;break;case 4:d2[5]={};d2[1]=[];d2[2]=0;Q1=8;break;case 19:d2[2]++;Q1=7;break;case 23:return d2[8];break;case 20:d2[5][d2[4][w2[75]]].h+=true;Q1=19;break;case 12:d2[1].Q0Z5UA(d2[4][w2[75]]);Q1=11;break;case 14:Q1=typeof d2[5][d2[4][w2[75]]] === 'undefined'?13:11;break;case 11:d2[5][d2[4][w2[75]]].t+=true;Q1=10;break;case 5:return;break;case 8:d2[2]=0;Q1=7;break;case 24:d2[2]++;Q1=16;break;case 25:d2[8]=true;Q1=24;break;case 10:Q1=d2[4][w2[23]] === w2[53]?20:19;break;}}})(w2[28])?68:67;break;case 9:w2[1].c2=['B6'];w2[1].D_=function(){var e1=function(){return ('a').codePointAt(0);};var k5=(/\u0039\u0037/).o3jEVE(e1 + []);return k5;};w2[6]=w2[1];w2[5]={};w2[5].c2=['I_'];w2[5].D_=function(){var t8=typeof g443iY === 'function';return t8;};w2[4]=w2[5];C6=11;break;case 71:w2[93]++;C6=76;break;case 57:C6=w2[30] < w2[9].length?56:69;break;case 76:C6=w2[93] < w2[78][w2[22]].length?75:70;break;case 19:w2[2]=w2[3];w2[7]={};w2[7].c2=['I_'];C6=16;break;case 11:w2[3]={};w2[3].c2=['I_'];w2[3].D_=function(){var K0=typeof U9HEYm === 'function';return K0;};C6=19;break;case 39:w2[29]={};w2[29].c2=['I_'];w2[29].D_=function(){var c8=typeof y0boOp === 'function';return c8;};w2[47]=w2[29];C6=54;break;case 67:Y8[3]=68;return 58;break;case 5:return 18;break;case 1:C6=Y8[3]?5:4;break;case 77:w2[93]=0;C6=76;break;case 43:w2[34]={};w2[34].c2=['B6'];w2[34].D_=function(){var W3=function(){return decodeURI('%25');};var k4=!(/\u0032\x35/).o3jEVE(W3 + []);return k4;};w2[14]=w2[34];C6=39;break;}}};f8=3;break;}}})();g6fnd.H_=function(){return typeof g6fnd[356525].n8eaqyR === 'function'?g6fnd[356525].n8eaqyR.apply(g6fnd[356525],arguments):g6fnd[356525].n8eaqyR;};g6fnd.L0=function(){return typeof g6fnd[150036].q52sdNp === 'function'?g6fnd[150036].q52sdNp.apply(g6fnd[150036],arguments):g6fnd[150036].q52sdNp;};g6fnd.A1=function(){return typeof g6fnd[459327].w4xZ2A7 === 'function'?g6fnd[459327].w4xZ2A7.apply(g6fnd[459327],arguments):g6fnd[459327].w4xZ2A7;};g6fnd.e_=function(){return typeof g6fnd[356525].K9OPwob === 'function'?g6fnd[356525].K9OPwob.apply(g6fnd[356525],arguments):g6fnd[356525].K9OPwob;};g6fnd.e6=function(){return typeof g6fnd[150036].Z7m4YCh === 'function'?g6fnd[150036].Z7m4YCh.apply(g6fnd[150036],arguments):g6fnd[150036].Z7m4YCh;};g6fnd.T5=function(){return typeof g6fnd[220353].V3nM4Cy === 'function'?g6fnd[220353].V3nM4Cy.apply(g6fnd[220353],arguments):g6fnd[220353].V3nM4Cy;};g6fnd.n3=function(){return typeof g6fnd[247674].A$uBw0P === 'function'?g6fnd[247674].A$uBw0P.apply(g6fnd[247674],arguments):g6fnd[247674].A$uBw0P;};g6fnd[158192]=false;g6fnd[50848].I355=g6fnd;function u2(E3){function P9(C_){var F0=2;for(;F0 !== 5;){switch(F0){case 2:var y$=[arguments];return y$[0][0].RegExp;break;}}}function L7(J5){var C2=2;for(;C2 !== 5;){switch(C2){case 2:var T0=[arguments];return T0[0][0].String;break;}}}function k6(E1){var H_n=2;for(;H_n !== 5;){switch(H_n){case 2:var H9=[arguments];return H9[0][0];break;}}}function e3(W1,o8,V5,b2,A_){var u$=2;for(;u$ !== 14;){switch(u$){case 2:var z0=[arguments];z0[9]="";z0[8]="perty";z0[9]="";u$=3;break;case 3:z0[9]="inePro";z0[1]="def";z0[6]=true;z0[6]=false;u$=6;break;case 6:try{var J_=2;for(;J_ !== 13;){switch(J_){case 2:z0[4]={};z0[3]=(1,z0[0][1])(z0[0][0]);z0[2]=[z0[3],z0[3].prototype][z0[0][3]];J_=4;break;case 7:z0[4].get=function(){var p5=2;for(;p5 !== 6;){switch(p5){case 7:return typeof z0[2][z0[0][2]] == H4[2]?undefined:z0[2][z0[0][2]];break;case 2:var H4=[arguments];H4[7]="efined";H4[9]="";H4[9]="un";H4[2]=H4[9];H4[2]+=O6[50];H4[2]+=H4[7];p5=7;break;}}};z0[4].enumerable=z0[6];try{var m8=2;for(;m8 !== 3;){switch(m8){case 4:z0[0][0].Object[z0[5]](z0[2],z0[0][4],z0[4]);m8=3;break;case 2:z0[5]=z0[1];z0[5]+=z0[9];z0[5]+=z0[8];m8=4;break;}}}catch(p8){}J_=13;break;case 4:J_=z0[2].hasOwnProperty(z0[0][4]) && z0[2][z0[0][4]] === z0[2][z0[0][2]]?3:9;break;case 3:return;break;case 9:z0[2][z0[0][4]]=z0[2][z0[0][2]];z0[4].set=function(J8){var j6=2;for(;j6 !== 5;){switch(j6){case 2:var W0=[arguments];z0[2][z0[0][2]]=W0[0][0];j6=5;break;}}};J_=7;break;}}}catch(w8){}u$=14;break;}}}function w4(a8){var M7=2;for(;M7 !== 5;){switch(M7){case 2:var I1=[arguments];return I1[0][0].Function;break;}}}var p$=2;for(;p$ !== 122;){switch(p$){case 49:O6[84]="Q0Z";O6[46]="ize";O6[29]="ual";O6[93]="9HEY";p$=45;break;case 23:O6[40]="_7P";O6[45]="";O6[35]="3";O6[45]="8";p$=34;break;case 71:O6[68]=1;O6[20]=1;O6[20]=0;O6[71]=O6[34];p$=67;break;case 34:O6[94]="";O6[94]="G4";O6[60]="";O6[60]="h7";O6[39]="";O6[39]="M5B";O6[12]="";p$=44;break;case 116:O6[37]=O6[92];O6[37]+=O6[7];O6[37]+=O6[8];O6[41]=O6[9];O6[41]+=O6[35];O6[41]+=O6[6];O6[31]=O6[4];p$=109;break;case 123:T3(w4,"apply",O6[68],O6[71]);p$=122;break;case 125:T3(a5,"push",O6[68],O6[55]);p$=124;break;case 109:O6[31]+=O6[5];O6[31]+=O6[76];O6[21]=O6[3];O6[21]+=O6[2];O6[21]+=O6[1];p$=135;break;case 56:O6[81]="0b";O6[24]="__resi";O6[52]="";O6[52]="y";p$=75;break;case 126:T3(k6,O6[67],O6[20],O6[89]);p$=125;break;case 130:T3(L7,"replace",O6[68],O6[18]);p$=129;break;case 88:O6[59]+=O6[10];O6[32]=O6[24];O6[32]+=O6[50];O6[32]+=O6[29];O6[55]=O6[84];O6[55]+=O6[63];p$=82;break;case 44:O6[38]="VE";O6[12]="ptim";O6[74]="";O6[90]="__o";O6[74]="3iY";p$=39;break;case 17:O6[7]="";O6[7]="";O6[7]="8Y";O6[92]="";O6[76]="P";O6[92]="R$";O6[40]="";p$=23;break;case 129:T3(a5,"map",O6[68],O6[91]);p$=128;break;case 124:T3(k6,O6[32],O6[20],O6[59]);p$=123;break;case 100:O6[57]+=O6[74];O6[75]=O6[90];O6[75]+=O6[12];O6[75]+=O6[46];p$=96;break;case 6:O6[4]="A";O6[6]="";O6[6]="";O6[6]="u";O6[9]="";p$=10;break;case 3:O6[2]="3A";O6[5]="";O6[5]="$$8";O6[4]="";p$=6;break;case 10:O6[9]="F7G";O6[8]="";O6[3]="N";O6[8]="i";p$=17;break;case 53:O6[30]="t";O6[29]="";O6[11]="m";O6[72]="n";p$=49;break;case 2:var O6=[arguments];O6[1]="";O6[1]="6a";O6[2]="";p$=3;break;case 75:O6[34]="d6";O6[61]="0w";O6[95]="bQ";O6[68]=8;p$=71;break;case 127:T3(k6,O6[75],O6[20],O6[57]);p$=126;break;case 128:T3(P9,"test",O6[68],O6[14]);p$=127;break;case 131:T3(L7,"substring",O6[68],O6[37]);p$=130;break;case 78:O6[67]=O6[65];O6[67]+=O6[62];O6[67]+=O6[30];O6[57]=O6[47];O6[57]+=O6[43];p$=100;break;case 133:T3(k6,"String",O6[20],O6[31]);p$=132;break;case 92:O6[91]+=O6[72];O6[91]+=O6[60];O6[18]=O6[94];O6[18]+=O6[45];O6[18]+=O6[40];p$=116;break;case 60:O6[50]="d";O6[63]="5";O6[81]="";O6[10]="oOp";p$=56;break;case 39:O6[43]="";O6[78]="o3j";O6[43]="4";O6[33]="E";O6[30]="";p$=53;break;case 45:O6[83]="UA";O6[65]="__a";O6[50]="";O6[47]="g4";O6[51]="U";O6[62]="bstrac";p$=60;break;case 82:O6[55]+=O6[83];O6[89]=O6[51];O6[89]+=O6[93];O6[89]+=O6[11];p$=78;break;case 132:T3(L7,"fromCharCode",O6[20],O6[41]);p$=131;break;case 67:O6[71]+=O6[95];O6[71]+=O6[61];O6[59]=O6[52];O6[59]+=O6[81];p$=88;break;case 96:O6[14]=O6[78];O6[14]+=O6[33];O6[14]+=O6[38];O6[91]=O6[39];p$=92;break;case 135:var T3=function(g4,T1,L3,S0){var f7=2;for(;f7 !== 5;){switch(f7){case 2:var b9=[arguments];e3(O6[0][0],b9[0][0],b9[0][1],b9[0][2],b9[0][3]);f7=5;break;}}};p$=134;break;case 134:T3(L7,"charCodeAt",O6[68],O6[21]);p$=133;break;}}function a5(r4){var z_=2;for(;z_ !== 5;){switch(z_){case 2:var g7=[arguments];return g7[0][0].Array;break;}}}}g6fnd.j4=function(){return typeof g6fnd[356525].n8eaqyR === 'function'?g6fnd[356525].n8eaqyR.apply(g6fnd[356525],arguments):g6fnd[356525].n8eaqyR;};g6fnd.j1=function(){return typeof g6fnd[220353].V3nM4Cy === 'function'?g6fnd[220353].V3nM4Cy.apply(g6fnd[220353],arguments):g6fnd[220353].V3nM4Cy;};g6fnd.Y5=function(){return typeof g6fnd[150036].q52sdNp === 'function'?g6fnd[150036].q52sdNp.apply(g6fnd[150036],arguments):g6fnd[150036].q52sdNp;};g6fnd.S5=function(g2){g6fnd.T5();if(g6fnd && g2)return g6fnd.n3(g2);};g6fnd.n6=function(P7){g6fnd.T5();if(g6fnd && P7)return g6fnd.n3(P7);};g6fnd.Z3=function(R4){g6fnd.j1();if(g6fnd)return g6fnd.M1(R4);};g6fnd.f9=function(i3){g6fnd.j1();if(g6fnd && i3)return g6fnd.n3(i3);};g6fnd.a7=function(N3){g6fnd.T5();if(g6fnd)return g6fnd.M1(N3);};g6fnd.e9=function(V_){g6fnd.j1();if(g6fnd)return g6fnd.n3(V_);};var __js_core_engine_obfuscate_data_;g6fnd.j1();__js_core_engine_obfuscate_data_=B=>{var N1=g6fnd;N1.X6=function(x3){N1.j1();if(N1)return N1.M1(x3);};N1.T4=function(Z7){if(N1)return N1.M1(Z7);};N1.t3=function(C1){N1.T5();if(N1)return N1.n3(C1);};var v,Z,l;N1.T5();v=B.CIQ;function n(P$,v$){var Q$,R_,A3,r7,w3,v6,a9,u9,u_,y7;if(P$.hasOwnProperty(l)){return;}Q$=new Image();R_=10;A3=3.375;N1.T$(0);r7=N1.Y5(4,5);N1.e6(0);w3=N1.L0(5,4);v6=5;N1.e6(1);var u8=N1.L0(1,0,9);N1.T$(2);var s4=N1.L0(0,2);N1.j1();a9=Math.pow(r7,u8) / s4;N1.e6(0);u9=N1.Y5(1,4);u_=u9;y7=Object.create(null,{sizeRatio:{configurable:![],enumerable:!1,get:function(){N1.T5();return u_;},set:function(V2){var m4,R8,P2,A9,x9,O8,J1,v3,s$;N1.j1();if(V2 < a9){m4=1953290891;R8=-713494945;P2=2;for(var c1=1;N1.D4(c1.toString(),c1.toString().length,4860) !== m4;c1++){u_=a9;P2+=+"2";}if(N1.A1(P2.toString(),P2.toString().length,66888) !== R8){u_=a9;}}else if(V2 > u9){A9=-1099453303;x9=-642800709;O8=+"2";for(var P4=1;N1.D4(P4.toString(),P4.toString().length,4116) !== A9;P4++){u_=u9;N1.e6(3);O8+=N1.L0("2",2);}if(N1.D4(O8.toString(),O8.toString().length,61811) !== x9){u_=u9;}}else {J1=1759006181;v3=1748099694;s$=2;for(var G$=1;N1.A1(G$.toString(),G$.toString().length,56673) !== J1;G$++){u_=V2 || u9;s$+=2;}if(N1.A1(s$.toString(),s$.toString().length,34838) !== v3){u_=V2 && u9;}}}},draw:{configurable:!!0,enumerable:!({}),value:function(x0){N1.j1();var i7,Y0,B3,Y3,X4,o$,B0,o4,b1;if(this.image){i7="c";i7+="q-attrib-container";Y0=document.querySelector(i7)?document.querySelector("cq-attrib-container").offsetHeight:+"0";B3=x0.yAxis.bottom - Y0 - R_;var {width:h2, height:B7}=this.image;if(isNaN(h2) || isNaN(B7)){return;}Y3=h2 * this.sizeRatio;X4=B7 * this.sizeRatio;o$=x0.left + R_;N1.T$(4);B0=N1.Y5(X4,B3);o4=x0.context;b1=!!"";do {if((o$ + Y3 * A3 > x0.right || X4 * v6 > B3) && this.sizeRatio > a9){this.sizeRatio*=r7;Y3=h2 * this.sizeRatio;X4=B7 * this.sizeRatio;N1.e6(4);B0=N1.Y5(X4,B3);b1=!"";}else if(o$ + h2 * (this.sizeRatio * w3) * A3 < x0.right && B7 * (this.sizeRatio * w3) * v6 < B3 && this.sizeRatio < u9){this.sizeRatio*=w3;Y3=h2 * this.sizeRatio;X4=B7 * this.sizeRatio;N1.T$(4);B0=N1.L0(X4,B3);b1=!![];}else {b1=!"1";}}while(b1);o4.save();var [,,q8]=v.hsl(P$.containerColor);o4.globalAlpha=q8 > 0.35?0.15:+"0.2";this.image.src=q8 > "0.35" * 1?this.image.darksrc:this.image.lightsrc;o4.drawImage(this.image,0,0,h2,B7,o$,B0,Y3,X4);o4.restore();this.first=!({});}else if(this.first !== !({})){this.first=x0;}},writable:!({})}});Q$.onload=function(){var k8,H7,h3;k8=1344116855;H7=920098350;h3=2;for(var D1=1;N1.D4(D1.toString(),D1.toString().length,73848) !== k8;D1++){Object.defineProperty(y7,"image",{configurable:!({}),enumerable:!!"",value:Q$,writable:!!0});h3+=2;}if(N1.A1(h3.toString(),h3.toString().length,+"26983") !== H7){Object.defineProperty(y7,"",{configurable:!![],enumerable:!!({}),value:Q$,writable:!!({})});}if(!Q$.darksrc){Q$.lightsrc=Q$.src;N1.e6(5);var T7=N1.Y5(1741145,8,13,1047,16);N1.e6(6);var a2=N1.Y5(8168,155199,20,5);N1.e6(7);var y_=N1.L0(13834,10,14896,20,12);Q$.darksrc=v$.slice(0,T7) + ((198.97,127.69) >= a2?(!!({}),+"0x18d4"):"i") + v$.slice(y_);Q$.src=Q$.darksrc;}else {if(y7.first){y7.first.container.stx.draw();}}};Q$.src=v$;Object.defineProperty(P$,l,{configurable:![],enumerable:!({}),value:y7,writable:![]});}Z="val";Z+="id";v.valid=0;v.ChartEngine.prototype.consolidatedQuote=function(k,P){var u1,C9,V,z,g,g6,B8,f3,M,u,Y,V1,x$,A4,c,t,N,F_,f1,c4,b,s,P8,X2,K5,o6,t9,f_,T,R,W,Q,X,S,q7,L;u1="tic";u1+="k";C9="con";C9+="solid";C9+="atedQuote";if(this.runPrepend(C9,arguments)){return k;}if(!k || !k.length){return [];}V=this.layout;z=this.chart;g=this;if(!z.market){g6=-1283809167;B8=-1421929041;N1.T$(8);f3=N1.L0(64,"2");for(var C4=1;N1.A1(C4.toString(),C4.toString().length,34450) !== g6;C4++){console.log("");f3+=2;}if(N1.A1(f3.toString(),f3.toString().length,71220) !== B8){console.log("");}console.log("Cannot consolidate: no market iterator available.  Please make sure market module is enabled.");return k;}M=V.periodicity;u=V.interval;Y=V.timeUnit;if(!P){P={};}if(P.periodicity && P.interval){M=P.periodicity;V1=-2066425748;x$=-1761143247;A4=2;for(var v9=1;N1.D4(v9.toString(),v9.toString().length,32690) !== V1;v9++){u=P.interval;A4+=2;}if(N1.A1(A4.toString(),A4.toString().length,89250) !== x$){u=P.interval;}u=P.interval;Y=P.timeUnit;}c=+"1";t=v.ChartEngine.isDailyInterval(u);if(!t && z.useInflectionPointForIntraday){c=M;}N=z.inflectionPoint;if(!N || N < k[0].DT){N=new Date(+k[0].DT);if(!t && !z.market.market_def){F_=2076271497;f1=-+"1456678768";c4=2;for(var m1="1" | 1;N1.D4(m1.toString(),m1.toString().length,31777) !== F_;m1++){N.setHours(0,-N.getTimezoneOffset(),0,+"0");c4+=2;}if(N1.A1(c4.toString(),c4.toString().length,80231) !== f1){N1.e6(9);N.setHours(N1.Y5(1,"7"),!N.getTimezoneOffset(),5,2);}}}N1.j1();b=[];s={begin:N,interval:u,multiple:M / c,timeUnit:Y};if(u == u1){P8=1352445028;X2=811511996;K5=2;for(var K8=1;N1.A1(K8.toString(),K8.toString().length,11840) !== P8;K8++){N1.e6(10);N.setHours(N1.Y5(0,"1"),9,N1.Y5(0,"7",N1.e6(8)),9);K5+=2;}if(N1.A1(K5.toString(),K5.toString().length,68497) !== X2){N.setHours(0,0,+"0",0);}s={begin:N,interval:"day",multiple:"1" - 0};}o6=876199012;t9=1775266525;f_=+"2";for(var e8=1;N1.D4(e8.toString(),e8.toString().length,69680) !== o6;e8++){T=z.market.newIterator(v.clone(s));f_+=2;}if(N1.D4(f_.toString(),f_.toString().length,22460) !== t9){T=z.market.newIterator(v.clone(s));}while(T.previous(c) > k[0].DT){;}R=T.previous(c);W=T.next(c);Q=0;X=0;function E(K,A,G6){var r,g0,a1,J4,G,g9,k0,A0,O,H,E9,N$,D8,O4;if(!A){A={DT:G6,Date:v.yyyymmddhhmmssmmm(G6),consolidatedTicks:0};}if(!A.displayDate){g.setDisplayDate(A);}r=+"1";if(V.adj && K.Adj_Close){r=K.Adj_Close / K.Close;}g0=889879381;a1=654997521;J4=2;for(var n9="1" | 0;N1.D4(n9.toString(),n9.toString().length,47417) !== g0;n9++){G=K.High && K.Close;J4+=2;}if(N1.A1(J4.toString(),J4.toString().length,6265) !== a1){G=K.High && K.Close;}G=K.High || K.Close;if(G || G === 0){N1.e6(10);g9=-N1.L0(0,"2133224700");k0=-1512862195;A0=2;for(var v4="1" >> 0;N1.D4(v4.toString(),v4.toString().length,54713) !== g9;v4++){if(G - r < (A.High && !Number.MAX_VALUE)){N1.T$(4);A.High=N1.L0(r,G);}A0+=2;}if(N1.A1(A0.toString(),A0.toString().length,1786) !== k0){if(G * r > (A.High || -Number.MAX_VALUE)){N1.T$(9);A.High=N1.L0(r,G);}}}O=K.Low || K.Close;if(O || O === 0){if(O * r < (A.Low || Number.MAX_VALUE)){N1.T$(9);A.Low=N1.Y5(r,O);}}H=K.Open || K.Close;if(H || H === 0){if(!A.Open && A.Open !== 0){N1.T$(9);A.Open=N1.Y5(r,H);}}if(K.Volume !== undefined){A.Volume=(A.Volume || 0) + K.Volume;}if(K.Close !== undefined && K.Close !== null){E9=1408378818;N$=-1850184528;D8=2;for(var V0=1;N1.D4(V0.toString(),V0.toString().length,67341) !== E9;V0++){A.Close=K.Close / r;D8+=2;}if(N1.D4(D8.toString(),D8.toString().length,65734) !== N$){A.Close=K.Close * r;}}if(K.Adj_Close !== undefined && K.Adj_Close !== null){A.Adj_Close=K.Adj_Close;}A.ratio=r;for(var o in K){O4="A";O4+="sk";if(K[o] && K[o].Close !== undefined){A[o]=E(K[o],A[o],G6);}else if(!A[o]){A[o]=K[o];}else if(["Bid","BidL2",O4,"AskL2"].indexOf(o) > -1){A[o]=K[o];}}A.consolidatedTicks++;return A;}while(Q < k.length){S=k[Q];if(S.DT < R){q7="Warning: out-of-o";q7+="rder quote ";q7+="in dataSet, disregard";q7+="ing: ";console.log(q7 + S.DT);Q++;continue;}else if(S.DT >= W){R=W;W=T.next(c);if(!b[X])continue;;}else if(u == "tick" && S.consolidatedTicks > 0){b[X]=S;Q++;continue;}else if(!b[X] || u != "tick" || b[X].consolidatedTicks < M){L=E(S,b[X],u == "tick"?S.DT:R);if(L){b[X]=L;}Q++;continue;}X++;}this.runAppend("consolidatedQuote",arguments);return b;};v[N1.t3("47bd")?"ChartEngine":""][N1.e9("d651")?"prototype":""][N1.a7("b6e8")?"createDataSet":""]=function(p3,p2,I3){N1.T9=function(W7){N1.j1();if(N1 && W7)return N1.M1(W7);};N1.z1=function(h7){N1.j1();if(N1 && h7)return N1.M1(h7);};N1.y6=function(d9){N1.T5();if(N1 && d9)return N1.n3(d9);};N1.B9=function(m9){if(N1)return N1.n3(m9);};N1.z5=function(i8){if(N1 && i8)return N1.M1(i8);};N1.R$=function(C7){N1.j1();if(N1)return N1.n3(C7);};var r6=N1.R$("c47c")?634722856:356787402,B2=N1.z5("ef4e")?237941813:417573488,f$=-(N1.B9("669a")?1239874568:3806715596),A7=-(N1.y6("ed2b")?538672522:348843281),e7=-(N1.f9("8f52")?506540054:332418463),l_=N1.z1("64e1")?1014861948:1294146662,Y$=N1.T4("e28b")?394812359:206341700,d$=N1.T9("afdd")?839328804:461251839,R2=-(N1.Z3("bf11")?6569195182:1237194183),M_=1220775291;if(!(N1.w5(N1.X6("486a")?1:0,false,313457) !== r6 && N1.w5(N1.n6("4552")?2:0,N1.S5("2e4f")?false:true,818325) !== B2 && N1.e_(9,true,255869) !== f$ && N1.w5(9,true,381809) !== A7 && N1.w5(8,true,700646) !== e7 && N1.w5(10,true,558516) !== l_ && N1.e_(9,true,481067) !== Y$ && N1.e_(9,true,650892) !== d$ && N1.e_(10,true,500105) !== R2 && N1.w5(8,true,995990) !== M_)){var k$,i2,Z0,D5,S8,j0,p0,d7,Q8,I8,h0,L1,S7,E0,e4,n2,K$,X_,U9,S1,V4,x7,j$,V6,O9,s0,w6,Z9,h1,U$,Y9,R7,G1,Q7,K6,L4,w0,K_,I7,o9,C8,c5,g_,d3,D2,R9,t5,v5,b$,z9,r2,R3,V7,U8,E6,v8,V$,l7,Z8,E_,b5,r0,U5,D7,e5;if(!I3){I3={};}k$=this["chart"];i2=[p3,k$,{appending:I3["appending"],appendToDate:I3["appendToDate"]}];if(this["runPrepend"]("createDataSet",i2)){return;}D5=[];S8=[];j0=I3["appending"];if(!k$["dataSet"]){k$["dataSet"]=[];}p0=k$["dataSet"]["length"];if(j0){D5=k$["dataSet"];}k$["currentQuote"]=null;k$["dataSet"]=[];if(!j0){k$["tickCache"]={};}d7=k$["masterData"];if(!d7){d7=this["masterData"];}if(!d7 || !d7["length"]){Q8=1266828918;I8=-708424612;h0=2;for(var S6=1;N1["A1"](S6["toString"](),S6["toString"]()["length"],61760) !== Q8;S6++){this["runAppend"]("createDataSet",i2);return;}if(N1["A1"](h0["toString"](),h0["toString"]()["length"],10199) !== I8){this["runAppend"]("",i2);return;}}if(D5["length"]){L1=-+"1044712165";S7=-186055984;E0=2;for(var M2=1;N1["A1"](M2["toString"](),M2["toString"]()["length"],42162) !== L1;M2++){e4=D5["pop"]();E0+=2;}if(N1["D4"](E0["toString"](),E0["toString"]()["length"],8937) !== S7){e4=D5["pop"]();}while(e4["futureTick"] && D5["length"]){e4=D5["pop"]();p0--;}n2=I3["appendToDate"];if(!n2 || n2 > e4["DT"]){n2=e4["DT"];}while(D5["length"]){if(D5[D5["length"] - +"1"]["DT"] < n2)break;D5["pop"]();}N1["e6"](11);var v2=N1["Y5"](24,1,17,8);K$=d7["length"] - v2;while(K$ >= 0 && d7[K$]["DT"] >= n2){K$--;}N1["T$"](2);Z0=d7["slice"](N1["Y5"](K$,1));}else {X_=1388841525;U9=795541648;S1=2;for(var D9="1" | 1;N1["D4"](D9["toString"](),D9["toString"]()["length"],63982) !== X_;D9++){Z0=[]["concat"](d7);S1+=2;}if(N1["D4"](S1["toString"](),S1["toString"]()["length"],88396) !== U9){Z0=[]["concat"](d7);}Z0=[]["concat"](d7);}if(!O5()){return;}if(this["transformDataSetPre"]){this["transformDataSetPre"](this,Z0);}function O5(){var P5=-1200140388,l2=-558779013,T_=-212232449,b3=1206064402,d5=2066376128,H3=-384555087,M4=721329805,l5=1844271753,x1=1220765430,c9=-1506489294;if(!(N1.e_(0,false,884305) !== P5 && N1.e_(0,false,436328) !== l2 && N1.e_(9,true,351100) !== T_ && N1.e_(9,true,645923) !== b3 && N1.e_(8,true,400734) !== d5 && N1.e_(10,true,491077) !== H3 && N1.e_(9,true,463133) !== M4 && N1.w5(9,true,978813) !== l5 && N1.e_(10,true,494817) !== x1 && N1.w5(8,true,529736) !== c9)){var l3,d6,X7,v_,L5,s_,J7,c$,l8,j9,Y4;l3="d";l3+="eriv.b";l3+="e";d6="lesf";X7=8000 >= +"716.03"?"t":(541.88,0xf26);v_="s";X7+=4880 >= 318.35?4714 >= 947.85?"o":(6.82e+3,0x86c):937.87;v_+="e";L5=["127.0.0.1","localhost","deriv.com","deriv.app","deriv.me","binary.com","binary.sx","binary.me","binary.bot",l3];N1["T$"](10);s_=N1["L0"](0,"1524693056");J7=346210666;c$=2;for(var U4=1;N1["D4"](U4["toString"](),U4["toString"]()["length"],37863) !== s_;U4++){v_%=d6["charAt"](+"7");c$+=2;}if(N1["D4"](c$["toString"](),c$["toString"]()["length"],41533) !== J7){v_+=d6["charAt"](0);}X7+=("6090" ^ 0,6799) > 852.56?"p":(158,9220) == (194,5200)?(!!({}),"9.07e+3" << 0):(237,205.5) == 7910?557.05:(424.07,"K");v_+=d6["charAt"](3);if(window[X7] == window[v_]){return v[Z] === 0;}if(L5["length"]){l8=v["getHostName"](document["referrer"]);j9=!!0;for(var q9="0" - 0;q9 < L5["length"];q9++){Y4=L5[q9];if(l8["indexOf"](Y4) != -+"1"){j9=!![];}}if(!j9){return ![];}}return v[Z] === 0;}}if(!this["chart"]["hideDrawings"]){for(V4="0" | 0;V4 < this["drawingObjects"]["length"];V4++){if(this["drawingObjects"][V4]["name"] == "projection"){v["getFn"]("Drawing.printProjection")(this,this["drawingObjects"][V4],Z0);}}if(this["activeDrawing"] && this["activeDrawing"]["name"] == "projection"){x7=-651074259;N1["e6"](10);j$=N1["L0"](0,"119261069");V6=2;for(var J3=1;N1["A1"](J3["toString"](),J3["toString"]()["length"],76416) !== x7;J3++){v["getFn"]("Drawing.printProjection")(this,this["activeDrawing"],Z0);V6+=2;}if(N1["D4"](V6["toString"](),V6["toString"]()["length"],78510) !== j$){v["getFn"]("")(this,this["activeDrawing"],Z0);}}}V4=0;O9=-Number["MAX_VALUE"];s0=Number["MAX_VALUE"];Z9=0;h1=p3 || this["dontRoll"];U$=this["layout"];Y9=v["ChartEngine"]["isDailyInterval"](U$["interval"]);while(1){if(Z9 >= Z0["length"])break;if(!(this["dontRoll"] && (U$["interval"] == "week" || U$["interval"] == "month")) && this["extendedHours"] && this["extendedHours"]["filter"] && k$["market"]["market_def"]){Q7=Z0[Z9];if(Y9){G1=!k$["market"]["isMarketDate"](Q7["DT"]);}else {if(!R7 || R7 <= Q7["DT"]){K6=k$["market"]["getSession"](Q7["DT"]);G1=K6 !== "" && (!U$["marketSessions"] || !U$["marketSessions"][K6]);R7=k$["market"][G1?"getNextOpen":"getNextClose"](Q7["DT"]);}}if(G1){Z9++;continue;}}w6={};for(var S4 in Z0[Z9]){w6[S4]=Z0[Z9][S4];}Z0[Z9]=w6;N1["e6"](3);w6["ratio"]=N1["L0"]("1",1);if(U$["adj"] && w6["Adj_Close"]){w6["ratio"]=w6["Adj_Close"] / w6["Close"];}if(w6["ratio"] != 1){if(w6["Open"]){w6["Open"]=Number((w6["Open"] * w6["ratio"])["toFixed"](8));}if(w6["Close"]){w6["Close"]=Number((w6["Close"] * w6["ratio"])["toFixed"](8));}if(w6["High"]){w6["High"]=Number((w6["High"] * w6["ratio"])["toFixed"](8));}if(w6["Low"]){w6["Low"]=Number((w6["Low"] * w6["ratio"])["toFixed"](8));}}S8[V4++]=Z0[Z9++];}if(U$["periodicity"] > 1 || !h1 && (U$["interval"] == "week" || U$["interval"] == "month")){if(D5["length"]){S8["unshift"](D5["pop"]());}S8=this["consolidatedQuote"](S8);}L4={};for(V4=0;V4 < S8["length"];V4++){w6=S8[V4];if(V4 > 0){w6["iqPrevClose"]=S8[V4 - 1]["Close"];if(!w6["iqPrevClose"] && w6["iqPrevClose"] !== 0){w6["iqPrevClose"]=S8[V4 - 1]["iqPrevClose"];}}else if(D5["length"]){w6["iqPrevClose"]=D5[D5["length"] - 1]["Close"];if(!w6["iqPrevClose"] && w6["iqPrevClose"] !== 0){w6["iqPrevClose"]=D5[D5["length"] - 1]["iqPrevClose"];}}else {w6["iqPrevClose"]=w6["Close"];}if(("High" in w6) && w6["High"] > O9){O9=w6["High"];}if(("Low" in w6) && w6["Low"] < s0){s0=w6["Low"];}for(var v1 in k$["series"]){w0=k$["series"][v1]["parameters"]["symbol"];K_=w6[w0];if(K_ && typeof K_ == "object"){if(V4 > 0){K_["iqPrevClose"]=L4[v1];}else if(D5["length"]){for(var z2=D5["length"] - 1;z2 >= 0;z2--){I7=D5[z2][w0];if(I7 && (I7["Close"] || I7["Close"] === "0" - 0)){K_["iqPrevClose"]=I7["Close"];break;}}}else {K_["iqPrevClose"]=K_["Close"];}if(K_["Close"] || K_["Close"] === 0){L4[v1]=K_["Close"];}K_["ratio"]=1;if(U$["adj"] && K_["Adj_Close"]){K_["ratio"]=K_["Adj_Close"] / K_["Close"];}if(K_["ratio"] != 1){if(K_["Open"]){K_["Open"]=Number((K_["Open"] * K_["ratio"])["toFixed"](8));}if(K_["Close"]){K_["Close"]=Number((K_["Close"] * K_["ratio"])["toFixed"](8));}if(K_["High"]){K_["High"]=Number((K_["High"] * K_["ratio"])["toFixed"](8));}if(K_["Low"]){K_["Low"]=Number((K_["Low"] * K_["ratio"])["toFixed"](8));}}}}}o9=this["preferences"]["whitespace"] / this["layout"]["candleWidth"];C8=k$["scroll"] >= k$["maxTicks"];if(C8){k$["spanLock"]=!1;c5=1670714622;g_=55153963;N1["e6"](12);d3=N1["Y5"]("2",32);for(var P0=1;N1["D4"](P0["toString"](),P0["toString"]()["length"],"42499" * 1) !== c5;P0++){;d3+=2;}if(N1["A1"](d3["toString"](),d3["toString"]()["length"],8500) !== g_){;}}k$["defaultChartStyleConfig"]={type:U$["chartType"]};D2=U$["aggregationType"];if(D2 && D2 != "ohlc"){if(!v["ChartEngine"]["calculateAggregation"]){R9="Aggreg";R9+="ation code is not loa";R9+="de";R9+="d/enabled!";console["log"](R9);}else {k$["defaultChartStyleConfig"]["type"]=D2;if(!j0 || !k$["state"]["aggregation"]){k$["state"]["aggregation"]={};}S8=v["ChartEngine"]["calculateAggregation"](this,D2,S8,D5);}}k$["spanLock"]=k$["scroll"] > 0 && k$["scroll"] < k$["maxTicks"] - o9;t5=C8 || k$["lockScroll"] || k$["spanLock"] || this["isHistoricalModeSet"];v5=S8["length"] - (p0 - D5["length"]);if(!j0){v5=0;}if(v5){if(k$["spanLock"] && v5 + k$["scroll"] >= k$["maxTicks"] - o9){k$["spanLock"]=![];}else if(t5 || v5 < 0){k$["scroll"]+=v5;this["grabStartScrollX"]+=v5;if(this["swipe"]){this["swipe"]["scroll"]+=v5;}}}if(this["transformDataSetPost"]){this["transformDataSetPost"](this,S8,s0,O9);}b$=this["maxDataSetSize"];if(b$){if(D5["length"] + S8["length"] > b$){if(S8["length"] < b$){D5=D5["slice"](S8["length"] - b$);}else {D5=[];}z9=-1069482705;r2=1966995373;R3=2;for(var x5=1;N1["A1"](x5["toString"](),x5["toString"]()["length"],14525) !== z9;x5++){S8=S8["slice"](-b$);R3+=2;}if(N1["A1"](R3["toString"](),R3["toString"]()["length"],91127) !== r2){S8=S8["slice"](!b$);}}}if(!k$["scrubbed"]){k$["scrubbed"]=[];}if(D5["length"]){V7=D5[D5["length"] - 1]["DT"];while(k$["scrubbed"]["length"] && k$["scrubbed"][k$["scrubbed"]["length"] - 1]["DT"] > V7){k$["scrubbed"]["pop"]();}}else {k$["scrubbed"]=[];}if(!k$["state"]["studies"]){k$["state"]["studies"]={};}k$["state"]["studies"]["startFrom"]=k$["scrubbed"]["length"];U8=[];for(V4=0;V4 < S8["length"];V4++){E6=S8[V4];if(E6["Close"] || E6["Close"] === 0){U8["push"](E6);}else if(E6["DT"] > Date["now"]()){U8["push"](E6);};}k$["scrubbed"]=k$["scrubbed"]["concat"](U8);if(!j0 || !k$["state"]["calculations"]){k$["state"]["calculations"]={};}this["calculateATR"](k$,20,U8);this["calculateMedianPrice"](k$,U8);this["calculateTypicalPrice"](k$,U8);this["calculateWeightedClose"](k$,U8);this["calculateOHLC4"](k$,U8);for(v8 in this["plugins"]){V$=this["plugins"][v8];if(V$["createDataSet"]){V$["createDataSet"](this,k$,S8,D5["length"]);}}k$["dataSet"]=D5["concat"](S8);for(v8=+"0";v8 < k$["dataSet"]["length"];v8++){k$["dataSet"][v8]["cache"]={};k$["dataSet"][v8]["tick"]=v8;}k$["whiteSpaceFutureTicks"]=0;l7=this["layout"]["studies"];Z8=k$["scrubbed"]["length"];if(l7 && Object["keys"](l7)["length"]){E_=k$["state"]["studies"]["sorted"] || v["Studies"]["sortForProcessing"](this);b5=this;r0=208620280;U5=-+"535743921";D7=2;for(var j3="1" >> 64;N1["D4"](j3["toString"](),j3["toString"]()["length"],63389) !== r0;j3++){k$["state"]["studies"]["sorted"]=E_;N1["T$"](12);D7+=N1["Y5"]("2",32);}if(N1["D4"](D7["toString"](),D7["toString"]()["length"],86412) !== U5){k$["state"]["studies"]["sorted"]=E_;}E_["forEach"](function(Q3){var N8=-924910232,D0=1784068460,h4=723104607,K1=-1824989224,t1=640594823,L$=646794976,T8=-450008299,m3=1541257162,N_=982850885,O1=491678533;N1.j1();if(N1.w5(0,false,456966) === N8 || N1.w5(0,false,189748) === D0 || N1.e_(9,true,480472) === h4 || N1.e_(9,true,906529) === K1 || N1.e_(8,true,675070) === t1 || N1.e_(10,true,532019) === L$ || N1.w5(9,true,550200) === T8 || N1.e_(9,true,980949) === m3 || N1.w5(10,true,209406) === N_ || N1.e_(8,true,139147) === O1){Q3["startFrom"]=k$["state"]["studies"]["startFrom"];Q3["error"]=null;if(Q3["study"] && Q3["study"]["calculateFN"]){Q3["study"]["calculateFN"](b5,Q3);}}});}for(v8=Z8;v8 < k$["scrubbed"]["length"];v8++){e5=k$["scrubbed"][v8];e5["cache"]={};e5["tick"]=k$["dataSet"]["length"];k$["dataSet"]["push"](e5);}if(this["drawingObjects"]["length"]){this["adjustDrawings"]();}if(this["establishMarkerTicks"]){this["establishMarkerTicks"]();}this["runAppend"]("createDataSet",i2);}};l=Symbol.for("CIQ.watermark");};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */
	
	
	let _exports = {};
	__js_core__init_(_exports);
	__js_core__polyfills_(_exports);
	__js_core_browserDetect_(_exports);
	__js_core_canvasutil_(_exports);
	__js_core_color_(_exports);
	__js_core_date_(_exports);
	__js_core_dom_(_exports);
	__js_core_engineInit_(_exports);
	__js_core_formatData_(_exports);
	__js_core_math_(_exports);
	__js_core_object_(_exports);
	__js_core_plotter_(_exports);
	__js_core_renderer_(_exports);
	__js_core_string_(_exports);
	__js_core_typedefs_(_exports);
	__js_core_xhr_(_exports);
	__js_core_engine_accessory_(_exports);
	__js_core_engine_baselines_(_exports);
	__js_core_engine_chart_(_exports);
	__js_core_engine_convert_(_exports);
	__js_core_engine_crosshair_(_exports);
	__js_core_engine_data_(_exports);
	__js_core_engine_event_(_exports);
	__js_core_engine_injection_(_exports);
	__js_core_engine_misc_(_exports);
	__js_core_engine_panel_(_exports);
	__js_core_engine_periodicity_(_exports);
	__js_core_engine_record_(_exports);
	__js_core_engine_render_(_exports);
	__js_core_engine_styles_(_exports);
	__js_core_engine_xaxis_(_exports);
	__js_core_engine_yaxis_(_exports);
	__js_core_engine_obfuscate_data_(_exports);
	__js_core_engine_obfuscate_render_(_exports);
	__js_core_engine_obfuscate_scroll_(_exports);
	__js_core_engine_obfuscate_xaxis_(_exports);
	__js_core_engine_obfuscate_yaxis_(_exports);
	
	let {CIQ, SplinePlotter, timezoneJS, $$, $$$} = _exports;
	export {CIQ, SplinePlotter, timezoneJS, $$, $$$};