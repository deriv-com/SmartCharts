import { observable, action, computed, when } from 'mobx';
import { sameBar } from './utils';

class Tooltip extends CIQ.Marker {
    get showOhl() {
        return this.stx.layout.timeUnit !== 'second';
    }
    constructor({
        stx,
        node,
        setRows,
        show,
        hide,
    }) {
        super({
            stx,
            xPositioner: 'bar',
            node,
            chartContainer: true,
            label: 'tooltip',
        });
        this.stx = stx;
        this.setRows = setRows;
        this.show = show;
        this.hide = hide;
        this.lastBar = { };

        this.className = 'CIQ.Marker.Tooltip';
        this.showChange = false;
        this.showSeries = true;
        this.showStudies = true;

        CIQ.ChartEngine.prototype.append('undisplayCrosshairs', () => {
            this.hide();
            this.lastBar = { };
        });
        CIQ.ChartEngine.prototype.append('deleteHighlighted', function () {
            this.lastBar = { };
            this.headsUpHR();
        });
        CIQ.ChartEngine.prototype.append('headsUpHR', this.renderFunction);
        CIQ.ChartEngine.prototype.append('createDataSegment', this.renderFunction);
    }

    static placementFunction(params) {
        const showOverBarOnly = false;
        let offset = 30;
        let stx = params.stx;
        for (let i = 0; i < params.arr.length; i++) {
            let marker = params.arr[i];
            let bar = stx.barFromPixel(stx.cx);
            let quote = stx.chart.dataSegment[bar];
            let goodBar;
            let overBar = true;
            let highPx,
                lowPx;

            // Do not process anything other than the actual tooltip.
            if (marker.className !== 'CIQ.Marker.Tooltip') {
                continue;
            }

            if (quote != 'undefined' && quote && quote.DT) {
                goodBar = true;
                if (quote.High) { highPx = stx.pixelFromPrice(quote.High); }
                if (quote.Low) { lowPx = stx.pixelFromPrice(quote.Low); }
                if (!stx.highLowBars[stx.layout.chartType]) {
                    if (quote.Close) {
                        highPx = stx.pixelFromPrice(quote.Close) - 15;
                        lowPx = stx.pixelFromPrice(quote.Close) + 15;
                    }
                }
                if (showOverBarOnly && !(stx.cy >= highPx && stx.cy <= lowPx)) { overBar = false; }
            }

            if (
                (stx.controls.crossX && stx.controls.crossX.style.display == 'none') ||
                (stx.controls.crossY && stx.controls.crossY.style.display == 'none') ||
                !(CIQ.ChartEngine.insideChart &&
                    stx.layout.crosshair &&
                    stx.displayCrosshairs &&
                    !stx.overXAxis &&
                    !stx.overYAxis &&
                    !stx.openDialog &&
                    !stx.activeDrawing &&
                    !stx.grabbingScreen &&
                    goodBar &&
                    overBar)
            ) {
                marker.hide();
                marker.lastBar = { };
                return;
            }
            if (sameBar(stx.chart.dataSegment[bar], marker.lastBar) && bar != stx.chart.dataSegment.length - 1) { return; }

            marker.lastBar = stx.chart.dataSegment[bar];

            let left = null,
                right = null;
            if (parseInt(getComputedStyle(marker.node).width, 10) + offset < CIQ.ChartEngine.crosshairX) {
                left = 'auto';
                right = Math.round(stx.container.clientWidth - stx.pixelFromBar(bar) + offset);
            } else {
                left = Math.round(stx.pixelFromBar(bar) + offset);
                right = 'auto';
            }
            const top = Math.round(CIQ.ChartEngine.crosshairY - stx.top - parseInt(getComputedStyle(marker.node).height, 10) / 2);
            marker.show({
                left,
                right,
                top,
            });
        }
        stx.doDisplayCrosshairs();
    }

    renderFunction = () => {
        const stx = this.stx;
        const lastBar = this.lastBar;
        // crosshairs are not on
        if (
            (stx.controls.crossX && stx.controls.crossX.style.display == 'none') ||
            (stx.controls.crossY && stx.controls.crossY.style.display == 'none')
        ) {
            return;
        }

        const bar = stx.barFromPixel(stx.cx);
        const data = stx.chart.dataSegment[bar];
        if (!data) {
            stx.positionMarkers();
            return;
        }
        if (sameBar(data, lastBar) && bar != stx.chart.dataSegment.length - 1) { return; }

        let panel = stx.chart.panel;
        let yAxis = panel.yAxis;
        const dupMap = {};
        const fields = [];
        fields.push({
            member: 'DT',
            display: 'DT',
            panel,
            yAxis,
        });
        dupMap.DT = dupMap.Close = 1;
        if (this.showChange && CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
            fields.push({
                member: 'Change',
                display: 'Change',
                panel,
                yAxis,
            });
        }
        if (this.showOhl) {
            fields.push({
                member: 'Open',
                display: 'Open',
                panel,
                yAxis,
            });
            fields.push({
                member: 'Close',
                display: 'Close',
                panel,
                yAxis,
            });
            fields.push({
                member: 'High',
                display: 'High',
                panel,
                yAxis,
            });
            fields.push({
                member: 'Low',
                display: 'Low',
                panel,
                yAxis,
            });
            dupMap.Open = dupMap.High = dupMap.Low = 1;
        }
        if (this.showVolume) {
            fields.push({
                member: 'Volume',
                display: 'Volume',
                panel: null,
                yAxis: null,
            }); // null yAxis use raw value
            dupMap.Volume = 1;
        }
        if (this.showSeries) {
            let renderers = stx.chart.seriesRenderers;
            for (let renderer in renderers) {
                let rendererToDisplay = renderers[renderer];
                panel = stx.panels[rendererToDisplay.params.panel];
                yAxis = rendererToDisplay.params.yAxis;
                if (!yAxis && rendererToDisplay.params.shareYAxis) { yAxis = panel.yAxis; }
                for (let id = 0; id < rendererToDisplay.seriesParams.length; id++) {
                    let seriesParams = rendererToDisplay.seriesParams[id];
                    // if a series has a symbol and a field then it maybe a object chain
                    let sKey = seriesParams.symbol;
                    let subField = seriesParams.field;
                    if (!sKey) {
                        sKey = subField;
                    } else if (subField && sKey != subField) { sKey = CIQ.createObjectChainNames(sKey, subField)[0]; }
                    let display = seriesParams.display || seriesParams.symbol || seriesParams.field;
                    if (sKey && !dupMap[display]) {
                        fields.push({
                            member: sKey,
                            display,
                            panel,
                            yAxis,
                        });
                        dupMap[display] = 1;
                    }
                }
            }
        }
        if (this.showStudies) {
            for (let study in stx.layout.studies) {
                panel = stx.panels[stx.layout.studies[study].panel];
                yAxis = panel.yAxis; // after 4377 is merged: stx.getYAxisByName(panel, study);
                for (let output in stx.layout.studies[study].outputMap) {
                    if (output && !dupMap[output]) {
                        fields.push({
                            member: output,
                            display: output,
                            panel,
                            yAxis,
                        });
                        dupMap[output] = 1;
                    }
                }
                if (!dupMap[`${study}_hist`]) {
                    fields.push({
                        member: `${study}_hist`,
                        display: `${study}_hist`,
                        panel,
                        yAxis,
                    });
                    fields.push({
                        member: `${study}_hist1`,
                        display: `${study}_hist1`,
                        panel,
                        yAxis,
                    });
                    fields.push({
                        member: `${study}_hist2`,
                        display: `${study}_hist2`,
                        panel,
                        yAxis,
                    });
                    dupMap[`${study}_hist`] = 1;
                }
            }
        }
        const rows = [];
        for (let f = 0; f < fields.length; f++) {
            let obj = fields[f];
            let name = obj.member;
            let displayName = obj.display;
            panel = obj.panel;
            yAxis = obj.yAxis;
            let labelDecimalPlaces = null;
            if (yAxis) {
                if (panel !== panel.chart.panel) {
                    // If a study panel, use yAxis settings to determine decimal places
                    if (yAxis.decimalPlaces || yAxis.decimalPlaces === 0) {
                        labelDecimalPlaces = yAxis.decimalPlaces;
                    } else if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0) { labelDecimalPlaces = yAxis.maxDecimalPlaces; }
                } else {
                    // If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
                    // but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
                    labelDecimalPlaces = Math.max(yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
                    // ... and never display more decimal places than the symbol is supposed to be quoting at
                    if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0) { labelDecimalPlaces = Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces); }
                }
            }
            let dsField = null;
            // account for object chains
            let tuple = CIQ.existsInObjectChain(data, name);
            if (tuple) {
                dsField = tuple.obj[tuple.member];
            } else if (name == 'Change') { dsField = data.Close - data.iqPrevClose; }

            let fieldName = displayName.replace(/^(Result )(.*)/, '$2');
            if ((dsField || dsField === 0) &&
                (name == 'DT' || typeof dsField !== 'object' || dsField.Close || dsField.Close === 0)
            ) {
                let fieldValue = '';
                if (dsField.Close || dsField.Close === 0) { dsField = dsField.Close; }
                if (dsField.constructor == Number) {
                    if (!yAxis) { // raw value
                        fieldValue = dsField;
                    } else if (yAxis.originalPriceFormatter && yAxis.originalPriceFormatter.func) { // in comparison mode with custom formatter
                        fieldValue = yAxis.originalPriceFormatter.func(stx, panel, dsField, labelDecimalPlaces);
                    } else if (yAxis.priceFormatter && yAxis.priceFormatter != CIQ.Comparison.priceFormat) { // using custom formatter
                        fieldValue = yAxis.priceFormatter(stx, panel, dsField, labelDecimalPlaces);
                    } else {
                        fieldValue = stx.formatYAxisPrice(dsField, panel, labelDecimalPlaces, yAxis);
                    }
                } else if (dsField.constructor == Date) {
                    if (name == 'DT' && stx.controls.floatDate && stx.controls.floatDate.innerHTML) {
                        if (CIQ.ChartEngine.hideDates()) {
                            continue;
                        } else {
                            fieldValue = stx.controls.floatDate.innerHTML;
                        }
                    } else {
                        fieldValue = CIQ.yyyymmdd(dsField);
                        if (!CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
                            fieldValue += ` ${dsField.toTimeString()
                                .substr(0, 8)}`;
                        }
                    }
                } else {
                    fieldValue = dsField;
                }

                rows.push({
                    name: fieldName.toUpperCase(),
                    value: fieldValue,
                });
            }
        }
        this.setRows(rows);
        this.render();
    }
}

class CrosshairStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }


    @observable top = 0;
    @observable left = -50000;
    @observable right = 'auto';
    @observable rows = [];
    tooltip = null;
    node = null;
    @observable state = 0;

    @action.bound setRows(rows) { this.rows = rows; }
    @action.bound hide() {
        this.top = 0;
        this.left = -50000;
        this.right = 'auto';
    }
    @action.bound show({ top, left, right }) {
        this.top = top;
        this.left = left;
        this.right = right;
    }

    setRootRef = (ref) => {
        this.node = ref;
        this.init();
    };

    init = () => {
        if (!this.tooltip && this.context && this.node) {
            this.tooltip = new Tooltip({
                stx: this.stx,
                node: this.node,
                setRows: this.setRows,
                hide: this.hide,
                show: this.show,
            });
        }
    };

    onContextReady = () => {
        let storedState = this.stx.layout.crosshair;
        this.state = (typeof storedState !== 'number') ? 0 : storedState;
        this.init();
    };

    @action.bound toggleState() {
        this.state = (this.state + 1) % 3;
        this.stx.layout.crosshair = this.state;
        this.stx.doDisplayCrosshairs();
        this.mainStore.chart.saveLayout();
    }
}

export default CrosshairStore;
