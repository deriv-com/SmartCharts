import { ContextTag, aggregation } from './componentUI';
import Scroll from './Scroll';

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

class MenuDropDown extends aggregation(ContextTag, Scroll) {
    createdCallback() {
        if (this.ownerDocument !== document) return; // https://bugs.chromium.org/p/chromium/issues/detail?id=430578
        let node = $(this);
        ContextTag.prototype.createdCallback.apply(this);
        if (typeof (node.attr('cq-no-scroll')) === 'undefined') {
            Scroll.prototype.createdCallback.apply(this);
        }
    }
    
    attachedCallback() {
        if (this.attached) return;
        let node = $(this);
        this.noMaximize = true;
        ContextTag.prototype.attachedCallback.apply(this);
        this.attached = false; // double inheritance!
        if (typeof (node.attr('cq-no-scroll')) === 'undefined') {
            Scroll.prototype.attachedCallback.apply(this);
        }
        this.attached = true;
    }
}


export default MenuDropDown;
