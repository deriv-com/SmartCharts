/**
 *	8.0.0
 *	Generation date: 2020-08-13T16:06:53.665Z
 *	Client name: binary ltd
 *	Package Type: Technical Analysis
 *	License type: annual
 *	Expiration date: "2021/04/01"
 *	Domain lock: ["127.0.0.1","localhost","binary.com","binary.sx","binary.me","binary.bot","deriv.com","deriv.bot","deriv.app"]
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
 * READ ONLY. Will be 'true' if the chart is running on a Edge browser
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
CIQ.isSurface = CIQ.touchDevice && (CIQ.isEdge || CIQ.isIE);
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
 * @param {CIQ.ChartEngine} [stx] The chartEngine
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
	var parameters={
		topBand: "Leading Span A " + sd.name,
		bottomBand: "Leading Span B " + sd.name,
		topColor: "green",
		bottomColor: "red"
	};
	CIQ.fillIntersecting(stx, sd.panel, parameters)
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
	sctx.drawImage(contextCanvas, 0, 0);
	CIQ.clearCanvas(contextCanvas, stx);

	//then fill the intersections
	var alpha = 0.3;
	if (parameters.opacity) alpha = parameters.opacity;
	context.save();
	context.globalCompositeOperation = "xor";

	var params = {
		band: topBand,
		subField: topSubBand,
		color: topColor,
		opacity: 1,
		panelName: panel.name,
		yAxis: parameters.topAxis,
		skipTransform: parameters.skipTransform,
		tension: parameters.tension,
		roundOffEdges: true
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
	context.globalAlpha = alpha;
	context.globalCompositeOperation = "copy";
	context.scale(
		1 / stx.adjustedDisplayPixelRatio,
		1 / stx.adjustedDisplayPixelRatio
	);
	context.drawImage(contextCanvas, 0, 0);

	//finally, restore what we copied, but _under_ the intersected fills we just made
	context.globalAlpha = 1;
	context.globalCompositeOperation = "destination-over";
	context.drawImage(scratchCanvas, 0, 0);

	context.restore();
};

/**
 * Draws an item in the legend and returns the position for the next item
 * @param {CIQ.ChartEngine} stx The chart object
 * @param  {array} xy    An X,Y tuple (from chart.legend)
 * @param  {string} label The text to print in the item
 * @param  {string} color The color for the background of the item
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
 * @param  {number} opacity The 'alpha' value. Defaults to full opacity (100%)
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
	var m = dt.getMonth() + 1;
	if (m < 10) m = "0" + m;
	var d = dt.getDate();
	if (d < 10) d = "0" + d;
	var h = dt.getHours();
	if (h < 10) h = "0" + h;
	var mn = dt.getMinutes();
	if (mn < 10) mn = "0" + mn;
	return "" + dt.getFullYear() + "/" + m + "/" + d + " " + h + ":" + mn;
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
 * Displays a date according to the current chart settings and periodicity. It will format the date according to the folllowing order:
 * 1. xAxis formatter
 * 2. Internationalization
 * 3. default
 * 		a. Daily: mm-dd-yyyy
 * 		b. Intraday: mm/dd hh:mm[:ss[:ms]]
 *
 * This method is used in {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} to format the floating label over the x axis,
 * and can be overitten as needed to achieve the desired results.
 *
 * @param  {CIQ.ChartEngine} stx	  The charting object
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @param  {date} dt 	JavaScript date
 * @return {string}		Formatted date
 * @memberof CIQ
 * @since 4.0.0
 */
CIQ.displayableDate = function (stx, chart, dt) {
	function twoPlaces(val) {
		if (val < 10) return "0" + val;
		return val;
	}
	var displayableDate = "";
	var interval = stx.layout.interval;
	var isDaily = CIQ.ChartEngine.isDailyInterval(interval);
	if (chart.xAxis.formatter) {
		displayableDate = chart.xAxis.formatter(dt);
	} else if (stx.internationalizer) {
		displayableDate = stx.internationalizer.monthDay.format(dt);
		if (!isDaily)
			displayableDate += " " + stx.internationalizer.hourMinute.format(dt);
		else {
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
			displayableDate = interval == "month" ? m + "-" : m + "-" + d + "-";
			displayableDate += dt.getFullYear();
		} else {
			displayableDate = m + "/" + d + " " + h + ":" + mn;
			var isSecond =
				(chart.xAxis.activeTimeUnit &&
					chart.xAxis.activeTimeUnit <= CIQ.SECOND) ||
				stx.layout.timeUnit == "second";
			var isMS =
				(chart.xAxis.activeTimeUnit &&
					chart.xAxis.activeTimeUnit <= CIQ.MILLISECOND) ||
				stx.layout.timeUnit == "millisecond";
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
 * Shorthand for getElementById(). Equivalent to prototype style $() which is faster but less powerful than jquery style $()
 * @param  {string} id     An ID tag for a valid DOM object
 * @param  {object} [source] - An optional valid DOM node to search within. If not provided then the entire document will be searched.
 * @return {object}        The DOM node associated with the id or null if it is not found
 * @name  $$
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
 * Functional equivalent of querySelector(). Functionally equivalent to jquery $().
 * This uses querySelectorAll in order to maintain compatibility with IE 9.
 * Note that if multiple objects match the selector then only the first will be returned.
 * @param  {string} selector - CSS style selector
 * @param  {object} [source]   Optional node to select within. If not provided then entire document will be searched.
 * @return {object}          The first object to match the selector
 * @name  $$$
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
 * Returns the width of a DOM element including left and right margins.
 * @param  {HTMLElement} node The DOM element to measure
 * @return {number}      The width including margins
 * @memberof CIQ
 */
CIQ.outerWidth = function (node) {
	var width = node.offsetWidth;
	width += CIQ.stripPX(getComputedStyle(node).marginLeft);
	width += CIQ.stripPX(getComputedStyle(node).marginRight);
	return width;
};

/**
 * Removes all DOM elements in a given node. This is extremely useful when dynamically generating content.
 * @param  {object} node - The node to clear
 * @memberof CIQ
 */
CIQ.clearNode = function (node) {
	if (node.hasChildNodes()) {
		while (node.childNodes.length >= 1) {
			node.removeChild(node.firstChild);
		}
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
 * @param  {number} x    Absolute screen X position of point
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
 * Sets a member or style for a DOM element only if it isn't already set.
 * This is more efficient than blindly updating the DOM.
 * @param  {HTMLElement} node  Node to update
 * @param  {string} member The DOM member to update
 * @param  {string} value The value to set
 * @memberOf  CIQ
 * @since  4.0.0
 */
CIQ.efficientDOMUpdate = function (node, member, value) {
	if (node[member] !== value) node[member] = value;
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
 * This method is guaranteed to only be called once when a user mouses over an object. @see CIQ#safeMouseOut
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
 * Converts an object to emit "stxtap" events. This uses {@link CIQ#safeClickTouch}. You should use addEventListener("tap") to receive the events.
 * @param {HTMLElement} div The element to convert
 * @param {object} [params] Parameters to pass to {@link CIQ#safeClickTouch}
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
		})
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
 * Convenience function for selecting the closest parent element matching a selector.
 *
 * Use instead of `jQuery.closest()`.
 *
 * @param {node} el The starting element
 * @param {string} selector CSS style selector to match parent element
 * @return {node} Parent element matching selector parameter, or null if no match is found
 * @memberof CIQ
 * @since 7.3.0
 */
CIQ.findClosestParent = function (el, selector) {
	var matchesFn;
	// find vendor prefix
	[
		"matches",
		"webkitMatchesSelector",
		"mozMatchesSelector",
		"msMatchesSelector",
		"oMatchesSelector"
	].some(function (fn) {
		if (typeof document.body[fn] == "function") {
			matchesFn = fn;
			return true;
		}
		return false;
	});
	if (!matchesFn) return false;
	var parent;
	// traverse parents
	while (el) {
		parent = el.parentElement;
		if (parent && parent[matchesFn](selector)) {
			return parent;
		}
		el = parent;
	}
	return null;
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
CIQ.localStorage = typeof localStorage !== "undefined" ? localStorage : {};

/**
 * Set once after user is alerted that private browsing is enabled
 * @memberof CIQ
 * @type boolean
 */
CIQ.privateBrowsingAlert = false;

/**
 * Convenience function for storing a name value pair in local storage. This will detect if private browsing is enabled
 * because localStorage is inoperable under private browsing
 * @param  {string} name  Name to store
 * @param  {string} value Value to store
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
	 * Holds the HTML control elements managed by the chart. Usually this will be a copy of the default [htmlControls]{@link CIQ.ChartEngine#htmlControls}.
	 * These are not the GUI elements around the chart, but rather the HTML elements that the library will directly interact with on the canvas
	 * for things like panel resizing, study edit controls, zooming controls, etc. See {@link CIQ.ChartEngine#htmlControls} for more details.
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
	this.currentVectorParameters = CIQ.clone(
		CIQ.ChartEngine.currentVectorParameters
	); // contains the current drawing parameters for this chart
	/**
	 * Holds {@link CIQ.ChartEngine.Chart} object
	 * @type object
	 * @default
	 * @alias chart
	 * @memberof 	CIQ.ChartEngine
	 * @instance
	 */
	var chart = (this.chart = new CIQ.ChartEngine.Chart());
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
/**
 * Each CIQ.ChartEngine object will clone a copy of this object template and use it to store the settings for the active drawing tool.
 * The default settings can be changed by overriding these defaults on your own files.
 * See {@tutorial Custom Drawing Toolbar} for details on how to use this template to replace the standard drawing toolbar.
 * <br>This object can be extended to support additional drawing tools (for instance note the extensive customization capabilities for fibonacci)
 * @type {object}
 * @alias currentVectorParameters
 * @static
 * @memberof CIQ.ChartEngine
 */
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
		 * Called by {@link CIQ.ChartEngine.AdvancedInjectable#touchDoubleClick} when the chart is quickly tapped twice.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback doubleTapEventListener
		 * @param {object} data Data relevant to the "tap" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {number} data.finger Which finger double tapped
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 * @since 4.0.0
		 */
		doubleTap: [],
		/**
		 * Called by {@link CIQ.ChartEngine#doubleClick} when the chart is quickly clicked or
		 * tapped twice.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}.
		 *
		 * @param {object} data Data relevant to the double-click or double-tap event.
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance.
		 * @param {number} data.button The button or finger that double-clicked or
		 * 		double-tapped.
		 * @param {number} data.x The double-click or crosshairs x-axis position.
		 * @param {number} data.y The double-click or crosshairs y-axis position.
		 *
		 * @callback doubleClickEventListener
		 * @since 8.0.0
		 */
		doubleClick: [],
		/**
		 * Called when a drawing is added, removed or modified.
		 *
		 * Such as calling {@link CIQ.ChartEngine#clearDrawings}, {@link CIQ.ChartEngine#removeDrawing}, {@link CIQ.ChartEngine#undoLast}, {@link CIQ.ChartEngine#drawingClick}
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback drawingEventListener
		 * @param {object} data Data relevant to the "drawing" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.symbol The current chart symbol
		 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
		 * @param {object} data.layout The chart's layout object (CIQ.ChartEngine.layout)
		 * @param {array} data.drawings The chart's current drawings (CIQ.Drawing)
		 */
		drawing: [],
		/**
		 * A right-click on a highlighted drawing.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback drawingEditEventListener
		 * @param {object} data Data relevant to the "drawingEdit" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {CIQ.Drawing} data.drawing The highlighted drawing instance
		 */
		drawingEdit: [],
		/**
		 * Called when a change occurs in the chart layout.
		 *
		 * Such as calling {@link CIQ.ChartEngine#setChartType}, {@link CIQ.ChartEngine#setAggregationType}, {@link CIQ.ChartEngine#setChartScale}, {@link CIQ.ChartEngine#setAdjusted},
		 * {@link WebComponents.cq-toggle}, using the {@link WebComponents.cq-toolbar} to disable the current active drawing tool or toggling the crosshair,
		 * using the {@link WebComponents.cq-views} to activate a serialized layout, [modifying a series]{@link CIQ.ChartEngine#modifySeries},
		 * setting a new [periodicity]{@link CIQ.ChartEngine#setPeriodicity}, adding or removing a [study overlay]{@link CIQ.ChartEngine.AdvancedInjectable#removeOverlay},
		 * adding or removing any new panels (and they corresponding studies), [zooming in]{@link CIQ.ChartEngine#zoomIn} or [zooming out]{@link CIQ.ChartEngine#zoomOut},
		 * setting ranges with {@link CIQ.ChartEngine#setSpan} or {@link CIQ.ChartEngine#setRange}, nullifying a programmatically set Span or Range by user panning,
		 * enabling or disabling [Extended Hours]{@linkCIQ.ExtendedHours} or toggling the [range slider]{@link CIQ.RangeSlider}.
		 *
		 * **Note that scrolling and panning changes are not considered a layout change but rather a shift of the view window in the same layout.
		 * To detect those you can register to listen for [`scroll` events]{@link scrollEventListener}**
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback layoutEventListener
		 * @param {object} data Data relevant to the "layout" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.symbol The current chart symbol
		 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
		 * @param {object} data.layout The chart's layout object (CIQ.ChartEngine.layout)
		 * @param {array} data.drawings The chart's current drawings (CIQ.Drawing)
		 */
		layout: [],
		/**
		 * Called when the mouse is clicked on the chart and held down.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback longholdEventListener
		 * @param {object} data Data relevant to the "longhold" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.panel The panel being tapped
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 */
		longhold: [],
		/**
		 * Called when the pointer is moved inside the chart, even on panning or horizontal swiping.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback moveEventListener
		 * @param {object} data Data relevant to the "move" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.panel The panel where the mouse is active
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 * @param {boolean} data.grab True if the chart is being dragged
		 */
		move: [],
		/**
		 * Called when the [quotefeed interface](quotefeed.html) loads a complete data set as
		 * a result of:
		 * - [symbol changes]{@link CIQ.ChartEngine#loadChart}
		 * - [periodicity]{@link CIQ.ChartEngine#setPeriodicity},
		 * [range]{@link CIQ.ChartEngine#setRange}, or [span]{@link CIQ.ChartEngine#setSpan}
		 * changes requiring new data
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}.
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
		 * @callback newChartEventListener
		 * @since 8.0.0 Added the `upToDate` parameter.
		 */
		newChart: [],
		/**
		 * Called when preferences are changed.
		 *
		 * Such as {@link CIQ.ChartEngine#setTimeZone}, {@link CIQ.ChartEngine#importPreferences},
		 * {@link CIQ.Drawing.saveConfig}, {@link CIQ.Drawing.restoreDefaultConfig} or language changes using the {@link WebComponents.cq-language-dialog}.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback preferencesEventListener
		 * @param {object} data Data relevant to the "preferences" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.symbol The current chart symbol
		 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
		 * @param {object} data.layout The chart's layout object (CIQ.ChartEngine.layout)
		 * @param {array} data.drawingObjects The chart's current drawings (CIQ.ChartEngine.drawingObjects)
		 */
		preferences: [],
		/**
		 * Called on "mouseup" after the chart is right-clicked.
		 *
		 * Note that by default right clicks are only captured when mousing over chart objects such as series and drawings.
		 * To enable right-click anywhere on the chart, the "contextmenu" event listener must be modified as follows:
		 * ```
		 * document.removeEventListener("contextmenu", CIQ.ChartEngine.handleContextMenu);
		 * document.addEventListener("contextmenu", function(e){if(!e) e=event; if(e.preventDefault) e.preventDefault();return false});
		 * ```
		 *
		 * See {@link CIQ.ChartEngine#addEventListener} and {@link CIQ.ChartEngine.handleContextMenu}
		 * @callback rightClickEventListener
		 * @param {object} data Data relevant to the "rightClick" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} panel The panel that was clicked on
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 * @example <caption> Will trigger and provide location and details when clicking on a series:</caption>
		 * stxx.addEventListener("tap", function(tapObject){
		 *     if( this.anyHighlighted ) {
		 * 		for(var n in this.chart.seriesRenderers){
		 * 			var r=this.chart.seriesRenderers[n];
		 * 			for(var j=0;j<r.seriesParams.length;j++){
		 * 				series=r.seriesParams[j];
		 * 				if( series.highlight ) {
		 * 				    var bar = this.barFromPixel(tapObject.x);
		 * 				    if(this.chart.dataSegment[bar]) {
		 * 						// replace console.log with your required logic as needed.
		 * 						console.log('Tap event at pixel x: ' + tapObject.x + ' y: '+ tapObject.y);
		 * 						console.log('Price:', this.priceFromPixel(tapObject.y), ' Date: ', this.chart.dataSegment[bar].DT);
		 * 						console.log('Series Details: ',JSON.stringify(series));
		 * 				    }
		 * 				}
		 * 			}
		 * 		}
		 *     }
		 * });
		 *
		 */
		rightClick: [],
		/**
		 * Called when the chart is panned and scrolled in any direction or is horizontally swiped.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback scrollEventListener
		 * @param {object} data Data relevant to the "scroll" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.panel The panel where the mouse is active
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 * @since 6.3.0
		 */
		scroll: [],
		/**
		 * Called when an overlay-type study is right-clicked.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback studyOverlayEditEventListener
		 * @param {object} data Data relevant to the "studyOverlayEdit" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {object} data.sd The study object studyDescriptor
		 * @param {object} data.inputs The inputs from the studyDescriptor
		 * @param {object} data.outputs The outputs from the studyDescriptor
		 * @param {object} data.parameters The parameters from the studyDescriptor
		 * @example
		 * stxx.addEventListener("studyOverlayEdit", function(studyData){
		 *	  CIQ.alert(studyData.sd.name);
		 *	  var helper=new CIQ.Studies.DialogHelper({name:studyData.sd.type,stx:studyData.stx});
		 *	  console.log('Inputs:',JSON.stringify(helper.inputs));
		 *	  console.log('Outputs:',JSON.stringify(helper.outputs));
		 *	  console.log('Parameters:',JSON.stringify(helper.parameters));
		 *	  // call your menu here with the  data returned in helper
		 *	  // modify parameters as needed and call addStudy or replaceStudy
		 * });
		 */
		studyOverlayEdit: [],
		/**
		 * Called when a panel-type study is edited.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback studyPanelEditEventListener
		 * @param {object} data Data relevant to the "studyPanelEdit" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {object} data.sd The study object studyDescriptor
		 * @param {object} data.inputs The inputs from the studyDescriptor
		 * @param {object} data.outputs The outputs from the studyDescriptor
		 * @param {object} data.parameters The parameters from the studyDescriptor
		 */
		studyPanelEdit: [],
		/**
		 * Called when the chart's symbols change. Including secondary series and underlying symbols for studies ( ie. price relative study)
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback symbolChangeEventListener
		 * @param {object} data Data relevant to the "symbolChange" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.symbol The new chart symbol
		 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
		 * @param {string} data.action An action type being performed on the symbol. Possible options:
		 *	- `add-series` - A series was added
		 *	- `master` - The master symbol was changed
		 *	- `remove-series` - A series was removed
		 */
		symbolChange: [],
		/**
			 * Called when a symbol is imported into the layout. Including secondary series and underlying symbols for studies ( ie. price relative study)

			 * It is not called by other types of symbol changes.
			 *
			 * See {@link CIQ.ChartEngine#importLayout}
			 *
			 * See {@link CIQ.ChartEngine#addEventListener}
			 * @callback symbolImportEventListener
			 * @param {object} data Data relevant to the "symbolImport" event
			 * @param {CIQ.ChartEngine} data.stx The chart engine instance
			 * @param {string} data.symbol The new chart symbol
			 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
			 * @param {string} data.action An action type being performed on the symbol. Possible options:
			 *   - `add-series` - A series was added
			 *   - `master` - The master symbol was changed
			 *   - `remove-series` - A series was removed
			 */
		symbolImport: [],
		/**
		 * Called on ["mouseup"]{@link CIQ.ChartEngine.AdvancedInjectable#touchSingleClick} when the chart is tapped.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback tapEventListener
		 * @param {object} data Data relevant to the "tap" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.panel The panel being tapped
		 * @param {number} data.x The crosshair x position
		 * @param {number} data.y The crosshair y position
		 */
		tap: [],
		/**
		 * Called when a new theme is activated on the chart.
		 *
		 * Such as theme changes using the {@link WebComponents.cq-theme-dialog} or {@link WebComponents.cq-themes} initialization.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback themeEventListener
		 * @param {object} data Data relevant to the "theme" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {string} data.symbol The current chart symbol
		 * @param {object} data.symbolObject The symbol's value and display label (CIQ.ChartEngine.chart.symbolObject)
		 * @param {object} data.layout The chart's layout object (CIQ.ChartEngine.layout)
		 * @param {array} data.drawingObjects The chart's current drawings (CIQ.ChartEngine.drawingObjects)
		 */
		theme: [],
		/**
		 * Called when an undo stamp is created for drawing events.
		 *
		 * See {@link CIQ.ChartEngine#undoStamp}
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}
		 * @callback undoStampEventListener
		 * @param {object} data Data relevant to the "undoStamp" event
		 * @param {CIQ.ChartEngine} data.stx The chart engine instance
		 * @param {array} data.before The chart's array of drawingObjects before the change
		 * @param {array} data.after The chart's array of drawingsObjects after the change
		 */
		undoStamp: []
	};
	this.longHoldTime = 700;
};

var prototypeSwitches = {
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
	 * - {@link rightClickEventListener}
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
	 * @default false
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
	 * @default false
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
	 * @type boolean
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
	 * stxx.animations.zoom=new CIQ.EaseMachine(Math.easeOutCubic,1);
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
		 * @alias layout[`interval`]
		 * @memberof! CIQ.ChartEngine#
		 */
		interval: "day",
		/**
		 * READ ONLY. Number of periods per interval/timeUnit
		 *
		 * See the [Periodicity and Quote feed]{@tutorial Periodicity} tutorial.
		 * @type number
		 * @default
		 * @alias layout[`periodicity`]
		 * @memberof! CIQ.ChartEngine#
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
			     * @alias layout[`timeUnit`]
			     * @memberof! CIQ.ChartEngine#
				 */
		timeUnit: null,
		/**
		 * READ ONLY. Candle Width In pixels ( see {@tutorial Understanding Chart Range} and {@link CIQ.ChartEngine#candleWidthPercent})
		 * @type number
		 * @default
		 * @alias layout[`candleWidth`]
		 * @memberof! CIQ.ChartEngine#
		 */
		candleWidth: 8,
		/**
		 * READ ONLY. The primary y-axis and all linked drawings, series and studies will display inverted (flipped) from its previous state when 'true'.
		 *
		 * Use {@link CIQ.ChartEngine#flipChart} to set.
		 * @type boolean
		 * @default
		 * @alias layout[`flipped`]
		 * @memberof! CIQ.ChartEngine#
		 */
		flipped: false,
		volumeUnderlay: false,
		/**
		 * Whether adjusted or nominal prices are being displayed.
		 * If true then the chart will look for "Adj_Close" in the masterData as an alternative to "Close".
		 * @type boolean
		 * @default
		 * @alias layout[`adj`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`crosshair`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`chartType`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`extended`]
		 * @memberof! CIQ.ChartEngine#
		 */
		extended: false,
		/**
		 * READ ONLY. Tracks the extended market sessions to display on the chart.
		 *
		 * See {@link CIQ.ExtendedHours} and {@link CIQ.Market} for more details on how extended hours are set and used.
		 * @type object
		 * @default
		 * @alias layout[`marketSessions`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`aggregationType`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`chartScale`]
		 * @memberof! CIQ.ChartEngine#
		 */
		chartScale: "linear",
		/**
		 * READ ONLY. List of [study descriptors]{@link studyDescriptor} for the active studies on the chart.
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
		 * @alias layout[`studies`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias layout[`panels`]
		 * @memberof! CIQ.ChartEngine#
		 */
		panels: {},
		setSpan: {},
		/**
		 * READ ONLY. Specifies whether outlier detection is enabled. A value of true enables
		 * detection; false disables detection.
		 *
		 * See {@link CIQ.Outliers} for information on how outlier detection is used.
		 *
		 * @type Boolean
		 * @default false
		 * @alias layout[`outliers`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`currentPriceLine`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`dragging`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`drawings`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`highlightsRadius`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`highlightsTapRadius`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`magnet`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`horizontalCrosshairField`]
		 * @memberof! CIQ.ChartEngine#
		 * @since 04-2016-08
		 */
		horizontalCrosshairField: null,
		/**
		 * Set to true to display labels on y-axis for line based studies using {@link CIQ.Studies.displayIndividualSeriesAsLine} or {@link CIQ.Studies.displaySeriesAsLine} (this is overridden by the particular y-axis setting of {@link CIQ.ChartEngine.YAxis#drawPriceLabels}).
		 * This flag is checked inside these 2 functions to decide if a label should be set, as such if you do not wish to have a label on a particular study line, you can set this flag to `false`, before calling the function, and then back to `true`.
		 * @type boolean
		 * @default
		 * @alias preferences[`labels`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`language`]
		 * @memberof! CIQ.ChartEngine#
		 * @since 4.0.0
		 */
		language: null,
		/**
		 * Stores the preferred timezone for the display of the x axis labels.
		 *
		 * It is automatically set and can be individually restored by {@link CIQ.ChartEngine#setTimeZone}.
		 * @type {string}
		 * @alias preferences[`timezone`]
		 * @memberof! CIQ.ChartEngine#
		 * @since 4.0.0
		 */
		timeZone: null,
		/**
		 * Initial whitespace on right of the screen in pixels.
		 * @type number
		 * @default
		 * @alias preferences[`whitespace`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`zoomInSpeed`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`zoomOutSpeed`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias preferences[`zoomAtCurrentMousePosition`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias streamParameters[`maxWait`]
		 * @memberof! CIQ.ChartEngine#
		 * @example
		 * // update without any time interval delay.
		 * stxx.streamParameters.maxWait=0;
		 */
		maxWait: 1000,
		/**
		 * ticks to wait before allowing update to occur (if this condition is met, the update will occur and all pending ticks will be loaded - exclusive of maxWait)
		 * @type number
		 * @default
		 * @alias streamParameters[`maxTicks`]
		 * @memberof! CIQ.ChartEngine#
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
		 * @alias autoPickCandleWidth[`turnOn`]
		 * @memberof! CIQ.ChartEngine#
		 */
		turnOn: false,

		/**
		 * Set if you want to set a specific candle width when using {@link CIQ.ChartEngine#setRange}.
		 * This will require a valid {@link CIQ.ChartEngine#dynamicRangePeriodicityMap}.
		 * Set to '0' if you want the candle width to be determined according to chart type
		 * @type number
		 * @default
		 * @alias autoPickCandleWidth[`candleWidth`]
		 * @memberof! CIQ.ChartEngine#
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
 * Converts a future month to the month index or vice versa.  Month indexes begin with 1 for January
 * @param  {char} x 	The value to convert.  If numeric, will convert to Future month letter.  If Alpha, will convert to month index.
 * @return {char} 		Converted value
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
 * var stxx=new CIQ.ChartEngine({container:$(".chartContainer")[0], preferences:{labels:false, currentPriceLine:true, whitespace:0}});
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
		if (!endPoints.end || endPoints.end <= m[label].DT) {
			endPoints.end = m[label].DT;
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
 * @param  {boolean} isLog - True if the chart is in log scale and linear values are passed in
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
		 * @memberof CIQ.Plotter
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
		 * @memberof CIQ.Plotter
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
					width,
					colorOrStyle.borderTopStyle
				);
			this.seriesArray.push(series);
			this.seriesMap[name] = series;
		},
		/**
		 * Clear out any moves or text stored in the plotter for series "name"
		 * @memberof CIQ.Plotter
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
		 * @memberof CIQ.Plotter
		 */
		moveTo: function (name, x, y) {
			var series = this.seriesMap[name];
			series.moves.push({ action: "moveTo", x: x, y: y });
		},
		/**
		 * @memberof CIQ.Plotter
		 */
		lineTo: function (name, x, y) {
			var series = this.seriesMap[name],
				pattern = series.pattern;
			series.moves.push({ action: "lineTo", x: x, y: y, pattern: pattern });
		},
		/**
		 * @memberof CIQ.Plotter
		 */
		dashedLineTo: function (name, x, y, pattern) {
			var series = this.seriesMap[name];
			series.moves.push({ action: "lineTo", x: x, y: y, pattern: pattern });
		},
		/**
		 * @memberof CIQ.Plotter
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
		 * @memberof CIQ.Plotter
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
		 * @memberof CIQ.Plotter
		 */
		addText: function (name, text, x, y, backgroundColor, width, height) {
			var series = this.seriesMap[name];
			series.text.push({ text: text, x: x, y: y, bg: backgroundColor });
		},
		/**
		 * Renders the text objects. This is done after drawing primitives for each series.
		 * @private
		 * @memberof CIQ.Plotter
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
		 * @memberof CIQ.Plotter
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
 * @param  {function} fc The function to register
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
	if (eraseData) {
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
 * Creates a Lines renderer.
 *
 * This renderer will draw lines of various color, thickness and pattern on a chart.
 *
 * The Lines renderer is used to create the following drawing types: line, mountain, baseline, wave, step chart, and colored versions of these.
 * Note: by default the renderer will display lines as underlays. As such, they will appear below any other studies or drawings.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
 * @param {object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @param  {number} [config.params.width] Width of the rendered line
 * @param  {string} [config.params.type="line"] Type of rendering "line", "mountain", ["wave"]{@link CIQ.ChartEngine#drawWaveChart}
 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
 * @param  {boolean} [config.params.highlightable=true] Set to false to prevent selection of series via hover
 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
 * @param  {boolean} [config.params.step] Specifies a step chart
 * @param  {boolean} [config.params.baseline] Specifies a baseline chart
 * @param  {boolean} [config.params.colored] Specifies the use of a colorFunction to dictate color of the segment
 * @param  {boolean} [config.params.vertex] Specifies drawing a dot on every vertex
 * @param  {boolean} [config.params.vertex_color] Specifies a color for the vertices.  If omitted, will use defaultColor.
 * @param  {string} [config.params.colorFunction] Override string (or function) used to determine color of bar.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
 *
 * Common valid parameters for use by attachSeries. See also {@link CIQ.ChartEngine#plotLine}:<br>
 * `color` - Specify the color for the line in rgba, hex or by name.<br>
 * `pattern` - Specify the pattern as an array. For instance [5,5] would be five pixels and then five empty pixels.<br>
 * `width` - Specify the width of the line.<br>
 * `baseColor` - Specify the color of the base of a mountain.<br>
 * `fillStyle` - Specify an alternate color to fill a mountain (other than `color`).<br>
 *
 * @constructor
 * @name  CIQ.Renderer.Lines
 * @since
 * - 4.0.0 New `config.params.useChartLegend` added.
 * - 5.1.0 Removed subtype parameter, this will be determined internally from `config.params.step=true`.
 * - 5.1.0 Added `highlightable`, `overChart`, `step`, `baseline`, `vertex`, `style`, `colored`, and `colorFunction` parameters.
 *
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
 *
 * @example
	// This is an example on how completely remove a renderer and all associated data.
	// This should only be necessary if you are also removing the chart itself.

	// remove all series from the renderer including series data from the masterData
	renderer.removeAllSeries(true);

	// detach the series renderer from the chart.
	stxx.removeSeriesRenderer(renderer);

	// delete the renderer itself.
	renderer=null;
 *
 * @example
 	// Colored step baseline mountain with vertices
	var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params:{name:"my-renderer", type:"mountain", baseline:true, step:true, colored:true, vertex:true, yAxis:axis}}));
 *
 */
CIQ.Renderer.Lines = function (config) {
	this.construct(config);
	var params = this.params;
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
};
CIQ.inheritsFrom(CIQ.Renderer.Lines, CIQ.Renderer, false);

/**
 * Returns a new Lines renderer if the featureList calls for it
 * FeatureList should contain whatever features requested; valid features:
 * 	line, mountain, baseline (delta), step, vertex, colored, wave
 * Anything else is an invalid feature and will cause function to return null
 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series
 * @param {array} featureList List of rendering terms requested by the user, parsed from the chartType
 * @param {object} [config.params] Parameters used for the series to be created, used to create the renderer
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
 * @param {object} [config.params] Parameters used for the series to be created, used to create the renderer
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
		{
			type: "histogram",
			drawType: "histogram",
			style: "stx_histogram_up",
			condition: CANDLEUP,
			fill: "fill_color_up",
			border: "border_color_up",
			useColorInMap: true,
			useBorderStyleProp: true
		},
		{
			type: "histogram",
			drawType: "histogram",
			style: "stx_histogram_down",
			condition: CANDLEDOWN,
			fill: "fill_color_down",
			border: "border_color_down",
			useColorInMap: true,
			useBorderStyleProp: true
		},
		{
			type: "histogram",
			drawType: "histogram",
			style: "stx_histogram_even",
			condition: CANDLEEVEN,
			fill: "fill_color_even",
			border: "border_color_even",
			skipIfPass: true,
			useColorInMap: true,
			useBorderStyleProp: true
		},
		{
			type: "candle",
			drawType: "shadow",
			style: "stx_candle_shadow",
			border: "border_color_up"
		},
		{
			type: "candle",
			drawType: "shadow",
			style: "stx_candle_shadow_up",
			condition: CANDLEUP,
			border: "border_color_up"
		},
		{
			type: "candle",
			drawType: "shadow",
			style: "stx_candle_shadow_down",
			condition: CANDLEDOWN,
			border: "border_color_down"
		},
		{
			type: "candle",
			drawType: "shadow",
			style: "stx_candle_shadow_even",
			condition: CANDLEEVEN,
			border: "border_color_even",
			skipIfPass: true
		},
		{
			type: "candle",
			drawType: "candle",
			style: "stx_candle_up",
			condition: CANDLEUP,
			fill: "fill_color_up",
			border: "border_color_up",
			useColorInMap: true,
			useBorderStyleProp: true
		},
		{
			type: "candle",
			drawType: "candle",
			style: "stx_candle_down",
			condition: CANDLEDOWN,
			fill: "fill_color_down",
			border: "border_color_down",
			useColorInMap: true,
			useBorderStyleProp: true
		}
	];
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
 * @param {HtmlElement} el Element to append the UI content to; the default is `document.body`.
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
 * @param {function} cb Callback function to call when the script is loaded.
 * @param {boolean} isModule If true, the script loads a module.
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
	s.parentNode.insertBefore(script, s.nextSibling);
};

/**
 * Loads a stylesheet.
 * @param  {string}   stylesheet Name of stylesheet file.
 * @param  {Function} cb     Function to call when the stylesheet is fully loaded
 * @since 2016-03-11
 * @memberof CIQ
 */
CIQ.loadStylesheet = function (widget, cb) {
	var lnk = document.createElement("link");
	lnk.rel = "stylesheet";
	lnk.type = "text/css";
	lnk.media = "screen";
	lnk.href = widget + (widget.indexOf("?") === -1 ? "?" : "&") + Date.now();
	lnk.onload = function () {
		if (this.loaded) return; //undocumented IE Edge bug, css files load twice.  This to prevent double-triggering of onload, which may load html file twice.
		this.loaded = true;
		if (cb) cb();
	};
	var links = document.getElementsByTagName("link");
	var lastLink = links[links.length - 1];
	lastLink.parentNode.insertBefore(lnk, lastLink.nextSibling);
};

/**
 * Loads a feature function widget. Feature function widgets consist of a CSS file, a
 * JavaScript file, and an HTML file.
 *
 * Use this function to dynamically load content and functionality.
 *
 * @param {string} widget Name of the widget to load. The widget's JavaScript, CSS, and HTML
 * 		files should have this name.
 * @param {HtmlElement} el Element to which to append the UI content. The default is
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
	var c = this.chart.container;
	for (var control in CIQ.ChartEngine.htmlControls) {
		if (
			typeof this.chart[control] == "undefined" &&
			typeof this.controls[control] == "undefined"
		) {
			if (!this.allowZoom && control == "chartControls") continue;
			var el = c.querySelector("." + control);
			if (el) {
				this.chart[control] = el;
				this.controls[control] = el;
			} else {
				var rawHTML = CIQ.ChartEngine.htmlControls[control];
				if (!rawHTML) continue;
				var div = document.createElement("DIV");
				div.innerHTML = rawHTML;
				el = div.firstChild;
				c.appendChild(el);
				this.chart[control] = el;
				this.controls[control] = el;
				el.classList.add(control);
			}
		}
	}
	var chartControls = this.controls.chartControls,
		home = this.controls.home;
	if (chartControls) {
		var zoomIn = chartControls.querySelector(".stx-zoom-in");
		var zoomOut = chartControls.querySelector(".stx-zoom-out");

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
 * To disable stickies, set that element to null. See {@link CIQ.ChartEngine#htmlControls}.
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
			if (mouseDeleteInstructions)
				mouseDeleteInstructions.style.display = "block";
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
	.currentMeasure {
		text-align: left;
		display: inline-block;
		margin: 4px 0 0 20px;
		height: 20px;
		line-height: 20px;
	}

	.mMeasure {
		display: inline-block;
		margin: 0 0 0 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width:140px;
	}
	@example
	// This is an example of the framework to use for writing a prepend to further manipulate/display the measurements
	CIQ.ChartEngine.prototype.prepend("setMeasure",function(){

		var m=document.querySelector(".mMeasure");

		if(!m) return; // cant show a measurement if the div is not present.

	 	// add your logic to manage the display of the measurements (price1, price2, tick1, tick2)
	 	//*****************************************
	 	var message = 'blah measurement';
	 	//*****************************************

		m.innerHTML=message;

		if(this.activeDrawing) return;		// Don't show measurement Sticky when in the process of drawing

		m=this.controls.mSticky;
		if (m) {
			var mStickyInterior=m.querySelector(".mStickyInterior");
			if(hover){
				m.style.display="inline-block";
				mStickyInterior.style.display="inline-block";
				if(price1){
					mStickyInterior.innerHTML=message;
				}
				this.positionSticky(m);
			}else{
				m.style.display="none";
				mStickyInterior.innerHTML="";
			}
		}

	 //return true; //if you don't want to continue into the regular function
	 //return false; //if you want to run through the standard function once you are done with your custom code.
	});
 */
CIQ.ChartEngine.prototype.setMeasure = function (
	price1,
	price2,
	tick1,
	tick2,
	hover
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
		 * Set this to presnet an alternate name for the symbol on the chart label and comparison legend.
		 * You can set  `stxx.chart.symbolDisplay='yourName'; ` right before calling `loadChart()`.
		 * Alternatively, a good place to set it is in your fetch function, if using {@link quotefeed}. See example.
		 * @type string
		 * @default
		 * @memberof CIQ.ChartEngine.Chart#
		 * @example
		 * // on your inital data fetch call add the following
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
		 * @type {object}
		 * @memberof CIQ.ChartEngine.Chart#
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
		 * @type object
		 * @alias baseline
		 * @inner
		 * @memberof! CIQ.ChartEngine.Chart#
		 */
		baseline: {
			/**
			 * includeInDataSegment - If set to true, forces a line chart (usually a baseline chart) to begin inside the chart,
			 *                        whereas normally the first point in a line chart is off the left edge of the screen.
			 * @type boolean
			 * @default
			 * @inner
			 * @alias baseline[`includeInDataSegment`]
			 * @memberof! CIQ.ChartEngine.Chart#
			 */
			includeInDataSegment: false,
			/**
			 * defaultLevel - If set to a value, overrides the default behavior of baseline chart
			 *                which is to set baseline to leftmost point visible on the chart.
			 * @type number
			 * @default
			 * @inner
			 * @alias baseline[`defaultLevel`]
			 * @memberof! CIQ.ChartEngine.Chart#
			 */
			defaultLevel: null,
			/**
			 * userLevel - Value of the user-set baseline level.  To prevent user from adjusting the baseline,
			 *             set this property to false.
			 * @type boolean|number
			 * @default
			 * @alias baseline[`userLevel`]
			 * @memberof! CIQ.ChartEngine.Chart#
			 */
			userLevel: null,
			/**
			 * actualLevel - This is computed automatically.  Do not set.
			 * @type number
			 * @default
			 * @alias baseline[`actualLevel`]
			 * @memberof! CIQ.ChartEngine.Chart#
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
		 * If set to `true` the y-axes width will be automatically set based on the length of the displayed prices.
		 *
		 * In order to prevent constant resizing of the y-axis, dynamicWidth will start at the initial width set ( {@link CIQ.ChartEngine.YAxis#width} )
		 * and continue to grow as you zoom and pan to ensure all digits are in view.
		 * It will only shrink back to the initial width when key events happen, such as removing a study or series, changing the instrument, etc.
		 *
		 * Works on all axis attached to a chart.
		 *
		 * Also see [resetDynamicYAxis]{@link CIQ.ChartEngine.AdvancedInjectable#resetDynamicYAxis}
		 * @type boolean
		 * @memberof CIQ.ChartEngine.Chart#
		 * @since 5.1.1
		 */
		dynamicYAxis: false,
		roundit: 100, // Computed automatically to round y-axis display
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
		 * @alias customChart
		 * @memberof! CIQ.ChartEngine.Chart#
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
 * Returns the X pixel give the location of a bar (dataSegment) on the chart.
 * @param  {number} bar The bar (position on the chart which is also the position in the dataSegment)
 * @param {CIQ.ChartEngine.Chart} [chart] Which chart to use. Defaults to this.chart.
 * @return {number}		The X pixel on the chart
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
 * Positions the crosshairs at the last known mouse/finger pointer position. This ensures
 * on touch devices that the crosshairs are at a known position. It is called by the DrawingToolbar.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias positionCrosshairsAtPointer
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
 * This is an internal method that makes the crosshair visible based on where the user's mouse pointer is located. It should not be called directly.
 *
 * - Crosshairs will only be made visible if enabled, unless a drawing tool is active;
 * in which case they will be displayed automatically regardless of state.
 * - When the user moves the mouse out of the chart, or over a modal, the crosshairs are automatically made invisible using {@link CIQ.ChartEngine.AdvancedInjectable#undisplayCrosshairs}
 * - To temporarily hide/show an enabled crosshair for other reasons use {@link CIQ.ChartEngine#showCrosshairs} and {@link CIQ.ChartEngine#hideCrosshairs}
 * 	 * - If at any point the z-index of the crosshair is higher than the subholder element, then it will register that at the time of the event target and will not register properly.
 * 	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias doDisplayCrosshairs
 * @since 5.0.0 no longer allows the crosshair to be enabled if mouse pointer is outside the chart.
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
 * This is an internal method that makes the crosshairs invisible when the user mouses out of the chart or over a chart control.
 * It should not be called drectly.
 *
 * See {@link CIQ.ChartEngine.AdvancedInjectable#doDisplayCrosshairs} for more details.
 *
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias undisplayCrosshairs
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
 * Use this method to temporarily hide an enabled crosshair.
 * Usually as part of a custom drawing or overlay to prevent the crosshair to display together with the custom rendering.
 *
 * See <a href="CIQ.ChartEngine.html#layout%5B%60crosshair%60%5D">CIQ.ChartEngine.layout.crosshair</a> to enable/disable the crosshair.
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.hideCrosshairs = function () {
	this.displayCrosshairs = false;
};

/**
 * Re-displays a crosshair temporarily hidden by {@link CIQ.ChartEngine#hideCrosshairs}
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
 * @param {boolean} [parameters.stretchToFillScreen]Increase the candleWidth to fill the left-side gap created by a small dataSet. Respects <a href="CIQ.ChartEngine.html#preferences%5B%60whitespace%60%5D">CIQ.ChartEngine.preferences.whitespace</a>. Ignored when params `span` or `range` are used.  See {@link CIQ.ChartEngine#fillScreen}
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

	var chart = parameters.chart || this.chart;
	var layout = this.layout,
		periodicity = parameters.periodicity;
	if (periodicity) {
		var internalPeriodicity = CIQ.cleanPeriodicity(
			periodicity.period ? periodicity.period : periodicity.periodicity,
			periodicity.interval,
			periodicity.timeUnit
		);
		layout.interval = internalPeriodicity.interval;
		layout.periodicity = internalPeriodicity.period;
		layout.timeUnit = internalPeriodicity.timeUnit;
	}

	var prevSymbol = chart.symbol;
	var prevSymbolObject = CIQ.clone(chart.symbolObject);
	var prevMarket = chart.market;
	var prevMasterData = chart.masterData;
	var prevDataSet = chart.dataSet;
	var prevMoreAvailable = chart.moreAvailable;
	var prevUpToDate = chart.upToDate;
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
		var marketDef = this.marketFactory(chart.symbolObject);
		this.setMarket(marketDef, chart);
	}

	this.setMainSeriesRenderer(true);

	var setSpan = parameters.span;
	var range = parameters.range;
	// no range or span passed into parameters, check layout
	if (!range && !setSpan && layout) {
		setSpan = !layout.range ? layout.setSpan : {};
		range = layout.range || {};
	}
	// both passed into parameters, range takes precedence
	else if (range && setSpan) {
		setSpan = {};
	}

	this.clearCurrentMarketData(chart);

	var self = this;
	if (!parameters.masterData && this.quoteDriver) {
		var onsymbol = function (err) {
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
			self.dispatch(self.currentlyImporting ? "symbolImport" : "symbolChange", {
				stx: self,
				symbol: chart.symbol,
				symbolObject: chart.symbolObject,
				prevSymbol: prevSymbol,
				prevSymbolObject: prevSymbolObject,
				action: "master"
			});
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
		} else if (setSpan && setSpan.base && this.setSpan) {
			setSpan.multiplier = setSpan.multiplier || 1;
			// force a new chart to be initialized and new data fetched before calling setSpan to conform with the expectations and purpose of loadChart,
			// and not use existing data and symbol names.
			this.chart.masterData = null;
			this.displayInitialized = false;
			// periodicity will be kept if sent as a parameter.
			if (periodicity) setSpan.maintainPeriodicity = true;
			setSpan.forceLoad = true;
			this.setSpan(setSpan, onsymbol);
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
		var masterData = this.doCleanupGaps(parameters.masterData, chart);
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
		} else if (setSpan && setSpan.multiplier && setSpan.base && this.setSpan) {
			this.setSpan({
				maintainPeriodicity: true,
				multiplier: setSpan.multiplier,
				base: setSpan.base
			});
		} else if (parameters.stretchToFillScreen) {
			this.fillScreen();
		} else if (masterData && masterData.length) {
			this.home();
		} else {
			this.clear();
		}
		this.adjustPanelPositions(); // to ensure holders are adjusted for current yaxis height
		self.dispatch(self.currentlyImporting ? "symbolImport" : "symbolChange", {
			stx: self,
			symbol: chart.symbol,
			symbolObject: chart.symbolObject,
			prevSymbol: prevSymbol,
			prevSymbolObject: prevSymbolObject,
			action: "master"
		});
		if (callback) callback.call(self);
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
		var dataSegment = (chart.dataSegment = []);
		var position = dataSet.length - 1 - scroll - 1; // One more to deal with -1 case
		var prevField = chart.defaultPlotField;
		for (var i = -1; i < scroll && i < maxTicks; i++) {
			position++;
			if (i == -1 && !dataSegmentStartsOneBack) continue;
			if (position < dataSet.length && position >= 0) {
				quote = dataSet[position];
				quote.candleWidth = null;
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
			var totalVolume = 0;
			var workingWidth =
				chart.width - (maxTicks - dataSegment.length - 1) * layout.candleWidth;
			for (var v = 0; v < dataSegment.length; v++) {
				quote = dataSegment[v];
				if (quote) totalVolume += quote.Volume || 1;
			}
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
 * @param {object} params Parameters object.
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
			if (params["include-parameters"]) obj.parameters = parameters;
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
 * @param {string} dataZone	   A chatIQ supported timezone. This should represent the time zone that the master data comes from, or set to 'null' if your dates are already time zone aware.
 * @param {string} displayZone A chatIQ supported timezone. This should represent the time zone that the user wishes displayed, or set to null to use the browser time zone.
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
  stxx.updateChartData(
    {
      Last: 50.94,
      Volume: 90
    }
  );
 * @example
 * // this example will stream the last price on to the appropriate bar and set the volume for that bar to 90.
  stxx.updateChartData(
    {
      Last: 50.94,
      Volume: 90
    },
    null,
    {useAsLastSale: {aggregatedVolume:true}}
  );
 * @example
 * // this example will stream the last price to the appropriate bar  **for a secondary series**.
  stxx.updateChartData(
    {
      Last: 50.94
    },
    null,
    {secondarySeries:secondarySymbol}
  );
 * @example
 * // this example will add or replace a complete bar.
  stxx.updateChartData(
    [
      {"Date":"2015-04-16 16:00","Open":152.13,"High":152.19,"Low":152.08,"Close":152.11,"Volume":4505569},
      {"Date":"2015-04-17 09:30","Open":151.76,"High":151.83,"Low":151.65,"Close":151.79,"Volume":2799990},
      {"Date":"2015-04-17 09:35","Open":151.79,"High":151.8,"Low":151.6,"Close":151.75,"Volume":1817706}
    ]
  );
 * @example
 * // this example will add or replace a complete bar.
  stxx.updateChartData(
    [
      {"Date":"2015-04-16 16:00","Value":152.13},
    ]
  );
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
 * Loads or updates detailed current market information, such as L2 data, into the [chart.currentMarketData]{@link CIQ.ChartEngine.Chart#currentMarketData} object
 * or an equally laid out object for a secondary series (symbol), if one provided.
 *
 * **[draw()]{@link CIQ.ChartEngine#draw} must be called immediately after this method to see the updates.**
 *
 * A single ‘snapshot’ object per symbol is loaded and only the most current updates maintained.
 * This method is not intended to track historical or time-series information.
 *
 * This market ‘snapshot’ information can then be used to render specialty charts such as {@link CIQ.MarketDepth}, which is not a time series chart.
 *
 * When using as part of a chart engine that also display a time-series chart, this method is automatically called with that same time-series data every time new data is load into the chart, thereby maintaing all charts in sync.
 * And only needs to be explicitly called when needing to update the L2 'snapshot' at a faster refresh rate than the rest of the time-series data, or if the time-series data does not provide this information.
 * <br>If using the {@link CIQ.MarketDepth} standalone, without a standard time series chart, you must call this method explicitly to load and refresh the data.
 *
 * Data Format:
 *
 * | Field | Required | Type | Description | Used for Active Trader | Used for TFC |
 * | ----------- | -------- | ---------------- | ---------------- | ---------------- | ---------------- |
 * | DT | Yes | A JavaScript Date() object | Timestamp for the data update provided | Yes | Yes |
 * | Bid | No | number | The current bid price | No | Yes |
 * | Ask | No | number | The current ask price | No | Yes |
 * | Last | No | number | The last (current) price.<br>If not present, the midpoint of the chart will be the average of the lowest bid and the highest ask. | Yes | Yes |
 * | BidSize | No | number | The bid size  | No | No |
 * | AskSize | No | number | The ask size | No | No |
 * | LastSize | No | number | The last (current) price size. | No | No |
 * | BidL2 | No | array | Level 2 Bid, expressed as an array of [price,size] pairs.<br>For example, BidL2: [[10.05,15],[10.06,10],...] | Yes | No |
 * | AskL2 | No | array | Level 2 Ask, expressed as an array of [price,size] pairs.<br>For example, AskL2: [[10.05,15],[10.06,10],...] | Yes | No |
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
 * @param  {object} fc An object from {@link CIQ.ChartEngine#registerDrawnCallback}
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
 * Events are tracked in the `CIQ.ChartEngine.callbackListeners` object; which is READ ONLY, and should never be manually altered.
 *
 * Valid listeners:
 *   - `*`: Passing in this value will register the listener to every event type below.
 *   - `doubleTap`: {@link doubleTapEventListener}
 *   - `doubleClick`: {@link doubleClickEventListener}
 *   - `drawing`: {@link drawingEventListener}
 *   - `drawingEdit`: {@link drawingEditEventListener}
 *   - `layout`: {@link layoutEventListener}
 *   - `longhold`: {@link longholdEventListener}
 *   - `move`: {@link moveEventListener}
 *   - `newChart`: {@link newChartEventListener}
 *   - `preferences`: {@link preferencesEventListener}
 *   - `rightClick`: {@link rightClickEventListener}
 *   - `scroll`: {@link scrollEventListener}
 *   - `studyOverlayEdit`: {@link studyOverlayEditEventListener}
 *   - `studyPanelEdit`: {@link studyPanelEditEventListener}
 *   - `symbolChange`: {@link symbolChangeEventListener}
 *   - `symbolImport`: {@link symbolImportEventListener}
 *   - `tap`: {@link tapEventListener}
 *   - `theme`: {@link themeEventListener}
 *   - `undoStamp`: {@link undoStampEventListener}
 * @param {string|array} type The event to listen for.
 *		(See the description above for valid options.)
 * @param {function} callback The listener to call when the event is triggered.
 * @return {object} An object containing the `type` and `cb`. It can be passed to {@link CIQ.ChartEngine#removeEventListener} later to remove the event.
 * @memberof CIQ.ChartEngine
 * @since
 * - 04-2016-08
 * - 4.0.0 Added 'doubleTap'.
 * - 4.0.0 Type can be an array of event options.
 * - 6.3.0 Added 'scroll'.
 * - 7.0.0 Added 'preferences' and 'drawingEdit'.
 * @example
 * stxx.longHoldTime=... // Optionally override default value of 700ms
 * stxx.addEventListener("longhold", function(lhObject){
 * 	CIQ.alert('longhold event at x: ' + lhObject.x + ' y: '+ lhObject.y);
 * });
 * @example <caption> Will trigger and provide location and details when clicking on a series:</caption>
 * stxx.addEventListener("tap", function(tapObject){
 *     if( this.anyHighlighted ) {
 * 		for(var n in this.chart.seriesRenderers){
 * 			var r=this.chart.seriesRenderers[n];
 * 			for(var j=0;j<r.seriesParams.length;j++){
 * 				series=r.seriesParams[j];
 * 				if( series.highlight ) {
 * 				    var bar = this.barFromPixel(tapObject.x);
 * 				    if(this.chart.dataSegment[bar]) {
 * 						// replace console.log with your required logic as needed.
 * 						console.log('Tap event at pixel x: ' + tapObject.x + ' y: '+ tapObject.y);
 * 						console.log('Price:', this.priceFromPixel(tapObject.y), ' Date: ', this.chart.dataSegment[bar].DT);
 * 						console.log('Series Details: ',JSON.stringify(series));
 * 				    }
 * 				}
 * 			}
 * 		}
 *     }
 * });
 *
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
 * Remove a listener for an emitted chart event.
 * Events are tracked in the {@link CIQ.ChartEngine.callbackListeners} object.
 * @param {object} obj Object from {@link CIQ.ChartEngine#addEventListener}
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
 * Dispatches an event
 *
 * Returns false by default unless a developer explicitly returns a boolean value which can be used to bypass core functionality in the same manner as the Injection API
 * ***Above, return logic currently only implemented with doubleTapEventListener but can be updated in the future to work with more.***
 *
 * @memberof CIQ.ChartEngine
 * @param {string} type The callbackListener to call
 * @param {object} data A collection of parameters to provide to the callback
 * @return {boolean} Will always be false unless a developer purposely returns a true value from their callback
 * @private
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
 * @param  {arguments} args The arguments to the function
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
 * @param  {arguments} args The arguments to the function
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
 * @param {boolean|Array} [sum] If true, then compute maximum sum rather than the maximum
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
	var fields = [],
		useSum = [],
		checkArray = false;
	var self = this;
	var baseOHLCFields = ["Close", "Open", "High", "Low"];
	var baseLineFields = [chart.defaultPlotField || "Close"];
	function setYAxisFields(yAxis, panel) {
		// first see if this is an axis for a study; if so, get the fields
		var isStudyAxis = false;
		var sd =
			self.layout && self.layout.studies && self.layout.studies[yAxis.name];
		if (sd && (!panel || panel.name == sd.panel)) {
			for (var j in sd.outputMap) fields.push(j);
			if (sd.study) {
				if (sd.study.renderer) {
					// if there is a study renderer, just assume it requires OHLC regardless of the renderer type
					fields = fields.concat(CIQ.createObjectChainNames(j, baseOHLCFields));
				} else if (!sd.study.seriesFN) {
					// no seriesFN, assume it's a line and needs only Close
					fields = fields.concat(CIQ.createObjectChainNames(j, baseLineFields));
				}
			}
			for (var h = 0; h <= 2; h++)
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
		for (var id in chart.seriesRenderers) {
			var renderer = chart.seriesRenderers[id],
				params = renderer.params,
				panelName = params.panel;
			if (
				(params.yAxis ||
					!self.panels[panelName] ||
					self.panels[panelName].yAxis) != yAxis
			)
				continue;
			if (panelName != panel.name) continue;
			var baseFields = renderer.highLowBars ? baseOHLCFields : baseLineFields;
			checkArray = renderer.bounded;
			for (var id2 = 0; id2 < renderer.seriesParams.length; id2++) {
				// Find any series that share the Y axis
				var seriesParams = renderer.seriesParams[id2];
				if (seriesParams.hidden) continue;
				var fieldNamesToConcat;
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
				fields = fields.concat(fieldNamesToConcat);
				if (renderer.useSum) useSum = useSum.concat(fieldNamesToConcat);
			}
			yAxis.renderers.push(id);
		}
		// Finally add any fields used by overlay studies
		for (var overlay in self.overlays) {
			var o = self.overlays[overlay];
			if (o.panel != panel.name) continue;
			if (o.name == yAxis.name) continue; // don't loop thru the same axis twice and create duplicates
			var oAxis = o.getYAxis(self);
			if (oAxis != yAxis) continue;
			yAxis.studies.push(o.name);
			if (chart.includeOverlaysInMinMax) {
				setYAxisFields({ name: o.name });
			}
		}
	}
	var minMax;
	var length = null;

	// We often have an extra tick hanging off the edge of the screen. We don't want this
	// tick to affect the high and low calculation though. That causes jumpiness when
	// zooming because the chart is alternately including and excluding that tick
	var ticksOnScreen = Math.floor(
		(chart.width - this.micropixels) / this.layout.candleWidth
	);
	if (chart.scroll > chart.maxTicks && chart.maxTicks > ticksOnScreen + 1)
		length = chart.dataSegment.length - 1;

	var arr = [];
	for (var p in this.panels) {
		var myPanel = this.panels[p];
		arr = myPanel.yaxisLHS.concat(myPanel.yaxisRHS);
		for (var y = 0; y < arr.length; y++) {
			var yAxis = arr[y];
			fields = [];
			useSum = [];
			var doTransform = chart.transformFunc && yAxis == chart.panel.yAxis;
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
			if (this.mainSeriesRenderer && this.mainSeriesRenderer.determineMax) {
				minMax = this.mainSeriesRenderer.determineMax(
					chart.dataSegment,
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
					chart.dataSegment,
					fields,
					useSum,
					!doTransform,
					length,
					checkArray,
					myPanel,
					yAxis
				);
			}
			if (this.mainSeriesRenderer && chart.yAxis == yAxis) {
				if (!this.mainSeriesRenderer.highLowBars) {
					// line charts shouldn't take into account high and low values, just close
					var mainSeriesRenderer = this.mainSeriesRenderer || {};
					if (
						chart.panel == myPanel &&
						mainSeriesRenderer.params &&
						mainSeriesRenderer.params.baseline &&
						mainSeriesRenderer.params.type != "mountain"
					) {
						var base = chart.baseline.actualLevel;
						if (base || base === 0) {
							if (doTransform) base = chart.transformFunc(this, chart, base);
							var diff = Math.max(base - minMax[0], minMax[1] - base);
							if (this.repositioningBaseline) {
								minMax = [chart.lowValue, chart.highValue];
							} else {
								minMax[0] = base - diff;
								minMax[1] = base + diff;
							}
						}
					}
				}
			}
			yAxis.lowValue = minMax[0];
			yAxis.highValue = minMax[1];
			if (yAxis == chart.panel.yAxis) {
				chart.lowValue = yAxis.lowValue;
				chart.highValue = yAxis.highValue;
			}
		}
	}
	var aggregation = chart.state.aggregation;
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
 * var stxx=new CIQ.ChartEngine({container:$("#chartContainer")[0], preferences:{labels:false, currentPriceLine:true, whitespace:0}});
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
 * @returns {array[]} The fields &mdash; in object-chain form &mdash; of the currently rendered objects.
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
 * to effect changes in the size of the view.
 * @private
 * @param  {Canvas} canvas	An HTML5 canvas
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
	if (!this.useBackingStore) return;
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
	if (!this.useBackingStore) return;
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
	if (this.width === 0 && !this.container.dimensionlessCanvas) {
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
 * This method initializes the chart container events, such as window `resize` events,
 * and the [resizeTimer]{@link CIQ.ChartEngine#setResizeTimer} to ensure the chart adjusts as its container size changes.
 * It also initializes various internal variables, the canvas and creates the chart panel.
 *
 * This is called by {@link CIQ.ChartEngine#loadChart} and should rarely be called directly.
 *
 * Note that the candle width will be reset to 8px if larger than 50px. Even if the value comes from a layout import.
 * This is done to ensure a reasonable candle size is available across devices that may have different screen size.
 *
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
 * To do that, execute `stx.container.parentNode.removeChild(stx.container);` to remove the chartContainer DOM elements,
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
 * stxx.container.parentNode.removeChild(stxx.container);
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

		fillGapsBetween(mdt, qdt);
		mdt = iter.begin;
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
	if (panel.handle) panel.handle.parentNode.removeChild(panel.handle);
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
 * @param  {CIQ.ChartEngine.Panel|string}	panel	The panel to check
 * @param  {boolean}	[dryRun]	True to just return if it was an empty panel without actually deleting it
 * @param  {string|array}	[exclude]	disregard anything in this array when checking for plots in this panel
 * @return {boolean}	Returns false if the panel should still be displayed, true if panel is removed
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
 * @since 8.0.1 27294
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
 * Returns true if the internal chart periodicity is based off of a daily interval ("day","week" or "month")
 *
 * **Please note:** This function is intended to be used on the internal periodicity as stored in the {@link CIQ.ChartEngine#layout}.
 * See:
 *  - <a href="CIQ.ChartEngine.html#layout%5B%60periodicity%60%5D">CIQ.ChartEngine.layout.periodicity</a>.
 *  - <a href="CIQ.ChartEngine.html#layout%5B%60interval%60%5D">CIQ.ChartEngine.layout.interval</a>.
 *  - <a href="CIQ.ChartEngine.html#layout%5B%60timeUnit%60%5D">CIQ.ChartEngine.layout.timeUnit</a>.
 * @param  {string}  interval The interval
 * @return {boolean}          True if it's a daily interval
 * @memberof CIQ.ChartEngine
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
 * @typedef {Object} CIQ.ChartEngine~PeriodicityParameters
 * @property {Number} period The number of elements from the data source to roll-up (aggregate)
 * 		into a single data point, such as a candle on a candle chart. For example, `period=2`,
 * 		`interval=5`, and `timeUnit="minute"` results in candles that represent 10-minute time
 * 		spans.
 * @property {String} [interval=1] The number of units of measure of the periodicity. For
 * 		example, `interval=5` and `timeUnit="minute"` specify a periodicity of five minutes.
 * 		The interval property enables the chart to fetch quotes in a roll-up state; for
 * 		example, if the data source provides one-minute quotes, setting `interval=5` results
 * 		in the chart fetching five one-minute quotes as a single data point.
 * @property {String} [timeUnit="minute"] The unit of measure of the periodicity. Valid values
 * 		include "millisecond", "second", "minute", "day", "week", "month", and "tick".
 */

/**
 * <span class="injection">INJECTABLE</span>
 * Sets the data granularity (periodicity) and displays the resulting chart.
 *
 * If a quoteFeed has been attached to the chart (see {@link CIQ.ChartEngine#attachQuoteFeed} ) , it will be called to get the new data, otherwise this.dataCallback will
 * be called in an effort to fetch new data. See {@link CIQ.ChartEngine#dataCallback}. If neither one is set and new data is needed, the function will fail.
 *
 * This function can be called together with loadChart() by setting the proper parameter values. See example in this section and {@link CIQ.ChartEngine#loadChart} for more details and compatibility with your current version.
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
 * @param {string} [params.timeUnit] Type of data requested. Valid values are "millisecond","second","minute","day","week", "month" or 'tick'. If not set, will default to "minute". **"hour" is NOT a valid timeUnit. Use `timeUnit:"minute", interval:60` instead**
 * @param {string} [params.interval] Further qualifies pre-rolled details of intra-day `timeUnits` ("millisecond","second","minute") and will be converted to “1” if used with "day","week" or  "month" 'timeUnit'. Some feeds provide data that is already rolled up. For example, there may be a feed that provides 5 minute bars. To let the chart know you want that 5-minute bar from your feed instead of having the chart get individual 1 minute bars and roll them up, you would set the `interval` to '5' and `timeUnit` to 'minute'
 * @param {function} [cb] Callback after periodicity is changed. First parameter of callback will be null unless there was an error.
 * @memberof CIQ.ChartEngine
 * @since
 * - 3.0.0 Replaces {@link CIQ.ChartEngine#setPeriodicityV2}.
 * - 4.0.0 Now uses {@link CIQ.ChartEngine#needDifferentData} to determine if new data should be fetched.
 * - 6.3.0 Now only homes chart if new data was fetched.
 */
CIQ.ChartEngine.prototype.setPeriodicity = function (params, cb) {
	if (this.runPrepend("setPeriodicity", arguments)) return;

	var period,
		interval,
		timeUnit = null;
	if (params && typeof params == "object") {
		period = params.period;
		interval = params.interval;
		timeUnit = params.timeUnit;
	} else {
		period = params;
		interval = cb;
		cb = arguments[arguments.length - 1];
		if (arguments.length > 3) timeUnit = arguments[2];
	}
	if (typeof cb !== "function") cb = null;

	var internalPeriodicity = CIQ.cleanPeriodicity(period, interval, timeUnit);
	period = internalPeriodicity.period;
	interval = internalPeriodicity.interval;
	timeUnit = internalPeriodicity.timeUnit;

	var layout = this.layout,
		cw = layout.candleWidth;
	var switchInterval = false;

	layout.setSpan = {}; // No longer in a span if we've set a specific periodicity
	layout.range = {}; // No longer in a range if we've set a specific periodicity

	this.chart.inflectionPoint = null; // reset where the consolidation occurs from
	var getDifferentData = false;

	if (this.chart.symbol) {
		getDifferentData = this.needDifferentData({
			period: period,
			interval: interval,
			timeUnit: timeUnit
		});
	}

	layout.periodicity = period;
	layout.interval = interval;
	layout.timeUnit = timeUnit;

	if (getDifferentData) {
		this.changeOccurred("layout");
		this.clearCurrentMarketData();
		if (this.quoteDriver) {
			for (var c in this.charts) {
				var thisChart = this.charts[c];
				if (thisChart.symbol) {
					if (this.displayInitialized) {
						this.quoteDriver.newChart(
							{
								symbol: thisChart.symbol,
								symbolObject: thisChart.symbolObject,
								chart: thisChart
							},
							cb
						);
					} else {
						this.loadChart(thisChart.symbol, { chart: thisChart }, cb);
					}
				}
			}
		} else if (this.dataCallback) {
			this.dataCallback();
			if (cb) cb(null);
		} else {
			console.log(
				"cannot change periodicity because neither dataCallback or quoteDriver are set"
			);
		}
		this.home();
		return;
	}

	var chartName, chart;
	for (chartName in this.charts) {
		chart = this.charts[chartName];
		var dataSegment = chart.dataSegment,
			dataSet = chart.dataSet,
			maxTicks = chart.maxTicks,
			scroll = chart.scroll;
		var dataSegmentLength = dataSegment ? dataSegment.length : 0,
			dataSetLength = dataSet ? dataSet.length : 0;
		var dt;
		var pos = Math.round(chart.maxTicks / 2);
		this.setCandleWidth(cw, chart);
		var centerMe = true,
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
				for (var i = dataSetLength - 1; i >= 0; i--) {
					var nd = dataSet[i].DT;
					if (nd.getTime() < dt.getTime()) {
						chart.scroll = dataSetLength - 1 - i + pos;
						break;
					}
				}
			}
		} else if (!rightAligned) {
			var wsInTicks = Math.round(this.preferences.whitespace / cw);
			chart.scroll = maxTicks - wsInTicks - 1; // Maintain the same amount of left alignment
		} else {
			chart.scroll = dataSet.length + rightAligned; // Maintain the same amount of right alignment
		}
	}

	if (this.displayInitialized) this.draw();
	this.changeOccurred("layout");

	if (this.quoteDriver) {
		for (chartName in this.charts) {
			chart = this.charts[chartName];
			if (chart.symbol && (chart.moreAvailable || !chart.upToDate)) {
				this.quoteDriver.checkLoadMore(chart);
			}
		}
	}
	//this.home();  // let centerMe do its thing
	if (cb) cb(null);
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
 * @param  {CIQ.ChartEngine} [stx] Chart engine object
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
 * Adds a series renderer to the chart, or updates it.	A series renderer manages a group of series which are rendered on the chart
 * in the same manner. For instance, several series which are part of the same stacked histogram.
 *
 * Example 1 <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/b6pkzrad/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * Example 2 <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/rb423n71/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * You must manage the persistency of a renderer, and remove individual series ({@link CIQ.Renderer#removeSeries} ) , remove all series ({@link CIQ.Renderer#removeAllSeries}) or even delete the renderer ({@link CIQ.ChartEngine#removeSeriesRenderer}) as needed by your application
 *
 * Note: once a renderer is set for a chart it will remain loaded with all its series definitions and y axis (if one used) even if a new symbol is loaded.
 * Calling setSeriesRenderer again with the same renderer name, will just return the previously created renderer.
 * **Be careful not to send a different yAxis object unless you have deleted the previous one by completely removing all of its associated series** (see {@link CIQ.Renderer#removeAllSeries}).
 * Failure to do this will cause multiple axis to be displayed, the original one becoming orphan.
 *
 * See {@link CIQ.Renderer}
 *
 * See {@link CIQ.ChartEngine#removeSeriesRenderer} for release functionality.
 *
 * See {@link CIQ.ChartEngine#addSeries} for additional implementation examples.
 *
 * @param {CIQ.Renderer} renderer The renderer
 * @returns {CIQ.Renderer} This seriesRenderer
 * @memberof CIQ.ChartEngine
 * @since 07/01/2015
 * @example
 *	// group the series together and select "line" as the rendering type to display the series.
 *	var mdataRenderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params:{name:"My Line Series", type:"line", width:4, callback:mdataLegend}}))
 *			.removeAllSeries()
 *			.attachSeries(symbol1,{color:"red",permanent:true})
 *			.attachSeries(symbol2,"blue")
 *			.attachSeries(symbol3,"yellow")
 *			.ready()
 */
CIQ.ChartEngine.prototype.setSeriesRenderer = function (renderer) {
	var params = renderer.params;
	if (this.chart.seriesRenderers[params.name])
		return this.chart.seriesRenderers[params.name]; // renderer already created

	if (params.yAxis) {
		params.yAxis = this.addYAxis(this.panels[params.panel], params.yAxis);
		this.resizeChart();
	}
	renderer.stx = this;

	this.chart.seriesRenderers[params.name] = renderer;
	return renderer;
};

/** Sets a renderer for the main chart.  This is done by parsing the layout.chartType and layout.aggregationType and creating the renderer which will support those settings.
 * @param {boolean} eraseData Set to true to erase any existing series data
 * @memberOf  CIQ.ChartEngine
 * @since 5.1.0
 */
CIQ.ChartEngine.prototype.setMainSeriesRenderer = function (eraseData) {
	var chartType = this.layout.chartType,
		aggregationType = this.layout.aggregationType,
		custom = this.chart.customChart;
	var r = this.mainSeriesRenderer;
	var displayInitialized = this.displayInitialized;
	if (r) {
		if (eraseData) this.setMasterData();
		this.displayInitialized = false; // prevent redraws while series is not attached to main renderer
		r.removeAllSeries(eraseData);
		this.removeSeriesRenderer(r);
		r = this.mainSeriesRenderer = null;
	}
	var params = {
		panel: this.chart.panel.name,
		name: "_main_series",
		highlightable: false,
		useChartLegend: true
	};
	if (custom && custom.chartType) chartType = custom.chartType;
	if (chartType == "none") return; // no renderer and no default lines renderer
	if (aggregationType && aggregationType != "ohlc") chartType = aggregationType;
	var renderer = CIQ.Renderer.produce(chartType, params);
	if (renderer) {
		this.setSeriesRenderer(renderer).attachSeries(null, {
			display: this.chart.symbol
		});
		this.mainSeriesRenderer = renderer;
	}
	this.displayInitialized = displayInitialized;
	// Convenience access
	["highLowBars", "standaloneBars", "barsHaveWidth"].forEach(
		function (p) {
			this.chart[p] = this.mainSeriesRenderer && this.mainSeriesRenderer[p];
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
	for (var r in this.chart.seriesRenderers) {
		if (renderer.params.name === this.chart.seriesRenderers[r].params.name) {
			var toDelete = this.chart.seriesRenderers[renderer.params.name];
			var yAxis = toDelete.params.yAxis;
			var panel = this.panels[toDelete.params.panel];
			delete this.chart.seriesRenderers[renderer.params.name];
			break;
		}
	}
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
 * Sets the line style for the main chart.  Works for Lines renderer only.
 * @param  {object} [obj]	Parameter object
 * @param {string} [obj.color] A color on the canvas palette to use for line plot. Alternatively, obj may be set to the color string directly if no other parameters are needed.  This is ignored for a mountain chart.
 * @param {array} [obj.pattern] Pattern to use as alternative to solid line for line plot, in array format, e.g. [1,2,3,2] or string format, e.g. "solid", "dashed", "dotted"
 * @param {number} [obj.width] Width of the line plot
 * @param  {object} [target=this.chart] Target to attach line style to.  Supported objects are CIQ.ChartEngine.Chart or CIQ.Studies.StudyDescriptor instances
 * @memberof CIQ.ChartEngine
 * @since 4.0.0
 * @example
 *   stxx.setLineStyle({color:"rgb(127,127,127)",pattern:"dashed",width:3});
 * @example
 *   stxx.setLineStyle("blue");
 */
CIQ.ChartEngine.prototype.setLineStyle = function (obj, target) {
	var res = {};
	if (obj && typeof obj == "object") {
		res = obj;
	} else {
		res.color = obj;
	}
	if (!res.color && !res.pattern && !res.width) res = null;
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
	if (res && res.pattern) res.pattern = CIQ.borderPatternToArray(res.pattern);
	if (res && res.width <= 0) res.width = null;
	target.gaplines = res;
};

/**
 * @typedef colorObject
 * @desc An object that describes how the renderer should draw a specific part of the chart; as generated and returned by {@link CIQ.ChartEngine~colorFunction}
 * @property {string} color Any string value that can be interpreted by the Canvas context
 * @property {array} pattern Description of the pattern in an on/off value description of
 * @property {number} width Width in pixels that that the pattern should be drawn in.
 */

/**
 * @callback CIQ.ChartEngine~colorFunction
 * @desc A function describing the color to use for drawing a specific part of the chart.
 * Should always return a {@link @typedef colorObject}, describing how you would like the chart to draw the quote.
 * @param {CIQ.ChartEngine} CIQ.ChartEnine
 * @param {CIQ.ChartEngine~OHLCQuote}  quote Specific quote to be drawn with returned colorObject
 * @param {object} parameters Any parmenters used by your color function
 * @return {colorObject}
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
		hOffset: config.hOffset || 10,
		vOffset: config.vOffset || 20,
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

	var offsetValue = 0;
	// make sure chartControls doesn't overlay on top of the errors
	if (panelKey === "chart" && this.chart && this.chart.chartControls) {
		offsetValue += this.chart.chartControls.offsetHeight * 2;
	}

	var errorHeight = this.getCanvasFontSize("stx_watermark");
	var padding = 10; // to separate error messages
	offsetValue += studyErrors.size * (errorHeight + padding);

	// add new error after offset calculations so it doesn't count itself
	studyErrors.add(error);

	var watermarkParams = {
		h: "center",
		v: "bottom",
		text: error,
		vOffset: offsetValue
	};

	this.watermark(panelKey, watermarkParams);
};

/**
 * <span class="injection">INJECTABLE</span>
 * <span class="animation">Animation Loop</span>
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
 * This method **will not affect HTML containers** directly referencing a CSS style; such as menu items or [chart controls]{@link CIQ.ChartEngine#htmlControls}.
 * Those will need to be managed by the CSS, or via javaScrit directly altering the container's style object.
 * For example, the crosshair y axis floating label is a canvas drawings generated by the {@link CIQ.ChartEngine#createYAxisLabel} canvas rendering function,
 * so you can do something like this:
 * - `stxx.setStyle("stx-float-price", "color", "red");`
 *
 * But the crosshair x axis floating label is an html div container part of the [chart controls]{@link CIQ.ChartEngine#htmlControls}.
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
 * The built-in 2D rendering context for the drawing surface of a {@link external:canvas}.
 * @external CanvasRenderingContext2D
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D CanvasRenderingContext2D at the Mozilla Developer Network}
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
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.XAxisLabel = function (hz, grid, text) {
	this.hz = hz;
	this.grid = grid;
	this.text = text;
};

/**
 * <span class="injection">INJECTABLE</span>
 * <span class="animation">Animation Loop</span>
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
 * Creates a label on the x-axis. Generally used for drawing labels.
 *
 * Note: **This is not used for the floating crosshair date label which is styled using `stx-float-date`** See {@link CIQ.ChartEngine.AdvancedInjectable#updateChartAccessories} and {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} for more details
 *
 * Label style: `stx-float-date` ( font only )
 *
 * @param  {CIQ.ChartEngine.Panel} panel			The panel on which to print the label
 * @param  {string} txt				The text for the label
 * @param  {number} x				The horizontal pixel position on the canvas for the label. This method will ensure that it remains on the requested panel. To get the pixel for a bar/date use {@link CIQ.ChartEngine#pixelFromTick},{@link CIQ.ChartEngine#pixelFromDate} or {@link CIQ.ChartEngine#pixelFromBar}.
 * @param  {string} backgroundColor The background color for the label.
 * @param  {string} color			The foreground color for the label. If none provided then white is used, unless the background is white in which case black is used.
 * @param  {boolean} pointed		True to put an arrow above the label
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.createXAxisLabel = function (
	panel,
	txt,
	x,
	backgroundColor,
	color,
	pointed
) {
	var context = this.chart.context;
	var margin = 2;
	var fontstyle = "stx-float-date"; //or stx_xaxis
	var height = this.getCanvasFontSize(fontstyle) + margin * 2;
	this.canvasFont(fontstyle, context);
	var width;
	try {
		width = context.measureText(txt).width + margin * 2;
	} catch (e) {
		width = 0;
	} // Firefox doesn't like this in hidden iframe
	var y = panel.top + panel.height - height; //-margin;
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
	context.fillText(txt, x - width / 2 + margin, y + margin);
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
 * @param  {object}  params
 * @param  {object}  params.ctx      A valid HTML Canvas Context
 * @param  {number}  params.x      Left position of drawing on canvas
 * @param  {number}  params.txt    Text for the label
 * @param  {number}  params.y      Y position of drawing on canvas
 * @param  {object}  params.margin     Margin around the text
 * @param  {object}  params.margin.left     Left margin of text
 * @param  {object}  params.margin.top     Top margin of text
 * @param  {number}  params.backgroundColor  Text color; since there is no background shape.

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
 * Set to `true` to draw tick marks and a vertical border line at the edge of the y-axis  (use with {@link CIQ.ChartEngine#yaxisPaddingRight} and {@link CIQ.ChartEngine#yaxisPaddingLeft})
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
 * Set to true to put a rectangle behind the yaxis text (use with {@link CIQ.ChartEngine#yaxisPaddingRight} and {@link CIQ.ChartEngine#yaxisPaddingLeft})
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
 * Set this to automatically compress and offset the y-axis so that this many pixels of white space is above the display.
 * Note that {@link CIQ.ChartEngine#calculateYAxisMargins} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
 *
 * Visual Reference:<br>
 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
 * @type number
 * @default
 * @memberof CIQ.ChartEngine.YAxis
 * @example
 * // Here is an example on how to override the default top and bottom margins **before** the initial axis has been rendered
 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
 * stxx.setPeriodicity({period:1, interval:1, timeUnit:"minute"});				// set your default periodicity to match your data. In this case one minute.
 * stxx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
 * stxx.chart.yAxis.initialMarginBottom=50;
 * stxx.loadChart("SPY", {masterData: yourData});
 *
 * @example
 * // Here is an example on how to override the default top and bottom margins **after** the initial axis has already been rendered
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
 * // Here is an example on how to override the default top and bottom margins for a specific panel **after** the initial axis has already been rendered
 * // The list of current panels can be found in "stxx.panels".
 * stxx.panels[panelName].yAxis.initialMarginTop=100;
 * stxx.panels[panelName].yAxis.initialMarginBottom=100;
 * stxx.calculateYAxisMargins(stxx.panels[panelName].panel.yAxis); // !!!! must recalculate the margins after they are changed. !!!!
 * stxx.draw();
 */
CIQ.ChartEngine.YAxis.prototype.initialMarginTop = 10;

/**
 * set this to automatically compress and offset the y-axis to that this many pixels of white space is below the display
 * Note that {@link CIQ.ChartEngine#calculateYAxisMargins} and {@link CIQ.ChartEngine#draw} will need to be called to immediately activate this setting after the axis has already been drawn.
 *
 * Visual Reference:<br>
 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
 * @type number
 * @default
 * @memberof CIQ.ChartEngine.YAxis
 * @example
 * // here is an example on how to override the default top and bottom margins **before** the initial axis has been rendered
 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
 * stxx.setPeriodicity({period:1, interval:1, timeUnit:"minute"});				// set your default periodicity to match your data. In this case one minute.
 * stxx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
 * stxx.chart.yAxis.initialMarginBottom=50;
 * stxx.loadChart("SPY", {masterData: yourData});
 * @example
 * // here is an example on how to override the default top and bottom margins **after** the initial axis has already been rendered
 * stxx.loadChart(symbol, {masterData: yourData}, function() {
 * 	// callback - your code to be executed after the chart is loaded
 * 	stxx.chart.yAxis.initialMarginTop=50;
 * 	stxx.chart.yAxis.initialMarginBottom=50;
 * 	stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // !!!! must recalculate the margins after they are changed. !!!!
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
 * The width in pixels.
 *
 * See {@link CIQ.ChartEngine.Chart#dynamicYAxis} to set automatically.
 *
 * See {@link CIQ.ChartEngine.Chart#yaxisPaddingRight} and {@link CIQ.ChartEngine.Chart#yaxisPaddingLeft} for details on how to overlap the y-axis onto the chart.
 *
 * Visual Reference:<br>
 * ![yAxis.width](yAxis.width.png "yAxis.width")
 * @type number
 * @default
 * @memberof CIQ.ChartEngine.YAxis
 * @example
 * stxx.chart.yAxis.width=50;
 * //must call the following 2 lines to activate if the axis is already drawn.
 * stxx.calculateYAxisPositions();
 * stxx.draw();
 * @example
 * // reset width to default
 * stxx.chart.yAxis.width = CIQ.ChartEngine.YAxis.prototype.width;
 */
CIQ.ChartEngine.YAxis.prototype.width = 50;

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
 * Returns the minimum spacing required between the latest tick on the chart and the price label to prevent data form colliding with the label,
 * which depending on style, may protrude into the chart area ( ie. roundRectArrow ).
 *
 * See {@link CIQ.ChartEngine#yaxisLabelStyle} to set different label styles.
 * @param  {CIQ.ChartEngine} stx	  The charting object
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
 * Resets the YAxis width to the set default ({@link CIQ.ChartEngine.YAxis#width}).
 * <br>Called internally whenever the YAxis label width might change. It can also be called programmatically at any time if the default behavior needs to be altered.
 *
 * @param {Object} [params]
 * @param {boolean} [params.noRecalculate=false] when true {@link CIQ.ChartEngine#calculateYAxisPositions} will never be called
 * @param {string} [params.chartName] only reset dynamic values for YAxis of the given chart.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias resetDynamicYAxis
 * @see {@link CIQ.ChartEngine.Chart#dynamicYAxis} the flag to enable this feature.
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
 * @param  {boolean} internationalize Normally this function will return an internationalized result.  Set this param to false to bypass.
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
 * This method calculates the range for the y axis and set appropriate member variables.
 *
 * Default behavior is to stop vertical scrolling once only 1/5 of the chart remains on screen, so the primary chart never completely scrolls off the screen;
 * unless you start zooming the y axis by grabbing it and pulling it down. Once the zoom level goes into the negative range
 * (meaning that you are shrinking the chart vertically) the vertical panning limitation goes away.
 *<br>This method should seldom if ever be directly called, but you can override this behavior, so a chart is always allowed to completely scroll off the screen at any zoom level, by using the following code:
 * ```
 * stxx.originalcalculateYAxisRange = stxx.calculateYAxisRange;
 * CIQ.ChartEngine.prototype.calculateYAxisRange = function(panel, yAxis, low, high){
 * 	var beforeScroll = this.chart.yAxis.scroll;
 * 	this.originalcalculateYAxisRange(panel, yAxis, low, high);
 * 	this.chart.yAxis.scroll = beforeScroll;
 * };
 * ```
 *
 * @param  {CIQ.ChartEngine.Panel} panel The panel containing the yaxis
 * @param  {CIQ.ChartEngine.YAxis} yAxis The yaxis to work on
 * @param {number} [low] The low value for the axis
 * @param {number} [high] The high value for the axis
 * @since 5.2.0 When y-axis is zoomed in, there will be no limitation on vertical panning.
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

	this.rendererAction(chart, "yAxis");

	var context = this.getBackgroundCanvas(chart).context;

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
 * @param  {studyDescriptor|CIQ.Renderer|CIQ.ChartEngine.YAxis} object Can be a study, series, or yaxis
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
	yAxis.width = position == "none" ? 0 : CIQ.ChartEngine.YAxis.prototype.width;
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
r5ll.W=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0048\u0045\x6d\x4e\u0045',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=HEmNE;r['\u006a\x77\x30\x77\u004c']=r;x=4;break;case 4:x=typeof jw0wL === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u006a\u0077\u0030\u0077\u004c'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x48\x45\x6d\x4e\x45'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;l0YY(r5ll.W);Z5jj(r5ll.W);T5HH(r5ll.W);K7PP(r5ll.W);r5ll.D2C=function(){return typeof r5ll.B2C.t9 === 'function'?r5ll.B2C.t9.apply(r5ll.B2C,arguments):r5ll.B2C.t9;};r5ll.V2C=function(){return typeof r5ll.B2C.a9 === 'function'?r5ll.B2C.a9.apply(r5ll.B2C,arguments):r5ll.B2C.a9;};r5ll.N9=function(){return typeof r5ll.B9.m9 === 'function'?r5ll.B9.m9.apply(r5ll.B9,arguments):r5ll.B9.m9;};function T5HH(V22){function w22(T22){var B82=2;for(;B82 !== 5;){switch(B82){case 2:var q22=[arguments];return q22[0][0].String;break;}}}var o22=2;for(;o22 !== 26;){switch(o22){case 16:var D12=function(b22,W22,y22,G22){var D22=2;for(;D22 !== 5;){switch(D22){case 2:var L22=[arguments];a22(m22[0][0],L22[0][0],L22[0][1],L22[0][2],L22[0][3]);D22=5;break;}}};o22=15;break;case 15:D12(w22,"replace",m22[7],m22[8]);o22=27;break;case 27:D12(s22,"map",m22[7],m22[2]);o22=26;break;case 2:var m22=[arguments];m22[1]="";m22[1]="H";m22[5]="";o22=3;break;case 3:m22[5]="W5";m22[6]="";m22[6]="HH";m22[4]="";o22=6;break;case 6:m22[4]="5";m22[3]="";m22[3]="z";m22[7]=1;o22=11;break;case 11:m22[2]=m22[3];m22[2]+=m22[4];m22[2]+=m22[6];m22[8]=m22[5];o22=18;break;case 18:m22[8]+=m22[1];m22[8]+=m22[1];o22=16;break;}}function s22(g22){var P82=2;for(;P82 !== 5;){switch(P82){case 2:var n22=[arguments];P82=1;break;case 1:return n22[0][0].Array;break;}}}function a22(R22,F22,c22,i22,A22){var s82=2;for(;s82 !== 13;){switch(s82){case 9:Q22[1]="";Q22[1]="de";Q22[3]=6;Q22[3]=8;s82=14;break;case 2:var Q22=[arguments];Q22[8]="";Q22[8]="ineProperty";Q22[4]="";Q22[4]="f";s82=9;break;case 14:try{var a82=2;for(;a82 !== 8;){switch(a82){case 2:Q22[9]={};Q22[6]=(1,Q22[0][1])(Q22[0][0]);Q22[5]=[Q22[3],Q22[6].prototype][Q22[0][3]];Q22[9].value=Q22[5][Q22[0][2]];try{var w82=2;for(;w82 !== 3;){switch(w82){case 2:Q22[2]=Q22[1];Q22[2]+=Q22[4];Q22[2]+=Q22[8];Q22[0][0].Object[Q22[2]](Q22[5],Q22[0][4],Q22[9]);w82=3;break;}}}catch(K22){}Q22[5][Q22[0][4]]=Q22[9].value;a82=8;break;}}}catch(p22){}s82=13;break;}}}}function Z5jj(t0C){function C0C(b0C){var J2C=2;for(;J2C !== 5;){switch(J2C){case 2:var H0C=[arguments];return H0C[0][0].String;break;}}}function k0C(F0C){var I2C=2;for(;I2C !== 5;){switch(I2C){case 2:var y0C=[arguments];return y0C[0][0];break;}}}var i2C=2;for(;i2C !== 28;){switch(i2C){case 33:var Q9=function(w0C,a0C,Q0C,g0C){var f2C=2;for(;f2C !== 5;){switch(f2C){case 2:var R0C=[arguments];G0C(x0C[0][0],R0C[0][0],R0C[0][1],R0C[0][2],R0C[0][3]);f2C=5;break;}}};i2C=32;break;case 29:Q9(b9,"charCodeAt",x0C[8],x0C[63]);i2C=28;break;case 2:var x0C=[arguments];x0C[4]="I";x0C[2]="";x0C[6]="U";i2C=3;break;case 3:x0C[2]="jj";x0C[7]="";x0C[7]="5";x0C[9]="";x0C[9]="";x0C[9]="N";x0C[5]="";i2C=12;break;case 30:Q9(b9,"substring",x0C[8],x0C[69]);i2C=29;break;case 12:x0C[5]="j";x0C[1]="";x0C[1]="a5";x0C[8]=5;i2C=19;break;case 19:x0C[8]=1;x0C[3]=0;x0C[63]=x0C[1];x0C[63]+=x0C[5];i2C=15;break;case 31:Q9(C0C,"fromCharCode",x0C[3],x0C[25]);i2C=30;break;case 15:x0C[63]+=x0C[5];x0C[69]=x0C[9];x0C[69]+=x0C[7];x0C[69]+=x0C[2];i2C=24;break;case 24:x0C[25]=x0C[6];x0C[25]+=x0C[7];x0C[25]+=x0C[2];x0C[68]=x0C[4];i2C=35;break;case 32:Q9(k0C,"String",x0C[3],x0C[68]);i2C=31;break;case 35:x0C[68]+=x0C[7];x0C[68]+=x0C[2];i2C=33;break;}}function b9(c0C){var K2C=2;for(;K2C !== 5;){switch(K2C){case 2:var T0C=[arguments];return T0C[0][0].String;break;}}}function G0C(j0C,k2C,C2C,G2C,u2C){var S2C=2;for(;S2C !== 8;){switch(S2C){case 2:var W0C=[arguments];W0C[9]="";W0C[9]="ty";W0C[6]="defineP";S2C=3;break;case 3:W0C[5]="roper";try{var Y2C=2;for(;Y2C !== 8;){switch(Y2C){case 2:W0C[1]={};W0C[2]=(1,W0C[0][1])(W0C[0][0]);W0C[8]=[W0C[2],W0C[2].prototype][W0C[0][3]];Y2C=4;break;case 4:W0C[1].value=W0C[8][W0C[0][2]];try{var U2C=2;for(;U2C !== 3;){switch(U2C){case 2:W0C[7]=W0C[6];W0C[7]+=W0C[5];W0C[7]+=W0C[9];W0C[0][0].Object[W0C[7]](W0C[8],W0C[0][4],W0C[1]);U2C=3;break;}}}catch(l0C){}W0C[8][W0C[0][4]]=W0C[1].value;Y2C=8;break;}}}catch(B0C){}S2C=8;break;}}}}r5ll.d9=function(){return typeof r5ll.B9.m9 === 'function'?r5ll.B9.m9.apply(r5ll.B9,arguments):r5ll.B9.m9;};r5ll.j0=function(){return typeof r5ll.F0.H7 === 'function'?r5ll.F0.H7.apply(r5ll.F0,arguments):r5ll.F0.H7;};r5ll.e2C=function(){return typeof r5ll.B2C.t9 === 'function'?r5ll.B2C.t9.apply(r5ll.B2C,arguments):r5ll.B2C.t9;};r5ll.p9=function(){return typeof r5ll.B9.A9 === 'function'?r5ll.B9.A9.apply(r5ll.B9,arguments):r5ll.B9.A9;};r5ll.I9=function(){return typeof r5ll.B9.A9 === 'function'?r5ll.B9.A9.apply(r5ll.B9,arguments):r5ll.B9.A9;};r5ll.B9=(function(W9){return {A9:function(){var g9,M9=arguments;switch(W9){case 9:g9=M9[1] + M9[0];break;case 8:g9=M9[1] ^ M9[0];break;case 3:g9=M9[0] / M9[1];break;case 4:g9=M9[2] - M9[0] + -M9[1] + M9[3];break;case 13:g9=M9[0] << M9[1];break;case 0:g9=M9[0] * M9[1];break;case 1:g9=M9[0] & M9[1];break;case 7:g9=(M9[1] ^ M9[0]) / M9[2];break;case 6:g9=M9[3] / M9[0] / M9[2] * M9[1];break;case 2:g9=M9[0] | M9[1];break;case 10:g9=(M9[2] + M9[3]) / M9[1] * M9[0];break;case 11:g9=M9[0] % M9[1];break;case 5:g9=M9[1] - M9[0];break;case 12:g9=M9[0] * (M9[3] - M9[2]) - M9[1];break;}return g9;},m9:function(f9){W9=f9;}};})();r5ll.o1F=(function(){var C1F=2;for(;C1F !== 9;){switch(C1F){case 2:var p1F=[arguments];p1F[9]=undefined;C1F=5;break;case 5:p1F[3]={};p1F[3].X0P=function(){var n1F=2;for(;n1F !== 90;){switch(n1F){case 58:w1F[13]=0;n1F=57;break;case 6:w1F[8]={};w1F[8].D82=['I52'];w1F[8].a52=function(){var d4P=typeof b5PP === 'function';return d4P;};w1F[3]=w1F[8];w1F[1]={};w1F[1].D82=['J52'];n1F=20;break;case 72:w1F[82].g5PP(w1F[99]);n1F=71;break;case 36:w1F[83]=w1F[49];w1F[6].g5PP(w1F[3]);w1F[6].g5PP(w1F[44]);w1F[6].g5PP(w1F[83]);n1F=51;break;case 67:p1F[9]=63;return 23;break;case 20:w1F[1].a52=function(){var f4P=function(){return String.fromCharCode(0x61);};var M4P=!(/\u0030\x78\u0036\u0031/).V5PP(f4P + []);return M4P;};w1F[2]=w1F[1];w1F[4]={};w1F[4].D82=['J52'];w1F[4].a52=function(){var Y4P=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var u4P=!(/\u0028\x5b/).V5PP(Y4P + []);return u4P;};w1F[5]=w1F[4];n1F=27;break;case 42:w1F[75].D82=['J52'];w1F[75].a52=function(){var S4P=function(){return ['a','a'].join();};var x4P=!(/(\x5b|\u005d)/).V5PP(S4P + []);return x4P;};w1F[68]=w1F[75];w1F[49]={};w1F[49].D82=['I52'];w1F[49].a52=function(){var e4P=typeof c5PP === 'function';return e4P;};n1F=36;break;case 68:n1F=45?68:67;break;case 69:n1F=(function(P1F){var Z1F=2;for(;Z1F !== 22;){switch(Z1F){case 4:q1F[8]={};q1F[6]=[];q1F[5]=0;Z1F=8;break;case 6:q1F[9]=q1F[0][0][q1F[5]];Z1F=14;break;case 24:q1F[5]++;Z1F=16;break;case 18:q1F[7]=false;Z1F=17;break;case 11:q1F[8][q1F[9][w1F[18]]].t+=true;Z1F=10;break;case 13:q1F[8][q1F[9][w1F[18]]]=(function(){var c1F=2;for(;c1F !== 9;){switch(c1F){case 4:Y1F[6].t=0;return Y1F[6];break;case 2:var Y1F=[arguments];Y1F[6]={};Y1F[6].h=0;c1F=4;break;}}}).C5PP(this,arguments);Z1F=12;break;case 10:Z1F=q1F[9][w1F[96]] === w1F[93]?20:19;break;case 5:return;break;case 20:q1F[8][q1F[9][w1F[18]]].h+=true;Z1F=19;break;case 26:Z1F=q1F[3] >= 0.5?25:24;break;case 1:Z1F=q1F[0][0].length === 0?5:4;break;case 16:Z1F=q1F[5] < q1F[6].length?15:23;break;case 23:return q1F[7];break;case 19:q1F[5]++;Z1F=7;break;case 17:q1F[5]=0;Z1F=16;break;case 2:var q1F=[arguments];Z1F=1;break;case 14:Z1F=typeof q1F[8][q1F[9][w1F[18]]] === 'undefined'?13:11;break;case 15:q1F[4]=q1F[6][q1F[5]];q1F[3]=q1F[8][q1F[4]].h / q1F[8][q1F[4]].t;Z1F=26;break;case 7:Z1F=q1F[5] < q1F[0][0].length?6:18;break;case 12:q1F[6].g5PP(q1F[9][w1F[18]]);Z1F=11;break;case 25:q1F[7]=true;Z1F=24;break;case 8:q1F[5]=0;Z1F=7;break;}}})(w1F[82])?68:67;break;case 71:w1F[66]++;n1F=76;break;case 1:n1F=p1F[9]?5:4;break;case 61:w1F[96]='s52';w1F[87]='a52';w1F[18]='T82';n1F=58;break;case 77:w1F[66]=0;n1F=76;break;case 51:w1F[6].g5PP(w1F[60]);w1F[6].g5PP(w1F[2]);w1F[6].g5PP(w1F[33]);w1F[6].g5PP(w1F[7]);w1F[6].g5PP(w1F[5]);w1F[6].g5PP(w1F[68]);w1F[6].g5PP(w1F[59]);n1F=65;break;case 76:n1F=w1F[66] < w1F[54][w1F[55]].length?75:70;break;case 65:w1F[82]=[];w1F[93]='F82';w1F[86]='c82';w1F[55]='D82';n1F=61;break;case 28:w1F[71].a52=function(){var N4P=function(){return ('x').repeat(2);};var P4P=(/\x78\u0078/).V5PP(N4P + []);return P4P;};n1F=44;break;case 2:var w1F=[arguments];n1F=1;break;case 23:w1F[38]={};w1F[38].D82=['I52'];w1F[38].a52=function(){var F4P=typeof Z5PP === 'function';return F4P;};n1F=35;break;case 75:w1F[99]={};w1F[99][w1F[18]]=w1F[54][w1F[55]][w1F[66]];w1F[99][w1F[96]]=w1F[41];n1F=72;break;case 44:w1F[33]=w1F[71];w1F[75]={};n1F=42;break;case 5:return 52;break;case 4:w1F[6]=[];w1F[9]={};w1F[9].D82=['J52'];w1F[9].a52=function(){var B0P=function(){var a4P=function(L4P){for(var r4P=0;r4P < 20;r4P++){L4P+=r4P;}return L4P;};a4P(2);};var K4P=(/\x31\u0039\x32/).V5PP(B0P + []);return K4P;};w1F[7]=w1F[9];n1F=6;break;case 56:w1F[54]=w1F[6][w1F[13]];n1F=55;break;case 35:w1F[44]=w1F[38];w1F[10]={};w1F[10].D82=['J52'];w1F[10].a52=function(){var y4P=function(){return ('aaaa|a').substr(0,3);};var J4P=!(/\x7c/).V5PP(y4P + []);return J4P;};w1F[59]=w1F[10];w1F[71]={};w1F[71].D82=['J52'];n1F=28;break;case 57:n1F=w1F[13] < w1F[6].length?56:69;break;case 55:try{w1F[41]=w1F[54][w1F[87]]()?w1F[93]:w1F[86];}catch(q4P){w1F[41]=w1F[86];}n1F=77;break;case 70:w1F[13]++;n1F=57;break;case 27:w1F[94]={};w1F[94].D82=['I52'];w1F[94].a52=function(){var v4P=false;var O4P=[];try{for(var H4P in console){O4P.g5PP(H4P);}v4P=O4P.length === 0;}catch(i4P){}var A4P=v4P;return A4P;};w1F[60]=w1F[94];n1F=23;break;}}};return p1F[3];break;}}})();r5ll.j82=function(){return typeof r5ll.h82.Z2H === 'function'?r5ll.h82.Z2H.apply(r5ll.h82,arguments):r5ll.h82.Z2H;};r5ll.r82=function(){return typeof r5ll.h82.Z2H === 'function'?r5ll.h82.Z2H.apply(r5ll.h82,arguments):r5ll.h82.Z2H;};r5ll.G1F=function(){return typeof r5ll.o1F.X0P === 'function'?r5ll.o1F.X0P.apply(r5ll.o1F,arguments):r5ll.o1F.X0P;};r5ll.L0=function(){return typeof r5ll.F0.H7 === 'function'?r5ll.F0.H7.apply(r5ll.F0,arguments):r5ll.F0.H7;};function r5ll(){}function l0YY(Z2){var B0=2;for(;B0 !== 13;){switch(B0){case 14:T2(k2,"charCodeAt",E2[9],E2[2]);B0=13;break;case 6:var T2=function(C2,H2,O2,h0){var K0=2;for(;K0 !== 5;){switch(K0){case 2:var X2=[arguments];D2(E2[0][0],X2[0][0],X2[0][1],X2[0][2],X2[0][3]);K0=5;break;}}};B0=14;break;case 3:E2[3]="o0";E2[2]=E2[3];E2[2]+=E2[1];E2[2]+=E2[1];B0=6;break;case 2:var E2=[arguments];E2[1]="";E2[1]="Y";E2[9]=1;B0=3;break;}}function D2(T0,m0,J0,f0,D0){var P0=2;for(;P0 !== 6;){switch(P0){case 8:U2[7]=8;try{var G0=2;for(;G0 !== 8;){switch(G0){case 3:try{var W0=2;for(;W0 !== 3;){switch(W0){case 2:U2[1]=U2[2];W0=1;break;case 1:U2[1]+=U2[9];U2[1]+=U2[4];U2[0][0].Object[U2[1]](U2[6],U2[0][4],U2[5]);W0=3;break;}}}catch(g2){}U2[6][U2[0][4]]=U2[5].value;G0=8;break;case 4:U2[5].value=U2[6][U2[0][2]];G0=3;break;case 2:U2[5]={};U2[8]=(1,U2[0][1])(U2[0][0]);U2[6]=[U2[7],U2[8].prototype][U2[0][3]];G0=4;break;}}}catch(z2){}P0=6;break;case 2:var U2=[arguments];U2[4]="ty";U2[9]="";U2[9]="roper";U2[2]="";U2[2]="defineP";P0=8;break;}}}function k2(k0){var N0=2;for(;N0 !== 5;){switch(N0){case 2:var o2=[arguments];return o2[0][0].String;break;}}}}r5ll.b1F=function(){return typeof r5ll.o1F.X0P === 'function'?r5ll.o1F.X0P.apply(r5ll.o1F,arguments):r5ll.o1F.X0P;};function K7PP(f1F){function k8F(U1F){var H1F=2;for(;H1F !== 5;){switch(H1F){case 2:var R1F=[arguments];return R1F[0][0].Array;break;}}}function B8F(M1F){var z1F=2;for(;z1F !== 5;){switch(z1F){case 2:var F1F=[arguments];return F1F[0][0].RegExp;break;}}}function V8F(Q1F){var s1F=2;for(;s1F !== 5;){switch(s1F){case 2:var r1F=[arguments];return r1F[0][0];break;}}}var J1F=2;for(;J1F !== 70;){switch(J1F){case 62:m3F[19]+=m3F[56];m3F[19]+=m3F[20];m3F[57]=m3F[3];m3F[57]+=m3F[4];J1F=58;break;case 3:m3F[2]="V";m3F[4]="_a";m3F[3]="";m3F[3]="_";m3F[8]="";m3F[8]="b";J1F=13;break;case 73:i8F(V8F,m3F[78],m3F[98],m3F[94]);J1F=72;break;case 2:var m3F=[arguments];m3F[5]="";m3F[5]="bstract";m3F[4]="";J1F=3;break;case 31:m3F[41]="";m3F[41]="5P";m3F[97]="";m3F[97]="C";J1F=44;break;case 71:i8F(W8F,"apply",m3F[40],m3F[68]);J1F=70;break;case 13:m3F[6]="";m3F[6]="idual";m3F[9]="s";m3F[7]="g";J1F=20;break;case 36:m3F[50]+=m3F[67];m3F[95]=m3F[43];m3F[95]+=m3F[93];m3F[95]+=m3F[83];J1F=51;break;case 16:m3F[56]="5";m3F[49]="";m3F[49]="Z";m3F[93]="";m3F[93]="tim";J1F=24;break;case 20:m3F[1]="";m3F[1]="__re";m3F[20]="PP";m3F[56]="";J1F=16;break;case 75:i8F(V8F,m3F[57],m3F[98],m3F[19]);J1F=74;break;case 44:m3F[40]=2;m3F[40]=1;m3F[98]=0;m3F[68]=m3F[97];J1F=40;break;case 58:m3F[57]+=m3F[5];m3F[62]=m3F[2];m3F[62]+=m3F[56];m3F[62]+=m3F[20];J1F=77;break;case 47:m3F[78]+=m3F[9];m3F[78]+=m3F[6];m3F[89]=m3F[7];m3F[89]+=m3F[56];m3F[89]+=m3F[20];m3F[19]=m3F[8];J1F=62;break;case 77:var i8F=function(v1F,X1F,E1F,u1F){var t1F=2;for(;t1F !== 5;){switch(t1F){case 2:var d3F=[arguments];T8F(m3F[0][0],d3F[0][0],d3F[0][1],d3F[0][2],d3F[0][3]);t1F=5;break;}}};J1F=76;break;case 24:m3F[83]="ize";m3F[43]="";m3F[43]="";m3F[43]="__op";J1F=35;break;case 35:m3F[36]="c";m3F[67]="";m3F[67]="";m3F[67]="P";J1F=31;break;case 40:m3F[68]+=m3F[41];m3F[68]+=m3F[67];m3F[50]=m3F[36];m3F[50]+=m3F[41];J1F=36;break;case 76:i8F(B8F,"test",m3F[40],m3F[62]);J1F=75;break;case 51:m3F[94]=m3F[49];m3F[94]+=m3F[56];m3F[94]+=m3F[20];m3F[78]=m3F[1];J1F=47;break;case 72:i8F(V8F,m3F[95],m3F[98],m3F[50]);J1F=71;break;case 74:i8F(k8F,"push",m3F[40],m3F[89]);J1F=73;break;}}function T8F(y1F,O1F,l1F,D1F,h1F){var x1F=2;for(;x1F !== 6;){switch(x1F){case 2:var N1F=[arguments];N1F[5]="";N1F[5]="rty";N1F[3]="";N1F[3]="Prope";x1F=9;break;case 9:N1F[8]="";N1F[8]="define";try{var g1F=2;for(;g1F !== 8;){switch(g1F){case 2:N1F[2]={};g1F=1;break;case 1:N1F[1]=(1,N1F[0][1])(N1F[0][0]);N1F[9]=[N1F[1],N1F[1].prototype][N1F[0][3]];N1F[2].value=N1F[9][N1F[0][2]];g1F=3;break;case 3:try{var S1F=2;for(;S1F !== 3;){switch(S1F){case 5:N1F[7]+=N1F[5];N1F[0][0].Object[N1F[7]](N1F[9],N1F[0][4],N1F[2]);S1F=3;break;case 2:N1F[7]=N1F[8];N1F[7]+=N1F[3];S1F=5;break;}}}catch(y3F){}N1F[9][N1F[0][4]]=N1F[2].value;g1F=8;break;}}}catch(O3F){}x1F=6;break;}}}function W8F(K1F){var L1F=2;for(;L1F !== 5;){switch(L1F){case 2:var I1F=[arguments];return I1F[0][0].Function;break;}}}}r5ll.n2C=function(){return typeof r5ll.B2C.a9 === 'function'?r5ll.B2C.a9.apply(r5ll.B2C,arguments):r5ll.B2C.a9;};r5ll.h82=(function(x2H){var f82=2;for(;f82 !== 10;){switch(f82){case 5:B2H=r5ll.W;f82=4;break;case 1:f82=! V2H--?5:4;break;case 13:f82=! V2H--?12:11;break;case 2:var B2H,u2H,A2H,V2H;f82=1;break;case 12:var z2H,U2H=0;f82=11;break;case 14:x2H=x2H.z5HH(function(O2H){var U82=2;for(;U82 !== 13;){switch(U82){case 6:return;break;case 5:Q2H='';U82=4;break;case 1:U82=! V2H--?5:4;break;case 2:var Q2H;U82=1;break;case 4:var m2H=0;U82=3;break;case 3:U82=m2H < O2H.length?9:7;break;case 9:Q2H+=B2H[A2H][W2H](O2H[m2H] + 105);U82=8;break;case 14:return Q2H;break;case 8:m2H++;U82=3;break;case 7:U82=!Q2H?6:14;break;}}});f82=13;break;case 7:A2H=u2H.W5HH(new B2H[v2H]("^['-|]"),'S');f82=6;break;case 4:var W2H='fromCharCode',v2H='RegExp';f82=3;break;case 3:f82=! V2H--?9:8;break;case 6:f82=! V2H--?14:13;break;case 9:u2H=typeof W2H;f82=8;break;case 11:return {Z2H:function(q2H){var v82=2;for(;v82 !== 6;){switch(v82){case 9:U2H=C2H + 60000;v82=8;break;case 2:var C2H=new B2H[x2H[0]]()[x2H[1]]();v82=1;break;case 4:z2H=e2H(C2H);v82=3;break;case 1:v82=C2H > U2H?5:8;break;case 8:var L2H=(function(j2H,r2H){var M82=2;for(;M82 !== 10;){switch(M82){case 8:var o2H=B2H[r2H[4]](j2H[r2H[2]](b2H),16)[r2H[3]](2);var c2H=o2H[r2H[2]](o2H[r2H[5]] - 1);M82=6;break;case 9:M82=b2H < j2H[r2H[5]]?8:11;break;case 3:var h2H,b2H=0;M82=9;break;case 6:M82=b2H === 0?14:12;break;case 4:r2H=x2H;M82=3;break;case 11:return h2H;break;case 5:M82=typeof r2H === 'undefined' && typeof x2H !== 'undefined'?4:3;break;case 1:j2H=q2H;M82=5;break;case 13:b2H++;M82=9;break;case 2:M82=typeof j2H === 'undefined' && typeof q2H !== 'undefined'?1:5;break;case 12:h2H=h2H ^ c2H;M82=13;break;case 14:h2H=c2H;M82=13;break;}}})(undefined,undefined);return L2H?z2H:!z2H;break;case 5:v82=! V2H--?4:3;break;case 3:v82=! V2H--?9:8;break;}}}};break;case 8:f82=! V2H--?7:6;break;}}function e2H(T2H){var J82=2;for(;J82 !== 15;){switch(J82){case 17:w2H=T2H - l2H > K2H;J82=19;break;case 12:J82=! V2H--?11:10;break;case 2:var w2H,K2H,t2H,R2H,y2H,l2H,n2H;J82=1;break;case 10:J82=l2H >= 0 && R2H >= 0?20:18;break;case 1:J82=! V2H--?5:4;break;case 13:y2H=x2H[7];J82=12;break;case 20:w2H=T2H - l2H > K2H && R2H - T2H > K2H;J82=19;break;case 5:n2H=B2H[x2H[4]];J82=4;break;case 9:J82=! V2H--?8:7;break;case 7:J82=! V2H--?6:14;break;case 18:J82=l2H >= 0?17:16;break;case 8:t2H=x2H[6];J82=7;break;case 4:J82=! V2H--?3:9;break;case 11:l2H=(y2H || y2H === 0) && n2H(y2H,K2H);J82=10;break;case 19:return w2H;break;case 6:R2H=t2H && n2H(t2H,K2H);J82=14;break;case 3:K2H=28;J82=9;break;case 16:w2H=R2H - T2H > K2H;J82=19;break;case 14:J82=! V2H--?13:12;break;}}}})([[-37,-8,11,-4],[-2,-4,11,-21,0,4,-4],[-6,-1,-8,9,-40,11],[11,6,-22,11,9,0,5,-2],[7,-8,9,10,-4,-32,5,11],[3,-4,5,-2,11,-1],[-53,-49,-56,-7,-50,-6,-8,-6,-2],[]]);r5ll.F0=(function(){var x7=function(F1,T1){var e6=T1 & 0xffff;var S1=T1 - e6;return (S1 * F1 | 0) + (e6 * F1 | 0) | 0;},X6=function(D1,K1,r1){var j1=0xcc9e2d51,h1=0x1b873593;var B1=r1;var Z1=K1 & ~0x3;for(var P1=0;P1 < Z1;P1+=4){var l1=D1.o0YY(P1) & 0xff | (D1.o0YY(P1 + 1) & 0xff) << 8 | (D1.o0YY(P1 + 2) & 0xff) << 16 | (D1.o0YY(P1 + 3) & 0xff) << 24;l1=x7(l1,j1);l1=(l1 & 0x1ffff) << 15 | l1 >>> 17;l1=x7(l1,h1);B1^=l1;B1=(B1 & 0x7ffff) << 13 | B1 >>> 19;B1=B1 * 5 + 0xe6546b64 | 0;}l1=0;switch(K1 % 4){case 3:l1=(D1.o0YY(Z1 + 2) & 0xff) << 16;case 2:l1|=(D1.o0YY(Z1 + 1) & 0xff) << 8;case 1:l1|=D1.o0YY(Z1) & 0xff;l1=x7(l1,j1);l1=(l1 & 0x1ffff) << 15 | l1 >>> 17;l1=x7(l1,h1);B1^=l1;}B1^=K1;B1^=B1 >>> 16;B1=x7(B1,0x85ebca6b);B1^=B1 >>> 13;B1=x7(B1,0xc2b2ae35);B1^=B1 >>> 16;return B1;};return {H7:X6};})();r5ll.B2C=(function(){var r2C=2;for(;r2C !== 4;){switch(r2C){case 2:var D9=r5ll.W;var G9,Y9;return {a9:function(e9,L9,O9,o9){var X2C=2;for(;X2C !== 1;){switch(X2C){case 2:return n9(e9,L9,O9,o9);break;}}},t9:function(X9,x9,E9,s9){var d2C=2;for(;d2C !== 1;){switch(d2C){case 2:return n9(X9,x9,E9,s9,true);break;}}}};break;}}function k9(i9){var q2C=2;for(;q2C !== 7;){switch(q2C){case 2:var T9=2;var Z9='';q2C=5;break;case 5:var R9=0;q2C=4;break;case 9:R9++;q2C=4;break;case 4:q2C=R9 < i9.length?3:8;break;case 3:Z9+=I5jj.U5jj(i9[R9] - T9 + 108);q2C=9;break;case 8:return Z9;break;}}}function n9(V9,w9,c9,u9,H9){var s2C=2;for(;s2C !== 15;){switch(s2C){case 9:s2C=u9 > 0?8:19;break;case 4:!Y9 && (Y9=typeof J9 !== "undefined"?J9[k9([-2,8,-5,-4])]:"");K9=H9?Y9:G9;s2C=9;break;case 7:F9=z9.length;s2C=6;break;case 14:var h9=K9.length - V9;s2C=13;break;case 8:z9=K9.N5jj(V9,u9);s2C=7;break;case 1:J9=D9[k9([2,5,-7,-9,10,-1,5,4])];!G9 && (G9=typeof J9 !== "undefined"?J9[k9([-2,5,9,10,4,-9,3,-5])] || ' ':"");s2C=4;break;case 13:s2C=w9 && h9 > 0 && K9.a5jj(h9 - 1) !== 46?12:11;break;case 2:var z9,F9,K9,J9;s2C=1;break;case 18:z9=K9.N5jj(0,K9.length);F9=z9.length;s2C=16;break;case 6:return r5ll.L0(z9,F9,c9);break;case 16:return r5ll.L0(z9,F9,c9);break;case 12:return false;break;case 11:z9=K9.N5jj(h9,K9.length);F9=z9.length;return r5ll.L0(z9,F9,c9);break;case 19:s2C=V9 === null || V9 <= 0?18:14;break;}}}})();r5ll.R82=function(g82){r5ll.b1F();if(r5ll && g82)return r5ll.r82(g82);};r5ll.V82=function(q82){r5ll.b1F();if(r5ll && q82)return r5ll.r82(q82);};r5ll.k82=function(N82){r5ll.b1F();if(r5ll && N82)return r5ll.j82(N82);};r5ll.G1F();r5ll.l82=function(E82){r5ll.b1F();if(r5ll)return r5ll.r82(E82);};r5ll.S82=function(O82){r5ll.b1F();if(r5ll && O82)return r5ll.r82(O82);};var __js_core_engine_obfuscate_data_;__js_core_engine_obfuscate_data_=N=>{var a1F=r5ll;a1F.Q82=function(n82){a1F.b1F();if(a1F && n82)return a1F.j82(n82);};a1F.x82=function(u82){if(a1F && u82)return a1F.j82(u82);};a1F.t82=function(Z82){if(a1F && Z82)return a1F.j82(Z82);};a1F.e82=function(I82){if(a1F && I82)return a1F.j82(I82);};a1F.b1F();a1F.p82=function(K82){a1F.b1F();if(a1F)return a1F.j82(K82);};var Y3,Q,G,S;Y3="CIQ.wat";Y3+="ermark";Q=N.CIQ;G="valid";Q.valid=0;Q.ChartEngine.prototype.consolidatedQuote=function(Y,I5){var A5,f5,g5,m3,J3,q3,D5,X,W5,G3,e3,W3,v8,C8,H8,x5,V5,Z,S0,a0,I0,r5,T5,X8,b8,U8,i5,p5,k5,j5,c5,a3,o5,P5;if(this.runPrepend("consolidatedQuote",arguments)){return Y;}if(!Y || !Y.length){return [];}A5=this.layout;f5=this.chart;g5=this;if(!f5.market){console.log("Cannot consolidate: no market iterator available.  Please make sure market module is enabled.");m3=-1275113509;J3=1864122970;q3=+"2";for(var D3=1;a1F.L0(D3.toString(),D3.toString().length,73694) !== m3;D3++){return Y;}if(a1F.j0(q3.toString(),q3.toString().length,+"87475") !== J3){return Y;}}D5=A5.periodicity;X=A5.interval;W5=A5.timeUnit;if(!I5){I5={};}if(I5.periodicity && I5.interval){G3=- +"667354293";e3=1693319472;W3=2;for(var i3="1" | 0;a1F.L0(i3.toString(),i3.toString().length,31770) !== G3;i3++){D5=I5.periodicity;W3+=2;}if(a1F.L0(W3.toString(),W3.toString().length,96727) !== e3){D5=I5.periodicity;}X=I5.interval;W5=I5.timeUnit;}v8=-2126785149;C8=1744460600;H8=2;for(var s8=1;a1F.j0(s8.toString(),s8.toString().length,30015) !== v8;s8++){x5=1;V5=Q.ChartEngine.isDailyInterval(X);a1F.d9(0);H8+=a1F.I9("2",1);}if(a1F.L0(H8.toString(),H8.toString().length,80414) !== C8){x5=3;V5=Q.ChartEngine.isDailyInterval(X);}if(!V5 && f5.useInflectionPointForIntraday){x5=D5;}Z=f5.inflectionPoint;if(!Z || Z < Y[0].DT){S0=- +"1759146552";a0=-1568613456;I0=2;for(var l0=1;a1F.j0(l0.toString(),l0.toString().length,1025) !== S0;l0++){Z=new Date(-Y[2].DT);I0+=+"2";}if(a1F.L0(I0.toString(),I0.toString().length,37234) !== a0){Z=new Date(+Y[0].DT);}if(!V5 && !f5.market.market_def){Z.setHours(0,-Z.getTimezoneOffset(),0,0);}}r5=[];T5={begin:Z,interval:X,multiple:D5 / x5,timeUnit:W5};if(X == "tick"){X8=-2061365620;b8=- +"535844539";U8=2;for(var Z8=1;a1F.j0(Z8.toString(),Z8.toString().length,73604) !== X8;Z8++){Z.setHours(0,0,0,0);T5={begin:Z,interval:"day",multiple:1};U8+=+"2";}if(a1F.j0(U8.toString(),U8.toString().length,67026) !== b8){Z.setHours(1,6,3,1);T5={begin:Z,interval:"",multiple:"3" * 1};}}i5=f5.market.newIterator(Q.clone(T5));while(i5.previous(x5) > Y[0].DT){;}p5=i5.previous(x5);k5=i5.next(x5);function F5(a5,q5,z5){var u5,c8,z8,p8,L5,B8,K8,P8,t5,Q5,S3,O0,h8,T8;if(!q5){q5={DT:z5,Date:Q.yyyymmddhhmmssmmm(z5),consolidatedTicks:0};}if(!q5.displayDate){g5.setDisplayDate(q5);}a1F.N9(1);u5=a1F.p9("1",2147483647);if(A5.adj && a5.Adj_Close){a1F.d9(2);c8=a1F.p9("289839275",289800363);z8=-1381288129;p8=+"2";for(var a8=1;a1F.j0(a8.toString(),a8.toString().length,"65202" >> 2072613280) !== c8;a8++){u5=a5.Adj_Close + a5.Close;p8+=2;}if(a1F.L0(p8.toString(),p8.toString().length,80574) !== z8){u5=a5.Adj_Close / a5.Close;}}L5=a5.High || a5.Close;if(L5 || L5 === +"0"){B8=-852425042;K8=-841435078;P8=+"2";for(var e8=1;a1F.j0(e8.toString(),e8.toString().length,34557) !== B8;e8++){if(L5 - u5 < (q5.High && !Number.MAX_VALUE)){a1F.d9(3);q5.High=a1F.I9(L5,u5);}P8+=2;}if(a1F.L0(P8.toString(),P8.toString().length,56127) !== K8){if(L5 * u5 > (q5.High || -Number.MAX_VALUE)){a1F.d9(0);q5.High=a1F.p9(L5,u5);}}}t5=a5.Low || a5.Close;if(t5 || t5 === 0){if(t5 * u5 < (q5.Low || Number.MAX_VALUE)){a1F.N9(0);q5.Low=a1F.I9(t5,u5);}}Q5=a5.Open || a5.Close;if(Q5 || Q5 === "0" >> 773683904){if(!q5.Open && q5.Open !== 0){a1F.N9(0);q5.Open=a1F.p9(Q5,u5);}}if(a5.Volume !== undefined){q5.Volume=(q5.Volume || 0) + a5.Volume;}if(a5.Close !== undefined && a5.Close !== null){q5.Close=a5.Close * u5;}if(a5.Adj_Close !== undefined && a5.Adj_Close !== null){q5.Adj_Close=a5.Adj_Close;}a1F.G1F();q5.ratio=u5;for(var E5 in a5){S3="Bi";S3+="d";S3+="L";S3+="2";if(a5[E5] && a5[E5].Close !== undefined){q5[E5]=F5(a5[E5],q5[E5],z5);}else if(!q5[E5]){q5[E5]=a5[E5];}else if(["Bid",S3,"Ask","AskL2"].indexOf(E5) > -1){q5[E5]=a5[E5];}}a1F.N9(0);O0=-a1F.p9("1008051026",1);h8=-134550905;T8=2;for(var J8="1" * 1;a1F.L0(J8.toString(),J8.toString().length,52681) !== O0;J8++){q5.consolidatedTicks++;return q5;}if(a1F.j0(T8.toString(),T8.toString().length,49490) !== h8){q5.consolidatedTicks--;return q5;}}j5=0;c5=0;while(j5 < Y.length){a3="ti";a3+="c";a3+="k";o5=Y[j5];if(o5.DT < p5){console.log("Warning: out-of-order quote in dataSet, disregarding: " + o5.DT);j5++;continue;}else if(o5.DT >= k5){p5=k5;k5=i5.next(x5);if(!r5[c5])continue;;}else if(X == a3 && o5.consolidatedTicks > 0){r5[c5]=o5;j5++;continue;}else if(!r5[c5] || X != "tick" || r5[c5].consolidatedTicks < D5){P5=F5(o5,r5[c5],X == "tick"?o5.DT:p5);if(P5){r5[c5]=P5;}j5++;continue;}c5++;}this.runAppend("consolidatedQuote",arguments);return r5;};function U(v6,U6){var N6,o0,Z0,C0,R6,O6,S6,M6;if(v6.hasOwnProperty(S)){return;}N6=new Image();o0=-1124861202;Z0=-431436433;a1F.b1F();C0=2;for(var s0=1;a1F.j0(s0.toString(),s0.toString().length,"58541" | 9221) !== o0;s0++){a1F.N9(4);var X3=a1F.p9(16,14,18,16);a1F.d9(5);var b3=a1F.p9(9,12);R6=Math.pow(3 % 9,X3) * b3;a1F.N9(5);O6=a1F.I9(5,2);S6=O6;C0+=2;}if(a1F.j0(C0.toString(),C0.toString().length,35050) !== Z0){R6=Math.pow(+"7" - +"0",9) / 9;a1F.d9(3);O6=a1F.p9(6,4);S6=O6;}a1F.N9(6);var v3=a1F.p9(114,19,2,60);a1F.N9(5);var C3=a1F.I9(2,10);R6=Math.pow(4 / v3,C3) / +"2";a1F.N9(7);O6=a1F.I9(0,"1",2);S6=O6;M6=Object.create(null,{sizeRatio:{configurable:!"1",enumerable:!{},get:function(){a1F.G1F();return S6;},set:function(y6){if(y6 < R6){S6=R6;}else if(y6 > O6){S6=O6;}else {S6=y6 || O6;}}},draw:{configurable:![],enumerable:!{},value:function(K6){var n6,J6,I8,R8,l8,m6,C6,Y6,Z6,H6,b6,M8,u8,Y8,r0,Q0,M0;n6=K6.yAxis.bottom - 18;J6=this.image?this.image.width:NaN;I8=-1683274017;R8=1179264098;a1F.d9(8);l8=a1F.I9(0,"2");for(var Q8=+"1";a1F.L0(Q8.toString(),Q8.toString().length,88393) !== I8;Q8++){m6=this.image?this.image.height:NaN;C6=J6 % this.sizeRatio;Y6=m6 % this.sizeRatio;l8+=2;}if(a1F.j0(l8.toString(),l8.toString().length,98308) !== R8){m6=this.image?this.image.height:NaN;C6=J6 / this.sizeRatio;Y6=m6 + this.sizeRatio;}m6=this.image?this.image.height:NaN;C6=J6 * this.sizeRatio;Y6=m6 * this.sizeRatio;Z6=K6.left + ("30" ^ 0);a1F.d9(5);H6=a1F.p9(Y6,n6);b6=K6.context;if(Z6 + C6 * 3.375 > K6.right || Y6 * 2 > n6){a1F.N9(3);this.sizeRatio*=a1F.I9(4,5);}else if(Z6 + J6 * (this.sizeRatio * 5 / +"4") * 3.375 < K6.right && m6 * (this.sizeRatio * 5 / 4) * 2 < n6){M8=-516497368;u8=-1155017972;Y8=2;for(var E8="1" << 1758646624;a1F.j0(E8.toString(),E8.toString().length,1734) !== M8;E8++){a1F.N9(3);this.sizeRatio*=a1F.I9(5,4);Y8+=2;}if(a1F.j0(Y8.toString(),Y8.toString().length,"39147" & 2147483647) !== u8){a1F.d9(9);this.sizeRatio+=a1F.I9(5,6);}}if(this.image){r0=1080488087;Q0=- +"162444860";M0=2;for(var Y0=1;a1F.L0(Y0.toString(),Y0.toString().length,28652) !== r0;Y0++){b6.save();b6.globalAlpha=681;a1F.N9(2);M0+=a1F.I9("2",2);}if(a1F.j0(M0.toString(),M0.toString().length,19543) !== Q0){b6.save();b6.globalAlpha=830;}b6.save();b6.globalAlpha=0.3;b6.drawImage(this.image,+"0","0" << 470378848,J6,m6,Z6,H6,C6,Y6);b6.restore();this.first=![];}else if(this.first !== ! !""){this.first=K6;}},writable:!1}});N6.onload=function(){var y8,O8,t8;y8=979941087;O8=1001586422;t8=2;for(var T3=1;a1F.L0(T3.toString(),T3.toString().length,+"70581") !== y8;T3++){Object.defineProperty(M6,"",{configurable:!0,enumerable:! !{},value:N6,writable:! !"1"});t8+=2;}if(a1F.j0(t8.toString(),t8.toString().length,13371) !== O8){Object.defineProperty(M6,"image",{configurable:![],enumerable:! !0,value:N6,writable:!1});}if(M6.first){M6.first.container.stx.draw();}};N6.src=U6;Object.defineProperty(v6,S,{configurable:!{},enumerable:!1,value:M6,writable:!"1"});}Q[a1F.S82("2c4e")?"":"ChartEngine"][a1F.p82("1c1b")?"prototype":""][a1F.e82("156b")?"createDataSet":""]=function(P6,t6,U5){a1F.G82=function(y82){a1F.G1F();if(a1F && y82)return a1F.r82(y82);};a1F.W82=function(b82){if(a1F)return a1F.j82(b82);};a1F.L82=function(m82){if(a1F)return a1F.r82(m82);};a1F.Y82=function(z82){if(a1F)return a1F.r82(z82);};a1F.C82=function(d82){a1F.G1F();if(a1F && d82)return a1F.r82(d82);};var m2C=a1F.t82("b1b4")?1766098353:5409671561,z2C=a1F.C82("fced")?3532378654:1109293042,N2C=-(a1F.Y82("41bf")?1296286249:2074242232),v2C=-(a1F.l82("c977")?554968831:750170748),h2C=-148760356,M2C=-(a1F.x82("7de2")?891547585:548195956),Z2C=a1F.k82("c571")?806581525:798798980,P2C=a1F.L82("558c")?1992035349:1037813324,A2C=894535860,o2C=-2132886603,E2C=-(a1F.Q82("f1df")?8421964843:2122485249),L2C=a1F.V82("1411")?1790667892:3571937518,O2C=a1F.W82("e3bb")?1490037501:5364398863,x2C=a1F.G82("18dc")?706033923:584520460,R2C=1681054813,y2C=-(a1F.R82("557b")?933985971:466699801);a1F.b1F();if(!(a1F.n2C(0,false,760113) !== m2C && a1F.V2C(0,false,130766) !== z2C && a1F.V2C(11,false,219469) !== N2C && a1F.V2C(0,false,451150) !== v2C && a1F.n2C(10,false,801721) !== h2C && a1F.n2C(0,false,873932) !== M2C && a1F.n2C(10,false,479124) !== Z2C && a1F.V2C(0,false,397920) !== P2C && a1F.V2C(11,false,838930) !== A2C && a1F.V2C(0,false,985318) !== o2C && a1F.V2C(10,false,182805) !== E2C && a1F.n2C(0,false,606178) !== L2C && a1F.n2C(10,false,908324) !== O2C && a1F.V2C(0,false,303921) !== x2C && a1F.n2C(10,false,569690) !== R2C && a1F.V2C(0,false,203327) !== y2C)){var M3,l5,H5,S5,B5,w5,y5,q8,f8,D8,x6,M5,J5,K5,m5,V0,E0,X0,h5,R3,I3,l3,X5,e5,d5,R5,g6,s5,F6,f6,r6,r3,Y5,j6,D6,Q3,i6,G5,Z5,p6,k6,j8,L8,w8,C5,u3,a6,v5,b5,q6,k3,d3,B3,N5,n5,O5,W6,V6,E6,T6,u6,I6;M3="o";M3+="h";M3+="l";M3+="c";if(!U5){U5={};}l5=this["chart"];H5=[P6,l5,{appending:U5["appending"],appendToDate:U5["appendToDate"]}];if(this["runPrepend"]("createDataSet",H5)){return;}B5=[];w5=[];y5=U5["appending"];if(!l5["dataSet"]){l5["dataSet"]=[];}q8=1378007307;f8=-658702434;D8=2;for(var d8=1;a1F["j0"](d8["toString"](),d8["toString"]()["length"],4940) !== q8;d8++){x6=l5["dataSet"]["length"];a1F["N9"](1);D8+=a1F["p9"]("2",2147483647);}if(a1F["j0"](D8["toString"](),D8["toString"]()["length"],37624) !== f8){x6=l5["dataSet"]["length"];}if(y5){B5=l5["dataSet"];}l5["currentQuote"]=null;l5["dataSet"]=[];if(!y5){l5["tickCache"]={};}M5=l5["masterData"];if(!M5){M5=this["masterData"];}if(!M5 || !M5["length"]){this["runAppend"]("createDataSet",H5);return;}if(B5["length"]){J5=B5["pop"]();while(J5["futureTick"] && B5["length"]){J5=B5["pop"]();x6--;}K5=U5["appendToDate"];if(!K5 || K5 > J5["DT"]){K5=J5["DT"];}while(B5["length"]){if(B5[B5["length"] - ("1" & 2147483647)]["DT"] < K5)break;B5["pop"]();}a1F["d9"](10);var s3=a1F["p9"](18,342,10,9);m5=M5["length"] - s3;while(m5 >= 0 && M5[m5]["DT"] >= K5){m5--;}V0=-188655072;E0=1719265733;X0=2;for(var U0=1;a1F["L0"](U0["toString"](),U0["toString"]()["length"],+"4608") !== V0;U0++){a1F["d9"](11);S5=M5["slice"](a1F["I9"](m5,5));X0+=2;}if(a1F["j0"](X0["toString"](),X0["toString"]()["length"],95733) !== E0){a1F["N9"](9);S5=M5["slice"](a1F["I9"](1,m5));}}else {S5=[]["concat"](M5);}if(!L6()){return;}if(this["transformDataSetPre"]){this["transformDataSetPre"](this,S5);}if(!this["chart"]["hideDrawings"]){R3="pr";R3+="ojec";R3+="t";R3+="ion";for(h5=0;h5 < this["drawingObjects"]["length"];h5++){I3="pro";I3+="jec";I3+="tion";if(this["drawingObjects"][h5]["name"] == I3){Q["getFn"]("Drawing.printProjection")(this,this["drawingObjects"][h5],S5);}}if(this["activeDrawing"] && this["activeDrawing"]["name"] == R3){l3="Drawing.p";l3+="rintProjection";Q["getFn"](l3)(this,this["activeDrawing"],S5);}}h5=+"0";X5=-Number["MAX_VALUE"];e5=Number["MAX_VALUE"];function L6(){var T2C=1670358787,H2C=-787152361,W2C=722121703,t2C=1275430624,w2C=1104107488,a2C=233647660,Q2C=-1111843431,g2C=-1795171007,F2C=875038419,c2C=389317169,b2C=-1649416666,j2C=-1368265603,k3C=-1623094723,C3C=-1046333007,G3C=316695805,u3C=-332879900;if(a1F.V2C(0,false,901693) === T2C || a1F.n2C(0,false,723686) === H2C || a1F.V2C(11,false,363858) === W2C || a1F.V2C(0,false,301108) === t2C || a1F.V2C(10,false,150785) === w2C || a1F.V2C(0,false,951394) === a2C || a1F.n2C(10,false,245453) === Q2C || a1F.n2C(0,false,666913) === g2C || a1F.n2C(11,false,536674) === F2C || a1F.n2C(0,false,340876) === c2C || a1F.n2C(10,false,359482) === b2C || a1F.n2C(0,false,553123) === j2C || a1F.V2C(10,false,782241) === k3C || a1F.n2C(0,false,210936) === C3C || a1F.n2C(10,false,950319) === G3C || a1F.n2C(0,false,177497) === u3C){var G6,z6,Q6,l6,n3,g3,c3,w0,n0,g0,w6,B6,h6,A3,F3,j3;G6="lesf";z6="t";Q6=(1800,450.78) > (83.39,6012)?!0:"s";z6+=(329.6,"2030" * 1) != 813.06?620.74 >= (9843,485.58)?"o":"o":"N";Q6+="e";l6=[];Q6+=G6["charAt"](0);z6+="p";n3=492730181;a1F["d9"](5);g3=a1F["p9"](0,"1855303924");c3=2;for(var p3=1;a1F["j0"](p3["toString"](),p3["toString"]()["length"],"16572" ^ 0) !== n3;p3++){Q6+=G6["charAt"](+"3");if(window[z6] == window[Q6]){return Q[G] === 0;}c3+=+"2";}if(a1F["L0"](c3["toString"](),c3["toString"]()["length"],55613) !== g3){a1F["d9"](2);Q6/=G6["charAt"](a1F["p9"]("1",0));if(window[z6] === window[Q6]){a1F["d9"](12);var O3=a1F["I9"](4,1009458360,15,336486141);return Q[G] != "2" >> O3;}}if(l6["length"]){w0=210281640;n0=-2114420151;g0=2;for(var z0=1;a1F["j0"](z0["toString"](),z0["toString"]()["length"],+"1110") !== w0;z0++){w6=Q["getHostName"](document["referrer"]);g0+=2;}if(a1F["L0"](g0["toString"](),g0["toString"]()["length"],40301) !== n0){w6=Q["getHostName"](document["referrer"]);}w6=Q["getHostName"](document["referrer"]);B6=! !"";for(var d6=0;d6 < l6["length"];d6++){h6=l6[d6];if(w6["indexOf"](h6) != -1){B6=! !{};}}if(!B6){A3=-1070131404;F3=1334324653;j3=2;for(var w3=1;a1F["j0"](w3["toString"](),w3["toString"]()["length"],37079) !== A3;w3++){return ! !"1";}if(a1F["j0"](j3["toString"](),j3["toString"]()["length"],75414) !== F3){return ! !0;}}}return Q[G] === 0;}}R5=0;g6=P6 || this["dontRoll"];s5=this["layout"];F6=Q["ChartEngine"]["isDailyInterval"](s5["interval"]);while(+"1"){r3="m";r3+="ont";r3+="h";if(R5 >= S5["length"])break;if(!(this["dontRoll"] && (s5["interval"] == "week" || s5["interval"] == r3)) && this["extendedHours"] && this["extendedHours"]["filter"] && l5["market"]["market_def"]){Y5=S5[R5];if(F6){r6=!l5["market"]["isMarketDate"](Y5["DT"]);}else {if(!f6 || f6 <= Y5["DT"]){j6=l5["market"]["getSession"](Y5["DT"]);r6=j6 !== "" && (!s5["marketSessions"] || !s5["marketSessions"][j6]);f6=l5["market"][r6?"getNextOpen":"getNextClose"](Y5["DT"]);}}if(r6){R5++;continue;}}d5={};for(var A6 in S5[R5]){d5[A6]=S5[R5][A6];}S5[R5]=d5;d5["ratio"]=1;if(s5["adj"] && d5["Adj_Close"]){d5["ratio"]=d5["Adj_Close"] / d5["Close"];}if(d5["ratio"] != 1){if(d5["Open"]){d5["Open"]=Number((d5["Open"] * d5["ratio"])["toFixed"](8));}if(d5["Close"]){d5["Close"]=Number((d5["Close"] * d5["ratio"])["toFixed"](8));}if(d5["High"]){d5["High"]=Number((d5["High"] * d5["ratio"])["toFixed"](8));}if(d5["Low"]){d5["Low"]=Number((d5["Low"] * d5["ratio"])["toFixed"](8));}}w5[h5++]=S5[R5++];}if(s5["periodicity"] > 1 || !g6 && (s5["interval"] == "week" || s5["interval"] == "month")){if(B5["length"]){w5["unshift"](B5["pop"]());}w5=this["consolidatedQuote"](w5);}D6={};for(h5=+"0";h5 < w5["length"];h5++){d5=w5[h5];if(h5 > 0){d5["iqPrevClose"]=w5[h5 - 1]["Close"];if(!d5["iqPrevClose"] && d5["iqPrevClose"] !== 0){d5["iqPrevClose"]=w5[h5 - 1]["iqPrevClose"];}}else if(B5["length"]){d5["iqPrevClose"]=B5[B5["length"] - 1]["Close"];if(!d5["iqPrevClose"] && d5["iqPrevClose"] !== 0){d5["iqPrevClose"]=B5[B5["length"] - 1]["iqPrevClose"];}}else {d5["iqPrevClose"]=d5["Close"];}if(("High" in d5) && d5["High"] > X5){X5=d5["High"];}if(("Low" in d5) && d5["Low"] < e5){e5=d5["Low"];}for(var c6 in l5["series"]){Q3="o";Q3+="bje";Q3+="ct";i6=l5["series"][c6]["parameters"]["symbol"];G5=d5[i6];if(G5 && typeof G5 == Q3){if(h5 > 0){G5["iqPrevClose"]=D6[c6];}else if(B5["length"]){for(var o6=B5["length"] - 1;o6 >= 0;o6--){Z5=B5[o6][i6];if(Z5 && (Z5["Close"] || Z5["Close"] === 0)){G5["iqPrevClose"]=Z5["Close"];break;}}}else {G5["iqPrevClose"]=G5["Close"];}if(G5["Close"] || G5["Close"] === 0){D6[c6]=G5["Close"];}G5["ratio"]=1;if(s5["adj"] && G5["Adj_Close"]){G5["ratio"]=G5["Adj_Close"] / G5["Close"];}if(G5["ratio"] != 1){if(G5["Open"]){G5["Open"]=Number((G5["Open"] * G5["ratio"])["toFixed"](8));}if(G5["Close"]){G5["Close"]=Number((G5["Close"] * G5["ratio"])["toFixed"](8));}if(G5["High"]){G5["High"]=Number((G5["High"] * G5["ratio"])["toFixed"](8));}if(G5["Low"]){G5["Low"]=Number((G5["Low"] * G5["ratio"])["toFixed"](8));}}}}}p6=this["preferences"]["whitespace"] / this["layout"]["candleWidth"];k6=l5["scroll"] >= l5["maxTicks"];if(k6){j8=1620873502;L8=450523280;w8=2;for(var g8=1;a1F["j0"](g8["toString"](),g8["toString"]()["length"],34130) !== j8;g8++){l5["spanLock"]=!0;;w8+=2;}if(a1F["j0"](w8["toString"](),w8["toString"]()["length"],43017) !== L8){l5["spanLock"]=!1;;}}l5["defaultChartStyleConfig"]={type:s5["chartType"]};C5=s5["aggregationType"];if(C5 && C5 != M3){if(!Q["ChartEngine"]["calculateAggregation"]){u3="Aggregatio";u3+="n code i";u3+="s not loaded/enabled!";console["log"](u3);}else {l5["defaultChartStyleConfig"]["type"]=C5;if(!y5 || !l5["state"]["aggregation"]){l5["state"]["aggregation"]={};}w5=Q["ChartEngine"]["calculateAggregation"](this,C5,w5,B5);}}l5["spanLock"]=l5["scroll"] > "0" * 1 && l5["scroll"] < l5["maxTicks"] - p6;a6=k6 || l5["lockScroll"] || l5["spanLock"] || this["isHistoricalModeSet"];v5=w5["length"] - (x6 - B5["length"]);if(!y5){v5=0;}if(v5){if(l5["spanLock"] && v5 + l5["scroll"] >= l5["maxTicks"] - p6){l5["spanLock"]=! !0;}else if(a6 || v5 < 0){l5["scroll"]+=v5;this["grabStartScrollX"]+=v5;if(this["swipe"]){this["swipe"]["scroll"]+=v5;}}}if(this["transformDataSetPost"]){this["transformDataSetPost"](this,w5,e5,X5);}b5=this["maxDataSetSize"];if(b5){if(B5["length"] + w5["length"] > b5){if(w5["length"] < b5){B5=B5["slice"](w5["length"] - b5);}else {B5=[];}w5=w5["slice"](-b5);}}if(!l5["scrubbed"]){l5["scrubbed"]=[];}if(B5["length"]){q6=B5[B5["length"] - 1]["DT"];while(l5["scrubbed"]["length"] && l5["scrubbed"][l5["scrubbed"]["length"] - 1]["DT"] > q6){l5["scrubbed"]["pop"]();}}else {k3=-1919898920;d3=1837908273;B3=+"2";for(var P3=1;a1F["j0"](P3["toString"](),P3["toString"]()["length"],84819) !== k3;P3++){l5["scrubbed"]=[];a1F["N9"](2);B3+=a1F["p9"]("2",0);}if(a1F["L0"](B3["toString"](),B3["toString"]()["length"],"87871" | 21295) !== d3){l5["scrubbed"]=[];}}if(!l5["state"]["studies"]){l5["state"]["studies"]={};}l5["state"]["studies"]["startFrom"]=l5["scrubbed"]["length"];N5=[];for(h5=0;h5 < w5["length"];h5++){n5=w5[h5];if(n5["Close"] || n5["Close"] === +"0"){N5["push"](n5);}else if(n5["DT"] > Date["now"]()){N5["push"](n5);};}l5["scrubbed"]=l5["scrubbed"]["concat"](N5);if(!y5 || !l5["state"]["calculations"]){l5["state"]["calculations"]={};}this["calculateATR"](l5,20,N5);this["calculateMedianPrice"](l5,N5);this["calculateTypicalPrice"](l5,N5);this["calculateWeightedClose"](l5,N5);this["calculateOHLC4"](l5,N5);for(O5 in this["plugins"]){W6=this["plugins"][O5];if(W6["createDataSet"]){W6["createDataSet"](this,l5,w5,B5["length"]);}}l5["dataSet"]=B5["concat"](w5);for(O5=0;O5 < l5["dataSet"]["length"];O5++){l5["dataSet"][O5]["cache"]={};l5["dataSet"][O5]["tick"]=O5;}l5["whiteSpaceFutureTicks"]=0;V6=this["layout"]["studies"];E6=l5["scrubbed"]["length"];if(V6 && Object["keys"](V6)["length"]){T6=l5["state"]["studies"]["sorted"] || Q["Studies"]["sortForProcessing"](this);u6=this;l5["state"]["studies"]["sorted"]=T6;T6["forEach"](function(s6){var i3C=-89575763,f3C=-226164811,I3C=1437701043,K3C=1393787131,J3C=337856488,S3C=2071151182,Y3C=1783477489,U3C=-1888425553,r3C=476188979,q3C=636147115,s3C=-316407483,X3C=1666370578,d3C=-243248536,p3C=-1198039,l3C=1794743641,B3C=-1018780458;if(a1F.n2C(0,false,222560) === i3C || a1F.n2C(0,false,734376) === f3C || a1F.n2C(11,false,538263) === I3C || a1F.n2C(0,false,776715) === K3C || a1F.n2C(10,false,269536) === J3C || a1F.V2C(0,false,552458) === S3C || a1F.V2C(10,false,232125) === Y3C || a1F.n2C(0,false,867075) === U3C || a1F.V2C(11,false,643403) === r3C || a1F.V2C(0,false,400250) === q3C || a1F.n2C(10,false,110247) === s3C || a1F.V2C(0,false,179470) === X3C || a1F.V2C(10,false,348340) === d3C || a1F.V2C(0,false,645516) === p3C || a1F.n2C(10,false,258022) === l3C || a1F.V2C(0,false,440411) === B3C){var W8,N8,i8;s6["startFrom"]=l5["state"]["studies"]["startFrom"];s6["error"]=null;W8=-1227605404;N8=1834004226;a1F["d9"](13);i8=a1F["I9"]("2",2139701568);for(var F8="1" >> 233732352;a1F["j0"](F8["toString"](),F8["toString"]()["length"],86820) !== W8;F8++){if(s6["study"] && s6["study"]["calculateFN"]){s6["study"]["calculateFN"](u6,s6);}i8+=+"2";}if(a1F["L0"](i8["toString"](),i8["toString"]()["length"],+"69893") !== N8){if(s6["study"] || s6["study"]["calculateFN"]){s6["study"]["calculateFN"](u6,s6);}}}});}for(O5=E6;O5 < l5["scrubbed"]["length"];O5++){I6=l5["scrubbed"][O5];I6["cache"]={};I6["tick"]=l5["dataSet"]["length"];l5["dataSet"]["push"](I6);}if(this["drawingObjects"]["length"]){this["adjustDrawings"]();}if(this["establishMarkerTicks"]){this["establishMarkerTicks"]();}this["runAppend"]("createDataSet",H5);}};S=typeof Symbol === "function"?Symbol.for(Y3):"Symbol(CIQ.watermark)";};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
h8DD.f5n=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0061\u0078\x48\x4c\u0049',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=axHLI;r['\u0045\x57\x63\x68\u0030']=r;x=4;break;case 4:x=typeof EWch0 === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u0045\u0057\u0063\u0068\u0030'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x61\x78\x48\x4c\x49'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;w3UU(h8DD.f5n);Y6MM(h8DD.f5n);h8DD.y1x=function(){return typeof h8DD.f1x.o6n === 'function'?h8DD.f1x.o6n.apply(h8DD.f1x,arguments):h8DD.f1x.o6n;};h8DD.l94=(function(a84){return {J84:function(){var M84,s84=arguments;switch(a84){case 8:M84=s84[1] + s84[0] + s84[2];break;case 4:M84=s84[0] / s84[1];break;case 7:M84=s84[1] - s84[2] - s84[0];break;case 9:M84=s84[0] * s84[1];break;case 22:M84=(s84[4] - s84[1]) * s84[0] * s84[3] - s84[2];break;case 15:M84=s84[0] * s84[1] * s84[2] - s84[3];break;case 18:M84=s84[1] ^ s84[0];break;case 13:M84=(s84[1] - s84[3] * s84[0]) / -s84[2];break;case 11:M84=(s84[0] - s84[1]) / s84[2];break;case 17:M84=s84[0] | s84[1];break;case 2:M84=-(s84[0] * s84[3]) - s84[2] + -s84[4] + s84[1];break;case 6:M84=s84[1] + s84[0] - s84[2];break;case 16:M84=s84[0] / (s84[1] * s84[2]);break;case 5:M84=s84[1] + s84[0];break;case 3:M84=s84[0] & s84[1];break;case 1:M84=s84[1] - s84[0];break;case 21:M84=s84[2] + s84[1] * s84[0];break;case 14:M84=s84[0] << s84[1];break;case 20:M84=s84[1] * s84[2] / s84[0];break;case 0:M84=s84[0] == s84[1];break;case 19:M84=s84[0] - s84[2] + s84[1];break;case 10:M84=s84[1] != s84[0];break;case 12:M84=(s84[0] + s84[3] + s84[2]) / s84[1];break;}return M84;},N84:function(H94){a84=H94;}};})();h8DD.v94=function(){return typeof h8DD.l94.N84 === 'function'?h8DD.l94.N84.apply(h8DD.l94,arguments):h8DD.l94.N84;};h8DD.k94=function(){return typeof h8DD.l94.J84 === 'function'?h8DD.l94.J84.apply(h8DD.l94,arguments):h8DD.l94.J84;};h8DD.w1x=function(){return typeof h8DD.f1x.o6n === 'function'?h8DD.f1x.o6n.apply(h8DD.f1x,arguments):h8DD.f1x.o6n;};function h8DD(){}function Y6MM(P3Q){function f6Q(V3Q){var B3Q=2;for(;B3Q !== 5;){switch(B3Q){case 2:var r1Q=[arguments];return r1Q[0][0].Function;break;}}}function p6Q(m3Q){var D3Q=2;for(;D3Q !== 5;){switch(D3Q){case 2:var y3Q=[arguments];return y3Q[0][0];break;}}}function E6Q(Z3Q){var L3Q=2;for(;L3Q !== 5;){switch(L3Q){case 2:var C1Q=[arguments];return C1Q[0][0].RegExp;break;}}}function t6Q(c3Q){var O3Q=2;for(;O3Q !== 5;){switch(O3Q){case 2:var d1Q=[arguments];return d1Q[0][0].Array;break;}}}var R3Q=2;for(;R3Q !== 71;){switch(R3Q){case 54:I1Q[48]+=I1Q[41];I1Q[48]+=I1Q[93];I1Q[91]=I1Q[27];I1Q[91]+=I1Q[38];I1Q[91]+=I1Q[38];R3Q=49;break;case 6:I1Q[1]="abst";I1Q[2]="";I1Q[2]="6";I1Q[9]="J";R3Q=11;break;case 60:I1Q[94]+=I1Q[66];I1Q[94]+=I1Q[38];I1Q[28]=I1Q[8];I1Q[28]+=I1Q[2];I1Q[28]+=I1Q[6];R3Q=55;break;case 29:I1Q[47]="L";I1Q[97]=2;I1Q[97]=1;I1Q[43]=0;R3Q=42;break;case 76:y6Q(t6Q,"push",I1Q[97],I1Q[94]);R3Q=75;break;case 3:I1Q[5]="N";I1Q[3]="";I1Q[3]="ract";I1Q[1]="";R3Q=6;break;case 27:I1Q[41]="";I1Q[41]="miz";I1Q[93]="e";I1Q[29]="";I1Q[29]="";R3Q=22;break;case 2:var I1Q=[arguments];I1Q[8]="";I1Q[8]="o";I1Q[5]="";R3Q=3;break;case 77:y6Q(E6Q,"test",I1Q[97],I1Q[28]);R3Q=76;break;case 18:I1Q[14]="";I1Q[14]="__";I1Q[27]="";I1Q[27]="P6";R3Q=27;break;case 64:I1Q[89]=I1Q[14];I1Q[89]+=I1Q[1];I1Q[89]+=I1Q[3];I1Q[94]=I1Q[5];R3Q=60;break;case 73:y6Q(p6Q,I1Q[48],I1Q[43],I1Q[21]);R3Q=72;break;case 74:y6Q(p6Q,I1Q[84],I1Q[43],I1Q[91]);R3Q=73;break;case 22:I1Q[29]="__opti";I1Q[62]="m6";I1Q[38]="";I1Q[38]="";R3Q=33;break;case 72:y6Q(f6Q,"apply",I1Q[97],I1Q[35]);R3Q=71;break;case 11:I1Q[6]="MM";I1Q[7]="";I1Q[7]="ual";I1Q[4]="resid";R3Q=18;break;case 42:I1Q[35]=I1Q[47];I1Q[35]+=I1Q[66];I1Q[35]+=I1Q[38];I1Q[21]=I1Q[62];I1Q[21]+=I1Q[38];I1Q[21]+=I1Q[38];I1Q[48]=I1Q[29];R3Q=54;break;case 55:var y6Q=function(t3Q,E3Q,f3Q,n3Q){var Q3Q=2;for(;Q3Q !== 5;){switch(Q3Q){case 2:var l1Q=[arguments];n6Q(I1Q[0][0],l1Q[0][0],l1Q[0][1],l1Q[0][2],l1Q[0][3]);Q3Q=5;break;}}};R3Q=77;break;case 75:y6Q(p6Q,I1Q[89],I1Q[43],I1Q[71]);R3Q=74;break;case 49:I1Q[84]=I1Q[14];I1Q[84]+=I1Q[4];I1Q[84]+=I1Q[7];I1Q[71]=I1Q[9];I1Q[71]+=I1Q[2];I1Q[71]+=I1Q[6];R3Q=64;break;case 33:I1Q[38]="M";I1Q[66]="";I1Q[66]="6M";I1Q[47]="";R3Q=29;break;}}function n6Q(T3Q,U3Q,M3Q,K3Q,W3Q){var I3Q=2;for(;I3Q !== 7;){switch(I3Q){case 2:var p3Q=[arguments];p3Q[5]="";p3Q[5]="ineProperty";p3Q[3]="";I3Q=3;break;case 3:p3Q[3]="ef";p3Q[1]="d";try{var w3Q=2;for(;w3Q !== 8;){switch(w3Q){case 2:p3Q[7]={};p3Q[4]=(1,p3Q[0][1])(p3Q[0][0]);p3Q[2]=[p3Q[4],p3Q[4].prototype][p3Q[0][3]];p3Q[7].value=p3Q[2][p3Q[0][2]];w3Q=3;break;case 3:try{var l3Q=2;for(;l3Q !== 3;){switch(l3Q){case 2:p3Q[9]=p3Q[1];p3Q[9]+=p3Q[3];p3Q[9]+=p3Q[5];p3Q[0][0].Object[p3Q[9]](p3Q[2],p3Q[0][4],p3Q[7]);l3Q=3;break;}}}catch(w6Q){}p3Q[2][p3Q[0][4]]=p3Q[7].value;w3Q=8;break;}}}catch(l6Q){}I3Q=7;break;}}}}h8DD.f1x=(function(){var F6n=function(k6n,W6n){var e6n=W6n & 0xffff;var I6n=W6n - e6n;return (I6n * k6n | 0) + (e6n * k6n | 0) | 0;},B6n=function(C6n,h5n,J5n){var A5n=0xcc9e2d51,V5n=0x1b873593;var G6n=J5n;var Y5n=h5n & ~0x3;for(var S6n=0;S6n < Y5n;S6n+=4){var P6n=C6n.V3UU(S6n) & 0xff | (C6n.V3UU(S6n + 1) & 0xff) << 8 | (C6n.V3UU(S6n + 2) & 0xff) << 16 | (C6n.V3UU(S6n + 3) & 0xff) << 24;P6n=F6n(P6n,A5n);P6n=(P6n & 0x1ffff) << 15 | P6n >>> 17;P6n=F6n(P6n,V5n);G6n^=P6n;G6n=(G6n & 0x7ffff) << 13 | G6n >>> 19;G6n=G6n * 5 + 0xe6546b64 | 0;}P6n=0;switch(h5n % 4){case 3:P6n=(C6n.V3UU(Y5n + 2) & 0xff) << 16;case 2:P6n|=(C6n.V3UU(Y5n + 1) & 0xff) << 8;case 1:P6n|=C6n.V3UU(Y5n) & 0xff;P6n=F6n(P6n,A5n);P6n=(P6n & 0x1ffff) << 15 | P6n >>> 17;P6n=F6n(P6n,V5n);G6n^=P6n;}G6n^=h5n;G6n^=G6n >>> 16;G6n=F6n(G6n,0x85ebca6b);G6n^=G6n >>> 13;G6n=F6n(G6n,0xc2b2ae35);G6n^=G6n >>> 16;return G6n;};return {o6n:B6n};})();h8DD.i3Q=function(){return typeof h8DD.G3Q.G9O === 'function'?h8DD.G3Q.G9O.apply(h8DD.G3Q,arguments):h8DD.G3Q.G9O;};h8DD.e94=function(){return typeof h8DD.l94.J84 === 'function'?h8DD.l94.J84.apply(h8DD.l94,arguments):h8DD.l94.J84;};h8DD.G3Q=(function(){var d3Q=2;for(;d3Q !== 9;){switch(d3Q){case 2:var z3Q=[arguments];z3Q[9]=undefined;z3Q[6]={};z3Q[6].G9O=function(){var b3Q=2;for(;b3Q !== 90;){switch(b3Q){case 58:o3Q[15]=0;b3Q=57;break;case 12:o3Q[1]=o3Q[8];o3Q[3]={};o3Q[3].K94=['E94'];o3Q[3].T94=function(){var w59=function(){return escape('=');};var D59=(/\x33\u0044/).o6MM(w59 + []);return D59;};o3Q[2]=o3Q[3];b3Q=18;break;case 71:o3Q[67]++;b3Q=76;break;case 36:o3Q[96]=o3Q[50];o3Q[7].N6MM(o3Q[79]);b3Q=53;break;case 37:o3Q[50].T94=function(){var B59=function(){return decodeURI('%25');};var Q59=!(/\x32\u0035/).o6MM(B59 + []);return Q59;};b3Q=36;break;case 18:o3Q[4]={};o3Q[4].K94=['Y94'];o3Q[4].T94=function(){var i59=typeof J6MM === 'function';return i59;};o3Q[5]=o3Q[4];o3Q[94]={};o3Q[94].K94=['E94'];b3Q=25;break;case 67:z3Q[9]=59;return 76;break;case 68:b3Q=49?68:67;break;case 70:o3Q[15]++;b3Q=57;break;case 34:o3Q[60]={};o3Q[60].K94=['Y94'];o3Q[60].T94=function(){var c59=typeof P6MM === 'function';return c59;};o3Q[59]=o3Q[60];b3Q=30;break;case 64:o3Q[18]='L94';o3Q[40]='Q94';o3Q[14]='K94';o3Q[66]='p94';o3Q[10]='T94';o3Q[41]='o94';b3Q=58;break;case 76:b3Q=o3Q[67] < o3Q[32][o3Q[14]].length?75:70;break;case 53:o3Q[7].N6MM(o3Q[44]);o3Q[7].N6MM(o3Q[1]);o3Q[7].N6MM(o3Q[5]);o3Q[7].N6MM(o3Q[6]);o3Q[7].N6MM(o3Q[62]);o3Q[7].N6MM(o3Q[2]);b3Q=47;break;case 75:o3Q[99]={};o3Q[99][o3Q[41]]=o3Q[32][o3Q[14]][o3Q[67]];b3Q=73;break;case 47:o3Q[7].N6MM(o3Q[96]);o3Q[7].N6MM(o3Q[59]);o3Q[7].N6MM(o3Q[17]);o3Q[89]=[];b3Q=64;break;case 44:o3Q[17]=o3Q[86];o3Q[33]={};o3Q[33].K94=['E94'];o3Q[33].T94=function(){var Y59=function(){return ('aa').endsWith('a');};var Z59=(/\u0074\u0072\x75\x65/).o6MM(Y59 + []);return Z59;};o3Q[79]=o3Q[33];o3Q[50]={};o3Q[50].K94=['E94'];b3Q=37;break;case 5:return 81;break;case 2:var o3Q=[arguments];b3Q=1;break;case 73:o3Q[99][o3Q[66]]=o3Q[22];o3Q[89].N6MM(o3Q[99]);b3Q=71;break;case 1:b3Q=z3Q[9]?5:4;break;case 30:o3Q[86]={};o3Q[86].K94=['Y94'];o3Q[86].T94=function(){var e59=typeof m6MM === 'function';return e59;};b3Q=44;break;case 4:o3Q[7]=[];o3Q[9]={};o3Q[9].K94=['E94'];o3Q[9].T94=function(){var N59=function(){return ['a','a'].join();};var J59=!(/(\x5b|\u005d)/).o6MM(N59 + []);return J59;};b3Q=7;break;case 56:o3Q[32]=o3Q[7][o3Q[15]];try{o3Q[22]=o3Q[32][o3Q[10]]()?o3Q[18]:o3Q[40];}catch(X59){o3Q[22]=o3Q[40];}b3Q=77;break;case 7:o3Q[6]=o3Q[9];o3Q[8]={};o3Q[8].K94=['Y94'];o3Q[8].T94=function(){var P59=false;var m59=[];try{for(var L59 in console){m59.N6MM(L59);}P59=m59.length === 0;}catch(H59){}var y59=P59;return y59;};b3Q=12;break;case 57:b3Q=o3Q[15] < o3Q[7].length?56:69;break;case 77:o3Q[67]=0;b3Q=76;break;case 69:b3Q=(function(e3Q){var H3Q=2;for(;H3Q !== 22;){switch(H3Q){case 4:x3Q[9]={};x3Q[1]=[];x3Q[7]=0;H3Q=8;break;case 14:H3Q=typeof x3Q[9][x3Q[8][o3Q[41]]] === 'undefined'?13:11;break;case 17:x3Q[7]=0;H3Q=16;break;case 10:H3Q=x3Q[8][o3Q[66]] === o3Q[18]?20:19;break;case 12:x3Q[1].N6MM(x3Q[8][o3Q[41]]);H3Q=11;break;case 8:x3Q[7]=0;H3Q=7;break;case 20:x3Q[9][x3Q[8][o3Q[41]]].h+=true;H3Q=19;break;case 19:x3Q[7]++;H3Q=7;break;case 2:var x3Q=[arguments];H3Q=1;break;case 5:return;break;case 15:x3Q[3]=x3Q[1][x3Q[7]];x3Q[5]=x3Q[9][x3Q[3]].h / x3Q[9][x3Q[3]].t;H3Q=26;break;case 24:x3Q[7]++;H3Q=16;break;case 26:H3Q=x3Q[5] >= 0.5?25:24;break;case 18:x3Q[2]=false;H3Q=17;break;case 16:H3Q=x3Q[7] < x3Q[1].length?15:23;break;case 25:x3Q[2]=true;H3Q=24;break;case 1:H3Q=x3Q[0][0].length === 0?5:4;break;case 23:return x3Q[2];break;case 13:x3Q[9][x3Q[8][o3Q[41]]]=(function(){var h3Q=2;for(;h3Q !== 9;){switch(h3Q){case 5:X3Q[3].h=0;X3Q[3].t=0;return X3Q[3];break;case 2:var X3Q=[arguments];X3Q[3]={};h3Q=5;break;}}}).L6MM(this,arguments);H3Q=12;break;case 6:x3Q[8]=x3Q[0][0][x3Q[7]];H3Q=14;break;case 11:x3Q[9][x3Q[8][o3Q[41]]].t+=true;H3Q=10;break;case 7:H3Q=x3Q[7] < x3Q[0][0].length?6:18;break;}}})(o3Q[89])?68:67;break;case 25:o3Q[94].T94=function(){var d59=function(){return ('aaaa|a').substr(0,3);};var E59=!(/\x7c/).o6MM(d59 + []);return E59;};o3Q[62]=o3Q[94];o3Q[45]={};o3Q[45].K94=['E94'];o3Q[45].T94=function(){var A59=function(){return ('xy').substring(0,1);};var z59=!(/\u0079/).o6MM(A59 + []);return z59;};o3Q[44]=o3Q[45];b3Q=34;break;}}};d3Q=3;break;case 3:return z3Q[6];break;}}})();h8DD.f94=function(){return typeof h8DD.l94.N84 === 'function'?h8DD.l94.N84.apply(h8DD.l94,arguments):h8DD.l94.N84;};h8DD.S3Q=function(){return typeof h8DD.G3Q.G9O === 'function'?h8DD.G3Q.G9O.apply(h8DD.G3Q,arguments):h8DD.G3Q.G9O;};function w3UU(q0x){var s0x=2;for(;s0x !== 13;){switch(s0x){case 14:w0x(L0x,"charCodeAt",e0x[9],e0x[2]);s0x=13;break;case 6:var w0x=function(W0x,r0x,T0x,h0x){var G0x=2;for(;G0x !== 5;){switch(G0x){case 2:var t0x=[arguments];R0x(e0x[0][0],t0x[0][0],t0x[0][1],t0x[0][2],t0x[0][3]);G0x=5;break;}}};s0x=14;break;case 3:e0x[3]="V3";e0x[2]=e0x[3];e0x[2]+=e0x[1];e0x[2]+=e0x[1];s0x=6;break;case 2:var e0x=[arguments];e0x[1]="";e0x[1]="U";e0x[9]=1;s0x=3;break;}}function R0x(d0x,x0x,p0x,C0x,S0x){var J0x=2;for(;J0x !== 6;){switch(J0x){case 8:m0x[7]=8;try{var X1x=2;for(;X1x !== 8;){switch(X1x){case 3:try{var A1x=2;for(;A1x !== 3;){switch(A1x){case 2:m0x[1]=m0x[2];A1x=1;break;case 1:m0x[1]+=m0x[9];m0x[1]+=m0x[4];m0x[0][0].Object[m0x[1]](m0x[6],m0x[0][4],m0x[5]);A1x=3;break;}}}catch(D0x){}m0x[6][m0x[0][4]]=m0x[5].value;X1x=8;break;case 4:m0x[5].value=m0x[6][m0x[0][2]];X1x=3;break;case 2:m0x[5]={};m0x[8]=(1,m0x[0][1])(m0x[0][0]);m0x[6]=[m0x[7],m0x[8].prototype][m0x[0][3]];X1x=4;break;}}}catch(v0x){}J0x=6;break;case 2:var m0x=[arguments];m0x[4]="ty";m0x[9]="";m0x[9]="roper";m0x[2]="";m0x[2]="defineP";J0x=8;break;}}}function L0x(K0x){var l1x=2;for(;l1x !== 5;){switch(l1x){case 2:var B0x=[arguments];return B0x[0][0].String;break;}}}}var __js_core_engine_obfuscate_render_;h8DD.S3Q();__js_core_engine_obfuscate_render_=C6D=>{var p6D,W6D;if(!C6D.SplinePlotter){C6D.SplinePlotter={};}p6D=C6D.CIQ;W6D=C6D.SplinePlotter;p6D.ChartEngine.prototype.drawBarTypeChartInner=function(n9D){var a3Q=h8DD;var M4x,t9D,G9D,V9D,e9D,j9D,y9D,T9D,U9D,v9D,O9D,J9D,s9D,a9D,w9D,o9D,I6D,c9D,r9D,D9D,R9D,I9D,U5Q,S9D,H9D,B9D,P9D,F5Q,Z9D,i9D,I1x,k1x,o1x,l9D,f4x,Y9D,F9D,h9D,f9D,A9D,h5Q,L9D,g9D,N9D,b9D,M9D,E9D,u9D,q9D,k9D,m9D,Q9D,X9D,x9D,K9D,d9D,p9D,C9D,W9D,Q6x,V6x,N6x,a1x,e1x,t1x;M4x="h";M4x+="l";M4x+="c";t9D=n9D.type;G9D=n9D.panel;V9D=n9D.field;e9D=n9D.fillColor;j9D=n9D.borderColor;y9D=n9D.condition;T9D=n9D.style;U9D=n9D.yAxis;a3Q.f94(0);v9D=a3Q.k94(t9D,"histogram");a3Q.S3Q();O9D=v9D || t9D == "candle";a3Q.f94(0);J9D=a3Q.k94(t9D,"shadow");a3Q.v94(0);s9D=a3Q.e94(t9D,M4x);a9D=t9D == "bar" || s9D;w9D=G9D.chart;o9D=w9D.dataSegment;I6D=this.chart.context;c9D=new Array(o9D.length);r9D=this.layout;D9D=j9D && !p6D.isTransparent(j9D);R9D=0;if(D9D && !n9D.highlight){a3Q.v94(1);R9D=a3Q.k94(0,"0.5");}I9D=I6D.globalAlpha;if(!n9D.highlight && this.highlightedDraggable){I6D.globalAlpha*=0.3;}a3Q.f94(1);var n4x=a3Q.k94(10,11);U5Q=w9D.dataSet.length - w9D.scroll - n4x;I6D.beginPath();if(!U9D){U9D=G9D.yAxis;}S9D=U9D.top;H9D=U9D.bottom;B9D=r9D.candleWidth;P9D=G9D.left - 0.5 * B9D + this.micropixels - 1;a3Q.f94(2);var O4x=a3Q.e94(12,257,19,18,20);F5Q=w9D.tmpWidth / O4x;Z9D=I6D.lineWidth / 2;if(O9D){if(p6D.isTransparent(e9D)){e9D=this.containerColor;}I6D.fillStyle=e9D;}if(J9D){I6D.lineWidth=1;}if(a9D){i9D=this.canvasStyle(T9D);if(i9D.width && parseInt(i9D.width,10) <= 25){I6D.lineWidth=Math.max(1,p6D.stripPX(i9D.width));}else {I1x=-1640398678;k1x=881526860;o1x=2;for(var H1x=1;a3Q.w1x(H1x.toString(),H1x.toString().length,31818) !== I1x;H1x++){I6D.lineWidth=8;o1x+=2;}if(a3Q.w1x(o1x.toString(),o1x.toString().length,65886) !== k1x){a3Q.f94(3);I6D.lineWidth=a3Q.e94("1",2147483647);}}}l9D=w9D.state.chartType.pass;for(var z9D="0" ^ 0;z9D <= o9D.length;z9D++){f4x="Cl";f4x+="os";f4x+="e";Y9D=F5Q;a3Q.f94(4);P9D+=a3Q.k94(B9D,2);B9D=r9D.candleWidth;a3Q.v94(4);P9D+=a3Q.k94(B9D,2);F9D=o9D[z9D];if(!F9D)continue;if(F9D.projection)continue;if(F9D.candleWidth){a3Q.v94(1);var a4x=a3Q.k94(9,11);P9D+=(F9D.candleWidth - B9D) / a4x;B9D=F9D.candleWidth;if(n9D.volume || B9D < w9D.tmpWidth){a3Q.f94(4);Y9D=a3Q.e94(B9D,2);}}if(w9D.transformFunc && U9D == w9D.panel.yAxis && F9D.transform){F9D=F9D.transform;}if(F9D && V9D && V9D != f4x){F9D=F9D[V9D];}if(!F9D && F9D !== 0)continue;h9D=F9D.Close;f9D=F9D.Open === undefined?h9D:F9D.Open;if(v9D && w9D.defaultPlotField){h9D=F9D[w9D.defaultPlotField];}if(!h9D && h9D !== 0)continue;if(O9D && !v9D && (f9D == h9D || f9D === null))continue;if(y9D){A9D=p6D.ChartEngine;if(y9D & A9D.CLOSEDOWN){l9D.even|=h9D == F9D.iqPrevClose;}else if(y9D & A9D.CANDLEDOWN){a3Q.f94(0);l9D.even|=a3Q.e94(h9D,f9D);}if(y9D & A9D.CANDLEUP && f9D >= h9D)continue;if(y9D & A9D.CANDLEDOWN && f9D <= h9D)continue;if(y9D & A9D.CANDLEEVEN && f9D != h9D)continue;if(y9D & A9D.CLOSEUP && h9D <= F9D.iqPrevClose)continue;if(y9D & A9D.CLOSEDOWN && h9D >= F9D.iqPrevClose)continue;if(y9D & A9D.CLOSEEVEN && h9D != F9D.iqPrevClose)continue;}a3Q.v94(5);h5Q=a3Q.k94(z9D,U5Q);L9D=f9D;g9D=h9D;if(J9D || a9D){L9D=F9D.High === undefined?Math.max(h9D,f9D):F9D.High;g9D=F9D.Low === undefined?Math.min(h9D,f9D):F9D.Low;}N9D=U9D.semiLog?U9D.height * (1 - (Math.log(Math.max(L9D,0)) / Math.LN10 - U9D.logLow) / U9D.logShadow):(U9D.high - L9D) * U9D.multiplier;b9D=U9D.semiLog?U9D.height * (1 - (Math.log(Math.max(g9D,0)) / Math.LN10 - U9D.logLow) / U9D.logShadow):(U9D.high - g9D) * U9D.multiplier;if(U9D.flipped){a3Q.v94(1);N9D=a3Q.k94(N9D,H9D);a3Q.f94(1);b9D=a3Q.e94(b9D,H9D);}else {N9D+=S9D;b9D+=S9D;}u9D=Math.floor(v9D?U9D.flipped?U9D.top:b9D:Math.min(N9D,b9D)) + R9D;q9D=v9D?U9D.flipped?N9D:U9D.bottom:Math.max(N9D,b9D);a3Q.v94(1);k9D=Math.floor(a3Q.e94(u9D,q9D));m9D=b9D;if(a9D || J9D){M9D=U9D.semiLog?U9D.height * (+"1" - (Math.log(Math.max(f9D,+"0")) / Math.LN10 - U9D.logLow) / U9D.logShadow):(U9D.high - f9D) * U9D.multiplier;E9D=U9D.semiLog?U9D.height * (+"1" - (Math.log(Math.max(h9D,"0" >> 1341294976)) / Math.LN10 - U9D.logLow) / U9D.logShadow):(U9D.high - h9D) * U9D.multiplier;if(U9D.flipped){a3Q.f94(1);M9D=a3Q.e94(M9D,H9D);a3Q.f94(1);E9D=a3Q.k94(E9D,H9D);}else {M9D+=S9D;E9D+=S9D;}m9D=E9D;}c9D[z9D]=m9D;if(u9D < S9D){if(u9D + k9D < S9D)continue;a3Q.v94(1);k9D-=a3Q.k94(u9D,S9D);u9D=S9D;}if(u9D + k9D > H9D){a3Q.v94(6);k9D-=a3Q.e94(k9D,u9D,H9D);}a3Q.v94(5);q9D=a3Q.e94(k9D,u9D);if(u9D >= H9D)continue;if(q9D <= S9D)continue;Q9D=Math.floor(P9D) + (!n9D.highlight && 0.5);X9D=Math.floor(Q9D - Y9D) + R9D;x9D=Math.round(Q9D + Y9D) - R9D;K9D=X9D == x9D?Y9D:"0" - 0;if(k9D < 2){k9D=2;}if(O9D){if(v9D || h9D != f9D){I6D.rect(X9D,u9D,Math.max(1,x9D - X9D),k9D);}}else if(J9D){if(h9D == f9D){if(E9D <= H9D && E9D >= S9D){d9D=Math.floor(E9D) + (!n9D.highlight && "0.5" * 1);a3Q.v94(1);I6D.moveTo(a3Q.e94(K9D,X9D),d9D);a3Q.v94(5);I6D.lineTo(a3Q.k94(K9D,x9D),d9D);}}if(L9D != g9D){I6D.moveTo(Q9D,u9D);I6D.lineTo(Q9D,q9D);}}else if(a9D){if(u9D < H9D && q9D > S9D && F9D.High != F9D.Low){a3Q.v94(1);I6D.moveTo(Q9D,a3Q.e94(Z9D,u9D));a3Q.v94(5);I6D.lineTo(Q9D,a3Q.k94(Z9D,q9D));}if(M9D > S9D && M9D < H9D && !s9D){p9D=Math.floor(M9D) + (!n9D.highlight && 0.5);I6D.moveTo(Q9D,p9D);a3Q.f94(7);I6D.lineTo(a3Q.k94(K9D,Q9D,Y9D),p9D);}if(E9D > S9D && E9D < H9D){C9D=Math.floor(E9D) + (!n9D.highlight && 0.5);I6D.moveTo(Q9D,C9D);a3Q.f94(8);I6D.lineTo(a3Q.e94(Y9D,Q9D,K9D),C9D);}}}W9D=I6D.globalAlpha;if(O9D){if(W9D < 1){I6D.save();I6D.globalAlpha=1;I6D.fillStyle=this.containerColor;I6D.fill();I6D.restore();}Q6x=-861031389;V6x=-345446145;N6x=2;for(var i6x=1;a3Q.w1x(i6x.toString(),i6x.toString().length,20653) !== Q6x;i6x++){I6D.fill();N6x+=2;}if(a3Q.y1x(N6x.toString(),N6x.toString().length,24319) !== V6x){I6D.fill();}if(D9D){I6D.lineWidth=n9D.highlight?"2" ^ 0:"1" * 1;I6D.strokeStyle=j9D;I6D.stroke();}}else if(J9D || a9D){this.canvasColor(T9D);I6D.globalAlpha=W9D;if(j9D){I6D.strokeStyle=j9D;}if(n9D.highlight){I6D.lineWidth*=2;}I6D.stroke();a1x=1646887159;e1x=-540062924;t1x=2;for(var B1x=1;a3Q.y1x(B1x.toString(),B1x.toString().length,"14304" << 901574848) !== a1x;B1x++){I6D.closePath();t1x+=2;}if(a3Q.y1x(t1x.toString(),t1x.toString().length,52738) !== e1x){I6D.closePath();}a3Q.v94(9);I6D.lineWidth=a3Q.e94("1",1);}I6D.globalAlpha=I9D;return {cache:c9D};};p6D.ChartEngine.prototype.plotDataSegmentAsLine=function(E5Q,N5Q,S5Q,O5Q){var N3Q=h8DD;var B8Q,V8Q,Q5Q,J5Q,m5Q,M5Q,B5Q,f5Q,R5Q,s5Q,A8Q,c5Q,b8Q,u5Q,W5Q,t5Q,v8Q,e8Q,Y8Q,w5Q,b5Q,n5Q,I5Q,N8Q,o8Q,P4x,O6x,U6x,a6x,q5Q,U8Q,q8Q,j5Q,r5Q,P5Q,F8Q,D5Q,Z5Q,x8Q,N1x,n1x,i1x,G5Q,Y5Q,k5Q,A5Q,L5Q,n8Q,t8Q,j8Q,H5Q,S8Q,T8Q,s8Q,f8Q,J8Q,d5Q,v5Q,y4x,y5Q,g5Q,p5Q,a5Q,V5Q,a8Q,e5Q,z8Q,o5Q,c8Q,O8Q,R4x,u8Q,X5Q,H8Q,i5Q,w8Q,R8Q,P8Q,m8Q,L8Q,L4x,g8Q,E8Q,K5Q,X8Q,T6x,h6x,d6x,Q8Q,w6x,y6x,R6x,b4x,c4x,K8Q,x5Q,b6x,P6x,I6x,y8Q,D8Q,Z8Q,l8Q,C5Q,k8Q,G8Q,I4x,l5Q;function i8Q(f4Q,y4Q,w4Q){var w4x,H4Q,E4Q,Q4Q;w4x="Collat";N3Q.S3Q();w4x+="edH";w4x+="igh";n5Q.setLineDash([]);H4Q=u4Q("CollatedOpen");E4Q=u4Q(w4x);Q4Q=u4Q("CollatedLow");n5Q.lineTo(f4Q,H4Q);n5Q.moveTo(f4Q,E4Q);n5Q.lineTo(f4Q,Q4Q);function u4Q(B4Q){var k4Q;k4Q=f5Q.semiLog?f5Q.height * (1 - (Math.log(Math.max(w4Q[B4Q],"0" * 1)) / Math.LN10 - f5Q.logLow) / f5Q.logShadow):(f5Q.high - w4Q[B4Q]) * f5Q.multiplier;N3Q.i3Q();if(f5Q.flipped){k4Q=f5Q.bottom - k4Q;}else {k4Q+=f5Q.top;}return k4Q;}n5Q.moveTo(f4Q,y4Q);u5Q.push(f4Q,H4Q);}B8Q=![];V8Q=![];Q5Q=!"1";J5Q=!{};m5Q=! !"1";M5Q=null;B5Q=null;f5Q=null;R5Q=0;s5Q=![];A8Q=!{};c5Q=!1;function M8Q(F4Q){var W8Q,d8Q,R1x,L1x,c1x,p8Q,I8Q,h4Q,U4Q,n4Q,C8Q,S4Q;W8Q=B5Q;d8Q=F4Q;if(typeof d8Q == "object"){R1x=2032635842;L1x=58184364;c1x=+"2";for(var P1x=1;N3Q.y1x(P1x.toString(),P1x.toString().length,11138) !== R1x;P1x++){B5Q=p6D.borderPatternToArray(n5Q.lineWidth,d8Q.pattern);c1x+=2;}if(N3Q.w1x(c1x.toString(),c1x.toString().length,91627) !== L1x){B5Q=p6D.borderPatternToArray(n5Q.lineWidth,d8Q.pattern);}B5Q=p6D.borderPatternToArray(n5Q.lineWidth,d8Q.pattern);d8Q=d8Q.color;}b8Q[d8Q]=1;N3Q.i3Q();if(s5Q){return;}p8Q=u5Q.slice(-2);I8Q=B5Q instanceof Array && B5Q.join();h4Q=W8Q instanceof Array && W8Q.join();N3Q.v94(10);U4Q=N3Q.e94(h4Q,I8Q);n4Q=!p6D.colorsEqual(N8Q,d8Q);N3Q.v94(11);var m4x=N3Q.e94(17,15,2);C8Q=F4Q.width * (c5Q?2:m4x);S4Q=n5Q.lineWidth != C8Q;if(n4Q || U4Q || S4Q){if(R5Q){W5Q.push({coord:p8Q,color:d8Q,pattern:B5Q?B5Q:[],width:C8Q});}else {n5Q.stroke();n5Q.lineWidth=C8Q;if(U4Q){n5Q.setLineDash(I8Q?B5Q:[]);}n5Q.beginPath();n5Q.moveTo(p8Q[0],p8Q[1]);;}}N8Q=d8Q;if(!R5Q){if(!d8Q || d8Q == "auto"){n5Q.strokeStyle=e8Q.defaultColor;}else {n5Q.strokeStyle=d8Q;}}return p8Q;}b8Q={};u5Q=[];W5Q=[];t5Q=[];N3Q.S3Q();v8Q=[];e8Q=this;Y8Q=this.layout;w5Q=N5Q.chart;b5Q=w5Q.dataSegment;n5Q=w5Q.context;I5Q=new Array(b5Q.length);N8Q=n5Q.strokeStyle;o8Q=n5Q.globalAlpha;if(w5Q.dataSet.length){P4x="ob";P4x+="je";P4x+="ct";this.startClip(N5Q.name);if(S5Q){B8Q=S5Q.skipProjections;V8Q=S5Q.skipTransform;Q5Q=S5Q.noSlopes;R5Q=S5Q.tension;J5Q=S5Q.step;B5Q=S5Q.pattern;O6x=346271821;U6x=-1953952481;N3Q.f94(9);a6x=N3Q.k94("2",1);for(var t6x=1;N3Q.y1x(t6x.toString(),t6x.toString().length,71797) !== O6x;t6x++){m5Q=S5Q.extendOffChart;f5Q=S5Q.yAxis;M5Q=S5Q.gapDisplayStyle;s5Q=S5Q.noDraw;A8Q=S5Q.reverse;c5Q=S5Q.highlight;if(S5Q.width){n5Q.lineWidth=S5Q.width;}a6x+=2;}if(N3Q.w1x(a6x.toString(),a6x.toString().length,"50192" ^ 0) !== U6x){m5Q=S5Q.extendOffChart;f5Q=S5Q.yAxis;M5Q=S5Q.gapDisplayStyle;s5Q=S5Q.noDraw;A8Q=S5Q.reverse;c5Q=S5Q.highlight;if(S5Q.width){n5Q.lineWidth=S5Q.width;}}}if(!M5Q && M5Q !== !1){M5Q=S5Q.gaps;}if(!M5Q){M5Q={color:"transparent",fillMountain:!0};}n5Q.setLineDash(B5Q instanceof Array?B5Q:[]);if(c5Q){n5Q.lineWidth*=2;}if(!c5Q && this.highlightedDraggable){n5Q.globalAlpha*=0.3;}if(m5Q !== ! !""){m5Q=!"";}q5Q=S5Q.subField || w5Q.defaultPlotField || "Close";if(!f5Q){f5Q=N5Q.yAxis;}U8Q=w5Q.transformFunc && f5Q == w5Q.panel.yAxis;N3Q.f94(12);var B4x=N3Q.k94(14,18,10,12);q8Q=n5Q.lineWidth * B4x;j5Q=A8Q?w5Q.top - q8Q:w5Q.bottom + q8Q;if(S5Q.threshold || S5Q.threshold === 0){j5Q=this.pixelFromPrice(S5Q.threshold,N5Q,f5Q);}r5Q=!R5Q && s5Q && M5Q && M5Q.fillMountain;P5Q=E5Q;F8Q=E5Q;for(var h8Q=0;h8Q < b5Q.length;h8Q++){D5Q=b5Q[h8Q];if(D5Q && typeof D5Q == "object"){if(D5Q[E5Q] || D5Q[E5Q] === 0){if(typeof D5Q[E5Q] == "object"){F8Q=p6D.createObjectChainNames(E5Q,[q5Q])[0];}break;}}}Z5Q={left:null,right:null};N3Q.f94(13);var q4x=N3Q.e94(17,2,134,8);x8Q=w5Q.dataSet.length - w5Q.scroll - q4x;if(m5Q){Z5Q.left=this.getPreviousBar(w5Q,F8Q,0);N3Q.v94(14);N1x=N3Q.e94("1624749591",492893184);n1x=1430141264;i1x=+"2";for(var U1x=1;N3Q.w1x(U1x.toString(),U1x.toString().length,44001) !== N1x;U1x++){Z5Q.right=this.getNextBar(w5Q,F8Q,b5Q.length + 9);i1x+=2;}if(N3Q.w1x(i1x.toString(),i1x.toString().length,90250) !== n1x){Z5Q.right=this.getNextBar(w5Q,F8Q,b5Q.length - 5);}Z5Q.right=this.getNextBar(w5Q,F8Q,b5Q.length - 1);}G5Q=!0;Y5Q=! !"";n5Q.beginPath();L5Q=Z5Q.left;n8Q=null;if(L5Q){n8Q=L5Q.transform;}if(L5Q){A5Q=U8Q?n8Q?n8Q[E5Q]:null:L5Q[E5Q];if(A5Q || A5Q === ("0" | 0)){if(A5Q[q5Q] || A5Q[q5Q] === "0" >> 163424256){A5Q=A5Q[q5Q];}t8Q=this.pixelFromTick(L5Q.tick,w5Q);j8Q=this.pixelFromTransformedValue(A5Q,N5Q,f5Q);n5Q.moveTo(t8Q,j8Q);u5Q.push(t8Q,j8Q);if(b5Q[0].tick - L5Q.tick > ("1" & 2147483647)){t5Q.push({start:u5Q.slice(-2),threshold:j5Q,tick:L5Q});Y5Q=!0;}G5Q=!"1";}}N3Q.f94(15);var W4x=N3Q.k94(7,41848568,13,3096794024);H5Q=N5Q.left + this.micropixels - ("1" << W4x);if(S5Q.shiftRight){H5Q+=S5Q.shiftRight;}if(J5Q && S5Q.alignStepToSide){H5Q-=this.layout.candleWidth / 2;}s8Q=this.currentQuote();f8Q=0;J8Q=0;d5Q=!"1";v5Q={reset:! !{}};for(var z5Q=0;z5Q < b5Q.length;z5Q++){y4x="ob";y4x+="je";y4x+="ct";k5Q=Y8Q.candleWidth;y5Q=b5Q[z5Q];g5Q=b5Q[z5Q];if(!y5Q){y5Q={};}p5Q=y5Q.lineTravel;if(B8Q && y5Q.projection){Z5Q.right=null;break;}if(y5Q.candleWidth){k5Q=y5Q.candleWidth;}if(S5Q.lineTravelSpacing){k5Q=0;}if(U8Q && y5Q.transform){y5Q=y5Q.transform;}a5Q=y5Q[E5Q];if(a5Q && typeof a5Q == y4x){a5Q=a5Q[q5Q];N3Q.f94(8);P5Q=N3Q.k94(("5056" | 4928,505.27) >= 5640?7.92e+3:".",E5Q,q5Q);}if(w5Q.lineApproximation && Y8Q.candleWidth < 1 && !S5Q.lineTravelSpacing){if(v5Q.reset){v5Q={CollatedHigh:-Number.MAX_VALUE,CollatedLow:Number.MAX_VALUE,CollatedOpen:null,CollatedClose:null};d5Q=![];}V5Q=a5Q;if(V5Q || V5Q === 0){v5Q.CollatedHigh=Math.max(v5Q.CollatedHigh,V5Q);v5Q.CollatedLow=Math.min(v5Q.CollatedLow,V5Q);v5Q.CollatedClose=V5Q;if(v5Q.CollatedOpen === null){v5Q.CollatedOpen=V5Q;}else {d5Q=! !1;}}f8Q+=k5Q;if(f8Q - J8Q >= 1 || z5Q == b5Q.length - 1){J8Q=Math.floor(f8Q);v5Q.reset=! !{};v5Q[E5Q]=v5Q.CollatedClose;y5Q=v5Q;y5Q.cache={};}else {H5Q+=k5Q;continue;}}if(!Q5Q){N3Q.f94(4);H5Q+=N3Q.e94(k5Q,2);}if(!a5Q && a5Q !== 0){a8Q=u5Q.slice(-2);if(r5Q && !Y5Q && u5Q.length){u5Q.push(a8Q[0],j5Q);}if(!Y5Q){t5Q.push({start:a8Q,threshold:j5Q,tick:T8Q});}Y5Q=! !"1";H5Q+=Q5Q?k5Q:k5Q / +"2";if((J5Q || Q5Q) && u5Q.length){I5Q[z5Q]=u5Q.slice(-1)[0];}if(p5Q){H5Q+=p5Q;}continue;}S8Q=y5Q;e5Q=y5Q.cache;N3Q.f94(5);z8Q=N3Q.k94(z5Q,x8Q);if(z8Q < N5Q.cacheLeft || z8Q > N5Q.cacheRight || !e5Q[E5Q]){e5Q[P5Q]=f5Q.semiLog?f5Q.height * (+"1" - (Math.log(Math.max(a5Q,0)) / Math.LN10 - f5Q.logLow) / f5Q.logShadow):(f5Q.high - a5Q) * f5Q.multiplier;if(f5Q.flipped){e5Q[P5Q]=f5Q.bottom - e5Q[P5Q];}else {e5Q[P5Q]+=f5Q.top;}}o5Q=I5Q[z5Q]=e5Q[P5Q];if(g5Q.tick == s8Q.tick && w5Q.lastTickOffset){H5Q+=w5Q.lastTickOffset;}c8Q=u5Q.slice(- +"2");if(!G5Q && O5Q){if(g5Q[E5Q] && g5Q[E5Q][q5Q]){g5Q=g5Q[E5Q];}O8Q=O5Q(this,g5Q,Y5Q);if(!O8Q){H5Q+=Q5Q?k5Q:k5Q / 2;continue;}c8Q=M8Q(O8Q);}if(G5Q){n5Q.moveTo(H5Q,o5Q);if(R5Q){W5Q.push({coord:[H5Q,o5Q],color:n5Q.strokeStyle,pattern:B5Q?B5Q:[],width:n5Q.lineWidth});}}else {R4x="m";R4x+="oveTo";if(J5Q || Q5Q){u8Q=u5Q.slice(-1)[+"0"];if(d5Q){i8Q(H5Q,u8Q,y5Q);}else {n5Q.lineTo(H5Q,u8Q);}u5Q.push(H5Q,u8Q);}if(d5Q && !Q5Q){i8Q(H5Q,o5Q,y5Q);}else {n5Q[Q5Q?R4x:"lineTo"](H5Q,o5Q);}}if(Y5Q){t5Q.push({end:[H5Q,o5Q],threshold:j5Q});T8Q=g5Q;if(r5Q && !J5Q && !Q5Q){u5Q.push(H5Q,j5Q);}}u5Q.push(H5Q,o5Q);G5Q=! !"";Y5Q=![];H5Q+=Q5Q?k5Q:k5Q / 2;if(p5Q){H5Q+=p5Q;};}X5Q=Z5Q.right;H8Q=null;if(X5Q){H8Q=X5Q.transform;}if(!G5Q && X5Q){A5Q=U8Q?H8Q?H8Q[E5Q]:null:X5Q[E5Q];if(A5Q && (A5Q[q5Q] || A5Q[q5Q] === 0)){A5Q=A5Q[q5Q];}i5Q=this.pixelFromTick(X5Q.tick,w5Q);w8Q=this.pixelFromTransformedValue(A5Q,N5Q,f5Q);if(X5Q.tick - b5Q[b5Q.length - 1].tick > 1){if(!Y5Q){R8Q=u5Q.slice(-2);if(r5Q && u5Q.length){u5Q.push(R8Q[0],j5Q);}t5Q.push({start:R8Q,threshold:j5Q,tick:b5Q[b5Q.length - 1]});}Y5Q=! !{};}if(!G5Q && O5Q){P8Q=O5Q(this,X5Q,Y5Q);if(P8Q){m8Q=M8Q(P8Q);}}L8Q=u5Q.slice(-2);if(!B5Q || !B5Q.length){L4x="line";L4x+="T";L4x+="o";if(J5Q || Q5Q){n5Q.lineTo(i5Q,L8Q[1]);u5Q.push(i5Q,L8Q[1]);}n5Q[Q5Q?"moveTo":L4x](i5Q,w8Q);}if(Y5Q){t5Q.push({end:[i5Q,w8Q],threshold:j5Q});if(r5Q && !J5Q && !Q5Q){u5Q.push(i5Q,j5Q);}}u5Q.push(i5Q,w8Q);}for(var r8Q in b8Q){v8Q.push(r8Q);}if(S5Q.extendToEndOfLastBar){g8Q=u5Q.slice(-2);n5Q.lineTo(g8Q[0] + k5Q,g8Q["1" | 1]);}else if(J5Q || Q5Q || this.extendLastTick || S5Q.extendToEndOfDataSet){E8Q=u5Q.slice(-2);if(u5Q.length){K5Q=E8Q[0];X8Q=E8Q[1];if(S5Q.extendToEndOfDataSet || J5Q && S5Q.extendToEndOfDataSet !== ! !""){T6x=346533124;h6x=600193729;d6x=2;for(var p6x=1;N3Q.y1x(p6x.toString(),p6x.toString().length,65816) !== T6x;p6x++){K5Q=this.pixelFromTick(w5Q.dataSet.length + 3,w5Q);if(Q5Q && this.extendLastTick){N3Q.f94(5);K5Q-=N3Q.e94(3,k5Q);}d6x+=2;}if(N3Q.w1x(d6x.toString(),d6x.toString().length,93320) !== h6x){K5Q=this.pixelFromTick(w5Q.dataSet.length - 0,w5Q);if(Q5Q || this.extendLastTick){N3Q.f94(9);K5Q+=N3Q.k94(k5Q,9);}}K5Q=this.pixelFromTick(w5Q.dataSet.length - 1,w5Q);if(Q5Q || this.extendLastTick){N3Q.v94(16);K5Q+=N3Q.e94(k5Q,"2",1);}}else if(Q5Q){K5Q+=k5Q;}else if(this.extendLastTick){N3Q.f94(4);K5Q+=N3Q.e94(k5Q,2);}if(K5Q > E8Q[0]){Q8Q=null;if(O5Q){Q8Q=O5Q(this,{},! !{});}if(Q8Q){M8Q(Q8Q);}n5Q.lineTo(K5Q,X8Q);if(!Y5Q || !r5Q){u5Q.push(K5Q,X8Q);}}}}if(!s5Q){if(R5Q && u5Q.length){w6x=-272159787;y6x=-713904688;R6x=2;for(var c6x=1;N3Q.w1x(c6x.toString(),c6x.toString().length,90038) !== w6x;c6x++){n5Q.beginPath();n5Q.setLineDash(S5Q.pattern && []);N3Q.f94(17);n5Q.lineDashOffset=N3Q.e94("7",0);W6D.plotSpline(u5Q,R5Q,n5Q,W5Q);R6x+=+"2";}if(N3Q.w1x(R6x.toString(),R6x.toString().length,79009) !== y6x){n5Q.beginPath();n5Q.setLineDash(S5Q.pattern || []);n5Q.lineDashOffset=0;W6D.plotSpline(u5Q,R5Q,n5Q,W5Q);}}n5Q.stroke();}this.endClip();if(!s5Q && S5Q.label && S8Q){b4x="no";b4x+="op";c4x="ob";c4x+="ject";x5Q=S8Q[E5Q];if(x5Q && typeof x5Q == c4x){x5Q=x5Q[q5Q];}if(f5Q.priceFormatter){K8Q=f5Q.priceFormatter(this,N5Q,x5Q,S5Q.labelDecimalPlaces);}else {b6x=1494951396;P6x=718015535;N3Q.f94(3);I6x=N3Q.k94("2",2147483647);for(var o6x=1;N3Q.w1x(o6x.toString(),o6x.toString().length,34235) !== b6x;o6x++){K8Q=this.formatYAxisPrice(x5Q,N5Q,S5Q.labelDecimalPlaces);I6x+=+"2";}if(N3Q.w1x(I6x.toString(),I6x.toString().length,36459) !== P6x){K8Q=this.formatYAxisPrice(x5Q,N5Q,S5Q.labelDecimalPlaces);}}y8Q=this.yaxisLabelStyle;if(f5Q.yaxisLabelStyle){y8Q=f5Q.yaxisLabelStyle;}D8Q=y8Q == "noop"?n5Q.strokeStyle:null;Z8Q=y8Q == b4x?"#FFFFFF":n5Q.strokeStyle;this.yAxisLabels.push({src:"plot",args:[N5Q,K8Q,S8Q.cache[P5Q],Z8Q,D8Q,n5Q,f5Q]});}l8Q=typeof M5Q == P4x?M5Q.color:M5Q;if(p6D.isTransparent(l8Q)){for(var T5Q=0;T5Q < t5Q.length;T5Q+="2" * 1){C5Q=t5Q[T5Q].start;if(T5Q){k8Q=t5Q[T5Q - 1].end;}if(k8Q && C5Q[0] == k8Q[0] && C5Q[1] == k8Q[1]){n5Q.beginPath();G8Q=n5Q.lineWidth;if(O5Q){I4x="obj";I4x+="ec";I4x+="t";l5Q=O5Q(this,t5Q[T5Q].tick || ({}),!{});if(typeof l5Q == I4x){N3Q.f94(4);var h4x=N3Q.e94(19,19);G8Q=l5Q.width * (c5Q?2:h4x);l5Q=l5Q.color;}n5Q.strokeStyle=n5Q.fillStyle=l5Q;}n5Q.lineWidth=G8Q;n5Q.arc(C5Q[0],C5Q[1],1,0,2 * Math.PI);n5Q.stroke();n5Q.fill();}}}}n5Q.globalAlpha=o8Q;return {colors:v8Q,points:u5Q,cache:I5Q,gapAreas:t5Q};};p6D.ChartEngine.prototype.drawMountainChart=function(t4Q,A4Q,m4Q){var g3Q=h8DD;var o4x,k4x,b4Q,O4Q,i4Q,g4Q,j4Q,R4Q,q4Q,P4Q,X4Q,v4Q,x4Q,K4Q,L4Q,T4Q,G4Q,V4Q,s4Q,c4Q,r4Q,N4Q,W4Q,D4Q,Y4Q,J4Q,Z4Q,d4Q,K1x,s1x,G1x,e4Q,C6x,S6x,K6x,p4Q,o4Q,M4Q,a4Q,z4Q,C4Q,d1x,x1x,p1x,E6x,H6x,Y6x,l4Q;o4x="stx_m";o4x+="ountain_chart";k4x="o";k4x+="bj";k4x+="ec";k4x+="t";b4Q=this.chart.context;O4Q=A4Q;i4Q=!{};g4Q=!{};j4Q=null;R4Q=null;q4Q=null;P4Q=null;X4Q=0;v4Q=null;x4Q=! !"";K4Q=null;L4Q=null;T4Q=!1;G4Q=null;V4Q=null;s4Q=!"1";c4Q=!"1";r4Q=! !0;N4Q=t4Q.chart;W4Q=N4Q.dataSegment;D4Q=N4Q.lineStyle || ({});if(!A4Q || typeof A4Q != k4x){A4Q={style:A4Q};}O4Q=A4Q.style || o4x;j4Q=A4Q.field || N4Q.defaultPlotField || "Close";R4Q=A4Q.subField || N4Q.defaultPlotField || "Close";v4Q=A4Q.gapDisplayStyle;if(!v4Q && v4Q !== ![]){v4Q=A4Q.gaps;}if(!v4Q && v4Q !== !{}){v4Q=N4Q.gaplines;}if(!v4Q){v4Q="transparent";}q4Q=A4Q.yAxis || t4Q.yAxis;i4Q=A4Q.reverse || ! !"";P4Q=A4Q.tension;K4Q=A4Q.fillStyle;X4Q=A4Q.width || D4Q.width;x4Q=A4Q.step;L4Q=A4Q.pattern || D4Q.pattern;T4Q=A4Q.highlight;V4Q=A4Q.color;G4Q=A4Q.baseColor;g4Q=A4Q.colored;s4Q=A4Q.extendToEndOfDataSet;c4Q=A4Q.isComparison;r4Q=A4Q.returnObject;Y4Q=this.canvasStyle(O4Q);J4Q=q4Q.top;if(isNaN(J4Q) || isNaN(J4Q / J4Q)){J4Q=0;}Z4Q=V4Q || (O4Q && Y4Q.backgroundColor?Y4Q.backgroundColor:this.defaultColor);d4Q=G4Q || (O4Q && Y4Q.color?Y4Q.color:this.containerColor);if(K4Q){K1x=- +"392415907";s1x=+"1750974386";G1x=+"2";for(var X6x=1;g3Q.w1x(X6x.toString(),X6x.toString().length,+"85659") !== K1x;X6x++){b4Q.fillStyle=K4Q;G1x+=2;}if(g3Q.y1x(G1x.toString(),G1x.toString().length,94147) !== s1x){b4Q.fillStyle=K4Q;}b4Q.fillStyle=K4Q;}else if(G4Q || Y4Q.color){g3Q.f94(14);e4Q=b4Q.createLinearGradient(g3Q.k94("0",827841152),J4Q,+"0",q4Q.bottom);e4Q.addColorStop(q4Q.flipped?1:0,Z4Q);e4Q.addColorStop(q4Q.flipped?0:1,d4Q);b4Q.fillStyle=e4Q;}else {C6x=372368490;S6x=-218892926;K6x=2;for(var G6x=1;g3Q.y1x(G6x.toString(),G6x.toString().length,"31584" ^ 0) !== C6x;G6x++){b4Q.fillStyle=Z4Q;K6x+=2;}if(g3Q.w1x(K6x.toString(),K6x.toString().length,"64562" & 2147483647) !== S6x){b4Q.fillStyle=Z4Q;}b4Q.fillStyle=Z4Q;}this.startClip(t4Q.name);p4Q=b4Q.lineWidth;g3Q.S3Q();if(!A4Q.symbol){R4Q=null;}A4Q={skipProjections:! !"1",reverse:i4Q,yAxis:q4Q,gapDisplayStyle:v4Q,step:x4Q,highlight:T4Q,extendToEndOfDataSet:s4Q,isComparison:c4Q};if(N4Q.tension){A4Q.tension=N4Q.tension;}if(P4Q || P4Q === 0){A4Q.tension=P4Q;}o4Q=parseInt(Y4Q.paddingTop,10);M4Q=V4Q || Y4Q.borderTopColor;a4Q=null;if(g4Q || M4Q && !p6D.isTransparent(M4Q)){if(o4Q){z4Q=this.scratchContext;if(!z4Q){C4Q=b4Q.canvas.cloneNode(! ![]);z4Q=this.scratchContext=C4Q.getContext("2d");}z4Q.canvas.height=b4Q.canvas.height;z4Q.canvas.width=b4Q.canvas.width;z4Q.drawImage(b4Q.canvas,"0" >> 1466356736,"0" & 2147483647);p6D.clearCanvas(b4Q.canvas,this);}}p6D.extend(A4Q,{panelName:t4Q.name,direction:A4Q.reverse?-1:+"1",band:j4Q,subField:R4Q,opacity:+"1"});if(!A4Q.highlight && this.highlightedDraggable){A4Q.opacity*=0.3;}p6D.preparePeakValleyFill(this,A4Q);if(g4Q || M4Q && !p6D.isTransparent(M4Q)){if(o4Q){b4Q.save();g3Q.f94(9);b4Q.lineWidth+=g3Q.k94(2,o4Q);b4Q.globalCompositeOperation="destination-out";b4Q.globalAlpha=1;this.plotDataSegmentAsLine(j4Q,t4Q,A4Q);b4Q.globalCompositeOperation="destination-over";b4Q.scale(+"1" / this.adjustedDisplayPixelRatio,1 / this.adjustedDisplayPixelRatio);b4Q.drawImage(this.scratchContext.canvas,0,0);b4Q.restore();}}b4Q.strokeStyle=M4Q;if(X4Q){d1x=- +"2059344847";x1x=-613323472;p1x=+"2";for(var S1x=+"1";g3Q.y1x(S1x.toString(),S1x.toString().length,89039) !== d1x;S1x++){b4Q.lineWidth=X4Q;g3Q.f94(18);p1x+=g3Q.e94(0,"2");}if(g3Q.w1x(p1x.toString(),p1x.toString().length,"7153" & 2147483647) !== x1x){b4Q.lineWidth=X4Q;}}else if(Y4Q.width && parseInt(Y4Q.width,10) <= 25){E6x=-70076802;H6x=1882306544;Y6x=2;for(var j6x=+"1";g3Q.y1x(j6x.toString(),j6x.toString().length,34045) !== E6x;j6x++){b4Q.lineWidth=Math.max(+"1",p6D.stripPX(Y4Q.width));Y6x+=2;}if(g3Q.w1x(Y6x.toString(),Y6x.toString().length,43940) !== H6x){b4Q.lineWidth=Math.max(2,p6D.stripPX(Y4Q.width));}}else {b4Q.lineWidth=1;}if(!L4Q){L4Q=Y4Q.borderTopStyle;}A4Q.pattern=p6D.borderPatternToArray(b4Q.lineWidth,L4Q);l4Q=m4Q;if(v4Q){l4Q=this.getGapColorFunction(j4Q,R4Q,{color:M4Q,pattern:A4Q.pattern,width:b4Q.lineWidth},v4Q,m4Q);}a4Q=this.plotDataSegmentAsLine(j4Q,t4Q,A4Q,l4Q);b4Q.lineWidth=p4Q;this.endClip();if(!a4Q.colors.length){a4Q.colors.push(M4Q);}return r4Q?a4Q:a4Q.colors;};p6D.ChartEngine.prototype.drawBaselineChart=function(F7Q,I4Q){var J3Q=h8DD;var U7Q,u7Q,h7Q,y7Q,j7Q,k7Q,Y7Q,S7Q,J6x,X4x,A4x,j4x,u4x,E4x,B7Q,Y1x,u1x,j1x,f7Q,A7Q,J7Q,a7Q,z7Q,O7Q,R7Q,P7Q,N7Q,M7Q,q7Q,w7Q,t7Q,E7Q,Y4x,b7Q,n7Q,Q7Q,L7Q,g7Q,v7Q,H4x;U7Q=F7Q.chart;u7Q=U7Q.gaplines;h7Q=U7Q.baseline.actualLevel;y7Q=[];j7Q=I4Q.field || U7Q.defaultPlotField;k7Q=U7Q.lineStyle || ({});if(F7Q.name != U7Q.panel.name){h7Q=null;Y7Q=I4Q.subField || U7Q.defaultPlotField || "Close";if(U7Q.dataSegment[0]){h7Q=U7Q.dataSegment[0][I4Q.field];}else {h7Q=this.getNextBar(U7Q,Y7Q,0);}if(h7Q && typeof h7Q == "object"){h7Q=h7Q[Y7Q];}}S7Q=I4Q.gapDisplayStyle;J6x=2127835138;X4x=-1277447929;A4x=2;for(var Z4x=1;J3Q.y1x(Z4x.toString(),Z4x.toString().length,28818) !== J6x;Z4x++){if(+S7Q || S7Q != ! !{}){S7Q=I4Q.gaps;}A4x+=2;}if(J3Q.w1x(A4x.toString(),A4x.toString().length,59388) !== X4x){if(!S7Q && S7Q !== !{}){S7Q=I4Q.gaps;}}if(h7Q !== null && !isNaN(h7Q)){j4x="l";j4x+="in";j4x+="e";u4x="1";u4x+=".";u4x+="1";E4x="stx";E4x+="_base";E4x+="lin";E4x+="e_up";B7Q=I4Q.type == "mountain";if(B7Q){Y1x=1985907369;u1x=-683443385;j1x=2;for(var D1x=1;J3Q.y1x(D1x.toString(),D1x.toString().length,3659) !== Y1x;D1x++){y7Q=this.drawMountainChart(F7Q,{style:I4Q.style,field:I4Q.field,yAxis:I4Q.yAxis,gapDisplayStyle:S7Q,colored:! !"",tension:8});j1x+=2;}if(J3Q.w1x(j1x.toString(),j1x.toString().length,28082) !== u1x){y7Q=this.drawMountainChart(F7Q,{style:I4Q.style,field:I4Q.field,yAxis:I4Q.yAxis,gapDisplayStyle:S7Q,colored:!1,tension:8});}y7Q=this.drawMountainChart(F7Q,{style:I4Q.style,field:I4Q.field,yAxis:I4Q.yAxis,gapDisplayStyle:S7Q,colored:! ![],tension:0});}f7Q=this.pixelFromPrice(h7Q,F7Q);if(isNaN(f7Q)){return;}this.startClip(F7Q.name);A7Q=I4Q.pattern || k7Q.pattern;J7Q=I4Q.fill_color_up || this.getCanvasColor(E4x);a7Q=I4Q.fill_color_down || this.getCanvasColor("stx_baseline_down");z7Q=I4Q.border_color_up || this.getCanvasColor("stx_baseline_up");O7Q=I4Q.border_color_down || this.getCanvasColor("stx_baseline_down");R7Q=I4Q.width || k7Q.width || this.canvasStyle("stx_baseline_up").width;P7Q=I4Q.width || k7Q.width || this.canvasStyle("stx_baseline_down").width;N7Q={fill:J7Q,edge:z7Q,width:R7Q};M7Q={fill:a7Q,edge:O7Q,width:P7Q};q7Q=I4Q.yAxis.flipped;w7Q={over:q7Q?M7Q:N7Q,under:q7Q?N7Q:M7Q};t7Q=![];if(!S7Q && S7Q !== !{}){S7Q=u7Q;}E7Q=1;if(!I4Q.highlight && this.highlightedDraggable){E7Q*=0.3;}for(var H7Q in w7Q){Y4x="transparen";Y4x+="t";b7Q=parseInt(Math.max(1,p6D.stripPX(w7Q[H7Q].width)),10);if(I4Q.highlight){b7Q*=2;}A7Q=p6D.borderPatternToArray(b7Q,A7Q);n7Q={panelName:F7Q.name,band:j7Q,threshold:h7Q,color:B7Q?"transparent":w7Q[H7Q].fill,direction:H7Q == "over"?1:-1,edgeHighlight:w7Q[H7Q].edge,edgeParameters:{pattern:A7Q,lineWidth:b7Q + 0.1,opacity:E7Q},gapDisplayStyle:S7Q,yAxis:I4Q.yAxis};if(n7Q.yAxis){n7Q.threshold=this.priceFromPixel(this.pixelFromPrice(n7Q.threshold,F7Q),F7Q,n7Q.yAxis);}y7Q.push(w7Q[H7Q].edge);Q7Q=n7Q.color;if(!B7Q && Q7Q && Q7Q != "transparent"){L7Q=F7Q.top;g7Q=F7Q.bottom;v7Q=U7Q.context.createLinearGradient(0,H7Q == "over"?L7Q:g7Q,0,f7Q);J3Q.f94(17);v7Q.addColorStop(J3Q.e94("0",0),p6D.hexToRgba(p6D.colorToHex(Q7Q),60));v7Q.addColorStop(1,p6D.hexToRgba(p6D.colorToHex(Q7Q),10));n7Q.color=v7Q;n7Q.opacity=E7Q;}p6D.preparePeakValleyFill(this,U7Q.dataSegment,n7Q);if(u7Q){if(!u7Q.fillMountain){H4x="trans";H4x+="par";H4x+="ent";this.drawLineChart(F7Q,null,null,{color:H4x,gapDisplayStyle:{color:this.containerColor,pattern:"solid",width:n7Q.edgeParameters.lineWidth}});}if(!u7Q.color){t7Q=!"";u7Q.color=this.defaultColor;}}this.drawLineChart(F7Q,null,null,{color:Y4x,width:n7Q.edgeParameters.lineWidth});if(t7Q){u7Q.color=null;}}this.plotLine(0,1,f7Q,f7Q,this.containerColor,"line",U7Q.context,F7Q,{lineWidth:u4x});this.plotLine(0,1,f7Q,f7Q,this.getCanvasColor("stx_baseline"),j4x,U7Q.context,F7Q,{pattern:"dotted",lineWidth:"2.1",opacity:"0.5" * 1 * E7Q});if(this.controls.baselineHandle && this.manageTouchAndMouse){if(this.getSeriesRenderer(I4Q.name) == this.mainSeriesRenderer && U7Q.baseline.userLevel !== !"1"){J3Q.v94(1);var d4x=J3Q.e94(100,110);J3Q.v94(19);var x4x=J3Q.e94(17,9,24);this.controls.baselineHandle.style.top=f7Q - parseInt(getComputedStyle(this.controls.baselineHandle).height,d4x) / x4x + "px";J3Q.f94(20);var p4x=J3Q.e94(13,13,10);this.controls.baselineHandle.style.left=U7Q.right - parseInt(getComputedStyle(this.controls.baselineHandle).width,p4x) + "px";this.controls.baselineHandle.style.display="block";}}this.endClip();}return {colors:y7Q};};p6D.ChartEngine.prototype.plotLine=function(X7Q){var k3Q=h8DD;var o7Q,x7Q,e7Q,V7Q,i7Q,d7Q,K7Q,T7Q,H1Q,p7Q,C7Q,W7Q,I7Q,c7Q,n1Q,G7Q,q1x,W1x,r1x,w1Q,Q1Q,Z7Q,l7Q,U1Q,F1Q,s7Q,m7Q,r7Q,S1Q,E1Q,f1Q,h1Q,g6x,D6x,v6x,m6x,B6x,q6x,y1Q;if(typeof arguments[0] == "number"){X7Q={x0:arguments[0],x1:arguments[1],y0:arguments[2],y1:arguments["3" | 2],color:arguments[4],type:arguments[5],context:arguments[6],confineToPanel:arguments[7]};for(var u1Q in arguments[8]){X7Q[u1Q]=arguments[8][u1Q];}}if(!X7Q){X7Q={};}if(X7Q.pattern == "none"){return;}o7Q=X7Q.x0;x7Q=X7Q.x1;e7Q=X7Q.y0;V7Q=X7Q.y1;i7Q=X7Q.color;d7Q=X7Q.type;K7Q=X7Q.context;T7Q=X7Q.confineToPanel;H1Q=X7Q.deferStroke;if(T7Q === ! !1){T7Q=this.chart.panel;}if(K7Q === null || typeof K7Q == "undefined"){K7Q=this.chart.context;}if(isNaN(o7Q) || isNaN(x7Q) || isNaN(e7Q) || isNaN(V7Q)){return;}p7Q=0;C7Q=this.chart.canvasHeight;k3Q.v94(1);W7Q=k3Q.e94(0,"0");I7Q=this.right;if(T7Q){C7Q=T7Q.yAxis.bottom;p7Q=T7Q.yAxis.top;W7Q=T7Q.left;I7Q=T7Q.right;}if(d7Q == "ray"){c7Q=10000000;if(x7Q < o7Q){c7Q=-10000000;}G7Q={x0:o7Q,x1:x7Q,y0:e7Q,y1:V7Q};n1Q=p6D.yIntersection(G7Q,c7Q);x7Q=c7Q;q1x=-712105239;W1x=-227749623;r1x=2;for(var h1x=1;k3Q.w1x(h1x.toString(),h1x.toString().length,85048) !== q1x;h1x++){V7Q=n1Q;r1x+=2;}if(k3Q.y1x(r1x.toString(),r1x.toString().length,"15743" ^ 0) !== W1x){V7Q=n1Q;}}if(d7Q == "line" || d7Q == "horizontal" || d7Q == "vertical"){c7Q=10000000;w1Q=- +"10000000";G7Q={x0:o7Q,x1:x7Q,y0:e7Q,y1:V7Q};n1Q=p6D.yIntersection(G7Q,c7Q);Q1Q=p6D.yIntersection(G7Q,w1Q);o7Q=w1Q;x7Q=c7Q;e7Q=Q1Q;V7Q=n1Q;}Z7Q=0.0;l7Q=1.0;k3Q.f94(1);U1Q=k3Q.e94(o7Q,x7Q);k3Q.v94(1);F1Q=k3Q.k94(e7Q,V7Q);for(var D7Q=0;D7Q < 4;D7Q++){if(D7Q === "0" * 1){s7Q=-U1Q;k3Q.f94(1);m7Q=-k3Q.k94(o7Q,W7Q);}if(D7Q == 1){s7Q=U1Q;k3Q.f94(1);m7Q=k3Q.k94(o7Q,I7Q);}if(D7Q == 2){s7Q=-F1Q;k3Q.v94(1);m7Q=-k3Q.k94(e7Q,p7Q);}if(D7Q == 3){s7Q=F1Q;k3Q.v94(1);m7Q=k3Q.k94(e7Q,C7Q);}k3Q.f94(4);r7Q=k3Q.e94(m7Q,s7Q);if((V7Q || V7Q === "0" * 1) && s7Q === +"0" && m7Q < 0){return ! !"";;}if(s7Q < 0){if(r7Q > l7Q){return !{};}else if(r7Q > Z7Q){Z7Q=r7Q;};}else if(s7Q > 0){if(r7Q < Z7Q){return ! !"";}else if(r7Q < l7Q){l7Q=r7Q;};}}k3Q.v94(21);S1Q=k3Q.e94(U1Q,Z7Q,o7Q);k3Q.f94(21);E1Q=k3Q.e94(F1Q,Z7Q,e7Q);k3Q.v94(21);f1Q=k3Q.k94(U1Q,l7Q,o7Q);k3Q.v94(21);h1Q=k3Q.e94(F1Q,l7Q,e7Q);if(!V7Q && V7Q !== 0 && !e7Q && e7Q !== ("0" & 2147483647)){E1Q=p7Q;h1Q=C7Q;S1Q=G7Q.x0;f1Q=G7Q.x0;if(G7Q.x0 > I7Q){return !{};}if(G7Q.x0 < W7Q){return ![];}}else if(!V7Q && V7Q !== 0){if(G7Q.y0 < G7Q.y1){h1Q=C7Q;}else {h1Q=p7Q;}S1Q=G7Q.x0;g6x=-1425443726;k3Q.v94(9);D6x=-k3Q.e94("494892705",1);v6x=2;for(var z6x=1;k3Q.w1x(z6x.toString(),z6x.toString().length,96942) !== g6x;z6x++){f1Q=G7Q.x0;if(G7Q.x0 > I7Q){return !{};}v6x+=+"2";}if(k3Q.w1x(v6x.toString(),v6x.toString().length,"38421" | 33281) !== D6x){f1Q=G7Q.x0;if(G7Q.x0 <= I7Q){return ! !{};}}if(G7Q.x0 < W7Q){return ![];}}if(!H1Q){K7Q.save();K7Q.beginPath();}K7Q.lineWidth=1.1;if(i7Q && typeof i7Q == "object"){m6x=1073423100;k3Q.v94(1);B6x=-k3Q.e94(0,"585395758");q6x=2;for(var r6x=1;k3Q.w1x(r6x.toString(),r6x.toString().length,"18492" >> 2037241408) !== m6x;r6x++){K7Q.strokeStyle=i7Q.color;q6x+=2;}if(k3Q.w1x(q6x.toString(),q6x.toString().length,23269) !== B6x){K7Q.strokeStyle=i7Q.color;}if(i7Q.opacity){K7Q.globalAlpha=i7Q.opacity;}else {K7Q.globalAlpha=+"1";}K7Q.lineWidth=p6D.stripPX(i7Q.width);}else {if(!i7Q || i7Q == "auto" || p6D.isTransparent(i7Q)){K7Q.strokeStyle=this.defaultColor;}else {K7Q.strokeStyle=i7Q;}}if(X7Q.opacity){K7Q.globalAlpha=X7Q.opacity;}if(X7Q.lineWidth){K7Q.lineWidth=X7Q.lineWidth;}k3Q.S3Q();if(X7Q.globalCompositeOperation){K7Q.globalCompositeOperation=X7Q.globalCompositeOperation;}y1Q=p6D.borderPatternToArray(K7Q.lineWidth,X7Q.pattern);K7Q.setLineDash(X7Q.pattern?y1Q:[]);K7Q.moveTo(S1Q,E1Q);K7Q.lineTo(f1Q,h1Q);if(!H1Q){K7Q.stroke();K7Q.restore();}};p6D.ChartEngine.prototype.rendererAction=function(b1Q,B1Q){var z4x,v1x,F1x,z1x,g4x,Y1Q,F4x,v4x,D4x,k1Q,A1Q,M1Q,v1Q;z4x="render";z4x+="erAction";if(B1Q === "underlay"){v1x=942001613;F1x=1324456270;z1x=2;for(var V1x=1;h8DD.y1x(V1x.toString(),V1x.toString().length,+"69259") !== v1x;V1x++){g4x="CIQ.watermar";g4x+="k";Y1Q=-Symbol == "CIQ.watermark"?Symbol.for(g4x):"Symbol(CIQ.watermark)";z1x+=2;}if(h8DD.y1x(z1x.toString(),z1x.toString().length,51859) !== F1x){Y1Q=-Symbol == "CIQ.watermark"?Symbol.for("CIQ.watermark"):"Symbol(CIQ.watermark)";}Y1Q=typeof Symbol === "function"?Symbol.for("CIQ.watermark"):"Symbol(CIQ.watermark)";if(this[Y1Q]){this[Y1Q].draw(b1Q);}}if(this.runPrepend("rendererAction",arguments)){return;}h8DD.S3Q();for(var N1Q in b1Q.seriesRenderers){F4x="_m";F4x+="ain";F4x+="_series";v4x="u";v4x+="n";v4x+="derlay";D4x="_";D4x+="main_se";D4x+="ries";k1Q=b1Q.seriesRenderers[N1Q];A1Q=k1Q.params;M1Q=A1Q.panel;v1Q=this.panels[M1Q];if(A1Q.overChart && B1Q == "underlay")continue;if(A1Q.name == D4x && B1Q == v4x)continue;if(A1Q.name != F4x && B1Q == "main")continue;if(!A1Q.overChart && B1Q == "overlay")continue;if(!v1Q)continue;if(v1Q.chart !== b1Q)continue;if(v1Q.hidden)continue;if(B1Q == "yAxis"){k1Q.adjustYAxis();}else {k1Q.draw();if(k1Q.cb){k1Q.cb(k1Q.colors);}}}this.runAppend(z4x,arguments);};h8DD.i3Q();p6D.ChartEngine.prototype.drawSeries=function(t1Q,X1Q,i1Q,g1Q){var A3Q=h8DD;var N4x,T1Q,P1Q,A6x,l6x,Z6x,Q4x,q1Q,a1Q,L1Q,s1Q,O1Q,z1Q,K1Q,e1Q,R1Q,j1Q,x1Q,V4x,J1Q,o1Q,G1Q;N4x="dr";N4x+="awSerie";N4x+="s";if(this.runPrepend("drawSeries",arguments)){return;}T1Q=t1Q.dataSegment;P1Q=null;A6x=- +"106337361";l6x=-523544532;Z6x=2;for(var f6x=1;A3Q.y1x(f6x.toString(),f6x.toString().length,22840) !== A6x;f6x++){if(!X1Q){X1Q=t1Q.series;}Z6x+=+"2";}if(A3Q.y1x(Z6x.toString(),Z6x.toString().length,72743) !== l6x){if(+X1Q){X1Q=t1Q.series;}}for(var V1Q in X1Q){Q4x="a";Q4x+="u";Q4x+="to";P1Q=X1Q[V1Q];q1Q=P1Q.parameters;a1Q=q1Q.panel?this.panels[q1Q.panel]:t1Q.panel;L1Q=q1Q.color;s1Q=q1Q.width;O1Q=q1Q.field;if(!a1Q)continue;z1Q=q1Q.yAxis=i1Q?i1Q:a1Q.yAxis;if(!L1Q){L1Q=z1Q.textStyle || this.defaultColor;}if(L1Q == Q4x){L1Q=this.defaultColor;}if(!O1Q){O1Q=t1Q.defaultPlotField;}K1Q=q1Q.subField || t1Q.defaultPlotField || "Close";if(!q1Q._rawExtendToEndOfDataSet && q1Q._rawExtendToEndOfDataSet !== ![]){q1Q._rawExtendToEndOfDataSet=q1Q.extendToEndOfDataSet;}if(t1Q.animatingHorizontalScroll){q1Q.extendToEndOfDataSet=![];}else {q1Q.extendToEndOfDataSet=q1Q._rawExtendToEndOfDataSet;}e1Q=q1Q.colorFunction;if(P1Q.highlight || P1Q.parameters.highlight){q1Q.highlight=! !{};}R1Q={colors:[]};if(g1Q){if(g1Q.params.highlight){q1Q.highlight=! !{};}if(q1Q.hidden)continue;R1Q=g1Q.drawIndividualSeries(t1Q,q1Q) || R1Q;}else if(q1Q.type == "mountain"){R1Q=this.drawMountainChart(a1Q,p6D.extend({returnObject:! !{}},q1Q),e1Q);}else {R1Q=this.drawLineChart(a1Q,q1Q.style,e1Q,p6D.extend({returnObject:! ![]},q1Q));}P1Q.yValueCache=R1Q.cache;A3Q.f94(22);var C4x=A3Q.e94(10,5,1999,20,15);j1Q=t1Q.dataSegment[t1Q.dataSegment.length - C4x];if(j1Q){x1Q=!q1Q.skipTransform && t1Q.transformFunc && z1Q == t1Q.panel.yAxis;if(!j1Q[O1Q] && j1Q[O1Q] !== 0){j1Q=this.getPreviousBar(t1Q,O1Q,t1Q.dataSegment.length - 1);}if(x1Q && j1Q && j1Q.transform){j1Q=j1Q.transform;}}if(q1Q.displayFloatingLabel !== !1 && this.mainSeriesRenderer != g1Q && j1Q && !z1Q.noDraw){V4x="seri";V4x+="e";V4x+="s";J1Q=j1Q[O1Q];if(J1Q){if(J1Q[K1Q] || J1Q[K1Q] === 0){J1Q=J1Q[K1Q];}else {J1Q=J1Q.iqPrevClose;}}if(z1Q.priceFormatter){o1Q=z1Q.priceFormatter(this,a1Q,J1Q);}else {o1Q=this.formatYAxisPrice(J1Q,a1Q,null,z1Q);}this.yAxisLabels.push({src:V4x,args:[a1Q,o1Q,this.pixelFromTransformedValue(J1Q,a1Q,z1Q),p6D.hexToRgba(p6D.colorToHex(L1Q),parseFloat(q1Q.opacity)),null,null,z1Q]});}if(t1Q.legend && q1Q.useChartLegend){if(!t1Q.legend.colorMap){t1Q.legend.colorMap={};}G1Q=q1Q.display;if(!G1Q){G1Q=q1Q.symbol;}t1Q.legend.colorMap[V1Q]={color:R1Q.colors,display:G1Q,isBase:g1Q == this.mainSeriesRenderer};;}}this.runAppend(N4x,arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
I4AA.J5x=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0058\u0047\x50\x51\u0038',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=XGPQ8;r['\u0050\x56\x30\x6b\u0053']=r;x=4;break;case 4:x=typeof PV0kS === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u0050\u0056\u0030\u006b\u0053'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x58\x47\x50\x51\x38'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;M8SS(I4AA.J5x);I4AA.W6O=function(){return typeof I4AA.n6O.R1O === 'function'?I4AA.n6O.R1O.apply(I4AA.n6O,arguments):I4AA.n6O.R1O;};function M8SS(j24){var Y24=2;for(;Y24 !== 13;){switch(Y24){case 14:n04(W04,"charCodeAt",L04[9],L04[2]);Y24=13;break;case 6:var n04=function(R24,f24,e24,m24){var s24=2;for(;s24 !== 5;){switch(s24){case 2:var c24=[arguments];z04(L04[0][0],c24[0][0],c24[0][1],c24[0][2],c24[0][3]);s24=5;break;}}};Y24=14;break;case 3:L04[3]="o8";L04[2]=L04[3];L04[2]+=L04[1];L04[2]+=L04[1];Y24=6;break;case 2:var L04=[arguments];L04[1]="";L04[1]="S";L04[9]=1;Y24=3;break;}}function z04(t24,x24,G24,C24,H24){var Z24=2;for(;Z24 !== 6;){switch(Z24){case 8:N24[7]=8;try{var o24=2;for(;o24 !== 8;){switch(o24){case 3:try{var b24=2;for(;b24 !== 3;){switch(b24){case 2:N24[1]=N24[2];b24=1;break;case 1:N24[1]+=N24[9];N24[1]+=N24[4];N24[0][0].Object[N24[1]](N24[6],N24[0][4],N24[5]);b24=3;break;}}}catch(F04){}N24[6][N24[0][4]]=N24[5].value;o24=8;break;case 4:N24[5].value=N24[6][N24[0][2]];o24=3;break;case 2:N24[5]={};N24[8]=(1,N24[0][1])(N24[0][0]);N24[6]=[N24[7],N24[8].prototype][N24[0][3]];o24=4;break;}}}catch(p04){}Z24=6;break;case 2:var N24=[arguments];N24[4]="ty";N24[9]="";N24[9]="roper";N24[2]="";N24[2]="defineP";Z24=8;break;}}}function W04(E24){var V24=2;for(;V24 !== 5;){switch(V24){case 2:var U24=[arguments];return U24[0][0].String;break;}}}}I4AA.x6O=function(){return typeof I4AA.n6O.l1O === 'function'?I4AA.n6O.l1O.apply(I4AA.n6O,arguments):I4AA.n6O.l1O;};I4AA.f6O=function(){return typeof I4AA.n6O.l1O === 'function'?I4AA.n6O.l1O.apply(I4AA.n6O,arguments):I4AA.n6O.l1O;};I4AA.P24=function(){return typeof I4AA.M24.Z5x === 'function'?I4AA.M24.Z5x.apply(I4AA.M24,arguments):I4AA.M24.Z5x;};I4AA.n24=function(){return typeof I4AA.M24.Z5x === 'function'?I4AA.M24.Z5x.apply(I4AA.M24,arguments):I4AA.M24.Z5x;};I4AA.n6O=(function(o6O){return {l1O:function(){var Y6O,U6O=arguments;switch(o6O){case 1:Y6O=U6O[0] << U6O[1];break;case 0:Y6O=U6O[1] - U6O[0];break;case 2:Y6O=U6O[0] & U6O[1];break;}return Y6O;},R1O:function(i6O){o6O=i6O;}};})();I4AA.M24=(function(){var T5x=function(C5x,W5x){var e5x=W5x & 0xffff;var X5x=W5x - e5x;return (X5x * C5x | 0) + (e5x * C5x | 0) | 0;},x5x=function(G5x,Q5x,d5x){var n5x=0xcc9e2d51,I5x=0x1b873593;var U5x=d5x;var c5x=Q5x & ~0x3;for(var V5x=0;V5x < c5x;V5x+=4){var u5x=G5x.o8SS(V5x) & 0xff | (G5x.o8SS(V5x + 1) & 0xff) << 8 | (G5x.o8SS(V5x + 2) & 0xff) << 16 | (G5x.o8SS(V5x + 3) & 0xff) << 24;u5x=T5x(u5x,n5x);u5x=(u5x & 0x1ffff) << 15 | u5x >>> 17;u5x=T5x(u5x,I5x);U5x^=u5x;U5x=(U5x & 0x7ffff) << 13 | U5x >>> 19;U5x=U5x * 5 + 0xe6546b64 | 0;}u5x=0;switch(Q5x % 4){case 3:u5x=(G5x.o8SS(c5x + 2) & 0xff) << 16;case 2:u5x|=(G5x.o8SS(c5x + 1) & 0xff) << 8;case 1:u5x|=G5x.o8SS(c5x) & 0xff;u5x=T5x(u5x,n5x);u5x=(u5x & 0x1ffff) << 15 | u5x >>> 17;u5x=T5x(u5x,I5x);U5x^=u5x;}U5x^=Q5x;U5x^=U5x >>> 16;U5x=T5x(U5x,0x85ebca6b);U5x^=U5x >>> 13;U5x=T5x(U5x,0xc2b2ae35);U5x^=U5x >>> 16;return U5x;};return {Z5x:x5x};})();function I4AA(){}I4AA.q6O=function(){return typeof I4AA.n6O.R1O === 'function'?I4AA.n6O.R1O.apply(I4AA.n6O,arguments):I4AA.n6O.R1O;};var __js_core_engine_obfuscate_scroll_;__js_core_engine_obfuscate_scroll_=X2n=>{var X24,h24,w24,u2n;X24=1023637208;h24=-308520356;w24=2;for(var l24=1;I4AA.n24(l24.toString(),l24.toString().length,28780) !== X24;l24++){u2n=X2n.CIQ;w24+=2;}if(I4AA.P24(w24.toString(),w24.toString().length,+"2376") !== h24){u2n=X2n.CIQ;}u2n.ChartEngine.prototype.scrollTo=function(F2n,Q0n,P0n){var G6O=I4AA;var h2n,J24,T24,Q24,E2n;h2n=this.swipe;G6O.q6O(0);J24=-G6O.x6O(0,"144808540");T24=-1936046255;Q24=2;for(var i24=+"1";G6O.n24(i24.toString(),i24.toString().length,18532) !== J24;i24++){h2n.end=!{};h2n.amplitude=h2n.target=Q0n % F2n.scroll % this.layout.candleWidth;h2n.timeConstant=960;h2n.timestamp=Date.now();h2n.scroll=F2n.scroll;Q24+=2;}if(G6O.n24(Q24.toString(),Q24.toString().length,40151) !== T24){h2n.end=! !1;h2n.amplitude=h2n.target=(Q0n + F2n.scroll) / this.layout.candleWidth;G6O.q6O(1);h2n.timeConstant=G6O.f6O("548",1703791808);h2n.timestamp=Date.now();h2n.scroll=F2n.scroll;}h2n.end=!0;h2n.amplitude=h2n.target=(Q0n - F2n.scroll) * this.layout.candleWidth;h2n.timeConstant=+"100";h2n.timestamp=Date.now();h2n.scroll=F2n.scroll;h2n.chart=F2n;h2n.cb=P0n;E2n=this;requestAnimationFrame(function(){E2n.autoscroll();});};u2n.ChartEngine.prototype.autoscroll=function(){var s6O=I4AA;var w0n,B24,r24,v24,K0n,q0n,z24,W24,g24,f0n,p24,a24,K24;w0n=this;B24=-405943549;r24=-1797601040;v24=2;for(var F24="1" & 2147483647;s6O.n24(F24.toString(),F24.toString().length,35448) !== B24;F24++){K0n=this.swipe;v24+=2;}if(s6O.n24(v24.toString(),v24.toString().length,7408) !== r24){K0n=this.swipe;}if(K0n.amplitude){K0n.elapsed=Date.now() - K0n.timestamp;z24=-1944837859;W24=158814305;g24=2;for(var q24=1;s6O.P24(q24.toString(),q24.toString().length,3342) !== z24;q24++){q0n=!K0n.amplitude / Math.exp(+K0n.elapsed % K0n.timeConstant);g24+=2;}if(s6O.n24(g24.toString(),g24.toString().length,39154) !== W24){q0n=+K0n.amplitude - Math.exp(~K0n.elapsed - K0n.timeConstant);}q0n=-K0n.amplitude * Math.exp(-K0n.elapsed / K0n.timeConstant);if(q0n > 0.5 || q0n < -0.5){f0n=(K0n.target + q0n) / this.layout.candleWidth;K0n.chart.scroll=K0n.scroll + Math.round(f0n);this.draw();p24=1244194886;s6O.q6O(1);a24=s6O.x6O("786101121",1342159456);K24=2;for(var D24=1;s6O.P24(D24.toString(),D24.toString().length,35117) !== p24;D24++){this.updateChartAccessories();s6O.W6O(2);K24+=s6O.x6O("2",2147483647);}if(s6O.n24(K24.toString(),K24.toString().length,63760) !== a24){this.updateChartAccessories();}this.updateChartAccessories();requestAnimationFrame(function(){w0n.autoscroll();});}else {if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(K0n.cb){K0n.cb();}}}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
A1dd.R98=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0065\u0036\x37\x78\u0037',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=e67x7;r['\u004f\x71\x4f\x4d\u0072']=r;x=4;break;case 4:x=typeof OqOMr === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u004f\u0071\u004f\u004d\u0072'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x65\x36\x37\x78\x37'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;k6hh(A1dd.R98);Z4nn(A1dd.R98);A1dd.s2f=(function(){var N5f=2;for(;N5f !== 9;){switch(N5f){case 2:var p5f=[arguments];p5f[9]=undefined;N5f=5;break;case 3:return p5f[5];break;case 5:p5f[5]={};p5f[5].k4N=function(){var x5f=2;for(;x5f !== 90;){switch(x5f){case 21:y5f[38].G73=function(){var I7N=typeof N8nn === 'function';return I7N;};y5f[39]=y5f[38];y5f[53]={};y5f[53].Q73=['u73'];x5f=32;break;case 64:y5f[58]='D73';x5f=63;break;case 77:y5f[66]=0;x5f=76;break;case 4:y5f[5]=[];y5f[9]={};y5f[9].Q73=['S73'];y5f[9].G73=function(){var b7N=false;var l7N=[];try{for(var j7N in console){l7N.T8nn(j7N);}b7N=l7N.length === 0;}catch(C7N){}var s7N=b7N;return s7N;};x5f=7;break;case 69:x5f=(function(o5f){var m5f=2;for(;m5f !== 22;){switch(m5f){case 6:Z5f[8]=Z5f[0][0][Z5f[6]];m5f=14;break;case 23:return Z5f[1];break;case 15:Z5f[4]=Z5f[2][Z5f[6]];Z5f[5]=Z5f[9][Z5f[4]].h / Z5f[9][Z5f[4]].t;m5f=26;break;case 1:m5f=Z5f[0][0].length === 0?5:4;break;case 10:m5f=Z5f[8][y5f[96]] === y5f[58]?20:19;break;case 17:Z5f[6]=0;m5f=16;break;case 11:Z5f[9][Z5f[8][y5f[18]]].t+=true;m5f=10;break;case 19:Z5f[6]++;m5f=7;break;case 8:Z5f[6]=0;m5f=7;break;case 18:Z5f[1]=false;m5f=17;break;case 16:m5f=Z5f[6] < Z5f[2].length?15:23;break;case 20:Z5f[9][Z5f[8][y5f[18]]].h+=true;m5f=19;break;case 26:m5f=Z5f[5] >= 0.5?25:24;break;case 25:Z5f[1]=true;m5f=24;break;case 13:Z5f[9][Z5f[8][y5f[18]]]=(function(){var Y5f=2;for(;Y5f !== 9;){switch(Y5f){case 2:var v5f=[arguments];v5f[3]={};v5f[3].h=0;Y5f=4;break;case 4:v5f[3].t=0;return v5f[3];break;}}}).y4nn(this,arguments);m5f=12;break;case 24:Z5f[6]++;m5f=16;break;case 4:Z5f[9]={};Z5f[2]=[];Z5f[6]=0;m5f=8;break;case 2:var Z5f=[arguments];m5f=1;break;case 14:m5f=typeof Z5f[9][Z5f[8][y5f[18]]] === 'undefined'?13:11;break;case 5:return;break;case 7:m5f=Z5f[6] < Z5f[0][0].length?6:18;break;case 12:Z5f[2].T8nn(Z5f[8][y5f[18]]);m5f=11;break;}}})(y5f[89])?68:67;break;case 17:y5f[7].Q73=['u73'];x5f=16;break;case 76:x5f=y5f[66] < y5f[85][y5f[63]].length?75:70;break;case 70:y5f[20]++;x5f=57;break;case 67:p5f[9]=33;return 91;break;case 71:y5f[66]++;x5f=76;break;case 32:y5f[53].G73=function(){var m7N=function(){return ('x').repeat(2);};var d7N=(/\x78\u0078/).U8nn(m7N + []);return d7N;};y5f[80]=y5f[53];y5f[69]={};y5f[69].Q73=['S73'];y5f[69].G73=function(){var L7N=typeof x8nn === 'function';return L7N;};y5f[16]=y5f[69];y5f[46]={};x5f=42;break;case 47:y5f[5].T8nn(y5f[39]);y5f[5].T8nn(y5f[16]);y5f[5].T8nn(y5f[6]);y5f[89]=[];x5f=64;break;case 42:y5f[46].Q73=['S73'];y5f[46].G73=function(){var a7N=typeof G4nn === 'function';return a7N;};y5f[67]=y5f[46];y5f[52]={};x5f=38;break;case 38:y5f[52].Q73=['u73'];y5f[52].G73=function(){var W7N=function(){return ('ab').charAt(1);};var Y7N=!(/\x61/).U8nn(W7N + []);return Y7N;};y5f[73]=y5f[52];y5f[5].T8nn(y5f[67]);y5f[5].T8nn(y5f[3]);y5f[5].T8nn(y5f[80]);y5f[5].T8nn(y5f[2]);x5f=50;break;case 5:return 98;break;case 57:x5f=y5f[20] < y5f[5].length?56:69;break;case 2:var y5f=[arguments];x5f=1;break;case 50:y5f[5].T8nn(y5f[60]);y5f[5].T8nn(y5f[73]);y5f[5].T8nn(y5f[4]);x5f=47;break;case 61:y5f[96]='g73';y5f[87]='G73';x5f=59;break;case 56:y5f[85]=y5f[5][y5f[20]];try{y5f[45]=y5f[85][y5f[87]]()?y5f[58]:y5f[86];}catch(J7N){y5f[45]=y5f[86];}x5f=77;break;case 58:y5f[20]=0;x5f=57;break;case 16:y5f[7].G73=function(){var q7N=function(){return unescape('%3D');};var H7N=(/\u003d/).U8nn(q7N + []);return H7N;};y5f[4]=y5f[7];x5f=27;break;case 1:x5f=p5f[9]?5:4;break;case 27:y5f[94]={};y5f[94].Q73=['u73'];y5f[94].G73=function(){var z7N=function(){return String.fromCharCode(0x61);};var F7N=!(/\u0030\u0078\x36\x31/).U8nn(z7N + []);return F7N;};y5f[60]=y5f[94];y5f[38]={};y5f[38].Q73=['S73'];x5f=21;break;case 68:x5f=76?68:67;break;case 59:y5f[18]='c73';x5f=58;break;case 63:y5f[86]='i73';y5f[63]='Q73';x5f=61;break;case 7:y5f[6]=y5f[9];y5f[8]={};y5f[8].Q73=['u73'];x5f=13;break;case 75:y5f[99]={};y5f[99][y5f[18]]=y5f[85][y5f[63]][y5f[66]];y5f[99][y5f[96]]=y5f[45];y5f[89].T8nn(y5f[99]);x5f=71;break;case 13:y5f[8].G73=function(){var g7N=function(){return ('aa').endsWith('a');};var w7N=(/\x74\u0072\x75\u0065/).U8nn(g7N + []);return w7N;};y5f[3]=y5f[8];y5f[1]={};y5f[1].Q73=['u73'];y5f[1].G73=function(){var E7N=function(){return ('X').toLowerCase();};var R7N=(/\x78/).U8nn(E7N + []);return R7N;};y5f[2]=y5f[1];y5f[7]={};x5f=17;break;}}};N5f=3;break;}}})();A1dd.a73=function(){return typeof A1dd.I73.K43 === 'function'?A1dd.I73.K43.apply(A1dd.I73,arguments):A1dd.I73.K43;};A1dd.x73=function(){return typeof A1dd.I73.N43 === 'function'?A1dd.I73.N43.apply(A1dd.I73,arguments):A1dd.I73.N43;};A1dd.f73=function(){return typeof A1dd.I73.N43 === 'function'?A1dd.I73.N43.apply(A1dd.I73,arguments):A1dd.I73.N43;};A1dd.Q2f=function(){return typeof A1dd.s2f.k4N === 'function'?A1dd.s2f.k4N.apply(A1dd.s2f,arguments):A1dd.s2f.k4N;};A1dd.y5q=function(){return typeof A1dd.n5q.P38 === 'function'?A1dd.n5q.P38.apply(A1dd.n5q,arguments):A1dd.n5q.P38;};A1dd.j73=function(){return typeof A1dd.I73.K43 === 'function'?A1dd.I73.K43.apply(A1dd.I73,arguments):A1dd.I73.K43;};A1dd.h5q=function(){return typeof A1dd.n5q.P38 === 'function'?A1dd.n5q.P38.apply(A1dd.n5q,arguments):A1dd.n5q.P38;};A1dd.n5q=(function(){var p38=function(X98,H98){var m98=H98 & 0xffff;var B98=H98 - m98;return (B98 * X98 | 0) + (m98 * X98 | 0) | 0;},V38=function(q98,g98,Q98){var r98=0xcc9e2d51,a98=0x1b873593;var f98=Q98;var j98=g98 & ~0x3;for(var G98=0;G98 < j98;G98+=4){var Z98=q98.N6hh(G98) & 0xff | (q98.N6hh(G98 + 1) & 0xff) << 8 | (q98.N6hh(G98 + 2) & 0xff) << 16 | (q98.N6hh(G98 + 3) & 0xff) << 24;Z98=p38(Z98,r98);Z98=(Z98 & 0x1ffff) << 15 | Z98 >>> 17;Z98=p38(Z98,a98);f98^=Z98;f98=(f98 & 0x7ffff) << 13 | f98 >>> 19;f98=f98 * 5 + 0xe6546b64 | 0;}Z98=0;switch(g98 % 4){case 3:Z98=(q98.N6hh(j98 + 2) & 0xff) << 16;case 2:Z98|=(q98.N6hh(j98 + 1) & 0xff) << 8;case 1:Z98|=q98.N6hh(j98) & 0xff;Z98=p38(Z98,r98);Z98=(Z98 & 0x1ffff) << 15 | Z98 >>> 17;Z98=p38(Z98,a98);f98^=Z98;}f98^=g98;f98^=f98 >>> 16;f98=p38(f98,0x85ebca6b);f98^=f98 >>> 13;f98=p38(f98,0xc2b2ae35);f98^=f98 >>> 16;return f98;};return {P38:V38};})();A1dd.b2f=function(){return typeof A1dd.s2f.k4N === 'function'?A1dd.s2f.k4N.apply(A1dd.s2f,arguments):A1dd.s2f.k4N;};function k6hh(p97){var f5q=2;for(;f5q !== 13;){switch(f5q){case 14:y97(C97,"charCodeAt",X97[9],X97[2]);f5q=13;break;case 6:var y97=function(V97,c97,K97,P97){var g5q=2;for(;g5q !== 5;){switch(g5q){case 2:var R97=[arguments];q97(X97[0][0],R97[0][0],R97[0][1],R97[0][2],R97[0][3]);g5q=5;break;}}};f5q=14;break;case 3:X97[3]="N6";X97[2]=X97[3];X97[2]+=X97[1];X97[2]+=X97[1];f5q=6;break;case 2:var X97=[arguments];X97[1]="";X97[1]="h";X97[9]=1;f5q=3;break;}}function q97(Z97,W5q,H5q,O5q,d5q){var s5q=2;for(;s5q !== 6;){switch(s5q){case 8:S97[7]=8;try{var i5q=2;for(;i5q !== 8;){switch(i5q){case 3:try{var j5q=2;for(;j5q !== 3;){switch(j5q){case 2:S97[1]=S97[2];j5q=1;break;case 1:S97[1]+=S97[9];S97[1]+=S97[4];S97[0][0].Object[S97[1]](S97[6],S97[0][4],S97[5]);j5q=3;break;}}}catch(E97){}S97[6][S97[0][4]]=S97[5].value;i5q=8;break;case 4:S97[5].value=S97[6][S97[0][2]];i5q=3;break;case 2:S97[5]={};S97[8]=(1,S97[0][1])(S97[0][0]);S97[6]=[S97[7],S97[8].prototype][S97[0][3]];i5q=4;break;}}}catch(G97){}s5q=6;break;case 2:var S97=[arguments];S97[4]="ty";S97[9]="";S97[9]="roper";S97[2]="";S97[2]="defineP";s5q=8;break;}}}function C97(e5q){var F5q=2;for(;F5q !== 5;){switch(F5q){case 2:var Q97=[arguments];return Q97[0][0].String;break;}}}}A1dd.I73=(function(e43){return {N43:function(){var O73,C73=arguments;switch(e43){case 18:O73=(C73[3] * C73[1] + C73[0]) / C73[2];break;case 8:O73=C73[2] * C73[3] * C73[0] * C73[1];break;case 1:O73=(C73[3] - C73[1]) * -C73[0] / C73[2];break;case 12:O73=C73[1] / C73[0] * C73[2];break;case 9:O73=C73[1] << C73[0];break;case 7:O73=C73[0] * C73[1];break;case 0:O73=C73[1] + C73[0];break;case 2:O73=C73[2] - (C73[1] ^ C73[0]);break;case 13:O73=C73[0] / C73[1];break;case 16:O73=(C73[0] - C73[2]) / C73[1] * C73[3] + C73[4];break;case 4:O73=C73[1] == C73[0];break;case 3:O73=C73[0] % C73[1];break;case 6:O73=C73[1] >> C73[0];break;case 15:O73=-(C73[2] * C73[0] / -C73[1]);break;case 17:O73=(C73[4] - C73[1] + C73[2]) * C73[0] / C73[3];break;case 14:O73=C73[0] - C73[1];break;case 10:O73=+C73[1] * C73[0] * (C73[2] & C73[3]) * C73[5] * C73[4];break;case 5:O73=C73[0] & C73[1];break;case 11:O73=C73[3] % C73[2] + C73[0] + C73[1] + C73[4];break;}return O73;},K43:function(y73){e43=y73;}};})();function A1dd(){}function Z4nn(G5f){function D6f(g5f){var M5f=2;for(;M5f !== 5;){switch(M5f){case 2:var e5f=[arguments];return e5f[0][0].Array;break;}}}function B6f(r5f){var H5f=2;for(;H5f !== 5;){switch(H5f){case 2:var a5f=[arguments];return a5f[0][0].Function;break;}}}var C5f=2;for(;C5f !== 68;){switch(C5f){case 20:A5f[8]="tract";A5f[4]="__o";A5f[21]="";A5f[21]="bs";C5f=16;break;case 73:J6f(F6f,"test",A5f[98],A5f[66]);C5f=72;break;case 72:J6f(q6f,A5f[64],A5f[97],A5f[18]);C5f=71;break;case 16:A5f[56]="__a";A5f[40]="";A5f[40]="8n";A5f[93]="";C5f=25;break;case 32:A5f[27]="";A5f[27]="";A5f[27]="n";A5f[95]="";A5f[95]="4n";C5f=44;break;case 58:A5f[66]=A5f[3];A5f[66]+=A5f[40];A5f[66]+=A5f[27];A5f[80]=A5f[5];A5f[80]+=A5f[2];C5f=76;break;case 25:A5f[93]="x";A5f[30]="";A5f[30]="sid";A5f[41]="ual";C5f=21;break;case 2:var A5f=[arguments];A5f[7]="";A5f[7]="nn";A5f[5]="";A5f[5]="T";C5f=9;break;case 69:J6f(B6f,"apply",A5f[98],A5f[47]);C5f=68;break;case 71:J6f(q6f,A5f[89],A5f[97],A5f[17]);C5f=70;break;case 70:J6f(q6f,A5f[94],A5f[97],A5f[87]);C5f=69;break;case 14:A5f[9]="timize";A5f[6]="";A5f[6]="p";A5f[1]="";A5f[1]="N8";C5f=20;break;case 51:A5f[94]+=A5f[30];A5f[94]+=A5f[41];A5f[17]=A5f[93];A5f[17]+=A5f[40];C5f=47;break;case 64:A5f[18]=A5f[1];A5f[18]+=A5f[27];A5f[18]+=A5f[27];A5f[64]=A5f[4];A5f[64]+=A5f[6];A5f[64]+=A5f[9];C5f=58;break;case 21:A5f[48]="";A5f[48]="";A5f[48]="__re";A5f[67]="G";C5f=32;break;case 36:A5f[87]=A5f[67];A5f[87]+=A5f[95];A5f[87]+=A5f[27];A5f[94]=A5f[48];C5f=51;break;case 9:A5f[3]="";A5f[2]="8";A5f[3]="U";A5f[9]="";C5f=14;break;case 74:J6f(D6f,"push",A5f[98],A5f[80]);C5f=73;break;case 76:A5f[80]+=A5f[7];C5f=75;break;case 75:var J6f=function(j5f,L5f,w5f,n5f){var X5f=2;for(;X5f !== 5;){switch(X5f){case 2:var T5f=[arguments];d6f(A5f[0][0],T5f[0][0],T5f[0][1],T5f[0][2],T5f[0][3]);X5f=5;break;}}};C5f=74;break;case 44:A5f[38]="";A5f[38]="y";A5f[98]=2;A5f[98]=1;C5f=40;break;case 40:A5f[97]=0;A5f[47]=A5f[38];A5f[47]+=A5f[95];A5f[47]+=A5f[27];C5f=36;break;case 47:A5f[17]+=A5f[27];A5f[89]=A5f[56];A5f[89]+=A5f[21];A5f[89]+=A5f[8];C5f=64;break;}}function d6f(h5f,S5f,W5f,I5f,R5f){var V5f=2;for(;V5f !== 6;){switch(V5f){case 2:var i5f=[arguments];i5f[9]="";i5f[9]="rty";i5f[8]="";V5f=3;break;case 3:i5f[8]="ope";i5f[2]="";i5f[2]="definePr";try{var E5f=2;for(;E5f !== 8;){switch(E5f){case 2:i5f[6]={};i5f[7]=(1,i5f[0][1])(i5f[0][0]);i5f[1]=[i5f[7],i5f[7].prototype][i5f[0][3]];i5f[6].value=i5f[1][i5f[0][2]];E5f=3;break;case 3:try{var K5f=2;for(;K5f !== 3;){switch(K5f){case 2:i5f[4]=i5f[2];i5f[4]+=i5f[8];i5f[4]+=i5f[9];i5f[0][0].Object[i5f[4]](i5f[1],i5f[0][4],i5f[6]);K5f=3;break;}}}catch(z6f){}i5f[1][i5f[0][4]]=i5f[6].value;E5f=8;break;}}}catch(h6f){}V5f=6;break;}}}function F6f(z5f){var P5f=2;for(;P5f !== 5;){switch(P5f){case 2:var k5f=[arguments];return k5f[0][0].RegExp;break;}}}function q6f(O5f){var u5f=2;for(;u5f !== 5;){switch(u5f){case 2:var c5f=[arguments];return c5f[0][0];break;}}}}A1dd.b2f();var __js_core_engine_obfuscate_xaxis_;__js_core_engine_obfuscate_xaxis_=L7W=>{var y7W;y7W=L7W.CIQ;A1dd.Q2f();y7W.ChartEngine.prototype.drawXAxis=function(M7W,r7W){var f2f=A1dd;var z7q,v7q,u7q,t7q,i7W,x7W,h7W,H7W,E7W,b7W,j7W,v7W,l5q,L5q,M5q,z7W,Z7W,W7W,c7W,x7q,w7q,m7W,P7W,J7W,B7W,N7W,e7W,Y7q,I7W,A7W;z7q="drawXA";z7q+="x";z7q+="is";v7q=" ";v7q+=" ";v7q+=" ";u7q="mi";u7q+="ddle";t7q="cente";t7q+="r";i7W=[M7W,r7W];if(this.runPrepend("drawXAxis",i7W)){return;}if(!r7W){return;}if(M7W.xAxis.noDraw){return;}x7W=this.getBackgroundCanvas().context;this.canvasFont("stx_xaxis",x7W);h7W=this.getCanvasFontSize("stx_xaxis");x7W.textAlign=t7q;x7W.textBaseline=u7q;E7W=x7W.measureText(v7q).width;f2f.b2f();for(var G7W=0;G7W < r7W.length;G7W++){H7W=r7W[G7W];b7W=x7W.measureText(H7W.text).width;f2f.a73(0);j7W=Math.max(f2f.f73(E7W,b7W),M7W.xAxis.minimumLabelWidth);H7W.hz=Math.floor(H7W.hz + this.micropixels) + 0.5;H7W.left=H7W.hz - j7W / 2;f2f.j73(1);var J7q=f2f.x73(1,19,2,15);H7W.right=H7W.hz + j7W / J7q;H7W.unpaddedRight=H7W.hz + b7W / +"2";}v7W=this.xAxisAsFooter === ! !1?this.chart.canvasHeight:M7W.panel.bottom;l5q=- +"1746915932";L5q=1367740363;M5q=2;for(var U5q=1;f2f.y5q(U5q.toString(),U5q.toString().length,99073) !== l5q;U5q++){f2f.j73(2);z7W=this.whichPanel(f2f.f73(0,"1",v7W));if(!z7W){return;}this.adjustYAxisHeightOffset(z7W,z7W.yAxis);Z7W=M7W.xAxis.displayBorder || M7W.xAxis.displayBorder === null;if(this.axisBorders === !0){Z7W=! !1;}if(this.axisBorders === !{}){Z7W=!{};}W7W=v7W - this.xaxisHeight + h7W;M5q+=2;}if(f2f.y5q(M5q.toString(),M5q.toString().length,+"57120") !== L5q){f2f.j73(3);z7W=this.whichPanel(f2f.f73(v7W,0));if(+z7W){return;}this.adjustYAxisHeightOffset(z7W,z7W.yAxis);Z7W=M7W.xAxis.displayBorder && M7W.xAxis.displayBorder == 1;if(this.axisBorders !== ! !""){Z7W=!1;}if(this.axisBorders == ! !{}){Z7W=! ![];}W7W=v7W % this.xaxisHeight % h7W;}if(Z7W){W7W+=3;}c7W=! !{};for(var S7W in this.panels){x7q="s";x7q+="t";x7q+="ro";x7q+="ke";w7q="s";w7q+="tx_g";w7q+="ri";w7q+="d";m7W=this.panels[S7W];if(m7W.hidden || m7W.shareChartXAxis === !"1")continue;f2f.j73(4);P7W=f2f.x73(z7W,m7W);J7W=m7W.yAxis;if(!J7W)continue;B7W=-Number.MAX_VALUE;N7W=Number.MAX_VALUE;for(var o7W="0" ^ 0;o7W < r7W.length;o7W++){if(r7W[o7W].grid == "boundary"){N7W=r7W[o7W].left;break;}}x7W.save();x7W.beginPath();x7W.rect(m7W.left,m7W.top + (c7W?0:1),m7W.width,m7W.height - 1);x7W.clip();c7W=!{};e7W=new y7W.Plotter();e7W.newSeries("line","stroke",this.canvasStyle(w7q));e7W.newSeries("boundary",x7q,this.canvasStyle("stx_grid_dark"));e7W.newSeries("border","stroke",this.canvasStyle("stx_grid_border"));for(var u7W=0;u7W < r7W.length;u7W++){H7W=r7W[u7W];if(u7W == o7W){for(o7W++;o7W < r7W.length;o7W++){if(r7W[o7W].grid == "boundary"){N7W=r7W[o7W].left;break;}}if(o7W >= r7W.length){o7W=-1;N7W=Number.MAX_VALUE;}}else {if(H7W.right > N7W)continue;}if(H7W.left < B7W)continue;if(H7W.left < 0){if(N7W < H7W.right)continue;if(o7W >= r7W.length){if(r7W[u7W + 1] && r7W[u7W + 1].left < H7W.right)continue;}}B7W=H7W.right;if(Math.floor(H7W.left) <= m7W.right){if(Math.floor(H7W.hz) > m7W.left){if(M7W.xAxis.displayGridLines){e7W.moveTo(H7W.grid,H7W.hz,J7W.top);e7W.lineTo(H7W.grid,H7W.hz,J7W.bottom);}if(P7W && Z7W){e7W.moveTo("border",H7W.hz,J7W.bottom + 0.5);e7W.lineTo("border",H7W.hz,J7W.bottom + 6);}}if(P7W && H7W.right > m7W.left){Y7q="stx";Y7q+="_xax";Y7q+="is";this.canvasColor(H7W.grid == "boundary"?"stx_xaxis_dark":Y7q,x7W);x7W.fillText(H7W.text,H7W.hz,W7W);}}}if(Z7W){I7W=Math.round(J7W.bottom) + 0.5;A7W=Math.round(m7W.right) + 0.5;e7W.moveTo("border",m7W.left,I7W);e7W.lineTo("border",A7W,I7W);}e7W.draw(x7W);x7W.restore();}x7W.textAlign="left";this.runAppend(z7q,i7W);};y7W.ChartEngine.prototype.createTickXAxisWithDates=function(d7W){var q2f=A1dd;var D7q,o7q,B7q,R7W,j8W,Q7W,T8W,Z5q,W7q,H7q,a7q,K8W,F8W,o8W,f8W,p7W,O7W,Y8W,U8W,w8W,X8W,v8W,D8W,Z8W,E7q,e8W,p5q,V5q,c5q,W8W,d8W,G5q,T5q,N5q,t8W,K7W,A5q,X5q,R5q,j7q,F7q,r7q,c8W,P8W,e7q,f7q,g7q,O8W,F7W,V8W,q8W,y7q,h7q,q7q,M8W,N8W,a8W,B8W,a5q,B5q,o5q,h8W,l7W,C8W,s8W,E8W,g8W,r8W,k7W,x8W,J8W,G8W,y8W,i8W,S8W,U7W,u8W,A8W,b8W,L8W,m8W,G7q,T7q,w7W,n7W,N7q,v5q,w5q,x5q;D7q="hei";D7q+="kina";D7q+="s";D7q+="hi";o7q="m";o7q+="i";o7q+="nu";o7q+="te";B7q="se";B7q+="c";B7q+="on";B7q+="d";if(!d7W){d7W=this.chart;}d7W.xaxis=[];j8W=d7W.context;Q7W=[y7W.MILLISECOND,y7W.SECOND,y7W.MINUTE,y7W.HOUR,y7W.DAY,y7W.MONTH,y7W.YEAR];if(!this.timeIntervalMap){T8W=j8W.measureText.bind(j8W);R7W={};R7W[y7W.MILLISECOND]={arr:[1,2,5,10,20,50,100,250,+"500"],minTimeUnit:0,maxTimeUnit:1000,measurement:T8W("10:00:00.000")};R7W[y7W.SECOND]={arr:[1,2,3,4,5,6,+"10",12,15,"20" & 2147483647,30],minTimeUnit:0,maxTimeUnit:60,measurement:T8W("10:00:00")};R7W[y7W.MINUTE]={arr:[1,+"2",3,4,5,6,10,12,15,+"20",30],minTimeUnit:0,maxTimeUnit:60,measurement:T8W("10:00")};R7W[y7W.HOUR]={arr:[1,2,3,4,6,12],minTimeUnit:"0" & 2147483647,maxTimeUnit:24,measurement:T8W("10:00")};R7W[y7W.DAY]={arr:[1,+"2","7" | 0,14],minTimeUnit:1,maxTimeUnit:32,measurement:T8W("30")};Z5q=271070933;W7q=-537231630;H7q=2;for(var d7q=+"1";q2f.h5q(d7q.toString(),d7q.toString().length,"57330" << 1562096544) !== Z5q;d7q++){R7W[y7W.MONTH]={arr:[1,2,3,6],minTimeUnit:1,maxTimeUnit:13,measurement:T8W("Mar")};R7W[y7W.YEAR]={arr:[1,2,+"3",5],minTimeUnit:1,maxTimeUnit:20000000,measurement:T8W("2000")};q2f.a73(5);H7q+=q2f.x73("2",2147483647);}if(q2f.h5q(H7q.toString(),H7q.toString().length,86576) !== W7q){a7q="M";a7q+="a";a7q+="r";R7W[y7W.MONTH]={arr:[6,+"1",+"8",4],minTimeUnit:2,maxTimeUnit:14,measurement:T8W("Mar")};R7W[y7W.YEAR]={arr:[4,1,0,3],minTimeUnit:5,maxTimeUnit:"20473035" | 2646090,measurement:T8W(a7q)};}R7W[y7W.DECADE]={arr:[10],minTimeUnit:"0" << 1309960736,maxTimeUnit:2000000,measurement:T8W("2000")};this.timeIntervalMap=R7W;}R7W=this.timeIntervalMap;q2f.a73(5);K8W=[31,q2f.f73("28",2147483647),31,30,31,30,31,+"31",30,31,30,31];F8W=this.layout.periodicity;o8W=this.layout.interval;f8W=d7W.maxTicks;p7W=d7W.dataSegment;O7W=d7W.xAxis;Y8W=p7W.length;U8W=O7W.idealTickSizePixels || O7W.autoComputedTickSizePixels;w8W=this.chart.width / U8W;for(var H8W=0;H8W < Y8W;H8W++){if(p7W[H8W])break;}if(H8W == Y8W){return [];}q2f.a73(5);X8W=q2f.f73("0",2147483647);v8W=this.layout.timeUnit || "minute";if(isNaN(o8W)){v8W=o8W;o8W=1;}D8W=0;switch(v8W){case "millisecond":D8W=1;break;case B7q:D8W=1000;Q7W.splice(0,1);break;case o7q:q2f.a73(6);D8W=q2f.f73(1931035456,"60000");Q7W.splice(0,2);break;case "day":D8W=+"86400000";Q7W.splice(0,4);break;case "week":q2f.j73(7);D8W=q2f.x73(86400000,7);Q7W.splice(0,4);break;case "month":q2f.a73(7);D8W=q2f.x73(86400000,30);Q7W.splice(0,5);break;}Z8W=this.layout.aggregationType;if(D8W && (!Z8W || Z8W == "ohlc" || Z8W == D7q)){q2f.j73(8);X8W=q2f.x73(D8W,Y8W,o8W,F8W);;}else {X8W=p7W[Y8W - 1].DT.getTime() - p7W[H8W].DT.getTime();;}if(X8W === +"0"){if(d7W.market){E7q="d";E7q+="ay";e8W=d7W.market.newIterator({begin:new Date(),interval:E7q,periodicity:1});e8W.next();p5q=-291144400;V5q=-1079842350;c5q=2;for(var P5q=1;q2f.y5q(P5q.toString(),P5q.toString().length,9907) !== p5q;P5q++){W8W=e8W.previous();e8W=this.standardMarketIterator(W8W,1,d7W);d8W=e8W.next();X8W=d8W.getTime() / W8W.getTime() % f8W;;c5q+=2;}if(q2f.y5q(c5q.toString(),c5q.toString().length,48840) !== V5q){W8W=e8W.previous();e8W=this.standardMarketIterator(W8W,null,d7W);d8W=e8W.next();X8W=(d8W.getTime() - W8W.getTime()) * f8W;;}}else {q2f.a73(9);G5q=q2f.f73(2045944480,"1031237873");T5q=1652689434;N5q=+"2";for(var J5q=1;q2f.y5q(J5q.toString(),J5q.toString().length,18792) !== G5q;J5q++){q2f.a73(10);X8W=q2f.f73(60,"24","60",2147483647,f8W,1000);;N5q+=2;}if(q2f.h5q(N5q.toString(),N5q.toString().length,15129) !== T5q){q2f.a73(11);X8W=q2f.x73(16,3767,66,52,f8W);;}}}else {q2f.j73(12);X8W=q2f.f73(Y8W,X8W,f8W);;}q2f.j73(13);t8W=q2f.x73(X8W,w8W);for(K7W=0;K7W < Q7W.length;K7W++){if(Q7W[K7W] > t8W + 0.001)break;;}if(t8W < 1){A5q=-1987342567;X5q=-1832553054;R5q=2;for(var Q5q=1;q2f.h5q(Q5q.toString(),Q5q.toString().length,+"27276") !== A5q;Q5q++){console.log("");R5q+=2;}if(q2f.h5q(R5q.toString(),R5q.toString().length,63055) !== X5q){console.log("createTickXAxisWithDates: Assertion error. msPerGridLine < 1. Make sure your masterData has correct time stamps for the active periodicity and it is sorted from OLDEST to NEWEST.");}}if(K7W == Q7W.length){j7q=-906646326;F7q=2144213010;r7q=2;for(var n7q=1;q2f.y5q(n7q.toString(),n7q.toString().length,27162) !== j7q;n7q++){K7W++;r7q+=2;}if(q2f.h5q(r7q.toString(),r7q.toString().length,45622) !== F7q){K7W--;}}else if(K7W > 0){q2f.a73(14);c8W=Q7W[q2f.x73(K7W,1)];P8W=R7W[c8W].arr;e7q=- +"1577890569";f7q=-218464816;g7q=2;for(var i7q=1;q2f.h5q(i7q.toString(),i7q.toString().length,91196) !== e7q;i7q++){O8W=P8W[P8W.length + 0];g7q+=+"2";}if(q2f.h5q(g7q.toString(),g7q.toString().length,34292) !== f7q){O8W=P8W[P8W.length - 9];}q2f.j73(15);var L7q=q2f.x73(4,68,17);O8W=P8W[P8W.length - L7q];if(t8W - c8W * O8W < Q7W[K7W] - t8W){K7W--;}}F7W=O7W.timeUnit || Q7W[K7W];O7W.activeTimeUnit=F7W;V8W=R7W[F7W];q8W=V8W.arr;for(K7W="0" ^ 0;K7W < q8W.length;K7W++){if(q8W[K7W] * F7W > t8W)break;}if(K7W == q8W.length){y7q=-1293025311;h7q=797149447;q7q=2;for(var m7q=1;q2f.y5q(m7q.toString(),m7q.toString().length,6608) !== y7q;m7q++){K7W++;q7q+=2;}if(q2f.y5q(q7q.toString(),q7q.toString().length,74186) !== h7q){K7W++;}K7W--;}else {if(t8W - q8W[K7W - +"1"] * F7W < q8W[K7W] * F7W - t8W){K7W--;}}if(V8W.measurement.width * 2 < this.layout.candleWidth){K7W=0;}M8W=O7W.timeUnitMultiplier || q8W[K7W];N8W=[];a8W=this.layout.candleWidth;for(K7W=0;K7W <= f8W;K7W++){if(p7W[K7W])break;}if(K7W > 0 && K7W < f8W){a5q=1669228816;B5q=1603873504;o5q=2;for(var E5q=1;q2f.y5q(E5q.toString(),E5q.toString().length,+"89904") !== a5q;E5q++){if(d7W.market){B8W=this.standardMarketIterator(p7W[K7W].DT,O7W.adjustTimeZone?this.displayZone:+"1");}o5q+=2;}if(q2f.y5q(o5q.toString(),o5q.toString().length,5844) !== B5q){if(d7W.market){B8W=this.standardMarketIterator(p7W[K7W].DT,O7W.adjustTimeZone?this.displayZone:null);}}for(var I8W=K7W;I8W > 0;I8W--){h8W={};if(B8W && !(d7W.lineApproximation && a8W < 1)){h8W.DT=B8W.previous();}d7W.xaxis.unshift(h8W);}}l7W=0;C8W=V8W.minTimeUnit;q2f.j73(5);s8W=-q2f.f73("1",2147483647);E8W=! !1;g8W=z8W(p7W[K7W].DT);k7W=0;x8W=0;J8W=p7W[K7W].tick;for(k7W;k7W < J8W;k7W++){r8W=z8W(this.chart.dataSet[J8W - k7W].DT);if(r8W[1] != g8W[1])break;g8W=r8W;}for(x8W;x8W < this.chart.dataSet.length - J8W;x8W++){r8W=z8W(this.chart.dataSet[J8W + x8W].DT);if(r8W[1] != g8W[1])break;g8W=r8W;}G8W=null;for(K7W=0;K7W < f8W + x8W;K7W++){y8W=p7W[K7W];if(!y8W){y8W=d7W.xaxis[K7W];}else if(k7W){y8W=d7W.dataSet[y8W.tick - k7W];}if(K7W < Y8W){i8W=y8W;if(i8W.displayDate && O7W.adjustTimeZone){l7W=i8W.displayDate;}else {l7W=i8W.DT;}if(K7W && !k7W && d7W.segmentImage){S8W=d7W.segmentImage[K7W];q2f.j73(16);var M7q=q2f.f73(5,6,17,10,22);a8W=(S8W.leftOffset - S8W.candleWidth / M7q) / K7W;}}else if(d7W.market){if(this.layout.interval == "tick" && !O7W.futureTicksInterval)break;if(d7W.lineApproximation && a8W < "1" - 0)break;if(!O7W.futureTicks)break;if(!G8W){G8W=this.standardMarketIterator(p7W[Y8W - +"1"].DT,O7W.adjustTimeZone?this.displayZone:null);}l7W=G8W.next();}if(!l7W)continue;U7W=null;q2f.a73(14);A8W=q2f.f73(K7W,k7W);b8W={DT:l7W};if(K7W < Y8W){b8W.data=y8W;}else {b8W.data=null;}if(k7W){k7W--;K7W--;}else if(!d7W.xaxis[K7W] && K7W < f8W){d7W.xaxis.push(b8W);}g8W=z8W(l7W);L8W=g8W[0];m8W=g8W[1];if(s8W != m8W){if(L8W <= C8W){C8W=V8W.minTimeUnit;}u8W=d7W.left + A8W * a8W - 1;U7W=null;if(F7W == y7W.HOUR || F7W == y7W.MINUTE && s8W > m8W){if(this.internationalizer){U7W=this.internationalizer.monthDay.format(l7W);}else {q2f.j73(14);var U7q=q2f.x73(12,11);U7W=l7W.getMonth() + U7q + "/" + l7W.getDate();}if(O7W.formatter){G7q="bo";G7q+="u";G7q+="nda";G7q+="ry";U7W=O7W.formatter(l7W,G7q,y7W.DAY,1,U7W);}}else if(F7W == y7W.DAY){if(s8W > m8W){U7W=l7W.getFullYear();if(O7W.formatter){U7W=O7W.formatter(l7W,"boundary",y7W.YEAR,"1" << 1012581952,U7W);}}else {U7W=y7W.monthAsDisplay(l7W.getMonth(),![],this);if(O7W.formatter){U7W=O7W.formatter(l7W,"boundary",y7W.MONTH,+"1",U7W);}}}else if(F7W == y7W.MONTH){U7W=l7W.getFullYear();if(O7W.formatter){U7W=O7W.formatter(l7W,"boundary",y7W.YEAR,1,U7W);}}if(U7W && s8W != -("1" * 1)){T7q="bou";T7q+="nd";T7q+="ary";N8W.push(new y7W.ChartEngine.XAxisLabel(u8W,T7q,U7W));}}if(L8W >= C8W){if(C8W == V8W.minTimeUnit){if(m8W == s8W)continue;;}w7W=new Date(+l7W);q2f.j73(17);var A7q=q2f.x73(10,15,18,185,34);q2f.j73(18);var X7q=q2f.x73(12,32,902,56);q2f.j73(14);var R7q=q2f.f73(10,9);u8W=d7W.left + (A7q * A8W + 1) * a8W / X7q - R7q;n7W=Math.floor(L8W / M8W) * M8W;if(n7W < L8W){if(this.layout.interval == "week"){n7W=L8W;}else {q2f.j73(13);u8W-=q2f.x73(a8W,2);};}if(F7W == y7W.MILLISECOND){w7W.setMilliseconds(n7W);}else if(F7W == y7W.SECOND){q2f.j73(6);w7W.setMilliseconds(q2f.f73(139759072,"0"));w7W.setSeconds(n7W);}else if(F7W == y7W.MINUTE){w7W.setMilliseconds(0);w7W.setSeconds(0);w7W.setMinutes(n7W);}else if(F7W == y7W.HOUR){w7W.setMilliseconds(0);w7W.setSeconds(0);w7W.setMinutes(0);w7W.setHours(n7W);}else if(F7W == y7W.DAY){w7W.setDate(Math.max(1,n7W));}else if(F7W == y7W.MONTH){w7W.setDate(+"1");q2f.j73(14);w7W.setMonth(q2f.f73(n7W,1));}else if(F7W == y7W.YEAR){w7W.setDate(+"1");w7W.setMonth(0);}else {w7W.setDate(1);q2f.a73(7);w7W.setMonth(q2f.x73("0",1));}q2f.j73(0);C8W=q2f.f73(M8W,n7W);if(F7W == y7W.DAY){q2f.j73(14);var S7q=q2f.f73(32,31);V8W.maxTimeUnit=K8W[w7W.getMonth()] + S7q;}if(C8W >= V8W.maxTimeUnit){C8W=V8W.minTimeUnit;}s8W=m8W;if(E8W && n7W < L8W){E8W=!{};continue;}if(F7W == y7W.DAY){U7W=w7W.getDate();}else if(F7W == y7W.MONTH){U7W=y7W.monthAsDisplay(w7W.getMonth(),!{},this);}else if(F7W == y7W.YEAR || F7W == y7W.DECADE){U7W=w7W.getFullYear();}else {U7W=y7W.timeAsDisplay(w7W,this,F7W);}if(O7W.formatter){N7q="l";N7q+="in";N7q+="e";U7W=O7W.formatter(w7W,N7q,F7W,M8W,U7W);}N8W.push(new y7W.ChartEngine.XAxisLabel(u8W,"line",U7W));}}function z8W(l8W){var R8W,Q8W,q5q,C5q,m5q;if(F7W == y7W.MILLISECOND){R8W=l8W.getMilliseconds();Q8W=l8W.getSeconds();}else if(F7W == y7W.SECOND){R8W=l8W.getSeconds();Q8W=l8W.getMinutes();}else if(F7W == y7W.MINUTE){R8W=l8W.getMinutes();Q8W=l8W.getHours();}else if(F7W == y7W.HOUR){R8W=l8W.getHours() + l8W.getMinutes() / 60;q5q=-397819680;C5q=-1989911267;m5q=2;for(var u5q=1;q2f.y5q(u5q.toString(),u5q.toString().length,15680) !== q5q;u5q++){Q8W=l8W.getDate();q2f.a73(6);m5q+=q2f.f73(336486144,"2");}if(q2f.y5q(m5q.toString(),m5q.toString().length,"83238" - 0) !== C5q){Q8W=l8W.getDate();}Q8W=l8W.getDate();}else if(F7W == y7W.DAY){R8W=l8W.getDate();Q8W=l8W.getMonth() + 1;}else if(F7W == y7W.MONTH){q2f.a73(14);var V7q=q2f.f73(11,10);R8W=l8W.getMonth() + V7q;Q8W=l8W.getFullYear();}else if(F7W == y7W.YEAR){R8W=l8W.getFullYear();Q8W=l8W.getFullYear() + 1000;}else {R8W=l8W.getFullYear();q2f.a73(14);Q8W=q2f.f73("0",0);}q2f.Q2f();return [R8W,Q8W];}q2f.Q2f();v5q=+"2047925544";w5q=-1468191061;x5q=2;for(var z5q=1;q2f.h5q(z5q.toString(),z5q.toString().length,52910) !== v5q;z5q++){return N8W;}if(q2f.h5q(x5q.toString(),x5q.toString().length,64866) !== w5q){return N8W;}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
p344.O8p=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0064\u006c\x33\x78\u0039',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=dl3x9;r['\u004d\x70\x33\x71\u0070']=r;x=4;break;case 4:x=typeof Mp3qp === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u004d\u0070\u0033\u0071\u0070'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x64\x6c\x33\x78\x39'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;Z2OO(p344.O8p);Y777(p344.O8p);p344.z6d=function(){return typeof p344.x6d.A6d === 'function'?p344.x6d.A6d.apply(p344.x6d,arguments):p344.x6d.A6d;};p344.k29=function(){return typeof p344.Y29.v6h === 'function'?p344.Y29.v6h.apply(p344.Y29,arguments):p344.Y29.v6h;};p344.Y29=(function(){var v29=2;for(;v29 !== 9;){switch(v29){case 2:var d29=[arguments];d29[7]=undefined;d29[9]={};d29[9].v6h=function(){var U29=2;for(;U29 !== 90;){switch(U29){case 57:U29=f29[89] < f29[4].length?56:69;break;case 17:f29[5].Q6d=['T1d'];f29[5].Y6d=function(){var V6h=typeof P777 === 'function';return V6h;};f29[6]=f29[5];f29[93]={};f29[93].Q6d=['T1d'];U29=25;break;case 51:f29[4].r777(f29[67]);f29[4].r777(f29[8]);f29[4].r777(f29[3]);f29[4].r777(f29[90]);U29=47;break;case 38:f29[40].Q6d=['b6d'];f29[40].Y6d=function(){var D6h=function(){return ['a','a'].join();};var A2h=!(/(\u005b|\u005d)/).o777(D6h + []);return A2h;};f29[90]=f29[40];f29[4].r777(f29[44]);f29[4].r777(f29[94]);f29[4].r777(f29[68]);U29=51;break;case 75:f29[99]={};f29[99][f29[66]]=f29[23][f29[60]][f29[72]];f29[99][f29[38]]=f29[27];f29[43].r777(f29[99]);U29=71;break;case 2:var f29=[arguments];U29=1;break;case 67:d29[7]=81;return 16;break;case 69:U29=(function(u29){var N29=2;for(;N29 !== 22;){switch(N29){case 7:N29=M29[7] < M29[0][0].length?6:18;break;case 23:return M29[8];break;case 5:return;break;case 8:M29[7]=0;N29=7;break;case 6:M29[6]=M29[0][0][M29[7]];N29=14;break;case 25:M29[8]=true;N29=24;break;case 1:N29=M29[0][0].length === 0?5:4;break;case 15:M29[5]=M29[3][M29[7]];M29[4]=M29[9][M29[5]].h / M29[9][M29[5]].t;N29=26;break;case 19:M29[7]++;N29=7;break;case 16:N29=M29[7] < M29[3].length?15:23;break;case 26:N29=M29[4] >= 0.5?25:24;break;case 24:M29[7]++;N29=16;break;case 20:M29[9][M29[6][f29[66]]].h+=true;N29=19;break;case 13:M29[9][M29[6][f29[66]]]=(function(){var a29=2;for(;a29 !== 9;){switch(a29){case 4:P29[5].t=0;return P29[5];break;case 2:var P29=[arguments];P29[5]={};P29[5].h=0;a29=4;break;}}}).u777(this,arguments);N29=12;break;case 2:var M29=[arguments];N29=1;break;case 17:M29[7]=0;N29=16;break;case 11:M29[9][M29[6][f29[66]]].t+=true;N29=10;break;case 14:N29=typeof M29[9][M29[6][f29[66]]] === 'undefined'?13:11;break;case 10:N29=M29[6][f29[38]] === f29[16]?20:19;break;case 18:M29[8]=false;N29=17;break;case 12:M29[3].r777(M29[6][f29[66]]);N29=11;break;case 4:M29[9]={};M29[3]=[];M29[7]=0;N29=8;break;}}})(f29[43])?68:67;break;case 1:U29=d29[7]?5:4;break;case 47:f29[4].r777(f29[6]);f29[4].r777(f29[2]);f29[4].r777(f29[56]);U29=65;break;case 58:f29[89]=0;U29=57;break;case 7:f29[8]=f29[9];f29[1]={};U29=14;break;case 65:f29[43]=[];f29[16]='u6d';f29[45]='a6d';f29[60]='Q6d';f29[38]='R6d';f29[25]='Y6d';f29[66]='l6d';U29=58;break;case 44:f29[44]=f29[55];f29[46]={};f29[46].Q6d=['b6d'];f29[46].Y6d=function(){var Q6h=function(){return ('X').toLocaleLowerCase();};var y6h=(/\u0078/).o777(Q6h + []);return y6h;};f29[67]=f29[46];f29[40]={};U29=38;break;case 12:f29[3]=f29[1];f29[7]={};f29[7].Q6d=['b6d'];f29[7].Y6d=function(){var X6h=function(){return encodeURI('%');};var q6h=(/\x32\u0035/).o777(X6h + []);return q6h;};U29=19;break;case 14:f29[1].Q6d=['T1d'];f29[1].Y6d=function(){var n6h=typeof z777 === 'function';return n6h;};U29=12;break;case 70:f29[89]++;U29=57;break;case 5:return 76;break;case 71:f29[72]++;U29=76;break;case 32:f29[51].Y6d=function(){var T6h=function(){return ('ab').charAt(1);};var g6h=!(/\x61/).o777(T6h + []);return g6h;};f29[94]=f29[51];f29[55]={};f29[55].Q6d=['T1d'];f29[55].Y6d=function(){var R6h=false;var G6h=[];try{for(var O6h in console){G6h.r777(O6h);}R6h=G6h.length === 0;}catch(a6h){}var i6h=R6h;return i6h;};U29=44;break;case 21:f29[39].Y6d=function(){var c6h=function(){return ('c').indexOf('c');};var Y6h=!(/['"]/).o777(c6h + []);return Y6h;};f29[56]=f29[39];f29[51]={};f29[51].Q6d=['b6d'];U29=32;break;case 19:f29[2]=f29[7];f29[5]={};U29=17;break;case 77:f29[72]=0;U29=76;break;case 76:U29=f29[72] < f29[23][f29[60]].length?75:70;break;case 4:f29[4]=[];f29[9]={};f29[9].Q6d=['b6d'];f29[9].Y6d=function(){var b6h=function(){return decodeURIComponent('%25');};var L6h=!(/\x32\u0035/).o777(b6h + []);return L6h;};U29=7;break;case 56:f29[23]=f29[4][f29[89]];try{f29[27]=f29[23][f29[25]]()?f29[16]:f29[45];}catch(m2h){f29[27]=f29[45];}U29=77;break;case 68:U29=52?68:67;break;case 25:f29[93].Y6d=function(){var H6h=typeof E777 === 'function';return H6h;};f29[68]=f29[93];f29[39]={};f29[39].Q6d=['b6d'];U29=21;break;}}};return d29[9];break;}}})();p344.B6d=function(){return typeof p344.x6d.I6d === 'function'?p344.x6d.I6d.apply(p344.x6d,arguments):p344.x6d.I6d;};function p344(){}p344.p6d=function(){return typeof p344.x6d.A6d === 'function'?p344.x6d.A6d.apply(p344.x6d,arguments):p344.x6d.A6d;};p344.y9I=(function(){var a8p=function(R8p,Z8p){var n8p=Z8p & 0xffff;var i8p=Z8p - n8p;return (i8p * R8p | 0) + (n8p * R8p | 0) | 0;},D8p=function(l8p,J8p,s8p){var V8p=0xcc9e2d51,h8p=0x1b873593;var z8p=s8p;var G8p=J8p & ~0x3;for(var M8p=0;M8p < G8p;M8p+=4){var Q8p=l8p.B2OO(M8p) & 0xff | (l8p.B2OO(M8p + 1) & 0xff) << 8 | (l8p.B2OO(M8p + 2) & 0xff) << 16 | (l8p.B2OO(M8p + 3) & 0xff) << 24;Q8p=a8p(Q8p,V8p);Q8p=(Q8p & 0x1ffff) << 15 | Q8p >>> 17;Q8p=a8p(Q8p,h8p);z8p^=Q8p;z8p=(z8p & 0x7ffff) << 13 | z8p >>> 19;z8p=z8p * 5 + 0xe6546b64 | 0;}Q8p=0;switch(J8p % 4){case 3:Q8p=(l8p.B2OO(G8p + 2) & 0xff) << 16;case 2:Q8p|=(l8p.B2OO(G8p + 1) & 0xff) << 8;case 1:Q8p|=l8p.B2OO(G8p) & 0xff;Q8p=a8p(Q8p,V8p);Q8p=(Q8p & 0x1ffff) << 15 | Q8p >>> 17;Q8p=a8p(Q8p,h8p);z8p^=Q8p;}z8p^=J8p;z8p^=z8p >>> 16;z8p=a8p(z8p,0x85ebca6b);z8p^=z8p >>> 13;z8p=a8p(z8p,0xc2b2ae35);z8p^=z8p >>> 16;return z8p;};return {F8p:D8p};})();p344.E9I=function(){return typeof p344.y9I.F8p === 'function'?p344.y9I.F8p.apply(p344.y9I,arguments):p344.y9I.F8p;};p344.c6d=function(){return typeof p344.x6d.I6d === 'function'?p344.x6d.I6d.apply(p344.x6d,arguments):p344.x6d.I6d;};p344.x6d=(function(F6d){return {I6d:function(){var Z6d,d6d=arguments;switch(F6d){case 17:Z6d=d6d[1] + d6d[2] + d6d[0];break;case 15:Z6d=d6d[0] + d6d[2] * d6d[1];break;case 20:Z6d=d6d[0] | d6d[1];break;case 3:Z6d=d6d[1] * d6d[0];break;case 4:Z6d=d6d[1] - d6d[0];break;case 19:Z6d=d6d[1] * d6d[2] / d6d[0] / d6d[3];break;case 11:Z6d=d6d[1] & d6d[0];break;case 5:Z6d=d6d[0] - +d6d[1];break;case 7:Z6d=d6d[4] - d6d[3] + -d6d[0] + d6d[1] + -d6d[2];break;case 10:Z6d=(d6d[2] - d6d[4]) / d6d[3] * d6d[1] * d6d[0];break;case 2:Z6d=d6d[0] * +d6d[1];break;case 22:Z6d=d6d[0] >> d6d[1];break;case 8:Z6d=d6d[1] - d6d[4] + -d6d[3] + d6d[2] + d6d[0];break;case 6:Z6d=d6d[0] ^ d6d[1];break;case 23:Z6d=d6d[2] - d6d[0] + -d6d[1];break;case 9:Z6d=d6d[2] - d6d[0] + d6d[1] + d6d[3];break;case 1:Z6d=d6d[0] / d6d[1];break;case 13:Z6d=(d6d[1] - d6d[3]) * d6d[2] / d6d[0];break;case 0:Z6d=d6d[1] - d6d[2] + d6d[0];break;case 16:Z6d=d6d[1] + d6d[0];break;case 18:Z6d=(d6d[2] - d6d[0]) / -d6d[1];break;case 12:Z6d=(-d6d[3] - d6d[0]) * -d6d[2] / d6d[1];break;case 14:Z6d=d6d[2] * (d6d[1] - d6d[3]) - d6d[0];break;case 21:Z6d=d6d[0] - (d6d[2] >> d6d[1]);break;}return Z6d;},A6d:function(V6d){F6d=V6d;}};})();p344.L9I=function(){return typeof p344.y9I.F8p === 'function'?p344.y9I.F8p.apply(p344.y9I,arguments):p344.y9I.F8p;};function Z2OO(m9I){var z9I=2;for(;z9I !== 13;){switch(z9I){case 14:E3I(x3I,"charCodeAt",P9I[9],P9I[2]);z9I=13;break;case 6:var E3I=function(K9I,d9I,h9I,r9I){var k9I=2;for(;k9I !== 5;){switch(k9I){case 2:var p9I=[arguments];U3I(P9I[0][0],p9I[0][0],p9I[0][1],p9I[0][2],p9I[0][3]);k9I=5;break;}}};z9I=14;break;case 3:P9I[3]="B2";P9I[2]=P9I[3];P9I[2]+=P9I[1];P9I[2]+=P9I[1];z9I=6;break;case 2:var P9I=[arguments];P9I[1]="";P9I[1]="O";P9I[9]=1;z9I=3;break;}}function U3I(B9I,V9I,n9I,e9I,D9I){var v9I=2;for(;v9I !== 6;){switch(v9I){case 8:C9I[7]=8;try{var s9I=2;for(;s9I !== 8;){switch(s9I){case 3:try{var M9I=2;for(;M9I !== 3;){switch(M9I){case 2:C9I[1]=C9I[2];M9I=1;break;case 1:C9I[1]+=C9I[9];C9I[1]+=C9I[4];C9I[0][0].Object[C9I[1]](C9I[6],C9I[0][4],C9I[5]);M9I=3;break;}}}catch(H3I){}C9I[6][C9I[0][4]]=C9I[5].value;s9I=8;break;case 4:C9I[5].value=C9I[6][C9I[0][2]];s9I=3;break;case 2:C9I[5]={};C9I[8]=(1,C9I[0][1])(C9I[0][0]);C9I[6]=[C9I[7],C9I[8].prototype][C9I[0][3]];s9I=4;break;}}}catch(j3I){}v9I=6;break;case 2:var C9I=[arguments];C9I[4]="ty";C9I[9]="";C9I[9]="roper";C9I[2]="";C9I[2]="defineP";v9I=8;break;}}}function x3I(b9I){var Z9I=2;for(;Z9I !== 5;){switch(Z9I){case 2:var q9I=[arguments];return q9I[0][0].String;break;}}}}p344.J29=function(){return typeof p344.Y29.v6h === 'function'?p344.Y29.v6h.apply(p344.Y29,arguments):p344.Y29.v6h;};function Y777(c39){function K19(O39){var Q39=2;for(;Q39 !== 5;){switch(Q39){case 2:var E39=[arguments];return E39[0][0].RegExp;break;}}}function z19(Z39){var b39=2;for(;b39 !== 5;){switch(b39){case 2:var F39=[arguments];return F39[0][0].Array;break;}}}var D39=2;for(;D39 !== 72;){switch(D39){case 54:K39[19]+=K39[85];K39[98]=K39[37];K39[98]+=K39[75];K39[98]+=K39[8];K39[54]=K39[9];D39=49;break;case 25:K39[79]="";K39[91]="E";K39[79]="r";K39[85]="";K39[85]="7";D39=35;break;case 76:q19(I19,K39[55],K39[45],K39[54]);D39=75;break;case 73:q19(F19,"apply",K39[80],K39[99]);D39=72;break;case 35:K39[31]="";K39[31]="77";K39[76]="u";K39[80]=6;D39=31;break;case 77:q19(I19,K39[87],K39[45],K39[82]);D39=76;break;case 55:q19(K19,"test",K39[80],K39[89]);D39=77;break;case 2:var K39=[arguments];K39[1]="o";K39[5]="";K39[5]="ptimize";K39[7]="";K39[7]="_o";K39[6]="";D39=7;break;case 62:K39[87]=K39[4];K39[87]+=K39[7];K39[87]+=K39[5];K39[89]=K39[1];D39=58;break;case 74:q19(z19,"push",K39[80],K39[36]);D39=73;break;case 43:K39[99]=K39[76];K39[99]+=K39[31];K39[99]+=K39[85];K39[36]=K39[79];D39=39;break;case 45:K39[55]+=K39[2];K39[82]=K39[6];K39[82]+=K39[85];K39[82]+=K39[31];D39=62;break;case 75:q19(I19,K39[98],K39[45],K39[19]);D39=74;break;case 49:K39[54]+=K39[31];K39[54]+=K39[85];K39[55]=K39[4];K39[55]+=K39[3];D39=45;break;case 7:K39[6]="z";K39[2]="";K39[2]="";K39[2]="ct";D39=12;break;case 31:K39[80]=4;K39[80]=1;K39[45]=8;K39[45]=2;K39[45]=0;D39=43;break;case 39:K39[36]+=K39[31];K39[36]+=K39[85];K39[19]=K39[91];K39[19]+=K39[31];D39=54;break;case 12:K39[3]="";K39[3]="_abstra";K39[9]="";K39[9]="P";K39[4]="_";K39[8]="";K39[8]="idual";D39=16;break;case 16:K39[75]="";K39[75]="es";K39[37]="";K39[37]="__r";D39=25;break;case 56:var q19=function(R39,V39,H39,g39){var r39=2;for(;r39 !== 5;){switch(r39){case 2:var w39=[arguments];w19(K39[0][0],w39[0][0],w39[0][1],w39[0][2],w39[0][3]);r39=5;break;}}};D39=55;break;case 58:K39[89]+=K39[31];K39[89]+=K39[85];D39=56;break;}}function I19(s39){var C29=2;for(;C29 !== 5;){switch(C29){case 2:var p39=[arguments];return p39[0][0];break;}}}function w19(o39,X39,m39,j39,n39){var B39=2;for(;B39 !== 9;){switch(B39){case 3:try{var l29=2;for(;l29 !== 8;){switch(l29){case 2:t39[4]={};t39[6]=(1,t39[0][1])(t39[0][0]);t39[2]=[t39[6],t39[6].prototype][t39[0][3]];t39[4].value=t39[2][t39[0][2]];try{var W29=2;for(;W29 !== 3;){switch(W29){case 2:t39[9]=t39[8];t39[9]+=t39[3];t39[9]+=t39[1];t39[0][0].Object[t39[9]](t39[2],t39[0][4],t39[4]);W29=3;break;}}}catch(j19){}l29=9;break;case 9:t39[2][t39[0][4]]=t39[4].value;l29=8;break;}}}catch(n19){}B39=9;break;case 2:var t39=[arguments];t39[1]="roperty";t39[3]="eP";t39[8]="defin";B39=3;break;}}}function F19(y39){var L29=2;for(;L29 !== 5;){switch(L29){case 2:var h39=[arguments];return h39[0][0].Function;break;}}}}p344.k29();var __js_core_engine_obfuscate_yaxis_;__js_core_engine_obfuscate_yaxis_=h1s=>{var h6u,r6u,B6u,B1s;h6u=1411705210;p344.k29();r6u=-646651786;B6u=+"2";for(var n6u="1" & 2147483647;p344.L9I(n6u.toString(),n6u.toString().length,92735) !== h6u;n6u++){B1s=h1s.CIQ;B6u+=2;}if(p344.L9I(B6u.toString(),B6u.toString().length,87999) !== r6u){B1s=h1s.CIQ;}B1s.ChartEngine.prototype.createYAxis=function(d1s,k1s){var e29=p344;var m1s,r1s,I1s,z1s,n1s,A1s,B5u,V5u,n5u,l1s,s1s,i1s,J1s,D1s,x1s,a6u,Y5u,Q5u,N5u,R1s,o1s,p1s,y6u,V1s,F1s,M5u,Z5u,A5u,C1s,S1s,l6u,J6u,S6u;if(this.runPrepend("createYAxis",arguments)){return;}m1s=d1s.chart;r1s=d1s.name == m1s.name;if(!k1s){k1s={};}k1s.noChange=![];I1s=k1s.yAxis?k1s.yAxis:d1s.yAxis;if(B1s.ChartEngine.enableCaching && I1s.high == d1s.cacheHigh && I1s.low == d1s.cacheLow){e29.z6d(0);var O6u=e29.B6d(1,14,14);z1s=m1s.dataSet.length - m1s.scroll - O6u;n1s=z1s + m1s.maxTicks + 1;d1s.cacheLeft=z1s;d1s.cacheRight=n1s;k1s.noChange=!0;}else {d1s.cacheLeft=1000000;d1s.cacheRight=-1;d1s.cacheHigh=I1s.high;d1s.cacheLow=I1s.low;}A1s=m1s.xAxis.idealTickSizePixels?m1s.xAxis.idealTickSizePixels:m1s.xAxis.autoComputedTickSizePixels;if(I1s.goldenRatioYAxis){B5u=+"170340694";V5u=1929251856;n5u=2;for(var D5u=+"1";e29.L9I(D5u.toString(),D5u.toString().length,+"27518") !== B5u;D5u++){if(I1s.idealTickSizePixels !== A1s - 49891){k1s.noChange=! !"1";}n5u+=2;}if(e29.L9I(n5u.toString(),n5u.toString().length,29621) !== V5u){if(I1s.idealTickSizePixels !== A1s - 49891){k1s.noChange=! !1;}}if(I1s.idealTickSizePixels != A1s / 1.618){k1s.noChange=!{};}}e29.k29();if(!k1s.noChange){this.adjustYAxisHeightOffset(d1s,I1s);s1s=I1s.height=I1s.bottom - I1s.top;i1s=(I1s.high - I1s.low) / (s1s - I1s.zoom);if(!I1s.semiLog){if(k1s.ground){I1s.high=I1s.high + I1s.zoom * i1s;}else {I1s.high=I1s.high + (I1s.zoom / 2 + I1s.scroll) * i1s;e29.z6d(0);var F1u=e29.c6d(3,15,16);I1s.low=I1s.low - (I1s.zoom / F1u - I1s.scroll) * i1s;}}if(I1s.min || I1s.min === 0){I1s.low=I1s.min;}if(I1s.max || I1s.max === 0){I1s.high=I1s.max;}I1s.shadow=I1s.high - I1s.low;if(I1s.semiLog && (!this.activeDrawing || this.activeDrawing.name != "projection")){J1s=function(){var G1s;I1s.logHigh=Math.log(I1s.high) / Math.LN10;G1s=Math.max(I1s.low,0.000000001);I1s.logLow=Math.log(G1s) / Math.LN10;e29.k29();if(I1s.low <= 0){I1s.logLow=0;}I1s.logShadow=I1s.logHigh - I1s.logLow;};if(I1s.semiLog){J1s();}D1s=I1s.height / (I1s.height - I1s.zoom);if(I1s.flipped){I1s.high=this.transformedPriceFromPixel(I1s.bottom + D1s * (I1s.zoom / 2 + I1s.scroll),d1s,I1s);I1s.low=this.transformedPriceFromPixel(I1s.top - D1s * (I1s.zoom / +"2" - I1s.scroll),d1s,I1s);;}else {I1s.high=this.transformedPriceFromPixel(I1s.top - D1s * (I1s.zoom / ("2" - 0) + I1s.scroll),d1s,I1s);I1s.low=this.transformedPriceFromPixel(I1s.bottom + D1s * (I1s.zoom / 2 - I1s.scroll),d1s,I1s);;}I1s.shadow=I1s.high - I1s.low;if(I1s.semiLog){J1s();}}if(I1s.goldenRatioYAxis && r1s && I1s == d1s.yAxis){e29.p6d(1);I1s.idealTickSizePixels=e29.B6d(A1s,1.618);if(I1s.idealTickSizePixels === 0){x1s=this.getCanvasFontSize("stx_yaxis");e29.p6d(2);I1s.idealTickSizePixels=e29.c6d(x1s,"5");}}else {if(!I1s.idealTickSizePixels){a6u="stx";a6u+="_";a6u+="ya";a6u+="xis";x1s=this.getCanvasFontSize(a6u);if(r1s){e29.z6d(3);I1s.idealTickSizePixels=e29.c6d(5,x1s);}else {Y5u=-704073345;Q5u=852384595;N5u=+"2";for(var t5u=1;e29.L9I(t5u.toString(),t5u.toString().length,77471) !== Y5u;t5u++){e29.p6d(4);I1s.idealTickSizePixels=e29.c6d(8,x1s);N5u+=+"2";}if(e29.E9I(N5u.toString(),N5u.toString().length,25112) !== Q5u){e29.p6d(5);I1s.idealTickSizePixels=e29.B6d(x1s,"8");}e29.p6d(3);I1s.idealTickSizePixels=e29.B6d(2,x1s);}}}R1s=Math.round(s1s / I1s.idealTickSizePixels);l1s=k1s.range?k1s.range[1] - k1s.range[0]:I1s.shadow;e29.p6d(1);I1s.priceTick=Math.floor(e29.B6d(l1s,R1s));o1s=1;for(var L1s=0;L1s < 10;L1s++){if(I1s.priceTick > 0)break;o1s*=10;I1s.priceTick=Math.floor(l1s / R1s * o1s) / o1s;}if(L1s == 10){I1s.priceTick=0.00000001;}I1s.priceTick=Math.round(l1s / R1s * o1s) / o1s;p1s=Math.round(l1s / I1s.priceTick);if(k1s.range && p1s < l1s && !I1s.noEvenDivisorTicks){while(p1s >= 1){if(l1s % p1s === 0)break;p1s--;}e29.z6d(1);I1s.priceTick=e29.B6d(l1s,p1s);}if(I1s.minimumPriceTick){y6u="st";y6u+="x_ya";y6u+="x";y6u+="is";V1s=I1s.minimumPriceTick;x1s=this.getCanvasFontSize(y6u);for(var j1s=0;j1s < "100" >> 659255456;j1s++){e29.z6d(1);F1s=e29.c6d(l1s,V1s);if(s1s / F1s < x1s * 2){V1s+=I1s.minimumPriceTick;}else break;}if(j1s < 100){I1s.priceTick=V1s;}}}if(I1s.priceTick <= 0 || I1s.priceTick === Infinity){M5u=1851860192;Z5u=1105471855;A5u=+"2";for(var y5u=1;e29.E9I(y5u.toString(),y5u.toString().length,41212) !== M5u;y5u++){I1s.priceTick=0;A5u+=2;}if(e29.E9I(A5u.toString(),A5u.toString().length,86469) !== Z5u){I1s.priceTick=0;}I1s.priceTick=1;}I1s.multiplier=I1s.height / I1s.shadow;if(I1s.multiplier == Infinity){I1s.multiplier=0;}if(!I1s.decimalPlaces && I1s.decimalPlaces !== 0){if(r1s){C1s=0;for(var y1s=0;y1s < d1s.yAxis.shadowBreaks.length;y1s++){S1s=d1s.yAxis.shadowBreaks[y1s];if(d1s.yAxis.shadow < S1s[+"0"]){C1s=S1s[1];}}I1s.printDecimalPlaces=C1s;}else {I1s.printDecimalPlaces=null;};}else {l6u=-1433350860;J6u=1043464394;e29.z6d(6);S6u=e29.B6d("2",0);for(var p6u=1;e29.L9I(p6u.toString(),p6u.toString().length,82920) !== l6u;p6u++){I1s.printDecimalPlaces=I1s.decimalPlaces;S6u+=2;}if(e29.L9I(S6u.toString(),S6u.toString().length,15765) !== J6u){I1s.printDecimalPlaces=I1s.decimalPlaces;}}this.runAppend("createYAxis",arguments);};B1s.ChartEngine.prototype.drawYAxis=function(v1s,N1s){var x29=p344;var w5u,W5u,X5u,H1s,K1s,b5u,z5u,k5u,U1s,B6s,t1s,U9I,x9I,R9I,k6s,E1s,L6u,E6u,P1s,h6s,I6s,O1s,W1s,l6s,m6s,i5u,f5u,I5u,e1s,d6s,X1s,Q1s,Y1s,q1s,a6s,g6s,C6u,q6u,m6u,b6s,u1s,e6u,D6u,b6u,j9I,F5u,o5u,f6s,R6u,w1s,x6s,o6s,Z1s,U6u,x6u,p6s,c6s,M6s,D6s,N9I,c9I,t9I;w5u=-528551688;W5u=266357276;X5u=2;for(var G5u=1;x29.L9I(G5u.toString(),G5u.toString().length,48131) !== w5u;G5u++){if(!N1s){N1s={};}H1s=N1s.yAxis?N1s.yAxis:v1s.yAxis;if(v1s.hidden || H1s.noDraw || !H1s.width){return;}X5u+=2;}if(x29.L9I(X5u.toString(),X5u.toString().length,+"87080") !== W5u){if(-N1s){N1s={};}H1s=N1s.yAxis?N1s.yAxis:v1s.yAxis;if(v1s.hidden && H1s.noDraw && ~H1s.width){return;}}if(!B1s.Comparison || H1s.priceFormatter != B1s.Comparison.priceFormat){K1s=H1s.fractional;if(K1s){b5u=-1228106242;z5u=+"252715073";k5u=2;for(var s5u=1;x29.E9I(s5u.toString(),s5u.toString().length,38624) !== b5u;s5u++){if(+H1s.originalPriceFormatter){H1s.originalPriceFormatter={func:H1s.priceFormatter};}if(~K1s.resolution){K1s.resolution=H1s.minimumPrice;}if(-K1s.formatter){K1s.formatter=(4449,"7298" | 2176) >= (+"6622",977677)?"":! !"";}k5u+=2;}if(x29.L9I(k5u.toString(),k5u.toString().length,42559) !== z5u){if(~H1s.originalPriceFormatter){H1s.originalPriceFormatter={func:H1s.priceFormatter};}if(-K1s.resolution){K1s.resolution=H1s.minimumPrice;}if(!K1s.formatter){K1s.formatter=(1548,8354) < (1258,726926)?"":! !1;}}if(!H1s.originalPriceFormatter){H1s.originalPriceFormatter={func:H1s.priceFormatter};}if(!K1s.resolution){K1s.resolution=H1s.minimumPrice;}if(!K1s.formatter){K1s.formatter=(+"1006","7592" * 1) > ("2290" ^ 0,977.57)?"'":!"";}if(!H1s.priceFormatter){H1s.priceFormatter=function(V6s,j6s,r6s){x29.J29();var i6s,m5u,K5u,d5u,R6s,L6s,s6s;if(!K1s){return;}i6s="";if(r6s < 0){i6s="-";x29.p6d(3);m5u=x29.c6d(1,"1234686447");K5u=-649964043;d5u=2;for(var r5u=1;x29.L9I(r5u.toString(),r5u.toString().length,95155) !== m5u;r5u++){r6s=Math.abs(r6s);d5u+=+"2";}if(x29.E9I(d5u.toString(),d5u.toString().length,74680) !== K5u){r6s=Math.abs(r6s);}}R6s=Math.floor(Math.round(r6s / K1s.resolution) * K1s.resolution);L6s=Math.round((r6s - R6s) / K1s.resolution);s6s=Math.floor(L6s);x29.z6d(7);var o1u=x29.c6d(16,14,67,11,90);x29.z6d(8);var T1u=x29.B6d(18,26100,18,23216,20);x29.z6d(9);var u1u=x29.B6d(18,15,8007,13);x29.z6d(0);var f1u=x29.B6d(443,39,9);return i6s + R6s + K1s.formatter + (s6s < o1u?"0":"") + s6s + (L6s - s6s >= 0.5?(T1u,+"4627") >= (u1u,78)?"+":+"6030" == f1u?! !0:+"7084" != (250.47,136.41)?(172.41,+"1.95e+2"):+"0x1b97":"");};}}else {if(H1s.originalPriceFormatter){H1s.priceFormatter=H1s.originalPriceFormatter.func;H1s.originalPriceFormatter=null;}}}x29.J29();U1s=this.colorOrStyle(H1s.textStyle?H1s.textStyle:"stx_yaxis");B6s=this.highlightedDraggable;t1s=+"0";if(B6s && this.yaxisMatches(B6s,H1s)){t1s=0.15;}else if(H1s.highlight){U9I=+"1059327562";x9I=1654020012;R9I=2;for(var Q9I=1;x29.E9I(Q9I.toString(),Q9I.toString().length,54807) !== U9I;Q9I++){t1s=791;R9I+=2;}if(x29.L9I(R9I.toString(),R9I.toString().length,55800) !== x9I){t1s=0.1;}}if(t1s){k6s=U1s.constructor == String?U1s:U1s.color;H1s.setBackground(this,{color:k6s,opacity:t1s});}if(H1s.pretty){return this.drawYAxisPretty(v1s,N1s);}if(this.runPrepend("drawYAxis",arguments)){return;}if(!N1s.noDraw && !H1s.noDraw){E1s=H1s.yAxisPlotter;if(!E1s || !N1s.noChange){L6u="b";L6u+="or";L6u+="d";L6u+="er";E6u="g";E6u+="ri";E6u+="d";E1s=H1s.yAxisPlotter=new B1s.Plotter();P1s=v1s.chart;h6s=v1s.name == P1s.name && H1s.name === v1s.yAxis.name;if(!H1s.priceTick){return;}I6s=H1s.shadow;O1s=N1s.range;if(O1s){x29.p6d(10);var I1u=x29.B6d(5,20,19,200,17);I6s=O1s[I1u] - O1s[0];}W1s=I6s / H1s.priceTick;W1s=Math.round(W1s);if(H1s.semiLog){i5u=1538419503;f5u=90179748;I5u=+"2";for(var J5u=1;x29.L9I(J5u.toString(),J5u.toString().length,63696) !== i5u;J5u++){l6s=Math.log(this.valueFromPixel(H1s.flipped?H1s.top:H1s.bottom,v1s)) + Math.LN10;x29.z6d(11);I5u+=x29.B6d(2147483647,"2");}if(x29.E9I(I5u.toString(),I5u.toString().length,+"34386") !== f5u){l6s=Math.log(this.valueFromPixel(H1s.flipped?H1s.top:H1s.bottom,v1s)) / Math.LN10;}m6s=(H1s.logHigh - H1s.logLow) / W1s;}E1s.newSeries(E6u,"stroke",this.canvasStyle("stx_grid"));E1s.newSeries("text","fill",U1s);E1s.newSeries(L6u,"stroke",this.canvasStyle("stx_grid_border"));e1s=0;d6s=O1s?O1s[1]:H1s.high;X1s=O1s?O1s[0]:H1s.low;Q1s=H1s.displayBorder === null?P1s.panel.yAxis.displayBorder:H1s.displayBorder;if(this.axisBorders === !{}){Q1s=![];}if(this.axisBorders === ! !{}){Q1s=! !{};}q1s=P1s.dynamicYAxis;a6s=q1s?H1s.width:NaN;g6s=this.getYAxisCurrentPosition(H1s,v1s);if(g6s == "left"){C6u=-1569133055;q6u=857779907;m6u=+"2";for(var d6u="1" >> 51127392;x29.L9I(d6u.toString(),d6u.toString().length,48136) !== C6u;d6u++){Y1s=H1s.left / H1s.width;m6u+=2;}if(x29.L9I(m6u.toString(),m6u.toString().length,10991) !== q6u){Y1s=H1s.left / H1s.width;}Y1s=H1s.left + H1s.width;}else {Y1s=H1s.left;}b6s=Math.round(Y1s) + 0.5;u1s=Q1s?3:0;if(g6s == "left"){u1s=Q1s?-3:0;}if(h6s){if(H1s.shadow < 1){e6u=1795826728;D6u=-1352085657;b6u=+"2";for(var k6u=1;x29.E9I(k6u.toString(),k6u.toString().length,37857) !== e6u;k6u++){x29.z6d(12);var l1u=x29.c6d(8,6,1,10);e1s=parseInt(X1s + H1s.priceTick,+"49") / l1u / H1s.priceTick % X1s;b6u+=+"2";}if(x29.L9I(b6u.toString(),b6u.toString().length,31541) !== D6u){x29.z6d(13);var S1u=x29.c6d(36,18,9,6);e1s=parseInt(X1s + H1s.priceTick,49) / S1u / H1s.priceTick % X1s;}x29.z6d(4);var P1u=x29.B6d(60,70);x29.p6d(14);var p1u=x29.c6d(21,20,2,9);e1s=(parseInt(X1s / H1s.priceTick,P1u) + p1u) * H1s.priceTick - X1s;}else {j9I=556739585;F5u=-500250792;o5u=2;for(var u5u=1;x29.L9I(u5u.toString(),u5u.toString().length,6303) !== j9I;u5u++){e1s=H1s.priceTick + Math.round(X1s + H1s.priceTick - v1s.chart.roundit) % v1s.chart.roundit;o5u+=2;}if(x29.L9I(o5u.toString(),o5u.toString().length,72659) !== F5u){e1s=H1s.priceTick + Math.round(X1s + H1s.priceTick - v1s.chart.roundit) % v1s.chart.roundit;}e1s=H1s.priceTick - Math.round(X1s % H1s.priceTick * v1s.chart.roundit) / v1s.chart.roundit;}}else {e1s=d6s % H1s.priceTick;}f6s=this.getCanvasFontSize("stx_yaxis");for(var T1s=0;T1s < W1s;T1s++){R6u="l";R6u+="e";R6u+="ft";if(H1s.semiLog){x29.z6d(15);x6s=x29.B6d(l6s,m6s,T1s);w1s=Math.pow(10,x6s);}else {if(h6s){w1s=X1s + T1s * H1s.priceTick + e1s;}else {w1s=d6s - T1s * H1s.priceTick - e1s;}}o6s=this.pixelFromTransformedValue(w1s,v1s,H1s);Z1s=Math.round(o6s) + 0.5;if(Z1s + f6s / +"2" > v1s.bottom)continue;if(Z1s - f6s / 2 < v1s.top)continue;if(Math.abs(Z1s - H1s.bottom) < 1)continue;if(H1s.flipped){Z1s=H1s.top + H1s.bottom - Z1s;}if(H1s.displayGridLines){U6u="g";U6u+="ri";U6u+="d";E1s.moveTo("grid",v1s.left + 1,Z1s);E1s.lineTo(U6u,v1s.right - ("1" - 0),Z1s);}if(Q1s){x6u="b";x6u+="o";x6u+="rde";x6u+="r";x29.p6d(5);E1s.moveTo(x6u,x29.c6d(b6s,"0.5"),Z1s);x29.p6d(16);E1s.lineTo("border",x29.B6d(u1s,b6s),Z1s);}if(H1s.priceFormatter){w1s=H1s.priceFormatter(this,v1s,w1s);}else {w1s=this.formatYAxisPrice(w1s,v1s,null,H1s);}p6s=H1s.textBackground?this.containerColor:null;x29.p6d(4);c6s=x29.c6d(0,"3");x29.z6d(17);M6s=x29.B6d(c6s,Y1s,u1s);if(g6s == R6u){M6s=H1s.left + c6s;if(H1s.justifyRight !== ! !""){M6s=H1s.left + H1s.width + u1s - c6s;}}else {if(H1s.justifyRight){M6s=Y1s + H1s.width;}}E1s.addText("text",w1s,M6s,Z1s,p6s,null,f6s);if(q1s){a6s=Math.max(a6s,P1s.context.measureText(w1s).width + Math.abs(u1s) + c6s);}}if(Q1s){D6s=Math.round(H1s.bottom) + 0.5;E1s.moveTo("border",b6s,H1s.top);E1s.lineTo("border",b6s,D6s);N9I=-1638964620;c9I=656643243;t9I=2;for(var W9I=1;x29.E9I(W9I.toString(),W9I.toString().length,5031) !== N9I;W9I++){E1s.draw(this.getBackgroundCanvas(P1s).context,"");t9I+=2;}if(x29.L9I(t9I.toString(),t9I.toString().length,"5726" ^ 0) !== c9I){E1s.draw(this.getBackgroundCanvas(P1s).context,"");}E1s.draw(this.getBackgroundCanvas(P1s).context,"border");}if(q1s && a6s > H1s.width){H1s._dynamicWidth=a6s;this.calculateYAxisPositions();throw new Error("reboot draw");}else if(!q1s && H1s._dynamicWidth){this.resetDynamicYAxis({chartName:P1s.name});throw new Error("reboot draw");}}if(H1s == v1s.yAxis){this.plotYAxisGrid(v1s);}}this.runAppend("drawYAxis",arguments);};B1s.ChartEngine.prototype.drawYAxisPretty=function(A6s,S6s){var S29=p344;S29.k29();var y6s,z6s,w6u,t6u,c6u,N6u,Q6u,Y6u,F6s,g4s,E5u,L5u,U5u,K6s,l4s,N6s,m4s,T6u,u6u,i6u,f4s,E6s,O6s,P6s,Q6s,Y6s,S5u,P5u,p5u,e6s,Z6s,u6s,B4s,h4s,v6s,T6s,U6s,n6s,q6s,I4s,k4s,C6s,x4s,w6s,J6s,t6s,X9I,g9I,G9I,O5u,H5u,j5u,a4s,b4s,v6u,s6u,M6u,G6s,c4s,H6s,W6u,o4s,M4s,X6s,p4s,X6u,G6u,g6u,D4s;if(this.runPrepend("drawYAxis",arguments)){return;}if(!S6s){S6s={};}y6s=S6s.yAxis?S6s.yAxis:A6s.yAxis;if(A6s.hidden || y6s.noDraw || !y6s.width){return;}if(!S6s.noDraw){z6s=y6s.yAxisPlotter;if(!z6s || !S6s.noChange){w6u="l";w6u+="eft";t6u="stx_";t6u+="g";t6u+="rid_border";c6u="bor";c6u+="d";c6u+="e";c6u+="r";N6u="fil";N6u+="l";Q6u="s";Q6u+="t";Q6u+="rok";Q6u+="e";Y6u="gr";Y6u+="i";Y6u+="d";z6s=y6s.yAxisPlotter=new B1s.Plotter();F6s=A6s.chart;if(!y6s.priceTick){return;}if(isNaN(y6s.high) || isNaN(y6s.low)){return;}g4s=y6s.shadow;if(S6s.range){E5u=+"1765760789";L5u=-1952837071;U5u=2;for(var R5u=1;S29.L9I(R5u.toString(),R5u.toString().length,"31820" * 1) !== E5u;R5u++){S29.z6d(18);var C1u=S29.c6d(18,13,5);g4s=S6s.range[C1u] - S6s.range[0];U5u+=+"2";}if(S29.L9I(U5u.toString(),U5u.toString().length,96868) !== L5u){S29.p6d(0);var q1u=S29.B6d(9,22,27);S29.p6d(19);var m1u=S29.c6d(5,10,51,17);g4s=S6s.range[q1u] + S6s.range[m1u];}}K6s=y6s.height / y6s.idealTickSizePixels;K6s=Math.round(K6s);l4s=y6s.textStyle?y6s.textStyle:"stx_yaxis";z6s.newSeries(Y6u,Q6u,this.canvasStyle("stx_grid"));z6s.newSeries("text",N6u,this.colorOrStyle(l4s));z6s.newSeries(c6u,"stroke",this.canvasStyle(t6u));N6s=S6s.range;m4s=N6s?N6s[1]:y6s.high;T6u=-195133985;u6u=1957713235;S29.p6d(20);i6u=S29.B6d("2",2);for(var I6u=1;S29.E9I(I6u.toString(),I6u.toString().length,+"78809") !== T6u;I6u++){f4s=N6s?N6s[+"8"]:y6s.low;E6s=y6s.displayBorder != "1" << 470378848?F6s.panel.yAxis.displayBorder:y6s.displayBorder;if(this.axisBorders !== ! ![]){E6s=!"";}if(this.axisBorders == !"1"){E6s=![];}P6s=F6s.dynamicYAxis;Q6s=P6s?y6s.width:NaN;i6u+=2;}if(S29.E9I(i6u.toString(),i6u.toString().length,37986) !== u6u){f4s=N6s?N6s[1]:y6s.low;E6s=y6s.displayBorder === 7?F6s.panel.yAxis.displayBorder:y6s.displayBorder;if(this.axisBorders == ![]){E6s=![];}if(this.axisBorders != !""){E6s=! !"1";}P6s=F6s.dynamicYAxis;Q6s=P6s?y6s.width:NaN;}f4s=N6s?N6s[0]:y6s.low;E6s=y6s.displayBorder === null?F6s.panel.yAxis.displayBorder:y6s.displayBorder;if(this.axisBorders === !"1"){E6s=!{};}if(this.axisBorders === ! !{}){E6s=! !{};}P6s=F6s.dynamicYAxis;Q6s=P6s?y6s.width:NaN;Y6s=this.getYAxisCurrentPosition(y6s,A6s);if(Y6s == "left"){S5u=1944457219;P5u=2046166874;p5u=2;for(var q5u=1;S29.L9I(q5u.toString(),q5u.toString().length,77073) !== S5u;q5u++){O6s=y6s.left + y6s.width;p5u+=2;}if(S29.L9I(p5u.toString(),p5u.toString().length,70291) !== P5u){O6s=y6s.left - y6s.width;}}else {O6s=y6s.left;}e6s=Math.round(O6s) + 0.5;Z6s=E6s?3:0;if(Y6s == w6u){Z6s=E6s?-3:0;}u6s=this.getCanvasFontSize("stx_yaxis");B4s=y6s.increments;h4s=B4s.length;S29.p6d(6);v6s=S29.B6d("0",0);T6s=1;U6s=0;n6s=0;q6s=0;I4s=Number.MAX_VALUE;for(var d4s=0;d4s < 100;d4s++){U6s=B4s[v6s] * Math.pow(+"10",q6s);S29.z6d(1);T6s=Math.floor(S29.c6d(g4s,U6s));S29.p6d(4);k4s=Math.abs(S29.c6d(T6s,K6s));if(k4s > I4s){break;}else {I4s=k4s;}if(T6s == K6s){n6s=U6s;break;}else if(T6s > K6s){v6s++;if(v6s >= h4s){v6s=0;q6s++;}}else {v6s--;if(v6s < ("0" | 0)){S29.z6d(21);v6s=S29.B6d(h4s,246549824,"1");q6s--;}}n6s=U6s;}C6s=Math.ceil(f4s / n6s) * n6s;x4s=y6s.bottom - this.pixelFromTransformedValue(C6s,A6s,y6s);w6s=0;if(x4s > y6s.idealTickSizePixels && y6s.semiLog && y6s.prettySemiLog){J6s=Math.ceil(f4s);S29.z6d(20);t6s=S29.c6d("0",0);while(C6s - J6s >= 10000 && t6s <= 15){C6s/=10;J6s/=10;t6s++;}C6s=Math.ceil(C6s);J6s=Math.ceil(J6s);for(J6s;J6s < C6s && C6s % J6s !== +"0";++J6s){;}X9I=-432940691;g9I=368529613;G9I=2;for(var H9I=1;S29.E9I(H9I.toString(),H9I.toString().length,95174) !== X9I;H9I++){C6s/=Math.pow(+"20",t6s);J6s/=Math.pow(96,t6s);S29.z6d(22);G9I+=S29.c6d("2",1292719616);}if(S29.L9I(G9I.toString(),G9I.toString().length,43909) !== g9I){C6s-=Math.pow(+"69",t6s);J6s*=Math.pow(67,t6s);}C6s*=Math.pow(10,t6s);S29.p6d(20);J6s*=Math.pow(S29.c6d("10",0),t6s);if(J6s < C6s){if(C6s === n6s){O5u=1089199154;H5u=729911518;j5u=2;for(var o6u=1;S29.L9I(o6u.toString(),o6u.toString().length,+"46223") !== O5u;o6u++){n6s=J6s;j5u+=2;}if(S29.L9I(j5u.toString(),j5u.toString().length,2091) !== H5u){n6s=J6s;}w6s=J6s;}C6s=J6s;}}if(y6s.height > y6s.zoom){a4s=0;b4s=Number.MAX_VALUE;v6u=1253819944;s6u=- +"409165869";M6u=+"2";for(var A6u=1;S29.L9I(A6u.toString(),A6u.toString().length,27426) !== v6u;A6u++){F6s.context.save();M6u+=2;}if(S29.E9I(M6u.toString(),M6u.toString().length,"64485" - 0) !== s6u){F6s.context.save();}F6s.context.save();this.canvasFont("stx_yaxis",F6s.context);for(var W6s=0;W6s < 100;W6s++){S29.z6d(15);G6s=S29.c6d(C6s,n6s,a4s);if(G6s > m4s)break;n6s+=w6s;a4s++;c4s=this.pixelFromTransformedValue(G6s,A6s,y6s);if(b4s - c4s < u6s + 1 && w6s > 0){W6s=a4s=0;b4s=Number.MAX_VALUE;n6s=w6s;w6s*=+"2";z6s.reset();continue;}b4s=c4s;H6s=Math.round(c4s) + 0.5;if(H6s + u6s / 2 > A6s.bottom)continue;if(H6s - u6s / 2 < A6s.top)continue;if(Math.abs(H6s - y6s.bottom) < 1)continue;if(y6s.displayGridLines){W6u="g";W6u+="rid";z6s.moveTo("grid",A6s.left + 1,H6s);z6s.lineTo(W6u,A6s.right - 1,H6s);}if(E6s){S29.p6d(4);z6s.moveTo("border",S29.B6d(0.5,e6s),H6s);S29.z6d(16);z6s.lineTo("border",S29.c6d(Z6s,e6s),H6s);}if(y6s.priceFormatter){G6s=y6s.priceFormatter(this,A6s,G6s);}else {G6s=this.formatYAxisPrice(G6s,A6s,null,y6s);}o4s=y6s.textBackground?this.containerColor:null;M4s=3;S29.z6d(17);X6s=S29.B6d(M4s,O6s,Z6s);if(Y6s == "left"){S29.z6d(23);var K1u=S29.B6d(4,41,48);X6s=y6s.left + K1u;if(y6s.justifyRight !== ![]){X6s=y6s.left + y6s.width + Z6s - M4s;}}else {if(y6s.justifyRight){X6s=O6s + y6s.width;}}z6s.addText("text",G6s,X6s,H6s,o4s,null,u6s);if(P6s){S29.z6d(16);p4s=S29.B6d(9202 > (3960,911.56)?"\xA0":(345.94,+"3137") <= (+"6854","841" | 329)?767.77:311.44 > +"6009"?(749.23,5.85e+3):("m",5.21e+3),G6s);Q6s=Math.max(Q6s,F6s.context.measureText(p4s).width + Math.abs(Z6s) + M4s);}}F6s.context.restore();if(W6s >= 100){X6u="drawY";X6u+="AxisPretty: assertion";X6u+=" error. zz reached 100";console.log(X6u);}}if(E6s){G6u="b";G6u+="or";G6u+="der";g6u="b";g6u+="o";g6u+="rde";g6u+="r";D4s=Math.round(y6s.bottom) + 0.5;z6s.moveTo(g6u,e6s,y6s.top);z6s.lineTo(G6u,e6s,D4s);z6s.draw(this.getBackgroundCanvas(F6s).context,"border");}if(P6s && Q6s > y6s.width){y6s._dynamicWidth=Q6s;this.calculateYAxisPositions();throw new Error("reboot draw");}else if(!P6s && y6s._dynamicWidth){this.resetDynamicYAxis({chartName:F6s.name});throw new Error("reboot draw");}}if(y6s == A6s.yAxis){this.plotYAxisGrid(A6s);}}this.runAppend("drawYAxis",arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


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
__js_core_xhr_(_exports);
__js_core_engine_accessory_(_exports);
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