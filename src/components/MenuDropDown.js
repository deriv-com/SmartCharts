import { CIQ } from '../../js/chartiq';
import { ContextTag } from './componentUI';

/**
 * Menu DropDown web component `<cq-menu-dropdown>`.
 *
 * Menu DropDown handles holding the items that go inside a custom menu component.
 * @namespace WebComponents.cq-menu-dropdown
 * @example
 <cq-menu class="ciq-menu ciq-studies collapse">
     <span>Studies</span>
     <cq-menu-dropdown cq-no-scroll>
         <cq-study-legend cq-no-close>
             <cq-section-dynamic>
                 <cq-heading>Current Studies</cq-heading>
                 <cq-study-legend-content>
                     <template>
                         <cq-item>
                             <cq-label class="click-to-edit"></cq-label>
                             <div class="ciq-icon ciq-close"></div>
                         </cq-item>
                     </template>
                 </cq-study-legend-content>
                 <cq-placeholder>
                     <div stxtap="Layout.clearStudies()" class="ciq-btn sm">Clear All</div>
                 </cq-placeholder>
             </cq-section-dynamic>
         </cq-study-legend>
         <cq-scroll cq-studies>
             <cq-item class="stxTemplate"></cq-item>
         </cq-scroll>

     </cq-menu-dropdown>
 */

// MenuDropDown is ContextTag and Scroll mashed together, but there aren't good
// options for that with es6 classes so the method implementations are fused together.

class MenuDropDown extends ContextTag {
    createdCallback() {
        if (this.ownerDocument !== document) return; // https://bugs.chromium.org/p/chromium/issues/detail?id=430578
        let node = $(this);
        super.createdCallback();
        if (typeof (node.attr('cq-no-scroll')) === 'undefined') {
            let node = this.node = $(this);
            if (node.perfectScrollbar) {
                node.perfectScrollbar({
                    suppressScrollX: true,
                });
            }
            node.css({
                'overflow-y': 'auto',
            });
        }
    }

    attachedCallback() {
        if (this.attached) return;
        let node = $(this);
        this.noMaximize = true;
        super.attachedCallback();
        this.attached = false; // double inheritance!
        if (typeof (node.attr('cq-no-scroll')) === 'undefined') {
            if (this.attached) return;
            this.uiManager = $('cq-ui-manager');
            if (this.uiManager.length > 0) this.uiManager = this.uiManager[0];

            this.addClaim(this);

            // prevent mousewheel event from propagating up to parents, such as when embedded in a chart
            this.addEventListener(CIQ.wheelEvent, (e) => {
                e.stopPropagation();
            });

            let self = this;
            CIQ.addResizeListener(this, () => {
                self.resize();
            });
            this.resize();
            this.attached = true;
        }
        this.attached = true;
    }

    // The following methods is copied from Scroll:
    /**
     * Scroll back to top
     */
    top() {
        this.scrollTop = 0;
        if (this.node.perfectScrollbar) this.node.perfectScrollbar('update');
    }

    /**
     * Scroll to the element.
     * @param  {HtmlElement} item The element to scroll to. Must be a child.
     * @alias scrollToElement
     * @memberof WebComponents.cq-scroll
     */
    scrollToElement(item) {
        let bottom = this.clientHeight,
            scrolled = this.scrollTop;
        let itemBottom = item.offsetTop + item.clientHeight;
        if (item.offsetTop > scrolled && itemBottom < bottom + scrolled) return;
        this.scrollTop = Math.max(itemBottom - bottom, 0);
        if (this.node.perfectScrollbar) this.node.perfectScrollbar('update');
    }

    resize() {
        let node = this.node;
        if (node.parents('.sharing').length) return;
        /* share.js appends this class to the body.
            Do not attempt unnecessary resize of scroll
            for a chart about to become a shared image.
            Besides, jquery will choke on offset() below. */
        if (typeof (node.attr('cq-no-resize')) !== 'undefined') return;
        if (typeof (node.attr('cq-no-maximize')) !== 'undefined') this.noMaximize = true;
        let position = node[0].getBoundingClientRect();
        let reduceMenuHeight = 45; // hard coded for now to take into account 15px of padding on menus and then an extra 5px for aesthetics
        let winHeight = $(window).height();
        if (!winHeight) return;
        let height = winHeight - position.top - reduceMenuHeight;
        let holders = node.parents('.stx-holder,.stx-subholder');
        if (holders.length) {
            holders.each(function () {
                let h = $(this);
                let holderBottom = h[0].getBoundingClientRect().top + h.height();
                height = Math.min(height, holderBottom - position.top - 5); // inside a holder we ignore reduceMenuHeight, but take off 5 pixels just for aesthetics
            });
        }

        // If there are subsequent siblings that have a fixed height then make room for them
        let nextAll = node.nextAll();
        for (let i = 0; i < nextAll.length; i++) {
            let sibling = $(nextAll[i]);
            if (!sibling.is(':visible')) continue; // skip hidden siblings
            height -= sibling.height();
        }
        if (!this.noMaximize) {
            node.css({
                height: `${height}px`,
            });
        }
        node.css({
            'max-height': `${height}px`,
        });
        if (this.node.perfectScrollbar) this.node.perfectScrollbar('update');
    }

    /**
     * Scroll components can handle up and down enter keystrokes.
     * They do not register for claims directly. Another section of code must
     * establish the claim on their behalf or proxy the keystroke.
     *
     * Up and down arrows will iterate through cq-item tags. The attribute
     * cq-focused will be added to the currently focused tag. This can then be
     * queried later, such as when a user hits enter.
     *
     * space bar or enter will call the selectFC callback on the cq-item if it exists
     * @param {undefined} hub Unused parameter
     * @param {string} key Key that was stroked
     * @param {object} e The event object
     * @return {boolean}
     */
    keyStroke(hub, key, e) {
        let node = this.node;

        if (!node.is(':trulyvisible')) return false;
        if (key !== 'up' && key !== 'down' && key !== 'enter' && key !== 32) return false;
        let items = node.find('cq-item');
        let focused = node.find('cq-item[cq-focused]');

        if (key === 32 || key === 'enter') {
            if (focused.length && focused[0].selectFC) {
                focused[0].selectFC.call(focused, e);
                return true;
            }
            return false;
        }
        if (!focused.length) {
            $(items[0]).attr('cq-focused', 'true');
            this.scrollToElement(items[0]);
            return true;
        }
        items.removeAttr('cq-focused');

        // locate our location in the list of items
        for (var i = 0; i < items.length; i++) {
            if (items[i] === focused[0]) break;
        }

        if (key === 'up') {
            i--;
            if (i < 0) i = 0;
        }
        if (key === 'down') {
            i++;
            if (i >= items.length) i = items.length - 1;
        }
        $(items[i]).attr('cq-focused', 'true');
        this.scrollToElement(items[i]);
        return true;
    }

    /**
     * Returns the focused element or null. An item is focused if it has
     * attribute cq-focused.
     * @return {HTMLElement} The element or null
     * @alias focused
     * @memberof WebComponents.cq-scroll
     */
    focused() {
        let focused = this.node.find('cq-item[cq-focused]');
        if (focused.length) return focused[0];
        return null;
    }
}

export default MenuDropDown;
