/* eslint-disable prefer-destructuring */
import Helper from './Helper';
import Keystroke, { TKeystrokeProps } from './Keystroke';
import Context from './Context';
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

type TParams = { cb: (key: string, hub: KeystrokeHub) => boolean };
class KeystrokeHub extends Helper {
    static instance: KeystrokeHub | null = null;
    capsLock = false;
    keystroke: Keystroke;
    params: TParams;
    constructor(node: HTMLElement, context: Context | null, params: TParams) {
        super(node, context);
        this.node = node;
        this.context = context;
        this.params = params || {};
        KeystrokeHub.instance = this;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        function handler() {
            return (...args: [TKeystrokeProps]) => {
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
    static defaultHotKeys(key: string, hub: KeystrokeHub) {
        const stx = hub.context?.stx;
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
                    if (stx.shift || hub.capsLock) {
                        push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth)));
                    }
                    if (stx.chart.scroll + push >= stx.chart.dataSet.length) {
                        push = stx.chart.dataSet.length - stx.chart.scroll;
                    }
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
                    if (stx.shift || hub.capsLock) {
                        push = Math.max(5, 5 * (8 - Math.round(stx.layout.candleWidth)));
                    }
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
    setActiveContext(context: Context | null) {
        this.context = context;
    }

    /**
     * Handles keystrokes
     * @param  {object} obj Event object
     * @memberof CIQ.UI.KeystrokeHub
     * @private
     */
    handler(obj: TKeystrokeProps) {
        if (!this.context) {
            return;
        }
        const stx = this.context.stx;
        if (stx.editingAnnotation) {
            return;
        }
        const e = obj.e,
            key = obj.key,
            keystroke = obj.keystroke,
            targetTagName = (obj.e.target as HTMLElement).tagName;
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
        if (key !== 'escape') {
            if (this.context.isModal()) {
                return;
            }
        }
        if (targetTagName === 'INPUT' || targetTagName === 'TEXTAREA') {
            return;
        } // target is not the chart
        if (this.params.cb) {
            if (this.params.cb(key as string, this)) {
                e.preventDefault();
            }
        }
    }
}
export default KeystrokeHub;
