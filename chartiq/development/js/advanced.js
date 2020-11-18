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


import {CIQ, SplinePlotter, timezoneJS, $$, $$$} from "../js/standard.js";

let __js_advanced_drawingAdvanced_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
var timezoneJS =
	typeof _timezoneJS !== "undefined" ? _timezoneJS : _exports.timezoneJS;

if (!CIQ.Drawing) {
	console.error(
		"drawingAdvanced feature requires first activating drawing feature."
	);
} else {
	/**
	 * Ray drawing tool. A ray is defined by two points. It travels infinitely past the second point.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.line}.
	 * @constructor
	 * @name  CIQ.Drawing.ray
	 */
	CIQ.Drawing.ray = function () {
		this.name = "ray";
	};

	CIQ.inheritsFrom(CIQ.Drawing.ray, CIQ.Drawing.line);

	CIQ.Drawing.ray.prototype.calculateOuterSet = function (panel) {
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

		var endOfRay = vector.x1 + 1000;
		if (vector.x0 > vector.x1) {
			endOfRay = vector.x1 - 1000;
		}

		this.v0B = this.v0;
		this.v1B = CIQ.yIntersection(vector, endOfRay);
		this.d0B = this.d0;
		this.d1B = this.stx.dateFromTick(endOfRay, panel.chart);
	};

	CIQ.Drawing.ray.prototype.adjust = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.setPoint(1, this.d1, this.v1, panel.chart);
		// Use outer set if original drawing was on intraday but now displaying on daily
		if (CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval) && this.d0B) {
			this.setPoint(1, this.d1B, this.v1B, panel.chart);
		}
	};

	/**
	 * Continuous line drawing tool. Creates a series of connected line segments, each one completed with a user click.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.segment}.
	 * @constructor
	 * @name  CIQ.Drawing.continuous
	 */
	CIQ.Drawing.continuous = function () {
		this.name = "continuous";
		this.dragToDraw = false;
		this.maxSegments = null;
	};

	CIQ.inheritsFrom(CIQ.Drawing.continuous, CIQ.Drawing.segment);

	CIQ.Drawing.continuous.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.penDown = true;
			return false;
		}
		if (this.accidentalClick(tick, value)) {
			this.stx.undo(); //abort
			return true;
		}

		this.setPoint(1, tick, value, panel.chart);

		// render a segment
		var Segment = CIQ.Drawing.segment;
		var segment = new Segment();
		var obj = this.serialize(this.stx);
		segment.reconstruct(this.stx, obj);
		this.stx.addDrawing(segment);
		this.stx.changeOccurred("vector");
		this.stx.draw();
		this.segment++;

		if (this.maxSegments && this.segment > this.maxSegments) return true;
		this.setPoint(0, tick, value, panel.chart); // reset initial point for next segment, copy by value
		return false;
	};

	/**
	 * Ellipse drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.BaseTwoPoint}.
	 * @constructor
	 * @name  CIQ.Drawing.ellipse
	 */
	CIQ.Drawing.ellipse = function () {
		this.name = "ellipse";
	};

	CIQ.inheritsFrom(CIQ.Drawing.ellipse, CIQ.Drawing.BaseTwoPoint);

	CIQ.Drawing.ellipse.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

		var left = x0 - (x1 - x0);
		var right = x1;
		var middle = y0;
		var bottom = y1;
		var top = y0 - (y1 - y0);
		var weight = (bottom - top) / 6;
		var lineWidth = this.lineWidth;
		if (!lineWidth) lineWidth = 1.1;
		var edgeColor = this.color;
		if (edgeColor == "auto" || CIQ.isTransparent(edgeColor))
			edgeColor = this.stx.defaultColor;
		if (this.highlighted) {
			edgeColor = this.stx.getCanvasColor("stx_highlight_vector");
			if (lineWidth == 0.1) lineWidth = 1.1;
		}

		var fillColor = this.fillColor;

		context.beginPath();
		context.moveTo(left, middle);
		context.bezierCurveTo(
			left,
			bottom + weight,
			right,
			bottom + weight,
			right,
			middle
		);
		context.bezierCurveTo(
			right,
			top - weight,
			left,
			top - weight,
			left,
			middle
		);

		if (fillColor && !CIQ.isTransparent(fillColor) && fillColor != "auto") {
			context.fillStyle = fillColor;
			context.globalAlpha = 0.2;
			context.fill();
			context.globalAlpha = 1;
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
		context.closePath();
		if (this.highlighted) {
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x1, y1, p1Fill);
		}
	};

	CIQ.Drawing.ellipse.prototype.intersected = function (tick, value, box) {
		if (!this.p0 || !this.p1) return null; // in case invalid drawing (such as from panel that no longer exists)
		if (this.pointIntersection(this.p1[0], this.p1[1], box)) {
			this.highlighted = "p1";
			return {
				action: "drag",
				point: "p1"
			};
		}
		var left = this.p0[0] - (this.p1[0] - this.p0[0]);
		var right = this.p1[0];
		var bottom = this.p1[1];
		var top = this.p0[1] - (this.p1[1] - this.p0[1]);

		if (box.x0 > Math.max(left, right) || box.x1 < Math.min(left, right))
			return false;
		if (box.y1 > Math.max(top, bottom) || box.y0 < Math.min(top, bottom))
			return false;
		this.highlighted = true;
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1),
			tick: tick,
			value: value
		};
	};

	CIQ.Drawing.ellipse.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern"
	];

	/**
	 * Reconstruct an ellipse
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The border color
	 * @param {string} [obj.fc] The fill color
	 * @param {string} [obj.pnl] The panel name
	 * @param {string} [obj.ptrn] Optional pattern for line "solid","dotted","dashed". Defaults to solid.
	 * @param {number} [obj.lw] Optional line width. Defaults to 1.
	 * @param {number} [obj.v0] Value (price) for the center point
	 * @param {number} [obj.v1] Value (price) for the outside point
	 * @param {number} [obj.d0] Date (string form) for the center point
	 * @param {number} [obj.d1] Date (string form) for the outside point
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
	 * @memberOf CIQ.Drawing.ellipse
	 */
	CIQ.Drawing.ellipse.prototype.reconstruct = function (stx, obj) {
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

	CIQ.Drawing.ellipse.prototype.serialize = function () {
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
	 * Channel drawing tool. Creates a channel within 2 parallel line segments.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.segment}.
	 * @constructor
	 * @name  CIQ.Drawing.channel
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.channel = function () {
		this.name = "channel";
		this.dragToDraw = false;
		this.p2 = null;
	};

	CIQ.inheritsFrom(CIQ.Drawing.channel, CIQ.Drawing.segment);

	CIQ.Drawing.channel.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern"
	];

	CIQ.Drawing.channel.prototype.move = function (context, tick, value) {
		if (!this.penDown) return;

		this.copyConfig();
		if (this.p2 === null) this.p1 = [tick, value];
		else {
			var y =
				value -
				((this.p1[1] - this.p0[1]) / (this.p1[0] - this.p0[0])) *
					(tick - this.p1[0]);
			this.p2 = [this.p1[0], y];
		}
		this.render(context);
	};

	CIQ.Drawing.channel.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.penDown = true;
			return false;
		}
		if (this.accidentalClick(tick, value)) {
			this.stx.undo(); //abort
			return true;
		}

		if (this.p2 !== null) {
			this.setPoint(2, this.p2[0], this.p2[1], panel.chart);
			this.penDown = false;
			return true;
		}
		this.setPoint(1, tick, value, panel.chart);
		if (this.p0[0] == this.p1[0]) {
			// don't allow vertical line
			this.p1 = null;
			return false;
		}
		this.p2 = [this.p1[0], this.p1[1]];
		return false;
	};

	CIQ.Drawing.channel.prototype.boxIntersection = function (tick, value, box) {
		var p0 = this.p0,
			p1 = this.p1,
			p2 = this.p2;
		if (!p0 || !p1 || !p2) return false;
		if (box.x0 > Math.max(p0[0], p1[0]) || box.x1 < Math.min(p0[0], p1[0]))
			return false;

		// http://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line
		var s1 =
			(p1[0] - p0[0]) * ((p2[1] < p0[1] ? box.y1 : box.y0) - p0[1]) -
			(p1[1] - p0[1]) * (tick - p0[0]);
		var s2 =
			(p2[0] - p0[0]) *
				((p2[1] > p0[1] ? box.y1 : box.y0) - (p0[1] + p2[1] - p1[1])) -
			(p1[1] - p0[1]) * (tick - p0[0]);
		return s1 * s2 < 0;
	};

	CIQ.Drawing.channel.prototype.intersected = function (tick, value, box) {
		if (!this.p0 || !this.p1 || !this.p2) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: this.p0, 1: this.p1, 2: this.p2 };
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
			// This object will be used for repositioning
			return {
				action: "move",
				p0: CIQ.clone(this.p0),
				p1: CIQ.clone(this.p1),
				p2: CIQ.clone(this.p2),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		return null;
	};

	CIQ.Drawing.channel.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var y = null;
		if (this.p2) {
			y = this.stx.pixelFromValueAdjusted(panel, this.p2[0], this.p2[1]);
		}

		var width = this.lineWidth;
		var color = this.getLineColor();

		var fillColor = this.fillColor;
		if (
			this.p2 &&
			fillColor &&
			!CIQ.isTransparent(fillColor) &&
			fillColor != "auto"
		) {
			context.beginPath();
			context.moveTo(x0, y0);
			context.lineTo(x1, y1);
			context.lineTo(x1, y);
			context.lineTo(x0, y0 + (y - y1));
			context.closePath();
			context.globalAlpha = 0.2;
			context.fillStyle = fillColor;
			context.fill();
			context.globalAlpha = 1;
		}

		var parameters = {
			pattern: this.pattern,
			lineWidth: width
		};
		if ((this.penDown || this.highlighted) && this.pattern == "none")
			parameters.pattern = "dotted";
		this.stx.plotLine(
			x0,
			x1,
			y0,
			y1,
			color,
			"segment",
			context,
			panel,
			parameters
		);
		if (this.p2)
			this.stx.plotLine(
				x0,
				x1,
				y0 + (y - y1),
				y,
				color,
				"segment",
				context,
				panel,
				parameters
			);

		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			var p2Fill = this.highlighted == "p2" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
			this.littleCircle(context, x1, y, p2Fill);
		}
	};

	CIQ.Drawing.channel.prototype.reposition = function (
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
			this.setPoint(
				2,
				repositioner.p2[0] - tickDiff,
				repositioner.p2[1] - valueDiff,
				panel.chart
			);
			this.render(context);
		} else if (repositioner.action == "drag") {
			this[repositioner.point] = [tick, value];
			this.setPoint(0, this.p0[0], this.p0[1], panel.chart);
			this.setPoint(1, this.p1[0], this.p1[1], panel.chart);
			this.setPoint(2, this.p2[0], this.p2[1], panel.chart);
			this.render(context);
		}
	};

	CIQ.Drawing.channel.prototype.adjust = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.setPoint(1, this.d1, this.v1, panel.chart);
		this.setPoint(2, this.d1, this.v2, panel.chart); //not an error, should be d1 here
	};

	/**
	 * Reconstruct a channel
	 * @memberOf CIQ.Drawing.channel
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The line color
	 * @param {string} [obj.fc] The fill color
	 * @param {string} [obj.pnl] The panel name
	 * @param {string} [obj.ptrn] Pattern for line "solid","dotted","dashed". Defaults to solid.
	 * @param {number} [obj.lw] Line width. Defaults to 1.
	 * @param {number} [obj.v0] Value (price) for the first point
	 * @param {number} [obj.v1] Value (price) for the second point
	 * @param {number} [obj.v2] Value (price) for the second point of the opposing parallel channel line
	 * @param {number} [obj.d0] Date (string form) for the first point
	 * @param {number} [obj.d1] Date (string form) for the second point
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
	 */
	CIQ.Drawing.channel.prototype.reconstruct = function (stx, obj) {
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
		this.v2 = obj.v2;
		this.adjust();
	};

	CIQ.Drawing.channel.prototype.serialize = function () {
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
			v1: this.v1,
			v2: this.v2
		};
	};

	/**
	 * Andrews' Pitchfork drawing tool. A Pitchfork is defined by three parallel rays.  The center ray is equidistant from the two outer rays.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.channel}.
	 * @constructor
	 * @name  CIQ.Drawing.pitchfork
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.pitchfork = function () {
		this.name = "pitchfork";
		this.dragToDraw = false;
		this.p2 = null;
	};

	CIQ.inheritsFrom(CIQ.Drawing.pitchfork, CIQ.Drawing.channel);

	CIQ.Drawing.pitchfork.prototype.configs = ["color", "lineWidth", "pattern"];

	CIQ.Drawing.pitchfork.prototype.move = function (context, tick, value) {
		if (!this.penDown) return;

		this.copyConfig();
		if (this.p2 === null) this.p1 = [tick, value];
		else this.p2 = [tick, value];
		this.render(context);
	};

	CIQ.Drawing.pitchfork.prototype.intersected = function (tick, value, box) {
		if (!this.p0 || !this.p1 || !this.p2) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: this.p0, 1: this.p1, 2: this.p2 };
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
		var rays = this.rays;
		for (var i = 0; i < rays.length; i++) {
			if (
				this.lineIntersection(
					tick,
					value,
					box,
					i ? "ray" : "segment",
					rays[i][0],
					rays[i][1],
					true
				)
			) {
				this.highlighted = true;
				// This object will be used for repositioning
				return {
					action: "move",
					p0: CIQ.clone(this.p0),
					p1: CIQ.clone(this.p1),
					p2: CIQ.clone(this.p2),
					tick: tick, // save original tick
					value: value // save original value
				};
			}
		}
		return null;
	};

	CIQ.Drawing.pitchfork.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var stx = this.stx;
		var p2 = this.p2;
		if (!p2) p2 = this.p1;
		var x0 = stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = stx.pixelFromTick(this.p1[0], panel.chart);
		var x2 = stx.pixelFromTick(p2[0], panel.chart);
		var y0 = stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var y2 = stx.pixelFromValueAdjusted(panel, p2[0], p2[1]);

		var width = this.lineWidth;
		var color = this.getLineColor();

		var parameters = {
			pattern: this.pattern,
			lineWidth: width
		};
		var z = 50;
		var yp = 2 * y0 - y1 - y2;
		var denom = 2 * x0 - x1 - x2;
		if (denom < 0) z *= -1;
		yp *= z / denom;
		this.rays = [
			[
				[x1, y1],
				[x2, y2]
			],
			[
				[x0, y0],
				[(x1 + x2) / 2, (y1 + y2) / 2]
			]
		];
		if (!(x1 == x2 && y1 == y2)) {
			this.rays.push(
				[
					[x1, y1],
					[x1 - z, y1 - yp]
				],
				[
					[x2, y2],
					[x2 - z, y2 - yp]
				]
			);
		}
		for (var i = 0; i < this.rays.length; i++) {
			var ray = this.rays[i],
				type = i ? "ray" : "segment";
			stx.plotLine(
				ray[0][0],
				ray[1][0],
				ray[0][1],
				ray[1][1],
				color,
				type,
				context,
				panel,
				parameters
			);
		}
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			var p2Fill = this.highlighted == "p2" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
			this.littleCircle(context, x2, y2, p2Fill);
		}
	};

	CIQ.Drawing.pitchfork.prototype.adjust = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.setPoint(1, this.d1, this.v1, panel.chart);
		this.setPoint(2, this.d2, this.v2, panel.chart);
	};

	/**
	 * Reconstruct a pitchfork
	 * @memberOf CIQ.Drawing.pitchfork
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The line color
	 * @param {string} [obj.pnl] The panel name
	 * @param {string} [obj.ptrn] Pattern for line "solid","dotted","dashed". Defaults to solid.
	 * @param {number} [obj.lw] Line width. Defaults to 1.
	 * @param {number} [obj.v0] Value (price) for the first point
	 * @param {number} [obj.v1] Value (price) for the second point
	 * @param {number} [obj.v2] Value (price) for the third point
	 * @param {number} [obj.d0] Date (string form) for the first point
	 * @param {number} [obj.d1] Date (string form) for the second point
	 * @param {number} [obj.d2] Date (string form) for the third point
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
	 * @param {number} [obj.tzo2] Offset of UTC from d2 in minutes
	 */
	CIQ.Drawing.pitchfork.prototype.reconstruct = function (stx, obj) {
		this.stx = stx;
		this.color = obj.col;
		this.panelName = obj.pnl;
		this.pattern = obj.ptrn;
		this.lineWidth = obj.lw;
		this.d0 = obj.d0;
		this.d1 = obj.d1;
		this.d2 = obj.d2;
		this.tzo0 = obj.tzo0;
		this.tzo1 = obj.tzo1;
		this.tzo2 = obj.tzo2;
		this.v0 = obj.v0;
		this.v1 = obj.v1;
		this.v2 = obj.v2;
		this.adjust();
	};

	CIQ.Drawing.pitchfork.prototype.serialize = function () {
		return {
			name: this.name,
			pnl: this.panelName,
			col: this.color,
			ptrn: this.pattern,
			lw: this.lineWidth,
			d0: this.d0,
			d1: this.d1,
			d2: this.d2,
			tzo0: this.tzo0,
			tzo1: this.tzo1,
			tzo2: this.tzo2,
			v0: this.v0,
			v1: this.v1,
			v2: this.v2
		};
	};

	/**
	 * Gartley drawing tool. Creates a series of four connected line segments, each one completed with a user click.
	 * Will adhere to Gartley requirements vis-a-vis fibonacci levels etc..
	 *
	 * It inherits its properties from {@link CIQ.Drawing.continuous}.
	 * @constructor
	 * @name  CIQ.Drawing.gartley
	 * @version ChartIQ Advanced Package
	 * @since 04-2015-15
	 */
	CIQ.Drawing.gartley = function () {
		this.name = "gartley";
		this.dragToDraw = false;
		this.maxSegments = 4;
		this.shape = null;
		this.points = [];
	};

	CIQ.inheritsFrom(CIQ.Drawing.gartley, CIQ.Drawing.continuous);

	CIQ.Drawing.gartley.prototype.check = function (first, second) {
		if (!second) return true;
		if (first[0] >= second[0] || first[1] == second[1]) return false;
		if (this.segment == 1) {
			if (first[1] < second[1]) this.shape = "M";
			else this.shape = "W";
		} else if (this.segment == 2) {
			if (this.shape == "M" && first[1] < second[1]) return false;
			else if (this.shape == "W" && first[1] > second[1]) return false;
			else if ((second[1] - first[1]) / (this.points[0][1] - first[1]) < 0.618)
				return false;
			else if ((second[1] - first[1]) / (this.points[0][1] - first[1]) >= 0.786)
				return false;
		} else if (this.segment == 3) {
			if (this.shape == "M" && first[1] > second[1]) return false;
			else if (this.shape == "W" && first[1] < second[1]) return false;
			else if ((second[1] - first[1]) / (this.points[1][1] - first[1]) < 0.618)
				return false;
			else if ((second[1] - first[1]) / (this.points[1][1] - first[1]) >= 0.786)
				return false;
		} else if (this.segment == 4) {
			if (
				this.shape == "M" &&
				(first[1] < second[1] || second[1] < this.points[0][1])
			)
				return false;
			else if (
				this.shape == "W" &&
				(first[1] > second[1] || second[1] > this.points[0][1])
			)
				return false;
			else if (
				(this.points[1][1] - second[1]) /
					(this.points[1][1] - this.points[2][1]) <
				1.27
			)
				return false;
			else if (
				(this.points[1][1] - second[1]) /
					(this.points[1][1] - this.points[2][1]) >=
				1.618
			)
				return false;
		}
		return true;
	};

	CIQ.Drawing.gartley.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.pts = [];
			this.penDown = true;
			this.segment = 1;
			return false;
		}
		if (this.accidentalClick(tick, value)) {
			this.penDown = true;
			return false;
		}
		if (this.check(this.p0, this.p1)) {
			if (this.segment == 1) this.points.push(this.p0);
			this.points.push(this.p1);
			this.setPoint(1, tick, value, panel.chart);
			this.segment++;

			if (this.segment > this.maxSegments) {
				this.setPoint(0, this.points[0][0], this.points[0][1], panel.chart);
				this.penDown = false;
				return true;
			}
			this.pts.push(this.d1, this.tzo1, this.v1);
			this.setPoint(0, tick, value, panel.chart); // reset initial point for next segment, copy by value
		}
		return false;
	};

	CIQ.Drawing.gartley.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

		if (this.segment == 2) {
			this.drawDropZone(
				context,
				0.618 * this.points[0][1] + 0.382 * this.p0[1],
				0.786 * this.points[0][1] + 0.214 * this.p0[1],
				this.p0[0]
			);
		} else if (this.segment == 3) {
			this.drawDropZone(
				context,
				0.618 * this.points[1][1] + 0.382 * this.p0[1],
				0.786 * this.points[1][1] + 0.214 * this.p0[1],
				this.p0[0]
			);
		} else if (this.segment == 4) {
			var bound = 1.618 * this.points[2][1] - 0.618 * this.points[1][1];
			if (this.shape == "M") bound = Math.max(bound, this.points[0][1]);
			else bound = Math.min(bound, this.points[0][1]);
			this.drawDropZone(
				context,
				bound,
				1.27 * this.points[2][1] - 0.27 * this.points[1][1],
				this.p0[0]
			);
		}

		var width = this.lineWidth;
		var color = this.getLineColor();

		var parameters = {
			pattern: this.pattern,
			lineWidth: width
		};
		if ((this.penDown || this.highlighted) && this.pattern == "none")
			parameters.pattern = "dotted";
		if (this.segment <= this.maxSegments)
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

		var fillColor = this.fillColor;
		var coords = [];
		if (this.points.length) {
			context.beginPath();
			for (var fp = 1; fp < this.points.length && fp <= 4; fp++) {
				var xx0 = this.stx.pixelFromTick(this.points[fp - 1][0], panel.chart);
				var xx1 = this.stx.pixelFromTick(this.points[fp][0], panel.chart);
				var yy0 = this.stx.pixelFromValueAdjusted(
					panel,
					this.points[fp - 1][0],
					this.points[fp - 1][1]
				);
				var yy1 = this.stx.pixelFromValueAdjusted(
					panel,
					this.points[fp][0],
					this.points[fp][1]
				);
				if (fp == 1) coords.push(xx0, yy0);
				coords.push(xx1, yy1);
				this.stx.plotLine(
					xx0,
					xx1,
					yy0,
					yy1,
					color,
					this.name,
					context,
					panel,
					parameters
				);
			}
			if (this.points.length == 2 || this.points.length == 4) {
				coords.push(x1, y1);
			}
			if (this.points[2]) {
				coords.push(
					this.stx.pixelFromTick(this.points[2][0], panel.chart),
					this.stx.pixelFromValueAdjusted(
						panel,
						this.points[2][0],
						this.points[2][1]
					)
				);
			}
			if (fillColor && fillColor != "auto" && !CIQ.isTransparent(fillColor)) {
				for (var c = 0; c < coords.length; c += 2) {
					if (c === 0) context.moveTo(coords[0], coords[1]);
					context.lineTo(coords[c], coords[c + 1]);
				}
				context.fillStyle = fillColor;
				context.globalAlpha = 0.2;
				context.closePath();
				context.fill();
				context.globalAlpha = 1;
			}
		}

		/*if(this.highlighted){
			var p0Fill=this.highlighted=="p0"?true:false;
			var p1Fill=this.highlighted=="p1"?true:false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		}*/
	};

	CIQ.Drawing.gartley.prototype.lineIntersection = function (
		tick,
		value,
		box,
		type
	) {
		var points = this.points,
			panel = this.stx.panels[this.panelName];
		if (points.length != this.maxSegments + 1 || !panel) return false;
		for (var pt = 0; pt < points.length - 1; pt++) {
			if (
				CIQ.Drawing.BaseTwoPoint.prototype.lineIntersection.call(
					this,
					tick,
					value,
					box,
					"segment",
					points[pt],
					points[pt + 1]
				)
			)
				return true;
		}
		return false;
	};

	CIQ.Drawing.gartley.prototype.boxIntersection = function (tick, value, box) {
		if (!this.p0 || !this.p1) return false;
		if (
			box.x0 > Math.max(this.p0[0], this.p1[0]) ||
			box.x1 < Math.min(this.p0[0], this.p1[0])
		)
			return false;
		var lowPoint = Math.min(this.p0[1], this.p1[1]);
		var highPoint = Math.max(this.p0[1], this.p1[1]);
		for (var pt = 0; pt < this.points.length; pt++) {
			lowPoint = Math.min(lowPoint, this.points[pt][1]);
			highPoint = Math.max(highPoint, this.points[pt][1]);
		}
		if (box.y1 > highPoint || box.y0 < lowPoint) return false;
		return true;
	};

	CIQ.Drawing.gartley.prototype.reposition = function (
		context,
		repositioner,
		tick,
		value
	) {
		if (!repositioner) return;
		var panel = this.stx.panels[this.panelName];
		var tickDiff = repositioner.tick - tick;
		repositioner.tick = tick;
		var valueDiff = repositioner.value - value;
		repositioner.value = value;
		if (repositioner.action == "move") {
			this.pts = [];
			for (var pt = 0; pt < this.points.length; pt++) {
				this.points[pt][0] -= tickDiff;
				this.points[pt][1] -= valueDiff;
				this.setPoint(1, this.points[pt][0], this.points[pt][1], panel.chart);
				if (pt && pt < this.points.length - 1)
					this.pts.push(this.d1, this.tzo1, this.v1);
				this.points[pt] = this.p1;
			}
			this.setPoint(0, this.points[0][0], this.points[0][1], panel.chart);
			this.render(context);
			/*}else if(repositioner.action=="drag"){
			this[repositioner.point]=[tick, value];
			this.setPoint(0, this.p0[0], this.p0[1], panel.chart);
			this.setPoint(1, this.p1[0], this.p1[1], panel.chart);
			this.render(context);*/
		}
	};

	CIQ.Drawing.gartley.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern"
	];

	CIQ.Drawing.gartley.prototype.adjust = function () {
		// If the drawing's panel doesn't exist then we'll check to see
		// whether the panel has been added. If not then there's no way to adjust
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.reconstructPoints();

		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.points.unshift(this.p0);

		this.setPoint(1, this.d1, this.v1, panel.chart);
		this.points.push(this.p1);
	};

	CIQ.Drawing.gartley.prototype.reconstructPoints = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.points = [];
		for (var a = 0; a < this.pts.length; a += 3) {
			var d = CIQ.strToDateTime(this.pts[a]);
			d.setMinutes(
				d.getMinutes() + Number(this.pts[a + 1]) - d.getTimezoneOffset()
			);
			this.points.push([
				this.stx.tickFromDate(CIQ.yyyymmddhhmmssmmm(d), panel.chart),
				this.pts[a + 2]
			]);
		}
	};

	/**
	 * Reconstruct a gartley
	 * @memberOf CIQ.Drawing.gartley
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The line color
	 * @param {string} [obj.fc] The fill color
	 * @param {string} [obj.pnl] The panel name
	 * @param {string} [obj.ptrn] Pattern for line "solid","dotted","dashed". Defaults to solid.
	 * @param {number} [obj.lw] Line width. Defaults to 1.
	 * @param {number} [obj.v0] Value (price) for the first point
	 * @param {number} [obj.v1] Value (price) for the last point
	 * @param {number} [obj.d0] Date (string form) for the first point
	 * @param {number} [obj.d1] Date (string form) for the last point
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
	 * @param {number} [obj.pts] a serialized list of dates,offsets,values for the 3 intermediate points of the gartley (should be 9 items in list)
	 */
	CIQ.Drawing.gartley.prototype.reconstruct = function (stx, obj) {
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
		this.pts = obj.pts.split(",");
		this.adjust();
	};

	CIQ.Drawing.gartley.prototype.serialize = function () {
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
			v1: this.v1,
			pts: this.pts.join(",")
		};
	};

	/**
	 * Freeform drawing tool. Set splineTension to a value from 0 to 1 (default .3). This is a dragToDraw function
	 * and automatically disables the crosshairs while enabled.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.segment}.
	 * @constructor
	 * @name  CIQ.Drawing.freeform
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.freeform = function () {
		this.name = "freeform";
		this.splineTension = 0.3; //set to -1 to not use splines at all
		this.dragToDraw = true;
	};

	CIQ.inheritsFrom(CIQ.Drawing.freeform, CIQ.Drawing.segment);

	CIQ.Drawing.freeform.prototype.measure = function () {};

	CIQ.Drawing.freeform.prototype.intersected = function (tick, value, box) {
		if (box.x0 > this.hiX || box.x1 < this.lowX) return null;
		if (box.y1 > this.hiY || box.y0 < this.lowY) return null;
		this.highlighted = true;
		// This object will be used for repositioning
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			tick: tick, // save original tick
			value: value // save original value
		};
	};

	CIQ.Drawing.freeform.prototype.reposition = function (
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
			this.adjust();
			this.render(context);
		}
	};

	CIQ.Drawing.freeform.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;

		if (this.penDown === false) {
			this.copyConfig();
			this.startX = Math.round(
				this.stx.resolveX(this.stx.pixelFromTick(tick, panel.chart))
			);
			this.startY = Math.round(
				this.stx.resolveY(this.stx.pixelFromValueAdjusted(panel, tick, value))
			);
			var d = this.stx.dateFromTick(tick, panel.chart, true);
			this.d0 = CIQ.yyyymmddhhmmssmmm(d);
			this.tzo0 = d.getTimezoneOffset();
			this.v0 = value;
			this.p0 = [
				CIQ.ChartEngine.crosshairX - this.startX,
				CIQ.ChartEngine.crosshairY - this.startY
			];
			this.nodes = [this.p0[0], this.p0[1]];
			this.pNodes = [this.p0];
			this.candleWidth = this.stx.layout.candleWidth;
			this.multiplier = panel.yAxis.multiplier;
			this.interval = this.stx.layout.interval;
			this.periodicity = this.stx.layout.periodicity;
			this.tempSplineTension = this.splineTension;
			this.splineTension = -1;
			document.body.style.cursor = "pointer";
			this.penDown = true;
			return false;
		}
		this.penDown = false;
		this.splineTension = this.tempSplineTension;
		document.body.style.cursor = "auto";
		return true;
	};

	CIQ.Drawing.freeform.prototype.move = function (context, tick, value) {
		if (!this.penDown) return;

		var panel = this.stx.panels[this.panelName];
		var d1 = this.stx.dateFromTick(tick, panel.chart, true);
		this.d1 = CIQ.yyyymmddhhmmssmmm(d1);
		this.tzo1 = d1.getTimezoneOffset();
		this.v1 = value;
		this.p1 = [
			CIQ.ChartEngine.crosshairX - this.startX,
			panel.yAxis.flipped
				? this.startY - CIQ.ChartEngine.crosshairY
				: CIQ.ChartEngine.crosshairY - this.startY
		];

		if (this.pNodes.length > 2) {
			if (
				this.p1[0] == this.pNodes[this.pNodes.length - 2][0] &&
				this.p1[0] == this.pNodes[this.pNodes.length - 1][0]
			) {
				this.pNodes.length--;
				this.nodes.length -= 2;
			} else if (
				this.p1[1] == this.pNodes[this.pNodes.length - 2][1] &&
				this.p1[1] == this.pNodes[this.pNodes.length - 1][1]
			) {
				this.pNodes.length--;
				this.nodes.length -= 2;
			}
		}

		this.nodes.push(this.p1[0], this.p1[1]);
		this.pNodes.push(this.p1);

		this.render(context);
		return false;
	};

	//This function does not compute exactly, it uses rough ratios to resize the drawing based on the interval.
	CIQ.Drawing.freeform.prototype.intervalRatio = function (
		oldInterval,
		newInterval,
		oldPeriodicity,
		newPeriodicity,
		startDate,
		symbol
	) {
		//approximating functions
		function weeksInMonth(startDate, symbol) {
			return 5;
		}
		function daysInWeek(startDate, symbol) {
			return 5;
		}
		function daysInMonth(startDate, symbol) {
			return 30;
		}
		function minPerDay(startDate, symbol) {
			if (CIQ.Market.Symbology.isForexSymbol(symbol)) return 1440;
			return 390;
		}
		//1,3,5,10,15,30,"day","week","month"
		var returnValue = 0;
		if (oldInterval == newInterval) returnValue = 1;
		else if (!isNaN(oldInterval) && !isNaN(newInterval))
			returnValue = oldInterval / newInterval;
		//two intraday intervals
		else if (isNaN(oldInterval)) {
			//was daily
			if (oldInterval == "month") {
				if (newInterval == "week")
					returnValue = weeksInMonth(startDate, symbol);
				else if (newInterval == "day")
					returnValue = daysInMonth(startDate, symbol);
				else if (!isNaN(newInterval))
					returnValue =
						(daysInMonth(startDate, symbol) * minPerDay(startDate, symbol)) /
						newInterval;
			} else if (oldInterval == "week") {
				if (newInterval == "month")
					returnValue = 1 / weeksInMonth(startDate, symbol);
				if (newInterval == "day") returnValue = daysInWeek(startDate, symbol);
				else if (!isNaN(newInterval))
					returnValue =
						(daysInWeek(startDate, symbol) * minPerDay(startDate, symbol)) /
						newInterval;
			} else if (oldInterval == "day") {
				if (newInterval == "week")
					returnValue = 1 / daysInWeek(startDate, symbol);
				else if (newInterval == "month")
					returnValue = 1 / daysInMonth(startDate, symbol);
				else if (!isNaN(newInterval))
					returnValue = minPerDay(startDate, symbol) / newInterval;
			}
		} else if (!isNaN(oldInterval)) {
			//switching from intraday to daily
			if (newInterval == "month")
				returnValue =
					oldInterval /
					(daysInMonth(startDate, symbol) * minPerDay(startDate, symbol));
			else if (newInterval == "week")
				returnValue =
					oldInterval /
					(daysInWeek(startDate, symbol) * minPerDay(startDate, symbol));
			else if (newInterval == "day")
				returnValue = oldInterval / minPerDay(startDate, symbol);
		}
		returnValue *= oldPeriodicity / newPeriodicity;
		return returnValue;
	};

	CIQ.Drawing.freeform.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;

		var intvl = this.intervalRatio(
			this.interval,
			this.stx.layout.interval,
			this.periodicity,
			this.stx.layout.periodicity,
			this.d0,
			panel.chart.symbol
		);
		if (intvl === 0) return;

		var cwr = this.stx.layout.candleWidth / this.candleWidth;
		var mlt = panel.yAxis.multiplier / this.multiplier;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		var spx = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var spy = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var arrPoints = [];

		var width = this.lineWidth;
		var color = this.getLineColor();

		var parameters = {
			pattern: this.pattern,
			lineWidth: width
		};

		for (var n = 0; n < this.pNodes.length; n++) {
			var x0 = intvl * cwr * this.pNodes[n][0] + spx;
			var y0 = mlt * this.pNodes[n][1];
			if (panel.yAxis.flipped) y0 = spy - y0;
			else y0 += spy;
			arrPoints.push(x0, y0);
		}

		if (!arrPoints.length) return;
		if (this.splineTension < 0) {
			this.stx.connectTheDots(
				arrPoints,
				color,
				this.name,
				context,
				panel,
				parameters
			);
		} else {
			this.stx.plotSpline(
				arrPoints,
				this.splineTension,
				color,
				this.name,
				context,
				true,
				parameters
			);
		}
	};

	CIQ.Drawing.freeform.prototype.adjust = function () {
		// If the drawing's panel doesn't exist then we'll check to see
		// whether the panel has been added. If not then there's no way to adjust
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;

		var p0 = [this.nodes[0], this.nodes[1]];
		this.pNodes = [p0];
		this.lowX = this.nodes[0];
		this.hiX = this.nodes[0];
		this.lowY = this.nodes[1];
		this.hiY = this.nodes[1];

		for (var n = 2; n < this.nodes.length; n += 2) {
			var p1 = [this.nodes[n], this.nodes[n + 1]];
			this.pNodes.push(p1);
			this.lowX = Math.min(this.lowX, p1[0]);
			this.hiX = Math.max(this.hiX, p1[0]);
			this.lowY = Math.max(this.lowY, p1[1]); //reversed because price axis goes bottom to top
			this.hiY = Math.min(this.hiY, p1[1]);
		}

		var intvl = this.intervalRatio(
			this.interval,
			this.stx.layout.interval,
			this.periodicity,
			this.stx.layout.periodicity,
			this.d0,
			panel.chart.symbol
		);
		if (intvl === 0) return;

		var cwr = this.stx.layout.candleWidth / this.candleWidth;
		var mlt = panel.yAxis.multiplier / this.multiplier;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		var spx = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var spy = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);

		this.lowX = this.stx.tickFromPixel(
			Math.floor(intvl * cwr * this.lowX) + spx,
			panel.chart
		);
		this.hiX = this.stx.tickFromPixel(
			Math.ceil(intvl * cwr * this.hiX) + spx,
			panel.chart
		);
		if (panel.yAxis.flipped) {
			this.lowY = this.stx.valueFromPixel(
				spy - Math.floor(mlt * this.lowY),
				panel
			);
			this.hiY = this.stx.valueFromPixel(
				spy - Math.ceil(mlt * this.hiY),
				panel
			);
		} else {
			this.lowY = this.stx.valueFromPixel(
				Math.floor(mlt * this.lowY) + spy,
				panel
			);
			this.hiY = this.stx.valueFromPixel(
				Math.ceil(mlt * this.hiY) + spy,
				panel
			);
		}
	};

	CIQ.Drawing.freeform.prototype.serialize = function () {
		return {
			name: this.name,
			pnl: this.panelName,
			col: this.color,
			ptrn: this.pattern,
			lw: this.lineWidth,
			cw: Number(this.candleWidth.toFixed(4)),
			mlt: Number(this.multiplier.toFixed(4)),
			d0: this.d0,
			tzo0: this.tzo0,
			v0: this.v0,
			inter: this.interval,
			pd: this.periodicity,
			nodes: this.nodes
		};
	};

	/**
	 * Reconstruct a freeform drawing. It is not recommended to do this programmatically.
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The line color
	 * @param {string} [obj.pnl] The panel name
	 * @param {string} [obj.ptrn] Pattern for line "solid","dotted","dashed". Defaults to solid.
	 * @param {number} [obj.lw] Line width. Defaults to 1.
	 * @param {number} [obj.cw] Candle width from original drawing
	 * @param {number} [obj.mlt] Y-axis multiplier from original drawing
	 * @param {number} [obj.v0] Value (price) for the first point
	 * @param {number} [obj.d0] Date (string form) for the first point
	 * @param {number} [obj.int] Interval from original drawing
	 * @param {number} [obj.pd] Periodicity from original drawing
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {array} [obj.nodes] An array of nodes in form [x0a,x0b,y0a,y0b, x1a, x1b, y1a, y1b, ....]
	 * @memberOf CIQ.Drawing.freeform
	 */
	CIQ.Drawing.freeform.prototype.reconstruct = function (stx, obj) {
		this.stx = stx;
		this.color = obj.col;
		this.panelName = obj.pnl;
		this.pattern = obj.ptrn;
		this.lineWidth = obj.lw;
		this.candleWidth = obj.cw;
		this.multiplier = obj.mlt;
		this.d0 = obj.d0;
		this.tzo0 = obj.tzo0;
		this.v0 = obj.v0;
		this.interval = obj.inter;
		this.periodicity = obj.pd;
		this.nodes = obj.nodes;
		this.adjust();
	};

	/**
	 * Callout drawing tool.  This is like an annotation except it draws a stem and offers a background color and line style.
	 *
	 * @constructor
	 * @name  CIQ.Drawing.callout
	 * @since 2015-11-1
	 * @version ChartIQ Advanced Package
	 * @see {@link CIQ.Drawing.annotation}
	 */
	CIQ.Drawing.callout = function () {
		this.name = "callout";
		this.arr = [];
		this.w = 0;
		this.h = 0;
		this.padding = 4;
		this.text = "";
		this.ta = null;
		this.fontSize = 0;
		this.font = {};
		this.stemEntry = "";
		this.defaultWidth = 50;
		this.defaultHeight = 10;
		//this.dragToDraw=true;
	};

	CIQ.inheritsFrom(CIQ.Drawing.callout, CIQ.Drawing.annotation);

	CIQ.Drawing.callout.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern",
		"font"
	];

	CIQ.Drawing.callout.prototype.copyConfig = function (withPreferences) {
		CIQ.Drawing.copyConfig(this, withPreferences);
		this.borderColor = this.color;
	};

	CIQ.Drawing.callout.prototype.move = function (context, tick, value) {
		if (!this.penDown) return;

		this.copyConfig();
		this.p0 = [tick, value];
		this.render(context);
	};

	CIQ.Drawing.callout.prototype.onChange = function (e) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var textarea = e.target;
		this.w = textarea.clientWidth;
		this.h = textarea.clientHeight;
		//textarea.style.left=(this.stx.pixelFromTick(this.p0[0])-this.w/2) + "px";
		//textarea.style.top=(this.stx.pixelFromPrice(this.p0[1],panel)-this.h/2) + "px";
		var context = this.context || this.stx.chart.tempCanvas.context;
		CIQ.clearCanvas(context.canvas, this.stx);
		this.render(context);
		this.edit(context);
	};

	CIQ.Drawing.callout.prototype.render = function (context) {
		this.context = context; // remember last context
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		if (isNaN(y0)) return;

		context.font = this.fontString;
		context.textBaseline = "top";
		var x = x0;
		var y = y0;
		var w = this.w / 2;
		var h = this.h / 2;
		if (this.penDown) {
			w = this.defaultWidth;
			h = this.defaultHeight;
			if (!h) h = this.fontSize;
		}
		var lineWidth = this.lineWidth;
		if (!lineWidth) lineWidth = 1.1;
		var color = this.color;
		if (color == "auto" || CIQ.isTransparent(color))
			color = this.stx.defaultColor;
		var borderColor = this.borderColor;
		if (borderColor == "auto" || CIQ.isTransparent(borderColor))
			borderColor = this.stx.defaultColor;
		if (this.highlighted)
			borderColor = this.stx.getCanvasColor("stx_highlight_vector");
		var sx0, sx1, sy0, sy1;
		var r = Math.min(Math.min(w, h) / 2, 8);
		if (this.stem) {
			if (this.stem.t) {
				// absolute positioning of stem
				sx0 = this.stx.pixelFromTick(this.stem.t); // bottom of stem
				sy0 = this.stx.pixelFromValueAdjusted(panel, this.stem.t, this.stem.v);
			} else if (this.stem.x) {
				// stem with relative offset positioning
				sx0 = x;
				sy0 = y;
				x += this.stem.x;
				y += this.stem.y;
			}

			var state = "";
			if (sx0 >= x + w) {
				sx1 = x + w;
				state = "r";
			} // right of text
			else if (sx0 > x - w && sx0 < x + w) {
				sx1 = x;
				state = "c";
			} // center of text
			else if (sx0 <= x - w) {
				sx1 = x - w;
				state = "l";
			} // left of text

			if (sy0 >= y + h) {
				sy1 = y + h;
				state += "b";
			} // bottom of text
			else if (sy0 > y - h && sy0 < y + h) {
				sy1 = y;
				state += "m";
			} // middle of text
			else if (sy0 <= y - h) {
				sy1 = y - h;
				state += "t";
			} // top of text

			this.stemEntry = state;

			if (state != "cm") {
				// make sure stem does not originate underneath the annotation
				sx0 = Math.round(sx0);
				sx1 = Math.round(sx1);
				sy0 = Math.round(sy0);
				sy1 = Math.round(sy1);
			}
		}
		if (this.highlighted) {
			this.stx.canvasColor("stx_annotation_highlight_bg", context);
		} else {
			if (this.fillColor) {
				context.fillStyle = this.fillColor;
				context.globalAlpha = 0.4;
			} else if (this.stem) {
				// If there's a stem then use the container color otherwise the stem will show through
				context.fillStyle = this.stx.containerColor;
			}
		}
		context.strokeStyle = borderColor;
		if (context.setLineDash) {
			context.setLineDash(CIQ.borderPatternToArray(lineWidth, this.pattern));
			context.lineDashOffset = 0; //start point in array
		}

		if (borderColor) {
			context.beginPath();
			context.lineWidth = lineWidth;
			context.moveTo(x + w - r, y - h);
			if (this.stemEntry != "rt") {
				context.quadraticCurveTo(x + w, y - h, x + w, y - h + r); //top right
			} else {
				context.lineTo(sx0, sy0);
				context.lineTo(x + w, y - h + r);
			}
			context.lineTo(x + w, y - r / 2);
			if (this.stemEntry == "rm") context.lineTo(sx0, sy0);
			context.lineTo(x + w, y + r / 2);
			context.lineTo(x + w, y + h - r);
			if (this.stemEntry != "rb") {
				context.quadraticCurveTo(x + w, y + h, x + w - r, y + h); //bottom right
			} else {
				context.lineTo(sx0, sy0);
				context.lineTo(x + w - r, y + h);
			}
			context.lineTo(x + r / 2, y + h);
			if (this.stemEntry == "cb") context.lineTo(sx0, sy0);
			context.lineTo(x - r / 2, y + h);
			context.lineTo(x - w + r, y + h);
			if (this.stemEntry != "lb") {
				context.quadraticCurveTo(x - w, y + h, x - w, y + h - r); //bottom left
			} else {
				context.lineTo(sx0, sy0);
				context.lineTo(x - w, y + h - r);
			}
			context.lineTo(x - w, y + r / 2);
			if (this.stemEntry == "lm") context.lineTo(sx0, sy0);
			context.lineTo(x - w, y - r / 2);
			context.lineTo(x - w, y - h + r);
			if (this.stemEntry != "lt") {
				context.quadraticCurveTo(x - w, y - h, x - w + r, y - h); //top left
			} else {
				context.lineTo(sx0, sy0);
				context.lineTo(x - w + r, y - h);
			}
			context.lineTo(x - r / 2, y - h);
			if (this.stemEntry == "ct") context.lineTo(sx0, sy0);
			context.lineTo(x + r / 2, y - h);
			context.lineTo(x + w - r, y - h);
			context.fill();
			context.globalAlpha = 1;
			if (this.pattern != "none") context.stroke();
		}
		if (this.highlighted) {
			this.stx.canvasColor("stx_annotation_highlight", context);
		} else {
			context.fillStyle = color;
		}
		y += this.padding;
		if (!this.ta) {
			for (var i = 0; i < this.arr.length; i++) {
				context.fillText(this.arr[i], x - w + this.padding, y - h);
				y += this.fontSize;
			}
		}
		context.textBaseline = "alphabetic";

		if (this.highlighted && !this.noHandles) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			this.littleCircle(context, sx0, sy0, p0Fill);
		}
		/*if(this.penDown){
			context.globalAlpha=0.2;
			context.fillText("[Your text here]", x-w+this.padding, y-h);
			context.globalAlpha=1;
		}*/
	};

	CIQ.Drawing.callout.prototype.click = function (context, tick, value) {
		//don't allow user to add callout on the axis.
		if (this.stx.overXAxis || this.stx.overYAxis) return;
		var panel = this.stx.panels[this.panelName];
		this.copyConfig();
		//this.getFontString();
		this.setPoint(0, tick, value, panel.chart);
		if (!this.penDown) {
			this.stem = {
				d: this.d0,
				v: this.v0
			};
			this.penDown = true;
			this.adjust();
			return false;
		}
		this.adjust();
		this.edit(context);
		this.penDown = false;
		return false;
	};

	CIQ.Drawing.callout.prototype.reposition = function (
		context,
		repositioner,
		tick,
		value
	) {
		if (!repositioner) return;
		var panel = this.stx.panels[this.panelName];
		var tickDiff = repositioner.tick - tick;
		var valueDiff = repositioner.value - value;
		if (repositioner.stem) {
			if (repositioner.action == "drag") {
				this.stem = {
					d: this.stx.dateFromTick(tick, panel.chart, true),
					v: value
				};
			} else if (repositioner.action == "move") {
				this.setPoint(
					0,
					repositioner.p0[0] - tickDiff,
					repositioner.p0[1] - valueDiff,
					panel.chart
				);
				this.stem = {
					d: this.stx.dateFromTick(
						this.stx.tickFromDate(repositioner.stem.d, panel.chart) - tickDiff
					),
					v: repositioner.stem.v - valueDiff
				};
			}
			this.adjust();
		} else {
			this.setPoint(
				0,
				repositioner.p0[0] - tickDiff,
				repositioner.p0[1] - valueDiff,
				panel.chart
			);
		}
		this.render(context);
	};

	CIQ.Drawing.callout.prototype.lineIntersection = function (
		tick,
		value,
		box,
		type
	) {
		var panel = this.stx.panels[this.panelName];
		var stem = this.stem,
			p0 = this.p0,
			stx = this.stx;
		if (!p0 || !stem || !panel) return false;
		var stemTick = stem.t || this.stx.tickFromDate(stem.d, panel.chart);
		var pObj = { x0: p0[0], x1: stemTick, y0: p0[1], y1: stem.v };
		var pixelPoint = CIQ.convertBoxToPixels(stx, this.panelName, pObj);
		var x0 = pixelPoint.x0;
		var y0 = pixelPoint.y0;
		var x1 = pixelPoint.x1;
		var y1 = pixelPoint.y1;
		if (typeof this.stemEntry == "string") {
			if (this.stemEntry.indexOf("l") > -1) x0 -= this.w / 2;
			else if (this.stemEntry.indexOf("r") > -1) x0 += this.w / 2;
			if (this.stemEntry.indexOf("t") > -1) y0 -= this.h / 2;
			else if (this.stemEntry.indexOf("b") > -1) y0 += this.h / 2;
		}
		var pixelBox = CIQ.convertBoxToPixels(stx, this.panelName, box);
		return CIQ.boxIntersects(
			pixelBox.x0,
			pixelBox.y0,
			pixelBox.x1,
			pixelBox.y1,
			x0,
			y0,
			x1,
			y1,
			type
		);
	};

	CIQ.Drawing.callout.prototype.intersected = function (tick, value, box) {
		var panel = this.stx.panels[this.panelName];
		if (!this.p0) return null; // in case invalid drawing (such as from panel that no longer exists)
		if (this.pointIntersection(this.stem.t, this.stem.v, box)) {
			this.highlighted = "p0";
			return {
				action: "drag",
				stem: true
			};
		}
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart) - this.w / 2;
		var y0 =
			this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]) -
			this.h / 2;
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
		var isIntersected = this.lineIntersection(tick, value, box, "segment");
		if (isIntersected) {
			this.highlighted = true;
			// This object will be used for repositioning
			return {
				action: "move",
				stem: CIQ.clone(this.stem),
				p0: CIQ.clone(this.p0),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		return null;
	};

	/**
	 * Fibonacci drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.BaseTwoPoint}
	 * @constructor
	 * @name  CIQ.Drawing.fibonacci
	 */
	CIQ.Drawing.fibonacci = function () {
		this.name = "fibonacci";
		this.configurator = "fibonacci";
	};

	CIQ.inheritsFrom(CIQ.Drawing.fibonacci, CIQ.Drawing.BaseTwoPoint);

	CIQ.Drawing.fibonacci.mapping = {
		trend: "t",
		color: "c",
		parameters: "p",
		pattern: "pt",
		opacity: "o",
		lineWidth: "lw",
		level: "l",
		extendLeft: "e",
		printLevels: "pl",
		printValues: "pv",
		timezone: "tz",
		display: "d"
	};

	/**
	 * Levels to enable by default.
	 * @memberOf CIQ.Drawing.fibonacci
	 * @default
	 * @since 5.2.0
	 */
	CIQ.Drawing.fibonacci.prototype.recommendedLevels = [
		-0.618,
		-0.382,
		0,
		0.382,
		0.5,
		0.618,
		1,
		1.382,
		1.618
	];

	CIQ.Drawing.fibonacci.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern",
		"parameters"
	];

	/**
	 * Set the default fib settings for the type of fib tool selected.  References {@link CIQ.Drawing.fibonacci#recommendedLevels}.
	 * @param {CIQ.ChartEngine} stx Chart object
	 * @memberOf CIQ.Drawing.fibonacci
	 * @since 5.2.0
	 */
	CIQ.Drawing.fibonacci.prototype.initializeSettings = function (stx) {
		var recommendedLevels = this.recommendedLevels;
		if (
			recommendedLevels &&
			!stx.currentVectorParameters.fibonacci.fibsAlreadySet
		) {
			var fibs = stx.currentVectorParameters.fibonacci.fibs;
			for (var index = 0; index < fibs.length; index++) {
				delete fibs[index].display;
				for (var rIndex = 0; rIndex < recommendedLevels.length; rIndex++) {
					if (fibs[index].level == recommendedLevels[rIndex])
						fibs[index].display = true;
				}
			}
		}
	};

	/*
	 * Calculate the outer points of the fib series, which are used to detect highlighting
	 */
	CIQ.Drawing.fibonacci.prototype.setOuter = function () {
		var stx = this.stx,
			panel = stx.panels[this.panelName];
		if (!panel) return;
		var max = Math.max(this.p0[1], this.p1[1]);
		var min = Math.min(this.p0[1], this.p1[1]);
		var dist = max - min;

		this.outer = {
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1)
		};
		var y0 = stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var x0 = stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = stx.pixelFromTick(this.p1[0], panel.chart);

		var minFib = 0;
		var maxFib = 1;
		for (var i = 0; i < this.parameters.fibs.length; i++) {
			var fib = this.parameters.fibs[i];
			if ((fib.level >= minFib && fib.level <= maxFib) || !fib.display)
				continue;
			var y = stx.pixelFromValueAdjusted(
				panel,
				this.p0[0],
				y1 < y0 ? max - dist * fib.level : min + dist * fib.level
			);
			var x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, y);
			if (fib.level < minFib) {
				minFib = fib.level;
				this.outer.p1[1] = stx.valueFromPixel(y, panel);
				this.outer.p1[0] = stx.tickFromPixel(x, panel.chart);
			} else if (fib.level > maxFib) {
				maxFib = fib.level;
				this.outer.p0[1] = stx.valueFromPixel(y, panel);
				this.outer.p0[0] = stx.tickFromPixel(x, panel.chart);
			}
		}
	};

	CIQ.Drawing.fibonacci.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.penDown = true;
			return false;
		}
		if (this.accidentalClick(tick, value)) return this.dragToDraw;

		this.setPoint(1, tick, value, panel.chart);
		this.setOuter();
		this.parameters = CIQ.clone(this.parameters); // separate from the global object
		this.penDown = false;

		return true; // kernel will call render after this
	};

	CIQ.Drawing.fibonacci.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var yAxis = panel.yAxis;
		if (!this.p1) return;
		var max = Math.max(this.p0[1], this.p1[1]);
		var min = Math.min(this.p0[1], this.p1[1]);
		var dist = yAxis.flipped ? min - max : max - min;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var top = Math.min(y1, y0);
		var bottom = Math.max(y1, y0);
		var height = bottom - top;
		var isUpTrend = (y1 - y0) / (x1 - x0) > 0;

		//old drawings missing parameters.trend
		var trend = {
			color: "auto",
			parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
		};
		if (!this.parameters.trend) this.parameters.trend = trend;
		var trendLineColor = this.getLineColor(this.parameters.trend.color);
		context.textBaseline = "middle";
		this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
		var w = context.measureText("161.8%").width + 10; // give it extra space so it does not overlap with the price labels.
		var minX = Number.MAX_VALUE,
			minY = Number.MAX_VALUE,
			maxX = Number.MAX_VALUE * -1,
			maxY = Number.MAX_VALUE * -1;
		var txtColor = this.color;
		if (txtColor == "auto" || CIQ.isTransparent(txtColor))
			txtColor = this.stx.defaultColor;
		this.rays = [];
		for (var i = 0; i < this.parameters.fibs.length; i++) {
			context.textAlign = "left";
			context.fillStyle = txtColor;
			var fib = this.parameters.fibs[i];
			if (!fib.display) continue;
			var y = this.stx.pixelFromValueAdjusted(
				panel,
				this.p0[0],
				y1 < y0 ? max - dist * fib.level : min + dist * fib.level
			);
			var x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, y);
			var nearX = this.parameters.extendLeft ? 0 : x;
			var farX = panel.left + panel.width;
			if (this.parameters.printLevels) {
				var txt = Math.round(fib.level * 1000) / 10 + "%";
				farX -= w;
				if (this.parameters.printValues) {
					context.fillStyle = txtColor; // the price labels screw up the color and font size...so reset before rendering the text
					this.stx.canvasFont("stx_yaxis", context); // use the same context as the y axis so they match.
				}
				if (farX < nearX) context.textAlign = "right";
				context.fillText(txt, farX, y);
				if (farX < nearX) farX += 5;
				else farX -= 5;
			}
			if (this.parameters.printValues) {
				if (x < panel.width) {
					// just use the actual price that segment will render on regardless of 'isUpTrend' since the values must match the prices on the y axis, and can not be reversed.
					var price = this.stx.transformedPriceFromPixel(y, panel);
					if (yAxis.priceFormatter) {
						price = yAxis.priceFormatter(this.stx, panel, price);
					} else {
						price = this.stx.formatYAxisPrice(price, panel);
					}
					if (context == this.stx.chart.context) this.stx.endClip();
					this.stx.createYAxisLabel(panel, price, y, txtColor, null, context);
					if (context == this.stx.chart.context) this.stx.startClip(panel.name);
				}
			}
			var fibColor = fib.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.stx.defaultColor;
			var fillColor = fib.color;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.fillColor;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.stx.defaultColor;
			context.fillStyle = fillColor;
			var fibParameters = CIQ.clone(fib.parameters);
			if (this.highlighted) fibParameters.opacity = 1;
			this.stx.plotLine(
				nearX,
				farX,
				y,
				y,
				this.highlighted ? trendLineColor : fibColor,
				"segment",
				context,
				panel,
				fibParameters
			);
			this.rays.push([
				[nearX, y],
				[farX, y]
			]);
			context.globalAlpha = 0.05;
			context.beginPath();
			context.moveTo(farX, y);
			context.lineTo(nearX, y);
			if (nearX) context.lineTo(x1, y1);
			else context.lineTo(nearX, y1);
			context.lineTo(farX, y1);
			if (typeof fillColor != "undefined") context.fill(); // so legacy fibs continue to have no fill color.
			context.globalAlpha = 1;
			if (y < minY) {
				minX = x;
				minY = y;
			}
			if (y > maxY) {
				maxX = x;
				maxY = y;
			}
		}
		// ensure we at least draw trend line from zero to 100
		for (var level = 0; level <= 1; level++) {
			var yy = isUpTrend ? bottom - height * level : top + height * level;
			yy = Math.round(yy);
			if (yy < minY) {
				minX = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, yy);
				minY = yy;
			}
			if (yy > maxY) {
				maxX = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, yy);
				maxY = yy;
			}
		}
		var trendParameters = CIQ.clone(this.parameters.trend.parameters);
		if (this.highlighted) trendParameters.opacity = 1;
		this.stx.plotLine(
			minX,
			maxX,
			minY,
			maxY,
			trendLineColor,
			"segment",
			context,
			panel,
			trendParameters
		);
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		}
	};

	CIQ.Drawing.fibonacci.prototype.reposition = function (
		context,
		repositioner,
		tick,
		value
	) {
		if (!repositioner) return;
		CIQ.Drawing.BaseTwoPoint.prototype.reposition.apply(this, arguments);
		this.adjust();
	};

	CIQ.Drawing.fibonacci.prototype.intersected = function (tick, value, box) {
		var p0 = this.p0,
			p1 = this.p1;
		if (!p0 || !p1) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: p0, 1: p1 };
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
		var outer = this.outer,
			rays = this.rays;
		var isIntersected =
			outer &&
			this.lineIntersection(tick, value, box, "segment", outer.p0, outer.p1);
		if (!isIntersected) {
			for (var i = 0; i < rays.length; i++) {
				if (
					this.lineIntersection(
						tick,
						value,
						box,
						"ray",
						rays[i][0],
						rays[i][1],
						true
					)
				) {
					isIntersected = true;
					break;
				}
			}
		}
		if (isIntersected) {
			this.highlighted = true;
			// This object will be used for repositioning
			return {
				action: "move",
				p0: CIQ.clone(p0),
				p1: CIQ.clone(p1),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		return null;
	};

	/**
	 * Reconstruct a fibonacci
	 * @param  {CIQ.ChartEngine} stx The chart object
	 * @param  {object} [obj] A drawing descriptor
	 * @param {string} [obj.col] The border color
	 * @param {string} [obj.fc] The fill color
	 * @param {string} [obj.pnl] The panel name
	 * @param {number} [obj.v0] Value (price) for the first point
	 * @param {number} [obj.v1] Value (price) for the second point
	 * @param {number} [obj.v2] Value (price) for the third point (if used)
	 * @param {number} [obj.d0] Date (string form) for the first point
	 * @param {number} [obj.d1] Date (string form) for the second point
	 * @param {number} [obj.d2] Date (string form) for the third point (if used)
	 * @param {number} [obj.tzo0] Offset of UTC from d0 in minutes
	 * @param {number} [obj.tzo1] Offset of UTC from d1 in minutes
	 * @param {number} [obj.tzo2] Offset of UTC from d2 in minutes (if used)
	 * @param {object} [obj.parameters] Configuration parameters
	 * @param {object} [obj.parameters.trend] Describes the trend line
	 * @param {string} [obj.parameters.trend.color] The color for the trend line (Defaults to "auto")
	 * @param {object} [obj.parameters.trend.parameters] Line description object (pattern, opacity, lineWidth)
	 * @param {array} [obj.parameters.fibs] A fib description object for each fib (level, color, parameters, display)
	 * @param {boolean} [obj.parameters.extendLeft] True to extend the fib lines to the left of the screen. Defaults to false.
	 * @param {boolean} [obj.parameters.printLevels] True (default) to print text for each percentage level
	 * @param {boolean} [obj.parameters.printValues] True to print text for each price level
	 * @memberOf CIQ.Drawing.fibonacci
	 */
	CIQ.Drawing.fibonacci.prototype.reconstruct = function (stx, obj) {
		obj = CIQ.replaceFields(
			obj,
			CIQ.reverseObject(CIQ.Drawing.fibonacci.mapping)
		);
		this.stx = stx;
		this.parameters = obj.parameters;
		if (!this.parameters)
			this.parameters = CIQ.clone(this.stx.currentVectorParameters.fibonacci); // For legacy fibs that didn't include parameters
		this.color = obj.col;
		this.fillColor = obj.fc;
		this.panelName = obj.pnl;
		this.d0 = obj.d0;
		this.d1 = obj.d1;
		this.d2 = obj.d2;
		this.tzo0 = obj.tzo0;
		this.tzo1 = obj.tzo1;
		this.tzo2 = obj.tzo2;
		this.v0 = obj.v0;
		this.v1 = obj.v1;
		this.v2 = obj.v2;
		this.adjust();
	};

	CIQ.Drawing.fibonacci.prototype.adjust = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.setPoint(1, this.d1, this.v1, panel.chart);
		this.setOuter();
	};

	CIQ.Drawing.fibonacci.prototype.serialize = function () {
		var obj = {
			name: this.name,
			parameters: this.parameters,
			pnl: this.panelName,
			col: this.color,
			fc: this.fillColor,
			d0: this.d0,
			d1: this.d1,
			d2: this.d2,
			tzo0: this.tzo0,
			tzo1: this.tzo1,
			tzo2: this.tzo2,
			v0: this.v0,
			v1: this.v1,
			v2: this.v2
		};
		return CIQ.replaceFields(obj, CIQ.Drawing.fibonacci.mapping);
	};

	/**
	 * Retracement drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.fibonacci}
	 * @constructor
	 * @name  CIQ.Drawing.retracement
	 */
	CIQ.Drawing.retracement = function () {
		this.name = "retracement";
	};

	CIQ.inheritsFrom(CIQ.Drawing.retracement, CIQ.Drawing.fibonacci);

	/**
	 * Fibonacci projection drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.fibonacci}
	 * @constructor
	 * @name  CIQ.Drawing.fibprojection
	 * @version ChartIQ Advanced Package
	 * @since 5.2.0
	 */
	CIQ.Drawing.fibprojection = function () {
		this.name = "fibprojection";
		this.dragToDraw = false;
		this.p2 = null;
	};

	CIQ.inheritsFrom(CIQ.Drawing.fibprojection, CIQ.Drawing.fibonacci);

	CIQ.Drawing.fibprojection.prototype.recommendedLevels = [
		0,
		0.618,
		1,
		1.272,
		1.618,
		2.618,
		4.236
	];

	CIQ.Drawing.fibprojection.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.penDown = true;
			return false;
		}
		if (this.accidentalClick(tick, value)) {
			this.stx.undo(); //abort
			return true;
		}

		if (this.p2 !== null) {
			this.setPoint(2, this.p2[0], this.p2[1], panel.chart);
			this.parameters = CIQ.clone(this.parameters); // separate from the global object
			return true;
		}
		this.setPoint(1, tick, value, panel.chart);

		this.p2 = [this.p1[0], this.p1[1]];
		return false; // kernel will call render after this
	};

	CIQ.Drawing.fibprojection.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var yAxis = panel.yAxis;
		if (!this.p1) return;
		var dist = this.p1[1] - this.p0[1];
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var x2 = null,
			y2 = null;
		if (this.p2) {
			x2 = this.stx.pixelFromTick(this.p2[0], panel.chart);
			y2 = this.stx.pixelFromValueAdjusted(panel, this.p2[0], this.p2[1]);
		}
		//old drawings missing parameters.trend
		var trend = {
			color: "auto",
			parameters: { pattern: "solid", opacity: 0.25, lineWidth: 1 }
		};
		if (!this.parameters.trend) this.parameters.trend = trend;
		var trendLineColor = this.getLineColor(this.parameters.trend.color);
		context.textBaseline = "middle";
		this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
		var w = context.measureText("161.8%").width + 10; // give it extra space so it does not overlap with the price labels.
		var txtColor = this.color;
		if (txtColor == "auto" || CIQ.isTransparent(txtColor))
			txtColor = this.stx.defaultColor;
		if (this.p2) {
			this.rays = [];
			for (var i = 0; i < this.parameters.fibs.length; i++) {
				context.textAlign = "left";
				context.fillStyle = txtColor;
				var fib = this.parameters.fibs[i];
				if (!fib.display) continue;
				var y = this.stx.pixelFromValueAdjusted(
					panel,
					this.p2[0],
					this.p2[1] + dist * fib.level
				);
				var x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, y);
				var nearX = this.parameters.extendLeft ? 0 : x0;
				var farX = panel.left + panel.width;
				if (this.parameters.printLevels) {
					var txt = Math.round(fib.level * 1000) / 10 + "%";
					farX -= w;
					if (this.parameters.printValues) {
						context.fillStyle = txtColor; // the price labels screw up the color and font size...so reset before rendering the text
						this.stx.canvasFont("stx_yaxis", context); // use the same context as the y axis so they match.
					}
					if (farX < nearX) context.textAlign = "right";
					context.fillText(txt, farX, y);
					if (farX < nearX) farX += 5;
					else farX -= 5;
				}
				if (this.parameters.printValues) {
					if (x < panel.width) {
						// just use the actual price that segment will render on regardless of 'isUpTrend' since the values must match the prices on the y axis, and can not be reversed.
						var price = this.stx.transformedPriceFromPixel(y, panel);
						if (yAxis.priceFormatter) {
							price = yAxis.priceFormatter(this.stx, panel, price);
						} else {
							price = this.stx.formatYAxisPrice(price, panel);
						}
						if (context == this.stx.chart.context) this.stx.endClip();
						this.stx.createYAxisLabel(panel, price, y, txtColor, null, context);
						if (context == this.stx.chart.context)
							this.stx.startClip(panel.name);
					}
				}
				var fibColor = fib.color;
				if (fibColor == "auto" || CIQ.isTransparent(fibColor))
					fibColor = this.color;
				if (fibColor == "auto" || CIQ.isTransparent(fibColor))
					fibColor = this.stx.defaultColor;
				var fillColor = fib.color;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.stx.defaultColor;
				context.fillStyle = fillColor;
				var fibParameters = CIQ.clone(fib.parameters);
				if (this.highlighted) fibParameters.opacity = 1;
				this.stx.plotLine(
					nearX,
					farX,
					y,
					y,
					this.highlighted ? trendLineColor : fibColor,
					"segment",
					context,
					panel,
					fibParameters
				);
				this.rays.push([
					[nearX, y],
					[farX, y]
				]);
				context.globalAlpha = 0.05;
				context.beginPath();
				context.moveTo(farX, y);
				context.lineTo(nearX, y);
				if (nearX) context.lineTo(x0, y2);
				else context.lineTo(nearX, y2);
				context.lineTo(farX, y2);
				if (typeof fillColor != "undefined") context.fill(); // so legacy fibs continue to have no fill color.
				context.globalAlpha = 1;
			}
		}
		var trendParameters = CIQ.clone(this.parameters.trend.parameters);
		if (this.highlighted) trendParameters.opacity = 1;
		this.stx.plotLine(
			x0,
			x1,
			y0,
			y1,
			trendLineColor,
			"segment",
			context,
			panel,
			trendParameters
		);
		if (this.p2)
			this.stx.plotLine(
				x1,
				x2,
				y1,
				y2,
				trendLineColor,
				"segment",
				context,
				panel,
				trendParameters
			);
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			var p2Fill = this.highlighted == "p2" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
			this.littleCircle(context, x2, y2, p2Fill);
		}
	};

	CIQ.Drawing.fibprojection.prototype.move = function (context, tick, value) {
		if (!this.penDown) return;
		this.copyConfig();
		if (this.p2 === null) this.p1 = [tick, value];
		else this.p2 = [tick, value];
		this.render(context);
	};

	CIQ.Drawing.fibprojection.prototype.reposition = function (
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
			this.setPoint(
				2,
				repositioner.p2[0] - tickDiff,
				repositioner.p2[1] - valueDiff,
				panel.chart
			);
			this.render(context);
		} else if (repositioner.action == "drag") {
			this[repositioner.point] = [tick, value];
			this.setPoint(0, this.p0[0], this.p0[1], panel.chart);
			this.setPoint(1, this.p1[0], this.p1[1], panel.chart);
			this.setPoint(2, this.p2[0], this.p2[1], panel.chart);
			this.render(context);
		}
	};

	CIQ.Drawing.fibprojection.prototype.intersected = function (
		tick,
		value,
		box
	) {
		var p0 = this.p0,
			p1 = this.p1,
			p2 = this.p2;
		if (!p0 || !p1 || !p2) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: p0, 1: p1, 2: p2 };
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
		var rays = this.rays;
		var isIntersected =
			this.lineIntersection(tick, value, box, "segment", p0, p1) ||
			this.lineIntersection(tick, value, box, "segment", p1, p2);
		if (!isIntersected) {
			for (var i = 0; i < rays.length; i++) {
				if (
					this.lineIntersection(
						tick,
						value,
						box,
						"ray",
						rays[i][0],
						rays[i][1],
						true
					)
				) {
					isIntersected = true;
					break;
				}
			}
		}
		if (isIntersected) {
			this.highlighted = true;
			// This object will be used for repositioning
			return {
				action: "move",
				p0: CIQ.clone(p0),
				p1: CIQ.clone(p1),
				p2: CIQ.clone(p2),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		return null;
	};

	CIQ.Drawing.fibprojection.prototype.adjust = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.setPoint(0, this.d0, this.v0, panel.chart);
		this.setPoint(1, this.d1, this.v1, panel.chart);
		this.setPoint(2, this.d2, this.v2, panel.chart);
	};

	/**
	 * Fibonacci Arc drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.fibonacci}
	 * @constructor
	 * @name  CIQ.Drawing.fibarc
	 * @since 2015-11-1
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.fibarc = function () {
		this.name = "fibarc";
		//this.dragToDraw=true;
	};

	CIQ.inheritsFrom(CIQ.Drawing.fibarc, CIQ.Drawing.fibonacci);

	CIQ.Drawing.fibarc.prototype.recommendedLevels = [0.382, 0.5, 0.618, 1];

	CIQ.Drawing.fibarc.prototype.setOuter = function () {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;

		this.outer = {
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1)
		};
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y = 2 * y0 - y1;
		var x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, y);
		this.outer.p0[1] = this.stx.valueFromPixel(y, panel);
		this.outer.p0[0] = this.stx.tickFromPixel(x, panel.chart);
	};

	CIQ.Drawing.fibarc.prototype.intersected = function (tick, value, box) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var p0 = this.p0,
			p1 = this.p1,
			outer = this.outer;
		if (!p0 || !p1) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: p0, 1: p1 };
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
		if (
			this.lineIntersection(tick, value, box, "segment", outer.p0, outer.p1)
		) {
			this.highlighted = true;
			// This object will be used for repositioning
			return {
				action: "move",
				p0: CIQ.clone(p0),
				p1: CIQ.clone(p1),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		// Just test the box circumscribing the arcs
		var points = { x0: p0[0], x1: p1[0], y0: p0[1], y1: p1[1] };
		var pixelArea = CIQ.convertBoxToPixels(this.stx, this.panelName, points);
		var extend = {
			x: Math.abs(Math.sqrt(2) * (pixelArea.x1 - pixelArea.x0)),
			y: Math.abs(Math.sqrt(2) * (pixelArea.y1 - pixelArea.y0))
		};
		var x = this.stx.pixelFromTick(tick, panel.chart);
		var y = this.stx.pixelFromValueAdjusted(panel, tick, value);

		if (
			x + box.r < pixelArea.x1 - extend.x ||
			x - box.r > pixelArea.x1 + extend.x
		)
			return null;
		if (
			y + box.r < pixelArea.y1 - extend.y ||
			y - box.r > pixelArea.y1 + extend.y
		)
			return null;
		if (pixelArea.y0 < pixelArea.y1 && y - box.r > pixelArea.y1) return null;
		if (pixelArea.y0 > pixelArea.y1 && y + box.r < pixelArea.y1) return null;
		this.highlighted = true;
		return {
			action: "move",
			p0: CIQ.clone(this.p0),
			p1: CIQ.clone(this.p1),
			tick: tick,
			value: value
		};
	};

	CIQ.Drawing.fibarc.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var yAxis = panel.yAxis;
		if (!this.p1) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var isUpTrend = y1 < y0;
		var factor = Math.abs((y1 - y0) / (x1 - x0));

		var trendLineColor = this.getLineColor(this.parameters.trend.color);
		context.textBaseline = "middle";
		this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
		var txtColor = this.color;
		if (txtColor == "auto" || CIQ.isTransparent(txtColor))
			txtColor = this.stx.defaultColor;
		for (var i = 0; i < this.parameters.fibs.length; i++) {
			context.fillStyle = txtColor;
			var fib = this.parameters.fibs[i];
			if (fib.level < 0 || !fib.display) continue;
			var radius = Math.abs(this.p1[1] - this.p0[1]) * Math.sqrt(2) * fib.level;
			var value =
				this.p1[1] + radius * (isUpTrend ? -1 : 1) * (yAxis.flipped ? -1 : 1);
			var y = this.stx.pixelFromValueAdjusted(panel, this.p0[0], value);
			var x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y1 }, y);
			if (this.parameters.printLevels) {
				context.textAlign = "center";
				var txt = Math.round(fib.level * 1000) / 10 + "%";
				if (this.parameters.printValues) {
					context.fillStyle = txtColor; // the price labels screw up the color and font size...so  reset before rendering the text
					this.stx.canvasFont("stx_yaxis", context); // use the same context as the y axis so they match.
				}
				context.fillText(txt, x1, Math.round(y - 5));
			}
			context.textAlign = "left";
			if (this.parameters.printValues) {
				if (x < panel.width) {
					// just use the actual price that segment will render on regardless of 'isUpTrend' since the values must match the prices on the y axis, and can not be reversed.
					var price = value;
					if (yAxis.priceFormatter) {
						price = yAxis.priceFormatter(this.stx, panel, price);
					} else {
						price = this.stx.formatYAxisPrice(price, panel);
					}
					if (context == this.stx.chart.context) this.stx.endClip();
					this.stx.createYAxisLabel(panel, price, y, txtColor, null, context);
					if (context == this.stx.chart.context) this.stx.startClip(panel.name);
				}
			}
			var fibColor = fib.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.stx.defaultColor;
			context.strokeStyle = this.highlight ? trendLineColor : fibColor;
			var fillColor = fib.color;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.fillColor;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.stx.defaultColor;
			context.fillStyle = fillColor;
			context.globalAlpha = this.highlighted ? 1 : fib.parameters.opacity;
			context.lineWidth = fib.parameters.lineWidth;
			if (context.setLineDash) {
				context.setLineDash(
					CIQ.borderPatternToArray(context.lineWidth, fib.parameters.pattern)
				);
				context.lineDashOffset = 0; //start point in array
			}
			context.save();
			context.beginPath();
			context.scale(1 / factor, 1);
			context.arc(x1 * factor, y1, Math.abs(y - y1), 0, Math.PI, !isUpTrend);
			if (this.pattern != "none") context.stroke();
			context.globalAlpha = 0.05;
			context.fill();
			context.restore();
			if (context.setLineDash) context.setLineDash([]);
			context.globalAlpha = 1;
		}
		context.textAlign = "left";
		// ensure we at least draw trend line from zero to 100
		var trendParameters = CIQ.clone(this.parameters.trend.parameters);
		if (this.highlighted) trendParameters.opacity = 1;
		this.stx.plotLine(
			x1,
			2 * x0 - x1,
			y1,
			2 * y0 - y1,
			trendLineColor,
			"segment",
			context,
			panel,
			trendParameters
		);
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		}
	};

	/**
	 * Fibonacci Fan drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.fibonacci}
	 * @constructor
	 * @name  CIQ.Drawing.fibfan
	 * @since 2015-11-1
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.fibfan = function () {
		this.name = "fibfan";
		//this.dragToDraw=true;
	};

	CIQ.inheritsFrom(CIQ.Drawing.fibfan, CIQ.Drawing.fibonacci);

	CIQ.Drawing.fibfan.prototype.recommendedLevels = [0, 0.382, 0.5, 0.618, 1];

	CIQ.Drawing.fibfan.prototype.setOuter = function () {};

	CIQ.Drawing.fibfan.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var yAxis = panel.yAxis;
		if (!this.p1) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var top = Math.min(y1, y0);
		var bottom = Math.max(y1, y0);
		var height = bottom - top;
		var isUpTrend = (y1 - y0) / (x1 - x0) > 0;

		var trendLineColor = this.getLineColor(this.parameters.trend.color);

		context.textBaseline = "middle";
		this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
		var w = context.measureText("161.8%").width + 10; // give it extra space so it does not overlap with the price labels.
		var /*minX=Number.MAX_VALUE,*/ minY = Number.MAX_VALUE,
			/*maxX=Number.MAX_VALUE*-1,*/ maxY = Number.MAX_VALUE * -1;
		var txtColor = this.color;
		if (txtColor == "auto" || CIQ.isTransparent(txtColor))
			txtColor = this.stx.defaultColor;
		this.rays = [];
		for (var i = 0; i < this.parameters.fibs.length; i++) {
			context.fillStyle = txtColor;
			var fib = this.parameters.fibs[i];
			if (!fib.display) continue;
			//var y=(y0-y1)*fib.level+y1;
			var y = this.stx.pixelFromValueAdjusted(
				panel,
				this.p0[0],
				(this.p0[1] - this.p1[1]) * fib.level + this.p1[1]
			);
			var x = CIQ.xIntersection({ x0: x1, x1: x1, y0: y0, y1: y1 }, y);
			var farX = panel.left;
			if (x1 > x0) farX += panel.width;
			var farY = ((farX - x0) * (y - y0)) / (x - x0) + y0;
			if (x0 > farX - (this.parameters.printLevels ? w + 5 : 0) && x1 > x0)
				continue;
			else if (x0 < farX + (this.parameters.printLevels ? w + 5 : 0) && x1 < x0)
				continue;
			if (this.parameters.printLevels) {
				var txt = Math.round(fib.level * 1000) / 10 + "%";
				if (x1 > x0) {
					farX -= w;
					context.textAlign = "left";
				} else {
					farX += w;
					context.textAlign = "right";
				}
				if (this.parameters.printValues) {
					context.fillStyle = txtColor; // the price labels screw up the color and font size...so reset before rendering the text
					this.stx.canvasFont("stx_yaxis", context); // use the same context as the y axis so they match.
				}
				farY = ((farX - x0) * (y - y0)) / (x - x0) + y0;
				context.fillText(txt, farX, farY);
				if (x1 > x0) farX -= 5;
				else farX += 5;
			}
			context.textAlign = "left";
			if (this.parameters.printValues) {
				if (x < panel.width) {
					// just use the actual price that segment will render on regardless of 'isUpTrend' since the values must match the prices on the y axis, and can not be reversed.
					var price = this.stx.transformedPriceFromPixel(y, panel);
					if (yAxis.priceFormatter) {
						price = yAxis.priceFormatter(this.stx, panel, price);
					} else {
						price = this.stx.formatYAxisPrice(price, panel);
					}
					if (context == this.stx.chart.context) this.stx.endClip();
					this.stx.createYAxisLabel(panel, price, y, txtColor, null, context);
					if (context == this.stx.chart.context) this.stx.startClip(panel.name);
				}
			}
			var fibColor = fib.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.color;
			if (fibColor == "auto" || CIQ.isTransparent(fibColor))
				fibColor = this.stx.defaultColor;
			var fillColor = fib.color;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.fillColor;
			if (fillColor == "auto" || CIQ.isTransparent(fillColor))
				fillColor = this.stx.defaultColor;
			context.fillStyle = fillColor;
			if (this.parameters.printLevels)
				farY = ((farX - x0) * (y - y0)) / (x - x0) + y0;
			var fibParameters = CIQ.clone(fib.parameters);
			if (this.highlighted) fibParameters.opacity = 1;
			this.stx.plotLine(
				x0,
				farX,
				y0,
				farY,
				this.highlighted ? trendLineColor : fibColor,
				"segment",
				context,
				panel,
				fibParameters
			);
			this.rays.push([
				[x0, y0],
				[farX, farY]
			]);
			context.globalAlpha = 0.05;
			context.beginPath();
			context.moveTo(farX, farY);
			context.lineTo(x0, y0);
			context.lineTo(farX, y0);
			context.fill();
			context.globalAlpha = 1;
			if (y < minY) {
				//minX=x;
				minY = y;
			}
			if (y > maxY) {
				//maxX=x;
				maxY = y;
			}
		}
		// ensure we at least draw trend line from zero to 100
		for (var level = 0; level <= 1; level++) {
			var yy = isUpTrend ? bottom - height * level : top + height * level;
			yy = Math.round(yy);
			if (yy < minY) {
				//minX=CIQ.xIntersection({x0:x1,x1:x1,y0:y0,y1:y1}, yy);
				minY = yy;
			}
			if (yy > maxY) {
				//maxX=CIQ.xIntersection({x0:x1,x1:x1,y0:y0,y1:y1}, yy);
				maxY = yy;
			}
		}
		//this.stx.plotLine(minX, maxX, minY, maxY, trendLineColor, "segment", context, panel, this.parameters.trend.parameters);
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		}
	};

	/**
	 * Fibonacci Time Zone drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.fibonacci}
	 * @constructor
	 * @name  CIQ.Drawing.fibtimezone
	 * @since 2015-11-1
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.fibtimezone = function () {
		this.name = "fibtimezone";
		//this.dragToDraw=true;
	};

	CIQ.inheritsFrom(CIQ.Drawing.fibtimezone, CIQ.Drawing.fibonacci);

	CIQ.Drawing.fibtimezone.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		if (!this.p1) return;
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
		var fibs = [1, 0];

		var trendLineColor = this.getLineColor(this.parameters.trend.color);

		context.textBaseline = "middle";
		this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
		var h = 20; // give it extra space so it does not overlap with the date labels.
		var mult = this.p1[0] - this.p0[0];
		var txtColor = this.color;
		if (txtColor == "auto" || CIQ.isTransparent(txtColor))
			txtColor = this.stx.defaultColor;
		context.textAlign = "center";

		var x = x0;
		var top = panel.yAxis.top;
		var farY = panel.yAxis.bottom;
		var txt = 0;
		var fibColor = this.parameters.timezone.color;
		if (fibColor == "auto" || CIQ.isTransparent(fibColor))
			fibColor = this.color;
		if (fibColor == "auto" || CIQ.isTransparent(fibColor))
			fibColor = this.stx.defaultColor;
		var fillColor = this.parameters.timezone.color;
		if (fillColor == "auto" || CIQ.isTransparent(fillColor))
			fillColor = this.fillColor;
		if (fillColor == "auto" || CIQ.isTransparent(fillColor))
			fillColor = this.stx.defaultColor;

		if (this.parameters.printLevels) farY -= h - 7;

		var tzParameters = CIQ.clone(this.parameters.timezone.parameters);
		if (this.highlighted) tzParameters.opacity = 1;
		do {
			x = this.stx.pixelFromTick(this.p0[0] + txt * mult, panel.chart);
			if (x0 < x1 && x > panel.left + panel.width) break;
			else if (x0 > x1 && x < panel.left) break;
			if (this.parameters.printLevels) {
				context.fillStyle = txtColor;
				context.fillText(x1 > x0 ? txt : txt * -1, x, farY + 7);
			}
			context.fillStyle = fillColor;
			this.stx.plotLine(
				x,
				x,
				0,
				farY,
				this.highlighted ? trendLineColor : fibColor,
				"segment",
				context,
				panel,
				tzParameters
			);
			context.globalAlpha = 0.05;
			context.beginPath();
			context.moveTo(x0, top);
			context.lineTo(x, top);
			context.lineTo(x, farY);
			context.lineTo(x0, farY);
			context.fill();
			context.globalAlpha = 1;
			txt = fibs[0] + fibs[1];
			fibs.unshift(txt);
		} while (mult);
		context.textAlign = "left";
		this.stx.plotLine(
			x0,
			x1,
			y0,
			y1,
			trendLineColor,
			"segment",
			context,
			panel,
			tzParameters
		);
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		} else {
			// move points so always accessible
			var yVal = this.stx.valueFromPixel(panel.height / 2, panel);
			this.setPoint(0, this.p0[0], yVal, panel.chart);
			this.setPoint(1, this.p1[0], yVal, panel.chart);
		}
	};

	CIQ.Drawing.fibtimezone.prototype.intersected = function (tick, value, box) {
		var p0 = this.p0,
			p1 = this.p1,
			panel = this.stx.panels[this.panelName];
		if (!p0 || !p1 || !panel) return null; // in case invalid drawing (such as from panel that no longer exists)
		var pointsToCheck = { 0: p0, 1: p1 };
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
		// Check for over the trend line or the 0 vertical line
		var trendIntersects = this.lineIntersection(tick, value, box, "segment");
		if (trendIntersects || (box.x0 <= this.p0[0] && box.x1 >= p0[0])) {
			this.highlighted = true;
			return {
				action: "move",
				p0: CIQ.clone(p0),
				p1: CIQ.clone(p1),
				tick: tick, // save original tick
				value: value // save original value
			};
		}
		return null;
	};

	// Backwards compatibility for drawings
	CIQ.Drawing.arrow_v0 = function () {
		this.name = "arrow";
		this.dimension = [11, 11];
		this.points = [
			[
				"M",
				3,
				0,
				"L",
				7,
				0,
				"L",
				7,
				5,
				"L",
				10,
				5,
				"L",
				5,
				10,
				"L",
				0,
				5,
				"L",
				3,
				5,
				"L",
				3,
				0
			]
		];
	};
	CIQ.inheritsFrom(CIQ.Drawing.arrow_v0, CIQ.Drawing.shape);

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

	CIQ.Drawing.xcross = function () {
		this.name = "xcross";
		this.dimension = [7, 7];
		this.points=[
			[
				"M", 1, 0,
				"L", 3, 2,
				"L", 5, 0,
				"L", 6, 1,
				"L", 4, 3,
				"L", 6, 5,
				"L" ,5, 6,
				"L", 3, 4,
				"L", 1, 6,
				"L", 0, 5,
				"L", 2, 3,
				"L", 0, 1,
				"L", 1, 0
			]
		]; // prettier-ignore
	};
	CIQ.inheritsFrom(CIQ.Drawing.xcross, CIQ.Drawing.shape);

	CIQ.Drawing.check = function () {
		this.name = "check";
		this.dimension = [8, 9];
		this.points = [
			[
				"M", 1, 5,
				"L", 0, 6,
				"L", 2, 8,
				"L", 7, 1,
				"L", 6, 0,
				"L", 2, 6,
				"L", 1, 5
			]
		]; // prettier-ignore
	};
	CIQ.inheritsFrom(CIQ.Drawing.check, CIQ.Drawing.shape);

	CIQ.Drawing.star = function () {
		this.name = "star";
		this.dimension = [12, 12];
		this.points=[
			[
				"M", 0, 4,
				"L", 4, 4,
				"L", 5.5, 0,
				"L", 7, 4,
				"L", 11, 4,
				"L" ,8, 7,
				"L", 9, 11,
				"L", 5.5, 9,
				"L", 2, 11,
				"L", 3, 7,
				"L", 0, 4
			]
		]; // prettier-ignore
	};
	CIQ.inheritsFrom(CIQ.Drawing.star, CIQ.Drawing.shape);

	CIQ.Drawing.heart = function () {
		this.name = "heart";
		this.dimension = [23, 20];
		this.points=[
			[
				"M", 11, 3,
				"B", 11, 2.4, 10, 0, 6 ,0,
				"B", 0, 0, 0, 7.5, 0, 7.5,
				"B", 0, 11, 4, 15.4, 11, 19,
				"B", 18, 15.4, 22, 11, 22, 7.5,
				"B", 22, 7.5, 22, 0, 16, 0,
				"B", 13, 0, 11, 2.4, 11, 3
			]
		]; // prettier-ignore
	};
	CIQ.inheritsFrom(CIQ.Drawing.heart, CIQ.Drawing.shape);

	CIQ.Drawing.focusarrow = function () {
		this.name = "focusarrow";
		this.dimension = [7, 5];
		this.points = [
			[
				"M", 0, 0,
				"L", 2, 2,
				"L", 0, 4,
				"L", 0, 0
			],
			[
				"M", 6, 0,
				"L", 4, 2,
				"L", 6, 4,
				"L", 6, 0
			]
		]; // prettier-ignore
	};
	CIQ.inheritsFrom(CIQ.Drawing.focusarrow, CIQ.Drawing.shape);

	/**
	 * Crossline drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.horizontal}
	 * @constructor
	 * @name  CIQ.Drawing.crossline
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.crossline = function () {
		this.name = "crossline";
	};
	CIQ.inheritsFrom(CIQ.Drawing.crossline, CIQ.Drawing.horizontal);
	CIQ.extend(
		CIQ.Drawing.crossline.prototype,
		{
			measure: function () {},
			accidentalClick: function (tick, value) {
				return false;
			},
			adjust: function () {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				this.setPoint(0, this.d0, this.v0, panel.chart);
				this.p1 = CIQ.clone(this.p0);
			},
			intersected: function (tick, value, box) {
				if (!this.p0 || !this.p1) return null;
				this.p1[0] += 1;
				var isIntersected = this.lineIntersection(tick, value, box, "line");
				this.p1 = CIQ.clone(this.p0);
				if (!isIntersected) {
					this.p1[1] += 1;
					isIntersected = this.lineIntersection(tick, value, box, "line");
					this.p1 = CIQ.clone(this.p0);
					if (!isIntersected) return null;
				}
				this.highlighted = true;
				if (this.pointIntersection(this.p0[0], this.p0[1], box)) {
					this.highlighted = "p0";
				}
				// This object will be used for repositioning
				return {
					action: "move",
					p0: CIQ.clone(this.p0),
					p1: CIQ.clone(this.p1),
					tick: tick, // save original tick
					value: value // save original value
				};
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);

				var color = this.getLineColor();

				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth
				};
				this.stx.plotLine(
					x0,
					x0 + 100,
					y0,
					y0,
					color,
					"horizontal",
					context,
					panel,
					parameters
				);
				this.stx.plotLine(
					x0,
					x0,
					y0,
					y0 + 100,
					color,
					"vertical",
					context,
					panel,
					parameters
				);

				if (this.axisLabel && !this.repositioner) {
					this.stx.endClip();
					var txt = this.p0[1];
					if (panel.chart.transformFunc)
						txt = panel.chart.transformFunc(this.stx, panel.chart, txt);
					if (panel.yAxis.priceFormatter)
						txt = panel.yAxis.priceFormatter(this.stx, panel, txt);
					else txt = this.stx.formatYAxisPrice(txt, panel);
					this.stx.createYAxisLabel(panel, txt, y0, color);
					this.stx.startClip(panel.name);
					if (this.p0[0] >= 0 && !this.stx.chart.xAxis.noDraw) {
						// don't try to compute dates from before dataSet
						var dt, newDT;
						/* set d0 to the right timezone */
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
						/***********/
						if (panel.chart.xAxis.formatter) {
							myDate = panel.chart.xAxis.formatter(
								dt,
								this.name,
								null,
								null,
								myDate
							);
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
						this.stx.createXAxisLabel({
							panel: panel,
							txt: myDate,
							x: x0,
							backgroundColor: color,
							color: null,
							pointed: true,
							padding: 2
						});
						this.stx.startClip(panel.name);
					}
				}
				if (this.highlighted) {
					var p0Fill = this.highlighted == "p0" ? true : false;
					this.littleCircle(context, x0, y0, p0Fill);
				}
			}
		},
		true
	);

	/**
	 * Speed Resistance Arc drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.segment}
	 * @constructor
	 * @name  CIQ.Drawing.speedarc
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.speedarc = function () {
		this.name = "speedarc";
		this.printLevels = true;
	};
	CIQ.inheritsFrom(CIQ.Drawing.speedarc, CIQ.Drawing.segment);
	CIQ.extend(
		CIQ.Drawing.speedarc.prototype,
		{
			defaultOpacity: 0.25,
			configs: ["color", "fillColor", "lineWidth", "pattern"],
			copyConfig: function () {
				this.color = this.stx.currentVectorParameters.currentColor;
				this.fillColor = this.stx.currentVectorParameters.fillColor;
				this.lineWidth = this.stx.currentVectorParameters.lineWidth;
				this.pattern = this.stx.currentVectorParameters.pattern;
			},
			intersected: function (tick, value, box) {
				if (!this.p0 || !this.p1) return null; // in case invalid drawing (such as from panel that no longer exists)
				var pointsToCheck = { 0: this.p0, 1: this.p1 };
				for (var pt in pointsToCheck) {
					if (
						this.pointIntersection(
							pointsToCheck[pt][0],
							pointsToCheck[pt][1],
							box
						)
					) {
						this.highlighted = "p" + pt;
						return {
							action: "drag",
							point: "p" + pt
						};
					}
				}
				var isIntersected = this.lineIntersection(tick, value, box, this.name);
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

				// Just test the box circumscribing the arcs
				var left = this.p1[0] - (this.p0[0] - this.p1[0]);
				var right = this.p0[0];
				var bottom = this.p1[1];
				var top = this.p0[1];

				if (tick > Math.max(left, right) || tick < Math.min(left, right))
					return null;
				if (value > Math.max(top, bottom) || value < Math.min(top, bottom))
					return null;
				this.highlighted = true;
				return {
					action: "move",
					p0: CIQ.clone(this.p0),
					p1: CIQ.clone(this.p1),
					tick: tick,
					value: value
				};
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
				var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
				var isUpTrend = y1 < y0;
				var factor = Math.abs((y1 - y0) / (x1 - x0));

				var color = this.getLineColor();
				context.strokeStyle = color;
				var fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.stx.defaultColor;
				context.fillStyle = fillColor;
				if (context.setLineDash) {
					context.setLineDash(
						CIQ.borderPatternToArray(this.lineWidth, this.pattern)
					);
					context.lineDashOffset = 0; //start point in array
				}
				this.stx.canvasFont("stx_yaxis", context);
				for (var i = 1; i < 3; i++) {
					var radius =
						(Math.abs(this.p1[1] - this.p0[1]) * Math.sqrt(2) * i) / 3;
					var value =
						this.p1[1] +
						radius * (isUpTrend ? -1 : 1) * (panel.yAxis.flipped ? -1 : 1);
					var y = this.stx.pixelFromValueAdjusted(panel, this.p0[0], value);

					context.save();
					context.beginPath();
					context.scale(1 / factor, 1);
					context.arc(
						x1 * factor,
						y1,
						Math.abs(y - y1),
						0,
						Math.PI,
						!isUpTrend
					);
					context.globalAlpha = this.highlighted ? 1 : this.defaultOpacity;
					if (this.pattern != "none") context.stroke();
					context.globalAlpha = 0.1;
					context.fill();
					context.restore();
					context.globalAlpha = 1;
					if (this.printLevels) {
						context.fillStyle = color;
						context.textAlign = "center";
						var txt = i + "/3";
						context.fillText(txt, x1, Math.round(y - 5));
						context.fillStyle = fillColor;
					}
				}
				context.textAlign = "left";
				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth,
					opacity: this.highlighted ? 1 : this.defaultOpacity
				};
				this.stx.plotLine(
					x0,
					x1,
					y0,
					y1,
					color,
					"segment",
					context,
					panel,
					parameters
				);
				if (context.setLineDash) context.setLineDash([]);
				if (this.highlighted) {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y0, p0Fill);
					this.littleCircle(context, x1, y1, p1Fill);
				}
			},
			reconstruct: function (stx, obj) {
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
			},
			serialize: function () {
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
			}
		},
		true
	);

	/**
	 * Speed Resistance Lines drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.speedarc}
	 * @constructor
	 * @name  CIQ.Drawing.speedline
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.speedline = function () {
		this.name = "speedline";
		this.printLevels = true;
	};
	CIQ.inheritsFrom(CIQ.Drawing.speedline, CIQ.Drawing.speedarc);
	CIQ.extend(
		CIQ.Drawing.speedline.prototype,
		{
			intersected: function (tick, value, box) {
				var p0 = this.p0,
					p1 = this.p1;
				if (!p0 || !p1) return null; // in case invalid drawing (such as from panel that no longer exists)
				var pointsToCheck = { 0: p0, 1: p1 };
				for (var pt in pointsToCheck) {
					if (
						this.pointIntersection(
							pointsToCheck[pt][0],
							pointsToCheck[pt][1],
							box
						)
					) {
						this.highlighted = "p" + pt;
						return {
							action: "drag",
							point: "p" + pt
						};
					}
				}
				var rays = this.rays;
				for (var i = 0; i < rays.length; i++) {
					if (
						this.lineIntersection(
							tick,
							value,
							box,
							"ray",
							rays[i][0],
							rays[i][1],
							true
						)
					) {
						this.highlighted = true;
						// This object will be used for repositioning
						return {
							action: "move",
							p0: CIQ.clone(p0),
							p1: CIQ.clone(p1),
							tick: tick, // save original tick
							value: value // save original value
						};
					}
				}
				return null;
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
				var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
				this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
				var trendLineColor = this.getLineColor();
				var color = this.color;
				if (color == "auto" || CIQ.isTransparent(color))
					color = this.stx.defaultColor;
				context.strokeStyle = color;
				var fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.stx.defaultColor;
				context.fillStyle = fillColor;
				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth,
					opacity: this.highlighted ? 1 : this.defaultOpacity
				};
				var farX0, farY0;
				var levels = ["1", "2/3", "1/3", "3/2", "3"];
				var levelValues = [1, 2 / 3, 1 / 3, 3 / 2, 3];
				var grids = [];
				this.rays = [];
				for (var i = 0; i < levelValues.length; i++) {
					var level = levelValues[i];
					if (level > 1 && !this.extension) continue;
					var y = this.stx.pixelFromValueAdjusted(
						panel,
						this.p0[0],
						this.p0[1] - (this.p0[1] - this.p1[1]) * level
					);
					var x;
					if (level > 1) {
						x = CIQ.xIntersection({ x0: x0, x1: x1, y0: y0, y1: y }, y1);
						grids.push(x);
					} else {
						x = CIQ.xIntersection({ x0: x1, x1: x1, y0: y0, y1: y1 }, y);
						grids.push(y);
					}
					//var x=x0+(x1-x0)/level;
					//var y=y0-level*(y0-y1);
					var farX = level > 1 ? x : x1;
					var farY = level > 1 ? y1 : y;
					if (!this.confineToGrid) {
						farX = panel.left;
						if (x1 > x0) farX += panel.width;
						farY = ((farX - x0) * (y - y0)) / (x1 - x0) + y0;
					}
					if (this.printLevels) {
						if (level != 1 || this.extension) {
							context.fillStyle = color;
							var perturbX = 0,
								perturbY = 0;
							if (y0 > y1) {
								perturbY = -5;
								context.textBaseline = "bottom";
							} else {
								perturbY = 5;
								context.textBaseline = "top";
							}
							if (x0 > x1) {
								perturbX = 5;
								context.textAlign = "right";
							} else {
								perturbX = -5;
								context.textAlign = "left";
							}
							if (level > 1)
								context.fillText(
									levels[i],
									x + (this.confineToGrid ? 0 : perturbX),
									y1
								);
							else
								context.fillText(
									levels[i],
									x1,
									y + (this.confineToGrid ? 0 : perturbY)
								);
							context.fillStyle = fillColor;
						}
					}
					this.stx.plotLine(
						x0,
						farX,
						y0,
						farY,
						this.highlighted ? trendLineColor : color,
						"segment",
						context,
						panel,
						parameters
					);
					if (level == 1) {
						farX0 = farX;
						farY0 = farY;
					}
					this.rays.push([
						[x0, y0],
						[farX, farY]
					]);
					context.globalAlpha = 0.1;
					context.beginPath();
					context.moveTo(farX, farY);
					context.lineTo(x0, y0);
					context.lineTo(farX0, farY0);
					context.fill();
					context.globalAlpha = 1;
				}
				context.textAlign = "left";
				context.textBaseline = "middle";
				if (this.confineToGrid) {
					context.globalAlpha = 0.3;
					context.beginPath();
					context.strokeRect(x0, y0, x1 - x0, y1 - y0);
					context.moveTo(x0, grids[1]);
					context.lineTo(x1, grids[1]);
					context.moveTo(x0, grids[2]);
					context.lineTo(x1, grids[2]);
					if (this.extension) {
						context.moveTo(grids[3], y0);
						context.lineTo(grids[3], y1);
						context.moveTo(grids[4], y0);
						context.lineTo(grids[4], y1);
					}
					context.stroke();
					context.globalAlpha = 1;
				}
				if (this.highlighted) {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y0, p0Fill);
					this.littleCircle(context, x1, y1, p1Fill);
				}
			}
		},
		true
	);

	/**
	 * Gann Fan drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.speedarc}
	 * @constructor
	 * @name  CIQ.Drawing.gannfan
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.gannfan = function () {
		this.name = "gannfan";
		this.printLevels = true;
	};
	CIQ.inheritsFrom(CIQ.Drawing.gannfan, CIQ.Drawing.speedline);
	CIQ.extend(
		CIQ.Drawing.gannfan.prototype,
		{
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
				var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
				this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
				var trendLineColor = this.getLineColor();
				var color = this.color;
				if (color == "auto" || CIQ.isTransparent(color))
					color = this.stx.defaultColor;
				context.strokeStyle = color;
				var fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.stx.defaultColor;
				context.fillStyle = fillColor;
				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth,
					opacity: this.highlighted ? 1 : this.defaultOpacity
				};
				var farX0, farY0;
				var levels = [1, 2, 3, 4, 8, 1 / 2, 1 / 3, 1 / 4, 1 / 8];
				this.rays = [];
				for (var i = 0; i < levels.length; i++) {
					var level = levels[i];
					var x = x0 + (x1 - x0) / level;
					var y = y0 - level * (y0 - y1);
					var farX = panel.left;
					if (x1 > x0) farX += panel.width;
					var farY = ((farX - x0) * (y - y0)) / (x1 - x0) + y0;
					if (this.printLevels) {
						context.fillStyle = color;
						var perturbX = 0,
							perturbY = 0;
						if (y0 > y1) {
							perturbY = 5;
							context.textBaseline = "top";
						} else {
							perturbY = -5;
							context.textBaseline = "bottom";
						}
						if (x0 > x1) {
							perturbX = 5;
							context.textAlign = "left";
						} else {
							perturbX = -5;
							context.textAlign = "right";
						}
						if (level > 1) {
							context.fillText(level + "x1", x + perturbX, y1);
						} else {
							context.fillText("1x" + 1 / level, x1, y + perturbY);
						}
						context.fillStyle = fillColor;
					}
					this.stx.plotLine(
						x0,
						farX,
						y0,
						farY,
						this.highlighted ? trendLineColor : color,
						"segment",
						context,
						panel,
						parameters
					);
					this.rays.push([
						[x0, y0],
						[farX, farY]
					]);
					if (level == 1) {
						farX0 = farX;
						farY0 = farY;
					}
					context.globalAlpha = 0.1;
					context.beginPath();
					context.moveTo(farX, farY);
					context.lineTo(x0, y0);
					context.lineTo(farX0, farY0);
					context.fill();
					context.globalAlpha = 1;
				}
				context.textAlign = "left";
				context.textBaseline = "middle";
				if (this.highlighted) {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y0, p0Fill);
					this.littleCircle(context, x1, y1, p1Fill);
				}
			}
		},
		true
	);

	/**
	 * Time Cycle drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.speedarc}
	 * @constructor
	 * @name  CIQ.Drawing.timecycle
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.timecycle = function () {
		this.name = "timecycle";
		this.printLevels = true;
	};
	CIQ.inheritsFrom(CIQ.Drawing.timecycle, CIQ.Drawing.speedarc);
	CIQ.extend(
		CIQ.Drawing.timecycle.prototype,
		{
			intersected: function (tick, value, box) {
				var p0 = this.p0,
					p1 = this.p1,
					panel = this.stx.panels[this.panelName];
				if (!p0 || !p1 || !panel) return null; // in case invalid drawing (such as from panel that no longer exists)
				var pointsToCheck = { 0: p0, 1: p1 };
				for (var pt in pointsToCheck) {
					if (
						this.pointIntersection(
							pointsToCheck[pt][0],
							pointsToCheck[pt][1],
							box
						)
					) {
						this.highlighted = "p" + pt;
						return {
							action: "drag",
							point: "p" + pt
						};
					}
				}
				// Check for over the trend line or the 0 vertical line
				var trendIntersects = this.lineIntersection(
					tick,
					value,
					box,
					"segment"
				);
				if (trendIntersects || (box.x0 <= this.p0[0] && box.x1 >= p0[0])) {
					this.highlighted = true;
					return {
						action: "move",
						p0: CIQ.clone(p0),
						p1: CIQ.clone(p1),
						tick: tick, // save original tick
						value: value // save original value
					};
				}
				return null;
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;

				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
				var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
				var count = 0;

				var trendLineColor = this.getLineColor();
				context.textBaseline = "middle";
				this.stx.canvasFont("stx_yaxis", context); // match font from y axis so it looks cohesive
				var h = 20; // give it extra space so it does not overlap with the date labels.
				var mult = this.p1[0] - this.p0[0];
				context.textAlign = "center";

				var x = x0;
				var top = panel.yAxis.top;
				var farY = panel.yAxis.bottom;
				var color = this.color;
				if (color == "auto" || CIQ.isTransparent(color))
					color = this.stx.defaultColor;
				var fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = this.stx.defaultColor;

				if (this.printLevels) farY -= h - 7;

				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth,
					opacity: this.highlighted ? 1 : this.defaultOpacity
				};

				var x_s = [];
				context.save();
				context.fillStyle = fillColor;
				context.globalAlpha = 0.05;
				//context.globalCompositeOperation="destination-over";
				do {
					x = this.stx.pixelFromTick(this.p0[0] + count * mult, panel.chart);
					count++;

					if (x0 < x1 && x > panel.left + panel.width) break;
					else if (x0 > x1 && x < panel.left) break;
					else if (x < panel.left || x > panel.left + panel.width) continue;

					context.beginPath();
					context.moveTo(x0, top);
					context.lineTo(x, top);
					context.lineTo(x, farY);
					context.lineTo(x0, farY);
					context.fill();
					x_s.push({ c: count, x: x });
				} while (mult);
				context.globalAlpha = 1;
				var slack = 0;
				for (var pt = 0; pt < x_s.length; pt++) {
					this.stx.plotLine(
						x_s[pt].x,
						x_s[pt].x,
						0,
						farY,
						this.highlighted ? trendLineColor : color,
						"segment",
						context,
						panel,
						parameters
					);
					if (this.printLevels) {
						context.fillStyle = color;
						var m = this.stx.chart.context.measureText(x_s[pt].c).width + 3;
						if (m < this.stx.layout.candleWidth + slack) {
							context.fillText(x_s[pt].c, x_s[pt].x, farY + 7);
							slack = 0;
						} else {
							slack += this.stx.layout.candleWidth;
						}
					}
				}
				context.restore();
				context.textAlign = "left";

				this.stx.plotLine(
					x0,
					x1,
					y0,
					y1,
					trendLineColor,
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
				} else {
					// move points so always accessible
					var yVal = this.stx.valueFromPixel(panel.height / 2, panel);
					this.setPoint(0, this.p0[0], yVal, panel.chart);
					this.setPoint(1, this.p1[0], yVal, panel.chart);
				}
			}
		},
		true
	);

	/**
	 * Regression Line drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.segment}
	 * @constructor
	 * @name  CIQ.Drawing.regression
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.regression = function () {
		this.name = "regression";
	};
	CIQ.inheritsFrom(CIQ.Drawing.regression, CIQ.Drawing.segment);
	CIQ.extend(
		CIQ.Drawing.regression.prototype,
		{
			configs: [
				// primary line
				"color",
				"lineWidth",
				"pattern",
				// stddev * 1
				"active1",
				"color1",
				"lineWidth1",
				"pattern1",
				// stddev * 2
				"active2",
				"color2",
				"lineWidth2",
				"pattern2",
				// stddev * 3
				"active3",
				"color3",
				"lineWidth3",
				"pattern3"
			],
			copyConfig: function (withPreferences) {
				CIQ.Drawing.copyConfig(this, withPreferences);
				var cvp = this.stx.currentVectorParameters;
				this.active1 = !!cvp.active1;
				this.active2 = !!cvp.active2;
				this.active3 = !!cvp.active3;
				this.color1 = cvp.color1 || "auto";
				this.color2 = cvp.color2 || "auto";
				this.color3 = cvp.color3 || "auto";
				this.lineWidth1 = cvp.lineWidth1;
				this.lineWidth2 = cvp.lineWidth2;
				this.lineWidth3 = cvp.lineWidth3;
				this.pattern1 = cvp.pattern1;
				this.pattern2 = cvp.pattern2;
				this.pattern3 = cvp.pattern3;
			},
			$controls: [
				'cq-cvp-controller[cq-cvp-header="1"]',
				'cq-cvp-controller[cq-cvp-header="2"]',
				'cq-cvp-controller[cq-cvp-header="3"]'
			],
			click: function (context, tick, value) {
				if (tick < 0) return;
				this.copyConfig();
				var panel = this.stx.panels[this.panelName];
				if (!this.penDown) {
					this.setPoint(0, tick, value, panel.chart);
					this.penDown = true;
					var stx = this.stx;
					this.field = stx.highlightedDataSetField;
					if (!this.field && panel != stx.chart.panel) {
						for (var sr in stx.chart.seriesRenderers) {
							var renderer = stx.chart.seriesRenderers[sr];
							if (renderer.params.panel == panel.name) {
								this.field = renderer.seriesParams[0].field;
								break;
							}
						}
						for (var st in stx.layout.studies) {
							var study = stx.layout.studies[st]; // find a default study on this panel
							if (study.panel == panel.name) {
								this.field = Object.keys(study.outputMap)[0];
								break;
							}
						}
					}
					return false;
				}
				if (this.accidentalClick(tick, value)) return this.dragToDraw;

				this.setPoint(1, tick, value, panel.chart);
				this.penDown = false;
				return true; // kernel will call render after this
			},
			// Returns both the transformed and untransformed value of the drawing's field attribute
			getYValue: function (i) {
				var record = this.stx.chart.dataSet[i],
					transformedRecord = this.stx.chart.dataSet[i];
				if (!record) return null;

				var panel = this.stx.panels[this.panelName];
				var yAxis = this.stx.getYAxisByField(panel, this.field) || panel.yAxis;
				if (
					this.stx.charts[panel.name] &&
					panel.chart.transformFunc &&
					yAxis == panel.yAxis
				)
					transformedRecord = record.transform;
				if (!transformedRecord) return null;

				var price = null,
					transformedPrice = null,
					defaultField = this.stx.defaultPlotField || "Close";
				if (this.field) {
					transformedPrice = CIQ.existsInObjectChain(
						transformedRecord,
						this.field
					);
					if (!transformedPrice) return null;
					price = transformedPrice =
						transformedPrice.obj[transformedPrice.member];
					if (record != transformedRecord) {
						price = CIQ.existsInObjectChain(record, this.field);
						price = price.obj[price.member];
					}
					if (typeof transformedPrice == "object") {
						transformedPrice = transformedPrice[defaultField];
						price = price[defaultField];
					}
				} else {
					transformedPrice = transformedRecord[defaultField];
					price = record[defaultField];
				}
				return { transformed: transformedPrice, untransformed: price };
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				if (this.p0[0] < 0 || this.p1[0] < 0) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				if (x0 < panel.left && x1 < panel.left) return;
				if (x0 > panel.right && x1 > panel.right) return;
				var yAxis = this.stx.getYAxisByField(panel, this.field);

				var prices = [],
					rawPrices = []; // rawPrices used solely for measure
				var sumCloses = 0,
					sumRawCloses = 0;
				var sumWeightedCloses = 0,
					sumWeightedRawCloses = 0;
				var start = Math.min(this.p1[0], this.p0[0]);
				var end = Math.max(this.p1[0], this.p0[0]) + 1;
				var rawTicks = end - start;
				for (var i = start; i < end; i++) {
					var price = this.getYValue(i);
					if (price) {
						prices.push(price.transformed);
						rawPrices.push(price.untransformed);
					}
				}

				var ticks = prices.length;
				var sumWeights = (ticks * (ticks + 1)) / 2;
				var squaredSumWeights = Math.pow(sumWeights, 2);
				var sumWeightsSquared = (sumWeights * (2 * ticks + 1)) / 3;

				for (i = 0; i < ticks; i++) {
					sumWeightedCloses += ticks * prices[i] - sumCloses;
					sumCloses += prices[i];
					sumWeightedRawCloses += ticks * rawPrices[i] - sumRawCloses;
					sumRawCloses += rawPrices[i];
				}

				var slope =
					(ticks * sumWeightedCloses - sumWeights * sumCloses) /
					(ticks * sumWeightsSquared - squaredSumWeights);
				var intercept = (sumCloses - slope * sumWeights) / ticks;
				var rawSlope =
					(ticks * sumWeightedRawCloses - sumWeights * sumRawCloses) /
					(ticks * sumWeightsSquared - squaredSumWeights);
				var rawIntercept = (sumRawCloses - slope * sumWeights) / ticks;
				var v0, v1;
				if (this.p0[0] < this.p1[0]) {
					v0 = intercept;
					v1 = slope * rawTicks + intercept;
					this.p0[1] = rawIntercept;
					this.p1[1] = rawSlope * rawTicks + rawIntercept;
				} else {
					v0 = slope * rawTicks + intercept;
					v1 = intercept;
					this.p0[1] = rawSlope * rawTicks + rawIntercept;
					this.p1[1] = rawIntercept;
				}

				var y0 = this.stx.pixelFromTransformedValue(v0, panel, yAxis);
				var y1 = this.stx.pixelFromTransformedValue(v1, panel, yAxis);
				var trendLineColor = this.getLineColor();
				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth
				};
				this.stx.plotLine(
					x0,
					x1,
					y0,
					y1,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				this.stx.plotLine(
					x0,
					x0,
					y0 - 20,
					y0 + 20,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				this.stx.plotLine(
					x1,
					x1,
					y1 - 20,
					y1 + 20,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);

				if (this.active1 || this.active2 || this.active3) {
					var average = sumCloses / ticks;
					var sumStddev = 0;

					for (i = 0; i < ticks; i++) {
						sumStddev += Math.pow(prices[i] - average, 2);
					}

					var stddev = Math.sqrt(sumStddev / ticks);
					var params = {
						context: context,
						panel: panel,
						points: {
							0: { x: x0, v: v0 },
							1: { x: x1, v: v1 }
						},
						stddev: stddev,
						yAxis: yAxis
					};

					this.lines = {};

					if (this.active1) {
						this.renderStddev("1", "p", params);
						this.renderStddev("1", "n", params);
					}

					if (this.active2) {
						this.renderStddev("2", "p", params);
						this.renderStddev("2", "n", params);
					}

					if (this.active3) {
						this.renderStddev("3", "p", params);
						this.renderStddev("3", "n", params);
					}
				}

				if (!this.highlighted) {
					this.pixelX = [x0, x1];
					this.pixelY = [y0, y1];
				} else {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y0, p0Fill);
					this.littleCircle(context, x1, y1, p1Fill);
				}
			},
			renderStddev: function (scope, sign, parameters) {
				var name = "stddev" + scope + sign;
				var colorKey = "color" + scope;
				var patternKey = "pattern" + scope;
				var lineWidthKey = "lineWidth" + scope;
				var points = parameters.points;
				var v0 = points[0].v;
				var v1 = points[1].v;
				var stddev = parameters.stddev;
				var stddevMult = sign === "n" ? scope * -1 : scope * 1;
				var stx = this.stx;
				var panel = parameters.panel;
				var yAxis = parameters.yAxis;
				var line = {
					name: name,
					color: this.getLineColor(this[colorKey]),
					type: "segment",
					y0: stx.pixelFromTransformedValue(
						v0 + stddev * stddevMult,
						panel,
						yAxis
					),
					y1: stx.pixelFromTransformedValue(
						v1 + stddev * stddevMult,
						panel,
						yAxis
					),
					params: {
						pattern: this[patternKey],
						lineWidth: this[lineWidthKey]
					}
				};

				// set line for intersected method
				if (this.lines) {
					this.lines[name] = line;
				}

				var context = parameters.context;
				var x0 = points[0].x;
				var x1 = points[1].x;

				stx.plotLine(
					x0,
					x1,
					line.y0,
					line.y1,
					line.color,
					line.type,
					context,
					panel,
					line.params
				);
				stx.plotLine(
					x0,
					x0,
					line.y0 - 10,
					line.y0 + 10,
					line.color,
					line.type,
					context,
					panel,
					line.params
				);
				stx.plotLine(
					x1,
					x1,
					line.y1 - 10,
					line.y1 + 10,
					line.color,
					line.type,
					context,
					panel,
					line.params
				);

				var label = scope + "\u03c3";
				var labelX = Math.max(x0, x1) + 5;
				var labelY = x0 < x1 ? line.y1 : line.y0;

				context.fillStyle = line.color;
				context.save();
				context.textBaseline = "middle";
				context.fillText(label, labelX, labelY);
				context.restore();

				// derived class `average` has an axisLabel
				if (
					parameters.formatPrice &&
					this.axisLabel &&
					!this.highlighted &&
					!this.penDown
				) {
					if (
						(x0 >= panel.chart.left && x0 <= panel.chart.right) ||
						(x1 >= panel.chart.left && x1 <= panel.chart.right)
					) {
						var displayPrice = (x0 < x1 ? v1 : v0) + stddev * stddevMult;
						stx.endClip();
						stx.createYAxisLabel(
							panel,
							parameters.formatPrice(displayPrice, yAxis),
							labelY,
							line.color,
							null,
							context,
							yAxis
						);
						stx.startClip(panel.name);
					}
				}
			},
			intersected: function (tick, value, box) {
				if (!this.pixelX || !this.pixelY) return null;

				var repositionIntersection = this.repositionIntersection(tick, value);
				if (repositionIntersection) return repositionIntersection;

				// check for point intersection
				var pointsToCheck = { 0: this.pixelX, 1: this.pixelY };
				for (var pt = 0; pt < 2; pt++) {
					if (
						this.pointIntersection(
							pointsToCheck[0][pt],
							pointsToCheck[1][pt],
							box,
							true
						)
					) {
						this.highlighted = "p" + pt;
						return {
							action: "drag",
							point: "p" + pt
						};
					}
				}

				// check for line intersection
				var self = this;
				var x0 = this.pixelX[0];
				var x1 = this.pixelX[1];
				var lineIntersection = function (line) {
					var p0 = [x0, line.y0];
					var p1 = [x1, line.y1];

					return self.lineIntersection(
						tick,
						value,
						box,
						self.name,
						p0,
						p1,
						true
					);
				};
				var isIntersected = lineIntersection({
					y0: this.pixelY[0],
					y1: this.pixelY[1]
				});

				if (!isIntersected && this.lines) {
					for (var key in this.lines) {
						if (lineIntersection(this.lines[key])) {
							isIntersected = true;
							break;
						}
					}
				}

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
			},
			repositionIntersection: function (tick, value) {
				if (!this.p0 || !this.p1) return false; // in case invalid drawing (such as from panel that no longer exists)
				if (this == this.stx.repositioningDrawing && this.highlighted) {
					// already moving or dragging, continue
					if (this.highlighted === true) {
						return {
							action: "move",
							p0: CIQ.clone(this.p0),
							p1: CIQ.clone(this.p1),
							tick: tick, // save original tick
							value: value // save original value
						};
					}
					return {
						action: "drag",
						point: this.highlighted
					};
				}
				return false;
			},
			lineIntersection: function (tick, value, box, type, p0, p1, isPixels) {
				if (!isPixels) {
					console.log(
						type +
							" lineIntersection must accept p0 and p1 in pixels.  Please verify and set isPixels=true."
					);
					return false;
				}
				if (!p0) p0 = this.p0;
				if (!p1) p1 = this.p1;
				if (!(p0 && p1)) return false;
				var stx = this.stx;
				var pixelBox = CIQ.convertBoxToPixels(stx, this.panelName, box);
				if (pixelBox.x0 === undefined) return false;
				var pixelPoint = { x0: p0[0], x1: p1[0], y0: p0[1], y1: p1[1] };
				return CIQ.boxIntersects(
					pixelBox.x0,
					pixelBox.y0,
					pixelBox.x1,
					pixelBox.y1,
					pixelPoint.x0,
					pixelPoint.y0,
					pixelPoint.x1,
					pixelPoint.y1
				);
			},
			boxIntersection: function (tick, value, box) {
				if (
					box.cx0 > Math.max(this.pixelX[0], this.pixelX[1]) ||
					box.cx1 < Math.min(this.pixelX[0], this.pixelX[1])
				)
					return false;
				if (
					!this.stx.repositioningDrawing &&
					(box.cy1 < this.pixelY[0] || box.cy0 > this.pixelY[1])
				)
					return false;
				return true;
			},
			reconstruct: function (stx, obj) {
				this.stx = stx;
				this.color = obj.col;
				this.color1 = obj.col1;
				this.color2 = obj.col2;
				this.color3 = obj.col3;
				this.active1 = obj.dev1;
				this.active2 = obj.dev2;
				this.active3 = obj.dev3;
				this.panelName = obj.pnl;
				this.pattern = obj.ptrn;
				this.pattern1 = obj.ptrn1;
				this.pattern2 = obj.ptrn2;
				this.pattern3 = obj.ptrn3;
				this.lineWidth = obj.lw;
				this.lineWidth1 = obj.lw1;
				this.lineWidth2 = obj.lw2;
				this.lineWidth3 = obj.lw3;
				this.d0 = obj.d0;
				this.d1 = obj.d1;
				this.tzo0 = obj.tzo0;
				this.tzo1 = obj.tzo1;
				this.field = obj.fld;
				this.adjust();
			},
			serialize: function () {
				return {
					name: this.name,
					pnl: this.panelName,
					dev1: this.active1,
					dev2: this.active2,
					dev3: this.active3,
					col: this.color,
					col1: this.color1,
					col2: this.color2,
					col3: this.color3,
					ptrn: this.pattern,
					ptrn1: this.pattern1,
					ptrn2: this.pattern2,
					ptrn3: this.pattern3,
					lw: this.lineWidth,
					lw1: this.lineWidth1,
					lw2: this.lineWidth2,
					lw3: this.lineWidth3,
					d0: this.d0,
					d1: this.d1,
					tzo0: this.tzo0,
					tzo1: this.tzo1,
					fld: this.field
				};
			}
		},
		true
	);

	/**
	 * trendline is an implementation of a {@link CIQ.Drawing.segment} drawing.
	 *
	 * Extends {@link CIQ.Drawing.segment} and automatically renders a {@link CIQ.Drawing.callout}
	 * containing trend information.
	 * @constructor
	 * @name CIQ.Drawing.trendline
	 * @since 5.1.2
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.trendline = function () {
		this.name = "trendline";
	};

	CIQ.inheritsFrom(CIQ.Drawing.trendline, CIQ.Drawing.segment);

	// allow configuration of font for trendline info in callout, which is then assigned later
	CIQ.Drawing.trendline.prototype.configs = [
		"color",
		"fillColor",
		"lineWidth",
		"pattern",
		"font"
	];

	CIQ.Drawing.trendline.prototype.measure = function () {
		// empty function since the text will now display in a callout
	};

	CIQ.Drawing.trendline.prototype.reconstruct = function (stx, obj) {
		// reconstruct segment as usual, then add callout as property
		CIQ.Drawing.segment.prototype.reconstruct.call(this, stx, obj);
		this.callout = new CIQ.Drawing.callout();
		this.callout.reconstruct(stx, obj.callout);
	};

	CIQ.Drawing.trendline.prototype.serialize = function () {
		// serialize segment as usual, then add callout as property
		var obj = CIQ.Drawing.segment.prototype.serialize.call(this);
		obj.callout = this.callout.serialize();
		return obj;
	};

	CIQ.Drawing.trendline.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;

		// render segment as usual
		CIQ.Drawing.segment.prototype.render.call(this, context);

		// only create and initialize callout once
		if (!this.callout) {
			this.callout = new CIQ.Drawing.callout();
			var obj = CIQ.Drawing.segment.prototype.serialize.call(this);
			this.callout.reconstruct(this.stx, obj);
		}

		// always render the callout perpendicular above / below the segment / trendline
		this.callout.p0 = CIQ.clone(this.p0);

		// extract segment coordinates
		var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
		var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
		var y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
		var y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

		// return if we are off the screen axes else insanity ensues
		if (!isFinite(y0) || !isFinite(y1)) return;

		// calculate midpoint (for stem of callout)
		var xmid = (x0 + x1) / 2;
		var ymid = (y0 + y1) / 2;

		// determine length of segment and multiplier / direction of normal vector to give fixed length depending on stem location
		this.fontSize = CIQ.stripPX((this.font && this.font.size) || 13);
		var stemDist =
			this.callout.w * 1.2 + (this.callout.stemEntry[0] == "c" ? 0 : 50);
		var segmentDist = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
		var scalar =
			(stemDist / (segmentDist || stemDist)) *
			(this.p1[1] < this.p0[1] ? 1 : -1);

		// normal vector (see e.g. http://mathworld.wolfram.com/NormalVector.html)
		var nX = -(y1 - ymid) * scalar + xmid;
		var nY = (x1 - xmid) * scalar + ymid;

		// assign callout coordinates
		this.callout.p0[0] = this.stx.tickFromPixel(nX, panel.chart);
		this.callout.p0[1] = this.stx.priceFromPixel(nY, panel);
		this.callout.v0 = this.callout.p0[1];
		this.callout.p1 = CIQ.clone(this.p0);

		// assign callout properties
		this.callout.stx = this.stx;
		this.callout.fillColor = this.fillColor || this.callout.fillColor;
		this.callout.borderColor = this.color;
		this.callout.font = this.font || this.callout.font;
		this.callout.noHandles = true;

		// calculate trend and assign to callout text; only show percent if not Inf
		var deltaV = this.p1[1] - this.p0[1];
		this.callout.text =
			"" +
			Number(deltaV).toFixed(2) +
			(this.p0[1] === 0
				? ""
				: " (" + Number((100 * deltaV) / this.p0[1]).toFixed(2) + "%) ") +
			"" +
			Math.abs(this.p1[0] - this.p0[0]) +
			" Bars";

		// calculate stem as midpoint of segment
		var midtickIdx = Math.floor((this.p0[0] + this.p1[0]) / 2),
			midV;
		if (
			Math.abs(this.p0[0] - this.p1[0]) > 1 &&
			Math.abs(this.p0[0] - this.p1[0]) < 20
		) {
			// because of math.floor, we may be grabbing a bar off of center,
			// so calculate price based on slope of trendline
			var midtickXpixel = this.stx.pixelFromTick(midtickIdx, panel.chart);
			var midtickYpixel = y0 + ((y1 - y0) / (x1 - x0)) * (midtickXpixel - x0);
			midV = this.stx.priceFromPixel(midtickYpixel, panel) || ymid;
		} else {
			midV = this.stx.priceFromPixel(ymid, panel);
		}

		this.callout.stem = {
			t: midtickIdx,
			v: midV
		};

		// render callout and text
		this.callout.renderText();
		this.callout.render(context);

		// paint the handle circles based on highlighting
		if (this.highlighted) {
			var p0Fill = this.highlighted == "p0" ? true : false;
			var p1Fill = this.highlighted == "p1" ? true : false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		}
	};

	CIQ.Drawing.trendline.prototype.lineIntersection = function (
		tick,
		value,
		box,
		type
	) {
		// override type as segment to preserve lineIntersection functionality
		return CIQ.Drawing.BaseTwoPoint.prototype.lineIntersection.call(
			this,
			tick,
			value,
			box,
			"segment"
		);
	};

	CIQ.Drawing.trendline.prototype.intersected = function (tick, value, box) {
		// in case invalid drawing (such as from panel that no longer exists)
		if (!this.p0 || !this.p1) return null;

		// call and store intersection methods on both callout and segment
		var calloutIntersected = this.callout.intersected(tick, value, box);
		var segmentIntersected = CIQ.Drawing.segment.prototype.intersected.call(
			this,
			tick,
			value,
			box
		);

		// synchronize highlighting
		this.callout.highlighted = !!(calloutIntersected || segmentIntersected);
		//this.highlighted = segmentIntersected || calloutIntersected;

		if (segmentIntersected) {
			// If segment is highlighted, return as usual;
			return segmentIntersected;
		} else if (calloutIntersected) {
			// Otherwise, if callout is highlighted, move segment (callout will follow / rerender)
			return {
				action: "move",
				p0: CIQ.clone(this.p0),
				p1: CIQ.clone(this.p1),
				tick: tick, // save original tick
				value: value // save original value
			};
		}

		// neither are intersected
		return null;
	};

	/**
	 * Average Line drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.regression}
	 * @constructor
	 * @name  CIQ.Drawing.average
	 * @since 4.0.0
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.average = function () {
		this.name = "average";
	};
	CIQ.inheritsFrom(CIQ.Drawing.average, CIQ.Drawing.regression);
	CIQ.extend(
		CIQ.Drawing.average.prototype,
		{
			configs: CIQ.Drawing.regression.prototype.configs.concat("axisLabel"),
			measure: function () {
				if (this.p0 && this.p1) {
					this.stx.setMeasure(
						0,
						false,
						this.p0[0],
						this.p1[0],
						true,
						this.name
					);
					var txt = [],
						html = "";
					if (this.active1) txt.push("1");
					if (this.active2) txt.push("2");
					if (this.active3) txt.push("3");
					if (txt.length) html = "&ensp;" + txt.join(", ") + " &sigma;";
					var mMeasure = (this.stx.drawingContainer || document).querySelector(
						".mMeasure"
					);
					var mSticky = this.stx.controls.mSticky;
					var mStickyInterior =
						mSticky && mSticky.querySelector(".mStickyInterior");
					if (mMeasure) mMeasure.innerHTML += html;
					if (mStickyInterior) {
						var lines = [];
						lines.push(CIQ.capitalize(this.name));
						lines.push(this.field || this.stx.defaultPlotField || "Close");
						lines.push(mStickyInterior.innerHTML + html);
						mStickyInterior.innerHTML = lines.join("<br>");
					}
				}
			},
			render: function (context) {
				var panel = this.stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				if (this.p0[0] < 0 || this.p1[0] < 0) return;
				var x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
				if (x0 < panel.left && x1 < panel.left) return;
				if (x0 > panel.right && x1 > panel.right) return;
				var yAxis = this.stx.getYAxisByField(panel, this.field);

				var stx = this.stx;
				var start = Math.min(this.p1[0], this.p0[0]);
				var end = Math.max(this.p1[0], this.p0[0]) + 1;
				var rawTicks = end - start;
				var sumCloses = 0;
				var prices = [];
				var i, price;

				for (i = start; i < end; i++) {
					price = this.getYValue(i);
					if (price !== null) {
						sumCloses += price.transformed;
						prices.push(price);
					}
				}

				var validTicks = prices.length;
				if (!validTicks) return;

				var average = sumCloses / validTicks;
				var y = stx.pixelFromTransformedValue(average, panel, yAxis);
				var color = this.getLineColor();
				var params = {
					pattern: this.pattern,
					lineWidth: this.lineWidth
				};

				stx.plotLine(x0, x1, y, y, color, "segment", context, panel, params);
				stx.plotLine(
					x0,
					x0,
					y - 20,
					y + 20,
					color,
					"segment",
					context,
					panel,
					params
				);
				stx.plotLine(
					x1,
					x1,
					y - 20,
					y + 20,
					color,
					"segment",
					context,
					panel,
					params
				);

				function formatPrice(price, yAxis) {
					if (yAxis && yAxis.priceFormatter)
						price = yAxis.priceFormatter(stx, panel, price);
					else price = stx.formatYAxisPrice(price, panel, null, yAxis);
					return price;
				}

				if (this.axisLabel && !this.highlighted && !this.penDown) {
					if (
						(x0 >= panel.chart.left && x0 <= panel.chart.right) ||
						(x1 >= panel.chart.left && x1 <= panel.chart.right)
					) {
						stx.endClip();
						stx.createYAxisLabel(
							panel,
							formatPrice(average, yAxis),
							y,
							color,
							null,
							context,
							yAxis
						);
						stx.startClip(panel.name);
					}
				}

				if (this.active1 || this.active2 || this.active3) {
					var sumStddev = 0;
					for (i = 0; i < validTicks; i++) {
						price = prices[i];
						sumStddev += Math.pow(price.transformed - average, 2);
					}
					var stddev = Math.sqrt(sumStddev / validTicks);
					var parameters = {
						context: context,
						formatPrice: formatPrice,
						panel: panel,
						points: {
							0: { x: x0, v: average },
							1: { x: x1, v: average }
						},
						stddev: stddev,
						yAxis: yAxis
					};

					this.lines = {};

					if (this.active1) {
						this.renderStddev("1", "p", parameters);
						this.renderStddev("1", "n", parameters);
					}

					if (this.active2) {
						this.renderStddev("2", "p", parameters);
						this.renderStddev("2", "n", parameters);
					}

					if (this.active3) {
						this.renderStddev("3", "p", parameters);
						this.renderStddev("3", "n", parameters);
					}
				}

				if (!this.highlighted) {
					this.pixelX = [x0, x1];
					this.pixelY = [y, y];
				} else {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y, p0Fill);
					this.littleCircle(context, x1, y, p1Fill);
				}
			},
			reconstruct: function (stx, obj) {
				this.axisLabel = obj.al;
				CIQ.Drawing.regression.prototype.reconstruct.call(this, stx, obj);
			},
			serialize: function () {
				var obj = CIQ.Drawing.regression.prototype.serialize.call(this);
				obj.al = this.axisLabel;
				return obj;
			}
		},
		true
	);

	/**
	 * Quadrant Lines drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.speedarc}
	 * @constructor
	 * @name  CIQ.Drawing.quadrant
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.quadrant = function () {
		this.name = "quadrant";
	};
	CIQ.inheritsFrom(CIQ.Drawing.quadrant, CIQ.Drawing.regression);
	CIQ.extend(
		CIQ.Drawing.quadrant.prototype,
		{
			configs: ["color", "fillColor", "lineWidth", "pattern"],
			copyConfig: function () {
				this.color = this.stx.currentVectorParameters.currentColor;
				this.fillColor = this.stx.currentVectorParameters.fillColor;
				this.lineWidth = this.stx.currentVectorParameters.lineWidth;
				this.pattern = this.stx.currentVectorParameters.pattern;
			},
			// turn off cvp controls used by regression
			$controls: [],
			render: function (context) {
				var stx = this.stx;
				var panel = stx.panels[this.panelName];
				if (!panel) return;
				if (!this.p1) return;
				var x0 = stx.pixelFromTick(this.p0[0], panel.chart);
				var x1 = stx.pixelFromTick(this.p1[0], panel.chart);
				if (x0 < panel.left && x1 < panel.left) return;
				if (x0 > panel.right && x1 > panel.right) return;
				var yAxis = this.stx.getYAxisByField(panel, this.field);

				var highest = null,
					lowest = null;
				for (
					var i = Math.min(this.p1[0], this.p0[0]);
					i <= Math.max(this.p1[0], this.p0[0]);
					i++
				) {
					var price = this.getYValue(i);
					if (price !== null) {
						if (highest === null || price.transformed > highest) {
							highest = price.transformed;
						}
						if (lowest === null || price.transformed < lowest) {
							lowest = price.transformed;
						}
					}
				}

				var y0 = stx.pixelFromTransformedValue(highest, panel, yAxis);
				var y25 = stx.pixelFromTransformedValue(
					(3 * highest + lowest) / 4,
					panel,
					yAxis
				);
				var y33 = stx.pixelFromTransformedValue(
					(2 * highest + lowest) / 3,
					panel,
					yAxis
				);
				var y50 = stx.pixelFromTransformedValue(
					(highest + lowest) / 2,
					panel,
					yAxis
				);
				var y66 = stx.pixelFromTransformedValue(
					(highest + 2 * lowest) / 3,
					panel,
					yAxis
				);
				var y75 = stx.pixelFromTransformedValue(
					(highest + 3 * lowest) / 4,
					panel,
					yAxis
				);
				var y100 = stx.pixelFromTransformedValue(lowest, panel, yAxis);

				this.p0[1] = 0;
				this.p1[1] = false; // only used for setMeasure

				var trendLineColor = this.getLineColor();

				var fillColor = this.fillColor;
				if (fillColor == "auto" || CIQ.isTransparent(fillColor))
					fillColor = stx.defaultColor;
				context.fillStyle = fillColor;

				var parameters = {
					pattern: this.pattern,
					lineWidth: this.lineWidth
				};
				stx.plotLine(
					x0,
					x1,
					y0,
					y0,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				stx.plotLine(
					x0,
					x1,
					y100,
					y100,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				if (this.name == "quadrant") {
					stx.plotLine(
						x0,
						x1,
						y25,
						y25,
						trendLineColor,
						"segment",
						context,
						panel,
						parameters
					);
					stx.plotLine(
						x0,
						x1,
						y75,
						y75,
						trendLineColor,
						"segment",
						context,
						panel,
						parameters
					);
				} else if (this.name == "tirone") {
					stx.plotLine(
						x0,
						x1,
						y33,
						y33,
						trendLineColor,
						"segment",
						context,
						panel,
						parameters
					);
					stx.plotLine(
						x0,
						x1,
						y66,
						y66,
						trendLineColor,
						"segment",
						context,
						panel,
						parameters
					);
				}
				stx.plotLine(
					x0,
					x0,
					y0,
					y100,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				stx.plotLine(
					x1,
					x1,
					y0,
					y100,
					trendLineColor,
					"segment",
					context,
					panel,
					parameters
				);
				stx.plotLine(
					x0,
					x1,
					y50,
					y50,
					trendLineColor,
					"segment",
					context,
					panel,
					CIQ.extend(parameters, { opacity: this.name == "tirone" ? 0.2 : 1 })
				);

				context.globalAlpha = 0.1;
				context.beginPath();
				context.fillRect(x0, y0, x1 - x0, y100 - y0);
				if (this.name == "quadrant") {
					context.fillRect(x0, y25, x1 - x0, y75 - y25);
				} else if (this.name == "tirone") {
					context.fillRect(x0, y33, x1 - x0, y66 - y33);
				}
				context.globalAlpha = 1;

				if (!this.highlighted) {
					//move points
					this.pixelX = [x0, x1];
					this.pixelY = [y0, y100];
					if (panel.yAxis.flipped) this.pixelY.reverse();
					this.pixelY.push(y50);
				} else {
					var p0Fill = this.highlighted == "p0" ? true : false;
					var p1Fill = this.highlighted == "p1" ? true : false;
					this.littleCircle(context, x0, y50, p0Fill);
					this.littleCircle(context, x1, y50, p1Fill);
				}
			},
			intersected: function (tick, value, box) {
				if (!this.pixelX || !this.pixelY) return null;

				var repositionIntersection = this.repositionIntersection(tick, value);
				if (repositionIntersection) return repositionIntersection;

				// check for point intersection
				for (var pt = 0; pt < 2; pt++) {
					if (
						this.pointIntersection(this.pixelX[pt], this.pixelY[2], box, true)
					) {
						this.highlighted = "p" + pt;
						return {
							action: "drag",
							point: "p" + pt
						};
					}
				}
				if (this.boxIntersection(null, null, box)) {
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
			},
			reconstruct: function (stx, obj) {
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
				this.field = obj.fld;
				this.adjust();
			},
			serialize: function () {
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
					fld: this.field
				};
			}
		},
		true
	);

	/**
	 * Tirone Levels drawing tool.
	 *
	 * It inherits its properties from {@link CIQ.Drawing.quadrant}
	 * @constructor
	 * @name  CIQ.Drawing.tirone
	 * @since 2016-09-19
	 * @version ChartIQ Advanced Package
	 */
	CIQ.Drawing.tirone = function () {
		this.name = "tirone";
	};
	CIQ.inheritsFrom(CIQ.Drawing.tirone, CIQ.Drawing.quadrant);

	/**
	 * Creates the Elliott Wave drawing tool.
	 *
	 * @property {Array} points Contains a sub-array of ticks and values for each point.
	 * @property {Array} pts Contains a sub-array of pixel positions for the (x, y) coordinates of
	 * 		a point and the (x, y) annotation origin point.
	 * @property {Array} annotationPoints Contains an annotation for each point along the wave.
	 * 		The length of the wave is determined by the length of this array. Always starts with 0.
	 * @property {number} [dx=0] X-axis offset value away from the point that determines the
	 * 		x-coordinate origin of the annotaion.
	 * @property {number} [dy=-20] Y-axis offset value away from the point that determines the
	 * 		y-coordinate origin of the annotation.
	 * @property {Boolean} dragToDraw=false Sets the drawing mode to multi-point-draw rather than
	 * 		drag-to-draw. Elliott waves are multiple-point drawings; and so, are incompatible with
	 * 		dragging to draw points. See {@link CIQ.Drawing#dragToDraw}.
	 * @property {number} enclosedRadius The width of the largest text string enclosed in the
	 * 		wave annotations. By default `undefined`.
	 * 		See {@link CIQ.Drawing.elliottwave#calculateRadius}.
	 *
	 * @constructor
	 * @name CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave = function () {
		this.name = "elliottwave";
		this.lastPoint = 0;
		this.points = [];
		this.pts = [];
		this.dx = 0;
		this.dy = -20;
		this.dragToDraw = false;
		this.annotationPoints = [];
		this.edit = null;
	};

	CIQ.inheritsFrom(CIQ.Drawing.elliottwave, CIQ.Drawing.annotation);

	CIQ.Drawing.elliottwave.defaultTemplate = {
		impulse: ["I", "II", "III", "IV", "V"],
		corrective: ["A", "B", "C"],
		decoration: "enclosed",
		showLines: true
	};

	CIQ.Drawing.elliottwave.prototype.initializeSettings = function (stx) {
		stx.currentVectorParameters.waveParameters = CIQ.clone(
			CIQ.Drawing.elliottwave.defaultTemplate
		);
	};

	/**
	 * The initial configuration settings of the drawing.
	 *
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 * @private
	 */
	CIQ.Drawing.elliottwave.prototype.configs = [
		"color",
		"lineWidth",
		"lineColor",
		"pattern",
		"font",
		"waveParameters"
	];

	/**
	 * The query strings that are activated by the {@link CIQ.UI.DrawingSettings} component.
	 *
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 * @private
	 */
	CIQ.Drawing.elliottwave.prototype.$controls = [
		"br[cq-wave-parameters]",
		"cq-wave-parameters"
	];

	/**
	 * Initializes the drawing. Assigns the `waveParameters` object of
	 * {@link CIQ.ChartEngine#currentVectorParameters} to the current drawing instance.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart engine.
	 * @param {CIQ.ChartEngine.Panel} panel The panel that contains the drawing.
	 * @memberOf CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.construct = function (stx, panel) {
		this.stx = stx;
		this.panelName = panel.name;
		var cvp = stx.currentVectorParameters;
		Object.assign(this, cvp.waveParameters);
	};

	/**
	 * Serializes the drawing to an object that can be restored with
	 * {@link CIQ.Drawing.elliottwave#reconstruct}. To store a drawing, convert the object returned
	 * by this function to a JSON string.
	 *
	 * @return {object} An object that contains the serialized state of the drawing.
	 * @memberOf CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.serialize = function () {
		var points = {};
		for (var i = 0; i < this.points.length; i++) {
			points["d" + i] = this["d" + i];
			points["tzo" + i] = this["tzo" + i];
			points["v" + i] = this["v" + i];
		}

		points.annotations = this.annotationPoints.join(",");

		return Object.assign(
			{
				name: this.name,
				pnl: this.panelName,
				col: this.color,
				ptrn: this.pattern,
				lw: this.lineWidth,
				mxSeg: this.maxSegments,
				show: this.showLines,
				decor: this.decoration,
				dx: this.dx,
				dy: this.dy,
				trend: this.trend,
				fnt: CIQ.removeNullValues(
					CIQ.replaceFields(this.font, {
						style: "st",
						size: "sz",
						weight: "wt",
						family: "fl"
					})
				)
			},
			points
		);
	};

	/**
	 * Reconstructs the drawing from an object returned from {@link CIQ.Drawing.elliottwave#serialize}.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart engine.
	 * @param {object} obj The object that contains the serialized drawing.
	 * @memberOf CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.reconstruct = function (stx, obj) {
		this.stx = stx;
		this.color = obj.col;
		this.panelName = obj.pnl;
		this.pattern = obj.ptrn;
		this.lineWidth = obj.lw;
		this.font = CIQ.replaceFields(obj.fnt, {
			st: "style",
			sz: "size",
			wt: "weight",
			fl: "family"
		});
		this.decoration = obj.decor;
		this.showLines = obj.show;
		this.dx = obj.dx;
		this.dy = obj.dy;
		this.trend = obj.trend;
		this.annotationPoints = obj.annotations.split(",");
		if (obj.decor === "enclosed")
			this.calculateRadius(stx.chart.tempCanvas.context);
		this.maxSegments = obj.mxSeg;
		this.reconstructPoints(obj);
		this.adjust();
	};

	/**
	 * Reconstructs the points of a wave and sets points so the drawing can be rendered.
	 *
	 * @param {object} obj The object passed into {@link CIQ.Drawing.elliottwave#reconstruct}.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 * @private
	 */
	CIQ.Drawing.elliottwave.prototype.reconstructPoints = function (obj) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		// this.points=[];
		for (var p = 0; p < this.annotationPoints.length; p++) {
			// var d=CIQ.strToDateTime(this.annotationPoints[p]);
			this["d" + p] = obj["d" + p];
			this["v" + p] = obj["v" + p];
			this["tzo" + p] = obj["tzo" + p];
			var dt = CIQ.strToDateTime(obj["d" + p]);
			var tick = this.stx.tickFromDate(dt, panel.chart);
			// d.setMinutes(d.getMinutes()+Number(this.annotationPoints[p+1])-d.getTimezoneOffset());
			this.points.push([tick, obj["v" + p]]);
		}
	};

	/**
	 * Calculates the width of the text enclosed in the annotation decorations. Iterates through the
	 * annotation points of the wave, measures the text of each annotation, and sets
	 * {@link CIQ.Drawing.elliottwave.enclosedRadius} to the width of the largest measurement.
	 *
	 * If you would like to customize the radius, override this function with another that sets the
	 * value of `enclosedRadius`.
	 *
	 * @param {external:CanvasRenderingContext2D} context The rendering context, which does the calculations.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.calculateRadius = function (context) {
		this.getFontString();
		context.font = this.fontString;
		var measure = 0;
		for (var p = 0; p < this.annotationPoints.length; p++) {
			var width = context.measureText(this.annotationPoints[p]).width;
			if (measure < width) measure = width;
		}
		this.enclosedRadius = measure;
	};

	/**
	 * Ensures that each successive data point is positioned correctly in the Elliott Wave progression.
	 * Called by {@link CIQ.ChartEngine#drawingClick}.
	 *
	 * @param {Number} tick The tick where the wave data point is to be positioned.
	 * @param {Number} value The value (price) indicated by the tick where the wave data point is to be positioned.
	 * @param {Number} pt Represents whether the previous line was a gain or loss wave. If equal to 1, represents
	 * 		the first segment of the wave, which always results in a return value of true.
	 * @return {Boolean} Indicates whether or not the current wave data point has been positioned correctly.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.check = function (tick, value, pt) {
		function isValidTrend(y) {
			for (var i = 2; i < y.length; i++) {
				if (
					Math.sign(y[i][1] - y[i - 1][1]) ==
					Math.sign(y[i - 1][1] - y[i - 2][1])
				)
					return false;
			}
			return true;
		}
		// setting first point is always true
		if (pt === 1 && this.points.length === 2) return true;
		var prev = this.points[pt - 1];
		if (prev && tick <= prev[0]) return false;
		var next = this.points[pt + 1];
		if (next && tick >= next[0]) return false;
		if (!isValidTrend(this.points)) return false;
		return true;
	};

	/**
	 * Renders the movement when the user moves the drawing.
	 *
	 * @param {external:CanvasRenderingContext2D} context The canvas context in which to render the moving drawing.
	 * @param {Number} tick The tick to which the drawing is being moved.
	 * @param {Number} value The value to which the drawing is being moved.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.move = function (context, tick, value) {
		this.copyConfig();
		this.points[this.lastPoint + 1] = [tick, value];
		this.render(context);
	};

	/**
	 * Resets the points of the drawing when the periodicity changes or the underlying ticks change
	 * (either from pagination or from moving the points).
	 *
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.adjust = function () {
		// If the drawing's panel doesn't exist then we'll check to see
		// whether the panel has been added. If not then there's no way to adjust
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		for (var p = 0; this.maxSegments + 1 > p; p++) {
			var dt = this["d" + p];
			this.setPoint(p, dt, this["v" + p], panel.chart);
			this.points[p][0] = this.stx.tickFromDate(
				CIQ.strToDateTime(dt),
				panel.chart
			);
			this.points[p][1] = this["v" + p];
		}
	};

	/**
	 * Responds to click events on the drawing.
	 *
	 * @param {external:CanvasRenderingContext2D} context Canvas context in which to render the drawing.
	 * @param {Number} tick The tick where the click occurred.
	 * @param {Number} value The value where the click occurred.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.click = function (context, tick, value) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		this.copyConfig();
		if (!this.penDown) {
			this.setPoint(0, tick, value, panel.chart);
			this.points.push(this.p0);
			this.penDown = true;
			this.segment = 0;
			this.lastPoint = 0;
			if (this.impulse)
				this.annotationPoints = this.annotationPoints.concat(this.impulse);
			if (this.corrective)
				this.annotationPoints = this.annotationPoints.concat(this.corrective);
			this.annotationPoints.unshift("0");
			if (this.decoration === "enclosed") this.calculateRadius(context);
			this.maxSegments = this.annotationPoints.length - 1;
			// will be reset on next click for now set here to avoid an additional check in every render loop
			this.trend = 1;
			return false;
		}
		if (this.accidentalClick(tick, value)) {
			this.penDown = true;
			return false;
		}

		if (this.check(tick, value, this.lastPoint + 1)) {
			this.lastPoint++;
			this.setPoint(this.lastPoint, tick, value, panel.chart);
			if (this.lastPoint === 1) {
				this.trend = Math.sign(this.v1 - this.v0);
			}
			this.segment++;

			if (this.segment >= this.maxSegments) {
				this.penDown = false;
				return true;
			}
		}
		return false;
	};

	/**
	 * Renders the wave on the chart.
	 *
	 * @param {external:CanvasRenderingContext2D} context The context in which the drawing is rendered.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.render = function (context) {
		var panel = this.stx.panels[this.panelName];
		if (!panel) return;
		var stx = this.stx;
		var annotationPoints = this.annotationPoints;
		var pattern = this.pattern
			? CIQ.borderPatternToArray(this.lineWidth, this.pattern)
			: [];
		this.getFontString();
		context.font = this.fontString;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.lineWidth = this.lineWidth;
		if (this.fontString !== this.lastFontString) this.calculateRadius(context);
		this.lastFontString = this.fontString;
		var color = this.getLineColor();
		context.fillStyle = context.strokeStyle = color;
		context.save();
		context.setLineDash(pattern);
		var dx = this.dx;
		var dy = this.dy;

		var points = this.points;
		var pts = this.pts;
		var justHighlights = !this.showLines && this.highlighted;
		//gather and set all pixel coordinates also used in intersection calculations
		var l = points.length,
			highlightIndexAboveNeighbors;
		if (this.penDown && this.segment) {
			highlightIndexAboveNeighbors = this.trend * ((l % 2) - 0.5) < 0;
			if (panel.yAxis.flipped)
				highlightIndexAboveNeighbors = !highlightIndexAboveNeighbors;
			this.drawDropZone(
				context,
				points[l - 2][1],
				this.stx.priceFromPixel(
					panel.yAxis[highlightIndexAboveNeighbors ? "top" : "bottom"]
				),
				points[l - 2][0]
			);
		} else if (
			typeof this.highlighted === "string" &&
			this.stx.repositioningDrawing
		) {
			var highlightIndex = parseInt(
				this.highlighted.substring(1, this.highlighted.length),
				10
			);
			highlightIndexAboveNeighbors =
				this.trend * ((highlightIndex % 2) - 0.5) > 0;
			var pointToLeft = points[highlightIndex - 1],
				pointToRight = points[highlightIndex + 1];
			var dragY = highlightIndex > 0 ? pointToLeft[1] : pointToRight[1];
			if (pointToRight)
				dragY = Math[highlightIndexAboveNeighbors ? "max" : "min"](
					dragY,
					pointToRight[1]
				);
			if (panel.yAxis.flipped)
				highlightIndexAboveNeighbors = !highlightIndexAboveNeighbors;
			this.drawDropZone(
				context,
				dragY,
				this.stx.priceFromPixel(
					panel.yAxis[highlightIndexAboveNeighbors ? "top" : "bottom"]
				),
				pointToLeft ? pointToLeft[0] : null,
				pointToRight ? pointToRight[0] : null
			);
		}
		for (var p = 0; p < l; p++) {
			var last = points[p];
			var xx = stx.pixelFromTick(last[0], panel.chart);
			var yy = stx.pixelFromValueAdjusted(panel, last[0], last[1]);
			pts[p] = [xx, yy];
		}
		p = 0;

		if (this.showLines || justHighlights) {
			context.beginPath();
			if (justHighlights) context.globalAlpha = 0.3;
			for (; p < pts.length; p++) {
				context.lineTo(pts[p][0], pts[p][1]);
			}
			context.stroke();
			p = 0;
		}

		// Reset for Enclosed Annnotations
		context.restore();
		// Has to be a separate loop otherwise you have a line coming from the center point of the enclosed decoration
		// and your annotations have the oppacity of 0.3 when showLines is false
		for (; p < l; p++) {
			var pdx = p % 2 ? dx : -dx;
			var pdy = p % 2 ? dy : -dy;
			// Places the annotation above or below the based on wave trend
			pdx *= this.trend;
			pdy *= this.trend;
			if (panel.yAxis.flipped) {
				pdx *= -1;
				pdy *= -1;
			}
			var pt = pts[p];
			var x = (pt[2] = pt[0] + pdx);
			var y = (pt[3] = pt[1] + pdy);
			var radius = this.enclosedRadius || 8;
			var content = annotationPoints[p];
			if (this.decoration === "parentheses") content = "(" + content + ")";
			context.fillText(content, x, y);
			if (this.decoration === "enclosed") {
				context.beginPath();
				context.arc(x, y, radius, 0, 2 * Math.PI, false);
				context.stroke();
			}
			if (this.highlighted) {
				context.save();
				this.littleCircle(
					context,
					this.pts[p][0],
					this.pts[p][1],
					this.highlighted === "p" + p
				);
				context.restore();
			}
		}
	};

	/**
	 * Repositions the drawing on drag (user moves an individual point of the drawing) or move
	 * (user moves the whole drawing) interactions.
	 *
	 * @param {external:CanvasRenderingContext2D} context The canvas context on which to render the drawing.
	 * @param {Object} repositioner The object containing data on how to reposition the drawing.
	 * @param {Number} tick The tick to which the drawing is repositioned.
	 * @param {Number} value The value to which the drawing is repositioned.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.reposition = function (
		context,
		repositioner,
		tick,
		value
	) {
		if (!repositioner) return;
		var panel = this.stx.panels[this.panelName];
		var tickDiff = repositioner.tick - tick;
		var valueDiff = repositioner.value - value;
		if (repositioner.action === "move") {
			for (var p = 0; repositioner.points.length > p; p++) {
				var pt = repositioner.points[p];
				this.setPoint(p, pt[0] - tickDiff, pt[1] - valueDiff, panel.chart);
				this.points[p] = [pt[0] - tickDiff, pt[1] - valueDiff];
			}
		}
		if (repositioner.action === "drag") {
			var point = repositioner.point;
			var points = this.points;
			points[point] = [tick, value];
			if (this.check(tick, value, point)) {
				// if(this.check(points[point], points[point+1], point)) {
				this.setPoint(point, tick, value, panel.chart);
				// }
			}
			// else this.points[point]=this["p"+point];
		}
		this.render(context);
	};

	/**
	 * Detects when the wave drawing has been intersected at either a point or the segments of the wave.
	 *
	 * @param {Number} tick The tick under the mouse cursor.
	 * @param {Number} value The value under the mouse cursor.
	 * @param {Object} box A rectangular area around the mouse cursor.
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.intersected = function (tick, value, box) {
		if (!this.p0 || !this.p1) return null;
		var positioning;

		for (var i = 0; this.points.length > i; i++) {
			var pt = this.points[i];
			if (this.pointIntersection(pt[0], pt[1], box)) {
				this.highlighted = "p" + i;
				return {
					action: "drag",
					point: i,
					tick: tick,
					value: value
				};
			}

			if (
				this.points[i + 1] &&
				this.lineIntersection(
					tick,
					value,
					box,
					"segment",
					pt,
					this.points[i + 1]
				)
			) {
				this.highlighted = true;
				// This object will be used for repositioning
				positioning = {
					action: "move",
					points: CIQ.clone(this.points),
					tick: tick, // save original tick
					value: value // save original value
				};
			}
		}
		return positioning;
	};

	/**
	 * Displays the following:
	 * - The value at the last point in the drawing or at the drawing cursor position minus the value at the original wave point
	 * - The percentage change: (value at the last point or drawing cursor position - the value at the original wave point) / value at the original wave point
	 * - Number of data points included in the wave drawing
	 *
	 * @memberof CIQ.Drawing.elliottwave
	 * @since 7.4.0
	 */
	CIQ.Drawing.elliottwave.prototype.measure = function () {
		if (this.points.length >= 2) {
			var points = this.points;
			this.stx.setMeasure(
				points[0][1],
				points[points.length - 1][1],
				points[0][0],
				points[points.length - 1][0],
				true
			);
			var mSticky = this.stx.controls.mSticky;
			var mStickyInterior =
				mSticky && mSticky.querySelector(".mStickyInterior");
			if (mStickyInterior) {
				var lines = [];
				lines.push(CIQ.capitalize("Elliott Wave"));
				if (this.getYValue)
					lines.push(this.field || this.stx.defaultPlotField || "Close");
				lines.push(mStickyInterior.innerHTML);
				mStickyInterior.innerHTML = lines.join("<br>");
			}
		}
	};

	/**
	 * @private
	 */
	CIQ.Drawing.printProjection = function (self, projection, tmpHist) {
		var nd = projection.arr;
		if (nd.length > 1) {
			var dt = nd[0][0];
			var maxTicks = Math.round(self.chart.maxTicks * 0.75);
			for (var i = 1; i < nd.length; i++) {
				var dt0 = nd[i - 1][0];
				var dt1 = nd[i][0];

				// Figure length in days
				var d = CIQ.strToDateTime(dt0);
				var m1 = CIQ.strToDateTime(dt1).getTime();
				var iter = self.standardMarketIterator(d);
				var l = 0;
				while (d.getTime() < m1) {
					d = iter.next();
					l += 1;
				}
				// Find beginning position in existing data set
				var m = CIQ.strToDateTime(dt0).getTime();
				var tick;
				if (m > CIQ.strToDateTime(tmpHist[tmpHist.length - 1].Date).getTime()) {
					// This can only happen if the projection is drawn before intraday tick arrives
					tick = tmpHist.length - 1;
					l += 1;
				} else {
					for (tick = tmpHist.length - 1; tick >= 0; tick--) {
						if (m <= CIQ.strToDateTime(tmpHist[tick].Date).getTime()) break;
					}
				}

				var v = {
					x0: 0,
					x1: l,
					y0: tmpHist[tick].Close,
					y1: nd[i][1]
				};

				// Iterate, calculate prices and append to data set
				dt = CIQ.strToDateTime(dt0);
				iter = self.standardMarketIterator(dt);
				var first = false;
				for (var t = 0; t <= l; t++) {
					if (!first) {
						first = true;
					} else {
						dt = iter.next();
					}
					if (dt.getTime() <= tmpHist[tmpHist.length - 1].DT.getTime())
						continue;

					var y = CIQ.yIntersection(v, t);
					if (!y) y = 0;
					var price = Math.round(y * 10000) / 10000;
					if (price === 0) price = nd[i][1];

					var prices = {
						Date: CIQ.yyyymmddhhmmssmmm(dt),
						DT: dt,
						Open: price,
						Close: price,
						High: price,
						Low: price,
						Volume: 0,
						Adj_Close: price,
						Split_Close: price,
						projection: true
					};
					if (self.layout.interval == "minute") if (maxTicks-- < 0) break;
					tmpHist[tmpHist.length] = prices;
				}
			}
		}
	};
}

};

let __js_advanced_equationsAdvanced_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.computeEquationChart) {
	console.error(
		"equationsAdvanced feature requires first activating equations feature."
	);
} else {
	/**
	 * Extracts symbols from an equation.  An equation can consist of symbols and the following operators: +-/*%()
	 * PEMDAS order is followed.  Additionally, symbols can be enclosed in brackets [] to treat them as literal non-parseables.
	 * @param {string} equation The equation to parse (e.g. IBM+GE)
	 * @return  {object} Parsed equation, {equation: [formatted equation], symbols: [array of symbols found in the equation]}
	 * @memberOf CIQ
	 * @version ChartIQ Advanced Package
	 */
	CIQ.formatEquation = function (equation) {
		var eq = "";
		var syms = [];
		var thisSym = "";
		var lockSymbol = false;
		for (var j = 1; j < equation.length; j++) {
			var c = equation[j].toUpperCase();
			if (c == "[" && !lockSymbol) {
				lockSymbol = true;
			} else if (c == "]" && lockSymbol) {
				lockSymbol = false;
				if (thisSym !== "") {
					syms.push(thisSym);
					eq += "[" + thisSym + "]";
				}
				thisSym = "";
			} else if (lockSymbol) {
				thisSym += c;
			} else if (
				c == "+" ||
				c == "-" ||
				c == "*" ||
				c == "/" ||
				c == ":" ||
				c == "%" ||
				c == "(" ||
				c == ")"
			) {
				if (thisSym !== "" && isNaN(thisSym)) {
					syms.push(thisSym);
					eq += "[" + thisSym + "]";
				} else {
					eq += thisSym;
				}
				if (c == ":") c = "/";
				eq += c;
				thisSym = "";
			} else if (c != " ") {
				thisSym += c;
			}
		}
		if (thisSym !== "" && isNaN(thisSym)) {
			syms.push(thisSym);
			eq += "[" + thisSym + "]";
		} else {
			eq += thisSym;
		}
		return { equation: eq, symbols: syms };
	};

	/**
	 * Extracts symbols from an equation and fetches the quotes for them.
	 * @param {object} params Parameters used for the fetch
	 * @param  {function} cb Callback function once all quotes are fetched
	 * @memberOf CIQ
	 * @version ChartIQ Advanced Package
	 */
	CIQ.fetchEquationChart = function (params, cb) {
		var formEq = CIQ.formatEquation(params.symbol);
		var syms = formEq.symbols;
		var arr = [];
		// jump through hoops with stx so that CIQ.clone doesn't choke on it
		var stx = params.stx;
		params.stx = null;
		for (var i = 0; i < syms.length; i++) {
			var newParams = CIQ.shallowClone(params);
			newParams.stx = stx;
			newParams.symbol = syms[i];
			newParams.symbolObject = { symbol: syms[i] };
			arr.push(newParams);
		}
		params.stx = stx;
		// multi fetch the symbols we need
		stx.quoteDriver.multiFetch(arr, function (results) {
			var map = {};
			params.loadMoreReplace = true;
			var attribution = { charge: 0 };
			// error on any symbol then error out. Otherwise construct map.
			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				if (result.dataCallback.error) {
					cb({ error: result.dataCallback.error });
					return;
				}
				map[result.params.symbol] = result.dataCallback.quotes;
				params.loadMoreReplace =
					params.loadMoreReplace && result.params.loadMoreReplace;
				params.moreToLoad =
					params.moreToLoad || result.dataCallback.moreAvailable;
				var dataCallbackAttribution = result.dataCallback.attribution;
				if (dataCallbackAttribution) {
					if (dataCallbackAttribution.charge)
						attribution.charge += dataCallbackAttribution.charge;
					attribution.source = dataCallbackAttribution.source;
					if (attribution.exchange === undefined)
						attribution.exchange = dataCallbackAttribution.exchange;
					else if (attribution.exchange != dataCallbackAttribution.exchange)
						attribution.exchange = ""; // mixed exchanges
				}
			}
			// compute the result and then pass to the response
			if (arr.length || !(params.loadMore || params.update)) {
				try {
					var equQuotes = CIQ.computeEquationChart(formEq.equation, map);
					cb({
						quotes: equQuotes,
						moreAvailable: params.moreToLoad,
						attribution: attribution
					});
				} catch (e) {
					var error = { error: "Invalid equation: " + formEq.equation };
					if (e.name && e.name == "NoException") error.suppressAlert = true;
					cb(error);
				}
			}
		});
	};
}

};

let __js_advanced_highPerformanceMarkers_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Marker) {
	console.error(
		"highPerformanceMarkers feature requires first activating markers feature."
	);
} else {
	/**
	 * Removes a high performance canvas marker from the `markerHelper.domMarkers` Array.
	 * We use this instead of {@link CIQ.ChartEngine#removeFromHolder} because that will remove the whole marker instead of just removing the DOM node.
	 *
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance#remove} instead.
	 */
	CIQ.ChartEngine.prototype.removeDOMMarker = function (marker) {
		console.warn(
			"CIQ.ChartEngine#removeDOMMarker is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance#remove instead."
		);
		CIQ.Marker.Performance.prototype.removeDOMMarker.call(
			marker.params.node,
			marker
		);
	};

	/**
	 * <span class="animation">Animation Loop</span>
	 * Iterates through all [high performance canvas]{@link CIQ.Marker.Performance} markers and draws them on the canvas.
	 *
	 * See {@tutorial Markers} tutorials for additional implementation instructions.
	 *
	 * @memberOf CIQ.ChartEngine
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawMarkers} instead.
	 */
	CIQ.ChartEngine.prototype.drawMarkers = function () {
		console.warn(
			"CIQ.ChartEngine#drawMarkers is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawMarkers instead."
		);
		CIQ.Marker.Performance.drawMarkers(this);
	};

	/**
	 * Calculates the styles used in drawing [high performance canvas]{@link CIQ.Marker.Performance} markers.
	 * We use this method instead of other chart styling methods because markers expect styles to cascade down and then be calculated.
	 * Other style methods are for adding or calculating a single property.
	 * This will save styles to the engine's style object where they can be adjusted with {@link CIQ.ChartEngine#setStyle}.
	 *
	 * @memberof CIQ.ChartEngine
	 * @param {CIQ.Marker} marker The marker from which to compute the styles.
	 * @param {string} style Name to save to {@link CIQ.ChartEngine#styles}.
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.calculateMarkerStyles}.
	 */
	CIQ.ChartEngine.prototype.calculateMarkerStyles = function (marker, style) {
		console.warn(
			"CIQ.ChartEngine#calculateMarkerStyles is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.calculateStyles instead."
		);
		CIQ.Marker.Performance.calculateMarkerStyles(this, marker, style);
	};

	/**
	 * Draws a circle for a [high performance canvas]{@link CIQ.Marker.Performance} marker.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawCircleMarker}.
	 */
	CIQ.ChartEngine.prototype.drawCircleMarker = function (
		marker,
		style,
		params
	) {
		console.warn(
			"CIQ.ChartEngine#drawCircleMarker is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawCircleMarker instead."
		);
		CIQ.Marker.Performance.drawCircleMarker(marker, style, params);
	};

	/**
	 * Draws a square for a [high performance canvas]{@link CIQ.Marker.Performance} marker.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawSquareMarker}.
	 */
	CIQ.ChartEngine.prototype.drawSquareMarker = function (
		marker,
		style,
		params
	) {
		console.warn(
			"CIQ.ChartEngine#drawSquareMarker is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawSquareMarker instead."
		);
		CIQ.Marker.Performance.drawSquareMarker(marker, style, params);
	};

	/**
	 * Draws callout (rectangular) a [high performance canvas]{@link CIQ.Marker.Performance} marker.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawCalloutMarker}.
	 */
	CIQ.ChartEngine.prototype.drawCalloutMarker = function (
		marker,
		style,
		params
	) {
		console.warn(
			"CIQ.ChartEngine#drawCalloutMarker is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawCalloutMarker instead."
		);
		CIQ.Marker.Performance.drawCalloutMarker(marker, style, params);
	};

	/**
	 * Draws a stem for a [high performance canvas]{@link CIQ.Marker.Performance} marker.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawMarkerStem}.
	 */
	CIQ.ChartEngine.prototype.drawMarkerStem = function (marker, style, params) {
		console.warn(
			"CIQ.ChartEngine#drawMarkerStem is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawMarkerStem instead."
		);
		CIQ.Marker.Performance.drawMarkerStem(marker, style, params);
	};

	/**
	 * Positions any markers that have DOM elements appended to the chart so that they follow their same canvas marker.
	 *
	 * @private
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Scheduled for deprecation in a future release. See {@link CIQ.Marker.Performance.drawMarkers}.
	 */
	CIQ.ChartEngine.prototype.positionDOMMarkers = function () {
		console.warn(
			"CIQ.ChartEngine#positionDOMMarkers is scheduled for deprecation in a future release\n Please use CIQ.Marker.Performance.drawMarkers instead."
		);
		CIQ.Marker.Performance.drawMarkers(this);
	};

	/**
	 * Creates high performance canvas nodes that can be used with a {@link CIQ.Marker}.
	 *
	 * Use this class if you need to add hundreds or thousands of markers to a chart. When a
	 * marker is created, this class creates a node from the built-in template but does not attach
	 * the node to the DOM until you hover over the canvas drawing. Once you intersect the drawing,
	 * the node is appended and you can interact with it like other markers.
	 *
	 * The canvas draws the marker based on the classes that you append to the template (which
	 * come from `params.type` and `params.category`) being added to `stx-marker` class.
	 * See {@link CIQ.ChartEngine#calculateMarkerStyles} for more information.
	 *
	 * This class takes the same params as {@link CIQ.Marker.Simple} so that the appended DOM
	 * marker works the same. This means that you can reuse all of the default styles you've
	 * created for `CIQ.Marker.Simple` with `CIQ.Marker.Performance`. **Note:** If you do not pass
	 * in either a `headline` or a `story` or both, your marker will not create a pop-up display
	 * when the marker is selected.
	 *
	 * See the {@tutorial Markers} tutorial for additional implementation instructions.
	 *
	 * @param {Object} params Parameters to describe the marker.
	 * @param {string} params.type The marker type to be drawn.
	 * <br>Available options are:
	 * - "circle"
	 * - "square"
	 * - "callout"
	 * @param {string} [params.headline] The headline text to pop up when clicked.
	 * @param {string} [params.category] The category class to add to your marker.
	 * <br>Available options are:
	 * - "news"
	 * - "earningsUp"
	 * - "earningsDown"
	 * - "dividend"
	 * - "filing"
	 * - "split"
	 *
	 * Other custom categories require a corresponding CSS entry. See example.
	 *
	 * @param {boolean} [params.displayCategory=true] Set to false to not draw the first letter of
	 * 		the category in the marker.
	 * @param {string} [params.story] The story to pop up when clicked. If left undefined, the
	 * 		marker displays an empty DOM node when clicked.
	 * @param {string} [params.color] Background color to make your marker. Overrides any style
	 * 		set by `params.category`.
	 * @param {boolean} [params.displayStem=true] Set to false to draw the marker at a specific
	 * 		point and not include the stem.
	 * @param {boolean} [params.invert=false] Set to true to invert the stem and point downward.
	 * @param {boolean} [params.infoOnLeft] If true, the information pop-up box is positioned on
	 * 		the left when possible.
	 * @param {number} [params.infoOffset] Distance to offset the information pop-up box.
	 *
	 * @constructor
	 * @name CIQ.Marker.Performance
	 * @since
	 * - 7.1.0
	 * - 7.2.0 Markers without <u>both</u> a `headline` and `story` are not interactive.
	 * 		You must provide either or both properties for a node (which is the marker pop-up
	 * 		display) to be appended to the DOM. Performance markers now can be positioned anywhere
	 * 		that a DOM marker can be positioned (above, below, or on a candle; at a value; or at
	 * 		the top or bottom of a chart).
	 * - 8.0.0 Added `params.infoOnLeft`, `params.infoOffset`, and `params.invert`.
	 *
	 *
	 * @example
	 * <caption>Required CSS entry for a custom category ("trade"), not included in the default
	 * CSS styles.</caption>
	 *
	 * .stx-marker.trade .stx-visual {
	 *     background: #C950d7;
	 *     width: 5px;
	 *     height: 5px;
	 * }
	 *
	 * // Corresponding code:
	 *
	 * new CIQ.Marker({
	 *     stx: stxx,
	 *     label: "trade",
	 *     xPositioner: "date",
	 *     x: OHLCData.DT,
	 *     node: new CIQ.Marker.Performance({
	 *         type: "circle",
	 *         category: "trade",
	 *         displayCategory: false,
	 *         displayStem: false,
	 *         headline: "Executed at $" + OHLCData.Close,
	 *         story: "Like all ChartIQ markers, the object itself is managed by the chart."
	 *     })
	 * });
	 */
	CIQ.Marker.Performance = function (params) {
		this.params = {
			displayCategory: true,
			displayStem: true,
			invert: false,
			story: "",
			headline: ""
		};
		CIQ.extend(this.params, params);
		var template = (this.template = document.createElement("TEMPLATE"));
		template.innerHTML =
			'<div class="stx-marker highlight">' +
			'<div class="stx-visual">' +
			'<div class="stx-marker-content">' +
			'<div class="stx-marker stx-performance-marker stx-marker-expand"><h4></h4><p></p></div>' +
			"</div>" +
			"</div>" +
			'<div class="stx-stem"></div>' +
			"</div>";
		var n = this.template.content.cloneNode(true);
		var marker = n.querySelector(".stx-marker", template);
		marker.classList.add(params.type);
		marker.classList.add(params.category);
		var visual = n.querySelector(".stx-visual", template);
		var expand = n.querySelector(".stx-marker-expand");
		var header = n.querySelector("h4", template);
		var text = n.querySelector("p", template);
		header.innerText = this.params.headline;
		text.innerText = this.params.story;
		this.hasText = !!params.headline || !!params.story;

		this.deferAttach = true;

		this.node = n.firstChild;
		this.node.params = this.params;
		this.visual = visual;
		this.expand = expand;
		if (params.type === "callout") {
			var h = expand.removeChild(header);
			n.querySelector(".stx-marker-content", template).insertBefore(h, expand);
		}
	};

	CIQ.inheritsFrom(CIQ.Marker.Performance, CIQ.Marker.NodeCreator, false);

	/**
	 * This function keeps you from having a ton of marker expand dialogs from overlapping each other and becoming too hard to read.
	 * Checks the markers that have been marked as highlighted by the chart engine and combines the text of their expands into the last one highlighted.
	 *
	 * @param {CIQ.ChartEngine} stx
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.consolidateExpanded = function (stx) {
		var highlighted = stx.markerHelper.highlighted;
		if (!highlighted.length) return;

		function findInner(marker) {
			var node = marker.params.node,
				expand = node.expand;
			if (!expand) return "";
			var inner = expand.style.display !== "none" ? expand.innerHTML : "";
			return inner;
		}

		var focusedMarker = highlighted[highlighted.length - 1],
			fnode = focusedMarker.params.node;
		if (!focusedMarker.consolidated) focusedMarker.consolidated = [];
		for (var i = highlighted.length - 2; i >= 0; i--) {
			var inner = findInner(highlighted[i]);
			var consolidated = "<consolidated>" + inner + "</consolidated>";
			if (inner.length) fnode.expand.innerHTML += consolidated;
		}
		focusedMarker.stxNodeCreator.quickCache(focusedMarker);
	};

	/**
	 * Resets any highlighted markers to their default display state and removes any consolidated text from the marker.
	 *
	 * @param {CIQ.ChartEngine} stx
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.reconstituteExpanded = function (stx) {
		var reset = stx.markerHelper.highlighted;
		if (!reset.length || !stx.activeMarker) return;
		reset = [stx.activeMarker];

		for (var i = reset.length - 1; i >= 0; i--) {
			var marker = reset[i];
			var node = marker.params.node,
				expand = node.expand;
			while (expand.lastElementChild.nodeName === "CONSOLIDATED") {
				expand.removeChild(expand.lastElementChild);
			}
		}
	};

	/**
	 * <span class="animation">Animation Loop</span>
	 * Iterates through all [high performance canvas]{@link CIQ.Marker.Performance} markers and
	 * draws them on the canvas.
	 *
	 * See {@tutorial Markers} tutorials for additional implementation instructions.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart object.
	 *
	 * @memberof CIQ.Marker.Performance
	 * @static
	 * @since 7.2.0 Replaces {@link CIQ.ChartEngine#drawMarkers}.
	 */
	CIQ.Marker.Performance.drawMarkers = function (stx) {
		var markers = stx.getMarkerArray("all");
		var chart = stx.chart;
		for (var i = 0; i < markers.length; i++) {
			var marker = markers[i],
				nodeCreator = marker.stxNodeCreator;
			var startingTick = chart.dataSegment[0].tick,
				endingTick = chart.dataSegment[chart.dataSegment.length - 1].tick;
			if (startingTick <= marker.tick <= endingTick) {
				// if markers are off screen don't draw them
				if (nodeCreator && nodeCreator.drawMarker)
					nodeCreator.drawMarker(marker);
			}
		}
	};

	/**
	 * Calculates the styles used in drawing [high performance canvas]{@link CIQ.Marker.Performance} markers.
	 * We use this method instead of other chart styling methods because Markers expect styles to cascade down and then be calculated.
	 * Other style methods are for adding or calculating a single property.
	 * This will save styles to the engine's style object where they can be adjusted with {@link CIQ.ChartEngine#setStyle}.
	 *
	 * @member CIQ.Marker.Performance
	 * @param {CIQ.ChartEngine} stx The chart engine.
	 * @param {CIQ.Marker} marker The marker to compute the styles from.
	 * @param {string} style Name to save to {@link CIQ.ChartEngine#styles}.
	 * @private
	 * @static
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.calculateMarkerStyles = function (stx, marker, style) {
		var testArea = document.querySelector(".stx-marker-templates");
		if (!testArea) {
			testArea = document.createElement("DIV");
			testArea.style.visibility = "hidden";
			testArea.style.left = "-1000px";
			document.body.append(testArea);
		}
		testArea.appendChild(marker.node);
		var s = getComputedStyle(marker.stxNodeCreator.visual);
		if (!stx.styles.stx_marker_stem) {
			var stem = getComputedStyle(
				document.querySelector(".stx-stem", marker.node)
			);
			stx.styles.stx_marker_stem = stx.cloneStyle(stem);
		}
		stx.styles[style] = stx.cloneStyle(s);
		testArea.removeChild(marker.node);
	};

	/**
	 * Draws circular canvas markers based on the styles for {@link CIQ.Marker.Performance} markers.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.drawCircleMarker = function (marker, style, params) {
		var stx = marker.params.stx,
			chart = stx.chart,
			ctx = chart.context;
		var x = params.x,
			y = params.y,
			radius = params.radius,
			label = params.label;
		var color = params.color ? params.color : style.backgroundColor;

		// Draw Circle
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.lineWidth = 1;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.font = "normal bold 12px Roboto, Helvetica, sans-serif";
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		// Write text
		if (label) {
			ctx.fillStyle = CIQ.colorsEqual("white", ctx.fillStyle)
				? "black"
				: "white";
			ctx.fillText(label.charAt(0).toUpperCase(), x - 4, y + 1);
		}

		if (marker.highlight || marker.active) {
			ctx.beginPath();
			ctx.arc(x, y, radius + 4, 0, 2 * Math.PI, false); // 4 pixels just chosen for giving slight space around marker
			ctx.stroke();
			ctx.closePath();
		}
	};

	/**
	 * Draws square canvas markers based on the styles for {@link CIQ.Marker.Performance} markers.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.drawSquareMarker = function (marker, style, params) {
		var stx = marker.params.stx,
			chart = stx.chart,
			ctx = chart.context;
		var x = params.x,
			y = params.y,
			half = params.half,
			label = params.label;
		var color = params.color ? params.color : style.backgroundColor;
		var whole = half * 2;

		// Draw Square
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.lineWidth = 1;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.font = "normal bold 12px Roboto, Helvetica, sans-serif";
		ctx.rect(x - half, y - half, whole, whole);
		ctx.fill();
		if (marker.highlight || marker.active)
			ctx.rect(x - half - 4, y - half - 4, whole + 8, whole + 8); // whole + 4 + 4 for the highlighted box
		ctx.stroke();
		ctx.closePath();

		// Write text
		if (label) {
			ctx.fillStyle = CIQ.colorsEqual("white", ctx.fillStyle)
				? "black"
				: "white";
			ctx.fillText(label.charAt(0).toUpperCase(), x - 4, y + 1);
		}
	};

	/**
	 * Draws callout (rectangular) canvas marker based on the style for a {@link CIQ.Marker.Performance} markers.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.drawCalloutMarker = function (marker, style, params) {
		var stx = marker.params.stx,
			chart = stx.chart,
			ctx = chart.context,
			mParams = marker.params;
		var x = params.x,
			y = params.y,
			half = params.half,
			calloutMid = params.midWidth,
			headline = params.headline;
		var color = params.color ? params.color : style.backgroundColor;

		var height = half * 2 || 25;
		var headlineLength = Math.round(ctx.measureText(headline).width);
		// If there's no length use the text measurement plus some padding
		var calloutWidth = calloutMid ? calloutMid * 2 : headlineLength + 8;

		// Draw the rectangle
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.lineWidth = 1;
		ctx.fillStyle = color;
		ctx.strokeStyle = color;
		ctx.font = "normal bold 12px Roboto, Helvetica, sans-serif";
		ctx.rect(mParams.box.x0, mParams.box.y0, calloutWidth, height);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		// draw the "background" box that text apears in
		ctx.beginPath();
		ctx.fillStyle =
			marker.highlight || marker.active
				? "rgba(255,255,255,0.8)"
				: "rgba(255,255,255,0.65)";
		var xx = (calloutWidth - (headlineLength + 20)) / 2;
		ctx.rect(mParams.box.x0 + xx, y - half, headlineLength + 40, 22);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		ctx.fillStyle = "black";
		ctx.fillText(headline, mParams.box.x0 + xx + 10, y);
	};

	/**
	 * Draws marker stems for a based on a style for {@link CIQ.Marker.Performance} markers.
	 *
	 * @param {CIQ.Marker} marker
	 * @param {object} style
	 * @param {object} params
	 * @static
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.drawMarkerStem = function (marker, style, params) {
		var stx = marker.params.stx,
			chart = stx.chart,
			ctx = chart.context;
		var x = params.x,
			y = params.y;

		ctx.beginPath();
		ctx.strokeStyle = style.borderLeftColor;
		// ctx.setLineDash(CIQ.borderPatternToArray(stemStyle.borderLeftWidth, stemStyle.borderLeftStyle));
		ctx.setLineDash([1, 1]);
		let stemHeight = CIQ.stripPX(style.height);
		let startY = params.invert ? marker.params.box.y0 : marker.params.box.y1;
		let endY = params.invert
			? marker.params.box.y0 - stemHeight
			: marker.params.box.y1 + stemHeight;
		ctx.moveTo(x, startY);
		ctx.lineTo(x, endY);
		ctx.stroke();
		ctx.closePath();
	};

	/**
	 * Draws a canvas marker on the chart and positions the pop-up for the marker if necessary.
	 *
	 * @memberof CIQ.Marker.Performance
	 * @param {CIQ.Marker} marker The marker to be drawn.
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.drawMarker = function (marker) {
		var mParams = marker.params,
			stx = marker.params.stx;
		if (!stx) return;

		var chart = stx.chart,
			dataSegment = chart.dataSegment;
		if (!dataSegment.length) return;

		var panel = stx.panels[marker.params.panelName];
		var nParams = marker.stxNodeCreator.params;
		var type = nParams.type,
			category = nParams.category,
			headline = nParams.headline,
			display = nParams.displayCategory,
			color = nParams.color,
			invert = nParams.invert;
		var style = "stx_marker_" + type + "_" + category;
		if (!stx.styles[style])
			CIQ.Marker.Performance.calculateMarkerStyles(stx, marker, style);
		var markerStyle = (marker.style = stx.styles[style]),
			stemStyle = stx.styles.stx_marker_stem;

		var halfSide = parseInt(markerStyle.height, 10) / 2,
			halfWidth = parseInt(markerStyle.width, 10) / 2;
		var stemHeight = nParams.displayStem
			? parseInt(stemStyle.height, 10) + parseInt(stemStyle.marginBottom, 10)
			: 0;
		var markerHeight = stemHeight + parseInt(markerStyle.height, 10);
		var stemOffset = stemHeight ? stemHeight + halfSide : 0;

		var x = stx.pixelFromDate(mParams.x);
		var y = mParams.node.calculateYPosition({
			marker: marker,
			panel: panel,
			height: markerHeight,
			half: halfSide,
			offset: stemOffset,
			inverted: invert
		});

		// This can happen if for some reason the marker is missing a tick.
		//It's possible but rare,  in that scenario just abort the drawing to prevent throwing errors
		if (!marker.tick && marker.tick !== 0) return;

		mParams.box = {
			x0: x - (halfWidth || halfSide),
			y0: y - halfSide,
			x1: x + (halfWidth || halfSide),
			y1: y + halfSide,
			midY: halfSide,
			midX: halfWidth || halfSide,
			stemHeight: stemHeight
		};

		if (!display) category = display;
		stx.startClip(panel.name);

		if (type === "circle") {
			CIQ.Marker.Performance.drawCircleMarker(marker, markerStyle, {
				x: x,
				y: y,
				radius: halfSide,
				label: category,
				color: color
			});
		} else if (type === "square") {
			CIQ.Marker.Performance.drawSquareMarker(marker, markerStyle, {
				x: x,
				y: y,
				half: halfSide,
				label: category,
				color: color
			});
		} else if (type === "callout") {
			CIQ.Marker.Performance.drawCalloutMarker(marker, markerStyle, {
				x: x,
				y: y,
				half: halfSide,
				midWidth: halfWidth,
				headline: headline,
				color: color
			});
		} else {
			console.warn(
				"Marker type: " +
					type +
					" is unsupported with canvas markers!\nSupported Styles are Square, Circle, and Callout."
			);
		}

		if (nParams.displayStem)
			CIQ.Marker.Performance.drawMarkerStem(marker, stemStyle, {
				x: x,
				y: y,
				invert: invert
			});

		stx.endClip();
		if (marker.attached) this.positionPopUpNode(marker);
	};

	/**
	 * Positions a marker's pop-up `div` that has been appended to the chart so that it follows the canvas marker.
	 * This is the replacement for {@link CIQ.ChartEngine#positionDOMMarkers}, but it is now an instance method for the individual performance marker.
	 *
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.positionPopUpNode = function (marker) {
		if (!marker.attached || !marker.params.box) return;
		var mparams = marker.params,
			stx = mparams.stx,
			mbox = mparams.box,
			expand = marker.params.node.expand;
		var dataSet = stx.chart.dataSet,
			dataSegment = stx.chart.dataSegment;

		var markerVisible;
		if (marker.tick) {
			var startBuffer = [
				dataSet[dataSegment[0] && dataSegment[0].tick - 1],
				dataSet[dataSegment[0] && dataSegment[0].tick - 2]
			]; // check two ticks ahead the dataSegment b/c markers sometimes extend past ticks
			var first = stx.getFirstLastDataRecord(
				startBuffer.concat(dataSegment),
				"Date"
			);
			var endBuffer = [
				dataSet[dataSegment[dataSegment.length - 1].tick + 1],
				dataSet[dataSegment[dataSegment.length - 1].tick + 2]
			]; // check two ticks behind the dataSegment b/c markers sometimes extend past ticks
			var last = stx.getFirstLastDataRecord(
				dataSegment.concat(endBuffer),
				"Date",
				true
			);
			markerVisible =
				first.DT <= dataSet[marker.tick].DT &&
				dataSet[marker.tick].DT <= last.DT;
		} else {
			markerVisible = false;
		}

		if (!marker.highlight && !marker.active) markerVisible = false;
		expand.style.visibility = markerVisible ? "" : "hidden";
		if (!markerVisible) return; // don't continue if the marker is off the screen

		var panel = stx.panels[mparams.panelName];
		var expandRect = expand.rects;
		var medianHeight = expandRect.height / 2;

		var tx;
		var offset = marker.node.params.infoOffset || 0;
		if (marker.node.params.infoOnLeft) {
			tx =
				mbox.x0 - expandRect.width - offset < panel.left
					? mbox.x1 + offset
					: mbox.x0 - expandRect.width - offset;
		} else {
			tx =
				mbox.x0 + expandRect.width > panel.right
					? mbox.x0 - expandRect.width - offset
					: mbox.x1 + offset;
		}
		tx -= stx.chart.left;
		var ty =
			mbox.y0 - medianHeight >= panel.top
				? mbox.y0 + mbox.midY - medianHeight
				: mbox.y0;
		// case where the marker is set to "bottom" alignment. We make the marker flush with the bottom of the yAxis unless the expand height is shorter than the marker height (ie a short marker label on a marker with a stem)
		if (
			!mparams.avoidFlush &&
			mbox.y1 + mbox.stemHeight === panel.yAxis.bottom &&
			expandRect.height > mbox.y1 - mbox.y0 + mbox.stemHeight
		)
			ty = mbox.y1 - expandRect.height + mbox.stemHeight;
		ty -= stx.chart.panel.top;
		var transform =
			"translateX(" +
			Math.floor(tx) +
			"px) translateY(" +
			Math.floor(ty) +
			"px) translateZ(0)";
		expand.style.transform = transform;
		// cache values for later use to determine x/y location of the expand popup
		expand.transform = { translateX: tx, translateY: ty };
	};

	/**
	 * Performs and caches some necessary calculations when the expand popup is first appended to the DOM.
	 * We do these calculations here once instead of on every call of the draw loop when we iterate thru the markers.
	 * The only thing that will change is the X/Y transform position which we already calculate in CIQ.Marker.Performance#drawMarker.
	 * So we can safely add the transform values we cache there to the default X/Y calculated here and find position without trashing the layout.
	 *
	 * **NOTE** You will notice that if you remove a marker and add it back, the values should be correct for X/Y (or at least the same as what it was before + translateX/Y).
	 * While this is true, it's only true if you add a marker back, so we can't reliably assume that the values are correct for X/Y.
	 *
	 * @param {CIQ.Marker} marker
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.quickCache = function (marker) {
		var node = marker.params.node,
			expand = node.expand,
			style = marker.style;
		var notScroll =
			CIQ.stripPX(style.marginLeft) +
			CIQ.stripPX(style.marginRight) +
			CIQ.stripPX(style.borderRight) +
			CIQ.stripPX(style.borderLeft);
		expand.rects = expand.getBoundingClientRect();
		expand.scrollBarWidth = expand.rects.width - expand.clientWidth - notScroll;
	};

	/**
	 * Calculates the initial y-axis positioning when drawing a canvas marker.
	 *
	 * @param {object} params
	 * @param {CIQ.Marker} params.marker The marker for which the y-axis position is calculated.
	 * @param {CIQ.ChartEngine.Panel} params.panel Panel on which the marker appears.
	 * @param {number} params.tick The tick of the quote in the chart's data set.
	 * @param {number} params.height Total height of the marker as defined by marker height plus
	 * 		stem height.
	 * @param {number} params.half Half the height of the marker as defined by the marker CSS
	 * 		style.
	 * @param {number} params.offset Height of the marker stem offset as defined by the marker
	 * 		stem CSS style height plus margin bottom.
	 * @param {boolean} params.inverted Indicates whether the marker stem is inverted; that is,
	 * 		pointing downward.
	 * @return {number} Initial y-coordinate positioning for drawing the canvas marker.
	 *
	 * @memberof CIQ.Marker.Performance
	 * @since
	 * - 7.2.0
	 * - 8.0.0 Added `params.inverted`.
	 */
	CIQ.Marker.Performance.prototype.calculateYPosition = function (params) {
		var marker = params.marker,
			panel = params.panel,
			height = params.height,
			side = params.half,
			offset = params.offset,
			inverted = params.inverted;
		var stx = marker.params.stx,
			chart = stx.chart;

		// this code finds the actual tick or the one right before to put the marker on.
		var useHighs = stx.chart.highLowBars;
		var quote = chart.dataSet[marker.tick];
		if (!quote) return;

		var price = useHighs ? quote.High : quote.Close;
		var position = marker.params.yPositioner,
			y;
		switch (position) {
			case "value": // this is actuallly our default case
				if (marker.params.y || marker.params.y === 0)
					y = stx.pixelFromPrice(marker.params.y, panel) - height * 0.5 + side;
				else y = stx.pixelFromPrice(price, panel) - offset;
				break;
			case "above_candle":
				y = stx.pixelFromPrice(price, panel) - offset;
				break;
			case "below_candle":
				y = stx.pixelFromPrice(quote.Low || price, panel);
				if (inverted && offset) y += offset;
				else y += side;
				break;
			case "on_candle":
				var h = quote.High || quote.Close,
					l = quote.Low || quote.Low === 0 || quote.Close;
				y = stx.pixelFromPrice((h + l) / 2, panel) - height * 0.5 + side;
				break;
			case "top":
				y = stx.pixelFromPrice(panel.yAxis.high, panel);
				if (inverted && offset) y += offset;
				else y += side;
				break;
			case "bottom":
				y = stx.pixelFromPrice(panel.yAxis.low, panel) - (offset || side); // if no stem offset use half so the whole marker is above the axis
				break;
			default:
				break;
		}
		return y;
	};

	/**
	 * Method to setup the actual DOM node that gets appended to the chart for Performance markers.
	 * Performance markers require the entire DOM of the template for the styles to be calculated correctly but we only want to append the "pop-up" expand `div`.
	 *
	 * @param {CIQ.Marker} marker The marker to which this node belongs.
	 * @return {HTMLElement} Expand the pop-up node that will be appended to the chart for the performance marker.
	 * @private
	 */
	CIQ.Marker.Performance.prototype.prepareForHolder = function (marker) {
		var expand = this.expand,
			stx = marker.params.stx;
		expand.classList.add(this.params.type);
		stx.markerHelper.domMarkers.push(marker);
		return expand;
	};

	/**
	 * Adds click and touch events to the marker pop-up when it is appended to the chart.
	 *
	 * @param {CIQ.Marker} marker
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.addToHolder = function (marker) {
		var expand = this.expand,
			stx = marker.params.stx;

		CIQ.Marker.Performance.reconstituteExpanded(stx);
		CIQ.Marker.Performance.consolidateExpanded(stx);
		this.quickCache(marker);

		if (expand.clickClosure) return;

		function clickClosure(e) {
			stx.activeMarker = marker;
			stx.activeMarker.click({
				cx: e.clientX,
				cy: e.clientY,
				panel: stx.currentPanel
			});
			e.stopPropagation();
		}
		// CIQ.safeClickTouch, in this case, attaches clickClosure to the pointerup event
		// Attaching the listener explicitly here to ensure stopPropagation and prevent accidental triggering of other markers
		expand.addEventListener("mousedown", clickClosure);
		expand.addEventListener("touchstart", clickClosure);
		expand.clickClosure = clickClosure;
	};

	/**
	 * Removes a high performance canvas markers from the `markerHelper.domMarkers` array.
	 * We use this instead of {@link CIQ.ChartEngine#removeFromHolder} because that will remove the whole marker instead of just removing the DOM node.
	 *
	 * @private
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.remove = function (marker) {
		var stx = marker.params.stx;
		if (!stx) return;
		if (!stx.markerHelper.domMarkers) return; // if never anything appended return

		var idx = stx.markerHelper.domMarkers.indexOf(marker);
		if (idx != -1) stx.markerHelper.domMarkers.splice(idx, 1);
		if (marker.attached) {
			var panel = stx.panels[marker.params.panelName];
			var expand = marker.params.node.expand;
			if (expand.parentNode === panel.subholder)
				panel.subholder.removeChild(expand);
			expand.removeEventListener("click", expand.clickClosure);
		}
	};

	/**
	 * Click event handler for performance markers when they are clicked in the canvas.
	 * Adds or removes the marker's pop-up expand `div` to the chart, depending on whether it has already been activated.
	 *
	 * @memberof CIQ.Marker.Performance
	 * @param {object} params Configuration parameters.
	 * @param {number} params.cx Client x-coordinate of click.
	 * @param {number} params.cy Client y-coordinate of click.
	 * @param {CIQ.Marker} params.marker Marker that was clicked.
	 * @param {CIQ.ChartEngine.Panel} params.panel Panel where the click occurred.
	 * @since 7.2.0
	 */
	CIQ.Marker.Performance.prototype.click = function (params) {
		if (!this.hasText) return; // don't display anything if there's nothing to display!

		if (typeof arguments[0] === "number") {
			params = {
				cx: arguments[0],
				cy: arguments[1],
				marker: arguments[2],
				panel: arguments[3]
			};
		}
		const { cx, cy, marker, panel } = params;
		var stx = marker.params.stx;

		var position;
		if (marker.attached) {
			var expand = this.expand;
			// checks to see if we clicked on the scroll bar and if we did return
			if (
				expand.rects.width -
					expand.scrollBarWidth +
					expand.transform.translateX <
					stx.backOutX(cx) &&
				stx.backOutX(cx) < expand.rects.width + expand.transform.translateX
			)
				return;
			this.remove(marker);
		} else {
			stx.addToHolder(marker);
			position = true;
		}
		marker.attached = !marker.attached;
		marker.active = !marker.active;
		if (position) marker.stxNodeCreator.positionPopUpNode(marker);
	};
}

};

let __js_advanced_renderersAdvanced_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

/*
 * SEE OVERWRITTEN METHOD FOR FULL DOCUMENTATION IN core/renderer.js
 */
CIQ.Renderer.OHLC.requestNew = function (featureList, params) {
	var type = null,
		isHlc = params.hlc,
		isColored = params.colored,
		isHollow = params.hollow,
		isVolume = params.volume,
		histogram = params.histogram;
	for (var pt = 0; pt < featureList.length; pt++) {
		var pType = featureList[pt];
		switch (pType) {
			case "bar":
			case "candle":
				type = pType;
				break;
			case "volume":
				isVolume = true;
				break;
			case "hollow":
				isHollow = true;
				break;
			case "colored":
				isColored = true;
				break;
			case "histogram":
				histogram = true;
				type = "candle";
				break;
			case "hlc":
				isHlc = true;
				type = "bar";
				break;
			default:
				return null; // invalid chartType for this renderer
		}
	}
	if (type === null) return null;

	return new CIQ.Renderer.OHLC({
		params: CIQ.extend(params, {
			type: type,
			hlc: isHlc,
			colored: isColored,
			hollow: isHollow,
			volume: isVolume,
			histogram: histogram
		})
	});
};

/*
 * Overrides method in core.js
 */
CIQ.Renderer.OHLC.getChartParts = function (style, colorUseOpen) {
	var CLOSEUP = 1; // today's close greater than yesterday's close
	var CLOSEDOWN = 2; // today's close less than yesterday's close
	var CLOSEEVEN = 4; // today's close the same as yesterday's close
	var CANDLEUP = 8; // today's close greater than today's open
	var CANDLEDOWN = 16; // today's close less than today's open
	var CANDLEEVEN = 32; // today's close equal to today's open
	return [
		{type:"histogram",	drawType:"histogram",	style:"stx_histogram_up",		condition:CANDLEUP,				fill:"fill_color_up",	border:"border_color_up",						useColorInMap:true, useBorderStyleProp:true},
		{type:"histogram",	drawType:"histogram",	style:"stx_histogram_down",		condition:CANDLEDOWN,			fill:"fill_color_down",	border:"border_color_down",						useColorInMap:true, useBorderStyleProp:true},
		{type:"histogram",	drawType:"histogram",	style:"stx_histogram_even",		condition:CANDLEEVEN,			fill:"fill_color_even",	border:"border_color_even",	skipIfPass:true,	useColorInMap:true, useBorderStyleProp:true},
		{type:"bar",		drawType:"bar",			style:style||"stx_bar_chart",															border:"border_color",							useColorInMap:true},
		{type:"bar",		drawType:"bar",			style:"stx_bar_up",				condition:colorUseOpen?CANDLEUP:CLOSEUP,				border:"border_color_up",						useColorInMap:true},
		{type:"bar",		drawType:"bar",			style:"stx_bar_down",			condition:colorUseOpen?CANDLEDOWN:CLOSEDOWN,			border:"border_color_down",						useColorInMap:true},
		{type:"bar",		drawType:"bar",			style:"stx_bar_even",			condition:colorUseOpen?CANDLEEVEN:CLOSEEVEN,			border:"border_color_even",	skipIfPass:true,	useColorInMap:true},
		{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow",																border:"border_color_up"},
		{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_up",	condition:CANDLEUP,										border:"border_color_up"},
		{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_down",	condition:CANDLEDOWN,									border:"border_color_down"},
		{type:"candle",		drawType:"shadow",		style:"stx_candle_shadow_even",	condition:CANDLEEVEN,									border:"border_color_even",	skipIfPass:true},
		{type:"candle",		drawType:"candle",		style:"stx_candle_up",			condition:CANDLEUP,				fill:"fill_color_up",	border:"border_color_up",						useColorInMap:true, useBorderStyleProp:true},
		{type:"candle",		drawType:"candle",		style:"stx_candle_down",		condition:CANDLEDOWN,			fill:"fill_color_down",	border:"border_color_down",						useColorInMap:true, useBorderStyleProp:true},
		{type:"hollow",		drawType:"shadow",		style:"stx_hollow_candle_up",	condition:CLOSEUP,										border:"border_color_up"},
		{type:"hollow",		drawType:"shadow",		style:"stx_hollow_candle_down",	condition:CLOSEDOWN,									border:"border_color_down"},
		{type:"hollow",		drawType:"shadow",		style:"stx_hollow_candle_even",	condition:CLOSEEVEN,									border:"border_color_even",	skipIfPass:true},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_up",	condition:CLOSEUP|CANDLEDOWN,	fill:"fill_color_up",	border:"border_color_up",						useColorInMap:true},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_down",	condition:CLOSEDOWN|CANDLEDOWN,	fill:"fill_color_down",	border:"border_color_down",						useColorInMap:true},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_even",	condition:CLOSEEVEN|CANDLEDOWN,	fill:"fill_color_even",	border:"border_color_even",	skipIfPass:true,	useColorInMap:true},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_up",	condition:CLOSEUP|CANDLEUP,		fill:"fill_color_up",	border:"border_color_up"},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_down",	condition:CLOSEDOWN|CANDLEUP,	fill:"fill_color_down",	border:"border_color_down"},
		{type:"hollow",		drawType:"candle",		style:"stx_hollow_candle_even",	condition:CLOSEEVEN|CANDLEUP,	fill:"fill_color_even",	border:"border_color_even"},
	]; // prettier-ignore
};

/**
 * Creates a Bars renderer, a derivation of the OHLC renderer.
 *
 * Note: by default the renderer will display bars as underlays. As such, they will appear below any other studies or drawings.
 *
 * The Bars renderer is used to create the following drawing types: bar, colored bar.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
 * @param {object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
 * @param  {boolean} [config.params.colored] For bar or hlc, specifies using a condition or colorFunction to determine color
 * @param  {string} [config.params.colorBasis="close"] Will compute color based on whether current close is higher or lower than previous close.  Set to "open" to compute this off the open rather than yesterday's close.
 * @param  {function} [config.params.colorFunction] Override function (or string) used to determine color of bar.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
 *
 * Common valid parameters for use by attachSeries.:<br>
 * `border_color` - Color to use for uncolored bars.<br>
 * `border_color_up` - Color to use for up bars.<br>
 * `border_color_down` - Color to use for down bars.<br>
 * `border_color_even` - Color to use for even bars.<br>
 *
 * @constructor
 * @name  CIQ.Renderer.Bars
 * @since 5.1.1, creates only Bar type charts
 * @example
 	// Colored bar chart
	var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.Bars({params:{name:"bars", colored:true}}));
 */

CIQ.Renderer.Bars = function (config) {
	this.construct(config);
	var params = this.params;
	params.type = "bar";
	this.highLowBars = this.barsHaveWidth = this.standaloneBars = true;
	params.hlc = params.volume = params.hollow = params.histogram = false;
};
CIQ.inheritsFrom(CIQ.Renderer.Bars, CIQ.Renderer.OHLC, false);

/**
	 * Creates a HLC renderer, a derivation of the Bars renderer.
	 *
	 * Note: by default the renderer will display bars as underlays. As such, they will appear below any other studies or drawings.
	 *
	 * The HLC renderer is used to create the following drawing types: hlc, colored hlc.
	 *
	 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
	 * @param {object} config Config for renderer
	 * @param  {object} [config.params] Parameters to control the renderer itself
	 * @param  {boolean} [config.params.useChartLegend=false] Set to true to use the built in canvas legend renderer. See {@link CIQ.ChartEngine.Chart#legendRenderer};
	 * @param  {string} [config.params.style] Style name to use in lieu of defaults for the type
	 * @param  {boolean} [config.params.colored] For bar or hlc, specifies using a condition or colorFunction to determine color
	 * @param  {string} [config.params.colorBasis="close"] Will compute color based on whether current close is higher or lower than previous close.  Set to "open" to compute this off the open rather than yesterday's close.
	 * @param  {function} [config.params.colorFunction] Override function (or string) used to determine color of bar.  May be an actual function or a string name of the registered function (see {@link CIQ.Renderer.registerColorFunction})
	 *
	 * Common valid parameters for use by attachSeries.:<br>
	 * `border_color` - Color to use for uncolored bars.<br>
	 * `border_color_up` - Color to use for up bars.<br>
	 * `border_color_down` - Color to use for down bars.<br>
	 * `border_color_even` - Color to use for even bars.<br>
	 *
	 * @constructor
	 * @name  CIQ.Renderer.HLC
	 * @since 5.1.1
	 * @example
	 	// Colored hlc chart
		var renderer=stxx.setSeriesRenderer(new CIQ.Renderer.HLC({params:{name:"hlc", colored:true}}));
	 */

CIQ.Renderer.HLC = function (config) {
	this.construct(config);
	var params = this.params;
	params.type = "bar";
	params.hlc = true;
	this.highLowBars = this.barsHaveWidth = this.standaloneBars = true;
	params.volume = params.hollow = params.histogram = false;
};
CIQ.inheritsFrom(CIQ.Renderer.HLC, CIQ.Renderer.Bars, false);

/**
 * Creates a Shading renderer
 * This is just like Lines renderer except it will allow shading between lines connected by a common y axis.
 *
 * Notes:
 * - By default the renderer will display lines as underlays. As such, they will appear below the chart ticks and any other studies or drawings.
 * - Series not linked to an explicit y axis through a custom renderer must have 'shareYAxis' set to true to use this feature.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
 *
 * Example:<br>
 * <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/k61mzpce/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 * @param {Object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @param  {number} [config.params.width] Width of the rendered line
 *
 * Common valid parameters for use by attachSeries.:<br>
 * `color` - Specify the color for the line and shading in rgba, hex or by name.<br>
 * `pattern` - Specify the pattern as an array. For instance [5,5] would be five pixels and then five empty pixels.<br>
 * `width` - Specify the width of the line.<br>
 *
 * @constructor
 * @name  CIQ.Renderer.Shading
 * @version ChartIQ Advanced Package
 */
CIQ.Renderer.Shading = function (config) {
	this.construct(config);
	this.beenSetup = false;
	this.errTimeout = null;
	this.params.useChartLegend = false;
	this.shading = [];
	if (this.params.type == "rangechannel") this.highLowBars = true;
};
CIQ.inheritsFrom(CIQ.Renderer.Shading, CIQ.Renderer.Lines, false);

/**
 * Returns a new Shading renderer if the featureList calls for it
 * FeatureList should contain "rangechannel" (draws high and low plots and shades between)
 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series
 * @param {array} featureList List of rendering terms requested by the user, parsed from the chartType
 * @param {object} [params] Parameters used for the series to be created, used to create the renderer
 * @return {CIQ.Renderer.Shading} A new instance of the Shading renderer, if the featureList matches
 * @memberof CIQ.Renderer.Shading
 * @private
 * @since 5.1.0
 */
CIQ.Renderer.Shading.requestNew = function (featureList, params) {
	var type = null;
	for (var pt = 0; pt < featureList.length; pt++) {
		var pType = featureList[pt];
		if (pType == "rangechannel") type = "rangechannel";
	}
	if (type === null) return null;

	return new CIQ.Renderer.Shading({
		params: CIQ.extend(params, { type: type })
	});
};

/**
 * Sets the shading scheme of the renderer. Lines must be connected by a common y axis.
 *
 * Example:<br>
 * <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/k61mzpce/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * @param  {array} scheme single object or array of objects denoting shading.
 * @param  {string} [scheme.primary] left series for comparison; if omitted, use chart.dataSegment[i].Close.
 * @param  {string} [scheme.secondary] right series for comparison; if omitted, use first series in the seriesMap.
 * @param  {string} [scheme.color] color in hex, rgb, rgba, etc to shade between primary and secondary.
 * @param  {string} [scheme.greater] color in hex, rgb, rgba, etc to shade between primary and secondary if primary is greater in price than secondary.
 * @param  {string} [scheme.lesser] color in hex, rgb, rgba, etc to shade between primary and secondary if primary is lesser in price than secondary.
 * <br>Notes:
 * - If scheme.greater _and_ scheme.lesser are omitted, scheme.color is used.
 * - If scheme.greater _or_ scheme.lesser are omitted, stx.containerColor is used for the missing color.
 * - At a bare minimum, scheme.color is required.  It is not required if scheme.greater and scheme.lesser are supplied.
 * - If scheme.primary is omitted, the shading will only occur if the series share the same axis as the chart.dataSegment[i].Close.
 * - If shading cannot occur for any reason, series lines will still be drawn.
 * @memberOf CIQ.Renderer.Shading
 * @example
 * renderer.setShading([
 * 	{primary:'ibm', secondary:'ge', greater:'green', lesser:'red'}, // switches shading based on crossover of values
 * 	{primary:'aapl', secondary:'ge', greater:'orange'}, // same as above, but lesser color not specified, so shade that area the container color.
 * 	{primary:'t', secondary:'intc', color:'blue'}, // color always blue between them regardless of which is higher or lower
 * 	{secondary:'t', color:'yellow'}, // compares masterData with the named series
 * 	{color:'yellow'} // automatically shades between master and the first series
 * ]);
 * @version ChartIQ Advanced Package
 */
CIQ.Renderer.Shading.prototype.setShading = function (scheme) {
	if (scheme.constructor != Array) {
		scheme = [scheme];
	}
	this.shading = scheme;
};

CIQ.Renderer.Shading.prototype.draw = function () {
	var stx = this.stx,
		chart = stx.panels[this.params.panel].chart;
	if (this.params.type == "rangechannel") {
		if (this.beenSetup) {
			if (this.seriesParams.length > 2)
				this.removeSeries(this.seriesParams[2].id);
		} else {
			this.beenSetup = true;
			this.params.display = this.seriesParams[0].display;
			this.params.yAxis = this.seriesParams[0].yAxis;
			var shadeColor = this.seriesParams[0].color || "auto";
			var symbol = this.seriesParams[0].symbol,
				prefix = "";
			if (symbol) prefix = symbol + ".";
			this.removeAllSeries(true);
			var name = this.params.name;
			stx.addSeries(null, {
				symbol: symbol,
				loadData: !!symbol,
				field: "High",
				renderer: "Shading",
				name: name,
				style: "stx_line_up",
				display: this.params.display,
				shareYAxis: true
			});
			stx.addSeries(null, {
				symbol: symbol,
				loadData: !!symbol,
				field: "Low",
				renderer: "Shading",
				name: name,
				style: "stx_line_down",
				display: this.params.display,
				shareYAxis: true
			});
			this.setShading({
				primary: this.seriesParams[0].id,
				secondary: this.seriesParams[1].id,
				color: shadeColor
			});
		}
	}
	if (!this.shading) {
		if (!this.errTimeout) {
			console.log(
				"Warning: no shading scheme set.  Use myRenderer.setShading(scheme) to set."
			);
			var self = this;
			this.errTimeout = setTimeout(function () {
				self.errTimeout = null;
			}, 10000);
		}
	}
	var seriesMap = {};
	var s;
	for (s = 0; s < this.seriesParams.length; s++) {
		var defaultParams = {};
		if (chart.series[this.seriesParams[s].id]) {
			// make sure the series is still there.
			defaultParams = CIQ.clone(
				chart.series[this.seriesParams[s].id].parameters
			);
		}
		seriesMap[this.seriesParams[s].id] = {
			parameters: CIQ.extend(
				CIQ.extend(defaultParams, this.params),
				this.seriesParams[s]
			),
			yValueCache: this.caches[this.seriesParams[s].id]
		};
	}
	stx.drawSeries(chart, seriesMap, this.params.yAxis, this);

	if (chart.legend && this.params.type == "rangechannel") {
		if (!chart.legend.colorMap) chart.legend.colorMap = {};
		var display = this.params.display;
		var colors = [
			stx.getCanvasColor("stx_line_up"),
			stx.getCanvasColor("stx_line_down")
		];
		chart.legend.colorMap[display] = {
			color: colors,
			display: display,
			isBase: this == stx.mainSeriesRenderer
		}; // add in the optional display text to send into the legendRenderer function
	}

	for (s in seriesMap) {
		this.caches[s] = seriesMap[s].yValueCache;
	}

	function joinFields(series) {
		var map = seriesMap[series];
		if (map) {
			var fld = map.parameters.field;
			var subFld = map.parameters.subField;
			return fld + (subFld ? "." + subFld : "");
		}
		return series;
	}

	for (s = 0; s < this.shading.length; s++) {
		var scheme = this.shading[s];
		var color = scheme.color;
		if (scheme.color == "auto") color = stx.defaultColor;
		if (!scheme.primary) scheme.primary = "Close";
		if (!scheme.secondary && this.seriesParams[0])
			scheme.secondary = this.seriesParams[0].field;

		if (!scheme.secondary) continue;
		else if (!seriesMap[scheme.primary] && scheme.primary != "Close") continue;
		else if (!seriesMap[scheme.secondary]) continue;
		else if (
			scheme.primary == "Close" &&
			this.params.yAxis &&
			this.params.yAxis != chart.yAxis
		)
			continue; //don't allow shading across axes

		var topFields = joinFields(scheme.primary).split(".");
		var bottomFields = joinFields(scheme.secondary).split(".");
		var parameters = {
			topBand: topFields[0],
			topSubBand: topFields[1],
			topColor: scheme.greater || color || stx.containerColor,
			topAxis: this.params.yAxis,
			bottomBand: bottomFields[0],
			bottomSubBand: bottomFields[1],
			bottomColor: scheme.lesser || color || stx.containerColor,
			bottomAxis: scheme.primary == "Close" ? null : this.params.yAxis,
			tension: this.params.tension || chart.tension,
			opacity: 0.1
		};
		if (!parameters.topColor && !parameters.bottomColor) continue;
		if (!this.params.highlight && stx.highlightedDraggable)
			parameters.opacity *= 0.3;
		CIQ.fillIntersecting(stx, this.params.panel, parameters);
	}
};

/**
 * Creates a multi-part histogram renderer where bars can be stacked one on top of the other, clustered next to each other, or overlaid over each other.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers.
 *
 * See {@link CIQ.ChartEngine#drawHistogram}  for more details.
 *
 * @param {Object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @param  {boolean} [config.params.defaultBorders =false] Whether to draw a border for each bar as a whole.  Can be overridden by a border set for a series.
 * @param  {number} [config.params.widthFactor =.8] Width of each bar as a percentage of the candleWidth. Valid values are 0.00-1.00.
 * @param  {number} [config.params.heightPercentage =.7] The amount of vertical space to use, valid values are 0.00-1.00.
 * @param  {boolean} [config.params.bindToYAxis =true] Set to true to bind the rendering to the y-axis and to draw it. Automatically set if params.yAxis is present.
 * @param  {string} [config.params.subtype="overlaid"] Subtype of rendering "stacked", "clustered", "overlaid"
 *
 * Common valid parameters for use by attachSeries.:<br>
 * `fill_color_up` - Color to use for up histogram bars.<br>
 * `fill_color_down` - Color to use for down histogram bars.<br>
 * `border_color_up` - Color to use for the border of up histogram bars.<br>
 * `border_color_down` - Color to use for the order of down histogram bars.<br>
 *
 * @constructor
 * @name  CIQ.Renderer.Histogram
 * 	@example
	// configure the histogram display
	var params={
		name:				"Sentiment Data",
		subtype:			"stacked",
		heightPercentage:	.7,	 // how high to go. 1 = 100%
		widthFactor:		.8	 // to control space between bars. 1 = no space in between
	};

 	//legend creation callback (optional)
	function histogramLegend(colors){
        stxx.chart.legendRenderer(stxx,{legendColorMap:colors, coordinates:{x:260, y:stxx.panels["chart"].yAxis.top+30}, noBase:true});
    }

	// set the renderer
	var histRenderer=stxx.setSeriesRenderer(new CIQ.Renderer.Histogram({params: params, callback: histogramLegend}));

	// add data and attach.
	stxx.addSeries("^NIOALL", {display:"Symbol 1"}, function() {histRenderer.attachSeries("^NIOALL","#6B9CF7").ready();});
	stxx.addSeries("^NIOAFN", {display:"Symbol 2"}, function() {histRenderer.attachSeries("^NIOAFN","#95B7F6").ready();});
	stxx.addSeries("^NIOAMD", {display:"Symbol 3"}, function() {histRenderer.attachSeries("^NIOAMD","#B9D0F5").ready();});
 *
 * @example
	// this is an example on how completely remove a renderer and all associated data.
	// This should only be necessary if you are also removing the chart itself

	// Remove all series from the renderer including series data from the masterData
	renderer.removeAllSeries(true);

	// detach the series renderer from the chart.
	stxx.removeSeriesRenderer(renderer);

	// delete the renderer itself.
	delete renderer;

 * @example <caption>Set a baseline value, allowing negative bars.</caption>
 * const yax = new CIQ.ChartEngine.YAxis({
 *     baseline: 0
 * });
 * const rndr = stxx.setSeriesRenderer(
 *     new CIQ.Renderer.Histogram({
 *         params: {
 *             // Can be an overlaid or clustered histogram.
 *             subtype: 'clustered',
 *             yAxis: yax
 *         }
 *     })
 * );
 *
 * @example <caption>Render a horizontal line at the baseline value.</caption>
 * const yax = new CIQ.ChartEngine.YAxis({
 *     baseline: {
 *         value: 0,
 *         // Must provide color to render the horizontal line,
 *         // and can optionally provide pattern, lineWidth, and opacity.
 *         color: "red",
 *         pattern: "dotted",
 *         lineWidth: 2,
 *         opacity: 1
 *     }
 * });
 *
 * @version ChartIQ Advanced Package
 * @since 7.5.0 Added the ability to draw negative bars when `yAxis.baseline` is set to zero
 * 		or some other value (see examples).
 */
CIQ.Renderer.Histogram = function (config) {
	this.construct(config);
	this.params.type = "histogram";
	this.barsHaveWidth = this.standaloneBars = true;

	if (this.params.yAxis) {
		this.params.bindToYAxis = true;

		if (typeof this.params.yAxis.baseline == "number") {
			this.params.yAxis.baseline = {
				value: this.params.yAxis.baseline
			};
		}
	}
};

CIQ.inheritsFrom(CIQ.Renderer.Histogram, CIQ.Renderer, false);

CIQ.Renderer.Histogram.prototype.adjustYAxis = function () {
	const yAxis = this.params.yAxis;

	if (!yAxis || yAxis.baseline) return;

	yAxis.min = 0;
	yAxis.highValue /= this.params.heightPercentage || 1;
};

CIQ.Renderer.Histogram.prototype.draw = function () {
	var params = CIQ.clone(this.params);
	params.type = params.subtype;
	this.useSum = params.subtype == "stacked";
	if (!params.yAxis || params.yAxis == this.stx.chart.yAxis)
		params.bindToYAxis = true;
	this.stx.drawHistogram(params, this.seriesParams);

	const baseline = params.yAxis && params.yAxis.baseline;

	if (baseline && baseline.color) {
		const panel = this.stx.panels[this.params.panel];
		const baselineY =
			this.stx.pixelFromPrice(baseline.value, panel, this.params.yAxis) - 0.5;

		this.stx.plotLine({
			x0: panel.left,
			x1: panel.right,
			y0: baselineY,
			y1: baselineY,
			color: baseline.color,
			type: "line",
			context: panel.chart.context,
			confineToPanel: panel,
			pattern: baseline.pattern || "solid",
			lineWidth: baseline.lineWidth || 1,
			opacity: baseline.opacity || 0.8,
			globalCompositeOperation: "destination-over"
		});
	}
};

CIQ.Renderer.Histogram.prototype.getBasis = function (quote, field, subField) {
	var value = 0;
	if (quote && this.useSum) {
		for (var j = 0; j < this.seriesParams.length; j++) {
			var seriesField = this.seriesParams[j].field;
			if (seriesField === field) break;
			var f = quote[seriesField];
			if (f && typeof f === "object")
				f =
					f[
						subField ||
							this.seriesParams[j].subField ||
							this.stx.chart.defaultPlotField ||
							"Close"
					];
			if (f) value += f;
		}
	}
	return value;
};

/**
 * Creates a Heatmap renderer.
 *
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers.
 *
 * Each attached series will represent a stream of colors for the heatmap.
 *
 * **Note special data formatting when using [addSeries]{@link CIQ.ChartEngine#addSeries}, where the custom field that will be used for the stream of datapoints (`Bids` in our example), is an array of values.**
 *
 * Visual Reference - single color series:<br>
 * ![img-histogram-single-color](img-histogram-single-color.png "img-histogram-single-color")
 *
 * For advanced heatmap implementations where all the data is received already with a color for each datapoint, use an injection that directly calls {@link CIQ.ChartEngine#drawHeatmap} as outlined in this example:<br>
 * <iframe width="100%" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="https://jsfiddle.net/chartiq/s27v0pt8/embedded/result,js,html/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
 *
 * @param {Object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @param  {number} [config.params.widthFactor=1] Width of each bar as a percentage of the candleWidth. Valid values are 0.00-1.00.
 * @param  {number} [config.params.height] The amount of vertical space to use, in price units. For example, 2=>2 unit increments on yaxis.
 * @constructor
 * @name  CIQ.Renderer.Heatmap
 * @version ChartIQ Advanced Package
 * @example
 *  // note special data formatting, where the custom field name that will be used for the stream of datapoints, is an array of values.
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
 */
CIQ.Renderer.Heatmap = function (config) {
	this.construct(config);
	this.params.type = "heatmap";
	this.params.highlightable = false;
	this.barsHaveWidth = this.standaloneBars = true;
};

CIQ.inheritsFrom(CIQ.Renderer.Heatmap, CIQ.Renderer, false);

/**
 * Returns a new `Heatmap` renderer if the `featureList` calls for it; `featureList` should contain "heatmap".
 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series.
 *
 * @param {array} featureList List of rendering terms requested by the user, parsed from the chart type.
 * @param {object} [params] Parameters used for the series to be created, used to create the renderer.
 * @return {CIQ.Renderer.Heatmap} A new instance of the `Heatmap` renderer, if the `featureList` matches.
 * @memberof CIQ.Renderer.Heatmap
 * @private
 * @since 7.3.0
 */
CIQ.Renderer.Heatmap.requestNew = function (featureList, params) {
	var type = null;
	for (var pt = 0; pt < featureList.length; pt++) {
		var pType = featureList[pt];
		if (pType == "heatmap") type = "heatmap";
	}
	if (type === null) return null;

	return new CIQ.Renderer.Heatmap({
		params: CIQ.extend(params, { type: type })
	});
};

CIQ.Renderer.Heatmap.prototype.draw = function () {
	this.stx.drawHeatmap(CIQ.clone(this.params), this.seriesParams);
};

/**
 * Creates a Scatter plot renderer
 * See {@link CIQ.Renderer#construct} for parameters required by all renderers
 * @param {Object} config Config for renderer
 * @param  {object} [config.params] Parameters to control the renderer itself
 * @constructor
 * @name  CIQ.Renderer.Scatter
 * @version ChartIQ Advanced Package
 */
CIQ.Renderer.Scatter = function (config) {
	this.construct(config);
	this.standaloneBars = this.barsHaveWidth = true;
	this.bounded = true;
};

CIQ.inheritsFrom(CIQ.Renderer.Scatter, CIQ.Renderer.Lines, false);

/**
 * Returns a new Scatter renderer if the featureList calls for it
 * FeatureList should contain "scatter"
 * Called by {@link CIQ.Renderer.produce} to create a renderer for the main series
 * @param {array} featureList List of rendering terms requested by the user, parsed from the chartType
 * @param {object} [params] Parameters used for the series to be created, used to create the renderer
 * @return {CIQ.Renderer.Scatter} A new instance of the Scatter renderer, if the featureList matches
 * @memberof CIQ.Renderer.Scatter
 * @since 5.1.0
 */
CIQ.Renderer.Scatter.requestNew = function (featureList, params) {
	var type = null;
	for (var pt = 0; pt < featureList.length; pt++) {
		var pType = featureList[pt];
		if (pType == "scatterplot") type = "scatter";
	}
	if (type === null) return null;

	return new CIQ.Renderer.Scatter({
		params: CIQ.extend(params, { type: type })
	});
};

CIQ.Renderer.Scatter.prototype.drawIndividualSeries = function (
	chart,
	parameters
) {
	var panel = this.stx.panels[parameters.panel] || chart.panel;
	var rc = { colors: [] };
	if (this.stx.scatter) rc = this.stx.scatter(panel, parameters);
	else console.warn("Error, Scatter renderer requires customChart.js");
	return rc;
};

};

let __js_advanced_studies_accumulationDistribution_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"accumulationDistribution feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateAccumulationDistribution = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (!i) continue;
			var quote = quotes[i];
			if (quote.futureTick) break;
			var quote1 = quotes[i - 1];
			var todayAD = 0;
			if (quote.Close > quote1.Close) {
				todayAD = quote.Close - Math.min(quote.Low, quote1.Close);
			} else if (quote.Close < quote1.Close) {
				todayAD = quote.Close - Math.max(quote.High, quote1.Close);
			}
			if (sd.inputs["Use Volume"]) todayAD *= quote.Volume;

			var total = quote1["Result " + sd.name];
			if (!total) total = 0;
			total += todayAD;
			if (!isNaN(quote.Close)) quote["Result " + sd.name] = total;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"W Acc Dist": {
			name: "Accumulation/Distribution",
			calculateFN: CIQ.Studies.calculateAccumulationDistribution,
			inputs: { "Use Volume": false }
		}
	});
}

};

let __js_advanced_studies_adx_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("adx feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateADX = function (stx, sd) {
		CIQ.Studies.calculateStudyATR(stx, sd);

		var quotes = sd.chart.scrubbed;
		var period = sd.days;
		var smoothing = parseInt(sd.inputs["Smoothing Period"], 10);
		if (!smoothing && smoothing !== 0) smoothing = period;

		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		var smoothTR = 0;
		var smoothPlusDM = 0;
		var smoothMinusDM = 0;
		var runningDX = 0;
		var quote;
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			quote = quotes[i];
			var plusDM = Math.max(0, quote.High - quotes[i - 1].High);
			var minusDM = Math.max(0, quotes[i - 1].Low - quote.Low);
			if (plusDM > minusDM) minusDM = 0;
			else if (minusDM > plusDM) plusDM = 0;
			else plusDM = minusDM = 0;

			if (i <= period) {
				smoothPlusDM += plusDM;
				smoothMinusDM += minusDM;
				smoothTR += quote["True Range " + sd.name];
			} else {
				smoothPlusDM =
					(quotes[i - 1]["_sm+DM " + sd.name] * (period - 1)) / period + plusDM;
				smoothMinusDM =
					(quotes[i - 1]["_sm-DM " + sd.name] * (period - 1)) / period +
					minusDM;
				smoothTR =
					(quotes[i - 1]["_smTR " + sd.name] * (period - 1)) / period +
					quote["True Range " + sd.name];
			}
			quote["_sm+DM " + sd.name] = smoothPlusDM;
			quote["_sm-DM " + sd.name] = smoothMinusDM;
			quote["_smTR " + sd.name] = smoothTR;

			if (i < period) continue;

			var plusDI = (100 * smoothPlusDM) / smoothTR;
			var minusDI = (100 * smoothMinusDM) / smoothTR;
			var DX = (100 * Math.abs(plusDI - minusDI)) / (plusDI + minusDI);

			quote["+DI " + sd.name] = plusDI;
			quote["-DI " + sd.name] = minusDI;
			if (sd.inputs.Series !== false && smoothing) {
				if (i < period + smoothing - 1) {
					if (i == sd.startFrom) {
						for (var j = period; j < sd.startFrom; j++) {
							runningDX +=
								(100 *
									Math.abs(
										quotes[j]["+DI " + sd.name] - quotes[j]["-DI " + sd.name]
									)) /
								(quotes[j]["+DI " + sd.name] + quotes[j]["-DI " + sd.name]);
						}
					}
					runningDX += DX;
				} else if (i == period + smoothing - 1) {
					quote["ADX " + sd.name] = runningDX / smoothing;
				} else {
					quote["ADX " + sd.name] =
						(quotes[i - 1]["ADX " + sd.name] * (smoothing - 1) + DX) /
						smoothing;
				}
			}
			if (sd.inputs.Histogram) {
				var histogram = sd.name + "_hist";
				if (!quote["+DI " + sd.name] && quote["+DI " + sd.name] !== 0) continue;
				if (!quote["-DI " + sd.name] && quote["-DI " + sd.name] !== 0) continue;
				quote[histogram] = quote["+DI " + sd.name] - quote["-DI " + sd.name];
				if (sd.inputs.Series === false) {
					//delete these so yAxis computes max/min correctly
					quote["+DI " + sd.name] = null;
					quote["-DI " + sd.name] = null;
				}
				sd.outputMap[histogram] = "";
			}
		}
	};

	CIQ.Studies.displayADX = function (stx, sd, quotes) {
		var opacity = sd.underlay ? 0.3 : sd.inputs.Series ? 0.4 : 1;
		if (sd.inputs.Series && sd.inputs.Shading) {
			var topBand = "+DI " + sd.name,
				bottomBand = "-DI " + sd.name;
			var topColor = CIQ.Studies.determineColor(
					sd.outputs[sd.outputMap[topBand]]
				),
				bottomColor = CIQ.Studies.determineColor(
					sd.outputs[sd.outputMap[bottomBand]]
				);
			var yAxis = sd.getYAxis(stx);
			var parameters = {
				topBand: topBand,
				bottomBand: bottomBand,
				topColor: topColor,
				bottomColor: bottomColor,
				skipTransform: stx.panels[sd.panel].name != sd.chart.name,
				topAxis: yAxis,
				bottomAxis: yAxis,
				opacity: 0.3
			};
			if (!sd.highlight && stx.highlightedDraggable) parameters.opacity *= 0.3;
			CIQ.fillIntersecting(stx, sd.panel, parameters);
		}
		if (sd.inputs.Histogram)
			CIQ.Studies.createHistogram(stx, sd, quotes, false, opacity);
		if (sd.inputs.Series !== false)
			CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		else if (!sd.inputs.Series && !sd.inputs.Histogram)
			stx.displayErrorAsWatermark(
				sd.panel,
				stx.translateIf(sd.name) + ": " + stx.translateIf("Nothing to display")
			);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		ADX: {
			name: "ADX/DMS",
			calculateFN: CIQ.Studies.calculateADX,
			seriesFN: CIQ.Studies.displayADX,
			inputs: {
				Period: 14,
				"Smoothing Period": 14,
				Series: true,
				Shading: false,
				Histogram: false
			},
			outputs: {
				"+DI": "#00FF00",
				"-DI": "#FF0000",
				ADX: "auto",
				"Positive Bar": "#00DD00",
				"Negative Bar": "#FF0000"
			}
		}
	});
}

};

let __js_advanced_studies_alligator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("alligator feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateAlligator = function (stx, sd) {
		var periods = {
			J: Number(sd.inputs["Jaw Period"]),
			T: Number(sd.inputs["Teeth Period"]),
			L: Number(sd.inputs["Lips Period"])
		};
		var quotes = sd.chart.scrubbed;
		if (quotes.length < Math.max(periods.J, periods.T, periods.L) + 1) {
			sd.error = true;
			return;
		}

		if (sd.type === "Gator" || sd.inputs["Show Lines"]) {
			// Gator always displays lines
			CIQ.Studies.MA(
				"welles wilder",
				periods.J,
				"hl/2",
				sd.inputs["Jaw Offset"],
				"Jaw",
				stx,
				sd
			);
			CIQ.Studies.MA(
				"welles wilder",
				periods.T,
				"hl/2",
				sd.inputs["Teeth Offset"],
				"Teeth",
				stx,
				sd
			);
			CIQ.Studies.MA(
				"welles wilder",
				periods.L,
				"hl/2",
				sd.inputs["Lips Offset"],
				"Lips",
				stx,
				sd
			);
		}

		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			if (sd.type == "Gator") {
				var jaw = quotes[i]["Jaw " + sd.name],
					lips = quotes[i]["Lips " + sd.name],
					teeth = quotes[i]["Teeth " + sd.name];
				if (teeth || teeth === 0) {
					if (jaw || jaw === 0)
						quotes[i][sd.name + "_hist1"] = Math.abs(jaw - teeth);
					if (lips || lips === 0)
						quotes[i][sd.name + "_hist2"] = -Math.abs(teeth - lips);
				}
				sd.outputMap = {};
				sd.outputMap[sd.name + "_hist1"] = "";
				sd.outputMap[sd.name + "_hist2"] = "";
			}
			if (sd.inputs["Show Fractals"]) {
				if (
					!quotes[i - 2] ||
					!quotes[i - 1] ||
					!quotes[i] ||
					!quotes[i + 1] ||
					!quotes[i + 2]
				)
					continue;
				if (
					quotes[i - 2].High &&
					quotes[i - 1].High &&
					quotes[i].High &&
					quotes[i + 1].High &&
					quotes[i + 2].High
				) {
					if (
						quotes[i].High > quotes[i - 1].High &&
						quotes[i].High > quotes[i - 2].High &&
						quotes[i].High > quotes[i + 1].High &&
						quotes[i].High > quotes[i + 2].High
					) {
						quotes[i]["Fractal High " + sd.name] = 1;
					}
				}
				if (
					quotes[i - 2].Low &&
					quotes[i - 1].Low &&
					quotes[i].Low &&
					quotes[i + 1].Low &&
					quotes[i + 2].Low
				) {
					if (
						quotes[i].Low < quotes[i - 1].Low &&
						quotes[i].Low < quotes[i - 2].Low &&
						quotes[i].Low < quotes[i + 1].Low &&
						quotes[i].Low < quotes[i + 2].Low
					) {
						quotes[i]["Fractal Low " + sd.name] = 1;
					}
				}
			}
		}
	};

	CIQ.Studies.displayAlligator = function (stx, sd, quotes) {
		function drawFractal(highLow, index) {
			//stx.canvasFont("???");
			var y;
			var flipped = stx.chart.panel.yAxis.flipped;
			if (highLow == "high") {
				context.fillStyle = stx.defaultColor;
				context.textBaseline = flipped ? "top" : "bottom";
				y = stx.pixelFromPrice(quotes[index].High);
				context.fillText(
					flipped ? "\u25BC" : "\u25B2",
					stx.pixelFromBar(i, stx.chart) -
						context.measureText("\u25B2").width / 2 +
						1,
					flipped ? y + 5 : y - 5
				); // up arrow
			} else if (highLow == "low") {
				context.fillStyle = stx.defaultColor;
				context.textBaseline = flipped ? "bottom" : "top";
				y = stx.pixelFromPrice(quotes[index].Low);
				context.fillText(
					flipped ? "\u25B2" : "\u25BC",
					stx.pixelFromBar(i, stx.chart) -
						context.measureText("\u25BC").width / 2 +
						1,
					flipped ? y - 5 : y + 5
				); // down arrow
			}
		}
		var context = sd.getContext(stx);
		if (sd.inputs["Show Lines"])
			CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		if (sd.inputs["Show Fractals"]) {
			stx.startClip(); // Fractals always stay on the chart panel
			context.globalAlpha = sd.underlay ? 0.3 : 1;
			if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
			for (var i = 2; i < quotes.length - 2; i++) {
				if (quotes[i]) {
					if (quotes[i]["Fractal High " + sd.name]) drawFractal("high", i);
					if (quotes[i]["Fractal Low " + sd.name]) drawFractal("low", i);
				}
			}
			stx.endClip();
		}
	};

	CIQ.Studies.displayGator = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);
		var y = stx.pixelFromPrice(0, panel, yAxis);

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;

		var upColor = CIQ.Studies.determineColor(sd.outputs["Increasing Bar"]);
		var downColor = CIQ.Studies.determineColor(sd.outputs["Decreasing Bar"]);
		stx.canvasColor("stx_histogram");
		if (!sd.underlay) context.globalAlpha = 1;
		context.fillStyle = "#CCCCCC";
		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i],
				quote_1 = quotes[i - 1];
			if (!quote) continue;
			for (var j = 1; j <= 2; j++) {
				if (!quote_1)
					quote_1 = stx.getPreviousBar(stx.chart, sd.name + "_hist" + j, i);
				if (!quote_1) context.fillStyle = "#CCCCCC";
				else if (
					Math.abs(quote_1[sd.name + "_hist" + j]) <
					Math.abs(quote[sd.name + "_hist" + j])
				)
					context.fillStyle = upColor;
				else if (
					Math.abs(quote_1[sd.name + "_hist" + j]) >
					Math.abs(quote[sd.name + "_hist" + j])
				)
					context.fillStyle = downColor;
				if (quote.candleWidth)
					myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
				context.fillRect(
					Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2),
					Math.floor(y),
					Math.floor(myWidth),
					Math.floor(
						stx.pixelFromPrice(quote[sd.name + "_hist" + j], panel, yAxis) - y
					)
				);
			}
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Alligator: {
			name: "Alligator",
			overlay: true,
			seriesFN: CIQ.Studies.displayAlligator,
			calculateFN: CIQ.Studies.calculateAlligator,
			inputs: {
				"Show Lines": true,
				"Jaw Period": 13,
				"Jaw Offset": 8,
				"Teeth Period": 8,
				"Teeth Offset": 5,
				"Lips Period": 5,
				"Lips Offset": 3,
				"Show Fractals": false
			},
			outputs: { Jaw: "#0000FF", Teeth: "#FF0000", Lips: "#00DD00" }
		},
		Gator: {
			name: "Gator Oscillator",
			seriesFN: CIQ.Studies.displayGator,
			calculateFN: CIQ.Studies.calculateAlligator,
			inputs: {
				"Jaw Period": 13,
				"Jaw Offset": 8,
				"Teeth Period": 8,
				"Teeth Offset": 5,
				"Lips Period": 5,
				"Lips Offset": 3
			},
			outputs: { "Increasing Bar": "#00DD00", "Decreasing Bar": "#FF0000" },
			centerline: 0
		}
	});
}

};

let __js_advanced_studies_aroon_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("aroon feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateAroon = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var daysSinceHigh = 0,
			daysSinceLow = 0;
		var xDayHigh = null,
			xDayLow = null;
		if (sd.startFrom > 0) {
			var state = quotes[sd.startFrom - 1]["_state " + sd.name];
			if (state) {
				daysSinceHigh = state[0];
				daysSinceLow = state[1];
				xDayHigh = state[2];
				xDayLow = state[3];
			}
		}
		var j;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (quote.futureTick) break;
			if (xDayHigh === null) xDayHigh = quote.High;
			if (xDayLow === null) xDayLow = quote.Low;
			xDayHigh = Math.max(xDayHigh, quote.High);
			if (xDayHigh == quote.High) {
				daysSinceHigh = 0;
			} else {
				daysSinceHigh++;
				if (daysSinceHigh > sd.days) {
					xDayHigh = quote.High;
					daysSinceHigh = 0;
					for (j = 1; j <= sd.days; j++) {
						xDayHigh = Math.max(xDayHigh, quotes[i - j].High);
						if (xDayHigh == quotes[i - j].High) {
							daysSinceHigh = j;
						}
					}
				}
			}
			xDayLow = Math.min(xDayLow, quote.Low);
			if (xDayLow == quote.Low) {
				daysSinceLow = 0;
			} else {
				daysSinceLow++;
				if (daysSinceLow > sd.days) {
					xDayLow = quote.Low;
					daysSinceLow = 0;
					for (j = 1; j <= sd.days; j++) {
						xDayLow = Math.min(xDayLow, quotes[i - j].Low);
						if (xDayLow == quotes[i - j].Low) {
							daysSinceLow = j;
						}
					}
				}
			}
			var nHi = !isNaN(quote.High),
				nLo = !isNaN(quote.Low);
			var up = 100 * (1 - daysSinceHigh / sd.days);
			if (nHi) quote["Aroon Up " + sd.name] = up;
			var down = 100 * (1 - daysSinceLow / sd.days);
			if (nLo) quote["Aroon Down " + sd.name] = down;
			if (nHi && nLo)
				quote["Aroon Oscillator " + sd.name] =
					quote["Aroon Up " + sd.name] - quote["Aroon Down " + sd.name];
			quote["_state " + sd.name] = [
				daysSinceHigh,
				daysSinceLow,
				xDayHigh,
				xDayLow
			];
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Aroon: {
			name: "Aroon",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculateAroon,
			outputs: { "Aroon Up": "#00DD00", "Aroon Down": "#FF0000" }
		},
		"Aroon Osc": {
			name: "Aroon Oscillator",
			calculateFN: CIQ.Studies.calculateAroon,
			outputs: { "Aroon Oscillator": "auto" }
		}
	});
}

};

let __js_advanced_studies_atr_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("atr feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateATRBands = function (stx, sd) {
		CIQ.Studies.calculateStudyATR(stx, sd);
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		CIQ.Studies.calculateGenericEnvelope(
			stx,
			sd,
			sd.inputs.Shift,
			field,
			"ATR " + sd.name
		);
	};

	CIQ.Studies.calculateSTARCBands = function (stx, sd) {
		CIQ.Studies.calculateStudyATR(stx, sd);
		CIQ.Studies.MA(
			"simple",
			sd.inputs["MA Period"],
			"Close",
			0,
			"_MA",
			stx,
			sd
		);
		CIQ.Studies.calculateGenericEnvelope(
			stx,
			sd,
			sd.inputs.Multiplier,
			"_MA " + sd.name,
			"ATR " + sd.name
		);
	};

	CIQ.Studies.calculateATRStops = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (!quotes) return;
		CIQ.Studies.calculateStudyATR(stx, sd);
		var useHighLow = sd.inputs.HighLow;
		for (var i = Math.max(sd.startFrom - 1, 1); i < quotes.length - 1; i++) {
			var prices = quotes[i];
			var pd = quotes[i - 1];
			var prev = prices["Buy Stops " + sd.name];
			if (!prev) prev = prices["Sell Stops " + sd.name];
			if (!prev) prev = 0;
			if (!prices || !pd) continue;
			var base = prices.Close;
			var result = base;
			var offset = prices["ATR " + sd.name] * sd.inputs.Multiplier;
			if (prices.Close > prev && pd.Close > prev) {
				if (useHighLow) base = prices.High;
				result = Math.max(prev, base - offset);
			} else if (prices.Close <= prev && pd.Close <= prev) {
				if (useHighLow) base = prices.Low;
				result = Math.min(prev, base + offset);
			} else if (prices.Close > prev) {
				if (useHighLow) base = prices.High;
				result = base - offset;
			} else if (prices.Close <= prev) {
				if (useHighLow) base = prices.Low;
				result = base + offset;
			}
			if (base <= result) {
				quotes[i + 1]["Buy Stops " + sd.name] = result;
				delete quotes[i + 1]["Sell Stops " + sd.name];
			} else if (base > result) {
				quotes[i + 1]["Sell Stops " + sd.name] = result;
				delete quotes[i + 1]["Buy Stops " + sd.name];
			}
			quotes[i + 1]["All Stops " + sd.name] = result;
		}
		sd.referenceOutput = "All Stops"; //so PSAR2 can draw a square wave
		sd.outputMap = {};
		sd.outputMap["All Stops " + sd.name] = "";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		ATR: {
			name: "Average True Range",
			calculateFN: CIQ.Studies.calculateStudyATR,
			outputs: { ATR: "auto" }
		},
		"ATR Bands": {
			name: "ATR Bands",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: CIQ.Studies.calculateATRBands,
			inputs: { Period: 5, Field: "field", Shift: 3, "Channel Fill": true },
			outputs: {
				"ATR Bands Top": "auto",
				"ATR Bands Bottom": "auto",
				"ATR Bands Channel": "auto"
			},
			attributes: {
				Shift: { min: 0.1, step: 0.1 }
			}
		},
		"STARC Bands": {
			name: "STARC Bands",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: CIQ.Studies.calculateSTARCBands,
			inputs: {
				Period: 15,
				"MA Period": 5,
				Multiplier: 1.3,
				"Channel Fill": true
			},
			outputs: {
				"STARC Bands Top": "auto",
				"STARC Bands Median": "auto",
				"STARC Bands Bottom": "auto"
			},
			attributes: {
				Multiplier: { min: 0.1, step: 0.1 }
			}
		},
		"ATR Trailing Stop": {
			name: "ATR Trailing Stops",
			overlay: true,
			seriesFN: CIQ.Studies.displayPSAR2,
			calculateFN: CIQ.Studies.calculateATRStops,
			inputs: {
				Period: 21,
				Multiplier: 3,
				"Plot Type": ["points", "squarewave"],
				HighLow: false
			},
			outputs: { "Buy Stops": "#FF0000", "Sell Stops": "#00FF00" },
			attributes: {
				Multiplier: { min: 0.1, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_awesomeOscillator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"awesomeOscillator feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateAwesomeOscillator = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < 33) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("simple", 5, "hl/2", 0, "_MA5", stx, sd);
		CIQ.Studies.MA("simple", 34, "hl/2", 0, "_MA34", stx, sd);

		for (var i = Math.max(sd.startFrom, 33); i < quotes.length; i++) {
			if (!quotes[i]) continue;
			quotes[i][sd.name + "_hist"] =
				quotes[i]["_MA5 " + sd.name] - quotes[i]["_MA34 " + sd.name];
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist"] = "";
	};

	CIQ.Studies.displayAwesomeOscillator = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);

		var y = stx.pixelFromPrice(0, panel, yAxis);

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;

		var upColor = CIQ.Studies.determineColor(sd.outputs["Increasing Bar"]);
		var downColor = CIQ.Studies.determineColor(sd.outputs["Decreasing Bar"]);
		stx.canvasColor("stx_histogram");
		if (!sd.underlay) context.globalAlpha = 1;
		context.fillStyle = "#CCCCCC";
		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i],
				quote_1 = quotes[i - 1];
			if (!quote_1)
				quote_1 = stx.getPreviousBar(stx.chart, sd.name + "_hist", i);
			if (!quote) continue;
			if (!quote_1);
			else if (quote_1[sd.name + "_hist"] < quote[sd.name + "_hist"])
				context.fillStyle = upColor;
			else if (quote_1[sd.name + "_hist"] > quote[sd.name + "_hist"])
				context.fillStyle = downColor;
			if (quote.candleWidth)
				myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
			context.fillRect(
				Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2),
				Math.floor(y),
				Math.floor(myWidth),
				Math.floor(
					stx.pixelFromPrice(quote[sd.name + "_hist"], panel, yAxis) - y
				)
			);
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Awesome: {
			name: "Awesome Oscillator",
			seriesFN: CIQ.Studies.displayAwesomeOscillator,
			calculateFN: CIQ.Studies.calculateAwesomeOscillator,
			inputs: {},
			outputs: { "Increasing Bar": "#00DD00", "Decreasing Bar": "#FF0000" }
		}
	});
}

};

let __js_advanced_studies_balanceOfPower_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"balanceOfPower feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateBalanceOfPower = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			quote["_Ratio " + sd.name] = quote.Close - quote.Open;
			if (quote.High - quote.Low !== 0)
				// avoid division by zero
				quote["_Ratio " + sd.name] /= quote.High - quote.Low;
		}
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"_Ratio " + sd.name,
			0,
			"Result",
			stx,
			sd
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Bal Pwr": {
			name: "Balance of Power",
			range: "-1 to 1",
			centerline: 0,
			calculateFN: CIQ.Studies.calculateBalanceOfPower,
			inputs: { Period: 14, "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_bollinger_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("bollinger feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateBollinger = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			field,
			0,
			"_MA",
			stx,
			sd
		);

		sd.std = new CIQ.Studies.StudyDescriptor(sd.name, "STD Dev", sd.panel);
		sd.std.chart = sd.chart;
		sd.std.startFrom = sd.startFrom;
		sd.std.days = sd.days;
		sd.std.inputs = {
			Field: field,
			"Standard Deviations": 1,
			Type: sd.inputs["Moving Average Type"]
		};
		sd.std.outputs = { "_STD Dev": null };
		CIQ.Studies.calculateStandardDeviation(stx, sd.std);

		CIQ.Studies.calculateGenericEnvelope(
			stx,
			sd,
			sd.inputs["Standard Deviations"],
			"_MA " + sd.name,
			"_STD Dev " + sd.name
		);
		if (sd.type == "Boll %b") sd.zoneOutput = "%b";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Bollinger Bands": {
			name: "Bollinger Bands",
			overlay: true,
			calculateFN: CIQ.Studies.calculateBollinger,
			seriesFN: CIQ.Studies.displayChannel,
			inputs: {
				Period: 20,
				Field: "field",
				"Standard Deviations": 2,
				"Moving Average Type": "ma",
				"Channel Fill": true
			},
			outputs: {
				"Bollinger Bands Top": "auto",
				"Bollinger Bands Median": "auto",
				"Bollinger Bands Bottom": "auto"
			},
			attributes: {
				"Standard Deviations": { min: 0.1, step: 0.1 }
			}
		},
		"Boll %b": {
			name: "Bollinger %b",
			calculateFN: CIQ.Studies.calculateBollinger,
			inputs: {
				Period: 20,
				Field: "field",
				"Standard Deviations": 2,
				"Moving Average Type": "ma"
			},
			outputs: { "%b": "auto" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 100,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 0,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				"Standard Deviations": { min: 0.1, step: 0.1 }
			}
		},
		"Boll BW": {
			name: "Bollinger Bandwidth",
			calculateFN: CIQ.Studies.calculateBollinger,
			inputs: {
				Period: 20,
				Field: "field",
				"Standard Deviations": 2,
				"Moving Average Type": "ma"
			},
			outputs: { Bandwidth: "auto" },
			attributes: {
				"Standard Deviations": { min: 0.1, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_cci_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("cci feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateCCI = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("simple", sd.days, "hlc/3", 0, "MA", stx, sd);

		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			var md = 0;
			for (var j = 0; j < sd.days; j++) {
				md += Math.abs(quotes[i - j]["hlc/3"] - quote["MA " + sd.name]);
			}
			md /= sd.days;
			if (Math.abs(md) < 0.00000001) quote["Result " + sd.name] = 0;
			else
				quote["Result " + sd.name] =
					(quote["hlc/3"] - quote["MA " + sd.name]) / (0.015 * md);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		CCI: {
			name: "Commodity Channel Index",
			calculateFN: CIQ.Studies.calculateCCI,
			inputs: { Period: 20 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 100,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -100,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				Period: { min: 2 }
			}
		}
	});
}

};

let __js_advanced_studies_centerOfGravity_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"centerOfGravity feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateCenterOfGravity = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var num = 0,
				den = 0;
			for (var j = 0; j < sd.days; j++) {
				var val = quotes[i - j][field];
				num -= (j + 1) * val;
				den += val;
			}
			if (den) quotes[i]["Result " + sd.name] = num / den;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		COG: {
			name: "Center Of Gravity",
			calculateFN: CIQ.Studies.calculateCenterOfGravity,
			inputs: { Period: 10, Field: "field" }
		}
	});
}

};

let __js_advanced_studies_chaikin_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("chaikin feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateChaikinMoneyFlow = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		var sumMoneyFlow = 0,
			sumVolume = 0;
		var startQuote = quotes[sd.startFrom - 1];
		if (startQuote) {
			if (startQuote["_sumMF " + sd.name])
				sumMoneyFlow = startQuote["_sumMF " + sd.name];
			if (startQuote["_sumV " + sd.name])
				sumVolume = startQuote["_sumV " + sd.name];
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (quotes[i].High == quotes[i].Low) quotes[i]["_MFV " + sd.name] = 0;
			else
				quotes[i]["_MFV " + sd.name] =
					(quotes[i].Volume *
						(2 * quotes[i].Close - quotes[i].High - quotes[i].Low)) /
					(quotes[i].High - quotes[i].Low);
			sumMoneyFlow += quotes[i]["_MFV " + sd.name];
			sumVolume += quotes[i].Volume;
			if (i > sd.days - 1) {
				sumMoneyFlow -= quotes[i - sd.days]["_MFV " + sd.name];
				sumVolume -= quotes[i - sd.days].Volume;
				if (sumVolume)
					quotes[i]["Result " + sd.name] = sumMoneyFlow / sumVolume;
			}
			quotes[i]["_sumMF " + sd.name] = sumMoneyFlow;
			quotes[i]["_sumV " + sd.name] = sumVolume;
		}
	};

	CIQ.Studies.calculateChaikinVolatility = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		var i;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (quotes[i].futureTick) break;
			quotes[i]["_High-Low " + sd.name] = quotes[i].High - quotes[i].Low;
		}
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"_High-Low " + sd.name,
			0,
			"_MA",
			stx,
			sd
		);

		var roc = sd.inputs["Rate Of Change"];
		if (!roc) roc = sd.days;
		for (i = Math.max(sd.startFrom, roc); i < quotes.length; i++) {
			if (!quotes[i - roc]["_MA " + sd.name]) continue;
			if (quotes[i].futureTick) break;
			quotes[i]["Result " + sd.name] =
				100 *
				(quotes[i]["_MA " + sd.name] / quotes[i - roc]["_MA " + sd.name] - 1);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Chaikin MF": {
			name: "Chaikin Money Flow",
			calculateFN: CIQ.Studies.calculateChaikinMoneyFlow,
			inputs: { Period: 20 }
		},
		"Chaikin Vol": {
			name: "Chaikin Volatility",
			calculateFN: CIQ.Studies.calculateChaikinVolatility,
			inputs: { Period: 14, "Rate Of Change": 2, "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_chande_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("chande feature requires first activating studies feature.");
} else {
	CIQ.Studies.prettify.variable = "vma";
	CIQ.Studies.movingAverage.conversions.vma = "variable";
	CIQ.Studies.movingAverage.translations.variable = "Variable";
	CIQ.Studies.movingAverage.typeMap.vma = "Variable";
	CIQ.Studies.movingAverage.typeMap.variable = "Variable";

	CIQ.Studies.calculateChandeForecast = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		CIQ.Studies.MA("time series", sd.days, field, 0, "MA", stx, sd);
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			quotes[i]["Result " + sd.name] =
				100 * (1 - quotes[i]["MA " + sd.name] / val);
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
	 * @param {CIQ.Studies.StudyDescriptor} sd  Study Descriptor
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

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Chande Fcst": {
			name: "Chande Forecast Oscillator",
			calculateFN: CIQ.Studies.calculateChandeForecast,
			inputs: { Period: 14, Field: "field" }
		},
		"Chande Mtm": {
			name: "Chande Momentum Oscillator",
			calculateFN: CIQ.Studies.calculateChandeMomentum,
			inputs: { Period: 9 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 50,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -50,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_choppiness_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"choppiness feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateChoppiness = function (stx, sd) {
		CIQ.Studies.calculateStudyATR(stx, sd);

		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		function getLLVHHV(p, x) {
			var h = Number.MAX_VALUE * -1,
				l = Number.MAX_VALUE;
			for (var j = x - p + 1; j <= x; j++) {
				if (j < 0) continue;
				h = Math.max(h, quotes[j].High);
				l = Math.min(l, quotes[j].Low);
			}
			return [l, h];
		}
		for (var i = Math.max(sd.startFrom, sd.days); i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			if (quote.futureTick) break;
			var lh = getLLVHHV(sd.days, i);
			if (quote["Sum True Range " + sd.name]) {
				quote["Result " + sd.name] =
					(100 *
						Math.log(
							quote["Sum True Range " + sd.name] /
								Math.max(0.000001, lh[1] - lh[0])
						)) /
					Math.log(sd.days);
			} else if (!isNaN(quote)) {
				quote["Result " + sd.name] = 0;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Choppiness: {
			name: "Choppiness Index",
			calculateFN: CIQ.Studies.calculateChoppiness,
			centerline: 50,
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 61.8,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 38.2,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				studyOverBoughtValue: { min: 50, step: "0.1" },
				studyOverSoldValue: { max: 50, step: "0.1" }
			}
		}
	});
}

};

let __js_advanced_studies_comparisonStudies_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */



var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"comparisonStudies feature requires first activating studies feature."
	);
} else if (!CIQ.Studies.initPriceRelative) {
	console.error(
		"comparisonStudies feature requires first activating priceRelative feature."
	);
} else {
	/**
	 * Calculate function for correlation coefficient
	 * @param  {CIQ.ChartEngine} stx Chart object
	 * @param  {object} sd  Study Descriptor
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.calculateCorrelationCoefficient = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var period = sd.days;
		if (quotes.length < period + 1) {
			sd.error = true;
			return;
		}
		//var base=stx.chart.symbol;
		sd.compare = sd.inputs["Compare To"];
		if (!sd.compare) {
			sd.compare = [];
			sd.outputs = {};
			sd.outputMap = {};
			for (var s in stx.chart.series) {
				var series = stx.chart.series[s];
				if (series.parameters.color) {
					sd.compare.push(series.display);
					sd.outputs["Result " + series.display] = series.parameters.color;
					sd.outputMap["Result " + series.display + " " + sd.name] =
						"Result " + series.display;
				}
			}
		} else {
			sd.compare = [sd.compare];
		}
		if (!sd.compare.length) {
			sd.error =
				"Correlation Coefficient requires at least one comparison symbol";
			return;
		}
		for (var sym = 0; sym < sd.compare.length; sym++) {
			var sB = 0;
			var sC = 0;
			var sB2 = 0;
			var sC2 = 0;
			var sBC = 0;
			var thisCompare = sd.compare[sym];
			var iters = 0;
			for (var i = sd.startFrom - period; i < quotes.length; i++) {
				//last tick has no compare data
				if (!quotes[i]) continue;
				var comparisonQuote = quotes[i][thisCompare];
				if (comparisonQuote && typeof comparisonQuote == "object")
					comparisonQuote = comparisonQuote.Close;
				if (!comparisonQuote && comparisonQuote !== 0) {
					if (
						i > 0 &&
						quotes[i - 1] &&
						quotes[i - 1]["_temps " + sd.name] &&
						quotes[i - 1]["_temps " + sd.name].c
					)
						comparisonQuote = quotes[i - 1]["_temps " + sd.name].c;
					else comparisonQuote = 0;
				}
				if (comparisonQuote && typeof comparisonQuote == "object")
					comparisonQuote = comparisonQuote.Close;
				quotes[i]["_temps " + sd.name] = {};
				sB += quotes[i]["_temps " + sd.name].b = quotes[i].Close;
				sC += quotes[i]["_temps " + sd.name].c = comparisonQuote;
				sB2 += quotes[i]["_temps " + sd.name].b2 = Math.pow(quotes[i].Close, 2);
				sC2 += quotes[i]["_temps " + sd.name].c2 = Math.pow(comparisonQuote, 2);
				sBC += quotes[i]["_temps " + sd.name].bc =
					quotes[i].Close * comparisonQuote;
				if (iters >= period) {
					sB -= quotes[i - period]["_temps " + sd.name].b;
					sC -= quotes[i - period]["_temps " + sd.name].c;
					sB2 -= quotes[i - period]["_temps " + sd.name].b2;
					sC2 -= quotes[i - period]["_temps " + sd.name].c2;
					sBC -= quotes[i - period]["_temps " + sd.name].bc;

					var vb = sB2 / period - Math.pow(sB / period, 2);
					var vc = sC2 / period - Math.pow(sC / period, 2);
					var cv = sBC / period - (sB * sC) / Math.pow(period, 2);
					var cc = cv / Math.sqrt(vb * vc);
					quotes[i]["Result " + thisCompare + " " + sd.name] = cc;
				}
				iters++;
			}
		}
	};

	CIQ.Studies.calculatePerformance = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var cSym = sd.inputs["Comparison Symbol"].toUpperCase();
		if (!cSym) cSym = sd.study.inputs["Comparison Symbol"];
		if (!sd.days) sd.days = sd.study.inputs.Period;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("ma", sd.days, "Close", 0, "_MA Base", stx, sd);
		CIQ.Studies.MA("ma", sd.days, cSym, 0, "_MA Comp", stx, sd);
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var cSymQ = quotes[i][cSym];
			if (cSymQ && (cSymQ.Close || cSymQ.Close === 0)) cSymQ = cSymQ.Close;
			quotes[i]["Result " + sd.name] =
				(quotes[i].Close / cSymQ) *
				(quotes[i]["_MA Comp " + sd.name] / quotes[i]["_MA Base " + sd.name]);
		}
	};

	CIQ.Studies.calculateBeta = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var cSym = sd.inputs["Comparison Symbol"].toUpperCase();
		if (!cSym) cSym = sd.study.inputs["Comparison Symbol"];
		if (!sd.days) sd.days = sd.study.inputs.Period;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		for (var i = Math.max(sd.startFrom, 1); i < quotes.length; i++) {
			quotes[i]["_BaseChange " + sd.name] =
				quotes[i].Close / quotes[i - 1].Close - 1;
			var cSymQ = quotes[i][cSym];
			if (cSymQ && (cSymQ.Close || cSymQ.Close === 0)) cSymQ = cSymQ.Close;
			var cSymQ1 = quotes[i - 1][cSym];
			if (cSymQ1 && (cSymQ1.Close || cSymQ1.Close === 0)) cSymQ1 = cSymQ1.Close;
			quotes[i]["_CompChange " + sd.name] = cSymQ / cSymQ1 - 1;
		}
		CIQ.Studies.MA(
			"ma",
			sd.days,
			"_BaseChange " + sd.name,
			0,
			"_MA Base",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"ma",
			sd.days,
			"_CompChange " + sd.name,
			0,
			"_MA Comp",
			stx,
			sd
		);
		for (i = Math.max(sd.startFrom, sd.days); i < quotes.length; i++) {
			quotes[i]["_COVARn " + sd.name] =
				(quotes[i]["_BaseChange " + sd.name] -
					quotes[i]["_MA Base " + sd.name]) *
				(quotes[i]["_CompChange " + sd.name] -
					quotes[i]["_MA Comp " + sd.name]);
			quotes[i]["_VARn " + sd.name] = Math.pow(
				quotes[i]["_CompChange " + sd.name] - quotes[i]["_MA Comp " + sd.name],
				2
			);
		}
		CIQ.Studies.MA("ma", sd.days, "_COVARn " + sd.name, 0, "_COVAR", stx, sd);
		CIQ.Studies.MA("ma", sd.days, "_VARn " + sd.name, 0, "_VAR", stx, sd);
		for (i = Math.max(sd.startFrom, sd.days * 2 - 1); i < quotes.length; i++) {
			quotes[i]["Result " + sd.name] =
				quotes[i]["_COVAR " + sd.name] / quotes[i]["_VAR " + sd.name];
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		correl: {
			name: "Correlation Coefficient",
			range: "-1 to 1",
			calculateFN: CIQ.Studies.calculateCorrelationCoefficient,
			outputs: {}
		},
		"Perf Idx": {
			name: "Performance Index",
			centerline: 1,
			initializeFN: CIQ.Studies.initPriceRelative,
			seriesFN: CIQ.Studies.displayVsComparisonSymbol,
			calculateFN: CIQ.Studies.calculatePerformance,
			inputs: { Period: 120, "Comparison Symbol": "SPY" },
			outputs: { Result: "auto", Gain: "#00DD00", Loss: "#FF0000" },
			deferUpdate: true
		},
		Beta: {
			name: "Beta",
			centerline: 1,
			initializeFN: CIQ.Studies.initPriceRelative,
			seriesFN: CIQ.Studies.displayVsComparisonSymbol,
			calculateFN: CIQ.Studies.calculateBeta,
			inputs: { Period: 20, "Comparison Symbol": "SPY" },
			deferUpdate: true
		}
	});
}

};

let __js_advanced_studies_coppock_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("coppock feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateCoppock = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		var longDays = parseInt(sd.inputs["Long RoC"], 10);
		if (!longDays) longDays = 14;
		var shortDays = parseInt(sd.inputs["Short RoC"], 10);
		if (!shortDays) shortDays = 11;
		var period = sd.days;
		if (!period) period = 10;
		if (longDays < shortDays) return;

		if (quotes.length < Math.max(shortDays, longDays, period) + 1) {
			sd.error = true;
			return;
		}
		for (var i = Math.max(sd.startFrom, longDays); i < quotes.length; i++) {
			var denom1 = quotes[i - shortDays][field];
			var denom2 = quotes[i - longDays][field];
			if (denom1 && denom2) {
				// skip if denominator is 0 --
				quotes[i]["_Sum " + sd.name] =
					100 * (quotes[i][field] / denom1 + quotes[i][field] / denom2 - 2);
			}
		}

		CIQ.Studies.MA("weighted", period, "_Sum " + sd.name, 0, "Result", stx, sd);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Coppock: {
			name: "Coppock Curve",
			calculateFN: CIQ.Studies.calculateCoppock,
			inputs: { Period: 10, Field: "field", "Short RoC": 11, "Long RoC": 14 }
		}
	});
}

};

let __js_advanced_studies_darvasBox_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("darvasBox feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateDarvas = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var allTimeHigh = 0;
		var allTimeHighPeriods = parseInt(sd.inputs["ATH Lookback Period"], 10);
		if (sd.inputs["Volume Spike"]) {
			CIQ.Studies.MA("simple", allTimeHighPeriods, "Volume", 0, "ADV", stx, sd);
		}
		var spikePercentage = parseFloat(sd.inputs["Volume % of Avg"]) / 100;
		var boxState = "none";
		var boxData = {};
		var ghost = null;
		var buy = null,
			sell = null;
		var offset = parseFloat(sd.inputs["Level Offset"]);
		var debug = false;
		if (debug) console.log("*****************");
		var i;
		var lbl = {}; //labels
		["Darvas", "Ghost", "Profit", "Loss", "ATH", "ADV", "Spike"].forEach(
			function (v) {
				lbl[v] = v + " " + sd.name;
			}
		);
		for (i = sd.startFrom - 1; i > 0; i--) {
			var q = quotes[i];
			if (q[lbl.Darvas] || q[lbl.Ghost]) {
				for (var l in lbl) q[l] = null;
			} else {
				allTimeHigh = q[lbl.ATH] || 0;
				buy = q[lbl.Profit];
				sell = q[lbl.Loss];
				break;
			}
		}
		for (i; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;

			if (parseFloat(sd.inputs["Price Minimum"]) <= quotes[allTimeHigh].Close) {
				if (ghost && (!ghost.End || i == ghost.End + 1)) {
					if (quotes[i - 1].Close > boxData.High) {
						boxData = {
							State: 1,
							High: 2 * boxData.High - boxData.Low,
							Low: boxData.High,
							Start: i,
							End: 2 * boxData.End - boxData.Start + 1
						};
					} else {
						ghost = null;
						//boxData={State:1,High:boxData.High,Low:boxData.Low,Start:i,End:2*boxData.End-boxData.Start+1};
					}
					if (ghost) {
						quote[lbl.Ghost] = CIQ.clone(boxData);
						if (debug) console.log("Ghost begin:" + quote.DT);
						boxData.State = 0;
						if (quotes[boxData.End]) {
							quotes[boxData.End][lbl.Ghost] = CIQ.clone(boxData);
							if (debug) console.log("Ghost end:" + quotes[boxData.End].DT);
						}
						ghost = { Start: boxData.Start, End: boxData.End };
						buy = boxData.High + offset;
						if (!sell || sell < boxData.Low - offset) {
							sell = boxData.Low - offset;
						}
					}
				}

				quote[lbl.Profit] = buy;
				quote[lbl.Loss] = sell;
				if (quote.Close >= buy) buy = null;
				else if (sd.inputs["Exit Field"] == "high/low" && quote.High >= buy)
					buy = null;

				if (boxState == "none") {
					if (i == allTimeHigh + 3) {
						if (
							!quotes[allTimeHigh + 2][lbl.Darvas] &&
							!quotes[allTimeHigh + 1][lbl.Darvas] &&
							!quotes[allTimeHigh][lbl.Darvas] &&
							quotes[allTimeHigh].High > quote.High
						) {
							boxState = "high";
							//if(sell) buy=Math.max(buy,quotes[allTimeHigh].High+offset);
						}
					}
				}

				if (boxState == "high") {
					if (quote.High > quotes[allTimeHigh].High) {
						boxState = "none";
					} else if (
						quotes[i - 3].Low < quotes[i - 2].Low &&
						quotes[i - 3].Low < quotes[i - 1].Low &&
						quotes[i - 3].Low < quote.Low
					) {
						boxData = {
							State: 1,
							High: quotes[allTimeHigh].High,
							Low: quotes[i - 3].Low,
							Start: allTimeHigh
						};
						quotes[allTimeHigh][lbl.Darvas] = CIQ.clone(boxData);
						boxState = "darvas";
						if (debug) console.log("Darvas begin:" + quotes[allTimeHigh].DT);
						if (debug) console.log("Darvas established:" + quote.DT);
						if (ghost) {
							if (ghost.End > i && quotes[ghost.Start]) {
								quote[lbl.Ghost] = CIQ.clone(quotes[ghost.Start][lbl.Ghost]);
								quote[lbl.Ghost].End = i;
								if (quotes[ghost.End]) {
									delete quotes[ghost.End][lbl.Ghost];
									if (debug)
										console.log("Ghost End removed:" + quotes[ghost.End].DT);
								}
							}
							quote[lbl.Ghost].State = 0;
							quotes[ghost.Start][lbl.Ghost].End = i;
							if (debug) console.log("Ghost end:" + quote.DT);
							ghost = null;
						}
						buy = boxData.High + offset;
						if (!sell || sell < boxData.Low - offset) {
							sell = boxData.Low - offset;
						}
					}
				}

				if (boxState == "darvas") {
					if (quote.Close > boxData.High) ghost = {};
					else if (
						sd.inputs["Exit Field"] == "high/low" &&
						quote.High > boxData.High
					)
						ghost = {};
					else if (quote.Close < boxData.Low) boxState = "none";
					else if (
						sd.inputs["Exit Field"] == "high/low" &&
						quote.Low < boxData.Low
					)
						boxState = "none";
					if (ghost) boxState = "none";
					else if (boxState == "none") {
						buy = null;
						sell = null;
					}
					if (!sd.inputs["Ghost Boxes"]) ghost = null;
					if (boxState == "none") {
						for (var d = boxData.Start + 1; d < i; d++) {
							quotes[d][lbl.Darvas] = CIQ.clone(boxData);
						}
						boxData.State = 0;
						boxData.End = i;
						quote[lbl.Darvas] = CIQ.clone(boxData);
						if (debug) console.log("Darvas end:" + quote.DT);
						quote[lbl.ATH] = allTimeHigh;
						continue;
					}
				}

				if (sell) {
					if (
						quote.Close < boxData.Low ||
						(sd.inputs["Exit Field"] == "high/low" && quote.Low < boxData.Low)
					) {
						if (boxState == "darvas") boxState = "none";
						if (
							quote.Close < sell ||
							(sd.inputs["Exit Field"] == "high/low" && quote.Low < sell)
						) {
							buy = null;
							sell = null;
						}
						if (ghost) {
							if (ghost.End > i && quotes[ghost.Start]) {
								quote[lbl.Ghost] = CIQ.clone(quotes[ghost.Start][lbl.Ghost]);
								quote[lbl.Ghost].End = i;
								if (quotes[ghost.End]) {
									delete quotes[ghost.End][lbl.Ghost];
									if (debug)
										console.log("Ghost End removed:" + quotes[ghost.End].DT);
								}
							}
							quote[lbl.Ghost].State = 0;
							quotes[ghost.Start][lbl.Ghost].End = i;
							if (debug) console.log("Ghost end:" + quote.DT);
							ghost = null;
						}
					}
				}
			}

			if (quote.High >= quotes[allTimeHigh].High) {
				allTimeHigh = i;
				if (debug) console.log("All Time High:" + quote.DT);
			}

			if (
				i < 3 ||
				(quote.High >= quotes[i - 1].High &&
					quote.High >= quotes[i - 2].High &&
					quote.High >= quotes[i - 3].High)
			) {
				if (i - allTimeHigh >= allTimeHighPeriods) {
					allTimeHigh = i;
					for (var j = 0; j < allTimeHighPeriods; j++) {
						if (i - j < 0) break;
						if (quotes[i - j].High > quotes[allTimeHigh].High) {
							allTimeHigh = i - j;
						}
					}
					if (debug) console.log("All Time High:" + quote.DT);
				}
			}

			if (
				sd.inputs["Volume Spike"] &&
				i > allTimeHighPeriods &&
				i == allTimeHigh
			) {
				if (quote[lbl.ADV] * spikePercentage < quote.Volume) {
					quote[lbl.Spike] = 1;
					if (debug) console.log("Volume Spike:" + quote.DT);
				}
			}
			quote[lbl.ATH] = allTimeHigh;
		}
	};

	// NOTE: Darvas will only display on the chart panel sharing the yAxis.
	CIQ.Studies.displayDarvas = function (stx, sd, quotes) {
		var levelsColor = CIQ.Studies.determineColor(sd.outputs.Levels);
		if (!levelsColor || levelsColor == "auto" || CIQ.isTransparent(levelsColor))
			levelsColor = stx.defaultColor;
		var darvasColor = CIQ.Studies.determineColor(sd.outputs.Darvas);
		if (!darvasColor || darvasColor == "auto" || CIQ.isTransparent(darvasColor))
			darvasColor = stx.defaultColor;
		var ghostColor = CIQ.Studies.determineColor(sd.outputs.Ghost);
		if (!ghostColor || ghostColor == "auto" || CIQ.isTransparent(ghostColor))
			ghostColor = stx.defaultColor;

		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var i, q;
		var slyh1, slyl1;
		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;
		stx.startClip(sd.panel);
		if (sd.inputs["Stop Levels"]) {
			if (context.setLineDash) {
				context.setLineDash([2, 2]);
			}
			context.lineWidth = 2;
			context.strokeStyle = levelsColor;
			/*  Don't display the take profit levels
			context.beginPath();
			for(i=0;i<quotes.length;i++){
				q=quotes[i];
				q1=quotes[i-1];
				if(!q) continue;
				slyh1=q["Profit "+sd.name]?Math.floor(stx.pixelFromPrice(q["Profit "+sd.name], panel)):null;
				var slyh0=q1 && q1["Profit "+sd.name]?Math.floor(stx.pixelFromPrice(q1["Profit "+sd.name], panel)):null;
				if(slyh1){
					if(q.candleWidth) myWidth=Math.floor(Math.max(1,q.candleWidth));
					var slxh1=Math.floor(stx.pixelFromBar(i, panel.chart)+myWidth/2);
					var slxh0=Math.floor(stx.pixelFromBar(i, panel.chart)-myWidth/2);
					if(slyh0) context.lineTo(slxh0,slyh1);
					else if(i===0) context.moveTo(stx.chart.left,slyh1);
					else context.moveTo(slxh0,slyh1);
					context.lineTo(slxh1,slyh1);
				}
			}
			context.stroke();
			*/
			context.beginPath();
			for (i = 0; i < quotes.length; i++) {
				q = quotes[i];
				var q1 = quotes[i - 1];
				if (!q) continue;
				slyl1 = q["Loss " + sd.name]
					? Math.floor(stx.pixelFromPrice(q["Loss " + sd.name], panel))
					: null;
				var slyl0 =
					q1 && q1["Loss " + sd.name]
						? Math.floor(stx.pixelFromPrice(q1["Loss " + sd.name], panel))
						: null;
				if (slyl1) {
					if (q.candleWidth) myWidth = Math.floor(Math.max(1, q.candleWidth));
					var slxl1 = Math.floor(
						stx.pixelFromBar(i, panel.chart) + myWidth / 2
					);
					var slxl0 = Math.floor(
						stx.pixelFromBar(i, panel.chart) - myWidth / 2
					);
					if (slyl0 && slyl0 >= slyl1) context.lineTo(slxl0, slyl1);
					else if (i === 0) context.moveTo(stx.chart.left, slyl1);
					else context.moveTo(slxl0, slyl1);
					context.lineTo(slxl1, slyl1);
				}
			}
			context.stroke();
			if (context.setLineDash) {
				context.setLineDash([]);
			}
			context.lineWidth = 1;
		}
		var dx = -10,
			dy,
			dw = 0,
			dh,
			gx = -10,
			gy,
			gw = 0,
			gh;
		var inDarvas = false,
			inGhost = false;
		var signalWidth = context.measureText("\u25B2").width / 2;
		var lastBarWithClose = 0;
		for (i = 0; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			if (quotes[i].Close || quotes[i].Close === 0) lastBarWithClose = i;
			if (quotes[i]["Spike " + sd.name]) {
				context.fillStyle = darvasColor;
				context.textBaseline = "bottom";
				var y = stx.pixelFromPrice(quotes[i].High, stx.chart.panel);
				context.fillText("\u25BC", stx.pixelFromBar(i) - signalWidth, y - 5); // down arrow
			}

			if (quotes[i].candleWidth)
				myWidth = Math.floor(Math.max(1, quotes[i].candleWidth));
			if (quotes[i]["Darvas " + sd.name]) {
				q = quotes[i]["Darvas " + sd.name];
				if (q.State == 1 && !inDarvas) {
					dx = Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2);
					dy = Math.floor(stx.pixelFromPrice(q.High, panel));
					dh = Math.floor(stx.pixelFromPrice(q.Low, panel)) - dy;
					inDarvas = true;
				} else if (q.State === 0) {
					dw = Math.floor(stx.pixelFromBar(i, panel.chart) + myWidth / 2) - dx;
					dy = Math.floor(stx.pixelFromPrice(q.High, panel));
					dh = Math.floor(stx.pixelFromPrice(q.Low, panel)) - dy;
					context.strokeStyle = darvasColor;
					context.fillStyle = darvasColor;
					if (!sd.inputs["Stop Levels"]) {
						context.strokeRect(dx, dy, dw, dh);
						context.globalAlpha = 0.2;
					} else {
						context.globalAlpha = 0.3;
					}
					context.fillRect(dx, dy, dw, dh);
					context.globalAlpha = 1;
					inDarvas = false;
				}
			}
			if (quotes[i]["Ghost " + sd.name] && sd.inputs["Ghost Boxes"]) {
				q = quotes[i]["Ghost " + sd.name];
				if (q.State == 1 && !inGhost) {
					gx = Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2);
					gy = Math.floor(stx.pixelFromPrice(q.High, panel));
					gw = Math.floor(
						(q.End - q.Start + 1) * stx.layout.candleWidth + myWidth / 2
					);
					gh = Math.floor(stx.pixelFromPrice(q.Low, panel)) - gy;
					inGhost = true;
				} else if (q.State === 0) {
					if (q.Start == q.End)
						gx = Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2);
					gw = Math.floor(stx.pixelFromBar(i, panel.chart) + myWidth / 2) - gx;
					gy = Math.floor(stx.pixelFromPrice(q.High, panel));
					gh = Math.floor(stx.pixelFromPrice(q.Low, panel)) - gy;
					context.strokeStyle = ghostColor;
					context.fillStyle = ghostColor;
					if (!sd.inputs["Stop Levels"]) {
						context.strokeRect(gx, gy, gw, gh);
						context.globalAlpha = 0.2;
					} else {
						context.globalAlpha = 0.3;
					}
					context.fillRect(gx, gy, gw, gh);
					context.globalAlpha = 1;
					inGhost = false;
				}
			}
		}
		if (inDarvas) {
			dw =
				Math.floor(
					stx.pixelFromBar(lastBarWithClose, panel.chart) + myWidth / 2
				) - dx;
			context.strokeStyle = darvasColor;
			context.fillStyle = darvasColor;
			if (!sd.inputs["Stop Levels"]) {
				context.beginPath();
				context.moveTo(dx + 2 * dw, dy);
				context.lineTo(dx, dy);
				context.lineTo(dx, dy + dh);
				context.lineTo(dx + 2 * dw, dy + dh);
				context.stroke();
				context.globalAlpha = 0.2;
			} else {
				context.globalAlpha = 0.3;
			}
			context.fillRect(dx, dy, 2 * dw, dh);
			context.globalAlpha = 1;
		}
		if (inGhost) {
			context.strokeStyle = ghostColor;
			context.fillStyle = ghostColor;
			if (!sd.inputs["Stop Levels"]) {
				context.strokeRect(gx, gy, gw, gh);
				context.globalAlpha = 0.2;
			} else {
				context.globalAlpha = 0.3;
			}
			context.fillRect(gx, gy, gw, gh);
			context.globalAlpha = 1;
		}
		if (inDarvas || inGhost) {
			if (sd.inputs["Stop Levels"]) {
				if (context.setLineDash) {
					context.setLineDash([2, 2]);
				}
				context.lineWidth = 2;
				context.strokeStyle = levelsColor;
				var x = Math.floor(
					stx.pixelFromBar(lastBarWithClose - 1, panel.chart) + myWidth / 2
				);
				if (slyh1) {
					context.beginPath();
					context.moveTo(x, slyh1);
					context.lineTo(inDarvas ? dx + 2 * dw : gx + gw, slyh1);
					context.stroke();
				}
				if (slyl1) {
					context.beginPath();
					context.moveTo(x, slyl1);
					context.lineTo(inDarvas ? dx + 2 * dw : gx + gw, slyl1);
					context.stroke();
				}
				if (context.setLineDash) {
					context.setLineDash([]);
				}
				context.lineWidth = 1;
			}
			inDarvas = false;
			inGhost = false;
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Darvas: {
			name: "Darvas Box",
			underlay: true,
			calculateFN: CIQ.Studies.calculateDarvas,
			seriesFN: CIQ.Studies.displayDarvas,
			inputs: {
				"ATH Lookback Period": 100,
				"Exit Field": ["close", "high/low"],
				"Ghost Boxes": true,
				"Stop Levels": false,
				"Level Offset": 0.01,
				"Price Minimum": 5,
				"Volume Spike": false,
				"Volume % of Avg": 400
			},
			outputs: { Darvas: "#5F7CB8", Ghost: "#699158", Levels: "auto" },
			customRemoval: true,
			attributes: {
				"Price Minimum": { min: 0.01, step: 0.01 },
				yaxisDisplayValue: { hidden: true },
				panelName: { hidden: true },
				flippedEnabled: { hidden: true }
			}
		}
	});
}

};

let __js_advanced_studies_detrended_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("detrended feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateDetrendedPrice = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var offset = Math.floor(sd.days / 2 + 1);
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			field,
			-offset,
			"MA",
			stx,
			sd
		);

		for (
			var i = Math.max(sd.days - offset - 1, sd.startFrom - offset);
			i < quotes.length - offset;
			i++
		) {
			var val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			var maVal = quotes[i]["MA " + sd.name];
			if ((val || val === 0) && (maVal || maVal === 0))
				quotes[i]["Result " + sd.name] = val - maVal;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Detrended: {
			name: "Detrended Price Oscillator",
			calculateFN: CIQ.Studies.calculateDetrendedPrice,
			inputs: { Period: 14, Field: "field", "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_disparity_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("disparity feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateDisparity = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			field,
			0,
			"_MA",
			stx,
			sd
		);
		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			if (!quotes[i]) continue;
			var qMA = quotes[i]["_MA " + sd.name];
			if (qMA)
				quotes[i]["Result " + sd.name] = 100 * (quotes[i][field] / qMA - 1);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Disparity: {
			name: "Disparity Index",
			calculateFN: CIQ.Studies.calculateDisparity,
			inputs: { Period: 14, Field: "field", "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_easeOfMovement_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"easeOfMovement feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateEaseOfMovement = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var avgCurrent = (quotes[i].High + quotes[i].Low) / 2;
			var avgPrior = (quotes[i - 1].High + quotes[i - 1].Low) / 2;
			var dm = avgCurrent - avgPrior;
			var br = quotes[i].Volume / 100000000 / (quotes[i].High - quotes[i].Low);
			var result = dm / br;
			if (!isFinite(result)) quotes[i]["_EOM1 " + sd.name] = NaN;
			//With NaN, the study plotter will plot from the previous point
			//directly to the next point after the current tick. Infinity was making the
			//study not plot in the panel at all while the data point was in dataSegement.
			else quotes[i]["_EOM1 " + sd.name] = result;
		}
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"_EOM1 " + sd.name,
			0,
			"Result",
			stx,
			sd
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		EOM: {
			name: "Ease of Movement",
			calculateFN: CIQ.Studies.calculateEaseOfMovement,
			inputs: { Period: 14, "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_ehlerFisher_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"ehlerFisher feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateEhlerFisher = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		function getLLVHHV(p, x) {
			var l = Number.MAX_VALUE,
				h = Number.MAX_VALUE * -1;
			for (var j = x - p + 1; j <= x; j++) {
				var d = (quotes[j].High + quotes[j].Low) / 2;
				l = Math.min(l, d);
				h = Math.max(h, d);
			}
			return [l, h];
		}

		var n = 0;
		if (sd.startFrom > 1) n = quotes[sd.startFrom - 1]["_n " + sd.name];
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (quote.futureTick) break;
			if (i < sd.days - 1) {
				quote["EF " + sd.name] = quote["EF Trigger " + sd.name] = n;
				continue;
			}
			var lh = getLLVHHV(sd.days, i);
			n =
				0.33 *
					2 *
					(((quotes[i].High + quotes[i].Low) / 2 - lh[0]) /
						Math.max(0.000001, lh[1] - lh[0]) -
						0.5) +
				0.67 * n;
			if (n > 0) n = Math.min(n, 0.9999);
			else if (n < 0) n = Math.max(n, -0.9999);
			var previous = i ? quotes[i - 1]["EF " + sd.name] : 0;
			quote["EF " + sd.name] =
				0.5 * Math.log((1 + n) / (1 - n)) + 0.5 * previous;
			quote["EF Trigger " + sd.name] = previous;
			quote["_n " + sd.name] = n;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Ehler Fisher": {
			name: "Ehler Fisher Transform",
			calculateFN: CIQ.Studies.calculateEhlerFisher,
			inputs: { Period: 10 },
			outputs: { EF: "auto", "EF Trigger": "#FF0000" }
		}
	});
}

};

let __js_advanced_studies_elder_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("elder feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateElderImpulse = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var bull = sd.outputs.Bullish;
		var bear = sd.outputs.Bearish;
		var neutral = sd.outputs.Neutral;

		CIQ.Studies.MA("exponential", 13, "Close", 0, "_MA", stx, sd);
		sd.macd = new CIQ.Studies.StudyDescriptor("_" + sd.name, "macd", sd.panel);
		sd.macd.chart = sd.chart;
		sd.macd.days = sd.days;
		sd.macd.startFrom = sd.startFrom;
		sd.macd.inputs = {
			"Fast MA Period": 12,
			"Slow MA Period": 26,
			"Signal Period": 9
		};
		sd.macd.outputs = { _MACD: null, _Signal: null };
		CIQ.Studies.calculateMACD(stx, sd.macd);

		var color;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (i === 0) color = neutral;
			else if (
				quotes[i]["_MA " + sd.name] > quotes[i - 1]["_MA " + sd.name] &&
				quotes[i]["_" + sd.name + "_hist"] >
					quotes[i - 1]["_" + sd.name + "_hist"]
			)
				color = bull;
			else if (
				quotes[i]["_MA " + sd.name] < quotes[i - 1]["_MA " + sd.name] &&
				quotes[i]["_" + sd.name + "_hist"] <
					quotes[i - 1]["_" + sd.name + "_hist"]
			)
				color = bear;
			else color = neutral;
			quotes[i]["Result " + sd.name] = color;
			//if(i) quotes[i-1][sd.name+"_hist"]=null;
		}
	};

	CIQ.Studies.calculateElderRay = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		CIQ.Studies.MA("exponential", sd.days, "Close", 0, "_EMA", stx, sd);

		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			quotes[i][sd.name + "_hist1"] =
				quotes[i].High - quotes[i]["_EMA " + sd.name];
			quotes[i][sd.name + "_hist2"] =
				quotes[i].Low - quotes[i]["_EMA " + sd.name];
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist1"] = "";
		sd.outputMap[sd.name + "_hist2"] = "";
	};

	CIQ.Studies.calculateElderForce = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			quotes[i]["_EF1 " + sd.name] =
				quotes[i].Volume * (quotes[i].Close - quotes[i - 1].Close);
		}
		CIQ.Studies.MA(
			"exponential",
			sd.days,
			"_EF1 " + sd.name,
			0,
			"Result",
			stx,
			sd
		);
	};

	CIQ.Studies.initElderImpulse = function (
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
		if (parameters.calculateOnly) return sd;
		stx.chart.customChart = {
			chartType: "colored_bar",
			colorFunction: function (stx, quote, mode) {
				var color = quote["Result " + sd.name];
				if (color && typeof color == "object") color = color.color;
				return color;
			}
		};
		stx.setMainSeriesRenderer();
		return sd;
	};

	CIQ.Studies.displayElderForce = function (stx, sd, quotes) {
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		var color = CIQ.Studies.determineColor(sd.outputs.Result);
		var panel = stx.panels[sd.panel];
		var yAxis = sd.getYAxis(stx);
		var params = {
			skipTransform: panel.name != sd.chart.name,
			panelName: sd.panel,
			band: "Result " + sd.name,
			threshold: 0,
			color: color,
			yAxis: yAxis
		};
		if (!sd.highlight && stx.highlightedDraggable) params.opacity = 0.3;
		params.direction = 1;
		CIQ.preparePeakValleyFill(stx, params);
		params.direction = -1;
		CIQ.preparePeakValleyFill(stx, params);
	};

	CIQ.Studies.displayElderRay = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);
		var y = stx.pixelFromPrice(0, panel, yAxis);

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;
		function drawBar(i, reduction, output, hist) {
			context.fillStyle = CIQ.Studies.determineColor(sd.outputs[output]);
			context.fillRect(
				Math.floor(
					stx.pixelFromBar(i, panel.chart) - myWidth / 2 + myWidth * reduction
				),
				Math.floor(y),
				Math.floor(myWidth * (1 - 2 * reduction)),
				Math.floor(stx.pixelFromPrice(quote[sd.name + hist], panel, yAxis) - y)
			);
		}

		stx.canvasColor("stx_histogram");
		var fillStyle = context.fillStyle;
		if (!sd.underlay) context.globalAlpha = 1;
		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			if (quote.candleWidth)
				myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
			if (quote[sd.name + "_hist1"] > 0)
				drawBar(i, 0, "Elder Bull Power", "_hist1");
			if (quote[sd.name + "_hist2"] < 0)
				drawBar(i, 0, "Elder Bear Power", "_hist2");
			if (quote[sd.name + "_hist1"] < 0)
				drawBar(i, 0.1, "Elder Bull Power", "_hist1");
			if (quote[sd.name + "_hist2"] > 0)
				drawBar(i, 0.1, "Elder Bear Power", "_hist2");
		}
		stx.endClip();
		context.fillStyle = fillStyle;
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Elder Force": {
			name: "Elder Force Index",
			calculateFN: CIQ.Studies.calculateElderForce,
			seriesFN: CIQ.Studies.displayElderForce,
			inputs: { Period: 13 }
		},
		"Elder Ray": {
			name: "Elder Ray Index",
			seriesFN: CIQ.Studies.displayElderRay,
			calculateFN: CIQ.Studies.calculateElderRay,
			centerline: 0,
			inputs: { Period: 13 },
			outputs: { "Elder Bull Power": "#00DD00", "Elder Bear Power": "#FF0000" }
		},
		"Elder Impulse": {
			name: "Elder Impulse System",
			calculateFN: CIQ.Studies.calculateElderImpulse,
			initializeFN: CIQ.Studies.initElderImpulse,
			seriesFN: null,
			customRemoval: true,
			underlay: true,
			inputs: {},
			outputs: { Bullish: "#8BC176", Bearish: "#DD3E39", Neutral: "#5F7CB8" },
			removeFN: function (stx, sd) {
				stx.chart.customChart = null;
				stx.setMainSeriesRenderer();
			}
		}
	});
}

};

let __js_advanced_studies_fractalChaos_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"fractalChaos feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateFractalChaos = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var fractalHigh = 0;
		var fractalLow = 0;
		var test = 0;
		if (sd.startFrom && sd.type == "Fractal Chaos Bands") {
			fractalHigh = quotes[sd.startFrom - 1]["Fractal High " + sd.name];
			fractalLow = quotes[sd.startFrom - 1]["Fractal Low " + sd.name];
		}
		for (var i = Math.max(4, sd.startFrom); i < quotes.length; i++) {
			if (quotes[i].futureTick) break;
			var nHi = !isNaN(quotes[i].High),
				nLo = !isNaN(quotes[i].Low);
			if (nHi || nLo) quotes[i]["Result " + sd.name] = 0;
			var j;
			test = 0;
			for (j = 0; j <= i; j++) {
				if (!quotes[i - j]) break;
				if (quotes[i - j].High > quotes[i - 2].High) break;
				if (j < 2 && quotes[i - j].High == quotes[i - 2].High) break;
				if (quotes[i - j].High < quotes[i - 2].High) test++;
				if (test == 4) {
					fractalHigh = quotes[i - 2].High;
					break;
				}
			}
			if (sd.type == "Fractal Chaos Bands") {
				if (nHi)
					quotes[i]["Fractal High " + sd.name] =
						fractalHigh > 0 ? fractalHigh : null;
			} else if (test == 4) {
				//oscillator
				quotes[i]["Result " + sd.name] = 1;
			}
			test = 0;
			for (j = 0; j <= i; j++) {
				if (!quotes[i - j]) break;
				if (quotes[i - j].Low < quotes[i - 2].Low) break;
				if (j < 2 && quotes[i - j].Low == quotes[i - 2].Low) break;
				if (quotes[i - j].Low > quotes[i - 2].Low) test++;
				if (test == 4) {
					fractalLow = quotes[i - 2].Low;
					break;
				}
			}
			if (sd.type == "Fractal Chaos Bands") {
				if (nLo)
					quotes[i]["Fractal Low " + sd.name] =
						fractalLow > 0 ? fractalLow : null;
			} else if (test == 4) {
				//oscillator
				quotes[i]["Result " + sd.name] = -1;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Fractal Chaos": {
			name: "Fractal Chaos Oscillator",
			range: "-1 to 1",
			calculateFN: CIQ.Studies.calculateFractalChaos,
			inputs: {},
			centerline: null // so centerline is drawn but not included in the range calculation
		},
		"Fractal Chaos Bands": {
			name: "Fractal Chaos Bands",
			overlay: true,
			calculateFN: CIQ.Studies.calculateFractalChaos,
			seriesFN: CIQ.Studies.displayChannel,
			inputs: { "Channel Fill": true },
			outputs: {
				"Fractal High": "auto",
				"Fractal Low": "auto",
				"Fractal Channel": "auto"
			}
		}
	});
}

};

let __js_advanced_studies_highLowStudies_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"highLowStudies feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateMaxHighMinLow = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var highPeriod = sd.days,
			lowPeriod = sd.days;
		if (sd.inputs["High Period"]) highPeriod = sd.inputs["High Period"];
		if (sd.inputs["Low Period"]) lowPeriod = sd.inputs["Low Period"];
		if (quotes.length < Math.max(highPeriod, lowPeriod) + 1) {
			sd.error = true;
			return;
		}

		var low = Number.MAX_VALUE,
			high = Number.MAX_VALUE * -1;
		var j;
		if (sd.startFrom > 1) {
			for (j = 1; j < highPeriod; j++) {
				if (sd.startFrom - j >= 0)
					high = Math.max(high, quotes[sd.startFrom - j].High);
			}
			for (j = 1; j < lowPeriod; j++) {
				if (sd.startFrom - j >= 0)
					low = Math.min(low, quotes[sd.startFrom - j].Low);
			}
		}
		for (var i = Math.max(0, sd.startFrom - 1); i < quotes.length; i++) {
			high = Math.max(high, quotes[i].High);
			low = Math.min(low, quotes[i].Low);
			if (i >= highPeriod) {
				if (quotes[i - highPeriod].High == high) {
					high = quotes[i].High;
					for (j = 1; j < highPeriod; j++) {
						high = Math.max(high, quotes[i - j].High);
					}
				}
			}
			if (i >= lowPeriod) {
				if (quotes[i - lowPeriod].Low == low) {
					low = quotes[i].Low;
					for (j = 1; j < lowPeriod; j++) {
						low = Math.min(low, quotes[i - j].Low);
					}
				}
			}
			var result = 0;
			if (sd.type == "HHV") {
				result = high;
			} else if (sd.type == "LLV") {
				result = low;
			} else if (sd.type == "Donchian Width") {
				result = high - low;
			} else if (sd.type == "GAPO" || sd.type == "Gopala") {
				result = Math.log(high - low) / Math.log(lowPeriod);
			} else if (sd.type == "VT HZ Filter") {
				result = high - low;
				quotes[i]["_MHML " + sd.name] = result;
				continue;
			} else if (sd.type == "Williams %R") {
				result = (-100 * (high - quotes[i].Close)) / (high - low);
				quotes[i]["Result " + sd.name] = result;
				continue;
			}
			if (i == quotes.length - 1) break;

			if (!quotes[i + 1].futureTick) {
				if (sd.type == "Donchian Channel") {
					quotes[i + 1]["Donchian High " + sd.name] = high;
					quotes[i + 1]["Donchian Low " + sd.name] = low;
					quotes[i + 1]["Donchian Median " + sd.name] = (high + low) / 2;
				} else {
					//width
					quotes[i + 1]["Result " + sd.name] = result;
				}
			}
		}
	};

	CIQ.Studies.calculateVerticalHorizontalFilter = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		sd.mhml = new CIQ.Studies.StudyDescriptor(sd.name, sd.type, sd.panel);
		sd.mhml.chart = sd.chart;
		sd.mhml.days = sd.days;
		sd.mhml.startFrom = sd.startFrom;
		sd.mhml.inputs = {};
		sd.mhml.outputs = { _MHML: null };
		CIQ.Studies.calculateMaxHighMinLow(stx, sd.mhml);
		var sumChanges = 0;
		var changes = [];
		for (var i = Math.max(1, sd.startFrom - sd.days); i < quotes.length; i++) {
			var change = Math.abs(quotes[i].Close - quotes[i - 1].Close);
			changes.push(change);
			sumChanges += change;
			if (changes.length == sd.days) {
				quotes[i]["Result " + sd.name] =
					quotes[i]["_MHML " + sd.name] / sumChanges;
				sumChanges -= changes.shift();
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Donchian Channel": {
			name: "Donchian Channel",
			overlay: true,
			calculateFN: CIQ.Studies.calculateMaxHighMinLow,
			seriesFN: CIQ.Studies.displayChannel,
			inputs: { "High Period": 20, "Low Period": 20, "Channel Fill": true },
			outputs: {
				"Donchian High": "auto",
				"Donchian Median": "auto",
				"Donchian Low": "auto"
			}
		},
		"Donchian Width": {
			name: "Donchian Width",
			calculateFN: CIQ.Studies.calculateMaxHighMinLow,
			inputs: { "High Period": 20, "Low Period": 20 }
		},
		GAPO: {
			name: "Gopalakrishnan Range Index",
			calculateFN: CIQ.Studies.calculateMaxHighMinLow
		},
		HHV: {
			name: "Highest High Value",
			calculateFN: CIQ.Studies.calculateMaxHighMinLow,
			inputs: { Period: 14 }
		},
		LLV: {
			name: "Lowest Low Value",
			calculateFN: CIQ.Studies.calculateMaxHighMinLow,
			inputs: { Period: 14 }
		},
		"Williams %R": {
			name: "Williams %R",
			calculateFN: CIQ.Studies.calculateMaxHighMinLow,
			inputs: { Period: 14 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: -20,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -80,
					studyOverSoldColor: "auto"
				}
			}
		},
		"VT HZ Filter": {
			name: "Vertical Horizontal Filter",
			calculateFN: CIQ.Studies.calculateVerticalHorizontalFilter,
			inputs: { Period: 28 }
		},
		"High-Low": {
			name: "High Minus Low",
			calculateFN: function (stx, sd) {
				var quotes = sd.chart.scrubbed;
				for (var i = sd.startFrom; i < quotes.length; i++) {
					quotes[i]["Result " + sd.name] = quotes[i].High - quotes[i].Low;
				}
			},
			inputs: {}
		}
	});
}

};

let __js_advanced_studies_ichimoku_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("ichimoku feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateIchimoku = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var periods = {
			Base: Number(sd.inputs["Base Line Period"]),
			Conv: Number(sd.inputs["Conversion Line Period"]),
			LeadB: Number(sd.inputs["Leading Span B Period"]),
			Lag: Number(sd.inputs["Lagging Span Period"])
		};

		function getLLVHHV(p, x) {
			var l = Number.MAX_VALUE,
				h = Number.MAX_VALUE * -1;
			for (var j = x - p + 1; j <= x; j++) {
				if (j < 0) continue;
				l = Math.min(l, quotes[j].Low);
				h = Math.max(h, quotes[j].High);
			}
			return [l, h];
		}

		var i, hl;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;

			hl = getLLVHHV(periods.Conv, i);
			quotes[i]["Conversion Line " + sd.name] = (hl[1] + hl[0]) / 2;

			hl = getLLVHHV(periods.Base, i);
			quotes[i]["Base Line " + sd.name] = (hl[1] + hl[0]) / 2;

			if (i < periods.Lag) continue;
			quotes[i - periods.Lag]["Lagging Span " + sd.name] = quotes[i].Close;
		}
		var futureTicks = [];
		for (i = Math.max(0, sd.startFrom - periods.Base); i < quotes.length; i++) {
			hl = getLLVHHV(periods.LeadB, i);
			var lsa =
				(quotes[i]["Conversion Line " + sd.name] +
					quotes[i]["Base Line " + sd.name]) /
				2;
			var lsb = (hl[1] + hl[0]) / 2;
			if (quotes[i + periods.Base]) {
				quotes[i + periods.Base]["Leading Span A " + sd.name] = lsa;
				quotes[i + periods.Base]["Leading Span B " + sd.name] = lsb;
			} else {
				var ft = {};
				ft["Leading Span A " + sd.name] = lsa;
				ft["Leading Span B " + sd.name] = lsb;
				futureTicks.push(ft);
			}
		}
		sd.appendFutureTicks(stx, futureTicks);
	};

	CIQ.Studies.displayIchimoku = function (stx, sd, quotes) {
		var topBand = "Leading Span A " + sd.name,
			bottomBand = "Leading Span B " + sd.name;
		var topColor = CIQ.Studies.determineColor(
			sd.outputs[sd.outputMap[topBand]]
		);
		var bottomColor = CIQ.Studies.determineColor(
			sd.outputs[sd.outputMap[bottomBand]]
		);
		var panel = stx.panels[sd.panel];
		var yAxis = sd.getYAxis(stx);
		var parameters = {
			topBand: topBand,
			bottomBand: bottomBand,
			topColor: topColor,
			bottomColor: bottomColor,
			skipTransform: panel.name != sd.chart.name,
			topAxis: yAxis,
			bottomAxis: yAxis,
			opacity: 0.3
		};
		if (!sd.highlight && stx.highlightedDraggable) parameters.opacity *= 0.3;
		CIQ.fillIntersecting(stx, sd.panel, parameters);
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Ichimoku Clouds": {
			name: "Ichimoku Clouds",
			overlay: true,
			calculateFN: CIQ.Studies.calculateIchimoku,
			seriesFN: CIQ.Studies.displayIchimoku,
			inputs: {
				"Conversion Line Period": 9,
				"Base Line Period": 26,
				"Leading Span B Period": 52,
				"Lagging Span Period": 26
			},
			outputs: {
				"Conversion Line": "#0000FF",
				"Base Line": "#FF0000",
				"Leading Span A": "#00FF00",
				"Leading Span B": "#FF0000",
				"Lagging Span": "#808000"
			}
		}
	});
}

};

let __js_advanced_studies_intradayMomentum_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"intradayMomentum feature requires first activating studies feature."
	);
} else {
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

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Intraday Mtm": {
			name: "Intraday Momentum Index",
			calculateFN: CIQ.Studies.calculateIntradayMomentum,
			inputs: { Period: 20 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 70,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 30,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_keltner_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("keltner feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateKeltner = function (stx, sd) {
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"Close",
			0,
			"MA",
			stx,
			sd
		);
		CIQ.Studies.calculateStudyATR(stx, sd);
		CIQ.Studies.calculateGenericEnvelope(
			stx,
			sd,
			sd.inputs.Shift,
			"MA " + sd.name,
			"ATR " + sd.name
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Keltner: {
			name: "Keltner Channel",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: CIQ.Studies.calculateKeltner,
			inputs: {
				Period: 50,
				Shift: 5,
				"Moving Average Type": "ema",
				"Channel Fill": true
			},
			outputs: {
				"Keltner Top": "auto",
				"Keltner Median": "auto",
				"Keltner Bottom": "auto"
			},
			attributes: {
				Shift: { min: 0.1, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_klinger_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("klinger feature requires first activating studies feature.");
} else {
	/**
	 * Calculate function for klinger
	 * @param  {CIQ.ChartEngine} stx Chart object
	 * @param {CIQ.Studies.StudyDescriptor} sd  Study Descriptor
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.calculateKlinger = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var shortCycle = Number(sd.inputs["Short Cycle"]);
		var longCycle = Number(sd.inputs["Long Cycle"]);
		if (quotes.length < Math.max(shortCycle, longCycle) + 1) {
			sd.error = true;
			return;
		}

		var field = sd.name + "_hist",
			klinger = "Klinger " + sd.name,
			klingerSignal = "KlingerSignal " + sd.name,
			signedVolume = "_SV " + sd.name,
			shortEMA = "_EMA-S " + sd.name,
			longEMA = "_EMA-L " + sd.name,
			i;
		for (i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var sv = quotes[i].Volume;
			if (quotes[i]["hlc/3"] < quotes[i - 1]["hlc/3"]) sv *= -1;
			if (sv) quotes[i][signedVolume] = sv;
		}

		CIQ.Studies.MA(
			"exponential",
			shortCycle,
			signedVolume,
			0,
			"_EMA-S",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			longCycle,
			signedVolume,
			0,
			"_EMA-L",
			stx,
			sd
		);

		for (i = Math.max(longCycle, sd.startFrom); i < quotes.length; i++) {
			if (
				quotes[i].futureTick ||
				quotes[i][shortEMA] === null ||
				quotes[i][longEMA] === null
			)
				break;
			quotes[i][klinger] = quotes[i][shortEMA] - quotes[i][longEMA];
		}

		CIQ.Studies.MA(
			"exponential",
			Number(sd.inputs["Signal Periods"]),
			klinger,
			0,
			"KlingerSignal",
			stx,
			sd
		);

		for (i = sd.startFrom; i < quotes.length; i++) {
			quotes[i][field] = quotes[i][klinger] - quotes[i][klingerSignal];
		}
		sd.outputMap[field] = "";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Klinger: {
			name: "Klinger Volume Oscillator",
			seriesFN: CIQ.Studies.displayHistogramWithSeries,
			calculateFN: CIQ.Studies.calculateKlinger,
			inputs: { "Signal Periods": 13, "Short Cycle": 34, "Long Cycle": 55 },
			outputs: {
				Klinger: "auto",
				KlingerSignal: "#FF0000",
				"Increasing Bar": "#00DD00",
				"Decreasing Bar": "#FF0000"
			}
		}
	});
}

};

let __js_advanced_studies_linearRegression_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"linearRegression feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.prettify["time series"] = "tsma";
	CIQ.Studies.movingAverage.conversions.tsma = "time series";
	CIQ.Studies.movingAverage.translations["time series"] = "Time Series";
	CIQ.Studies.movingAverage.typeMap.tsma = "TimeSeries";
	CIQ.Studies.movingAverage.typeMap["time series"] = "TimeSeries";

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
	 * @param {CIQ.Studies.StudyDescriptor} sd  Study Descriptor
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

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Lin Fcst": {
			name: "Linear Reg Forecast",
			overlay: true,
			calculateFN: CIQ.Studies.calculateLinearRegressionIndicator,
			inputs: { Period: 14, Field: "field" },
			outputs: { Forecast: "auto" }
		},
		"Lin Incpt": {
			name: "Linear Reg Intercept",
			overlay: true,
			calculateFN: CIQ.Studies.calculateLinearRegressionIndicator,
			inputs: { Period: 14, Field: "field" },
			outputs: { Intercept: "auto" }
		},
		"Lin R2": {
			name: "Linear Reg R2",
			calculateFN: CIQ.Studies.calculateLinearRegressionIndicator,
			inputs: { Period: 14, Field: "field" },
			outputs: { RSquared: "auto" }
		},
		"LR Slope": {
			name: "Linear Reg Slope",
			calculateFN: CIQ.Studies.calculateLinearRegressionIndicator,
			inputs: { Period: 14, Field: "field" },
			outputs: { Slope: "auto" }
		},
		"Time Fcst": {
			name: "Time Series Forecast",
			overlay: true,
			calculateFN: CIQ.Studies.calculateLinearRegressionIndicator,
			inputs: { Period: 14, Field: "field" },
			outputs: { Forecast: "auto" }
		}
	});
}

};

let __js_advanced_studies_macd_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("macd feature requires first activating studies feature.");
} else {
	/**
	 * Calculate function for MACD study.
	 *
	 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
	 *
	 * **Notes:**
	 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the `sd.outputMap`.
	 * - The study name may contain the unprintable character `&zwnj;`, see studyDescriptor documentation
	 * - Results for the histogram will be added to the dataSegment using a field composed the study name and the "_hist" suffix.
	 *
	 * @param  {CIQ.ChartEngine} stx Chart object
	 * @param {CIQ.Studies.StudyDescriptor} sd  Study Descriptor
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.calculateMACD = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var inputs = sd.inputs,
			name = sd.name;
		if (!sd.macd1Days) sd.macd1Days = parseFloat(inputs["Fast MA Period"]);
		if (!sd.macd2Days) sd.macd2Days = parseFloat(inputs["Slow MA Period"]);
		if (!sd.signalDays) sd.signalDays = parseFloat(inputs["Signal Period"]);
		if (!sd.days) sd.days = Math.max(sd.macd1Days, sd.macd2Days, sd.signalDays);
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		var maType = inputs["Moving Average Type"];
		if (!maType) maType = "exponential";

		CIQ.Studies.MA(maType, sd.macd1Days, field, 0, "_MACD1", stx, sd);
		CIQ.Studies.MA(maType, sd.macd2Days, field, 0, "_MACD2", stx, sd);

		var i,
			quote,
			start = Math.max(sd.startFrom, sd.days - 1);
		for (i = start; i < quotes.length; i++) {
			quote = quotes[i];
			if (
				(quote["_MACD1 " + name] || quote["_MACD1 " + name] === 0) &&
				(quote["_MACD2 " + name] || quote["_MACD2 " + name] === 0)
			)
				quote["MACD " + name] =
					quote["_MACD1 " + name] - quote["_MACD2 " + name];
		}
		var sigMaType = inputs["Signal MA Type"];
		if (!sigMaType) sigMaType = "exponential";
		CIQ.Studies.MA(
			sigMaType,
			sd.signalDays,
			"MACD " + name,
			0,
			"Signal",
			stx,
			sd
		);

		var histogram = name + "_hist";
		for (i = start; i < quotes.length; i++) {
			quote = quotes[i];
			var signal = quote["Signal " + name];
			if (!signal && signal !== 0) continue; // don't create histogram before the signal line is valid
			quote[histogram] = quote["MACD " + name] - quote["Signal " + name];
		}
		sd.outputMap[histogram] = "";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		macd: {
			name: "MACD",
			calculateFN: CIQ.Studies.calculateMACD,
			seriesFN: CIQ.Studies.displayHistogramWithSeries,
			inputs: {
				"Fast MA Period": 12,
				"Slow MA Period": 26,
				"Signal Period": 9
			},
			outputs: {
				MACD: "auto",
				Signal: "#FF0000",
				"Increasing Bar": "#00DD00",
				"Decreasing Bar": "#FF0000"
			}
		}
	});
}

};

let __js_advanced_studies_massIndex_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("massIndex feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateMassIndex = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < Math.max(9, sd.days + 1)) {
			sd.error = true;
			return;
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			quotes[i]["_High-Low " + sd.name] = quotes[i].High - quotes[i].Low;
		}

		CIQ.Studies.MA(
			"exponential",
			9,
			"_High-Low " + sd.name,
			0,
			"_EMA",
			stx,
			sd
		);
		CIQ.Studies.MA("exponential", 9, "_EMA " + sd.name, 0, "_EMA2", stx, sd);

		var total = 0;
		if (
			quotes[sd.startFrom - 1] &&
			quotes[sd.startFrom - 1]["_total " + sd.name]
		)
			total = quotes[sd.startFrom - 1]["_total " + sd.name];
		for (var j = Math.max(17, sd.startFrom); j < quotes.length; j++) {
			total += quotes[j]["_EMA " + sd.name] / quotes[j]["_EMA2 " + sd.name];
			if (j >= 17 + sd.days - 1) {
				quotes[j]["Result " + sd.name] = total;
				total -=
					quotes[j - sd.days + 1]["_EMA " + sd.name] /
					quotes[j - sd.days + 1]["_EMA2 " + sd.name];
			}
			quotes[j]["_total " + sd.name] = total;
		}
	};

	CIQ.Studies.displayMassIndex = function (stx, sd, quotes) {
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);

		var bulge = sd.inputs["Bulge Threshold"];

		var panel = stx.panels[sd.panel];
		var yAxis = sd.getYAxis(stx);
		var color = CIQ.Studies.determineColor(sd.outputs.Result);

		var params = {
			skipTransform: stx.panels[sd.panel].name != sd.chart.name,
			panelName: sd.panel,
			band: "Result " + sd.name,
			threshold: bulge,
			direction: 1,
			color: color,
			yAxis: yAxis,
			opacity: 0.3
		};
		if (!sd.highlight && stx.highlightedDraggable) params.opacity *= 0.3;
		CIQ.preparePeakValleyFill(stx, params);
		CIQ.Studies.drawHorizontal(stx, sd, null, bulge, yAxis, color);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Mass Idx": {
			name: "Mass Index",
			seriesFN: CIQ.Studies.displayMassIndex,
			calculateFN: CIQ.Studies.calculateMassIndex,
			inputs: { Period: 25, "Bulge Threshold": 27 },
			attributes: {
				"Bulge Threshold": { min: 20, max: 35, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_moneyFlow_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("moneyFlow feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateMoneyFlowIndex = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var cumPosMF = 0,
			cumNegMF = 0;
		var startQuote = quotes[sd.startFrom - 1];
		var rawMFLbl = "_rawMF " + sd.name;
		var cumMFLbl = "_cumMF " + sd.name;
		var resultLbl = "Result " + sd.name;
		if (startQuote && startQuote[cumMFLbl]) {
			cumPosMF = startQuote[cumMFLbl][0];
			cumNegMF = startQuote[cumMFLbl][1];
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var typPrice = quotes[i]["hlc/3"];
			if (i > 0 && !quotes[i].futureTick) {
				var lastTypPrice = quotes[i - 1]["hlc/3"];
				var rawMoneyFlow = typPrice * quotes[i].Volume;
				if (typPrice > lastTypPrice) {
					cumPosMF += rawMoneyFlow;
				} else if (typPrice < lastTypPrice) {
					rawMoneyFlow *= -1;
					cumNegMF -= rawMoneyFlow;
				} else {
					rawMoneyFlow = 0;
				}
				if (i > sd.days) {
					var old = quotes[i - sd.days][rawMFLbl];
					if (old > 0) cumPosMF -= old;
					else cumNegMF += old;
					if (cumNegMF === 0) quotes[i][resultLbl] = 100;
					else if (quotes[i].Volume)
						quotes[i][resultLbl] = 100 - 100 / (1 + cumPosMF / cumNegMF);
				}
				quotes[i][rawMFLbl] = rawMoneyFlow;
				quotes[i][cumMFLbl] = [cumPosMF, cumNegMF];
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"M Flow": {
			name: "Money Flow Index",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculateMoneyFlowIndex,
			inputs: { Period: 14 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 80,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 20,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_movingAverages_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"movingAverages feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.prettify = CIQ.extend(
		{
			"2-exponential": "dema",
			"3-exponential": "tema",
			hull: "hma"
		},
		CIQ.Studies.prettify
	);

	CIQ.extend(CIQ.Studies.movingAverage, {
		conversions: {
			hma: "hull",
			dema: "2-exponential",
			tema: "3-exponential"
		},
		translations: {
			hull: "Hull",
			"2-exponential": "Double Exponential",
			"3-exponential": "Triple Exponential"
		},
		typeMap: {
			hma: "Hull",
			hull: "Hull",
			dema: "DoubleExponential",
			"2-exponential": "DoubleExponential",
			tema: "TripleExponential",
			"3-exponential": "TripleExponential"
		}
	});

	CIQ.Studies.calculateMovingAverageHull = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("wma", sd.days, field, 0, "_WMA1", stx, sd);
		CIQ.Studies.MA("wma", Math.ceil(sd.days / 2), field, 0, "_WMA2", stx, sd);

		var i, val;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (val || val === 0) break;
		}
		for (i++; i < quotes.length; i++) {
			var quote = quotes[i];
			quote["_MMA " + sd.name] =
				2 * quote["_WMA2 " + sd.name] - quote["_WMA1 " + sd.name];
		}

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;

		var hmaDays = Math.floor(Math.sqrt(sd.days));
		CIQ.Studies.MA("wma", hmaDays, "_MMA " + sd.name, offset, "_HMA", stx, sd);

		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		for (
			i = Math.max(sd.days + hmaDays - 1, sd.startFrom);
			i < quotes.length;
			i++
		) {
			quotes[i][name] = quotes[i]["_HMA " + sd.name];
		}
	};

	CIQ.Studies.calculateMovingAverageDoubleExponential = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("ema", sd.days, field, 0, "_EMA1", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA1 " + sd.name, 0, "_EMA2", stx, sd);

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;
		var i, val;
		var offsetBack = offset;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (!val && val !== 0) continue;
			if (offsetBack > 0) {
				offsetBack--;
				continue;
			}
			break;
		}
		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		var futureTicks = [];
		for (i++; i < quotes.length; i++) {
			if (i < 2 * (sd.days - 1)) continue;
			var quote = quotes[i];
			var result = 2 * quote["_EMA1 " + sd.name] - quote["_EMA2 " + sd.name];
			if (i + offset >= 0) {
				if (i + offset < quotes.length) quotes[i + offset][name] = result;
				else {
					var ft = {};
					ft[name] = result;
					futureTicks.push(ft);
				}
			}
		}
		sd.appendFutureTicks(stx, futureTicks);
	};

	CIQ.Studies.calculateMovingAverageTripleExponential = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("ema", sd.days, field, 0, "_EMA1", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA1 " + sd.name, 0, "_EMA2", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA2 " + sd.name, 0, "_EMA3", stx, sd);

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;
		var i, val;
		var offsetBack = offset;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (!val && val !== 0) continue;
			if (offsetBack > 0) {
				offsetBack--;
				continue;
			}
			break;
		}
		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		var futureTicks = [];
		for (i++; i < quotes.length; i++) {
			if (i < 3 * (sd.days - 1)) continue;
			var quote = quotes[i];
			var result =
				3 * quote["_EMA1 " + sd.name] -
				3 * quote["_EMA2 " + sd.name] +
				quote["_EMA3 " + sd.name];
			if (i + offset >= 0) {
				if (i + offset < quotes.length) quotes[i + offset][name] = result;
				else {
					var ft = {};
					ft[name] = result;
					futureTicks.push(ft);
				}
			}
		}
		sd.appendFutureTicks(stx, futureTicks);
	};

	CIQ.Studies.calculateMAEnvelope = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			field,
			0,
			"MA",
			stx,
			sd
		);
		var shiftType = sd.inputs["Shift Type"];
		var shift = sd.inputs.Shift;
		if (!shiftType) {
			//legacy
			shiftType = "percent";
			shift = sd.inputs["Shift Percentage"];
		}
		if (shiftType == "percent") {
			CIQ.Studies.calculateGenericEnvelope(
				stx,
				sd,
				shift / 100,
				"MA " + sd.name
			);
		} else if (shiftType == "points") {
			CIQ.Studies.calculateGenericEnvelope(
				stx,
				sd,
				null,
				"MA " + sd.name,
				null,
				Number(shift)
			);
		}
	};

	CIQ.Studies.calculateMADev = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var pts = sd.inputs["Points Or Percent"];
		if (!pts) pts = "Points";
		var maType = sd.inputs["Moving Average Type"];
		if (!maType) maType = "exponential";
		CIQ.Studies.MA(maType, sd.days, field, 0, "_MA", stx, sd);
		var histogram = sd.name + "_hist";
		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var quote = quotes[i];
			var val = quote[field];
			if (val && typeof val == "object") val = val[sd.subField];
			var qMA = quote["_MA " + sd.name];
			if (qMA || qMA === 0) {
				if (pts == "Points") quote[histogram] = val - qMA;
				else quote[histogram] = 100 * (val / qMA - 1);
			}
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist"] = "";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"MA Env": {
			name: "Moving Average Envelope",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: CIQ.Studies.calculateMAEnvelope,
			inputs: {
				Period: 50,
				Field: "field",
				"Shift Type": ["percent", "points"],
				Shift: 5,
				"Moving Average Type": "ma",
				"Channel Fill": true
			},
			outputs: {
				"MA Env Top": "auto",
				"MA Env Median": "auto",
				"MA Env Bottom": "auto"
			},
			attributes: {
				Shift: { min: 0.1, step: 0.1 }
			}
		},
		"MA Dev": {
			name: "Moving Average Deviation",
			calculateFN: CIQ.Studies.calculateMADev,
			seriesFN: CIQ.Studies.displayHistogramWithSeries,
			inputs: {
				Period: 12,
				Field: "field",
				"Moving Average Type": "ma",
				"Points Or Percent": ["Points", "Percent"]
			},
			outputs: { "Increasing Bar": "#00DD00", "Decreasing Bar": "#FF0000" }
		},
		"High Low": {
			name: "High Low Bands",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: function (stx, sd) {
				sd.inputs["Moving Average Type"] = "triangular";
				CIQ.Studies.calculateMAEnvelope(stx, sd);
			},
			inputs: {
				Period: 10,
				Field: "field",
				"Shift Percentage": 5,
				"Channel Fill": true
			},
			outputs: {
				"High Low Top": "auto",
				"High Low Median": "auto",
				"High Low Bottom": "auto"
			},
			attributes: {
				"Shift Percentage": { min: 0.1, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_parabolicSAR_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"parabolicSAR feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePSAR = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var af = 0;
		var ep = null;
		var lasttrend = false;
		var SAR = 0;
		var step = parseFloat(sd.inputs["Minimum AF"]);
		var maxStep = parseFloat(sd.inputs["Maximum AF"]);

		function doReset() {
			af = 0;
			ep = null;
			lasttrend = !lasttrend;
		}
		if (sd.startFrom > 0) {
			SAR = quotes[sd.startFrom - 1]["Result " + sd.name];
			var state = quotes[sd.startFrom - 1]["_state " + sd.name];
			if (state && state.length == 3) {
				af = state[0];
				ep = state[1];
				lasttrend = state[2];
			}
		}
		for (var i = sd.startFrom - 1; i < quotes.length - 1; i++) {
			if (i < 0) continue;
			if (quotes[i].futureTick) break;
			var priorSAR = SAR;
			if (lasttrend) {
				if (!ep || ep < quotes[i].High) {
					ep = quotes[i].High;
					af = Math.min(af + step, maxStep);
				}
				SAR = priorSAR + af * (ep - priorSAR);
				var lowestPrior2Lows = Math.min(
					quotes[Math.max(1, i) - 1].Low,
					quotes[i].Low
				);
				if (SAR > quotes[i + 1].Low) {
					SAR = ep;
					doReset();
				} else if (SAR > lowestPrior2Lows) {
					SAR = lowestPrior2Lows;
				}
			} else {
				if (!ep || ep > quotes[i].Low) {
					ep = quotes[i].Low;
					af = Math.min(af + step, maxStep);
				}
				SAR = priorSAR + af * (ep - priorSAR);
				var highestPrior2Highs = Math.max(
					quotes[Math.max(1, i) - 1].High,
					quotes[i].High
				);
				if (SAR < quotes[i + 1].High) {
					SAR = ep;
					doReset();
				} else if (SAR < highestPrior2Highs) {
					SAR = highestPrior2Highs;
				}
			}
			quotes[i + 1]["_state " + sd.name] = [af, ep, lasttrend];
			if (!isNaN(quotes[i].High) || !isNaN(quotes[i].Low)) {
				quotes[i + 1]["Result " + sd.name] = SAR;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		PSAR: {
			name: "Parabolic SAR",
			overlay: true,
			calculateFN: CIQ.Studies.calculatePSAR,
			seriesFN: CIQ.Studies.displayPSAR2,
			inputs: { "Minimum AF": 0.02, "Maximum AF": 0.2 }
		}
	});
}

};

let __js_advanced_studies_pivotPoints_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"pivotPoints feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePivotPoints = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var period = "day";
		if (stx.layout.interval == "day") period = "month";
		else if (CIQ.ChartEngine.isDailyInterval(stx.layout.interval))
			period = "year";
		else if (
			stx.layout.interval == "second" ||
			stx.layout.interval == "millisecond" ||
			stx.layout.timeUnit == "second" ||
			stx.layout.timeUnit == "millisecond"
		)
			period = "15min";
		else {
			var interval = stx.layout.periodicity;
			if (stx.layout.interval != "minute") {
				interval *= stx.layout.interval;
			}
			if (interval >= 30) period = "week";
		}

		var marketOffset = null;

		var pointers = {
			pivotPoint: NaN,
			high: 0,
			low: 0,
			prevHigh: 0,
			prevLow: 0,
			hlSpread: 0
		};
		if (sd.startFrom > 1 && quotes[sd.startFrom - 1]["_pointers " + sd.name]) {
			pointers = CIQ.clone(quotes[sd.startFrom - 1]["_pointers " + sd.name]);
		}
		function resetPivots() {
			pointers.pivotPoint =
				(pointers.high + pointers.low + quotes[i - 1].Close) / 3;
			pointers.prevHigh = pointers.high;
			pointers.prevLow = pointers.low;
			pointers.hlSpread = pointers.high - pointers.low;
			pointers.high = pointers.low = 0;
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			if (!quotes[i - 1]) continue;
			pointers.high = Math.max(pointers.high, quotes[i - 1].High);
			pointers.low = Math.min(
				pointers.low > 0 ? pointers.low : quotes[i - 1].Low,
				quotes[i - 1].Low
			);
			if (sd.inputs.Continuous) resetPivots();
			else if (
				period == "year" &&
				quotes[i].DT.getYear() != quotes[i - 1].DT.getYear()
			) {
				//new yearly period
				resetPivots();
			} else if (
				period == "month" &&
				quotes[i].DT.getMonth() != quotes[i - 1].DT.getMonth()
			) {
				//new monthly period
				resetPivots();
			} else if (
				period == "week" &&
				quotes[i].DT.getDay() < quotes[i - 1].DT.getDay()
			) {
				//new weekly period
				resetPivots();
			} else if (period == "day") {
				if (marketOffset === null) {
					//possible new daily period
					marketOffset = CIQ.Studies.getMarketOffset({
						stx,
						localQuoteDate: quotes[i].DT,
						shiftToDateBoundary: true
					});
				}
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
					oldDate.getDate() !== newDate.getDate() &&
					oldDate.getDay() !== 0 &&
					stx.chart.market.isMarketDate(newDate)
				) {
					//new daily period
					marketOffset = null;
					resetPivots();
				}
			} else if (
				period == "15min" &&
				(quotes[i].DT.getHours() != quotes[i - 1].DT.getHours() ||
					Math.floor(quotes[i].DT.getMinutes() / 15) !=
						Math.floor(quotes[i - 1].DT.getMinutes() / 15))
			) {
				//new 15 minute period
				resetPivots();
			}
			quotes[i]["Pivot " + sd.name] = pointers.pivotPoint;
			if (sd.inputs.Type.toLowerCase() == "fibonacci") {
				quotes[i]["Resistance 1 " + sd.name] =
					pointers.pivotPoint + 0.382 * pointers.hlSpread;
				quotes[i]["Resistance 2 " + sd.name] =
					pointers.pivotPoint + 0.618 * pointers.hlSpread;
				quotes[i]["Resistance 3 " + sd.name] =
					pointers.pivotPoint + pointers.hlSpread;
				quotes[i]["Support 1 " + sd.name] =
					pointers.pivotPoint - 0.382 * pointers.hlSpread;
				quotes[i]["Support 2 " + sd.name] =
					pointers.pivotPoint - 0.618 * pointers.hlSpread;
				quotes[i]["Support 3 " + sd.name] =
					pointers.pivotPoint - pointers.hlSpread;
			} else {
				quotes[i]["Resistance 1 " + sd.name] =
					2 * pointers.pivotPoint - pointers.prevLow;
				quotes[i]["Resistance 2 " + sd.name] =
					pointers.pivotPoint + pointers.hlSpread;
				quotes[i]["Resistance 3 " + sd.name] =
					pointers.prevHigh + 2 * (pointers.pivotPoint - pointers.prevLow);
				quotes[i]["Support 1 " + sd.name] =
					2 * pointers.pivotPoint - pointers.prevHigh;
				quotes[i]["Support 2 " + sd.name] =
					pointers.pivotPoint - pointers.hlSpread;
				quotes[i]["Support 3 " + sd.name] =
					pointers.prevLow - 2 * (pointers.prevHigh - pointers.pivotPoint);
			}
			quotes[i]["_pointers " + sd.name] = CIQ.clone(pointers);
		}
	};

	CIQ.Studies.displayPivotPoints = function (stx, sd, quotes) {
		sd.noSlopes = !sd.inputs.Continuous;
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		if (sd.inputs.Shading) {
			var panel = stx.panels[sd.panel];
			var params = {
				noSlopes: sd.noSlopes,
				opacity: sd.parameters.opacity ? sd.parameters.opacity : 0.2,
				skipTransform: panel.name != sd.chart.name,
				yAxis: sd.getYAxis(stx)
			};
			if (!sd.highlight && stx.highlightedDraggable) params.opacity *= 0.3;
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Resistance 3 " + sd.name,
						bottomBand: "Resistance 2 " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Resistance 3"])
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Resistance 2 " + sd.name,
						bottomBand: "Resistance 1 " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Resistance 2"])
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Resistance 1 " + sd.name,
						bottomBand: "Pivot " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Resistance 1"])
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Support 1 " + sd.name,
						bottomBand: "Pivot " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Support 1"])
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Support 2 " + sd.name,
						bottomBand: "Support 1 " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Support 2"])
					},
					params
				)
			);
			CIQ.prepareChannelFill(
				stx,
				CIQ.extend(
					{
						panelName: sd.panel,
						topBand: "Support 3 " + sd.name,
						bottomBand: "Support 2 " + sd.name,
						color: CIQ.Studies.determineColor(sd.outputs["Support 3"])
					},
					params
				)
			);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Pivot Points": {
			name: "Pivot Points",
			overlay: true,
			seriesFN: CIQ.Studies.displayPivotPoints,
			calculateFN: CIQ.Studies.calculatePivotPoints,
			inputs: {
				Type: ["standard", "fibonacci"],
				Continuous: false,
				Shading: false
			},
			outputs: {
				Pivot: "auto",
				"Resistance 1": "#b82c0b",
				"Support 1": "#699158",
				"Resistance 2": "#e36460",
				"Support 2": "#b3d987",
				"Resistance 3": "#ffd0cf",
				"Support 3": "#d3e8ae"
			},
			parameters: {
				init: { opacity: 0.2 }
			}
		}
	});
}

};

let __js_advanced_studies_prettyGoodOscillator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"prettyGoodOscillator feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePrettyGoodOscillator = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("exponential", sd.days, "trueRange", 0, "_EMA", stx, sd);
		CIQ.Studies.MA("simple", sd.days, "Close", 0, "_SMA", stx, sd);

		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			if (!quotes[i]["_SMA " + sd.name] || !quotes[i]["_EMA " + sd.name])
				continue;
			quotes[i]["Result " + sd.name] =
				(quotes[i].Close - quotes[i]["_SMA " + sd.name]) /
				quotes[i]["_EMA " + sd.name];
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Pretty Good": {
			name: "Pretty Good Oscillator",
			calculateFN: CIQ.Studies.calculatePrettyGoodOscillator,
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 3,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -3,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_priceMomentumOscillator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"priceMomentumOscillator feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePMO = function (stx, sd) {
		var periods = {
			Smooth: Number(sd.inputs["Smoothing Period"]) - 1,
			Double: Number(sd.inputs["Double Smoothing Period"]) - 1,
			Signal: Number(sd.inputs["Signal Period"])
		};
		var quotes = sd.chart.scrubbed;
		if (quotes.length < periods.Smooth + periods.Double) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var i;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			if (!quotes[i - 1]) continue;
			var denom = quotes[i - 1][field];
			if (denom) {
				quotes[i]["_ROCx10 " + sd.name] = 1000 * (quotes[i][field] / denom - 1);
			}
		}
		CIQ.Studies.MA(
			"exponential",
			periods.Smooth,
			"_ROCx10 " + sd.name,
			0,
			"_EMAx10",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			periods.Double,
			"_EMAx10 " + sd.name,
			0,
			"PMO",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			periods.Signal,
			"PMO " + sd.name,
			0,
			"PMOSignal",
			stx,
			sd
		);
		sd.zoneOutput = "PMO";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		PMO: {
			name: "Price Momentum Oscillator",
			calculateFN: CIQ.Studies.calculatePMO,
			inputs: {
				Field: "field",
				"Smoothing Period": 35,
				"Double Smoothing Period": 20,
				"Signal Period": 10
			},
			outputs: { PMO: "auto", PMOSignal: "#FF0000" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 2.5,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -2.5,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				studyOverBoughtValue: { min: 0, step: "0.05" },
				studyOverSoldValue: { max: 0, step: "0.05" }
			}
		}
	});
}

};

let __js_advanced_studies_priceVolumeOscillator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"priceVolumeOscillator feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePriceOscillator = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var short = Number(sd.inputs["Short Cycle"]);
		var long = Number(sd.inputs["Long Cycle"]);
		if (quotes.length < Math.max(short, long) + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		var maType = sd.inputs["Moving Average Type"];
		if (!maType) maType = "simple";
		if (!field || field == "field") field = "Close";
		if (sd.parameters.isVolume) {
			field = "Volume";
			maType = "exponential";
		}
		var pts = sd.inputs["Points Or Percent"];
		if (!pts) pts = "Percent";

		CIQ.Studies.MA(maType, short, field, 0, "_Short MA", stx, sd);
		CIQ.Studies.MA(maType, long, field, 0, "_Long MA", stx, sd);

		for (var i = Math.max(long, sd.startFrom); i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			var qShMA = quote["_Short MA " + sd.name],
				qLgMA = quote["_Long MA " + sd.name];
			if ((qShMA || qShMA === 0) && (qLgMA || qLgMA === 0)) {
				if (pts == "Points") quote["Result " + sd.name] = qShMA - qLgMA;
				else quote["Result " + sd.name] = 100 * (qShMA / qLgMA - 1);
				if (sd.outputs["Increasing Bar"]) {
					quote[sd.name + "_hist"] = quote["Result " + sd.name];
					sd.outputMap = {};
					sd.outputMap[sd.name + "_hist"] = "";
				}
			}
		}
	};

	CIQ.Studies.displayRAVI = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);

		var y = stx.pixelFromPrice(0, panel, yAxis);

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;

		var upColor = CIQ.Studies.determineColor(sd.outputs["Increasing Bar"]);
		var downColor = CIQ.Studies.determineColor(sd.outputs["Decreasing Bar"]);
		stx.startClip(sd.panel);
		stx.canvasColor("stx_histogram");
		if (!sd.underlay) context.globalAlpha = 1;
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i],
				quote_1 = quotes[i - 1];
			if (!quote_1)
				quote_1 = stx.getPreviousBar(stx.chart, sd.name + "_hist", i);
			if (!quote) continue;
			var overBought = 0,
				overSold = 0;
			if (sd.parameters && sd.parameters.studyOverZonesEnabled) {
				overBought = parseFloat(sd.parameters.studyOverBoughtValue);
				overSold = parseFloat(sd.parameters.studyOverSoldValue);
			}
			if (!quote_1) context.fillStyle = "#CCCCCC";
			else if (
				quote[sd.name + "_hist"] > overBought &&
				quote_1[sd.name + "_hist"] < quote[sd.name + "_hist"]
			)
				context.fillStyle = upColor;
			else if (
				quote[sd.name + "_hist"] < overSold &&
				quote_1[sd.name + "_hist"] > quote[sd.name + "_hist"]
			)
				context.fillStyle = downColor;
			else context.fillStyle = "#CCCCCC";
			if (quote.candleWidth)
				myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
			context.fillRect(
				Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2),
				Math.floor(y),
				Math.floor(myWidth),
				Math.floor(
					stx.pixelFromPrice(quote[sd.name + "_hist"], panel, yAxis) - y
				)
			);
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Price Osc": {
			name: "Price Oscillator",
			calculateFN: CIQ.Studies.calculatePriceOscillator,
			inputs: {
				Field: "field",
				"Short Cycle": 12,
				"Long Cycle": 26,
				"Moving Average Type": "ema",
				"Points Or Percent": ["Points", "Percent"]
			}
		},
		"Vol Osc": {
			name: "Volume Oscillator",
			calculateFN: CIQ.Studies.calculatePriceOscillator,
			inputs: {
				"Short Cycle": 12,
				"Long Cycle": 26,
				"Points Or Percent": ["Points", "Percent"]
			},
			parameters: {
				init: { isVolume: true }
			}
		},
		RAVI: {
			name: "RAVI",
			seriesFN: CIQ.Studies.displayRAVI,
			calculateFN: CIQ.Studies.calculatePriceOscillator,
			inputs: {
				Field: "field",
				"Moving Average Type": "vdma",
				"Short Cycle": 7,
				"Long Cycle": 65
			},
			outputs: { "Increasing Bar": "#00DD00", "Decreasing Bar": "#FF0000" },
			centerline: 0,
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 3,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -3,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				studyOverBoughtValue: { min: 0, step: "0.1" },
				studyOverSoldValue: { max: 0, step: "0.1" }
			}
		}
	});
}

};

let __js_advanced_studies_primeNumber_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"primeNumber feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePrimeNumber = function (stx, sd) {
		var primes = [];
		function isPrime(x) {
			if (x <= 0) return false;
			else if (x != Math.floor(x)) return false;
			//assume x is an int
			else if (primes[x] === true || primes[x] === false) return primes[x];
			var q = parseInt(Math.sqrt(x), 10);
			for (var i = 2; i <= q; i++) {
				if (x % i === 0) {
					primes[x] = false;
					return false;
				}
			}
			primes[x] = true;
			return true;
		}
		var quotes = sd.chart.scrubbed;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;

			var high = quote.High;
			if (!isNaN(high)) {
				for (var h = 0; high > 0 && high <= 10; h++) high *= 10;
				if (isPrime(high)) high += 2;
				high = Math.ceil(high);
				if (high % 2 === 0) high++;
				while (!isPrime(high)) high += 2;
				high /= Math.pow(10, h);
			}

			var low = quote.Low;
			if (!isNaN(low)) {
				for (var l = 0; low > 0 && low <= 10; l++) low *= 10;
				if (isPrime(low)) low -= 2;
				low = Math.floor(low);
				if (low % 2 === 0) low--;
				if (low > 0) {
					while (!isPrime(low)) low -= 2;
					low /= Math.pow(10, l);
				}
			}

			if (sd.type == "Prime Number Bands") {
				if (!isNaN(high)) quote["Prime Bands Top " + sd.name] = high;
				if (!isNaN(low))
					quote["Prime Bands Bottom " + sd.name] = Math.max(0, low);
			} else {
				var value = 0;
				var tolerance =
					(sd.inputs["Tolerance Percentage"] * (high - low)) / 100;
				var skew = high + low - 2 * quote.Close;
				if (skew < tolerance) value = 1;
				else if (skew > tolerance) value = -1;
				if (value) quote["Result " + sd.name] = value;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Prime Number": {
			name: "Prime Number Oscillator",
			range: "-1 to 1",
			calculateFN: CIQ.Studies.calculatePrimeNumber,
			centerline: 0,
			inputs: { "Tolerance Percentage": 5 },
			attributes: {
				"Tolerance Percentage": { min: 0.1, step: 0.1 }
			}
		},
		"Prime Number Bands": {
			name: "Prime Number Bands",
			overlay: true,
			calculateFN: CIQ.Studies.calculatePrimeNumber,
			seriesFN: CIQ.Studies.displayChannel,
			inputs: { "Channel Fill": true },
			outputs: {
				"Prime Bands Top": "auto",
				"Prime Bands Bottom": "auto",
				"Prime Bands Channel": "auto"
			}
		}
	});
}

};

let __js_advanced_studies_pring_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("pring feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateKST = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var roc = {},
			smp = {};
		roc[1] = Number(sd.inputs["Lightest Rate of Change Period"]);
		roc[2] = Number(sd.inputs["Light Rate of Change Period"]);
		roc[3] = Number(sd.inputs["Heavy Rate of Change Period"]);
		roc[4] = Number(sd.inputs["Heaviest Rate of Change Period"]);
		smp[1] = Number(sd.inputs["Lightest SMA Period"]);
		smp[2] = Number(sd.inputs["Light SMA Period"]);
		smp[3] = Number(sd.inputs["Heavy SMA Period"]);
		smp[4] = Number(sd.inputs["Heaviest SMA Period"]);
		var sp = Number(sd.inputs["Signal Period"]);
		var i, j;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			for (j = 1; j <= 4; j++) {
				if (i >= roc[j] && quotes[i - roc[j]] && quotes[i - roc[j]][field])
					quotes[i]["_ROC" + j + " " + sd.name] =
						100 * (quotes[i][field] / quotes[i - roc[j]][field] - 1);
			}
		}
		for (j = 1; j <= 4; j++) {
			CIQ.Studies.MA(
				"simple",
				smp[j],
				"_ROC" + j + " " + sd.name,
				0,
				"_SMA" + j,
				stx,
				sd
			);
		}
		for (i = sd.startFrom; i < quotes.length; i++) {
			quotes[i]["KST " + sd.name] = null;
			for (j = 1; j <= 4; j++) {
				var val = quotes[i]["_SMA" + j + " " + sd.name];
				if (val || val === 0) quotes[i]["KST " + sd.name] += j * val;
			}
		}
		CIQ.Studies.MA("simple", sp, "KST " + sd.name, 0, "KSTSignal", stx, sd);
	};

	CIQ.Studies.calculateSpecialK = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var span = sd.inputs.Interval;
		if (!span) span = "daily";
		var roc = {
			daily: [10, 15, 20, 30, 50, 65, 75, 100, 195, 265, 390, 530],
			weekly: [4, 5, 6, 8, 10, 13, 15, 20, 39, 52, 78, 104]
		};
		var map = {
			daily: [10, 10, 10, 15, 50, 65, 75, 100, 130, 130, 130, 195],
			weekly: [4, 5, 6, 8, 10, 13, 15, 20, 26, 26, 26, 39]
		};
		var i, j;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			for (j = 0; j < roc[span].length; j++) {
				if (
					i >= roc[span][j] &&
					quotes[i - roc[span][j]] &&
					quotes[i - roc[span][j]][field]
				)
					quotes[i]["_ROC" + j + " " + sd.name] =
						100 * (quotes[i][field] / quotes[i - roc[span][j]][field] - 1);
			}
		}
		for (j = 0; j < map[span].length; j++) {
			CIQ.Studies.MA(
				span == "daily" ? "simple" : "exponential",
				map[span][j],
				"_ROC" + j + " " + sd.name,
				0,
				"_MA" + j,
				stx,
				sd
			);
		}
		for (i = sd.startFrom; i < quotes.length; i++) {
			quotes[i]["Result " + sd.name] = null;
			for (j = 0; j < map[span].length; j++) {
				var val = quotes[i]["_MA" + j + " " + sd.name];
				if (val || val === 0)
					quotes[i]["Result " + sd.name] += ((j % 4) + 1) * val;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Pring KST": {
			name: "Pring's Know Sure Thing",
			calculateFN: CIQ.Studies.calculateKST,
			inputs: {
				Field: "field",
				"Lightest Rate of Change Period": 10,
				"Lightest SMA Period": 10,
				"Light Rate of Change Period": 15,
				"Light SMA Period": 10,
				"Heavy Rate of Change Period": 20,
				"Heavy SMA Period": 10,
				"Heaviest Rate of Change Period": 30,
				"Heaviest SMA Period": 15,
				"Signal Period": 9
			},
			outputs: { KST: "#00DD00", KSTSignal: "#FF0000" }
		},
		"Pring Sp-K": {
			name: "Pring's Special K",
			calculateFN: CIQ.Studies.calculateSpecialK,
			inputs: { Field: "field", Interval: ["daily", "weekly"] }
		}
	});
}

};

let __js_advanced_studies_projectedVolume_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
var timezoneJS =
	typeof _timezoneJS !== "undefined" ? _timezoneJS : _exports.timezoneJS;

if (!CIQ.Studies) {
	console.error(
		"projectedVolume feature requires first activating studies feature."
	);
} else {
	/**
	 * Initializes the project volume studies PVAT and PAV.
	 *
	 * Specifically, sets the anchor time to the default anchor time if it's left blank.
	 *
	 * @param {CIQ.ChartEngine} stx	The chart object.
	 * @param {string} type Study type.
	 * @param {object} inputs Study inputs.
	 * @param {object} outputs Study outputs.
	 * @param {object} parameters Study parameters.
	 * @param {string} panel ID of the study's panel element.
	 * @return {studyDescriptor} Study descriptor object.
	 *
	 * @memberof CIQ.Studies
	 * @private
	 * @since 8.1.0
	 */
	CIQ.Studies.initProjectedVolume = function (
		stx,
		type,
		inputs,
		outputs,
		parameters,
		panel
	) {
		const { market } = stx.chart;
		let anchorTime = "00:00";
		if (market) anchorTime = market.getNormalOpen();
		if (anchorTime.match(/^[\d]{2}:[\d]{2}$/)) anchorTime += ":00";

		if (!inputs["Anchor Time"] || !inputs["Anchor Time"].length) {
			inputs["Anchor Time"] = anchorTime;
		}

		const sd = CIQ.Studies.initializeFN(
			stx,
			type,
			inputs,
			outputs,
			parameters,
			panel
		);

		// market will not be fully loaded yet if currentlyImporting
		if (!stx.currentlyImporting) sd.defaultAnchorTime = anchorTime;
		return sd;
	};

	/**
	 * Determines whether a projected volume lookback is valid for the currently selected
	 * periodicity.
	 *
	 * Called by {@link CIQ.Studies.calculateProjectedVolume}.
	 *
	 * Due to the data requirements of the Projected Volume at Time (PVAT) and Projected
	 * Aggregate Volume (PVA) studies, it is necessary to limit the maximum lookback.
	 *
	 * Setting the lookback too high results in the chart attempting to load more data than is
	 * allowed by {@link CIQ.ChartEngine#maxDataSetSize}, which breaks the study. If you have set
	 * `maxDataSetSize` higher than the default, you may wish to replace this validation function
	 * with one that allows a greater lookback.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart object.
	 * @param {CIQ.Studies.StudyDescriptor} sd Specifies the study (PVAT or PAV) for which the lookback is
	 * 		validated.
	 * @return {boolean} True if the the lookback is valid; otherwise, false.
	 *
	 * @memberOf CIQ.Studies
	 * @since 8.0.0
	 */
	CIQ.Studies.validateProjectedVolumeLookback = function (stx, sd) {
		const { interval, periodicity } = stx.layout;
		const { "Lookback Days": lookback } = sd.inputs;
		return lookback / (interval * periodicity) <= 10;
	};

	/**
	 * Calculates the projections and aggregations for the Projected Volume at Time (PVAT) and
	 * Projected Aggregate Volume (PAV) studies. Due to the data requirements of the studies,
	 * this function may attempt to use the quote feed to fetch additional historical data. If no
	 * quote feed is available and not enough data has been loaded, the study displays an error.
	 *
	 * The studies support intraday periodicities of 1 minute and higher. Aggregations other than
	 * Heiken-Ashi are not supported.
	 *
	 * Only days when the market is open are included in the volume average. If the lookback
	 * includes days with restricted market hours, the non-open periods are ignored, producing an
	 * average with fewer data points.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart object.
	 * @param {CIQ.Studies.StudyDescriptor} sd Specifies the study (PVAT or PAV) for which the projected
	 * 		volume is calculated.
	 *
	 * @memberOf CIQ.Studies
	 * @since 8.0.0
	 */
	CIQ.Studies.calculateProjectedVolume = function (stx, sd) {
		const { interval, timeUnit, aggregationType } = stx.layout;
		const { symbol, scroll, scrubbed: quotes, market } = stx.chart;
		const aggregateVolume = sd.type === "PAV";
		const studyName = sd.study ? sd.study.name : sd.type;

		if (CIQ.ChartEngine.isDailyInterval(interval)) {
			sd.error = `${studyName} is Intraday Only`;
		} else if (timeUnit === "tick") {
			sd.error = `Tick mode not supported for ${studyName}`;
		} else if (timeUnit !== "minute") {
			sd.error = `Sub-minute periodicities not supported for ${studyName}`;
		} else if (
			!aggregationType ||
			!["ohlc", "heikinashi"].includes(aggregationType)
		) {
			sd.error = `Aggregation type not supported for ${studyName}`;
		} else if (!CIQ.Studies.validateProjectedVolumeLookback(stx, sd)) {
			sd.error = `Selected lookback/periodicity combo not supported for ${studyName}`;
		}

		if (sd.error) return;

		if (sd.inputs["Anchor Selector"]) CIQ.Studies.initAnchorHandle(stx, sd);
		else CIQ.Studies.removeAnchorHandle(stx, sd);

		let defaultAnchor = market ? market.getNormalOpen() : "00:00";
		if (defaultAnchor.match(/^[\d]{2}:[\d]{2}$/)) defaultAnchor += ":00";
		if (!stx.currentlyImporting && defaultAnchor !== sd.defaultAnchorTime) {
			sd.defaultAnchorTime = defaultAnchor;
			sd.inputs["Anchor Time"] = defaultAnchor;
			CIQ.Studies.repositionAnchor(stx, sd);
			return;
		}

		const { "Lookback Days": lookback, "Anchor Time": anchorTime } = sd.inputs;
		const [anchorHour, anchorMinute, anchorSecond = 0] = anchorTime.split(":");
		const isForex = CIQ.Market.Symbology.isForexSymbol(symbol);

		// Make sure to calculate far enough back for dependent studies with a period, eg moving average
		const dependents = sd.getDependents(stx);
		let additionalBarsRequired = 0;
		let dependentsOutputMap = [];

		dependents.forEach(({ inputs, outputMap }) => {
			if (inputs.Period) {
				additionalBarsRequired = Math.max(
					parseInt(inputs.Period),
					additionalBarsRequired
				);

				dependentsOutputMap.push(...Object.keys(outputMap));
			}
		});

		sd.dependentsOutputMap = dependentsOutputMap;

		// Projection will frequently need more data than would normally be loaded into dataset. For this
		// reason we start at the beginning of dataSegment. We calculate
		// the projection based on the ticks forward of the left-hand edge of the chart
		let beginProjectionFrom;
		const todaysOpen = openingTick(quotes.length - 1, true); // starting at beginning of day simplifies logic
		const lhsTick = Math.ceil(quotes.length - 1 - scroll); // analogous to dataSegment[0]
		let earliestTick = openingTick(lhsTick - additionalBarsRequired);
		if (
			isForex &&
			quotes[earliestTick] &&
			CIQ.dateToStr(quotes[earliestTick].DT, "HH:mm") !== defaultAnchor
		) {
			earliestTick = openingTick(earliestTick - 1); // necessary due to midnight-bisected market session
		}

		if (
			!isForex && // forex aggregations start at 5pm ET on the previous day so this optimization doesn't work
			sd.startFrom > earliestTick &&
			quotes[earliestTick] &&
			quotes[earliestTick]["V " + sd.name] !== undefined &&
			dependentsOutputMap.every(
				(key) => ![undefined, null].includes(quotes[earliestTick][key])
			) &&
			todaysOpen !== false
		) {
			beginProjectionFrom = todaysOpen; // aggregation performance
		} else {
			beginProjectionFrom = earliestTick;
		}

		// Projection starting point to provide entire projection based on the screen width
		const oldestRequired = wind(dateFromTick(earliestTick), lookback);
		oldestRequired.setHours(0, 0, 0); // in case of dissimilar start times make sure full day is covered
		// Oldest opening market time CURRENTLY available in the dataSet
		const oldestOpen = openingTick(0, true);
		// Earliest possible start date for the projection to work
		const oldestPossible =
			(oldestOpen || oldestOpen === 0) && // ensured to be either a tick or false
			tickFromDate(wind(quotes[oldestOpen].DT, lookback, true));

		if (quotes[0].DT > oldestRequired) {
			if (stx.quoteDriver) {
				stx.quoteDriver.extendHistoricalData({ from: oldestRequired });
				if (oldestPossible > 0) beginProjectionFrom = oldestPossible;
				else return;
			} else {
				return (sd.error = `Not enough data to calculate ${studyName}`);
			}
		}

		if (beginProjectionFrom < 0 || beginProjectionFrom > quotes.length - 1)
			return;

		const appendingOnly =
			quotes.length - sd.startFrom === 1 &&
			sd.cachedFutureTicks &&
			sd.cachedLastProjection &&
			+sd.cachedLastProjection.DT === +quotes[quotes.length - 1].DT &&
			quotes[beginProjectionFrom]["PV " + sd.name];

		if (appendingOnly) {
			quotes[quotes.length - 1]["PV " + sd.name] =
				sd.cachedLastProjection.projectedValue;
			sd.appendFutureTicks(stx, sd.cachedFutureTicks);
			beginProjectionFrom = sd.startFrom;
		} else {
			sd.cachedFutureTicks = null;
			sd.cachedLastProjection = null;

			// Given a standard ohlc or heikin ashi chart, the quotes array will be organized into time slices
			// where trading occured, eg 9:30am-10:00am for a 30 minute periodicity. The objective of the following
			// algorithm is to generate a moving average for the volume of each time slice, that is each quote
			// should receive the calculated average volume of the last X number of days *for that time slice* where
			// X is the a lookback variable set by the user.

			// The core of the algorithm works by assigning pointers to the start of the current day AND the previous
			// "lookback" days and then simultaneously walking all pointers along the quotes array, calculating the
			// average for each time slice as we go. If we reach the end of the quotes array and there are still
			// remaining market hours we continue walking the "lookback" pointers appending future ticks as we go.
			// This process is repeated for each day, moving backwards along the quotes array until we've calculated
			// the projection for every day after the `beginProjectionFrom` index.

			// There is a big gotcha to this approach: not all trading days have the same hours. When that is the case
			// we do the best we can and use as many "lookback" time slices as we can. In some cases this means calculating
			// the average based off of fewer time slices. For example, if we are looking at the 8:00pm-8:30pm time
			// slice for a FOREX instrument, there will be no data from any Fridays in the lookback because FOREX
			// trading stops at 4pm on Friday. Saturday will be skipped entirely and not included in the lookback
			// because it is not a market day.

			// Note that the algorithm uses two pointer arrays: `startingIndices` and `workingIndices`. `startingIndices`
			// records the first tick of the day for each day in the lookback. `workingIndices` records the indices
			// as we walk through the time slices of the days. They are separate so that when we calculate the projection
			// for the previous day, we can simply shift `startingIndices` back a day and use the last index as the new
			// pointer for the day to fill.

			// We will immediately pop `todaysOpen` off `startingIndices`. We add it here to start to simplify the loop,
			// so that for each day we can pop the last index and the remaining indices will be the for the lookback days.
			let startingIndices = [todaysOpen];
			let futureTicks = [];

			// grab the start index of the previous lookback days
			for (let i = 0; i < lookback; i++) {
				// First item points to first quote of day. Use previous so `openingTick` will get the correct day.
				let previous = openingTick(startingIndices[0] - 1);
				startingIndices.unshift(previous); // store with "older" days first so we can pop the newest
			}

			// Whether on the first or subsequent iterations of this loop, we can expect `startingIndices` to contain
			// lookback + 1 elements, the last item being the day being projected (which becomes the fill index). Due to
			// zero indexing, `startingIndices[lookback]` will be the last item. The last iteration of the loop will be when
			// we're projecting the "oldest" day that begins after or on `beginProjectionFrom`.
			while (startingIndices[lookback] >= beginProjectionFrom) {
				let fillIndex = startingIndices.pop();
				if (!quotes[fillIndex]) return reportTickErrorAt(fillIndex);
				const fillStart = getHoursAndMinutes(quotes[fillIndex].DT);
				let { hours: fillHours, minutes: fillMinutes } = fillStart;
				let currentClose = market.getClose(quotes[fillIndex].DT);
				let fillClose;
				if (!currentClose) {
					// if no market definiton default to 24 hour chart
					fillClose = { hours: 24, minutes: 0 };
				} else {
					let nextClose = market.getNextClose(quotes[fillIndex].DT);
					fillClose = getHoursAndMinutes(currentClose);
					// For extended hours. Find last close of the day. Don't roll over into next day (if FOREX).
					while (
						!(fillClose.hours === 0 && fillClose.minutes === 0) &&
						currentClose.getDate() === nextClose.getDate()
					) {
						currentClose = nextClose;
						nextClose = market.getNextClose(nextClose);
					}
					fillClose = getHoursAndMinutes(currentClose);
					// FOREX support. Because FOREX days end at midnight, this will come back as 0 hours, 0 minutes, which
					// messes up the later/earlier than calculations
					if (fillClose.hours === 0) fillClose.hours = 24;
				}

				let workingIndices = startingIndices.slice();
				// ensure that none of the working index times start before the fill time
				for (let i = 0; i < workingIndices.length; i++) {
					let index = workingIndices[i];
					if (!quotes[index]) return reportTickErrorAt(index);
					let { hours, minutes } = getHoursAndMinutes(quotes[index].DT);

					// If the date pointed to by index is earlier than the fillStart, increment until they are the same time
					if (
						hours < fillHours ||
						(hours === fillHours && minutes < fillMinutes)
					) {
						do {
							index++;
							({ hours, minutes } = getHoursAndMinutes(quotes[index].DT));
						} while (!(hours === fillHours && minutes === fillMinutes));
					}
					workingIndices[i] = index;
				}

				// This loop runs once for each time slice for each day that needs a projection. On each iteration fillHours
				// and fillMinutes will be incremented. Either the loop ends when we hit the market close or the end of the
				// day or none of the lookback days contain anymore day we'll break out of the loop.
				while (
					fillHours < fillClose.hours ||
					(fillHours === fillClose.hours && fillMinutes < fillClose.minutes)
				) {
					// Because we may be appending future ticks we can't rely on checking the date of the fill quote to make
					// sure we haven't exceded the market hours. So for that reason we increment fillHours and fillMinutes
					// to the next time slice each iteration of the loop based off of time slices of the lookback days. But
					// we only need to do this once, so we set a flag here to avoid re-setting those values potentially
					// for *every single* lookback day.
					let timeIncremented = false;
					// Because we still need to make comparisons off of fillHours and fillMinutes, we store the new values
					// in nextHours and nextMinutes until we're finished looping through the lookbacks.
					let nextHours, nextMinutes;
					let total = 0;
					let historicalSlices = 0;

					// Loop calculates the average for the time slice under consideration. Because we expect some market days
					// may have longer hours than others, for each lookback time slice we check that incrementing the index
					// hasn't rolled the date over into the next day (which will happen after market close). If that happens,
					// we assign the index to null and ignore it for future time slices.
					for (let i = 0; i < workingIndices.length; i++) {
						let index = workingIndices[i];
						if (index === null) continue;
						let quote = quotes[index];
						if (!quote) return reportTickErrorAt(index);
						let { hours, minutes } = getHoursAndMinutes(quote.DT);
						let startDate = quote.DT.getDate(); // to check if index has rolled into next day

						if (hours === fillHours && minutes === fillMinutes) {
							total += quote.Volume;
							historicalSlices++; // if here time slice applies so make sure we caculate average correctly
							workingIndices[i]++; // go to next time slice
							if (quotes[workingIndices[i]].DT.getDate() !== startDate) {
								// if index has rolled over into the next day
								workingIndices[i] = null;
							} else if (!timeIncremented) {
								({
									hours: nextHours,
									minutes: nextMinutes
								} = getHoursAndMinutes(quotes[workingIndices[i]].DT)); // walk fill minutes and hours forward
								timeIncremented = true; // once set once we don't need to set again
							}
						}
					}

					fillHours = nextHours;
					fillMinutes = nextMinutes;

					if (historicalSlices === 0) break; // No more data available from lookback days, can't continue projection.
					let projection = total / historicalSlices;

					if (quotes[fillIndex]) {
						quotes[fillIndex]["PV " + sd.name] = projection;
					} else {
						futureTicks.push({ ["PV " + sd.name]: projection });
					}
					fillIndex++;
				}
				startingIndices.unshift(openingTick(startingIndices[0] - 1)); // add new, older lookback day
			}

			sd.cachedLastProjection = {
				DT: quotes[quotes.length - 1].DT,
				projectedValue: quotes[quotes.length - 1]["PV " + sd.name]
			};
			sd.cachedFutureTicks = futureTicks;
			sd.appendFutureTicks(stx, futureTicks);
		}

		let marketOffset = null;
		let volume = 0;
		let projectedVolume = 0;
		let lastPastTick; // record for caching

		// so we don't need to recalculate aggregation for entire day
		if (appendingOnly && aggregateVolume) {
			while (beginProjectionFrom > 0) {
				var prevVolume = quotes[beginProjectionFrom - 1]["V " + sd.name];
				if (prevVolume || prevVolume === 0) {
					volume = prevVolume;
					break;
				}
				beginProjectionFrom--;
			}
		}

		for (let i = beginProjectionFrom; i < quotes.length; i++) {
			const quote = quotes[i];
			const quoteVolume = quote.Volume;
			const projectedQuoteVolume = quote["PV " + sd.name];

			if (!quote.futureTick) lastPastTick = i;

			if (marketOffset === null) {
				//possible new daily period
				marketOffset = CIQ.Studies.getMarketOffset({
					stx,
					localQuoteDate: quotes[i].DT,
					shiftToDateBoundary: true
				});
			}

			const currentTime = new Date(new Date(quote.DT).getTime() + marketOffset);
			const prevTime =
				quotes[i - 1] &&
				new Date(new Date(quotes[i - 1].DT).getTime() + marketOffset);

			let anchor = new timezoneJS.Date(
				quote.DT,
				market.market_def.market_tz || "America/New_York"
			);
			anchor.setHours(anchorHour, anchorMinute, anchorSecond);
			anchor = new Date(anchor + marketOffset);

			// ensure that the anchor time "rolls over" to the same day as the current time
			anchor.setDate(currentTime.getDate());

			// A new day is a new period, even for FOREX thanks to marketOffset
			if (prevTime && currentTime.getDate() !== prevTime.getDate()) {
				marketOffset = null;
				volume = 0;
				projectedVolume = 0;
			}

			if (currentTime < anchor) {
				quote["V " + sd.name] = 0;
				quote["PV " + sd.name] = 0;
				continue;
			}

			if (aggregateVolume) {
				volume += quoteVolume;
				projectedVolume += projectedQuoteVolume;
			} else {
				volume = quoteVolume;
				projectedVolume = projectedQuoteVolume;
			}

			quote["V " + sd.name] = volume;
			if (!appendingOnly) quote["PV " + sd.name] = projectedVolume; // if appending keep old value

			if ([NaN, null, undefined].includes(volume) && !quote.futureTick) {
				sd.error = `${studyName} requires volume`;
				return;
			}
		}

		// make sure to cache the projected value _after_ aggregation
		sd.cachedLastProjection.projectedValue =
			quotes[lastPastTick]["PV " + sd.name];

		sd.outputMap = {};
		sd.outputMap["V " + sd.name] = "";
		sd.outputMap["PV " + sd.name] = "Average Line";

		// Make sure dependent studies are loaded with the correct start date (if that date has changed
		// and is no longer in sync with sd.startFrom)
		dependents.forEach((dependent) => {
			dependent.startFrom = beginProjectionFrom;
			dependent.study.calculateFN(stx, dependent);
		});

		function reportTickErrorAt(index) {
			console.error(
				`Expected data for ${dateFromTick(
					index
				).toDateString()} but found none. This may be caused by gaps in your data or an improperly configured market definition.`
			);
		}

		function getHoursAndMinutes(date) {
			return {
				hours: date.getHours(),
				minutes: date.getMinutes()
			};
		}

		function wind(date, days, forward) {
			while (days) {
				date = new Date(
					new Date(date).setDate(date.getDate() + (forward ? 1 : -1))
				);
				if (market.isMarketDate(date)) days--;
			}
			return date;
		}

		function tickFromDate(date) {
			return stx.tickFromDate(date, null, null, true, "scrubbed");
		}

		function dateFromTick(tick) {
			return stx.dateFromTick(tick, null, true, "scrubbed");
		}

		// Used if no market definition. Returns the previous midnight of a date, shifted by the market offset
		function defaultOpen(date) {
			date.setHours(0);
			date.setMinutes(0);
			let marketOffset = CIQ.Studies.getMarketOffset({
				stx,
				localQuoteDate: date
			});
			return new Date(date.getTime() + marketOffset);
		}

		// Returns the index for the tick of the market open of the day indicated by the index argument
		// if `ensureInSource` is true will try to find the oldest open in the data
		function openingTick(index, ensureInSource) {
			let date = dateFromTick(index);
			let marketOpen = market.getOpen(date) || defaultOpen(date);
			let tick = tickFromDate(marketOpen);
			if (!ensureInSource) return tick; // value may be outside the bounds of quotes array
			if (tick < 0) tick = tickFromDate(wind(marketOpen, 1, true)); // try to find oldest open _in_ the data
			if (tick >= quotes.length) return false; // if no open in data indicate so
			return tick;
		}
	};

	/**
	 * Displays the Projected Volume at Time (PVAT) and Projected Aggregate Volume (PAV) studies.
	 *
	 * @param {CIQ.ChartEngine} stx A reference to the chart object.
	 * @param {CIQ.Studies.StudyDescriptor} sd Specifies the study (PVAT or PAV) to be displayed.
	 * @param {array} quotes An array of quotes from which the study is constructed.
	 *
	 * @memberOf CIQ.Studies
	 * @since 8.0.0
	 */
	CIQ.Studies.displayProjectedVolume = function (stx, sd, quotes) {
		if (sd.error) return CIQ.Studies.removeAnchorHandle(stx, sd);
		const { "Alert Threshold": threshold = "" } = sd.inputs; // default: "+50%"
		const alertPercent = parseInt(threshold.slice(0, -1), 10) / 100;
		let alertColor = sd.outputs["Alert Bar"];
		if (typeof alertColor === "object") alertColor = alertColor.color;
		sd.volumeField = "V " + sd.name;
		sd.plotStepLine = true;
		sd.alignStepToSide = true;
		sd.extendToEndOfLastBar = true;
		sd.lineWidth = 2;

		const opacityUp = stx.canvasStyle("stx_volume_underlay_up").opacity;
		const opacityDown = stx.canvasStyle("stx_volume_underlay_down").opacity;

		sd.colorFunction = function (quote) {
			const { Open, Close, iqPrevClose } = quote;
			const comp = stx.colorByCandleDirection ? Open : iqPrevClose;
			const closeDown = comp > Close;
			const projectedVolume = quote["PV " + sd.name];
			const volume = quote["V " + sd.name];
			const alertChange = projectedVolume * (alertPercent + 1);
			const shouldAlert =
				alertPercent < 0 ? volume < alertChange : volume > alertChange;

			return {
				fill_color:
					(shouldAlert && alertColor) ||
					(closeDown ? this.fill_color_down : this.fill_color_up),
				border_color: closeDown ? this.border_color_down : this.border_color_up,
				opacity: shouldAlert ? 1 : closeDown ? opacityDown : opacityUp,
				border_opacity: closeDown ? opacityDown : opacityUp
			};
		};

		const studyName = sd.study ? sd.study.name : sd.type;
		const { loadingMore } = stx.chart;
		const someData = quotes.some(
			(quote) => quote && quote[sd.volumeField] && quote["PV " + sd.name]
		);
		const needsMore =
			quotes[0] &&
			!quotes[0].futureTick &&
			(quotes[0]["PV " + sd.name] === undefined ||
				(sd.dependentsOutputMap || []).some((key) =>
					[undefined, null].includes(quotes[0][key])
				));

		if (!someData && loadingMore) {
			return (sd.error = `Fetching data for ${studyName}`);
		}

		CIQ.Studies.createVolumeChart(stx, sd, quotes);
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		if (sd.anchorHandle) {
			CIQ.Studies.displayAnchorHandleAndLine(stx, sd, quotes);
		}

		if (needsMore) CIQ.Studies.calculateProjectedVolume(stx, sd);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		PVAT: {
			name: "Projected Volume at Time",
			range: "0 to max",
			yAxis: { ground: true, initialMarginTop: 0, zoom: 0 },
			calculateFN: CIQ.Studies.calculateProjectedVolume,
			seriesFN: CIQ.Studies.displayProjectedVolume,
			initializeFN: CIQ.Studies.initProjectedVolume,
			removeFN: CIQ.Studies.removeAnchorHandle,
			inputs: {
				"Lookback Days": 10,
				"Anchor Time": "",
				"Alert Threshold": [
					"+150%",
					"+125%",
					"+100%",
					"+75%",
					"+50%",
					"+25%",
					"None",
					"-25%",
					"-50%",
					"-75%",
					"-100%",
					"-125%",
					"-150%"
				],
				"Anchor Selector": true
			},
			outputs: {
				"Average Line": "#fe641c",
				"Alert Bar": "#cfbd0e",
				"Up Volume": "#8cc176",
				"Down Volume": "#b82c0c"
			},
			attributes: {
				"Anchor Time": { placeholder: "hh:mm:ss", step: 1 },
				"Alert Threshold": { defaultSelected: "+50%" }
			}
		},
		PAV: {
			name: "Projected Aggregate Volume",
			range: "0 to max",
			yAxis: { ground: true, initialMarginTop: 0, zoom: 0 },
			calculateFN: CIQ.Studies.calculateProjectedVolume,
			seriesFN: CIQ.Studies.displayProjectedVolume,
			initializeFN: CIQ.Studies.initProjectedVolume,
			removeFN: CIQ.Studies.removeAnchorHandle,
			inputs: {
				"Lookback Days": 10,
				"Anchor Time": "",
				"Anchor Selector": true
			},
			outputs: {
				"Average Line": "#fe641c",
				"Up Volume": "#8cc176",
				"Down Volume": "#b82c0c"
			},
			attributes: {
				"Anchor Time": { placeholder: "hh:mm:ss", step: 1 }
			}
		}
	});
}

};

let __js_advanced_studies_psychologicalLine_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"psychologicalLine feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculatePsychologicalLine = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var array = [];
		var increment = 100 / sd.days;
		var accum = 0;
		for (var i = Math.max(sd.startFrom - sd.days, 1); i < quotes.length; i++) {
			if (quotes[i].futureTick) break;
			var up = Number(quotes[i].Close > quotes[i - 1].Close);
			if (up) accum += increment;
			array.push(up);
			if (array.length > sd.days) accum -= array.shift() * increment;
			if (i < sd.startFrom) continue;
			if (!isNaN(quotes[i].Close)) quotes[i]["Result " + sd.name] = accum;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		PSY: {
			name: "Psychological Line",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculatePsychologicalLine,
			inputs: { Period: 20 }
		}
	});
}

};

let __js_advanced_studies_qstick_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("qstick feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateQStick = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			quotes[i]["_Close-Open " + sd.name] = quotes[i].Close - quotes[i].Open;
		}
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"_Close-Open " + sd.name,
			0,
			"Result",
			stx,
			sd
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		QStick: {
			name: "QStick",
			calculateFN: CIQ.Studies.calculateQStick,
			inputs: { Period: 8, "Moving Average Type": "ma" }
		}
	});
}

};

let __js_advanced_studies_rainbow_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("rainbow feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateRainbow = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		function getLLVHHV(p, x) {
			var h = Number.MAX_VALUE * -1,
				l = Number.MAX_VALUE;
			for (var j = x - p + 1; j <= x; j++) {
				if (j < 0) continue;
				h = Math.max(h, quotes[j].Close);
				l = Math.min(l, quotes[j].Close);
			}
			return [l, h];
		}

		var f = field;
		for (var j = 1; j <= 10; j++) {
			CIQ.Studies.MA("simple", sd.days, f, 0, "SMA" + j, stx, sd);
			f = "SMA" + j + " " + sd.name;
		}

		for (var i = Math.max(sd.startFrom, 10); i < quotes.length; i++) {
			if (!quotes[i]) continue;
			if (quotes[i].futureTick) break;
			var accum = 0,
				count = 0,
				max = Number.MAX_VALUE * -1,
				min = Number.MAX_VALUE;
			for (j = 1; j <= 10; j++) {
				var q = quotes[i]["SMA" + j + " " + sd.name];
				if (q || q === 0) {
					accum += q;
					count++;
					max = Math.max(max, q);
					min = Math.min(min, q);
				}
			}
			if (sd.name.indexOf("Osc") > -1) {
				var lh = getLLVHHV(sd.inputs["HHV/LLV Lookback"], i);
				if (count) {
					quotes[i][sd.name + "_hist"] =
						(100 * (quotes[i][field] - accum / count)) /
						Math.max(0.000001, lh[1] - lh[0]);
					quotes[i]["Over " + sd.name] =
						(100 * (max - min)) / Math.max(0.000001, lh[1] - lh[0]);
					quotes[i]["Under " + sd.name] = -quotes[i]["Over " + sd.name];
					quotes[i]["Zero " + sd.name] = 0;
				}
			}
		}
		if (sd.name.indexOf("Osc") > -1) {
			sd.outputMap = {};
			sd.outputMap["Over " + sd.name] = "Positive Bar";
			sd.outputMap["Under " + sd.name] = "Negative Bar";
			sd.outputMap["Zero " + sd.name] = "";
			sd.outputMap[sd.name + "_hist"] = "";
		}
	};

	CIQ.Studies.displayRainbowMA = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel];
		//just need to display in reverse order from outputMap
		for (var i = 10; i > 0; i--) {
			CIQ.Studies.displayIndividualSeriesAsLine(
				stx,
				sd,
				panel,
				"SMA" + i + " " + sd.name,
				quotes
			);
		}
	};

	CIQ.Studies.displayRainbowOsc = function (stx, sd, quotes) {
		CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);

		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		var y = stx.pixelFromPrice(0, panel, yAxis);
		var skipTransform = panel.name != sd.chart.name;

		var upColor = CIQ.Studies.determineColor(sd.outputs["Positive Bar"]);
		context.strokeStyle = upColor;
		stx.plotDataSegmentAsLine("Over " + sd.name, panel, {
			skipTransform: skipTransform,
			label: false,
			yAxis: yAxis
		});

		var upgradient = context.createLinearGradient(
			0,
			y,
			0,
			yAxis.flipped ? yAxis.bottom : yAxis.top
		);
		upgradient.addColorStop(0, stx.containerColor);
		upgradient.addColorStop(1, upColor);
		CIQ.prepareChannelFill(stx, {
			skipTransform: skipTransform,
			color: upgradient,
			opacity: !sd.highlight && stx.highlightedDraggable ? 0.3 : 1,
			panelName: sd.panel,
			topBand: "Over " + sd.name,
			bottomBand: "Zero " + sd.name,
			yAxis: yAxis
		});

		var downColor = CIQ.Studies.determineColor(sd.outputs["Negative Bar"]);
		context.strokeStyle = downColor;
		stx.plotDataSegmentAsLine("Under " + sd.name, panel, {
			skipTransform: skipTransform,
			label: false,
			yAxis: yAxis
		});

		var dngradient = context.createLinearGradient(
			0,
			y,
			0,
			yAxis.flipped ? yAxis.top : yAxis.bottom
		);
		dngradient.addColorStop(0, stx.containerColor);
		dngradient.addColorStop(1, downColor);
		CIQ.prepareChannelFill(stx, {
			skipTransform: skipTransform,
			color: dngradient,
			opacity: !sd.highlight && stx.highlightedDraggable ? 0.3 : 1,
			panelName: sd.panel,
			topBand: "Zero " + sd.name,
			bottomBand: "Under " + sd.name,
			yAxis: yAxis
		});

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;

		stx.canvasColor("stx_histogram");
		if (!sd.underlay) context.globalAlpha = 1;
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		context.fillStyle = "#CCCCCC";
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			if (quote[sd.name + "_hist"] > 0) context.fillStyle = upColor;
			else if (quote[sd.name + "_hist"] < 0) context.fillStyle = downColor;
			if (quote.candleWidth)
				myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
			context.fillRect(
				Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2),
				Math.floor(y),
				Math.floor(myWidth),
				Math.floor(
					stx.pixelFromPrice(quote[sd.name + "_hist"], panel, yAxis) - y
				)
			);
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Rainbow MA": {
			name: "Rainbow Moving Average",
			overlay: true,
			calculateFN: CIQ.Studies.calculateRainbow,
			seriesFN: CIQ.Studies.displayRainbowMA,
			inputs: { Period: 2, Field: "field" },
			outputs: {
				SMA1: "#FF0000",
				SMA2: "#FF7F00",
				SMA3: "#FFFF00",
				SMA4: "#7FFF00",
				SMA5: "#00FF7F",
				SMA6: "#00FFFF",
				SMA7: "#007FFF",
				SMA8: "#0000FF",
				SMA9: "#7F00FF",
				SMA10: "#FF00FF"
			}
		},
		"Rainbow Osc": {
			name: "Rainbow Oscillator",
			calculateFN: CIQ.Studies.calculateRainbow,
			seriesFN: CIQ.Studies.displayRainbowOsc,
			centerline: 0,
			inputs: { Period: 2, Field: "field", "HHV/LLV Lookback": 10 },
			outputs: { "Positive Bar": "#00DD00", "Negative Bar": "#FF0000" }
		}
	});
}

};

let __js_advanced_studies_randomWalk_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"randomWalk feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateRandomWalk = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		for (var i = Math.max(2, sd.startFrom); i < quotes.length; i++) {
			var ttr = 0;
			var high = quotes[i].High;
			var low = quotes[i].Low;
			var maxHigh = 0;
			var maxLow = 0;
			for (var j = 1; j <= sd.days; j++) {
				if (quotes[i].futureTick) break;
				if (i <= j) {
					maxHigh = maxLow = 0;
					break;
				}
				ttr += quotes[i - j].trueRange;
				var denom = (ttr / j) * Math.sqrt(j);
				if (denom) {
					// skip if denominator is 0 --
					var cH = (high - quotes[i - j].Low) / denom;
					var cL = (quotes[i - j].High - low) / denom;
					maxHigh = Math.max(maxHigh, cH);
					maxLow = Math.max(maxLow, cL);
				}
			}
			if (!quotes[i].futureTick && (!isNaN(high) || !isNaN(low))) {
				quotes[i]["Random Walk High " + sd.name] = maxHigh;
				quotes[i]["Random Walk Low " + sd.name] = maxLow;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Random Walk": {
			name: "Random Walk Index",
			calculateFN: CIQ.Studies.calculateRandomWalk,
			outputs: { "Random Walk High": "#FF0000", "Random Walk Low": "#0000FF" }
		}
	});
}

};

let __js_advanced_studies_relativeVigor_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"relativeVigor feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateRelativeVigor = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var i;
		for (i = sd.startFrom; i < quotes.length; i++) {
			var qt = quotes[i];
			if (!isNaN(qt.Close) && !isNaN(qt.Open))
				qt["_Change " + sd.name] = qt.Close - qt.Open;
			if (!isNaN(qt.High) && !isNaN(qt.Low))
				qt["_Range " + sd.name] = qt.High - qt.Low;
		}

		CIQ.Studies.MA("triangular", 4, "_Change " + sd.name, 0, "_Numer", stx, sd);
		CIQ.Studies.MA("triangular", 4, "_Range " + sd.name, 0, "_Denom", stx, sd);

		var nums = [];
		var dens = [];
		for (i = Math.max(sd.startFrom - sd.days, 0); i < quotes.length; i++) {
			if (quotes[i].futureTick) break;
			if (
				quotes[i]["_Numer " + sd.name] === null &&
				quotes[i]["_Denom " + sd.name] === null
			)
				continue;
			nums.push(quotes[i]["_Numer " + sd.name]);
			dens.push(quotes[i]["_Denom " + sd.name]);
			if (nums.length > sd.days) {
				nums.shift();
				dens.shift();
			}
			var sumNum = 0;
			var sumDen = 0;
			var it;
			for (it = 0; it < nums.length; it++) {
				sumNum += nums[it];
			}
			for (it = 0; it < dens.length; it++) {
				sumDen += dens[it];
			}
			if (sumDen === 0) sumDen = 0.00000001;
			if (i < sd.startFrom) continue;
			quotes[i]["Rel Vig " + sd.name] = sumNum / sumDen;
		}

		CIQ.Studies.MA(
			"triangular",
			4,
			"Rel Vig " + sd.name,
			0,
			"RelVigSignal",
			stx,
			sd
		);

		for (i = sd.startFrom; i < quotes.length; i++) {
			quotes[i][sd.name + "_hist"] =
				quotes[i]["Rel Vig " + sd.name] - quotes[i]["RelVigSignal " + sd.name];
		}
		//Don't clear outputMap
		sd.outputMap[sd.name + "_hist"] = "";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Rel Vig": {
			name: "Relative Vigor Index",
			seriesFN: CIQ.Studies.displayHistogramWithSeries,
			calculateFN: CIQ.Studies.calculateRelativeVigor,
			inputs: { Period: 10 },
			outputs: {
				"Rel Vig": "auto",
				RelVigSignal: "#FF0000",
				"Increasing Bar": "#00DD00",
				"Decreasing Bar": "#FF0000"
			}
		}
	});
}

};

let __js_advanced_studies_rsi_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("rsi feature requires first activating studies feature.");
} else {
	/**
	 * Default study calculation function for RSI study.
	 *
	 * The resulting values will be added to the dataSet using the field name provided by the `sd.outputMap` entry.
	 *
	 * **Notes:**
	 * - This function calculates a single value, so it expects `sd.outputMap` to contain a single mapping.
	 * - If no `outputs` object is defined in the library entry, the study will default to a single output named `Result`, which will then be used in lieu of `sd.outputs` to build the field name.
	 * - The study name may contain the unprintable character `&zwnj;`, see {@link studyDescriptor} documentation.
	 *
	 * @param {CIQ.ChartEngine} stx A chart engine instance
	 * @param {CIQ.Studies.StudyDescriptor} sd A study descriptor
	 * @memberOf CIQ.Studies
	 * @since 6.3.0 RSI can now be calculated on any field instead of just "Close".
	 */
	CIQ.Studies.calculateRSI = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		function computeRSI(avgGain, avgLoss) {
			if (avgLoss === 0) return 100;
			var rs = avgGain / avgLoss;
			return 100 - 100 / (1 + rs);
		}
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (!i) continue;
			var quote = quotes[i];
			var quote1 = quotes[i - 1];
			if (!quote[field] && quote[field] !== 0) continue;
			if (!quote1[field] && quote1[field] !== 0) continue;
			var change = quote[field] - quote1[field];
			var num = Math.min(i, sd.days);

			var avgGain = quote1["_avgG " + sd.name];
			if (!avgGain) avgGain = 0;
			avgGain -= avgGain / num;

			var avgLoss = quote1["_avgL " + sd.name];
			if (!avgLoss) avgLoss = 0;
			avgLoss -= avgLoss / num;

			if (change > 0) {
				avgGain += change / num;
			} else if (change <= 0) {
				avgLoss -= change / num;
			} else continue;
			if (i >= sd.days) {
				if ((avgGain || avgGain !== 0) && (avgLoss || avgLoss !== 0))
					quote["RSI " + sd.name] = computeRSI(avgGain, avgLoss);
			}
			//intermediates
			quote["_avgG " + sd.name] = avgGain;
			quote["_avgL " + sd.name] = avgLoss;
		}
		sd.zoneOutput = "RSI";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		rsi: {
			name: "RSI",
			inputs: { Period: 14, Field: "field" },
			calculateFN: CIQ.Studies.calculateRSI,
			range: "0 to 100",
			outputs: { RSI: "auto" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 80,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 20,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_schaffTrendCycle_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"schaffTrendCycle feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateSchaff = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var period = sd.days;
		var shortCycle = Number(sd.inputs["Short Cycle"]);
		var longCycle = Number(sd.inputs["Long Cycle"]);
		if (quotes.length < Math.max(period, shortCycle, longCycle) + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var factor = 0.5;

		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			shortCycle,
			field,
			0,
			"_MACD1",
			stx,
			sd
		);
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			longCycle,
			field,
			0,
			"_MACD2",
			stx,
			sd
		);

		function getLLVHHV(p, x, n) {
			var l = null,
				h = null;
			for (var j = x - p + 1; j <= x; j++) {
				var d = quotes[j][n + " " + sd.name];
				if (!d) continue;
				l = l === null ? d : Math.min(l, d);
				h = h === null ? d : Math.max(h, d);
			}
			return [l, h];
		}
		var f1 = 0,
			f2 = 0;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];

			if (i < longCycle - 1) continue;
			var qMACD1 = quote["_MACD1 " + sd.name],
				qMACD2 = quote["_MACD2 " + sd.name];
			if (qMACD1 || qMACD1 === 0 || qMACD2 || qMACD2 === 0) {
				quote["_MACD " + sd.name] = qMACD1 - qMACD2;
			}
			var qMACD = quote["_MACD " + sd.name];

			if (i < longCycle + (period - 1)) continue;
			var lh = getLLVHHV(period, i, "_MACD");
			f1 = lh[1] > lh[0] ? (100 * (qMACD - lh[0])) / (lh[1] - lh[0]) : f1;
			if (qMACD || qMACD === 0) {
				quote["_PF " + sd.name] = quotes[i - 1]["_PF " + sd.name]
					? quotes[i - 1]["_PF " + sd.name] +
					  factor * (f1 - quotes[i - 1]["_PF " + sd.name])
					: f1;
			}
			var qPF = quote["_PF " + sd.name];
			if (i < longCycle + 2 * (period - 1)) continue;
			lh = getLLVHHV(period, i, "_PF");
			f2 = lh[1] > lh[0] ? (100 * (qPF - lh[0])) / (lh[1] - lh[0]) : f2;
			if (qPF || qPF === 0) {
				quote["Result " + sd.name] = quotes[i - 1]["Result " + sd.name]
					? quotes[i - 1]["Result " + sd.name] +
					  factor * (f2 - quotes[i - 1]["Result " + sd.name])
					: f2;
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Schaff: {
			name: "Schaff Trend Cycle",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculateSchaff,
			inputs: {
				Period: 10,
				Field: "field",
				"Short Cycle": 23,
				"Long Cycle": 50,
				"Moving Average Type": "ema"
			},
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 75,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 25,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_shinohara_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("shinohara feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateShinohara = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var accums = {
			weakNum: 0,
			weakDen: 0,
			strongNum: 0,
			strongDen: 0
		};
		if (sd.startFrom > 1) {
			accums = CIQ.clone(quotes[sd.startFrom - 1]["_accums " + sd.name]);
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			accums.weakNum += quotes[i].High - quotes[i].Close;
			accums.weakDen += quotes[i].Close - quotes[i].Low;
			if (i > 0) {
				accums.strongNum += quotes[i].High - quotes[i - 1].Close;
				accums.strongDen += quotes[i - 1].Close - quotes[i].Low;
			}
			if (i >= sd.days) {
				accums.weakNum -= quotes[i - sd.days].High - quotes[i - sd.days].Close;
				accums.weakDen -= quotes[i - sd.days].Close - quotes[i - sd.days].Low;
				quotes[i]["Weak Ratio " + sd.name] =
					(100 * accums.weakNum) / accums.weakDen;
				if (i > sd.days) {
					accums.strongNum -=
						quotes[i - sd.days].High - quotes[i - sd.days - 1].Close;
					accums.strongDen -=
						quotes[i - sd.days - 1].Close - quotes[i - sd.days].Low;
					quotes[i]["Strong Ratio " + sd.name] =
						(100 * accums.strongNum) / accums.strongDen;
				}
			}
			quotes[i]["_accums " + sd.name] = CIQ.clone(accums);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Shinohara: {
			name: "Shinohara Intensity Ratio",
			calculateFN: CIQ.Studies.calculateShinohara,
			inputs: { Period: 26 },
			outputs: { "Strong Ratio": "#E99B54", "Weak Ratio": "#5F7CB8" }
		}
	});
}

};

let __js_advanced_studies_stochastics_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"stochastics feature requires first activating studies feature."
	);
} else {
	/**
	 * Calculate function for stochastics
	 * @param  {CIQ.ChartEngine} stx Chart object
	 * @param {CIQ.Studies.StudyDescriptor} sd  Study Descriptor
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.calculateStochastics = function (stx, sd) {
		if (!sd.smooth) sd.smooth = sd.inputs.Smooth;
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		var fastPeriod = sd.inputs["%K Periods"];
		if (!fastPeriod) fastPeriod = sd.days;

		var quotes = sd.chart.scrubbed;
		if (quotes.length < Math.max(fastPeriod, sd.days) + 1) {
			sd.error = true;
			return;
		}

		var smoothingPeriod = sd.inputs["%K Smoothing Periods"];
		if (smoothingPeriod) sd.smooth = true;
		else if (sd.smooth) smoothingPeriod = 3;

		var slowPeriod = sd.inputs["%D Periods"];
		if (!slowPeriod) slowPeriod = 3;

		function computeStochastics(position, field, days) {
			var beg = position - days + 1;
			var high = Number.MAX_VALUE * -1,
				low = Number.MAX_VALUE;
			for (var i = beg; i <= position; i++) {
				var lowField = quotes[i][field == "Close" ? "Low" : field],
					highField = quotes[i][field == "Close" ? "High" : field];
				if (!lowField && lowField !== 0) continue;
				if (!highField && highField !== 0) continue;
				low = Math.min(low, lowField);
				high = Math.max(high, highField);
			}
			if (high == Number.MAX_VALUE * -1 || low == Number.MAX_VALUE) return null;
			var k =
				high == low
					? 0
					: ((quotes[position][field] - low) / (high - low)) * 100;
			return k;
		}

		sd.outputMap = {};
		sd.outputMap["%K " + sd.name] = "Fast";
		sd.outputMap["%D " + sd.name] = "Slow";

		for (var i = Math.max(fastPeriod, sd.startFrom); i < quotes.length; i++) {
			var stoch = computeStochastics(i, field, fastPeriod);
			if (stoch !== null)
				quotes[i][sd.name] = computeStochastics(i, field, fastPeriod);
		}

		CIQ.Studies.MA(
			"simple",
			sd.smooth ? smoothingPeriod : 1,
			sd.name,
			0,
			"%K",
			stx,
			sd
		);
		CIQ.Studies.MA("simple", slowPeriod, "%K " + sd.name, 0, "%D", stx, sd);
	};

	CIQ.Studies.calculateStochMomentum = function (stx, sd) {
		var pKPeriods = Number(sd.inputs["%K Periods"]);
		var pKSmoothPeriods = Number(sd.inputs["%K Smoothing Periods"]);
		var pK2SmoothPeriods = Number(sd.inputs["%K Double Smoothing Periods"]);
		var pDPeriods = Number(sd.inputs["%D Periods"]);

		var quotes = sd.chart.scrubbed;
		if (
			quotes.length < pKPeriods + pKSmoothPeriods + pK2SmoothPeriods - 1 ||
			quotes.length < pDPeriods
		) {
			sd.error = true;
			return;
		}

		function getLLVHHV(p, x) {
			var l = null,
				h = null;
			for (var j = x - p + 1; j <= x; j++) {
				l = l === null ? quotes[j].Low : Math.min(l, quotes[j].Low);
				h = h === null ? quotes[j].High : Math.max(h, quotes[j].High);
			}
			return [l, h];
		}

		var i;
		for (i = Math.max(pKPeriods, sd.startFrom) - 1; i < quotes.length; i++) {
			var quote = quotes[i];
			var lh = getLLVHHV(pKPeriods, i);
			quote["_H " + sd.name] = quote.Close - (lh[0] + lh[1]) / 2;
			quote["_DHL " + sd.name] = lh[1] - lh[0];
		}

		CIQ.Studies.MA(
			"exponential",
			pKSmoothPeriods,
			"_H " + sd.name,
			0,
			"_HS1",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			pK2SmoothPeriods,
			"_HS1 " + sd.name,
			0,
			"_HS2",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			pKSmoothPeriods,
			"_DHL " + sd.name,
			0,
			"_DHL1",
			stx,
			sd
		);
		CIQ.Studies.MA(
			"exponential",
			pK2SmoothPeriods,
			"_DHL1 " + sd.name,
			0,
			"_DHL2",
			stx,
			sd
		);

		for (i = pKPeriods - 1; i < quotes.length; i++) {
			quotes[i]["%K " + sd.name] =
				(quotes[i]["_HS2 " + sd.name] / (0.5 * quotes[i]["_DHL2 " + sd.name])) *
				100;
		}

		CIQ.Studies.MA(
			sd.inputs["%D Moving Average Type"],
			pDPeriods,
			"%K " + sd.name,
			0,
			"%D",
			stx,
			sd
		);

		sd.zoneOutput = "%K";
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Stch Mtm": {
			name: "Stochastic Momentum Index",
			calculateFN: CIQ.Studies.calculateStochMomentum,
			inputs: {
				"%K Periods": 10,
				"%K Smoothing Periods": 3,
				"%K Double Smoothing Periods": 3,
				"%D Periods": 10,
				"%D Moving Average Type": "ema"
			},
			outputs: { "%K": "auto", "%D": "#FF0000" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 40,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -40,
					studyOverSoldColor: "auto"
				}
			}
		},
		stochastics: {
			name: "Stochastics",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculateStochastics,
			inputs: { Period: 14, Field: "field", Smooth: true },
			outputs: { Fast: "auto", Slow: "#FF0000" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 80,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 20,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_supertrend_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"supertrend feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateSupertrend = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		CIQ.Studies.calculateStudyATR(stx, sd);
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			var median = (quote.High + quote.Low) / 2;
			var factoredATR = sd.inputs.Multiplier * quote["ATR " + sd.name];
			var uptrend = median - factoredATR;
			var downtrend = median + factoredATR;
			if (i) {
				if (
					quotes[i - 1] &&
					quotes[i - 1].Close &&
					quotes[i - 1].Close > quotes[i - 1]["_Uptrend " + sd.name] &&
					quotes[i - 1]["_Uptrend " + sd.name] > uptrend
				)
					uptrend = quotes[i - 1]["_Uptrend " + sd.name];
				if (
					quotes[i - 1] &&
					quotes[i - 1].Close &&
					quotes[i - 1].Close < quotes[i - 1]["_Downtrend " + sd.name] &&
					quotes[i - 1]["_Downtrend " + sd.name] < downtrend
				)
					downtrend = quotes[i - 1]["_Downtrend " + sd.name];
			}
			quote["_Direction " + sd.name] = 1;
			if (i) {
				quote["_Direction " + sd.name] = quotes[i - 1]["_Direction " + sd.name];
				if (quote.Close > quotes[i - 1]["_Downtrend " + sd.name])
					quote["_Direction " + sd.name] = 1;
				else if (quote.Close < quotes[i - 1]["_Uptrend " + sd.name])
					quote["_Direction " + sd.name] = -1;
			}
			quote["_Uptrend " + sd.name] = uptrend;
			quote["_Downtrend " + sd.name] = downtrend;
			quote["Trend " + sd.name] =
				quote["_Direction " + sd.name] > 0 ? uptrend : downtrend;
			if (!i) continue;
		}
		sd.outputMap = {};
		sd.outputMap["Trend " + sd.name] = "";
	};

	CIQ.Studies.displaySupertrend = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);
		function colorFunction(stx, quote, mode) {
			if (quote && quote["_Direction " + sd.name] < 0)
				return sd.outputs.Downtrend;
			return sd.outputs.Uptrend;
		}
		var params = {
			skipTransform: panel.name != sd.chart.name,
			skipProjections: true,
			label: stx.preferences.labels,
			yAxis: yAxis,
			highlight: sd.highlight
		};

		context.strokeStyle = colorFunction(stx, quotes[quotes.length - 1]);
		context.lineWidth = 2;
		if (sd.highlight) context.lineWidth = 1.5; // it will get doubled in plotDataSegmentAsLine
		var trendName = "Trend " + sd.name;
		for (
			var x = 0;
			panel.chart.transformFunc &&
			yAxis != panel.chart.yAxis &&
			x < quotes.length;
			x++
		) {
			var q = quotes[x];
			if (q && q.transform) {
				q.transform[trendName] = panel.chart.transformFunc(
					stx,
					panel.chart,
					q[trendName]
				);
			}
		}
		stx.plotDataSegmentAsLine(trendName, panel, params, colorFunction);
		context.lineWidth = 1;
		context.globalAlpha = 1;

		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		var signalWidth = context.measureText("\u25B2").width / 2;
		var i;
		for (i = 0; i < quotes.length; i++) {
			if (!quotes[i] || !quotes[i - 1]) continue;
			if (
				quotes[i - 1]["_Direction " + sd.name] >
				quotes[i]["_Direction " + sd.name]
			) {
				context.fillStyle = sd.outputs.Downtrend;
				context.textBaseline = "bottom";
				var yh = stx.pixelFromPrice(quotes[i].High, panel, yAxis);
				for (var d = 5; d <= 45; d += 10) {
					// down arrow
					if (yAxis.flipped)
						context.fillText(
							"\u25B2",
							stx.pixelFromBar(i) - signalWidth,
							yh + d
						);
					else
						context.fillText(
							"\u25BC",
							stx.pixelFromBar(i) - signalWidth,
							yh - d
						);
				}
			} else if (
				quotes[i - 1]["_Direction " + sd.name] <
				quotes[i]["_Direction " + sd.name]
			) {
				context.fillStyle = sd.outputs.Uptrend;
				context.textBaseline = "top";
				var yl = stx.pixelFromPrice(quotes[i].Low, panel, yAxis);
				for (var u = 5; u <= 45; u += 10) {
					// up arrow
					if (yAxis.flipped)
						context.fillText(
							"\u25BC",
							stx.pixelFromBar(i) - signalWidth,
							yl - u
						);
					else
						context.fillText(
							"\u25B2",
							stx.pixelFromBar(i) - signalWidth,
							yl + u
						);
				}
			}
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Supertrend: {
			name: "Supertrend",
			overlay: true,
			seriesFN: CIQ.Studies.displaySupertrend,
			calculateFN: CIQ.Studies.calculateSupertrend,
			inputs: { Period: 7, Multiplier: 3 },
			outputs: { Uptrend: "#8cc176", Downtrend: "#b82c0c" },
			attributes: {
				Multiplier: { min: 0.1, step: 0.1 }
			}
		}
	});
}

};

let __js_advanced_studies_swingIndex_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"swingIndex feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateSwingIndex = function (stx, sd) {
		var T = sd.inputs["Limit Move Value"];
		if (T === null || isNaN(T)) T = 99999;
		var quotes = sd.chart.scrubbed;
		var total = 0;
		if (sd.startFrom > 1) total = quotes[sd.startFrom - 1]["Result " + sd.name];
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var A = Math.abs(quotes[i].High - quotes[i - 1].Close);
			var B = Math.abs(quotes[i].Low - quotes[i - 1].Close);
			var C = Math.abs(quotes[i].High - quotes[i].Low);
			var D = Math.abs(quotes[i - 1].Close - quotes[i - 1].Open);
			var K = Math.max(A, B);
			var M = Math.max(C, K);
			var R = M + 0.25 * D;
			if (M == A) R -= 0.5 * B;
			else if (M == B) R -= 0.5 * A;

			var swing =
				((50 *
					(quotes[i].Close -
						quotes[i - 1].Close +
						0.5 * (quotes[i].Close - quotes[i].Open) +
						0.25 * (quotes[i - 1].Close - quotes[i - 1].Open))) /
					R) *
				(K / T);
			if (R === 0 || T === 0) swing = 0;

			if (sd.type == "Swing") total = 0;
			total += swing;
			quotes[i]["Result " + sd.name] = total;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Acc Swing": {
			name: "Accumulative Swing Index",
			calculateFN: CIQ.Studies.calculateSwingIndex,
			inputs: { "Limit Move Value": 0.5 }
		},
		Swing: {
			name: "Swing Index",
			calculateFN: CIQ.Studies.calculateSwingIndex,
			inputs: { "Limit Move Value": 0.5 }
		}
	});
}

};

let __js_advanced_studies_trendIntensity_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"trendIntensity feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateTrendIntensity = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		function computeTII(gain, loss) {
			if (Math.abs(loss) < 0.00000001) return 100;
			return 100 - 100 / (1 + gain / loss);
		}
		CIQ.Studies.MA("ma", sd.days, field, 0, "_SMA", stx, sd);
		var gain = 0,
			loss = 0,
			i,
			change,
			queue = [],
			maxLength = Math.ceil(sd.days / 2);
		for (i = Math.max(0, sd.startFrom - maxLength); i < quotes.length; i++) {
			if (!quotes[i]["_SMA " + sd.name] && quotes[i]["_SMA " + sd.name] !== 0)
				continue;
			change = quotes[i][field] - quotes[i]["_SMA " + sd.name];
			if (change < 0) loss += change * -1;
			else gain += change;
			queue.push(change);
			if (queue.length > maxLength) {
				change = queue.shift();
				if (change < 0) loss -= change * -1;
				else gain -= change;
			}
			if (i < sd.startFrom) continue;
			quotes[i]["TII " + sd.name] = computeTII(gain, loss);
		}
		CIQ.Studies.MA(
			"ema",
			sd.inputs["Signal Period"],
			"TII " + sd.name,
			0,
			"Signal",
			stx,
			sd
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Trend Int": {
			name: "Trend Intensity Index",
			calculateFN: CIQ.Studies.calculateTrendIntensity,
			range: "0 to 100",
			inputs: { Period: 14, Field: "field", "Signal Period": 9 },
			outputs: { TII: "auto", Signal: "#FF0000" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 80,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 20,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_trix_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("trix feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateTRIX = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var name = sd.name;
		var fields = ["Close", "_MA1 " + name, "_MA2 " + name, "_MA3 " + name];
		for (var e = 0; e < fields.length - 1; e++) {
			CIQ.Studies.MA(
				"exponential",
				sd.days,
				fields[e],
				0,
				"_MA" + (e + 1).toString(),
				stx,
				sd
			);
		}

		var ma3 = fields[3];
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var q0 = quotes[i - 1][ma3];
			if (!q0) continue;
			var qima3 = quotes[i][ma3];
			if (qima3 || qima3 === 0)
				quotes[i]["Result " + name] = 100 * (qima3 / q0 - 1);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		TRIX: {
			name: "TRIX",
			calculateFN: CIQ.Studies.calculateTRIX
		}
	});
}

};

let __js_advanced_studies_twiggsMoneyFlow_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"twiggsMoneyFlow feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateTwiggsMoneyFlow = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		var sumMoneyFlow = 0,
			sumVolume = 0;
		var startQuote = quotes[sd.startFrom - 1];
		if (startQuote) {
			if (startQuote["_sumMF " + sd.name])
				sumMoneyFlow = startQuote["_sumMF " + sd.name];
			if (startQuote["_sumV " + sd.name])
				sumVolume = startQuote["_sumV " + sd.name];
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var trh = Math.max(quotes[i - 1].Close, quotes[i].High);
			var trl = Math.min(quotes[i - 1].Close, quotes[i].Low);
			quotes[i]["_MFV " + sd.name] =
				(quotes[i].Volume * (2 * quotes[i].Close - trh - trl)) /
				(trh - trl === 0 ? 999999 : trh - trl);
			if (i > sd.days - 1) {
				sumMoneyFlow *= (sd.days - 1) / sd.days;
				sumVolume *= (sd.days - 1) / sd.days;
			}
			sumMoneyFlow += quotes[i]["_MFV " + sd.name];
			sumVolume += quotes[i].Volume;
			if (i > sd.days - 1) {
				if (sumVolume)
					quotes[i]["Result " + sd.name] =
						sumMoneyFlow / (sumVolume > 0 ? sumVolume : 999999);
			}
			quotes[i]["_sumMF " + sd.name] = sumMoneyFlow;
			quotes[i]["_sumV " + sd.name] = sumVolume;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Twiggs: {
			name: "Twiggs Money Flow",
			calculateFN: CIQ.Studies.calculateTwiggsMoneyFlow,
			inputs: { Period: 21 }
		}
	});
}

};

let __js_advanced_studies_typicalPrice_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */



var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"typicalPrice feature requires first activating studies feature."
	);
} else if (!CIQ.Studies.calculateTypicalPrice) {
	console.error(
		"typicalPrice feature requires first activating medianPrice feature."
	);
} else {
	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Typical Price": {
			name: "Typical Price",
			calculateFN: CIQ.Studies.calculateTypicalPrice,
			inputs: { Period: 14 }
		},
		"Weighted Close": {
			name: "Weighted Close",
			calculateFN: CIQ.Studies.calculateTypicalPrice,
			inputs: { Period: 14 }
		}
	});
}

};

let __js_advanced_studies_ulcerIndex_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"ulcerIndex feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateUlcerIndex = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < 2 * sd.days - 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		function getHV(p, x, f) {
			var h = null;
			for (var j = x - p + 1; j <= x; j++) {
				if (j < 0) continue;
				h = h === null ? quotes[j][f] : Math.max(h, quotes[j][f]);
			}
			return h;
		}
		var i;
		for (i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			quotes[i]["_PD2 " + sd.name] = Math.pow(
				100 * (quotes[i][field] / getHV(sd.days, i, field) - 1),
				2
			);
		}
		CIQ.Studies.MA("simple", sd.days, "_PD2 " + sd.name, 0, "_MA", stx, sd);
		for (
			i = Math.max(sd.startFrom, 2 * (sd.days - 1));
			i < quotes.length;
			i++
		) {
			var _ma = quotes[i]["_MA " + sd.name];
			if (_ma || _ma === 0) quotes[i]["Result " + sd.name] = Math.sqrt(_ma);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Ulcer: {
			name: "Ulcer Index",
			calculateFN: CIQ.Studies.calculateUlcerIndex,
			inputs: { Period: 14, Field: "field" }
		}
	});
}

};

let __js_advanced_studies_ultimateOscillator_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"ultimateOscillator feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateUltimateOscillator = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var cycle = [
			sd.inputs["Cycle 1"],
			sd.inputs["Cycle 2"],
			sd.inputs["Cycle 3"]
		];
		var start = Math.max(cycle[0], cycle[1], cycle[2]);
		if (quotes.length < start + 1) {
			sd.error = true;
			return;
		}
		var c01 = cycle[0] * cycle[1];
		var c02 = cycle[0] * cycle[2];
		var c12 = cycle[1] * cycle[2];
		var accbp = [0, 0, 0];
		var acctr = [0, 0, 0];
		if (sd.startFrom) {
			if (quotes[sd.startFrom - 1]["_accbp " + sd.name])
				accbp = quotes[sd.startFrom - 1]["_accbp " + sd.name].slice();
			if (quotes[sd.startFrom - 1]["_acctr " + sd.name])
				acctr = quotes[sd.startFrom - 1]["_acctr " + sd.name].slice();
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var minLC = Math.min(quotes[i].Low, quotes[i - 1].Close);
			var bp = quotes[i].Close - minLC;
			var tr = Math.max(quotes[i].High, quotes[i - 1].Close) - minLC;
			for (var x = 0; x < cycle.length; x++) {
				accbp[x] += bp;
				acctr[x] += tr;
				if (i > cycle[x]) {
					var p_minLC = Math.min(
						quotes[i - cycle[x]].Low,
						quotes[i - cycle[x] - 1].Close
					);
					var p_bp = quotes[i - cycle[x]].Close - p_minLC;
					var p_tr =
						Math.max(
							quotes[i - cycle[x]].High,
							quotes[i - cycle[x] - 1].Close
						) - p_minLC;
					accbp[x] -= p_bp;
					acctr[x] -= p_tr;
				}
			}
			quotes[i]["_accbp " + sd.name] = accbp.slice();
			quotes[i]["_acctr " + sd.name] = acctr.slice();
			if (i < start) continue;
			var numerator =
				(c12 * accbp[0]) / acctr[0] +
				(c02 * accbp[1]) / acctr[1] +
				(c01 * accbp[2]) / acctr[2];
			var denominator = c12 + c02 + c01;
			quotes[i]["Result " + sd.name] = (100 * numerator) / denominator;
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Ultimate: {
			name: "Ultimate Oscillator",
			calculateFN: CIQ.Studies.calculateUltimateOscillator,
			inputs: { "Cycle 1": 7, "Cycle 2": 14, "Cycle 3": 28 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 70,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 30,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_valuationLines_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"valuationLines feature requires first activating studies feature."
	);
} else {
	/**
	 * Calculate "val lines" study. This study does all calculations on the {studyDescriptor.chart.dataSegment}.
	 *
	 * @param {CIQ.ChartEngine} stx A chart engine instance
	 * @param {CIQ.Studies.StudyDescriptor} sd A study descriptor
	 * @param {object[]} quotes the dataSegment
	 * @memberof CIQ.Studies
	 */
	CIQ.Studies.calculateValuationLines = function (stx, sd, quotes) {
		var field = sd.inputs.Field == "field" ? "Close" : sd.inputs.Field;
		var averageType = sd.inputs["Average Type"];
		var displayAvg = sd.inputs["Display Average"];
		var displayS1 = sd.inputs["Display 1 Standard Deviation (1\u03C3)"];
		var displayS2 = sd.inputs["Display 2 Standard Deviation (2\u03C3)"];
		var displayS3 = sd.inputs["Display 3 Standard Deviation (3\u03C3)"];
		var values = [];

		for (var i = 0; i < quotes.length; ++i) {
			if (quotes[i] && !isNaN(quotes[i][field])) values.push(quotes[i][field]);
		}

		var average = (function (nums, type) {
			var len = nums.length;
			var numerator = 0,
				denominator = 0,
				i = 0;

			switch (type) {
				case "mean":
					denominator = len;
					for (; i < len; ++i) {
						numerator += nums[i];
					}
					break;
				case "harmonic":
					numerator = len;
					for (; i < len; ++i) {
						denominator += 1 / nums[i];
					}
					break;
				case "median":
					var middle = Math.floor(len / 2);
					var sorted = nums.slice().sort(function (a, b) {
						if (a > b) return 1;
						if (a < b) return -1;
						return 0;
					});

					if (len % 2 === 0) {
						numerator = sorted[middle] + sorted[middle - 1];
						denominator = 2;
					} else {
						numerator = sorted[middle];
						denominator = 1;
					}
					break;
			}

			return numerator / denominator;
		})(values, averageType);

		// logic skips the calculation if none of the stddev lines are displaying
		var stddev =
			!(displayS1 || displayS2 || displayS3) ||
			(function (nums, baseline) {
				var len = nums.length;
				var numerator = 0;

				for (var i = 0; i < len; ++i) {
					numerator += Math.pow(nums[i] - baseline, 2);
				}

				return Math.sqrt(numerator / len);
			})(values, average);

		sd.data = {
			Average: displayAvg ? [average] : null,
			"1 Standard Deviation (1\u03C3)": displayS1
				? [average + stddev, average - stddev]
				: null,
			"2 Standard Deviation (2\u03C3)": displayS2
				? [average + stddev * 2, average - stddev * 2]
				: null,
			"3 Standard Deviation (3\u03C3)": displayS3
				? [average + stddev * 3, average - stddev * 3]
				: null
		};

		var padding = stddev;
		if (!sd.parameters) sd.parameters = {};
		if (displayS3)
			sd.parameters.range = [
				average - stddev * 3 - padding,
				average + stddev * 3 + padding
			];
		else if (displayS2)
			sd.parameters.range = [
				average - stddev * 2 - padding,
				average + stddev * 2 + padding
			];
		else if (displayS1)
			sd.parameters.range = [
				average - stddev - padding,
				average + stddev + padding
			];
		else if (displayAvg)
			sd.parameters.range = [average - padding, average + padding];
		if (sd.panel) {
			var panel = stx.panels[sd.panel];
			var yAxis = stx.getYAxisByName(panel, sd.name);
			if (yAxis) {
				yAxis.decimalPlaces = panel.chart.yAxis.printDecimalPlaces;
				var parameters = { yAxis: yAxis };
				stx.calculateYAxisRange(
					panel,
					yAxis,
					sd.parameters.range[0],
					sd.parameters.range[1]
				);
				stx.createYAxis(panel, parameters);
				stx.drawYAxis(panel, parameters);
			}
		}
	};

	/**
	 * Display "val lines" study.
	 *
	 * It is possible to change how the lines appear with CSS styling.
	 * **Example:**
	 * .ciq-valuation-average-line {
	 *   border-style: solid;
	 *   border-width: 1.2px;
	 *   opacity: 0.95;
	 * }
	 * .ciq-valuation-deviation-line {
	 *   border-style: dotted;
	 *   border-width: 1px;
	 *   opacity: 0.80;
	 * }
	 *
	 * These values are used to create the params argument for {CIQ.ChartEngine#plotLine}.
	 *  - "border-style" -> "pattern"
	 *  - "border-width" -> "lineWidth"
	 *  - "opacity" -> "opacity"
	 *
	 * Average line defaults to {pattern: 'solid', lineWidth: 1, opacity: 1}
	 * Deviation lines default to {pattern: 'dashed', lineWidth: 1, opacity: 1}
	 *
	 * Suggested that whitespace be set from about 60 to 90 pixels so that the labels are
	 * clearly visible in the home position.
	 *
	 * @example
	 * var stxx = new CIQ.ChartEngine({container: document.querySelector('.chartContainer'), preferences: {whitespace: 60.5}});
	 *
	 * Alternatively, you can use yAxis labels by setting the labels parameter to "yaxis" in the studyLibrary entry.
	 *
	 * @example
	 * CIQ.Studies.studyLibrary['val lines'].parameters = {labels: 'yaxis'};
	 *
	 * @param {CIQ.ChartEngine} stx The chart object
	 * @param {CIQ.Studies.StudyDescriptor} sd The study descriptor
	 * @memberOf CIQ.Studies
	 */
	CIQ.Studies.displayValuationLines = function (stx, sd) {
		var panel = stx.panels[sd.panel];
		var yAxis = sd.getYAxis(stx);
		var context = sd.getContext(stx);
		var data = sd.data;
		var labels = sd.parameters.labels;
		var averageType = sd.inputs["Average Type"];
		var averageLabels = { mean: "AVG", median: "MED", harmonic: "HAVG" };
		var averageStyle = stx.canvasStyle("ciq-valuation-average-line");
		var deviationStyle = stx.canvasStyle("ciq-valuation-deviation-line");
		var textPadding = 3; // padding top, right, and bottom
		var textHeight = stx.getCanvasFontSize("stx_yaxis") + textPadding * 2;
		var isAvg, color, value, i, price, y, text, textWidth, plotLineParams;

		for (var key in data) {
			if (!data[key]) continue;

			isAvg = key == "Average";
			color = CIQ.Studies.determineColor(sd.outputs[key]);
			value = data[key];

			for (i = 0; i < value.length; ++i) {
				price = value[i];
				y = stx.pixelFromPrice(price, panel, yAxis);

				if (y <= panel.top || y >= panel.yAxis.bottom) continue;

				plotLineParams = isAvg
					? {
							pattern:
								averageStyle.borderStyle != "none"
									? averageStyle.borderStyle || "solid"
									: "solid",
							lineWidth: parseFloat(averageStyle.borderWidth) || 1,
							opacity: parseFloat(averageStyle.opacity) || 1,
							yAxis: yAxis
					  }
					: {
							pattern:
								deviationStyle.borderStyle != "none"
									? deviationStyle.borderStyle || "dashed"
									: "dashed",
							lineWidth: parseFloat(deviationStyle.borderWidth) || 1,
							opacity: parseFloat(deviationStyle.opacity) || 1,
							yAxis: yAxis
					  };

				stx.plotLine(
					panel.left,
					panel.right,
					y,
					y,
					color,
					"line",
					context,
					panel,
					plotLineParams
				);

				if (labels === "yaxis") {
					stx.createYAxisLabel(
						panel,
						stx.formatYAxisPrice(price, panel),
						y,
						color,
						null,
						context,
						yAxis
					);
					continue;
				}

				// additional Y padding to prevent line from overlapping text
				y += Math.floor(plotLineParams.lineWidth / 2);

				if (y + textHeight >= panel.yAxis.bottom) continue;

				text =
					(isAvg ? averageLabels[averageType] + ": " : key[0] + "\u03C3: ") +
					stx.formatYAxisPrice(price, panel);
				textWidth = context.measureText(text).width;

				var position = panel.right - textWidth - textPadding;
				if (yAxis && yAxis.position == "left")
					position = panel.left + textPadding;

				context.strokeText(text, position, y + textHeight / 2 + 0.5);
			}
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"val lines": {
			name: "Valuation Lines",
			calculateFN: function () {},
			seriesFN: function (stx, sd, quotes) {
				CIQ.Studies.calculateValuationLines(stx, sd, quotes);
				CIQ.Studies.displayValuationLines(stx, sd);
			},
			overlay: true,
			yAxisFN: function () {},
			inputs: {
				Field: "field",
				"Average Type": ["mean", "median", "harmonic"],
				"Display Average": true,
				"Display 1 Standard Deviation (1\u03C3)": false,
				"Display 2 Standard Deviation (2\u03C3)": false,
				"Display 3 Standard Deviation (3\u03C3)": false
			},
			outputs: {
				Average: "#00afed",
				"1 Standard Deviation (1\u03C3)": "#e1e1e1",
				"2 Standard Deviation (2\u03C3)": "#85c99e",
				"3 Standard Deviation (3\u03C3)": "#fff69e"
			}
		}
	});
}

};

let __js_advanced_studies_volatilityIndex_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"volatilityIndex feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateRelativeVolatility = function (stx, sd) {
		sd.days = Number(sd.inputs["Smoothing Period"]);
		var smoothing = Number(sd.inputs["STD Period"]);
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + smoothing) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		function computeRVI(avgGain, avgLoss) {
			if (avgGain + avgLoss === 0) return 100;
			return (100 * avgGain) / (avgGain + avgLoss);
		}
		sd.std = new CIQ.Studies.StudyDescriptor(sd.name, "sdev", sd.panel);
		sd.std.chart = sd.chart;
		sd.std.days = smoothing;
		sd.std.startFrom = sd.startFrom;
		sd.std.inputs = { Field: field, "Standard Deviations": 1, Type: "ma" };
		sd.std.outputs = { _STD: null };
		CIQ.Studies.calculateStandardDeviation(stx, sd.std);

		var avgGain = 0;
		var avgLoss = 0;
		if (sd.startFrom > 1) {
			avgGain = quotes[sd.startFrom - 1]["_avgG " + sd.name] || 0;
			avgLoss = quotes[sd.startFrom - 1]["_avgL " + sd.name] || 0;
		}
		for (var i = Math.max(sd.startFrom, sd.days); i < quotes.length; i++) {
			var quote = quotes[i],
				quote1 = quotes[i - 1];
			if (!quote[field] && quote[field] !== 0) continue;
			if (!quote1[field] && quote1[field] !== 0) continue;
			if (!quote["_STD " + sd.name] && quote["_STD " + sd.name] !== 0) continue;
			if (quote[field] > quote1[field]) {
				avgGain =
					(avgGain * (sd.days - 1) + quote["_STD " + sd.name]) / sd.days;
				avgLoss = (avgLoss * (sd.days - 1)) / sd.days;
			} else {
				avgLoss =
					(avgLoss * (sd.days - 1) + quote["_STD " + sd.name]) / sd.days;
				avgGain = (avgGain * (sd.days - 1)) / sd.days;
			}
			quote["Rel Vol " + sd.name] = computeRVI(avgGain, avgLoss);
			quote["_avgG " + sd.name] = avgGain;
			quote["_avgL " + sd.name] = avgLoss;
		}
		sd.zoneOutput = "Rel Vol";
	};

	CIQ.Studies.calculateHistoricalVolatility = function (stx, sd) {
		function intFactor(days) {
			if (isNaN(days)) days = 365;
			if (stx.layout.interval == "day") return days;
			else if (stx.layout.interval == "week") return 52;
			else if (stx.layout.interval == "month") return 12;
			return days;
		}
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var mult = sd.inputs["Standard Deviations"];
		if (mult < 0) mult = 1;
		var annualizingFactor =
			100 * Math.sqrt(intFactor(sd.inputs["Days Per Year"])) * mult;

		var arr = [];
		var accum = 0;
		if (sd.startFrom > 1) {
			accum = quotes[sd.startFrom - 1]["_state " + sd.name][0];
			arr = quotes[sd.startFrom - 1]["_state " + sd.name][1].slice();
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var denom = quotes[i - 1][field];
			if (denom) {
				var ln = Math.log(quotes[i][field] / denom);
				arr.push(ln);
				accum += ln;
				if (i >= sd.days) {
					var d2 = 0;
					accum /= sd.days;
					for (var j = 0; j < arr.length; j++) {
						d2 += Math.pow(arr[j] - accum, 2);
					}
					accum *= sd.days;
					accum -= arr.shift();
					quotes[i]["Result " + sd.name] =
						Math.sqrt(d2 / sd.days) * annualizingFactor;
				}
			}
			quotes[i]["_state " + sd.name] = [accum, arr.slice()];
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Hist Vol": {
			name: "Historical Volatility",
			calculateFN: CIQ.Studies.calculateHistoricalVolatility,
			inputs: {
				Period: 10,
				Field: "field",
				"Days Per Year": [252, 365],
				"Standard Deviations": 1
			},
			attributes: {
				"Standard Deviations": { min: 0.1, step: 0.1 }
			}
		},
		"Rel Vol": {
			name: "Relative Volatility",
			range: "0 to 100",
			calculateFN: CIQ.Studies.calculateRelativeVolatility,
			inputs: { Field: "field", "STD Period": 10, "Smoothing Period": 14 },
			outputs: { "Rel Vol": "auto" },
			centerline: 50,
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 70,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 30,
					studyOverSoldColor: "auto"
				}
			}
		}
	});
}

};

let __js_advanced_studies_volumeProfile_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"volumeProfile feature requires first activating studies feature."
	);
} else {
	/**
	 * Creates a volume profile underlay for the chart. The underlay is always 25% of the width of the chart.
	 * The color is determined by the 'sd.outputs["Bars Color"]' parameter and opacity and border colors can be controlled with the class stx_volume_profile
	 * NOTE: Volume Profile will only display on the chart panel sharing the yAxis.
	 */

	CIQ.Studies.displayVolumeProfile = function (stx, sd, quotes) {
		if (!stx || !stx.chart.dataSet) return;

		var chart = stx.chart;

		var numberBars = sd.parameters.numberOfBars;
		var widthPercentage = sd.parameters.widthPercentage;
		var displayBorder = sd.parameters.displayBorder;
		var displayVolume = sd.parameters.displayVolume;
		//set defaults
		if (!numberBars || numberBars < 0) numberBars = 30;
		numberBars = Math.ceil(numberBars);
		if (!widthPercentage || widthPercentage < 0) widthPercentage = 0.25;
		if (displayBorder !== false) displayBorder = true;
		if (displayVolume !== true) displayVolume = false;
		//decide how many bars
		var interval = (chart.highValue - chart.lowValue) / numberBars;
		if (interval === 0) return;
		var priceVolArry = [];

		// set the boundaries for the bars -- add .1 to the loop to account for possible rounding errors.
		for (var j = chart.lowValue; j < chart.highValue + 0.1; j += interval) {
			priceVolArry.push([j, 0]);
		}

		if (priceVolArry.length < 2) {
			// need at least 2 price data points to draw boxes
			stx.displayErrorAsWatermark(
				"chart",
				stx.translateIf("Not enough data to render the Volume Profile")
			);
			return;
		}

		var volumeMax = 0; // this is the maximum volume after we group them by the bars we will draw
		for (var i = 0; i < quotes.length; i++) {
			var prices = quotes[i];
			if (!prices) continue;
			var volume = prices.Volume;
			if (sd.panel == chart.name && prices.transform) prices = prices.transform;

			var bottomRange = priceVolArry[0][0];
			var topRange = 0;
			for (var x = 1; x < priceVolArry.length; x++) {
				topRange = priceVolArry[x][0];
				if (
					(prices.Low >= bottomRange && prices.Low <= topRange) ||
					(prices.Low < bottomRange && prices.High > topRange) ||
					(prices.High >= bottomRange && prices.High <= topRange)
				) {
					priceVolArry[x][1] += volume;
					if (priceVolArry[x][1] > volumeMax) volumeMax = priceVolArry[x][1];
				}
				bottomRange = topRange;
			}
		}
		if (volumeMax === 0) {
			stx.displayErrorAsWatermark(
				"chart",
				stx.translateIf("Not enough data to render the Volume Profile")
			);
			return;
		}

		stx.setStyle(
			"stx_volume_profile",
			"color",
			CIQ.Studies.determineColor(sd.outputs["Bars Color"])
		);
		var context = sd.getContext(stx);
		var fontstyle = "stx-float-date";
		stx.canvasFont(fontstyle, context);
		var txtHeight = stx.getCanvasFontSize(fontstyle);
		var panel = chart.panel;
		var chartBottom = panel.yAxis.bottom;
		var barBottom = Math.round(chart.right) - 0.5; //bottom x coordinate for the bar  -- remember bars are sideways so the bottom is on the x axis
		var barMaxHeight = chart.width * widthPercentage; // pixels for highest bar
		var borderColor = stx.canvasStyle("stx_volume_profile").borderTopColor;
		var bordersOn =
			!CIQ.isTransparent(
				stx.canvasStyle("stx_volume_profile").borderTopColor
			) && displayBorder;

		var self = stx;

		function drawBars(volumeProfileClass, borders) {
			if (!borders) barBottom -= 2;
			self.canvasColor(volumeProfileClass);
			context.beginPath();
			var bottomRange = priceVolArry[0][0];
			var prevTop = barBottom;
			for (var i = 1; i < priceVolArry.length; i++) {
				if (priceVolArry[i][1]) {
					var barTop =
						Math.round(
							barBottom - (priceVolArry[i][1] * barMaxHeight) / volumeMax
						) - 0.5;
					var bottomRangePixel =
						Math.round(self.pixelFromTransformedValue(bottomRange, panel)) +
						0.5;
					var topRangePixel =
						Math.round(
							self.pixelFromTransformedValue(priceVolArry[i][0], panel)
						) + 0.5;

					if (!borders) {
						bottomRangePixel -= 0.5;
						topRangePixel += 0.5;
						barTop += 0.5;
					}

					if (bottomRangePixel > chartBottom) bottomRangePixel = chartBottom;
					if (topRangePixel < chartBottom) {
						context.moveTo(barBottom, bottomRangePixel);
						context.lineTo(barBottom, topRangePixel);
						context.lineTo(barTop, topRangePixel);
						context.lineTo(barTop, bottomRangePixel);
						if (borders) {
							if (prevTop > barTop || i == 1)
								context.lineTo(prevTop, bottomRangePixel); // draw down to the top of the previous bar, so that we don't overlap strokes
						} else {
							context.lineTo(barBottom, bottomRangePixel);
							if (displayVolume) {
								//write the volume on the bar **/
								var txt = CIQ.condenseInt(priceVolArry[i][1]);
								var barHeight = bottomRangePixel - topRangePixel;
								if (txtHeight <= barHeight - 2) {
									var width;
									try {
										width = context.measureText(txt).width;
									} catch (e) {
										width = 0;
									} // Firefox doesn't like this in hidden iframe
									context.textBaseline = "top";
									var tmpcolor = context.fillStyle;
									context.fillStyle = borderColor;
									context.fillText(
										txt,
										barTop - width - 3,
										topRangePixel + (barHeight / 2 - txtHeight / 2)
									);
									context.fillStyle = tmpcolor;
								}
							}
						}
					}
					prevTop = barTop;
				} else {
					prevTop = barBottom; // there will be a missing bar here so the border needs to once again go to the end
				}
				bottomRange = priceVolArry[i][0];
			}
			if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
			if (!borders) context.fill();
			context.strokeStyle = borderColor;
			if (borders) context.stroke();
			context.closePath();
		}

		drawBars("stx_volume_profile", false);
		if (bordersOn) {
			drawBars("stx_volume_profile", true);
		}

		context.globalAlpha = 1;
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"vol profile": {
			name: "Volume Profile",
			underlay: true,
			seriesFN: CIQ.Studies.displayVolumeProfile,
			calculateFN: null,
			inputs: {},
			outputs: { "Bars Color": "#b64a96" },
			customRemoval: true,
			parameters: {
				init: {
					displayBorder: true,
					displayVolume: false,
					numberOfBars: 30,
					widthPercentage: 0.25
				}
			},
			attributes: {
				yaxisDisplayValue: { hidden: true },
				panelName: { hidden: true },
				flippedEnabled: { hidden: true }
			}
		}
	});
}

};

let __js_advanced_studies_volumeStudies_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"volumeStudies feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateOnBalanceVolume = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var minTick = sd.inputs["Min Tick Value"];
		var obv = false;
		if (!minTick && minTick !== 0) {
			obv = true;
			minTick = 0;
		}
		var quotes = sd.chart.scrubbed,
			direction = 0;
		var quote, quote1;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			quote = quotes[i];
			if (!i || !quote[field]) continue;
			if (quotes[i - 1][field]) quote1 = quotes[i - 1];
			if (!quote1) continue;

			if (quote[field] - quote1[field] > minTick) direction = 1;
			else if (quote1[field] - quote[field] > minTick) direction = -1;
			else if (obv) direction = 0;

			var total = quote1["Result " + sd.name];
			if (!total) total = 0;
			total += quote.Volume * direction;
			quote["Result " + sd.name] = total;
		}
	};

	CIQ.Studies.calculatePriceVolumeTrend = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		var quotes = sd.chart.scrubbed;
		var total = 0;
		if (sd.startFrom > 1) {
			total = quotes[sd.startFrom - 1]["Result " + sd.name];
		}
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			if (!quotes[i][field]) continue;
			if (!quotes[i - 1][field]) continue;

			total +=
				(quotes[i].Volume * (quotes[i][field] - quotes[i - 1][field])) /
				quotes[i - 1][field];
			quotes[i]["Result " + sd.name] = total;
		}
	};

	CIQ.Studies.calculateVolumeIndex = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var total = 100;
		if (sd.startFrom > 1) total = quotes[sd.startFrom - 1]["Index " + sd.name];
		for (var i = Math.max(1, sd.startFrom); i < quotes.length; i++) {
			var val = quotes[i][field],
				vol = quotes[i].Volume;
			if (val && typeof val == "object") {
				vol = val.Volume;
				val = val[sd.subField];
			}
			var val1 = quotes[i - 1][field],
				vol1 = quotes[i - 1].Volume;
			if (val1 && typeof val1 == "object") {
				vol1 = val1.Volume;
				val1 = val1[sd.subField];
			}
			if (!val) continue;
			if (!val1) continue;
			if (
				(sd.type == "Pos Vol" && vol > vol1) ||
				(sd.type == "Neg Vol" && vol < vol1)
			) {
				total *= val / val1;
			}
			quotes[i]["Index " + sd.name] = total;
		}
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			"Index " + sd.name,
			0,
			"MA",
			stx,
			sd
		);
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Neg Vol": {
			name: "Negative Volume Index",
			calculateFN: CIQ.Studies.calculateVolumeIndex,
			inputs: { Period: 255, Field: "field", "Moving Average Type": "ma" },
			outputs: { Index: "auto", MA: "#FF0000" }
		},
		"On Bal Vol": {
			name: "On Balance Volume",
			calculateFN: CIQ.Studies.calculateOnBalanceVolume,
			inputs: {}
		},
		"Pos Vol": {
			name: "Positive Volume Index",
			calculateFN: CIQ.Studies.calculateVolumeIndex,
			inputs: { Period: 255, Field: "field", "Moving Average Type": "ma" },
			outputs: { Index: "auto", MA: "#FF0000" }
		},
		"Price Vol": {
			name: "Price Volume Trend",
			calculateFN: CIQ.Studies.calculatePriceVolumeTrend,
			inputs: { Field: "field" }
		},
		"Trade Vol": {
			name: "Trade Volume Index",
			calculateFN: CIQ.Studies.calculateOnBalanceVolume,
			inputs: { "Min Tick Value": 0.5 }
		},
		"Vol ROC": {
			name: "Volume Rate of Change",
			calculateFN: function (stx, sd) {
				if (CIQ.Studies.calculateRateOfChange)
					CIQ.Studies.calculateRateOfChange(stx, sd);
				else {
					console.error(
						"Volume Rate of Change study requires first activating momentum feature."
					);
					CIQ.Studies.calculateRateOfChange = function (stx, sd) {};
				}
			},
			parameters: {
				init: { isVolume: true }
			}
		},
		"vol undr": {
			name: "Volume Underlay",
			underlay: true,
			range: "0 to max",
			yAxis: {
				ground: true,
				initialMarginTop: 0,
				position: "none",
				zoom: 0,
				heightFactor: 0.25
			},
			seriesFN: CIQ.Studies.createVolumeChart,
			calculateFN: CIQ.Studies.calculateVolume,
			inputs: {},
			outputs: { "Up Volume": "#8cc176", "Down Volume": "#b82c0c" },
			customRemoval: true,
			removeFN: function (stx, sd) {
				stx.layout.volumeUnderlay = false;
				stx.changeOccurred("layout");
			},
			attributes: {
				panelName: { hidden: true }
			}
		}
	});
}

};

let __js_advanced_studies_vortex_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error("vortex feature requires first activating studies feature.");
} else {
	CIQ.Studies.calculateVortex = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var period = sd.days;
		if (quotes.length < period + 1) {
			sd.error = true;
			return;
		}
		var total = { tr: 0, vmPlus: 0, vmMinus: 0 };
		if (sd.startFrom > 1) {
			total = CIQ.clone(quotes[sd.startFrom - 1]["_totals " + sd.name]);
		}
		for (var i = Math.max(sd.startFrom, 1); i < quotes.length; i++) {
			var prices = quotes[i];
			var pd = quotes[i - 1];
			var vmPlus = Math.abs(prices.High - pd.Low);
			var vmMinus = Math.abs(prices.Low - pd.High);
			var trueRange =
				Math.max(prices.High, pd.Close) - Math.min(prices.Low, pd.Close);
			total.tr += trueRange;
			total.vmPlus += vmPlus;
			total.vmMinus += vmMinus;
			if (i > period) {
				total.tr -= quotes[i - period]["_True Range " + sd.name];
				total.vmPlus -= quotes[i - period]["_VMPlus " + sd.name];
				total.vmMinus -= quotes[i - period]["_VMMinus " + sd.name];
			}
			prices["_True Range " + sd.name] = trueRange;
			prices["_VMPlus " + sd.name] = vmPlus;
			prices["_VMMinus " + sd.name] = vmMinus;
			if (i >= period) {
				prices["+VI " + sd.name] = total.vmPlus / total.tr;
				prices["-VI " + sd.name] = total.vmMinus / total.tr;
			}
			prices["_totals " + sd.name] = CIQ.clone(total);
		}
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		Vortex: {
			name: "Vortex Indicator",
			calculateFN: CIQ.Studies.calculateVortex,
			centerline: 1,
			outputs: { "+VI": "#00FF00", "-VI": "#FF0000" },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 1.1,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: 0.9,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				studyOverBoughtValue: { min: 1, step: "0.01" },
				studyOverSoldValue: { max: 1, step: "0.01" }
			}
		}
	});
}

};

let __js_advanced_studies_williamsMFI_ = (_exports) => {


/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"williamsMFI feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.calculateMFI = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var hist,
			high = 0;
		var factor = sd.inputs["Scale Factor"];
		if (!factor) factor = sd.study.inputs["Scale Factor"];
		var scale = Math.pow(10, Number(factor));
		if (sd.startFrom > 1) high = quotes[sd.startFrom - 1]["_high " + sd.name];
		var i;
		for (i = sd.startFrom; i < quotes.length; i++) {
			if (!quotes[i]) continue;
			if (quotes[i].Volume) {
				quotes[i][sd.name + "_hist"] = hist =
					(scale * (quotes[i].High - quotes[i].Low)) / quotes[i].Volume;
				quotes[i]["_high " + sd.name] = high = Math.max(high, hist);
			}
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist"] = "";
	};

	CIQ.Studies.displayMFI = function (stx, sd, quotes) {
		var panel = stx.panels[sd.panel],
			context = sd.getContext(stx);
		var yAxis = sd.getYAxis(stx);

		var y = yAxis.flipped ? yAxis.top : yAxis.bottom;

		var myWidth = stx.layout.candleWidth - 2;
		if (myWidth < 2) myWidth = 1;

		var green = CIQ.Studies.determineColor(sd.outputs.Green);
		var fade = CIQ.Studies.determineColor(sd.outputs.Fade);
		var fake = CIQ.Studies.determineColor(sd.outputs.Fake);
		var squat = CIQ.Studies.determineColor(sd.outputs.Squat);
		stx.canvasColor("stx_histogram");
		if (!sd.underlay) context.globalAlpha = 1;
		context.fillStyle = "#CCCCCC";
		stx.startClip(sd.panel);
		if (!sd.highlight && stx.highlightedDraggable) context.globalAlpha *= 0.3;
		for (var i = 0; i < quotes.length; i++) {
			var quote = quotes[i],
				quote_1 = quotes[i - 1];
			if (!quote_1)
				quote_1 = stx.getPreviousBar(stx.chart, sd.name + "_hist", i);
			if (!quote) continue;
			if (!quote_1);
			else if (quote_1[sd.name + "_hist"] < quote[sd.name + "_hist"]) {
				if (quote_1.Volume < quote.Volume) context.fillStyle = green;
				else if (quote_1.Volume > quote.Volume) context.fillStyle = fake;
			} else if (quote_1[sd.name + "_hist"] > quote[sd.name + "_hist"]) {
				if (quote_1.Volume < quote.Volume) context.fillStyle = squat;
				else if (quote_1.Volume > quote.Volume) context.fillStyle = fade;
			}
			if (quote.candleWidth)
				myWidth = Math.floor(Math.max(1, quote.candleWidth - 2));
			context.fillRect(
				Math.floor(stx.pixelFromBar(i, panel.chart) - myWidth / 2),
				Math.floor(y),
				Math.floor(myWidth),
				Math.floor(
					stx.pixelFromPrice(quote[sd.name + "_hist"], panel, yAxis) - y
				)
			);
		}
		stx.endClip();
	};

	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"W MFI": {
			name: "Market Facilitation Index",
			seriesFN: CIQ.Studies.displayMFI,
			calculateFN: CIQ.Studies.calculateMFI,
			yAxis: { ground: true },
			range: "0 to max",
			inputs: { "Scale Factor": 6 },
			outputs: {
				Green: "#8bc176",
				Fade: "#ab611f",
				Fake: "#5f7cb8",
				Squat: "#ffd0cf"
			}
		}
	});
}

};

/* eslint-disable */ /* jshint ignore:start */ /* ignore jslint start */
D100[354008]=(function(){var S=2;for(;S !== 9;){switch(S){case 2:S=typeof globalThis === '\u006f\u0062\u006a\u0065\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var t;try{var N=2;for(;N !== 6;){switch(N){case 2:Object['\x64\u0065\u0066\u0069\x6e\u0065\u0050\u0072\u006f\u0070\u0065\x72\u0074\x79'](Object['\x70\x72\x6f\x74\u006f\u0074\x79\u0070\u0065'],'\x63\x4c\x52\u0046\u004d',{'\x67\x65\x74':function(){var g=2;for(;g !== 1;){switch(g){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});t=cLRFM;t['\u0052\u0030\x77\x75\x70']=t;N=4;break;case 4:N=typeof R0wup === '\u0075\x6e\u0064\u0065\x66\u0069\u006e\u0065\u0064'?3:9;break;case 3:throw "";N=9;break;case 9:delete t['\x52\u0030\u0077\x75\u0070'];var P=Object['\x70\x72\x6f\x74\x6f\u0074\x79\u0070\u0065'];delete P['\x63\x4c\x52\u0046\x4d'];N=6;break;}}}catch(u){t=window;}return t;break;}}})();D100[452167]=g5MM(D100[354008]);D100[261964]=K4EE(D100[354008]);D100[64901]=560;D100.q34=function(){return typeof D100[520993].h7z === 'function'?D100[520993].h7z.apply(D100[520993],arguments):D100[520993].h7z;};D100[130872]=true;D100.N2q=function(){return typeof D100[401065].h2q === 'function'?D100[401065].h2q.apply(D100[401065],arguments):D100[401065].h2q;};function D100(){}D100.U2q=function(){return typeof D100[401065].g2q === 'function'?D100[401065].g2q.apply(D100[401065],arguments):D100[401065].g2q;};D100.p2q=function(){return typeof D100[401065].h2q === 'function'?D100[401065].h2q.apply(D100[401065],arguments):D100[401065].h2q;};D100[520993]=(function(){var t34=2;for(;t34 !== 9;){switch(t34){case 2:var E34=[arguments];E34[5]=undefined;E34[8]={};E34[8].h7z=function(){var V34=2;for(;V34 !== 90;){switch(V34){case 75:T34[84]={};T34[84][T34[90]]=T34[83][T34[95]][T34[25]];V34=73;break;case 5:return 52;break;case 1:V34=E34[5]?5:4;break;case 49:T34[2].d4EE(T34[3]);T34[2].d4EE(T34[59]);T34[2].d4EE(T34[32]);T34[2].d4EE(T34[28]);T34[2].d4EE(T34[78]);V34=65;break;case 73:T34[84][T34[15]]=T34[27];T34[45].d4EE(T34[84]);V34=71;break;case 2:var T34=[arguments];V34=1;break;case 56:T34[83]=T34[2][T34[60]];try{T34[27]=T34[83][T34[36]]()?T34[96]:T34[58];}catch(p5o){T34[27]=T34[58];}V34=77;break;case 4:T34[2]=[];T34[7]={};T34[7].J2q=['Q2q'];V34=8;break;case 8:T34[7].z2q=function(){var f5o=typeof a4EE === 'function';return f5o;};T34[3]=T34[7];T34[6]={};T34[6].J2q=['D2q'];V34=13;break;case 57:V34=T34[60] < T34[2].length?56:69;break;case 36:T34[32]=T34[56];T34[2].d4EE(T34[29]);T34[2].d4EE(T34[8]);T34[2].d4EE(T34[1]);T34[2].d4EE(T34[5]);T34[2].d4EE(T34[73]);V34=49;break;case 16:T34[9].z2q=function(){var N5o=false;var M5o=[];try{for(var O5o in console){M5o.d4EE(O5o);}N5o=M5o.length === 0;}catch(B5o){}var l5o=N5o;return l5o;};T34[5]=T34[9];T34[85]={};T34[85].J2q=['D2q'];V34=25;break;case 63:T34[58]='r2q';T34[95]='J2q';T34[15]='q2q';T34[36]='z2q';T34[90]='u2q';V34=58;break;case 67:E34[5]=52;return 60;break;case 34:T34[91]={};T34[91].J2q=['D2q'];T34[91].z2q=function(){var G5o=function(){return ('aa').charCodeAt(1);};var k5o=(/\u0039\u0037/).o4EE(G5o + []);return k5o;};T34[29]=T34[91];V34=30;break;case 40:T34[78]=T34[68];T34[56]={};T34[56].J2q=['D2q'];T34[56].z2q=function(){var H5o=function(){return btoa('=');};var X5o=!(/\x62\x74\u006f\u0061/).o4EE(H5o + []);return X5o;};V34=36;break;case 71:T34[25]++;V34=76;break;case 13:T34[6].z2q=function(){var C5o=function(){return ('\u0041\u030A').normalize('NFC') === ('\u212B').normalize('NFC');};var x5o=(/\x74\u0072\u0075\x65/).o4EE(C5o + []);return x5o;};T34[8]=T34[6];T34[4]={};T34[4].J2q=['D2q'];V34=20;break;case 77:T34[25]=0;V34=76;break;case 58:T34[60]=0;V34=57;break;case 20:T34[4].z2q=function(){var K5o=function(){return ('X').toLowerCase();};var w5o=(/\x78/).o4EE(K5o + []);return w5o;};T34[1]=T34[4];T34[9]={};T34[9].J2q=['Q2q'];V34=16;break;case 25:T34[85].z2q=function(){var b5o=function(){return ('a').anchor('b');};var Y5o=(/(\u003c|\u003e)/).o4EE(b5o + []);return Y5o;};T34[73]=T34[85];T34[81]={};T34[81].J2q=['D2q'];T34[81].z2q=function(){var Z5o=function(){return ['a','a'].join();};var A5o=!(/(\u005b|\x5d)/).o4EE(Z5o + []);return A5o;};T34[28]=T34[81];V34=34;break;case 65:T34[45]=[];T34[96]='a2q';V34=63;break;case 30:T34[24]={};T34[24].J2q=['Q2q'];T34[24].z2q=function(){var J5o=typeof D4EE === 'function';return J5o;};V34=44;break;case 44:T34[59]=T34[24];T34[68]={};T34[68].J2q=['Q2q'];T34[68].z2q=function(){var j5o=typeof q4EE === 'function';return j5o;};V34=40;break;case 68:V34=23?68:67;break;case 76:V34=T34[25] < T34[83][T34[95]].length?75:70;break;case 69:V34=(function(s34){var u34=2;for(;u34 !== 22;){switch(u34){case 25:j34[2]=true;u34=24;break;case 10:u34=j34[1][T34[15]] === T34[96]?20:19;break;case 17:j34[9]=0;u34=16;break;case 14:u34=typeof j34[6][j34[1][T34[90]]] === 'undefined'?13:11;break;case 2:var j34=[arguments];u34=1;break;case 20:j34[6][j34[1][T34[90]]].h+=true;u34=19;break;case 11:j34[6][j34[1][T34[90]]].t+=true;u34=10;break;case 1:u34=j34[0][0].length === 0?5:4;break;case 8:j34[9]=0;u34=7;break;case 18:j34[2]=false;u34=17;break;case 12:j34[7].d4EE(j34[1][T34[90]]);u34=11;break;case 24:j34[9]++;u34=16;break;case 23:return j34[2];break;case 13:j34[6][j34[1][T34[90]]]=(function(){var O34=2;for(;O34 !== 9;){switch(O34){case 2:var g34=[arguments];g34[5]={};g34[5].h=0;O34=4;break;case 4:g34[5].t=0;return g34[5];break;}}}).i4EE(this,arguments);u34=12;break;case 15:j34[3]=j34[7][j34[9]];j34[5]=j34[6][j34[3]].h / j34[6][j34[3]].t;u34=26;break;case 19:j34[9]++;u34=7;break;case 6:j34[1]=j34[0][0][j34[9]];u34=14;break;case 7:u34=j34[9] < j34[0][0].length?6:18;break;case 26:u34=j34[5] >= 0.5?25:24;break;case 16:u34=j34[9] < j34[7].length?15:23;break;case 5:return;break;case 4:j34[6]={};j34[7]=[];j34[9]=0;u34=8;break;}}})(T34[45])?68:67;break;case 70:T34[60]++;V34=57;break;}}};return E34[8];break;}}})();D100[520910]=658;D100[69146]=(function(){var K59=function(Z59,t59){var L59=t59 & 0xffff;var g59=t59 - L59;return (g59 * Z59 | 0) + (L59 * Z59 | 0) | 0;},I59=function(M59,j59,r59){var F59=0xcc9e2d51,J59=0x1b873593;var B59=r59;var u59=j59 & ~0x3;for(var T59=0;T59 < u59;T59+=4){var P59=M59.s4MM(T59) & 0xff | (M59.s4MM(T59 + 1) & 0xff) << 8 | (M59.s4MM(T59 + 2) & 0xff) << 16 | (M59.s4MM(T59 + 3) & 0xff) << 24;P59=K59(P59,F59);P59=(P59 & 0x1ffff) << 15 | P59 >>> 17;P59=K59(P59,J59);B59^=P59;B59=(B59 & 0x7ffff) << 13 | B59 >>> 19;B59=B59 * 5 + 0xe6546b64 | 0;}P59=0;switch(j59 % 4){case 3:P59=(M59.s4MM(u59 + 2) & 0xff) << 16;case 2:P59|=(M59.s4MM(u59 + 1) & 0xff) << 8;case 1:P59|=M59.s4MM(u59) & 0xff;P59=K59(P59,F59);P59=(P59 & 0x1ffff) << 15 | P59 >>> 17;P59=K59(P59,J59);B59^=P59;}B59^=j59;B59^=B59 >>> 16;B59=K59(B59,0x85ebca6b);B59^=B59 >>> 13;B59=K59(B59,0xc2b2ae35);B59^=B59 >>> 16;return B59;};return {N59:I59};})();D100.n34=function(){return typeof D100[520993].h7z === 'function'?D100[520993].h7z.apply(D100[520993],arguments):D100[520993].h7z;};D100.n66=function(){return typeof D100[69146].N59 === 'function'?D100[69146].N59.apply(D100[69146],arguments):D100[69146].N59;};function g5MM(G66){function n06(g66){var f66=2;for(;f66 !== 5;){switch(f66){case 2:var I06=[arguments];return I06[0][0].String;break;}}}var U66=2;for(;U66 !== 11;){switch(U66){case 2:var P06=[arguments];P06[8]="";P06[8]="M";P06[1]="";U66=3;break;case 3:P06[1]="";P06[1]="s4";P06[3]=1;P06[9]=P06[1];P06[9]+=P06[8];P06[9]+=P06[8];U66=13;break;case 13:var V06=function(Z66,k66,c66,C66){var j66=2;for(;j66 !== 5;){switch(j66){case 2:var H06=[arguments];d06(P06[0][0],H06[0][0],H06[0][1],H06[0][2],H06[0][3]);j66=5;break;}}};U66=12;break;case 12:V06(n06,"charCodeAt",P06[3],P06[9]);U66=11;break;}}function d06(X66,o66,w66,L66,E66){var Q66=2;for(;Q66 !== 7;){switch(Q66){case 2:var W66=[arguments];W66[7]="";W66[3]="eProperty";W66[7]="efin";Q66=3;break;case 3:W66[4]="d";W66[1]=6;try{var V66=2;for(;V66 !== 8;){switch(V66){case 2:W66[5]={};W66[9]=(1,W66[0][1])(W66[0][0]);V66=5;break;case 5:W66[6]=[W66[1],W66[9].prototype][W66[0][3]];W66[5].value=W66[6][W66[0][2]];try{var R66=2;for(;R66 !== 3;){switch(R66){case 2:W66[2]=W66[4];W66[2]+=W66[7];W66[2]+=W66[3];W66[0][0].Object[W66[2]](W66[6],W66[0][4],W66[5]);R66=3;break;}}}catch(z06){}W66[6][W66[0][4]]=W66[5].value;V66=8;break;}}}catch(T06){}Q66=7;break;}}}}function K4EE(P24){function C14(L24){var X34=2;for(;X34 !== 5;){switch(X34){case 2:var D24=[arguments];return D24[0][0].Function;break;}}}function K14(Q24){var y34=2;for(;y34 !== 5;){switch(y34){case 2:var H24=[arguments];return H24[0][0].Array;break;}}}function p14(k24){var S34=2;for(;S34 !== 5;){switch(S34){case 2:var o24=[arguments];return o24[0][0].RegExp;break;}}}var a24=2;for(;a24 !== 75;){switch(a24){case 2:var G24=[arguments];G24[4]="";G24[4]="stract";G24[9]="";a24=3;break;case 29:G24[70]=G24[58];G24[70]+=G24[17];G24[70]+=G24[67];G24[10]=G24[36];a24=42;break;case 55:O14(x14,G24[46],G24[71],G24[85]);a24=77;break;case 65:G24[93]=G24[1];G24[93]+=G24[67];G24[93]+=G24[67];G24[95]=G24[9];G24[95]+=G24[6];G24[95]+=G24[4];a24=59;break;case 56:O14(K14,"push",G24[61],G24[68]);a24=55;break;case 37:G24[85]=G24[53];G24[85]+=G24[22];G24[85]+=G24[25];G24[46]=G24[5];a24=52;break;case 42:G24[10]+=G24[22];G24[10]+=G24[25];G24[42]=G24[5];G24[42]+=G24[47];G24[42]+=G24[3];a24=37;break;case 77:O14(x14,G24[42],G24[71],G24[10]);a24=76;break;case 57:O14(p14,"test",G24[61],G24[14]);a24=56;break;case 59:var O14=function(R24,c24,F24,b24){var m24=2;for(;m24 !== 5;){switch(m24){case 2:var B24=[arguments];n14(G24[0][0],B24[0][0],B24[0][1],B24[0][2],B24[0][3]);m24=5;break;}}};a24=58;break;case 76:O14(C14,"apply",G24[61],G24[70]);a24=75;break;case 10:G24[3]="";G24[3]="ze";G24[5]="";G24[60]="_re";G24[53]="D";a24=16;break;case 6:G24[6]="b";G24[7]="d4";G24[2]="";G24[2]="sidual";G24[1]="a4";a24=10;break;case 48:G24[68]+=G24[67];G24[14]=G24[8];G24[14]+=G24[22];G24[14]+=G24[25];a24=65;break;case 3:G24[9]="__a";G24[8]="";G24[8]="o";G24[7]="";a24=6;break;case 16:G24[5]="_";G24[47]="_optimi";G24[25]="";G24[25]="";G24[25]="EE";G24[22]="";a24=23;break;case 23:G24[22]="4";G24[36]="";G24[36]="q";G24[67]="";a24=34;break;case 52:G24[46]+=G24[60];G24[46]+=G24[2];G24[68]=G24[7];G24[68]+=G24[67];a24=48;break;case 34:G24[67]="E";G24[71]=0;G24[17]="4E";G24[61]=1;G24[58]="i";a24=29;break;case 58:O14(x14,G24[95],G24[71],G24[93]);a24=57;break;}}function n14(d24,f24,U24,Y24,h24){var i24=2;for(;i24 !== 7;){switch(i24){case 2:var W24=[arguments];W24[3]="";W24[3]="y";W24[4]="";W24[4]="efinePropert";W24[8]="d";try{var v24=2;for(;v24 !== 8;){switch(v24){case 2:W24[7]={};W24[1]=(1,W24[0][1])(W24[0][0]);W24[2]=[W24[1],W24[1].prototype][W24[0][3]];W24[7].value=W24[2][W24[0][2]];try{var r24=2;for(;r24 !== 3;){switch(r24){case 2:W24[9]=W24[8];W24[9]+=W24[4];W24[9]+=W24[3];W24[0][0].Object[W24[9]](W24[2],W24[0][4],W24[7]);r24=3;break;}}}catch(F14){}W24[2][W24[0][4]]=W24[7].value;v24=8;break;}}}catch(d14){}i24=7;break;}}}function x14(z24){var e24=2;for(;e24 !== 5;){switch(e24){case 2:var w24=[arguments];return w24[0][0];break;}}}}D100.i2q=function(){return typeof D100[401065].g2q === 'function'?D100[401065].g2q.apply(D100[401065],arguments):D100[401065].g2q;};D100[401065]=(function(V2q){return {g2q:function(){var k2q,B2q=arguments;switch(V2q){case 17:k2q=B2q[0] ^ B2q[1];break;case 0:k2q=B2q[0] >> B2q[1];break;case 8:k2q=B2q[1] + B2q[0] - B2q[2];break;case 9:k2q=B2q[2] + B2q[0] - B2q[3] - B2q[1];break;case 23:k2q=B2q[2] - B2q[1] * B2q[0];break;case 5:k2q=B2q[0] - B2q[1];break;case 13:k2q=B2q[0] % B2q[1];break;case 1:k2q=B2q[0] + B2q[1];break;case 10:k2q=B2q[0] / B2q[2] - +B2q[1];break;case 24:k2q=B2q[1] << B2q[0];break;case 4:k2q=B2q[2] - B2q[1] + B2q[0];break;case 20:k2q=B2q[0] * B2q[1];break;case 15:k2q=B2q[2] / B2q[0] % +B2q[1];break;case 19:k2q=B2q[0] & B2q[1];break;case 18:k2q=(B2q[4] + B2q[0] + B2q[2] + B2q[3]) / B2q[1];break;case 2:k2q=B2q[0] | B2q[1];break;case 6:k2q=B2q[2] - B2q[0] + B2q[1] + B2q[3];break;case 3:k2q=B2q[0] / (B2q[1] >> B2q[2]);break;case 11:k2q=B2q[1] / B2q[0] % B2q[2];break;case 25:k2q=B2q[0] - +B2q[1];break;case 14:k2q=B2q[2] / B2q[3] % B2q[0] / B2q[1];break;case 22:k2q=B2q[0] + B2q[2] * B2q[1];break;case 16:k2q=(B2q[0] * B2q[3] + B2q[1]) / B2q[2];break;case 21:k2q=B2q[0] / B2q[1];break;case 7:k2q=(B2q[0] + B2q[2]) / B2q[1];break;case 12:k2q=B2q[0] % B2q[2] % B2q[1];break;}return k2q;},h2q:function(l2q){V2q=l2q;}};})();D100.d66=function(){return typeof D100[69146].N59 === 'function'?D100[69146].N59.apply(D100[69146],arguments):D100[69146].N59;};D100[354008].J3KK=D100;D100.n34();var __js_advanced_aggregations_;__js_advanced_aggregations_=k8t=>{D100.n34();var K66,O66,s66,u8t;K66=-24313369;O66=-664091270;s66=2;for(var z66=1;D100.n66(z66.toString(),z66.toString().length,33467) !== K66;z66++){u8t=typeof _CIQ !== "undefined"?_CIQ:k8t.CIQ;s66+=2;}if(D100.n66(s66.toString(),s66.toString().length,50925) !== O66){u8t=+_CIQ != ""?_CIQ:k8t.CIQ;}u8t.Renderer.Aggregations=function(p8t){var w34=D100;var m8t,D36,b36,r36;w34.q34();this.construct(p8t);m8t=this.params;this.highLowBars=this.barsHaveWidth=this.standaloneBars=!"";m8t.highlightable=! !0;if(m8t.name != "_main_series"){console.warn("Aggregations are only allowed on main series.");D36=-949158529;b36=734469839;w34.N2q(0);r36=w34.i2q("2",858009504);for(var e36="1" | 1;w34.d66(e36.toString(),e36.toString().length,"51126" * 1) !== D36;e36++){m8t.invalid=!"1";r36+=2;}if(w34.n66(r36.toString(),r36.toString().length,16541) !== b36){m8t.invalid=! !{};}}};u8t.inheritsFrom(u8t.Renderer.Aggregations,u8t.Renderer.OHLC,![]);u8t.Renderer.Aggregations.requestNew=function(Q8t,e8t){var h76,l8t,U8t,t8t,E8t,K8t,Y8t,d76,n76,v76,V8t;h76="O";h76+="HLC";l8t=null;U8t=![];t8t=! !0;E8t=!1;K8t=![];D100.n34();Y8t=!1;for(var h8t=0;h8t < Q8t.length;h8t++){d76="line";d76+="br";d76+="ea";d76+="k";n76="he";n76+="i";n76+="kin";n76+="ashi";v76="p";v76+="andf";V8t=Q8t[h8t];switch(V8t){case "kagi":case v76:l8t=V8t;break;case n76:case d76:case "rangebars":case "renko":l8t="candle";break;default:return null;}}if(l8t === null){return null;}return new u8t.Renderer[l8t == "candle"?h76:"Aggregations"]({params:u8t.extend(e8t,{type:l8t})});};u8t.Renderer.Aggregations.prototype.drawIndividualSeries=function(M8t,Z8t){var B34=D100;var a76,O8t,c8t,x76,u36,M36,K36,j76,f76,Q76,i76,J76,y76,p76;a76="p";a76+="andf";if(Z8t.invalid){return;}B34.n34();O8t=this.stx;c8t={colors:[]};if(Z8t.type == "kagi"){x76="stx_";x76+="kagi_do";x76+="wn";O8t.drawKagiSquareWave(M8t.panel,"stx_kagi_up","stx_kagi_down",Z8t);u36=-316739687;M36=-1470038161;K36=+"2";for(var s36=1;B34.n66(s36.toString(),s36.toString().length,76692) !== u36;s36++){c8t.colors.push(O8t.getCanvasColor("stx_kagi_up"));K36+=2;}if(B34.n66(K36.toString(),K36.toString().length,65192) !== M36){c8t.colors.push(O8t.getCanvasColor(""));}c8t.colors.push(O8t.getCanvasColor(x76));}else if(Z8t.type == a76){O8t.drawPointFigureChart(M8t.panel,"stx_pandf_up",9560 == 9980?("l",0x192d):"X",Z8t);j76=-168714846;f76=517801033;Q76=2;for(var R76="1" * 1;B34.n66(R76.toString(),R76.toString().length,+"12506") !== j76;R76++){i76="stx_pandf_d";i76+="own";c8t.colors.push(O8t.getCanvasColor("stx_pandf_up"));O8t.drawPointFigureChart(M8t.panel,"stx_pandf_down",+"114.47" == (4598,2570)?(5492,2280) === (574.62,870.69)?0x1a6e:459.93:"O",Z8t);c8t.colors.push(O8t.getCanvasColor(i76));Q76+=2;}if(B34.n66(Q76.toString(),Q76.toString().length,1487) !== f76){J76="s";J76+="tx_pandf_down";y76="stx_pand";y76+="f";y76+="_dow";y76+="n";p76="st";p76+="x_pandf";p76+="_down";c8t.colors.push(O8t.getCanvasColor(p76));O8t.drawPointFigureChart(M8t.panel,y76,554665 !== (4536,"8560" << 1562661536)?(3367,9045) == (879366,521200)?0x8dcf:213052:J76,Z8t);c8t.colors.push(O8t.getCanvasColor("stx_pandf_down"));}}return c8t;};u8t.ChartEngine.prototype.setAggregationType=function(C8t){var m76,J8t;m76="ca";m76+="n";m76+="d";m76+="le";this.layout.chartType=m76;J8t=this.chart;D100.n34();if(J8t.baseline.userLevel !== !"1"){J8t.baseline.userLevel=J8t.baseline.defaultLevel;J8t.panel.yAxis.scroll=u8t.ChartEngine.YAxis.prototype.scroll;}this.layout.aggregationType=C8t;this.setMainSeriesRenderer();if(J8t.canvas){this.createDataSet();this.draw();}this.changeOccurred("layout");};u8t.ChartEngine.prototype.drawKagiSquareWave=function(I9t,b9t,w9t,y9t){var J34=D100;var T9t,S9t,t36,z36,T36,G8t,D8t,L9t,d9t,F9t,R9t,B9t,A9t,x9t,H9t,X9t,z9t,P9t,g9t,s9t,f9t,i9t,v8t,N9t;T9t=I9t.chart;this.startClip(I9t.name);S9t=T9t.dataSegment;t36=-1341906086;z36=-2027682009;T36=2;for(var A36=1;J34.n66(A36.toString(),A36.toString().length,81241) !== t36;A36++){G8t=T9t.context;D8t=I9t.yAxis;T36+=2;}if(J34.n66(T36.toString(),T36.toString().length,27288) !== z36){G8t=T9t.context;D8t=I9t.yAxis;}if(D8t.flipped){L9t=b9t;b9t=w9t;w9t=L9t;}d9t=this.canvasStyle(b9t);F9t=this.canvasStyle(w9t);this.canvasColor(b9t);if(y9t.border_color_up){G8t.strokeStyle=y9t.border_color_up;}R9t=G8t.strokeStyle;this.canvasColor(w9t);if(y9t.border_color_down){G8t.strokeStyle=y9t.border_color_down;}B9t=G8t.strokeStyle;A9t=1;if(d9t.width && parseInt(d9t.width,10) <= 25){A9t=Math.max(+"1",u8t.stripPX(d9t.width));}x9t=1;if(F9t.width && parseInt(F9t.width,10) <= 25){x9t=Math.max(1,u8t.stripPX(F9t.width));}if(this.highlightedDraggable){G8t.globalAlpha*=0.3;}G8t.beginPath();H9t=T9t.dataSet.length - T9t.scroll - 1;X9t=! !1;z9t=null;P9t=null;g9t=null;s9t=I9t.left - "0.5" * 1 * this.layout.candleWidth + this.micropixels - 1;J34.q34();for(var a9t=+"0";a9t <= S9t.length;a9t++){s9t+=this.layout.candleWidth;f9t=S9t[a9t];if(!f9t)continue;if(f9t.projection)break;g9t=f9t.kagiTrend;if(D8t.flipped){g9t*=-1;}if(f9t.transform && T9t.transformFunc){i9t=f9t.kagiPrevOpen;f9t=f9t.transform;f9t.kagiPrevOpen=T9t.transformFunc(this,T9t,i9t);}v8t=f9t.cache;J34.p2q(1);N9t=J34.i2q(H9t,a9t);if(N9t < I9t.cacheLeft || N9t > I9t.cacheRight || !v8t.kagiOpen){v8t.kagiOpen=D8t.semiLog?D8t.height * (1 - (Math.log(Math.max(f9t.Open,0)) / Math.LN10 - D8t.logLow) / D8t.logShadow):(D8t.high - f9t.Open) * D8t.multiplier;v8t.kagiClose=D8t.semiLog?D8t.height * (1 - (Math.log(Math.max(f9t.Close,0)) / Math.LN10 - D8t.logLow) / D8t.logShadow):(D8t.high - f9t.Close) * D8t.multiplier;if(D8t.flipped){v8t.kagiOpen=D8t.bottom - v8t.kagiOpen;v8t.kagiClose=D8t.bottom - v8t.kagiClose;}else {v8t.kagiOpen+=D8t.top;v8t.kagiClose+=D8t.top;}}P9t=v8t.kagiClose;z9t=D8t.semiLog?D8t.height * (1 - (Math.log(Math.max(f9t.kagiPrevOpen,0)) / Math.LN10 - D8t.logLow) / D8t.logShadow):(D8t.high - f9t.kagiPrevOpen) * D8t.multiplier;if(D8t.flipped){z9t=D8t.bottom - z9t;}else {z9t+=D8t.top;}if(X9t){G8t.moveTo(H9t >= 0?I9t.left:Math.floor(s9t),v8t.kagiOpen);G8t.lineTo(Math.floor(s9t),v8t.kagiOpen);if(v8t.kagiClose < v8t.kagiOpen){G8t.strokeStyle=R9t;G8t.lineWidth=A9t;}else {G8t.strokeStyle=B9t;G8t.lineWidth=x9t;}}else {if(g9t != -1 && v8t.kagiClose < z9t && z9t < v8t.kagiOpen){G8t.lineTo(Math.floor(s9t),z9t);G8t.stroke();G8t.beginPath();G8t.moveTo(Math.floor(s9t),z9t);G8t.strokeStyle=R9t;G8t.lineWidth=A9t;}else if(g9t != 1 && v8t.kagiClose > z9t && z9t > v8t.kagiOpen){G8t.lineTo(Math.floor(s9t),z9t);G8t.stroke();G8t.beginPath();G8t.moveTo(Math.floor(s9t),z9t);G8t.strokeStyle=B9t;G8t.lineWidth=x9t;}}G8t.lineTo(Math.floor(s9t),v8t.kagiClose);if(a9t + 1 < S9t.length){G8t.lineTo(Math.floor(s9t + this.layout.candleWidth),v8t.kagiClose);}X9t=!{};}G8t.stroke();this.endClip();G8t.lineWidth=1;};u8t.ChartEngine.prototype.drawPointFigureChart=function(l9t,v9t,h9t,O9t){var A34=D100;var W9t,J9t,j9t,u9t,k9t,V9t,U9t,t9t,L36,E36,U36,C9t,s5O,o9t,G9t,m9t,r9t,n9t,Z9t,o76,w76,L76,c9t,q9t,Q9t,e9t,T5O,M9t,p9t,D9t,K9t,Y9t;W9t=l9t.chart;this.startClip(l9t.name);J9t=W9t.dataSegment;j9t=W9t.context;this.canvasColor(v9t);if(h9t == "X" && O9t.border_color_up){j9t.strokeStyle=O9t.border_color_up;}else if(h9t == "O" && O9t.border_color_down){j9t.strokeStyle=O9t.border_color_down;}A34.q34();u9t=this.canvasStyle(v9t);k9t=parseInt(u9t.paddingTop,10);V9t=parseInt(u9t.paddingBottom,+"10");U9t=parseInt(u9t.paddingLeft,10);t9t=parseInt(u9t.paddingRight,"10" ^ 0);if(u9t.width && parseInt(u9t.width,10) <= +"25"){L36=1270239026;E36=-1723308419;A34.p2q(2);U36=A34.U2q("2",0);for(var f36=1;A34.d66(f36.toString(),f36.toString().length,+"35200") !== L36;f36++){j9t.lineWidth=Math.max(1,u8t.stripPX(u9t.width));U36+=2;}if(A34.d66(U36.toString(),U36.toString().length,79250) !== E36){j9t.lineWidth=Math.max(+"8",u8t.stripPX(u9t.width));}}else {j9t.lineWidth=2;}if(this.highlightedDraggable){j9t.globalAlpha*=0.3;}j9t.beginPath();C9t=this.chart.state.aggregation.box;s5O=W9t.dataSet.length - W9t.scroll - 1;o9t=l9t.yAxis;r9t=C9t * o9t.multiplier;A34.N2q(3);n9t=A34.i2q(r9t,"2",2045960096);function f5O(a5O,g5O,I5O){A34.N2q(1);j9t.moveTo(A34.U2q(a5O,U9t),A34.U2q(n9t,V9t,I5O,A34.N2q(4)));A34.p2q(5);A34.n34();j9t.lineTo(A34.U2q(g5O,t9t),A34.i2q(r9t,k9t,I5O,n9t,A34.p2q(6)));A34.N2q(1);j9t.moveTo(A34.i2q(a5O,U9t),A34.U2q(r9t,k9t,I5O,n9t,A34.N2q(6)));A34.p2q(5);j9t.lineTo(A34.i2q(g5O,t9t),A34.i2q(n9t,V9t,I5O,A34.p2q(4)));}function z5O(w5O,y5O,b5O){var T66,q66,A66;T66=874146734;q66=-1275361598;A66=2;for(var b66=1;A34.d66(b66.toString(),b66.toString().length,60117) !== T66;b66++){A34.N2q(7);j9t.moveTo(A34.i2q(w5O,2,y5O),A34.U2q(k9t,b5O,n9t,A34.p2q(8)));A34.p2q(1);j9t.bezierCurveTo(A34.U2q(y5O,t9t),A34.U2q(k9t,b5O,n9t,A34.N2q(8)),A34.i2q(y5O,t9t,A34.p2q(1)),A34.i2q(r9t,n9t,b5O,V9t,A34.N2q(9)),A34.U2q(w5O,2,y5O,A34.N2q(7)),A34.i2q(r9t,n9t,b5O,V9t,A34.N2q(9)));A66+=+"2";}if(A34.n66(A66.toString(),A66.toString().length,8431) !== q66){A34.N2q(10);j9t.moveTo(A34.U2q(w5O,"7",y5O),A34.i2q(k9t,b5O,n9t,A34.N2q(11)));A34.N2q(5);j9t.bezierCurveTo(A34.U2q(y5O,t9t),A34.i2q(b5O,n9t,k9t,A34.N2q(12)),A34.U2q(y5O,t9t,A34.N2q(13)),A34.i2q(V9t,n9t,b5O,r9t,A34.N2q(14)),A34.i2q(y5O,"3",w5O,A34.p2q(15)),A34.i2q(b5O,V9t,n9t,r9t,A34.p2q(16)));}A34.N2q(5);j9t.bezierCurveTo(A34.i2q(w5O,U9t),A34.U2q(r9t,n9t,b5O,V9t,A34.N2q(9)),A34.i2q(w5O,U9t,A34.p2q(5)),A34.i2q(k9t,b5O,n9t,A34.N2q(8)),A34.U2q(w5O,2,y5O,A34.p2q(7)),A34.U2q(k9t,b5O,n9t,A34.p2q(8)));}Z9t=this.layout.candleWidth;o76=724058005;A34.p2q(17);w76=-A34.U2q("1453735289",0);L76=+"2";for(var U76=1;A34.d66(U76.toString(),U76.toString().length,69672) !== o76;U76++){c9t=l9t.left + Z9t - this.micropixels + 7;L76+=2;}if(A34.n66(L76.toString(),L76.toString().length,15126) !== w76){c9t=l9t.left - Z9t + this.micropixels - 1;}for(var E9t=0;E9t < J9t.length;E9t++){c9t+=Z9t;q9t=J9t[E9t];if(!q9t)continue;if(q9t.projection)break;Q9t=q9t.pfOpen;e9t=q9t.pfClose;T5O=q9t.pfTrend;M9t=q9t.pfStepBack;if(q9t.transform && W9t.transformFunc){q9t=q9t.transform;Q9t=W9t.transformFunc(this,W9t,Q9t);e9t=W9t.transformFunc(this,W9t,e9t);}p9t=q9t.cache;A34.p2q(1);D9t=A34.U2q(s5O,E9t);if(D9t < l9t.cacheLeft || D9t > l9t.cacheRight || !p9t.pfOpen){if(o9t.flipped){p9t.pfOpen=o9t.bottom - (o9t.high - Q9t) * o9t.multiplier;p9t.pfClose=o9t.bottom - (o9t.high - e9t) * o9t.multiplier;}else {p9t.pfOpen=(o9t.high - Q9t) * o9t.multiplier + o9t.top;p9t.pfClose=(o9t.high - e9t) * o9t.multiplier + o9t.top;}}K9t=Math.round(c9t);A34.N2q(1);Y9t=Math.round(A34.U2q(c9t,Z9t));G9t=Math.abs(Math.round((e9t - Q9t) / C9t));m9t=p9t.pfOpen;if(h9t == M9t){if(M9t == (4229 != 648?"X":0x95b)){A34.p2q(5);f5O(K9t,Y9t,A34.U2q(m9t,r9t));}else if(M9t == (1143 >= "369.74" - 0?"O":(!"1",2.01e+3))){A34.N2q(1);z5O(K9t,Y9t,A34.U2q(m9t,r9t));}}if(h9t == T5O){for(;G9t >= 0;G9t--){if(h9t == (338.55 > ("55" ^ 0)?"X":5.62e+2)){f5O(K9t,Y9t,m9t,r9t,n9t);m9t-=o9t.flipped?-r9t:r9t;}else if(h9t == "O"){z5O(K9t,Y9t,m9t,r9t,n9t);m9t+=o9t.flipped?-r9t:r9t;}}}}j9t.stroke();this.endClip();j9t.lineWidth=1;};u8t.ChartEngine.calculateAggregation=function(S5O,F5O,A5O,x5O){var N34=D100;var l76,d5O,R5O,J66,m66,l66,p36,y36,J36;l76="he";l76+="ikinashi";R5O=S5O.layout;if([l76,"heikenashi"].indexOf(F5O) > -1){J66=1330601583;m66=1401217907;l66=2;for(var M66=1;N34.d66(M66.toString(),M66.toString().length,58538) !== J66;M66++){d5O=u8t.calculateHeikinAshi(S5O,A5O,x5O);l66+=2;}if(N34.d66(l66.toString(),l66.toString().length,29789) !== m66){d5O=u8t.calculateHeikinAshi(S5O,A5O,x5O);}}else if(F5O == "rangebars"){d5O=u8t.calculateRangeBars(S5O,A5O,R5O.rangebars,x5O);}else if(F5O == "kagi"){d5O=u8t.calculateKagi(S5O,A5O,R5O.kagi,x5O);}else if(F5O == "linebreak"){p36=+"1718078157";y36=-1713918954;J36=2;for(var l36=1;N34.d66(l36.toString(),l36.toString().length,+"28332") !== p36;l36++){d5O=u8t.calculateLineBreak(S5O,A5O,R5O.priceLines,x5O);J36+=2;}if(N34.d66(J36.toString(),J36.toString().length,20981) !== y36){d5O=u8t.calculateLineBreak(S5O,A5O,R5O.priceLines,x5O);}d5O=u8t.calculateLineBreak(S5O,A5O,R5O.priceLines,x5O);}else if(F5O == "renko"){d5O=u8t.calculateRenkoBars(S5O,A5O,R5O.renko,x5O);}else if(F5O == "pandf"){d5O=u8t.calculatePointFigure(S5O,A5O,R5O.pandf,x5O);}return d5O;};u8t.calculateHeikinAshi=function(m5O,q5O,W5O){var i5O,B5O,H5O,j5O,L5O,X5O,N5O,P5O,u5O,k5O,r5O;if(!q5O.length){return q5O;}if(!W5O){W5O=[];}D100.q34();i5O=[];for(var o5O=+"0";o5O < q5O.length;o5O++){B5O=q5O[o5O];if(!B5O)continue;H5O=i5O[i5O.length - 1];if(!H5O && !o5O){H5O=W5O[W5O.length - 1];}if(!H5O){H5O=B5O;}j5O=B5O.Close;L5O=B5O.Open;X5O=B5O.High;N5O=B5O.Low;P5O=H5O.Open;L5O=L5O || L5O === 0?L5O:j5O;X5O=X5O || X5O === "0" >> 2077156704?X5O:j5O;N5O=N5O || N5O === 0?N5O:j5O;P5O=P5O || P5O === 0?P5O:H5O.Close;u5O=(P5O + H5O.Close) / 2;D100.p2q(18);k5O=D100.U2q(X5O,4,N5O,j5O,L5O);r5O={DT:B5O.DT,displayDate:B5O.displayDate,Date:B5O.Date,Open:u5O,Close:k5O,High:Math.max(X5O,Math.max(u5O,k5O)),Low:Math.min(N5O,Math.min(u5O,k5O)),Volume:B5O.Volume,iqPrevClose:H5O.Close};for(var n5O in B5O){if(!r5O[n5O] && r5O[n5O] !== +"0"){r5O[n5O]=B5O[n5O];}}i5O.push(r5O);}return i5O;};u8t.calculateKagi=function(O5O,Q5O,V5O,K5O){var l34=D100;var Y5O,t5O,H36,I36,W76,U5O,p5O,c5O,h5O,Z5O,l5O;if(!Q5O.length){return Q5O;}if(!K5O){K5O=[];}Y5O=O5O.layout;t5O=O5O.chart;V5O=parseFloat(V5O);t5O.defaultChartStyleConfig.kagi=u8t.ChartEngine.isDailyInterval(Y5O.interval)?4:0.4;if(isNaN(V5O) || V5O <= 0){H36=-1718084767;I36=930490757;W76=2;for(var Z76=1;l34.d66(Z76.toString(),Z76.toString().length,93756) !== H36;Z76++){V5O=t5O.defaultChartStyleConfig.kagi;W76+=2;}if(l34.n66(W76.toString(),W76.toString().length,"67467" ^ 0) !== I36){V5O=t5O.defaultChartStyleConfig.kagi;}if(u8t.Market.Symbology.isForexSymbol(t5O.symbol)){V5O/=4;}if(Y5O.kagi !== null){Y5O.kagi=null;O5O.changeOccurred("layout");}}V5O/=100;U5O=[];p5O=K5O[K5O.length - 1];c5O=p5O?p5O.DT:"0" ^ 0;for(var e5O=0;e5O < Q5O.length;e5O++){h5O=Q5O[e5O];if(!h5O)continue;if(!p5O){l34.N2q(5);p5O=Q5O[l34.i2q(e5O,1)];}if(!p5O)continue;Z5O=p5O.Open || p5O.Open === 0?p5O.Open:p5O.Close;if(Z5O > p5O.Close){if(h5O.Close > p5O.Close * (1 + V5O)){h5O.Open=p5O.Close;}else {if(p5O.Close > h5O.Close){p5O.Close=h5O.Close;}p5O.Volume+=h5O.Volume;if(e5O < Q5O.length - 1)continue;}}else if(Z5O < p5O.Close){if(h5O.Close < p5O.Close * (1 - V5O)){h5O.Open=p5O.Close;}else {if(p5O.Close < h5O.Close){p5O.Close=h5O.Close;}p5O.Volume+=h5O.Volume;if(e5O < Q5O.length - 1)continue;}}else {p5O.Close=h5O.Close;p5O.Volume+=h5O.Volume;if(e5O < Q5O.length - 1)continue;}l5O={DT:p5O.DT,displayDate:p5O.displayDate,Date:p5O.Date,Open:p5O.Open,Close:p5O.Close,High:Math.max(p5O.Open,p5O.Close),Low:Math.min(p5O.Open,p5O.Close),Volume:p5O.Volume,iqPrevClose:p5O.iqPrevClose};for(var E5O in p5O){if(!l5O[E5O] && l5O[E5O] !== 0){l5O[E5O]=p5O[E5O];}}if(U5O.length){l5O.kagiPrevOpen=U5O[U5O.length - 1].Open;}else {l5O.kagiPrevOpen=l5O.Open;}if(l5O.Close > l5O.kagiPrevOpen && l5O.kagiPrevOpen > l5O.Open){l5O.kagiTrend=1;}else if(l5O.Close < l5O.kagiPrevOpen && l5O.kagiPrevOpen < l5O.Open){l5O.kagiTrend=-1;}if(c5O < l5O.DT){U5O.push(l5O);}p5O=h5O;t5O.currentQuote={Close:h5O.Close};}return U5O;};u8t.calculateLineBreak=function(N0O,S0O,C5O,L0O){var x0O,R0O,u76,G5O,P0O,B0O,M5O,D5O,v5O,I0O,a0O,z0O,J5O,T0O,b0O;if(!S0O.length){return S0O;}if(!L0O){L0O=[];}x0O=N0O.layout;R0O=N0O.chart;R0O.defaultChartStyleConfig.priceLines=3;C5O=parseInt(C5O,+"10");if(isNaN(C5O) || C5O <= 0){C5O=R0O.defaultChartStyleConfig.priceLines;if(x0O.priceLines !== null){u76="la";u76+="yout";x0O.priceLines=null;N0O.changeOccurred(u76);}}else if(C5O > 10){x0O.priceLines=C5O=10;}G5O=L0O.slice(-C5O);P0O=G5O.length;D100.p2q(19);B0O=D100.i2q("0",2147483647);a:for(var X0O="0" & 2147483647;X0O < S0O.length;X0O++){M5O=S0O[X0O];if(!M5O)continue;B0O+=M5O.Volume;D5O=G5O[G5O.length - 1];if(!D5O){D5O={Open:M5O.Open,Close:M5O.Open,High:M5O.Open,Low:M5O.Open};}v5O=D5O.Close;I0O=D5O.High;a0O=D5O.Low;z0O=D5O.Open;I0O=I0O || I0O === 0?I0O:v5O;a0O=a0O || a0O === 0?a0O:v5O;z0O=z0O || z0O === 0?z0O:v5O;J5O={DT:M5O.DT,displayDate:M5O.displayDate,Date:M5O.Date,Close:M5O.Close,Volume:B0O,iqPrevClose:v5O};R0O.currentQuote={Close:M5O.Close};if(M5O.Close > v5O && D5O.Close > z0O){;}else if(M5O.Close < v5O && D5O.Close < z0O){;}else if(M5O.Close > I0O){for(T0O=2;T0O <= C5O;T0O++){b0O=G5O[G5O.length - T0O];if(b0O && M5O.Close <= b0O.High){continue a;}}}else if(M5O.Close < a0O){for(T0O=2;T0O <= C5O;T0O++){b0O=G5O[G5O.length - T0O];if(b0O && M5O.Close >= b0O.Low){continue a;}}}else continue;if(M5O.Close < D5O.Close){J5O.Open=Math.min(z0O,v5O);}else {J5O.Open=Math.max(z0O,v5O);}J5O.Low=Math.min(J5O.Open,J5O.Close);J5O.High=Math.max(J5O.Open,J5O.Close);for(var w0O in M5O){if(!J5O[w0O] && J5O[w0O] !== 0){J5O[w0O]=M5O[w0O];}}G5O.push(J5O);B0O=0;}return G5O.slice(P0O);};u8t.calculateRenkoBars=function(m0O,j0O,o0O,l0O){var Z34=D100;var M76,h0O,u0O,k0O,D0O,E0O,V0O,k76,c76,C76,C36,g36,X36,K0O,r0O,n0O,q0O,Y0O,N66,F66,P66,W0O,c0O,M0O,C0O;function e0O(v0O,f2O){var z2O;v0O=Number(v0O.toFixed(8));f2O=Number(f2O.toFixed(8));z2O={DT:q0O.DT,displayDate:q0O.displayDate,Date:q0O.Date,Open:v0O,Close:f2O,High:Math.max(v0O,f2O),Low:Math.min(v0O,f2O),Volume:0,iqPrevClose:v0O != f2O?v0O:null};for(var s2O in q0O){if(!z2O[s2O] && z2O[s2O] !== 0){z2O[s2O]=q0O[s2O];}}Z34.q34();K0O.push(z2O);}Z34.n34();M76="H";M76+="i";M76+="gh";if(!j0O.length){return [];}if(!l0O){l0O=[];}h0O=m0O.layout;u0O=m0O.chart;k0O=u0O.state.aggregation;if(!k0O){k0O=u0O.state.aggregation={};}D0O=Math.min(300,j0O.length);if(!k0O.minMax){k0O.minMax=m0O.determineMinMax(j0O.slice(j0O.length - D0O),["Close",M76,"Low"]);}E0O=k0O.minMax[1] - k0O.minMax[0];V0O=m0O.panels[u0O.name].height;if(!V0O){return [];}u0O.defaultChartStyleConfig.renko=Math.floor(10000 * E0O / (V0O / 30)) / 10000;if(o0O === null || isNaN(o0O) || o0O <= 0){o0O=u0O.defaultChartStyleConfig.renko;if(h0O.renko !== null){h0O.renko=null;m0O.changeOccurred("layout");}}else {k76=613909108;c76=1564350327;C76=2;for(var X76=1;Z34.n66(X76.toString(),X76.toString().length,39270) !== k76;X76++){Z34.p2q(20);o0O=Math.max(o0O,Z34.i2q(E0O,V0O));C76+=2;}if(Z34.n66(C76.toString(),C76.toString().length,72602) !== c76){Z34.N2q(21);o0O=Math.max(o0O,Z34.U2q(E0O,V0O));}if(h0O.renko !== o0O){h0O.renko=o0O;m0O.changeOccurred("layout");}}Z34.N2q(2);C36=-Z34.U2q("1529562731",1109476907);g36=143629946;X36=2;for(var w36="1" - 0;Z34.n66(w36.toString(),w36.toString().length,+"7786") !== C36;w36++){K0O=[];X36+=2;}if(Z34.d66(X36.toString(),X36.toString().length,6514) !== g36){K0O=[];}r0O=null;n0O=null;q0O=null;if(l0O.length){Y0O=l0O[l0O.length - 1];N66=-1871576858;F66=-859815709;P66=2;for(var I66=+"1";Z34.d66(I66.toString(),I66.toString().length,"77511" * 1) !== N66;I66++){r0O=Y0O.Low - o0O;n0O=Y0O.High + o0O;Z34.N2q(2);P66+=Z34.i2q("2",2);}if(Z34.d66(P66.toString(),P66.toString().length,33216) !== F66){r0O=Y0O.Low / o0O;n0O=Y0O.High / o0O;}}for(var U0O=0;U0O < j0O.length;U0O++){W0O=j0O[U0O];if(!W0O)continue;if(!r0O && !n0O){c0O=W0O.Open || W0O.Open === 0?W0O.Open:W0O.Close;M0O=Math.floor(c0O / o0O) * o0O;C0O=isNaN(M0O)?c0O:M0O;Z34.p2q(5);r0O=Z34.i2q(C0O,o0O);Z34.p2q(1);n0O=Z34.U2q(C0O,o0O);}while(! ![]){if(!q0O){q0O=W0O;}if(W0O.Close <= r0O){Z34.p2q(1);e0O(Z34.i2q(r0O,o0O),r0O);Z34.N2q(22);n0O=Z34.i2q(r0O,o0O,2);r0O-=o0O;q0O=null;}else if(W0O.Close >= n0O){Z34.N2q(5);e0O(Z34.U2q(n0O,o0O),n0O);Z34.N2q(23);r0O=Z34.i2q(o0O,2,n0O);n0O+=o0O;q0O=null;}else break;}u0O.currentQuote=W0O;}if(r0O < j0O[j0O.length - 1].Close && r0O + o0O > j0O[j0O.length - 1].Close){Z34.N2q(1);e0O(Z34.U2q(r0O,o0O),j0O[j0O.length - 1].Close);}else if(n0O > j0O[j0O.length - 1].Close && n0O - o0O < j0O[j0O.length - +"1"].Close){Z34.N2q(5);e0O(Z34.U2q(n0O,o0O),j0O[j0O.length - 1].Close);}return K0O;};u8t.calculateRangeBars=function(X2O,y2O,I2O,P2O){var p34=D100;var K76,L2O,N2O,R2O,W2O,j2O,i2O,r2O,T2O,S2O,d2O,o2O,F2O,a2O,H2O,A2O,g2O,b2O,w2O,q2O,k2O;K76="L";K76+="o";K76+="w";if(!y2O.length){return y2O;}if(!P2O){P2O=[];}function B2O(V2O,h2O){p34.q34();while(1){if(!F2O){F2O=V2O;}if(T2O < h2O){T2O=Math.min(h2O,S2O);p34.N2q(5);d2O=Math.max(d2O,p34.i2q(T2O,I2O));if(h2O < S2O)break;}else if(T2O >= h2O){T2O=Math.max(h2O,d2O);p34.p2q(1);S2O=Math.min(S2O,p34.U2q(T2O,I2O));if(h2O > d2O)break;}if(typeof T2O == "undefined"){console.log("Uh oh undefined in calculateRangeBars:processMove");return;}u2O(T2O);F2O=null;n2O();}}L2O=X2O.layout;N2O=X2O.chart;R2O=N2O.state.aggregation;if(!R2O){R2O=N2O.state.aggregation={};}W2O=Math.min(300,y2O.length);function n2O(){var d36,h36,x36;p34.N2q(1);S2O=p34.U2q(T2O,I2O);p34.q34();d36=1284328180;h36=806165278;x36=+"2";for(var i36=1;p34.d66(i36.toString(),i36.toString().length,21905) !== d36;i36++){p34.p2q(13);d2O=p34.U2q(T2O,I2O);p34.p2q(20);x36+=p34.U2q("2",1);}if(p34.d66(x36.toString(),x36.toString().length,53153) !== h36){p34.N2q(5);d2O=p34.U2q(T2O,I2O);}p34.p2q(5);d2O=p34.U2q(T2O,I2O);o2O=T2O;}if(!R2O.minMax){R2O.minMax=X2O.determineMinMax(y2O.slice(y2O.length - W2O),["Close","High",K76]);}j2O=R2O.minMax[1] - R2O.minMax[0];i2O=X2O.panels[N2O.name].height;if(!i2O){return [];}N2O.defaultChartStyleConfig.range=Math.floor(10000 * j2O / (i2O / +"30")) / ("10000" >> 667796768);if(I2O === null || isNaN(I2O) || I2O < 0){I2O=N2O.defaultChartStyleConfig.range;if(L2O.range !== null){L2O.range=null;X2O.changeOccurred("layout");}}else {p34.N2q(21);I2O=Math.max(I2O,p34.U2q(j2O,i2O));if(L2O.range !== I2O){L2O.range=I2O;X2O.changeOccurred("layout");}}function u2O(l2O){var m2O,W36,G36,Z36;m2O={DT:F2O.DT,displayDate:F2O.displayDate,Date:F2O.Date,Open:Number(o2O.toFixed("8" & 2147483647)),Close:Number(l2O.toFixed(8)),High:Number(S2O.toFixed(8)),Low:Number(d2O.toFixed(8)),Volume:"0" << 996684352};m2O.iqPrevClose=m2O.Open;for(var p2O in F2O){if(!m2O[p2O] && m2O[p2O] !== 0){m2O[p2O]=F2O[p2O];}}p34.N2q(24);W36=-p34.i2q(1347483008,"521146016");G36=-1631467541;Z36=+"2";for(var c36=1;p34.d66(c36.toString(),c36.toString().length,24518) !== W36;c36++){r2O.push(m2O);Z36+=2;}if(p34.d66(Z36.toString(),Z36.toString().length,80392) !== G36){r2O.push(m2O);}}r2O=[];T2O=null;S2O=null;d2O=null;o2O=null;F2O=null;p34.q34();for(var x2O=0;x2O < y2O.length;x2O++){a2O=y2O[x2O];if(!a2O)continue;p34.p2q(25);H2O=y2O[p34.U2q(x2O,"1")];if(!x2O){if(!H2O){H2O=P2O[P2O.length - 1];}if(H2O){T2O=H2O.Close;if(T2O || T2O === 0){n2O();}}}if(!H2O)continue;A2O=a2O.Close;g2O=a2O.Open;b2O=a2O.High;w2O=a2O.Low;if(!A2O && A2O !== 0)continue;g2O=g2O || g2O === +"0"?g2O:A2O;b2O=b2O || b2O === 0?b2O:A2O;w2O=w2O || w2O === 0?w2O:A2O;if(!T2O && T2O !== 0){q2O=Math.floor(g2O / I2O) * I2O;T2O=isNaN(q2O)?g2O:q2O;n2O();B2O(H2O,g2O);}if(x2O){B2O(a2O,g2O);}if(b2O - g2O < g2O - w2O){if(b2O){B2O(a2O,b2O);}if(w2O){B2O(a2O,w2O);}}else {if(w2O){B2O(a2O,w2O);}if(b2O){B2O(a2O,b2O);}}B2O(a2O,A2O);if(x2O == y2O.length - 1 && A2O != o2O){k2O=S2O;p34.p2q(1);S2O=p34.i2q(d2O,I2O);p34.p2q(5);d2O=p34.U2q(k2O,I2O);u2O(A2O);}}return r2O;};u8t.calculatePointFigure=function(s3O,T3O,a3O,g3O){var C34=D100;var O2O,M2O,b3O,Q2O,r66,Y66,e66,O76,K2O,Q36,V36,R36,s76,J2O,t76,z76,h66,x66,a66,f3O,z3O,D2O,Y2O,E2O,Z2O,e2O,c2O,v2O,U2O,t2O,C2O,G2O;if(!T3O.length){return T3O;}if(!g3O){g3O=[];}O2O=s3O.layout;M2O=s3O.chart;b3O=M2O.state.aggregation;if(!b3O){b3O=M2O.state.aggregation={};}M2O.defaultChartStyleConfig.box=1;M2O.defaultChartStyleConfig.reversal=3;if(!a3O){a3O={};}Q2O=a3O.box;if(!Q2O){if(O2O.pandf){if(O2O.pandf.box !== null){r66=+"1633371700";Y66=-1137406603;e66=2;for(var B66=1;C34.d66(B66.toString(),B66.toString().length,81641) !== r66;B66++){O76="layou";O76+="t";O2O.pandf.box=null;s3O.changeOccurred(O76);C34.N2q(24);e66+=C34.U2q(255387744,"2");}if(C34.n66(e66.toString(),e66.toString().length,75185) !== Y66){O2O.pandf.box=1;s3O.changeOccurred("");}}}Q2O=M2O.defaultChartStyleConfig.box;K2O=T3O[T3O.length - 1].Close;if(K2O){if(K2O < 0.25){Q2O=0.0625;}else if(K2O < +"1"){Q2O=0.125;}else if(K2O < 5){Q2O=0.25;}else if(K2O < 20){Q2O=0.5;}else if(K2O < 100){Q2O=1;}else if(K2O < 200){Q2O=+"2";}else if(K2O < +"500"){Q2O=4;}else if(K2O < ("1000" & 2147483647)){Q2O=5;}else if(K2O < 25000){Q2O=50;}else {Q2O=500;}}if(!u8t.ChartEngine.isDailyInterval(O2O.interval)){Q2O/=+"10";}if(u8t.Market.Symbology.isForexSymbol(M2O.symbol)){if(K2O){if(K2O < 1){Q2O=0.001;}else if(K2O < 2){Q2O=0.002;}else if(K2O < 50){Q2O=0.02;}else if(K2O < 200){Q2O=0.2;}}if(u8t.ChartEngine.isDailyInterval(O2O.interval)){Q2O*=10;}}M2O.defaultChartStyleConfig.box=Q2O;}Q2O=parseFloat(Q2O);if(isNaN(Q2O) || Q2O <= 0){if(O2O.pandf){if(O2O.pandf.box !== null){Q36=-1455360032;V36=+"1346873338";R36=2;for(var n36="1" | 0;C34.n66(n36.toString(),n36.toString().length,51476) !== Q36;n36++){O2O.pandf.box=1;s3O.changeOccurred("");R36+=2;}if(C34.n66(R36.toString(),R36.toString().length,+"87755") !== V36){s76="l";s76+="ayou";s76+="t";O2O.pandf.box=null;s3O.changeOccurred(s76);}}}M2O.defaultChartStyleConfig.box=Q2O=1;}J2O=Math.ceil(parseFloat(a3O.reversal));if(J2O > 0 && J2O > a3O.reversal){t76="layo";t76+="ut";O2O.pandf.reversal=J2O;s3O.changeOccurred(t76);}else if(isNaN(J2O) || J2O <= 0){if(O2O.pandf){if(O2O.pandf.reversal !== null){z76="layou";z76+="t";O2O.pandf.reversal=null;s3O.changeOccurred(z76);}}h66=-200086030;x66=-2115663051;C34.p2q(24);a66=C34.U2q(1835851840,"2");for(var p66="1" >> 866744320;C34.n66(p66.toString(),p66.toString().length,26976) !== h66;p66++){J2O=M2O.defaultChartStyleConfig.reversal;a66+=2;}if(C34.n66(a66.toString(),a66.toString().length,20617) !== x66){J2O=M2O.defaultChartStyleConfig.reversal;}}b3O.box=Q2O;J2O*=Q2O;function S3O(N3O,L3O,P3O,i3O,o3O,j3O,r3O,n3O,q3O){return {DT:N3O.DT,Date:N3O.Date,pfOpen:n3O,pfClose:q3O,Open:L3O,Close:o3O,High:P3O,Low:i3O,Volume:j3O,iqPrevClose:r3O};}f3O=0.00000001;function y3O(A3O,F3O){var S36,B36,N36;for(var d3O in A3O){if(!F3O[d3O] && F3O[d3O] !== 0){F3O[d3O]=A3O[d3O];}}C34.p2q(5);S36=-C34.i2q("429137851",0);B36=888477669;N36=+"2";for(var P36=1;C34.d66(P36.toString(),P36.toString().length,39365) !== S36;P36++){return F3O;}C34.n34();if(C34.d66(N36.toString(),N36.toString().length,24433) !== B36){return F3O;}}z3O=(Q2O.toString() + ".").split(".")[1].length;D2O=[];Y2O=0;for(var w3O=0;w3O < T3O.length;w3O++){Z2O=T3O[w3O];if(!Z2O)continue;Y2O+=Z2O.Volume;c2O=Z2O.Close;v2O=Z2O.Open;U2O=Z2O.High;t2O=Z2O.Low;v2O=v2O || v2O === +"0"?v2O:c2O;U2O=U2O || U2O === 0?U2O:c2O;t2O=t2O || t2O === 0?t2O:c2O;if(!D2O.length && !g3O.length){E2O=y3O(Z2O,S3O(Z2O,v2O,U2O,t2O,c2O,Y2O,U2O + Q2O,Number((Math.ceil(t2O / Q2O - f3O) * Q2O).toFixed(z3O)),Number((Math.floor(U2O / Q2O + f3O) * Q2O).toFixed(z3O))));E2O.pfTrend="X";if(E2O.pfOpen == E2O.pfClose){E2O.pfStepBack=(5491,5750) != (4715,276)?(+"7584",5414) == ("316.9" * 1,5401)?(782,!{}):(6420,139.25) === (5600,+"4190")?("s",0xb60):"-":(9.75e+3,"d");}D2O.push(E2O);Y2O=0;continue;}e2O=D2O[D2O.length - 1];if(!e2O){e2O=u8t.clone(g3O[g3O.length - 1]);}if(e2O.pfTrend == ((4742,4220) !== (603.89,998)?(+"7683",498.71) >= 7890?(493.21,"0x6ca" - 0):"O":(4.07e+3,+"7.92e+3"))){if(t2O <= e2O.pfClose - Q2O){e2O.pfClose=Number((Math.ceil(t2O / Q2O - f3O) * Q2O).toFixed(z3O));if(e2O.pfStepBack == (("4600" | 4216) < +"3040"?(955.44,"C"):"O")){e2O.pfStepBack=null;}I3O(e2O,U2O,t2O,c2O,Y2O);}else if(U2O >= e2O.pfClose + J2O){C2O=e2O.pfClose + Q2O;G2O=Number((Math.floor(U2O / Q2O + f3O) * Q2O).toFixed(z3O));E2O=S3O(Z2O,v2O,U2O,t2O,c2O,Y2O,e2O.pfClose,C2O,G2O);if(C2O == G2O){E2O.pfStepBack="X";}if(e2O.pfStepBack == ((9619,429.89) > 3880?(7497,881.01) > 6790?(861.69,"G"):(1610,3900) > +"8407"?893.10:(0x199e,!""):"O")){e2O.pfOpen=C2O;e2O.pfClose=G2O;e2O.pfTrend=6382 != (359,9170)?"X":28 >= (9870,"9030" ^ 0)?!"1":("793.66" - 0,! !0);I3O(e2O,U2O,t2O,c2O,Y2O);}else {E2O=y3O(Z2O,E2O);E2O.pfTrend="X";D2O.push(E2O);}}else {I3O(e2O,U2O,t2O,c2O,Y2O);}Y2O=0;}else if(e2O.pfTrend == "X"){if(U2O >= e2O.pfClose + Q2O){e2O.pfClose=Number((Math.floor(U2O / Q2O + f3O) * Q2O).toFixed(z3O));if(e2O.pfStepBack == (727.94 == 233.12?(+"0xb1a",0xd31):("737.89" - 0,3461) > (7596,910.66)?893.28 >= 9070?("c",1.12e+3):"X":983.01) || e2O.pfStepBack == (42 == (735.26,589.09)?866.8 <= (+"2480",552.79)?(357.04,"Q"):7.90e+3:"-")){e2O.pfStepBack=null;}I3O(e2O,U2O,t2O,c2O,Y2O);}else if(t2O <= e2O.pfClose - J2O){C2O=e2O.pfClose - Q2O;G2O=Number((Math.ceil(t2O / Q2O - f3O) * Q2O).toFixed(z3O));E2O=S3O(Z2O,v2O,U2O,t2O,c2O,Y2O,e2O.pfClose,C2O,G2O);if(C2O == G2O){E2O.pfStepBack=109.64 < +"4895"?"O":(9.42e+3,3.11e+3);}if(e2O.pfStepBack == "X" || e2O.pfStepBack == "-"){e2O.pfOpen=C2O;e2O.pfClose=G2O;e2O.pfTrend="O";I3O(e2O,U2O,t2O,c2O,Y2O);if(C2O != G2O && e2O.pfStepBack == "-"){e2O.pfStepBack=null;}}else {E2O=y3O(Z2O,E2O);E2O.pfTrend="O";D2O.push(E2O);}}else {I3O(e2O,U2O,t2O,c2O,Y2O);}Y2O=0;}}function I3O(x3O,R3O,B3O,H3O,X3O){x3O.High=Math.max(R3O,x3O.High);x3O.Low=Math.min(B3O,x3O.Low);x3O.Close=H3O;x3O.Volume+=X3O;}return D2O;};};/* eslint-enable  */ /* jshint ignore:end   */ /* ignore jslint end   */


let _exports = {CIQ, SplinePlotter, timezoneJS, $$, $$$};
export {__js_advanced_aggregations_ as aggregations};
export {__js_advanced_drawingAdvanced_ as drawingAdvanced};
export {__js_advanced_equationsAdvanced_ as equationsAdvanced};
export {__js_advanced_highPerformanceMarkers_ as highPerformanceMarkers};
export {__js_advanced_renderersAdvanced_ as renderersAdvanced};
export {__js_advanced_studies_accumulationDistribution_ as accumulationDistribution};
export {__js_advanced_studies_adx_ as adx};
export {__js_advanced_studies_alligator_ as alligator};
export {__js_advanced_studies_aroon_ as aroon};
export {__js_advanced_studies_atr_ as atr};
export {__js_advanced_studies_awesomeOscillator_ as awesomeOscillator};
export {__js_advanced_studies_balanceOfPower_ as balanceOfPower};
export {__js_advanced_studies_bollinger_ as bollinger};
export {__js_advanced_studies_cci_ as cci};
export {__js_advanced_studies_centerOfGravity_ as centerOfGravity};
export {__js_advanced_studies_chaikin_ as chaikin};
export {__js_advanced_studies_chande_ as chande};
export {__js_advanced_studies_choppiness_ as choppiness};
export {__js_advanced_studies_comparisonStudies_ as comparisonStudies};
export {__js_advanced_studies_coppock_ as coppock};
export {__js_advanced_studies_darvasBox_ as darvasBox};
export {__js_advanced_studies_detrended_ as detrended};
export {__js_advanced_studies_disparity_ as disparity};
export {__js_advanced_studies_easeOfMovement_ as easeOfMovement};
export {__js_advanced_studies_ehlerFisher_ as ehlerFisher};
export {__js_advanced_studies_elder_ as elder};
export {__js_advanced_studies_fractalChaos_ as fractalChaos};
export {__js_advanced_studies_highLowStudies_ as highLowStudies};
export {__js_advanced_studies_ichimoku_ as ichimoku};
export {__js_advanced_studies_intradayMomentum_ as intradayMomentum};
export {__js_advanced_studies_keltner_ as keltner};
export {__js_advanced_studies_klinger_ as klinger};
export {__js_advanced_studies_linearRegression_ as linearRegression};
export {__js_advanced_studies_macd_ as macd};
export {__js_advanced_studies_massIndex_ as massIndex};
export {__js_advanced_studies_moneyFlow_ as moneyFlow};
export {__js_advanced_studies_movingAverages_ as movingAverages};
export {__js_advanced_studies_parabolicSAR_ as parabolicSAR};
export {__js_advanced_studies_pivotPoints_ as pivotPoints};
export {__js_advanced_studies_prettyGoodOscillator_ as prettyGoodOscillator};
export {__js_advanced_studies_priceMomentumOscillator_ as priceMomentumOscillator};
export {__js_advanced_studies_priceVolumeOscillator_ as priceVolumeOscillator};
export {__js_advanced_studies_primeNumber_ as primeNumber};
export {__js_advanced_studies_pring_ as pring};
export {__js_advanced_studies_projectedVolume_ as projectedVolume};
export {__js_advanced_studies_psychologicalLine_ as psychologicalLine};
export {__js_advanced_studies_qstick_ as qstick};
export {__js_advanced_studies_rainbow_ as rainbow};
export {__js_advanced_studies_randomWalk_ as randomWalk};
export {__js_advanced_studies_relativeVigor_ as relativeVigor};
export {__js_advanced_studies_rsi_ as rsi};
export {__js_advanced_studies_schaffTrendCycle_ as schaffTrendCycle};
export {__js_advanced_studies_shinohara_ as shinohara};
export {__js_advanced_studies_stochastics_ as stochastics};
export {__js_advanced_studies_supertrend_ as supertrend};
export {__js_advanced_studies_swingIndex_ as swingIndex};
export {__js_advanced_studies_trendIntensity_ as trendIntensity};
export {__js_advanced_studies_trix_ as trix};
export {__js_advanced_studies_twiggsMoneyFlow_ as twiggsMoneyFlow};
export {__js_advanced_studies_typicalPrice_ as typicalPrice};
export {__js_advanced_studies_ulcerIndex_ as ulcerIndex};
export {__js_advanced_studies_ultimateOscillator_ as ultimateOscillator};
export {__js_advanced_studies_valuationLines_ as valuationLines};
export {__js_advanced_studies_volatilityIndex_ as volatilityIndex};
export {__js_advanced_studies_volumeProfile_ as volumeProfile};
export {__js_advanced_studies_volumeStudies_ as volumeStudies};
export {__js_advanced_studies_vortex_ as vortex};
export {__js_advanced_studies_williamsMFI_ as williamsMFI};

export {CIQ, SplinePlotter, timezoneJS, $$, $$$};

/* global __TREE_SHAKE__ */
if (typeof __TREE_SHAKE__ === "undefined" || !__TREE_SHAKE__) {
	(_exports.CIQ || CIQ).activateImports(
		__js_advanced_aggregations_,
		__js_advanced_drawingAdvanced_,
		__js_advanced_equationsAdvanced_,
		__js_advanced_highPerformanceMarkers_,
		__js_advanced_renderersAdvanced_,
		__js_advanced_studies_accumulationDistribution_,
		__js_advanced_studies_adx_,
		__js_advanced_studies_alligator_,
		__js_advanced_studies_aroon_,
		__js_advanced_studies_atr_,
		__js_advanced_studies_awesomeOscillator_,
		__js_advanced_studies_balanceOfPower_,
		__js_advanced_studies_bollinger_,
		__js_advanced_studies_cci_,
		__js_advanced_studies_centerOfGravity_,
		__js_advanced_studies_chaikin_,
		__js_advanced_studies_chande_,
		__js_advanced_studies_choppiness_,
		__js_advanced_studies_comparisonStudies_,
		__js_advanced_studies_coppock_,
		__js_advanced_studies_darvasBox_,
		__js_advanced_studies_detrended_,
		__js_advanced_studies_disparity_,
		__js_advanced_studies_easeOfMovement_,
		__js_advanced_studies_ehlerFisher_,
		__js_advanced_studies_elder_,
		__js_advanced_studies_fractalChaos_,
		__js_advanced_studies_highLowStudies_,
		__js_advanced_studies_ichimoku_,
		__js_advanced_studies_intradayMomentum_,
		__js_advanced_studies_keltner_,
		__js_advanced_studies_klinger_,
		__js_advanced_studies_linearRegression_,
		__js_advanced_studies_macd_,
		__js_advanced_studies_massIndex_,
		__js_advanced_studies_moneyFlow_,
		__js_advanced_studies_movingAverages_,
		__js_advanced_studies_parabolicSAR_,
		__js_advanced_studies_pivotPoints_,
		__js_advanced_studies_prettyGoodOscillator_,
		__js_advanced_studies_priceMomentumOscillator_,
		__js_advanced_studies_priceVolumeOscillator_,
		__js_advanced_studies_primeNumber_,
		__js_advanced_studies_pring_,
		__js_advanced_studies_projectedVolume_,
		__js_advanced_studies_psychologicalLine_,
		__js_advanced_studies_qstick_,
		__js_advanced_studies_rainbow_,
		__js_advanced_studies_randomWalk_,
		__js_advanced_studies_relativeVigor_,
		__js_advanced_studies_rsi_,
		__js_advanced_studies_schaffTrendCycle_,
		__js_advanced_studies_shinohara_,
		__js_advanced_studies_stochastics_,
		__js_advanced_studies_supertrend_,
		__js_advanced_studies_swingIndex_,
		__js_advanced_studies_trendIntensity_,
		__js_advanced_studies_trix_,
		__js_advanced_studies_twiggsMoneyFlow_,
		__js_advanced_studies_typicalPrice_,
		__js_advanced_studies_ulcerIndex_,
		__js_advanced_studies_ultimateOscillator_,
		__js_advanced_studies_valuationLines_,
		__js_advanced_studies_volatilityIndex_,
		__js_advanced_studies_volumeProfile_,
		__js_advanced_studies_volumeStudies_,
		__js_advanced_studies_vortex_,
		__js_advanced_studies_williamsMFI_,
		null
	);
}