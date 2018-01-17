import $ from 'jquery';
import CIQ from 'chartiq';
import ContextTag from './ui/ContextTag';

/**
 * Emits a "change" event when changed
 */
class DrawingToolbar extends ContextTag {
    attachedCallback() {
        if (this.attached) return;
        super.attachedCallback();
        this.node = $(this);
        this.params = {
            toolSelection: this.node.find('*[cq-current-tool]'),
            lineSelection: this.node.find('*[cq-line-style]'),
            fontSizeSelection: this.node.find('*[cq-font-size]'),
            fontFamilySelection: this.node.find('*[cq-font-family]'),
        };
        this.noToolSelectedText = '';
        this.attached = true;
    }

    defaultElements(drawingParameters) {
        let arr = [];
        for (let param in drawingParameters) {
            if (param === 'color') arr.push('cq-line-color');
            else if (param === 'fillColor') arr.push('cq-fill-color');
            else if (param === 'pattern' || param === 'lineWidth') arr.push('cq-line-style');
            else if (param === 'axisLabel') arr.push('cq-axis-label');
            else if (param === 'font') arr.push('cq-annotation');
            else if (param === 'parameters') arr.push('cq-clickable');
        }

        return arr;
    }

    setContext(context) {
        this.noToolSelectedText = $(this.params.toolSelection).text();
        this.sync();
    }


    /**
     * Synchronizes the drawing toolbar with stx.currentVectorParameters. Poor man's data binding.
     * @param {Object} [cvp=stx.currentVectorParameters] A new drawing object, otherwise defaults to the current one
     */
    sync(cvp) {
        let stx = this.context.stx;
        if (!cvp) cvp = stx.currentVectorParameters;
        else stx.currentVectorParameters = cvp;

        this.setLine(null, cvp.lineWidth, cvp.pattern);

        let style = stx.canvasStyle('stx_annotation');

        let initialSize = cvp.annotation.font.size;
        if (!initialSize) initialSize = style.fontSize;
        this.setFontSize(null, initialSize);

        let initialFamily = cvp.annotation.font.family;
        if (!initialFamily) initialFamily = style.fontFamily;
        this.setFontFamily(null, initialFamily);

        this.getFillColor({});
        this.getLineColor({});
    }

    emit() {
        // This is old style to support IE11
        let event = document.createEvent('Event');
        event.initEvent('change', true, true);
        this.dispatchEvent(event);
    }

    noTool() {
        let stx = this.context.stx;
        stx.changeVectorType(null);
        if (stx.layout.crosshair) {
            stx.layout.crosshair = false;
            stx.changeOccurred('layout');
            stx.doDisplayCrosshairs();
        }
        if (stx.preferences.magnet) {
            this.toggleMagnet(this);
        }
        $(this.params.toolSelection).text(this.noToolSelectedText);
        this.node.find('*[cq-section]').removeClass('ciq-active');
        this.emit();
    }

    crosshairs(activator) {
        let stx = this.context.stx;
        $(this.params.toolSelection).text(stx.translateIf($(activator.node).text()));
        stx.changeVectorType(null);
        stx.layout.crosshair = true;
        stx.doDisplayCrosshairs();
        stx.findHighlights(false, true);
        stx.changeOccurred('layout');
        stx.draw();
        stx.updateChartAccessories();
        this.node.find('*[cq-section]').removeClass('ciq-active');
        this.emit();
    }

    toggleMagnet(activator) {
        let toggle = $(activator.node); // .find("cq-toggle");
        let stx = this.context.stx;
        if (stx.preferences.magnet) {
            toggle.removeClass('active');
            stx.preferences.magnet = false;
        } else {
            toggle.addClass('active');
            stx.preferences.magnet = true;
        }
        CIQ.clearCanvas(stx.chart.tempCanvas, stx);
    }

    clearDrawings() {
        this.context.stx.clearDrawings();
    }

    tool(activator, toolName) {
        let stx = this.context.stx;
        stx.clearMeasure();
        stx.changeVectorType(toolName);
        $(this.params.toolSelection).text(stx.translateIf($(activator.node).text()));

        this.node.find('*[cq-section]').removeClass('ciq-active');
        let drawingParameters = CIQ.Drawing.getDrawingParameters(stx, toolName);
        if (drawingParameters) {
            // fibtimezone has no values to display in the settings dialog
            if (toolName === 'fibtimezone') {
                delete drawingParameters.parameters;
            }

            let elements = this.defaultElements(drawingParameters);
            for (let i = 0; i < elements.length; i++) {
                $(this.node).find(elements[i]).addClass('ciq-active');
            }
        }
        this.emit();
    }

    setLine(activator, width, pattern) {
        let stx = this.context.stx;

        stx.currentVectorParameters.lineWidth = width;
        stx.currentVectorParameters.pattern = pattern;
        this.setFibs(width, pattern);
        if (this.currentLineSelectedClass) $(this.params.lineSelection).removeClass(this.currentLineSelectedClass);
        this.currentLineSelectedClass = `ciq-${pattern}-${parseInt(width, 10)}`;
        if (pattern === 'none') {
            this.currentLineSelectedClass = null;
        } else {
            $(this.params.lineSelection).addClass(this.currentLineSelectedClass);
        }
        this.emit();
    }

    setFibs(width, pattern) {
        let fib = this.context.stx.currentVectorParameters.fibonacci;
        if (fib) {
            for (let i = 0; i < fib.fibs.length; i++) {
                fib.fibs[i].parameters.lineWidth = width;
                fib.fibs[i].parameters.pattern = pattern;
            }
            fib.timezone.parameters.lineWidth = width;
            fib.timezone.parameters.pattern = pattern;
        }
    }

    setFontSize(activator, fontSize) {
        let stx = this.context.stx;

        stx.currentVectorParameters.annotation.font.size = fontSize;
        $(this.params.fontSizeSelection).text(fontSize);
        this.emit();
    }

    setFontFamily(activator, fontFamily) {
        let stx = this.context.stx;

        if (fontFamily === 'Default') {
            stx.currentVectorParameters.annotation.font.family = null;
        } else {
            stx.currentVectorParameters.annotation.font.family = fontFamily;
        }
        $(this.params.fontFamilySelection).text(fontFamily);
        this.emit();
    }

    toggleFontStyle(activator, fontStyle) {
        let stx = this.context.stx;

        if (fontStyle === 'italic') {
            if (stx.currentVectorParameters.annotation.font.style === 'italic') {
                stx.currentVectorParameters.annotation.font.style = null;
                $(activator.node).removeClass('ciq-active');
            } else {
                stx.currentVectorParameters.annotation.font.style = 'italic';
                $(activator.node).addClass('ciq-active');
            }
        } else if (fontStyle === 'bold') {
            if (stx.currentVectorParameters.annotation.font.weight === 'bold') {
                stx.currentVectorParameters.annotation.font.weight = null;
                $(activator.node).removeClass('ciq-active');
            } else {
                stx.currentVectorParameters.annotation.font.weight = 'bold';
                $(activator.node).addClass('ciq-active');
            }
        }
        this.emit();
    }

    toggleAxisLabel(activator) {
        let stx = this.context.stx;

        if (stx.currentVectorParameters.axisLabel === true) {
            stx.currentVectorParameters.axisLabel = false;
            $(activator.node).removeClass('ciq-active');
        } else {
            stx.currentVectorParameters.axisLabel = true;
            $(activator.node).addClass('ciq-active');
        }
        this.emit();
    }

    getFillColor(activator) {
        let node = activator.node;
        if (!node) node = $(this).find('cq-fill-color');
        let color = this.context.stx.currentVectorParameters.fillColor;
        $(node).css({
            'background-color': color,
        });
    }

    pickFillColor(activator) {
        let node = activator.node;
        let colorPickers = $('cq-color-picker');
        if (!colorPickers.length) {
            console.log('DrawingToolbar.prototype.getFillColor: no ColorPicker available');
            return;
        }
        let colorPicker = colorPickers[0];
        let self = this;
        colorPicker.callback = function (color) {
            self.context.stx.currentVectorParameters.fillColor = color;
            self.getFillColor({
                node,
            });
            self.emit();
        };
        colorPicker.display({
            node,
        });
    }

    getLineColor(activator) {
        let node = activator.node;
        if (!node) node = $(this).find('cq-line-color');
        let color = this.context.stx.currentVectorParameters.currentColor;
        if (color === 'transparent' || color === 'auto') color = '';
        $(node).css({
            'background-color': color,
        });
    }

    pickLineColor(activator) {
        let node = activator.node;
        let colorPickers = $('cq-color-picker');
        if (!colorPickers.length) {
            console.log('DrawingToolbar.prototype.getFillColor: no ColorPicker available');
            return;
        }
        let colorPicker = colorPickers[0];
        let self = this;
        colorPicker.callback = function (color) {
            self.context.stx.currentVectorParameters.currentColor = color;
            self.getLineColor({
                node,
            });
            self.emit();
        };
        let overrides = $(node).attr('cq-overrides');
        if (overrides) overrides = overrides.split(',');
        colorPicker.display({
            node,
            overrides,
        });
    }
}

/**
 * Drawing toolbar web component
 * @param {Object} [params] Parameters to drive the helper
 * @param {string} [params.toolSelection=node.find(".CIQCurrentDrawingTool")] Selector (or element) for displaying the selected tool
 * @param {string} [params.lineSelection=node.find(".CIQCurrentLineStyle")] Selector (or element) for displaying the selected line width and pattern
 * @param {string} [params.fontSizeSelection=node.find(".CIQCurrentFontSize")] Selector (or element) for displaying the selected font size
 * @param {string} [params.fontFamilySelection=node.find(".CIQCurrentFontFamily")] Selector (or element) for displaying the selected font family
 * @name CIQ.UI.DrawingToolbar
 * @constructor
 */
document.registerElement('cq-toolbar', DrawingToolbar);
export default DrawingToolbar;

