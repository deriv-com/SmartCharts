import { action, reaction, when, observable, computed } from 'mobx';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/SettingsDialog.jsx' was reso... Remove this comment to see the full error message
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
import { formatCamelCase } from '../utils';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Constant' was resolved to '/Users/balak... Remove this comment to see the full error message
import { drawTools } from '../Constant';
export default class DrawToolsStore {
    DrawToolsMenu: any;
    DrawToolsSettingsDialog: any;
    _pervDrawingObjectCount: any;
    mainStore: any;
    menu: any;
    settingsDialog: any;
    constructor(mainStore: any) {
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
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    activeToolsGroup = [];
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    portalNodeIdChanged;
    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
        this.stx.addEventListener('drawing', this.noTool);
        this.stx.prepend('rightClickDrawing', this.onRightClickDrawing);
    };
    closeOnEscape = (e: any) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.stx.changeVectorType('');
            this.drawingFinished();
        }
    };
    doubleClick = () => this.drawingFinished();
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get activeToolsNo() {
        return this.activeToolsGroup.reduce((a, b) => a + (b as any).items.length, 0);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onRightClickDrawing(drawing: any) {
        this.showDrawToolDialog(drawing);
        return true;
    }
    showDrawToolDialog(drawing: any) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
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
            .filter(key => !(
        // Remove pattern option from Fibonacci tools
        ((drawing.name.startsWith('fib') || drawing.name === 'retracement') && key === 'pattern')))
            .map(key => ({
            id: key,
            title: formatCamelCase(key),
            value: drawing[key],
            defaultValue: parameters[key],
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            type: typeMap[key],
        }));
        const drawingItem = this.findComputedDrawing(drawing);
        if (drawingItem) {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title = `${drawingItem.prefix ? `${drawingItem.prefix} - ` : ''} ${t.translate(drawingItem.text, {
                num: drawingItem.num || ' ',
            })}`;
        }
        this.activeDrawing = drawing;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.activeDrawing.highlighted = false;
        this.settingsDialog.title = title;
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
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
    findComputedDrawing = (drawing: any) => {
        const group = this.activeToolsGroup.find(drawGroup => (drawGroup as any).key === drawing.name);
        if (group) {
            const drawingItem = (group as any).items.find((item: any) => item.v0 === drawing.v0 && item.v1 === drawing.v1 && item.d0 === drawing.d0 && item.d1 === drawing.d1);
            if (drawingItem) {
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                drawingItem.prefix = drawingItem.id === 'continuous' ? t.translate('Continuous') : '';
            }
            return drawingItem;
        }
        return null;
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    drawingFinished() {
        this.computeActiveDrawTools();
        if (this.stateStore) {
            this.crosshairStore.setCrosshairState(this.stateStore.crosshairState);
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    clearAll() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
        this.stx.clearDrawings();
        this.computeActiveDrawTools();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    selectTool(id: any) {
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
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onChanged(items: any) {
        for (const item of items) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.activeDrawing[item.id] = item.value;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.activeDrawing.highlighted = false;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.activeDrawing.adjust();
        this.mainStore.state.saveDrawings();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onDeleted(indx: any) {
        if (indx === undefined && !this.activeDrawing) {
            return;
        }
        if (indx !== undefined && indx >= 0 && this.stx.drawingObjects[indx]) {
            this.activeDrawing = this.stx.drawingObjects[indx];
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
        this.computeActiveDrawTools();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onSetting(indx: any) {
        if (!this.stx.drawingObjects[indx]) {
            return;
        }
        this.showDrawToolDialog(this.stx.drawingObjects[indx]);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    computeActiveDrawTools() {
        if (!this.context)
            return;
        const items = {};
        const ignoreBarType = ['vertical', 'horizontal'];
        const groups = {};
        this.stx.drawingObjects.forEach((item: any, indx: any) => {
            item = drawTools[item.name] ? { ...item, ...drawTools[item.name] } : item;
            item.index = indx;
            item.bars =
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                ignoreBarType.indexOf(item.name) === -1 ? Math.abs(parseInt(item.p1[0] - item.p0[0], 10)) + 1 : null;
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (items[item.name]) {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                items[item.name]++;
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                item.num = items[item.name];
            }
            else {
                item.num = ' ';
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                items[item.name] = 1;
            }
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (groups[item.name]) {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                item.text = groups[item.name].name;
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                groups[item.name].items.push(item);
            }
            else {
                const group_name = drawTools[item.name] ? drawTools[item.name].text : item.name;
                item.text = group_name;
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                groups[item.name] = {
                    key: item.name,
                    name: group_name,
                    items: [item],
                };
            }
        });
        // get the values of group and sort group by the number of their children
        // this way the single item stay at top
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'unknown[]' is not assignable to type 'never[... Remove this comment to see the full error message
        this.activeToolsGroup = Object.values(groups).sort((a, b) => (a as any).items.length - (b as any).items.length);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updatePortalNode(portalNodeId: any) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
