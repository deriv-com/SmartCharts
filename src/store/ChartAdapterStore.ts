import { action, makeObservable } from 'mobx';
import { TMessage, TQuote } from 'src/types';
import MainStore from './';

export default class ChartAdapterStore {
    private mainStore: MainStore;
    iframeElement?: HTMLIFrameElement;
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            setIFrameElement: action.bound,
            onMessage: action.bound,
            onTickHistory: action.bound,
            onTick: action.bound,
            loadHistory: action.bound,
        });

        this.mainStore = mainStore;
    }

    setIFrameElement(element: HTMLIFrameElement) {
        this.iframeElement = element;
    }

    onMessage(ev: MessageEvent) {
        const message = ev.data as TMessage;
        switch (message.type) {
            case 'LOAD_HISTORY':
                this.loadHistory(message.payload);
                break;
        }
    }

    newChart() {
        const message = {
            type: 'NEW_CHART',
            payload: {
                granularity: this.mainStore.state.granularity,
            },
        };
        console.log(message);
        this.iframeElement?.contentWindow?.postMessage(message, '*');
    }

    onTickHistory(quotes: TQuote[]) {
        const message = {
            type: 'TICKS_HISTORY',
            payload: quotes,
        };
        console.log(message);
        this.iframeElement?.contentWindow?.postMessage(message, '*');
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
        this.iframeElement?.contentWindow?.postMessage(message, '*');
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
                console.log(message);
                this.iframeElement?.contentWindow?.postMessage(message, '*');
            }
        );
    }

    updateChartStyle(chartType?: string) {
        const chartStyle = chartType === 'mountain' ? 'line' : 'candles';
        const message = {
            type: 'UPDATE_CHART_STYLE',
            payload: chartStyle,
        };
        console.log(message);
        this.iframeElement?.contentWindow?.postMessage(message, '*');
    }
}
