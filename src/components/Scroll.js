import $ from 'jquery';
import CIQ from 'chartiq';
import { getParents } from './ui/utils';
import ContextTag from './ui/ContextTag';
import UIManager from './ui/UIManager';

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

class Scroll extends ContextTag {
    /**
     * Scroll back to top
     */
    top() {
        this.scrollTop = 0;
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
    }

    resize() {
        if (!this.context) {
            // return if context is not intialized yet
            return;
        }

        let node = this.node;
        if (getParents(node[0], '.sharing').length) return;
        /* share.js appends this class to the body.
            Do not attempt unnecessary resize of scroll
            for a chart about to become a shared image.
            Besides, jquery will choke on offset() below. */
        if (node[0].getAttribute('cq-no-resize') !== null) return;
        if (node[0].getAttribute('cq-no-maximize') !== null) this.noMaximize = true;
        let position = node[0].getBoundingClientRect();

        let chartHeight = this.context.stx.chart.height;
        let height = chartHeight * 0.6;

        // If there are subsequent siblings that have a fixed height then make room for them
        let nextAll = node.nextAll();
        for (let i = 0; i < nextAll.length; i++) {
            let sibling = $(nextAll[i]);
            if (!sibling.is(':visible')) continue; // skip hidden siblings
            height -= sibling.height();
        }
        if (!this.noMaximize) {
            node[0].style.height = `${height}px`;
        }
        node[0].style.maxHeight = `${height}px`;
    }

    createdCallback() {
        super.createdCallback();
        let node = this.node = $(this);
        node[0].style.overflowY = 'auto';
    }

    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.uiManager = UIManager.instance;

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

        // TODO: once code base is fully ported to react, remove querying 'cq-item'
        let items = node[0].querySelectorAll('cq-item');
        let focused = node[0].querySelectorAll('cq-item[cq-focused]');

        if (items.length === 0) {
            items = node[0].querySelectorAll('.ciq-row');
            focused = node[0].querySelectorAll('.ciq-row[cq-focused]');
        }

        if (key === 32 || key === 'enter') {
            if (focused.length && focused[0].selectFC) {
                // TODO: review whether code here is needed once code base is fully ported to react
                focused[0].selectFC.call(focused, e);
                return true;
            } else if (focused.length) {
                focused[0].click();
            }
            return false;
        }

        if (!focused.length) {
            items[0].setAttribute('cq-focused', 'true');
            this.scrollToElement(items[0]);
            return true;
        }

        items.forEach(item => item.removeAttribute('cq-focused'));

        // locate our location in the list of items
        let i;
        for (i = 0; i < items.length; i++) {
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

        items[i].setAttribute('cq-focused', 'true');
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
        // TODO: review this area once code base is ported to react
        let focused = this.node.find('cq-item[cq-focused]');
        if (focused.length === 0) {
            focused = this.node.find('.ciq-row[cq-focused]');
        }
        if (focused.length) return focused[0];
        return null;
    }
}

document.registerElement('cq-scroll', Scroll);
export default Scroll;
