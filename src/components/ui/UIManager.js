import $ from 'jquery';
import CIQ from 'chartiq';

/**
 * Global web component that manages the overall UI. This component keeps track of open menus and dialogs.
 * It attaches events to the body in order to close them.
 * @namespace WebComponents.cq-ui-manager
 * @memberof WebComponents
 */
class UIManager {
    static _instance;

    static get instance() {
        if (!UIManager._instance) {
            UIManager._instance = new UIManager();
        }

        return UIManager._instance;
    }
    /**
     * Prevents underlay clicks and handles tap events and callbacks.
     *
     * Creates an array of the active Menus to keep track of which component is currently active.
     * @memberof WebComponents.cq-ui-manager
     * @alias createdCallback
     */
    constructor() {
        this.activeMenuStack = [];
        this.registeredForResize = [];

        document.addEventListener('DOMContentLoaded', () => {
            CIQ.installTapEvent($('body')[0], { preventUnderlayClick: false });

            $('body').on('stxtap', () => {
                this.closeTopMenu();
            });

            const resize = () => {
                let rr = this.registeredForResize;
                for (let i = 0; i < rr.length; i++) {
                    if (typeof rr[i].resize === 'function') rr[i].resize();
                }
            };

            window.addEventListener('resize', resize);
        });
    }

    /**
     * Opens a menu item within the UI.Context
     * @memberof WebComponents.cq-ui-manager
     * @alias openMenu
     * @param {HTMLElement} menu
     * @param {object} params
     */
    openMenu(menu, params) {
        // Find the first input box, if any, and give focus
        setTimeout(() => {
            $(menu).find('input[cq-focus]:first-child').focus();
        }, 0);
        this.activeMenuStack.push(menu);
        menu.show(params);
        $('cq-context,*[cq-context]').each(function () {
            if (this.CIQ && this.CIQ.UI && this.CIQ.UI.context && this.CIQ.UI.context.stx) { this.CIQ.UI.context.stx.modalBegin(); }
        });
    }

    /**
     * Sets the top level menu in the activeMenuStack
     * @memberof WebComponents.cq-ui-manager
     * @alias topMenu
     * @return activeMenuStack
     */
    topMenu() {
        let activeMenuStack = this.activeMenuStack;
        if (!activeMenuStack.length) return null;
        return activeMenuStack[activeMenuStack.length - 1];
    }

    /**
     * Closes the current acttive menu and resets the activeMenuStack
     * @memberof WebComponents.cq-ui-manager
     * @alias closeMenu
     * @param {HTMLElement} element
     */
    closeMenu(menu) {
        let activeMenuStack = this.activeMenuStack;
        let parents = $(menu).parents('cq-menu');
        let closeThese = [];
        if (menu) {
            // if menu is specified then close it
            closeThese.push(menu);
            // along with any active parent menus
            for (let i = 0; i < parents.length; i++) {
                let parent = parents[i];
                if (parent.active) closeThese.push(parent);
            }
        } else {
            // close them all if no menu is specified
            closeThese = activeMenuStack;
        }
        // hide all the items we've decided to close
        for (let j = 0; j < closeThese.length; j++) {
            closeThese[j].hide();
        }
        // filter out the ones that are inactive
        this.activeMenuStack = activeMenuStack.filter(item => item.active);
        this.ifAllClosed();
    }

    /**
     *
     * @memberof WebComponents.cq-ui-manager
     * @alias registerForResize
     * @param {HTMLElement} element
     */
    registerForResize(element) {
        this.registeredForResize.push(element);
    }

    /**
     * @memberof WebComponents.cq-ui-manager
     * @alias unregisterForResize
     * @param {HTMLElement} element
     */
    unregisterForResize(element) {
        let rr = this.registeredForResize;
        for (let i = 0; i < rr.length; i++) {
            if (rr[i] === element) {
                rr.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @memberof WebComponents.cq-ui-manager
     * @alias ifAllClosed
     */
    ifAllClosed() {
        if (!this.activeMenuStack.length) {
            $('cq-context,*[cq-context]').each(function () {
                if (this.CIQ && this.CIQ.UI && this.CIQ.UI.context && this.CIQ.UI.context.stx) { this.CIQ.UI.context.stx.modalEnd(); }
            });
        }
    }

    /**
     * @memberof WebComponents.cq-ui-manager
     * @alias closeTopMenu
     */
    closeTopMenu() {
        let activeMenuStack = this.activeMenuStack;
        if (!activeMenuStack.length) return;
        let menu = activeMenuStack[activeMenuStack.length - 1];
        // If the top menu is a dialog, and isn't active yet then it has just been added, don't remove it
        if (!menu.isDialog || menu.active) {
            activeMenuStack.pop();
            menu.hide();
            let self = this;
            setTimeout(() => {
                self.ifAllClosed(); // Put this in a timeout so that a click on the body doesn't start a drawing
            }, 0);
        }
    }


    /**
     * Find all lifts for the menu, but not lifts that are within nested menus.
     * @memberof WebComponets.cq-ui-manager
     * @alias findLifts
     * @param  {HTMLElement} menu The menu to search
     * @return {JQuery}      Jquery selector containing any lifts
     */
    findLifts(menu) {
        let lifts = $(menu).find('*[cq-lift]').filter(function () {
            // only valid if the closest cq-menu or cq-dialog parent is the menu itself
            // otherwise the lift is in a nested menu
            let closest = $(this).closest('cq-menu,cq-dialog');
            return closest.length && closest[0] === menu;
        });
        return lifts;
    }

    /**
     *
     * @memberof WebComponents.cq-ui-manager
     * @alias restoreLift
     * @param {HTMLElement} element
     */
    restoreLift(element) {
        let node = $(element);
        if (!node.length) return;
        let remember = node[0].remember;
        node.detach();
        node.css(remember.css);
        $(remember.parentNode).append(node);
    }

    /**
     * Lifts a menu to an absolute position on the body, so that it can rise above any
     * overflow: hidden, scroll or iscroll situations
     *
     * Use cq-lift attribute to indicate that the menu should be lifted when opened
     *
     * context.lifts is an array that contains all of the current lifts so that
     * they can be restored when the menu is closed
     * @private
     * @memberof WebComponents.cq-ui-manager
     */
    lift(element) {
        let node = $(element);
        if (!node.length) return;
        let n = $(node)[0];
        n.remember = {
            parentNode: n.parentNode,
            css: {
                position: n.style.position,
                display: n.style.display,
                left: n.style.left,
                top: n.style.top,
                height: n.style.height,
                width: n.style.width,
                opacity: n.style.opacity,
            },
        };
        let offset = n.getBoundingClientRect();
        let height = node.height();
        node.detach();
        node.css({
            position: 'absolute',
            display: 'block',
            left: `${offset.left}px`,
            top: `${offset.top}px`,
            height: `${height}px`,
            opacity: 1,
        });
        $('body').append(node);
        if (typeof (n.resize) !== 'undefined') n.resize();
        node.find('cq-scroll').each(function () {
            this.resize();
        });
    }
}

export default UIManager;
