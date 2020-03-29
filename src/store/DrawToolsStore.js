import { action, reaction, when, observable } from 'mobx';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import Menu from '../components/Menu.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';
import { formatCamelCase } from '../utils';
import { drawTools } from '../Constant';

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
        reaction(() => this.menu.open, () => {
            this.computeActiveDrawTools();
            this.noTool();
        });
    }

    get context() { return this.mainStore.chart.context; }

    get stx() { return this.context.stx; }

    activeDrawing = null;
    isContinuous = false;
    drawToolsItems = Object.keys(drawTools).map(key => drawTools[key]);
    @observable activeTools = [];

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

    @action.bound onDeleteHighlighted(callRightClick) {
        for (const drawing of this.stx.drawingObjects) {
            if (callRightClick) {
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
        if ((this.menu.open && this.context) || (!this.isContinuous && this._pervDrawingObjectCount !== count)) {
            this.stx.changeVectorType('');
        }
        this._pervDrawingObjectCount = count;
    };

    @action.bound clearAll() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
        this.stx.clearDrawings();
        this.computeActiveDrawTools();
    }

    @action.bound selectTool(id) {
        this.isContinuous = false;
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);
        const stx = this.context.stx;
        stx.clearMeasure(); // TODO remove this line
        stx.changeVectorType(id);
        if (id === 'continuous') {
            this.isContinuous = true;
        }
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

    @action.bound onDeleted(indx) {
        if (!indx && !this.activeDrawing) { return; }

        if (indx && this.stx.drawingObjects[indx]) {
            this.activeDrawing = this.stx.drawingObjects[indx];
        }

        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
        this.computeActiveDrawTools();
    }

    @action.bound onSetting(indx) {
        if (!this.stx.drawingObjects[indx]) { return; }

        this.showDrawToolDialog(this.stx.drawingObjects[indx]);
    }

    @action.bound computeActiveDrawTools() {
        const items = {};
        const ignoreBarType = ['vertical', 'horizontal'];

        this.activeTools = this.stx.drawingObjects.map((item, indx) => {
            item = ((drawTools[item.name]) ? { ...item, ...drawTools[item.name] } : item);
            item.index = indx;
            item.bars = (ignoreBarType.indexOf(item.name) === -1)
                ? (Math.abs(parseInt(item.p1[0] - item.p0[0], 10)) + 1)
                : null;

            if (items[item.name]) {
                items[item.name]++;
                item.text = `${item.name} - ${items[item.name]}`;
            } else {
                items[item.name] = 1;
            }
            return item;
        });
    }
}
