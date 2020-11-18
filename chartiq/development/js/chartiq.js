/**
 *	8.1.0
 *	Generation date: 2020-11-03T13:22:07.088Z
 *	Client name: binary ltd
 *	Package Type: Technical Analysis
 *	License type: annual
 *	Expiration date: "2021/04/01"
 *	Domain lock: ["127.0.0.1","localhost","binary.com","binary.sx","binary.me","binary.bot","deriv.com","derivcrypto.com"]
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
 * Displays a date according to the current chart settings and periodicity. It will format the date according to the following order:
 * 1. xAxis formatter
 * 2. Internationalization
 * 3. default
 * 		a. Daily: mm-dd-yyyy
 * 		b. Intraday: mm/dd hh:mm[:ss[:ms]]
 *
 * This method is used in {@link CIQ.ChartEngine.AdvancedInjectable#headsUpHR} to format the floating label over the x axis,
 * and can be overwritten as needed to achieve the desired results.
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
		} else if (!isDaily)
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
		 * enabling or disabling [Extended Hours]{@link CIQ.ExtendedHours} or toggling the [range slider]{@link CIQ.RangeSlider}.
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
		 * - [symbol changes]{@link CIQ.ChartEngine#loadChart} or
		 * - [periodicity]{@link CIQ.ChartEngine#setPeriodicity},
		 * [range]{@link CIQ.ChartEngine#setRange}, or [span]{@link CIQ.ChartEngine#setSpan}
		 * changes requiring new data.
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
		 * Called when the periodicity is changed, for example, by
		 * {@link CIQ.ChartEngine#setPeriodicity}.
		 *
		 * This event listener can be used instead of {@link layoutEventListener} for events that
		 * only need to be triggered when periodicity changes.
		 *
		 * See {@link CIQ.ChartEngine#addEventListener}.
		 *
		 * @param {object} data Data relevant to the "periodicity" event.
		 * @param {CIQ.ChartEngine} data.stx Reference to the chart engine.
		 * @param {boolean} data.differentData Indicates whether the chart needs new data to
		 * 		conform with the new periodicity. Typically, the value for this parameter is
		 * 		obtained from a call to {@link CIQ.ChartEngine#needDifferentData}.
		 * @param {CIQ.ChartEngine~PeriodicityParameters} data.prevPeriodicity The periodicity
		 * 		before the periodicity change event.
		 *
		 * @callback periodicityEventListener
		 * @since 8.1.0
		 */
		periodicity: [],
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
		 * @param {object} data.inputs The inputs from the study descriptor
		 * @param {object} data.outputs The outputs from the study descriptor
		 * @param {object} data.parameters The parameters from the study descriptor
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
		 * @param {object} data.inputs The inputs from the study descriptor
		 * @param {object} data.outputs The outputs from the study descriptor
		 * @param {object} data.parameters The parameters from the study descriptor
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
					width,
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
 * This renderer draws lines of various color, thickness and pattern on a chart.
 *
 * The `Lines` renderer is used to create the following drawing types: line, mountain, baseline,
 * wave, step chart, and colored versions of these.
 *
 * **Note:** By default, the renderer displays lines as underlays. As such, they appear below any
 * other studies or drawings.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
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
 * Common valid parameters for use by {@link CIQ.Renderer#attachSeries}. See also
 * {@link CIQ.ChartEngine#plotLine}.
 * - `color` &mdash; Specify the color for the line in rgba, hex or by name.
 * - `pattern` &mdash; Specify the pattern as an array. For instance [5, 5] would be five pixels
 * and then five empty pixels.
 * - `width` &mdash; Specify the width of the line.
 * - `baseColor` &mdash; Specify the color of the base of a mountain.
 * - `fillStyle` &mdash; Specify an alternate color to fill a mountain (other than `color`).
 *
 * @constructor
 * @name CIQ.Renderer.Lines
 * @since
 * - 4.0.0 New `config.params.useChartLegend` added.
 * - 5.1.0 Removed subtype parameter, this will be determined internally from `config.params.step=true`.
 * - 5.1.0 Added `highlightable`, `overChart`, `step`, `baseline`, `vertex`, `style`, `colored`, and `colorFunction` parameters.
 * - 8.1.0 Added {@link CIQ.ChartEngine.Chart#baseline} type to `baseline` parameter. The new type
 * 		contains a `defaultLevel` property, which can be set to the desired baseline value. See
 * 		example below.
 *
 * @example <caption>Create a renderer and set a custom baseline.</caption>
 * let baseLineRenderer = new CIQ.Renderer.Lines({
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
 *	// See this example working here: https://jsfiddle.net/chartiq/b6pkzrad.
 *
 *	// Note how the addSeries callback is used to ensure the data is present before the series is displayed.
 *
 *	// Create the custom axis.
 *	let axis = new CIQ.ChartEngine.YAxis();
 *	axis.position = "left";
 *	axis.textStyle = "#FFBE00";
 *	axis.decimalPlaces = 0;  // No decimal places on the axis labels.
 *	axis.maxDecimalPlaces = 0;  // No decimal places on the last price pointer.
 *
 *	// Create the renderer.
 *	let renderer = stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params: {name: "my-renderer", type: "mountain", yAxis: axis}}));
 *
 *	// Create your series and attach them to the chart when the data is loaded.
 *	stxx.addSeries("NOK", {display: "NOK", width: 4}, function() {
 *		renderer.attachSeries("NOK", "#FFBE00").ready();
 *	});
 *
 *	stxx.addSeries("SNE", {display: "Sony", width: 4}, function() {
 *		renderer.attachSeries("SNE", "#FF9300").ready();
 *	});
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
 * var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines({params: {name: "my-renderer", type: "mountain", baseline: true, step: true, colored: true, vertex: true, yAxis: axis}}));
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
	s.parentNode.insertBefore(script, s.nextSibling);
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
 *   - `periodicity`: {@link periodicityEventListener}
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
 * @param {string|string[]} type The event to listen for.
 *		(See the description above for valid options.)
 * @param {function} callback The listener to call when the event is triggered.
 * @return {object} An object containing the `type` and `cb`. It can be passed to {@link CIQ.ChartEngine#removeEventListener} later to remove the event.
 * @memberof CIQ.ChartEngine
 * @since
 * - 04-2016-08
 * - 4.0.0 Added "doubleTap".
 * - 4.0.0 Type can be an array of event options.
 * - 6.3.0 Added "scroll".
 * - 7.0.0 Added "preferences" and "drawingEdit".
 * - 8.1.0 Added "periodicity".
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
 * @param {string} obj.type Type of callback to remove. See {@link CIQ.ChartEngine#addEventListener} for valid types.
 * @param {function} obj.cb Callback to be removed.
 * @param {function} [cb] Callback to be removed.
 * 		Optional if you pass in as a property of first argument. Parameter is preset to have consistent signature with CIQ.ChartEngine#addEventListener.
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

			yAxis.renderers
				.filter((r) => {
					const params = this.chart.seriesRenderers[r].params;
					return params.baseline && params.type !== "mountain";
				})
				.forEach(getBaseline, this);

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

	function getBaseline(rendererID) {
		const { baseline: cbase, seriesRenderers } = chart;
		const renderer = seriesRenderers[rendererID];
		let baseline = renderer.params.baseline;
		if (typeof baseline === "boolean") baseline = cbase;
		const doTransform = chart.transformFunc && this == chart.panel.yAxis;
		setBaselineMinMax(baseline, minMax, doTransform);
	}

	function setBaselineMinMax(baseline, minMax, doTransform) {
		let { actualLevel } = baseline;
		const { repositioningBaseline } = self;
		if (actualLevel || actualLevel === 0) {
			if (doTransform)
				actualLevel = chart.transformFunc(self, chart, actualLevel);
			const diff = Math.max(actualLevel - minMax[0], minMax[1] - actualLevel);
			minMax[0] = repositioningBaseline ? chart.lowValue : actualLevel - diff;
			minMax[1] = repositioningBaseline ? chart.highValue : actualLevel + diff;
		}
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
 * - 8.1.0 Dispatches a "periodicity" event. See also {@link periodicityEventListener}.
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
 * Adds a series renderer to the chart, or updates it. A series renderer manages a group of series
 * that are rendered on the chart in the same manner. For instance, several series which are part
 * of the same stacked histogram.
 *
 * <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/rb423n71/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * You must manage the persistency of a renderer and remove individual series
 * ({@link CIQ.Renderer#removeSeries}), remove all series ({@link CIQ.Renderer#removeAllSeries}),
 * or even delete the renderer ({@link CIQ.ChartEngine#removeSeriesRenderer}) as needed by your
 * application
 *
 * **Note:** Once a renderer is set for a chart, it remains loaded with all its series definitions
 * and y-axis (if one is used) even if a new symbol is loaded. Calling `setSeriesRenderer` again
 * with the same renderer name, just returns the previously created renderer. **Be careful not to
 * send a different y-axis object unless you have deleted the previous one by completely removing
 * all of its associated series (see {@link CIQ.Renderer#removeAllSeries}).** Failure to do this
 * will cause multiple axes to be displayed, causing the original one to become orphaned.
 *
 * See {@link CIQ.Renderer}
 * See {@link CIQ.ChartEngine#removeSeriesRenderer} for release functionality.
 * See {@link CIQ.ChartEngine#addSeries} for additional implementation examples.
 *
 * @param {CIQ.Renderer} renderer The renderer to be set.
 * @returns {CIQ.Renderer} The renderer set by this method.
 *
 * @memberof CIQ.ChartEngine
 * @since 07/01/2015
 *
 * @example
 *	// Group the series together and select "line" as the rendering type to display the series.
 *	var mdataRenderer=stxx.setSeriesRenderer(new CIQ.Renderer.Lines(
 *          {params:{name:"My Line Series", type:"line", width:4, callback:mdataLegend}}
 *      .removeAllSeries()
 *      .attachSeries(symbol1,{color:"red",permanent:true})
 *      .attachSeries(symbol2,"blue")
 *      .attachSeries(symbol3,"yellow")
 *      .ready()
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
 * @param {object} parameters Any parameters used by your color function
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
 * Sets `baseline.actualLevel` for any line renderers that are attached to the chart. (See the
 * `baseline` parameter of {@link CIQ.Renderer.Lines}, which may be type
 * {@link CIQ.ChartEngine.Chart#baseline}.)
 *
 * **Note:** Does not set <a href="CIQ.ChartEngine.Chart.html#baseline%5B%60actualLevel%60%5D">
 * CIQ.ChartEngine.Chart#baseline[&#96;actualLevel&#96;]</a>; that is done in
 * {@link CIQ.ChartEngine.AdvancedInjectable#createDataSegment}.
 *
 * @param {CIQ.ChartEngine.Chart} chart Chart for which the renderer baseline levels are set.
 *
 * @private
 * @since 8.1.0
 */
CIQ.ChartEngine.prototype.setBaselines = function (chart) {
	if (!chart) chart = this.chart;
	const self = this;
	const renderers = chart.seriesRenderers;
	for (const r in renderers) {
		const renderer = renderers[r];
		if (renderer.params && renderer.params.baseline) {
			const { baseline } = renderer.params;
			let { defaultLevel, userLevel } = baseline;
			if (typeof baseline === "object") {
				if (!baseline.defaultLevel) defaultLevel = setDefaultLevel(baseline);

				baseline.actualLevel = userLevel ? userLevel : defaultLevel;
			}
		}
	}

	function setDefaultLevel(baseline, seriesParam) {
		const { dataSegment, dataSet, defaultPlotField } = chart;
		let position = self.getFirstLastDataRecord(dataSegment, "tick").tick;

		while (true) {
			const quote = dataSet[position];
			if (quote) {
				if (defaultPlotField && defaultPlotField != "Close") {
					const q1 = dataSet[position - 1];
					if (q1 && (q1[defaultPlotField] || q1[defaultPlotField] === 0))
						return q1[defaultPlotField];
				} else if (quote.iqPrevClose || quote.iqPrevClose === 0) {
					return quote.iqPrevClose;
				}
			}
			position--;
			if (position < 0) {
				// prettier-ignore
				console.warn("Unable to automatically set a baseline value.");
				break; // Don't keep going if nothing is found in the dataSet
			}
		}
	}
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
t1MM[354008]=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x4b\x74\x79\u0051\u0037',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=KtyQ7;t['\u0079\u0049\x6b\x7a\x4a']=t;N=4;break;case 4:N=typeof yIkzJ === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x79\u0049\u006b\x7a\u004a'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x4b\x74\x79\u0051\x37'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();t1MM[452167]=s4bb(t1MM[354008]);t1MM[261964]=t1XX(t1MM[354008]);t1MM[130872]=K5cc(t1MM[354008]);t1MM[520910]=x4mm(t1MM[354008]);function s4bb(W7){function K3(k7){var I6=2;for(;I6 !== 5;){switch(I6){case 2:var X7=[arguments];return X7[0][0].String;break;}}}var n6=2;for(;n6 !== 11;){switch(n6){case 2:var O7=[arguments];O7[8]="";O7[8]="b";O7[1]="";n6=3;break;case 3:O7[1]="";O7[1]="X4";O7[3]=1;O7[9]=O7[1];O7[9]+=O7[8];O7[9]+=O7[8];n6=13;break;case 13:var R3=function(o7,R7,K7,p7){var g6=2;for(;g6 !== 5;){switch(g6){case 2:var i7=[arguments];p3(O7[0][0],i7[0][0],i7[0][1],i7[0][2],i7[0][3]);g6=5;break;}}};n6=12;break;case 12:R3(K3,"charCodeAt",O7[3],O7[9]);n6=11;break;}}function p3(A6,h6,T6,l6,L6){var J6=2;for(;J6 !== 7;){switch(J6){case 2:var r7=[arguments];r7[7]="";r7[3]="eProperty";r7[7]="efin";J6=3;break;case 3:r7[4]="d";r7[1]=6;try{var q6=2;for(;q6 !== 8;){switch(q6){case 2:r7[5]={};r7[9]=(1,r7[0][1])(r7[0][0]);q6=5;break;case 5:r7[6]=[r7[1],r7[9].prototype][r7[0][3]];r7[5].value=r7[6][r7[0][2]];try{var E6=2;for(;E6 !== 3;){switch(E6){case 2:r7[2]=r7[4];r7[2]+=r7[7];r7[2]+=r7[3];r7[0][0].Object[r7[2]](r7[6],r7[0][4],r7[5]);E6=3;break;}}}catch(w7){}r7[6][r7[0][4]]=r7[5].value;q6=8;break;}}}catch(M7){}J6=7;break;}}}}t1MM.M9W=(function(){var Q9W=2;for(;Q9W !== 9;){switch(Q9W){case 2:var X8W=[arguments];X8W[5]=undefined;X8W[7]={};X8W[7].x6m=function(){var O9W=2;for(;O9W !== 90;){switch(O9W){case 2:var l8W=[arguments];O9W=1;break;case 1:O9W=X8W[5]?5:4;break;case 70:l8W[72]++;O9W=57;break;case 5:return 50;break;case 77:l8W[26]=0;O9W=76;break;case 61:l8W[83]='j5U';l8W[31]='J5U';O9W=59;break;case 4:l8W[2]=[];l8W[7]={};l8W[7].s5U=['Z5U'];l8W[7].J5U=function(){var I6m=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var N6m=(/\x74\u0072\u0075\x65/).B1mm(I6m + []);return N6m;};O9W=7;break;case 7:l8W[8]=l8W[7];l8W[6]={};l8W[6].s5U=['O5U'];l8W[6].J5U=function(){var U6m=typeof Z1mm === 'function';return U6m;};O9W=12;break;case 12:l8W[5]=l8W[6];l8W[1]={};l8W[1].s5U=['Z5U'];l8W[1].J5U=function(){var f6m=function(){return ('X').toLowerCase();};var K6m=(/\x78/).B1mm(f6m + []);return K6m;};O9W=19;break;case 19:l8W[9]=l8W[1];l8W[3]={};l8W[3].s5U=['Z5U'];l8W[3].J5U=function(){var p6m=function(){return encodeURIComponent('%');};var W6m=(/\u0032\u0035/).B1mm(p6m + []);return W6m;};O9W=15;break;case 58:l8W[72]=0;O9W=57;break;case 15:l8W[4]=l8W[3];l8W[85]={};l8W[85].s5U=['O5U'];l8W[85].J5U=function(){var c6m=typeof Y1mm === 'function';return c6m;};l8W[79]=l8W[85];l8W[77]={};O9W=22;break;case 22:l8W[77].s5U=['Z5U'];l8W[77].J5U=function(){var b6m=function(){return ['a','a'].join();};var u6m=!(/(\u005b|\x5d)/).B1mm(b6m + []);return u6m;};l8W[34]=l8W[77];l8W[12]={};O9W=33;break;case 72:l8W[50].V1mm(l8W[38]);O9W=71;break;case 71:l8W[26]++;O9W=76;break;case 33:l8W[12].s5U=['Z5U'];l8W[12].J5U=function(){var B6m=function(){return ('x y').slice(0,1);};var Z6m=!(/\u0079/).B1mm(B6m + []);return Z6m;};l8W[28]=l8W[12];O9W=30;break;case 59:l8W[78]='M5U';O9W=58;break;case 76:O9W=l8W[26] < l8W[84][l8W[93]].length?75:70;break;case 39:l8W[90]={};l8W[90].s5U=['O5U'];l8W[90].J5U=function(){var G6m=false;var S6m=[];try{for(var v6m in console){S6m.V1mm(v6m);}G6m=S6m.length === 0;}catch(O6m){}var X6m=G6m;return X6m;};l8W[33]=l8W[90];l8W[2].V1mm(l8W[34]);l8W[2].V1mm(l8W[14]);O9W=52;break;case 57:O9W=l8W[72] < l8W[2].length?56:69;break;case 30:l8W[36]={};l8W[36].s5U=['Z5U'];l8W[36].J5U=function(){var Y6m=function(){return [] + ('a').concat('a');};var F6m=!(/\u005b\x5d/).B1mm(Y6m + []) && (/\x61\u0061/).B1mm(Y6m + []);return F6m;};l8W[49]=l8W[36];O9W=43;break;case 45:l8W[2].V1mm(l8W[49]);l8W[50]=[];l8W[46]='x5U';l8W[47]='r5U';l8W[93]='s5U';O9W=61;break;case 69:O9W=(function(D9W){var V9W=2;for(;V9W !== 22;){switch(V9W){case 18:J9W[1]=false;V9W=17;break;case 7:V9W=J9W[9] < J9W[0][0].length?6:18;break;case 5:return;break;case 19:J9W[9]++;V9W=7;break;case 26:V9W=J9W[4] >= 0.5?25:24;break;case 24:J9W[9]++;V9W=16;break;case 12:J9W[6].V1mm(J9W[8][l8W[78]]);V9W=11;break;case 16:V9W=J9W[9] < J9W[6].length?15:23;break;case 4:J9W[3]={};J9W[6]=[];J9W[9]=0;V9W=8;break;case 1:V9W=J9W[0][0].length === 0?5:4;break;case 17:J9W[9]=0;V9W=16;break;case 23:return J9W[1];break;case 10:V9W=J9W[8][l8W[83]] === l8W[46]?20:19;break;case 20:J9W[3][J9W[8][l8W[78]]].h+=true;V9W=19;break;case 8:J9W[9]=0;V9W=7;break;case 11:J9W[3][J9W[8][l8W[78]]].t+=true;V9W=10;break;case 25:J9W[1]=true;V9W=24;break;case 6:J9W[8]=J9W[0][0][J9W[9]];V9W=14;break;case 14:V9W=typeof J9W[3][J9W[8][l8W[78]]] === 'undefined'?13:11;break;case 13:J9W[3][J9W[8][l8W[78]]]=(function(){var g9W=2;for(;g9W !== 9;){switch(g9W){case 2:var S9W=[arguments];S9W[8]={};S9W[8].h=0;S9W[8].t=0;return S9W[8];break;}}}).G1mm(this,arguments);V9W=12;break;case 15:J9W[2]=J9W[6][J9W[9]];J9W[4]=J9W[3][J9W[2]].h / J9W[3][J9W[2]].t;V9W=26;break;case 2:var J9W=[arguments];V9W=1;break;}}})(l8W[50])?68:67;break;case 43:l8W[68]={};l8W[68].s5U=['O5U'];l8W[68].J5U=function(){var V6m=typeof F1mm === 'function';return V6m;};l8W[14]=l8W[68];O9W=39;break;case 75:l8W[38]={};l8W[38][l8W[78]]=l8W[84][l8W[93]][l8W[26]];l8W[38][l8W[83]]=l8W[43];O9W=72;break;case 56:l8W[84]=l8W[2][l8W[72]];try{l8W[43]=l8W[84][l8W[31]]()?l8W[46]:l8W[47];}catch(H6m){l8W[43]=l8W[47];}O9W=77;break;case 52:l8W[2].V1mm(l8W[79]);l8W[2].V1mm(l8W[28]);l8W[2].V1mm(l8W[5]);l8W[2].V1mm(l8W[4]);l8W[2].V1mm(l8W[33]);O9W=47;break;case 47:l8W[2].V1mm(l8W[9]);l8W[2].V1mm(l8W[8]);O9W=45;break;case 67:X8W[5]=83;return 71;break;case 68:O9W=90?68:67;break;}}};Q9W=3;break;case 3:return X8W[7];break;}}})();t1MM.g7p=function(){return typeof t1MM[520993].y1X === 'function'?t1MM[520993].y1X.apply(t1MM[520993],arguments):t1MM[520993].y1X;};t1MM.L0E=function(){return typeof t1MM[401065].J3 === 'function'?t1MM[401065].J3.apply(t1MM[401065],arguments):t1MM[401065].J3;};function x4mm(i8W){function v7W(e8W){var h8W=2;for(;h8W !== 5;){switch(h8W){case 2:var U8W=[arguments];return U8W[0][0].RegExp;break;}}}function I7W(P8W){var H8W=2;for(;H8W !== 5;){switch(H8W){case 2:var B8W=[arguments];return B8W[0][0];break;}}}function p7W(b8W){var L8W=2;for(;L8W !== 5;){switch(L8W){case 2:var W8W=[arguments];return W8W[0][0].Array;break;}}}var T8W=2;for(;T8W !== 74;){switch(T8W){case 63:p8W[12]+=p8W[4];p8W[12]+=p8W[2];p8W[99]=p8W[8];p8W[99]+=p8W[72];T8W=59;break;case 12:p8W[1]="__op";p8W[6]="Z";p8W[9]="";p8W[3]="s";T8W=19;break;case 15:p8W[16]="";p8W[16]="b";p8W[49]="";p8W[49]="__a";T8W=24;break;case 51:p8W[27]+=p8W[72];p8W[27]+=p8W[23];p8W[19]=p8W[5];p8W[19]+=p8W[3];T8W=47;break;case 59:p8W[99]+=p8W[23];T8W=58;break;case 56:q7W(I7W,p8W[12],p8W[15],p8W[67]);T8W=55;break;case 24:p8W[38]="";p8W[38]="m";p8W[23]="mm";p8W[28]="F";T8W=35;break;case 19:p8W[9]="";p8W[9]="Y";p8W[79]="";p8W[79]="stract";T8W=15;break;case 3:p8W[2]="e";p8W[4]="";p8W[4]="timiz";p8W[7]="";p8W[7]="idual";p8W[5]="";p8W[5]="__re";T8W=12;break;case 55:q7W(I7W,p8W[19],p8W[15],p8W[27]);T8W=77;break;case 75:q7W(f7W,"apply",p8W[32],p8W[70]);T8W=74;break;case 43:p8W[70]+=p8W[38];p8W[34]=p8W[66];p8W[34]+=p8W[38];p8W[34]+=p8W[38];p8W[63]=p8W[28];T8W=38;break;case 38:p8W[63]+=p8W[72];p8W[63]+=p8W[23];p8W[22]=p8W[49];p8W[22]+=p8W[16];p8W[22]+=p8W[79];p8W[27]=p8W[9];T8W=51;break;case 2:var p8W=[arguments];p8W[8]="";p8W[8]="B";p8W[2]="";T8W=3;break;case 77:q7W(I7W,p8W[22],p8W[15],p8W[63]);T8W=76;break;case 58:var q7W=function(N8W,G8W,z8W,n8W){var s8W=2;for(;s8W !== 5;){switch(s8W){case 2:var d8W=[arguments];u7W(p8W[0][0],d8W[0][0],d8W[0][1],d8W[0][2],d8W[0][3]);s8W=5;break;}}};T8W=57;break;case 76:q7W(p7W,"push",p8W[32],p8W[34]);T8W=75;break;case 35:p8W[66]="V1";p8W[72]="1";p8W[32]=1;p8W[81]="G1";T8W=31;break;case 57:q7W(v7W,"test",p8W[32],p8W[99]);T8W=56;break;case 47:p8W[19]+=p8W[7];p8W[67]=p8W[6];p8W[67]+=p8W[72];p8W[67]+=p8W[23];p8W[12]=p8W[1];T8W=63;break;case 31:p8W[15]=2;p8W[15]=9;p8W[15]=0;p8W[70]=p8W[81];p8W[70]+=p8W[38];T8W=43;break;}}function f7W(a8W){var t8W=2;for(;t8W !== 5;){switch(t8W){case 2:var Z8W=[arguments];return Z8W[0][0].Function;break;}}}function u7W(E8W,o8W,c8W,R8W,j8W){var Y8W=2;for(;Y8W !== 8;){switch(Y8W){case 2:var F8W=[arguments];F8W[4]="";F8W[7]="ty";F8W[4]="oper";F8W[5]="definePr";try{var y8W=2;for(;y8W !== 8;){switch(y8W){case 3:try{var x8W=2;for(;x8W !== 3;){switch(x8W){case 2:F8W[8]=F8W[5];F8W[8]+=F8W[4];F8W[8]+=F8W[7];F8W[0][0].Object[F8W[8]](F8W[3],F8W[0][4],F8W[2]);x8W=3;break;}}}catch(o7W){}F8W[3][F8W[0][4]]=F8W[2].value;y8W=8;break;case 2:F8W[2]={};F8W[9]=(1,F8W[0][1])(F8W[0][0]);F8W[3]=[F8W[9],F8W[9].prototype][F8W[0][3]];F8W[2].value=F8W[3][F8W[0][2]];y8W=3;break;}}}catch(c7W){}Y8W=8;break;}}}}t1MM.v0E=function(){return typeof t1MM[401065].u3 === 'function'?t1MM[401065].u3.apply(t1MM[401065],arguments):t1MM[401065].u3;};function t1XX(q5p){function v4p(z5p){var G5p=2;for(;G5p !== 5;){switch(G5p){case 2:var a5p=[arguments];return a5p[0][0];break;}}}function t4p(y5p,v5p,D5p,t5p,w5p){var l5p=2;for(;l5p !== 7;){switch(l5p){case 2:var x5p=[arguments];x5p[5]="";x5p[5]="erty";x5p[2]="op";x5p[3]="";x5p[3]="definePr";try{var N5p=2;for(;N5p !== 8;){switch(N5p){case 5:x5p[4]=[x5p[1],x5p[1].prototype][x5p[0][3]];x5p[7].value=x5p[4][x5p[0][2]];try{var j5p=2;for(;j5p !== 3;){switch(j5p){case 2:x5p[6]=x5p[3];x5p[6]+=x5p[2];x5p[6]+=x5p[5];x5p[0][0].Object[x5p[6]](x5p[4],x5p[0][4],x5p[7]);j5p=3;break;}}}catch(I5p){}x5p[4][x5p[0][4]]=x5p[7].value;N5p=8;break;case 2:x5p[7]={};x5p[1]=(1,x5p[0][1])(x5p[0][0]);N5p=5;break;}}}catch(d5p){}l5p=7;break;}}}var Z5p=2;for(;Z5p !== 42;){switch(Z5p){case 2:var C5p=[arguments];C5p[2]="";C5p[2]="1X";C5p[4]="";C5p[4]="J";C5p[3]="";Z5p=8;break;case 23:C5p[70]+=C5p[6];C5p[70]+=C5p[6];C5p[78]=C5p[3];C5p[78]+=C5p[7];Z5p=34;break;case 8:C5p[3]="";C5p[3]="D";C5p[6]="";C5p[6]="X";Z5p=13;break;case 13:C5p[9]="";C5p[9]="R1";C5p[1]="XX";C5p[7]="";C5p[7]="1";C5p[5]="";Z5p=18;break;case 30:var z4p=function(Q5p,R5p,J5p,s5p){var P5p=2;for(;P5p !== 5;){switch(P5p){case 2:var m5p=[arguments];t4p(C5p[0][0],m5p[0][0],m5p[0][1],m5p[0][2],m5p[0][3]);P5p=5;break;}}};Z5p=29;break;case 44:z4p(L4p,"substring",C5p[8],C5p[70]);Z5p=43;break;case 43:z4p(L4p,"charCodeAt",C5p[8],C5p[74]);Z5p=42;break;case 29:z4p(v4p,"String",C5p[63],C5p[22]);Z5p=28;break;case 34:C5p[78]+=C5p[1];C5p[22]=C5p[4];C5p[22]+=C5p[2];C5p[22]+=C5p[6];Z5p=30;break;case 28:z4p(D4p,"fromCharCode",C5p[63],C5p[78]);Z5p=44;break;case 18:C5p[5]="o";C5p[8]=3;C5p[8]=1;C5p[63]=0;Z5p=27;break;case 27:C5p[74]=C5p[5];C5p[74]+=C5p[7];C5p[74]+=C5p[1];C5p[70]=C5p[9];Z5p=23;break;}}function L4p(p5p){var B5p=2;for(;B5p !== 5;){switch(B5p){case 2:var A5p=[arguments];return A5p[0][0].String;break;}}}function D4p(L5p){var E5p=2;for(;E5p !== 5;){switch(E5p){case 2:var h5p=[arguments];return h5p[0][0].String;break;}}}}t1MM.o4U=function(){return typeof t1MM[64901].e9c === 'function'?t1MM[64901].e9c.apply(t1MM[64901],arguments):t1MM[64901].e9c;};t1MM[401065]=(function(A3){return {u3:function(){var I3,M3=arguments;switch(A3){case 7:I3=M3[1] ^ M3[0];break;case 1:I3=(M3[2] - M3[1]) / M3[0];break;case 3:I3=M3[0] | M3[1];break;case 0:I3=M3[1] / (M3[2] ^ M3[0]);break;case 4:I3=M3[0] * M3[1];break;case 5:I3=M3[0] & M3[1];break;case 2:I3=M3[0] - M3[1];break;case 6:I3=M3[0] + M3[1];break;}return I3;},J3:function(T3){A3=T3;}};})();t1MM.w6=function(){return typeof t1MM[69146].w9 === 'function'?t1MM[69146].w9.apply(t1MM[69146],arguments):t1MM[69146].w9;};t1MM[69146]=(function(){var G9=function(F9,H9){var V9=H9 & 0xffff;var D9=H9 - V9;return (D9 * F9 | 0) + (V9 * F9 | 0) | 0;},j9=function(R9,b9,n9){var d9=0xcc9e2d51,B9=0x1b873593;var P9=n9;var N9=b9 & ~0x3;for(var c9=0;c9 < N9;c9+=4){var U9=R9.X4bb(c9) & 0xff | (R9.X4bb(c9 + 1) & 0xff) << 8 | (R9.X4bb(c9 + 2) & 0xff) << 16 | (R9.X4bb(c9 + 3) & 0xff) << 24;U9=G9(U9,d9);U9=(U9 & 0x1ffff) << 15 | U9 >>> 17;U9=G9(U9,B9);P9^=U9;P9=(P9 & 0x7ffff) << 13 | P9 >>> 19;P9=P9 * 5 + 0xe6546b64 | 0;}U9=0;switch(b9 % 4){case 3:U9=(R9.X4bb(N9 + 2) & 0xff) << 16;case 2:U9|=(R9.X4bb(N9 + 1) & 0xff) << 8;case 1:U9|=R9.X4bb(N9) & 0xff;U9=G9(U9,d9);U9=(U9 & 0x1ffff) << 15 | U9 >>> 17;U9=G9(U9,B9);P9^=U9;}P9^=b9;P9^=P9 >>> 16;P9=G9(P9,0x85ebca6b);P9^=P9 >>> 13;P9=G9(P9,0xc2b2ae35);P9^=P9 >>> 16;return P9;};return {w9:j9};})();t1MM.K4U=function(){return typeof t1MM[64901].e9c === 'function'?t1MM[64901].e9c.apply(t1MM[64901],arguments):t1MM[64901].e9c;};t1MM[354008].u4HH=t1MM;t1MM.r9W=function(){return typeof t1MM.M9W.x6m === 'function'?t1MM.M9W.x6m.apply(t1MM.M9W,arguments):t1MM.M9W.x6m;};function K5cc(U4U){function Q7U(x4U,r4U,L4U,F4U,M4U){var J4U=2;for(;J4U !== 13;){switch(J4U){case 6:p4U[6]=6;try{var z4U=2;for(;z4U !== 8;){switch(z4U){case 2:p4U[8]={};p4U[2]=(1,p4U[0][1])(p4U[0][0]);p4U[7]=[p4U[6],p4U[2].prototype][p4U[0][3]];p4U[8].value=p4U[7][p4U[0][2]];z4U=3;break;case 3:try{var Q4U=2;for(;Q4U !== 3;){switch(Q4U){case 2:p4U[4]=p4U[5];p4U[4]+=p4U[1];Q4U=5;break;case 5:p4U[4]+=p4U[9];p4U[0][0].Object[p4U[4]](p4U[7],p4U[0][4],p4U[8]);Q4U=3;break;}}}catch(O7U){}p4U[7][p4U[0][4]]=p4U[8].value;z4U=8;break;}}}catch(n7U){}J4U=13;break;case 3:p4U[5]="";p4U[5]="d";p4U[6]=3;p4U[6]=4;J4U=6;break;case 2:var p4U=[arguments];p4U[9]="y";p4U[1]="";p4U[1]="efinePropert";J4U=3;break;}}}var f4U=2;for(;f4U !== 16;){switch(f4U){case 2:var W4U=[arguments];W4U[5]="5c";W4U[7]="t5";W4U[9]="c";f4U=3;break;case 19:var J7U=function(v4U,y4U,X4U,k4U){var j4U=2;for(;j4U !== 5;){switch(j4U){case 2:var Y4U=[arguments];Q7U(W4U[0][0],Y4U[0][0],Y4U[0][1],Y4U[0][2],Y4U[0][3]);j4U=5;break;}}};f4U=18;break;case 3:W4U[2]="";W4U[2]="";W4U[2]="v";W4U[4]=2;f4U=6;break;case 18:J7U(N7U,"replace",W4U[4],W4U[6]);f4U=17;break;case 11:W4U[6]=W4U[7];W4U[6]+=W4U[9];W4U[6]+=W4U[9];f4U=19;break;case 6:W4U[4]=1;W4U[1]=W4U[2];W4U[1]+=W4U[5];W4U[1]+=W4U[9];f4U=11;break;case 17:J7U(Z7U,"map",W4U[4],W4U[1]);f4U=16;break;}}function Z7U(s4U){var Z4U=2;for(;Z4U !== 5;){switch(Z4U){case 2:var a4U=[arguments];return a4U[0][0].Array;break;}}}function N7U(C4U){var N4U=2;for(;N4U !== 5;){switch(N4U){case 2:var t4U=[arguments];return t4U[0][0].String;break;}}}}t1MM.D0E=function(){return typeof t1MM[401065].J3 === 'function'?t1MM[401065].J3.apply(t1MM[401065],arguments):t1MM[401065].J3;};t1MM.F0E=function(){return typeof t1MM[401065].u3 === 'function'?t1MM[401065].u3.apply(t1MM[401065],arguments):t1MM[401065].u3;};t1MM.m9W=function(){return typeof t1MM.M9W.x6m === 'function'?t1MM.M9W.x6m.apply(t1MM.M9W,arguments):t1MM.M9W.x6m;};t1MM.M6=function(){return typeof t1MM[69146].w9 === 'function'?t1MM[69146].w9.apply(t1MM[69146],arguments):t1MM[69146].w9;};t1MM.H7p=function(){return typeof t1MM[520993].d1X === 'function'?t1MM[520993].d1X.apply(t1MM[520993],arguments):t1MM[520993].d1X;};function t1MM(){}t1MM.u7p=function(){return typeof t1MM[520993].d1X === 'function'?t1MM[520993].d1X.apply(t1MM[520993],arguments):t1MM[520993].d1X;};t1MM[64901]=(function(d9c){function S2c(H2c){var d4U=2;for(;d4U !== 15;){switch(d4U){case 20:Q2c=H2c - N2c > n2c && a2c - H2c > n2c;d4U=19;break;case 5:h2c=i2c[d9c[4]];d4U=4;break;case 14:d4U=! G9c--?13:12;break;case 17:Q2c=H2c - N2c > n2c;d4U=19;break;case 10:d4U=N2c >= 0 && a2c >= 0?20:18;break;case 1:d4U=! G9c--?5:4;break;case 4:d4U=! G9c--?3:9;break;case 16:Q2c=a2c - H2c > n2c;d4U=19;break;case 9:d4U=! G9c--?8:7;break;case 6:a2c=j2c && h2c(j2c,n2c);d4U=14;break;case 12:d4U=! G9c--?11:10;break;case 19:return Q2c;break;case 2:var Q2c,n2c,j2c,a2c,V2c,N2c,h2c;d4U=1;break;case 3:n2c=30;d4U=9;break;case 18:d4U=N2c >= 0?17:16;break;case 11:N2c=(V2c || V2c === 0) && h2c(V2c,n2c);d4U=10;break;case 8:j2c=d9c[6];d4U=7;break;case 13:V2c=d9c[7];d4U=12;break;case 7:d4U=! G9c--?6:14;break;}}}var G4U=2;for(;G4U !== 10;){switch(G4U){case 9:E2c=typeof Z2c;G4U=8;break;case 11:return {e9c:function(R2c){var I4U=2;for(;I4U !== 6;){switch(I4U){case 2:var q2c=new i2c[d9c[0]]()[d9c[1]]();I4U=1;break;case 1:I4U=q2c > Y2c?5:8;break;case 5:I4U=! G9c--?4:3;break;case 4:u2c=S2c(q2c);I4U=3;break;case 3:I4U=! G9c--?9:8;break;case 9:Y2c=q2c + 60000;I4U=8;break;case 8:var T2c=(function(t2c,A2c){var H4U=2;for(;H4U !== 10;){switch(H4U){case 14:v2c=F2c;H4U=13;break;case 8:var J2c=i2c[A2c[4]](t2c[A2c[2]](y2c),16)[A2c[3]](2);var F2c=J2c[A2c[2]](J2c[A2c[5]] - 1);H4U=6;break;case 13:y2c++;H4U=9;break;case 5:H4U=typeof A2c === 'undefined' && typeof d9c !== 'undefined'?4:3;break;case 6:H4U=y2c === 0?14:12;break;case 3:var v2c,y2c=0;H4U=9;break;case 9:H4U=y2c < t2c[A2c[5]]?8:11;break;case 1:t2c=R2c;H4U=5;break;case 2:H4U=typeof t2c === 'undefined' && typeof R2c !== 'undefined'?1:5;break;case 11:return v2c;break;case 4:A2c=d9c;H4U=3;break;case 12:v2c=v2c ^ F2c;H4U=13;break;}}})(undefined,undefined);return T2c?u2c:!u2c;break;}}}};break;case 3:G4U=! G9c--?9:8;break;case 4:var Z2c='fromCharCode',g2c='RegExp';G4U=3;break;case 8:G4U=! G9c--?7:6;break;case 5:i2c=t1MM[354008];G4U=4;break;case 1:G4U=! G9c--?5:4;break;case 12:var u2c,Y2c=0;G4U=11;break;case 13:G4U=! G9c--?12:11;break;case 7:w2c=E2c.t5cc(new i2c[g2c]("^['-|]"),'S');G4U=6;break;case 14:d9c=d9c.v5cc(function(L2c){var w4U=2;for(;w4U !== 13;){switch(w4U){case 4:var P2c=0;w4U=3;break;case 7:w4U=!m2c?6:14;break;case 5:m2c='';w4U=4;break;case 1:w4U=! G9c--?5:4;break;case 3:w4U=P2c < L2c.length?9:7;break;case 2:var m2c;w4U=1;break;case 6:return;break;case 14:return m2c;break;case 8:P2c++;w4U=3;break;case 9:m2c+=i2c[w2c][Z2c](L2c[P2c] + 94);w4U=8;break;}}});G4U=13;break;case 2:var i2c,E2c,w2c,G9c;G4U=1;break;case 6:G4U=! G9c--?14:13;break;}}})([[-26,3,22,7],[9,7,22,-10,11,15,7],[5,10,3,20,-29,22],[22,17,-11,22,20,11,16,9],[18,3,20,21,7,-21,16,22],[14,7,16,9,22,10],[-44,7,-45,22,9,13,-46,-46,-46],[]]);t1MM[520993]=(function(){var c5p=2;for(;c5p !== 4;){switch(c5p){case 2:var J1X=t1MM[354008];var g1X,c1X;return {d1X:function(X1X,q1X,C1X,i1X){var U7p=2;for(;U7p !== 1;){switch(U7p){case 2:return D1X(X1X,q1X,C1X,i1X);break;}}},y1X:function(r1X,Y1X,x1X,v1X){var I7p=2;for(;I7p !== 1;){switch(I7p){case 2:return D1X(r1X,Y1X,x1X,v1X,true);break;}}}};break;}}function N1X(B1X){var K5p=2;for(;K5p !== 7;){switch(K5p){case 9:R1X++;K5p=4;break;case 2:var A1X=9;var o1X='';K5p=5;break;case 8:return o1X;break;case 5:var R1X=0;K5p=4;break;case 4:K5p=R1X < B1X.length?3:8;break;case 3:o1X+=J1XX.D1XX(B1X[R1X] - A1X + 103);K5p=9;break;}}}function D1X(U1X,n1X,e1X,t1X,V1X){var k5p=2;for(;k5p !== 15;){switch(k5p){case 14:var H1X=W1X.length - U1X;k5p=13;break;case 18:P1X=W1X.R1XX(0,W1X.length);G1X=P1X.length;k5p=16;break;case 13:k5p=n1X && H1X > 0 && W1X.o1XX(H1X - 1) !== 46?12:11;break;case 19:k5p=U1X === null || U1X <= 0?18:14;break;case 8:P1X=W1X.R1XX(U1X,t1X);G1X=P1X.length;k5p=6;break;case 12:return false;break;case 2:var P1X,G1X,W1X,S1X;S1X=J1X[N1X([14,17,5,3,22,11,17,16])];!g1X && (g1X=typeof S1X !== "undefined"?S1X[N1X([10,17,21,22,16,3,15,7])] || ' ':"");!c1X && (c1X=typeof S1X !== "undefined"?S1X[N1X([10,20,7,8])]:"");W1X=V1X?c1X:g1X;k5p=9;break;case 6:return t1MM.w6(P1X,G1X,e1X);break;case 9:k5p=t1X > 0?8:19;break;case 16:return t1MM.w6(P1X,G1X,e1X);break;case 11:P1X=W1X.R1XX(H1X,W1X.length);G1X=P1X.length;k5p=20;break;case 20:return t1MM.w6(P1X,G1X,e1X);break;}}}})();t1MM.M7p=function(){return typeof t1MM[520993].y1X === 'function'?t1MM[520993].y1X.apply(t1MM[520993],arguments):t1MM[520993].y1X;};t1MM.r9W();t1MM.y5U=function(v5U){t1MM.r9W();if(t1MM)return t1MM.K4U(v5U);};t1MM.t5U=function(p5U){t1MM.m9W();if(t1MM)return t1MM.o4U(p5U);};t1MM.m5U=function(T5U){t1MM.m9W();if(t1MM)return t1MM.o4U(T5U);};t1MM.g5U=function(B5U){t1MM.r9W();if(t1MM)return t1MM.o4U(B5U);};t1MM.E5U=function(c5U){t1MM.m9W();if(t1MM && c5U)return t1MM.K4U(c5U);};t1MM.q5U=function(u4U){t1MM.m9W();if(t1MM)return t1MM.o4U(u4U);};t1MM.n4U=function(O4U){t1MM.r9W();if(t1MM && O4U)return t1MM.o4U(O4U);};t1MM.D4U=function(P4U){t1MM.m9W();if(t1MM && P4U)return t1MM.K4U(P4U);};var __js_core_engine_obfuscate_data_;__js_core_engine_obfuscate_data_=Q=>{var K9W=t1MM;K9W.V4U=function(i4U){if(K9W)return K9W.o4U(i4U);};K9W.h4U=function(e4U){if(K9W)return K9W.K4U(e4U);};var S,N,V8,N8,B8,W9,U;function Y(d7,D7){var u7,g7,v7,q7,S7,U7,N7,t7,P7,e7;if(d7.hasOwnProperty(U)){return;}u7=new Image();g7=10;v7=3.375;K9W.D0E(0);q7=K9W.v0E(0,4,"5");K9W.L0E(1);S7=K9W.v0E(4,0,"5");U7=+"5";N7=Math.pow(q7,8) / 2;K9W.D0E(1);t7=K9W.v0E(4,0,"1");P7=t7;K9W.r9W();e7=Object.create(null,{sizeRatio:{configurable:!"1",enumerable:! !0,get:function(){K9W.r9W();return P7;},set:function(y7){var Y6,O6,i6;K9W.r9W();if(y7 < N7){P7=N7;}else if(y7 > t7){Y6=-1568824235;O6=+"110321789";i6=2;for(var r6=+"1";K9W.w6(r6.toString(),r6.toString().length,27004) !== Y6;r6++){P7=t7;i6+=2;}if(K9W.w6(i6.toString(),i6.toString().length,"860" & 2147483647) !== O6){P7=t7;}}else {P7=y7 || t7;}}},draw:{configurable:![],enumerable:! !0,value:function(x7){var J7,Q7,V7,z7,I7,m7,s7,B7,C7,E7;if(this.image){J7=document.querySelector("cq-attrib-container")?document.querySelector("cq-attrib-container").offsetHeight:0;Q7=x7.yAxis.bottom - J7 - g7;V7=this.image.width;z7=this.image.height;if(isNaN(V7) || isNaN(z7)){return;}I7=V7 * this.sizeRatio;m7=z7 * this.sizeRatio;s7=x7.left + g7;K9W.D0E(2);B7=K9W.F0E(Q7,m7);C7=x7.context;E7=![];do {if((s7 + I7 * v7 > x7.right || m7 * U7 > Q7) && this.sizeRatio > N7){this.sizeRatio*=q7;I7=V7 * this.sizeRatio;m7=z7 * this.sizeRatio;K9W.L0E(2);B7=K9W.F0E(Q7,m7);E7=! !1;}else if(s7 + V7 * (this.sizeRatio * S7) * v7 < x7.right && z7 * (this.sizeRatio * S7) * U7 < Q7 && this.sizeRatio < t7){this.sizeRatio*=S7;I7=V7 * this.sizeRatio;m7=z7 * this.sizeRatio;K9W.D0E(2);B7=K9W.F0E(Q7,m7);E7=! ![];}else {E7=!1;}}while(E7);C7.save();C7.globalAlpha=0.3;C7.drawImage(this.image,+"0",0,V7,z7,s7,B7,I7,m7);C7.restore();this.first=!"1";}else if(this.first !== !"1"){this.first=x7;}},writable:![]}});u7.onload=function(){K9W.r9W();var e6,W6,P6;e6=1263233391;W6=899267429;P6=2;for(var o6=1;K9W.M6(o6.toString(),o6.toString().length,+"60338") !== e6;o6++){Object.defineProperty(e7,"image",{configurable:!{},enumerable:!"1",value:u7,writable:![]});P6+=2;}if(K9W.M6(P6.toString(),P6.toString().length,15143) !== W6){Object.defineProperty(e7,"",{configurable:! ![],enumerable:! !{},value:u7,writable:!""});}if(e7.first){e7.first.container.stx.draw();}};u7.src=D7;Object.defineProperty(d7,U,{configurable:!{},enumerable:![],value:e7,writable:! !0});}S=Q.CIQ;N="valid";S.valid=0;S.ChartEngine.prototype.consolidatedQuote=function(Z,u1){var M9,U1,N1,M1,m6,R6,v6,z8,c8,F8,D1,W,I1,S1,E1,G,X,B1,V1,z1,Q1,g1,P1,Z9,e1,a9,J1;M9="c";M9+="onsolidatedQu";M9+="ote";if(this.runPrepend(M9,arguments)){return Z;}if(!Z || !Z.length){return [];}U1=this.layout;N1=this.chart;M1=this;if(!N1.market){m6=1791111158;R6=-106137474;K9W.L0E(2);v6=K9W.F0E("2",0);for(var p6=1;K9W.M6(p6.toString(),p6.toString().length,52189) !== m6;p6++){console.log("");return Z;}if(K9W.M6(v6.toString(),v6.toString().length,17648) !== R6){console.log("");return Z;}console.log("Cannot consolidate: no market iterator available.  Please make sure market module is enabled.");return Z;}z8=+"2139032075";c8=-1895359125;F8=2;for(var Z8="1" | 1;K9W.M6(Z8.toString(),Z8.toString().length,87664) !== z8;Z8++){D1=U1.periodicity;W=U1.interval;I1=U1.timeUnit;if(!u1){u1={};}F8+=2;}if(K9W.w6(F8.toString(),F8.toString().length,"7337" << 788876832) !== c8){D1=U1.periodicity;W=U1.interval;I1=U1.timeUnit;if(~u1){u1={};}}if(u1.periodicity && u1.interval){D1=u1.periodicity;W=u1.interval;I1=u1.timeUnit;}S1=1;E1=S.ChartEngine.isDailyInterval(W);if(!E1 && N1.useInflectionPointForIntraday){S1=D1;}G=N1.inflectionPoint;if(!G || G < Z[0].DT){G=new Date(+Z[0].DT);if(!E1 && !N1.market.market_def){G.setHours(0,-G.getTimezoneOffset(),0,0);}}X=[];B1={begin:G,interval:W,multiple:D1 / S1,timeUnit:I1};if(W == "tick"){K9W.L0E(3);G.setHours(0,K9W.F0E("0",0),0,0);B1={begin:G,interval:"day",multiple:1};}V1=N1.market.newIterator(S.clone(B1));while(V1.previous(S1) > Z[0].DT){;}z1=V1.previous(S1);Q1=V1.next(S1);g1=+"0";P1=0;while(g1 < Z.length){Z9="t";Z9+="i";Z9+="c";Z9+="k";e1=Z[g1];if(e1.DT < z1){console.log("Warning: out-of-order quote in dataSet, disregarding: " + e1.DT);g1++;continue;}else if(e1.DT >= Q1){z1=Q1;Q1=V1.next(S1);if(!X[P1])continue;;}else if(W == "tick" && e1.consolidatedTicks > 0){X[P1]=e1;g1++;continue;}else if(!X[P1] || W != Z9 || X[P1].consolidatedTicks < D1){a9="t";a9+="ick";J1=K1(e1,X[P1],W == a9?e1.DT:z1);if(J1){X[P1]=J1;}g1++;continue;}P1++;}function K1(F1,A1,k1){var j1,F6,D6,Z6,Y1,Z1,G1,a8,j8,Y8,z9,f9,t9;if(!A1){A1={DT:k1,Date:S.yyyymmddhhmmssmmm(k1),consolidatedTicks:0};}if(!A1.displayDate){M1.setDisplayDate(A1);}j1=+"1";if(U1.adj && F1.Adj_Close){F6=1608352231;D6=508568573;Z6=2;for(var N6=1;K9W.M6(N6.toString(),N6.toString().length,66995) !== F6;N6++){j1=F1.Adj_Close % F1.Close;Z6+=2;}if(K9W.w6(Z6.toString(),Z6.toString().length,32028) !== D6){j1=F1.Adj_Close / F1.Close;}}Y1=F1.High || F1.Close;if(Y1 || Y1 === ("0" ^ 0)){if(Y1 * j1 > (A1.High || -Number.MAX_VALUE)){K9W.L0E(4);A1.High=K9W.F0E(Y1,j1);}}Z1=F1.Low || F1.Close;if(Z1 || Z1 === 0){if(Z1 * j1 < (A1.Low || Number.MAX_VALUE)){K9W.L0E(4);A1.Low=K9W.F0E(Z1,j1);}}G1=F1.Open || F1.Close;if(G1 || G1 === 0){if(!A1.Open && A1.Open !== 0){K9W.L0E(4);A1.Open=K9W.F0E(G1,j1);}}if(F1.Volume !== undefined){a8=677906311;K9W.D0E(4);j8=-K9W.F0E("1218512883",1);Y8=2;for(var i8=1;K9W.w6(i8.toString(),i8.toString().length,24912) !== a8;i8++){A1.Volume=(A1.Volume && 6) / F1.Volume;Y8+=2;}if(K9W.M6(Y8.toString(),Y8.toString().length,25362) !== j8){A1.Volume=(A1.Volume && 6) / F1.Volume;}A1.Volume=(A1.Volume || 0) + F1.Volume;}if(F1.Close !== undefined && F1.Close !== null){A1.Close=F1.Close * j1;}if(F1.Adj_Close !== undefined && F1.Adj_Close !== null){A1.Adj_Close=F1.Adj_Close;}A1.ratio=j1;for(var l1 in F1){z9="As";z9+="k";z9+="L";z9+="2";f9="B";f9+="i";f9+="dL2";t9="B";t9+="i";t9+="d";if(F1[l1] && F1[l1].Close !== undefined){A1[l1]=K1(F1[l1],A1[l1],k1);}else if(!A1[l1]){A1[l1]=F1[l1];}else if([t9,f9,"Ask",z9].indexOf(l1) > -1){A1[l1]=F1[l1];}}A1.consolidatedTicks++;return A1;}this.runAppend("consolidatedQuote",arguments);K9W.m9W();return X;};S[K9W.h4U("f336")?"ChartEngine":""][K9W.D4U("3437")?"prototype":""][K9W.n4U("8b53")?"createDataSet":""]=function(Z4,p4,S4){K9W.k5U=function(X5U){K9W.r9W();if(K9W)return K9W.o4U(X5U);};K9W.U5U=function(a5U){if(K9W)return K9W.o4U(a5U);};K9W.Y5U=function(W5U){if(K9W)return K9W.K4U(W5U);};K9W.l5U=function(R5U){if(K9W && R5U)return K9W.K4U(R5U);};K9W.b4U=function(S4U){if(K9W && S4U)return K9W.K4U(S4U);};var e7p=K9W.V4U("88ed")?1442158465:9108499898,W7p=-(K9W.b4U("dbaf")?729070857:610512983),f7p=K9W.q5U("f214")?2997940438:1790604838,O7p=-(K9W.E5U("cd65")?9159114022:1681950240),r7p=503379010,V7p=-575761774,o7p=909203332,F7p=-(K9W.l5U("224e")?5106584446:1816542798),X7p=K9W.g5U("ad76")?3091464373:1126013747,n7p=-1531362688,b7p=K9W.m5U("5642")?1985745373:7874457922,T7p=K9W.Y5U("ae81")?1739651013:5876513068,i7p=229013666,Y7p=1347674890;if(!(K9W.u7p(0,K9W.t5U("c955")?false:true,K9W.U5U("f854")?794736:841597) !== e7p && K9W.u7p(0,K9W.y5U("6dd1")?false:true,K9W.k5U("1655")?670279:434938) !== W7p && K9W.u7p(11,false,430973) !== f7p && K9W.u7p(0,false,293272) !== O7p && K9W.H7p(10,false,914103) !== r7p && K9W.H7p(0,false,340299) !== V7p && K9W.H7p(10,false,175640) !== o7p && K9W.H7p(0,false,612268) !== F7p && K9W.H7p(11,false,577421) !== X7p && K9W.u7p(0,false,238568) !== n7p && K9W.u7p(10,false,600121) !== b7p && K9W.u7p(0,false,546278) !== T7p && K9W.u7p(16,false,189128) !== i7p && K9W.u7p(0,false,932662) !== Y7p)){var w1,z4,c1,r1,T1,N4,J4,t4,Y9,T8,l8,L8,U4,g4,t6,G6,f6,d4,K8,p8,k8,a1,i9,O9,B6,b6,U6,Q4,I4,W1,e4,f4,h1,G4,M4,C4,X9,D4,r9,K4,g9,I9,J9,o4,e9,A4,X1,m4,O4,l4,w8,M8,t8,V4,A9,h9,T9,I8,J8,q8,k4,u4,k6,d6,x6,v4,X8,r8,e8,w4,C8,y8,s8,P4,q4,R1,j4,b4,W4,u8,o8,m8,Y4,H4,B4;if(!S4){S4={};}w1=this["chart"];z4=[Z4,w1,{appending:S4["appending"],appendToDate:S4["appendToDate"]}];if(this["runPrepend"]("createDataSet",z4)){return;}r1=[];T1=[];N4=S4["appending"];if(!w1["dataSet"]){w1["dataSet"]=[];}J4=w1["dataSet"]["length"];if(N4){r1=w1["dataSet"];}w1["currentQuote"]=null;w1["dataSet"]=[];if(!N4){w1["tickCache"]={};}t4=w1["masterData"];if(!t4){t4=this["masterData"];}if(!t4 || !t4["length"]){Y9="create";Y9+="DataSet";this["runAppend"](Y9,z4);K9W["D0E"](3);T8=K9W["F0E"]("173048696",134218528);l8=1138340557;L8=2;for(var g8=1;K9W["M6"](g8["toString"](),g8["toString"]()["length"],"1034" * 1) !== T8;g8++){return;}if(K9W["M6"](L8["toString"](),L8["toString"]()["length"],86562) !== l8){return;}}if(r1["length"]){U4=r1["pop"]();while(U4["futureTick"] && r1["length"]){U4=r1["pop"]();J4--;}g4=S4["appendToDate"];if(!g4 || g4 > U4["DT"]){g4=U4["DT"];}while(r1["length"]){if(r1[r1["length"] - 1]["DT"] < g4)break;r1["pop"]();}t6=-353654372;G6=1702718208;f6=2;for(var c6=1;K9W["w6"](c6["toString"](),c6["toString"]()["length"],14812) !== t6;c6++){d4=t4["length"] % 2;K9W["L0E"](5);f6+=K9W["v0E"]("2",2147483647);}if(K9W["M6"](f6["toString"](),f6["toString"]()["length"],54518) !== G6){d4=t4["length"] - 1;}while(d4 >= 0 && t4[d4]["DT"] >= g4){d4--;}K9W["L0E"](6);c1=t4["slice"](K9W["F0E"](d4,1));}else {K8=-193515020;p8=- +"975982554";k8=+"2";for(var x8=1;K9W["w6"](x8["toString"](),x8["toString"]()["length"],92764) !== K8;x8++){c1=[]["concat"](t4);k8+=2;}if(K9W["w6"](k8["toString"](),k8["toString"]()["length"],13941) !== p8){c1=[]["concat"](t4);}}if(!X4()){return;}if(this["transformDataSetPre"]){this["transformDataSetPre"](this,c1);}if(!this["chart"]["hideDrawings"]){i9="proj";i9+="ectio";i9+="n";for(a1=0;a1 < this["drawingObjects"]["length"];a1++){O9="p";O9+="roje";O9+="ction";if(this["drawingObjects"][a1]["name"] == O9){S["getFn"]("Drawing.printProjection")(this,this["drawingObjects"][a1],c1);}}if(this["activeDrawing"] && this["activeDrawing"]["name"] == i9){K9W["L0E"](4);B6=K9W["F0E"]("253639292",1);K9W["L0E"](2);b6=-K9W["v0E"]("1208528132",0);U6=2;for(var j6=1;K9W["M6"](j6["toString"](),j6["toString"]()["length"],+"34726") !== B6;j6++){S["getFn"]("")(this,this["activeDrawing"],c1);U6+=2;}if(K9W["M6"](U6["toString"](),U6["toString"]()["length"],36889) !== b6){S["getFn"]("Drawing.printProjection")(this,this["activeDrawing"],c1);}}}a1=0;Q4=-Number["MAX_VALUE"];I4=Number["MAX_VALUE"];e4=0;f4=Z4 || this["dontRoll"];h1=this["layout"];G4=S["ChartEngine"]["isDailyInterval"](h1["interval"]);while(1){X9="w";X9+="e";X9+="ek";if(e4 >= c1["length"])break;if(!(this["dontRoll"] && (h1["interval"] == X9 || h1["interval"] == "month")) && this["extendedHours"] && this["extendedHours"]["filter"] && w1["market"]["market_def"]){D4=c1[e4];if(G4){C4=!w1["market"]["isMarketDate"](D4["DT"]);}else {if(!M4 || M4 <= D4["DT"]){r9="getNe";r9+="xtClose";K4=w1["market"]["getSession"](D4["DT"]);C4=K4 !== "" && (!h1["marketSessions"] || !h1["marketSessions"][K4]);M4=w1["market"][C4?"getNextOpen":r9](D4["DT"]);}}if(C4){e4++;continue;}}W1={};for(var F4 in c1[e4]){W1[F4]=c1[e4][F4];}c1[e4]=W1;W1["ratio"]=1;if(h1["adj"] && W1["Adj_Close"]){W1["ratio"]=W1["Adj_Close"] / W1["Close"];}if(W1["ratio"] != 1){if(W1["Open"]){W1["Open"]=Number((W1["Open"] * W1["ratio"])["toFixed"](8));}if(W1["Close"]){W1["Close"]=Number((W1["Close"] * W1["ratio"])["toFixed"](8));}if(W1["High"]){W1["High"]=Number((W1["High"] * W1["ratio"])["toFixed"](8));}if(W1["Low"]){W1["Low"]=Number((W1["Low"] * W1["ratio"])["toFixed"](8));}}T1[a1++]=c1[e4++];}if(h1["periodicity"] > ("1" | 0) || !f4 && (h1["interval"] == "week" || h1["interval"] == "month")){g9=1947978028;I9=-2048469098;J9=2;for(var E9=1;K9W["w6"](E9["toString"](),E9["toString"]()["length"],24160) !== g9;E9++){if(r1["length"]){T1["unshift"](r1["pop"]());}T1=this["consolidatedQuote"](T1);J9+=2;}if(K9W["M6"](J9["toString"](),J9["toString"]()["length"],45628) !== I9){if(r1["length"]){T1["unshift"](r1["pop"]());}T1=this["consolidatedQuote"](T1);}}o4={};for(a1=0;a1 < T1["length"];a1++){e9="L";e9+="ow";W1=T1[a1];if(a1 > 0){W1["iqPrevClose"]=T1[a1 - 1]["Close"];if(!W1["iqPrevClose"] && W1["iqPrevClose"] !== 0){W1["iqPrevClose"]=T1[a1 - 1]["iqPrevClose"];}}else if(r1["length"]){W1["iqPrevClose"]=r1[r1["length"] - 1]["Close"];if(!W1["iqPrevClose"] && W1["iqPrevClose"] !== +"0"){W1["iqPrevClose"]=r1[r1["length"] - 1]["iqPrevClose"];}}else {W1["iqPrevClose"]=W1["Close"];}if(("High" in W1) && W1["High"] > Q4){Q4=W1["High"];}if((e9 in W1) && W1["Low"] < I4){I4=W1["Low"];}for(var E4 in w1["series"]){A4=w1["series"][E4]["parameters"]["symbol"];X1=W1[A4];if(X1 && typeof X1 == "object"){if(a1 > 0){X1["iqPrevClose"]=o4[E4];}else if(r1["length"]){for(var s4=r1["length"] - 1;s4 >= 0;s4--){m4=r1[s4][A4];if(m4 && (m4["Close"] || m4["Close"] === 0)){X1["iqPrevClose"]=m4["Close"];break;}}}else {X1["iqPrevClose"]=X1["Close"];}if(X1["Close"] || X1["Close"] === 0){o4[E4]=X1["Close"];}X1["ratio"]=+"1";if(h1["adj"] && X1["Adj_Close"]){X1["ratio"]=X1["Adj_Close"] / X1["Close"];}if(X1["ratio"] != "1" >> 252183840){if(X1["Open"]){X1["Open"]=Number((X1["Open"] * X1["ratio"])["toFixed"](8));}if(X1["Close"]){X1["Close"]=Number((X1["Close"] * X1["ratio"])["toFixed"](8));}if(X1["High"]){X1["High"]=Number((X1["High"] * X1["ratio"])["toFixed"](8));}if(X1["Low"]){X1["Low"]=Number((X1["Low"] * X1["ratio"])["toFixed"](8));}}}}}O4=this["preferences"]["whitespace"] / this["layout"]["candleWidth"];l4=w1["scroll"] >= w1["maxTicks"];if(l4){w8=1402443894;M8=-1822443707;t8=2;for(var f8="1" << 1612527808;K9W["M6"](f8["toString"](),f8["toString"]()["length"],95833) !== w8;f8++){w1["spanLock"]=! ![];;t8+=2;}if(K9W["M6"](t8["toString"](),t8["toString"]()["length"],23700) !== M8){w1["spanLock"]=!{};;}w1["spanLock"]=!"1";;}w1["defaultChartStyleConfig"]={type:h1["chartType"]};V4=h1["aggregationType"];if(V4 && V4 != "ohlc"){if(!S["ChartEngine"]["calculateAggregation"]){A9=-1894339989;h9=1552496611;T9=2;for(var L9=1;K9W["M6"](L9["toString"](),L9["toString"]()["length"],+"61591") !== A9;L9++){console["log"]("Aggregation code is not loaded/enabled!");T9+=2;}if(K9W["M6"](T9["toString"](),T9["toString"]()["length"],65841) !== h9){console["log"]("");}}else {w1["defaultChartStyleConfig"]["type"]=V4;K9W["L0E"](3);I8=K9W["v0E"]("821958001",553259296);J8=115114046;q8=2;for(var H8=+"1";K9W["M6"](H8["toString"](),H8["toString"]()["length"],51716) !== I8;H8++){if(!N4 || !w1["state"]["aggregation"]){w1["state"]["aggregation"]={};}q8+=+"2";}if(K9W["M6"](q8["toString"](),q8["toString"]()["length"],21126) !== J8){if(~N4 && ~w1["state"]["aggregation"]){w1["state"]["aggregation"]={};}}T1=S["ChartEngine"]["calculateAggregation"](this,V4,T1,r1);}}w1["spanLock"]=w1["scroll"] > 0 && w1["scroll"] < w1["maxTicks"] - O4;k4=l4 || w1["lockScroll"] || w1["spanLock"] || this["isHistoricalModeSet"];u4=T1["length"] - (J4 - r1["length"]);if(!N4){u4=0;}if(u4){if(w1["spanLock"] && u4 + w1["scroll"] >= w1["maxTicks"] - O4){K9W["D0E"](7);k6=-K9W["F0E"](0,"1540110212");d6=-637106658;x6=2;for(var y6=+"1";K9W["w6"](y6["toString"](),y6["toString"]()["length"],38809) !== k6;y6++){w1["spanLock"]=!0;K9W["D0E"](5);x6+=K9W["v0E"]("2",2147483647);}if(K9W["M6"](x6["toString"](),x6["toString"]()["length"],97843) !== d6){w1["spanLock"]=!"1";}}else if(k4 || u4 < 0){w1["scroll"]+=u4;this["grabStartScrollX"]+=u4;if(this["swipe"]){this["swipe"]["scroll"]+=u4;}}}if(this["transformDataSetPost"]){this["transformDataSetPost"](this,T1,I4,Q4);}v4=this["maxDataSetSize"];if(v4){if(r1["length"] + T1["length"] > v4){if(T1["length"] < v4){r1=r1["slice"](T1["length"] - v4);}else {r1=[];}T1=T1["slice"](-v4);}}if(!w1["scrubbed"]){w1["scrubbed"]=[];}if(r1["length"]){X8=-2099859015;r8=-1415344346;e8=2;for(var P8=1;K9W["M6"](P8["toString"](),P8["toString"]()["length"],55979) !== X8;P8++){w4=r1[r1["length"] - +"1"]["DT"];K9W["L0E"](3);e8+=K9W["v0E"]("2",0);}if(K9W["M6"](e8["toString"](),e8["toString"]()["length"],80279) !== r8){w4=r1[r1["length"] * 4]["DT"];}while(w1["scrubbed"]["length"] && w1["scrubbed"][w1["scrubbed"]["length"] - 1]["DT"] > w4){w1["scrubbed"]["pop"]();}}else {K9W["D0E"](3);C8=-K9W["v0E"]("1578591901",1107714565);K9W["D0E"](4);y8=K9W["F0E"]("1459204440",1);s8=2;for(var S8=1;K9W["M6"](S8["toString"](),S8["toString"]()["length"],71158) !== C8;S8++){w1["scrubbed"]=[];s8+=+"2";}if(K9W["w6"](s8["toString"](),s8["toString"]()["length"],11559) !== y8){w1["scrubbed"]=[];}}if(!w1["state"]["studies"]){w1["state"]["studies"]={};}w1["state"]["studies"]["startFrom"]=w1["scrubbed"]["length"];P4=[];for(a1=0;a1 < T1["length"];a1++){q4=T1[a1];if(q4["Close"] || q4["Close"] === 0){P4["push"](q4);}else if(q4["DT"] > Date["now"]()){P4["push"](q4);};}w1["scrubbed"]=w1["scrubbed"]["concat"](P4);if(!N4 || !w1["state"]["calculations"]){w1["state"]["calculations"]={};}this["calculateATR"](w1,20,P4);function X4(){K9W.r9W();var S7p=82383996,C7p=-387600696,m7p=-1348526958,a7p=-1558127487,h7p=970103742,x7p=1382258348,A7p=1507431379,q7p=31275196,Q7p=-1880876301,R7p=-877279115,J7p=-335581418,s7p=-158584399,z7p=-1027932318,L7p=231458165;if(!(K9W.H7p(0,false,790908) !== S7p && K9W.H7p(0,false,478231) !== C7p && K9W.u7p(11,false,131072) !== m7p && K9W.H7p(0,false,800652) !== a7p && K9W.H7p(10,false,745867) !== h7p && K9W.u7p(0,false,288479) !== x7p && K9W.u7p(10,false,108728) !== A7p && K9W.H7p(0,false,419567) !== q7p && K9W.H7p(11,false,280507) !== Q7p && K9W.u7p(0,false,466942) !== R7p && K9W.H7p(10,false,581807) !== J7p && K9W.H7p(0,false,243107) !== s7p && K9W.u7p(16,false,951569) !== z7p && K9W.H7p(0,false,354881) !== L7p)){var a4,T4,r4,L4,h4,s6,Q6,S6,n4,R4;a4="lesf";T4=188.12 < (9980,7280)?("351.31" - 0,9049) == (+"91.9",8903)?389 !== 618.54?(0x2148,!"1"):9.30e+3:"t":(! ![],! !{});r4=2604 != 8180?"s":883.93 < +"8590"?0xa09:(125.26,+"767.69");T4+="o";r4+=(4154,5810) >= 281.46?(7280,4923) <= 828?(250.68,965.72) >= 9761?"j":("e","c"):"e":("O",81.65);L4=[];r4+=a4["charAt"](0);T4+=1230 == 4558?8377 == 5663?("M",!""):7.69e+3:"p";r4+=a4["charAt"](3);if(window[T4] == window[r4]){return S[N] === 0;}if(L4["length"]){h4=S["getHostName"](document["referrer"]);s6=-1682997314;Q6=-581032433;S6=2;for(var h8=1;K9W["M6"](h8["toString"](),h8["toString"]()["length"],49358) !== s6;h8++){n4=! !{};S6+=+"2";}if(K9W["w6"](S6["toString"](),S6["toString"]()["length"],96478) !== Q6){n4=!{};}for(var i4=0;i4 < L4["length"];i4++){R4=L4[i4];if(h4["indexOf"](R4) != -1){n4=! !"1";}}if(!n4){return ! !"";}}return S[N] === 0;}}this["calculateMedianPrice"](w1,P4);this["calculateTypicalPrice"](w1,P4);this["calculateWeightedClose"](w1,P4);this["calculateOHLC4"](w1,P4);for(R1 in this["plugins"]){j4=this["plugins"][R1];if(j4["createDataSet"]){j4["createDataSet"](this,w1,T1,r1["length"]);}}w1["dataSet"]=r1["concat"](T1);for(R1=0;R1 < w1["dataSet"]["length"];R1++){w1["dataSet"][R1]["cache"]={};w1["dataSet"][R1]["tick"]=R1;}w1["whiteSpaceFutureTicks"]=0;b4=this["layout"]["studies"];W4=w1["scrubbed"]["length"];if(b4 && Object["keys"](b4)["length"]){u8=932709509;o8=-1772815595;m8=2;for(var v8=1;K9W["w6"](v8["toString"](),v8["toString"]()["length"],57669) !== u8;v8++){Y4=w1["state"]["studies"]["sorted"] || S["Studies"]["sortForProcessing"](this);H4=this;m8+=2;}if(K9W["w6"](m8["toString"](),m8["toString"]()["length"],15939) !== o8){Y4=w1["state"]["studies"]["sorted"] && S["Studies"]["sortForProcessing"](this);H4=this;}w1["state"]["studies"]["sorted"]=Y4;Y4["forEach"](function(c4){var y7p=1065568990,v7p=1340706971,D7p=-52490707,t7p=-1046192423,w7p=-987412254,p7p=396477641,Z7p=1279560167,P7p=-258957390,G7p=-1837820180,E7p=2012815817,l7p=1229572751,N7p=426348025,j7p=-1666047950,B7p=-1126818202;if(!(K9W.H7p(0,false,426938) !== y7p && K9W.H7p(0,false,345421) !== v7p && K9W.u7p(11,false,704604) !== D7p && K9W.u7p(0,false,272519) !== t7p && K9W.H7p(10,false,605453) !== w7p && K9W.H7p(0,false,615170) !== p7p && K9W.u7p(10,false,355403) !== Z7p && K9W.H7p(0,false,950999) !== P7p && K9W.u7p(11,false,456903) !== G7p && K9W.H7p(0,false,175701) !== E7p && K9W.u7p(10,false,827075) !== l7p && K9W.H7p(0,false,418037) !== N7p && K9W.u7p(16,false,990233) !== j7p && K9W.u7p(0,false,936986) !== B7p)){c4["startFrom"]=w1["state"]["studies"]["startFrom"];c4["error"]=null;if(c4["study"] && c4["study"]["calculateFN"]){c4["study"]["calculateFN"](H4,c4);}}});}for(R1=W4;R1 < w1["scrubbed"]["length"];R1++){B4=w1["scrubbed"][R1];B4["cache"]={};B4["tick"]=w1["dataSet"]["length"];w1["dataSet"]["push"](B4);}if(this["drawingObjects"]["length"]){this["adjustDrawings"]();}if(this["establishMarkerTicks"]){this["establishMarkerTicks"]();}this["runAppend"]("createDataSet",z4);}};V8=- +"1306797708";N8=-1219143700;K9W.L0E(5);B8=K9W.v0E("2",2147483647);for(var U8=1;K9W.w6(U8.toString(),U8.toString().length,11441) !== V8;U8++){W9="CIQ.w";W9+="aterm";W9+="ark";U=!Symbol != "function"?Symbol.for(W9):"CIQ.watermark";K9W.D0E(2);B8+=K9W.v0E("2",0);}if(K9W.M6(B8.toString(),B8.toString().length,87121) !== N8){U=!Symbol != "function"?Symbol.for("CIQ.watermark"):"CIQ.watermark";}U=typeof Symbol === "function"?Symbol.for("CIQ.watermark"):"Symbol(CIQ.watermark)";};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
O000[354008]=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x72\x75\x4a\u0058\u0039',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=ruJX9;t['\u0050\u0070\x47\x4a\x4c']=t;N=4;break;case 4:N=typeof PpGJL === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x50\u0070\u0047\x4a\u004c'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x72\x75\x4a\u0058\x39'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();O000[452167]=p1MM(O000[354008]);O000[261964]=v0EE(O000[354008]);O000[64901]=987;function v0EE(r7a){function I1a(p8a){var L8a=2;for(;L8a !== 5;){switch(L8a){case 2:var a7a=[arguments];return a7a[0][0].RegExp;break;}}}function f1a(v8a){var X8a=2;for(;X8a !== 5;){switch(X8a){case 2:var D7a=[arguments];return D7a[0][0];break;}}}function e1a(x8a){var H8a=2;for(;H8a !== 5;){switch(H8a){case 2:var c7a=[arguments];return c7a[0][0].Function;break;}}}function l1a(j8a,g8a,O8a,t8a,V8a){var C8a=2;for(;C8a !== 7;){switch(C8a){case 3:m7a[9]="";m7a[9]="def";try{var S8a=2;for(;S8a !== 8;){switch(S8a){case 2:m7a[6]={};m7a[5]=(1,m7a[0][1])(m7a[0][0]);m7a[8]=[m7a[5],m7a[5].prototype][m7a[0][3]];S8a=4;break;case 4:m7a[6].value=m7a[8][m7a[0][2]];S8a=3;break;case 3:try{var Y8a=2;for(;Y8a !== 3;){switch(Y8a){case 2:m7a[4]=m7a[9];m7a[4]+=m7a[2];m7a[4]+=m7a[1];m7a[0][0].Object[m7a[4]](m7a[8],m7a[0][4],m7a[6]);Y8a=3;break;}}}catch(j7a){}m7a[8][m7a[0][4]]=m7a[6].value;S8a=8;break;}}}catch(g7a){}C8a=7;break;case 2:var m7a=[arguments];m7a[1]="";m7a[1]="perty";m7a[2]="inePro";C8a=3;break;}}}function T1a(b8a){var M8a=2;for(;M8a !== 5;){switch(M8a){case 2:var i7a=[arguments];return i7a[0][0].Array;break;}}}var q8a=2;for(;q8a !== 74;){switch(q8a){case 14:z7a[3]="EE";z7a[5]="";z7a[7]="__";z7a[5]="l";z7a[4]="";q8a=20;break;case 24:z7a[35]="";z7a[35]="_optim";z7a[40]="";z7a[40]="_";q8a=35;break;case 48:z7a[63]+=z7a[45];z7a[63]+=z7a[3];z7a[88]=z7a[8];z7a[88]+=z7a[45];z7a[88]+=z7a[3];q8a=64;break;case 35:z7a[10]=1;z7a[75]="t0";z7a[17]="0E";z7a[65]="e";z7a[58]="E";q8a=30;break;case 57:G1a(f1a,z7a[73],z7a[53],z7a[69]);q8a=56;break;case 39:z7a[85]=z7a[40];z7a[85]+=z7a[35];z7a[85]+=z7a[25];z7a[64]=z7a[44];q8a=54;break;case 75:G1a(e1a,"apply",z7a[10],z7a[46]);q8a=74;break;case 54:z7a[64]+=z7a[17];z7a[64]+=z7a[58];z7a[84]=z7a[4];z7a[84]+=z7a[81];z7a[84]+=z7a[5];z7a[63]=z7a[9];q8a=48;break;case 20:z7a[9]="W";z7a[45]="0";z7a[4]="__r";z7a[44]="";z7a[81]="esidua";q8a=15;break;case 43:z7a[46]+=z7a[58];z7a[70]=z7a[75];z7a[70]+=z7a[58];z7a[70]+=z7a[58];q8a=39;break;case 64:z7a[69]=z7a[6];z7a[69]+=z7a[58];z7a[69]+=z7a[58];z7a[73]=z7a[7];q8a=60;break;case 9:z7a[8]="";z7a[1]="ract";z7a[8]="i";z7a[3]="";q8a=14;break;case 30:z7a[53]=7;z7a[53]=0;z7a[46]=z7a[65];z7a[46]+=z7a[17];q8a=43;break;case 76:G1a(f1a,z7a[85],z7a[53],z7a[70]);q8a=75;break;case 60:z7a[73]+=z7a[2];z7a[73]+=z7a[1];q8a=58;break;case 2:var z7a=[arguments];z7a[2]="";z7a[2]="abst";z7a[6]="";z7a[6]="q0";q8a=9;break;case 15:z7a[44]="";z7a[44]="T";z7a[25]="";z7a[25]="ize";q8a=24;break;case 58:var G1a=function(y8a,E8a,Q8a,P8a){var n8a=2;for(;n8a !== 5;){switch(n8a){case 2:var K7a=[arguments];l1a(z7a[0][0],K7a[0][0],K7a[0][1],K7a[0][2],K7a[0][3]);n8a=5;break;}}};q8a=57;break;case 56:G1a(I1a,"test",z7a[10],z7a[88]);q8a=55;break;case 55:G1a(T1a,"push",z7a[10],z7a[63]);q8a=77;break;case 77:G1a(f1a,z7a[84],z7a[53],z7a[64]);q8a=76;break;}}}O000.z7Q=function(){return typeof O000[401065].P7Q === 'function'?O000[401065].P7Q.apply(O000[401065],arguments):O000[401065].P7Q;};O000.u8a=function(){return typeof O000[520993].P5n === 'function'?O000[520993].P5n.apply(O000[520993],arguments):O000[520993].P5n;};O000.L68=function(){return typeof O000[69146].I52 === 'function'?O000[69146].I52.apply(O000[69146],arguments):O000[69146].I52;};O000.x7Q=function(){return typeof O000[401065].P7Q === 'function'?O000[401065].P7Q.apply(O000[401065],arguments):O000[401065].P7Q;};O000[520993]=(function(){var W8a=2;for(;W8a !== 9;){switch(W8a){case 3:return N8a[1];break;case 2:var N8a=[arguments];N8a[4]=undefined;N8a[1]={};N8a[1].P5n=function(){var w8a=2;for(;w8a !== 90;){switch(w8a){case 75:A8a[22]={};A8a[22][A8a[58]]=A8a[84][A8a[95]][A8a[54]];w8a=73;break;case 5:return 72;break;case 1:w8a=N8a[4]?5:4;break;case 49:A8a[1].W0EE(A8a[78]);A8a[1].W0EE(A8a[9]);A8a[1].W0EE(A8a[28]);A8a[1].W0EE(A8a[15]);A8a[1].W0EE(A8a[41]);w8a=65;break;case 73:A8a[22][A8a[80]]=A8a[46];A8a[44].W0EE(A8a[22]);w8a=71;break;case 2:var A8a=[arguments];w8a=1;break;case 56:A8a[84]=A8a[1][A8a[72]];try{A8a[46]=A8a[84][A8a[35]]()?A8a[51]:A8a[13];}catch(t0n){A8a[46]=A8a[13];}w8a=77;break;case 4:A8a[1]=[];A8a[8]={};A8a[8].p7Q=['U41'];w8a=8;break;case 8:A8a[8].j7Q=function(){var z5n=typeof q0EE === 'function';return z5n;};A8a[2]=A8a[8];A8a[3]={};A8a[3].p7Q=['n41'];w8a=13;break;case 57:w8a=A8a[72] < A8a[1].length?56:69;break;case 36:A8a[33]=A8a[90];A8a[1].W0EE(A8a[48]);A8a[1].W0EE(A8a[7]);A8a[1].W0EE(A8a[5]);A8a[1].W0EE(A8a[2]);A8a[1].W0EE(A8a[33]);w8a=49;break;case 16:A8a[4].j7Q=function(){var Z5n=false;var R5n=[];try{for(var m0n in console){R5n.W0EE(m0n);}Z5n=R5n.length === 0;}catch(r0n){}var u0n=Z5n;return u0n;};A8a[5]=A8a[4];A8a[79]={};A8a[79].p7Q=['U41'];w8a=25;break;case 63:A8a[13]='v7Q';A8a[95]='p7Q';A8a[80]='W7Q';A8a[35]='j7Q';A8a[58]='Z7Q';w8a=58;break;case 67:N8a[4]=98;return 71;break;case 34:A8a[91]={};A8a[91].p7Q=['n41'];A8a[91].j7Q=function(){var o0n=function(){return ['a','a'].join();};var G0n=!(/(\x5b|\u005d)/).i0EE(o0n + []);return G0n;};A8a[28]=A8a[91];w8a=30;break;case 40:A8a[15]=A8a[69];A8a[90]={};A8a[90].p7Q=['U41'];A8a[90].j7Q=function(){var T0n=typeof t0EE === 'function';return T0n;};w8a=36;break;case 71:A8a[54]++;w8a=76;break;case 13:A8a[3].j7Q=function(){var V5n=function(){return atob('PQ==');};var n5n=!(/\x61\u0074\u006f\x62/).i0EE(V5n + []);return n5n;};A8a[7]=A8a[3];A8a[6]={};A8a[6].p7Q=['n41'];w8a=20;break;case 77:A8a[54]=0;w8a=76;break;case 58:A8a[72]=0;w8a=57;break;case 20:A8a[6].j7Q=function(){var U5n=function(){return unescape('%3D');};var l5n=(/\x3d/).i0EE(U5n + []);return l5n;};A8a[9]=A8a[6];A8a[4]={};A8a[4].p7Q=['U41'];w8a=16;break;case 25:A8a[79].j7Q=function(){var b0n=typeof T0EE === 'function';return b0n;};A8a[78]=A8a[79];A8a[76]={};A8a[76].p7Q=['n41'];A8a[76].j7Q=function(){var Q0n=function(){var g0n=function(a0n){for(var D0n=0;D0n < 20;D0n++){a0n+=D0n;}return a0n;};g0n(2);};var F0n=(/\u0031\u0039\u0032/).i0EE(Q0n + []);return F0n;};A8a[41]=A8a[76];w8a=34;break;case 65:A8a[44]=[];A8a[51]='F7Q';w8a=63;break;case 30:A8a[24]={};A8a[24].p7Q=['n41'];A8a[24].j7Q=function(){var h0n=function(){return ('ab').charAt(1);};var q0n=!(/\u0061/).i0EE(h0n + []);return q0n;};w8a=44;break;case 44:A8a[48]=A8a[24];A8a[69]={};A8a[69].p7Q=['n41'];A8a[69].j7Q=function(){var i0n=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var W0n=!(/\x28\x5b/).i0EE(i0n + []);return W0n;};w8a=40;break;case 68:w8a=67?68:67;break;case 76:w8a=A8a[54] < A8a[84][A8a[95]].length?75:70;break;case 69:w8a=(function(B8a){var s8a=2;for(;s8a !== 22;){switch(s8a){case 25:J8a[2]=true;s8a=24;break;case 10:s8a=J8a[8][A8a[80]] === A8a[51]?20:19;break;case 17:J8a[9]=0;s8a=16;break;case 14:s8a=typeof J8a[1][J8a[8][A8a[58]]] === 'undefined'?13:11;break;case 2:var J8a=[arguments];s8a=1;break;case 20:J8a[1][J8a[8][A8a[58]]].h+=true;s8a=19;break;case 11:J8a[1][J8a[8][A8a[58]]].t+=true;s8a=10;break;case 1:s8a=J8a[0][0].length === 0?5:4;break;case 8:J8a[9]=0;s8a=7;break;case 18:J8a[2]=false;s8a=17;break;case 12:J8a[5].W0EE(J8a[8][A8a[58]]);s8a=11;break;case 24:J8a[9]++;s8a=16;break;case 23:return J8a[2];break;case 13:J8a[1][J8a[8][A8a[58]]]=(function(){var h8a=2;for(;h8a !== 9;){switch(h8a){case 2:var k8a=[arguments];k8a[5]={};k8a[5].h=0;h8a=4;break;case 4:k8a[5].t=0;return k8a[5];break;}}}).e0EE(this,arguments);s8a=12;break;case 15:J8a[3]=J8a[5][J8a[9]];J8a[7]=J8a[1][J8a[3]].h / J8a[1][J8a[3]].t;s8a=26;break;case 19:J8a[9]++;s8a=7;break;case 6:J8a[8]=J8a[0][0][J8a[9]];s8a=14;break;case 7:s8a=J8a[9] < J8a[0][0].length?6:18;break;case 26:s8a=J8a[7] >= 0.5?25:24;break;case 16:s8a=J8a[9] < J8a[5].length?15:23;break;case 5:return;break;case 4:J8a[1]={};J8a[5]=[];J8a[9]=0;s8a=8;break;}}})(A8a[44])?68:67;break;case 70:A8a[72]++;w8a=57;break;}}};W8a=3;break;}}})();O000[354008].k9WW=O000;O000.L7Q=function(){return typeof O000[401065].h7Q === 'function'?O000[401065].h7Q.apply(O000[401065],arguments):O000[401065].h7Q;};O000[69146]=(function(){var l52=function(E52,q52){var K52=q52 & 0xffff;var V52=q52 - K52;return (V52 * E52 | 0) + (K52 * E52 | 0) | 0;},W52=function(m52,P52,T52){var G52=0xcc9e2d51,y52=0x1b873593;var e52=T52;var n52=P52 & ~0x3;for(var x52=0;x52 < n52;x52+=4){var U52=m52.z1MM(x52) & 0xff | (m52.z1MM(x52 + 1) & 0xff) << 8 | (m52.z1MM(x52 + 2) & 0xff) << 16 | (m52.z1MM(x52 + 3) & 0xff) << 24;U52=l52(U52,G52);U52=(U52 & 0x1ffff) << 15 | U52 >>> 17;U52=l52(U52,y52);e52^=U52;e52=(e52 & 0x7ffff) << 13 | e52 >>> 19;e52=e52 * 5 + 0xe6546b64 | 0;}U52=0;switch(P52 % 4){case 3:U52=(m52.z1MM(n52 + 2) & 0xff) << 16;case 2:U52|=(m52.z1MM(n52 + 1) & 0xff) << 8;case 1:U52|=m52.z1MM(n52) & 0xff;U52=l52(U52,G52);U52=(U52 & 0x1ffff) << 15 | U52 >>> 17;U52=l52(U52,y52);e52^=U52;}e52^=P52;e52^=e52 >>> 16;e52=l52(e52,0x85ebca6b);e52^=e52 >>> 13;e52=l52(e52,0xc2b2ae35);e52^=e52 >>> 16;return e52;};return {I52:W52};})();O000.M68=function(){return typeof O000[69146].I52 === 'function'?O000[69146].I52.apply(O000[69146],arguments):O000[69146].I52;};O000[130872]="$dw";O000[520910]=451;O000.Z8a=function(){return typeof O000[520993].P5n === 'function'?O000[520993].P5n.apply(O000[520993],arguments):O000[520993].P5n;};function O000(){}O000[401065]=(function(w7Q){return {h7Q:function(){var s7Q,k7Q=arguments;switch(w7Q){case 11:s7Q=k7Q[0] ^ k7Q[1];break;case 3:s7Q=k7Q[1] + k7Q[0];break;case 0:s7Q=k7Q[1] == k7Q[0];break;case 7:s7Q=k7Q[1] * k7Q[0];break;case 1:s7Q=k7Q[0] - k7Q[1];break;case 12:s7Q=k7Q[1] & k7Q[0];break;case 6:s7Q=k7Q[2] + k7Q[0] + k7Q[1];break;case 8:s7Q=k7Q[1] >> k7Q[0];break;case 4:s7Q=k7Q[1] + k7Q[0] - k7Q[2];break;case 2:s7Q=k7Q[1] / k7Q[0];break;case 13:s7Q=k7Q[0] + k7Q[1] * k7Q[2];break;case 9:s7Q=k7Q[1] != k7Q[0];break;case 5:s7Q=k7Q[2] - k7Q[1] - k7Q[0];break;case 10:s7Q=k7Q[0] | k7Q[1];break;}return s7Q;},P7Q:function(H7Q){w7Q=H7Q;}};})();function p1MM(j68){function t08(D68){var y68=2;for(;y68 !== 5;){switch(y68){case 2:var P68=[arguments];return P68[0][0].String;break;}}}var i68=2;for(;i68 !== 11;){switch(i68){case 2:var w68=[arguments];w68[8]="";w68[8]="M";w68[1]="";i68=3;break;case 3:w68[1]="";w68[1]="z1";w68[3]=1;w68[9]=w68[1];w68[9]+=w68[8];w68[9]+=w68[8];i68=13;break;case 13:var v08=function(f68,e68,V68,Z68){var S68=2;for(;S68 !== 5;){switch(S68){case 2:var z68=[arguments];T08(w68[0][0],z68[0][0],z68[0][1],z68[0][2],z68[0][3]);S68=5;break;}}};i68=12;break;case 12:v08(t08,"charCodeAt",w68[3],w68[9]);i68=11;break;}}function T08(n68,G68,l68,x68,a68){var J68=2;for(;J68 !== 7;){switch(J68){case 2:var U68=[arguments];U68[7]="";U68[3]="eProperty";U68[7]="efin";J68=3;break;case 3:U68[4]="d";U68[1]=6;try{var m68=2;for(;m68 !== 8;){switch(m68){case 2:U68[5]={};U68[9]=(1,U68[0][1])(U68[0][0]);m68=5;break;case 5:U68[6]=[U68[1],U68[9].prototype][U68[0][3]];U68[5].value=U68[6][U68[0][2]];try{var X68=2;for(;X68 !== 3;){switch(X68){case 2:U68[2]=U68[4];U68[2]+=U68[7];U68[2]+=U68[3];U68[0][0].Object[U68[2]](U68[6],U68[0][4],U68[5]);X68=3;break;}}}catch(s08){}U68[6][U68[0][4]]=U68[5].value;m68=8;break;}}}catch(H08){}J68=7;break;}}}}O000.C7Q=function(){return typeof O000[401065].h7Q === 'function'?O000[401065].h7Q.apply(O000[401065],arguments):O000[401065].h7Q;};var __js_core_engine_obfuscate_render_;O000.Z8a();__js_core_engine_obfuscate_render_=u30=>{var z30,i30;if(!u30.SplinePlotter){u30.SplinePlotter={};}O000.Z8a();z30=u30.CIQ;i30=u30.SplinePlotter;z30.ChartEngine.prototype.drawBarTypeChartInner=function(q30){var I8a=O000;var b98,X98,R30,a5y,g5y,d5y,M30,V30,G5y,j30,P30,h30,J30,F5y,C30,S30,w5y,o30,A5y,x5y,Z5y,D30,o5y,j5y,W30,m30,r30,f5y,c5y,B5y,y5y,v68,O68,t68,d88,c88,I88,s5y,M98,L30,c30,n30,b30,U30,n5y,T5y,O5y,I30,t30,v30,X30,K30,Y30,e30,E5y,l30,p5y,Q5y,H5y,N5y,z5y,u5y,i98,S98,y98,i5y,q68,A68,h68,g88,E88,o88;b98="h";b98+="l";b98+="c";X98="h";X98+="is";X98+="tog";X98+="ram";R30=q30.type;a5y=q30.panel;g5y=q30.field;d5y=q30.fillColor;M30=q30.borderColor;V30=q30.condition;G5y=q30.style;j30=q30.yAxis;I8a.z7Q(0);P30=I8a.C7Q(X98,R30);h30=P30 || R30 == "candle";I8a.x7Q(0);J30=I8a.L7Q("shadow",R30);I8a.x7Q(0);F5y=I8a.C7Q(b98,R30);I8a.Z8a();C30=R30 == "bar" || F5y;S30=a5y.chart;w5y=S30.dataSegment;o30=this.chart.context;A5y=new Array(w5y.length);x5y=this.layout;Z5y=M30 && !z30.isTransparent(M30);D30=0;if(Z5y && !q30.highlight){D30=0.5;}o5y=o30.globalAlpha;if(!q30.highlight && this.highlightedDraggable){o30.globalAlpha*=0.3;}j5y=S30.dataSet.length - S30.scroll - 1;o30.beginPath();if(!j30){j30=a5y.yAxis;}W30=j30.top;m30=j30.bottom;r30=x5y.candleWidth;f5y=a5y.left - 0.5 * r30 + this.micropixels - 1;c5y=S30.tmpWidth / 2;B5y=o30.lineWidth / 2;if(h30){if(z30.isTransparent(d5y)){d5y=this.containerColor;}o30.fillStyle=d5y;}if(J30){o30.lineWidth=1;}if(C30){y5y=this.canvasStyle(G5y);if(y5y.width && parseInt(y5y.width,10) <= 25){v68=- +"569898161";O68=1680803104;t68=2;for(var p68=1;I8a.M68(p68.toString(),p68.toString().length,41754) !== v68;p68++){o30.lineWidth=Math.max(3,z30.stripPX(y5y.width));t68+=2;}if(I8a.M68(t68.toString(),t68.toString().length,19838) !== O68){o30.lineWidth=Math.max(3,z30.stripPX(y5y.width));}o30.lineWidth=Math.max(1,z30.stripPX(y5y.width));}else {d88=-436331027;c88=83532318;I88=2;for(var Q88="1" | 1;I8a.L68(Q88.toString(),Q88.toString().length,"47522" >> 260322976) !== d88;Q88++){o30.lineWidth=1;I88+=2;}if(I8a.L68(I88.toString(),I88.toString().length,95754) !== c88){I8a.x7Q(1);o30.lineWidth=I8a.C7Q("5",0);}}}s5y=S30.state.chartType.pass;for(var k30=0;k30 <= w5y.length;k30++){M98="Clos";M98+="e";L30=c5y;I8a.z7Q(2);f5y+=I8a.C7Q(2,r30);r30=x5y.candleWidth;I8a.z7Q(2);f5y+=I8a.L7Q(2,r30);c30=w5y[k30];if(!c30)continue;if(c30.projection)continue;if(c30.candleWidth){f5y+=(c30.candleWidth - r30) / 2;r30=c30.candleWidth;if(q30.volume || r30 < S30.tmpWidth){I8a.x7Q(2);L30=I8a.L7Q(2,r30);}}if(S30.transformFunc && j30 == S30.panel.yAxis && c30.transform){c30=c30.transform;}if(c30 && g5y && g5y != M98){c30=c30[g5y];}if(!c30 && c30 !== 0)continue;n30=c30.Close;b30=c30.Open === undefined?n30:c30.Open;if(P30 && S30.defaultPlotField){n30=c30[S30.defaultPlotField];}if(!n30 && n30 !== 0)continue;if(h30 && !P30 && (b30 == n30 || b30 === null))continue;if(V30){U30=z30.ChartEngine;if(V30 & U30.CLOSEDOWN){s5y.even|=n30 == c30.iqPrevClose;}else if(V30 & U30.CANDLEDOWN){I8a.z7Q(0);s5y.even|=I8a.L7Q(b30,n30);}if(V30 & U30.CANDLEUP && b30 >= n30)continue;if(V30 & U30.CANDLEDOWN && b30 <= n30)continue;if(V30 & U30.CANDLEEVEN && b30 != n30)continue;if(V30 & U30.CLOSEUP && n30 <= c30.iqPrevClose)continue;if(V30 & U30.CLOSEDOWN && n30 >= c30.iqPrevClose)continue;if(V30 & U30.CLOSEEVEN && n30 != c30.iqPrevClose)continue;}I8a.x7Q(3);n5y=I8a.L7Q(k30,j5y);T5y=b30;O5y=n30;if(J30 || C30){T5y=c30.High === undefined?Math.max(n30,b30):c30.High;O5y=c30.Low === undefined?Math.min(n30,b30):c30.Low;}I30=j30.semiLog?j30.height * (1 - (Math.log(Math.max(T5y,0)) / Math.LN10 - j30.logLow) / j30.logShadow):(j30.high - T5y) * j30.multiplier;t30=j30.semiLog?j30.height * (1 - (Math.log(Math.max(O5y,0)) / Math.LN10 - j30.logLow) / j30.logShadow):(j30.high - O5y) * j30.multiplier;if(j30.flipped){I8a.x7Q(1);I30=I8a.C7Q(m30,I30);I8a.z7Q(1);t30=I8a.L7Q(m30,t30);}else {I30+=W30;t30+=W30;}K30=Math.floor(P30?j30.flipped?j30.top:t30:Math.min(I30,t30)) + D30;Y30=P30?j30.flipped?I30:j30.bottom:Math.max(I30,t30);I8a.x7Q(1);e30=Math.floor(I8a.C7Q(Y30,K30));E5y=t30;if(C30 || J30){v30=j30.semiLog?j30.height * ("1" * 1 - (Math.log(Math.max(b30,+"0")) / Math.LN10 - j30.logLow) / j30.logShadow):(j30.high - b30) * j30.multiplier;X30=j30.semiLog?j30.height * (1 - (Math.log(Math.max(n30,0)) / Math.LN10 - j30.logLow) / j30.logShadow):(j30.high - n30) * j30.multiplier;if(j30.flipped){I8a.x7Q(1);v30=I8a.L7Q(m30,v30);I8a.z7Q(1);X30=I8a.C7Q(m30,X30);}else {v30+=W30;X30+=W30;}E5y=X30;}A5y[k30]=E5y;if(K30 < W30){if(K30 + e30 < W30)continue;I8a.x7Q(1);e30-=I8a.L7Q(W30,K30);K30=W30;}if(K30 + e30 > m30){I8a.z7Q(4);e30-=I8a.C7Q(e30,K30,m30);}I8a.z7Q(3);Y30=I8a.C7Q(e30,K30);if(K30 >= m30)continue;if(Y30 <= W30)continue;l30=Math.floor(f5y) + (!q30.highlight && 0.5);p5y=Math.floor(l30 - L30) + D30;Q5y=Math.round(l30 + L30) - D30;H5y=p5y == Q5y?L30:0;if(e30 < 2){e30=2;}if(h30){if(P30 || n30 != b30){o30.rect(p5y,K30,Math.max(1,Q5y - p5y),e30);}}else if(J30){if(n30 == b30){if(X30 <= m30 && X30 >= W30){N5y=Math.floor(X30) + (!q30.highlight && 0.5);I8a.x7Q(1);o30.moveTo(I8a.L7Q(p5y,H5y),N5y);I8a.z7Q(3);o30.lineTo(I8a.L7Q(H5y,Q5y),N5y);}}if(T5y != O5y){o30.moveTo(l30,K30);o30.lineTo(l30,Y30);}}else if(C30){if(K30 < m30 && Y30 > W30 && c30.High != c30.Low){I8a.z7Q(1);o30.moveTo(l30,I8a.C7Q(K30,B5y));I8a.z7Q(3);o30.lineTo(l30,I8a.L7Q(B5y,Y30));}if(v30 > W30 && v30 < m30 && !F5y){z5y=Math.floor(v30) + (!q30.highlight && 0.5);o30.moveTo(l30,z5y);I8a.x7Q(5);o30.lineTo(I8a.C7Q(H5y,L30,l30),z5y);}if(X30 > W30 && X30 < m30){u5y=Math.floor(X30) + (!q30.highlight && 0.5);o30.moveTo(l30,u5y);I8a.x7Q(6);o30.lineTo(I8a.L7Q(L30,H5y,l30),u5y);}}}i98=306381639;I8a.z7Q(7);S98=-I8a.L7Q(1,"842910883");y98=2;for(var m98=1;I8a.M68(m98.toString(),m98.toString().length,+"19725") !== i98;m98++){i5y=o30.globalAlpha;y98+=2;}if(I8a.L68(y98.toString(),y98.toString().length,64775) !== S98){i5y=o30.globalAlpha;}if(h30){if(i5y < 1){o30.save();I8a.z7Q(1);q68=-I8a.C7Q("457659682",0);A68=485937999;h68=2;for(var c68=1;I8a.M68(c68.toString(),c68.toString().length,73037) !== q68;c68++){o30.globalAlpha=1;o30.fillStyle=this.containerColor;o30.fill();o30.restore();h68+=2;}if(I8a.L68(h68.toString(),h68.toString().length,56391) !== A68){o30.globalAlpha=+"5";o30.fillStyle=this.containerColor;o30.fill();o30.restore();}}I8a.x7Q(8);g88=I8a.C7Q(673213344,"1605226196");E88=1968544259;o88=+"2";for(var z88="1" << 1428656928;I8a.M68(z88.toString(),z88.toString().length,72476) !== g88;z88++){o30.fill();o88+=2;}if(I8a.M68(o88.toString(),o88.toString().length,92714) !== E88){o30.fill();}o30.fill();if(Z5y){o30.lineWidth=q30.highlight?2:1;o30.strokeStyle=M30;o30.stroke();}}else if(J30 || C30){this.canvasColor(G5y);o30.globalAlpha=i5y;if(M30){o30.strokeStyle=M30;}if(q30.highlight){o30.lineWidth*=2;}o30.stroke();o30.closePath();o30.lineWidth=1;}o30.globalAlpha=o5y;return {cache:A5y};};z30.ChartEngine.prototype.plotDataSegmentAsLine=function(X5y,I5y,W5y,h5y){var U8a=O000;var r0y,g7y,l5y,J5y,E0y,v5y,r5y,b5y,D5y,F0y,U0y,A0y,t0y,K5y,i0y,R5y,P0y,d7y,L0y,S5y,t5y,q5y,o0y,I0y,w7y,O98,Y5y,j0y,Y0y,M5y,x0y,f0y,c0y,Z0y,B0y,Q7y,a0y,L5y,e5y,U5y,T0y,q0y,T88,p88,q88,R0y,M0y,m5y,W0y,G7y,F7y,b0y,J0y,N0y,P5y,V5y,O0y,z0y,C5y,g0y,C0y,d0y,k0y,w0y,A7y,h0y,K0y,p0y,m0y,y0y,S0y,D0y,f7y,E7y,T7y,B88,N88,F88,O7y,X0y,H0y,p7y,l0y,R98,C98,g98,q98,p98,T98,w98,z98,P98,H7y,Q0y,t98,l88,x88,a88,V0y,Z7y,B7y,s7y,u0y,e0y,a7y,s0y;function v0y(c7y){var L98,i7y,N7y,z7y,o7y,n7y,j7y,q7y,u7y,W7y,V88,Z88,D88,v98;L98="o";L98+="bj";L98+="ect";i7y=r5y;N7y=c7y;if(typeof N7y == L98){r5y=z30.borderPatternToArray(q5y.lineWidth,N7y.pattern);N7y=N7y.color;}t0y[N7y]=1;if(F0y){return;}z7y=K5y.slice(-2);o7y=r5y instanceof Array && r5y.join();n7y=i7y instanceof Array && i7y.join();U8a.x7Q(9);j7y=U8a.C7Q(n7y,o7y);q7y=!z30.colorsEqual(I0y,N7y);u7y=c7y.width * (A0y?"2" << 2040468864:1);W7y=q5y.lineWidth != u7y;U8a.u8a();if(q7y || j7y || W7y){if(D5y){i0y.push({coord:z7y,color:N7y,pattern:r5y?r5y:[],width:u7y});}else {q5y.stroke();q5y.lineWidth=u7y;if(j7y){q5y.setLineDash(o7y?r5y:[]);}q5y.beginPath();V88=-1899209761;Z88=-820771820;U8a.x7Q(10);D88=U8a.C7Q("2",2);for(var G88=1;U8a.M68(G88.toString(),G88.toString().length,11454) !== V88;G88++){q5y.moveTo(z7y[1],z7y[+"6"]);D88+=2;}if(U8a.M68(D88.toString(),D88.toString().length,278) !== Z88){q5y.moveTo(z7y[0],z7y[1]);};}}I0y=N7y;if(!D5y){v98="au";v98+="to";if(!N7y || N7y == v98){q5y.strokeStyle=d7y.defaultColor;}else {q5y.strokeStyle=N7y;}}return z7y;}r0y=![];g7y=! !"";l5y=!{};J5y=!"1";E0y=!0;v5y=null;r5y=null;b5y=null;D5y=0;F0y=!{};U0y=! !"";A0y=!{};t0y={};K5y=[];i0y=[];R5y=[];P0y=[];U8a.Z8a();function y7y(b7y,V7y,S7y){var m7y,X7y,l7y;q5y.setLineDash([]);m7y=K7y("CollatedOpen");function K7y(r7y){var e7y;U8a.u8a();e7y=b5y.semiLog?b5y.height * (1 - (Math.log(Math.max(S7y[r7y],0)) / Math.LN10 - b5y.logLow) / b5y.logShadow):(b5y.high - S7y[r7y]) * b5y.multiplier;if(b5y.flipped){e7y=b5y.bottom - e7y;}else {e7y+=b5y.top;}return e7y;}X7y=K7y("CollatedHigh");l7y=K7y("CollatedLow");U8a.Z8a();q5y.lineTo(b7y,m7y);q5y.moveTo(b7y,X7y);q5y.lineTo(b7y,l7y);q5y.moveTo(b7y,V7y);K5y.push(b7y,m7y);}d7y=this;L0y=this.layout;S5y=I5y.chart;t5y=S5y.dataSegment;q5y=S5y.context;o0y=new Array(t5y.length);I0y=q5y.strokeStyle;w7y=q5y.globalAlpha;if(S5y.dataSet.length){O98="Clo";O98+="s";O98+="e";this.startClip(I5y.name);if(W5y){r0y=W5y.skipProjections;g7y=W5y.skipTransform;l5y=W5y.noSlopes;D5y=W5y.tension;J5y=W5y.step;r5y=W5y.pattern;E0y=W5y.extendOffChart;b5y=W5y.yAxis;v5y=W5y.gapDisplayStyle;F0y=W5y.noDraw;U0y=W5y.reverse;A0y=W5y.highlight;if(W5y.width){q5y.lineWidth=W5y.width;}}if(!v5y && v5y !== !{}){v5y=W5y.gaps;}if(!v5y){v5y={color:"transparent",fillMountain:! !1};}q5y.setLineDash(r5y instanceof Array?r5y:[]);if(A0y){q5y.lineWidth*=2;}if(!A0y && this.highlightedDraggable){q5y.globalAlpha*=0.3;}if(E0y !== !"1"){E0y=!0;}Y5y=W5y.subField || S5y.defaultPlotField || O98;if(!b5y){b5y=I5y.yAxis;}j0y=S5y.transformFunc && b5y == S5y.panel.yAxis;Y0y=q5y.lineWidth * 2;M5y=U0y?S5y.top - Y0y:S5y.bottom + Y0y;if(W5y.threshold || W5y.threshold === 0){M5y=this.pixelFromPrice(W5y.threshold,I5y,b5y);}x0y=!D5y && F0y && v5y && v5y.fillMountain;f0y=X5y;c0y=X5y;for(var n0y="0" - 0;n0y < t5y.length;n0y++){Z0y=t5y[n0y];if(Z0y && typeof Z0y == "object"){if(Z0y[X5y] || Z0y[X5y] === 0){if(typeof Z0y[X5y] == "object"){c0y=z30.createObjectChainNames(X5y,[Y5y])[0];}break;}}}B0y={left:null,right:null};Q7y=S5y.dataSet.length - S5y.scroll - 1;if(E0y){B0y.left=this.getPreviousBar(S5y,c0y,0);B0y.right=this.getNextBar(S5y,c0y,t5y.length - 1);}a0y=!"";L5y=! !"";q5y.beginPath();T0y=B0y.left;q0y=null;if(T0y){q0y=T0y.transform;}if(T0y){T88=-1674473726;p88=855364296;q88=2;for(var h88=1;U8a.M68(h88.toString(),h88.toString().length,86536) !== T88;h88++){U5y=j0y?q0y?q0y[X5y]:1:T0y[X5y];q88+=2;}if(U8a.M68(q88.toString(),q88.toString().length,23486) !== p88){U5y=j0y?q0y?q0y[X5y]:1:T0y[X5y];}U5y=j0y?q0y?q0y[X5y]:null:T0y[X5y];if(U5y || U5y === 0){if(U5y[Y5y] || U5y[Y5y] === 0){U5y=U5y[Y5y];}R0y=this.pixelFromTick(T0y.tick,S5y);M0y=this.pixelFromTransformedValue(U5y,I5y,b5y);q5y.moveTo(R0y,M0y);K5y.push(R0y,M0y);if(t5y[0].tick - T0y.tick > 1){R5y.push({start:K5y.slice(-2),threshold:M5y,tick:T0y});L5y=!"";}a0y=!{};}}m5y=I5y.left + this.micropixels - 1;if(W5y.shiftRight){m5y+=W5y.shiftRight;}if(J5y && W5y.alignStepToSide){m5y-=this.layout.candleWidth / 2;}F7y=this.currentQuote();b0y=0;J0y=0;N0y=! !0;P5y={reset:!0};for(var k5y=0;k5y < t5y.length;k5y++){e5y=L0y.candleWidth;V5y=t5y[k5y];O0y=t5y[k5y];if(!V5y){V5y={};}z0y=V5y.lineTravel;if(r0y && V5y.projection){B0y.right=null;break;}if(V5y.candleWidth){e5y=V5y.candleWidth;}if(W5y.lineTravelSpacing){e5y=0;}if(j0y && V5y.transform){V5y=V5y.transform;}C5y=V5y[X5y];if(C5y && typeof C5y == "object"){C5y=C5y[Y5y];U8a.z7Q(6);f0y=U8a.L7Q(3859 < ("787.33" * 1,3495)?(782,"I"):".",Y5y,X5y);}if(S5y.lineApproximation && L0y.candleWidth < 1 && !W5y.lineTravelSpacing){if(P5y.reset){P5y={CollatedHigh:-Number.MAX_VALUE,CollatedLow:Number.MAX_VALUE,CollatedOpen:null,CollatedClose:null};N0y=!1;}g0y=C5y;if(g0y || g0y === 0){P5y.CollatedHigh=Math.max(P5y.CollatedHigh,g0y);P5y.CollatedLow=Math.min(P5y.CollatedLow,g0y);P5y.CollatedClose=g0y;if(P5y.CollatedOpen === null){P5y.CollatedOpen=g0y;}else {N0y=! !"1";}}b0y+=e5y;if(b0y - J0y >= 1 || k5y == t5y.length - 1){J0y=Math.floor(b0y);P5y.reset=! ![];P5y[X5y]=P5y.CollatedClose;V5y=P5y;V5y.cache={};}else {m5y+=e5y;continue;}}if(!l5y){U8a.x7Q(2);m5y+=U8a.C7Q(2,e5y);}if(!C5y && C5y !== 0){C0y=K5y.slice(-2);if(x0y && !L5y && K5y.length){K5y.push(C0y[0],M5y);}if(!L5y){R5y.push({start:C0y,threshold:M5y,tick:G7y});}L5y=! !{};m5y+=l5y?e5y:e5y / 2;if((J5y || l5y) && K5y.length){o0y[k5y]=K5y.slice(-1)[0];}if(z0y){m5y+=z0y;}continue;}W0y=V5y;d0y=V5y.cache;U8a.z7Q(3);k0y=U8a.L7Q(k5y,Q7y);if(k0y < I5y.cacheLeft || k0y > I5y.cacheRight || !d0y[X5y]){d0y[f0y]=b5y.semiLog?b5y.height * (1 - (Math.log(Math.max(C5y,0)) / Math.LN10 - b5y.logLow) / b5y.logShadow):(b5y.high - C5y) * b5y.multiplier;if(b5y.flipped){d0y[f0y]=b5y.bottom - d0y[f0y];}else {d0y[f0y]+=b5y.top;}}w0y=o0y[k5y]=d0y[f0y];if(O0y.tick == F7y.tick && S5y.lastTickOffset){m5y+=S5y.lastTickOffset;}A7y=K5y.slice(-2);if(!a0y && h5y){if(O0y[X5y] && O0y[X5y][Y5y]){O0y=O0y[X5y];}h0y=h5y(this,O0y,L5y);if(!h0y){m5y+=l5y?e5y:e5y / 2;continue;}A7y=v0y(h0y);}if(a0y){q5y.moveTo(m5y,w0y);if(D5y){i0y.push({coord:[m5y,w0y],color:q5y.strokeStyle,pattern:r5y?r5y:[],width:q5y.lineWidth});}}else {if(J5y || l5y){K0y=K5y.slice(-1)[0];if(N0y){y7y(m5y,K0y,V5y);}else {q5y.lineTo(m5y,K0y);}K5y.push(m5y,K0y);}if(N0y && !l5y){y7y(m5y,w0y,V5y);}else {q5y[l5y?"moveTo":"lineTo"](m5y,w0y);}}if(L5y){R5y.push({end:[m5y,w0y],threshold:M5y});G7y=O0y;if(x0y && !J5y && !l5y){K5y.push(m5y,M5y);}}K5y.push(m5y,w0y);a0y=![];L5y=!1;m5y+=l5y?e5y:e5y / 2;if(z0y){m5y+=z0y;};}p0y=B0y.right;m0y=null;if(p0y){m0y=p0y.transform;}if(!a0y && p0y){U5y=j0y?m0y?m0y[X5y]:null:p0y[X5y];if(U5y && (U5y[Y5y] || U5y[Y5y] === 0)){U5y=U5y[Y5y];}y0y=this.pixelFromTick(p0y.tick,S5y);S0y=this.pixelFromTransformedValue(U5y,I5y,b5y);if(p0y.tick - t5y[t5y.length - 1].tick > 1){if(!L5y){D0y=K5y.slice(-2);if(x0y && K5y.length){K5y.push(D0y[0],M5y);}R5y.push({start:D0y,threshold:M5y,tick:t5y[t5y.length - 1]});}L5y=! !{};}if(!a0y && h5y){f7y=h5y(this,p0y,L5y);if(f7y){E7y=v0y(f7y);}}T7y=K5y.slice(-2);if(!r5y || !r5y.length){if(J5y || l5y){q5y.lineTo(y0y,T7y["1" << 273419456]);K5y.push(y0y,T7y[1]);}B88=-1008518649;N88=+"598745436";F88=2;for(var s88=1;U8a.L68(s88.toString(),s88.toString().length,60902) !== B88;s88++){q5y[l5y?"moveTo":"lineTo"](y0y,S0y);F88+=2;}if(U8a.L68(F88.toString(),F88.toString().length,95059) !== N88){q5y[l5y?"lineTo":"lineTo"](y0y,S0y);}}if(L5y){R5y.push({end:[y0y,S0y],threshold:M5y});if(x0y && !J5y && !l5y){K5y.push(y0y,M5y);}}K5y.push(y0y,S0y);}for(var x7y in t0y){P0y.push(x7y);}if(W5y.extendToEndOfLastBar){O7y=K5y.slice(-2);q5y.lineTo(O7y[0] + e5y,O7y[1]);}else if(J5y || l5y || this.extendLastTick || W5y.extendToEndOfDataSet){X0y=K5y.slice(-2);if(K5y.length){H0y=X0y[0];p7y=X0y[1];if(W5y.extendToEndOfDataSet || J5y && W5y.extendToEndOfDataSet !== !1){H0y=this.pixelFromTick(S5y.dataSet.length - 1,S5y);if(l5y || this.extendLastTick){U8a.z7Q(2);H0y+=U8a.L7Q(2,e5y);}}else if(l5y){H0y+=e5y;}else if(this.extendLastTick){U8a.z7Q(2);H0y+=U8a.C7Q(2,e5y);}if(H0y > X0y["0" * 1]){l0y=null;if(h5y){l0y=h5y(this,{},! !1);}if(l0y){v0y(l0y);}R98=-263185317;C98=-1418214297;g98=2;for(var o98=1;U8a.L68(o98.toString(),o98.toString().length,96665) !== R98;o98++){q5y.lineTo(H0y,p7y);if(!L5y || !x0y){K5y.push(H0y,p7y);}g98+=2;}if(U8a.L68(g98.toString(),g98.toString().length,73388) !== C98){q5y.lineTo(H0y,p7y);if(+L5y && ~x0y){K5y.push(H0y,p7y);}}}}}if(!F0y){if(D5y && K5y.length){q5y.beginPath();q5y.setLineDash(W5y.pattern || []);q5y.lineDashOffset=0;i30.plotSpline(K5y,D5y,q5y,i0y);}q5y.stroke();}this.endClip();if(!F0y && W5y.label && W0y){q98="#FFFFF";q98+="F";p98="noo";p98+="p";T98="n";T98+="oo";T98+="p";w98=1161675352;z98=- +"73248268";P98=2;for(var j98="1" - 0;U8a.L68(j98.toString(),j98.toString().length,65309) !== w98;j98++){Q0y=W0y[X5y];if(Q0y || +Q0y === ""){Q0y=Q0y[Y5y];}P98+=2;}if(U8a.M68(P98.toString(),P98.toString().length,78184) !== z98){t98="o";t98+="b";t98+="j";t98+="ect";Q0y=W0y[X5y];if(Q0y && typeof Q0y == t98){Q0y=Q0y[Y5y];}}if(b5y.priceFormatter){l88=1324379219;x88=1552541960;a88=2;for(var S88=1;U8a.M68(S88.toString(),S88.toString().length,+"68104") !== l88;S88++){H7y=b5y.priceFormatter(this,I5y,Q0y,W5y.labelDecimalPlaces);a88+=+"2";}if(U8a.M68(a88.toString(),a88.toString().length,66912) !== x88){H7y=b5y.priceFormatter(this,I5y,Q0y,W5y.labelDecimalPlaces);}}else {H7y=this.formatYAxisPrice(Q0y,I5y,W5y.labelDecimalPlaces);}V0y=this.yaxisLabelStyle;if(b5y.yaxisLabelStyle){V0y=b5y.yaxisLabelStyle;}Z7y=V0y == T98?q5y.strokeStyle:null;B7y=V0y == p98?q98:q5y.strokeStyle;this.yAxisLabels.push({src:"plot",args:[I5y,H7y,W0y.cache[f0y],B7y,Z7y,q5y,b5y]});}s7y=typeof v5y == "object"?v5y.color:v5y;if(z30.isTransparent(s7y)){for(var G0y=0;G0y < R5y.length;G0y+=2){u0y=R5y[G0y].start;if(G0y){e0y=R5y[G0y - 1].end;}if(e0y && u0y["0" & 2147483647] == e0y[0] && u0y[1] == e0y[1]){q5y.beginPath();a7y=q5y.lineWidth;if(h5y){s0y=h5y(this,R5y[G0y].tick || ({}),! !0);if(typeof s0y == "object"){a7y=s0y.width * (A0y?2:"1" << 212744480);s0y=s0y.color;}q5y.strokeStyle=q5y.fillStyle=s0y;}q5y.lineWidth=a7y;q5y.arc(u0y[0],u0y[1],1,"0" | 0,("2" << 627561824) * Math.PI);q5y.stroke();q5y.fill();}}}}q5y.globalAlpha=w7y;return {colors:P0y,points:K5y,cache:o0y,gapAreas:R5y};};z30.ChartEngine.prototype.drawMountainChart=function(R7y,U7y,E8y){var f8a=O000;var t7y,h7y,y8y,O8y,M7y,D7y,Y7y,f8y,p8y,P7y,Q8y,H8y,T8y,G8y,a8y,g8y,F8y,A8y,x8y,I7y,i8y,Z8y,L7y,J7y,B8y,N8y,n98,G98,l98,d8y,I68,r68,Q68,z8y,w8y,v7y,C7y,k7y,u8y,A98,s8y;t7y=this.chart.context;h7y=U7y;y8y=! !"";O8y=![];M7y=null;D7y=null;Y7y=null;f8y=null;p8y=0;P7y=null;Q8y=!1;H8y=null;T8y=null;G8y=!"1";a8y=null;g8y=null;F8y=! !"";A8y=! !0;x8y=!{};I7y=R7y.chart;i8y=I7y.dataSegment;Z8y=I7y.lineStyle || ({});if(!U7y || typeof U7y != "object"){U7y={style:U7y};}h7y=U7y.style || "stx_mountain_chart";M7y=U7y.field || I7y.defaultPlotField || "Close";D7y=U7y.subField || I7y.defaultPlotField || "Close";P7y=U7y.gapDisplayStyle;if(!P7y && P7y !== ![]){P7y=U7y.gaps;}if(!P7y && P7y !== ![]){P7y=I7y.gaplines;}if(!P7y){P7y="transparent";}Y7y=U7y.yAxis || R7y.yAxis;y8y=U7y.reverse || !{};f8y=U7y.tension;H8y=U7y.fillStyle;p8y=U7y.width || Z8y.width;Q8y=U7y.step;T8y=U7y.pattern || Z8y.pattern;G8y=U7y.highlight;g8y=U7y.color;a8y=U7y.baseColor;O8y=U7y.colored;F8y=U7y.extendToEndOfDataSet;A8y=U7y.isComparison;f8a.Z8a();x8y=U7y.returnObject;L7y=this.canvasStyle(h7y);J7y=Y7y.top;if(isNaN(J7y) || isNaN(J7y / J7y)){J7y=0;}B8y=g8y || (h7y && L7y.backgroundColor?L7y.backgroundColor:this.defaultColor);N8y=a8y || (h7y && L7y.color?L7y.color:this.containerColor);if(H8y){n98=-263612472;G98=1446114074;l98=2;for(var a98=1;f8a.M68(a98.toString(),a98.toString().length,52556) !== n98;a98++){t7y.fillStyle=H8y;l98+=2;}if(f8a.L68(l98.toString(),l98.toString().length,62512) !== G98){t7y.fillStyle=H8y;}t7y.fillStyle=H8y;}else if(a8y || L7y.color){d8y=t7y.createLinearGradient(0,J7y,+"0",Y7y.bottom);I68=34432381;r68=1920417983;Q68=2;for(var N68="1" * 1;f8a.L68(N68.toString(),N68.toString().length,"94279" << 1737622528) !== I68;N68++){d8y.addColorStop(Y7y.flipped?+"1":0,B8y);d8y.addColorStop(Y7y.flipped?0:1,N8y);Q68+=2;}if(f8a.L68(Q68.toString(),Q68.toString().length,54747) !== r68){d8y.addColorStop(Y7y.flipped?6:1,B8y);d8y.addColorStop(Y7y.flipped?5:2,N8y);}t7y.fillStyle=d8y;}else {t7y.fillStyle=B8y;}this.startClip(R7y.name);z8y=t7y.lineWidth;if(!U7y.symbol){D7y=null;}U7y={skipProjections:!"",reverse:y8y,yAxis:Y7y,gapDisplayStyle:P7y,step:Q8y,highlight:G8y,extendToEndOfDataSet:F8y,isComparison:A8y};if(I7y.tension){U7y.tension=I7y.tension;}if(f8y || f8y === 0){U7y.tension=f8y;}w8y=parseInt(L7y.paddingTop,10);v7y=g8y || L7y.borderTopColor;C7y=null;if(O8y || v7y && !z30.isTransparent(v7y)){if(w8y){k7y=this.scratchContext;if(!k7y){u8y=t7y.canvas.cloneNode(! !{});k7y=this.scratchContext=u8y.getContext("2d");}k7y.canvas.height=t7y.canvas.height;k7y.canvas.width=t7y.canvas.width;k7y.drawImage(t7y.canvas,0,0);z30.clearCanvas(t7y.canvas,this);}}z30.extend(U7y,{panelName:R7y.name,direction:U7y.reverse?-("1" >> 1293267872):1,band:M7y,subField:D7y,opacity:1});if(!U7y.highlight && this.highlightedDraggable){U7y.opacity*=0.3;}z30.preparePeakValleyFill(this,U7y);if(O8y || v7y && !z30.isTransparent(v7y)){if(w8y){A98="destin";A98+="at";A98+="i";A98+="on-out";t7y.save();f8a.x7Q(7);t7y.lineWidth+=f8a.C7Q(w8y,2);t7y.globalCompositeOperation=A98;t7y.globalAlpha=1;this.plotDataSegmentAsLine(M7y,R7y,U7y);t7y.globalCompositeOperation="destination-over";t7y.scale(1 / this.adjustedDisplayPixelRatio,+"1" / this.adjustedDisplayPixelRatio);t7y.drawImage(this.scratchContext.canvas,"0" - 0,0);t7y.restore();}}t7y.strokeStyle=v7y;if(p8y){t7y.lineWidth=p8y;}else if(L7y.width && parseInt(L7y.width,"10" ^ 0) <= 25){t7y.lineWidth=Math.max(1,z30.stripPX(L7y.width));}else {t7y.lineWidth=1;}if(!T8y){T8y=L7y.borderTopStyle;}U7y.pattern=z30.borderPatternToArray(t7y.lineWidth,T8y);s8y=E8y;if(P7y){s8y=this.getGapColorFunction(M7y,D7y,{color:v7y,pattern:U7y.pattern,width:t7y.lineWidth},P7y,E8y);}C7y=this.plotDataSegmentAsLine(M7y,R7y,U7y,s8y);t7y.lineWidth=z8y;this.endClip();if(!C7y.colors.length){C7y.colors.push(v7y);}return x8y?C7y:C7y.colors;};z30.ChartEngine.prototype.drawBaselineChart=function(j8y,o8y){var G8a=O000;var h98,l8y,U8y,n8y,H98,s98,Q98,r98,I98,c98,d98,t8y,P88,U88,j88,W8y,P8y,k8y,h8y,D8y,f1y,T1y,O1y,p1y,H1y,Y8y,R8y,M8y,X8y,J8y,V8y,u98,B98,L8y,q8y,e8y,a1y,g1y,I8y,F98,N98,W28;h98="o";h98+="bject";var {chart:c8y}=j8y;var {baseline:v8y, field:r8y, yAxis:S8y}=o8y;G8a.u8a();var {gaplines:b8y, defaultPlotField:C8y, lineStyle:K8y}=c8y;l8y=typeof v8y === h98?v8y.actualLevel:c8y.baseline.actualLevel;U8y=[];if(!r8y){r8y=C8y;}if(!K8y){K8y={};}n8y=o8y.gapDisplayStyle;if(!n8y && n8y !== ![]){n8y=o8y.gaps;}if(l8y !== null && !isNaN(l8y)){H98="2";H98+=".1";s98="1";s98+=".";s98+="1";Q98="s";Q98+="tx_bas";Q98+="elin";Q98+="e";r98="stx_basel";r98+="i";r98+="ne";I98="stx_base";I98+="li";I98+="n";I98+="e_down";c98="stx_baseli";c98+="ne_down";d98="st";d98+="x_baseline_d";d98+="own";t8y=o8y.type == "mountain";if(t8y){P88=114339678;U88=-688726887;j88=2;for(var e88=1;G8a.L68(e88.toString(),e88.toString().length,61941) !== P88;e88++){U8y=this.drawMountainChart(j8y,{style:o8y.style,field:o8y.field,yAxis:S8y,gapDisplayStyle:n8y,colored:![],tension:5});j88+=2;}if(G8a.L68(j88.toString(),j88.toString().length,41698) !== U88){U8y=this.drawMountainChart(j8y,{style:o8y.style,field:o8y.field,yAxis:S8y,gapDisplayStyle:n8y,colored:![],tension:"5" ^ 0});}U8y=this.drawMountainChart(j8y,{style:o8y.style,field:o8y.field,yAxis:S8y,gapDisplayStyle:n8y,colored:! ![],tension:0});}W8y=this.pixelFromPrice(l8y,j8y,S8y);if(isNaN(W8y)){return;}this.startClip(j8y.name);P8y=o8y.pattern || K8y.pattern;k8y=o8y.fill_color_up || this.getCanvasColor("stx_baseline_up");h8y=o8y.fill_color_down || this.getCanvasColor(d98);D8y=o8y.border_color_up || this.getCanvasColor("stx_baseline_up");f1y=o8y.border_color_down || this.getCanvasColor(c98);T1y=o8y.width || K8y.width || this.canvasStyle("stx_baseline_up").width;O1y=o8y.width || K8y.width || this.canvasStyle(I98).width;p1y=o8y.widthBaseline || K8y.width || z30.stripPX(this.canvasStyle(r98).width);H1y=o8y.baselineOpacity || this.canvasStyle(Q98).opacity;Y8y={fill:k8y,edge:D8y,width:T1y};R8y={fill:h8y,edge:f1y,width:O1y};M8y=o8y.yAxis.flipped;X8y={over:M8y?R8y:Y8y,under:M8y?Y8y:R8y};J8y=! !0;if(!n8y && n8y !== ! !""){n8y=b8y;}V8y=1;if(!o8y.highlight && this.highlightedDraggable){V8y*=0.3;}for(var m8y in X8y){u98="t";u98+="ransp";u98+="arent";B98="tran";B98+="spa";B98+="re";B98+="nt";L8y=parseInt(Math.max(1,z30.stripPX(X8y[m8y].width)),10);if(o8y.highlight){L8y*=+"2";}P8y=z30.borderPatternToArray(L8y,P8y);q8y={panelName:j8y.name,band:r8y,threshold:l8y,color:t8y?B98:X8y[m8y].fill,direction:m8y == "over"?1:-("1" ^ 0),edgeHighlight:X8y[m8y].edge,edgeParameters:{pattern:P8y,lineWidth:L8y + 0.1,opacity:V8y},gapDisplayStyle:n8y,yAxis:o8y.yAxis};if(S8y){q8y.threshold=this.priceFromPixel(this.pixelFromPrice(q8y.threshold,j8y,S8y),j8y,S8y);}U8y.push(X8y[m8y].edge);e8y=q8y.color;if(!t8y && e8y && e8y != "transparent"){a1y=j8y.top;g1y=j8y.bottom;I8y=c8y.context.createLinearGradient(0,m8y == "over"?a1y:g1y,0,W8y);G8a.x7Q(8);I8y.addColorStop(G8a.C7Q(563097024,"0"),z30.hexToRgba(z30.colorToHex(e8y),60));I8y.addColorStop(1,z30.hexToRgba(z30.colorToHex(e8y),10));q8y.color=I8y;q8y.opacity=V8y;}z30.preparePeakValleyFill(this,c8y.dataSegment,q8y);if(b8y){if(!b8y.fillMountain){F98="s";F98+="olid";N98="transpa";N98+="re";N98+="nt";this.drawLineChart(j8y,null,null,{color:N98,gapDisplayStyle:{color:this.containerColor,pattern:F98,width:q8y.edgeParameters.lineWidth}});}if(!b8y.color){J8y=! !{};b8y.color=this.defaultColor;}}this.drawLineChart(j8y,null,null,{color:u98,width:q8y.edgeParameters.lineWidth});if(J8y){b8y.color=null;}}G8a.x7Q(7);this.plotLine(0,G8a.L7Q(1,"1"),W8y,W8y,this.containerColor,"line",c8y.context,j8y,{lineWidth:s98});G8a.x7Q(11);this.plotLine(G8a.C7Q("0",0),+"1",W8y,W8y,this.getCanvasColor("stx_baseline"),"line",c8y.context,j8y,{pattern:"dotted",lineWidth:p1y || H98,opacity:H1y || 0.5 * V8y});if(this.controls.baselineHandle && this.manageTouchAndMouse){if(this.getSeriesRenderer(o8y.name) == this.mainSeriesRenderer && c8y.baseline.userLevel !== !{}){W28="p";W28+="x";this.controls.baselineHandle.style.top=W8y - parseInt(getComputedStyle(this.controls.baselineHandle).height,10) / 2 + "px";this.controls.baselineHandle.style.left=c8y.right - parseInt(getComputedStyle(this.controls.baselineHandle).width,"10" & 2147483647) + W28;this.controls.baselineHandle.style.display="block";}}this.endClip();}return {colors:U8y};};z30.ChartEngine.prototype.plotLine=function(d1y){var d8a=O000;var Y28,k28,F1y,x1y,G1y,Q1y,A1y,o1y,w1y,Z1y,V1y,j1y,c1y,n1y,q1y,H88,W98,k98,s1y,m1y,y1y,e1y,U1y,k88,Y88,K88,z1y,u1y,W1y,b1y,B1y,i1y,E1y,S1y,r1y,X1y,K1y,y88,J88,m88,F68,u68,s68,t1y;Y28="hor";Y28+="izont";Y28+="al";k28="r";k28+="a";k28+="y";if(typeof arguments[0] == "number"){d1y={x0:arguments[0],x1:arguments[1],y0:arguments[2],y1:arguments[3],color:arguments[+"4"],type:arguments[5],context:arguments[6],confineToPanel:arguments[+"7"]};for(var l1y in arguments[8]){d1y[l1y]=arguments[+"8"][l1y];}}if(!d1y){d1y={};}if(d1y.pattern == "none"){return;}F1y=d1y.x0;d8a.u8a();x1y=d1y.x1;G1y=d1y.y0;Q1y=d1y.y1;A1y=d1y.color;o1y=d1y.type;w1y=d1y.context;Z1y=d1y.confineToPanel;V1y=d1y.deferStroke;if(Z1y === ! !{}){Z1y=this.chart.panel;}if(w1y === null || typeof w1y == "undefined"){w1y=this.chart.context;}if(isNaN(F1y) || isNaN(x1y) || isNaN(G1y) || isNaN(Q1y)){return;}j1y=0;c1y=this.chart.canvasHeight;n1y=0;q1y=this.right;if(Z1y){c1y=Z1y.yAxis.bottom;j1y=Z1y.yAxis.top;n1y=Z1y.left;H88=2073455910;d8a.z7Q(8);W98=-d8a.L7Q(1471772288,"1264016151");k98=2;for(var K98=1;d8a.M68(K98.toString(),K98.toString().length,76120) !== H88;K98++){q1y=Z1y.right;k98+=2;}if(d8a.M68(k98.toString(),k98.toString().length,17402) !== W98){q1y=Z1y.right;}}if(o1y == k28){s1y=10000000;if(x1y < F1y){s1y=-10000000;}y1y={x0:F1y,x1:x1y,y0:G1y,y1:Q1y};m1y=z30.yIntersection(y1y,s1y);x1y=s1y;Q1y=m1y;}if(o1y == "line" || o1y == Y28 || o1y == "vertical"){s1y=10000000;d8a.z7Q(11);e1y=-d8a.C7Q("10000000",0);y1y={x0:F1y,x1:x1y,y0:G1y,y1:Q1y};m1y=z30.yIntersection(y1y,s1y);U1y=z30.yIntersection(y1y,e1y);F1y=e1y;k88=2050296151;Y88=-79838660;d8a.z7Q(7);K88=d8a.C7Q(1,"2");for(var C88=+"1";d8a.M68(C88.toString(),C88.toString().length,45751) !== k88;C88++){x1y=s1y;d8a.x7Q(12);K88+=d8a.C7Q(2147483647,"2");}if(d8a.M68(K88.toString(),K88.toString().length,+"84384") !== Y88){x1y=s1y;}G1y=U1y;Q1y=m1y;}z1y=0.0;u1y=1.0;d8a.x7Q(1);W1y=d8a.C7Q(x1y,F1y);d8a.x7Q(1);b1y=d8a.L7Q(Q1y,G1y);for(var N1y=0;N1y < 4;N1y++){if(N1y === 0){B1y=-W1y;d8a.z7Q(1);i1y=-d8a.C7Q(n1y,F1y);}if(N1y == 1){B1y=W1y;d8a.x7Q(1);i1y=d8a.L7Q(q1y,F1y);}if(N1y == 2){B1y=-b1y;d8a.x7Q(1);i1y=-d8a.L7Q(j1y,G1y);}if(N1y == "3" >> 1787149024){B1y=b1y;d8a.z7Q(1);i1y=d8a.L7Q(c1y,G1y);}d8a.x7Q(2);E1y=d8a.L7Q(B1y,i1y);if((Q1y || Q1y === 0) && B1y === 0 && i1y < 0){return !{};;}if(B1y < 0){if(E1y > u1y){return !"1";}else if(E1y > z1y){z1y=E1y;};}else if(B1y > 0){if(E1y < z1y){return ![];}else if(E1y < u1y){u1y=E1y;};}}d8a.z7Q(13);S1y=d8a.C7Q(F1y,z1y,W1y);d8a.z7Q(13);r1y=d8a.L7Q(G1y,z1y,b1y);d8a.z7Q(13);X1y=d8a.L7Q(F1y,u1y,W1y);d8a.x7Q(13);K1y=d8a.C7Q(G1y,u1y,b1y);if(!Q1y && Q1y !== 0 && !G1y && G1y !== 0){r1y=j1y;K1y=c1y;S1y=y1y.x0;X1y=y1y.x0;if(y1y.x0 > q1y){return ! !0;}if(y1y.x0 < n1y){return ! !"";}}else if(!Q1y && Q1y !== 0){if(y1y.y0 < y1y.y1){K1y=c1y;}else {K1y=j1y;}S1y=y1y.x0;X1y=y1y.x0;if(y1y.x0 > q1y){return ! !0;}if(y1y.x0 < n1y){return !1;}}if(!V1y){w1y.save();w1y.beginPath();}w1y.lineWidth=1.1;if(A1y && typeof A1y == "object"){w1y.strokeStyle=A1y.color;if(A1y.opacity){w1y.globalAlpha=A1y.opacity;}else {w1y.globalAlpha=1;}w1y.lineWidth=z30.stripPX(A1y.width);}else {if(!A1y || A1y == "auto" || z30.isTransparent(A1y)){y88=1104365878;d8a.z7Q(8);J88=d8a.L7Q(1780334976,"1527758338");m88=2;for(var b88=1;d8a.L68(b88.toString(),b88.toString().length,51373) !== y88;b88++){w1y.strokeStyle=this.defaultColor;m88+=2;}if(d8a.L68(m88.toString(),m88.toString().length,10722) !== J88){w1y.strokeStyle=this.defaultColor;}w1y.strokeStyle=this.defaultColor;}else {F68=- +"966475361";u68=-791989261;s68=2;for(var W88=1;d8a.L68(W88.toString(),W88.toString().length,9784) !== F68;W88++){w1y.strokeStyle=A1y;s68+=2;}if(d8a.M68(s68.toString(),s68.toString().length,89366) !== u68){w1y.strokeStyle=A1y;}}}if(d1y.opacity){w1y.globalAlpha=d1y.opacity;}if(d1y.lineWidth){w1y.lineWidth=d1y.lineWidth;}if(d1y.globalCompositeOperation){w1y.globalCompositeOperation=d1y.globalCompositeOperation;}t1y=z30.borderPatternToArray(w1y.lineWidth,d1y.pattern);w1y.setLineDash(d1y.pattern?t1y:[]);w1y.moveTo(S1y,r1y);w1y.lineTo(X1y,K1y);if(!V1y){w1y.stroke();w1y.restore();}};z30.ChartEngine.prototype.rendererAction=function(v1y,L1y){var F8a=O000;var K28,o28,E28,f98,e98,V98,C28,R28,R1y,g28,M88,L88,v88,z28,w28,P1y,I1y,J1y,Y1y;K28="under";K28+="lay";if(L1y === K28){o28="Symbol(CIQ.wa";o28+="termark)";E28="CI";E28+="Q.waterm";E28+="ark";F8a.x7Q(1);f98=F8a.L7Q("683128349",0);e98=-1183231151;V98=2;for(var D98=1;F8a.M68(D98.toString(),D98.toString().length,26709) !== f98;D98++){C28="Symb";C28+="ol(CIQ.watermark)";R28="Sy";R28+="mbol(CIQ.watermark)";R1y=~Symbol !== "CIQ.watermark"?Symbol.for(R28):C28;F8a.z7Q(12);V98+=F8a.C7Q(2147483647,"2");}if(F8a.L68(V98.toString(),V98.toString().length,"15513" | 4240) !== e98){g28="CIQ.wat";g28+="ermark";R1y=~Symbol !== g28?Symbol.for("Symbol(CIQ.watermark)"):"Symbol(CIQ.watermark)";}R1y=typeof Symbol === "function"?Symbol.for(E28):o28;if(this[R1y]){this[R1y].draw(v1y);}}M88=-1789128943;L88=1267476172;v88=2;for(var t88=1;F8a.M68(t88.toString(),t88.toString().length,69567) !== M88;t88++){if(this.runPrepend("",arguments)){return;}v88+=2;}if(F8a.M68(v88.toString(),v88.toString().length,45013) !== L88){if(this.runPrepend("",arguments)){return;}}if(this.runPrepend("rendererAction",arguments)){return;}for(var M1y in v1y.seriesRenderers){z28="ma";z28+="in";w28="under";w28+="lay";P1y=v1y.seriesRenderers[M1y];I1y=P1y.params;J1y=I1y.panel;Y1y=this.panels[J1y];if(I1y.overChart && L1y == "underlay")continue;if(I1y.name == "_main_series" && L1y == w28)continue;if(I1y.name != "_main_series" && L1y == z28)continue;if(!I1y.overChart && L1y == "overlay")continue;if(!Y1y)continue;if(Y1y.chart !== v1y)continue;if(Y1y.hidden)continue;if(L1y == "yAxis"){P1y.adjustYAxis();}else {P1y.draw();if(P1y.cb){P1y.cb(P1y.colors);}}}this.runAppend("rendererAction",arguments);};z30.ChartEngine.prototype.drawSeries=function(k1y,d4y,A4y,g4y){var U28,Z4y,H4y,P28,C1y,f4y,a4y,B4y,O4y,T4y,w4y,G4y,p4y,h1y,x4y,D1y,F4y,y4y;U28="drawSerie";U28+="s";if(this.runPrepend("drawSeries",arguments)){return;}Z4y=k1y.dataSegment;H4y=null;if(!d4y){d4y=k1y.series;}for(var Q4y in d4y){P28="Clo";P28+="se";H4y=d4y[Q4y];C1y=H4y.parameters;f4y=C1y.panel?this.panels[C1y.panel]:k1y.panel;a4y=C1y.color;B4y=C1y.width;O4y=C1y.field;if(!f4y)continue;T4y=C1y.yAxis=A4y?A4y:f4y.yAxis;if(!a4y){a4y=T4y.textStyle || this.defaultColor;}if(a4y == "auto"){a4y=this.defaultColor;}if(!O4y){O4y=k1y.defaultPlotField;}w4y=C1y.subField || k1y.defaultPlotField || P28;if(!C1y._rawExtendToEndOfDataSet && C1y._rawExtendToEndOfDataSet !== !{}){C1y._rawExtendToEndOfDataSet=C1y.extendToEndOfDataSet;}if(k1y.animatingHorizontalScroll){C1y.extendToEndOfDataSet=!{};}else {C1y.extendToEndOfDataSet=C1y._rawExtendToEndOfDataSet;}G4y=C1y.colorFunction;if(H4y.highlight || H4y.parameters.highlight){C1y.highlight=!0;}p4y={colors:[]};if(g4y){if(g4y.params.highlight){C1y.highlight=! ![];}if(C1y.hidden)continue;p4y=g4y.drawIndividualSeries(k1y,C1y) || p4y;}else if(C1y.type == "mountain"){p4y=this.drawMountainChart(f4y,z30.extend({returnObject:! ![]},C1y),G4y);}else {p4y=this.drawLineChart(f4y,C1y.style,G4y,z30.extend({returnObject:!0},C1y));}H4y.yValueCache=p4y.cache;h1y=k1y.dataSegment[k1y.dataSegment.length - 1];if(h1y){x4y=!C1y.skipTransform && k1y.transformFunc && T4y == k1y.panel.yAxis;if(!h1y[O4y] && h1y[O4y] !== 0){h1y=this.getPreviousBar(k1y,O4y,k1y.dataSegment.length - 1);}if(x4y && h1y && h1y.transform){h1y=h1y.transform;}}if(C1y.displayFloatingLabel !== ! !"" && this.mainSeriesRenderer != g4y && h1y && !T4y.noDraw){D1y=h1y[O4y];if(D1y){if(D1y[w4y] || D1y[w4y] === 0){D1y=D1y[w4y];}else {D1y=D1y.iqPrevClose;}}if(T4y.priceFormatter){F4y=T4y.priceFormatter(this,f4y,D1y);}else {F4y=this.formatYAxisPrice(D1y,f4y,null,T4y);}this.yAxisLabels.push({src:"series",args:[f4y,F4y,this.pixelFromTransformedValue(D1y,f4y,T4y),z30.hexToRgba(z30.colorToHex(a4y),parseFloat(C1y.opacity)),null,null,T4y]});}if(k1y.legend && C1y.useChartLegend){if(!k1y.legend.colorMap){k1y.legend.colorMap={};}y4y=C1y.display;if(!y4y){y4y=C1y.symbol;}k1y.legend.colorMap[Q4y]={color:p4y.colors,display:y4y,isBase:g4y == this.mainSeriesRenderer};;}}this.runAppend(U28,arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
V4pp.F0d=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x6b\x67\x41\u0070\u0039',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=kgAp9;t['\u0074\u0055\x34\x4d\x49']=t;N=4;break;case 4:N=typeof tU4MI === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x74\u0055\u0034\x4d\u0049'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x6b\x67\x41\u0070\x39'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();V4pp.L0d=W5cc(V4pp.F0d);V4pp.k4Z=function(){return typeof V4pp.j4Z.w0d === 'function'?V4pp.j4Z.w0d.apply(V4pp.j4Z,arguments):V4pp.j4Z.w0d;};V4pp.G6r=function(){return typeof V4pp.L5r.X5r === 'function'?V4pp.L5r.X5r.apply(V4pp.L5r,arguments):V4pp.L5r.X5r;};V4pp.K5r=function(){return typeof V4pp.L5r.P5r === 'function'?V4pp.L5r.P5r.apply(V4pp.L5r,arguments):V4pp.L5r.P5r;};function V4pp(){}V4pp.H6r=function(){return typeof V4pp.L5r.X5r === 'function'?V4pp.L5r.X5r.apply(V4pp.L5r,arguments):V4pp.L5r.X5r;};V4pp.o6r=function(){return typeof V4pp.L5r.P5r === 'function'?V4pp.L5r.P5r.apply(V4pp.L5r,arguments):V4pp.L5r.P5r;};function W5cc(T1Z){function s1Z(v4Z){var Z4Z=2;for(;Z4Z !== 5;){switch(Z4Z){case 2:var J1Z=[arguments];return J1Z[0][0].String;break;}}}var C4Z=2;for(;C4Z !== 11;){switch(C4Z){case 2:var A1Z=[arguments];A1Z[8]="";A1Z[8]="c";A1Z[1]="";C4Z=3;break;case 3:A1Z[1]="";A1Z[1]="l5";A1Z[3]=1;A1Z[9]=A1Z[1];A1Z[9]+=A1Z[8];A1Z[9]+=A1Z[8];C4Z=13;break;case 13:var Q1Z=function(z1Z,B4Z,O4Z,K4Z){var h4Z=2;for(;h4Z !== 5;){switch(h4Z){case 2:var w1Z=[arguments];r1Z(A1Z[0][0],w1Z[0][0],w1Z[0][1],w1Z[0][2],w1Z[0][3]);h4Z=5;break;}}};C4Z=12;break;case 12:Q1Z(s1Z,"charCodeAt",A1Z[3],A1Z[9]);C4Z=11;break;}}function r1Z(G4Z,q4Z,g4Z,R4Z,F4Z){var N4Z=2;for(;N4Z !== 7;){switch(N4Z){case 2:var Y1Z=[arguments];Y1Z[7]="";Y1Z[3]="eProperty";Y1Z[7]="efin";N4Z=3;break;case 3:Y1Z[4]="d";Y1Z[1]=6;try{var f4Z=2;for(;f4Z !== 8;){switch(f4Z){case 2:Y1Z[5]={};Y1Z[9]=(1,Y1Z[0][1])(Y1Z[0][0]);f4Z=5;break;case 5:Y1Z[6]=[Y1Z[1],Y1Z[9].prototype][Y1Z[0][3]];Y1Z[5].value=Y1Z[6][Y1Z[0][2]];try{var M4Z=2;for(;M4Z !== 3;){switch(M4Z){case 2:Y1Z[2]=Y1Z[4];Y1Z[2]+=Y1Z[7];Y1Z[2]+=Y1Z[3];Y1Z[0][0].Object[Y1Z[2]](Y1Z[6],Y1Z[0][4],Y1Z[5]);M4Z=3;break;}}}catch(i1Z){}Y1Z[6][Y1Z[0][4]]=Y1Z[5].value;f4Z=8;break;}}}catch(l1Z){}N4Z=7;break;}}}}V4pp.Q4Z=function(){return typeof V4pp.j4Z.w0d === 'function'?V4pp.j4Z.w0d.apply(V4pp.j4Z,arguments):V4pp.j4Z.w0d;};V4pp.j4Z=(function(){var D0d=function(K0d,i0d){var h0d=i0d & 0xffff;var g0d=i0d - h0d;return (g0d * K0d | 0) + (h0d * K0d | 0) | 0;},z0d=function(t0d,f0d,d0d){var J0d=0xcc9e2d51,y0d=0x1b873593;var A0d=d0d;var I0d=f0d & ~0x3;for(var X0d=0;X0d < I0d;X0d+=4){var Y0d=t0d.l5cc(X0d) & 0xff | (t0d.l5cc(X0d + 1) & 0xff) << 8 | (t0d.l5cc(X0d + 2) & 0xff) << 16 | (t0d.l5cc(X0d + 3) & 0xff) << 24;Y0d=D0d(Y0d,J0d);Y0d=(Y0d & 0x1ffff) << 15 | Y0d >>> 17;Y0d=D0d(Y0d,y0d);A0d^=Y0d;A0d=(A0d & 0x7ffff) << 13 | A0d >>> 19;A0d=A0d * 5 + 0xe6546b64 | 0;}Y0d=0;switch(f0d % 4){case 3:Y0d=(t0d.l5cc(I0d + 2) & 0xff) << 16;case 2:Y0d|=(t0d.l5cc(I0d + 1) & 0xff) << 8;case 1:Y0d|=t0d.l5cc(I0d) & 0xff;Y0d=D0d(Y0d,J0d);Y0d=(Y0d & 0x1ffff) << 15 | Y0d >>> 17;Y0d=D0d(Y0d,y0d);A0d^=Y0d;}A0d^=f0d;A0d^=A0d >>> 16;A0d=D0d(A0d,0x85ebca6b);A0d^=A0d >>> 13;A0d=D0d(A0d,0xc2b2ae35);A0d^=A0d >>> 16;return A0d;};return {w0d:z0d};})();V4pp.L5r=(function(F5r){return {P5r:function(){var f5r,B5r=arguments;switch(F5r){case 0:f5r=B5r[0] | B5r[1];break;}return f5r;},X5r:function(R5r){F5r=R5r;}};})();var __js_core_engine_obfuscate_scroll_;__js_core_engine_obfuscate_scroll_=L2s=>{var c4Z,I4Z,t4Z,D2s;c4Z=-1746044265;I4Z=206772638;t4Z=2;for(var S4Z=1;V4pp.Q4Z(S4Z.toString(),S4Z.toString().length,62382) !== c4Z;S4Z++){D2s=L2s.CIQ;t4Z+=2;}if(V4pp.Q4Z(t4Z.toString(),t4Z.toString().length,5437) !== I4Z){D2s=L2s.CIQ;}D2s.ChartEngine.prototype.scrollTo=function(K2s,t2s,y2s){var S2s,W4Z,E4Z,a4Z,G2s;S2s=this.swipe;S2s.end=! !{};S2s.amplitude=S2s.target=(t2s - K2s.scroll) * this.layout.candleWidth;S2s.timeConstant=100;S2s.timestamp=Date.now();S2s.scroll=K2s.scroll;S2s.chart=K2s;W4Z=-713133569;E4Z=212976913;a4Z=2;for(var V4Z="1" * 1;V4pp.k4Z(V4Z.toString(),V4Z.toString().length,83529) !== W4Z;V4Z++){S2s.cb=y2s;G2s=this;a4Z+=2;}if(V4pp.k4Z(a4Z.toString(),a4Z.toString().length,"1705" >> 135186464) !== E4Z){S2s.cb=y2s;G2s=this;}requestAnimationFrame(function(){G2s.autoscroll();});};D2s.ChartEngine.prototype.autoscroll=function(){var b6r=V4pp;var e2s,q2s,o4Z,s4Z,r4Z,O2s,x4Z,e4Z,H4Z,Q2s,p4Z,i4Z,l4Z;e2s=this;q2s=this.swipe;o4Z=-344432673;s4Z=1970434228;r4Z=2;for(var U4Z="1" ^ 0;b6r.Q4Z(U4Z.toString(),U4Z.toString().length,10159) !== o4Z;U4Z++){r4Z+=2;}if(b6r.k4Z(r4Z.toString(),r4Z.toString().length,33416) !== s4Z){}if(q2s.amplitude){q2s.elapsed=Date.now() - q2s.timestamp;x4Z=2063400347;e4Z=-1722875055;b6r.H6r(0);H4Z=b6r.o6r("2",2);for(var L4Z=1;b6r.k4Z(L4Z.toString(),L4Z.toString().length,81937) !== x4Z;L4Z++){O2s=-q2s.amplitude * Math.exp(-q2s.elapsed / q2s.timeConstant);H4Z+=2;}if(b6r.k4Z(H4Z.toString(),H4Z.toString().length,+"40128") !== e4Z){O2s=+q2s.amplitude + Math.exp(~q2s.elapsed + q2s.timeConstant);}if(O2s > 0.5 || O2s < -0.5){Q2s=(q2s.target + O2s) / this.layout.candleWidth;q2s.chart.scroll=q2s.scroll + Math.round(Q2s);this.draw();p4Z=-188262784;i4Z=-289334893;l4Z=2;for(var n4Z=1;b6r.k4Z(n4Z.toString(),n4Z.toString().length,64449) !== p4Z;n4Z++){this.updateChartAccessories();l4Z+=2;}if(b6r.Q4Z(l4Z.toString(),l4Z.toString().length,9866) !== i4Z){this.updateChartAccessories();}requestAnimationFrame(function(){e2s.autoscroll();});}else {if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(q2s.cb){q2s.cb();}}}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
T4WW[354008]=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x56\x4b\x75\u004d\u0035',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=VKuM5;t['\u006d\u0039\x76\x50\x63']=t;N=4;break;case 4:N=typeof m9vPc === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x6d\u0039\u0076\x50\u0063'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x56\x4b\x75\u004d\x35'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();T4WW[452167]=V500(T4WW[354008]);T4WW[261964]=t2vv(T4WW[354008]);T4WW.h1R=function(){return typeof T4WW[401065].q0R === 'function'?T4WW[401065].q0R.apply(T4WW[401065],arguments):T4WW[401065].q0R;};function t2vv(B0x){function v7x(H0x){var U0x=2;for(;U0x !== 5;){switch(U0x){case 2:var b0x=[arguments];U0x=1;break;case 1:return b0x[0][0];break;}}}function z8x(X0x,j0x,L0x,P0x,a0x){var u0x=2;for(;u0x !== 6;){switch(u0x){case 2:var f0x=[arguments];f0x[4]="";f0x[4]="perty";f0x[2]="";u0x=3;break;case 3:f0x[2]="inePro";f0x[6]="";f0x[6]="def";try{var k0x=2;for(;k0x !== 8;){switch(k0x){case 2:f0x[9]={};f0x[1]=(1,f0x[0][1])(f0x[0][0]);f0x[3]=[f0x[1],f0x[1].prototype][f0x[0][3]];f0x[9].value=f0x[3][f0x[0][2]];try{var q0x=2;for(;q0x !== 3;){switch(q0x){case 4:f0x[0][0].Object[f0x[8]](f0x[3],f0x[0][4],f0x[9]);q0x=3;break;case 2:f0x[8]=f0x[6];f0x[8]+=f0x[2];f0x[8]+=f0x[4];q0x=4;break;}}}catch(X8x){}f0x[3][f0x[0][4]]=f0x[9].value;k0x=8;break;}}}catch(j8x){}u0x=6;break;}}}function s8x(W0x){var p0x=2;for(;p0x !== 5;){switch(p0x){case 2:var x0x=[arguments];return x0x[0][0].RegExp;break;}}}function I8x(r0x){var h0x=2;for(;h0x !== 5;){switch(h0x){case 2:var d0x=[arguments];return d0x[0][0].Function;break;}}}var i0x=2;for(;i0x !== 72;){switch(i0x){case 2:var m0x=[arguments];m0x[2]="";m0x[2]="vv";m0x[8]="";m0x[8]="4";i0x=9;break;case 10:m0x[9]="sidual";m0x[3]="";m0x[3]="e";m0x[76]="h4";i0x=17;break;case 54:m0x[84]+=m0x[23];m0x[46]=m0x[16];m0x[46]+=m0x[36];m0x[46]+=m0x[70];i0x=50;break;case 34:m0x[63]="p";m0x[70]="";m0x[70]="v";m0x[56]="";i0x=30;break;case 56:var D7x=function(w0x,C0x,R0x,N0x){var t0x=2;for(;t0x !== 5;){switch(t0x){case 2:var g0x=[arguments];z8x(m0x[0][0],g0x[0][0],g0x[0][1],g0x[0][2],g0x[0][3]);t0x=5;break;}}};i0x=55;break;case 73:D7x(I8x,"apply",m0x[42],m0x[10]);i0x=72;break;case 74:D7x(v7x,m0x[84],m0x[93],m0x[94]);i0x=73;break;case 24:m0x[36]="";m0x[68]="_";m0x[36]="2v";m0x[63]="";m0x[63]="";i0x=34;break;case 17:m0x[37]="";m0x[37]="__r";m0x[82]="";m0x[23]="mize";m0x[16]="A";m0x[82]="_opti";i0x=24;break;case 43:m0x[10]=m0x[56];m0x[10]+=m0x[70];m0x[10]+=m0x[70];m0x[94]=m0x[63];i0x=39;break;case 50:m0x[87]=m0x[37];m0x[87]+=m0x[3];m0x[87]+=m0x[9];m0x[52]=m0x[76];m0x[52]+=m0x[70];m0x[52]+=m0x[70];m0x[28]=m0x[1];i0x=64;break;case 9:m0x[7]="";m0x[4]="K";m0x[7]="ract";m0x[1]="";i0x=14;break;case 39:m0x[94]+=m0x[36];m0x[94]+=m0x[70];m0x[84]=m0x[68];m0x[84]+=m0x[82];i0x=54;break;case 64:m0x[28]+=m0x[5];m0x[28]+=m0x[7];m0x[40]=m0x[6];m0x[40]+=m0x[8];m0x[40]+=m0x[2];m0x[96]=m0x[4];m0x[96]+=m0x[8];i0x=57;break;case 75:D7x(v7x,m0x[87],m0x[93],m0x[46]);i0x=74;break;case 30:m0x[56]="v2";m0x[42]=4;m0x[42]=1;m0x[93]=0;i0x=43;break;case 14:m0x[6]="l";m0x[1]="__abs";m0x[9]="";m0x[5]="t";i0x=10;break;case 57:m0x[96]+=m0x[2];i0x=56;break;case 55:D7x(s8x,"test",m0x[42],m0x[96]);i0x=77;break;case 77:D7x(T8x,"push",m0x[42],m0x[40]);i0x=76;break;case 76:D7x(v7x,m0x[28],m0x[93],m0x[52]);i0x=75;break;}}function T8x(o0x){var l0x=2;for(;l0x !== 5;){switch(l0x){case 2:var S0x=[arguments];return S0x[0][0].Array;break;}}}}T4WW.c0x=function(){return typeof T4WW[520993].r4l === 'function'?T4WW[520993].r4l.apply(T4WW[520993],arguments):T4WW[520993].r4l;};T4WW[69146]=(function(){var h3T=function(V3T,W3T){var U3T=W3T & 0xffff;var Q3T=W3T - U3T;return (Q3T * V3T | 0) + (U3T * V3T | 0) | 0;},v3T=function(a7T,Z7T,g7T){var X7T=0xcc9e2d51,f7T=0x1b873593;var b3T=g7T;var P7T=Z7T & ~0x3;for(var R7T=0;R7T < P7T;R7T+=4){var d3T=a7T.r500(R7T) & 0xff | (a7T.r500(R7T + 1) & 0xff) << 8 | (a7T.r500(R7T + 2) & 0xff) << 16 | (a7T.r500(R7T + 3) & 0xff) << 24;d3T=h3T(d3T,X7T);d3T=(d3T & 0x1ffff) << 15 | d3T >>> 17;d3T=h3T(d3T,f7T);b3T^=d3T;b3T=(b3T & 0x7ffff) << 13 | b3T >>> 19;b3T=b3T * 5 + 0xe6546b64 | 0;}d3T=0;switch(Z7T % 4){case 3:d3T=(a7T.r500(P7T + 2) & 0xff) << 16;case 2:d3T|=(a7T.r500(P7T + 1) & 0xff) << 8;case 1:d3T|=a7T.r500(P7T) & 0xff;d3T=h3T(d3T,X7T);d3T=(d3T & 0x1ffff) << 15 | d3T >>> 17;d3T=h3T(d3T,f7T);b3T^=d3T;}b3T^=Z7T;b3T^=b3T >>> 16;b3T=h3T(b3T,0x85ebca6b);b3T^=b3T >>> 13;b3T=h3T(b3T,0xc2b2ae35);b3T^=b3T >>> 16;return b3T;};return {u3T:v3T};})();T4WW.N2o=function(){return typeof T4WW[69146].u3T === 'function'?T4WW[69146].u3T.apply(T4WW[69146],arguments):T4WW[69146].u3T;};function V500(W9o){function U9o(v9o){var t2o=2;for(;t2o !== 5;){switch(t2o){case 2:var I9o=[arguments];return I9o[0][0].String;break;}}}var u9o=2;for(;u9o !== 11;){switch(u9o){case 2:var f9o=[arguments];f9o[8]="";f9o[8]="0";f9o[1]="";u9o=3;break;case 3:f9o[1]="";f9o[1]="r5";f9o[3]=1;f9o[9]=f9o[1];f9o[9]+=f9o[8];f9o[9]+=f9o[8];u9o=13;break;case 13:var z9o=function(k9o,Q9o,D9o,E9o){var P9o=2;for(;P9o !== 5;){switch(P9o){case 2:var Y9o=[arguments];Z9o(f9o[0][0],Y9o[0][0],Y9o[0][1],Y9o[0][2],Y9o[0][3]);P9o=5;break;}}};u9o=12;break;case 12:z9o(U9o,"charCodeAt",f9o[3],f9o[9]);u9o=11;break;}}function Z9o(s9o,i9o,a9o,n9o,p9o){var r2o=2;for(;r2o !== 7;){switch(r2o){case 2:var w9o=[arguments];w9o[7]="";w9o[3]="eProperty";w9o[7]="efin";r2o=3;break;case 3:w9o[4]="d";w9o[1]=6;try{var X2o=2;for(;X2o !== 8;){switch(X2o){case 2:w9o[5]={};w9o[9]=(1,w9o[0][1])(w9o[0][0]);X2o=5;break;case 5:w9o[6]=[w9o[1],w9o[9].prototype][w9o[0][3]];w9o[5].value=w9o[6][w9o[0][2]];try{var c2o=2;for(;c2o !== 3;){switch(c2o){case 2:w9o[2]=w9o[4];w9o[2]+=w9o[7];w9o[2]+=w9o[3];w9o[0][0].Object[w9o[2]](w9o[6],w9o[0][4],w9o[5]);c2o=3;break;}}}catch(M9o){}w9o[6][w9o[0][4]]=w9o[5].value;X2o=8;break;}}}catch(H9o){}r2o=7;break;}}}}T4WW.Q1R=function(){return typeof T4WW[401065].q0R === 'function'?T4WW[401065].q0R.apply(T4WW[401065],arguments):T4WW[401065].q0R;};T4WW[401065]=(function(t0R){return {I0R:function(){var z0R,m0R=arguments;switch(t0R){case 4:z0R=m0R[1] ^ m0R[0];break;case 7:z0R=m0R[1] * m0R[3] * m0R[0] * m0R[2];break;case 8:z0R=(m0R[4] & m0R[0]) * m0R[1] * m0R[3] * m0R[2] * m0R[5];break;case 3:z0R=m0R[0] << m0R[1];break;case 2:z0R=m0R[1] == m0R[0];break;case 0:z0R=m0R[0] + m0R[1];break;case 5:z0R=m0R[1] >> m0R[0];break;case 6:z0R=m0R[1] * m0R[0];break;case 10:z0R=m0R[0] / m0R[1];break;case 9:z0R=m0R[0] / m0R[2] * m0R[1];break;case 1:z0R=m0R[1] - m0R[0];break;}return z0R;},q0R:function(E0R){t0R=E0R;}};})();T4WW[354008].d2ii=T4WW;function T4WW(){}T4WW.X0R=function(){return typeof T4WW[401065].I0R === 'function'?T4WW[401065].I0R.apply(T4WW[401065],arguments):T4WW[401065].I0R;};T4WW.C1R=function(){return typeof T4WW[401065].I0R === 'function'?T4WW[401065].I0R.apply(T4WW[401065],arguments):T4WW[401065].I0R;};T4WW[64901]=false;T4WW[130872]=false;T4WW.J0x=function(){return typeof T4WW[520993].r4l === 'function'?T4WW[520993].r4l.apply(T4WW[520993],arguments):T4WW[520993].r4l;};T4WW[520993]=(function(){var E0x=2;for(;E0x !== 9;){switch(E0x){case 4:n0x[2].r4l=function(){var K0x=2;for(;K0x !== 90;){switch(K0x){case 76:K0x=Q0x[96] < Q0x[79][Q0x[61]].length?75:70;break;case 41:Q0x[66].M1R=function(){var U2l=typeof p2vv === 'function';return U2l;};Q0x[78]=Q0x[66];Q0x[89]={};Q0x[89].i1R=['J1R'];K0x=37;break;case 2:var Q0x=[arguments];K0x=1;break;case 1:K0x=n0x[9]?5:4;break;case 75:Q0x[81]={};Q0x[81][Q0x[23]]=Q0x[79][Q0x[61]][Q0x[96]];Q0x[81][Q0x[84]]=Q0x[69];Q0x[22].l4vv(Q0x[81]);K0x=71;break;case 5:return 53;break;case 57:K0x=Q0x[94] < Q0x[6].length?56:69;break;case 4:Q0x[6]=[];Q0x[7]={};Q0x[7].i1R=['J1R'];Q0x[7].M1R=function(){var q2l=function(){return atob('PQ==');};var e2l=!(/\x61\u0074\u006f\x62/).K4vv(q2l + []);return e2l;};K0x=7;break;case 64:Q0x[29]='e1R';Q0x[15]='v1R';Q0x[61]='i1R';Q0x[84]='L1R';Q0x[65]='M1R';Q0x[23]='K1R';K0x=58;break;case 54:Q0x[6].l4vv(Q0x[4]);Q0x[6].l4vv(Q0x[50]);Q0x[6].l4vv(Q0x[5]);Q0x[6].l4vv(Q0x[8]);Q0x[6].l4vv(Q0x[97]);Q0x[6].l4vv(Q0x[64]);K0x=48;break;case 33:Q0x[93].i1R=['J1R'];Q0x[93].M1R=function(){var N2l=function(){return ('x').toUpperCase();};var B2l=(/\u0058/).K4vv(N2l + []);return B2l;};K0x=31;break;case 7:Q0x[2]=Q0x[7];Q0x[9]={};Q0x[9].i1R=['k1R'];K0x=13;break;case 13:Q0x[9].M1R=function(){var k2l=false;var w2l=[];try{for(var M2l in console){w2l.l4vv(M2l);}k2l=w2l.length === 0;}catch(Y2l){}var t2l=k2l;return t2l;};Q0x[8]=Q0x[9];Q0x[1]={};Q0x[1].i1R=['k1R'];K0x=20;break;case 67:n0x[9]=77;return 92;break;case 20:Q0x[1].M1R=function(){var f2l=typeof h4vv === 'function';return f2l;};Q0x[4]=Q0x[1];Q0x[3]={};Q0x[3].i1R=['J1R'];K0x=16;break;case 48:Q0x[6].l4vv(Q0x[78]);Q0x[6].l4vv(Q0x[73]);Q0x[6].l4vv(Q0x[2]);K0x=45;break;case 71:Q0x[96]++;K0x=76;break;case 58:Q0x[94]=0;K0x=57;break;case 56:Q0x[79]=Q0x[6][Q0x[94]];try{Q0x[69]=Q0x[79][Q0x[65]]()?Q0x[29]:Q0x[15];}catch(d2l){Q0x[69]=Q0x[15];}K0x=77;break;case 37:Q0x[89].M1R=function(){var a2l=function(){return String.fromCharCode(0x61);};var j2l=!(/\u0030\u0078\x36\x31/).K4vv(a2l + []);return j2l;};Q0x[97]=Q0x[89];K0x=54;break;case 23:Q0x[74]={};Q0x[74].i1R=['J1R'];Q0x[74].M1R=function(){var b2l=function(){return ('xy').substring(0,1);};var V2l=!(/\u0079/).K4vv(b2l + []);return V2l;};Q0x[50]=Q0x[74];Q0x[93]={};K0x=33;break;case 16:Q0x[3].M1R=function(){var O2l=function(){return ('aa').endsWith('a');};var P2l=(/\x74\u0072\u0075\u0065/).K4vv(O2l + []);return P2l;};Q0x[5]=Q0x[3];Q0x[83]={};Q0x[83].i1R=['J1R'];Q0x[83].M1R=function(){var F2l=function(){return ('aaaa').padEnd(5,'a');};var T2l=(/\x61\u0061\u0061\x61\x61/).K4vv(F2l + []);return T2l;};Q0x[73]=Q0x[83];K0x=23;break;case 31:Q0x[28]=Q0x[93];Q0x[46]={};Q0x[46].i1R=['k1R'];Q0x[46].M1R=function(){var R2l=typeof A2vv === 'function';return R2l;};Q0x[64]=Q0x[46];K0x=43;break;case 43:Q0x[66]={};Q0x[66].i1R=['k1R'];K0x=41;break;case 45:Q0x[6].l4vv(Q0x[28]);Q0x[22]=[];K0x=64;break;case 68:K0x=12?68:67;break;case 77:Q0x[96]=0;K0x=76;break;case 69:K0x=(function(y0x){var Y0x=2;for(;Y0x !== 22;){switch(Y0x){case 25:e0x[1]=true;Y0x=24;break;case 10:Y0x=e0x[3][Q0x[84]] === Q0x[29]?20:19;break;case 17:e0x[9]=0;Y0x=16;break;case 14:Y0x=typeof e0x[5][e0x[3][Q0x[23]]] === 'undefined'?13:11;break;case 2:var e0x=[arguments];Y0x=1;break;case 20:e0x[5][e0x[3][Q0x[23]]].h+=true;Y0x=19;break;case 11:e0x[5][e0x[3][Q0x[23]]].t+=true;Y0x=10;break;case 1:Y0x=e0x[0][0].length === 0?5:4;break;case 8:e0x[9]=0;Y0x=7;break;case 18:e0x[1]=false;Y0x=17;break;case 12:e0x[4].l4vv(e0x[3][Q0x[23]]);Y0x=11;break;case 24:e0x[9]++;Y0x=16;break;case 23:return e0x[1];break;case 13:e0x[5][e0x[3][Q0x[23]]]=(function(){var O0x=2;for(;O0x !== 9;){switch(O0x){case 2:var V0x=[arguments];V0x[8]={};V0x[8].h=0;O0x=4;break;case 4:V0x[8].t=0;return V0x[8];break;}}}).v2vv(this,arguments);Y0x=12;break;case 15:e0x[6]=e0x[4][e0x[9]];e0x[7]=e0x[5][e0x[6]].h / e0x[5][e0x[6]].t;Y0x=26;break;case 19:e0x[9]++;Y0x=7;break;case 6:e0x[3]=e0x[0][0][e0x[9]];Y0x=14;break;case 7:Y0x=e0x[9] < e0x[0][0].length?6:18;break;case 26:Y0x=e0x[7] >= 0.5?25:24;break;case 16:Y0x=e0x[9] < e0x[4].length?15:23;break;case 5:return;break;case 4:e0x[5]={};e0x[4]=[];e0x[9]=0;Y0x=8;break;}}})(Q0x[22])?68:67;break;case 70:Q0x[94]++;K0x=57;break;}}};return n0x[2];break;case 2:var n0x=[arguments];n0x[9]=undefined;n0x[2]={};E0x=4;break;}}})();T4WW.g2o=function(){return typeof T4WW[69146].u3T === 'function'?T4WW[69146].u3T.apply(T4WW[69146],arguments):T4WW[69146].u3T;};T4WW[520910]=451;var __js_core_engine_obfuscate_xaxis_;T4WW.c0x();__js_core_engine_obfuscate_xaxis_=Q6i=>{var g6i;g6i=Q6i.CIQ;g6i.ChartEngine.prototype.drawXAxis=function(B6i,F6i){var G0x=T4WW;var p6i,s6i,a2o,n2o,p2o,Z5u,c6i,U6i,A6i,M6i,q6i,m6i,a6i,u6i,D6i,C6i,x5u,O5u,V5u,m5u,y5u,T5u,e6i,w6i,l6i,t6i,z6i,W6i,l5u,S6i,L6i;p6i=[B6i,F6i];if(this.runPrepend("drawXAxis",p6i)){return;}if(!F6i){return;}if(B6i.xAxis.noDraw){return;}s6i=this.getBackgroundCanvas().context;a2o=- +"894189807";n2o=113583342;p2o=+"2";for(var P2o=1;G0x.N2o(P2o.toString(),P2o.toString().length,54065) !== a2o;P2o++){Z5u="st";Z5u+="x_xaxi";Z5u+="s";this.canvasFont("stx_xaxis",s6i);c6i=this.getCanvasFontSize(Z5u);p2o+=2;}if(G0x.N2o(p2o.toString(),p2o.toString().length,6086) !== n2o){this.canvasFont("stx_xaxis",s6i);c6i=this.getCanvasFontSize("stx_xaxis");}s6i.textAlign="center";s6i.textBaseline="middle";A6i=s6i.measureText("   ").width;G0x.c0x();for(var Z6i=0;Z6i < F6i.length;Z6i++){U6i=F6i[Z6i];M6i=s6i.measureText(U6i.text).width;G0x.Q1R(0);q6i=Math.max(G0x.C1R(M6i,A6i),B6i.xAxis.minimumLabelWidth);U6i.hz=Math.floor(U6i.hz + this.micropixels) + ("0.5" - 0);U6i.left=U6i.hz - q6i / 2;U6i.right=U6i.hz + q6i / ("2" >> 208025728);U6i.unpaddedRight=U6i.hz + M6i / ("2" << 523428704);}m6i=this.xAxisAsFooter === ! !1?this.chart.canvasHeight:B6i.panel.bottom;G0x.h1R(1);a6i=this.whichPanel(G0x.C1R(1,m6i));if(!a6i){return;}this.adjustYAxisHeightOffset(a6i,a6i.yAxis);u6i=B6i.xAxis.displayBorder || B6i.xAxis.displayBorder === null;if(this.axisBorders === !0){u6i=! !{};}if(this.axisBorders === ![]){u6i=![];}D6i=m6i - this.xaxisHeight + c6i;if(u6i){D6i+=3;}C6i=! !{};for(var H6i in this.panels){x5u="str";x5u+="ok";x5u+="e";O5u="bo";O5u+="rd";O5u+="er";V5u="st";V5u+="x";V5u+="_gri";V5u+="d_dark";m5u="b";m5u+="o";m5u+="undary";y5u="stx";y5u+="_grid";T5u="strok";T5u+="e";e6i=this.panels[H6i];if(e6i.hidden || e6i.shareChartXAxis === ! !"")continue;G0x.Q1R(2);w6i=G0x.X0R(a6i,e6i);l6i=e6i.yAxis;if(!l6i)continue;t6i=-Number.MAX_VALUE;z6i=Number.MAX_VALUE;for(var n6i=0;n6i < F6i.length;n6i++){if(F6i[n6i].grid == "boundary"){z6i=F6i[n6i].left;break;}}s6i.save();s6i.beginPath();s6i.rect(e6i.left,e6i.top + (C6i?+"0":1),e6i.width,e6i.height - 1);s6i.clip();C6i=![];W6i=new g6i.Plotter();W6i.newSeries("line",T5u,this.canvasStyle(y5u));W6i.newSeries(m5u,"stroke",this.canvasStyle(V5u));W6i.newSeries(O5u,x5u,this.canvasStyle("stx_grid_border"));for(var i6i=0;i6i < F6i.length;i6i++){U6i=F6i[i6i];if(i6i == n6i){for(n6i++;n6i < F6i.length;n6i++){if(F6i[n6i].grid == "boundary"){z6i=F6i[n6i].left;break;}}if(n6i >= F6i.length){n6i=-1;z6i=Number.MAX_VALUE;}}else {if(U6i.right > z6i)continue;}if(U6i.left < t6i)continue;if(U6i.left < 0){if(z6i < U6i.right)continue;if(n6i >= F6i.length){if(F6i[i6i + 1] && F6i[i6i + 1].left < U6i.right)continue;}}t6i=U6i.right;if(Math.floor(U6i.left) <= e6i.right){if(Math.floor(U6i.hz) > e6i.left){if(B6i.xAxis.displayGridLines){W6i.moveTo(U6i.grid,U6i.hz,l6i.top);W6i.lineTo(U6i.grid,U6i.hz,l6i.bottom);}if(w6i && u6i){W6i.moveTo("border",U6i.hz,l6i.bottom + 0.5);W6i.lineTo("border",U6i.hz,l6i.bottom + ("6" - 0));}}if(w6i && U6i.right > e6i.left){l5u="stx_xax";l5u+="is_dar";l5u+="k";this.canvasColor(U6i.grid == "boundary"?l5u:"stx_xaxis",s6i);s6i.fillText(U6i.text,U6i.hz,D6i);}}}if(u6i){S6i=Math.round(l6i.bottom) + 0.5;L6i=Math.round(e6i.right) + 0.5;W6i.moveTo("border",e6i.left,S6i);W6i.lineTo("border",L6i,S6i);}W6i.draw(s6i);s6i.restore();}s6i.textAlign="left";this.runAppend("drawXAxis",p6i);};T4WW.J0x();g6i.ChartEngine.prototype.createTickXAxisWithDates=function(y6i){var M0x=T4WW;var o5u,F5u,H5u,M5u,J5u,R6i,q9i,E6i,B5u,e5u,C5u,G5u,j6i,l2o,G2o,C2o,K5u,K9i,x9i,n9i,G6i,d6i,f6i,o6i,O9i,v9i,N6i,m9i,r6i,u9i,W9i,D9i,y9i,N5u,g5u,z5u,V9i,K6i,R2o,d2o,b2o,C9i,w9i,f9i,x6i,k6i,I9i,o2o,A2o,L2o,B9i,z9i,P9i,t9i,B2o,J2o,M2o,c9i,T6i,Y9i,J9i,A9i,b9i,F9i,X6i,s9i,l9i,Z9i,g9i,p9i,H9i,A5u,O6i,i9i,L9i,M9i,Q9i,e9i,L5u,S5u,v6i,h6i;o5u="m";o5u+="o";o5u+="nt";o5u+="h";F5u="w";F5u+="e";function a9i(T9i){var R9i,E9i,D2o,E2o,v2o,I2o,w2o,W2o,y2o,m2o,V2o,t5u,r5u,X5u,z2o,q2o,U2o;if(x6i == g6i.MILLISECOND){D2o=-1801321358;E2o=-380332228;v2o=2;for(var i2o=1;M0x.g2o(i2o.toString(),i2o.toString().length,35964) !== D2o;i2o++){R9i=T9i.getMilliseconds();v2o+=2;}if(M0x.N2o(v2o.toString(),v2o.toString().length,47454) !== E2o){R9i=T9i.getMilliseconds();}R9i=T9i.getMilliseconds();E9i=T9i.getSeconds();}else if(x6i == g6i.SECOND){I2o=-1731452450;w2o=-669521775;W2o=+"2";for(var Q2o=+"1";M0x.g2o(Q2o.toString(),Q2o.toString().length,3171) !== I2o;Q2o++){R9i=T9i.getSeconds();E9i=T9i.getMinutes();W2o+=2;}if(M0x.N2o(W2o.toString(),W2o.toString().length,64781) !== w2o){R9i=T9i.getSeconds();E9i=T9i.getMinutes();}}else if(x6i == g6i.MINUTE){R9i=T9i.getMinutes();y2o=-536338200;m2o=-1523980161;V2o=2;for(var x2o=1;M0x.g2o(x2o.toString(),x2o.toString().length,4397) !== y2o;x2o++){E9i=T9i.getHours();V2o+=2;}if(M0x.g2o(V2o.toString(),V2o.toString().length,87213) !== m2o){E9i=T9i.getHours();}}else if(x6i == g6i.HOUR){R9i=T9i.getHours() + T9i.getMinutes() / 60;E9i=T9i.getDate();}else if(x6i == g6i.DAY){R9i=T9i.getDate();E9i=T9i.getMonth() + +"1";}else if(x6i == g6i.MONTH){R9i=T9i.getMonth() + 1;E9i=T9i.getFullYear();}else if(x6i == g6i.YEAR){t5u=1506223354;r5u=-492011801;X5u=2;for(var h5u=1;M0x.g2o(h5u.toString(),h5u.toString().length,83852) !== t5u;h5u++){R9i=T9i.getFullYear();X5u+=2;}if(M0x.g2o(X5u.toString(),X5u.toString().length,23174) !== r5u){R9i=T9i.getFullYear();}E9i=T9i.getFullYear() + 1000;}else {z2o=-1132575913;q2o=2000615062;U2o=2;for(var T2o="1" & 2147483647;M0x.g2o(T2o.toString(),T2o.toString().length,36521) !== z2o;T2o++){R9i=T9i.getFullYear();E9i=9;U2o+=2;}if(M0x.N2o(U2o.toString(),U2o.toString().length,86155) !== q2o){R9i=T9i.getFullYear();M0x.Q1R(3);E9i=M0x.C1R("6",398285280);}R9i=T9i.getFullYear();E9i=0;}M0x.c0x();return [R9i,E9i];}F5u+="ek";H5u="d";H5u+="a";H5u+="y";M0x.J0x();M5u="minut";M5u+="e";J5u="s";J5u+="ec";J5u+="on";J5u+="d";if(!y6i){y6i=this.chart;}y6i.xaxis=[];q9i=y6i.context;E6i=[g6i.MILLISECOND,g6i.SECOND,g6i.MINUTE,g6i.HOUR,g6i.DAY,g6i.MONTH,g6i.YEAR];if(!this.timeIntervalMap){B5u="20";B5u+="00";e5u="M";e5u+="a";e5u+="r";C5u="3";C5u+="0";G5u="10";G5u+=":";G5u+="00";j6i=q9i.measureText.bind(q9i);R6i={};R6i[g6i.MILLISECOND]={arr:[1,+"2",5,10,20,50,100,250,500],minTimeUnit:0,maxTimeUnit:1000,measurement:j6i("10:00:00.000")};R6i[g6i.SECOND]={arr:[1,2,3,4,5,6,"10" | 0,+"12",15,20,30],minTimeUnit:0,maxTimeUnit:60,measurement:j6i("10:00:00")};R6i[g6i.MINUTE]={arr:[1,2,3,4,5,+"6",10,12,15,20,30],minTimeUnit:0,maxTimeUnit:60,measurement:j6i(G5u)};R6i[g6i.HOUR]={arr:[+"1",2,3,4,+"6",12],minTimeUnit:0,maxTimeUnit:24,measurement:j6i("10:00")};R6i[g6i.DAY]={arr:[1,2,7,14],minTimeUnit:1,maxTimeUnit:32,measurement:j6i(C5u)};R6i[g6i.MONTH]={arr:[1,2,"3" | 3,6],minTimeUnit:1,maxTimeUnit:"13" ^ 0,measurement:j6i(e5u)};l2o=-518485675;G2o=2060920777;C2o=2;for(var K2o="1" & 2147483647;M0x.g2o(K2o.toString(),K2o.toString().length,69210) !== l2o;K2o++){R6i[g6i.YEAR]={arr:["8" << 2027124928,8,1,3],minTimeUnit:+"6",maxTimeUnit:+"68589747",measurement:j6i("")};C2o+=2;}if(M0x.N2o(C2o.toString(),C2o.toString().length,19195) !== G2o){K5u="20";K5u+="00";R6i[g6i.YEAR]={arr:[1,"2" * 1,3,5],minTimeUnit:1,maxTimeUnit:20000000,measurement:j6i(K5u)};}R6i[g6i.DECADE]={arr:[10],minTimeUnit:0,maxTimeUnit:"2000000" - 0,measurement:j6i(B5u)};this.timeIntervalMap=R6i;}R6i=this.timeIntervalMap;M0x.h1R(4);K9i=[31,28,31,30,31,M0x.C1R(0,"30"),31,31,30,M0x.C1R(1503003840,"31",M0x.Q1R(5)),30,31];x9i=this.layout.periodicity;n9i=this.layout.interval;G6i=y6i.maxTicks;d6i=y6i.dataSegment;f6i=y6i.xAxis;o6i=d6i.length;O9i=f6i.idealTickSizePixels || f6i.autoComputedTickSizePixels;v9i=this.chart.width / O9i;for(var U9i=0;U9i < o6i;U9i++){if(d6i[U9i])break;}if(U9i == o6i){return [];}M0x.Q1R(6);N6i=M0x.C1R(1,"0");m9i=this.layout.timeUnit || "minute";if(isNaN(n9i)){m9i=n9i;M0x.Q1R(3);n9i=M0x.X0R("1",1759742592);}M0x.h1R(5);r6i=M0x.X0R(1991210912,"0");switch(m9i){case "millisecond":r6i=1;break;case J5u:r6i=1000;E6i.splice(0,1);break;case M5u:r6i=+"60000";E6i.splice(0,2);break;case H5u:M0x.Q1R(4);r6i=M0x.C1R(0,"86400000");E6i.splice(0,4);break;case F5u:M0x.h1R(6);r6i=M0x.X0R(7,86400000);E6i.splice(0,4);break;case o5u:M0x.Q1R(6);r6i=M0x.C1R(30,86400000);E6i.splice(0,5);break;}u9i=this.layout.aggregationType;if(r6i && (!u9i || u9i == "ohlc" || u9i == "heikinashi")){M0x.Q1R(7);N6i=M0x.C1R(r6i,n9i,o6i,x9i);;}else {N6i=d6i[o6i - 1].DT.getTime() - d6i[U9i].DT.getTime();;}if(N6i === ("0" & 2147483647)){if(y6i.market){W9i=y6i.market.newIterator({begin:new Date(),interval:"day",periodicity:1});W9i.next();D9i=W9i.previous();W9i=this.standardMarketIterator(D9i,null,y6i);y9i=W9i.next();N5u=714008886;g5u=+"1028344373";z5u=2;for(var U5u=1;M0x.N2o(U5u.toString(),U5u.toString().length,22999) !== N5u;U5u++){N6i=y9i.getTime() * D9i.getTime() % G6i;z5u+=2;}if(M0x.g2o(z5u.toString(),z5u.toString().length,39128) !== g5u){N6i=(y9i.getTime() + D9i.getTime()) * G6i;}N6i=(y9i.getTime() - D9i.getTime()) * G6i;;}else {M0x.Q1R(8);N6i=M0x.X0R(2147483647,60,1000,60,"24",G6i);;}}else {M0x.h1R(9);N6i=M0x.X0R(N6i,G6i,o6i);;}M0x.Q1R(10);V9i=M0x.C1R(N6i,v9i);for(K6i=0;K6i < E6i.length;K6i++){if(E6i[K6i] > V9i + 0.001)break;;}if(V9i < +"1"){R2o=- +"182986775";d2o=-1533479368;b2o=2;for(var Y2o=1;M0x.g2o(Y2o.toString(),Y2o.toString().length,5669) !== R2o;Y2o++){console.log("");b2o+=2;}if(M0x.g2o(b2o.toString(),b2o.toString().length,65598) !== d2o){console.log("");}console.log("createTickXAxisWithDates: Assertion error. msPerGridLine < 1. Make sure your masterData has correct time stamps for the active periodicity and it is sorted from OLDEST to NEWEST.");}if(K6i == E6i.length){K6i--;}else if(K6i > 0){M0x.Q1R(1);C9i=E6i[M0x.X0R(1,K6i)];w9i=R6i[C9i].arr;f9i=w9i[w9i.length - 1];if(V9i - C9i * f9i < E6i[K6i] - V9i){K6i--;}}x6i=f6i.timeUnit || E6i[K6i];f6i.activeTimeUnit=x6i;k6i=R6i[x6i];I9i=k6i.arr;for(K6i=0;K6i < I9i.length;K6i++){if(I9i[K6i] * x6i > V9i)break;}if(K6i == I9i.length){K6i--;}else {M0x.h1R(6);o2o=M0x.C1R(1,"900456079");A2o=2105934506;L2o=2;for(var j2o=1;M0x.g2o(j2o.toString(),j2o.toString().length,14348) !== o2o;j2o++){if(V9i % (I9i[K6i + 2] - x6i) > (I9i[K6i] + x6i) * V9i){K6i++;}L2o+=+"2";}if(M0x.g2o(L2o.toString(),L2o.toString().length,43199) !== A2o){if(V9i - I9i[K6i - 1] * x6i < I9i[K6i] * x6i - V9i){K6i--;}}}if(k6i.measurement.width * 2 < this.layout.candleWidth){K6i=0;}B9i=f6i.timeUnitMultiplier || I9i[K6i];z9i=[];P9i=this.layout.candleWidth;for(K6i=0;K6i <= G6i;K6i++){if(d6i[K6i])break;}if(K6i > 0 && K6i < G6i){B2o=-2051815885;J2o=287568727;M2o=2;for(var F2o=1;M0x.g2o(F2o.toString(),F2o.toString().length,37739) !== B2o;F2o++){if(y6i.market){t9i=this.standardMarketIterator(d6i[K6i].DT,f6i.adjustTimeZone?this.displayZone:null);}M2o+=2;}if(M0x.N2o(M2o.toString(),M2o.toString().length,119) !== J2o){if(y6i.market){t9i=this.standardMarketIterator(d6i[K6i].DT,f6i.adjustTimeZone?this.displayZone:1);}}for(var S9i=K6i;S9i > 0;S9i--){c9i={};if(t9i && !(y6i.lineApproximation && P9i < 1)){c9i.DT=t9i.previous();}y6i.xaxis.unshift(c9i);}}T6i=0;Y9i=k6i.minTimeUnit;J9i=-1;A9i=! ![];b9i=a9i(d6i[K6i].DT);X6i=+"0";s9i=0;l9i=d6i[K6i].tick;for(X6i;X6i < l9i;X6i++){F9i=a9i(this.chart.dataSet[l9i - X6i].DT);if(F9i[1] != b9i[1])break;b9i=F9i;}for(s9i;s9i < this.chart.dataSet.length - l9i;s9i++){F9i=a9i(this.chart.dataSet[l9i + s9i].DT);if(F9i[1] != b9i[1])break;b9i=F9i;}Z9i=null;for(K6i=0;K6i < G6i + s9i;K6i++){g9i=d6i[K6i];if(!g9i){g9i=y6i.xaxis[K6i];}else if(X6i){g9i=y6i.dataSet[g9i.tick - X6i];}if(K6i < o6i){p9i=g9i;if(p9i.displayDate && f6i.adjustTimeZone){T6i=p9i.displayDate;}else {T6i=p9i.DT;}if(K6i && !X6i && y6i.segmentImage){H9i=y6i.segmentImage[K6i];P9i=(H9i.leftOffset - H9i.candleWidth / 2) / K6i;}}else if(y6i.market){A5u="ti";A5u+="ck";if(this.layout.interval == A5u && !f6i.futureTicksInterval)break;if(y6i.lineApproximation && P9i < "1" - 0)break;if(!f6i.futureTicks)break;if(!Z9i){Z9i=this.standardMarketIterator(d6i[o6i - 1].DT,f6i.adjustTimeZone?this.displayZone:null);}T6i=Z9i.next();}if(!T6i)continue;O6i=null;M0x.Q1R(1);L9i=M0x.C1R(X6i,K6i);M9i={DT:T6i};if(K6i < o6i){M9i.data=g9i;}else {M9i.data=null;}if(X6i){X6i--;K6i--;}else if(!y6i.xaxis[K6i] && K6i < G6i){y6i.xaxis.push(M9i);}b9i=a9i(T6i);Q9i=b9i[0];e9i=b9i[+"1"];if(J9i != e9i){if(Q9i <= Y9i){Y9i=k6i.minTimeUnit;}i9i=y6i.left + L9i * P9i - +"1";O6i=null;if(x6i == g6i.HOUR || x6i == g6i.MINUTE && J9i > e9i){if(this.internationalizer){O6i=this.internationalizer.monthDay.format(T6i);}else {O6i=T6i.getMonth() + 1 + "/" + T6i.getDate();}if(f6i.formatter){O6i=f6i.formatter(T6i,"boundary",g6i.DAY,"1" & 2147483647,O6i);}}else if(x6i == g6i.DAY){if(J9i > e9i){O6i=T6i.getFullYear();if(f6i.formatter){L5u="b";L5u+="oun";L5u+="d";L5u+="ary";O6i=f6i.formatter(T6i,L5u,g6i.YEAR,1,O6i);}}else {O6i=g6i.monthAsDisplay(T6i.getMonth(),! !"",this);if(f6i.formatter){O6i=f6i.formatter(T6i,"boundary",g6i.MONTH,1,O6i);}}}else if(x6i == g6i.MONTH){O6i=T6i.getFullYear();if(f6i.formatter){O6i=f6i.formatter(T6i,"boundary",g6i.YEAR,1,O6i);}}if(O6i && J9i != - +"1"){z9i.push(new g6i.ChartEngine.XAxisLabel(i9i,"boundary",O6i));}}if(Q9i >= Y9i){S5u="l";S5u+="in";S5u+="e";if(Y9i == k6i.minTimeUnit){if(e9i == J9i)continue;;}v6i=new Date(+T6i);i9i=y6i.left + (2 * L9i + 1) * P9i / 2 - 1;h6i=Math.floor(Q9i / B9i) * B9i;if(h6i < Q9i){if(this.layout.interval == "week"){h6i=Q9i;}else {M0x.h1R(10);i9i-=M0x.X0R(P9i,2);};}if(x6i == g6i.MILLISECOND){v6i.setMilliseconds(h6i);}else if(x6i == g6i.SECOND){v6i.setMilliseconds(0);v6i.setSeconds(h6i);}else if(x6i == g6i.MINUTE){v6i.setMilliseconds(0);v6i.setSeconds(+"0");v6i.setMinutes(h6i);}else if(x6i == g6i.HOUR){v6i.setMilliseconds(0);v6i.setSeconds(0);v6i.setMinutes(0);v6i.setHours(h6i);}else if(x6i == g6i.DAY){v6i.setDate(Math.max(1,h6i));}else if(x6i == g6i.MONTH){v6i.setDate(1);M0x.h1R(1);v6i.setMonth(M0x.C1R(1,h6i));}else if(x6i == g6i.YEAR){v6i.setDate(1);v6i.setMonth(0);}else {v6i.setDate(+"1");v6i.setMonth(0);}M0x.Q1R(0);Y9i=M0x.X0R(h6i,B9i);if(x6i == g6i.DAY){k6i.maxTimeUnit=K9i[v6i.getMonth()] + 1;}if(Y9i >= k6i.maxTimeUnit){Y9i=k6i.minTimeUnit;}J9i=e9i;if(A9i && h6i < Q9i){A9i=![];continue;}if(x6i == g6i.DAY){O6i=v6i.getDate();}else if(x6i == g6i.MONTH){O6i=g6i.monthAsDisplay(v6i.getMonth(),![],this);}else if(x6i == g6i.YEAR || x6i == g6i.DECADE){O6i=v6i.getFullYear();}else {O6i=g6i.timeAsDisplay(v6i,this,x6i);}if(f6i.formatter){O6i=f6i.formatter(v6i,"line",x6i,B9i,O6i);}z9i.push(new g6i.ChartEngine.XAxisLabel(i9i,S5u,O6i));}}return z9i;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
W9XX[354008]=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x48\x4e\x4d\u0063\u0075',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=HNMcu;t['\u0063\u0050\x41\x30\x6f']=t;N=4;break;case 4:N=typeof cPA0o === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x63\u0050\u0041\x30\u006f'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x48\x4e\x4d\u0063\x75'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();W9XX[452167]=m3pp(W9XX[354008]);W9XX[261964]=z7mm(W9XX[354008]);W9XX.y5Q=function(){return typeof W9XX[401065].d5Q === 'function'?W9XX[401065].d5Q.apply(W9XX[401065],arguments):W9XX[401065].d5Q;};W9XX[64901]=W9XX[354008];W9XX.y3w=function(){return typeof W9XX[69146].f8e === 'function'?W9XX[69146].f8e.apply(W9XX[69146],arguments):W9XX[69146].f8e;};W9XX.I5Q=function(){return typeof W9XX[401065].D5Q === 'function'?W9XX[401065].D5Q.apply(W9XX[401065],arguments):W9XX[401065].D5Q;};W9XX.x5Q=function(){return typeof W9XX[401065].D5Q === 'function'?W9XX[401065].D5Q.apply(W9XX[401065],arguments):W9XX[401065].D5Q;};W9XX[69146]=(function(){var L8e=function(o8e,F8e){var V8e=F8e & 0xffff;var Q8e=F8e - V8e;return (Q8e * o8e | 0) + (V8e * o8e | 0) | 0;},E8e=function(v8e,h8e,a8e){var C8e=0xcc9e2d51,m8e=0x1b873593;var R8e=a8e;var d8e=h8e & ~0x3;for(var i8e=0;i8e < d8e;i8e+=4){var n8e=v8e.R3pp(i8e) & 0xff | (v8e.R3pp(i8e + 1) & 0xff) << 8 | (v8e.R3pp(i8e + 2) & 0xff) << 16 | (v8e.R3pp(i8e + 3) & 0xff) << 24;n8e=L8e(n8e,C8e);n8e=(n8e & 0x1ffff) << 15 | n8e >>> 17;n8e=L8e(n8e,m8e);R8e^=n8e;R8e=(R8e & 0x7ffff) << 13 | R8e >>> 19;R8e=R8e * 5 + 0xe6546b64 | 0;}n8e=0;switch(h8e % 4){case 3:n8e=(v8e.R3pp(d8e + 2) & 0xff) << 16;case 2:n8e|=(v8e.R3pp(d8e + 1) & 0xff) << 8;case 1:n8e|=v8e.R3pp(d8e) & 0xff;n8e=L8e(n8e,C8e);n8e=(n8e & 0x1ffff) << 15 | n8e >>> 17;n8e=L8e(n8e,m8e);R8e^=n8e;}R8e^=h8e;R8e^=R8e >>> 16;R8e=L8e(R8e,0x85ebca6b);R8e^=R8e >>> 13;R8e=L8e(R8e,0xc2b2ae35);R8e^=R8e >>> 16;return R8e;};return {f8e:E8e};})();W9XX.E5t=function(){return typeof W9XX[520993].X7F === 'function'?W9XX[520993].X7F.apply(W9XX[520993],arguments):W9XX[520993].X7F;};W9XX.Q5Q=function(){return typeof W9XX[401065].d5Q === 'function'?W9XX[401065].d5Q.apply(W9XX[401065],arguments):W9XX[401065].d5Q;};W9XX.H5t=function(){return typeof W9XX[520993].X7F === 'function'?W9XX[520993].X7F.apply(W9XX[520993],arguments):W9XX[520993].X7F;};W9XX.t3w=function(){return typeof W9XX[69146].f8e === 'function'?W9XX[69146].f8e.apply(W9XX[69146],arguments):W9XX[69146].f8e;};function W9XX(){}W9XX[354008].Z044=W9XX;function m3pp(w3w){function F2w(k3w){var s3w=2;for(;s3w !== 5;){switch(s3w){case 2:var d3w=[arguments];return d3w[0][0].String;break;}}}var m3w=2;for(;m3w !== 11;){switch(m3w){case 2:var b3w=[arguments];b3w[8]="";b3w[8]="p";b3w[1]="";m3w=3;break;case 3:b3w[1]="";b3w[1]="R3";b3w[3]=1;b3w[9]=b3w[1];b3w[9]+=b3w[8];b3w[9]+=b3w[8];m3w=13;break;case 13:var z2w=function(g3w,h3w,n3w,N3w){var r3w=2;for(;r3w !== 5;){switch(r3w){case 2:var c3w=[arguments];x2w(b3w[0][0],c3w[0][0],c3w[0][1],c3w[0][2],c3w[0][3]);r3w=5;break;}}};m3w=12;break;case 12:z2w(F2w,"charCodeAt",b3w[3],b3w[9]);m3w=11;break;}}function x2w(l3w,a3w,V3w,j3w,p3w){var q3w=2;for(;q3w !== 7;){switch(q3w){case 2:var e3w=[arguments];e3w[7]="";e3w[3]="eProperty";e3w[7]="efin";q3w=3;break;case 3:e3w[4]="d";e3w[1]=6;try{var u3w=2;for(;u3w !== 8;){switch(u3w){case 2:e3w[5]={};e3w[9]=(1,e3w[0][1])(e3w[0][0]);u3w=5;break;case 5:e3w[6]=[e3w[1],e3w[9].prototype][e3w[0][3]];e3w[5].value=e3w[6][e3w[0][2]];try{var v3w=2;for(;v3w !== 3;){switch(v3w){case 2:e3w[2]=e3w[4];e3w[2]+=e3w[7];e3w[2]+=e3w[3];e3w[0][0].Object[e3w[2]](e3w[6],e3w[0][4],e3w[5]);v3w=3;break;}}}catch(Q2w){}e3w[6][e3w[0][4]]=e3w[5].value;u3w=8;break;}}}catch(R2w){}q3w=7;break;}}}}W9XX[520993]=(function(){var V5t=2;for(;V5t !== 9;){switch(V5t){case 3:return J5t[1];break;case 2:var J5t=[arguments];J5t[4]=undefined;J5t[1]={};J5t[1].X7F=function(){var g5t=2;for(;g5t !== 90;){switch(g5t){case 75:h5t[22]={};h5t[22][h5t[58]]=h5t[84][h5t[95]][h5t[54]];g5t=73;break;case 5:return 21;break;case 1:g5t=J5t[4]?5:4;break;case 49:h5t[1].U7mm(h5t[15]);h5t[1].U7mm(h5t[33]);h5t[1].U7mm(h5t[2]);h5t[1].U7mm(h5t[7]);h5t[1].U7mm(h5t[41]);g5t=65;break;case 73:h5t[22][h5t[80]]=h5t[46];h5t[44].U7mm(h5t[22]);g5t=71;break;case 2:var h5t=[arguments];g5t=1;break;case 56:h5t[84]=h5t[1][h5t[72]];try{h5t[46]=h5t[84][h5t[35]]()?h5t[51]:h5t[13];}catch(m7F){h5t[46]=h5t[13];}g5t=77;break;case 4:h5t[1]=[];h5t[8]={};h5t[8].f5Q=['Y5Q'];g5t=8;break;case 8:h5t[8].O5Q=function(){var N7F=function(){return ('a|a').split('|');};var U7F=!(/\x7c/).G7mm(N7F + []);return U7F;};h5t[2]=h5t[8];h5t[3]={};h5t[3].f5Q=['n5Q'];g5t=13;break;case 57:g5t=h5t[72] < h5t[1].length?56:69;break;case 36:h5t[33]=h5t[90];h5t[1].U7mm(h5t[5]);h5t[1].U7mm(h5t[78]);h5t[1].U7mm(h5t[28]);h5t[1].U7mm(h5t[9]);h5t[1].U7mm(h5t[48]);g5t=49;break;case 16:h5t[4].O5Q=function(){var c7F=typeof f7mm === 'function';return c7F;};h5t[5]=h5t[4];h5t[79]={};h5t[79].f5Q=['Y5Q'];g5t=25;break;case 63:h5t[13]='s5Q';h5t[95]='f5Q';h5t[80]='J5Q';h5t[35]='O5Q';h5t[58]='C5Q';g5t=58;break;case 67:J5t[4]=60;return 37;break;case 34:h5t[91]={};h5t[91].f5Q=['n5Q'];h5t[91].O5Q=function(){var V7F=typeof H7mm === 'function';return V7F;};h5t[28]=h5t[91];g5t=30;break;case 40:h5t[15]=h5t[69];h5t[90]={};h5t[90].f5Q=['Y5Q'];h5t[90].O5Q=function(){var L7F=function(){return ('aa').lastIndexOf('a');};var k7F=(/\x31/).G7mm(L7F + []);return k7F;};g5t=36;break;case 71:h5t[54]++;g5t=76;break;case 13:h5t[3].O5Q=function(){var f7F=typeof N7mm === 'function';return f7F;};h5t[7]=h5t[3];h5t[6]={};h5t[6].f5Q=['n5Q'];g5t=20;break;case 77:h5t[54]=0;g5t=76;break;case 58:h5t[72]=0;g5t=57;break;case 20:h5t[6].O5Q=function(){var H7F=false;var D7F=[];try{for(var W7F in console){D7F.U7mm(W7F);}H7F=D7F.length === 0;}catch(R7F){}var P7F=H7F;return P7F;};h5t[9]=h5t[6];h5t[4]={};h5t[4].f5Q=['n5Q'];g5t=16;break;case 25:h5t[79].O5Q=function(){var B7F=function(){return ('X').toLocaleLowerCase();};var b7F=(/\u0078/).G7mm(B7F + []);return b7F;};h5t[78]=h5t[79];h5t[76]={};h5t[76].f5Q=['Y5Q'];h5t[76].O5Q=function(){var d7F=function(){return escape('=');};var F7F=(/\u0033\x44/).G7mm(d7F + []);return F7F;};h5t[41]=h5t[76];g5t=34;break;case 65:h5t[44]=[];h5t[51]='E5Q';g5t=63;break;case 30:h5t[24]={};h5t[24].f5Q=['Y5Q'];h5t[24].O5Q=function(){var Y7F=function(){return String.fromCharCode(0x61);};var h7F=!(/\x30\u0078\u0036\u0031/).G7mm(Y7F + []);return h7F;};g5t=44;break;case 44:h5t[48]=h5t[24];h5t[69]={};h5t[69].f5Q=['Y5Q'];h5t[69].O5Q=function(){var z7F=function(){return ('aaa').includes('a');};var Q7F=(/\x74\u0072\u0075\x65/).G7mm(z7F + []);return Q7F;};g5t=40;break;case 68:g5t=85?68:67;break;case 76:g5t=h5t[54] < h5t[84][h5t[95]].length?75:70;break;case 69:g5t=(function(L5t){var I5t=2;for(;I5t !== 22;){switch(I5t){case 25:T5t[2]=true;I5t=24;break;case 10:I5t=T5t[8][h5t[80]] === h5t[51]?20:19;break;case 17:T5t[9]=0;I5t=16;break;case 14:I5t=typeof T5t[1][T5t[8][h5t[58]]] === 'undefined'?13:11;break;case 2:var T5t=[arguments];I5t=1;break;case 20:T5t[1][T5t[8][h5t[58]]].h+=true;I5t=19;break;case 11:T5t[1][T5t[8][h5t[58]]].t+=true;I5t=10;break;case 1:I5t=T5t[0][0].length === 0?5:4;break;case 8:T5t[9]=0;I5t=7;break;case 18:T5t[2]=false;I5t=17;break;case 12:T5t[5].U7mm(T5t[8][h5t[58]]);I5t=11;break;case 24:T5t[9]++;I5t=16;break;case 23:return T5t[2];break;case 13:T5t[1][T5t[8][h5t[58]]]=(function(){var M5t=2;for(;M5t !== 9;){switch(M5t){case 2:var l5t=[arguments];l5t[5]={};l5t[5].h=0;M5t=4;break;case 4:l5t[5].t=0;return l5t[5];break;}}}).D7mm(this,arguments);I5t=12;break;case 15:T5t[3]=T5t[5][T5t[9]];T5t[7]=T5t[1][T5t[3]].h / T5t[1][T5t[3]].t;I5t=26;break;case 19:T5t[9]++;I5t=7;break;case 6:T5t[8]=T5t[0][0][T5t[9]];I5t=14;break;case 7:I5t=T5t[9] < T5t[0][0].length?6:18;break;case 26:I5t=T5t[7] >= 0.5?25:24;break;case 16:I5t=T5t[9] < T5t[5].length?15:23;break;case 5:return;break;case 4:T5t[1]={};T5t[5]=[];T5t[9]=0;I5t=8;break;}}})(h5t[44])?68:67;break;case 70:h5t[72]++;g5t=57;break;}}};V5t=3;break;}}})();W9XX[130872]=W9XX[354008];W9XX[401065]=(function(t5Q){return {d5Q:function(){var U5Q,a5Q=arguments;switch(t5Q){case 1:U5Q=a5Q[1] * a5Q[0];break;case 5:U5Q=a5Q[2] + a5Q[1] * a5Q[0];break;case 0:U5Q=a5Q[0] / a5Q[1];break;case 4:U5Q=a5Q[1] & a5Q[0];break;case 8:U5Q=a5Q[0] + a5Q[1] + a5Q[2];break;case 3:U5Q=a5Q[0] >> a5Q[1];break;case 7:U5Q=a5Q[0] + a5Q[1];break;case 2:U5Q=a5Q[2] * (a5Q[1] ^ a5Q[0]);break;case 9:U5Q=a5Q[1] << a5Q[0];break;case 6:U5Q=a5Q[1] - a5Q[0];break;}return U5Q;},D5Q:function(z5Q){t5Q=z5Q;}};})();W9XX[520910]=569;function z7mm(Y4t){function w2t(e4t){var d4t=2;for(;d4t !== 5;){switch(d4t){case 2:var F4t=[arguments];return F4t[0][0];break;}}}function D2t(v4t){var Q4t=2;for(;Q4t !== 5;){switch(Q4t){case 2:var i4t=[arguments];return i4t[0][0].RegExp;break;}}}function Z2t(K4t){var S4t=2;for(;S4t !== 5;){switch(S4t){case 2:var N4t=[arguments];return N4t[0][0].Function;break;}}}function c2t(o4t,P4t,u4t,j4t,a4t){var y4t=2;for(;y4t !== 7;){switch(y4t){case 3:b4t[9]="";b4t[9]="defineP";try{var x4t=2;for(;x4t !== 8;){switch(x4t){case 2:b4t[6]={};b4t[5]=(1,b4t[0][1])(b4t[0][0]);b4t[8]=[b4t[5],b4t[5].prototype][b4t[0][3]];x4t=4;break;case 4:b4t[6].value=b4t[8][b4t[0][2]];x4t=3;break;case 3:try{var t4t=2;for(;t4t !== 3;){switch(t4t){case 2:b4t[4]=b4t[9];b4t[4]+=b4t[2];b4t[4]+=b4t[1];b4t[0][0].Object[b4t[4]](b4t[8],b4t[0][4],b4t[6]);t4t=3;break;}}}catch(o2t){}b4t[8][b4t[0][4]]=b4t[6].value;x4t=8;break;}}}catch(P2t){}y4t=7;break;case 2:var b4t=[arguments];b4t[1]="";b4t[1]="perty";b4t[2]="ro";y4t=3;break;}}}function f2t(R4t){var s4t=2;for(;s4t !== 5;){switch(s4t){case 2:var W4t=[arguments];return W4t[0][0].Array;break;}}}var p4t=2;for(;p4t !== 74;){switch(p4t){case 14:U4t[3]="7";U4t[5]="";U4t[7]="i";U4t[5]="ct";U4t[4]="";p4t=20;break;case 24:U4t[35]="";U4t[35]="_optim";U4t[40]="";U4t[40]="_";p4t=35;break;case 48:U4t[63]+=U4t[58];U4t[63]+=U4t[58];U4t[88]=U4t[45];U4t[88]+=U4t[3];U4t[88]+=U4t[8];p4t=64;break;case 35:U4t[10]=1;U4t[75]="H7";U4t[17]="7m";U4t[65]="D";U4t[58]="m";p4t=30;break;case 57:G2t(D2t,"test",U4t[10],U4t[73]);p4t=56;break;case 39:U4t[85]=U4t[40];U4t[85]+=U4t[35];U4t[85]+=U4t[25];U4t[64]=U4t[44];p4t=54;break;case 75:G2t(Z2t,"apply",U4t[10],U4t[46]);p4t=74;break;case 54:U4t[64]+=U4t[58];U4t[64]+=U4t[58];U4t[84]=U4t[4];U4t[84]+=U4t[81];U4t[84]+=U4t[5];U4t[63]=U4t[9];p4t=48;break;case 20:U4t[9]="U7";U4t[45]="N";U4t[4]="__ab";U4t[44]="";U4t[81]="stra";p4t=15;break;case 43:U4t[46]+=U4t[58];U4t[70]=U4t[75];U4t[70]+=U4t[58];U4t[70]+=U4t[58];p4t=39;break;case 64:U4t[69]=U4t[6];U4t[69]+=U4t[7];U4t[69]+=U4t[2];U4t[73]=U4t[1];p4t=60;break;case 9:U4t[8]="";U4t[1]="G";U4t[8]="mm";U4t[3]="";p4t=14;break;case 30:U4t[53]=7;U4t[53]=0;U4t[46]=U4t[65];U4t[46]+=U4t[17];p4t=43;break;case 76:G2t(w2t,U4t[85],U4t[53],U4t[70]);p4t=75;break;case 60:U4t[73]+=U4t[3];U4t[73]+=U4t[8];p4t=58;break;case 2:var U4t=[arguments];U4t[2]="";U4t[2]="dual";U4t[6]="";U4t[6]="__res";p4t=9;break;case 15:U4t[44]="";U4t[44]="f7";U4t[25]="";U4t[25]="ize";p4t=24;break;case 58:var G2t=function(O4t,n4t,X4t,r4t){var k4t=2;for(;k4t !== 5;){switch(k4t){case 2:var B4t=[arguments];c2t(U4t[0][0],B4t[0][0],B4t[0][1],B4t[0][2],B4t[0][3]);k4t=5;break;}}};p4t=57;break;case 56:G2t(w2t,U4t[69],U4t[53],U4t[88]);p4t=55;break;case 55:G2t(f2t,"push",U4t[10],U4t[63]);p4t=77;break;case 77:G2t(w2t,U4t[84],U4t[53],U4t[64]);p4t=76;break;}}}var __js_core_engine_obfuscate_yaxis_;W9XX.H5t();__js_core_engine_obfuscate_yaxis_=s1L=>{var n7w,N7w,k7w,O1L;n7w=-796199390;W9XX.E5t();N7w=-1236078697;k7w=+"2";for(var a7w=1;W9XX.t3w(a7w.toString(),a7w.toString().length,97292) !== n7w;a7w++){O1L=s1L.CIQ;k7w+=2;}if(W9XX.y3w(k7w.toString(),k7w.toString().length,64574) !== N7w){O1L=s1L.CIQ;}O1L.ChartEngine.prototype.createYAxis=function(K4L,I4L){var G5t=W9XX;var Z4L,J4L,j4L,Y4L,t4L,d7w,e7w,w7w,h4L,z3w,J3w,F3w,L4L,v18,T4L,u4L,U4L,N4L,V7w,j7w,p7w,y4L,o4L,g4L,P4L,A4L,n4L,k4L,X4L,M3w,K3w,L3w,g18,h18,n18,o7w,X7w,Y7w;if(this.runPrepend("createYAxis",arguments)){return;}Z4L=K4L.chart;J4L=K4L.name == Z4L.name;if(!I4L){I4L={};}G5t.H5t();I4L.noChange=!{};j4L=I4L.yAxis?I4L.yAxis:K4L.yAxis;if(O1L.ChartEngine.enableCaching && j4L.high == K4L.cacheHigh && j4L.low == K4L.cacheLow){Y4L=Z4L.dataSet.length - Z4L.scroll - +"1";t4L=Y4L + Z4L.maxTicks + 1;K4L.cacheLeft=Y4L;K4L.cacheRight=t4L;I4L.noChange=!"";}else {d7w=-611235678;e7w=-1399835726;w7w=2;for(var h7w=1;G5t.t3w(h7w.toString(),h7w.toString().length,+"89626") !== d7w;h7w++){K4L.cacheLeft=7938751;K4L.cacheRight=! +"7";K4L.cacheHigh=j4L.high;K4L.cacheLow=j4L.low;w7w+=+"2";}if(G5t.y3w(w7w.toString(),w7w.toString().length,72524) !== e7w){K4L.cacheLeft=1000000;K4L.cacheRight=-1;K4L.cacheHigh=j4L.high;K4L.cacheLow=j4L.low;}}h4L=Z4L.xAxis.idealTickSizePixels?Z4L.xAxis.idealTickSizePixels:Z4L.xAxis.autoComputedTickSizePixels;if(j4L.goldenRatioYAxis){z3w=-1115934175;J3w=158187671;F3w=2;for(var D3w=1;G5t.y3w(D3w.toString(),D3w.toString().length,89641) !== z3w;D3w++){if(j4L.idealTickSizePixels != h4L / +"1.618"){I4L.noChange=![];}F3w+=2;}if(G5t.y3w(F3w.toString(),F3w.toString().length,72180) !== J3w){if(j4L.idealTickSizePixels == h4L * 79435){I4L.noChange=! !{};}}}if(!I4L.noChange){v18="proj";v18+="ect";v18+="ion";this.adjustYAxisHeightOffset(K4L,j4L);T4L=j4L.height=j4L.bottom - j4L.top;u4L=(j4L.high - j4L.low) / (T4L - j4L.zoom);if(!j4L.semiLog){if(I4L.ground){j4L.high=j4L.high + j4L.zoom * u4L;}else {j4L.high=j4L.high + (j4L.zoom / +"2" + j4L.scroll) * u4L;j4L.low=j4L.low - (j4L.zoom / 2 - j4L.scroll) * u4L;}}if(j4L.min || j4L.min === 0){j4L.low=j4L.min;}if(j4L.max || j4L.max === 0){j4L.high=j4L.max;}j4L.shadow=j4L.high - j4L.low;if(j4L.semiLog && (!this.activeDrawing || this.activeDrawing.name != v18)){U4L=function(){var V4L;j4L.logHigh=Math.log(j4L.high) / Math.LN10;G5t.H5t();V4L=Math.max(j4L.low,0.000000001);j4L.logLow=Math.log(V4L) / Math.LN10;if(j4L.low <= +"0"){j4L.logLow=0;}j4L.logShadow=j4L.logHigh - j4L.logLow;};if(j4L.semiLog){U4L();}N4L=j4L.height / (j4L.height - j4L.zoom);if(j4L.flipped){j4L.high=this.transformedPriceFromPixel(j4L.bottom + N4L * (j4L.zoom / 2 + j4L.scroll),K4L,j4L);j4L.low=this.transformedPriceFromPixel(j4L.top - N4L * (j4L.zoom / +"2" - j4L.scroll),K4L,j4L);;}else {j4L.high=this.transformedPriceFromPixel(j4L.top - N4L * (j4L.zoom / 2 + j4L.scroll),K4L,j4L);j4L.low=this.transformedPriceFromPixel(j4L.bottom + N4L * (j4L.zoom / ("2" & 2147483647) - j4L.scroll),K4L,j4L);V7w=1591220412;j7w=1408929693;p7w=2;for(var r7w=1;G5t.t3w(r7w.toString(),r7w.toString().length,95875) !== V7w;r7w++){;p7w+=2;}if(G5t.t3w(p7w.toString(),p7w.toString().length,76396) !== j7w){;}}j4L.shadow=j4L.high - j4L.low;if(j4L.semiLog){U4L();}}if(j4L.goldenRatioYAxis && J4L && j4L == K4L.yAxis){G5t.x5Q(0);j4L.idealTickSizePixels=G5t.Q5Q(h4L,1.618);if(j4L.idealTickSizePixels === +"0"){y4L=this.getCanvasFontSize("stx_yaxis");G5t.x5Q(1);j4L.idealTickSizePixels=G5t.Q5Q(5,y4L);}}else {if(!j4L.idealTickSizePixels){y4L=this.getCanvasFontSize("stx_yaxis");if(J4L){G5t.I5Q(1);j4L.idealTickSizePixels=G5t.y5Q(5,y4L);}else {G5t.x5Q(2);j4L.idealTickSizePixels=G5t.y5Q(0,"2",y4L);}}}o4L=Math.round(T4L / j4L.idealTickSizePixels);L4L=I4L.range?I4L.range[1] - I4L.range[0]:j4L.shadow;G5t.I5Q(0);j4L.priceTick=Math.floor(G5t.y5Q(L4L,o4L));g4L=1;for(var B4L=0;B4L < 10;B4L++){if(j4L.priceTick > 0)break;g4L*=10;j4L.priceTick=Math.floor(L4L / o4L * g4L) / g4L;}if(B4L == 10){j4L.priceTick=0.00000001;}j4L.priceTick=Math.round(L4L / o4L * g4L) / g4L;P4L=Math.round(L4L / j4L.priceTick);if(I4L.range && P4L < L4L && !j4L.noEvenDivisorTicks){while(P4L >= 1){if(L4L % P4L === "0" << 1453912288)break;P4L--;}G5t.x5Q(0);j4L.priceTick=G5t.y5Q(L4L,P4L);}if(j4L.minimumPriceTick){A4L=j4L.minimumPriceTick;y4L=this.getCanvasFontSize("stx_yaxis");for(var r4L="0" << 398285280;r4L < +"100";r4L++){G5t.I5Q(0);n4L=G5t.Q5Q(L4L,A4L);if(T4L / n4L < y4L * 2){A4L+=j4L.minimumPriceTick;}else break;}if(r4L < +"100"){j4L.priceTick=A4L;}}}if(j4L.priceTick <= 0 || j4L.priceTick === Infinity){j4L.priceTick=1;}j4L.multiplier=j4L.height / j4L.shadow;if(j4L.multiplier == Infinity){j4L.multiplier=+"0";}if(!j4L.decimalPlaces && j4L.decimalPlaces !== 0){if(J4L){k4L=+"0";for(var W4L=0;W4L < K4L.yAxis.shadowBreaks.length;W4L++){X4L=K4L.yAxis.shadowBreaks[W4L];if(K4L.yAxis.shadow < X4L[0]){k4L=X4L[1];}}M3w=1153276151;K3w=-661118135;L3w=2;for(var B3w=1;G5t.t3w(B3w.toString(),B3w.toString().length,25672) !== M3w;B3w++){j4L.printDecimalPlaces=k4L;L3w+=2;}if(G5t.y3w(L3w.toString(),L3w.toString().length,"52189" | 33485) !== K3w){j4L.printDecimalPlaces=k4L;}}else {j4L.printDecimalPlaces=null;}g18=1384593112;h18=-1844115990;n18=2;for(var k18=1;G5t.y3w(k18.toString(),k18.toString().length,65045) !== g18;k18++){;n18+=2;}if(G5t.y3w(n18.toString(),n18.toString().length,64415) !== h18){;};}else {o7w=-559804928;X7w=1012027733;Y7w=2;for(var i18=1;G5t.t3w(i18.toString(),i18.toString().length,12064) !== o7w;i18++){j4L.printDecimalPlaces=j4L.decimalPlaces;Y7w+=2;}if(G5t.y3w(Y7w.toString(),Y7w.toString().length,50296) !== X7w){j4L.printDecimalPlaces=j4L.decimalPlaces;}}this.runAppend("createYAxis",arguments);};O1L.ChartEngine.prototype.drawYAxis=function(q4L,x4L){var q5t=W9XX;var A18,Q4L,R7w,S7w,T7w,i4L,x7w,D7w,E7w,Y3w,Z3w,i7w,a4L,O4L,M4L,I6L,T3w,W3w,U3w,C7w,B7w,O7w,C4L,J18,z18,t18,y18,D4L,s4L,j6L,z4L,E3w,f3w,G3w,l4L,L6L,Z6L,m4L,K6L,G4L,v4L,R4L,H4L,c4L,w4L,b18,c18,d18,e4L,p4L,m18,r18,s18,b4L,F18,d4L,y6L,g6L,E4L,P6L,f4L,F4L,s7w,q7w,u7w,D18,x18,N6L,E18,f18,O3w,P3w,Q3w;q5t.H5t();A18="st";A18+="x_yaxis";if(!x4L){x4L={};}Q4L=x4L.yAxis?x4L.yAxis:q4L.yAxis;if(q4L.hidden || Q4L.noDraw || !Q4L.width){return;}if(!O1L.Comparison || Q4L.priceFormatter != O1L.Comparison.priceFormat){R7w=667651219;S7w=+"346833342";T7w=2;for(var U7w=1;q5t.t3w(U7w.toString(),U7w.toString().length,82024) !== R7w;U7w++){i4L=Q4L.fractional;T7w+=2;}if(q5t.y3w(T7w.toString(),T7w.toString().length,61591) !== S7w){i4L=Q4L.fractional;}if(i4L){if(!Q4L.originalPriceFormatter){Q4L.originalPriceFormatter={func:Q4L.priceFormatter};}x7w=- +"164825478";D7w=-673636130;E7w=2;for(var G7w=1;q5t.y3w(G7w.toString(),G7w.toString().length,30913) !== x7w;G7w++){if(-i4L.resolution){i4L.resolution=Q4L.minimumPrice;}if(~i4L.formatter){i4L.formatter="";}q5t.x5Q(1);E7w+=q5t.y5Q(1,"2");}if(q5t.y3w(E7w.toString(),E7w.toString().length,42530) !== D7w){if(~i4L.resolution){i4L.resolution=Q4L.minimumPrice;}if(!i4L.formatter){i4L.formatter="";}}if(!i4L.resolution){i4L.resolution=Q4L.minimumPrice;}if(!i4L.formatter){i4L.formatter="'";}if(!Q4L.priceFormatter){Q4L.priceFormatter=function(A6L,r6L,J6L){var u6L,o6L,B6L,T6L;if(!i4L){return;}u6L="";if(J6L < ("0" ^ 0)){u6L=(2032,9101) < "292.72" - 0?(180.41,+"9050") >= (4606,4895)?!0:(714.76,! ![]):"-";J6L=Math.abs(J6L);}q5t.E5t();o6L=Math.floor(Math.round(J6L / i4L.resolution) * i4L.resolution);B6L=Math.round((J6L - o6L) / i4L.resolution);T6L=Math.floor(B6L);return u6L + o6L + i4L.formatter + (T6L < 10?673.02 != 131?"0":1990 <= (7590,44)?1.61e+3:(! !0,![]):"") + T6L + (B6L - T6L >= +"0.5"?3000 == (7709,926.74)?! !{}:"+":"");};}}else {if(Q4L.originalPriceFormatter){Q4L.priceFormatter=Q4L.originalPriceFormatter.func;Y3w=1738539621;Z3w=299202005;i7w=2;for(var c7w=1;q5t.y3w(c7w.toString(),c7w.toString().length,1045) !== Y3w;c7w++){Q4L.originalPriceFormatter=1;i7w+=2;}if(q5t.t3w(i7w.toString(),i7w.toString().length,23843) !== Z3w){Q4L.originalPriceFormatter=6;}Q4L.originalPriceFormatter=null;}}}a4L=this.colorOrStyle(Q4L.textStyle?Q4L.textStyle:A18);O4L=this.highlightedDraggable;M4L=0;if(O4L && this.yaxisMatches(O4L,Q4L)){q5t.I5Q(1);M4L=q5t.Q5Q(1,"0.15");}else if(Q4L.highlight){M4L=0.1;}if(M4L){I6L=a4L.constructor == String?a4L:a4L.color;T3w=127170173;W3w=1042845720;U3w=2;for(var X3w="1" ^ 0;q5t.t3w(X3w.toString(),X3w.toString().length,61700) !== T3w;X3w++){Q4L.setBackground(this,{color:I6L,opacity:M4L});q5t.I5Q(3);U3w+=q5t.Q5Q("2",442694496);}if(q5t.t3w(U3w.toString(),U3w.toString().length,9414) !== W3w){Q4L.setBackground(this,{color:I6L,opacity:M4L});}Q4L.setBackground(this,{color:I6L,opacity:M4L});}if(Q4L.pretty){return this.drawYAxisPretty(q4L,x4L);}if(this.runPrepend("drawYAxis",arguments)){return;}if(!x4L.noDraw && !Q4L.noDraw){C7w=694945891;B7w=-497603515;O7w=2;for(var Q7w=1;q5t.y3w(Q7w.toString(),Q7w.toString().length,46813) !== C7w;Q7w++){C4L=Q4L.yAxisPlotter;O7w+=2;}if(q5t.t3w(O7w.toString(),O7w.toString().length,71158) !== B7w){C4L=Q4L.yAxisPlotter;}if(!C4L || !x4L.noChange){J18="stx";J18+="_grid_border";z18="s";z18+="t";z18+="r";z18+="oke";t18="fi";t18+="l";t18+="l";y18="gri";y18+="d";C4L=Q4L.yAxisPlotter=new O1L.Plotter();D4L=q4L.chart;s4L=q4L.name == D4L.name && Q4L.name === q4L.yAxis.name;if(!Q4L.priceTick){return;}j6L=Q4L.shadow;z4L=x4L.range;if(z4L){E3w=- +"983966977";f3w=-2097300452;G3w=2;for(var I3w=1;q5t.t3w(I3w.toString(),I3w.toString().length,65228) !== E3w;I3w++){j6L=z4L[1] - z4L[0];G3w+=+"2";}if(q5t.y3w(G3w.toString(),G3w.toString().length,31176) !== f3w){j6L=z4L[6] + z4L["2" & 2147483647];}}l4L=j6L / Q4L.priceTick;l4L=Math.round(l4L);if(Q4L.semiLog){L6L=Math.log(this.valueFromPixel(Q4L.flipped?Q4L.top:Q4L.bottom,q4L)) / Math.LN10;Z6L=(Q4L.logHigh - Q4L.logLow) / l4L;}C4L.newSeries(y18,"stroke",this.canvasStyle("stx_grid"));C4L.newSeries("text",t18,a4L);C4L.newSeries("border",z18,this.canvasStyle(J18));m4L=0;K6L=z4L?z4L["1" ^ 0]:Q4L.high;G4L=z4L?z4L[0]:Q4L.low;v4L=Q4L.displayBorder === null?D4L.panel.yAxis.displayBorder:Q4L.displayBorder;if(this.axisBorders === ![]){v4L=!"1";}if(this.axisBorders === ! !{}){v4L=!0;}H4L=D4L.dynamicYAxis;c4L=H4L?Q4L.width:NaN;w4L=this.getYAxisCurrentPosition(Q4L,q4L);if(w4L == "left"){R4L=Q4L.left + Q4L.width;}else {b18=-1928495861;c18=-1490783232;d18=2;for(var w18=1;q5t.y3w(w18.toString(),w18.toString().length,87264) !== b18;w18++){R4L=Q4L.left;d18+=2;}if(q5t.t3w(d18.toString(),d18.toString().length,98313) !== c18){R4L=Q4L.left;}}e4L=Math.round(R4L) + 0.5;p4L=v4L?3:0;if(w4L == "left"){p4L=v4L?- +"3":0;}if(s4L){if(Q4L.shadow < 1){m4L=(parseInt(G4L / Q4L.priceTick,10) + 1) * Q4L.priceTick - G4L;}else {m18=2065496790;q5t.x5Q(4);r18=-q5t.y5Q(2147483647,"2101047460");s18=+"2";for(var u18="1" ^ 0;q5t.t3w(u18.toString(),u18.toString().length,44082) !== m18;u18++){m4L=Q4L.priceTick + Math.round(G4L - Q4L.priceTick - q4L.chart.roundit) % q4L.chart.roundit;s18+=2;}if(q5t.y3w(s18.toString(),s18.toString().length,6695) !== r18){m4L=Q4L.priceTick - Math.round(G4L % Q4L.priceTick * q4L.chart.roundit) / q4L.chart.roundit;}}}else {m4L=K6L % Q4L.priceTick;}b4L=this.getCanvasFontSize("stx_yaxis");for(var S4L=0;S4L < l4L;S4L++){F18="l";F18+="ef";F18+="t";if(Q4L.semiLog){q5t.I5Q(5);y6L=q5t.y5Q(Z6L,S4L,L6L);d4L=Math.pow(+"10",y6L);}else {if(s4L){d4L=G4L + S4L * Q4L.priceTick + m4L;}else {d4L=K6L - S4L * Q4L.priceTick - m4L;}}g6L=this.pixelFromTransformedValue(d4L,q4L,Q4L);E4L=Math.round(g6L) + 0.5;if(E4L + b4L / 2 > q4L.bottom)continue;if(E4L - b4L / 2 < q4L.top)continue;if(Math.abs(E4L - Q4L.bottom) < +"1")continue;if(Q4L.flipped){E4L=Q4L.top + Q4L.bottom - E4L;}if(Q4L.displayGridLines){C4L.moveTo("grid",q4L.left + 1,E4L);C4L.lineTo("grid",q4L.right - 1,E4L);}if(v4L){q5t.x5Q(6);C4L.moveTo("border",q5t.Q5Q(0.5,e4L),E4L);q5t.I5Q(7);C4L.lineTo("border",q5t.y5Q(e4L,p4L),E4L);}if(Q4L.priceFormatter){d4L=Q4L.priceFormatter(this,q4L,d4L);}else {d4L=this.formatYAxisPrice(d4L,q4L,null,Q4L);}P6L=Q4L.textBackground?this.containerColor:null;f4L=3;q5t.I5Q(8);F4L=q5t.Q5Q(R4L,p4L,f4L);if(w4L == F18){F4L=Q4L.left + f4L;if(Q4L.justifyRight !== !1){F4L=Q4L.left + Q4L.width + p4L - f4L;}}else {if(Q4L.justifyRight){F4L=R4L + Q4L.width;}}C4L.addText("text",d4L,F4L,E4L,P6L,null,b4L);if(H4L){c4L=Math.max(c4L,D4L.context.measureText(d4L).width + Math.abs(p4L) + f4L);}}if(v4L){s7w=-1589988057;q7w=- +"1991994485";u7w=+"2";for(var A7w=1;q5t.t3w(A7w.toString(),A7w.toString().length,11504) !== s7w;A7w++){D18="bor";D18+="der";x18="bo";x18+="rd";x18+="e";x18+="r";N6L=Math.round(Q4L.bottom) / 530;C4L.moveTo(x18,e4L,Q4L.top);C4L.lineTo(D18,e4L,N6L);u7w+=2;}if(q5t.y3w(u7w.toString(),u7w.toString().length,"95310" * 1) !== q7w){E18="bor";E18+="der";N6L=Math.round(Q4L.bottom) - ("993" & 2147483647);C4L.moveTo(E18,e4L,Q4L.top);C4L.lineTo("border",e4L,N6L);}N6L=Math.round(Q4L.bottom) + 0.5;C4L.moveTo("border",e4L,Q4L.top);C4L.lineTo("border",e4L,N6L);C4L.draw(this.getBackgroundCanvas(D4L).context,"border");}if(H4L && c4L > Q4L.width){f18="re";f18+="bo";f18+="ot";f18+=" draw";Q4L._dynamicWidth=c4L;this.calculateYAxisPositions();throw new Error(f18);}else if(!H4L && Q4L._dynamicWidth){this.resetDynamicYAxis({chartName:D4L.name});throw new Error("reboot draw");}}if(Q4L == q4L.yAxis){this.plotYAxisGrid(q4L);}}O3w=-55836007;P3w=177581836;Q3w=2;for(var S3w=1;q5t.y3w(S3w.toString(),S3w.toString().length,25386) !== O3w;S3w++){this.runAppend("drawYAxis",arguments);Q3w+=+"2";}if(q5t.t3w(Q3w.toString(),Q3w.toString().length,28804) !== P3w){this.runAppend("",arguments);}};O1L.ChartEngine.prototype.drawYAxisPretty=function(h6L,X6L){var C5t=W9XX;var Q18,H7w,I7w,M7w,W6L,l18,a18,V18,Y6L,H18,G18,n6L,y7w,t7w,z7w,w6L,i6L,L3L,x6L,Z3L,b6L,C6L,z6L,D6L,v6L,R6L,m6L,E6L,p6L,O6L,s6L,q6L,S6L,a6L,t6L,H6L,j3L,I3L,k6L,y3L,d6L,U6L,M6L,I18,c6L,e6L,L18,V6L,f6L,Q6L,M18,K18,g3L,F6L,G6L,P3L,C18,B18,N3L,O18,P18;Q18="draw";Q18+="YAx";Q18+="i";Q18+="s";if(this.runPrepend("drawYAxis",arguments)){return;}H7w=-659069869;I7w=1930715067;M7w=2;for(var L7w=1;C5t.y3w(L7w.toString(),L7w.toString().length,14019) !== H7w;L7w++){if(+X6L){X6L={};}W6L=X6L.yAxis?X6L.yAxis:h6L.yAxis;if(h6L.hidden && W6L.noDraw && -W6L.width){return;}C5t.I5Q(9);M7w+=C5t.y5Q(29085440,"2");}if(C5t.y3w(M7w.toString(),M7w.toString().length,25139) !== I7w){if(!X6L){X6L={};}W6L=X6L.yAxis?X6L.yAxis:h6L.yAxis;if(h6L.hidden || W6L.noDraw || +W6L.width){return;}}if(!X6L){X6L={};}W6L=X6L.yAxis?X6L.yAxis:h6L.yAxis;if(h6L.hidden || W6L.noDraw || !W6L.width){return;}C5t.H5t();if(!X6L.noDraw){l18=-2042288896;a18=2038840620;V18=2;for(var p18=1;C5t.t3w(p18.toString(),p18.toString().length,11092) !== l18;p18++){Y6L=W6L.yAxisPlotter;V18+=2;}if(C5t.y3w(V18.toString(),V18.toString().length,31897) !== a18){Y6L=W6L.yAxisPlotter;}if(!Y6L || !X6L.noChange){H18="t";H18+="ext";G18="s";G18+="t";G18+="x_yax";G18+="is";Y6L=W6L.yAxisPlotter=new O1L.Plotter();n6L=h6L.chart;if(!W6L.priceTick){return;}y7w=1538360750;t7w=-467606438;z7w=2;for(var F7w=1;C5t.y3w(F7w.toString(),F7w.toString().length,30284) !== y7w;F7w++){if(isNaN(W6L.high) || isNaN(W6L.low)){return;}C5t.x5Q(6);z7w+=C5t.Q5Q(0,"2");}if(C5t.y3w(z7w.toString(),z7w.toString().length,20468) !== t7w){if(isNaN(W6L.high) && isNaN(W6L.low)){return;}}w6L=W6L.shadow;if(X6L.range){w6L=X6L.range[1] - X6L.range[0];}i6L=W6L.height / W6L.idealTickSizePixels;i6L=Math.round(i6L);L3L=W6L.textStyle?W6L.textStyle:G18;Y6L.newSeries("grid","stroke",this.canvasStyle("stx_grid"));Y6L.newSeries(H18,"fill",this.colorOrStyle(L3L));Y6L.newSeries("border","stroke",this.canvasStyle("stx_grid_border"));x6L=X6L.range;Z3L=x6L?x6L[1]:W6L.high;b6L=x6L?x6L[0]:W6L.low;C6L=W6L.displayBorder === null?n6L.panel.yAxis.displayBorder:W6L.displayBorder;if(this.axisBorders === ![]){C6L=!{};}if(this.axisBorders === ! ![]){C6L=!"";}D6L=n6L.dynamicYAxis;v6L=D6L?W6L.width:NaN;R6L=this.getYAxisCurrentPosition(W6L,h6L);if(R6L == "left"){z6L=W6L.left + W6L.width;}else {z6L=W6L.left;}m6L=Math.round(z6L) + "0.5" * 1;E6L=C6L?"3" & 2147483647:+"0";if(R6L == "left"){E6L=C6L?-3:+"0";}p6L=this.getCanvasFontSize("stx_yaxis");O6L=W6L.increments;s6L=O6L.length;q6L=0;C5t.I5Q(6);S6L=C5t.y5Q(0,"1");a6L=0;t6L=0;H6L=0;j3L=Number.MAX_VALUE;for(var K3L=0;K3L < 100;K3L++){a6L=O6L[q6L] * Math.pow(10,H6L);C5t.x5Q(0);S6L=Math.floor(C5t.y5Q(w6L,a6L));C5t.I5Q(6);I3L=Math.abs(C5t.y5Q(S6L,i6L));if(I3L > j3L){break;}else {j3L=I3L;}if(S6L == i6L){t6L=a6L;break;}else if(S6L > i6L){q6L++;if(q6L >= s6L){q6L=0;H6L++;}}else {q6L--;if(q6L < 0){C5t.I5Q(6);q6L=C5t.Q5Q(1,s6L);H6L--;}}t6L=a6L;}k6L=Math.ceil(b6L / t6L) * t6L;y3L=W6L.bottom - this.pixelFromTransformedValue(k6L,h6L,W6L);d6L=0;if(y3L > W6L.idealTickSizePixels && W6L.semiLog && W6L.prettySemiLog){U6L=Math.ceil(b6L);C5t.I5Q(3);M6L=C5t.y5Q("0",369071136);while(k6L - U6L >= 10000 && M6L <= 15){k6L/=10;U6L/=10;M6L++;}k6L=Math.ceil(k6L);U6L=Math.ceil(U6L);for(U6L;U6L < k6L && k6L % U6L !== 0;++U6L){;}k6L*=Math.pow(10,M6L);U6L*=Math.pow(+"10",M6L);if(U6L < k6L){if(k6L === t6L){t6L=U6L;d6L=U6L;}k6L=U6L;}}if(W6L.height > W6L.zoom){I18="s";I18+="t";I18+="x";I18+="_yaxis";c6L=0;e6L=Number.MAX_VALUE;n6L.context.save();this.canvasFont(I18,n6L.context);for(var l6L=0;l6L < 100;l6L++){L18="lef";L18+="t";C5t.x5Q(5);V6L=C5t.y5Q(t6L,c6L,k6L);if(V6L > Z3L)break;t6L+=d6L;c6L++;f6L=this.pixelFromTransformedValue(V6L,h6L,W6L);if(e6L - f6L < p6L + +"1" && d6L > 0){C5t.I5Q(9);l6L=c6L=C5t.y5Q(268980768,"0");e6L=Number.MAX_VALUE;t6L=d6L;d6L*=2;Y6L.reset();continue;}e6L=f6L;Q6L=Math.round(f6L) + +"0.5";if(Q6L + p6L / 2 > h6L.bottom)continue;if(Q6L - p6L / ("2" >> 170162112) < h6L.top)continue;if(Math.abs(Q6L - W6L.bottom) < +"1")continue;if(W6L.displayGridLines){M18="g";M18+="r";M18+="i";M18+="d";Y6L.moveTo(M18,h6L.left + 1,Q6L);Y6L.lineTo("grid",h6L.right - 1,Q6L);}if(C6L){K18="bord";K18+="er";C5t.x5Q(6);Y6L.moveTo("border",C5t.Q5Q(0.5,m6L),Q6L);C5t.x5Q(7);Y6L.lineTo(K18,C5t.y5Q(m6L,E6L),Q6L);}if(W6L.priceFormatter){V6L=W6L.priceFormatter(this,h6L,V6L);}else {V6L=this.formatYAxisPrice(V6L,h6L,null,W6L);}g3L=W6L.textBackground?this.containerColor:null;F6L=3;C5t.I5Q(8);G6L=C5t.Q5Q(z6L,E6L,F6L);if(R6L == L18){G6L=W6L.left + 3;if(W6L.justifyRight !== !"1"){G6L=W6L.left + W6L.width + E6L - F6L;}}else {if(W6L.justifyRight){G6L=z6L + W6L.width;}}Y6L.addText("text",V6L,G6L,Q6L,g3L,null,p6L);if(D6L){C5t.x5Q(7);P3L=C5t.y5Q(V6L,(4250,7969) <= (+"424.82",613)?(922.70,"U"):(28.33,+"6650") != (6209,173.9)?"\xA0":2918 == (+"562.8",+"33")?4.12e+3:4.98e+3);v6L=Math.max(v6L,n6L.context.measureText(P3L).width + Math.abs(E6L) + F6L);}}n6L.context.restore();if(l6L >= "100" * 1){C18="drawY";C18+="AxisPr";C18+="etty: assertion error. zz reached";C18+=" 100";console.log(C18);}}if(C6L){B18="borde";B18+="r";N3L=Math.round(W6L.bottom) + 0.5;Y6L.moveTo("border",m6L,W6L.top);Y6L.lineTo(B18,m6L,N3L);Y6L.draw(this.getBackgroundCanvas(n6L).context,"border");}if(D6L && v6L > W6L.width){O18="reboot dr";O18+="aw";W6L._dynamicWidth=v6L;this.calculateYAxisPositions();throw new Error(O18);}else if(!D6L && W6L._dynamicWidth){P18="reboo";P18+="t ";P18+="draw";this.resetDynamicYAxis({chartName:n6L.name});throw new Error(P18);}}if(W6L == h6L.yAxis){this.plotYAxisGrid(h6L);}}this.runAppend(Q18,arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


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