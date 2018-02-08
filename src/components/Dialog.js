import CIQ from 'chartiq';
import { createElement } from './ui/utils';
import VDom from './ui/VDom';
import BaseComponent from './ui/BaseComponent';
import UIManager from './ui/UIManager';

/**
 * Dialog web component `<cq-dialog>`.
 *
 * Manages general dialog interaction such as display, hide, location, size, tap interaction, etc
 *
 * @namespace WebComponents.cq-dialog
 * @example
<cq-dialog cq-timezone-dialog>
    <cq-timezone-dialog>
        <h4 class="title">Choose Timezone</h4>
        <cq-close></cq-close>

        <p>To set your timezone use the location button below, or scroll through the following list...</p>
        <p id="currentUserTimeZone"></p>
    <div class="detect">
    <div class="ciq-btn" stxtap="Layout.removeTimezone()">Use My Current Location</div>
    </div>
    <div id="timezoneDialogWrapper" style="max-height:360px; overflow: auto;">
            <ul>
              <li id="timezoneTemplate" style="display:none;cursor:pointer;"></li>
            </ul>
        </div>
    <div class="instruct">(Scroll for more options)</div>
    </cq-timezone-dialog>
</cq-dialog>
     */
class Dialog extends BaseComponent {
    createdCallback() {
        super.createdCallback();
        this.activeAttributes = {};
    }

    attachedCallback() {
        if (this.attached) return;
        this.isDialog = true;
        super.attachedCallback();
        let self = this;

        this.node[0].addEventListener('stxtap', (e) => {
            self.tap(e);
        });

        let uiManager = UIManager.instance;
        uiManager.registerForResize(this);
        this.uiManager = uiManager;
    }

    detachedCallback() {
        let uiManager = UIManager.instance;
        uiManager.unregisterForResize(this);
    }

    /**
     * Creates a new attribute to be activated when the dialog is open. Use
     * this to style the dialog. This is automatically set by any component
     * that is derived from DialogContentTag
     * @param {string} attribute The attribute to add or remove
     * @memberof WebComponents.cq-dialog
     * @since  4.1.0
     * @example
     * <style> cq-dialog[cq-study-context]{ padding:0; } </style>
     * <cq-dialog cq-study-context></cq-dialog>
     */
    addActiveAttribute(attribute) {
        this.activeAttributes[attribute] = true;
    }

    tap(e) {
        let topMenu = this.uiManager.topMenu();
        if (topMenu === this) {
            e.stopPropagation(); // prevent a tap inside the dialog from closing itself
            return;
        }
        if (!e.currentTarget.active) {
            e.stopPropagation(); // If the dialog we tapped on is closed, then we must have closed it manually. Don't allow a body tap otherwise we'll close two dialogs!
        }
    }

    resize() {
        if (this.params && this.params.x) {
            this.stxContextMenu();
        } else {
            this.center();
        }
        const scrollers = $$$('cq-scroll', this.node[0]);
        if (scrollers) scrollers.resize();
    }

    stxContextMenu() {
        let parent = this.node[0].parentNode;
        if (parent.tagName === 'BODY') parent = window;
        let w = VDom(parent).guaranteedWidth();
        let h = VDom(parent).guaranteedHeight();
        let cw = this.node[0].offsetWidth;
        let ch = this.node[0].offsetHeight;
        let left = this.params.x;
        let top = this.params.y;
        if (left + cw > w) left = w - cw;
        if (top + ch > h) top -= ch;
        if (top < 0) top = 0;
        this.node[0].style.top = `${top}px`;
        this.node[0].style.left = `${left}px`;
    }

    center() {
        let parent = this.node[0].parentNode;
        if (parent.tagName === 'BODY') parent = window;
        let w = VDom(parent).guaranteedWidth();
        let h = VDom(parent).guaranteedHeight();
        let cw = this.node[0].offsetWidth;
        let ch = this.node[0].offsetHeight;
        let left = w / 2 - cw / 2;
        let top = h / 2 - ch / 2;
        if (left < 0) left = 0;
        if (h > ch * 2 && top + (ch / 2) > h / 3) {
            top = h / 3 - ch / 2; // Position 1/3 down the screen on large screens
        }
        if (top < 0) top = 0;
        this.node[0].style.top = `${top}px`;
        this.node[0].style.left = `${left}px`;
    }

    open(params) {
        this.uiManager.openMenu(this, params);
    }

    close() {
        this.uiManager.closeMenu(this);
    }


    hide() {
        if ($$$(':invalid', this)) return;
        // Call the "hide()" function for any immediate children. This will allow nested
        // components to clean themselves up when a dialog is removed from outside of their scope.
        [].forEach.call(this.node[0].children, (el) => {
            if (typeof el.hide === 'function') {
                el.hide();
            }
        });
        this.active = false;
        if (this.uiManager.overlay) {
            VDom(this.uiManager.overlay).removeAttribute('cq-active');
        }

        this.uiManager.overlay = null;
        for (let attribute in this.activeAttributes) {
            VDom(this.node[0]).removeAttribute(attribute);
        }
        this.activeAttributes = {};

        // blur any input boxes that are inside the dialog we're closing, to get rid of soft keyboard
        this.querySelectorAll('input').forEach((el) => {
            if (el === document.activeElement) el.blur();
        });
    }

    /**
     * Show the dialog. Use X,Y *screen location* (pageX, pageY from an event) for where to display context menus. If the context menu cannot fit on the screen then it will be adjusted leftward and upward
     * by enough pixels so that it shows.
     * @param {object} [params] Parameters
     * @param  {Boolean} [params.bypassOverlay=false] If true will not display the scrim overlay
     * @param {Number} [params.x] X location of top left corner. Use for context menus, otherwise dialog will be centered.
     * @param {Number} [params.y] Y location of top left corner. Use for context menus, otherwise dialog will be centered.
     * @alias show
     * @memberof WebComponents.cq-dialog
     */
    show(params) {
        this.params = params;
        if (!params) params = this.params = {};
        let self = this;
        if (!this.uiManager.overlay && !params.bypassOverlay) {
            this.uiManager.overlay = createElement('<cq-dialog-overlay></cq-dialog-overlay>');
            document.body.appendChild(this.uiManager.overlay);
        }
        setTimeout(() => { // to get the opacity transition effect
            if (self.uiManager.overlay && !params.bypassOverlay) {
                VDom(self.uiManager.overlay).setAttribute('cq-active');
            }
            self.activeAttributes['cq-active'] = true; // cq-active is what css uses to display the dialog
            for (let attribute in self.activeAttributes) {
                VDom(self.node[0]).setAttribute(attribute);
            }
            self.resize();
            self.active = true;
        });
    }
}

/**
 * The attributes that are added to a cq-dialog when it is opened (and removed when closed).
 * Contains "cq-active" by default.
 * @memberof WebComponents.cq-dialog
 * @type {Object}
 */
Dialog.prototype.activeAttributes = null;

document.registerElement('cq-dialog', Dialog);
export default Dialog;
