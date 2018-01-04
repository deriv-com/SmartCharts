import { CIQ } from '../../js/chartiq';
import Dialog from './Dialog';

/**
 * Color Picker web component `<cq-color-picker>`.
 *
 * cq-colors attribute can contain a csv list of CSS colors to use
 * or this.params.colorMap can be set to a two dimensional array of colors
 * @namespace WebComponents.cq-color-picker
 * @example
     <cq-color-picker>
         <cq-colors></cq-colors>
         <cq-overrides>
             <template>
                 <div class="ciq-btn"></div>
             </template>
         </cq-overrides>
     </cq-color-picker>
 */
class ColorPicker extends Dialog {
    createdCallback() {
        CIQ.UI.Dialog.prototype.createdCallback.apply(this);
        this.params = {
            colorMap: [
                ['#ffffff', '#e1e1e1', '#cccccc', '#b7b7b7', '#a0a0a5', '#898989', '#707070', '#626262', '#555555', '#464646', '#363636', '#262626', '#1d1d1d', '#000000'],
                ['#f4977c', '#f7ac84', '#fbc58d', '#fff69e', '#c4de9e', '#85c99e', '#7fcdc7', '#75d0f4', '#81a8d7', '#8594c8', '#8983bc', '#a187bd', '#bb8dbe', '#f29bc1'],
                ['#ef6c53', '#f38d5b', '#f8ae63', '#fff371', '#acd277', '#43b77a', '#2ebbb3', '#00bff0', '#4a8dc8', '#5875b7', '#625da6', '#8561a7', '#a665a7', '#ee6fa9'],
                ['#ea1d2c', '#ee652e', '#f4932f', '#fff126', '#8ec648', '#00a553', '#00a99c', '#00afed', '#0073ba', '#0056a4', '#323390', '#66308f', '#912a8e', '#e9088c'],
                ['#9b0b16', '#9e4117', '#a16118', '#c6b920', '#5a852d', '#007238', '#00746a', '#0077a1', '#004c7f', '#003570', '#1d1762', '#441261', '#62095f', '#9c005d'],
                ['#770001', '#792e03', '#7b4906', '#817a0b', '#41661e', '#005827', '#005951', '#003b5c', '#001d40', '#000e35', '#04002c', '#19002b', '#2c002a', '#580028'],
            ],
        };
    }

    attachedCallback() {
        if (this.attached) return;
        CIQ.UI.Dialog.prototype.attachedCallback.apply(this);

        let node = $(this);
        let colors = node.attr('cq-colors');
        if (colors) {
        // Convert a csv list of colors to a two dimensional array
            colors = colors.split(',');
            let cols = Math.ceil(Math.sqrt(colors.length));
            this.params.colorMap = [];
            console.log('this.params.colorMap=[]');
            console.log(typeof this.params.colorMap);
            let col = 0;
            let row = [];
            for (let i = 0; i < colors.length; i++) {
                if (col >= cols) {
                    col = 0;
                    this.params.colorMap.push(row);
                    row = [];
                }
                row.push(colors[i]);
                col++;
            }
            this.params.colorMap.push(row);
        }
        this.cqOverrides = node.find('cq-overrides');
        this.template = this.cqOverrides.find('template');
        this.initialize();
        this.attached = true;
    }

    /**
 * @param {object} colorMap Object that holds an array of various color arrays.
 * @alias setColors
 * @memberof WebComponents.cq-color-picker
 */
    setColors(colorMap) {
        this.params.colorMap = colorMap;
        this.initialize();
    }

    initialize() {
        let self = this;
        this.picker = $(this);
        this.colors = this.picker.find('cq-colors');
        if (!this.colors.length) this.colors = this.picker;
        this.colors.empty();// allow re-initialize, with new colors for instance

        function closure(self, color) {
            return function () {
                self.pickColor(color);
            };
        }
        for (let a = 0; a < this.params.colorMap.length; a++) {
            let lineOfColors = this.params.colorMap[a];
            let ul = $('<UL></UL>').appendTo(this.colors);
            for (let b = 0; b < lineOfColors.length; b++) {
                let li = $('<LI></LI>').appendTo(ul);
                let span = $('<SPAN></SPAN>').appendTo(li);
                span.css({ 'background-color': lineOfColors[b] });
                span.stxtap(closure(self, lineOfColors[b]));
            }
        }
    }

    /**
 * @param color
 * @alias pickColor
 * @memberof WebComponents.cq-color-picker
 */
    pickColor(color) {
        if (this.callback) this.callback(color);
        this.close();
    }

    resize() {
    // do nothing for resize, overrides Dialog default which centers
    }

    /**
 * Displays the color picker in proximity to the node passed in
 * @param  {object} activator The object representing what caused picker to display
 * @param  {HTMLElement} [activator.node] The node near where to display the color picker
 * @param {Array} [activator.overrides] Optional array of overrides. For each of these, a button will be created that if pressed
 * will pass that override back instead of the color
 * @alias display
 * @memberof WebComponents.cq-color-picker
 */
    display(activator) {
        let node = $(activator.node);

        // Algorithm to place the color picker to the right of whichever node was just pressed
        let positionOfNode = node[0].getBoundingClientRect();
        this.picker.css({ top: '0px', left: '0px' });
        let positionOfColorPicker = this.parentNode.getBoundingClientRect();
        let x = positionOfNode.left - positionOfColorPicker.left + node.width() + 10;
        let y = positionOfNode.top - positionOfColorPicker.top + 5;

        // ensure color picker doesn't go off right edge of screen
        let docWidth = $(document).width();
        let w = this.picker.width();
        if (x + w > docWidth) x = docWidth - w - 20; // 20 for a little whitespace and padding

        // or bottom of screen
        let docHeight = $(document).height();
        let h = this.picker.height();
        if (y + h > docHeight) y = docHeight - h - 20; // 20 for a little whitespace and padding

        this.picker.css({ left: `${x}px`, top: `${y}px` });
        this.cqOverrides.emptyExceptTemplate();

        if (activator.overrides && this.template.length) {
            for (let i = 0; i < activator.overrides.length; i++) {
                let override = activator.overrides[i];
                let n = CIQ.UI.makeFromTemplate(this.template, true);
                n.text(override);
                n.stxtap((function (self, override) { return function () { self.pickColor(override); }; })(this, override));
            }
        }

        if (!this.picker.hasClass('stxMenuActive')) {
            this.picker[0].open(); // Manually activate the color picker
        } else {
            if (this.context.e) this.context.e.stopPropagation(); // Otherwise the color picker is closed when you swap back and forth between fill and line swatches on the toolbar
        }
    }
}
export default ColorPicker;
CIQ.UI.ColorPicker = document.registerElement('cq-color-picker', ColorPicker);
