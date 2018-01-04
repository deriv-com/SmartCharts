import { CIQ } from '../../js/chartiq';

/**
 * UI context helper class. Construct with an {@link CIQ.ChartEngine} object
 * @param {CIQ.ChartEngine} stx The chart object to associate this UI
 * @param {HTMLElement} topNode The top node of the DOM tree for this context. That node should contain
 * all of the UI elements associated with the CIQ.ChartEngine
 * @param {object} [params] Optional parameters
 * @name CIQ.UI.Context
 * @constructor
 */

export default class Context {
    constructor(stx, topNode, params) {
        this.params = params || {};
        this.stx = stx;
        topNode = this.topNode = $(topNode)[0];
        this.node = $(this.topNode);
        let storage = CIQ.UI.Context.assembleContext(topNode);
        this.advertised = {};
        topNode.CIQ.UI.context = this;
        // Search through all of the components that have registered themselves. Call setContext() on each
        // so that they can get their context. This usually initializes and makes the component active.
        for (let i = 0; i < storage.Components.length; i++) {
            storage.Components[i].setContextPrivate(this);
        }
    }
    /**
     * The DOM tag for a context needs some storage. ContextTag components register
     * themselves by placing themselves in this storage. This method creates that
     * storage, if it hasn't already been created.
     * @param  {HTMLElement} contextElement The context node
     * @returns {object} The storage object
     * @private
     */
    static assembleContext(contextElement) {
        if (!contextElement.CIQ) contextElement.CIQ = {}; // claim our namespace
        if (!contextElement.CIQ.UI) contextElement.CIQ.UI = {};
        if (!contextElement.CIQ.UI.Components) contextElement.CIQ.UI.Components = [];
        return contextElement.CIQ.UI;
    }

    /**
     * Abstract method that should be overridden
     * @param  {Object} data A symbol data object acceptible for {@link CIQ.ChartEngine#newChart}
     * @memberof CIQ.UI.Context
     */
    changeSymbol(data) {
        console.log('Please implement CIQ.UI.Context.prototype.changeSymbol');
    }

    /**
     * Sets the lookup driver for this context
     * @param {CIQ.UI.Lookup.Driver} driver Lookup driver for cq-lookup component
     * @memberof CIQ.UI.Context
     */
    setLookupDriver(driver) {
        this.lookupDriver = driver;
    }


    /**
     * Attaches a Helper to the context, so that it can be found later on.
     * @param {CIQ.UI.Helper} uiHelper A UI Helper to attach
     * @param {string} helperName The helperName of the element. For instance "Loader"
     * @memberof CIQ.UI.Context
     */
    advertiseAs(uiHelper, helperName) {
        this.advertised[helperName] = uiHelper;
    }


    /**
     * Finds the nearest (parent) node that contains the class (CIQ.UI.Element type) referenced
     * by an stxtap attribute. Returns null if none found.
     * @param  {string} helperName The type of UI Helper to look for
     * @return {Array.CIQ.UI.Helper} The associated array of helpers or null if none found
     * @memberof CIQ.UI.Context
     * @private
     */
    getAdvertised(helperName) {
        return this.advertised[helperName];
    }

    /**
     * Attaches a loader to a UI context
     * @param {CIQ.UI.Loader} loader Loader instance
     * @memberof CIQ.UI.Context
     */
    setLoader(loader) {
        this.loader = loader;
    }

    /**
     * Is the context in modal mode?
     * @return {Boolean} true if in modal mode
     * @memberof CIQ.UI.Context
     */
    isModal() {
        return (this.stx.openDialog !== '');
    }
}

CIQ.UI.Context = Context;
