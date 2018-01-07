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
    acceptText(/* text, filter */) {
        if (!this.cb) return;
    }
}

export default Driver;
