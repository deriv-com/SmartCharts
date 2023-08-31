import { action, computed, observable, when, makeObservable, reaction, autorun } from 'mobx';
import Context from 'src/components/ui/Context';
import { TActiveItem, TIcon, TSettingsParameter } from 'src/types';
import MainStore from '.';
import { defaultdrawToolsConfigs, getDrawTools, getDrawingToolConfig } from '../Constant';
import { clone, formatCamelCase, isLiteralObject } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import { getUniqueId, hexToInt } from 'src/components/ui/utils';
import set from 'lodash.set';

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

type TDrawObject = {
    config: {
        pattern: string;
        lineStyle: { thickness: number; hasArea: boolean };
    };
    id: string;
    name: string;
};

type TDrawingObject = {
    abort?: () => void;
    adjust?: () => void;
    axisLabel: boolean;
    bars?: number | null;
    color: string;
    d0?: string;
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
    index: number;
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
    tzo0?: number;
    tzo1?: number;
    tzo2?: number;
    v0?: number;
    v0B?: number;
    v1?: number;
    v1B?: number;
    v2?: number;
};
type TDrawToolsGroup = {
    key: string;
    text: string;
    name: string;
    bar: number;
    // index: number;
    id: string;
    items: TDrawingObject[];
};

// TODO: Integrate draw tools with flutter charts

export default class DrawToolsStore {
    _pervDrawingObjectCount = 0;
    mainStore: MainStore;
    menuStore: MenuStore;
    settingsDialog: SettingsDialogStore;
    activeToolsGroup: TActiveItem[] = [];
    portalNodeIdChanged?: string;
    // drawingToolsRepo: number;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            activeToolsGroup: observable,
            portalNodeIdChanged: observable,
            // drawingToolsRepo: observable,
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
            onChanged: (items: TSettingsParameter[]) => this.onChanged(items),
        });

        // this.drawingToolsRepo = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTool().drawingToolsRepo._addOns.length;

        when(() => !!this.context, this.onContextReady);
        // reaction(
        //     () =>
        //         this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTool().drawingToolsRepo._addOns.length,
        //     () => {
        //         console.log('yay');
        //     },
        //     { delay: 1000 }
        // );
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
    activeDrawing: TDrawObject | null = null;

    tester = () => {
        console.log('rann yo');
    };

    isContinuous = false;

    getDrawToolsItems = () => {
        const drawTools = getDrawTools();
        return Object.keys(drawTools).map(key => drawTools[key]);
    };

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
        console.log('yay2222');
    };
    closeOnEscape = (e: KeyboardEvent) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.drawingFinished();
        }
    };
    doubleClick = () => this.drawingFinished();
    get activeToolsNo() {
        return this.activeToolsGroup.length;
        // .reduce((a, b) => a + b.items.length, 0);
    }

    destructor() {
        document.removeEventListener('keydown', this.closeOnEscape);
        document.removeEventListener('dblclick', this.doubleClick);
        if (!this.context) return;
    }

    onRightClickDrawing(drawing: TDrawToolsGroup) {
        // this.showDrawToolDialog(drawing);
        return true;
    }
    showDrawToolDialog(drawing: TActiveItem) {
        console.log(drawing);
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        // const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        let title = formatCamelCase(drawing.name);

        const parameters = defaultdrawToolsConfigs[drawing.id]().parameters;
        parameters.map(p => (p.value = clone(p.defaultValue)));
        this.settingsDialog.items = parameters;

        console.log(drawing);
        // const drawingItem = this.findComputedDrawing(drawing);
        // console.log(drawingItem);
        title = `${drawing.name}`;

        // this.activeDrawing.highlighted = false;
        // this.activeDrawing = drawing;
        this.settingsDialog.title = title;
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        this.settingsDialog.formTitle = t.translate('Result');
        this.settingsDialog.id = drawing.name;
        this.settingsDialog.drawing_tool_id = drawing.id;
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
        this.activeToolsGroup = [];
        window.flutterChart?.drawingTool.clearDrawingTool();
        this.mainStore.state.saveDrawings();
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
    }

    getDrawingToolProps = (drawTool: string) => {
        return getDrawTools()[drawTool];
    };

    transform = (value: any) => {
        if (typeof value == 'string' && (value.startsWith('#') || value.toLowerCase().startsWith('0x'))) {
            return hexToInt(value);
        } else if (isLiteralObject(value)) {
            const map = value as Record<string, any>;
            Object.keys(value).forEach(key => {
                map[key] = this.transform(map[key]);
            });
        } else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                value[i] = this.transform(value[i]);
            }
        }

        return value;
    };

    selectTool(id: string) {
        this.menuStore.setOpen(false);
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);

        const props = getDrawTools()[id];
        const { parameters, config } = defaultdrawToolsConfigs[id]();
        console.log(parameters);
        console.log(config);

        if (props && parameters) {
            parameters.map(p => (p.value = clone(p.defaultValue)));

            const itemm = {
                id: getUniqueId(),
                config,
                parameters,
                bars: '0',
                ...props,
            };

            const params = itemm.parameters.reduce((acc, item) => {
                const { path, paths, value } = item;

                if (isLiteralObject(value) && paths) {
                    const map = value as Record<string, any>;
                    const keys = Object.keys(map);
                    keys.forEach(key => {
                        set(acc, paths[key], map[key]);
                    });
                } else if (path) {
                    set(acc, path, value);
                }

                return acc;
            }, itemm.config || {});

            const configg = {
                id: itemm.id,
                name: `dt_${id}`,
                title: itemm.id.toUpperCase(),
                ...this.transform(params),
            };

            const drawToolConfig = getDrawTools();

            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(configg), -1);
            console.log({ ...configg, ...drawToolConfig[id] });

            this.activeToolsGroup.push({
                ...configg,
                ...drawToolConfig[id],
                ...{ index: this.activeToolsGroup.length },
            });

            this.mainStore.state.saveDrawings();
            // this.mainStore.state.saveLayout();
        }
    }

    onChanged(parameters: TSettingsParameter[]) {
        const props = getDrawTools()[this.settingsDialog.drawing_tool_id];
        const { config } = defaultdrawToolsConfigs[this.settingsDialog.drawing_tool_id]();

        if (props && parameters) {
            const itemm = {
                ...props,
                config,
                parameters,
                bars: '0',
            };

            const params = parameters.reduce((acc, item) => {
                const { path, paths, value } = item;

                if (isLiteralObject(value) && paths) {
                    const map = value as Record<string, any>;
                    const keys = Object.keys(map);
                    keys.forEach(key => {
                        set(acc, paths[key], map[key]);
                    });
                } else if (path) {
                    set(acc, path, value);
                }

                return acc;
            }, itemm.config || {});

            const configg = {
                id: itemm.id,
                name: `dt_${itemm.id}`,
                title: itemm.id.toUpperCase(),
                ...this.transform(params),
            };
            const drawToolConfig = getDrawTools();

            const index = this.activeToolsGroup.findIndex(item => item.name === this.settingsDialog.id);

            // const drawingTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTool();

            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(configg), index);
            this.activeToolsGroup[index] = {
                ...configg,
                ...drawToolConfig[itemm.id],
                ...{ index },
            };

            // this.mainStore.state.saveLayout();
            this.mainStore.state.saveDrawings();
        }
    }

    onDeleted(indx?: string) {
        if (indx === undefined && !this.activeDrawing) {
            return;
        }
        const index = this.activeToolsGroup.findIndex(item => item.name === indx);
        this.activeToolsGroup.splice(index, 1);
        this.mainStore.chartAdapter.flutterChart?.drawingTool.removeDrawingTool(index);

        // TODO: implement the drawing delete

        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing?.name}`);
        this.activeDrawing = null;
    }

    onSetting(indx?: number) {
        if (indx !== undefined) {
            console.log(this.activeToolsGroup);
            console.log(indx);
            this.showDrawToolDialog(this.activeToolsGroup[indx]);
        }
    }

    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
