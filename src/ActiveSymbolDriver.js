import Driver from './components/ui/Driver';

/**
 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
 * @memberof CIQ.UI.Lookup.Driver
 * @param {array} exchanges An array of ecxchanges that can be searched against
 */
class ActiveSymbolDriver extends Driver {
    constructor(symbols) {
        super();
        if (symbols) {
            this.symbols = symbols;
        }
    }

    _processSymbols(symbols) {
        let processedSymbols = [];
        const order = ['Forex', 'Indices', 'OTC Stocks', 'Commodities', 'Volatility Indices'];

        for (const s of symbols) {
            processedSymbols.push({
                data: {
                    symbol: s.symbol,
                    name: s.display_name,
                    market_display_name: s.market_display_name,
                    exchange_is_open: s.exchange_is_open,
                },
                display: [s.display_name],
            });
        }

        // Categorize symbols in order defined by another array; there's probably a more
        // efficient algo for this, but for just~100 items it's not worth the effort
        const orderedSymbols = [];
        for (const o of order) {
            for (const p of processedSymbols) {
                if (o === p.data.market_display_name) {
                    orderedSymbols.push(p);
                }
            }
        }
        return orderedSymbols;
    }

    set symbols(active_symbols) {
        this._symbols = this._processSymbols(active_symbols);
    }

    get symbols() {
        return this._symbols;
    }

    /**
     * @memberof CIQ.UI.Lookup.Driver.ChartIQ
     * @param {string} text Text to serach for
     * @param {string} filter Any filter to be applied to the search results
     * @param {number} maxResults Max number of results to return from the server
     * @param {function} callback Callback upon results
     */
    acceptText(text, filter, maxResults, callback) {
        if (!this._symbols) return [];

        const reg = RegExp(text, 'i');
        let result = [];
        let _filter = filter || 'All';

        for (const s of this._symbols) {
            const d = s.data;
            if (_filter !== 'All' && d.market_display_name !== _filter) continue;

            if (reg.test(d.symbol) || reg.test(d.name)) {
                result.push(s);
            }
        }

        callback(result);
    }
}

export default ActiveSymbolDriver;
