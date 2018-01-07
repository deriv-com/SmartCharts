import $ from 'jquery';
import { CIQ } from '../../js/chartiq';
import BaseComponent from './ui/BaseComponent';

/**
 * Scroll web component `<cq-scroll>`.
 *
 * cq-scroll web component creates an scrollable container. This will resize
 * itself when the screen is resized. If perfect-scrollbar
 * is supported then it will be used to replace the native scrollbar
 *
 * Attributes:
 * cq-no-maximize - Do not automatically maximize the height (but keep it showing on screen)
 * cq-no-resize - Do not apply any sizing logic.
 *
 * Use this.dataPortion to dynamically inject items into the list
 * @namespace WebComponents.cq-scroll
 * @example
 <cq-lookup-results>
     <cq-lookup-filters cq-no-close>
         <cq-filter class="true">ALL</cq-filter>
         <cq-filter>STOCKS</cq-filter>
         <cq-filter>FX</cq-filter>
         <cq-filter>INDEXES</cq-filter>
         <cq-filter>FUNDS</cq-filter>
         <cq-filter>FUTURES</cq-filter>
     </cq-lookup-filters>
     <cq-scroll></cq-scroll>
 */

class Scroll extends BaseComponent {
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

    createdCallback() {
        super.createdCallback();
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

    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
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

document.registerElement('cq-scroll', Scroll);
export default Scroll;
