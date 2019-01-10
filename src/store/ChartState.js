/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import { createObjectFromLocalStorage, calculateTimeUnitInterval, calculateGranularity } from '../utils';

class ChartState {
    @observable granularity;
    @observable chartType;
    @observable startEpoch;
    @observable endEpoch;
    @observable symbol;
    @observable isConnectionOpened;
    @observable settings;
    get stxx() { return this.chartStore.stxx; }
    get context() { return this.chartStore.context; }

    constructor(mainStore) {
        this.chartStore = mainStore.chart;
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stxx.addEventListener('layout', this.saveLayout.bind(this));
        this.stxx.addEventListener('symbolChange', this.saveLayout.bind(this));
        this.stxx.addEventListener('drawing', this.saveDrawings.bind(this));

        setTimeout(() => {
            const markerTypes = ['dividend', 'news', 'earnings'];
            let newNode;

            // for (let i = this.stxx.masterData.length - 20; i < this.stxx.masterData.length; i++) {
            //     const point = this.stxx.masterData[i];
            //     // #####################
            //     // #####################
            //     const r = Math.floor(Math.random() * (markerTypes.length + 1));
            //     if (r === markerTypes.length) continue; // randomize
            //     newNode = document.getElementById('stxEventPrototype').cloneNode(true);
            //     newNode.id = null;
            //     newNode.innerHTML = ' ';
            //     CIQ.appendClassName(newNode, markerTypes[0]);

            //     console.log(this.stxx.masterData[i].DT.getTime() - this.stxx.masterData[i - 1].DT.getTime());

            //     new CIQ.Marker({
            //         stx: this.stxx,
            //         xPositioner: 'date',
            //         x: point.DT,
            //         label: 'events',
            //         node: newNode,
            //     });
            //     // #####################
            //     // #####################
            //     const epoch = (point.DT.getTime() + 500);
            //     this.stxx.updateChartData(
            //         [
            //             {
            //                 Date: (new Date(epoch + 200)),
            //                 Close: null,
            //                 Volume: 4505569,
            //             },
            //         ],
            //         null,
            //         { useAsLastSale:true },
            //     );
            // }
            // this.stxx.draw();
            const masterData = this.stxx.masterData;

            for (let i = masterData.length - 20; i < masterData.length; i++) {
                const point = masterData[i];

                newNode = document.getElementById('stxEventPrototype').cloneNode(true);
                newNode.id = null;
                newNode.innerHTML = i;
                CIQ.appendClassName(newNode, markerTypes[0]);
                new CIQ.Marker({
                    stx: this.stxx,
                    xPositioner: 'date',
                    x: point.DT,
                    label: 'events',
                    node: newNode,
                });


                const epoch = (point.DT.getTime() + 500);
                this.stxx.updateChartData(
                    {
                        Date: (new Date(epoch)),
                        Close: null,
                        // Volume: null,
                    },
                    null,
                    { useAsLastSale: true, fillGaps: true },
                );
            }
            this.stxx.createDataSet();
            this.stxx.draw();

            setTimeout(() => {
                for (let i = masterData.length - 20; i < masterData.length; i++) {
                    const point = masterData[i];
                    // #####################
                    // #####################
                    // console.log(this.stxx.masterData[i].DT.getTime() - this.stxx.masterData[i - 1].DT.getTime());

                    // newNode = document.getElementById('stxEventPrototype').cloneNode(true);
                    // newNode.id = null;
                    // newNode.innerHTML = i;
                    // CIQ.appendClassName(newNode, markerTypes[0]);
                    // new CIQ.Marker({
                    //     stx: this.stxx,
                    //     xPositioner: 'date',
                    //     x: point.DT,
                    //     label: 'events',
                    //     node: newNode,
                    // });


                    // #####################
                    // #####################
                    const epoch = (point.DT.getTime() + 500);
                    console.log(epoch);


                    // this.stxx.updateChartData(
                    //     [
                    //         {
                    //             Date: (new Date(epoch)),
                    //             Close: null,
                    //             Volume: null,
                    //         },
                    //     ],
                    //     null,
                    //     { useAsLastSale:true },
                    // );


                    newNode = document.getElementById('stxEventPrototype').cloneNode(true);
                    newNode.id = null;
                    newNode.innerHTML = i;
                    CIQ.appendClassName(newNode, markerTypes[1]);
                    new CIQ.Marker({
                        stx: this.stxx,
                        xPositioner: 'date',
                        x: (new Date(epoch)),
                        label: 'new-point',
                        node: newNode,
                    });
                }
                this.stxx.draw();
            }, 800);
        }, 800);
    };

    @action.bound updateProps({ id, settings, isConnectionOpened, symbol, granularity, chartType, startEpoch, endEpoch, isAnimationEnabled = true }) {
        this.chartId = id;
        this.settings = settings;
        this.isConnectionOpened = isConnectionOpened;
        this.symbol = symbol;
        this.granularity = granularity;
        this.chartType = chartType;
        this.startEpoch = startEpoch;
        this.endEpoch = endEpoch;
        this.isAnimationEnabled = isAnimationEnabled;
    }

    saveLayout() {
        if (!this.chartId) return;
        const layoutData = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        CIQ.localStorageSetItem(`layout-${this.chartId}`, json);
    }

    // returns false if restoring layout fails
    restoreLayout() {
        let layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);

        if (!layoutData) return false;

        // prop values will always take precedence
        if (this.symbol !== undefined && this.symbol !== layoutData.symbols[0].symbol) {
            // symbol prop takes precedence over local storage data
            const symbolObject = this.chartStore.activeSymbols.getSymbolObj(this.symbol);
            layoutData.symbols = [{ symbol: this.symbol, symbolObject }];
        }

        for (const symbolDat of layoutData.symbols) {
            // Symbol from cache may be in different language, so replace it with server's
            const { symbol: cachedSymbol } = symbolDat;
            const updatedSymbol = this.chartStore.activeSymbols.getSymbolObj(cachedSymbol);
            symbolDat.symbolObject = updatedSymbol;
            if (symbolDat.parameters) {
                symbolDat.parameters.display = updatedSymbol.name;

                // These gap settings are default when new comparisons are added,
                // but for backward support we need to set them here.
                symbolDat.parameters.fillGaps = true;
                symbolDat.parameters.gapDisplayStyle = true;
            }
        }

        if (this.granularity !== undefined) {
            const periodicity = calculateTimeUnitInterval(this.granularity);
            layoutData = { ...layoutData, ...periodicity };
        } else {
            // update this.granularity with chartLayout
            const { timeUnit, interval } = layoutData;
            if (timeUnit) {
                this.chartStore.granularity = calculateGranularity(interval, timeUnit);
            } else {
                this.chartStore.granularity = 86400; // 1 day
            }
        }

        if (this.startEpoch || this.endEpoch) {
            // already set in chart params
            delete layoutData.span;
            delete layoutData.range;
        }

        if (this.chartType !== undefined) {
            layoutData.chartType = this.chartType;
        }

        this.stxx.importLayout(layoutData, {
            managePeriodicity: true,
            cb: () => {
                if (layoutData.tension) {
                    this.stxx.chart.tension = layoutData.tension;
                }
                this.restoreDrawings(this.stxx, this.stxx.chart.symbol);
                if (this.chartStore.loader) {
                    this.chartStore.loader.hide();
                }

                this.chartStore.setMainSeriesDisplay(this.stxx.chart.symbolObject.name);
            },
        });

        this.chartStore.updateCurrentActiveSymbol();

        return true;
    }

    saveDrawings() {
        if (!this.chartId) return;
        const obj = this.stxx.exportDrawings();
        const symbol = this.stxx.chart.symbol;
        if (obj.length === 0) {
            CIQ.localStorage.removeItem(`${symbol}-${this.chartId}`);
        } else {
            CIQ.localStorageSetItem(`${symbol}-${this.chartId}`, JSON.stringify(obj));
        }
    }

    restoreDrawings() {
        const drawings = createObjectFromLocalStorage(`${this.stxx.chart.symbol}-${this.chartId}`);
        if (drawings) {
            this.stxx.importDrawings(drawings);
            this.stxx.draw();
        }
    }
}

export default ChartState;
