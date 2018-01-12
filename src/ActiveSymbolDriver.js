import Driver from './components/ui/Driver';
/**
 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
 * @memberof CIQ.UI.Lookup.Driver
 * @param {array} exchanges An array of ecxchanges that can be searched against
 */
class ActiveSymbolDriver extends Driver {
    constructor() {
        super();
        this.symbols = [];
    }

    set activeSymbols(symbols) {
        this.symbols = [];

        for (let s of symbols) {
            this.symbols.push({
                data: {
                    symbol: s.symbol,
                    name: s.display_name,
                    market_display_name: s.market_display_name,
                    exchDisp: s.market,
                },
                display: [s.symbol, s.display_name, s.market.toUpperCase()],
            });
        }
    }

    get activeSymbols() {
        return this.symbols;
    }

    /**
     * @memberof CIQ.UI.Lookup.Driver.ChartIQ
     * @param {string} text Text to serach for
     * @param {string} filter Any filter to be applied to the search results
     * @param {number} maxResults Max number of results to return from the server
     * @param {function} cb Callback upon results
     */
    acceptText(text, filter, maxResults, cb) {
        if (!this.symbols) return [];

        const reg = RegExp(text, 'i');
        const result = [];
        filter = this.getFilterFromDisplay(filter) || 'All';

        for (let s of this.symbols) {
            const d = s.data;
            if (filter !== 'All' && d.market_display_name !== filter) continue;

            if (reg.test(d.symbol) || reg.test(d.name)) {
                result.push(s);
            }
        }

        cb(result);
    }

    getFilterFromDisplay(display) {
        switch (display) {
        case 'OTC':
            return 'OTC Stocks';
        case 'Volatility':
            return 'Volatility Indices';
        default:
            return display;
        }
    }
}

export default ActiveSymbolDriver;
