import { action, computed, observable, reaction, when } from 'mobx';
import Context from 'src/components/ui/Context';
import { TCIQAddEventListener, TCIQAppend, TIcon, TObject, TSettingsItem } from 'src/types';
import MainStore from '.';
import { drawTools } from '../Constant';
import { formatCamelCase } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';

type TDrawingParameters = {
    extendLeft: boolean;
    fibs: { level: number; color: string; parameters: unknown; display?: boolean }[];
    printLevels: boolean;
    printValues: boolean;
    timezone: { color: string; parameters: { pattern: string; opacity: number; lineWidth: number } };
    trend: { color: string; parameters: unknown };
    pattern: string;
    penDown: boolean;
};
type TRepositioner = {
    action: string;
    p0: number[];
    p1: number[];
    tick: number;
    value: number;
};
type TDrawingObject = {
    abort: () => void;
    adjust: () => void;
    axisLabel: boolean;
    bars?: number | null;
    color: string;
    d0: string;
    d0B?: string;
    d1?: string;
    d1B?: string;
    d2?: string;
    dragToDraw?: boolean;
    field?: string | null;
    fillColor?: string;
    highlighted: boolean;
    icon?: TIcon;
    id?: string;
    index?: number;
    lineWidth: number;
    name: string;
    num?: string | number;
    p0: number[];
    p1: number[];
    p2?: number[];
    panelName: string;
    parameters?: TDrawingParameters;
    pattern: string;
    penDown?: boolean;
    pixelX?: number[];
    pixelY?: number[];
    prefix?: string;
    rays?: number[][][];
    repositioner: TRepositioner | null;
    stx: typeof CIQ.ChartEngine;
    text?: string;
    tzo0: number;
    tzo1?: number;
    tzo2?: number;
    v0: number;
    v0B?: number;
    v1?: number;
    v1B?: number;
    v2?: number;
};
type TDrawToolsGroup = {
    key: string;
    name: string;
    items: TDrawingObject[];
};

export default class DrawToolsStore {
    _injectionId: TCIQAppend<() => void> | null = null;
    _listenerId: TCIQAddEventListener<() => void> | null = null;
    _pervDrawingObjectCount = 0;
    mainStore: MainStore;
    menuStore: MenuStore;
    settingsDialog: SettingsDialogStore;
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'draw-tool' });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: this.onDeleted,
            onChanged: this.onChanged,
        });

        when(() => !!this.context, this.onContextReady);

        reaction(
            () => this.menuStore.open,
            () => {
                this.computeActiveDrawTools();
                this.noTool();
            }
        );
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get stx(): Context['stx'] {
        return this.context?.stx;
    }
    get stateStore() {
        return this.mainStore.state;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    activeDrawing: TDrawingObject | null = null;
    isContinuous = false;
    drawToolsItems = Object.keys(drawTools).map(key => drawTools[key]);
    @observable
    activeToolsGroup: TDrawToolsGroup[] = [];
    @observable
    portalNodeIdChanged?: string;
    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
        this._listenerId = this.stx.addEventListener('drawing', this.noTool);
        this._injectionId = this.stx.prepend('rightClickDrawing', this.onRightClickDrawing);
    };
    closeOnEscape = (e: KeyboardEvent) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.stx?.changeVectorType('');
            this.drawingFinished();
        }
    };
    doubleClick = () => this.drawingFinished();
    @computed
    get activeToolsNo() {
        return this.activeToolsGroup.reduce((a, b) => a + b.items.length, 0);
    }

    @action.bound destructor() {
        document.removeEventListener('keydown', this.closeOnEscape);
        document.removeEventListener('dblclick', this.doubleClick);
        if (!this.context) return;
        if (this._listenerId) {
            this.stx.removeEventListener(this._listenerId);
        }
        if (this._injectionId) {
            this.stx.removeInjection(this._injectionId);
        }
    }

    @action.bound
    onRightClickDrawing(drawing: TDrawingObject) {
        this.showDrawToolDialog(drawing);
        return true;
    }
    showDrawToolDialog(drawing: TDrawingObject) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        // @ts-ignore
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
                value: drawing[key as keyof TDrawingObject],
                defaultValue: parameters[key],
                type: typeMap[key as keyof typeof typeMap],
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
        if ((this.menuStore.open && this.context) || (!this.isContinuous && this._pervDrawingObjectCount !== count)) {
            this.stx.changeVectorType('');
            this.drawingFinished();
        }
        this._pervDrawingObjectCount = count;
    };
    findComputedDrawing = (drawing: TDrawingObject) => {
        const group = this.activeToolsGroup.find(drawGroup => drawGroup.key === drawing.name);
        if (group) {
            const drawingItem = group.items.find(
                (item: TDrawingObject) =>
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
    @action.bound
    clearAll() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
        this.stx.clearDrawings();
        this.computeActiveDrawTools();
    }
    @action.bound
    selectTool(id: string) {
        this.isContinuous = false;
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);
        const stx = this.context?.stx;
        stx.clearMeasure(); // TODO remove this line
        stx.changeVectorType(id);
        if (id === 'continuous') {
            this.isContinuous = true;
        }
        this.menuStore.setOpen(false);
    }
    @action.bound
    onChanged(items: TSettingsItem[]) {
        for (const item of items) {
            (this.activeDrawing as TDrawingObject & Record<string, string | boolean | number | TObject>)[item.id] =
                item.value;
        }
        (this.activeDrawing as TDrawingObject).highlighted = false;
        (this.activeDrawing as TDrawingObject).adjust();
        this.mainStore.state.saveDrawings();
    }
    @action.bound
    onDeleted(indx: number | undefined) {
        if (indx === undefined && !this.activeDrawing) {
            return;
        }
        if (indx !== undefined && indx >= 0 && this.stx.drawingObjects[indx]) {
            this.activeDrawing = this.stx.drawingObjects[indx];
        }
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing?.name}`);
        this.stx.removeDrawing(this.activeDrawing);
        this.activeDrawing = null;
        this.computeActiveDrawTools();
    }
    @action.bound
    onSetting(indx?: number) {
        if (!this.stx.drawingObjects[indx as number]) {
            return;
        }
        this.showDrawToolDialog(this.stx.drawingObjects[indx as number]);
    }

    @action.bound
    computeActiveDrawTools() {
        if (!this.context) return;
        const items: Record<string, number> = {};
        const ignoreBarType = ['vertical', 'horizontal'];
        const groups: Record<string, TDrawToolsGroup> = {};
        this.stx?.drawingObjects.forEach((item: TDrawingObject, indx: number) => {
            if (item === undefined) {
                return;
            }
            item = drawTools[item.name] ? { ...item, ...drawTools[item.name] } : item;
            item.index = indx;
            item.bars =
                ignoreBarType.indexOf(item.name) === -1 ? Math.abs(Math.floor(item.p1[0] - item.p0[0])) + 1 : null;
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
    @action.bound
    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
