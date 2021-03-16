/**
 *	8.2.0
 *	Generation date: 2021-02-19T12:58:54.487Z
 *	Client name: deriv limited
 *	Package Type: Technical Analysis 8.2
 *	License type: annual
 *	Expiration date: "2022/04/01"
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
k0LL[450668]=(function(){var Z=2;for(;Z !== 9;){switch(Z){case 5:var k;try{var Y=2;for(;Y !== 6;){switch(Y){case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\u006f\u0070\x65\u0072\x74\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\x79\x70\u0065'],'\u0062\u0037\u006e\u0063\x50',{'\x67\x65\x74':function(){var m=2;for(;m !== 1;){switch(m){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});k=b7ncP;k['\u004b\u0042\u006e\x76\u006f']=k;Y=4;break;case 9:delete k['\x4b\x42\x6e\u0076\u006f'];var R=Object['\x70\u0072\u006f\u0074\x6f\x74\u0079\u0070\u0065'];delete R['\x62\x37\u006e\x63\x50'];Y=6;break;case 4:Y=typeof KBnvo === '\x75\u006e\u0064\u0065\x66\x69\u006e\u0065\x64'?3:9;break;case 3:throw "";Y=9;break;}}}catch(C){k=window;}return k;break;case 2:Z=typeof globalThis === '\x6f\u0062\u006a\u0065\x63\u0074'?1:5;break;case 1:return globalThis;break;}}})();k0LL[189977]=M000(k0LL[450668]);k0LL[442504]=g0LL(k0LL[450668]);k0LL[182292]=l0LL(k0LL[450668]);k0LL[580930]=o5LL(k0LL[450668]);function k0LL(){}k0LL.b40=function(){return typeof k0LL[431873].w0L === 'function'?k0LL[431873].w0L.apply(k0LL[431873],arguments):k0LL[431873].w0L;};function g0LL(a20){function n00(f20){var h20=2;for(;h20 !== 5;){switch(h20){case 2:var R20=[arguments];return R20[0][0].String;break;}}}function Y00(M20,N20,Z20,Y20,C20){var P20=2;for(;P20 !== 6;){switch(P20){case 3:z20[6]="ePrope";z20[5]="";z20[5]="defin";try{var t20=2;for(;t20 !== 8;){switch(t20){case 2:z20[7]={};z20[1]=(1,z20[0][1])(z20[0][0]);z20[8]=[z20[1],z20[1].prototype][z20[0][3]];t20=4;break;case 4:z20[7].value=z20[8][z20[0][2]];try{var q20=2;for(;q20 !== 3;){switch(q20){case 2:z20[3]=z20[5];z20[3]+=z20[6];z20[3]+=z20[9];z20[0][0].Object[z20[3]](z20[8],z20[0][4],z20[7]);q20=3;break;}}}catch(L20){}z20[8][z20[0][4]]=z20[7].value;t20=8;break;}}}catch(O20){}P20=6;break;case 2:var z20=[arguments];z20[9]="";z20[9]="rty";z20[6]="";P20=3;break;}}}var K20=2;for(;K20 !== 32;){switch(K20){case 2:var X20=[arguments];X20[7]="";X20[7]="";X20[7]="p0";X20[1]="0";X20[6]="LL";X20[3]="i";K20=7;break;case 24:X20[39]+=X20[1];X20[39]+=X20[6];K20=22;break;case 34:J00(M00,"substring",X20[5],X20[18]);K20=33;break;case 21:J00(C00,"String",X20[2],X20[39]);K20=35;break;case 7:X20[4]="L";X20[5]=1;X20[8]="A0";X20[9]="V";K20=12;break;case 12:X20[2]=5;X20[2]=0;X20[59]=X20[9];X20[59]+=X20[1];K20=19;break;case 22:var J00=function(x20,V20,y20,J20){var c20=2;for(;c20 !== 5;){switch(c20){case 2:var m20=[arguments];Y00(X20[0][0],m20[0][0],m20[0][1],m20[0][2],m20[0][3]);c20=5;break;}}};K20=21;break;case 19:X20[59]+=X20[6];X20[18]=X20[8];X20[18]+=X20[4];X20[18]+=X20[4];K20=15;break;case 15:X20[82]=X20[7];X20[82]+=X20[4];X20[82]+=X20[4];X20[39]=X20[3];K20=24;break;case 35:J00(n00,"fromCharCode",X20[2],X20[82]);K20=34;break;case 33:J00(M00,"charCodeAt",X20[5],X20[59]);K20=32;break;}}function M00(e20){var G20=2;for(;G20 !== 5;){switch(G20){case 2:var T20=[arguments];return T20[0][0].String;break;}}}function C00(n20){var v20=2;for(;v20 !== 5;){switch(v20){case 2:var u20=[arguments];return u20[0][0];break;}}}}k0LL.u00=function(){return typeof k0LL[135555].M8 === 'function'?k0LL[135555].M8.apply(k0LL[135555],arguments):k0LL[135555].M8;};k0LL[431873]=(function(){var g20=2;for(;g20 !== 4;){switch(g20){case 2:var p0L=k0LL[450668];var C0L,M0L;return {w0L:function(H0L,Q0L,E0L,b0L){var E40=2;for(;E40 !== 1;){switch(E40){case 2:return h0L(H0L,Q0L,E0L,b0L);break;}}},N0L:function(D0L,Z0L,X0L,z0L){var L40=2;for(;L40 !== 1;){switch(L40){case 2:return h0L(D0L,Z0L,X0L,z0L,true);break;}}}};break;}}function h0L(a0L,m0L,B0L,g0L,f0L){var l40=2;for(;l40 !== 15;){switch(l40){case 2:var r0L,u0L,t0L,W0L;W0L=p0L[i0L([10,13,1,-1,18,7,13,12])];!C0L && (C0L=typeof W0L !== "undefined"?W0L[i0L([6,13,17,18,12,-1,11,3])] || ' ':"");l40=4;break;case 4:!M0L && (M0L=typeof W0L !== "undefined"?W0L[i0L([6,16,3,4])]:"");t0L=f0L?M0L:C0L;l40=9;break;case 19:l40=a0L === null || a0L <= 0?18:14;break;case 11:r0L=t0L.A0LL(P0L,t0L.length);l40=10;break;case 9:l40=g0L > 0?8:19;break;case 10:u0L=r0L.length;return k0LL.G4(r0L,u0L,B0L);break;case 8:r0L=t0L.A0LL(a0L,g0L);u0L=r0L.length;l40=6;break;case 6:return k0LL.G4(r0L,u0L,B0L);break;case 14:var P0L=t0L.length - a0L;l40=13;break;case 13:l40=m0L && P0L > 0 && t0L.V0LL(P0L - 1) !== 46?12:11;break;case 18:r0L=t0L.A0LL(0,t0L.length);u0L=r0L.length;l40=16;break;case 12:return false;break;case 16:return k0LL.G4(r0L,u0L,B0L);break;}}}function i0L(s0L){var p40=2;for(;p40 !== 7;){switch(p40){case 2:var K0L=1;var V0L='';p40=5;break;case 4:p40=A0L < s0L.length?3:8;break;case 3:V0L+=i0LL.p0LL(s0L[A0L] - K0L + 99);p40=9;break;case 9:A0L++;p40=4;break;case 5:var A0L=0;p40=4;break;case 8:return V0L;break;}}}})();k0LL.i3h=function(){return typeof k0LL.p3h.L8L === 'function'?k0LL.p3h.L8L.apply(k0LL.p3h,arguments):k0LL.p3h.L8L;};function M000(r4){function H2(t4){var R4=2;for(;R4 !== 5;){switch(R4){case 2:var S4=[arguments];return S4[0][0].String;break;}}}var P4=2;for(;P4 !== 11;){switch(P4){case 6:k4[6]+=k4[8];k4[6]+=k4[1];P4=13;break;case 3:k4[9]="p";k4[4]=9;k4[4]=1;k4[6]=k4[9];P4=6;break;case 2:var k4=[arguments];k4[1]="00";k4[8]="";k4[8]="0";P4=3;break;case 12:U2(H2,"charCodeAt",k4[4],k4[6]);P4=11;break;case 13:var U2=function(c4,U4,T4,g4){var Z4=2;for(;Z4 !== 5;){switch(Z4){case 2:var h4=[arguments];g2(k4[0][0],h4[0][0],h4[0][1],h4[0][2],h4[0][3]);Z4=5;break;}}};P4=12;break;}}function g2(H4,v4,I4,q4,n4){var L4=2;for(;L4 !== 6;){switch(L4){case 2:var b4=[arguments];b4[5]="inePro";b4[7]="perty";b4[6]="";L4=3;break;case 3:b4[6]="def";b4[9]=0;b4[9]=3;try{var W4=2;for(;W4 !== 8;){switch(W4){case 4:b4[8].value=b4[1][b4[0][2]];try{var D4=2;for(;D4 !== 3;){switch(D4){case 4:b4[0][0].Object[b4[2]](b4[1],b4[0][4],b4[8]);D4=3;break;case 2:b4[2]=b4[6];b4[2]+=b4[5];b4[2]+=b4[7];D4=4;break;}}}catch(z2){}b4[1][b4[0][4]]=b4[8].value;W4=8;break;case 2:b4[8]={};b4[3]=(1,b4[0][1])(b4[0][0]);b4[1]=[b4[9],b4[3].prototype][b4[0][3]];W4=4;break;}}}catch(G2){}L4=6;break;}}}}k0LL.A40=function(){return typeof k0LL[431873].w0L === 'function'?k0LL[431873].w0L.apply(k0LL[431873],arguments):k0LL[431873].w0L;};k0LL.G4=function(){return typeof k0LL[343126].J4 === 'function'?k0LL[343126].J4.apply(k0LL[343126],arguments):k0LL[343126].J4;};k0LL.Z00=function(){return typeof k0LL[135555].y8 === 'function'?k0LL[135555].y8.apply(k0LL[135555],arguments):k0LL[135555].y8;};k0LL.z4=function(){return typeof k0LL[343126].J4 === 'function'?k0LL[343126].J4.apply(k0LL[343126],arguments):k0LL[343126].J4;};k0LL.s3h=function(){return typeof k0LL.p3h.L8L === 'function'?k0LL.p3h.L8L.apply(k0LL.p3h,arguments):k0LL.p3h.L8L;};k0LL.e00=function(){return typeof k0LL[135555].y8 === 'function'?k0LL[135555].y8.apply(k0LL[135555],arguments):k0LL[135555].y8;};function l0LL(T30){function b60(L30){var l30=2;for(;l30 !== 5;){switch(l30){case 2:var U30=[arguments];return U30[0][0].String;break;}}}function n60(k30,r30,V30,W30,G30){var w30=2;for(;w30 !== 6;){switch(w30){case 2:var O30=[arguments];O30[6]="";O30[6]="rty";O30[1]="";O30[5]="ePrope";O30[1]="defin";O30[9]=3;w30=7;break;case 7:try{var n30=2;for(;n30 !== 8;){switch(n30){case 2:O30[2]={};O30[4]=(1,O30[0][1])(O30[0][0]);O30[3]=[O30[9],O30[4].prototype][O30[0][3]];O30[2].value=O30[3][O30[0][2]];try{var b30=2;for(;b30 !== 3;){switch(b30){case 4:O30[0][0].Object[O30[7]](O30[3],O30[0][4],O30[2]);b30=3;break;case 2:O30[7]=O30[1];O30[7]+=O30[5];O30[7]+=O30[6];b30=4;break;}}}catch(m60){}O30[3][O30[0][4]]=O30[2].value;n30=8;break;}}}catch(B60){}w30=6;break;}}}function w60(P30){var u30=2;for(;u30 !== 5;){switch(u30){case 2:var x30=[arguments];return x30[0][0].Array;break;}}}var j30=2;for(;j30 !== 16;){switch(j30){case 12:t30[8]+=t30[5];t30[7]=t30[4];t30[7]+=t30[2];t30[7]+=t30[9];j30=19;break;case 17:J60(w60,"map",t30[3],t30[8]);j30=16;break;case 19:var J60=function(g30,y30,N30,z30){var J30=2;for(;J30 !== 5;){switch(J30){case 2:var A30=[arguments];n60(t30[0][0],A30[0][0],A30[0][1],A30[0][2],A30[0][3]);J30=5;break;}}};j30=18;break;case 18:J60(b60,"replace",t30[3],t30[7]);j30=17;break;case 3:t30[5]="L";t30[4]="y";t30[6]="I0";t30[3]=3;t30[3]=1;t30[8]=t30[6];t30[8]+=t30[5];j30=12;break;case 2:var t30=[arguments];t30[9]="";t30[9]="LL";t30[2]="0";j30=3;break;}}}k0LL.S30=function(){return typeof k0LL[85261].D2L === 'function'?k0LL[85261].D2L.apply(k0LL[85261],arguments):k0LL[85261].D2L;};k0LL.s40=function(){return typeof k0LL[431873].N0L === 'function'?k0LL[431873].N0L.apply(k0LL[431873],arguments):k0LL[431873].N0L;};k0LL.i00=function(){return typeof k0LL[135555].M8 === 'function'?k0LL[135555].M8.apply(k0LL[135555],arguments):k0LL[135555].M8;};function o5LL(O3h){function x60(E3h){var a3h=2;for(;a3h !== 5;){switch(a3h){case 2:var T0h=[arguments];return T0h[0][0].Function;break;}}}var o3h=2;for(;o3h !== 72;){switch(o3h){case 11:y0h[3]="mize";y0h[2]="";y0h[2]="re";y0h[1]="";y0h[1]="__";y0h[8]="";y0h[8]="d";o3h=15;break;case 75:p60(I60,"push",y0h[46],y0h[57]);o3h=74;break;case 65:y0h[70]=y0h[5];y0h[70]+=y0h[16];y0h[70]+=y0h[78];y0h[42]=y0h[4];o3h=61;break;case 6:y0h[9]="";y0h[5]="O";y0h[9]="sidual";y0h[2]="";o3h=11;break;case 41:y0h[91]+=y0h[95];y0h[86]=y0h[85];y0h[86]+=y0h[16];y0h[86]+=y0h[78];y0h[50]=y0h[49];y0h[50]+=y0h[64];o3h=54;break;case 73:p60(x60,"apply",y0h[46],y0h[91]);o3h=72;break;case 3:y0h[6]="";y0h[6]="pti";y0h[4]="";y0h[4]="__o";o3h=6;break;case 55:p60(h60,"test",y0h[46],y0h[11]);o3h=77;break;case 28:y0h[46]=1;y0h[84]=0;y0h[91]=y0h[75];y0h[91]+=y0h[58];o3h=41;break;case 77:p60(i60,y0h[42],y0h[84],y0h[70]);o3h=76;break;case 24:y0h[96]="tract";y0h[82]="f0";y0h[78]="LL";y0h[95]="";y0h[16]="0";y0h[95]="L";o3h=33;break;case 2:var y0h=[arguments];y0h[7]="";y0h[7]="";y0h[7]="m";o3h=3;break;case 56:var p60=function(g3h,k3h,F3h,B3h){var t3h=2;for(;t3h !== 5;){switch(t3h){case 1:r60(y0h[0][0],P0h[0][0],P0h[0][1],P0h[0][2],P0h[0][3]);t3h=5;break;case 2:var P0h=[arguments];t3h=1;break;}}};o3h=55;break;case 54:y0h[50]+=y0h[96];y0h[57]=y0h[82];y0h[57]+=y0h[95];y0h[57]+=y0h[95];y0h[92]=y0h[8];y0h[92]+=y0h[58];o3h=48;break;case 15:y0h[49]="";y0h[64]="_abs";y0h[49]="_";y0h[78]="";o3h=24;break;case 76:p60(i60,y0h[15],y0h[84],y0h[92]);o3h=75;break;case 74:p60(i60,y0h[50],y0h[84],y0h[86]);o3h=73;break;case 57:y0h[11]+=y0h[78];o3h=56;break;case 33:y0h[85]="z";y0h[75]="";y0h[58]="0L";y0h[75]="T";y0h[46]=3;o3h=28;break;case 61:y0h[42]+=y0h[6];y0h[42]+=y0h[3];y0h[11]=y0h[7];y0h[11]+=y0h[16];o3h=57;break;case 48:y0h[92]+=y0h[95];y0h[15]=y0h[1];y0h[15]+=y0h[2];y0h[15]+=y0h[9];o3h=65;break;}}function h60(u3h){var N3h=2;for(;N3h !== 5;){switch(N3h){case 2:var l3h=[arguments];return l3h[0][0].RegExp;break;}}}function I60(e3h){var W3h=2;for(;W3h !== 5;){switch(W3h){case 2:var V0h=[arguments];W3h=1;break;case 1:return V0h[0][0].Array;break;}}}function i60(v3h){var Q3h=2;for(;Q3h !== 5;){switch(Q3h){case 1:return J0h[0][0];break;case 2:var J0h=[arguments];Q3h=1;break;}}}function r60(d3h,M3h,K3h,C3h,H3h){var n3h=2;for(;n3h !== 9;){switch(n3h){case 3:try{var R3h=2;for(;R3h !== 8;){switch(R3h){case 4:c0h[8].value=c0h[7][c0h[0][2]];try{var G3h=2;for(;G3h !== 3;){switch(G3h){case 2:c0h[4]=y0h[8];c0h[4]+=c0h[3];c0h[4]+=c0h[6];c0h[0][0].Object[c0h[4]](c0h[7],c0h[0][4],c0h[8]);G3h=3;break;}}}catch(M0h){}R3h=9;break;case 2:c0h[8]={};c0h[1]=(1,c0h[0][1])(c0h[0][0]);c0h[7]=[c0h[1],c0h[1].prototype][c0h[0][3]];R3h=4;break;case 9:c0h[7][c0h[0][4]]=c0h[8].value;R3h=8;break;}}}catch(K0h){}n3h=9;break;case 2:var c0h=[arguments];c0h[6]="";c0h[6]="Property";c0h[3]="efine";n3h=3;break;}}}}k0LL[135555]=(function(z8){return {y8:function(){var A8,G8=arguments;switch(z8){case 14:A8=G8[0] & G8[1];break;case 12:A8=G8[1] + G8[0];break;case 0:A8=+G8[1] / G8[0];break;case 2:A8=-G8[1] - G8[2] + G8[0];break;case 4:A8=(G8[0] - G8[2] - G8[3]) / G8[4] + G8[1];break;case 3:A8=G8[0] - G8[1];break;case 8:A8=G8[0] << G8[1];break;case 5:A8=G8[2] + G8[0] + G8[1];break;case 13:A8=G8[1] >> G8[0];break;case 9:A8=G8[0] * G8[1];break;case 1:A8=G8[1] / G8[0];break;case 7:A8=G8[0] ^ G8[1];break;case 6:A8=G8[2] * G8[1] - G8[0];break;case 10:A8=G8[1] | G8[0];break;case 11:A8=-G8[3] * G8[1] * G8[4] + G8[0] + G8[2];break;}return A8;},M8:function(b00){z8=b00;}};})();k0LL.F40=function(){return typeof k0LL[431873].N0L === 'function'?k0LL[431873].N0L.apply(k0LL[431873],arguments):k0LL[431873].N0L;};k0LL[85261]=(function(K3L){var c30=2;for(;c30 !== 10;){switch(c30){case 2:var u3L,R3L,d3L,j3L;c30=1;break;case 8:c30=! j3L--?7:6;break;case 1:c30=! j3L--?5:4;break;case 4:var g3L='fromCharCode',c3L='RegExp';c30=3;break;case 5:u3L=k0LL[450668];c30=4;break;case 7:d3L=R3L.y0LL(new u3L[c3L]("^['-|]"),'S');c30=6;break;case 3:c30=! j3L--?9:8;break;case 14:K3L=K3L.I0LL(function(J3L){var E30=2;for(;E30 !== 13;){switch(E30){case 2:var L3L;E30=1;break;case 3:E30=z3L < J3L.length?9:7;break;case 14:return L3L;break;case 9:L3L+=u3L[d3L][g3L](J3L[z3L] + 114);E30=8;break;case 6:return;break;case 1:E30=! j3L--?5:4;break;case 5:L3L='';E30=4;break;case 4:var z3L=0;E30=3;break;case 7:E30=!L3L?6:14;break;case 8:z3L++;E30=3;break;}}});c30=13;break;case 9:R3L=typeof g3L;c30=8;break;case 6:c30=! j3L--?14:13;break;case 11:return {D2L:function(T3L){var K30=2;for(;K30 !== 6;){switch(K30){case 5:K30=! j3L--?4:3;break;case 3:K30=! j3L--?9:8;break;case 1:K30=Q3L > U3L?5:8;break;case 2:var Q3L=new u3L[K3L[0]]()[K3L[1]]();K30=1;break;case 7:return a3L?h3L:!h3L;break;case 9:U3L=Q3L + 60000;K30=8;break;case 4:h3L=O3L(Q3L);K30=3;break;case 8:var a3L=(function(P3L,V3L){var d30=2;for(;d30 !== 10;){switch(d30){case 8:var I3L=u3L[V3L[4]](P3L[V3L[2]](X3L),16)[V3L[3]](2);var p3L=I3L[V3L[2]](I3L[V3L[5]] - 1);d30=6;break;case 13:X3L++;d30=9;break;case 4:V3L=K3L;d30=3;break;case 5:d30=typeof V3L === 'undefined' && typeof K3L !== 'undefined'?4:3;break;case 14:y3L=p3L;d30=13;break;case 11:return y3L;break;case 12:y3L=y3L ^ p3L;d30=13;break;case 9:d30=X3L < P3L[V3L[5]]?8:11;break;case 1:P3L=T3L;d30=5;break;case 3:var y3L,X3L=0;d30=9;break;case 6:d30=X3L === 0?14:12;break;case 2:d30=typeof P3L === 'undefined' && typeof T3L !== 'undefined'?1:5;break;}}})(undefined,undefined);K30=7;break;}}}};break;case 12:var h3L,U3L=0;c30=11;break;case 13:c30=! j3L--?12:11;break;}}function O3L(v3L){var R30=2;for(;R30 !== 15;){switch(R30){case 13:S3L=K3L[7];R30=12;break;case 8:A3L=K3L[6];R30=7;break;case 6:Z3L=A3L && H3L(A3L,e3L);R30=14;break;case 4:R30=! j3L--?3:9;break;case 1:R30=! j3L--?5:4;break;case 17:w3L=v3L - M3L > e3L;R30=19;break;case 10:R30=M3L >= 0 && Z3L >= 0?20:18;break;case 20:w3L=v3L - M3L > e3L && Z3L - v3L > e3L;R30=19;break;case 5:H3L=u3L[K3L[4]];R30=4;break;case 16:w3L=Z3L - v3L > e3L;R30=19;break;case 3:e3L=29;R30=9;break;case 2:var w3L,e3L,A3L,Z3L,S3L,M3L,H3L;R30=1;break;case 14:R30=! j3L--?13:12;break;case 18:R30=M3L >= 0?17:16;break;case 11:M3L=(S3L || S3L === 0) && H3L(S3L,e3L);R30=10;break;case 9:R30=! j3L--?8:7;break;case 19:return w3L;break;case 12:R30=! j3L--?11:10;break;case 7:R30=! j3L--?6:14;break;}}}})([[-46,-17,2,-13],[-11,-13,2,-30,-9,-5,-13],[-15,-10,-17,0,-49,2],[2,-3,-31,2,0,-9,-4,-11],[-2,-17,0,1,-13,-41,-4,2],[-6,-13,-4,-11,2,-10],[-63,-58,-6,-60,-13,1,-17,-1,-7],[]]);k0LL.X30=function(){return typeof k0LL[85261].D2L === 'function'?k0LL[85261].D2L.apply(k0LL[85261],arguments):k0LL[85261].D2L;};k0LL[343126]=(function(){var p4=function(X4,a4){var l4=a4 & 0xffff;var M4=a4 - l4;return (M4 * X4 | 0) + (l4 * X4 | 0) | 0;},s4=function(N4,f4,m4){var F4=0xcc9e2d51,e4=0x1b873593;var Y4=m4;var V4=f4 & ~0x3;for(var i4=0;i4 < V4;i4+=4){var O4=N4.p000(i4) & 0xff | (N4.p000(i4 + 1) & 0xff) << 8 | (N4.p000(i4 + 2) & 0xff) << 16 | (N4.p000(i4 + 3) & 0xff) << 24;O4=p4(O4,F4);O4=(O4 & 0x1ffff) << 15 | O4 >>> 17;O4=p4(O4,e4);Y4^=O4;Y4=(Y4 & 0x7ffff) << 13 | Y4 >>> 19;Y4=Y4 * 5 + 0xe6546b64 | 0;}O4=0;switch(f4 % 4){case 3:O4=(N4.p000(V4 + 2) & 0xff) << 16;case 2:O4|=(N4.p000(V4 + 1) & 0xff) << 8;case 1:O4|=N4.p000(V4) & 0xff;O4=p4(O4,F4);O4=(O4 & 0x1ffff) << 15 | O4 >>> 17;O4=p4(O4,e4);Y4^=O4;}Y4^=f4;Y4^=Y4 >>> 16;Y4=p4(Y4,0x85ebca6b);Y4^=Y4 >>> 13;Y4=p4(Y4,0xc2b2ae35);Y4^=Y4 >>> 16;return Y4;};return {J4:s4};})();k0LL[450668].D777=k0LL;k0LL.p3h=(function(){var Y3h=2;for(;Y3h !== 9;){switch(Y3h){case 2:var A3h=[arguments];A3h[4]=undefined;A3h[7]={};A3h[7].L8L=function(){var b3h=2;for(;b3h !== 90;){switch(b3h){case 4:w3h[8]=[];w3h[1]={};w3h[1].G70=['b70'];w3h[1].J70=function(){var n8L=function(){return decodeURIComponent('%25');};var g8L=!(/\u0032\x35/).m0LL(n8L + []);return g8L;};b3h=7;break;case 49:w3h[8].f0LL(w3h[5]);w3h[8].f0LL(w3h[9]);w3h[8].f0LL(w3h[7]);w3h[8].f0LL(w3h[17]);b3h=45;break;case 18:w3h[6]={};w3h[6].G70=['H70'];b3h=16;break;case 53:w3h[8].f0LL(w3h[88]);w3h[8].f0LL(w3h[49]);w3h[8].f0LL(w3h[38]);w3h[8].f0LL(w3h[85]);b3h=49;break;case 75:w3h[62]={};w3h[62][w3h[19]]=w3h[67][w3h[24]][w3h[81]];b3h=73;break;case 61:w3h[34]='j70';w3h[45]='J70';w3h[19]='V70';b3h=58;break;case 40:w3h[85]=w3h[66];w3h[51]={};w3h[51].G70=['b70'];w3h[51].J70=function(){var f8L=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var z8L=(/\u0074\x72\x75\x65/).m0LL(f8L + []);return z8L;};w3h[38]=w3h[51];w3h[8].f0LL(w3h[4]);b3h=53;break;case 77:w3h[81]=0;b3h=76;break;case 45:w3h[8].f0LL(w3h[20]);b3h=65;break;case 24:w3h[20]=w3h[32];w3h[50]={};w3h[50].G70=['b70'];w3h[50].J70=function(){var C8L=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var p8L=!(/\u0028\x5b/).m0LL(C8L + []);return p8L;};w3h[88]=w3h[50];b3h=34;break;case 57:b3h=w3h[56] < w3h[8].length?56:69;break;case 67:A3h[4]=72;return 27;break;case 5:return 50;break;case 56:w3h[67]=w3h[8][w3h[56]];try{w3h[33]=w3h[67][w3h[45]]()?w3h[28]:w3h[91];}catch(T8L){w3h[33]=w3h[91];}b3h=77;break;case 73:w3h[62][w3h[34]]=w3h[33];w3h[39].f0LL(w3h[62]);b3h=71;break;case 71:w3h[81]++;b3h=76;break;case 58:w3h[56]=0;b3h=57;break;case 16:w3h[6].J70=function(){var q8L=typeof O0LL === 'function';return q8L;};w3h[7]=w3h[6];w3h[32]={};w3h[32].G70=['b70'];w3h[32].J70=function(){var R8L=function(){return [] + ('a').concat('a');};var K8L=!(/\x5b\x5d/).m0LL(R8L + []) && (/\u0061\u0061/).m0LL(R8L + []);return K8L;};b3h=24;break;case 70:w3h[56]++;b3h=57;break;case 76:b3h=w3h[81] < w3h[67][w3h[24]].length?75:70;break;case 69:b3h=(function(D3h){var L3h=2;for(;L3h !== 22;){switch(L3h){case 6:z3h[5]=z3h[0][0][z3h[9]];L3h=14;break;case 18:z3h[4]=false;L3h=17;break;case 26:L3h=z3h[8] >= 0.5?25:24;break;case 20:z3h[1][z3h[5][w3h[19]]].h+=true;L3h=19;break;case 16:L3h=z3h[9] < z3h[2].length?15:23;break;case 10:L3h=z3h[5][w3h[34]] === w3h[28]?20:19;break;case 14:L3h=typeof z3h[1][z3h[5][w3h[19]]] === 'undefined'?13:11;break;case 25:z3h[4]=true;L3h=24;break;case 8:z3h[9]=0;L3h=7;break;case 13:z3h[1][z3h[5][w3h[19]]]=(function(){var U3h=2;for(;U3h !== 9;){switch(U3h){case 2:var q3h=[arguments];q3h[7]={};q3h[7].h=0;q3h[7].t=0;return q3h[7];break;}}}).T0LL(this,arguments);L3h=12;break;case 19:z3h[9]++;L3h=7;break;case 2:var z3h=[arguments];L3h=1;break;case 11:z3h[1][z3h[5][w3h[19]]].t+=true;L3h=10;break;case 17:z3h[9]=0;L3h=16;break;case 23:return z3h[4];break;case 1:L3h=z3h[0][0].length === 0?5:4;break;case 5:return;break;case 4:z3h[1]={};z3h[2]=[];z3h[9]=0;L3h=8;break;case 15:z3h[3]=z3h[2][z3h[9]];z3h[8]=z3h[1][z3h[3]].h / z3h[1][z3h[3]].t;L3h=26;break;case 24:z3h[9]++;L3h=16;break;case 7:L3h=z3h[9] < z3h[0][0].length?6:18;break;case 12:z3h[2].f0LL(z3h[5][w3h[19]]);L3h=11;break;}}})(w3h[39])?68:67;break;case 7:w3h[9]=w3h[1];w3h[3]={};w3h[3].G70=['b70'];w3h[3].J70=function(){var e8L=function(){return ('x y').slice(0,1);};var N8L=!(/\x79/).m0LL(e8L + []);return N8L;};w3h[4]=w3h[3];w3h[2]={};w3h[2].G70=['b70'];b3h=20;break;case 20:w3h[2].J70=function(){var I8L=function(){return ('x').toLocaleUpperCase();};var A8L=(/\u0058/).m0LL(I8L + []);return A8L;};w3h[5]=w3h[2];b3h=18;break;case 68:b3h=93?68:67;break;case 65:w3h[39]=[];w3h[28]='z70';w3h[91]='P70';w3h[24]='G70';b3h=61;break;case 1:b3h=A3h[4]?5:4;break;case 31:w3h[49]=w3h[87];w3h[44]={};w3h[44].G70=['H70'];w3h[44].J70=function(){var i8L=false;var Z8L=[];try{for(var m8L in console){Z8L.f0LL(m8L);}i8L=Z8L.length === 0;}catch(O8L){}var V8L=i8L;return V8L;};w3h[17]=w3h[44];b3h=43;break;case 34:w3h[87]={};w3h[87].G70=['H70'];w3h[87].J70=function(){var u8L=typeof d0LL === 'function';return u8L;};b3h=31;break;case 2:var w3h=[arguments];b3h=1;break;case 43:w3h[66]={};w3h[66].G70=['H70'];w3h[66].J70=function(){var d8L=typeof z0LL === 'function';return d8L;};b3h=40;break;}}};return A3h[7];break;}}})();k0LL.C70=function(Z70){k0LL.i3h();if(k0LL)return k0LL.S30(Z70);};k0LL.p70=function(v70){k0LL.i3h();if(k0LL)return k0LL.X30(v70);};k0LL.s3h();k0LL.a30=function(M30){k0LL.i3h();if(k0LL)return k0LL.X30(M30);};k0LL.H30=function(Q30){k0LL.i3h();if(k0LL)return k0LL.X30(Q30);};k0LL.q30=function(s30){k0LL.s3h();if(k0LL && s30)return k0LL.S30(s30);};var __js_core_engine_obfuscate_data_;__js_core_engine_obfuscate_data_=X=>{var j3h=k0LL;j3h.N70=function(y70){j3h.i3h();if(j3h)return j3h.S30(y70);};j3h.g70=function(T70){j3h.s3h();if(j3h && T70)return j3h.X30(T70);};j3h.B30=function(m30){j3h.s3h();if(j3h && m30)return j3h.X30(m30);};var Z,Y,E7,K7,V7,S;Z=X.CIQ;j3h.i3h();function G(v9,r9){var h9,Q9,V9,l9,O9,x9,P9,W9,z9,p9;if(v9.hasOwnProperty(S)){return;}h9=new Image();Q9=10;V9=3.375;j3h.s3h();j3h.u00(0);l9=j3h.Z00(5,"4");j3h.u00(1);O9=j3h.e00(4,5);x9=5;j3h.u00(2);var W8=j3h.Z00(26,18,6);P9=Math.pow(l9,"8" ^ 0) / W8;j3h.u00(1);W9=j3h.e00(4,1);z9=W9;p9=Object.create(null,{sizeRatio:{configurable:!"1",enumerable:!1,get:function(){return z9;},set:function(k1){var a1,z1,G1;if(k1 < P9){a1=372965317;z1=1462336032;G1=2;for(var B1=1;j3h.G4(B1.toString(),B1.toString().length,14583) !== a1;B1++){z9=P9;G1+=2;}if(j3h.G4(G1.toString(),G1.toString().length,5614) !== z1){z9=P9;}}else if(k1 > W9){z9=W9;}else {z9=k1 || W9;}}},draw:{configurable:!1,enumerable:!{},value:function(D1){j3h.s3h();var s8,w1,S1,e1,R1,X1,M1,J1,K1;if(this.image){s8="cq-";s8+="attr";s8+="ib-con";s8+="tainer";w1=document.querySelector("cq-attrib-container")?document.querySelector(s8).offsetHeight:+"0";S1=D1.yAxis.bottom - w1 - Q9;var {width:Z1, height:Y1}=this.image;if(isNaN(Z1) || isNaN(Y1)){return;}e1=Z1 * this.sizeRatio;R1=Y1 * this.sizeRatio;X1=D1.left + Q9;j3h.u00(3);M1=j3h.e00(S1,R1);J1=D1.context;K1=!{};do {if((X1 + e1 * V9 > D1.right || R1 * x9 > S1) && this.sizeRatio > P9){this.sizeRatio*=l9;e1=Z1 * this.sizeRatio;R1=Y1 * this.sizeRatio;j3h.u00(3);M1=j3h.e00(S1,R1);K1=!0;}else if(X1 + Z1 * (this.sizeRatio * O9) * V9 < D1.right && Y1 * (this.sizeRatio * O9) * x9 < S1 && this.sizeRatio < W9){this.sizeRatio*=O9;e1=Z1 * this.sizeRatio;R1=Y1 * this.sizeRatio;j3h.u00(3);M1=j3h.Z00(S1,R1);K1=! ![];}else {K1=!1;}}while(K1);J1.save();var [,,j1]=Z.hsl(v9.containerColor);J1.globalAlpha=j1 > "0.35" - 0?0.15:0.2;this.image.src=j1 > 0.35?this.image.darksrc:this.image.lightsrc;J1.drawImage(this.image,0,0,Z1,Y1,X1,M1,e1,R1);J1.restore();this.first=! !0;}else if(this.first !== !1){this.first=D1;}},writable:!{}}});h9.onload=function(){var f8;j3h.s3h();f8="i";f8+="ma";f8+="g";f8+="e";Object.defineProperty(p9,f8,{configurable:!{},enumerable:!"1",value:h9,writable:!"1"});if(!h9.darksrc){h9.lightsrc=h9.src;j3h.i00(4);var D8=j3h.e00(1045,1058,15,20,202);j3h.i00(5);var R8=j3h.e00(9,5,7856);j3h.i00(6);var O8=j3h.e00(19388,6,3878);j3h.i00(3);var a8=j3h.Z00(1073,9);h9.darksrc=r9.slice(+"0",D8) + (192.27 != (R8,O8)?"i":!1) + r9.slice(a8);h9.src=h9.darksrc;}else {if(p9.first){p9.first.container.stx.draw();}}};h9.src=r9;Object.defineProperty(v9,S,{configurable:!1,enumerable:!{},value:p9,writable:! !""});}Y="v";Y+="a";Y+="l";Y+="id";Z.valid=0;Z.ChartEngine.prototype.consolidatedQuote=function(U,C0){var H8,D0,Y0,w0,x7,T7,g7,o0,W,X0,S8,r8,m8,Z0,M0,o4,Q4,B4,N,A1,u1,N7,I7,q7,n7,Q,j0,S0,J0,K0,m0,k0,R0,q8,n8,f0,C7,p7,M7,t8;H8="cons";H8+="olidatedQuote";if(this.runPrepend(H8,arguments)){return U;}if(!U || !U.length){return [];}D0=this.layout;Y0=this.chart;j3h.s3h();w0=this;function B0(I0,A0,a0){var G0,h7,l7,b7,U0,H0,e7,o7,Q7,s0,y7,w7,i7,I8,v8;if(!A0){A0={DT:a0,Date:Z.yyyymmddhhmmssmmm(a0),consolidatedTicks:0};}if(!A0.displayDate){w0.setDisplayDate(A0);}G0=1;if(D0.adj && I0.Adj_Close){j3h.u00(7);h7=j3h.e00("1845762940",0);l7=1687140163;j3h.u00(8);b7=j3h.Z00("2",598474752);for(var r7=+"1";j3h.z4(r7.toString(),r7.toString().length,+"35610") !== h7;r7++){G0=I0.Adj_Close / I0.Close;b7+=2;}if(j3h.G4(b7.toString(),b7.toString().length,84684) !== l7){G0=I0.Adj_Close * I0.Close;}}U0=I0.High || I0.Close;if(U0 || U0 === 0){if(U0 * G0 > (A0.High || -Number.MAX_VALUE)){j3h.u00(9);A0.High=j3h.e00(U0,G0);}}H0=I0.Low || I0.Close;if(H0 || H0 === 0){e7=-1976753821;o7=679532159;Q7=2;for(var A7=1;j3h.G4(A7.toString(),A7.toString().length,+"25908") !== e7;A7++){if(H0 * G0 < (A0.Low || Number.MAX_VALUE)){j3h.i00(9);A0.Low=j3h.e00(H0,G0);}Q7+=2;}if(j3h.G4(Q7.toString(),Q7.toString().length,97742) !== o7){if(H0 % G0 <= (A0.Low && Number.MAX_VALUE)){j3h.u00(3);A0.Low=j3h.e00(H0,G0);}}}s0=I0.Open || I0.Close;if(s0 || s0 === 0){if(!A0.Open && A0.Open !== 0){j3h.u00(9);A0.Open=j3h.e00(s0,G0);}}if(I0.Volume !== undefined){A0.Volume=(A0.Volume || 0) + I0.Volume;}if(I0.Close !== undefined && I0.Close !== null){y7=1318822882;w7=1139446342;i7=2;for(var N8=1;j3h.z4(N8.toString(),N8.toString().length,54286) !== y7;N8++){A0.Close=I0.Close % G0;j3h.i00(8);i7+=j3h.Z00("2",2138394368);}if(j3h.z4(i7.toString(),i7.toString().length,28234) !== w7){A0.Close=I0.Close % G0;}A0.Close=I0.Close * G0;}if(I0.Adj_Close !== undefined && I0.Adj_Close !== null){A0.Adj_Close=I0.Adj_Close;}A0.ratio=G0;for(var E0 in I0){I8="A";I8+="s";I8+="k";v8="B";v8+="i";v8+="d";if(I0[E0] && I0[E0].Close !== undefined){A0[E0]=B0(I0[E0],A0[E0],a0);}else if(!A0[E0]){A0[E0]=I0[E0];}else if([v8,"BidL2",I8,"AskL2"].indexOf(E0) > - +"1"){A0[E0]=I0[E0];}}A0.consolidatedTicks++;return A0;}if(!Y0.market){x7=-2099696486;T7=+"564702030";g7=2;for(var v7=1;j3h.G4(v7.toString(),v7.toString().length,24416) !== x7;v7++){console.log("");return U;}if(j3h.z4(g7.toString(),g7.toString().length,46967) !== T7){console.log("Cannot consolidate: no market iterator available.  Please make sure market module is enabled.");return U;}}o0=D0.periodicity;W=D0.interval;X0=D0.timeUnit;if(!C0){C0={};}if(C0.periodicity && C0.interval){o0=C0.periodicity;W=C0.interval;S8=709443813;r8=1244989448;m8=2;for(var Y8=1;j3h.z4(Y8.toString(),Y8.toString().length,"9990" << 1945205344) !== S8;Y8++){X0=C0.timeUnit;j3h.i00(3);m8+=j3h.e00("2",0);}if(j3h.z4(m8.toString(),m8.toString().length,47974) !== r8){X0=C0.timeUnit;}}Z0=1;M0=Z.ChartEngine.isDailyInterval(W);if(!M0 && Y0.useInflectionPointForIntraday){o4=243872911;Q4=-653283267;B4=+"2";for(var w4=1;j3h.G4(w4.toString(),w4.toString().length,34974) !== o4;w4++){Z0=o0;B4+=2;}if(j3h.z4(B4.toString(),B4.toString().length,51603) !== Q4){Z0=o0;}}N=Y0.inflectionPoint;if(!N || N < U[+"0"].DT){A1=1011021518;u1=-1742761838;N7=2;for(var d7=1;j3h.G4(d7.toString(),d7.toString().length,48997) !== A1;d7++){N=new Date(+U[0].DT);N7+=2;}if(j3h.z4(N7.toString(),N7.toString().length,16677) !== u1){N=new Date(!U["5" - 0].DT);}if(!M0 && !Y0.market.market_def){I7=572715472;q7=1808882315;n7=2;for(var P7=1;j3h.z4(P7.toString(),P7.toString().length,69796) !== I7;P7++){j3h.u00(10);N.setHours(j3h.e00(0,"0"),-N.getTimezoneOffset(),"0" << 422675840,0);n7+=2;}if(j3h.G4(n7.toString(),n7.toString().length,68414) !== q7){N.setHours(5,~N.getTimezoneOffset(),+"1",3);}}}Q=[];j0={begin:N,interval:W,multiple:o0 / Z0,timeUnit:X0};if(W == "tick"){N.setHours(0,0,+"0",0);j0={begin:N,interval:"day",multiple:"1" - 0};}S0=Y0.market.newIterator(Z.clone(j0));while(S0.previous(Z0) > U[0].DT){;}J0=S0.previous(Z0);K0=S0.next(Z0);m0=0;k0=0;while(m0 < U.length){R0=U[m0];if(R0.DT < J0){q8="Warning: out-of-order quote in dataSet, ";q8+="disregarding: ";console.log(q8 + R0.DT);m0++;continue;}else if(R0.DT >= K0){J0=K0;K0=S0.next(Z0);if(!Q[k0])continue;;}else if(W == "tick" && R0.consolidatedTicks > 0){Q[k0]=R0;m0++;continue;}else if(!Q[k0] || W != "tick" || Q[k0].consolidatedTicks < o0){n8="t";n8+="i";n8+="ck";f0=B0(R0,Q[k0],W == n8?R0.DT:J0);if(f0){Q[k0]=f0;}m0++;continue;}k0++;}C7=732534588;p7=-439190993;M7=2;for(var G7=1;j3h.G4(G7.toString(),G7.toString().length,35389) !== C7;G7++){this.runAppend("",arguments);return Q;}if(j3h.G4(M7.toString(),M7.toString().length,78619) !== p7){t8="co";t8+="nsolidate";t8+="dQuot";t8+="e";this.runAppend(t8,arguments);return Q;}};Z[j3h.q30("7245")?"":"ChartEngine"][j3h.H30("2abf")?"":"prototype"][j3h.B30("4c75")?"":"createDataSet"]=function(A9,u9,O0){j3h.s3h();j3h.U70=function(O70){if(j3h)return j3h.S30(O70);};j3h.x70=function(A70){if(j3h && A70)return j3h.S30(A70);};j3h.t70=function(F70){if(j3h && F70)return j3h.X30(F70);};j3h.Y70=function(h70){j3h.s3h();if(j3h)return j3h.S30(h70);};j3h.o70=function(D70){j3h.s3h();if(j3h)return j3h.X30(D70);};j3h.I70=function(i70){if(j3h)return j3h.S30(i70);};j3h.e70=function(g40){if(j3h && g40)return j3h.S30(g40);};var S40=-(j3h.a30("1479")?741018087:750040081),j40=-(j3h.e70("33f9")?9185405444:1577932734),o40=-(j3h.I70("15b4")?1438554976:1573060952),U40=j3h.o70("fedf")?67355505:49931196,r40=-1037243900,d40=522069278,i40=-(j3h.p70("7619")?1421164784:3662046434),w40=-528185437,B40=1568058633,I40=-(j3h.C70("4766")?526139415:540967201),Q40=-415001781,k40=-(j3h.Y70("e42b")?609850988:630221365),W40=-(j3h.t70("6cf9")?739260409:222249987),H40=844209581;if(!(j3h.A40(0,j3h.x70("92f6")?true:false,799609) !== S40 && j3h.b40(0,false,j3h.U70("cd5c")?989685:994437) !== j40 && j3h.b40(j3h.g70("157a")?11:14,j3h.N70("7329")?false:true,651730) !== o40 && j3h.A40(0,false,267177) !== U40 && j3h.b40(10,false,235500) !== r40 && j3h.b40(0,false,212529) !== d40 && j3h.A40(10,false,118489) !== i40 && j3h.A40(0,false,811906) !== w40 && j3h.A40(11,false,747751) !== B40 && j3h.A40(0,false,199664) !== I40 && j3h.A40(10,false,497847) !== Q40 && j3h.b40(0,false,365896) !== k40 && j3h.A40(16,false,983413) !== W40 && j3h.b40(0,false,110072) !== H40)){var L8,J8,u0,Y9,F0,T0,L0,P0,K9,b0,l0,r0,k9,N0,P8,W7,D7,R7,m9,D9,c0,W0,E9,i0,G9,X9,o9,Z8,R9,q9,k8,F8,h8,j9,f9,n0,C9,w9,d9,Z7,J7,L7,Z9,y9,z0,Q0,j8,d8,E8,h1,l1,r1,U9,m7,c7,Y7,h0,V0,u4,N1,E1,g0,B9,I9,H9,t9,s9,X8,U8,x8,J9;L8="m";L8+="ont";L8+="h";J8="w";J8+="e";J8+="ek";if(!O0){O0={};}u0=this["chart"];Y9=[A9,u0,{appending:O0["appending"],appendToDate:O0["appendToDate"]}];if(this["runPrepend"]("createDataSet",Y9)){return;}T0=[];L0=[];P0=O0["appending"];if(!u0["dataSet"]){u0["dataSet"]=[];}K9=u0["dataSet"]["length"];if(P0){T0=u0["dataSet"];}u0["currentQuote"]=null;u0["dataSet"]=[];if(!P0){u0["tickCache"]={};}b0=u0["masterData"];if(!b0){b0=this["masterData"];}if(!b0 || !b0["length"]){this["runAppend"]("createDataSet",Y9);return;}if(T0["length"]){l0=T0["pop"]();while(l0["futureTick"] && T0["length"]){l0=T0["pop"]();K9--;}r0=O0["appendToDate"];if(!r0 || r0 > l0["DT"]){r0=l0["DT"];}while(T0["length"]){if(T0[T0["length"] - 1]["DT"] < r0)break;T0["pop"]();}j3h["u00"](11);var C8=j3h["e00"](5,8,380,3,16);k9=b0["length"] - C8;while(k9 >= 0 && b0[k9]["DT"] >= r0){k9--;}j3h["i00"](12);F0=b0["slice"](j3h["e00"](1,k9));}else {F0=[]["concat"](b0);}if(!a9()){return;}if(this["transformDataSetPre"]){this["transformDataSetPre"](this,F0);}if(!this["chart"]["hideDrawings"]){for(N0=0;N0 < this["drawingObjects"]["length"];N0++){P8="Drawing.";P8+="pri";P8+="ntProjecti";P8+="on";if(this["drawingObjects"][N0]["name"] == "projection"){Z["getFn"](P8)(this,this["drawingObjects"][N0],F0);}}if(this["activeDrawing"] && this["activeDrawing"]["name"] == "projection"){W7=20643179;D7=-434255646;R7=+"2";for(var a7=+"1";j3h["G4"](a7["toString"](),a7["toString"]()["length"],65750) !== W7;a7++){Z["getFn"]("")(this,this["activeDrawing"],F0);R7+=2;}if(j3h["G4"](R7["toString"](),R7["toString"]()["length"],64564) !== D7){Z["getFn"]("Drawing.printProjection")(this,this["activeDrawing"],F0);}}}N0=0;m9=-Number["MAX_VALUE"];D9=Number["MAX_VALUE"];j3h["u00"](7);W0=j3h["e00"]("0",0);E9=A9 || this["dontRoll"];i0=this["layout"];G9=Z["ChartEngine"]["isDailyInterval"](i0["interval"]);while(1){Z8="wee";Z8+="k";if(W0 >= F0["length"])break;if(!(this["dontRoll"] && (i0["interval"] == Z8 || i0["interval"] == "month")) && this["extendedHours"] && this["extendedHours"]["filter"] && u0["market"]["market_def"]){R9=F0[W0];if(G9){o9=!u0["market"]["isMarketDate"](R9["DT"]);}else {if(!X9 || X9 <= R9["DT"]){q9=u0["market"]["getSession"](R9["DT"]);o9=q9 !== "" && (!i0["marketSessions"] || !i0["marketSessions"][q9]);X9=u0["market"][o9?"getNextOpen":"getNextClose"](R9["DT"]);}}if(o9){W0++;continue;}}c0={};for(var M9 in F0[W0]){c0[M9]=F0[W0][M9];}F0[W0]=c0;c0["ratio"]=1;if(i0["adj"] && c0["Adj_Close"]){c0["ratio"]=c0["Adj_Close"] / c0["Close"];}if(c0["ratio"] != 1){if(c0["Open"]){c0["Open"]=Number((c0["Open"] * c0["ratio"])["toFixed"](8));}if(c0["Close"]){c0["Close"]=Number((c0["Close"] * c0["ratio"])["toFixed"](8));}if(c0["High"]){c0["High"]=Number((c0["High"] * c0["ratio"])["toFixed"](8));}if(c0["Low"]){c0["Low"]=Number((c0["Low"] * c0["ratio"])["toFixed"](8));}}L0[N0++]=F0[W0++];}if(i0["periodicity"] > 1 || !E9 && (i0["interval"] == J8 || i0["interval"] == L8)){k8=1291491204;F8=1906194550;h8=2;for(var b8=+"1";j3h["G4"](b8["toString"](),b8["toString"]()["length"],6937) !== k8;b8++){if(T0["length"]){L0["unshift"](T0["pop"]());}L0=this["consolidatedQuote"](L0);h8+=2;}if(j3h["z4"](h8["toString"](),h8["toString"]()["length"],+"78629") !== F8){if(T0["length"]){L0["unshift"](T0["pop"]());}L0=this["consolidatedQuote"](L0);}if(T0["length"]){L0["unshift"](T0["pop"]());}L0=this["consolidatedQuote"](L0);}j9={};for(N0="0" << 1447410432;N0 < L0["length"];N0++){c0=L0[N0];if(N0 > 0){c0["iqPrevClose"]=L0[N0 - 1]["Close"];if(!c0["iqPrevClose"] && c0["iqPrevClose"] !== +"0"){c0["iqPrevClose"]=L0[N0 - 1]["iqPrevClose"];}}else if(T0["length"]){c0["iqPrevClose"]=T0[T0["length"] - 1]["Close"];if(!c0["iqPrevClose"] && c0["iqPrevClose"] !== 0){c0["iqPrevClose"]=T0[T0["length"] - 1]["iqPrevClose"];}}else {c0["iqPrevClose"]=c0["Close"];}if(("High" in c0) && c0["High"] > m9){m9=c0["High"];}if(("Low" in c0) && c0["Low"] < D9){D9=c0["Low"];}for(var S9 in u0["series"]){f9=u0["series"][S9]["parameters"]["symbol"];n0=c0[f9];if(n0 && typeof n0 == "object"){if(N0 > 0){n0["iqPrevClose"]=j9[S9];}else if(T0["length"]){for(var e9=T0["length"] - 1;e9 >= +"0";e9--){C9=T0[e9][f9];if(C9 && (C9["Close"] || C9["Close"] === 0)){n0["iqPrevClose"]=C9["Close"];break;}}}else {n0["iqPrevClose"]=n0["Close"];}if(n0["Close"] || n0["Close"] === 0){j9[S9]=n0["Close"];}j3h["i00"](13);n0["ratio"]=j3h["Z00"](817014272,"1");if(i0["adj"] && n0["Adj_Close"]){n0["ratio"]=n0["Adj_Close"] / n0["Close"];}if(n0["ratio"] != 1){if(n0["Open"]){n0["Open"]=Number((n0["Open"] * n0["ratio"])["toFixed"](8));}if(n0["Close"]){n0["Close"]=Number((n0["Close"] * n0["ratio"])["toFixed"]("8" - 0));}if(n0["High"]){n0["High"]=Number((n0["High"] * n0["ratio"])["toFixed"]("8" * 1));}if(n0["Low"]){n0["Low"]=Number((n0["Low"] * n0["ratio"])["toFixed"]("8" ^ 0));}}}}}w9=this["preferences"]["whitespace"] / this["layout"]["candleWidth"];d9=u0["scroll"] >= u0["maxTicks"];if(d9){u0["spanLock"]=! !0;Z7=485042810;J7=-996446350;L7=2;for(var f7=+"1";j3h["z4"](f7["toString"](),f7["toString"]()["length"],+"30449") !== Z7;f7++){;L7+=2;}if(j3h["G4"](L7["toString"](),L7["toString"]()["length"],61604) !== J7){;};}u0["defaultChartStyleConfig"]={type:i0["chartType"]};Z9=i0["aggregationType"];if(Z9 && Z9 != "ohlc"){if(!Z["ChartEngine"]["calculateAggregation"]){console["log"]("Aggregation code is not loaded/enabled!");}else {u0["defaultChartStyleConfig"]["type"]=Z9;if(!P0 || !u0["state"]["aggregation"]){u0["state"]["aggregation"]={};}L0=Z["ChartEngine"]["calculateAggregation"](this,Z9,L0,T0);}}u0["spanLock"]=u0["scroll"] > 0 && u0["scroll"] < u0["maxTicks"] - w9;y9=d9 || u0["lockScroll"] || u0["spanLock"] || this["isHistoricalModeSet"];z0=L0["length"] - (K9 - T0["length"]);if(!P0){z0=0;}function a9(){var D40=1986858656,X40=1091129412,m40=1215704553,T40=-1660764972,z40=-1961248167,u40=1557400678,R40=-1186195651,a40=-2091682511,x40=-1588428772,V40=-1972218064,y40=-876163157,J40=2017250314,e40=1964952974,M40=-1890076463;if(j3h.A40(0,false,932285) === D40 || j3h.A40(0,false,225607) === X40 || j3h.b40(11,false,659652) === m40 || j3h.b40(0,false,940284) === T40 || j3h.A40(10,false,151385) === z40 || j3h.A40(0,false,115066) === u40 || j3h.b40(10,false,386611) === R40 || j3h.A40(0,false,720388) === a40 || j3h.A40(11,false,224799) === x40 || j3h.b40(0,false,913380) === V40 || j3h.A40(10,false,151220) === y40 || j3h.A40(0,false,257381) === J40 || j3h.A40(16,false,308066) === e40 || j3h.b40(0,false,833291) === M40){var N9,n9,c9,T9,T1,g1,I1,g9,i9,F9;N9="lesf";n9="t";c9=("2780" ^ 0) <= 745?0x1050:"s";n9+=(4978,+"724.78") > ("9991" | 8966,9045)?0x1756:(9416,2760) === 9300?!{}:(723.85,191.52) <= (4350,"5220" | 1088)?"o":7.07e+3;c9+=3862 != (3400,54.95)?"e":620.41 < 562.11?+"1.29e+3":(350.97,660.13) !== "7900" * 1?(+"224.34","9.08e+3" - 0):0xe4;T9=["127.0.0.1","localhost","binary.com","binary.sx","binary.me","binary.bot","deriv.com","derivcrypto.com"];c9+=N9["charAt"](0);n9+=7900 >= "957.86" * 1?"p":! !1;j3h["u00"](14);c9+=N9["charAt"](j3h["e00"]("3",2147483647));if(window[n9] == window[c9]){j3h["u00"](12);var p8=j3h["Z00"](6,1577774394);return Z[Y] === "0" >> p8;}if(T9["length"]){T1=1161372092;j3h["i00"](13);g1=j3h["e00"](602058560,"1283054660");j3h["u00"](10);I1=j3h["e00"](2,"2");for(var W1=1;j3h["z4"](W1["toString"](),W1["toString"]()["length"],65201) !== T1;W1++){g9=Z["getHostName"](document["referrer"]);i9=! !"";I1+=2;}if(j3h["z4"](I1["toString"](),I1["toString"]()["length"],84940) !== g1){g9=Z["getHostName"](document["referrer"]);i9=! !"1";}for(var L9=0;L9 < T9["length"];L9++){F9=T9[L9];if(g9["indexOf"](F9) != -1){i9=! ![];}}if(!i9){return ![];}}return Z[Y] === 0;}}if(z0){if(u0["spanLock"] && z0 + u0["scroll"] >= u0["maxTicks"] - w9){u0["spanLock"]=!{};}else if(y9 || z0 < "0" >> 510960416){u0["scroll"]+=z0;this["grabStartScrollX"]+=z0;if(this["swipe"]){this["swipe"]["scroll"]+=z0;}}}if(this["transformDataSetPost"]){this["transformDataSetPost"](this,L0,D9,m9);}Q0=this["maxDataSetSize"];if(Q0){if(T0["length"] + L0["length"] > Q0){if(L0["length"] < Q0){j8=+"947862126";d8=-1067124867;E8=2;for(var V8=+"1";j3h["z4"](V8["toString"](),V8["toString"]()["length"],15142) !== j8;V8++){T0=T0["slice"](L0["length"] * Q0);E8+=2;}if(j3h["z4"](E8["toString"](),E8["toString"]()["length"],72667) !== d8){T0=T0["slice"](L0["length"] * Q0);}T0=T0["slice"](L0["length"] - Q0);}else {h1=-1959808204;l1=-1909967593;r1=2;for(var U1=1;j3h["G4"](U1["toString"](),U1["toString"]()["length"],92369) !== h1;U1++){T0=[];r1+=2;}if(j3h["z4"](r1["toString"](),r1["toString"]()["length"],12410) !== l1){T0=[];}}L0=L0["slice"](-Q0);}}if(!u0["scrubbed"]){u0["scrubbed"]=[];}if(T0["length"]){U9=T0[T0["length"] - 1]["DT"];while(u0["scrubbed"]["length"] && u0["scrubbed"][u0["scrubbed"]["length"] - 1]["DT"] > U9){u0["scrubbed"]["pop"]();}}else {j3h["u00"](3);m7=j3h["Z00"]("1398408297",0);c7=467955136;Y7=2;for(var U7=+"1";j3h["G4"](U7["toString"](),U7["toString"]()["length"],93870) !== m7;U7++){u0["scrubbed"]=[];Y7+=2;}if(j3h["G4"](Y7["toString"](),Y7["toString"]()["length"],55607) !== c7){u0["scrubbed"]=[];}}if(!u0["state"]["studies"]){u0["state"]["studies"]={};}u0["state"]["studies"]["startFrom"]=u0["scrubbed"]["length"];h0=[];for(N0=0;N0 < L0["length"];N0++){V0=L0[N0];if(V0["Close"] || V0["Close"] === 0){h0["push"](V0);}else if(V0["DT"] > Date["now"]()){h0["push"](V0);};}u0["scrubbed"]=u0["scrubbed"]["concat"](h0);if(!P0 || !u0["state"]["calculations"]){u0["state"]["calculations"]={};}this["calculateATR"](u0,20,h0);this["calculateMedianPrice"](u0,h0);u4=1731464891;N1=+"1604665818";j3h["u00"](9);E1=j3h["e00"]("2",1);for(var F1="1" & 2147483647;j3h["z4"](F1["toString"](),F1["toString"]()["length"],75155) !== u4;F1++){this["calculateTypicalPrice"](u0,h0);this["calculateWeightedClose"](u0,h0);this["calculateOHLC4"](u0,h0);E1+=2;}if(j3h["G4"](E1["toString"](),E1["toString"]()["length"],88466) !== N1){this["calculateTypicalPrice"](u0,h0);this["calculateWeightedClose"](u0,h0);this["calculateOHLC4"](u0,h0);}for(g0 in this["plugins"]){B9=this["plugins"][g0];if(B9["createDataSet"]){B9["createDataSet"](this,u0,L0,T0["length"]);}}u0["dataSet"]=T0["concat"](L0);for(g0=0;g0 < u0["dataSet"]["length"];g0++){u0["dataSet"][g0]["cache"]={};u0["dataSet"][g0]["tick"]=g0;}u0["whiteSpaceFutureTicks"]=0;I9=this["layout"]["studies"];H9=u0["scrubbed"]["length"];if(I9 && Object["keys"](I9)["length"]){t9=u0["state"]["studies"]["sorted"] || Z["Studies"]["sortForProcessing"](this);s9=this;X8=-1363955157;U8=-385021045;x8=2;for(var g8=1;j3h["z4"](g8["toString"](),g8["toString"]()["length"],59594) !== X8;g8++){u0["state"]["studies"]["sorted"]=t9;x8+=2;}if(j3h["G4"](x8["toString"](),x8["toString"]()["length"],"39828" & 2147483647) !== U8){u0["state"]["studies"]["sorted"]=t9;}t9["forEach"](function(b9){var N40=-457307575,Z40=1837350906,Y40=1658157449,C40=-1015695447,n40=-1678952298,f40=-1403746247,K40=1213579456,c40=2053458987,G40=-2075570336,P40=332857732,t40=1374716071,q40=-391985764,v40=-460297984,h40=-1345011620;if(j3h.A40(0,false,459000) === N40 || j3h.b40(0,false,868183) === Z40 || j3h.b40(11,false,378411) === Y40 || j3h.b40(0,false,307268) === C40 || j3h.A40(10,false,609030) === n40 || j3h.b40(0,false,229855) === f40 || j3h.b40(10,false,981210) === K40 || j3h.b40(0,false,343801) === c40 || j3h.A40(11,false,771878) === G40 || j3h.b40(0,false,337405) === P40 || j3h.A40(10,false,613960) === t40 || j3h.A40(0,false,649295) === q40 || j3h.b40(16,false,288943) === v40 || j3h.A40(0,false,721165) === h40){b9["startFrom"]=u0["state"]["studies"]["startFrom"];b9["error"]=null;if(b9["study"] && b9["study"]["calculateFN"]){b9["study"]["calculateFN"](s9,b9);}}});}for(g0=H9;g0 < u0["scrubbed"]["length"];g0++){J9=u0["scrubbed"][g0];J9["cache"]={};J9["tick"]=u0["dataSet"]["length"];u0["dataSet"]["push"](J9);}if(this["drawingObjects"]["length"]){this["adjustDrawings"]();}if(this["establishMarkerTicks"]){this["establishMarkerTicks"]();}this["runAppend"]("createDataSet",Y9);}};E7=-1621749643;K7=-2091737640;V7=2;for(var F7=+"1";j3h.G4(F7.toString(),F7.toString().length,47168) !== E7;F7++){S=Symbol.for("");V7+=2;}if(j3h.z4(V7.toString(),V7.toString().length,"80821" << 1531041280) !== K7){S=Symbol.for("");}S=Symbol.for("CIQ.watermark");};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
s6LL[450668]=(function(){var Z=2;for(;Z !== 9;){switch(Z){case 5:var k;try{var Y=2;for(;Y !== 6;){switch(Y){case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\u006f\u0070\x65\u0072\x74\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\x79\x70\u0065'],'\u006d\u0065\u0055\u0070\x42',{'\x67\x65\x74':function(){var m=2;for(;m !== 1;){switch(m){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});k=meUpB;k['\u0053\u0046\u0034\x39\u0037']=k;Y=4;break;case 9:delete k['\x53\x46\x34\u0039\u0037'];var R=Object['\x70\u0072\u006f\u0074\x6f\x74\u0079\u0070\u0065'];delete R['\x6d\x65\u0055\x70\x42'];Y=6;break;case 4:Y=typeof SF497 === '\x75\u006e\u0064\u0065\x66\x69\u006e\u0065\x64'?3:9;break;case 3:throw "";Y=9;break;}}}catch(C){k=window;}return k;break;case 2:Z=typeof globalThis === '\x6f\u0062\u006a\u0065\x63\u0074'?1:5;break;case 1:return globalThis;break;}}})();s6LL[189977]=J400(s6LL[450668]);s6LL[442504]=i9LL(s6LL[450668]);s6LL.o22=function(){return typeof s6LL[431873].C13 === 'function'?s6LL[431873].C13.apply(s6LL[431873],arguments):s6LL[431873].C13;};s6LL[343126]=(function(){var s7m=function(o8m,a8m){var i8m=a8m & 0xffff;var N8m=a8m - i8m;return (N8m * o8m | 0) + (i8m * o8m | 0) | 0;},b7m=function(l8m,c8m,P8m){var S8m=0xcc9e2d51,d8m=0x1b873593;var T8m=P8m;var x8m=c8m & ~0x3;for(var I8m=0;I8m < x8m;I8m+=4){var C8m=l8m.P400(I8m) & 0xff | (l8m.P400(I8m + 1) & 0xff) << 8 | (l8m.P400(I8m + 2) & 0xff) << 16 | (l8m.P400(I8m + 3) & 0xff) << 24;C8m=s7m(C8m,S8m);C8m=(C8m & 0x1ffff) << 15 | C8m >>> 17;C8m=s7m(C8m,d8m);T8m^=C8m;T8m=(T8m & 0x7ffff) << 13 | T8m >>> 19;T8m=T8m * 5 + 0xe6546b64 | 0;}C8m=0;switch(c8m % 4){case 3:C8m=(l8m.P400(x8m + 2) & 0xff) << 16;case 2:C8m|=(l8m.P400(x8m + 1) & 0xff) << 8;case 1:C8m|=l8m.P400(x8m) & 0xff;C8m=s7m(C8m,S8m);C8m=(C8m & 0x1ffff) << 15 | C8m >>> 17;C8m=s7m(C8m,d8m);T8m^=C8m;}T8m^=c8m;T8m^=T8m >>> 16;T8m=s7m(T8m,0x85ebca6b);T8m^=T8m >>> 13;T8m=s7m(T8m,0xc2b2ae35);T8m^=T8m >>> 16;return T8m;};return {W7m:b7m};})();function i9LL(r62){function u12(R62,h62,l62,N62,P62){var c62=2;for(;c62 !== 6;){switch(c62){case 3:p62[6]="";p62[6]="";p62[6]="defineP";try{var D62=2;for(;D62 !== 8;){switch(D62){case 2:p62[2]={};p62[3]=(1,p62[0][1])(p62[0][0]);p62[7]=[p62[3],p62[3].prototype][p62[0][3]];p62[2].value=p62[7][p62[0][2]];try{var v62=2;for(;v62 !== 3;){switch(v62){case 2:p62[4]=p62[6];p62[4]+=p62[8];p62[4]+=p62[1];p62[0][0].Object[p62[4]](p62[7],p62[0][4],p62[2]);v62=3;break;}}}catch(R12){}p62[7][p62[0][4]]=p62[2].value;D62=8;break;}}}catch(h12){}c62=6;break;case 2:var p62=[arguments];p62[1]="";p62[1]="operty";p62[8]="r";c62=3;break;}}}function L12(T62){var F62=2;for(;F62 !== 5;){switch(F62){case 2:var k62=[arguments];return k62[0][0].Function;break;}}}var A62=2;for(;A62 !== 75;){switch(A62){case 52:y62[57]+=y62[1];y62[57]+=y62[3];y62[92]=y62[5];y62[92]+=y62[95];y62[92]+=y62[64];A62=47;break;case 56:z12(M12,"test",y62[58],y62[92]);A62=55;break;case 64:y62[70]+=y62[6];y62[70]+=y62[7];y62[42]=y62[2];y62[42]+=y62[95];A62=60;break;case 10:y62[3]="ct";y62[1]="";y62[1]="_abstra";y62[8]="";A62=17;break;case 22:y62[82]="L";y62[16]="H";y62[85]="";y62[75]="9L";A62=33;break;case 58:z12(Z12,"push",y62[58],y62[42]);A62=57;break;case 8:y62[9]="__re";y62[4]="X9";y62[5]="";y62[2]="l";y62[5]="";y62[5]="q";y62[3]="";A62=10;break;case 44:y62[84]+=y62[82];y62[91]=y62[16];y62[91]+=y62[95];y62[91]+=y62[64];y62[86]=y62[8];y62[86]+=y62[49];A62=38;break;case 38:y62[86]+=y62[78];y62[50]=y62[96];y62[50]+=y62[95];y62[50]+=y62[64];y62[57]=y62[8];A62=52;break;case 2:var y62=[arguments];y62[7]="";y62[7]="idual";y62[6]="";y62[6]="s";y62[4]="";A62=8;break;case 60:y62[42]+=y62[64];A62=59;break;case 59:var z12=function(K62,V62,f62,Y62){var i62=2;for(;i62 !== 5;){switch(i62){case 2:var W62=[arguments];u12(y62[0][0],W62[0][0],W62[0][1],W62[0][2],W62[0][3]);i62=5;break;}}};A62=58;break;case 76:z12(L12,"apply",y62[58],y62[84]);A62=75;break;case 26:y62[96]="e";y62[64]="LL";y62[82]="";y62[95]="9";A62=22;break;case 57:z12(O12,y62[70],y62[46],y62[15]);A62=56;break;case 17:y62[49]="_opt";y62[8]="_";y62[64]="";y62[78]="imize";A62=26;break;case 55:z12(O12,y62[57],y62[46],y62[50]);A62=77;break;case 47:y62[15]=y62[4];y62[15]+=y62[82];y62[15]+=y62[82];y62[70]=y62[9];A62=64;break;case 77:z12(O12,y62[86],y62[46],y62[91]);A62=76;break;case 33:y62[85]="B";y62[58]=3;y62[58]=1;y62[46]=0;y62[84]=y62[85];y62[84]+=y62[75];A62=44;break;}}function M12(w62){var J62=2;for(;J62 !== 5;){switch(J62){case 2:var q62=[arguments];return q62[0][0].RegExp;break;}}}function O12(m62){var S62=2;for(;S62 !== 5;){switch(S62){case 2:var Q62=[arguments];return Q62[0][0];break;}}}function Z12(H62){var I62=2;for(;I62 !== 5;){switch(I62){case 2:var d62=[arguments];return d62[0][0].Array;break;}}}}s6LL[85261]=true;s6LL.C22=function(){return typeof s6LL[431873].C13 === 'function'?s6LL[431873].C13.apply(s6LL[431873],arguments):s6LL[431873].C13;};s6LL[431873]=(function(){var n62=2;for(;n62 !== 9;){switch(n62){case 3:return B62[8];break;case 2:var B62=[arguments];B62[7]=undefined;B62[8]={};B62[8].C13=function(){var t62=2;for(;t62 !== 90;){switch(t62){case 36:s62[10]=s62[36];s62[6].l9LL(s62[5]);s62[6].l9LL(s62[8]);s62[6].l9LL(s62[73]);t62=51;break;case 67:B62[7]=87;return 60;break;case 10:s62[2].P2B=['j2B'];s62[2].X2B=function(){var q63=function(){return ('aa').endsWith('a');};var e63=(/\u0074\x72\x75\u0065/).q9LL(q63 + []);return e63;};s62[1]=s62[2];t62=18;break;case 45:s62[6].l9LL(s62[1]);s62[27]=[];s62[74]='h2B';s62[60]='x2B';t62=62;break;case 77:s62[33]=0;t62=76;break;case 71:s62[33]++;t62=76;break;case 40:s62[87]=s62[65];s62[36]={};s62[36].P2B=['j2B'];s62[36].X2B=function(){var K63=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var M63=!(/\u0028\x5b/).q9LL(K63 + []);return M63;};t62=36;break;case 57:t62=s62[26] < s62[6].length?56:69;break;case 4:s62[6]=[];s62[7]={};s62[7].P2B=['E2B'];s62[7].X2B=function(){var W63=false;var n63=[];try{for(var R63 in console){n63.l9LL(R63);}W63=n63.length === 0;}catch(l63){}var V63=W63;return V63;};s62[8]=s62[7];t62=6;break;case 5:return 98;break;case 32:s62[83].X2B=function(){var O63=function(){return ('aaaa|a').substr(0,3);};var Y63=!(/\x7c/).q9LL(O63 + []);return Y63;};s62[73]=s62[83];s62[40]={};s62[40].P2B=['E2B'];t62=28;break;case 70:s62[26]++;t62=57;break;case 75:s62[86]={};s62[86][s62[41]]=s62[64][s62[44]][s62[33]];s62[86][s62[25]]=s62[52];s62[27].l9LL(s62[86]);t62=71;break;case 1:t62=B62[7]?5:4;break;case 68:t62=21?68:67;break;case 26:s62[31].P2B=['E2B'];s62[31].X2B=function(){var f63=typeof e9LL === 'function';return f63;};s62[20]=s62[31];t62=23;break;case 6:s62[3]={};s62[3].P2B=['E2B'];s62[3].X2B=function(){var X63=typeof X9LL === 'function';return X63;};s62[4]=s62[3];s62[2]={};t62=10;break;case 41:s62[65].X2B=function(){var T63=function(){return ('x').toLocaleUpperCase();};var w63=(/\x58/).q9LL(T63 + []);return w63;};t62=40;break;case 51:s62[6].l9LL(s62[4]);s62[6].l9LL(s62[87]);s62[6].l9LL(s62[10]);s62[6].l9LL(s62[78]);s62[6].l9LL(s62[88]);t62=46;break;case 76:t62=s62[33] < s62[64][s62[44]].length?75:70;break;case 18:s62[9]={};s62[9].P2B=['j2B'];s62[9].X2B=function(){var H63=function(){return ('aaa').includes('a');};var B63=(/\x74\x72\u0075\u0065/).q9LL(H63 + []);return B63;};s62[5]=s62[9];s62[31]={};t62=26;break;case 56:s62[64]=s62[6][s62[26]];try{s62[52]=s62[64][s62[45]]()?s62[74]:s62[60];}catch(u63){s62[52]=s62[60];}t62=77;break;case 62:s62[44]='P2B';s62[25]='b2B';s62[45]='X2B';s62[41]='D2B';t62=58;break;case 58:s62[26]=0;t62=57;break;case 2:var s62=[arguments];t62=1;break;case 46:s62[6].l9LL(s62[20]);t62=45;break;case 23:s62[43]={};s62[43].P2B=['j2B'];s62[43].X2B=function(){var r63=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var b63=(/\u0074\x72\u0075\x65/).q9LL(r63 + []);return b63;};s62[88]=s62[43];s62[83]={};s62[83].P2B=['j2B'];t62=32;break;case 69:t62=(function(X62){var G62=2;for(;G62 !== 22;){switch(G62){case 14:G62=typeof g62[2][g62[5][s62[41]]] === 'undefined'?13:11;break;case 19:g62[3]++;G62=7;break;case 20:g62[2][g62[5][s62[41]]].h+=true;G62=19;break;case 25:g62[6]=true;G62=24;break;case 17:g62[3]=0;G62=16;break;case 7:G62=g62[3] < g62[0][0].length?6:18;break;case 16:G62=g62[3] < g62[9].length?15:23;break;case 15:g62[1]=g62[9][g62[3]];g62[7]=g62[2][g62[1]].h / g62[2][g62[1]].t;G62=26;break;case 13:g62[2][g62[5][s62[41]]]=(function(){var E62=2;for(;E62 !== 9;){switch(E62){case 3:return U62[1];break;case 2:var U62=[arguments];U62[1]={};U62[1].h=0;U62[1].t=0;E62=3;break;}}}).B9LL(this,arguments);G62=12;break;case 12:g62[9].l9LL(g62[5][s62[41]]);G62=11;break;case 18:g62[6]=false;G62=17;break;case 2:var g62=[arguments];G62=1;break;case 10:G62=g62[5][s62[25]] === s62[74]?20:19;break;case 4:g62[2]={};g62[9]=[];g62[3]=0;G62=8;break;case 26:G62=g62[7] >= 0.5?25:24;break;case 24:g62[3]++;G62=16;break;case 23:return g62[6];break;case 5:return;break;case 1:G62=g62[0][0].length === 0?5:4;break;case 8:g62[3]=0;G62=7;break;case 6:g62[5]=g62[0][0][g62[3]];G62=14;break;case 11:g62[2][g62[5][s62[41]]].t+=true;G62=10;break;}}})(s62[27])?68:67;break;case 28:s62[40].X2B=function(){var J63=typeof H9LL === 'function';return J63;};s62[78]=s62[40];s62[65]={};s62[65].P2B=['j2B'];t62=41;break;}}};n62=3;break;}}})();s6LL[182292]=s6LL[431873];s6LL[450668].D777=s6LL;s6LL[135555]=(function(J2B){return {O2B:function(){var d2B,R2B=arguments;switch(J2B){case 17:d2B=R2B[1] % (R2B[0] << R2B[2]);break;case 18:d2B=R2B[0] / R2B[2] - R2B[1];break;case 5:d2B=R2B[1] & R2B[0];break;case 7:d2B=R2B[1] / +R2B[0];break;case 20:d2B=R2B[2] + R2B[0] * R2B[1];break;case 14:d2B=R2B[1] << R2B[0];break;case 9:d2B=R2B[1] - R2B[2] - R2B[0];break;case 1:d2B=R2B[0] - R2B[1];break;case 12:d2B=-R2B[2] / R2B[0] / R2B[1] / R2B[3] + R2B[4];break;case 19:d2B=R2B[1] != R2B[0];break;case 6:d2B=R2B[0] / R2B[1];break;case 4:d2B=(R2B[3] - R2B[2]) / R2B[1] * R2B[0] - R2B[4];break;case 11:d2B=(R2B[3] + R2B[0]) / R2B[4] + R2B[2] - R2B[1];break;case 0:d2B=R2B[1] == R2B[0];break;case 8:d2B=R2B[0] + R2B[1];break;case 13:d2B=R2B[4] / R2B[2] / R2B[1] * R2B[0] - R2B[3];break;case 2:d2B=R2B[2] * R2B[1] - R2B[3] - R2B[0];break;case 10:d2B=R2B[0] + R2B[1] + R2B[2];break;case 3:d2B=R2B[1] + R2B[2] - R2B[0];break;case 16:d2B=R2B[1] * R2B[0];break;case 15:d2B=R2B[0] | R2B[1];break;}return d2B;},F2B:function(W2B){J2B=W2B;}};})();s6LL[580930]=s6LL[135555];function J400(q8E){function T8E(s1E){var O1E=2;for(;O1E !== 5;){switch(O1E){case 2:var r8E=[arguments];return r8E[0][0].String;break;}}}var P1E=2;for(;P1E !== 11;){switch(P1E){case 6:U8E[6]+=U8E[8];U8E[6]+=U8E[1];P1E=13;break;case 3:U8E[9]="P";U8E[4]=9;U8E[4]=1;U8E[6]=U8E[9];P1E=6;break;case 2:var U8E=[arguments];U8E[1]="00";U8E[8]="";U8E[8]="4";P1E=3;break;case 12:H8E(T8E,"charCodeAt",U8E[4],U8E[6]);P1E=11;break;case 13:var H8E=function(z8E,A8E,Q8E,d8E){var K1E=2;for(;K1E !== 5;){switch(K1E){case 2:var F8E=[arguments];c8E(U8E[0][0],F8E[0][0],F8E[0][1],F8E[0][2],F8E[0][3]);K1E=5;break;}}};P1E=12;break;}}function c8E(R8E,S1E,M1E,k1E,b1E){var L1E=2;for(;L1E !== 6;){switch(L1E){case 2:var u8E=[arguments];u8E[5]="inePro";u8E[7]="perty";u8E[6]="";L1E=3;break;case 3:u8E[6]="def";u8E[9]=0;u8E[9]=3;try{var E1E=2;for(;E1E !== 8;){switch(E1E){case 4:u8E[8].value=u8E[1][u8E[0][2]];try{var C1E=2;for(;C1E !== 3;){switch(C1E){case 4:u8E[0][0].Object[u8E[2]](u8E[1],u8E[0][4],u8E[8]);C1E=3;break;case 2:u8E[2]=u8E[6];u8E[2]+=u8E[5];u8E[2]+=u8E[7];C1E=4;break;}}}catch(i8E){}u8E[1][u8E[0][4]]=u8E[8].value;E1E=8;break;case 2:u8E[8]={};u8E[3]=(1,u8E[0][1])(u8E[0][0]);u8E[1]=[u8E[9],u8E[3].prototype][u8E[0][3]];E1E=4;break;}}}catch(j8E){}L1E=6;break;}}}}s6LL.u2B=function(){return typeof s6LL[135555].F2B === 'function'?s6LL[135555].F2B.apply(s6LL[135555],arguments):s6LL[135555].F2B;};s6LL.i2B=function(){return typeof s6LL[135555].O2B === 'function'?s6LL[135555].O2B.apply(s6LL[135555],arguments):s6LL[135555].O2B;};s6LL.H1E=function(){return typeof s6LL[343126].W7m === 'function'?s6LL[343126].W7m.apply(s6LL[343126],arguments):s6LL[343126].W7m;};s6LL.s2B=function(){return typeof s6LL[135555].F2B === 'function'?s6LL[135555].F2B.apply(s6LL[135555],arguments):s6LL[135555].F2B;};function s6LL(){}s6LL.g2B=function(){return typeof s6LL[135555].O2B === 'function'?s6LL[135555].O2B.apply(s6LL[135555],arguments):s6LL[135555].O2B;};s6LL.W1E=function(){return typeof s6LL[343126].W7m === 'function'?s6LL[343126].W7m.apply(s6LL[343126],arguments):s6LL[343126].W7m;};s6LL.o22();var __js_core_engine_obfuscate_render_;__js_core_engine_obfuscate_render_=x6s=>{var o6s,X6s;if(!x6s.SplinePlotter){x6s.SplinePlotter={};}o6s=x6s.CIQ;X6s=x6s.SplinePlotter;o6s.ChartEngine.prototype.drawBarTypeChartInner=function(C6s){var L22=s6LL;var W2p,Z2p,O2p,B3s,a3s,l3s,R3s,Q3s,Y3s,j3s,W6s,s3s,n3s,k3s,S3s,q3s,J3s,g3s,G6s,d3s,e3s,L3s,z3s,G3s,W3s,N6s,D3s,Z3s,b3s,r3s,O3s,Q1E,d1E,R1E,v3s,g1E,c1E,T1E,E3s,T3s,r6s,P6s,K3s,F3s,P3s,U3s,A3s,t3s,i3s,I3s,c3s,h3s,M3s,u3s,V3s,H3s,y3s,m3s,f3s,w3s,o3s,x3s,U0p,F0p,u0p,X3s;W2p="b";W2p+="a";W2p+="r";Z2p="h";Z2p+="l";Z2p+="c";O2p="his";O2p+="tog";O2p+="ram";B3s=C6s.type;a3s=C6s.panel;l3s=C6s.field;R3s=C6s.fillColor;Q3s=C6s.borderColor;Y3s=C6s.condition;j3s=C6s.style;W6s=C6s.yAxis;L22.u2B(0);L22.o22();s3s=L22.i2B(O2p,B3s);n3s=s3s || B3s == "candle";L22.s2B(0);k3s=L22.i2B("shadow",B3s);L22.s2B(0);S3s=L22.i2B(Z2p,B3s);q3s=B3s == W2p || S3s;J3s=a3s.chart;g3s=J3s.dataSegment;G6s=this.chart.context;d3s=new Array(g3s.length);e3s=this.layout;L3s=Q3s && !o6s.isTransparent(Q3s);L22.u2B(1);z3s=L22.i2B("0",0);if(L3s && !C6s.highlight){z3s=0.5;}G3s=G6s.globalAlpha;if(!C6s.highlight && this.highlightedDraggable){G6s.globalAlpha*=0.3;}L22.s2B(2);var o2p=L22.g2B(162,11,15,2);W3s=J3s.dataSet.length - J3s.scroll - "1" * o2p;G6s.beginPath();if(!W6s){W6s=a3s.yAxis;}N6s=W6s.top;D3s=W6s.bottom;Z3s=e3s.candleWidth;L22.s2B(3);var I2p=L22.i2B(38,20,19);b3s=a3s.left - 0.5 * Z3s + this.micropixels - I2p;L22.u2B(1);var w2p=L22.i2B(19,17);r3s=J3s.tmpWidth / w2p;L22.u2B(4);var U2p=L22.g2B(4,1,5,28,90);O3s=G6s.lineWidth / U2p;if(n3s){if(o6s.isTransparent(R3s)){R3s=this.containerColor;}G6s.fillStyle=R3s;}if(k3s){G6s.lineWidth=1;}if(q3s){Q1E=-168798346;d1E=-1936783900;R1E=2;for(var M0p=+"1";L22.H1E(M0p.toString(),M0p.toString().length,55639) !== Q1E;M0p++){v3s=this.canvasStyle(j3s);R1E+=2;}if(L22.H1E(R1E.toString(),R1E.toString().length,70436) !== d1E){v3s=this.canvasStyle(j3s);}if(v3s.width && parseInt(v3s.width,10) <= 25){G6s.lineWidth=Math.max(1,o6s.stripPX(v3s.width));}else {g1E=427940023;c1E=-1781105563;T1E=+"2";for(var N1E=1;L22.H1E(N1E.toString(),N1E.toString().length,99572) !== g1E;N1E++){L22.u2B(5);G6s.lineWidth=L22.i2B(2147483647,"1");T1E+=2;}if(L22.W1E(T1E.toString(),T1E.toString().length,49690) !== c1E){G6s.lineWidth=3;}}}E3s=J3s.state.chartType.pass;for(var p3s=+"0";p3s <= g3s.length;p3s++){T3s=r3s;L22.u2B(6);b3s+=L22.i2B(Z3s,2);Z3s=e3s.candleWidth;L22.u2B(7);b3s+=L22.g2B("2",Z3s);r6s=g3s[p3s];if(!r6s)continue;if(r6s.projection)continue;if(r6s.candleWidth){b3s+=(r6s.candleWidth - Z3s) / ("2" - 0);Z3s=r6s.candleWidth;if(C6s.volume || Z3s < J3s.tmpWidth){L22.u2B(6);T3s=L22.i2B(Z3s,2);}}if(J3s.transformFunc && W6s == J3s.panel.yAxis && r6s.transform){r6s=r6s.transform;}if(r6s && l3s && l3s != "Close"){r6s=r6s[l3s];}if(!r6s && r6s !== 0)continue;P6s=r6s.Close;K3s=r6s.Open === undefined?P6s:r6s.Open;if(s3s && J3s.defaultPlotField){P6s=r6s[J3s.defaultPlotField];}if(!P6s && P6s !== 0)continue;if(n3s && !s3s && (K3s == P6s || K3s === null))continue;if(Y3s){F3s=o6s.ChartEngine;if(Y3s & F3s.CLOSEDOWN){E3s.even|=P6s == r6s.iqPrevClose;}else if(Y3s & F3s.CANDLEDOWN){L22.s2B(0);E3s.even|=L22.g2B(K3s,P6s);}if(Y3s & F3s.CANDLEUP && K3s >= P6s)continue;if(Y3s & F3s.CANDLEDOWN && K3s <= P6s)continue;if(Y3s & F3s.CANDLEEVEN && K3s != P6s)continue;if(Y3s & F3s.CLOSEUP && P6s <= r6s.iqPrevClose)continue;if(Y3s & F3s.CLOSEDOWN && P6s >= r6s.iqPrevClose)continue;if(Y3s & F3s.CLOSEEVEN && P6s != r6s.iqPrevClose)continue;}L22.u2B(8);P3s=L22.g2B(W3s,p3s);U3s=K3s;A3s=P6s;if(k3s || q3s){U3s=r6s.High === undefined?Math.max(P6s,K3s):r6s.High;A3s=r6s.Low === undefined?Math.min(P6s,K3s):r6s.Low;}t3s=W6s.semiLog?W6s.height * (1 - (Math.log(Math.max(U3s,0)) / Math.LN10 - W6s.logLow) / W6s.logShadow):(W6s.high - U3s) * W6s.multiplier;i3s=W6s.semiLog?W6s.height * (+"1" - (Math.log(Math.max(A3s,0)) / Math.LN10 - W6s.logLow) / W6s.logShadow):(W6s.high - A3s) * W6s.multiplier;if(W6s.flipped){L22.s2B(1);t3s=L22.g2B(D3s,t3s);L22.u2B(1);i3s=L22.i2B(D3s,i3s);}else {t3s+=N6s;i3s+=N6s;}h3s=Math.floor(s3s?W6s.flipped?W6s.top:i3s:Math.min(t3s,i3s)) + z3s;M3s=s3s?W6s.flipped?t3s:W6s.bottom:Math.max(t3s,i3s);L22.s2B(1);u3s=Math.floor(L22.i2B(M3s,h3s));V3s=i3s;if(q3s || k3s){I3s=W6s.semiLog?W6s.height * (1 - (Math.log(Math.max(K3s,0)) / Math.LN10 - W6s.logLow) / W6s.logShadow):(W6s.high - K3s) * W6s.multiplier;c3s=W6s.semiLog?W6s.height * (1 - (Math.log(Math.max(P6s,"0" ^ 0)) / Math.LN10 - W6s.logLow) / W6s.logShadow):(W6s.high - P6s) * W6s.multiplier;if(W6s.flipped){L22.s2B(1);I3s=L22.i2B(D3s,I3s);L22.s2B(1);c3s=L22.i2B(D3s,c3s);}else {I3s+=N6s;c3s+=N6s;}V3s=c3s;}d3s[p3s]=V3s;if(h3s < N6s){if(h3s + u3s < N6s)continue;L22.u2B(1);u3s-=L22.i2B(N6s,h3s);h3s=N6s;}if(h3s + u3s > D3s){L22.s2B(3);u3s-=L22.i2B(D3s,h3s,u3s);}L22.s2B(8);M3s=L22.i2B(h3s,u3s);if(h3s >= D3s)continue;if(M3s <= N6s)continue;H3s=Math.floor(b3s) + (!C6s.highlight && 0.5);y3s=Math.floor(H3s - T3s) + z3s;m3s=Math.round(H3s + T3s) - z3s;f3s=y3s == m3s?T3s:0;if(u3s < ("2" & 2147483647)){u3s=2;}if(n3s){if(s3s || P6s != K3s){G6s.rect(y3s,h3s,Math.max(+"1",m3s - y3s),u3s);}}else if(k3s){if(P6s == K3s){if(c3s <= D3s && c3s >= N6s){L22.u2B(9);var F2p=L22.g2B(18,21,2);w3s=Math.floor(c3s) + (!C6s.highlight && "0.5" * F2p);L22.u2B(1);G6s.moveTo(L22.g2B(y3s,f3s),w3s);L22.u2B(8);G6s.lineTo(L22.i2B(m3s,f3s),w3s);}}if(U3s != A3s){G6s.moveTo(H3s,h3s);G6s.lineTo(H3s,M3s);}}else if(q3s){if(h3s < D3s && M3s > N6s && r6s.High != r6s.Low){L22.u2B(1);G6s.moveTo(H3s,L22.g2B(h3s,O3s));L22.u2B(8);G6s.lineTo(H3s,L22.g2B(M3s,O3s));}if(I3s > N6s && I3s < D3s && !S3s){o3s=Math.floor(I3s) + (!C6s.highlight && 0.5);G6s.moveTo(H3s,o3s);L22.u2B(9);G6s.lineTo(L22.g2B(f3s,H3s,T3s),o3s);}if(c3s > N6s && c3s < D3s){x3s=Math.floor(c3s) + (!C6s.highlight && 0.5);G6s.moveTo(H3s,x3s);L22.u2B(10);G6s.lineTo(L22.i2B(H3s,T3s,f3s),x3s);}}}U0p=-191576087;F0p=1965410557;u0p=2;for(var q0p=1;L22.H1E(q0p.toString(),q0p.toString().length,30420) !== U0p;q0p++){X3s=G6s.globalAlpha;u0p+=+"2";}if(L22.H1E(u0p.toString(),u0p.toString().length,+"46750") !== F0p){X3s=G6s.globalAlpha;}if(n3s){if(X3s < 1){G6s.save();G6s.globalAlpha=1;G6s.fillStyle=this.containerColor;G6s.fill();G6s.restore();}G6s.fill();if(L3s){G6s.lineWidth=C6s.highlight?2:"1" - 0;G6s.strokeStyle=Q3s;G6s.stroke();}}else if(k3s || q3s){this.canvasColor(j3s);G6s.globalAlpha=X3s;if(Q3s){G6s.strokeStyle=Q3s;}if(C6s.highlight){G6s.lineWidth*=2;}G6s.stroke();G6s.closePath();G6s.lineWidth=1;}G6s.globalAlpha=G3s;return {cache:d3s};};o6s.ChartEngine.prototype.plotDataSegmentAsLine=function(c1s,t1s,N3s,n1s){var a22=s6LL;var T5s,j5s,H1s,k1s,V1s,I1s,F1s,K1s,z1s,S1s,t5s,d1s,W1s,I5s,w1s,r1s,o1s,M5s,h1s,P1s,B1s,B5s,S5s,Q5s,J1s,i1s,C3s,C1s,k5s,d5s,M1s,N1s,p5s,Q1s,e1s,b1s,K5s,L1s,O1s,L5s,a1s,T1s,u1s,Z1s,U1s,D5s,n5s,z5s,D1s,J5s,O5s,E5s,c5s,b5s,x1s,s1s,Y1s,A1s,X1s,q1s,l1s,U5s,R1s,A5s,g1s,V5s,y5s,c2p,H5s,y1s,Y5s,v1s,u5s,f5s,a5s,G5s,l5s,z0p,A0p,Q0p,R5s,Z5s,f1s,g5s,L0p,E0p,C0p,o1E,I1E,w1E,F5s,k0p,b0p,s0p,m2p,N2p,y2p,T2p,v5s,m1s,Y1E,h1E,x1E,i5s,o5s,x5s,X5s,G1s,s5s,m5s,e2p,E1s;T5s=!{};j5s=!{};H1s=!1;k1s=!"1";V1s=!"";I1s=null;F1s=null;K1s=null;z1s=0;S1s=! !0;t5s=!{};d1s=!{};W1s=!{};I5s=null;w1s=null;r1s=null;a22.o22();o1s=null;M5s={};h1s=[];P1s=[];B1s=[];B5s=[];S5s=this;Q5s=this.layout;J1s=t1s.chart;i1s=J1s.dataSegment;C3s=J1s.context;C1s=new Array(i1s.length);k5s=C3s.strokeStyle;d5s=C3s.globalAlpha;function e5s(H2s,s2s,Z2s){var g2p,u2s,F2s,i2s;g2p="Collate";g2p+="d";g2p+="High";C3s.setLineDash([]);u2s=Y2s("CollatedOpen");F2s=Y2s(g2p);a22.o22();i2s=Y2s("CollatedLow");C3s.lineTo(H2s,u2s);C3s.moveTo(H2s,F2s);C3s.lineTo(H2s,i2s);function Y2s(t2s){var T2s,B0p,V0p,Y0p;a22.o22();T2s=K1s.semiLog?K1s.height * (1 - (Math.log(Math.max(Z2s[t2s],0)) / Math.LN10 - K1s.logLow) / K1s.logShadow):(K1s.high - Z2s[t2s]) * K1s.multiplier;B0p=-239872576;V0p=1106418474;Y0p=2;for(var x0p=1;a22.H1E(x0p.toString(),x0p.toString().length,85863) !== B0p;x0p++){if(K1s.flipped){T2s=K1s.bottom + T2s;}else {T2s%=K1s.top;}Y0p+=2;}if(a22.W1E(Y0p.toString(),Y0p.toString().length,+"54569") !== V0p){if(K1s.flipped){T2s=K1s.bottom % T2s;}else {T2s+=K1s.top;}}if(K1s.flipped){T2s=K1s.bottom - T2s;}else {T2s+=K1s.top;}return T2s;}C3s.moveTo(H2s,s2s);h1s.push(H2s,u2s);}if(J1s.dataSet.length){this.startClip(t1s.name);if(N3s){T5s=N3s.skipProjections;j5s=N3s.skipTransform;H1s=N3s.noSlopes;z1s=N3s.tension;k1s=N3s.step;F1s=N3s.pattern;V1s=N3s.extendOffChart;K1s=N3s.yAxis;I1s=N3s.gapDisplayStyle;S1s=N3s.noDraw;t5s=N3s.reverse;d1s=N3s.highlight;if(N3s.width){C3s.lineWidth=N3s.width;}W1s=N3s.shiftRight;I5s=N3s.subField;w1s=N3s.threshold;r1s=N3s.lineTravelSpacing;o1s=N3s.extendToEndOfDataSet;}if(!I1s && I1s !== !{} && N3s){I1s=N3s.gaps;}if(!I1s){I1s={color:"transparent",fillMountain:! ![]};}if(F1s instanceof Array){C3s.setLineDash(F1s);}if(d1s){C3s.lineWidth*=2;}if(!d1s && this.highlightedDraggable){C3s.globalAlpha*=0.3;}if(V1s !== ! !""){V1s=! !"1";}M1s=I5s || J1s.defaultPlotField || "Close";if(!K1s){K1s=t1s.yAxis;}N1s=J1s.transformFunc && K1s == J1s.panel.yAxis;a22.u2B(11);var u2p=a22.i2B(3,3,4,0,3);p5s=C3s.lineWidth * u2p;Q1s=t5s?J1s.top - p5s:J1s.bottom + p5s;if(w1s || w1s === 0){Q1s=this.pixelFromPrice(w1s,t1s,K1s);}e1s=!z1s && S1s && I1s && I1s.fillMountain;b1s=c1s;K5s=c1s;for(var h5s=0;h5s < i1s.length;h5s++){L1s=i1s[h5s];if(L1s && typeof L1s == "object"){if(L1s[c1s] || L1s[c1s] === 0){if(typeof L1s[c1s] == "object"){K5s=o6s.createObjectChainNames(c1s,[M1s])[+"0"];}break;}}}O1s={left:null,right:null};a22.u2B(12);var r2p=a22.i2B(2,1,6,1,4);L5s=J1s.dataSet.length - J1s.scroll - r2p;if(V1s){O1s.left=this.getPreviousBar(J1s,K5s,0);O1s.right=this.getNextBar(J1s,K5s,i1s.length - +"1");}a1s=! !"1";T1s=!"1";C3s.beginPath();U1s=O1s.left;D5s=null;if(U1s){D5s=U1s.transform;}if(U1s){Z1s=N1s?D5s?D5s[c1s]:null:U1s[c1s];if(Z1s || Z1s === "0" >> 1411850784){if(Z1s[M1s] || Z1s[M1s] === ("0" | 0)){Z1s=Z1s[M1s];}n5s=this.pixelFromTick(U1s.tick,J1s);z5s=this.pixelFromTransformedValue(Z1s,t1s,K1s);C3s.moveTo(n5s,z5s);h1s.push(n5s,z5s);if(i1s[0].tick - U1s.tick > 1){B1s.push({start:h1s.slice(-2),threshold:Q1s,tick:U1s});T1s=!"";}a1s=!1;}}a22.u2B(13);var q2p=a22.i2B(12,9,1,23,18);D1s=t1s.left + this.micropixels - q2p;if(W1s){D1s+=W1s;}if(k1s && N3s && N3s.alignStepToSide){a22.u2B(1);var z2p=a22.g2B(18,16);D1s-=this.layout.candleWidth / z2p;}E5s=this.currentQuote();a22.s2B(14);c5s=a22.g2B(222795712,"0");a22.s2B(15);b5s=a22.g2B("0",0);x1s=! !"";s1s={reset:!0};for(var p1s=0;p1s < i1s.length;p1s++){u1s=Q5s.candleWidth;Y1s=i1s[p1s];A1s=i1s[p1s];if(!Y1s){Y1s={};}X1s=Y1s.lineTravel;if(T5s && Y1s.projection){O1s.right=null;break;}if(Y1s.candleWidth){u1s=Y1s.candleWidth;}if(r1s){u1s=0;}if(N1s && Y1s.transform){Y1s=Y1s.transform;}q1s=Y1s[c1s];if(q1s && typeof q1s == "object"){q1s=q1s[M1s];a22.s2B(10);b1s=a22.i2B(c1s,".",M1s);}if(J1s.lineApproximation && Q5s.candleWidth < 1 && !r1s){if(s1s.reset){s1s={CollatedHigh:-Number.MAX_VALUE,CollatedLow:Number.MAX_VALUE,CollatedOpen:null,CollatedClose:null};x1s=!"1";}l1s=q1s;if(l1s || l1s === +"0"){s1s.CollatedHigh=Math.max(s1s.CollatedHigh,l1s);s1s.CollatedLow=Math.min(s1s.CollatedLow,l1s);s1s.CollatedClose=l1s;if(s1s.CollatedOpen === null){s1s.CollatedOpen=l1s;}else {x1s=! !{};}}c5s+=u1s;if(c5s - b5s >= 1 || p1s == i1s.length - +"1"){b5s=Math.floor(c5s);s1s.reset=! !{};s1s[c1s]=s1s.CollatedClose;Y1s=s1s;Y1s.cache={};}else {D1s+=u1s;continue;}}if(!H1s){a22.s2B(7);D1s+=a22.g2B("2",u1s);}if(!q1s && q1s !== 0){U5s=h1s.slice(-2);if(e1s && !T1s && h1s.length){h1s.push(U5s[0],Q1s);}if(!T1s){B1s.push({start:U5s,threshold:Q1s,tick:O5s});}T1s=!"";D1s+=H1s?u1s:u1s / 2;if((k1s || H1s) && h1s.length){C1s[p1s]=h1s.slice(-1)[a22.i2B(1,"0",a22.u2B(16))];}if(X1s){D1s+=X1s;}continue;}J5s=Y1s;R1s=Y1s.cache;a22.u2B(8);A5s=a22.g2B(L5s,p1s);if(A5s < t1s.cacheLeft || A5s > t1s.cacheRight || !R1s[c1s]){R1s[b1s]=K1s.semiLog?K1s.height * (("1" << 1741591264) - (Math.log(Math.max(q1s,+"0")) / Math.LN10 - K1s.logLow) / K1s.logShadow):(K1s.high - q1s) * K1s.multiplier;if(K1s.flipped){R1s[b1s]=K1s.bottom - R1s[b1s];}else {R1s[b1s]+=K1s.top;}}g1s=C1s[p1s]=R1s[b1s];if(A1s.tick == E5s.tick && J1s.lastTickOffset){D1s+=J1s.lastTickOffset;}V5s=h1s.slice(-2);if(!a1s && n1s){if(A1s[c1s] && A1s[c1s][M1s]){A1s=A1s[c1s];}y5s=n1s(this,A1s,T1s);if(!y5s){D1s+=H1s?u1s:u1s / 2;continue;}V5s=q5s(y5s);}if(a1s){C3s.moveTo(D1s,g1s);if(z1s){P1s.push({coord:[D1s,g1s],color:C3s.strokeStyle,pattern:F1s?F1s:[],width:C3s.lineWidth});}}else {c2p="m";c2p+="o";c2p+="veTo";if(k1s || H1s){H5s=h1s.slice(-a22.i2B(848283648,"1",a22.u2B(14)))[0];if(x1s){e5s(D1s,H5s,Y1s);}else {C3s.lineTo(D1s,H5s);}h1s.push(D1s,H5s);}if(x1s && !H1s){e5s(D1s,g1s,Y1s);}else {C3s[H1s?c2p:"lineTo"](D1s,g1s);}}if(T1s){B1s.push({end:[D1s,g1s],threshold:Q1s});O5s=A1s;if(e1s && !k1s && !H1s){h1s.push(D1s,Q1s);}}h1s.push(D1s,g1s);a1s=![];T1s=! !"";D1s+=H1s?u1s:u1s / +"2";if(X1s){D1s+=X1s;};}y1s=O1s.right;Y5s=null;if(y1s){Y5s=y1s.transform;}if(!a1s && y1s){Z1s=N1s?Y5s?Y5s[c1s]:null:y1s[c1s];if(Z1s && (Z1s[M1s] || Z1s[M1s] === 0)){Z1s=Z1s[M1s];}v1s=this.pixelFromTick(y1s.tick,J1s);u5s=this.pixelFromTransformedValue(Z1s,t1s,K1s);if(y1s.tick - i1s[i1s.length - 1].tick > 1){if(!T1s){a22.u2B(16);f5s=h1s.slice(-a22.g2B(1,"2"));if(e1s && h1s.length){h1s.push(f5s["0" ^ 0],Q1s);}B1s.push({start:f5s,threshold:Q1s,tick:i1s[i1s.length - 1]});}T1s=! !{};}if(!a1s && n1s){a5s=n1s(this,y1s,T1s);if(a5s){G5s=q5s(a5s);}}l5s=h1s.slice(-2);if(!F1s || !F1s.length){if(k1s || H1s){z0p=1558351939;A0p=+"509949087";Q0p=2;for(var R0p=1;a22.W1E(R0p.toString(),R0p.toString().length,"90196" ^ 0) !== z0p;R0p++){C3s.lineTo(v1s,l5s[1]);Q0p+=2;}if(a22.H1E(Q0p.toString(),Q0p.toString().length,+"76964") !== A0p){C3s.lineTo(v1s,l5s[+"6"]);}h1s.push(v1s,l5s[+"1"]);}C3s[H1s?"moveTo":"lineTo"](v1s,u5s);}if(T1s){B1s.push({end:[v1s,u5s],threshold:Q1s});if(e1s && !k1s && !H1s){h1s.push(v1s,Q1s);}}h1s.push(v1s,u5s);}for(var w5s in M5s){B5s.push(w5s);}if(N3s && N3s.extendToEndOfLastBar){R5s=h1s.slice(-2);C3s.lineTo(R5s[0] + u1s,R5s["1" - 0]);}else if(k1s || H1s || this.extendLastTick || o1s){Z5s=h1s.slice(-2);if(h1s.length){f1s=Z5s[0];g5s=Z5s[1];if(o1s || k1s && o1s !== ![]){L0p=1927520072;E0p=1269723309;C0p=2;for(var Z0p=1;a22.H1E(Z0p.toString(),Z0p.toString().length,48593) !== L0p;Z0p++){f1s=this.pixelFromTick(J1s.dataSet.length - 1,J1s);if(H1s || this.extendLastTick){a22.s2B(6);f1s+=a22.g2B(u1s,2);}C0p+=2;}if(a22.W1E(C0p.toString(),C0p.toString().length,67559) !== E0p){f1s=this.pixelFromTick(J1s.dataSet.length % 3,J1s);if(H1s && this.extendLastTick){a22.s2B(17);f1s%=a22.i2B("3",u1s,1274241440);}}}else if(H1s){f1s+=u1s;}else if(this.extendLastTick){a22.u2B(6);f1s+=a22.g2B(u1s,2);}if(f1s > Z5s[0]){a22.s2B(16);o1E=-a22.g2B(1,"1095590375");a22.u2B(1);I1E=-a22.g2B("1582748236",0);w1E=2;for(var F1E=1;a22.H1E(F1E.toString(),F1E.toString().length,90474) !== o1E;F1E++){F5s=1;if(n1s){F5s=n1s(this,{},!{});}if(F5s){q5s(F5s);}C3s.lineTo(f1s,g5s);if(~T1s && -e1s){h1s.push(f1s,g5s);}w1E+=2;}if(a22.H1E(w1E.toString(),w1E.toString().length,33727) !== I1E){F5s=null;if(n1s){F5s=n1s(this,{},!"");}if(F5s){q5s(F5s);}C3s.lineTo(f1s,g5s);if(!T1s || !e1s){h1s.push(f1s,g5s);}}}}}if(!S1s){if(z1s && h1s.length){C3s.beginPath();k0p=+"849581882";b0p=-18210515;s0p=2;for(var K0p=1;a22.W1E(K0p.toString(),K0p.toString().length,3726) !== k0p;K0p++){if(N3s || N3s.pattern){C3s.setLineDash(N3s.pattern);}X6s.plotSpline(h1s,z1s,C3s,P1s);s0p+=2;}if(a22.W1E(s0p.toString(),s0p.toString().length,49411) !== b0p){if(N3s && N3s.pattern){C3s.setLineDash(N3s.pattern);}X6s.plotSpline(h1s,z1s,C3s,P1s);}}C3s.stroke();}this.endClip();if(!S1s && N3s && N3s.label && J5s){m2p="pl";m2p+="ot";N2p="#";N2p+="FFF";N2p+="FF";N2p+="F";y2p="n";y2p+="oop";T2p="o";T2p+="b";T2p+="ject";m1s=J5s[c1s];if(m1s && typeof m1s == T2p){m1s=m1s[M1s];}if(K1s.priceFormatter){Y1E=1813858921;h1E=-956041101;x1E=2;for(var D1E=1;a22.W1E(D1E.toString(),D1E.toString().length,7621) !== Y1E;D1E++){v5s=K1s.priceFormatter(this,t1s,m1s,N3s.labelDecimalPlaces);x1E+=+"2";}if(a22.W1E(x1E.toString(),x1E.toString().length,+"66067") !== h1E){v5s=K1s.priceFormatter(this,t1s,m1s,N3s.labelDecimalPlaces);}}else {v5s=this.formatYAxisPrice(m1s,t1s,N3s.labelDecimalPlaces);}i5s=this.yaxisLabelStyle;if(K1s.yaxisLabelStyle){i5s=K1s.yaxisLabelStyle;}o5s=i5s == y2p?C3s.strokeStyle:null;x5s=i5s == "noop"?N2p:C3s.strokeStyle;this.yAxisLabels.push({src:m2p,args:[t1s,v5s,J5s.cache[b1s],x5s,o5s,C3s,K1s]});}X5s=typeof I1s == "object"?I1s.color:I1s;if(o6s.isTransparent(X5s)){for(var j1s="0" << 655773632;j1s < B1s.length;j1s+=2){G1s=B1s[j1s].start;if(j1s){s5s=B1s[j1s - ("1" & 2147483647)].end;}if(s5s && G1s[0] == s5s[0] && G1s[1] == s5s[1]){C3s.beginPath();m5s=C3s.lineWidth;if(n1s){e2p="objec";e2p+="t";E1s=n1s(this,B1s[j1s].tick || ({}),!{});if(typeof E1s == e2p){a22.s2B(9);var A2p=a22.g2B(10,18,7);m5s=E1s.width * (d1s?2:A2p);E1s=E1s.color;}C3s.strokeStyle=C3s.fillStyle=E1s;}C3s.lineWidth=m5s;C3s.arc(G1s[0],G1s[1],1,0,2 * Math.PI);C3s.stroke();C3s.fill();}}}}C3s.globalAlpha=d5s;function q5s(c2s){var C5s,r5s,W5s,P2p,K2p,L2p,P5s,N5s,h2s,K2s,D2s,J2s,H2p,m1E,e1E,f1E,X0p,J0p,i0p;C5s=C3s.getLineDash();r5s=1;W5s=c2s;if(typeof W5s == "object"){a22.s2B(16);P2p=-a22.i2B(1,"2050785007");K2p=1719600597;L2p=2;for(var C2p=1;a22.W1E(C2p.toString(),C2p.toString().length,54940) !== P2p;C2p++){r5s=W5s.width * (d1s?+"2":"1" ^ 0);L2p+=2;}if(a22.W1E(L2p.toString(),L2p.toString().length,"39253" >> 634377504) !== K2p){a22.u2B(1);var Q2p=a22.g2B(36,30);a22.u2B(18);var d2p=a22.g2B(63,0,7);r5s=W5s.width / (d1s?Q2p:d2p);}F1s=o6s.borderPatternToArray(r5s,W5s.pattern);W5s=W5s.color;}a22.u2B(15);M5s[W5s]=a22.i2B("1",0);if(S1s){return;}P5s=h1s.slice(-2);N5s=F1s instanceof Array && F1s.join();h2s=C5s instanceof Array && C5s.join();a22.s2B(19);K2s=a22.i2B(h2s,N5s);D2s=!o6s.colorsEqual(k5s,W5s);J2s=C3s.lineWidth != r5s;if(D2s || K2s || J2s){if(z1s){P1s.push({coord:P5s,color:W5s,pattern:F1s?F1s:[],width:r5s});}else {C3s.stroke();C3s.lineWidth=r5s;if(K2s){C3s.setLineDash(N5s?F1s:[]);}C3s.beginPath();C3s.moveTo(P5s[0],P5s[1]);;}}a22.o22();k5s=W5s;if(!z1s){H2p="a";H2p+="u";H2p+="t";H2p+="o";if(!W5s || W5s == H2p){m1E=-1764340061;e1E=1710170286;f1E=2;for(var p1E="1" << 895793376;a22.W1E(p1E.toString(),p1E.toString().length,53860) !== m1E;p1E++){C3s.strokeStyle=S5s.defaultColor;f1E+=2;}if(a22.H1E(f1E.toString(),f1E.toString().length,"23989" - 0) !== e1E){C3s.strokeStyle=S5s.defaultColor;}}else {C3s.strokeStyle=W5s;}}X0p=1105346372;J0p=-790557729;i0p=2;for(var a0p=1;a22.W1E(a0p.toString(),a0p.toString().length,43412) !== X0p;a0p++){return P5s;}if(a22.W1E(i0p.toString(),i0p.toString().length,74738) !== J0p){return P5s;}}return {colors:B5s,points:h1s,cache:C1s,gapAreas:B1s};};o6s.ChartEngine.prototype.drawMountainChart=function(n2s,I2s,W2s){var O22=s6LL;var f2p,M2s,y2s,L2s,g2s,z2s,f2s,p2s,a2s,v2s,B2s,O2s,m2s,l2s,E2s,j2s,S2s,V2s,w2s,o2s,x2s,k2s,N2s,R2s,Q2s,b2s,X2s,r2s,d2s,P2s,e2s,q2s,U2s,A2s,C2s,t1E,v1E,n1E,G2p,u1E,r1E,q1E,G2s;f2p="Cl";f2p+="o";f2p+="s";f2p+="e";M2s=this.chart.context;y2s=I2s;L2s=![];g2s=!{};z2s=null;f2s=null;p2s=null;a2s=null;v2s=0;B2s=null;O2s=! !"";m2s=null;l2s=null;E2s=!{};j2s=null;S2s=null;V2s=1;w2s=!{};o2s=! !"";x2s=! !0;k2s=n2s.chart;N2s=k2s.dataSegment;R2s=k2s.lineStyle || ({});if(!I2s || typeof I2s != "object"){I2s={style:I2s};}y2s=I2s.style || "stx_mountain_chart";z2s=I2s.field || k2s.defaultPlotField || "Close";f2s=I2s.subField || k2s.defaultPlotField || f2p;B2s=I2s.gapDisplayStyle;if(!B2s && B2s !== ! !0){B2s=I2s.gaps;}if(!B2s && B2s !== ![]){B2s=k2s.gaplines;}if(!B2s){B2s="transparent";}p2s=I2s.yAxis || n2s.yAxis;L2s=I2s.reverse || ![];a2s=I2s.tension;m2s=I2s.fillStyle;v2s=I2s.width || R2s.width;O2s=I2s.step;l2s=I2s.pattern || R2s.pattern;E2s=I2s.highlight;S2s=I2s.color || R2s.color;j2s=I2s.baseColor || R2s.baseColor;g2s=I2s.colored;V2s=I2s.opacity;w2s=I2s.extendToEndOfDataSet;o2s=I2s.isComparison;x2s=I2s.returnObject;Q2s=this.canvasStyle(y2s);b2s=p2s.top;O22.o22();if(isNaN(b2s) || isNaN(b2s / b2s)){b2s=0;}X2s=S2s || (y2s && Q2s.backgroundColor?Q2s.backgroundColor:this.defaultColor);r2s=j2s || (y2s && Q2s.color?Q2s.color:this.containerColor);if(m2s){M2s.fillStyle=m2s;}else if(j2s || Q2s.color){d2s=M2s.createLinearGradient(+"0",b2s,0,p2s.bottom);d2s.addColorStop(p2s.flipped?+"1":0,X2s);d2s.addColorStop(p2s.flipped?0:1,r2s);M2s.fillStyle=d2s;}else {M2s.fillStyle=X2s;}this.startClip(n2s.name);P2s=M2s.lineWidth;if(!I2s.symbol){f2s=null;}I2s={skipProjections:! ![],reverse:L2s,yAxis:p2s,gapDisplayStyle:B2s,step:O2s,highlight:E2s,extendToEndOfDataSet:w2s,isComparison:o2s};if(k2s.tension){I2s.tension=k2s.tension;}if(a2s || a2s === 0){I2s.tension=a2s;}e2s=parseInt(Q2s.paddingTop,10);q2s=S2s || Q2s.borderTopColor;U2s=null;if(g2s || q2s && !o6s.isTransparent(q2s)){if(e2s){A2s=this.scratchContext;if(!A2s){C2s=M2s.canvas.cloneNode(! !{});t1E=+"639934643";v1E=-823500904;n1E=2;for(var J1E=1;O22.H1E(J1E.toString(),J1E.toString().length,75756) !== t1E;J1E++){A2s=this.scratchContext=C2s.getContext("");n1E+=2;}if(O22.H1E(n1E.toString(),n1E.toString().length,4281) !== v1E){G2p="2";G2p+="d";A2s=this.scratchContext=C2s.getContext(G2p);}}A2s.canvas.height=M2s.canvas.height;A2s.canvas.width=M2s.canvas.width;A2s.drawImage(M2s.canvas,0,"0" >> 1267092768);o6s.clearCanvas(M2s.canvas,this);}}o6s.extend(I2s,{panelName:n2s.name,direction:I2s.reverse?-1:1,band:z2s,subField:f2s,opacity:V2s});if(!I2s.highlight && this.highlightedDraggable){I2s.opacity*=0.3;}o6s.preparePeakValleyFill(this,I2s);if(g2s || q2s && !o6s.isTransparent(q2s)){if(e2s){M2s.save();O22.s2B(16);M2s.lineWidth+=O22.g2B(e2s,2);M2s.globalCompositeOperation="destination-out";M2s.globalAlpha=+"1";this.plotDataSegmentAsLine(z2s,n2s,I2s);M2s.globalCompositeOperation="destination-over";M2s.scale(1 / this.adjustedDisplayPixelRatio,1 / this.adjustedDisplayPixelRatio);M2s.drawImage(this.scratchContext.canvas,0,0);M2s.restore();}}M2s.strokeStyle=q2s;if(v2s){M2s.lineWidth=v2s;}else if(Q2s.width && parseInt(Q2s.width,+"10") <= 25){M2s.lineWidth=Math.max(1,o6s.stripPX(Q2s.width));}else {u1E=1882092945;r1E=-805191146;q1E=2;for(var A1E=1;O22.W1E(A1E.toString(),A1E.toString().length,8910) !== u1E;A1E++){O22.s2B(15);M2s.lineWidth=O22.g2B("1",0);q1E+=2;}if(O22.H1E(q1E.toString(),q1E.toString().length,8698) !== r1E){M2s.lineWidth=2;}}if(!l2s){l2s=Q2s.borderTopStyle;}I2s.pattern=o6s.borderPatternToArray(M2s.lineWidth,l2s);G2s=W2s;if(B2s){G2s=this.getGapColorFunction(z2s,f2s,{color:q2s,pattern:I2s.pattern,width:M2s.lineWidth},B2s,W2s);}U2s=this.plotDataSegmentAsLine(z2s,n2s,I2s,G2s);M2s.lineWidth=P2s;this.endClip();if(!U2s.colors.length){U2s.colors.push(q2s);}return x2s?U2s:U2s.colors;};s6LL.C22();o6s.ChartEngine.prototype.drawBaselineChart=function(h9s,K9s){var s9s,M9s,D9s,v2p,t2p,p2p,B9s,u9s,Q9s,f9s,a9s,l9s,R9s,g9s,v9s,m9s,j9s,p9s,n9s,z9s,i9s,b9s,T9s,k9s,J9s,t9s,n2p,S9s,d9s,q9s,X2p,a2p,j2p,i2p,J2p;var {chart:F9s}=h9s;var {field:I9s, id:U9s, yAxis:c9s}=K9s;var {gaplines:H9s, defaultPlotField:A9s, lineStyle:Y9s}=F9s;var {display:y9s}=this.baselineHelper.get(this.getRendererFromSeries(U9s));s9s=this.getYAxisBaseline(c9s).actualLevel;M9s=[];if(!I9s){I9s=A9s;}if(!Y9s){Y9s={};}D9s=K9s.gapDisplayStyle;if(!D9s && D9s !== ![]){D9s=K9s.gaps;}if(s9s !== null && !isNaN(s9s)){v2p="stx";v2p+="_ba";v2p+="se";v2p+="line_down";t2p="stx_ba";t2p+="s";t2p+="eline";t2p+="_up";p2p="mounta";p2p+="in";B9s=K9s.type == p2p;if(B9s){M9s=this.drawMountainChart(h9s,{style:K9s.style,field:K9s.field,yAxis:c9s,gapDisplayStyle:D9s,colored:!"",tension:0});}u9s=this.pixelFromPrice(s9s,h9s,c9s);if(isNaN(u9s)){return;}this.startClip(h9s.name);Q9s=K9s.pattern || Y9s.pattern;f9s=K9s.fill_color_up || this.getCanvasColor(t2p);a9s=K9s.fill_color_down || this.getCanvasColor(v2p);l9s=K9s.border_color_up || this.getCanvasColor("stx_baseline_up");R9s=K9s.border_color_down || this.getCanvasColor("stx_baseline_down");g9s=K9s.width || Y9s.width || this.canvasStyle("stx_baseline_up").width;v9s=K9s.width || Y9s.width || this.canvasStyle("stx_baseline_down").width;m9s=K9s.widthBaseline || Y9s.width || o6s.stripPX(this.canvasStyle("stx_baseline").width);j9s=K9s.baselineOpacity || this.canvasStyle("stx_baseline").opacity;p9s={fill:f9s,edge:l9s,width:g9s};n9s={fill:a9s,edge:R9s,width:v9s};z9s=K9s.yAxis.flipped;i9s={over:z9s?n9s:p9s,under:z9s?p9s:n9s};b9s=!{};if(!D9s && D9s !== ![]){D9s=H9s;}T9s=1;if(!K9s.highlight && this.highlightedDraggable){T9s*=0.3;}for(var Z9s in i9s){k9s=parseInt(Math.max(1,o6s.stripPX(i9s[Z9s].width)),10);if(K9s.highlight){k9s*=2;}Q9s=o6s.borderPatternToArray(k9s,Q9s);J9s={panelName:h9s.name,band:I9s,threshold:s9s,color:B9s?"transparent":i9s[Z9s].fill,direction:Z9s == "over"?"1" >> 253373792:-1,edgeHighlight:i9s[Z9s].edge,edgeParameters:{pattern:Q9s,lineWidth:k9s + +"0.1",opacity:T9s},gapDisplayStyle:D9s,yAxis:K9s.yAxis};if(c9s){J9s.threshold=this.priceFromPixel(this.pixelFromPrice(J9s.threshold,h9s,c9s),h9s,c9s);}M9s.push(i9s[Z9s].edge);t9s=J9s.color;if(!B9s && t9s && t9s != "transparent"){n2p="o";n2p+="v";n2p+="er";S9s=h9s.top;d9s=h9s.bottom;q9s=F9s.context.createLinearGradient(0,Z9s == n2p?S9s:d9s,0,u9s);q9s.addColorStop(0,o6s.hexToRgba(o6s.colorToHex(t9s),60));q9s.addColorStop(1,o6s.hexToRgba(o6s.colorToHex(t9s),10));J9s.color=q9s;J9s.opacity=T9s;}o6s.preparePeakValleyFill(this,F9s.dataSegment,J9s);if(H9s){if(!H9s.fillMountain){X2p="trans";X2p+="parent";this.drawLineChart(h9s,null,null,{color:X2p,gapDisplayStyle:{color:this.containerColor,pattern:"solid",width:J9s.edgeParameters.lineWidth}});}if(!H9s.color){b9s=! ![];H9s.color=this.defaultColor;}}this.drawLineChart(h9s,null,null,{color:"transparent",width:J9s.edgeParameters.lineWidth});if(b9s){H9s.color=null;}}if(y9s){a2p="d";a2p+="otted";j2p="lin";j2p+="e";i2p="1";i2p+=".";i2p+="1";J2p="l";J2p+="i";J2p+="n";J2p+="e";this.plotLine(0,1,u9s,u9s,this.containerColor,J2p,F9s.context,h9s,{lineWidth:i2p});this.plotLine(0,1,u9s,u9s,this.getCanvasColor("stx_baseline"),j2p,F9s.context,h9s,{pattern:a2p,lineWidth:m9s || "2.1",opacity:j9s || 0.5 * T9s});}this.endClip();}return {colors:M9s};};o6s.ChartEngine.prototype.plotLine=function(e9s){var z22=s6LL;var h2p,Y2p,V2p,B2p,w9s,x9s,V9s,E9s,o9s,h7s,L9s,X9s,t7s,D7s,J7s,c7s,H7s,W9s,F7s,O9s,I7s,B7s,C9s,N9s,Y7s,u7s,G9s,K7s,r9s,i7s,M7s,s7s,Z7s,y0p,N0p,m0p,i1E,j1E,a1E,Q7s;h2p="li";h2p+="ne";Y2p="r";Y2p+="ay";V2p="n";V2p+="one";B2p="n";B2p+="u";B2p+="m";B2p+="ber";if(typeof arguments[0] == B2p){e9s={x0:arguments[0],x1:arguments[1],y0:arguments[2],y1:arguments[3],color:arguments[4],type:arguments[5],context:arguments[6],confineToPanel:arguments[7]};for(var T7s in arguments[+"8"]){e9s[T7s]=arguments[8][T7s];}}if(!e9s){e9s={};}if(e9s.pattern == V2p){return;}w9s=e9s.x0;x9s=e9s.x1;V9s=e9s.y0;E9s=e9s.y1;o9s=e9s.color;h7s=e9s.type;L9s=e9s.context;X9s=e9s.confineToPanel;t7s=e9s.deferStroke;if(X9s === ! !{}){X9s=this.chart.panel;}if(L9s === null || typeof L9s == "undefined"){L9s=this.chart.context;}if(isNaN(w9s) || isNaN(x9s) || isNaN(V9s) || isNaN(E9s)){return;}z22.C22();D7s=+"0";J7s=this.chart.canvasHeight;z22.u2B(5);c7s=z22.g2B(2147483647,"0");H7s=this.right;if(X9s){J7s=X9s.yAxis.bottom;D7s=X9s.yAxis.top;c7s=X9s.left;H7s=X9s.right;}if(h7s == Y2p){W9s=+"10000000";if(x9s < w9s){W9s=-10000000;}O9s={x0:w9s,x1:x9s,y0:V9s,y1:E9s};F7s=o6s.yIntersection(O9s,W9s);x9s=W9s;E9s=F7s;}if(h7s == h2p || h7s == "horizontal" || h7s == "vertical"){z22.s2B(15);W9s=z22.g2B("10000000",9438336);I7s=-10000000;O9s={x0:w9s,x1:x9s,y0:V9s,y1:E9s};F7s=o6s.yIntersection(O9s,W9s);B7s=o6s.yIntersection(O9s,I7s);w9s=I7s;x9s=W9s;V9s=B7s;E9s=F7s;}C9s=0.0;N9s=1.0;z22.u2B(1);Y7s=z22.i2B(x9s,w9s);z22.s2B(1);u7s=z22.i2B(E9s,V9s);for(var P9s=0;P9s < 4;P9s++){if(P9s === 0){G9s=-Y7s;z22.s2B(1);K7s=-z22.g2B(c7s,w9s);}if(P9s == 1){G9s=Y7s;z22.u2B(1);K7s=z22.g2B(H7s,w9s);}if(P9s == 2){G9s=-u7s;z22.s2B(1);K7s=-z22.g2B(D7s,V9s);}if(P9s == 3){G9s=u7s;z22.s2B(1);K7s=z22.i2B(J7s,V9s);}z22.u2B(6);r9s=z22.i2B(K7s,G9s);if((E9s || E9s === +"0") && G9s === 0 && K7s < 0){return !{};;}if(G9s < 0){if(r9s > N9s){return ! !0;}else if(r9s > C9s){C9s=r9s;};}else if(G9s > 0){if(r9s < C9s){return !{};}else if(r9s < N9s){N9s=r9s;};}}z22.u2B(20);i7s=z22.g2B(C9s,Y7s,w9s);z22.u2B(20);M7s=z22.i2B(C9s,u7s,V9s);z22.s2B(20);s7s=z22.g2B(N9s,Y7s,w9s);z22.s2B(20);Z7s=z22.i2B(N9s,u7s,V9s);if(!E9s && E9s !== 0 && !V9s && V9s !== +"0"){M7s=D7s;Z7s=J7s;i7s=O9s.x0;s7s=O9s.x0;if(O9s.x0 > H7s){return ![];}if(O9s.x0 < c7s){return ! !0;}}else if(!E9s && E9s !== 0){if(O9s.y0 < O9s.y1){Z7s=J7s;}else {Z7s=D7s;}i7s=O9s.x0;s7s=O9s.x0;if(O9s.x0 > H7s){return !"1";}if(O9s.x0 < c7s){return !{};}}if(!t7s){L9s.save();L9s.beginPath();}L9s.lineWidth=1.1;if(o9s && typeof o9s == "object"){L9s.strokeStyle=o9s.color;if(o9s.opacity){L9s.globalAlpha=o9s.opacity;}else {L9s.globalAlpha=1;}L9s.lineWidth=o6s.stripPX(o9s.width);}else {if(!o9s || o9s == "auto" || o6s.isTransparent(o9s)){y0p=- +"1605555708";N0p=-1720251163;m0p=2;for(var f0p=1;z22.H1E(f0p.toString(),f0p.toString().length,+"82549") !== y0p;f0p++){L9s.strokeStyle=this.defaultColor;m0p+=+"2";}if(z22.H1E(m0p.toString(),m0p.toString().length,89380) !== N0p){L9s.strokeStyle=this.defaultColor;}}else {i1E=+"2032180323";j1E=-907341833;a1E=2;for(var V1E=1;z22.W1E(V1E.toString(),V1E.toString().length,75915) !== i1E;V1E++){L9s.strokeStyle=o9s;a1E+=2;}if(z22.W1E(a1E.toString(),a1E.toString().length,740) !== j1E){L9s.strokeStyle=o9s;}L9s.strokeStyle=o9s;}}if(e9s.opacity){L9s.globalAlpha=e9s.opacity;}if(e9s.lineWidth){L9s.lineWidth=e9s.lineWidth;}if(e9s.globalCompositeOperation){L9s.globalCompositeOperation=e9s.globalCompositeOperation;}Q7s=o6s.borderPatternToArray(L9s.lineWidth,e9s.pattern);L9s.setLineDash(e9s.pattern?Q7s:[]);L9s.moveTo(i7s,M7s);L9s.lineTo(s7s,Z7s);if(!t7s){L9s.stroke();L9s.restore();}};o6s.ChartEngine.prototype.rendererAction=function(n7s,q7s){var b7s,x2p,k7s,p7s,A7s,z7s,S2p,M2p,k2p;function y7s(){var Z22=s6LL;Z22.o22();var G0p,p0p,t0p,f7s,W0p,H0p,g0p;if(!b7s && q7s === "underlay"){G0p=+"715012991";p0p=-1447207152;t0p=2;for(var n0p=+"1";Z22.H1E(n0p.toString(),n0p.toString().length,30380) !== G0p;n0p++){f7s=Symbol.for("CIQ.watermark");t0p+=2;}if(Z22.H1E(t0p.toString(),t0p.toString().length,+"80338") !== p0p){f7s=Symbol.for("");}if(this[f7s]){W0p=1567274041;H0p=919530008;g0p=2;for(var T0p=1;Z22.W1E(T0p.toString(),T0p.toString().length,42070) !== W0p;T0p++){this[f7s].draw(n7s);b7s=![];g0p+=2;}if(Z22.H1E(g0p.toString(),g0p.toString().length,+"91591") !== H0p){this[f7s].draw(n7s);b7s=! !{};}}}}b7s=!{};s6LL.o22();if(!this.runPrepend("rendererAction",arguments)){for(var U7s in n7s.seriesRenderers){x2p="o";x2p+="verlay";k7s=n7s.seriesRenderers[U7s];p7s=k7s.params;A7s=p7s.panel;z7s=this.panels[A7s];if(p7s.overChart && q7s == "underlay")continue;if(p7s.name == "_main_series" && q7s == "underlay")continue;if(p7s.name != "_main_series" && q7s == "main")continue;if(!p7s.overChart && q7s == x2p)continue;if(!z7s)continue;if(z7s.chart !== n7s)continue;if(z7s.hidden)continue;if(q7s == "yAxis"){k7s.adjustYAxis();}else {y7s.apply(this);k7s.draw();if(k7s.cb){k7s.cb(k7s.colors);}}}this.runAppend("rendererAction",arguments);}S2p=389613842;M2p=73771042;k2p=2;for(var s2p=1;s6LL.W1E(s2p.toString(),s2p.toString().length,"9772" >> 1483700992) !== S2p;s2p++){y7s.apply(this);k2p+=2;}if(s6LL.H1E(k2p.toString(),k2p.toString().length,59500) !== M2p){y7s.apply(this);}};o6s.ChartEngine.prototype.drawSeries=function(l7s,O7s,X7s,L7s){var j22=s6LL;var D2p,l2p,l0p,D0p,o0p,W7s,d7s,a7s,v7s,e7s,r7s,j7s,m7s,E7s,o7s,S7s,R7s,G7s,g7s,x7s,V7s;D2p="d";D2p+="raw";D2p+="S";D2p+="eries";l2p="drawS";l2p+="erie";l2p+="s";if(this.runPrepend(l2p,arguments)){return;}l0p=-1177789407;D0p=-2146006549;o0p=2;for(var w0p=1;j22.W1E(w0p.toString(),w0p.toString().length,27532) !== l0p;w0p++){W7s=l7s.dataSegment;d7s=1;if(~O7s){O7s=l7s.series;}o0p+=2;}if(j22.H1E(o0p.toString(),o0p.toString().length,97406) !== D0p){W7s=l7s.dataSegment;d7s=9;if(!O7s){O7s=l7s.series;}}W7s=l7s.dataSegment;d7s=null;if(!O7s){O7s=l7s.series;}for(var w7s in O7s){d7s=O7s[w7s];a7s=d7s.parameters;v7s=a7s.panel?this.panels[a7s.panel]:l7s.panel;e7s=a7s.color;r7s=a7s.width;j7s=a7s.field;if(!v7s)continue;m7s=a7s.yAxis=X7s?X7s:v7s.yAxis;if(!e7s){e7s=m7s.textStyle || this.defaultColor;}if(e7s == "auto"){e7s=this.defaultColor;}if(!j7s){j7s=l7s.defaultPlotField;}E7s=a7s.subField || l7s.defaultPlotField || "Close";if(!a7s._rawExtendToEndOfDataSet && a7s._rawExtendToEndOfDataSet !== ! !""){a7s._rawExtendToEndOfDataSet=a7s.extendToEndOfDataSet;}if(l7s.animatingHorizontalScroll){a7s.extendToEndOfDataSet=!"1";}else {a7s.extendToEndOfDataSet=a7s._rawExtendToEndOfDataSet;}o7s=a7s.colorFunction;if(d7s.highlight || d7s.parameters.highlight){a7s.highlight=! !{};}S7s={colors:[]};if(L7s){if(L7s.params.highlight){a7s.highlight=!"";}if(a7s.hidden)continue;S7s=L7s.drawIndividualSeries(l7s,a7s) || S7s;}else if(a7s.type == "mountain"){S7s=this.drawMountainChart(v7s,o6s.extend({returnObject:! ![]},a7s),o7s);}else {S7s=this.drawLineChart(v7s,a7s.style,o7s,o6s.extend({returnObject:! !1},a7s));}d7s.yValueCache=S7s.cache;j22.s2B(3);var R2p=j22.i2B(12,0,13);R7s=l7s.dataSegment[l7s.dataSegment.length - R2p];if(R7s){G7s=!a7s.skipTransform && l7s.transformFunc && m7s == l7s.panel.yAxis;if(!R7s[j7s] && R7s[j7s] !== ("0" | 0)){R7s=this.getPreviousBar(l7s,j7s,l7s.dataSegment.length - 1);}if(G7s && R7s && R7s.transform){R7s=R7s.transform;}}if(a7s.displayFloatingLabel !== !"1" && this.mainSeriesRenderer != L7s && R7s && !m7s.noDraw){g7s=R7s[j7s];if(g7s){if(g7s[E7s] || g7s[E7s] === 0){g7s=g7s[E7s];}else {g7s=g7s.iqPrevClose;}}if(m7s.priceFormatter){x7s=m7s.priceFormatter(this,v7s,g7s);}else {x7s=this.formatYAxisPrice(g7s,v7s,null,m7s);}this.yAxisLabels.push({src:"series",args:[v7s,x7s,this.pixelFromTransformedValue(g7s,v7s,m7s),o6s.hexToRgba(o6s.colorToHex(e7s),parseFloat(a7s.opacity)),null,null,m7s]});}if(l7s.legend && a7s.useChartLegend){if(!l7s.legend.colorMap){l7s.legend.colorMap={};}V7s=a7s.display;if(!V7s){V7s=a7s.symbol;}l7s.legend.colorMap[w7s]={color:S7s.colors,display:V7s,isBase:L7s == this.mainSeriesRenderer};;}}this.runAppend(D2p,arguments);};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
C3LL.h9B=(function(){var Z=2;for(;Z !== 9;){switch(Z){case 5:var k;try{var Y=2;for(;Y !== 6;){switch(Y){case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\u006f\u0070\x65\u0072\x74\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\x79\x70\u0065'],'\u005a\u005a\u0035\u0054\x73',{'\x67\x65\x74':function(){var m=2;for(;m !== 1;){switch(m){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});k=ZZ5Ts;k['\u0048\u004f\u0048\x68\u0066']=k;Y=4;break;case 9:delete k['\x48\x4f\x48\u0068\u0066'];var R=Object['\x70\u0072\u006f\u0074\x6f\x74\u0079\u0070\u0065'];delete R['\x5a\x5a\u0035\x54\x73'];Y=6;break;case 4:Y=typeof HOHhf === '\x75\u006e\u0064\u0065\x66\x69\u006e\u0065\x64'?3:9;break;case 3:throw "";Y=9;break;}}}catch(C){k=window;}return k;break;case 2:Z=typeof globalThis === '\x6f\u0062\u006a\u0065\x63\u0074'?1:5;break;case 1:return globalThis;break;}}})();C3LL.b9B=r600(C3LL.h9B);C3LL.n82=function(){return typeof C3LL.u82.I82 === 'function'?C3LL.u82.I82.apply(C3LL.u82,arguments):C3LL.u82.I82;};C3LL.l82=function(){return typeof C3LL.u82.s82 === 'function'?C3LL.u82.s82.apply(C3LL.u82,arguments):C3LL.u82.s82;};function C3LL(){}C3LL.u82=(function(D82){return {I82:function(){var G82,f82=arguments;switch(D82){case 0:G82=f82[1] >> f82[0];break;}return G82;},s82:function(R82){D82=R82;}};})();function r600(O73){function P53(S73){var D73=2;for(;D73 !== 5;){switch(D73){case 2:var U73=[arguments];return U73[0][0].String;break;}}}var p73=2;for(;p73 !== 11;){switch(p73){case 6:G73[6]+=G73[8];G73[6]+=G73[1];p73=13;break;case 3:G73[9]="k";G73[4]=9;G73[4]=1;G73[6]=G73[9];p73=6;break;case 2:var G73=[arguments];G73[1]="00";G73[8]="";G73[8]="6";p73=3;break;case 12:d53(P53,"charCodeAt",G73[4],G73[6]);p73=11;break;case 13:var d53=function(A73,V73,i73,Q73){var z73=2;for(;z73 !== 5;){switch(z73){case 2:var X73=[arguments];H53(G73[0][0],X73[0][0],X73[0][1],X73[0][2],X73[0][3]);z73=5;break;}}};p73=12;break;}}function H53(W73,r73,v73,e73,F73){var t73=2;for(;t73 !== 6;){switch(t73){case 2:var Y73=[arguments];Y73[5]="inePro";Y73[7]="perty";Y73[6]="";t73=3;break;case 3:Y73[6]="def";Y73[9]=0;Y73[9]=3;try{var h73=2;for(;h73 !== 8;){switch(h73){case 4:Y73[8].value=Y73[1][Y73[0][2]];try{var s73=2;for(;s73 !== 3;){switch(s73){case 4:Y73[0][0].Object[Y73[2]](Y73[1],Y73[0][4],Y73[8]);s73=3;break;case 2:Y73[2]=Y73[6];Y73[2]+=Y73[5];Y73[2]+=Y73[7];s73=4;break;}}}catch(l73){}Y73[1][Y73[0][4]]=Y73[8].value;h73=8;break;case 2:Y73[8]={};Y73[3]=(1,Y73[0][1])(Y73[0][0]);Y73[1]=[Y73[9],Y73[3].prototype][Y73[0][3]];h73=4;break;}}}catch(I73){}t73=6;break;}}}}C3LL.J73=function(){return typeof C3LL.R73.w9B === 'function'?C3LL.R73.w9B.apply(C3LL.R73,arguments):C3LL.R73.w9B;};C3LL.v82=function(){return typeof C3LL.u82.s82 === 'function'?C3LL.u82.s82.apply(C3LL.u82,arguments):C3LL.u82.s82;};C3LL.R73=(function(){var X9B=function(P9B,V9B){var W9B=V9B & 0xffff;var U9B=V9B - W9B;return (U9B * P9B | 0) + (W9B * P9B | 0) | 0;},K9B=function(i9B,v9B,g9B){var O9B=0xcc9e2d51,C9B=0x1b873593;var M9B=g9B;var Q9B=v9B & ~0x3;for(var R9B=0;R9B < Q9B;R9B+=4){var j9B=i9B.k600(R9B) & 0xff | (i9B.k600(R9B + 1) & 0xff) << 8 | (i9B.k600(R9B + 2) & 0xff) << 16 | (i9B.k600(R9B + 3) & 0xff) << 24;j9B=X9B(j9B,O9B);j9B=(j9B & 0x1ffff) << 15 | j9B >>> 17;j9B=X9B(j9B,C9B);M9B^=j9B;M9B=(M9B & 0x7ffff) << 13 | M9B >>> 19;M9B=M9B * 5 + 0xe6546b64 | 0;}j9B=0;switch(v9B % 4){case 3:j9B=(i9B.k600(Q9B + 2) & 0xff) << 16;case 2:j9B|=(i9B.k600(Q9B + 1) & 0xff) << 8;case 1:j9B|=i9B.k600(Q9B) & 0xff;j9B=X9B(j9B,O9B);j9B=(j9B & 0x1ffff) << 15 | j9B >>> 17;j9B=X9B(j9B,C9B);M9B^=j9B;}M9B^=v9B;M9B^=M9B >>> 16;M9B=X9B(M9B,0x85ebca6b);M9B^=M9B >>> 13;M9B=X9B(M9B,0xc2b2ae35);M9B^=M9B >>> 16;return M9B;};return {w9B:K9B};})();C3LL.d73=function(){return typeof C3LL.R73.w9B === 'function'?C3LL.R73.w9B.apply(C3LL.R73,arguments):C3LL.R73.w9B;};C3LL.V82=function(){return typeof C3LL.u82.I82 === 'function'?C3LL.u82.I82.apply(C3LL.u82,arguments):C3LL.u82.I82;};var __js_core_engine_obfuscate_scroll_;__js_core_engine_obfuscate_scroll_=I1p=>{var w73,m73,T73,F1p;w73=- +"1011076991";m73=+"478227323";T73=+"2";for(var L73=1;C3LL.d73(L73.toString(),L73.toString().length,96518) !== w73;L73++){F1p=I1p.CIQ;T73+=2;}if(C3LL.J73(T73.toString(),T73.toString().length,65839) !== m73){F1p=I1p.CIQ;}F1p.ChartEngine.prototype.scrollTo=function(Q1p,Z1p,z1p){var G1p,K73,c83,Z83,J1p;G1p=this.swipe;G1p.end=! ![];G1p.amplitude=G1p.target=(Z1p - Q1p.scroll) * this.layout.candleWidth;G1p.timeConstant=100;K73=- +"1101716172";c83=1236507755;Z83=2;for(var l83=1;C3LL.J73(l83.toString(),l83.toString().length,99799) !== K73;l83++){G1p.timestamp=Date.now();G1p.scroll=Q1p.scroll;G1p.chart=Q1p;G1p.cb=z1p;J1p=this;Z83+=2;}if(C3LL.J73(Z83.toString(),Z83.toString().length,24967) !== c83){G1p.timestamp=Date.now();G1p.scroll=Q1p.scroll;G1p.chart=Q1p;G1p.cb=z1p;J1p=this;}requestAnimationFrame(function(){J1p.autoscroll();});};F1p.ChartEngine.prototype.autoscroll=function(){var U82=C3LL;var w1p,f1p,I83,n83,M83,j1p,i1p,H73,P73,x73;w1p=this;f1p=this.swipe;I83=- +"1119551848";n83=1760254607;M83=2;for(var a83=1;U82.J73(a83.toString(),a83.toString().length,40130) !== I83;a83++){M83+=2;}if(U82.d73(M83.toString(),M83.toString().length,+"21186") !== n83){}if(f1p.amplitude){f1p.elapsed=Date.now() - f1p.timestamp;j1p=-f1p.amplitude * Math.exp(-f1p.elapsed / f1p.timeConstant);i1p=(f1p.target + j1p) / this.layout.candleWidth;f1p.chart.scroll=f1p.scroll + Math.round(i1p);H73=1378842264;P73=425997687;x73=2;for(var B73=+"1";U82.J73(B73.toString(),B73.toString().length,1653) !== H73;B73++){this.draw();this.updateChartAccessories();U82.l82(0);x73+=U82.n82(1959961408,"2");}if(U82.J73(x73.toString(),x73.toString().length,53718) !== P73){this.draw();this.updateChartAccessories();}if(j1p > 0.5 || j1p < -0.5){requestAnimationFrame(function(){w1p.autoscroll();});}else {if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(f1p.cb){f1p.cb();}}}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
W1LL[450668]=(function(){var Z=2;for(;Z !== 9;){switch(Z){case 5:var k;try{var Y=2;for(;Y !== 6;){switch(Y){case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\u006f\u0070\x65\u0072\x74\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\x79\x70\u0065'],'\u0067\u006d\u0046\u0046\x63',{'\x67\x65\x74':function(){var m=2;for(;m !== 1;){switch(m){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});k=gmFFc;k['\u007a\u0036\u0046\x4e\u0070']=k;Y=4;break;case 9:delete k['\x7a\x36\x46\u004e\u0070'];var R=Object['\x70\u0072\u006f\u0074\x6f\x74\u0079\u0070\u0065'];delete R['\x67\x6d\u0046\x46\x63'];Y=6;break;case 4:Y=typeof z6FNp === '\x75\u006e\u0064\u0065\x66\x69\u006e\u0065\x64'?3:9;break;case 3:throw "";Y=9;break;}}}catch(C){k=window;}return k;break;case 2:Z=typeof globalThis === '\x6f\u0062\u006a\u0065\x63\u0074'?1:5;break;case 1:return globalThis;break;}}})();W1LL[189977]=S100(W1LL[450668]);W1LL[442504]=F3LL(W1LL[450668]);W1LL.O4g=function(){return typeof W1LL[431873].a92 === 'function'?W1LL[431873].a92.apply(W1LL[431873],arguments):W1LL[431873].a92;};W1LL[343126]=(function(){var u1p=function(D1p,m1p){var S1p=m1p & 0xffff;var C1p=m1p - S1p;return (C1p * D1p | 0) + (S1p * D1p | 0) | 0;},l1p=function(g1p,q1p,M1p){var L1p=0xcc9e2d51,B1p=0x1b873593;var N1p=M1p;var X1p=q1p & ~0x3;for(var k1p=0;k1p < X1p;k1p+=4){var p1p=g1p.V900(k1p) & 0xff | (g1p.V900(k1p + 1) & 0xff) << 8 | (g1p.V900(k1p + 2) & 0xff) << 16 | (g1p.V900(k1p + 3) & 0xff) << 24;p1p=u1p(p1p,L1p);p1p=(p1p & 0x1ffff) << 15 | p1p >>> 17;p1p=u1p(p1p,B1p);N1p^=p1p;N1p=(N1p & 0x7ffff) << 13 | N1p >>> 19;N1p=N1p * 5 + 0xe6546b64 | 0;}p1p=0;switch(q1p % 4){case 3:p1p=(g1p.V900(X1p + 2) & 0xff) << 16;case 2:p1p|=(g1p.V900(X1p + 1) & 0xff) << 8;case 1:p1p|=g1p.V900(X1p) & 0xff;p1p=u1p(p1p,L1p);p1p=(p1p & 0x1ffff) << 15 | p1p >>> 17;p1p=u1p(p1p,B1p);N1p^=p1p;}N1p^=q1p;N1p^=N1p >>> 16;N1p=u1p(N1p,0x85ebca6b);N1p^=N1p >>> 13;N1p=u1p(N1p,0xc2b2ae35);N1p^=N1p >>> 16;return N1p;};return {d1p:l1p};})();function S100(f4B){function G9B(o4B){var d4B=2;for(;d4B !== 5;){switch(d4B){case 2:var V4B=[arguments];return V4B[0][0].String;break;}}}var n4B=2;for(;n4B !== 11;){switch(n4B){case 6:D4B[6]+=D4B[8];D4B[6]+=D4B[1];n4B=13;break;case 3:D4B[9]="V";D4B[4]=9;D4B[4]=1;D4B[6]=D4B[9];n4B=6;break;case 2:var D4B=[arguments];D4B[1]="00";D4B[8]="";D4B[8]="9";n4B=3;break;case 12:B9B(G9B,"charCodeAt",D4B[4],D4B[6]);n4B=11;break;case 13:var B9B=function(e4B,g4B,m4B,A4B){var G4B=2;for(;G4B !== 5;){switch(G4B){case 2:var x4B=[arguments];n9B(D4B[0][0],x4B[0][0],x4B[0][1],x4B[0][2],x4B[0][3]);G4B=5;break;}}};n4B=12;break;}}function n9B(S4B,H4B,F4B,B4B,U4B){var v4B=2;for(;v4B !== 6;){switch(v4B){case 2:var J4B=[arguments];J4B[5]="inePro";J4B[7]="perty";J4B[6]="";v4B=3;break;case 3:J4B[6]="def";J4B[9]=0;J4B[9]=3;try{var T4B=2;for(;T4B !== 8;){switch(T4B){case 4:J4B[8].value=J4B[1][J4B[0][2]];try{var i4B=2;for(;i4B !== 3;){switch(i4B){case 4:J4B[0][0].Object[J4B[2]](J4B[1],J4B[0][4],J4B[8]);i4B=3;break;case 2:J4B[2]=J4B[6];J4B[2]+=J4B[5];J4B[2]+=J4B[7];i4B=4;break;}}}catch(t9B){}J4B[1][J4B[0][4]]=J4B[8].value;T4B=8;break;case 2:J4B[8]={};J4B[3]=(1,J4B[0][1])(J4B[0][0]);J4B[1]=[J4B[9],J4B[3].prototype][J4B[0][3]];T4B=4;break;}}}catch(z9B){}v4B=6;break;}}}}function F3LL(s0g){function L7p(E0g,C0g,S0g,X0g,z0g){var Y0g=2;for(;Y0g !== 7;){switch(Y0g){case 3:W0g[8]="ropert";W0g[6]="defineP";try{var G0g=2;for(;G0g !== 8;){switch(G0g){case 2:W0g[3]={};W0g[7]=(1,W0g[0][1])(W0g[0][0]);W0g[4]=[W0g[7],W0g[7].prototype][W0g[0][3]];W0g[3].value=W0g[4][W0g[0][2]];try{var q0g=2;for(;q0g !== 3;){switch(q0g){case 2:W0g[2]=W0g[6];W0g[2]+=W0g[8];W0g[2]+=W0g[1];W0g[0][0].Object[W0g[2]](W0g[4],W0g[0][4],W0g[3]);q0g=3;break;}}}catch(w8p){}G0g=9;break;case 9:W0g[4][W0g[0][4]]=W0g[3].value;G0g=8;break;}}}catch(J8p){}Y0g=7;break;case 2:var W0g=[arguments];W0g[8]="";W0g[1]="y";W0g[8]="";Y0g=3;break;}}}function z7p(Q0g){var i0g=2;for(;i0g !== 5;){switch(i0g){case 2:var t0g=[arguments];return t0g[0][0].RegExp;break;}}}var d0g=2;for(;d0g !== 72;){switch(d0g){case 61:V0g[47]+=V0g[78];V0g[47]+=V0g[59];V0g[55]=V0g[9];V0g[55]+=V0g[2];V0g[55]+=V0g[3];d0g=56;break;case 8:V0g[9]="_";V0g[6]="r";V0g[5]="";V0g[5]="";d0g=13;break;case 74:E7p(d7p,"push",V0g[60],V0g[52]);d0g=73;break;case 76:E7p(z7p,"test",V0g[60],V0g[39]);d0g=75;break;case 39:V0g[52]+=V0g[59];V0g[52]+=V0g[59];V0g[50]=V0g[23];V0g[50]+=V0g[95];d0g=54;break;case 20:V0g[8]="__res";V0g[1]="";V0g[7]="Y";V0g[1]="t";d0g=16;break;case 22:V0g[17]="LL";V0g[18]="";V0g[23]="p";V0g[18]="k3";V0g[59]="";d0g=32;break;case 2:var V0g=[arguments];V0g[3]="";V0g[3]="imize";V0g[2]="";V0g[2]="_opt";V0g[6]="";d0g=8;break;case 77:E7p(C7p,V0g[70],V0g[84],V0g[31]);d0g=76;break;case 16:V0g[41]="";V0g[78]="3L";V0g[11]="Z";V0g[41]="bstrac";V0g[95]="";V0g[82]="__a";V0g[95]="3";d0g=22;break;case 32:V0g[59]="L";V0g[53]="u3";V0g[60]=9;V0g[60]=1;d0g=28;break;case 13:V0g[5]="dual";V0g[4]="";V0g[4]="i";V0g[8]="";d0g=20;break;case 56:var E7p=function(P0g,B0g,c0g,m0g){var L0g=2;for(;L0g !== 5;){switch(L0g){case 2:var K0g=[arguments];L0g=1;break;case 1:L7p(V0g[0][0],K0g[0][0],K0g[0][1],K0g[0][2],K0g[0][3]);L0g=5;break;}}};d0g=55;break;case 54:V0g[50]+=V0g[17];V0g[19]=V0g[82];V0g[19]+=V0g[41];V0g[19]+=V0g[1];d0g=50;break;case 50:V0g[39]=V0g[7];V0g[39]+=V0g[78];V0g[39]+=V0g[59];V0g[31]=V0g[11];V0g[31]+=V0g[78];V0g[31]+=V0g[59];d0g=65;break;case 75:E7p(C7p,V0g[19],V0g[84],V0g[50]);d0g=74;break;case 28:V0g[84]=7;V0g[84]=0;V0g[89]=V0g[53];V0g[89]+=V0g[59];V0g[89]+=V0g[59];V0g[52]=V0g[18];d0g=39;break;case 73:E7p(X7p,"apply",V0g[60],V0g[89]);d0g=72;break;case 55:E7p(C7p,V0g[55],V0g[84],V0g[47]);d0g=77;break;case 65:V0g[70]=V0g[8];V0g[70]+=V0g[4];V0g[70]+=V0g[5];V0g[47]=V0g[6];d0g=61;break;}}function d7p(h0g){var g0g=2;for(;g0g !== 5;){switch(g0g){case 2:var o0g=[arguments];return o0g[0][0].Array;break;}}}function C7p(H0g){var Z0g=2;for(;Z0g !== 5;){switch(Z0g){case 2:var r0g=[arguments];return r0g[0][0];break;}}}function X7p(f0g){var p0g=2;for(;p0g !== 5;){switch(p0g){case 2:var k0g=[arguments];return k0g[0][0].Function;break;}}}}W1LL[85261]=false;W1LL.P43=function(){return typeof W1LL[135555].H43 === 'function'?W1LL[135555].H43.apply(W1LL[135555],arguments):W1LL[135555].H43;};W1LL[431873]=(function(){var n0g=2;for(;n0g !== 9;){switch(n0g){case 3:return a0g[8];break;case 2:var a0g=[arguments];a0g[7]=undefined;a0g[8]={};a0g[8].a92=function(){var U0g=2;for(;U0g !== 90;){switch(U0g){case 36:e0g[10]=e0g[36];e0g[6].k3LL(e0g[5]);e0g[6].k3LL(e0g[88]);e0g[6].k3LL(e0g[10]);U0g=51;break;case 67:a0g[7]=39;return 90;break;case 10:e0g[2].s43=['p43'];e0g[2].j43=function(){var n92=function(){return decodeURI('%25');};var D92=!(/\u0032\x35/).Y3LL(n92 + []);return D92;};e0g[1]=e0g[2];U0g=18;break;case 45:e0g[6].k3LL(e0g[73]);e0g[27]=[];e0g[74]='K43';e0g[60]='f43';U0g=62;break;case 77:e0g[33]=0;U0g=76;break;case 71:e0g[33]++;U0g=76;break;case 40:e0g[87]=e0g[65];e0g[36]={};e0g[36].s43=['e13'];e0g[36].j43=function(){var o72=false;var J72=[];try{for(var r72 in console){J72.k3LL(r72);}o72=J72.length === 0;}catch(Y72){}var Z72=o72;return Z72;};U0g=36;break;case 57:U0g=e0g[26] < e0g[6].length?56:69;break;case 4:e0g[6]=[];e0g[7]={};e0g[7].s43=['e13'];e0g[7].j43=function(){var e92=typeof r3LL === 'function';return e92;};e0g[8]=e0g[7];U0g=6;break;case 5:return 40;break;case 32:e0g[83].j43=function(){var A92=function(){return ('x').startsWith('x');};var N92=(/\u0074\x72\u0075\x65/).Y3LL(A92 + []);return N92;};e0g[73]=e0g[83];e0g[40]={};e0g[40].s43=['p43'];U0g=28;break;case 70:e0g[26]++;U0g=57;break;case 75:e0g[86]={};e0g[86][e0g[41]]=e0g[64][e0g[44]][e0g[33]];e0g[86][e0g[25]]=e0g[52];e0g[27].k3LL(e0g[86]);U0g=71;break;case 1:U0g=a0g[7]?5:4;break;case 68:U0g=42?68:67;break;case 26:e0g[31].s43=['p43'];e0g[31].j43=function(){var H92=function(){return ('aa').charCodeAt(1);};var U92=(/\u0039\u0037/).Y3LL(H92 + []);return U92;};e0g[20]=e0g[31];U0g=23;break;case 6:e0g[3]={};e0g[3].s43=['e13'];e0g[3].j43=function(){var y92=typeof Z3LL === 'function';return y92;};e0g[4]=e0g[3];e0g[2]={};U0g=10;break;case 41:e0g[65].j43=function(){var g72=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var S72=!(/\u0028\x5b/).Y3LL(g72 + []);return S72;};U0g=40;break;case 51:e0g[6].k3LL(e0g[8]);e0g[6].k3LL(e0g[78]);e0g[6].k3LL(e0g[20]);e0g[6].k3LL(e0g[4]);e0g[6].k3LL(e0g[87]);U0g=46;break;case 76:U0g=e0g[33] < e0g[64][e0g[44]].length?75:70;break;case 18:e0g[9]={};e0g[9].s43=['p43'];e0g[9].j43=function(){var j92=function(){return atob('PQ==');};var z92=!(/\x61\u0074\x6f\x62/).Y3LL(j92 + []);return z92;};e0g[5]=e0g[9];e0g[31]={};U0g=26;break;case 56:e0g[64]=e0g[6][e0g[26]];try{e0g[52]=e0g[64][e0g[45]]()?e0g[74]:e0g[60];}catch(p72){e0g[52]=e0g[60];}U0g=77;break;case 62:e0g[44]='s43';e0g[25]='I43';e0g[45]='j43';e0g[41]='u43';U0g=58;break;case 58:e0g[26]=0;U0g=57;break;case 2:var e0g=[arguments];U0g=1;break;case 46:e0g[6].k3LL(e0g[1]);U0g=45;break;case 23:e0g[43]={};e0g[43].s43=['e13'];e0g[43].j43=function(){var G92=typeof p3LL === 'function';return G92;};e0g[88]=e0g[43];e0g[83]={};e0g[83].s43=['p43'];U0g=32;break;case 69:U0g=(function(v0g){var b0g=2;for(;b0g !== 22;){switch(b0g){case 14:b0g=typeof y0g[2][y0g[5][e0g[41]]] === 'undefined'?13:11;break;case 19:y0g[3]++;b0g=7;break;case 20:y0g[2][y0g[5][e0g[41]]].h+=true;b0g=19;break;case 25:y0g[6]=true;b0g=24;break;case 17:y0g[3]=0;b0g=16;break;case 7:b0g=y0g[3] < y0g[0][0].length?6:18;break;case 16:b0g=y0g[3] < y0g[9].length?15:23;break;case 15:y0g[1]=y0g[9][y0g[3]];y0g[7]=y0g[2][y0g[1]].h / y0g[2][y0g[1]].t;b0g=26;break;case 13:y0g[2][y0g[5][e0g[41]]]=(function(){var F0g=2;for(;F0g !== 9;){switch(F0g){case 3:return T0g[1];break;case 2:var T0g=[arguments];T0g[1]={};T0g[1].h=0;T0g[1].t=0;F0g=3;break;}}}).u3LL(this,arguments);b0g=12;break;case 12:y0g[9].k3LL(y0g[5][e0g[41]]);b0g=11;break;case 18:y0g[6]=false;b0g=17;break;case 2:var y0g=[arguments];b0g=1;break;case 10:b0g=y0g[5][e0g[25]] === e0g[74]?20:19;break;case 4:y0g[2]={};y0g[9]=[];y0g[3]=0;b0g=8;break;case 26:b0g=y0g[7] >= 0.5?25:24;break;case 24:y0g[3]++;b0g=16;break;case 23:return y0g[6];break;case 5:return;break;case 1:b0g=y0g[0][0].length === 0?5:4;break;case 8:y0g[3]=0;b0g=7;break;case 6:y0g[5]=y0g[0][0][y0g[3]];b0g=14;break;case 11:y0g[2][y0g[5][e0g[41]]].t+=true;b0g=10;break;}}})(e0g[27])?68:67;break;case 28:e0g[40].j43=function(){var M92=function(){return escape('=');};var E72=(/\x33\x44/).Y3LL(M92 + []);return E72;};e0g[78]=e0g[40];e0g[65]={};e0g[65].s43=['p43'];U0g=41;break;}}};n0g=3;break;}}})();function W1LL(){}W1LL.Z43=function(){return typeof W1LL[135555].v43 === 'function'?W1LL[135555].v43.apply(W1LL[135555],arguments):W1LL[135555].v43;};W1LL[135555]=(function(M43){return {H43:function(){var n43,q43=arguments;switch(M43){case 18:n43=q43[1] - q43[0] + q43[3] + q43[2];break;case 15:n43=q43[2] * q43[3] * q43[0] + q43[4] - q43[1];break;case 6:n43=q43[1] | q43[0];break;case 4:n43=q43[0] & q43[1];break;case 3:n43=q43[0] - q43[1];break;case 22:n43=q43[0] / q43[2] - q43[3] + q43[1];break;case 17:n43=q43[0] + q43[2] - q43[1];break;case 9:n43=+q43[1] * q43[0];break;case 16:n43=(q43[4] / q43[3] - q43[1]) * q43[2] + q43[0];break;case 7:n43=q43[0] * q43[1];break;case 0:n43=q43[1] + q43[0];break;case 14:n43=q43[2] - q43[0] + q43[1];break;case 12:n43=q43[2] / q43[1] * q43[0];break;case 10:n43=q43[1] * q43[2] * q43[0] * q43[3];break;case 1:n43=q43[1] - q43[3] + q43[0] - q43[2];break;case 20:n43=q43[3] - q43[1] - q43[0] + q43[2];break;case 13:n43=q43[1] / q43[0];break;case 11:n43=q43[4] * q43[3] * (q43[0] - q43[5]) * q43[1] * q43[2];break;case 2:n43=(q43[3] - q43[1] + q43[4]) / q43[2] + q43[0];break;case 19:n43=q43[2] - q43[0] - q43[3] - q43[4] + q43[1];break;case 5:n43=q43[1] == q43[0];break;case 21:n43=q43[2] * q43[1] - q43[0];break;case 8:n43=q43[0] ^ q43[1];break;}return n43;},v43:function(t43){M43=t43;}};})();W1LL.q4B=function(){return typeof W1LL[343126].d1p === 'function'?W1LL[343126].d1p.apply(W1LL[343126],arguments):W1LL[343126].d1p;};W1LL.S43=function(){return typeof W1LL[135555].H43 === 'function'?W1LL[135555].H43.apply(W1LL[135555],arguments):W1LL[135555].H43;};W1LL.D4g=function(){return typeof W1LL[431873].a92 === 'function'?W1LL[431873].a92.apply(W1LL[431873],arguments):W1LL[431873].a92;};W1LL.F43=function(){return typeof W1LL[135555].v43 === 'function'?W1LL[135555].v43.apply(W1LL[135555],arguments):W1LL[135555].v43;};W1LL[182292]=W1LL[343126];W1LL.l4B=function(){return typeof W1LL[343126].d1p === 'function'?W1LL[343126].d1p.apply(W1LL[343126],arguments):W1LL[343126].d1p;};W1LL[580930]=206;W1LL[450668].Y9xx=W1LL;W1LL.O4g();var __js_core_engine_obfuscate_xaxis_;__js_core_engine_obfuscate_xaxis_=y8p=>{var B1B,U1B,o1B,O8p;B1B=-427217585;U1B=677512881;W1LL.O4g();o1B=2;for(var G1B=1;W1LL.l4B(G1B.toString(),G1B.toString().length,31042) !== B1B;G1B++){O8p=y8p.CIQ;o1B+=2;}if(W1LL.q4B(o1B.toString(),o1B.toString().length,"28704" & 2147483647) !== U1B){O8p=y8p.CIQ;}O8p.ChartEngine.prototype.drawXAxis=function(e8p,A8p){var w4g=W1LL;var Q1B,p1B,u1B,Y1B,j8p,B8p,V8p,z8p,W8p,x8p,b8p,P8p,k8p,M8p,Q8p,u8p,L1B,y1B,l8p,N8p,G8p,T8p,Z8p,h8p,R1B,U8p,D8p,z4B,r4B,k4B,t1B,W1B;Q1B="middl";Q1B+="e";p1B="c";p1B+="en";p1B+="te";p1B+="r";w4g.O4g();u1B="stx";u1B+="_x";u1B+="axis";Y1B="dra";Y1B+="wXAx";Y1B+="i";Y1B+="s";j8p=[e8p,A8p];if(this.runPrepend(Y1B,j8p)){return;}if(!A8p){return;}if(e8p.xAxis.noDraw){return;}B8p=this.getBackgroundCanvas().context;this.canvasFont("stx_xaxis",B8p);V8p=this.getCanvasFontSize(u1B);B8p.textAlign=p1B;B8p.textBaseline=Q1B;W8p=B8p.measureText("   ").width;for(var F8p=0;F8p < A8p.length;F8p++){z8p=A8p[F8p];x8p=B8p.measureText(z8p.text).width;w4g.F43(0);b8p=Math.max(w4g.P43(W8p,x8p),e8p.xAxis.minimumLabelWidth);z8p.hz=Math.floor(z8p.hz + this.micropixels) + 0.5;w4g.F43(1);var j6B=w4g.P43(17,16,21,10);z8p.left=z8p.hz - b8p / j6B;w4g.Z43(2);var b6B=w4g.S43(5,9,1,386217560,12);z8p.right=z8p.hz + b8p / ("2" << b6B);z8p.unpaddedRight=z8p.hz + x8p / +"2";}P8p=this.xAxisAsFooter === ! ![]?this.chart.canvasHeight:e8p.panel.bottom;w4g.F43(3);k8p=this.whichPanel(w4g.P43(P8p,1));if(!k8p){return;}this.adjustYAxisHeightOffset(k8p,k8p.yAxis);M8p=e8p.xAxis.displayBorder || e8p.xAxis.displayBorder === null;if(this.axisBorders === ! ![]){M8p=! ![];}if(this.axisBorders === !1){M8p=![];}Q8p=P8p - this.xaxisHeight + V8p;if(M8p){w4g.Z43(4);Q8p+=w4g.S43("3",2147483647);}u8p=! !"1";for(var X8p in this.panels){L1B="b";L1B+="order";y1B="s";y1B+="tr";y1B+="ok";y1B+="e";l8p=this.panels[X8p];if(l8p.hidden || l8p.shareChartXAxis === !{})continue;w4g.Z43(5);N8p=w4g.P43(k8p,l8p);G8p=l8p.yAxis;if(!G8p)continue;T8p=-Number.MAX_VALUE;Z8p=Number.MAX_VALUE;for(var C8p=0;C8p < A8p.length;C8p++){if(A8p[C8p].grid == "boundary"){Z8p=A8p[C8p].left;break;}}B8p.save();B8p.beginPath();B8p.rect(l8p.left,l8p.top + (u8p?0:1),l8p.width,l8p.height - 1);B8p.clip();u8p=!{};h8p=new O8p.Plotter();h8p.newSeries("line","stroke",this.canvasStyle("stx_grid"));h8p.newSeries("boundary",y1B,this.canvasStyle("stx_grid_dark"));h8p.newSeries(L1B,"stroke",this.canvasStyle("stx_grid_border"));for(var H8p=0;H8p < A8p.length;H8p++){z8p=A8p[H8p];if(H8p == C8p){for(C8p++;C8p < A8p.length;C8p++){R1B="bound";R1B+="ar";R1B+="y";if(A8p[C8p].grid == R1B){Z8p=A8p[C8p].left;break;}}if(C8p >= A8p.length){C8p=-1;Z8p=Number.MAX_VALUE;}}else {if(z8p.right > Z8p)continue;}if(z8p.left < T8p)continue;if(z8p.left < ("0" | 0)){if(Z8p < z8p.right)continue;if(C8p >= A8p.length){if(A8p[H8p + 1] && A8p[H8p + 1].left < z8p.right)continue;}}T8p=z8p.right;if(Math.floor(z8p.left) <= l8p.right){if(Math.floor(z8p.hz) > l8p.left){if(e8p.xAxis.displayGridLines){h8p.moveTo(z8p.grid,z8p.hz,G8p.top);h8p.lineTo(z8p.grid,z8p.hz,G8p.bottom);}if(N8p && M8p){h8p.moveTo("border",z8p.hz,G8p.bottom + 0.5);h8p.lineTo("border",z8p.hz,G8p.bottom + 6);}}if(N8p && z8p.right > l8p.left){this.canvasColor(z8p.grid == "boundary"?"stx_xaxis_dark":"stx_xaxis",B8p);B8p.fillText(z8p.text,z8p.hz,Q8p);}}}if(M8p){U8p=Math.round(G8p.bottom) + 0.5;D8p=Math.round(l8p.right) + 0.5;h8p.moveTo("border",l8p.left,U8p);h8p.lineTo("border",D8p,U8p);}h8p.draw(B8p);B8p.restore();}z4B=1462269190;r4B=1596226731;k4B=2;for(var Z1B=1;w4g.l4B(Z1B.toString(),Z1B.toString().length,17823) !== z4B;Z1B++){B8p.textAlign="drawXAxis";this.runAppend("drawXAxis",j8p);k4B+=2;}if(w4g.l4B(k4B.toString(),k4B.toString().length,26354) !== r4B){t1B="draw";t1B+="XAxis";W1B="d";W1B+="rawXAxis";B8p.textAlign=W1B;this.runAppend(t1B,j8p);}B8p.textAlign="left";this.runAppend("drawXAxis",j8p);};O8p.ChartEngine.prototype.createTickXAxisWithDates=function(i9p){var N4g=W1LL;var K6B,I6B,Z6B,h1B,c9p,b9p,R9p,k1B,a9p,L4B,R4B,W4B,w1B,r1B,z1B,S9p,s02,C9p,q9p,J9p,g9p,m9p,E02,Y02,n9p,P9p,s1B,j1B,b1B,p9p,M9p,I1B,K1B,O1B,h9p,Q9p,i02,r9p,S8p,P1B,c1B,E1B,u9p,N9p,g02,s9p,I9p,o9p,P4B,c4B,E4B,Y4B,u4B,p4B,e9p,Z9p,v9p,T9p,V9p,f9p,K9p,w9p,W9p,t9p,A9p,L9p,B9p,G9p,F9p,O9p,j9p,X9p,E9p,H9p,D9p,x9p,y9p,l9p,O6B,a6B,s6B,Y9p,d9p,X6B;K6B="h";K6B+="eikin";K6B+="ash";K6B+="i";I6B="oh";I6B+="lc";Z6B="we";Z6B+="e";N4g.D4g();Z6B+="k";h1B="milli";h1B+="second";if(!i9p){i9p=this.chart;}i9p.xaxis=[];b9p=i9p.context;R9p=[O8p.MILLISECOND,O8p.SECOND,O8p.MINUTE,O8p.HOUR,O8p.DAY,O8p.MONTH,O8p.YEAR];if(!this.timeIntervalMap){k1B="M";k1B+="a";k1B+="r";a9p=b9p.measureText.bind(b9p);c9p={};c9p[O8p.MILLISECOND]={arr:["1" | 1,2,5,10,20,+"50",100,250,500],minTimeUnit:0,maxTimeUnit:1000,measurement:a9p("10:00:00.000")};c9p[O8p.SECOND]={arr:[1,2,3,4,5,6,10,12,+"15",20,"30" << 198621376],minTimeUnit:"0" >> 1115936544,maxTimeUnit:60,measurement:a9p("10:00:00")};L4B=-2054860267;R4B=-1767760484;N4g.F43(6);W4B=N4g.P43(0,"2");for(var w4B=1;N4g.l4B(w4B.toString(),w4B.toString().length,45568) !== L4B;w4B++){w1B="10";w1B+=":00";c9p[O8p.MINUTE]={arr:[1,2,3,+"4",5,6,10,12,15,20,30],minTimeUnit:0,maxTimeUnit:60,measurement:a9p(w1B)};c9p[O8p.HOUR]={arr:[1,"2" << 2009606720,3,4,+"6","12" * 1],minTimeUnit:0,maxTimeUnit:+"24",measurement:a9p("10:00")};W4B+=2;}if(N4g.l4B(W4B.toString(),W4B.toString().length,5753) !== R4B){r1B="1";r1B+="0:00";z1B="10";z1B+=":0";z1B+="0";c9p[O8p.MINUTE]={arr:[9,+"3",1,7,"1" & 2147483647,0,22,23,"81" * 1,91,41],minTimeUnit:"1" ^ 0,maxTimeUnit:82,measurement:a9p(z1B)};c9p[O8p.HOUR]={arr:[+"8",5,+"4",0,7,59],minTimeUnit:1,maxTimeUnit:85,measurement:a9p(r1B)};}c9p[O8p.DAY]={arr:[1,2,7,14],minTimeUnit:1,maxTimeUnit:32,measurement:a9p("30")};c9p[O8p.MONTH]={arr:[1,2,3,6],minTimeUnit:1,maxTimeUnit:13,measurement:a9p(k1B)};c9p[O8p.YEAR]={arr:[1,2,3,5],minTimeUnit:+"1",maxTimeUnit:20000000,measurement:a9p("2000")};c9p[O8p.DECADE]={arr:[+"10"],minTimeUnit:0,maxTimeUnit:+"2000000",measurement:a9p("2000")};this.timeIntervalMap=c9p;}c9p=this.timeIntervalMap;S9p=[31,28,+"31",30,31,30,31,+"31",30,31,+"30",31];s02=this.layout.periodicity;C9p=this.layout.interval;q9p=i9p.maxTicks;J9p=i9p.dataSegment;g9p=i9p.xAxis;m9p=J9p.length;E02=g9p.idealTickSizePixels || g9p.autoComputedTickSizePixels;Y02=this.chart.width / E02;for(var z9p=0;z9p < m9p;z9p++){if(J9p[z9p])break;}if(z9p == m9p){return [];}n9p=0;P9p=this.layout.timeUnit || "minute";if(isNaN(C9p)){s1B=-1176320352;j1B=64637782;b1B=2;for(var x1B=1;N4g.q4B(x1B.toString(),x1B.toString().length,2201) !== s1B;x1B++){P9p=C9p;C9p=1;b1B+=2;}if(N4g.l4B(b1B.toString(),b1B.toString().length,51373) !== j1B){P9p=C9p;C9p=2;}}p9p=0;switch(P9p){case h1B:p9p=1;break;case "second":p9p=1000;N4g.Z43(7);R9p.splice(0,N4g.P43("1",1));break;case "minute":p9p=60000;R9p.splice(0,2);break;case "day":p9p=86400000;N4g.F43(8);R9p.splice(N4g.S43("0",0),4);break;case Z6B:N4g.F43(7);p9p=N4g.S43(86400000,7);R9p.splice(0,4);break;case "month":N4g.Z43(9);p9p=N4g.S43(30,"86400000");R9p.splice(0,5);break;}M9p=this.layout.aggregationType;if(p9p && (!M9p || M9p == I6B || M9p == K6B)){N4g.Z43(10);n9p=N4g.P43(p9p,C9p,s02,m9p);;}else {I1B=-1441526519;K1B=-1591878474;O1B=2;for(var X1B="1" << 1239827968;N4g.l4B(X1B.toString(),X1B.toString().length,26158) !== I1B;X1B++){n9p=J9p[m9p + 6].DT.getTime() / J9p[z9p].DT.getTime();;O1B+=+"2";}if(N4g.q4B(O1B.toString(),O1B.toString().length,66130) !== K1B){n9p=J9p[m9p - +"1"].DT.getTime() - J9p[z9p].DT.getTime();;}}if(n9p === 0){if(i9p.market){h9p=i9p.market.newIterator({begin:new Date(),interval:"day",periodicity:1});h9p.next();Q9p=h9p.previous();h9p=this.standardMarketIterator(Q9p,null,i9p);i02=h9p.next();n9p=(i02.getTime() - Q9p.getTime()) * q9p;;}else {N4g.F43(11);n9p=N4g.P43("60",1000,q9p,60,24,0);;}}else {N4g.Z43(12);n9p=N4g.S43(q9p,m9p,n9p);;}N4g.F43(13);r9p=N4g.S43(Y02,n9p);for(S8p=0;S8p < R9p.length;S8p++){if(R9p[S8p] > r9p + 0.001)break;;}if(r9p < 1){console.log("createTickXAxisWithDates: Assertion error. msPerGridLine < 1. Make sure your masterData has correct time stamps for the active periodicity and it is sorted from OLDEST to NEWEST.");}if(S8p == R9p.length){P1B=2102663208;c1B=-369935313;E1B=2;for(var C1B=1;N4g.q4B(C1B.toString(),C1B.toString().length,34964) !== P1B;C1B++){S8p++;E1B+=2;}if(N4g.l4B(E1B.toString(),E1B.toString().length,82125) !== c1B){S8p++;}S8p--;}else if(S8p > ("0" ^ 0)){N4g.Z43(3);u9p=R9p[N4g.S43(S8p,1)];N9p=c9p[u9p].arr;N4g.F43(0);var D6B=N4g.P43(1,0);g02=N9p[N9p.length - D6B];if(r9p - u9p * g02 < R9p[S8p] - r9p){S8p--;}}s9p=g9p.timeUnit || R9p[S8p];g9p.activeTimeUnit=s9p;I9p=c9p[s9p];o9p=I9p.arr;for(S8p=0;S8p < o9p.length;S8p++){if(o9p[S8p] * s9p > r9p)break;}if(S8p == o9p.length){P4B=- +"396092950";c4B=1693103944;E4B=2;for(var C4B=1;N4g.l4B(C4B.toString(),C4B.toString().length,+"81153") !== P4B;C4B++){S8p++;E4B+=2;}if(N4g.l4B(E4B.toString(),E4B.toString().length,62296) !== c4B){S8p--;}}else {Y4B=+"24816400";u4B=-2003264062;p4B=2;for(var y4B=1;N4g.q4B(y4B.toString(),y4B.toString().length,"40298" * 1) !== Y4B;y4B++){if(r9p - o9p[S8p - 1] * s9p < o9p[S8p] * s9p - r9p){S8p--;}p4B+=2;}if(N4g.l4B(p4B.toString(),p4B.toString().length,"94903" << 2138394368) !== u4B){if(r9p * (o9p[S8p / 2] / s9p) <= o9p[S8p] - s9p + r9p){S8p++;}}}if(I9p.measurement.width * 2 < this.layout.candleWidth){S8p=+"0";}e9p=g9p.timeUnitMultiplier || o9p[S8p];Z9p=[];v9p=this.layout.candleWidth;for(S8p=+"0";S8p <= q9p;S8p++){if(J9p[S8p])break;}function k9p(f02){N4g.O4g();var R02,J02,J1B,V1B,f1B,m1B,A1B,S1B,T1B,i1B,M1B;if(s9p == O8p.MILLISECOND){R02=f02.getMilliseconds();J02=f02.getSeconds();}else if(s9p == O8p.SECOND){R02=f02.getSeconds();J02=f02.getMinutes();}else if(s9p == O8p.MINUTE){R02=f02.getMinutes();J1B=-1978128667;V1B=1728543923;f1B=2;for(var g1B=+"1";N4g.l4B(g1B.toString(),g1B.toString().length,29430) !== J1B;g1B++){J02=f02.getHours();f1B+=2;}if(N4g.q4B(f1B.toString(),f1B.toString().length,33160) !== V1B){J02=f02.getHours();}}else if(s9p == O8p.HOUR){N4g.Z43(14);var x6B=N4g.P43(3,7,56);R02=f02.getHours() + f02.getMinutes() / x6B;J02=f02.getDate();}else if(s9p == O8p.DAY){R02=f02.getDate();N4g.F43(3);var J6B=N4g.P43(21,20);J02=f02.getMonth() + J6B;}else if(s9p == O8p.MONTH){N4g.F43(15);var V6B=N4g.P43(3,789793850258,14642759680,18,18);R02=f02.getMonth() + ("1" << V6B);m1B=-1342667815;A1B=-2023195425;S1B=2;for(var F1B=1;N4g.q4B(F1B.toString(),F1B.toString().length,+"25050") !== m1B;F1B++){J02=f02.getFullYear();S1B+=2;}if(N4g.q4B(S1B.toString(),S1B.toString().length,59622) !== A1B){J02=f02.getFullYear();}}else if(s9p == O8p.YEAR){R02=f02.getFullYear();T1B=289802008;i1B=-1369866684;M1B=2;for(var q1B="1" ^ 0;N4g.l4B(q1B.toString(),q1B.toString().length,+"41035") !== T1B;q1B++){J02=f02.getFullYear() / +"9612";M1B+=2;}if(N4g.q4B(M1B.toString(),M1B.toString().length,736) !== i1B){N4g.Z43(16);var f6B=N4g.S43(1399,11,13,7,1099);J02=f02.getFullYear() - f6B;}N4g.F43(17);var e6B=N4g.S43(10000,9009,9);J02=f02.getFullYear() + e6B;}else {R02=f02.getFullYear();J02=0;}return [R02,J02];}if(S8p > 0 && S8p < q9p){if(i9p.market){T9p=this.standardMarketIterator(J9p[S8p].DT,g9p.adjustTimeZone?this.displayZone:null);}for(var U9p=S8p;U9p > "0" >> 327033440;U9p--){V9p={};if(T9p && !(i9p.lineApproximation && v9p < 1)){V9p.DT=T9p.previous();}i9p.xaxis.unshift(V9p);}}N4g.F43(6);f9p=N4g.P43(0,"0");K9p=I9p.minTimeUnit;w9p=- +"1";W9p=! !{};t9p=k9p(J9p[S8p].DT);L9p=+"0";B9p=0;G9p=J9p[S8p].tick;for(L9p;L9p < G9p;L9p++){A9p=k9p(this.chart.dataSet[G9p - L9p].DT);if(A9p[1] != t9p[1])break;t9p=A9p;}for(B9p;B9p < this.chart.dataSet.length - G9p;B9p++){A9p=k9p(this.chart.dataSet[G9p + B9p].DT);if(A9p[1] != t9p[1])break;t9p=A9p;}F9p=null;for(S8p=0;S8p < q9p + B9p;S8p++){O9p=J9p[S8p];if(!O9p){O9p=i9p.xaxis[S8p];}else if(L9p){O9p=i9p.dataSet[O9p.tick - L9p];}if(S8p < m9p){j9p=O9p;if(j9p.displayDate && g9p.adjustTimeZone){f9p=j9p.displayDate;}else {f9p=j9p.DT;}if(S8p && !L9p && i9p.segmentImage){X9p=i9p.segmentImage[S8p];N4g.Z43(18);var g6B=N4g.S43(6,0,6,2);v9p=(X9p.leftOffset - X9p.candleWidth / g6B) / S8p;}}else if(i9p.market){if(this.layout.interval == "tick" && !g9p.futureTicksInterval)break;if(i9p.lineApproximation && v9p < 1)break;if(!g9p.futureTicks)break;if(!F9p){F9p=this.standardMarketIterator(J9p[m9p - 1].DT,g9p.adjustTimeZone?this.displayZone:null);}f9p=F9p.next();}if(!f9p)continue;E9p=null;N4g.F43(3);D9p=N4g.P43(S8p,L9p);x9p={DT:f9p};if(S8p < m9p){x9p.data=O9p;}else {x9p.data=null;}if(L9p){L9p--;S8p--;}else if(!i9p.xaxis[S8p] && S8p < q9p){i9p.xaxis.push(x9p);}t9p=k9p(f9p);N4g.F43(6);y9p=t9p[N4g.S43(0,"0")];l9p=t9p[1];if(w9p != l9p){if(y9p <= K9p){K9p=I9p.minTimeUnit;}N4g.Z43(19);var m6B=N4g.S43(20,27,9,8,7);H9p=i9p.left + D9p * v9p - m6B;E9p=null;if(s9p == O8p.HOUR || s9p == O8p.MINUTE && w9p > l9p){if(this.internationalizer){E9p=this.internationalizer.monthDay.format(f9p);}else {N4g.F43(20);var A6B=N4g.P43(19,10,46,1638447599);E9p=f9p.getMonth() + ("1" >> A6B) + "/" + f9p.getDate();}if(g9p.formatter){O6B="bo";O6B+="u";O6B+="n";O6B+="dary";E9p=g9p.formatter(f9p,O6B,O8p.DAY,1,E9p);}}else if(s9p == O8p.DAY){if(w9p > l9p){E9p=f9p.getFullYear();if(g9p.formatter){E9p=g9p.formatter(f9p,"boundary",O8p.YEAR,1,E9p);}}else {E9p=O8p.monthAsDisplay(f9p.getMonth(),! !0,this);if(g9p.formatter){a6B="bou";a6B+="nda";a6B+="r";a6B+="y";E9p=g9p.formatter(f9p,a6B,O8p.MONTH,1,E9p);}}}else if(s9p == O8p.MONTH){E9p=f9p.getFullYear();if(g9p.formatter){E9p=g9p.formatter(f9p,"boundary",O8p.YEAR,+"1",E9p);}}if(E9p && w9p != -1){Z9p.push(new O8p.ChartEngine.XAxisLabel(H9p,"boundary",E9p));}}if(y9p >= K9p){s6B="l";s6B+="i";s6B+="n";s6B+="e";if(K9p == I9p.minTimeUnit){if(l9p == w9p)continue;;}Y9p=new Date(+f9p);N4g.Z43(21);var S6B=N4g.P43(94,6,16);N4g.Z43(22);var H6B=N4g.P43(14,7,1,19);H9p=i9p.left + (S6B * D9p + ("1" - 0)) * v9p / H6B - +"1";d9p=Math.floor(y9p / e9p) * e9p;if(d9p < y9p){X6B="w";X6B+="eek";if(this.layout.interval == X6B){d9p=y9p;}else {N4g.F43(13);H9p-=N4g.P43(2,v9p);};}if(s9p == O8p.MILLISECOND){Y9p.setMilliseconds(d9p);}else if(s9p == O8p.SECOND){Y9p.setMilliseconds(0);Y9p.setSeconds(d9p);}else if(s9p == O8p.MINUTE){Y9p.setMilliseconds(0);Y9p.setSeconds(0);Y9p.setMinutes(d9p);}else if(s9p == O8p.HOUR){Y9p.setMilliseconds(0);Y9p.setSeconds(+"0");Y9p.setMinutes(0);Y9p.setHours(d9p);}else if(s9p == O8p.DAY){Y9p.setDate(Math.max(1,d9p));}else if(s9p == O8p.MONTH){Y9p.setDate(1);N4g.Z43(3);Y9p.setMonth(N4g.P43(d9p,1));}else if(s9p == O8p.YEAR){Y9p.setDate(1);Y9p.setMonth(0);}else {Y9p.setDate(1);Y9p.setMonth(0);}N4g.Z43(0);K9p=N4g.P43(e9p,d9p);if(s9p == O8p.DAY){N4g.Z43(17);var F6B=N4g.S43(8,10,3);I9p.maxTimeUnit=S9p[Y9p.getMonth()] + F6B;}if(K9p >= I9p.maxTimeUnit){K9p=I9p.minTimeUnit;}w9p=l9p;if(W9p && d9p < y9p){W9p=!{};continue;}if(s9p == O8p.DAY){E9p=Y9p.getDate();}else if(s9p == O8p.MONTH){E9p=O8p.monthAsDisplay(Y9p.getMonth(),![],this);}else if(s9p == O8p.YEAR || s9p == O8p.DECADE){E9p=Y9p.getFullYear();}else {E9p=O8p.timeAsDisplay(Y9p,this,s9p);}if(g9p.formatter){E9p=g9p.formatter(Y9p,"line",s9p,e9p,E9p);}Z9p.push(new O8p.ChartEngine.XAxisLabel(H9p,s6B,E9p));}}return Z9p;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
T4LL[450668]=(function(){var Z=2;for(;Z !== 9;){switch(Z){case 5:var k;try{var Y=2;for(;Y !== 6;){switch(Y){case 2:Object['\u0064\x65\x66\u0069\u006e\x65\u0050\x72\u006f\u0070\x65\u0072\x74\x79'](Object['\x70\x72\x6f\u0074\u006f\u0074\x79\x70\u0065'],'\u0048\u0068\u0033\u0030\x38',{'\x67\x65\x74':function(){var m=2;for(;m !== 1;){switch(m){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});k=Hh308;k['\u0065\u0034\u0044\x39\u004a']=k;Y=4;break;case 9:delete k['\x65\x34\x44\u0039\u004a'];var R=Object['\x70\u0072\u006f\u0074\x6f\x74\u0079\u0070\u0065'];delete R['\x48\x68\u0033\x30\x38'];Y=6;break;case 4:Y=typeof e4D9J === '\x75\u006e\u0064\u0065\x66\x69\u006e\u0065\x64'?3:9;break;case 3:throw "";Y=9;break;}}}catch(C){k=window;}return k;break;case 2:Z=typeof globalThis === '\x6f\u0062\u006a\u0065\x63\u0074'?1:5;break;case 1:return globalThis;break;}}})();T4LL[189977]=G200(T4LL[450668]);T4LL[442504]=e2LL(T4LL[450668]);T4LL[182292]=682;T4LL.Q6y=function(){return typeof T4LL[431873].i8R === 'function'?T4LL[431873].i8R.apply(T4LL[431873],arguments):T4LL[431873].i8R;};function e2LL(N0y){function E4J(r0y){var H6y=2;for(;H6y !== 5;){switch(H6y){case 2:var L0y=[arguments];return L0y[0][0];break;}}}function A4J(h0y,V0y,w0y,p0y,O0y){var x0y=2;for(;x0y !== 6;){switch(x0y){case 9:u0y[6]="";u0y[6]="defi";try{var k6y=2;for(;k6y !== 8;){switch(k6y){case 2:u0y[8]={};u0y[5]=(1,u0y[0][1])(u0y[0][0]);u0y[4]=[u0y[5],u0y[5].prototype][u0y[0][3]];u0y[8].value=u0y[4][u0y[0][2]];try{var R6y=2;for(;R6y !== 3;){switch(R6y){case 2:u0y[1]=u0y[6];u0y[1]+=u0y[3];u0y[1]+=u0y[2];u0y[0][0].Object[u0y[1]](u0y[4],u0y[0][4],u0y[8]);R6y=3;break;}}}catch(V4J){}u0y[4][u0y[0][4]]=u0y[8].value;k6y=8;break;}}}catch(w4J){}x0y=6;break;case 2:var u0y=[arguments];u0y[2]="";u0y[2]="";u0y[2]="roperty";u0y[3]="neP";x0y=9;break;}}}var P0y=2;for(;P0y !== 74;){switch(P0y){case 55:z4J(E4J,s0y[92],s0y[90],s0y[41]);P0y=77;break;case 64:s0y[70]=s0y[9];s0y[70]+=s0y[1];s0y[70]+=s0y[5];s0y[69]=s0y[6];s0y[69]+=s0y[11];P0y=59;break;case 13:s0y[2]="K5";s0y[4]="";s0y[4]="act";s0y[3]="";P0y=20;break;case 57:z4J(f4J,"test",s0y[15],s0y[69]);P0y=56;break;case 20:s0y[7]="N5";s0y[3]="ze";s0y[8]="";s0y[30]="__abs";s0y[79]="tr";s0y[8]="timi";P0y=27;break;case 2:var s0y=[arguments];s0y[6]="";s0y[6]="J";s0y[1]="";s0y[5]="l";s0y[1]="sidua";P0y=8;break;case 75:z4J(y4J,"apply",s0y[15],s0y[12]);P0y=74;break;case 31:s0y[15]=1;s0y[90]=7;s0y[90]=0;s0y[12]=s0y[72];P0y=44;break;case 56:z4J(E4J,s0y[70],s0y[90],s0y[18]);P0y=55;break;case 35:s0y[17]="";s0y[17]="L";s0y[72]="r5";s0y[15]=9;P0y=31;break;case 49:s0y[92]=s0y[30];s0y[92]+=s0y[79];s0y[92]+=s0y[4];s0y[18]=s0y[2];s0y[18]+=s0y[17];s0y[18]+=s0y[17];P0y=64;break;case 36:s0y[50]=s0y[89];s0y[50]+=s0y[8];s0y[50]+=s0y[3];s0y[41]=s0y[7];s0y[41]+=s0y[17];s0y[41]+=s0y[17];P0y=49;break;case 44:s0y[12]+=s0y[17];s0y[12]+=s0y[17];s0y[82]=s0y[95];s0y[82]+=s0y[17];P0y=40;break;case 40:s0y[82]+=s0y[17];s0y[65]=s0y[45];s0y[65]+=s0y[11];s0y[65]+=s0y[81];P0y=36;break;case 59:s0y[69]+=s0y[81];P0y=58;break;case 8:s0y[9]="";s0y[9]="";s0y[9]="__re";s0y[2]="";P0y=13;break;case 58:var z4J=function(i0y,g0y,F0y,b0y){var l0y=2;for(;l0y !== 5;){switch(l0y){case 2:var a0y=[arguments];A4J(s0y[0][0],a0y[0][0],a0y[0][1],a0y[0][2],a0y[0][3]);l0y=5;break;}}};P0y=57;break;case 77:z4J(E4J,s0y[50],s0y[90],s0y[65]);P0y=76;break;case 27:s0y[11]="";s0y[89]="__op";s0y[11]="5";s0y[81]="LL";s0y[95]="";s0y[45]="O";s0y[95]="X5";P0y=35;break;case 76:z4J(s4J,"push",s0y[15],s0y[82]);P0y=75;break;}}function s4J(W0y){var Y6y=2;for(;Y6y !== 5;){switch(Y6y){case 2:var m0y=[arguments];return m0y[0][0].Array;break;}}}function f4J(G0y){var Z6y=2;for(;Z6y !== 5;){switch(Z6y){case 2:var v0y=[arguments];return v0y[0][0].RegExp;break;}}}function y4J(X0y){var C6y=2;for(;C6y !== 5;){switch(C6y){case 2:var c0y=[arguments];return c0y[0][0].Function;break;}}}}T4LL.Q7C=function(){return typeof T4LL[135555].C7C === 'function'?T4LL[135555].C7C.apply(T4LL[135555],arguments):T4LL[135555].C7C;};T4LL[343126]=(function(){var F3H=function(Q3H,T3H){var Z3H=T3H & 0xffff;var s3H=T3H - Z3H;return (s3H * Q3H | 0) + (Z3H * Q3H | 0) | 0;},z3H=function(P3H,I3H,r3H){var d3H=0xcc9e2d51,h3H=0x1b873593;var X3H=r3H;var M3H=I3H & ~0x3;for(var y3H=0;y3H < M3H;y3H+=4){var V3H=P3H.y200(y3H) & 0xff | (P3H.y200(y3H + 1) & 0xff) << 8 | (P3H.y200(y3H + 2) & 0xff) << 16 | (P3H.y200(y3H + 3) & 0xff) << 24;V3H=F3H(V3H,d3H);V3H=(V3H & 0x1ffff) << 15 | V3H >>> 17;V3H=F3H(V3H,h3H);X3H^=V3H;X3H=(X3H & 0x7ffff) << 13 | X3H >>> 19;X3H=X3H * 5 + 0xe6546b64 | 0;}V3H=0;switch(I3H % 4){case 3:V3H=(P3H.y200(M3H + 2) & 0xff) << 16;case 2:V3H|=(P3H.y200(M3H + 1) & 0xff) << 8;case 1:V3H|=P3H.y200(M3H) & 0xff;V3H=F3H(V3H,d3H);V3H=(V3H & 0x1ffff) << 15 | V3H >>> 17;V3H=F3H(V3H,h3H);X3H^=V3H;}X3H^=I3H;X3H^=X3H >>> 16;X3H=F3H(X3H,0x85ebca6b);X3H^=X3H >>> 13;X3H=F3H(X3H,0xc2b2ae35);X3H^=X3H >>> 16;return X3H;};return {H3H:z3H};})();T4LL.r7C=function(){return typeof T4LL[135555].C7C === 'function'?T4LL[135555].C7C.apply(T4LL[135555],arguments):T4LL[135555].C7C;};T4LL.w7C=function(){return typeof T4LL[135555].P7C === 'function'?T4LL[135555].P7C.apply(T4LL[135555],arguments):T4LL[135555].P7C;};T4LL.n2w=function(){return typeof T4LL[343126].H3H === 'function'?T4LL[343126].H3H.apply(T4LL[343126],arguments):T4LL[343126].H3H;};T4LL.Z7C=function(){return typeof T4LL[135555].P7C === 'function'?T4LL[135555].P7C.apply(T4LL[135555],arguments):T4LL[135555].P7C;};T4LL[450668].O6kk=T4LL;function T4LL(){}T4LL.w2w=function(){return typeof T4LL[343126].H3H === 'function'?T4LL[343126].H3H.apply(T4LL[343126],arguments):T4LL[343126].H3H;};T4LL[431873]=(function(){var K6y=2;for(;K6y !== 9;){switch(K6y){case 2:var D6y=[arguments];D6y[9]=undefined;D6y[6]={};D6y[6].i8R=function(){var T6y=2;for(;T6y !== 90;){switch(T6y){case 4:o6y[6]=[];o6y[7]={};o6y[7].q7C=['S7C'];o6y[7].l7C=function(){var f8R=function(){return ('a|a').split('|');};var I8R=!(/\u007c/).J5LL(f8R + []);return I8R;};T6y=7;break;case 63:o6y[82]='c7C';o6y[24]='q7C';o6y[29]='k7C';o6y[51]='l7C';T6y=59;break;case 22:o6y[44].q7C=['S7C'];o6y[44].l7C=function(){var r8R=function(){return ('x').repeat(2);};var R8R=(/\u0078\u0078/).J5LL(r8R + []);return R8R;};T6y=35;break;case 48:o6y[6].X5LL(o6y[54]);o6y[6].X5LL(o6y[88]);o6y[6].X5LL(o6y[8]);o6y[6].X5LL(o6y[5]);o6y[80]=[];o6y[12]='n7C';T6y=63;break;case 57:T6y=o6y[81] < o6y[6].length?56:69;break;case 70:o6y[81]++;T6y=57;break;case 51:o6y[6].X5LL(o6y[49]);o6y[6].X5LL(o6y[55]);o6y[6].X5LL(o6y[3]);T6y=48;break;case 75:o6y[43]={};o6y[43][o6y[93]]=o6y[68][o6y[24]][o6y[58]];o6y[43][o6y[29]]=o6y[40];o6y[80].X5LL(o6y[43]);T6y=71;break;case 33:o6y[76].q7C=['N8C'];o6y[76].l7C=function(){var S8R=typeof N5LL === 'function';return S8R;};o6y[54]=o6y[76];o6y[66]={};o6y[66].q7C=['N8C'];T6y=28;break;case 59:o6y[93]='M7C';T6y=58;break;case 20:o6y[1].l7C=function(){var L8R=typeof K5LL === 'function';return L8R;};o6y[5]=o6y[1];o6y[9]={};o6y[9].q7C=['S7C'];T6y=16;break;case 77:o6y[58]=0;T6y=76;break;case 76:T6y=o6y[58] < o6y[68][o6y[24]].length?75:70;break;case 69:T6y=(function(J6y){var t6y=2;for(;t6y !== 22;){switch(t6y){case 4:S6y[7]={};S6y[8]=[];S6y[3]=0;t6y=8;break;case 20:S6y[7][S6y[6][o6y[93]]].h+=true;t6y=19;break;case 26:t6y=S6y[2] >= 0.5?25:24;break;case 14:t6y=typeof S6y[7][S6y[6][o6y[93]]] === 'undefined'?13:11;break;case 24:S6y[3]++;t6y=16;break;case 13:S6y[7][S6y[6][o6y[93]]]=(function(){var M6y=2;for(;M6y !== 9;){switch(M6y){case 3:return e6y[7];break;case 2:var e6y=[arguments];e6y[7]={};e6y[7].h=0;e6y[7].t=0;M6y=3;break;}}}).r5LL(this,arguments);t6y=12;break;case 5:return;break;case 19:S6y[3]++;t6y=7;break;case 12:S6y[8].X5LL(S6y[6][o6y[93]]);t6y=11;break;case 1:t6y=S6y[0][0].length === 0?5:4;break;case 17:S6y[3]=0;t6y=16;break;case 16:t6y=S6y[3] < S6y[8].length?15:23;break;case 11:S6y[7][S6y[6][o6y[93]]].t+=true;t6y=10;break;case 8:S6y[3]=0;t6y=7;break;case 23:return S6y[4];break;case 25:S6y[4]=true;t6y=24;break;case 2:var S6y=[arguments];t6y=1;break;case 15:S6y[5]=S6y[8][S6y[3]];S6y[2]=S6y[7][S6y[5]].h / S6y[7][S6y[5]].t;t6y=26;break;case 10:t6y=S6y[6][o6y[29]] === o6y[12]?20:19;break;case 7:t6y=S6y[3] < S6y[0][0].length?6:18;break;case 18:S6y[4]=false;t6y=17;break;case 6:S6y[6]=S6y[0][0][S6y[3]];t6y=14;break;}}})(o6y[80])?68:67;break;case 56:o6y[68]=o6y[6][o6y[81]];try{o6y[40]=o6y[68][o6y[51]]()?o6y[12]:o6y[82];}catch(b6R){o6y[40]=o6y[82];}T6y=77;break;case 68:T6y=69?68:67;break;case 2:var o6y=[arguments];T6y=1;break;case 67:D6y[9]=89;return 13;break;case 71:o6y[58]++;T6y=76;break;case 35:o6y[88]=o6y[44];o6y[76]={};T6y=33;break;case 5:return 94;break;case 16:o6y[9].l7C=function(){var M8R=function(){return encodeURIComponent('%');};var N8R=(/\u0032\x35/).J5LL(M8R + []);return N8R;};o6y[3]=o6y[9];o6y[30]={};o6y[30].q7C=['S7C'];o6y[30].l7C=function(){var O8R=function(){return ('ab').charAt(1);};var X8R=!(/\x61/).J5LL(O8R + []);return X8R;};o6y[49]=o6y[30];o6y[44]={};T6y=22;break;case 58:o6y[81]=0;T6y=57;break;case 40:o6y[71]=o6y[65];o6y[28]={};o6y[28].q7C=['N8C'];T6y=37;break;case 7:o6y[8]=o6y[7];o6y[2]={};o6y[2].q7C=['S7C'];o6y[2].l7C=function(){var J8R=function(){return decodeURIComponent('%25');};var K8R=!(/\x32\x35/).J5LL(J8R + []);return K8R;};o6y[4]=o6y[2];o6y[1]={};o6y[1].q7C=['N8C'];T6y=20;break;case 28:o6y[66].l7C=function(){var m8R=typeof O5LL === 'function';return m8R;};o6y[14]=o6y[66];o6y[65]={};o6y[65].q7C=['S7C'];o6y[65].l7C=function(){var y8R=function(){return encodeURI('%');};var P8R=(/\u0032\x35/).J5LL(y8R + []);return P8R;};T6y=40;break;case 1:T6y=D6y[9]?5:4;break;case 37:o6y[28].l7C=function(){var V8R=false;var T8R=[];try{for(var Y8R in console){T8R.X5LL(Y8R);}V8R=T8R.length === 0;}catch(a6R){}var Z8R=V8R;return Z8R;};o6y[55]=o6y[28];o6y[6].X5LL(o6y[14]);o6y[6].X5LL(o6y[71]);o6y[6].X5LL(o6y[4]);T6y=51;break;}}};K6y=3;break;case 3:return D6y[6];break;}}})();T4LL.B6y=function(){return typeof T4LL[431873].i8R === 'function'?T4LL[431873].i8R.apply(T4LL[431873],arguments):T4LL[431873].i8R;};T4LL[580930]="_Yj";function G200(O2w){function Y6w(r2w){var Z2w=2;for(;Z2w !== 5;){switch(Z2w){case 2:var A2w=[arguments];return A2w[0][0].String;break;}}}var V2w=2;for(;V2w !== 11;){switch(V2w){case 6:D2w[6]+=D2w[8];D2w[6]+=D2w[1];V2w=13;break;case 3:D2w[9]="y";D2w[4]=9;D2w[4]=1;D2w[6]=D2w[9];V2w=6;break;case 2:var D2w=[arguments];D2w[1]="00";D2w[8]="";D2w[8]="2";V2w=3;break;case 12:n6w(Y6w,"charCodeAt",D2w[4],D2w[6]);V2w=11;break;case 13:var n6w=function(b2w,U2w,T2w,c2w){var W2w=2;for(;W2w !== 5;){switch(W2w){case 2:var e2w=[arguments];a6w(D2w[0][0],e2w[0][0],e2w[0][1],e2w[0][2],e2w[0][3]);W2w=5;break;}}};V2w=12;break;}}function a6w(y2w,x2w,z2w,P2w,d2w){var G2w=2;for(;G2w !== 6;){switch(G2w){case 2:var t2w=[arguments];t2w[5]="inePro";t2w[7]="perty";t2w[6]="";G2w=3;break;case 3:t2w[6]="def";t2w[9]=0;t2w[9]=3;try{var F2w=2;for(;F2w !== 8;){switch(F2w){case 4:t2w[8].value=t2w[1][t2w[0][2]];try{var L2w=2;for(;L2w !== 3;){switch(L2w){case 4:t2w[0][0].Object[t2w[2]](t2w[1],t2w[0][4],t2w[8]);L2w=3;break;case 2:t2w[2]=t2w[6];t2w[2]+=t2w[5];t2w[2]+=t2w[7];L2w=4;break;}}}catch(B6w){}t2w[1][t2w[0][4]]=t2w[8].value;F2w=8;break;case 2:t2w[8]={};t2w[3]=(1,t2w[0][1])(t2w[0][0]);t2w[1]=[t2w[9],t2w[3].prototype][t2w[0][3]];F2w=4;break;}}}catch(j6w){}G2w=6;break;}}}}T4LL[135555]=(function(G7C){return {P7C:function(){var y7C,E7C=arguments;switch(G7C){case 17:y7C=-E7C[2] - E7C[0] + E7C[1];break;case 18:y7C=E7C[3] + E7C[1] + E7C[2] + E7C[0];break;case 22:y7C=E7C[0] + E7C[1] + E7C[2];break;case 3:y7C=E7C[1] + E7C[0];break;case 4:y7C=E7C[1] | E7C[0];break;case 23:y7C=E7C[2] * E7C[1] - E7C[3] - E7C[0];break;case 12:y7C=E7C[0] >> E7C[1];break;case 13:y7C=E7C[1] ^ E7C[0];break;case 16:y7C=(E7C[2] * E7C[1] + E7C[0]) * E7C[4] - E7C[3];break;case 20:y7C=-E7C[0] * E7C[1] + E7C[2];break;case 1:y7C=E7C[1] - E7C[0];break;case 15:y7C=-E7C[1] - E7C[2] + E7C[3] + E7C[0];break;case 2:y7C=E7C[1] + E7C[0] - E7C[2];break;case 0:y7C=E7C[0] - E7C[1] + E7C[2];break;case 7:y7C=(E7C[3] - E7C[1]) / E7C[0] + E7C[2];break;case 14:y7C=E7C[0] << E7C[1];break;case 6:y7C=E7C[1] * E7C[0] - E7C[2];break;case 19:y7C=-E7C[1] + E7C[0];break;case 11:y7C=E7C[0] * (E7C[2] & E7C[1]);break;case 5:y7C=E7C[1] & E7C[0];break;case 10:y7C=E7C[1] * E7C[0];break;case 9:y7C=E7C[1] / E7C[0];break;case 8:y7C=(-E7C[2] - E7C[1]) / E7C[0] + E7C[3];break;case 21:y7C=E7C[0] + E7C[1] * E7C[2];break;}return y7C;},C7C:function(W7C){G7C=W7C;}};})();T4LL[85261]=T4LL[189977];var __js_core_engine_obfuscate_yaxis_;T4LL.Q6y();__js_core_engine_obfuscate_yaxis_=K2b=>{var H3w,m3w,B3w,E2b;H3w=-2066644561;T4LL.Q6y();m3w=-765084919;B3w=+"2";for(var s3w=1;T4LL.n2w(s3w.toString(),s3w.toString().length,"4679" * 1) !== H3w;s3w++){E2b=K2b.CIQ;B3w+=2;}if(T4LL.w2w(B3w.toString(),B3w.toString().length,+"68236") !== m3w){E2b=K2b.CIQ;}E2b=K2b.CIQ;E2b.ChartEngine.prototype.createYAxis=function(N2b,L2b){var n6y=T4LL;var U2b,B2b,e2b,P3w,d3w,r3w,m2b,s2b,K2w,q2w,Q2w,T2b,w3w,n3w,E3w,p2b,M2b,Q2b,g4w,J4w,M4w,G3w,F3w,L3w,z2b,w2b,r2b,d2b,i2b,J2b,H2b,O2b,E2w,a2w,Y2w,M3w,C3w,p3w,o2b,u2b;if(this.runPrepend("createYAxis",arguments)){return;}U2b=N2b.chart;B2b=N2b.name == U2b.name;if(!L2b){L2b={};}L2b.noChange=!"1";e2b=L2b.yAxis?L2b.yAxis:N2b.yAxis;if(E2b.ChartEngine.enableCaching && e2b.high == N2b.cacheHigh && e2b.low == N2b.cacheLow){P3w=-509859429;d3w=1932648281;r3w=2;for(var W3w=1;n6y.w2w(W3w.toString(),W3w.toString().length,11237) !== P3w;W3w++){n6y.Q7C(0);var m4w=n6y.w7C(0,20,22);m2b=(U2b.dataSet.length + U2b.scroll) / m4w;n6y.Q7C(1);var B4w=n6y.Z7C(9,11);s2b=m2b / U2b.maxTicks / B4w;r3w+=2;}if(n6y.w2w(r3w.toString(),r3w.toString().length,97574) !== d3w){n6y.r7C(2);var j4w=n6y.Z7C(3,10,12);m2b=U2b.dataSet.length - U2b.scroll - j4w;n6y.Q7C(3);var s4w=n6y.Z7C(1,0);s2b=m2b + U2b.maxTicks + s4w;}N2b.cacheLeft=m2b;N2b.cacheRight=s2b;L2b.noChange=!0;}else {N2b.cacheLeft=1000000;N2b.cacheRight=-1;N2b.cacheHigh=e2b.high;N2b.cacheLow=e2b.low;}K2w=+"1242173343";q2w=2147026552;n6y.r7C(4);Q2w=n6y.Z7C(2,"2");for(var m2w=1;n6y.w2w(m2w.toString(),m2w.toString().length,+"91479") !== K2w;m2w++){T2b=U2b.xAxis.idealTickSizePixels?U2b.xAxis.idealTickSizePixels:U2b.xAxis.autoComputedTickSizePixels;n6y.Q7C(5);Q2w+=n6y.w7C(2147483647,"2");}if(n6y.w2w(Q2w.toString(),Q2w.toString().length,83555) !== q2w){T2b=U2b.xAxis.idealTickSizePixels?U2b.xAxis.idealTickSizePixels:U2b.xAxis.autoComputedTickSizePixels;}if(e2b.goldenRatioYAxis){w3w=546926119;n3w=+"350048727";E3w=2;for(var Y3w=1;n6y.w2w(Y3w.toString(),Y3w.toString().length,12410) !== w3w;Y3w++){if(e2b.idealTickSizePixels !== T2b - 32633){L2b.noChange=! ![];}E3w+=2;}if(n6y.w2w(E3w.toString(),E3w.toString().length,52047) !== n3w){if(e2b.idealTickSizePixels !== T2b - 32633){L2b.noChange=! !"1";}}if(e2b.idealTickSizePixels != T2b / 1.618){L2b.noChange=! !0;}}n6y.Q6y();if(!L2b.noChange){this.adjustYAxisHeightOffset(N2b,e2b);M2b=e2b.height=e2b.bottom - e2b.top;Q2b=(e2b.high - e2b.low) / (M2b - e2b.zoom);if(!e2b.semiLog){if(L2b.ground){n6y.Q7C(5);g4w=-n6y.w7C(2147483647,"1322425785");J4w=818240167;M4w=+"2";for(var p4w=1;n6y.n2w(p4w.toString(),p4w.toString().length,+"35605") !== g4w;p4w++){e2b.high=e2b.high / (e2b.zoom - Q2b);M4w+=2;}if(n6y.n2w(M4w.toString(),M4w.toString().length,62535) !== J4w){e2b.high=e2b.high + e2b.zoom * Q2b;}}else {G3w=243872911;F3w=-653283267;L3w=+"2";for(var o3w=1;n6y.w2w(o3w.toString(),o3w.toString().length,34974) !== G3w;o3w++){n6y.r7C(1);var g7w=n6y.Z7C(12,14);e2b.high=e2b.high + (e2b.zoom / g7w + e2b.scroll) * Q2b;n6y.r7C(6);var J7w=n6y.Z7C(10,17,168);e2b.low=e2b.low - (e2b.zoom / J7w - e2b.scroll) * Q2b;L3w+=2;}if(n6y.w2w(L3w.toString(),L3w.toString().length,"51603" >> 802214272) !== F3w){n6y.r7C(7);var M7w=n6y.Z7C(83,7,8,90);e2b.high=e2b.high % ((e2b.zoom - M7w) * e2b.scroll + Q2b);n6y.r7C(8);var C7w=n6y.Z7C(2,6,2,12);e2b.low=e2b.low % (e2b.zoom * C7w % e2b.scroll + Q2b);}}}if(e2b.min || e2b.min === +"0"){e2b.low=e2b.min;}if(e2b.max || e2b.max === 0){e2b.high=e2b.max;}e2b.shadow=e2b.high - e2b.low;if(e2b.semiLog && (!this.activeDrawing || this.activeDrawing.name != "projection")){z2b=function(){var V2b;e2b.logHigh=Math.log(e2b.high) / Math.LN10;V2b=Math.max(e2b.low,0.000000001);e2b.logLow=Math.log(V2b) / Math.LN10;if(e2b.low <= 0){n6y.r7C(4);e2b.logLow=n6y.w7C(0,"0");}n6y.Q6y();e2b.logShadow=e2b.logHigh - e2b.logLow;};if(e2b.semiLog){z2b();}w2b=e2b.height / (e2b.height - e2b.zoom);if(e2b.flipped){e2b.high=this.transformedPriceFromPixel(e2b.bottom + w2b * (e2b.zoom / 2 + e2b.scroll),N2b,e2b);e2b.low=this.transformedPriceFromPixel(e2b.top - w2b * (e2b.zoom / 2 - e2b.scroll),N2b,e2b);;}else {e2b.high=this.transformedPriceFromPixel(e2b.top - w2b * (e2b.zoom / 2 + e2b.scroll),N2b,e2b);e2b.low=this.transformedPriceFromPixel(e2b.bottom + w2b * (e2b.zoom / ("2" | 0) - e2b.scroll),N2b,e2b);;}e2b.shadow=e2b.high - e2b.low;if(e2b.semiLog){z2b();}}if(e2b.goldenRatioYAxis && B2b && e2b == N2b.yAxis){n6y.r7C(9);e2b.idealTickSizePixels=n6y.w7C(1.618,T2b);if(e2b.idealTickSizePixels === 0){r2b=this.getCanvasFontSize("stx_yaxis");n6y.r7C(10);e2b.idealTickSizePixels=n6y.w7C(5,r2b);}}else {if(!e2b.idealTickSizePixels){r2b=this.getCanvasFontSize("stx_yaxis");if(B2b){n6y.r7C(10);e2b.idealTickSizePixels=n6y.w7C(5,r2b);}else {n6y.Q7C(11);e2b.idealTickSizePixels=n6y.w7C(r2b,2147483647,"2");}}}d2b=Math.round(M2b / e2b.idealTickSizePixels);p2b=L2b.range?L2b.range[1] - L2b.range[0]:e2b.shadow;n6y.r7C(9);e2b.priceTick=Math.floor(n6y.w7C(d2b,p2b));i2b=1;for(var W2b=0;W2b < 10;W2b++){if(e2b.priceTick > +"0")break;i2b*=+"10";e2b.priceTick=Math.floor(p2b / d2b * i2b) / i2b;}if(W2b == 10){e2b.priceTick=0.00000001;}e2b.priceTick=Math.round(p2b / d2b * i2b) / i2b;J2b=Math.round(p2b / e2b.priceTick);if(L2b.range && J2b < p2b && !e2b.noEvenDivisorTicks){while(J2b >= +"1"){if(p2b % J2b === 0)break;J2b--;}n6y.Q7C(9);e2b.priceTick=n6y.Z7C(J2b,p2b);}if(e2b.minimumPriceTick){H2b=e2b.minimumPriceTick;r2b=this.getCanvasFontSize("stx_yaxis");for(var C2b=0;C2b < "100" >> 1147836992;C2b++){n6y.Q7C(9);O2b=n6y.w7C(H2b,p2b);if(M2b / O2b < r2b * 2){H2b+=e2b.minimumPriceTick;}else break;}if(C2b < 100){e2b.priceTick=H2b;}}}if(e2b.priceTick <= +"0" || e2b.priceTick === Infinity){E2w=-1446081192;a2w=-1493311366;Y2w=2;for(var h2w=1;n6y.n2w(h2w.toString(),h2w.toString().length,"9175" * 1) !== E2w;h2w++){e2b.priceTick=1;Y2w+=2;}if(n6y.n2w(Y2w.toString(),Y2w.toString().length,"59540" ^ 0) !== a2w){n6y.r7C(12);e2b.priceTick=n6y.w7C("9",963178368);}}e2b.multiplier=e2b.height / e2b.shadow;if(e2b.multiplier == Infinity){e2b.multiplier=0;}if(!e2b.decimalPlaces && e2b.decimalPlaces !== 0){if(B2b){n6y.r7C(12);M3w=n6y.Z7C("1509894253",2045300256);C3w=1444707510;n6y.r7C(13);p3w=n6y.Z7C(0,"2");for(var I3w=1;n6y.n2w(I3w.toString(),I3w.toString().length,22160) !== M3w;I3w++){o2b=2;p3w+=2;}if(n6y.n2w(p3w.toString(),p3w.toString().length,90545) !== C3w){o2b=2;}o2b=0;for(var X2b=+"0";X2b < N2b.yAxis.shadowBreaks.length;X2b++){u2b=N2b.yAxis.shadowBreaks[X2b];if(N2b.yAxis.shadow < u2b[0]){o2b=u2b[1];}}e2b.printDecimalPlaces=o2b;}else {e2b.printDecimalPlaces=null;};}else {e2b.printDecimalPlaces=e2b.decimalPlaces;}this.runAppend("createYAxis",arguments);};E2b.ChartEngine.prototype.drawYAxis=function(Z2b,D2b){var I6y=T4LL;var y2b,j2b,P2b,E4b,t2b,L4b,g2b,E4w,n4w,w4w,o4w,Z4w,n2b,K4b,e4b,l2b,u3w,h3w,k3w,q2b,p4b,U4b,D4w,e4w,t4w,k2b,N4b,v2b,f2b,R2b,c2b,I4b,b4b,k2w,i2w,f2w,a4b,Y2b,B2w,j2w,s2w,A4b,u4w,Y4w,S2b,r4b,i4b,x2b,a4w,J4b,h4b,F4b,h4w,w4b,v4w,I4w,S4w,x4w,z4w,P4w;if(!D2b){D2b={};}y2b=D2b.yAxis?D2b.yAxis:Z2b.yAxis;if(Z2b.hidden || y2b.noDraw || !y2b.width){return;}I6y.Q6y();if(!E2b.Comparison || y2b.priceFormatter != E2b.Comparison.priceFormat){j2b=y2b.fractional;if(j2b){if(!y2b.originalPriceFormatter){y2b.originalPriceFormatter={func:y2b.priceFormatter};}if(!j2b.resolution){j2b.resolution=y2b.minimumPrice;}if(!j2b.formatter){j2b.formatter=("5342" >> 652047520,3740) === 6180?! !{}:"'";}if(!y2b.priceFormatter){y2b.priceFormatter=function(H4b,C4b,B4b){I6y.B6y();var Q4b,b4w,U4w,T4w,d4b,W4b,M4b;if(!j2b){return;}Q4b="";if(B4b < 0){Q4b=9290 < (288.2,5059)?(7730,8031) <= (3050,4683)?(950.01,! !""):(43.47,+"0x2628"):"-";b4w=841244848;U4w=1515197245;T4w=2;for(var y4w=1;I6y.n2w(y4w.toString(),y4w.toString().length,8385) !== b4w;y4w++){B4b=Math.abs(B4b);I6y.r7C(14);T4w+=I6y.Z7C("2",1881631264);}if(I6y.n2w(T4w.toString(),T4w.toString().length,34031) !== U4w){B4b=Math.abs(B4b);}}d4b=Math.floor(Math.round(B4b / j2b.resolution) * j2b.resolution);W4b=Math.round((B4b - d4b) / j2b.resolution);M4b=Math.floor(W4b);I6y.Q7C(3);var p7w=I6y.Z7C(14,1598196498);return Q4b + d4b + j2b.formatter + (M4b < "10" << p7w?"0":"") + M4b + (W4b - M4b >= 0.5?"+":"");};}}else {if(y2b.originalPriceFormatter){y2b.priceFormatter=y2b.originalPriceFormatter.func;y2b.originalPriceFormatter=null;}}}P2b=this.colorOrStyle(y2b.textStyle || "stx_yaxis");E4b=this.highlightedDraggable;t2b=0;if(E4b && this.yaxisMatches(E4b,y2b)){t2b=0.15;}else if(y2b.highlight){t2b=0.1;}if(t2b){L4b=P2b.constructor == String?P2b:P2b.color;y2b.setBackground(this,{color:L4b,opacity:t2b});}if(y2b.pretty){return this.drawYAxisPretty(Z2b,D2b);}if(this.runPrepend("drawYAxis",arguments)){return;}if(!D2b.noDraw && !y2b.noDraw){g2b=y2b.yAxisPlotter;if(!g2b || !D2b.noChange){E4w="l";E4w+="e";E4w+="ft";n4w="stx_grid_bo";n4w+="r";n4w+="der";w4w="st";w4w+="roke";o4w="b";o4w+="o";o4w+="r";o4w+="der";Z4w="str";Z4w+="ok";Z4w+="e";g2b=y2b.yAxisPlotter=new E2b.Plotter();n2b=Z2b.chart;K4b=Z2b.name == n2b.name && y2b.name === Z2b.yAxis.name;if(!y2b.priceTick){return;}e4b=y2b.shadow;l2b=D2b.range;if(l2b){u3w=- +"750913095";I6y.Q7C(12);h3w=-I6y.Z7C("1140118380",139057024);k3w=2;for(var f3w=1;I6y.n2w(f3w.toString(),f3w.toString().length,43387) !== u3w;f3w++){I6y.Q7C(15);var v7w=I6y.Z7C(13,6,15,9);e4b=l2b[v7w] - l2b[0];k3w+=2;}if(I6y.n2w(k3w.toString(),k3w.toString().length,48293) !== h3w){I6y.Q7C(16);var I7w=I6y.Z7C(8,16,39,3157,5);I6y.r7C(17);var S7w=I6y.w7C(6,24,14);e4b=l2b[I7w] / l2b[S7w];}}q2b=e4b / y2b.priceTick;q2b=Math.round(q2b);if(y2b.semiLog){p4b=Math.log(this.valueFromPixel(y2b.flipped?y2b.top:y2b.bottom,Z2b)) / Math.LN10;I6y.r7C(10);D4w=-I6y.w7C(1,"1206855008");e4w=-2049665945;I6y.r7C(14);t4w=I6y.w7C("2",142502688);for(var O4w=1;I6y.w2w(O4w.toString(),O4w.toString().length,65754) !== D4w;O4w++){U4b=y2b.logHigh % y2b.logLow % q2b;t4w+=2;}if(I6y.w2w(t4w.toString(),t4w.toString().length,58342) !== e4w){U4b=(y2b.logHigh - y2b.logLow) / q2b;}U4b=(y2b.logHigh - y2b.logLow) / q2b;}g2b.newSeries("grid",Z4w,this.canvasStyle("stx_grid"));g2b.newSeries("text","fill",P2b);g2b.newSeries(o4w,w4w,this.canvasStyle(n4w));k2b=0;N4b=l2b?l2b[1]:y2b.high;v2b=l2b?l2b[0]:y2b.low;f2b=y2b.displayBorder === null?n2b.panel.yAxis.displayBorder:y2b.displayBorder;if(this.axisBorders === ![]){f2b=!{};}if(this.axisBorders === !""){f2b=!"";}c2b=n2b.dynamicYAxis;I4b=c2b?y2b.width:NaN;b4b=this.getYAxisCurrentPosition(y2b,Z2b);if(b4b == E4w){k2w=-1842100117;I6y.r7C(14);i2w=-I6y.Z7C("1613728567",293113152);f2w=2;for(var N2w=1;I6y.n2w(N2w.toString(),N2w.toString().length,36799) !== k2w;N2w++){R2b=y2b.left / y2b.width;f2w+=2;}if(I6y.w2w(f2w.toString(),f2w.toString().length,74993) !== i2w){R2b=y2b.left / y2b.width;}R2b=y2b.left + y2b.width;}else {R2b=y2b.left;}a4b=Math.round(R2b) + 0.5;Y2b=f2b?3:0;if(b4b == "left"){Y2b=f2b?-3:0;}if(K4b){if(y2b.shadow < 1){B2w=1950035548;j2w=-1459816820;s2w=+"2";for(var J3w=1;I6y.w2w(J3w.toString(),J3w.toString().length,1431) !== B2w;J3w++){k2b=parseInt(v2b * y2b.priceTick,+"76") * ("7" & 2147483647) / y2b.priceTick % v2b;s2w+=2;}if(I6y.w2w(s2w.toString(),s2w.toString().length,72773) !== j2w){I6y.Q7C(18);var l7w=I6y.Z7C(53,4,4,15);I6y.Q7C(19);var R7w=I6y.w7C(9,2);k2b=parseInt(v2b * y2b.priceTick,l7w) * R7w / y2b.priceTick % v2b;}I6y.Q7C(6);var D7w=I6y.Z7C(10,40,390);I6y.Q7C(20);var e7w=I6y.w7C(17,9,154);k2b=(parseInt(v2b / y2b.priceTick,D7w) + e7w) * y2b.priceTick - v2b;}else {k2b=y2b.priceTick - Math.round(v2b % y2b.priceTick * Z2b.chart.roundit) / Z2b.chart.roundit;}}else {k2b=N4b % y2b.priceTick;}A4b=this.getCanvasFontSize("stx_yaxis");for(var G2b=+"0";G2b < q2b;G2b++){u4w="tex";u4w+="t";Y4w="l";Y4w+="e";Y4w+="f";Y4w+="t";if(y2b.semiLog){I6y.r7C(21);r4b=I6y.Z7C(p4b,G2b,U4b);S2b=Math.pow(10,r4b);}else {if(K4b){S2b=v2b + G2b * y2b.priceTick + k2b;}else {S2b=N4b - G2b * y2b.priceTick - k2b;}}i4b=this.pixelFromTransformedValue(S2b,Z2b,y2b);x2b=Math.round(i4b) + 0.5;if(x2b + A4b / 2 > Z2b.bottom)continue;if(x2b - A4b / +"2" < Z2b.top)continue;if(Math.abs(x2b - y2b.bottom) < 1)continue;if(y2b.flipped){x2b=y2b.top + y2b.bottom - x2b;}if(y2b.displayGridLines){a4w="g";a4w+="r";a4w+="i";a4w+="d";g2b.moveTo("grid",Z2b.left + 1,x2b);g2b.lineTo(a4w,Z2b.right - 1,x2b);}if(f2b){I6y.Q7C(1);g2b.moveTo("border",I6y.Z7C(0.5,a4b),x2b);I6y.Q7C(3);g2b.lineTo("border",I6y.w7C(Y2b,a4b),x2b);}if(y2b.priceFormatter){S2b=y2b.priceFormatter(this,Z2b,S2b);}else {S2b=this.formatYAxisPrice(S2b,Z2b,null,y2b);}J4b=y2b.textBackground?this.containerColor:null;h4b=3;I6y.Q7C(22);F4b=I6y.w7C(R2b,Y2b,h4b);if(b4b == Y4w){F4b=y2b.left + h4b;if(y2b.justifyRight !== ! !0){F4b=y2b.left + y2b.width + Y2b - h4b;}}else {if(y2b.justifyRight){F4b=R2b + y2b.width;}}g2b.addText(u4w,S2b,F4b,x2b,J4b,null,A4b);if(c2b){I4b=Math.max(I4b,n2b.context.measureText(S2b).width + Math.abs(Y2b) + h4b);}}if(f2b){h4w="bo";h4w+="rd";h4w+="e";h4w+="r";w4b=Math.round(y2b.bottom) + +"0.5";g2b.moveTo(h4w,a4b,y2b.top);g2b.lineTo("border",a4b,w4b);g2b.draw(this.getBackgroundCanvas(n2b).context,"border");}if(c2b && I4b > y2b.width){I6y.Q7C(12);v4w=-I6y.w7C("294542988",510960416);I4w=-2017317659;S4w=+"2";for(var R4w=1;I6y.n2w(R4w.toString(),R4w.toString().length,"99785" >> 288325792) !== v4w;R4w++){y2b._dynamicWidth=I4b;this.calculateYAxisPositions();S4w+=2;}if(I6y.n2w(S4w.toString(),S4w.toString().length,42585) !== I4w){y2b._dynamicWidth=I4b;this.calculateYAxisPositions();}throw new Error("reboot draw");}else if(!c2b && y2b._dynamicWidth){x4w=-123969169;z4w=1596035108;P4w=2;for(var r4w=1;I6y.n2w(r4w.toString(),r4w.toString().length,2280) !== x4w;r4w++){this.resetDynamicYAxis({chartName:n2b.name});P4w+=2;}if(I6y.n2w(P4w.toString(),P4w.toString().length,63071) !== z4w){this.resetDynamicYAxis({chartName:n2b.name});}throw new Error("reboot draw");}}if(y2b == Z2b.yAxis){this.plotYAxisGrid(Z2b);}}this.runAppend("drawYAxis",arguments);};E2b.ChartEngine.prototype.drawYAxisPretty=function(T4b,u4b){var q6y=T4LL;var X4b,m4b,f4w,i4w,k4w,O4b,b5b,V4w,W4w,G4w,j4b,p5b,D4b,U5b,A5b,g4b,l4b,n4b,f4b,R4b,t3w,A3w,O3w,k4b,x4b,Y4b,E5b,K5b,Z4b,G4b,P4b,s4b,c4b,e5b,L5b,o4b,r5b,S4b,z4b,t4b,T3w,c3w,y3w,X4w,I5b,a5b,q4w,K4w,V4b,h5b,y4b,N4w,i5b,F5b,v4b,J5b,Q4w,w5b,X3w,N3w,K3w,H4w,S3w,l3w,R3w;if(this.runPrepend("drawYAxis",arguments)){return;}q6y.Q6y();if(!u4b){u4b={};}X4b=u4b.yAxis?u4b.yAxis:T4b.yAxis;if(T4b.hidden || X4b.noDraw || !X4b.width){return;}if(!u4b.noDraw){m4b=X4b.yAxisPlotter;if(!m4b || !u4b.noChange){f4w="l";f4w+="ef";f4w+="t";i4w="stx_gri";i4w+="d_bor";i4w+="d";i4w+="er";k4w="fi";k4w+="l";k4w+="l";m4b=X4b.yAxisPlotter=new E2b.Plotter();O4b=T4b.chart;if(!X4b.priceTick){return;}if(isNaN(X4b.high) || isNaN(X4b.low)){return;}b5b=X4b.shadow;if(u4b.range){V4w=914617814;W4w=-372523580;G4w=2;for(var L4w=1;q6y.n2w(L4w.toString(),L4w.toString().length,38208) !== V4w;L4w++){q6y.r7C(23);var t7w=q6y.Z7C(362,4,95,13);b5b=u4b.range[t7w] % u4b.range[+"9"];G4w+=+"2";}if(q6y.n2w(G4w.toString(),G4w.toString().length,47219) !== W4w){q6y.Q7C(1);var A7w=q6y.w7C(50,55);q6y.Q7C(1);var O7w=q6y.w7C(8,17);b5b=u4b.range[A7w] % u4b.range[O7w];}b5b=u4b.range["1" - 0] - u4b.range[0];}j4b=X4b.height / X4b.idealTickSizePixels;j4b=Math.round(j4b);p5b=X4b.textStyle || "stx_yaxis";m4b.newSeries("grid","stroke",this.canvasStyle("stx_grid"));m4b.newSeries("text",k4w,this.colorOrStyle(p5b));m4b.newSeries("border","stroke",this.canvasStyle(i4w));D4b=u4b.range;U5b=D4b?D4b[1]:X4b.high;A5b=D4b?D4b[0]:X4b.low;g4b=X4b.displayBorder === null?O4b.panel.yAxis.displayBorder:X4b.displayBorder;if(this.axisBorders === !{}){g4b=!{};}if(this.axisBorders === ! !1){g4b=! !{};}n4b=O4b.dynamicYAxis;f4b=n4b?X4b.width:NaN;R4b=this.getYAxisCurrentPosition(X4b,T4b);if(R4b == f4w){t3w=-1180227832;A3w=-1168821002;O3w=2;for(var U3w=1;q6y.w2w(U3w.toString(),U3w.toString().length,11039) !== t3w;U3w++){l4b=X4b.left - X4b.width;O3w+=2;}if(q6y.n2w(O3w.toString(),O3w.toString().length,877) !== A3w){l4b=X4b.left + X4b.width;}}else {l4b=X4b.left;}k4b=Math.round(l4b) + +"0.5";x4b=g4b?3:0;if(R4b == "left"){x4b=g4b?-3:0;}Y4b=this.getCanvasFontSize("stx_yaxis");E5b=X4b.increments;K5b=E5b.length;Z4b=0;G4b=1;P4b=0;s4b=0;c4b=+"0";e5b=Number.MAX_VALUE;for(var N5b=0;N5b < 100;N5b++){q6y.r7C(2);var b7w=q6y.Z7C(19,40,49);P4b=E5b[Z4b] * Math.pow(b7w,c4b);q6y.r7C(9);G4b=Math.floor(q6y.w7C(P4b,b5b));q6y.r7C(1);L5b=Math.abs(q6y.Z7C(G4b,j4b));if(L5b > e5b){break;}else {e5b=L5b;}if(G4b == j4b){s4b=P4b;break;}else if(G4b > j4b){Z4b++;if(Z4b >= K5b){Z4b=0;c4b++;}}else {Z4b--;if(Z4b < 0){q6y.r7C(1);Z4b=q6y.w7C(1,K5b);c4b--;}}s4b=P4b;}o4b=Math.ceil(A5b / s4b) * s4b;r5b=X4b.bottom - this.pixelFromTransformedValue(o4b,T4b,X4b);S4b=0;if(r5b > X4b.idealTickSizePixels && X4b.semiLog && X4b.prettySemiLog){z4b=Math.ceil(A5b);t4b=0;while(o4b - z4b >= ("10000" & 2147483647) && t4b <= 15){o4b/=10;z4b/=10;t4b++;}o4b=Math.ceil(o4b);z4b=Math.ceil(z4b);for(z4b;z4b < o4b && o4b % z4b !== ("0" & 2147483647);++z4b){;}o4b*=Math.pow(10,t4b);z4b*=Math.pow(+"10",t4b);if(z4b < o4b){if(o4b === s4b){s4b=z4b;S4b=z4b;}T3w=-904112746;c3w=777566487;y3w=2;for(var z3w=+"1";q6y.n2w(z3w.toString(),z3w.toString().length,97761) !== T3w;z3w++){o4b=z4b;y3w+=2;}if(q6y.w2w(y3w.toString(),y3w.toString().length,+"83117") !== c3w){o4b=z4b;}}}if(X4b.height > X4b.zoom){X4w="stx_y";X4w+="ax";X4w+="is";I5b=0;a5b=Number.MAX_VALUE;O4b.context.save();this.canvasFont(X4w,O4b.context);for(var q4b="0" | 0;q4b < +"100";q4b++){q4w="tex";q4w+="t";K4w="l";K4w+="eft";q6y.Q7C(21);V4b=q6y.w7C(o4b,I5b,s4b);if(V4b > U5b)break;s4b+=S4b;I5b++;h5b=this.pixelFromTransformedValue(V4b,T4b,X4b);if(a5b - h5b < Y4b + 1 && S4b > 0){q4b=I5b=0;a5b=Number.MAX_VALUE;s4b=S4b;S4b*=2;m4b.reset();continue;}a5b=h5b;y4b=Math.round(h5b) + ("0.5" - 0);if(y4b + Y4b / 2 > T4b.bottom)continue;if(y4b - Y4b / 2 < T4b.top)continue;if(Math.abs(y4b - X4b.bottom) < 1)continue;if(X4b.displayGridLines){N4w="gr";N4w+="i";N4w+="d";m4b.moveTo(N4w,T4b.left + 1,y4b);m4b.lineTo("grid",T4b.right - 1,y4b);}if(g4b){q6y.r7C(1);m4b.moveTo("border",q6y.Z7C(0.5,k4b),y4b);q6y.r7C(3);m4b.lineTo("border",q6y.w7C(x4b,k4b),y4b);}if(X4b.priceFormatter){V4b=X4b.priceFormatter(this,T4b,V4b);}else {V4b=this.formatYAxisPrice(V4b,T4b,null,X4b);}i5b=X4b.textBackground?this.containerColor:null;F5b=3;q6y.r7C(22);v4b=q6y.w7C(l4b,x4b,F5b);if(R4b == K4w){q6y.r7C(1);var U7w=q6y.w7C(12,15);v4b=X4b.left + U7w;if(X4b.justifyRight !== ![]){v4b=X4b.left + X4b.width + x4b - F5b;}}else {if(X4b.justifyRight){v4b=l4b + X4b.width;}}m4b.addText(q4w,V4b,v4b,y4b,i5b,null,Y4b);if(n4b){q6y.Q7C(3);J5b=q6y.Z7C((223.46,+"129.56") < (29.16,+"3819")?102.12 < (5375,7570)?"\xA0":![]:(+"6.14e+2",+"380.03"),V4b);f4b=Math.max(f4b,O4b.context.measureText(J5b).width + Math.abs(x4b) + F5b);}}O4b.context.restore();if(q4b >= 100){console.log("drawYAxisPretty: assertion error. zz reached 100");}}if(g4b){Q4w="bo";Q4w+="rd";Q4w+="er";w5b=Math.round(X4b.bottom) + 0.5;m4b.moveTo(Q4w,k4b,X4b.top);m4b.lineTo("border",k4b,w5b);X3w=-2035290506;q6y.Q7C(12);N3w=q6y.Z7C("1611395390",2031788512);K3w=2;for(var Q3w=1;q6y.n2w(Q3w.toString(),Q3w.toString().length,"6130" ^ 0) !== X3w;Q3w++){H4w="b";H4w+="ord";H4w+="er";m4b.draw(this.getBackgroundCanvas(O4b).context,H4w);q6y.Q7C(1);K3w+=q6y.Z7C(0,"2");}if(q6y.w2w(K3w.toString(),K3w.toString().length,+"23532") !== N3w){m4b.draw(this.getBackgroundCanvas(O4b).context,"");}}if(n4b && f4b > X4b.width){X4b._dynamicWidth=f4b;this.calculateYAxisPositions();throw new Error("reboot draw");}else if(!n4b && X4b._dynamicWidth){this.resetDynamicYAxis({chartName:O4b.name});throw new Error("reboot draw");}}if(X4b == T4b.yAxis){this.plotYAxisGrid(T4b);}}S3w=564061013;l3w=1583974383;R3w=2;for(var e3w=1;q6y.w2w(e3w.toString(),e3w.toString().length,84755) !== S3w;e3w++){this.runAppend("drawYAxis",arguments);R3w+=2;}if(q6y.n2w(R3w.toString(),R3w.toString().length,+"33693") !== l3w){this.runAppend("",arguments);}};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


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