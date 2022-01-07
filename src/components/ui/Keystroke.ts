import React from 'react';

export type TKeystrokeProps = {
    key: string | number;
    e: Event | React.SyntheticEvent;
    keystroke: Keystroke;
};

export type TKeystrokeCallback = ({ key, e, keystroke }: TKeystrokeProps) => void;

/**
 * UI Helper for capturing and handling keystrokes. cb to capture the key. Developer is responsible
 * for calling e.preventDefault() and/or e.stopPropagation();
 *
 * @name CIQ.UI.Keystroke
 * @param {HTMLElement} [node] The node to which to attach, generally the chart container
 * @param {Function} [cb] Callback when key pressed
 * @constructor
 */
class Keystroke {
    /**
     * Set this to true to bypass key capture. Shift, CTRL, CMD will still be toggled however
     * @memberof CIQ.UI.Keystroke
     * @type {Boolean}
     */
    noKeyCapture = false;

    capsLock = false;
    cb?: TKeystrokeCallback;
    cmd = false;
    ctrl = false;
    downValue = '';
    implementAndroidWorkaround = false;
    key?: string | number | null;
    node: HTMLElement;
    shift = false;

    constructor(node: HTMLElement, cb: TKeystrokeCallback) {
        this.node = node;
        this.cb = cb;
        this.initialize();
        this.shift = false;
        this.ctrl = false;
        this.cmd = false;
        this.capsLock = false;
        this.downValue = ''; // Android Chrome bug requires a workaround for keyup.
    }

    // http://stackoverflow.com/questions/30743490/capture-keys-typed-on-android-virtual-keyboard-using-javascript
    // On Chrome Android, the keydown/keyup events are broken. We have to figure out the key that was pressed by
    // examining the value of an input box before (keydown) and after (keyup) and identifying what changed
    // Note that CIQ.isAndroid is false when the user requests "desktop site" and so some input boxes won't work
    // in that situation. There is no workaround other than to always treat 229 as a false value (it is a swedish character)
    androidWorkaroundKeyup(e: KeyboardEvent) {
        const newValue = (e.target as HTMLInputElement).value;
        let key;
        if (newValue.length > this.downValue.length) {
            key = newValue.charCodeAt(newValue.length - 1);
        } else {
            key = 'delete';
        }
        this.cb?.({ key, e, keystroke: this });
    }

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
    keyup = (e: KeyboardEvent) => {
        const key = e.which;
        if (this.implementAndroidWorkaround) {
            this.androidWorkaroundKeyup(e);
            this.implementAndroidWorkaround = false;
            return;
        }

        switch (key) {
            case 16:
                this.shift = false;
                this.cb?.({ key, e, keystroke: this });
                return;
            case 17:
            case 18:
                this.ctrl = false;
                this.cb?.({ key, e, keystroke: this });
                return;
            case 91:
                this.cmd = false;
                this.cb?.({ key, e, keystroke: this });
                return;
            default:
                break;
        }
        // This is where we handle the keystroke, regardless of whether we captured the key with a down or press event
        // The exception to this is the arrow keys, which are processed in keydown
        if (this.key) {
            this.cb?.({ key: this.key, e, keystroke: this });
        }
    };

    keydown = (e: KeyboardEvent) => {
        this.downValue = (e.target as HTMLInputElement).value;
        if (this.noKeyCapture) {
            return;
        }
        let key: string | number = e.which;
        if (key === 229 && CIQ.isAndroid) {
            this.implementAndroidWorkaround = true;
            return;
        }
        if (!this.ctrl) {
            if ((key !== 91 && key >= 48 && key <= 222) || key === 32) {
                return;
            }
        } // handled by keypress

        // eslint-disable-next-line default-case
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
        if (key === 8) {
            key = 'backspace';
        } // delete on mac
        if (key === 9) {
            key = 'tab';
        }
        if (key === 13) {
            key = 'enter';
        }
        if (key === 27) {
            key = 'escape';
        }
        if (key === 33) {
            key = 'page up';
        }
        if (key === 34) {
            key = 'page down';
        }
        if (key === 35) {
            key = 'end';
        }
        if (key === 36) {
            key = 'home';
        }
        if (key === 45) {
            key = 'insert';
        }
        if (key === 46) {
            key = 'delete';
        }
        this.key = key;

        // If you hold a key down, then keydown will repeat. These are the keys
        // that we want to capture repeat action.
        if (key === 37 || key === 38 || key === 39 || key === 40) {
            if (key === 37) {
                key = 'left';
            }
            if (key === 38) {
                key = 'up';
            }
            if (key === 39) {
                key = 'right';
            }
            if (key === 40) {
                key = 'down';
            }
            this.key = null;
            this.cb?.({ key, e, keystroke: this });
        }
    };

    /**
     * Identifies a keypress event
     * @memberof CIQ.UI.Keystroke
     * @param e
     */
    keypress = (e: KeyboardEvent) => {
        if (this.noKeyCapture) {
            return;
        }
        const key = e.which;
        if (key < 32 || key > 222) {
            return;
        } // handled by keydown
        this.key = key;
    };

    onblur = (e: FocusEvent) => {
        this.ctrl = false;
        this.cb?.({ key: 17, e, keystroke: this });
    };

    /**
     * initializes member funcitons
     * @memberof CIQ.UI.Keystroke
     */
    initialize() {
        this.node.addEventListener('keyup', this.keyup);
        this.node.addEventListener('keydown', this.keydown);
        this.node.addEventListener('keypress', this.keypress);
        // otherwise ctrl-t to switch tabs causes ctrl to get stuck
        window.addEventListener('blur', this.onblur);
    }
}

export default Keystroke;
