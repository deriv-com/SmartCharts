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


import {CIQ, SplinePlotter, timezoneJS, $$, $$$} from "../js/chartiq.js";

let __js_standard_createEngine_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

const CallbackNVStore = {
	get: (x, f) => f(null, CIQ.localStorage.getItem(x)),
	set: (x, y) => CIQ.localStorageSetItem(x, y),
	remove: (x) => CIQ.localStorage.removeItem(x)
};

/**
 * Creates the chart engine, attaches quote feeds, and initiates add-ons and the
 * callback functions in `container` with the configuration specified by `config`. If a
 * configuration is not provided, a default configuration is applied.
 *
 * @param {object} [params] Function parameters.
 * @param {HTMLElement} [params.container] The HTML element in which the chart engine is
 * 		created.
 * @param {object} [params.config] Contains configuration specifications.
 * @param {object} [params.config.chartEngineParams] Parameters required by the
 * 		{@link CIQ.ChartEngine} constructor except for a reference to the container HTML
 * 		element, which is provided by `container`.
 * @param {object} [params.config.quoteFeeds] Array of quote feed objects.
 * @param {object} [params.config.marketFactory] Market factory object. When not provided,
 * 		{@link CIQ.Market.Symbology.factory} is used if available.
 * @param {object} [params.config.addOns] Initialization properties for add-ons.
 * @param {object} [params.config.callbacks] Initialization functions for callback listeners.
 * @param {object} [params.config.initialData] Initial data to show on chart.
 * @param {boolean} [params.config.restore] True if storage is to be used.
 * @param {boolean} [params.deferLoad] If true, will not restore layout or load a chart.
 * @return {CIQ.ChartEngine} A reference to a new chart engine.
 *
 * @alias create
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#createChart`. Revised parameter list from
 * 		`(container, config = {})`.
 */
CIQ.ChartEngine.create = function ({ container, config, deferLoad } = {}) {
	if (!container)
		container = document.querySelector(".chartContainer") || document.body;
	if (!config) config = {};

	const chartParams = Object.assign({ container }, config.chartEngineParams);
	const stx = new this(chartParams);

	const { quoteFeeds, marketFactory, addOns, chartId } = config;

	if (quoteFeeds && stx.attachQuoteFeed) {
		quoteFeeds.forEach(({ quoteFeed, behavior, filter }) => {
			stx.attachQuoteFeed(quoteFeed, behavior, filter);
		});
	}

	if (marketFactory) stx.setMarketFactory(marketFactory);

	if (addOns) {
		Object.entries(addOns)
			.filter(([, params]) => !!params) // remove inactive addOns
			.forEach(([itemName, params]) => {
				if (!config.enabledAddOns[itemName]) return;
				const extensionName = params.moduleName || CIQ.capitalize(itemName);
				if (CIQ[extensionName])
					new CIQ[extensionName](Object.assign({ stx }, params));
				else if (CIQ.debug) {
					console.log(
						`${extensionName} not available for addons with params:`,
						params
					);
				}
			});
	}

	const callbacks = CIQ.ensureDefaults(config.callbacks || {}, {
		layout: this.getSaveLayout(config),
		symbolChange: this.getSaveLayout(config),
		drawing: this.getSaveDrawings(config),
		preferences: this.getSavePreferences(config),
		newChart: this.getRetoggleEvents(config)
	});

	for (var cb in callbacks) {
		if (callbacks[cb]) stx.addEventListener(cb, callbacks[cb]);
	}

	if (CIQ.NameValueStore) Object.assign(CallbackNVStore, CIQ.NameValueStore);

	if (!deferLoad) {
		if (config.restore) {
			this.restorePreferences(stx, chartId);
			this.restoreLayout(stx, null, chartId);
		} else {
			stx.loadChart(config.initialSymbol, { masterData: config.initialData });
			stx.draw();
		}
	}

	return stx;
};

/**
 * Captures configuration information in the returned callback function.
 *
 * @param {object} [config] Should contain the chart ID, which is used to help identify
 * 		the layout in local storage.
 * @return {function} A callback function that stores the chart layout. Uses the chart ID in
 * 		`config` (if provided) as part of the identifier of the saved layout in local
 * 		storage.
 *
 * @alias getSaveLayout
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#getSaveLayout`.
 */
CIQ.ChartEngine.getSaveLayout = function (config) {
	return function saveLayout({ stx }) {
		if (config.restore && stx.exportLayout) {
			var s = JSON.stringify(stx.exportLayout(true));
			CallbackNVStore.set("myChartLayout" + (config.chartId || ""), s);
		}
	};
};

/**
 * Restores the chart layout.
 *
 * @param {CIQ.ChartEngine} stx A reference to the chart engine.
 * @param {function} cb A callback function to be called when restoration of the layout is
 * 		complete.
 * @param {string} id The storage identifier for the stored chart layout.
 *
 * @alias restoreLayout
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#restoreLayout`.
 */
CIQ.ChartEngine.restoreLayout = function (stx, cb, id) {
	const { restoreDrawings } = this;
	if (!id) id = "";

	function closure() {
		restoreDrawings(stx, stx.chart.symbol, id);
		if (cb) cb();
	}

	CallbackNVStore.get("myChartLayout" + id, function (error, datum) {
		if (error) return;

		if (stx.importLayout)
			stx.importLayout(JSON.parse(datum), {
				managePeriodicity: true,
				cb: closure
			});

		if (stx.termStructure) {
			stx.setCandleWidth(1); // don't preserve zoom state for term structure plugin
		}
	});
};

/**
 * Captures configuration information to provide to the callback function that saves the state
 * of chart drawings.
 *
 * @param {*} config Contains the drawing state.
 * @return {function} A callback function invoked to save the state of the chart drawings.
 *
 * @alias getSaveDrawings
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#getSaveDrawings`.
 */
CIQ.ChartEngine.getSaveDrawings = function (config) {
	return function saveDrawings({ stx, symbol }) {
		if (config.restore && stx.exportDrawings) {
			var tmp = stx.exportDrawings();
			var key = config.chartId ? config.chartId + "~" + symbol : symbol;
			if (tmp.length === 0) {
				CallbackNVStore.remove(key);
			} else {
				CallbackNVStore.set(key, JSON.stringify(tmp));
			}
		}
	};
};

/**
 * Restores the state of saved chart drawings.
 *
 * @param {CIQ.ChartEngine} stx A reference to the chart engine.
 * @param {string} symbol The chart symbol. Used to identify the saved state in local
 * 		storage. Concatenated to `id` if `id` is provided.
 * @param {string} [id] A unique local storage identifier for the saved drawings.
 *
 * @alias restoreDrawings
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#restoreDrawings`.
 */
CIQ.ChartEngine.restoreDrawings = function (stx, symbol, id) {
	if (!CIQ.Drawing) return;
	const recId = id ? id + "~" + symbol : symbol;
	CallbackNVStore.get(recId, function (error, memory) {
		if (error) return;
		if (memory !== null) {
			var parsed = JSON.parse(memory);
			if (parsed) {
				stx.importDrawings(parsed);
				stx.draw();
			}
		}
	});
};

/**
 * Captures configuration information in the returned callback function.
 *
 * @param {object} [config] Should contain the chart ID, which is used to help identify
 * 		the preferences in local storage.
 * @return {function} A callback function that stores the chart preferences. Uses the chart ID
 * 		in `config` (if provided) as part of the identifier of the saved preferences in local
 * 		storage.
 *
 * @alias getSavePreferences
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#savePreferences`. Revised parameter list from `({ stx })`.
 * 		Now returns a function.
 */
CIQ.ChartEngine.getSavePreferences = function (config) {
	return function savePreferences({ stx }) {
		if (config.restore && stx.exportPreferences) {
			var s = JSON.stringify(stx.exportPreferences());
			CallbackNVStore.set("myChartPreferences" + (config.chartId || ""), s);
		}
	};
};

/**
 * Restores the chart preferences.
 *
 * @param {CIQ.ChartEngine} stx A reference to the chart engine.
 * @param {string} [id] A unique local storage identifier for the chart preferences.
 *
 * @alias restorePreferences
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#restorePreferences`.
 */
CIQ.ChartEngine.restorePreferences = function (stx, id) {
	if (!id) id = "";
	CallbackNVStore.get("myChartPreferences" + id, function (error, pref) {
		if (error) return;
		if (pref && stx.importPreferences) stx.importPreferences(JSON.parse(pref));
	});
};

/**
 * Captures configuration information in the returned callback function.
 *
 * @param {object} [config] Should contain the chart ID, which is used to help identify
 * 		the correct chart to target.
 * @return {function} A callback function that synchronizes marker state. Uses the chart ID
 * 		in `config` (if provided) as parent element of the markers menu to be targeted.
 *
 * @alias getRetoggleEvents
 * @memberof CIQ.ChartEngine
 * @static
 * @since
 * - 7.5.0
 * - 8.0.0 Renamed from `CIQ.UI.Chart#retoggleEvents`. Revised parameter list from `({ stx })`.
 * 		Now returns a function.
 */
CIQ.ChartEngine.getRetoggleEvents = function (config) {
	return function retoggleEvents({ stx }) {
		var topNode = document.getElementById(config.chartId);
		if (!topNode)
			topNode = (CIQ.getFn("UI.getMyContext")(stx.container) || {}).topNode;
		if (!topNode) topNode = document;
		const active = topNode.querySelectorAll(
			`${config.selector.markersMenuItem}:not(.span-event).ciq-active`
		);
		active.forEach(function (i) {
			i.dispatchEvent(new Event("stxtap"));
		});
	};
};

};

let __js_standard_drawing_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
var timezoneJS =
	typeof _timezoneJS !== "undefined" ? _timezoneJS : _exports.timezoneJS;

/**
 * READ ONLY. Map of registered drawing tools and their constructors.  Populated via lazy eval, so it only contains tools which were used so far.
 * @type Object
 * @default
 * @alias drawingTools
 * @static
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.drawingTools = {};

CIQ.ChartEngine.currentVectorParameters = {
	/**
	 *  Drawing to activate.
	 * <br>See 'Classes' in {@link CIQ.Drawing} for available drawings.
	 * Use {@link CIQ.ChartEngine#changeVectorType} to activate.
	 * @type string
	 * @alias currentVectorParameters[`vectorType`]
	 * @memberof! CIQ.ChartEngine#
	 */
	vectorType: null,
	/**
	 *  Line pattern.
	 * <br><B>Valid values for pattern: solid, dotted, dashed, none</B>
	 * <br>Not all parameters/values are valid on all drawings. See the specific `reconstruct` method for your desired drawing for more details(Example: {@link CIQ.Drawing.horizontal#reconstruct})
	 * @type string
	 * @default
	 * @alias currentVectorParameters[`pattern`]
	 * @memberof! CIQ.ChartEngine#
	 */
	pattern: "solid",
	/**
	 *  Line width
	 * <br>Not all parameters/values are valid on all drawings. See the specific `reconstruct` method for your desired drawing for more details(Example: {@link CIQ.Drawing.horizontal#reconstruct})
	 * @type number
	 * @default
	 * @alias currentVectorParameters[`lineWidth`]
	 * @memberof! CIQ.ChartEngine#
	 */
	lineWidth: 1,
	/**
	 *  Fill color.
	 * <br>Not all parameters/values are valid on all drawings. See the specific `reconstruct` method for your desired drawing for more details(Example: {@link CIQ.Drawing.horizontal#reconstruct})
	 * @type string
	 * @default
	 * @alias currentVectorParameters[`fillColor`]
	 * @memberof! CIQ.ChartEngine#
	 */
	fillColor: "#7DA6F5",
	/**
	 * Line color.
	 * <br>Not all parameters/values are valid on all drawings. See the specific `reconstruct` method for your desired drawing for more details(Example: {@link CIQ.Drawing.horizontal#reconstruct})
	 * @type string
	 * @default
	 * @alias currentVectorParameters[`currentColor`]
	 * @memberof! CIQ.ChartEngine#
	 */
	currentColor: "auto",
	/**
	 * Axis Label.
	 * Set to 'true' to display a label on the x axis.
	 * <br>Not all parameters/values are valid on all drawings. See the specific `reconstruct` method for your desired drawing for more details(Example: {@link CIQ.Drawing.horizontal#reconstruct})
	 * @type string
	 * @default
	 * @alias currentVectorParameters[`axisLabel`]
	 * @memberof! CIQ.ChartEngine#
	 */
	axisLabel: true,
	/**
	 * Fibonacci settings.
	 * See {@link CIQ.Drawing.fibonacci#reconstruct} `parameters` object for valid options
	 * @type object
	 * @alias currentVectorParameters[`fibonacci`]
	 * @memberof! CIQ.ChartEngine#
	 * @example
	 * fibonacci:{
	 *     trend:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
	 *     fibs:[
	 *         {level:-0.786, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
	 *         {level:-0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:-0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:0, color:"auto", parameters:{pattern:"solid", lineWidth:1}, display: true},
	 *         {level:0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:0.786, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
	 *         {level:0.5, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:1, color:"auto", parameters:{pattern:"solid", lineWidth:1}, display: true},
	 *         {level:1.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true},
	 *         {level:1.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}, display: true}
	 *     ],
	 *     extendLeft: false,
	 *     printLevels: true, // display the % levels to the right of the drawing
	 *     printValues: false, // display the values on the y axis
	 *     timezone:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}}
	 * }
	 * @since
	 * - 3.0.9 Added 0.786 and -0.786 levels.
	 * - 5.2.0 Added 1.272 level.
	 */
	fibonacci: {
		trend: {
			color: "auto",
			parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
		},
		fibs: [
			{
				level: -0.786,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: -0.618,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: -0.5,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: -0.382,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: -0.236,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: 0,
				color: "auto",
				parameters: { pattern: "solid", lineWidth: 1 },
				display: true
			},
			{
				level: 0.236,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: 0.382,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: 0.5,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: 0.618,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: 0.786,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: 1,
				color: "auto",
				parameters: { pattern: "solid", lineWidth: 1 },
				display: true
			},
			{
				level: 1.272,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: 1.382,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: 1.618,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 },
				display: true
			},
			{
				level: 2.618,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			},
			{
				level: 4.236,
				color: "auto",
				parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
			}
		],
		extendLeft: false,
		printLevels: true,
		printValues: false,
		timezone: {
			color: "auto",
			parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
		}
	},
	/**
		 * Annotation settings.
	     * @type object
	     * @alias currentVectorParameters[`annotation`]
	     * @memberof! CIQ.ChartEngine#
	     * @example
			annotation:{
				font:{
					style:null,
					size:null,	// override .stx_annotation default
					weight:null, // override .stx_annotation default
					family:null // override .stx_annotation default
				}
			}
	     */
	annotation: {
		font: {
			style: null,
			size: null, // override .stx_annotation default
			weight: null, // override .stx_annotation default
			family: null // override .stx_annotation default
		}
	}
};

/**
 * Registers a drawing tool. This is typically done using lazy eval.
 * @private
 * @param  {string} name Name of drawing tool
 * @param  {function} func Constructor for drawing tool
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.registerDrawingTool = function (name, func) {
	CIQ.ChartEngine.drawingTools[name] = func;
};

/**
 * Given an html element, this allows the chart container to keep track of its own drawing container
 * (where appropriate)
 * @param {object} htmlElement The html element where the chart container is for 'this' chart
 * @memberof CIQ.ChartEngine
 * @example
 *	var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), preferences:{labels:false, currentPriceLine:true, whitespace:0}});
 *	stxx.setDrawingContainer(document.querySelector('cq-toolbar'));
 * @since 6.0.0
 */
CIQ.ChartEngine.prototype.setDrawingContainer = function (htmlElement) {
	this.drawingContainer = htmlElement;
};

/**
 * Exports (serializes) all of the drawings on the chart(s) so that they can be saved to an external database and later imported with {@link CIQ.ChartEngine#importDrawings}.
 * @see {@link CIQ.ChartEngine#importDrawings}
 * @return {array} An array of serialized objects representing each drawing
 * @memberof CIQ.ChartEngine
 * @since 3.0.0 Replaces `serializeDrawings`.
 */
CIQ.ChartEngine.prototype.exportDrawings = function () {
	var arr = [];
	for (var i = 0; i < this.drawingObjects.length; i++) {
		arr.push(this.drawingObjects[i].serialize());
	}
	return arr;
};

/**
 * Causes all drawings to delete themselves. External access should be made through @see CIQ.ChartEngine.prototype.clearDrawings
 * @param {boolean} deletePermanent Set to false to not delete permanent drawings
 * @private
 * @memberof CIQ.ChartEngine
 * @since 6.0.0 Added `deletePermanent` parameter.
 */
CIQ.ChartEngine.prototype.abortDrawings = function (deletePermanent) {
	if (deletePermanent !== false) deletePermanent = true;
	for (var i = this.drawingObjects.length - 1; i >= 0; i--) {
		var drawing = this.drawingObjects[i];
		drawing.abort(true);
		if (deletePermanent || !drawing.permanent) this.drawingObjects.splice(i, 1);
	}
};

/**
 * Imports drawings from an array originally created by {@link CIQ.ChartEngine#exportDrawings}.
 * To immediately render the reconstructed drawings, you must call `draw()`.
 * See {@tutorial Using and Customizing Drawing Tools} for more details.
 *
 * **Important:**
 * Calling this function in a way that will cause it to run simultaneously with [importLayout]{@link CIQ.ChartEngine#importLayout}
 * will damage the results on the layout load. To prevent this, use the {@link CIQ.ChartEngine#importLayout} or {@link CIQ.ChartEngine#loadChart} callback listeners.
 *
 * @see {@link CIQ.ChartEngine#exportDrawings}
 * @param  {array} arr An array of serialized drawings
 * @memberof CIQ.ChartEngine
 * @since 4.0.0 Replaces `reconstructDrawings`.
 * @example
 * // programmatically add a rectangle
 * stxx.importDrawings([{"name":"rectangle","pnl":"chart","col":"transparent","fc":"#7DA6F5","ptrn":"solid","lw":1.1,"d0":"20151216030000000","d1":"20151216081000000","tzo0":300,"tzo1":300,"v0":152.5508906882591,"v1":143.3385829959514}]);
 * // programmatically add a vertical line
 * stxx.importDrawings([{"name":"vertical","pnl":"chart","col":"transparent","ptrn":"solid","lw":1.1,"v0":147.45987854251013,"d0":"20151216023000000","tzo0":300,"al":true}]);
 * // now render the reconstructed drawings
 * stxx.draw();
 */
CIQ.ChartEngine.prototype.importDrawings = function (arr) {
	if (!CIQ.Drawing) return;
	for (var i = 0; i < arr.length; i++) {
		var rep = arr[i];
		if (rep.name == "fibonacci") rep.name = "retracement";
		var Factory = CIQ.ChartEngine.drawingTools[rep.name];
		if (!Factory) {
			if (CIQ.Drawing[rep.name]) {
				Factory = CIQ.Drawing[rep.name];
				CIQ.ChartEngine.registerDrawingTool(rep.name, Factory);
			}
		}
		if (Factory) {
			var drawing = new Factory();
			drawing.reconstruct(this, rep);
			this.drawingObjects.push(drawing);
		}
	}
};

/**
 * Clears all the drawings on the chart. (Do not call abortDrawings directly).
 * @param {boolean} cantUndo Set to true to make this an "non-undoable" operation
 * @param {boolean} deletePermanent Set to false to not delete permanent drawings
 * @memberof CIQ.ChartEngine
 * @since 6.0.0 Added `deletePermanent` parameter.
 */
CIQ.ChartEngine.prototype.clearDrawings = function (cantUndo, deletePermanent) {
	if (deletePermanent !== false) deletePermanent = true;
	var before = this.exportDrawings();
	this.abortDrawings(deletePermanent);
	if (cantUndo) {
		this.undoStamps = [];
	} else {
		this.undoStamp(before, this.exportDrawings());
	}
	this.changeOccurred("vector");
	//this.createDataSet();
	//this.deleteHighlighted(); // this will remove any stickies and also call draw()
	// deleteHighlighted was doing too much, so next we call 'just' what we need.
	this.cancelTouchSingleClick = true;
	CIQ.clearCanvas(this.chart.tempCanvas, this);
	this.draw();
	var mSticky = this.controls.mSticky;
	if (mSticky) {
		mSticky.style.display = "none";
		mSticky.children[0].innerHTML = "";
	}
};

/**
 * Creates a new drawing of the specified type with the specified parameters. See {@tutorial Using and Customizing Drawing Tools} for more details.
 * @param  {string} type	   Drawing name
 * @param  {object} parameters Parameters that describe the drawing
 * @return {CIQ.Drawing}			A drawing object
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.createDrawing = function (type, parameters) {
	if (!CIQ.Drawing) return;
	var drawing = new CIQ.Drawing[type]();
	drawing.reconstruct(this, parameters);
	//set default configs if not provided
	var config = new CIQ.Drawing[type]();
	config.stx = this;
	config.copyConfig();
	for (var prop in config) {
		drawing[prop] = drawing[prop] || config[prop];
	}
	this.drawingObjects.push(drawing);
	this.draw();
	return drawing;
};

/**
 * Removes the drawing. Drawing object should be one returned from {@link CIQ.ChartEngine#createDrawing}. See {@tutorial Using and Customizing Drawing Tools} for more details.
 * @param  {object} drawing Drawing object
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.removeDrawing = function (drawing) {
	for (var i = 0; i < this.drawingObjects.length; i++) {
		if (this.drawingObjects[i] == drawing) {
			this.drawingObjects.splice(i, 1);
			this.changeOccurred("vector");
			this.draw();
			return;
		}
	}

	//this.checkForEmptyPanel(drawing.panelName);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Stops (aborts) the current drawing. See {@link CIQ.ChartEngine#undoLast} for an actual "undo" operation.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias undo
 */
CIQ.ChartEngine.prototype.undo = function () {
	if (this.runPrepend("undo", arguments)) return;
	if (this.activeDrawing) {
		this.activeDrawing.abort();
		this.activeDrawing.hidden = false;
		this.drawingSnapshot = null;
		this.activateDrawing(null);
		CIQ.clearCanvas(this.chart.tempCanvas, this);
		this.draw();
		this.controls.crossX.classList.replace(
			"stx_crosshair_drawing",
			"stx_crosshair"
		);
		this.controls.crossY.classList.replace(
			"stx_crosshair_drawing",
			"stx_crosshair"
		);
		CIQ.ChartEngine.drawingLine = false;
	}
	this.runAppend("undo", arguments);
};

/**
 * Creates an undo stamp for the chart's current drawing state and triggers a call to the {@link undoStampEventListener}.
 *
 * Every time a drawing is added or removed the {@link CIQ.ChartEngine#undoStamps} object is updated with a new entry containing the resulting set of drawings.
 * Using the corresponding {@link CIQ.ChartEngine#undoLast} method, you can revert back to the last state, one at a time.
 * You can also use the {@link undoStampEventListener} to create your own tracker to undo or redo drawings.
 * @memberof CIQ.ChartEngine
 * @param {array} before The chart's array of [serialized drawingObjects]{@link CIQ.ChartEngine#exportDrawings} before being modified.
 * @param {array} after The chart's array of [serialized drawingObjects]{@link CIQ.ChartEngine#exportDrawings} after being modified
 * @since 7.0.0 'before' and 'after' parameters must now be an array of serialized drawings instead of an array of drawingObjects. See {@link CIQ.ChartEngine#exportDrawings}.
 */
CIQ.ChartEngine.prototype.undoStamp = function (before, after) {
	this.undoStamps.push(before);
	this.dispatch("undoStamp", {
		before: before,
		after: after,
		stx: this
	});
};

/**
 * Reverts back to the previous drawing state change.
 * **Note: by design this method only manages drawings manually added during the current session and will not remove drawings restored from
 * a previous session.** If you wish to remove all drawings use {@link CIQ.ChartEngine#clearDrawings}.
 *
 * You can also view and interact with all drawings by traversing through the {@link CIQ.ChartEngine#drawingObjects} array which includes **all** drawings displayed
 * on the chart, regardless of session. Removing a drawing from this list, will remove the drawing from the chart after a draw() operation is executed.
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.undoLast = function () {
	if (this.activeDrawing) {
		this.undo();
	} else {
		if (this.undoStamps.length) {
			this.drawingObjects = []; // drawingObjects will be repopulated by importDrawings
			this.importDrawings(this.undoStamps.pop());
			this.changeOccurred("vector");
			this.draw();
		}
	}
};

/**
 * Programmatically add a drawing
 * @param {object} drawing The drawing definition
 * @memberof CIQ.ChartEngine
 * @private
 */
CIQ.ChartEngine.prototype.addDrawing = function (drawing) {
	var drawings = this.exportDrawings();
	this.drawingObjects.push(drawing);
	this.undoStamp(drawings, this.exportDrawings());
};

/**
 * Repositions a drawing onto the temporary canvas. Called when a user moves a drawing.
 * @param  {CIQ.Drawing} drawing The drawing to reposition
 * @param  {boolean} activating True when first activating "reposition", so the drawing simply gets re-rendered in the same spot but on the tempCanvas.
 * (Otherwise it would jump immediately to the location of the next click/touch).
 * @since
 * - 3.0.0
 * - 5.0.0 Added `activating` parameter.
 * @private
 */
CIQ.ChartEngine.prototype.repositionDrawing = function (drawing, activating) {
	var panel = this.panels[drawing.panelName];
	var value = this.adjustIfNecessary(
		panel,
		this.crosshairTick,
		this.valueFromPixel(this.backOutY(CIQ.ChartEngine.crosshairY), panel)
	);
	var tempCanvas = this.chart.tempCanvas;
	CIQ.clearCanvas(tempCanvas, this);
	if (activating) {
		this.drawingSnapshot = this.exportDrawings();
		drawing.render(tempCanvas.context);
	} else {
		drawing.reposition(
			tempCanvas.context,
			drawing.repositioner,
			this.crosshairTick,
			value
		);
		if (this.drawingSnapshot)
			this.undoStamp(
				CIQ.shallowClone(this.drawingSnapshot),
				this.exportDrawings()
			);
		this.drawingSnapshot = null;
	}
	if (drawing.measure) drawing.measure();
};

/**
 * Activates or deactivates repositioning on a drawings.
 * @param  {CIQ.Drawing} drawing The drawing to activate. null to deactivate the current drawing.
 * @memberOf  CIQ.ChartEngine
 * @since 3.0.0
 */
CIQ.ChartEngine.prototype.activateRepositioning = function (drawing) {
	var repositioningDrawing = (this.repositioningDrawing = drawing);
	if (drawing) {
		// Take the drawing off the main canvas and put it on the tempCanvas
		this.draw();
		this.repositionDrawing(drawing, true);
	}
	this.chart.tempCanvas.style.display = drawing ? "block" : "none";
};

/**
 * Activate a drawing. The user can then finish the drawing.
 *
 * Note: Some drawings labeled "chartsOnly" can only be activated on the chart panel.
 * @param {string} drawingTool The tool to activate. Send null to deactivate.
 * @param {CIQ.ChartEngine.Panel} [panel] The panel where to activate the tool. Defaults to the current panel.
 * @return {boolean} Returns true if the drawing was successfully activated. Returns false if unactivated or unsuccessful.
 * @memberof CIQ.ChartEngine
 * @since
 * - 3.0.0
 * - 7.0.0 `panel` defaults to the current panel.
 */
CIQ.ChartEngine.prototype.activateDrawing = function (drawingTool, panel) {
	if (!panel) panel = this.currentPanel;
	function removeStudyOverlay(stx) {
		if (!stx.layout.studies) return;
		var study = stx.layout.studies[panel.name];
		if (study && !study.overlay) delete stx.overlays[study.name];
	}
	if (!drawingTool) {
		this.activeDrawing = null;
		this.chart.tempCanvas.style.display = "none";
		removeStudyOverlay(this);
		return false;
	}
	var Factory = CIQ.ChartEngine.drawingTools[drawingTool];
	if (!Factory) {
		if (CIQ.Drawing[drawingTool]) {
			Factory = CIQ.Drawing[drawingTool];
			CIQ.ChartEngine.registerDrawingTool(drawingTool, Factory);
		}
	}
	if (Factory) {
		this.activeDrawing = new Factory();
		this.activeDrawing.construct(this, panel);
		if (!this.charts[panel.name]) {
			if (this.activeDrawing.chartsOnly) {
				this.activeDrawing = null;
				removeStudyOverlay(this);
				return false;
			}
		}
	}
	this.chart.tempCanvas.style.display = "block";
	if (this.controls.drawOk) this.controls.drawOk.style.display = "none";
	removeStudyOverlay(this);
	return true;
};

/**
 * This is called to send a potential click event to an active drawing, if one is active.
 * @param  {CIQ.ChartEngine.Panel} panel The panel in which the click occurred
 * @param  {number} x	  The X pixel location of the click
 * @param  {number} y	  The y pixel location of the click
 * @return {boolean}	  Returns true if a drawing is active and received the click
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.drawingClick = function (panel, x, y) {
	if (!CIQ.Drawing) return;
	if (!panel) return; // can be true if panel was closed in the middle of a drawing
	if (this.openDialog !== "") return; // don't register a drawing click if in modal mode
	if (!this.activeDrawing) {
		if (!this.activateDrawing(this.currentVectorParameters.vectorType, panel))
			return;
	}
	if (this.activeDrawing) {
		if (this.userPointerDown && !this.activeDrawing.dragToDraw) {
			if (!CIQ.ChartEngine.drawingLine) this.activateDrawing(null);
			return;
		}

		var tick = this.tickFromPixel(x, panel.chart);
		var dpanel = this.panels[this.activeDrawing.panelName];
		var value = this.adjustIfNecessary(
			dpanel,
			tick,
			this.valueFromPixel(y, dpanel)
		);
		if (this.magnetizedPrice) {
			value = this.adjustIfNecessary(dpanel, tick, this.magnetizedPrice);
		}
		if (this.activeDrawing.click(this.chart.tempCanvas.context, tick, value)) {
			if (this.activeDrawing) {
				// Just in case the drawing aborted itself, such as measure
				CIQ.ChartEngine.drawingLine = false;
				CIQ.clearCanvas(this.chart.tempCanvas, this);
				this.addDrawing(this.activeDrawing); // Save drawing
				this.activateDrawing(null);
				this.adjustDrawings();
				this.draw();
				this.changeOccurred("vector");
				this.controls.crossX.classList.replace(
					"stx_crosshair_drawing",
					"stx_crosshair"
				);
				this.controls.crossY.classList.replace(
					"stx_crosshair_drawing",
					"stx_crosshair"
				);
			}
		} else {
			this.changeOccurred("drawing");
			CIQ.ChartEngine.drawingLine = true;
			this.controls.crossX.classList.replace(
				"stx_crosshair",
				"stx_crosshair_drawing"
			);
			this.controls.crossY.classList.replace(
				"stx_crosshair",
				"stx_crosshair_drawing"
			);
		}
		return true;
	}
	return false;
};

/**
 * Dispatch a {@link drawingEditEventListener} event if there are any listeners. Otherwise, remove the given drawing.
 *
 * @param {CIQ.Drawing} drawing The vector instance to edit, normally provided by deleteHighlighted.
 * @param {boolean} forceEdit skip the context menu and begin editing. Used on touch devices.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias rightClickDrawing
 * @since 6.2.0
 */
CIQ.ChartEngine.prototype.rightClickDrawing = function (drawing, forceEdit) {
	if (this.runPrepend("rightClickDrawing", arguments)) return;
	if (drawing.permanent) return;

	if (this.callbackListeners.drawingEdit.length) {
		this.dispatch("drawingEdit", {
			stx: this,
			drawing: drawing,
			forceEdit: forceEdit
		});
	} else {
		var dontDeleteMe = drawing.abort();

		if (!dontDeleteMe) {
			var before = this.exportDrawings();
			this.removeDrawing(drawing);
			this.undoStamp(before, this.exportDrawings());
		}

		this.changeOccurred("vector");
	}

	this.runAppend("rightClickDrawing", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Calculates the magnet point for the current mouse cursor location. This is the nearest OHLC point. A small white
 * circle is drawn on the temporary canvas to indicate this location for the end user. If the user initiates a drawing then
 * the end point of the drawing will be tied to the magnet point.
 * This function is only used when creating a new drawing if <a href="CIQ.ChartEngine.html#preferences%5B%60magnet%60%5D">CIQ.ChartEngine.preferences.magnet</a> is true and
 * a drawing <a href="CIQ.ChartEngine.html#currentVectorParameters%5B%60vectorType%60%5D">CIQ.ChartEngine.currentVectorParameters.vectorType</a> has been enabled. It will not be used when an existing drawing is being repositioned.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias magnetize
 */
CIQ.ChartEngine.prototype.magnetize = function () {
	this.magnetizedPrice = null;
	if (!this.preferences.magnet) return;
	if (this.runPrepend("magnetize", arguments)) return;
	if (this.repositioningDrawing) return; // Don't magnetize
	var drawingTool = this.currentVectorParameters.vectorType;
	if (!drawingTool || drawingTool == "projection" || drawingTool == "freeform")
		return;
	if (
		(drawingTool == "annotation" || drawingTool == "callout") &&
		CIQ.ChartEngine.drawingLine
	)
		return; // Don't magnetize the end of an annotation
	var panel = this.currentPanel;
	var chart = panel.chart;
	var tick = this.crosshairTick;
	//if(this.layout.interval!="minute") tick/=this.layout.periodicity;
	if (tick > chart.dataSet.length) return; // Don't magnetize in the future
	var prices = chart.dataSet[tick];
	if (!prices) return;
	var doTransform = chart.transformFunc && panel.yAxis === chart.yAxis;
	if (doTransform && prices.transform) prices = prices.transform;
	var stickMagnet;

	var fields = this.getRenderedItems();
	var ohlc = ["Open", "High", "Low", "Close"];
	if (this.magneticHold && this.activeDrawing && this.activeDrawing.penDown) {
		if (ohlc.indexOf(this.magneticHold) != -1 && fields.indexOf("High") != -1)
			fields = ohlc;
		else fields = [this.magneticHold];
	} else this.magneticHold = null; //reset for next time!
	var closest = 1000000000;
	var magnetRadius = parseFloat(this.preferences.magnet); // if it is actually a number we use that otherwise magnetRadius is falsey and no harm
	for (var i = 0; i < fields.length; i++) {
		var fieldPrice = prices[fields[i]];
		var yAxis = this.getYAxisByField(panel, fields[i]);

		var tuple = CIQ.existsInObjectChain(prices, fields[i]);
		if (tuple) fieldPrice = tuple.obj[tuple.member];

		if (fieldPrice || fieldPrice === 0) {
			var pixelPosition = this.pixelFromTransformedValue(
				fieldPrice,
				panel,
				yAxis
			); // pixel position of Price!
			if (Math.abs(this.cy - pixelPosition) < closest) {
				closest = Math.abs(this.cy - pixelPosition);
				if (magnetRadius && magnetRadius <= closest) continue;
				this.magnetizedPrice = doTransform
					? this.valueFromPixel(pixelPosition, panel)
					: fieldPrice;
				stickMagnet = pixelPosition;
				this.magneticHold = fields[i];
			}
		}
	}
	var x = this.pixelFromTick(tick, chart);
	var y = stickMagnet;
	CIQ.clearCanvas(chart.tempCanvas, this);
	var ctx = chart.tempCanvas.context;
	ctx.beginPath();
	ctx.lineWidth = 1;
	var radius = Math.max(this.layout.candleWidth, 12) / 3;
	// Limit the radius size to 8 to prevent a large arc
	// when zooming in and increasing the candle width.
	ctx.arc(x, y, Math.min(radius, 8), 0, 2 * Math.PI, false);
	// ctx.lineWidth=2;
	ctx.fillStyle = "#398dff";
	ctx.strokeStyle = "#398dff";
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
	chart.tempCanvas.style.display = "block";
	if (this.anyHighlighted) this.container.classList.remove("stx-draggable");
	if (this.activeDrawing)
		this.activeDrawing.move(ctx, this.crosshairTick, this.magnetizedPrice);
	this.runAppend("magnetize", arguments);
};

/**
 * Sets the current drawing tool as described by {@link CIQ.ChartEngine#currentVectorParameters} (segment, line, etc)
 * @param  {string} value The name of the drawing tool to enable
 * @memberof CIQ.ChartEngine
 * @example
 * // activates a drawing type described by currentVectorParameters
 * stxx.changeVectorType('rectangle');
 * // deactivates drawing mode
 * stxx.changeVectorType('');
 * // clears the drawings
 * stxx.clearDrawings()
 */
CIQ.ChartEngine.prototype.changeVectorType = function (value) {
	this.currentVectorParameters.vectorType = value;
	if (CIQ.Drawing) CIQ.Drawing.initializeSettings(this, value);
	//if(value==""){  //need to always undo here to allow release of last drawing tool
	if (CIQ.ChartEngine.drawingLine) this.undo();
	//}
	// this.setCrosshairColors();
	if (this.insideChart) {
		this.doDisplayCrosshairs();
	}
};

/**
 * Sets the current drawing parameter as described by {@link CIQ.ChartEngine#currentVectorParameters} (color, pattern, etc)
 * @param  {string} value The name of the drawing parameter to change (currentColor, fillColor, lineWidth, pattern, axisLabel, fontSize, fontStyle, fontWeight, fontFamily)
 * @param  {string} value The value of the parameter
 * @return  {boolean} True if property was assigned
 * @memberof CIQ.ChartEngine
 * @example
 * 		this.stx.changeVectorParameter("currentColor","yellow");  // or rgb/hex
 *		this.stx.changeVectorParameter("axisLabel",false);  // or "false"
 *		this.stx.changeVectorParameter("lineWidth",5);  // or "5"
 *		this.stx.changeVectorParameter("fontSize","12");  // or 12 or "12px"
 *		this.stx.changeVectorParameter("pattern","dotted");
 *
 * @since 3.0.0
 */
CIQ.ChartEngine.prototype.changeVectorParameter = function (parameter, value) {
	if (parameter == "axisLabel")
		value = value.toString() === "true" || Number(value);
	else if (parameter == "lineWidth") value = Number(value);
	else if (parameter == "fontSize") value = parseInt(value, 10) + "px";
	var currentVectorParams = this.currentVectorParameters;
	if (typeof currentVectorParams[parameter] !== "undefined") {
		currentVectorParams[parameter] = value;
		return true;
	} else if (parameter.substr(0, 4) == "font") {
		parameter = parameter.substr(4).toLowerCase();
		if (parameter == "family" && value.toLowerCase() == "default") value = null;
		currentVectorParams = currentVectorParams.annotation.font;
		if (typeof currentVectorParams[parameter] !== "undefined") {
			currentVectorParams[parameter] = value;
			return true;
		}
	}
	return false;
};

/**
 * <span class="injection">INJECTABLE</span>
 * <span class="animation">Animation Loop</span>
 * Draws the drawings (vectors). Each drawing is iterated and asked to draw itself. Drawings are automatically
 * clipped by their containing panel.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias drawVectors
 */
CIQ.ChartEngine.prototype.drawVectors = function () {
	if (this.vectorsShowing) return;
	if (this.runPrepend("drawVectors", arguments)) return;
	this.vectorsShowing = true;
	if (!this.chart.hideDrawings && !this.highlightedDraggable) {
		var tmpPanels = {};
		// First find all the existing panels in the given set of drawings (excluding those that aren't displayed)
		var panelName, i;
		for (i = 0; i < this.drawingObjects.length; i++) {
			var drawing = this.drawingObjects[i];
			if (drawing.hidden) continue; // do not draw this on the main canvas; it's being edited on the tempCanvas
			if (this.repositioningDrawing === drawing) continue; // don't display a drawing that is currently being repositioned because it will show on the tempCanvas
			panelName = drawing.panelName;
			if (
				!this.panels[drawing.panelName] ||
				this.panels[drawing.panelName].hidden
			)
				continue; // drawing from a panel that is not enabled
			if (!tmpPanels[panelName]) {
				tmpPanels[panelName] = [];
			}
			tmpPanels[panelName].push(drawing);
		}
		// Now render all the drawings in those panels, clipping each panel
		for (panelName in tmpPanels) {
			this.startClip(panelName);
			var arr = tmpPanels[panelName];
			for (i = 0; i < arr.length; i++) {
				arr[i].render(this.chart.context);
			}
			this.endClip();
		}
	}
	this.runAppend("drawVectors", arguments);
};

/**
 * Loops through the existing drawings and asks them to adjust themselves to the chart dimensions.
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.adjustDrawings = function () {
	for (var i = 0; i < this.drawingObjects.length; i++) {
		var drawing = this.drawingObjects[i];
		if (this.panels[drawing.panelName]) drawing.adjust();
	}
};

/**
 * Base class for Drawing Tools. Use {@link CIQ.inheritsFrom} to build a subclass for custom drawing tools.
 * The name of the subclass should be CIQ.Drawing.yourname. Whenever CIQ.ChartEngine.currentVectorParameters.vectorType==yourname, then
 * your drawing tool will be the one that is enabled when the user begins a drawing. Capitalization of yourname
 * must be an exact match otherwise the kernel will not be able to find your drawing tool.
 *
 * Each of the CIQ.Drawing prototype functions may be overridden. To create a functioning drawing tool
 * you must override the functions below that create alerts.
 *
 * Drawing clicks are always delivered in *adjusted price*. That is, if a stock has experienced splits then
 * the drawing will not display correctly on an unadjusted price chart unless this is considered during the rendering
 * process. Follow the templates to assure correct rendering under both circumstances.
 *
 * If no color is specified when building a drawing then color will be set to "auto" and the chart will automatically display
 * white or black depending on the background.
 *
 * **Permanent drawings:**<br>
 * To make a particular drawing permanent, set its `permanent` property to `true` once created.
 * <br>Example: <br>
 * ```drawingObject.permanent=true;```
 *
 * See {@tutorial Using and Customizing Drawing Tools} for more details.
 *
 * @name  CIQ.Drawing
 * @constructor
 */
CIQ.Drawing =
	CIQ.Drawing ||
	function () {
		this.chartsOnly = false; // Set this to true to restrict drawing to panels containing charts (as opposed to studies)
		this.penDown = false; // Set to true when in the midst of creating the object
	};

/**
 * Since not all drawings have the same configuration parameters,
 * this is a helper function intended to return the relevant drawing parameters and default settings for the requested drawing type.
 *
 * For example,  you can use the returning object as your template for creating the proper UI tool box for that particular drawing.
 * Will you need a line width UI element, a fill color?, etc. Or you can use it to determine what values you should be setting if enabling
 * a particular drawing type programmatically with specific properties.
 * @param {CIQ.ChartEngine} stx Chart object
 * @param {string} drawingName Name of drawing, e.g. "ray", "segment"
 * @returns {object} Map of parameters used in the drawing type, with their current values
 * @memberOf CIQ.Drawing
 * @since 3.0.0
 */
CIQ.Drawing.getDrawingParameters = function (stx, drawingName) {
	var drawing;
	try {
		drawing = new CIQ.Drawing[drawingName]();
	} catch (e) {}
	if (!drawing) return null;
	drawing.stx = stx;
	drawing.copyConfig(true);
	var result = {};
	var confs = drawing.configs;
	for (var c = 0; c < confs.length; c++) {
		result[confs[c]] = drawing[confs[c]];
	}
	var style = stx.canvasStyle("stx_annotation");
	if (style && result.font) {
		result.font.size = style.fontSize;
		result.font.family = style.fontFamily;
		result.font.style = style.fontStyle;
		result.font.weight = style.fontWeight;
	}
	return result;
};

/**
 * Static method for saving drawing parameters to preferences.
 *
 * Values are stored in `stxx.preferences.drawings` and can be saved together with the rest of the chart preferences,
 * which by default are placed in the browser's local storage under "myChartPreferences".
 * @param {CIQ.ChartEngine} stx Chart object
 * @param {string} toolName Name of drawing tool, e.g. "ray", "segment", "fibonacci"
 * @memberOf CIQ.Drawing
 * @since 6.0.0
 */
CIQ.Drawing.saveConfig = function (stx, toolName) {
	if (!toolName) return;
	var preferences = stx.preferences;
	if (!preferences.drawings) preferences.drawings = {};
	preferences.drawings[toolName] = {};
	var tempDrawing = new CIQ.Drawing[toolName]();
	tempDrawing.stx = stx;
	CIQ.Drawing.copyConfig(tempDrawing);
	tempDrawing.configs.forEach(function (config) {
		preferences.drawings[toolName][config] = tempDrawing[config];
	});
	stx.changeOccurred("preferences");
};

/**
 * Static method for restoring default drawing parameters, and removing custom preferences.
 *
 * @param {CIQ.ChartEngine} stx Chart object
 * @param {string} toolName Name of active drawing tool, e.g. "ray", "segment", "fibonacci"
 * @param {boolean} all True to restore default for all drawing objects.  Otherwise only the active drawing object's defaults are restored.
 * @memberOf CIQ.Drawing
 * @since 6.0.0
 */
CIQ.Drawing.restoreDefaultConfig = function (stx, toolName, all) {
	if (all) stx.preferences.drawings = null;
	else stx.preferences.drawings[toolName] = null;
	stx.changeOccurred("preferences");
	stx.currentVectorParameters = CIQ.clone(
		CIQ.ChartEngine.currentVectorParameters
	);
	stx.currentVectorParameters.vectorType = toolName;
};

/**
 * Static method to call optional initializeSettings instance method of the drawing whose name is passed in as an argument.
 * @param {CIQ.ChartEngine} stx Chart object
 * @param {string} drawingName Name of drawing, e.g. "ray", "segment", "fibonacci"
 * @memberOf CIQ.Drawing
 * @since 5.2.0 Calls optional instance function instead of doing all the work internally.
 */
CIQ.Drawing.initializeSettings = function (stx, drawingName) {
	var drawing = CIQ.Drawing[drawingName];
	if (drawing) {
		var drawInstance = new drawing();
		if (drawInstance.initializeSettings) drawInstance.initializeSettings(stx);
	}
};

/**
 * Updates the drawing's field or panelName property to the passed in argument if the field of the drawing is "sourced" from the passed in name.
 *
 * This is used when moving a series or study, and there is a drawing based upon it.<br>
 * It will be called based on the following occurrences:
 * - Panel of series changed
 * - Panel of study changed
 * - Default panel of study changed due to field change
 * - Outputs of study changed due to field change
 * - Outputs of study changed due to name change (due to field of field change)
 * @param {CIQ.ChartEngine} stx Chart object
 * @param {string} name Name of study or symbol of series to match with
 * @param {string} newName Name of new field to use for the drawing field if a name match is found
 * @param {string} newPanel Name of new panel to use for the drawing if a name match is found, ignored if `newName`` is set
 * @memberOf CIQ.Drawing
 * @since 7.0.0
 */
CIQ.Drawing.updateSource = function (stx, name, newName, newPanel) {
	if (!name) return;
	var vectorChange = false;
	for (var dKey in stx.drawingObjects) {
		var drawing = stx.drawingObjects[dKey];
		if (!drawing.field) continue;
		if (newName) {
			// field change
			if (drawing.field == name) {
				drawing.field = newName;
				vectorChange = true;
			} else if (
				drawing.field.indexOf(name) > -1 &&
				drawing.field.indexOf(name + "-") == -1
			) {
				drawing.field = drawing.field.replace(name, newName);
				vectorChange = true;
			}
		} else {
			// panel change
			if (drawing.field.split("-->")[0] == name || drawing.panelName == name) {
				drawing.panelName = newPanel;
				vectorChange = true;
			}
		}
	}
	if (vectorChange) stx.changeOccurred("vector");
};

/**
 * Instance function used to copy the relevant drawing parameters into itself.
 * It just calls the static function.
 * @param {boolean} withPreferences set to true to return previously saved preferences
 * @memberOf CIQ.Drawing
 * @since 3.0.0
 */
CIQ.Drawing.prototype.copyConfig = function (withPreferences) {
	CIQ.Drawing.copyConfig(this, withPreferences);
};
/**
 * Static function used to copy the relevant drawing parameters into the drawing instance.
 * Use this when overriding the Instance function, to perform basic copy before performing custom operations.
 * @param {CIQ.Drawing} drawingInstance to copy into
 * @param {boolean} withPreferences set to true to return previously saved preferences
 * @memberOf CIQ.Drawing
 * @since
 * - 3.0.0
 * - 6.0.0 Overwrites parameters with those stored in `preferences.drawings`.
 */
CIQ.Drawing.copyConfig = function (drawingInstance, withPreferences) {
	var cvp = drawingInstance.stx.currentVectorParameters;
	var configs = drawingInstance.configs;
	var c, conf;
	for (c = 0; c < configs.length; c++) {
		conf = configs[c];
		if (conf == "color") {
			drawingInstance.color = cvp.currentColor;
		} else if (conf == "parameters") {
			drawingInstance.parameters = CIQ.clone(cvp.fibonacci);
		} else if (conf == "font") {
			drawingInstance.font = CIQ.clone(cvp.annotation.font);
		} else {
			drawingInstance[conf] = cvp[conf];
		}
	}
	if (!withPreferences) return;
	var customPrefs = drawingInstance.stx.preferences;
	if (customPrefs && customPrefs.drawings) {
		CIQ.extend(drawingInstance, customPrefs.drawings[cvp.vectorType]);
		for (c = 0; c < configs.length; c++) {
			conf = configs[c];
			if (conf == "color") {
				cvp.currentColor = drawingInstance.color;
			} else if (conf == "parameters") {
				cvp.fibonacci = CIQ.clone(drawingInstance.parameters);
			} else if (conf == "font") {
				cvp.annotation.font = CIQ.clone(drawingInstance.font);
			} else {
				cvp[conf] = drawingInstance[conf];
			}
		}
	}
};

/**
 * Used to set the user behavior for creating drawings.
 *
 * By default, a drawing is created with this sequence:
 * <br>`move crosshair to staring point` → `click` → `move crosshair to ending point` → `click`.
 * > On a touch device this would be:
 * > <br>`move crosshair to staring point` → `tap` → `move crosshair to ending point` → `tap`.
 *
 * Set dragToDraw to `true` to create the drawing with the following alternate sequence:
 * <br>`move crosshair to staring point` → `mousedown` → `drag` → `mouseup`
 * > On a touch device this would be:
 * > <br>`move crosshair to staring point` → `press` → `drag` → `release`.
 *
 *  This parameter is **not compatible** with drawings requiring more than one drag movement to complete, such as:
 *  - Channel
 *  - Continues Line
 *  - Elliott Wave
 *  - Gartley
 *  - Pitchfork
 *  - Fibonacci Projection
 *
 * Line and Ray have their own separate parameter, which also needs to be set in the same way,  if this option is desired:   `CIQ.Drawing.line.prototype.dragToDraw=true;`
 *
 * This parameter may be set for all drawings compatible with it, for a specific drawing type, or for a specific drawing instance. See examples.
 * @memberOf CIQ.Drawing
 * @example
 * // set drawing instance to dragToDraw. Only this one drawing will be affected
 * drawing.dragToDraw=true;
 * // Set particular drawing prototype to dragToDraw. All drawings to type "difference" will be affected
 * CIQ.Drawing["difference"].prototype.dragToDraw=true;
 * // Set all drawings to dragToDraw
 * CIQ.Drawing.prototype.dragToDraw=true;
 */
CIQ.Drawing.prototype.dragToDraw = false;

/**
 * Set this to true to disable selection, repositioning and deletion by the end user.
 *
 * This parameter may be set for all drawings, for a specific drawing type, or for a specific drawing instance. See examples.
 * @memberOf CIQ.Drawing
 * @example
 * // set drawing instance to permanent. Only this one drawing will be affected
 * drawing.permanent=true;
 * // Set particular drawing prototype to permanent. All drawings to type "difference" will be affected
 * CIQ.Drawing["difference"].prototype.permanent=true;
 * // Set all drawings to permanent
 * CIQ.Drawing.prototype.permanent=true;
 */
CIQ.Drawing.prototype.permanent = false;

/**
 * Set this to true to restrict drawing from being rendered on a study panel.
 *
 * This parameter may be set for all drawings, for a specific drawing type, or for a specific drawing instance. See examples.
 * @memberOf CIQ.Drawing
 * @example
 * // set drawing instance to chartsOnly. Only this one drawing will be affected
 * drawing.chartsOnly=true;
 * // Set particular drawing prototype to chartsOnly. All drawings to type "difference" will be affected
 * CIQ.Drawing["difference"].prototype.chartsOnly=true;
 * // Set all drawings to chartsOnly
 * CIQ.Drawing.prototype.chartsOnly=true;
 */
CIQ.Drawing.prototype.chartsOnly = false;

/**
 * Is called to tell a drawing to abort itself. It should clean up any rendered objects such as DOM elements or toggle states. It
 * does not need to clean up anything that it drew on the canvas.
 * @param  {boolean} forceClear Indicates that the user explicitly has deleted the drawing (advanced usage)
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.abort = function (forceClear) {};

/**
 * Should call this.stx.setMeasure() with the measurements of the drawing if supported
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.measure = function () {};

/**
 * Initializes the drawing
 * @param  {CIQ.ChartEngine} stx   The chart object
 * @param  {CIQ.ChartEngine.Panel} panel The panel reference
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.construct = function (stx, panel) {
	this.stx = stx;
	this.panelName = panel.name;
};

/**
 * Called to render the drawing
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.render = function (context) {
	console.warn("must implement render function!");
};

/**
 * Called when a user clicks while drawing.
 * @param  {object} context               The canvas context
 * @param  {number} tick                  The tick in the dataSet
 * @param  {number} value - The value (price) of the click
 * @return {boolean}                       Return true if the drawing is complete. Otherwise the kernel will continue accepting clicks.
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.click = function (context, tick, value) {
	console.warn("must implement click function!");
};

/**
 * Called when the user moves while creating a drawing.
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.move = function (context, tick, value) {
	console.warn("must implement move function!");
};

/**
 * Called when the user attempts to reposition a drawing. The repositioner is the object provided by {@link CIQ.Drawing.intersected}
 * and can be used to determine which aspect of the drawing is being repositioned. For instance, this object may indicate
 * which point on the drawing was selected by the user. It might also contain the original coordinates of the point or anything else
 * that is useful to render the drawing.
 * @param  {object} context      The canvas context
 * @param  {object} repositioner The repositioner object
 * @param  {number} tick         Current tick in the dataSet for the mouse cursor
 * @param  {number} value        Current value in the datSet for the mouse cursor
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.reposition = function (
	context,
	repositioner,
	tick,
	value
) {};
/**
 * Called to determine whether the drawing is intersected by either the tick/value (pointer location) or box (small box surrounding the pointer).
 * For line based drawings, box should be checked. For area drawings (rectangles, circles) the point should be checked
 * @param  {number} tick               The tick in the dataSet representing the cursor point
 * @param  {number} value              The value (price) representing the cursor point
 * @param  {object} box				   x0,y0,x1,y1,r representing an area around the cursor and the radius
 * @return {object}                    An object that contains information about the intersection.
 *                                     This object is passed back to {@link CIQ.Drawing.reposition} when repositioning the drawing.
 *                                     Return false or null if not intersected. Simply returning true will highlight the drawing.
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.intersected = function (tick, value, box) {
	console.warn("must implement intersected function!");
};

/**
 * Reconstruct this drawing type from a serialization object
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.reconstruct = function (stx, obj) {
	console.warn("must implement reconstruct function!");
};

/**
 * Serialize a drawing into an object.
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.serialize = function () {
	console.warn("must implement serialize function!");
};

/**
 * Called whenever periodicity changes so that drawings can adjust their rendering.
 * @memberOf CIQ.Drawing
 */
CIQ.Drawing.prototype.adjust = function () {
	console.warn("must implement adjust function!");
};

/**
 * Returns the highlighted state. Set this.highlighted to the highlight state.
 * For simple drawings the highlighted state is just true or false. For complex drawings
 * with pivot points for instance, the highlighted state may have more than two states.
 * Whenever the highlighted state changes a draw() event will be triggered.
 * @param {Boolean} highlighted True to highlight the drawing, false to unhighlight
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.prototype.highlight = function (highlighted) {
	if (highlighted && !this.highlighted) {
		this.highlighted = highlighted;
	} else if (!highlighted && this.highlighted) {
		this.highlighted = highlighted;
	}
	return this.highlighted;
};

CIQ.Drawing.prototype.littleCircleRadius = function () {
	var radius = 6; //Math.max(12, this.layout.candleWidth)/2;
	return radius;
};

CIQ.Drawing.prototype.littleCircle = function (ctx, x, y, fill) {
	if (this.permanent) return;
	var strokeColor = this.stx.defaultColor;
	var fillColor = CIQ.chooseForegroundColor(strokeColor);
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.arc(x, y, this.littleCircleRadius(), 0, 2 * Math.PI, false);
	if (fill) ctx.fillStyle = strokeColor;
	else ctx.fillStyle = fillColor;
	ctx.strokeStyle = strokeColor;
	ctx.setLineDash([]);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
};

CIQ.Drawing.prototype.rotator = function (ctx, x, y, on) {
	if (this.permanent) return;
	var circleSize = this.littleCircleRadius();
	var strokeColor = this.stx.defaultColor;
	ctx.beginPath();
	ctx.lineWidth = 2;
	if (!on) ctx.globalAlpha = 0.5;
	var radius = 4 + circleSize;
	ctx.arc(x, y, radius, 0, (3 * Math.PI) / 2, false);
	ctx.moveTo(x + 2 + radius, y + 2);
	ctx.lineTo(x + radius, y);
	ctx.lineTo(x - 2 + radius, y + 2);
	ctx.moveTo(x - 2, y + 2 - radius);
	ctx.lineTo(x, y - radius);
	ctx.lineTo(x - 2, y - 2 - radius);
	ctx.strokeStyle = strokeColor;
	ctx.stroke();
	ctx.closePath();
	ctx.globalAlpha = 1;
};

CIQ.Drawing.prototype.mover = function (ctx, x, y, on) {
	if (this.permanent) return;
	var circleSize = this.littleCircleRadius();
	var strokeColor = this.stx.defaultColor;
	var length = 5;
	var start = circleSize + 1;
	ctx.save();
	ctx.lineWidth = 2;
	ctx.strokeStyle = strokeColor;
	ctx.translate(x, y);
	if (!on) ctx.globalAlpha = 0.5;
	for (var i = 0; i < 4; i++) {
		ctx.rotate(Math.PI / 2);
		ctx.beginPath();
		ctx.moveTo(0, start);
		ctx.lineTo(0, start + length);
		ctx.moveTo(-2, start + length - 2);
		ctx.lineTo(0, start + length);
		ctx.lineTo(2, start + length - 2);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	ctx.restore();
};

CIQ.Drawing.prototype.resizer = function (ctx, x, y, on) {
	if (this.permanent) return;
	var circleSize = this.littleCircleRadius();
	var strokeColor = this.stx.defaultColor;
	var length = 5 * Math.sqrt(2);
	var start = circleSize + 1;
	ctx.save();
	ctx.lineWidth = 2;
	ctx.strokeStyle = strokeColor;
	ctx.translate(x, y);
	ctx.rotate(((-(x * y) / Math.abs(x * y)) * Math.PI) / 4);
	if (!on) ctx.globalAlpha = 0.5;
	for (var i = 0; i < 2; i++) {
		ctx.rotate(Math.PI);
		ctx.beginPath();
		ctx.moveTo(0, start);
		ctx.lineTo(0, start + length);
		ctx.moveTo(-2, start + length - 2);
		ctx.lineTo(0, start + length);
		ctx.lineTo(2, start + length - 2);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	ctx.restore();
};

/**
 * Returns true if the tick and value are inside the box
 * @param  {number} tick  The tick
 * @param  {number} value The value
 * @param  {object} box   The box
 * @param  {boolean} isPixels   True if tick and value are in pixels; otherwise, they assumed to be in ticks and untransformed y-axis values, respectively
 * @return {boolean}       True if the tick and value are within the box
 * @memberOf CIQ.Drawing
 * @since 7.0.0 Added `isPixels`.
 */
CIQ.Drawing.prototype.pointIntersection = function (
	tick,
	value,
	box,
	isPixels
) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return false;
	if (isPixels) {
		if (
			tick >= box.cx0 &&
			tick <= box.cx1 &&
			value >= box.cy0 &&
			value <= box.cy1
		)
			return true;
	} else {
		if (
			tick >= box.x0 &&
			tick <= box.x1 &&
			value >= Math.min(box.y0, box.y1) &&
			value <= Math.max(box.y0, box.y1)
		)
			return true;
	}
	return false;
};

/**
 * Sets the internal properties of the drawing points where x is a tick or a date and y is a value.
 * @param  {number} point    index to point to be converted (0,1)
 * @param  {number|string} x    index of bar in dataSet (tick) or date of tick (string form)
 * @param  {number} y    price
 * @param  {CIQ.Chart} [chart] Optional chart object
 * @memberOf CIQ.Drawing.BaseTwoPoint
 * @since 04-2015
 */
CIQ.Drawing.prototype.setPoint = function (point, x, y, chart) {
	var tick = null;
	var date = null;
	if (typeof x == "number") tick = x;
	else if (x.length >= 8) date = x;
	else tick = Number(x);

	if (y || y === 0) this["v" + point] = y;
	var d;
	if (tick !== null) {
		d = this.stx.dateFromTick(tick, chart, true);
		this["tzo" + point] = d.getTimezoneOffset();
		this["d" + point] = CIQ.yyyymmddhhmmssmmm(d);
		this["p" + point] = [tick, y];
	} else if (date !== null) {
		d = CIQ.strToDateTime(date);
		if (!this["tzo" + point] && this["tzo" + point] !== 0)
			this["tzo" + point] = d.getTimezoneOffset();
		this["d" + point] = date;
		var adj = this["tzo" + point] - d.getTimezoneOffset();
		d.setMinutes(d.getMinutes() + adj);
		var forward = false;
		// if no match, we advance on intraday when there is a no time portion
		// except for free form which already handles time placement internally
		if (
			this.name != "freeform" &&
			!CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval) &&
			!d.getHours() &&
			!d.getMinutes() &&
			!d.getSeconds() &&
			!d.getMilliseconds()
		)
			forward = true;

		this["p" + point] = [
			this.stx.tickFromDate(CIQ.yyyymmddhhmmssmmm(d), chart, null, forward),
			y
		];
	}
};

/**
 * Compute the proper color to use when rendering lines in the drawing.
 *
 * Will use the color but if set to auto or transparent, will use the container's defaultColor.
 * However, if color is set to auto and the drawing is based off a series or study plot,
 * this function will return that plot's color.
 * If drawing is highlighted will use the highlight color as defined in stx_highlight_vector style.
 * @param {string} color Color string to check and use as a basis for setting.  If not supplied, uses this.color.
 * @return {string} Color to use for the line drawing
 * @memberOf CIQ.Drawing
 * @since 7.0.0 Replaces `setLineColor`. Will return source line's color if auto.
 * @example
 * 		var trendLineColor=this.getLineColor();
 *		this.stx.plotLine(x0, x1, y0, y1, trendLineColor, "segment", context, panel, parameters);
 */
CIQ.Drawing.prototype.getLineColor = function (color) {
	if (!color) color = this.color;
	var stx = this.stx,
		lineColor = color;
	if (this.highlighted) {
		lineColor = stx.getCanvasColor("stx_highlight_vector");
	} else if (CIQ.isTransparent(lineColor)) {
		lineColor = stx.defaultColor;
	} else if (lineColor == "auto") {
		lineColor = stx.defaultColor;
		if (this.field) {
			// ugh, need to search for it
			var n;
			for (n in stx.layout.studies) {
				var s = stx.layout.studies[n];
				var candidateColor = s.outputs[s.outputMap[this.field]];
				if (candidateColor) {
					lineColor = candidateColor.color || candidateColor;
					break;
				}
			}
			var fallBackOn;
			for (n in stx.chart.seriesRenderers) {
				var renderer = stx.chart.seriesRenderers[n];
				for (var m = 0; m < renderer.seriesParams.length; m++) {
					var series = renderer.seriesParams[m];
					var fullField = series.field;
					if (!fullField && !renderer.highLowBars)
						fullField = this.defaultPlotField || "Close";
					if (series.symbol && series.subField)
						fullField += "-->" + series.subField;
					if (this.field == fullField) {
						lineColor = series.color;
						break;
					}
					if (series.field && series.field == this.field.split("-->")[0])
						fallBackOn = series.color;
				}
			}
			if (fallBackOn) lineColor = fallBackOn;
		}
	}
	if (lineColor == "auto") lineColor = stx.defaultColor;

	return lineColor;
};

/**
 * Base class for drawings that require two mouse clicks. Override as required.
 * @constructor
 * @name  CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint = function () {
	this.p0 = null;
	this.p1 = null;
	this.color = "";
};

CIQ.inheritsFrom(CIQ.Drawing.BaseTwoPoint, CIQ.Drawing);

CIQ.Drawing.BaseTwoPoint.prototype.configs = [];

/**
 * Intersection is based on a hypothetical box that follows a user's mouse or finger around
 * An intersection occurs when either the box crosses over the drawing.The type should be "segment", "ray" or "line" depending on whether
 * the drawing extends infinitely in any or both directions. radius determines the size of the box in pixels and is
 * determined by the kernel depending on the user interface (mouse, touch, etc)
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.lineIntersection = function (
	tick,
	value,
	box,
	type,
	p0,
	p1,
	isPixels
) {
	if (!p0) p0 = this.p0;
	if (!p1) p1 = this.p1;
	var stx = this.stx;
	if (!(p0 && p1)) return false;
	var pixelBox = CIQ.convertBoxToPixels(stx, this.panelName, box);
	if (pixelBox.x0 === undefined) return false;
	var pixelPoint = { x0: p0[0], x1: p1[0], y0: p0[1], y1: p1[1] };
	if (!isPixels)
		pixelPoint = CIQ.convertBoxToPixels(stx, this.panelName, pixelPoint);
	return CIQ.boxIntersects(
		pixelBox.x0,
		pixelBox.y0,
		pixelBox.x1,
		pixelBox.y1,
		pixelPoint.x0,
		pixelPoint.y0,
		pixelPoint.x1,
		pixelPoint.y1,
		type
	);
};

/**
 * Determine whether the tick/value lie within the theoretical box outlined by this drawing's two points
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.boxIntersection = function (
	tick,
	value,
	box
) {
	if (!this.p0 || !this.p1) return false;
	if (
		box.x0 > Math.max(this.p0[0], this.p1[0]) ||
		box.x1 < Math.min(this.p0[0], this.p1[0])
	)
		return false;
	if (
		box.y1 > Math.max(this.p0[1], this.p1[1]) ||
		box.y0 < Math.min(this.p0[1], this.p1[1])
	)
		return false;
	return true;
};

/**
 * Any two-point drawing that results in a drawing that is less than 10 pixels
 * can safely be assumed to be an accidental click. Such drawings are so small
 * that they are difficult to highlight and delete, so we won't allow them.
 *
 * <b>Note:</b> it is very important to use pixelFromValueAdjusted() rather than pixelFromPrice(). This will
 * ensure that saved drawings always render correctly when a chart is adjusted or transformed for display
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.accidentalClick = function (tick, value) {
	var panel = this.stx.panels[this.panelName];
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var x1 = this.stx.pixelFromTick(tick, panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	var y1 = this.stx.pixelFromValueAdjusted(panel, tick, value);
	var h = Math.abs(x1 - x0);
	var v = Math.abs(y1 - y0);
	var length = Math.sqrt(h * h + v * v);
	if (length < 10) {
		this.penDown = false;
		if (this.dragToDraw) this.stx.undo();
		return true;
	}
};

/**
 * Value will be the actual underlying, unadjusted value for the drawing. Any adjustments or transformations
 * are reversed out by the kernel. Internally, drawings should store their raw data (date and value) so that
 * they can be rendered on charts with different layouts, axis, etc
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.click = function (context, tick, value) {
	this.copyConfig();
	var panel = this.stx.panels[this.panelName];
	if (!this.penDown) {
		this.setPoint(0, tick, value, panel.chart);
		this.penDown = true;
		return false;
	}
	if (this.accidentalClick(tick, value)) return this.dragToDraw;

	this.setPoint(1, tick, value, panel.chart);
	this.penDown = false;
	return true; // kernel will call render after this
};

/**
 * Default adjust function for BaseTwoPoint drawings
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.adjust = function () {
	// If the drawing's panel doesn't exist then we'll check to see
	// whether the panel has been added. If not then there's no way to adjust
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.setPoint(1, this.d1, this.v1, panel.chart);
};

/**
 * Default move function for BaseTwoPoint drawings
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.move = function (context, tick, value) {
	if (!this.penDown) return;

	this.copyConfig();
	this.p1 = [tick, value];
	this.render(context);
};

/**
 * Default measure function for BaseTwoPoint drawings
 * @memberOf CIQ.Drawing.BaseTwoPoint
 */
CIQ.Drawing.BaseTwoPoint.prototype.measure = function () {
	if (this.p0 && this.p1) {
		this.stx.setMeasure(
			this.p0[1],
			this.p1[1],
			this.p0[0],
			this.p1[0],
			true,
			this.name
		);
		var mSticky = this.stx.controls.mSticky;
		var mStickyInterior = mSticky && mSticky.querySelector(".mStickyInterior");
		if (mStickyInterior) {
			var lines = [];
			lines.push(CIQ.capitalize(this.name));
			if (this.getYValue)
				lines.push(this.field || this.stx.defaultPlotField || "Close");
			lines.push(mStickyInterior.innerHTML);
			mStickyInterior.innerHTML = lines.join("<br>");
		}
	}
};

CIQ.Drawing.BaseTwoPoint.prototype.reposition = function (
	context,
	repositioner,
	tick,
	value
) {
	if (!repositioner) return;
	var panel = this.stx.panels[this.panelName];
	var tickDiff = repositioner.tick - tick;
	var valueDiff = repositioner.value - value;
	if (repositioner.action == "move") {
		this.setPoint(
			0,
			repositioner.p0[0] - tickDiff,
			repositioner.p0[1] - valueDiff,
			panel.chart
		);
		this.setPoint(
			1,
			repositioner.p1[0] - tickDiff,
			repositioner.p1[1] - valueDiff,
			panel.chart
		);
		this.render(context);
	} else if (repositioner.action == "drag") {
		this[repositioner.point] = [tick, value];
		this.setPoint(0, this.p0[0], this.p0[1], panel.chart);
		this.setPoint(1, this.p1[0], this.p1[1], panel.chart);
		this.render(context);
	}
};

CIQ.Drawing.BaseTwoPoint.prototype.drawDropZone = function (
	context,
	hBound1,
	hBound2,
	leftBound,
	rightBound
) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	var x0 = panel.left;
	var x1 = panel.width;
	if (leftBound || leftBound === 0)
		x0 = this.stx.pixelFromTick(leftBound, panel.chart);
	if (rightBound || rightBound === 0)
		x1 = this.stx.pixelFromTick(rightBound, panel.chart);
	var y0 = this.stx.pixelFromPrice(hBound1, panel);
	var y1 = this.stx.pixelFromPrice(hBound2, panel);
	context.fillStyle = "#008000";
	context.globalAlpha = 0.2;
	context.fillRect(x0, y0, x1 - x0, y1 - y0);
	context.globalAlpha = 1;
};

/**
 * Annotation drawing tool. An annotation is a simple text tool. It uses the class stx_annotation
 * to determine the font style and color for the annotation. Class stx_annotation_highlight_bg is used to
 * determine the background color when highlighted.
 *
 * The controls controls.annotationSave and controls.annotationCancel are used to create HTMLElements for
 * saving and canceling the annotation while editing. A textarea is created dynamically. The annotation tool
 * attempts to draw the annotations at the same size and position as the textarea so that the effect is wysiwig.
 * @constructor
 * @name  CIQ.Drawing.annotation
 * @see {@link CIQ.Drawing.BaseTwoPoint}
 */
CIQ.Drawing.annotation = function () {
	this.name = "annotation";
	this.arr = [];
	this.w = 0;
	this.h = 0;
	this.padding = 4;
	this.text = "";
	this.ta = null;
	this.fontSize = 0;
	this.font = {};
};
CIQ.inheritsFrom(CIQ.Drawing.annotation, CIQ.Drawing.BaseTwoPoint);

CIQ.Drawing.annotation.prototype.getFontString = function () {
	this.fontDef = {
		style: null,
		weight: null,
		size: "12px",
		family: null
	};
	var css = this.stx.canvasStyle("stx_annotation");
	if (css) {
		if (css.fontStyle) this.fontDef.style = css.fontStyle;
		if (css.fontWeight) this.fontDef.weight = css.fontWeight;
		if (css.fontSize) this.fontDef.size = css.fontSize;
		if (css.fontFamily) this.fontDef.family = css.fontFamily;
	}
	if (this.font.style) this.fontDef.style = this.font.style;
	if (this.font.weight) this.fontDef.weight = this.font.weight;
	if (this.font.size) this.fontDef.size = this.font.size;
	if (this.font.family) this.fontDef.family = this.font.family;
	this.fontString = "";
	var first = true;
	for (var n in this.fontDef) {
		if (this.fontDef[n]) {
			if (!first) {
				this.fontString += " ";
			} else {
				first = false;
			}
			this.fontString += this.fontDef[n];
		}
	}
};

CIQ.Drawing.annotation.prototype.configs = ["color", "font"];

CIQ.Drawing.annotation.prototype.measure = function () {};

CIQ.Drawing.annotation.prototype.render = function (context) {
	if (this.ta) return;
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);

	context.font = this.fontString;
	context.textBaseline = "middle";
	var x = x0;
	var y = y0;
	var w = this.w;
	var h = this.h;

	var color = this.getLineColor();
	if (this.stem) {
		var sx0, sx1, sy0, sy1;
		if (this.stem.d) {
			// absolute positioning of stem
			sx0 = this.stx.pixelFromTick(this.stem.t); // bottom of stem
			sy0 = this.stx.pixelFromValueAdjusted(panel, this.stem.t, this.stem.v);
			sx1 = x + w / 2; // center of text
			sy1 = y + h / 2;
		} else if (this.stem.x) {
			// stem with relative offset positioning
			sx0 = x;
			sy0 = y;
			x += this.stem.x;
			y += this.stem.y;
			sx1 = x + w / 2;
			sy1 = y + h / 2;
		}

		context.beginPath();
		if (this.borderColor) context.strokeStyle = this.borderColor;
		else context.strokeStyle = color;
		context.moveTo(sx0, sy0);
		context.lineTo(sx1, sy1);
		context.stroke();
	}
	var lineWidth = context.lineWidth;
	if (this.highlighted) {
		this.stx.canvasColor("stx_annotation_highlight_bg", context);
		context.fillRect(
			x - lineWidth,
			y - h / 2 - lineWidth,
			w + 2 * lineWidth,
			h + 2 * lineWidth
		);
	} else {
		if (this.fillColor) {
			context.fillStyle = this.fillColor;
			context.fillRect(x, y - h / 2, w, h);
		} else if (this.stem) {
			// If there's a stem then use the container color otherwise the stem will show through
			context.fillStyle = this.stx.containerColor;
			context.fillRect(x, y - h / 2, w, h);
		}
	}
	if (this.borderColor) {
		context.beginPath();
		context.strokeStyle = this.highlighted
			? this.stx.getCanvasColor("stx_highlight_vector")
			: this.borderColor;
		context.rect(
			x - lineWidth,
			y - h / 2 - lineWidth,
			w + 2 * lineWidth,
			h + 2 * lineWidth
		);
		context.stroke();
	}

	if (this.highlighted) {
		this.stx.canvasColor("stx_annotation_highlight", context);
	} else {
		context.fillStyle = color;
	}
	y += this.padding / 2;
	if (!this.ta) {
		for (var i = 0; i < this.arr.length; i++) {
			context.fillText(
				this.arr[i],
				x + this.padding,
				y - h / 2 + this.fontSize / 2
			);
			y += this.fontSize + 2; // 2 px space between lines
		}
	}
	context.textBaseline = "alphabetic";
};

CIQ.Drawing.annotation.prototype.onChange = function (e) {
	//no operation. Override if you want to capture the change.
};

CIQ.Drawing.annotation.prototype.edit = function (context, editExisting) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	// When mouse events are attached to the container then any dom objects on top
	// of the container will intercept those events. In particular, the textarea for
	// annotations gets in the way, so here we capture the mouseup that fires on the textarea
	// and pass it along to the kernel if necessary
	function handleTAMouseUp(stx) {
		return function (e) {
			if (stx.manageTouchAndMouse && CIQ.ChartEngine.drawingLine) {
				stx.mouseup(e);
			}
		};
	}

	function cancelAnnotation(self) {
		return function (e) {
			var stx = self.stx;
			stx.editingAnnotation = false;
			stx.undo();
			stx.cancelTouchSingleClick = true;
		};
	}
	function saveAnnotation(self) {
		return function (e) {
			if (self.ta.value === "") return;
			self.text = self.ta.value;
			var stx = self.stx;
			stx.editingAnnotation = false;
			self.adjust();
			if (stx.drawingSnapshot)
				stx.undoStamp(
					CIQ.shallowClone(stx.drawingSnapshot),
					stx.exportDrawings()
				);
			else stx.addDrawing(self); // add only if it's not already there (text being modified)
			stx.undo();
			stx.cancelTouchSingleClick = true;
			stx.changeOccurred("vector");
		};
	}

	function resizeAnnotation(self) {
		return function (e) {
			if (e) {
				var key = e.keyCode;
				switch (key) {
					case 27:
						self.stx.undo();
						return;
				}
			}
			var stx = self.stx;
			var ta = self.ta;
			var arr = ta.value.split("\n");
			var w = 0;
			//stx.canvasFont("stx_annotation");
			stx.chart.context.font = self.fontString;
			for (var i = 0; i < arr.length; i++) {
				var m = stx.chart.context.measureText(arr[i]).width;
				if (m > w) w = m;
			}
			var h = (arr.length + 1) * (self.fontSize + 3);
			if (w < 50) w = 50;
			ta.style.width = w + 30 + "px"; // Leave room for scroll bar
			ta.style.height = h + "px";
			var y = parseInt(CIQ.stripPX(ta.style.top), 10);
			var x = CIQ.stripPX(ta.style.left);
			w = ta.clientWidth;
			h = ta.clientHeight;
			if (x + w + 100 < self.stx.chart.canvasWidth) {
				save.style.top = y + "px";
				cancel.style.top = y + "px";
				save.style.left = x + w + 10 + "px";
				cancel.style.left = x + w + 60 + "px";
			} else if (y + h + 30 < self.stx.chart.canvasHeight) {
				save.style.top = y + h + 10 + "px";
				cancel.style.top = y + h + 10 + "px";
				save.style.left = x + "px";
				cancel.style.left = x + 50 + "px";
			} else {
				save.style.top = y - 35 + "px";
				cancel.style.top = y - 35 + "px";
				save.style.left = x + "px";
				cancel.style.left = x + 50 + "px";
			}
		};
	}

	var save = this.stx.controls.annotationSave;
	var cancel = this.stx.controls.annotationCancel;
	if (!save || !cancel) return;

	var stx = this.stx,
		ta = this.ta;
	stx.editingAnnotation = true;
	stx.undisplayCrosshairs();
	stx.openDialog = "annotation";
	if (!ta) {
		ta = this.ta = document.createElement("TEXTAREA");
		ta.className = "stx_annotation";
		ta.onkeyup = resizeAnnotation(this);
		ta.onmouseup = handleTAMouseUp(stx);
		ta.setAttribute("wrap", "hard");
		if (CIQ.isIOS7or8) ta.setAttribute("placeholder", "Enter Text");
		stx.chart.container.appendChild(ta);
		ta.style.position = "absolute";
		ta.style.width = "100px";
		ta.style.height = "20px";
		ta.value = this.text;
		if (CIQ.touchDevice) {
			ta.ontouchstart = function (e) {
				e.stopPropagation();
			};
			/*var ta=this.ta;
				CIQ.safeClickTouch(this.ta, function(e){
					if(document.activeElement===ta){
							window.focus();
							CIQ.focus(ta, true);
					}
				});*/
		}
	}
	var self = this;
	ta.oninput = function (e) {
		// disable browser undo history due to hidden textarea with contenteditable
		if (e.inputType != "historyUndo" && e.inputType != "historyRedo")
			self.onChange(e);
	};
	ta.style.font = this.fontString;
	if (this.color) {
		if (this.color == "transparent" || this.color == "auto") {
			var styles = getComputedStyle(ta);
			if (styles && CIQ.isTransparent(styles.backgroundColor)) {
				ta.style.color = stx.defaultColor;
			} else {
				ta.style.color = "#000"; // text area always has white background
			}
		} else {
			ta.style.color = this.color;
		}
	}
	var x0 = stx.pixelFromTick(this.p0[0], panel.chart);
	var y0 = stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	//if the right edge of the ta is off of the screen, scootch it to the left.
	ta.style.left =
		x0 + 140 < stx.chart.canvasRight
			? x0 + "px"
			: stx.chart.canvasRight - 200 + "px";
	//if user clicks within 60 px of bottom of the chart,scootch it up.
	ta.style.top =
		y0 + 60 < stx.chart.canvasHeight
			? y0 - (!isNaN(this.h) ? this.h / 2 : this.defaultHeight) + "px"
			: y0 - 60 + "px";
	if (this.name == "callout") {
		ta.style.left =
			CIQ.stripPX(ta.style.left) -
			(!isNaN(this.w) ? this.w / 2 : this.defaultWidth) +
			"px";
	}

	CIQ.safeClickTouch(save, saveAnnotation(this));
	CIQ.safeClickTouch(cancel, cancelAnnotation(this));
	resizeAnnotation(this)();
	save.style.display = "inline-block";
	cancel.style.display = "inline-block";

	if (editExisting) {
		// lift the drawing off the canvas and onto the tempCanvas
		stx.drawingSnapshot = stx.exportDrawings();
		this.hidden = true;
		stx.draw();
		stx.activeDrawing = this;
		CIQ.ChartEngine.drawingLine = true;
		context = stx.chart.tempCanvas.context;
		stx.chart.tempCanvas.style.display = "block";
		this.w = ta.clientWidth;
		this.h = ta.clientHeight;
		CIQ.clearCanvas(context.canvas, stx);
		this.render(context);
		this.edit(context);
	}

	ta.focus();

	if (CIQ.isAndroid && !CIQ.is_chrome && !CIQ.isFF) {
		// Android soft keyboard will cover up the lower half of the browser so if our
		// annotation is in that area we temporarily scroll the chart container upwards
		// The style.bottom of the chart container is reset in abort()
		this.priorBottom = stx.chart.container.style.bottom;
		var keyboardHeight = 400; // hard coded. We could get this by measuring the change in innerHeight but timing is awkward because the keyboard scrolls
		var screenLocation = stx.resolveY(y0) + 100; // figure 100 pixels of height for text
		if (screenLocation > CIQ.pageHeight() - keyboardHeight) {
			var pixelsFromBottomOfScreen = CIQ.pageHeight() - screenLocation;
			var scrolledBottom = keyboardHeight - pixelsFromBottomOfScreen;
			stx.chart.container.style.bottom = scrolledBottom + "px";
		}
	}
};

CIQ.Drawing.annotation.prototype.click = function (context, tick, value) {
	//don't allow user to add annotation on the axis.
	if (this.stx.overXAxis || this.stx.overYAxis) return;
	var panel = this.stx.panels[this.panelName];
	this.copyConfig();
	//this.getFontString();
	this.setPoint(0, tick, value, panel.chart);
	this.adjust();

	this.edit(context);
	return false;
};

CIQ.Drawing.annotation.prototype.reposition = function (
	context,
	repositioner,
	tick,
	value
) {
	if (!repositioner) return;
	var panel = this.stx.panels[this.panelName];
	var tickDiff = repositioner.tick - tick;
	var valueDiff = repositioner.value - value;
	this.setPoint(
		0,
		repositioner.p0[0] - tickDiff,
		repositioner.p0[1] - valueDiff,
		panel.chart
	);
	this.render(context);
};

CIQ.Drawing.annotation.prototype.intersected = function (tick, value, box) {
	var panel = this.stx.panels[this.panelName];
	if (!this.p0) return null; // in case invalid drawing (such as from panel that no longer exists)
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var y0 =
		this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]) - this.h / 2;
	var x1 = x0 + this.w;
	var y1 = y0 + this.h;
	if (this.stem && this.stem.x) {
		x0 += this.stem.x;
		x1 += this.stem.x;
		y0 += this.stem.y;
		y1 += this.stem.y;
	}
	var x = this.stx.pixelFromTick(tick, panel.chart);
	var y = this.stx.pixelFromValueAdjusted(panel, tick, value);

	if (
		x + box.r >= x0 &&
		x - box.r <= x1 &&
		y + box.r >= y0 &&
		y - box.r <= y1
	) {
		this.highlighted = true;
		return {
			p0: CIQ.clone(this.p0),
			tick: tick,
			value: value
		};
	}
	return false;
};

CIQ.Drawing.annotation.prototype.abort = function () {
	var save = this.stx.controls.annotationSave,
		cancel = this.stx.controls.annotationCancel;
	if (save) save.style.display = "none";
	if (cancel) cancel.style.display = "none";
	if (this.ta) this.stx.chart.container.removeChild(this.ta);
	this.ta = null;
	this.stx.openDialog = "";
	this.stx.showCrosshairs();
	//document.body.style.cursor="crosshair"; //Was interfering with undisplayCrosshairs().
	this.stx.editingAnnotation = false;
	CIQ.clearCanvas(this.stx.chart.tempCanvas, this.stx);
	if (CIQ.isAndroid && !CIQ.is_chrome && !CIQ.isFF) {
		this.stx.chart.container.style.bottom = this.priorBottom;
	}
	CIQ.fixScreen();
};

/**
 * Reconstruct an annotation
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object}[obj] A drawing descriptor
 * @param {string} [obj.col] The text color for the annotation
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.d0] String form date or date time
 * @param {number} [obj.v0] The value at which to position the annotation
 * @param {string} [obj.text] The annotation text (escaped using encodeURIComponent())
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @param {string} [obj.bc] Border color
 * @param {string} [obj.bg] Background color
 * @param {string} [obj.lw] Line width
 * @param {string} [obj.ptrn] Line pattern
 * @param {object} [obj.fnt] Font
 * @param {object} [obj.fnt.st] Font style
 * @param {object} [obj.fnt.sz] Font size
 * @param {object} [obj.fnt.wt] Font weight
 * @param {object} [obj.fnt.fl] Font family
 * @memberOf CIQ.Drawing.annotation
 */
CIQ.Drawing.annotation.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.panelName = obj.pnl;
	this.d0 = obj.d0;
	this.tzo0 = obj.tzo0;
	this.v0 = obj.v0;
	this.text = stx.escapeOnSerialize ? decodeURIComponent(obj.text) : obj.text;
	this.stem = obj.stem;
	this.borderColor = obj.bc;
	this.fillColor = obj.bg;
	this.lineWidth = obj.lw;
	this.pattern = obj.ptrn;
	this.font = CIQ.replaceFields(obj.fnt, {
		st: "style",
		sz: "size",
		wt: "weight",
		fl: "family"
	});
	if (!this.font) this.font = {};
	this.adjust();
};

CIQ.Drawing.annotation.prototype.serialize = function () {
	var obj = {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		d0: this.d0,
		tzo0: this.tzo0,
		v0: this.v0,
		text: this.stx.escapeOnSerialize ? encodeURIComponent(this.text) : this.text
	};
	if (this.font) {
		var fnt = CIQ.removeNullValues(
			CIQ.replaceFields(this.font, {
				style: "st",
				size: "sz",
				weight: "wt",
				family: "fl"
			})
		);
		if (!CIQ.isEmpty(fnt)) obj.fnt = fnt;
	}
	if (this.stem) {
		obj.stem = {
			d: this.stem.d,
			v: this.stem.v,
			x: this.stem.x,
			y: this.stem.y
		};
	}
	if (this.borderColor) obj.bc = this.borderColor;
	if (this.fillColor) obj.bg = this.fillColor;
	if (this.lineWidth) obj.lw = this.lineWidth;
	if (this.pattern) obj.ptrn = this.pattern;

	return obj;
};

CIQ.Drawing.annotation.prototype.renderText = function () {
	this.getFontString();
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.arr = this.text.split("\n");
	var w = 0;
	this.stx.chart.context.font = this.fontString;
	//this.stx.canvasFont("stx_annotation");
	for (var i = 0; i < this.arr.length; i++) {
		var m = this.stx.chart.context.measureText(this.arr[i]).width;
		if (m > w) w = m;
	}
	if (w === 0) w = 2 * this.defaultWidth;
	//this.fontSize=this.stx.getCanvasFontSize("stx_annotation");
	this.fontSize = CIQ.stripPX(this.fontDef.size);
	var h = this.arr.length * (this.fontSize + 2); // 2 px space to separate lines
	if (CIQ.touchDevice) h += 5;
	this.w = w + this.padding * 2;
	this.h = h + this.padding * 2;
	var x1 = this.stx.pixelFromTick(this.p0[0], panel.chart) + w;
	var y1 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]) + h;
	this.p1 = [
		this.stx.tickFromPixel(x1, panel.chart),
		this.stx.valueFromPixel(y1, panel)
	];
	if (this.stem && this.stem.d) {
		this.stem.t = this.stx.tickFromDate(this.stem.d, panel.chart);
	}
};

CIQ.Drawing.annotation.prototype.adjust = function () {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.renderText();
};

/**
 * segment is an implementation of a {@link CIQ.Drawing.BaseTwoPoint} drawing.
 * @name CIQ.Drawing.segment
 * @constructor
 */
CIQ.Drawing.segment = function () {
	this.name = "segment";
};

CIQ.inheritsFrom(CIQ.Drawing.segment, CIQ.Drawing.BaseTwoPoint);

CIQ.Drawing.segment.prototype.render = function (context) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

	var width = this.lineWidth;
	var color = this.getLineColor();

	var parameters = {
		pattern: this.pattern,
		lineWidth: width
	};
	if (parameters.pattern == "none") parameters.pattern = "solid";
	this.stx.plotLine(
		x0,
		x1,
		y0,
		y1,
		color,
		this.name,
		context,
		panel,
		parameters
	);

	if (this.axisLabel && !this.repositioner) {
		if (this.name == "horizontal") {
			this.stx.endClip();
			var txt = this.p0[1];
			if (panel.chart.transformFunc)
				txt = panel.chart.transformFunc(this.stx, panel.chart, txt);
			if (panel.yAxis.priceFormatter)
				txt = panel.yAxis.priceFormatter(this.stx, panel, txt);
			else txt = this.stx.formatYAxisPrice(txt, panel);
			this.stx.createYAxisLabel(panel, txt, y0, color);
			this.stx.startClip(panel.name);
		} else if (
			this.name == "vertical" &&
			this.p0[0] >= 0 &&
			!this.stx.chart.xAxis.noDraw
		) {
			// don't try to compute dates from before dataSet
			var dt, newDT;
			dt = this.stx.dateFromTick(this.p0[0], panel.chart, true);
			if (!CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval)) {
				var milli = dt.getSeconds() * 1000 + dt.getMilliseconds();
				if (timezoneJS.Date && this.stx.displayZone) {
					// this converts from the quote feed timezone to the chart specified time zone
					newDT = new timezoneJS.Date(dt.getTime(), this.stx.displayZone);
					dt = new Date(
						newDT.getFullYear(),
						newDT.getMonth(),
						newDT.getDate(),
						newDT.getHours(),
						newDT.getMinutes()
					);
					dt = new Date(dt.getTime() + milli);
				}
			} else {
				dt.setHours(0, 0, 0, 0);
			}
			var myDate = CIQ.mmddhhmm(CIQ.yyyymmddhhmm(dt));

			if (panel.chart.xAxis.formatter) {
				myDate = panel.chart.xAxis.formatter(dt, this.name, null, null, myDate);
			} else if (this.stx.internationalizer) {
				var str;
				if (dt.getHours() !== 0 || dt.getMinutes() !== 0) {
					str = this.stx.internationalizer.monthDay.format(dt);
					str += " " + this.stx.internationalizer.hourMinute.format(dt);
				} else {
					str = this.stx.internationalizer.yearMonthDay.format(dt);
				}
				myDate = str;
			}

			this.stx.endClip();
			this.stx.createXAxisLabel(panel, myDate, x0, color, null, true);
			this.stx.startClip(panel.name);
		}
	}
	if (
		this.highlighted &&
		this.name != "horizontal" &&
		this.name != "vertical"
	) {
		var p0Fill = this.highlighted == "p0" ? true : false;
		var p1Fill = this.highlighted == "p1" ? true : false;
		this.littleCircle(context, x0, y0, p0Fill);
		this.littleCircle(context, x1, y1, p1Fill);
	}
};

CIQ.Drawing.segment.prototype.abort = function () {
	this.stx.setMeasure(null, null, null, null, false);
};

CIQ.Drawing.segment.prototype.intersected = function (tick, value, box) {
	if (!this.p0 || !this.p1) return null; // in case invalid drawing (such as from panel that no longer exists)
	var name = this.name;
	if (name != "horizontal" && name != "vertical" && name != "gartley") {
		var pointsToCheck = { 0: this.p0, 1: this.p1 };
		for (var pt in pointsToCheck) {
			if (
				this.pointIntersection(pointsToCheck[pt][0], pointsToCheck[pt][1], box)
			) {
				this.highlighted = "p" + pt;
				return {
					action: "drag",
					point: "p" + pt
				};
			}
		}
	}
	if (name == "horizontal" || name == "vertical") name = "line";
	var isIntersected = this.lineIntersection(tick, value, box, name);
	if (isIntersected) {
		this.highlighted = true;
		// This object will be used for repositioning
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1),
			tick: tick, // save original tick
			value: value // save original value
		};
	}
	return null;
};

CIQ.Drawing.segment.prototype.configs = ["color", "lineWidth", "pattern"];

CIQ.Drawing.segment.prototype.copyConfig = function (withPreferences) {
	CIQ.Drawing.copyConfig(this, withPreferences);
	if (this.pattern == "none" && this.configs.indexOf("fillColor") == -1)
		this.pattern = "solid";
};

/**
 * Reconstruct a segment
 * @memberOf CIQ.Drawing.segment
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object} [obj] A drawing descriptor
 * @param {string} [obj.col] The line color
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.ptrn] Optional pattern for line "solid","dotted","dashed". Defaults to solid.
 * @param {number} [obj.lw] Optional line width. Defaults to 1.
 * @param {number} [obj.v0] Value (price) for the first point
 * @param {number} [obj.v1] Value (price) for the second point
 * @param {number} [obj.d0] Date (string form) for the first point
 * @param {number} [obj.d1] Date (string form) for the second point
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
 */
CIQ.Drawing.segment.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.panelName = obj.pnl;
	this.pattern = obj.ptrn;
	this.lineWidth = obj.lw;
	this.d0 = obj.d0;
	this.d1 = obj.d1;
	this.tzo0 = obj.tzo0;
	this.tzo1 = obj.tzo1;
	this.v0 = obj.v0;
	this.v1 = obj.v1;
	this.adjust();
};

CIQ.Drawing.segment.prototype.serialize = function () {
	return {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		ptrn: this.pattern,
		lw: this.lineWidth,
		d0: this.d0,
		d1: this.d1,
		tzo0: this.tzo0,
		tzo1: this.tzo1,
		v0: this.v0,
		v1: this.v1
	};
};

/**
 * Line drawing tool. A line is a vector defined by two points that is infinite in both directions.
 *
 * It inherits its properties from {@link CIQ.Drawing.segment}.
 * @constructor
 * @name  CIQ.Drawing.line
 */
CIQ.Drawing.line = function () {
	this.name = "line";
};

CIQ.inheritsFrom(CIQ.Drawing.line, CIQ.Drawing.segment);

CIQ.Drawing.line.prototype.dragToDraw = false;

CIQ.Drawing.line.prototype.calculateOuterSet = function (panel) {
	if (
		this.p0[0] == this.p1[0] ||
		this.p0[1] == this.p1[1] ||
		CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval)
	) {
		return;
	}

	var vector = {
		x0: this.p0[0],
		y0: this.p0[1],
		x1: this.p1[0],
		y1: this.p1[1]
	};
	if (vector.x0 > vector.x1) {
		vector = {
			x0: this.p1[0],
			y0: this.p1[1],
			x1: this.p0[0],
			y1: this.p0[1]
		};
	}

	var earlier = vector.x0 - 1000;
	var later = vector.x1 + 1000;

	this.v0B = CIQ.yIntersection(vector, earlier);
	this.v1B = CIQ.yIntersection(vector, later);
	this.d0B = this.stx.dateFromTick(earlier, panel.chart);
	this.d1B = this.stx.dateFromTick(later, panel.chart);
};

CIQ.Drawing.line.prototype.click = function (context, tick, value) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.copyConfig();
	if (!this.penDown) {
		this.setPoint(0, tick, value, panel.chart);
		this.penDown = true;
		return false;
	}
	// if the user accidentally double clicks in rapid fashion
	if (this.accidentalClick(tick, value)) return this.dragToDraw;
	this.setPoint(1, tick, value, panel.chart);
	this.calculateOuterSet(panel);
	this.penDown = false;
	return true; // kernel will call render after this
};

/**
 * Reconstruct a line
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object} [obj] A drawing descriptor
 * @param {string} [obj.col] The line color
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.ptrn] Optional pattern for line "solid","dotted","dashed". Defaults to solid.
 * @param {number} [obj.lw] Optional line width. Defaults to 1.
 * @param {number} [obj.v0] Value (price) for the first point
 * @param {number} [obj.v1] Value (price) for the second point
 * @param {number} [obj.d0] Date (string form) for the first point
 * @param {number} [obj.d1] Date (string form) for the second point
 * @param {number} [obj.v0B] Computed outer Value (price) for the first point if original drawing was on intraday but now displaying on daily
 * @param {number} [obj.v1B] Computed outer Value (price) for the second point if original drawing was on intraday but now displaying on daily
 * @param {number} [obj.d0B] Computed outer Date (string form) for the first point if original drawing was on intraday but now displaying on daily
 * @param {number} [obj.d1B] Computed outer Date (string form) for the second point if original drawing was on intraday but now displaying on daily
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
 * @memberOf CIQ.Drawing.line
 */
CIQ.Drawing.line.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.panelName = obj.pnl;
	this.pattern = obj.ptrn;
	this.lineWidth = obj.lw;
	this.v0 = obj.v0;
	this.v1 = obj.v1;
	this.d0 = obj.d0;
	this.d1 = obj.d1;
	this.tzo0 = obj.tzo0;
	this.tzo1 = obj.tzo1;
	if (obj.d0B) {
		this.d0B = obj.d0B;
		this.d1B = obj.d1B;
		this.v0B = obj.v0B;
		this.v1B = obj.v1B;
	}
	this.adjust();
};

CIQ.Drawing.line.prototype.serialize = function () {
	var obj = {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		ptrn: this.pattern,
		lw: this.lineWidth,
		d0: this.d0,
		d1: this.d1,
		tzo0: this.tzo0,
		tzo1: this.tzo1,
		v0: this.v0,
		v1: this.v1
	};
	if (this.d0B) {
		obj.d0B = this.d0B;
		obj.d1B = this.d1B;
		obj.v0B = this.v0B;
		obj.v1B = this.v1B;
	}
	return obj;
};

CIQ.Drawing.line.prototype.adjust = function () {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.setPoint(1, this.d1, this.v1, panel.chart);
	// Use outer set if original drawing was on intraday but now displaying on daily
	if (CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval) && this.d0B) {
		this.setPoint(0, this.d0B, this.v0B, panel.chart);
		this.setPoint(1, this.d1B, this.v1B, panel.chart);
	}
};

/**
 * Horizontal line drawing tool. The horizontal line extends infinitely in both directions.
 *
 * It inherits its properties from {@link CIQ.Drawing.segment}
 * @constructor
 * @name  CIQ.Drawing.horizontal
 */
CIQ.Drawing.horizontal = function () {
	this.name = "horizontal";
};
CIQ.inheritsFrom(CIQ.Drawing.horizontal, CIQ.Drawing.segment);

CIQ.Drawing.horizontal.prototype.dragToDraw = false;

CIQ.Drawing.horizontal.prototype.measure = function () {};

CIQ.Drawing.horizontal.prototype.click = function (context, tick, value) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.copyConfig();
	this.setPoint(0, tick, value, panel.chart);
	return true; // kernel will call render after this
};

// skips point interection and forces positioner points inside of the dataSet
CIQ.Drawing.horizontal.prototype.intersected = function (tick, value, box) {
	if (this.lineIntersection(tick, value, box, "line")) {
		var stx = this.stx;
		var t0 = stx.chart.dataSet.length;
		var v0 = this.p0[1];

		this.highlighted = true;

		return {
			action: "move",
			p0: [t0 - 2, v0],
			p1: [t0 - 1, v0],
			tick: tick,
			value: value
		};
	}

	return null;
};

/**
 * Reconstruct a horizontal
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object} [obj] A drawing descriptor
 * @param {string} [obj.col] The line color
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.ptrn] Optional pattern for line "solid","dotted","dashed". Defaults to solid.
 * @param {number} [obj.lw] Optional line width. Defaults to 1.
 * @param {number} [obj.v0] Value (price) for the first point
 * @param {number} [obj.d0] Date (string form) for the first point
 * @param {boolean} [obj.al] True to include an axis label
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @memberOf CIQ.Drawing.horizontal
 */
CIQ.Drawing.horizontal.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.panelName = obj.pnl;
	this.pattern = obj.ptrn;
	this.lineWidth = obj.lw;
	this.v0 = obj.v0;
	this.d0 = obj.d0;
	this.tzo0 = obj.tzo0;
	this.axisLabel = obj.al;
	this.adjust();
};

CIQ.Drawing.horizontal.prototype.serialize = function () {
	var obj = {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		ptrn: this.pattern,
		lw: this.lineWidth,
		v0: this.v0,
		d0: this.d0,
		tzo0: this.tzo0,
		al: this.axisLabel
	};

	return obj;
};

CIQ.Drawing.horizontal.prototype.adjust = function () {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.p1 = [this.p0[0] + 100, this.p0[1]];
};

CIQ.Drawing.horizontal.prototype.configs = [
	"color",
	"lineWidth",
	"pattern",
	"axisLabel"
];

/**
 * Vertical line drawing tool. The vertical line extends infinitely in both directions.
 *
 * It inherits its properties from {@link CIQ.Drawing.horizontal}.
 * @constructor
 * @name  CIQ.Drawing.vertical
 */
CIQ.Drawing.vertical = function () {
	this.name = "vertical";
};

CIQ.inheritsFrom(CIQ.Drawing.vertical, CIQ.Drawing.horizontal);
CIQ.Drawing.vertical.prototype.measure = function () {};

// override specialized horizontal method
CIQ.Drawing.vertical.prototype.intersected =
	CIQ.Drawing.segment.prototype.intersected;

CIQ.Drawing.vertical.prototype.adjust = function () {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.p1 = [this.p0[0], this.p0[1] + 1];
};

/**
 * Measure tool.
 * It inherits its properties from {@link CIQ.Drawing.segment}.
 * @constructor
 * @name  CIQ.Drawing.measure
 */
CIQ.Drawing.measure = function () {
	this.name = "measure";
};

CIQ.inheritsFrom(CIQ.Drawing.measure, CIQ.Drawing.segment);

CIQ.Drawing.measure.prototype.click = function (context, tick, value) {
	this.copyConfig();
	if (!this.penDown) {
		this.p0 = [tick, value];
		this.penDown = true;

		return false;
	}
	this.stx.undo();
	this.penDown = false;
	return true;
};

/**
 * rectangle is an implementation of a {@link CIQ.Drawing.BaseTwoPoint} drawing
 * @constructor
 * @name  CIQ.Drawing.rectangle
 */
CIQ.Drawing.rectangle = function () {
	this.name = "rectangle";
};

CIQ.inheritsFrom(CIQ.Drawing.rectangle, CIQ.Drawing.BaseTwoPoint);

CIQ.Drawing.rectangle.prototype.render = function (context) {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

	var x = Math.round(Math.min(x0, x1)) + 0.5;
	var y = Math.min(y0, y1);
	var width = Math.max(x0, x1) - x;
	var height = Math.max(y0, y1) - y;
	var edgeColor = this.color;
	if (this.highlighted) {
		edgeColor = this.stx.getCanvasColor("stx_highlight_vector");
	}

	var fillColor = this.fillColor;
	if (fillColor && !CIQ.isTransparent(fillColor) && fillColor != "auto") {
		context.beginPath();
		context.rect(x, y, width, height);
		context.fillStyle = fillColor;
		context.globalAlpha = 0.2;
		context.fill();
		context.closePath();
		context.globalAlpha = 1;
	}

	var parameters = {
		pattern: this.pattern,
		lineWidth: this.lineWidth
	};
	if (this.highlighted && parameters.pattern == "none") {
		parameters.pattern = "solid";
		if (parameters.lineWidth == 0.1) parameters.lineWidth = 1;
	}

	// We extend the vertical lines by .5 to account for displacement of the horizontal lines
	// HTML5 Canvas exists *between* pixels, not on pixels, so draw on .5 to get crisp lines
	this.stx.plotLine(
		x0,
		x1,
		y0,
		y0,
		edgeColor,
		"segment",
		context,
		panel,
		parameters
	);
	this.stx.plotLine(
		x1,
		x1,
		y0 - 0.5,
		y1 + 0.5,
		edgeColor,
		"segment",
		context,
		panel,
		parameters
	);
	this.stx.plotLine(
		x1,
		x0,
		y1,
		y1,
		edgeColor,
		"segment",
		context,
		panel,
		parameters
	);
	this.stx.plotLine(
		x0,
		x0,
		y1 + 0.5,
		y0 - 0.5,
		edgeColor,
		"segment",
		context,
		panel,
		parameters
	);
	if (this.highlighted) {
		var p0Fill = this.highlighted == "p0" ? true : false;
		var p1Fill = this.highlighted == "p1" ? true : false;
		this.littleCircle(context, x0, y0, p0Fill);
		this.littleCircle(context, x1, y1, p1Fill);
	}
};

CIQ.Drawing.rectangle.prototype.intersected = function (tick, value, box) {
	if (!this.p0 || !this.p1) return null; // in case invalid drawing (such as from panel that no longer exists)
	var pointsToCheck = { 0: this.p0, 1: this.p1 };
	for (var pt in pointsToCheck) {
		if (
			this.pointIntersection(pointsToCheck[pt][0], pointsToCheck[pt][1], box)
		) {
			this.highlighted = "p" + pt;
			return {
				action: "drag",
				point: "p" + pt
			};
		}
	}
	if (this.boxIntersection(tick, value, box)) {
		this.highlighted = true;
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1),
			tick: tick,
			value: value
		};
	}
	return null;
};

CIQ.Drawing.rectangle.prototype.configs = [
	"color",
	"fillColor",
	"lineWidth",
	"pattern"
];

/**
 * Reconstruct an rectangle
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object} [obj] A drawing descriptor
 * @param {string} [obj.col] The border color
 * @param {string} [obj.fc] The fill color
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.ptrn] Optional pattern for line "solid","dotted","dashed". Defaults to solid.
 * @param {number} [obj.lw] Optional line width. Defaults to 1.
 * @param {number} [obj.v0] Value (price) for the first point
 * @param {number} [obj.v1] Value (price) for the second point
 * @param {number} [obj.d0] Date (string form) for the first point
 * @param {number} [obj.d1] Date (string form) for the second point
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
 * @memberOf CIQ.Drawing.rectangle
 */
CIQ.Drawing.rectangle.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.fillColor = obj.fc;
	this.panelName = obj.pnl;
	this.pattern = obj.ptrn;
	this.lineWidth = obj.lw;
	this.d0 = obj.d0;
	this.d1 = obj.d1;
	this.tzo0 = obj.tzo0;
	this.tzo1 = obj.tzo1;
	this.v0 = obj.v0;
	this.v1 = obj.v1;
	this.adjust();
};

CIQ.Drawing.rectangle.prototype.serialize = function () {
	return {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		fc: this.fillColor,
		ptrn: this.pattern,
		lw: this.lineWidth,
		d0: this.d0,
		d1: this.d1,
		tzo0: this.tzo0,
		tzo1: this.tzo1,
		v0: this.v0,
		v1: this.v1
	};
};

/**
 * shape is a default implementation of a {@link CIQ.Drawing.BaseTwoPoint} drawing
 * which places a "shape" on the canvas.  It can be rotated and/or stretched.
 * It is meant to be overridden with specific shape designs, such as arrows....
 * @constructor
 * @name  CIQ.Drawing.shape
 * @since 2015-11-1
 * @version ChartIQ Advanced Package
 */
CIQ.Drawing.shape = function () {
	this.name = "shape";
	this.radians = 0;
	this.a = 0;
	this.rotating = false;
	this.textMeasure = false;
	this.configurator = "shape"; //forces all derived classes to default to shape drawing tools
	this.dimension = [0, 0];
	this.points = [];
};

CIQ.inheritsFrom(CIQ.Drawing.shape, CIQ.Drawing.BaseTwoPoint);

/**
 * If true, enables rotation when the drawing is initially drawn.
 *
 * @type boolean
 * @default
 * @memberof CIQ.Drawing.shape
 * @since 7.4.0
 */
CIQ.Drawing.shape.prototype.setRotationOnInitialDraw = false;

CIQ.Drawing.shape.prototype.measure = function () {};

CIQ.Drawing.shape.prototype.render = function (context) {
	if (!this.points.length) return;
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	if (this.p1) {
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

		context.globalAlpha = 0.5;
		context.fillStyle = "#000000";
		if (this.rotating) {
			this.radians = Math.atan((y1 - y0) / (x1 - x0));
			if (x1 < x0) this.radians += Math.PI;
			else if (y1 < y0) this.radians += 2 * Math.PI;
			this.a = parseInt(((this.radians * 36) / Math.PI).toFixed(0), 10) * 5;
			this.a %= 360;
			this.radians = (this.a * Math.PI) / 180;
			if (this.textMeasure)
				context.fillText(this.a + "\u00b0", x1 + 10, y1 + 10);
		} else if (this.penDown) {
			this.sx = Math.max(
				1,
				parseFloat(Math.abs((2 * (x1 - x0)) / this.dimension[0]).toFixed(1))
			);
			if (x1 < x0) this.sx *= -1;
			this.sy = Math.max(
				1,
				parseFloat(Math.abs((2 * (y1 - y0)) / this.dimension[1]).toFixed(1))
			);
			if (y1 < y0) this.sy *= -1;
			if (this.textMeasure)
				context.fillText(
					this.sx + "x," + this.sy + "x",
					x1 + this.sx + 5,
					y1 + this.sy + 5
				);
		}
		context.globalAlpha = 1;
	}

	var lineWidth = this.lineWidth;
	if (!lineWidth) lineWidth = 1.1;

	var parameters = {
		pattern: this.pattern,
		lineWidth: lineWidth
	};
	if (this.highlighted && parameters.pattern == "none") {
		parameters.pattern = "solid";
		if (parameters.lineWidth == 0.1) parameters.lineWidth = 1;
	}
	var edgeColor = this.color;
	if (edgeColor == "auto" || CIQ.isTransparent(edgeColor))
		edgeColor = this.stx.defaultColor;
	if (this.highlighted) {
		edgeColor = this.stx.getCanvasColor("stx_highlight_vector");
		if (lineWidth == 0.1) lineWidth = 1.1;
	}
	var fillColor = this.fillColor;
	lineWidth /=
		(Math.abs(this.sx * this.sy) * 2) / (Math.abs(this.sx) + Math.abs(this.sy));

	context.save();
	context.translate(x0, y0);
	context.rotate(this.radians);
	context.scale(this.sx, panel.yAxis.flipped ? -this.sy : this.sy);

	var subshape, point;
	var origin = {
		x: (this.dimension[0] - 1) / 2,
		y: (this.dimension[1] - 1) / 2
	};
	for (subshape = 0; subshape < this.points.length; subshape++) {
		context.beginPath();
		for (point = 0; point < this.points[subshape].length; point++) {
			var x, y, cx1, cx2, cy1, cy2;
			if (this.points[subshape][point] == "M") {
				//move
				x = this.points[subshape][++point] - origin.x;
				y = this.points[subshape][++point] - origin.y;
				context.moveTo(x, y);
			} else if (this.points[subshape][point] == "L") {
				//line
				x = this.points[subshape][++point] - origin.x;
				y = this.points[subshape][++point] - origin.y;
				context.lineTo(x, y);
			} else if (this.points[subshape][point] == "Q") {
				//quadratic
				cx1 = this.points[subshape][++point] - origin.x;
				cy1 = this.points[subshape][++point] - origin.y;
				x = this.points[subshape][++point] - origin.x;
				y = this.points[subshape][++point] - origin.y;
				context.quadraticCurveTo(cx1, cy1, x, y);
			} else if (this.points[subshape][point] == "B") {
				//bezier
				cx1 = this.points[subshape][++point] - origin.x;
				cy1 = this.points[subshape][++point] - origin.y;
				cx2 = this.points[subshape][++point] - origin.x;
				cy2 = this.points[subshape][++point] - origin.y;
				x = this.points[subshape][++point] - origin.x;
				y = this.points[subshape][++point] - origin.y;
				context.bezierCurveTo(cx1, cy1, cx2, cy2, x, y);
			}
		}
		context.closePath();

		if (fillColor && !CIQ.isTransparent(fillColor) && fillColor != "auto") {
			//context.globalAlpha=0.4;
			context.fillStyle = fillColor;
			context.fill();
			//context.globalAlpha=1;
		}
		if (edgeColor && this.pattern != "none") {
			context.strokeStyle = edgeColor;
			context.lineWidth = lineWidth;
			if (context.setLineDash) {
				context.setLineDash(CIQ.borderPatternToArray(lineWidth, this.pattern));
				context.lineDashOffset = 0; //start point in array
			}
			context.stroke();
		}
	}

	//context.strokeRect(-(this.dimension[0]-1)/2,-(this.dimension[1]-1)/2,this.dimension[0]-1,this.dimension[1]-1);

	context.restore();
	context.save();
	context.translate(x0, y0);
	context.rotate(this.radians);

	if (this.highlighted) {
		var p0Fill = this.highlighted == "p0" ? true : false;
		var p1Fill = this.highlighted == "p1" ? true : false;
		var p2Fill = this.highlighted == "p2" ? true : false;
		this.littleCircle(context, 0, 0, p0Fill);
		this.mover(context, 0, 0, p0Fill);
		this.littleCircle(
			context,
			(this.sx * this.dimension[0]) / 2,
			(this.sy * this.dimension[1]) / 2,
			p1Fill
		);
		this.resizer(
			context,
			(this.sx * this.dimension[0]) / 2,
			(this.sy * this.dimension[1]) / 2,
			p1Fill
		);
		this.littleCircle(context, (this.sx * this.dimension[0]) / 2, 0, p2Fill);
		this.rotator(context, (this.sx * this.dimension[0]) / 2, 0, p2Fill);
		context.globalAlpha = 0.5;
		context.fillStyle = "#000000";
		if (this.textMeasure) {
			context.fillText(
				this.sx + "x," + this.sy + "x",
				(this.sx * this.dimension[0]) / 2 + 12,
				(this.sy * this.dimension[1]) / 2 + 5
			);
			context.fillText(
				this.a + "\u00b0",
				(this.sx * this.dimension[0]) / 2 + 12,
				5
			);
		}
		context.globalAlpha = 1;
	} else if (this.penDown) {
		if (this.rotating) {
			this.rotator(context, (this.sx * this.dimension[0]) / 2, 0, true);
		} else {
			this.resizer(
				context,
				(this.sx * this.dimension[0]) / 2,
				(this.sy * this.dimension[1]) / 2,
				true
			);
		}
	}
	context.restore();
};

CIQ.Drawing.shape.prototype.reposition = function (
	context,
	repositioner,
	tick,
	value
) {
	if (!repositioner) return;
	var panel = this.stx.panels[this.panelName];
	if (repositioner.action == "move") {
		var tickDiff = repositioner.tick - tick;
		var valueDiff = repositioner.value - value;
		this.setPoint(
			0,
			repositioner.p0[0] - tickDiff,
			repositioner.p0[1] - valueDiff,
			panel.chart
		);
		this.render(context);
	} else {
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var x1 = this.stx.pixelFromTick(tick, panel.chart);
		var y1 = this.stx.pixelFromValueAdjusted(panel, tick, value);
		if (repositioner.action == "scale") {
			this[repositioner.point] = [tick, value];
			this.sx = parseFloat(
				(
					((x1 - x0) * Math.cos(this.radians) +
						(y1 - y0) * Math.sin(this.radians)) /
					(this.dimension[0] / 2)
				).toFixed(1)
			);
			if (Math.abs(this.sx) < 1) this.sx /= Math.abs(this.sy);
			this.sy = parseFloat(
				(
					((y1 - y0) * Math.cos(this.radians) -
						(x1 - x0) * Math.sin(this.radians)) /
					(this.dimension[1] / 2)
				).toFixed(1)
			);
			if (Math.abs(this.sy) < 1) this.sy /= Math.abs(this.sy);
			this.render(context);
		} else if (repositioner.action == "rotate") {
			this[repositioner.point] = [tick, value];
			this.radians = Math.atan((y1 - y0) / (x1 - x0));
			if (x1 < x0) this.radians += Math.PI;
			else if (y1 < y0) this.radians += 2 * Math.PI;
			this.a = parseInt(((this.radians * 36) / Math.PI).toFixed(0), 10) * 5;
			if (this.sx < 0) this.a = this.a + 180;
			this.a %= 360;
			this.radians = (this.a * Math.PI) / 180;
			this.render(context);
		}
	}
};

CIQ.Drawing.shape.prototype.intersected = function (tick, value, box) {
	if (!this.p0) return null; // in case invalid drawing (such as from panel that no longer exists)
	if (
		this.stx.repositioningDrawing == this &&
		this.stx.repositioningDrawing.repositioner
	)
		return this.stx.repositioningDrawing.repositioner;

	var panel = this.stx.panels[this.panelName];
	var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
	var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
	var x1 = this.stx.pixelFromTick(tick, panel.chart);
	var y1 = this.stx.pixelFromValueAdjusted(panel, tick, value);

	x1 -= x0;
	y1 -= y0;
	var y1t = y1,
		x1t = x1;
	x1 = Math.cos(this.radians) * x1t + Math.sin(this.radians) * y1t;
	y1 = Math.cos(this.radians) * y1t - Math.sin(this.radians) * x1t;
	x1 /= this.sx;
	y1 /= this.sy;
	this.padding = CIQ.ensureDefaults(this.padding || {}, {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	});
	var paddingX = this.padding.right + this.padding.left,
		paddingY = this.padding.bottom + this.padding.top;
	var circleR2 = Math.pow(
		CIQ.touchDevice ? 25 : 5 + this.littleCircleRadius(),
		2
	);
	var scaledCircleR2 = Math.abs(circleR2 / (this.sx * this.sy));
	var overShape =
		Math.pow((this.dimension[0] - paddingX) / 2, 2) +
			Math.pow((this.dimension[1] - paddingY) / 2, 2) >
		Math.pow(x1 - paddingX / 2, 2) + Math.pow(y1 - paddingY / 2, 2);
	var moveProximity =
		(circleR2 - (Math.pow(x1 * this.sx, 2) + Math.pow(y1 * this.sy, 2))) /
		Math.abs(this.sx * this.sy);
	var scaleProximity =
		scaledCircleR2 -
		Math.pow(x1 - this.dimension[0] / 2, 2) -
		Math.pow(y1 - this.dimension[1] / 2, 2);
	var rotateProximity =
		scaledCircleR2 - Math.pow(x1 - this.dimension[0] / 2, 2) - Math.pow(y1, 2);
	//console.log("s:"+scaleProximity+" r:"+rotateProximity+" m:"+moveProximity);
	if (overShape) {
		if (scaleProximity >= rotateProximity && scaleProximity >= moveProximity) {
			this.highlighted = "p1";
			return {
				action: "scale"
			};
		} else if (
			rotateProximity >= scaleProximity &&
			rotateProximity >= moveProximity
		) {
			this.highlighted = "p2";
			return {
				action: "rotate"
			};
		}

		this.highlighted = "p0";
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			tick: tick,
			value: value
		};
	}
	return null;
};

CIQ.Drawing.shape.prototype.configs = [
	"color",
	"fillColor",
	"lineWidth",
	"pattern"
];

CIQ.Drawing.shape.prototype.littleCircleRadius = function () {
	return 3;
};

CIQ.Drawing.shape.prototype.click = function (context, tick, value) {
	if (!this.points.length) return false;
	this.copyConfig();
	var panel = this.stx.panels[this.panelName];
	if (!this.penDown) {
		this.setPoint(0, tick, value, panel.chart);
		this.penDown = true;
		return false;
	}
	//if(this.accidentalClick(tick, value)) return this.dragToDraw;

	this.setPoint(1, tick, value, panel.chart);

	if (this.rotating || !this.setRotationOnInitialDraw) {
		this.penDown = false;
		this.rotating = false;
		return true; // kernel will call render after this
	}
	this.rotating = true;
	return false;
};

CIQ.Drawing.shape.prototype.adjust = function () {
	var panel = this.stx.panels[this.panelName];
	if (!panel) return;

	// this section deals with backwards compatibility
	var compatibilityShapeName = this.name + "_v" + (this.version || 0);
	if (CIQ.Drawing[compatibilityShapeName]) {
		var oldShape = new CIQ.Drawing[compatibilityShapeName]();
		this.name = oldShape.name;
		this.dimension = oldShape.dimension;
		this.padding = oldShape.padding;
		this.points = oldShape.points;
		this.version = oldShape.version;
	}

	this.setPoint(0, this.d0, this.v0, panel.chart);
	this.radians = (Math.round(this.a / 5) * Math.PI) / 36;
};

/**
 * Reconstruct a shape
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {object} [obj] A drawing descriptor
 * @param {string} [obj.col] The border color
 * @param {string} [obj.fc] The fill color
 * @param {string} [obj.pnl] The panel name
 * @param {string} [obj.ptrn] Pattern for line "solid","dotted","dashed". Defaults to solid.
 * @param {number} [obj.lw] Line width. Defaults to 1.
 * @param {number} [obj.v0] Value (price) for the center point
 * @param {number} [obj.d0] Date (string form) for the center point
 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
 * @param {number} [obj.a] Angle of the rotation in degrees
 * @param {number} [obj.sx] Horizontal scale factor
 * @param {number} [obj.sy] Vertical scale factor
 * @memberOf CIQ.Drawing.shape
 */
CIQ.Drawing.shape.prototype.reconstruct = function (stx, obj) {
	this.stx = stx;
	this.color = obj.col;
	this.fillColor = obj.fc;
	this.panelName = obj.pnl;
	this.pattern = obj.ptrn;
	this.lineWidth = obj.lw;
	this.d0 = obj.d0;
	this.v0 = obj.v0;
	this.tzo0 = obj.tzo0;
	this.a = obj.a;
	this.sx = obj.sx;
	this.sy = obj.sy;
	this.version = obj.ver;
	this.adjust();
};

CIQ.Drawing.shape.prototype.serialize = function () {
	return {
		name: this.name,
		pnl: this.panelName,
		col: this.color,
		fc: this.fillColor,
		ptrn: this.pattern,
		lw: this.lineWidth,
		d0: this.d0,
		v0: this.v0,
		tzo0: this.tzo0,
		a: this.a,
		sx: this.sx,
		sy: this.sy,
		ver: this.version
	};
};

/* Drawing specific shapes
 *
 * this.dimension: overall dimension of shape as designed, as a pair [dx,dy] where dx is length and dy is width, in pixels
 * this.points: array of arrays.  Each array represents a closed loop subshape.
 * 	within each array is a series of values representing coordinates.
 * 	For example, ["M",0,0,"L",1,1,"L",2,1,"Q",3,3,4,1,"B",5,5,0,0,3,3]
 * 	The array will be parsed by the render function:
 * 		"M" - move to the xy coordinates represented by the next 2 array elements
 * 		"L" - draw line to xy coordinates represented by the next 2 array elements
 * 		"Q" - draw quadratic curve where next 2 elements are the control point and following 2 elements are the end coordinates
 * 		"B" - draw bezier curve where next 2 elements are first control point, next 2 elements are second control point, and next 2 elements are the end coordinates
 * See sample shapes below.
 *
 */

CIQ.Drawing.arrow = function () {
	this.name = "arrow";
	this.version = 1;
	this.dimension = [11, 22];
	this.padding = {
		left: 0,
		right: 0,
		top: 11,
		bottom: 0
	};
	this.points = [
		[
			"M", 3, 21,
			"L", 7, 21,
			"L", 7, 16,
			"L", 10, 16,
			"L", 5, 11,
			"L", 0, 16,
			"L", 3, 16,
			"L", 3, 21
		]
	]; // prettier-ignore
};
CIQ.inheritsFrom(CIQ.Drawing.arrow, CIQ.Drawing.shape);

/**
 * Function to determine which drawing tools are available.
 * @param  {object} excludeList Exclusion list of tools in object form ( e.g. {"vertical":true,"annotation":true})
 * @returns {object} Map of tool names and types
 * @memberof CIQ.Drawing
 * @since 3.0.0
 */
CIQ.Drawing.getDrawingToolList = function (excludeList) {
	var map = {};
	var excludedDrawings = {
		arrow_v0: true,
		BaseTwoPoint: true,
		fibonacci: true,
		shape: true
	};
	CIQ.extend(excludedDrawings, excludeList);
	for (var drawing in CIQ.Drawing) {
		if (!excludedDrawings[drawing] && CIQ.Drawing[drawing].prototype.render)
			map[new CIQ.Drawing[drawing]().name] = drawing;
	}
	return map;
};

};

let __js_standard_easeMachine_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * A simple device to make ease functions easy to use. Requests a cubic function that takes the form function (t, b, c, d)
 * 		t = current time
 * 		b = starting value
 * 		c = change in value
 * 		d = duration
 * @param {function} fc        The cubic function
 * @param {number} ms         Milliseconds to perform the function
 * @param {map} [startValues] Name value pairs of starting values (or pass in a single value)
 * @param {map} [endValues]   Name value pairs of ending values (or pass in a single value)
 * @name  CIQ.EaseMachine
 * @constructor
 * @example
 * var e=new CIQ.EaseMachine(Math.easeInOutCubic, 200);
 * e.run(function(v){console.log(v)}, 100, 110);
 */
CIQ.EaseMachine = function (fc, ms, startValues, endValues) {
	this.fc = fc;
	this.ms = ms;
	if (startValues || startValues === 0) {
		this.reset(startValues, endValues);
	}
};

/**
 * Resets the EaseMachine with a new set of values
 * @param {map} [startValues] Name value pairs of starting values (or pass in a single value). If null then the currentValues will become the startValues (allowing for resetting or reversing of direction)
 * @param {map} endValues   Name value pairs of ending values (or pass in a single value)
 * @memberof CIQ.EaseMachine
 */
CIQ.EaseMachine.prototype.reset = function (startValues, endValues) {
	if (!startValues && startValues !== 0) startValues = this.currentValues;
	this.hasCompleted = false;
	this.running = false;
	this.okayToRun = true;
	this.useNameValuePairs = typeof endValues == "object";
	this.startTime = Date.now();
	if (this.useNameValuePairs) {
		this.startValues = startValues;
		this.endValues = endValues;
	} else {
		this.startValues = { default: startValues };
		this.endValues = { default: endValues };
	}
	this.changeValues = {};
	this.currentValues = {};
	for (var n in this.startValues) {
		this.changeValues[n] = this.endValues[n] - this.startValues[n];
	}
};

/**
 * Returns the next set of values, or individual value
 * @return {map} Name value pairs of current values or current value
 * @memberof CIQ.EaseMachine
 * @private
 */
CIQ.EaseMachine.prototype.next = function () {
	var now = Date.now();
	if (now >= this.startTime + this.ms) {
		now = this.startTime + this.ms;
		this.hasCompleted = true;
		this.running = false;
	}
	this.currentValues = {};
	for (var n in this.changeValues) {
		this.currentValues[n] = this.fc(
			now - this.startTime,
			this.startValues[n],
			this.changeValues[n],
			this.ms
		);
	}
	if (!this.useNameValuePairs) return this.currentValues["default"];
	return this.currentValues;
};

/**
 * This will be false while the ease machine is completing
 * @type {boolean}
 * @memberof CIQ.EaseMachine
 */
CIQ.EaseMachine.prototype.hasCompleted = true;

/**
 * Runs the ease machine in a loop until completion by calling next() from within a requestAnimationFrame.
 * @param {function} fc Function callback, will receive the results of {@link CIQ.EaseMachine#next}
 * @param {map} [startValues] Name value pairs of starting values (or pass in a single value)
 * @param {map} [endValues]   Name value pairs of ending values (or pass in a single value)
 * @param {boolean} [delayFirstRun=false] Normally, the first pass of the run will happen immediately. Pass true if you want to wait for the next animation frame before beginning.
 * @memberof CIQ.EaseMachine
 */
CIQ.EaseMachine.prototype.run = function (
	fc,
	startValues,
	endValues,
	delayFirstRun
) {
	if (this.afid) cancelAnimationFrame(this.afid);
	if (startValues || startValues === 0) {
		this.reset(startValues, endValues);
	} else if (endValues || endValues === 0) {
		this.reset(this.currentValues, endValues);
	}
	var self = this;
	function go() {
		self.afid = null;
		if (!self.okayToRun) return;
		var result = self.next();
		fc(result);
		if (self.hasCompleted) return;
		self.afid = requestAnimationFrame(go);
	}
	this.running = true;
	if (delayFirstRun) this.afid = requestAnimationFrame(go);
	else go();
};

/**
 * Stops the ease machine from running mid-animation. Returns the current state.
 * @return {map} Name value pairs of current values or current value
 * @memberof CIQ.EaseMachine
 */
CIQ.EaseMachine.prototype.stop = function () {
	if (this.afid) cancelAnimationFrame(this.afid);
	this.afid = null;
	this.okayToRun = false;
	this.hasCompleted = true;
	this.running = false;
	if (typeof this.useNameValuePairs == "undefined") return {};
	if (!this.useNameValuePairs) return this.currentValues["default"];
	return this.currentValues;
};

if (CIQ.ChartEngine.prototype.animations.zoom.isStub)
	CIQ.ChartEngine.prototype.animations.zoom = new CIQ.EaseMachine(
		Math.easeOutCubic,
		400
	);

};

let __js_standard_equations_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

//JavaScript Expression Evaluator: https://silentmatt.com/javascript-expression-evaluator/
/*!
	 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
	 http://www.undefined.ch/mparser/index.html
	 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)
	 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
	 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
	 but don't feel like you have to let me know or ask permission.
	*/

var Parser = function () {
	function object(o) {
		function F() {}
		F.prototype = o;
		return new F();
	}

	var TNUMBER = 0;
	var TOP1 = 1;
	var TOP2 = 2;
	var TVAR = 3;
	var TFUNCALL = 4;

	function Token(type_, index_, prio_, number_) {
		this.type_ = type_;
		this.index_ = index_ || 0;
		this.prio_ = prio_ || 0;
		this.number_ = number_ !== undefined && number_ !== null ? number_ : 0;
		this.toString = function () {
			switch (this.type_) {
				case TNUMBER:
					return this.number_;
				case TOP1:
				case TOP2:
				case TVAR:
					return this.index_;
				case TFUNCALL:
					return "CALL";
				default:
					return "Invalid Token";
			}
		};
	}

	function Expression(tokens, ops1, ops2, functions) {
		this.tokens = tokens;
		this.ops1 = ops1;
		this.ops2 = ops2;
		this.functions = functions;
	}

	// Based on http://www.json.org/json2.js
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = {
			// table of character substitutions
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			"'": "\\'",
			"\\": "\\\\"
		};

	function escapeValue(v) {
		if (typeof v === "string") {
			escapable.lastIndex = 0;
			return escapable.test(v)
				? "'" +
						v.replace(escapable, function (a) {
							var c = meta[a];
							return typeof c === "string"
								? c
								: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
						}) +
						"'"
				: "'" + v + "'";
		}
		return v;
	}

	CIQ.extend(
		Expression.prototype,
		{
			simplify: function (values) {
				values = values || {};
				var nstack = [];
				var newexpression = [];
				var n1;
				var n2;
				var f;
				var L = this.tokens.length;
				var item;
				var i = 0;
				for (i = 0; i < L; i++) {
					item = this.tokens[i];
					var type_ = item.type_;
					if (type_ === TNUMBER) {
						nstack.push(item);
					} else if (type_ === TVAR && item.index_ in values) {
						item = new Token(TNUMBER, 0, 0, values[item.index_]);
						nstack.push(item);
					} else if (type_ === TOP2 && nstack.length > 1) {
						n2 = nstack.pop();
						n1 = nstack.pop();
						f = this.ops2[item.index_];
						item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
						nstack.push(item);
					} else if (type_ === TOP1 && nstack.length > 0) {
						n1 = nstack.pop();
						f = this.ops1[item.index_];
						item = new Token(TNUMBER, 0, 0, f(n1.number_));
						nstack.push(item);
					} else {
						while (nstack.length > 0) {
							newexpression.push(nstack.shift());
						}
						newexpression.push(item);
					}
				}
				while (nstack.length > 0) {
					newexpression.push(nstack.shift());
				}

				return new Expression(
					newexpression,
					object(this.ops1),
					object(this.ops2),
					object(this.functions)
				);
			},

			substitute: function (variable, expr) {
				if (!(expr instanceof Expression)) {
					expr = new Parser().parse(String(expr));
				}
				var newexpression = [];
				var L = this.tokens.length;
				var item;
				var i = 0;
				for (i = 0; i < L; i++) {
					item = this.tokens[i];
					var type_ = item.type_;
					if (type_ === TVAR && item.index_ === variable) {
						for (var j = 0; j < expr.tokens.length; j++) {
							var expritem = expr.tokens[j];
							var replitem = new Token(
								expritem.type_,
								expritem.index_,
								expritem.prio_,
								expritem.number_
							);
							newexpression.push(replitem);
						}
					} else {
						newexpression.push(item);
					}
				}

				var ret = new Expression(
					newexpression,
					object(this.ops1),
					object(this.ops2),
					object(this.functions)
				);
				return ret;
			},

			evaluate: function (values) {
				values = values || {};
				var nstack = [];
				var n1;
				var n2;
				var f;
				var L = this.tokens.length;
				var item;
				var i = 0;
				for (i = 0; i < L; i++) {
					item = this.tokens[i];
					var type_ = item.type_;
					if (type_ === TNUMBER) {
						nstack.push(item.number_);
					} else if (type_ === TOP2) {
						n2 = nstack.pop();
						n1 = nstack.pop();
						f = this.ops2[item.index_];
						nstack.push(f(n1, n2));
					} else if (type_ === TVAR) {
						if (item.index_ in values) {
							nstack.push(values[item.index_]);
						} else if (item.index_ in this.functions) {
							nstack.push(this.functions[item.index_]);
						} else {
							throw new Error("undefined variable: " + item.index_);
						}
					} else if (type_ === TOP1) {
						n1 = nstack.pop();
						f = this.ops1[item.index_];
						nstack.push(f(n1));
					} else if (type_ === TFUNCALL) {
						n1 = nstack.pop();
						f = nstack.pop();
						if (f.apply && f.call) {
							if (Object.prototype.toString.call(n1) == "[object Array]") {
								nstack.push(f.apply(undefined, n1));
							} else {
								nstack.push(f.call(undefined, n1));
							}
						} else {
							throw new Error(f + " is not a function");
						}
					} else {
						throw new Error("invalid Expression");
					}
				}
				if (nstack.length > 1) {
					throw new Error("invalid Expression (parity)");
				}
				return nstack[0];
			},

			toString: function (toJS) {
				var nstack = [];
				var n1;
				var n2;
				var f;
				var L = this.tokens.length;
				var item;
				var i = 0;
				for (i = 0; i < L; i++) {
					item = this.tokens[i];
					var type_ = item.type_;
					if (type_ === TNUMBER) {
						nstack.push(escapeValue(item.number_));
					} else if (type_ === TOP2) {
						n2 = nstack.pop();
						n1 = nstack.pop();
						f = item.index_;
						if (toJS && f == "^") {
							nstack.push("Math.pow(" + n1 + "," + n2 + ")");
						} else {
							nstack.push("(" + n1 + f + n2 + ")");
						}
					} else if (type_ === TVAR) {
						nstack.push(item.index_);
					} else if (type_ === TOP1) {
						n1 = nstack.pop();
						f = item.index_;
						if (f === "-") {
							nstack.push("(" + f + n1 + ")");
						} else {
							nstack.push(f + "(" + n1 + ")");
						}
					} else if (type_ === TFUNCALL) {
						n1 = nstack.pop();
						f = nstack.pop();
						nstack.push(f + "(" + n1 + ")");
					} else {
						throw new Error("invalid Expression");
					}
				}
				if (nstack.length > 1) {
					throw new Error("invalid Expression (parity)");
				}
				return nstack[0];
			},

			variables: function () {
				var L = this.tokens.length;
				var vars = [];
				for (var i = 0; i < L; i++) {
					var item = this.tokens[i];
					if (item.type_ === TVAR && vars.indexOf(item.index_) == -1) {
						vars.push(item.index_);
					}
				}

				return vars;
			} /*,

			toJSFunction: function (param, variables) {
				var f = new Function(param, "with(Parser.values) { return " + this.simplify(variables).toString(true) + "; }");
				return f;
			}*/
		},
		true
	);

	function add(a, b) {
		return Number(a) + Number(b);
	}
	function sub(a, b) {
		return a - b;
	}
	function mul(a, b) {
		return a * b;
	}
	function div(a, b) {
		return a / b;
	}
	function mod(a, b) {
		return a % b;
	}
	function concat(a, b) {
		return "" + a + b;
	}
	function equal(a, b) {
		return a == b;
	}
	function notEqual(a, b) {
		return a != b;
	}
	function greaterThan(a, b) {
		return a > b;
	}
	function lessThan(a, b) {
		return a < b;
	}
	function greaterThanEqual(a, b) {
		return a >= b;
	}
	function lessThanEqual(a, b) {
		return a <= b;
	}
	function andOperator(a, b) {
		return Boolean(a && b);
	}
	function orOperator(a, b) {
		return Boolean(a || b);
	}
	function sinh(a) {
		return Math.sinh ? Math.sinh(a) : (Math.exp(a) - Math.exp(-a)) / 2;
	}
	function cosh(a) {
		return Math.cosh ? Math.cosh(a) : (Math.exp(a) + Math.exp(-a)) / 2;
	}
	function tanh(a) {
		if (Math.tanh) return Math.tanh(a);
		if (a === Infinity) return 1;
		if (a === -Infinity) return -1;
		return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
	}
	function asinh(a) {
		if (Math.asinh) return Math.asinh(a);
		if (a === -Infinity) return a;
		return Math.log(a + Math.sqrt(a * a + 1));
	}
	function acosh(a) {
		return Math.acosh ? Math.acosh(a) : Math.log(a + Math.sqrt(a * a - 1));
	}
	function atanh(a) {
		return Math.atanh ? Math.atanh(a) : Math.log((1 + a) / (1 - a)) / 2;
	}
	function log10(a) {
		return Math.log(a) * Math.LOG10E;
	}
	function neg(a) {
		return -a;
	}
	function trunc(a) {
		if (Math.trunc) return Math.trunc(a);
		return a < 0 ? Math.ceil(a) : Math.floor(a);
	}
	function random(a) {
		return Math.random() * (a || 1);
	}
	function fac(a) {
		//a!
		a = Math.floor(a);
		var b = a;
		while (a > 1) {
			b = b * --a;
		}
		return b;
	}

	function hypot() {
		if (Math.hypot) return Math.hypot.apply(this, arguments);
		var y = 0;
		var length = arguments.length;
		for (var i = 0; i < length; i++) {
			if (arguments[i] === Infinity || arguments[i] === -Infinity) {
				return Infinity;
			}
			y += arguments[i] * arguments[i];
		}
		return Math.sqrt(y);
	}

	function condition(cond, yep, nope) {
		return cond ? yep : nope;
	}

	function append(a, b) {
		if (Object.prototype.toString.call(a) != "[object Array]") {
			return [a, b];
		}
		a = a.slice();
		a.push(b);
		return a;
	}

	function Parser() {
		this.success = false;
		this.errormsg = "";
		this.expression = "";

		this.pos = 0;

		this.tokennumber = 0;
		this.tokenprio = 0;
		this.tokenindex = 0;
		this.tmpprio = 0;

		this.ops1 = {
			sin: Math.sin,
			cos: Math.cos,
			tan: Math.tan,
			asin: Math.asin,
			acos: Math.acos,
			atan: Math.atan,
			sinh: sinh,
			cosh: cosh,
			tanh: tanh,
			asinh: asinh,
			acosh: acosh,
			atanh: atanh,
			sqrt: Math.sqrt,
			log: Math.log,
			lg: log10,
			log10: log10,
			abs: Math.abs,
			ceil: Math.ceil,
			floor: Math.floor,
			round: Math.round,
			trunc: trunc,
			"-": neg,
			exp: Math.exp
		};

		this.ops2 = {
			"+": add,
			"-": sub,
			"*": mul,
			"/": div,
			"%": mod,
			"^": Math.pow,
			",": append,
			"||": concat,
			"==": equal,
			"!=": notEqual,
			">": greaterThan,
			"<": lessThan,
			">=": greaterThanEqual,
			"<=": lessThanEqual,
			and: andOperator,
			or: orOperator
		};

		this.functions = {
			random: random,
			fac: fac,
			min: Math.min,
			max: Math.max,
			hypot: hypot,
			pyt: hypot, // backward compat
			pow: Math.pow,
			atan2: Math.atan2,
			if: condition
		};

		this.consts = {
			E: Math.E,
			PI: Math.PI
		};
	}

	Parser.parse = function (expr) {
		return new Parser().parse(expr);
	};

	Parser.evaluate = function (expr, variables) {
		return Parser.parse(expr).evaluate(variables);
	};

	Parser.Expression = Expression;

	Parser.values = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.tan,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		sinh: sinh,
		cosh: cosh,
		tanh: tanh,
		asinh: asinh,
		acosh: acosh,
		atanh: atanh,
		sqrt: Math.sqrt,
		log: Math.log,
		lg: log10,
		log10: log10,
		abs: Math.abs,
		ceil: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		trunc: trunc,
		random: random,
		fac: fac,
		exp: Math.exp,
		min: Math.min,
		max: Math.max,
		hypot: hypot,
		pyt: hypot, // backward compat
		pow: Math.pow,
		atan2: Math.atan2,
		if: condition,
		E: Math.E,
		PI: Math.PI
	};

	var PRIMARY = 1 << 0;
	var OPERATOR = 1 << 1;
	var FUNCTION = 1 << 2;
	var LPAREN = 1 << 3;
	var RPAREN = 1 << 4;
	var COMMA = 1 << 5;
	var SIGN = 1 << 6;
	var CALL = 1 << 7;
	var NULLARY_CALL = 1 << 8;

	CIQ.extend(
		Parser.prototype,
		{
			parse: function (expr) {
				this.errormsg = "";
				this.success = true;
				var operstack = [];
				var tokenstack = [];
				this.tmpprio = 0;
				var expected = PRIMARY | LPAREN | FUNCTION | SIGN;
				var noperators = 0;
				this.expression = expr;
				this.pos = 0;

				while (this.pos < this.expression.length) {
					var token;
					if (this.isOperator()) {
						if (this.isSign() && expected & SIGN) {
							if (this.isNegativeSign()) {
								this.tokenprio = 2;
								this.tokenindex = "-";
								noperators++;
								this.addfunc(tokenstack, operstack, TOP1);
							}
							expected = PRIMARY | LPAREN | FUNCTION | SIGN;
						} else if (this.isComment()) {
						} else {
							if ((expected & OPERATOR) === 0) {
								this.error_parsing(this.pos, "unexpected operator");
							}
							noperators += 2;
							this.addfunc(tokenstack, operstack, TOP2);
							expected = PRIMARY | LPAREN | FUNCTION | SIGN;
						}
					} else if (this.isNumber()) {
						if ((expected & PRIMARY) === 0) {
							this.error_parsing(this.pos, "unexpected number");
						}
						token = new Token(TNUMBER, 0, 0, this.tokennumber);
						tokenstack.push(token);

						expected = OPERATOR | RPAREN | COMMA;
					} else if (this.isString()) {
						if ((expected & PRIMARY) === 0) {
							this.error_parsing(this.pos, "unexpected string");
						}
						token = new Token(TNUMBER, 0, 0, this.tokennumber);
						tokenstack.push(token);

						expected = OPERATOR | RPAREN | COMMA;
					} else if (this.isLeftParenth()) {
						if ((expected & LPAREN) === 0) {
							this.error_parsing(this.pos, 'unexpected "("');
						}

						if (expected & CALL) {
							noperators += 2;
							this.tokenprio = -2;
							this.tokenindex = -1;
							this.addfunc(tokenstack, operstack, TFUNCALL);
						}

						expected = PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL;
					} else if (this.isRightParenth()) {
						if (expected & NULLARY_CALL) {
							token = new Token(TNUMBER, 0, 0, []);
							tokenstack.push(token);
						} else if ((expected & RPAREN) === 0) {
							this.error_parsing(this.pos, 'unexpected ")"');
						}

						expected = OPERATOR | RPAREN | COMMA | LPAREN | CALL;
					} else if (this.isComma()) {
						if ((expected & COMMA) === 0) {
							this.error_parsing(this.pos, 'unexpected ","');
						}
						this.addfunc(tokenstack, operstack, TOP2);
						noperators += 2;
						expected = PRIMARY | LPAREN | FUNCTION | SIGN;
					} else if (this.isConst()) {
						if ((expected & PRIMARY) === 0) {
							this.error_parsing(this.pos, "unexpected constant");
						}
						var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
						tokenstack.push(consttoken);
						expected = OPERATOR | RPAREN | COMMA;
					} else if (this.isOp2()) {
						if ((expected & FUNCTION) === 0) {
							this.error_parsing(this.pos, "unexpected function");
						}
						this.addfunc(tokenstack, operstack, TOP2);
						noperators += 2;
						expected = LPAREN;
					} else if (this.isOp1()) {
						if ((expected & FUNCTION) === 0) {
							this.error_parsing(this.pos, "unexpected function");
						}
						this.addfunc(tokenstack, operstack, TOP1);
						noperators++;
						expected = LPAREN;
					} else if (this.isVar()) {
						if ((expected & PRIMARY) === 0) {
							this.error_parsing(this.pos, "unexpected variable");
						}
						var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
						tokenstack.push(vartoken);

						expected = OPERATOR | RPAREN | COMMA | LPAREN | CALL;
					} else if (this.isWhite()) {
					} else {
						if (this.errormsg === "") {
							this.error_parsing(this.pos, "unknown character");
						} else {
							this.error_parsing(this.pos, this.errormsg);
						}
					}
				}
				if (this.tmpprio < 0 || this.tmpprio >= 10) {
					this.error_parsing(this.pos, 'unmatched "()"');
				}
				while (operstack.length > 0) {
					var tmp = operstack.pop();
					tokenstack.push(tmp);
				}
				if (noperators + 1 !== tokenstack.length) {
					//print(noperators + 1);
					//print(tokenstack);
					this.error_parsing(this.pos, "parity");
				}

				return new Expression(
					tokenstack,
					object(this.ops1),
					object(this.ops2),
					object(this.functions)
				);
			},

			evaluate: function (expr, variables) {
				return this.parse(expr).evaluate(variables);
			},

			error_parsing: function (column, msg) {
				this.success = false;
				this.errormsg = "parse error [column " + column + "]: " + msg;
				this.column = column;
				throw new Error(this.errormsg);
			},

			//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

			addfunc: function (tokenstack, operstack, type_) {
				var operator = new Token(
					type_,
					this.tokenindex,
					this.tokenprio + this.tmpprio,
					0
				);
				while (operstack.length > 0) {
					if (operator.prio_ <= operstack[operstack.length - 1].prio_) {
						tokenstack.push(operstack.pop());
					} else {
						break;
					}
				}
				operstack.push(operator);
			},

			isNumber: function () {
				var r = false;
				var str = "";
				while (this.pos < this.expression.length) {
					var code = this.expression.charCodeAt(this.pos);
					if ((code >= 48 && code <= 57) || code === 46) {
						str += this.expression.charAt(this.pos);
						this.pos++;
						this.tokennumber = parseFloat(str);
						r = true;
					} else {
						break;
					}
				}
				return r;
			},

			// Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
			unescape: function (v, pos) {
				var buffer = [];
				var escaping = false;

				for (var i = 0; i < v.length; i++) {
					var c = v.charAt(i);

					if (escaping) {
						switch (c) {
							case "'":
								buffer.push("'");
								break;
							case "\\":
								buffer.push("\\");
								break;
							case "/":
								buffer.push("/");
								break;
							case "b":
								buffer.push("\b");
								break;
							case "f":
								buffer.push("\f");
								break;
							case "n":
								buffer.push("\n");
								break;
							case "r":
								buffer.push("\r");
								break;
							case "t":
								buffer.push("\t");
								break;
							case "u":
								// interpret the following 4 characters as the hex of the unicode code point
								var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
								buffer.push(String.fromCharCode(codePoint));
								i += 4;
								break;
							default:
								throw this.error_parsing(
									pos + i,
									"Illegal escape sequence: '\\" + c + "'"
								);
						}
						escaping = false;
					} else {
						if (c == "\\") {
							escaping = true;
						} else {
							buffer.push(c);
						}
					}
				}

				return buffer.join("");
			},

			isString: function () {
				var r = false;
				var str = "";
				var startpos = this.pos;
				if (
					this.pos < this.expression.length &&
					this.expression.charAt(this.pos) == "'"
				) {
					this.pos++;
					while (this.pos < this.expression.length) {
						var code = this.expression.charAt(this.pos);
						if (code != "'" || str.slice(-1) == "\\") {
							str += this.expression.charAt(this.pos);
							this.pos++;
						} else {
							this.pos++;
							this.tokennumber = this.unescape(str, startpos);
							r = true;
							break;
						}
					}
				}
				return r;
			},

			isConst: function () {
				var str;
				for (var i in this.consts) {
					if (true) {
						var L = i.length;
						str = this.expression.substr(this.pos, L);
						if (i === str) {
							this.tokennumber = this.consts[i];
							this.pos += L;
							return true;
						}
					}
				}
				return false;
			},

			isOperator: function () {
				var code = this.expression.charCodeAt(this.pos);
				if (code === 43) {
					// +
					this.tokenprio = 2;
					this.tokenindex = "+";
				} else if (code === 45) {
					// -
					this.tokenprio = 2;
					this.tokenindex = "-";
				} else if (code === 62) {
					// >
					if (this.expression.charCodeAt(this.pos + 1) === 61) {
						this.pos++;
						this.tokenprio = 1;
						this.tokenindex = ">=";
					} else {
						this.tokenprio = 1;
						this.tokenindex = ">";
					}
				} else if (code === 60) {
					// <
					if (this.expression.charCodeAt(this.pos + 1) === 61) {
						this.pos++;
						this.tokenprio = 1;
						this.tokenindex = "<=";
					} else {
						this.tokenprio = 1;
						this.tokenindex = "<";
					}
				} else if (code === 124) {
					// |
					if (this.expression.charCodeAt(this.pos + 1) === 124) {
						this.pos++;
						this.tokenprio = 1;
						this.tokenindex = "||";
					} else {
						return false;
					}
				} else if (code === 61) {
					// =
					if (this.expression.charCodeAt(this.pos + 1) === 61) {
						this.pos++;
						this.tokenprio = 1;
						this.tokenindex = "==";
					} else {
						return false;
					}
				} else if (code === 33) {
					// !
					if (this.expression.charCodeAt(this.pos + 1) === 61) {
						this.pos++;
						this.tokenprio = 1;
						this.tokenindex = "!=";
					} else {
						return false;
					}
				} else if (code === 97) {
					// a
					if (
						this.expression.charCodeAt(this.pos + 1) === 110 &&
						this.expression.charCodeAt(this.pos + 2) === 100
					) {
						// n && d
						this.pos++;
						this.pos++;
						this.tokenprio = 0;
						this.tokenindex = "and";
					} else {
						return false;
					}
				} else if (code === 111) {
					// o
					if (this.expression.charCodeAt(this.pos + 1) === 114) {
						// r
						this.pos++;
						this.tokenprio = 0;
						this.tokenindex = "or";
					} else {
						return false;
					}
				} else if (code === 42 || code === 8729 || code === 8226) {
					// * or ∙ or •
					this.tokenprio = 3;
					this.tokenindex = "*";
				} else if (code === 47) {
					// /
					this.tokenprio = 4;
					this.tokenindex = "/";
				} else if (code === 37) {
					// %
					this.tokenprio = 4;
					this.tokenindex = "%";
				} else if (code === 94) {
					// ^
					this.tokenprio = 5;
					this.tokenindex = "^";
				} else {
					return false;
				}
				this.pos++;
				return true;
			},

			isSign: function () {
				var code = this.expression.charCodeAt(this.pos - 1);
				if (code === 45 || code === 43) {
					// -
					return true;
				}
				return false;
			},

			isPositiveSign: function () {
				var code = this.expression.charCodeAt(this.pos - 1);
				if (code === 43) {
					// +
					return true;
				}
				return false;
			},

			isNegativeSign: function () {
				var code = this.expression.charCodeAt(this.pos - 1);
				if (code === 45) {
					// -
					return true;
				}
				return false;
			},

			isLeftParenth: function () {
				var code = this.expression.charCodeAt(this.pos);
				if (code === 40) {
					// (
					this.pos++;
					this.tmpprio += 10;
					return true;
				}
				return false;
			},

			isRightParenth: function () {
				var code = this.expression.charCodeAt(this.pos);
				if (code === 41) {
					// )
					this.pos++;
					this.tmpprio -= 10;
					return true;
				}
				return false;
			},

			isComma: function () {
				var code = this.expression.charCodeAt(this.pos);
				if (code === 44) {
					// ,
					this.pos++;
					this.tokenprio = -1;
					this.tokenindex = ",";
					return true;
				}
				return false;
			},

			isWhite: function () {
				var code = this.expression.charCodeAt(this.pos);
				if (code === 32 || code === 9 || code === 10 || code === 13) {
					this.pos++;
					return true;
				}
				return false;
			},

			isOp1: function () {
				var str = "";
				for (var i = this.pos; i < this.expression.length; i++) {
					var c = this.expression.charAt(i);
					if (c.toUpperCase() === c.toLowerCase()) {
						if (i === this.pos || (c != "_" && (c < "0" || c > "9"))) {
							break;
						}
					}
					str += c;
				}
				if (str.length > 0 && str in this.ops1) {
					this.tokenindex = str;
					this.tokenprio = 5;
					this.pos += str.length;
					return true;
				}
				return false;
			},

			isOp2: function () {
				var str = "";
				for (var i = this.pos; i < this.expression.length; i++) {
					var c = this.expression.charAt(i);
					if (c.toUpperCase() === c.toLowerCase()) {
						if (i === this.pos || (c != "_" && (c < "0" || c > "9"))) {
							break;
						}
					}
					str += c;
				}
				if (str.length > 0 && str in this.ops2) {
					this.tokenindex = str;
					this.tokenprio = 5;
					this.pos += str.length;
					return true;
				}
				return false;
			},

			isVar: function () {
				var str = "";
				for (var i = this.pos; i < this.expression.length; i++) {
					var c = this.expression.charAt(i);
					if (c.toUpperCase() === c.toLowerCase()) {
						if (i === this.pos || (c != "_" && (c < "0" || c > "9"))) {
							break;
						}
					}
					str += c;
				}
				if (str.length > 0) {
					this.tokenindex = str;
					this.tokenprio = 4;
					this.pos += str.length;
					return true;
				}
				return false;
			},

			isComment: function () {
				var code = this.expression.charCodeAt(this.pos - 1);
				if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
					this.pos = this.expression.indexOf("*/", this.pos) + 2;
					if (this.pos === 1) {
						this.pos = this.expression.length;
					}
					return true;
				}
				return false;
			}
		},
		true
	);
	return Parser;
};

/**
 * Computes an equation that may contain symbols and simple arithmetic operators.
 * Parentheses can be used to separate portions of the equation.
 * PEMDAS priority is observed.
 * Symbols can be optionally contained within brackets.
 * Valid examples: 3*IBM, 4+(IBM*2), (IBM-GM)/2
 * If the equation cannot be resolved an exception is thrown.
 * @param {string} equation The equation to compute.
 * @param  {Object} map A map of symbols to data
 * @return {Array}     A consolidated array of equation results
 * @memberOf CIQ
 * @version ChartIQ Advanced Package
 */
CIQ.computeEquationChart = function (equation, map) {
	equation = equation.replace(/[:]/, "/").toUpperCase();
	var count = 0;
	for (var sym in map) {
		var r = new RegExp(
			"\\[" +
				sym
					.replace(/\[/g, "\\[")
					.replace(/\]/g, "\\]")
					.replace(/\$/g, "\\$")
					.replace(/\^/g, "\\^")
					.replace(/[+\-*/%()]/g, "\\$&") +
				"\\]",
			"g"
		);
		equation = equation.replace(r, "symbol" + count);
		count++;
	}
	var expr = Parser().parse(equation);
	var newArray = [];
	var iters = {};
	var numSyms = 0,
		c;
	var firstIter = null;
	var priceRelative = false;
	var arrMap = [];
	for (sym in map) {
		var elem = { sym: sym, map: map[sym] };
		if (map[sym]) arrMap.unshift(elem);
		else arrMap.push(elem);
	}
	// Need an array - cannot guarantee order of map!
	for (var el = 0; el < arrMap.length; el++) {
		var _ = arrMap[el];
		iters[_.sym] = { i: 0, s: _.sym };
		if (_.map) {
			numSyms++;
			c = _.map[0];
		} else if (numSyms == 1) {
			priceRelative = _.sym;
		}
		if (!c.DT) c.DT = CIQ.strToDateTime(c.Date);
		iters[_.sym].d = c.DT;
		if (!firstIter) firstIter = iters[_.sym];
	}
	var constant = numSyms === 0;
	var computeHighLow = numSyms == 1 && equation.indexOf("%") == -1;
	function incrementIterator(iterator) {
		iterator.i++;
		if (map[iterator.s]) {
			if (iterator.i >= map[iterator.s].length) return 0;
			c = map[iterator.s][iterator.i];
		}
		if (!c.DT) c.DT = CIQ.strToDateTime(c.Date);
		iterator.d = c.DT;
		return 1;
	}
	function isAllAligned() {
		var laggard = null;
		var temp = null;
		for (var iter in iters) {
			if (!temp) temp = iters[iter];
			else if (iters[iter].d.getTime() < temp.d.getTime()) {
				laggard = temp = iters[iter];
			} else if (iters[iter].d.getTime() > temp.d.getTime()) {
				laggard = temp;
			}
		}
		if (laggard) {
			if (!incrementIterator(laggard)) return 0;
			return -1;
		}
		return 1;
	}
	whileLoop: while (true) {
		var aligned = isAllAligned();
		if (!aligned) break;
		if (aligned == 1) {
			var m;
			if (priceRelative) {
				var prElem = map[firstIter.s][firstIter.i][priceRelative];
				if (prElem && (prElem.Close || prElem.Close === 0))
					prElem = prElem.Close;
				var close = expr.evaluate({
					symbol0: map[firstIter.s][firstIter.i].Close,
					symbol1: prElem
				});
				close = Number(close.toFixed(8)); //Math.round(close*10000)/10000;
				m = { DT: firstIter.d, Close: close, Adj_Close: close };
				m[firstIter.s] = map[firstIter.s][firstIter.i].Close;
				if (!isNaN(close) && close != Infinity) newArray.push(m);
			} else if (constant) {
				var res = expr.evaluate({});
				CIQ.alert(equation + "=" + res);
				throw { name: "NoException", message: "" };
			} else {
				count = 0;
				var evaluators = {
					Adj_Close: {},
					Close: {},
					Open: {},
					High: {},
					Low: {},
					Volume: {}
				};
				for (sym in map) {
					for (var e in evaluators) {
						evaluators[e]["symbol" + count] = map[sym][iters[sym].i][e];
					}
					count++;
				}
				m = { DT: firstIter.d };
				/*
					variation 1 (Stockcharts.com):
					m.Close/=c.Close;
					m.High/=c.Close;
					m.Low/=c.Close;
					m.Open/=c.Close;

					variation 2 (eSignal):
					m.Close/=c.Close;
					m.High/=c.High;
					m.Low/=c.Low;
					m.Open/=c.Open;
					m.High=Math.max(m.High,Math.max(m.Open,m.Close));
					m.Low=Math.min(m.Low,Math.min(m.Open,m.Close));
					*/

				m.Adj_Close = expr.evaluate(evaluators.Adj_Close);
				m.Close = expr.evaluate(evaluators.Close);
				m.Open = expr.evaluate(evaluators.Open);
				m.Volume = expr.evaluate(evaluators.Volume);
				if (isNaN(m.Volume)) m.Volume = 0;

				if (computeHighLow) {
					m.High = expr.evaluate(evaluators.High);
					m.Low = expr.evaluate(evaluators.Low);
				} else {
					m.High = Math.max(m.Open, m.Close);
					m.Low = Math.min(m.Open, m.Close);
				}
				if (!isNaN(m.Close) && m.Close != Infinity) newArray.push(m);

				if (!isNaN(m.High)) m.High = Number(m.High.toFixed(8)); //Math.round(m.High*10000)/10000;
				if (!isNaN(m.Low)) m.Low = Number(m.Low.toFixed(8)); //Math.round(m.Low*10000)/10000;
				if (!isNaN(m.Open)) m.Open = Number(m.Open.toFixed(8)); //Math.round(m.Open*10000)/10000;
				if (!isNaN(m.Close)) m.Close = Number(m.Close.toFixed(8)); //Math.round(m.Close*10000)/10000;
				if (!isNaN(m.Adj_Close)) m.Adj_Close = Number(m.Adj_Close.toFixed(8));
				//Math.round(m.Adj_Close*10000)/10000;
				else m.Adj_Close = m.Close;
			}
			for (sym in map) {
				if (!incrementIterator(iters[sym])) break whileLoop;
			}
		}
	}
	return newArray;
};

};

let __js_standard_i18n_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Sets the locale for the charts.
 *
 * Do not call this method directly. Instead use {@link CIQ.I18N.setLocale} or {@link CIQ.I18N.localize}
 *
 * If set, display prices and dates will be displayed in localized format.
 * The locale should be a valid [IANA locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
 * For instance `de-AT` represents German as used in Austria.
 *
 * Localization in the library is supported through the `Intl object` which is a [W3 standard](https://www.w3.org/International/articles/language-tags/)  supported by all modern browsers.
 *
 * Once a locale is set, `stxx.internationalizer` will be an object that will contain several Intl formatters.
 *
 * These are the default date and time formates:
 * - stxx.internationalizer.hourMinute=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", hour12:false});
 * - stxx.internationalizer.hourMinuteSecond=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", second:"numeric", hour12:false});
 * - stxx.internationalizer.mdhm=new Intl.DateTimeFormat(this.locale, {year:"2-digit", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"});
 * - stxx.internationalizer.monthDay=new Intl.DateTimeFormat(this.locale, {month:"numeric", day:"numeric"});
 * - stxx.internationalizer.yearMonthDay=new Intl.DateTimeFormat(this.locale, {year:"numeric", month:"numeric", day:"numeric"});
 * - stxx.internationalizer.yearMonth=new Intl.DateTimeFormat(this.locale, {year:"numeric", month:"numeric"});
 * - stxx.internationalizer.month=new Intl.DateTimeFormat(this.locale, {month:"short"});
 *
 * These can be overridden manually if the specified format is not acceptable. See example.
 * Also see [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for formatting alternatives
 *
 * @param {string} locale A valid [IANA locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
 * @param {number} [maxDecimals] maximum number of decimal places to allow on number conversions. Defaults to 5. Please note that this will supersede any defaults set in {@link CIQ.ChartEngine.YAxis#maxDecimalPlaces} or {@link CIQ.ChartEngine.YAxis#decimalPlaces}
 * @memberof CIQ.ChartEngine
 * @since 3.0.0 Added `maxDecimals` parameter.
 * @example
 * // override time formatting to enable 12 hour clock (hour12:true)
 * CIQ.I18N.setLocale(stxx, "en");
 * stxx.internationalizer.hourMinute=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", hour12:true});
 * stxx.internationalizer.hourMinuteSecond=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", second:"numeric", hour12:true});
 * @example
 * // override formatting to dislay 'Sep 15' insted of '9/15' on x axis labels.
 * CIQ.I18N.setLocale(stxx, "en");
 * stxx.internationalizer.monthDay=new Intl.DateTimeFormat(this.locale, {month:"short", day:"numeric"});
 * @private
 */
CIQ.ChartEngine.prototype.setLocale = function (locale, maxDecimals) {
	if (typeof Intl == "undefined") return;
	if (this.locale != locale) {
		this.locale = locale;
	} else {
		return;
	}
	var i,
		internationalizer = (this.internationalizer = {});
	internationalizer.hourMinute = new Intl.DateTimeFormat(this.locale, {
		hour: "numeric",
		minute: "numeric",
		hour12: false
	});
	internationalizer.hourMinuteSecond = new Intl.DateTimeFormat(this.locale, {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false
	});
	internationalizer.mdhm = new Intl.DateTimeFormat(this.locale, {
		year: "2-digit",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
	internationalizer.monthDay = new Intl.DateTimeFormat(this.locale, {
		month: "numeric",
		day: "numeric"
	});
	internationalizer.yearMonthDay = new Intl.DateTimeFormat(this.locale, {
		year: "numeric",
		month: "numeric",
		day: "numeric"
	});
	internationalizer.yearMonth = new Intl.DateTimeFormat(this.locale, {
		year: "numeric",
		month: "numeric"
	});
	internationalizer.month = new Intl.DateTimeFormat(this.locale, {
		month: "short"
	});
	internationalizer.numbers = new Intl.NumberFormat(this.locale);
	internationalizer.priceFormatters = [];
	if (!maxDecimals) maxDecimals = 8;
	for (i = 0; i < maxDecimals + 1; i++) {
		internationalizer.priceFormatters.push(
			new Intl.NumberFormat(this.locale, {
				maximumFractionDigits: i,
				minimumFractionDigits: i
			})
		);
	}
	// minification efficient generation of...
	// internationalizer.percent=new Intl.NumberFormat(this.locale, {style:"percent", minimumFractionDigits:2, maximumFractionDigits:2})
	// internationalizer.percent1=new Intl.NumberFormat(this.locale, {style:"percent", minimumFractionDigits:1, maximumFractionDigits:1})
	// ...
	for (i = 0; i < 5; i++) {
		var c = i,
			j = i;
		if (!i) {
			c = "";
			j = 2;
		}
		internationalizer["percent" + c] = new Intl.NumberFormat(this.locale, {
			style: "percent",
			minimumFractionDigits: j,
			maximumFractionDigits: j
		});
	}

	if (CIQ.I18N.createMonthArrays)
		CIQ.I18N.createMonthArrays(this, internationalizer.month, this.locale);
};

/**
 * Namespace for Internationalization API.
 * See {@tutorial Localization} for more details.
 * @namespace
 * @name CIQ.I18N
 */

CIQ.I18N = function () {};

// Hack code to make a multi line string easy cut & paste from a spreadsheet
CIQ.I18N.hereDoc = function (f) {
	return f
		.toString()
		.replace(/^[^/]+\/\*!?/, "")
		.replace(/\*\/[^/]+$/, "");
};

/**
 * Must be set to the desired language. Defaults to english "en"
 * @memberOf CIQ.I18N
 * @type {string}
 */
CIQ.I18N.language = "en";

/**
 * Sets the languages that that don't support shortening
 * Translation will print entire month from locale for these languages
 * @memberOf CIQ.I18N
 * @type {Object}
 */
CIQ.I18N.longMonths = { zh: true };

/**
 * Maintains the list of locales used by {@link CIQ.I18N.localize} to decide if the up/down colors should be reversed and can be updated as outlined on the example.
 *
 * Defaults to : {"zh":true,"ja":true};
 * @type {Object}
 * @memberOf CIQ.I18N
 * @since 4.0.0
 * @example
 * CIQ.I18N.reverseColorsByLocale={
 * 		"zh":true,
 * 		"ja":true,
 * 		"fr":true,
 * 		"de":true,
 * 		"hu":true,
 * 		"it":true,
 * 		"pt":true
 * };
 */
CIQ.I18N.reverseColorsByLocale = { zh: true, ja: true };

/** Returns a word list containing unique words. Each word references an array of DOM
 *  nodes that contain that word. This can then be used for translation.
 *  Text nodes and placeholders which are found in the document tree will be wrapped by this function
 *  within a <translate> tag for easy translation back and forth.
 * @param  {HTMLElement} [root] root for the TreeWalker.  If omitted, document.body assumed.
 * @return {object}      A word list containing unique words.
 *  @memberOf CIQ.I18N
 */
CIQ.I18N.findAllTextNodes = function (root) {
	if (!root) root = document.body;
	// Get all the words from the placeholders
	// We'll create text nodes for them and stash them in a hidden div so we can access them in the future
	if (root == document.body) {
		if (!document.querySelector(".ciq_stashed_texts")) {
			var stashedTextNodes = document.createElement("div");
			stashedTextNodes.className = "ciq_stashed_texts";
			stashedTextNodes.style.display = "none";
			root.appendChild(stashedTextNodes);

			var fields = document.querySelectorAll(
				"input,textarea,.editable_content"
			);
			for (var f = 0; f < fields.length; f++) {
				var placeHolder = fields[f].getAttribute("placeholder");
				if (placeHolder) {
					var wrapper = stashedTextNodes.appendChild(
						document.createElement("translate")
					);
					wrapper.setAttribute("original", placeHolder);
					wrapper.placeholderFor = fields[f];
					wrapper.appendChild(document.createTextNode(placeHolder));
				}
			}
		}
	}

	var walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		null,
		false
	);

	var node = walker.nextNode();
	var ws = new RegExp("^\\s*$");
	var line = new RegExp("\n|\t|\f", "g");
	var wordList = {};
	var dontTranslate = {
		SCRIPT: true,
		STYLE: true,
		TEXTAREA: true
	};

	while (node) {
		var key = node.nodeValue;
		if (!ws.test(key)) {
			var parentNode = node.parentNode;
			var parentTag = parentNode.tagName;
			if (!dontTranslate[parentTag]) {
				if (parentTag != "TRANSLATE") {
					var wrapper2 = document.createElement("translate");
					wrapper2.setAttribute("original", key); //must use an attribute so it will clone
					wrapper2.appendChild(node);
					parentNode.appendChild(wrapper2);
				} else {
					key = parentNode.getAttribute("original");
				}
				if (line.test(key)) key = key.replace(line, ""); // strips out new lines in text
				if (!wordList[key]) wordList[key] = [];
				wordList[key].push(node);
			}
		}
		node = walker.nextNode();
	}
	if (root == document.body) {
		// For missing word list collation only:
		// Get all the words from the study library that are used to populate the study dialogs.
		// These will have an empty array since they aren't associated with any nodes
		var studyLibrary = CIQ.Studies ? CIQ.Studies.studyLibrary : null;
		if (studyLibrary) {
			for (var study in studyLibrary) {
				if (wordList[study] === null) wordList[study] = [];
				var s = studyLibrary[study];
				if (s.inputs) {
					for (var input in s.inputs) {
						if (!wordList[input]) wordList[input] = [];
					}
				}
				if (s.outputs) {
					for (var output in s.outputs) {
						if (!wordList[output]) wordList[output] = [];
					}
				}
			}
		}
	}
	return wordList;
};

/**
 * CIQ.I18N.missingWordList will scan the UI by walking all the text elements. It will determine which
 * text elements have not been translated for the given language and return those as a JSON object.
 * @param {string} [language] The language to search for missing words. Defaults to whatever language CIQ.I18N.language has set.
 * @return {object} Words that are undefined with values set to empty strings
 * @memberOf CIQ.I18N
 * @since 4.0.0 Iterates over the studyLibrary entry name, inputs, and outputs.
 */
CIQ.I18N.missingWordList = function (language) {
	if (!language) language = CIQ.I18N.language;
	var wordsInUI = CIQ.I18N.findAllTextNodes();
	var missingWords = {};
	var languageWordList = CIQ.I18N.wordLists[language];
	if (!languageWordList) languageWordList = {};

	var addIfMissing = function (x) {
		if (typeof languageWordList[x] == "undefined") {
			missingWords[x] = "";
		}
	};

	for (var word in wordsInUI) {
		addIfMissing(word);
	}

	if (!(CIQ.Studies && CIQ.Studies.studyLibrary)) {
		return missingWords;
	}

	var study;
	var value;

	for (var id in CIQ.Studies.studyLibrary) {
		study = CIQ.Studies.studyLibrary[id];

		addIfMissing(study.name);

		for (var input in study.inputs) {
			addIfMissing(input);
			value = study.inputs[input];

			switch (Object.prototype.toString.call(value)) {
				case "[object String]":
					addIfMissing(value);
					break;
				case "[object Array]":
					for (var i = 0; i < value.length; ++i) {
						addIfMissing(value[i]);
					}
					break;
			}
		}

		for (var output in study.outputs) {
			addIfMissing(output);
		}
	}

	// study parameter fields
	addIfMissing("Show Zones");
	addIfMissing("OverBought");
	addIfMissing("OverSold");
	addIfMissing("Panel");
	addIfMissing("Show as Underlay");
	addIfMissing("Y-Axis");
	addIfMissing("Invert Y-Axis");

	return missingWords;
};

/**
 * A convenient function for creating a human readable JSON object suitable for delivery to a translator.
 * @param {string} [language] language. Defaults to CIQ.I18N.language.
 * @return {string} String of missing words.
 * @memberOf CIQ.I18N
 */
CIQ.I18N.printableMissingWordList = function (language) {
	var missingWords = JSON.stringify(CIQ.I18N.missingWordList(language));
	missingWords = missingWords.replace(/","/g, '",\n"');
	return missingWords;
};

/**
 * Passes through the UI (DOM elements) and translates all of the text for the given language.
 *
 * It is important to note that if you are dynamically creating UI content and adding it to the DOM after you have set the language,
 * you must either call this function again after the new content is added,
 * or ensure your code explicitly translates the new content using {@link CIQ.translatableTextNode} or {@link CIQ.ChartEngine#translateIf}.
 *
 * @param {string} [language] language. Defaults to CIQ.I18N.language.
 * @param {HTMLElement} [root] root for the TreeWalker to prevent the entire page from being translated.  If omitted, document.body assumed.
 * @memberOf CIQ.I18N
 * @since 4.0.0 Language code for Portuguese is "pt" (formerly "pu"; maintained for backwards compatibility).
 */
CIQ.I18N.translateUI = function (language, root) {
	if (language == "pu") language = "pt"; // backward compatibility.
	if (!CIQ.I18N.wordLists) return;
	if (!language) language = CIQ.I18N.language;
	var wordsInUI = CIQ.I18N.findAllTextNodes(root);
	var languageWordList = CIQ.I18N.wordLists[language];
	if (!languageWordList) return;

	for (var word in wordsInUI) {
		var translation = CIQ.I18N.translateSections(word, languageWordList);
		var nodes = wordsInUI[word];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i],
				parentNode = node.parentNode,
				originalText = parentNode.getAttribute("original");
			// Two scenarios where we don't want to use translation, when undefined or word is not in the translation files
			if (translation === "," || !translation) translation = originalText;
			var elemWithPlaceholder = parentNode.placeholderFor;
			if (elemWithPlaceholder) {
				elemWithPlaceholder.placeholder = translation;
			} else {
				node.data = translation;
			}
		}
	}
};

/**
 * Translates an individual word for a given language. Set stxx.translationCallback to this function
 * in order to automatically translate all textual elements on the chart itself.
 * @param {string} word The word to translate
 * @param {string} [language] language. Defaults to CIQ.I18N.language.
 * @return {string} Translation of the given word, or the word itself if no translation was found.
 * @memberOf CIQ.I18N
 */
CIQ.I18N.translate = function (word, language) {
	if (!language) language = CIQ.I18N.language;
	if (!CIQ.I18N.wordLists) {
		console.log(
			"Must include translations.js in order to use CIQ.I18N.translate()"
		);
		return word;
	}
	var languageWordList = CIQ.I18N.wordLists[language];
	var translation = null;
	if (languageWordList)
		translation = CIQ.I18N.translateSections(word, languageWordList) || word;
	// Lastly check and see if the translation is blank in the CSV source (no translation for given language) which is parsed as ',' and if so fall back to English default
	return translation === "," ? word : translation;
};

/**
 * Translates a phrase which may have untranslatable parts (like a study id).
 * The translatable pieces are delimited left and right with a non-printable character Zero-Width-Non_Joiner.
 * @param {string} word The word to translate
 * @param {object} [languageWordList] Map of words and translations in the desired language
 * @return {string} Translation of the given phrase
 * @memberOf CIQ.I18N
 * @since 4.0.0
 */
CIQ.I18N.translateSections = function (word, languageWordList) {
	// Test here for word phrases, delimited by the zero-width-non-breaking character
	// we'll split the text into pieces, filtering out the parentheses and commas to generate phrases
	var zwnb = "\u200c"; // https://en.wikipedia.org/wiki/Zero-width_non-joiner
	if (typeof word == "string" && word.indexOf(zwnb) != -1) {
		word = word.replace(/([(),])/g, zwnb + "$1" + zwnb);
		var sections = word.split(zwnb);
		sections.forEach(function (val, i, arr) {
			var padding = val.match(/^(\s*).*\S(\s*)$/);
			var translation = languageWordList[val.trim()];
			if (translation) {
				if (padding) translation = padding[1] + translation + padding[2];
				arr[i] = translation;
			}
		});
		return sections.join("");
	}
	return languageWordList[word];
};

/**
 * Converts a 'CSV formatted' string of translations into the required JSON format and set to {@link CIQ.I18N.wordLists}
 * You can output {@link CIQ.I18N.wordLists} to the console and paste back in if desired.
 * @param {string} [csv] Translation spreadsheet in csv format **as a single long string**.
 * Make sure there are no leading tabs, trailing commas or spaces.
 * Assumes that the header row of the CSV is the language codes and that the first column is the key language (English).
 * Assumes non-quoted words, data is comma delimited and lines separated by '\n'. Default is CIQ.I18N.csv
 * @memberOf CIQ.I18N
 * @example
	var csv="en,ar,fr,de,hu,it,pt,ru,es,zh,ja\nChart,الرسم البياني,Graphique,Darstellung,Diagram,Grafico,Gráfico,График,Gráfica,图表,チャート\nChart Style,أسلوب الرسم البياني,Style de graphique,Darstellungsstil,Diagram stílusa,Stile grafico,Estilo do gráfico,Тип графика,Estilo de gráfica,图表类型,チャート形式\nCandle,الشموع,Bougie,Kerze,Gyertya,Candela,Vela,Свеча,Vela,蜡烛,ローソク足\nShape,شكل,Forme,Form,Alak,Forma,Forma,Форма,Forma,形状,パターン";
	CIQ.I18N.convertCSV(csv);
 */
CIQ.I18N.convertCSV = function (csv) {
	var curly = new RegExp("[\u201C\u201D]|[\u2018\u2019]", "g");
	var quotation = new RegExp('^(")|(")$', "g");
	var wordLists = CIQ.I18N.wordLists;
	if (!csv) csv = CIQ.I18N.csv;
	if (!csv) return;
	var lines = csv.split("\n");
	var headerRow = lines[0];
	var languages = headerRow.split(",");
	for (var j = 0; j < languages.length; j++) {
		var lang = languages[j];
		if (!wordLists[lang]) {
			wordLists[lang] = {};
		}
	}
	for (var i = 1; i < lines.length; i++) {
		var words = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)|(,(?=,))/g) || [];
		var key = words[0];
		if (quotation.test(key)) key = key.replace(quotation, "");
		if (curly.test(key)) key = key.replace(curly, '"');
		for (var k = 1; k < words.length; k++) {
			var word = words[k];
			if (quotation.test(word)) word = word.replace(quotation, "");
			wordLists[languages[k]][key] = word;
		}
	}
};

/**
 * Convenience function to set up translation services for a chart and its surrounding GUI.
 * It automatically sets CIQ.I18N.language, loads all translations and translates the chart.
 *
 * Uses/sets (in execution order):
 *  - {@link CIQ.I18N.convertCSV}
 *  - {@link CIQ.I18N.language}
 *  - {@link CIQ.I18N.translateUI}
 *  - {@link CIQ.I18N.translate}
 *
 * Feel free to create your own convenience function if required to explicitly set CIQ.I18N.wordLists instead of using the CIQ.I18N.hereDoc copy-paste spreadsheet in `translations.js`.
 *
 * It is important to note that if you are dynamically creating UI content and adding it to the DOM after you have set the language,
 * you must either call {@link CIQ.I18N.translateUI} after the new content is added,
 * or ensure your code explicitly translates the new content using {@link CIQ.translatableTextNode} or {@link CIQ.ChartEngine#translateIf}.
 *
 * @param {CIQ.ChartEngine} stx A chart object
 * @param {string} language  A language in your CSV file. For instance 'en' from CIQ.I18N.csv
 * @param {string} [translationCallback]  Function to perform Canvas Built-in word translations . Default is CIQ.I18N.translate
 * @param {string} [csv] Translation spreadsheet in csv format **as a single long string**. Make sure no leading tabs, trailing commas or spaces. Default is CIQ.I18N.csv. See {@link CIQ.I18N.convertCSV} for format sample
 * @param {HTMLElement} [root] root for the TreeWalker to prevent the entire page from being translated.  If omitted, document.body assumed.
 * @memberOf CIQ.I18N
 * @since
 * - 04-2015
 * - 3.0.0 Added `root` parameter.
 * - 4.0.0 Language code for Portuguese is "pt" (formerly "pu"; maintained for backwards compatibility).
 */
CIQ.I18N.setLanguage = function (
	stx,
	language,
	translationCallback,
	csv,
	root
) {
	if (language == "pu") language = "pt"; // backward compatibility.
	CIQ.I18N.convertCSV(csv);
	CIQ.I18N.language = language;
	CIQ.I18N.translateUI(language, root);
	if (!translationCallback) translationCallback = CIQ.I18N.translate;
	stx.translationCallback = translationCallback;
};

/**
 * This method will set the chart locale.
 *
 * If set, display prices and dates will be displayed in localized format.
 * The locale should be a valid [IANA locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl).
 * For instance `de-AT` represents German as used in Austria.
 *
 * Localization in the library is supported through the `Intl object` which is a [W3 standard](https://www.w3.org/International/articles/language-tags/)  supported by all modern browsers.
 *
 * Once a locale is set, `stxx.internationalizer` will be an object that will contain several Intl formatters.
 *
 * These are the default date and time formats:
 * - stxx.internationalizer.hourMinute=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", hour12:false});
 * - stxx.internationalizer.hourMinuteSecond=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", second:"numeric", hour12:false});
 * - stxx.internationalizer.mdhm=new Intl.DateTimeFormat(this.locale, {year:"2-digit", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"});
 * - stxx.internationalizer.monthDay=new Intl.DateTimeFormat(this.locale, {month:"numeric", day:"numeric"});
 * - stxx.internationalizer.yearMonthDay=new Intl.DateTimeFormat(this.locale, {year:"numeric", month:"numeric", day:"numeric"});
 * - stxx.internationalizer.yearMonth=new Intl.DateTimeFormat(this.locale, {year:"numeric", month:"numeric"});
 * - stxx.internationalizer.month=new Intl.DateTimeFormat(this.locale, {month:"short"});
 *
 * These can be overridden manually if the specified format is not acceptable. See example.
 * Also see [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) for formatting alternatives
 *
 * @param {CIQ.ChartEngine} stx A chart object
 * @param {string} locale A valid [IANA locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), for instance en-IN
 * @param {Function} [cb] Callback when locale has been loaded. This function will be passed an error message if it cannot be loaded.
 * @param {string} [url] url where to fetch the locale data. Defaults to "locale-data/jsonp". Only used if not natively supported by the browser.
 * @param {number} [maxDecimals] maximum number of decimal places to allow on number conversions. Defaults to 5. See {@link CIQ.ChartEngine#setLocale} for more details.
 * @since 3.0.0 Added `maxDecimals` parameter.
 * @memberOf CIQ.I18N
 * @example
 * CIQ.I18N.setLocale(stxx, "zh");	// set localization services -- before any UI or chart initialization is done
 * // override time formatting to enable 12 hour clock (hour12:true)
 * stxx.internationalizer.hourMinute=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", hour12:true});
 * stxx.internationalizer.hourMinuteSecond=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", second:"numeric", hour12:true});

 */
CIQ.I18N.setLocale = function (stx, locale, cb, url, maxDecimals) {
	if (typeof Intl == "undefined" || !Intl.__addLocaleData) {
		// Intl built into browser
		stx.setLocale(locale, maxDecimals);
		if (cb) cb(null);
		return;
	}
	url = typeof url == "undefined" ? "locale-data/jsonp" : url;
	var localeFileURL = url + "/" + locale + ".js";
	var script = document.createElement("SCRIPT");
	script.async = true;
	script.src = localeFileURL;
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(script, s.nextSibling);
	script.onload = function () {
		stx.setLocale(locale, maxDecimals);
		if (cb) cb(null);
	};
	script.onerror = function () {
		if (cb) cb("cannot load script");
	};
};

/**
 * Extract the name of the month from the locale. We do this by creating a
 * localized date for the first date of each month. Then we extract the alphabetic characters.
 * MonthLetters then becomes the first letter of the month. The arrays are stored in stx.monthAbv and stx.monthLetters which
 * will then override the global arrays CIQ.monthAbv and CIQ.monthLetters.
 * @param  {CIQ.ChartEngine} stx       Chart object
 * @param  {object} formatter An Intl compatible date formatter
 * @param  {string} locale    A valid Intl locale, such as en-IN
 * @memberOf CIQ.I18N
 */
CIQ.I18N.createMonthArrays = function (stx, formatter, locale) {
	stx.monthAbv = [];
	stx.monthLetters = [];
	var dt = new Date();
	var shortenMonth = true;
	if (CIQ.I18N.longMonths && CIQ.I18N.longMonths[locale]) shortenMonth = false;
	for (var i = 0; i < 12; i++) {
		dt.setDate(1);
		dt.setMonth(i);
		var str = formatter.format(dt);
		if (shortenMonth) {
			var month = "";
			for (var j = 0; j < str.length; j++) {
				var c = str.charAt(j);
				var cc = c.charCodeAt(0);
				if (cc < 65) continue;
				month += c;
			}
			stx.monthAbv[i] = month;
			stx.monthLetters[i] = month[0];
		} else {
			stx.monthAbv[i] = str;
			stx.monthLetters[i] = str;
		}
	}
};

/**
 * A convenience function that sets locale and language at once and checks to see if candle colors should be reversed.
 * Each of these grouped functions are called with default arguments. If you require custom parameters you will need to call each separately.
 *
 * {@link CIQ.I18N.reverseColorsByLocale}  is used to determine if the colors should be reversed.
 *
 * It is important to note that if you are dynamically creating UI content and adding it to the DOM after you have set the language,
 * you must either call {@link CIQ.I18N.translateUI} after the new content is added,
 * or ensure your code explicitly translates the new content using {@link CIQ.translatableTextNode} or {@link CIQ.ChartEngine#translateIf}.
 *
 * Functions are called in the following order:
 * - {@link CIQ.I18N.setLocale}
 * - {@link CIQ.I18N.setLanguage}
 * - {@link CIQ.I18N.reverseCandles} - Called only if colors need to be reversed.
 *
 * @param {CIQ.ChartEngine} stx Chart object
 * @param  {string} locale    A valid Intl locale, such as en-IN
 * @memberOf CIQ.I18N
 * @since 4.0.0
 * @example
 * CIQ.I18N.localize(stxx, "zh");	// set translation and localization services -- before any UI or chart initialization is done
 * // override time formatting to enable 12 hour clock (hour12:true)
 * stxx.internationalizer.hourMinute=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", hour12:true});
 * stxx.internationalizer.hourMinuteSecond=new Intl.DateTimeFormat(this.locale, {hour:"numeric", minute:"numeric", second:"numeric", hour12:true});

 */
CIQ.I18N.localize = function (stx, locale) {
	var prevLocale = stx.locale; // checks to see if we're switching from a locale with reversed candles
	var reverseLocale = this.reverseColorsByLocale[locale];
	var reversePrevLocale = this.reverseColorsByLocale[prevLocale];
	this.setLocale(stx, locale);
	this.setLanguage(stx, locale);
	if (reverseLocale && reversePrevLocale) return;
	if (reverseLocale || reversePrevLocale) this.reverseCandles(stx);
};

/**
 * Some locales prefer candle colors reversed. This will reverse candle colors without changing CSS.
 * @param {CIQ.ChartEngine} stx Chart object
 * @memberOf CIQ.I18N
 * @since 4.0.0
 */
CIQ.I18N.reverseCandles = function (stx) {
	var styles = stx.styles;
	var candleDown = stx.cloneStyle(styles.stx_candle_down);
	var candleUp = stx.cloneStyle(styles.stx_candle_up);
	styles.stx_candle_up = candleDown;
	styles.stx_candle_down = candleUp;
};

/**
 * This object will be created by {@link CIQ.I18N.convertCSV} based on the provided 'CSV formatted' string,
 * or you can set it explicitly if not using {@link CIQ.I18N.setLanguage} or {@link CIQ.I18N.convertCSV}
 * @memberOf CIQ.I18N
 * @type {Object}
 * @example
 * // sample of object with translations for Arabic and Spanish
 * ( when setting explicitly without using CIQ.I18N.setLanguage or CIQ.I18N.convertCSV )
 * CIQ.I18N.wordLists={
 * 		"ar":{
 *			"1 D": "1ي",
 *			"1 Hour": "1 ساعة",
 *			"1 Min": "1د",
 *			"1 Mo": "1ش",
 *			"1 W": "أ1",
 *			"1 hour": "ساعة واحدة",
 *			"1d": "1يوم",
 *			"1m": "1شهر",
 *			"1y": "1عام",
 *			"3m": "3أشهر"
 *		},
 * 		"es":{
 * 			"1 D": "1 D",
 * 			"1 Hour": "1 Hora",
 * 			"1 Min": "1 Min",
 * 			"1 Mo": "1 Mes",
 * 			"1 W": "1 S",
 * 			"1 hour": "1 hora",
 * 			"1d": "1d",
 * 			"1m": "1m",
 * 			"1y": "1a",
 * 			"3m": "3m"
 *		}
 * }
 */
CIQ.I18N.wordLists = {
	en: {}
};

/**
 * This maps country codes to the actual name of the language *in that language*. This can be used
 * to drive UI, such as a language picker.
 * The following languages are predefined:
 * 	"en":"English",
 * The following additional languages are supported in the translationSample.js sample translations file:
 * 	"ar":"عربى",
 *	"fr":"Français",
 *	"de":"Deutsche",
 *	"hu":"Magyar",
 *	"it":"Italiano",
 *	"pt":"Português",
 *	"ru":"русский",
 *	"es":"Español",
 *	"zh":"中文",
 *	"ja":"日本語"
 * You may add additional language as follows:
 * CIQ.I18N.languages.ko="한국어";
 * You may also remove unsupported languages by deleting them from the object, or redefining this object with the languages you prefer to support.
 * @type {Object}
 */
CIQ.I18N.languages = {
	en: "English"
};

};

let __js_standard_interaction_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Contains information about the latest set of pointer events on the chart.
 *
 * Events are pushed into `down` or `up` from pointer or mouse up or down events. The 0 index is
 * always the current up/down event. The 1 index is always the previous up/down event.
 *
 * @member CIQ.ChartEngine
 * @type {object}
 * @private
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.pointerEvents = {
	/**
	 * Holds information about the previous and current down events.
	 * @property {array}
	 */
	down: [],
	/**
	 * Holds information about the previous and current up events.
	 * @property {array}
	 */
	up: []
};

/**
 * The maximum number of milliseconds between clicks that trigger a double-click.
 *
 * @alias doubleClickTime
 * @memberof CIQ.ChartEngine.prototype
 * @type {number}
 * @default
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.doubleClickTime = 250;

/**
 * If true when the chart initially is rendered, then the CIQ.ChartEngine object will register to listen and manage touch and mouse browser events within then canvas by attaching them to the container div.
 *
 * Set to false, and all interactivity with the chart will cease; turning it into a static display and 'shedding' all HTML overlays and events required for user interaction, for a much more lightweight interface.
 * Alternatively you can selectively set any {@link CIQ.ChartEngine#htmlControls} id to null, including `CIQ.ChartEngine.htmlControls=null` to disable them all.
 *
 * See the {@tutorial Creating Static Charts} tutorial for more details.
 *
 * It is possible to re-enable the events after the chart has been rendered, but you must call stx.initializeChart(); stx.draw(); to register the events once again.
 * @type boolean
 * @default
 * @alias manageTouchAndMouse
 * @memberof CIQ.ChartEngine.prototype
 * @example
 * // if enabling events after the chart was already rendered, you must reinitialize to re register the browser events.
 * stxx.manageTouchAndMouse = true;
 * stxx.initializeChart();
 * stxx.draw();
 */
CIQ.ChartEngine.prototype.manageTouchAndMouse = true;

/**
 * Registers touch and mouse events for the chart (for dragging, clicking, zooming). The events are registered on the container div (not the canvas).
 * Set {@link CIQ.ChartEngine#manageTouchAndMouse} to false to disable the built in event handling (events will not be registered with the container).
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.registerTouchAndMouseEvents = function () {
	if (this.touchAndMouseEventsRegistered) return;
	this.touchAndMouseEventsRegistered = true;
	var source = this.controls.chartControls || document;
	var zoomInEl = source.querySelector(".stx-zoom-in");
	var zoomOutEl = source.querySelector(".stx-zoom-out");
	var containerElement = this.chart.container;
	var self = this;
	var addListener = function (event, listener, options) {
		function uberListener(args) {
			if (self.mainSeriesRenderer && self.mainSeriesRenderer.nonInteractive)
				return;
			listener(args);
		}
		self.addDomEventListener(containerElement, event, uberListener, options);
	};
	if (!CIQ.touchDevice) {
		addListener("mousemove", function (e) {
			self.mousemove(e);
		});
		addListener("mouseenter", function (e) {
			self.mousemove(e);
		});
		addListener("mousedown", function (e) {
			self.mousedown(e);
		});
		addListener("mouseup", function (e) {
			self.mouseup(e);
		});
	} else {
		if (CIQ.isSurface) {
			addListener("mousemove", function (e) {
				self.msMouseMoveProxy(e);
			});
			addListener("mouseenter", function (e) {
				self.msMouseMoveProxy(e);
			});
			addListener("mousedown", function (e) {
				self.msMouseDownProxy(e);
			});
			addListener("mouseup", function (e) {
				self.msMouseUpProxy(e);
			});

			addListener("pointerdown", function (e) {
				return self.startProxy(e);
			});
			addListener("pointermove", function (e) {
				self.moveProxy(e);
			});
			addListener("pointerenter", function (e) {
				return self.moveProxy(e);
			});
			addListener("pointerup", function (e) {
				return self.endProxy(e);
			});
		} else {
			// We need mouse events for all-in-one computers that accept both mouse and touch commands
			// Actually, only for Firefox and Chrome browsers. IE10 sends pointers which are managed by the isSurface section
			if (!CIQ.isMobile) {
				addListener("mousemove", function (e) {
					self.iosMouseMoveProxy(e);
				});
				addListener("mouseenter", function (e) {
					self.iosMouseMoveProxy(e);
				});
				addListener("mousedown", function (e) {
					self.iosMouseDownProxy(e);
				});
				addListener("mouseup", function (e) {
					self.iosMouseUpProxy(e);
				});
			}

			addListener("touchstart", function (e) {
				self.touchstart(e);
			});
			addListener("touchmove", function (e) {
				self.touchmove(e);
			});
			addListener("touchend", function (e) {
				self.touchend(e);
			});

			// capture a "pen" device, so we can treat it as a mouse
			addListener("pointerdown", function (e) {
				self.touchPointerType = e.pointerType;
			});

			if (zoomInEl) {
				zoomInEl.removeAttribute("onMouseOver");
				zoomInEl.removeAttribute("onMouseOut");
			}
			if (zoomOutEl) {
				zoomOutEl.removeAttribute("onMouseOver");
				zoomOutEl.removeAttribute("onMouseOut");
			}
		}
	}

	var wheelEvent = CIQ.wheelEvent;

	if (this.captureMouseWheelEvents) {
		addListener(
			wheelEvent,
			function (e) {
				self.mouseWheel(e);
			},
			{ passive: false }
		);
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * Called when the user presses the mouse button down. This will activate dragging operations once the user moves a few pixels
 * within {@link CIQ.ChartEngine#mousemoveinner}.
 * @param  {Event} e The mouse event
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias mousedown
 */
CIQ.ChartEngine.prototype.mousedown = function (e) {
	if (this.runPrepend("mousedown", arguments)) return;
	this.grabOverrideClick = false;
	//if(this.openDialog!=="") return;
	if (!this.displayInitialized) return; // No chart displayed yet
	if (!this.displayCrosshairs) return;
	if (this.repositioningDrawing) return; // if mouse went off screen this might happen
	if (this.editingAnnotation) return;
	if (e.button && e.button >= 2) {
		// only trigger for a primary mouse down event.
		return;
	}
	var rect = this.container.getBoundingClientRect();
	this.top = rect.top;
	this.left = rect.left;
	this.right = this.left + this.width;
	this.bottom = this.top + this.height;
	if (
		e.clientX >= this.left &&
		e.clientX <= this.right &&
		e.clientY >= this.top &&
		e.clientY <= this.bottom
	) {
		this.insideChart = true;
	} else {
		this.insideChart = false;
		return;
	}
	if (!this.currentPanel) return;
	if (
		this.manageTouchAndMouse &&
		e &&
		e.preventDefault &&
		this.captureTouchEvents
	)
		e.preventDefault(); // Added 9/19/13 to prevent IE from going into highlight mode when you mouseout of the container
	this.mouseTimer = Date.now();
	this.longHoldTookEffect = false;
	this.hasDragged = false;
	this.userPointerDown = true;

	// only register the pointerEvent if there is nothing open over the chart
	if (this.openDialog === "")
		this.registerPointerEvent(
			{ x: e.clientX, y: e.clientY, time: this.mouseTimer },
			"down"
		);

	var chart = this.currentPanel.chart;
	for (var i = 0; i < this.drawingObjects.length; i++) {
		var drawing = this.drawingObjects[i];
		if (drawing.highlighted && !drawing.permanent) {
			if (this.cloneDrawing) {
				// clone a drawing if flag set
				var Factory = CIQ.ChartEngine.drawingTools[drawing.name];
				var clonedDrawing = new Factory();
				clonedDrawing.reconstruct(this, drawing.serialize());
				this.drawingObjects.push(clonedDrawing);
				this.activateRepositioning(clonedDrawing);
				clonedDrawing.repositioner = drawing.repositioner;
				return;
			}
			var drawingTool = this.currentVectorParameters.vectorType;
			// do not allow repositioning if the drawing tool has dragToDraw (like the freeform)
			if (
				!CIQ.Drawing ||
				!drawingTool ||
				!CIQ.Drawing[drawingTool] ||
				!new CIQ.Drawing[drawingTool]().dragToDraw
			) {
				this.activateRepositioning(drawing);
				return;
			}
		}
	}
	var mainSeriesRenderer = this.mainSeriesRenderer || {};
	if (
		mainSeriesRenderer.params &&
		mainSeriesRenderer.params.baseline &&
		chart.baseline.userLevel !== false &&
		this.controls.baselineHandle
	) {
		var y0 = this.valueFromPixel(this.cy - 5, this.currentPanel);
		var y1 = this.valueFromPixel(this.cy + 5, this.currentPanel);
		var x0 =
			this.chart.right -
			parseInt(getComputedStyle(this.controls.baselineHandle).width, 10);
		if (
			chart.baseline.actualLevel < Math.max(y0, y1) &&
			chart.baseline.actualLevel > Math.min(y0, y1) &&
			this.cx > x0
		) {
			this.repositioningBaseline = { lastDraw: Date.now() };
			this.controls.baselineHandle.classList.add("stx-grab");
			return;
		}
	}
	if (this.drawingClick) {
		if (this.currentPanel.subholder === e.target)
			this.drawingClick(this.currentPanel, this.cx, this.cy);
		if (this.activeDrawing && this.activeDrawing.dragToDraw) return;
	}

	this.grabbingScreen = true;
	chart.spanLock = false;
	this.yToleranceBroken = false;
	/* use e.client instead of e.page since we need the value to be relative to the viewport instead of the overall document size.
		if(!e.pageX){
			e.pageX=e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			e.pageY=e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		*/
	this.grabStartX = e.clientX;
	this.grabStartY = e.clientY;
	this.grabStartMicropixels = this.micropixels;
	this.grabStartScrollX = chart.scroll;
	this.grabStartScrollY = this.currentPanel.yAxis.scroll;
	this.grabStartCandleWidth = this.layout.candleWidth;
	this.grabStartYAxis = this.whichYAxis(this.currentPanel);
	this.grabStartZoom = this.grabStartYAxis ? this.grabStartYAxis.zoom : 0;
	this.grabStartPanel = this.currentPanel;

	setTimeout(
		(function (self) {
			return function () {
				self.grabbingHand();
			};
		})(this),
		100
	);
	if (this.swipeStart) this.swipeStart(chart);
	if (this.longHoldTime || this.longHoldTime === 0) this.startLongHoldTimer();
	this.runAppend("mousedown", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Handles mouse movement events. This method calls {@link CIQ.ChartEngine#mousemoveinner} which has the core logic
 * for dealing with panning and zooming. See also {@link CIQ.ChartEngine.AdvancedInjectable#touchmove} which is the equivalent method for touch events.
 * @param {Event} mouseEvent A mouse move event
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias mousemove
 */
CIQ.ChartEngine.prototype.mousemove = function (mouseEvent) {
	var e = mouseEvent;
	/* use e.client instead of e.page since we need the value to be relative to the viewport instead of the overall document size.
		if(!e.pageX){
			e.pageX=e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			e.pageY=e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		*/
	CIQ.ChartEngine.crosshairX = e.clientX; // These are used by the UI so make sure they are set even if no chart is set
	CIQ.ChartEngine.crosshairY = e.clientY;
	if (e.type.toLowerCase().indexOf("enter") > -1) {
		this.positionCrosshairsAtPointer();
		return;
	}
	if (this.runPrepend("mousemove", arguments)) return;
	if (!this.displayInitialized) return; // No chart displayed yet
	if (this.openDialog !== "") return; // Don't show crosshairs when dialog is open
	if (this.grabbingScreen && e.buttons !== 1) {
		this.cancelLongHold = true;
		this.displayDragOK();
		// Added 9/19/2013 to unleash grabbing when the mouse moves out of the container
		this.grabbingScreen = false;
		this.findHighlights(false, true);
	}
	this.mousemoveinner(e.clientX, e.clientY);
	this.runAppend("mousemove", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Called whenever the user lifts the mousebutton up. This may send a click to a drawing, or cease a drag operation.
 * @param  {Event} e A mouse event
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias mouseup
 * @since 6.3.0 baseline chart recenters itself after adjusting baseline
 */
CIQ.ChartEngine.prototype.mouseup = function (e) {
	if (this.runPrepend("mouseup", arguments)) return;
	this.swipe.end = true;
	this.cancelLongHold = true;
	if (this.repositioningDrawing) {
		// if we single click with a drawing tool enabled, then start another drawing instead of moving current one
		if (
			!this.currentVectorParameters.vectorType ||
			Date.now() - this.mouseTimer > 250
		) {
			this.changeOccurred("vector");
			CIQ.clearCanvas(this.chart.tempCanvas, this);
			this.activateRepositioning(null);
			this.adjustDrawings();
			this.draw();
			return;
		}
		this.activateRepositioning(null);
	}

	if (this.repositioningBaseline) {
		this.repositioningBaseline = null;
		this.controls.baselineHandle.classList.remove("stx-grab");
		var mainSeriesRenderer = this.mainSeriesRenderer || {};
		if (
			mainSeriesRenderer.params &&
			mainSeriesRenderer.params.baseline &&
			mainSeriesRenderer.params.type != "mountain"
		) {
			//this is so the baseline does not pop back to the center
			//this.chart.panel.yAxis.scroll=this.pixelFromPrice(this.chart.baseline.userLevel, this.chart.panel)-(this.chart.panel.yAxis.top+this.chart.panel.yAxis.bottom)/2;
		}
		this.draw();
		return;
	}
	var wasMouseDown = this.userPointerDown;
	this.userPointerDown = false;
	if (!this.displayInitialized) return; // No chart displayed yet

	var cy = this.backOutY(e.clientY);
	var cx = this.backOutX(e.clientX);
	var isRightClick = (e.which && e.which >= 2) || (e.button && e.button >= 2);
	var openDialog = this.openDialog !== "";

	if (!openDialog && !isRightClick)
		this.registerPointerEvent(
			{ x: e.clientX, y: e.clientY, time: Date.now() },
			"up"
		);
	var isDblClick = this.isDoubleClick();

	this.grabbingScreen = false;
	if (this.highlightedDraggable) {
		if (this.dragPlotOrAxis) this.dragPlotOrAxis(cx, cy);
		this.currentPanel = this.whichPanel(cy);
	}
	var panel = this.currentPanel;

	this.grabStartYAxis = null;
	this.displayDragOK();
	if (this.openDialog !== "") {
		if (this.insideChart) this.container.classList.remove("stx-drag-chart"); //in case they were grabbing the screen and let go on top of the button.
		return;
	}
	if (this.grabOverrideClick) {
		if (!this.overXAxis && !this.overYAxis && this.swipeRelease)
			this.swipeRelease();
		this.container.classList.remove("stx-drag-chart");
		this.grabOverrideClick = false;
		this.doDisplayCrosshairs();
		this.updateChartAccessories();
		return;
	}
	//if(!this.displayCrosshairs) return;
	if (this.insideChart) this.container.classList.remove("stx-drag-chart");
	if (CIQ.ChartEngine.resizingPanel) {
		this.releaseHandle();
		//CIQ.clearCanvas(this.chart.tempCanvas, this);
		//this.resizePanels();
		//CIQ.ChartEngine.resizingPanel=null;
		return;
	}
	if (isRightClick || e.ctrlKey) {
		if (this.anyHighlighted && this.bypassRightClick !== true) {
			this.rightClickHighlighted();
			if (e.preventDefault && this.captureTouchEvents) e.preventDefault();
			e.stopPropagation();
			return false;
		}
		this.dispatch("rightClick", { stx: this, panel: panel, x: cx, y: cy });
		return true;
	}
	if (e.clientX < this.left || e.clientX > this.right) return;
	if (e.clientY < this.top || e.clientY > this.bottom) return;

	var targettingSubholder = panel && panel.subholder === e.target;
	// Unlike drawings and marker clicks, allow doubleClick to target axis outside panel subholder
	if (isDblClick && (targettingSubholder || this.overYAxis || this.overXAxis)) {
		this.doubleClick({ button: e.button, x: cx, y: cy });
	} else {
		if (wasMouseDown && targettingSubholder) {
			if (!this.longHoldTookEffect || this.activeDrawing)
				this.drawingClick(panel, cx, cy);
			if (!this.longHoldTookEffect && this.activeMarker)
				this.activeMarker.click({ cx, cy, panel });
		}
		if (!this.longHoldTookEffect && !this.activeDrawing) {
			this.dispatch("tap", { stx: this, panel: panel, x: cx, y: cy });
		}
	}
	this.runAppend("mouseup", arguments);
};

/**
 * Adds an event to the `pointerEvents` array for a given type.
 *
 * **This is the only method that should ever add entries to a `pointerEvents` array.**
 *
 * @param {object} info The event object.
 * @param {string} type Event type to which the event is added. Valid types are 'up' and 'down'.
 *
 * @memberof CIQ.ChartEngine
 * @private
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.registerPointerEvent = function (info, type) {
	if (this.pointerEvents[type].length > 1) this.pointerEvents[type].pop();
	this.pointerEvents[type].unshift(info);
};

/**
 * Resets a `pointerEvents` array to an initial empty state.
 *
 * **This is the only method that should ever clear entries from a `pointerEvents` array.**
 *
 * @param {string} type The event type for which all events are removed. Valid types are 'up'
 * 		and 'down'.
 *
 * @memberof CIQ.ChartEngine
 * @private
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.resetPointerEvent = function (type) {
	this.pointerEvents[type].splice(0);
};

/**
 * Determines whether the chart has received a double-click based on the `pointerEvents`
 * tuple. This method double-checks the coordinates and timing of the last two clicks to
 * determine:
 *  - the clicks were within {@link CIQ.ChartEngine.prototype.doubleClickTime}
 *  - the clicks were within 20px of each other
 *  - neither click was a long-hold
 *
 * If a double-click was determined to have happened, then we reset the `pointerEvents` array
 * for 'up' and 'down'.
 *
 * @memberof CIQ.ChartEngine
 * @private
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.isDoubleClick = function () {
	const { up, down } = this.pointerEvents;
	if (up.length < 2 || down.length < 2) return false;
	const doubleClick =
		down[0].time - up[1].time < this.doubleClickTime &&
		Math.pow(up[1].x - up[0].x, 2) + Math.pow(up[1].y - up[0].y, 2) <= 400 &&
		up[1].time - down[1].time < this.longHoldTime &&
		up[0].time - down[0].time < this.longHoldTime;

	if (doubleClick) {
		this.resetPointerEvent("up");
		this.resetPointerEvent("down");
	}
	return doubleClick;
};

/**
 * Handles all double-clicks on the chart container.
 *
 * Applies a double-click event to a {@link CIQ.Marker} and dispatches the `doubleClick` event,
 * which invokes the {@link doubleClickEventListener}.
 *
 * If the return value of the marker's {@link CIQ.Marker#doubleClick} method is truthy, the
 * `doubleClick` event is not dispatched.
 *
 * @param {number} button The button used to double-click.
 * @param {number} x The x-axis coordinate of the double-click.
 * @param {number} y The y-axis coordinate of the double-click.
 *
 * @alias doubleClick
 * @memberof CIQ.ChartEngine.prototype
 * @since 8.0.0
 */
CIQ.ChartEngine.prototype.doubleClick = function (button, x, y) {
	if (this.runPrepend("doubleClick", arguments)) return;
	if (this.editingAnnotation) return;
	if (CIQ.ChartEngine.drawingLine) return this.undo();
	if (this.activeDrawing) return;

	let handledMarker =
		this.activeMarker &&
		this.activeMarker.doubleClick({ cx: x, cy: y, panel: this.currentPanel });
	if (!handledMarker)
		this.dispatch("doubleClick", { stx: this, button: button, x: x, y: y });

	this.runAppend("doubleClick", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * This is called whenever the mouse leaves the chart area. Crosshairs are disabled, stickies are hidden, dragDrawings are completed.
 * @param  {Event} e The mouseout event
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias handleMouseOut
 */
CIQ.ChartEngine.prototype.handleMouseOut = function (e) {
	e = e || window.event;
	if (!CIQ.withinElement(this.chart.container, e.pageX, e.pageY)) {
		if (this.runPrepend("handleMouseOut", arguments)) return;
		if (!this.grabbingScreen) this.findHighlights(null, true);
		this.undisplayCrosshairs();
		this.touches = [];
		this.touching = false;
		if (this.activeDrawing && this.userPointerDown) {
			//end the drawing
			this.userPointerDown = false;
			this.drawingLine = false;
			var cy = this.backOutY(e.pageY);
			var cx = this.backOutX(e.pageX);
			this.drawingClick(this.currentPanel, cx, cy);
		}
		this.insideChart = false;
		this.overYAxis = false;
		this.overXAxis = false;
		// Added to remove sticky when the mouse moves out of the container
		this.displaySticky();
		this.runAppend("handleMouseOut", arguments);
	}
};

CIQ.ChartEngine.prototype.startLongHoldTimer = function () {
	var stx = this;
	this.cancelLongHold = false;
	if (this.longHoldTimeout) clearTimeout(this.longHoldTimeout);
	var cb = function () {
		if (stx.cancelLongHold) return;
		stx.longHoldTookEffect = true;
		stx.dispatch("longhold", {
			stx: stx,
			panel: stx.currentPanel,
			x: stx.cx,
			y: stx.cy
		});
		stx.displayDragOK();
	};
	if (this.longHoldTime) {
		this.longHoldTimeout = setTimeout(cb, this.longHoldTime);
	} else if (this.longHoldTime === 0) {
		cb();
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * Event handler that is called when the handle of a panel is grabbed, for resizing
 * @param  {Event} e	 The mousedown or touchdown event
 * @param  {CIQ.ChartEngine.Panel} panel The panel that is being grabbed
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias grabHandle
 */
CIQ.ChartEngine.prototype.grabHandle = function (panel) {
	if (this.runPrepend("grabHandle", arguments)) return;
	//if(e.preventDefault) e.preventDefault();
	if (!panel) return;
	CIQ.ChartEngine.crosshairY = panel.top + this.top;
	CIQ.ChartEngine.resizingPanel = panel;
	panel.handle.classList.add("stx-grab");
	this.runAppend("grabHandle", arguments);
};

/**
 * Turns on the grabbing hand cursor. It does this by appending the class "stx-drag-chart" to the chart container.
 * If this is a problem then just eliminate this function from the prototype.
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.grabbingHand = function () {
	if (!this.allowScroll) return;
	if (!this.grabbingScreen) return;
	if (CIQ.touchDevice) return;
	this.container.classList.add("stx-drag-chart");
};

/**
 * <span class="injection">INJECTABLE</span>
 * Event handler that is called when a panel handle is released.
 * @param  {Event} e The mouseup or touchup event
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias releaseHandle
 */
CIQ.ChartEngine.prototype.releaseHandle = function () {
	if (this.runPrepend("releaseHandle", arguments)) return true;
	//if(e.preventDefault) e.preventDefault();
	CIQ.clearCanvas(this.chart.tempCanvas, this);
	this.resizePanels();
	if (CIQ.ChartEngine.resizingPanel)
		CIQ.ChartEngine.resizingPanel.handle.classList.remove("stx-grab");
	CIQ.ChartEngine.resizingPanel = null;
	this.runAppend("releaseHandle", arguments);
};

/**
 * Finds any objects that should be highlighted by the current crosshair position. All drawing objects have their highlight() method
 * called in order that they may draw themselves appropriately.
 * @param  {boolean} isTap If true then it indicates that the user tapped the screen on a touch device, and thus a wider radius is used to determine which objects might have been highlighted.
 * @param {boolean} clearOnly Set to true to clear highlights
 * @memberof CIQ.ChartEngine
 * @since 4.0.0 {@link CIQ.ChartEngine#displaySticky} is now called to display the 'series.symbol' if the 'series.display' is not present
 */
CIQ.ChartEngine.prototype.findHighlights = function (isTap, clearOnly) {
	var radius = this.preferences[
		isTap ? "highlightsTapRadius" : "highlightsRadius"
	]; // 30:10
	this.highlightViaTap = isTap; // internal use state var
	var cy = this.cy;
	var cx = this.cx;
	this.anyHighlighted = false;
	if (!this.currentPanel) return;
	if (this.activeDrawing) clearOnly = true;
	var somethingChanged = false;
	var drawingToMeasure = null;
	var stickyArgs = clearOnly ? {} : { forceShow: true, type: "drawing" };

	var chart = this.currentPanel.chart;
	var box = {
		x0: this.tickFromPixel(cx - radius, chart),
		x1: this.tickFromPixel(cx + radius, chart),
		y0: this.valueFromPixel(cy - radius, this.currentPanel),
		y1: this.valueFromPixel(cy + radius, this.currentPanel),
		cx0: cx - radius,
		cx1: cx + radius,
		cy0: cy - radius,
		cy1: cy + radius,
		r: radius
	};
	if (this.repositioningDrawing && box.x1 - box.x0 < 2) {
		box.x1++;
		box.x0--;
	} else if (box.x1 == box.x0) {
		box.x0 -= 0.5;
		box.x1 += 0.5;
	}
	var markers =
		this.markerHelper &&
		this.markerHelper.chartMap[chart.name] &&
		this.markerHelper.chartMap[chart.name].markers;
	/* begin test code
		// show the box
		this.chart.canvas.context.strokeStyle="red";
		this.chart.canvas.context.strokeRect(this.pixelFromTick(box.x0,chart),cy-radius,this.pixelFromTick(box.x1,chart)-this.pixelFromTick(box.x0,chart),2*radius);
		this.chart.canvas.context.strokeStyle="blue";
		this.chart.canvas.context.strokeRect(cx-radius,cy-radius,2*radius,2*radius);
		  end test code */

	if (!chart.hideDrawings) {
		for (var i = this.drawingObjects.length - 1; i >= 0; i--) {
			var drawing = this.drawingObjects[i];
			if (!this.panels[drawing.panelName]) continue;
			if (this.repositioningDrawing && this.repositioningDrawing != drawing)
				continue;

			var prevHighlight = drawing.highlighted;
			var highlightMe = drawing.panelName == this.currentPanel.name;
			drawing.repositioner = drawing.intersected(
				this.crosshairTick,
				this.crosshairValue,
				box
			);
			highlightMe = highlightMe && drawing.repositioner;

			if (!clearOnly && highlightMe) {
				if (prevHighlight) {
					drawingToMeasure = drawing;
					if (this.anyHighlighted && this.singleDrawingHighlight)
						drawing.highlighted = false;
					if (drawing.highlighted && drawing.highlighted != prevHighlight)
						somethingChanged = true; // drawing is still highlighted, but a different positioner is active
				} else if (prevHighlight != drawing.highlight(true)) {
					if (!drawingToMeasure) drawingToMeasure = drawing;
					if (this.anyHighlighted && this.singleDrawingHighlight)
						drawing.highlighted = false;
					somethingChanged = true;
				}
				this.anyHighlighted = true;
			} else {
				if (prevHighlight != drawing.highlight(false)) {
					somethingChanged = true;
				}
			}
			if (drawing.highlighted) {
				stickyArgs.noDelete = drawing.permanent;
				stickyArgs.noEdit = !this.callbackListeners.drawingEdit.length;
			}
		}
	}

	var n, o, m, marker, series;
	for (n in this.layout.studies) {
		o = this.layout.studies[n];
		o.prev = o.highlight;
		o.highlight = this.yaxisMatches(o, this.grabStartYAxis);
	}
	for (n in chart.seriesRenderers) {
		var r = chart.seriesRenderers[n];
		r.params.highlight = this.yaxisMatches(r, this.grabStartYAxis);
		for (var j = 0; j < r.seriesParams.length; j++) {
			series = r.seriesParams[j];
			series.prev = series.highlight;
			series.highlight = r.params.highlight;
		}
	}
	for (m = 0; markers && m < markers.length; m++) {
		marker = markers[m];
		if (!marker.params.box) continue; // Only created when the dataSegment is drawn for performance markers
		this.activeMarker = null;
		marker.prev = markers[m].highlight;
		marker.highlight = false;
	}
	if (this.markerHelper) this.markerHelper.highlighted = [];
	this.highlightedDataSetField = null;
	this.highlightedDraggable = null;

	// Function to detect if a "box" drawn around the cursor position is intersected by the overlay.
	// Up to two overlay segments may be tested:
	// The segment endpointed by the previous dataSet element containing that field and the current dataSet element behind the cursor,
	// and the current dataSet element behind the cursor and the next dataSet element containing that field.
	// In case there are gaps in the data, one of these segments may not exist.
	// This routine is designed to also handle comparison overlays which cause the dataSet to be transformed.
	// The argument "fullField" represents the series symbol and the subField, separated by a period (e.g. GOOG.High).
	// If there is no subField, a subField of Close is presumed.
	function isOverlayIntersecting(refBar, box, fullField, yAxis, renderer, id) {
		var chart = this.chart,
			currentPanel = this.currentPanel;
		if (!yAxis) yAxis = currentPanel.yAxis;
		var parts = fullField.split("-->");
		var field = parts[0];
		var subField = parts[1];
		if (!subField) subField = "Close";
		function getVal(quote) {
			if (!quote) return null;
			var theVal = quote[field];
			if (theVal && (theVal[subField] || theVal[subField] === 0)) {
				// For OHLC, hover over imaginary line connecting closes
				theVal = theVal[subField];
			}
			if (renderer && renderer.getBasis)
				theVal += renderer.getBasis(quote, field, subField);
			if (!chart.transformFunc || yAxis != chart.yAxis) return theVal;
			else if (quote.transform && field in quote.transform) {
				theVal = quote.transform[field];
				if (theVal && (theVal[subField] || theVal[subField] === 0)) {
					// For OHLC, hover over imaginary line connecting closes
					theVal = theVal[subField];
				}
				return theVal;
			}
			return chart.transformFunc(this, chart, theVal);
		}
		var quote = chart.dataSegment[bar],
			quotePrev,
			quoteNext;
		var val,
			valPrev,
			valNext,
			tick = null,
			tickPrev = null,
			tickNext = null;
		var usedCache = new Array(3);
		var cache = renderer && renderer.caches[id];
		if (quote && cache) {
			val = cache[bar];
			tick = quote.tick;
			if (val || val === 0) usedCache[0] = 1;
			var ci;
			for (ci = bar - 1; ci >= 0; ci--) {
				if (cache[ci] || cache[ci] === 0) {
					valPrev = cache[ci];
					tickPrev = tick - (bar - ci);
					usedCache[1] = 1;
					break;
				}
			}
			for (ci = bar + 1; ci < chart.dataSegment.length; ci++) {
				if (cache[ci] || cache[ci] === 0) {
					valNext = cache[ci];
					tickNext = tick - (bar - ci);
					usedCache[2] = 1;
					break;
				}
			}
		}
		if (tickPrev === null) {
			quotePrev = this.getPreviousBar.call(this, chart, fullField, bar);
			if (quotePrev) {
				tickPrev = quotePrev.tick;
				valPrev = getVal(quotePrev);
			}
		}
		if (tickNext === null) {
			quoteNext = this.getNextBar.call(this, chart, fullField, bar);
			if (quoteNext) {
				tickNext = quoteNext.tick;
				valNext = getVal(quoteNext);
			}
		}
		if (tickPrev === null && tickNext === null) return false;

		if (!cache) {
			val = getVal(quote);
			valPrev = getVal(quotePrev);
			valNext = getVal(quoteNext);
			tick = quote.tick;
			if (quotePrev) tickPrev = quotePrev.tick;
			if (quoteNext) tickNext = quoteNext.tick;
		}

		if (!valPrev && valPrev !== 0) {
			valPrev = 0;
			tickPrev = 0;
		}
		if (!valNext && valNext !== 0) {
			if (val || val === 0) {
				valNext = val;
				usedCache[2] = usedCache[0];
			} else {
				valNext = valPrev;
				usedCache[2] = usedCache[1];
			}
			if (id && chart.series[id].parameters.extendToEndOfDataSet) {
				tickNext = chart.dataSet.length - 1;
			} else {
				tickNext = tickPrev;
			}
		}
		if (!val && val !== 0) {
			val = valNext;
			tick = tickNext;
			usedCache[0] = usedCache[2];
			if (valPrev === 0 && tickPrev === 0) {
				valPrev = val;
				tickPrev = tick;
				usedCache[1] = usedCache[0];
			}
		}

		// The following code will get the pixel value of the price from either the renderer's series cache or the computation.
		// Then it will convert the pixel value back to the price value for the current panel's axis.
		// Using the cache is the only way to go for an overlay.  There is a shortcoming for the overlay though, in that
		// if valPrev or valNext were off the screen, they wouldn't be in the cache and so their y axis value would be inaccurate.

		var pftv = this.pixelFromTransformedValue.bind(this),
			vfp = this.valueFromPixel.bind(this);
		val = vfp(
			usedCache[0] ? val : pftv(val, currentPanel, yAxis),
			currentPanel
		);
		valPrev = vfp(
			usedCache[1] ? valPrev : pftv(valPrev, currentPanel, yAxis),
			currentPanel
		);
		valNext = vfp(
			usedCache[2] ? valNext : pftv(valNext, currentPanel, yAxis),
			currentPanel
		);

		var pixelBox = CIQ.convertBoxToPixels(this, currentPanel.name, box);
		var pixelPoint1 = CIQ.convertBoxToPixels(this, currentPanel.name, {
			x0: tickPrev,
			y0: valPrev,
			x1: tick,
			y1: val
		});
		var pixelPoint2 = CIQ.convertBoxToPixels(this, currentPanel.name, {
			x0: tick,
			y0: val,
			x1: tickNext,
			y1: valNext
		});
		if (
			CIQ.boxIntersects(
				pixelBox.x0,
				pixelBox.y0,
				pixelBox.x1,
				pixelBox.y1,
				pixelPoint1.x0,
				pixelPoint1.y0,
				pixelPoint1.x1,
				pixelPoint1.y1,
				"segment"
			) ||
			CIQ.boxIntersects(
				pixelBox.x0,
				pixelBox.y0,
				pixelBox.x1,
				pixelBox.y1,
				pixelPoint2.x0,
				pixelPoint2.y0,
				pixelPoint2.x1,
				pixelPoint2.y1,
				"segment"
			)
		) {
			return true;
		}
		return false;
	}

	if (!clearOnly && !this.anyHighlighted && chart.dataSegment) {
		var bar = this.barFromPixel(cx);
		if (bar >= 0 && bar < chart.dataSegment.length) {
			var y;
			for (n in this.overlays) {
				o = this.overlays[n];
				if (o.panel != this.currentPanel.name) continue;

				//custom highlight detection
				if (o.study.isHighlighted === false) continue;
				else if (typeof o.study.isHighlighted == "function") {
					if (o.study.isHighlighted(this, cx, cy)) {
						o.highlight = true;
						this.anyHighlighted = true;
					}
					continue;
				}

				var quote = chart.dataSegment[bar];
				if (!quote) continue;

				for (var out in o.outputMap) {
					if (
						isOverlayIntersecting.call(this, bar, box, out, o.getYAxis(this))
					) {
						if (o.name != o.panel) this.anyHighlighted = true;
						o.highlight = out;
						break;
					}
				}
				if (o.highlight) {
					this.highlightedDataSetField = out;
					break; // only allow one overlay to be highlighted at a time
				}
			}
			for (n in chart.seriesRenderers) {
				if (this.highlightedDataSetField) break;
				var renderer = chart.seriesRenderers[n];
				var rendererPanel = renderer.params.panel;
				if (renderer == this.mainSeriesRenderer) continue;
				if (
					!renderer.params.highlightable &&
					!this.currentVectorParameters.vectorType
				)
					continue;
				if (rendererPanel != this.currentPanel.name) continue;
				for (m = 0; m < renderer.seriesParams.length; m++) {
					series = renderer.seriesParams[m];
					var fullField = series.field;
					if (!fullField && !renderer.highLowBars)
						fullField = this.defaultPlotField || "Close";
					if (series.symbol && series.subField)
						fullField += "-->" + series.subField;
					var yAxis = renderer.params.yAxis;
					if (!yAxis && rendererPanel) yAxis = this.panels[rendererPanel].yAxis;
					if (renderer.params.step && bar > 0) {
						// In a step series we also need to check for intersection with
						// the vertical bar (the step) that connects two points
						if (!renderer.caches[series.id]) continue;
						y = renderer.caches[series.id][bar];
						if (!y && y !== 0) continue;
						var py = renderer.caches[series.id][bar - 1];
						if (
							((py || py === 0) && cy + radius >= y && cy - radius <= py) ||
							(cy - radius <= y && cy + radius >= py)
						) {
							series.highlight = true;
							this.anyHighlighted = true;
						}
					} else if (
						isOverlayIntersecting.call(
							this,
							bar,
							box,
							fullField,
							yAxis,
							renderer,
							series.id
						)
					) {
						series.highlight = true;
						this.anyHighlighted = true;
					}
					if (series.highlight) {
						this.highlightedDataSetField = fullField;
						break;
					}
				}
			}
		}
	}
	var highlightedDraggable;
	var drag = this.preferences.dragging;

	var yAxisToHighlight;

	for (n in this.overlays) {
		o = this.overlays[n];
		if (o.highlight) {
			this.anyHighlighted = true;
			var display = o.inputs.display || o.name;
			display = this.translateIf(display);
			stickyArgs = {
				message: display,
				noDelete: o.permanent,
				noEdit: !o.editFunction,
				type: "study"
			};
			drawingToMeasure = null;
			if (drag === true || (drag && drag.study)) highlightedDraggable = o;

			// Find corresponding y-axis
			yAxisToHighlight = o.getYAxis(this);
		}
		if (o.prev != o.highlight) somethingChanged = true;
	}

	for (n in chart.seriesRenderers) {
		var r2 = chart.seriesRenderers[n];
		var bColor = r2.params.yAxis ? r2.params.yAxis.textStyle : null;
		for (var m2 = 0; m2 < r2.seriesParams.length; m2++) {
			series = r2.seriesParams[m2];
			if (r2.params.highlightable && series.highlight) {
				this.anyHighlighted = true;
				var bgColor = series.color || bColor;
				if (bgColor == "auto") bgColor = this.defaultColor;
				if (series.opacity && series.opacity !== 1)
					bgColor = CIQ.hexToRgba(
						CIQ.colorToHex(bgColor),
						parseFloat(series.opacity)
					);
				stickyArgs = {
					message: series.display || series.symbol,
					backgroundColor: bgColor,
					noDelete: series.permanent,
					type: "series"
				};
				drawingToMeasure = null;
				if (drag === true || (drag && drag.series)) {
					highlightedDraggable = r2;
					r2.params.highlight = true;
				}

				// Find corresponding y-axis
				yAxisToHighlight = r2.getYAxis(this);
			}
			if (series.prev != series.highlight) somethingChanged = true;
		}
	}

	for (n in this.plugins) {
		var plugin = this.plugins[n];
		var pluginHighlights = {};
		if (plugin.findHighlights) {
			pluginHighlights = plugin.findHighlights(this, isTap, clearOnly);
			if (pluginHighlights.somethingChanged) somethingChanged = true;
			if (pluginHighlights.anyHighlighted) {
				this.anyHighlighted = true;
				stickyArgs = pluginHighlights.stickyArgs || {};
			}
		}
	}

	var myPanel = this.whichPanel(cy);
	var myYAxis = this.whichYAxis(myPanel, cx);

	if (!yAxisToHighlight) yAxisToHighlight = myYAxis;

	// Highlight yAxisToHighlight if applicable
	if (yAxisToHighlight) {
		if (!yAxisToHighlight.highlight) somethingChanged = true;
		yAxisToHighlight.highlight = true;
	}

	// Collect all y-axes in array for easy referencing
	var allYAxes = [];
	for (var p in this.panels) {
		allYAxes = allYAxes
			.concat(this.panels[p].yaxisLHS)
			.concat(this.panels[p].yaxisRHS);
	}

	for (n = 0; n < allYAxes.length; n++) {
		if (yAxisToHighlight == allYAxes[n] && !clearOnly) continue;
		if (allYAxes[n].highlight) somethingChanged = true;
		allYAxes[n].highlight = false;
	}

	for (m = 0; markers && m < markers.length; m++) {
		marker = markers[m];
		var mbox = marker.params.box;
		if (!mbox) continue; // Only created when the dataSegment is drawn.
		if (marker.params.panelName !== this.currentPanel.name) continue;
		var pxBox = CIQ.convertBoxToPixels(this, this.currentPanel.name, box);
		//If it doesn't exist then the it is off the screen and cannot be intersected.
		if (
			CIQ.boxIntersects(
				pxBox.x0,
				pxBox.y0,
				pxBox.x1,
				pxBox.y1,
				mbox.x0,
				mbox.y0,
				mbox.x1,
				mbox.y1
			)
		) {
			this.activeMarker = marker;
			marker.highlight = true;
			this.markerHelper.highlighted.push(marker);
		}
		if (marker.prev != marker.highlight) somethingChanged = true;
	}

	if (somethingChanged) {
		this.draw();
		stickyArgs.panel = myPanel;
		if (this.anyHighlighted && !this.grabStartYAxis) stickyArgs.panel = myPanel;
		else stickyArgs = {};
		this.displaySticky(stickyArgs);
		this.clearMeasure();
		if (drawingToMeasure) drawingToMeasure.measure();
	}

	if ((drag === true || (drag && drag.yaxis)) && myYAxis && !myYAxis.noDraw) {
		this.anyHighlight = true;
		highlightedDraggable = myYAxis;
	}

	if (!this.anyHighlighted) {
		this.setMeasure();
	}

	if (highlightedDraggable && !myPanel.noDrag) {
		if (this.longHoldTookEffect && !this.cancelLongHold) {
			if (highlightedDraggable.params) {
				// series, highlight relatives
				if (highlightedDraggable.params.dependentOf) {
					// series, highlight relatives
					highlightedDraggable =
						chart.seriesRenderers[highlightedDraggable.params.dependentOf];
					highlightedDraggable.params.highlight = true;
				}
				for (n in chart.seriesRenderers) {
					if (
						chart.seriesRenderers[n].params.dependentOf ==
						highlightedDraggable.params.name
					) {
						chart.seriesRenderers[n].params.highlight = true;
					}
				}
			}
			this.highlightedDraggable = highlightedDraggable;
			if (highlightedDraggable.getDependents) {
				// study, highlight dependents
				var dependents = highlightedDraggable.getDependents(this, true);
				for (n in this.overlays) {
					o = this.overlays[n];
					if (dependents.indexOf(o) > -1) o.highlight = true;
				}
			}
		}
		this.container.classList.add("stx-draggable");
	} else {
		this.container.classList.remove("stx-draggable");
	}

	this.highlightedDataSetField = this.adjustHighlightedDataSetField(
		this.highlightedDataSetField
	);
	this.displayDrawOK();
};

/**
 * <span class="injection">INJECTABLE</span>
 * This function is called when the user right clicks on a highlighted overlay, series or drawing.<br>
 * Calls deleteHighlighted() which calls rightClickOverlay() for studies.
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias rightClickHighlighted
 * @example
 * stxx.prepend("rightClickHighlighted", function(){
 * 	console.log('do nothing on right click');
 * 	return true;
 * });
 */
CIQ.ChartEngine.prototype.rightClickHighlighted = function () {
	if (this.runPrepend("rightClickHighlighted", arguments)) return;
	this.deleteHighlighted(true);
	this.runAppend("rightClickHighlighted", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Removes any and all highlighted overlays, series or drawings.
 *
 * @param {boolean} callRightClick When true, call the right click method for the given highlight:
 * - Drawing highlight calls {@link CIQ.ChartEngine.AdvancedInjectable#rightClickDrawing}
 * - Overlay study highlight calls {@link CIQ.ChartEngine.AdvancedInjectable#rightClickOverlay}
 * @param {boolean} forceEdit Skip the context menu and begin editing immediately, usually for
 * 		touch devices.
 *
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias deleteHighlighted
 * @since
 * - 4.1.0 Removes a renderer from the chart if it has no series attached to it.
 * - 6.2.0 Calls {@link CIQ.ChartEngine.AdvancedInjectable#rightClickDrawing} when a drawing is
 * 		highlighted and the `callRightClick` paramenter is true.
 */
CIQ.ChartEngine.prototype.deleteHighlighted = function (
	callRightClick,
	forceEdit
) {
	if (this.runPrepend("deleteHighlighted", arguments)) return;
	this.cancelTouchSingleClick = true;
	CIQ.clearCanvas(this.chart.tempCanvas, this);
	var canDeleteAll = this.bypassRightClick === false;
	if (canDeleteAll || !this.bypassRightClick.drawing) {
		for (var i = this.drawingObjects.length - 1; i >= 0; i--) {
			var drawing = this.drawingObjects[i];

			if (!drawing.highlighted) continue;

			if (callRightClick) {
				this.rightClickDrawing(drawing, forceEdit);
			} else if (!drawing.permanent) {
				var dontDeleteMe = drawing.abort();
				if (!dontDeleteMe) {
					var before = this.exportDrawings();
					this.drawingObjects.splice(i, 1);
					this.undoStamp(before, this.exportDrawings());
				}
				this.changeOccurred("vector");
			}
		}
	}
	if (canDeleteAll || !this.bypassRightClick.study) {
		for (var name in this.overlays) {
			var o = this.overlays[name];
			if ((o.overlay || o.underlay) && o.highlight && !o.permanent) {
				if (callRightClick || forceEdit)
					this.rightClickOverlay(name, forceEdit);
				else this.removeOverlay(name);
			}
		}
	}

	var chart = this.currentPanel.chart;
	if (canDeleteAll || !this.bypassRightClick.series) {
		for (var r in chart.seriesRenderers) {
			var renderer = chart.seriesRenderers[r];
			if (renderer.params.highlightable) {
				var rPanel = this.panels[renderer.params.panel];
				var yAxisName = rPanel && rPanel.yAxis.name;
				for (var sp = renderer.seriesParams.length - 1; sp >= 0; sp--) {
					var series = renderer.seriesParams[sp];
					if (
						(renderer.params.highlight || series.highlight) &&
						!series.permanent
					) {
						renderer.removeSeries(series.id);
						if (renderer.seriesParams.length < 1) {
							this.removeSeriesRenderer(renderer);
							if (renderer.params.name == yAxisName) {
								this.electNewPanelOwner(renderer.params.panel);
							} else {
								this.checkForEmptyPanel(renderer.params.panel);
								var rendererAxis = this.getYAxisByName(
									rPanel,
									renderer.params.name
								);
								if (rendererAxis) {
									rendererAxis.name =
										rendererAxis.studies[0] || rendererAxis.renderers[1];
								}
							}
						}
					}
				}
			}
		}
	}

	this.draw();
	this.resizeChart();
	this.clearMeasure();
	var mSticky = this.controls.mSticky;
	if (mSticky) {
		mSticky.style.display = "none";
		mSticky.children[0].innerHTML = "";
	}
	this.runAppend("deleteHighlighted", arguments);
};

/**
 * Displays the "ok to drag" div and the study/series which is highlighted, near the crosshairs.
 * @param {boolean} [soft] True to just set the position of an already displayed div, otherwise, toggles display style based on whether long press was completed.
 * @memberof CIQ.ChartEngine
 * @since 7.1.0
 */
CIQ.ChartEngine.prototype.displayDragOK = function (soft) {
	function showText(control) {
		var text = this.translateIf(
			control.querySelector(".field").getAttribute("text")
		);
		var hoveredYAxis = this.whichYAxis(
			this.whichPanel(this.cy),
			this.cx,
			this.cy
		);
		if (hoveredYAxis && hoveredYAxis.dropzone == "all") {
			text += "-->" + this.translateIf(hoveredYAxis.name);
		}
		control.querySelector(".field").innerHTML = text;
	}
	var dragControl = this.controls.dragOk;
	if (dragControl) {
		if (!soft) this.findHighlights(this.highlightViaTap); // trigger highlighting
		var draggableObject = this.highlightedDraggable; // set by findHighlights
		var dragNotAllowed =
			draggableObject &&
			draggableObject.undraggable &&
			draggableObject.undraggable(this);
		var cx = this.cx,
			cy = this.cy;
		if (!soft) {
			if (
				draggableObject &&
				!dragNotAllowed &&
				this.longHoldTookEffect &&
				!this.cancelLongHold
			) {
				var baseText =
					(draggableObject.inputs && draggableObject.inputs.display) ||
					(draggableObject.params &&
						(draggableObject.params.display || draggableObject.params.name)) ||
					draggableObject.name;
				dragControl.querySelector(".field").setAttribute("text", baseText);
				showText.call(this, dragControl);
				dragControl.style.display = "inline-block";
				this.draw(); // trigger opacity change
				this.displaySticky();
				if (this.grabStartYAxis)
					this.container.classList.replace("stx-drag-chart", "stx-drag-axis");
				else
					this.container.classList.replace("stx-drag-chart", "stx-drag-series");
			} else {
				dragControl.style.display = "none";
				this.draw();
				this.container.classList.remove("stx-drag-series");
				this.container.classList.remove("stx-drag-axis");
				for (var panel in this.panels) {
					var classList = this.panels[panel].subholder.classList;
					classList.remove("dropzone"); // IE 11 won't let you pass multiple classes
					classList.remove("all");
					classList.remove("left");
					classList.remove("right");
					classList.remove("top");
					classList.remove("bottom");
					var y;
					for (y = 0; y < this.panels[panel].yaxisLHS.length; y++) {
						this.panels[panel].yaxisLHS[y].dropzone = null;
					}
					for (y = 0; y < this.panels[panel].yaxisRHS.length; y++) {
						this.panels[panel].yaxisRHS[y].dropzone = null;
					}
				}
			}
			this.draw();
		}
		if (draggableObject) {
			var top = cy + dragControl.offsetHeight;
			var left = Math.max(0, cx - dragControl.offsetWidth);
			dragControl.style.top = top + "px";
			dragControl.style.left = left + "px";
			showText.call(this, dragControl);
		}
	}
};

/**
 * Displays the "ok to draw" icon and the field which is highlighted, near the crosshairs. Used with the [average line drawing]{@link CIQ.Drawing.average}.
 *
 * In general, any series and most studies can have an average line drawing placed on it.
 * When such a plot is highlighted, this function will show the [drawOk chart control]{@link CIQ.ChartEngine#htmlControls} and display the field being highlighted.
 * @memberof CIQ.ChartEngine
 * @since 7.0.0
 */
CIQ.ChartEngine.prototype.displayDrawOK = function () {
	var drawable = this.controls.drawOk;
	if (drawable && CIQ.Drawing) {
		var drawing = CIQ.Drawing[this.currentVectorParameters.vectorType];
		if (drawing) drawing = new drawing();
		if (this.highlightedDataSetField && drawing && drawing.getYValue) {
			drawable.style.display = "inline-block";
			var top = this.cy + drawable.offsetHeight;
			var left = this.cx - drawable.offsetWidth;
			drawable.style.top = top + "px";
			drawable.style.left = left + "px";
			drawable.querySelector(".field").innerHTML = this.translateIf(
				this.highlightedDataSetField
			);
		} else drawable.style.display = "none";
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * Zooms (vertical swipe / mousewheel) or pans (horizontal swipe) the chart based on a mousewheel event.
 *
 * Uses for following for zooming:
 *  -  {@link CIQ.ChartEngine#zoomIn}
 *  -  {@link CIQ.ChartEngine#zoomOut}
 *
 * Uses the following for panning:
 *  -  {@link CIQ.ChartEngine#mousemoveinner}
 *
 * Circumvented if:
 * - {@link CIQ.ChartEngine#allowZoom} is set to `false`
 * - {@link CIQ.ChartEngine#captureMouseWheelEvents} is set to `false`
 * - on a vertical swipe and {@link CIQ.ChartEngine#allowSideswipe} is `false`
 *
 * See the following options:
 * - {@link CIQ.ChartEngine#reverseMouseWheel}
 * - {@link CIQ.ChartEngine#mouseWheelAcceleration}
 *
 * @param  {Event} e		  The event
 * @return {boolean}			Returns false if action is taken
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias mouseWheel
 */
CIQ.ChartEngine.prototype.mouseWheel = function (e) {
	if (this.runPrepend("mouseWheel", arguments)) return;
	if (e.preventDefault) e.preventDefault();
	var deltaX = e.deltaX,
		deltaY = e.deltaY;

	/*
		// OSX trackpad is very sensitive since it accommodates diagonal
		// motion which is not relevant to us. So we ignore any changes
		// in direction below the threshold time value
		var threshold=50; //ms
		if(Date.now()-this.lastMouseWheelEvent<threshold){
			if(this.lastMove=="horizontal") deltaY=0;
			else deltaX=0;
		}*/
	if (Math.abs(deltaY) > Math.abs(deltaX)) deltaX = 0;
	else deltaY = 0;

	this.lastMouseWheelEvent = Date.now();
	if (Math.abs(deltaX) === 0 && Math.abs(deltaY) === 0) return;

	if (this.allowSideswipe && deltaX !== 0) {
		this.lastMove = "horizontal";
		var delta = deltaX;
		if (delta > 50) delta = 50;
		if (delta < -50) delta = -50;
		this.grabbingScreen = true;
		if (!this.currentPanel) this.currentPanel = this.chart.panel;
		this.grabStartX = CIQ.ChartEngine.crosshairX;
		this.grabStartY = CIQ.ChartEngine.crosshairY;
		this.grabStartScrollX = this.chart.scroll;
		this.grabStartScrollY = this.currentPanel.yAxis.scroll;
		this.grabStartMicropixels = this.micropixels;
		this.grabStartPanel = this.currentPanel;
		this.mousemoveinner(
			CIQ.ChartEngine.crosshairX - delta,
			CIQ.ChartEngine.crosshairY
		);
		this.updateChartAccessories();
		this.grabbingScreen = false;
		return;
	}
	this.lastMove = "vertical";
	if (!this.allowZoom) return;
	if (!this.displayInitialized) return;
	/* originally added to address a magic mouse issue - removing this code because it is affecting new Macs which seem to come back for more zooming immediately causing uneven zooming.
		if(this.wheelInMotion) return;
		this.wheelInMotion=true;
		setTimeout(function(self){return function(){self.wheelInMotion=false;};}(this), 40);
		*/
	if (!deltaY) {
		if (CIQ.wheelEvent == "mousewheel") {
			deltaY = (-1 / 40) * e.wheelDelta;
			if (e.wheelDeltaX) deltaX = (-1 / 40) * e.wheelDeltaX;
		} else {
			deltaY = e.detail;
		}
	}
	if (typeof e.deltaMode == "undefined")
		e.deltaMode = e.type == "MozMousePixelScroll" ? 0 : 1;

	//var distance=e.deltaX;
	//if(!distance) distance=e.deltaY;
	var distance = -deltaY;
	if (e.deltaMode == 1) {
		// 1 is line mode so we approximate the distance in pixels, arrived at through trial and error
		distance *= 33;
	}

	var pctIn = null;
	var pctOut = null;
	// Calculate the percentage change to the chart. Arrived at heuristically, cube root of the mousewheel distance.
	// The multipliers are adjusted to take into consideration reversed compounding rates between a zoomin and a zoomout
	if (this.mouseWheelAcceleration) {
		var multiplier = Math.max(Math.pow(Math.abs(distance), 0.3), 1);
		pctIn = 1 - 0.1 * multiplier;
		pctOut = 1 + 0.2 * multiplier;
	}

	this.zoomInitiatedByMouseWheel = true;

	if (distance > 0) {
		if (this.reverseMouseWheel) this.zoomOut(null, pctOut);
		else this.zoomIn(null, pctIn);
	} else if (distance < 0) {
		if (this.reverseMouseWheel) this.zoomIn(null, pctIn);
		else this.zoomOut(null, pctOut);
	}
	if (this.runAppend("mouseWheel", arguments)) return;
	return false;
};

/**
 * This code prevents the browser context menu from popping up when right-clicking on a drawing or overlay.
 *
 * See  {@link rightClickEventListener}
 * @param {object} [e=event] Event
 * @return {boolean}
 * @memberOf  CIQ.ChartEngine
 */
CIQ.ChartEngine.handleContextMenu = function (e) {
	for (var i = 0; i < CIQ.ChartEngine.registeredContainers.length; i++) {
		var stx = CIQ.ChartEngine.registeredContainers[i].stx;
		if (stx) {
			if (stx.anyHighlighted) {
				if (e.preventDefault) e.preventDefault();
				return false;
			}
		}
	}
};
if (typeof document != "undefined")
	document.addEventListener("contextmenu", CIQ.ChartEngine.handleContextMenu);

/**
 * Defines raw html for the chart controls.
 *
 * These controls can be overridden by manually placing HTML elements in the chart container with the same ID.
 *
 * To completely disable a chart control, programmatically set `controls[controlID]=null` where controlID is the control to disable.
 * You can also set the main `htmlControls` object to null to disable all controls at once.
 * @example
 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), controls: {chartControls:null}});
 * @example
 * // before calling loadChart(). Disables all controls
 * stxx.controls=null;
 * @example
 * // before calling loadChart(). Disables only the chartControls (zoom on and out buttons)
 * stxx.controls["chartControls"]=null;
 * @type {object}
 * @alias htmlControls
 * @memberof! CIQ.ChartEngine#
 * @since 5.2.0 Any id can be set to null to disable
 */
CIQ.ChartEngine.htmlControls = {
	/**
	 * controlID for the Annotation Save button (class="stx-btn stx_annotation_save").
	 * @alias htmlControls[`annotationSave`]
	 * @memberof! CIQ.ChartEngine#
	 */
	annotationSave:
		'<span class="stx-btn stx_annotation_save" style="display: none;">save</span>',
	/**
	 * controlID for the Annotation Cancel button (class="stx-btn stx_annotation_cancel").
	 * @alias htmlControls[`annotationCancel`]
	 * @memberof! CIQ.ChartEngine#
	 */
	annotationCancel:
		'<span class="stx-btn stx_annotation_cancel" style="display: none; margin-left:10px;">cancel</span>',
	/**
	 * controlID for the Trash Can button / Series delete panel (class="mSticky"). Also see {@link CIQ.ChartEngine#displaySticky}
	 * @alias htmlControls[`mSticky`]
	 * @memberof! CIQ.ChartEngine#
	 * @example
	 * // disable the tool tip that appears when hovering over an overlay ( drawing, line study, etc.)
	 * stxx.controls["mSticky"]=null;
	 */
	mSticky:
		'<div class="stx_sticky"> <span class="mStickyInterior"></span> <span class="mStickyRightClick"><span class="overlayEdit stx-btn" style="display:none"><span>&nbsp;</span></span> <span class="overlayTrashCan stx-btn" style="display:none"><span>&nbsp;</span></span> <span class="mouseDeleteInstructions"><span>(</span><span class="mouseDeleteText">right-click to delete</span><span class="mouseManageText">right-click to manage</span><span>)</span></span></span><span class="stickyLongPressText">(long-press to drag)</span></div>',
	/**
	 * Indicator that it is OK to draw average lines on this plot line
	 * @alias htmlControls[`drawOk`]
	 * @memberof! CIQ.ChartEngine#
	 * @since 7.0.0
	 */
	drawOk:
		'<div class="stx_draw_ok"><div class="icon"></div><div class="field"></div></div>',
	/**
	 * Indicator that it is OK to move a study or series
	 * @alias htmlControls[`dragOk`]
	 * @memberof! CIQ.ChartEngine#
	 * @since 7.1.0
	 */
	dragOk:
		'<div class="stx_drag_ok"><div class="icon"></div><div class="field"></div></div>',
	/**
	 * controlID for the Horizontal Crosshair line (class="stx_crosshair stx_crosshair_x").
	 * @alias htmlControls[`crossX`]
	 * @memberof! CIQ.ChartEngine#
	 */
	crossX:
		'<div class="stx_crosshair stx_crosshair_x" style="display: none;"></div>',
	/**
	 * controlID for the Vertical Crosshair line (class="stx_crosshair stx_crosshair_y").
	 * @alias htmlControls[`crossY`]
	 * @memberof! CIQ.ChartEngine#
	 */
	crossY:
		'<div class="stx_crosshair stx_crosshair_y" style="display: none;"></div>',
	/**
	 * controlID for the zoom-in and zoom-out buttons (class="stx_chart_controls").
	 * @alias htmlControls[`chartControls`]
	 * @memberof! CIQ.ChartEngine#
	 */
	chartControls:
		'<div class="stx_chart_controls" style="display: none; bottom: 22px;"><div class="chartSize"><span class="stx-zoom-out"></span><span class="stx-zoom-in"></span></div></div>',
	/**
	 * controlID for the home button (class="stx_jump_today home").
	 * The button goes away if you are showing the most current data. See example to manually turn it off.
	 * You can call `stxx.home();` programmatically.	 See {@link CIQ.ChartEngine#home} for more details
	 * @alias htmlControls[`home`]
	 * @memberof! CIQ.ChartEngine#
	 * @example
	 * // disable the home button
	 * var stxx=new CIQ.ChartEngine({container:document.querySelector(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
	 * stxx.controls["home"]=null;
	 */
	home: '<div class="stx_jump_today" style="display:none"><span></span></div>',
	/**
	 * controlID for div which floats along the X axis with the crosshair date (class="stx-float-date").
	 * @alias htmlControls[`floatDate`]
	 * @memberof! CIQ.ChartEngine#
	 */
	floatDate: '<div class="stx-float-date" style="visibility: hidden;"></div>',
	/**
	 * controlID for div which controls the handle to resize panels (class="stx-ico-handle").
	 * @alias htmlControls[`handleTemplate`]
	 * @memberof! CIQ.ChartEngine#
	 * @example
	 * // example to hide the handle and prevent resizing of panels
	 * .stx-ico-handle {
	 *		display: none;
	 * }
	 */
	handleTemplate:
		'<div class="stx-ico-handle" style="display: none;"><span></span></div> ',
	/**
	 * controlID for the div which hosts the panel title (symbol name, study name ) and the study control icons on the on the upper left hand corner of each panel (class="stx-panel-control")
	 * This control can not be disabled, but can be manipulated using the corresponding CSS style classes.
	 * On the main chart panel, `stx-chart-panel` is added to the class definition ( in addition to `stx-panel-title` which just controls the tile) so you can manipulate the entire chart controls section, separately from the rest of the study panel controls.
	 *
	 * @example
	 * // example to hide the chart symbol title
	 * .stx-panel-control.stx-chart-panel .stx-panel-title{
	 * 		display:none;
	 * }
	 *
	 * // for backwards compatibility, this is still supported:
	 * .chart-title{
	 *		display	: none;
	 *	}
	 *
	 * @example
	 * // example to hide all panels titles
	 * .stx-panel-control .stx-panel-title{
	 * 		display:none;
	 * }
	 *
	 * @alias htmlControls[`iconsTemplate`]
	 * @memberof! CIQ.ChartEngine#
	 */
	iconsTemplate:
		'<div class="stx-panel-control"><div class="stx-panel-title"></div><div class="stx-panel-legend"></div><div class="stx-btn-panel"><span class="stx-ico-up"></span></div><div class="stx-btn-panel"><span class="stx-ico-focus"></span></div><div class="stx-btn-panel"><span class="stx-ico-down"></span></div><div class="stx-btn-panel"><span class="stx-ico-edit"></span></div><div class="stx-btn-panel"><span class="stx-ico-close"></span></div></div>',
	/**
	 * controlID for grabber which sits to right of baseline so it can be moved.
	 * @alias htmlControls[`baselineHandle`]
	 * @memberof! CIQ.ChartEngine#
	 */
	baselineHandle:
		'<div class="stx-baseline-handle" style="display: none;"></div>',
	/**
	 * Holds notifications displayed by the chart. See {@link CIQ.ChartEngine#displayNotification}.
	 *
	 * @alias htmlControls[`notificationTray`]
	 * @memberof! CIQ.ChartEngine#
	 * @since 8.0.0
	 */
	notificationTray:
		'<div class="stx_notification_tray"><template><div><span class="icon"></span><span class="message"></span></div></template></div>'
};

/**
 * Appends additional chart controls and attaches a click event handler.
 *
 * @param {string} controlClass CSS class to attach to the control element
 * @param {string} controlLabel Descriptive name for the control; appears in tool tip
 * @param {function} clickHandler Called when the control is selected
 * @return {node} Reference to the new control element
 * @memberof CIQ.ChartEngine
 * @since 7.3.0
 */
CIQ.ChartEngine.prototype.registerChartControl = function (
	controlClass,
	controlLabel,
	clickHandler
) {
	var controls = this.controls;
	if (!controls || !controls.chartControls) return;
	if (controls.chartControls.querySelector("." + controlClass)) return;
	var customButton = null;
	var zoomInControl = controls.chartControls.querySelector(".stx-zoom-in");
	if (zoomInControl) {
		customButton = document.createElement("span");
		customButton.innerHTML =
			'<span class="stx-tooltip">' + controlLabel + "</span>";
		customButton.className = "stx-chart-control-button " + controlClass;
		zoomInControl.parentNode.appendChild(customButton);

		if (clickHandler) CIQ.safeClickTouch(customButton, clickHandler);
		if (!CIQ.touchDevice) {
			this.makeModal(customButton);
		}

		return customButton;
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * Zooms the chart out. The chart is zoomed incrementally by the percentage indicated each time this is called.
 * @param  {Event} e The mouse click event, if it exists (from clicking on the chart control)
 * @param  {number} pct The percentage, **in decimal equivalent**, to zoom out the chart. Default is 1.3 (30%)
 * @example
 * // 30% zoom adjustment
 * zoomOut(null, 1.3);
 * @memberof CIQ.ChartEngine
 * @since 4.0.0 If both {@link CIQ.ChartEngine.Chart#allowScrollPast} and {@link CIQ.ChartEngine.Chart#allowScrollFuture} are set to false, the zoom operation will stop mid animation to prevent white space from being created.
 */
CIQ.ChartEngine.prototype.zoomOut = function (e, pct) {
	if (this.runPrepend("zoomOut", arguments)) return;
	if (this.preferences.zoomOutSpeed) pct = this.preferences.zoomOutSpeed;
	else if (!pct) pct = 1.3;
	if (e && e.preventDefault) e.preventDefault();
	this.cancelTouchSingleClick = true;

	var self = this;
	function closure(chart) {
		return function (candleWidth) {
			self.zoomSet(candleWidth, chart);
			if (self.animations.zoom.hasCompleted) {
				if (self.runAppend("zoomOut", arguments)) return;
				self.changeOccurred("layout");
				if (self.continuousZoom) self.continuousZoom.execute(true);
			}
		};
	}

	for (var chartName in this.charts) {
		var chart = this.charts[chartName];

		var newTicks = Math.floor(chart.maxTicks * pct); // 10% more ticks with each click
		if (
			chart.allowScrollFuture === false &&
			chart.allowScrollPast === false &&
			newTicks > chart.dataSet.length
		) {
			// make sure we keep candles big enough to show all data so no white space is created on either side.
			newTicks = chart.dataSet.length;
		}
		var newCandleWidth = this.chart.width / newTicks;

		this.layout.setSpan = null;
		this.layout.range = null;
		this.animations.zoom.run(
			closure(chart),
			this.layout.candleWidth,
			newCandleWidth
		);
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * Zooms the chart in. The chart is zoomed incrementally by the percentage indicated each time this is called.
 * @param  {Event} e The mouse click event, if it exists (from clicking on the chart control)
 * @param  {number} pct The percentage, **in decimal equivalent**, to zoom in the chart. Default is 0.7 (30%)
 * @example
 * // 30% zoom adjustment
 * zoomIn(null, 0.7);
 * @memberof CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.zoomIn = function (e, pct) {
	if (this.runPrepend("zoomIn", arguments)) return;
	if (this.preferences.zoomInSpeed) pct = this.preferences.zoomInSpeed;
	else if (!pct) pct = 0.7;
	if (e && e.preventDefault) e.preventDefault();
	this.cancelTouchSingleClick = true;

	var self = this;
	function closure(chart) {
		return function (candleWidth) {
			self.zoomSet(candleWidth, chart);
			if (self.animations.zoom.hasCompleted) {
				if (self.runAppend("zoomIn", arguments)) return;
				self.changeOccurred("layout");
				if (self.continuousZoom) self.continuousZoom.execute();
			}
		};
	}

	for (var chartName in this.charts) {
		var chart = this.charts[chartName];

		var newTicks = Math.floor(chart.maxTicks * pct); // 10% fewer ticks displayed when zooming in
		// At some point the zoom percentage compared to the bar size may be too small, we get stuck at the same candle width.
		// (because we ceil() and 0.5 candle when we set the maxTicks in setCandleWidth()).
		// So we want to force a candle when this happens.
		if (chart.maxTicks - newTicks < 1) newTicks = chart.maxTicks - 1;
		if (newTicks < this.minimumZoomTicks) newTicks = this.minimumZoomTicks;
		var newCandleWidth = this.chart.width / newTicks;

		this.layout.setSpan = null;
		this.layout.range = null;
		this.animations.zoom.run(
			closure(chart),
			this.layout.candleWidth,
			newCandleWidth
		);
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * <span class="animation">Animation Loop</span>
 * Registers mouse events for the crosshair elements (to prevent them from picking up events)
 * @memberof CIQ.ChartEngine.AdvancedInjectable#
 * @alias createCrosshairs
 */
CIQ.ChartEngine.prototype.createCrosshairs = function () {
	if (this.runPrepend("createCrosshairs", arguments)) return;
	if (
		!this.manageTouchAndMouse ||
		(this.mainSeriesRenderer && this.mainSeriesRenderer.nonInteractive)
	)
		return;

	var crossX = this.controls.crossX,
		crossY = this.controls.crossY;
	if (crossX) {
		if (!crossX.onmousedown) {
			crossX.onmousedown = function (e) {
				if (e.preventDefault) e.preventDefault();
				return false;
			};
		}
	}

	if (crossY) {
		if (!crossY.onmousedown) {
			crossY.onmousedown = function (e) {
				if (e.preventDefault) e.preventDefault();
				return false;
			};
		}
	}

	this.runAppend("createCrosshairs", arguments);
};

let warned = false;
CIQ.ChartEngine.prototype.mousemoveinner =
	CIQ.ChartEngine.prototype.mousemoveinner ||
	function (epX, epY) {
		if (!warned)
			console.error(
				"interaction feature requires activating movement feature."
			);
		warned = true;
	};

};

let __js_standard_markers_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * The markerHelper is a private object that we use for placeholder values, primarily as a performance aid
 * @private
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.makeMarkerHelper = function () {
	this.markerHelper = {
		chartMap: {},
		classMap: {},
		domMarkers: [],
		highlighted: []
	};
};

/**
 * Adds a marker to the chart.
 *
 * @param {CIQ.Marker} marker The marker to add.
 *
 * @memberOf CIQ.ChartEngine
 * @private
 * @since 7.2.0 Checks for the `prepareForHolder` method on the markers's `stxNodeCreator` and
 * 		calls that function if present.
 */
CIQ.ChartEngine.prototype.addToHolder = function (marker) {
	var panel = this.panels[marker.params.panelName];
	if (!panel) return;

	if (!this.markerHelper) this.makeMarkerHelper();

	var mparams = marker.params,
		node = marker.node,
		nodeCreator = marker.stxNodeCreator;
	if (nodeCreator && nodeCreator.prepareForHolder) {
		node = nodeCreator.prepareForHolder(marker);
	}
	if (mparams.chartContainer) {
		this.container.appendChild(marker.node);
	} else if (mparams.includeAxis) {
		panel.holder.appendChild(marker.node);
	} else {
		panel.subholder.appendChild(node);
	}

	marker.chart = panel.chart;
	if (nodeCreator && nodeCreator.addToHolder) nodeCreator.addToHolder(marker);
};

/**
 * Gets an array of markers
 * @private
 * @param {string} type The type of comparison "panelName","label","all"
 * @param {string} comparison The value to compare to
 * @return {array} The marker array
 */
CIQ.ChartEngine.prototype.getMarkerArray = function (type, comparison) {
	var arr = [];
	for (var label in this.markers) {
		for (var i = 0; i < this.markers[label].length; i++) {
			var marker = this.markers[label][i];
			if (type == "panelName") {
				if (marker.params.panelName == comparison) arr.push(marker);
			} else if (type == "label") {
				if (label == comparison) arr.push(marker);
			} else if (type == "all") {
				arr.push(marker);
			}
		}
	}
	return arr;
};

/**
 * Removes the marker from the chart
 * @private
 * @param  {CIQ.Marker} marker The marker to remove
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.removeFromHolder = function (marker) {
	var panel = this.panels[marker.params.panelName];
	if (panel) {
		if (marker.node.parentNode == panel.holder)
			panel.holder.removeChild(marker.node);
		else if (marker.node.parentNode == panel.subholder)
			panel.subholder.removeChild(marker.node);
		else if (marker.node.parentNode == this.container)
			this.container.removeChild(marker.node);
	}
	// Remove from label map
	var labels = this.markers[marker.params.label];
	if (!labels) return;
	var i;
	for (i = 0; i < labels.length; i++) {
		if (labels[i] === marker) {
			labels.splice(i, 1);
			break;
		}
	}

	// remove from chart map
	var chartMap = this.markerHelper.chartMap[marker.chart.name];
	if (chartMap) {
		for (i = 0; i < chartMap.markers.length; i++) {
			if (chartMap.markers[i] === marker) {
				chartMap.markers.splice(i, 1);
				break;
			}
		}
	}

	// remove from class map
	var classMap = this.markerHelper.classMap[marker.className];
	if (classMap) {
		var panelArray = classMap[marker.params.panelName];
		if (panelArray) {
			for (i = 0; i < panelArray.length; i++) {
				if (panelArray[i] === marker) {
					panelArray.splice(i, 1);
					break;
				}
			}
		}
	}
};

/**
 * Moves the markers from one panel to another
 * Useful when renaming panels
 * @param  {string} fromPanelName The panel to move markers from
 * @param  {string} toPanelName The panel to move markers to
 * @memberOf CIQ.ChartEngine
 * @since 2016-07-16
 */
CIQ.ChartEngine.prototype.moveMarkers = function (fromPanelName, toPanelName) {
	var arr = this.getMarkerArray("panelName", fromPanelName);
	for (var i = 0; i < arr.length; i++) {
		arr[i].params.panelName = toPanelName;
	}
	for (var className in this.markerHelper.classMap) {
		var tmp = this.markerHelper.classMap[className][fromPanelName];
		if (tmp) {
			this.markerHelper.classMap[className][toPanelName] = tmp;
			delete this.markerHelper.classMap[className][fromPanelName];
		}
	}
};

/**
 * Establishes the tick value for any markers that have a "date" specified. It tries to be efficient, not recalculating
 * unless the size of the dataSet for a chart has actually changed
 * @private
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.establishMarkerTicks = function () {
	if (!this.markerHelper) this.makeMarkerHelper();
	var chartMap = this.markerHelper.chartMap;
	for (var chart in chartMap) {
		var chartEntry = chartMap[chart];
		if (chartEntry.dataSetLength == this.charts[chart].dataSet.length) continue;
		for (var i = 0; i < chartEntry.markers.length; i++) {
			this.setMarkerTick(chartEntry.markers[i]);
		}
	}
};

/**
 * Figures out the position of a future marker but only if it is displayed on the screen.
 * @param  {CIQ.Marker} marker The marker to check
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.futureTickIfDisplayed = function (marker) {
	var chart = marker.chart;
	if (chart.dataSet.length < 1) return;
	var xaxisDT = chart.xaxis[chart.xaxis.length - 1].DT;

	xaxisDT = new Date(xaxisDT.getTime() - this.timeZoneOffset * 60000);
	if (marker.params.x > xaxisDT) return; // not displayed on screen yet

	// It should be displayed on the screen now so find the exact tick
	var futureTicksOnScreen = chart.maxTicks - chart.dataSegment.length;
	var ticksToSearch = chart.dataSet.length + futureTicksOnScreen;
	var pms, qms;
	var dt = new Date(+chart.dataSet[chart.dataSet.length - 1].DT);

	var iter = this.standardMarketIterator(dt, null, chart);

	var dms = marker.params.x.getTime();
	for (var j = chart.dataSet.length; j < ticksToSearch; j++) {
		pms = dt.getTime();
		dt = iter.next();
		qms = dt.getTime();
		// If the event lands on that day, or if the event landed between bars
		if (qms == dms) {
			marker.tick = j;
			return;
		} else if (qms > dms && pms < dms) {
			marker.tick = Math.max(j - 1, 0);
			return;
		}
	}
};

/**
 * Establishes the tick value for the specified marker. We do this to avoid calculating the date every time we want
 * to place the marker. Converting date to tick is a very expensive operation!
 * @param {CIQ.Marker} marker The marker for which to establish the tick
 * @private
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.setMarkerTick = function (marker) {
	var chart = marker.chart;
	if (marker.params.xPositioner == "master" && marker.params.x) {
		marker.tick = Math.floor(marker.params.x / this.layout.periodicity);
		return;
	} else if (marker.params.xPositioner == "date" && marker.params.x) {
		var pms, qms;
		var dms = marker.params.x.getTime();
		for (var i = 0; i < chart.dataSet.length; i++) {
			var quotes = chart.dataSet[i];
			qms = quotes.DT.getTime();
			pms = qms;
			if (i > 0) pms = chart.dataSet[i - 1].DT.getTime();
			// If the event lands on that day, or if the event landed between bars
			if (qms == dms) {
				marker.tick = i;
				return;
			} else if (qms > dms && pms < dms) {
				marker.tick = Math.max(i - 1, 0);
				return;
			} else if (dms < qms) {
				marker.tick = null;
				// marker date is in distant past, shortcircuit the logic for performance.
				return;
			}
		}
		if (chart.dataSet.length < 1) return;
		var dt = new Date(+chart.dataSet[i - 1].DT);
		if (dt.getTime() < dms) marker.params.future = true;
		marker.tick = null; // reset in case we had figured it out with an earlier dataset
	}
};

/**
 * <span class="injection">INJECTABLE</span>
 * <span class="animation">Animation Loop</span>
 * Iterates through all marker handlers, calling their corresponding custom `placementFunction` or {@link CIQ.ChartEngine#defaultMarkerPlacement} if none defined.
 * @memberOf CIQ.ChartEngine.AdvancedInjectable#
 * @alias positionMarkers
 */
CIQ.ChartEngine.prototype.positionMarkers = function () {
	var self = this,
		chart = this.chart;
	if (!self.markerHelper) return;

	function draw() {
		if (self.runPrepend("positionMarkers", arguments)) return;
		self.markerTimeout = null;
		for (var className in self.markerHelper.classMap) {
			for (var panelName in self.markerHelper.classMap[className]) {
				var arr = self.markerHelper.classMap[className][panelName];
				var panel = self.panels[panelName];
				if (arr.length) {
					var params = {
						stx: self,
						arr: arr,
						panel: panel
					};
					params.firstTick = panel.chart.dataSet.length - panel.chart.scroll;
					params.lastTick = params.firstTick + panel.chart.dataSegment.length;

					var fn = arr[0].constructor.placementFunction; // Some magic, this gets the static member "placementFunction" of the class (not the instance)
					if (fn) {
						fn(params);
					} else {
						self.defaultMarkerPlacement(params);
					}
				}
			}
		}
		self.runAppend("positionMarkers", arguments);
	}

	if (this.markerDelay || this.markerDelay === 0) {
		if (!this.markerTimeout)
			this.markerTimeout = setTimeout(draw, this.markerDelay);
	} else {
		draw();
	}
	var markers = this.getMarkerArray("all");
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i],
			nodeCreator = marker.stxNodeCreator;
		var starting = this.getFirstLastDataRecord(chart.dataSegment, "tick"),
			ending = this.getFirstLastDataRecord(chart.dataSegment, "tick", true);
		if (!starting || !ending) continue; // return if dataSegment is full of nulls or undefined values or maybe its just empty
		if (starting.tick <= marker.tick && marker.tick <= ending.tick) {
			// if markers are off screen don't draw them
			if (nodeCreator && nodeCreator.drawMarker) nodeCreator.drawMarker(marker);
		} else if (marker.attached && nodeCreator.expand) {
			// hide the popup of any perf markers outside the dataSegment
			nodeCreator.expand.style.visibility = "hidden";
		}
	}
};

/**
 * A marker is a DOM object that is managed by the chart.
 *
 * Makers are placed in containers which are `div` elements whose placement and size correspond with a panel on the
 * chart. A container exists for each panel.
 *
 * A marker's primary purpose is to provide additional information for a data point on the chart. As such, markers
 * can be placed by date, tick, or bar to control their position on the x-axis, and by value (price) to control their
 * position on the y-axis. Additional default positioning is also available, including the ability to create custom
 * positioning logic. Once the positioning logic is established for markers, they are repositioned as needed when the
 * user scrolls or zooms the chart.
 *
 * Alternatively, a marker can also be placed at an absolute position using CSS positioning, in which case the chart
 * does not control the marker's positioning.
 *
 * The default placement function for any markers is {@link CIQ.ChartEngine#defaultMarkerPlacement}.
 *
 * See the {@tutorial Markers} tutorial for additional implementation details and information about managing
 * performance on deployments requiring a large number of markers.
 *
 * @name CIQ.Marker
 * @param {Object} params Parameters that describe the marker.
 * @param {CIQ.ChartEngine} params.stx The chart to which the marker is attached.
 * @param {*} params.x A valid date, tick, or bar (depending on the selected `xPositioner`) used to select a candle to
 * 					which the marker is associated.
 * @param {Number} params.y A valid value for positioning the marker on the y-axis (depending on selected `yPositioner`).
 * 					If this value is not provided, the marker is set "above_candle" as long as a valid candle is selected
 * 					by `params.x`.
 * @param {HTMLElement} [params.node] The HTML element that contains the marker. This element should be detached from the
 * 					DOM. If an element is not provided, an empty `div` is created. You can create your own or use the provided {@link CIQ.Marker.Simple} and {@link CIQ.Marker.Performance} node creators.
 * @param {string} params.panelName="chart" The name of the panel to which the `node` is attached. Defaults to the main
 * 					chart panel.
 * @param {string} [params.xPositioner="date"] Determines the x-axis position of the marker.
 * Values include:
 * - "date" &mdash; `params.x` must be set to a JavaScript date object. This will be converted to the closest `masterData`
 * position if the provided date does not exactly match any existing points. Be sure the same timezone as masterData is used.
 * - "master" &mdash; `params.x` must be set to a `masterData` position.
 * - "bar" &mdash; `params.x` must be set to a `dataSegment` position.
 * - "none" &mdash; Use CSS positioning; `params.x` is not used.
 * @param {string} [params.yPositioner="value"] Determines the y-axis position of the marker.
 * Values include:
 * - "value" &mdash; `params.y` must be set to an exact y-axis value. If `params.y` is omitted, the y-axis position defaults
 * to "above_candle".
 * - "above_candle" &mdash; Positions the marker right above the candle or line. If more than one marker is at the same position,
 * the markers are aligned upwards from the first. The `params.y` value is not used.
 * - "below_candle" &mdash; Positions the marker right below the candle or line. If more than one marker is at the same position,
 * the markers are aligned downwards from the first. The `params.y` value is not used.
 * - "under_candle" &mdash; Deprecated; same as "below_candle".
 * - "on_candle" &mdash; Position the marker in the center of the candle or line, covering it. If more than one marker is at the
 * same position, the markers are aligned downwards from the first. The `params.y` value is not used.
 * - "top" &mdash; Position the marker at the top of the chart, right below the margin. If more than one marker is at the same
 * position, the markers are aligned downwards from the first. The `params.y` value is not used.
 * - "bottom" &mdash; Position the marker at the bottom of the chart, right above the margin. If more than one marker is at the
 * same position, the markers are aligned upwards from the first. The `params.y` value is not used.
 * - "none" &mdash; Use CSS positioning; `params.y` is not used.
 * @param {boolean} [params.permanent=false] The marker stays on the chart even when the chart is re-initialized by a symbol
 * change, call to `loadChart()` or `initializeChart()`, and so forth.
 * @param {string} [params.label="generic"] A label for the marker. Multiple markers can be assigned the same label, which
 * allows them to be deleted simultaneously.
 * @param {boolean} [params.includeAxis=false] If true, then the marker can display on the x- or y-axis. Otherwise, it is cropped
 * at the axis edge.
 * @param {Boolean} [params.chartContainer] If true, then the marker is placed directly in the chart container as opposed to in a
 * container, or holder, node. When placing the marker directly in the chart container, the z-index setting for the marker should
 * be set in relation to the z-index of other holders in order to place the marker above or below markers inside the holders.
 * @constructor
 * @since
 * - 15-07-01
 * - 05-2016-10 Added the following `params.yPositioner` values: "value", "above_candle",
 * 		"below_candle", "on_candle", "top", and "bottom".
 * @version ChartIQ Advanced Package
 * @example
 * new CIQ.Marker({
 *     stx: stxx,
 * 	   xPositioner: "date",
 *     yPositioner: "value",
 * 	   x: someDate,
 * 	   y: somePrice,
 * 	   label: "events",
 * 	   node: newNode
 * });
 */
CIQ.Marker =
	CIQ.Marker ||
	function (params) {
		this.params = {
			xPositioner: "date",
			yPositioner: "value",
			panelName: "chart",
			permanent: false,
			label: "generic",
			includeAxis: false
		};
		CIQ.extend(this.params, params);
		if (!this.params.node) {
			this.params.node = document.createElement("DIV");
		}
		var stx = this.params.stx;
		if (!stx) {
			console.log("Marker created without specifying stx");
			return;
		}
		if (!this.className) this.className = "CIQ.Marker";

		// Switcheroo. If a NodeCreator is passed in, then we change the marker
		// to reference the actual DOM node and then we add stxNodeCreator to the
		// marker so that we can reference it if need be
		if (CIQ.derivedFrom(this.params.node, CIQ.Marker.NodeCreator)) {
			this.stxNodeCreator = this.params.node;
			this.node = this.stxNodeCreator.node;
		} else {
			this.node = this.params.node;
		}

		if (!stx.markerHelper) stx.makeMarkerHelper();

		var label = this.params.label;
		if (!stx.markers[label]) stx.markers[label] = [];
		stx.markers[label].push(this);

		var panel = stx.panels[this.params.panelName];
		this.chart = panel.chart;

		// Put it in the map of charts
		if (!stx.markerHelper.chartMap[this.chart.name]) {
			stx.markerHelper.chartMap[this.chart.name] = {
				dataSetLength: 0,
				markers: []
			};
		}
		stx.markerHelper.chartMap[this.chart.name].markers.push(this);

		var classMap = stx.markerHelper.classMap[this.className];
		if (!classMap) classMap = stx.markerHelper.classMap[this.className] = {};
		if (!classMap[this.params.panelName]) classMap[this.params.panelName] = [];
		classMap[this.params.panelName].push(this);

		var defer = this.stxNodeCreator && this.stxNodeCreator.deferAttach;
		if (!defer) stx.addToHolder(this);
		stx.setMarkerTick(this);

		if (this.stxNodeCreator && this.stxNodeCreator.drawMarker)
			this.stxNodeCreator.drawMarker(this);
	};

/**
 * Removes the marker from the chart object
 * @memberOf CIQ.Marker
 * @since 15-07-01
 */
CIQ.Marker.prototype.remove = function () {
	this.params.stx.removeFromHolder(this);
};

/**
 * Called when a marker node is clicked. Checks to see whether the node has its own click
 * function and, if it does, calls that function, passing all arguments to it.
 *
 * @param {object} params Configuration parameters.
 * @param {number} params.cx The clientX coordinate of the click event.
 * @param {number} params.cy The clientY coordinate of the click event.
 * @param {CIQ.ChartEngine.Panel} params.panel Panel where the click took place.
 *
 * @memberof CIQ.Marker
 * @since
 * - 7.2.0
 * - 8.0.0 Signature changed to accept the `params` object.
 */
CIQ.Marker.prototype.click = function (params) {
	if (typeof arguments[0] === "number") {
		params = { cx: arguments[0], cy: arguments[1], panel: arguments[3] };
	}

	let { cx, cy, panel } = params;
	if (!this.params.stx) return; // some markers don't know the engine. In that scenario do nothing.
	var node = this.params.node;
	if (node.click) node.click(cx, cy, this, panel);
};

/**
 * Called when a marker node is double-clicked.
 *
 * Override this function with your own implementation. Return a truthy value to prevent
 * {@link CIQ.ChartEngine#doubleClick} from dispatching the `doubleClick` event and invoking
 * the {@link doubleClickEventListener}.
 *
 * @param {object} params Configuration parameters.
 * @param {number} params.cx The clientX coordinate of the double-click event.
 * @param {number} params.cy The clientY coordinate of the double-click event.
 * @param {CIQ.ChartEngine.Panel} params.panel Panel where the double-click took place.
 * @return {boolean} true to indicate the double-click event has been handled; otherwise,
 * 		false.
 *
 * @alias doubleClick
 * @memberof CIQ.Marker.prototype
 * @virtual
 * @since 8.0.0
 */
CIQ.Marker.prototype.doubleClick = function ({ cx, cy, panel }) {
	return false;
};

/**
 * Normally the chart will take care of positioning the marker automatically but you can
 * force a marker to render itself by calling this method. This will cause the marker to
 * call its placement function. You might want to do this for instance if your marker morphs
 * or changes position outside of the animation loop.
 */
CIQ.Marker.prototype.render = function () {
	var arr = [this];
	var params = {
		stx: this.params.stx,
		arr: arr,
		panel: this.params.stx.panels[this.params.panelName],
		showClass: this.showClass
	};
	this.constructor.placementFunction(params);
};

/**
 * Removes all markers with the specified label from the chart object
 * @param  {CIQ.ChartEngine} stx   The chart object
 * @param  {string} label The label
 * @memberOf CIQ.Marker
 * @since 15-07-01
 */
CIQ.Marker.removeByLabel = function (stx, label) {
	var arr = stx.getMarkerArray("label", label);
	for (var i = 0; i < arr.length; i++) {
		var marker = arr[i];
		stx.removeFromHolder(marker);
		if (marker.stxNodeCreator && marker.stxNodeCreator.remove) {
			marker.stxNodeCreator.remove(marker);
		}
	}
	stx.draw();
};

/**
 *
 * Content positioner for any markers using the 'stx-marker-expand' class,
 * this will consider the marker node's location within its container and determine where to
 * place the content, be it to the left or right/top or bottom of the marker node (so it is all showing)
 * @memberOf CIQ.Marker
 * @param {HTMLElement} node The HTML element representing the marker which has content
 * @since 5.1.2
 */
CIQ.Marker.positionContentVerticalAndHorizontal = function (node) {
	var content_node = node.querySelectorAll(".stx-marker-expand")[0];
	if (content_node) {
		var offsetWidth = content_node.offsetWidth,
			offsetHeight = content_node.offsetHeight;
		if (!offsetWidth || !offsetHeight) return;

		var nodeStyle = content_node.style;
		nodeStyle.left = nodeStyle.right = ""; // reset content to right of node
		nodeStyle.bottom = nodeStyle.top = ""; // reset content to bottom of node

		var computedNodeStyle = getComputedStyle(content_node);
		var contentLeft = computedNodeStyle.left;
		var contentBottom = computedNodeStyle.bottom;

		var leftPxOfContent = node.offsetLeft + parseInt(contentLeft, 10);
		var bottomContentInt = parseInt(contentBottom, 10);
		// Subtract the difference between the content top and the parent height from the offsetTop
		var topPxOfContent =
			node.offsetTop -
			(bottomContentInt + content_node.offsetHeight - node.offsetHeight);

		var offsetMaxWidth = node.parentNode.offsetWidth;
		var offsetMaxHeight = node.parentNode.offsetHeight;

		//switch content to left of node if node is off the left of the chart or content will not fit to the right of the node
		if (leftPxOfContent + offsetWidth > offsetMaxWidth) {
			nodeStyle.right = contentLeft;
			nodeStyle.left = "auto";
		}

		if (node.offsetTop <= offsetMaxHeight) {
			//node not off the bottom of the chart
			//switch content to top of node if node is off the bottom of the chart or content will not fit to the bottom of the node
			if (topPxOfContent > offsetMaxHeight - offsetHeight) {
				nodeStyle.top = offsetMaxHeight - node.offsetTop - offsetHeight + "px";
				nodeStyle.bottom = "auto";
			}
		} else {
			nodeStyle.top = offsetMaxHeight + "px";
		}
		if (node.offsetTop + node.offsetHeight >= 0) {
			//node not off the top of the chart
			//switch content to bottom of node if node is off the top of the chart or content will not fit to the top of the node
			if (topPxOfContent < 0) {
				nodeStyle.top = -node.offsetTop + "px";
				nodeStyle.bottom = "auto";
			}
		} else {
			nodeStyle.bottom = "0px";
		}
	}
};

/**
 * The above_candle and below_candle y-positioner will usually use the high and low to place the marker.
 * However, some chart renderings will draw the extent of the bar either inside or outside the high/low range.
 * For those chart types, this function will return the actual high/low to be used by the marker placement function.
 * This is only valid when {@link CIQ.Renderer#highLowBars} is true.
 * Currently this function will handle p&f and histogram chart types.
 * For any other chart type, define "markerHigh" and "markerLow" for each bar in the dataSet/dataSegment
 * and these will be honored and returned.
 * Note: This function may be used with any markerPlacement function to give the lowest and highest point of the bar.
 *
 * @memberOf CIQ.ChartEngine
 * @param {Object} quote The bar's data.  This can come from the chart.dataSet
 * @return {Object}        The high and low for the marker
 * @since
 * - 3.0.0
 * - 6.2.0 Will consider `Open` and `Close` if `High` and/or `Low` are missing from quote.
 */
CIQ.ChartEngine.prototype.getBarBounds = function (quote) {
	var type = this.layout.chartType,
		aggregation = this.layout.aggregationType;
	var bounds;
	if (aggregation == "pandf")
		bounds = {
			high: Math.max(quote.pfOpen, quote.pfClose),
			low: Math.min(quote.pfOpen, quote.pfClose)
		};
	else bounds = { high: quote.High, low: quote.Low };
	if (quote.markerHigh) bounds.high = quote.markerHigh;
	if (quote.markerLow) bounds.low = quote.markerLow;

	var O, H, L;
	if (quote.Open === undefined) O = quote.Close;
	if (quote.High === undefined) H = Math.max(quote.Open || O, quote.Close);
	if (quote.Low === undefined) L = Math.min(quote.Open || O, quote.Close);
	if (!bounds.high && bounds.high !== 0) bounds.high = H;
	if (!bounds.low && bounds.low !== 0) bounds.low = L;
	return bounds;
};

/**
 * Placement functions are responsible for positioning markers in their holder according to each marker's settings.
 * They are called directly form the draw() function in the animation loop.
 * Each Marker placement handler must have a corresponding `placementFunction` or this method will be used.
 *
 * `firstTick` and `lastTick` can be used as a hint as to whether to display a marker or not.
 *
 * See {@link CIQ.Marker} and {@tutorial Markers} for more details
 * @memberOf CIQ.ChartEngine
 * @param {Object} params The parameters
 * @param {Array} params.arr The array of markers
 * @param {Object} params.panel The panel to display
 * @param {Number} params.firstTick The first tick displayed on the screen
 * @param {Number} params.lastTick The last tick displayed on the screen
 * @since 2015-09-01 On prior versions you must define your own default function. Example: `CIQ.ChartEngine.prototype.defaultMarkerPlacement = yourPlacementFunction;`.
 */
CIQ.ChartEngine.prototype.defaultMarkerPlacement = function (params) {
	var panel = params.panel;
	var yAxis = params.yAxis ? params.yAxis : params.panel.yAxis;
	var chart = panel.chart;
	var stx = params.stx;

	var showsHighs = stx.chart.highLowBars;
	var plotField = chart.defaultPlotField;
	if (!plotField || showsHighs) plotField = "Close";

	var placementMap = {};

	for (var i = 0; i < params.arr.length; i++) {
		var marker = params.arr[i],
			mparams = marker.params;
		if (marker.params.box) continue; // do not try to position drawn markers
		var node = marker.node;
		// Getting clientWidth and clientHeight is a very expensive operation
		// so we'll cache the results. Don't use this function if your markers change
		// shape or size dynamically!
		if (!marker.clientWidth) marker.clientWidth = node.clientWidth;
		if (!marker.clientHeight) marker.clientHeight = node.clientHeight;
		var quote = null;

		// X axis positioning logic

		var xPositioner = mparams.xPositioner,
			yPositioner = mparams.yPositioner,
			tick = marker.tick,
			dataSet = chart.dataSet,
			clientWidth = marker.clientWidth;
		if (xPositioner != "none") {
			if (xPositioner == "bar" && mparams.x) {
				if (mparams.x < chart.xaxis.length) {
					var xaxis = chart.xaxis[mparams.x];
					if (xaxis) quote = xaxis.data;
				}
				node.style.left =
					Math.round(stx.pixelFromBar(mparams.x, chart) - clientWidth / 2) +
					1 +
					"px";
			} else {
				// This is a section of code to hide markers if they are off screen, and also to figure out
				// the position of markers "just in time"
				// the tick is conditionally pre-set by CIQ.ChartEngine.prototype.setMarkerTick depending on marker.params.xPositioner
				if (!tick && tick !== 0) {
					// if tick is not defined then hide, probably in distant past
					if (mparams.future && chart.scroll < chart.maxTicks) {
						// In future
						stx.futureTickIfDisplayed(marker); // Just in time check for tick
						tick = marker.tick; //copy new tick from prior function
						if (!tick && tick !== 0) {
							node.style.left = "-1000px";
							continue;
						}
					} else {
						node.style.left = "-1000px";
						continue;
					}
				}
				if (tick < dataSet.length) quote = dataSet[tick];
				marker.leftpx = Math.round(
					stx.pixelFromTick(tick, chart) - chart.left - clientWidth / 2
				);
				marker.rightEdge = marker.leftpx + clientWidth;
				node.style.left = marker.leftpx + "px";
				if (tick < params.firstTick && marker.rightEdge < chart.left - 50)
					continue; // off screen, no need to reposition the marker (accounting 50px for any visual effects)
			}
			if (!quote) quote = dataSet[dataSet.length - 1]; // Future ticks based off the value of the current quote
		} else if (yPositioner.indexOf("candle") > -1) {
			// candle positioning, find the quote
			var left = getComputedStyle(node).left;
			if (left) {
				var bar = stx.barFromPixel(parseInt(left, 10), chart);
				if (bar >= 0) {
					quote = chart.xaxis[bar].data;
					if (!quote) quote = dataSet[dataSet.length - 1]; // Future ticks based off the value of the current quote
				}
			}
		}

		node.style.top = "auto"; // don't use top positioning with DOM markers
		// Y axis positioning logic
		var y = mparams.y,
			clientHeight = node.clientHeight,
			val;
		if (yPositioner != "none") {
			var placementKey = yPositioner + "-" + node.style.left;
			var height = mparams.chartContainer ? stx.height : panel.yAxis.bottom;
			var bottom = 0,
				bottomAdjust = 0;
			if (typeof placementMap[placementKey] == "undefined") {
				placementMap[placementKey] = 0;
			}
			bottomAdjust = placementMap[placementKey];
			placementMap[placementKey] += clientHeight;

			if (yPositioner == "value" && (y || y === 0)) {
				bottom =
					Math.round(
						height - stx.pixelFromPrice(y, panel, yAxis) - clientHeight / 2
					) + "px";
			} else if (
				(yPositioner == "below_candle" || yPositioner == "under_candle") &&
				quote
			) {
				// under_candle deprecated
				val = quote[plotField];
				if (showsHighs)
					val = stx.getBarBounds(quote)[yAxis.flipped ? "high" : "low"];
				bottom =
					Math.round(
						height -
							stx.pixelFromPrice(val, panel, yAxis) -
							clientHeight -
							bottomAdjust
					) + "px";
			} else if (yPositioner == "on_candle" && quote) {
				val = quote[plotField];
				if (showsHighs) val = (quote.Low + quote.High) / 2;
				bottom =
					Math.round(
						height -
							stx.pixelFromPrice(val, panel, yAxis) -
							clientHeight / 2 -
							bottomAdjust
					) + "px";
			} else if (yPositioner == "top") {
				bottom =
					Math.round(height - clientHeight - bottomAdjust - panel.top) + "px";
			} else if (yPositioner == "bottom") {
				bottom = Math.round(bottomAdjust) + "px";
			} else if (quote) {
				//above_candle
				val = quote[plotField];
				if (showsHighs)
					val = stx.getBarBounds(quote)[yAxis.flipped ? "low" : "high"];
				bottom =
					Math.round(
						height - stx.pixelFromPrice(val, panel, yAxis) + bottomAdjust
					) + "px";
			}
			if (node.style.bottom != bottom) node.style.bottom = bottom;
		}
		CIQ.Marker.positionContentVerticalAndHorizontal(node);
	}
};

/**
 * Base class to create an empty marker node that can then be styled. Used by {@link CIQ.Marker.Simple} and {@link CIQ.Marker.Performance}.
 *  It is strongly recommended that you extend this class if you're building your own marker class.
 * See {@tutorial Markers} tutorials for additional implementation instructions.
 * @name CIQ.Marker.NodeCreator
 * @constructor
 */
CIQ.Marker.NodeCreator = function () {};

CIQ.Marker.NodeCreator.toNode = function () {
	return this.node;
};

/**
 * Creates simple HTML nodes that can be used with a {@link CIQ.Marker}
 *
 * See {@tutorial Markers} tutorials for additional implementation instructions.
 * @name CIQ.Marker.Simple
 * @constructor
 * @param {Object} params Parameters to describe the marker
 * @param {string} params.type The marker type to be drawn.
 * <br>Available options are:
 * - "circle"
 * - "square"
 * - "callout"
 * @param {string} params.headline The headline text to pop-up when clicked.
 * @param {string} [params.category] The category class to add to your marker.
 * <br>Available options are:
 * - "news"
 * - "earningsUp"
 * - "earningsDown"
 * - "dividend"
 * - "filing"
 * - "split"
 * @param {string} [params.story] The story to pop-up when clicked.
 * @example
 * 	var datum = {
 *		type: "circle",
 *		headline: "This is a Marker for a Split",
 *		category: "split",
 *		story: "This is the story of a split"
 * };
 *
 * 	var mparams = {
 * 		stx: stxx,
 * 		label: "Sample Events",
 * 		xPositioner: "date",
 * 		x: aDate,
 * 		node: new CIQ.Marker.Simple(datum)
 * 	};
 *
 * 	var marker = new CIQ.Marker(mparams);
 */
CIQ.Marker.Simple = function (params) {
	var node = (this.node = document.createElement("div"));
	node.className = "stx-marker";
	node.classList.add(params.type);
	if (params.category) node.classList.add(params.category);
	var visual = CIQ.newChild(node, "div", "stx-visual");
	CIQ.newChild(node, "div", "stx-stem");

	var expand;
	if (params.type == "callout") {
		var content = CIQ.newChild(visual, "div", "stx-marker-content");
		CIQ.newChild(content, "h4", null, params.headline);
		expand = CIQ.newChild(content, "div", "stx-marker-expand");
		CIQ.newChild(expand, "p", null, params.story);
	} else {
		expand = CIQ.newChild(node, "div", "stx-marker-expand");
		CIQ.newChild(expand, "h4", null, params.headline);
		CIQ.newChild(expand, "p", null, params.story);
		CIQ.safeClickTouch(expand, function (e) {
			node.classList.toggle("highlight");
		});
	}
	function cb() {
		CIQ.Marker.positionContentVerticalAndHorizontal(node);
	}
	CIQ.safeClickTouch(visual, function (e) {
		node.classList.toggle("highlight");
		setTimeout(cb, 10);
	});
	this.nodeType = "Simple";
};

CIQ.inheritsFrom(CIQ.Marker.Simple, CIQ.Marker.NodeCreator, false);

};

let __js_standard_market_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
var timezoneJS =
	typeof _timezoneJS !== "undefined" ? _timezoneJS : _exports.timezoneJS;

/**
 * The market class is what the chart uses to to manage market hours for the different exchanges.
 * It uses `Market Definitions` to decide when the market is open or closed.
 * Although you can construct many market classes with different definitions to be used in your functions, only one market definition can be attached to the chart at any given time.
 * Once a market is defined, an [iterator]{@link CIQ.Market#newIterator} can be created to traverse through time, taking into account the market hours.
 * Additionally, a variety of convenience functions can be used to check the market status, such as {@link CIQ.Market#isOpen} or {@link CIQ.Market#isMarketDay}.
 *
 * A chart will operate 24x7, unless a market definition with rules is assigned to it.
 * See {@link CIQ.ChartEngine#setMarket} and {@link CIQ.ChartEngine#setMarketFactory} for instructions on how to assign a market definition to a chart.
 *
 * The chart also provides convenience functions that allows you to traverse through time at the current chart periodicity without having to explicitly create a new iterator.
 * See {@link CIQ.ChartEngine#getNextInterval} and {@link CIQ.ChartEngine#standardMarketIterator} for details.
 *
 * **Important:**
 * - If the {@link CIQ.ExtendedHours} visualization and filtering add-on is enabled, **only data within the defined market hours will be displayed on the chart** even if more data is loaded.
 * - Once a market definition is assigned to a chart, it will be used to roll up any data requested by the [periodicity]{@link CIQ.ChartEngine#createDataSet}, which will result in any data outside the market hours to be combined with the prior candle.<br>
 * This may at times look like data is being **filtered**, but it is just being **aggregated**. To truly filter data, you must use the above add-on.
 *
 * `Market Definitions` are JavaScript objects which must contain the following elements:
 * - `name` : A string. Name of the market for which the rules are for.
 * - `rules` : An array. The rules indicating the times the market is open or closed. `close` time **must always** be later than `open` time. Use the proper market timezone (`market_tz`) to prevent hours from spanning across days.
 * - `market_tz` : A string. Time zone in which the market operates. See {@link CIQ.timeZoneMap} to review a list of all chartIQ supported timezones and instructions on how to add more.
 * - `hour_aligned`: A boolean. If set to `true`, market opening and closing times will be forced to the exact start of the hour of time, ignoring any minutes, seconds or millisecond offsets.
 *   > You should set this to `false` if your market opening and closing times are not aligned to the beginning of each hour.
 *   > Otherwise, forcing them to do so causes the iterator to generate `previous` and `next` times that could prevent it from properly moving trough the market hours.
 * - `convertOnDaily` : A boolean. By default, daily charts are not converted for timezone. Set this to true to convert for daily charts.
 *
 * Example:
 * ```
 * {
 * 		name: "SAMPLE-MARKET",
 * 		market_tz: "America/Chicago",
 * 		hour_aligned: true,
 * 		rules: [
 * 				{"dayofweek": 1, "open": "09:00", "close": "17:00"}
 * 		]
 * };
 * ```
 *
 * Instructions for creating `Market Definitions`:
 *
 * - An empty market definition ( {} ) assumes the market is always open.
 * - Once a definition has rules in it, the market will be assumed open only for those defined rules. The absence of a rule indicates the market is closed for that timeframe.
 * - Market's time rules are specified in the market's local timezone.
 * - Seconds are not considered for open or close times, but are okay for intra day data.
 * - Rules are processed top to bottom.
 * - Rules can be defined for both primary and secondary market sessions.
 * - Rules for the market's primary session do not have a `name` parameter and are enabled by default.
 * - Rules for the market's primary session are mandatory.
 * - Rules for secondary market sessions, such as pre-market or post-market trading hours sessions,  require a `name` parameter.
 * - All secondary market session are disabled by default.
 *
 * 		This is a rule for a 'pre' market session:
 * 			`{"dayofweek": 1, "open": "08:00", "close": "09:30", name: "pre"}`
 *
 * - To enable or disable secondary market session rules by session name, use {@link CIQ.Market#enableSession} and {@link CIQ.Market#disableSession}.
 *  - **Important:** Enabling/Disabling market sessions will not automatically filter-out data from the chart, but simply adjust the market iterators so the x-axis can be displayed accordingly in the absence of data for the excluded sessions.
 *  - Data filtering can be done:
 *    - Manually by requesting pertinent data from your feed and calling {@link CIQ.ChartEngine#loadChart}
 *    - Automatically by using the {@link CIQ.ExtendedHours} visualization and filtering add-on.
 * - First, the `dayofweek` wild card rules are processed. As soon as a rule is matched, processing breaks.
 *
 * 		This rule says the market is open every Monday from 9:30 to 16:00:
 * 			`{"dayofweek": 1, "open": "09:30", "close": "16:00"}`
 *
 * - After the `dayofweek` rules are processed all of the extra rules are processed.
 * - Multiple `open` and `close` times can be set for the same day of week. To indicate the market is closed during lunch, for example:
 * 	 ```
 * 	 {"dayofweek": 1, "open": "09:00", "close": "12:00"}, // mon
 *	 {"dayofweek": 1, "open": "13:00", "close": "17:00"}  // mon
 *	 ```
 *   - `close` time **must always** be later than `open` time.
 *   - Use the proper market timezone (`market_tz`) to prevent hours from spanning across days.
 *
 * - Wildcard rules should be placed first and more specific rules should be placed later.
 *
 * 		This rule is a wildcard rule for Christmas. If Christmas is on Monday, the
 * 		first set of rules will evaluate to true because the dayofweek rule for day
 * 		one will match. Then this rule will match if the date is the 25th of
 * 		December in any year.  Because open is 00:00 and close is 00:00, it will evaluate to false:
 * 			`{"date": "*-12-25", "open": "00:00", "close": "00:00"}`
 *
 * - After wildcard exceptions, any specific day and time can be matched.
 *
 * 		This rule says closed on this day only. Note that open and closed attributes
 * 		can be omitted to save typing if the market is closed the entire day:
 * 			`{"date": "2016-01-18"} //Martin Luther King day.`
 *
 * 		This rules says closed on 12-26:
 * 			`{"date": "2016-12-26"}, //Observed Christmas in 2016`
 *
 * 		This rule says partial session
 * 			`{"date": "2015-12-24", "open": "9:30", "close": "13:00"} //Christmas eve`
 *
 * See example section for a compete NYSE definition.
 *
 * Once defined, it can be used to create a new market instance.
 *
 * Example:
 * ```
 * var thisMarket = new CIQ.Market(marketDefinition);
 * ```
 *
 * If no definition is provided, the market will operate 24x7.
 *
 * Example:
 * ```
 * new CIQ.Market();
 * ```
 *
 * @param {object} [market_definition] A json object that contains the rules for some market. If not defined default market is always open.
 *
 * @constructor
 * @name  CIQ.Market
 * @since
 * <br>04-2016-08
 * <br>06-2016-02 - You can now specify times for different market sessions ('pre',post', etc) to be used with the sessions visualization tools. See {@link CIQ.ExtendedHours}.
 *
 * @example
 * CIQ.Market.NYSE = {
    "name": "NYSE",
    "market_tz": "America/New_York",
    "hour_aligned": false,
    "rules": [
      //First open up the regular trading times
      //Note that sat and sun (in this example) are always closed because
      //everything is closed by default and we didn't explicitly open them.
      {"dayofweek": 1, "open": "09:30", "close": "16:00"}, //mon
      {"dayofweek": 2, "open": "09:30", "close": "16:00"},
      {"dayofweek": 3, "open": "09:30", "close": "16:00"},
      {"dayofweek": 4, "open": "09:30", "close": "16:00"},
      {"dayofweek": 5, "open": "09:30", "close": "16:00"}, //fri

      //After Hours premarket
      {"dayofweek": 1, "open": "08:00", "close": "09:30", name: "pre"}, //mon
      {"dayofweek": 2, "open": "08:00", "close": "09:30", name: "pre"},
      {"dayofweek": 3, "open": "08:00", "close": "09:30", name: "pre"},
      {"dayofweek": 4, "open": "08:00", "close": "09:30", name: "pre"},
      {"dayofweek": 5, "open": "08:00", "close": "09:30", name: "pre"}, //fri

      //After Hours post
      {"dayofweek": 1, "open": "16:00", "close": "20:00", name: "post"}, //mon
      {"dayofweek": 2, "open": "16:00", "close": "20:00", name: "post"},
      {"dayofweek": 3, "open": "16:00", "close": "20:00", name: "post"},
      {"dayofweek": 4, "open": "16:00", "close": "20:00", name: "post"},
      {"dayofweek": 5, "open": "16:00", "close": "20:00", name: "post"}, //fri

      //Now Monday thru Friday is open. Close any exceptions

      //always closed on Christmas
      {"date": "*-12-25", "open": "00:00", "close": "00:00"},

      //always closed on 4th of July
      {"date": "*-07-04", "open": "00:00", "close": "00:00"},

      //always close on new years day
      {"date": "*-01-01", "open": "00:00", "close": "00:00"},

      //Some holidays are observed on different days each year or if
      //the day falls on a weekend. Each of those rules must be specified.
      {"date": "2012-01-02", "open": "00:00", "close": "00:00"},

      //As a special case if no open and close attributes are set they
      //will be assumed "00:00" and "00:00" respectively
      {"date": "2017-01-02"},

      {"date": "2016-01-18"},
      {"date": "2016-02-15"},
      {"date": "2016-03-25"},
      {"date": "2016-05-30"},
      {"date": "2016-09-05"},
      {"date": "2016-11-24"},
      {"date": "2016-11-25", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2016-11-25", "open": "9:30", "close": "13:00"},
      {"date": "2016-12-26"},

      {"date": "2015-01-19"},
      {"date": "2015-02-16"},
      {"date": "2015-04-03"},
      {"date": "2015-05-25"},
      {"date": "2015-07-03"},
      {"date": "2015-09-07"},
      {"date": "2015-11-26"},
      {"date": "2015-11-27", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2015-11-27", "open": "9:30", "close": "13:00"},
      {"date": "2015-12-24", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2015-12-24", "open": "9:30", "close": "13:00"},

      {"date": "2014-01-20"},
      {"date": "2014-02-17"},
      {"date": "2014-04-18"},
      {"date": "2014-05-26"},
      {"date": "2014-09-01"},
      {"date": "2014-11-27"},
      {"date": "2014-07-03", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2014-07-03", "open": "9:30", "close": "13:00"},
      {"date": "2014-11-28", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2014-11-28", "open": "9:30", "close": "13:00"},
      {"date": "2014-12-24", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2014-12-24", "open": "9:30", "close": "13:00"},

      {"date": "2013-01-21"},
      {"date": "2013-02-18"},
      {"date": "2013-03-29"},
      {"date": "2013-05-27"},
      {"date": "2013-09-02"},
      {"date": "2013-11-28"},
      {"date": "2013-07-03", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2013-07-03", "open": "9:30", "close": "13:00"},
      {"date": "2013-11-29", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2013-11-29", "open": "9:30", "close": "13:00"},
      {"date": "2013-12-24", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2013-12-24", "open": "9:30", "close": "13:00"},

      {"date": "2012-01-16"},
      {"date": "2012-02-20"},
      {"date": "2012-04-06"},
      {"date": "2012-05-28"},
      {"date": "2012-09-03"},
      {"date": "2012-10-29"},
      {"date": "2012-10-30"},
      {"date": "2012-11-22"},
      {"date": "2012-07-03", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2012-07-03", "open": "9:30", "close": "13:00"},
      {"date": "2012-11-23", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2012-11-23", "open": "9:30", "close": "13:00"},
      {"date": "2012-12-24", "open": "8:00", "close": "9:30", name: "pre"},
      {"date": "2012-12-24", "open": "9:30", "close": "13:00"}
    ]
  };
 */

var HOUR_MILLIS = 60000 * 60;
var DAY_MILLIS = HOUR_MILLIS * 24;

var ExistingMarket = CIQ.Market;

CIQ.Market = function (market_definition) {
	this.market_def = false;
	this.rules = false;
	this.normalHours = [];
	this.extraHours = [];
	this.class_name = "Market";
	if (!timezoneJS.Date) {
		this.tz_lib = Date; //needed to run unit tests
	} else {
		this.tz_lib = timezoneJS.Date;
	}
	this.market_tz = "";
	this.hour_aligned = false;
	this.convertOnDaily = false;
	this.enabled_by_default = false;

	//needed to run unit tests otherwise should do nothing
	if (
		typeof market_definition != "undefined" &&
		market_definition &&
		!CIQ.isEmpty(market_definition)
	) {
		if (market_definition.market_definition) {
			market_definition = market_definition.market_definition;
		}
		if (market_definition.rules) {
			this.rules = market_definition.rules;
		}
		if (market_definition.market_tz) {
			this.market_tz = market_definition.market_tz;
		}
		if (market_definition.convertOnDaily) {
			this.convertOnDaily = market_definition.convertOnDaily;
		}
		if (typeof market_definition.hour_aligned) {
			this.hour_aligned = market_definition.hour_aligned;
		}
		if (typeof market_definition.enabled_by_default !== "undefined") {
			if (market_definition.enabled_by_default instanceof Array) {
				this.enabled_by_default = market_definition.enabled_by_default;
			}
		}

		this.market_def = market_definition;
		if (this.market_def.name === undefined) {
			this.market_def.name = "no market name specified";
		}
	} else {
		return;
	}

	CIQ.Market._createTimeSegments(this);
	this.getSessionNames();
};

/**
 * Set of rules for identifying instrument's exchange and deriving a market definition from a symbol.
 * This is only required if your chart will need to know the operating hours for the different exchanges.
 * If using a 24x7 chart, this class is not needed.
 *
 * **Default implementation can be found in examples/markets/marketDefinitionsSample.js.  Please review and override the functions in there to match the symbol format of your quotefeed or results will be unpredictable.**
 *
 * @namespace
 * @name  CIQ.Market.Symbology
 * @since 04-2016-08
 */
CIQ.Market.Symbology = function () {};

/**
 * Returns true if the instrument is foreign.
 *
 * **This is dependent on the market data feed and should be overridden accordingly.**
 *
 * @param  {string}  symbol The symbol
 * @return {boolean}        True if it's a foreign symbol
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 * @example
 * CIQ.Market.Symbology.isForeignSymbol=function(symbol){
 *	if(!symbol) return false;
 *	return symbol.indexOf(".")!=-1;
 * };
 */
CIQ.Market.Symbology.isForeignSymbol = function (symbol) {
	return false;
};

/**
 * Returns true if the instrument is a future.
 *
 * **This is dependent on the market data feed and should be overridden accordingly.**
 *
 * @param  {string}  symbol The symbol
 * @return {boolean}        True if it's a futures symbol
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 * @example
 * CIQ.Market.Symbology.isFuturesSymbol=function(symbol){
 *	if(!symbol) return false;
 *	if(symbol.indexOf("/")!==0 || symbol=="/") return false;
 *	return true;
 * };
 */
CIQ.Market.Symbology.isFuturesSymbol = function (symbol) {
	return false;
};

/**
 * Determines whether an instrument is a rate.
 *
 * **Note:** This function is dependent on the market data feed and should be overridden accordingly.
 *
 * @param  {string}  symbol The symbol.
 * @return {boolean}        By default, false. Override this function to return true if the symbol
 * 					is a rate family or rate.
 * @memberof CIQ.Market.Symbology
 * @since 7.4.0
 * @example
 * CIQ.Market.Symbology.isRateSymbol=function(symbol){
 *	if(!symbol) return false;
 *	if(symbol.indexOf("%")!==0 || symbol=="%") return false;
 *	return true;
 * };
 */
CIQ.Market.Symbology.isRateSymbol = function (symbol) {
	return false;
};

/**
 * Returns true if the instrument is a forex symbol.
 *
 * **This is dependent on the market data feed and should be overridden accordingly.**
 *
 * @param  {string}  symbol The symbol
 * @return {boolean}        True if it's a forex symbol
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 * @example
 * CIQ.Market.Symbology.isForexSymbol=function(symbol){
 *	if(!symbol) return false;
 *  if(CIQ.Market.Symbology.isForeignSymbol(symbol)) return false;
 *  if(CIQ.Market.Symbology.isFuturesSymbol(symbol)) return false;
 *	if(symbol.length<6 || symbol.length>7) return false;
 *	if(symbol.length==6 && symbol[5]=="X") return false;  // This is a fund of some sort
 *	if(/\^?[A-Za-z]{6}/.test(symbol)) return true;
 *	return false;
 * };
 */
CIQ.Market.Symbology.isForexSymbol = function (symbol) {
	return false;
};

/**
 * Returns true if the symbol is a metal/currency or currency/metal pair
 *
 * **This is dependent on the market data feed and should be overridden accordingly.**
 *
 * @param  {string}   symbol The symbol
 * @param  {boolean}  inverse Set to true to test specifically for a currency/metal pair (e.g. EURXAU, but not XAUEUR).
 * @return {boolean}  True if it's a metal symbol
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 * @example
 * CIQ.Market.Symbology.isForexMetal=function(symbol,inverse){
 *	var metalsSupported={
 *		"XAU":true, "XAG":true, "XPT":true, "XPD":true
 *	};
 *	if(!symbol) return false;
 *  if(!CIQ.Market.Symbology.isForexSymbol(symbol)) return false;
 *	if(symbol.charAt(0)!="^") symbol="^"+symbol;
 *	if(!metalsSupported[symbol.substring(1,4)] && metalsSupported[symbol.substring(4,7)]) return true;
 *	else if(!inverse && metalsSupported[symbol.substring(1,4)] && !metalsSupported[symbol.substring(4,7)]) return true;
 *	return false;
 * };
 */
CIQ.Market.Symbology.isForexMetal = function (symbol, inverse) {
	return false;
};

/**
 * Returns true if the symbol is a forex or a future
 *
 * @param  {string} symbol The symbol
 * @return {boolean} True if the symbol is a forex or a future
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 */
CIQ.Market.Symbology.isForexFuturesSymbol = function (symbol) {
	if (CIQ.Market.Symbology.isForexSymbol(symbol)) return true;
	if (CIQ.Market.Symbology.isFuturesSymbol(symbol)) return true;
	return false;
};

/**
 * This is a function that takes a symbolObject of form accepted by {@link CIQ.ChartEngine#loadChart}, and returns a market definition.
 * When loading it with {@link CIQ.ChartEngine#setMarketFactory}, it will be used by the chart to dynamically change market definitions when a new instrument is activated.
 *
 * **Very important:**<br>
 * Default implementation can be found in examples/markets/marketDefinitionsSample.js.  Please review and override the functions in there to match the symbol format of your quotefeed or results will be unpredictable.
 *
 * See {@link CIQ.Market} for instruction on how to create a market definition.
 * @param  {object} symbolObject Symbol object of form accepted by {@link CIQ.ChartEngine#loadChart}
 * @return {object} A market definition. See {@link CIQ.Market} for instructions.
 * @memberof CIQ.Market.Symbology
 * @since 04-2016-08
 * @example
 * // default implementation
 * var factory=function(symbolObject){
 * 	var symbol=symbolObject.symbol;
 *	if(CIQ.Market.Symbology.isForeignSymbol(symbol)) return null; // 24 hour market definition
 *	if(CIQ.Market.Symbology.isFuturesSymbol(symbol)) return CIQ.Market.GLOBEX;
 *	if(CIQ.Market.Symbology.isForexMetal(symbol)) return CIQ.Market.METALS;
 *	if(CIQ.Market.Symbology.isForexSymbol(symbol)) return CIQ.Market.FOREX;
 *	return CIQ.Market.NYSE;
 * };
 */
CIQ.Market.Symbology.factory = function (symbolObject) {
	return null; // 24 hour market definition
};

/**
 * Encodes the string identifier for a specific instrument in a term structure chart. This
 * function is called when a time series chart is opened for a term structure instrument.
 * See {@link CurveEdit#launchTimeSeries}.
 *
 * Typically, the implementation of this function concatenates the term structure entity with
 * the instrument name to fully identify the instrument on the time series chart (see example).
 *
 * Override this function to specify whatever encoding you need for your use case.
 *
 * @param  {string} entity The symbol/entity for the curve; for example, "US-T BENCHMARK".
 * @param  {string} instrument An individual instrument; for example, "20 YR".
 * @return {string} The symbol for the individual instrument; for example, "US-T BENCHMARK 20 YR".
 * @memberOf CIQ.Market.Symbology
 * @since 7.4.0
 *
 * @example
 * 	CIQ.Market.Symbology.encodeTermStructureInstrumentSymbol = function(entity, instrument) {
 * 		// Remove leading % sign.
 * 		if (entity[0] === "%") entity = entity.slice(1);
 * 		return entity + " " + instrument;
 * 	};
 */
CIQ.Market.Symbology.encodeTermStructureInstrumentSymbol = function (
	entity,
	instrument
) {
	console.warn(
		"You are trying to call `CIQ.Market.Symbology.encodeTermStructureInstrumentSymbol` but have not implemented it."
	);
};

if (ExistingMarket) CIQ.extend(CIQ.Market, ExistingMarket);

/**
 * An array of objects containing information about the current market's extended sessions.
 * Each element has a name prop (for the name of the session) and an enabled prop.
 * See {@link CIQ.ExtendedHours} for more information on extended sessions.
 * @type array
 * @default
 * @alias sessions
 * @memberof CIQ.Market
 * @example
 * marketSessions=stxx.chart.market.sessions
 */
CIQ.Market.prototype.sessions = null;

/**
 * Returns an array of objects containing a list of sessions and whether or not they are enabled
 *
 * @return {array} String array of market session names, and corresponding status (e.g. [{ name: 'pre', enabled: false } { name: 'post', enabled: true }])
 * @since 6.0.0
 */
CIQ.Market.prototype.getSessionNames = function () {
	if (!this.rules) {
		//Its a safe assumption this is a 24 hour chart, and that it has no sessions
		this.sessions = [];
	} else if (!this.sessions) {
		var names = [];
		var marketSessions = [];

		this.rules.map(function (rule) {
			if (rule.name && names.indexOf(rule.name) === -1) {
				names.push(rule.name);

				marketSessions.push({
					name: rule.name,
					enabled: rule.enabled ? rule.enabled : false
				});
			}
		});

		this.sessions = marketSessions;
	}
	return this.sessions.slice();
};

/**
 * Primitive to find the next matching time segment taking into account rules for adjacent sessions.
 * If the date lands exactly on the open or close time for a session, then it will still seek to the next market session.
 * @param {date} date A start date time in the market_tz timezone.
 * @param {boolean} open True if looking for an open time
 * @return {date} A date in the market_tz timezone that falls somewhere in a matching time segment. Probably 1 before close. Or null if no rules are defined
 * @memberof CIQ.Market
 * @since  05-2016-10
 * @private
 */
CIQ.Market.prototype._find_next_segment = function (date, open) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = new Date(+date);
	var iter = this.newIterator({
		begin: d,
		interval: 1,
		inZone: this.market_tz,
		outZone: this.market_tz
	});
	if (this._wasOpenIntraDay(d)) {
		var hours = this.zseg_match.close_parts.hours;
		var minutes = this.zseg_match.close_parts.minutes;
		d.setHours(hours);
		d.setMinutes(minutes);
		iter = this.newIterator({
			begin: d,
			interval: 1,
			inZone: this.market_tz,
			outZone: this.market_tz
		});
	}
	return iter.next();
};

/**
 * Primitive to find the previous matching time segment taking into account rules for adjacent sessions.
 * If the date lands exactly on the open or close time for a session, then it will still seek to the previous market session.
 * @param {date} date A start date time in the market_tz timezone.
 * @param {boolean} open True if looking for an open time
 * @return {date} A date in the market_tz timezone that falls somewhere in a matching time segment. Probably 1 before close. Or null of no rules are defined.
 * @memberof CIQ.Market
 * @since  05-2016-10
 * @private
 */
CIQ.Market.prototype._find_prev_segment = function (date, open) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = new Date(+date);
	var iter = this.newIterator({
		begin: d,
		interval: 1,
		inZone: this.market_tz,
		outZone: this.market_tz
	});

	var wasOpenIntraDay = this._wasOpenIntraDay(d);

	// adjust edge cases to force a previous instance
	// if we are at the exact open or close time, go back one tick to force a previous session
	if (wasOpenIntraDay === null) {
		// move back one minute... not in the market clock.
		d = new Date(d - 60000);
		// then see if there was a session a minute ago... if so, then we were at the exact open or close time
		wasOpenIntraDay = this._wasOpenIntraDay(d);
	} else {
		if (
			(open &&
				d.getHours() === this.zseg_match.open_parts.hours &&
				d.getMinutes() === this.zseg_match.open_parts.minutes) ||
			(!open &&
				d.getHours() === this.zseg_match.close_parts.hours &&
				d.getMinutes() === this.zseg_match.close_parts.minutes)
		) {
			d = iter.previous();
		}
	}

	if (wasOpenIntraDay) {
		var hours = this.zseg_match.open_parts.hours;
		var minutes = this.zseg_match.open_parts.minutes;
		d.setHours(hours);
		d.setMinutes(minutes);
		iter = this.newIterator({
			begin: d,
			interval: 1,
			inZone: this.market_tz,
			outZone: this.market_tz
		});
		d = iter.previous();

		if (this.zseg_match.close_parts.hours === hours) {
			if (this.zseg_match.close_parts.minutes === minutes) {
				// segments are adjacent use the previous
				if (open) {
					return iter.next();
				}
				return d;
			}
		}
		if (this.zseg_match.adjacent_child) {
			// segments are adjacent use the previous
			return d;
		}
		if (open) {
			// segments are not adjacent go back
			return iter.next();
		}
		return d;
	}
	return iter.previous();
};

/**
 * Toggle on/off a market session by name.
 *
 * - **Important:** Enabling/Disabling market sessions will not automatically filter-out data from the chart, but simply adjust the market iterators so the x-axis can be displayed accordingly in the absence of data for the excluded sessions.
 * - Data filtering can be done:
 *   - Manually by requesting pertinent data from your feed and calling {@link CIQ.ChartEngine#loadChart}
 *   - Automatically by using the {@link CIQ.ExtendedHours} visualization and filtering add-on.
 *
 * @param {string} session_name A session name matching a valid name present in the market definition.
 * @param {object} [inverted] Any true value (`true`, non-zero value or string) passed here will enable the session, otherwise the session will be disabled.
 * @memberof CIQ.Market
 * @since  06-2016-02
 */
CIQ.Market.prototype.disableSession = function (session_name, inverted) {
	var inverted_ = false;
	if (typeof inverted !== "undefined" && inverted) {
		inverted_ = true;
	}
	if (session_name) {
		for (var i = 0; i < this.normalHours.length; i++) {
			if (this.normalHours[i].name === session_name) {
				this.normalHours[i].enabled = inverted_;
			}
		}
		for (i = 0; i < this.extraHours.length; i++) {
			if (this.extraHours[i].name === session_name) {
				this.extraHours[i].enabled = inverted_;
			}
		}
	}
};

/**
 * Enable a market session by name. See {@link CIQ.Market#disableSession} for full usage details.
 * @param {string} session_name A session name
 * @memberof CIQ.Market
 * @since  06-2016-02
 */
CIQ.Market.prototype.enableSession = function (session_name) {
	this.disableSession(session_name, "enable_instead");
};

/**
 * Parses the market definition for a list of market names, and enables each one-by-one, see {@link CIQ.Market#enableSession} and {@link CIQ.Market#disableSession}.
 *  - **Important:** Enabling/Disabling market sessions will not automatically filter-out data from the chart, but simply adjust the market iterators so the x-axis can be displayed accordingly in the absence of data for the excluded sessions.
 * @memberof CIQ.Market
 * @since 6.0.0
 */
CIQ.Market.prototype.enableAllAvailableSessions = function () {
	var marketSessions = this.getSessionNames();
	for (var i = 0; i < marketSessions.length; i++) {
		this.enableSession(marketSessions[i].name);
	}
};

/**
 * Get the close date/time for the trading day or specific session.
 * @param {date} [date=now] date The date on which to check.
 * @param {string} [session_name] Specific market session. If `session_name` is not passed in, the first close time of the day will be returned,
 * depending on the sessions that are enabled.  If a session name is passed in, then not only does the market session
 * need to be open on the day of `date`, but also within the time of the specified session.  Otherwise, null will be returned.
 * Pass in "" to specify only the default session when other session are also active.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} Close date/time for the trading session or null if the market is
 * closed for the given date.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getClose = function (date, session_name, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);

	if (typeof session_name !== "undefined") {
		if (this._wasOpenIntraDay(d)) {
			if (this.zseg_match.name === session_name) {
				d.setHours(
					this.zseg_match.close_parts.hours,
					this.zseg_match.close_parts.minutes,
					0,
					0
				);
				d = this._convertFromMarketTZ(d, outZone);
				return d;
			}
		}
	} else {
		if (this._wasOpenDaily(d)) {
			var zseg_match = this.zseg_match;

			//find the last session of the day
			while (zseg_match.child_) {
				zseg_match = zseg_match.child_;
			}

			//find the last enabled session ... maybe back where we started
			while (!zseg_match.enabled) {
				zseg_match = zseg_match.parent_;
			}

			d.setHours(
				zseg_match.close_parts.hours,
				zseg_match.close_parts.minutes,
				0,
				0
			);
			d = this._convertFromMarketTZ(d, outZone);
			return d;
		}
	}
	return null;
};

/**
 * Get the close time for the current market session, or if the market is closed, the close time for the next market session.
 * @param {date} [date=now] date The date on which to check.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} A date set to the close time of the next open market session.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getNextClose = function (date, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case

	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);
	if (!this._wasOpenIntraDay(d)) {
		var iter = this.newIterator({
			begin: d,
			interval: 1,
			inZone: this.market_tz,
			outZone: this.market_tz
		});
		d = iter.next();
	}
	var date_ = d.getDate();
	var zseg_match = this.zseg_match;
	while (zseg_match.adjacent_child) {
		zseg_match = zseg_match.adjacent_child;
		date_ += 1;
	}
	d.setDate(date_);
	d.setHours(
		zseg_match.close_parts.hours,
		zseg_match.close_parts.minutes,
		0,
		0
	);
	d = this._convertFromMarketTZ(d, outZone);
	return d;
};

/**
 * Get the next market session open time. If the requested date is the opening time for the session, then
 * it will iterate to opening time for the next market session.
 * @param {date} [date=now] date An The date on which to check.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} A date aligned to the open time of the next open session. If no rules are defined, it will return null.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getNextOpen = function (date, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);
	d = this._find_next_segment(d);
	if (this.zseg_match.adjacent_parent) {
		d = this.getNextOpen(d, this.market_tz, this.market_tz);
		d = this._convertFromMarketTZ(d, outZone);
		return d;
	}
	d.setHours(this.zseg_match.open_parts.hours);
	d.setMinutes(this.zseg_match.open_parts.minutes);
	d = this._convertFromMarketTZ(d, outZone);
	return d;
};

/**
 * Get the open date/time for a market day or specific session.
 * @param {date} [date=now] date The date on which to check.
 * @param {string} [session_name] Specific market session. If `session_name` is not passed in, the first open time of the day will be returned,
 * depending on the sessions that are enabled.  If a session name is passed in, then not only does the market session
 * need to be open on the day of `date`, but also within the time of the specified session.  Otherwise, null will be returned.  Pass in "" to
 * specify only the default session when other session are also active.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} A date time for the open of a session or null if the market is
 * closed for the given date or there are no market rules to check.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getOpen = function (date, session_name, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);
	if (typeof session_name !== "undefined") {
		if (this._wasOpenIntraDay(d)) {
			if (this.zseg_match.name == session_name) {
				d.setHours(
					this.zseg_match.open_parts.hours,
					this.zseg_match.open_parts.minutes,
					0,
					0
				);
				d = this._convertFromMarketTZ(d, outZone);
				return d;
			}
		}
	} else {
		if (this._wasOpenDaily(d)) {
			var zseg_match = this.zseg_match;

			//find all of the parents if any
			while (zseg_match.parent_) {
				zseg_match = zseg_match.parent_;
			}

			//find the first enabled child ... might end up back where we started
			while (!zseg_match.enabled) {
				zseg_match = zseg_match.child_;
			}

			d.setHours(
				zseg_match.open_parts.hours,
				zseg_match.open_parts.minutes,
				0,
				0
			);
			d = this._convertFromMarketTZ(d, outZone);
			return d;
		}
	}
	return null;
};

/**
 * Get the previous session close time.
 * If the date lands exactly on the close time for a session then it will still seek to the previous market session's close.
 * @param {date} [date=now] date The date on which to check.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} A date aligned to the previous close date/time of a session. If no rules are defined, it will return null.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getPreviousClose = function (date, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);
	d = this._find_prev_segment(d, false);
	if (this.zseg_match.adjacent_child) {
		return this.getPreviousClose(d, this.market_tz, this.market_tz);
	}
	d.setHours(this.zseg_match.close_parts.hours);
	d.setMinutes(this.zseg_match.close_parts.minutes);
	d = this._convertFromMarketTZ(d, outZone);
	return d;
};

/**
 * Get the previous session open time. If the date lands exactly on the open time for a session then
 * it will still seek to the previous market session's open.
 * @param {date} [date=now] date An The date on which to check.
 * @param {string} [inZone] Optional datazone to translate from - If no market zone is present it will assume browser time.
 * @param {string} [outZone] Optional datazone to translate to - If no market zone is present it will assume browser time.
 * @return {date} A date aligned to previous open date/time of a session. If no rules are defined, it will return null.
 * @memberof CIQ.Market
 * @since  05-2016-10
 */
CIQ.Market.prototype.getPreviousOpen = function (date, inZone, outZone) {
	if (!this.market_def) return null; // special case
	if (!this.rules) return null; //special case
	var d = date;
	if (!date) {
		d = new Date();
		inZone = null; // if they don't send the date we set one up in browser time, so need to remove the inZone
	}
	d = this._convertToMarketTZ(d, inZone);
	d = this._find_prev_segment(d, true);
	if (this.zseg_match.adjacent_parent) {
		return this.getPreviousOpen(d, this.market_tz, this.market_tz);
	}
	d.setHours(this.zseg_match.open_parts.hours);
	d.setMinutes(this.zseg_match.open_parts.minutes);
	d = this._convertFromMarketTZ(d, outZone);
	return d;
};

/**
 * Return the session name for a date. If the name is defined and if the date
 * lands in a session that is open. Otherwise return null.
 * @param {date} date A date object
 * @param {string} [inZone] Timezone of incoming date - If no market zone is present it will assume browser time.
 * @return {object} String or null
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype.getSession = function (date, inZone) {
	date = this._convertToMarketTZ(date, inZone);
	if (this._wasOpenIntraDay(date) && this.zseg_match) {
		return this.zseg_match.name;
	}
	return null;
};

/**
 * @return {date} Current time in the market zone
 * @memberof CIQ.Market
 * @since 04-2016-08
 */
CIQ.Market.prototype.marketZoneNow = function () {
	return this._convertToMarketTZ(new Date());
};

/**
 * @return {boolean} `true` if this market is hour aligned.
 * @memberof CIQ.Market
 * @since 04-2016-08
 */
CIQ.Market.prototype.isHourAligned = function () {
	return this.hour_aligned;
};

/**
 * Checks if the market is currently open.
 * @return {object} An object with the open market session's details, if the market is open right now. Or `null` if no sessions are currently open.
 * @memberof CIQ.Market
 * @since 04-2016-08
 */
CIQ.Market.prototype.isOpen = function () {
	var now = new Date();
	if (this.market_tz) {
		now = new this.tz_lib(now.getTime(), this.market_tz);
	}
	return this._wasOpenIntraDay(now);
};

/**
 * Checks if today it is a market day.
 * @return {object} An object with the open market session's details, if it is a market day. Or `null` if it is not a market day.
 * @memberof CIQ.Market
 * @since 04-2016-08
 */
CIQ.Market.prototype.isMarketDay = function () {
	var now = new Date();
	if (this.market_tz) {
		now = new this.tz_lib(now.getTime(), this.market_tz);
	}
	return this._wasOpenDaily(now);
};

/**
 * Checks if a supplied date is a market day.  Only the date is examined; hours, minutes, seconds are ignored
 * @param {date} date A date
 * @return {object} An object with the open market session's details, if it is a market day. Or `null` if it is not a market day.
 * @memberof CIQ.Market
 * @since 04-2016-08
 */
CIQ.Market.prototype.isMarketDate = function (date) {
	return this._wasOpenDaily(date);
};

/**
 * Creates iterators for the associated Market to traverse through time taking into account market hours.
 * An iterator instance can go forward or backward in time any arbitrary amount.
 * However, the internal state cannot be changed once it is constructed. A new iterator should be
 * constructed whenever one of the parameters changes. For example, if the
 * `interval` changes a new iterator will need to be built. If the `displayZone`
 * or `dataZone` changes on the market, new iterators will also need to be
 * constructed.
 *
 * See {@link CIQ.Market.Iterator} for all available methods.
 *
 * See the following convenience functions: {@link CIQ.ChartEngine#getNextInterval} and  {@link CIQ.ChartEngine#standardMarketIterator}
 *
 * @param {object} parms Parameters used to initialize the Market object.
 * @param {string} [parms.interval] A valid interval as required by {@link CIQ.ChartEngine#setPeriodicity}. Default is 1 (minute).
 * @param {number} [parms.periodicity] A valid periodicity as required by {@link CIQ.ChartEngine#setPeriodicity}. Default is 1.
 * @param {string} [parms.timeUnit] A valid timeUnit as required by {@link CIQ.ChartEngine#setPeriodicity}. Default is "minute"
 * @param {date} [parms.begin] The date to set as the start date for this iterator instance. Default is `now`. Will be assumed to be `inZone` if one set.
 * @param {string} [parms.inZone] A valid timezone from the timeZoneData.js library. This should represent the time zone for any input dates such as `parms.begin` in this function or `parms.end` in {@link CIQ.Market.Iterator#futureTick}. Defaults to browser timezone if none set.  - If no market zone is present it will assume browser time.
 * @param {string} [parms.outZone] A valid timezone from the timeZoneData.js library. This should represent the time zone for the returned dates. Defaults to browser timezone if none set.  - If no market zone is present it will assume browser time.
 * @return {object} A new iterator.
 * @memberof CIQ.Market
 * @since 04-2016-08
 * @example
    var iter = stxx.chart.market.newIterator(
			{
				'begin': now,
                'interval': stxx.layout.interval,
                'periodicity': stxx.layout.periodicity,
                'timeUnit': stxx.layout.timeUnit,
                'inZone': stxx.dataZone,
                'outZone': stxx.displayZone
			}
	);
 */
CIQ.Market.prototype.newIterator = function (parms) {
	var _multiple = false;
	if (parms.periodicity) {
		_multiple = parms.periodicity;
	} else if (parms.multiple) {
		_multiple = parms.multiple;
	}
	var _interval = parms.interval;
	if (!_interval) {
		_interval = "minute";
	}
	if (_interval == "hour") _interval = 60;
	if (!_multiple) {
		_multiple = 1;
	}
	if (!parms.begin) {
		parms.begin = new Date();
		parms.inZone = null;
	}
	if (_interval == parseInt(_interval, 10)) {
		_interval = parseInt(_interval, 10); // in case it was a string, which is allowed in setPeriodicity.

		// if the periodicity<1 then the x-axis might be in seconds (<1/60, msec)
		if (parms.periodicity < 1 / 60) {
			_multiple = _multiple * _interval * 60000;
			_interval = "millisecond";
		} else if (parms.periodicity < 1) {
			_multiple = _multiple * _interval * 60;
			_interval = "second";
		} else {
			_multiple = _multiple * _interval;
			_interval = "minute";
		}
	}
	if (parms.timeUnit) {
		if (parms.timeUnit === "millisecond") {
			_interval = parms.timeUnit;
		} else if (parms.timeUnit === "second") {
			_interval = parms.timeUnit;
		} else if (parms.timeUnit === "tick") {
			_interval = "second";
		}
	}
	if (_interval == "tick") _interval = "second";
	parms.interval = _interval;
	parms.multiple = _multiple;
	parms.market = this;
	return new CIQ.Market.Iterator(parms);
};

/**
 * Calculate whether this market was open on some date. This will depend on
 * the data used when creating this market. This function does not take into
 * account intraday data. It simply checks the date to see if the market was
 * open at all on that day. Hours, minutes, seconds are ignored.
 * @param {date} historical_date Javascript date object with timezone in the market time zone.
 * @return {boolean} true if the market was open.
 * @memberof CIQ.Market
 * @since 04-2016-08
 * @private
 */
CIQ.Market.prototype._wasOpenDaily = function (historical_date) {
	return this._was_open(historical_date, false);
};

/**
 * Calculate whether this market was open on some date. This will depend on
 * The data used when creating this market. This function will take into
 * account intraday date that is minutes and seconds. Not only does a market
 * need to be open on the day in question but also within the time specified.
 * @param {date} historical_date Javascript date object with timezone in the market time zone.
 * @return {boolean} true if the market was open.
 * @memberof CIQ.Market
 * @since 04-2016-08
 * @private
 */
CIQ.Market.prototype._wasOpenIntraDay = function (historical_date) {
	return this._was_open(historical_date, true);
};

/**
 * Given some javascript date object calculate whether this market was open.
 * Use _wasOpenDaily or _wasOpenIntraDay instead. As a special case if
 * no market json has been defined this function will always return true.
 * @param {date} historical a valid Javascript date object with timezone in the market time zone.
 * @param {boolean} intra_day true if intraday (will check between open and close times)
 * @return {object} matching segment if any, or null if not
 * @private
 */
CIQ.Market.prototype._was_open = function (historical, intra_day) {
	// This function will reset all of the `z` properties to match the market segment matching `historical`
	// Whether the matching segment has changed helps to determine whether we should reset the date to the
	// beginning of the market segment. Here we store a record of the previously set `zseg_match` to
	// facilitate that determination later.
	var previously_set_zseg_match = this.zseg_match;

	this.zopen_hour = 0;
	this.zopen_minute = 0;
	this.zclose_hour = 0;
	this.zclose_minute = 0;
	this.zmatch_open = false;
	this.zseg_match = null;
	if (!this.market_def || !this.rules) {
		// special case, 24h security
		this.zclose_hour = 24;
		return true;
	}
	var normally_open = false;
	var extra_open = false;
	var year = historical.getFullYear();
	var month = historical.getMonth() + 1;
	var day = historical.getDay();
	var date = historical.getDate();
	var hour = historical.getHours();
	var minutes = historical.getMinutes();
	var seconds = historical.getSeconds();
	var segment;
	var midnight_secs = hour * 60 * 60 + minutes * 60 + seconds;

	if (typeof intra_day === "undefined") {
		intra_day = true;
	}

	var i;
	for (i = 0; i < this.normalHours.length; i++) {
		segment = this.normalHours[i];
		if (!segment.enabled) {
			continue;
		}
		normally_open = segment.dayofweek === day;
		if (normally_open && intra_day) {
			normally_open =
				midnight_secs >= segment.open && midnight_secs < segment.close;
		}
		if (normally_open) {
			if (!intra_day && this.zseg_match) {
				if (
					segment.open_parts.hours > this.zopen_hour ||
					(segment.open_parts.hours == this.zopen_hour &&
						segment.open_parts.minutes > this.zopen_minute)
				) {
					continue;
				}
			}

			// We may want to reset the date to the beginning of the segment if the `zseg_match` has
			// changed and if the segment is not one part of a single session (a trading period extending
			// into a second day). We determine these factors by comparing `segment` to the previously set
			// `zseg_match` and by checking whether the `segment` has an `adjacent_parent` or `adjacent_child`.
			// If these factors indicate we should reset reset the time to the beginning of the segment, we
			// store that determination on the object to know to take that action later.
			if (
				segment !== previously_set_zseg_match &&
				!segment.adjacent_parent &&
				!segment.adjacent_child
			) {
				this.shouldResetToBeginningOfSegment = true;
			}

			this.zopen_hour = segment.open_parts.hours;
			this.zopen_minute = segment.open_parts.minutes;
			this.zclose_hour = segment.close_parts.hours;
			this.zclose_minute = segment.close_parts.minutes;
			this.zmatch_open = midnight_secs === segment.open;
			this.zseg_match = segment;
			if (intra_day) break;
		}
	}

	for (i = 0; i < this.extraHours.length; i++) {
		segment = this.extraHours[i];
		if (!segment.enabled) {
			continue;
		}
		if ("*" === segment.year || year === segment.year) {
			if (month === segment.month && date === segment.day) {
				extra_open =
					(!intra_day && segment.open) ||
					(midnight_secs >= segment.open && midnight_secs < segment.close);
				if (!extra_open && this.zseg_match) {
					normally_open = false;
					this.zopen_hour = 0;
					this.zopen_minute = 0;
					this.zclose_hour = 0;
					this.zclose_minute = 0;
					this.zmatch_open = false;
					this.zseg_match = null;
				}
				if (extra_open) {
					if (!intra_day && this.zseg_match) {
						if (
							segment.open_parts.hours > this.zopen_hour ||
							(segment.open_parts.hours == this.zopen_hour &&
								segment.open_parts.minutes > this.zopen_minute)
						) {
							continue;
						}
					}
					this.zopen_hour = segment.open_parts.hours;
					this.zopen_minute = segment.open_parts.minutes;
					this.zclose_hour = segment.close_parts.hours;
					this.zclose_minute = segment.close_parts.minutes;
					this.zmatch_open = midnight_secs === segment.open;
					this.zseg_match = segment;
					if (intra_day) break;
				}
			}
		}
	}

	return this.zseg_match;
};

/**
 * Convenience function for unit testing.
 * @param {date} testDate A date
 * @return {boolean} True if the market was closed on the given date
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype._wasClosed = function (testDate) {
	return !this._was_open(testDate, true);
};

/**
 * Convenience function for unit testing.
 * @param {date} testDate A date
 * @return {boolean} True if the market was open on the given date
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype._wasOpen = function (testDate) {
	return this._was_open(testDate, true);
};

/**
 * Get the difference in milliseconds between two time zones. May be positive or
 * negative depending on the time zones. The purpose is to shift the source
 * time zone some number of milliseconds to the target timezone. For example shifting
 * a data feed from UTC to Eastern time. Or shifting Eastern time to Mountain
 * time for display purposes. Note that it is important to pass the source
 * and the target in the correct order. The algorithm does source - target. This
 * will calculate the correct offset positive or negative.
 * @param {date} date A date object. Could be any date object the javascript one
 * or for example the timezone.js one. Must implement getTime() and
 * getTimezoneOffset()
 * @param {string} src_tz_str The source time zone. For example the data feed
 * @param {string} target_tz_str The target time zone for example the market.
 * @return {number} The number of milliseconds difference between the time
 * zones.
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype._tzDifferenceMillis = function (
	date,
	src_tz_str,
	target_tz_str
) {
	var millis = 0;
	var src_date = date;
	var target_date = date;
	var minutes = src_date.getTimezoneOffset() - target_date.getTimezoneOffset();
	millis = minutes * 60 * 1000;
	return millis;
};

/**
 * Static function that reads the json rules in the market definition and
 * creates in memory time segments that are used later to match market dates.
 * @param {object} market An instance of a market.
 * @memberOf  CIQ.Market
 */
CIQ.Market._createTimeSegments = function (market) {
	var link_adjacent = function (r0_, r1_) {
		if (r0_.close_parts.hours === 24 && r1_.open_parts.hours === 0) {
			if (r1_.open_parts.minutes === 0) {
				if (p_rule.dayofweek === rd.dayofweek - 1) {
					return true;
				}
				if (p_rule.dayofweek === 6 && rd.dayofweek === 0) {
					return true;
				}
			}
		}
		return false;
	};
	var p_rule;
	for (var i = 0; i < market.rules.length; i++) {
		var rule = JSON.parse(JSON.stringify(market.rules[i]));
		if (typeof rule.open === "undefined" && typeof rule.close === "undefined") {
			rule.open = "00:00";
			rule.close = "00:00";
		}
		if (!rule.hasOwnProperty("name")) {
			rule.name = "";
		}
		try {
			var rd;
			if (typeof rule.dayofweek !== "undefined") {
				rule.year = "*";
				rd = _TimeSegmentS._createDayOfWeekSegment(market, rule);
				if (p_rule) {
					if (p_rule.dayofweek === rd.dayofweek) {
						//These links are used for finding open and close times
						//On the same day in multiple sessions
						p_rule.child_ = rd;
						rd.parent_ = p_rule;
					} else {
						if (link_adjacent(p_rule, rd)) {
							//These links are used for finding open and close
							//times for sessions that span days
							p_rule.adjacent_child = rd;
							rd.adjacent_parent = p_rule;
						}
					}
				}
				p_rule = rd;
			} else if (typeof rule.date !== "undefined") {
				rule.isDayOfWeek = false;
				rule.dayofweek = -1;
				rd = _TimeSegmentS._createDateTimeSegment(market, rule);
			} else {
				console.log("Error, unknown rule type " + rule);
			}
			if (market.enabled_by_default) {
				for (var x = 0; x < market.enabled_by_default.length; x++) {
					var n = market.enabled_by_default[x];
					if (rd.name === n) {
						rd.enabled = true;
						break;
					}
				}
			} else {
				//always enabled if no defaults are defined
				//rd.enabled = true;
			}
		} catch (err) {
			console.log("Error, creating market rules " + err);
		}
	}
};

/**
 * Internal static utility methods used to create market time segments.
 * @private
 */
CIQ.Market._timeSegment = {};
var _TimeSegmentS = CIQ.Market._timeSegment;

_TimeSegmentS.re_wild_card_iso = /^(\*)-(\d\d)-(\d\d)$/;
_TimeSegmentS.re_regular_iso = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
_TimeSegmentS.re_split_hours_minutes = /^(\d\d):(\d\d)$/;
_TimeSegmentS.re_split_hour_minutes = /^(\d):(\d\d)$/;

/**
 * Create a hash code for a string. We may move this to 3rd party later if
 * we find a wider need for it. This came from StackOverflow and claims to be
 * the same implementation used by Java.
 * @param {string} str A string.
 * @return {number} A number suitable for
 * @private
 */
_TimeSegmentS._hashCode = function (str) {
	var hash = 0,
		i,
		chr,
		len;
	if (str.length === 0) return hash;
	for (i = 0, len = str.length; i < len; i++) {
		chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/**
 * Split the hours and minutes from a json time segment rule.
 * @param {string} str \d\d:\d\d or \d:\d\d
 * @return {object} {minutes:int, hours:int}
 * @private
 */
_TimeSegmentS._splitHoursMinutes = function (str) {
	var parts = _TimeSegmentS.re_split_hour_minutes.exec(str);
	var ret_val = { hours: NaN, minutes: NaN };
	if (parts === null) {
		parts = _TimeSegmentS.re_split_hours_minutes.exec(str);
		if (parts === null) {
			return ret_val;
		}
	}
	ret_val.hours = parseInt(parts[1], 10);
	ret_val.minutes = parseInt(parts[2], 10);
	return ret_val;
};

/**
 * Create a time segment for some day of the week. This creates a wildcard
 * segment that matches the same weekday in any month and any year.
 * @param {object} market The instance of this market
 * @param {object} rule Represents the data from one rule in the JSON
 * @return {object}
 * configuration.
 * @private
 */
_TimeSegmentS._createDayOfWeekSegment = function (market, rule) {
	var data = {
		name: rule.name,
		isDayOfWeek: true,
		dayofweek: rule.dayofweek,
		date_str: "*",
		open_parts: _TimeSegmentS._splitHoursMinutes(rule.open),
		close_parts: _TimeSegmentS._splitHoursMinutes(rule.close),
		open: _TimeSegmentS._secSinceMidnight(market, rule.open, true),
		close: _TimeSegmentS._secSinceMidnight(market, rule.close, false),
		child_: false,
		parent_: false,
		adjacent_child: false,
		adjacent_parent: false,
		enabled: false
	};
	if (data.name === "") {
		data.enabled = true;
	}
	data.hash_code = this._hashCode((data.open + data.close).toString());
	market.normalHours.push(data);
	return data;
};

/**
 * Create a time segment for a specific date and time. This can also create
 * a wild card segment that matches any year with a specific day and specific
 * month. For example *-12-25 to match all Christmas days. It can also build
 * any specific year month day open close time that will only match that
 * specific range.
 * @param {object} market an instance of a market
 * @param {object} rule a single rule from a market definition
 * @return {object|undefined} Undefined if this function works on the market object.
 * @private
 */
_TimeSegmentS._createDateTimeSegment = function (market, rule) {
	var pieces = this.re_regular_iso.exec(rule.date);
	var year;
	if (pieces === null) {
		pieces = this.re_wild_card_iso.exec(rule.date);
		if (pieces === null) {
			console.log("Warning: invalid date format on rule -> " + rule.date);
			return;
		}
		year = "*"; //all years
	} else {
		year = parseInt(pieces[1], 10);
	}
	var data = {
		name: rule.name,
		isDayOfWeek: false,
		dayofweek: -1,
		year: year,
		month: parseInt(pieces[2], 10),
		day: parseInt(pieces[3], 10),
		date_str: rule.date,
		open_parts: _TimeSegmentS._splitHoursMinutes(rule.open),
		close_parts: _TimeSegmentS._splitHoursMinutes(rule.close),
		open: _TimeSegmentS._secSinceMidnight(market, rule.open, true),
		close: _TimeSegmentS._secSinceMidnight(market, rule.close, false),
		enabled: false
	};
	if (data.name === "") {
		data.enabled = true;
	}
	data.hash_key = this._hashCode(data.date_str + data.open + data.close);
	market.extraHours.push(data);
	return data;
};

/**
 * Calculate the seconds since midnight for some time string. These time strings
 * come from the market definition. These are intended to be open and close
 * times.
 * @param {object} market An instance of a market
 * @param {string} time_str A time string like this "\d\d:\d\d"
 * @param {boolean} open_time If true the time is used for opening a market
 * @return {number} Seconds since midnight
 * otherwise the time is used for closing a market. This is so that we can
 * handle 00:00 and 24:00.
 * @private
 */
_TimeSegmentS._secSinceMidnight = function (market, time_str, open_time) {
	var parts = time_str.split(":");
	var hours = parseInt(parts[0], 10);
	var minutes = parseInt(parts[1], 10);
	var seconds = hours * 60 * 60 + minutes * 60;

	if (!open_time) {
		if (hours === 24) {
			seconds = hours * 60 * 60 + 1;
		}
	}
	return seconds;
};

/**
 * Converts from the given timezone into the market's native time zone
 * If no market zone is present, the date will be returned unchanged.
 * @param  {date} dt JavaScript Date
 * @param  {string} [tz] timezoneJS timezone, or null to indicate browser localtime/UTC (dataZone)
 * @return {date}    A JavaScript Date offset by the timezone change
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype._convertToMarketTZ = function (dt, tz) {
	//if(!this.market_tz) return dt;
	var tzdt;
	if (tz) {
		tzdt = new this.tz_lib(
			dt.getFullYear(),
			dt.getMonth(),
			dt.getDate(),
			dt.getHours(),
			dt.getMinutes(),
			dt.getSeconds(),
			dt.getMilliseconds(),
			tz
		);
	} else {
		tzdt = new this.tz_lib(
			dt.getFullYear(),
			dt.getMonth(),
			dt.getDate(),
			dt.getHours(),
			dt.getMinutes(),
			dt.getSeconds(),
			dt.getMilliseconds()
		);
	}
	if (tzdt.setTimezone) tzdt.setTimezone(this.market_tz);
	return new Date(
		tzdt.getFullYear(),
		tzdt.getMonth(),
		tzdt.getDate(),
		tzdt.getHours(),
		tzdt.getMinutes(),
		tzdt.getSeconds(),
		tzdt.getMilliseconds()
	);
};

/**
 * Converts to the given timezone from the market's native time zone.
 * If no market zone is present, the date will be returned un changed.
 * @param  {date} dt JavaScript Date
 * @param  {string} [tz] timezoneJS timezone, or null to indicate browser localtime/UTC (displayZone)
 * @return {date}    A JavaScript Date offset by the timezone change
 * @memberOf  CIQ.Market
 */
CIQ.Market.prototype._convertFromMarketTZ = function (dt, tz) {
	//if(!this.market_tz) return dt;
	var tzdt = new this.tz_lib(
		dt.getFullYear(),
		dt.getMonth(),
		dt.getDate(),
		dt.getHours(),
		dt.getMinutes(),
		dt.getSeconds(),
		dt.getMilliseconds(),
		this.market_tz
	);
	if (tz) {
		if (tzdt.setTimezone) tzdt.setTimezone(tz);
	} else {
		return new Date(tzdt.getTime());
	}
	return new Date(
		tzdt.getFullYear(),
		tzdt.getMonth(),
		tzdt.getDate(),
		tzdt.getHours(),
		tzdt.getMinutes(),
		tzdt.getSeconds(),
		tzdt.getMilliseconds()
	);
};

/**
 * Builds an iterator instance and returns it to the requesting market when {@link CIQ.Market#newIterator} is called. Do not call this constructor directly.
 *
 * @name CIQ.Market.Iterator
 * @param {object} parms
 * @param {object} parms.begin A dataset element from {@link CIQ.Chart.dataSet}
 * @param {CIQ.Market} parms.market An instane of {@link CIQ.Market}
 * @param {object} parms.periodicity A valid periodicity as require by {@link CIQ.ChartEngine#setPeriodicity}
 * @param {string} parms.interval Time interval: millisecond, second, minute, hour, day, week, or month.
 * @param {object} parms.multiple How many jumps to make on each interval loop.
 * @param {string} parms.inZone Datazone to translate from
 * @param {string} parms.outZone Datazone to translate to
 * @constructor
 * @since 04-2016-08
 * @example
    var market24=new CIQ.Market();
    var iter_parms = {
        'begin': stxx.chart.dataSet[stxx.chart.dataSet.length-1].DT,	// last item on the dataset
        'interval': stxx.layout.interval,
        'periodicity': stxx.layout.periodicity,
        'timeUnit': stxx.layout.timeUnit,
        'inZone': stxx.dataZone,
        'outZone': stxx.dataZone
    };
    var iter = market24.newIterator(iter_parms);
    var next = iter.next();
 *
 */
CIQ.Market.Iterator = function (parms) {
	this.market = parms.market;
	this.begin = parms.begin;
	this.interval = parms.interval;
	this.multiple = parms.multiple;
	this.inZone = parms.inZone;
	this.outZone = parms.outZone;
	this.clock = new CIQ.Market.Iterator._Clock(
		parms.market,
		parms.interval,
		parms.multiple
	);
	this.intraDay = this.clock.intra_day;
	if (this.intraDay)
		this.begin = this.market._convertToMarketTZ(this.begin, parms.inZone);
	this.clock._setStart(this.begin);
	this.clock.minutes_aligned = false;
};

/**
 * Returns the current date of the iterator without moving forwards or backwards.
 * Takes into account display zone settings.
 * @return {date} The current date of the iterator.
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 * @example
 * iteratorDate = iter.date();
 */
CIQ.Market.Iterator.prototype.date = function () {
	return this.clock._date();
};

/**
 * Calculate the number of ticks from begin date to end date taking into account
 * market open, close, and holidays.
 * If the end date is older than the begin date,it will work backward into the past.
 * If the end date is newer than the begin date,it will work forward into the future.
 * Note that the begin date is set when this
 * instance of the iterator is created and one should NOT call `previous` or `next`
 * before calling this function, or the 'begin' pointer will change.
 * @param {object} parms An object containing the following properties:
 * @param {date} parms.end An end date. Will be assumed to be `inZone` if one set.
 * @param {number} [parms.sample_size] Default is 25. Maximum amount of time
 * (in milliseconds) taken to count ticks. If sample size is
 * reached before the number of ticks is found the number of ticks will be
 * estimated mathematically. The bigger the sample size couple with the
 * distance between begin date and end date affect how precise the return value
 * is.
 * @param {number} [parms.sample_rate] Default is 1000. Maximum number of ticks to evaluate before checking `parms.sample_size`.
 * @return {number} The number of ticks between begin and end.
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 * @example
 * // find out how many ticks in the past a date is from the beginning of the dataSet
 * // (assumes the target date is older than the first dataSet item)
 *	var iter = this.standardMarketIterator(chart.dataSet[0].DT);
 *	var ticks=iter.futureTick({someRandomDate});
 */
CIQ.Market.Iterator.prototype.futureTick = function (parms) {
	this.clock.skip = 1;
	var ticks = 0;
	var end;
	if (this.intraDay)
		end = this.market._convertToMarketTZ(parms.end, this.inZone).getTime();
	else end = parms.end.getTime();
	var begin = this.clock.ctime;
	if (end === begin) {
		return ticks;
	}
	var sample_size = 2; //milliseconds // May not be necessary at all. Looks accurate whenever past 1,000 ticks into future
	var sample_rate = 1000; //iterations
	var sample_ctr = 0;
	if (parms.sample_size) {
		sample_size = parms.sample_size;
	}
	var start = new Date().getTime();
	var now;
	var ave;
	if (end > begin) {
		this.clock.forward = true;
		while (this.clock.ctime < end) {
			ticks += 1;
			sample_ctr += 1;
			this.clock._findNext();
			if (sample_ctr === sample_rate) {
				sample_ctr = 0;
				now = new Date().getTime();
				if (now - start >= sample_size) {
					ave = (this.clock.ctime - begin) / ticks;
					ticks = Math.floor((end - begin) / ave);
					break;
				}
			}
		}
		if (this.clock.ctime > end) {
			// if not an exact match, we are one tick too far in the future by now.
			// Go back one to return the tick that contains this time in its range. Rather than the next tick.
			ticks--;
		}
	} else {
		this.clock.forward = false;
		while (this.clock.ctime > end) {
			ticks += 1;
			sample_ctr += 1;
			this.clock._findPrevious();
			if (sample_ctr === sample_rate) {
				sample_ctr = 0;
				now = new Date().getTime();
				if (now - start >= sample_size) {
					ave = (begin - this.clock.ctime) / ticks;
					ticks = Math.floor((begin - end) / ave);
					break;
				}
			}
		}
	}
	return ticks;
};

/**
 * Checks if market is aligned and if iterator is intraday (daily intervals always align)
 * @return {boolean} true if this market is hour aligned.
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 */
CIQ.Market.Iterator.prototype.isHourAligned = function () {
	return !this.intraDay || this.market.isHourAligned();
};

/**
 * Check and see if this Market is open now.
 * @return {object} An object with the open market session's details, if the market is open right now. Or `null` if no sessions are currently open.
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 */
CIQ.Market.Iterator.prototype.isOpen = function () {
	return this.market.isOpen();
};

/**
 * Move the iterator one interval forward
 * @param {number} [skip] Default 1. Jump forward skip * periodicity at once.
 * @return {date} Next date in iterator `outZone`.
 * @alias next
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 * @example
 * now = iter.next();
 */
CIQ.Market.Iterator.prototype.next = function (skip) {
	this.clock.skip = 1;
	if (skip) {
		this.clock.skip = skip;
	}
	this.clock.forward = true;
	for (var i = 0; i < this.clock.skip; i++) this.begin = this.clock._findNext();
	if (this.intraDay || this.market.convertOnDaily) {
		return this.market._convertFromMarketTZ(
			this.clock.display_date,
			this.outZone
		);
	}
	return this.clock.display_date;
};

/**
 * Does not move the iterator. Takes into account display zone settings.
 * Note. This is a convenience function for debugging or whatever else, but
 * should not be called in the draw loop in production.
 * @return {string} The current date of the iterator as a string.
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 * @private
 */
CIQ.Market.Iterator.prototype.peek = function () {
	return this.clock._peek();
};

/**
 * Move the iterator one interval backward
 * @param {number} skip Default is one. Move this many multiples of interval.
 * @return {date} Previous date in iterator `outZone`.
 * @alias previous
 * @memberof CIQ.Market.Iterator
 * @since 04-2016-08
 * @example
 * now = iter.previous();
 */
CIQ.Market.Iterator.prototype.previous = function (skip) {
	this.clock.skip = 1;
	if (skip) {
		this.clock.skip = skip;
	}
	this.clock.forward = false;
	for (var i = 0; i < this.clock.skip; i++)
		this.begin = this.clock._findPrevious();
	if (this.intraDay || this.market.convertOnDaily) {
		return this.market._convertFromMarketTZ(
			this.clock.display_date,
			this.outZone
		);
	}
	return this.clock.display_date;
};

/**
 * Internal object that simulates a clock that ticks forward and backwards
 * at different intervals. Used internally by the iterator and not intended
 * to be used outside of the context of a Market.
 * @param {object} market An instance of market.
 * @param {string} interval millisecond, second, minute, hour, day, week or month
 * @param {number} multiple Move in multiple of intervals.
 * @private
 */
CIQ.Market.Iterator._Clock = function (market, interval, multiple) {
	// rationalize rolled up intervals for better performance
	if (multiple % 60 === 0 && interval === "second") {
		interval = "minute";
		multiple = multiple / 60;
	}

	this.market = market;
	this.interval = interval;
	this.multiple = multiple;
	this.intra_day = false;
	this.intervals = [];
	this.max_iters = 10080; //max minutes to check for rules. (one week);

	var tick_time = DAY_MILLIS,
		findNext = this._dayImpl;
	if (interval === "millisecond") {
		findNext = this._millisImpl;
		tick_time = 1;
	} else if (interval === "second") {
		findNext = this._secondImpl;
		tick_time = 1000;
	} else if (interval === "minute") {
		findNext = this._minuteImpl;
		tick_time = 60000;
	} else if (interval === "hour") {
		findNext = this._hourImpl;
		tick_time = HOUR_MILLIS;
	} else if (interval === "day") {
		findNext = this._dayImpl;
		tick_time = DAY_MILLIS;
	} else if (interval === "week") {
		findNext = this._weekImpl;
		tick_time = DAY_MILLIS * 7;
	} else if (interval === "month") {
		findNext = this._monthImpl;
		tick_time = DAY_MILLIS * 30;
	} else {
		console.log(
			'Periodicity ERROR: "' +
				interval +
				'" is not a valid interval. Please see setPeriodicity() for details.'
		);
	}
	this.tick_time = tick_time * multiple;
	this.intra_day = this.tick_time < DAY_MILLIS;
	this._findPrevious = this._findNext = findNext;
};

//Save me some carpal tunnel please.
var _ClockP = CIQ.Market.Iterator._Clock.prototype;

/**
 * Calculate the amount of minutes in a given time span.
 * This assumes hours are 24 hour format.
 *
 * NOTE! Does not know how to jump a 24 hour period, assumes that
 * oHour is always less than cHour on the same day.
 *
 * This could be done with two dates instead and remove the limitations. Not
 * sure if that is necessary at this point. We don't actually have two date
 * objects at the point that we need this number. It would take some doing to
 * figure out the date objects that would be needed.
 * @param {number} oHour The opening hour
 * @param {number} oMin The opening minute
 * @param {number} cHour The closing hour
 * @param {number} cMin The closing minute
 * @return {number} Amount of minutes in a given time span.
 * @private
 */
_ClockP._total_minutes = function (oHour, oMin, cHour, cMin) {
	//the parens are important in this case
	return (cHour - oHour) * 60 - oMin + cMin;
};

/**
 * Create an array of minutes from the open minute to the close minute at
 * some periodicity. This array will run the entire time of the last segment
 * time segment matched.
 * @return {array} Periods
 * @private
 */
_ClockP._alignMinutes = function () {
	if (!this.market.market_def || this.market.zopen_minute === undefined) {
		return [];
	}
	var o_min = this.market.zopen_minute;
	var match = this.market.zseg_match;
	if (match && match.adjacent_parent) {
		o_min = match.adjacent_parent.open / 60 - 1440;
	} else {
		if (this.market.isHourAligned() && this.multiple % 60 === 0) o_min = 0;
	}
	var total_minutes = this._total_minutes(
		this.market.zopen_hour,
		o_min,
		this.market.zclose_hour,
		this.market.zclose_minute
	);
	var periods = [];
	var next_minute = 0;
	while (next_minute < total_minutes) {
		periods.push(o_min + next_minute);
		next_minute += this.multiple;
	}
	return periods;
};

/**
 * Create an array of second boundaries. This only needs to be done once
 * per clock instance.
 * @param {number} max The high end of the range before wrapping back to zero.
 * @return {array} Periods
 * Example for seconds this would be 60.
 * @private
 */
_ClockP._alignBaseZero = function (max) {
	var base = 0;
	var periods = [base];
	while (true) {
		base += this.multiple;
		if (base >= max) {
			break;
		}
		periods.push(base);
	}
	return periods;
};

/**
 * Turn this instance of the clock into a date object at the current
 * date time.
 * @return {date} A new Date object.
 * @private
 */
_ClockP._date = function () {
	var t = Math.round(this.ctime);
	var current_date = new Date(t);

	if (this.intra_day) {
		this.display_date = new Date(t + this.shift_millis);
	} else {
		this.display_date = current_date;
	}

	return current_date;
};

/**
 * Find the boundary for minutes, seconds or milliseconds.
 * @param {array} periods A pre-calculated list of boundaries.
 * @param {number} search_for Any number to align.
 * @return {number} one of the boundaries in the array.
 * @private
 */
_ClockP._alignToBoundary = function (periods, search_for) {
	var low = 0;
	var high = 0;
	var result = search_for;

	for (var ctr = 0; ctr < periods.length - 1; ctr++) {
		low = periods[ctr];
		high = periods[ctr + 1];
		if (search_for === low || search_for === high) {
			break; //already aligned;
		}
		if (search_for > low && search_for < high) {
			result = low;
			break;
		} else if (ctr + 1 === periods.length - 1) {
			//wrap around gap
			result = high;
		}
	}
	return result;
};

/**
 * Convenience for debugging.
 * @return {string} Current market date as a string
 * @private
 */
_ClockP._peek = function () {
	return this._date().toString();
};

/**
 * When searching for open days look in hour increments.
 * Inverted.
 * @private
 */
_ClockP._seekHr = function () {
	if (this.forward) {
		this.ctime -= HOUR_MILLIS;
	} else {
		this.ctime += HOUR_MILLIS;
	}
};

/**
 * Set this instance of the iterator clock to some date. Calls to next or
 * previous will move the clock some interval from this point in time.
 * @param {date} date Any javascript date.
 * @private
 */
_ClockP._setStart = function (date) {
	var millis = this.market._tzDifferenceMillis(date);
	var shift_date = new Date(date.getTime() + millis);
	this.shift_millis = millis;
	this.ctime = shift_date.getTime();
	// override timezone shift
	this.shift_millis = 0;
	this.ctime = date.getTime();
};

/**
 * Regular clock move
 * @private
 */
_ClockP._tickTock = function () {
	if (this.forward) {
		//this.ctime += (this.tick_time * this.skip);
		this.ctime += this.tick_time;
	} else {
		//this.ctime -= (this.tick_time * this.skip);
		this.ctime -= this.tick_time;
	}
};

/**
 * Inverted clock move
 * @private
 */
_ClockP._tockTick = function () {
	if (this.forward) {
		//this.ctime -= (this.tick_time * this.skip);
		this.ctime -= this.tick_time;
	} else {
		//this.ctime += (this.tick_time * this.skip);
		this.ctime += this.tick_time;
	}
};

/**
 * Move a day at a time. Useful for finding the first open day
 * of a week or month. Always moves forward.
 * @private
 */
_ClockP._tickTock24 = function () {
	this.ctime += DAY_MILLIS;
};

/**
 * Move a day at a time inverted. Useful for finding Sunday when
 * moving by weeks. Always moves backwards.
 * @private
 */
_ClockP._tockTick24 = function () {
	this.ctime -= DAY_MILLIS;
};

/**
 * Wind the clock to the next open market time. If the market is already open
 * then don't move. Break out of the loop after max_iters regardless.
 * @param {function} was_open Intraday or daily function to see if the market
 * was open.
 * @param {function} wind _tockTick (inverted) or _tickTock (regular)
 * @return {boolean} True if the clock was moved
 * @private
 */
_ClockP._windMaybe = function (was_open, wind) {
	var max = 0;
	var working_date = new Date(this.ctime);
	var moved = false;
	while (!was_open.call(this.market, working_date)) {
		wind.call(this);
		moved = true;
		working_date = new Date(this.ctime);
		max += 1;
		if (max > this.max_iters) {
			var m = "Warning! max iterations (" + this.max_iters;
			m += ") reached with no rule match.";
			console.log(m);
			break;
		}
	}
	return moved;
};

/**
 * Move the clock some number of milliseconds
 * @return {date} Current market date
 * @private
 */
_ClockP._millisImpl = function () {
	var justAligned = false;
	if (!this.mperiods_aligned) {
		var periods = this._alignBaseZero(1000);
		var current_date = new Date(this.ctime);
		var current_millis = current_date.getMilliseconds();
		current_millis = this._alignToBoundary(periods, current_millis);
		current_date.setMilliseconds(0);
		this.ctime = current_date.getTime() + current_millis; // this allows for fractional millis
		this.mperiods_aligned = true;
		justAligned = true;
	}
	// handle market closes
	var oldMinute = this._date().getMinutes();
	this._tickTock();
	var newMinute = this._date().getMinutes();
	if (
		(justAligned || oldMinute != newMinute) &&
		!this.market._wasOpenIntraDay(this._date())
	) {
		var seconds = this._date().getSeconds();
		var millis = this._date().getMilliseconds();
		var tickTime = this.tick_time;
		this.tick_time = 60000;
		var multiple = this.multiple;
		this.multiple = 1;
		this._minuteImpl();
		this.tick_time = tickTime;
		this.multiple = multiple;
		this.ctime += 1000 * seconds + millis;
	}
	return this._date();
};

/**
 * Move the clock some number of seconds
 * @return {date} Current market date
 * @private
 */
_ClockP._secondImpl = function () {
	var justAligned = false;
	if (!this.speriod_aligned) {
		var periods = this._alignBaseZero(60);
		var current_date = new Date(this.ctime);
		var current_second = current_date.getSeconds();
		current_second = this._alignToBoundary(periods, current_second);
		current_date.setSeconds(current_second);
		current_date.setMilliseconds(0);
		this.ctime = current_date.getTime();
		this.speriod_aligned = true;
		justAligned = true;
	}
	// handle market closes
	var oldMinute = this._date().getMinutes();
	this._tickTock();
	var newMinute = this._date().getMinutes();
	if (
		(justAligned || oldMinute != newMinute) &&
		!this.market._wasOpenIntraDay(this._date())
	) {
		var seconds = this._date().getSeconds();
		var tickTime = this.tick_time;
		this.tick_time = 60000;
		var multiple = this.multiple;
		this.multiple = 1;
		this._minuteImpl();
		this.tick_time = tickTime;
		this.multiple = multiple;
		this.ctime += 1000 * seconds;
	}
	return this._date();
};

/**
 * Move the clock some number of minutes. Takes into account market start time
 * and could change alignment each time it is called.
 * @return {date}
 * @private
 */
_ClockP._minuteImpl = function () {
	var closed = this._windMaybe(this.market._wasOpenIntraDay, this._tockTick);
	var current_date = new Date(this.ctime);
	var tzOffset = current_date.getTimezoneOffset();
	var current_minute = current_date.getMinutes();
	var current_hour = current_date.getHours();
	var periods = this._alignMinutes(); //takes into account market start time
	var boundary_min =
		this._total_minutes(
			this.market.zopen_hour,
			this.market.zopen_minute,
			current_hour,
			current_minute
		) + this.market.zopen_minute;
	if (closed) {
		if (this.forward) {
			boundary_min = periods[periods.length - 1];
		} else {
			boundary_min = periods[0];
		}
	} else {
		boundary_min = this._alignToBoundary(periods, boundary_min);
	}
	current_hour = Math.floor(boundary_min / 60) + this.market.zopen_hour;
	current_date.setHours(current_hour, boundary_min % 60, 0, 0);
	var offsetDiff = current_date.getTimezoneOffset() - tzOffset;
	if ((this.forward && offsetDiff < 0) || (!this.forward && offsetDiff > 0)) {
		//crossed a fallback timezone boundary
		current_date.setTime(current_date.getTime() - offsetDiff * 60000);
	}
	this.ctime = current_date.getTime(); //boundary aligned
	this._tickTock(); //move once

	var alignToHour = this.market.hour_aligned && this.multiple % 60 === 0;

	// Calling `_windMaybe()` will eventually cause `_was_open()` to get called, which may set
	// `this.shouldResetToBeginningOfSegment` to `true` if the clock has rolled over into a new
	// market session
	if (
		this._windMaybe(this.market._wasOpenIntraDay, this._tickTock) ||
		(!alignToHour && this.shouldResetToBeginningOfSegment)
	) {
		current_date = new Date(this.ctime);
		if (this.forward) {
			current_date.setMinutes(this.market.zopen_minute);
			current_date.setHours(this.market.zopen_hour);
		} else {
			periods = this._alignMinutes();
			var last_boundary = periods[periods.length - 1];
			current_date.setMinutes(last_boundary % 60);
			current_date.setHours(
				Math.floor(last_boundary / 60) + this.market.zopen_hour
			);
		}
		this.ctime = current_date.getTime();
	}
	return this._date();
};

/**
 * Move the clock some number of hours.
 * @return {date}
 * @private
 */
_ClockP._hourImpl = function () {
	this._windMaybe(this.market._wasOpenIntraDay, this._tockTick);
	var current_time = new Date(this.ctime);
	if (this.market.isHourAligned()) {
		current_time.setMinutes(0);
	} else {
		current_time.setMinutes(this.market.zopen_minute);
	}
	current_time.setSeconds(0);
	current_time.setMilliseconds(0);
	this.ctime = current_time.getTime(); //boundary aligned
	this._tickTock(); //move once
	var current_segment = this.market.zseg_match;
	if (
		this._windMaybe(this.market._wasOpenIntraDay, this._tickTock) ||
		(!this.market.hour_aligned && current_segment != this.market.zseg_match)
	) {
		var current_date = new Date(this.ctime);
		if (this.forward) {
			current_date.setMinutes(this.market.zopen_minute);
			current_date.setHours(this.market.zopen_hour);
		} else {
			var periods = this._alignMinutes();
			var last_boundary = periods[periods.length - 1];
			current_date.setMinutes(last_boundary % 60);
			current_date.setHours(
				Math.floor(last_boundary / 60) + this.market.zopen_hour
			);
		}
		this.ctime = current_date.getTime();
	}
	return this._date();
};

/**
 * Move the clock some number of days.
 * @return {date}
 * @private
 */
_ClockP._dayImpl = function () {
	this._windMaybe(this.market._wasOpenDaily, this._seekHr);
	var current_date = new Date(this.ctime); //closest open day
	current_date.setHours(12, 0, 0, 0);
	this.ctime = current_date.getTime(); //boundary aligned
	var ctr = 0;
	while (ctr < this.multiple) {
		if (this.forward) {
			this._tickTock24();
		} else {
			this._tockTick24();
		}
		if (!this.market._wasOpenDaily(this._date())) {
			continue;
		}
		ctr += 1;
	}
	current_date = new Date(this.ctime);
	current_date.setHours(0);
	this.ctime = current_date.getTime(); //boundary aligned
	return this._date();
};

/**
 * Move the clock some number of weeks.
 * @return {date}
 * @private
 */
_ClockP._weekImpl = function () {
	var current_date = new Date(this.ctime);
	current_date.setHours(12); // Stay away from DST danger zone, so we know we only go back one date each tocktick
	this.ctime = current_date.getTime();
	this._tickTock(); // move once

	//Move to Sunday
	current_date = new Date(this.ctime);
	while (current_date.getDay() !== 0) {
		this._tockTick24();
		current_date = new Date(this.ctime);
	}

	//now align to first open day of week.
	this._windMaybe(this.market._wasOpenDaily, this._tickTock24);
	current_date = new Date(this.ctime);
	current_date.setHours(0, 0, 0, 0);
	this.ctime = current_date.getTime(); //boundary aligned;
	return this._date();
};

/**
 * Move the clock some number of months
 * @return {date}
 * @private
 */
_ClockP._monthImpl = function () {
	//Allow some room to account for different lengths of months.
	var current_date = new Date(this.ctime);
	current_date.setDate(15); // Stay away from month boundaries so DST doesn't foil us
	this.ctime = current_date.getTime();

	this._tickTock(); // move once
	current_date = new Date(this.ctime);
	//Now re align back to the first day of the month
	current_date.setDate(1);
	current_date.setHours(12); // Stay away from DST danger zone
	this.ctime = current_date.getTime();

	//Now find the first open day of month
	this._windMaybe(this.market._wasOpenDaily, this._tickTock24);
	current_date = new Date(this.ctime);
	current_date.setHours(0, 0, 0, 0);
	this.ctime = current_date.getTime(); //boundary aligned;
	return this._date();
};

/**
 * Search forward for the next market open
 * @param {date} date Some begin date.
 * @param {number} skip The number of intervals to move. Defaults
 * to one.
 * @return {date} A new date that has been set to the previous open of the
 * market.
 * @private
 */
_ClockP._findNext = null;

/**
 * Search backward for the next market open
 * @param {date} date Some begin date.
 * @param {number} skip The number of intervals to move. Defaults
 * to one.
 * @return {date} A new date that has been set to the previous open of the
 * market.
 * @private
 */
_ClockP._findPrevious = null;

};

let __js_standard_nameValueStore_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Base class for interacting with a name value store.
 * This base class saves to local storage but you can override your own for remote storage,
 * as long as you maintain the same function signatures and call back requirements.
 *
 * See {@link WebComponents.cq-views} for implementation example.
 *
 * @constructor
 * @name  CIQ.NameValueStore
 */
CIQ.NameValueStore = CIQ.NameValueStore || function () {};

CIQ.NameValueStore.prototype.toJSONIfNecessary = function (obj) {
	if (obj.constructor == String) return obj;
	try {
		var s = JSON.stringify(obj);
		return s;
	} catch (e) {
		console.log("Cannot convert to JSON: " + obj);
		return null;
	}
};

CIQ.NameValueStore.prototype.fromJSONIfNecessary = function (obj) {
	try {
		var s = JSON.parse(obj);
		return s;
	} catch (e) {
		return obj;
	}
};

/**
 * Get a value from the name value store
 * @param  {string}   field The field to fetch
 * @param  {Function} cb    Callback. First field is error or null. Second field is the result.
 * @memberof CIQ.NameValueStore
 * @example
 * nameValueStore.get("myfield", function(err,data){
 *    if(!err){
 *        // do something with data
 *        if(cb) cb(errorCode, yourViewObject);
 *    }
 * });
 */
CIQ.NameValueStore.prototype.get = function (field, cb) {
	var value = CIQ.localStorage.getItem(field);
	if (cb) cb(null, this.fromJSONIfNecessary(value));
};

/**
 * Set a value to the name value store
 * @param  {string}   field The field to fetch
 * @param  {string}   value The value to store
 * @param  {Function} cb    Callback
 * @memberof CIQ.NameValueStore
 * @example
 * nameValueStore.set("myfield", "myValue", function(){
 *        // do something after data has been saved
 *        if(cb) cb(errorCode);
 *    }
 * });
 */
CIQ.NameValueStore.prototype.set = function (field, value, cb) {
	CIQ.localStorageSetItem(field, this.toJSONIfNecessary(value));
	if (cb) cb(null);
};

/**
 * Remove a field from the name value store
 * @param  {string}   field The field to remove
 * @param  {Function} cb    Callback
 * @memberof CIQ.NameValueStore
 * @example
 * nameValueStore.remove("myfield", function(){
 *        // do something after data has been removed
 *        if(cb) cb(errorCode);
 *    }
 * });
 */
CIQ.NameValueStore.prototype.remove = function (field, cb) {
	CIQ.localStorage.removeItem(field);
	if (cb) cb(null);
};

};

let __js_standard_quoteFeed_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.ChartEngine) CIQ.ChartEngine = function () {};

/**
 * See tutorial [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds} for a complete overview and
 * step by step source code for implementing a quotefeed
 *
 * Interface for classes that implement a quotefeed. You define a quotefeed object and attach it to
 * the chart using {@link CIQ.ChartEngine#attachQuoteFeed}. Each member "fetch..." method is optional. The chart
 * will call your member method if it exists, and will skip if it does not.
 *
 * Also see {@link CIQ.ChartEngine#dontRoll} if your feed aggregates weekly and monthly bars and you do not wish the chart to roll them from daily bars.
 *
 * @name quotefeed
 * @namespace
 * @property {number} maxTicks The maximum number of ticks a quoteFeed should request at a single time. This value will be overridden if the {@link CIQ.ChartEngine.Driver} has a behavior.maximumTicks set.
 */
function quotefeed() {}

/**
 * All of your quote feed "fetch..." methods **must** call this callback function to return
 * results to the chart, even if no data is returned from your feed.
 *
 * @param {object} response Contains the results of the quote feed function that called this
 * 		callback function.
 * @param {string} [response.error] An error message, if one occurred.
 * @param {string} [response.suppressAlert] Set this to true to not display errors.
 * @param {array} [response.quotes] An array of quotes in required JSON format, if no error
 * 		occurred.
 * @param {boolean} [response.moreAvailable] Set this to false to stop pagination requests if
 * 		you know that no older data is available.
 * @param {boolean} [response.upToDate] Set this to true to stop forward pagination requests
 * 		if you know that no newer data is available.
 * @param {object} [response.attribution] This object is assigned to `stx.chart.attribution`.
 * 		Your UI can use this to display attribution messages. See example below.
 *
 * @callback quotefeed~dataCallback
 *
 * @example <caption>Returning quotes in the <code>dataCallback</code> object.</caption>
 * cb({quotes:[--array of quote elements here--]});
 *
 * @example <caption>Returning an error in the <code>dataCallback</code> object.</caption>
 * cb({error:"Your error message here"});
 *
 * @example <caption>Setting <code>attribution</code> through the <code>dataCallback</code>
 * object.</caption>
 *
 * // Set up a callback function to be called whenever fetchInitialData is called.
 *  stxx.attachQuoteFeed(yourQuoteFeed, {callback: showAttribution});
 *
 * // After every data call, the attribution function is called,
 * // and you can then use it to display any message regarding the quote feed.
 *	function showAttribution(params){
 *		var message=params.stx.chart.attribution.message;
 *		// Add your code here to display the message on your screen.
 *	}
 *
 * // In your quote feed's fetchInitialData method, set the attribution object.
 * cb({quotes:[--array of quote elements here--], attribution:{message:"Data is delayed by 15 minutes"}});
 *
 * @since 8.0.0 Added the `response.upToDate` property.
 */

/**
 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
 *
 * The charting engine calls this quotefeed function whenever the chart is wiped clean and created again with new data.
 * This typically occurs when {@link CIQ.ChartEngine#loadChart} is called but can also occur from other methods such as {@link CIQ.ChartEngine#setPeriodicity}
 * or {@link CIQ.ChartEngine#importLayout}.
 *
 * @param {string} symbol The ticker symbol of the data being fetched
 * @param {Date} suggestedStartDate A suggested starting date for the fetched data (based on how much can be displayed)
 * @param {Date} suggestedEndDate A suggested starting date for the fetched data (based on how much can be displayed)
 * @param {object} params						-Provides additional information on the data requested by the chart.
 * @param {Boolean}	params.series 				-If true then the request is for series/comparison data (i.e. not the the main symbol)
 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
 * @param {string} [params.symbolObject] 		-The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
 * @param {Boolean} [params.fetchMaximumBars]	-If set to true, the chart requires as much historical data as is available from the feed (params.ticks may also be set to 20,000 to set a safety max), regardless of start date. This is needed for some chart types since they aggregate data (kagi,renko, or linebreak, for example). Developers implementing fetch, should override params.tick and use a smaller number if their feed can't support that much data being sent back. The engine will then make multiple smaller calls to get enough data to fill the screen.
 * @param {number} params.ticks 				-The suggested number of data points to return. This is calculated as twice the number of bars displayed on the chart. This can be used as an alternative to suggestedStartDate.
 * @param {number} [params.timeout=10000]		-This may be used to set the timeout in msec of the remote server request.
 * @param  {quotefeed~dataCallback} cb			-Call this function with the results (or error) of your data request.
 * @since 4.1.2 Added `timeout` parameter.
 * @memberOf quotefeed
 */
quotefeed.fetchInitialData = function (
	symbol,
	suggestedStartDate,
	suggestedEndDate,
	params,
	cb
) {};

/**
 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
 *
 * The charting engine calls this quotefeed function periodically (poll) to request updated data.
 * The polling frequency is determined by the `refreshInterval` that you provided when you called {@link CIQ.ChartEngine#attachQuoteFeed}.
 *
 * @param {string} symbol The ticker symbol of the data being fetched
 * @param {Date} startDate The starting date for the fetched data (based on how much can be displayed)
 * @param {object} params						-Provides additional information on the data requested by the chart.
 * @param {Boolean}	params.series 				-If true then the request is for series/comparison data (i.e. not the main symbol)
 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
 * @param {string} [params.symbolObject] 		-The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
 * @param {number} [params.timeout=10000]		-This may be used to set the timeout in msec of the remote server request.
 * @param  {quotefeed~dataCallback} cb			-Call this function with the results (or error) of your data request.
 * @since 4.1.2 Added `timeout` parameter.
 * @memberOf quotefeed
 */
quotefeed.fetchUpdateData = function (symbol, startDate, params, cb) {};

/**
 * See [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds}
 *
 * The charting engine calls this quotefeed function whenever the chart requires older data.
 * Usually this is because a user has scrolled or zoomed past the end of the data.
 * *Note: This method may be called during initial load if your fetchInitialData didn't provide enough data to fill the visible chart.*
 *
 * @param {string} symbol The ticker symbol of the data being fetched
 * @param {Date} suggestedStartDate A suggested starting data for the fetched data (based on how much can be displayed)
 * @param {Date} endDate The date of the last data point currently available in the chart. You should return data from this point and then backward in time.
 * @param {object} params						-Provides additional information on the data requested by the chart.
 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
 * @param {string} [params.symbolObject] 		-The symbol to fetch in object format; if a symbolObject is initialized ( see {@link CIQ.ChartEngine#loadChart}, {@link CIQ.ChartEngine#addSeries}, {@link CIQ.Comparison.add} )
 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
 * @param {Boolean} [params.fetchMaximumBars]	-If set to true, the chart requires as much historical data as is available from the feed (params.ticks may also be set to 20,000 to set a safety max), regardless of start date. This is needed for some chart types since they aggregate data (kagi,renko, or linebreak, for example). Developers implementing fetch, should override params.tick and use a smaller number if their feed can't support that much data being sent back. The engine will then make multiple smaller calls to get enough data to fill the screen.
 * @param {number} params.ticks 				-The suggested number of data points to return. This is calculated as twice the number of bars displayed on the chart. This can be used as an alternative to suggestedStartDate.
 * @param {number} [params.timeout=10000]		-This may be used to set the timeout in msec of the remote server request.
 * @param {Boolean} [params.future]             -If set to true, the chart is scrolling in a 'forward' direction
 * @param  {quotefeed~dataCallback} cb			-Call this function with the results (or error) of your data request.
 * @since
 * - 4.1.2 Added `params.timeout`.
 * - 6.0.0 Added `params.future`.
 * @memberOf quotefeed
 */
quotefeed.fetchPaginationData = function (
	symbol,
	suggestedStartDate,
	endDate,
	params,
	cb
) {};

/**
 * See [Data Integration : Advanced]{@tutorial DataIntegrationAdvanced}
 *
 * Although not a core quotefeed function, the charting engine calls this optional function each time the chart encounters a new symbol or a particular periodicity for that symbol.
 * This could happen when a user changes periodcity, changes a symbol, adds a comparison symbol, or a new study is added that requires an underlying symbol.
 *
 * Use this along with unsubscribe() to keep track of symbols on the chart.
 * Use cases include: maintaining legends, lists of securities, or adding/removing subscriptions to streaming connections.
 *
 * If using a push stream, subscribe and then have the push streamer push updates using {@link CIQ.ChartEngine#updateChartData}.
 *
 * @param {object} params						-Provides additional information on the data requested by the chart.
 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
 * @param {string} params.symbol 				-The symbol being added
 * @param {string} params.symbolObject 			-The symbol being added in object form
 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
 * @memberOf quotefeed
 * @since 4.0.0 Changes to periodicity (period/interval) will now also cause subscribe calls.
 */
quotefeed.subscribe = function (params) {};

/**
 * See [Data Integration : Advanced]{@tutorial DataIntegrationAdvanced}
 *
 * Although not a core quotefeed function, the charting engine calls this optional function each time the chart no longer requires a symbol or a particular periodicity for that symbol.
 *
 * @param {object} params						-Provides additional information on the data requested by the chart.
 * @param {CIQ.ChartEngine} params.stx 			-The chart object requesting data
 * @param {string} params.symbol				-The symbol being removed
 * @param {string} params.symbolObject 			-The symbol being removed in object form
 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link CIQ.ChartEngine#setPeriodicity}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link CIQ.ChartEngine#setRange} or {@link CIQ.ChartEngine#setSpan})
 * @memberOf quotefeed
 * @since 4.0.0 Changes to periodicity (period/interval) will now also cause unsubscribe calls.
 */
quotefeed.unsubscribe = function (params) {};

/**
 * See tutorial [Data Integration : Quotefeeds]{@tutorial DataIntegrationQuoteFeeds} for a complete overview and
 * step by step source code for implementing a quotefeed
 *
 * @namespace
 * @name CIQ.QuoteFeed
 * @deprecated
 * @private
 */
CIQ.QuoteFeed = CIQ.QuoteFeed || function () {};

/**
 * @private
 * @param {object} params
 * @param {function} cb Callback
 * @deprecated
 */
CIQ.QuoteFeed.prototype.fetch = function (params, cb) {
	if (!this.v2QuoteFeed) {
		console.log(
			"You must implement CIQ.QuoteFeed.[yourfeedname].prototype.fetch()"
		);
	}
};

/**
 * Whenever an error occurs the params and dataCallback from fetch will be automatically passed to this method by the quote engine.
 *
 * Use this to alert the user if desired.
 *
 * Override this with your own alerting mechanisms.
 * @param  {object} params The params originally passed into the fetch call.
 * @param {object} dataCallback The data returned to fetch
 * @memberOf quotefeed
 * @alias announceError
 * @example
 * 	quotefeed.announceError=function(params, dataCallback){
 *		if(params.startDate){
 *			// Perhaps some sort of "disconnected" message on screen
 *		}else if(params.endDate){
 *			// Perhaps something indicating the end of the chart
 *		}else{
 *			CIQ.alert("Error fetching quote:" + dataCallback.error);	// Probably a not found error?
 *		}
 *	};
 */
CIQ.QuoteFeed.prototype.announceError = function (params, dataCallback) {
	if (params.suppressErrors || dataCallback.suppressAlert) return;
	if (params.startDate) {
		// Perhaps some sort of "disconnected" message on screen
	} else if (params.endDate) {
		// Perhaps something indicating the end of the chart
	} else if (dataCallback.error) {
		CIQ.alert("Error fetching quote:" + dataCallback.error);
	} else {
		//CIQ.alert("Error fetching quote:" + params.symbol);	// Probably a not found error?
	}
};

/**
 * Fetches multiple quotes asynchronously, possibly from various data sources. This method is used to update a chart with multiple symbols
 * such as a comparison chart.
 *
 * @param {array} arr Array of stock symbols.
 * @param {Function} cb Function to callback when quotes are fetched. Passed an array of results. Each result is an object `{dataCallback, params}`.
 * @memberOf CIQ.QuoteFeed
 * @since 7.3.0 Deprecated
 * @deprecated Use `CIQ.ChartEngine.Driver.prototype.multifetch`.
 * @private
 */
CIQ.QuoteFeed.prototype.multiFetch = function (arr, cb) {
	if (arr.length === 0) cb([]);

	return arr[0].stx.driver.multiFetch(arr, cb);
};

/**
 * QuoteFeed for managing streaming data
 * @constructor
 * @private
 */
CIQ.QuoteFeed.Subscriptions = function () {
	this.subscriptions = [];
};

CIQ.inheritsFrom(CIQ.QuoteFeed.Subscriptions, CIQ.QuoteFeed);

/**
 * Used by the QuoteFeed Driver to create subscribe and unsubscribe calls as needed.
 *
 * @param {CIQ.ChartEngine} stx engine instance
 * @since 4.0.0 Changes to periodicity (period/interval) will cause subscribe/unsubscribe calls.
 * @private
 */
CIQ.QuoteFeed.Subscriptions.prototype.checkSubscriptions = function (stx) {
	var sub, need;
	var chartNeeds = stx.getSymbols({ "breakout-equations": true });
	var self = this;
	chartNeeds = chartNeeds.filter(function (sub) {
		var qf = stx.quoteDriver.getQuoteFeed(sub);
		return qf && qf.engine == self;
	});

	// reset subscription match status
	for (var s = 0; s < this.subscriptions.length; s++) {
		this.subscriptions[s].match = false;
	}

	for (var i = 0; i < chartNeeds.length; i++) {
		// Convert kernel periodicity/interval/timeUnit to feed format
		need = chartNeeds[i];
		var interval = need.interval;
		// If we're rolling our own months or weeks then we should ask for days from the quote feed
		if ((interval == "month" || interval == "week") && !stx.dontRoll) {
			interval = "day";
		}

		need.interval = interval;
		need.period = 1;
		need.match = false;

		if (!isNaN(need.interval)) {
			// normalize numeric intervals into "minute" form
			need.period = need.interval;
			need.interval = need.timeUnit;
			if (!need.interval) need.interval = "minute";
		}
		delete need.periodicity; // to avoid confusion
		delete need.timeUnit; // to avoid confusion
		delete need.setSpan; // to avoid confusion

		for (s = 0; s < this.subscriptions.length; s++) {
			sub = this.subscriptions[s];
			if (
				sub.symbol == need.symbol &&
				sub.period == need.period &&
				sub.interval == need.interval
			) {
				need.match = true;
				sub.match = true;
				break;
			} else if (sub.symbol != need.symbol) {
				if (need.reason != "period") need.reason = "symbol";
				sub.reason = "symbol";
			} else {
				need.reason = "period";
				sub.reason = "period";
			}
		}
	}
	//console.log(this.subscriptions);
	//console.log(chartNeeds);

	// unsubscribe to any symbols no longer matched, and remove them from subscriptions
	this.subscriptions = this.subscriptions.filter(function (c) {
		if (!c.match) {
			if (!c.stx) c.stx = stx;
			self.unsubscribe(c);
		}
		return c.match;
	});

	chartNeeds.forEach(function (c) {
		if (!c.match) {
			if (!c.stx) c.stx = stx;
			if (!c.reason) c.reason = "initialize";
			if (c.symbol !== stx.chart.symbol) c.series = true;
			self.subscribe(c);
			self.subscriptions.push(c);
		}
	});
};

/**
 * Calls fetchFromSource and checks for subscription updates when successful.
 *
 * @param {Object} params
 * @param {Function} cb
 * @private
 */
CIQ.QuoteFeed.Subscriptions.prototype.fetch = function (params, cb) {
	var self = this;
	this.fetchFromSource(params, function (results) {
		if (!results.error) {
			self.checkSubscriptions(params.stx);
		}
		cb(results);
	});
};

/**
 * Implement this method. Start your streaming here.
 *
 * @param {Object} params
 * @private
 */
CIQ.QuoteFeed.Subscriptions.prototype.subscribe = function (params) {
	console.log("subscribe", params);
};

/**
 * Implement this method. End your streaming here.
 *
 * @param {Object} params
 * @private
 */
CIQ.QuoteFeed.Subscriptions.prototype.unsubscribe = function (params) {
	console.log("unsubscribe", params);
};

/**
 * The charting engine will call this method whenever it needs data from your feed.
 * Override this with your implementation to fetch data from your server.
 * Uses same parameters and format as CIQ.QuoteFeed.fetch.
 * @param {object} params
 * @param {function} cb Callback
 * @memberOf CIQ.QuoteFeed.Subscriptions
 * @private
 * @deprecated
 */
CIQ.QuoteFeed.Subscriptions.prototype.fetchFromSource = function (params, cb) {
	console.log("Please provide implementation of fetchFromSource");
};

/**
 * Return true if your quote feed should make an immediate refresh after initial load. For instance if your
 * initial load is EOD and then you need to immediately load a real-time bar
 * @param  {object} params The same parameters that are passed to fetch()
 * @return {boolean}       Return true if a refresh is required immediately
 * @memberOf CIQ.QuoteFeed
 * @private
 */
CIQ.QuoteFeed.prototype.requiresImmediateRefresh = function (params) {
	return false;
};

/**
 * Attaches a quote feed to the charting engine by creating an internal 'driver', which causes the chart to pull data from the quote feed as needed.
 *
 * Multiple quote feeds may be attached to the engine. To accomplish this, use the `filter` argument to specify the type of request
 * for which to use the quote feed. If a filter is not specified, that quote feed becomes the default quote feed, to be used
 * if all other quote feed filters do not match the criteria. If this function is called without a `filter` argument twice,
 * the second call removes all existing quote feeds before adding the new quote feed.
 *
 * **Note:** You must attach the quote feeds in priority order. The quote feeds are examined in the order in which they are
 * added to determine if the quote feed is the correct one for the security. The first match is used. A quote feed that is
 * attached without a filter is examined last.
 *
 * @param {object} [quoteFeed] Your quote feed object.
 * @param {object} [behavior] Optional behavior object to initialize the quote feed.
 * @param {number} [behavior.suppressErrors] If true, then no error is displayed when the quote feed returns one. Instead,
 * 					the new symbol is simply not loaded and the prior symbol remains on the screen.
 * @param {number} [behavior.refreshInterval] If not null, then sets the frequency for fetching updates (if null or zero
 * 					then `fetchUpdateData` is not called).
 * @param {number} [behavior.forwardPaginationRetryInterval] Defaults to five seconds when set to null.
 * 					In [historical mode]{@tutorial DataIntegrationQuoteFeeds}, determines how often (in seconds) a forward
 * 					pagination attempt can be tried. Forward pagination is different than a fetch update, in that it tries
 * 					to get enough data just to fill the gap in the visible portion of the chart, rather than to request an
 * 					update from the visible area to the current candle, which depending on the visible range, could be days
 * 					or months away.
 * @param {number} [behavior.bufferSize] Set to the minimum number of undisplayed historical ticks always buffered in
 * 					`masterData`. Useful to prevent temporary gaps on studies while paginating. This forces pagination fetch
 * 					requests to be triggered ahead of reaching the edge of the chart, if the number of already loaded bars is
 * 					less than the required buffer size. This parameter can be reset at any time by manipulating
 * 					`stxx.quoteDriver.behavior.bufferSize`; it will then become active on the very next loading check. It is
 * 					used on both left and right side pagination requests.
 * @param {function} [behavior.callback] Optional callback after any fetch to enhance functionality. It will be called with
 * 					the params object used with the fetch call.
 * @param {number} [behavior.noLoadMore] If true, then the chart will not attempt to load any more data after the initial load.
 * @param {number} [behavior.findHeadOfData] If true, then the chart will attempt to load more data (and find the most recent)
 * 					if the initial load returned no data.
 * @param {boolean} [behavior.loadMoreReplace] If true, then when paginating, the driver will replace `masterData` instead of
 * 					prepending. Set this if your feed can only provide a full data set of varying historical lengths.
 * @param {string} [behavior.adjustmentMethod] Set to override the quote feed's default dividend/split adjustment method.
 * 					The value will depend on the particular quotefeed implementation.
 * @param {number} [behavior.maximumTicks=20000] Limiter on maximum number of ticks to request from a quote feed. Setting a
 * 					value in the quote driver's behavior will override an individual quote feed's `maxTicks` value.
 * @param {boolean} [behavior.ignoreUpdateError] Optionally used within the specific quote feed to indicate that an update
 * 					that fails should be treated as no data found rather than an error.
 * @param {function} [filter] Filters the quote feed supplied to the `quoteFeed` parameter. The filter function takes as an
 * 					argument an object typically containing `symbolObject`, `symbol`, and `interval` properties. The properties
 * 					associate the quote feed with an instrument. If the `filter` function returns true, the quote feed is used
 * 					for the instrument.
 * @memberOf CIQ.ChartEngine
 *
 * @example <caption>Attach a quote feed and have the driver call <code>fetchUpdateData</code> once per second.</caption>
 * stxx.attachQuoteFeed(
 *     yourQuotefeed,
 *     {refreshInterval:1, bufferSize:200},
 *     function(params){
 *         return CIQ.Market.Symbology.factory(params.symbolObject) == CIQ.Market.FOREX &&
 *                params.symbol == "^USDCAD" &&
 *                params.interval == "day";
 *     }
 * );
 * @since
 * - 2016-12-01
 * - 5.0.0 Added `behavior.bufferSize`.
 * - 5.1.1 Added `behavior.maximumTicks`.
 * - 6.0.0 Added `behavior.forwardPaginationRetryInterval`.
 * - 6.2.3 Added `behavior.ignoreUpdateError`.
 * - 7.2.0 Added `behavior.findHeadOfData` parameter.
 * - 7.3.0 Added `filter` parameter.
 */
CIQ.ChartEngine.prototype.attachQuoteFeed = function (
	quoteFeed,
	behavior,
	filter
) {
	if (!behavior) behavior = {};

	// Legacy QuoteFeeds
	if (
		typeof quoteFeed.fetchInitialData === "function" ||
		typeof quoteFeed.fetchUpdateData === "function" ||
		typeof quoteFeed.fetchPaginationData === "function"
	) {
		// New "duck typed" v2 quotefeed
		if (
			typeof quoteFeed.fetchPaginationData !== "function" &&
			typeof quoteFeed.fetchUpdateData !== "function"
		) {
			behavior.noLoadMore = true;
		}
		quoteFeed.v2QuoteFeed = true; // store flag in quotefeed to single new version of quotefeed
		["multiFetch", "announceError", "requiresImmediateRefresh"].forEach(
			function (prop) {
				if (!quoteFeed[prop] && quoteFeed[prop] !== false)
					quoteFeed[prop] = CIQ.QuoteFeed.prototype[prop]; // no inheritance so add function
			}
		);
		if (typeof quoteFeed.subscribe === "function") {
			// if subscription quotefeed
			quoteFeed.checkSubscriptions =
				CIQ.QuoteFeed.Subscriptions.prototype.checkSubscriptions; // no inheritance so add checkSubscriptions function
			quoteFeed.subscriptions = [];
		}
	}
	if (!behavior.maximumTicks)
		behavior.maximumTicks = quoteFeed.maxTicks ? quoteFeed.maxTicks : 20000; // Historically this is the safest limit of ticks to fetch for response time
	if (!behavior.bufferSize || behavior.bufferSize < 0) behavior.bufferSize = 0;
	behavior.bufferSize = Math.round(behavior.bufferSize);
	behavior.intervalTimer = null; // This is the setInterval which can be cleared to stop the updating loop

	if (this.quoteDriver) {
		// adding a second unfiltered quotefeed, must be trying to replace the quotefeeds, delete quoteDriver
		if (!filter && this.quoteDriver.hasUnfilteredQuoteFeed)
			this.detachQuoteFeed();
		else {
			// make sure unfiltered feed remains last!
			var unfilteredFeed =
				this.quoteDriver.hasUnfilteredQuoteFeed &&
				this.quoteDriver.quoteFeeds.pop();
			this.quoteDriver.quoteFeeds.push({
				engine: quoteFeed,
				behavior: behavior,
				filter: filter
			});
			if (unfilteredFeed) this.quoteDriver.quoteFeeds.push(unfilteredFeed);
			this.quoteDriver.updateChartLoop(null, behavior);
		}
	}
	if (!this.quoteDriver) {
		// do not turn into an else clause, the detachQuoteFeed() above will remove the quoteDriver
		this.quoteDriver = new CIQ.ChartEngine.Driver(
			this,
			quoteFeed,
			behavior,
			filter
		);
	}
	if (!filter) this.quoteDriver.hasUnfilteredQuoteFeed = true;
};

/**
 * Detaches a quote feed. On removal of the last quote feed, calls `quoteDriver.die()`.
 *
 * @param {object} [quoteFeed] Optional quote feed object to detach. Omit to detach all quote feeds.
 * @memberOf CIQ.ChartEngine
 * @since 7.3.0
 */
CIQ.ChartEngine.prototype.detachQuoteFeed = function (quoteFeed) {
	var qd = this.quoteDriver;
	if (!qd) return;
	for (var i = qd.quoteFeeds.length - 1; i >= 0; i--) {
		if (!quoteFeed || qd.quoteFeeds[i].quoteFeed == quoteFeed) {
			qd.die(qd.quoteFeeds[i]);
			qd.quoteFeeds.splice(i, 1);
		}
	}
	if (!qd.quoteFeeds.length) {
		qd = this.quoteDriver = null;
	} else if (quoteFeed == qd.quoteFeed) {
		qd.quoteFeed = qd.quoteFeeds[0].quoteFeed;
		qd.behavior = qd.quoteFeeds[0].behavior;
	}
};

/**
 * Drives the chart's relationship with the quote feed object provided to the chart.
 *
 * @param {CIQ.ChartEngine} stx A chart engine instance.
 * @param {object} quoteFeed A quote feed object.
 * @param {object} [behavior] See {@link CIQ.ChartEngine#attachQuoteFeed} for object details.
 * @property {boolean} [behavior.loadingNewChart=false] READ ONLY boolean telling when a chart is loading
 * @property {boolean} [behavior.updatingChart=false] READ ONLY boolean telling when a chart is updating
 * @param {function} [filter] See {@link CIQ.ChartEngine#attachQuoteFeed} for function details.
 * @constructor
 * @name CIQ.ChartEngine.Driver
 * @private
 * @since
 * - 5.1.1 Added `maximumTicks` to `behavior` parameter.
 * - 7.3.0 Moved `intervalTimer` property into `behavior` parameter. Added `filter` parameter.
 */
CIQ.ChartEngine.Driver = function (stx, quoteFeed, behavior, filter) {
	this.stx = stx;
	if (!behavior) behavior = {};
	this.quoteFeeds = [{ engine: quoteFeed, behavior: behavior, filter: filter }];
	this.id = CIQ.uniqueID(true);
	this.behavior = behavior; // legacy
	this.quoteFeed = quoteFeed; // legacy
	this.loadingNewChart = false; // This gets set to true when loading a new chart in order to prevent refreshes while waiting for data back from the server
	this.updatingChart = false; // This gets set when the chart is being refreshed
	if (!filter) this.hasUnfilteredQuoteFeed = true;
	this.updateChartLoop();
};

CIQ.ChartEngine.Driver.prototype.die = function (quoteFeed) {
	for (var qf = 0; qf < this.quoteFeeds.length; qf++) {
		if (!quoteFeed || this.quoteFeeds[qf] == quoteFeed) {
			var behavior = this.quoteFeeds[qf].behavior;
			if (behavior.intervalTimer) {
				clearInterval(behavior.intervalTimer);
				behavior.intervalTimer = -1; // this means it was stopped by the die function and should not be started again in the event of an async call back from the fetch coming back after it was killed.
			}
		}
	}
};

/**
 * Finds the quote feed entry to use for a given security. Returns null if no match.
 * The quote feed entry consists of an engine, a behavior, and a filter.
 *
 * @param {object} params Params to use to find the quote feed.
 * @return {object} Matched quote feed, or null if no match found.
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since 7.3.0
 */
CIQ.ChartEngine.Driver.prototype.getQuoteFeed = function (params) {
	if (!params.symbolObject) params.symbolObject = { symbol: params.symbol };
	for (var qf = 0; qf < this.quoteFeeds.length; qf++) {
		var quoteFeed = this.quoteFeeds[qf];
		if (quoteFeed.behavior.generator != params.symbolObject.generator) continue;
		if (!quoteFeed.filter || quoteFeed.filter(params)) return quoteFeed;
	}
	return null; //no match
};

/**
 * Fetches multiple quotes asynchronously, possibly from various data sources. This method is used to update a chart with multiple symbols
 * such as a comparison chart.
 *
 * @param {array} arr Array of stock symbols.
 * @param {Function} cb Function to call back when quotes are fetched. Passed an array of results. Each result is an object `{dataCallback, params}`.
 * @memberOf CIQ.ChartEngine.Driver
 * @since 7.3.0
 * @private
 */
CIQ.ChartEngine.Driver.prototype.multiFetch = function (arr, cb) {
	if (arr.length === 0) cb([]);

	var tracker = {
		counter: 0,
		finished: arr.length,
		results: []
	};

	function handleResponse(params, tracker, cb) {
		return function (dataCallback) {
			tracker.results.push({ dataCallback: dataCallback, params: params });
			tracker.counter++;
			if (tracker.counter >= tracker.finished) {
				var results = tracker.results;
				tracker.results = [];
				cb(results);
			}
		};
	}
	for (var i = 0; i < arr.length; i++) {
		var params = arr[i];
		if (params.stx.isEquationChart(params.symbol)) {
			//equation chart
			CIQ.fetchEquationChart(params, handleResponse(params, tracker, cb));
		} else {
			var myQuoteFeed = this.getQuoteFeed(params);
			if (myQuoteFeed)
				CIQ.ChartEngine.Driver.fetchData(
					CIQ.QuoteFeed.SERIES,
					myQuoteFeed.engine,
					params,
					handleResponse(params, tracker, cb)
				);
		}
	}
};

/**
 * Call this whenever the kernel knows that the symbols being used have changed
 * @private
 */
CIQ.ChartEngine.Driver.prototype.updateSubscriptions = function () {
	for (var qf = 0; qf < this.quoteFeeds.length; qf++) {
		if (this.quoteFeeds[qf].checkSubscriptions)
			this.quoteFeeds[qf].checkSubscriptions(this.stx);
	}
};

/**
 * Fetches quotes for symbols related to the chart which are not the primary symbol.
 * such as series and study symbols.
 * @param {object} params Params object used by the QuoteDriver in fetching data
 * @param  {Function} cb  Function to callback when quotes are fetched. Will be passed an array of results. Each result is an object {dataCallback, params}.
 * @param  {number} fetchType  Quotefeed constants e.g. CIQ.QuoteFeed.UPDATE, CIQ.QuoteFeed.PAGINATION, CIQ.QuoteFeed.INITIAL
 * @param {object} [behavior] behavior from which to find quotefeed to fetch quotes from.  If not provided, will iterate through all available.
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 */
CIQ.ChartEngine.Driver.prototype.loadDependents = function (
	params,
	cb,
	fetchType,
	behavior
) {
	var self = this;
	if (!behavior) {
		var cnt = 0;
		var independentQf = [],
			dependentQf = [];
		var cbDependentQf = function (res) {
			if (cb && ++cnt >= self.quoteFeeds.length) cb(null);
		};
		var cbIndependentQf = function (res) {
			if (++cnt < independentQf.length) return;
			if (!dependentQf.length) cbDependentQf(res);
			dependentQf.forEach(function (qf) {
				self.loadDependents(params, cbDependentQf, fetchType, qf.behavior);
			});
		};
		self.quoteFeeds.forEach(function (qf) {
			if (qf.behavior.generator) dependentQf.push(qf);
			else independentQf.push(qf);
		});
		independentQf.forEach(function (qf) {
			self.loadDependents(params, cbIndependentQf, fetchType, qf.behavior);
		});
		return;
	}
	var field;
	var syms = {};
	var stx = params.stx;
	var chart = params.chart;
	var seriesList = chart.series;
	var masterData = stx.masterData;
	var series, symbolObject;

	// Create a master list of all symbols we need from our various dependencies: series and studySymbols
	var allSymbols = [],
		ranges = {};
	var isUpdate = fetchType == CIQ.QuoteFeed.UPDATE;
	var isPaginate = fetchType == CIQ.QuoteFeed.PAGINATION;
	var scratchParams = CIQ.shallowClone(params);
	for (field in seriesList) {
		series = seriesList[field];
		var sp = series.parameters;
		if (!isUpdate) {
			if (!params.future && series.moreAvailable === false) continue; // skip series that no longer have historical data.
			if (params.future && series.upToDate === true) continue; // skip series that no longer have future data.
		}
		if (series.loading) continue; // skip series that are presently loading data
		if (sp.loadData === false) continue; // skip series that do not load data
		if (isUpdate || isPaginate) {
			if (!series.endPoints || !Object.keys(series.endPoints).length) continue; // skip series which have not set range in master data yet
		}
		if (sp.data && !sp.data.useDefaultQuoteFeed) continue; // legacy
		symbolObject = sp.symbolObject;
		if (!symbolObject.symbol) continue; // skip series that are really just fields already loaded, like "High".
		if (symbolObject.generator != behavior.generator) continue;
		scratchParams.symbolObject = symbolObject;
		scratchParams.symbol = symbolObject.symbol;
		var qf = this.getQuoteFeed(scratchParams);
		if (behavior != (qf && qf.behavior)) continue; // doesn't match behavior passed in; not updating on this loop
		var isUnique = true;
		if (!isUpdate) series.loading = true;
		for (var j = 0; j < allSymbols.length; j++) {
			if (CIQ.symbolEqual(allSymbols[j], symbolObject)) isUnique = false;
		}
		if (isUnique) {
			allSymbols.push(symbolObject);
			ranges[symbolObject.symbol] = series.endPoints;
		}
	}

	var arr = [];
	for (var k = 0; k < allSymbols.length; k++) {
		symbolObject = allSymbols[k];
		var seriesParam = CIQ.shallowClone(params.originalState);
		seriesParam.symbol = symbolObject.symbol;
		seriesParam.symbolObject = symbolObject;
		if (seriesParam.update || seriesParam.future) {
			if (!seriesParam.endDate) seriesParam.endDate = params.endDate;
			seriesParam.startDate = ranges[symbolObject.symbol].end;
		} else {
			if (!seriesParam.startDate) seriesParam.startDate = params.startDate;
			// for comparisons, you must fetch enough data on the new Comparison to match the beginning of the masterData until the current tick.
			// The current tick may be newer than master data last tick, so set the end Date to right now.
			seriesParam.endDate =
				isPaginate && !params.future
					? ranges[symbolObject.symbol].begin
					: params.endDate;
			seriesParam.ticks = params.ticks;
		}
		arr.push(seriesParam);
	}
	if (!arr.length && isUpdate) {
		// we need this because in updateChart we don't create and let the dependents do it.
		var dsParams = {
			appending: params.appending || params.originalState.update
		};
		if (dsParams.appending) dsParams.appendToDate = params.startDate;
		stx.createDataSet(null, null, dsParams);
		if (!params.nodraw) stx.draw();
		if (cb) cb(null);
		return;
	}

	function MFclosure(isUpdate) {
		return function (results) {
			var earliestDate = null;
			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				var error = result.dataCallback.error;
				if (!error && error !== 0) {
					var symbolObject = result.params.symbolObject;
					var dataCallback = result.dataCallback,
						quotes = dataCallback.quotes,
						moreAvailable = dataCallback.moreAvailable,
						upToDate = dataCallback.upToDate;
					var arr = [];
					if (stx.getSeries)
						arr = stx.getSeries({ symbolObject: symbolObject });
					var fillGaps = false;
					for (var j = 0; j < arr.length; j++) {
						series = arr[j];
						if (!isUpdate) {
							// only reset the moreAvailable/upToDate on pagination or initial fetch, never on updates.
							if (!params.future)
								series.moreAvailable =
									moreAvailable === false
										? false
										: moreAvailable ||
										  quotes.length > (result.params.endDate ? 1 : 0);
							else {
								series.upToDate =
									upToDate === true
										? true
										: upToDate ||
										  quotes.length <= (result.params.startDate ? 1 : 0);
								if (stx.isHistoricalModeSet && quotes.length < 2)
									series.mostRecentForwardAttempt = new Date();
							}
							series.loading = false;
						}
						// Once fillGaps is set, do not unset it.
						fillGaps = series.parameters.fillGaps || fillGaps;
					}
					quotes = self.cleanup(
						stx,
						series,
						quotes,
						fetchType,
						params,
						fillGaps
					);
					stx.updateChartData(quotes, chart, {
						secondarySeries: symbolObject.symbol,
						noCreateDataSet: true,
						noCleanupDates: true,
						allowReplaceOHL: true
					});
					if (
						quotes &&
						quotes.length &&
						(!earliestDate || earliestDate > quotes[0].DT)
					)
						earliestDate = quotes[0].DT;
				}
			}
			if (results.length) {
				stx.createDataSet(null, null, {
					appending: params.originalState.update || params.future,
					appendToDate: earliestDate
				});
				if (!params.nodraw) stx.draw();
				if (fetchType == CIQ.QuoteFeed.INITIAL)
					self.resetRefreshInterval(behavior.refreshInterval, behavior);
			}
			if (cb) cb(null);
		};
	}

	this.multiFetch(arr, MFclosure(isUpdate));
};

/**
 * Cleans up the dates and the gaps
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since 5.2.0
 */
CIQ.ChartEngine.Driver.prototype.cleanup = function (
	stx,
	series,
	quotes,
	mode,
	params,
	fillGaps
) {
	stx.doCleanupDates(quotes, stx.layout.interval);
	if (
		!params.missingBarsCreated &&
		quotes &&
		quotes.length &&
		stx.cleanupGaps &&
		fillGaps !== false
	) {
		var removalMethod, field;
		var chartOrSeries = params.chart;
		if (!series) field = chartOrSeries.defaultPlotField;
		else {
			chartOrSeries = series;
			field = series.parameters.symbol || series.id;
		}
		if (mode == CIQ.QuoteFeed.PAGINATION && !params.loadMoreReplace) {
			//add bar for end date so we can close gaps
			if (
				chartOrSeries.endPoints.begin &&
				chartOrSeries.endPoints.begin > quotes[quotes.length - 1].DT
			) {
				var endingRecord = stx.getFirstLastDataRecord(
					stx.masterData,
					field,
					false
				);
				if (series) endingRecord = endingRecord[field];
				quotes.push(endingRecord);
				removalMethod = "pop";
			}
		} else if (mode == CIQ.QuoteFeed.UPDATE) {
			//add bar for begin date so we can close gaps
			if (
				chartOrSeries.endPoints.end &&
				chartOrSeries.endPoints.end < quotes[0].DT
			) {
				var beginningRecord = stx.getFirstLastDataRecord(
					stx.masterData,
					field,
					true
				);
				if (series) beginningRecord = beginningRecord[field];
				quotes.unshift(beginningRecord);
				removalMethod = "shift";
			}
		}
		quotes = stx.doCleanupGaps(quotes, params.chart, {
			cleanupGaps: fillGaps,
			noCleanupDates: true
		});
		if (removalMethod) quotes[removalMethod]();
	}
	return quotes;
};

/**
 * Updates the chart as part of the chart loop.
 *
 * @param {object} [behavior] If set, only updates records that match the behavior.
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since 7.3.0 Added the `behavior` parameter.
 */
CIQ.ChartEngine.Driver.prototype.updateChart = function (behavior) {
	if (this.updatingChart) return;
	if (this.loadingNewChart) return;
	var howManyToGet = Object.keys(this.stx.charts).length;
	var howManyReturned = 0;
	var stx = this.stx;

	var interval = stx.layout.interval;
	var timeUnit = stx.layout.timeUnit;

	function closure(self, params, symbol, quoteFeed) {
		if (params.behavior.prefetchAction)
			params.behavior.prefetchAction("updateChart");
		return function (dataCallback) {
			howManyReturned++;
			var chart = params.chart,
				masterData = chart.masterData;
			if (
				symbol == chart.symbol &&
				interval == stx.layout.interval &&
				timeUnit == stx.layout.timeUnit &&
				!stx.isHistoricalMode()
			) {
				// Make sure user hasn't changed symbol while we were waiting on a response
				if (!dataCallback.error) {
					var quotes = dataCallback.quotes;
					quotes = self.cleanup(
						stx,
						null,
						quotes,
						CIQ.QuoteFeed.UPDATE,
						params
					);
					stx.updateChartData(quotes, chart, {
						noCreateDataSet: true,
						noCleanupDates: true
					});
					chart.attribution = dataCallback.attribution;
				} else if (quoteFeed) {
					quoteFeed.engine.announceError(params.originalState, dataCallback);
				}
			} else {
				self.updatingChart = false;
				return;
			}
			if (howManyReturned == howManyToGet) {
				self.updatingChart = false;
			}
			if (params.behavior.callback) {
				params.behavior.callback(params);
			}
			self.loadDependents(params, null, CIQ.QuoteFeed.UPDATE, params.behavior); // createDataSet(),draw() will be handled in here
		};
	}
	for (var chartName in stx.charts) {
		var chart = stx.charts[chartName];
		if (!chart.symbol) continue;
		// Removed below line.  It's possible IPO has no quotes from loadChart but a BATS update will return data.
		//if(!chart.masterData /*|| !chart.masterData.length*/) continue;	 // sometimes there is no data but it is not an error, and we want to let the refresh try again. If don't go in here, self.updatingChart will never be set to true and we will never refresh.
		var params = this.makeParams(chart.symbol, chart.symbolObject, chart);
		var myQuoteFeed = this.getQuoteFeed(params);
		if (chart.masterData && chart.masterData.length) {
			params.startDate = chart.endPoints.end; // if there is no data, then let the fetch treat an in initial load without start or end dates.
		}
		params.update = true;
		params.originalState = CIQ.shallowClone(params);
		if (behavior && behavior != params.behavior) {
			this.loadDependents(params, null, CIQ.QuoteFeed.UPDATE, behavior); // bypassing main symbol fetch, but check series
			continue;
		}
		this.updatingChart = true;
		var closureCB = closure(this, params, chart.symbol, myQuoteFeed);
		if (stx.isEquationChart(params.symbol)) {
			//equation chart
			CIQ.fetchEquationChart(params, closureCB);
		} else if (myQuoteFeed) {
			CIQ.ChartEngine.Driver.fetchData(
				CIQ.QuoteFeed.UPDATE,
				myQuoteFeed.engine,
				params,
				closureCB
			);
		}
	}
};

CIQ.ChartEngine.Driver.prototype.updateChartLoop = function (
	newInterval,
	behavior
) {
	if (!behavior) behavior = this.behavior;
	if (behavior.intervalTimer == -1) return; // the driver was killed. This was probably an async call from a feed response sent before it was killed.
	if (behavior.intervalTimer) clearInterval(behavior.intervalTimer); // stop the timer
	var closure = function (self, thisBehavior) {
		return function () {
			if (thisBehavior.noUpdate) return;
			self.updateChart(thisBehavior);
		};
	};
	for (var qf = 0; qf < this.quoteFeeds.length; qf++) {
		var thisBehavior = this.quoteFeeds[qf].behavior;
		if (behavior == thisBehavior && !thisBehavior.noUpdate) {
			if (!newInterval && newInterval !== 0)
				newInterval = thisBehavior.refreshInterval;
			if (newInterval)
				behavior.intervalTimer = setInterval(
					closure(this, thisBehavior),
					newInterval * 1000
				);
		}
	}
};

/**
 * Convenience function to change the refresh interval that was set during {@link CIQ.ChartEngine#attachQuoteFeed}.
 *
 * @param {number} newInterval The new refresh interval in seconds.
 * @param {object} [behavior] Optional behavior whose interval to reset, if omitted, will set first quote feed only.
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since
 * - 07/01/2015
 * - 7.3.0 Added `behavior` parameter.
 */
CIQ.ChartEngine.Driver.prototype.resetRefreshInterval = function (
	newInterval,
	behavior
) {
	(behavior || this.behavior).refreshInterval = newInterval; // set to your new interval
	this.updateChartLoop(null, behavior); // restart the timer in the new interval
};

/**
 * Loads all available data.
 *
 * @param {CIQ.ChartEngine.Chart} [chart] The chart to adjust. If left undefined, adjust the main symbol chart.
 * @param {function} cb The callback function. Will be called with the error returned by the quotefeed, if any.
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since 07/01/2015
 */
CIQ.ChartEngine.Driver.prototype.loadAll = function (chart, cb) {
	var self = this;
	var count = 0;
	function closure() {
		return function (response) {
			if (response) {
				// error
				cb(response);
			} else if (!chart.moreAvailable && chart.upToDate) {
				// no more data
				cb(null);
				//}else if(chart.loadingMore){  // something else is loading past data, abort this
				//	cb(null);
			} else if (++count > 20) {
				// we'll allow up to 20 fetches
				cb("error, moreAvailable not implemented correctly in QuoteFeed");
			} else {
				// get some more
				chart.loadingMore = false;
				self.checkLoadMore(chart, true, true, closure(), true);
			}
		};
	}
	closure()();
};

/**
 * If the quote feed has indicated there is more data available it will create and execute a fetch() call,
 * load the data into the masterData array, and create a new dataSet. Called internally as needed to keep the chart data up to date.
 * Finally it will re-draw the chart to display the new data
 *
 * @param  {CIQ.ChartEngine.Chart} [chart] The chart to adjust. Otherwise adjusts the main symbol chart.
 * @param {boolean} forceLoadMore set to true to force a fetch() call.
 * @param {boolean} fetchMaximumBars	set to true to request the maximum amount of data available from the feed.
 * @param {function} cb The callback function. Will be called with the error returned by the quotefeed, if any.
 * @param {boolean} nodraw Set to true to skip over the draw() call
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 */
CIQ.ChartEngine.Driver.prototype.checkLoadMore = function (
	chart,
	forceLoadMore,
	fetchMaximumBars,
	cb,
	nodraw
) {
	var stx = this.stx,
		driver = this;

	if (chart.loadingMore || this.loadingNewChart) {
		chart.initialScroll = chart.scroll;
		if (cb) cb(null);
		return;
	}

	var isHistoricalData = stx.isHistoricalMode();
	if (!isHistoricalData) stx.isHistoricalModeSet = false;

	var params = this.makeParams(chart.symbol, chart.symbolObject, chart);

	function finish(err) {
		chart.loadingMore = false;
		if (cb) cb(err);
	}

	if (stx.currentlyImporting) {
		if (cb) cb(null);
		return;
	}

	var myBehavior = params.behavior;

	var dataSet = chart.dataSet;
	function needsBackFill(which) {
		return (
			!which.endPoints.begin ||
			dataSet.length - chart.scroll < myBehavior.bufferSize ||
			dataSet.length -
				chart.scroll -
				stx.tickFromDate(which.endPoints.begin, chart) <
				myBehavior.bufferSize
		);
	}
	function needsFrontFill(which) {
		return (
			!which.endPoints.end ||
			chart.scroll - chart.maxTicks + 1 < myBehavior.bufferSize ||
			stx.tickFromDate(which.endPoints.end, chart, null, true) -
				dataSet.length +
				chart.scroll -
				chart.maxTicks +
				2 <
				myBehavior.bufferSize
		);
	}
	// The following var will be used to determine if it's ok to retry a forward pagination.
	// Without this delay, a chart which ends in the past (delisted) or a chart with data coming in slowly
	// will never exit historical mode, so we need to prevent repeated requests from the draw() loop.
	// So we buffer using the behavior forwardPaginationRetryInterval.
	var forwardFetchDoARetry;
	var forwardPaginationRetryIntervalMS =
		1000 * (myBehavior.forwardPaginationRetryInterval || 5);

	var seriesNeedsBackFill = false,
		seriesNeedsFrontFill = false; // see if series need loading
	if (chart.dataSet.length) {
		for (var key in chart.series) {
			var series = chart.series[key];
			if (series.loading) continue; // exclude this series
			if (series.parameters.loadData === false) continue; // exclude series loaded thru masterData
			forwardFetchDoARetry =
				!series.mostRecentForwardAttempt ||
				series.mostRecentForwardAttempt.getTime() +
					forwardPaginationRetryIntervalMS <
					Date.now();

			if (series.moreAvailable !== false && needsBackFill(series))
				seriesNeedsBackFill = true;
			if (forwardFetchDoARetry && !series.upToDate && needsFrontFill(series))
				seriesNeedsFrontFill = true;
		}
	}

	forwardFetchDoARetry =
		!chart.mostRecentForwardAttempt ||
		chart.mostRecentForwardAttempt.getTime() +
			forwardPaginationRetryIntervalMS <
			Date.now();
	// Now we determine which type of pagination we need
	var mainPastFetch =
		(needsBackFill(chart) || forceLoadMore) && chart.moreAvailable !== false;
	var mainForwardFetch =
		(needsFrontFill(chart) || forceLoadMore) &&
		!chart.upToDate &&
		forwardFetchDoARetry;
	var isPastPagination = mainPastFetch || seriesNeedsBackFill;
	var isForwardPagination =
		stx.isHistoricalModeSet &&
		!isPastPagination &&
		(mainForwardFetch || seriesNeedsFrontFill);

	var interval = stx.layout.interval;
	var timeUnit = stx.layout.timeUnit;
	function closure(self, params) {
		if (myBehavior.prefetchAction) myBehavior.prefetchAction("checkLoadMore");
		return function (dataCallback) {
			var stx = self.stx,
				chart = params.chart;
			if (
				params.symbol == chart.symbol &&
				interval == stx.layout.interval &&
				timeUnit == stx.layout.timeUnit
			) {
				// Make sure user hasn't changed symbol while we were waiting on a response
				if (!params.loadMore) {
					params.chart.loadingMore = false;
				}
				if (!dataCallback.error) {
					if (!dataCallback.quotes) dataCallback.quotes = [];
					var quotes = dataCallback.quotes,
						masterData = chart.masterData;
					quotes = self.cleanup(
						stx,
						null,
						quotes,
						CIQ.QuoteFeed.PAGINATION,
						params
					);
					if (quotes.length && chart.masterData && chart.masterData.length) {
						// remove possible dup with master data's first record
						if (params.future) {
							// remove possible dup with master data's first record
							var firstQuote = quotes[0];
							if (
								firstQuote.DT &&
								firstQuote.DT ==
									chart.masterData[chart.masterData.length - 1].DT
							)
								masterData.pop();
						} else {
							// remove possible dup with master data's last record
							var lastQuote = quotes[quotes.length - 1];
							if (lastQuote.DT && +lastQuote.DT == +chart.masterData[0].DT)
								quotes.pop();
						}
					}

					if (!params.future) {
						// set moreAvailable before we call draw or we can create an infinite loop if the feed servers runs out of data in the middle of a draw
						// if dataCallback.moreAvailable is set to either true or false, set chart.moreAvailable to that value
						// if dataCallback.moreAvailable is not set at all (null or undefined), then set chart.moreAvailable to dataCallback.quotes.length!==0
						if (dataCallback.moreAvailable) chart.moreAvailable = true;
						else if (dataCallback.moreAvailable === false || !quotes.length)
							chart.moreAvailable = false;
						// Can't be more available if we got nothing back
						else chart.moreAvailable = true;
					} else {
						if (dataCallback.upToDate) chart.upToDate = true;
						else if (dataCallback.upToDate === false || quotes.length > 1)
							chart.upToDate = false; // Can't be up to date if we got something back
						if (stx.isHistoricalModeSet && quotes.length < 2)
							chart.mostRecentForwardAttempt = new Date(); // no quotes for future query, so timestamp this query
					}
					self.tickMultiplier = quotes.length ? 2 : self.tickMultiplier * 2;

					// Better to set this early, in case a draw() is called from one of the functions below and checkLoadMore is retriggered.  We need to know where we left off!
					var sdate = quotes[0] ? quotes[0].DT : params.startDate,
						edate = quotes[0] ? quotes[quotes.length - 1].DT : params.endDate;
					if (!chart.endPoints.begin || chart.endPoints.begin > sdate)
						chart.endPoints.begin = sdate;
					if (!chart.endPoints.end || chart.endPoints.end < edate)
						chart.endPoints.end = edate;

					chart.loadingMore = false; // this has to be set before draw() so we may call another pagination from it

					if (params.loadMoreReplace) {
						stx.setMasterData(quotes, chart, { noCleanupDates: true });
					} else if (params.future) {
						stx.updateChartData(quotes, chart, {
							noCreateDataSet: true,
							noCleanupDates: true
						});
					} else {
						CIQ.addMemberToMasterdata({
							stx: stx,
							chart: chart,
							data: quotes,
							fields: ["*"],
							noCleanupDates: true
						});
					}
					var dsParams;
					if (params.future) {
						dsParams = {
							appending: true,
							appendToDate: quotes[0] && quotes[0].DT
						};
					}
					stx.createDataSet(undefined, undefined, dsParams);

					if (!nodraw) stx.draw();
					if (myBehavior.callback) {
						myBehavior.callback(params);
					}
					self.loadDependents(params, cb, CIQ.QuoteFeed.PAGINATION);
				} else {
					self.quoteFeed.announceError(params.originalState, dataCallback);
					params.chart.loadingMore = false;
					if (cb) cb(dataCallback.error);
				}
			} else {
				//console.log("orphaned loadMore",params);
				return;
			}
		};
	}
	var fetching = false;
	var findHeadOfData =
		myBehavior.findHeadOfData || (chart.masterData && chart.masterData.length);
	if (!myBehavior.noLoadMore && findHeadOfData) {
		if (
			isForwardPagination ||
			!stx.maxDataSetSize ||
			chart.dataSet.length < stx.maxDataSetSize
		) {
			if (isPastPagination || isForwardPagination) {
				chart.initialScroll = chart.scroll;
				chart.loadingMore = true;
				params = this.makeParams(chart.symbol, chart.symbolObject, chart);
				params.pagination = true;
				params.future = isForwardPagination;
				if (chart.masterData && chart.masterData.length) {
					if (isForwardPagination) params.startDate = chart.endPoints.end;
					else params.endDate = chart.endPoints.begin;
					var firstLast;
					// fallback on masterData endpoints
					if (isForwardPagination && !params.startDate) {
						firstLast = stx.getFirstLastDataRecord(
							chart.masterData,
							"DT",
							true
						);
						if (firstLast) params.startDate = firstLast.DT;
					} else if (isPastPagination && !params.endDate) {
						firstLast = stx.getFirstLastDataRecord(chart.masterData, "DT");
						if (firstLast) params.endDate = firstLast.DT;
					}
				} else {
					params.endDate = new Date();
				}
				params.originalState = CIQ.shallowClone(params);
				params.nodraw = nodraw;
				if (
					(!mainPastFetch && seriesNeedsBackFill) ||
					(!mainForwardFetch && seriesNeedsFrontFill)
				) {
					this.loadingMore = true;
					this.loadDependents(params, finish, CIQ.QuoteFeed.PAGINATION);
					if (cb) cb(null);
					return;
				}
				if (stx.fetchMaximumBars[stx.layout.aggregationType]) {
					params.fetchMaximumBars = true;
					if (
						!stx.maxMasterDataSize ||
						myBehavior.maximumTicks < stx.maxMasterDataSize
					)
						params.ticks = myBehavior.maximumTicks;
					else params.ticks = stx.maxMasterDataSize;
				}
				var closureCB = closure(this, params);
				if (stx.isEquationChart(params.symbol)) {
					//equation chart
					CIQ.fetchEquationChart(params, closureCB);
				} else {
					if (isForwardPagination) params.appending = true;
					var qf = driver.getQuoteFeed(params);
					if (qf)
						CIQ.ChartEngine.Driver.fetchData(
							CIQ.QuoteFeed.PAGINATION,
							qf.engine,
							params,
							closureCB
						);
				}
				fetching = true;
			}
		}
	}
	if (!fetching && cb) cb(null);
};

/**
 * Extends the main series further into the past. Used internally by studies that need
 * additional historical data.
 *
 * @param {object} parameters Contains function call parameters.
 * @param {object} parameters.from A date object that specifies the date from which historical
 * 		data is fetched.
 * @param {function} cb The callback function called with the error (if any) returned by the
 * 		quote feed.
 *
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 * @since 8.0.0
 */
CIQ.ChartEngine.Driver.prototype.extendHistoricalData = function (
	{ from },
	cb = () => {}
) {
	const { stx } = this;
	const { chart, layout } = stx;
	const { masterData, dataSet } = chart;
	const { interval, timeUnit } = layout;
	const params = this.makeParams(chart.symbol, chart.symbolObject, chart);
	const quotefeed = this.getQuoteFeed(params);

	if (
		chart.loadingMore ||
		this.loadingNewChart ||
		stx.currentlyImporting ||
		!masterData.length ||
		!quotefeed ||
		(stx.maxDataSetSize && dataSet.length > stx.maxDataSetSize)
	) {
		return cb(null);
	}

	chart.loadingMore = true;
	params.originalState = Object.assign({}, params);
	params.startDate = from;
	params.endDate = masterData[0].DT;

	CIQ.ChartEngine.Driver.fetchData(
		CIQ.QuoteFeed.PAGINATION,
		quotefeed.engine,
		params,
		closure(this, params)
	);

	function closure(driver, params) {
		return function ({ quotes, moreAvailable, error }) {
			if (
				params.symbol !== chart.symbol ||
				interval !== layout.interval ||
				timeUnit !== layout.timeUnit
			) {
				return; // Make sure user hasn't changed symbol while we were waiting on a response
			}

			chart.loadingMore = false;

			if (error) return cb(error);

			quotes = driver.cleanup(
				stx,
				null,
				quotes,
				CIQ.QuoteFeed.PAGINATION,
				params
			);

			if (typeof moreAvailable === "boolean") {
				chart.moreAvailable = moreAvailable;
			} else {
				chart.moreAvailable = !!quotes.length;
			}

			chart.endPoints.begin = quotes[0].DT;

			CIQ.addMemberToMasterdata({
				stx: stx,
				chart: chart,
				data: quotes,
				fields: ["*"],
				noCleanupDates: true
			});

			stx.createDataSet();
			stx.draw();
		};
	}
};

/**
 * Returns how many bars should be fetched, based on an algorithm estimating number of bars to fill the screen.
 * If we're rolling our own months or weeks from daily ticks it will return the number of daily ticks to fetch.
 *
 * @param  {object} params Parameters
 * @param  {object} params.stx	  The chart object
 * @return {number}		   Number of bars to fetch
 * @memberOf CIQ.ChartEngine.Driver
 * @private
 */
CIQ.ChartEngine.Driver.prototype.barsToFetch = function (params) {
	if (!CIQ.isValidNumber(this.tickMultiplier)) this.tickMultiplier = 2; // used to determine params.ticks
	var interval = this.stx.layout.interval;
	var p = params.stx.layout.periodicity;
	// Rough calculation, this will account for 24x7 securities
	// If we're rolling our own months or weeks then adjust to daily bars
	if ((interval == "month" || interval == "week") && !this.stx.dontRoll) {
		p *= interval == "week" ? 7 : 30;
	}
	var bars = params.stx.chart.maxTicks * p;
	return bars * this.tickMultiplier;
};

/**
 * Calculates the suggestedStartDate for a query to a quoteFeed. Will either do a quick estimation if fetchMaximimBars is true for effiency or use a market iterator to find the exact start date.
 * This should only be called after the correct ticks have been determined.
 * @param {object} params
 * @param {object} iterator
 * @param {number} ticks
 * @return {Date} suggestedStartDate
 * @memberof CIQ.ChartEngine.Driver
 * @private
 * @since 5.1.1
 */
CIQ.ChartEngine.Driver.determineStartDate = function (params, iterator, ticks) {
	return this.determineStartOrEndDate(params, iterator, ticks, true);
};

/**
 * Calculates either the suggestedStartDate or suggestedEndDate for a query to a quoteFeed. Will either do a quick estimation if fetchMaximimBars is true for effiency or use a market iterator to find the exact end date.
 * When passing in a truthy boolean will calculate suggestedStartDate.
 * This should only be called after the correct ticks have been determined.
 * @param {object} params Params object used by the QuoteDriver in fetching data
 * @param {object} iterator Market iterator to used to advance and find a date
 * @param {number} ticks Ticks to fetch
 * @param {boolean} direction Direction to check date from
 * @return {Date} determinedDate (or present day)
 * @memberof CIQ.ChartEngine.Driver
 * @private
 * @since 6.0.0
 */
CIQ.ChartEngine.Driver.determineStartOrEndDate = function (
	params,
	iterator,
	ticks,
	isStart
) {
	var determinedDate;
	if (isStart || params.fetchMaximumBars) {
		determinedDate = params.startDate || iterator.previous(ticks);
	} else {
		determinedDate = params.future ? iterator.next(ticks) : new Date();
	}
	return determinedDate;
};

CIQ.ChartEngine.Driver.prototype.makeParams = function (
	symbol,
	symbolObject,
	chart
) {
	var stx = this.stx;
	var interval = stx.layout.interval;
	var ticks = this.barsToFetch({ stx: stx });
	// If we're rolling our own months or weeks then we should ask for days from the quote feed
	if ((interval == "month" || interval == "week") && !stx.dontRoll) {
		interval = "day";
	}
	var qf = this.getQuoteFeed({
		interval: interval,
		symbol: symbol,
		symbolObject: symbolObject
	});
	var behavior = qf && qf.behavior;
	var params = CIQ.shallowClone(behavior) || {};
	params.behavior = behavior;

	var extended = false,
		sessions = [];
	if (chart.market && chart.market.getSessionNames)
		sessions = chart.market.getSessionNames();
	if (stx.extendedHours) {
		if (stx.extendedHours.filter) {
			extended = true;
		} else {
			extended = stx.layout.extended;
			// filter out unwanted sessions
			sessions = sessions.filter(function (el) {
				return el.enabled || stx.layout.marketSessions[el.name];
			});
		}
	} else {
		sessions = sessions.filter(function (el) {
			return el.enabled;
		});
	}
	for (var sess = 0; sess < sessions.length; sess++) {
		sessions[sess] = sessions[sess].name; // remove "enabled" bit
	}

	CIQ.extend(
		params,
		{
			stx: stx,
			symbol: symbol,
			symbolObject: symbolObject,
			chart: chart,
			interval: interval,
			extended: extended,
			period: 1,
			ticks: ticks,
			additionalSessions: sessions,
			quoteDriverID: this.id
		},
		true
	);

	if (!params.symbolObject) params.symbolObject = { symbol: symbol };

	if (!isNaN(params.interval)) {
		// normalize numeric intervals into "minute", "second" or "millisecond" form as required by fetch()
		params.period = parseInt(params.interval, 10); // in case it was a string, which is allowed in setPeriodicity.
		params.interval = stx.layout.timeUnit;
		if (!params.interval) params.interval = "minute";
	}
	return params;
};

CIQ.ChartEngine.Driver.prototype.newChart = function (params, cb) {
	var stx = this.stx;
	var symbol = params.symbol;
	var interval = stx.layout.interval;
	var timeUnit = stx.layout.timeUnit;
	var chart = params.chart;
	chart.moreAvailable = null;
	chart.upToDate = null;
	chart.loadingMore = false;
	chart.attribution = null;
	var qparams = this.makeParams(symbol, params.symbolObject, chart);
	CIQ.extend(qparams, params, true);
	var myQuoteFeed = this.getQuoteFeed(qparams);
	var myBehavior = qparams.behavior;
	// Some aggregation types potentially require a lot of data. We set the flag "fetchMaximumBars"
	// but also take a guess and say 20,000 bars should cover most situations
	if (
		stx.fetchMaximumBars[stx.layout.aggregationType] ||
		params.fetchMaximumBars
	) {
		if (
			!stx.maxMasterDataSize ||
			myBehavior.maximumTicks < stx.maxMasterDataSize
		)
			qparams.ticks = myBehavior.maximumTicks;
		else qparams.ticks = stx.maxMasterDataSize;
		qparams.fetchMaximumBars = true;
	}

	function closure(self, qparams) {
		if (myBehavior.prefetchAction) myBehavior.prefetchAction("newChart");
		return function (dataCallback) {
			var chart = qparams.chart,
				quotes = dataCallback.quotes,
				success = false;
			if (
				symbol == chart.symbol &&
				interval == stx.layout.interval &&
				timeUnit == stx.layout.timeUnit
			) {
				// Make sure user hasn't changed symbol while we were waiting on a response
				self.loadingNewChart = false; // this has to be set before home() so we may call a pagination from it
				if (!dataCallback.error) {
					quotes = self.cleanup(
						stx,
						null,
						quotes,
						CIQ.QuoteFeed.INITIAL,
						qparams
					);
					stx.setMasterData(quotes, chart, { noCleanupDates: true });
					chart.endPoints = {};

					chart.endPoints.begin = quotes[0] ? quotes[0].DT : qparams.startDate;
					chart.endPoints.end = quotes[0]
						? quotes[quotes.length - 1].DT
						: qparams.endDate;

					// Note, quotes.length==0 will not set moreAvailable to false, just in case the stock is thinly traded
					// We'll rely on checkLoadMore to make the definitive decision
					if (!quotes) {
						chart.moreAvailable = false;
						chart.upToDate = true;
					} else {
						chart.moreAvailable =
							dataCallback.moreAvailable === false ? false : true;
						chart.upToDate = dataCallback.upToDate;
					}

					chart.attribution = dataCallback.attribution;
					if (params.initializeChart) stx.initializeChart();
					stx.createDataSet();
					success = true;
				} else {
					myQuoteFeed.engine.announceError(qparams.originalState, dataCallback);
				}
			} else {
				//console.log("orphaned request", qparams);
				if (cb) cb("orphaned");
				return;
			}

			// new data means that all series could potentially have historical data. So reset them all.
			for (var key in chart.series) {
				chart.series[key].endPoints = {};
				chart.series[key].moreAvailable = null;
				chart.series[key].upToDate = null;
			}

			// We've now responded to the loadChart() callback. Please note that dependents are now being loaded in parallel!
			var masterData = chart.masterData;
			if (masterData && masterData.length) {
				qparams.startDate = masterData[0].DT;
				qparams.endDate = masterData[masterData.length - 1].DT;
			}
			if (myBehavior.callback) {
				myBehavior.callback(qparams);
			}
			self.loadDependents(
				qparams,
				function () {
					if (success && !qparams.nodraw) self.stx.home(); // by default the white space is maintained now, so no need to include the {maintainWhitespace:true} parameter
					if (cb) cb(dataCallback.error);
					self.stx.dispatch("newChart", {
						stx: self.stx,
						symbol: self.stx.chart.symbol,
						symbolObject: self.stx.chart.symbolObject,
						moreAvailable: self.stx.chart.moreAvailable,
						upToDate: self.stx.chart.upToDate,
						quoteDriver: self
					});
					self.resetRefreshInterval(myBehavior.refreshInterval, myBehavior);
				},
				CIQ.QuoteFeed.INITIAL
			);
		};
	}
	this.loadingNewChart = true;
	this.updatingChart = false;

	qparams.originalState = CIQ.shallowClone(qparams);
	var closureCB = closure(this, qparams);
	if (this.stx.isEquationChart(qparams.symbol)) {
		//equation chart
		CIQ.fetchEquationChart(qparams, closureCB);
	} else if (myQuoteFeed) {
		CIQ.ChartEngine.Driver.fetchData(
			CIQ.QuoteFeed.INITIAL,
			myQuoteFeed.engine,
			qparams,
			closureCB
		);
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// Below code supports new quotefeed architecture
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Quotefeed constants defining fetchData's context parameter
CIQ.QuoteFeed.INITIAL = 1;
CIQ.QuoteFeed.UPDATE = 2;
CIQ.QuoteFeed.PAGINATION = 3;
CIQ.QuoteFeed.SERIES = 4;

// ALL quotefeed-fetch calls (old and new versions) go through this function
CIQ.ChartEngine.Driver.fetchData = function (context, quoteFeed, params, cb) {
	if (!params.symbol) return cb({});
	if (quoteFeed.v2QuoteFeed) {
		// if new version of quotefeed
		if (typeof quoteFeed.subscribe !== "function") {
			// if no subscribe function defined then this is a typical quotefeed
			CIQ.ChartEngine.Driver.fetchDataInContext(context, quoteFeed, params, cb);
		} else {
			// else this is a "subscription" quotefeed
			CIQ.ChartEngine.Driver.fetchDataInContext(
				context,
				quoteFeed,
				params,
				function (results) {
					if (!results.error) {
						this.checkSubscriptions(params.stx);
					}
					cb(results);
				}.bind(quoteFeed)
			);
		}
	} else {
		// old version of quotefeed
		params.stx.convertToDataZone(params.startDate);
		params.stx.convertToDataZone(params.endDate);
		quoteFeed.fetch(params, cb);
	}
};

// if not a "subscription" quotefeed, then this function is always called for new quotefeed -- here the user's quotefeed is invoked;
// functions not defined in quotefeed are skipped over
CIQ.ChartEngine.Driver.fetchDataInContext = function (
	context,
	quoteFeed,
	params,
	cb
) {
	var iterator_parms, iterator, suggestedStartDate, suggestedEndDate;
	var stx = params.stx;
	if (!stx.chart.market.newIterator) {
		console.error(
			"quoteFeed feature requires first activating market feature."
		);
		return;
	}
	// When dealing with a series, we need to look at the original params in order to figure out
	// what type of request we really need to make
	if (context === CIQ.QuoteFeed.SERIES) {
		params.series = true;
		context = CIQ.QuoteFeed.INITIAL;
		if ((params.endDate && !params.startDate) || params.future)
			context = CIQ.QuoteFeed.PAGINATION;
		else if (params.startDate && !params.endDate)
			context = CIQ.QuoteFeed.UPDATE;
	}
	var ticks = Math.min(params.ticks, params.maximumTicks);
	if (quoteFeed.maxTicks) ticks = Math.min(ticks, quoteFeed.maxTicks);
	var qfSymbol = params.symbolObject.masterSymbol || params.symbol;
	switch (context) {
		case CIQ.QuoteFeed.UPDATE:
			if (stx.isHistoricalModeSet) {
				stx.quoteDriver.updatingChart = false;
				return;
			}

			var startDate;
			if (params.startDate) {
				startDate = params.startDate;
			} else {
				startDate = new Date(); // occurs if initial fetch returned no data
				startDate.setHours(0, 0, 0, 0);
			}
			if (typeof quoteFeed.fetchUpdateData === "function") {
				quoteFeed.fetchUpdateData(
					qfSymbol,
					stx.convertToDataZone(startDate),
					params,
					cb
				);
			}

			break;
		case CIQ.QuoteFeed.INITIAL:
			//Now need to calculate suggested dates
			suggestedEndDate = params.endDate || new Date();
			iterator_parms = {
				begin: suggestedEndDate,
				interval: params.interval,
				periodicity:
					params.interval == "tick"
						? stx.chart.xAxis.futureTicksInterval
						: params.period,
				outZone: stx.dataZone
			};
			iterator = stx.chart.market.newIterator(iterator_parms);
			suggestedStartDate = CIQ.ChartEngine.Driver.determineStartDate(
				params,
				iterator,
				ticks
			);
			if (params.endDate) suggestedEndDate = params.endDate;
			if (typeof quoteFeed.fetchInitialData === "function") {
				quoteFeed.fetchInitialData(
					qfSymbol,
					suggestedStartDate,
					stx.convertToDataZone(suggestedEndDate),
					params,
					cb
				);
			}
			break;
		case CIQ.QuoteFeed.PAGINATION:
			iterator_parms = {
				begin: params.endDate || params.startDate,
				interval: params.interval,
				periodicity:
					params.interval == "tick"
						? stx.chart.xAxis.futureTicksInterval
						: params.period,
				outZone: stx.dataZone
			};
			iterator = stx.chart.market.newIterator(iterator_parms);
			var suggestedDate = CIQ.ChartEngine.Driver.determineStartOrEndDate(
				params,
				iterator,
				ticks,
				!params.future
			);
			suggestedStartDate = params.startDate || suggestedDate;
			suggestedEndDate = params.endDate || suggestedDate;
			if (!params.startDate) params.stx.convertToDataZone(suggestedEndDate);
			else params.stx.convertToDataZone(suggestedStartDate);

			if (typeof quoteFeed.fetchPaginationData === "function") {
				if (
					stx.maxMasterDataSize &&
					stx.maxMasterDataSize <= stx.masterData.length
				)
					return;
				quoteFeed.fetchPaginationData(
					qfSymbol,
					suggestedStartDate,
					suggestedEndDate,
					params,
					function (dataCallback) {
						if (suggestedEndDate >= Date.now()) stx.isHistoricalModeSet = false; // exit historical mode if we request (future) data up to present or beyond
						if (cb) cb(dataCallback);
					}
				);
			}
			break;
		default:
			console.error("Illegal fetchData constant");
	}
};

};

let __js_standard_series_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * <span class="injection">INJECTABLE</span>
 * Adds a series of data to the chart.
 *
 * A series can be rendered (for instance like a comparison chart) or it can be hidden (for instance to drive a study).
 *
 * If you have a quotefeed attached to your chart, then just pass the symbol as the first parameter.
 * There is no need to pass data since the chart will automatically fetch it from your quotefeed.
 * If however you are using the "push" method to feed data to your chart then you must provide the data manually by passing it as a parameter.
 *
 * Here's how you would add a hidden series for symbol "IBM" when using a quotefeed:
 * ```
 * stxx.addSeries("IBM");
 * ```
 *
 * That series will now be available for use by studies, for example, but it will not display on the chart since no rendering details have been provided.
 *
 * If you wish to *display* your series, you must specify how you wish the series to be rendered.
 * At a minimum, you will need to indicate what color should be used to display the series. Like so:
 * ```
 * stxx.addSeries("IBM", {color:"blue"});
 * ```
 *
 * Once a series is added, it will be tracked in the {@link CIQ.ChartEngine.Chart#series} object.
 *
 * To remove a series call {@link CIQ.ChartEngine#removeSeries}
 *
 * To remove all series from a chart, simply iterate through the active series object and delete them one at a time:
 * ```
 * for(var s in stxx.chart.series){
 *    var series=stxx.chart.series[s];
 *    stxx.removeSeries(series);
 * }
 * ```
 *
 * Example 1 - manually add data to a chart and a series<iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/avem0zcx/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * The above example adds a series as an overlay, but a more common use case is to display series as comparisons.
 * Comparisons are special because they change the chart from a price chart to a percentage chart.
 * All series on the chart then begin at "zero", on the left side of the chart.
 * Set isComparison=true when adding a series to make it a comparison chart.  As long as a comparison series is on a chart, the chart will display its y-axis in percent scale
 * provided {@link CIQ.ChartEngine.Chart#forcePercentComparison} is true.
 * ```
 * stxx.addSeries("IBM", {color:"blue", isComparison:true});
 * ```
 *
 * **Complex Visualizations**
 *
 * Example 2 - use a custom renderer to display a series<iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/b6pkzrad/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * Behind the scenes, series are displayed by [renderers]{@link CIQ.Renderer}.
 * Renderers can plot lines, mountains, bars, candles, and other types of visualizations.
 * When adding a series, you can specify which renderer to use and set parameters to control your visualization.
 * For instance, this will display a series as a bar chart on its own left axis:
 * ```
 * stxx.addSeries(
 * 		"SNE",
 * 		{
 * 			display:"Sony",
 * 			renderer:"Bars",
 * 			name:"test",
 * 			yAxis:{
 * 				position:"left",
 * 				textStyle:"#FFBE00"
 * 			}
 * 		}
 * );
 * ```
 * Which is the same as explicitly declaring a renderer and then attaching it to the series:
 * ```
 * stxx.addSeries(
 * 		"SNE",
 * 		{
 * 			display:"Sony"
 * 		},
 * 		function(){
 * 			// create the axis
 * 			var axis=new CIQ.ChartEngine.YAxis({position:"left", textStyle:"#FFBE00"});
 *
 * 			//create the renderer and attach
 * 			var renderer=stxx.setSeriesRenderer(
 * 				new CIQ.Renderer.Bars({params:{name:"test", yAxis:axis}})
 * 			);
 * 			renderer.attachSeries("SNE").ready();
 * 		}
 * );
 * ```
 * The above 2 calls do exactly the same thing, just using different syntax.
 *
 * All parameters specified in addSeries will be passed on to the selected renderer. As such, every parameter available for the selected renderer can be used here to further customize the series.<br>
 * For example, to add a step line, you would select a [Lines]{@link CIQ.Renderer.Lines} renderer, and then set its `step` attribute, right trough the addSeries API call.
 * ```
 * stxx.addSeries(
 * 		"SNE",
 * 		{
 * 			renderer:"Lines",
 * 			step:true,
 * 		}
 * );
 * ```
 *
 * **Advanced Visualizations**
 *
 * Some renderers are capable of rendering *multiple series*.
 * For instance, the [Histogram]{@link CIQ.Renderer.Histogram} can display series stacked on top of one another.
 * Use `[setSeriesRenderer()]{@link CIQ.ChartEngine#setSeriesRenderer}` in this case.
 * Here is how we would create a stacked histogram from several series:
 * ```
 * var myRenderer=stxx.setSeriesRenderer(new CIQ.Renderer.Histogram({params:{subtype:"stacked"}}));
 *
 * stxx.addSeries("^NIOALL", {},
 * 		function() {myRenderer.attachSeries("^NIOALL","#6B9CF7").ready();}
 * );
 * stxx.addSeries("^NIOAFN", {},
 * 		function() {myRenderer.attachSeries("^NIOAFN","#95B7F6").ready();}
 * );
 * stxx.addSeries("^NIOAMD", {},
 * 		function() {myRenderer.attachSeries("^NIOAMD","#B9D0F5").ready();}
 * );
 * ```
 *
 * Example 3 - advanced stacked histogram renderer<iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/rb423n71/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * **Using a Symbol Object**
 *
 * The above examples all assumed your chart uses "tickers" (stock symbols).
 * We refer to complex (compound) symbols as "Symbol Objects" (see {@link CIQ.ChartEngine#loadChart}).
 * Here's how to set a series with a symbol object:
 * ```
 * stxx.addSeries(null, {color:"blue", symbolObject:yourSymbolObject});
 * ```
 *
 * **Setting a separate YAxis**
 *
 * By default, series are displayed without a y-axis.
 * They are either "overlayed" on the main chart, or if they are comparisons then they share the standard y-axis.
 * But a series can also take an optional y-axis which can be displayed on the left, or the right side of the chart.
 * To do this, you must specify parameters for a [YAxis]{@link CIQ.ChartEngine.YAxis} object and pass to addSeries:
 * ```
 * stxx.addSeries("IBM", {color:"blue", yAxis:{ position:"left" }});
 * ```
 *
 * **Understanding the relationship between [setSeriesRenderer()]{@link CIQ.ChartEngine#setSeriesRenderer} and [importLayout]{@link CIQ.ChartEngine#importLayout}**
 *
 * It is important to know that a renderer explicitly created using [setSeriesRenderer()]{@link CIQ.ChartEngine#setSeriesRenderer} will **not** be stored in the layout serialization.
 * If your implementation will require the complete restoration of a chart layout, you must instead use the syntax that includes all of the renderer parameters as part of this addSeries call.
 *
 *
 * @param {string} [id] The name of the series. If not passed then a unique ID will be assigned. (parameters.symbol and parameters.symbolObject will default to using id if they are not set explicitly *and* id is supplied.)
 * @param {object} [parameters] Parameters to describe the series. Any valid [attachSeries parameters]{@link CIQ.Renderer#attachSeries} and [renderer parameters]{@link CIQ.Renderer} will be passed to attached renderers.
 * @param {string} [parameters.renderer={@link CIQ.Renderer.Lines}] <span class="injection">Rendering</span> Set to the desired [renderer]{@link CIQ.Renderer} for the series.
 * - If not set, defaults to [Lines]{@link CIQ.Renderer.Lines} when `color` is set.
 * - Not needed for hidden series.
 * @param {string} [parameters.name] <span class="injection">Rendering</span> Set to specify renderer's name.  Otherwise id will be used.
 * @param {string} [parameters.display=id/symbol] <span class="injection">Rendering</span> Set to the text to display on the legend. If not set, the id of the series will be used (usually symbol).  If id was not provided, will default to symbol.
 * @param {string} [parameters.symbol=id] <span class="injection">Data Loading</span> The symbol to fetch in string format. This will be sent into the fetch() function, if no data is provided.  If no symbol is provided, series will use the `id` as the symbol. If both `symbol` and `symbolObject` are set, `symbolObject` will be used.
 * @param {object} [parameters.symbolObject=id] <span class="injection">Data Loading</span> The symbol to fetch in object format. This will be sent into the fetch() function, if no data is provided. If no symbolObject is provided, series will use the `id` as the symbol. You can send anything you want in the symbol object, but you must always include at least a 'symbol' element. If both `symbol` and `symbolObject` are set, `symbolObject` will be used.
 * @param {string} [parameters.field=Close/Value] <span class="injection">Data Loading</span> Specify an alternative field to draw data from (other than the Close/Value). Must be present in your pushed data objects or returned from the quoteFeed.
 * @param {boolean} [parameters.isComparison=fasle] <span class="injection">Rendering</span> If set to true, shareYAxis is automatically set to true to display relative values instead of the primary symbol's price labels. {@link CIQ.ChartEngine#setComparison} is also called and set to `true`. This is only applicable when using the primary Y axis, and should only be used with internal addSeries renderers.
 * @param {boolean} [parameters.shareYAxis=false] <span class="injection">Rendering</span>
 * - Set to `true` so that the series shares the primary Y-axis and renders along actual values and print its corresponding current price label on the y axis.
 * - When set to `false`, the series will not be attached to a y axis. Instead it is superimposed on the chart; taking over its entire height, and maintaining the relative shape of the line. No current price will be displayed. Superimposing the ‘shape’ of one series over a primary chart, is useful when rendering multiple series that do not share a common value range.
 * - This setting will automatically override to true if 'isComparison' is set.
 * - This setting is only applicable when using the primary Y axis and has no effect when using a renderer that has its own axis.
 * @param {number} [parameters.marginTop=0] <span class="injection">Rendering</span> Percentage (if less than 1) or pixels (if greater than 1) from top of panel to set the top margin for the series.<BR>**Note:** this parameter is to be used on **subsequent** series rendered on the same axis. To set margins for the first series, {@link CIQ.ChartEngine.YAxis#initialMarginTop} needs to be used.<BR>**Note:** not applicable if shareYAxis is set.
 * @param {number} [parameters.marginBottom=0] <span class="injection">Rendering</span> Percentage (if less than 1) or pixels (if greater than 1) from the bottom of panel to set the bottom margin for the series.<BR>**Note:** this parameter is to be used on **subsequent** series rendered on the same axis. To set margins for the first series, {@link CIQ.ChartEngine.YAxis#initialMarginBottom} needs to be used.<BR>**Note:** not applicable if shareYAxis is set.
 * @param {number} [parameters.width=1] <span class="injection">Rendering</span> Width of line in pixels
 * @param {number} [parameters.minimum]	 <span class="injection">Rendering</span> Minimum value for the series. Overrides CIQ.minMax result.
 * @param {number} [parameters.maximum]	 <span class="injection">Rendering</span> Maximum value for the series. Overrides CIQ.minMax result.
 * @param {string} [parameters.color] <span class="injection">Rendering</span> Color to draw line. Will cause the line to immediately render an overlay. Only applicable for default or single colors renderers. See {@link CIQ.Renderer#attachSeries} for additional color options.
 * @param {string} [parameters.baseColor=parameters.color] <span class="injection">Rendering</span> Color for the base of a mountain series. Defaults to `parameters.color`.
 * @param {array|string} [parameters.pattern='solid'] <span class="injection">Rendering</span> Pattern to draw line, array elements are pixels on and off, or a string e.g. "solid", "dotted", "dashed"
 * @param {boolean|string} [parameters.fillGaps] <span class="injection">Data Loading</span> If {@link CIQ.ChartEngine#cleanupGaps} is enabled to clean gaps (not 'false'), you can use this parameter to override the global setting for this series.
 * - If `fillGaps` not present
 *   - No gaps will be filled for the series.
 * - If `fillGaps` is set to 'false'
 *   - No gaps will be filled for the series.
 * - If `fillGaps` is set to 'true',
 *   - Gap filling will match {@link CIQ.ChartEngine#cleanupGaps}.
 * - If `fillGaps` is set to  'carry' or 'gap'
 *  - Will use that filling method even if `cleanupGaps` is set differently.
 * @param {object|string} [parameters.gapDisplayStyle=true] <span class="injection">Rendering</span> Defines how (or if) to **render** (style) connecting lines where there are gaps in the data (missing data points), or isolated datapoints.
 * - Applicable for line-like renderers only (lines, mountains, baselines, etc).
 * - Default:
 *   - `true` for standard series.
 *   - `false` for comparisons.
 * - Set to `true` to use the color and pattern defined by {@link CIQ.ChartEngine#setGapLines} for the chart.
 * - Set to `false` to always show gaps.
 * - Set to an actual color string or custom color-pattern object as formatted by {@link CIQ.ChartEngine#setGapLines} to define more custom properties.
 * - 'Dots' indicating isolated items will be shown unless a `transparent` color/style is specified.
 * - If not set, and the series is a comparison, the gaps will always be rendered transparent.
 * @param {string} [parameters.fillStyle] <span class="injection">Rendering</span> Fill style for mountain chart (if selected). For semi-opaque use rgba(R,G,B,.1).  If not provided a gradient is created with color and baseColor.
 * @param {boolean} [parameters.permanent=false] <span class="injection">Rendering</span> Set to `true` to activate. Makes series unremoveable by a user **when attached to the default renderer**. If explicitly linked to a renderer, see {@link CIQ.Renderer#attachSeries} for details on how to prevent an attached series from being removed by a user.
 * @param {object} [parameters.data] <span class="injection">Data Loading</span> Data source for the series.
 * - If this field is omitted, the library will connect to the QuoteFeed (if available) to fetch initial data ( unless `parameters.loadData` is set to `false`), and manage pagination and updates.
 * - If data is sent in this field, it will be loaded into the masterData, but series will **not** be managed by the QuoteFeed (if available) for pagination or updates.
 * - Items in this array *must* be ordered from earliest to latest date.<br>
 * - Accepted formats:
 * <br><br><br>**Full OHLC:**<br>
 * An array of properly formatted OHLC quote object(s). [See OHLC Data Format]{@tutorial InputDataFormat}.<br>
 * <br>----<br><br>**Price Only:**<br>
 * An array of of objects, each one with the followng elements:<br>
 * @param {date}   [parameters.data.DT] JavaScript date object or epoch representing data point (overrides Date parameter if present)
 * @param {string} [parameters.data.Date] string date representing data point ( only used if DT parameter is not present)
 * @param {number} parameters.data.Value value of the data point ( As an alternative, you can send `parameters.data.Close` since your quote feed may already be returning the data using this element name)
 * @param {string|boolean} [parameters.panel] <span class="injection">Rendering</span> The panel name on which the series should display. If the panel doesn't exist, one will be created. If `true` is passed, a new panel will also be created.
 * @param {string} [parameters.action='add-series'] <span class="injection">Rendering</span> Overrides what action is sent in symbolChange events. Set to null to prevent a symbolChange event.
 * @param {boolean} [parameters.loadData=true] <span class="injection">Data Loading</span> Include and set to false if you know the initial data is already in the masterData array or will be loaded by another method. The series will be added but no data requested. Note that if you remove this series, the data points linked to it will also be removed which may create issues if required by the chart. If that is the case, you will need to manually remove from the renderer linked to it instead of the underlying series itself.
 * @param {boolean} [parameters.extendToEndOfDataSet] <span class="injection">Rendering</span> Set to true to plot any gap at the front of the chart.  Automatically done for step charts (set to false to disable) or if parameters.gapDisplayStyle are set (see {@link CIQ.ChartEngine#addSeries})
 * @param {boolean} [parameters.displayFloatingLabel=false] <span class="injection">Rendering</span> Set to false to disable the display of a Y-axis floating label for this series.
 * @param {function} [cb] Callback function to be executed once the fetch returns data from the quoteFeed. It will be called with an error message if the fetch failed: `cb(err);`. Only applicable if no data is provided.
 *
 * @return {object} The series object
 * @memberof CIQ.ChartEngine
 *
 *
 * @example
 * // add a series overlay and display it as a dashed line.
 * stxx.addSeries(
 *		"IBM",
 *		{color:"purple", pattern:[3,3]}
 * );
 *
 * @example
 * // Add a series onto the main axis and then create a moving average study that uses it.
 * // Note, this will work for any study that accepts a *"Field"* parameter.
 *
 *	stxx.addSeries("ge", {color:"yellow", shareYAxis:true}, function(){
 *		var inputs = {
 *	        "Period": 20,
 *	        "Field": "ge",
 *	        "Type": "ma"
 *	    };
 *	    var outputs = {
 *	        "MA": "red"
 *	    };
 *	    CIQ.Studies.addStudy(stxx, "ma", inputs, outputs);
 *	});
 *
 * @example
 * // add series using a symbolObject which includes the data source key.
 * // This key will be sent into the fetch 'params' for use in your quoteFeed.
 * var mySymbol={symbol:"GE", source:"realtimedb"};
 * var mySymbol2={symbol:"GDP", source:"fundamentaldb"};
 *
 * stxx.addSeries(null, {color:"purple", symbolObject:mySymbol});
 * stxx.addSeries(null, {color:"green", symbolObject:mySymbol2});
 *
 * @example
 * // The engine is smart enough to use the series symbol, or "Close" if the symbol doesn't exist in the returned data from your quotefeed
 * // but if you want to use any other field then you'll need to specify it like this.
 * stxx.addSeries("GE", {color:"purple", field: "Open"});
 *
 * @example
 * // add the comparison series with a color to immediately render using default renderer (as lines) and dashes for gaps fillers
 *	stxx.addSeries(symbol1, {display:"Description 1",isComparison:true,color:"purple", gapDisplayStyle:{pattern:[3,3]},width:4,permanent:true});
 *	stxx.addSeries(symbol2, {display:"Description 2",isComparison:true,color:"pink", gapDisplayStyle:{pattern:[3,3]},width:4});
 *	stxx.addSeries(symbol3, {display:"Description 3",isComparison:true,color:"brown", gapDisplayStyle:{pattern:[3,3]},width:4});
 *
 * @example
 *	// add the series with only default parameters (no color).
 *	// The series will not display on the chart after it is added,
 *	// but the data will be available ready to be attached to a renderer.
 *	stxx.addSeries(symbol1, {display:"Description 1"});
 *	stxx.addSeries(symbol2, {display:"Description 2"});
 *	stxx.addSeries(symbol3, {display:"Description 3"});
 *
 * @example
 *	// add a series with a color to immediately render. It also calls callbackFunct after the data is returned from the fetch.
 *	function callbackFunct(field){
 *		 return function(err) {
 *			CIQ.alert(field);
 *		}
 *	}
 *
 *	stxx.addSeries(symbol1, {display:"Description",color:"brown"}, callbackFunct(symbol1));
 *
 * @example
 * // add a stacked historam with 3 series usng an external renderer.
 *
 *	// note how the addSeries callback is used to ensure the data is present before the series  is displayed
 *
 * // configure the histogram display
 * var params={
 *	name:				"Sentiment Data",
 *	subtype:			"stacked",
 *	heightPercentage:	.7,	 // how high to go. 1 = 100%
 *	opacity:			.7,  // alternatively can use rgba values in histMap instead
 *	widthFactor:		.8	 // to control space between bars. 1 = no space in between
 * };
 *
 * //legend creation callback
 * function histogramLegend(colors){
 * 	stxx.chart.legendRenderer(stxx,{legendColorMap:colors, coordinates:{x:260, y:stxx.panels["chart"].yAxis.top+30}, noBase:true});
 * }
 *
 * var histRenderer=stxx.setSeriesRenderer(new CIQ.Renderer.Histogram({params: params, callback: histogramLegend}));
 *
 * stxx.addSeries("^NIOALL", {display:"Symbol 1"}, function() {histRenderer.attachSeries("^NIOALL","#6B9CF7").ready();});
 * stxx.addSeries("^NIOAFN", {display:"Symbol 2"}, function() {histRenderer.attachSeries("^NIOAFN","#95B7F6").ready();});
 * stxx.addSeries("^NIOAMD", {display:"Symbol 3"}, function() {histRenderer.attachSeries("^NIOAMD","#B9D0F5").ready();});
 *
 * @example
 * // add a series overlay for data that *already exists in the chart*.
 * By setting loadData to false, the chart will assume the data exists, and not request it from the quotefeed.
 * stxx.addSeries(
 *		"Close",
 *		{color:"purple", loadData:false}
 * );
 *
 * @example
 *	// Add multiple series and attach them all to the same renderer with a custom y-axis on the left.
 *	// See this example working here : https://jsfiddle.net/chartiq/b6pkzrad
 *
 *	// note how the addSeries callback is used to ensure the data is present before the series is displayed
 *
 *    stxx.addSeries(
 *    "NOK",
 *    {
 *      renderer: "Lines", 						// create a line renderer
 *      type: "mountain", 					// of mountain type
 *      yAxis: { 									// and give it its own y axis
 *          position: "left", 					// on the left
 *          textStyle: "#0044FF", 			// with labels of color #0044FF
 *          decimalPlaces: 0,					// no decimal places on the labels
 *          maxDecimalPlaces: 0,			// and no defimal places on the last price floating label either.
 *       },
 *        name: "left_axis_renderer", 	// Call the custom renderer "left_axis_renderer", so it can be referenced by other series.
 *        color: "#FFBE00", 					// Set the line color to "#FFBE00"
 *        width: 4,								// and a width of 4.
 *        display: "NOK Sample",			// Finally, use a different display name of "NOK Sample" on the tooltip.
 *      },
 *      function(){
 *       stxx.addSeries(						// Now that the first series and rederer has been set
 *          "SNE", 									// add the 2nd series using that same renderer.
 *          {
 *            name: "left_axis_renderer",
 *            color: "#FF1300",
 *            display: "Sony Sample",
 *          }
 *        );
 *      }
 *   );
 *
 * @example
 * // add a series with a colored bar renderer; usng default colors
 * stxx.addSeries("MSFT",{renderer:"Bars", colored:true});
 *
 *	@example
 * // add a candle series for GE, and display it's Bid and Ask
 * // (assuming Bid/Ask data is NOT   part of the initial data objects, and can be fetched individually using different instrument IDs)
 * stxx.addSeries('ge',{renderer:'Candles',shareYAxis:true});
 * stxx.addSeries('geBid',{display:'Ge Bid',symbol:'ge',field:'Bid',color:'yellow',renderer:'Lines',shareYAxis:true});
 * stxx.addSeries('geAsk',{display:'Ge Ask',symbol:'ge',field:'Ask',color:'blue',renderer:'Lines',shareYAxis:true});
 *
 * @example
 * // add a series with a candle renderer; using custom colors
 * stxx.addSeries("MSFT",
 *		{
 *			renderer:"Candles",
 *			fill_color_up:"magenta",
 *			border_color_up:"purple",
 *			fill_color_down:"lightgreen",
 *			border_color_down:"green"
 *		}
 * );
 *
 * @example
 * // add a series with Histrogram renderer; using default colors
 * stxx.addSeries('ge', {renderer:"Histogram", color: 'red'});
 *
 * @example
 * // add a series with tension to cause the lines to be curved instead of straight
 * // 'tension' is a line renderer parameter.
 * // the renderer:"Lines" parameter could theoretically be omitted since it is the default renderer.
 * stxx.addSeries('GE',{renderer:"Lines", type:'mountain',color:'yellow',tension:0.3})
 *
 * @example
 * // using equations as symbols, this will display an inverted chart for instrument 'T'
 * // note the formatter used to change the sign of the axis values
 * var axis2=new CIQ.ChartEngine.YAxis(
 * 		{
 * 			position:"left",
 * 			textStyle:"#FFBE00",
 * 			priceFormatter:function(stx, panel, price, decimalPlaces){return stx.formatYAxisPrice(price, panel, decimalPlaces)*-1}
 * 		}
 * );
 *
 * stxx.addSeries("=-1*T", {display:"Test",width:4,renderer:"Lines",color:"#FFBEDD",yAxis:axis2},function(){});
 *
 * //this will display the same series in the standard scale.
 * var axis3=new CIQ.ChartEngine.YAxis({position:"left",textStyle:"#FFBE00"});
 * stxx.addSeries("T", {display:"Test",width:4,renderer:"Lines",color:"#FFBEDD",yAxis:axis3},function(){});
 *
 * @example
 * // add a series that will use its own custom y axis in the left.
 * // note that the renderer does not need to be explicitly declared;
 * // nor does the y axis, since they will only belong to this one series.
 * // The addSeries call will take the pertinent parameters and internally
 * // create the required axis and render objects that will be associated with it.
 * stxx.addSeries("T",
 * 		{
 * 				display:"Test",
 * 				renderer:"Lines",
 * 				type:'mountain',
 * 				color:"#FFBEDD",
 * 				yAxis:{position:"left", textStyle:"#FFBE00"}
 * 		},
 * 		function(){console.log('This is a callback. All done.')}
 * );
 *
 * @example
 *  // Use a renderer to display heatmap datapoints.
 *  // Each attached series will represent a stream of colors for the heatmap.
 *  // Note special data formatting, where the custom field that will be used for the stream of datapoints,
 *  // is an array of values. 'Bids' in this example
 *  var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Heatmap());
 *  stxx.addSeries(
 *   	"L2",
 * 			{ data:[
 *       		{DT:"2019-01-04",Bids:[100,100.3,100.2,101]},
 *       		{DT:"2019-01-07",Bids:[101,101.5,102,103]},
 *       		{DT:"2019-01-08",Bids:[101.2,101.5,101.7,102]},
 *        		{DT:"2019-01-09",Bids:[101.3,101.7,101.9]},
 *       		{DT:"2019-01-10",Bids:[102]}]
 *   		},
 *    	function(){
 *             renderer.attachSeries("L2", {field:"Bids",color:"#FF9300"}).ready();
 *   	}
 *  );
 *
 * @since
 * - 04-2015 If `isComparison` is true shareYAxis is automatically set to true and setComparison(true) called. createDataSet() and draw() are automatically called to immediately render the series.
 * - 15-07-01 If `color` is defined and chartStyle is not set then it is automatically set to "line".
 * - 15-07-01 Ability to use setSeriesRenderer().
 * - 15-07-01 Ability to automatically initialize using the quoteFeed.
 * - 15-07-01 `parameters.quoteFeedCallbackRefresh` no longer used. Instead if `parameters.data.useDefaultQuoteFeed` is set to `true` the series will be initialized and refreshed using the default quote feed. (Original documentation: `{boolean} [parameters.quoteFeedCallbackRefresh]` Set to true if you want the series to use the attached quote feed (if any) to stay in sync with the main symbol as new data is fetched (only available in Advanced package).)
 * - 2015-11-1 `parameters.symbolObject` is now available.
 * - 05-2016-10 `parameters.forceData` is now available.
 * - 09-2016-19 `parameters.data.DT` can also take an epoch number.
 * - 09-2016-19 `parameters.data.useDefaultQuoteFeed` no longer used. If no `parameters.data` is provided the quotefeed will be used.
 * - 3.0.8 `parameters.forceData` no longer used, now all data sent in will be forced.
 * - 3.0.8 `parameters.loadData` added.
 * - 4.0.0 Added `parameters.symbol` (string equivalent of parameters.symboObject).
 * - 4.0.0 Multiple series can now be added for the same underlying symbol. parameters.field or parameters.symbolObject can be used to accomplish this.
 * - 4.0.0 Added `parameters.baseColor`.
 * - 5.1.0 Series data now added to masterData as an object. This allows storage of more than just one data point, facilitating OHLC series!
 * - 5.1.0 addSeries will now create a renderer unless renderer, name and color parameters are all omitted.
 * - 5.1.0 Now also dispatches a "symbolChange" event when pushing data into the chart, rather than only when using a quote feed.
 * - 5.1.1 Added `parameters.extendToEndOfDataSet`.
 * - 5.1.1 `parameters.chartType`, originally used to draw "mountain" series, has been deprecated in favor of the more flexible 'renderer' parameter. It is being maintained for backwards compatibility.
 * - 5.2.0 `parameters.gaps` has been deprecated (but maintained for backwards compatibility) and replaced with `parameters.gapDisplayStyle`.
 * - 6.0.0 `parameters.fillGaps` is now a string type and can accept either "carry" or "gap".  Setting to true will use the value of stxx.cleanupGaps.
 * - 6.2.0 No longer force 'percent'/'linear', when adding/removing comparison series, respectively, unless {@link CIQ.ChartEngine.Chart#forcePercentComparison} is true. This allows for backwards compatibility with previous UI modules.
 * - 6.3.0 If a panel name is passed into the function, a new panel will be created if one doesn't already exist.
 * - 6.3.0 Added `parameters.displayFloatingLabel`.
 */
CIQ.ChartEngine.prototype.addSeries = function (id, parameters, cb) {
	var injectionResult = this.runPrepend("addSeries", arguments);
	if (injectionResult) return injectionResult;
	var display = id ? id : null; // if id is passed then we default display to the same value (we can always override with parameters.display)
	var symbol = id;
	if (!id) id = CIQ.uniqueID();
	if (parameters && parameters.panel === true) parameters.panel = id; // panel name set to boolean true, change it
	var obj = {
		parameters: parameters ? CIQ.clone(parameters) : {},
		yValueCache: [],
		display: display,
		id: id,
		loading: parameters ? parameters.loadData !== false : true
	};
	obj.parameters.yAxis = parameters && parameters.yAxis; // revert the cloning of yaxis
	parameters = obj.parameters;
	if (parameters.symbol) symbol = parameters.symbol;
	if (parameters.isComparison) parameters.shareYAxis = true;
	if (
		parameters.yAxis &&
		!(parameters.yAxis instanceof CIQ.ChartEngine.YAxis)
	) {
		parameters.yAxis = new CIQ.ChartEngine.YAxis(parameters.yAxis); // in case it gets passed as a plain object
	}
	CIQ.ensureDefaults(parameters, {
		chartName: this.chart.name,
		symbolObject: { symbol: symbol },
		panel: this.chart.panel.name,
		fillGaps: false,
		action: "add-series"
	});
	if ("display" in parameters) obj.display = parameters.display;
	var chart = this.charts[parameters.chartName];
	var symbolObject = parameters.symbolObject;
	symbol = parameters.symbol = symbolObject.symbol;
	if (!obj.display) obj.display = symbol || parameters.field; // If after all this time, we still don't have a display, then resort to the reasonable alternative of using the symbol or field
	obj.endPoints = {};

	// backwards compatability for pre 4.0
	if (!parameters.gapDisplayStyle && parameters.gapDisplayStyle !== false)
		parameters.gapDisplayStyle = parameters.gaps;
	if (parameters.isComparison) {
		// if gapDisplayStyle parameters isn't defined the gaps will be rendered transparent
		if (parameters.gapDisplayStyle === undefined)
			parameters.gapDisplayStyle = "transparent";
	}

	var existsAlready = this.getSeries({
		symbolObject: symbolObject,
		chart: chart,
		includeMaster: true
	});

	// if panel doesn't exist, create a new panel
	var panelName = parameters.panel;
	if (!this.panels[panelName]) {
		var yAxis = parameters.yAxis || new CIQ.ChartEngine.YAxis();
		yAxis.name = id; // a way to check if a series "owns" a panel
		this.createPanel(id, panelName, null, null, yAxis);
		if (!this.preferences.dragging || !this.preferences.dragging.series)
			parameters.highlightable = false;
	} else {
		if (!parameters.yAxis && !parameters.shareYAxis) {
			parameters.yAxis = new CIQ.ChartEngine.YAxis({
				name: id,
				position: "none"
			});
		}
	}

	chart.series[id] = obj;
	var self = this,
		currentlyImporting = this.currentlyImporting;

	function setUpRenderer(stx, obj) {
		var renderer = parameters.renderer || "Lines";
		var name = parameters.name || id;
		if (
			parameters.yAxis &&
			!(parameters.yAxis instanceof CIQ.ChartEngine.YAxis) &&
			!currentlyImporting
		)
			parameters.yAxis.name = name;
		if (
			!parameters.renderer &&
			!parameters.name &&
			!parameters.color &&
			!parameters.chartType
		)
			return; // if no renderer, name, color, nor chartType set, assume will be set later on manual call to attachSeries.
		var r = stx.getSeriesRenderer(name);
		if (!r) {
			var params = {
				name: name,
				overChart: parameters.overChart !== false,
				useChartLegend: true,
				highlightable: parameters.highlightable,
				dependentOf: parameters.dependentOf
			};
			if (parameters.chartType) {
				params = CIQ.extend(
					{ panel: parameters.panel, yAxis: parameters.yAxis },
					params
				);
				r = CIQ.Renderer.produce(parameters.chartType, params);
			} else {
				CIQ.ensureDefaults(parameters, {
					name: params.name,
					overChart: parameters.overChart !== false,
					useChartLegend: true
				});
				r = new CIQ.Renderer[renderer]({ params: parameters });
			}
			if (!r) return;
			stx.setSeriesRenderer(r);
		}
		r.attachSeries(id, parameters);
		if (parameters.loadData !== false) r.ready();

		stx.layout.symbols = stx.getSymbols({
			"include-parameters": true,
			"exclude-studies": true
		});
		stx.changeOccurred("layout");
	}

	function handleResponse(params) {
		return function (dataCallback) {
			if (!dataCallback.error) {
				var qts = dataCallback.quotes,
					fillGaps = parameters.fillGaps;
				if (!self.cleanupGaps) fillGaps = false; // disable override
				qts = self.doCleanupGaps(qts, self.chart, { cleanupGaps: fillGaps });
				self.updateChartData(qts, self.chart, {
					secondarySeries: symbol,
					noCreateDataSet: true,
					noCleanupDates: true,
					allowReplaceOHL: true
				});
				obj.loading = false;
				obj.moreAvailable = dataCallback.moreAvailable;
				obj.upToDate = dataCallback.upToDate;
				setUpRenderer(self, obj);
			}
			if (parameters.action !== null && !existsAlready.length)
				self.dispatch(currentlyImporting ? "symbolImport" : "symbolChange", {
					stx: self,
					symbol: params.symbol,
					symbolObject: params.symbolObject,
					action: parameters.action,
					id: obj.id,
					parameters: parameters
				});
			if (cb) cb.call(self, dataCallback.error, obj);
		};
	}

	if (
		parameters.isComparison &&
		chart.forcePercentComparison &&
		parameters.panel == chart.panel.name &&
		(!parameters.yAxis || parameters.yAxis == chart.yAxis)
	)
		this.setChartScale("percent");

	var masterData = chart.masterData;
	if (!masterData) masterData = chart.masterData = this.masterData = [];
	var masterLength = masterData.length;

	if (parameters.data && !parameters.data.useDefaultQuoteFeed /* legacy */) {
		var parms = {
			symbol: symbol,
			symbolObject: symbolObject,
			action: parameters.action
		};
		handleResponse(parms)({ quotes: parameters.data });
	} else if (existsAlready.length) {
		// This symbol is already in the series
		obj.endPoints = existsAlready[0].endPoints;
		setUpRenderer(this, obj);
		if (cb) {
			setTimeout(function () {
				cb.call(self, null, obj);
			}, 0);
		}
	} else if (this.quoteDriver && parameters.loadData !== false) {
		// if we have a quote feed, go and fetch it.
		var driver = this.quoteDriver;
		var fetchParams = driver.makeParams(symbol, symbolObject, chart);
		// for comparisons, you must fetch enough data on the new Comparison to match the beginning of the masterData until the current tick.
		// The current tick may be newer than master data last tick, so set the end Date to right now.
		// If the chart is empty, then don't send any dates and allow the fetch to do an initial load
		if (masterLength) {
			fetchParams.startDate = masterData[0].DT;
			fetchParams.endDate = this.isHistoricalMode()
				? masterData[masterData.length - 1].DT
				: new Date();
		}
		if (fetchParams.stx.isEquationChart(fetchParams.symbol)) {
			//equation chart
			CIQ.fetchEquationChart(fetchParams, handleResponse(fetchParams));
		} else {
			var qf = driver.getQuoteFeed(fetchParams);
			if (qf)
				CIQ.ChartEngine.Driver.fetchData(
					4 /*CIQ.QuoteFeed.SERIES*/,
					qf.engine,
					fetchParams,
					handleResponse(fetchParams)
				);
		}
	} else {
		// It might get in here if we depend on loadDependents to initialize the series, such as from importLayout
		setUpRenderer(this, obj);
		if (cb) cb.call(this, null, obj);
	}

	this.runAppend("addSeries", arguments);

	return obj;
};

/**
 * Returns an array of series that match the given filters.
 *
 * If any series is an equation chart then the equation will be searched for the matching symbol.
 *
 * @param  {object} params Parameters
 * @param {string} [params.symbol] Filter for only series that contain this symbol
 * @param {object} [params.symbolObject] Filter for only series that contain this symbolObject
 * @param {boolean} [params.includeMaster] If true then the masterSymbol will be checked for a match too. A blank object will be returned. You should only use this if you're just using this to look for yes/no dependency on a symbol.
 * @param {CIQ.ChartEngine.Chart} [params.chart] Chart object to target
 * @return {array}        Array of series descriptors
 * @memberOf  CIQ.ChartEngine
 * @since 4.0.0
 */
CIQ.ChartEngine.prototype.getSeries = function (params) {
	var chart = params.chart ? params.chart : this.chart;
	var series = chart.series;
	var symbolObject = params.symbolObject;
	if (!symbolObject) symbolObject = { symbol: params.symbol };
	var arr = [];
	for (var id in series) {
		var sd = series[id];
		if (CIQ.symbolEqual(symbolObject, sd.parameters.symbolObject)) arr.push(sd);
	}
	if (params.includeMaster) {
		if (CIQ.symbolEqual(symbolObject, chart.symbolObject)) arr.push({});
	}
	return arr;
};

/**
 * <span class="injection">INJECTABLE</span>
 * Modifies an existing series. Any passed parameters [extend]{@link CIQ.extend} the existing parameters.
 *
 * @param {string|Object} descriptor Series to modify. Accepts the series object as returned by {@link CIQ.ChartEngine#addSeries} or series ID.
 * @param {Object} [parameters] The parameters to change or add.
 * @param {boolean} [noRecurseDependents] If true, the panel and y-axis changes of the modified series do not propagate to the renderers of dependent series.
 * @return  {Object} The modified series object.
 * @memberof CIQ.ChartEngine
 * @example <caption>Remove a series for a particular symbol.</caption>
 * ```javascript
 * function replaceComparisonColor(stx, symbol, color){
 *     for(var series in stx.chart.series){
 *         var seriesParams=stx.chart.series[series].parameters;
 *         if(seriesParams.isComparison && seriesParams.symbol==symbol){
 *             stx.modifySeries(series, {color:color});
 *         }
 *     }
 *     stx.draw();
 * }
 * ```
 * @since
 * - 5.1.1
 * - 5.2.0 No longer accepts a callback function.
 * - 7.1.0 Returns the modified series.
 * - 7.3.0 Synchronizes panel and y-axis changes with dependent renderers unless the new parameter, `noRecurseDependents`, is set to true.
 */
CIQ.ChartEngine.prototype.modifySeries = function (
	descriptor,
	parameters,
	noRecurseDependents
) {
	if (this.runPrepend("modifySeries", arguments)) return;
	if (!parameters) return;

	var series;
	var id;
	var chart;

	if (typeof descriptor === "string") {
		chart = parameters.chartName
			? this.charts[parameters.chartName]
			: this.chart;
		id = descriptor;
		series = chart.series[id];
	} else {
		series = descriptor;
		id = series.id;
		chart = this.charts[series.parameters.chartName];
	}
	if (!series) return;

	CIQ.extend(series.parameters, parameters);
	var myParams = series.parameters;
	var myRenderer;

	for (var key in chart.seriesRenderers) {
		var renderer = chart.seriesRenderers[key];
		var rParams = renderer.params;
		var seriesParams = renderer.seriesParams;
		for (var i = 0; i < seriesParams.length; ++i) {
			var originalParams = seriesParams[i];
			var sPanel = this.panels[originalParams.panel];
			var yAxisName = sPanel && sPanel.yAxis.name;
			if (originalParams.id === series.id) {
				if (myParams.panel === true)
					myParams.panel = myParams.dependentOf || myParams.name; // panel name set to boolean true, change it
				rParams.panel = myParams.panel;
				if (parameters.yAxis) rParams.yAxis = parameters.yAxis; //  only set series yAxis to renderer if explicitly passed in to function args
				if (
					myParams.panel != originalParams.panel &&
					rParams.name == yAxisName
				) {
					this.electNewPanelOwner(originalParams.panel); // this should only happen once
				} else {
					var oldYAxis = this.getYAxisByName(myParams.panel, rParams.name);
					if (
						oldYAxis &&
						myParams.yAxis &&
						oldYAxis.name !== myParams.yAxis.name
					) {
						oldYAxis.name = this.electNewYAxisOwner(oldYAxis);
					}
				}
				if (!myParams.field) myParams.field = null;
				renderer.attachSeries(id, CIQ.ensureDefaults(myParams, originalParams));
				if (!myParams.field) myParams.field = myParams.subField;
				delete myParams.subField;
				if (
					myParams.isComparison &&
					chart.forcePercentComparison &&
					myParams.panel == chart.panel.name &&
					(!series.parameters.yAxis || myParams.yAxis.name == chart.yAxis.name)
				)
					this.setChartScale("percent");
				myRenderer = renderer;
				break;
			}
		}
	}

	this.changeOccurred("layout");
	CIQ.getFn("Drawing.updateSource")(
		this,
		series.parameters.symbol || id,
		null,
		series.parameters.panel
	);
	this.runAppend("modifySeries", arguments);

	if (noRecurseDependents !== true) {
		// make sure all dependent renderers change their panels and yaxes to match
		var dependentRenderers = myRenderer.getDependents(this);
		for (var n = 0; n < dependentRenderers.length; n++) {
			this.modifySeries(
				dependentRenderers[n].params.name,
				{ panel: myRenderer.params.panel, yAxis: series.parameters.yAxis },
				true
			);
		}

		// make sure all master renderers change their panels and yaxes to match
		var masterRenderer = chart.seriesRenderers[myRenderer.params.dependentOf];
		if (masterRenderer) {
			if (
				masterRenderer.params.yAxis != series.parameters.yAxis ||
				masterRenderer.params.panel != myRenderer.params.panel
			) {
				this.modifySeries(
					myRenderer.params.dependentOf,
					{ panel: myRenderer.params.panel, yAxis: series.parameters.yAxis },
					true
				);
			}
		}
	}

	this.draw();
	return series;
};

/**
 * <span class="injection">INJECTABLE</span>
 * Removes series data from masterData and unregisters the series from `chart.series` without removing it from any associated renderers.
 * Also updates the [quoteFeed subscriptions]{@link quotefeed.unsubscribe}.
 * **Not recommended to be called directly.**
 * Instead use {@link CIQ.ChartEngine#removeSeries} to remove a series from all associated renderers,
 * or {@link CIQ.Renderer#removeSeries} to remove a series from a specific renderer.
 * @param  {string|object} field The name of the series to remove -OR- the series object itself.
 * @param  {CIQ.ChartEngine.Chart} chart The chart to remove from
 * @param {object} [params] Parameters
 * @param {string} [params.action="remove-series"] Action to be dispatched with symbolChange event
 * @memberOf  CIQ.ChartEngine
 * @since
 * - 4.0.0 Now supports passing a series descriptor instead of a field.
 * - 4.0.0 Series data is now totally removed from masterData if no longer used by any other renderers.
 * - 4.0.0 Empty renderers are now removed when series are removed.
 * - 6.3.0 deleteSeries now calls {@link CIQ.ChartEngine#checkForEmptyPanel}.
 */
CIQ.ChartEngine.prototype.deleteSeries = function (field, chart, params) {
	if (this.runPrepend("deleteSeries", arguments)) return;
	params = params ? params : {};
	var action = params.action ? params.action : "remove-series";
	var toRemove;
	if (typeof field === "object") {
		toRemove = field.id;
		chart = chart || this.charts[field.parameters.chartName];
	} else {
		toRemove = field;
		chart = chart || this.chart;
	}
	var theSeries = chart.series[toRemove];
	if (!theSeries) return; // prevent js error if removing a series that doesn't exist
	var loadedData = theSeries.parameters.loadData;
	var symbolObject = theSeries.parameters.symbolObject;
	delete chart.series[toRemove];

	// If no more dependencies, then remove the symbol from the actual masterData
	var dependencies = this.getSeries({
		symbolObject: symbolObject,
		includeMaster: true
	});
	if (loadedData === false) dependencies.push(toRemove);
	if (!dependencies.length) this.cleanMasterData(symbolObject, chart);

	var panel = this.panels[theSeries.parameters.panel];
	if (panel) {
		// panel can be removed before all series can be removed, make sure it still exists
		this.checkForEmptyPanel(panel);
	}

	this.createDataSet();
	if (!dependencies.length)
		this.dispatch(this.currentlyImporting ? "symbolImport" : "symbolChange", {
			stx: this,
			symbol: symbolObject.symbol,
			symbolObject: symbolObject,
			id: toRemove,
			action: action
		});
	if (this.quoteDriver) this.quoteDriver.updateSubscriptions();
	this.runAppend("deleteSeries", arguments);
};

/**
 * <span class="injection">INJECTABLE</span>
 * Detaches a series added using [addSeries]{@link CIQ.ChartEngine#addSeries} from **all associated renderers** in the chart,
 * removing the actual series data from masterData.
 *
 * If the series belonged to a renderer that no longer has other series attached to it, the renderer is removed as well.
 * See {@link CIQ.Renderer#removeSeries} for more details or how to remove a series from a single renderer and without ever deleting the associated renderer or data.
 *
 * To remove all series from a chart, simply iterate through the active series object and delete them one at a time:
 * ```
 * for(var s in stxx.chart.series){
 *    var series=stxx.chart.series[s];
 *    stxx.removeSeries(series);
 * }
 * ```
 * @param  {string|object} field The name of the series to remove -OR- the series object itself.
 * @param  {CIQ.ChartEngine.Chart} [chart] The chart object from which to remove the series
 * @memberof CIQ.ChartEngine
 * @since
 * - 4.0.0 Now supports passing a series descriptor instead of a field.
 * - 4.0.0 Series data is now totally removed from masterData if no longer used by any other renderers.
 * - 4.0.0 Empty renderers are now removed when series are removed.
 */
CIQ.ChartEngine.prototype.removeSeries = function (field, chart) {
	if (this.runPrepend("removeSeries", arguments)) return;

	var toRemove;
	var deleted = false;

	if (typeof field === "object") {
		toRemove = field.id;
		chart = chart || this.charts[field.parameters.chartName];
	} else {
		toRemove = field;
		chart = chart || this.chart;
	}

	for (var r in chart.seriesRenderers) {
		var renderer = chart.seriesRenderers[r];
		var rPanel = this.panels[renderer.params.panel];
		var yAxisName = rPanel && rPanel.yAxis.name;
		for (var sp = renderer.seriesParams.length - 1; sp >= 0; sp--) {
			var series = renderer.seriesParams[sp];
			if (series.id === toRemove) {
				renderer.removeSeries(toRemove);
				if (renderer.seriesParams.length < 1) {
					this.removeSeriesRenderer(renderer);
					if (renderer.params.name == yAxisName) {
						this.electNewPanelOwner(renderer.params.panel);
					} else {
						if (!this.checkForEmptyPanel(renderer.params.panel)) {
							var rendererAxis = this.getYAxisByName(
								rPanel,
								renderer.params.name
							);
							if (rendererAxis) {
								rendererAxis.name =
									rendererAxis.studies[0] || rendererAxis.renderers[1];
							}
						}
					}
				}
				deleted = true;
			}
		}
	}
	if (!deleted) this.deleteSeries(toRemove, chart); // just in case the renderer didn't...
	this.resetDynamicYAxis();
	this.draw();
	this.resizeChart();
	this.runAppend("removeSeries", arguments);
};

/**
 * **The UI portion of this namespace is maintained for legacy implementations only (not using web components). New implementations should use functionality included in the web components (stxUI.js)**<br>
 * Comparison namespace
 * @namespace
 * @name  CIQ.Comparison
 */
CIQ.Comparison = CIQ.Comparison || function () {}; // Create namespace

/**
 * For relative comparisons, this is the starting (baseline) point.
 *
 * Valid options are:
 * - A number to specify an absolute amount to be used as the starting value for all percentage changes.
 * - A string containing the symbol of an existing series to be used as the starting value for the comparisons (for instance "IBM"). Computations will then be based on the change from the first visible bar value for the selected symbol.
 * - An empty string will compare against the baseline value of the main series (same as in "percent" scale).
 *
 * See {@link CIQ.ChartEngine#setChartScale} for more details.
 * @type number | string
 * @memberof CIQ.Comparison
 * @since 5.1.0
 */
CIQ.Comparison.initialPrice = 100;

/**
 * Used to compute the initial price when it is supplied as a string
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @return {number}			The initial price as a number
 * @memberof CIQ.Comparison
 * @since 5.1.0
 * @private
 */
CIQ.Comparison.getInitialPrice = function (chart) {
	if (chart.initialComparisonPrice) return chart.initialComparisonPrice;
	chart.initialComparisonPrice = 100;
	var symbol = CIQ.Comparison.initialPrice;
	if (typeof symbol == "number") chart.initialComparisonPrice = symbol; // absolute amount
	if (typeof symbol == "string") {
		if (chart.series[symbol] || symbol === "") {
			var priceField = "Close";
			if (chart.defaultPlotField) {
				if (!chart.highLowBars) priceField = chart.defaultPlotField;
			}
			for (
				var i = chart.dataSet.length - chart.scroll;
				i < chart.dataSet.length;
				i++
			) {
				var bar = chart.dataSet[i];
				if (bar) {
					if (bar[symbol] && bar[symbol][priceField]) {
						chart.initialComparisonPrice = bar[symbol][priceField];
						break;
					} else if (symbol === "" && bar[priceField]) {
						chart.initialComparisonPrice = bar[priceField];
						break;
					}
				}
			}
		}
	}
	return chart.initialComparisonPrice;
};

/**
 * Transform function for percent comparison charting
 * @param  {CIQ.ChartEngine} stx	  The charting object
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @param  {number} price The price to transform
 * @return {number}			The transformed price (into percentage)
 * @memberof CIQ.Comparison
 */
CIQ.Comparison.priceToPercent = function (stx, chart, price) {
	var baseline = CIQ.Comparison.baseline || price;
	return Math.round(((price - baseline) / baseline) * 100 * 10000) / 10000;
};

/**
 * Untransform function for percent comparison charting
 * @param  {CIQ.ChartEngine} stx	  The charting object
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @param  {number} percent The price to untransform
 * @return {number}			The untransformed price
 * @memberof CIQ.Comparison
 */
CIQ.Comparison.percentToPrice = function (stx, chart, percent) {
	var baseline = CIQ.Comparison.baseline || 1;
	return baseline * (1 + percent / 100);
};

/**
 * Transform function for relative comparison charting
 * @param  {CIQ.ChartEngine} stx	  The charting object
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @param  {number} price The price to transform
 * @return {number}			The transformed price (relative to {@link CIQ.Comparison.initialPrice})
 * @memberof CIQ.Comparison
 * @since 5.1.0
 */
CIQ.Comparison.priceToRelative = function (stx, chart, price) {
	var baseline = CIQ.Comparison.baseline || price;
	var initialPrice = CIQ.Comparison.getInitialPrice(chart);
	return (initialPrice * price) / baseline;
};

/**
 * Untransform function for relative comparison charting
 * @param  {CIQ.ChartEngine} stx	  The charting object
 * @param  {CIQ.ChartEngine.Chart} chart	The specific chart
 * @param  {number} relative The price to untransform
 * @return {number}			The untransformed price
 * @memberof CIQ.Comparison
 * @since 5.1.0
 */
CIQ.Comparison.relativeToPrice = function (stx, chart, relative) {
	var baseline = CIQ.Comparison.baseline || 1;
	var initialPrice = CIQ.Comparison.getInitialPrice(chart);
	return (baseline * relative) / initialPrice;
};

CIQ.Comparison.createComparisonSegmentInner = function (stx, chart) {
	// create an array of the fields that we're going to compare
	var fields = [];
	var field, panel, yAxis;
	for (field in chart.series) {
		var parameters = chart.series[field].parameters;
		if (parameters.isComparison) {
			fields.push(parameters.symbol);
		}
	}
	var priceFields = ["Close", "Open", "High", "Low", "iqPrevClose"];
	var highLowBars = stx.chart.highLowBars;
	if (chart.defaultPlotField && !highLowBars)
		priceFields.unshift(chart.defaultPlotField);
	var baselineField = priceFields[0];
	var s = stx.layout.studies;
	for (var n in s) {
		var sd = s[n];
		panel = stx.panels[sd.panel];
		yAxis = sd.getYAxis(stx);
		if (!panel || panel.yAxis != yAxis) continue;
		for (field in sd.outputMap) priceFields.push(field);
		for (var h = 0; h <= 2; h++)
			priceFields.push(sd.name + "_hist" + (h ? h : ""));
		if (sd.referenceOutput)
			priceFields.push(sd.referenceOutput + " " + sd.name);
	}
	for (var p in stx.plugins) {
		var plugin = stx.plugins[p];
		if (!plugin.transformOutputs) continue;
		for (field in plugin.transformOutputs) {
			priceFields.push(field);
		}
	}

	chart.initialComparisonPrice = null;
	chart.dataSegment = [];
	var firstQuote = null;

	// By default start comparison at the close of the previous bar
	var firstTick = chart.dataSet.length - chart.scroll - 1;
	// Start at first visible bar instead if flag is set
	if (stx.startComparisonsAtFirstVisibleBar) firstTick += 1;

	//if(stx.micropixels+stx.layout.candleWidth/2<0) firstTick++;  // don't baseline comparison with a bar off the left edge
	var transformsToProcess = chart.maxTicks + 3; //make sure we have transformed enough data points that we plot the y-axis intercept correctly

	for (var i = 0; i <= transformsToProcess; i++) {
		if (i == transformsToProcess) i = -1; //go back and revisit the tick before the first
		var position = firstTick + i;
		if (position < chart.dataSet.length && position >= 0) {
			var quote = chart.dataSet[position];
			var closingPrice = quote[baselineField];

			if (!firstQuote) {
				if (closingPrice === 0 || closingPrice === null) {
					if (i < 0) break;
					//if we still can't get a single tick to do this and we try to revisit, we are out, or we go into infinite loop
					else continue; // can't calculate the percentage gain/loss if the close is 0 or null.
				}
				firstQuote = CIQ.clone(quote);
			}

			// iterate through the fields calculating the percentage gain/loss
			// We store the results in the "transform" subobject of the data set
			// Note we inline the math calculation to save overhead of JS function call
			if (!quote.transform)
				quote.transform = {
					cache: {},
					DT: quote.DT,
					Date: quote.Date
				};
			if (!CIQ.Comparison.baseline && closingPrice)
				firstQuote = CIQ.clone(quote);
			CIQ.Comparison.baseline = firstQuote[baselineField];

			var j;
			for (j = 0; j < priceFields.length; j++) {
				field = priceFields[j];
				if (quote[field] || quote[field] === 0)
					//quote.transform[field]=Math.round(((quote[field]-CIQ.Comparison.baseline)/CIQ.Comparison.baseline*100)*10000)/10000;	// first compute the close pct, our baseline
					quote.transform[field] = chart.transformFunc(
						stx,
						chart,
						quote[field]
					);
			}

			// Transform the series
			for (j = 0; j < fields.length; j++) {
				field = fields[j];
				var compSymbol = chart.series[field];
				if (i == -1 && compSymbol && compSymbol.parameters.isComparison) {
					delete quote.transform[field];
					continue;
				}
				var seriesData = quote[field];
				for (var k = 0; seriesData && k < priceFields.length; k++) {
					var seriesPrice = seriesData[priceFields[k]];
					if (seriesPrice || seriesPrice === 0) {
						// Skip blanks
						var baseline =
							firstQuote[field] && firstQuote[field][priceFields[0]];
						if (!baseline && baseline !== 0) {
							// This takes care of a series that starts part way through the chart
							// The baseline is then computed looking back to what it would have been with a 0% change
							if (!firstQuote[field]) firstQuote[field] = {};
							firstQuote[field][priceFields[k]] = baseline =
								(seriesPrice * CIQ.Comparison.baseline) / quote[baselineField];
						}
						if (baseline !== 0) {
							var masterBaseline = CIQ.Comparison.baseline || 1;
							var rationalizedPrice = seriesPrice * (masterBaseline / baseline);
							if (!quote.transform[field]) quote.transform[field] = {};
							quote.transform[field][priceFields[k]] = chart.transformFunc(
								stx,
								chart,
								rationalizedPrice
							);
						}
					}
				}
			}
			chart.dataSegment.push(quote);
		} else if (position < 0) {
			chart.dataSegment.push(null);
		}
		if (i < 0) break; //we revisited tick before first so we are done
	}
};

/**
 * Formats the percentage values on the comparison chart
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {CIQ.ChartEngine.Panel} panel The panel
 * @param  {number} price The raw percentage as a decimal
 * @return {string}		  The percentage formatted as a percent (possibly using localization if set in stx)
 * @memberof CIQ.Comparison
 */
CIQ.Comparison.priceFormat = function (stx, panel, price) {
	if (price === null || typeof price == "undefined" || isNaN(price)) return "";
	var priceTick = panel.yAxis.priceTick;
	var internationalizer = stx.internationalizer;
	if (internationalizer) {
		if (priceTick >= 5) price = internationalizer.percent.format(price / 100);
		else if (priceTick >= 0.5)
			price = internationalizer.percent1.format(price / 100);
		else if (priceTick >= 0.05)
			price = internationalizer.percent2.format(price / 100);
		else if (priceTick >= 0.005)
			price = internationalizer.percent3.format(price / 100);
		else price = internationalizer.percent4.format(price / 100);
	} else {
		if (priceTick >= 5) price = price.toFixed(0) + "%";
		else if (priceTick >= 0.5) price = price.toFixed(1) + "%";
		else if (priceTick >= 0.05) price = price.toFixed(2) + "%";
		else if (priceTick >= 0.005) price = price.toFixed(3) + "%";
		else price = price.toFixed(4) + "%";
	}
	if (parseFloat(price) === 0 && price.charAt(0) == "-") {
		// remove minus sign from -0%, -0.0%, etc
		price = price.substring(1);
	}
	return price;
};

/**
 * Turns comparison charting on or off and sets the transform.
 *
 * Should not be called directly. Either use the {@link CIQ.ChartEngine#addSeries} `isComparison` parameter or use {@link CIQ.ChartEngine#setChartScale}
 *
 * @param {string|boolean} mode Type of comparison ("percent" or "relative").
 *  - Setting to true will enable "percent".
 *  - Setting to "relative" will allow the comparisons to be rendered in relation to any provided 'basis' value. For example, the previous market day close price.
 * @param {CIQ.ChartEngine.Chart} [chart] The specific chart for comparisons
 * @param {number|string} [basis] For a "relative" mode, the basis to relate to.  Can be a number or a string.  If a string, will use the first price in the datasegment for the series keyed by the string.  Sets {@link CIQ.Comparison.initialPrice}.
 * @memberof CIQ.ChartEngine
 * @since
 * - 04-2015 Signature has been revised.
 * - 5.1.0 Signature revised again, added basis.
 * - 5.1.0 `mode` now also supports "relative" to allow comparisons to be rendered in relation to any provided value.
 */
CIQ.ChartEngine.prototype.setComparison = function (mode, chart, basis) {
	if (!chart) chart = this.chart;
	if (typeof chart == "string") chart = this.charts[chart];
	if (basis || basis === "") CIQ.Comparison.initialPrice = basis;
	if (mode === true) {
		// backward compatibility, older versions uses a true/false switch because they did not support the developer setting arbitrary baseline values
		if (chart.isComparison) return; // Do nothing if it's already turned on
		mode = "percent";
	}
	this.resetDynamicYAxis();
	var yAxis = chart.panel.yAxis;
	var wasComparison = yAxis.priceFormatter == CIQ.Comparison.priceFormat; // tests if the current formatter is a comparison formatter
	// this is like testing if the previous mode was "percent"
	switch (mode) {
		case "relative":
			this.setTransform(
				chart,
				CIQ.Comparison.priceToRelative,
				CIQ.Comparison.relativeToPrice
			);
			if (wasComparison) {
				yAxis.priceFormatter = yAxis.originalPriceFormatter
					? yAxis.originalPriceFormatter.func
					: null;
				yAxis.originalPriceFormatter = null;
			}
			yAxis.whichSet = "dataSegment";
			chart.isComparison = true;
			break;
		case "percent":
			this.setTransform(
				chart,
				CIQ.Comparison.priceToPercent,
				CIQ.Comparison.percentToPrice
			);
			if (!wasComparison) {
				yAxis.originalPriceFormatter = { func: yAxis.priceFormatter };
				yAxis.priceFormatter = CIQ.Comparison.priceFormat;
			}
			yAxis.whichSet = "dataSegment";
			chart.isComparison = true;
			break;
		default:
			this.unsetTransform(chart);
			if (wasComparison) {
				yAxis.priceFormatter = yAxis.originalPriceFormatter
					? yAxis.originalPriceFormatter.func
					: null;
				yAxis.originalPriceFormatter = null;
			}
			yAxis.whichSet = "dataSet";
			chart.isComparison = false;
			break;
	}
};

/**
 * Sets the chart scale.
 * @param {string} chartScale
 *  - Available options:
 * 	 - "log"
 * 		> The logarithmic scale can be helpful when the data covers a large range of values – the logarithm reduces this to a more manageable range.
 * 	 - "linear"
 * 		> This is the standard y axis scale; where actual prices are displayed in correlation to their position on the axis, without any conversions applied.
 * 	 - "percent"
 * 		> Calculations for the "percent" scale, used by comparisons, are based on the change between the first visible bar to the last visible bar.
 * 		> This is so you can always see relevant information regardless of period.
 * 		> Let's say you are looking at a chart showing a range for the current month. The change will be the difference from the beginning of the month to today.
 * 		> If you now zoom or change the range to just see this past week, then the change will reflect that change from the first day of the week to today.
 * 		> This is how most people prefer to see change, sine it is dynamically adjusted to the selected range. If you want to see today's change, just load today's range.
 * 		> Keep in mind that there is a difference between the change from the beginning of the day, and the change from the beginning of the trading day. So be careful to set the right range.
 * 	 - "relative"
 * 		> Very similar to 'percent' but the baseline value can be explicitly set.
 * 		> This is useful if you wish to baseline your comparisons on secondary series, or even a hard coded value ( ie: opening price for the day).
 * 		> <br>See {@link CIQ.Comparison.initialPrice} for details on how to set basis for "relative" scale.
 *
 * - Setting to "percent" or "relative" will call {@link CIQ.ChartEngine#setComparison} even if no comparisons are present; which sets `stxx.chart.isComparison=true`.
 * - To check if scale is in percentage mode use `stxx.chart.isComparison` instead of using the {@link CIQ.ChartEngine#chartScale} value.
 * - See {@link CIQ.ChartEngine.Chart#forcePercentComparison} for behavior of automatic scale setting and removal for [comparisons]{@link CIQ.ChartEngine#addSeries}.
 * @memberof CIQ.ChartEngine
 * @since
 * - 4.1.0 Added "percent".
 * - 5.1.0 Added "relative".
 */
CIQ.ChartEngine.prototype.setChartScale = function (chartScale) {
	var chart = this.chart;
	var needsTransform = {
		percent: true,
		relative: true
	};
	if (!chartScale) chartScale = "linear";
	if (needsTransform[chartScale]) {
		this.setComparison(chartScale, chart, CIQ.Comparison.initialPrice);
	} else if (needsTransform[this.layout.chartScale]) {
		this.setComparison(false, chart);
	}
	this.layout.chartScale = chartScale;
	if (chart.canvas) this.draw();
	this.changeOccurred("layout");
};

};

let __js_standard_share_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

/* global html2canvas, requirejs */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

var h2canvas;

/**
 * Manages chart sharing and uploading.
 *
 * See the {@tutorial Chart Sharing} tutorial for more details.
 * @constructor
 * @name CIQ.Share
 */
CIQ.Share = CIQ.Share || function () {};

/**
 * Creates a png image or canvas of the current chart and everything inside the container associated with the chart when it was instantiated; including HTML.
 * Elements outside the chart container will **NOT** be included.
 *
 * It will dynamically try to load `js/thirdparty/html2canvas.min.js` if not already loaded.
 *
 * This function is asynchronous and requires a callback function. The callback will be passed
 * a data object or canvas which can be sent to a server or converted to an image.
 *
 * By default this method will rely on HTML2Canvas to create an image which will rely on Promises. If your browser does not implement Promises, be sure to include a polyfill to ensure HTML2Canvas works properly.
 *
 * **This method does not always work with React or Safari**
 *
 * **Canvases can only be exported if all the contents including CSS images come from the same domain,
 * or all images have cross origin set properly and come from a server that supports CORS; which may or may not be possible with CSS images.**
 *
 * **Note when using the charts from `file:///` make sure to include `html2canvas` statically instead of allowing this method to load it dynamically.**
 * <br>Example:
 * <br>`<script src="js/thirdparty/html2canvas.min.js"></script>`
 *
 *
 * @param {CIQ.ChartEngine} stx   Chart object
 * @param {object} params
 * @param {number} params.width
 * @param {number} params.height
 * @param {string} params.background
 * @param {boolean} params.data If true returns the image data, otherwise, it returns the canvas
 * @param {Array} params.hide Array of strings; array of the CSS selectors of the DOM elements to hide, before creating a PNG
 * @param {Function} cb  Callback when image is available fc(error,data) where data is the serialized image object or canvas
 * @name CIQ.Share.FullChart2PNG
 * @since 4.0.0 Addition of `params.hide`.
 * @version ChartIQ Advanced Package plug-in
 * @private
 */

CIQ.Share.FullChart2PNG = function (stx, params, cb) {
	if (!stx || !stx.chart) return;
	//If we haven't loaded html2canvas, load it
	if (typeof html2canvas === "undefined")
		return loadHTML2Canvas(function () {
			return createHTML2Canvas(stx, params, cb);
		});
	h2canvas = html2canvas;
	createHTML2Canvas(stx, params, cb);
};

function inlineStyle(elem) {
	if (!elem.style) return;
	var styles = getComputedStyle(elem);
	var props = [
		"alignment-baseline",
		"dominant-baseline",
		"fill",
		"fill-opacity",
		"font-family",
		"font-size",
		"font-variant",
		"font-weight",
		"text-align",
		"text-anchor"
	];
	props.forEach(function (i) {
		if (!elem.style[i] && styles[i]) elem.style[i] = styles[i];
	});
	for (var child in elem.children) {
		inlineStyle(elem.children[child]);
	}
}

function createHTML2Canvas(stx, params, cb) {
	if (!params) params = {};
	var recordsTurnedOff = [],
		ciqNoShare = "ciq-no-share",
		body = document.querySelector("body");

	if (params.hide && params.hide instanceof Array) {
		var customHide = params.hide.join(", ");
		var hideItems = document.querySelectorAll(customHide);
		for (var idx = 0; idx < hideItems.length; idx++) {
			hideItems[idx].classList.add(ciqNoShare);
		}
	}
	// Combining ".sharing" and ".ciq-no-share" to display:none for selected elements
	body.classList.add("sharing");

	// explicitly set svg text-related attributes
	var svgs = stx.chart.container.getElementsByTagName("svg");
	var svgOriginalSources = [];
	var svgIndex = 0;
	for (; svgIndex < svgs.length; svgIndex++) {
		var svg = svgs[svgIndex];
		svgOriginalSources.push(svg.innerHTML);
		inlineStyle(svg);
	}

	// Safari does not support SVG pattern fills.  So we skip optimization in html2canvas third party file.
	// (we've modified the resizeImage() function to detect "iPad" in user agent)

	h2canvas(stx.chart.container, {
		allowTaint: false,
		logging: false,
		width: params.width || null,
		height: params.height || null,
		backgroundColor: params.background || null,
		useCORS: true
	})
		.then(function (canvas) {
			if (cb) {
				//return the full canvas if the data param is not true
				cb(null, params.data ? canvas.toDataURL("image/png") : canvas);
			}
			for (svgIndex = 0; svgIndex < svgs.length; svgIndex++) {
				svgs[svgIndex].innerHTML = svgOriginalSources[svgIndex];
			}
			body.classList.remove("sharing");
		})
		.catch(function (error) {
			if (cb) cb(error);
			for (svgIndex = 0; svgIndex < svgs.length; svgIndex++) {
				svgs[svgIndex].innerHTML = svgOriginalSources[svgIndex];
			}
			body.classList.remove("sharing");
		});
}

//Load HTML2Canvas dynamically. If html2canvas.min.js is already loaded (statically, webpacked or with require.js) then this will be skipped.
// HTML2Canvas is rather heavy which is why we provide the option to load dynamically. It isn't really necessary to load this until
// a user actually shares a chart.
function loadHTML2Canvas(cb) {
	//Make sure HTML2Canvas is not already loaded
	if (typeof html2canvas === "undefined") {
		//If we have require, use it
		if (typeof requirejs !== "undefined") {
			try {
				return requirejs(["html2canvas.min.js"], function (h2) {
					h2canvas = h2;
					return cb();
				});
			} catch (exception) {
				console.warn(
					"Require loading has failed, attempting to load html2canvas manually."
				);
			}
		}

		// if no require then load directly
		CIQ.loadScript(getMyRoot() + "html2canvas.min.js", function () {
			h2canvas = html2canvas;
			return cb();
		});
	} else {
		h2canvas = html2canvas;
		return cb();
	}
}

//Get the location of this file. Unbundled, this would be share.js. Bundled, this would be standard.js. When unbundled
//we need to walk back up out of advanced. When bundled we don't need a root because thirdparty should be a relative
//path.
//Set CIQ.Share.html2canvasLocation to completely override this logic.
function getMyRoot() {
	if (CIQ.Share.html2canvasLocation) return CIQ.Share.html2canvasLocation;
	var sc = document.getElementsByTagName("script");
	for (var idx = 0; idx < sc.length; idx++) {
		var s = sc[idx];
		if (s.src && s.src.indexOf("share.js") > -1) {
			return s.src.replace(/standard\/share\.js/, "") + "thirdparty/";
		}
	}
	return "js/thirdparty/";
}

/**
 * Creates a png image of the current chart and everything inside the container associated with the chart when it was instantiated; including HTML.
 * Elements outside the chart container will **NOT** be included.
 *
 * If widthPX and heightPX are passed in then the image will be scaled to the requested dimensions.
 *
 * It will dynamically try to load `js/thirdparty/html2canvas.min.js` if not already loaded.
 *
 * This function is asynchronous and requires a callback function.
 * The callback will be passed a data object or canvas which can be sent to a server or converted to an image.
 *
 * Important Notes:
 * - **This method will rely on Promises. If your browser does not implement Promises, be sure to include a polyfill.**
 *
 * - **This method does not always work with React or Safari**
 *
 * - **Canvases can only be exported if all the contents including CSS images come from the same domain,
 * or all images have cross origin set properly and come from a server that supports CORS; which may or may not be possible with CSS images.**
 *
 * - **When using the charts from `file:///`, make sure to include `html2canvas` statically instead of allowing this method to load it dynamically.**
 * <br>Example:
 * <br>`<script src="js/thirdparty/html2canvas.min.js"></script>`
 *
 * @param  {object}   stx           Chart object
 * @param	 {object}		[parameters]			Parameters to describe the image.
 * @param  {number}   [parameters.widthPX]       Width of image to create. If passed then params.heightPX  will adjust to maintain ratio.
 * @param  {number}   [parameters.heightPX]      Height of image to create. If passed then params.widthPX will adjust to maintain ratio.
 * @param  {string}   [parameters.imageType]   Specifies the file format your image will be output in. The dfault is PNG and the format must be suported by your browswer.
 * @param {Array} 	[parameters.hide] Array of strings; array of the CSS selectors of the DOM elements to hide, before creating a PNG
 * @param  {Function} cb            Callback when image is available fc(data) where data is the serialized image object
 * @memberOf CIQ.Share
 * @since
 * - 3.0.0 Function signature changed to take parameters.
 * - 4.0.0 Addition of `parameters.hide`.
 * @version ChartIQ Advanced Package plug-in
 */
//imageType is in its location so developers don't need to change their current code.
CIQ.Share.createImage = function (stx, params, cb) {
	var args = [].slice.call(arguments);
	cb = args.pop();
	if (params === null || typeof params != "object")
		params = { widthPX: args[1], heightPX: args[2], imageType: args[3] };
	var widthPX = params.widthPX;
	var heightPX = params.heightPX;
	var imageType = params.imageType;

	// Set background for any part of canvas that is currently transparent NO LONGER NECESSARY????
	// CIQ.fillTransparentCanvas(stx.chart.context, stx.containerColor, stx.chart.canvas.width, stx.chart.canvas.height);

	// We use style height/width instead of the canvas width/height when the backing store is 2x on retina screens
	var renderedHeight = stx.chart.canvas.height;
	var renderedWidth = stx.chart.canvas.width;
	if (stx.chart.canvas.style.height) {
		renderedHeight = CIQ.stripPX(stx.chart.canvas.style.height);
		renderedWidth = CIQ.stripPX(stx.chart.canvas.style.width);
	}
	if (widthPX && heightPX) {
		renderedHeight = heightPX;
		renderedWidth = widthPX;
	} else if (heightPX) {
		renderedWidth =
			stx.chart.canvas.width * (renderedHeight / stx.chart.canvas.height);
	} else if (widthPX) {
		renderedWidth = widthPX;
		renderedHeight =
			stx.chart.canvas.height * (widthPX / stx.chart.canvas.width);
	}
	//var totalHeight=renderedHeight;
	var imageResult = imageType ? "image/" + imageType : "image/png";
	// Render the canvas as an image
	var shareImage = document.createElement("img");
	shareImage.onload = function () {
		// Print the image on a new canvas of appropriate size
		CIQ.Share.FullChart2PNG(
			stx,
			{
				image: this,
				width: renderedWidth,
				height: renderedHeight,
				hide: params.hide
			},
			function (err, canvas) {
				if (err) {
					console.warn("Error producing canvas snapshot: " + err);
				} else {
					try {
						cb(canvas.toDataURL(imageResult)); // return the data
					} catch (e) {
						console.warn(
							"Safari devices do not handle CORS enabled images. Using the charts' canvas as a fallback."
						);
						cb(shareImage.src);
					}
				}
			}
		);
	};
	shareImage.src = stx.chart.canvas.toDataURL(imageResult);
};

/**
 * Uploads an image to a server. The callback will take two parameters. The first parameter is an error
 * condition (server status), or null if there is no error. The second parameter (if no error) will contain
 * the response from the server.
 * 'payload' is an optional object that contains meta-data for the server. If payload exists then the image will be added as a member of the payload object, otherwise an object will be created
 * 'dataImage' should be a data representation of an image created by the call canvas.toDataURL such as is returned by CIQ.Share.createImage
 * If you are getting a status of zero back then you are probably encountering a cross-domain ajax issue. Check your access-control-allow-origin header on the server side

 * @param  {string}   dataImage Serialized data for image
 * @param  {string}   url       URL to send the image
 * @param  {object}   [payload]   Any additional data to send to the server should be sent as an object.
 * @param  {Function} cb        Callback when image is uploaded
 * @memberOf CIQ.Share
 * @version ChartIQ Advanced Package plug-in
 */
CIQ.Share.uploadImage = function (dataImage, url, payload, cb) {
	if (!payload) payload = {};
	payload.image = dataImage;
	var valid = CIQ.postAjax(url, JSON.stringify(payload), function (
		status,
		response
	) {
		if (status != 200) {
			cb(status, null);
			return;
		}
		cb(null, response);
	});
	if (!valid) cb(0, null);
};

/**
 * Convenience function that serves as a wrapper for createImage and uploadImage.
 * It will create an image using the default parameters. If you wish to customize the image you must use {@link CIQ.Share.createImage} separately and then call {@link CIQ.Share.uploadImage}.
 * @param {object}	stx Chart Object
 * @param {object}  [override] Parameters that overwrite the default hosting location from https://share.chartiq.com to a custom location.
 * @param {object}	[override.host]
 * @param {object}	[override.path]
 * @param {function}	cb Callback when the image is uploaded.
 * @memberof CIQ.Share
 * @since 2015-11-01
 * @example
 *  // here is the exact code this convenience function is using
	CIQ.Share.createImage(stx, {}, function(imgData){
		var id=CIQ.uniqueID();
		var host="https://share.chartiq.com";
		var url= host + "/upload/" + id;
		if(override){
			if(override.host) host=override.host;
			if(override.path) url=host+override.path+"/"+id;
		}
		var startOffset=stx.getStartDateOffset();
		var metaData={
			"layout": stx.exportLayout(),
			"drawings": stx.exportDrawings(),
			"xOffset": startOffset,
			"startDate": stx.chart.dataSegment[startOffset].Date,
			"endDate": stx.chart.dataSegment[stx.chart.dataSegment.length-1].Date,
			"id": id,
			"symbol": stx.chart.symbol
		};
		var payload={"id": id, "image": imgData, "config": metaData};
		CIQ.Share.uploadImage(imgData, url, payload, function(err, response){
			if(err!==null){
				CIQ.alert("error sharing chart: ",err);
			}else{
				cb(host+response);
			}
		});
		// end sample code to upload image to a server
	});
 *
 */
CIQ.Share.shareChart = function (stx, override, cb) {
	CIQ.Share.createImage(stx, {}, function (imgData) {
		var id = CIQ.uniqueID();
		var host = "https://share.chartiq.com";
		var url = host + "/upload/" + id;
		if (override) {
			if (override.host) host = override.host;
			if (override.path) url = host + override.path + "/" + id;
		}
		var startOffset = stx.getStartDateOffset();
		var metaData = {
			layout: stx.exportLayout(),
			drawings: stx.exportDrawings(),
			xOffset: startOffset,
			startDate: stx.chart.dataSegment[startOffset].Date,
			endDate: stx.chart.dataSegment[stx.chart.dataSegment.length - 1].Date,
			id: id,
			symbol: stx.chart.symbol
		};
		var payload = { id: id, image: imgData, config: metaData };
		CIQ.Share.uploadImage(imgData, url, payload, function (err, response) {
			if (err !== null) {
				CIQ.alert("error sharing chart: ", err);
			} else {
				cb(host + response);
			}
		});
		// end sample code to upload image to a server
	});
};

};

let __js_standard_span_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Used directly by {@link CIQ.ChartEngine#setRange} or indirectly by {@link CIQ.ChartEngine#loadChart}
 *
 * @typedef {Object} CIQ.ChartEngine~RangeParameters
 * @property {Date} [dtLeft] Date to set left side of the chart
 * @property {Date} [dtRight] Date to set right side of the chart
 * @property {number} [padding=0] Whitespace padding in pixels to apply to the right side of the chart after sizing for date range.
 * @property {CIQ.ChartEngine.Chart} [chart] Which chart, defaults to "chart"
 * @property {boolean} [goIntoFuture=false] set the right side of the chart to be in the future
 * @property {boolean} [goIntoPast=false] set the left side of the chart to be in the past
 * @property {CIQ.ChartEngine~PeriodicityParameters} [periodicity] Override a specific periodicity combination to use with the range
 * @property {number} [pixelPerBar] override automatic candle width calculations
 * @property {boolean} [dontSaveRangeToLayout=false] skip saving the range in the layout
 * @property {boolean} [forceLoad=false] a complete load (used by loadChart)
 */

/**
 * Sets a chart to the requested date range.
 *
 * By default, the **Minimum Width** for a bar is `1px`. As such, there may be times when the requested data will not all fit on the screen, even though it is available.
 * See {@link CIQ.ChartEngine#minimumCandleWidth} for instructions on how to override the default to allow more data to display.
 *
 * When a quotefeed is attached to the chart (ver 04-2015 and up), and not enough data is available in masterData to render the requested range, setRange will request more from the feed.
 * Also, if no periodicity (params.periodicity) is supplied in the parameters, **it may	 override the current periodicity** and automatically choose the best periodicity to use for the requested range using the {@link CIQ.ChartEngine#dynamicRangePeriodicityMap} when {@link CIQ.ChartEngine#autoPickCandleWidth} is enabled,
 * or the use of the {@link CIQ.ChartEngine#staticRangePeriodicityMap} object when {@link CIQ.ChartEngine#autoPickCandleWidth} is **NOT** enabled.
 * So depending on your UI, **you may need to use the callback to refresh the periodicity displayed on your menu**.
 *
 * Therefore, if you choose to let setRange set the periodicity, you should **not** call setPeriodicity before or after calling this method.
 *
 * **For details on how this method can affect the way daily data is rolled up, see {@link CIQ.ChartEngine#createDataSet}**
 *
 * **If the chart is in `tick` periodicity, the periodicity will be automatically selected even if one was provided because in `tick` periodicity we have no way to know how many ticks to get to fulfill the requested range.**
 *
 * If there is no quotefeed attached (or using a version prior to 04-2015), then setRange will use whatever data is available in the masterData. So you must ensure you have preloaded enough to display the requested range.
 *
 * This function must be called after loadChart() creates a dataSet.
 *
 * **Layout preservation and the range**
 * <br>The selected range will be recorded in the chart {@link CIQ.ChartEngine#layout} when it is requested through {@link CIQ.ChartEngine#loadChart}, or when you call setRange directly.
 * <br>It is then used in {@link CIQ.ChartEngine#importLayout} and {@link CIQ.ChartEngine#loadChart} to reset that range, until a new range is selected.
 *
 * @param {CIQ.ChartEngine~RangeParameters} params  Parameters for the request
 * @param {Date} [params.dtLeft] Date to set left side of chart. If no left date is specified then the right edge will be flushed, and the same interval and period will be kept causing the chart to simply scroll to the right date indicated.<BR> **Must be in the exact same time-zone as the `masterdata`.** See {@link CIQ.ChartEngine#setTimeZone} and {@link CIQ.ChartEngine#convertToDataZone} for more details. <BR> If the left date is not a valid market date/time, the next valid market period forward will be used.
 * @param {Date} [params.dtRight] Date to set right side of chart. Defaults to right now. <BR> **Must be in the exact same time-zone as the `masterdata`.** See {@link CIQ.ChartEngine#setTimeZone} and {@link CIQ.ChartEngine#convertToDataZone} for more details. <BR> If the right date is not a valid market date/time, the next valid market period backwards will be used.
 * @param {number} [params.padding] Whitespace padding in pixels to apply to right side of chart after sizing for date range. If not present then 0 will be used.
 * @param {CIQ.ChartEngine.Chart} [params.chart] Which chart, defaults to "chart"
 * @param {boolean} [params.goIntoFuture] If true then the right side of the chart will be set into the future if dtRight is greater than last tick. See {@link CIQ.ChartEngine#staticRange} if you wish to make this your default behavior.
 * @param {boolean} [params.goIntoPast] If true then the left side of the chart will be set into the past if dtLeft is less than first tick. See {@link CIQ.ChartEngine#staticRange} if you wish to make this your default behavior.
 * @param {CIQ.ChartEngine~PeriodicityParameters} [params.periodicity] Override a specific periodicity combination to use with the range. Only available if a quoteFeed is attached to the chart. Note: if the chart is in tick periodicity, the periodicity will be automatically selected even if one was provided because in tick periodicity we have no way to know how many ticks to get to fulfill the requested range. If used, all 3 elements of this object must be set.
 * @param {Number} params.periodicity.period Period as used by {@link CIQ.ChartEngine#setPeriodicity}
 * @param {string} params.periodicity.interval An interval as used by {@link CIQ.ChartEngine#setPeriodicity}
 * @param {string} params.periodicity.timeUnit A timeUnit as used by {@link CIQ.ChartEngine#setPeriodicity}
 * @param {Number} params.pixelsPerBar] Optionally override this value so that the auto-periodicity selected chooses different sized candles.
 * @param {boolean} params.dontSaveRangeToLayout If true then the range won't be saved to the layout.
 * @param {boolean} [params.forceLoad] Forces a complete load (used by loadChart)
 * @param {Function} [cb] Callback method. Will be called with the error returned by the quotefeed, if any.
 * @memberOf CIQ.ChartEngine
 * @since
 * - 04-2015 Added `params.rangePeriodicityMap` and `params.periodicity` as well as automatic integration with {@link quotefeed}.
 * - 2016-05-10 Deprecated `params.rangePeriodicityMap` in favor of new automatic algorithm.
 * - m-2016-12-01 Restored logic to reference a periodicity map. Similar to previous `params.rangePeriodicityMap`. See {@link CIQ.ChartEngine#staticRangePeriodicityMap} for details.
 * - m-2016-12-01 Modified automatic periodicity algorithm. See {@link CIQ.ChartEngine#dynamicRangePeriodicityMap} and {@link CIQ.ChartEngine#autoPickCandleWidth} for details.
 * - 4.0.0 Now uses {@link CIQ.ChartEngine#needDifferentData} to determine if new data should be fetched.
 * - 4.0.0 No longer defaulting padding to current value of `preferences.whiteSpace`.
 * - 5.1.0 Added `params.dontSaveRangeToLayout`.
 * - 5.1.0 The selected range will be recorded in the chart {@link CIQ.ChartEngine#layout} when it is requested through {@link CIQ.ChartEngine#loadChart}, or when you call setRange directly.
 * - 5.2.0 `params.forceLoad` is now an option to force loading of new data.
 * @example
 * <caption>Display all of the available data in the current chart periodicity.</caption>
 * stxx.setRange({
 *     dtLeft: stxx.chart.dataSet[0].DT,
 *     dtRight: stxx.chart.dataSet[stxx.chart.dataSet.length - 1].DT,
 *     periodicity:{period:stxx.layout.periodicity,interval:stxx.layout.interval,timeUnit:stxx.layout.timeUnit}
 * });
 */
CIQ.ChartEngine.prototype.setRange = function (params, cb) {
	if (CIQ.isEmpty(params)) {
		// Handle legacy argument list implementation
		params = {
			dtLeft: arguments[0],
			dtRight: arguments[1],
			padding: arguments[2],
			chart: arguments[3]
		};
		cb = arguments[4];
	}
	if (this.staticRange) {
		params.goIntoPast = params.goIntoFuture = true;
	}

	if (!params.chart) params.chart = this.chart;
	if (typeof params.padding == "undefined") {
		// if no whitespace sent in, maintain existing ( different than sending 0 which will set to no whitespace )
		params.padding = 0;
	}
	var dontChangePeriodicity = false;
	var chart = params.chart;
	var lt =
		typeof params.dtLeft === "string" ? new Date(params.dtLeft) : params.dtLeft; // just in case a string date is passed in
	var rt = new Date();
	if (params.dtRight)
		rt =
			typeof params.dtRight === "string"
				? new Date(params.dtRight)
				: params.dtRight;
	var iter;
	if (!lt) {
		// If no left date then we want to just flush the right edge, and keep the same interval,period
		iter = this.standardMarketIterator(rt, null, chart);
		lt = iter.previous(chart.maxTicks);
		if (!params.periodicity) dontChangePeriodicity = true;
	}
	chart.inflectionPoint = lt; //  this is where consolidation originates in either direction

	this.layout.range = { dtLeft: lt, dtRight: rt };

	var self = this;
	function showTheRange(err) {
		if (typeof err == "undefined") err = null;

		var l = 0,
			r = 0;
		var todaysDate = new Date();
		var base = params.base;
		var periodicity = params.periodicity;
		var layout = self.layout;

		if (
			params.goIntoFuture &&
			(!chart.masterData.length ||
				lt > chart.masterData[chart.masterData.length - 1].DT)
		) {
			// we're displaying entirely in the future, fill gap
			var leftmost = chart.masterData.length
				? chart.masterData.pop()
				: { DT: lt };
			var gapData = self.doCleanupGaps([leftmost, { DT: rt }], chart, {
				cleanupGaps: "gap",
				noCleanupDates: true
			});
			self.setMasterData(chart.masterData.concat(gapData), chart, {
				noCleanupDates: true
			});
			self.createDataSet(null, null, { appending: true });
		}
		var dataSet = chart.dataSet;
		var dsLength = dataSet.length;

		if (!dataSet || dsLength === 0) {
			if (cb) cb(err);
			return;
		}

		var leftBar;
		// range is day and interval is day
		if (base === "day" && periodicity && periodicity.interval === "day") {
			var multiplier = params.multiplier;
			// left bar is how many days the range is, or beginning of dataset
			l = dsLength < multiplier ? 0 : dsLength - multiplier;
			r = dsLength - 1;
		}
		// if intraday range and last day in dataSet is older than current day then show previous day's data
		else if (
			base === "today" &&
			dataSet[dsLength - 1].DT.getDate() < todaysDate.getDate()
		) {
			var leftDT = new Date(dataSet[dsLength - 1].DT.getTime());
			var rightDT = leftDT.getTime(); // copy starting time
			leftBar = 0;

			for (var d = dsLength - 1; d >= 0; d--) {
				if (dataSet[d] && dataSet[d].DT.getDate() != leftDT.getDate()) {
					leftDT = new Date(+dataSet[d + 1].DT);
					leftBar = d + 1;
					break;
				}
			}
			l = leftBar;
			r = dsLength - 1;
		} else {
			if (
				params.base != "all" &&
				(lt.getTime() >= dataSet[0].DT.getTime() || params.goIntoPast)
			) {
				l = self.tickFromDate(lt, chart, null, true);
			} else {
				l = 0;
			}
			if (
				params.base != "all" &&
				(rt.getTime() <= dataSet[dsLength - 1].DT.getTime() ||
					params.goIntoFuture)
			) {
				r = self.tickFromDate(rt, chart);
				if (r > dsLength - 1) r--; // do not include tick from any end date
			} else {
				r = dsLength - 1;
			}
		}
		var ticks = r - l + 1;

		if (ticks < 1) {
			if (cb) cb(err);
			return;
		}

		var padding = params.padding || 0;
		if (r < dsLength - 1) padding = 0;
		//var barsHaveWidth=self.mainSeriesRenderer && self.mainSeriesRenderer.barsHaveWidth;
		var newCandleWidth = (chart.width - padding) / ticks; //*(barsHaveWidth?1:(1-1/(2*ticks)));  // deduct 1/2 the proposed candlewidth for the micropixel offset for line type charts
		self.setCandleWidth(newCandleWidth, chart);
		chart.scroll = ticks - (r - dsLength) - 1;
		self.micropixels = 1; // this is done to allow crosshairs over first tick when candles are small
		// line-type charts go center-to-center in the data point space, so we end up with 1/2 a candle empty on the left and the right..
		//if(!barsHaveWidth) self.micropixels+=newCandleWidth/2; // line charts display to middle of candle
		for (var p in self.panels) self.calculateYAxisMargins(self.panels[p].yAxis);

		// only save the range for direct calls to setRange
		if (!params.dontSaveRangeToLayout) {
			delete params.chart; // having the chart in there causes an issue with cloning
			delete layout.setSpan; // range and setSpan are mutually exclusive
			layout.range = params; // save the range in the layout to be able to restore
		} else {
			// setRange called from setSpan, remove range from layout
			delete layout.range;
		}

		self.draw();
		self.changeOccurred("layout");
		if (cb) cb(err);
	}

	var loadMoreCount = 0; // safety valve to eliminate infinite loop
	function loadTheRange(err) {
		if (err && loadMoreCount === 0) {
			// change the periodicity, scroll and candle width back to original chart values
			// if our initial fetch from the quotedriver failed.
			chart.scroll = previousScroll;
			self.setCandleWidth(previousCandleWidth);
			self.layout.interval = previousInterval;
			self.layout.periodicity = previousPeriodicity;
			self.layout.timeUnit = previousTimeUnit;
			if (cb) cb(err);
			return;
		}
		loadMoreCount++;
		if (loadMoreCount > 10) {
			console.log(
				"CIQ.ChartEngine.setRange(): Too many loads (10) from server. Stopping. Check periodicity logic."
			);
			showTheRange();
			return;
		}
		// Removed - we should never need to fetch more data after requesting a span
		// Moreover, this created issues when setting a date only and fetching an intraday span -
		// code was being entered anyway since the masterData[0] was market open and lt was midnight.
		/*if(chart.moreAvailable && chart.masterData[0] && chart.masterData[0].DT>lt){
				self.quoteDriver.checkLoadMore(chart, true, false, function(err){
					if(!err)
						loadTheRange();
					else
						showTheRange(err); // if there was an error on a subsequent fetch, then show as much as we were able to get.
				},true);
			}else{*/
		showTheRange();
		//}
	}

	function estimateMaxTicks(rtMS, ltMS, interval, period, timeUnit, dontRoll) {
		// how many ticks do we need at the requested periodicity to fill the screen
		var ticks = 0;
		var ms = rtMS - ltMS;
		if (CIQ.ChartEngine.isDailyInterval(interval)) {
			if (interval == "month") {
				ticks = ms / CIQ.MONTH / period;
			} else if (interval == "week") {
				ticks = ms / CIQ.WEEK / period;
			} else {
				ticks = ms / CIQ.DAY / period;
			}
		} else {
			if (!isNaN(interval)) {
				if (timeUnit == "millisecond") ticks = ms / (period * interval);
				else if (timeUnit == "second")
					ticks = ms / CIQ.SECOND / (period * interval);
				else ticks = ms / CIQ.MINUTE / (period * interval);
			}
		}
		return Math.round(ticks); // rough estimation...
	}

	if (this.quoteDriver) {
		var intervalToUse, periodToUse, timeUnitToUse;
		if (dontChangePeriodicity) {
			intervalToUse = this.layout.interval;
			timeUnitToUse = this.layout.timeUnit;
			periodToUse = this.layout.periodicity;
		} else if (params.periodicity) {
			// If the caller specifies the periodicity then we use that
			var internalPeriodicity = CIQ.cleanPeriodicity(
				params.periodicity.period,
				params.periodicity.interval,
				params.periodicity.timeUnit
			);
			intervalToUse = internalPeriodicity.interval;
			timeUnitToUse = internalPeriodicity.timeUnit;
			periodToUse = internalPeriodicity.period;
		} else {
			// Set the periodicity according to the staticRangePeriodicityMap
			// This will check the milliseconds of each range and choose the proper width
			var rangeInMS = rt.getTime() - lt.getTime();
			if (!this.autoPickCandleWidth.turnOn) {
				var periodicityMap = this.staticRangePeriodicityMap;

				var entryToUse = null;
				// Cycle through the periodicity map looking for the closest fit
				for (var i = 0; i < periodicityMap.length; i++) {
					var mapEntry = periodicityMap[i];

					if (rangeInMS / mapEntry.rangeInMS < 1.001) {
						// inexact due to quote updates
						entryToUse = mapEntry;
						break;
					}
				}
				intervalToUse = entryToUse.interval;
				periodToUse = entryToUse.periodicity;
				timeUnitToUse = entryToUse.timeUnit;
			} else {
				// Calculate the best periodicity dynamically according to the intervals
				// set in dynamicRangePeriodicityMap
				var pixelsPerBar = 0;

				// use candlewidth set in the chart
				if (this.autoPickCandleWidth.candleWidth) {
					pixelsPerBar = this.autoPickCandleWidth.candleWidth;
				}
				// else choose candlewidth according to chart type
				else {
					pixelsPerBar = this.chart.barsHaveWidth ? 5 : 2;
				}

				var numBars = chart.width / pixelsPerBar;

				var possibleIntervals = this.dynamicRangePeriodicityMap;

				// default
				intervalToUse = possibleIntervals[0].interval;
				periodToUse = 1;

				var numBarsLastInterval;
				for (var j = 0; j < possibleIntervals.length; j++) {
					var numBarsThisInterval = rangeInMS / possibleIntervals[j].rangeInMS;
					if (numBarsThisInterval < numBars) {
						if (possibleIntervals[j - 1]) {
							intervalToUse = possibleIntervals[j - 1].interval;
							timeUnitToUse = possibleIntervals[j - 1].timeUnit;
							periodToUse = Math.ceil(numBarsLastInterval / numBars);
						} else {
							intervalToUse = possibleIntervals[j].interval;
							timeUnitToUse = possibleIntervals[j].timeUnit;
							periodToUse = 1;
						}
						break;
					}
					numBarsLastInterval = numBarsThisInterval;
				}
			}
		}

		// maintain the previous values just in case an error is thrown when getting new data
		var previousScroll = this.chart.scroll;
		var previousCandleWidth = this.layout.candleWidth;
		var previousInterval = this.layout.interval;
		var previousPeriodicity = this.layout.periodicity;
		var previousTimeUnit = this.layout.timeUnit;

		// to prevent multiple fetches trying to get enough ticks for the selected range;
		// maxticks,scroll and  candleWidth are used in CIQ.ChartEngine.Driver.barsToFetch and checkLoadMore() to deduce the number of ticks to fill the screen.
		// So we need to set it here to prevent us from using the pre-setRange  values which are not going to be right.
		// these are estimated, for the fetch, but will be properly recalculated by showTheRange();
		this.chart.scroll = this.chart.maxTicks = estimateMaxTicks(
			rt.getTime(),
			lt.getTime(),
			intervalToUse,
			periodToUse,
			timeUnitToUse,
			this.dontRoll
		);
		this.layout.candleWidth = this.chart.width / this.chart.maxTicks;

		// logic to determine whether we have the right interval for what is needed
		var needDifferentData = this.needDifferentData({
			period: periodToUse,
			interval: intervalToUse,
			timeUnit: timeUnitToUse
		});

		// if we need data from before what we have, fetch new data
		if (
			Object.keys(this.chart.endPoints).length &&
			(this.chart.endPoints.begin > lt || this.chart.endPoints.end < rt)
		)
			needDifferentData = true;

		if (
			!this.chart.masterData ||
			!this.chart.masterData.length ||
			needDifferentData ||
			params.forceLoad
		) {
			this.layout.interval = intervalToUse;
			this.layout.periodicity = periodToUse;
			this.layout.timeUnit = timeUnitToUse;
			if (!this.layout.timeUnit) {
				if (CIQ.ChartEngine.isDailyInterval(this.layout.interval))
					this.layout.timeUnit = null;
				else if (this.layout.interval == "second")
					this.layout.timeUnit = "second";
				// backward compatibility with heatmap
				else if (this.layout.interval != "tick")
					this.layout.timeUnit = "minute";
			}
			var qparams = {
				symbol: chart.symbol,
				symbolObject: chart.symbolObject,
				chart: chart,
				nodraw: true
			};

			if (this.layout.interval == "tick") {
				// for 'tick' periodicity we have to request a specific range instead of # of ticks,
				//since we can never be sure how many ticks will be in a particular range.
				qparams.startDate = lt;
				qparams.endDate = rt;
			}

			if (!this.displayInitialized) qparams.initializeChart = true; //This does not mean loadChart()

			var behaviorParams = {
				symbol: chart.symbol,
				symbolObject: chart.symbolObject,
				interval: this.layout.interval
			};
			if (
				(behaviorParams.interval == "month" ||
					behaviorParams.interval == "week") &&
				!this.dontRoll
			) {
				behaviorParams.interval = "day";
			}
			var minOffset = Math.max(
				this.quoteDriver.getQuoteFeed(behaviorParams).behavior.bufferSize + 50,
				200
			); // ensure we have some data off page for continuity sake and ease of scrolling, while also accounting for about 50 possible gaps in the buffer zone.  Otherwise we end up paginating if there's a gap.
			iter = this.standardMarketIterator(lt, null, chart);
			qparams.startDate = new Date(iter.previous(minOffset).getTime());

			iter = this.standardMarketIterator(rt, null, chart);
			qparams.endDate = new Date(iter.next(minOffset).getTime());
			if (qparams.endDate < Date.now()) this.isHistoricalModeSet = true;

			this.clearCurrentMarketData(this.chart);
			clearTimeout(this.streamParameters.timeout);
			this.quoteDriver.newChart(qparams, loadTheRange);
		} else {
			if (
				this.layout.interval != intervalToUse ||
				this.layout.periodicity != periodToUse ||
				this.layout.timeUnit != timeUnitToUse ||
				!this.chart.dataSegment ||
				!this.chart.dataSegment[0] ||
				this.chart.dataSegment[0].DT != chart.inflectionPoint
			) {
				this.layout.interval = intervalToUse;
				this.layout.periodicity = periodToUse;
				this.layout.timeUnit = timeUnitToUse;
				this.createDataSet();
			}
			loadTheRange();
		}
	} else {
		showTheRange();
	}
};

/**
 * Used directly by {@link CIQ.ChartEngine#setSpan} or indirectly by {@link CIQ.ChartEngine#loadChart}
 *
 * @typedef {Object} CIQ.ChartEngine~SpanParameters
 * @property {string} base span to show; valid values are "minute", "day", "week", "month", "year", "all", "ytd", or "today"
 * @property {number} multiplier Number of base units to show
 * @property {boolean} [maintainPeriodicity=false] do not calculate a new periodicity
 * @property {number} [padding=0] whitespace in pixels to apply to the right side of the chart
 * @property {boolean} [forceLoad=false] force a complete load (used by loadChart)
 * @property {CIQ.ChartEngine.Chart} [chart] Which chart, defaults to "chart"
 */

/**
 * Sets the chart to display the requested time span.
 *
 * By default, the **minimum width** for a bar is `1px`. As such, there may be times when the requested data will not all fit on the screen, even though it is available.
 * See {@link CIQ.ChartEngine#minimumCandleWidth} for instructions on how to override the default to allow more data to display.
 *
 * setSpan makes use of {@link CIQ.ChartEngine#setRange} by converting the span requested into a date range.
 * All parameters in setSpan will be sent into setRange (except if 'all' is requested), so you can pre-load things like `params.periodicity` in setSpan for setRange to use.
 *
 * Example:
 * <pre>
 * stxx.setSpan({
 * 	multiplier: 5,
 * 	base: "day",
 * 	padding: 30,
 * 	// pre load a parameter for setRange
 * 	periodicity: {
 * 		period: 1,
 * 		interval: 5,
 * 		timeUnit: 'minute'
 * 	}
 * });
 * </pre>
 *
 * Just keep in mind that if passing `periodicity.period` , `periodicity.timeUnit` and `periodicity.interval` to be used in {@link CIQ.ChartEngine#setRange} , then **DO NOT** set `maintainPeriodicity`. Otherwise, the requested periodicity will be ignored.
 *
 * If a quotefeed is attached to the chart (ver 04-2015 and up), setSpan will attempt to gather more data from the feed (IF NEEDED) to fulfill the requested range AND **may override the periodicity** to provide the most optimal chart display.
 * So depending on your UI, **you may need to use the callback to refresh the periodicity displayed on your menu**.
 * Please see {@link CIQ.ChartEngine#setRange} and {@link CIQ.ChartEngine#displayAll} for complete details on how the periodicity is calculated.
 * <br>If there is no quotefeed attached (or using a version prior to 04-2015), then setStan will use whatever data is available in the masterData. So you must ensure you have preloaded enough to display the requested range.
 *
 * Calling {@link CIQ.ChartEngine#setPeriodicity} immediately after setting a span may cause all of the data to be re-fetched at a different periodicity than the one used by the requested span. Once you have set your initial periodicity for the chart, there is no need to manually change it when setting a new span unless you are using the `params.maintainPeriodicity` flag; in which case you want to call `setPeriodicity` **before** you set the span, so the setSpan call will use the pre-set periodicity.
 * <br>Setting a span to `params.multiplier:7` `params.base:'days'` or `params.multiplier:1` `params.base:'week'`, for example, is really the same thing; same span of time. If what you are trying to do is tell the chart how you want the raw data to be fetched, that is done with {@link CIQ.ChartEngine#setPeriodicity} or by letting setSpan figure it out as described above.
 * <br>Remember that by default, weekly and monthly data is calculated using daily raw ticks. If your feed returns data already rolled up in monthly or weekly ticks, you can override this behavior by setting `stxx.dontRoll` to `true` ( see {@link CIQ.ChartEngine#dontRoll}  and the {@tutorial Periodicity} tutorial)
 *
 * This function must be called **after** loadChart() completes and creates a dataSet, or together with loadChart() by setting the proper parameter values.
 * If calling separately right after loadChart(), be sure to call it in the loadChart() callback!.
 * See example in this section and {@link CIQ.ChartEngine#loadChart} for more details and compatibility with your current version.
 *
 * Be aware that {@link CIQ.ChartEngine.Chart#allowScrollPast} and {@link CIQ.ChartEngine.Chart#allowScrollFuture} must be set to true if you wish to display "white space" in cases where the range requested is larger than the available data.
 * Especially when using "today" and the base.
 *
 * **Layout preservation and the span**
 * <br>If `maintainPeriodicity` is not set, the selected span will be recorded in the chart {@link CIQ.ChartEngine#layout} when it is requested through {@link CIQ.ChartEngine#loadChart}, or when you call setSpan directly.
 * <br>It is then used in {@link CIQ.ChartEngine#importLayout} and {@link CIQ.ChartEngine#loadChart} to reset that span, until a new periodicity is selected.
 *
 * **Note:** versions prior to '2015-05-01' must use the legacy arguments : setSpan(multiplier, base, padding, char,useMarketTZ,cb), and related example in this section.
 *
 * @param {CIQ.ChartEngine~SpanParameters} params Parameter for the function
 * @param {number} params.multiplier   Number of base units to show. To show 3 weeks of data, for example, set this to 3 and `params.base` to 'week'.
 * @param {string} params.base The base span to show. "minute", "day", "week", "month", "year", "all", "ytd" or "today".
 * <br><br>Except when using "today", this base will be combined with the multiplier. Example 2 days, 4 months.
 * <br><br>**Spans are market hours sensitive**, so if you ask for 1 hour, for example, at the time the markets are close,
 * the span will find the last time the markets where open for the active symbol, and include the last market hour in the span.
 * It will also exclude days when the market is closed.
 * - If 'all' data is requested, {@link CIQ.ChartEngine#displayAll} is called first to ensure all quotefeed data for that particular instrument is loaded. Note that 'all' will display the data in `monthly` periodicity unless otherwise specified. Please note that "all" will attempt to load all of the data the quotefeed has available for that symbol. Use this span with caution.
 * - If 1 'day' is requested --on market days--the chart will start from the same time on the previous market day, which may be over a weekend. Example from 3:30 PM Friday to 3:30 PM Monday, if the market is closed Saturday and Sunday.
 * - If 1 'day' is requested --on weekends and holidays-- or if 2 or more days are requested, the chart will always start from market open of prior days.
 * - If 'today' is requested --during the market day -- the chart will display the current market day but, if {@link CIQ.ChartEngine.Chart#allowScrollFuture} is also enabled, extend the chart all the way to market close (as per market hours set in the active market definition - see {@link CIQ.Market})
 * - If 'today' is requested --before the market is open --the chart will display the previous  market day.
 * - If 'today' is requested --after the current market day closes --the chart will display the current  market day.
 * @param {boolean} [params.maintainPeriodicity] If set to true, it will maintain the current periodicity for the chart instead of trying to select the most optimal periodicity for the selected range. See {@link CIQ.ChartEngine#setRange} for details.
 * <br>**Note:** if the chart is in `tick` periodicity, the periodicity will be automatically selected even if it was requested to be maintained because in `tick` periodicity we have no way to know how many ticks to get to fulfill the requested range.
 * @param {number} [params.padding] Whitespace padding in pixels to apply to right side of chart after sizing for date range. If not set will default whitespace to 0.
 * @param {boolean} [params.forceLoad] Forces a complete load (used by loadChart)
 * @param {CIQ.ChartEngine.Chart} [params.chart] Which chart, defaults to "chart"
 * @param {Function} cb Optional callback
 * @memberOf CIQ.ChartEngine
 * @example
 * // this displays 5 days. It can be called anywhere including buttons on the UI
 *	stxx.setSpan ({
 *		multiplier: 5,
 *		base: "day",
 *		padding: 30
 *	});
 * @example
 * // using embedded span requirements on a loadChart() call.
 * stxx.loadChart({symbol: newSymbol, other: 'stuff'}, {
 * 	span: {
 * 		base: 'day',
 * 		multiplier: 2
 * 	},
 * }, callbackFunction());
 * @example
 * // Calling setSpan in the loadChart() callback to ensure synchronicity.
 * stxx.loadChart({symbol: newSymbol, other: 'stuff'}, function() {
 * 	stxx.setSpan({
 * 		multiplier: 5,
 * 		base: "day",
 * 		padding: 30
 * 	});
 * });
 * @since
 * - 04-2015 Added "all", "today", "ytd" and automatic integration with {@link quotefeed}.
 * - 15-07-01 Changed `params.period` to `params.multiplier` for clarity.
 * - 15-07-01 Changed `params.interval` to `params.base` for clarity.
 * - 05-2016-10 Saves the set span in stxx.layout to be restored with the layout between sessions.
 * - 4.0.3 Saves all parameters of the requested span in stxx.layout to be restored with the layout between sessions. Previously only `multiplier` and `base` were saved.
 * - 5.0.0 When 1 'day' is requested data displayed will differ if current day is market day or the market is closed to ensure the span will have enough data.
 */
CIQ.ChartEngine.prototype.setSpan = function (params, cb) {
	var period = arguments[0];
	var interval = arguments[1];
	var padding = arguments[2];
	var chart = arguments[3];

	if (typeof params == "object") {
		period = params.period
			? params.period
			: params.multiplier
			? params.multiplier
			: 1;
		interval = params.interval
			? params.interval
			: params.base
			? params.base
			: params.span
			? params.span
			: params.period;
		padding = params.padding;
		chart = params.chart;
	} else {
		params = {
			period: period,
			interval: interval,
			padding: padding,
			chart: chart
		};
		cb = arguments[5];
	}
	// Do not force padding to 0 on setSpan
	//if(!params.padding) params.padding=0;

	if (!chart) chart = this.chart;
	var market = chart.market;

	interval = interval.toLowerCase();
	if (interval == "all") {
		params.dontSaveRangeToLayout = true;
		this.displayAll(params, cb);
		return;
	}
	var iter;
	var iterInterval = interval;
	var iterPeriod = 1;
	if (interval == "today") {
		iterInterval = "day";
	} else if (interval == "year") {
		iterInterval = "month";
		iterPeriod = 12;
	}

	var parms_copy = CIQ.shallowClone(params);

	var iter_parms = {
		begin: market.marketZoneNow(),
		interval: iterInterval,
		period: iterPeriod
	};
	var leftDT = iter_parms.begin;

	function zeroDT(dt) {
		dt.setHours(0);
		dt.setMinutes(0);
		dt.setSeconds(0);
		dt.setMilliseconds(0);
		return dt;
	}
	var isForex = CIQ.Market.Symbology.isForexSymbol(chart.symbol);
	function forexAdjust(dt, advance) {
		// The whole point of this function is to get a 1 day or today chart to start showing forex at 5pm the prior day instead of midnight,
		// without breaking the whole market class in the process.
		if (!isForex) return dt;
		var forexOffset = 7; // 7 hours from open to midnight
		if (advance) dt.setHours(dt.getHours() + forexOffset);
		// get it to the next day if it's after 5pm
		else {
			// it's assumed dt time is midnight if code gets in here
			dt.setHours(dt.getHours() - forexOffset); // start at 5pm prior trading day
			if (!market.isMarketDate(dt)) dt.setDate(dt.getDate() - 2); // For the weekend
		}
		return dt;
	}
	if (interval === "ytd") {
		leftDT = zeroDT(leftDT);
		leftDT.setMonth(0);
		leftDT.setDate(1);
	} else if (interval === "month") {
		leftDT = zeroDT(new Date());
		leftDT.setMonth(leftDT.getMonth() - period);
	} else if (interval === "year") {
		leftDT = zeroDT(new Date());
		leftDT.setFullYear(leftDT.getFullYear() - period);
	} else if (interval === "week") {
		leftDT = zeroDT(new Date());
		leftDT.setDate(leftDT.getDate() - period * 7);
	} else if (interval === "day" && period == 1 && market.isMarketDay()) {
		// Special case, 1 "day" --on market days-- will start from same time on previous market day
		// 1 day in weekends and holidays or 2 or more days will always start from market open of prior days (last else)
		var h = leftDT.getHours();
		var m = leftDT.getMinutes();
		var s = leftDT.getSeconds();
		var mm = leftDT.getMilliseconds();
		iter = market.newIterator(iter_parms);
		leftDT = iter.previous();
		leftDT.setHours(h, m, s, mm);
		leftDT = market._convertFromMarketTZ(leftDT);
	} else if (interval === "today") {
		iter_parms.begin = forexAdjust(leftDT, true);
		// forward and then back will land us on the most current valid market day
		iter = market.newIterator(iter_parms);
		if (
			market.isOpen() ||
			market.getPreviousOpen().getDate() == leftDT.getDate()
		) {
			// if market opened, go ahead a day (we'll go back a day right after)
			iter.next();
		}
		leftDT = iter.previous();
		forexAdjust(leftDT);

		parms_copy.goIntoFuture = true;
		parms_copy.dtRight = new Date(+leftDT);
		parms_copy.dtRight.setDate(leftDT.getDate() + 1);
		parms_copy.dtRight = market._convertFromMarketTZ(parms_copy.dtRight);

		if (!isForex) {
			leftDT.setHours(iter.market.zopen_hour);
			leftDT.setMinutes(iter.market.zopen_minute);
			leftDT.setSeconds(0);
		}

		leftDT = market._convertFromMarketTZ(leftDT);
	} else {
		if (interval == "day") iter_parms.begin = forexAdjust(leftDT, true);
		iter = market.newIterator(iter_parms);
		if (period == 1) period++;
		leftDT = iter.previous(period - 1);
		if (interval == "day")
			leftDT = market._convertFromMarketTZ(forexAdjust(leftDT));
	}
	parms_copy.dtLeft = leftDT;
	if (parms_copy.maintainPeriodicity) {
		parms_copy.periodicity = {};
		parms_copy.periodicity.interval = this.layout.interval;
		parms_copy.periodicity.period = this.layout.periodicity;
	}
	chart.spanLock = false; // unlock left edge
	parms_copy.dontSaveRangeToLayout = true; // don't do certain things in setRange when being called from setSpan
	var self = this;
	this.setRange(parms_copy, function (err) {
		self.layout.setSpan = params;
		self.changeOccurred("layout");

		if (interval == "today") {
			chart.spanLock = true; // lock left edge of screen, in callback after we have fetched!
		}
		if (cb) cb(err);
	});
};

//@private
// Foobarred function.  Does not handle today or all properly.  Assumes daily data.  Not called from anywhere.
CIQ.ChartEngine.prototype.getSpanCandleWidth = function (span) {
	if (!span || !span.base || !span.multiplier) return;
	var num = parseFloat(span.multiplier);
	var base = span.base;
	var now = new Date();
	var prev = new Date();
	if (base == "year") {
		prev.setFullYear(prev.getFullYear() - num);
	} else if (base == "month") {
		prev.setMonth(prev.getMonth() - num);
	} else if (base == "day") {
		prev.setDate(prev.getDate() - num);
	} else if (base == "week") {
		prev.setDate(prev.getDate() - 7 * num);
	} else if (base == "YTD") {
		prev.setMonth(0);
		prev.setDate(1);
	}
	var diff = (now.getTime() - prev.getTime()) / 1000 / 60 / 60 / 24;
	diff = (diff * 5) / 7;
	var candleWidth = this.chart.width / diff;
	return candleWidth;
};

/**
 * Sets a chart to display all data for a security.
 *
 * If no feed is attached, it will simply display all the data loaded in the present periodicity.
 * <br>If the chart is driven by a QuoteFeed and no periodicity is requested, it will default to 'monthly'.
 * It will then call QuoteDriver.loadAll() which makes multiple queries to ensure all data available from the quote feed is loaded.
 * Once all the data is loaded, the chart will be set to cover that range using {@link CIQ.ChartEngine#setRange}
 * @param {object} [params] Optional parameters in same format as {@link CIQ.ChartEngine#setSpan}.
 * @param {Function} [cb] Callback, is called when chart is displayed.
 * @since  04-2015
 * @memberOf CIQ.ChartEngine
 */
CIQ.ChartEngine.prototype.displayAll = function (params, cb) {
	var chart = this.chart;
	if (params && params.chart) chart = params.chart;
	var self = this;
	function displayTheResults() {
		if (!chart.masterData || !chart.masterData.length) return;
		var p = CIQ.clone(params);
		p.dtLeft = chart.masterData[0].DT;
		p.dtRight = chart.masterData[chart.masterData.length - 1].DT;
		// we already have the data, we just want to show it now. So make sure we maintain the periodicity so it won't fetch new one data
		p.periodicity = {};
		p.periodicity.interval = self.layout.interval;
		p.periodicity.period = self.layout.periodicity;
		p.periodicity.timeUnit = self.layout.timeUnit;
		self.setRange(p, function (err) {
			self.layout.setSpan = {
				base: params.base,
				multiplier: params.multiplier
			};
			self.changeOccurred("layout");
			for (var p in self.panels)
				self.calculateYAxisMargins(self.panels[p].yAxis);
			self.draw();
			if (cb) cb(err);
		});
	}
	function loadAllTheData(err) {
		if (!err) self.quoteDriver.loadAll(chart, displayTheResults);
	}

	// Case 1: no quoteFeed so display what we have
	if (!this.quoteDriver) {
		displayTheResults();
		return;
	}

	var periodicity = params.maintainPeriodicity
		? {
				period: this.layout.periodicity,
				interval: this.layout.interval,
				timeUnit: this.layout.timeUnit
		  }
		: { period: 1, interval: "month", timeUnit: null };
	periodicity = params.periodicity ? params.periodicity : periodicity;

	periodicity = CIQ.cleanPeriodicity(
		periodicity.period,
		periodicity.interval,
		periodicity.timeUnit
	);

	var needDifferentData = this.needDifferentData(periodicity);

	this.layout.periodicity = periodicity.period;
	this.layout.interval = periodicity.interval;
	this.layout.timeUnit = periodicity.timeUnit;

	// Case 2: new symbol or new periodicity
	if (params.forceLoad || needDifferentData) {
		this.clearCurrentMarketData(this.chart);
		this.quoteDriver.newChart(
			{
				noDraw: true,
				symbol: this.chart.symbol,
				symbolObject: this.chart.symbolObject,
				chart: this.chart,
				initializeChart: true,
				fetchMaximumBars: true
			},
			loadAllTheData
		);
	} else {
		// Case 3, the right interval is set but we don't have all the data
		if (chart.moreAvailable || !chart.upToDate) {
			loadAllTheData();
		} else {
			// Case 4, the right interval is set and we have all the data
			this.createDataSet(); // Just in case the interval changed from month to day or vice versa
			displayTheResults();
		}
	}
};

};

let __js_standard_storage_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * <span class="quotefeed">QuoteFeed required</span> if `params.noDataLoad` is set to `false`
 *
 * Imports a layout (panels, studies, candleWidth, etc) from a previous serialization. See {@link CIQ.ChartEngine#exportLayout}.
 *
 * There are 3 ways to use the this method:
 * 1. Preset the layout object in the chart instance, but do not load any data.
 *  - This is usually used to restore an initial 'symbol independent' general layout (chart type and studies mainly) that will then take effect when `loadChart` is subsequently called.
 *  - In this case, exportedLayout should be called using 'withSymbols=false' and the importLayout should have 'noDataLoad=true'.
 * 2. Load an entire new chart and its data, including primary symbol, additional series, studies, chart type, periodicity and range:
 *  - In this case, you should not need call loadChart, setPeriodicity setSpan or setRange, addStudy, etc. since it is all restored from the previously exported layout and loaded using the attached quoteFeed.
 *  - If you still wish to change periodicity, span or range, you must use the CB function to do so.
 *  - In this case, exportedLayout should be called  using 'withSymbols=true' and the importLayout should have 'noDataLoad=false' and 'managePeriodicity=true'.
 * 3. Reset layout on an already existing chart without changing the primary symbol or adding additional symbols:
 *  - This is used when restoring a 'view' on an already existing chart from a previous `loadChart` call. The primary symbol remains the same, no additional series are added, but periodicity, range, studies and chart type are restored from the previously serialized view.
 *  - In this case, exportedLayout should be called  using 'withSymbols=false', and importLayout should have 'noDataLoad=false', managePeriodicity=true', and 'preserveTicksAndCandleWidth=true'.
 *
 * **Important Notes:**
 * - Please note that [studyOverlayEdit]{@link studyOverlayEditEventListener} and [studyPanelEdit]{@link studyPanelEditEventListener} event listeners must be set *before* you call {@link CIQ.ChartEngine#importLayout}.
 * Otherwise your imported studies will not have edit capabilities.
 *
 * - When symbols are loaded, this function will set the primary symbol (first on the serialized symbol list) with {@link CIQ.ChartEngine#loadChart}
 * and any overlayed symbol with {@link CIQ.ChartEngine#addSeries}. You must be using a QuoteFeed to use this workflow.
 *
 * - This method will not remove any currently loaded [series]{@link CIQ.ChartEngine#addSeries}.
 * If your restored layout should not include previously loaded series, you must first iterate trough the {@link CIQ.ChartEngine.Chart#series} object, and systematically call {@link CIQ.ChartEngine#removeSeries} on each entry.
 *
 * - When allowing this method to load data, do not call [addSeries]{@link CIQ.ChartEngine#addSeries}, [importDrawings]{@link CIQ.ChartEngine#importDrawings} or [loadChart]{@link CIQ.ChartEngine#loadChart}
 * in a way that will cause them to run simultaneously with this method, or the results of the layout load will be unpredictable.
 * Instead use this method's callback to ensure data is loaded in the right order.
 *
 * - Since spans and ranges require changes in data and periodicity,
 * they are only imported if params.managePeriodicity is set to true and params.noDataLoad is set to false.
 * If both range and span are present, range takes precedence.
 *
 * @param  {object} config						A serialized layout generated by {@link CIQ.ChartEngine#exportLayout}
 * @param  {object} params						Parameters to dictate layout behavior
 * @param  {boolean} [params.noDataLoad=false] If true, then any automatic data loading from the quotefeed will be skipped, including setting periodicity, spans or ranges.<br>
 * Data can only be loaded if a quote feed is attached to the chart. <br>
 * @param  {boolean} [params.managePeriodicity]	If true then the periodicity will be set from the layout, otherwise periodicity will remain as currently set.<br>
 * If the span/range was saved in the layout, it will be restored using the most optimal periodicity as determined by {@link CIQ.ChartEngine#setSpan}.<br>
 * Periodicity can only be managed if a quote feed is attached to the chart. <br>
 * Only applicable when noDataLoad=false.<br>
 * See {@link CIQ.ChartEngine#setPeriodicity} for additional details
 * @param  {boolean} [params.preserveTicksAndCandleWidth] If true then the current candleWidth (horizontal zoom) and scroll (assuming same periodicity) will be maintained and any spans or ranges present in the config will be ignored. Otherwise candle width and span/ranges will be taken from the config and restored.
 * @param  {function} [params.cb] An optional callback function to be executed once the layout has been fully restored.
 * @param  {function} [params.seriesCB] An optional callback function to be executed after each series is restored (to be aded to each {@link CIQ.ChartEngine#addSeries} call).
 * @memberof CIQ.ChartEngine
 * @since
 * - 05-2016-10 Symbols are also loaded if included on the serialization.
 * - 2016-06-21 `preserveTicksAndCandleWidth` now defaults to true.
 * - 3.0.0 Added `noDataLoad` parameter.
 * - 5.1.0 Will now also import extended hours settings.
 * - 5.1.0 Imports the range from layout if it is there to preserve between sessions.
 * - 5.2.0 spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
 */
CIQ.ChartEngine.prototype.importLayout = function (config, params) {
	if (!config) {
		// if no config to restore, nothing to do.
		if (params.cb) params.cb();
		return;
	}

	var self = this;
	var importedPanels = [];
	function sortPanelAxes(panels) {
		function isdefined(i) {
			return !!i;
		}
		function sortSide(importedPanel, member) {
			if (!importedPanel[member] || !importedPanel[member].length) return;
			var panel = panels[importedPanel.name];
			if (!panel) return;
			var panelAxisArr = panel[member];
			var arr = new Array(panelAxisArr.length);
			for (var j = 0; j < panelAxisArr.length; j++) {
				var newPosition = importedPanel[member].indexOf(panelAxisArr[j].name);
				if (newPosition > -1) arr[newPosition] = panelAxisArr[j];
				else arr.push(panelAxisArr[j]);
			}
			if (arr.length) panel[member] = arr.filter(isdefined);
		}
		for (var i = 0; i < importedPanels.length; i++) {
			var importedPanel = importedPanels[i];
			sortSide(importedPanel, "yaxisLHS");
			sortSide(importedPanel, "yaxisRHS");
		}
		self.chart.yAxis = self.chart.panel.yAxis;
	}

	if (typeof params !== "object") {
		// backwards compatibility logic. This function used to accept three named arguments
		params = {
			managePeriodicity: arguments[1],
			preserveTicksAndCandleWidth: arguments[2]
		};
	}
	var layout = this.layout,
		originalLayout = CIQ.shallowClone(layout);
	var managePeriodicity = params.managePeriodicity,
		cb = params.cb,
		seriesCB = params.seriesCB,
		noDataLoad = params.noDataLoad;
	var preserveTicksAndCandleWidth = params.preserveTicksAndCandleWidth;

	var exportedDrawings = null;
	if (this.exportDrawings) {
		exportedDrawings = this.exportDrawings();
		this.abortDrawings();
	}

	this.currentlyImporting = true;
	// must remove studies before cleaning the overlays, or the remove function will be lost.
	for (var s in layout.studies) {
		var sd = layout.studies[s];
		CIQ.getFn("Studies.removeStudy")(this, sd);
	}
	this.overlays = {};

	// Keep a copy of the prior panels. We'll need these in order to transfer the holders
	var priorPanels = CIQ.shallowClone(this.panels);
	this.panels = {};

	// clone into view to prevent corrupting the original config object.
	var view = CIQ.clone(config);
	// copy all settings to the chart layout, but maintain the original periodcity,
	// wich is handled later on depending on managePeriodicity and noDataLoad settings.
	layout.periodicity = originalLayout.periodicity;
	layout.interval = originalLayout.interval;
	layout.timeUnit = originalLayout.timeUnit;
	layout.setSpan = originalLayout.setSpan;
	layout.range = originalLayout.range;

	// must restore candleWidth before you draw any charts or series, including study charts. The config does not always provide the candleWidth
	if (preserveTicksAndCandleWidth) {
		layout.candleWidth = originalLayout.candleWidth;
	} else {
		if (!layout.candleWidth) layout.candleWidth = 8;
	}
	this.setCandleWidth(layout.candleWidth);

	// Flip chart upside down if flipped but set
	if (layout.flipped) this.flipChart(layout.flipped);

	var panels = view.panels; // make a copy of the panels
	var p;
	var panel;
	var yAxis;
	var sortByIndex = function (l, r) {
		return l.index < r.index ? -1 : 1;
	};
	for (p in panels) {
		if (!("index" in panels[p])) sortByIndex = null; // unable to sort
		panel = panels[p];
		panel.name = p;
		importedPanels.push(panel);
	}
	layout.panels = {}; // erase the panels
	var panelToSolo = null;

	if (importedPanels.length > 0) {
		// rebuild the panels
		if (sortByIndex) importedPanels.sort(sortByIndex);
		for (var i = 0; i < importedPanels.length; ++i) {
			panel = importedPanels[i];
			yAxis = panel.yAxis ? new CIQ.ChartEngine.YAxis(panel.yAxis) : null;
			this.stackPanel(
				panel.display,
				panel.name,
				panel.percent,
				panel.chartName,
				yAxis
			);
			if (panel.soloing) panelToSolo = this.panels[panel.name];
		}
	}
	if (CIQ.isEmpty(panels)) {
		this.stackPanel("chart", "chart", 1, "chart");
	}
	this.resizeCanvas();

	// Transfer the holders and DOM element references to panels that were retained when the config switched
	// Delete panels that weren't
	for (var panelName in priorPanels) {
		var oldPanel = priorPanels[panelName];
		var newPanel = this.panels[panelName];
		if (newPanel) {
			this.container.removeChild(newPanel.holder);
			if (oldPanel.handle) this.container.removeChild(oldPanel.handle);
			var copyFields = {
				holder: true,
				subholder: true,
				display: true,
				icons: true
			};
			for (var f in copyFields) {
				newPanel[f] = oldPanel[f];
			}
			this.configurePanelControls(newPanel);
			if (oldPanel.chart.panel == oldPanel) oldPanel.chart.panel = newPanel; // retain reference to the actual chart panel
		} else {
			this.privateDeletePanel(oldPanel);
		}
	}
	this.chart.panel = this.panels.chart; // make sure these are the same!

	sortPanelAxes(this.panels);
	CIQ.dataBindSafeAssignment(layout, CIQ.clone(view));

	var studies = CIQ.clone(layout.studies);
	delete layout.studies;
	for (var ss in studies) {
		var study = studies[ss];
		CIQ.getFn("Studies.addStudy")(
			this,
			study.type,
			study.inputs,
			study.outputs,
			study.parameters,
			study.panel
		);
	}

	if (this.extendedHours)
		this.extendedHours.prepare(layout.extended, layout.marketSessions);

	if (typeof layout.chartType == "undefined") layout.chartType = "line";
	this.setMainSeriesRenderer();

	if (panelToSolo) this.panelSolo(panelToSolo);
	this.adjustPanelPositions();
	sortPanelAxes(this.panels);
	this.storePanels();

	function postLayoutChange() {
		if (exportedDrawings) self.importDrawings(exportedDrawings);
		self.currentlyImporting = false;
		// Below is logic for re-adding the series used by studies.
		// We need this because we've removed the existing series when we removed studies.
		// When we readded studies we suspended the data loading since we were in the middle of importing
		// so here after turning off the importing flag, we readd these series to cause an initial load of its data
		// Note we need to reload the series data since it was cleaned out of masterData by removeStudy().
		var found;
		function cb() {
			self.createDataSet();
			sortPanelAxes(self.panels);
			self.calculateYAxisPositions();
			self.draw();
		}
		// For some series (such as those based on price relative studies) `addSeries()` will check whether there
		// already exist series with a matching symbol (to avoid refetching data). When we are removing and then
		// readding series, we need to remove them all before readding any. This is because not yet removed series
		// can cause readded studies to not get initialized properly.
		var series;
		var seriesToReadd = [];
		for (var s in self.chart.series) {
			if (!self.removeSeries) break;
			series = self.chart.series[s];
			if (series.parameters.bucket == "study") {
				found = true;
				self.removeSeries(series);
				seriesToReadd.push(series);
			}
		}
		for (var i = 0; i < seriesToReadd.length; i++) {
			series = seriesToReadd[i];
			self.addSeries(series.id, series.parameters, cb);
		}
		if (!found) self.draw();
		self.updateListeners("layout"); // tells listening objects that layout has changed
		self.changeOccurred("layout"); // dispatches to callbacklisteners
	}

	function cb2() {
		self.calculateYAxisPositions();
		sortPanelAxes(self.panels);
		if (seriesCB) seriesCB();
	}
	if (!noDataLoad) {
		// Now we execute the data loading functions.
		if (view.symbols && view.symbols.length) {
			// load symbols; primary and additional series. Also adjust ranges and periodicity at the same time

			var params2 = {
				chart: this.chart
			};
			if (
				!preserveTicksAndCandleWidth &&
				managePeriodicity &&
				view.range &&
				Object.keys(view.range).length
			) {
				// spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
				params2.range = view.range;
			} else if (
				!preserveTicksAndCandleWidth &&
				managePeriodicity &&
				view.setSpan &&
				Object.keys(view.setSpan).length
			) {
				// see above
				params2.span = view.setSpan;
			} else if (managePeriodicity && view.interval) {
				// otherwise, import periodicity if available
				params2.periodicity = {
					interval: view.interval,
					period: view.periodicity,
					timeUnit: view.timeUnit
				};
			} else {
				// otherwise, maintain prior periodicity
				params2.periodicity = {
					interval: originalLayout.interval,
					period: originalLayout.periodicity,
					timeUnit: originalLayout.timeUnit
				};
			}

			var symbolObject = view.symbols[0].symbolObject || view.symbols[0].symbol;

			this.loadChart(symbolObject, params2, function (err) {
				if (!err) {
					for (var smbl, i = 1; i < view.symbols.length; ++i) {
						if (!self.addSeries) break;
						smbl = view.symbols[i];
						if (!smbl.parameters) smbl.parameters = {};
						var parameters = CIQ.clone(smbl.parameters);
						if (this.panels[parameters.panel]) {
							self.addSeries(smbl.id, parameters, cb2);
						} else {
							console.warn(
								'Warning: Series "' +
									smbl.id +
									'" could not be imported due to a missing corresponding panel "' +
									parameters.panel +
									'"'
							);
						}
					}
					if (view.chartScale) self.setChartScale(view.chartScale);
				}
				postLayoutChange();
				if (cb) cb.apply(null, arguments);
			});
			return;
		}

		// Otherwise, if only data ranges or periodicity are required, load them now

		if (managePeriodicity) {
			if (!preserveTicksAndCandleWidth && this.setRange) {
				// spans and ranges are only executed if managePeriodicity is true and preserveTicksAndCandleWidth is false.
				var range = view.range;
				if (range && Object.keys(range).length && this.chart.symbol) {
					this.setRange(range, function () {
						postLayoutChange();
						if (cb) cb();
					});
					return;
				} else if (
					view.setSpan &&
					Object.keys(view.setSpan).length &&
					this.chart.symbol
				) {
					this.setSpan(view.setSpan, function () {
						postLayoutChange();
						if (cb) cb();
					});
					return;
				}
			}

			var interval = view.interval;
			var periodicity = view.periodicity;
			var timeUnit = view.timeUnit;
			if (isNaN(periodicity)) periodicity = 1;
			if (!interval) interval = "day";
			// this will get new data or roll up existing, createDataSet() and draw()
			this.setPeriodicity(
				{ period: periodicity, interval: interval, timeUnit: timeUnit },
				function () {
					postLayoutChange();
					if (cb) cb();
				}
			);
			return;
		}
	}

	// if we got here, no data loading was requested.
	if (managePeriodicity) {
		layout.periodicity = view.periodicity;
		layout.interval = view.interval;
		layout.timeUnit = view.timeUnit;
		layout.setSpan = view.setSpan;
	}

	this.createDataSet();
	if (!preserveTicksAndCandleWidth) this.home();
	postLayoutChange();
	if (cb) cb();
};

/**
 * Exports the current layout into a serialized form. The returned object can be passed into {@link CIQ.ChartEngine#importLayout} to restore the layout at a future time.
 *
 * This method will also save any programmatically activated [range]{@link CIQ.ChartEngine#setRange} or [span]{@link CIQ.ChartEngine#setSpan} setting that is still active.
 *
 * > **Note:** A set range or span that is manually modified by a user when zooming, panning, or changing periodicity will be nullified.
 * > So, if you wish to always record the current range of a chart for future restoration, you must use the following process:
 *
 * > 1- Add the following injection to save the range on every draw operation:
 * > ```
 * > stxx.append("draw", function() {
 * >    console.log('recording range');
 * >     delete stxx.layout.setSpan;
 * >     stxx.layout.range={padding: stxx.preferences.whitespace,
 * >        dtLeft: stxx.chart.dataSegment[0].DT,
 * >        dtRight: stxx.chart.dataSegment[stxx.chart.dataSegment.length - 1].DT,
 * >         periodicity: {
 * >             period: stxx.layout.periodicity,
 * >             interval: stxx.layout.interval,
 * >             timeUnit: stxx.layout.timeUnit
 * >         }
 * >     }
 * >     saveLayout({stx:stxx});
 * > });
 * > ```
 *
 * > 2- Make sure you call [importLayout]{@link CIQ.ChartEngine#importLayout} with params `preserveTicksAndCandleWidth` set to `false`
 *
 * > More on injections here: {@tutorial Using the Injection API}
 *
 * @param {boolean} withSymbols If `true`, include the chart's current primary symbol and any secondary symbols from any {@link CIQ.ChartEngine#addSeries} operation, if using a quote feed. Studies will be excluded from this object. The resulting list will be in the `symbols` element of the serialized object.
 * @return {object} The serialized form of the layout.
 * @memberof CIQ.ChartEngine
 * @since
 * - 05-2016-10 Added the `withSymbols` parameter.
 * - 5.0.0 `obj.symbols` is explicitly removed from the serialization when `withSymbols` is not true.
 */
CIQ.ChartEngine.prototype.exportLayout = function (withSymbols) {
	var obj = {};
	// First clone all the fields, these describe the layout
	for (var field in this.layout) {
		if (field != "studies" && field != "panels" && field != "drawing") {
			obj[field] = CIQ.clone(this.layout[field]);
		} else if (field == "studies") {
			obj.studies = {};
		} else if (field == "panels") {
			obj.panels = {};
		}
	}

	function serializeAxisNames(axisArr) {
		var nameArr = [];
		for (var i = 0; i < axisArr.length; i++) {
			nameArr.push(axisArr[i].name);
		}
		return nameArr;
	}

	// Serialize the panels
	var i = 0;
	for (var panelName in this.panels) {
		var p = this.panels[panelName];
		if (p.exportable === false) continue;
		var panel = (obj.panels[panelName] = {});
		panel.percent = p.percent;
		panel.display = p.display;
		panel.chartName = p.chart.name;
		panel.soloing = p.soloing;
		panel.index = i++;
		panel.yAxis = { name: p.yAxis.name, position: p.yAxis.position };
		if (p.yaxisLHS) panel.yaxisLHS = serializeAxisNames(p.yaxisLHS);
		if (p.yaxisRHS) panel.yaxisRHS = serializeAxisNames(p.yaxisRHS);
	}

	// Serialize the studies
	for (var studyName in this.layout.studies) {
		var study = (obj.studies[studyName] = {});
		var s = this.layout.studies[studyName];
		study.type = s.type;
		study.inputs = CIQ.clone(s.inputs);
		study.outputs = CIQ.clone(s.outputs);
		study.panel = s.panel;
		study.parameters = CIQ.clone(s.parameters);
	}

	if (withSymbols) {
		obj.symbols = this.getSymbols({
			"include-parameters": true,
			"exclude-studies": true,
			"exclude-generated": true
		});
	} else {
		delete obj.symbols;
	}

	return obj;
};

/**
 * Imports a users preferences from a saved location and uses them in the ChartEngine
 * To save preferences see {@link CIQ.ChartEngine#exportPreferences}
 * @param {object} preferences An object of {@link CIQ.ChartEngine#preferences}
 * @memberof CIQ.ChartEngine
 * @since 4.0.0
 */
CIQ.ChartEngine.prototype.importPreferences = function (preferences) {
	CIQ.extend(this.preferences, preferences);
	if (preferences.timeZone)
		this.setTimeZone(this.dataZone, preferences.timeZone);
	if (preferences.language && CIQ.I18N) {
		CIQ.I18N.localize(this, preferences.language);
	}
	this.changeOccurred("preferences");
};

/**
 * Exports the {@link CIQ.ChartEngine#preferences} for external storage.
 * Can then be imported again after being parsed with {@link CIQ.ChartEngine#importPreferences}
 * @memberof CIQ.ChartEngine
 * @returns {CIQ.ChartEngine#preferences}
 * @since 4.0.0
 */
CIQ.ChartEngine.prototype.exportPreferences = function () {
	return this.preferences;
};

};

let __js_standard_studies_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (CIQ.ChartEngine) {
	/**
	 * <span class="injection">INJECTABLE</span>
	 * This function is called when a highlighted study overlay is right clicked. If the overlay has an edit function (as many studies do), it will be called. Otherwise it will remove the overlay
	 * @param  {string} name The name (id) of the overlay
	 * @param  {boolean} [forceEdit] If true then force edit menu
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias rightClickOverlay
	 */
	CIQ.ChartEngine.prototype.rightClickOverlay = function (name, forceEdit) {
		if (this.runPrepend("rightClickOverlay", arguments)) return;
		var sd = this.overlays[name];
		if (sd.editFunction) {
			sd.editFunction(forceEdit);
		} else {
			this.removeOverlay(name);
		}
		this.runAppend("rightClickOverlay", arguments);
	};

	/**
	 * <span class="injection">INJECTABLE</span>
	 * Registers an activated overlay study with the chart.
	 *
	 * This is the recommended method for registering an overlay study, rather than directly manipulating the [stxx.overlays]{@link CIQ.ChartEngine#overlays} object.
	 * @param {object} data.sd The study object studyDescriptor
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias addOverlay
	 * @since 5.2.0
	 */
	CIQ.ChartEngine.prototype.addOverlay = function (sd) {
		if (this.runPrepend("addOverlay", arguments)) return;
		this.overlays[sd.name] = sd;
		this.runAppend("addOverlay", arguments);
	};

	/**
	 * <span class="injection">INJECTABLE</span>
	 * Removes an overlay (and the associated study)
	 * @param  {string} name The name (id) of the overlay
	 * @memberof CIQ.ChartEngine.AdvancedInjectable#
	 * @alias removeOverlay
	 */
	CIQ.ChartEngine.prototype.removeOverlay = function (name) {
		if (this.runPrepend("removeOverlay", arguments)) return;
		var mySD = this.overlays[name];
		for (var o in this.overlays) {
			var sd = this.overlays[o];
			var fieldInputs = ["Field"];
			if (CIQ.Studies) fieldInputs = CIQ.Studies.getFieldInputs(sd);
			for (var f = 0; f < fieldInputs.length; f++) {
				// Study sd is reliant on an output from the about-to-be-deleted overlay
				if (mySD.outputMap[sd.inputs[fieldInputs[f]]]) {
					// Yucky, we should move to explicit parent nodes
					this.removeOverlay(sd.name);
				}
			}
		}

		if (mySD) {
			this.cleanupRemovedStudy(mySD);
			var panel = this.panels[mySD.panel];
			delete this.overlays[name];
			this.checkForEmptyPanel(mySD.panel);
		}

		if (!this.currentlyImporting) {
			// silent mode while importing
			this.displaySticky();
			this.createDataSet();
			this.changeOccurred("layout");
		}
		this.resetDynamicYAxis();
		this.runAppend("removeOverlay", arguments);
	};

	/**
	 * Cleans up a removed study. called by {@link CIQ.ChartEngine#privateDeletePanel} or {@link CIQ.ChartEngine#removeOverlay}
	 * Calls removeFN, and plugins associated with study.
	 * Finally, removes study from layout.
	 * @param  {CIQ.ChartEngine} stx A chart object
	 * @param  {object} sd  A study descriptor
	 * @memberof CIQ.ChartEngine
	 * @private
	 * @since 2015-11-1
	 */
	CIQ.ChartEngine.prototype.cleanupRemovedStudy = function (sd) {
		if (!sd) return;
		if (sd.study.removeFN) sd.study.removeFN(this, sd);
		// delete any plugins associated with this study
		for (var p in this.plugins) {
			if (p.indexOf("{" + sd.id + "}") > -1) delete this.plugins[p];
		}
		if (this.layout.studies) delete this.layout.studies[sd.name];
		delete this.overlays[sd.name];
		if (CIQ.Studies) CIQ.Studies.removeStudySymbols(sd, this);
		if (this.quoteDriver) this.quoteDriver.updateSubscriptions();
	};
}

//
// Type definitions
//

/**
 * A study descriptor as returned by {@link CIQ.Studies.addStudy}.
 *
 * The primary properties are outlined in this section. More details can be found in the [Study objects]{@tutorial Using and Customizing Studies - Study objects} tutorial
 * @typedef {object} studyDescriptor
 * @property {string} name The study's id.
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
 * @property {object} inputs Keys for each possible study input with descriptors for the set and default values
 * @property {number} min The minimum data point
 * @property {number} max The maximum data point
 * @property {object} outputs Keys for each possible study output with its corresponding rendering color.
 * @property {string} panel ID of the panel element the study is attached to
 * @property {parameters} parameters Keys for each of the study's possible plot parameters
 * @property {string} type The study type
 * @property {object} outputMap Mapping between a unique study field name in the dataSet/datSegment and its corresponding general `outputs` name/color, as set in the study library entry.<br>
 * 								This mapping is automatically created and present on all study descriptors, and used by all default study functions to ensure data generated by a calculation function can be found by the display function.<br>
 * 								Example:
 * ```
 * // Map for an Alligator study with inputs of:
 * // -Jaw Period:13
 * // -Jaw Offset:8
 * // -Teeth Period:8
 * // -Teeth Offset:5
 * // -Lips Period:5
 * // -Lips Offset:3
 * // -Show Fractals:false
 *
 * {
 * 	"Jaw &zwnj;Alligator&zwnj; (13,8,8,5,5,3,n)":	"Jaw",
 * 	"Teeth &zwnj;Alligator&zwnj; (13,8,8,5,5,3,n)":	"Teeth",
 * 	"Lips &zwnj;Alligator&zwnj; (13,8,8,5,5,3,n)":	"Lips"
 * }
 * ```
 */

//
// (end definitions)
//

/**
 * Namespace for functionality related to studies (aka indicators).
 *
 * See {@tutorial Using and Customizing Studies} for additional details and a general overview about studies.
 * @namespace
 * @name  CIQ.Studies
 */
CIQ.Studies = CIQ.Studies || function () {};

/**
 * Constants for when no inputs or outputs specified in studies.
 * Values can be changed but do not change keys.
 * @memberof CIQ.Studies
 */
CIQ.Studies.DEFAULT_INPUTS = { Period: 14 };
CIQ.Studies.DEFAULT_OUTPUTS = { Result: "auto" };

CIQ.Studies.sortForProcessing = (stx) => {
	function setIndependentStudies(list, arr) {
		list.forEach((study) => {
			if (arr.indexOf(study) == -1) {
				let dependents = study.getDependents(stx);
				if (dependents.length) setIndependentStudies(dependents, arr);
				arr.unshift(study);
			}
		});
	}
	let sortArray = [];
	const studies = stx.layout.studies;
	if (studies) {
		setIndependentStudies(Object.values(studies), sortArray);
	}
	return sortArray;
};

/**
 * Creates a [study descriptor]{@link studyDescriptor} which contains all of the information necessary to handle a study. Also
 * provides convenience methods to extract information from it.
 *
 * Do not call directly or try to manually create your own study descriptor, but rather always use the one returned by {@link CIQ.Studies.addStudy}
 *
 * @param {string} name	   The name of the study. This should be unique to the chart. For instance if there are two RSI panels then they should be of different periods and named accordingly. Usually this is determined automatically by the library.
 * @param {string} type	   The type of study, which can be used as a look up in the StudyLibrary
 * @param {string} panel	  The name of the panel that contains the study
 * @param {object} inputs	 Names and values of input fields
 * @param {object} outputs	Names and values (colors) of outputs
 * @param {object} parameters Additional parameters that are unique to the particular study
 * @constructor
 * @name  CIQ.Studies.StudyDescriptor
 */
CIQ.Studies.StudyDescriptor = function (
	name,
	type,
	panel,
	inputs,
	outputs,
	parameters
) {
	this.name = name;
	this.type = type;
	this.panel = panel;
	this.inputs = inputs;
	this.outputs = outputs;
	this.parameters = parameters; // Optional parameters, i.e. zones
	this.outputMap = {}; // Maps dataSet label to outputs label "RSI (14)" : "RSI", for the purpose of figuring color
	this.min = null;
	this.max = null;
	this.startFrom = 0;
	this.subField = "Close"; // In case study is off a series
	var libraryEntry = CIQ.Studies.studyLibrary[type];
	if (!libraryEntry) {
		libraryEntry = {};
		if (
			panel == "chart" ||
			(!panel && parameters && parameters.chartName == "chart")
		)
			this.overlay = true;
	}
	if (typeof libraryEntry.inputs == "undefined")
		libraryEntry.inputs = CIQ.clone(CIQ.Studies.DEFAULT_INPUTS);
	if (typeof libraryEntry.outputs == "undefined")
		libraryEntry.outputs = CIQ.clone(CIQ.Studies.DEFAULT_OUTPUTS);

	this.study = libraryEntry;
	this.libraryEntry = libraryEntry; // deprecated, backwards compatibility
};

/**
 * Returns the y-axis used by the study
 * @return {CIQ.ChartEngine.YAxis} Y axis
 * @memberof CIQ.Studies.StudyDescriptor
 * @since 7.1.0
 */
CIQ.Studies.StudyDescriptor.prototype.getYAxis = function (stx) {
	var yAxis = this.yAxis;
	var specifiedYAxis;
	if (this.parameters) {
		specifiedYAxis = this.parameters.yaxisDisplayValue;
	}
	if (!yAxis) {
		var testPanel = stx.panels[this.panel];
		if (testPanel) {
			yAxis =
				stx.getYAxisByName(testPanel, specifiedYAxis) ||
				stx.getYAxisByName(testPanel, this.name) ||
				testPanel.yAxis;
		}
	}
	if (!yAxis)
		yAxis =
			stx.getYAxisByName(stx.chart.panel, specifiedYAxis) ||
			stx.chart.panel.yAxis;
	return yAxis;
};

/**
 * Returns the context to use for drawing the study
 * @param  {CIQ.ChartEngine} stx A chart object
 * @return {object} An HTML canvas context
 * @memberof CIQ.Studies.StudyDescriptor
 * @since 7.1.0
 */
CIQ.Studies.StudyDescriptor.prototype.getContext = function (stx) {
	// If the study is draggable it will be placed on the tempCanvas and so that canvas's context will be returned.
	//if(this.highlight && stx.highlightedDraggable) return stx.chart.tempCanvas.context;
	return stx.chart.context;
};

/**
 * Returns an array of all studies which depend on a given study.
 * A dependent study is one which uses an output of another study as input.
 * @param  {CIQ.ChartEngine} stx A chart object
 * @param  {boolean} [followsPanel] If true, will only return those studies which are not assigned to an explicit panel
 * @return  {array} Array of dependent studies
 * @memberof CIQ.Studies.StudyDescriptor
 * @since 7.1.0
 */
CIQ.Studies.StudyDescriptor.prototype.getDependents = function (
	stx,
	followsPanel
) {
	var dependents = [];
	for (var s in stx.layout.studies) {
		var dependent = stx.layout.studies[s];
		if (dependent == this) continue;
		var fieldInputs = CIQ.Studies.getFieldInputs(dependent);
		for (var f = 0; f < fieldInputs.length; f++) {
			if (dependent.inputs[fieldInputs[f]].includes(this.name)) {
				if (
					followsPanel &&
					dependent.parameters &&
					dependent.parameters.panelName
				)
					continue;
				dependents.push(dependent);
				dependents = dependents.concat(
					dependent.getDependents(stx, followsPanel)
				);
				break;
			}
		}
	}
	return dependents;
};

/**
 * Determines whether the study can be dragged to another axis or panel.
 *
 * @param {CIQ.ChartEngine} stx A chart object.
 * @return {boolean} true if not allowed to drag.
 * @memberof CIQ.Studies.StudyDescriptor
 * @since 7.3.0
 */
CIQ.Studies.StudyDescriptor.prototype.undraggable = function (stx) {
	var attr = this.study.attributes;
	if (attr) {
		if (attr.panelName && attr.panelName.hidden) return true;
		if (attr.yaxisDisplayValue && attr.yaxisDisplayValue.hidden) return true;
	}
	return false;
};

/**
 * Adds extra ticks to the end of the scrubbed array, to be added later to the dataSet.
 *
 * This function can be used to add extra ticks, like offsets into the future, to the dataSet to be plotted ahead of the current bar.
 * If a DT is not supplied, one will be calculate for each tick in the array.
 *
 * Remember to call this outside of any loop that iterates through the quotes array, or you will create a never-ending loop, since this increases the array size.
 *
 * @param  {CIQ.ChartEngine} stx A chart engine instance
 * @param  {array} ticks The array of ticks to add. Each tick is an object containing whatever data to add.
 * @example
 * var futureTicks=[];
 * for(i++;i<quotes.length;i++){
 *     var quote=quotes[i];
 *     if(i+offset>=0){
 *         if(i+offset<quotes.length) quotes[i+offset][name]=quote["Forecast "+sd.name];
 *         else {
 *             var ft={};
 *             ft[name]=quote["Forecast "+sd.name];
 *             futureTicks.push(ft);
 *         }
 *     }
 * }
 * sd.appendFutureTicks(stx,futureTicks);
 *
 * @memberof CIQ.Studies
 * @since 7.3.0
 */
CIQ.Studies.StudyDescriptor.prototype.appendFutureTicks = function (
	stx,
	ticks
) {
	var scrubbed = stx.chart.scrubbed;
	if (!scrubbed.length) return;
	var iter = stx.standardMarketIterator(scrubbed[scrubbed.length - 1].DT);
	var t, tick;
	// pop off the records which have only nulls
	for (t = ticks.length - 1; t >= 0; t--) {
		tick = ticks[t];
		for (var prop in tick) {
			if (tick[prop] || tick[prop] === 0) {
				t = -1;
				break;
			}
		}
		if (t == -1) break;
		ticks.pop();
	}
	for (t = 0; t < ticks.length; t++) {
		tick = ticks[t];
		if (!tick.DT) tick.DT = iter.next();
		if (!tick.displayDate) stx.setDisplayDate(tick);
		tick.futureTick = true;
		scrubbed.push(tick);
	}
};

/**
 * Automatically generates a unique name for the study instance.
 *
 * If a translation callback has been associated with the chart object then the name of the study will be translated.
 * @param  {CIQ.ChartEngine} stx A chart engine instance
 * @param  {string} studyName Type of study
 * @param  {object} inputs The inputs for this study instance
 * @param {string} [replaceID] If it matches then return the same id
 * @param {string} [customName] If this is supplied, use it to form the full study name. Otherwise `studyName` will be used. <br>ie: if custom name is 'SAMPLE', the unique name returned would resemble "SAMPLE(paam1,param2,param3,...)-X".
 * @return {string} A unique name for the study
 * @memberof CIQ.Studies
 * @since 5.1.1 Added `customName` argument; if supplied, use it to form the full study name. Otherwise `studyName` will be used.
 */
CIQ.Studies.generateID = function (
	stx,
	studyName,
	inputs,
	replaceID,
	customName
) {
	var libraryEntry = CIQ.Studies.studyLibrary[studyName];
	var translationPiece = "\u200c" + (customName || studyName) + "\u200c"; // zero-width non-joiner (unprintable) to delimit translatable phrase
	var id = translationPiece;
	if (libraryEntry) {
		// only one instance can exist at a time if custom removal, so return study name
		if (libraryEntry.customRemoval) return id;
	}
	if (!CIQ.isEmpty(inputs)) {
		var first = true;
		for (var field in inputs) {
			if (field == "id" || field == "display") continue; //skip these!
			if (field == "Shading") continue; //this does not merit being in the studyname
			var val = inputs[field];
			if (val == "field") continue; // skip default, usually means "Close"
			val = val.toString();
			if (CIQ.Studies.prettify[val] !== undefined)
				val = CIQ.Studies.prettify[val];
			if (first) {
				first = false;
				id += " (";
			} else {
				if (val) id += ",";
			}
			id += val;
		}
		if (!first) id += ")";
	}

	//this tests if replaceID is just a warted version of id, in that case keep the old id
	if (replaceID && replaceID.indexOf(id) === 0) return replaceID;

	// If the id already exists then we'll wart it by adding -N
	if (stx.layout.studies && stx.layout.studies[id]) {
		for (var i = 2; i < 50; i++) {
			var warted = id + "-" + i;
			if (!stx.layout.studies[warted]) {
				id = warted;
				break;
			}
		}
	}
	return id;
};

/**
 * Generates an object that can be used to create a dialog for creating or modifying a study.
 *
 * The object will then contain arrays for inputs, outputs and parameters:
 * - Each output will describe a color swatch that should be generated.
 * - Each input will describe a form field that should be generated.
 * - If a placeholder attribute of `yyyy-mm-dd` or `hh:mm:ss` is set on an input field, the
 * dialog will display a "date" or "time" input type, instead of a string input type.
 *   Example:
 *   ```
 *   "AVWAP": {
 *       "name":   "Anchored VWAP",
 *       "overlay": true,
 *       "calculateFN": CIQ.Studies.calculateAnchoredVWAP,
 *       "initializeFN": CIQ.Studies.initAnchoredVWAP,
 *       "inputs": {"Field":"field",   "Anchor Date":"",   "Anchor Time":""},
 *       "outputs": {"VWAP":"#FF0000"},
 *       "attributes":{
 *       "Anchor Date": {placeholder:"yyyy-mm-dd"},
 *       "Anchor Time": {placeholder:"hh:mm:ss", step:1}
 *   }
 *   ```
 * - Actual date/time displays are dependent on browser compatibility.
 * - The time is expected to be entered, and will be displayed in the `displayZone`. It will
 * converted as needed to the `dataZone` before used internally, so it always matches
 * `masterData`. See {@link CIQ.ChartEngine#setTimeZone}.
 *
 * The results of the dialog would then be passed to {@link CIQ.Studies.addStudy}.
 * @param {object} params Object containing the following:
 * @param  {string} [params.name] The libraryEntry key for the study to add.
 * The [libraryEntry]{@link CIQ.Studies.studyLibrary} is the object that defines the prototype for a study.
 * May contain attributes which are used to help construct the input fields of the study dialog.
 * See documentation of {@link CIQ.Studies.studyLibrary} and [DialogHelper Object](tutorial-Using%20and%20Customizing%20Studies%20-%20Advanced.html#DialogHelper).
 * Not needed if `params.sd` is present.
 * @param  {studyDescriptor} [params.sd] A study descriptor; when requesting values for an existing study. If present, takes precedence over `params.name`. You may set the 'panelName' parameter to "panel" (sd.parameters.panelName), and this method will provide in the parameters object an array of valid panels, which you can present to the user as options to move the study to a different panel.
 * @param  {boolean} [params.axisSelect] If set, the helper will include the axis position and color selection in the parameters section.
 * @param  {boolean} [params.panelSelect] If set, the helper will include the panel and underlay selection in the parameters section.
 * @param  {CIQ.CIQ.ChartEngine} params.stx A chart object
 * @name  CIQ.Studies.DialogHelper
 * @constructor
 * @example
 * var helper=new CIQ.Studies.DialogHelper({name:"stochastics",stx:stxx});
 * console.log('Inputs:',JSON.stringify(helper.inputs));
 * console.log('Outputs:',JSON.stringify(helper.outputs));
 * console.log('Parameters:',JSON.stringify(helper.parameters));
 * @example
 * // how to set the DialogHelper to get a list of all available panels as part of the parameters object
 * var sd = CIQ.Studies.addStudy(stxx, "Aroon");
 * var dialogHelper = new CIQ.Studies.DialogHelper({"stx":stxx,"sd":sd, panelSelect:true});
 * console.log('Parameters:',JSON.stringify(dialogHelper.parameters));
 *
 * @example
 * // Create a DialogHelper without an sd
 * var dialogHelper = new CIQ.Studies.DialogHelper({"stx":stxx,"name":"ma"})
 *
 * @since
 * - 6.3.0 Added parameters `axisSelect` and `panelSelect`.
 * - 6.3.0 If a placeholder attribute of `yyyy-mm-dd` or `hh:mm:ss` is set on an input field, the dialog will display a "date" or "time" input type, instead of a string input type.
 * - 7.1.0 It is expected that the study dialog's parameters section is refreshed whenever the DialogHelper changes. The "signal" member should be observed to see if it has flipped.
 */
CIQ.Studies.DialogHelper = function (params) {
	var stx = (this.stx = params.stx);
	var sd = (this.sd = params.sd);
	this.name = sd ? sd.type : params.name;
	this.signal = 1; // for observing changes
	this.inputs = [];
	this.outputs = [];
	this.parameters = [];
	var libraryEntry = (this.libraryEntry = sd
		? sd.study
		: CIQ.Studies.studyLibrary[params.name]);
	if (typeof libraryEntry.inputs == "undefined")
		libraryEntry.inputs = CIQ.clone(CIQ.Studies.DEFAULT_INPUTS);
	if (typeof libraryEntry.outputs == "undefined")
		libraryEntry.outputs = CIQ.clone(CIQ.Studies.DEFAULT_OUTPUTS);
	var panel =
		sd && stx.panels[sd.panel] ? stx.panels[sd.panel] : stx.chart.panel;
	var chart = panel.chart;

	this.title = stx.translateIf(libraryEntry.name);

	this.attributes = libraryEntry.attributes;
	if (!this.attributes) this.attributes = {};

	function hideTheField(fieldName, condition) {
		if (!this.attributes[fieldName]) this.attributes[fieldName] = {};
		if (condition) this.attributes[fieldName].hidden = true;
	}
	// build array of study outputs which should be considered valid fields in the study dialog "Field" dropdown
	var actualOutputs = [],
		s = stx.layout.studies;
	var excludes = [];
	if (sd) excludes = Array.prototype.concat(sd, sd.getDependents(stx));
	for (var n in s) {
		if (excludes.indexOf(s[n]) > -1) continue; // don't include its own fields or its dependents' fields
		for (var actualOutput in s[n].outputMap) {
			actualOutputs.push(actualOutput);
		}
	}

	/*
		This code loops through the acceptable inputs for the study in question. The format of the input default in the studyLibrary determines what type of input
		is required. For instance a number requires an input field. A string will produce a select box, of moving averages for instance if the string is "ma".
		If the string is "field" then a select box of acceptable fields is displayed. Likewise, an array will show up as a select box.
		 */
	for (var i in libraryEntry.inputs) {
		var input = {};
		this.inputs.push(input);
		input.name = i;
		input.heading = stx.translateIf(i);
		var acceptedData = libraryEntry.inputs[i];
		if (
			sd &&
			sd.inputs &&
			typeof sd.inputs[i] != "undefined" &&
			sd.inputs[i] !== null
		)
			input.value = sd.inputs[i];
		else input.value = libraryEntry.inputs[i];

		input.defaultInput = libraryEntry.inputs[i];
		if (!this.attributes[i])
			this.attributes[i] = CIQ.Studies.inputAttributeDefaultGenerator(
				input.defaultInput
			);

		if (acceptedData.constructor == Number) {
			input.type = "number";
		} else if (acceptedData.constructor == String) {
			var isMA = CIQ.Studies.movingAverageHelper(stx, input.defaultInput);
			if (isMA) {
				input.type = "select";
				input.defaultInput = isMA;
				var converted = CIQ.Studies.movingAverageHelper(stx, input.value);
				if (!converted) converted = input.value;
				input.value = converted;
				input.options = CIQ.Studies.movingAverageHelper(stx, "options");
			} else if (acceptedData == "field") {
				input.type = "select";
				input.options = {};
				var studyFields = [
					"Open",
					"High",
					"Low",
					"Close",
					"Adj_Close",
					"hl/2",
					"hlc/3",
					"hlcc/4",
					"ohlc/4",
					chart.defaultPlotField
				].concat(actualOutputs);
				for (var field = 0; field < studyFields.length; field++) {
					var fieldText = studyFields[field];
					input.options[fieldText] = stx.translateIf(fieldText);
				}
				if (input.value == "field") {
					input.value = "Close";
				}
				if (input.defaultInput == "field") {
					input.defaultInput = "Close";
				}
			} else {
				input.type = "text";
				if (this.attributes[i].placeholder == "yyyy-mm-dd") input.type = "date";
				else if (this.attributes[i].placeholder == "hh:mm:ss")
					input.type = "time";
			}
		} else if (acceptedData.constructor == Boolean) {
			input.type = "checkbox";
			if (input.value === true || input.value == "true" || input.value == "on")
				input.value = true;
		} else if (acceptedData.constructor == Array) {
			input.type = "select";
			input.options = {};
			for (var ii = 0; ii < acceptedData.length; ii++) {
				input.options[acceptedData[ii]] = stx.translateIf(acceptedData[ii]);
			}
			if (input.value.constructor == Array) {
				input.value = input.value[0];
			}
			if (this.attributes[i].defaultSelected) {
				input.defaultInput = this.attributes[i].defaultSelected;
			} else {
				input.defaultInput = acceptedData[0];
			}
		}
	}

	// find datetime inputs (these have two fields named "xyz Date" and "xyz Time").  We extract the xyz and put in array
	this.dateTimeInputs = [];
	for (var dateInput = 0; dateInput < this.inputs.length; dateInput++) {
		var date = this.inputs[dateInput];
		if (date.type == "date") {
			var fieldName = date.name.substring(0, date.name.indexOf(" Date"));
			for (var timeInput = 0; timeInput < this.inputs.length; timeInput++) {
				var time = this.inputs[timeInput];
				if (time.type == "time") {
					if (time.name == fieldName + " Time") {
						this.dateTimeInputs.push(fieldName);
						break;
					}
				}
			}
		}
	}

	// adjust date inputs for displayZone
	this.adjustInputTimesForDisplayZone();

	/*
		Outputs are much simpler than inputs. Outputs are simply a list of available outputs and the selected color for that output. So here
		we print a line item in the dialog for each output and attach a color picker to it. The color picker is obtained from the Context.
		 */

	for (i in libraryEntry.outputs) {
		var output = {
			name: i,
			heading: stx.translateIf(i)
		};

		output.color = output.defaultOutput = libraryEntry.outputs[i];
		if (sd && sd.outputs && sd.outputs[i]) output.color = sd.outputs[i];
		if (output.color == "auto") output.color = stx.defaultColor;
		this.outputs.push(output);
	}

	/* And now the parameters */
	var parameters = sd ? sd.parameters : null;
	if (libraryEntry.parameters) {
		var init = libraryEntry.parameters.init;
		if (init) {
			var obj;
			if (init.studyOverZonesEnabled !== undefined) {
				obj = {
					name: "studyOverZones",
					heading: stx.translateIf("Show Zones"),
					defaultValue: init.studyOverZonesEnabled,
					value: init.studyOverZonesEnabled
				};
				if (
					parameters &&
					(parameters.studyOverZonesEnabled ||
						parameters.studyOverZonesEnabled === false)
				) {
					obj.value = parameters.studyOverZonesEnabled;
				}
				obj.type = "checkbox";
				this.parameters.push(obj);
			}

			if (init.studyOverBoughtValue !== undefined) {
				obj = {
					name: "studyOverBought",
					heading: stx.translateIf("OverBought"),
					defaultValue: init.studyOverBoughtValue,
					value: init.studyOverBoughtValue,
					defaultColor: init.studyOverBoughtColor,
					color: init.studyOverBoughtColor
				};
				if (parameters && parameters.studyOverBoughtValue)
					obj.value = parameters.studyOverBoughtValue;
				if (parameters && parameters.studyOverBoughtColor)
					obj.color = parameters.studyOverBoughtColor;
				if (obj.color == "auto") obj.color = stx.defaultColor;
				obj.type = "text";
				this.parameters.push(obj);
			}

			if (init.studyOverSoldValue !== undefined) {
				obj = {
					name: "studyOverSold",
					heading: stx.translateIf("OverSold"),
					defaultValue: init.studyOverSoldValue,
					value: init.studyOverSoldValue,
					defaultColor: init.studyOverSoldColor,
					color: init.studyOverSoldColor
				};
				if (parameters && parameters.studyOverSoldValue)
					obj.value = parameters.studyOverSoldValue;
				if (parameters && parameters.studyOverSoldColor)
					obj.color = parameters.studyOverSoldColor;
				if (obj.color == "auto") obj.color = stx.defaultColor;
				obj.type = "text";
				this.parameters.push(obj);
			}

			if (!this.attributes.studyOverBoughtValue)
				this.attributes.studyOverBoughtValue = {};
			if (!this.attributes.studyOverSoldValue)
				this.attributes.studyOverSoldValue = {};
		}
	}

	/* Automatic parameters such as panel and axis, if enabled */
	function selectObject(sourceObj) {
		var options = {};
		var defaults = sourceObj.defaults;
		var obj = {
			name: sourceObj.name,
			heading: stx.translateIf(sourceObj.label),
			defaultValue: defaults[0],
			value: sourceObj.value,
			options: options,
			type: "select"
		};

		for (var i = 0; i < defaults.length; i++) {
			options[defaults[i]] = stx.translateIf(defaults[i]);
		}

		if (sourceObj.color !== undefined) {
			obj.defaultColor = stx.defaultColor;
			obj.color = sourceObj.color;
		}

		return obj;
	}
	function checkboxObject(sourceObj) {
		var obj = {
			name: sourceObj.name,
			heading: stx.translateIf(sourceObj.label),
			defaultValue: sourceObj.defaults,
			value: sourceObj.value,
			type: "checkbox"
		};

		return obj;
	}
	var panelSelect = (this.panelSelect = params.panelSelect),
		axisSelect = (this.axisSelect = params.axisSelect);
	function alias(panel) {
		function format(p, i) {
			return "Panel " + i.toString();
		}
		if (panelSelect == "alias") {
			var i = 1;
			for (var p in stx.panels) {
				if (p == panel) return format(p, i);
				i++;
			}
		}
		return panel;
	}
	// not allowed to pick panel or axis if we pop up the dialog before the study is added.
	if (params.addWhenDone) axisSelect = panelSelect = false;
	if (axisSelect || panelSelect) {
		if (!sd) {
			sd = CIQ.Studies.addStudy(stx, params.name, null, null, {
				calculateOnly: true
			});
			CIQ.Studies.removeStudy(stx, sd);
		}
		if (panelSelect) {
			this.parameters.push(
				selectObject({
					label: "Panel",
					name: "panelName",
					defaults: (function () {
						var defaults = [];
						defaults.push("Auto");
						for (var pnl in stx.panels) {
							if (pnl != sd.panel || !parameters || !parameters.panelName)
								defaults.push(alias(pnl));
						}
						if (!stx.checkForEmptyPanel(sd.panel, true, sd))
							defaults.push("New panel");
						return defaults;
					})(),
					value:
						parameters && parameters.panelName
							? alias(parameters.panelName)
							: "Auto"
				}),
				checkboxObject({
					label: "Show as Underlay",
					name: "underlay",
					defaults: false,
					value: sd.underlay || (sd.parameters && sd.parameters.underlayEnabled)
				})
			);
		}
		var myAxis = stx.getYAxisByName(panel, sd.name);
		if (axisSelect) {
			this.parameters.push(
				selectObject({
					label: "Y-Axis",
					name: "yaxisDisplay",
					defaults: (function () {
						var yaxes = panel.yaxisLHS.concat(panel.yaxisRHS),
							defaults = [];
						defaults.push("default", "right", "left", "none", "shared");
						for (var yax = 0; yax < yaxes.length; yax++) {
							if (yaxes[yax] != myAxis) defaults.push(yaxes[yax].name);
						}
						return defaults;
					})(),
					value:
						(parameters && parameters.yaxisDisplayValue) ||
						(myAxis && myAxis.position) ||
						(sd.panel != sd.name
							? "shared"
							: panel.yAxis.position || "default"),
					color: myAxis && myAxis.textStyle ? myAxis.textStyle : "auto"
				}),
				checkboxObject({
					label: "Invert Y-Axis",
					name: "flipped",
					defaults: false,
					value: parameters
						? parameters.flippedEnabled
						: myAxis
						? myAxis.flipped
						: false
				})
			);
		}

		hideTheField.call(this, "flippedEnabled", !myAxis && sd.panel != sd.name);
		hideTheField.call(this, "underlayEnabled", libraryEntry.underlay);
		hideTheField.call(this, "panelName", libraryEntry.seriesFN === null);
		hideTheField.call(
			this,
			"yaxisDisplayValue",
			libraryEntry.seriesFN === null ||
				(libraryEntry.yAxis && libraryEntry.yAxis.noDraw)
		);
	}
};

/**
 * Update (or add) the study attached to the DialogHelper.
 *
 * Once added or modified, the new study descriptor will be stored in the `sd` object of the DialogHelper.
 * The DialogHelper members will be updated when calling this function to reflect the changes.
 * However, other DialogHelper instances which exist will not be refreshed;
 * for example, options which list all panels or all fields will not contain any new records or have old records removed as a result of another helper's update.
 * In that case, you will need to recreate the helper before reusing it.
 *
 * @param  {Object} updates If updating, it should contain an object with updates to the `inputs`, `outputs` and `parameters` object used in {@link CIQ.Studies.addStudy}.  A new study ID will be created using the default format or parameters.replaceID, if provided.
 * @memberof CIQ.Studies.DialogHelper
 * @example
 * var helper=new CIQ.Studies.DialogHelper({sd:sd, stx:stx});
 * helper.updateStudy({inputs:{Period:60}});
 * var updatedStudy = helper.sd;
 * @example
 * // add the study
 * var initialStudy = CIQ.Studies.addStudy(stxx, "Aroon");
 *
 * // move it to the primary (chart) panel
 * var dialogHelper = new CIQ.Studies.DialogHelper({"stx":stxx,"sd":initialStudy});
 * dialogHelper.updateStudy({"parameters":{"panelName":"chart"}});
 *
 * // move the updated study back to its own panel
 * dialogHelper.updateStudy({"parameters":{"panelName":"New panel"}});
 *
 * @since 6.3.0 This instance will refresh after an update; recreating it is no longer necessary.
 */
CIQ.Studies.DialogHelper.prototype.updateStudy = function (updates) {
	var newParams = {};
	var sd = this.sd;
	var libraryEntry = this.libraryEntry;
	if (!libraryEntry) libraryEntry = {};
	if (!sd) sd = libraryEntry;
	newParams.inputs = CIQ.clone(sd.inputs);
	newParams.outputs = CIQ.clone(sd.outputs);
	newParams.parameters = CIQ.clone(sd.parameters);

	// adjust date inputs for displayZone
	this.adjustInputTimesForDisplayZone(updates);

	function dealias(panel) {
		function extractPanelNumber(p) {
			var match = p.match(/.* (\d)/);
			return match && match[1];
		}
		if (this.panelSelect == "alias") {
			var i = extractPanelNumber(panel);
			if (i) {
				for (var p in this.stx.panels) {
					if (!--i) return p;
				}
			}
		}
		return panel;
	}

	if (updates.parameters && updates.parameters.panelName) {
		updates.parameters.panelName = dealias.call(
			this,
			updates.parameters.panelName
		);
	}
	CIQ.extend(newParams, updates);
	if (!newParams.parameters) newParams.parameters = {};
	if (newParams.inputs && newParams.inputs.id) {
		sd = CIQ.Studies.replaceStudy(
			this.stx,
			newParams.inputs.id,
			this.name,
			newParams.inputs,
			newParams.outputs,
			newParams.parameters,
			null,
			sd.study
		);
	} else {
		sd = CIQ.Studies.addStudy(
			this.stx,
			this.name,
			newParams.inputs,
			newParams.outputs,
			newParams.parameters,
			null,
			sd.study
		);
	}
	var newHelper = new CIQ.Studies.DialogHelper({
		stx: this.stx,
		sd: sd,
		axisSelect: this.axisSelect,
		panelSelect: this.panelSelect
	});
	for (var obj in newHelper) {
		if (obj != "signal") this[obj] = newHelper[obj];
	}
	this.signal *= -1; // signal a change to an observer
};

/**
 * Adjust all date & time fields in the DialogHelper to use the display zone.
 *
 * This function can adjust both to and from the display zone depending on the presence of the second argument.
 * When creating the DialogHelper, the second argument is null, and any date and time in the study descriptor's inputs is converted to display zone when stored in the DialogHelper's `inputs` property.
 * When updating the DialogHelper, the second argument contains any changed fields.  If a date or time has been changed, it is converted back from display zone so it can be stored correctly in the study descriptor.  It is assumed that the updated date and time are in display zone already.
 * The function adjusts the time by changing the `updates` object if it is passed, or the `inputs` property if it is not.
 *
 * In the example below, it is assumed that there are input fields named "Anchor Date" and "Anchor Time".  Whenever you want to set up an input field with date and time, use this convention:
 * Name both fields the same name and add " Date" to one and " Time" to the other.
 *
 * @param  {Object} [updates] If updating, it should contain an object with updates to the `inputs` object used in {@link CIQ.Studies.addStudy}.
 * @memberof CIQ.Studies.DialogHelper
 * @example
 * var helper=new CIQ.Studies.DialogHelper({sd:sd, stx:stx});
 * var updates={inputs:{"Anchor Time":"06:00"}};
 * helper.adjustInputTimesForDisplayZone(updates});
 *
 * @since 6.3.0
 */
CIQ.Studies.DialogHelper.prototype.adjustInputTimesForDisplayZone = function (
	updates
) {
	if (this.stx.displayZone) {
		// adjust date inputs for displayZone
		for (var dtField = 0; dtField < this.dateTimeInputs.length; dtField++) {
			var field = this.dateTimeInputs[dtField];
			// build the date string
			var i,
				newDate,
				newTime,
				thisInput,
				dtStr = "";
			if (updates && updates.inputs) {
				newDate = updates.inputs[field + " Date"];
				newTime = updates.inputs[field + " Time"];
				if (newDate) dtStr = newDate;
				if (newTime) dtStr += newTime;
			}
			for (i = 0; i < this.inputs.length; i++) {
				thisInput = this.inputs[i];
				if (!newDate && newDate !== "" && thisInput.name == field + " Date")
					dtStr = thisInput.value + dtStr;
				else if (
					!newTime &&
					newTime !== "" &&
					thisInput.name == field + " Time"
				)
					dtStr += thisInput.value;
			}
			dtStr = dtStr.replace(/\D/g, "");
			if (dtStr.length < 12) return; // date only
			// create date object and adjust
			var datetime = CIQ.strToDateTime(dtStr);
			var adjDate;
			if (!isNaN(datetime.valueOf())) {
				if (updates) {
					if (!updates.inputs) updates.inputs = {};
					adjDate = CIQ.convertTimeZone(datetime, this.stx.displayZone);
					updates.inputs[field + " Date"] = CIQ.yyyymmdd(adjDate);
					updates.inputs[field + " Time"] = CIQ.hhmmss(adjDate);
				} else {
					adjDate = CIQ.convertTimeZone(datetime, null, this.stx.displayZone);
					for (i = 0; i < this.inputs.length; i++) {
						thisInput = this.inputs[i];
						if (thisInput.name == field + " Date")
							thisInput.value = CIQ.yyyymmdd(adjDate);
						if (thisInput.name == field + " Time")
							thisInput.value = CIQ.hhmmss(adjDate);
					}
				}
			}
		}
	}
};

/**
 * Prepares a study descriptor for use by assigning default calculation or display functions if required and configuring the outputMap
 * which is used internally to determine the color for each output.
 * @private
 * @param  {CIQ.ChartEngine} stx A chart object
 * @param  {object} study The study library entry
 * @param  {studyDescriptor} sd The study descriptor being prepared
 * @memberof CIQ.Studies
 * @since
 * - 6.2.0 Added `calculateOnly` parameter.
 * - 7.1.0 Removed `calculateOnly` parameter. Moved rejigger functionality out and into
 * 		[replaceStudy]{@link CIQ.Studies.replaceStudy}.
 */
CIQ.Studies.prepareStudy = function (stx, study, sd) {
	if (typeof study.calculateFN == "undefined") study.useRawValues = true;
	//if(typeof(study.seriesFN)=="undefined") study.seriesFN=CIQ.Studies.displaySeriesAsLine;

	// Unless overridden by the calculation function we assume the convention that the dataSet entries
	// will begin with the output name such as "RSI rsi (14)"
	if (CIQ.isEmpty(sd.outputMap)) {
		for (var i in sd.outputs) {
			if (study.useRawValues) {
				sd.outputMap[i] = i;
			} else {
				sd.outputMap[i + " " + sd.name] = i;
			}
		}
	}
};

/**
 * Fixes any derived studies or drawings that were based off of a study that has just changed.
 * This is called after the study has been modified.
 *
 * For instance a moving average on another overlay, or a moving average on an RSI.<br>
 * The panel name needs to change and the input "Field".
 * @private
 * @param  {CIQ.ChartEngine} stx	   The stx instance
 * @param  {StudyDescriptor} masterStudy The old study whose dependents are to be rejiggered
 * @param  {string} newID	 The new ID for the underlying study
 * @memberof CIQ.Studies
 * @since
 * - 5.2.0 Removed `panelID` argument.
 * - 7.0.0 Also fixes drawings.
 * - 7.1.0 Changed second argument.
 */
CIQ.Studies.rejiggerDerivedStudies = function (stx, masterStudy, newID) {
	var replaceID = masterStudy.name;
	var oldPanel = masterStudy.panel;
	var dependents = masterStudy.getDependents(stx);
	for (var s = 0; s < dependents.length; s++) {
		var st = dependents[s];
		var inputs = CIQ.clone(st.inputs);
		var oldId = inputs.id;
		if (!oldId) continue;
		var stNeedsReplacement = false;
		var fieldInputs = CIQ.Studies.getFieldInputs(st);
		for (var f = 0; f < fieldInputs.length; f++) {
			inputs[fieldInputs[f]] = inputs[fieldInputs[f]].replace(replaceID, newID);
		}
		var sd = CIQ.Studies.replaceStudy(
			stx,
			oldId,
			st.type,
			inputs,
			st.outputs,
			CIQ.extend(st.parameters, { rejiggering: true }),
			null,
			st.study
		);
		delete sd.parameters.rejiggering;
	}
};

/**
 * Removes any series that the study is referencing.
 *
 * @param {object} sd Study descriptor.
 * @param {CIQ.ChartEngine} stx The chart engine.
 *
 * @memberof CIQ.Studies
 * @since
 * - 3.0.0
 * - 3.0.7 Changed `name` argument to take a study descriptor.
 * - 3.0.7 Added required `stx` argument.
 */
CIQ.Studies.removeStudySymbols = function (sd, stx) {
	if (sd.series) {
		for (var s in sd.series) {
			stx.deleteSeries(sd.series[s], null, { action: "remove-study" });
		}
	}
	//stx.draw();
};

/**
 * Replaces an existing study with new inputs, outputs and parameters.
 *
 * When using this method a study's position in the stack will remain the same. Derived (child) studies will shift to use the new study as well
 * @param {CIQ.ChartEngine} stx		The chart object
 * @param {string} id 		The id of the current study. If set, then the old study will be replaced
 * @param {string} type	   The name of the study (out of the studyLibrary)
 * @param {object} [inputs]	 Inputs for the study instance. Default is those defined in the studyLibrary.
 * @param {object} [outputs]	Outputs for the study instance. Default is those defined in the studyLibrary.
 * @param {object} [parameters] additional custom parameters for this study if supported or required by that study
 * @param {string} [panelName] Optionally specify the panel. If not specified then an attempt will be made to locate a panel based on the input id or otherwise created if required.
 * @param {object} [study] Optionally supply a study definition, overriding what may be found in the study library
 * @return {object} A study descriptor which can be used to remove or modify the study.
 * @since 3.0.0 Added `study` parameter.
 * @memberof CIQ.Studies
 */
CIQ.Studies.replaceStudy = function (
	stx,
	id,
	type,
	inputs,
	outputs,
	parameters,
	panelName,
	study
) {
	if (!parameters) parameters = {};
	if (id) parameters.replaceID = id;
	id = parameters.replaceID;
	var sd = stx.layout.studies[id];
	CIQ.Studies.removeStudySymbols(sd, stx);
	if (sd.attribution) stx.removeFromHolder(sd.attribution.marker);
	if (stx.quoteDriver) stx.quoteDriver.updateSubscriptions();
	var newSD;
	if (inputs) {
		if (inputs.id == inputs.display) delete inputs.display;
		delete inputs.id;
	}
	newSD = CIQ.Studies.addStudy(
		stx,
		type,
		inputs,
		outputs,
		parameters,
		panelName,
		study
	);
	newSD.highlight = sd.highlight;

	// move the new study into the place of the old study
	var s,
		tmp = {};
	for (s in stx.layout.studies) {
		if (s == id) tmp[newSD.name] = newSD;
		else tmp[s] = stx.layout.studies[s];
	}
	stx.layout.studies = tmp;
	tmp = {};
	for (s in stx.overlays) {
		if (s == id) {
			if (newSD.overlay || newSD.underlay) tmp[newSD.name] = newSD;
		} else tmp[s] = stx.overlays[s];
	}
	stx.overlays = tmp;
	if (!stx.overlays[newSD.name] && (newSD.overlay || newSD.underlay))
		stx.addOverlay(newSD);

	stx.checkForEmptyPanel(sd.panel); // close any evacuated panels

	if (!parameters.rejiggering) {
		// done to initialize yAxes on panels
		stx.initializeDisplay(stx.chart);

		// Rename any overlays that relied on the old panel ID name, for instance a moving average on RSI(14)
		CIQ.Studies.rejiggerDerivedStudies(stx, sd, newSD.inputs.id, newSD.panel);

		stx.changeOccurred("layout");
		if (
			!stx.currentlyImporting &&
			!parameters.calculateOnly &&
			newSD.chart.dataSet
		) {
			// silent mode while importing
			stx.createDataSet(null, newSD.chart);
		}
		stx.draw();
	}
	CIQ.transferObject(sd, newSD); // we do this so the developer retains use of his handle to the study
	stx.layout.studies[newSD.name] = sd;
	stx.overlays[newSD.name] = sd;
	return sd;
};

/**
 * Adds or replaces a study on the chart.
 *
 * A [layout change event]{@link layoutEventListener} is triggered when this occurs.
 *
 * See {@tutorial Using and Customizing Studies} for more details.
 *
 * <P>Example: <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/5y4a0kry/embedded/result,js,html,css/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * Optionally you can [define an edit event listeners]{@link CIQ.ChartEngine#addEventListener} to call a custom function that can handle initialization of a dialog box for editing studies.
 * - Use {@link studyPanelEditEventListener} to link the cog wheel on study panels to your desired edit menu/functionality.
 * - Use {@link studyOverlayEditEventListener} to link the right click on study overlays to your desired edit menu/functionality.
 * - All studies will use the same function set by the event listeners.
 * - If there are no event listeners set, the edit study buttons/functionality will not appear.
 * - The 'Study Edit' feature is standard functionality in the advanced sample template.
 * - See `Examples` section for exact function parameters and return value requirements.<br>
 * - Please note that these listeners must be set **before** you call importLayout. Otherwise your imported studies will not have an edit capability.
 *
 * Use the {@link CIQ.Tooltip} addOn if you wish to display values on mouse hover.<br>
 * Alternatively, you can create your own Heads-Up-Display (HUD) using this tutorial: {@tutorial Custom Heads-Up-Display (HUD)}
 *
 * @param {CIQ.ChartEngine} stx		The chart object
 * @param {string} type	   The name of the study (object key on the {@link CIQ.Studies.studyLibrary})
 * @param {object} [inputs]	 Inputs for the study instance. Default is those defined in the studyLibrary. Note that if you specify this object, it will be combined with (override) the library defaults. To bypass a library default, set that field to null.
 * @param {string} [inputs.id] The id of the current study. If set, then the old study will be replaced
 * @param {string} [inputs.display] The display name of the current study. If not set, a name generated by {@link CIQ.Studies.prettyDisplay} will be used. Note that if the study descriptor defines a `display` name, the study descriptor name will allays override this parameter.
 * @param {object} [outputs]	Outputs for the study instance. Default is those defined in the studyLibrary. Values specified here will override those in the studyLibrary.
 * @param {object} [parameters] Additional custom parameters for this study if supported or required by that study. Default is those defined in the {@link CIQ.Studies.studyLibrary}.
 * @param {object} [parameters.replaceID] If `inputs.id` is specified, this value can be used to set the new ID for the modified study( will display as the study name on the study panel). If omitted the existing ID will be preserved.
 * @param {object} [parameters.display] If this is supplied, use it to form the full study name. Otherwise `studyName` will be used. Is both `inputs.display` and `parameters.display` are set, `inputs.display` will always take precedence.<br>ie: if custom name is 'SAMPLE', the unique name returned would resemble "SAMPLE(param1,param2,param3,...)-X".
 * @param {object} [parameters.calculateOnly] Only setup the study for calculations and not display.  If this is supplied, UI elements will not be added.
 * @param {string} [parameters.panelName] Optionally specify the panel. If set to "New panel" a new panel will be created for the study. If not specified or an invalid panel name is provided, then an attempt will be made to locate a panel based on the input id or otherwise created if required. Multiple studies can be overlaid on any panel.
 * @param {string} [panelName] Deprecated. Panel name.  Use parameters.panelName instead.
 * @param {object} [study] Study definition, overriding what may be found in the study library
 * @return {studyDescriptor} A study descriptor which can be used to remove or modify the study.
 * @since
 * - 3.0.0 Added `study` parameter.
 * - 5.1.1 Added `parameters.display`. If this parameter is supplied, use it to form the full study name.
 * - 5.2.0 Multiple studies can be overlaid on any panel using the `panelName` parameter.
 * - 7.1.0 Changed specification for a new panel in `panelName` from "Own panel" to "New panel".
 * @deprecated Since 6.3.0 `panelName` argument is deprecated but maintained for backwards compatibility. Use `parameters.panelName` instead.
 * @memberof CIQ.Studies
 * @example <caption>Add a volume underlay study with custom colors:</caption>
 * CIQ.Studies.addStudy(stxx, "vol undr", {}, {"Up Volume":"#8cc176","Down Volume":"#b82c0c"});
 * @example <caption>Define the edit function for study Panels:</caption>
 * var params={stx:stx,sd:sd,inputs:inputs,outputs:outputs, parameters:parameters};
 * stxx.addEventListener("studyPanelEdit", function(studyData){
 *		// your code here
 * });
 * @example <caption>Define the edit function for study overlays:</caption>
 * stxx.addEventListener("studyOverlayEdit", function(studyData){
 *	  CIQ.alert(studyData.sd.name);
 *	  var helper=new CIQ.Studies.DialogHelper({name:studyData.sd.type,stx:studyData.stx});
 *	  console.log('Inputs:',JSON.stringify(helper.inputs));
 *	  console.log('Outputs:',JSON.stringify(helper.outputs));
 *	  console.log('Parameters:',JSON.stringify(helper.parameters));
 *	  // call your menu here with the  data returned in helper
 *	  // modify parameters as needed and call addStudy or replaceStudy
 * });
 * @example <caption>Add an Aroon study with a custom display name:</caption>
 * CIQ.Studies.addStudy(stxx, "Aroon",null,null,{display:'Custom Name'});
 */
CIQ.Studies.addStudy = function (
	stx,
	type,
	inputs,
	outputs,
	parameters,
	panelName,
	study
) {
	var libraryEntry = study ? study : CIQ.Studies.studyLibrary[type];

	if (!parameters) parameters = {};
	if (libraryEntry) {
		if (libraryEntry.inputs) {
			// Default to the library inputs
			var libraryInputs = CIQ.clone(libraryEntry.inputs);
			for (var i in libraryInputs) {
				// But set any arrays to the default (the first item in the array)
				if (libraryInputs[i] instanceof Array) {
					if (
						libraryEntry.attributes &&
						libraryEntry.attributes[i] &&
						libraryEntry.attributes[i].defaultSelected
					) {
						libraryInputs[i] = libraryEntry.attributes[i].defaultSelected;
					} else {
						libraryInputs[i] = libraryInputs[i][0];
					}
				}
			}
			// Now override the library inputs with anything the user passed in
			inputs = CIQ.extend(libraryInputs, inputs);
		}
		if (libraryEntry.outputs) {
			outputs = CIQ.extend(CIQ.clone(libraryEntry.outputs), outputs);
		}
		var libraryParameters = libraryEntry.parameters;
		if (libraryParameters && libraryParameters.init) {
			parameters = CIQ.extend(CIQ.clone(libraryParameters.init), parameters);
		}

		if (libraryParameters && !parameters.display) {
			parameters.display = libraryParameters.display;
		}
	}

	if (!inputs) inputs = CIQ.clone(CIQ.Studies.DEFAULT_INPUTS);
	if (!outputs) outputs = CIQ.clone(CIQ.Studies.DEFAULT_OUTPUTS);
	if (!parameters.chartName) parameters.chartName = "chart";
	if (parameters.panelName == "Auto" || parameters.panelName == "Default panel")
		parameters.panelName = "";

	if (inputs.Period < 1) inputs.Period = 1; // periods can't be less than one candle. This is a general safety check. Each study should have a check or add input validation.

	if (!inputs.id) {
		inputs.id = CIQ.Studies.generateID(
			stx,
			type,
			inputs,
			parameters.replaceID,
			parameters.display
		);
	}
	var sd = null;
	if (!stx.layout.studies) stx.layout.studies = {};
	if (libraryEntry && libraryEntry.initializeFN) {
		sd = libraryEntry.initializeFN(
			stx,
			type,
			inputs,
			outputs,
			parameters,
			panelName,
			study
		);
	} else {
		sd = CIQ.Studies.initializeFN(
			stx,
			type,
			inputs,
			outputs,
			parameters,
			panelName,
			study
		);
	}
	if (!sd) {
		console.log(
			"CIQ.Studies.addStudy: initializeFN() returned null for " + type
		);
		return;
	}
	study = sd.study;
	sd.chart = stx.charts[parameters.chartName];
	sd.type = type;
	sd.permanent = study.permanent;
	sd.customLegend = study.customLegend;
	CIQ.Studies.prepareStudy(stx, study, sd);

	var state = stx.chart.state.studies;
	if (!state) state = stx.chart.state.studies = {};
	state.sorted = null; // nullify sort order

	var noDraw;
	if (!parameters.replaceID) {
		stx.layout.studies[sd.inputs.id] = sd;
		if (sd.overlay || sd.underlay) stx.addOverlay(sd);
		if (
			!stx.currentlyImporting &&
			!parameters.calculateOnly &&
			sd.chart.dataSet
		) {
			// silent mode while importing
			stx.createDataSet(null, sd.chart);
		}
	} else {
		noDraw = true;
		delete parameters.replaceID;
	}
	//if(!stx.currentlyImporting) CIQ.Studies.checkSymbolChanged(stx, sd, "add-study");
	if (stx.quoteDriver) stx.quoteDriver.updateSubscriptions();
	stx.changeOccurred("layout");
	if (parameters.calculateOnly) return sd;

	var panel = stx.panels[sd.panel];
	var hasEditCallback = false;
	var isPanelStudy = !(sd.overlay || sd.underlay);

	if (isPanelStudy && study.horizontalCrosshairFieldFN) {
		panel.horizontalCrosshairField = study.horizontalCrosshairFieldFN(stx, sd);
	}

	if (stx.editCallback) {
		hasEditCallback = true;
	} else if (isPanelStudy) {
		if (
			stx.callbackListeners.studyPanelEdit &&
			stx.callbackListeners.studyPanelEdit.length
		)
			hasEditCallback = true;
	} else {
		if (
			stx.callbackListeners.studyOverlayEdit &&
			stx.callbackListeners.studyOverlayEdit.length
		)
			hasEditCallback = true;
	}

	if (hasEditCallback) {
		parameters.editMode = true;
		var hasInput = false;
		for (var input in sd.inputs) {
			if (input == "id") continue;
			if (input == "display") continue;
			hasInput = true;
			break;
		}
		if (!hasInput) {
			for (var output in sd.outputs) {
				hasInput = true;
				break;
			}
		}
		if (hasInput) {
			var editFunction;
			if (typeof sd.study.edit != "undefined") {
				if (sd.study.edit) {
					editFunction = (function (stx, sd, inputs, outputs) {
						return function () {
							CIQ.clearCanvas(stx.chart.tempCanvas, stx); // clear any drawing in progress
							sd.study.edit(sd, {
								stx: stx,
								inputs: inputs,
								outputs: outputs,
								parameters: parameters
							});
						};
					})(stx, sd, inputs, outputs, parameters);
					stx.setPanelEdit(panel, editFunction);
					sd.editFunction = editFunction;
				}
			} else if (!isPanelStudy) {
				editFunction = (function (stx, sd, inputs, outputs, parameters) {
					return function (forceEdit) {
						CIQ.clearCanvas(stx.chart.tempCanvas, stx); // clear any drawing in progress
						stx.dispatch("studyOverlayEdit", {
							stx: stx,
							sd: sd,
							inputs: inputs,
							outputs: outputs,
							parameters: parameters,
							forceEdit: forceEdit
						});
					};
				})(stx, sd, inputs, outputs, parameters);
				sd.editFunction = editFunction;
			} else {
				if (stx.editCallback) {
					// deprecated legacy support
					editFunction = (function (stx, sd, inputs, outputs) {
						return function () {
							var dialogDiv = stx.editCallback(stx, sd);
							CIQ.clearCanvas(stx.chart.tempCanvas, stx); // clear any drawing in progress
							CIQ.Studies.studyDialog(stx, type, dialogDiv, {
								inputs: inputs,
								outputs: outputs,
								parameters: parameters
							});
						};
					})(stx, sd, inputs, outputs, parameters);
					if (panel.name != "chart") {
						stx.setPanelEdit(panel, editFunction);
					}
				} else {
					editFunction = (function (stx, sd, inputs, outputs, parameters) {
						return function () {
							CIQ.clearCanvas(stx.chart.tempCanvas, stx); // clear any drawing in progress
							stx.dispatch("studyPanelEdit", {
								stx: stx,
								sd: sd,
								inputs: inputs,
								outputs: outputs,
								parameters: parameters
							});
						};
					})(stx, sd, inputs, outputs, parameters);
					if (panel.name != "chart") {
						stx.setPanelEdit(panel, editFunction);
						sd.editFunction = editFunction;
					}
				}
			}
		}
	}
	if (!noDraw) stx.draw(); // we put this extra draw here in case of study parameters which affect the appearance of the y-axis, since adding a y-axis calls draw() but before the layout has changed.
	return sd;
};

/**
 * Removes a study from the chart (and panel if applicable)
 *
 * @param  {CIQ.ChartEngine} stx A chart object
 * @param  {studyDescriptor} sd  A study descriptor returned from {@link CIQ.Studies.addStudy}
 * @memberof CIQ.Studies
 */
CIQ.Studies.removeStudy = function (stx, sd) {
	var sPanel = stx.panels[sd.panel];
	var yAxisName = sPanel && sPanel.yAxis.name;
	if (sd.overlay || sd.underlay) {
		stx.removeOverlay(sd.name);
	}
	var panel = stx.panels[sd.panel];
	if (sd.attribution) stx.removeFromHolder(sd.attribution.marker);
	delete stx.layout.studies[sd.name];
	if (panel && !stx.checkForEmptyPanel(panel)) {
		if (yAxisName == sd.name) {
			// promote an overlay to own the panel (and axis maybe)
			stx.electNewPanelOwner(panel);
		}
		var studyAxis = stx.getYAxisByName(sd.panel, sd.name);
		if (studyAxis) {
			studyAxis.name = studyAxis.studies[1] || studyAxis.renderers[0];
		}
	}
	stx.draw();
	stx.resizeChart();
};

/**
 * Returns the panel which the study's Field input value references.
 *
 * For example, a ma (Moving Average) study with a Field of Volume may return the Volume panel, since that is the panel
 * where the Field input value may be found..
 * @param  {CIQ.ChartEngine} stx The charting object
 * @param  {studyDescriptor} sd	 The study descriptor
 * @return {string} Name of panel containing the output field corresponding to the Field input value, null if not found
 * @memberof CIQ.Studies
 * @since 6.3.0
 */
CIQ.Studies.getPanelFromFieldName = function (stx, sd) {
	var fieldInputs = CIQ.Studies.getFieldInputs(sd);
	if (!fieldInputs.length) return null;
	var s = stx.layout.studies;
	if (!s) return null;

	var studyPanelMap = {};
	for (var n in s) {
		for (var i in s[n].outputMap) studyPanelMap[i] = s[n].panel;
	}
	for (var f = 0; f < fieldInputs.length; f++) {
		var field = sd.inputs[fieldInputs[f]];
		if (field) {
			var mapEntry = studyPanelMap[field];
			if (mapEntry) return mapEntry;
		}
	}
	return null;
};

/**
 * Computes a hash of the study library keys. The hash can be assigned to a property so that `studyLibrary` changes can be observed.
 * This function is automatically called in the draw loop.
 *
 * @return {string} A hash of `studyLibrary` keys.
 * @memberof CIQ.Studies
 * @since 7.2.0
 */
CIQ.Studies.createLibraryHash = function () {
	return Object.keys(CIQ.Studies.studyLibrary).join("|"); // create a hash so we can observe the studyLibrary!
};

/**
 * <span class="animation">Animation Loop</span>
 * This method displays all of the studies for a chart. It is called from within the chart draw() loop.
 * @param  {CIQ.ChartEngine} stx The charting object
 * @param {CIQ.ChartEngine.Chart} chart Which chart to display studies for
 * @param {Boolean} [underlays=false] If set to true then underlays only will be displayed, otherwise underlays will be skipped
 * @memberof CIQ.Studies
 */
CIQ.Studies.displayStudies = function (stx, chart, underlays) {
	if (underlays) chart.studyLibraryHash = CIQ.Studies.createLibraryHash();
	var s = stx.layout.studies;
	if (!s) return;
	var permanentPanel = {}; // local map of permanent panels
	permanentPanel[chart.name] = true; // no X on chart panel
	for (var n in s) {
		var sd = s[n];
		var study = sd.study;
		if (!study) continue;
		var isUnderlay =
			sd.underlay || (sd.parameters && sd.parameters.underlayEnabled);
		if ((underlays && !isUnderlay) || (!underlays && isUnderlay)) continue;

		var rendererConfigs = CIQ.clone(study.renderer);
		if (rendererConfigs && !(rendererConfigs instanceof Array))
			rendererConfigs = [rendererConfigs];
		var panel = stx.panels[sd.panel];
		if (panel) {
			if (panel.chart != chart) continue;
			if (panel.hidden) continue;
			if (!permanentPanel[panel.name]) {
				var permanent = sd.permanent || !stx.manageTouchAndMouse;
				if (panel.closeX) {
					if (permanent) panel.closeX.style.display = "none";
				} else if (panel.close) {
					if (permanent) panel.close.style.display = "none";
				}
				if (panel.edit) {
					if (permanent) panel.edit.style.display = "none";
				}
				permanentPanel[panel.name] = permanent;
			}
		} else {
			//orphaned panel study, kill it on import
			if (stx.currentlyImporting) delete s[n];
			continue;
		}

		var quotes = sd.chart.dataSegment; // Find the appropriate data to drive this study

		// change the panel if it's an overlay and the underlying field has changed
		if (
			sd.panel == sd.parameters.chartName &&
			(!sd.parameters || !sd.parameters.panelName)
		) {
			var newPanel = CIQ.Studies.getPanelFromFieldName(stx, sd);
			if (newPanel && sd.panel != newPanel) sd.panel = newPanel;
		}
		if (typeof study.seriesFN == "undefined") {
			// null means don't display, undefined means display by default as a series
			if (rendererConfigs) {
				if (!sd.overlay) CIQ.Studies.createYAxis(stx, sd, quotes, panel);
				for (var r = 0; r < rendererConfigs.length; r++) {
					var params = rendererConfigs[r];
					// Get the input-specific output name from the outputMap.  At this point params.field is just the output name,
					// without any inputs. For example, "RSI" vs "RSI (14)".  Here we set it to the actual name used in dataSegment.
					for (var om in sd.outputMap) {
						if (sd.outputMap[om] == params.field) params.field = om;
					}
					if (!params.field) continue;
					params.panel = sd.panel;
					var binding = params.binding;
					// Binding is the ability to attach the color chosen by the user to a particular renderer property.
					if (binding) {
						for (var m in binding) {
							var color = CIQ.Studies.determineColor(sd.outputs[binding[m]]);
							if (color && color != "auto") params[m] = color;
							/*For future implementation
								if(typeof(sd.outputs[binding[m]])=="object"){
									params.pattern=sd.outputs[binding[m]].pattern;
									params.width=sd.outputs[binding[m]].width;
								}*/
						}
					}
					params.yAxis = null; // not allowed to specify y axis in these renderers
					var renderer = CIQ.Renderer.produce(params.type, params);
					renderer.stx = stx;
					renderer.attachSeries(null, params).draw();
				}
			} else {
				CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
			}
			if (panel) CIQ.Studies.displayError(stx, sd);
		} else {
			if (study.seriesFN) {
				if (panel) {
					study.seriesFN(stx, sd, quotes);
					CIQ.Studies.displayError(stx, sd);
				}
			}
		}
	}
};

/**
 * Displays a watermark on a panel for a study with `sd.error set`.
 *
 * The `sd.error` property can be set to true, which will display the default message "Not enough data to compute XXX",
 * or it can be set to a custom string which will be displayed as supplied.
 *
 * @param {CIQ.ChartEngine} stx The charting object.
 * @param {studyDescriptor} sd The study descriptor.
 * @param {Object} [params]	Additional options to customize the watermark.
 * @param {string} [params.panel] Name of the panel on which to display the error, defaults to `sd.panel`.
 * @param {string} [params.h] Watermark horizontal position.
 * @param {string} [params.v] Watermark vertical position.
 * @memberof CIQ.Studies
 * @since
 * - 3.0.0
 * - 4.0.0 Displays one error per panel. Added `params` object.
 * - 7.3.0 Errors without `params` or in center bottom, use
 * 		{@link CIQ.ChartEngine#displayErrorAsWatermark} instead of
 * 		{@link CIQ.ChartEngine#watermark}, which stacks errors vertically to prevent errors
 * 		overlaying other errors. Any other positioning is deprecated and results in multiple
 * 		errors at that location getting stacked on the z-axis.
 */
CIQ.Studies.displayError = function (stx, sd, params) {
	if (!sd.error) return;

	var panelKey = params && params.panel ? params.panel : sd.panel;
	var errorText =
		sd.error === true
			? stx.translateIf("Not enough data to compute ") +
			  stx.translateIf(sd.study.name)
			: stx.translateIf(sd.error);

	// backwards compatability
	if (params && (params.h !== "center" || params.v !== "bottom")) {
		stx.watermark(panelKey, params);
		return;
	}

	stx.displayErrorAsWatermark(panelKey, errorText);
};
/**
 * Convenience function for determining the min and max for a given data point.
 *
 * @param {CIQ.ChartEngine} stx The chart
 * @param {string} name The field to evaluate
 * @param {array} quotes The array of quotes to evaluate (typically dataSet, scrubbed or dataSegment)
 * @memberof CIQ.Studies
 * @return {object} Object containing the min and max data point values
 */
CIQ.Studies.calculateMinMaxForDataPoint = function (stx, name, quotes) {
	var min = Number.MAX_VALUE;
	var max = Number.MAX_VALUE * -1;
	for (var i = 0; i < quotes.length; i++) {
		var m = quotes[i][name];
		if (m === null || typeof m == "undefined") continue;
		if (isNaN(m)) continue;
		min = Math.min(m, min);
		max = Math.max(m, max);
	}
	return { min: min, max: max };
};

/**
 * Retrieves parameters to be used to draw the Y Axis, retrieved from the study library.
 *
 * If a range is set in the study library, the yAxis high and low properties are set.<br>
 * Invoked by {@link CIQ.ChartEngine.renderYAxis} before createYAxis
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {CIQ.ChartEngine.YAxis} yAxis	 The axis to act upon
 * @return {object} y-axis parameters such as noDraw, range, and ground
 * @memberof CIQ.Studies
 * @since 5.2.0
 */
CIQ.Studies.getYAxisParameters = function (stx, yAxis) {
	var parameters = {};
	var sd = stx.layout.studies && stx.layout.studies[yAxis.name];
	if (sd) {
		var study = sd.study;
		if (study.yaxis || study.yAxisFN) {
			parameters.noDraw = true;
		} else {
			// If zones are enabled then we don't want to draw the yAxis
			if (study.parameters && study.parameters.excludeYAxis)
				parameters.noDraw = true;
			parameters.ground = study.yAxis && study.yAxis.ground;
			if (yAxis) {
				if (study.range != "bypass") {
					if (study.range == "0 to 100") parameters.range = [0, 100];
					else if (study.range == "-1 to 1") parameters.range = [-1, 1];
					else {
						if (study.range == "0 to max") {
							parameters.range = [0, Math.max(0, yAxis.high)];
						} else if (study.centerline || study.centerline === 0) {
							parameters.range = [
								Math.min(study.centerline, yAxis.low),
								Math.max(study.centerline, yAxis.high)
							];
						}
					}
				}
				if (parameters.range) {
					yAxis.low = parameters.range[0];
					yAxis.high = parameters.range[1];
				}
				if (sd.min) yAxis.min = sd.min;
				if (sd.max) yAxis.max = sd.max;
				if (sd.parameters && sd.parameters.studyOverZonesEnabled)
					parameters.noDraw = true;
			}
		}
	}
	return parameters;
};

/**
 * studyOverZones will be displayed and Peaks & Valleys will be filled if corresponding thresholds are set in the study library as follows:
 * ```
 * "parameters": {
 *	init:{studyOverZonesEnabled:true, studyOverBoughtValue:80, studyOverBoughtColor:"auto", studyOverSoldValue:20, studyOverSoldColor:"auto"}
 * }
 * ```
 * Invoked by {@link CIQ.ChartEngine.renderYAxis} after createYAxis
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {CIQ.ChartEngine.YAxis} yAxis	 The axis to draw upon
 * @memberof CIQ.Studies
 * @since 5.2.0
 */
CIQ.Studies.doPostDrawYAxis = function (stx, yAxis) {
	for (var s in stx.layout.studies) {
		var sd = stx.layout.studies[s];
		var panel = stx.panels[sd.panel];
		if (!panel || panel.hidden) continue;
		var studyAxis = sd.getYAxis(stx);
		if (studyAxis != yAxis) continue;
		var study = sd.study;
		if (yAxis.name == sd.name) {
			// only draw the custom yAxis for a panel study, not an overlay
			if (study.yaxis) study.yaxis(stx, sd); // backward compatibility
			if (study.yAxisFN) study.yAxisFN(stx, sd); // Use yAxisFN for forward compatibility
		}
		CIQ.Studies.drawZones(stx, sd);

		if (!sd.error) {
			var centerline = study.centerline;
			if (
				centerline ||
				centerline === 0 ||
				(centerline !== null && yAxis.highValue > 0 && yAxis.lowValue < 0)
			) {
				CIQ.Studies.drawHorizontal(stx, sd, null, centerline || 0, yAxis);
			}
		}
	}
};

/**
 * Displays a single or group of series as lines in the study panel using {@link CIQ.Studies.displayIndividualSeriesAsLine}
 *
 * One series per output field declared in the study library will be displayed.<br>
 * It expects the 'quotes' array to have data fields for each series with keys in the outputMap format:
 * ```
 * 'output name from study library'+ " " + sd.name
 * ```
 * For most custom studies this function will do the work for you.
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {studyDescriptor} sd	 The study descriptor. See {@link CIQ.Studies.displayIndividualSeriesAsLine} for accepted `sd`  parameters.
 * @param  {array} quotes The set of quotes (dataSegment)
 * @memberof CIQ.Studies
 * @example
 * var study = {
 * 		overlay: true,
 * 		yAxis: {},
 * 		parameters: {
 * 			plotType: 'step',
 * 		},
 * 		seriesFN: function(stx, sd, quotes){
 * 			sd.extendToEnd=false;
 * 			sd.gaplines=false,
 * 			CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
 * 		}
 * 	};
 * 	CIQ.Studies.addStudy(stxx, "Vol", {}, {"Volume": "green"}, null, null, study);
 */
CIQ.Studies.displaySeriesAsLine = function (stx, sd, quotes) {
	if (!quotes.length) return;
	var panel = stx.panels[sd.panel];
	if (!panel || panel.hidden) return;

	for (var i in sd.outputMap) {
		CIQ.Studies.displayIndividualSeriesAsLine(stx, sd, panel, i, quotes);
	}
};

/**
 * Displays a single or group of series as histogram in the study panel.
 *
 * It expects the 'quotes' array to have data fields for each series with keys in the outputMap
 * format:
 * ```
 * 'output name from study library'+ " " + sd.name
 * ```
 *
 * It takes into account the following study fields (see {@link CIQ.ChartEngine#drawHistogram}
 * for details):
 * - `sd.inputs.HistogramType` &mdash; "overlaid", "clustered", or "stacked". Default "overlaid".
 * - `sd.outputs` &mdash; Can contain a color string or an object containing `{color, opacity}`.
 *    Default opacity ".3".
 * - `sd.parameters.widthFactor` &mdash; Default ".5".
 *
 * @param {CIQ.ChartEngine} stx The chart object.
 * @param {studyDescriptor} sd The study descriptor.
 * @param {array} quotes The set of quotes (`dataSegment`).
 *
 * @memberof CIQ.Studies
 * @since 7.0.0 No longer supports `sd.inputs.HeightPercentage`.
 * 		Use {@link CIQ.ChartEngine.YAxis#heightFactor} instead.
 *
 * @example
 * <caption>Adds a study panel that will display the High and Low values from the masterData as a
 * clustered histogram study.</caption>
 * CIQ.Studies.studyLibrary["Plot High Low"]={
 *     "seriesFN": CIQ.Studies.displaySeriesAsHistogram,
 *     inputs:{"HistogramType":["clustered","stacked","overlaid"]},
 *     outputs:{"High":"blue","Low":{color:"red",opacity:0.7},
 *     parameters:{"widthFactor":0.5},
 *     range: "0 to max",
 *     yAxis:{"ground":true,"initialMarginTop":0,"zoom":0, "heightFactor":0.5}
 * };
 * CIQ.Studies.addStudy(stxx, "Plot High Low");
 */
CIQ.Studies.displaySeriesAsHistogram = function (stx, sd, quotes) {
	if (!quotes.length) return;
	var panel = stx.panels[sd.panel];
	if (!panel) return;
	if (panel.hidden) return;

	var seriesParam = [];
	for (var i in sd.outputMap) {
		var output = sd.outputs[sd.outputMap[i]];
		if (!output) continue;
		var opacity = 0.3;
		if (typeof output == "object") {
			opacity = output.opacity;
			output = output.color;
		}
		var series = {
			field: i,
			fill_color_up: output,
			border_color_up: output,
			fill_color_down: output,
			border_color_down: output
		};
		if (sd.underlay) {
			series.opacity_up = series.opacity_down = opacity || 0.3;
		}
		seriesParam.push(series);
	}

	var yAxis = sd.getYAxis(stx);
	var inputs = sd.inputs;
	var widthFactor = inputs.WidthFactor;
	if (sd.study && sd.study.parameters) {
		var parms = sd.study.parameters;
		if (typeof parms.widthFactor !== "undefined")
			widthFactor = parms.widthFactor;
	}
	var params = {
		name: sd.name,
		type: inputs.HistogramType ? inputs.HistogramType : "overlaid",
		panel: sd.panel,
		yAxis: yAxis,
		widthFactor: widthFactor || 0.5,
		bindToYAxis: true,
		highlight: sd.highlight
	};

	stx.drawHistogram(params, seriesParam);
};

/**
 * Displays multiple data-points as series on a panel.
 *
 * This is the default display function for an indicator and will work for 90% of custom indicators.
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {studyDescriptor} sd	 The study descriptor.
 *
 * Set the following elements to customize behavior (see example):
 * - `sd.highlight` Set to true to highlight the line.
 * - `sd.gaplines` Follows the same rules as `params.gapDisplayStyle` in {@link CIQ.ChartEngine#drawLineChart}
 *
 * 	Set the flowing `parameters` to customize behavior (see example):
 * - `plotType` Set to "step" to draw a step line. See {@tutorial Chart Styles and Types} for more details.
 * - `noSlopes` Follows the same rules as `params.noSlopes` in {@link CIQ.ChartEngine#drawLineChart}
 * - extendToEnd=true
 *
 * @param  {CIQ.ChartEngine.Panel} panel  A reference to the study panel
 * @param  {string} name   The name of this output field (should match field from 'quotes' needed to render this line)
 * @param  {array} quotes The array of quotes (dataSegment)
 * @memberof CIQ.Studies
 * @since 5.2.0 The number of decimal places for the y-axis is determined by the distance between ticks as opposed to shadow.
 * @example
 * var study = {
 * 		overlay: true,
 * 		yAxis: {},
 * 		parameters: {
 * 			plotType: 'step',
 * 		},
 * 		seriesFN: function(stx, sd, quotes){
 * 			sd.extendToEnd=false;
 * 			sd.gaplines=false,
 * 			CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
 * 		}
 * 	};
 * 	CIQ.Studies.addStudy(stxx, "Vol", {}, {"Volume": "green"}, null, null, study);
 */
CIQ.Studies.displayIndividualSeriesAsLine = function (
	stx,
	sd,
	panel,
	name,
	quotes
) {
	if (!panel.height) panel.height = panel.bottom - panel.top;

	var context = sd.getContext(stx);
	var output = sd.outputs[sd.outputMap[name]];
	if (!output) return;

	// save the original context settings
	context.save();

	// backwards compatibility if the output is just a color string
	if (typeof output === "string") {
		output = {
			color: output,
			width: 1
		};
	}

	context.lineWidth = output.width || 1;

	var color = output.color;
	if (color == "auto") color = stx.defaultColor; // This is calculated and set by the kernel before draw operation.
	context.strokeStyle = color;

	var pattern = output.pattern;

	context.setLineDash(CIQ.borderPatternToArray(context.lineWidth, pattern));
	context.lineDashOffset = 0;

	var labelDecimalPlaces = 0;
	var study = sd.study,
		yAxis = sd.getYAxis(stx);
	labelDecimalPlaces = stx.decimalPlacesFromPriceTick(yAxis.priceTick);
	if (sd.overlay || sd.underlay) labelDecimalPlaces = null; // will end up using the same as the chart itself
	if (yAxis.decimalPlaces || yAxis.decimalPlaces === 0)
		labelDecimalPlaces = yAxis.decimalPlaces;
	var label = null;
	if (sd.parameters) label = sd.parameters.label;
	var libParams = study.parameters;
	if (!libParams) libParams = {};
	var step = libParams.plotType == "step" || sd.plotStepLine;
	if (sd.series) {
		// not even sure why this is here but leaving for "backward compatibility"
		for (var s in sd.series) {
			var ser = sd.series[s].parameters.type;
			if (ser) step = ser == "step";
		}
	}
	// backwards compatibility
	if (libParams.noLabels) label = false;
	if (!sd.noSlopes && sd.noSlopes !== false) sd.noSlopes = libParams.noSlopes;
	if (!sd.extendToEnd && sd.extendToEnd !== false)
		sd.extendToEnd = libParams.extendToEnd;
	var showLabel = label || (stx.preferences.labels && label !== false);

	var gaplines = sd.gaplines;
	if (gaplines === false) gaplines = "transparent";
	var symbol = sd.inputs.Symbol;
	var colorFunction = gaplines
		? stx.getGapColorFunction(symbol, name, output, gaplines)
		: null;

	stx.plotDataSegmentAsLine(
		name,
		panel,
		{
			yAxis: yAxis,
			skipTransform: stx.panels[sd.panel].name != sd.chart.name,
			label: showLabel,
			labelDecimalPlaces: labelDecimalPlaces,
			noSlopes: sd.noSlopes,
			step: step,
			alignStepToSide: sd.alignStepToSide,
			extendToEndOfLastBar: sd.extendToEndOfLastBar,
			width: sd.lineWidth,
			extendToEndOfDataSet: sd.extendToEnd,
			gapDisplayStyle: gaplines,
			highlight: sd.highlight
		},
		colorFunction
	);

	if (study.appendDisplaySeriesAsLine)
		study.appendDisplaySeriesAsLine(stx, sd, quotes, name, panel);

	// restore the original context settings
	context.restore();
};

/**
 * Draws a horizontal line on the study.
 *
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {studyDescriptor} sd	 The study descriptor
 * @param  {array} quotes The array of quotes (unused)
 * @param  {number} price  The price (value) to draw the horizontal line
 * @param  {CIQ.ChartEngine.YAxis} yAxis  The axis to use when drawing the line
 * @param  {object} color  Optional color to use when drawing line.  Can be a string or an object like {color:#334455, opacity:0.5}
 * @memberof CIQ.Studies
 * @since 5.2.0 Added `yAxis` and `color` parameters.
 */
CIQ.Studies.drawHorizontal = function (stx, sd, quotes, price, yAxis, color) {
	var panel = stx.panels[sd.panel],
		context = stx.getBackgroundCanvas().context;
	if (!panel) return;
	if (!color) color = yAxis.textStyle;

	var y = stx.pixelFromPrice(price, panel, yAxis);
	if (y > yAxis.top && y < yAxis.bottom)
		stx.plotLine(
			panel.left,
			panel.right,
			y,
			y,
			color,
			"segment",
			context,
			false,
			{ opacity: color && color.opacity ? color.opacity : 0.5 }
		);
};

/**
 * Method used to display series together with a histogram centered at the zero value.
 *
 * Used in studies such as on the "MACD" and "Klinger Volume Oscillator".
 *
 * This function creates the yAxis, draws **a single** histogram and then plots series, multiple if needed.
 *
 * Note that to differentiate between a regular series and the histogram series there is a convention to use sd.name+"_hist" for histogram values on a study.
 * See {@link CIQ.Studies.createHistogram} for details and examples.
 * @param  {CIQ.ChartEngine} stx	  The chart object
 * @param  {studyDescriptor} sd	   The study descriptor
 * @param  {array} quotes   The quotes (dataSegment)
 * @memberof CIQ.Studies
 */
CIQ.Studies.displayHistogramWithSeries = function (stx, sd, quotes) {
	var panel = stx.panels[sd.panel];
	var opacity = 0.5;
	if (sd.underlay) opacity = 0.3;
	CIQ.Studies.createHistogram(stx, sd, quotes, false, opacity);
	CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
};

/**
 * Plots over/under zones for indicators that support them, and when the user selects them.
 *
 * This method will draw its own yAxis which will not have a scale, but merely the over under points.<br>
 * Shading will be performed between the zone lines and the study plot.
 * @param  {CIQ.ChartEngine} stx	  The chart object
 * @param  {studyDescriptor} sd	   The study descriptor
 * @param  {array} quotes   unused
 * @memberof CIQ.Studies
 */
CIQ.Studies.drawZones = function (stx, sd, quotes) {
	if (!sd.parameters || !sd.parameters.studyOverZonesEnabled) return;

	var low = parseFloat(sd.parameters.studyOverSoldValue);
	var high = parseFloat(sd.parameters.studyOverBoughtValue);
	var lowColor = sd.parameters.studyOverSoldColor;
	var highColor = sd.parameters.studyOverBoughtColor;
	var output = sd.zoneOutput;
	if (!output) output = "Result";
	var zoneColor = CIQ.Studies.determineColor(sd.outputs[output]);
	if (!zoneColor || zoneColor == "auto" || CIQ.isTransparent(zoneColor))
		zoneColor = stx.defaultColor;
	if (!lowColor) lowColor = zoneColor;
	if (!lowColor || lowColor == "auto" || CIQ.isTransparent(lowColor))
		lowColor = stx.defaultColor;
	if (!highColor) highColor = zoneColor;
	if (!highColor || highColor == "auto" || CIQ.isTransparent(highColor))
		highColor = stx.defaultColor;
	var panel = stx.panels[sd.panel];
	var yAxis = sd.getYAxis(stx);
	var drawBorders = yAxis.displayBorder;
	if (stx.axisBorders === false) drawBorders = false;
	if (stx.axisBorders === true) drawBorders = true;
	if (yAxis.width === 0) drawBorders = false;
	var yaxisPosition = stx.getYAxisCurrentPosition(yAxis, panel);
	var leftAxis = yaxisPosition == "left",
		rightJustify = yAxis.justifyRight;
	if (!rightJustify && rightJustify !== false) {
		if (
			stx.chart.yAxis.justifyRight ||
			stx.chart.yAxis.justifyRight === false
		) {
			rightJustify = stx.chart.yAxis.justifyRight;
		} else rightJustify = leftAxis;
	}
	var borderEdge = Math.round(yAxis.left + (leftAxis ? yAxis.width : 0)) + 0.5;
	var tickWidth = drawBorders ? 3 : 0; // pixel width of tick off edge of border

	var ctx = stx.getBackgroundCanvas().context;
	var color = ctx.fillStyle;

	ctx.globalAlpha = 0.2;

	stx.startClip(panel.name, true);

	ctx.beginPath();
	var ph = Math.round(stx.pixelFromPrice(high, panel, yAxis)) + 0.5;
	ctx.strokeStyle = highColor;
	ctx.moveTo(panel.left, ph);
	ctx.lineTo(panel.right, ph);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	var pl = Math.round(stx.pixelFromPrice(low, panel, yAxis)) + 0.5;
	ctx.strokeStyle = lowColor;
	ctx.moveTo(panel.left, pl);
	ctx.lineTo(panel.right, pl);
	ctx.stroke();
	ctx.closePath();

	var yAxisPlotter = new CIQ.Plotter();
	yAxisPlotter.newSeries(
		"border",
		"stroke",
		stx.canvasStyle("stx_grid_border")
	);
	if (drawBorders) {
		var tickLeft = leftAxis ? borderEdge - tickWidth : borderEdge - 0.5;
		var tickRight = leftAxis ? borderEdge + 0.5 : borderEdge + tickWidth;
		yAxisPlotter.moveTo("border", tickLeft, ph);
		yAxisPlotter.lineTo("border", tickRight, ph);
		yAxisPlotter.moveTo("border", tickLeft, pl);
		yAxisPlotter.lineTo("border", tickRight, pl);
	}

	ctx.fillStyle = color;

	var params = {
		skipTransform: stx.panels[sd.panel].name != sd.chart.name,
		panelName: sd.panel,
		band: output + " " + sd.name,
		yAxis: yAxis,
		opacity: 0.3
	};
	if (!sd.highlight && stx.highlightedDraggable) params.opacity *= 0.3;
	CIQ.preparePeakValleyFill(
		stx,
		CIQ.extend(params, {
			threshold: high,
			direction: yAxis.flipped ? -1 : 1,
			color: highColor
		})
	);
	CIQ.preparePeakValleyFill(
		stx,
		CIQ.extend(params, {
			threshold: low,
			direction: yAxis.flipped ? 1 : -1,
			color: lowColor
		})
	);

	ctx.globalAlpha = 1;

	if (!sd.study || !sd.study.yaxis) {
		if (drawBorders) {
			var b = Math.round(yAxis.bottom) + 0.5;
			yAxisPlotter.moveTo("border", borderEdge, yAxis.top);
			yAxisPlotter.lineTo("border", borderEdge, b);
			yAxisPlotter.draw(ctx, "border");
		}

		if (yAxis.width !== 0) {
			// Draw the y-axis with high/low
			stx.canvasFont("stx_yaxis", ctx);
			stx.canvasColor("stx_yaxis", ctx);
			ctx.textAlign = rightJustify ? "right" : "left";
			var textX;
			if (leftAxis) {
				textX = yAxis.left + 3;
				if (rightJustify) textX = yAxis.left + yAxis.width - tickWidth - 3;
			} else {
				textX = yAxis.left + tickWidth + 3;
				if (rightJustify) textX = yAxis.left + yAxis.width;
			}
			ctx.fillStyle = highColor;
			ctx.fillText(high, textX, ph);
			ctx.fillStyle = lowColor;
			ctx.fillText(low, textX, pl);
			ctx.fillStyle = color;
		}
	}
	stx.endClip();
	ctx.globalAlpha = 1;

	if (yAxis.name == sd.name) yAxis.yAxisPlotter = new CIQ.Plotter();
};

/**
 * Method used to display a histogram, which can be centered at the zero value.
 *
 * Used in studies such as on the "MACD" and "Klinger Volume Oscillator".
 *
 * Initial bar color is defined in stx-chart.css under '.stx_histogram'. <br>
 * If using the default UI, refer to provided css files under '.stx_histogram' and '.ciq-night .stx_histogram' style sections.<br>
 * If sd.outputs["Decreasing Bar"], sd.outputs["Negative Bar"], sd.outputs["Increasing Bar"] and sd.outputs["Positive Bar"] are present, their corresponding colors will be used instead.<br>
 * <p><b>Note the convention to use sd.name+"_hist" for histogram values on a study</b></p>
 *
 * @param  {CIQ.ChartEngine} stx	  The chart object
 * @param  {studyDescriptor} sd	   The study descriptor
 * @param  {array} quotes   The quotes (dataSegment)
 * @param  {boolean} centered If true then the histogram will be physically centered on the yAxis, otherwise it will be centered at the zero value on the yAxis
 * @param  {number} [opacity=1] Optionally set the opacity
 * @memberof CIQ.Studies
 * @example <caption> Draws a histogram with alternating bid and ask records. Bids are positive, asks are negative.</caption>
 * CIQ.Studies.calculateBidAsk=function(stx, sd) {
 *		var quotes=sd.chart.scrubbed;
 *		var name=sd.name;
 *
 *		var histogram=name+"_hist";
 *		for(i=0;i<quotes.length;i++){
 *			quote=quotes[i];
 *			i % 2 ? quote[histogram]= quote.Bid : quote[histogram]= quote.Ask*-1;
 *		}
 *	};
 *
 *	CIQ.Studies.studyLibrary["Plot BidAsk"] = {
 *		seriesFN: CIQ.Studies.createHistogram,
 *		calculateFN: CIQ.Studies.calculateBidAsk,
 *		outputs: { "Negative Bar": "red", "Positive Bar": "green" },
 *	};
 *
 *	CIQ.Studies.addStudy(stxx, "Plot BidAsk");
 */

CIQ.Studies.createHistogram = function (stx, sd, quotes, centered, opacity) {
	var panel = stx.panels[sd.panel],
		context = sd.getContext(stx);
	var yAxis = sd.getYAxis(stx);
	stx.startClip(panel.name);

	var myWidth = stx.layout.candleWidth - 2;
	if (myWidth < 2) myWidth = 1;

	var y = stx.pixelFromPrice(0, panel, yAxis);
	if (yAxis.min > 0) y = stx.pixelFromPrice(yAxis.min, panel, yAxis); // Don't draw below the bottom of the chart. If zero isn't on the chart then make it behave like a bar graph.
	if (centered) {
		y = Math.floor(panel.top + panel.height / 2);
	}

	var field = sd.name + "_hist";
	stx.canvasColor("stx_histogram");
	var defaultFillStyle = context.fillStyle;

	if (opacity || opacity === 0) context.globalAlpha = opacity;
	if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
	var y0 = null,
		y1 = null;
	var outputs = sd.outputs;
	for (var i = 0; i < quotes.length; i++) {
		var quote = quotes[i];
		if (!quote) continue;
		if (quote.candleWidth)
			myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
		var x0 = Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2);
		var x1 = Math.floor(myWidth);
		if (y0 === null) {
			var tick = stx.tickFromPixel(x0, panel.chart) - 1;
			if (tick < 0) y0 = y1;
			else
				y0 =
					stx.pixelFromPrice(stx.chart.dataSet[tick][field], panel, yAxis) - y;
		} else {
			y0 = y1;
		}
		y1 = stx.pixelFromPrice(quote[field], panel, yAxis) - y;

		var decreasingBarColor = CIQ.Studies.determineColor(
			outputs["Decreasing Bar"]
		);
		var increasingBarColor = CIQ.Studies.determineColor(
			outputs["Increasing Bar"]
		);
		var positiveBarColor = CIQ.Studies.determineColor(outputs["Positive Bar"]);
		var negativeBarColor = CIQ.Studies.determineColor(outputs["Negative Bar"]);

		var flipped = yAxis.flipped;
		context.fillStyle = defaultFillStyle;
		if (decreasingBarColor && (flipped ? y1 < y0 : y1 > y0))
			context.fillStyle = decreasingBarColor;
		else if (increasingBarColor && (flipped ? y1 > y0 : y1 < y0))
			context.fillStyle = increasingBarColor;
		else if (positiveBarColor && (flipped ? y1 > 0 : y1 < 0))
			context.fillStyle = positiveBarColor;
		else if (negativeBarColor && (flipped ? y1 < 0 : y1 > 0))
			context.fillStyle = negativeBarColor;
		context.fillRect(x0, y, x1, Math.floor(y1));
	}

	context.globalAlpha = 1;
	stx.endClip();
};

/**
 * Used to reduce certain common fields to abbreviated form for display in study panel labels
 *
 * @type {Object}
 * @memberof CIQ.Studies
 */
CIQ.Studies.prettify = {
	Close: "C",
	Open: "O",
	High: "H",
	Low: "L",
	simple: "ma",
	exponential: "ema",
	"time series": "tsma",
	triangular: "tma",
	variable: "vma",
	VIDYA: "vdma",
	weighted: "wma",
	"welles wilder": "smma",
	true: "y",
	false: "n"
};

CIQ.Studies.prettyRE = /^.*\((.*?)\).*$/;

/**
 * Convert a study ID into a displayable format
 *
 * @param  {string} id The ID
 * @return {string}	A pretty (shortened) ID
 * @memberof CIQ.Studies
 */
CIQ.Studies.prettyDisplay = function (id) {
	var match = CIQ.Studies.prettyRE.exec(id);
	if (!match) return id;
	var guts = match[1];
	if (guts) {
		for (var i in CIQ.Studies.prettify) {
			guts = guts.replace(i, CIQ.Studies.prettify[i]);
		}
		id = id.replace(match[1], guts);
	}
	return id;
};

/**
 * Returns an array of input field names which are used  to specify the field for the study.
 *
 * In most cases, this field is called "Field", but it does not have to be, nor does there need to be only one.
 *
 * @param  {studyDescriptor} sd	   The study descriptor
 * @return {array}		   Input fields used to specify the field
 * @since 3.0.0
 * @memberof CIQ.Studies
 */
CIQ.Studies.getFieldInputs = function (sd) {
	var res = [];
	var defaultInputs = sd.study.inputs;
	for (var input in defaultInputs) {
		if (defaultInputs[input] == "field") res.push(input);
	}
	return res;
};

/**
 * The default initialize function for a study. It creates the study descriptor. It creates the panel if one is required.
 *
 * @param  {CIQ.ChartEngine} stx		The chart object
 * @param  {string} type	   The type of study (from studyLibrary)
 * @param  {object} inputs	 The inputs for the study instance
 * @param  {object} outputs	The outputs for the study instance
 * @param  {object} [parameters] Additional parameters if required or supported by this study
 * @param {string} [panelName] Deprecated. Panel name.  Use parameters.panelName instead.
 * @param {object} [study]	Study definition to use in lieu of the study library entry
 * @return {studyDescriptor}		The newly initialized study descriptor
 * @since 3.0.0 Added `study` parameter.
 * @deprecated Since 6.3.0 `panelName` argument is deprecated; use `parameters.panelName` instead. If neither are valid, will automatically determine default panel.
 * @memberof CIQ.Studies
 */
CIQ.Studies.initializeFN = function (
	stx,
	type,
	inputs,
	outputs,
	parameters,
	panelName,
	study
) {
	if (!inputs) inputs = { id: type };
	if (!parameters) parameters = {};
	if (!inputs.display) inputs.display = inputs.id;
	var sd = new CIQ.Studies.StudyDescriptor(
		inputs.id,
		type,
		inputs.id,
		inputs,
		outputs,
		parameters
	);
	if (inputs.Period) sd.days = Math.max(1, parseInt(sd.inputs.Period, 10)); // you can't have fractional or non-positive day periods
	if (study) {
		if (!study.inputs) study.inputs = sd.study.inputs;
		if (!study.outputs) study.outputs = sd.study.outputs;
		sd.study = study;
	} else study = sd.study;
	if (study.display) inputs.display = study.display; // override what is displayed in the label
	if (typeof parameters.panelName == "string") panelName = parameters.panelName;
	if (panelName == inputs.id || (panelName && !stx.panelExists(panelName))) {
		sd.underlay = sd.overlay = false;
	}
	if (panelName == "Own panel" || panelName == "New panel") {
		panelName = null;
	}
	var isOverlay =
		sd.overlay || inputs.Overlay || (sd.overlay !== false && study.overlay);
	var isUnderlay =
		sd.underlay || inputs.Underlay || (sd.underlay !== false && study.underlay);
	if (isOverlay && parameters.underlayEnabled) isUnderlay = true;
	if (isUnderlay) sd.underlay = true;
	if (!isUnderlay && stx.chart.panel && panelName == stx.chart.panel.name)
		isOverlay = true;
	if (isOverlay) sd.overlay = true;

	var drag = stx.preferences.dragging;
	if (drag === true || (drag && drag.study)) sd.overlay = true; // override for draggable studies
	if (panelName) parameters.panelName = panelName;
	else if (!isOverlay && !isUnderlay) panelName = inputs.id;

	if (parameters.calculateOnly) {
		if (isOverlay || isUnderlay) {
			if (stx.panels[parameters.panelName]) sd.panel = parameters.panelName;
			else
				sd.panel =
					CIQ.Studies.getPanelFromFieldName(stx, sd) || parameters.chartName;
		}
		// don't setup panel, return now
		return sd;
	}

	var oldStudyValues = {}; // capture these values in case they change throughout this function
	var oldStudy = stx.layout.studies[parameters.replaceID];
	if (oldStudy) {
		oldStudyValues = {
			outputMap: CIQ.clone(oldStudy.outputMap),
			panel: oldStudy.panel
		};
	}
	// adjust panel
	sd.panel = "";
	if (panelName) {
		var newPanel = CIQ.Studies.smartMovePanel(
			stx,
			sd.inputs,
			panelName,
			parameters.replaceID,
			parameters.panelName == "New panel"
		);
		if (newPanel) sd.panel = newPanel.name;
	} else if (isOverlay || isUnderlay) {
		sd.panel =
			CIQ.Studies.getPanelFromFieldName(stx, sd) || parameters.chartName;
	}
	if (!sd.panel) {
		var panelHeight = study.panelHeight || null;
		var yaxisParameters = study.yAxis || {};
		yaxisParameters.name = sd.inputs.id;
		sd.panel = sd.inputs.id;
		stx.createPanel(
			sd.inputs.display,
			sd.panel,
			panelHeight,
			parameters.chartName,
			new CIQ.ChartEngine.YAxis(yaxisParameters)
		);
	}

	if (sd.parameters && sd.parameters.panelName)
		sd.parameters.panelName = sd.panel;

	// adjust yAxis
	var panel = stx.panels[sd.panel];
	var yAxis = CIQ.Studies.smartCreateYAxis(
		stx,
		panel,
		sd.inputs.id,
		parameters.yaxisDisplayValue,
		parameters.yAxis || study.yAxis
	);

	var syAxis = study ? CIQ.clone(study.yAxis) : null;
	var adjAxis = syAxis || yAxis;
	if (adjAxis) {
		if (adjAxis.ground) adjAxis.initialMarginBottom = 0;
		if (
			adjAxis.initialMarginTop ||
			adjAxis.initialMarginTop === 0 ||
			adjAxis.initialMarginBottom ||
			adjAxis.initialMarginBottom === 0
		) {
			stx.calculateYAxisMargins(adjAxis);
		}
		if (adjAxis.name == parameters.replaceID) adjAxis.name = sd.inputs.id;
	}

	if (yAxis) {
		yAxis.width =
			yAxis.position == "none" ? 0 : CIQ.ChartEngine.YAxis.prototype.width;
		if (
			parameters.yaxisDisplayValue == "shared" ||
			parameters.yaxisDisplayValue == "default"
		) {
			delete parameters.yaxisDisplayValue;
		} else {
			if (syAxis) {
				CIQ.ensureDefaults(yAxis, syAxis);
			} else if (yAxis.name == sd.name) {
				// study owns axis
				if (
					!parameters.yaxisDisplayColor ||
					parameters.yaxisDisplayColor == "auto"
				)
					delete yAxis.textStyle;
				else yAxis.textStyle = CIQ.colorToHex(parameters.yaxisDisplayColor);
				yAxis.justifyRight = null;
				yAxis.flipped = parameters.flippedEnabled;
			}
		}
		if (yAxis != panel.yAxis) {
			yAxis.displayGridLines = false;
		} else if (yAxis != stx.chart.yAxis) {
			yAxis.displayGridLines = stx.displayGridLinesInStudies;
		}
	}
	stx.calculateYAxisPositions();

	// move study's drawings
	if (oldStudy) {
		var drawingChanged = false;
		for (var d in stx.drawingObjects) {
			var drawing = stx.drawingObjects[d];
			if (
				oldStudyValues.outputMap &&
				oldStudyValues.outputMap.hasOwnProperty(drawing.field)
			) {
				drawing.field = drawing.field.replace(
					parameters.replaceID,
					sd.inputs.id
				);
				if (sd.parameters && sd.parameters.panelName) {
					drawing.panelName = sd.parameters.panelName;
				} else {
					drawing.panelName = sd.panel;
				}
				drawingChanged = true;
			} else if (
				oldStudyValues.panel &&
				oldStudyValues.panel == drawing.panelName
			) {
				drawing.panelName = drawing.panelName.replace(
					parameters.replaceID,
					sd.inputs.id
				);
				drawingChanged = true;
			}
		}
		if (drawingChanged) stx.changeOccurred("vector");
	}
	return sd;
};

/**
 * Manages the panel for a study when a new panel is requested.
 *
 * @param {CIQ.ChartEngine} stx A chart engine instance.
 * @param {object} inputs The study inputs.
 * @param {string} panelName Name of the panel where the study will lie. **Note:** This panel's name may be changed in this function.
 * @param {string} replaceID Name of the original study.
 * @param {boolean} toNewPanel `true` if request to move to a new panel.
 * @return {CIQ.ChartEngine.Panel} The panel to which the study was moved; null if a new panel needs to be created.
 * @memberof CIQ.Studies
 * @since
 * - 7.1.0
 * - 7.2.0 Added the `toNewPanel` argument.
 */
CIQ.Studies.smartMovePanel = function (
	stx,
	inputs,
	panelName,
	replaceID,
	toNewPanel
) {
	var oldStudy;
	var name = inputs.id;
	if (replaceID) oldStudy = stx.layout.studies[replaceID];
	if (oldStudy) {
		var oldPanel = stx.panels[oldStudy.panel];
		if (oldPanel) {
			if (oldPanel.yAxis.name == replaceID) {
				// study owns panel
				if (
					(toNewPanel || panelName != replaceID) &&
					!stx.checkForEmptyPanel(oldPanel.name, true, oldStudy)
				) {
					// case 1: Either we are moving to a new panel, or we changed the inputs,
					//         and existing panel is still populated with other plots
					stx.electNewPanelOwner(oldPanel); // promote a new panel owner
					var yAxis = oldStudy.getYAxis(stx);
					if (yAxis.name == replaceID) stx.electNewYAxisOwner(yAxis); // promote a new axis owner
				} else if (panelName == replaceID || !stx.panels[panelName]) {
					// case 2: We changed something not necessitating any panel move
					if (name != oldPanel.name)
						stx.modifyPanel(oldPanel, { name: name, display: inputs.display });
					panelName = name;
				}
			}
		}
	}
	return stx.panels[panelName];
};

/**
 * Manages yAxis for a study when a new position is requested.
 *
 * @param {CIQ.ChartEngine} stx A chart engine instance
 * @param {CIQ.ChartEngine.Panel} panel The panel where the yAxis is
 * @param {string} name The study whose axis to manage
 * @param {string} [newPosition] New position (left/right/none,default/shared, or specific axis name)
 * @param {object} [defaultAxis] Axis defaults to use when creating new axis
 * @return {CIQ.ChartEngine.YAxis} The yAxis to use
 * @memberof CIQ.Studies
 * @since 7.1.0
 */
CIQ.Studies.smartCreateYAxis = function (
	stx,
	panel,
	name,
	newPosition,
	defaultAxis
) {
	var yAxis = stx.getYAxisByName(panel, name); //owns axis
	if (!newPosition && defaultAxis) newPosition = defaultAxis.position;
	if (
		newPosition == "default" ||
		newPosition == "shared" ||
		newPosition == panel.yAxis.name
	)
		newPosition = "";
	if (["left", "right", "none"].indexOf(newPosition) > -1) {
		// left/right/none
		// was sharing or default
		if (!yAxis || yAxis.isShared(stx)) {
			// was sharing an axis, need a new axis
			var newParams = defaultAxis || {};
			CIQ.extend(newParams, { name: name, position: newPosition });
			if (
				!yAxis &&
				!stx.currentlyImporting &&
				panel != panel.chart.panel &&
				!panel.yAxis.studies.length &&
				!panel.yAxis.renderers.length
			) {
				// use orphaned yAxis which is not hosting anything
				yAxis = panel.yAxis;
				CIQ.extend(yAxis, newParams);
			} else {
				var isPanelAxis = yAxis == panel.yAxis;
				if (yAxis) yAxis.name = stx.electNewYAxisOwner(yAxis);
				yAxis = stx.addYAxis(panel, new CIQ.ChartEngine.YAxis(newParams));
				if (isPanelAxis) panel.yAxis = yAxis;
			}
		} else {
			// was own axis, switch to left/right/none
			yAxis.position = newPosition;
		}
		return yAxis;
	}
	if (newPosition) {
		// a specific axis is specified
		var newAxis = stx.getYAxisByName(panel, newPosition);
		if (newAxis && yAxis == panel.yAxis && !yAxis.isShared(stx)) {
			// normally we don't need to do anything, but in this special case we need to give the panel a different owning yaxis
			panel.yAxis = newAxis;
		}
		if (yAxis && yAxis.isShared(stx)) {
			// pick a new axis name
			yAxis.name = stx.electNewYAxisOwner(yAxis);
		} else {
			if (yAxis !== panel.yAxis) stx.deleteYAxisIfUnused(panel, yAxis);
		}
		return newAxis;
	}
	// going to share/default
	if (yAxis) {
		if (yAxis.isShared(stx)) {
			// pick a new axis name
			yAxis.name = stx.electNewYAxisOwner(yAxis);
		} else {
			delete yAxis.position;
			if (yAxis !== panel.yAxis) stx.deleteYAxisIfUnused(panel, yAxis);
		}
	}
	stx.resizeChart();

	return panel.yAxis;
};

/**
 * Default Volume calculation function.
 *
 * Volume is already obtained, so all that is done here is setting colors.
 * @param {CIQ.ChartEngine} stx A chart engine instance
 * @param {studyDescriptor} sd Study to calculate volume for
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateVolume = function (stx, sd) {
	if (sd.type == "vol undr") {
		if (!stx || !stx.chart.dataSet) return;
		var layout = stx.layout;
		var remove = sd.parameters.removeStudy;
		var previous = layout.volumeUnderlay;
		layout.volumeUnderlay = !remove;
		if (previous != layout.volumeUnderlay) stx.changeOccurred("layout");
		if (remove) {
			CIQ.Studies.removeStudy(stx, sd);
		}
	}
	sd.outputMap = {};
	sd.outputMap.Volume = "";
};

/**
 * Moving Average convenience function.
 *
 * @param  {string}   type	The type of moving average, e.g. simple, exponential, triangular, etc. Valid options can be seen by inspecting the keys on the `CIQ.Studies.movingAverage.typeMap` object.
 * @param  {number}   periods Moving average period
 * @param  {string}   field   The field in the data array to perform the moving average on
 * @param  {number}   offset  Periods to offset the result by
 * @param  {string}   name	String to prefix to the name of the output. Full name of output would be name + " " + sd.name. For instance, sending 'Signal' on a 'macd' study will result in an output field called "Signal &zwnj;macd&zwnj; (12,26,9)"
 * @param  {CIQ.ChartEngine} stx	 Chart object
 * @param  {object}   sd	  Study Descriptor
 * @param  {string}   subField	  Subfield within field to perform moving average on, if applicable.  For example, IBM.Close: field:"IBM", subField:"Close"
 * @memberof CIQ.Studies
 * @since 04-2015
 */
CIQ.Studies.MA = function (
	type,
	periods,
	field,
	offset,
	name,
	stx,
	sd,
	subField
) {
	var ma = new CIQ.Studies.StudyDescriptor(
		name + " " + sd.name,
		"ma",
		sd.panel
	);
	ma.chart = sd.chart;
	ma.days = parseInt(periods, 10);
	ma.startFrom = sd.startFrom;
	if (subField) ma.subField = subField;
	ma.inputs = {};
	if (type) ma.inputs.Type = type;
	if (field) ma.inputs.Field = field;
	if (offset) ma.inputs.Offset = parseInt(offset, 10);
	CIQ.Studies.calculateMovingAverage(stx, ma);
};

// Moving average data; add to it if adding moving average functionality
CIQ.Studies.movingAverage = {
	//conversions: mapping of study type to moving average type name
	conversions: {
		ma: "simple",
		sma: "simple",
		ema: "exponential",
		tsma: "time series",
		tma: "triangular",
		vma: "variable",
		vdma: "vidya",
		wma: "weighted",
		smma: "welles wilder"
	},
	//translations: mapping of moving average type name to display name
	translations: {
		simple: "Simple",
		exponential: "Exponential",
		"time series": "Time Series",
		triangular: "Triangular",
		variable: "Variable",
		vidya: "VIDYA",
		weighted: "Weighted",
		"welles wilder": "Welles Wilder"
	},
	//typeMap: mapping of both study type and type name to calculation function suffix
	//i.e., calculateMovingAverageXXX
	typeMap: {
		ema: "Exponential",
		exponential: "Exponential",
		tsma: "TimeSeries",
		"time series": "TimeSeries",
		tma: "Triangular",
		triangular: "Triangular",
		vma: "Variable",
		variable: "Variable",
		vdma: "VIDYA",
		vidya: "VIDYA",
		wma: "Weighted",
		weighted: "Weighted",
		smma: "Exponential",
		"welles wilder": "Exponential"
	}
};
/**
 * Does conversions for valid moving average types
 *
 * @param  {CIQ.ChartEngine} stx The chart object
 * @param  {string} input String to test if a moving average type or "options" to return the list of ma options.
 * @return {Object} The name of the moving average or a list of options
 * @memberof CIQ.Studies
 */
CIQ.Studies.movingAverageHelper = function (stx, input) {
	if (input == "options") {
		var translations = {};
		for (var t in CIQ.Studies.movingAverage.translations) {
			translations[t] = stx.translateIf(
				CIQ.Studies.movingAverage.translations[t]
			);
		}
		return translations;
	}
	return CIQ.Studies.movingAverage.conversions[input];
};

/**
 * Creates a volume chart.
 *
 * If no volume is available on the screen then the panel will be watermarked "Volume Not Available" (translated if a translate function is attached to the kernel object).
 *
 * Uses {@link CIQ.ChartEngine#drawHistogram} and any "parameters" in the study definition will send into its 'params' object to control the histogram look and feel.
 * <br>Example:
 * ```
 * CIQ.extend(CIQ.Studies.studyLibrary["vol undr"],{
 * 		"parameters": {
 * 			"widthFactor":0.5
 * 		}
 * });
 * ```
 *
 * Uses CSS style :
 *  - `stx_volume_underlay` if "sd.underlay" is true
 *  - `stx_volume` if "sd.underlay" is NOT true
 *
 * See {@link CIQ.ChartEngine#colorByCandleDirection} to base colors on difference between open and close vs. difference between previous close and close.
 *
 * @param {CIQ.ChartEngine} stx A chart engine instance
 * @param {studyDescriptor} sd A study descriptor
 * @param {array} quotes Array of quotes
 * @memberof CIQ.Studies
 * @example
 *  // default volume study library entry with required parameters
	"volume": {
		"name": "Volume Chart",
		"range": "0 to max",
		"yAxis": {"ground":true, "initialMarginTop":0, "zoom":0},
		"seriesFN": CIQ.Studies.createVolumeChart,
		"calculateFN": CIQ.Studies.calculateVolume,
		"inputs": {},
		"outputs": {"Up Volume":"#8cc176","Down Volume":"#b82c0c"}
	}
* @example
*  // default volume underlay library entry with required parameters
	"vol undr": {
		"name": "Volume Underlay",
		"underlay": true,
		"range": "0 to max",
		"yAxis": {"ground":true, "initialMarginTop":0, "position":"none", "zoom": 0, "heightFactor": 0.25},
		"seriesFN": CIQ.Studies.createVolumeChart,
		"calculateFN": CIQ.Studies.calculateVolume,
		"inputs": {},
		"outputs": {"Up Volume":"#8cc176","Down Volume":"#b82c0c"},
		"customRemoval": true,
		"removeFN": function(stx, sd){
			stx.layout.volumeUnderlay=false;
			stx.changeOccurred("layout");
		},
		"attributes":{
			"panelName":{hidden:true}
        }
    }
 */
CIQ.Studies.createVolumeChart = function (stx, sd, quotes) {
	var panel = sd.panel,
		inputs = sd.inputs,
		underlay = sd.underlay,
		overlay = sd.overlay;
	var inAnotherPanel = underlay || overlay;
	var colorUp = CIQ.Studies.determineColor(sd.outputs["Up Volume"]);
	var colorDown = CIQ.Studies.determineColor(sd.outputs["Down Volume"]);
	var style = underlay ? "stx_volume_underlay" : "stx_volume";
	stx.setStyle(style + "_up", "color", colorUp);
	stx.setStyle(style + "_down", "color", colorDown);

	var seriesParam = [
		{
			field: sd.volumeField || "Volume",
			fill_color_up: stx.canvasStyle(style + "_up").color,
			border_color_up: stx.canvasStyle(style + "_up").borderLeftColor,
			opacity_up: stx.canvasStyle(style + "_up").opacity,
			fill_color_down: stx.canvasStyle(style + "_down").color,
			border_color_down: stx.canvasStyle(style + "_down").borderLeftColor,
			opacity_down: stx.canvasStyle(style + "_down").opacity,
			color_function: sd.colorFunction
		}
	];
	var seriesParam0 = seriesParam[0];

	// Major backward compatibility hack. If the border color is the same as our standard color
	// then most likely the customer is missing border: #000000 style on stx_volume_up and stx_volume_down
	if (!underlay && seriesParam0.border_color_down === "rgb(184, 44, 12)") {
		seriesParam0.border_color_down = "#000000";
		seriesParam0.border_color_up = "#000000";
	}

	var yAxis = sd.getYAxis(stx);
	var params = {
		name: "Volume",
		panel: panel,
		yAxis: yAxis,
		widthFactor: 1,
		bindToYAxis: true,
		highlight: sd.highlight
	};

	CIQ.extend(params, sd.study.parameters);
	CIQ.extend(params, sd.parameters);

	if (stx.colorByCandleDirection && !sd.colorFunction) {
		seriesParam0.color_function = function (quote) {
			var O = quote.Open,
				C = quote.Close;
			//if((!O && O!==0) || (!C && C!==0) || O===C) return stx.defaultColor;

			return {
				fill_color:
					O > C ? seriesParam0.fill_color_down : seriesParam0.fill_color_up,
				border_color:
					O > C ? seriesParam0.border_color_down : seriesParam0.border_color_up,
				opacity: O > C ? seriesParam0.opacity_down : seriesParam0.opacity_up
			};
		};
	}

	stx.drawHistogram(params, seriesParam);
};

/**
 * Calculate function for standard deviation.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the `sd.outputMap`.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateStandardDeviation = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	if (quotes.length < sd.days + 1) {
		sd.error = true;
		return;
	}
	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close";
	var type = sd.inputs["Moving Average Type"];
	if (!type) type = sd.inputs.Type;
	CIQ.Studies.MA(type, sd.days, field, sd.inputs.Offset, "_MA", stx, sd);

	var acc1 = 0;
	var acc2 = 0;
	var ma = 0;
	var mult = Number(sd.inputs["Standard Deviations"]);
	if (mult < 0) mult = 2;
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var i, val, its;
	for (i = sd.startFrom - 1, its = 0; i >= 0 && its < sd.days; i--, its++) {
		val = quotes[i][field];
		if (val && typeof val == "object") val = val[sd.subField];
		if (isNaN(val)) val = 0;
		acc1 += Math.pow(val, 2);
		acc2 += val;
	}
	for (i = sd.startFrom; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		if (!val && val !== 0) val = 0;
		acc1 += Math.pow(val, 2);
		acc2 += val;
		if (i < sd.days - 1) continue;
		if (i >= sd.days) {
			var val2 = quotes[i - sd.days][field];
			if (val2 && typeof val2 == "object") val2 = val2[sd.subField];
			if (isNaN(val2)) val2 = 0;
			acc1 -= Math.pow(val2, 2);
			acc2 -= val2;
		}
		ma = quote["_MA " + sd.name];
		if (ma || ma === 0)
			quote[name] =
				Math.sqrt(
					(acc1 + sd.days * Math.pow(ma, 2) - 2 * ma * acc2) / sd.days
				) * mult;
	}
};

/**
 * Calculate function for moving averages.
 *
 * sd.inputs["Type"] can be used to request a specific type of moving average. Valid options can be seen by inspecting the keys on the `CIQ.Studies.movingAverage.typeMap` object.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 *
 * @param {CIQ.ChartEngine} stx A chart engine instance
 * @param {studyDescriptor} sd A study descriptor
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateMovingAverage = function (stx, sd) {
	if (!sd.chart.scrubbed) return;
	var type = sd.inputs.Type;
	if (type == "ma" || type == "sma" || !type) type = "simple"; // handle when the default inputs are passed in
	var typeMap = CIQ.Studies.movingAverage.typeMap;
	if (type in typeMap) {
		return CIQ.Studies["calculateMovingAverage" + typeMap[type]](stx, sd);
	} else if (type !== "simple") {
		return;
	}
	var quotes = sd.chart.scrubbed;
	var acc = 0;
	var vals = [];
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in
	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;
	var i,
		val,
		ft,
		start = sd.startFrom;
	// backload the past data into the array
	var offsetBack = offset;
	for (i = sd.startFrom - 1; i >= 0; i--) {
		val = quotes[i][field];
		if (val && typeof val == "object") val = val[sd.subField];
		if (!val && val !== 0) continue;
		if (offsetBack > 0) {
			offsetBack--;
			start = i;
			continue;
		}
		if (vals.length == sd.days - 1) break;
		acc += val;
		vals.unshift(val);
	}
	if (vals.length < sd.days - 1) {
		vals = [];
		start = 0; // not enough records to continue where left off
	}
	var futureTicks = [];
	for (i = start; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
		var offsetQuote = notOverflowing ? quotes[i + offset] : null;
		if (!val && val !== 0) {
			if (offsetQuote) offsetQuote[name] = null;
			else if (i + offset >= quotes.length) {
				ft = {};
				ft[name] = null;
				futureTicks.push(ft);
			}
			continue;
		}
		acc += val;
		vals.push(val);
		if (vals.length > sd.days) acc -= vals.shift();
		var myVal = vals.length == sd.days ? acc / sd.days : null;
		if (offsetQuote) offsetQuote[name] = myVal;
		else if (i + offset >= quotes.length) {
			ft = {};
			ft[name] = myVal;
			futureTicks.push(ft);
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for exponential moving average.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateMovingAverageExponential = function (stx, sd) {
	var type = sd.inputs.Type;
	var quotes = sd.chart.scrubbed;
	var acc = 0;
	var ma = 0;
	var ii = 0;
	var multiplier = 2 / (sd.days + 1);
	if (type === "welles wilder" || type === "smma") multiplier = 1 / sd.days;

	var emaPreviousDay = null;
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}

	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in
	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;
	var i, val;
	var start = sd.startFrom;
	// find emaPreviousDay
	var offsetBack = offset;
	for (i = sd.startFrom - 1; i >= 0; i--) {
		val = quotes[i][name];
		if (!val && val !== 0) continue;
		if (emaPreviousDay === null) emaPreviousDay = val;
		ii = sd.days;
		if (offsetBack <= 0) break;
		offsetBack--;
		start = i;
	}
	if (emaPreviousDay === null) {
		emaPreviousDay = start = 0;
	}
	var futureTicks = [];
	for (i = start; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
		var offsetQuote = notOverflowing ? quotes[i + offset] : null;
		var myVal;
		if (!val && val !== 0) {
			myVal = null;
		} else {
			if (ii == sd.days - 1) {
				acc += val;
				ma = acc / sd.days;
				myVal = ma;
			} else if (ii < sd.days - 1) {
				acc += val;
				ma = acc / (ii + 1);
				myVal = null;
			} else if (ii === 0) {
				acc += val;
				ma = acc;
				myVal = null;
			} else if (emaPreviousDay || emaPreviousDay === 0) {
				ma = (val - emaPreviousDay) * multiplier + emaPreviousDay;
				myVal = ma;
			}
			emaPreviousDay = ma;
			ii++;
		}
		if (offsetQuote) offsetQuote[name] = myVal;
		else if (i + offset >= quotes.length) {
			var ft = {};
			ft[name] = myVal;
			futureTicks.push(ft);
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for variable moving average.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 * @since 5.2.1 Moved `VIYDA` to `calculateMovingAverageVIDYA`.
 */
CIQ.Studies.calculateMovingAverageVariable = function (stx, sd) {
	var type = sd.inputs.Type;
	var quotes = sd.chart.scrubbed;
	var alpha = 2 / (sd.days + 1);

	var vmaPreviousDay = null;
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}

	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

	sd.cmo = new CIQ.Studies.StudyDescriptor(sd.name, "cmo", sd.panel);
	sd.cmo.chart = sd.chart;
	sd.cmo.days = 9;
	sd.cmo.inputs = { Field: field };
	sd.cmo.startFrom = sd.startFrom;
	sd.cmo.outputs = { _CMO: null };
	CIQ.Studies.calculateChandeMomentum(stx, sd.cmo);

	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;

	var i, val, ft;
	var start = sd.startFrom;
	// find vmaPreviousDay
	var offsetBack = offset;
	for (i = sd.startFrom - 1; i >= 0; i--) {
		val = quotes[i][name];
		if (!val && val !== 0) continue;
		if (vmaPreviousDay === null) vmaPreviousDay = val;
		if (offsetBack <= 0) break;
		offsetBack--;
		start = i;
	}
	if (vmaPreviousDay === null) {
		vmaPreviousDay = start = 0;
	}
	var futureTicks = [];
	for (i = start; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
		var offsetQuote = notOverflowing ? quotes[i + offset] : null;
		if (!val && val !== 0) {
			if (offsetQuote) offsetQuote[name] = null;
			else if (i + offset >= quotes.length) {
				ft = {};
				ft[name] = null;
				futureTicks.push(ft);
			}
			continue;
		}
		if (!quote["_CMO " + sd.name] && quote["_CMO " + sd.name] !== 0) continue;
		var vi = Math.abs(quote["_CMO " + sd.name]) / 100;
		var vma = alpha * vi * val + (1 - alpha * vi) * vmaPreviousDay;
		vmaPreviousDay = vma;
		if (i < sd.days) vma = null;
		if (offsetQuote) offsetQuote[name] = vma;
		else if (i + offset >= quotes.length) {
			ft = {};
			ft[name] = vma;
			futureTicks.push(ft);
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for VI Dynamic MA (VIDYA).
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 * @since 5.2.1
 */
CIQ.Studies.calculateMovingAverageVIDYA = function (stx, sd) {
	var type = sd.inputs.Type;
	var quotes = sd.chart.scrubbed;
	var alpha = 2 / (sd.days + 1);

	var vmaPreviousDay = null;
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}

	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

	sd.std = new CIQ.Studies.StudyDescriptor(sd.name, "sdev", sd.panel);
	sd.std.chart = sd.chart;
	sd.std.days = 5;
	sd.std.startFrom = sd.startFrom;
	sd.std.inputs = { Field: field, "Standard Deviations": 1, Type: "ma" };
	sd.std.outputs = { _STD: null };
	CIQ.Studies.calculateStandardDeviation(stx, sd.std);

	CIQ.Studies.MA("ma", 20, "_STD " + sd.name, 0, "_MASTD", stx, sd);

	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;

	var i, val, ft;
	var start = sd.startFrom;
	// find vmaPreviousDay
	var offsetBack = offset;
	for (i = sd.startFrom - 1; i >= 0; i--) {
		val = quotes[i][name];
		if (!val && val !== 0) continue;
		if (vmaPreviousDay === null) vmaPreviousDay = val;
		if (offsetBack <= 0) break;
		offsetBack--;
		start = i;
	}
	if (vmaPreviousDay === null) {
		vmaPreviousDay = start = 0;
	}
	var futureTicks = [];
	for (i = start; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
		var offsetQuote = notOverflowing ? quotes[i + offset] : null;
		if (!val && val !== 0) {
			if (offsetQuote) offsetQuote[name] = null;
			else if (i + offset >= quotes.length) {
				ft = {};
				ft[name] = null;
				futureTicks.push(ft);
			}
			continue;
		}
		if (!quote["_MASTD " + sd.name] && quote["_MASTD " + sd.name] !== 0)
			continue;
		var vi = quote["_STD " + sd.name] / quote["_MASTD " + sd.name];
		var vma = alpha * vi * val + (1 - alpha * vi) * vmaPreviousDay;
		vmaPreviousDay = vma;
		if (i < sd.days) vma = null;
		if (offsetQuote) offsetQuote[name] = vma;
		else if (i + offset >= quotes.length) {
			ft = {};
			ft[name] = vma;
			futureTicks.push(ft);
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for time series moving average.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateMovingAverageTimeSeries = function (stx, sd) {
	sd.ma = new CIQ.Studies.StudyDescriptor(sd.name, "ma", sd.panel);
	sd.ma.chart = sd.chart;
	sd.ma.days = sd.days;
	sd.ma.startFrom = sd.startFrom;
	sd.ma.inputs = sd.inputs;
	CIQ.Studies.calculateLinearRegressionIndicator(stx, sd.ma);

	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;

	var quotes = sd.chart.scrubbed;
	// find start
	var offsetBack = offset;
	for (var i = sd.startFrom - 1; i >= 0; i--) {
		var val = quotes[i][name];
		if (!val && val !== 0) continue;
		if (offsetBack > 0) {
			offsetBack--;
			continue;
		}
		break;
	}
	var futureTicks = [];
	for (i++; i < quotes.length; i++) {
		var quote = quotes[i];
		if (i + offset >= 0) {
			if (i + offset < quotes.length)
				quotes[i + offset][name] = quote["Forecast " + sd.name];
			else {
				var ft = {};
				ft[name] = quote["Forecast " + sd.name];
				futureTicks.push(ft);
			}
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for triangular moving average.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateMovingAverageTriangular = function (stx, sd) {
	var quotes = sd.chart.scrubbed;

	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in
	var days = Math.ceil(sd.days / 2);
	CIQ.Studies.MA("simple", days, field, 0, "TRI1", stx, sd);
	if (sd.days % 2 === 0) days++;
	CIQ.Studies.MA("simple", days, "TRI1 " + sd.name, 0, "TRI2", stx, sd);

	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;

	// find start
	var offsetBack = offset;
	for (var i = sd.startFrom - 1; i >= 0; i--) {
		var val = quotes[i][name];
		if (!val && val !== 0) continue;
		if (offsetBack > 0) {
			offsetBack--;
			continue;
		}
		break;
	}
	var futureTicks = [];
	for (i++; i < quotes.length; i++) {
		if (i + offset >= 0) {
			if (i + offset < quotes.length)
				quotes[i + offset][name] = quotes[i]["TRI2 " + sd.name];
			else {
				var ft = {};
				ft[name] = quotes[i]["TRI2 " + sd.name];
				futureTicks.push(ft);
			}
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

/**
 * Calculate function for weighted moving average.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - To leverage as part of a larger study calculation, use {@link CIQ.Studies.MA} instead.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @private
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateMovingAverageWeighted = function (stx, sd) {
	var quotes = sd.chart.scrubbed;

	var accAdd = 0;
	var accSubtract = 0;
	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in
	var divisor = (sd.days * (sd.days + 1)) / 2;

	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var offset = parseInt(sd.inputs.Offset, 10);
	if (isNaN(offset)) offset = 0;
	var i, val, ft;
	var vals = [];
	var start = sd.startFrom;
	// backload the past data into the array
	var offsetBack = offset;
	for (i = sd.startFrom - 1; i >= 0; i--) {
		val = quotes[i][field];
		if (val && typeof val == "object") val = val[sd.subField];
		if (!val && val !== 0) continue;
		if (offsetBack > 0) {
			offsetBack--;
			start = i;
			continue;
		}
		if (vals.length == sd.days - 1) break;
		vals.unshift(val);
	}
	if (vals.length < sd.days - 1) {
		vals = [];
		start = 0; // not enough records to continue where left off
	}
	for (i = 0; i < vals.length; i++) {
		accAdd += (i + 1) * vals[i];
		accSubtract += vals[i];
	}
	var futureTicks = [];
	for (i = start; i < quotes.length; i++) {
		var quote = quotes[i];
		val = quote[field];
		if (val && typeof val == "object") val = val[sd.subField];
		var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
		var offsetQuote = notOverflowing ? quotes[i + offset] : null;
		if (!val && val !== 0) {
			if (offsetQuote) offsetQuote[name] = null;
			else if (i + offset >= quotes.length) {
				ft = {};
				ft[name] = null;
				futureTicks.push(ft);
			}
			continue;
		}
		vals.push(val);
		if (vals.length > sd.days) {
			accAdd -= accSubtract;
			accSubtract -= vals.shift();
		}
		accAdd += vals.length * val;
		accSubtract += val;

		var myVal = i < sd.days - 1 ? null : accAdd / divisor;
		if (offsetQuote) offsetQuote[name] = myVal;
		else if (i + offset >= quotes.length) {
			ft = {};
			ft[name] = myVal;
			futureTicks.push(ft);
		}
	}
	sd.appendFutureTicks(stx, futureTicks);
};

CIQ.Studies.calculateStudyATR = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	var period = sd.days;
	if (quotes.length < period + 1) {
		sd.error = true;
		return;
	}
	var total = 0;
	var name = sd.name;
	for (var i = Math.max(sd.startFrom, 1); i < quotes.length; i++) {
		var prices = quotes[i];
		var pd = quotes[i - 1];
		var trueRange = prices.trueRange;
		if (pd["Sum True Range " + name]) total = pd["Sum True Range " + name];
		total += trueRange;
		if (i > period) total -= quotes[i - period]["True Range " + name];
		prices["True Range " + name] = trueRange;
		prices["Sum True Range " + name] = total;
		if (i == period) prices["ATR " + name] = total / period;
		else if (i > period)
			prices["ATR " + name] =
				(pd["ATR " + name] * (period - 1) + trueRange) / period;
	}
};

CIQ.Studies.calculateIntradayMomentum = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	var period = sd.days;
	if (quotes.length < period + 1) {
		sd.error = true;
		return;
	}

	var totalUp = 0;
	var totalDown = 0;
	if (sd.startFrom > 1) {
		totalUp = quotes[sd.startFrom - 1]["_totUp " + sd.name];
		totalDown = quotes[sd.startFrom - 1]["_totDn " + sd.name];
	}
	for (var i = sd.startFrom; i < quotes.length; i++) {
		var diff = quotes[i].Close - quotes[i].Open;
		if (diff > 0) totalUp += diff;
		else totalDown -= diff;
		if (i >= period) {
			var pDiff = quotes[i - period].Close - quotes[i - period].Open;
			if (pDiff > 0) totalUp -= pDiff;
			else totalDown += pDiff;
		}
		quotes[i]["Result " + sd.name] = (100 * totalUp) / (totalUp + totalDown);
		quotes[i]["_totUp " + sd.name] = totalUp;
		quotes[i]["_totDn " + sd.name] = totalDown;
	}
};

/**
 * Calculate function for Rate Of Change related studies. Price ROC, Volume ROC and Momentum.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateRateOfChange = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	if (quotes.length < sd.days + 1) {
		sd.error = true;
		return;
	}
	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close";
	if (sd.parameters.isVolume) field = "Volume";
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}

	var offset = sd.inputs["Center Line"];
	if (!offset) offset = 0;
	else offset = parseInt(offset, 10);

	for (var i = Math.max(sd.startFrom, sd.days); i < quotes.length; i++) {
		var currentVal = quotes[i][field];
		if (currentVal && typeof currentVal == "object")
			currentVal = currentVal[sd.subField];
		var pastVal = quotes[i - sd.days][field];
		if (pastVal && typeof pastVal == "object") pastVal = pastVal[sd.subField];
		if (sd.type == "Momentum") quotes[i][name] = currentVal - pastVal + offset;
		else {
			var denom = pastVal;
			if (denom) {
				// skip if denominator is 0 --
				quotes[i][name] = 100 * (currentVal / denom - 1) + offset;
			}
		}
	}
};

/**
 * Calculate function for Typical Price studies. Median Price, Typical Price and Weighted Close.
 *
 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
 *
 * **Notes:**
 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {studyDescriptor} sd  Study Descriptor
 * @memberof CIQ.Studies
 */
CIQ.Studies.calculateTypicalPrice = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	var period = sd.days;
	if (quotes.length < period + 1) {
		if (!sd.overlay) sd.error = true;
		return;
	}
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var field = "hlc/3";
	if (sd.type == "Med Price") field = "hl/2";
	else if (sd.type == "Weighted Close") field = "hlcc/4";

	var total = 0;
	if (sd.startFrom <= period) sd.startFrom = 0;
	for (var i = sd.startFrom; i < quotes.length; i++) {
		if (i && quotes[i - 1][name]) total = quotes[i - 1][name] * period;
		total += quotes[i][field];
		if (i >= period) {
			total -= quotes[i - period][field];
			quotes[i][name] = total / period;
		}
	}
};

CIQ.Studies.calculateChandeMomentum = function (stx, sd) {
	var name = sd.name;
	for (var p in sd.outputs) {
		name = p + " " + name;
	}
	var quotes = sd.chart.scrubbed;
	if (quotes.length < sd.days + 1) {
		sd.error = true;
		return;
	}

	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close"; // only used when called from VMA

	var sumMomentum = 0,
		absSumMomentum = 0;
	var history = [];
	for (var i = sd.startFrom - sd.days + 1; i < quotes.length; i++) {
		if (i < 1) continue;
		var q = quotes[i][field],
			q1 = quotes[i - 1][field];
		if (q && typeof q == "object") q = q.Close;
		if (q1 && typeof q1 == "object") q1 = q1.Close;
		if (q1 === undefined) continue; // the field is not defined yet

		var diff = q - q1;
		history.push(diff);
		sumMomentum += diff;
		absSumMomentum += Math.abs(diff);
		if (history.length == sd.days) {
			quotes[i][name] = (100 * sumMomentum) / absSumMomentum;
			var old = history.shift();
			sumMomentum -= old;
			absSumMomentum -= Math.abs(old);
		}
	}
};

CIQ.Studies.calculateLinearRegressionIndicator = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	if (quotes.length < sd.days + 1) {
		sd.error = true;
		return;
	}
	var field = sd.inputs.Field;
	if (!field || field == "field") field = "Close";

	var sumWeights = (sd.days * (sd.days + 1)) / 2;
	var squaredSumWeights = Math.pow(sumWeights, 2);
	var sumWeightsSquared = (sumWeights * (2 * sd.days + 1)) / 3;

	var sumCloses = 0;
	var sumWeightedCloses = 0;
	var sumClosesSquared = 0;
	if (sd.startFrom) {
		var sums = quotes[sd.startFrom - 1]["_sums " + sd.name];
		if (sums) {
			sumWeightedCloses = sums[0];
			sumCloses = sums[1];
			sumClosesSquared = sums[2];
		}
	}
	for (var i = sd.startFrom; i < quotes.length; i++) {
		var currentQuote = quotes[i][field];
		if (currentQuote && typeof currentQuote == "object")
			currentQuote = currentQuote[sd.subField];
		if (!currentQuote && currentQuote !== 0) continue;
		sumWeightedCloses += sd.days * currentQuote - sumCloses;
		sumCloses += currentQuote;
		sumClosesSquared += Math.pow(currentQuote, 2);
		if (i < sd.days - 1) continue;
		else if (i > sd.days - 1) {
			var daysAgoQuote = quotes[i - sd.days][field];
			if (daysAgoQuote && typeof daysAgoQuote == "object")
				daysAgoQuote = daysAgoQuote[sd.subField];
			if (!daysAgoQuote && daysAgoQuote !== 0) continue;
			sumCloses -= daysAgoQuote;
			sumClosesSquared -= Math.pow(daysAgoQuote, 2);
		}
		var b =
			(sd.days * sumWeightedCloses - sumWeights * sumCloses) /
			(sd.days * sumWeightsSquared - squaredSumWeights);
		quotes[i]["Slope " + sd.name] = b;
		var a = (sumCloses - b * sumWeights) / sd.days;
		quotes[i]["Intercept " + sd.name] = a;
		quotes[i]["Forecast " + sd.name] = a + b * sd.days;
		var c =
			(sd.days * sumWeightsSquared - squaredSumWeights) /
			(sd.days * sumClosesSquared - Math.pow(sumCloses, 2));
		quotes[i]["RSquared " + sd.name] = b * b * c;
		quotes[i]["_sums " + sd.name] = [
			sumWeightedCloses,
			sumCloses,
			sumClosesSquared
		];
	}
};

/**
 * Calculates data for Price Relative Study
 *
 * @param  {CIQ.ChartEngine} stx	The chart object
 * @param  {object} sd	The study descriptor object
 * @memberof CIQ.Studies
 * @version ChartIQ Advanced Package
 */
CIQ.Studies.calculatePriceRelative = function (stx, sd) {
	var quotes = sd.chart.scrubbed;
	var cSym = sd.inputs["Comparison Symbol"].toUpperCase();
	if (!cSym) cSym = sd.study.inputs["Comparison Symbol"];

	var map = {};
	var mainSymbol = stx.chart.symbol || "";
	mainSymbol = mainSymbol.replace(/[=+\-*\\%]/g, "");
	map[mainSymbol] = quotes.slice(sd.startFrom);
	if (!map[mainSymbol].length) return;
	if (mainSymbol != cSym) map[cSym] = null;
	var results = CIQ.computeEquationChart(
		"[" + mainSymbol + "]/[" + cSym + "]",
		map
	);
	var rIter = 0;
	for (var i = sd.startFrom; i < quotes.length && rIter < results.length; i++) {
		while (
			rIter < results.length &&
			quotes[i].DT.getTime() > results[rIter].DT.getTime()
		)
			rIter++;
		if (quotes[i].DT.getTime() < results[rIter].DT.getTime()) continue;
		quotes[i]["Result " + sd.name] = results[rIter].Close;
		rIter++;
	}
};

/**
 * Calculate function for VWAP.
 *
 * Cumulative values are calculated on a daily basis.
 * The start of the day is calculated based on the particular market start time.
 * As such, you may need to review your market definitions and symbology for this study to properly work with your data as the default assumptions may not totally match.
 * More information on setting market hours and symbology rules can be found here: {@link CIQ.Market}
 *
 * In our calculations, the beginning of the Forex day is 17:00 NY Time.
 * The chart will be adjusted as needed to reflect this time in the browser time zone (or any specificaly set display zone).
 *
 * @param  {CIQ.ChartEngine} stx Chart object
 * @param  {object} sd  Study Descriptor
 * @memberof CIQ.Studies
 * @version ChartIQ Advanced Package
 * @since 7.0.0 Used for AVWAP calculation as well.
 */
CIQ.Studies.calculateVWAP = function (stx, sd) {
	var avwap = sd.type == "AVWAP";
	var quotes = sd.chart.scrubbed;
	if (!avwap && CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
		sd.error = "VWAP is Intraday Only";
		return;
	}
	var field = "hlc/3";
	if (avwap) {
		field = sd.inputs.Field;
		if (!field || field == "field") {
			field = sd.inputs.Field = "hlc/3";
			stx.changeOccurred("layout");
		}
	}
	var isForex = CIQ.Market.Symbology.isForexSymbol(stx.chart.symbol);
	var isMetal = CIQ.Market.Symbology.isForexMetal(stx.chart.symbol);
	var marketOffset = null;
	var volume = 0;
	var volume_price = 0;
	var volume_price2 = 0;
	var hasThereBeenVolume = false;

	if (sd.startFrom > 1) {
		volume = quotes[sd.startFrom - 1]["_V " + sd.name] || 0;
		volume_price = quotes[sd.startFrom - 1]["_VxP " + sd.name] || 0;
		volume_price2 = quotes[sd.startFrom - 1]["_VxP2 " + sd.name] || 0;
	}
	if (avwap) {
		var anchorDate = sd.inputs["Anchor Date"].replace(/-/g, "");
		if (anchorDate.search(/^\d{8}$/)) {
			sd.error = "Invalid Anchor Date";
			return;
		}
		var anchorTime = sd.inputs["Anchor Time"].replace(/:/g, "");
		if (!anchorTime.search(/^\d{4,6}$/)) {
			anchorDate += anchorTime;
		}
		anchorDate = CIQ.strToDateTime(anchorDate.replace(/\D/g, ""));
		if (!sd.startFrom && anchorDate >= quotes[0].DT)
			sd.startFrom = stx.tickFromDate(anchorDate, stx.chart, null, true);
	}
	for (var i = sd.startFrom; i < quotes.length; i++) {
		if (!avwap) {
			if (marketOffset === null) {
				//possible new daily period
				marketOffset = CIQ.Studies.getMarketOffset(stx, quotes[i].DT, isForex);
				//Forex beginning of day is 17:00 NY Time, so add 7 hours of msecs (6 for metals) to make it fall on a date boundary
				if (isForex) marketOffset += (isMetal ? 6 : 7) * 60 * 60 * 1000;
			}
			if (quotes[i - 1] && quotes[i - 1].DT) {
				var newDate = new Date(
					new Date(+quotes[i].DT).setMilliseconds(
						quotes[i].DT.getMilliseconds() + marketOffset
					)
				);
				var oldDate = new Date(
					new Date(+quotes[i - 1].DT).setMilliseconds(
						quotes[i - 1].DT.getMilliseconds() + marketOffset
					)
				);
				if (
					oldDate.getDate() != newDate.getDate() &&
					stx.chart.market.isMarketDate(newDate)
				) {
					//new daily period
					marketOffset = null;
					volume = volume_price = volume_price2 = 0;
				}
			}
		}
		var price = quotes[i][field];
		var thisVolume = quotes[i].Volume;
		if (avwap && !thisVolume) thisVolume = 1;
		volume += thisVolume;
		volume_price += thisVolume * price;
		volume_price2 += thisVolume * price * price;
		if (!avwap && !volume) continue;
		quotes[i]["_V " + sd.name] = volume;
		quotes[i]["_VxP " + sd.name] = volume_price;
		quotes[i]["_VxP2 " + sd.name] = volume_price2;
		var sdev = (quotes[i]["_SDVWAP " + sd.name] = Math.sqrt(
			Math.max(0, volume_price2 / volume - Math.pow(volume_price / volume, 2))
		));
		var vwap = (quotes[i]["VWAP " + sd.name] = volume_price / volume);
		for (var j = 1; j <= 3; j++) {
			quotes[i]["SDVWAP" + j + "+ " + sd.name] = vwap + j * sdev;
			quotes[i]["SDVWAP" + j + "- " + sd.name] = vwap - j * sdev;
		}
		hasThereBeenVolume = true;
	}
	for (var k = 1; k <= 3; k++) {
		if (sd.inputs["Display " + k + " Standard Deviation (" + k + "\u03C3)"]) {
			sd.outputMap["SDVWAP" + k + "+ " + sd.name] =
				k + " Standard Deviation (" + k + "\u03C3)";
			sd.outputMap["SDVWAP" + k + "- " + sd.name] =
				k + " Standard Deviation (" + k + "\u03C3)";
		}
	}
	if (!avwap && !hasThereBeenVolume) {
		sd.error = "VWAP Requires Volume";
	}
};

/**
 * Initializes Anchored VWAP study
 *
 * Specifically, sets the anchor date and time to the first dataSegment record if it's left blank
 *
 * @param {CIQ.ChartEngine} stx	The chart object
 * @param {string} type Study type
 * @param {object} inputs Study inputs
 * @param {object} outputs Study outputs
 * @param {object} parameters Study parameters
 * @param {string} panel ID of the study's panel element
 * @return {studyDescriptor} Study descriptor object
 *
 * @memberof CIQ.Studies
 * @private
 * @since 6.3.0
 */
CIQ.Studies.initAnchoredVWAP = function (
	stx,
	type,
	inputs,
	outputs,
	parameters,
	panel
) {
	if (!inputs["Anchor Date"] && !inputs["Anchor Time"]) {
		var dataSegment = stx.chart.dataSegment;
		for (var i = 0; dataSegment && i < dataSegment.length; i++) {
			if (dataSegment[i]) {
				var anchorDateTime = CIQ.yyyymmddhhmmssmmm(dataSegment[i].DT);
				inputs["Anchor Date"] = anchorDateTime.substr(0, 8);
				inputs["Anchor Time"] = anchorDateTime.substr(8, 6);
				break;
			}
		}
	}
	var sd = CIQ.Studies.initializeFN(
		stx,
		type,
		inputs,
		outputs,
		parameters,
		panel
	);
	return sd;
};

CIQ.Studies.displayVsComparisonSymbol = function (stx, sd, quotes) {
	var symbol = sd.inputs["Comparison Symbol"].toUpperCase();
	if (!stx.getSeries({ symbol: symbol, chart: sd.chart }).length) {
		stx.displayErrorAsWatermark(
			sd.panel,
			stx.translateIf(sd.study.name) + ": " + stx.translateIf("Not Available")
		);
		return;
	}
	var params = {
		skipTransform: stx.panels[sd.panel].name != sd.chart.name,
		panelName: sd.panel,
		band: "Result " + sd.name,
		threshold: sd.study.centerline,
		yAxis: sd.getYAxis(stx),
		gapDisplayStyle: true
	};
	var flipped = params.yAxis
		? params.yAxis.flipped
		: stx.panels[sd.panel].yAxis.flipped;
	var opacity = 0.3;
	if (!sd.highlight && stx.highlightedDraggable) opacity *= 0.3;

	for (var c = quotes.length - 1; c >= 0; c--) {
		if (quotes[c] && quotes[c][symbol]) {
			CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
			if (sd.study.centerline || sd.study.centerline === 0) {
				if (sd.outputs.Gain)
					CIQ.preparePeakValleyFill(
						stx,
						CIQ.extend(params, {
							direction: flipped ? -1 : 1,
							color: CIQ.Studies.determineColor(sd.outputs.Gain),
							opacity: opacity
						})
					);
				if (sd.outputs.Loss)
					CIQ.preparePeakValleyFill(
						stx,
						CIQ.extend(params, {
							direction: flipped ? 1 : -1,
							color: CIQ.Studies.determineColor(sd.outputs.Loss),
							opacity: opacity
						})
					);
			}
			return;
		}
	}
};

CIQ.Studies.displayVWAP = function (stx, sd, quotes) {
	CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);

	var displayS1 = sd.inputs["Display 1 Standard Deviation (1\u03C3)"];
	var displayS2 = sd.inputs["Display 2 Standard Deviation (2\u03C3)"];
	var displayS3 = sd.inputs["Display 3 Standard Deviation (3\u03C3)"];

	if ((displayS1 || displayS2 || displayS3) && sd.inputs.Shading) {
		var panel = stx.panels[sd.panel];
		var params = {
			opacity: sd.parameters.opacity ? sd.parameters.opacity : 0.2,
			skipTransform: panel.name != sd.chart.name,
			yAxis: sd.getYAxis(stx)
		};
		if (!sd.highlight && stx.highlightedDraggable) params.opacity *= 0.3;

		var bottomBandP = "VWAP " + sd.name,
			bottomBandN = "VWAP " + sd.name;
		if (displayS1) {
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP1+ " + sd.name,
						bottomBand: bottomBandP,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP1+ " + sd.name]]
						)
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP1- " + sd.name,
						bottomBand: bottomBandN,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP1- " + sd.name]]
						)
					},
					params
				)
			);
			bottomBandP = "SDVWAP1+ " + sd.name;
			bottomBandN = "SDVWAP1- " + sd.name;
		}
		if (displayS2) {
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP2+ " + sd.name,
						bottomBand: bottomBandP,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP2+ " + sd.name]]
						)
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP2- " + sd.name,
						bottomBand: bottomBandN,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP2- " + sd.name]]
						)
					},
					params
				)
			);
			bottomBandP = "SDVWAP2+ " + sd.name;
			bottomBandN = "SDVWAP2- " + sd.name;
		}
		if (displayS3) {
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP3+ " + sd.name,
						bottomBand: bottomBandP,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP3+ " + sd.name]]
						)
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "SDVWAP3- " + sd.name,
						bottomBand: bottomBandN,
						color: CIQ.Studies.determineColor(
							sd.outputs[sd.outputMap["SDVWAP3- " + sd.name]]
						)
					},
					params
				)
			);
		}
	}
};

/**
 * Initializes data for Price Relative Study by fetching the comparing symbol.
 *
 * @param {CIQ.ChartEngine} stx	The chart object
 * @param {string} type Study type
 * @param {object} inputs Study inputs
 * @param {object} outputs Study outputs
 * @param {object} parameters Study parameters
 * @param {string} panel ID of the study's panel element
 * @return {studyDescriptor} Study descriptor object
 * @memberof CIQ.Studies
 * @version ChartIQ Advanced Package
 * @since 09-2016-19
 */
CIQ.Studies.initPriceRelative = function (
	stx,
	type,
	inputs,
	outputs,
	parameters,
	panel
) {
	var sd = CIQ.Studies.initializeFN(
		stx,
		type,
		inputs,
		outputs,
		parameters,
		panel
	);
	var syms = [sd.inputs["Comparison Symbol"].toUpperCase()];

	CIQ.Studies.fetchAdditionalInstruments(stx, sd, syms);
	return sd;
};

CIQ.Studies.inputAttributeDefaultGenerator = function (value) {
	if (!value && value !== 0) return {};
	if (value.constructor == Number) {
		if (Math.floor(value) == value) {
			// Integer
			if (value > 0) return { min: 1, step: 1 }; // positive
			return { step: 1 }; // full range
		}
		// Decimal
		if (value > 0) return { min: 0, step: 0.01 }; // positive
		return { step: 0.01 }; // full range
	}
	return {};
};

/**
 * Gets the difference between the local browser time and the market time.
 *
 * @param {CIQ.ChartEngine} stx	A reference to the chart object.
 * @param {object} localQuoteDate A Date object that contains the date and time of the local
 * 		quote.
 * @param {boolean} isForex Indicates whether the market is a Forex (foreign exchange) market.
 * @return {number} The market date/time minus the local date/time in milliseconds.
 *
 * @memberof CIQ.Studies
 * @since 8.0.0
 */
CIQ.Studies.getMarketOffset = function (stx, localQuoteDate, isForex) {
	var marketZone;
	if (!stx.chart.market) marketZone = null;
	else marketZone = isForex ? "America/New_York" : stx.chart.market.market_tz;

	var dt = new Date(
		localQuoteDate.getTime() + localQuoteDate.getTimezoneOffset() * 60000
	);
	if (!marketZone || marketZone.indexOf("UTC") == -1)
		dt = CIQ.convertTimeZone(dt, "UTC", marketZone);

	return (
		new Date(
			dt.getFullYear(),
			dt.getMonth(),
			dt.getDate(),
			dt.getHours(),
			dt.getMinutes(),
			dt.getSeconds(),
			dt.getMilliseconds()
		).getTime() - localQuoteDate.getTime()
	);
};

/**
 * Function to determine which studies are available.
 * @param  {object} excludeList Exclusion list of studies in object form ( e.g. {"rsi":true,"macd":true})
 * @returns {object} Map of available entries from {@link CIQ.Studies.studyLibrary}.
 * @memberof CIQ.Studies
 * @since 3.0.0
 */
CIQ.Studies.getStudyList = function (excludeList) {
	var map = {};
	var excludedStudies = {}; // from time to time put old studies in here to not list them
	CIQ.extend(excludedStudies, excludeList);
	for (var libraryEntry in CIQ.Studies.studyLibrary) {
		if (!excludedStudies[libraryEntry])
			map[CIQ.Studies.studyLibrary[libraryEntry].name] = libraryEntry;
	}
	return map;
};

/**
 * A helper function that will find the color value in the output.
 * @param {String/Object} output Color string value or object that has the color value
 * @return {string}	Color value
 * @memberof CIQ.Studies
 * @since 4.0.0
 */
CIQ.Studies.determineColor = function (output) {
	if (!output) {
		return null;
	} else if (typeof output === "object") {
		return output.color;
	}

	return output;
};

/**
 * Ensures that symbols required by a study are loaded and maintained by the quotefeed.
 * @param  {CIQ.ChartEngine} stx  The chart engine
 * @param  {object} sd   The study descriptor
 * @param  {array} syms An array of 'symbol strings' or 'symbol objects' required by the study. If using symbol objets, in addition to our desired identifier elements, you must `always` include the `symbol` element in it (ie: `symbolObject[i]={ symbol : mySymbol , otherStuff1 : xx , moreStuff : yy}`.
 * @param {object} [params] Parameters to be sent to addSeries. See {@link CIQ.ChartEngine#addSeries}.
 * @memberof CIQ.Studies
 * @version ChartIQ Advanced Package
 * @since 3.0.7 This was a previously private function.
 */
CIQ.Studies.fetchAdditionalInstruments = function (stx, sd, syms, params) {
	if (!stx.quoteDriver) {
		console.log(
			"CIQ.Studies.fetchAdditionalInstruments: No quotefeed to fetch symbol"
		);
		return;
	}
	// sd.chart may not be initialized, so we find it the hard way
	var chart = stx.panels[sd.panel].chart;

	// We'll remember which symbols we have set so that we can delete them later
	sd.symbols = syms;

	var i, symbol, symbolObject;
	// Add entries for the symbols we need. If those symbols already exist, add the study name as a dependency
	function addSeriesCB() {
		stx.createDataSet();
		stx.draw();
	}
	for (i = 0; i < syms.length; i++) {
		symbol = symbolObject = syms[i];
		if (typeof symbolObject == "object") {
			symbol = symbolObject.symbol;
		} else {
			symbolObject = { symbol: symbol };
		}
		var parameters = {
			symbol: symbol,
			symbolObject: symbolObject,
			bucket: "study",
			studyName: sd.name,
			chartName: chart.name,
			action: "add-study"
		};
		CIQ.extend(parameters, params);
		var loadData = parameters.loadData;
		if (stx.currentlyImporting) parameters.loadData = false; // do not load data if importing as periodicity will not be correct; instead let loadDependents load data
		if (!sd.series) sd.series = {};
		sd.series[symbol] = stx.addSeries(null, parameters, addSeriesCB);
		sd.series[symbol].parameters.loadData = loadData;
	}
};

// object to keep track of the custom scripts
CIQ.Studies.studyScriptLibrary = {};

/**
 * The `studyLibrary` defines all of the available studies.
 *
 * This is used to drive the dialog boxes and creation of the studies. When you
 * create a custom study you should add it to the studyLibrary.
 *
 * You can also alter study defaults by overriding the different elements on each definition.
 * For example, if you wanted to change the default colors for the volume underlay,
 * you would add the following code in your files; making sure your files are loaded **after** the library js files -- not before:
 * ```
 * CIQ.Studies.studyLibrary["vol undr"].outputs= {"Up Volume":"blue","Down Volume":"yellow"};
 * ```
 * See {@tutorial Using and Customizing Studies} for complete details.
 * @type {Object}
 * @memberof CIQ.Studies
 * @example
 * "RAVI": {
 *     "name": "RAVI",
 *     "seriesFN": CIQ.Studies.displayRAVI,
 *     "calculateFN": CIQ.Studies.calculatePriceOscillator,
 *     "inputs": {"Field":"field", "Short Cycle":7, "Long Cycle":65},
 *     "outputs": {"Increasing Bar":"#00DD00", "Decreasing Bar":"#FF0000"},
 *     "parameters": {
 *         init:{studyOverZonesEnabled:true, studyOverBoughtValue:3, studyOverBoughtColor:"auto", studyOverSoldValue:-3, studyOverSoldColor:"auto"}
 *     },
 *     "attributes":{
 *         "studyOverBoughtValue":{"min":0,"step":"0.1"},
 *         "studyOverSoldValue":{"max":0,"step":"0.1"}
 *     }
 * }
 */
if (!CIQ.Studies.studyLibrary) CIQ.Studies.studyLibrary = {};
CIQ.extend(CIQ.Studies.studyLibrary, {
	ma: {
		name: "Moving Average",
		overlay: true,
		calculateFN: CIQ.Studies.calculateMovingAverage,
		inputs: { Period: 50, Field: "field", Type: "ma", Offset: 0 },
		outputs: { MA: "#FF0000" }
	},
	"STD Dev": {
		name: "Standard Deviation",
		calculateFN: CIQ.Studies.calculateStandardDeviation,
		inputs: {
			Period: 14,
			Field: "field",
			"Standard Deviations": 2,
			"Moving Average Type": "ma"
		},
		attributes: {
			"Standard Deviations": { min: 0.1, step: 0.1 }
		}
	},
	AVWAP: {
		name: "Anchored VWAP",
		overlay: true,
		calculateFN: CIQ.Studies.calculateVWAP,
		seriesFN: CIQ.Studies.displayVWAP,
		initializeFN: CIQ.Studies.initAnchoredVWAP,
		inputs: {
			Field: "field",
			"Anchor Date": "",
			"Anchor Time": "",
			"Display 1 Standard Deviation (1\u03C3)": false,
			"Display 2 Standard Deviation (2\u03C3)": false,
			"Display 3 Standard Deviation (3\u03C3)": false,
			Shading: false
		},
		outputs: {
			VWAP: "#FF0000",
			"1 Standard Deviation (1\u03C3)": "#e1e1e1",
			"2 Standard Deviation (2\u03C3)": "#85c99e",
			"3 Standard Deviation (3\u03C3)": "#fff69e"
		},
		parameters: {
			init: { opacity: 0.2 }
		},
		attributes: {
			"Anchor Date": { placeholder: "yyyy-mm-dd" },
			"Anchor Time": { placeholder: "hh:mm:ss", step: 1 }
		}
	},
	"Price ROC": {
		name: "Price Rate of Change",
		calculateFN: CIQ.Studies.calculateRateOfChange,
		inputs: { Period: 14, Field: "field" }
	},
	Momentum: {
		name: "Momentum Indicator",
		calculateFN: CIQ.Studies.calculateRateOfChange,
		inputs: { Period: 14 },
		centerline: 0
	},
	"True Range": {
		name: "True Range",
		calculateFN: CIQ.Studies.calculateStudyATR,
		inputs: {},
		outputs: { "True Range": "auto" }
	},
	"Med Price": {
		name: "Median Price",
		calculateFN: CIQ.Studies.calculateTypicalPrice,
		inputs: { Period: 14 }
	},
	"P Rel": {
		name: "Price Relative",
		initializeFN: CIQ.Studies.initPriceRelative,
		seriesFN: CIQ.Studies.displayVsComparisonSymbol,
		calculateFN: CIQ.Studies.calculatePriceRelative,
		centerline: 0,
		inputs: { "Comparison Symbol": "SPY" },
		deferUpdate: true
	},
	volume: {
		name: "Volume Chart",
		range: "0 to max",
		yAxis: { ground: true, initialMarginTop: 0, zoom: 0 },
		seriesFN: CIQ.Studies.createVolumeChart,
		calculateFN: CIQ.Studies.calculateVolume,
		inputs: {},
		outputs: { "Up Volume": "#8cc176", "Down Volume": "#b82c0c" }
	},
	VWAP: {
		name: "VWAP",
		overlay: true,
		calculateFN: CIQ.Studies.calculateVWAP,
		seriesFN: CIQ.Studies.displayVWAP,
		inputs: {
			"Display 1 Standard Deviation (1\u03C3)": false,
			"Display 2 Standard Deviation (2\u03C3)": false,
			"Display 3 Standard Deviation (3\u03C3)": false,
			Shading: false
		},
		outputs: {
			VWAP: "#FF0000",
			"1 Standard Deviation (1\u03C3)": "#e1e1e1",
			"2 Standard Deviation (2\u03C3)": "#85c99e",
			"3 Standard Deviation (3\u03C3)": "#fff69e"
		},
		parameters: {
			init: { opacity: 0.2 }
		}
	}
});

};

let __js_standard_symbolLookupBase_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.ChartEngine.Driver) {
	console.error(
		"symbolLookupBase feature requires first activating quoteFeed feature."
	);
} else {
	/**
	 * Base class that drives the lookup (Symbol Search) functionality.
	 *
	 * You should derive your own Driver.Lookup that interacts with your datafeed.
	 *
	 * This is used with the [cq-lookup web component]{@link WebComponents.cq-lookup} and [CIQ.UI.Context.setLookupDriver](CIQ.UI.Context.html#setLookupDriver)
	 *
	 * @name CIQ.ChartEngine.Driver.Lookup
	 * @constructor
	 * @param {array} exchanges An array of exchanges that can be searched against
	 * @example
	 * // sample implementation
	 * CIQ.ChartEngine.Driver.Lookup.ChartIQ=function(exchanges){
	 *	this.exchanges=exchanges;
	 *	if(!this.exchanges) this.exchanges=["XNYS","XASE","XNAS","XASX","INDCBSX","INDXASE","INDXNAS","IND_DJI","ARCX","INDARCX","forex"];
	 *	this.url="https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
	 *	this.requestCounter=0;  //used to invalidate old requests
	 * };
	 *
	 * //Inherits all of the base Lookup Driver's properties via `CIQ.inheritsFrom()`
	 * 	CIQ.inheritsFrom(CIQ.ChartEngine.Driver.Lookup.ChartIQ,CIQ.ChartEngine.Driver.Lookup);
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup = function () {};

	/**
	 * **Abstract method** used to accept the selected text with optional filter and return an array of properly formatted objects.
	 *
	 * You should implement your own instance of this method to fetch results from your symbol list and return them by calling cb(your-results-array-here);
	 *
	 * Each element in the array should be of the following format:
	 * {
	 * 		display:["symbol-id","Symbol Description","exchange"],
	 * 		data:{
	 * 			symbol:"symbol-id",
	 * 			name:"Symbol Description",
	 * 			exchDis:"exchange"
	 * 		}
	 * }
	 *
	 * @param {string} text The text entered by the user
	 * @param {string} [filter] The optional filter text selected by the user. This will be the innerHTML of the cq-filter element that is selected.
	 * @param {number} maxResults Max number of results to return from the server
	 * @param {function} cb Callback upon results
	 * @memberof CIQ.ChartEngine.Driver.Lookup
	 * @example
		// sample implementation
		CIQ.ChartEngine.Driver.Lookup.ChartIQ.prototype.acceptText=function(text, filter, maxResults, cb){
			if(filter=="FX") filter="FOREX";
			if(isNaN(parseInt(maxResults, 10))) maxResults=100;
			var url=this.url+"?t=" + encodeURIComponent(text) + "&m="+maxResults+"&x=[";
			if(this.exchanges){
				url+=this.exchanges.join(",");
			}
			url+="]";
			if(filter && filter.toUpperCase()!="ALL"){
				url+="&e=" + filter;
			}

			var counter=++this.requestCounter;
			var self=this;
			function handleResponse(status, response){
				if(counter<self.requestCounter) return;
				if(status!=200) return;
				try{
					response=JSON.parse(response);
					var symbols=response.payload.symbols;

					var results=[];
					for(var i=0;i<symbols.length;i++){
						var fields=symbols[i].split('|');
						var item={
							symbol: fields[0],
							name: fields[1],
							exchDisp: fields[2]
						};
						results.push({
							display:[item.symbol, item.name, item.exchDisp],
							data:item
						});
					}
						cb(results);
				}catch(e){}
			}
			CIQ.postAjax({url: url, cb: handleResponse});
		};
	 * @example
	 *  // sample response array
	 *  [
	 *  	{"display":["A","Agilent Technologies Inc","NYSE"],"data":{"symbol":"A","name":"Agilent Technologies Inc","exchDisp":"NYSE"}},
	 *  	{"display":["AA","Alcoa Corp","NYSE"],"data":{"symbol":"AA","name":"Alcoa Corp","exchDisp":"NYSE"}}
	 *  ];
	 * @since 6.0.0
	 */
	CIQ.ChartEngine.Driver.Lookup.prototype.acceptText = function (
		text,
		filter,
		maxResults,
		cb
	) {
		if (!this.cb) return;
	};
}

};

let __js_standard_theme_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Generates an object that can be used programmatically to load new themes or to create a theme dialog to manage chart themes.
 * The initial values contain the existing values in the current chart.
 * Simply have your dialog modify these values and then call the method {@link CIQ.ThemeHelper#update}
 *
 * Note that the chart has many granular customizations beyond what this theme helper produces.
 * This helper simplifies and consolidates into a manageable set.
 * For example 'hallow candles', 'bars' and 'candles' colors are all grouped together.
 * But if you need to separate those out, just call an explicit {@link CIQ.ChartEngine#setStyle} for each CSS style right after the ThemeHelper is executed.
 *
 * For example, This will further set the color for the hollow_candle chart type:
 * ```
 * stxx.setStyle("stx_hollow_candle_down","color",'blue');
 * stxx.setStyle("stx_hollow_candle_up","color",'yellow');
 * stxx.setStyle("stx_hollow_candle_even","color",'pink');
 * stxx.draw();
 * ```
 * See {@tutorial Chart Styles and Types} for more details.
 *
 * Generally speaking, themes can be managed by simply adding or removing from the chart context the class name that groups the theme together.
 * And as long as the CSS contains an entry for that class, the chart will display the styles in the class when enabled.
 *
 * For example, assume the chart has a default theme and a second theme called 'ciq-night'.
 * Here are some examples of what CSS entries for those classes would look like:
 * ```
 * // default theme (day) styles
 * .stx_candle_shadow, .stx_bar_even {
 * 		color:#2e383b;
 *
 * }
 * .stx_candle_down, .stx_line_down {
 * 		border-left-color: #000000;
 * }
 *
 * // night theme override styles
 * .ciq-night .stx_candle_shadow, .ciq-night .stx_bar_even {
 * 		color: #ccc;
 * }
 * .ciq-night .stx_candle_down, .ciq-night .stx_line_down {
 * 		border-left-color: #e34621;
 * }
 * ```
 *
 * Then to activate a particular theme, you either remove the specific class to enable default (day):
 * ```
 * $("cq-context").removeClass('ciq-night');
 * // clear out the old styles to allow new ones to be cached in; and redraw.
 * stxx.styles={};stxx.draw();
 * ```
 * Or add a particular class to enable those styles:
 * ```
 * $("cq-context").addClass('ciq-night');
 * // clear out the old styles to allow new ones to be cached in; and redraw.
 * stxx.styles={};stxx.draw();
 * ```
 * You can use this method to set as many themes as needed. Remember that this method, requires all styles to be present in the CSS.
 * ThemeHelper, on the other hand, will programmatically set the styles internally, one at a time, regardless of pre-existng CSS classes.
 *
 * @param {object} params Parameters
 * @param {CIQ.ChartEngine} params.stx A chart object
 * @constructor
 * @name  CIQ.ThemeHelper
 * @example
 * var helper=new CIQ.ThemeHelper({stx:stx});
 * console.log(helper.settings);
 * helper.settings.chart["Grid Lines"].color="rgba(255,0,0,.5)";
 * helper.update();
 *
 * @since 6.2.0 Added support to control `Mountain.basecolor`.
 */
CIQ.ThemeHelper =
	CIQ.ThemeHelper ||
	function (params) {
		this.params = params;
		var stx = params.stx;
		var backgroundColor = "#FFFFFF";
		if (stx.chart.container) {
			backgroundColor = getComputedStyle(stx.chart.container).backgroundColor;
			if (CIQ.isTransparent(backgroundColor))
				backgroundColor = stx.containerColor;
		}
		this.settings.chart.Background.color = CIQ.hexToRgba(backgroundColor);
		this.settings.chart["Grid Lines"].color = CIQ.hexToRgba(
			stx.canvasStyle("stx_grid").color
		);
		this.settings.chart["Grid Dividers"].color = CIQ.hexToRgba(
			stx.canvasStyle("stx_grid_dark").color
		);
		this.settings.chart["Axis Text"].color = CIQ.hexToRgba(
			stx.canvasStyle("stx_xaxis").color
		);

		this.settings.chartTypes["Candle/Bar"].up.color = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_up").color
		);

		this.settings.chartTypes["Candle/Bar"].down.color = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_down").color
		);
		this.settings.chartTypes["Candle/Bar"].up.wick = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_shadow_up").color
		);
		this.settings.chartTypes["Candle/Bar"].down.wick = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_shadow_down").color
		);
		this.settings.chartTypes["Candle/Bar"].even.wick = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_shadow_even").color
		);
		this.settings.chartTypes["Candle/Bar"].up.border = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_up").borderLeftColor
		);
		this.settings.chartTypes["Candle/Bar"].down.border = CIQ.hexToRgba(
			stx.canvasStyle("stx_candle_down").borderLeftColor
		);
		if (CIQ.isTransparent(stx.canvasStyle("stx_candle_up").borderLeftColor))
			this.settings.chartTypes["Candle/Bar"].up.border = null;
		if (CIQ.isTransparent(stx.canvasStyle("stx_candle_down").borderLeftColor))
			this.settings.chartTypes["Candle/Bar"].down.border = null;

		this.settings.chartTypes.Line.color = CIQ.hexToRgba(
			stx.canvasStyle("stx_line_chart").color
		);

		this.settings.chartTypes.Mountain.color = CIQ.hexToRgba(
			stx.canvasStyle("stx_mountain_chart").backgroundColor
		);
		this.settings.chartTypes.Mountain.basecolor = CIQ.hexToRgba(
			stx.canvasStyle("stx_mountain_chart").color
		);
	};

/**
 * Current theme settings. These are the settings that are ready to be loaded, or currently loaded.
 * Modify as needed.
 * To load these settings call {@link CIQ.ThemeHelper#update}
 * @example
 * //Default settings object structure
 * 	"chart":{
		"Background":{
			"color":color1
		},
		"Grid Lines":{
			"color":color2
		},
		"Grid Dividers":{
			"color":color3
		},
		"Axis Text":{
			"color":color4
		}
	},
	"chartTypes":{
		"Candle/Bar":{ // also manages 'hollow candle', 'colored line' and 'colored baseline' chart types.
			"up":{
				"color":color5,
				"wick":color6,
				"border":color7
			},
			"down":{
				"color":color8,
				"wick":color9,
				"border":color10
			},
			"even":{		// colors used when the current close is equal to the previous close.
				"color":color11,
				"wick":color12,
				"border":color13
			}
		},
		"Line":{
			"color":color14
		},
		"Mountain":{
			"color":color15,
			"basecolor":color16
		}
	}
 * @memberof CIQ.ThemeHelper
 * @type object
 */
CIQ.ThemeHelper.prototype.settings = {
	chart: {
		Background: {
			color: null
		},
		"Grid Lines": {
			color: null
		},
		"Grid Dividers": {
			color: null
		},
		"Axis Text": {
			color: null
		}
	},
	chartTypes: {
		"Candle/Bar": {
			up: {
				color: null,
				wick: null,
				border: null
			},
			down: {
				color: null,
				wick: null,
				border: null
			},
			even: {
				color: null,
				wick: null,
				border: null
			}
		},
		Line: {
			color: null
		},
		Mountain: {
			color: null,
			basecolor: null
		}
	}
};

/**
 * Call this method to activate the chart theme with values set in {@link CIQ.ThemeHelper#settings}
 * @memberof CIQ.ThemeHelper
 * @param {CIQ.ChartEngine} [stx] Chart engine to apply the changes to.
 * @example
 * var helper=new CIQ.ThemeHelper({stx:stx});
 * console.log(helper.settings);
 * helper.settings=NewSettings;
 * helper.update();
 * @since
 * - 4.1.0 Added optional chart engine parameter.
 * - 6.2.0 Now setting base color and color of mountain chart with separate colors.
 * - 6.3.0 Colored Bar, Hollow Candle, Volume Candle charts now use `chartTypes["Candle/Bar"].even.color` for even bar color.
 */
CIQ.ThemeHelper.prototype.update = function (stx) {
	if (!stx) stx = this.params.stx;
	var classMapping = {
		stx_candle_up: {
			stx_candle_up: true,
			stx_bar_up: true,
			stx_hollow_candle_up: true,
			stx_line_up: true,
			stx_baseline_up: true
		},
		stx_candle_down: {
			stx_candle_down: true,
			stx_bar_down: true,
			stx_hollow_candle_down: true,
			stx_line_down: true,
			stx_baseline_down: true
		},
		stx_candle_even: { stx_hollow_candle_even: true, stx_bar_even: true },
		stx_shadow_up: { stx_candle_shadow_up: true },
		stx_shadow_down: { stx_candle_shadow_down: true },
		stx_shadow_even: { stx_candle_shadow_even: true },
		stx_line_chart: { stx_bar_chart: true, stx_line_chart: true },
		stx_grid: { stx_grid: true },
		stx_grid_dark: { stx_grid_dark: true },
		stx_xaxis: {
			stx_xaxis_dark: true,
			stx_xaxis: true,
			stx_yaxis: true,
			stx_yaxis_dark: true,
			stx_grid_border: true
		},
		stx_mountain_chart: { stx_mountain_chart: true },
		stx_market_session: { stx_market_session: true }
	};

	stx.chart.container.style.backgroundColor = this.settings.chart.Background.color;
	stx.defaultColor = ""; // to be set later, elsewhere

	function setStyle(style, field, value) {
		var styles = classMapping[style];
		for (var s in styles) {
			stx.setStyle(s, field, value);
		}
	}

	setStyle("stx_grid", "color", this.settings.chart["Grid Lines"].color);
	setStyle(
		"stx_grid_dark",
		"color",
		this.settings.chart["Grid Dividers"].color
	);
	setStyle("stx_xaxis", "color", this.settings.chart["Axis Text"].color);

	var candleBar = this.settings.chartTypes["Candle/Bar"];
	// backwards compatibility with pre-5.0.3 saved themes
	if (!candleBar.even) {
		candleBar.even = {
			color: null,
			wick: CIQ.hexToRgba(stx.canvasStyle("stx_candle_shadow_even").color),
			border: null
		};
	}
	setStyle("stx_candle_up", "color", candleBar.up.color);
	setStyle("stx_candle_down", "color", candleBar.down.color);
	setStyle("stx_candle_even", "color", candleBar.even.color);
	setStyle("stx_shadow_up", "color", candleBar.up.wick);
	setStyle("stx_shadow_down", "color", candleBar.down.wick);
	setStyle("stx_shadow_even", "color", candleBar.even.wick);

	// Only apply borders to candle, not the other types
	stx.setStyle("stx_candle_up", "borderLeftColor", candleBar.up.border);
	stx.setStyle("stx_candle_down", "borderLeftColor", candleBar.down.border);

	setStyle("stx_line_chart", "color", this.settings.chartTypes.Line.color);

	stx.setStyle(
		"stx_mountain_chart",
		"borderTopColor",
		CIQ.hexToRgba(this.settings.chartTypes.Mountain.color, 1)
	);
	stx.setStyle(
		"stx_mountain_chart",
		"backgroundColor",
		CIQ.hexToRgba(this.settings.chartTypes.Mountain.color, 0.5)
	);
	stx.setStyle(
		"stx_mountain_chart",
		"color",
		CIQ.hexToRgba(this.settings.chartTypes.Mountain.basecolor, 0.01)
	);
	stx.draw();
};

/**
 * Convenience method to programmatically set a theme of the chart.
 *
 * Note that you should set any css classes on the chart context before calling this method
 *
 * @param  {object} [settings] A {@link CIQ.ThemeHelper#settings} object, or null to reset to default settings
 * @example
 * document.querySelector("cq-context").classList.add("ciq-night");
 * stxx.setThemeSettings();  // reset to night theme
 * var settings=CIQ.clone(CIQ.ThemeHelper.prototype.settings);   // default night theme settings
 * settings.chart.Background.color="red";   // customize by changing background color
 * stxx.setThemeSettings(settings);  // execute custom setting
 *
 * @memberof CIQ.ChartEngine
 * @since 6.3.0
 */
CIQ.ChartEngine.prototype.setThemeSettings = function (settings) {
	this.styles = {};
	this.chart.container.style.backgroundColor = "";
	this.defaultColor = "";
	if (settings) {
		var helper = new CIQ.ThemeHelper({ stx: this });
		helper.settings = settings;
		helper.update();
	}
	this.updateListeners("theme");
	this.changeOccurred("theme");
	if (this.displayInitialized) {
		this.headsUpHR();
		this.clearPixelCache();
		this.updateListeners("theme"); // Not sure if this is necessary, but leaving here just in case.
		this.draw();
	}
};

};

let __js_standard_timezone_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
var timezoneJS =
	typeof _timezoneJS !== "undefined" ? _timezoneJS : _exports.timezoneJS;

/**
 * The comprehensive list of timezones can be overwhelming. This is a reduced list that provides
 * what is necessary for the [sample UI]{@link WebComponents.cq-theme-dialog}.
 *
 * To see the current list and format, open your browser console and type `CIQ.timeZoneMap`.
 *
 * There are more timezones loaded in the the chart by default. You can get a list by running `timezoneJS.timezone.getAllZones();` from your browser console.
 * Feel free to add what you need to this map if you want users to use them.
 *
 * If you need to support other timezones, not currently loaded, a complete list can be downloaded from [here](http://download.chartiq.com/timeZones/timezoneDataObject.txt).
 *
 * This file is large, so add timezones with discretion.<br>
 * Although we do update this file periodically ,it may not be available immediately after every timezone change.
 * As such, if you require immediate updates, you should subscribe to a notification system that alerts you of these changes, and then adjust the file as needed.
 * www.iana.org/time-zones is a good source.
 *
 * The following code snippet demonstrates how to do this. (You can also just add synonyms this way as well).
 * In order to save space, you may want to cherry pick the zones that you will need, and then add them in your initialization code.
 * ```
 *	var myAdditionalZones = {
 *	 "zones" : {
 *	  "America/Toronto": [
 *	   [ 300, "Canada", "E%sT", null ]
 *	  ]
 *	 },
 *	 "rules" : {
 *	  "Canada" : [
 *	   [ 2007, "max", "-", "Mar", "Sun>=8", [ 2, 0, 0, null ], 60, "D" ],
 *	   [ 2007, "max", "-", "Nov", "Sun>=1", [ 2, 0, 0, null ], 0, "S" ] ]
 *	 }
 *	}
 *
 * // to add all timezones "zones" and "rules" you can simply load the entire timeZoneDataObject.txt file.
 *	if(timezoneJS) timezoneJS.timezone.loadZoneDataFromObject(myAdditionalZones);
 *  ```
 * Lastly, if you want users to be able to use the new timezones from the menus, be sure to also add the title for them to the `CIQ.timeZoneMap` object to keep the list and the settings in sync:
 *  ```
 *  CIQ.timeZoneMap["(UTC-05:00) Toronto"]="America/Toronto";
 *  ```
 *
 * See {@link CIQ.ChartEngine#setTimeZone} for further instructions on how to set the different timezones on the chart.
 *
 * @type {object}
 * @memberof CIQ
 */
CIQ.timeZoneMap = {
	"(UTC-11:00) American Samoa, Midway Island": "Pacific/Pago_Pago",
	"(UTC-10:00) Hawaii": "Pacific/Honolulu",
	"(UTC-09:00) Alaska": "America/Juneau",
	"(UTC-08:00) Pacific Time (US and Canada), Tijuana": "America/Los_Angeles",
	"(UTC-07:00) Arizona": "America/Phoenix",
	"(UTC-07:00) Chihuahua, Mazatlan": "America/Chihuahua",
	"(UTC-07:00) Mountain Time (US and Canada)": "America/Denver",
	"(UTC-06:00) Central America": "America/Costa_Rica",
	"(UTC-06:00) Central Time (US and Canada)": "America/Chicago",
	"(UTC-06:00) Guadalajara, Mexico City, Monterrey": "America/Mexico_City",
	"(UTC-06:00) Saskatchewan": "America/Regina",
	"(UTC-05:00) Bogota, Lima, Quito, Rio Branco": "America/Bogota",
	"(UTC-05:00) Eastern Time (US and Canada)": "America/New_York",
	"(UTC-05:00) Havana": "America/Havana",
	"(UTC-05:00) Port-au-Prince": "America/Port-au-Prince",
	"(UTC-04:00) Asuncion": "America/Asuncion",
	"(UTC-04:00) Santiago": "America/Santiago",
	"(UTC-04:00) Caracas": "America/Caracas",
	"(UTC-04:00) Atlantic Time (Canada)": "America/Halifax",
	"(UTC-04:00) Georgetown, La Paz, Manaus, San Juan": "America/Puerto_Rico",
	"(UTC-03:30) Newfoundland and Labrador": "America/St_Johns",
	"(UTC-03:00) Cancun, Jamaica, Panama": "America/Panama",
	"(UTC-03:00) Buenos Aires": "America/Argentina/Buenos_Aires",
	"(UTC-03:00) Punta Arenas": "America/Punta_Arenas",
	"(UTC-03:00) Montevideo": "America/Montevideo",
	"(UTC-03:00) Sao Paulo": "America/Sao_Paulo",
	"(UTC-02:00) Mid-Atlantic": "Atlantic/South_Georgia",
	"(UTC-01:00) Azores": "Atlantic/Azores",
	"(UTC-01:00) Cape Verde Islands": "Atlantic/Cape_Verde",
	"(UTC) Greenwich Mean Time, Reykjavik": "UTC",
	"(UTC) Dublin": "Europe/Dublin",
	"(UTC) Lisbon, London": "Europe/London",
	"(UTC+01:00) Algiers, Tunis": "Africa/Tunis",
	"(UTC+01:00) Casablanca": "Africa/Casablanca",
	"(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna":
		"Europe/Amsterdam",
	"(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague":
		"Europe/Belgrade",
	"(UTC+01:00) Brussels, Copenhagen, Madrid, Paris": "Europe/Brussels",
	"(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb": "Europe/Sarajevo",
	"(UTC+02:00) Kaliningrad": "Europe/Kaliningrad",
	"(UTC+02:00) Athens, Bucharest": "Europe/Bucharest",
	"(UTC+02:00) Cairo": "Africa/Cairo",
	"(UTC+02:00) Harare, Johannesburg": "Africa/Johannesburg",
	"(UTC+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius":
		"Europe/Helsinki",
	"(UTC+02:00) Cyprus": "Asia/Nicosia",
	"(UTC+02:00) Beirut": "Asia/Beirut",
	"(UTC+02:00) Damascus": "Asia/Damascus",
	"(UTC+02:00) Jerusalem": "Asia/Jerusalem",
	"(UTC+02:00) Amman": "Asia/Amman",
	"(UTC+03:00) Istanbul": "Europe/Istanbul",
	"(UTC+03:00) Baghdad, Kuwait, Qatar, Riyadh": "Asia/Riyadh",
	"(UTC+03:00) Minsk, Moscow, Kirov, Volgograd": "Europe/Moscow",
	"(UTC+03:00) Simferopol": "Europe/Simferopol",
	"(UTC+03:00) Nairobi": "Africa/Nairobi",
	"(UTC+03:30) Tehran": "Asia/Tehran",
	"(UTC+04:00) Baku": "Asia/Baku",
	"(UTC+04:00) Dubai, Muscat": "Asia/Dubai",
	"(UTC+04:00) Astrakhan, Samara, Saratov, Ulyanovsk": "Europe/Samara",
	"(UTC+04:30) Kabul": "Asia/Kabul",
	"(UTC+05:00) Karachi, Tashkent": "Asia/Karachi",
	"(UTC+05:00) Yekaterinburg": "Asia/Yekaterinburg",
	"(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi": "Asia/Kolkata",
	"(UTC+05:45) Kathmandu": "Asia/Kathmandu",
	"(UTC+06:00) Almaty": "Asia/Almaty",
	"(UTC+06:00) Omsk": "Asia/Omsk",
	"(UTC+06:00) Astana, Dhaka": "Asia/Dhaka",
	"(UTC+06:30) Yangon": "Asia/Yangon",
	"(UTC+07:00) Bangkok, Jakarta, Vietnam": "Asia/Bangkok",
	"(UTC+07:00) Hovd": "Asia/Hovd",
	"(UTC+07:00) Krasnoyarsk": "Asia/Krasnoyarsk",
	"(UTC+07:00) Novokuznetsk": "Asia/Novokuznetsk",
	"(UTC+07:00) Barnaul, Novosibirsk, Tomsk": "Asia/Novosibirsk",
	"(UTC+08:00) Beijing, Chongqing, Hong Kong SAR": "Asia/Hong_Kong",
	"(UTC+08:00) Brunei, Kuala Lumpur, Singapore": "Asia/Kuala_Lumpur",
	"(UTC+08:00) Irkutsk": "Asia/Irkutsk",
	"(UTC+08:00) Choibalsan, Ulaanbaatar": "Asia/Ulaanbaatar",
	"(UTC+08:00) Manila, Taipei": "Asia/Taipei",
	"(UTC+08:00) Perth": "Australia/Perth",
	"(UTC+08:45) Eucla": "Australia/Eucla",
	"(UTC+09:00) Osaka, Sapporo, Tokyo": "Asia/Tokyo",
	"(UTC+09:00) Pyongyang": "Asia/Pyongyang",
	"(UTC+09:00) Seoul": "Asia/Seoul",
	"(UTC+09:00) Chita, Khandyga, Yakutsk": "Asia/Yakutsk",
	"(UTC+09:30) Adelaide": "Australia/Adelaide",
	"(UTC+09:30) Darwin": "Australia/Darwin",
	"(UTC+10:00) Brisbane": "Australia/Brisbane",
	"(UTC+10:00) Canberra, Melbourne, Sydney": "Australia/Sydney",
	"(UTC+10:00) Guam, Port Moresby": "Pacific/Guam",
	"(UTC+10:00) Ust-Nera, Vladivostok": "Asia/Vladivostok",
	"(UTC+11:00) Noumea, Solomon Islands": "Pacific/Noumea",
	"(UTC+11:00) Magadan": "Asia/Magadan",
	"(UTC+11:00) Sakhalin, Srednekolymsk": "Asia/Srednekolymsk",
	"(UTC+12:00) Anadyr, Kamchatka": "Asia/Kamchatka",
	"(UTC+12:00) Auckland, Wellington": "Pacific/Auckland",
	"(UTC+12:00) Fiji": "Pacific/Fiji",
	"(UTC+12:45) Chatham": "Pacific/Chatham",
	"(UTC+13:00) Tonga": "Pacific/Tongatapu",
	"(UTC+13:00) Samoa": "Pacific/Apia",
	"(UTC+14:00) Kiritimati": "Pacific/Kiritimati"
};

// -----
// The `timezoneJS.Date` object gives you full-blown timezone support, independent from the timezone set on the end-user's machine running the browser. It uses the Olson zoneinfo files for its timezone data.
//
// The constructor function and setter methods use proxy JavaScript Date objects behind the scenes, so you can use strings like '10/22/2006' with the constructor. You also get the same sensible wraparound behavior with numeric parameters (like setting a value of 14 for the month wraps around to the next March).
//
// The other significant difference from the built-in JavaScript Date is that `timezoneJS.Date` also has named properties that store the values of year, month, date, etc., so it can be directly serialized to JSON and used for data transfer.

/*!
 * Copyright 2010 Matthew Eernisse (mde@fleegix.org)
 * and Open Source Applications Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Credits: Ideas included from incomplete JS implementation of Olson
 * parser, 'XMLDAte' by Philippe Goetz (philippe.goetz@wanadoo.fr)
 *
 * Contributions:
 * Jan Niehusmann
 * Ricky Romero
 * Preston Hunt (prestonhunt@gmail.com)
 * Dov. B Katz (dov.katz@morganstanley.com)
 * Peter Bergström (pbergstr@mac.com)
 * Long Ho
 *
 * Modified from original by ChartIQ to include caching for improved performance
 */

/*jshint laxcomma:true, laxbreak:true, expr:true, supernew:true*/
(function () {
	// Standard initialization stuff to make sure the library is
	// usable on both client and server (node) side.
	"use strict";
	var _window = typeof window !== "undefined" ? window : null;
	var root = _window || (typeof global !== "undefined" ? global : {});

	timezoneJS.VERSION = "0.4.11";

	// Grab the ajax library from global context.
	// This can be jQuery, Zepto or fleegix.
	// You can also specify your own transport mechanism by declaring
	// `timezoneJS.timezone.transport` to a `function`. More details will follow
	var ajax_lib = root.$ || root.jQuery || root.Zepto,
		fleegix = root.fleegix,
		// Declare constant list of days and months. Unfortunately this doesn't leave room for i18n due to the Olson data being in English itself
		DAYS = (timezoneJS.Days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		]),
		MONTHS = (timezoneJS.Months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]),
		SHORT_MONTHS = {},
		SHORT_DAYS = {},
		EXACT_DATE_TIME = {};

	//`{ 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 }`
	for (var i = 0; i < MONTHS.length; i++) {
		SHORT_MONTHS[MONTHS[i].substr(0, 3)] = i;
	}

	//`{ 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 }`
	for (i = 0; i < DAYS.length; i++) {
		SHORT_DAYS[DAYS[i].substr(0, 3)] = i;
	}

	//Handle array indexOf in IE
	//From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
	//Extending Array prototype causes IE to iterate thru extra element
	var _arrIndexOf =
		Array.prototype.indexOf ||
		function (el) {
			if (this === null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) {
					// shortcut for verifying if it's NaN
					n = 0;
				} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === el) {
					return k;
				}
			}
			return -1;
		};

	// Format a number to the length = digits. For ex:
	//
	// `_fixWidth(2, 2) = '02'`
	//
	// `_fixWidth(1998, 2) = '98'`  // year, shorten it to the 2 digit representation
	//
	// `_fixWidth(23, 1) = '23'`  // hour, even with 1 digit specified, do not trim
	//
	// This is used to pad numbers in converting date to string in ISO standard.
	var _fixWidth = function (number, digits) {
		if (typeof number !== "number") {
			throw "not a number: " + number;
		}
		var trim = number > 1000; // only trim 'year', as the others don't make sense why anyone would want that
		var s = number.toString();
		var s_len = s.length;
		if (trim && s_len > digits) {
			return s.substr(s_len - digits, s_len);
		}
		s = [s];
		while (s_len < digits) {
			s.unshift("0");
			s_len++;
		}
		return s.join("");
	};

	// Abstraction layer for different transport layers, including fleegix/jQuery/Zepto/Node.js
	//
	// Object `opts` include
	//
	// - `url`: url to ajax query
	//
	// - `async`: true for asynchronous, false otherwise. If false, return value will be response from URL. This is true by default
	//
	// - `success`: success callback function
	//
	// - `error`: error callback function
	// Returns response from URL if async is false, otherwise the AJAX request object itself
	var _transport = function (opts) {
		if (!opts) return;
		if (!opts.url) throw new Error("URL must be specified");
		if (!("async" in opts)) opts.async = true;
		// Client-side
		if (
			(!fleegix || typeof fleegix.xhr === "undefined") &&
			(!ajax_lib || typeof ajax_lib.ajax === "undefined")
		) {
			throw new Error(
				"Please use the Fleegix.js XHR module, jQuery ajax, Zepto ajax, or define your own transport mechanism for downloading zone files."
			);
		}
		if (!opts.async) {
			return fleegix && fleegix.xhr
				? fleegix.xhr.doReq({ url: opts.url, async: false })
				: ajax_lib.ajax({ url: opts.url, async: false, dataType: "text" })
						.responseText;
		}
		return fleegix && fleegix.xhr
			? fleegix.xhr.send({
					url: opts.url,
					method: "get",
					handleSuccess: opts.success,
					handleErr: opts.error
			  })
			: ajax_lib.ajax({
					url: opts.url,
					dataType: "text",
					method: "GET",
					error: opts.error,
					success: opts.success
			  });
	};

	timezoneJS.ruleCache = {};

	// Constructor, which is similar to that of the native Date object itself
	timezoneJS.Date = function () {
		if (this === timezoneJS) {
			throw "timezoneJS.Date object must be constructed with 'new'";
		}
		var args = Array.prototype.slice.apply(arguments),
			dt = null,
			tz = null,
			arr = [],
			valid = false;
		//We support several different constructors, including all the ones from `Date` object
		// with a timezone string at the end.
		//
		//- `[tz]`: Returns object with time in `tz` specified.
		//
		// - `utcMillis`, `[tz]`: Return object with UTC time = `utcMillis`, in `tz`.
		//
		// - `Date`, `[tz]`: Returns object with UTC time = `Date.getTime()`, in `tz`.
		//
		// - `year, month, [date,] [hours,] [minutes,] [seconds,] [millis,] [tz]: Same as `Date` object
		// with tz.
		//
		// - `Array`: Can be any combo of the above.
		//
		//If 1st argument is an array, we can use it as a list of arguments itself
		if (Object.prototype.toString.call(args[0]) === "[object Array]") {
			args = args[0];
		}
		// If the last string argument doesn't parse as a Date, treat it as tz
		if (typeof args[args.length - 1] === "string") {
			valid = Date.parse(args[args.length - 1].replace(/GMT[+-]\d+/, ""));
			if (isNaN(valid) || valid === null) {
				// Checking against null is required for compatability with Datejs
				tz = args.pop();
			}
		}
		// Old code: still need it?
		//if (typeof args[args.length - 1] === 'string' /*&& isNaN(Date.parse(args[args.length - 1].replace(/GMT\+\d+/, '')))*/) { // This was causing any timezone with GMT to stop working as in "Etc/GMT-7"
		//  tz = args.pop();
		//}
		var is_dt_local = false;
		switch (args.length) {
			case 0:
				dt = new Date();
				break;
			case 1:
				dt = new Date(args[0]);
				// Date strings are local if they do not contain 'Z', 'T' or timezone offsets like '+0200'
				//  - more info below
				if (
					typeof args[0] == "string" &&
					args[0].search(/[+-][0-9]{4}/) == -1 &&
					args[0].search(/Z/) == -1 &&
					args[0].search(/T/) == -1
				) {
					is_dt_local = true;
				}
				break;
			case 2:
				dt = new Date(args[0], args[1]);
				is_dt_local = true;
				break;
			default:
				for (var i = 0; i < 7; i++) {
					arr[i] = args[i] || 0;
				}
				dt = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
				is_dt_local = true;
				break;
		}

		if (isNaN(dt.getTime())) {
			// invalid date were passed
			throw new Error("Invalid date");
		}

		this._useCache = false;
		this._tzInfo = {};
		this._day = 0;
		this.year = 0;
		this.month = 0;
		this.date = 0;
		this.hours = 0;
		this.minutes = 0;
		this.seconds = 0;
		this.milliseconds = 0;
		this.timezone = tz || null;
		// Tricky part:
		// The date is either given as unambiguous UTC date or otherwise the date is assumed
		// to be a date in timezone `tz` or a locale date if `tz` is not provided. Thus, to
		// determine how to use `dt` we distinguish between the following cases:
		//  - UTC   (is_dt_local = false)
		//    `timezoneJS.Date(millis, [tz])`
		//    `timezoneJS.Date(Date, [tz])`
		//    `timezoneJS.Date(dt_str_tz, [tz])`
		//  - local/timezone `tz`   (is_dt_local = true)
		//    `timezoneJS.Date(year, mon, day, [hour], [min], [second], [tz])`
		//    `timezoneJS.Date(dt_str, [tz])`
		//
		// `dt_str_tz` is a date string containing timezone information, i.e. containing 'Z', 'T' or
		// /[+-][0-9]{4}/ (e.g. '+0200'), while `dt_str` is a string which does not contain
		// timezone information. See: http://dygraphs.com/date-formats.html
		if (is_dt_local) {
			this.setFromDateObjProxy(dt);
		} else {
			this.setFromTimeProxy(dt.getTime(), tz);
		}
	};

	// Implements most of the native Date object
	CIQ.extend(
		timezoneJS.Date.prototype,
		{
			getDate: function () {
				return this.date;
			},
			getDay: function () {
				return this._day;
			},
			getFullYear: function () {
				return this.year;
			},
			getMonth: function () {
				return this.month;
			},
			getYear: function () {
				return this.year - 1900;
			},
			getHours: function () {
				return this.hours;
			},
			getMilliseconds: function () {
				return this.milliseconds;
			},
			getMinutes: function () {
				return this.minutes;
			},
			getSeconds: function () {
				return this.seconds;
			},
			getUTCDate: function () {
				return this.getUTCDateProxy().getUTCDate();
			},
			getUTCDay: function () {
				return this.getUTCDateProxy().getUTCDay();
			},
			getUTCFullYear: function () {
				return this.getUTCDateProxy().getUTCFullYear();
			},
			getUTCHours: function () {
				return this.getUTCDateProxy().getUTCHours();
			},
			getUTCMilliseconds: function () {
				return this.getUTCDateProxy().getUTCMilliseconds();
			},
			getUTCMinutes: function () {
				return this.getUTCDateProxy().getUTCMinutes();
			},
			getUTCMonth: function () {
				return this.getUTCDateProxy().getUTCMonth();
			},
			getUTCSeconds: function () {
				return this.getUTCDateProxy().getUTCSeconds();
			},
			// Time adjusted to user-specified timezone
			getTime: function () {
				return this._timeProxy + this.getTimezoneOffset() * 60 * 1000;
			},
			getTimezone: function () {
				return this.timezone;
			},
			getTimezoneOffset: function () {
				return this.getTimezoneInfo().tzOffset;
			},
			getTimezoneAbbreviation: function () {
				return this.getTimezoneInfo().tzAbbr;
			},
			getTimezoneInfo: function () {
				if (this._useCache) return this._tzInfo;
				var res;
				// If timezone is specified, get the correct timezone info based on the Date given
				if (this.timezone) {
					res =
						this.timezone === "Etc/UTC" || this.timezone === "Etc/GMT"
							? { tzOffset: 0, tzAbbr: "UTC" }
							: timezoneJS.timezone.getTzInfo(this._timeProxy, this.timezone);
				}
				// If no timezone was specified, use the local browser offset
				else {
					res = { tzOffset: this.getLocalOffset(), tzAbbr: null };
				}
				this._tzInfo = res;
				this._useCache = true;
				return res;
			},
			getUTCDateProxy: function () {
				var dt = new Date(this._timeProxy);
				dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
				return dt;
			},
			setDate: function (date) {
				this.setAttribute("date", date);
				return this.getTime();
			},
			setFullYear: function (year, month, date) {
				if (date !== undefined) {
					this.setAttribute("date", 1);
				}
				this.setAttribute("year", year);
				if (month !== undefined) {
					this.setAttribute("month", month);
				}
				if (date !== undefined) {
					this.setAttribute("date", date);
				}
				return this.getTime();
			},
			setMonth: function (month, date) {
				this.setAttribute("month", month);
				if (date !== undefined) {
					this.setAttribute("date", date);
				}
				return this.getTime();
			},
			setYear: function (year) {
				year = Number(year);
				if (0 <= year && year <= 99) {
					year += 1900;
				}
				this.setUTCAttribute("year", year);
				return this.getTime();
			},
			setHours: function (hours, minutes, seconds, milliseconds) {
				this.setAttribute("hours", hours);
				if (minutes !== undefined) {
					this.setAttribute("minutes", minutes);
				}
				if (seconds !== undefined) {
					this.setAttribute("seconds", seconds);
				}
				if (milliseconds !== undefined) {
					this.setAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setMinutes: function (minutes, seconds, milliseconds) {
				this.setAttribute("minutes", minutes);
				if (seconds !== undefined) {
					this.setAttribute("seconds", seconds);
				}
				if (milliseconds !== undefined) {
					this.setAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setSeconds: function (seconds, milliseconds) {
				this.setAttribute("seconds", seconds);
				if (milliseconds !== undefined) {
					this.setAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setMilliseconds: function (milliseconds) {
				this.setAttribute("milliseconds", milliseconds);
				return this.getTime();
			},
			setTime: function (n) {
				if (isNaN(n)) {
					throw new Error("Units must be a number.");
				}
				this.setFromTimeProxy(n, this.timezone);
				return this.getTime();
			},
			setUTCFullYear: function (year, month, date) {
				if (date !== undefined) {
					this.setUTCAttribute("date", 1);
				}
				this.setUTCAttribute("year", year);
				if (month !== undefined) {
					this.setUTCAttribute("month", month);
				}
				if (date !== undefined) {
					this.setUTCAttribute("date", date);
				}
				return this.getTime();
			},
			setUTCMonth: function (month, date) {
				this.setUTCAttribute("month", month);
				if (date !== undefined) {
					this.setUTCAttribute("date", date);
				}
				return this.getTime();
			},
			setUTCDate: function (date) {
				this.setUTCAttribute("date", date);
				return this.getTime();
			},
			setUTCHours: function (hours, minutes, seconds, milliseconds) {
				this.setUTCAttribute("hours", hours);
				if (minutes !== undefined) {
					this.setUTCAttribute("minutes", minutes);
				}
				if (seconds !== undefined) {
					this.setUTCAttribute("seconds", seconds);
				}
				if (milliseconds !== undefined) {
					this.setUTCAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setUTCMinutes: function (minutes, seconds, milliseconds) {
				this.setUTCAttribute("minutes", minutes);
				if (seconds !== undefined) {
					this.setUTCAttribute("seconds", seconds);
				}
				if (milliseconds !== undefined) {
					this.setUTCAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setUTCSeconds: function (seconds, milliseconds) {
				this.setUTCAttribute("seconds", seconds);
				if (milliseconds !== undefined) {
					this.setUTCAttribute("milliseconds", milliseconds);
				}
				return this.getTime();
			},
			setUTCMilliseconds: function (milliseconds) {
				this.setUTCAttribute("milliseconds", milliseconds);
				return this.getTime();
			},
			setFromDateObjProxy: function (dt) {
				this.year = dt.getFullYear();
				this.month = dt.getMonth();
				this.date = dt.getDate();
				this.hours = dt.getHours();
				this.minutes = dt.getMinutes();
				this.seconds = dt.getSeconds();
				this.milliseconds = dt.getMilliseconds();
				this._day = dt.getDay();
				this._dateProxy = dt;
				this._timeProxy = Date.UTC(
					this.year,
					this.month,
					this.date,
					this.hours,
					this.minutes,
					this.seconds,
					this.milliseconds
				);
				this._useCache = false;
			},
			setFromTimeProxy: function (utcMillis, tz) {
				var dt = new Date(utcMillis);
				var tzOffset = tz
					? timezoneJS.timezone.getTzInfo(utcMillis, tz, true).tzOffset
					: dt.getTimezoneOffset();
				dt.setTime(utcMillis + (dt.getTimezoneOffset() - tzOffset) * 60000);
				this.setFromDateObjProxy(dt);
			},
			setAttribute: function (unit, n) {
				if (isNaN(n)) {
					throw new Error("Units must be a number.");
				}
				var dt = this._dateProxy;
				var meth =
					unit === "year"
						? "FullYear"
						: unit.substr(0, 1).toUpperCase() + unit.substr(1);
				dt["set" + meth](n);
				this.setFromDateObjProxy(dt);
			},
			setUTCAttribute: function (unit, n) {
				if (isNaN(n)) {
					throw new Error("Units must be a number.");
				}
				var meth =
					unit === "year"
						? "FullYear"
						: unit.substr(0, 1).toUpperCase() + unit.substr(1);
				var dt = this.getUTCDateProxy();
				dt["setUTC" + meth](n);
				dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
				this.setFromTimeProxy(
					dt.getTime() + this.getTimezoneOffset() * 60000,
					this.timezone
				);
			},
			setTimezone: function (tz) {
				var previousOffset = this.getTimezoneInfo().tzOffset;
				this.timezone = tz;
				this._useCache = false;
				// Set UTC minutes offsets by the delta of the two timezones
				this.setUTCMinutes(
					this.getUTCMinutes() -
						this.getTimezoneInfo().tzOffset +
						previousOffset
				);
			},
			removeTimezone: function () {
				this.timezone = null;
				this._useCache = false;
			},
			valueOf: function () {
				return this.getTime();
			},
			clone: function () {
				return this.timezone
					? new timezoneJS.Date(this.getTime(), this.timezone)
					: new timezoneJS.Date(this.getTime());
			},
			toGMTString: function () {
				return this.toString("EEE, dd MMM yyyy HH:mm:ss Z", "Etc/GMT");
			},
			toLocaleStringIntl: function () {},
			toLocaleDateString: function () {},
			toLocaleTimeString: function () {},
			toSource: function () {},
			toISOString: function () {
				return this.toString("yyyy-MM-ddTHH:mm:ss.SSS", "Etc/UTC") + "Z";
			},
			toJSON: function () {
				return this.toISOString();
			},
			toDateString: function () {
				return this.toString("EEE MMM dd yyyy");
			},
			toTimeString: function () {
				return this.toString("H:mm k");
			},
			// Allows different format following ISO8601 format:
			toString: function (format, tz) {
				// Default format is the same as toISOString
				if (!format) format = "yyyy-MM-ddTHH:mm:ss.SSS";
				var result = format;
				var tzInfo = tz
					? timezoneJS.timezone.getTzInfo(this.getTime(), tz)
					: this.getTimezoneInfo();
				var _this = this;
				// If timezone is specified, get a clone of the current Date object and modify it
				if (tz) {
					_this = this.clone();
					_this.setTimezone(tz);
				}
				var hours = _this.getHours();
				return (
					result
						// fix the same characters in Month names
						.replace(/a+/g, function () {
							return "k";
						})
						// `y`: year
						.replace(/y+/g, function (token) {
							return _fixWidth(_this.getFullYear(), token.length);
						})
						// `d`: date
						.replace(/d+/g, function (token) {
							return _fixWidth(_this.getDate(), token.length);
						})
						// `m`: minute
						.replace(/m+/g, function (token) {
							return _fixWidth(_this.getMinutes(), token.length);
						})
						// `s`: second
						.replace(/s+/g, function (token) {
							return _fixWidth(_this.getSeconds(), token.length);
						})
						// `S`: millisecond
						.replace(/S+/g, function (token) {
							return _fixWidth(_this.getMilliseconds(), token.length);
						})
						// 'h': 12 hour format
						.replace(/h+/g, function (token) {
							return _fixWidth(
								hours % 12 === 0 ? 12 : hours % 12,
								token.length
							);
						})
						// `M`: month. Note: `MM` will be the numeric representation (e.g February is 02) but `MMM` will be text representation (e.g February is Feb)
						.replace(/M+/g, function (token) {
							var _month = _this.getMonth(),
								_len = token.length;
							if (_len > 3) {
								return timezoneJS.Months[_month];
							} else if (_len > 2) {
								return timezoneJS.Months[_month].substring(0, _len);
							}
							return _fixWidth(_month + 1, _len);
						})
						// `k`: AM/PM
						.replace(/k+/g, function () {
							if (hours >= 12) {
								if (hours > 12) {
									hours -= 12;
								}
								return "PM";
							}
							return "AM";
						})
						// `H`: hour
						.replace(/H+/g, function (token) {
							return _fixWidth(hours, token.length);
						})
						// `E`: day
						.replace(/E+/g, function (token) {
							return DAYS[_this.getDay()].substring(0, token.length);
						})
						// `Z`: timezone abbreviation
						.replace(/Z+/gi, function () {
							return tzInfo.tzAbbr;
						})
				);
			},
			toUTCString: function () {
				return this.toGMTString();
			},
			civilToJulianDayNumber: function (y, m, d) {
				var a;
				// Adjust for zero-based JS-style array
				m++;
				if (m > 12) {
					a = parseInt(m / 12, 10);
					m = m % 12;
					y += a;
				}
				if (m <= 2) {
					y -= 1;
					m += 12;
				}
				a = Math.floor(y / 100);
				var b = 2 - a + Math.floor(a / 4),
					jDt =
						Math.floor(365.25 * (y + 4716)) +
						Math.floor(30.6001 * (m + 1)) +
						d +
						b -
						1524;
				return jDt;
			},
			getLocalOffset: function () {
				return this._dateProxy.getTimezoneOffset();
			}
		},
		true
	);

	timezoneJS.timezone = new (function () {
		var _this = this,
			regionMap = {
				Etc: "etcetera",
				EST: "northamerica",
				MST: "northamerica",
				HST: "northamerica",
				EST5EDT: "northamerica",
				CST6CDT: "northamerica",
				MST7MDT: "northamerica",
				PST8PDT: "northamerica",
				America: ["northamerica", "southamerica"],
				Pacific: "australasia",
				Atlantic: "europe",
				Africa: "africa",
				Indian: "africa",
				Antarctica: "antarctica",
				Asia: "asia",
				Australia: "australasia",
				Europe: "europe",
				WET: "europe",
				CET: "europe",
				MET: "europe",
				EET: "europe"
			},
			regionExceptions = {
				"Pacific/Honolulu": "northamerica",
				"Atlantic/Bermuda": "northamerica",
				"Atlantic/Cape_Verde": "africa",
				"Atlantic/St_Helena": "africa",
				"Indian/Kerguelen": "antarctica",
				"Indian/Chagos": "asia",
				"Indian/Maldives": "asia",
				"Indian/Christmas": "australasia",
				"Indian/Cocos": "australasia",
				"America/Danmarkshavn": "europe",
				"America/Scoresbysund": "europe",
				"America/Godthab": "europe",
				"America/Thule": "europe",
				"Asia/Istanbul": "europe",
				"Asia/Yekaterinburg": "europe",
				"Asia/Omsk": "europe",
				"Asia/Novosibirsk": "europe",
				"Asia/Krasnoyarsk": "europe",
				"Asia/Irkutsk": "europe",
				"Asia/Yakutsk": "europe",
				"Asia/Vladivostok": "europe",
				"Asia/Sakhalin": "europe",
				"Asia/Magadan": "europe",
				"Asia/Kamchatka": "europe",
				"Asia/Anadyr": "europe",
				"Africa/Ceuta": "europe",
				GMT: "etcetera",
				"Europe/Nicosia": "asia"
			};
		function invalidTZError(t) {
			throw new Error(
				"Timezone '" +
					t +
					"' is either incorrect, or not loaded in the timezone registry."
			);
		}
		function builtInLoadZoneFile(fileName, opts) {
			var url = _this.zoneFileBasePath + "/" + fileName;
			return !opts || !opts.async
				? _this.parseZones(_this.transport({ url: url, async: false }))
				: _this.transport({
						async: true,
						url: url,
						success: function (str) {
							return (
								_this.parseZones(str) &&
								typeof opts.callback === "function" &&
								opts.callback()
							);
						},
						error: function () {
							throw new Error("Error retrieving '" + url + "' zoneinfo files");
						}
				  });
		}
		function getRegionForTimezone(tz) {
			var exc = regionExceptions[tz],
				reg,
				ret;
			if (exc) return exc;
			reg = tz.split("/")[0];
			ret = regionMap[reg];
			// If there's nothing listed in the main regions for this TZ, check the 'backward' links
			if (ret) return ret;
			var link = _this.zones[tz];
			if (typeof link === "string") {
				return getRegionForTimezone(link);
			}
			// Backward-compat file hasn't loaded yet, try looking in there
			if (!_this.loadedZones.backward) {
				// This is for obvious legacy zones (e.g., Iceland) that don't even have a prefix like 'America/' that look like normal zones
				_this.loadZoneFile("backward");
				return getRegionForTimezone(tz);
			}
			invalidTZError(tz);
		}
		//str has format hh:mm, can be negative
		function parseTimeString(str) {
			var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
			var hms = str.match(pat);
			hms[1] = parseInt(hms[1], 10);
			hms[2] = hms[2] ? parseInt(hms[2], 10) : 0;
			hms[3] = hms[3] ? parseInt(hms[3], 10) : 0;
			return hms.slice(1, 5);
		}
		//z is something like `[ '-3:44:40', '-', 'LMT', '1911', 'May', '15', '' ]` or `[ '-5:00', '-', 'EST', '1974', 'Apr', '28', '2:00' ]`
		function processZone(z) {
			if (!z[3]) {
				return;
			}
			var yea = parseInt(z[3], 10),
				mon = 11,
				dat = 31;
			//If month is there
			if (z[4]) {
				mon = SHORT_MONTHS[z[4].substr(0, 3)];
				dat = parseInt(z[5], 10) || 1;
			}
			var t = z[6] ? parseTimeString(z[6]) : [0, 0, 0];
			return [yea, mon, dat, t[0], t[1], t[2]];
		}
		function getZone(dt, tz) {
			var utcMillis = typeof dt === "number" ? dt : new Date(+dt).getTime();
			var t = tz;
			var zoneList = _this.zones[t];
			// Follow links to get to an actual zone
			while (typeof zoneList === "string") {
				t = zoneList;
				zoneList = _this.zones[t];
			}
			if (!zoneList) {
				// Backward-compat file hasn't loaded yet, try looking in there
				if (!_this.loadedZones.backward) {
					//This is for backward entries like 'America/Fort_Wayne' that
					// getRegionForTimezone *thinks* it has a region file and zone
					// for (e.g., America => 'northamerica'), but in reality it's a
					// legacy zone we need the backward file for.
					_this.loadZoneFile("backward");
					return getZone(dt, tz);
				} else if (t && t !== tz) {
					//Load the linked zone found in the backward file
					_this.lazyLoadZoneFiles(t);
					return getZone(dt, t);
				}
				invalidTZError(t);
			}
			if (zoneList.length === 0) {
				throw new Error("No Zone found for '" + tz + "' on " + dt);
			}
			//Do backwards lookup since most use cases deal with newer dates.
			for (var i = zoneList.length - 1; i >= 0; i--) {
				var z = zoneList[i];
				if (z[3] && utcMillis > z[3]) break;
			}
			return zoneList[i + 1];
		}
		function getBasicOffset(time) {
			var off = parseTimeString(time),
				adj = time.charAt(0) === "-" ? -1 : 1;
			off = adj * (((off[0] * 60 + off[1]) * 60 + off[2]) * 1000);
			return off / 60 / 1000;
		}
		function getAdjustedOffset(off, min) {
			return -Math.ceil(min - off);
		}

		//if isUTC is true, date is given in UTC, otherwise it's given
		// in local time (ie. date.getUTC*() returns local time components)
		function getRule(dt, zone, isUTC, cacheKey) {
			var date = typeof dt === "number" ? new Date(dt) : dt;
			var ruleset = zone[1];
			var basicOffset = zone[0];

			// If the zone has a DST rule like '1:00', create a rule and return it
			// instead of looking it up in the parsed rules
			var staticDstMatch = ruleset.match(/^([0-9]):([0-9][0-9])$/);
			if (staticDstMatch) {
				return [
					-1000000,
					"max",
					"-",
					"Jan",
					1,
					[0, 0, 0],
					parseInt(staticDstMatch[1], 10) * 60 +
						parseInt(staticDstMatch[2], 10),
					"-"
				];
			}

			//Convert a date to UTC. Depending on the 'type' parameter, the date
			// parameter may be:
			//
			// - `u`, `g`, `z`: already UTC (no adjustment).
			//
			// - `s`: standard time (adjust for time zone offset but not for DST)
			//
			// - `w`: wall clock time (adjust for both time zone and DST offset).
			//
			// DST adjustment is done using the rule given as third argument.
			var convertDateToUTC = function (date, type, rule) {
				var offset = 0;

				if (type === "u" || type === "g" || type === "z") {
					// UTC
					offset = 0;
				} else if (type === "s") {
					// Standard Time
					offset = basicOffset;
				} else if (type === "w" || !type) {
					// Wall Clock Time
					offset = getAdjustedOffset(basicOffset, rule[6]);
				} else {
					throw new Error("unknown type " + type);
				}
				offset *= 60 * 1000; // to millis

				return new Date(date.getTime() + offset);
			};

			//Step 1:  Find applicable rules for this year.
			//
			//Step 2:  Sort the rules by effective date.
			//
			//Step 3:  Check requested date to see if a rule has yet taken effect this year.  If not,
			//
			//Step 4:  Get the rules for the previous year.  If there isn't an applicable rule for last year, then
			// there probably is no current time offset since they seem to explicitly turn off the offset
			// when someone stops observing DST.
			//
			// FIXME if this is not the case and we'll walk all the way back (ugh).
			//
			//Step 5:  Sort the rules by effective date.
			//Step 6:  Apply the most recent rule before the current time.
			var convertRuleToExactDateAndTime = function (yearAndRule, prevRule) {
				var year = yearAndRule[0],
					rule = yearAndRule[1];
				// Assume that the rule applies to the year of the given date.

				var hms = rule[5];
				var effectiveDate;

				if (!EXACT_DATE_TIME[year]) EXACT_DATE_TIME[year] = {};

				// Result for given parameters is already stored
				if (EXACT_DATE_TIME[year][rule])
					effectiveDate = EXACT_DATE_TIME[year][rule];
				else {
					//If we have a specific date, use that!
					if (!isNaN(rule[4])) {
						effectiveDate = new Date(
							Date.UTC(
								year,
								SHORT_MONTHS[rule[3]],
								rule[4],
								hms[0],
								hms[1],
								hms[2],
								0
							)
						);
					}
					//Let's hunt for the date.
					else {
						var targetDay, operator;
						//Example: `lastThu`
						if (rule[4].substr(0, 4) === "last") {
							// Start at the last day of the month and work backward.
							effectiveDate = new Date(
								Date.UTC(
									year,
									SHORT_MONTHS[rule[3]] + 1,
									1,
									hms[0] - 24,
									hms[1],
									hms[2],
									0
								)
							);
							targetDay = SHORT_DAYS[rule[4].substr(4, 3)];
							operator = "<=";
						}
						//Example: `Sun>=15`
						else {
							//Start at the specified date.
							effectiveDate = new Date(
								Date.UTC(
									year,
									SHORT_MONTHS[rule[3]],
									rule[4].substr(5),
									hms[0],
									hms[1],
									hms[2],
									0
								)
							);
							targetDay = SHORT_DAYS[rule[4].substr(0, 3)];
							operator = rule[4].substr(3, 2);
						}
						var ourDay = effectiveDate.getUTCDay();
						//Go forwards.
						if (operator === ">=") {
							effectiveDate.setUTCDate(
								effectiveDate.getUTCDate() +
									(targetDay - ourDay + (targetDay < ourDay ? 7 : 0))
							);
						}
						//Go backwards.  Looking for the last of a certain day, or operator is '<=' (less likely).
						else {
							effectiveDate.setUTCDate(
								effectiveDate.getUTCDate() +
									(targetDay - ourDay - (targetDay > ourDay ? 7 : 0))
							);
						}
					}
					EXACT_DATE_TIME[year][rule] = effectiveDate;
				}

				//If previous rule is given, correct for the fact that the starting time of the current
				// rule may be specified in local time.
				if (prevRule) {
					effectiveDate = convertDateToUTC(effectiveDate, hms[3], prevRule);
				}
				return effectiveDate;
			};

			var findApplicableRules = function (year, ruleset) {
				var applicableRules = [];
				for (var i = 0; ruleset && i < ruleset.length; i++) {
					//Exclude future rules.
					if (
						ruleset[i][0] <= year &&
						// Date is in a set range.
						(ruleset[i][1] >= year ||
							// Date is in an 'only' year.
							(ruleset[i][0] === year && ruleset[i][1] === "only") ||
							//We're in a range from the start year to infinity.
							ruleset[i][1] === "max")
					) {
						//It's completely okay to have any number of matches here.
						// Normally we should only see two, but that doesn't preclude other numbers of matches.
						// These matches are applicable to this year.
						applicableRules.push([year, ruleset[i]]);
					}
				}
				return applicableRules;
			};

			var compareDates = function (a, b, prev) {
				var year, rule;
				if (!(a instanceof Date)) {
					year = a[0];
					rule = a[1];
					a =
						!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule]
							? EXACT_DATE_TIME[year][rule]
							: convertRuleToExactDateAndTime(a, prev);
				} else if (prev) {
					a = convertDateToUTC(a, isUTC ? "u" : "w", prev);
				}
				if (!(b instanceof Date)) {
					year = b[0];
					rule = b[1];
					b =
						!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule]
							? EXACT_DATE_TIME[year][rule]
							: convertRuleToExactDateAndTime(b, prev);
				} else if (prev) {
					b = convertDateToUTC(b, isUTC ? "u" : "w", prev);
				}
				a = Number(a);
				b = Number(b);
				return a - b;
			};

			var year = date.getUTCFullYear();
			var applicableRules;

			var cache = timezoneJS.ruleCache[cacheKey];
			if (!cache) cache = timezoneJS.ruleCache[cacheKey] = {};
			applicableRules = cache[year];
			if (!applicableRules) {
				applicableRules = findApplicableRules(year - 1, _this.rules[ruleset]);
				applicableRules = applicableRules.concat(
					findApplicableRules(year, _this.rules[ruleset])
				);
				applicableRules.sort(compareDates); // Probably already sorted?
				cache[year] = applicableRules;
			}

			if (!applicableRules || !applicableRules.length) return null; // No applicable rules

			var prev;
			for (var i = applicableRules.length - 1; i >= 0; i--) {
				if (i > 0) prev = applicableRules[i - 1][1];
				else prev = null;
				var rule = applicableRules[i];
				if (!rule[2]) {
					rule[2] = convertRuleToExactDateAndTime(rule, prev); // cache the exactDateAndTime, this saves a lot of cycles!
				}
				if (compareDates(date, rule, prev) >= 0) return rule[1];
			}
			return null;

			/*
	      applicableRules = findApplicableRules(year, _this.rules[ruleset]);
	      applicableRules.push(date);
	      //While sorting, the time zone in which the rule starting time is specified
	      // is ignored. This is ok as long as the timespan between two DST changes is
	      // larger than the DST offset, which is probably always true.
	      // As the given date may indeed be close to a DST change, it may get sorted
	      // to a wrong position (off by one), which is corrected below.
	      applicableRules.sort(compareDates);

	      //If there are not enough past DST rules...
	      if (_arrIndexOf.call(applicableRules, date) < 2) {
		applicableRules = applicableRules.concat(findApplicableRules(year-1, _this.rules[ruleset]));
		applicableRules.sort(compareDates);
	      }
	      var pinpoint = _arrIndexOf.call(applicableRules, date);
	      if (pinpoint > 1 && compareDates(date, applicableRules[pinpoint-1], applicableRules[pinpoint-2][1]) < 0) {
		//The previous rule does not really apply, take the one before that.
		return applicableRules[pinpoint - 2][1];
	      } else if (pinpoint > 0 && pinpoint < applicableRules.length - 1 && compareDates(date, applicableRules[pinpoint+1], applicableRules[pinpoint-1][1]) > 0) {

		//The next rule does already apply, take that one.
		return applicableRules[pinpoint + 1][1];
	      } else if (pinpoint === 0) {
		//No applicable rule found in this and in previous year.
		return null;
	      }
	      return applicableRules[pinpoint - 1][1];
	     */
		}
		function getAbbreviation(zone, rule) {
			var base = zone[2];
			if (base.indexOf("%s") > -1) {
				var repl;
				if (rule) {
					repl = rule[7] === "-" ? "" : rule[7];
				}
				//FIXME: Right now just falling back to Standard --
				// apparently ought to use the last valid rule,
				// although in practice that always ought to be Standard
				else {
					repl = "S";
				}
				return base.replace("%s", repl);
			} else if (base.indexOf("/") > -1) {
				//Chose one of two alternative strings.
				return base.split("/", 2)[rule ? (rule[6] ? 1 : 0) : 0];
			}
			return base;
		}

		this.zoneFileBasePath = null;
		this.zoneFiles = [
			"africa",
			"antarctica",
			"asia",
			"australasia",
			"backward",
			"etcetera",
			"europe",
			"northamerica",
			"pacificnew",
			"southamerica"
		];
		this.loadingSchemes = {
			PRELOAD_ALL: "preloadAll",
			LAZY_LOAD: "lazyLoad",
			MANUAL_LOAD: "manualLoad"
		};
		this.getRegionForTimezone = getRegionForTimezone;
		this.loadingScheme = this.loadingSchemes.LAZY_LOAD;
		this.loadedZones = {};
		this.zones = {};
		this.rules = {};

		this.init = function (o) {
			var opts = { async: true },
				def =
					this.loadingScheme === this.loadingSchemes.PRELOAD_ALL
						? this.zoneFiles
						: this.defaultZoneFile || "northamerica";
			//Override default with any passed-in opts
			for (var p in o) {
				opts[p] = o[p];
			}
			return this.loadZoneFiles(def, opts);
		};

		//Get a single zone file, or all files in an array
		this.loadZoneFiles = function (fileNames, opts) {
			var callbackFn,
				done = 0;
			if (typeof fileNames === "string") {
				return this.loadZoneFile(fileNames, opts);
			}
			//Wraps callback function in another one that makes
			// sure all files have been loaded.
			opts = opts || {};
			callbackFn = opts.callback;
			opts.callback = function () {
				done++;
				done === fileNames.length &&
					typeof callbackFn === "function" &&
					callbackFn();
			};
			for (var i = 0; i < fileNames.length; i++) {
				this.loadZoneFile(fileNames[i], opts);
			}
		};
		//Get the zone files via XHR -- if the sync flag
		// is set to true, it's being called by the lazy-loading
		// mechanism, so the result needs to be returned inline.
		this.loadZoneFile = function (fileName, opts) {
			if (typeof this.zoneFileBasePath === "undefined") {
				throw new Error(
					"Please define a base path to your zone file directory -- timezoneJS.timezone.zoneFileBasePath."
				);
			}
			//Ignore already loaded zones.
			if (this.loadedZones[fileName]) {
				return;
			}
			this.loadedZones[fileName] = true;
			return builtInLoadZoneFile(fileName, opts);
		};
		this.loadZoneJSONData = function (url, sync) {
			var processData = function (data) {
				data = JSON.parse(data);
				for (var z in data.zones) {
					_this.zones[z] = data.zones[z];
				}
				for (var r in data.rules) {
					_this.rules[r] = data.rules[r];
				}
			};
			return sync
				? processData(_this.transport({ url: url, async: false }))
				: _this.transport({ url: url, success: processData });
		};
		this.loadZoneDataFromObject = function (data) {
			if (!data) {
				return;
			}
			for (var z in data.zones) {
				_this.zones[z] = data.zones[z];
			}
			for (var r in data.rules) {
				_this.rules[r] = data.rules[r];
			}
		};
		this.getAllZones = function () {
			var arr = [];
			for (var z in this.zones) {
				arr.push(z);
			}
			return arr.sort();
		};
		this.parseZones = function (str) {
			if (!str) {
				return false;
			}

			var lines = str.split("\n"),
				arr = [],
				chunk = "",
				l,
				zone = null,
				rule = null;
			for (var i = 0; i < lines.length; i++) {
				l = lines[i];
				if (l.match(/^\s/)) {
					l = "Zone " + zone + l;
				}
				l = l.split("#")[0];
				if (l.length > 3) {
					arr = l.split(/\s+/);
					chunk = arr.shift();
					//Ignore Leap.
					switch (chunk) {
						case "Zone":
							zone = arr.shift();
							if (!_this.zones[zone]) {
								_this.zones[zone] = [];
							}
							if (arr.length < 3) break;
							//Process zone right here and replace 3rd element with the processed array.
							arr.splice(3, arr.length, processZone(arr));
							if (arr[3]) arr[3] = Date.UTC.apply(null, arr[3]);
							arr[0] = -getBasicOffset(arr[0]);
							_this.zones[zone].push(arr);
							break;
						case "Rule":
							rule = arr.shift();
							if (!_this.rules[rule]) {
								_this.rules[rule] = [];
							}
							//Parse int FROM year and TO year
							arr[0] = parseInt(arr[0], 10);
							arr[1] = parseInt(arr[1], 10) || arr[1];
							//Parse time string AT
							arr[5] = parseTimeString(arr[5]);
							//Parse offset SAVE
							arr[6] = getBasicOffset(arr[6]);
							_this.rules[rule].push(arr);
							break;
						case "Link":
							//No zones for these should already exist.
							if (_this.zones[arr[1]]) {
								throw new Error(
									"Error with Link " +
										arr[1] +
										". Cannot create link of a preexisted zone."
								);
							}
							//Create the link.
							//Links are saved as strings that are the keys
							//of their referenced values.
							//Ex: "US/Central": "America/Chicago"
							if (isNaN(arr[0])) {
								_this.zones[arr[1]] = arr[0];
							} else {
								_this.zones[arr[1]] = parseInt(arr[0], 10);
							}
							break;
					}
				}
			}
			return true;
		};
		//Expose transport mechanism and allow overwrite.
		this.transport = _transport;
		this.getTzInfo = function (dt, tz, isUTC) {
			this.lazyLoadZoneFiles(tz);
			var z = getZone(dt, tz);
			var off = +z[0];
			//See if the offset needs adjustment.
			var rule = getRule(dt, z, isUTC, tz);
			if (rule) {
				off = getAdjustedOffset(off, rule[6]);
			}
			var abbr = getAbbreviation(z, rule);
			return { tzOffset: off, tzAbbr: abbr };
		};
		//Lazy-load any zones not yet loaded.
		this.lazyLoadZoneFiles = function (tz) {
			if (this.loadingScheme === this.loadingSchemes.LAZY_LOAD) {
				//Get the correct region for the zone.
				var zoneFile = getRegionForTimezone(tz);
				if (!zoneFile) {
					throw new Error("Not a valid timezone ID.");
				}
				//Get the file and parse it -- use synchronous XHR.
				this.loadZoneFiles(zoneFile);
			}
		};
	})();
}.call(typeof window !== "undefined" ? window : this));

// Load all the necessary timezones and their rules
timezoneJS.timezone.loadingScheme =
	timezoneJS.timezone.loadingSchemes.MANUAL_LOAD;
timezoneJS.timezone.loadZoneDataFromObject({
	zones: {
		"Atlantic/Cape_Verde": [[60, "-", "-01", null]],
		"Africa/Cairo": [[-120, "Egypt", "EE%sT", null]],
		"Africa/Nairobi": [[-180, "-", "EAT", null]],
		"Africa/Casablanca": [
			[0, "Morocco", "+00/+01", 1540695600000],
			[-60, "Morocco", "+01/+00", null]
		],
		"Africa/Johannesburg": [[-120, "SA", "SAST", null]],
		"Africa/Tunis": [[-60, "Tunisia", "CE%sT", null]],
		"Asia/Kabul": [[-270, "-", "+0430", null]],
		"Asia/Baku": [[-240, "Azer", "+04/+05", null]],
		"Asia/Dhaka": [[-360, "Dhaka", "+06/+07", null]],
		"Asia/Yangon": [[-390, "-", "+0630", null]],
		"Asia/Shanghai": [[-480, "PRC", "C%sT", null]],
		"Asia/Hong_Kong": [[-480, "HK", "HK%sT", null]],
		"Asia/Taipei": [[-480, "Taiwan", "C%sT", null]],
		"Asia/Nicosia": [[-120, "EUAsia", "EE%sT", null]],
		"Asia/Kolkata": [[-330, "-", "IST", null]],
		"Asia/Tehran": [[-210, "Iran", "+0330/+0430", null]],
		"Asia/Jerusalem": [[-120, "Zion", "I%sT", null]],
		"Asia/Tokyo": [[-540, "Japan", "J%sT", null]],
		"Asia/Amman": [[-120, "Jordan", "EE%sT", null]],
		"Asia/Almaty": [[-360, "-", "ALMT", null]],
		"Asia/Seoul": [[-540, "ROK", "K%sT", null]],
		"Asia/Pyongyang": [
			[-540, "-", "KST", 1439596800000],
			[-510, "-", "KST", 1525476600000],
			[-540, "-", "KST", null]
		],
		"Asia/Beirut": [[-120, "Lebanon", "EE%sT", null]],
		"Asia/Kuala_Lumpur": [[-480, "-", "+08", null]],
		"Asia/Hovd": [[-420, "Mongol", "+07/+08", null]],
		"Asia/Ulaanbaatar": [[-480, "Mongol", "+08/+09", null]],
		"Asia/Kathmandu": [[-345, "-", "+0545", null]],
		"Asia/Karachi": [[-300, "Pakistan", "PK%sT", null]],
		"Asia/Riyadh": [[-180, "-", "+03", null]],
		"Asia/Damascus": [[-120, "Syria", "EE%sT", null]],
		"Asia/Bangkok": [[-420, "-", "+07", null]],
		"Asia/Dubai": [[-240, "-", "+04", null]],
		"Australia/Darwin": [[-570, "Aus", "CST", null]],
		"Australia/Perth": [[-480, "AW", "WST", null]],
		"Australia/Eucla": [[-525, "AW", "+0845/+0945", null]],
		"Australia/Brisbane": [[-600, "AQ", "EST", null]],
		"Australia/Adelaide": [[-570, "AS", "CST", null]],
		"Australia/Sydney": [[-600, "AN", "EST", null]],
		"Pacific/Fiji": [[-720, "Fiji", "+12/+13", null]],
		"Pacific/Guam": [[-600, "-", "ChST", null]],
		"Pacific/Kiritimati": [[-840, "-", "+14", null]],
		"Pacific/Noumea": [[-660, "NC", "+11/+12", null]],
		"Pacific/Auckland": [[-720, "NZ", "NZ%sT", null]],
		"Pacific/Chatham": [[-765, "Chatham", "+1245/+1345", null]],
		"Pacific/Pago_Pago": [[660, "-", "SST", null]],
		"Pacific/Apia": [[-780, "WS", "+13/+14", null]],
		"Pacific/Tongatapu": [[-780, "Tonga", "+13/+14", null]],
		"Etc/UTC": [[0, "-", "UTC", null]],
		UTC: "Etc/UTC",
		"Europe/London": [[0, "EU", "GMT/BST", null]],
		"Europe/Dublin": [[0, "Eire", "IST/GMT", null]],
		WET: [[0, "EU", "WE%sT", null]],
		CET: [[-60, "C-Eur", "CE%sT", null]],
		MET: [[-60, "C-Eur", "ME%sT", null]],
		EET: [[-120, "EU", "EE%sT", null]],
		"Europe/Brussels": [[-60, "EU", "CE%sT", null]],
		"Europe/Helsinki": [[-120, "EU", "EE%sT", null]],
		"Europe/Paris": [[-60, "EU", "CE%sT", null]],
		"Europe/Berlin": [[-60, "EU", "CE%sT", null]],
		"Europe/Amsterdam": [[-60, "EU", "CE%sT", null]],
		"Atlantic/Azores": [[60, "EU", "-01/+00", null]],
		"Europe/Bucharest": [[-120, "EU", "EE%sT", null]],
		"Europe/Kaliningrad": [[-120, "-", "EET", null]],
		"Europe/Moscow": [[-180, "-", "MSK", null]],
		"Europe/Simferopol": [[-180, "-", "MSK", null]],
		"Europe/Samara": [[-240, "-", "+04", null]],
		"Asia/Yekaterinburg": [[-300, "-", "+05", null]],
		"Asia/Omsk": [[-360, "-", "+06", null]],
		"Asia/Novosibirsk": [
			[-360, "-", "+06", 1469325600000],
			[-420, "-", "+07", null]
		],
		"Asia/Novokuznetsk": [[-420, "-", "+07", null]],
		"Asia/Krasnoyarsk": [[-420, "-", "+07", null]],
		"Asia/Irkutsk": [[-480, "-", "+08", null]],
		"Asia/Yakutsk": [[-540, "-", "+09", null]],
		"Asia/Vladivostok": [[-600, "-", "+10", null]],
		"Asia/Magadan": [
			[-600, "-", "+10", 1461463200000],
			[-660, "-", "+11", null]
		],
		"Asia/Srednekolymsk": [[-660, "-", "+11", null]],
		"Asia/Kamchatka": [[-720, "-", "+12", null]],
		"Europe/Belgrade": [[-60, "EU", "CE%sT", null]],
		"Europe/Sarajevo": "Europe/Belgrade",
		"Europe/Istanbul": [
			[-120, "EU", "EE%sT", 1445734800000],
			[-120, "1:00", "EEST", 1446944400000],
			[-120, "EU", "EE%sT", 1473206400000],
			[-180, "-", "+03", null]
		],
		"America/New_York": [[300, "US", "E%sT", null]],
		"America/Chicago": [[360, "US", "C%sT", null]],
		"America/Denver": [[420, "US", "M%sT", null]],
		"America/Los_Angeles": [[480, "US", "P%sT", null]],
		"America/Juneau": [[540, "US", "AK%sT", null]],
		"Pacific/Honolulu": [[600, "-", "HST", null]],
		"America/Phoenix": [[420, "-", "MST", null]],
		"America/St_Johns": [[210, "Canada", "N%sT", null]],
		"America/Halifax": [[240, "Canada", "A%sT", null]],
		"America/Regina": [[360, "-", "CST", null]],
		"America/Mexico_City": [[360, "Mexico", "C%sT", null]],
		"America/Chihuahua": [[420, "Mexico", "M%sT", null]],
		"America/Costa_Rica": [[360, "CR", "C%sT", null]],
		"America/Havana": [[300, "Cuba", "C%sT", null]],
		"America/Port-au-Prince": [[300, "Haiti", "E%sT", null]],
		"America/Panama": [[300, "-", "EST", null]],
		"America/Puerto_Rico": [[240, "-", "AST", null]],
		"America/Argentina/Buenos_Aires": [[180, "Arg", "-03/-02", null]],
		"America/Sao_Paulo": [[180, "Brazil", "-03/-02", null]],
		"America/Santiago": [[240, "Chile", "-04/-03", null]],
		"America/Punta_Arenas": [
			[240, "Chile", "-04/-03", 1480809600000],
			[180, "-", "-03", null]
		],
		"America/Bogota": [[300, "CO", "-05/-04", null]],
		"America/Asuncion": [[240, "Para", "-04/-03", null]],
		"Atlantic/South_Georgia": [[120, "-", "-02", null]],
		"America/Montevideo": [[180, "Uruguay", "-03/-02", null]],
		"America/Caracas": [
			[270, "-", "-0430", 1462069800000],
			[240, "-", "-04", null]
		],
		// backwards compatibility
		"Europe/Athens": "Europe/Bucharest",
		"Asia/Rangoon": "Asia/Yangon",
		"Atlantic/Reykjavik": "UTC",
		"Asia/Kuwait": "Asia/Riyadh",
		"Asia/Muscat": "Asia/Riyadh",
		"Asia/Istanbul": "Europe/Istanbul"
	},
	rules: {
		Egypt: [],
		Morocco: [
			[2013, 2018, "-", "Oct", "lastSun", [3, 0, 0, null], 0, "-"],
			[2014, 2018, "-", "Mar", "lastSun", [2, 0, 0, null], 60, "-"],
			[2015, "only", "-", "Jun", "14", [3, 0, 0, null], 0, "-"],
			[2015, "only", "-", "Jul", "19", [2, 0, 0, null], 60, "-"],
			[2016, "only", "-", "Jun", "5", [3, 0, 0, null], 0, "-"],
			[2016, "only", "-", "Jul", "10", [2, 0, 0, null], 60, "-"],
			[2017, "only", "-", "May", "21", [3, 0, 0, null], 0, "-"],
			[2017, "only", "-", "Jul", "2", [2, 0, 0, null], 60, "-"],
			[2018, "only", "-", "May", "13", [3, 0, 0, null], 0, "-"],
			[2018, "only", "-", "Jun", "17", [2, 0, 0, null], 60, "-"],
			[2019, "only", "-", "May", "5", [3, 0, 0, null], -60, "-"],
			[2019, "only", "-", "Jun", "9", [2, 0, 0, null], 0, "-"],
			[2020, "only", "-", "Apr", "19", [3, 0, 0, null], -60, "-"],
			[2020, "only", "-", "May", "24", [2, 0, 0, null], 0, "-"],
			[2021, "only", "-", "Apr", "11", [3, 0, 0, null], -60, "-"],
			[2021, "only", "-", "May", "16", [2, 0, 0, null], 0, "-"],
			[2022, "only", "-", "Mar", "27", [3, 0, 0, null], -60, "-"],
			[2022, "only", "-", "May", "8", [2, 0, 0, null], 0, "-"],
			[2023, "only", "-", "Mar", "19", [3, 0, 0, null], -60, "-"],
			[2023, "only", "-", "Apr", "23", [2, 0, 0, null], 0, "-"]
		],
		SA: [],
		Tunisia: [],
		EUAsia: [
			[1981, "max", "-", "Mar", "lastSun", [1, 0, 0, "u"], 60, "S"],
			[1996, "max", "-", "Oct", "lastSun", [1, 0, 0, "u"], 0, "-"]
		],
		Azer: [
			[1997, 2015, "-", "Mar", "lastSun", [4, 0, 0, null], 60, "-"],
			[1997, 2015, "-", "Oct", "lastSun", [5, 0, 0, null], 0, "-"]
		],
		Dhaka: [],
		PRC: [],
		HK: [],
		Taiwan: [],
		Iran: [
			[2013, 2015, "-", "Mar", "22", [0, 0, 0, null], 60, "-"],
			[2013, 2015, "-", "Sep", "22", [0, 0, 0, null], 0, "-"],
			[2016, "only", "-", "Mar", "21", [0, 0, 0, null], 60, "-"],
			[2016, "only", "-", "Sep", "21", [0, 0, 0, null], 0, "-"],
			[2017, 2019, "-", "Mar", "22", [0, 0, 0, null], 60, "-"],
			[2017, 2019, "-", "Sep", "22", [0, 0, 0, null], 0, "-"],
			[2020, "only", "-", "Mar", "21", [0, 0, 0, null], 60, "-"],
			[2020, "only", "-", "Sep", "21", [0, 0, 0, null], 0, "-"],
			[2021, 2023, "-", "Mar", "22", [0, 0, 0, null], 60, "-"],
			[2021, 2023, "-", "Sep", "22", [0, 0, 0, null], 0, "-"]
		],
		Zion: [
			[2013, "max", "-", "Mar", "Fri>=23", [2, 0, 0, null], 60, "D"],
			[2013, "max", "-", "Oct", "lastSun", [2, 0, 0, null], 0, "S"]
		],
		Japan: [],
		Jordan: [
			[2014, "max", "-", "Mar", "lastThu", [24, 0, 0, null], 60, "S"],
			[2014, "max", "-", "Oct", "lastFri", [0, 0, 0, "s"], 0, "-"]
		],
		ROK: [],
		Lebanon: [
			[1993, "max", "-", "Mar", "lastSun", [0, 0, 0, null], 60, "S"],
			[1999, "max", "-", "Oct", "lastSun", [0, 0, 0, null], 0, "-"]
		],
		Mongol: [
			[2015, 2016, "-", "Mar", "lastSat", [2, 0, 0, null], 60, "-"],
			[2015, 2016, "-", "Sep", "lastSat", [0, 0, 0, null], 0, "-"]
		],
		Pakistan: [],
		Syria: [
			[2012, "max", "-", "Mar", "lastFri", [0, 0, 0, null], 60, "S"],
			[2009, "max", "-", "Oct", "lastFri", [0, 0, 0, null], 0, "-"]
		],
		Aus: [],
		AW: [],
		AQ: [],
		AS: [
			[2008, "max", "-", "Apr", "Sun>=1", [2, 0, 0, "s"], 0, "-"],
			[2008, "max", "-", "Oct", "Sun>=1", [2, 0, 0, "s"], 60, "-"]
		],
		AN: [
			[2008, "max", "-", "Apr", "Sun>=1", [2, 0, 0, "s"], 0, "-"],
			[2008, "max", "-", "Oct", "Sun>=1", [2, 0, 0, "s"], 60, "-"]
		],
		Fiji: [
			[2014, "max", "-", "Nov", "Sun>=1", [2, 0, 0, null], 60, "-"],
			[2015, "max", "-", "Jan", "Sun>=13", [3, 0, 0, null], 0, "-"]
		],
		NC: [],
		NZ: [
			[2007, "max", "-", "Sep", "lastSun", [2, 0, 0, "s"], 60, "D"],
			[2008, "max", "-", "Apr", "Sun>=1", [2, 0, 0, "s"], 0, "S"]
		],
		Chatham: [
			[2007, "max", "-", "Sep", "lastSun", [2, 45, 0, "s"], 60, "-"],
			[2008, "max", "-", "Apr", "Sun>=1", [2, 45, 0, "s"], 0, "-"]
		],
		WS: [
			[2012, "max", "-", "Apr", "Sun>=1", [4, 0, 0, null], 0, "-"],
			[2012, "max", "-", "Sep", "lastSun", [3, 0, 0, null], 60, "-"]
		],
		Tonga: [
			[2016, "only", "-", "Nov", "Sun>=1", [2, 0, 0, null], 60, "-"],
			[2017, "only", "-", "Jan", "Sun>=15", [3, 0, 0, null], 0, "-"]
		],
		Eire: [
			[1981, "max", "-", "Mar", "lastSun", [1, 0, 0, "u"], 0, "-"],
			[1996, "max", "-", "Oct", "lastSun", [1, 0, 0, "u"], -60, "-"]
		],
		EU: [
			[1981, "max", "-", "Mar", "lastSun", [1, 0, 0, "u"], 60, "S"],
			[1996, "max", "-", "Oct", "lastSun", [1, 0, 0, "u"], 0, "-"]
		],
		"C-Eur": [
			[1981, "max", "-", "Mar", "lastSun", [2, 0, 0, "s"], 60, "S"],
			[1996, "max", "-", "Oct", "lastSun", [2, 0, 0, "s"], 0, "-"]
		],
		US: [
			[2007, "max", "-", "Mar", "Sun>=8", [2, 0, 0, null], 60, "D"],
			[2007, "max", "-", "Nov", "Sun>=1", [2, 0, 0, null], 0, "S"]
		],
		Canada: [
			[2007, "max", "-", "Mar", "Sun>=8", [2, 0, 0, null], 60, "D"],
			[2007, "max", "-", "Nov", "Sun>=1", [2, 0, 0, null], 0, "S"]
		],
		Mexico: [
			[2002, "max", "-", "Apr", "Sun>=1", [2, 0, 0, null], 60, "D"],
			[2002, "max", "-", "Oct", "lastSun", [2, 0, 0, null], 0, "S"]
		],
		CR: [],
		Cuba: [
			[2012, "max", "-", "Nov", "Sun>=1", [0, 0, 0, "s"], 0, "S"],
			[2013, "max", "-", "Mar", "Sun>=8", [0, 0, 0, "s"], 60, "D"]
		],
		Haiti: [
			[2012, 2015, "-", "Mar", "Sun>=8", [2, 0, 0, null], 60, "D"],
			[2012, 2015, "-", "Nov", "Sun>=1", [2, 0, 0, null], 0, "S"],
			[2017, "max", "-", "Mar", "Sun>=8", [2, 0, 0, null], 60, "D"],
			[2017, "max", "-", "Nov", "Sun>=1", [2, 0, 0, null], 0, "S"]
		],
		Arg: [],
		Brazil: [
			[2008, 2017, "-", "Oct", "Sun>=15", [0, 0, 0, null], 60, "-"],
			[2015, "only", "-", "Feb", "Sun>=22", [0, 0, 0, null], 0, "-"],
			[2016, 2019, "-", "Feb", "Sun>=15", [0, 0, 0, null], 0, "-"],
			[2018, "only", "-", "Nov", "Sun>=1", [0, 0, 0, null], 60, "-"]
		],
		Chile: [
			[2016, 2018, "-", "May", "Sun>=9", [3, 0, 0, "u"], 0, "-"],
			[2016, 2018, "-", "Aug", "Sun>=9", [4, 0, 0, "u"], 60, "-"],
			[2019, "max", "-", "Apr", "Sun>=2", [3, 0, 0, "u"], 0, "-"],
			[2019, "max", "-", "Sep", "Sun>=2", [4, 0, 0, "u"], 60, "-"]
		],
		CO: [],
		Para: [
			[2010, "max", "-", "Oct", "Sun>=1", [0, 0, 0, null], 60, "-"],
			[2013, "max", "-", "Mar", "Sun>=22", [0, 0, 0, null], 0, "-"]
		],
		Uruguay: [[2006, 2015, "-", "Mar", "Sun>=8", [2, 0, 0, null], 0, "-"]]
	}
});

};

let __js_standard_visualization_ = (_exports) => {

/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/**
 * Creates a DOM object capable of receiving a data stream. The object changes as a result of the incoming data.
 * The constructor function takes attributes that define how and where in the HTML document the object gets created.
 * See {@link CIQ.Visualization#setAttributes} for more information on attributes.
 *
 * One useful application of this is to render an SVG graphic.
 *
 * Methods are provided to pass data into the object and to render it in the HTML document. Note that the `data` and
 * `attributes` that are passed into the prototype methods of this object become owned by it and therefore can be mutated.
 *
 * The DOM object-generating function can assign class names to subelements within the object. These class names can be used
 * to style the object using CSS. Documentation for the built-in functions explains which classes are available to be styled.
 *
 * @param {object} attributes Parameters to be used when creating the object.
 * @param {function} attributes.renderFunction DOM object-generating function. Takes data as an array (sorted by index property)
 * 		and attributes as arguments *by reference* and returns an `HTMLElement` (which may have children).
 * @param {HTMLElement|string} [attributes.container] Element in which to put the DOM object (or selector thereof). If omitted,
 * 		a container element is created with 300 x 300 pixel dimensions.
 * @param {boolean} [attributes.useCanvasShim] Set to true to relocate the container behind the canvas but in front of the
 * 		gridlines. **Note:** Consider using {@link CIQ.ChartEngine#embedVisualization}; it automatically places the object
 * 		within the canvases.
 * @param {CIQ.ChartEngine} [attributes.stx] A reference to the chart engine. Required if using the canvas shim.
 * @param {string} [attributes.id] Optional id attribute to assign to the object.
 * @param {boolean} [attributes.forceReplace] True to force a complete replacement of the DOM object when data changes.
 * 		Do not set if `renderFunction` can handle an incremental update of the object. Alternatively, `renderFunction` might set
 * 		this attribute. When attributes are updated using `setAttributes`, a complete replacement occurs.
 * @constructor
 * @name CIQ.Visualization
 * @example
 * let svg=new CIQ.Visualization({ renderFunction: CIQ.SVGChart.renderPieChart });
 * svg.updateData({"Low":{name:"low", value:30}, "High":{name:"high", value:70}});
 * @since 7.4.0
 */
CIQ.Visualization =
	CIQ.Visualization ||
	function (attributes) {
		if (!attributes) {
			console.log("CIQ.Visualization() missing attributes argument.");
			return;
		}
		if (typeof attributes.renderFunction !== "function") {
			console.log(
				"CIQ.Visualization() missing renderFunction property in attributes."
			);
			return;
		}
		/**
		 * READ ONLY. The DOM container that hosts the DOM object.
		 *
		 * @type HTMLElement
		 * @memberof CIQ.Visualization
		 * @since 7.4.0
		 */
		this.container = null;
		/**
		 * READ ONLY. The attributes used to render the DOM object. See the [function description]{@link CIQ.Visualization}
		 * for details. Do not change this property directly; instead, use {@link CIQ.Visualization#setAttributes}.
		 * @type object
		 * @memberof CIQ.Visualization
		 * @since 7.4.0
		 */
		this.attributes = attributes;
		/**
		 * READ ONLY. The data used to render the DOM object. See the [function description]{@link CIQ.Visualization}
		 * for details. Do not change this property directly; instead, use {@link CIQ.Visualization#updateData}.
		 * @type object
		 * @memberof CIQ.Visualization
		 * @since 7.4.0
		 */
		this.data = null;
		/**
		 * READ ONLY. The DOM object created by the rendering function.
		 *
		 * @type HTMLElement
		 * @memberof CIQ.Visualization
		 * @since 7.4.0
		 */
		this.object = null;
	};
CIQ.extend(CIQ.Visualization.prototype, {
	/**
	 * Removes the DOM object. If the container was generated by this object, the container is also removed.
	 *
	 * @param {boolean} soft True to leave properties of this object alone. Setting to false is preferable.
	 * @memberof CIQ.Visualization#
	 * @since 7.4.0
	 */
	destroy: function (soft) {
		var container = this.container;
		CIQ.resizeObserver(container, null, container.resizeHandle);
		if (container.autoGenerated) {
			container.parentNode.removeChild(container);
			delete this.container;
		} else container.innerHTML = "";
		if (soft) return;

		// suicide!!!
		this.attributes = null;
		this.container = null;
		this.data = null;
		this.object = null;
		this.destroy = this.draw = this.setAttributes = function () {};
		this.updateData = function () {
			return undefined;
		};
	},
	/**
	 * Draws the DOM object in its container. Data must be set using {@link CIQ.Visualization#updateData} prior
	 * to calling this function. Any content existing within the container is removed prior to drawing the object.
	 *
	 * @param {boolean} forceReplace Indicates whether a full redraw is requested.
	 * @since 7.4.0
	 * @memberof CIQ.Visualization#
	 */
	draw: function (forceReplace) {
		if (!this.data || typeof this.data !== "object") {
			console.log("CIQ.Visualization.draw() missing data.");
			return;
		}

		function sortFcn(l, r) {
			return l.index < r.index ? -1 : l.index > r.index ? 1 : 0;
		}

		var attributes = this.attributes;
		var container = attributes.container || this.container;
		if (typeof container === "string")
			container = document.querySelector(container);

		if (!container) {
			container = document.createElement("div");
			container.style.height = container.style.width = "300px";
			document.body.appendChild(container);
			container.autoGenerated = true;
		}
		if (attributes.stx) {
			var shim = attributes.stx.chart.canvasShim;
			if (
				attributes.useCanvasShim &&
				shim &&
				shim !== container &&
				shim !== container.parentNode
			) {
				if (!container.autoGenerated) {
					container = container.cloneNode();
					container.id = "";
					container.autoGenerated = true;
				}
				shim.appendChild(container);
			}
		}
		if (this.container && this.container !== container) {
			this.destroy(true);
		}
		if (!container.resizeHandle) {
			var closure = function (me) {
				return function () {
					if (me.data && me.container && document.body.contains(me.container)) {
						me.draw.call(me, true);
					}
				};
			};
			container.resizeHandle = CIQ.resizeObserver(
				container,
				closure(this),
				null,
				100
			);
		}
		this.container = container;
		this.attributes = attributes;

		attributes = CIQ.ensureDefaults(
			{ container: this.container },
			this.attributes
		);
		var object = attributes.renderFunction(
			Object.values(this.data).sort(sortFcn),
			attributes
		);
		if (object) {
			if (attributes.id) object.id = attributes.id;
			if (forceReplace || attributes.forceReplace) {
				this.container.innerHTML = "";
				this.container.appendChild(object);
			}
		}
		this.attributes = attributes;
		this.object = object;
	},
	/**
	 * Adds or changes the visualization object attributes, and then calls the draw function.
	 *
	 * The following generic attributes are available to all objects; all attributes are passed into the object-generating
	 * function and may be used there:
	 * - renderFunction
	 * - container
	 * - stx
	 * - useCanvasShim
	 * - id
	 * - forceReplace
	 *
	 * Attributes are passed into `renderFunction`, the object-generating function; and so, additional attributes can be
	 * added specific to the function.
	 *
	 * **Note:** The attributes passed into `renderFunction` can be changed by the render function when necessary. You can
	 * set either one attribute by passing in a key and a value, or you can add a set of attributes by passing in an object
	 * of key/value pairs.
	 *
	 * @param {object|string} arg1 An attribute key or and object of attribute key/value pairs.
	 * @param {*} [arg2] The value of the attribute if passing in one key and value.
	 * @memberof CIQ.Visualization#
	 * @since 7.4.0
	 */
	setAttributes: function (arg1, arg2) {
		var forceAttrs = [
			"renderFunction",
			"container",
			"stx",
			"useCanvasShim",
			"id",
			"forceReplace"
		];
		var useForce = false;
		var attr = arg1;
		if (typeof arg1 == "string") {
			attr = {};
			attr[arg1] = arg2;
		}
		if (typeof attr == "object") {
			for (var key in attr) {
				if (
					this.attributes[key] !== attr[key] &&
					forceAttrs.indexOf(key) !== -1
				)
					useForce = true;
				this.attributes[key] = attr[key];
			}
		}
		this.draw(useForce);
	},
	/**
	 * Adds or changes the visualization object data, and then calls the draw function.
	 *
	 * @param {object|array} data Provides data used to generate the DOM object. Contains at a minimum a `name`, a `value`,
	 * 		and an optional `index`, which specifies sort order. The data must accommodate the update `action`.
	 * @param {string} action The action to take when generating the DOM object. Valid actions are "add", "update",
	 * 		"delete", and "replace" (default).
	 *
	 * The `data` object provides each action with the required data.
	 *
	 * | Action | Required Data |
	 * | ------ | ---- |
	 * | replace | A full data object. |
	 * | delete | The data records to remove. **Note:** This may affect the colors used in the chart.
	 * | update | The data records to update. The existing records will have their properties replaced with the new properties, leaving all non-matching properties alone.
	 * | add | The same as the "update" action except the `value` property of the existing data is augmented instead of replaced by the new value.
	 *
	 * See the examples below.
	 *
	 * **Note:** If only the `value` property is being changed, it may be passed as a raw number rather than being assigned
	 * to an object property.
	 *
	 * @example
	 * <caption>Given a CIQ.Visualization instance <code>obj</code>:</caption>
	 * obj.updateData({"up",{value:1}},"add") // Adds 1 to the value property of the data record "up".
	 * obj.updateData({"up":1},"add") // Also adds 1 to the value property of the data record "up".
	 * obj.updateData({"up",{name:"UP"}},"update") // Updates the name property of the data record "up" to "UP".
	 * obj.updateData({"down",null},"delete") // Removes the record "down".
	 * obj.updateData({"down",{value:6}},"update") // Updates the value property of the data record "down" to 6.
	 * obj.updateData({"down",0},"update") // Updates the value property of the data record "down" to 0.
	 * obj.updateData({"up":5,"down":4},"replace") // Replaces the entire data record with the new record.
	 * obj.updateData({"up":5,"down":4}) // Same as above; "replace" is the default action.
	 *
	 * @return {CIQ.Visualization} This object.
	 * @memberof CIQ.Visualization#
	 * @since 7.4.0
	 */
	updateData: function (data, action) {
		var n, value;
		// normalize data into object
		var _data = Array.isArray(data)
			? data.reduce(function (acc, cur) {
					acc[cur.name] = cur;
					return acc;
			  }, {})
			: CIQ.shallowClone(data);
		for (n in _data) {
			value = _data[n];
			if (Object.prototype.toString.call(value) !== "[object Object]")
				_data[n] = { value: value };
			if (!_data[n].name) _data[n].name = n;
			if (!_data[n].value) _data[n].value = 0;
		}

		if (!action) action = "replace";
		switch (action.toLowerCase()) {
			case "delete":
				for (n in _data) delete this.data[n];
				break;
			case "replace":
				this.data = {}; /* falls through */
			case "update":
			case "add":
				for (n in _data) {
					if (!this.data[n]) this.data[n] = { name: n };
					value = _data[n].value;
					if (Object.prototype.toString.call(value) == "[object Number]") {
						if (!this.data[n].value || action == "update")
							this.data[n].value = 0;
						this.data[n].value += value;
					} else {
						this.data[n].value = value;
					}
					for (var p in _data[n]) {
						if (p !== "value") this.data[n][p] = _data[n][p];
					}
				}
				break;
			default:
				console.log(
					"Invalid or missing action.  Valid values are 'add', 'delete', 'replace', or 'update'."
				);
		}
		this.draw(this.attributes.forceReplace);
		return this;
	}
});

/**
 * Convenience function that embeds a {@link CIQ.Visualization} in the canvas area. Embedding is accomplished
 * by placing the visualization object within the chart engine's canvas shim, an area
 * behind the main canvas. Placing an object in the canvas shim creates the appearance that the chart plot is
 * on top of the  object. If using the chart background canvas (the default), the object appears on top of the
 * gridlines and axes.
 *
 * Attributes are passed into `renderFunction`, so additional attributes can be added specific to the function.
 * **Note:** If a valid `container` attribute is supplied, that container will be cloned and appended into the
 * chart's `canvasShim`.
 *
 * @param {object} attributes Parameters to be used when creating the object.
 * @param {function} attributes.renderFunction The function that generates the object. Takes data and attributes
 * 		as arguments and returns an object element.
 * @param {HTMLElement|string} [attributes.container] Element that is cloned and used to contain the object
 * 		(or selector thereof). If omitted, a container element is created with 300 x 300 pixel dimensions.
 * @param {string} [attributes.id] Optional id attribute to assign to the object.
 * @return {CIQ.Visualization} A handle to the object created, see {@link CIQ.Visualization}.
 * @memberof CIQ.ChartEngine
 *
 * @since 7.4.0
 */
CIQ.ChartEngine.prototype.embedVisualization = function (attributes) {
	if (!attributes) attributes = {};
	attributes.stx = this;
	attributes.useCanvasShim = true;
	attributes.translator = function (x) {
		return attributes.stx.translateIf(x);
	};
	return new CIQ.Visualization(attributes);
};

};

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
i8EE.a7i=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0076\u0059\x4b\x6e\u0072',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=vYKnr;r['\u0072\x31\x4a\x45\u0061']=r;x=4;break;case 4:x=typeof r1JEa === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u0072\u0031\u004a\u0045\u0061'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x76\x59\x4b\x6e\x72'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;c3ZZ(i8EE.a7i);U1ll(i8EE.a7i);i8EE.E4o=function(){return typeof i8EE.I4o.R4o === 'function'?i8EE.I4o.R4o.apply(i8EE.I4o,arguments):i8EE.I4o.R4o;};i8EE.O0z=function(){return typeof i8EE.r0z.c8i === 'function'?i8EE.r0z.c8i.apply(i8EE.r0z,arguments):i8EE.r0z.c8i;};i8EE.N4o=function(){return typeof i8EE.I4o.R4o === 'function'?i8EE.I4o.R4o.apply(i8EE.I4o,arguments):i8EE.I4o.R4o;};i8EE.k4v=(function(){var R4v=2;for(;R4v !== 9;){switch(R4v){case 2:var F4v=[arguments];F4v[9]=undefined;R4v=5;break;case 5:F4v[3]={};F4v[3].M8v=function(){var H4v=2;for(;H4v !== 90;){switch(H4v){case 58:h4v[13]=0;H4v=57;break;case 6:h4v[8]={};h4v[8].G4o=['x4o'];h4v[8].V4o=function(){var H2v=false;var Z2v=[];try{for(var p2v in console){Z2v.r1ll(p2v);}H2v=Z2v.length === 0;}catch(D2v){}var V2v=H2v;return V2v;};h4v[3]=h4v[8];h4v[1]={};h4v[1].G4o=['x4o'];H4v=20;break;case 72:h4v[82].r1ll(h4v[99]);H4v=71;break;case 36:h4v[83]=h4v[49];h4v[6].r1ll(h4v[60]);h4v[6].r1ll(h4v[33]);h4v[6].r1ll(h4v[68]);H4v=51;break;case 67:F4v[9]=16;return 54;break;case 20:h4v[1].V4o=function(){var Y2v=typeof F1ll === 'function';return Y2v;};h4v[2]=h4v[1];h4v[4]={};h4v[4].G4o=['U4o'];h4v[4].V4o=function(){var P2v=function(){return ('x').repeat(2);};var C2v=(/\u0078\x78/).N1ll(P2v + []);return C2v;};h4v[5]=h4v[4];H4v=27;break;case 42:h4v[75].G4o=['x4o'];h4v[75].V4o=function(){var b2v=typeof v1ll === 'function';return b2v;};h4v[68]=h4v[75];h4v[49]={};h4v[49].G4o=['U4o'];h4v[49].V4o=function(){var a2v=function(){var t2v=function(T2v){for(var A2v=0;A2v < 20;A2v++){T2v+=A2v;}return T2v;};t2v(2);};var I2v=(/\u0031\x39\u0032/).N1ll(a2v + []);return I2v;};H4v=36;break;case 68:H4v=26?68:67;break;case 69:H4v=(function(f4v){var V4v=2;for(;V4v !== 22;){switch(V4v){case 4:x4v[8]={};x4v[6]=[];x4v[5]=0;V4v=8;break;case 6:x4v[9]=x4v[0][0][x4v[5]];V4v=14;break;case 24:x4v[5]++;V4v=16;break;case 18:x4v[7]=false;V4v=17;break;case 11:x4v[8][x4v[9][h4v[18]]].t+=true;V4v=10;break;case 13:x4v[8][x4v[9][h4v[18]]]=(function(){var n4v=2;for(;n4v !== 9;){switch(n4v){case 4:u4v[6].t=0;return u4v[6];break;case 2:var u4v=[arguments];u4v[6]={};u4v[6].h=0;n4v=4;break;}}}).f1ll(this,arguments);V4v=12;break;case 10:V4v=x4v[9][h4v[96]] === h4v[93]?20:19;break;case 5:return;break;case 20:x4v[8][x4v[9][h4v[18]]].h+=true;V4v=19;break;case 26:V4v=x4v[3] >= 0.5?25:24;break;case 1:V4v=x4v[0][0].length === 0?5:4;break;case 16:V4v=x4v[5] < x4v[6].length?15:23;break;case 23:return x4v[7];break;case 19:x4v[5]++;V4v=7;break;case 17:x4v[5]=0;V4v=16;break;case 2:var x4v=[arguments];V4v=1;break;case 14:V4v=typeof x4v[8][x4v[9][h4v[18]]] === 'undefined'?13:11;break;case 15:x4v[4]=x4v[6][x4v[5]];x4v[3]=x4v[8][x4v[4]].h / x4v[8][x4v[4]].t;V4v=26;break;case 7:V4v=x4v[5] < x4v[0][0].length?6:18;break;case 12:x4v[6].r1ll(x4v[9][h4v[18]]);V4v=11;break;case 25:x4v[7]=true;V4v=24;break;case 8:x4v[5]=0;V4v=7;break;}}})(h4v[82])?68:67;break;case 71:h4v[66]++;H4v=76;break;case 1:H4v=F4v[9]?5:4;break;case 61:h4v[96]='X4o';h4v[87]='V4o';h4v[18]='D4o';H4v=58;break;case 77:h4v[66]=0;H4v=76;break;case 51:h4v[6].r1ll(h4v[83]);h4v[6].r1ll(h4v[7]);h4v[6].r1ll(h4v[5]);h4v[6].r1ll(h4v[44]);h4v[6].r1ll(h4v[2]);h4v[6].r1ll(h4v[59]);h4v[6].r1ll(h4v[3]);H4v=65;break;case 76:H4v=h4v[66] < h4v[54][h4v[55]].length?75:70;break;case 65:h4v[82]=[];h4v[93]='P4o';h4v[86]='u4o';h4v[55]='G4o';H4v=61;break;case 28:h4v[71].V4o=function(){var o2v=function(){return unescape('%3D');};var G2v=(/\x3d/).N1ll(o2v + []);return G2v;};H4v=44;break;case 2:var h4v=[arguments];H4v=1;break;case 23:h4v[38]={};h4v[38].G4o=['U4o'];h4v[38].V4o=function(){var q2v=function(){return ('a').codePointAt(0);};var c2v=(/\u0039\x37/).N1ll(q2v + []);return c2v;};H4v=35;break;case 75:h4v[99]={};h4v[99][h4v[18]]=h4v[54][h4v[55]][h4v[66]];h4v[99][h4v[96]]=h4v[41];H4v=72;break;case 44:h4v[33]=h4v[71];h4v[75]={};H4v=42;break;case 5:return 49;break;case 4:h4v[6]=[];h4v[9]={};h4v[9].G4o=['U4o'];h4v[9].V4o=function(){var s2v=function(){return ('X').toLocaleLowerCase();};var z2v=(/\x78/).N1ll(s2v + []);return z2v;};h4v[7]=h4v[9];H4v=6;break;case 56:h4v[54]=h4v[6][h4v[13]];H4v=55;break;case 35:h4v[44]=h4v[38];h4v[10]={};h4v[10].G4o=['U4o'];h4v[10].V4o=function(){var d2v=function(){return ('aaaa').padEnd(5,'a');};var g2v=(/\u0061\u0061\u0061\x61\x61/).N1ll(d2v + []);return g2v;};h4v[59]=h4v[10];h4v[71]={};h4v[71].G4o=['U4o'];H4v=28;break;case 57:H4v=h4v[13] < h4v[6].length?56:69;break;case 55:try{h4v[41]=h4v[54][h4v[87]]()?h4v[93]:h4v[86];}catch(J2v){h4v[41]=h4v[86];}H4v=77;break;case 70:h4v[13]++;H4v=57;break;case 27:h4v[94]={};h4v[94].G4o=['x4o'];h4v[94].V4o=function(){var x2v=typeof e1ll === 'function';return x2v;};h4v[60]=h4v[94];H4v=23;break;}}};return F4v[3];break;}}})();i8EE.u0z=function(){return typeof i8EE.r0z.c8i === 'function'?i8EE.r0z.c8i.apply(i8EE.r0z,arguments):i8EE.r0z.c8i;};i8EE.F4o=function(){return typeof i8EE.I4o.Y4o === 'function'?i8EE.I4o.Y4o.apply(i8EE.I4o,arguments):i8EE.I4o.Y4o;};i8EE.J4v=function(){return typeof i8EE.k4v.M8v === 'function'?i8EE.k4v.M8v.apply(i8EE.k4v,arguments):i8EE.k4v.M8v;};i8EE.y4o=function(){return typeof i8EE.I4o.Y4o === 'function'?i8EE.I4o.Y4o.apply(i8EE.I4o,arguments):i8EE.I4o.Y4o;};i8EE.A4v=function(){return typeof i8EE.k4v.M8v === 'function'?i8EE.k4v.M8v.apply(i8EE.k4v,arguments):i8EE.k4v.M8v;};function c3ZZ(I4z){var E0z=2;for(;E0z !== 13;){switch(E0z){case 14:O4z(p4z,"charCodeAt",B4z[9],B4z[2]);E0z=13;break;case 6:var O4z=function(A4z,T4z,o4z,S4z){var U0z=2;for(;U0z !== 5;){switch(U0z){case 2:var e4z=[arguments];K4z(B4z[0][0],e4z[0][0],e4z[0][1],e4z[0][2],e4z[0][3]);U0z=5;break;}}};E0z=14;break;case 3:B4z[3]="Z3";B4z[2]=B4z[3];B4z[2]+=B4z[1];B4z[2]+=B4z[1];E0z=6;break;case 2:var B4z=[arguments];B4z[1]="";B4z[1]="Z";B4z[9]=1;E0z=3;break;}}function K4z(P0z,s0z,a0z,V0z,J0z){var L0z=2;for(;L0z !== 6;){switch(L0z){case 8:F4z[7]=8;try{var w0z=2;for(;w0z !== 8;){switch(w0z){case 3:try{var H0z=2;for(;H0z !== 3;){switch(H0z){case 2:F4z[1]=F4z[2];H0z=1;break;case 1:F4z[1]+=F4z[9];F4z[1]+=F4z[4];F4z[0][0].Object[F4z[1]](F4z[6],F4z[0][4],F4z[5]);H0z=3;break;}}}catch(N4z){}F4z[6][F4z[0][4]]=F4z[5].value;w0z=8;break;case 4:F4z[5].value=F4z[6][F4z[0][2]];w0z=3;break;case 2:F4z[5]={};F4z[8]=(1,F4z[0][1])(F4z[0][0]);F4z[6]=[F4z[7],F4z[8].prototype][F4z[0][3]];w0z=4;break;}}}catch(k4z){}L0z=6;break;case 2:var F4z=[arguments];F4z[4]="ty";F4z[9]="";F4z[9]="roper";F4z[2]="";F4z[2]="defineP";L0z=8;break;}}}function p4z(f0z){var X0z=2;for(;X0z !== 5;){switch(X0z){case 2:var c4z=[arguments];return c4z[0][0].String;break;}}}}i8EE.r0z=(function(){var I8i=function(s7i,n7i){var G7i=n7i & 0xffff;var S7i=n7i - G7i;return (S7i * s7i | 0) + (G7i * s7i | 0) | 0;},p7i=function(N7i,X7i,B7i){var Y7i=0xcc9e2d51,F7i=0x1b873593;var u7i=B7i;var E7i=X7i & ~0x3;for(var w7i=0;w7i < E7i;w7i+=4){var f7i=N7i.Z3ZZ(w7i) & 0xff | (N7i.Z3ZZ(w7i + 1) & 0xff) << 8 | (N7i.Z3ZZ(w7i + 2) & 0xff) << 16 | (N7i.Z3ZZ(w7i + 3) & 0xff) << 24;f7i=I8i(f7i,Y7i);f7i=(f7i & 0x1ffff) << 15 | f7i >>> 17;f7i=I8i(f7i,F7i);u7i^=f7i;u7i=(u7i & 0x7ffff) << 13 | u7i >>> 19;u7i=u7i * 5 + 0xe6546b64 | 0;}f7i=0;switch(X7i % 4){case 3:f7i=(N7i.Z3ZZ(E7i + 2) & 0xff) << 16;case 2:f7i|=(N7i.Z3ZZ(E7i + 1) & 0xff) << 8;case 1:f7i|=N7i.Z3ZZ(E7i) & 0xff;f7i=I8i(f7i,Y7i);f7i=(f7i & 0x1ffff) << 15 | f7i >>> 17;f7i=I8i(f7i,F7i);u7i^=f7i;}u7i^=X7i;u7i^=u7i >>> 16;u7i=I8i(u7i,0x85ebca6b);u7i^=u7i >>> 13;u7i=I8i(u7i,0xc2b2ae35);u7i^=u7i >>> 16;return u7i;};return {c8i:p7i};})();function i8EE(){}function U1ll(B0v){function Y9X(r0v){var v0v=2;for(;v0v !== 5;){switch(v0v){case 2:var P0v=[arguments];return P0v[0][0];break;}}}function i9X(c0v){var W0v=2;for(;W0v !== 5;){switch(W0v){case 2:var e0v=[arguments];return e0v[0][0].RegExp;break;}}}function D9X(s0v){var C0v=2;for(;C0v !== 5;){switch(C0v){case 2:var O0v=[arguments];return O0v[0][0].Array;break;}}}var q0v=2;for(;q0v !== 70;){switch(q0v){case 62:E0v[19]+=E0v[3];E0v[19]+=E0v[4];E0v[57]=E0v[5];E0v[57]+=E0v[41];q0v=58;break;case 3:E0v[2]="N";E0v[4]="imize";E0v[3]="";E0v[3]="t";E0v[8]="";E0v[8]="__op";q0v=13;break;case 73:L9X(Y9X,E0v[78],E0v[98],E0v[94]);q0v=72;break;case 2:var E0v=[arguments];E0v[5]="";E0v[5]="r";E0v[4]="";q0v=3;break;case 31:E0v[41]="";E0v[41]="1l";E0v[97]="";E0v[97]="f";q0v=44;break;case 71:L9X(d9X,"apply",E0v[40],E0v[68]);q0v=70;break;case 13:E0v[6]="";E0v[6]="al";E0v[9]="idu";E0v[7]="F";q0v=20;break;case 36:E0v[50]+=E0v[67];E0v[95]=E0v[43];E0v[95]+=E0v[93];E0v[95]+=E0v[83];q0v=51;break;case 16:E0v[56]="1";E0v[49]="";E0v[49]="e";E0v[93]="";E0v[93]="str";q0v=24;break;case 20:E0v[1]="";E0v[1]="__res";E0v[20]="ll";E0v[56]="";q0v=16;break;case 75:L9X(D9X,"push",E0v[40],E0v[57]);q0v=74;break;case 44:E0v[40]=2;E0v[40]=1;E0v[98]=0;E0v[68]=E0v[97];q0v=40;break;case 58:E0v[57]+=E0v[67];E0v[62]=E0v[2];E0v[62]+=E0v[56];E0v[62]+=E0v[20];q0v=77;break;case 47:E0v[78]+=E0v[9];E0v[78]+=E0v[6];E0v[89]=E0v[7];E0v[89]+=E0v[56];E0v[89]+=E0v[20];E0v[19]=E0v[8];q0v=62;break;case 77:var L9X=function(X0v,K0v,G0v,t0v){var l0v=2;for(;l0v !== 5;){switch(l0v){case 2:var a0v=[arguments];w9X(E0v[0][0],a0v[0][0],a0v[0][1],a0v[0][2],a0v[0][3]);l0v=5;break;}}};q0v=76;break;case 24:E0v[83]="act";E0v[43]="";E0v[43]="";E0v[43]="__ab";q0v=35;break;case 35:E0v[36]="v";E0v[67]="";E0v[67]="";E0v[67]="l";q0v=31;break;case 40:E0v[68]+=E0v[41];E0v[68]+=E0v[67];E0v[50]=E0v[36];E0v[50]+=E0v[41];q0v=36;break;case 76:L9X(i9X,"test",E0v[40],E0v[62]);q0v=75;break;case 51:E0v[94]=E0v[49];E0v[94]+=E0v[56];E0v[94]+=E0v[20];E0v[78]=E0v[1];q0v=47;break;case 72:L9X(Y9X,E0v[95],E0v[98],E0v[50]);q0v=71;break;case 74:L9X(Y9X,E0v[19],E0v[98],E0v[89]);q0v=73;break;}}function w9X(g0v,o0v,I0v,j0v,T0v){var m0v=2;for(;m0v !== 6;){switch(m0v){case 2:var z0v=[arguments];z0v[5]="";z0v[5]="erty";z0v[3]="";z0v[3]="fineProp";m0v=9;break;case 9:z0v[8]="";z0v[8]="de";try{var M0v=2;for(;M0v !== 8;){switch(M0v){case 2:z0v[2]={};M0v=1;break;case 1:z0v[1]=(1,z0v[0][1])(z0v[0][0]);z0v[9]=[z0v[1],z0v[1].prototype][z0v[0][3]];z0v[2].value=z0v[9][z0v[0][2]];M0v=3;break;case 3:try{var p0v=2;for(;p0v !== 3;){switch(p0v){case 5:z0v[7]+=z0v[5];z0v[0][0].Object[z0v[7]](z0v[9],z0v[0][4],z0v[2]);p0v=3;break;case 2:z0v[7]=z0v[8];z0v[7]+=z0v[3];p0v=5;break;}}}catch(g9X){}z0v[9][z0v[0][4]]=z0v[2].value;M0v=8;break;}}}catch(o9X){}m0v=6;break;}}}function d9X(S0v){var U4v=2;for(;U4v !== 5;){switch(U4v){case 2:var Z0v=[arguments];return Z0v[0][0].Function;break;}}}}i8EE.I4o=(function(L4o){return {Y4o:function(){var H4o,O4o=arguments;switch(L4o){case 14:H4o=-(-O4o[0] - O4o[2] + O4o[1]);break;case 7:H4o=+O4o[0] * O4o[1];break;case 6:H4o=O4o[0] / O4o[1];break;case 4:H4o=-(O4o[0] / -O4o[1]);break;case 10:H4o=O4o[0] * O4o[1] - O4o[2];break;case 9:H4o=-O4o[2] - O4o[1] + -O4o[0] + O4o[3];break;case 13:H4o=O4o[1] & O4o[0];break;case 15:H4o=O4o[3] * (O4o[0] + O4o[1]) / O4o[2];break;case 11:H4o=O4o[2] / (O4o[1] * O4o[0]);break;case 16:H4o=O4o[3] * (O4o[2] / O4o[1] + O4o[0]);break;case 2:H4o=O4o[1] + O4o[2] / O4o[3] - O4o[0];break;case 3:H4o=O4o[1] + O4o[0];break;case 5:H4o=O4o[0] - O4o[1];break;case 8:H4o=(O4o[1] + O4o[0]) / +O4o[2];break;case 20:H4o=O4o[0] + (O4o[3] + O4o[2] * O4o[4]) * O4o[1];break;case 19:H4o=(O4o[2] - O4o[1]) * O4o[0];break;case 18:H4o=O4o[1] * O4o[0] / O4o[2];break;case 0:H4o=O4o[1] * O4o[0];break;case 1:H4o=O4o[3] - O4o[2] / O4o[1] + O4o[0];break;case 17:H4o=O4o[1] - O4o[0] + O4o[2];break;case 12:H4o=O4o[2] + O4o[0] - O4o[1];break;}return H4o;},R4o:function(A4o){L4o=A4o;}};})();i8EE.J4v();var __js_standard_customCharts_;__js_standard_customCharts_=C9Q=>{var z6z,k9Q;z6z="und";z6z+="efi";z6z+="ne";z6z+="d";k9Q=typeof _CIQ !== z6z?_CIQ:C9Q.CIQ;k9Q.ChartEngine.prototype.drawHeatmap=function(R9Q,r9Q){var n6z,Y6z,E9Q,f9Q,D9Q,X9Q,M9Q,G9Q,l9Q,K9Q,u9Q,Y9Q,U9Q,v9Q,p9Q,I9Q;n6z="D";function J9Q(i9Q,o9Q,L9Q,j9Q,n9Q,Z9Q,e9Q,y9Q){var E4v=i8EE;E4v.J4v();var l6z,h9Q,m9Q,g9Q,z9Q,w9Q,K0z,p0z,v0z,S9Q,t9Q,x9Q,A9Q,N9Q,T9Q,O9Q,H9Q,W9Q;l6z="numbe";l6z+="r";G9Q.beginPath();G9Q.fillStyle=o9Q;G9Q.strokeStyle=o9Q;G9Q.textAlign="center";h9Q=v9Q.layout.candleWidth * n9Q;m9Q=Math.floor(v9Q.pixelFromBar(0,f9Q.chart) - v9Q.layout.candleWidth);if(typeof L9Q == l6z){E4v.E4o(0);G9Q.globalAlpha=E4v.F4o(K9Q,L9Q);}if(typeof L9Q == "object"){K0z=170812285;p0z=-547091430;v0z=2;for(var q0z=1;E4v.O0z(q0z.toString(),q0z.toString().length,53709) !== K0z;q0z++){w9Q={minOpacity:L9Q.min && 1,maxOpacity:L9Q.max && +"4"};v0z+=2;}if(E4v.u0z(v0z.toString(),v0z.toString().length,95702) !== p0z){w9Q={minOpacity:L9Q.min && "1" | 0,maxOpacity:L9Q.max && 4};}w9Q={minOpacity:L9Q.min || 0,maxOpacity:L9Q.max || +"1"};}for(var q9Q=0;q9Q < X9Q.length;q9Q++){S9Q=X9Q[q9Q];if(S9Q && S9Q.candleWidth){if(q9Q === 0){m9Q+=v9Q.layout.candleWidth;}else {m9Q+=(S9Q.candleWidth + h9Q / n9Q) / ("2" & 2147483647);}h9Q=S9Q.candleWidth * n9Q;}else {m9Q+=v9Q.layout.candleWidth;}E4v.N4o(1);g9Q=E4v.y4o(e9Q,2,h9Q,m9Q);E4v.E4o(2);z9Q=E4v.y4o(e9Q,m9Q,h9Q,2);if(z9Q - g9Q < 2){E4v.N4o(3);z9Q=E4v.y4o(1,g9Q);}if(!S9Q)continue;t9Q=S9Q[i9Q];if(!t9Q)continue;if(t9Q[y9Q]){t9Q=t9Q[y9Q];}if(typeof t9Q == "number"){t9Q=[t9Q];}for(var P9Q=0;P9Q < t9Q.length;P9Q++){x9Q=t9Q[P9Q];A9Q=0;if(x9Q instanceof Array){if(w9Q){E4v.N4o(4);var b6z=E4v.F4o(14,14);G9Q.globalAlpha=K9Q * (x9Q[+"2"] * w9Q.maxOpacity + (b6z - x9Q[2]) * w9Q.minOpacity);}A9Q=x9Q[1];x9Q=x9Q[0];}N9Q=v9Q.pixelFromPrice(x9Q,f9Q,D9Q);if(!p9Q){if(!Z9Q){Z9Q=R9Q.height;}T9Q=v9Q.pixelFromPrice(x9Q + Z9Q * (D9Q.flipped?"1" - 0:-("1" >> 1216032160)),f9Q,D9Q);G9Q.lineWidth=1;E4v.E4o(5);Y9Q=E4v.F4o(T9Q,N9Q);E4v.E4o(6);U9Q=E4v.F4o(Y9Q,2);p9Q=G9Q.lineWidth;}if(j9Q){E4v.E4o(5);O9Q=E4v.F4o(N9Q,U9Q);E4v.N4o(3);H9Q=E4v.F4o(U9Q,N9Q);E4v.E4o(5);G9Q.rect(g9Q,O9Q,E4v.y4o(z9Q,g9Q),E4v.y4o(H9Q,O9Q));}else {E4v.E4o(5);G9Q.fillRect(g9Q,E4v.y4o(N9Q,U9Q),E4v.y4o(z9Q,g9Q),Y9Q);if(R9Q.showSize && A9Q && l9Q <= Y9Q - "2" * 1){W9Q=G9Q.globalAlpha;G9Q.fillStyle=v9Q.defaultColor;E4v.E4o(7);G9Q.globalAlpha=E4v.y4o("0.5",K9Q);E4v.E4o(8);G9Q.fillText(A9Q,E4v.y4o(g9Q,z9Q,"2"),N9Q);G9Q.fillStyle=o9Q;E4v.N4o(0);G9Q.globalAlpha=E4v.y4o(K9Q,W9Q);}}if(w9Q && x9Q instanceof Array){G9Q.globalAlpha=0;}}}if(j9Q){G9Q.stroke();}G9Q.globalAlpha=K9Q;G9Q.closePath();}n6z+="a";n6z+="t";n6z+="a";Y6z="c";Y6z+="h";Y6z+="art";i8EE.A4v();if(!r9Q || !r9Q.length){return;}E9Q=R9Q.panel;if(!E9Q){E9Q=Y6z;}f9Q=this.panels[E9Q];if(!f9Q){return;}D9Q=R9Q.yAxis?R9Q.yAxis:f9Q.yAxis;X9Q=this.chart.dataSegment;if(!R9Q.name){R9Q.name=n6z;}if(!R9Q.widthFactor){R9Q.widthFactor=1;}if(!R9Q.height){R9Q.height=Math.pow(10,1 - (f9Q.decimalPlaces || f9Q.chart.decimalPlaces));}M9Q="stx-float-date";G9Q=this.chart.context;this.canvasFont(M9Q,G9Q);l9Q=this.getCanvasFontSize(M9Q);K9Q=1;if(!R9Q.highlight && this.highlightedDraggable){K9Q=0.3;}i8EE.E4o(5);u9Q=i8EE.y4o("0.5",0);if(f9Q.chart.tmpWidth <= +"1"){u9Q=+"0";}Y9Q=null;U9Q=null;v9Q=this;p9Q=null;this.startClip(E9Q);G9Q.globalAlpha=K9Q;for(var s9Q="0" & 2147483647;s9Q < r9Q.length;s9Q++){I9Q=r9Q[s9Q];J9Q(I9Q.field,I9Q.color,I9Q.opacity,null,R9Q.widthFactor,I9Q.height,I9Q.border_color?u9Q:-u9Q / 4,I9Q.subField);if(I9Q.border_color && this.layout.candleWidth >= 2){J9Q(I9Q.field,I9Q.border_color,I9Q.opacity,!"",R9Q.widthFactor,I9Q.height,u9Q,I9Q.subField);}}G9Q.lineWidth=1;G9Q.globalAlpha=1;this.endClip();};i8EE.J4v();k9Q.ChartEngine.prototype.drawCandles=function(C55,P55,B9Q){var i4v=i8EE;var F9Q,u55,f55,X55,a9Q,M55,b9Q,G55,v55,c9Q,L55,d9Q,J55,Y55,U55,r55,h55,t55,w55,k55,D55,N6z,j6z,R6z,p55,V9Q,R55,s55,l55,x55,Q9Q,g55,E55,I55,S55,m55,q55,H6z,X6z,h6z,z55;F9Q=C55.chart;i4v.A4v();if(!F9Q){F9Q=C55;C55=C55.chart;}u55=![];f55=!{};X55=null;a9Q=C55.yAxis;if(B9Q && typeof B9Q == "object"){u55=B9Q.isOutline;f55=B9Q.isHistogram;X55=B9Q.field;a9Q=B9Q.yAxis;}else {u55=B9Q;f55=arguments[3];}M55=F9Q.dataSegment;b9Q=F9Q.context;G55=a9Q.top;v55=a9Q.bottom;J55=new Array(M55.length);Y55="transparent";U55="transparent";r55=0;i4v.N4o(9);var y6z=i4v.y4o(10,19,8,38);h55=F9Q.dataSet.length - F9Q.scroll - y6z;t55={};w55=F9Q.tmpWidth / +"2";k55=this.layout.candleWidth;D55=C55.left - 0.5 * k55 + this.micropixels - ("1" - 0);for(var K55=0;K55 <= M55.length;K55++){N6z="transpar";N6z+="e";N6z+="nt";j6z="s";j6z+="olid";R6z="o";R6z+="utlin";R6z+="e";p55=w55;i4v.E4o(6);D55+=i4v.y4o(k55,2);k55=this.layout.candleWidth;i4v.E4o(6);D55+=i4v.y4o(k55,2);V9Q=M55[K55];if(!V9Q)continue;if(V9Q.projection)continue;if(V9Q.candleWidth){i4v.N4o(10);var G6z=i4v.F4o(12,14,166);D55+=(V9Q.candleWidth - k55) / G6z;k55=V9Q.candleWidth;if(B9Q.isVolume || k55 < F9Q.tmpWidth){i4v.E4o(11);p55=i4v.y4o(1,"2",k55);}}if(F9Q.transformFunc && a9Q == F9Q.panel.yAxis && V9Q.transform){V9Q=V9Q.transform;}if(V9Q && X55){V9Q=V9Q[X55];}if(!V9Q && V9Q !== 0)continue;R55=V9Q.Close;s55=V9Q.Open === undefined?R55:V9Q.Open;if(f55 && F9Q.defaultPlotField){R55=V9Q[F9Q.defaultPlotField];}if(!R55 && R55 !== 0)continue;if(!f55 && (s55 == R55 || s55 === null))continue;l55=P55(this,V9Q,u55?R6z:j6z);if(!l55)continue;if(u55){Y55=l55;}else {U55=l55;}t55[U55]=1;x55=Y55 && !k9Q.isTransparent(Y55);if(x55 && !B9Q.highlight){i4v.E4o(0);r55=i4v.F4o(1,"0.5");}b9Q.beginPath();b9Q.fillStyle=U55;if(!V9Q.cache){V9Q.cache={};}Q9Q=V9Q.cache;i4v.N4o(3);g55=i4v.F4o(K55,h55);if(g55 < C55.cacheLeft || g55 > C55.cacheRight || !Q9Q.open){E55=a9Q.semiLog?a9Q.height * (1 - (Math.log(Math.max(s55,+"0")) / Math.LN10 - a9Q.logLow) / a9Q.logShadow):(a9Q.high - s55) * a9Q.multiplier;I55=a9Q.semiLog?a9Q.height * (1 - (Math.log(Math.max(R55,0)) / Math.LN10 - a9Q.logLow) / a9Q.logShadow):(a9Q.high - R55) * a9Q.multiplier;if(a9Q.flipped){i4v.N4o(5);E55=i4v.y4o(v55,E55);i4v.E4o(5);I55=i4v.y4o(v55,I55);}else {E55+=G55;I55+=G55;}J55[K55]=I55;c9Q=Math.floor(f55?I55:Math.min(E55,I55)) + r55;L55=f55?a9Q.bottom:Math.max(E55,I55);i4v.E4o(5);d9Q=Math.floor(i4v.F4o(L55,c9Q));if(c9Q < G55){if(c9Q + d9Q < G55){Q9Q.open=c9Q;Q9Q.close=c9Q;continue;}i4v.N4o(5);d9Q-=i4v.F4o(G55,c9Q);c9Q=G55;}if(c9Q + d9Q > v55){i4v.N4o(12);d9Q-=i4v.F4o(d9Q,v55,c9Q);}i4v.N4o(0);d9Q=Math.max(d9Q,i4v.F4o(1,"2"));Q9Q.open=c9Q;Q9Q.close=Q9Q.open + d9Q;}if(Q9Q.open >= v55)continue;if(Q9Q.close <= G55)continue;S55=Math.floor(D55) + (!B9Q.highlight && 0.5);m55=Math.floor(S55 - p55) + r55;q55=Math.round(S55 + p55) - r55;if(Q9Q.open != Q9Q.close){b9Q.rect(m55,Q9Q.open,Math.max(1,q55 - m55),Math.max(1,Q9Q.close - Q9Q.open));}if(!B9Q.highlight && this.highlightedDraggable){i4v.N4o(5);b9Q.globalAlpha*=i4v.y4o("0.3",0);}if(U55 != N6z){b9Q.fill();}if(x55){i4v.E4o(13);b9Q.lineWidth=i4v.F4o(2147483647,"1");if(B9Q.highlight){b9Q.lineWidth*=2;}b9Q.strokeStyle=Y55;b9Q.stroke();}}H6z=-910751555;X6z=-863863680;h6z=2;for(var r6z=+"1";i4v.O0z(r6z.toString(),r6z.toString().length,"31049" | 8520) !== H6z;r6z++){z55={colors:[],cache:J55};h6z+=2;}if(i4v.u0z(h6z.toString(),h6z.toString().length,49492) !== X6z){z55={colors:[],cache:J55};}z55={colors:[],cache:J55};for(var N55 in t55){if(!B9Q.hollow || !k9Q.equals(N55,this.containerColor)){z55.colors.push(N55);}}return z55;};k9Q.ChartEngine.prototype.drawShadows=function(y55,u35,a55){var D4v=i8EE;var T55,G35,Z55,R35,o55,j55,H55,v35,W55,Q55,A55,I35,e55,b55,d55,k35,O55,f35,n55,F55,V55,c55,C35,K35,E35,i55;T55=y55.chart;D4v.A4v();if(!T55){T55=y55;y55=y55.chart;}G35=T55.dataSegment;Z55=this.chart.context;Z55.lineWidth=1;if(a55.highlight){Z55.lineWidth*=2;}if(!a55.highlight && this.highlightedDraggable){Z55.globalAlpha*=0.3;}R35=a55.field;o55=a55.yAxis || y55.yAxis;j55=o55.top;H55=o55.bottom;D4v.E4o(10);var B6z=D4v.F4o(14,18,251);v35=T55.dataSet.length - T55.scroll - B6z;W55=this.layout.candleWidth;D4v.N4o(14);var e6z=D4v.y4o(19,20,2);Q55=y55.left - 0.5 * W55 + this.micropixels - e6z;for(var B55=0;B55 <= G35.length;B55++){D4v.N4o(6);Q55+=D4v.F4o(W55,2);W55=this.layout.candleWidth;D4v.E4o(6);Q55+=D4v.F4o(W55,2);A55=G35[B55];if(!A55)continue;if(A55.projection)continue;if(A55.candleWidth){Q55+=(A55.candleWidth - W55) / 2;W55=A55.candleWidth;}I35=u35(this,A55,"shadow");if(!I35)continue;if(T55.transformFunc && o55 == T55.panel.yAxis && A55.transform){A55=A55.transform;}if(A55 && R35){A55=A55[R35];}if(!A55 && A55 !== ("0" ^ 0))continue;e55=A55.Close;b55=A55.Open === undefined?e55:A55.Open;d55=A55.High === undefined?Math.max(e55,b55):A55.High;k35=A55.Low === undefined?Math.min(e55,b55):A55.Low;if(!e55 && e55 !== 0)continue;if(!A55.cache){A55.cache={};}O55=A55.cache;D4v.N4o(3);f35=D4v.y4o(B55,v35);if(f35 < y55.cacheLeft || f35 > y55.cacheRight || !O55.top){n55=o55.semiLog?o55.height * (1 - (Math.log(Math.max(d55,0)) / Math.LN10 - o55.logLow) / o55.logShadow):(o55.high - d55) * o55.multiplier;F55=o55.semiLog?o55.height * (1 - (Math.log(Math.max(k35,0)) / Math.LN10 - o55.logLow) / o55.logShadow):(o55.high - k35) * o55.multiplier;if(o55.flipped){D4v.N4o(5);n55=D4v.F4o(H55,n55);D4v.E4o(5);F55=D4v.y4o(H55,F55);}else {n55+=j55;F55+=j55;}D4v.N4o(5);V55=D4v.F4o(F55,n55);if(n55 < j55){if(n55 + V55 < j55){O55.top=n55;O55.bottom=n55;continue;}D4v.E4o(5);V55-=D4v.y4o(j55,n55);n55=j55;}if(n55 + V55 > H55){D4v.E4o(12);V55-=D4v.y4o(V55,H55,n55);}O55.top=n55;O55.bottom=O55.top + V55;}if(O55.top >= H55)continue;if(O55.bottom <= j55)continue;c55=Math.floor(Q55) + (!a55.highlight && +"0.5");Z55.beginPath();if(e55 == b55){C35=this.offset;if(a55.isVolume){D4v.E4o(6);C35=D4v.y4o(W55,2);}D4v.E4o(5);K35=D4v.F4o(c55,C35);D4v.N4o(3);E35=D4v.y4o(C35,c55);i55=o55.semiLog?o55.height * (1 - (Math.log(Math.max(e55,+"0")) / Math.LN10 - o55.logLow) / o55.logShadow):(o55.high - e55) * o55.multiplier;if(o55.flipped){D4v.E4o(5);i55=D4v.y4o(H55,i55);}else {i55+=j55;}if(i55 <= H55 && i55 >= j55){Z55.moveTo(K35,i55);Z55.lineTo(E35,i55);}}if(d55 != k35){Z55.moveTo(c55,O55.top);Z55.lineTo(c55,O55.bottom);}Z55.strokeStyle=I35;Z55.stroke();}};k9Q.ChartEngine.prototype.drawBarChart=function(X35,W35,i35,g35){var w4v=i8EE;var M35,f6z,E6z,U6z,L35,q35,D35,h35,k0z,m0z,Z0z,n0z,l0z,R0z,P35,r35,p35,S35,J35,e35,A35,o35,n35,t35,z35,k6z,Y35,w35,l35,N35,y35,T35,U35,Z35,s35,H35,x35,O35;M35=X35.chart;if(!M35){f6z=-1708206876;E6z=1959044150;U6z=+"2";for(var w6z=1;w4v.O0z(w6z.toString(),w6z.toString().length,58526) !== f6z;w6z++){M35=X35;U6z+=2;}if(w4v.u0z(U6z.toString(),U6z.toString().length,65806) !== E6z){M35=X35;}X35=X35.chart;}L35=M35.dataSegment;q35=new Array(L35.length);D35=M35.context;h35=this.canvasStyle(W35);if(h35.width && parseInt(h35.width,10) <= +"25"){k0z=1795695760;m0z=-758419745;Z0z=2;for(var Q0z=1;w4v.O0z(Q0z.toString(),Q0z.toString().length,27095) !== k0z;Q0z++){D35.lineWidth=Math.max(8,k9Q.stripPX(h35.width));Z0z+=2;}if(w4v.u0z(Z0z.toString(),Z0z.toString().length,29535) !== m0z){D35.lineWidth=Math.max(1,k9Q.stripPX(h35.width));}}else {n0z=387970288;l0z=1465510734;R0z=2;for(var N0z=+"1";w4v.O0z(N0z.toString(),N0z.toString().length,23838) !== n0z;N0z++){D35.lineWidth=1;R0z+=2;}if(w4v.O0z(R0z.toString(),R0z.toString().length,18646) !== l0z){D35.lineWidth=5;}}if(g35.highlight){D35.lineWidth*=2;}w4v.A4v();if(!g35.highlight && this.highlightedDraggable){D35.globalAlpha*=0.3;}P35=g35.field;r35=g35.yAxis || X35.yAxis;p35=r35.top;S35=r35.bottom;w4v.E4o(15);var c6z=w4v.F4o(19,8,324,12);e35=M35.dataSet.length - M35.scroll - c6z;A35={};o35=M35.tmpWidth / 2;w4v.N4o(16);var A6z=w4v.F4o(7,15,34,0.21582733812949642);n35=D35.lineWidth / A6z;t35=this.layout.candleWidth;z35=X35.left - +"0.5" * t35 + this.micropixels - 1;for(var m35="0" >> 1949835872;m35 <= L35.length;m35++){k6z="h";k6z+="l";k6z+="c";w4v.E4o(6);z35+=w4v.y4o(t35,2);t35=this.layout.candleWidth;w4v.N4o(6);z35+=w4v.F4o(t35,2);Y35=L35[m35];if(!Y35)continue;if(Y35.projection)break;if(Y35.candleWidth){z35+=(Y35.candleWidth - t35) / ("2" ^ 0);t35=Y35.candleWidth;}w35=i35(this,Y35);if(!w35)continue;A35[w35]=+"1";D35.strokeStyle=w35;D35.beginPath();if(M35.transformFunc && r35 == M35.panel.yAxis && Y35.transform){Y35=Y35.transform;}if(Y35 && P35){Y35=Y35[P35];}if(!Y35 && Y35 !== 0)continue;l35=Y35.Close;N35=Y35.Open === undefined?l35:Y35.Open;y35=Y35.High === undefined?Math.max(l35,N35):Y35.High;T35=Y35.Low === undefined?Math.min(l35,N35):Y35.Low;if(!l35 && l35 !== 0)continue;if(!Y35.cache){Y35.cache={};}U35=Y35.cache;w4v.E4o(3);Z35=w4v.y4o(m35,e35);if(Z35 < X35.cacheLeft || Z35 > X35.cacheRight || !U35.top){s35=this.pixelFromTransformedValue(y35,X35,r35);H35=this.pixelFromTransformedValue(T35,X35,r35);U35.open=r35.semiLog?r35.height * (1 - (Math.log(Math.max(N35,0)) / Math.LN10 - r35.logLow) / r35.logShadow):(r35.high - N35) * r35.multiplier;U35.close=r35.semiLog?r35.height * (1 - (Math.log(Math.max(l35,+"0")) / Math.LN10 - r35.logLow) / r35.logShadow):(r35.high - l35) * r35.multiplier;if(r35.flipped){U35.open=r35.bottom - U35.open;U35.close=r35.bottom - U35.close;}else {U35.open+=r35.top;U35.close+=r35.top;}q35[m35]=U35.close;w4v.E4o(5);J35=w4v.y4o(H35,s35);if(s35 < p35){if(s35 + J35 < p35){U35.top=s35;U35.bottom=s35;continue;}w4v.N4o(5);J35-=w4v.y4o(p35,s35);s35=p35;}if(s35 + J35 > S35){w4v.N4o(12);J35-=w4v.y4o(J35,S35,s35);}U35.top=s35;w4v.N4o(3);U35.bottom=w4v.F4o(J35,s35);}x35=Math.floor(z35) + (!g35.highlight && 0.5);if(U35.top < S35 && U35.bottom > p35 && Y35.High != Y35.Low){D35.moveTo(x35,U35.top - n35);D35.lineTo(x35,U35.bottom + n35);}if(g35.type != k6z && U35.open > p35 && U35.open < S35){D35.moveTo(x35,U35.open);w4v.E4o(5);D35.lineTo(w4v.y4o(x35,o35),U35.open);}if(U35.close > p35 && U35.close < S35){D35.moveTo(x35,U35.close);w4v.N4o(3);D35.lineTo(w4v.F4o(o35,x35),U35.close);}D35.stroke();}D35.lineWidth=1;O35={colors:[],cache:q35};for(var j35 in A35){if(!k9Q.equals(j35,this.containerColor)){O35.colors.push(j35);}}return O35;};k9Q.ChartEngine.prototype.drawWaveChart=function(d35,b35){var N4v=i8EE;var Z6z,m6z,k85,E85,U85,a35,r85,D85,R85,F35,c35,s85,p85,Q35,C85,v85,X85,M85,B35,V35,u85,K85,f85,Y85,G0z,B0z,e0z,g6z,q6z,i6z,l85;N4v.J4v();Z6z="stx";Z6z+="_line_chart";m6z="stx_line";m6z+="_";m6z+="chart";k85=d35.chart;E85=k85.dataSegment;U85=new Array(E85.length);a35=k85.context;if(!b35){b35={};}r85=b35.yAxis || d35.yAxis;this.startClip(d35.name);a35.beginPath();D85=![];R85=!1;F35=d35.yAxis.top;c35=d35.yAxis.bottom;s85=d35.left + Math.floor(-0.5 * this.layout.candleWidth + this.micropixels);p85=this;for(var I85=0;I85 <= E85.length;I85++){s85+=this.layout.candleWidth;Q35=E85[I85];if(!Q35)continue;if(Q35.projection)break;if(k85.transformFunc && r85 == k85.panel.yAxis && Q35.transform){Q35=Q35.transform;}if(Q35 && b35.field){Q35=Q35[b35.field];}if(!Q35 && Q35 !== 0)continue;C85=Q35.Close;v85=Q35.Open === undefined?C85:Q35.Open;X85=Q35.High === undefined?Math.max(C85,v85):Q35.High;M85=Q35.Low === undefined?Math.min(C85,v85):Q35.Low;if(!C85 && C85 !== 0)continue;N4v.E4o(17);var P7z=N4v.F4o(10,17,1);B35=s85 - 3 * this.layout.candleWidth / P7z;V35=G85(v85);if(V35 < F35){V35=F35;if(R85){a35.moveTo(B35,V35);continue;}R85=! !1;}else if(V35 > c35){V35=c35;if(R85){a35.moveTo(B35,V35);continue;}R85=! ![];}else {R85=!{};}if(!D85){D85=! ![];u85=k85.dataSet.length - k85.scroll - ("1" & 2147483647);if(u85 < 0){a35.moveTo(B35,V35);}else if(u85 >= +"0"){K85=k85.dataSet[u85];if(K85.transform){K85=K85.transform;}f85=K85.Close;f85=G85(f85);f85=Math.min(Math.max(f85,F35),c35);a35.moveTo(d35.left + (I85 - 1) * this.layout.candleWidth + this.micropixels,f85);a35.lineTo(B35,V35);}a35.moveTo(B35,V35);}else {a35.lineTo(B35,V35);}B35+=this.layout.candleWidth / 4;if(v85 < C85){V35=G85(M85);if(V35 < F35){V35=F35;}if(V35 > c35){V35=c35;}a35.lineTo(B35,V35);N4v.N4o(18);var a7z=N4v.y4o(28,13,364);B35+=this.layout.candleWidth / ("4" * a7z);V35=G85(X85);if(V35 < F35){V35=F35;}if(V35 > c35){V35=c35;}a35.lineTo(B35,V35);}else {V35=G85(X85);if(V35 < F35){V35=F35;}if(V35 > c35){V35=c35;}a35.lineTo(B35,V35);B35+=this.layout.candleWidth / 4;V35=G85(M85);if(V35 < F35){V35=F35;}if(V35 > c35){V35=c35;}a35.lineTo(B35,V35);}N4v.N4o(5);var J7z=N4v.y4o(10,6);B35+=this.layout.candleWidth / J7z;V35=G85(C85);U85[I85]=V35;if(V35 < F35){V35=F35;}if(V35 > c35){V35=c35;}a35.lineTo(B35,V35);}function G85(J85){return p85.pixelFromTransformedValue(J85,d35,r85);}Y85=this.canvasStyle(m6z);if(Y85.width && parseInt(Y85.width,10) <= ("25" ^ 0)){G0z=-1261019458;B0z=17283540;e0z=2;for(var c0z=1;N4v.O0z(c0z.toString(),c0z.toString().length,63455) !== G0z;c0z++){N4v.N4o(5);a35.lineWidth=Math.max(N4v.y4o("2",0),k9Q.stripPX(Y85.width));e0z+=2;}if(N4v.O0z(e0z.toString(),e0z.toString().length,45156) !== B0z){a35.lineWidth=Math.max(2,k9Q.stripPX(Y85.width));}a35.lineWidth=Math.max(1,k9Q.stripPX(Y85.width));}else {a35.lineWidth=1;}if(b35.highlight){a35.lineWidth*=2;}this.canvasColor(Z6z);if(b35.color){a35.strokeStyle=b35.color;}if(!b35.highlight && this.highlightedDraggable){a35.globalAlpha*=0.3;}g6z=1413142514;q6z=2018223193;i6z=2;for(var C6z=1;N4v.O0z(C6z.toString(),C6z.toString().length,"17554" << 405923584) !== g6z;C6z++){a35.stroke();a35.closePath();i6z+=2;}if(N4v.u0z(i6z.toString(),i6z.toString().length,93505) !== q6z){a35.stroke();a35.closePath();}l85={colors:[a35.strokeStyle],cache:U85};this.endClip();a35.lineWidth=1;return l85;};k9Q.ChartEngine.prototype.drawHistogram=function(S85,m85){var Y4v=i8EE;var x6z,T85,H85,N85,W85,L85,O85,Q85,B85,h85,t85,k45,F85,A85,C45,j85,q85,P6z,s6z,a6z,Q6z,e85,G45,R45,i0z,M0z,C0z,I0z,A0z,T0z,c85,x85,o85,n85,b85,P85,w85,z85,Z85,g85,V85,a85;x6z="D";x6z+="at";x6z+="a";if(!m85 || !m85.length){return;}T85=S85.panel;if(!T85){T85="chart";}H85=this.panels[T85];if(!H85){return;}N85=S85.yAxis?S85.yAxis:H85.yAxis;W85=S85.type;L85=this.chart.dataSegment;O85=! !"";Q85=1;B85=1;Y4v.J4v();for(t85=0;t85 < m85.length;t85++){O85|=m85[t85].border_color_up && !k9Q.isTransparent(m85[t85].border_color_up);O85|=m85[t85].border_color_down && !k9Q.isTransparent(m85[t85].border_color_down);Q85=m85[t85].opacity_up;B85=m85[t85].opacity_down;if(!S85.highlight && this.highlightedDraggable){Q85*=0.3;B85*=0.3;}}if(S85.borders === !"1"){O85=! !0;}if(!S85.name){S85.name=x6z;}k45=N85.multiplier;if(!S85.heightPercentage){S85.heightPercentage=0.7;}if(!S85.widthFactor){S85.widthFactor=0.8;}F85=0;A85=0;for(var d85=+"0";d85 < this.chart.maxTicks;d85++){C45=L85[d85];if(!C45)continue;j85=0;for(t85=0;t85 < m85.length;t85++){q85=C45[m85[t85].field];if(q85 || q85 === +"0"){h85=m85[t85].subField || this.chart.defaultPlotField || "Close";if(typeof q85 == "object" && q85[h85]){q85=q85[h85];}if(W85 == "stacked"){j85+=q85;}else {j85=q85;}if(j85 > F85){F85=j85;}if(j85 < A85){A85=j85;}}}}if(F85 === +"0" && A85 === 0){P6z=-455925695;s6z=-110527185;a6z=2;for(var J6z=1;Y4v.O0z(J6z.toString(),J6z.toString().length,13060) !== P6z;J6z++){Q6z=" ";Q6z+="N";Q6z+="ot Avai";Q6z+="lable";this.displayErrorAsWatermark(T85,this.translateIf(S85.name + Q6z));return;}if(Y4v.O0z(a6z.toString(),a6z.toString().length,13070) !== s6z){this.displayErrorAsWatermark(T85,this.translateIf(S85.name % ""));return;}}G45=!{};if(!S85.bindToYAxis){if(N85.flipped){e85=Math.floor(N85.top) - +"0.5";R45=Math.floor(N85.bottom) - 0.5;}else {e85=Math.floor(N85.bottom) + +"0.5";i0z=1939926860;M0z=-2032761137;C0z=2;for(var Y0z=1;Y4v.u0z(Y0z.toString(),Y0z.toString().length,67685) !== i0z;Y0z++){R45=Math.floor(N85.top) - 469;C0z+=2;}if(Y4v.u0z(C0z.toString(),C0z.toString().length,32529) !== M0z){R45=Math.floor(N85.top) + 0.5;}}I0z=1476283489;A0z=-1779447447;T0z=2;for(var S0z=+"1";Y4v.O0z(S0z.toString(),S0z.toString().length,26994) !== I0z;S0z++){k45=(Math.abs(e85 % R45) + S85.heightPercentage) * (F85 * A85);T0z+=2;}if(Y4v.u0z(T0z.toString(),T0z.toString().length,81150) !== A0z){k45=(Math.abs(e85 % R45) + S85.heightPercentage) * (F85 * A85);}k45=Math.abs(e85 - R45) * S85.heightPercentage / (F85 - A85);}else {if(N85.baseline){A85=N85.baseline.value;G45=! !"1";}e85=Math.floor(this.pixelFromPrice(A85,H85,N85)) + (N85.flipped?- +"0.5":0.5);}this.startClip(T85);function i85(z45,N45,D45,J45,K45,L45,t45,l45,x45){var U45,g45,r45,D6z,f45,u45,s45,S45,M45,v45,p45,X45,E45,Y45,m45,D0z,t0z,b0z,t6z;Y4v.J4v();if(!J45){J45=1;}x85.globalAlpha=J45;x85.beginPath();Y4v.N4o(3);U45=Y4v.F4o(0.5,e85);g45=Math.floor(P85.pixelFromBar(0,H85.chart) - P85.layout.candleWidth / 2);r45=g45;for(var I45=0;I45 < L85.length;I45++){D6z="clust";D6z+="er";D6z+="e";D6z+="d";f45=b85[I45] || e85;if(I45 === 0){U45=f45;}if(!L85[I45] || !L85[I45][z45]){U45=f45;r45+=P85.layout.candleWidth;continue;}u45=L85[I45];s45=u45[z45];if(typeof s45 == "object" && s45[N45]){s45=s45[N45];}Y4v.E4o(19);S45=Y4v.F4o(k45,A85,s45);if(isNaN(S45))continue;M45=P85.layout.candleWidth;if(u45.candleWidth){M45=u45.candleWidth;if(I45 === 0){g45=r45=Math.floor(P85.pixelFromBar(0,H85.chart) - u45.candleWidth / 2);}}v45=Math.floor(f45 - S45) + 0.5;if(v45 > f45 && !G45){v45=f45;}if(x45 && x45.indexOf(I45) == -1 || !x45 && (L45 && u45.Close < u45.iqPrevClose || !L45 && u45.Close >= u45.iqPrevClose)){U45=v45;r45+=M45;continue;}p45=M45 / P85.layout.candleWidth;if(o85){Y4v.E4o(20);X45=Math.round(Y4v.y4o(r45,p45,t45,o85,l45));Y4v.N4o(3);E45=Y4v.y4o(K45?0:c85,X45);Y45=X45 + Math.round(l45 * p45) - (K45?"0" ^ 0:c85);}else {Y4v.E4o(20);X45=Y4v.F4o(r45,p45,t45,o85,l45);E45=Math.round(X45) + (K45?0:c85);Y45=Math.round(X45 + l45 * p45) - (K45?0:c85);}if(Y45 - E45 < +"2"){Y4v.E4o(3);Y45=Y4v.y4o(1,E45);}m45=K45?+"0":0.5;if(E45 % +"1" == m45){E45+=+"0.5";}if(Y45 % 1 == m45){Y45+=+"0.5";}x85.moveTo(Y45,f45);if(e85 != f45 && K45 && !o85 && b85[I45 + 1]){x85.moveTo(Y45,Math.max(v45,Math.min(f45,b85[I45 + 1])));}x85.lineTo(Y45,v45);x85.lineTo(E45,v45);if(K45 && t45){if(n85[I45] > v45 || I45 === 0){x85.lineTo(E45,Math.min(f45,n85[I45]));}}else if(K45 && !o85 && W85 == D6z){if(I45 > +"0" && n85[I45 - 1] && n85[I45 - 1] > v45){x85.lineTo(E45,Math.min(f45,n85[I45 - 1]));}}else if(K45 && !o85){if(U45 > v45 || I45 === 0){x85.lineTo(E45,Math.min(f45,U45));}}else {x85.lineTo(E45,f45);}U45=v45;r45+=M45;if(W85 != "clustered" || K45){n85[I45]=v45;}}if(K45){x85.strokeStyle=!D45 || D45 == "auto"?P85.defaultColor:D45;x85.stroke();}else {D0z=-1462952359;t0z=720688827;b0z=2;for(var y0z=1;Y4v.O0z(y0z.toString(),y0z.toString().length,+"93345") !== D0z;y0z++){t6z="a";t6z+="u";t6z+="t";t6z+="o";x85.fillStyle=!D45 || D45 == t6z?P85.defaultColor:D45;x85.fill();b0z+=2;}if(Y4v.u0z(b0z.toString(),b0z.toString().length,16636) !== t0z){x85.fillStyle=~D45 && D45 === ""?P85.defaultColor:D45;x85.fill();}}x85.closePath();}c85=this.layout.candleWidth <= 1 || !O85?0:0.5;x85=this.chart.context;if(N85.flipped){x85.translate(0,2 * N85.top);x85.scale(1,-1);}o85=Math.max(0,(1 - S85.widthFactor) * this.layout.candleWidth / 2);n85=new Array(L85.length);b85=[];P85=this;w85=1;for(t85=0;t85 < m85.length;t85++){z85=m85[t85];w85=this.layout.candleWidth * S85.widthFactor;if(o85){if(this.layout.candleWidth - w85 <= 2){O85=!{};}}Z85=0;if(W85 == "clustered"){Z85=t85;w85/=m85.length;}h85=z85.subField || this.chart.defaultPlotField || "Close";if(typeof z85.color_function == "function"){V85={};for(var y85=0;y85 < L85.length;y85++){if(L85[y85]){g85=z85.color_function(L85[y85]);if(typeof g85 == "string"){g85={fill_color:g85,border_color:g85};}if(!g85.hasOwnProperty("border_opacity")){g85.border_opacity=g85.opacity;}a85=g85.fill_color + "," + g85.border_color;if((a85 in V85)){V85[a85].positions.push(y85);}else {g85.positions=[y85];V85[a85]=g85;}}}for(a85 in V85){g85=V85[a85];i85(z85.field,h85,g85.fill_color,g85.opacity,null,null,Z85,w85,g85.positions);i85(z85.field,h85,g85.border_color,g85.border_opacity,!"",null,Z85,w85,g85.positions);}}else {i85(z85.field,h85,z85.fill_color_up,Q85,null,! !1,Z85,w85);i85(z85.field,h85,z85.fill_color_down,B85,null,null,Z85,w85);if(this.layout.candleWidth >= 2 && O85){i85(z85.field,h85,z85.border_color_up,Q85,! !"1",! ![],Z85,w85);i85(z85.field,h85,z85.border_color_down,B85,! ![],null,Z85,w85);}}if(W85 == "stacked"){b85=k9Q.shallowClone(n85);}}x85.globalAlpha=1;this.endClip();};k9Q.ChartEngine.prototype.scatter=function(y45,A45){var L4v=i8EE;var O45,T45,V45,w45,F45,P45,a45,Q45,B45,Z45,j45,q45,h45,H45,W45,n45,i45,O6z,u6z,K6z,c45;O45=y45.chart;T45=O45.dataSegment;V45=new Array(T45.length);w45=this.chart.context;this.canvasColor("stx_scatter_chart");if(!A45){A45={};}F45=A45.field || O45.defaultPlotField;P45=A45.yAxis || y45.yAxis;a45=A45.subField || O45.defaultPlotField || "Close";this.startClip(y45.name);w45.beginPath();w45.lineWidth=A45.lineWidth || 4;if(A45.highlight){w45.lineWidth*=2;}if(!A45.highlight && this.highlightedDraggable){w45.globalAlpha*=0.3;}if(A45.color){w45.strokeStyle=A45.color;}Q45=P45.top;B45=P45.bottom;Z45=this.layout.candleWidth;j45=y45.left - 0.5 * Z45 + this.micropixels - +"1";for(var e45=+"0";e45 <= T45.length;e45++){L4v.N4o(6);j45+=L4v.y4o(Z45,2);Z45=this.layout.candleWidth;L4v.N4o(6);j45+=L4v.y4o(Z45,2);q45=T45[e45];if(!q45)continue;if(q45.candleWidth){L4v.E4o(17);var E7z=L4v.F4o(43,30,15);j45+=(q45.candleWidth - Z45) / E7z;Z45=q45.candleWidth;}if(!q45.projection){if(O45.transformFunc && P45 == O45.panel.yAxis && q45.transform){q45=q45.transform;}h45=q45[F45];if(h45 && h45[a45] !== undefined){h45=h45[a45];}if(!(h45 instanceof Array)){h45=[h45];}if(("Scatter" in q45)){h45=q45.Scatter;}for(var o45=0;o45 < h45.length;o45++){if(!h45[o45] && h45[o45] !== 0)continue;H45=h45[o45];W45=0;if(h45[o45] instanceof Array){H45=h45[o45][0];W45=h45[o45][2];}n45=P45.semiLog?P45.height * (+"1" - (Math.log(Math.max(H45,0)) / Math.LN10 - P45.logLow) / P45.logShadow):(P45.high - H45) * P45.multiplier;if(P45.flipped){L4v.E4o(5);n45=L4v.y4o(B45,n45);}else {n45+=Q45;}if(n45 < Q45)continue;if(n45 > B45)continue;i45=2;if(W45){L4v.N4o(0);i45=L4v.F4o(W45,Z45);}L4v.E4o(5);w45.moveTo(L4v.y4o(j45,i45),n45);L4v.N4o(3);w45.lineTo(L4v.y4o(i45,j45),n45);V45[e45]=n45;}}}O6z=265222662;u6z=822525124;K6z=2;for(var v6z=1;L4v.O0z(v6z.toString(),v6z.toString().length,+"73301") !== O6z;v6z++){w45.stroke();w45.closePath();c45={colors:[w45.strokeStyle],cache:V45};K6z+=2;}if(L4v.u0z(K6z.toString(),K6z.toString().length,+"98315") !== u6z){w45.stroke();w45.closePath();c45={colors:[w45.strokeStyle],cache:V45};}w45.stroke();w45.closePath();c45={colors:[w45.strokeStyle],cache:V45};this.endClip();w45.lineWidth=1;return c45;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
L7bb.r8X=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0048\u0045\x6d\x4e\u0045',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=HEmNE;r['\u006a\x77\x30\x77\u004c']=r;x=4;break;case 4:x=typeof jw0wL === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u006a\u0077\u0030\u0077\u004c'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x48\x45\x6d\x4e\x45'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;Q4aa(L7bb.r8X);C2HH(L7bb.r8X);b2PP(L7bb.r8X);q6DD(L7bb.r8X);function C2HH(L96){function Z26(M96){var v96=2;for(;v96 !== 5;){switch(v96){case 2:var m96=[arguments];return m96[0][0].String;break;}}}function u26(y96){var H96=2;for(;H96 !== 5;){switch(H96){case 2:var q96=[arguments];return q96[0][0];break;}}}var T96=2;for(;T96 !== 28;){switch(T96){case 33:var e26=function(N96,C96,x96,b96){var i96=2;for(;i96 !== 5;){switch(i96){case 2:var g96=[arguments];k26(o96[0][0],g96[0][0],g96[0][1],g96[0][2],g96[0][3]);i96=5;break;}}};T96=32;break;case 29:e26(M26,"charCodeAt",o96[8],o96[63]);T96=28;break;case 2:var o96=[arguments];o96[4]="X";o96[2]="";o96[6]="g";T96=3;break;case 3:o96[2]="HH";o96[7]="";o96[7]="2";o96[9]="";o96[9]="";o96[9]="M";o96[5]="";T96=12;break;case 30:e26(M26,"substring",o96[8],o96[69]);T96=29;break;case 12:o96[5]="H";o96[1]="";o96[1]="b2";o96[8]=5;T96=19;break;case 19:o96[8]=1;o96[3]=0;o96[63]=o96[1];o96[63]+=o96[5];T96=15;break;case 31:e26(Z26,"fromCharCode",o96[3],o96[25]);T96=30;break;case 15:o96[63]+=o96[5];o96[69]=o96[9];o96[69]+=o96[7];o96[69]+=o96[2];T96=24;break;case 24:o96[25]=o96[6];o96[25]+=o96[7];o96[25]+=o96[2];o96[68]=o96[4];T96=35;break;case 32:e26(u26,"String",o96[3],o96[68]);T96=31;break;case 35:o96[68]+=o96[7];o96[68]+=o96[2];T96=33;break;}}function M26(e96){var j96=2;for(;j96 !== 5;){switch(j96){case 2:var W96=[arguments];return W96[0][0].String;break;}}}function k26(J96,u96,Z96,k96,z96){var c96=2;for(;c96 !== 8;){switch(c96){case 2:var Y96=[arguments];Y96[9]="";Y96[9]="ty";Y96[6]="defineP";c96=3;break;case 3:Y96[5]="roper";try{var O96=2;for(;O96 !== 8;){switch(O96){case 2:Y96[1]={};Y96[2]=(1,Y96[0][1])(Y96[0][0]);Y96[8]=[Y96[2],Y96[2].prototype][Y96[0][3]];O96=4;break;case 4:Y96[1].value=Y96[8][Y96[0][2]];try{var A96=2;for(;A96 !== 3;){switch(A96){case 2:Y96[7]=Y96[6];Y96[7]+=Y96[5];Y96[7]+=Y96[9];Y96[0][0].Object[Y96[7]](Y96[8],Y96[0][4],Y96[1]);A96=3;break;}}}catch(l26){}Y96[8][Y96[0][4]]=Y96[1].value;O96=8;break;}}}catch(G26){}c96=8;break;}}}}function L7bb(){}L7bb.v7L=(function(F7L){return {Q7L:function(){var B7L,i7L=arguments;switch(F7L){case 4:B7L=i7L[0] | i7L[1];break;case 2:B7L=(i7L[0] + i7L[1]) * i7L[2] - i7L[3] + -i7L[4];break;case 7:B7L=i7L[0] + i7L[1];break;case 5:B7L=(i7L[3] - i7L[4]) / i7L[0] * i7L[2] - i7L[1];break;case 0:B7L=i7L[1] - i7L[0];break;case 9:B7L=i7L[1] + +i7L[0];break;case 6:B7L=i7L[0] * i7L[2] / (i7L[3] + i7L[1]);break;case 8:B7L=i7L[2] * i7L[0] / i7L[1];break;case 3:B7L=i7L[1] / i7L[2] * i7L[0];break;case 1:B7L=i7L[1] << i7L[0];break;}return B7L;},X7L:function(C7L){F7L=C7L;}};})();L7bb.d96=function(){return typeof L7bb.G96.E4m === 'function'?L7bb.G96.E4m.apply(L7bb.G96,arguments):L7bb.G96.E4m;};L7bb.a3C=function(){return typeof L7bb.D3C.J6C === 'function'?L7bb.D3C.J6C.apply(L7bb.D3C,arguments):L7bb.D3C.J6C;};L7bb.w96=function(){return typeof L7bb.G96.k4m === 'function'?L7bb.G96.k4m.apply(L7bb.G96,arguments):L7bb.G96.k4m;};L7bb.D3C=(function(){var Q9H=2;for(;Q9H !== 9;){switch(Q9H){case 5:V9H[9]={};V9H[9].J6C=function(){var p9H=2;for(;p9H !== 90;){switch(p9H){case 58:M9H[10]=0;p9H=57;break;case 14:M9H[5].o1j=['P1j'];M9H[5].u1j=function(){var c1C=function(){return ('X').toLocaleLowerCase();};var q1C=(/\x78/).I6DD(c1C + []);return q1C;};M9H[2]=M9H[5];M9H[1]={};p9H=10;break;case 70:M9H[10]++;p9H=57;break;case 36:M9H[94]=M9H[39];M9H[8].j6DD(M9H[94]);M9H[8].j6DD(M9H[7]);M9H[8].j6DD(M9H[79]);p9H=51;break;case 10:M9H[1].o1j=['L1j'];M9H[1].u1j=function(){var E1C=typeof x6DD === 'function';return E1C;};M9H[4]=M9H[1];p9H=18;break;case 43:M9H[24]={};M9H[24].o1j=['P1j'];M9H[24].u1j=function(){var p1C=function(){return ('x').startsWith('x');};var S1C=(/\u0074\x72\u0075\u0065/).I6DD(p1C + []);return S1C;};M9H[79]=M9H[24];M9H[39]={};M9H[39].o1j=['P1j'];M9H[39].u1j=function(){var M1C=function(){return unescape('%3D');};var F1C=(/\u003d/).I6DD(M1C + []);return F1C;};p9H=36;break;case 67:V9H[8]=77;return 55;break;case 69:p9H=(function(e9H){var k9H=2;for(;k9H !== 22;){switch(k9H){case 7:k9H=O9H[6] < O9H[0][0].length?6:18;break;case 23:return O9H[5];break;case 5:return;break;case 8:O9H[6]=0;k9H=7;break;case 6:O9H[2]=O9H[0][0][O9H[6]];k9H=14;break;case 25:O9H[5]=true;k9H=24;break;case 1:k9H=O9H[0][0].length === 0?5:4;break;case 15:O9H[3]=O9H[7][O9H[6]];O9H[8]=O9H[9][O9H[3]].h / O9H[9][O9H[3]].t;k9H=26;break;case 19:O9H[6]++;k9H=7;break;case 16:k9H=O9H[6] < O9H[7].length?15:23;break;case 26:k9H=O9H[8] >= 0.5?25:24;break;case 24:O9H[6]++;k9H=16;break;case 20:O9H[9][O9H[2][M9H[87]]].h+=true;k9H=19;break;case 13:O9H[9][O9H[2][M9H[87]]]=(function(){var x9H=2;for(;x9H !== 9;){switch(x9H){case 4:l9H[9].t=0;return l9H[9];break;case 2:var l9H=[arguments];l9H[9]={};l9H[9].h=0;x9H=4;break;}}}).W6DD(this,arguments);k9H=12;break;case 2:var O9H=[arguments];k9H=1;break;case 17:O9H[6]=0;k9H=16;break;case 11:O9H[9][O9H[2][M9H[87]]].t+=true;k9H=10;break;case 14:k9H=typeof O9H[9][O9H[2][M9H[87]]] === 'undefined'?13:11;break;case 10:k9H=O9H[2][M9H[45]] === M9H[99]?20:19;break;case 18:O9H[5]=false;k9H=17;break;case 12:O9H[7].j6DD(O9H[2][M9H[87]]);k9H=11;break;case 4:O9H[9]={};O9H[7]=[];O9H[6]=0;k9H=8;break;}}})(M9H[54])?68:67;break;case 1:p9H=V9H[8]?5:4;break;case 62:M9H[63]='o1j';M9H[45]='t1j';M9H[82]='u1j';M9H[87]='s1j';p9H=58;break;case 76:p9H=M9H[30] < M9H[55][M9H[63]].length?75:70;break;case 51:M9H[8].j6DD(M9H[4]);M9H[8].j6DD(M9H[6]);M9H[8].j6DD(M9H[17]);M9H[8].j6DD(M9H[60]);M9H[8].j6DD(M9H[93]);M9H[8].j6DD(M9H[41]);M9H[8].j6DD(M9H[2]);p9H=65;break;case 75:M9H[27]={};M9H[27][M9H[87]]=M9H[55][M9H[63]][M9H[30]];M9H[27][M9H[45]]=M9H[47];M9H[54].j6DD(M9H[27]);p9H=71;break;case 65:M9H[54]=[];M9H[99]='C1j';M9H[83]='H1j';p9H=62;break;case 21:M9H[78].u1j=function(){var z1C=function(){return btoa('=');};var C1C=!(/\u0062\x74\x6f\x61/).I6DD(z1C + []);return C1C;};M9H[41]=M9H[78];M9H[76]={};M9H[76].o1j=['L1j'];M9H[76].u1j=function(){var d1C=typeof f6DD === 'function';return d1C;};M9H[93]=M9H[76];p9H=30;break;case 2:var M9H=[arguments];p9H=1;break;case 24:M9H[60]=M9H[48];p9H=23;break;case 71:M9H[30]++;p9H=76;break;case 30:M9H[80]={};M9H[80].o1j=['L1j'];M9H[80].u1j=function(){var Q1C=false;var B1C=[];try{for(var w1C in console){B1C.j6DD(w1C);}Q1C=B1C.length === 0;}catch(b1C){}var m1C=Q1C;return m1C;};M9H[17]=M9H[80];p9H=43;break;case 5:return 95;break;case 4:M9H[8]=[];M9H[9]={};M9H[9].o1j=['L1j'];M9H[9].u1j=function(){var T1C=typeof Y6DD === 'function';return T1C;};M9H[6]=M9H[9];M9H[5]={};p9H=14;break;case 56:M9H[55]=M9H[8][M9H[10]];try{M9H[47]=M9H[55][M9H[82]]()?M9H[99]:M9H[83];}catch(R1C){M9H[47]=M9H[83];}p9H=77;break;case 23:M9H[78]={};M9H[78].o1j=['P1j'];p9H=21;break;case 57:p9H=M9H[10] < M9H[8].length?56:69;break;case 77:M9H[30]=0;p9H=76;break;case 68:p9H=38?68:67;break;case 18:M9H[3]={};M9H[3].o1j=['P1j'];M9H[3].u1j=function(){var u1C=function(){return ('a').codePointAt(0);};var L1C=(/\u0039\x37/).I6DD(u1C + []);return L1C;};M9H[7]=M9H[3];M9H[48]={};M9H[48].o1j=['P1j'];M9H[48].u1j=function(){var t1C=function(){return ('aaa').includes('a');};var K1C=(/\u0074\x72\u0075\u0065/).I6DD(t1C + []);return K1C;};p9H=24;break;}}};return V9H[9];break;case 2:var V9H=[arguments];V9H[8]=undefined;Q9H=5;break;}}})();function q6DD(w9H){function a4H(G9H,I9H,b9H,d9H,L9H){var n9H=2;for(;n9H !== 8;){switch(n9H){case 9:try{var u9H=2;for(;u9H !== 8;){switch(u9H){case 3:try{var A9H=2;for(;A9H !== 3;){switch(A9H){case 2:j9H[3]=j9H[7];A9H=1;break;case 1:j9H[3]+=j9H[6];j9H[3]+=j9H[8];A9H=4;break;case 4:j9H[0][0].Object[j9H[3]](j9H[9],j9H[0][4],j9H[5]);A9H=3;break;}}}catch(G4H){}j9H[9][j9H[0][4]]=j9H[5].value;u9H=8;break;case 2:j9H[5]={};j9H[1]=(1,j9H[0][1])(j9H[0][0]);j9H[9]=[j9H[1],j9H[1].prototype][j9H[0][3]];j9H[5].value=j9H[9][j9H[0][2]];u9H=3;break;}}}catch(I4H){}n9H=8;break;case 2:var j9H=[arguments];j9H[8]="";j9H[8]="rty";j9H[6]="pe";j9H[7]="definePro";n9H=9;break;}}}function y4H(P9H){var U9H=2;for(;U9H !== 5;){switch(U9H){case 2:var g9H=[arguments];return g9H[0][0].RegExp;break;}}}var J9H=2;for(;J9H !== 69;){switch(J9H){case 23:Z9H[84]="6";Z9H[35]="";Z9H[24]="f";Z9H[35]="j6";J9H=34;break;case 61:Z9H[52]+=Z9H[84];Z9H[52]+=Z9H[91];Z9H[51]=Z9H[6];Z9H[51]+=Z9H[84];Z9H[51]+=Z9H[91];J9H=56;break;case 3:Z9H[6]="Y";Z9H[1]="";Z9H[1]="I";Z9H[8]="";J9H=6;break;case 52:Z9H[47]+=Z9H[84];Z9H[47]+=Z9H[91];Z9H[11]=Z9H[53];Z9H[11]+=Z9H[78];J9H=48;break;case 73:i4H(C4H,Z9H[41],Z9H[93],Z9H[88]);J9H=72;break;case 76:var i4H=function(E9H,R9H,q9H,N9H){var v9H=2;for(;v9H !== 5;){switch(v9H){case 2:var H9H=[arguments];a4H(Z9H[0][0],H9H[0][0],H9H[0][1],H9H[0][2],H9H[0][3]);v9H=5;break;}}};J9H=75;break;case 34:Z9H[71]="";Z9H[71]="D";Z9H[83]="";Z9H[83]="6D";Z9H[95]="W";Z9H[33]=6;J9H=28;break;case 75:i4H(C4H,Z9H[59],Z9H[93],Z9H[51]);J9H=74;break;case 72:i4H(C4H,Z9H[11],Z9H[93],Z9H[47]);J9H=71;break;case 2:var Z9H=[arguments];Z9H[3]="_";Z9H[2]="_r";Z9H[9]="esidual";J9H=3;break;case 41:Z9H[93]=0;Z9H[69]=Z9H[95];Z9H[69]+=Z9H[83];Z9H[69]+=Z9H[71];J9H=37;break;case 28:Z9H[33]=4;Z9H[33]=1;Z9H[93]=8;Z9H[93]=2;J9H=41;break;case 27:Z9H[53]="__";Z9H[91]="";Z9H[91]="DD";Z9H[84]="";J9H=23;break;case 6:Z9H[8]="ct";Z9H[7]="";Z9H[7]="bstra";Z9H[5]="";J9H=11;break;case 18:Z9H[78]="";Z9H[78]="optimi";Z9H[13]="ze";Z9H[53]="";J9H=27;break;case 11:Z9H[5]="";Z9H[5]="__a";Z9H[4]="";Z9H[4]="x6";J9H=18;break;case 37:Z9H[57]=Z9H[35];Z9H[57]+=Z9H[71];Z9H[57]+=Z9H[71];Z9H[47]=Z9H[24];J9H=52;break;case 70:i4H(D4H,"apply",Z9H[33],Z9H[69]);J9H=69;break;case 48:Z9H[11]+=Z9H[13];Z9H[88]=Z9H[4];Z9H[88]+=Z9H[71];Z9H[88]+=Z9H[71];J9H=65;break;case 56:Z9H[59]=Z9H[3];Z9H[59]+=Z9H[2];Z9H[59]+=Z9H[9];J9H=76;break;case 74:i4H(y4H,"test",Z9H[33],Z9H[52]);J9H=73;break;case 71:i4H(s4H,"push",Z9H[33],Z9H[57]);J9H=70;break;case 65:Z9H[41]=Z9H[5];Z9H[41]+=Z9H[7];Z9H[41]+=Z9H[8];Z9H[52]=Z9H[1];J9H=61;break;}}function s4H(W9H){var K9H=2;for(;K9H !== 5;){switch(K9H){case 2:var m9H=[arguments];return m9H[0][0].Array;break;}}}function C4H(c9H){var F9H=2;for(;F9H !== 5;){switch(F9H){case 2:var o9H=[arguments];return o9H[0][0];break;}}}function D4H(z9H){var h9H=2;for(;h9H !== 5;){switch(h9H){case 2:var r9H=[arguments];return r9H[0][0].Function;break;}}}}L7bb.G7L=function(){return typeof L7bb.v7L.Q7L === 'function'?L7bb.v7L.Q7L.apply(L7bb.v7L,arguments):L7bb.v7L.Q7L;};L7bb.W7L=function(){return typeof L7bb.v7L.X7L === 'function'?L7bb.v7L.X7L.apply(L7bb.v7L,arguments):L7bb.v7L.X7L;};L7bb.E7K=function(){return typeof L7bb.G7K.O4w === 'function'?L7bb.G7K.O4w.apply(L7bb.G7K,arguments):L7bb.G7K.O4w;};function Q4aa(q7K){var B7K=2;for(;B7K !== 13;){switch(B7K){case 14:E8K(s8K,"charCodeAt",R7K[9],R7K[2]);B7K=13;break;case 6:var E8K=function(U7K,t7K,S7K,y7K){var C7K=2;for(;C7K !== 5;){switch(C7K){case 2:var h7K=[arguments];a8K(R7K[0][0],h7K[0][0],h7K[0][1],h7K[0][2],h7K[0][3]);C7K=5;break;}}};B7K=14;break;case 3:R7K[3]="d4";R7K[2]=R7K[3];R7K[2]+=R7K[1];R7K[2]+=R7K[1];B7K=6;break;case 2:var R7K=[arguments];R7K[1]="";R7K[1]="a";R7K[9]=1;B7K=3;break;}}function a8K(Y7K,r7K,j7K,D7K,W7K){var F7K=2;for(;F7K !== 6;){switch(F7K){case 8:z7K[7]=8;try{var m7K=2;for(;m7K !== 8;){switch(m7K){case 3:try{var A7K=2;for(;A7K !== 3;){switch(A7K){case 2:z7K[1]=z7K[2];A7K=1;break;case 1:z7K[1]+=z7K[9];z7K[1]+=z7K[4];z7K[0][0].Object[z7K[1]](z7K[6],z7K[0][4],z7K[5]);A7K=3;break;}}}catch(c7K){}z7K[6][z7K[0][4]]=z7K[5].value;m7K=8;break;case 4:z7K[5].value=z7K[6][z7K[0][2]];m7K=3;break;case 2:z7K[5]={};z7K[8]=(1,z7K[0][1])(z7K[0][0]);z7K[6]=[z7K[7],z7K[8].prototype][z7K[0][3]];m7K=4;break;}}}catch(K7K){}F7K=6;break;case 2:var z7K=[arguments];z7K[4]="ty";z7K[9]="";z7K[9]="roper";z7K[2]="";z7K[2]="defineP";F7K=8;break;}}}function s8K(M7K){var v7K=2;for(;v7K !== 5;){switch(v7K){case 2:var b7K=[arguments];return b7K[0][0].String;break;}}}}L7bb.U96=function(){return typeof L7bb.G96.E4m === 'function'?L7bb.G96.E4m.apply(L7bb.G96,arguments):L7bb.G96.E4m;};function b2PP(e7j){function v4j(s7j){var w7j=2;for(;w7j !== 5;){switch(w7j){case 2:var d7j=[arguments];return d7j[0][0].String;break;}}}var q7j=2;for(;q7j !== 26;){switch(q7j){case 16:var o4j=function(f7j,g7j,m7j,i7j){var o7j=2;for(;o7j !== 5;){switch(o7j){case 2:var c7j=[arguments];u4j(Z4j[0][0],c7j[0][0],c7j[0][1],c7j[0][2],c7j[0][3]);o7j=5;break;}}};q7j=15;break;case 15:o4j(v4j,"replace",Z4j[7],Z4j[8]);q7j=27;break;case 27:o4j(t4j,"map",Z4j[7],Z4j[2]);q7j=26;break;case 2:var Z4j=[arguments];Z4j[1]="";Z4j[1]="P";Z4j[5]="";q7j=3;break;case 3:Z4j[5]="L6";Z4j[6]="";Z4j[6]="PP";Z4j[4]="";q7j=6;break;case 6:Z4j[4]="6";Z4j[3]="";Z4j[3]="I";Z4j[7]=1;q7j=11;break;case 11:Z4j[2]=Z4j[3];Z4j[2]+=Z4j[4];Z4j[2]+=Z4j[6];Z4j[8]=Z4j[5];q7j=18;break;case 18:Z4j[8]+=Z4j[1];Z4j[8]+=Z4j[1];q7j=16;break;}}function t4j(j7j){var b7j=2;for(;b7j !== 5;){switch(b7j){case 2:var N7j=[arguments];b7j=1;break;case 1:return N7j[0][0].Array;break;}}}function u4j(G7j,C7j,H7j,n7j,Y7j){var t7j=2;for(;t7j !== 13;){switch(t7j){case 9:U7j[1]="";U7j[1]="de";U7j[3]=6;U7j[3]=8;t7j=14;break;case 2:var U7j=[arguments];U7j[8]="";U7j[8]="ineProperty";U7j[4]="";U7j[4]="f";t7j=9;break;case 14:try{var u7j=2;for(;u7j !== 8;){switch(u7j){case 2:U7j[9]={};U7j[6]=(1,U7j[0][1])(U7j[0][0]);U7j[5]=[U7j[3],U7j[6].prototype][U7j[0][3]];U7j[9].value=U7j[5][U7j[0][2]];try{var v7j=2;for(;v7j !== 3;){switch(v7j){case 2:U7j[2]=U7j[1];U7j[2]+=U7j[4];U7j[2]+=U7j[8];U7j[0][0].Object[U7j[2]](U7j[5],U7j[0][4],U7j[9]);v7j=3;break;}}}catch(J4j){}U7j[5][U7j[0][4]]=U7j[9].value;u7j=8;break;}}}catch(r4j){}t7j=13;break;}}}}L7bb.p96=function(){return typeof L7bb.G96.k4m === 'function'?L7bb.G96.k4m.apply(L7bb.G96,arguments):L7bb.G96.k4m;};L7bb.N7K=function(){return typeof L7bb.G7K.O4w === 'function'?L7bb.G7K.O4w.apply(L7bb.G7K,arguments):L7bb.G7K.O4w;};L7bb.E7j=(function(k4a){var x7j=2;for(;x7j !== 10;){switch(x7j){case 5:s4a=L7bb.r8X;x7j=4;break;case 1:x7j=! r4a--?5:4;break;case 13:x7j=! r4a--?12:11;break;case 2:var s4a,Y4a,F4a,r4a;x7j=1;break;case 12:var L4a,I4a=0;x7j=11;break;case 14:k4a=k4a.I6PP(function(T7a){var z7j=2;for(;z7j !== 13;){switch(z7j){case 6:return;break;case 5:f7a='';z7j=4;break;case 1:z7j=! r4a--?5:4;break;case 2:var f7a;z7j=1;break;case 4:var q7a=0;z7j=3;break;case 3:z7j=q7a < T7a.length?9:7;break;case 9:f7a+=s4a[F4a][P4a](T7a[q7a] + 105);z7j=8;break;case 14:return f7a;break;case 8:q7a++;z7j=3;break;case 7:z7j=!f7a?6:14;break;}}});x7j=13;break;case 7:F4a=Y4a.L6PP(new s4a[n4a]("^['-|]"),'S');x7j=6;break;case 4:var P4a='fromCharCode',n4a='RegExp';x7j=3;break;case 3:x7j=! r4a--?9:8;break;case 6:x7j=! r4a--?14:13;break;case 9:Y4a=typeof P4a;x7j=8;break;case 11:return {J4a:function(g7a){var W7j=2;for(;W7j !== 6;){switch(W7j){case 9:I4a=j7a + 60000;W7j=8;break;case 2:var j7a=new s4a[k4a[0]]()[k4a[1]]();W7j=1;break;case 4:L4a=H4a(j7a);W7j=3;break;case 1:W7j=j7a > I4a?5:8;break;case 8:var C7a=(function(R7a,W7a){var B7j=2;for(;B7j !== 10;){switch(B7j){case 8:var G7a=s4a[W7a[4]](R7a[W7a[2]](X7a),16)[W7a[3]](2);var t7a=G7a[W7a[2]](G7a[W7a[5]] - 1);B7j=6;break;case 9:B7j=X7a < R7a[W7a[5]]?8:11;break;case 3:var U7a,X7a=0;B7j=9;break;case 6:B7j=X7a === 0?14:12;break;case 4:W7a=k4a;B7j=3;break;case 11:return U7a;break;case 5:B7j=typeof W7a === 'undefined' && typeof k4a !== 'undefined'?4:3;break;case 1:R7a=g7a;B7j=5;break;case 13:X7a++;B7j=9;break;case 2:B7j=typeof R7a === 'undefined' && typeof g7a !== 'undefined'?1:5;break;case 12:U7a=U7a ^ t7a;B7j=13;break;case 14:U7a=t7a;B7j=13;break;}}})(undefined,undefined);return C7a?L4a:!L4a;break;case 5:W7j=! r4a--?4:3;break;case 3:W7j=! r4a--?9:8;break;}}}};break;case 8:x7j=! r4a--?7:6;break;}}function H4a(V4a){var P7j=2;for(;P7j !== 15;){switch(P7j){case 17:b7a=V4a - h4a > A4a;P7j=19;break;case 12:P7j=! r4a--?11:10;break;case 2:var b7a,A4a,B7a,K7a,N7a,h4a,Z7a;P7j=1;break;case 10:P7j=h4a >= 0 && K7a >= 0?20:18;break;case 1:P7j=! r4a--?5:4;break;case 13:N7a=k4a[7];P7j=12;break;case 20:b7a=V4a - h4a > A4a && K7a - V4a > A4a;P7j=19;break;case 5:Z7a=s4a[k4a[4]];P7j=4;break;case 9:P7j=! r4a--?8:7;break;case 7:P7j=! r4a--?6:14;break;case 18:P7j=h4a >= 0?17:16;break;case 8:B7a=k4a[6];P7j=7;break;case 4:P7j=! r4a--?3:9;break;case 11:h4a=(N7a || N7a === 0) && Z7a(N7a,A4a);P7j=10;break;case 19:return b7a;break;case 6:K7a=B7a && Z7a(B7a,A4a);P7j=14;break;case 3:A4a=28;P7j=9;break;case 16:b7a=K7a - V4a > A4a;P7j=19;break;case 14:P7j=! r4a--?13:12;break;}}}})([[-37,-8,11,-4],[-2,-4,11,-21,0,4,-4],[-6,-1,-8,9,-40,11],[11,6,-22,11,9,0,5,-2],[7,-8,9,10,-4,-32,5,11],[3,-4,5,-2,11,-1],[-53,-49,-56,-7,-50,-6,-8,-6,-2],[]]);L7bb.h7L=function(){return typeof L7bb.v7L.X7L === 'function'?L7bb.v7L.X7L.apply(L7bb.v7L,arguments):L7bb.v7L.X7L;};L7bb.Q7j=function(){return typeof L7bb.E7j.J4a === 'function'?L7bb.E7j.J4a.apply(L7bb.E7j,arguments):L7bb.E7j.J4a;};L7bb.G7K=(function(){var U4w=function(i4w,m4w){var g4w=m4w & 0xffff;var J4w=m4w - g4w;return (J4w * i4w | 0) + (g4w * i4w | 0) | 0;},a4w=function(r4w,M4w,C4w){var j4w=0xcc9e2d51,p4w=0x1b873593;var W4w=C4w;var h4w=M4w & ~0x3;for(var T4w=0;T4w < h4w;T4w+=4){var D4w=r4w.d4aa(T4w) & 0xff | (r4w.d4aa(T4w + 1) & 0xff) << 8 | (r4w.d4aa(T4w + 2) & 0xff) << 16 | (r4w.d4aa(T4w + 3) & 0xff) << 24;D4w=U4w(D4w,j4w);D4w=(D4w & 0x1ffff) << 15 | D4w >>> 17;D4w=U4w(D4w,p4w);W4w^=D4w;W4w=(W4w & 0x7ffff) << 13 | W4w >>> 19;W4w=W4w * 5 + 0xe6546b64 | 0;}D4w=0;switch(M4w % 4){case 3:D4w=(r4w.d4aa(h4w + 2) & 0xff) << 16;case 2:D4w|=(r4w.d4aa(h4w + 1) & 0xff) << 8;case 1:D4w|=r4w.d4aa(h4w) & 0xff;D4w=U4w(D4w,j4w);D4w=(D4w & 0x1ffff) << 15 | D4w >>> 17;D4w=U4w(D4w,p4w);W4w^=D4w;}W4w^=M4w;W4w^=W4w >>> 16;W4w=U4w(W4w,0x85ebca6b);W4w^=W4w >>> 13;W4w=U4w(W4w,0xc2b2ae35);W4w^=W4w >>> 16;return W4w;};return {O4w:a4w};})();L7bb.y3C=function(){return typeof L7bb.D3C.J6C === 'function'?L7bb.D3C.J6C.apply(L7bb.D3C,arguments):L7bb.D3C.J6C;};L7bb.d7L=function(){return typeof L7bb.v7L.Q7L === 'function'?L7bb.v7L.Q7L.apply(L7bb.v7L,arguments):L7bb.v7L.Q7L;};L7bb.T7j=function(){return typeof L7bb.E7j.J4a === 'function'?L7bb.E7j.J4a.apply(L7bb.E7j,arguments):L7bb.E7j.J4a;};L7bb.G96=(function(){var B96=2;for(;B96 !== 4;){switch(B96){case 2:var L4m=L7bb.r8X;var B4m,N4m;return {k4m:function(T3m,U3m,w3m,K3m){var E96=2;for(;E96 !== 1;){switch(E96){case 2:return Y4m(T3m,U3m,w3m,K3m);break;}}},E4m:function(W3m,e3m,Q3m,O3m){var S96=2;for(;S96 !== 1;){switch(S96){case 2:return Y4m(W3m,e3m,Q3m,O3m,true);break;}}}};break;}}function a4m(R4m){var I96=2;for(;I96 !== 7;){switch(I96){case 2:var y3m=1;var r4m='';I96=5;break;case 5:var F4m=0;I96=4;break;case 9:F4m++;I96=4;break;case 4:I96=F4m < R4m.length?3:8;break;case 3:r4m+=X2HH.g2HH(R4m[F4m] - y3m + 116);I96=9;break;case 8:return r4m;break;}}}function Y4m(f3m,t3m,c3m,q3m,m3m){var s96=2;for(;s96 !== 15;){switch(s96){case 9:s96=q3m > 0?8:19;break;case 4:!N4m && (N4m=typeof n3m !== "undefined"?n3m[a4m([-11,-1,-14,-13])]:"");P3m=m3m?N4m:B4m;s96=9;break;case 7:i3m=p3m.length;s96=6;break;case 14:var x3m=P3m.length - f3m;s96=13;break;case 8:p3m=P3m.M2HH(f3m,q3m);s96=7;break;case 1:n3m=L4m[a4m([-7,-4,-16,-18,1,-10,-4,-5])];!B4m && (B4m=typeof n3m !== "undefined"?n3m[a4m([-11,-4,0,1,-5,-18,-6,-14])] || ' ':"");s96=4;break;case 13:s96=t3m && x3m > 0 && P3m.b2HH(x3m - 1) !== 46?12:11;break;case 2:var p3m,i3m,P3m,n3m;s96=1;break;case 18:p3m=P3m.M2HH(0,P3m.length);i3m=p3m.length;s96=16;break;case 6:return L7bb.N7K(p3m,i3m,c3m);break;case 16:return L7bb.N7K(p3m,i3m,c3m);break;case 12:return false;break;case 11:p3m=P3m.M2HH(x3m,P3m.length);i3m=p3m.length;return L7bb.N7K(p3m,i3m,c3m);break;case 19:s96=f3m === null || f3m <= 0?18:14;break;}}}})();L7bb.G1j=function(j1j){L7bb.a3C();if(L7bb && j1j)return L7bb.Q7j(j1j);};L7bb.i1j=function(m1j){L7bb.a3C();if(L7bb)return L7bb.T7j(m1j);};L7bb.e1j=function(d1j){L7bb.a3C();if(L7bb && d1j)return L7bb.Q7j(d1j);};L7bb.A7j=function(l7j){L7bb.y3C();if(L7bb)return L7bb.Q7j(l7j);};L7bb.O7j=function(V7j){L7bb.y3C();if(L7bb && V7j)return L7bb.T7j(V7j);};L7bb.h7j=function(X7j){L7bb.y3C();if(L7bb && X7j)return L7bb.Q7j(X7j);};L7bb.K7j=function(a7j){L7bb.y3C();if(L7bb)return L7bb.T7j(a7j);};L7bb.M7j=function(L7j){if(L7bb && L7j)return L7bb.Q7j(L7j);};L7bb.r7j=function(J7j){L7bb.y3C();if(L7bb)return L7bb.T7j(J7j);};L7bb.I7j=function(k7j){L7bb.a3C();if(L7bb)return L7bb.Q7j(k7j);};L7bb.a3C();var __js_standard_movement_;__js_standard_movement_=x8X=>{var Z3C=L7bb;Z3C.p7j=function(F7j){if(Z3C)return Z3C.Q7j(F7j);};var z8X,y8X,a7K,s7K,w7K;z8X=typeof _CIQ !== "undefined"?_CIQ:x8X.CIQ;y8X="valid";a7K=-1201325981;s7K=509416489;w7K=2;for(var l0K="1" * 1;Z3C.N7K(l0K.toString(),l0K.toString().length,+"65237") !== a7K;l0K++){z8X.valid=8;w7K+=2;}if(Z3C.E7K(w7K.toString(),w7K.toString().length,56968) !== s7K){z8X.valid=0;}z8X[Z3C.I7j("8cb3")?"":"ChartEngine"][Z3C.r7j("a42f")?"prototype":""][Z3C.M7j("1968")?"":"mousemoveinner"]=function(g8X,k8X){Z3C.g1j=function(f1j){if(Z3C && f1j)return Z3C.T7j(f1j);};Z3C.U1j=function(N1j){Z3C.a3C();if(Z3C && N1j)return Z3C.T7j(N1j);};Z3C.y3C();Z3C.c1j=function(Z7j){if(Z3C && Z7j)return Z3C.T7j(Z7j);};Z3C.S7j=function(R7j){if(Z3C)return Z3C.T7j(R7j);};var r96=Z3C.p7j("7c3b")?203810768:347546129,R96=-(Z3C.K7j("3d26")?865387668:107940449),X96=Z3C.S7j("5723")?879802036:206751577,h96=-(Z3C.h7j("61c4")?1095625797:1516145988),F96=Z3C.O7j("7944")?2883195019:2061635600,n96=667104191,Q0b=Z3C.A7j("11ab")?101248867:610926140,P0b=-(Z3C.c1j("72df")?1888243887:3747059158),K0b=1861059366,D0b=-(Z3C.U1j("f33e")?193106357:767988216),V0b=1314885464,f0b=Z3C.e1j("f5d4")?1382789518:3227066813,t0b=403506151,o0b=1052204544,g0b=Z3C.g1j("a793")?1881491643:5602215383,q0b=Z3C.i1j("e97a")?1148326233:1115466754;if(!(Z3C.w96(Z3C.G1j("3a49")?7:0,false,915299) !== r96 && Z3C.w96(0,false,222591) !== R96 && Z3C.p96(11,false,452525) !== X96 && Z3C.p96(0,false,865405) !== h96 && Z3C.p96(10,false,977972) !== F96 && Z3C.w96(0,false,432602) !== n96 && Z3C.p96(10,false,410871) !== Q0b && Z3C.p96(0,false,193794) !== P0b && Z3C.p96(11,false,144467) !== K0b && Z3C.p96(0,false,855077) !== D0b && Z3C.p96(10,false,135320) !== V0b && Z3C.p96(0,false,432116) !== f0b && Z3C.p96(10,false,561130) !== t0b && Z3C.w96(0,false,426225) !== o0b && Z3C.p96(10,false,438944) !== g0b && Z3C.w96(0,false,709665) !== q0b)){var H6K,s1K,s8X,W8X,a8X,i8X,o8X,v8X,P8X,K8X,T1K,V1K,O1K,F8X,Y0K,r0K,j0K,M0K,B0K,C0K,A0K,v0K,i0K,J8X,I1K,d1K,J1K,m8X,H8X,d8X,e8X,q8X,G8X,w1K,o1K,c1K,K1K,f1K,Z1K,Q1K,E0K,N0K,a0K,C8X,k0K,g0K,L0K,j8X,T8X,N8X,S1K,y1K,Y1K;H6K="p";H6K+="x";s1K="m";s1K+="ousemoveinne";s1K+="r";if(!this["chart"]["canvas"]){return;}if(!z8X["isAndroid"] && !z8X["isIOS7or8"]){if(this["chart"]["canvas"]["height"] != Math["floor"](this["devicePixelRatio"] * this["chart"]["container"]["clientHeight"]) || this["chart"]["canvas"]["width"] != Math["floor"](this["devicePixelRatio"] * this["chart"]["container"]["clientWidth"])){this["resizeChart"]();return;}}if(this["runPrepend"](s1K,arguments)){return;}W8X=arguments;a8X=this["container"]["getBoundingClientRect"]();this["top"]=a8X["top"];this["left"]=a8X["left"];this["right"]=this["left"] + this["width"];this["bottom"]=this["top"] + this["height"];this["hasDragged"]=! ![];z8X["ChartEngine"]["crosshairX"]=g8X;z8X["ChartEngine"]["crosshairY"]=k8X;i8X=this["cy"]=this["crossYActualPos"]=this["backOutY"](z8X["ChartEngine"]["crosshairY"]);o8X=this["cx"]=this["crossXActualPos"]=this["backOutX"](z8X["ChartEngine"]["crosshairX"]);if(this["grabbingScreen"] && this["anyHighlighted"]){v8X=Math["pow"](this["grabStartX"] - g8X,2) + Math["pow"](this["grabStartY"] - k8X,2);if(v8X < 36){return;}}this["cancelLongHold"]=! !"1";P8X=function(Y4X,h4X){var W0b=-1237595713,m0b=-169946099,Y0b=2017770241,L0b=1980068116,N0b=-430895956,C0b=-1513733794,x0b=-1907971174,b0b=-47421658,y0b=905411883,e0b=1693052540,M0b=43469621,J0b=-1964891695,u0b=-951560562,Z0b=-2002947484,k0b=1670945232,z0b=-542970417;Z3C.a3C();if(Z3C.w96(0,false,934848) === W0b || Z3C.p96(0,false,705234) === m0b || Z3C.p96(11,false,956974) === Y0b || Z3C.p96(0,false,372897) === L0b || Z3C.w96(10,false,551383) === N0b || Z3C.w96(0,false,163068) === C0b || Z3C.w96(10,false,700295) === x0b || Z3C.p96(0,false,683231) === b0b || Z3C.w96(11,false,697186) === y0b || Z3C.w96(0,false,811399) === e0b || Z3C.w96(10,false,387231) === M0b || Z3C.w96(0,false,408909) === J0b || Z3C.p96(10,false,830004) === u0b || Z3C.p96(0,false,443440) === Z0b || Z3C.p96(10,false,863863) === k0b || Z3C.p96(0,false,610808) === z0b){var F1K,m1K,A1K;if(z8X[y8X] === 0){return Y4X["whichPanel"](h4X) || Y4X["chart"]["panel"];}if(!Y4X["draw"][y8X]){Y4X["draw"]=function(){var T0b=947152145,i0b=1253110209,H0b=-1557733171,j0b=2072403353,v0b=-32526828,c0b=-369768062,O0b=-1232976501,A0b=-363201346,B0b=516612033,I0b=1474008384,s0b=823009584,E0b=1888273047,S0b=2088733803,a0b=-1090558821,l0b=-83918183,G0b=-817478669;Z3C.y3C();if(Z3C.p96(0,false,844093) === T0b || Z3C.w96(0,false,794307) === i0b || Z3C.p96(11,false,395047) === H0b || Z3C.w96(0,false,529405) === j0b || Z3C.p96(10,false,243662) === v0b || Z3C.w96(0,false,178732) === c0b || Z3C.w96(10,false,711596) === O0b || Z3C.p96(0,false,152396) === A0b || Z3C.p96(11,false,486133) === B0b || Z3C.w96(0,false,826709) === I0b || Z3C.w96(10,false,782264) === s0b || Z3C.w96(0,false,126060) === E0b || Z3C.w96(10,false,886662) === S0b || Z3C.p96(0,false,569128) === a0b || Z3C.w96(10,false,717240) === l0b || Z3C.w96(0,false,618052) === G0b){z8X["clearCanvas"](this["chart"]["canvas"],this);}};F1K=836012978;m1K=+"443923073";A1K=+"2";for(var i1K=1;Z3C["E7K"](i1K["toString"](),i1K["toString"]()["length"],28264) !== F1K;i1K++){Y4X["draw"][y8X]=! !"";A1K+=2;}if(Z3C["N7K"](A1K["toString"](),A1K["toString"]()["length"],20640) !== m1K){Y4X["draw"][y8X]=! !{};}}}};this["currentPanel"]=P8X(this,i8X);if(!this["currentPanel"]){return;}K8X=this["currentPanel"]["chart"];if(K8X["dataSet"]){this["crosshairTick"]=this["tickFromPixel"](o8X,K8X);Z3C["W7L"](0);T1K=Z3C["d7L"](0,"1127172936");V1K=-181708005;O1K=2;for(var n1K=1;Z3C["E7K"](n1K["toString"](),n1K["toString"]()["length"],24819) !== T1K;n1K++){s8X=this["valueFromPixel"](i8X,this["currentPanel"]);this["crosshairValue"]=this["adjustIfNecessary"](this["currentPanel"],this["crosshairTick"],s8X);F8X=this["currentPanel"]["name"] == "chart"?this["preferences"]["horizontalCrosshairField"]:this["currentPanel"]["horizontalCrosshairField"];O1K+=2;}if(Z3C["N7K"](O1K["toString"](),O1K["toString"]()["length"],10166) !== V1K){s8X=this["valueFromPixel"](i8X,this["currentPanel"]);this["crosshairValue"]=this["adjustIfNecessary"](this["currentPanel"],this["crosshairTick"],s8X);F8X=this["currentPanel"]["name"] != ""?this["preferences"]["horizontalCrosshairField"]:this["currentPanel"]["horizontalCrosshairField"];}if(F8X && this["crosshairTick"] < K8X["dataSet"]["length"] && this["crosshairTick"] > -1){Y0K=+"982499644";r0K=2010835708;j0K=+"2";for(var W0K=1;Z3C["N7K"](W0K["toString"](),W0K["toString"]()["length"],7386) !== Y0K;W0K++){s8X=K8X["dataSet"][this["crosshairTick"]][F8X];this["crossYActualPos"]=this["pixelFromPrice"](s8X,this["currentPanel"]);j0K+=2;}if(Z3C["E7K"](j0K["toString"](),j0K["toString"]()["length"],"83411" & 2147483647) !== r0K){s8X=K8X["dataSet"][this["crosshairTick"]][F8X];this["crossYActualPos"]=this["pixelFromPrice"](s8X,this["currentPanel"]);}}}if(z8X["ChartEngine"]["crosshairX"] >= this["left"] && z8X["ChartEngine"]["crosshairX"] <= this["right"] && z8X["ChartEngine"]["crosshairY"] >= this["top"] && z8X["ChartEngine"]["crosshairY"] <= this["bottom"]){M0K=-426519520;B0K=+"1350972045";C0K=2;for(var m0K=1;Z3C["N7K"](m0K["toString"](),m0K["toString"]()["length"],+"89783") !== M0K;m0K++){this["insideChart"]=!1;C0K+=2;}if(Z3C["E7K"](C0K["toString"](),C0K["toString"]()["length"],66356) !== B0K){this["insideChart"]=!"";}}else {Z3C["W7L"](1);A0K=Z3C["G7L"](1292502144,"527042316");v0K=-1657629793;i0K=2;for(var G0K=+"1";Z3C["E7K"](G0K["toString"](),G0K["toString"]()["length"],+"83287") !== A0K;G0K++){this["insideChart"]=! !"1";i0K+=2;}if(Z3C["N7K"](i0K["toString"](),i0K["toString"]()["length"],58643) !== v0K){this["insideChart"]=! !0;}}J8X=this["xAxisAsFooter"] === !0?this["chart"]["canvasHeight"]:this["chart"]["panel"]["bottom"];this["overXAxis"]=this["insideChart"] && z8X["ChartEngine"]["crosshairY"] <= J8X + this["top"] && z8X["ChartEngine"]["crosshairY"] > J8X - this["xaxisHeight"] + this["top"];this["overYAxis"]=(this["cx"] >= this["currentPanel"]["right"] || this["cx"] <= this["currentPanel"]["left"]) && this["insideChart"];if(this["overXAxis"] || this["overYAxis"] || !this["insideChart"] && !this["grabbingScreen"]){this["undisplayCrosshairs"]();if(!this["overXAxis"] && !this["overYAxis"]){return;};}function S8X(u8X){var p0b=922807478,w0b=74085609,d0b=1664833529,U0b=-889801644,r0b=1680149085,R0b=-1828730797,X0b=2036392263,h0b=-2070144747,F0b=1085048824,n0b=330541350,Q7b=-1038932001,P7b=-95601046,K7b=-129455747,D7b=-2041093889,V7b=1400983248,f7b=-1798274583;if(!(Z3C.p96(0,false,471496) !== p0b && Z3C.w96(0,false,870984) !== w0b && Z3C.p96(11,false,223334) !== d0b && Z3C.w96(0,false,888470) !== U0b && Z3C.p96(10,false,615362) !== r0b && Z3C.p96(0,false,974810) !== R0b && Z3C.w96(10,false,197649) !== X0b && Z3C.p96(0,false,227072) !== h0b && Z3C.w96(11,false,891511) !== F0b && Z3C.p96(0,false,990307) !== n0b && Z3C.w96(10,false,754913) !== Q7b && Z3C.w96(0,false,917099) !== P7b && Z3C.w96(10,false,407602) !== K7b && Z3C.w96(0,false,430876) !== D7b && Z3C.p96(10,false,217951) !== V7b && Z3C.w96(0,false,970664) !== f7b)){u8X["runAppend"]("mousemoveinner",W8X);}}if(!this["displayCrosshairs"] && !z8X["ChartEngine"]["resizingPanel"]){this["undisplayCrosshairs"]();return;}if(this["repositioningBaseline"]){N8X=this["panels"][this["chart"]["panel"]["name"]];this["chart"]["baseline"]["userLevel"]=this["adjustIfNecessary"](N8X,this["crosshairTick"],this["valueFromPixel"](this["backOutY"](z8X["ChartEngine"]["crosshairY"]),N8X));if(Date["now"]() - this["repositioningBaseline"]["lastDraw"] > 100){I1K=395788635;d1K=-1513476227;J1K=2;for(var h1K=1;Z3C["E7K"](h1K["toString"](),h1K["toString"]()["length"],66091) !== I1K;h1K++){this["draw"]();J1K+=2;}if(Z3C["E7K"](J1K["toString"](),J1K["toString"]()["length"],+"88619") !== d1K){this["draw"]();}this["repositioningBaseline"]["lastDraw"]=Date["now"]();}return S8X(this);}if(this["grabbingScreen"] && !z8X["ChartEngine"]["resizingPanel"]){if(this["highlightedDraggable"]){this["displayDragOK"](!0);this["dragPlotOrAxis"](o8X,i8X);return S8X(this);}if(this["anyHighlighted"]){z8X["clearCanvas"](this["chart"]["tempCanvas"],this);this["anyHighlighted"]=!{};for(m8X in this["overlays"]){this["overlays"][m8X]["highlight"]=!1;}for(m8X in K8X["series"]){K8X["series"][m8X]["highlight"]=![];}this["displaySticky"]();}if(this["grabStartX"] == -1){this["grabStartX"]=z8X["ChartEngine"]["crosshairX"];this["grabStartScrollX"]=K8X["scroll"];}if(this["grabStartY"] == -1){this["grabStartY"]=z8X["ChartEngine"]["crosshairY"];this["grabStartScrollY"]=this["currentPanel"]["yAxis"]["scroll"];}H8X=z8X["ChartEngine"]["crosshairX"] - this["grabStartX"];d8X=z8X["ChartEngine"]["crosshairY"] - this["grabStartY"];if(H8X === +"0" && d8X === 0){return;}if(Math["abs"](H8X) + Math["abs"](d8X) > 5){this["grabOverrideClick"]=!0;}q8X=this["layout"]["candleWidth"];if(this["allowZoom"] && this["grabMode"] != "pan" && (this["grabMode"]["indexOf"]("zoom") === 0 || this["overXAxis"] || this["grabStartYAxis"])){if(this["grabMode"] === ""){if(this["overXAxis"]){this["grabMode"]="zoom-x";}else if(this["grabStartYAxis"]){this["grabMode"]="zoom-y";}}if(this["grabMode"] == "zoom-x"){d8X=0;}else if(this["grabMode"] == "zoom-y"){H8X=0;}if(H8X){this["grabStartX"]=z8X["ChartEngine"]["crosshairX"];G8X=q8X - H8X / this["chart"]["maxTicks"];this["zoomSet"](G8X,this["chart"]);}if(this["layout"]["setSpan"]){this["layout"]["setSpan"]=null;this["changeOccurred"]("layout");}e8X=this["grabStartYAxis"];if(e8X){if(e8X["flipped"]){d8X*=- +"1";}e8X["zoom"]=Math["round"](this["grabStartZoom"] + d8X);if(this["grabStartZoom"] < e8X["height"]){if(e8X["zoom"] >= e8X["height"]){Z3C["h7L"](2);var J6K=Z3C["G7L"](12,5,13,5,215);e8X["zoom"]=e8X["height"] - J6K;}}else {if(e8X["zoom"] <= e8X["height"]){e8X["zoom"]=e8X["height"] + 1;}}}}else if(!this["overYAxis"]){w1K="m";w1K+="o";w1K+="v";w1K+="e";o1K=512192064;c1K=-905363763;Z3C["W7L"](0);K1K=Z3C["G7L"](0,"2");for(var p1K=1;Z3C["N7K"](p1K["toString"](),p1K["toString"]()["length"],23659) !== o1K;p1K++){this["dispatch"]("",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:!1});K1K+=2;}if(Z3C["N7K"](K1K["toString"](),K1K["toString"]()["length"],"71657" | 5385) !== c1K){this["dispatch"]("",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:! !""});}this["dispatch"](w1K,{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:! ![]});if(this["allowScroll"]){if(Math["abs"](d8X) < this["yTolerance"]){if(!this["yToleranceBroken"]){d8X=0;if(H8X === 0){return;}}}else {f1K=890662023;Z1K=-1981938916;Q1K=2;for(var e1K=1;Z3C["N7K"](e1K["toString"](),e1K["toString"]()["length"],+"57114") !== f1K;e1K++){this["yToleranceBroken"]=!{};Q1K+=2;}if(Z3C["E7K"](Q1K["toString"](),Q1K["toString"]()["length"],"46717" ^ 0) !== Z1K){this["yToleranceBroken"]=!"";}}if(!this["grabStartMicropixels"]){this["grabStartMicropixels"]=0;}this["grabMode"]="pan";K8X["scroll"]=this["grabStartScrollX"];Z3C["W7L"](3);var z6K=Z3C["G7L"](18,12,216);this["micropixels"]=this["grabStartMicropixels"] + H8X * (this["shift"]?5:z6K);if(!this["lineTravelSpacing"]){while(this["micropixels"] > 0){this["micropixels"]-=q8X;K8X["scroll"]++;}while(this["micropixels"] < -q8X){this["micropixels"]+=q8X;K8X["scroll"]--;}}if(K8X["scroll"] >= K8X["maxTicks"]){this["preferences"]["whitespace"]=this["initialWhitespace"];}else {this["preferences"]["whitespace"]=(K8X["maxTicks"] - K8X["scroll"]) * q8X;}if(this["currentPanel"] == this["grabStartPanel"]){e8X=this["currentPanel"]["yAxis"];if(e8X["flipped"]){d8X*=- +"1";}e8X["scroll"]=this["grabStartScrollY"] + d8X;}E0K=-2003857720;N0K=- +"731966764";Z3C["h7L"](4);a0K=Z3C["G7L"]("2",0);for(var w0K=1;Z3C["E7K"](w0K["toString"](),w0K["toString"]()["length"],24113) !== E0K;w0K++){this["dispatch"]("scroll",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"]});a0K+=2;}if(Z3C["E7K"](a0K["toString"](),a0K["toString"]()["length"],20806) !== N0K){this["dispatch"]("",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"]});}}}C8X=function(A4X){var t7b=117095561,o7b=1209602997,g7b=-594592874,q7b=-1239750486,W7b=869323139,m7b=1773574832,Y7b=1027646445,L7b=943437917,N7b=-643253828,C7b=-744493700,x7b=603502947,b7b=1087832390,y7b=2143564387,e7b=-1889684306,M7b=1275534845,J7b=-1762485707;if(Z3C.w96(0,false,432277) === t7b || Z3C.w96(0,false,507515) === o7b || Z3C.w96(11,false,372760) === g7b || Z3C.w96(0,false,278434) === q7b || Z3C.p96(10,false,749521) === W7b || Z3C.p96(0,false,708655) === m7b || Z3C.w96(10,false,557047) === Y7b || Z3C.p96(0,false,538177) === L7b || Z3C.w96(11,false,425557) === N7b || Z3C.p96(0,false,555285) === C7b || Z3C.p96(10,false,948000) === x7b || Z3C.p96(0,false,704894) === b7b || Z3C.w96(10,false,780852) === y7b || Z3C.p96(0,false,556581) === e7b || Z3C.p96(10,false,655909) === M7b || Z3C.w96(0,false,876292) === J7b){return function(){var u7b=2132801567,Z7b=-1688492932,k7b=1102057279,z7b=-2006521865,T7b=-580837784,i7b=41975959,H7b=-615215832,j7b=-487022212,v7b=420728283,c7b=-1007409391,O7b=-1451845162,A7b=-287688884,B7b=544628650,I7b=1449087333,s7b=-1620574172,E7b=1829411877;Z3C.y3C();if(Z3C.w96(0,false,618467) === u7b || Z3C.w96(0,false,237167) === Z7b || Z3C.p96(11,false,194740) === k7b || Z3C.p96(0,false,429319) === z7b || Z3C.p96(10,false,244411) === T7b || Z3C.w96(0,false,995957) === i7b || Z3C.p96(10,false,316677) === H7b || Z3C.p96(0,false,437194) === j7b || Z3C.p96(11,false,465118) === v7b || Z3C.w96(0,false,993942) === c7b || Z3C.w96(10,false,732158) === O7b || Z3C.p96(0,false,862554) === A7b || Z3C.w96(10,false,671304) === B7b || Z3C.p96(0,false,807586) === I7b || Z3C.w96(10,false,394197) === s7b || Z3C.p96(0,false,546654) === E7b){A4X["draw"]();A4X["updateChartAccessories"]();}};}};if(z8X["ChartEngine"]["useAnimation"]){window["requestAnimationFrame"](C8X(this));}else {this["draw"]();this["updateChartAccessories"]();}if(this["activeDrawing"]){z8X["clearCanvas"](this["chart"]["tempCanvas"],this);this["activeDrawing"]["render"](this["chart"]["tempCanvas"]["context"]);this["activeDrawing"]["measure"]();}Z3C["h7L"](4);k0K=-Z3C["G7L"]("2047319173",168204292);g0K=1026283953;L0K=2;for(var Z0K=1;Z3C["E7K"](Z0K["toString"](),Z0K["toString"]()["length"],2826) !== k0K;Z0K++){this["undisplayCrosshairs"]();L0K+=2;}if(Z3C["N7K"](L0K["toString"](),L0K["toString"]()["length"],42630) !== g0K){this["undisplayCrosshairs"]();}this["undisplayCrosshairs"]();return;}this["grabMode"]="";if(this["overXAxis"] || this["overYAxis"]){this["updateChartAccessories"]();this["findHighlights"]();return S8X(this);;}if(this["controls"]["crossX"]){Z3C["W7L"](5);var b6K=Z3C["G7L"](4,44,10,20,2);this["controls"]["crossX"]["style"]["left"]=this["pixelFromTick"](this["crosshairTick"],K8X) - "0.5" * b6K + "px";}if(this["controls"]["crossY"]){this["controls"]["crossY"]["style"]["top"]=this["crossYActualPos"] + H6K;}if(this["insideChart"] && !z8X["ChartEngine"]["resizingPanel"]){j8X=this["currentVectorParameters"]["vectorType"];if(this["layout"]["studies"]){T8X=this["layout"]["studies"][this["currentPanel"]["name"]];if(T8X){if(!this["preferences"]["dragging"] || !this["preferences"]["dragging"]["study"]){delete this["overlays"][T8X["name"]];}if(j8X){this["overlays"][T8X["name"]]=T8X;}}}if(!z8X["Drawing"] || !j8X || !z8X["Drawing"][j8X] || !new z8X["Drawing"][j8X]()["dragToDraw"]){this["doDisplayCrosshairs"]();}this["updateChartAccessories"]();}else {this["undisplayCrosshairs"]();}if(this["magnetize"]){this["magnetize"]();}if(this["repositioningDrawing"]){this["repositionDrawing"](this["repositioningDrawing"]);}else if(z8X["ChartEngine"]["drawingLine"]){if(this["activeDrawing"]){S1K=-510878455;y1K=-475039504;Y1K=2;for(var j1K=1;Z3C["E7K"](j1K["toString"](),j1K["toString"]()["length"],68616) !== S1K;j1K++){N8X=this["panels"][this["activeDrawing"]["panelName"]];Y1K+=2;}if(Z3C["N7K"](Y1K["toString"](),Y1K["toString"]()["length"],79470) !== y1K){N8X=this["panels"][this["activeDrawing"]["panelName"]];}s8X=this["adjustIfNecessary"](N8X,this["crosshairTick"],this["valueFromPixel"](this["backOutY"](z8X["ChartEngine"]["crosshairY"]),N8X));if(this["magnetizedPrice"] && N8X["name"] == this["currentPanel"]["name"]){s8X=this["adjustIfNecessary"](N8X,this["crosshairTick"],this["magnetizedPrice"]);}if(this["magnetizedPrice"] === null){z8X["clearCanvas"](this["chart"]["tempCanvas"],this);}this["activeDrawing"]["move"](this["chart"]["tempCanvas"]["context"],this["crosshairTick"],s8X);if(this["activeDrawing"]["measure"]){this["activeDrawing"]["measure"]();}}}else if(z8X["ChartEngine"]["resizingPanel"]){this["resizePanels"]();}if(this["insideChart"]){this["dispatch"]("move",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:![]});this["findHighlights"](this["highlightViaTap"]);}return S8X(this);}};z8X.ChartEngine.prototype.swipeStart=function(t4X){var E4X;if(this.swipe && this.swipe.interval){clearInterval(this.swipe.interval);}this.swipe.velocity=0;this.swipe.amplitude=0;this.swipe.frame=t4X.scroll;this.swipe.micropixels=this.micropixels;this.swipe.timestamp=Date.now();this.swipe.chart=t4X;this.swipe.end=![];this.swipe.timeConstant=325;this.swipe.cb=null;E4X=this;requestAnimationFrame(function(){E4X.swipeSample();});};z8X.ChartEngine.prototype.swipeSample=function(){var f4X,n4X,O4X,Z4X,V4X,Q4X,p4X,M4X,b4X;f4X=this.swipe;if(f4X.end){return;}n4X=this;p4X=+"20";O4X=Date.now();Z4X=O4X - f4X.timestamp;if(Z4X < p4X){requestAnimationFrame(function(){Z3C.a3C();n4X.swipeSample();});return;}M4X=z8X.touchDevice?+"0.4":0.8;f4X.timestamp=O4X;V4X=(f4X.chart.scroll - f4X.frame) * this.layout.candleWidth + this.micropixels - f4X.micropixels;f4X.frame=f4X.chart.scroll;f4X.micropixels=this.micropixels;Z3C.h7L(6);Q4X=Z3C.G7L(1000,Z4X,V4X,1);Z3C.a3C();b4X=M4X * Q4X + 0.2 * f4X.velocity;if(Math.abs(b4X) > Math.abs(f4X.velocity)){f4X.velocity=b4X;}if(Math.abs(V4X) < 6){f4X.velocity=0;;}requestAnimationFrame(function(){Z3C.y3C();n4X.swipeSample();});};z8X.ChartEngine.prototype.swipeRelease=function(){var l4X,H1K,l1K,k1K,c4X;l4X=this.swipe;if(l4X.velocity > +"3000"){l4X.velocity=3000;}if(l4X.velocity < - +"3000"){l4X.velocity=-3000;}if(l4X.velocity > 10 || l4X.velocity < - +"10"){l4X.amplitude=0.8 * l4X.velocity;l4X.scroll=l4X.chart.scroll;H1K=-1469635647;l1K=- +"1307283921";k1K=2;for(var L1K="1" * 1;Z3C.N7K(L1K.toString(),L1K.toString().length,89695) !== H1K;L1K++){l4X.target=l4X.amplitude;l4X.timestamp=Date.now();c4X=this;if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}k1K+=2;}if(Z3C.N7K(k1K.toString(),k1K.toString().length,33188) !== l1K){l4X.target=l4X.amplitude;l4X.timestamp=Date.now();c4X=this;if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}}l4X.target=l4X.amplitude;l4X.timestamp=Date.now();c4X=this;if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}requestAnimationFrame(function(){Z3C.a3C();c4X.autoscroll();});}};z8X.ChartEngine.prototype.dragPlotOrAxis=function(z4X,K4X){var e6K,x6K,W4X,v4X,E7X,P4X,d4X,R4X,X4X,L4X,y4X,x4X,q4X,H4X,w4X,j4X,P1K,G1K,E1K,Z6K,N4X,r4X,U4X,T4X,S4X,Z7X,G4X,C4X,V7X,D4X,I4X,Q6K,O0K,X0K,n0K,o6K,f7X,n7X,O7X,F4X,c6K,K6K,u6K,q0K,U0K,t0K,B4X,J4X,Q7X,D1K,W1K,M1K,p6K,M7X,u4X,i4X,l7X,K0K,u0K,p0K,s4X,g4X,k4X,J0K,R0K,h0K,V6K,Q0K,x0K,e0K,Y7X,e4X,h7X,a4X,o4X,z1K,b1K,q1K,O6K,X6K,n6K,A7X,t7X;e6K="r";e6K+="ig";e6K+="h";e6K+="t";x6K="no";x6K+="ne";if(!R7X.call(this) && !this.grabbingScreen){return;}W4X=null;v4X=20;E7X=10;Z3C.W7L(0);P4X=this.whichPanel(Z3C.G7L(v4X,K4X));Z3C.h7L(7);d4X=this.whichPanel(Z3C.d7L(K4X,v4X));R4X=this.whichPanel(K4X);X4X=this.highlightedDraggable;function R7X(){var L7X,g6K,k6K,l6K,X7X;L7X=! !0;for(var U7X in this.panels){g6K="lef";g6K+="t";k6K="a";k6K+="l";k6K+="l";l6K="dr";l6K+="o";l6K+="pzone";[l6K,k6K,g6K,"right","top","bottom"].forEach(B7X(this.panels[U7X]));for(X7X=0;X7X < this.panels[U7X].yaxisLHS.length;X7X++){if(this.panels[U7X].yaxisLHS[X7X].dropzone){L7X=! ![];}this.panels[U7X].yaxisLHS[X7X].dropzone=null;}for(X7X=0;X7X < this.panels[U7X].yaxisRHS.length;X7X++){if(this.panels[U7X].yaxisRHS[X7X].dropzone){L7X=!0;}this.panels[U7X].yaxisRHS[X7X].dropzone=null;}}function B7X(D7X){return function(I7X){if(D7X.subholder.classList.contains(I7X)){D7X.subholder.classList.remove(I7X);L7X=! ![];}};}return L7X;}if(!R4X){return;}if(X4X.undraggable && X4X.undraggable(this)){return;}L4X=this.whichYAxis(R4X,z4X,K4X);Z3C.W7L(0);y4X=this.whichYAxis(R4X,Z3C.d7L(E7X,z4X),K4X);Z3C.W7L(7);x4X=this.whichYAxis(R4X,Z3C.G7L(z4X,E7X),K4X);if(this.xAxisAsFooter && R4X.name == Object.keys(this.panels).pop()){d4X=this.whichPanel(K4X + v4X + this.xaxisHeight);if(W4X){W4X+=this.xaxisHeight;}}q4X=! !"";H4X=!1;w4X=![];if(z8X.Renderer){q4X=X4X instanceof z8X.Renderer;}if(z8X.Studies){H4X=X4X instanceof z8X.Studies.StudyDescriptor;}w4X=X4X instanceof z8X.ChartEngine.YAxis;j4X=function(w7X){var f6K,L6K;if(!w4X){f6K="l";f6K+="e";f6K+="ft";L6K="ri";L6K+="ght";if(w7X == L6K){Z3C.h7L(8);var q6K=Z3C.G7L(9,126,84);return R4X.right - R4X.width / q6K;}if(w7X == f6K){return R4X.left + R4X.width / 6;}}Z3C.h7L(8);var t6K=Z3C.G7L(2,15,15);return (R4X.left + R4X.right) / t6K;};if(!w4X && !L4X){P1K=-2145856886;G1K=-779490682;Z3C.h7L(0);E1K=Z3C.d7L(0,"2");for(var a1K=1;Z3C.E7K(a1K.toString(),a1K.toString().length,+"39444") !== P1K;a1K++){Z6K="l";Z6K+="ef";Z6K+="t";if(z4X >= j4X(Z6K)){y4X=this.whichYAxis(R4X,R4X.left % 9,K4X);}else if(z4X >= j4X("right")){x4X=this.whichYAxis(R4X,R4X.right - 3,K4X);}E1K+=2;}if(Z3C.E7K(E1K.toString(),E1K.toString().length,62051) !== G1K){if(z4X >= j4X("left")){y4X=this.whichYAxis(R4X,R4X.left % 9,K4X);}else if(z4X >= j4X("right")){x4X=this.whichYAxis(R4X,R4X.right - 3,K4X);}}if(z4X < j4X("left")){y4X=this.whichYAxis(R4X,R4X.left - 1,K4X);}else if(z4X > j4X("right")){x4X=this.whichYAxis(R4X,R4X.right + 1,K4X);}}N4X=[];if(X4X.getDependents){N4X=X4X.getDependents(this,! !{});}r4X=X4X.panel;U4X=X4X.getYAxis(this);if(q4X){r4X=X4X.params.panel;}else if(w4X){r4X=this.grabStartPanel.name;}T4X=this.panels[r4X];for(S4X in this.panels){if(this.panels[S4X].soloing){Z7X=! ![];}}G4X=U4X.isShared(this);C4X=!w4X && !Z7X && (T4X !== R4X && T4X != P4X && T4X != d4X || !this.checkForEmptyPanel(T4X,! !{},[X4X].concat(N4X)));V7X=r4X == R4X.name && U4X !== L4X && U4X !== x4X && U4X !== y4X || G4X;if(C4X && (!P4X || R4X !== P4X)){Q6K="drop";Q6K+="zon";Q6K+="e";R4X.subholder.classList.add(Q6K);R4X.subholder.classList.add("top");d4X=R4X;}else if(C4X && (!d4X || R4X !== d4X)){R4X.subholder.classList.add("dropzone");R4X.subholder.classList.add("bottom");}else if(R4X !== T4X){if(!w4X && !R4X.noDrag){R4X.subholder.classList.add("dropzone");R4X.subholder.classList.add("all");O0K=-1879659716;X0K=-770507684;n0K=2;for(var d0K=1;Z3C.N7K(d0K.toString(),d0K.toString().length,62048) !== O0K;d0K++){D4X=R4X.name;n0K+=2;}if(Z3C.E7K(n0K.toString(),n0K.toString().length,"78798" - 0) !== X0K){D4X=R4X.name;}}}else if((!R4X.yaxisRHS.length || R4X.yaxisRHS.length == 1 && R4X.yaxisRHS[0] == U4X && U4X.position == x6K) && !L4X && !x4X && z4X > j4X(e6K)){o6K="rig";o6K+="ht";R4X.subholder.classList.add("dropzone");R4X.subholder.classList.add("right");I4X=o6K;}else if((!R4X.yaxisLHS.length || R4X.yaxisLHS.length == ("1" & 2147483647) && R4X.yaxisLHS[0] == U4X && U4X.position == "none") && !L4X && !y4X && z4X < j4X("left")){R4X.subholder.classList.add("dropzone");R4X.subholder.classList.add("left");I4X="left";}else if(V7X){if(w4X && z4X > R4X.left && z4X < R4X.right){f7X=R4X.yaxisLHS[R4X.yaxisLHS.length - 1];n7X=R4X.yaxisRHS[0];O7X=j4X();if(z4X < O7X && f7X != U4X){y4X=f7X;}else if(z4X > O7X && n7X != U4X){x4X=n7X;}}if(!w4X || L4X !== U4X){F4X=!w4X && G4X;if(x4X && (x4X !== U4X || F4X) && (!L4X || L4X !== x4X)){c6K="righ";c6K+="t";x4X.dropzone="left";I4X=x4X.position || this.chart.panel.yAxis.position || c6K;}else if(y4X && (y4X !== U4X || F4X) && (!L4X || L4X !== y4X)){K6K="r";K6K+="i";K6K+="gh";K6K+="t";y4X.dropzone="right";I4X=y4X.position || this.chart.panel.yAxis.position || K6K;}else if(L4X){u6K="r";u6K+="i";u6K+="gh";u6K+="t";if(!x4X && (L4X !== U4X || F4X)){L4X.dropzone="right";}else if(!y4X && (L4X !== U4X || F4X)){L4X.dropzone="left";}else if(L4X !== U4X){q0K=-188617198;U0K=-800414419;t0K=2;for(var y0K=1;Z3C.N7K(y0K.toString(),y0K.toString().length,66284) !== q0K;y0K++){L4X.dropzone="all";t0K+=2;}if(Z3C.E7K(t0K.toString(),t0K.toString().length,+"86849") !== U0K){L4X.dropzone="";}}if(L4X.dropzone){I4X=L4X.position || this.chart.panel.yAxis.position || u6K;}}}}if(this.grabbingScreen || !R4X.subholder.classList.contains("dropzone") && !I4X){this.draw();return;}J4X=- +"1";if(!D4X && !I4X && C4X){D4X=H4X?X4X.inputs.id:X4X.params.name || z8X.uniqueID();for(var b7X in this.panels){J4X++;if(this.panels[b7X] == d4X)break;}if(!d4X){J4X++;}if(this.panels[r4X].yAxis.name == D4X){r4X=this.electNewPanelOwner(r4X);}Q7X=H4X?X4X.inputs.display:null;if(r4X){this.createPanel(Q7X || D4X,D4X,W4X,this.chart.name,new z8X.ChartEngine.YAxis({name:D4X}));}else {D1K=+"522249207";W1K=-1568063215;M1K=2;for(var C1K=+"1";Z3C.E7K(C1K.toString(),C1K.toString().length,86755) !== D1K;C1K++){r4X=D4X;M1K+=2;}if(Z3C.E7K(M1K.toString(),M1K.toString().length,89078) !== W1K){r4X=D4X;}r4X=D4X;}if(H4X){X4X.panel=r4X;}else {X4X.params.panel=r4X;}}if(D4X){if(H4X){p6K="Studie";p6K+="s.replac";p6K+="eSt";p6K+="udy";if(!X4X.parameters){X4X.parameters={};}X4X.parameters.panelName=D4X;this.highlightedDraggable=z8X.getFn(p6K)(this,X4X.inputs.id,X4X.type,X4X.inputs,X4X.outputs,X4X.parameters,null,X4X.study);}else if(q4X){for(var p7X in X4X.seriesParams){M7X=X4X.seriesParams[p7X];u4X=null;if(X4X.params.yAxis){if(X4X.params.yAxis !== this.chart.panel.yAxis){u4X=X4X.params.yAxis;u4X.name=X4X.params.name;}}this.modifySeries(M7X.id,{panel:D4X,yAxis:u4X});}}if(J4X > -1){i4X={};l7X=0;for(S4X in this.panels){if(J4X == l7X++){i4X[D4X]=this.panels[D4X];}if(S4X == D4X)continue;i4X[S4X]=this.panels[S4X];}K0K=1662942180;u0K=-2095726150;p0K=2;for(var V0K=+"1";Z3C.N7K(V0K.toString(),V0K.toString().length,+"68177") !== K0K;V0K++){if(!i4X[D4X]){i4X[D4X]=this.panels[D4X];}this.panels=i4X;p0K+=2;}if(Z3C.E7K(p0K.toString(),p0K.toString().length,"99410" * 1) !== u0K){if(-i4X[D4X]){i4X[D4X]=this.panels[D4X];}this.panels=i4X;}}this.checkForEmptyPanel(r4X);for(var m4X=0;m4X < N4X.length;m4X++){if(N4X[m4X].params){this.checkForEmptyPanel(N4X[m4X].params.name);}else {this.checkForEmptyPanel(N4X[m4X].name);}}this.adjustPanelPositions();}else if(I4X){s4X=function(x7X,r7X,K7X,z7X){var y7X,T6K,d7X;if(K7X == "study"){T6K="S";T6K+="tudies.replaceStudy";if(!r7X.parameters){r7X.parameters={};}if(z7X){r7X.parameters.yaxisDisplayValue=z7X.position;}else {delete r7X.parameters.yaxisDisplayValue;}y7X=z8X.getFn(T6K)(x7X,r7X.inputs.id,r7X.type,r7X.inputs,r7X.outputs,r7X.parameters,r7X.panel,r7X.study);}if(K7X == "renderer"){for(var e7X in r7X.seriesParams){d7X=r7X.seriesParams[e7X];y7X=x7X.modifySeries(d7X.id,{panel:D4X,yAxis:z7X});}}return y7X;};g4X=L4X && L4X.dropzone == "all";if(!g4X){if(w4X){X4X.position=I4X;if(this.layout.studies){k4X=this.layout.studies[X4X.name];if(k4X){J0K=2035988378;R0K=-499820264;h0K=2;for(var b0K=+"1";Z3C.E7K(b0K.toString(),b0K.toString().length,42296) !== J0K;b0K++){if(!k4X.parameters){k4X.parameters={};}k4X.parameters.yaxisDisplayValue=I4X;h0K+=2;}if(Z3C.E7K(h0K.toString(),h0K.toString().length,67978) !== R0K){if(~k4X.parameters){k4X.parameters={};}k4X.parameters.yaxisDisplayValue=I4X;}}}}else if(H4X){V6K="st";V6K+="udy";this.highlightedDraggable=s4X(this,X4X,V6K,{position:I4X});}else if(q4X){Q0K=+"52027170";x0K=-76870800;e0K=2;for(var c0K=1;Z3C.N7K(c0K.toString(),c0K.toString().length,82482) !== Q0K;c0K++){s4X(this,X4X,"",new z8X.ChartEngine.YAxis({name:X4X.params.name && z8X.uniqueID(),position:I4X}));e0K+=2;}if(Z3C.E7K(e0K.toString(),e0K.toString().length,86717) !== x0K){s4X(this,X4X,"renderer",new z8X.ChartEngine.YAxis({name:X4X.params.name || z8X.uniqueID(),position:I4X}));}}U4X=this.highlightedDraggable.getYAxis(this);}if(!G4X || !g4X || w4X){Y7X=U4X;if(g4X && U4X == this.chart.panel.yAxis){Y7X=L4X;}for(B4X=0;B4X < R4X.yaxisLHS.length;B4X++){if(R4X.yaxisLHS[B4X] == Y7X){R4X.yaxisLHS.splice(B4X,1);break;}}for(B4X=0;B4X < R4X.yaxisRHS.length;B4X++){if(R4X.yaxisRHS[B4X] == Y7X){R4X.yaxisRHS.splice(B4X,1);break;}}}if(g4X){if(this.getYAxisByName(R4X,U4X.name) == R4X.yAxis){this.electNewPanelOwner(R4X,L4X);}if(w4X){a4X=U4X;o4X=L4X;if(U4X == this.chart.panel.yAxis){a4X=L4X;o4X=U4X;}for(h7X in a4X.studies){s4X(this,this.layout.studies[a4X.studies[h7X]],"study",o4X === this.chart.panel.yAxis?null:{position:o4X.name});}for(h7X in a4X.renderers){s4X(this,this.chart.seriesRenderers[a4X.renderers[h7X]],"renderer",o4X);}this.highlightedDraggable=o4X;}else if(H4X){z1K=-2102267716;b1K=-1228074152;q1K=2;for(var t1K=1;Z3C.E7K(t1K.toString(),t1K.toString().length,57798) !== z1K;t1K++){this.highlightedDraggable=s4X(this,X4X,"",{position:L4X.name});q1K+=2;}if(Z3C.E7K(q1K.toString(),q1K.toString().length,"11121" * 1) !== b1K){this.highlightedDraggable=s4X(this,X4X,"study",{position:L4X.name});}}else if(q4X){O6K="render";O6K+="er";s4X(this,X4X,O6K,L4X);}}else {X6K="le";X6K+="ft";if(U4X.position == "none"){U4X.width=z8X.ChartEngine.YAxis.prototype.width;}U4X.position=I4X;e4X=I4X == X6K?R4X.yaxisLHS:R4X.yaxisRHS;for(B4X=+"0";B4X < e4X.length;B4X++){if(e4X[B4X] !== U4X){n6K="l";n6K+="ef";n6K+="t";if(e4X[B4X].dropzone == n6K){e4X.splice(B4X,0,U4X);}else if(e4X[B4X].dropzone == "right"){Z3C.h7L(9);e4X.splice(Z3C.d7L("1",B4X),0,U4X);}else continue;}break;}if(B4X == e4X.length){e4X.push(U4X);}}}for(var c7X in this.panels){A7X=this.panels[c7X];t7X=A7X.yaxisLHS.concat(A7X.yaxisRHS);for(B4X=0;B4X < t7X.length;B4X++){t7X[B4X].height=A7X.yAxis.height;this.calculateYAxisMargins(t7X[B4X]);}}this.displayDragOK();this.draw();this.calculateYAxisPositions();this.draw();this.findHighlights(null,! !{});this.savePanels();};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
w411.r72=(function(){var I=2;for(;I !== 9;){switch(I){case 5:var r;try{var x=2;for(;x !== 6;){switch(x){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\x50\u0072\x6f\x70\x65\u0072\x74\x79'](Object['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65'],'\u0059\u0063\x24\x63\u0078',{'\x67\x65\x74':function(){var f=2;for(;f !== 1;){switch(f){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});r=Yc$cx;r['\u0043\x76\x72\x4c\u004b']=r;x=4;break;case 4:x=typeof CvrLK === '\x75\u006e\x64\u0065\u0066\x69\u006e\u0065\x64'?3:9;break;case 9:delete r['\u0043\u0076\u0072\u004c\u004b'];var c=Object['\x70\x72\u006f\u0074\u006f\u0074\x79\x70\u0065'];delete c['\x59\x63\x24\x63\x78'];x=6;break;case 3:throw "";x=9;break;}}}catch(o){r=window;}return r;break;case 1:return globalThis;break;case 2:I=typeof globalThis === '\u006f\u0062\x6a\x65\x63\x74'?1:5;break;}}})();;o8tt(w411.r72);j1AA(w411.r72);w411.N5j=function(){return typeof w411.q5j.L8a === 'function'?w411.q5j.L8a.apply(w411.q5j,arguments):w411.q5j.L8a;};w411.V5j=function(){return typeof w411.q5j.L8a === 'function'?w411.q5j.L8a.apply(w411.q5j,arguments):w411.q5j.L8a;};w411.E8P=(function(){var u52=function(q52,W72){var c52=W72 & 0xffff;var H72=W72 - c52;return (H72 * q52 | 0) + (c52 * q52 | 0) | 0;},Q52=function(g72,s72,F72){var I72=0xcc9e2d51,d72=0x1b873593;var M72=F72;var B72=s72 & ~0x3;for(var f72=0;f72 < B72;f72+=4){var O72=g72.V8tt(f72) & 0xff | (g72.V8tt(f72 + 1) & 0xff) << 8 | (g72.V8tt(f72 + 2) & 0xff) << 16 | (g72.V8tt(f72 + 3) & 0xff) << 24;O72=u52(O72,I72);O72=(O72 & 0x1ffff) << 15 | O72 >>> 17;O72=u52(O72,d72);M72^=O72;M72=(M72 & 0x7ffff) << 13 | M72 >>> 19;M72=M72 * 5 + 0xe6546b64 | 0;}O72=0;switch(s72 % 4){case 3:O72=(g72.V8tt(B72 + 2) & 0xff) << 16;case 2:O72|=(g72.V8tt(B72 + 1) & 0xff) << 8;case 1:O72|=g72.V8tt(B72) & 0xff;O72=u52(O72,I72);O72=(O72 & 0x1ffff) << 15 | O72 >>> 17;O72=u52(O72,d72);M72^=O72;}M72^=s72;M72^=M72 >>> 16;M72=u52(M72,0x85ebca6b);M72^=M72 >>> 13;M72=u52(M72,0xc2b2ae35);M72^=M72 >>> 16;return M72;};return {A52:Q52};})();function j1AA(w5j){function G4j(S5j){var z5j=2;for(;z5j !== 5;){switch(z5j){case 2:var c5j=[arguments];return c5j[0][0];break;}}}function N4j(o5j){var d5j=2;for(;d5j !== 5;){switch(d5j){case 2:var a5j=[arguments];return a5j[0][0].Array;break;}}}function q4j(M5j,k5j,l5j,m5j,j5j){var e5j=2;for(;e5j !== 9;){switch(e5j){case 2:var D6j=[arguments];D6j[6]="rty";D6j[8]="pe";D6j[4]="definePro";e5j=3;break;case 3:try{var Z5j=2;for(;Z5j !== 8;){switch(Z5j){case 2:D6j[1]={};D6j[9]=(1,D6j[0][1])(D6j[0][0]);D6j[7]=[D6j[9],D6j[9].prototype][D6j[0][3]];D6j[1].value=D6j[7][D6j[0][2]];Z5j=3;break;case 3:try{var t5j=2;for(;t5j !== 3;){switch(t5j){case 2:D6j[5]=D6j[4];D6j[5]+=D6j[8];D6j[5]+=D6j[6];t5j=4;break;case 4:D6j[0][0].Object[D6j[5]](D6j[7],D6j[0][4],D6j[1]);t5j=3;break;}}}catch(k6j){}D6j[7][D6j[0][4]]=D6j[1].value;Z5j=8;break;}}}catch(l6j){}e5j=9;break;}}}function n4j(v5j){var I5j=2;for(;I5j !== 5;){switch(I5j){case 2:var Y6j=[arguments];return Y6j[0][0].Function;break;}}}var r5j=2;for(;r5j !== 70;){switch(r5j){case 24:W6j[91]="AA";W6j[83]="";W6j[29]="1";W6j[83]="w";r5j=35;break;case 71:C4j(n4j,"apply",W6j[54],W6j[93]);r5j=70;break;case 77:var C4j=function(B5j,f5j,J5j,h5j){var s5j=2;for(;s5j !== 5;){switch(s5j){case 2:var X6j=[arguments];q4j(W6j[0][0],X6j[0][0],X6j[0][1],X6j[0][2],X6j[0][3]);s5j=5;break;}}};r5j=76;break;case 50:W6j[17]+=W6j[96];W6j[17]+=W6j[24];W6j[25]=W6j[2];W6j[25]+=W6j[24];W6j[25]+=W6j[24];r5j=45;break;case 39:W6j[93]+=W6j[24];W6j[69]=W6j[83];W6j[69]+=W6j[29];W6j[69]+=W6j[91];r5j=54;break;case 15:W6j[16]="z";W6j[81]="";W6j[81]="__optimi";W6j[91]="";r5j=24;break;case 19:W6j[4]="";W6j[4]="e";W6j[78]="X";W6j[16]="";r5j=15;break;case 74:C4j(G4j,W6j[88],W6j[52],W6j[25]);r5j=73;break;case 54:W6j[87]=W6j[81];W6j[87]+=W6j[16];W6j[87]+=W6j[4];W6j[17]=W6j[78];r5j=50;break;case 12:W6j[1]="";W6j[1]="__r";W6j[2]="";W6j[2]="C1";r5j=19;break;case 76:C4j(g4j,"test",W6j[54],W6j[48]);r5j=75;break;case 72:C4j(G4j,W6j[87],W6j[52],W6j[69]);r5j=71;break;case 73:C4j(N4j,"push",W6j[54],W6j[17]);r5j=72;break;case 28:W6j[54]=1;W6j[52]=8;W6j[52]=2;W6j[52]=0;W6j[93]=W6j[65];W6j[93]+=W6j[96];r5j=39;break;case 3:W6j[6]="";W6j[6]="r";W6j[9]="";W6j[9]="al";W6j[7]="";W6j[7]="esidu";W6j[1]="";r5j=12;break;case 45:W6j[88]=W6j[1];W6j[88]+=W6j[7];W6j[88]+=W6j[9];W6j[89]=W6j[6];r5j=62;break;case 58:W6j[50]+=W6j[3];W6j[48]=W6j[4];W6j[48]+=W6j[96];W6j[48]+=W6j[24];r5j=77;break;case 35:W6j[24]="";W6j[24]="A";W6j[96]="";W6j[96]="1A";W6j[65]="R";W6j[54]=6;W6j[54]=4;r5j=28;break;case 75:C4j(G4j,W6j[50],W6j[52],W6j[89]);r5j=74;break;case 2:var W6j=[arguments];W6j[5]="_a";W6j[3]="bstract";W6j[8]="_";r5j=3;break;case 62:W6j[89]+=W6j[29];W6j[89]+=W6j[91];W6j[50]=W6j[8];W6j[50]+=W6j[5];r5j=58;break;}}function g4j(p5j){var y5j=2;for(;y5j !== 5;){switch(y5j){case 2:var b5j=[arguments];return b5j[0][0].RegExp;break;}}}}w411.A4b=function(){return typeof w411.I4b.y4b === 'function'?w411.I4b.y4b.apply(w411.I4b,arguments):w411.I4b.y4b;};w411.b8P=function(){return typeof w411.E8P.A52 === 'function'?w411.E8P.A52.apply(w411.E8P,arguments):w411.E8P.A52;};w411.q5j=(function(){var F5j=2;for(;F5j !== 9;){switch(F5j){case 5:A5j[9]={};A5j[9].L8a=function(){var G5j=2;for(;G5j !== 90;){switch(G5j){case 58:E5j[10]=0;G5j=57;break;case 14:E5j[5].s4b=['Y4b'];E5j[5].V4b=function(){var u4a=function(){return ('aa').lastIndexOf('a');};var W4a=(/\x31/).e1AA(u4a + []);return W4a;};E5j[2]=E5j[5];E5j[1]={};G5j=10;break;case 70:E5j[10]++;G5j=57;break;case 36:E5j[94]=E5j[39];E5j[8].X1AA(E5j[2]);E5j[8].X1AA(E5j[60]);E5j[8].X1AA(E5j[41]);G5j=51;break;case 10:E5j[1].s4b=['H4b'];E5j[1].V4b=function(){var v4a=typeof r1AA === 'function';return v4a;};E5j[4]=E5j[1];G5j=18;break;case 43:E5j[24]={};E5j[24].s4b=['H4b'];E5j[24].V4b=function(){var j4a=typeof w1AA === 'function';return j4a;};E5j[79]=E5j[24];E5j[39]={};E5j[39].s4b=['Y4b'];E5j[39].V4b=function(){var m4a=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var U4a=(/\x74\u0072\u0075\u0065/).e1AA(m4a + []);return U4a;};G5j=36;break;case 67:A5j[8]=24;return 26;break;case 69:G5j=(function(x5j){var H5j=2;for(;H5j !== 22;){switch(H5j){case 7:H5j=C5j[6] < C5j[0][0].length?6:18;break;case 23:return C5j[5];break;case 5:return;break;case 8:C5j[6]=0;H5j=7;break;case 6:C5j[2]=C5j[0][0][C5j[6]];H5j=14;break;case 25:C5j[5]=true;H5j=24;break;case 1:H5j=C5j[0][0].length === 0?5:4;break;case 15:C5j[3]=C5j[7][C5j[6]];C5j[8]=C5j[9][C5j[3]].h / C5j[9][C5j[3]].t;H5j=26;break;case 19:C5j[6]++;H5j=7;break;case 16:H5j=C5j[6] < C5j[7].length?15:23;break;case 26:H5j=C5j[8] >= 0.5?25:24;break;case 24:C5j[6]++;H5j=16;break;case 20:C5j[9][C5j[2][E5j[87]]].h+=true;H5j=19;break;case 13:C5j[9][C5j[2][E5j[87]]]=(function(){var L5j=2;for(;L5j !== 9;){switch(L5j){case 4:u5j[9].t=0;return u5j[9];break;case 2:var u5j=[arguments];u5j[9]={};u5j[9].h=0;L5j=4;break;}}}).R1AA(this,arguments);H5j=12;break;case 2:var C5j=[arguments];H5j=1;break;case 17:C5j[6]=0;H5j=16;break;case 11:C5j[9][C5j[2][E5j[87]]].t+=true;H5j=10;break;case 14:H5j=typeof C5j[9][C5j[2][E5j[87]]] === 'undefined'?13:11;break;case 10:H5j=C5j[2][E5j[45]] === E5j[99]?20:19;break;case 18:C5j[5]=false;H5j=17;break;case 12:C5j[7].X1AA(C5j[2][E5j[87]]);H5j=11;break;case 4:C5j[9]={};C5j[7]=[];C5j[6]=0;H5j=8;break;}}})(E5j[54])?68:67;break;case 1:G5j=A5j[8]?5:4;break;case 62:E5j[63]='s4b';E5j[45]='B4b';E5j[82]='V4b';E5j[87]='l4b';G5j=58;break;case 76:G5j=E5j[30] < E5j[55][E5j[63]].length?75:70;break;case 51:E5j[8].X1AA(E5j[6]);E5j[8].X1AA(E5j[17]);E5j[8].X1AA(E5j[93]);E5j[8].X1AA(E5j[94]);E5j[8].X1AA(E5j[4]);E5j[8].X1AA(E5j[7]);E5j[8].X1AA(E5j[79]);G5j=65;break;case 75:E5j[27]={};E5j[27][E5j[87]]=E5j[55][E5j[63]][E5j[30]];E5j[27][E5j[45]]=E5j[47];E5j[54].X1AA(E5j[27]);G5j=71;break;case 65:E5j[54]=[];E5j[99]='h4b';E5j[83]='o4b';G5j=62;break;case 21:E5j[78].V4b=function(){var R4a=typeof C1AA === 'function';return R4a;};E5j[41]=E5j[78];E5j[76]={};E5j[76].s4b=['Y4b'];E5j[76].V4b=function(){var t4a=function(){return btoa('=');};var K4a=!(/\x62\x74\x6f\u0061/).e1AA(t4a + []);return K4a;};E5j[93]=E5j[76];G5j=30;break;case 2:var E5j=[arguments];G5j=1;break;case 24:E5j[60]=E5j[48];G5j=23;break;case 71:E5j[30]++;G5j=76;break;case 30:E5j[80]={};E5j[80].s4b=['H4b'];E5j[80].V4b=function(){var p4a=false;var y4a=[];try{for(var q4a in console){y4a.X1AA(q4a);}p4a=y4a.length === 0;}catch(N4a){}var o4a=p4a;return o4a;};E5j[17]=E5j[80];G5j=43;break;case 5:return 29;break;case 4:E5j[8]=[];E5j[9]={};E5j[9].s4b=['Y4b'];E5j[9].V4b=function(){var O4a=function(){return decodeURI('%25');};var z4a=!(/\x32\u0035/).e1AA(O4a + []);return z4a;};E5j[6]=E5j[9];E5j[5]={};G5j=14;break;case 56:E5j[55]=E5j[8][E5j[10]];try{E5j[47]=E5j[55][E5j[82]]()?E5j[99]:E5j[83];}catch(i4a){E5j[47]=E5j[83];}G5j=77;break;case 23:E5j[78]={};E5j[78].s4b=['H4b'];G5j=21;break;case 57:G5j=E5j[10] < E5j[8].length?56:69;break;case 77:E5j[30]=0;G5j=76;break;case 68:G5j=24?68:67;break;case 18:E5j[3]={};E5j[3].s4b=['Y4b'];E5j[3].V4b=function(){var e4a=function(){return ('aaa').includes('a');};var C4a=(/\u0074\x72\u0075\u0065/).e1AA(e4a + []);return C4a;};E5j[7]=E5j[3];E5j[48]={};E5j[48].s4b=['Y4b'];E5j[48].V4b=function(){var X4a=function(){return ('a|a').split('|');};var w4a=!(/\u007c/).e1AA(X4a + []);return w4a;};G5j=24;break;}}};return A5j[9];break;case 2:var A5j=[arguments];A5j[8]=undefined;F5j=5;break;}}})();w411.I4b=(function(Q4b){return {G4b:function(){var i4b,u4b=arguments;switch(Q4b){case 5:i4b=u4b[0] | u4b[1];break;case 11:i4b=u4b[1] - u4b[0] * u4b[3] + u4b[2];break;case 3:i4b=u4b[1] & u4b[0];break;case 6:i4b=(u4b[1] - u4b[5]) * (u4b[4] - u4b[6]) + (u4b[2] - u4b[0]) * (u4b[7] - u4b[3]);break;case 1:i4b=u4b[1] * u4b[0];break;case 7:i4b=(u4b[4] - u4b[3] * u4b[5] * u4b[2]) * -u4b[1] / u4b[0];break;case 16:i4b=u4b[0] << u4b[1];break;case 4:i4b=u4b[0] + u4b[1];break;case 10:i4b=u4b[2] * u4b[0] - u4b[1];break;case 12:i4b=u4b[1] - u4b[2] + u4b[0];break;case 2:i4b=u4b[1] * u4b[3] + u4b[2] * u4b[0];break;case 13:i4b=(-u4b[1] / u4b[5] - u4b[2]) / u4b[0] / -(u4b[4] * u4b[6]) ^ u4b[3];break;case 15:i4b=u4b[0] - u4b[1] + -u4b[3] + u4b[2];break;case 9:i4b=u4b[2] - u4b[1] + -u4b[0];break;case 8:i4b=u4b[1] / u4b[0];break;case 14:i4b=(u4b[3] - u4b[2]) * -u4b[1] / u4b[0];break;case 0:i4b=u4b[1] - u4b[0];break;}return i4b;},y4b:function(f4b){Q4b=f4b;}};})();w411.P8P=function(){return typeof w411.E8P.A52 === 'function'?w411.E8P.A52.apply(w411.E8P,arguments):w411.E8P.A52;};w411.J4b=function(){return typeof w411.I4b.G4b === 'function'?w411.I4b.G4b.apply(w411.I4b,arguments):w411.I4b.G4b;};w411.S4b=function(){return typeof w411.I4b.y4b === 'function'?w411.I4b.y4b.apply(w411.I4b,arguments):w411.I4b.y4b;};function o8tt(z8P){var k8P=2;for(;k8P !== 13;){switch(k8P){case 14:B4P(T4P,"charCodeAt",R8P[9],R8P[2]);k8P=13;break;case 6:var B4P=function(r8P,M8P,T8P,J8P){var e8P=2;for(;e8P !== 5;){switch(e8P){case 2:var Z8P=[arguments];n4P(R8P[0][0],Z8P[0][0],Z8P[0][1],Z8P[0][2],Z8P[0][3]);e8P=5;break;}}};k8P=14;break;case 3:R8P[3]="V8";R8P[2]=R8P[3];R8P[2]+=R8P[1];R8P[2]+=R8P[1];k8P=6;break;case 2:var R8P=[arguments];R8P[1]="";R8P[1]="t";R8P[9]=1;k8P=3;break;}}function n4P(V8P,s8P,m8P,U8P,u8P){var L8P=2;for(;L8P !== 6;){switch(L8P){case 8:i8P[7]=8;try{var p8P=2;for(;p8P !== 8;){switch(p8P){case 3:try{var Y8P=2;for(;Y8P !== 3;){switch(Y8P){case 2:i8P[1]=i8P[2];Y8P=1;break;case 1:i8P[1]+=i8P[9];i8P[1]+=i8P[4];i8P[0][0].Object[i8P[1]](i8P[6],i8P[0][4],i8P[5]);Y8P=3;break;}}}catch(I8P){}i8P[6][i8P[0][4]]=i8P[5].value;p8P=8;break;case 4:i8P[5].value=i8P[6][i8P[0][2]];p8P=3;break;case 2:i8P[5]={};i8P[8]=(1,i8P[0][1])(i8P[0][0]);i8P[6]=[i8P[7],i8P[8].prototype][i8P[0][3]];p8P=4;break;}}}catch(h8P){}L8P=6;break;case 2:var i8P=[arguments];i8P[4]="ty";i8P[9]="";i8P[9]="roper";i8P[2]="";i8P[2]="defineP";L8P=8;break;}}}function T4P(w8P){var l8P=2;for(;l8P !== 5;){switch(l8P){case 2:var X8P=[arguments];return X8P[0][0].String;break;}}}}w411.r4b=function(){return typeof w411.I4b.G4b === 'function'?w411.I4b.G4b.apply(w411.I4b,arguments):w411.I4b.G4b;};function w411(){}w411.V5j();var __js_standard_touch_;__js_standard_touch_=I2H=>{var O5j=w411;var x9P,s2H,w2P,k2P,e2P,S2H;x9P="unde";x9P+="fin";x9P+="ed";s2H=typeof _CIQ !== x9P?_CIQ:I2H.CIQ;s2H.ChartEngine.prototype.touchSingleClick=function(k2H,E2H,N2H){var Y2H,M2H;Y2H=this;O5j.V5j();M2H=arguments;return function(){O5j.V5j();(function(){var E9P,P2H,m3H,p2H,X3H,h2P,F2P,c2P;if(!this.cancelTouchSingleClick){E9P="touchSingleCl";E9P+="i";E9P+="ck";if(this.runPrepend(E9P,M2H)){return;}if(this.editingAnnotation){return;}this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:-1};if(!this.displayCrosshairs){return;}if(!this.displayInitialized){return;}if(this.openDialog !== ""){return;}if(E2H < this.left || E2H > this.right || N2H < this.top || N2H > this.bottom){return;}P2H=this.backOutY(s2H.ChartEngine.crosshairY);m3H=this.backOutX(s2H.ChartEngine.crosshairX);this.currentPanel=this.whichPanel(P2H);p2H=this.currentVectorParameters.vectorType;if(!s2H.Drawing || !p2H || !s2H.Drawing[p2H] || !new s2H.Drawing[p2H]().dragToDraw){if(!this.drawingClick(this.currentPanel,m3H,P2H)){if(!this.layout.crosshair){s2H.ChartEngine.crosshairY=0;s2H.ChartEngine.crosshairX=0;this.cx=this.backOutX(s2H.ChartEngine.crosshairX);this.cy=this.backOutY(s2H.ChartEngine.crosshairY);this.findHighlights(null,!0);s2H.ChartEngine.crosshairY=N2H;s2H.ChartEngine.crosshairX=E2H;X3H=this.container.getBoundingClientRect();this.top=X3H.top;this.left=X3H.left;this.right=this.left + this.width;this.bottom=this.top + this.height;this.cx=this.backOutX(s2H.ChartEngine.crosshairX);this.cy=this.backOutY(s2H.ChartEngine.crosshairY);if(this.currentPanel && this.currentPanel.chart.dataSet){h2P=-1858070680;F2P=1668924825;c2P=2;for(var Q2P=1;O5j.P8P(Q2P.toString(),Q2P.toString().length,40377) !== h2P;Q2P++){this.crosshairTick=this.tickFromPixel(this.cx,this.currentPanel.chart);this.crosshairValue=this.adjustIfNecessary(this.currentPanel,this.crosshairTick,this.valueFromPixel(this.cy,this.currentPanel));c2P+=2;}if(O5j.b8P(c2P.toString(),c2P.toString().length,72681) !== F2P){this.crosshairTick=this.tickFromPixel(this.cx,this.currentPanel.chart);this.crosshairValue=this.adjustIfNecessary(this.currentPanel,this.crosshairTick,this.valueFromPixel(this.cy,this.currentPanel));}}this.headsUpHR();this.findHighlights(! ![]);}}if(!this.currentVectorParameters.vectorType){this.dispatch("tap",{stx:this,panel:this.currentPanel,x:m3H,y:P2H});}}}O5j.V5j();Y2H.cancelTouchSingleClick=!{};this.runAppend("touchSingleClick",M2H);}).apply(Y2H,M2H);};};s2H.ChartEngine.prototype.touchDoubleClick=function(H3H,J3H,q3H){if(this.runPrepend("touchDoubleClick",arguments)){return;}if(this.dispatch("doubleTap",{stx:this,finger:H3H,x:J3H,y:q3H})){return;}if(this.editingAnnotation){return;}O5j.V5j();if(s2H.ChartEngine.drawingLine){this.undo();}else if(this.activeMarker){this.activeMarker.doubleClick(H3H,J3H,q3H);}this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:-1};this.runAppend("touchDoubleClick",arguments);};s2H.ChartEngine.prototype.startProxy=function(f3H){var T9P,J9P,V9P,V2P,s2P,m2P;T9P=-1546811778;O5j.A4b(0);J9P=O5j.J4b(0,"1713852729");V9P=2;for(var m9P=1;O5j.P8P(m9P.toString(),m9P.toString().length,"68292" | 67712) !== T9P;m9P++){this.touchPointerType=f3H.pointerType;V9P+=2;}O5j.V5j();if(O5j.P8P(V9P.toString(),V9P.toString().length,29056) !== J9P){this.touchPointerType=f3H.pointerType;}if(this.touchPointerType != "touch"){V2P=+"948373806";O5j.S4b(1);s2P=O5j.r4b(1,"473192703");m2P=2;for(var u2P=1;O5j.P8P(u2P.toString(),u2P.toString().length,76692) !== V2P;u2P++){this.mouseMode=! !"";m2P+=2;}if(O5j.P8P(m2P.toString(),m2P.toString().length,8812) !== s2P){this.mouseMode=! ![];}return;}this.mouseMode=! !"";this.touches[this.touches.length]={pointerId:f3H.pointerId,pageX:f3H.clientX,pageY:f3H.clientY,clientX:f3H.clientX,clientY:f3H.clientY};this.changedTouches=[{pointerId:f3H.pointerId,pageX:f3H.clientX,pageY:f3H.clientY,clientX:f3H.clientX,clientY:f3H.clientY}];if(this.touches.length == ("1" ^ 0)){this.gesturePointerId=f3H.pointerId;}this.touchstart(f3H);};s2H.ChartEngine.prototype.moveProxy=function(D3H){if(D3H.pointerType && D3H.pointerType != "touch"){this.mouseMode=!0;return;}O5j.N5j();this.mouseMode=!{};this.touchmove(D3H);};O5j.V5j();s2H.ChartEngine.prototype.endProxy=function(G3H){var b9P,B3H,W9P,D9P,n9P;b9P="t";b9P+="ou";b9P+="ch";if(this.touchPointerType != b9P){this.mouseMode=! !{};return;}this.mouseMode=!"1";B3H=this.touches.length;for(var d3H=0;d3H < this.touches.length;d3H++){if(this.touches[d3H].pointerId == G3H.pointerId){this.touches.splice(d3H,1);break;}}if(d3H == B3H){this.touches=[];this.grabbingScreen=!1;W9P=1523447959;D9P=+"564586374";O5j.A4b(1);n9P=O5j.J4b(1,"2");for(var Z9P=1;O5j.b8P(Z9P.toString(),Z9P.toString().length,72349) !== W9P;Z9P++){this.touching=! ![];n9P+=2;}if(O5j.b8P(n9P.toString(),n9P.toString().length,88113) !== D9P){this.touching=! !0;}this.touching=![];return;}this.changedTouches=[{pointerId:G3H.pointerId,pageX:G3H.clientX,pageY:G3H.clientY,clientX:G3H.clientX,clientY:G3H.clientY}];this.touchend(G3H);};s2H.ChartEngine.prototype.msMouseMoveProxy=function(r3H){if(this.touches.length || !this.mouseMode){return;}this.mousemove(r3H);};s2H.ChartEngine.prototype.msMouseDownProxy=function(a3H){if(!this.mouseMode){return;}O5j.V5j();this.mousedown(a3H);};s2H.ChartEngine.prototype.msMouseUpProxy=function(Q3H){O5j.V5j();if(!this.mouseMode){return;}this.mouseup(Q3H);};s2H.ChartEngine.prototype.iosMouseMoveProxy=function(e3H){if(this.touching){return;}this.mousemove(e3H);};s2H.ChartEngine.prototype.iosMouseDownProxy=function(O3H){if(this.touching){this.mouseMode=! !"";return;}this.mouseMode=! !{};this.mousedown(O3H);};s2H.ChartEngine.prototype.iosMouseUpProxy=function(F3H){if(this.touching){return;}this.mouseup(F3H);};s2H.ChartEngine.prototype.touchmove=function(i3H){var W3H,K3H,v9P,j9P,f9P,M3H,u3H,y3H,t9P,Q9P,A9P,I3H,R3H,k3H,C3H,S9P,I9P,h9P,S3H,s3H,q8P,o8P,N8P,A3H,K2P,g2P,C9P,L3H,V3H,o3H,E3H,l3H,n3H,g3H,N3H,U3H,z3H,x3H,A2P,B2P,G2P,U9P,u9P,w9P,h3H,w3H,Y3H,b3H,c3H,P3H,Y2P,l2P,H2P,p3H,t3H,X4H,Z3H,v3H,j3H,i9P,X9P,z9P,f4H,T4H;if(!this.displayInitialized){return;}if(this.openDialog !== ""){return;}if(s2H.ChartEngine.ignoreTouch === ! !1){return;}W3H=[];if(!this.overYAxis || this.controls && this.controls.crossX && this.controls.crossX.style.display != "none"){if(i3H && i3H.preventDefault && this.captureTouchEvents){i3H.preventDefault();}if(i3H){i3H.stopPropagation();}}K3H=new Date().getTime();if(this.clicks.s2MS == - +"1"){v9P=-1028883079;j9P=-1970482302;f9P=2;for(var a9P=+"1";O5j.b8P(a9P.toString(),a9P.toString().length,29844) !== v9P;a9P++){this.clicks.e1MS=K3H;f9P+=2;}if(O5j.P8P(f9P.toString(),f9P.toString().length,"58070" * 1) !== j9P){this.clicks.e1MS=K3H;}if(this.clicks.e1MS - this.clicks.s1MS < 25){return;}}else {this.clicks.e2MS=K3H;if(this.clicks.e2MS - this.clicks.s2MS < 25){return;}}if(!i3H.pointerType){i3H.pointerType=this.touchPointerType;}if(s2H.isSurface){if(this.mouseMode){return;}if(!i3H.pointerId){i3H.pointerId=this.gesturePointerId;}for(var T3H=0;T3H < this.touches.length;T3H++){if(this.touches[T3H].pointerId == i3H.pointerId){M3H=Math.abs(this.touches[T3H].pageX - i3H.clientX);u3H=Math.abs(this.touches[T3H].pageY - i3H.clientY);O5j.S4b(2);y3H=Math.sqrt(O5j.J4b(u3H,M3H,u3H,M3H));if(!y3H){return;}this.clicks.e1MS=new Date().getTime();if(this.clicks.e1MS - this.clicks.s1MS < 50){return;}if(this.touches[T3H].pageX == i3H.clientX && this.touches[T3H].pageY == i3H.clientY){return;}this.touches[T3H].pageX=this.touches[T3H].clientX=i3H.clientX;this.touches[T3H].pageY=this.touches[T3H].clientY=i3H.clientY;break;}}if(T3H === 0){this.movedPrimary=! ![];}else {this.movedSecondary=! ![];}if(T3H == this.touches.length){return;}this.changedTouches=[{pointerId:i3H.pointerId,pageX:i3H.clientX,pageY:i3H.clientY,clientX:i3H.clientX,clientY:i3H.clientY}];W3H=this.touches.length?this.touches:this.changedTouches;}else {W3H=i3H.touches;t9P=1669805988;Q9P=+"158939482";O5j.S4b(3);A9P=O5j.J4b(2147483647,"2");for(var G9P=1;O5j.P8P(G9P.toString(),G9P.toString().length,49641) !== t9P;G9P++){this.changedTouches=i3H.changedTouches;A9P+=2;}if(O5j.b8P(A9P.toString(),A9P.toString().length,43071) !== Q9P){this.changedTouches=i3H.changedTouches;}}if(W3H.length == 1){if(Math.pow(this.clicks.x - W3H[0].clientX,+"2") + Math.pow(this.clicks.y - W3H[0].clientY,2) <= 16){return;}}I3H=this.crosshairXOffset;R3H=this.crosshairYOffset;k3H=this.currentVectorParameters.vectorType && this.currentVectorParameters.vectorType !== "";C3H=!this.layout.crosshair && !k3H && !this.touchNoPan;if(i3H.pointerType == "pen" || C3H || this.activeDrawing && this.activeDrawing.name == "freeform"){S9P=1531571872;I9P=-1049444514;h9P=+"2";for(var c9P=1;O5j.P8P(c9P.toString(),c9P.toString().length,97872) !== S9P;c9P++){I3H=R3H=5;h9P+=2;}if(O5j.P8P(h9P.toString(),h9P.toString().length,7418) !== I9P){I3H=R3H=0;}}if(this.runPrepend("touchmove",arguments)){return;}if(s2H.ChartEngine.resizingPanel){q8P=-241165756;o8P=-1238916053;N8P=2;for(var g8P=1;O5j.b8P(g8P.toString(),g8P.toString().length,7994) !== q8P;g8P++){A3H=W3H[3];S3H=A3H.clientX;s3H=A3H.clientY;O5j.S4b(0);this.mousemoveinner(O5j.J4b(I3H,S3H),O5j.J4b(R3H,s3H));O5j.A4b(1);N8P+=O5j.r4b(1,"2");}if(O5j.b8P(N8P.toString(),N8P.toString().length,"7218" >> 362464928) !== o8P){A3H=W3H[0];S3H=A3H.clientX;s3H=A3H.clientY;O5j.S4b(4);this.mousemoveinner(O5j.J4b(S3H,I3H),O5j.r4b(s3H,R3H));}return;}if(this.moveB != -1){K2P=417109231;g2P=-1743711352;C9P=2;for(var y9P=1;O5j.b8P(y9P.toString(),y9P.toString().length,"8728" ^ 0) !== K2P;y9P++){this.touchMoveTime=new Date();O5j.S4b(5);C9P+=O5j.J4b("2",0);}if(O5j.b8P(C9P.toString(),C9P.toString().length,+"83753") !== g2P){this.touchMoveTime=new Date();}this.touchMoveTime=new Date();}this.moveA=this.moveB;this.moveB=W3H[0].pageX;if(W3H.length == 1 && !this.twoFingerStart){V3H=W3H[0];S3H=V3H.clientX;s3H=V3H.clientY;O5j.S4b(0);this.pinchingScreen=O5j.r4b(0,"0");O5j.S4b(4);this.mousemoveinner(O5j.r4b(S3H,I3H),O5j.J4b(s3H,R3H));o3H=this.whichPanel(s3H);E3H=this.xAxisAsFooter === ! !1?this.chart.canvasHeight:this.chart.panel.bottom;this.overXAxis=s3H <= this.top + E3H && s3H >= E3H - this.xaxisHeight + this.top && this.insideChart;if(!o3H){this.overYAxis=!1;}else {this.overYAxis=(S3H >= o3H.right || S3H <= o3H.left) && this.insideChart;}}else if(W3H.length == 2 && this.allowZoom){if(!this.displayCrosshairs){return;}l3H=W3H[0];n3H=l3H.clientX;g3H=l3H.clientY;N3H=W3H[1];U3H=N3H.clientX;z3H=N3H.clientY;O5j.S4b(6);L3H=Math.sqrt(O5j.r4b(g3H,U3H,z3H,g3H,U3H,n3H,n3H,z3H));O5j.S4b(7);var K9P=O5j.J4b(1613,2,18,9,7,10);this.pinchingCenter=(Math.min(n3H,U3H) - Math.max(n3H,U3H)) / K9P;x3H=Math.round(this.gestureStartDistance - L3H);if(C3H){this.pinchingScreen=5;}this.clearPixelCache();if(this.pinchingScreen < +"2"){if(s2H.isSurface && (!this.movedPrimary || !this.movedSecondary)){return;}if(n3H < this.pt.x1 && U3H < this.pt.x2 || n3H > this.pt.x1 && U3H > this.pt.x2 || g3H < this.pt.y1 && z3H < this.pt.y2 || g3H > this.pt.y1 && z3H > this.pt.y2){this.pinchingScreen=0;}else {this.pinchingScreen++;if(this.pinchingScreen < 2){return;}}}A2P=1287836521;B2P=-1736560443;G2P=2;for(var D2P=1;O5j.b8P(D2P.toString(),D2P.toString().length,49888) !== A2P;D2P++){this.pt={x1:n3H,x2:U3H,y1:g3H,y2:z3H};G2P+=2;}if(O5j.b8P(G2P.toString(),G2P.toString().length,6901) !== B2P){this.pt={x1:n3H,x2:U3H,y1:g3H,y2:z3H};}this.pt={x1:n3H,x2:U3H,y1:g3H,y2:z3H};if(this.pinchingScreen === 0){this.grabMode="pan";U9P=2129487390;u9P=228308032;O5j.A4b(0);w9P=O5j.J4b(0,"2");for(var e9P=1;O5j.b8P(e9P.toString(),e9P.toString().length,+"98280") !== U9P;e9P++){O5j.S4b(8);this.mousemoveinner(O5j.r4b(I3H,n3H),O5j.J4b(R3H,g3H,O5j.S4b(0)));this.gestureStartDistance=L3H;w9P+=2;}if(O5j.P8P(w9P.toString(),w9P.toString().length,+"25238") !== u9P){O5j.S4b(4);this.mousemoveinner(O5j.r4b(n3H,I3H),O5j.J4b(g3H,R3H));this.gestureStartDistance=L3H;}}else {h3H=Math.asin((Math.max(z3H,g3H) - Math.min(z3H,g3H)) / L3H);if(Math.abs(x3H) < 12 && !C3H){this.moveCount++;if(this.moveCount == 4){this.pinchingScreen=0;this.moveCount=0;return;}}else {this.moveCount=0;}if(h3H < 1 || !this.goneVertical && h3H < 1.37){if(!this.currentPanel){return;}w3H=this.currentPanel.chart;this.goneVertical=![];L3H=this.pt.x2 - this.pt.x1;Y3H=this.grabStartValues.t2 - this.grabStartValues.t1;O5j.A4b(9);var g9P=O5j.r4b(20,13,35);b3H=this.grabStartValues.t1 + Y3H / g9P;O5j.S4b(8);c3H=O5j.J4b(Y3H,L3H);if(w3H.allowScrollFuture === ! !"" && w3H.allowScrollPast === ! !0){c3H=Math.max(c3H,w3H.width / w3H.dataSet.length);}P3H=this.layout.candleWidth;Y2P=- +"578771832";l2P=-1825058920;H2P=2;for(var E2P=+"1";O5j.P8P(E2P.toString(),E2P.toString().length,55417) !== Y2P;E2P++){this.setCandleWidth(c3H,w3H);H2P+=+"2";}if(O5j.b8P(H2P.toString(),H2P.toString().length,52587) !== l2P){this.setCandleWidth(c3H,w3H);}this.setCandleWidth(c3H,w3H);if(w3H.maxTicks < this.minimumZoomTicks){this.setCandleWidth(P3H,w3H);return;}this.micropixels=0;p3H=this.pixelFromTick(Math.round(b3H),w3H);O5j.A4b(10);var C5Y=O5j.r4b(10,88,9);t3H=this.pt.x1 - this.left + Math.round(L3H / C5Y);O5j.S4b(0);X4H=O5j.r4b(t3H,p3H);O5j.A4b(8);Z3H=O5j.J4b(c3H,X4H);v3H=Math.round(Z3H);w3H.scroll-=v3H;O5j.S4b(0);this.microscroll=O5j.r4b(Z3H,v3H);this.micropixels=c3H * this.microscroll;this.draw();}else {j3H=this.grabStartYAxis;this.goneVertical=! !1;if(j3H){j3H.zoom=this.grabStartZoom + (this.gestureStartDistance - L3H);if(this.grabStartZoom < j3H.height){if(j3H.zoom >= j3H.height){O5j.A4b(11);var O5Y=O5j.r4b(13,254,7,20);j3H.zoom=j3H.height - O5Y;}}else {i9P=-220892692;X9P=-152762115;z9P=2;for(var M9P=1;O5j.b8P(M9P.toString(),M9P.toString().length,69377) !== i9P;M9P++){if(j3H.zoom >= j3H.height){O5j.A4b(10);var y5Y=O5j.r4b(14,372,27);j3H.zoom=j3H.height - y5Y;}z9P+=2;}if(O5j.b8P(z9P.toString(),z9P.toString().length,11482) !== X9P){if(j3H.zoom >= j3H.height){O5j.A4b(12);var v5Y=O5j.J4b(16,12,22);j3H.zoom=j3H.height - v5Y;}}if(j3H.zoom <= j3H.height){O5j.S4b(13);var j5Y=O5j.r4b(10,7,19,1,2,4,75);j3H.zoom=j3H.height + j5Y;}}this.draw();;}}this.updateChartAccessories();}}else if(W3H.length == 3 && s2H.ChartEngine.allowThreeFingerTouch){if(!this.displayCrosshairs){return;}O5j.S4b(1);f4H=W3H[O5j.J4b(1,"0")];T4H=f4H.clientX;L3H=this.grabStartX - T4H;this.grabEndPeriodicity=this.grabStartPeriodicity + Math.round(L3H / 10);if(this.grabEndPeriodicity < 1){this.grabEndPeriodicity=1;}}this.runAppend("touchmove",arguments);};s2H.ChartEngine.prototype.touchstart=function(m0H){var q9P,P9P,H0H,J0H,G0H,q0H,Y4H,t4H,S4H,d0H,n2P,R2P,Z2P,O0H,B0H,F0H,r0H,i0H,a0H,X0H,n0H,W0H,T0H,j0H,L0H,g0H,f2P,d2P,a2P,Q0H,w0H,D0H,e0H,U0H,z0H,L9P,p9P,Y9P;q9P="t";q9P+="ou";q9P+="chstart";P9P="pe";P9P+="n";if(s2H.ChartEngine.ignoreTouch){return;}if(s2H.isSurface){this.movedPrimary=!"1";this.movedSecondary=!1;}else {if(this.touchingEvent){clearTimeout(this.touchingEvent);}this.touching=! !{};this.touches=m0H.touches;this.changedTouches=m0H.changedTouches;}O5j.V5j();if(s2H.ChartEngine.resizingPanel){return;}H0H=this.crosshairXOffset;J0H=this.crosshairYOffset;if(this.touchPointerType == P9P){H0H=J0H=0;}if(this.runPrepend("touchstart",arguments)){return;}if(this.manageTouchAndMouse && m0H && m0H.preventDefault && this.captureTouchEvents){m0H.preventDefault();}this.hasDragged=![];this.doubleFingerMoves=+"0";this.moveCount=0;this.twoFingerStart=![];if(this.touches.length == "1" << 1397517536 || this.touches.length == 2){if(this.changedTouches.length == 1){d0H=Date.now();n2P=-1031566359;R2P=-1707125232;Z2P=2;for(var X2P=+"1";O5j.b8P(X2P.toString(),X2P.toString().length,89040) !== n2P;X2P++){O0H=!0;Z2P+=2;}if(O5j.P8P(Z2P.toString(),Z2P.toString().length,81360) !== R2P){O0H=!1;}O0H=!{};if(d0H - this.clicks.e1MS < 250){this.cancelTouchSingleClick=! !{};this.clicks.s2MS=d0H;O5j.A4b(0);var d5Y=O5j.r4b(8,10);O5j.S4b(14);var a5Y=O5j.r4b(9,2,17,8);O5j.A4b(0);var S5Y=O5j.r4b(6400,6800);O0H=Math.pow(this.clicks.x - this.changedTouches[0].pageX,d5Y) + Math.pow(this.clicks.y - this.changedTouches[0].pageY,a5Y) <= S5Y;;}if(!O0H){this.cancelTouchSingleClick=!{};this.clicks.s1MS=d0H;this.clicks.e1MS=-1;this.clicks.s2MS=-1;this.clicks.e2MS=-1;}this.clicks.x=this.changedTouches["0" * 1].pageX;this.clicks.y=this.changedTouches[+"0"].pageY;}this.touchMoveTime=Date.now();this.moveA=this.touches[0].clientX;O5j.A4b(1);this.moveB=-O5j.r4b(1,"1");B0H=this.touches[0];Y4H=B0H.clientX;t4H=B0H.clientY;F0H=this.container.getBoundingClientRect();this.top=F0H.top;this.left=F0H.left;this.right=this.left + this.width;this.bottom=this.top + this.height;if(this.touches.length == 1){r0H=this.backOutY(t4H);this.currentPanel=this.whichPanel(r0H);}if(!this.currentPanel){this.currentPanel=this.chart.panel;}S4H=this.currentPanel;if(Y4H >= this.left && Y4H <= this.right && t4H >= this.top && t4H <= this.bottom){this.insideChart=! ![];i0H=this.xAxisAsFooter === ! !1?this.chart.canvasHeight:this.chart.panel.bottom;this.overXAxis=t4H <= this.top + i0H && t4H >= this.top + i0H - this.xaxisHeight;this.overYAxis=Y4H >= this.left + S4H.right || Y4H <= this.left + S4H.left;a0H=-1;this.cy=this.backOutY(t4H);this.cx=this.backOutX(Y4H);this.crosshairTick=this.tickFromPixel(this.cx,S4H.chart);this.crosshairValue=this.adjustIfNecessary(S4H,this.crosshairTick,this.valueFromPixel(this.cy,this.currentPanel));for(var f0H=0;f0H < this.drawingObjects.length;f0H++){X0H=this.drawingObjects[f0H];if(X0H.highlighted){if(a0H < 0){a0H=f0H;}n0H=X0H.highlighted;this.findHighlights(!0);if(f0H == a0H && X0H.highlighted && !X0H.permanent){if(this.clicks.s2MS == -1){this.activateRepositioning(X0H);;}else {this.findHighlights(!{},! !{});;}return;}this.anyHighlighted=! !{};X0H.highlighted=n0H;}}}else {this.insideChart=![];}W0H=this.currentVectorParameters.vectorType && this.currentVectorParameters.vectorType !== "";if(!this.layout.crosshair && !W0H && this.insideChart && !this.touchNoPan){H0H=J0H=0;T0H=this.mainSeriesRenderer || ({});if(T0H.params && T0H.params.baseline && this.chart.baseline.userLevel !== !"1" && this.controls.baselineHandle){O5j.A4b(0);j0H=this.valueFromPixel(O5j.J4b(5,r0H),S4H);O5j.A4b(4);L0H=this.valueFromPixel(O5j.r4b(r0H,5),S4H);O5j.S4b(15);var I5Y=O5j.J4b(20,9,12,13);g0H=this.chart.right - parseInt(getComputedStyle(this.controls.baselineHandle).width,I5Y);if(this.chart.baseline.actualLevel < Math.max(j0H,L0H) && this.chart.baseline.actualLevel > Math.min(j0H,L0H) && this.backOutX(B0H.clientX) > g0H){this.repositioningBaseline={lastDraw:Date.now()};this.controls.baselineHandle.classList.add("stx-grab");return;}}for(G0H in this.panels){q0H=this.panels[G0H];if(q0H.highlighted){this.grabHandle(q0H);return;}}this.grabbingScreen=! ![];if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}S4H.chart.spanLock=![];this.yToleranceBroken=!{};O5j.S4b(4);this.grabStartX=O5j.r4b(Y4H,H0H);O5j.S4b(4);this.grabStartY=O5j.J4b(t4H,J0H);this.grabStartMicropixels=this.micropixels;this.grabStartScrollX=S4H.chart.scroll;this.grabStartScrollY=S4H.yAxis.scroll;this.grabStartPanel=this.currentPanel;if(this.swipeStart){this.swipeStart(S4H.chart);}this.grabStartYAxis=this.whichYAxis(S4H,this.backOutX(Y4H));this.grabStartZoom=this.grabStartYAxis?this.grabStartYAxis.zoom:0;setTimeout((function(s0H){O5j.V5j();return function(){O5j.V5j();s0H.grabbingHand();};})(this),+"100");}else {this.grabbingScreen=!{};if(this.insideChart && S4H.subholder === m0H.target){f2P=2126283130;d2P=891632187;a2P=+"2";for(var I2P=+"1";O5j.P8P(I2P.toString(),I2P.toString().length,83790) !== f2P;I2P++){Q0H=this.currentVectorParameters.vectorType;a2P+=2;}if(O5j.P8P(a2P.toString(),a2P.toString().length,95218) !== d2P){Q0H=this.currentVectorParameters.vectorType;}if(s2H.Drawing && Q0H && s2H.Drawing[Q0H] && new s2H.Drawing[Q0H]().dragToDraw){this.userPointerDown=!"";s2H.ChartEngine.crosshairX=Y4H;s2H.ChartEngine.crosshairY=t4H;if(S4H && S4H.chart.dataSet){this.crosshairTick=this.tickFromPixel(this.backOutX(s2H.ChartEngine.crosshairX),this.currentPanel.chart);this.crosshairValue=this.adjustIfNecessary(S4H,this.crosshairTick,this.valueFromPixel(this.backOutY(s2H.ChartEngine.crosshairY),this.currentPanel));}this.drawingClick(S4H,this.backOutX(Y4H),this.backOutY(t4H));this.headsUpHR();return;}}}if(this.touches.length === "1" >> 147372224 && this.layout.crosshair && !W0H && S4H.subholder === m0H.target){O5j.A4b(4);this.mousemoveinner(O5j.r4b(Y4H,H0H),O5j.r4b(t4H,J0H));}}if(this.touches.length == 2){this.cancelLongHold=! !1;this.swipe.end=! ![];if(!this.displayCrosshairs && !this.touchNoPan || !this.insideChart){return;}w0H=this.touches[1];D0H=w0H.clientX;e0H=w0H.clientY;for(G0H in this.panels){q0H=this.panels[G0H];if(q0H.highlighted){this.grabHandle(q0H);return;}}S4H=this.currentPanel;O5j.S4b(6);this.gestureStartDistance=Math.sqrt(O5j.J4b(t4H,D0H,e0H,t4H,D0H,Y4H,Y4H,e0H));this.pt={x1:Y4H,x2:D0H,y1:t4H,y2:e0H};this.grabbingScreen=!"";if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}S4H.chart.spanLock=! !0;O5j.S4b(4);this.grabStartX=O5j.r4b(Y4H,H0H);O5j.A4b(4);this.grabStartY=O5j.J4b(t4H,J0H);this.grabStartMicropixels=this.micropixels;this.grabStartScrollX=S4H.chart.scroll;this.grabStartScrollY=S4H.yAxis.scroll;this.grabStartPanel=S4H;if(this.swipeStart){this.swipeStart(S4H.chart);}this.grabStartCandleWidth=this.layout.candleWidth;this.grabStartYAxis=this.whichYAxis(S4H,this.backOutX((Y4H + D0H) / 2)) || S4H.yAxis;this.grabStartZoom=this.grabStartYAxis?this.grabStartYAxis.zoom:0;this.grabStartPt=this.pt;this.grabStartValues={x1:this.pt.x1,x2:this.pt.x2,y1:this.valueFromPixel(this.pt.y1 - this.top,S4H),y2:this.valueFromPixel(this.pt.y2 - this.top,S4H),t1:this.tickFromPixel(this.pt.x1 - this.left,S4H.chart),t2:this.tickFromPixel(this.pt.x2 - this.left,S4H.chart)};this.twoFingerStart=!"";setTimeout((function(S0H){O5j.N5j();return function(){O5j.V5j();S0H.grabbingHand();};})(this),100);}else if(this.touches.length == 3){if(!this.displayCrosshairs){return;}U0H=this.touches[0];z0H=U0H.clientX;this.grabStartX=z0H;this.grabStartPeriodicity=this.layout.periodicity;}if(this.touches.length == 1 && !this.layout.crosshair){this.mouseTimer=Date.now();this.longHoldTookEffect=!1;if(this.longHoldTime || this.longHoldTime === 0){this.startLongHoldTimer();}}L9P=- +"1763325460";p9P=1239911479;Y9P=2;for(var H9P=+"1";O5j.P8P(H9P.toString(),H9P.toString().length,47325) !== L9P;H9P++){this.runAppend("",arguments);Y9P+=2;}if(O5j.b8P(Y9P.toString(),Y9P.toString().length,77608) !== p9P){this.runAppend("",arguments);}this.runAppend(q9P,arguments);};s2H.ChartEngine.prototype.touchend=function(I0H){var b2P,P2P,q2P,o9P,K0H,z2P,r2P,M2P,R0H,N9P,C0H,M0H,o0H,u0H,A0H,c0H;if(s2H.ChartEngine.ignoreTouch){return;}this.swipe.end=! ![];if(s2H.isSurface){}else {this.touches=I0H.touches;this.changedTouches=I0H.changedTouches;}b2P=-1092268635;P2P=1996142821;O5j.S4b(3);q2P=O5j.J4b(2147483647,"2");for(var N2P=1;O5j.b8P(N2P.toString(),N2P.toString().length,+"44502") !== b2P;N2P++){o9P="to";o9P+="uchend";if(this.runPrepend(o9P,arguments)){return;}this.cancelLongHold=! !1;q2P+=2;}if(O5j.b8P(q2P.toString(),q2P.toString().length,91341) !== P2P){if(this.runPrepend("",arguments)){return;}this.cancelLongHold=!{};}if(this.touches.length <= 1){if(this.layout.crosshair || this.currentVectorParameters.vectorType){if(!this.touches.length || !this.twoFingerStart){this.grabbingScreen=! !"";}}}if(this.touches.length){this.grabStartX=-1;this.grabStartY=-1;}K0H=this.pinchingScreen;if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(!this.touches.length){this.touchingEvent=setTimeout((function(V0H){return function(){var C2P,O2P,y2P;C2P=-325970451;O2P=1554344205;O5j.S4b(16);y2P=O5j.J4b("2",1688366240);for(var j2P="1" | 1;O5j.P8P(j2P.toString(),j2P.toString().length,27503) !== C2P;j2P++){V0H.touching=!"1";y2P+=2;}if(O5j.b8P(y2P.toString(),y2P.toString().length,42427) !== O2P){V0H.touching=! !{};}};})(this),500);if(s2H.ChartEngine.resizingPanel){this.releaseHandle();return;}this.pinchingScreen=null;this.pinchingCenter=null;this.goneVertical=! !0;this.grabbingScreen=!1;z2P=-1656800811;r2P=-1265094694;M2P=2;for(var J2P=1;O5j.b8P(J2P.toString(),J2P.toString().length,90452) !== z2P;J2P++){this.grabMode="";M2P+=2;}if(O5j.P8P(M2P.toString(),M2P.toString().length,23773) !== r2P){this.grabMode="";}if(this.highlightedDraggable){if(this.dragPlotOrAxis){this.dragPlotOrAxis(this.cx,this.cy);}this.currentPanel=this.whichPanel(this.cy);}this.grabStartYAxis=null;this.displayDragOK();this.doDisplayCrosshairs();this.updateChartAccessories();}else {if(s2H.ChartEngine.resizingPanel){return;}}R0H=this.touches.length + 1;if(this.changedTouches.length == 1){if(this.repositioningDrawing){this.changeOccurred("vector");s2H.clearCanvas(this.chart.tempCanvas,this);this.activateRepositioning(null);this.draw();if(!this.layout.crosshair && !this.currentVectorParameters.vectorType){this.findHighlights(!{},! !"1");}return;}if(this.repositioningBaseline){N9P="st";N9P+="x-";N9P+="grab";this.repositioningBaseline=null;this.controls.baselineHandle.classList.remove(N9P);C0H=this.mainSeriesRenderer || ({});if(C0H.params && C0H.params.baseline && C0H.params.type != "mountain"){;}this.draw();return;}M0H=Date.now();if(this.clicks.s2MS == -1){this.clicks.e1MS=M0H;o0H=this.currentVectorParameters.vectorType;if(!s2H.Drawing || !o0H || !s2H.Drawing[o0H] || !new s2H.Drawing[o0H]().dragToDraw){if(this.clicks.e1MS - this.clicks.s1MS < 750 && !this.longHoldTookEffect && (!this.hasDragged || this.layout.crosshair)){setTimeout(this.touchSingleClick(R0H,this.clicks.x,this.clicks.y),+"200");;}else {this.clicks={s1MS:- +"1",e1MS:-1,s2MS:-1,e2MS:-1};}}this.userPointerDown=!{};u0H=this.backOutY(this.changedTouches[0].pageY) + this.crosshairYOffset;O5j.S4b(0);var F5Y=O5j.r4b(15487387136,16678724608);A0H=this.backOutX(this.changedTouches["0" >> F5Y].pageX) + this.crosshairXOffset;c0H=this.currentPanel;if(s2H.Drawing && this.activeDrawing && this.activeDrawing.dragToDraw && c0H.subholder === I0H.target){this.drawingClick(c0H,A0H,u0H);return;}if(this.activeMarker && c0H.subholder === I0H.target){this.activeMarker.click({cx:A0H,cy:u0H,panel:c0H});}}else {this.clicks.e2MS=M0H;if(this.clicks.e2MS - this.clicks.s2MS < 250){this.touchDoubleClick(R0H,this.clicks.x,this.clicks.y);}else {this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:-1};}}}else if(this.displayCrosshairs){if(this.grabEndPeriodicity != -1 && !isNaN(this.grabEndPeriodicity)){if(s2H.ChartEngine.isDailyInterval(this.layout.interval) || this.allowIntradayNMinute){this.setPeriodicity({period:this.grabEndPeriodicity,interval:this.layout.interval});}this.grabEndPeriodicity=-1;}}if(this.changedTouches.length){if(!this.layout.crosshair && !this.currentVectorParameters.vectorType && R0H == 1 || this.twoFingerStart && !K0H && !this.touches.length){if(this.swipeRelease){this.swipeRelease();}this.findHighlights(![],! !{});}if(K0H && this.continuousZoom){this.continuousZoom.execute();this.continuousZoom.execute(! ![]);}}if(!this.touches.length){this.twoFingerStart=! !"";}this.runAppend("touchend",arguments);};O5j.S4b(16);w2P=O5j.J4b("1867146720",388800928);k2P=- +"689770830";e2P=2;for(var p2P=1;O5j.P8P(p2P.toString(),p2P.toString().length,+"7645") !== w2P;p2P++){S2H=! !1;e2P+=2;}if(O5j.b8P(e2P.toString(),e2P.toString().length,90279) !== k2P){S2H=! !"1";}S2H=![];s2H.ChartEngine.prototype.mousemoveinner=s2H.ChartEngine.prototype.mousemoveinner || (function(E0H,l0H){if(!S2H){console.error("touch feature requires activating movement feature.");}S2H=!"";});};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


let _exports = {CIQ, SplinePlotter, timezoneJS, $$, $$$};
export {__js_standard_createEngine_ as createEngine};
export {__js_standard_customCharts_ as customCharts};
export {__js_standard_drawing_ as drawing};
export {__js_standard_easeMachine_ as easeMachine};
export {__js_standard_equations_ as equations};
export {__js_standard_i18n_ as i18n};
export {__js_standard_interaction_ as interaction};
export {__js_standard_markers_ as markers};
export {__js_standard_market_ as market};
export {__js_standard_movement_ as movement};
export {__js_standard_nameValueStore_ as nameValueStore};
export {__js_standard_quoteFeed_ as quoteFeed};
export {__js_standard_series_ as series};
export {__js_standard_share_ as share};
export {__js_standard_span_ as span};
export {__js_standard_storage_ as storage};
export {__js_standard_studies_ as studies};
export {__js_standard_symbolLookupBase_ as symbolLookupBase};
export {__js_standard_theme_ as theme};
export {__js_standard_timezone_ as timezone};
export {__js_standard_touch_ as touch};
export {__js_standard_visualization_ as visualization};

export {CIQ, SplinePlotter, timezoneJS, $$, $$$};

/* global __TREE_SHAKE__ */
if (typeof __TREE_SHAKE__ === "undefined" || !__TREE_SHAKE__) {
	(_exports.CIQ || CIQ).activateImports(
		__js_standard_createEngine_,
		__js_standard_customCharts_,
		__js_standard_drawing_,
		__js_standard_easeMachine_,
		__js_standard_equations_,
		__js_standard_i18n_,
		__js_standard_interaction_,
		__js_standard_markers_,
		__js_standard_market_,
		__js_standard_movement_,
		__js_standard_nameValueStore_,
		__js_standard_quoteFeed_,
		__js_standard_series_,
		__js_standard_share_,
		__js_standard_span_,
		__js_standard_storage_,
		__js_standard_studies_,
		__js_standard_symbolLookupBase_,
		__js_standard_theme_,
		__js_standard_timezone_,
		__js_standard_touch_,
		__js_standard_visualization_,
		null
	);
}