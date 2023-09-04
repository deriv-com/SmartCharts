import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TIcon, TSettingsParameter } from 'src/types';
import MainStore from '.';
import { getDrawTools, getDrawingToolConfig } from '../Constant';
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

// TODO: Integrate draw tools with flutter charts

export default class DrawToolsStore {
    _pervDrawingObjectCount = 0;
    mainStore: MainStore;
    menuStore: MenuStore;
    settingsDialog: SettingsDialogStore;

    activeToolsGroup: TDrawToolsGroup[] = [];
    portalNodeIdChanged?: string;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            activeToolsGroup: observable,
            portalNodeIdChanged: observable,
            activeToolsNo: computed,
            destructor: action.bound,
            onRightClickDrawing: action.bound,
            drawingFinished: action.bound,
            clearAll: action.bound,
            selectTool: action.bound,
            onChanged: action.bound,
            onDeleted: action.bound,
            onSetting: action.bound,

            updatePortalNode: action.bound,
        });

        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'draw-tool' });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: this.onDeleted,
            onChanged: this.onChanged,
        });

        when(() => !!this.context, this.onContextReady);
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get stateStore() {
        return this.mainStore.state;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    activeDrawing: TDrawingObject | null = null;
    isContinuous = false;
    getDrawToolsItems = () => {
        const drawTools = getDrawTools();
        return Object.keys(drawTools).map(key => drawTools[key]);
    };
    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
    };
    closeOnEscape = (e: KeyboardEvent) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.drawingFinished();
        }
    };
    doubleClick = () => this.drawingFinished();
    get activeToolsNo() {
        return this.activeToolsGroup.reduce((a, b) => a + b.items.length, 0);
    }

    destructor() {
        document.removeEventListener('keydown', this.closeOnEscape);
        document.removeEventListener('dblclick', this.doubleClick);
        if (!this.context) return;
    }

    onRightClickDrawing(drawing: TDrawingObject) {
        this.showDrawToolDialog(drawing);
        return true;
    }
    showDrawToolDialog(drawing: TDrawingObject) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        // const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        let title = formatCamelCase(drawing.name);

        this.settingsDialog.items = [];
        const drawingItem = this.findComputedDrawing(drawing);
        if (drawingItem) {
            title = `${drawingItem.prefix ? `${drawingItem.prefix} - ` : ''} ${t.translate(drawingItem.text, {
                num: drawingItem.num || ' ',
            })}`;
        }
        console.log(drawing);
        this.activeDrawing = drawing;
        this.activeDrawing.highlighted = false;
        this.settingsDialog.title = title;
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        this.settingsDialog.formTitle = t.translate('Result');
        this.settingsDialog.formClassname = 'form--drawing-tool';
        this.settingsDialog.setOpen(true);
    }

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

    drawingFinished() {
        if (this.stateStore) {
            this.crosshairStore.setCrosshairState(this.stateStore.crosshairState);
        }
    }
    clearAll() {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
    }

    selectTool(id: string) {
        this.isContinuous = false;
        this.menuStore.setOpen(false);
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);
        if (id === 'continuous') {
            this.isContinuous = true;
        }
        this.mainStore.chartAdapter.flutterChart?.drawingTool.addDrawing(
            JSON.stringify({ ...getDrawingToolConfig, ...{ name: `dt_${id}`, key: id } }),
            0
        );

        this.activeToolsGroup.push({ name: `dt_${id}`, key: id, items: [] });
        this.mainStore.state.saveLayout();
        console.log(this.activeToolsGroup.reduce((a, b) => a + b.items.length, 0));
    }

    onChanged(items: TSettingsParameter[]) {
        // TODO: implement the drawing settings change
        for (const item of items) {
            (this.activeDrawing as TDrawingObject & Record<string, any>)[item.title] = item.value;
        }
        (this.activeDrawing as TDrawingObject).highlighted = false;
        (this.activeDrawing as TDrawingObject).adjust();
        this.mainStore.state.saveDrawings();
    }
    onDeleted(indx?: string) {
        // TODO: implement the drawing delete

        if (indx === undefined && !this.activeDrawing) {
            return;
        }

        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing?.name}`);
        this.activeDrawing = null;
    }
    onSetting(indx?: number) {
        if (!indx) return;

        // TODO: implement the drawing settings open
    }

    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
