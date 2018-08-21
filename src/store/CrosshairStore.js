import { action, observable, when } from 'mobx';
import { sameBar } from '../utils';

class CrosshairStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get showOhl() {
        return this.stx.layout.timeUnit !== 'second';
    }

    get context() {
        return this.mainStore.chart.context;
    }

    get stx() {
        return this.context.stx;
    }


    @observable top = 0;
    @observable left = -50000;
    @observable rows = [];
    @observable state = 0;
    @observable isArrowLeft = true;
    node = null;
    lastBar = {};
    showChange = false;
    showSeries = true;
    showStudies = true;

    hide = () => {
        this.top = 0;
        this.left = -50000;
    };

    setRootRef = (ref) => {
        this.node = ref;
    };

    onContextReady = () => {
        const storedState = this.stx.layout.crosshair;
        this.state = (typeof storedState !== 'number') ? 0 : storedState;
        this.stx.append('headsUpHR', this.renderCrosshairTooltip);
        this.stx.append('createDataSegment', this.renderCrosshairTooltip);
    };

    @action.bound toggleState() {
        this.state = (this.state + 1) % 3;
        this.stx.layout.crosshair = this.state;
        this.stx.doDisplayCrosshairs();
        this.mainStore.state.saveLayout();
    }

    @action.bound renderCrosshairTooltip() {
        // if no tooltip exists, then skip
        if (this.state !== 2) return;

        const { stx } = this;
        const { crossX, crossY } = stx.controls;
        // crosshairs are not on
        if ((crossX && crossX.style.display === 'none')
            || (crossY && crossY.style.display === 'none')
        ) {
            return;
        }

        const bar = stx.barFromPixel(stx.cx);
        const data = stx.chart.dataSegment[bar];
        if (!data) {
            this.hide();
            return;
        }

        const showOverBarOnly = false;

        let goodBar;
        let overBar = true;
        let highPx,
            lowPx;


        if (data !== undefined && data && data.DT) {
            goodBar = true;
            if (data.High) {
                highPx = stx.pixelFromPrice(data.High);
            }
            if (data.Low) {
                lowPx = stx.pixelFromPrice(data.Low);
            }
            if (!stx.highLowBars[stx.layout.chartType]) {
                if (data.Close) {
                    highPx = stx.pixelFromPrice(data.Close) - 15;
                    lowPx = stx.pixelFromPrice(data.Close) + 15;
                }
            }
            if (showOverBarOnly && !(stx.cy >= highPx && stx.cy <= lowPx)) {
                overBar = false;
            }
        }

        if (!(CIQ.ChartEngine.insideChart
            && stx.layout.crosshair
            && stx.displayCrosshairs
            && !stx.overXAxis
            && !stx.overYAxis
            && !stx.openDialog
            && !stx.activeDrawing
            && !stx.grabbingScreen
            && goodBar
            && overBar)
        ) {
            this.hide();
            this.lastBar = {};
            return;
        }

        if (!(sameBar(data, this.lastBar) && bar !== stx.chart.dataSegment.length - 1)) {
            this.updateRows(data);
            this.lastBar = data;
        }

        this.updateTooltipPosition();
    }

    updateRows(data) {
        const { stx } = this;
        const dupMap = {};
        const fields = [];
        { // Access main chart panel and yAxis in this scope:
            const { panel } = stx.chart;
            const { yAxis } = panel;
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
                for (const el of ['Open', 'Close', 'High', 'Low']) {
                    fields.push({
                        member: el,
                        display: el,
                        panel,
                        yAxis,
                    });
                }
                dupMap.Open = dupMap.High = dupMap.Low = 1;
            }
        }
        if (this.showSeries) {
            const renderers = stx.chart.seriesRenderers;
            for (const renderer in renderers) {
                const rendererToDisplay = renderers[renderer];
                const panel = stx.panels[rendererToDisplay.params.panel];
                let { yAxis } = rendererToDisplay.params;
                if (!yAxis && rendererToDisplay.params.shareYAxis) {
                    yAxis = panel.yAxis;
                }
                for (let id = 0; id < rendererToDisplay.seriesParams.length; id++) {
                    const seriesParams = rendererToDisplay.seriesParams[id];
                    // if a series has a symbol and a field then it maybe a object chain
                    let sKey = seriesParams.symbol;
                    const subField = seriesParams.field;
                    if (!sKey) {
                        sKey = subField;
                    } else if (subField && sKey !== subField) {
                        sKey = CIQ.createObjectChainNames(sKey, subField)[0];
                    }
                    const display = seriesParams.display || seriesParams.symbol || seriesParams.field;
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
            const { studies } = stx.layout;
            for (const study in studies) {
                const panel = stx.panels[studies[study].panel];
                const yAxis = panel.yAxis;
                for (const output in studies[study].outputMap) {
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
                const hist = `${study}_hist`;
                if (!dupMap[hist]) {
                    fields.push({
                        member: hist,
                        display: hist,
                        panel,
                        yAxis,
                    });
                    const hist1 = `${study}_hist1`;
                    const hist2 = `${study}_hist2`;
                    fields.push({
                        member: hist1,
                        display: hist1,
                        panel,
                        yAxis,
                    });
                    fields.push({
                        member: hist2,
                        display: hist2,
                        panel,
                        yAxis,
                    });
                    dupMap[hist] = 1;
                }
            }
        }
        const rows = [];
        for (const obj of fields) {
            const { member: name, display: displayName, panel, yAxis } = obj;
            let labelDecimalPlaces = null;
            if (yAxis) {
                if (panel !== panel.chart.panel) {
                    // If a study panel, use yAxis settings to determine decimal places
                    if (yAxis.decimalPlaces || yAxis.decimalPlaces === 0) {
                        labelDecimalPlaces = yAxis.decimalPlaces;
                    } else if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0) {
                        labelDecimalPlaces = yAxis.maxDecimalPlaces;
                    }
                } else {
                    // If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
                    // but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
                    labelDecimalPlaces = Math.max(yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
                    // ... and never display more decimal places than the symbol is supposed to be quoting at
                    if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0) {
                        labelDecimalPlaces = Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces);
                    }
                }
            }
            let dsField = null;
            // account for object chains
            const tuple = CIQ.existsInObjectChain(data, name);
            if (tuple) {
                dsField = tuple.obj[tuple.member];
            } else if (name === 'Change') {
                dsField = data.Close - data.iqPrevClose;
            }

            const fieldName = displayName.replace(/^(Result )(.*)/, '$2');
            if ((dsField || dsField === 0)
                && (name === 'DT' || typeof dsField !== 'object' || dsField.Close || dsField.Close === 0)
            ) {
                let fieldValue = '';
                if (dsField.Close || dsField.Close === 0) {
                    dsField = dsField.Close;
                }
                if (dsField.constructor === Number) {
                    if (!yAxis) { // raw value
                        fieldValue = dsField;
                    } else if (yAxis.originalPriceFormatter && yAxis.originalPriceFormatter.func) { // in comparison mode with custom formatter
                        fieldValue = yAxis.originalPriceFormatter.func(stx, panel, dsField, labelDecimalPlaces);
                    } else if (yAxis.priceFormatter && yAxis.priceFormatter !== CIQ.Comparison.priceFormat) { // using custom formatter
                        fieldValue = yAxis.priceFormatter(stx, panel, dsField, labelDecimalPlaces);
                    } else {
                        fieldValue = stx.formatYAxisPrice(dsField, panel, labelDecimalPlaces, yAxis);
                    }
                } else if (dsField.constructor === Date) {
                    const { floatDate } = stx.controls;
                    if (name === 'DT' && floatDate && floatDate.innerHTML) {
                        if (stx.chart.xAxis.noDraw) {
                            continue;
                        } else {
                            fieldValue = floatDate.innerHTML;
                        }
                    } else {
                        fieldValue = CIQ.yyyymmdd(dsField);
                        if (!CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
                            fieldValue += ` ${dsField.toTimeString().substr(0, 8)}`;
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

        this.rows = rows;
    }

    updateTooltipPosition() {
        const offset = 30;
        const width = this.node.offsetWidth + offset;
        let left = null;
        if (width < CIQ.ChartEngine.crosshairX) {
            this.isArrowLeft = false;
            left = (this.stx.cx - width);
        } else {
            this.isArrowLeft = true;
            left = (this.stx.cx + offset);
        }
        this.top = (CIQ.ChartEngine.crosshairY - this.stx.top) | 0;
        this.left = left | 0;
    }
}

export default CrosshairStore;
