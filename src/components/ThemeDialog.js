import $ from 'jquery';
import CIQ from 'chartiq';
import DialogContentTag from './ui/DialogContentTag';

/**
 * Theme Dialog web component `<cq-theme-dialog>`.
 *
 * Manages themes in for chart layout.
 * @namespace WebComponents.cq-theme-dialog
 * @example
     <cq-dialog>
        <cq-theme-dialog>
            <h4 class="title">Create Custom Theme</h4>
            <cq-close></cq-close>
            <cq-scroll cq-no-maximize>
                <cq-section>
                ...
                </cq-scroll>
            </cq-theme-dialog>
        </cq-dialog>
 */
class ThemeDialog extends DialogContentTag {
    /**
     * Applies changes to all charts on the screen
     * @memberof WebComponents.cq-theme-dialog
     * @private
     */
    applyChanges() {
        let stx = this.context.stx;
        this.helper.update(stx);
        stx.changeOccurred('theme');
    }

    /**
     * @alias setValue
     * @memberof WebComponents.cq-theme-dialog
     */
    setValue(obj, field, value) {
        obj[field] = value;
        this.applyChanges();
    }

    /**
     * @alias close
     * @memberof WebComponents.cq-theme-dialog
     */
    close() {
        this.helper.settings = this.revert;
        this.applyChanges();
        // CIQ.UI.containerExecute(this, "close");
        super.close();
    }

    /**
     * @alias save
     * @memberof WebComponents.cq-theme-dialog
     */
    save() {
        let themeName = this.node.find('cq-action input').val();
        let theme = {
            settings: CIQ.clone(this.helper.settings),
            name: themeName,
            builtIn: null,
        };
        CIQ.UI.contextsForEach(function () {
            this.stx.updateListeners('theme');
        });
        let self = this;
        $('cq-themes').each(function () {
            theme.builtIn = this.currentLoadedBuiltIn;
            this.addCustom(theme, self.initiatingMenu);
        });
        super.close();
    }

    /**
     * @alias configure
     * @memberof WebComponents.cq-theme-dialog
     */
    open(params) {
        super.open(arguments);
        let themeName = params.themeName;

        this.initiatingMenu = params.initiatingMenu;
        this.context = params.context;
        this.helper = new CIQ.ThemeHelper({
            stx: this.context.stx,
        });
        this.revert = CIQ.clone(this.helper.settings);

        let self = this;

        function configurePiece(name, obj, field, type) {
            let cu = self.node.find(`cq-theme-piece[cq-piece="${name}"]`);

            cu[0].piece = {
                obj,
                field,
            };
            if (type === 'color') {
                cu.find('cq-swatch')[0].setColor(obj[field], false);
            }
        }
        let settings = this.helper.settings;
        configurePiece('cu', settings.chartTypes['Candle/Bar'].up, 'color', 'color');
        configurePiece('cd', settings.chartTypes['Candle/Bar'].down, 'color', 'color');
        configurePiece('wu', settings.chartTypes['Candle/Bar'].up, 'wick', 'color');
        configurePiece('wd', settings.chartTypes['Candle/Bar'].down, 'wick', 'color');
        configurePiece('bu', settings.chartTypes['Candle/Bar'].up, 'border', 'color');
        configurePiece('bd', settings.chartTypes['Candle/Bar'].down, 'border', 'color');
        configurePiece('lc', settings.chartTypes.Line, 'color', 'color');
        configurePiece('mc', settings.chartTypes.Mountain, 'color', 'color');
        configurePiece('bg', settings.chart.Background, 'color', 'color');
        configurePiece('gl', settings.chart['Grid Lines'], 'color', 'color');
        configurePiece('dd', settings.chart['Grid Dividers'], 'color', 'color');
        configurePiece('at', settings.chart['Axis Text'], 'color', 'color');

        if (!themeName) themeName = 'My Theme';
        this.node.find('cq-action input').val(themeName);
    }
}

document.registerElement('cq-theme-dialog', ThemeDialog);
export default ThemeDialog;
