class Notifier {
    static get CATEGORY_ACTIVE_SYMBOL() {
        return 'activesymbol';
    }
    onMessage: any;

    /*
     * a Notification object has the following structure:
     * {
     *     text, // displayed messages
     *     type, // message type; choose from `info`, `warning`, `success`, `error`. Defaults to `warning`
     *     category, // choose from `activesymbol`
     * }
     */
    notify(notification: any) {
        if (this.onMessage) {
            this.onMessage({
                type: 'warning',
                ...notification,
            });
        }
    }

    notifyMarketOpen(symbol: any) {
        this.notify({
            text: t.translate('[symbol] market is now opened.', { symbol }),
            type: 'info',
            category: Notifier.CATEGORY_ACTIVE_SYMBOL,
        });
    }

    notifyMarketClose(symbol: any) {
        this.notify({
            text: t.translate('[symbol] market is presently closed.', { symbol }),
            category: Notifier.CATEGORY_ACTIVE_SYMBOL,
        });
    }

    notifyDelayedMarket(symbol: any, delay: any) {
        this.notify({
            text: t.translate('[symbol] feed is delayed by [delay] minutes', { symbol, delay }),
            category: Notifier.CATEGORY_ACTIVE_SYMBOL,
        });
    }

    notifyFeedUnavailable(symbol: any) {
        this.notify({
            text: t.translate('Streaming for [symbol] is not available due to license restrictions', { symbol }),
            type: 'error',
            category: Notifier.CATEGORY_ACTIVE_SYMBOL,
        });
    }
}

export default Notifier;
