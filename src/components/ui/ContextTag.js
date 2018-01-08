import $ from 'jquery';
import { CIQ } from '../../../js/chartiq';
import BaseComponent from './BaseComponent';
import Context from './Context';
import { getParents } from './utils';

/**
 * Abstract class for web components that use a {@link CIQ.UI.Context} in order to gain access to a ChartEngine
 * @see {@link WebComponents}
 * @memberof CIQ.UI
 * @namespace ContextTag
 * @type {HTMLElement}
 */
class ContextTag extends BaseComponent {
    /**
     * Stores the component in the contextHolder so that when the context
     * is started it knows that this tag is contextual
     * @kind function
     * @memberof CIQ.UI.ContextTag
     */
    setContextHolder() {
        let nearestContext = getParents(this.node, 'cq-context,*[cq-context]');
        if (!nearestContext.length) {
            console.log(`No cq-context found for ${this.tagName}`);
            return;
        }
        let contextElement = nearestContext[0];
        let storage = Context.assembleContext(contextElement);
        storage.Components.push(this);

        // This will only get called for components that are generated dynamically, after a context
        // has already been established
        if (storage.context) this.setContextPrivate(storage.context);
    }

    /**
     * This is called for every registered component when the context is constructed. You can override
     * this as an initialization.
     * @kind function
     * @memberof CIQ.UI.ContextTag
     * @param {CIQ.UI.Context} context The context
     */
    setContext(/* context */) {
        // override me
    }

    /**
     * @kind function
     * @memberof CIQ.UI.ContextTag
     * @param {CIQ.UI.Context} context The context
     * @private
     */
    setContextPrivate(context) {
        this.context = context;
        this.uiManager = $('cq-ui-manager');
        if (this.uiManager.length > 0) this.uiManager = this.uiManager[0];

        let node = $(this);
        if (typeof (node.attr('cq-marker')) !== 'undefined') {
            node.detach();
            this.marker = new CIQ.Marker({
                stx: context.stx,
                node: node[0],
                xPositioner: 'none',
                yPositioner: 'none',
                permanent: true,
            });
        }
        setTimeout(function (s, c) { return function () { s.setContext(c); }; }(this, context));
    }

    /**
     * Convience function that creates an array of injections for the component and sets a variable of node equal to self.
     * @kind function
     * @memberof CIQ.UI.ContextTag
     */
    createdCallback() {
        super.createdCallback();
        this.injections = [];
    }

    /**
     *
     * @kind function
     * @memberof CIQ.UI.ContextTag
     * @param {string} position Where in the animation loop the injection should be added. Append or Prepend.
     * @param {string} injection What function to add the injection too
     * @param {function} code The callback to fired when the injection occurs
     */
    addInjection(position, injection, code) {
        this.injections.push(this.context.stx[position](injection, code));
    }

    /**
     * Removes all the the injections for a context tag and resets the tag to its default state
     * @kind function
     * @memberof CIQ.UI.ContextTag
     */
    detachedCallback() {
        if (this.context && this.injections) {
            for (let i = 0; i < this.injections.length; i++) {
                this.context.stx.removeInjection(this.injections[i]);
            }
            this.injections = [];
        }
    }

    /**
     * Called automatically when a tag is instantiated
     * @private
     */
    attachedCallback() {
        if (this.attached) return;
        this.setContextHolder();
        super.attachedCallback();
    }
}

export default ContextTag;
