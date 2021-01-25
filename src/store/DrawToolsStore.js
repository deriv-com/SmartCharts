import { action, reaction, when, observable, computed } from 'mobx';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import Menu from '../components/Menu.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
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
        reaction(
            () => this.menu.open,
            () => {
                this.computeActiveDrawTools();
                this.noTool();
            }
        );
    }

    get context() {
        return this.mainStore.chart.context;
    }

    get stx() {
        return this.context.stx;
    }
    get stateStore() {
        return this.mainStore.state;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }

    activeDrawing = null;
    isContinuous = false;
    drawToolsItems = Object.keys(drawTools).map(key => drawTools[key]);
    @observable activeToolsGroup = [];
    @observable portalNodeIdChanged;

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
        this.stx.addEventListener('drawing', this.noTool);
        this.stx.prepend('rightClickDrawing', this.onRightClickDrawing);
    };

    closeOnEscape = e => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.stx.changeVectorType('');
            this.drawingFinished();
        }
    };

    doubleClick = () => this.drawingFinished();

    @computed get activeToolsNo() {
        return this.activeToolsGroup.reduce((a, b) => a + b.items.length, 0);
    }

    @action.bound onRightClickDrawing(drawing) {
        this.showDrawToolDialog(drawing);
        return true;
    }

    showDrawToolDialog(drawing) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        const parameters = CIQ.Drawing.getDrawingParameters(this.stx, drawing.name);
        let title = formatCamelCase(drawing.name);
        const typeMap = {
            color: 'colorpicker',
            fillColor: 'colorpicker',
            pattern: 'pattern',
            axisLabel: 'switch',
            font: 'font',
            lineWidth: 'none',
        };
        this.settingsDialog.items = Object.keys(parameters)
            .filter(
                key =>
                    !(
                        // Remove pattern option from Fibonacci tools
                        ((drawing.name.startsWith('fib') || drawing.name === 'retracement') && key === 'pattern')
                    )
            )
            .map(key => ({
                id: key,
                title: formatCamelCase(key),
                value: drawing[key],
                defaultValue: parameters[key],
                type: typeMap[key],
            }));

        const drawingItem = this.findComputedDrawing(drawing);
        if (drawingItem) {
            title = `${drawingItem.prefix ? `${drawingItem.prefix} - ` : ''} ${t.translate(drawingItem.text, {
                num: drawingItem.num || ' ',
            })}`;
        }

        this.activeDrawing = drawing;
        this.activeDrawing.highlighted = false;
        this.settingsDialog.title = title;
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        this.settingsDialog.formTitle = t.translate('Result');
        this.settingsDialog.formClassname = 'form--drawing-tool';
        this.settingsDialog.setOpen(true);
    }

    noTool = () => {
        const count = this.stx.drawingObjects.length;
        if ((this.menu.open && this.context) || (!this.isContinuous && this._pervDrawingObjectCount !== count)) {
            this.stx.changeVectorType('');
            this.drawingFinished();
        }
        this._pervDrawingObjectCount = count;
    };

    findComputedDrawing = drawing => {
        const group = this.activeToolsGroup.find(drawGroup => drawGroup.key === drawing.name);
        if (group) {
            const drawingItem = group.items.find(
                item =>
                    item.v0 === drawing.v0 && item.v1 === drawing.v1 && item.d0 === drawing.d0 && item.d1 === drawing.d1
            );
            if (drawingItem) {
                drawingItem.prefix = drawingItem.id === 'continuous' ? t.translate('Continuous') : '';
            }
            return drawingItem;
        }
        return null;
    };

    @action.bound drawingFinished() {
        this.computeActiveDrawTools();
        if (this.stateStore) {
            this.crosshairStore.setCrosshairState(this.stateStore.crosshairState);
        }
    }

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
        if (indx === undefined && !this.activeDrawing) {
            return;
        }

        if (indx !== undefined && indx >= 0 && this.stx.drawingObjects[indx]) {
            this.activeDrawing = this.stx.drawingObjects[indx];
        }

        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
        this.computeActiveDrawTools();
    }

    @action.bound onSetting(indx) {
        if (!this.stx.drawingObjects[indx]) {
            return;
        }

        this.showDrawToolDialog(this.stx.drawingObjects[indx]);
    }

    @action.bound computeActiveDrawTools() {
        if (!this.context) return;

        const items = {};
        const ignoreBarType = ['vertical', 'horizontal'];
        const groups = {};
        this.stx.drawingObjects.forEach((item, indx) => {
            item = drawTools[item.name] ? { ...item, ...drawTools[item.name] } : item;
            item.index = indx;
            item.bars =
                ignoreBarType.indexOf(item.name) === -1 ? Math.abs(parseInt(item.p1[0] - item.p0[0], 10)) + 1 : null;

            if (items[item.name]) {
                items[item.name]++;
                item.num = items[item.name];
            } else {
                item.num = ' ';
                items[item.name] = 1;
            }

            if (groups[item.name]) {
                item.text = groups[item.name].name;
                groups[item.name].items.push(item);
            } else {
                const group_name = drawTools[item.name] ? drawTools[item.name].text : item.name;
                item.text = group_name;
                groups[item.name] = {
                    key: item.name,
                    name: group_name,
                    items: [item],
                };
            }
        });

        // get the values of group and sort group by the number of their children
        // this way the single item stay at top
        this.activeToolsGroup = Object.values(groups).sort((a, b) => a.items.length - b.items.length);
    }

    @action.bound updatePortalNode(portalNodeId) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
