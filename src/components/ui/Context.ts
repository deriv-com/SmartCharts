/**
 * UI context helper class.
 * @param {HTMLElement} topNode The top node of the DOM tree for this context. That node should contain
 * @param {object} [params] Optional parameters
 * @constructor
 */
class Context {
    params?: Record<string, unknown>;
    topNode: HTMLElement | null;
    constructor(topNode: HTMLElement | null, params?: Record<string, unknown>) {
        this.params = params || {};
        this.topNode = topNode;
    }
}

export default Context;
