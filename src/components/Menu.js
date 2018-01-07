import { CIQ } from '../../js/chartiq';

/**
 * Menu web component `<cq-menu>`.
 *
 * Node that is contextually aware of its surroundings. Handles opening and closing {@link WebComponents.cq-menu-dropdown}.
 * @namespace WebComponents.cq-menu
 * @example
 <cq-menu class="ciq-menu stx-markers collapse">
     <span>Events</span>
     <cq-menu-dropdown>
         <cq-item class="square">Simple Square <span class="ciq-radio"><span></span></span>
         </cq-item>
         <cq-item class="circle">Simple Circle <span class="ciq-radio"><span></span></span>
         </cq-item>
         <cq-item class="callouts">Callouts <span class="ciq-radio"><span></span></span>
         </cq-item>
         <cq-item class="abstract">Abstract <span class="ciq-radio"><span></span></span>
         </cq-item>
         <cq-item class="none">None <span class="ciq-radio ciq-active"><span></span></span>
         </cq-item>
     </cq-menu-dropdown>
 </cq-menu>
 */

class Menu extends HTMLElement {
    createdCallback() {
        this.node = $(this);
        this.activeClassName = 'stxMenuActive';
        this.active = false;
    }

    attachedCallback() {
        if (this.attached) return;
        this.uiManager = $('cq-ui-manager');
        if (this.uiManager.length > 0) this.uiManager = this.uiManager[0];

        this.attached = true;

        if (this.node.attr('readonly')) return;
        let self = this;

        function handleTap(e) {
            self.tap(e);
        }

        function handleCaptureTap(e) {
            self.captureTap(e);
        }
        let thisNode = this.node[0];
        this.node.stxtap(handleTap);
        thisNode.addEventListener('stxtap', handleCaptureTap, true);
    }

    open(params) {
        this.uiManager.openMenu(this, params);
    }

    close() {
        this.uiManager.closeMenu(this);
    }

    lift() {
        let lifts = this.lifts = this.uiManager.findLifts(this);
        for (let i = 0; i < lifts.length; i++) {
            this.uiManager.lift(lifts[i]);
        }
    }

    unlift() {
        let lifts = this.lifts;
        if (!lifts) return;
        for (let i = 0; i < lifts.length; i++) {
            this.uiManager.restoreLift(lifts[i]);
        }
        this.lifts = null;
    }

    show(params) {
        if (this.active) return;
        this.active = true;
        this.node.addClass(this.activeClassName);
        this.lift();
        // For good measure, call resize on any nested scrollables to give them
        // a chance to change their height and scrollbars
        let scrolls = this.node.find('cq-scroll');
        scrolls.each(function () {
            this.resize();
        });
    }

    hide() {
        if (!this.active) return;
        this.unlift();
        this.node.removeClass(this.activeClassName);
        this.active = false;
        // blur any input boxes that are inside the menu we're closing, to get rid of soft keyboard
        $(this).find('input').each(function () {
            if (this === document.activeElement) this.blur();
        });
    }

    /**
     * Captures a tap event *before* it descends down to what it is clicked on. The key thing this does is determine
     * whether the thing clicked on was inside of a "cq-no-close" section. We do this on the way down, because the act
     * of clicking on something may release it from the dom, making it impossible to figure out on propagation.
     * @param {object} e Element
     * @private
     */
    captureTap(e) {
        let target = $(e.target);
        let domChain = target.parents().addBack();
        // Determine if the tapped element, or any of its parents have a cq-no-close attribute
        this.noClose = domChain.filter(function () {
            let attr = $(this).attr('cq-no-close');
            return typeof attr !== typeof undefined && attr !== false;
        }).length;

        // Determine if the tapped element was inside of something untappable, like a cq-heading or cq-separator
        if (!this.noClose) {
            this.noClose = domChain.filter(function () {
                return $(this).is('cq-separator,cq-heading');
            }).length;
        }
    }

    tap(e) {
        let uiManager = this.uiManager;
        if (this.active) { // tapping on the menu if it is open will close it
            // todo, don't close if active children (cascading). Note, cascading already works for dialogs.
            e.stopPropagation();
            if (!this.noClose) uiManager.closeMenu(this);
        } else if (!this.active) { // if we've clicked on the label for the menu, then open the menu
            e.stopPropagation();

            // If the tap came from within this menu's cq-menu-dropdown then this is probably an accidental
            // "re-open", which occurs when a click on a menu item causes an action that closes the menu, tricking
            // it into thinking it should re-open
            let target = $(e.target);
            let insideDropdown = target.parents('cq-menu-dropdown');
            if (insideDropdown.length) return;

            let child = false;
            let parents = this.node.parents('cq-menu,cq-dialog');
            for (let i = 0; i < parents.length; i++) {
                if (parents[i].active) child = true;
            }
            if (!child) uiManager.closeMenu(); // close all menus unless we're the child of an active menu (cascading)

            this.open();
        }
    }
}

document.registerElement('cq-menu', Menu);
export default Menu;

