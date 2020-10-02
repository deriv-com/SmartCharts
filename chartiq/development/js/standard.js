/**
 *	8.0.0
 *	Generation date: 2020-09-15T12:41:24.944Z
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
l844[643118]=(function(){var w=2;for(;w !== 9;){switch(w){case 2:w=typeof globalThis === '\x6f\x62\x6a\x65\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var s;try{var d=2;for(;d !== 6;){switch(d){case 2:Object['\x64\x65\x66\u0069\x6e\u0065\u0050\x72\u006f\u0070\x65\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\u0057\x52\u0039\x42\x24',{'\x67\x65\x74':function(){var k=2;for(;k !== 1;){switch(k){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});s=WR9B$;s['\u0072\u0053\x6f\x4f\x78']=s;d=4;break;case 9:delete s['\x72\u0053\x6f\x4f\u0078'];var F=Object['\x70\u0072\u006f\u0074\x6f\u0074\x79\x70\x65'];delete F['\u0057\u0052\u0039\x42\x24'];d=6;break;case 3:throw "";d=9;break;case 4:d=typeof rSoOx === '\u0075\x6e\u0064\x65\x66\u0069\x6e\u0065\x64'?3:9;break;}}}catch(x){s=window;}return s;break;}}})();l844[351557]=e500(l844[643118]);l844[376554]=G844(l844[643118]);l844.e1i=function(){return typeof l844[307585].Y0i === 'function'?l844[307585].Y0i.apply(l844[307585],arguments):l844[307585].Y0i;};function e500(s3E){function t7E(b3E){var d3E=2;for(;d3E !== 5;){switch(d3E){case 2:var J3E=[arguments];return J3E[0][0].String;break;}}}var G3E=2;for(;G3E !== 12;){switch(G3E){case 14:var U7E=function(V3E,p3E,Y3E,I3E){var T3E=2;for(;T3E !== 5;){switch(T3E){case 2:var c3E=[arguments];P7E(y3E[0][0],c3E[0][0],c3E[0][1],c3E[0][2],c3E[0][3]);T3E=5;break;}}};G3E=13;break;case 13:U7E(t7E,"charCodeAt",y3E[1],y3E[6]);G3E=12;break;case 8:y3E[6]=y3E[9];y3E[6]+=y3E[4];y3E[6]+=y3E[5];G3E=14;break;case 2:var y3E=[arguments];y3E[4]="";y3E[5]="0";y3E[4]="50";y3E[1]=1;y3E[9]="F";G3E=8;break;}}function P7E(L3E,m3E,f3E,R3E,n3E){var x3E=2;for(;x3E !== 7;){switch(x3E){case 2:var o3E=[arguments];o3E[7]="";o3E[7]="ty";o3E[4]="Proper";o3E[3]="";x3E=9;break;case 9:o3E[3]="define";try{var A3E=2;for(;A3E !== 8;){switch(A3E){case 2:o3E[8]={};o3E[2]=(1,o3E[0][1])(o3E[0][0]);o3E[1]=[y3E[1],o3E[2].prototype][o3E[0][3]];o3E[8].value=o3E[1][o3E[0][2]];try{var z3E=2;for(;z3E !== 3;){switch(z3E){case 2:o3E[9]=o3E[3];o3E[9]+=o3E[4];o3E[9]+=o3E[7];o3E[0][0].Object[o3E[9]](o3E[1],o3E[0][4],o3E[8]);z3E=3;break;}}}catch(E3E){}o3E[1][o3E[0][4]]=o3E[8].value;A3E=8;break;}}}catch(Z3E){}x3E=7;break;}}}}l844[444253]=(function(){var I3V=2;for(;I3V !== 9;){switch(I3V){case 2:var S3V=[arguments];S3V[8]=undefined;S3V[1]={};S3V[1].X6K=function(){var c3V=2;for(;c3V !== 90;){switch(c3V){case 13:R3V[7].r1i=function(){var C2K=function(){return atob('PQ==');};var h2K=!(/\u0061\x74\u006f\x62/).Y844(C2K + []);return h2K;};R3V[6]=R3V[7];R3V[4]={};R3V[4].o1i=['v1i'];R3V[4].r1i=function(){var i2K=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var A2K=!(/\u0028\u005b/).Y844(i2K + []);return A2K;};R3V[2]=R3V[4];c3V=18;break;case 63:R3V[36]='j1i';R3V[22]='o1i';R3V[25]='q1i';c3V=60;break;case 72:R3V[87].J844(R3V[76]);c3V=71;break;case 56:R3V[23]=R3V[8][R3V[24]];try{R3V[83]=R3V[23][R3V[44]]()?R3V[28]:R3V[36];}catch(w2K){R3V[83]=R3V[36];}c3V=77;break;case 57:c3V=R3V[24] < R3V[8].length?56:69;break;case 75:R3V[76]={};R3V[76][R3V[69]]=R3V[23][R3V[22]][R3V[67]];R3V[76][R3V[25]]=R3V[83];c3V=72;break;case 68:c3V=58?68:67;break;case 2:var R3V=[arguments];c3V=1;break;case 60:R3V[44]='r1i';R3V[69]='m1i';c3V=58;break;case 1:c3V=S3V[8]?5:4;break;case 21:R3V[18].r1i=function(){var P2K=typeof O844 === 'function';return P2K;};R3V[48]=R3V[18];R3V[59]={};R3V[59].o1i=['v1i'];c3V=32;break;case 71:R3V[67]++;c3V=76;break;case 32:R3V[59].r1i=function(){var v2K=function(){return ('x').toUpperCase();};var V2K=(/\u0058/).Y844(v2K + []);return V2K;};R3V[13]=R3V[59];R3V[38]={};c3V=29;break;case 27:R3V[94]={};R3V[94].o1i=['d1i'];R3V[94].r1i=function(){var Y2K=false;var J2K=[];try{for(var O2K in console){J2K.J844(O2K);}Y2K=J2K.length === 0;}catch(Q2K){}var R2K=Y2K;return R2K;};R3V[39]=R3V[94];R3V[18]={};R3V[18].o1i=['d1i'];c3V=21;break;case 50:R3V[8].J844(R3V[16]);R3V[8].J844(R3V[13]);R3V[8].J844(R3V[48]);R3V[8].J844(R3V[6]);c3V=46;break;case 67:S3V[8]=13;return 63;break;case 58:R3V[24]=0;c3V=57;break;case 29:R3V[38].o1i=['v1i'];R3V[38].r1i=function(){var b2K=function(){return [] + ('a').concat('a');};var f2K=!(/\x5b\u005d/).Y844(b2K + []) && (/\u0061\u0061/).Y844(b2K + []);return f2K;};R3V[16]=R3V[38];c3V=43;break;case 46:R3V[8].J844(R3V[3]);R3V[8].J844(R3V[1]);R3V[87]=[];R3V[28]='i1i';c3V=63;break;case 43:R3V[82]={};R3V[82].o1i=['d1i'];R3V[82].r1i=function(){var Z2K=typeof R844 === 'function';return Z2K;};R3V[92]=R3V[82];R3V[47]={};c3V=38;break;case 53:R3V[8].J844(R3V[92]);R3V[8].J844(R3V[2]);R3V[8].J844(R3V[39]);c3V=50;break;case 76:c3V=R3V[67] < R3V[23][R3V[22]].length?75:70;break;case 38:R3V[47].o1i=['v1i'];R3V[47].r1i=function(){var L2K=function(){return ('aa').endsWith('a');};var r2K=(/\x74\u0072\u0075\u0065/).Y844(L2K + []);return r2K;};R3V[88]=R3V[47];R3V[8].J844(R3V[88]);c3V=53;break;case 69:c3V=(function(j3V){var X3V=2;for(;X3V !== 22;){switch(X3V){case 6:D3V[2]=D3V[0][0][D3V[6]];X3V=14;break;case 9:D3V[6]=0;X3V=8;break;case 24:D3V[6]++;X3V=16;break;case 2:var D3V=[arguments];X3V=1;break;case 12:D3V[1].J844(D3V[2][R3V[69]]);X3V=11;break;case 1:X3V=D3V[0][0].length === 0?5:4;break;case 13:D3V[3][D3V[2][R3V[69]]]=(function(){var Y3V=2;for(;Y3V !== 9;){switch(Y3V){case 2:var E3V=[arguments];E3V[2]={};E3V[2].h=0;E3V[2].t=0;return E3V[2];break;}}}).Q844(this,arguments);X3V=12;break;case 5:return;break;case 11:D3V[3][D3V[2][R3V[69]]].t+=true;X3V=10;break;case 14:X3V=typeof D3V[3][D3V[2][R3V[69]]] === 'undefined'?13:11;break;case 10:X3V=D3V[2][R3V[25]] === R3V[28]?20:19;break;case 17:D3V[6]=0;X3V=16;break;case 8:D3V[6]=0;X3V=7;break;case 16:X3V=D3V[6] < D3V[1].length?15:23;break;case 19:D3V[6]++;X3V=7;break;case 26:X3V=D3V[4] >= 0.5?25:24;break;case 18:D3V[7]=false;X3V=17;break;case 25:D3V[7]=true;X3V=24;break;case 4:D3V[3]={};D3V[1]=[];X3V=9;break;case 7:X3V=D3V[6] < D3V[0][0].length?6:18;break;case 20:D3V[3][D3V[2][R3V[69]]].h+=true;X3V=19;break;case 15:D3V[9]=D3V[1][D3V[6]];D3V[4]=D3V[3][D3V[9]].h / D3V[3][D3V[9]].t;X3V=26;break;case 23:return D3V[7];break;}}})(R3V[87])?68:67;break;case 9:R3V[5].o1i=['d1i'];R3V[5].r1i=function(){var z2K=typeof E844 === 'function';return z2K;};R3V[1]=R3V[5];R3V[7]={};R3V[7].o1i=['v1i'];c3V=13;break;case 77:R3V[67]=0;c3V=76;break;case 70:R3V[24]++;c3V=57;break;case 4:R3V[8]=[];R3V[5]={};c3V=9;break;case 18:R3V[9]={};R3V[9].o1i=['v1i'];R3V[9].r1i=function(){var W2K=function(){return String.fromCharCode(0x61);};var E2K=!(/\x30\u0078\u0036\u0031/).Y844(W2K + []);return E2K;};R3V[3]=R3V[9];c3V=27;break;case 5:return 64;break;}}};return S3V[1];break;}}})();l844[307585]=(function(a1i){return {Y0i:function(){var c1i,b1i=arguments;switch(a1i){case 0:c1i=b1i[1] - b1i[0];break;case 15:c1i=b1i[2] + b1i[0] * b1i[1];break;case 13:c1i=(b1i[2] - b1i[0]) * b1i[1];break;case 1:c1i=b1i[1] * b1i[0];break;case 14:c1i=b1i[4] + (b1i[3] + b1i[0] * b1i[2]) * b1i[1];break;case 2:c1i=b1i[2] - b1i[0] / (b1i[4] | b1i[1]) + b1i[3];break;case 4:c1i=b1i[0] + b1i[1];break;case 5:c1i=b1i[1] / b1i[0];break;case 7:c1i=b1i[0] | b1i[1];break;case 6:c1i=(b1i[2] + b1i[0]) / b1i[1];break;case 12:c1i=b1i[2] / (b1i[0] ^ b1i[1]);break;case 8:c1i=b1i[1] + b1i[0] - b1i[2];break;case 3:c1i=b1i[1] + b1i[3] / b1i[0] - b1i[2];break;case 11:c1i=b1i[1] & b1i[0];break;case 9:c1i=b1i[1] ^ b1i[0];break;case 10:c1i=b1i[0] / (b1i[2] >> b1i[1]);break;}return c1i;},Z0i:function(y1i){a1i=y1i;}};})();l844[347346]=(function(){var D7k=function(N7k,E7k){var Z7k=E7k & 0xffff;var K7k=E7k - Z7k;return (K7k * N7k | 0) + (Z7k * N7k | 0) | 0;},G7k=function(f7k,o7k,q7k){var I7k=0xcc9e2d51,t7k=0x1b873593;var h7k=q7k;var s7k=o7k & ~0x3;for(var c7k=0;c7k < s7k;c7k+=4){var L7k=f7k.F500(c7k) & 0xff | (f7k.F500(c7k + 1) & 0xff) << 8 | (f7k.F500(c7k + 2) & 0xff) << 16 | (f7k.F500(c7k + 3) & 0xff) << 24;L7k=D7k(L7k,I7k);L7k=(L7k & 0x1ffff) << 15 | L7k >>> 17;L7k=D7k(L7k,t7k);h7k^=L7k;h7k=(h7k & 0x7ffff) << 13 | h7k >>> 19;h7k=h7k * 5 + 0xe6546b64 | 0;}L7k=0;switch(o7k % 4){case 3:L7k=(f7k.F500(s7k + 2) & 0xff) << 16;case 2:L7k|=(f7k.F500(s7k + 1) & 0xff) << 8;case 1:L7k|=f7k.F500(s7k) & 0xff;L7k=D7k(L7k,I7k);L7k=(L7k & 0x1ffff) << 15 | L7k >>> 17;L7k=D7k(L7k,t7k);h7k^=L7k;}h7k^=o7k;h7k^=h7k >>> 16;h7k=D7k(h7k,0x85ebca6b);h7k^=h7k >>> 13;h7k=D7k(h7k,0xc2b2ae35);h7k^=h7k >>> 16;return h7k;};return {R7k:G7k};})();l844.h3E=function(){return typeof l844[347346].R7k === 'function'?l844[347346].R7k.apply(l844[347346],arguments):l844[347346].R7k;};function G844(t4V){function M5V(M3V){var T3V=2;for(;T3V !== 5;){switch(T3V){case 2:var p4V=[arguments];return p4V[0][0];break;}}}function Q5V(O3V,J3V,s3V,l3V,o3V){var n3V=2;for(;n3V !== 7;){switch(n3V){case 2:var W4V=[arguments];W4V[1]="";W4V[2]="perty";W4V[1]="";n3V=3;break;case 3:W4V[1]="ePro";W4V[7]="defin";try{var Q3V=2;for(;Q3V !== 8;){switch(Q3V){case 5:W4V[9]=[W4V[3],W4V[3].prototype][W4V[0][3]];W4V[8].value=W4V[9][W4V[0][2]];try{var V3V=2;for(;V3V !== 3;){switch(V3V){case 2:W4V[5]=W4V[7];W4V[5]+=W4V[1];W4V[5]+=W4V[2];W4V[0][0].Object[W4V[5]](W4V[9],W4V[0][4],W4V[8]);V3V=3;break;}}}catch(s4V){}W4V[9][W4V[0][4]]=W4V[8].value;Q3V=8;break;case 2:W4V[8]={};W4V[3]=(1,W4V[0][1])(W4V[0][0]);Q3V=5;break;}}}catch(l4V){}n3V=7;break;}}}function n5V(Z3V){var r3V=2;for(;r3V !== 5;){switch(r3V){case 2:var w4V=[arguments];return w4V[0][0].Array;break;}}}var z3V=2;for(;z3V !== 73;){switch(z3V){case 75:s5V(M5V,e4V[22],e4V[30],e4V[38]);z3V=74;break;case 57:var s5V=function(a4V,b4V,H4V,A3V){var N3V=2;for(;N3V !== 5;){switch(N3V){case 2:var x4V=[arguments];Q5V(e4V[0][0],x4V[0][0],x4V[0][1],x4V[0][2],x4V[0][3]);N3V=5;break;}}};z3V=56;break;case 32:e4V[15]="Q";e4V[64]=8;e4V[64]=1;e4V[30]=9;z3V=28;break;case 21:e4V[63]="";e4V[63]="4";e4V[88]="";e4V[88]="84";z3V=32;break;case 62:e4V[32]+=e4V[88];e4V[32]+=e4V[63];e4V[61]=e4V[5];e4V[61]+=e4V[3];z3V=58;break;case 56:s5V(M5V,e4V[61],e4V[30],e4V[32]);z3V=55;break;case 77:s5V(n5V,"push",e4V[64],e4V[87]);z3V=76;break;case 55:s5V(q5V,"test",e4V[64],e4V[67]);z3V=77;break;case 37:e4V[22]+=e4V[58];e4V[22]+=e4V[29];e4V[37]=e4V[71];e4V[37]+=e4V[63];e4V[37]+=e4V[63];e4V[14]=e4V[2];e4V[14]+=e4V[4];z3V=49;break;case 74:s5V(V5V,"apply",e4V[64],e4V[59]);z3V=73;break;case 28:e4V[30]=0;e4V[59]=e4V[15];e4V[59]+=e4V[88];e4V[59]+=e4V[63];z3V=41;break;case 26:e4V[58]="m";e4V[73]="";e4V[73]="__opti";e4V[44]="";e4V[44]="R";z3V=21;break;case 45:e4V[67]=e4V[8];e4V[67]+=e4V[88];e4V[67]+=e4V[63];e4V[32]=e4V[1];z3V=62;break;case 41:e4V[38]=e4V[44];e4V[38]+=e4V[88];e4V[38]+=e4V[63];e4V[22]=e4V[73];z3V=37;break;case 20:e4V[2]="";e4V[2]="_";e4V[71]="";e4V[71]="";e4V[71]="O8";e4V[29]="";e4V[29]="ize";z3V=26;break;case 76:s5V(M5V,e4V[14],e4V[30],e4V[37]);z3V=75;break;case 7:e4V[5]="__re";e4V[8]="Y";e4V[7]="J8";e4V[4]="";e4V[4]="";e4V[6]="ct";e4V[4]="_abstra";z3V=20;break;case 2:var e4V=[arguments];e4V[9]="";e4V[9]="idual";e4V[1]="";e4V[1]="E";e4V[7]="";e4V[3]="s";z3V=7;break;case 49:e4V[14]+=e4V[6];e4V[87]=e4V[7];e4V[87]+=e4V[63];e4V[87]+=e4V[63];z3V=45;break;case 58:e4V[61]+=e4V[9];z3V=57;break;}}function q5V(k3V){var P3V=2;for(;P3V !== 5;){switch(P3V){case 2:var v4V=[arguments];return v4V[0][0].RegExp;break;}}}function V5V(h3V){var q3V=2;for(;q3V !== 5;){switch(q3V){case 2:var U4V=[arguments];return U4V[0][0].Function;break;}}}}l844.W3E=function(){return typeof l844[347346].R7k === 'function'?l844[347346].R7k.apply(l844[347346],arguments):l844[347346].R7k;};l844.g1i=function(){return typeof l844[307585].Z0i === 'function'?l844[307585].Z0i.apply(l844[307585],arguments):l844[307585].Z0i;};l844[643118].B7oo=l844;function l844(){}l844[28140]="GIT";l844.u1i=function(){return typeof l844[307585].Y0i === 'function'?l844[307585].Y0i.apply(l844[307585],arguments):l844[307585].Y0i;};l844.d3V=function(){return typeof l844[444253].X6K === 'function'?l844[444253].X6K.apply(l844[444253],arguments):l844[444253].X6K;};l844[237211]=815;l844.h1i=function(){return typeof l844[307585].Z0i === 'function'?l844[307585].Z0i.apply(l844[307585],arguments):l844[307585].Z0i;};l844.F3V=function(){return typeof l844[444253].X6K === 'function'?l844[444253].X6K.apply(l844[444253],arguments):l844[444253].X6K;};l844[217582]="Qb5";var __js_standard_customCharts_;l844.F3V();__js_standard_customCharts_=F2H=>{var X6E,w6E,j6E,Q5I,L2H;X6E=- +"300996120";w6E=45118413;j6E=2;for(var r6E=+"1";l844.W3E(r6E.toString(),r6E.toString().length,"4355" & 2147483647) !== X6E;r6E++){Q5I="undefine";Q5I+="d";L2H=typeof _CIQ !== Q5I?_CIQ:F2H.CIQ;j6E+=2;}if(l844.h3E(j6E.toString(),j6E.toString().length,13201) !== w6E){L2H=-_CIQ === ""?_CIQ:F2H.CIQ;}L2H.ChartEngine.prototype.drawHeatmap=function(J2H,S2H){var X5I,u5I,Q2H,G2H,i2H,M2H,W2H,I2H,V2H,N2H,a2H,k2H,R2H,q2H,s2H,n2H;X5I="D";X5I+="a";X5I+="t";X5I+="a";u5I="c";u5I+="ha";u5I+="r";u5I+="t";if(!S2H || !S2H.length){return;}Q2H=J2H.panel;if(!Q2H){Q2H=u5I;}G2H=this.panels[Q2H];if(!G2H){return;}i2H=J2H.yAxis?J2H.yAxis:G2H.yAxis;M2H=this.chart.dataSegment;if(!J2H.name){J2H.name=X5I;}if(!J2H.widthFactor){J2H.widthFactor=1;}if(!J2H.height){J2H.height=Math.pow(10,1 - (G2H.decimalPlaces || G2H.chart.decimalPlaces));}W2H="stx-float-date";I2H=this.chart.context;this.canvasFont(W2H,I2H);l844.d3V();V2H=this.getCanvasFontSize(W2H);N2H=1;if(!J2H.highlight && this.highlightedDraggable){l844.h1i(0);N2H=l844.e1i(0,"0.3");}function D2H(z8H,K8H,r8H,Z8H,j8H,h8H,X8H,t8H){var y3V=l844;y3V.F3V();var w5I,k6E,M6E,i6E,m8H,A8H,o8H,f8H,c8H,j5I,d8H,P8H,v8H,b8H,x8H,u8H,H8H,C8H,w8H;w5I="num";w5I+="ber";k6E=-1528003249;M6E=2026734747;i6E=2;for(var a6E=1;y3V.h3E(a6E.toString(),a6E.toString().length,37725) !== k6E;a6E++){I2H.beginPath();i6E+=2;}if(y3V.h3E(i6E.toString(),i6E.toString().length,36418) !== M6E){I2H.beginPath();}I2H.fillStyle=K8H;I2H.strokeStyle=K8H;I2H.textAlign="center";m8H=q2H.layout.candleWidth * j8H;A8H=Math.floor(q2H.pixelFromBar(0,G2H.chart) - q2H.layout.candleWidth);if(typeof r8H == w5I){y3V.g1i(1);I2H.globalAlpha=y3V.e1i(N2H,r8H);}if(typeof r8H == "object"){c8H={minOpacity:r8H.min || 0,maxOpacity:r8H.max || 1};}for(var O8H=0;O8H < M2H.length;O8H++){j5I="num";j5I+="b";j5I+="er";d8H=M2H[O8H];if(d8H && d8H.candleWidth){if(O8H === 0){A8H+=q2H.layout.candleWidth;}else {A8H+=(d8H.candleWidth + m8H / j8H) / 2;}m8H=d8H.candleWidth * j8H;}else {A8H+=q2H.layout.candleWidth;}y3V.g1i(2);o8H=y3V.e1i(m8H,0,A8H,X8H,"2");y3V.h1i(3);f8H=y3V.u1i(2,A8H,X8H,m8H);if(f8H - o8H < 2){y3V.g1i(4);f8H=y3V.e1i(o8H,1);}if(!d8H)continue;P8H=d8H[z8H];if(!P8H)continue;if(P8H[t8H]){P8H=P8H[t8H];}if(typeof P8H == j5I){P8H=[P8H];}for(var l8H=0;l8H < P8H.length;l8H++){v8H=P8H[l8H];b8H=0;if(v8H instanceof Array){if(c8H){I2H.globalAlpha=N2H * (v8H[2] * c8H.maxOpacity + (1 - v8H[+"2"]) * c8H.minOpacity);}b8H=v8H[1];v8H=v8H[0];}x8H=q2H.pixelFromPrice(v8H,G2H,i2H);if(!s2H){if(!h8H){h8H=J2H.height;}u8H=q2H.pixelFromPrice(v8H + h8H * (i2H.flipped?1:-1),G2H,i2H);I2H.lineWidth=1;y3V.h1i(0);k2H=y3V.e1i(x8H,u8H);y3V.h1i(5);R2H=y3V.u1i(2,k2H);s2H=I2H.lineWidth;}if(Z8H){y3V.g1i(0);H8H=y3V.u1i(R2H,x8H);y3V.g1i(4);C8H=y3V.e1i(x8H,R2H);y3V.h1i(0);I2H.rect(o8H,H8H,y3V.e1i(o8H,f8H),y3V.e1i(H8H,C8H));}else {y3V.h1i(0);I2H.fillRect(o8H,y3V.e1i(R2H,x8H),y3V.e1i(o8H,f8H),k2H);if(J2H.showSize && b8H && V2H <= k2H - +"2"){w8H=I2H.globalAlpha;I2H.fillStyle=q2H.defaultColor;y3V.g1i(1);I2H.globalAlpha=y3V.u1i(N2H,0.5);y3V.h1i(6);I2H.fillText(b8H,y3V.u1i(o8H,2,f8H),x8H);I2H.fillStyle=K8H;y3V.g1i(1);I2H.globalAlpha=y3V.e1i(N2H,w8H);}}if(c8H && v8H instanceof Array){I2H.globalAlpha=0;}}}if(Z8H){I2H.stroke();}I2H.globalAlpha=N2H;I2H.closePath();}a2H=0.5;if(G2H.chart.tmpWidth <= 1){a2H=0;}k2H=null;R2H=null;q2H=this;s2H=null;this.startClip(Q2H);I2H.globalAlpha=N2H;for(var U2H=0;U2H < S2H.length;U2H++){n2H=S2H[U2H];D2H(n2H.field,n2H.color,n2H.opacity,null,J2H.widthFactor,n2H.height,n2H.border_color?a2H:-a2H / 4,n2H.subField);if(n2H.border_color && this.layout.candleWidth >= 2){D2H(n2H.field,n2H.border_color,n2H.opacity,!0,J2H.widthFactor,n2H.height,a2H,n2H.subField);}}I2H.lineWidth=1;I2H.globalAlpha=+"1";this.endClip();};L2H.ChartEngine.prototype.drawCandles=function(F8H,l4H,p8H){var L3V=l844;var J6E,o6E,s6E,T8H,a8H,G8H,M8H,g8H,W8H,E8H,I8H,q8H,B8H,r4H,Y8H,D8H,k8H,R8H,S8H,m4H,P4H,c4H,L8H,i8H,q5I,s8H,y8H,J8H,U8H,V8H,v4H,e8H,o4H,Q8H,n8H,d4H,A4H,O4H,f4H;J6E=- +"558698118";o6E=-2050919155;s6E=2;for(var p6E=1;L3V.h3E(p6E.toString(),p6E.toString().length,46093) !== J6E;p6E++){T8H=F8H.chart;s6E+=2;}if(L3V.W3E(s6E.toString(),s6E.toString().length,41401) !== o6E){T8H=F8H.chart;}if(!T8H){T8H=F8H;F8H=F8H.chart;}a8H=![];G8H=!1;M8H=null;g8H=F8H.yAxis;if(p8H && typeof p8H == "object"){a8H=p8H.isOutline;G8H=p8H.isHistogram;M8H=p8H.field;g8H=p8H.yAxis;}else {a8H=p8H;G8H=arguments[3];}W8H=T8H.dataSegment;E8H=T8H.context;I8H=g8H.top;q8H=g8H.bottom;D8H=new Array(W8H.length);k8H="transparent";R8H="transparent";S8H=0;m4H=T8H.dataSet.length - T8H.scroll - "1" * 1;P4H={};c4H=T8H.tmpWidth / 2;L8H=this.layout.candleWidth;i8H=F8H.left - 0.5 * L8H + this.micropixels - 1;for(var N8H=0;N8H <= W8H.length;N8H++){q5I="s";q5I+="o";q5I+="lid";s8H=c4H;L3V.h1i(5);i8H+=L3V.e1i(2,L8H);L8H=this.layout.candleWidth;L3V.g1i(5);i8H+=L3V.u1i(2,L8H);y8H=W8H[N8H];if(!y8H)continue;if(y8H.projection)continue;if(y8H.candleWidth){i8H+=(y8H.candleWidth - L8H) / 2;L8H=y8H.candleWidth;if(p8H.isVolume || L8H < T8H.tmpWidth){L3V.h1i(5);s8H=L3V.u1i(2,L8H);}}if(T8H.transformFunc && g8H == T8H.panel.yAxis && y8H.transform){y8H=y8H.transform;}if(y8H && M8H){y8H=y8H[M8H];}if(!y8H && y8H !== 0)continue;J8H=y8H.Close;U8H=y8H.Open === undefined?J8H:y8H.Open;if(G8H && T8H.defaultPlotField){J8H=y8H[T8H.defaultPlotField];}if(!J8H && J8H !== 0)continue;if(!G8H && (U8H == J8H || U8H === null))continue;V8H=l4H(this,y8H,a8H?"outline":q5I);if(!V8H)continue;if(a8H){k8H=V8H;}else {R8H=V8H;}L3V.g1i(7);P4H[R8H]=L3V.e1i("1",0);v4H=k8H && !L2H.isTransparent(k8H);if(v4H && !p8H.highlight){S8H=0.5;}E8H.beginPath();E8H.fillStyle=R8H;if(!y8H.cache){y8H.cache={};}e8H=y8H.cache;L3V.h1i(4);o4H=L3V.u1i(m4H,N8H);if(o4H < F8H.cacheLeft || o4H > F8H.cacheRight || !e8H.open){Q8H=g8H.semiLog?g8H.height * (1 - (Math.log(Math.max(U8H,0)) / Math.LN10 - g8H.logLow) / g8H.logShadow):(g8H.high - U8H) * g8H.multiplier;n8H=g8H.semiLog?g8H.height * (1 - (Math.log(Math.max(J8H,"0" | 0)) / Math.LN10 - g8H.logLow) / g8H.logShadow):(g8H.high - J8H) * g8H.multiplier;if(g8H.flipped){L3V.h1i(0);Q8H=L3V.u1i(Q8H,q8H);L3V.h1i(0);n8H=L3V.e1i(n8H,q8H);}else {Q8H+=I8H;n8H+=I8H;}D8H[N8H]=n8H;B8H=Math.floor(G8H?n8H:Math.min(Q8H,n8H)) + S8H;r4H=G8H?g8H.bottom:Math.max(Q8H,n8H);L3V.h1i(0);Y8H=Math.floor(L3V.e1i(B8H,r4H));if(B8H < I8H){if(B8H + Y8H < I8H){e8H.open=B8H;e8H.close=B8H;continue;}L3V.h1i(0);Y8H-=L3V.u1i(B8H,I8H);B8H=I8H;}if(B8H + Y8H > q8H){L3V.g1i(8);Y8H-=L3V.u1i(Y8H,B8H,q8H);}Y8H=Math.max(Y8H,2);e8H.open=B8H;e8H.close=e8H.open + Y8H;}if(e8H.open >= q8H)continue;if(e8H.close <= I8H)continue;d4H=Math.floor(i8H) + (!p8H.highlight && 0.5);A4H=Math.floor(d4H - s8H) + S8H;O4H=Math.round(d4H + s8H) - S8H;if(e8H.open != e8H.close){E8H.rect(A4H,e8H.open,Math.max("1" - 0,O4H - A4H),Math.max(1,e8H.close - e8H.open));}if(!p8H.highlight && this.highlightedDraggable){E8H.globalAlpha*=0.3;}if(R8H != "transparent"){E8H.fill();}if(v4H){E8H.lineWidth=1;if(p8H.highlight){E8H.lineWidth*=2;}E8H.strokeStyle=k8H;E8H.stroke();}}L3V.F3V();f4H={colors:[],cache:D8H};for(var x4H in P4H){if(!p8H.hollow || !L2H.equals(x4H,this.containerColor)){f4H.colors.push(x4H);}}return f4H;};L2H.ChartEngine.prototype.drawShadows=function(t4H,a4H,g4H){var K3V=l844;var u4H,I4H,h4H,J4H,K4H,Z4H,C4H,q4H,w4H,e4H,b4H,n4H,X4H,E4H,Y4H,L4H,H4H,G4H,j4H,T4H,y4H,B4H,F4H,N4H,Q4H,z4H;u4H=t4H.chart;if(!u4H){u4H=t4H;t4H=t4H.chart;}I4H=u4H.dataSegment;K3V.F3V();h4H=this.chart.context;K3V.h1i(9);h4H.lineWidth=K3V.e1i(0,"1");if(g4H.highlight){h4H.lineWidth*=2;}if(!g4H.highlight && this.highlightedDraggable){h4H.globalAlpha*=0.3;}J4H=g4H.field;K4H=g4H.yAxis || t4H.yAxis;Z4H=K4H.top;C4H=K4H.bottom;q4H=u4H.dataSet.length - u4H.scroll - +"1";w4H=this.layout.candleWidth;e4H=t4H.left - 0.5 * w4H + this.micropixels - 1;for(var p4H=0;p4H <= I4H.length;p4H++){K3V.g1i(10);e4H+=K3V.e1i(w4H,2010855040,"2");w4H=this.layout.candleWidth;K3V.g1i(5);e4H+=K3V.e1i(2,w4H);b4H=I4H[p4H];if(!b4H)continue;if(b4H.projection)continue;if(b4H.candleWidth){e4H+=(b4H.candleWidth - w4H) / 2;w4H=b4H.candleWidth;}n4H=a4H(this,b4H,"shadow");if(!n4H)continue;if(u4H.transformFunc && K4H == u4H.panel.yAxis && b4H.transform){b4H=b4H.transform;}if(b4H && J4H){b4H=b4H[J4H];}if(!b4H && b4H !== 0)continue;X4H=b4H.Close;E4H=b4H.Open === undefined?X4H:b4H.Open;Y4H=b4H.High === undefined?Math.max(X4H,E4H):b4H.High;L4H=b4H.Low === undefined?Math.min(X4H,E4H):b4H.Low;if(!X4H && X4H !== 0)continue;if(!b4H.cache){b4H.cache={};}H4H=b4H.cache;K3V.h1i(4);G4H=K3V.e1i(q4H,p4H);if(G4H < t4H.cacheLeft || G4H > t4H.cacheRight || !H4H.top){j4H=K4H.semiLog?K4H.height * (1 - (Math.log(Math.max(Y4H,0)) / Math.LN10 - K4H.logLow) / K4H.logShadow):(K4H.high - Y4H) * K4H.multiplier;T4H=K4H.semiLog?K4H.height * (1 - (Math.log(Math.max(L4H,"0" * 1)) / Math.LN10 - K4H.logLow) / K4H.logShadow):(K4H.high - L4H) * K4H.multiplier;if(K4H.flipped){K3V.h1i(0);j4H=K3V.u1i(j4H,C4H);K3V.h1i(0);T4H=K3V.u1i(T4H,C4H);}else {j4H+=Z4H;T4H+=Z4H;}K3V.h1i(0);y4H=K3V.e1i(j4H,T4H);if(j4H < Z4H){if(j4H + y4H < Z4H){H4H.top=j4H;H4H.bottom=j4H;continue;}K3V.g1i(0);y4H-=K3V.u1i(j4H,Z4H);j4H=Z4H;}if(j4H + y4H > C4H){K3V.g1i(8);y4H-=K3V.e1i(y4H,j4H,C4H);}H4H.top=j4H;H4H.bottom=H4H.top + y4H;}if(H4H.top >= C4H)continue;if(H4H.bottom <= Z4H)continue;B4H=Math.floor(e4H) + (!g4H.highlight && 0.5);h4H.beginPath();if(X4H == E4H){F4H=this.offset;if(g4H.isVolume){K3V.h1i(5);F4H=K3V.e1i(2,w4H);}K3V.h1i(0);N4H=K3V.e1i(F4H,B4H);K3V.h1i(4);Q4H=K3V.e1i(B4H,F4H);z4H=K4H.semiLog?K4H.height * (1 - (Math.log(Math.max(X4H,+"0")) / Math.LN10 - K4H.logLow) / K4H.logShadow):(K4H.high - X4H) * K4H.multiplier;if(K4H.flipped){K3V.g1i(0);z4H=K3V.e1i(z4H,C4H);}else {z4H+=Z4H;}if(z4H <= C4H && z4H >= Z4H){h4H.moveTo(N4H,z4H);h4H.lineTo(Q4H,z4H);}}if(Y4H != L4H){h4H.moveTo(B4H,H4H.top);h4H.lineTo(B4H,H4H.bottom);}h4H.strokeStyle=n4H;h4H.stroke();}};L2H.ChartEngine.prototype.drawBarChart=function(M4H,w0H,z0H,o0H){var f3V=l844;var W4H,r0H,O0H,i4H,m0H,P6E,v6E,F6E,W6E,h6E,U6E,l0H,S4H,s4H,d0H,D4H,X0H,b0H,K0H,j0H,P0H,f0H,k4H,c0H,V4H,x0H,t0H,u0H,R4H,h0H,U4H,C0H,v0H,H0H;W4H=M4H.chart;if(!W4H){W4H=M4H;M4H=M4H.chart;}r0H=W4H.dataSegment;O0H=new Array(r0H.length);i4H=W4H.context;f3V.F3V();m0H=this.canvasStyle(w0H);if(m0H.width && parseInt(m0H.width,10) <= 25){P6E=-1859411545;v6E=+"82418137";F6E=2;for(var D5I=1;f3V.h3E(D5I.toString(),D5I.toString().length,39582) !== P6E;D5I++){i4H.lineWidth=Math.max(1,L2H.stripPX(m0H.width));F6E+=2;}if(f3V.W3E(F6E.toString(),F6E.toString().length,80205) !== v6E){f3V.g1i(11);i4H.lineWidth=Math.max(f3V.e1i(2147483647,"8"),L2H.stripPX(m0H.width));}}else {W6E=-1376498611;h6E=-1736960777;U6E=2;for(var t6E=1;f3V.h3E(t6E.toString(),t6E.toString().length,13224) !== W6E;t6E++){i4H.lineWidth=5;U6E+=2;}if(f3V.h3E(U6E.toString(),U6E.toString().length,82414) !== h6E){i4H.lineWidth=5;}i4H.lineWidth=1;}if(o0H.highlight){f3V.g1i(0);i4H.lineWidth*=f3V.e1i(0,"2");}if(!o0H.highlight && this.highlightedDraggable){i4H.globalAlpha*=0.3;}l0H=o0H.field;S4H=o0H.yAxis || M4H.yAxis;s4H=S4H.top;d0H=S4H.bottom;X0H=W4H.dataSet.length - W4H.scroll - 1;b0H={};K0H=W4H.tmpWidth / 2;j0H=i4H.lineWidth / 2;P0H=this.layout.candleWidth;f0H=M4H.left - 0.5 * P0H + this.micropixels - 1;for(var A0H=0;A0H <= r0H.length;A0H++){f3V.g1i(5);f0H+=f3V.e1i(2,P0H);P0H=this.layout.candleWidth;f3V.g1i(12);f0H+=f3V.u1i("2",0,P0H);k4H=r0H[A0H];if(!k4H)continue;if(k4H.projection)break;if(k4H.candleWidth){f0H+=(k4H.candleWidth - P0H) / ("2" * 1);P0H=k4H.candleWidth;}c0H=z0H(this,k4H);if(!c0H)continue;f3V.h1i(7);b0H[c0H]=f3V.u1i("1",1);i4H.strokeStyle=c0H;i4H.beginPath();if(W4H.transformFunc && S4H == W4H.panel.yAxis && k4H.transform){k4H=k4H.transform;}if(k4H && l0H){k4H=k4H[l0H];}if(!k4H && k4H !== 0)continue;V4H=k4H.Close;x0H=k4H.Open === undefined?V4H:k4H.Open;t0H=k4H.High === undefined?Math.max(V4H,x0H):k4H.High;u0H=k4H.Low === undefined?Math.min(V4H,x0H):k4H.Low;if(!V4H && V4H !== 0)continue;if(!k4H.cache){k4H.cache={};}R4H=k4H.cache;f3V.g1i(4);h0H=f3V.e1i(X0H,A0H);if(h0H < M4H.cacheLeft || h0H > M4H.cacheRight || !R4H.top){U4H=this.pixelFromTransformedValue(t0H,M4H,S4H);C0H=this.pixelFromTransformedValue(u0H,M4H,S4H);R4H.open=S4H.semiLog?S4H.height * (1 - (Math.log(Math.max(x0H,0)) / Math.LN10 - S4H.logLow) / S4H.logShadow):(S4H.high - x0H) * S4H.multiplier;R4H.close=S4H.semiLog?S4H.height * (1 - (Math.log(Math.max(V4H,+"0")) / Math.LN10 - S4H.logLow) / S4H.logShadow):(S4H.high - V4H) * S4H.multiplier;if(S4H.flipped){R4H.open=S4H.bottom - R4H.open;R4H.close=S4H.bottom - R4H.close;}else {R4H.open+=S4H.top;R4H.close+=S4H.top;}O0H[A0H]=R4H.close;f3V.g1i(0);D4H=f3V.e1i(U4H,C0H);if(U4H < s4H){if(U4H + D4H < s4H){R4H.top=U4H;R4H.bottom=U4H;continue;}f3V.h1i(0);D4H-=f3V.u1i(U4H,s4H);U4H=s4H;}if(U4H + D4H > d0H){f3V.h1i(8);D4H-=f3V.e1i(D4H,U4H,d0H);}R4H.top=U4H;f3V.h1i(4);R4H.bottom=f3V.u1i(U4H,D4H);}v0H=Math.floor(f0H) + (!o0H.highlight && 0.5);if(R4H.top < d0H && R4H.bottom > s4H && k4H.High != k4H.Low){i4H.moveTo(v0H,R4H.top - j0H);i4H.lineTo(v0H,R4H.bottom + j0H);}if(o0H.type != "hlc" && R4H.open > s4H && R4H.open < d0H){i4H.moveTo(v0H,R4H.open);f3V.g1i(0);i4H.lineTo(f3V.u1i(K0H,v0H),R4H.open);}if(R4H.close > s4H && R4H.close < d0H){i4H.moveTo(v0H,R4H.close);f3V.g1i(4);i4H.lineTo(f3V.u1i(v0H,K0H),R4H.close);}i4H.stroke();}i4H.lineWidth=1;H0H={colors:[],cache:O0H};for(var Z0H in b0H){if(!L2H.equals(Z0H,this.containerColor)){H0H.colors.push(Z0H);}}return H0H;};L2H.ChartEngine.prototype.drawWaveChart=function(Y0H,E0H){var u3V=l844;var L0H,Q0H,R0H,g0H,S0H,i0H,J0H,T0H,B0H,U0H,s0H,e0H,F0H,q0H,M0H,W0H,p0H,y0H,a0H,N0H,G0H,f6E,R6E,n6E,k0H,U3E,C3E,t3E,V0H;L0H=Y0H.chart;Q0H=L0H.dataSegment;R0H=new Array(Q0H.length);function I0H(D0H){return s0H.pixelFromTransformedValue(D0H,Y0H,S0H);}g0H=L0H.context;if(!E0H){E0H={};}S0H=E0H.yAxis || Y0H.yAxis;this.startClip(Y0H.name);g0H.beginPath();i0H=! !0;J0H=!{};T0H=Y0H.yAxis.top;B0H=Y0H.yAxis.bottom;U0H=Y0H.left + Math.floor(-0.5 * this.layout.candleWidth + this.micropixels);s0H=this;for(var n0H=+"0";n0H <= Q0H.length;n0H++){U0H+=this.layout.candleWidth;e0H=Q0H[n0H];if(!e0H)continue;if(e0H.projection)break;if(L0H.transformFunc && S0H == L0H.panel.yAxis && e0H.transform){e0H=e0H.transform;}if(e0H && E0H.field){e0H=e0H[E0H.field];}if(!e0H && e0H !== +"0")continue;F0H=e0H.Close;q0H=e0H.Open === undefined?F0H:e0H.Open;M0H=e0H.High === undefined?Math.max(F0H,q0H):e0H.High;W0H=e0H.Low === undefined?Math.min(F0H,q0H):e0H.Low;if(!F0H && F0H !== 0)continue;p0H=U0H - 3 * this.layout.candleWidth / 8;y0H=I0H(q0H);if(y0H < T0H){y0H=T0H;if(J0H){g0H.moveTo(p0H,y0H);continue;}J0H=!0;}else if(y0H > B0H){y0H=B0H;if(J0H){g0H.moveTo(p0H,y0H);continue;}J0H=! ![];}else {J0H=! !0;}if(!i0H){i0H=! ![];a0H=L0H.dataSet.length - L0H.scroll - +"1";if(a0H < 0){g0H.moveTo(p0H,y0H);}else if(a0H >= "0" >> 1924358496){N0H=L0H.dataSet[a0H];if(N0H.transform){N0H=N0H.transform;}G0H=N0H.Close;G0H=I0H(G0H);G0H=Math.min(Math.max(G0H,T0H),B0H);g0H.moveTo(Y0H.left + (n0H - 1) * this.layout.candleWidth + this.micropixels,G0H);g0H.lineTo(p0H,y0H);}g0H.moveTo(p0H,y0H);}else {g0H.lineTo(p0H,y0H);}p0H+=this.layout.candleWidth / 4;if(q0H < F0H){y0H=I0H(W0H);if(y0H < T0H){y0H=T0H;}if(y0H > B0H){y0H=B0H;}g0H.lineTo(p0H,y0H);p0H+=this.layout.candleWidth / 4;y0H=I0H(M0H);if(y0H < T0H){y0H=T0H;}if(y0H > B0H){y0H=B0H;}g0H.lineTo(p0H,y0H);}else {y0H=I0H(M0H);if(y0H < T0H){y0H=T0H;}if(y0H > B0H){y0H=B0H;}g0H.lineTo(p0H,y0H);p0H+=this.layout.candleWidth / 4;y0H=I0H(W0H);if(y0H < T0H){y0H=T0H;}if(y0H > B0H){y0H=B0H;}g0H.lineTo(p0H,y0H);}p0H+=this.layout.candleWidth / 4;y0H=I0H(F0H);R0H[n0H]=y0H;if(y0H < T0H){y0H=T0H;}if(y0H > B0H){y0H=B0H;}g0H.lineTo(p0H,y0H);}f6E=1875838787;R6E=-424757176;n6E=2;for(var T6E=1;u3V.h3E(T6E.toString(),T6E.toString().length,85466) !== f6E;T6E++){k0H=this.canvasStyle("stx_line_chart");n6E+=2;}if(u3V.W3E(n6E.toString(),n6E.toString().length,50150) !== R6E){k0H=this.canvasStyle("");}if(k0H.width && parseInt(k0H.width,"10" & 2147483647) <= 25){g0H.lineWidth=Math.max(1,L2H.stripPX(k0H.width));}else {U3E=1694820187;C3E=1659476942;t3E=2;for(var v3E=1;u3V.W3E(v3E.toString(),v3E.toString().length,98895) !== U3E;v3E++){g0H.lineWidth=+"6";t3E+=2;}if(u3V.W3E(t3E.toString(),t3E.toString().length,79581) !== C3E){g0H.lineWidth=1;}}if(E0H.highlight){g0H.lineWidth*=2;}this.canvasColor("stx_line_chart");if(E0H.color){g0H.strokeStyle=E0H.color;}if(!E0H.highlight && this.highlightedDraggable){u3V.g1i(0);g0H.globalAlpha*=u3V.e1i(0,"0.3");}g0H.stroke();u3V.d3V();g0H.closePath();V0H={colors:[g0H.strokeStyle],cache:R0H};this.endClip();g0H.lineWidth=1;return V0H;};l844.F3V();L2H.ChartEngine.prototype.drawHistogram=function(d6H,A6H){var i3V=l844;var u6H,C6H,x6H,w6H,r6H,H6H,e6H,p6H,m6H,P6H,L6H,T6H,b6H,F6H,Z6H,O6H,r5I,O6E,g6E,E6E,X6H,I6H,J6H,Y6E,I6E,b6E,S6E,l6E,B6E,B6H,v6H,K6H,j6H,E6H,l6H,d6E,x6E,A6E,c6H,f6H,h6H,o6H,y6H,g6H,O5I;if(!A6H || !A6H.length){return;}u6H=d6H.panel;if(!u6H){u6H="chart";}C6H=this.panels[u6H];if(!C6H){return;}x6H=d6H.yAxis?d6H.yAxis:C6H.yAxis;w6H=d6H.type;r6H=this.chart.dataSegment;H6H=![];e6H=1;p6H=+"1";for(P6H=0;P6H < A6H.length;P6H++){H6H|=A6H[P6H].border_color_up && !L2H.isTransparent(A6H[P6H].border_color_up);H6H|=A6H[P6H].border_color_down && !L2H.isTransparent(A6H[P6H].border_color_down);e6H=A6H[P6H].opacity_up;p6H=A6H[P6H].opacity_down;if(!d6H.highlight && this.highlightedDraggable){e6H*=0.3;i3V.h1i(1);p6H*=i3V.e1i(1,"0.3");}}if(d6H.borders === !{}){H6H=! !0;}if(!d6H.name){d6H.name="Data";}L6H=x6H.multiplier;if(!d6H.heightPercentage){d6H.heightPercentage=0.7;}if(!d6H.widthFactor){d6H.widthFactor=0.8;}T6H=0;b6H=0;for(var Y6H=0;Y6H < this.chart.maxTicks;Y6H++){F6H=r6H[Y6H];if(!F6H)continue;Z6H=0;for(P6H=0;P6H < A6H.length;P6H++){O6H=F6H[A6H[P6H].field];if(O6H || O6H === 0){m6H=A6H[P6H].subField || this.chart.defaultPlotField || "Close";if(typeof O6H == "object" && O6H[m6H]){O6H=O6H[m6H];}if(w6H == "stacked"){Z6H+=O6H;}else {Z6H=O6H;}if(Z6H > T6H){T6H=Z6H;}if(Z6H < b6H){b6H=Z6H;}}}}if(T6H === 0 && b6H === 0){r5I=" N";r5I+="ot ";r5I+="Avail";r5I+="able";this.displayErrorAsWatermark(u6H,this.translateIf(d6H.name + r5I));O6E=-1358229992;g6E=-277158530;i3V.g1i(9);E6E=i3V.u1i(0,"2");for(var K6E="1" << 1906664832;i3V.h3E(K6E.toString(),K6E.toString().length,6653) !== O6E;K6E++){return;}if(i3V.h3E(E6E.toString(),E6E.toString().length,11289) !== g6E){return;}}I6H=!1;if(!d6H.bindToYAxis){if(x6H.flipped){X6H=Math.floor(x6H.top) - 0.5;J6H=Math.floor(x6H.bottom) - 0.5;}else {Y6E=+"1614051771";I6E=2093669907;b6E=2;for(var m6E="1" | 0;i3V.h3E(m6E.toString(),m6E.toString().length,1633) !== Y6E;m6E++){X6H=Math.floor(x6H.bottom) * 396;J6H=Math.floor(x6H.top) % 230;b6E+=2;}if(i3V.h3E(b6E.toString(),b6E.toString().length,62495) !== I6E){X6H=Math.floor(x6H.bottom) - 568;J6H=Math.floor(x6H.top) + 131;}X6H=Math.floor(x6H.bottom) + 0.5;J6H=Math.floor(x6H.top) + 0.5;}L6H=Math.abs(X6H - J6H) * d6H.heightPercentage / (T6H - b6H);}else {if(x6H.baseline){b6H=x6H.baseline.value;I6H=! !1;}S6E=856296751;l6E=+"251319042";B6E=2;for(var c6E=1;i3V.W3E(c6E.toString(),c6E.toString().length,20951) !== S6E;c6E++){X6H=Math.floor(this.pixelFromPrice(b6H,C6H,x6H)) + (x6H.flipped?-0.5:+"0.5");B6E+=2;}if(i3V.W3E(B6E.toString(),B6E.toString().length,16202) !== l6E){X6H=Math.floor(this.pixelFromPrice(b6H,C6H,x6H)) - (x6H.flipped?~ +"679":720);}}this.startClip(u6H);B6H=this.layout.candleWidth <= +"1" || !H6H?0:0.5;v6H=this.chart.context;if(x6H.flipped){v6H.translate(+"0",2 * x6H.top);v6H.scale(1,-1);}K6H=Math.max(0,(1 - d6H.widthFactor) * this.layout.candleWidth / 2);j6H=new Array(r6H.length);E6H=[];i3V.d3V();l6H=this;function z6H(f7H,x7H,i6H,D6H,N6H,r7H,P7H,V6H,v7H){var R6H,o7H,S6H,G6H,a6H,U6H,d7H,W6H,q6H,s6H,M6H,Q6H,k6H,A7H,F3E,e6E,D6E;if(!D6H){D6H=1;}v6H.globalAlpha=D6H;v6H.beginPath();i3V.h1i(4);R6H=i3V.u1i(X6H,0.5);o7H=Math.floor(l6H.pixelFromBar("0" | 0,C6H.chart) - l6H.layout.candleWidth / 2);S6H=o7H;for(var n6H=0;n6H < r6H.length;n6H++){G6H=E6H[n6H] || X6H;if(n6H === +"0"){R6H=G6H;}if(!r6H[n6H] || !r6H[n6H][f7H]){R6H=G6H;S6H+=l6H.layout.candleWidth;continue;}a6H=r6H[n6H];U6H=a6H[f7H];if(typeof U6H == "object" && U6H[x7H]){U6H=U6H[x7H];}i3V.g1i(13);d7H=i3V.u1i(b6H,L6H,U6H);if(isNaN(d7H))continue;W6H=l6H.layout.candleWidth;if(a6H.candleWidth){W6H=a6H.candleWidth;if(n6H === 0){o7H=S6H=Math.floor(l6H.pixelFromBar(0,C6H.chart) - a6H.candleWidth / ("2" * 1));}}q6H=Math.floor(G6H - d7H) + +"0.5";if(q6H > G6H && !I6H){q6H=G6H;}if(v7H && v7H.indexOf(n6H) == -1 || !v7H && (r7H && a6H.Close < a6H.iqPrevClose || !r7H && a6H.Close >= a6H.iqPrevClose)){R6H=q6H;S6H+=W6H;continue;}s6H=W6H / l6H.layout.candleWidth;if(K6H){i3V.g1i(14);M6H=Math.round(i3V.e1i(P7H,s6H,V6H,K6H,S6H));i3V.g1i(4);Q6H=i3V.e1i(M6H,N6H?0:B6H);k6H=M6H + Math.round(V6H * s6H) - (N6H?0:B6H);}else {i3V.g1i(14);M6H=i3V.u1i(P7H,s6H,V6H,K6H,S6H);Q6H=Math.round(M6H) + (N6H?"0" ^ 0:B6H);k6H=Math.round(M6H + V6H * s6H) - (N6H?"0" << 1969503104:B6H);}if(k6H - Q6H < 2){i3V.h1i(15);k6H=i3V.u1i("1",1,Q6H);}A7H=N6H?0:0.5;if(Q6H % 1 == A7H){Q6H+=0.5;}if(k6H % 1 == A7H){k6H+=0.5;}v6H.moveTo(k6H,G6H);if(X6H != G6H && N6H && !K6H && E6H[n6H + 1]){v6H.moveTo(k6H,Math.max(q6H,Math.min(G6H,E6H[n6H + 1])));}v6H.lineTo(k6H,q6H);v6H.lineTo(Q6H,q6H);if(N6H && P7H){if(j6H[n6H] > q6H || n6H === 0){v6H.lineTo(Q6H,Math.min(G6H,j6H[n6H]));}}else if(N6H && !K6H && w6H == "clustered"){if(n6H > ("0" & 2147483647) && j6H[n6H - 1] && j6H[n6H - 1] > q6H){v6H.lineTo(Q6H,Math.min(G6H,j6H[n6H - 1]));}}else if(N6H && !K6H){if(R6H > q6H || n6H === 0){v6H.lineTo(Q6H,Math.min(G6H,R6H));}}else {v6H.lineTo(Q6H,G6H);}R6H=q6H;S6H+=W6H;if(w6H != "clustered" || N6H){j6H[n6H]=q6H;}}if(N6H){v6H.strokeStyle=!i6H || i6H == "auto"?l6H.defaultColor:i6H;F3E=2106096451;e6E=427797118;D6E=2;for(var u6E=1;i3V.h3E(u6E.toString(),u6E.toString().length,42804) !== F3E;u6E++){v6H.stroke();D6E+=2;}if(i3V.W3E(D6E.toString(),D6E.toString().length,+"37720") !== e6E){v6H.stroke();}}else {v6H.fillStyle=!i6H || i6H == "auto"?l6H.defaultColor:i6H;v6H.fill();}v6H.closePath();}d6E=- +"1677313737";x6E=-1786921250;A6E=2;for(var N6E=1;i3V.W3E(N6E.toString(),N6E.toString().length,6650) !== d6E;N6E++){c6H=0;A6E+=2;}if(i3V.W3E(A6E.toString(),A6E.toString().length,79984) !== x6E){c6H=1;}for(P6H=0;P6H < A6H.length;P6H++){f6H=A6H[P6H];c6H=this.layout.candleWidth * d6H.widthFactor;if(K6H){if(this.layout.candleWidth - c6H <= 2){H6H=![];}}h6H=0;if(w6H == "clustered"){h6H=P6H;c6H/=A6H.length;}m6H=f6H.subField || this.chart.defaultPlotField || "Close";if(typeof f6H.color_function == "function"){y6H={};for(var t6H=0;t6H < r6H.length;t6H++){if(r6H[t6H]){O5I="borde";O5I+="r_op";O5I+="acit";O5I+="y";o6H=f6H.color_function(r6H[t6H]);if(typeof o6H == "string"){o6H={fill_color:o6H,border_color:o6H};}if(!o6H.hasOwnProperty(O5I)){o6H.border_opacity=o6H.opacity;}g6H=o6H.fill_color + ((461,7640) <= (7150,6920)?![]:(8053,9487) > 587.61?",":6599 <= (9220,+"577.39")?531:("v","0x12c5" ^ 0)) + o6H.border_color;if((g6H in y6H)){y6H[g6H].positions.push(t6H);}else {o6H.positions=[t6H];y6H[g6H]=o6H;}}}for(g6H in y6H){o6H=y6H[g6H];z6H(f6H.field,m6H,o6H.fill_color,o6H.opacity,null,null,h6H,c6H,o6H.positions);z6H(f6H.field,m6H,o6H.border_color,o6H.border_opacity,! !"1",null,h6H,c6H,o6H.positions);}}else {z6H(f6H.field,m6H,f6H.fill_color_up,e6H,null,! !1,h6H,c6H);z6H(f6H.field,m6H,f6H.fill_color_down,p6H,null,null,h6H,c6H);if(this.layout.candleWidth >= 2 && H6H){z6H(f6H.field,m6H,f6H.border_color_up,e6H,! ![],! !{},h6H,c6H);z6H(f6H.field,m6H,f6H.border_color_down,p6H,! !1,null,h6H,c6H);}}if(w6H == "stacked"){E6H=L2H.shallowClone(j6H);}}i3V.h1i(0);v6H.globalAlpha=i3V.u1i(0,"1");this.endClip();};L2H.ChartEngine.prototype.scatter=function(t7H,b7H){var G3V=l844;var H7H,u7H,y7H,c7H,T7H,l7H,g7H,e7H,p7H,h7H,Z7H,O7H,g5I,m7H,C7H,w7H,j7H,z7H,B7H;H7H=t7H.chart;u7H=H7H.dataSegment;y7H=new Array(u7H.length);c7H=this.chart.context;this.canvasColor("stx_scatter_chart");G3V.d3V();if(!b7H){b7H={};}T7H=b7H.field || H7H.defaultPlotField;l7H=b7H.yAxis || t7H.yAxis;g7H=b7H.subField || H7H.defaultPlotField || "Close";this.startClip(t7H.name);c7H.beginPath();c7H.lineWidth=b7H.lineWidth || 4;if(b7H.highlight){G3V.g1i(9);c7H.lineWidth*=G3V.u1i(0,"2");}if(!b7H.highlight && this.highlightedDraggable){c7H.globalAlpha*=0.3;}if(b7H.color){c7H.strokeStyle=b7H.color;}e7H=l7H.top;p7H=l7H.bottom;h7H=this.layout.candleWidth;Z7H=t7H.left - 0.5 * h7H + this.micropixels - 1;for(var X7H=+"0";X7H <= u7H.length;X7H++){G3V.h1i(5);Z7H+=G3V.u1i(2,h7H);h7H=this.layout.candleWidth;G3V.g1i(5);Z7H+=G3V.u1i(2,h7H);O7H=u7H[X7H];if(!O7H)continue;if(O7H.candleWidth){Z7H+=(O7H.candleWidth - h7H) / 2;h7H=O7H.candleWidth;}if(!O7H.projection){g5I="Scatte";g5I+="r";if(H7H.transformFunc && l7H == H7H.panel.yAxis && O7H.transform){O7H=O7H.transform;}m7H=O7H[T7H];if(m7H && m7H[g7H] !== undefined){m7H=m7H[g7H];}if(!(m7H instanceof Array)){m7H=[m7H];}if((g5I in O7H)){m7H=O7H.Scatter;}for(var K7H=0;K7H < m7H.length;K7H++){if(!m7H[K7H] && m7H[K7H] !== 0)continue;C7H=m7H[K7H];w7H=0;if(m7H[K7H] instanceof Array){C7H=m7H[K7H][0];w7H=m7H[K7H][2];}j7H=l7H.semiLog?l7H.height * (1 - (Math.log(Math.max(C7H,0)) / Math.LN10 - l7H.logLow) / l7H.logShadow):(l7H.high - C7H) * l7H.multiplier;if(l7H.flipped){G3V.g1i(0);j7H=G3V.e1i(j7H,p7H);}else {j7H+=e7H;}if(j7H < e7H)continue;if(j7H > p7H)continue;z7H=2;if(w7H){G3V.g1i(1);z7H=G3V.e1i(w7H,h7H);}G3V.h1i(0);c7H.moveTo(G3V.u1i(z7H,Z7H),j7H);G3V.g1i(4);c7H.lineTo(G3V.u1i(Z7H,z7H),j7H);y7H[X7H]=j7H;}}}c7H.stroke();c7H.closePath();B7H={colors:[c7H.strokeStyle],cache:y7H};this.endClip();c7H.lineWidth=+"1";return B7H;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
l044[643118]=(function(){var w=2;for(;w !== 9;){switch(w){case 2:w=typeof globalThis === '\x6f\x62\x6a\x65\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var s;try{var d=2;for(;d !== 6;){switch(d){case 2:Object['\x64\x65\x66\u0069\x6e\u0065\u0050\x72\u006f\u0070\x65\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\u006c\x6b\u0030\x44\x75',{'\x67\x65\x74':function(){var k=2;for(;k !== 1;){switch(k){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});s=lk0Du;s['\u004c\u0045\x71\x4f\x35']=s;d=4;break;case 9:delete s['\x4c\u0045\x71\x4f\u0035'];var F=Object['\x70\u0072\u006f\u0074\x6f\u0074\x79\x70\x65'];delete F['\u006c\u006b\u0030\x44\x75'];d=6;break;case 3:throw "";d=9;break;case 4:d=typeof LEqO5 === '\u0075\x6e\u0064\x65\x66\u0069\x6e\u0065\x64'?3:9;break;}}}catch(x){s=window;}return s;break;}}})();l044[351557]=U300(l044[643118]);l044[376554]=j444(l044[643118]);l044[217582]=i444(l044[643118]);l044[28140]=e844(l044[643118]);l044.i5D=function(){return typeof l044[307585].U2D === 'function'?l044[307585].U2D.apply(l044[307585],arguments):l044[307585].U2D;};l044.Q3J=function(){return typeof l044[347346].U8Z === 'function'?l044[347346].U8Z.apply(l044[347346],arguments):l044[347346].U8Z;};l044.U2M=function(){return typeof l044.m2M.w6z === 'function'?l044.m2M.w6z.apply(l044.m2M,arguments):l044.m2M.w6z;};l044.s5O=function(){return typeof l044[444253].N01 === 'function'?l044[444253].N01.apply(l044[444253],arguments):l044[444253].N01;};l044[237211]=(function(f68){var l0b=2;for(;l0b !== 10;){switch(l0b){case 2:var O68,S68,b68,F68;l0b=1;break;case 1:l0b=! F68--?5:4;break;case 5:O68=l044[643118];l0b=4;break;case 12:var Q68,I68=0;l0b=11;break;case 4:var a68='fromCharCode',U68='RegExp';l0b=3;break;case 3:l0b=! F68--?9:8;break;case 9:S68=typeof a68;l0b=8;break;case 7:b68=S68.C444(new O68[U68]("^['-|]"),'S');l0b=6;break;case 11:return {G68:function(v78){var O0b=2;for(;O0b !== 6;){switch(O0b){case 9:I68=D78 + 60000;O0b=8;break;case 8:var j78=(function(C78,k78){var J0b=2;for(;J0b !== 10;){switch(J0b){case 3:var K78,J78=0;J0b=9;break;case 8:var o78=O68[k78[4]](C78[k78[2]](J78),16)[k78[3]](2);var Z78=o78[k78[2]](o78[k78[5]] - 1);J0b=6;break;case 4:k78=f68;J0b=3;break;case 5:J0b=typeof k78 === 'undefined' && typeof f68 !== 'undefined'?4:3;break;case 13:J78++;J0b=9;break;case 11:return K78;break;case 1:C78=v78;J0b=5;break;case 9:J0b=J78 < C78[k78[5]]?8:11;break;case 12:K78=K78 ^ Z78;J0b=13;break;case 14:K78=Z78;J0b=13;break;case 2:J0b=typeof C78 === 'undefined' && typeof v78 !== 'undefined'?1:5;break;case 6:J0b=J78 === 0?14:12;break;}}})(undefined,undefined);return j78?Q68:!Q68;break;case 5:O0b=! F68--?4:3;break;case 4:Q68=H68(D78);O0b=3;break;case 1:O0b=D78 > I68?5:8;break;case 3:O0b=! F68--?9:8;break;case 2:var D78=new O68[f68[0]]()[f68[1]]();O0b=1;break;}}}};break;case 14:f68=f68.K444(function(g78){var y0b=2;for(;y0b !== 13;){switch(y0b){case 3:y0b=d78 < g78.length?9:7;break;case 14:return A78;break;case 9:A78+=O68[b68][a68](g78[d78] + 116);y0b=8;break;case 2:var A78;y0b=1;break;case 7:y0b=!A78?6:14;break;case 1:y0b=! F68--?5:4;break;case 6:return;break;case 8:d78++;y0b=3;break;case 4:var d78=0;y0b=3;break;case 5:A78='';y0b=4;break;}}});l0b=13;break;case 6:l0b=! F68--?14:13;break;case 8:l0b=! F68--?7:6;break;case 13:l0b=! F68--?12:11;break;}}function H68(q68){var q0b=2;for(;q0b !== 15;){switch(q0b){case 2:var p68,W68,c78,P78,T78,s68,w78;q0b=1;break;case 11:s68=(T78 || T78 === 0) && w78(T78,W68);q0b=10;break;case 16:p68=P78 - q68 > W68;q0b=19;break;case 4:q0b=! F68--?3:9;break;case 7:q0b=! F68--?6:14;break;case 1:q0b=! F68--?5:4;break;case 20:p68=q68 - s68 > W68 && P78 - q68 > W68;q0b=19;break;case 18:q0b=s68 >= 0?17:16;break;case 8:c78=f68[6];q0b=7;break;case 10:q0b=s68 >= 0 && P78 >= 0?20:18;break;case 3:W68=29;q0b=9;break;case 14:q0b=! F68--?13:12;break;case 19:return p68;break;case 6:P78=c78 && w78(c78,W68);q0b=14;break;case 17:p68=q68 - s68 > W68;q0b=19;break;case 9:q0b=! F68--?8:7;break;case 13:T78=f68[7];q0b=12;break;case 5:w78=O68[f68[4]];q0b=4;break;case 12:q0b=! F68--?11:10;break;}}}})([[-48,-19,0,-15],[-13,-15,0,-32,-11,-7,-15],[-17,-12,-19,-2,-51,0],[0,-5,-33,0,-2,-11,-6,-13],[-4,-19,-2,-1,-15,-43,-6,0],[-8,-15,-6,-13,0,-12],[-65,-62,-3,-62,-68,-59,-17,-15,-5],[]]);l044.m2M=(function(){var k2M=2;for(;k2M !== 9;){switch(k2M){case 3:return N2M[7];break;case 2:var N2M=[arguments];N2M[9]=undefined;N2M[7]={};N2M[7].w6z=function(){var P2M=2;for(;P2M !== 90;){switch(P2M){case 56:K2M[11]=K2M[6][K2M[86]];try{K2M[56]=K2M[11][K2M[14]]()?K2M[87]:K2M[16];}catch(L5p){K2M[56]=K2M[16];}P2M=77;break;case 4:K2M[6]=[];K2M[5]={};K2M[5].V1b=['G1b'];K2M[5].m1b=function(){var B5p=typeof E444 === 'function';return B5p;};K2M[9]=K2M[5];K2M[8]={};K2M[8].V1b=['G1b'];P2M=13;break;case 67:N2M[9]=14;return 49;break;case 71:K2M[68]++;P2M=76;break;case 2:var K2M=[arguments];P2M=1;break;case 38:K2M[45].V1b=['W1b'];K2M[45].m1b=function(){var N5p=function(){return encodeURIComponent('%');};var C5p=(/\x32\u0035/).r444(N5p + []);return C5p;};K2M[89]=K2M[45];K2M[6].M444(K2M[30]);K2M[6].M444(K2M[89]);K2M[6].M444(K2M[3]);P2M=51;break;case 68:P2M=60?68:67;break;case 18:K2M[2]={};K2M[2].V1b=['W1b'];K2M[2].m1b=function(){var b5p=function(){return ['a','a'].join();};var Y5p=!(/(\u005b|\x5d)/).r444(b5p + []);return Y5p;};K2M[4]=K2M[2];P2M=27;break;case 76:P2M=K2M[68] < K2M[11][K2M[37]].length?75:70;break;case 47:K2M[6].M444(K2M[61]);K2M[6].M444(K2M[9]);K2M[6].M444(K2M[4]);P2M=65;break;case 57:P2M=K2M[86] < K2M[6].length?56:69;break;case 21:K2M[38].m1b=function(){var J5p=false;var h5p=[];try{for(var l5p in console){h5p.M444(l5p);}J5p=h5p.length === 0;}catch(E5p){}var j5p=J5p;return j5p;};K2M[61]=K2M[38];K2M[25]={};K2M[25].V1b=['W1b'];K2M[25].m1b=function(){var c5p=function(){return ('X').toLocaleLowerCase();};var s5p=(/\u0078/).r444(c5p + []);return s5p;};P2M=31;break;case 5:return 90;break;case 23:K2M[38]={};K2M[38].V1b=['G1b'];P2M=21;break;case 27:K2M[20]={};K2M[20].V1b=['W1b'];K2M[20].m1b=function(){var a5p=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var S5p=(/\u0074\u0072\x75\u0065/).r444(a5p + []);return S5p;};K2M[46]=K2M[20];P2M=23;break;case 75:K2M[82]={};K2M[82][K2M[66]]=K2M[11][K2M[37]][K2M[68]];K2M[82][K2M[29]]=K2M[56];K2M[62].M444(K2M[82]);P2M=71;break;case 31:K2M[57]=K2M[25];K2M[58]={};K2M[58].V1b=['G1b'];K2M[58].m1b=function(){var q5p=typeof L444 === 'function';return q5p;};K2M[30]=K2M[58];K2M[50]={};P2M=42;break;case 77:K2M[68]=0;P2M=76;break;case 42:K2M[50].V1b=['W1b'];K2M[50].m1b=function(){var r5p=function(){return decodeURI('%25');};var M5p=!(/\u0032\u0035/).r444(r5p + []);return M5p;};K2M[65]=K2M[50];K2M[45]={};P2M=38;break;case 69:P2M=(function(u2M){var O2M=2;for(;O2M !== 22;){switch(O2M){case 5:return;break;case 17:L2M[2]=0;O2M=16;break;case 18:L2M[9]=false;O2M=17;break;case 1:O2M=L2M[0][0].length === 0?5:4;break;case 20:L2M[8][L2M[4][K2M[66]]].h+=true;O2M=19;break;case 15:L2M[6]=L2M[1][L2M[2]];L2M[5]=L2M[8][L2M[6]].h / L2M[8][L2M[6]].t;O2M=26;break;case 13:L2M[8][L2M[4][K2M[66]]]=(function(){var d2M=2;for(;d2M !== 9;){switch(d2M){case 2:var H2M=[arguments];H2M[2]={};H2M[2].h=0;H2M[2].t=0;d2M=3;break;case 3:return H2M[2];break;}}}).d444(this,arguments);O2M=12;break;case 2:var L2M=[arguments];O2M=1;break;case 4:L2M[8]={};L2M[1]=[];L2M[2]=0;O2M=8;break;case 8:L2M[2]=0;O2M=7;break;case 24:L2M[2]++;O2M=16;break;case 12:L2M[1].M444(L2M[4][K2M[66]]);O2M=11;break;case 11:L2M[8][L2M[4][K2M[66]]].t+=true;O2M=10;break;case 23:return L2M[9];break;case 16:O2M=L2M[2] < L2M[1].length?15:23;break;case 6:L2M[4]=L2M[0][0][L2M[2]];O2M=14;break;case 10:O2M=L2M[4][K2M[29]] === K2M[87]?20:19;break;case 14:O2M=typeof L2M[8][L2M[4][K2M[66]]] === 'undefined'?13:11;break;case 26:O2M=L2M[5] >= 0.5?25:24;break;case 7:O2M=L2M[2] < L2M[0][0].length?6:18;break;case 19:L2M[2]++;O2M=7;break;case 25:L2M[9]=true;O2M=24;break;}}})(K2M[62])?68:67;break;case 51:K2M[6].M444(K2M[57]);K2M[6].M444(K2M[65]);K2M[6].M444(K2M[1]);K2M[6].M444(K2M[46]);P2M=47;break;case 58:K2M[86]=0;P2M=57;break;case 70:K2M[86]++;P2M=57;break;case 62:K2M[37]='V1b';K2M[29]='z1b';K2M[14]='m1b';K2M[66]='o1b';P2M=58;break;case 65:K2M[62]=[];K2M[87]='k1b';K2M[16]='b1b';P2M=62;break;case 1:P2M=N2M[9]?5:4;break;case 13:K2M[8].m1b=function(){var K5p=typeof c444 === 'function';return K5p;};K2M[1]=K2M[8];K2M[7]={};K2M[7].V1b=['W1b'];K2M[7].m1b=function(){var Q5p=function(){return ('a').codePointAt(0);};var H5p=(/\u0039\x37/).r444(Q5p + []);return H5p;};K2M[3]=K2M[7];P2M=18;break;}}};k2M=3;break;}}})();function i444(M0b){function l7b(Y0b,g0b,o0b,E0b,V0b){var v0b=2;for(;v0b !== 9;){switch(v0b){case 2:var X0b=[arguments];X0b[1]="define";X0b[2]="Propert";X0b[8]="y";try{var e0b=2;for(;e0b !== 8;){switch(e0b){case 2:X0b[5]={};X0b[6]=(1,X0b[0][1])(X0b[0][0]);X0b[3]=[S7b[5],X0b[6].prototype][X0b[0][3]];X0b[5].value=X0b[3][X0b[0][2]];e0b=3;break;case 3:try{var W0b=2;for(;W0b !== 3;){switch(W0b){case 2:X0b[4]=X0b[1];X0b[4]+=X0b[2];X0b[4]+=X0b[8];X0b[0][0].Object[X0b[4]](X0b[3],X0b[0][4],X0b[5]);W0b=3;break;}}}catch(R7b){}X0b[3][X0b[0][4]]=X0b[5].value;e0b=8;break;}}}catch(K7b){}v0b=9;break;}}}function W7b(b0b){var D0b=2;for(;D0b !== 5;){switch(D0b){case 2:var C7b=[arguments];return C7b[0][0].Array;break;}}}function e7b(k0b){var m0b=2;for(;m0b !== 5;){switch(m0b){case 2:var h7b=[arguments];m0b=1;break;case 1:return h7b[0][0].String;break;}}}var n0b=2;for(;n0b !== 16;){switch(n0b){case 11:S7b[7]=S7b[6];S7b[7]+=S7b[3];S7b[7]+=S7b[8];n0b=19;break;case 6:S7b[5]=1;S7b[4]=S7b[1];S7b[4]+=S7b[8];S7b[4]+=S7b[3];n0b=11;break;case 17:D7b(W7b,"map",S7b[5],S7b[4]);n0b=16;break;case 18:D7b(e7b,"replace",S7b[5],S7b[7]);n0b=17;break;case 3:S7b[3]="4";S7b[8]="44";S7b[1]="";S7b[1]="K";n0b=6;break;case 19:var D7b=function(x0b,u0b,P0b,w0b){var z0b=2;for(;z0b !== 5;){switch(z0b){case 2:var A7b=[arguments];l7b(S7b[0][0],A7b[0][0],A7b[0][1],A7b[0][2],A7b[0][3]);z0b=5;break;}}};n0b=18;break;case 2:var S7b=[arguments];S7b[6]="";S7b[6]="C";S7b[3]="";n0b=3;break;}}}function U300(g6G){function h6G(b6G){var I3J=2;for(;I3J !== 5;){switch(I3J){case 2:var z6G=[arguments];return z6G[0][0].String;break;}}}var r3J=2;for(;r3J !== 12;){switch(r3J){case 14:var x6G=function(l6G,W6G,B6G,U6G){var k3J=2;for(;k3J !== 5;){switch(k3J){case 2:var E6G=[arguments];K6G(v6G[0][0],E6G[0][0],E6G[0][1],E6G[0][2],E6G[0][3]);k3J=5;break;}}};r3J=13;break;case 13:x6G(h6G,"charCodeAt",v6G[1],v6G[6]);r3J=12;break;case 8:v6G[6]=v6G[9];v6G[6]+=v6G[4];v6G[6]+=v6G[5];r3J=14;break;case 2:var v6G=[arguments];v6G[4]="";v6G[5]="0";v6G[4]="30";v6G[1]=1;v6G[9]="o";r3J=8;break;}}function K6G(t6G,P6G,m6G,q6G,e3J){var X3J=2;for(;X3J !== 7;){switch(X3J){case 2:var A6G=[arguments];A6G[7]="";A6G[7]="ty";A6G[4]="Proper";A6G[3]="";X3J=9;break;case 9:A6G[3]="define";try{var R3J=2;for(;R3J !== 8;){switch(R3J){case 2:A6G[8]={};A6G[2]=(1,A6G[0][1])(A6G[0][0]);A6G[1]=[v6G[1],A6G[2].prototype][A6G[0][3]];A6G[8].value=A6G[1][A6G[0][2]];try{var c3J=2;for(;c3J !== 3;){switch(c3J){case 2:A6G[9]=A6G[3];A6G[9]+=A6G[4];A6G[9]+=A6G[7];A6G[0][0].Object[A6G[9]](A6G[1],A6G[0][4],A6G[8]);c3J=3;break;}}}catch(F6G){}A6G[1][A6G[0][4]]=A6G[8].value;R3J=8;break;}}}catch(D6G){}X3J=7;break;}}}}function e844(v2M){function Z1M(x2M){var w2M=2;for(;w2M !== 5;){switch(w2M){case 2:var I2M=[arguments];return I2M[0][0].RegExp;break;}}}function e1M(D2M,s2M,t2M,E2M,T2M){var i2M=2;for(;i2M !== 6;){switch(i2M){case 3:Z2M[6]="ne";Z2M[5]="";Z2M[5]="defi";try{var p2M=2;for(;p2M !== 8;){switch(p2M){case 2:Z2M[9]={};Z2M[2]=(1,Z2M[0][1])(Z2M[0][0]);Z2M[3]=[Z2M[2],Z2M[2].prototype][Z2M[0][3]];Z2M[9].value=Z2M[3][Z2M[0][2]];p2M=3;break;case 3:try{var f2M=2;for(;f2M !== 3;){switch(f2M){case 4:Z2M[0][0].Object[Z2M[4]](Z2M[3],Z2M[0][4],Z2M[9]);f2M=3;break;case 2:Z2M[4]=Z2M[5];Z2M[4]+=Z2M[6];Z2M[4]+=Z2M[1];f2M=4;break;}}}catch(E1M){}Z2M[3][Z2M[0][4]]=Z2M[9].value;p2M=8;break;}}}catch(T1M){}i2M=6;break;case 2:var Z2M=[arguments];Z2M[1]="";Z2M[1]="Property";Z2M[6]="";i2M=3;break;}}}function y1M(J2M){var V2M=2;for(;V2M !== 5;){switch(V2M){case 2:var b2M=[arguments];return b2M[0][0].Function;break;}}}function z1M(g2M){var G2M=2;for(;G2M !== 5;){switch(G2M){case 2:var o2M=[arguments];return o2M[0][0].Array;break;}}}function j1M(R2M){var Y2M=2;for(;Y2M !== 5;){switch(Y2M){case 2:var Q2M=[arguments];return Q2M[0][0];break;}}}var A2M=2;for(;A2M !== 55;){switch(A2M){case 6:y2M[6]="";y2M[6]="__";y2M[9]="";y2M[9]="r4";A2M=11;break;case 27:y2M[73]="L4";y2M[78]="";y2M[52]="44";y2M[78]="";A2M=23;break;case 3:y2M[4]="";y2M[4]="ze";y2M[2]="E4";y2M[6]="";A2M=6;break;case 2:var y2M=[arguments];y2M[1]="";y2M[1]="ual";y2M[5]="__resi";A2M=3;break;case 59:C1M(Z1M,"test",y2M[40],y2M[21]);A2M=58;break;case 51:y2M[29]+=y2M[78];y2M[45]=y2M[6];y2M[45]+=y2M[7];y2M[45]+=y2M[4];A2M=47;break;case 36:y2M[21]+=y2M[78];y2M[21]+=y2M[78];y2M[29]=y2M[8];y2M[29]+=y2M[78];A2M=51;break;case 60:C1M(j1M,y2M[45],y2M[33],y2M[29]);A2M=59;break;case 34:y2M[40]=1;y2M[33]=0;y2M[10]=y2M[99];y2M[10]+=y2M[78];A2M=30;break;case 30:y2M[10]+=y2M[52];y2M[86]=y2M[73];y2M[86]+=y2M[78];y2M[86]+=y2M[78];y2M[97]=y2M[41];y2M[97]+=y2M[3];y2M[97]+=y2M[47];A2M=40;break;case 56:C1M(y1M,"apply",y2M[40],y2M[10]);A2M=55;break;case 61:C1M(j1M,y2M[91],y2M[33],y2M[68]);A2M=60;break;case 23:y2M[78]="4";y2M[99]="";y2M[99]="d";y2M[40]=0;A2M=34;break;case 11:y2M[3]="";y2M[7]="optimi";y2M[8]="c4";y2M[3]="_a";A2M=18;break;case 40:y2M[11]=y2M[34];y2M[11]+=y2M[78];y2M[11]+=y2M[78];y2M[21]=y2M[9];A2M=36;break;case 47:y2M[68]=y2M[2];y2M[68]+=y2M[78];y2M[68]+=y2M[78];y2M[91]=y2M[5];A2M=64;break;case 18:y2M[34]="M4";y2M[41]="_";y2M[47]="bstract";y2M[73]="";A2M=27;break;case 58:C1M(z1M,"push",y2M[40],y2M[11]);A2M=57;break;case 64:y2M[91]+=y2M[99];y2M[91]+=y2M[1];A2M=62;break;case 57:C1M(j1M,y2M[97],y2M[33],y2M[86]);A2M=56;break;case 62:var C1M=function(n2M,c2M,r2M,F2M){var h2M=2;for(;h2M !== 5;){switch(h2M){case 2:var z2M=[arguments];e1M(y2M[0][0],z2M[0][0],z2M[0][1],z2M[0][2],z2M[0][3]);h2M=5;break;}}};A2M=61;break;}}}l044.a0b=function(){return typeof l044[237211].G68 === 'function'?l044[237211].G68.apply(l044[237211],arguments):l044[237211].G68;};l044[444253]=(function(){var m4O=2;for(;m4O !== 4;){switch(m4O){case 1:var O01,v01;return {a01:function(k01,P01,m01,F01){var i4O=2;for(;i4O !== 1;){switch(i4O){case 2:return j01(k01,P01,m01,F01);break;}}},N01:function(i01,J01,h01,L01){var M4O=2;for(;M4O !== 1;){switch(M4O){case 2:return j01(i01,J01,h01,L01,true);break;}}}};break;case 2:var x01=l044[643118];m4O=1;break;}}function V01(K01){var t4O=2;for(;t4O !== 7;){switch(t4O){case 2:var g01=2;var M01='';t4O=5;break;case 5:var y01=0;t4O=4;break;case 4:t4O=y01 < K01.length?3:8;break;case 3:M01+=e044.r044(K01[y01] - g01 + 99);t4O=9;break;case 9:y01++;t4O=4;break;case 8:return M01;break;}}}function j01(W01,Q01,H01,d01,u01){var a4O=2;for(;a4O !== 15;){switch(a4O){case 2:var b01,C01,B01,A01;A01=x01[V01([11,14,2,0,19,8,14,13])];!O01 && (O01=typeof A01 !== "undefined"?A01[V01([7,14,18,19,13,0,12,4])] || ' ':"");!v01 && (v01=typeof A01 !== "undefined"?A01[V01([7,17,4,5])]:"");a4O=3;break;case 3:B01=u01?v01:O01;a4O=9;break;case 9:a4O=d01 > 0?8:19;break;case 6:return l044.Q3J(b01,C01,H01);break;case 12:return false;break;case 16:return l044.Q3J(b01,C01,H01);break;case 18:b01=B01.T044(0,B01.length);C01=b01.length;a4O=16;break;case 19:a4O=W01 === null || W01 <= 0?18:14;break;case 14:var w01=B01.length - W01;a4O=13;break;case 8:b01=B01.T044(W01,d01);a4O=7;break;case 7:C01=b01.length;a4O=6;break;case 11:b01=B01.T044(w01,B01.length);C01=b01.length;return l044.Q3J(b01,C01,H01);break;case 13:a4O=Q01 && w01 > 0 && B01.s444(w01 - 1) !== 46?12:11;break;}}}})();l044.i0b=function(){return typeof l044[237211].G68 === 'function'?l044[237211].G68.apply(l044[237211],arguments):l044[237211].G68;};l044.q2M=function(){return typeof l044.m2M.w6z === 'function'?l044.m2M.w6z.apply(l044.m2M,arguments):l044.m2M.w6z;};l044[643118].f233=l044;l044.h5O=function(){return typeof l044[444253].a01 === 'function'?l044[444253].a01.apply(l044[444253],arguments):l044[444253].a01;};function j444(X4O){function I3O(b4O){var U4O=2;for(;U4O !== 5;){switch(U4O){case 2:var o4O=[arguments];U4O=1;break;case 1:return o4O[0][0].String;break;}}}function L3O(G4O,C4O,I4O,J4O,K4O){var z4O=2;for(;z4O !== 7;){switch(z4O){case 8:try{var R4O=2;for(;R4O !== 8;){switch(R4O){case 2:c4O[6]={};c4O[9]=(1,c4O[0][1])(c4O[0][0]);c4O[7]=[c4O[9],c4O[9].prototype][c4O[0][3]];R4O=4;break;case 4:c4O[6].value=c4O[7][c4O[0][2]];try{var W4O=2;for(;W4O !== 3;){switch(W4O){case 2:c4O[1]=c4O[5];c4O[1]+=c4O[3];c4O[1]+=c4O[4];c4O[0][0].Object[c4O[1]](c4O[7],c4O[0][4],c4O[6]);W4O=3;break;}}}catch(A4O){}R4O=9;break;case 9:c4O[7][c4O[0][4]]=c4O[6].value;R4O=8;break;}}}catch(h4O){}z4O=7;break;case 2:var c4O=[arguments];c4O[3]="";c4O[4]="ty";c4O[3]="";c4O[3]="Proper";c4O[5]="define";z4O=8;break;}}}var N4O=2;for(;N4O !== 32;){switch(N4O){case 35:C3O(K3O,"fromCharCode",u4O[3],u4O[67]);N4O=34;break;case 2:var u4O=[arguments];u4O[7]="";u4O[7]="e";u4O[1]="";u4O[5]="r";u4O[1]="T0";u4O[8]="04";N4O=7;break;case 7:u4O[9]="";u4O[4]="4";u4O[9]="s4";u4O[6]=0;N4O=12;break;case 34:C3O(I3O,"substring",u4O[6],u4O[40]);N4O=33;break;case 12:u4O[6]=1;u4O[3]=0;u4O[2]=u4O[9];u4O[2]+=u4O[4];N4O=19;break;case 22:var C3O=function(H4O,Z4O,q4O,E4O){var x4O=2;for(;x4O !== 5;){switch(x4O){case 2:var r4O=[arguments];L3O(u4O[0][0],r4O[0][0],r4O[0][1],r4O[0][2],r4O[0][3]);x4O=5;break;}}};N4O=21;break;case 15:u4O[67]=u4O[5];u4O[67]+=u4O[8];u4O[67]+=u4O[4];u4O[70]=u4O[7];u4O[70]+=u4O[8];u4O[70]+=u4O[4];N4O=22;break;case 33:C3O(I3O,"charCodeAt",u4O[6],u4O[2]);N4O=32;break;case 19:u4O[2]+=u4O[4];u4O[40]=u4O[1];u4O[40]+=u4O[4];u4O[40]+=u4O[4];N4O=15;break;case 21:C3O(b3O,"String",u4O[3],u4O[70]);N4O=35;break;}}function K3O(T4O){var e4O=2;for(;e4O !== 5;){switch(e4O){case 2:var w4O=[arguments];return w4O[0][0].String;break;}}}function b3O(L4O){var D4O=2;for(;D4O !== 5;){switch(D4O){case 2:var y4O=[arguments];return y4O[0][0];break;}}}}l044[347346]=(function(){var D8Z=function(Z8Z,i8Z){var A8Z=i8Z & 0xffff;var X1Z=i8Z - A8Z;return (X1Z * Z8Z | 0) + (A8Z * Z8Z | 0) | 0;},S8Z=function(R1Z,Q1Z,z1Z){var C1Z=0xcc9e2d51,M1Z=0x1b873593;var g1Z=z1Z;var E1Z=Q1Z & ~0x3;for(var P1Z=0;P1Z < E1Z;P1Z+=4){var H1Z=R1Z.o300(P1Z) & 0xff | (R1Z.o300(P1Z + 1) & 0xff) << 8 | (R1Z.o300(P1Z + 2) & 0xff) << 16 | (R1Z.o300(P1Z + 3) & 0xff) << 24;H1Z=D8Z(H1Z,C1Z);H1Z=(H1Z & 0x1ffff) << 15 | H1Z >>> 17;H1Z=D8Z(H1Z,M1Z);g1Z^=H1Z;g1Z=(g1Z & 0x7ffff) << 13 | g1Z >>> 19;g1Z=g1Z * 5 + 0xe6546b64 | 0;}H1Z=0;switch(Q1Z % 4){case 3:H1Z=(R1Z.o300(E1Z + 2) & 0xff) << 16;case 2:H1Z|=(R1Z.o300(E1Z + 1) & 0xff) << 8;case 1:H1Z|=R1Z.o300(E1Z) & 0xff;H1Z=D8Z(H1Z,C1Z);H1Z=(H1Z & 0x1ffff) << 15 | H1Z >>> 17;H1Z=D8Z(H1Z,M1Z);g1Z^=H1Z;}g1Z^=Q1Z;g1Z^=g1Z >>> 16;g1Z=D8Z(g1Z,0x85ebca6b);g1Z^=g1Z >>> 13;g1Z=D8Z(g1Z,0xc2b2ae35);g1Z^=g1Z >>> 16;return g1Z;};return {U8Z:S8Z};})();l044.a5D=function(){return typeof l044[307585].U2D === 'function'?l044[307585].U2D.apply(l044[307585],arguments):l044[307585].U2D;};l044.Q5O=function(){return typeof l044[444253].a01 === 'function'?l044[444253].a01.apply(l044[444253],arguments):l044[444253].a01;};l044.p3J=function(){return typeof l044[347346].U8Z === 'function'?l044[347346].U8Z.apply(l044[347346],arguments):l044[347346].U8Z;};function l044(){}l044[307585]=(function(W2D){return {U2D:function(){var H2D,X2D=arguments;switch(W2D){case 6:H2D=X2D[0] | X2D[1];break;case 1:H2D=X2D[1] - X2D[0];break;case 0:H2D=X2D[0] << X2D[1];break;case 2:H2D=X2D[1] & X2D[0];break;case 3:H2D=X2D[0] * X2D[1] / (X2D[3] + X2D[2]);break;case 5:H2D=X2D[0] + X2D[1];break;case 4:H2D=X2D[1] ^ X2D[0];break;}return H2D;},F2D:function(h2D){W2D=h2D;}};})();l044.o5D=function(){return typeof l044[307585].F2D === 'function'?l044[307585].F2D.apply(l044[307585],arguments):l044[307585].F2D;};l044.d5O=function(){return typeof l044[444253].N01 === 'function'?l044[444253].N01.apply(l044[444253],arguments):l044[444253].N01;};l044.N5D=function(){return typeof l044[307585].F2D === 'function'?l044[307585].F2D.apply(l044[307585],arguments):l044[307585].F2D;};l044.w1b=function(P1b){l044.q2M();if(l044 && P1b)return l044.i0b(P1b);};l044.U2M();l044.u1b=function(x1b){l044.U2M();if(l044 && x1b)return l044.i0b(x1b);};l044.r0b=function(U0b){l044.U2M();if(l044 && U0b)return l044.a0b(U0b);};l044.F0b=function(t0b){l044.U2M();if(l044 && t0b)return l044.a0b(t0b);};l044.N0b=function(c0b){l044.q2M();if(l044)return l044.i0b(c0b);};l044.d0b=function(Z0b){l044.U2M();if(l044 && Z0b)return l044.i0b(Z0b);};l044.B0b=function(G0b){l044.U2M();if(l044)return l044.a0b(G0b);};var __js_standard_movement_;__js_standard_movement_=O8A=>{var W2M=l044;W2M.M1b=function(X1b){W2M.q2M();if(W2M)return W2M.a0b(X1b);};W2M.C0b=function(h0b){W2M.q2M();if(W2M)return W2M.i0b(h0b);};W2M.s0b=function(j0b){if(W2M)return W2M.a0b(j0b);};W2M.L0b=function(K0b){W2M.U2M();if(W2M && K0b)return W2M.i0b(K0b);};W2M.p0b=function(I0b){W2M.q2M();if(W2M && I0b)return W2M.i0b(I0b);};W2M.T0b=function(H0b){if(W2M)return W2M.i0b(H0b);};var o9J,d9J,j9J,k8A,a8A;o9J=1644697111;W2M.o5D(0);d9J=-W2M.i5D("1777580046",2140989984);j9J=2;for(var F9J="1" & 2147483647;W2M.Q3J(F9J.toString(),F9J.toString().length,"93974" & 2147483647) !== o9J;F9J++){k8A=typeof _CIQ !== "undefined"?_CIQ:O8A.CIQ;a8A="v";a8A+="a";a8A+="li";a8A+="d";k8A.valid=0;j9J+=+"2";}if(W2M.Q3J(j9J.toString(),j9J.toString().length,75178) !== d9J){k8A=~_CIQ == "undefined"?_CIQ:O8A.CIQ;a8A="valid";k8A.valid=+"4";}k8A[W2M.T0b("38a6")?"ChartEngine":""][W2M.p0b("8ff6")?"":"prototype"][W2M.B0b("4f5e")?"":"mousemoveinner"]=function(p7A,T7A){W2M.A0b=function(S0b){W2M.U2M();if(W2M && S0b)return W2M.a0b(S0b);};W2M.R0b=function(f0b){if(W2M)return W2M.i0b(f0b);};var f5O=-(W2M.R0b("1f3b")?414325538:828923352),j5O=W2M.L0b("eaac")?3272242817:1857292489,Y5O=-(W2M.d0b("24fa")?1770651737:4343873217),B5O=W2M.s0b("5936")?1910319203:9057207072,O5O=1718037647,g5O=W2M.N0b("cc89")?362577762:604732904,l5O=-(W2M.F0b("8d44")?1268379003:4524872231),p5O=-384844885,n5O=782362598,k5O=-(W2M.r0b("9bd1")?9345325604:1475217401),F5O=1282817812,v5O=-100533631,V5O=W2M.A0b("e62f")?1263981330:5155202542,P5O=863332659;if(!(W2M.Q5O(W2M.C0b("159d")?2:0,W2M.M1b("38cd")?true:false,212948) !== f5O && W2M.Q5O(0,false,772144) !== j5O && W2M.h5O(11,W2M.u1b("6267")?false:true,348661) !== Y5O && W2M.h5O(0,W2M.w1b("6c9c")?false:true,184944) !== B5O && W2M.Q5O(10,false,702505) !== O5O && W2M.Q5O(0,false,507996) !== g5O && W2M.Q5O(10,false,484864) !== l5O && W2M.Q5O(0,false,319024) !== p5O && W2M.h5O(11,false,318596) !== n5O && W2M.h5O(0,false,868404) !== k5O && W2M.h5O(10,false,791890) !== F5O && W2M.h5O(0,false,974826) !== v5O && W2M.Q5O(16,false,567920) !== V5O && W2M.h5O(0,false,339608) !== P5O)){var f2J,w2J,W8A,o7A,E7A,m7A,A7A,Q7A,f7A,u8A,h2J,J7A,z7A,c2J,V2J,p2J,f3J,Z3J,N3J,K2J,j7A,U8A,C8A,S8A,s8A,O2J,I9J,X9J,R9J,C2J,Y2J,M2J,i7A,a2J,B3J,U3J,b3J,S2J,m3J,q3J,e9J,K7A,F8A,K9J,O9J,Y9J,r8A,Y8A,p9J,Q9J,x9J,Z2J;f2J="p";f2J+="x";w2J="mou";w2J+="semoveinner";if(!this["chart"]["canvas"]){return;}if(!k8A["isAndroid"] && !k8A["isIOS7or8"]){if(this["chart"]["canvas"]["height"] != Math["floor"](this["devicePixelRatio"] * this["chart"]["container"]["clientHeight"]) || this["chart"]["canvas"]["width"] != Math["floor"](this["devicePixelRatio"] * this["chart"]["container"]["clientWidth"])){this["resizeChart"]();return;}}if(this["runPrepend"](w2J,arguments)){return;}o7A=arguments;E7A=this["container"]["getBoundingClientRect"]();this["top"]=E7A["top"];this["left"]=E7A["left"];this["right"]=this["left"] + this["width"];this["bottom"]=this["top"] + this["height"];this["hasDragged"]=! !"1";k8A["ChartEngine"]["crosshairX"]=p7A;k8A["ChartEngine"]["crosshairY"]=T7A;m7A=this["cy"]=this["crossYActualPos"]=this["backOutY"](k8A["ChartEngine"]["crosshairY"]);A7A=this["cx"]=this["crossXActualPos"]=this["backOutX"](k8A["ChartEngine"]["crosshairX"]);if(this["grabbingScreen"] && this["anyHighlighted"]){Q7A=Math["pow"](this["grabStartX"] - p7A,2) + Math["pow"](this["grabStartY"] - T7A,2);if(Q7A < 36){return;}}this["cancelLongHold"]=! ![];f7A=function(B7A,M7A){var S5O=-1256497868,u5O=1979491975,r5O=-512892133,w5O=-248279163,c5O=-1160351780,y5O=-1359760641,o5O=325755117,X5O=110391286,H5O=-1618204272,Z5O=-1049689118,q5O=817993703,E5O=178246938,T5O=802129978,G5O=1804027192;if(!(W2M.Q5O(0,false,653136) !== S5O && W2M.h5O(0,false,550450) !== u5O && W2M.h5O(11,false,850373) !== r5O && W2M.Q5O(0,false,203055) !== w5O && W2M.Q5O(10,false,875605) !== c5O && W2M.h5O(0,false,225420) !== y5O && W2M.h5O(10,false,971822) !== o5O && W2M.Q5O(0,false,887751) !== X5O && W2M.Q5O(11,false,629483) !== H5O && W2M.Q5O(0,false,904413) !== Z5O && W2M.h5O(10,false,349961) !== q5O && W2M.Q5O(0,false,587678) !== E5O && W2M.Q5O(16,false,660717) !== T5O && W2M.Q5O(0,false,264215) !== G5O)){if(k8A[a8A] === +"0"){return B7A["whichPanel"](M7A) || B7A["chart"]["panel"];}if(!B7A["draw"][a8A]){B7A["draw"]=function(){var C5O=1804522181,I5O=-844575157,J5O=-218753749,K5O=-1484185280,L5O=620970672,b5O=-635645211,N5O=-1334902321,x5O=1570710823,e5O=-1257344607,z5O=-1818718642,R5O=1033866120,W5O=1801582893,D5O=218097827,U5O=841837121;if(W2M.Q5O(0,false,891623) === C5O || W2M.Q5O(0,false,367411) === I5O || W2M.Q5O(11,false,194626) === J5O || W2M.h5O(0,false,495235) === K5O || W2M.Q5O(10,false,187610) === L5O || W2M.Q5O(0,false,376107) === b5O || W2M.h5O(10,false,687541) === N5O || W2M.h5O(0,false,505122) === x5O || W2M.Q5O(11,false,948113) === e5O || W2M.Q5O(0,false,598220) === z5O || W2M.Q5O(10,false,718149) === R5O || W2M.Q5O(0,false,895554) === W5O || W2M.Q5O(16,false,856159) === D5O || W2M.h5O(0,false,327493) === U5O){k8A["clearCanvas"](this["chart"]["canvas"],this);}};B7A["draw"][a8A]=! !{};}}};this["currentPanel"]=f7A(this,m7A);if(!this["currentPanel"]){return;}u8A=this["currentPanel"]["chart"];if(u8A["dataSet"]){h2J="char";h2J+="t";this["crosshairTick"]=this["tickFromPixel"](A7A,u8A);W8A=this["valueFromPixel"](m7A,this["currentPanel"]);this["crosshairValue"]=this["adjustIfNecessary"](this["currentPanel"],this["crosshairTick"],W8A);J7A=this["currentPanel"]["name"] == h2J?this["preferences"]["horizontalCrosshairField"]:this["currentPanel"]["horizontalCrosshairField"];if(J7A && this["crosshairTick"] < u8A["dataSet"]["length"] && this["crosshairTick"] > -("1" << 700401344)){W8A=u8A["dataSet"][this["crosshairTick"]][J7A];this["crossYActualPos"]=this["pixelFromPrice"](W8A,this["currentPanel"]);}}if(k8A["ChartEngine"]["crosshairX"] >= this["left"] && k8A["ChartEngine"]["crosshairX"] <= this["right"] && k8A["ChartEngine"]["crosshairY"] >= this["top"] && k8A["ChartEngine"]["crosshairY"] <= this["bottom"]){this["insideChart"]=! ![];}else {this["insideChart"]=! !"";}z7A=this["xAxisAsFooter"] === ! !1?this["chart"]["canvasHeight"]:this["chart"]["panel"]["bottom"];this["overXAxis"]=this["insideChart"] && k8A["ChartEngine"]["crosshairY"] <= z7A + this["top"] && k8A["ChartEngine"]["crosshairY"] > z7A - this["xaxisHeight"] + this["top"];function P7A(c7A){var m5O=-150283095,t5O=-358795578,a5O=76831126,i5O=-1904229564,M5O=491289722,A1O=-1892359923,h1O=2098744190,Q1O=-282269047,d1O=1993261258,s1O=-1239171542,f1O=-1615204599,j1O=-1201211711,Y1O=-1058091999,B1O=-1471185897;if(W2M.Q5O(0,false,836844) === m5O || W2M.h5O(0,false,780880) === t5O || W2M.h5O(11,false,201818) === a5O || W2M.Q5O(0,false,538226) === i5O || W2M.Q5O(10,false,225924) === M5O || W2M.h5O(0,false,934014) === A1O || W2M.Q5O(10,false,935104) === h1O || W2M.h5O(0,false,550436) === Q1O || W2M.h5O(11,false,974874) === d1O || W2M.h5O(0,false,752223) === s1O || W2M.h5O(10,false,381957) === f1O || W2M.h5O(0,false,114869) === j1O || W2M.Q5O(16,false,480945) === Y1O || W2M.Q5O(0,false,496815) === B1O){c7A["runAppend"]("mousemoveinner",o7A);}}this["overYAxis"]=(this["cx"] >= this["currentPanel"]["right"] || this["cx"] <= this["currentPanel"]["left"]) && this["insideChart"];if(this["overXAxis"] || this["overYAxis"] || !this["insideChart"] && !this["grabbingScreen"]){this["undisplayCrosshairs"]();if(!this["overXAxis"] && !this["overYAxis"]){return;};}if(!this["displayCrosshairs"] && !k8A["ChartEngine"]["resizingPanel"]){this["undisplayCrosshairs"]();return;}if(this["repositioningBaseline"]){Y8A=this["panels"][this["chart"]["panel"]["name"]];c2J=-1959384777;W2M["N5D"](0);V2J=-W2M["i5D"]("1932887668",782224960);p2J=2;for(var x2J=1;W2M["Q3J"](x2J["toString"](),x2J["toString"]()["length"],74641) !== c2J;x2J++){this["chart"]["baseline"]["userLevel"]=this["adjustIfNecessary"](Y8A,this["crosshairTick"],this["valueFromPixel"](this["backOutY"](k8A["ChartEngine"]["crosshairY"]),Y8A));p2J+=2;}if(W2M["p3J"](p2J["toString"](),p2J["toString"]()["length"],"93707" >> 1651160000) !== V2J){this["chart"]["baseline"]["userLevel"]=this["adjustIfNecessary"](Y8A,this["crosshairTick"],this["valueFromPixel"](this["backOutY"](k8A["ChartEngine"]["crosshairY"]),Y8A));}if(Date["now"]() - this["repositioningBaseline"]["lastDraw"] > 100){f3J=261772851;Z3J=-1688293722;N3J=+"2";for(var d3J=1;W2M["p3J"](d3J["toString"](),d3J["toString"]()["length"],36961) !== f3J;d3J++){this["draw"]();N3J+=2;}if(W2M["p3J"](N3J["toString"](),N3J["toString"]()["length"],64728) !== Z3J){this["draw"]();}this["repositioningBaseline"]["lastDraw"]=Date["now"]();}return P7A(this);}if(this["grabbingScreen"] && !k8A["ChartEngine"]["resizingPanel"]){K2J="z";K2J+="oom";if(this["highlightedDraggable"]){this["displayDragOK"](! !1);this["dragPlotOrAxis"](A7A,m7A);return P7A(this);}if(this["anyHighlighted"]){k8A["clearCanvas"](this["chart"]["tempCanvas"],this);this["anyHighlighted"]=! !0;for(j7A in this["overlays"]){this["overlays"][j7A]["highlight"]=![];}for(j7A in u8A["series"]){u8A["series"][j7A]["highlight"]=! !"";}this["displaySticky"]();}if(this["grabStartX"] == -1){this["grabStartX"]=k8A["ChartEngine"]["crosshairX"];this["grabStartScrollX"]=u8A["scroll"];}if(this["grabStartY"] == -1){this["grabStartY"]=k8A["ChartEngine"]["crosshairY"];this["grabStartScrollY"]=this["currentPanel"]["yAxis"]["scroll"];}U8A=k8A["ChartEngine"]["crosshairX"] - this["grabStartX"];C8A=k8A["ChartEngine"]["crosshairY"] - this["grabStartY"];if(U8A === ("0" & 2147483647) && C8A === 0){return;}if(Math["abs"](U8A) + Math["abs"](C8A) > 5){this["grabOverrideClick"]=! !{};}s8A=this["layout"]["candleWidth"];if(this["allowZoom"] && this["grabMode"] != "pan" && (this["grabMode"]["indexOf"](K2J) === "0" << 1966319904 || this["overXAxis"] || this["grabStartYAxis"])){if(this["grabMode"] === ""){O2J="zo";O2J+="o";O2J+="m-y";if(this["overXAxis"]){this["grabMode"]="zoom-x";}else if(this["grabStartYAxis"]){this["grabMode"]=O2J;}}I9J=628279103;X9J=1183257150;R9J=2;for(var V9J=1;W2M["Q3J"](V9J["toString"](),V9J["toString"]()["length"],90396) !== I9J;V9J++){C2J="zo";C2J+="om";C2J+="-";C2J+="x";Y2J="zo";Y2J+="om-";Y2J+="x";if(this["grabMode"] != Y2J){W2M["N5D"](0);C8A=W2M["i5D"]("4",1151183808);}else if(this["grabMode"] != C2J){U8A=1;}R9J+=2;}if(W2M["p3J"](R9J["toString"](),R9J["toString"]()["length"],+"58196") !== X9J){M2J="zo";M2J+="o";M2J+="m-x";if(this["grabMode"] != "zoom-x"){C8A=4;}else if(this["grabMode"] != M2J){W2M["o5D"](1);U8A=W2M["i5D"](0,"1");}}if(this["grabMode"] == "zoom-x"){C8A=0;}else if(this["grabMode"] == "zoom-y"){U8A=0;}if(U8A){this["grabStartX"]=k8A["ChartEngine"]["crosshairX"];i7A=s8A - U8A / this["chart"]["maxTicks"];this["zoomSet"](i7A,this["chart"]);}if(this["layout"]["setSpan"]){this["layout"]["setSpan"]=null;this["changeOccurred"]("layout");}S8A=this["grabStartYAxis"];if(S8A){if(S8A["flipped"]){C8A*=- +"1";}S8A["zoom"]=Math["round"](this["grabStartZoom"] + C8A);if(this["grabStartZoom"] < S8A["height"]){if(S8A["zoom"] >= S8A["height"]){S8A["zoom"]=S8A["height"] - 1;}}else {if(S8A["zoom"] <= S8A["height"]){S8A["zoom"]=S8A["height"] + 1;}}}}else if(!this["overYAxis"]){a2J="m";a2J+="ove";B3J=-789562353;U3J=-1317619097;b3J=2;for(var P3J=1;W2M["p3J"](P3J["toString"](),P3J["toString"]()["length"],79321) !== B3J;P3J++){this["dispatch"]("",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:!{}});b3J+=2;}if(W2M["Q3J"](b3J["toString"](),b3J["toString"]()["length"],78700) !== U3J){this["dispatch"]("",{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:!1});}this["dispatch"](a2J,{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:! !1});if(this["allowScroll"]){S2J="s";S2J+="c";S2J+="r";S2J+="oll";if(Math["abs"](C8A) < this["yTolerance"]){if(!this["yToleranceBroken"]){C8A=0;if(U8A === 0){return;}}}else {this["yToleranceBroken"]=! ![];}if(!this["grabStartMicropixels"]){W2M["N5D"](1);this["grabStartMicropixels"]=W2M["i5D"](0,"0");}this["grabMode"]="pan";u8A["scroll"]=this["grabStartScrollX"];this["micropixels"]=this["grabStartMicropixels"] + U8A * (this["shift"]?5:1);if(!this["lineTravelSpacing"]){while(this["micropixels"] > "0" >> 1862068128){this["micropixels"]-=s8A;u8A["scroll"]++;}while(this["micropixels"] < -s8A){this["micropixels"]+=s8A;u8A["scroll"]--;}}if(u8A["scroll"] >= u8A["maxTicks"]){m3J=-1343279775;q3J=987097114;e9J=+"2";for(var k9J="1" & 2147483647;W2M["p3J"](k9J["toString"](),k9J["toString"]()["length"],50977) !== m3J;k9J++){this["preferences"]["whitespace"]=this["initialWhitespace"];W2M["o5D"](1);e9J+=W2M["i5D"](0,"2");}if(W2M["p3J"](e9J["toString"](),e9J["toString"]()["length"],"71159" | 65826) !== q3J){this["preferences"]["whitespace"]=this["initialWhitespace"];}}else {this["preferences"]["whitespace"]=(u8A["maxTicks"] - u8A["scroll"]) * s8A;}if(this["currentPanel"] == this["grabStartPanel"]){S8A=this["currentPanel"]["yAxis"];if(S8A["flipped"]){C8A*=-1;}S8A["scroll"]=this["grabStartScrollY"] + C8A;}this["dispatch"](S2J,{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"]});}}K7A=function(h7A){var O1O=-1793386252,g1O=-1758578469,l1O=1495196573,p1O=2058039066,n1O=1929892264,k1O=1691456033,F1O=1192605972,v1O=-457900006,V1O=1505744228,P1O=336546741,S1O=-1557933750,u1O=-1439997794,r1O=-1720122012,w1O=-257171794;if(W2M.h5O(0,false,157712) === O1O || W2M.Q5O(0,false,148223) === g1O || W2M.Q5O(11,false,999189) === l1O || W2M.Q5O(0,false,736342) === p1O || W2M.Q5O(10,false,249398) === n1O || W2M.Q5O(0,false,977238) === k1O || W2M.Q5O(10,false,291701) === F1O || W2M.Q5O(0,false,561487) === v1O || W2M.Q5O(11,false,185632) === V1O || W2M.h5O(0,false,143871) === P1O || W2M.h5O(10,false,625782) === S1O || W2M.h5O(0,false,437547) === u1O || W2M.Q5O(16,false,743492) === r1O || W2M.Q5O(0,false,179049) === w1O){return function(){W2M.U2M();var c1O=417987210,y1O=-1501066063,o1O=2118098252,X1O=-1043568876,H1O=1304028505,Z1O=-94543777,q1O=1628860162,E1O=416205229,T1O=1348874254,G1O=1267637559,C1O=511164204,I1O=-141697761,J1O=-1143970015,K1O=2019333894;if(!(W2M.h5O(0,false,659550) !== c1O && W2M.Q5O(0,false,442622) !== y1O && W2M.Q5O(11,false,871716) !== o1O && W2M.h5O(0,false,639278) !== X1O && W2M.Q5O(10,false,853131) !== H1O && W2M.h5O(0,false,537873) !== Z1O && W2M.Q5O(10,false,300191) !== q1O && W2M.Q5O(0,false,838811) !== E1O && W2M.h5O(11,false,282375) !== T1O && W2M.h5O(0,false,820980) !== G1O && W2M.h5O(10,false,556434) !== C1O && W2M.h5O(0,false,620313) !== I1O && W2M.h5O(16,false,290152) !== J1O && W2M.Q5O(0,false,234786) !== K1O)){h7A["draw"]();h7A["updateChartAccessories"]();}};}};if(k8A["ChartEngine"]["useAnimation"]){window["requestAnimationFrame"](K7A(this));}else {this["draw"]();this["updateChartAccessories"]();}if(this["activeDrawing"]){k8A["clearCanvas"](this["chart"]["tempCanvas"],this);this["activeDrawing"]["render"](this["chart"]["tempCanvas"]["context"]);this["activeDrawing"]["measure"]();}this["undisplayCrosshairs"]();return;}this["grabMode"]="";if(this["overXAxis"] || this["overYAxis"]){this["updateChartAccessories"]();this["findHighlights"]();return P7A(this);;}if(this["controls"]["crossX"]){this["controls"]["crossX"]["style"]["left"]=this["pixelFromTick"](this["crosshairTick"],u8A) - 0.5 + "px";}if(this["controls"]["crossY"]){this["controls"]["crossY"]["style"]["top"]=this["crossYActualPos"] + f2J;}if(this["insideChart"] && !k8A["ChartEngine"]["resizingPanel"]){F8A=this["currentVectorParameters"]["vectorType"];if(this["layout"]["studies"]){W2M["o5D"](2);K9J=-W2M["a5D"](2147483647,"1084325685");O9J=-1997192220;W2M["o5D"](2);Y9J=W2M["i5D"](2147483647,"2");for(var M9J=1;W2M["Q3J"](M9J["toString"](),M9J["toString"]()["length"],18887) !== K9J;M9J++){r8A=this["layout"]["studies"][this["currentPanel"]["name"]];Y9J+=+"2";}if(W2M["Q3J"](Y9J["toString"](),Y9J["toString"]()["length"],41980) !== O9J){r8A=this["layout"]["studies"][this["currentPanel"]["name"]];}if(r8A){if(!this["preferences"]["dragging"] || !this["preferences"]["dragging"]["study"]){delete this["overlays"][r8A["name"]];}if(F8A){this["overlays"][r8A["name"]]=r8A;}}}if(!k8A["Drawing"] || !F8A || !k8A["Drawing"][F8A] || !new k8A["Drawing"][F8A]()["dragToDraw"]){this["doDisplayCrosshairs"]();}this["updateChartAccessories"]();}else {this["undisplayCrosshairs"]();}if(this["magnetize"]){this["magnetize"]();}if(this["repositioningDrawing"]){this["repositionDrawing"](this["repositioningDrawing"]);}else if(k8A["ChartEngine"]["drawingLine"]){if(this["activeDrawing"]){Y8A=this["panels"][this["activeDrawing"]["panelName"]];W8A=this["adjustIfNecessary"](Y8A,this["crosshairTick"],this["valueFromPixel"](this["backOutY"](k8A["ChartEngine"]["crosshairY"]),Y8A));if(this["magnetizedPrice"] && Y8A["name"] == this["currentPanel"]["name"]){W8A=this["adjustIfNecessary"](Y8A,this["crosshairTick"],this["magnetizedPrice"]);}if(this["magnetizedPrice"] === null){k8A["clearCanvas"](this["chart"]["tempCanvas"],this);}this["activeDrawing"]["move"](this["chart"]["tempCanvas"]["context"],this["crosshairTick"],W8A);p9J=1476856333;Q9J=55868463;x9J=2;for(var h9J=1;W2M["p3J"](h9J["toString"](),h9J["toString"]()["length"],5330) !== p9J;h9J++){if(this["activeDrawing"]["measure"]){this["activeDrawing"]["measure"]();}x9J+=2;}if(W2M["Q3J"](x9J["toString"](),x9J["toString"]()["length"],30136) !== Q9J){if(this["activeDrawing"]["measure"]){this["activeDrawing"]["measure"]();}}}}else if(k8A["ChartEngine"]["resizingPanel"]){this["resizePanels"]();}if(this["insideChart"]){Z2J="mo";Z2J+="v";Z2J+="e";this["dispatch"](Z2J,{stx:this,panel:this["currentPanel"],x:this["cx"],y:this["cy"],grab:!"1"});this["findHighlights"](this["highlightViaTap"]);}return P7A(this);}};k8A.ChartEngine.prototype.swipeStart=function(X7A){var t7A;if(this.swipe && this.swipe.interval){clearInterval(this.swipe.interval);}W2M.U2M();this.swipe.velocity=0;this.swipe.amplitude=0;this.swipe.frame=X7A.scroll;this.swipe.micropixels=this.micropixels;this.swipe.timestamp=Date.now();this.swipe.chart=X7A;this.swipe.end=![];this.swipe.timeConstant=+"325";this.swipe.cb=null;t7A=this;requestAnimationFrame(function(){W2M.U2M();t7A.swipeSample();});};k8A.ChartEngine.prototype.swipeSample=function(){var I7A,b7A,R7A,g7A,N7A,e7A,D7A,v7A,x7A,u3J,n3J,G3J,D9J,H9J,y9J;I7A=this.swipe;W2M.U2M();if(I7A.end){return;}b7A=this;D7A=20;R7A=Date.now();g7A=R7A - I7A.timestamp;if(g7A < D7A){requestAnimationFrame(function(){b7A.swipeSample();});return;}v7A=k8A.touchDevice?0.4:0.8;I7A.timestamp=R7A;N7A=(I7A.chart.scroll - I7A.frame) * this.layout.candleWidth + this.micropixels - I7A.micropixels;I7A.frame=I7A.chart.scroll;I7A.micropixels=this.micropixels;W2M.N5D(3);e7A=W2M.i5D(1000,N7A,g7A,1);x7A=v7A * e7A + 0.2 * I7A.velocity;if(Math.abs(x7A) > Math.abs(I7A.velocity)){u3J=161084497;n3J=967958567;G3J=2;for(var E3J=1;W2M.p3J(E3J.toString(),E3J.toString().length,61949) !== u3J;E3J++){I7A.velocity=x7A;G3J+=2;}if(W2M.Q3J(G3J.toString(),G3J.toString().length,88343) !== n3J){I7A.velocity=x7A;}I7A.velocity=x7A;}if(Math.abs(N7A) < 6){I7A.velocity=0;D9J=-1509122090;H9J=-420300869;y9J=2;for(var L9J=1;W2M.p3J(L9J.toString(),L9J.toString().length,96989) !== D9J;L9J++){;W2M.N5D(4);y9J+=W2M.i5D(0,"2");}if(W2M.Q3J(y9J.toString(),y9J.toString().length,54311) !== H9J){;}}requestAnimationFrame(function(){b7A.swipeSample();});};k8A.ChartEngine.prototype.swipeRelease=function(){var Z7A,w7A;Z7A=this.swipe;if(Z7A.velocity > 3000){Z7A.velocity=3000;}if(Z7A.velocity < -3000){Z7A.velocity=- +"3000";}if(Z7A.velocity > 10 || Z7A.velocity < -("10" | 2)){Z7A.amplitude=0.8 * Z7A.velocity;Z7A.scroll=Z7A.chart.scroll;Z7A.target=Z7A.amplitude;Z7A.timestamp=Date.now();w7A=this;if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}requestAnimationFrame(function(){W2M.q2M();w7A.autoscroll();});}};k8A.ChartEngine.prototype.dragPlotOrAxis=function(k7A,u7A){var J2J,o3A,Q3A,t3A,f3A,C7A,H7A,L7A,y7A,a7A,O7A,s7A,U7A,V7A,F7A,j2J,d2J,Y7A,z3J,A3J,g3J,l7A,q7A,Y3J,C3J,M3J,r7A,P3A,g3A,i3A,K3A,N3A,n7A,G7A,s2J,F2J,x3J,w3J,h3J,j3J,s3J,F3J,D2J,H2J,y2J,I3A,b3A,R3A,r2J,k2J,I2J,J3A,i2J,T2J,L2J,d7A,z3A,T9J,J9J,u9J,e3A,u2J,t9J,P9J,m9J,v3A,c3A,m3A,Z3A,W7A,p3A,T3A,a9J,S9J,f9J,B3A,y3J,i3J,L3J,S7A,l9J,W9J,B9J,M3A,E3A,A3A,v9J,E9J,z9J,n2J,h3A,X3A;J2J="dr";J2J+="opzone";if(!H3A.call(this) && !this.grabbingScreen){return;}o3A=null;W2M.N5D(4);Q3A=W2M.a5D(0,"20");t3A=+"10";W2M.N5D(1);f3A=this.whichPanel(W2M.i5D(Q3A,u7A));W2M.N5D(5);C7A=this.whichPanel(W2M.i5D(u7A,Q3A));H7A=this.whichPanel(u7A);L7A=this.highlightedDraggable;if(!H7A){return;}if(L7A.undraggable && L7A.undraggable(this)){return;}y7A=this.whichYAxis(H7A,k7A,u7A);W2M.N5D(1);a7A=this.whichYAxis(H7A,W2M.i5D(t3A,k7A),u7A);W2M.N5D(5);O7A=this.whichYAxis(H7A,W2M.i5D(k7A,t3A),u7A);if(this.xAxisAsFooter && H7A.name == Object.keys(this.panels).pop()){C7A=this.whichPanel(u7A + Q3A + this.xaxisHeight);if(o3A){o3A+=this.xaxisHeight;}}s7A=!1;U7A=!{};V7A=! !0;if(k8A.Renderer){s7A=L7A instanceof k8A.Renderer;}if(k8A.Studies){U7A=L7A instanceof k8A.Studies.StudyDescriptor;}V7A=L7A instanceof k8A.ChartEngine.YAxis;F7A=function(V3A){var o2J;W2M.U2M();if(!V7A){o2J="r";o2J+="ig";o2J+="ht";if(V3A == o2J){return H7A.right - H7A.width / 6;}if(V3A == "left"){return H7A.left + H7A.width / +"6";}}return (H7A.left + H7A.right) / 2;};function H3A(){var y3A,N2J,L3A;y3A=!1;for(var q3A in this.panels){N2J="r";N2J+="ight";["dropzone","all","left",N2J,"top","bottom"].forEach(d3A(this.panels[q3A]));for(L3A=0;L3A < this.panels[q3A].yaxisLHS.length;L3A++){if(this.panels[q3A].yaxisLHS[L3A].dropzone){y3A=! ![];}this.panels[q3A].yaxisLHS[L3A].dropzone=null;}for(L3A=0;L3A < this.panels[q3A].yaxisRHS.length;L3A++){if(this.panels[q3A].yaxisRHS[L3A].dropzone){y3A=! ![];}this.panels[q3A].yaxisRHS[L3A].dropzone=null;}}function d3A(n3A){return function(G3A){W2M.U2M();if(n3A.subholder.classList.contains(G3A)){n3A.subholder.classList.remove(G3A);y3A=!"";}};}return y3A;}if(!V7A && !y7A){j2J="ri";j2J+="g";j2J+="h";j2J+="t";d2J="le";d2J+="ft";if(k7A < F7A(d2J)){a7A=this.whichYAxis(H7A,H7A.left - 1,u7A);}else if(k7A > F7A(j2J)){O7A=this.whichYAxis(H7A,H7A.right + 1,u7A);}}W2M.U2M();Y7A=[];if(L7A.getDependents){z3J=-472550111;A3J=+"2084628593";g3J=2;for(var W3J=1;W2M.Q3J(W3J.toString(),W3J.toString().length,23877) !== z3J;W3J++){Y7A=L7A.getDependents(this,! !0);g3J+=2;}if(W2M.Q3J(g3J.toString(),g3J.toString().length,99904) !== A3J){Y7A=L7A.getDependents(this,!0);}}l7A=L7A.panel;q7A=L7A.getYAxis(this);if(s7A){Y3J=- +"177770961";W2M.N5D(4);C3J=W2M.i5D(0,"1178717191");M3J=+"2";for(var S3J=1;W2M.p3J(S3J.toString(),S3J.toString().length,33063) !== Y3J;S3J++){l7A=L7A.params.panel;M3J+=2;}if(W2M.p3J(M3J.toString(),M3J.toString().length,42401) !== C3J){l7A=L7A.params.panel;}}else if(V7A){l7A=this.grabStartPanel.name;}r7A=this.panels[l7A];for(P3A in this.panels){if(this.panels[P3A].soloing){g3A=! ![];}}i3A=q7A.isShared(this);K3A=!V7A && !g3A && (r7A !== H7A && r7A != f3A && r7A != C7A || !this.checkForEmptyPanel(r7A,! !{},[L7A].concat(Y7A)));N3A=l7A == H7A.name && q7A !== y7A && q7A !== O7A && q7A !== a7A || i3A;if(K3A && (!f3A || H7A !== f3A)){s2J="dro";s2J+="pzon";s2J+="e";H7A.subholder.classList.add(s2J);H7A.subholder.classList.add("top");C7A=H7A;}else if(K3A && (!C7A || H7A !== C7A)){F2J="dro";F2J+="pzone";x3J=-596775514;w3J=-1950670216;h3J=+"2";for(var O3J=+"1";W2M.Q3J(O3J.toString(),O3J.toString().length,"24361" ^ 0) !== x3J;O3J++){H7A.subholder.classList.add("");h3J+=+"2";}if(W2M.p3J(h3J.toString(),h3J.toString().length,+"99505") !== w3J){H7A.subholder.classList.add("");}H7A.subholder.classList.add(F2J);H7A.subholder.classList.add("bottom");}else if(H7A !== r7A){if(!V7A && !H7A.noDrag){j3J=-1156756159;W2M.N5D(6);s3J=-W2M.a5D("1778911877",134219905);F3J=+"2";for(var H3J=1;W2M.Q3J(H3J.toString(),H3J.toString().length,67424) !== j3J;H3J++){H7A.subholder.classList.add("");F3J+=2;}if(W2M.p3J(F3J.toString(),F3J.toString().length,55391) !== s3J){D2J="dr";D2J+="opzone";H7A.subholder.classList.add(D2J);}H7A.subholder.classList.add("all");n7A=H7A.name;}}else if((!H7A.yaxisRHS.length || H7A.yaxisRHS.length == 1 && H7A.yaxisRHS[0] == q7A && q7A.position == "none") && !y7A && !O7A && k7A > F7A("right")){H2J="dr";H2J+="opzon";H2J+="e";H7A.subholder.classList.add(H2J);H7A.subholder.classList.add("right");G7A="right";}else if((!H7A.yaxisLHS.length || H7A.yaxisLHS.length == 1 && H7A.yaxisLHS[0] == q7A && q7A.position == "none") && !y7A && !a7A && k7A < F7A("left")){y2J="le";y2J+="ft";H7A.subholder.classList.add("dropzone");H7A.subholder.classList.add(y2J);G7A="left";}else if(N3A){if(V7A && k7A > H7A.left && k7A < H7A.right){I3A=H7A.yaxisLHS[H7A.yaxisLHS.length - 1];b3A=H7A.yaxisRHS[0];R3A=F7A();if(k7A < R3A && I3A != q7A){a7A=I3A;}else if(k7A > R3A && b3A != q7A){O7A=b3A;}}if(!V7A || y7A !== q7A){r2J=1376560496;k2J=1271603285;I2J=2;for(var R2J=1;W2M.p3J(R2J.toString(),R2J.toString().length,16908) !== r2J;R2J++){J3A=-V7A || i3A;I2J+=2;}if(W2M.Q3J(I2J.toString(),I2J.toString().length,+"46651") !== k2J){J3A=!V7A && i3A;}if(O7A && (O7A !== q7A || J3A) && (!y7A || y7A !== O7A)){O7A.dropzone="left";G7A=O7A.position || this.chart.panel.yAxis.position || "right";}else if(a7A && (a7A !== q7A || J3A) && (!y7A || y7A !== a7A)){i2J="rig";i2J+="h";i2J+="t";a7A.dropzone=i2J;G7A=a7A.position || this.chart.panel.yAxis.position || "right";}else if(y7A){T2J="r";T2J+="i";T2J+="ght";if(!O7A && (y7A !== q7A || J3A)){L2J="r";L2J+="ight";y7A.dropzone=L2J;}else if(!a7A && (y7A !== q7A || J3A)){y7A.dropzone="left";}else if(y7A !== q7A){y7A.dropzone="all";}if(y7A.dropzone){G7A=y7A.position || this.chart.panel.yAxis.position || T2J;}}}}if(this.grabbingScreen || !H7A.subholder.classList.contains(J2J) && !G7A){this.draw();return;}z3A=-1;if(!n7A && !G7A && K3A){n7A=U7A?L7A.inputs.id:L7A.params.name || k8A.uniqueID();for(var x3A in this.panels){z3A++;if(this.panels[x3A] == C7A)break;}T9J=-965183227;J9J=- +"1658344907";u9J=2;for(var G9J=+"1";W2M.Q3J(G9J.toString(),G9J.toString().length,59780) !== T9J;G9J++){if(-C7A){z3A--;}u9J+=2;}if(W2M.p3J(u9J.toString(),u9J.toString().length,30722) !== J9J){if(-C7A){z3A--;}}if(!C7A){z3A++;}if(this.panels[l7A].yAxis.name == n7A){l7A=this.electNewPanelOwner(l7A);}e3A=U7A?L7A.inputs.display:null;if(l7A){this.createPanel(e3A || n7A,n7A,o3A,this.chart.name,new k8A.ChartEngine.YAxis({name:n7A}));}else {l7A=n7A;}if(U7A){L7A.panel=l7A;}else {L7A.params.panel=l7A;}}if(n7A){if(U7A){u2J="S";u2J+="tudies.replaceStudy";if(!L7A.parameters){L7A.parameters={};}t9J=-938004717;P9J=678358765;m9J=2;for(var e2J="1" - 0;W2M.Q3J(e2J.toString(),e2J.toString().length,84840) !== t9J;e2J++){L7A.parameters.panelName=n7A;m9J+=2;}if(W2M.p3J(m9J.toString(),m9J.toString().length,"55912" * 1) !== P9J){L7A.parameters.panelName=n7A;}L7A.parameters.panelName=n7A;this.highlightedDraggable=k8A.getFn(u2J)(this,L7A.inputs.id,L7A.type,L7A.inputs,L7A.outputs,L7A.parameters,null,L7A.study);}else if(s7A){for(var D3A in L7A.seriesParams){v3A=L7A.seriesParams[D3A];c3A=null;if(L7A.params.yAxis){if(L7A.params.yAxis !== this.chart.panel.yAxis){c3A=L7A.params.yAxis;c3A.name=L7A.params.name;}}this.modifySeries(v3A.id,{panel:n7A,yAxis:c3A});}}if(z3A > -1){m3A={};Z3A=0;for(P3A in this.panels){if(z3A == Z3A++){m3A[n7A]=this.panels[n7A];}if(P3A == n7A)continue;m3A[P3A]=this.panels[P3A];}if(!m3A[n7A]){m3A[n7A]=this.panels[n7A];}this.panels=m3A;}this.checkForEmptyPanel(l7A);for(var j3A=0;j3A < Y7A.length;j3A++){if(Y7A[j3A].params){this.checkForEmptyPanel(Y7A[j3A].params.name);}else {this.checkForEmptyPanel(Y7A[j3A].name);}}this.adjustPanelPositions();}else if(G7A){W7A=function(O3A,l3A,u3A,k3A){var a3A,C3A;if(u3A == "study"){if(!l3A.parameters){l3A.parameters={};}if(k3A){l3A.parameters.yaxisDisplayValue=k3A.position;}else {delete l3A.parameters.yaxisDisplayValue;}a3A=k8A.getFn("Studies.replaceStudy")(O3A,l3A.inputs.id,l3A.type,l3A.inputs,l3A.outputs,l3A.parameters,l3A.panel,l3A.study);}W2M.U2M();if(u3A == "renderer"){for(var S3A in l3A.seriesParams){C3A=l3A.seriesParams[S3A];a3A=O3A.modifySeries(C3A.id,{panel:n7A,yAxis:k3A});}}return a3A;};p3A=y7A && y7A.dropzone == "all";if(!p3A){if(V7A){L7A.position=G7A;if(this.layout.studies){T3A=this.layout.studies[L7A.name];if(T3A){if(!T3A.parameters){T3A.parameters={};}T3A.parameters.yaxisDisplayValue=G7A;}}}else if(U7A){this.highlightedDraggable=W7A(this,L7A,"study",{position:G7A});}else if(s7A){W7A(this,L7A,"renderer",new k8A.ChartEngine.YAxis({name:L7A.params.name || k8A.uniqueID(),position:G7A}));}a9J=-1052219898;S9J=-2103092432;W2M.o5D(2);f9J=W2M.i5D(2147483647,"2");for(var N9J=+"1";W2M.p3J(N9J.toString(),N9J.toString().length,98348) !== a9J;N9J++){q7A=this.highlightedDraggable.getYAxis(this);f9J+=2;}if(W2M.Q3J(f9J.toString(),f9J.toString().length,65455) !== S9J){q7A=this.highlightedDraggable.getYAxis(this);}q7A=this.highlightedDraggable.getYAxis(this);}if(!i3A || !p3A || V7A){B3A=q7A;y3J=-1881762461;i3J=879117385;L3J=2;for(var J3J=1;W2M.Q3J(J3J.toString(),J3J.toString().length,51197) !== y3J;J3J++){if(p3A || q7A !== this.chart.panel.yAxis){B3A=y7A;}L3J+=2;}if(W2M.Q3J(L3J.toString(),L3J.toString().length,61456) !== i3J){if(p3A && q7A == this.chart.panel.yAxis){B3A=y7A;}}for(d7A=0;d7A < H7A.yaxisLHS.length;d7A++){if(H7A.yaxisLHS[d7A] == B3A){H7A.yaxisLHS.splice(d7A,1);break;}}for(d7A=0;d7A < H7A.yaxisRHS.length;d7A++){if(H7A.yaxisRHS[d7A] == B3A){W2M.N5D(6);H7A.yaxisRHS.splice(d7A,W2M.i5D("1",0));break;}}}if(p3A){if(this.getYAxisByName(H7A,q7A.name) == H7A.yAxis){this.electNewPanelOwner(H7A,y7A);}if(V7A){l9J=+"1514909436";W9J=-1578697687;B9J=2;for(var b9J=1;W2M.Q3J(b9J.toString(),b9J.toString().length,43948) !== l9J;b9J++){E3A=q7A;A3A=y7A;B9J+=2;}if(W2M.p3J(B9J.toString(),B9J.toString().length,59291) !== W9J){E3A=q7A;A3A=y7A;}if(q7A == this.chart.panel.yAxis){E3A=y7A;A3A=q7A;}for(M3A in E3A.studies){W7A(this,this.layout.studies[E3A.studies[M3A]],"study",A3A === this.chart.panel.yAxis?null:{position:A3A.name});}for(M3A in E3A.renderers){W7A(this,this.chart.seriesRenderers[E3A.renderers[M3A]],"renderer",A3A);}this.highlightedDraggable=A3A;}else if(U7A){v9J=- +"1692964879";E9J=2034774456;z9J=2;for(var g9J=1;W2M.p3J(g9J.toString(),g9J.toString().length,11807) !== v9J;g9J++){this.highlightedDraggable=W7A(this,L7A,"study",{position:y7A.name});z9J+=2;}if(W2M.Q3J(z9J.toString(),z9J.toString().length,97479) !== E9J){this.highlightedDraggable=W7A(this,L7A,"",{position:y7A.name});}}else if(s7A){n2J="r";n2J+="endere";n2J+="r";W7A(this,L7A,n2J,y7A);}}else {if(q7A.position == "none"){q7A.width=k8A.ChartEngine.YAxis.prototype.width;}q7A.position=G7A;S7A=G7A == "left"?H7A.yaxisLHS:H7A.yaxisRHS;for(d7A=0;d7A < S7A.length;d7A++){if(S7A[d7A] !== q7A){if(S7A[d7A].dropzone == "left"){S7A.splice(d7A,0,q7A);}else if(S7A[d7A].dropzone == "right"){W2M.N5D(5);S7A.splice(W2M.a5D(d7A,1),0,q7A);}else continue;}break;}if(d7A == S7A.length){S7A.push(q7A);}}}for(var w3A in this.panels){h3A=this.panels[w3A];X3A=h3A.yaxisLHS.concat(h3A.yaxisRHS);for(d7A=0;d7A < X3A.length;d7A++){X3A[d7A].height=h3A.yAxis.height;this.calculateYAxisMargins(X3A[d7A]);}}this.displayDragOK();this.draw();this.calculateYAxisPositions();this.draw();this.findHighlights(null,! !{});this.savePanels();};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
J044[643118]=(function(){var w=2;for(;w !== 9;){switch(w){case 2:w=typeof globalThis === '\x6f\x62\x6a\x65\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var s;try{var d=2;for(;d !== 6;){switch(d){case 2:Object['\x64\x65\x66\u0069\x6e\u0065\u0050\x72\u006f\u0070\x65\x72\x74\u0079'](Object['\x70\u0072\u006f\x74\x6f\u0074\x79\x70\u0065'],'\u0059\x46\u0050\x67\x63',{'\x67\x65\x74':function(){var k=2;for(;k !== 1;){switch(k){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});s=YFPgc;s['\u006f\u0064\x6c\x68\x44']=s;d=4;break;case 9:delete s['\x6f\u0064\x6c\x68\u0044'];var F=Object['\x70\u0072\u006f\u0074\x6f\u0074\x79\x70\x65'];delete F['\u0059\u0046\u0050\x67\x63'];d=6;break;case 3:throw "";d=9;break;case 4:d=typeof odlhD === '\u0075\x6e\u0064\x65\x66\u0069\x6e\u0065\x64'?3:9;break;}}}catch(x){s=window;}return s;break;}}})();J044[351557]=D300(J044[643118]);J044[376554]=G044(J044[643118]);J044[347346]=(function(){var Q3B=function(D3B,n3B){var f3B=n3B & 0xffff;var O3B=n3B - f3B;return (O3B * D3B | 0) + (f3B * D3B | 0) | 0;},x3B=function(F3B,I3B,o3B){var p3B=0xcc9e2d51,R3B=0x1b873593;var m3B=o3B;var S3B=I3B & ~0x3;for(var P3B=0;P3B < S3B;P3B+=4){var q3B=F3B.J300(P3B) & 0xff | (F3B.J300(P3B + 1) & 0xff) << 8 | (F3B.J300(P3B + 2) & 0xff) << 16 | (F3B.J300(P3B + 3) & 0xff) << 24;q3B=Q3B(q3B,p3B);q3B=(q3B & 0x1ffff) << 15 | q3B >>> 17;q3B=Q3B(q3B,R3B);m3B^=q3B;m3B=(m3B & 0x7ffff) << 13 | m3B >>> 19;m3B=m3B * 5 + 0xe6546b64 | 0;}q3B=0;switch(I3B % 4){case 3:q3B=(F3B.J300(S3B + 2) & 0xff) << 16;case 2:q3B|=(F3B.J300(S3B + 1) & 0xff) << 8;case 1:q3B|=F3B.J300(S3B) & 0xff;q3B=Q3B(q3B,p3B);q3B=(q3B & 0x1ffff) << 15 | q3B >>> 17;q3B=Q3B(q3B,R3B);m3B^=q3B;}m3B^=I3B;m3B^=m3B >>> 16;m3B=Q3B(m3B,0x85ebca6b);m3B^=m3B >>> 13;m3B=Q3B(m3B,0xc2b2ae35);m3B^=m3B >>> 16;return m3B;};return {Z3B:x3B};})();J044.I6L=function(){return typeof J044[347346].Z3B === 'function'?J044[347346].Z3B.apply(J044[347346],arguments):J044[347346].Z3B;};J044.G2u=function(){return typeof J044[444253].w6D === 'function'?J044[444253].w6D.apply(J044[444253],arguments):J044[444253].w6D;};J044.c8J=function(){return typeof J044[307585].Z8J === 'function'?J044[307585].Z8J.apply(J044[307585],arguments):J044[307585].Z8J;};function G044(Z1u){function E8u(k2u){var t2u=2;for(;t2u !== 5;){switch(t2u){case 2:var W1u=[arguments];return W1u[0][0].Function;break;}}}var n2u=2;for(;n2u !== 72;){switch(n2u){case 73:M8u(E8u,"apply",S1u[30],S1u[86]);n2u=72;break;case 16:S1u[34]="";S1u[34]="H";S1u[54]="";S1u[54]="stract";n2u=25;break;case 11:S1u[6]="";S1u[4]="_o";S1u[6]="44";S1u[39]="";S1u[39]="0";S1u[34]="";n2u=16;break;case 62:S1u[44]=S1u[5];S1u[44]+=S1u[52];S1u[44]+=S1u[89];S1u[21]=S1u[3];n2u=58;break;case 77:M8u(S8u,"push",S1u[30],S1u[32]);n2u=76;break;case 6:S1u[5]="k";S1u[7]="i0";S1u[1]="ptimize";S1u[6]="";n2u=11;break;case 58:S1u[21]+=S1u[9];S1u[21]+=S1u[8];n2u=56;break;case 55:M8u(I8u,S1u[21],S1u[62],S1u[44]);n2u=77;break;case 75:M8u(I8u,S1u[87],S1u[62],S1u[10]);n2u=74;break;case 3:S1u[2]="M";S1u[8]="idual";S1u[1]="";S1u[3]="__re";n2u=6;break;case 43:S1u[86]=S1u[50];S1u[86]+=S1u[52];S1u[86]+=S1u[89];S1u[22]=S1u[60];n2u=39;break;case 34:S1u[89]="4";S1u[52]="";S1u[52]="04";S1u[50]="B";n2u=30;break;case 30:S1u[30]=8;S1u[30]=1;S1u[62]=9;S1u[62]=0;n2u=43;break;case 76:M8u(P8u,"test",S1u[30],S1u[14]);n2u=75;break;case 49:S1u[87]+=S1u[4];S1u[87]+=S1u[1];S1u[14]=S1u[7];S1u[14]+=S1u[89];n2u=45;break;case 25:S1u[72]="_ab";S1u[46]="";S1u[46]="_";S1u[60]="";S1u[60]="d0";S1u[89]="";n2u=34;break;case 74:M8u(I8u,S1u[42],S1u[62],S1u[22]);n2u=73;break;case 39:S1u[22]+=S1u[89];S1u[22]+=S1u[89];S1u[42]=S1u[46];S1u[42]+=S1u[72];S1u[42]+=S1u[54];n2u=53;break;case 53:S1u[10]=S1u[34];S1u[10]+=S1u[39];S1u[10]+=S1u[6];S1u[87]=S1u[46];n2u=49;break;case 2:var S1u=[arguments];S1u[9]="";S1u[9]="s";S1u[2]="";n2u=3;break;case 56:var M8u=function(a2u,b2u,c2u,f2u){var o2u=2;for(;o2u !== 5;){switch(o2u){case 2:var T1u=[arguments];Q8u(S1u[0][0],T1u[0][0],T1u[0][1],T1u[0][2],T1u[0][3]);o2u=5;break;}}};n2u=55;break;case 45:S1u[14]+=S1u[89];S1u[32]=S1u[2];S1u[32]+=S1u[52];S1u[32]+=S1u[89];n2u=62;break;}}function Q8u(N2u,g2u,h2u,i2u,j2u){var q2u=2;for(;q2u !== 6;){switch(q2u){case 3:V1u[4]="";V1u[4]="";V1u[4]="defin";try{var r2u=2;for(;r2u !== 8;){switch(r2u){case 9:V1u[5][V1u[0][4]]=V1u[3].value;r2u=8;break;case 2:V1u[3]={};V1u[6]=(1,V1u[0][1])(V1u[0][0]);V1u[5]=[V1u[6],V1u[6].prototype][V1u[0][3]];V1u[3].value=V1u[5][V1u[0][2]];try{var s2u=2;for(;s2u !== 3;){switch(s2u){case 2:V1u[1]=V1u[4];V1u[1]+=V1u[8];V1u[1]+=V1u[7];V1u[0][0].Object[V1u[1]](V1u[5],V1u[0][4],V1u[3]);s2u=3;break;}}}catch(g1u){}r2u=9;break;}}}catch(h1u){}q2u=6;break;case 2:var V1u=[arguments];V1u[7]="";V1u[7]="perty";V1u[8]="ePro";q2u=3;break;}}}function S8u(y2u){var w2u=2;for(;w2u !== 5;){switch(w2u){case 2:var X1u=[arguments];return X1u[0][0].Array;break;}}}function P8u(e2u){var p2u=2;for(;p2u !== 5;){switch(p2u){case 2:var U1u=[arguments];return U1u[0][0].RegExp;break;}}}function I8u(m2u){var v2u=2;for(;v2u !== 5;){switch(v2u){case 2:var Y1u=[arguments];return Y1u[0][0];break;}}}}J044.E8J=function(){return typeof J044[307585].Z8J === 'function'?J044[307585].Z8J.apply(J044[307585],arguments):J044[307585].Z8J;};J044.o8J=function(){return typeof J044[307585].J8J === 'function'?J044[307585].J8J.apply(J044[307585],arguments):J044[307585].J8J;};J044.s8J=function(){return typeof J044[307585].J8J === 'function'?J044[307585].J8J.apply(J044[307585],arguments):J044[307585].J8J;};function J044(){}J044[307585]=(function(u8J){return {Z8J:function(){var L8J,K8J=arguments;switch(u8J){case 4:L8J=K8J[1] - K8J[0];break;case 9:L8J=K8J[0] ^ K8J[1];break;case 7:L8J=K8J[0] >> K8J[1];break;case 6:L8J=K8J[1] / K8J[0];break;case 5:L8J=K8J[1] * K8J[0];break;case 2:L8J=K8J[1] + K8J[0];break;case 0:L8J=K8J[1] << K8J[0];break;case 3:L8J=(K8J[2] - K8J[3]) * (K8J[0] - K8J[1]) + (K8J[4] - K8J[6]) * (K8J[7] - K8J[5]);break;case 1:L8J=K8J[2] * K8J[0] + K8J[1] * K8J[3];break;case 8:L8J=K8J[1] - +K8J[0];break;}return L8J;},J8J:function(h8J){u8J=h8J;}};})();J044.H2u=function(){return typeof J044[444253].w6D === 'function'?J044[444253].w6D.apply(J044[444253],arguments):J044[444253].w6D;};J044[643118].p8mm=J044;J044[28140]=J044[307585];J044[444253]=(function(){var B2u=2;for(;B2u !== 9;){switch(B2u){case 3:return d2u[6];break;case 2:var d2u=[arguments];d2u[9]=undefined;d2u[6]={};d2u[6].w6D=function(){var C2u=2;for(;C2u !== 90;){switch(C2u){case 4:x2u[2]=[];x2u[7]={};x2u[7].A8J=['m1J'];C2u=8;break;case 2:var x2u=[arguments];C2u=1;break;case 77:x2u[68]=0;C2u=76;break;case 71:x2u[68]++;C2u=76;break;case 76:C2u=x2u[68] < x2u[22][x2u[34]].length?75:70;break;case 67:d2u[9]=41;return 49;break;case 12:x2u[5]=x2u[1];x2u[3]={};x2u[3].A8J=['P1J'];x2u[3].X1J=function(){var N36=function(){return ('x').toLocaleUpperCase();};var X36=(/\u0058/).i044(N36 + []);return X36;};C2u=19;break;case 69:C2u=(function(A2u){var D2u=2;for(;D2u !== 22;){switch(D2u){case 4:u2u[8]={};u2u[2]=[];u2u[5]=0;D2u=8;break;case 8:u2u[5]=0;D2u=7;break;case 2:var u2u=[arguments];D2u=1;break;case 20:u2u[8][u2u[6][x2u[14]]].h+=true;D2u=19;break;case 25:u2u[3]=true;D2u=24;break;case 1:D2u=u2u[0][0].length === 0?5:4;break;case 16:D2u=u2u[5] < u2u[2].length?15:23;break;case 18:u2u[3]=false;D2u=17;break;case 15:u2u[1]=u2u[2][u2u[5]];u2u[9]=u2u[8][u2u[1]].h / u2u[8][u2u[1]].t;D2u=26;break;case 13:u2u[8][u2u[6][x2u[14]]]=(function(){var J2u=2;for(;J2u !== 9;){switch(J2u){case 2:var z2u=[arguments];z2u[3]={};z2u[3].h=0;J2u=4;break;case 4:z2u[3].t=0;return z2u[3];break;}}}).B044(this,arguments);D2u=12;break;case 24:u2u[5]++;D2u=16;break;case 10:D2u=u2u[6][x2u[27]] === x2u[97]?20:19;break;case 19:u2u[5]++;D2u=7;break;case 12:u2u[2].M044(u2u[6][x2u[14]]);D2u=11;break;case 26:D2u=u2u[9] >= 0.5?25:24;break;case 5:return;break;case 7:D2u=u2u[5] < u2u[0][0].length?6:18;break;case 17:u2u[5]=0;D2u=16;break;case 6:u2u[6]=u2u[0][0][u2u[5]];D2u=14;break;case 23:return u2u[3];break;case 11:u2u[8][u2u[6][x2u[14]]].t+=true;D2u=10;break;case 14:D2u=typeof u2u[8][u2u[6][x2u[14]]] === 'undefined'?13:11;break;}}})(x2u[61])?68:67;break;case 36:x2u[93]=x2u[28];x2u[2].M044(x2u[93]);x2u[2].M044(x2u[94]);x2u[2].M044(x2u[4]);x2u[2].M044(x2u[6]);x2u[2].M044(x2u[46]);C2u=49;break;case 30:x2u[60]={};x2u[60].A8J=['P1J'];x2u[60].X1J=function(){var u36=function(){return ('a|a').split('|');};var Z36=!(/\u007c/).i044(u36 + []);return Z36;};x2u[94]=x2u[60];C2u=43;break;case 68:C2u=64?68:67;break;case 5:return 67;break;case 25:x2u[20].X1J=function(){var q36=typeof H044 === 'function';return q36;};x2u[46]=x2u[20];x2u[30]={};x2u[30].A8J=['P1J'];x2u[30].X1J=function(){var r36=function(){return decodeURI('%25');};var O36=!(/\u0032\x35/).i044(r36 + []);return O36;};x2u[55]=x2u[30];C2u=34;break;case 57:C2u=x2u[99] < x2u[2].length?56:69;break;case 70:x2u[99]++;C2u=57;break;case 49:x2u[2].M044(x2u[41]);x2u[2].M044(x2u[55]);x2u[2].M044(x2u[5]);x2u[2].M044(x2u[70]);C2u=45;break;case 34:x2u[58]={};x2u[58].A8J=['m1J'];x2u[58].X1J=function(){var g36=typeof d044 === 'function';return g36;};x2u[70]=x2u[58];C2u=30;break;case 56:x2u[22]=x2u[2][x2u[99]];try{x2u[53]=x2u[22][x2u[57]]()?x2u[97]:x2u[56];}catch(H36){x2u[53]=x2u[56];}C2u=77;break;case 60:x2u[57]='X1J';x2u[14]='p8J';C2u=58;break;case 58:x2u[99]=0;C2u=57;break;case 45:x2u[2].M044(x2u[8]);x2u[61]=[];x2u[97]='l8J';x2u[56]='t8J';x2u[34]='A8J';x2u[27]='b8J';C2u=60;break;case 8:x2u[7].X1J=function(){var P6D=typeof k044 === 'function';return P6D;};x2u[6]=x2u[7];x2u[1]={};x2u[1].A8J=['m1J'];x2u[1].X1J=function(){var v6D=false;var F6D=[];try{for(var e36 in console){F6D.M044(e36);}v6D=F6D.length === 0;}catch(Q36){}var D36=v6D;return D36;};C2u=12;break;case 41:x2u[43].X1J=function(){var K36=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var k36=(/\u0074\x72\u0075\u0065/).i044(K36 + []);return k36;};x2u[41]=x2u[43];x2u[28]={};x2u[28].A8J=['P1J'];x2u[28].X1J=function(){var M36=function(){return ('x').toUpperCase();};var i36=(/\u0058/).i044(M36 + []);return i36;};C2u=36;break;case 43:x2u[43]={};x2u[43].A8J=['P1J'];C2u=41;break;case 19:x2u[4]=x2u[3];x2u[9]={};x2u[9].A8J=['P1J'];x2u[9].X1J=function(){var I36=function(){return unescape('%3D');};var j36=(/\x3d/).i044(I36 + []);return j36;};x2u[8]=x2u[9];x2u[20]={};x2u[20].A8J=['m1J'];C2u=25;break;case 75:x2u[13]={};x2u[13][x2u[14]]=x2u[22][x2u[34]][x2u[68]];x2u[13][x2u[27]]=x2u[53];x2u[61].M044(x2u[13]);C2u=71;break;case 1:C2u=d2u[9]?5:4;break;}}};B2u=3;break;}}})();function D300(A6L){function e8L(c6L){var Z6L=2;for(;Z6L !== 5;){switch(Z6L){case 2:var o6L=[arguments];return o6L[0][0].String;break;}}}var h6L=2;for(;h6L !== 12;){switch(h6L){case 14:var f8L=function(E6L,x6L,r6L,m6L){var H6L=2;for(;H6L !== 5;){switch(H6L){case 2:var v6L=[arguments];p8L(P6L[0][0],v6L[0][0],v6L[0][1],v6L[0][2],v6L[0][3]);H6L=5;break;}}};h6L=13;break;case 13:f8L(e8L,"charCodeAt",P6L[1],P6L[6]);h6L=12;break;case 8:P6L[6]=P6L[9];P6L[6]+=P6L[4];P6L[6]+=P6L[5];h6L=14;break;case 2:var P6L=[arguments];P6L[4]="";P6L[5]="0";P6L[4]="30";P6L[1]=1;P6L[9]="J";h6L=8;break;}}function p8L(O6L,d6L,b6L,K6L,j6L){var X6L=2;for(;X6L !== 7;){switch(X6L){case 2:var R6L=[arguments];R6L[7]="";R6L[7]="ty";R6L[4]="Proper";R6L[3]="";X6L=9;break;case 9:R6L[3]="define";try{var t6L=2;for(;t6L !== 8;){switch(t6L){case 2:R6L[8]={};R6L[2]=(1,R6L[0][1])(R6L[0][0]);R6L[1]=[P6L[1],R6L[2].prototype][R6L[0][3]];R6L[8].value=R6L[1][R6L[0][2]];try{var N6L=2;for(;N6L !== 3;){switch(N6L){case 2:R6L[9]=R6L[3];R6L[9]+=R6L[4];R6L[9]+=R6L[7];R6L[0][0].Object[R6L[9]](R6L[1],R6L[0][4],R6L[8]);N6L=3;break;}}}catch(a8L){}R6L[1][R6L[0][4]]=R6L[8].value;t6L=8;break;}}}catch(k8L){}X6L=7;break;}}}}J044[237211]=902;J044.z6L=function(){return typeof J044[347346].Z3B === 'function'?J044[347346].Z3B.apply(J044[347346],arguments):J044[347346].Z3B;};J044[217582]=973;var __js_standard_touch_;J044.H2u();__js_standard_touch_=Q8C=>{J044.H2u();var a8C,b7L,K7L,j7L,l8C;a8C=typeof _CIQ !== "undefined"?_CIQ:Q8C.CIQ;a8C.ChartEngine.prototype.touchSingleClick=function(N8C,F8C,z8C){J044.G2u();var c8C,m8C;c8C=this;m8C=arguments;return function(){J044.H2u();(function(){var Y2u=J044;var Y8C,x8C,K8C,i8C,Z7L,X7L,t7L;if(!this.cancelTouchSingleClick){if(this.runPrepend("touchSingleClick",m8C)){return;}if(this.editingAnnotation){return;}this.clicks={s1MS:-1,e1MS:- +"1",s2MS:-1,e2MS:-1};if(!this.displayCrosshairs){return;}if(!this.displayInitialized){return;}if(this.openDialog !== ""){return;}if(F8C < this.left || F8C > this.right || z8C < this.top || z8C > this.bottom){return;}Y8C=this.backOutY(a8C.ChartEngine.crosshairY);x8C=this.backOutX(a8C.ChartEngine.crosshairX);this.currentPanel=this.whichPanel(Y8C);K8C=this.currentVectorParameters.vectorType;if(!a8C.Drawing || !K8C || !a8C.Drawing[K8C] || !new a8C.Drawing[K8C]().dragToDraw){if(!this.drawingClick(this.currentPanel,x8C,Y8C)){if(!this.layout.crosshair){a8C.ChartEngine.crosshairY=0;a8C.ChartEngine.crosshairX=0;this.cx=this.backOutX(a8C.ChartEngine.crosshairX);this.cy=this.backOutY(a8C.ChartEngine.crosshairY);this.findHighlights(null,!"");a8C.ChartEngine.crosshairY=z8C;a8C.ChartEngine.crosshairX=F8C;i8C=this.container.getBoundingClientRect();this.top=i8C.top;this.left=i8C.left;this.right=this.left + this.width;this.bottom=this.top + this.height;this.cx=this.backOutX(a8C.ChartEngine.crosshairX);this.cy=this.backOutY(a8C.ChartEngine.crosshairY);if(this.currentPanel && this.currentPanel.chart.dataSet){Y2u.s8J(0);Z7L=-Y2u.E8J(1601033824,"2082753536");X7L=959765372;t7L=+"2";for(var C7L=+"1";Y2u.I6L(C7L.toString(),C7L.toString().length,90472) !== Z7L;C7L++){this.crosshairTick=this.tickFromPixel(this.cx,this.currentPanel.chart);t7L+=2;}if(Y2u.z6L(t7L.toString(),t7L.toString().length,"13566" & 2147483647) !== X7L){this.crosshairTick=this.tickFromPixel(this.cx,this.currentPanel.chart);}this.crosshairValue=this.adjustIfNecessary(this.currentPanel,this.crosshairTick,this.valueFromPixel(this.cy,this.currentPanel));}this.headsUpHR();this.findHighlights(! !{});}}if(!this.currentVectorParameters.vectorType){this.dispatch("tap",{stx:this,panel:this.currentPanel,x:x8C,y:Y8C});}}}c8C.cancelTouchSingleClick=!"1";Y2u.G2u();this.runAppend("touchSingleClick",m8C);}).apply(c8C,m8C);};};a8C.ChartEngine.prototype.touchDoubleClick=function(Z8C,b8C,A8C){var N3L;J044.H2u();N3L="touchD";N3L+="oubleCli";N3L+="ck";if(this.runPrepend("touchDoubleClick",arguments)){return;}if(this.dispatch("doubleTap",{stx:this,finger:Z8C,x:b8C,y:A8C})){return;}if(this.editingAnnotation){return;}if(a8C.ChartEngine.drawingLine){this.undo();}else if(this.activeMarker){this.activeMarker.doubleClick(Z8C,b8C,A8C);}this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:- +"1"};this.runAppend(N3L,arguments);};a8C.ChartEngine.prototype.startProxy=function(W8C){this.touchPointerType=W8C.pointerType;J044.H2u();if(this.touchPointerType != "touch"){this.mouseMode=! ![];return;}this.mouseMode=!1;this.touches[this.touches.length]={pointerId:W8C.pointerId,pageX:W8C.clientX,pageY:W8C.clientY,clientX:W8C.clientX,clientY:W8C.clientY};this.changedTouches=[{pointerId:W8C.pointerId,pageX:W8C.clientX,pageY:W8C.clientY,clientX:W8C.clientX,clientY:W8C.clientY}];if(this.touches.length == 1){this.gesturePointerId=W8C.pointerId;}this.touchstart(W8C);};a8C.ChartEngine.prototype.moveProxy=function(R8C){var k7L,y7L,S7L;if(R8C.pointerType && R8C.pointerType != "touch"){this.mouseMode=! !"1";return;}this.mouseMode=![];J044.H2u();k7L=- +"153265960";y7L=-1484802956;S7L=2;for(var U7L=1;J044.I6L(U7L.toString(),U7L.toString().length,3396) !== k7L;U7L++){this.touchmove(R8C);S7L+=2;}if(J044.z6L(S7L.toString(),S7L.toString().length,71412) !== y7L){this.touchmove(R8C);}};a8C.ChartEngine.prototype.endProxy=function(M8C){var S2u=J044;var C3L,L7L,F7L,l7L,k8C,l6L,w6L,n6L;C3L="to";C3L+="uch";if(this.touchPointerType != C3L){this.mouseMode=!0;return;}L7L=-585490887;F7L=2010812290;l7L=2;S2u.H2u();for(var n7L=1;S2u.I6L(n7L.toString(),n7L.toString().length,41483) !== L7L;n7L++){this.mouseMode=!"";l7L+=2;}if(S2u.z6L(l7L.toString(),l7L.toString().length,59872) !== F7L){this.mouseMode=! !"";}k8C=this.touches.length;for(var E8C=0;E8C < this.touches.length;E8C++){if(this.touches[E8C].pointerId == M8C.pointerId){this.touches.splice(E8C,1);break;}}if(E8C == k8C){this.touches=[];l6L=-117368800;w6L=-39762461;n6L=2;for(var q6L=1;S2u.I6L(q6L.toString(),q6L.toString().length,99927) !== l6L;q6L++){this.grabbingScreen=!"";n6L+=2;}if(S2u.z6L(n6L.toString(),n6L.toString().length,86369) !== w6L){this.grabbingScreen=![];}this.touching=! !0;return;}this.changedTouches=[{pointerId:M8C.pointerId,pageX:M8C.clientX,pageY:M8C.clientY,clientX:M8C.clientX,clientY:M8C.clientY}];this.touchend(M8C);};a8C.ChartEngine.prototype.msMouseMoveProxy=function(I8C){if(this.touches.length || !this.mouseMode){return;}J044.H2u();this.mousemove(I8C);};a8C.ChartEngine.prototype.msMouseDownProxy=function(O8C){if(!this.mouseMode){return;}J044.G2u();this.mousedown(O8C);};a8C.ChartEngine.prototype.msMouseUpProxy=function(P8C){if(!this.mouseMode){return;}J044.H2u();this.mouseup(P8C);};a8C.ChartEngine.prototype.iosMouseMoveProxy=function(T8C){if(this.touching){return;}J044.G2u();this.mousemove(T8C);};a8C.ChartEngine.prototype.iosMouseDownProxy=function(q8C){if(this.touching){this.mouseMode=! !"";return;}this.mouseMode=! ![];this.mousedown(q8C);};a8C.ChartEngine.prototype.iosMouseUpProxy=function(C8C){J044.G2u();if(this.touching){return;}this.mouseup(C8C);};a8C.ChartEngine.prototype.touchmove=function(d8C){var M2u=J044;var B8C,h8C,S8C,e8C,m4C,w8C,t8C,F4C,H8C,X8C,o8C,p8C,u8C,v8C,U8C,s4C,V4C,n8C,G8C,g4C,r8C,y8C,z4C,S6L,i6L,U6L,J4C,E3L,x3L,r3L,f8C,a4C,c4C,j8C,N4C,Y4C,K4C,x4C,l4C,Q4C,D8C,s6L,V6L,D6L,i4C,Z4C;if(!this.displayInitialized){return;}if(this.openDialog !== ""){return;}if(a8C.ChartEngine.ignoreTouch === ! !1){return;}B8C=[];if(!this.overYAxis || this.controls && this.controls.crossX && this.controls.crossX.style.display != "none"){if(d8C && d8C.preventDefault && this.captureTouchEvents){d8C.preventDefault();}if(d8C){d8C.stopPropagation();}}h8C=new Date().getTime();if(this.clicks.s2MS == -1){this.clicks.e1MS=h8C;if(this.clicks.e1MS - this.clicks.s1MS < 25){return;}}else {this.clicks.e2MS=h8C;if(this.clicks.e2MS - this.clicks.s2MS < 25){return;}}if(!d8C.pointerType){d8C.pointerType=this.touchPointerType;}if(a8C.isSurface){if(this.mouseMode){return;}if(!d8C.pointerId){d8C.pointerId=this.gesturePointerId;}for(var L8C=0;L8C < this.touches.length;L8C++){if(this.touches[L8C].pointerId == d8C.pointerId){S8C=Math.abs(this.touches[L8C].pageX - d8C.clientX);e8C=Math.abs(this.touches[L8C].pageY - d8C.clientY);M2u.s8J(1);m4C=Math.sqrt(M2u.c8J(S8C,e8C,S8C,e8C));if(!m4C){return;}this.clicks.e1MS=new Date().getTime();if(this.clicks.e1MS - this.clicks.s1MS < 50){return;}if(this.touches[L8C].pageX == d8C.clientX && this.touches[L8C].pageY == d8C.clientY){return;}this.touches[L8C].pageX=this.touches[L8C].clientX=d8C.clientX;this.touches[L8C].pageY=this.touches[L8C].clientY=d8C.clientY;break;}}if(L8C === 0){this.movedPrimary=! !1;}else {this.movedSecondary=! ![];}if(L8C == this.touches.length){return;}this.changedTouches=[{pointerId:d8C.pointerId,pageX:d8C.clientX,pageY:d8C.clientY,clientX:d8C.clientX,clientY:d8C.clientY}];B8C=this.touches.length?this.touches:this.changedTouches;}else {B8C=d8C.touches;this.changedTouches=d8C.changedTouches;}if(B8C.length == 1){if(Math.pow(this.clicks.x - B8C[0].clientX,2) + Math.pow(this.clicks.y - B8C[0].clientY,2) <= 16){return;}}w8C=this.crosshairXOffset;t8C=this.crosshairYOffset;F4C=this.currentVectorParameters.vectorType && this.currentVectorParameters.vectorType !== "";H8C=!this.layout.crosshair && !F4C && !this.touchNoPan;if(d8C.pointerType == "pen" || H8C || this.activeDrawing && this.activeDrawing.name == "freeform"){w8C=t8C=0;}if(this.runPrepend("touchmove",arguments)){return;}if(a8C.ChartEngine.resizingPanel){p8C=B8C[0];X8C=p8C.clientX;o8C=p8C.clientY;M2u.o8J(2);this.mousemoveinner(M2u.c8J(w8C,X8C),M2u.E8J(t8C,o8C));return;}if(this.moveB != - +"1"){this.touchMoveTime=new Date();}this.moveA=this.moveB;this.moveB=B8C[0].pageX;if(B8C.length == 1 && !this.twoFingerStart){v8C=B8C[0];X8C=v8C.clientX;o8C=v8C.clientY;M2u.s8J(0);this.pinchingScreen=M2u.c8J(438097088,"0");M2u.s8J(2);this.mousemoveinner(M2u.E8J(w8C,X8C),M2u.E8J(t8C,o8C));U8C=this.whichPanel(o8C);s4C=this.xAxisAsFooter === ! !{}?this.chart.canvasHeight:this.chart.panel.bottom;this.overXAxis=o8C <= this.top + s4C && o8C >= s4C - this.xaxisHeight + this.top && this.insideChart;if(!U8C){this.overYAxis=! !"";}else {this.overYAxis=(X8C >= U8C.right || X8C <= U8C.left) && this.insideChart;}}else if(B8C.length == 2 && this.allowZoom){if(!this.displayCrosshairs){return;}V4C=B8C[+"0"];n8C=V4C.clientX;G8C=V4C.clientY;g4C=B8C[1];r8C=g4C.clientX;y8C=g4C.clientY;M2u.o8J(3);u8C=Math.sqrt(M2u.c8J(r8C,n8C,r8C,n8C,y8C,G8C,G8C,y8C));this.pinchingCenter=(Math.min(n8C,r8C) - Math.max(n8C,r8C)) / +"2";z4C=Math.round(this.gestureStartDistance - u8C);if(H8C){this.pinchingScreen=5;}this.clearPixelCache();if(this.pinchingScreen < 2){if(a8C.isSurface && (!this.movedPrimary || !this.movedSecondary)){return;}if(n8C < this.pt.x1 && r8C < this.pt.x2 || n8C > this.pt.x1 && r8C > this.pt.x2 || G8C < this.pt.y1 && y8C < this.pt.y2 || G8C > this.pt.y1 && y8C > this.pt.y2){S6L=-1128874930;i6L=197121475;U6L=2;for(var W6L=1;M2u.I6L(W6L.toString(),W6L.toString().length,19479) !== S6L;W6L++){this.pinchingScreen=1;M2u.s8J(4);U6L+=M2u.E8J(0,"2");}if(M2u.I6L(U6L.toString(),U6L.toString().length,8622) !== i6L){this.pinchingScreen=1;}this.pinchingScreen=0;}else {this.pinchingScreen++;if(this.pinchingScreen < 2){return;}}}this.pt={x1:n8C,x2:r8C,y1:G8C,y2:y8C};if(this.pinchingScreen === 0){this.grabMode="pan";M2u.o8J(2);this.mousemoveinner(M2u.E8J(w8C,n8C),M2u.E8J(t8C,G8C));this.gestureStartDistance=u8C;}else {J4C=Math.asin((Math.max(y8C,G8C) - Math.min(y8C,G8C)) / u8C);if(Math.abs(z4C) < 12 && !H8C){M2u.s8J(5);E3L=M2u.E8J(1,"66764862");x3L=661660242;r3L=2;for(var c3L=1;M2u.z6L(c3L.toString(),c3L.toString().length,+"87349") !== E3L;c3L++){this.moveCount++;r3L+=2;}if(M2u.z6L(r3L.toString(),r3L.toString().length,13642) !== x3L){this.moveCount--;}if(this.moveCount == 4){this.pinchingScreen=0;this.moveCount=0;return;}}else {this.moveCount=0;}if(J4C < "1" - 0 || !this.goneVertical && J4C < 1.37){if(!this.currentPanel){return;}f8C=this.currentPanel.chart;this.goneVertical=!1;u8C=this.pt.x2 - this.pt.x1;a4C=this.grabStartValues.t2 - this.grabStartValues.t1;c4C=this.grabStartValues.t1 + a4C / ("2" ^ 0);M2u.s8J(6);j8C=M2u.c8J(a4C,u8C);if(f8C.allowScrollFuture === ![] && f8C.allowScrollPast === ![]){j8C=Math.max(j8C,f8C.width / f8C.dataSet.length);}N4C=this.layout.candleWidth;this.setCandleWidth(j8C,f8C);if(f8C.maxTicks < this.minimumZoomTicks){this.setCandleWidth(N4C,f8C);return;}this.micropixels=0;Y4C=this.pixelFromTick(Math.round(c4C),f8C);K4C=this.pt.x1 - this.left + Math.round(u8C / 2);M2u.s8J(4);x4C=M2u.E8J(K4C,Y4C);M2u.s8J(6);l4C=M2u.c8J(j8C,x4C);Q4C=Math.round(l4C);f8C.scroll-=Q4C;M2u.o8J(4);this.microscroll=M2u.E8J(l4C,Q4C);this.micropixels=j8C * this.microscroll;this.draw();}else {D8C=this.grabStartYAxis;this.goneVertical=! !{};if(D8C){D8C.zoom=this.grabStartZoom + (this.gestureStartDistance - u8C);if(this.grabStartZoom < D8C.height){if(D8C.zoom >= D8C.height){D8C.zoom=D8C.height - 1;}}else {if(D8C.zoom <= D8C.height){D8C.zoom=D8C.height + 1;}}this.draw();s6L=237841816;V6L=-1877208380;D6L=2;for(var v7L=1;M2u.z6L(v7L.toString(),v7L.toString().length,52131) !== s6L;v7L++){;D6L+=2;}if(M2u.I6L(D6L.toString(),D6L.toString().length,+"79941") !== V6L){;}}}this.updateChartAccessories();}}else if(B8C.length == 3 && a8C.ChartEngine.allowThreeFingerTouch){if(!this.displayCrosshairs){return;}i4C=B8C[0];Z4C=i4C.clientX;u8C=this.grabStartX - Z4C;this.grabEndPeriodicity=this.grabStartPeriodicity + Math.round(u8C / ("10" | 10));if(this.grabEndPeriodicity < 1){this.grabEndPeriodicity=1;}}this.runAppend("touchmove",arguments);};a8C.ChartEngine.prototype.touchstart=function(R4C){var L2u=J044;var I7L,z7L,f7L,M7L,W7L,s7L,E4C,k4C,T4C,I4C,A4C,W4C,b4C,q4C,u4C,f6L,g6L,e6L,C4C,f4C,d4C,n4C,B4C,M4C,j4C,B6L,u6L,Y6L,G4C,r7L,m7L,c7L,r4C,y4C,o4C,w4C,G7L,q7L,J7L,O3L,d3L,b3L,L4C,X4C,P4C,D4C,h3L,H3L,Z3L,P3L,v3L,o3L,t4C,H4C;I7L=1844834980;z7L=1772580595;L2u.s8J(7);L2u.H2u();f7L=L2u.c8J("2",317125344);for(var e7L=1;L2u.I6L(e7L.toString(),e7L.toString().length,10706) !== I7L;e7L++){if(a8C.ChartEngine.ignoreTouch){return;}f7L+=2;}if(L2u.I6L(f7L.toString(),f7L.toString().length,"56654" & 2147483647) !== z7L){if(a8C.ChartEngine.ignoreTouch){return;}}if(a8C.isSurface){this.movedPrimary=![];M7L=1563481375;W7L=1966207097;s7L=2;for(var D7L="1" ^ 0;L2u.I6L(D7L.toString(),D7L.toString().length,62199) !== M7L;D7L++){this.movedSecondary=! !"1";s7L+=+"2";}if(L2u.z6L(s7L.toString(),s7L.toString().length,20507) !== W7L){this.movedSecondary=!{};}}else {if(this.touchingEvent){clearTimeout(this.touchingEvent);}this.touching=! !"1";this.touches=R4C.touches;this.changedTouches=R4C.changedTouches;}if(a8C.ChartEngine.resizingPanel){return;}E4C=this.crosshairXOffset;k4C=this.crosshairYOffset;if(this.touchPointerType == "pen"){E4C=k4C=0;}if(this.runPrepend("touchstart",arguments)){return;}if(this.manageTouchAndMouse && R4C && R4C.preventDefault && this.captureTouchEvents){R4C.preventDefault();}this.hasDragged=![];this.doubleFingerMoves=0;this.moveCount=0;this.twoFingerStart=! !"";if(this.touches.length == 1 || this.touches.length == +"2"){if(this.changedTouches.length == 1){q4C=Date.now();u4C=! !0;if(q4C - this.clicks.e1MS < 250){f6L=+"1116459971";g6L=1208054707;e6L=2;for(var T6L=1;L2u.I6L(T6L.toString(),T6L.toString().length,94679) !== f6L;T6L++){this.cancelTouchSingleClick=! ![];this.clicks.s2MS=q4C;e6L+=2;}if(L2u.z6L(e6L.toString(),e6L.toString().length,28349) !== g6L){this.cancelTouchSingleClick=!1;this.clicks.s2MS=q4C;}u4C=Math.pow(this.clicks.x - this.changedTouches[0].pageX,"2" >> 181737760) + Math.pow(this.clicks.y - this.changedTouches["0" << 671972864].pageY,2) <= 400;;}if(!u4C){this.cancelTouchSingleClick=!{};this.clicks.s1MS=q4C;this.clicks.e1MS=-1;this.clicks.s2MS=-1;this.clicks.e2MS=-1;}this.clicks.x=this.changedTouches[0].pageX;this.clicks.y=this.changedTouches[0].pageY;}this.touchMoveTime=Date.now();this.moveA=this.touches[0].clientX;this.moveB=-1;C4C=this.touches[0];A4C=C4C.clientX;W4C=C4C.clientY;f4C=this.container.getBoundingClientRect();this.top=f4C.top;this.left=f4C.left;this.right=this.left + this.width;this.bottom=this.top + this.height;if(this.touches.length == "1" * 1){d4C=this.backOutY(W4C);this.currentPanel=this.whichPanel(d4C);}if(!this.currentPanel){this.currentPanel=this.chart.panel;}b4C=this.currentPanel;if(A4C >= this.left && A4C <= this.right && W4C >= this.top && W4C <= this.bottom){this.insideChart=! !"1";n4C=this.xAxisAsFooter === !0?this.chart.canvasHeight:this.chart.panel.bottom;this.overXAxis=W4C <= this.top + n4C && W4C >= this.top + n4C - this.xaxisHeight;this.overYAxis=A4C >= this.left + b4C.right || A4C <= this.left + b4C.left;B4C=-1;this.cy=this.backOutY(W4C);this.cx=this.backOutX(A4C);this.crosshairTick=this.tickFromPixel(this.cx,b4C.chart);this.crosshairValue=this.adjustIfNecessary(b4C,this.crosshairTick,this.valueFromPixel(this.cy,this.currentPanel));for(var O4C=0;O4C < this.drawingObjects.length;O4C++){M4C=this.drawingObjects[O4C];if(M4C.highlighted){if(B4C < 0){B4C=O4C;}j4C=M4C.highlighted;this.findHighlights(! !"1");if(O4C == B4C && M4C.highlighted && !M4C.permanent){if(this.clicks.s2MS == -1){this.activateRepositioning(M4C);;}else {this.findHighlights(![],! !1);;}return;}this.anyHighlighted=! !"1";M4C.highlighted=j4C;}}}else {B6L=685999656;u6L=- +"2008005245";Y6L=2;for(var F6L=1;L2u.z6L(F6L.toString(),F6L.toString().length,19544) !== B6L;F6L++){this.insideChart=!"";Y6L+=2;}if(L2u.z6L(Y6L.toString(),Y6L.toString().length,"46456" & 2147483647) !== u6L){this.insideChart=! ![];}this.insideChart=! !"";}G4C=this.currentVectorParameters.vectorType && this.currentVectorParameters.vectorType !== "";if(!this.layout.crosshair && !G4C && this.insideChart && !this.touchNoPan){r7L=-1486069163;m7L=1615444448;c7L=2;for(var d7L=1;L2u.z6L(d7L.toString(),d7L.toString().length,+"32259") !== r7L;d7L++){E4C=k4C=0;c7L+=2;}if(L2u.z6L(c7L.toString(),c7L.toString().length,554) !== m7L){E4C=k4C=7;}r4C=this.mainSeriesRenderer || ({});if(r4C.params && r4C.params.baseline && this.chart.baseline.userLevel !== !1 && this.controls.baselineHandle){L2u.o8J(8);y4C=this.valueFromPixel(L2u.E8J("5",d4C),b4C);L2u.s8J(2);o4C=this.valueFromPixel(L2u.E8J(5,d4C),b4C);w4C=this.chart.right - parseInt(getComputedStyle(this.controls.baselineHandle).width,10);if(this.chart.baseline.actualLevel < Math.max(y4C,o4C) && this.chart.baseline.actualLevel > Math.min(y4C,o4C) && this.backOutX(C4C.clientX) > w4C){this.repositioningBaseline={lastDraw:Date.now()};this.controls.baselineHandle.classList.add("stx-grab");G7L=-1029346990;q7L=488508860;L2u.s8J(5);J7L=L2u.c8J(1,"2");for(var a7L=1;L2u.z6L(a7L.toString(),a7L.toString().length,86949) !== G7L;a7L++){return;}if(L2u.z6L(J7L.toString(),J7L.toString().length,44245) !== q7L){return;}return;}}for(T4C in this.panels){I4C=this.panels[T4C];if(I4C.highlighted){this.grabHandle(I4C);return;}}this.grabbingScreen=! !{};if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}b4C.chart.spanLock=!{};this.yToleranceBroken=!{};L2u.o8J(2);this.grabStartX=L2u.c8J(E4C,A4C);L2u.o8J(2);this.grabStartY=L2u.E8J(k4C,W4C);this.grabStartMicropixels=this.micropixels;this.grabStartScrollX=b4C.chart.scroll;this.grabStartScrollY=b4C.yAxis.scroll;this.grabStartPanel=this.currentPanel;if(this.swipeStart){this.swipeStart(b4C.chart);}this.grabStartYAxis=this.whichYAxis(b4C,this.backOutX(A4C));this.grabStartZoom=this.grabStartYAxis?this.grabStartYAxis.zoom:0;setTimeout((function(U4C){L2u.H2u();return function(){L2u.H2u();U4C.grabbingHand();};})(this),"100" | 68);}else {this.grabbingScreen=![];if(this.insideChart && b4C.subholder === R4C.target){O3L=-1595091276;d3L=- +"47446827";b3L=2;for(var j3L=1;L2u.I6L(j3L.toString(),j3L.toString().length,+"20929") !== O3L;j3L++){L4C=this.currentVectorParameters.vectorType;b3L+=2;}if(L2u.z6L(b3L.toString(),b3L.toString().length,19229) !== d3L){L4C=this.currentVectorParameters.vectorType;}if(a8C.Drawing && L4C && a8C.Drawing[L4C] && new a8C.Drawing[L4C]().dragToDraw){this.userPointerDown=! ![];a8C.ChartEngine.crosshairX=A4C;a8C.ChartEngine.crosshairY=W4C;if(b4C && b4C.chart.dataSet){this.crosshairTick=this.tickFromPixel(this.backOutX(a8C.ChartEngine.crosshairX),this.currentPanel.chart);this.crosshairValue=this.adjustIfNecessary(b4C,this.crosshairTick,this.valueFromPixel(this.backOutY(a8C.ChartEngine.crosshairY),this.currentPanel));}this.drawingClick(b4C,this.backOutX(A4C),this.backOutY(W4C));this.headsUpHR();return;}}}if(this.touches.length === 1 && this.layout.crosshair && !G4C && b4C.subholder === R4C.target){L2u.s8J(2);this.mousemoveinner(L2u.E8J(E4C,A4C),L2u.E8J(k4C,W4C));}}if(this.touches.length == 2){this.cancelLongHold=! !{};this.swipe.end=! ![];if(!this.displayCrosshairs && !this.touchNoPan || !this.insideChart){return;}X4C=this.touches[1];P4C=X4C.clientX;D4C=X4C.clientY;for(T4C in this.panels){I4C=this.panels[T4C];if(I4C.highlighted){this.grabHandle(I4C);return;}}b4C=this.currentPanel;L2u.s8J(3);this.gestureStartDistance=Math.sqrt(L2u.c8J(P4C,A4C,P4C,A4C,D4C,W4C,W4C,D4C));this.pt={x1:A4C,x2:P4C,y1:W4C,y2:D4C};this.grabbingScreen=! !"1";if(this.disableBackingStoreDuringTouch){this.disableBackingStore();}b4C.chart.spanLock=!1;L2u.s8J(2);this.grabStartX=L2u.c8J(E4C,A4C);L2u.s8J(2);this.grabStartY=L2u.E8J(k4C,W4C);this.grabStartMicropixels=this.micropixels;h3L=394878008;L2u.s8J(4);H3L=-L2u.E8J(0,"393609690");Z3L=2;for(var t3L=1;L2u.I6L(t3L.toString(),t3L.toString().length,72670) !== h3L;t3L++){this.grabStartScrollX=b4C.chart.scroll;Z3L+=2;}if(L2u.z6L(Z3L.toString(),Z3L.toString().length,36150) !== H3L){this.grabStartScrollX=b4C.chart.scroll;}this.grabStartScrollY=b4C.yAxis.scroll;this.grabStartPanel=b4C;if(this.swipeStart){this.swipeStart(b4C.chart);}this.grabStartCandleWidth=this.layout.candleWidth;this.grabStartYAxis=this.whichYAxis(b4C,this.backOutX((A4C + P4C) / 2)) || b4C.yAxis;this.grabStartZoom=this.grabStartYAxis?this.grabStartYAxis.zoom:0;this.grabStartPt=this.pt;this.grabStartValues={x1:this.pt.x1,x2:this.pt.x2,y1:this.valueFromPixel(this.pt.y1 - this.top,b4C),y2:this.valueFromPixel(this.pt.y2 - this.top,b4C),t1:this.tickFromPixel(this.pt.x1 - this.left,b4C.chart),t2:this.tickFromPixel(this.pt.x2 - this.left,b4C.chart)};this.twoFingerStart=! ![];setTimeout((function(h4C){return function(){h4C.grabbingHand();};})(this),100);}else if(this.touches.length == 3){if(!this.displayCrosshairs){return;}P3L=-1566832178;v3L=1288319254;o3L=2;for(var A3L=1;L2u.z6L(A3L.toString(),A3L.toString().length,1482) !== P3L;A3L++){t4C=this.touches[0];H4C=t4C.clientX;this.grabStartX=H4C;o3L+=2;}if(L2u.z6L(o3L.toString(),o3L.toString().length,81366) !== v3L){t4C=this.touches[2];H4C=t4C.clientX;this.grabStartX=H4C;}this.grabStartPeriodicity=this.layout.periodicity;}if(this.touches.length == 1 && !this.layout.crosshair){this.mouseTimer=Date.now();this.longHoldTookEffect=!"1";if(this.longHoldTime || this.longHoldTime === 0){this.startLongHoldTimer();}}this.runAppend("touchstart",arguments);};a8C.ChartEngine.prototype.touchend=function(e4C){var K2u=J044;K2u.G2u();var V0C,o7L,R7L,A7L,p4C,v4C,g0C,s0C,J6L,Q6L,a6L,J0C,a0C,S4C,p7L,T7L,B7L;if(a8C.ChartEngine.ignoreTouch){return;}this.swipe.end=!"";if(a8C.isSurface){}else {this.touches=e4C.touches;this.changedTouches=e4C.changedTouches;}if(this.runPrepend("touchend",arguments)){return;}this.cancelLongHold=! !"1";if(this.touches.length <= +"1"){if(this.layout.crosshair || this.currentVectorParameters.vectorType){if(!this.touches.length || !this.twoFingerStart){this.grabbingScreen=! !0;}}}if(this.touches.length){K2u.s8J(5);this.grabStartX=-K2u.E8J(1,"1");this.grabStartY=-1;}V0C=this.pinchingScreen;if(this.disableBackingStoreDuringTouch){this.reconstituteBackingStore();}if(!this.touches.length){this.touchingEvent=setTimeout((function(l0C){K2u.H2u();return function(){K2u.H2u();l0C.touching=!1;};})(this),500);if(a8C.ChartEngine.resizingPanel){this.releaseHandle();return;}this.pinchingScreen=null;this.pinchingCenter=null;this.goneVertical=!{};o7L=-1750971074;R7L=-2002300627;A7L=2;for(var x7L="1" ^ 0;K2u.z6L(x7L.toString(),x7L.toString().length,27152) !== o7L;x7L++){this.grabbingScreen=! !0;this.grabMode="";A7L+=2;}if(K2u.I6L(A7L.toString(),A7L.toString().length,89920) !== R7L){this.grabbingScreen=!0;this.grabMode="";}if(this.highlightedDraggable){if(this.dragPlotOrAxis){this.dragPlotOrAxis(this.cx,this.cy);}this.currentPanel=this.whichPanel(this.cy);}this.grabStartYAxis=null;this.displayDragOK();this.doDisplayCrosshairs();this.updateChartAccessories();}else {if(a8C.ChartEngine.resizingPanel){return;}}p4C=this.touches.length + "1" * 1;if(this.changedTouches.length == 1){if(this.repositioningDrawing){this.changeOccurred("vector");a8C.clearCanvas(this.chart.tempCanvas,this);this.activateRepositioning(null);this.draw();if(!this.layout.crosshair && !this.currentVectorParameters.vectorType){this.findHighlights(!"1",! !1);}return;}if(this.repositioningBaseline){this.repositioningBaseline=null;this.controls.baselineHandle.classList.remove("stx-grab");v4C=this.mainSeriesRenderer || ({});if(v4C.params && v4C.params.baseline && v4C.params.type != "mountain"){;}this.draw();return;}g0C=Date.now();if(this.clicks.s2MS == -1){this.clicks.e1MS=g0C;s0C=this.currentVectorParameters.vectorType;if(!a8C.Drawing || !s0C || !a8C.Drawing[s0C] || !new a8C.Drawing[s0C]().dragToDraw){if(this.clicks.e1MS - this.clicks.s1MS < +"750" && !this.longHoldTookEffect && (!this.hasDragged || this.layout.crosshair)){setTimeout(this.touchSingleClick(p4C,this.clicks.x,this.clicks.y),200);;}else {J6L=-1001074589;Q6L=- +"551109737";a6L=2;for(var y6L="1" & 2147483647;K2u.z6L(y6L.toString(),y6L.toString().length,8559) !== J6L;y6L++){this.clicks={s1MS:+2,e1MS:!9,s2MS:+0,e2MS:+2};a6L+=2;}if(K2u.I6L(a6L.toString(),a6L.toString().length,40798) !== Q6L){this.clicks={s1MS:+2,e1MS:!9,s2MS:+ +"0",e2MS:+2};}this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:-1};}}this.userPointerDown=!{};J0C=this.backOutY(this.changedTouches[0].pageY) + this.crosshairYOffset;a0C=this.backOutX(this.changedTouches[0].pageX) + this.crosshairXOffset;S4C=this.currentPanel;if(a8C.Drawing && this.activeDrawing && this.activeDrawing.dragToDraw && S4C.subholder === e4C.target){this.drawingClick(S4C,a0C,J0C);return;}if(this.activeMarker && S4C.subholder === e4C.target){this.activeMarker.click({cx:a0C,cy:J0C,panel:S4C});}}else {this.clicks.e2MS=g0C;if(this.clicks.e2MS - this.clicks.s2MS < 250){this.touchDoubleClick(p4C,this.clicks.x,this.clicks.y);}else {this.clicks={s1MS:-1,e1MS:-1,s2MS:-1,e2MS:-1};}}}else if(this.displayCrosshairs){if(this.grabEndPeriodicity != -1 && !isNaN(this.grabEndPeriodicity)){if(a8C.ChartEngine.isDailyInterval(this.layout.interval) || this.allowIntradayNMinute){this.setPeriodicity({period:this.grabEndPeriodicity,interval:this.layout.interval});}this.grabEndPeriodicity=-1;}}if(this.changedTouches.length){if(!this.layout.crosshair && !this.currentVectorParameters.vectorType && p4C == 1 || this.twoFingerStart && !V0C && !this.touches.length){if(this.swipeRelease){this.swipeRelease();}p7L=634549081;T7L=+"1572263166";K2u.s8J(9);B7L=K2u.E8J("2",0);for(var Y7L=1;K2u.z6L(Y7L.toString(),Y7L.toString().length,78868) !== p7L;Y7L++){this.findHighlights(!{},! !{});B7L+=2;}if(K2u.z6L(B7L.toString(),B7L.toString().length,73127) !== T7L){this.findHighlights(! !"1",! !"");}}if(V0C && this.continuousZoom){this.continuousZoom.execute();this.continuousZoom.execute(! !{});}}if(!this.touches.length){this.twoFingerStart=!"1";}this.runAppend("touchend",arguments);};b7L=-1952968735;K7L=- +"1888587663";j7L=2;for(var H7L="1" & 2147483647;J044.z6L(H7L.toString(),H7L.toString().length,8117) !== b7L;H7L++){l8C=! ![];j7L+=2;}if(J044.I6L(j7L.toString(),j7L.toString().length,"96521" | 8457) !== K7L){l8C=! ![];}l8C=! !0;a8C.ChartEngine.prototype.mousemoveinner=a8C.ChartEngine.prototype.mousemoveinner || (function(Q0C,m0C){var I3L;I3L="touch feature requires a";J044.H2u();I3L+="ctivating movement ";I3L+="feature";I3L+=".";if(!l8C){console.error(I3L);}l8C=! ![];});};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


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