import { action, makeObservable, observable, when } from 'mobx';
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
        console.log('isChartLoaded', true);
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
        console.log(data);
        const message = JSON.parse(data);
        console.log(message);
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
        if (this.isChartLoaded) {
            console.log(message);
            // @ts-ignore
            this.dartInterop?.postMessage(JSON.stringify(message));
        } else {
            await when(() => this.isChartLoaded);
            console.log(message);

            // @ts-ignore
            this.dartInterop?.postMessage(JSON.stringify(message));
        }
    }

    newChart() {
        const message = {
            type: 'NEW_CHART',
            payload: {
                granularity: this.mainStore.state.granularity || 0,
                isLive: this.mainStore.chart.isLive || false,
            },
        };

        this.postMessage(message);
    }

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

    async updateMarkers(markers_array: any[]) {
        // console.log('markers_array', markers_array);

        const transformedMarkers = markers_array.filter(m => m.markers?.length > 0);

        const message = {
            type: 'UPDATE_MARKERS',
            payload: transformedMarkers,
        };

        await when(() => this.isDataInitialized);

        this.postMessage(message);
    }

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
