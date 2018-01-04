import { CIQ } from '../../../js/chartiq';

/**
 * @constructor CIQ.UI.Lookup
 */
CIQ.UI.Lookup = {};

/**
 * Base class that drives the lookup widget. You should derive your own Driver that interacts with your datafeed.
 * @name  CIQ.UI.Lookup.Driver
 * @constructor
 */
class Driver {
    /**
     * Abstract method, override this to accept the selected text and optional filter. Fetch results
     * and return them by calling this.cb This default driver returns no results.
     * @param  {string} text The text entered by the user
     * @param {string} [filter] The optional filter text selected by the user. This will be the innerHTML of the cq-filter element that is selected.
     * @memberof CIQ.UI.Lookup.Driver
     */
    acceptText(text, filter) {
        if (!this.cb) return;
    }
}

/**
 * An example instance of the Lookup Driver scoped to CIQ.UI.Lookup.Driver
 *
 * Inherits all of the base Look Driver's properties via `ciqInheritsFrom()`
 * @name ChartIQ
 * @memberof CIQ.UI.Lookup.Driver
 */
class ChartIQ extends Driver {
    /**
     * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
     * @memberof CIQ.UI.Lookup.Driver
     * @param {array} exchanges An array of ecxchanges that can be searched against
     */
    constructor(exchanges) {
        super();
        this.exchanges = exchanges;
        if (!this.exchanges) this.exchanges = ['XNYS', 'XASE', 'XNAS', 'XASX', 'INDCBSX', 'INDXASE', 'INDXNAS', 'IND_DJI', 'ARCX', 'INDARCX', 'forex'];
        this.url = 'https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service';
        this.requestCounter = 0; // used to invalidate old requests
        // t=ibm&m=10&x=[]&e=STOCKS
    }

    /**
     * @memberof CIQ.UI.Lookup.Driver.ChartIQ
     * @param {string} text Text to serach for
     * @param {string} filter Any filter to be applied to the search results
     * @param {number} maxResults Max number of results to return from the server
     * @param {function} cb Callback upon results
     */
    acceptText(text, filter, maxResults, cb) {
        if (filter == 'FX') filter = 'FOREX';
        if (isNaN(parseInt(maxResults, 10))) maxResults = 100;
        let url = `${this.url}?t=${encodeURIComponent(text)}&m=${maxResults}&x=[`;
        if (this.exchanges) {
            url += this.exchanges.join(',');
        }
        url += ']';
        if (filter && filter.toUpperCase() != 'ALL') {
            url += `&e=${filter}`;
        }

        let counter = ++this.requestCounter;
        let self = this;

        function handleResponse(status, response) {
            if (counter < self.requestCounter) return;
            if (status != 200) return;
            try {
                response = JSON.parse(response);
                let symbols = response.payload.symbols;

                let results = [];
                for (let i = 0; i < symbols.length; i++) {
                    let fields = symbols[i].split('|');
                    let item = {
                        symbol: fields[0],
                        name: fields[1],
                        exchDisp: fields[2],
                    };
                    results.push({
                        display: [item.symbol, item.name, item.exchDisp],
                        data: item,
                    });
                }
                cb(results);
            } catch (e) {}
        }
        CIQ.postAjax({
            url,
            cb: handleResponse,
        });
    }
}

CIQ.UI.Lookup.Driver = Driver;
CIQ.UI.Lookup.Driver.ChartIQ = ChartIQ;
