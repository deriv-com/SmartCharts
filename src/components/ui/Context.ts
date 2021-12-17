/**
 * UI context helper class. Construct with an {@link CIQ.ChartEngine} object
 * @param {CIQ.ChartEngine} stx The chart object to associate this UI
 * @param {HTMLElement} topNode The top node of the DOM tree for this context. That node should contain
 * all of the UI elements associated with the CIQ.ChartEngine
 * @param {object} [params] Optional parameters
 * @name CIQ.UI.Context
 * @constructor
 */
class Context {
    advertised: typeof CIQ.UI.Layout;
    loader: typeof CIQ.UI.Loader;
    params?: Record<string, unknown>;
    stx: typeof CIQ.ChartEngine;
    topNode: (HTMLElement & { CIQ: typeof CIQ }) | null;
    constructor(
        stx: typeof CIQ.ChartEngine,
        topNode: (HTMLElement & { CIQ: typeof CIQ }) | null,
        params?: Record<string, unknown>
    ) {
        this.params = params || {};
        this.stx = stx;
        this.topNode = topNode;
        const storage = Context.assembleContext(topNode);
        this.advertised = {};
        (topNode as HTMLElement & { CIQ: typeof CIQ }).CIQ.UI.context = this;
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
    static assembleContext(contextElement: (HTMLElement & { CIQ: typeof CIQ }) | null) {
        if (contextElement && !contextElement.CIQ) {
            contextElement.CIQ = {};
        } // claim our namespace
        if (contextElement && !contextElement.CIQ.UI) {
            contextElement.CIQ.UI = {};
        }
        if (contextElement && !contextElement.CIQ.UI.Components) {
            contextElement.CIQ.UI.Components = [];
        }
        return contextElement?.CIQ.UI;
    }

    /**
     * Attaches a Helper to the context, so that it can be found later on.
     * @param {CIQ.UI.Helper} uiHelper A UI Helper to attach
     * @param {string} helperName The helperName of the element. For instance "Loader"
     * @memberof CIQ.UI.Context
     */
    advertiseAs(uiHelper: typeof CIQ.UI.Helper, helperName: string) {
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
    getAdvertised(helperName: string) {
        return this.advertised[helperName];
    }

    /**
     * Attaches a loader to a UI context
     * @param {CIQ.UI.Loader} loader Loader instance
     * @memberof CIQ.UI.Context
     */
    setLoader(loader: typeof CIQ.UI.Loader) {
        this.loader = loader;
    }

    /**
     * Is the context in modal mode?
     * @return {Boolean} true if in modal mode
     * @memberof CIQ.UI.Context
     */
    isModal(): boolean {
        return this.stx.openDialog !== '';
    }
}

export default Context;
