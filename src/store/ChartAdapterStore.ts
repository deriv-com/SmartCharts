import { action, makeObservable, observable, when } from 'mobx';
import { TBarrierUpdateProps, TMessage, TQuote } from 'src/types';
import MainStore from './';

export default class ChartAdapterStore {
    private mainStore: MainStore;
    iframeElement?: HTMLIFrameElement;
    isIframeLoaded = false;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            setIFrameElement: action.bound,
            onMessage: action.bound,
            onTickHistory: action.bound,
            onTick: action.bound,
            loadHistory: action.bound,
            isIframeLoaded: observable,
        });

        this.mainStore = mainStore;
    }

    setIFrameElement(element: HTMLIFrameElement) {
        this.iframeElement = element;
    }

    onIframeLoad() {
        this.isIframeLoaded = true;
    }

    onMessage(ev: MessageEvent) {
        const message = ev.data as TMessage;
        console.log(message);
        switch (message.type) {
            case 'ON_LOAD':
                this.onIframeLoad();
                break;
            case 'LOAD_HISTORY':
                this.loadHistory(message.payload);
                break;
            case 'BARRIER_DRAG':
                this.onBarrierDrag(message.payload);
                break;
        }
    }

    async postMessage(message: any) {
        if (this.isIframeLoaded) {
            console.log(message);
            this.iframeElement?.contentWindow?.postMessage(message, '*');
        } else {
            await when(() => this.isIframeLoaded);
            console.log(message);
            this.iframeElement?.contentWindow?.postMessage(message, '*');
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

    updateBarriers(barriers: TBarrierUpdateProps[]) {
        const transformedBarriers = barriers.map(barrier => ({
            shade: barrier.shade,
            color: barrier.color,
            title: barrier.title,
            high: barrier.high,
            low: barrier.low,
            key: barrier.key,
            relative: barrier.relative,
            draggable: barrier.draggable,
        }));

        const message = {
            type: 'UPDATE_BARRIERS',
            payload: transformedBarriers,
        };
        this.postMessage(message);
    }

    updateMarkers(markers_array: any[]) {
        console.log('markers_array', markers_array);

        const transformedMarkers = markers_array.filter(m => m.price_array?.length > 0);

        const message = {
            type: 'UPDATE_MARKERS',
            payload: transformedMarkers,
        };

        this.postMessage(message);
    }

    onBarrierDrag(payloadString: string) {
        const payload: { high: number } = JSON.parse(payloadString);

        const draggableBarrier = this.mainStore.state.barriers?.find(b => b.draggable === true);

        console.log('change', payload, payload.high);

        if (draggableBarrier) {
            draggableBarrier.onChange({ high: payload.high });
        }
    }
}
