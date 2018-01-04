// Copyright 2015-2016 by ChartIQ, Inc.
import jQuery from 'jquery';
import { CIQ } from '../../js/chartiq';
import './UI/constants';
import BaseComponent from './UI/BaseComponent';
import DialogContentTag from './UI/DialogContentTag';
import ContextTag from './UI/ContextTag';
import ModalTag from './UI/ModalTag';
import Context from './UI/Context';
import Helper from './UI/Helper';
import KeystrokeHub from './UI/KeystrokeHub';
import HeadsUp from './UI/HeadsUp';
import StudyMenu from './UI/StudyMenu';
import StudyEdit from './UI/StudyEdit';
import Keystroke from './UI/Keystroke';
import Layout from './UI/Layout';
import HeadsUpMarker from './UI/HeadsUpMarker';
import './UI/UIManager';
import './UI/Driver';

CIQ.UI.BaseComponent = BaseComponent;
CIQ.UI.DialogContentTag = DialogContentTag;
CIQ.UI.ContextTag = ContextTag;
CIQ.UI.ModalTag = ModalTag;
CIQ.UI.Context = Context;
CIQ.UI.Helper = Helper;
CIQ.UI.KeystrokeHub = KeystrokeHub;
CIQ.UI.HeadsUp = HeadsUp;
CIQ.UI.StudyMenu = StudyMenu;
CIQ.UI.StudyEdit = StudyEdit;
CIQ.UI.Keystroke = Keystroke;
CIQ.UI.Layout = Layout;
CIQ.Marker.HeadsUp = HeadsUpMarker;

// node.stxtap([selector],callback)
jQuery.fn.extend({
    stxtap(arg1, arg2) {
        return this.each(function () {
            CIQ.installTapEvent(this/* , {stopPropagation:true} */);
            if (typeof arg1 === 'string') {
                $(this).on('stxtap', arg1, function (e) {
                    arg2.call(this, e);
                });
            } else {
                $(this).on('stxtap', function (e) {
                    arg1.call(this, e);
                });
            }
        });
    },
});

jQuery.fn.extend($.expr[':'], {
    trulyvisible(node, j, attr) {
        let parents = $(node).parents();
        parents = parents.add(node);
        for (let i = 0; i < parents.length; i++) {
            let p = $(parents[i]);
            if (p.css('opacity') === '0') return false;
            if (p.css('visibility') === 'hidden') return false;
            if (p.css('height') === '0px' && p.css('overflow-y') == 'hidden') return false;
            if (!p.is(':visible')) return false;
        }
        return true;
    },
});

/**
 * Creates a virtual DOM and then compares contents before rendering. If the contents
 * are the same then no rendering is done. This prevents flicker. React style.
 */
jQuery.fn.extend({
    parentsAndMe(arg1) {
        let us = $(this).parents();
        us = us.add($(this));
        return us;
    },
    cqvirtual(arg1) {
        let virtual = this.clone();
        virtual.empty();
        virtual.original = this;
        return virtual;
    },
    cqrender(arg1) {
        if (this[0].innerHTML == this.original[0].innerHTML) return this.original;
        this.original.empty();
        let children = this.children();
        if (children.length) {
            let newStuff = children.detach();
            this.original.append(newStuff);
        }

        return this.original;
    },
    // Returns a guaranteed width. For instance, cq-context or any other wrapping tag can have
    // a width of zero, so we need to go one level up to get the actual width
    guaranteedWidth() {
        let node = this;
        let w = node.width();
        while (!w) {
            node = node.parent();
            if (node[0].tagName === 'BODY' || node[0] === window) {
                return window.innerWidth;
            }
            w = node.width();
        }
        return w;
    },
    // See guaranteedWidth
    guaranteedHeight() {
        let node = this;
        let h = node.height();
        while (!h) {
            node = node.parent();
            if (node[0].tagName === 'BODY' || node[0] === window) {
                return window.innerHeight;
            }
            h = node.height();
        }
        return h;
    },
    emptyExceptTemplate() {
        this.children().not('template').remove();
        return this;
    },
    // Returns true if an attribute exists, or is not explicitly set to false
    truthyAttr(arg1) {
        let val = this.attr(arg1);
        if (typeof (val) === 'undefined') return false;
        if (val.toLowerCase() == 'false') return false;
        if (val == '0') return false;
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this does not support jquery chaining!
    attrBetter(attribute, value) {
        if (typeof value === 'undefined') value = 'true';
        let val = this.attr(attribute);
        if (val === value) return false;
        this.attr(attribute, value);
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this does not support jquery chaining!
    removeAttrBetter(attribute) {
        let val = this.attr(attribute);
        if (!val && val !== '') return false;
        this.removeAttr(attribute);
        return true;
    },
    // More efficient because it doesn't change the DOM unless it needs to. Returns true
    // if a change was made. Note that this is a setter function only. It is not meant to replace
    // the getter aspect of jquery's built in text()
    textBetter(str) {
        if (this.text() === str) return false;
        this.text(str);
        return true;
    },
});


jQuery.queryString = function (sParam) {
    let sPageURL = window.location.search.substring(1);
    let sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        let sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) return sParameterName[1];
    }
    return null;
};


/*
 * http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
 */

(function () {
    let attachEvent = document.attachEvent;
    let isIE = navigator.userAgent.match(/Trident/);
    let requestFrame = (function () {
        let raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function (fn) { return window.setTimeout(fn, 20); };
        return function (fn) { return raf(fn); };
    }());

    let cancelFrame = (function () {
        let cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
        return function (id) { return cancel(id); };
    }());

    function resizeListener(e) {
        let win = e.target || e.srcElement;
        if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
        win.__resizeRAF__ = requestFrame(() => {
            let trigger = win.__resizeTrigger__;
            trigger.__resizeListeners__.forEach((fn) => {
                fn.call(trigger, e);
            });
        });
    }

    function objectLoad(e) {
        this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
        this.contentDocument.defaultView.addEventListener('resize', resizeListener);
    }

    /**
     * Attaches a callback to listen for resize events on the DOM.
     * @param {node} element
     * @param {function} callback
     * @memberof CIQ
     */
    CIQ.addResizeListener = function (element, fn) {
        let uiManager = $('cq-ui-manager');
        if (uiManager.length > 0) {
            uiManager = uiManager[0];
            uiManager.registerForResize(element);
        }
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];
            if (attachEvent) {
                element.__resizeTrigger__ = element;
                element.attachEvent('onresize', resizeListener);
            } else {
                // if (!getComputedStyle(element) || getComputedStyle(element).position == 'static') element.style.position = 'relative';
                let obj = element.__resizeTrigger__ = document.createElement('object');
                obj.setAttribute('style', 'visibility:hidden; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; border:0px;');
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                if (isIE) element.appendChild(obj);
                obj.data = 'about:blank';
                if (!isIE) element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    };

    /**
     * Removes an attached a callback to listen for an element.
     * @param {node} element
     * @param {function} callback
     * @memberof CIQ
     */
    CIQ.removeResizeListener = function (element, fn) {
        let uiManager = $('cq-ui-manager');
        if (uiManager.length > 0) {
            uiManager = uiManager[0];
            uiManager.unregisterForResize(element);
        }
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            if (attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    };
}());

/**
 * @typedef Selector
 */

/**
 * @typedef HTMLElement
 */

/**
 * The following is a set of webComponents used in our sample templates to illustrate how the API can be leveraged to build full featured UI to control the chart.
 *
 * Feel free to use them as provided or modify as needed to meet your needs. You can find all of the source code for these webComponents in `js/components.js` and `js/componentUI.js`.
 *
 * This implementation assumes the chart is attached to to a quotefeed for interactive data loading.
 * If you will not be using a quotefeed, you will need to adjust these components accordingly.
 *
 * Performance considerations: These web components include dynamically updating modules that will react to every data change and redraw certain elements.
 * Although visually pleasing, they can sometimes cause performance issues on slow devices or when multiple charts are displayed.
 * See {@link CIQ.UI.animatePrice} for setting options.
 *
 * @see {@link CIQ.UI.ContextTag} which provides a model and base functionality for many components
 * @namespace WebComponents
 */
function WebComponents() {}

/**
 * Executes a function in the nearest parent component (container). For instance, a cq-close tag might call "close"
 * on its containing component
 * @memberof CIQ.UI
 * @param {object} self
 * @param  {string} fn   The name of the function
 * @param  {Array}   args Arguments array (a "spread" is also supported)
 */
CIQ.UI.containerExecute = function (self, fn, args) {
    let myArgs = args;
    if (args && myArgs.constructor !== Array) myArgs = Array.prototype.slice.call(arguments, 2);
    let parents = self.node.parents();
    for (let i = 0; i < parents.length; i++) {
        let parent = parents[i];
        if (parent[fn] && parent[fn].constructor == Function) {
            return parent[fn](...myArgs);
        }
    }
    return null;
};

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
CIQ.UI.animatePrice = function (node, newPrice, oldPrice) {
    node.removeClass('cq-stable');
    if (newPrice > oldPrice) node.addClass('cq-up');
    else if (newPrice < oldPrice) node.addClass('cq-down');
    setTimeout(() => {
        node.addClass('cq-stable').removeClass('cq-up').removeClass('cq-down');
    }, 0);
};

/**
 * Convenience function for making a new jquery node from a HTML5 template
 * @kind function
 * @memberof CIQ.UI
 * @param  {Selector} node Selector or HTMLElement
 * @param {HTMLElement} [appendTo] If set, then the template will automatically be appended to this node.
 * If appendTo==true then the new node will automatically be added in place (appended to the template's parent)
 * @return {JQuery}      A jquery node
 */
CIQ.UI.makeFromTemplate = function (node, appendTo) {
    let n = $(node)[0].content;
    let newNode = document.importNode(n, true);
    let jq = null;

    // find first real element
    // nodeType for element = 1
    // nodeType for text = 3
    for (let i = 0; i < newNode.childNodes.length; i++) {
        let child = newNode.childNodes[i];

        // found element
        if (child.nodeType == 1) {
            jq = $(child);
            if (appendTo === true) $(node).parent().append(newNode);
            else if (appendTo) $(appendTo).append(newNode);
            break;
        }
    }

    return jq;
};

/**
 * Utility to splits a string form function into function name and arguments
 * @param  {string} cmd The string function call
 * @return {object|null} Null or object containing helperName, functionName and args
 * @memberof CIQ.UI
 * @private
 */
CIQ.UI.splitMethod = function (cmd) {
    if (!cmd) return null;
    let openParentheses = cmd.indexOf('(');
    let closeParentheses = cmd.lastIndexOf(')');
    if (openParentheses == -1 || closeParentheses == -1) {
        console.log(`malformed stxtap attribute: ${cmd}`);
        return null;
    }
    let helperName = null,
        functionName;
    let beforeParentheses = cmd.substring(0, openParentheses);
    let period = beforeParentheses.indexOf('.');
    if (period == -1) { // web component
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
            while (arg.charAt(0) == ' ') arg = arg.substring(1);
            if (arg.indexOf('"') != -1 || arg.indexOf("'") != -1) {
                argArray.push(arg.substring(1, arg.length - 1));
            } else if (arg == 'true') {
                argArray.push(true);
            } else if (arg == 'false') {
                argArray.push(false);
            } else if (arg == 'null') {
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
};

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
CIQ.UI.observe = function (params) {
    let self = this;
    function observed(change) {
        let match = false;
        if (!params.member) { // wildcard
            match = true;
        } else if (change.name === params.member) {
            match = true;
        } else if (params.member.constructor == Array) {
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
};

/**
 * Utility function that returns all contexts on the screen
 * @return {JQuery} A jquery node with all contexts
 */
CIQ.UI.allContexts = function () {
    return $('cq-context,*[cq-context]');
};

/**
 * Utility to get the context for a tag. It traverse up the parent stack looking for a parent
 * with a context member, or the actual cq-context. If no context can be found then returns null.
 * @param  {HTMLElement} me The element to get the context for
 * @return {CIQ.UI.Context}    The context or null if none found
 */
CIQ.UI.getMyContext = function (me) {
    let nodes = $(me).parentsAndMe();
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.context) return node.context;
        if (node.CIQ && node.CIQ.UI) return node.CIQ.UI.context;
    }
    return null;
};
/**
 * Utility to run a function across all contexts. "this" will be
 * set to the context
 * @param  {Function} func Function to run
 * @example
 *  CIQ.UI.contextsForEach(function(){
 *  	this.stx.doSomething();
 *  });
 */
CIQ.UI.contextsForEach = function (func) {
    let contexts = CIQ.UI.allContexts();
    contexts.each(function () {
        func.apply(this.CIQ.UI.context);
    });
};

CIQ.UI.release = false;

/**
 * Set this flag to true to bypass bindings when adding a component to the DOM.
 * For instance when components are created by html2canvas we don't want them to do any heavy lifting.
 * @type {Boolean}
 */
CIQ.UI.bypassBindings = false;

/**
 * Starts the UI
 * @param {Function} [cb] Optional callback returns when web components are initialized
 */
CIQ.UI.begin = function (cb) {
    CIQ.UI.release = true;
    setTimeout(() => {
        BaseComponent.nextTick();
        if (cb) cb();
    }, 0); // release the bindings
};

/**
 * Utility method for adding multiple inheritances to a base object
 * @param {Object} target Target object
 * @param {Object} source Source object
 */
CIQ.UI.addInheritance = function (target, source) {
// We put this in a catch loop because BaseComponent is itself an HTMLElement and the browser barfs on trying to copy some
// of those values
    for (let key in source.prototype) {
        try {
            target.prototype[key] = source.prototype[key];
        } catch (e) {}
    }
};
