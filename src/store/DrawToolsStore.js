import { action, reaction, when } from 'mobx';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import Menu from '../components/Menu.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

// camelCase to spaces separated capitalized string.
const formatCamelCase = (s) => {
    const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
    return capitalized.replace(/([a-z](?=[A-Z]))/g, '$1 ');
};
const DrawToolsItems = [
    { id: 'annotation',  text: 'Annotation' },
    { id: 'average',     text: 'Average Line' },
    { id: 'callout',     text: 'Callout' },
    { id: 'channel',     text: 'Channel' },
    { id: 'continuous',  text: 'Continuous' },
    { id: 'crossline',   text: 'Crossline' },
    { id: 'freeform',    text: 'Doodle' },
    { id: 'ellipse',     text: 'Ellipse' },
    { id: 'retracement', text: 'Fib Retracement' },
    { id: 'fibarc',      text: 'Fib Arc' },
    { id: 'fibfan',      text: 'Fib Fan' },
    { id: 'fibtimezone', text: 'Fib Time Zone' },
    { id: 'gannfan',     text: 'Gann Fan' },
    { id: 'gartley',     text: 'Gartley' },
    { id: 'horizontal',  text: 'Horizontal' },
    { id: 'line',        text: 'Line' },
    { id: 'pitchfork',   text: 'Pitchfork' },
    { id: 'quadrant',    text: 'Quadrant Lines' },
    { id: 'ray',         text: 'Ray' },
    { id: 'rectangle',   text: 'Rectangle' },
    { id: 'regression',  text: 'Regression Line' },
    { id: 'segment',     text: 'Segment' },
    { id: 'arrow',       text: 'Shape - Arrow' },
    { id: 'check',       text: 'Shape - Check' },
    { id: 'xcross',      text: 'Shape - Cross' },
    { id: 'focusarrow',  text: 'Shape - Focus' },
    { id: 'heart',       text: 'Shape - Heart' },
    { id: 'star',        text: 'Shape - Star' },
    { id: 'speedarc',    text: 'Speed Resistance Arc' },
    { id: 'speedline',   text: 'Speed Resistance Line' },
    { id: 'timecycle',   text: 'Time Cycle' },
    { id: 'tirone',      text: 'Tirone Levels' },
    { id: 'vertical',    text: 'Vertical' },
];

export default class DrawToolsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'draw-tool' });
        this.DrawToolsMenu = this.menu.connect(Menu);
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: this.onDeleted,
            onChanged: this.onChanged,
        });
        this.DrawToolsSettingsDialog = this.settingsDialog.connect(SettingsDialog);

        when(() => this.context, this.onContextReady);
        reaction(() => this.menu.open, this.noTool);
    }

    get context() { return this.mainStore.chart.context; }

    get stx() { return this.context.stx; }

    activeDrawing = null;

    drawToolsItems = DrawToolsItems;

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        this.stx.addEventListener('drawing', this.noTool);
        this.stx.prepend('deleteHighlighted', this.onDeleteHighlighted);
    };

    closeOnEscape = (e) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.stx.changeVectorType('');
        }
    };

    @action.bound onDeleteHighlighted() {
        for (const drawing of this.stx.drawingObjects) {
            if (drawing.highlighted && !drawing.permanent) {
                this.showDrawToolDialog(drawing);
                return true; // Override default behaviour; prevent ChartIQ from deleting the drawing
            }
        }
        return false;
    }

    showDrawToolDialog(drawing) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        const parameters = CIQ.Drawing.getDrawingParameters(this.stx, drawing.name);

        const typeMap = {
            color: 'colorpicker',
            fillColor: 'colorpicker',
            pattern: 'pattern',
            axisLabel: 'switch',
            font: 'font',
            lineWidth: 'none',
        };
        this.settingsDialog.items = Object.keys(parameters)
            .filter(key => !( // Remove pattern option from Fibonacci tools
                (drawing.name.startsWith('fib') || drawing.name === 'retracement')
                && key === 'pattern'))
            .map(key => ({
                id: key,
                title: formatCamelCase(key),
                value: drawing[key],
                defaultValue: parameters[key],
                type: typeMap[key],
            }));
        this.activeDrawing = drawing;
        this.activeDrawing.highlighted = false;
        this.settingsDialog.title = formatCamelCase(drawing.name);
        this.settingsDialog.setOpen(true);
    }

    noTool = () => {
        const count = this.stx.drawingObjects.length;
        if ((this.menu.open && this.context) || this._pervDrawingObjectCount !== count) {
            this.stx.changeVectorType('');
        }
        this._pervDrawingObjectCount = count;
    };

    @action.bound clearAll() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
        this.stx.clearDrawings();
    }

    @action.bound selectTool(id) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);
        const stx = this.context.stx;
        stx.clearMeasure(); // TODO remove this line
        stx.changeVectorType(id);
        this.menu.setOpen(false);
        // let drawingParameters = CIQ.Drawing.getDrawingParameters(stx, id);
    }

    @action.bound onChanged(items) {
        for (const item of items) {
            this.activeDrawing[item.id] = item.value;
        }
        this.activeDrawing.highlighted = false;
        this.activeDrawing.adjust();
        this.mainStore.state.saveDrawings();
    }

    @action.bound onDeleted() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
    }
}
