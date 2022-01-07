import Context from './Context';

/**
 * Abstract class for UI Helpers
 * @name CIQ.UI.Helper
 * @constructor
 */
class Helper {
    context: Context | null;
    injections: any;
    node: HTMLElement;
    constructor(node: HTMLElement, context: Context | null) {
        this.node = node;
        this.context = context;
        this.injections = []; // To keep track of injections for later removal
    }

    /**
     * Adds an injection. These will be automatically destroyed if the helper object is destroyed
     * @param {string} position  "prepend" or "append"
     * @param {string} injection The injection name. i.e. "draw"
     * @param {Function} code      The code to be run
     * @memberof CIQ.UI.Helper
     */
    addInjection(position: string, injection: string, code: any) {
        this.injections.push(this.context?.stx[position](injection, code));
    }

    /**
     * Removes injections from the ChartEngine
     * @memberof CIQ.UI.Helper
     */
    destroy() {
        for (let i = 0; i < this.injections.length; i++) {
            this.context?.stx.removeInjection(this.injections[i]);
        }
        this.injections = [];
    }
}

export default Helper;
