// Copyright 2015-2016 by ChartIQ, Inc.
import 'object.observe';
import { CIQ } from '../../../js/chartiq';
import '../../../js/thirdparty/webcomponents-lite.min';
import './jquery-extensions';
import './UIManager';
import Context from './Context';
import BaseComponent from './BaseComponent';

/**
 * The following is a set of webComponents used in our sample templates to illustrate how the API can be leveraged to build full featured UI to control the chart.
 *
 * Feel free to use them as provided or modify as needed to meet your needs. You can find all of the source code for these webComponents in `js/components.js` and `js/ui.js`.
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

export const claims = [];

// Auxiliary function that enables multiple inheritence with es6 classes: https://stackoverflow.com/a/45332959/1471258
export const aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor(...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this, (new mixin()));
            });
        }
    }
    let copyProps = (target, source) => { // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) { Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)); }
            });
    };
    mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
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
                // if (!getComputedStyle(element) || getComputedStyle(element).position === 'static') element.style.position = 'relative';
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
 * Namespace for UI helper objects
 * @namespace CIQ.UI
 */
CIQ.UI = {};

CIQ.UI.Context = Context;

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
        if (parent[fn] && parent[fn].constructor === Function) {
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
        if (child.nodeType === 1) {
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
 *      this.stx.doSomething();
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


/**
 * Abstract class for UI Helpers
 * @name CIQ.UI.Helper
 * @constructor
 */
class Helper {
    constructor(node, context) {
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
    addInjection(position, injection, code) {
        this.injections.push(this.context.stx[position](injection, code));
    }

    /**
     * Removes injections from the ChartEngine
     * @memberof CIQ.UI.Helper
     */
    destroy() {
        for (let i = 0; i < this.injections.length; i++) {
            this.context.stx.removeInjection(this.injections[i]);
        }
        this.injections = [];
    }
}

CIQ.UI.Helper = Helper;

/**
 * @constructor CIQ.UI.Lookup
 */
CIQ.UI.Lookup = function () {};


/**
 * Base class that drives the lookup widget. You should derive your own Driver that interacts with your datafeed.
 * @name  CIQ.UI.Lookup.Driver
 * @constructor
 */
export class Driver {
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

CIQ.UI.Lookup.Driver = Driver;

/**
 * UI helper for StudyMenu UI element.
 * @param {HTMLElement} node The node where the study menu will be drawn
 * @param {CIQ.UI.Context} context The context
 * @param {Object} params Optional parameters to control behavior of the menu
 * @param {Object} [params.excludedStudies] A map of study names that should not be put in the menu.
 * @param {Boolean} [params.alwaysDisplayDialog=false] If set to true then, the study will automatically be added to the chart, but a dialog will also always be displayed to allow the end user to pick their study parameters. Otherwise the study will be created automatically with defaults. Can optionally be an object containing a map of which studys to always display the dialog for.
 * @param {Boolean} [params.dialogBeforeAddingStudy=false] If set to true then a dialog will be displayed before the study is added to the chart. This can optionally be a map of which studies require a dialog before adding.
 * @param {string} [params.template=".stxTemplate"] Optionally specify a selector to use as a template for making the menu
 * @name CIQ.UI.StudyMenu
 * @constructor
 */
CIQ.UI.StudyMenu = function (node, context, params) {
    this.node = $(node);
    this.context = context;
    this.params = params || {};
    if (!this.params.template) this.params.template = '.stxTemplate';
    this.params.template = this.node.find(this.params.template);
    this.params.template.detach();
    this.alwaysDisplayDialog = this.params.alwaysDisplayDialog ? this.params.alwaysDisplayDialog : false;
    this.excludedStudies = this.params.excludedStudies;
    if (!this.excludedStudies) this.excludedStudies = [];
    context.advertiseAs(this, 'StudyMenu');
};
CIQ.UI.StudyMenu.ciqInheritsFrom(CIQ.UI.Helper);

/**
 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
 * CIQ.UI.StudyMenu for processing stxtap attributes, or you can call renderMenu() to automatically
 * generate the menu.
 * @memberOf CIQ.UI.StudyMenu
 */
CIQ.UI.StudyMenu.prototype.renderMenu = function () {
    let stx = this.context.stx;
    let alphabetized = [];
    let sd;
    for (let field in CIQ.Studies.studyLibrary) {
        sd = CIQ.Studies.studyLibrary[field];
        if (!sd.name) sd.name = field; // Make sure there's always a name
        if (this.excludedStudies[field] || this.excludedStudies[sd.name]) continue;
        alphabetized.push(field);
    }
    alphabetized.sort((lhs, rhs) => {
        let lsd = CIQ.Studies.studyLibrary[lhs];
        let rsd = CIQ.Studies.studyLibrary[rhs];
        if (lsd.name < rsd.name) return -1;
        if (lsd.name > rsd.name) return 1;
        return 0;
    });
    let menu = $(this.node);
    let self = this;
    let tapFn = function (studyName, context) {
        return function (e) {
            self.pickStudy(e.target, studyName);
            menu.resize();
        };
    };
    for (let i = 0; i < alphabetized.length; i++) {
        let menuItem = this.params.template.clone();
        sd = CIQ.Studies.studyLibrary[alphabetized[i]];
        menuItem.append(CIQ.translatableTextNode(stx, sd.name));
        menu.append(menuItem);
        menuItem[0].selectFC = tapFn(alphabetized[i], this.context);
        menuItem.stxtap(menuItem[0].selectFC);
    }
};

/**
 * Pops up a study dialog for the given study
 * @memberof CIQ.UI.StudyMenu
 */
CIQ.UI.StudyMenu.prototype.studyDialog = function (params) {
    params.context = this.context;
    $('cq-study-dialog').each(function () {
        this.open(params);
    });
};

/**
 * Called when the user clicks on a study in the study menu. Depending on the state of
 * this.alwaysDisplayDialog, this will either create a study dialog or it will create the study itself.
 * @param  {HTMLElement} node      The node that was clicked on
 * @param  {string} studyName The name of the study (entry in studyLibrary)
 * @memberOf CIQ.UI.StudyMenu
 */
CIQ.UI.StudyMenu.prototype.pickStudy = function (node, studyName) {
    let stx = this.context.stx;
    let self = this;

    function handleSpecialCase(flag, params) {
        if (flag === true) {
            self.studyDialog(params);
            return true;
        } else if (typeof flag === 'object') {
            for (let i in flag) {
                if (i === studyName && flag[i]) {
                    self.studyDialog(params);
                    return true;
                }
            }
        }
    }

    if (handleSpecialCase(this.params.dialogBeforeAddingStudy, { stx, name: studyName })) return;
    let sd = CIQ.Studies.addStudy(stx, studyName);
    handleSpecialCase(this.alwaysDisplayDialog, { sd, stx });
};

/**
 * A Heads up marker for displaying OHLC values on the chart.
 *
 * @name CIQ.Marker.HeadsUp
 * @constructor
 * @param {object} params
 * @param showClass
 */
CIQ.Marker.HeadsUp = function (params, showClass) {
    if (!this.className) this.className = 'CIQ.Marker.HeadsUp';
    CIQ.Marker.call(this, params);
    this.prevTick = null;
    this.showClass = showClass;
};

CIQ.Marker.HeadsUp.ciqInheritsFrom(CIQ.Marker, false);

/**
 * Determines the location of the HeadsUp Marker.
 *
 * @memberof CIQ.Marker.HeadsUp
 * @param {object} params
 */
CIQ.Marker.HeadsUp.placementFunction = function (params) {
    let panel = params.panel;
    let chart = panel.chart;
    let stx = params.stx;
    let useHighs = stx.highLowBars[stx.layout.chartType];
    if (!params.showClass) params.showClass = 'stx-show';

    for (let i = 0; i < params.arr.length; ++i) {
        let marker = params.arr[i];
        let node = $(marker.node);
        if (panel.hidden || !CIQ.ChartEngine.insideChart) {
            node.removeClass(params.showClass);
            return;
        }
        if (marker.params.x < 0 || marker.params.x >= chart.dataSet.length) {
            node.removeClass(params.showClass);
            return;
        }
        // always show the hud even if the crosshair toggle or a drawing tool is selected
        if (stx.layout.crosshair || stx.currentVectorParameters.vectorType) {
            node.removeClass(params.showClass);
            return;
        }
        let quote = chart.dataSet[marker.params.x];
        let x = stx.pixelFromTick(marker.params.x);
        if (!quote || x < chart.left || x > chart.right) {
            node.removeClass(params.showClass);
            return;
        }
        node.addClass(params.showClass);

        if (!marker.clientWidth) { marker.clientWidth = node.width(); }
        if (!marker.clientHeight) { marker.clientHeight = node.height(); }
        if (marker.clientWidth > x) {
            node.removeClass('stx-left');
            node.addClass('stx-right');
            node.css({
                left: `${x}px`,
                right: 'auto',
            });
        } else {
            node.addClass('stx-left');
            node.removeClass('stx-right');
            node.css({
                right: `${stx.chart.canvasWidth - x}px`,
                left: 'auto',
            });
        }

        var bottom;
        let containerHeight = marker.params.chartContainer ? stx.chart.canvasHeight : panel.bottom;
        if (useHighs) {
            bottom = getBottomPixel(stx, panel, containerHeight, stx.getBarBounds(quote).high);
        } else {
            bottom = getBottomPixel(stx, panel, containerHeight, quote[stx.chart.defaultPlotField]);
        }
        // Keep below top of screen
        let top = containerHeight - bottom - marker.clientHeight + stx.top;
        if (top < 0) {
            node.addClass('stx-below');
            bottom = (useHighs ? getBottomPixel(stx, panel, containerHeight, stx.getBarBounds(quote).low) : bottom) - marker.clientHeight;
        } else {
            node.removeClass('stx-below');
        }

        let bottomPX = `${bottom}px`;

        if (marker.node.style.bottom !== bottomPX) {
            marker.node.style.bottom = bottomPX;
        }
    }
};


function getBottomPixel(stx, panel, containerHeight, price) {
    return Math.round(containerHeight - stx.pixelFromPrice(price, panel));
}


/**
 * UI Helper that keeps the "head's up" display operating. There are three modes:
 * params.followMouse=true - The head's up display will follow the mouse
 * params.staticNode=true - The head's up will simply update a DOM node managed by you
 * default - The head's up will be a marker within the chart, positioned in the chart panel unless overidden
 *
 * @param {HtmlElement} node The node which should be the template for the head's up.
 * @param {CIQ.UI.Context} context The context
 * @param {Object} [params] Optional parameters
 * @param {Boolean} [autoStart=true] If true then start the head's up on construction
 * @param {boolean} [followMouse=false] If true then the head's up will follow the mouse. In this case, the node should be a template
 * that will be removed from the document and then added dynamically into the chart container.
 * @param {Boolean} [staticNode=false] If true then the node will not be added as a marker
 * @param {string} [showClass="stx-show"] The class that will be added to display the head's up
 * @name CIQ.UI.HeadsUp
 * @constructor
 * @since 3.0.0
 */
CIQ.UI.HeadsUp = function (node, context, params) {
    this.params = params || {};
    if (typeof this.params.autoStart === 'undefined') this.params.autoStart = true;
    this.node = $(node);
    this.node.detach();
    this.context = context;
    this.maxVolume = { lastCheckDate: null, value: 0 }; // This contains the maximum volume in the dataSet, used to generate the volume icon element
    if (this.params.autoStart) this.begin();
};

CIQ.UI.HeadsUp.ciqInheritsFrom(CIQ.UI.Helper);

/**
 * Begins the head's up operation. This uses injections to manage the contents and location of the display. See {@link CIQ.UI.HeadsUp#end} to stop
 * the head's up.
 * @memberof CIQ.UI.HeadsUp
 */
CIQ.UI.HeadsUp.prototype.begin = function () {
    let params;
    if (this.params.followMouse) {
        this.node.css({ top: 'auto' }); // allow style.bottom to override the default top value
        params = {
            stx: this.context.stx,
            label: 'headsup',
            xPositioner: 'bar',
            chartContainer: true,
            x: 0,
            node: this.node[0],
        };
        this.marker = new CIQ.Marker.HeadsUp(params, this.params.showClass);
        // this.node.addClass(this.params.showClass);

        this.addInjection('append', 'handleMouseOut', (function (self) {
            return function () {
                self.followMouse(-1);
            };
        }(this)));
    } else if (this.params.staticNode) {
        // placeholder
    } else {
        this.node.css({ top: '', left: '' }); // Remove any existing styles
        params = {
            stx: this.context.stx,
            label: 'headsup',
            xPositioner: 'none',
            chartContainer: false,
            node: this.node[0],
        };
        $.extend(params, this.params); // Override default marker setup by passing marker parameters into CIQ.UI.HaedsUp
        this.marker = new CIQ.Marker(params);
        // this.node.addClass(this.params.showClass);
    }

    // enable the crosshairs for touch devices
    if (CIQ.isMobile) {
        this.context.stx.layout.crosshair = true;
    }

    this.calculateMaxVolume();
    this.addInjection('prepend', 'headsUpHR', (function (self) { return function () { self.position(); }; }(this)));
    this.addInjection('append', 'createXAxis', (function (self) { return function () { self.position(); }; }(this)));
    this.addInjection('append', 'createDataSet', (function (self) { return function (dontRoll, whichChart, params) { self.calculateMaxVolume(params.appending); }; }(this)));
};

/**
 * Stops the head's up from operating by removing injections and hiding. You can start it again by calling {@link CIQ.UI.HeadsUp#begin}.
 * @memberOf CIQ.UI.HeadsUp
 */
CIQ.UI.HeadsUp.prototype.end = function () {
    if (CIQ.isMobile) {
        this.context.stx.layout.crosshair = false;
    }
    if (this.marker) this.marker.remove();
    this.destroy();
    this.marker = null;
};

/**
 * @memberof CIQ.UI.HeadsUp
 * @param {boolean} appending
 */
CIQ.UI.HeadsUp.prototype.calculateMaxVolume = function (appending) {
    if (!appending) this.maxVolume = { lastCheckDate: null, value: 0 };
    let dataSet = this.context.stx.chart.dataSet;
    if (!dataSet || !dataSet.length) return;
    for (let i = dataSet.length - 1; i >= 0; i--) {
        let q = dataSet[i];
        if (q.DT < this.maxVolume.lastCheckDate) break;
        if (q.Volume > this.maxVolume.value) this.maxVolume.value = q.Volume;
    }
    this.maxVolume.lastCheckDate = dataSet[dataSet.length - 1].DT;
};

/**
 * Determines information inside of the HeadsUp display based on position.
 * @memberof CIQ.UI.HeadsUp
 * @private
 */
CIQ.UI.HeadsUp.prototype.position = function () {
    let stx = this.context.stx;
    let bar = stx.barFromPixel(stx.cx);
    this.tick = stx.tickFromPixel(stx.cx);
    let prices = stx.chart.xaxis[bar];
    let currentQuote = stx.chart.currentQuote;
    let plotField = stx.chart.defaultPlotField;
    if (!plotField || stx.highLowBars[stx.layout.chartType]) plotField = 'Close';

    let node = this.node;
    let self = this;

    function printValues() {
        self.timeout = null;
        node.find('cq-hu-price').text('');
        node.find('cq-hu-open').text('');
        node.find('cq-hu-close').text('');
        node.find('cq-hu-high').text('');
        node.find('cq-hu-low').text('');
        node.find('cq-hu-date').text('');
        node.find('cq-hu-volume').text('');
        node.find('cq-volume-rollup').text('');
        if (prices) {
            if (prices.data) {
                node.find('cq-hu-open').text(stx.formatPrice(prices.data.Open));
                node.find('cq-hu-price').text(stx.formatPrice(prices.data[plotField]));
                node.find('cq-hu-close').text(stx.formatPrice(prices.data.Close));
                node.find('cq-hu-high').text(stx.formatPrice(prices.data.High));
                node.find('cq-hu-low').text(stx.formatPrice(prices.data.Low));

                let volume = CIQ.condenseInt(prices.data.Volume);
                let rollup = volume.charAt(volume.length - 1);
                if (rollup > '9') {
                    volume = volume.substring(0, volume.length - 1);
                    node.find('cq-volume-rollup').text(rollup.toUpperCase());
                }
                node.find('cq-hu-volume').text(volume);
                let tickDate = prices.data.displayDate;
                if (!tickDate) tickDate = prices.data.DT;
                if (CIQ.ChartEngine.isDailyInterval(stx.layout.interval)) {
                    node.find('cq-hu-date').text(CIQ.mmddyyyy(CIQ.yyyymmddhhmm(tickDate)));
                } else {
                    node.find('cq-hu-date').text(CIQ.mmddhhmm(CIQ.yyyymmddhhmmssmmm(tickDate)));
                }
                let visuals = node.find('cq-volume-visual');
                if (visuals.length) {
                    let relativeCandleSize = self.maxVolume.value ? prices.data.Volume / self.maxVolume.value : 0;
                    visuals.css({ width: `${Math.round(relativeCandleSize * 100)}%` });
                }
            }
            if (currentQuote && currentQuote[plotField] && self.tick === stx.chart.dataSet.length - 1) {
                node.find('cq-hu-price').text(stx.formatPrice(currentQuote[plotField]));
            }
        }
    }
    if (this.tick !== this.prevTick || (stx.chart.dataSegment && bar === stx.chart.dataSegment.length - 1)) {
        if (this.timeout) clearTimeout(this.timeout);
        let ms = this.params.followMouse ? 0 : 0; // IE and FF struggle to keep up with the dynamic head's up.
        this.timeout = setTimeout(printValues, ms);
    }
    this.prevTick = this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
    if (this.params.followMouse) {
        if (stx.openDialog) this.tick = -1; // Turn off the headsup when a modal is on
        this.followMouse(this.tick);
    }
};

CIQ.UI.HeadsUp.prototype.followMouse = function (tick) {
    this.marker.params.x = tick;
    let self = this;
    self.marker.render();
};


/**
 * UI Helper for managing study interaction, editing, deleting etc. It sets up
 * {@link CIQ.ChartEngine.callbacks#studyOverlayEdit} and {@link CIQ.ChartEngine.callbacks#studyPanelEdit} callbacks
 * in order to display a dialog for editing study parameters and a context menu for editing or deleting overlays.
 * @name CIQ.UI.StudyEdit
 * @param {HTMLElement} [node=context.topNode] Automatically attaches to the top node of the context
 * @param {CIQ.UI.Context} context The context for the chart
 * @constructor
 * @since  4.1.0 contextDialog is no longer passed in.
 */
CIQ.UI.StudyEdit = function (node, context) {
    this.context = context;
    this.node = node || context.topNode;
    this.contextDialog = $('cq-study-context');

    context.advertiseAs(this, 'StudyEdit');
    this.initialize();
};

CIQ.UI.StudyEdit.ciqInheritsFrom(CIQ.UI.Helper);

/**
 * Closes Study Edit dialog.
 * @memberof CIQ.UI.StudyEdit
 */
CIQ.UI.StudyEdit.prototype.remove = function () {
    CIQ.Studies.removeStudy(this.params.stx, this.params.sd);
    this.contextDialog.each(function () {
        this.close();
    });
};

/**
 * Proxy for editing a study. Assumes the params for the study have already been set.
 * @memberof CIQ.UI.StudyEdit
 */
CIQ.UI.StudyEdit.prototype.edit = function () {
    this.contextDialog.each(function () {
        this.close();
    });
    this.editPanel(this.params);
};

/**
 * This just finds the StudyDialog web component and proxies the parameters
 * over to it
 * @memberof CIQ.UI.StudyEdit
 * @param  {Object} params Parameters from studyPanelEdit callback
 */
CIQ.UI.StudyEdit.prototype.editPanel = function (params) {
    params.context = this.context;
    // Make sure we don't open the dialog in the context menu position
    params.x = null;
    params.y = null;
    $('cq-study-dialog').each(function () {
        this.open(params);
    });
};

/**
 * Displays the context dialog for studies and saves the parameters for editing
 * @memberof CIQ.UI.StudyEdit
 * @param  {Object} params Parameters from studyOverlayEdit callback
 */
CIQ.UI.StudyEdit.prototype.editOverlay = function (params) {
    this.params = params;
    params.context = this.context;
    if (params.forceEdit) {
        this.editPanel(params);
    } else {
        this.contextDialog.each(function () {
            params.x = CIQ.ChartEngine.crosshairX;
            params.y = CIQ.ChartEngine.crosshairY;
            this.open(params);
        });
    }
};

/**
 * Creates the callbacks for self and the context.
 * @memberof CIQ.UI.StudyEdit
 */
CIQ.UI.StudyEdit.prototype.initialize = function () {
    let stx = this.context.stx;
    let self = this;

    function closure(fc) {
        return function () {
            fc.apply(self, arguments);
        };
    }
    stx.callbacks.studyOverlayEdit = closure(self.editOverlay);
    stx.callbacks.studyPanelEdit = closure(self.editPanel);
};

/**
 * UI Helper for Layout changes, for instance tapping items on the display menu. This Helper
 * is also responsible for initializing menu items in the "display" menu based on the chart layout (CIQ.ChartEngine#layout)
 * @name CIQ.UI.Layout
 * @param {CIQ.UI.Context} context The context
 * @param {Object} [params] Parameters
 * @param {string} [params.activeClassName="ciq-active"] The class name to be added to a node when a layout item is enabled
 * @constructor
 * @since  4.1.0 Layout no longer takes a node as its first parameter
 */
CIQ.UI.Layout = function (context, params) {
    this.params = params || {};
    if (!this.params.activeClassName) this.params.activeClassName = 'ciq-active';
    this.context = context;
    context.advertiseAs(this, 'Layout');
};

CIQ.UI.Layout.ciqInheritsFrom(CIQ.UI.Helper);

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} chartType
 */
CIQ.UI.Layout.prototype.getChartType = function (node, chartType) {
    let activeClassName = this.params.activeClassName;
    // A little complexity here to consolidate two fields (aggregationType and chartType) into one
    // set of radio buttons
    function showChartType(params, node) {
        let layout = params.obj;
        if (layout.aggregationType && layout.aggregationType !== 'ohlc') {
            if (chartType !== layout.aggregationType) {
                $(node).removeClass(activeClassName);
            } else {
                $(node).addClass(activeClassName);
            }
        } else if (chartType !== layout.chartType) {
            $(node).removeClass(activeClassName);
        } else {
            $(node).addClass(activeClassName);
        }
    }
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: ['chartType', 'aggregationType'],
        action: 'callback',
        value: showChartType,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} chartType
 */
CIQ.UI.Layout.prototype.setChartType = function (node, chartType) {
    let aggregations = {
        heikinashi: true,
        kagi: true,
        linebreak: true,
        pandf: true,
        rangebars: true,
        renko: true,
    };
    if (aggregations[chartType]) {
        // this.context.stx.setChartType("candle");
        this.context.stx.setAggregationType(chartType);
    } else {
        this.context.stx.setChartType(chartType);
        // this.context.stx.setAggregationType(null);
    }
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} chartScale
 */
CIQ.UI.Layout.prototype.getChartScale = function (node, chartScale) {
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: 'chartScale',
        condition: chartScale,
        action: 'class',
        value: this.params.activeClassName,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} chartType
 */
CIQ.UI.Layout.prototype.setChartScale = function (node, chartScale) {
    let stx = this.context.stx;
    if (stx.layout.chartScale === chartScale) {
        stx.setChartScale(null);
    } else {
        stx.setChartScale(chartScale);
    }
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 */
CIQ.UI.Layout.prototype.getExtendedHours = function (node) {
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: 'extended',
        condition: true,
        action: 'class',
        value: this.params.activeClassName,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 */
CIQ.UI.Layout.prototype.setExtendedHours = function (node) {
    let stx = this.context.stx;
    stx.layout.extended = !stx.layout.extended;
    stx.changeOccurred('layout');

    if (stx.extendedHours) {
        let loader = this.context.loader;
        if (loader) loader.show();
        stx.extendedHours.set(stx.layout.extended, null, () => {
            loader.hide();
        });
    }
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 */
CIQ.UI.Layout.prototype.getRangeSlider = function (node) {
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: 'rangeSlider',
        condition: true,
        action: 'class',
        value: this.params.activeClassName,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 */
CIQ.UI.Layout.prototype.setRangeSlider = function (node) {
    let stx = this.context.stx;
    stx.layout.rangeSlider = !stx.layout.rangeSlider;
    if (stx.slider) stx.slider.display(stx.layout.rangeSlider);
    stx.changeOccurred('layout');
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} aggregationType
 */
CIQ.UI.Layout.prototype.getAggregationType = function (node, aggregationType) {
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: 'aggregationType',
        condition: aggregationType,
        action: 'class',
        value: this.params.activeClassName,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} aggregationType
 */
CIQ.UI.Layout.prototype.setAggregationType = function (node, aggregationType) {
    if (this.context.stx.layout.aggregationType === aggregationType) {
        this.context.stx.setAggregationType(null);
    } else {
        this.context.stx.setAggregationType(aggregationType);
    }
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} field
 */
CIQ.UI.Layout.prototype.getAggregationEdit = function (node, field) {
    let stx = this.context.stx;

    function populateEditField(params) {
        let name = params.selector.name;
        let value = params.obj[params.member];
        if (!value && stx.chart.defaultChartStyleConfig[name]) {
            $(params.selector).val(stx.chart.defaultChartStyleConfig[name]);
        } else {
            $(params.selector).val(value);
        }
    }

    let tuple = CIQ.deriveFromObjectChain(stx.layout, field);
    CIQ.UI.observe({
        selector: node,
        obj: tuple.obj,
        member: tuple.member,
        action: 'callback',
        value: populateEditField,
    });
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} field
 */
CIQ.UI.Layout.prototype.setAggregationEdit = function (node, field) {
    let stx = this.context.stx;
    if (field === 'auto') {
        if (stx.layout.aggregationType === 'kagi') {
            stx.layout.kagi = null;
        } else if (stx.layout.aggregationType === 'renko') {
            stx.layout.renko = null;
        } else if (stx.layout.aggregationType === 'linebreak') {
            stx.layout.priceLines = null;
        } else if (stx.layout.aggregationType === 'rangebars') {
            stx.layout.range = null;
        } else if (stx.layout.aggregationType === 'pandf') {
            if (!stx.layout.pandf) {
                stx.layout.pandf = { box: null, reversal: null };
            }
            stx.layout.pandf.box = null;
            stx.layout.pandf.reversal = null;
        }
    } else {
        let tuple = CIQ.deriveFromObjectChain(stx.layout, field);
        tuple.obj[tuple.member] = $(node.node).val();
    }
    stx.changeOccurred('layout');
    stx.createDataSet();
    stx.draw();
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {string} aggregationType
 */
CIQ.UI.Layout.prototype.showAggregationEdit = function (node, aggregationType) {
    let dialog = $('cq-aggregation-dialog');
    dialog[0].open({ context: this.context, aggregationType });
};

/**
 * Removes all studies ffrom the top most node
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 */
CIQ.UI.Layout.prototype.clearStudies = function (node) {
    let stx = this.context.stx;
    for (let id in stx.layout.studies) {
        let sd = stx.layout.studies[id];
        if (!sd.customLegend) CIQ.Studies.removeStudy(stx, sd);
    }
    stx.draw();
};

/**
 * @memberof CIQ.UI.Layout
 * @param {HTMLElement} node
 * @param {number} periodicity
 * @param {number} interval
 * @param {number} timeUnit
 */
CIQ.UI.Layout.prototype.setPeriodicity = function (node, periodicity, interval, timeUnit) {
    let self = this;
    if (self.context.loader) self.context.loader.show();
    self.context.stx.setPeriodicity({ period: periodicity, interval, timeUnit }, () => {
        if (self.context.loader) self.context.loader.hide();
    });
};

/**
 * Sets the display periodicity. Usually this is called from an observer that is in CIQ.UI.Layout#periodicity.
 *
 * @param  {CIQ.ChartEngine} stx    The chart object to examine for periodicity
 * @param  {Object} params Parameters
 * @param {HTMLElement} params.selector The selector to update
 */
CIQ.UI.Layout.prototype.showPeriodicity = function (stx, params) {
    let text = '';
    let periodicity = stx.layout.periodicity,
        interval = stx.layout.interval,
        timeUnit = stx.layout.timeUnit;
    if (isNaN(interval)) {
        timeUnit = interval;
        interval = 1;
    }
    periodicity *= interval;
    text = periodicity;
    if (timeUnit === 'day') {
        text += 'D';
    } else if (timeUnit === 'week') {
        text += 'W';
    } else if (timeUnit === 'month') {
        text += 'M';
    } else if (timeUnit === 'tick') {
        text += 'T';
    } else if (timeUnit === 'second') {
        text += 's';
    } else if (timeUnit === 'millisecond') {
        text += 'ms';
    } else if (periodicity >= 60 && periodicity % 15 === 0) {
        text = `${periodicity / 60}H`;
    } else {
        text += 'm';
    }
    $(params.selector).empty().append(CIQ.translatableTextNode(stx, text));
};

CIQ.UI.Layout.prototype.periodicity = function (node) {
    let self = this;

    function showPeriodicity(params) {
        self.showPeriodicity(self.context.stx, params);
    }
    CIQ.UI.observe({
        selector: node,
        obj: this.context.stx.layout,
        member: ['interval', 'periodicity', 'timeUnit'],
        action: 'callback',
        value: showPeriodicity,
    });
};

/**
 * Populates and displays the language widget
 * @memberof CIQ.UI.Layout
 */
CIQ.UI.Layout.prototype.setLanguage = function () {
    let dialog = $('cq-language-dialog').each(function () {
        this.open();
    });
};


/**
 * Displays the current language
 * @memberof CIQ.UI.Layout
 */
CIQ.UI.Layout.prototype.getLanguage = function (node) {
    function showLanguage(params, node) {
        $(node).find('cq-language-name').text(CIQ.I18N.languages[CIQ.I18N.language]);
        $(node).find('cq-flag').attr('cq-lang', CIQ.I18N.language);
    }

    CIQ.UI.observe({
        selector: node,
        obj: CIQ.I18N,
        member: 'language',
        action: 'callback',
        value: showLanguage,
    });
};

/**
 * UI Helper for capturing and handling keystrokes. cb to capture the key. Developer is responsible
 * for calling e.preventDefault() and/or e.stopPropagation();
 *
 * @name CIQ.UI.Keystroke
 * @param {HTMLElement} [node] The node to which to attach, generally the chart container
 * @param {Function} [cb] Callback when key pressed
 * @constructor
 */
CIQ.UI.Keystroke = function (node, cb) {
    this.node = $(node);
    this.cb = cb;
    this.initialize();
    this.shift = false;
    this.ctrl = false;
    this.cmd = false;
    this.capsLock = false;
    this.downValue = ''; // Android Chrome bug requires a workaround for keyup.
};

/**
 * Set this to true to bypass key capture. Shift, CTRL, CMD will still be toggled however
 * @memberof CIQ.UI.Keystroke
 * @type {Boolean}
 */
CIQ.UI.Keystroke.noKeyCapture = false;

// http://stackoverflow.com/questions/30743490/capture-keys-typed-on-android-virtual-keyboard-using-javascript
// On Chrome Android, the keydown/keyup events are broken. We have to figure out the key that was pressed by
// examining the value of an input box before (keydown) and after (keyup) and identifying what changed
// Note that CIQ.isAndroid is false when the user requests "desktop site" and so some input boxes won't work
// in that situation. There is no workaround other than to always treat 229 as a false value (it is a swedish character)
CIQ.UI.Keystroke.prototype.androidWorkaroundKeyup = function (e) {
    let newValue = e.target.value;
    let key;
    if (newValue.length > this.downValue.length) {
        key = newValue.charCodeAt(newValue.length - 1);
    } else {
        key = 'delete';
    }
    this.cb({ key, e, keystroke: this });
};

// Managing keystroke events. We will get three key events from the browser: keydown, keyup, keypress
// These come in a specific order: http://www.quirksmode.org/dom/events/keys.html
// keypress gives you the capitalized or uncapitalized key, unlike keyup/keydown
// which only give you the actual physical key that was pressed on the keyboard
// keypress is triggered *before* the action modifies the input field
//
// We can capture keystrokes on the body, or on an input field. What we want to make sure is that
// the input field is actually updated when we process the stroke. Since keypress and keydown occur
// before the input field is updated, we save any key that has been handled by these in this.key
// but we don't process the stroke until the keyup event is fired. This ensures that our handlers
// will always have the right key (capitalized) and that input field value will be up to date.
CIQ.UI.Keystroke.prototype.keyup = function (e) {
    let key = e.which;
    if (this.implementAndroidWorkaround) {
        this.androidWorkaroundKeyup(e);
        this.implementAndroidWorkaround = false;
        return;
    }

    switch (key) {
    case 16:
        this.shift = false;
        this.cb({ key, e, keystroke: this });
        return;
    case 17:
    case 18:
        this.ctrl = false;
        this.cb({ key, e, keystroke: this });
        return;
    case 91:
        this.cmd = false;
        this.cb({ key, e, keystroke: this });
        return;
    default:
        break;
    }
    // This is where we handle the keystroke, regardless of whether we captured the key with a down or press event
    // The exception to this is the arrow keys, which are processed in keydown
    if (this.key) this.cb({ key: this.key, e, keystroke: this });
};

CIQ.UI.Keystroke.prototype.keydown = function (e) {
    if (this.noKeyCapture) return;
    let key = e.which;
    if (key === 229 && CIQ.isAndroid) {
        this.implementAndroidWorkaround = true;
        return;
    }
    if (!this.ctrl) { if ((key !== 91 && key >= 48 && key <= 222) || key === 32) return; } // handled by keypress

    switch (key) {
    case 91:
        this.cmd = true;
        return;
    case 16:
        this.shift = true;
        return;
    case 17:
    case 18:
        this.ctrl = true;
        return;
    case 20:
        this.capsLock = !this.capsLock;
        return;
    }
    if (key === 8) key = 'backspace'; // delete on mac
    if (key === 9) key = 'tab';
    if (key === 13) key = 'enter';
    if (key === 27) key = 'escape';
    if (key === 33) key = 'page up';
    if (key === 34) key = 'page down';
    if (key === 35) key = 'end';
    if (key === 36) key = 'home';
    if (key === 45) key = 'insert';
    if (key === 46) key = 'delete';
    this.key = key;

    // If you hold a key down, then keydown will repeat. These are the keys
    // that we want to capture repeat action.
    if (key === 37 || key === 38 || key === 39 || key === 40) {
        if (key === 37) key = 'left';
        if (key === 38) key = 'up';
        if (key === 39) key = 'right';
        if (key === 40) key = 'down';
        this.key = null;
        this.cb({ key, e, keystroke: this });
    }
};

/**
 * Identifies a keypress event
 * @memberof CIQ.UI.Keystroke
 * @param e
 */
CIQ.UI.Keystroke.prototype.keypress = function (e) {
    if (this.noKeyCapture) return;
    let key = e.which;
    if (key < 32 || key > 222) return; // handled by keydown
    this.key = key;
};

/**
 * initializes member funcitons
 * @memberof CIQ.UI.Keystroke
 */
CIQ.UI.Keystroke.prototype.initialize = function () {
    let self = this;
    $(document).on('keyup', this.node, (e) => {
        self.keyup(e);
    });
    $(document).on('keydown', this.node, (e) => {
        self.downValue = e.target.value;
        self.keydown(e);
    });
    $(document).on('keypress', this.node, (e) => {
        self.keypress(e);
    });
    $(window).on('blur', (e) => { // otherwise ctrl-t to switch tabs causes ctrl to get stuck
        self.ctrl = false;
        self.cb({ key: 17, e, keystroke: self });
    });
};


/**
 * UI Helper for capturing and handling keystrokes. A helper or ContextTag can
 * "claim" keystrokes and intercept them, otherwise the keystrokes will be handled
 * by keyup and keydown.
 *
 * @param {HTMLElement} [node] The node to which to attach, generally the chart container
 * @param {CIQ.UI.Context} context The context for the chart
 * @param {Object} [params] Parameters to drive the helper
 * @param {Function} [params.cb] Callback to handle hot keys.
 * @name CIQ.UI.KeyboardShortcuts
 * @constructor
 */
CIQ.UI.KeystrokeHub = function (node, context, params) {
    this.node = $(node);
    this.context = context;
    this.params = params || {};
    this.uiManager = $('cq-ui-manager');
    if (this.uiManager.length > 0) {
        this.uiManager = this.uiManager[0];
        this.uiManager.keystrokeHub = this; // Register the keystroke hub so that it can be found
    }

    let self = this;

    function handler() {
        return function () {
            self.handler(...arguments);
        };
    }
    this.keystroke = new CIQ.UI.Keystroke(node, handler());
};

CIQ.UI.KeystrokeHub.ciqInheritsFrom(CIQ.UI.Helper);

/**
 * Global default hotkey method. Pass this or your own metho in to CIQ.UI.KeystrokeHub
 * @memberof CIQ.UI.KeyboardShortcuts
 * @param  {number} key The pressed key
 * @param  {CIQ.UI.KeystrokeHub} hub The hub that processed the key
 * @return {boolean}     Return true if you captured the key
 */
CIQ.UI.KeystrokeHub.defaultHotKeys = function (key, hub) {
    let stx = hub.context.stx;
    let push = 1;
    switch (key) {
    case 'up':
        stx.zoomIn();
        break;
    case 'down':
        stx.zoomOut();
        break;
    case 'home':
        stx.home();
        stx.headsUpHR();
        break;
    case 'end':
        stx.chart.scroll = stx.chart.dataSet.length;
        stx.draw();
        stx.headsUpHR();
        break;
    case 'left':
        if (stx.ctrl) {
            stx.zoomOut();
        } else {
            push = 1;
            if (stx.shift || hub.capsLock) push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth)));
            if (stx.chart.scroll + push >= stx.chart.dataSet.length) { push = stx.chart.dataSet.length - stx.chart.scroll; }
            stx.chart.scroll += push;
            stx.draw();
            stx.headsUpHR();
        }
        break;
    case 'right':
        if (stx.ctrl) {
            stx.zoomIn();
        } else {
            push = 1;
            if (stx.shift || hub.capsLock) push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth)));
            stx.chart.scroll -= push;
            stx.draw();
            stx.headsUpHR();
        }
        break;
    case 'delete':
    case 'backspace':
        if (CIQ.ChartEngine.drawingLine) {
            stx.undo();
        } else if (stx.anyHighlighted) {
            stx.deleteHighlighted();
        } else {
            return false;
        }
        break;
    case 'escape':
        if (CIQ.ChartEngine.drawingLine) {
            stx.undo();
        } else if (hub.uiManager) hub.uiManager.closeMenu();
        break;
    default:
        return false; // not captured
    }
    return true;
};

/**
 * Change the active context for the hub, for instance when dealing with multiple charts
 * @param {CIQ.UI.Context} context The context
 * @memberof CIQ.UI.KeystrokeHub
 */
CIQ.UI.KeystrokeHub.prototype.setActiveContext = function (context) {
    this.context = context;
};

/**
 * @param hub
 * @param key
 * @param e Event
 * @param keystroke
 * @memberof CIQ.UI.KeystrokeHub
 * @private
 */
CIQ.UI.KeystrokeHub.prototype.processKeyStrokeClaims = function (hub, key, e, keystroke) {
    for (let i = claims.length - 1; i > -1; i--) {
        let helper = claims[i].helper;
        let response = helper.keyStroke(hub, key, e, keystroke);
        if (response) {
            if (!response.allowDefault) e.preventDefault();
            return true;
        }
    }
    return false;
};

/**
 * Handles keystrokes
 * @param  {object} obj Event object
 * @memberof CIQ.UI.KeystrokeHub
 * @private
 */
CIQ.UI.KeystrokeHub.prototype.handler = function (obj) {
    let stx = this.context.stx;
    if (stx.editingAnnotation) return;
    let e = obj.e,
        key = obj.key,
        keystroke = obj.keystroke,
        targetTagName = obj.e.target.tagName;
    switch (key) {
    case 16:
        stx.shift = keystroke.shift;
        break;
    case 17:
    case 18:
        stx.ctrl = keystroke.ctrl;
        break;
    case 91:
        stx.cmd = keystroke.cmd;
        break;
    case 20:
        this.capsLock = !this.capsLock;
        break;
    default:
        break;
    }
    if (!CIQ.ChartEngine.drawingLine) {
        if (this.processKeyStrokeClaims(this, key, e, keystroke)) return;
    }

    if (key !== 'escape') {
        if (this.context.isModal()) return;
    }

    if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') return; // target is not the chart

    if (this.params.cb) {
        if (this.params.cb(key, this)) e.preventDefault();
    }
};

