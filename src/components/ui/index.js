import $ from 'jquery';
import { CIQ } from '../../../js/chartiq';
import '../../../js/thirdparty/webcomponents-lite.min';
import './jquery-extensions';
import './UI';
import './UIManager';

import HeadsUp from './HeadsUp';
import StudyEdit from './StudyEdit';
import Layout from './Layout';
import HeadsUpMarker from './HeadsUpMarker';
import StudyMenu from './StudyMenu';
import KeystrokeHub from './KeystrokeHub';

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

CIQ.UI.release = false;

/**
 * Set this flag to true to bypass bindings when adding a component to the DOM.
 * For instance when components are created by html2canvas we don't want them to do any heavy lifting.
 * @type {Boolean}
 */
CIQ.UI.bypassBindings = false;

export const claims = [];

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

    function objectLoad(/* e */) {
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

CIQ.Marker.HeadsUp = HeadsUpMarker;
CIQ.UI.HeadsUp = HeadsUp;
CIQ.UI.KeystrokeHub = KeystrokeHub;
CIQ.UI.StudyEdit = StudyEdit;
CIQ.UI.StudyMenu = StudyMenu;
CIQ.UI.Layout = Layout;
