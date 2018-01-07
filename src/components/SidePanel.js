import { CIQ } from '../../js/chartiq';
import ContextTag from './ui/ContextTag';

/**
 * Side Panel web component `<cq-side-panel>`.
 *
 * @namespace WebComponents.cq-side-panel
 * @example
      <cq-side-panel><cq-side-panel>
 */
class SidePanel extends ContextTag {
    createdCallback() {
        super.createdCallback(arguments);
        this.callbacks = [];
    }

    registerCallback(fc) {
        this.callbacks.push(fc);
    }

    /**
     * Opens a side panel to show more options in mobile.
     * @param  {Object} params Parameters
     * @param {string} params.selector The selector for which child to enable
     * @param {string} [params.className] The class name to add to turn on the panel
     * @param {string} [params.attribute] The attribute to add to turn on the panel
     * @alias open
     * @memberof WebComponents.cq-side-panel
     */
    open(params) {
        this.close();
        let children = this.node.find(params.selector);
        if (params.className) {
            children.addClass(params.className);
            children.each(function () {
                this.sidePanelActiveClass = params.className; // store the class name used to turn it on
            });
        } else {
            children.attr(params.attribute, 'true');
            children.each(function () {
                this.sidePanelActiveAttribute = params.attribute; // store the attribute name used to turn it on
            });
        }
        this.node.attr('cq-active', 'true');
        let self = this;
        setTimeout(() => {
            self.resizeMyself();
        }, 0);
    }

    close() {
        this.node.removeAttr('cq-active');
        let children = this.node.children();
        children.each(function () {
            if (this.sidePanelActiveClass) {
                $(this).removeClass(this.sidePanelActiveClass);
            } // turn off a child by removing the class name added to it
            else {
                $(this).removeAttr(this.sidePanelActiveAttribute);
            } // turn off a child by removing the attribute name added to it
        });
        let self = this;
        setTimeout(() => {
            self.resizeMyself();
        }, 0);
    }

    /**
     * Use this method to get the width instead of querying the node directly because the side panel may be animated.
     * @return {number} The width
     */
    nonAnimatedWidth() {
        let width = 0;
        this.node.children().width((i, w) => {
            width += w;
        }); // accumulate width of all children
        return width;
    }

    resizeMyself() {
        let width = 0;
        this.node.children().width((i, w) => {
            width += w;
        }); // accumulate width of all children
        this.node.css({
            width: `${width}px`,
        }); // expand the side panel
        for (let i = 0; i < this.callbacks.length; i++) // let any callbacks know that we've been resized
        {
            this.callbacks[i].call(this, width);
        }
    }
}


/**
 * A side panel contains children that should be enabled by calling open({selector:selector}).
 */
document.registerElement('cq-side-panel', SidePanel);
export default SidePanel;
