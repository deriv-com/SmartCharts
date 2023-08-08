import { action, makeObservable, observable, when } from 'mobx';
import moment from 'moment';
import { TFlutterChart, TLoadHistoryParams, TQuote } from 'src/types';
import { createChartElement } from 'src/flutter-chart';
import Painter from 'src/flutter-chart/painter';
import MainStore from '.';

export default class ChartAdapterStore {
    private mainStore: MainStore;
    isChartLoaded = false;
    flutterChart?: TFlutterChart;
    epochBounds = {
        leftEpoch: 0,
        rightEpoch: 0,
    };
    quoteBounds = {
        topQuote: 0,
        bottomQuote: 0,
    };
    isFeedLoaded = false;
    msPerPx?: number;
    hoverIndex: number | undefined | null = null;
    isDataFitModeEnabled = false;
    painter = new Painter();
    clickEventCount = 0;
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            onMount: action.bound,
            onTickHistory: action.bound,
            onChartLoad: action.bound,
            onTick: action.bound,
            loadHistory: action.bound,
            onVisibleAreaChanged: action.bound,
            onQuoteAreaChanged: action.bound,
            setMsPerPx: action.bound,
            newChart: action.bound,
            scale: action.bound,
            toggleDataFitMode: action.bound,
            isDataFitModeEnabled: observable,
            isChartLoaded: observable,
            epochBounds: observable.ref,
            quoteBounds: observable.ref,
            msPerPx: observable,
            isFeedLoaded: observable,
        });

        this.mainStore = mainStore;

        this.initFlutterCharts();
    }

    initFlutterCharts() {
        window.jsInterop = {
            onChartLoad: this.onChartLoad,
            onMainSeriesPaint: this.painter.onPaint,
            onVisibleAreaChanged: this.onVisibleAreaChanged,
            onQuoteAreaChanged: this.onQuoteAreaChanged,
            loadHistory: this.loadHistory,
            onCrosshairDisappeared: () => {
                this.mainStore.crosshair.updateVisibility(false);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onCrosshairHover: (dx, dy, dxLocal, dyLocal, _indicatorIndex) => {
                // dxLocal and dyLocal are the local position value correponding to the bottom indicator/main chart
                const epoch = this.flutterChart?.crosshair.getEpochFromX(dxLocal) || 0;
                const quote = (this.flutterChart?.crosshair.getQuoteFromY(dyLocal) || 0).toFixed(
                    this.mainStore.crosshair.decimalPlaces
                );
                const handleClickEvent = (e: Event) => {
                    if (this.hoverIndex != null) {
                        e.preventDefault();
                        this.mainStore.studies.editStudyByIndex(this.hoverIndex);
                    }
                };

                function updateEventListener(condition: boolean) {
                    if (condition) {
                        document
                            .getElementsByClassName('chartContainer')[0]
                            .addEventListener('contextmenu', handleClickEvent);
                    } else {
                        document
                            .getElementsByClassName('chartContainer')[0]
                            .removeEventListener('contextmenu', handleClickEvent);
                    }
                }

                this.mainStore.crosshair.onMouseMove(dxLocal, dyLocal, epoch, quote);
                const getClosestEpoch = this.mainStore.chart.feed?.getClosestValidEpoch;
                const granularity = this.mainStore.chartAdapter.getGranularityInMs();

                const configIndex: null | number | undefined = this.flutterChart?.app.getIndicatorHoverIndex(
                    dxLocal,
                    dyLocal,
                    getClosestEpoch,
                    granularity,
                    _indicatorIndex
                );

                this.hoverIndex = configIndex;
                const chartConfigList = localStorage.getItem('chart-layout-trade');

                if (chartConfigList) {
                    const indicatorConfig = JSON.parse(chartConfigList!);

                    if (configIndex != null) {
                        const item = indicatorConfig.studyItems[configIndex];
                        if (item.config) {
                            for (const key in item.config) {
                                if (key.includes('Style')) {
                                    item.config[key].thickness = 2;
                                    if (key === 'scatterStyle') {
                                        item.config[key].radius = 2.5;
                                    }
                                }

                                if (key.includes('Styles')) {
                                    item.config[key].forEach(element => {
                                        element.thickness = 2;
                                    });
                                }
                            }
                            if (this.clickEventCount === 0) {
                                this.clickEventCount++;
                                updateEventListener(true);
                            }
                            this.mainStore.studies.addOrUpdateIndicator(item, configIndex);
                        }
                    } else if (indicatorConfig.studyItems.length > 0) {
                        for (let index = 0; index < indicatorConfig.studyItems.length; index++) {
                            const item = indicatorConfig.studyItems[index];
                            for (const keys in item.config) {
                                if (keys.includes('Style')) {
                                    item.config[keys].thickness = 1;
                                }
                                this.mainStore.studies.addOrUpdateIndicator(item, index);
                            }
                        }
                    }
                }
            },
            indicators: {
                onRemove: (index: number) => {
                    this.mainStore.studies.deleteStudy(index);
                },
                onEdit: (index: number) => {
                    this.mainStore.studies.editStudyByIndex(index);
                },
                onSwap: (index1: number, index2: number) => {
                    const { activeItems } = this.mainStore.studies;
                    [activeItems[index1], activeItems[index2]] = [activeItems[index2], activeItems[index1]];
                },
            },
        };

        createChartElement({
            onChartLoad: this.onChartLoad,
        });
    }

    onMount(element: HTMLDivElement) {
        element.appendChild(window.flutterChartElement);

        window.flutterChartElement?.addEventListener('wheel', this.onWheel, { capture: true });
    }

    onUnmount() {
        window.flutterChartElement?.removeEventListener('wheel', this.onWheel, { capture: true });
    }

    onChartLoad() {
        this.flutterChart = window.flutterChart;
        this.isChartLoaded = true;
    }

    onWheel = (e: WheelEvent) => {
        e.preventDefault();

        if (e.deltaX === 0 && e.deltaZ === 0) {
            const value = (100 - Math.min(10, Math.max(-10, e.deltaY))) / 100;
            this.scale(value);
        } else {
            window.flutterChart?.app.scroll(e.deltaX);
        }

        return false;
    };

    onVisibleAreaChanged(leftEpoch: number, rightEpoch: number) {
        if (this.epochBounds.leftEpoch !== leftEpoch || this.epochBounds.rightEpoch !== rightEpoch) {
            this.epochBounds = {
                leftEpoch,
                rightEpoch,
            };
        }
    }

    onQuoteAreaChanged(topQuote: number, bottomQuote: number) {
        this.quoteBounds = {
            topQuote,
            bottomQuote,
        };
    }

    getGranularityInMs() {
        const granularity: number = this.mainStore.state.granularity || 1;
        return granularity * 1000;
    }

    newChart = async () => {
        this.isFeedLoaded = false;
        this.isDataFitModeEnabled = this.mainStore.chart.startWithDataFitMode || false;

        await when(() => this.isChartLoaded);

        this.flutterChart?.app.newChart({
            granularity: this.getGranularityInMs(),
            chartType: this.mainStore.state.chartType,
            isLive: this.mainStore.chart.isLive || false,
            startWithDataFitMode: this.isDataFitModeEnabled,
            theme: this.mainStore.chartSetting.theme,
            msPerPx: this.msPerPx,
            pipSize: this.mainStore.chart.pip,
            isMobile: this.mainStore.chart.isMobile || false,
            yAxisMargin: this.mainStore.state.yAxisMargin,
        });
    };

    async onTickHistory(quotes: TQuote[]) {
        this.isFeedLoaded = true;

        await when(() => this.isChartLoaded);

        this.mainStore.chart.feed?.updateQuotes(quotes, false);
        this.flutterChart?.feed.onTickHistory(quotes, false);
    }

    async onTick(quote: TQuote) {
        await when(() => this.isChartLoaded);

        const lastQuote = this.mainStore.chart.feed?.quotes[this.mainStore.chart.feed?.quotes.length - 1];
        if (lastQuote && new Date(lastQuote.Date) > new Date(quote.Date)) return;

        this.mainStore.chart.feed?.addQuote(quote);

        if (quote.ohlc) {
            this.flutterChart?.feed.onNewCandle(quote);
        } else if (this.getGranularityInMs() < 60000) {
            this.flutterChart?.feed.onNewTick(quote);
        }
    }

    loadHistory(payload: TLoadHistoryParams) {
        const { count, end } = payload;
        const { state, chart } = this.mainStore;
        const { granularity } = state;

        chart.feed?.fetchPaginationData(
            chart.currentActiveSymbol?.symbol as string,
            end,
            count,
            granularity,
            ({ quotes }) => {
                this.mainStore.chart.feed?.updateQuotes(quotes || [], true);
                this.flutterChart?.feed.onTickHistory(quotes || [], true);
            }
        );
    }

    updateChartStyle(chartType: string) {
        this.flutterChart?.config.updateChartStyle(chartType);
    }

    async updateTheme(theme: string) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateTheme(theme);
    }

    async updateLeftMargin(leftMargin?: number) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateLeftMargin(leftMargin);
    }

    async updateLiveStatus(isLive: boolean) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.updateLiveStatus(isLive);
    }

    async setSymbolClosed(isClosed: boolean) {
        await when(() => this.isChartLoaded);
        this.flutterChart?.config.setSymbolClosed(isClosed);
    }

    scale(scale: number) {
        this.isDataFitModeEnabled = false;
        const msPerPx = this.flutterChart?.app.scale(scale);

        if (msPerPx != null) {
            this.setMsPerPx(msPerPx);
        }
    }

    toggleDataFitMode = () => {
        this.isDataFitModeEnabled = !this.isDataFitModeEnabled;
        window.flutterChart?.app.toggleDataFitMode(this.isDataFitModeEnabled);
    };

    async updateMarkers(contractsMarker: any[]) {
        const transformedContractsMarker = contractsMarker
            .filter(c => c.markers?.length > 0)
            .map(c => {
                c.markers.forEach((m: any) => {
                    if (!m.quote) {
                        const { price } = this.getInterpolatedPositionAndPrice(m.epoch * 1000) || {};
                        m.quote = price;
                    }
                });
                return c;
            });

        await when(() => this.isFeedLoaded);

        this.flutterChart?.config.updateMarkers(transformedContractsMarker);
    }

    getInterpolatedPositionAndPrice = (epoch: number) => {
        if (!epoch) return;

        const date = moment.utc(epoch).toDate();

        const tickIdx = this.mainStore.chart.feed?.getClosestQuoteIndexForEpoch(epoch);

        // To not place markers in the middle of ticks.
        let x: number = this.getXFromEpoch(epoch);

        if (typeof tickIdx === 'number' && tickIdx > -1) {
            const bar = this.mainStore.chart.feed?.quotes[tickIdx];

            let price = bar ? bar.Close : null;
            let delta_x, delta_y, ratio;

            // Here we interpolate the pixel distance between two adjacent ticks.
            if (bar && bar.DT! < date) {
                const barNext = this.mainStore.chart.feed?.quotes[tickIdx + 1];
                const barPrev = tickIdx > 0 ? this.mainStore.chart.feed?.quotes[tickIdx - 1] : null;

                if (barNext && barNext.Close && barNext.DT! > date) {
                    delta_x = this.getXFromEpoch(barNext.DT!.getTime()) - x;

                    ratio =
                        (((date as unknown) as number) - bar.DT!.getTime()) /
                        (barNext.DT!.getTime() - bar.DT!.getTime());

                    if (price) delta_y = barNext.Close - price;
                } else if (barPrev && barPrev.Close) {
                    delta_x = x - this.getXFromEpoch(barPrev.DT!.getTime());

                    ratio =
                        (((date as unknown) as number) - bar.DT!.getTime()) /
                        (bar.DT!.getTime() - barPrev.DT!.getTime());

                    if (price) delta_y = price - barPrev.Close;
                }
            }

            if (ratio) {
                if (delta_x) {
                    x += ratio * delta_x;
                }

                if (price && delta_y) {
                    price += ratio * delta_y;
                }
            }

            return {
                x,
                price,
            };
        }
    };

    setMsPerPx(msPerPx?: number) {
        this.msPerPx = msPerPx;
        this.mainStore.state.saveLayout();
    }

    getXFromEpoch(epoch: number) {
        return this.flutterChart?.app.getXFromEpoch(epoch) ?? 0;
    }

    getYFromQuote(quote: number) {
        return this.flutterChart?.app.getYFromQuote(quote) ?? 0;
    }

    getEpochFromX(x: number) {
        return this.flutterChart?.app.getEpochFromX(x) ?? 0;
    }

    getQuoteFromY(y: number) {
        return this.flutterChart?.app.getQuoteFromY(y) ?? 0;
    }
}
