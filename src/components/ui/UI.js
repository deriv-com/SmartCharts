import 'object.observe';
import { CIQ } from '../../../js/chartiq';
import BaseComponent from './BaseComponent';

/**
 * Namespace for UI helper objects
 * @namespace CIQ.UI
 */

/**
 * Executes a function in the nearest parent component (container). For instance, a cq-close tag might call "close"
 * on its containing component
 * @memberof CIQ.UI
 * @param {object} self
 * @param  {string} fn   The name of the function
 * @param  {Array}   args Arguments array (a "spread" is also supported)
 */
class UI {
    static containerExecute(self, fn, ...args) {
        let parents = self.node.parents();
        for (let i = 0; i < parents.length; i++) {
            let parent = parents[i];
            if (parent[fn] && parent[fn].constructor === Function) {
                return parent[fn](...args);
            }
        }
        return null;
    }

    /**
     * Convenience function to display the changing price of a node (price flash green/red).
     *
     * This functionality can be CPU expensive if many updates per second or multiple charts on a screen exist.
     * To disable simply set `CIQ.UI.animatePrice = function () { };`
     * @kind function
     * @memberof CIQ.UI
     * @param {node} node
     * @param {number} newPrice
     * @param {number} oldPrice
     */
    static animatePrice(node, newPrice, oldPrice) {
        node.removeClass('cq-stable');
        if (newPrice > oldPrice) node.addClass('cq-up');
        else if (newPrice < oldPrice) node.addClass('cq-down');
        setTimeout(() => {
            node.addClass('cq-stable').removeClass('cq-up').removeClass('cq-down');
        }, 0);
    }

    /**
     * Convenience function for making a new jquery node from a HTML5 template
     * @kind function
     * @memberof CIQ.UI
     * @param  {Selector} node Selector or HTMLElement
     * @param {HTMLElement} [appendTo] If set, then the template will automatically be appended to this node.
     * If appendTo==true then the new node will automatically be added in place (appended to the template's parent)
     * @return {JQuery}      A jquery node
     */
    static makeFromTemplate(node, appendTo) {
        let n = $(node)[0].content;
        let newNode = document.importNode(n, true);
        let jq = null;

        // find first real element
        // nodeType for element = 1
        // nodeType for text = 3
        for (let i = 0; i < newNode.childNodes.length; i++) {
            let child = newNode.childNodes[i];

            // found element
            if (child.nodeType === 1) {
                jq = $(child);
                if (appendTo === true) $(node).parent().append(newNode);
                else if (appendTo) $(appendTo).append(newNode);
                break;
            }
        }

        return jq;
    }

    /**
     * Utility to splits a string form function into function name and arguments
     * @param  {string} cmd The string function call
     * @return {object|null} Null or object containing helperName, functionName and args
     * @memberof CIQ.UI
     * @private
     */
    static splitMethod(cmd) {
        if (!cmd) return null;
        let openParentheses = cmd.indexOf('(');
        let closeParentheses = cmd.lastIndexOf(')');
        if (openParentheses === -1 || closeParentheses === -1) {
            console.log(`malformed stxtap attribute: ${cmd}`);
            return null;
        }
        let helperName = null,
            functionName;
        let beforeParentheses = cmd.substring(0, openParentheses);
        let period = beforeParentheses.indexOf('.');
        if (period === -1) { // web component
            functionName = beforeParentheses;
        } else {
            helperName = beforeParentheses.substring(0, period);
            functionName = cmd.substring(period + 1, openParentheses);
        }
        let args = cmd.substring(openParentheses + 1, closeParentheses);
        let parsed = args.match(/('[^']+'|[^,]+)/g);
        let isFloat = new RegExp('^[0-9]+([,.][0-9]+)?$', 'g');
        let isInteger = new RegExp('^\\d+$');
        let argArray = [];
        if (parsed) {
            for (let i = 0; i < parsed.length; i++) {
                let arg = parsed[i];
                while (arg.charAt(0) === ' ') arg = arg.substring(1);
                if (arg.indexOf('"') !== -1 || arg.indexOf("'") !== -1) {
                    argArray.push(arg.substring(1, arg.length - 1));
                } else if (arg === 'true') {
                    argArray.push(true);
                } else if (arg === 'false') {
                    argArray.push(false);
                } else if (arg === 'null') {
                    argArray.push(null);
                } else if (isInteger.test(arg)) {
                    argArray.push(parseInt(arg, 10));
                } else if (isFloat.test(arg)) {
                    argArray.push(parseFloat(arg));
                } else {
                    let a = arg.split('.');
                    let aObj = window;
                    for (let b = 0; b < a.length; b++) {
                        aObj = aObj[a[b]];
                    }
                    argArray.push(aObj);
                }
            }
        }

        return {
            helperName,
            functionName,
            args: argArray,
        };
    }

    /**
     * Static method to create an observable
     * @param  {Object} params Parameters
     * @param {string} [params.selector] The selector to effect the observable (adding class, setting value)
     * @param {Object} params.obj The object to observe
     * @param {string} [params.member] The member of the object to observe. Pass an array to observe multiple members. Or pass nothing to observe any change to the object.
     * @param {string} [params.condition] Optional condition for the member to trigger the action
     * @param {string} params.action The action to take. "class" - add or remove a class. "callback" - calls back with params
     * @param {string} params.value The value for the action (i.e. class name, callback function)
     * @memberof CIQ.UI
     *
     * @example - Add or remove a class based on whether stx.layout.crosshair is true or false
     * CIQ.UI.observe({selector:".toggle", obj:stx.layout, member:"crosshair", action:"class", value:"active"});
     * @example - Add or remove a class based on whether stx.layout.chartType=="candle"
     * CIQ.UI.observe({selector:".toggle", obj:stx.layout, member:"chartType", condition:"candle", action:"class", value:"active"});
     * @example - Get a callback from a change in value
     * CIQ.UI.observe({selector:".toggle", obj:stx.layout, member:"chartType", condition:"candle", action:"callback", value:function(params){
     *    console.log("new value is" + params.obj[params.member]);
     * }});
     */
    static observe(params) {
        let self = this;

        function observed(change) {
            let match = false;
            if (!params.member) { // wildcard
                match = true;
            } else if (change.name === params.member) {
                match = true;
            } else if (params.member.constructor === Array) {
                for (let i = 0; i < params.member.length; i++) {
                    if (change.name === params.member[i]) match = true;
                }
            }
            if (match) {
                let nodes = $(params.selector);
                if (!nodes.length && params.action === 'callback') { // simple callback not associated with a selector
                    params.value.call(self, params);
                    return;
                }
                if (params.action === 'class') nodes.removeClass(params.value);
                nodes.each(function () {
                    let isTrue = false;
                    if (params.member) {
                        if (params.condition) {
                            if (params.obj[params.member] === params.condition) isTrue = true;
                        } else {
                            isTrue = params.obj[params.member];
                        }
                    }
                    if (params.action === 'class') {
                        if (isTrue) nodes.addClass(params.value);
                    }
                    if (params.action === 'callback') {
                        params.value.call(self, params, this);
                    }
                    if (params.action === 'value') {
                        if (params.value) {
                            this.value = params.value;
                        } else if (!params.obj[params.member]) { this.value = ''; } else { this.value = params.obj[params.member]; }
                    }
                });
            }
        }

        Object.observe(params.obj, (changes) => { changes.forEach(observed); }, ['update', 'add', 'delete']);
        observed({ name: params.member }); // initialize
    }

    /**
     * Utility function that returns all contexts on the screen
     * @return {JQuery} A jquery node with all contexts
     */
    static allContexts() {
        return $('cq-context,*[cq-context]');
    }

    /**
     * Utility to get the context for a tag. It traverse up the parent stack looking for a parent
     * with a context member, or the actual cq-context. If no context can be found then returns null.
     * @param  {HTMLElement} me The element to get the context for
     * @return {CIQ.UI.Context}    The context or null if none found
     */
    static getMyContext(me) {
        let nodes = $(me).parentsAndMe();
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            if (node.context) return node.context;
            if (node.CIQ && node.CIQ.UI) return node.CIQ.UI.context;
        }
        return null;
    }
    /**
     * Utility to run a function across all contexts. "this" will be
     * set to the context
     * @param  {Function} func Function to run
     * @example
     *  CIQ.UI.contextsForEach(function(){
     *      this.stx.doSomething();
     *  });
     */
    static contextsForEach(func) {
        let contexts = CIQ.UI.allContexts();
        contexts.each(function () {
            func.apply(this.CIQ.UI.context);
        });
    }

    /**
     * Starts the UI
     * @param {Function} [cb] Optional callback returns when web components are initialized
     */
    static begin(cb) {
        CIQ.UI.release = true;
        setTimeout(() => {
            BaseComponent.nextTick();
            if (cb) cb();
        }, 0); // release the bindings
    }
}

CIQ.UI = UI;
