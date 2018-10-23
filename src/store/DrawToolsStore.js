import { action, reaction, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import SettingsDialogStore from './SettingsDialogStore';
import Menu from '../components/Menu.jsx';
import List from '../components/List.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';

// camelCase to spaces separated capitalized string.
const formatCamelCase = (s) => {
    const capitalized = s.charAt(0).toUpperCase() + s.slice(1);
    return capitalized.replace(/([a-z](?=[A-Z]))/g, '$1 ');
};

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
        this.list = new ListStore({
            getContext: () => this.context,
            onItemSelected: item => this.selectTool(item.id),
            getItems: () => [
                { id: 'annotation',  text: t.translatable('Annotation') },
                { id: 'average',     text: t.translatable('Average Line') },
                { id: 'callout',     text: t.translatable('Callout') },
                { id: 'channel',     text: t.translatable('Channel') },
                { id: 'continuous',  text: t.translatable('Continuous') },
                { id: 'crossline',   text: t.translatable('Crossline') },
                { id: 'freeform',    text: t.translatable('Doodle') },
                { id: 'ellipse',     text: t.translatable('Ellipse') },
                { id: 'retracement', text: t.translatable('Fib Retracement') },
                { id: 'fibarc',      text: t.translatable('Fib Arc') },
                { id: 'fibfan',      text: t.translatable('Fib Fan') },
                { id: 'fibtimezone', text: t.translatable('Fib Time Zone') },
                { id: 'gannfan',     text: t.translatable('Gann Fan') },
                { id: 'gartley',     text: t.translatable('Gartley') },
                { id: 'horizontal',  text: t.translatable('Horizontal') },
                { id: 'line',        text: t.translatable('Line') },
                { id: 'pitchfork',   text: t.translatable('Pitchfork') },
                { id: 'quadrant',    text: t.translatable('Quadrant Lines') },
                { id: 'ray',         text: t.translatable('Ray') },
                { id: 'rectangle',   text: t.translatable('Rectangle') },
                { id: 'regression',  text: t.translatable('Regression Line') },
                { id: 'segment',     text: t.translatable('Segment') },
                { id: 'arrow',       text: t.translatable('Shape - Arrow') },
                { id: 'check',       text: t.translatable('Shape - Check') },
                { id: 'xcross',      text: t.translatable('Shape - Cross') },
                { id: 'focusarrow',  text: t.translatable('Shape - Focus') },
                { id: 'heart',       text: t.translatable('Shape - Heart') },
                { id: 'star',        text: t.translatable('Shape - Star') },
                { id: 'speedarc',    text: t.translatable('Speed Resistance Arc') },
                { id: 'speedline',   text: t.translatable('Speed Resistance Line') },
                { id: 'timecycle',   text: t.translatable('Time Cycle') },
                { id: 'tirone',      text: t.translatable('Tirone Levels') },
                { id: 'vertical',    text: t.translatable('Vertical') },
            ],
        });

        this.DrawList = this.list.connect(List);

        when(() => this.context, this.onContextReady);
        reaction(() => this.menu.open, this.noTool);
    }

    get context() { return this.mainStore.chart.context; }

    get stx() { return this.context.stx; }

    activeDrawing = null;

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
        this.stx.clearDrawings();
    }

    @action.bound selectTool(id) {
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
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
    }
}
