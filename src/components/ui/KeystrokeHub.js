/* eslint-disable prefer-destructuring */
import CIQ from 'chartiq';
import Helper from './Helper';
import Keystroke from './Keystroke';
import { claims } from '.';

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
class KeystrokeHub extends Helper {
    static instance = null;

    constructor(node, context, params) {
        super(node, context, params);
        this.node = node;
        this.context = context;
        this.params = params || {};

        KeystrokeHub.instance = this;
        const self = this;

        function handler() {
            return (...args) => {
                self.handler(...args);
            };
        }
        this.keystroke = new Keystroke(node, handler());
    }

    /**
     * Global default hotkey method. Pass this or your own metho in to CIQ.UI.KeystrokeHub
     * @memberof CIQ.UI.KeyboardShortcuts
     * @param  {number} key The pressed key
     * @param  {CIQ.UI.KeystrokeHub} hub The hub that processed the key
     * @return {boolean}     Return true if you captured the key
     */
    static defaultHotKeys(key, hub) {
        const stx = hub.context.stx;
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
                if (stx.shift || hub.capsLock) { push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth))); }
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
                if (stx.shift || hub.capsLock) { push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth))); }
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
            }
            break;
        default:
            return false; // not captured
        }
        return true;
    }

    /**
     * Change the active context for the hub, for instance when dealing with multiple charts
     * @param {CIQ.UI.Context} context The context
     * @memberof CIQ.UI.KeystrokeHub
     */
    setActiveContext(context) {
        this.context = context;
    }

    /**
     * @param hub
     * @param key
     * @param e Event
     * @param keystroke
     * @memberof CIQ.UI.KeystrokeHub
     * @private
     */
    processKeyStrokeClaims(hub, key, e, keystroke) {
        for (let i = claims.length - 1; i > -1; i--) {
            const helper = claims[i].helper;
            const response = helper.keyStroke(hub, key, e, keystroke);
            if (response) {
                if (!response.allowDefault) { e.preventDefault(); }
                return true;
            }
        }
        return false;
    }

    addClaim(helper) {
        claims.push({ helper });
    }

    removeClaim(helper) {
        for (let i = 0; i < claims.length; i++) {
            if (claims[i].helper === helper) {
                claims.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Handles keystrokes
     * @param  {object} obj Event object
     * @memberof CIQ.UI.KeystrokeHub
     * @private
     */
    handler(obj) {
        const stx = this.context.stx;
        if (stx.editingAnnotation) { return; }
        const e = obj.e,
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
            if (this.processKeyStrokeClaims(this, key, e, keystroke)) { return; }
        }

        if (key !== 'escape') {
            if (this.context.isModal()) { return; }
        }

        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') { return; } // target is not the chart

        if (this.params.cb) {
            if (this.params.cb(key, this)) { e.preventDefault(); }
        }
    }
}

export default KeystrokeHub;
