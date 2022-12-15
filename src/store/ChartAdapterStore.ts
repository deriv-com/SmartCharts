import { action, makeObservable, observable, when } from 'mobx';
import moment from 'moment';
import { TDartInteop, TQuote } from 'src/types';
import MainStore from './';

export default class ChartAdapterStore {
    private mainStore: MainStore;
    iframeElement?: HTMLIFrameElement;
    isChartLoaded = false;
    isDataInitialized = false;
    dartInterop?: TDartInteop;
    epochBounds = {
        leftEpoch: 0,
        rightEpoch: 0,
    };
    quoteBounds = {
        topQuote: 0,
        bottomQuote: 0,
    };

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            setIFrameElement: action.bound,
            onMessage: action.bound,
            onTickHistory: action.bound,
            onTick: action.bound,
            loadHistory: action.bound,
            onVisibleAreaChanged: action.bound,
            onQuoteAreaChanged: action.bound,
            isChartLoaded: observable,
            isDataInitialized: observable,
            epochBounds: observable.ref,
            quoteBounds: observable.ref,
        });

        this.mainStore = mainStore;

        // @ts-ignore
        window.jsInterop = {
            postMessage: this.onMessage,
            onChartLoad: this.onChartLoad,
            onVisibleAreaChanged: this.onVisibleAreaChanged,
            onQuoteAreaChanged: this.onQuoteAreaChanged,
        };
    }

    setIFrameElement(element: HTMLIFrameElement) {
        this.iframeElement = element;
    }

    onChartLoad() {
        // @ts-ignore
        this.dartInterop = this.iframeElement?.contentWindow.dartInterop;
        this.isChartLoaded = true;
    }

    onVisibleAreaChanged(leftEpoch: number, rightEpoch: number) {
        if (this.epochBounds.leftEpoch != leftEpoch || this.epochBounds.rightEpoch != rightEpoch) {
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

    onMessage(data: string) {
        const message = JSON.parse(data);

        switch (message?.type) {
            case 'ON_LOAD':
                this.onChartLoad();
                break;
            case 'LOAD_HISTORY':
                this.loadHistory(message.payload);
                break;
        }
    }

    async postMessage(message: any) {
        await when(() => this.isChartLoaded);
        console.log(message);
        // @ts-ignore
        this.dartInterop?.postMessage(JSON.stringify(message));
    }

    getGranularity() {
        let granularity: number =
            this.mainStore.state.granularity || this.mainStore.chart.feed?.getQuotesInterval() || 1;

        return granularity * 1000;
    }

    newChart = () => {
        const message = {
            type: 'NEW_CHART',
            payload: {
                granularity: this.getGranularity(),
                isLive: this.mainStore.chart.isLive || false,
                dataFitEnabled: this.mainStore.chart.dataFitEnabled || false,
            },
        };

        this.postMessage(message);
    };

    onTickHistory(quotes: TQuote[]) {
        const message = {
            type: 'TICKS_HISTORY',
            payload: quotes,
        };
        this.mainStore.chart.feed?.updateQuotes(quotes, false);

        this.isDataInitialized = true;

        this.postMessage(message);
    }

    onTick(quote: TQuote) {
        let message;

        if (quote.ohlc) {
            message = {
                type: 'CANDLE',
                payload: quote,
            };
        } else {
            message = {
                type: 'TICK',
                payload: quote,
            };
        }
        this.mainStore.chart.feed?.addQuote(quote);

        this.postMessage(message);
    }

    loadHistory(payloadString: string) {
        const payload: { count: number; end: number } = JSON.parse(payloadString);
        const { count, end } = payload;
        const { state, chart } = this.mainStore;
        const { granularity } = state;

        chart.feed?.fetchPaginationData(
            chart.currentActiveSymbol?.symbol as string,
            end,
            count,
            granularity,
            ({ quotes }) => {
                const message = {
                    type: 'PREPEND_TICKS_HISTORY',
                    payload: quotes,
                };

                if (quotes) {
                    this.mainStore.chart.feed?.updateQuotes(quotes, true);
                }

                this.postMessage(message);
            }
        );
    }

    updateChartStyle(chartType?: string) {
        const chartStyle = chartType === 'mountain' ? 'line' : 'candles';
        const message = {
            type: 'UPDATE_CHART_STYLE',
            payload: chartStyle,
        };

        this.postMessage(message);
    }

    updateTheme(theme: string) {
        const message = {
            type: 'UPDATE_THEME',
            payload: theme,
        };

        this.postMessage(message);
    }

    scale(scale: number) {
        const message = {
            type: 'SCALE_CHART',
            payload: scale,
        };

        this.postMessage(message);
    }

    async updateMarkers(contracts_marker: any[]) {
        // console.log('markers_array', markers_array);

        const transformedContractsMarker = contracts_marker
            .filter(c => c.markers?.length > 0)
            .map(c => {
                c.markers.forEach((m: any) => {
                    if (!m.quote) {
                        const { price } = this.getInterpolatedPositionAndPrice(m.epoch) || {};
                        m.quote = price;
                    }
                });
                return c;
            });

        const message = {
            type: 'UPDATE_MARKERS',
            payload: transformedContractsMarker,
        };

        await when(() => this.isDataInitialized);

        this.postMessage(message);
    }

    getInterpolatedPositionAndPrice = (epoch: number) => {
        if (!epoch) return;

        const date = moment.utc(epoch).toDate();

        let tickIdx = this.mainStore.chart.feed?.getClosestQuoteIndexForEpoch(epoch);

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

    getXFromEpoch(epoch: number) {
        return this.dartInterop!.chartConfig.getXFromEpoch(epoch);
    }

    getYFromQuote(quote: number) {
        return this.dartInterop!.chartConfig.getYFromQuote(quote);
    }

    getEpochFromX(x: number) {
        return this.dartInterop!.chartConfig.getEpochFromX(x);
    }

    getQuoteFromY(x: number) {
        return this.dartInterop!.chartConfig.getQuoteFromY(x);
    }
}
