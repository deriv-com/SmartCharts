// @ts-nocheck
export const overrideFindHighlights = () => {
    // overriding the method to avoid error in case myPanel is null:
    CIQ.ChartEngine.prototype.findHighlights = function (isTap, clearOnly) {
        const radius = this.preferences[isTap ? 'highlightsTapRadius' : 'highlightsRadius']; // 30:10
        this.highlightViaTap = isTap; // internal use state var

        const { cx, cy } = this;
        this.anyHighlighted = false;
        if (!this.currentPanel) return;
        const { chart } = this.currentPanel;

        if (this.activeDrawing) clearOnly = true;
        let somethingChanged = false;
        let drawingToMeasure = null;
        let stickyArgs = clearOnly ? {} : { forceShow: true, type: 'drawing' };

        const box = {
            x0: this.tickFromPixel(cx - radius, chart),
            x1: this.tickFromPixel(cx + radius, chart),
            y0: this.valueFromPixel(cy - radius, this.currentPanel),
            y1: this.valueFromPixel(cy + radius, this.currentPanel),
            cx0: cx - radius,
            cx1: cx + radius,
            cy0: cy - radius,
            cy1: cy + radius,
            r: radius,
        };
        if (this.repositioningDrawing && box.x1 - box.x0 < 2) {
            box.x1++;
            box.x0--;
        } else if (box.x1 === box.x0) {
            box.x0 -= 0.5;
            box.x1 += 0.5;
        }
        const markers =
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
            for (let i = this.drawingObjects.length - 1; i >= 0; i--) {
                const drawing = this.drawingObjects[i];
                if (!this.panels[drawing.panelName]) continue;
                if (this.repositioningDrawing && this.repositioningDrawing !== drawing) continue;

                const prevHighlight = drawing.highlighted;
                let highlightMe = drawing.panelName === this.currentPanel.name;
                drawing.repositioner = drawing.intersected(this.crosshairTick, this.crosshairValue, box);
                highlightMe = highlightMe && drawing.repositioner;

                if (!clearOnly && highlightMe) {
                    if (prevHighlight) {
                        drawingToMeasure = drawing;
                        if (this.anyHighlighted && this.singleDrawingHighlight) drawing.highlighted = false;
                        if (drawing.highlighted && drawing.highlighted !== prevHighlight) somethingChanged = true; // drawing is still highlighted, but a different positioner is active
                    } else if (prevHighlight !== drawing.highlight(true)) {
                        if (!drawingToMeasure) drawingToMeasure = drawing;
                        if (this.anyHighlighted && this.singleDrawingHighlight) drawing.highlighted = false;
                        somethingChanged = true;
                    }
                    this.anyHighlighted = true;
                } else if (prevHighlight !== drawing.highlight(false)) {
                    somethingChanged = true;
                }
                if (drawing.highlighted) {
                    stickyArgs.noDelete = drawing.permanent;
                    stickyArgs.noEdit = !this.callbackListeners.drawingEdit.length;
                }
            }
        }

        let n, o, m, marker, series, bar;
        for (n in this.layout.studies) {
            o = this.layout.studies[n];
            o.prev = o.highlight;
            o.highlight = this.yaxisMatches(o, this.grabStartYAxis);
        }
        for (n in chart.seriesRenderers) {
            const r = chart.seriesRenderers[n];
            r.params.highlight = this.yaxisMatches(r, this.grabStartYAxis);
            for (let j = 0; j < r.seriesParams.length; j++) {
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
        function isOverlayIntersecting(refBar, _box, fullField, yAxis, renderer, id) {
            const _chart = this.chart,
                currentPanel = this.currentPanel;
            if (!yAxis) yAxis = currentPanel.yAxis;
            const parts = fullField.split('-->');
            const field = parts[0];
            let subField = parts[1];
            if (!subField) subField = 'Close';
            function getVal(quote) {
                if (!quote) return null;
                let theVal = quote[field];
                if (theVal && (theVal[subField] || theVal[subField] === 0)) {
                    // For OHLC, hover over imaginary line connecting closes
                    theVal = theVal[subField];
                }
                if (renderer && renderer.getBasis) theVal += renderer.getBasis(quote, field, subField);
                if (!_chart.transformFunc || yAxis !== _chart.yAxis) return theVal;
                if (quote.transform && field in quote.transform) {
                    theVal = quote.transform[field];
                    if (theVal && (theVal[subField] || theVal[subField] === 0)) {
                        // For OHLC, hover over imaginary line connecting closes
                        theVal = theVal[subField];
                    }
                    return theVal;
                }
                return _chart.transformFunc(this, _chart, theVal);
            }
            const quote = _chart.dataSegment[bar];
            let quotePrev, quoteNext;
            let val,
                valPrev,
                valNext,
                tick = null,
                tickPrev = null,
                tickNext = null;
            const usedCache = new Array(3);
            const cache = renderer && renderer.caches[id];
            if (quote && cache) {
                val = cache[bar];
                tick = quote.tick;
                if (val || val === 0) usedCache[0] = 1;
                let ci;
                for (ci = bar - 1; ci >= 0; ci--) {
                    if (cache[ci] || cache[ci] === 0) {
                        valPrev = cache[ci];
                        tickPrev = tick - (bar - ci);
                        usedCache[1] = 1;
                        break;
                    }
                }
                for (ci = bar + 1; ci < _chart.dataSegment.length; ci++) {
                    if (cache[ci] || cache[ci] === 0) {
                        valNext = cache[ci];
                        tickNext = tick - (bar - ci);
                        usedCache[2] = 1;
                        break;
                    }
                }
            }
            if (tickPrev === null) {
                quotePrev = this.getPreviousBar.call(this, _chart, fullField, bar);
                if (quotePrev) {
                    tickPrev = quotePrev.tick;
                    valPrev = getVal(quotePrev);
                }
            }
            if (tickNext === null) {
                quoteNext = this.getNextBar.call(this, _chart, fullField, bar);
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
                if (id && _chart.series[id].parameters.extendToEndOfDataSet) {
                    tickNext = _chart.dataSet.length - 1;
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

            const pftv = this.pixelFromTransformedValue.bind(this),
                vfp = this.valueFromPixel.bind(this);
            val = vfp(usedCache[0] ? val : pftv(val, currentPanel, yAxis), currentPanel);
            valPrev = vfp(usedCache[1] ? valPrev : pftv(valPrev, currentPanel, yAxis), currentPanel);
            valNext = vfp(usedCache[2] ? valNext : pftv(valNext, currentPanel, yAxis), currentPanel);

            const pixelBox = CIQ.convertBoxToPixels(this, currentPanel.name, _box);
            const pixelPoint1 = CIQ.convertBoxToPixels(this, currentPanel.name, {
                x0: tickPrev,
                y0: valPrev,
                x1: tick,
                y1: val,
            });
            const pixelPoint2 = CIQ.convertBoxToPixels(this, currentPanel.name, {
                x0: tick,
                y0: val,
                x1: tickNext,
                y1: valNext,
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
                    'segment'
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
                    'segment'
                )
            ) {
                return true;
            }
            return false;
        }

        if (!clearOnly && !this.anyHighlighted && this.controls.anchorHandles) {
            for (const id in this.controls.anchorHandles) {
                const anchorHandle = this.controls.anchorHandles[id];
                const { handle, sd } = anchorHandle;
                const xo = this.resolveX(cx);
                const yo = this.resolveY(cy);
                if (handle) {
                    const { left, top, right, bottom } = handle.getBoundingClientRect();
                    if (CIQ.boxIntersects(left, top, right, bottom, xo, yo, xo, yo)) {
                        anchorHandle.highlighted = true;
                        this.anyHighlighted = true;
                        somethingChanged = true;
                        stickyArgs = {
                            message: sd.name,
                            type: 'anchorHandle',
                        };
                        continue;
                    }

                    if (anchorHandle.highlighted === true) {
                        anchorHandle.highlighted = false;
                        somethingChanged = true;
                    }
                }
            }
        }

        if (!clearOnly && !this.anyHighlighted && chart.dataSegment) {
            bar = this.barFromPixel(cx);
            if (bar >= 0 && bar < chart.dataSegment.length) {
                let y;
                for (n in this.overlays) {
                    o = this.overlays[n];

                    // check handles before this to make sure to set highlight state to false where appropriate
                    if (o.panel !== this.currentPanel.name) continue;

                    // custom highlight detection
                    if (o.study.isHighlighted === false) continue;
                    else if (typeof o.study.isHighlighted === 'function') {
                        if (o.study.isHighlighted(this, cx, cy)) {
                            o.highlight = true;
                            this.anyHighlighted = true;
                        }
                        continue;
                    }

                    const quote = chart.dataSegment[bar];
                    if (!quote) continue;
                    let out;
                    for (const _out in o.outputMap) {
                        out = _out;
                        if (isOverlayIntersecting.call(this, bar, box, out, o.getYAxis(this))) {
                            if (o.name !== o.panel) this.anyHighlighted = true;
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
                    const renderer = chart.seriesRenderers[n];
                    const rendererPanel = renderer.params.panel;
                    if (renderer === this.mainSeriesRenderer) continue;
                    if (!renderer.params.highlightable && !this.currentVectorParameters.vectorType) continue;
                    if (rendererPanel !== this.currentPanel.name) continue;
                    for (m = 0; m < renderer.seriesParams.length; m++) {
                        series = renderer.seriesParams[m];
                        let fullField = series.field;
                        if (!fullField && !renderer.highLowBars) fullField = this.defaultPlotField || 'Close';
                        if (series.symbol && series.subField) fullField += `-->${series.subField}`;
                        let yAxis = renderer.params.yAxis;
                        if (!yAxis && rendererPanel) yAxis = this.panels[rendererPanel].yAxis;
                        if (renderer.params.step && bar > 0) {
                            // In a step series we also need to check for intersection with
                            // the vertical bar (the step) that connects two points
                            if (!renderer.caches[series.id]) continue;
                            y = renderer.caches[series.id][bar];
                            if (!y && y !== 0) continue;
                            const py = renderer.caches[series.id][bar - 1];
                            if (
                                ((py || py === 0) && cy + radius >= y && cy - radius <= py) ||
                                (cy - radius <= y && cy + radius >= py)
                            ) {
                                series.highlight = true;
                                this.anyHighlighted = true;
                            }
                        } else if (isOverlayIntersecting.call(this, bar, box, fullField, yAxis, renderer, series.id)) {
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
        let highlightedDraggable;
        const drag = this.preferences.dragging;

        let yAxisToHighlight;

        for (n in this.overlays) {
            o = this.overlays[n];
            if (o.highlight) {
                this.anyHighlighted = true;
                let display = o.inputs.display || o.name;
                display = this.translateIf(display);
                stickyArgs = {
                    message: display,
                    noDelete: o.permanent,
                    noEdit: !o.editFunction,
                    type: 'study',
                };
                drawingToMeasure = null;
                if (drag === true || (drag && drag.study)) highlightedDraggable = o;

                // Find corresponding y-axis
                yAxisToHighlight = o.getYAxis(this);
            }
            if (o.prev !== o.highlight) somethingChanged = true;
        }

        for (n in chart.seriesRenderers) {
            const r2 = chart.seriesRenderers[n];
            const bColor = r2.params.yAxis ? r2.params.yAxis.textStyle : null;
            for (let m2 = 0; m2 < r2.seriesParams.length; m2++) {
                series = r2.seriesParams[m2];
                if (r2.params.highlightable && series.highlight) {
                    this.anyHighlighted = true;
                    let bgColor = series.color || bColor;
                    if (bgColor === 'auto') bgColor = this.defaultColor;
                    if (series.opacity && series.opacity !== 1) {
                        bgColor = CIQ.hexToRgba(CIQ.colorToHex(bgColor), parseFloat(series.opacity));
                    }
                    stickyArgs = {
                        message: series.display || series.symbol,
                        backgroundColor: bgColor,
                        noDelete: series.permanent,
                        type: 'series',
                    };
                    drawingToMeasure = null;
                    if (drag === true || (drag && drag.series)) {
                        highlightedDraggable = r2;
                        r2.params.highlight = true;
                    }

                    // Find corresponding y-axis
                    yAxisToHighlight = r2.getYAxis(this);
                }
                if (series.prev !== series.highlight) somethingChanged = true;
            }
        }

        for (n in this.plugins) {
            const plugin = this.plugins[n];
            let pluginHighlights = {};
            if (plugin.findHighlights) {
                pluginHighlights = plugin.findHighlights(this, isTap, clearOnly);
                if (pluginHighlights.somethingChanged) somethingChanged = true;
                if (pluginHighlights.anyHighlighted) {
                    this.anyHighlighted = true;
                    stickyArgs = pluginHighlights.stickyArgs || {};
                }
            }
        }

        const myPanel = this.whichPanel(cy);
        const myYAxis = this.whichYAxis(myPanel, cx);

        if (!yAxisToHighlight) yAxisToHighlight = myYAxis;
        if (this.currentBaseline) yAxisToHighlight = this.currentBaseline.getYAxis(this);

        // Highlight yAxisToHighlight if applicable
        if (yAxisToHighlight) {
            if (!yAxisToHighlight.highlight) somethingChanged = true;
            yAxisToHighlight.highlight = true;
        }

        // Collect all y-axes in array for easy referencing
        // Collect all in case you move from highlighting axis across panels
        let allYAxes = [];
        for (const p in this.panels) {
            allYAxes = allYAxes.concat(this.panels[p].yaxisLHS).concat(this.panels[p].yaxisRHS);
        }

        for (n = 0; n < allYAxes.length; n++) {
            if (yAxisToHighlight === allYAxes[n] && !clearOnly) continue;
            if (allYAxes[n].highlight) somethingChanged = true;
            allYAxes[n].highlight = false;
        }

        for (m = 0; markers && m < markers.length; m++) {
            marker = markers[m];
            const mbox = marker.params.box;
            if (!mbox) continue; // Only created when the dataSegment is drawn.
            if (marker.params.panelName !== this.currentPanel.name) continue;
            const pxBox = CIQ.convertBoxToPixels(this, this.currentPanel.name, box);
            // If it doesn't exist then the it is off the screen and cannot be intersected.
            if (CIQ.boxIntersects(pxBox.x0, pxBox.y0, pxBox.x1, pxBox.y1, mbox.x0, mbox.y0, mbox.x1, mbox.y1)) {
                this.activeMarker = marker;
                marker.highlight = true;
                this.markerHelper.highlighted.push(marker);
            }
            if (marker.prev !== marker.highlight) somethingChanged = true;
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

        if (highlightedDraggable && myPanel && !myPanel.noDrag) {
            if (this.longHoldTookEffect && !this.cancelLongHold) {
                if (highlightedDraggable.params) {
                    // series, highlight relatives
                    if (highlightedDraggable.params.dependentOf) {
                        // series, highlight relatives
                        highlightedDraggable = chart.seriesRenderers[highlightedDraggable.params.dependentOf];
                        highlightedDraggable.params.highlight = true;
                    }
                    for (n in chart.seriesRenderers) {
                        if (chart.seriesRenderers[n].params.dependentOf === highlightedDraggable.params.name) {
                            chart.seriesRenderers[n].params.highlight = true;
                        }
                    }
                }
                this.highlightedDraggable = highlightedDraggable;
                if (highlightedDraggable.getDependents) {
                    // study, highlight dependents
                    const dependents = highlightedDraggable.getDependents(this, true);
                    for (n in this.overlays) {
                        o = this.overlays[n];
                        if (dependents.indexOf(o) > -1) o.highlight = true;
                    }
                }
            }
            this.container.classList.add('stx-draggable');
        } else {
            this.container.classList.remove('stx-draggable');
        }

        this.highlightedDataSetField = this.adjustHighlightedDataSetField(this.highlightedDataSetField);
        this.displayDrawOK();
    };
};
