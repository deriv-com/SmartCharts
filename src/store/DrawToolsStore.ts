import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TIcon, TSettingsParameter } from 'src/types';
import set from 'lodash.set';
import { capitalize, hexToInt } from 'src/components/ui/utils';
import MainStore from '.';
import { defaultdrawToolsConfigs, getDrawTools } from '../Constant';
import { clone, formatCamelCase, isLiteralObject } from '../utils';
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

export type TActiveDrawingItem = {
    title: string;
    text: string;
    id: string;
    config?: Record<string, any>;
    parameters: TSettingsParameter[];
    bars?: number;
    key?: string;
    icon?: TIcon | undefined;
    name: string;
    num: number;
    index: number;
};

export type TActiveDrawingToolItem = {
    id: string;
    items: TActiveDrawingItem[];
};

// TODO: Integrate draw tools with flutter charts

export default class DrawToolsStore {
    _pervDrawingObjectCount = 0;
    mainStore: MainStore;
    menuStore: MenuStore;
    settingsDialog: SettingsDialogStore;
    activeToolsGroup: TActiveDrawingToolItem[] = [];
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
            onChanged: (items: TSettingsParameter[]) => this.onChanged(items),
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

    activeDrawing: TDrawObject | null = null;

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
        // if (!this.context) return;
    }

    onRightClickDrawing() {
        // this.showDrawToolDialog(drawing);
        return true;
    }

    showDrawToolDialog(drawing: TActiveDrawingItem) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        // const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        if (drawing) {
            console.log(drawing);
            let title = formatCamelCase(drawing.name || '');

            const parameters = defaultdrawToolsConfigs[drawing.id]().parameters;
            parameters.map(p => (p.value = clone(p.defaultValue)));

            this.settingsDialog.items = parameters;

            title = `${drawing.title} ${drawing.num || ''}`;

            // this.activeDrawing.highlighted = false;
            // this.activeDrawing = drawing;
            this.settingsDialog.title = title;
            this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
            this.settingsDialog.formTitle = t.translate('Result');
            this.settingsDialog.id = drawing.index;
            this.settingsDialog.drawing_tool_id = drawing.id;
            this.settingsDialog.formClassname = 'form--drawing-tool';
            this.settingsDialog.setOpen(true);
        }
    }

    // findComputedDrawing = (drawing: TDrawingObject) => {
    //     const group = this.activeToolsGroup.find(drawGroup => drawGroup.key === drawing.name);
    //     if (group) {
    //         const drawingItem = group.items.find(
    //             (item: TDrawingObject) =>
    //                 item.v0 === drawing.v0 && item.v1 === drawing.v1 && item.d0 === drawing.d0 && item.d1 === drawing.d1
    //         );
    //         if (drawingItem) {
    //             drawingItem.prefix = drawingItem.id === 'continuous' ? t.translate('Continuous') : '';
    //         }
    //         return drawingItem;
    //     }
    //     return null;
    // };

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
        if (typeof value === 'string' && (value.startsWith('#') || value.toLowerCase().startsWith('0x'))) {
            return hexToInt(value);
        }
        if (isLiteralObject(value)) {
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
        const finalItem = this.processDrawTool(id);
        if (finalItem) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(finalItem), -1);
            this.mainStore.state.saveDrawings();
            this.mainStore.crosshair.selectedDrawingHoverClick();
        }
    }

    updateActiveToolsGroup(finalItem: any) {
        const activeTools = this.activeToolsGroup;
        const groupIndex = activeTools.findIndex(item => item.id === finalItem.id);

        if (groupIndex === -1) {
            this.activeToolsGroup.push({
                id: finalItem.id,
                items: [finalItem],
            });
        } else {
            const item = this.activeToolsGroup[groupIndex];
            item.items.push({ ...finalItem, ...{ num: item.items.length } });
        }
    }

    // The common function (now only responsible for creating finalItem)
    processDrawTool(id: string) {
        const props = getDrawTools()[id];
        const { parameters, config } = defaultdrawToolsConfigs[id]();
        let finalItem = null;

        if (props && parameters) {
            parameters.map(p => (p.value = clone(p.defaultValue)));

            const item = {
                config,
                parameters,
                bars: '0',
                ...props,
            };

            const params = item.parameters.reduce((acc, item) => {
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
            }, item.config || {});

            const configg = {
                id: item.id,
                name: `dt_${id}`,
                title: capitalize(item.id),
                ...this.transform(params),
            };

            const drawToolConfig = getDrawTools();

            finalItem = {
                ...configg,
                ...drawToolConfig[id],
                ...{ index: this.activeToolsNo },
            };
        }

        return finalItem;
    }

    onCreation(id: string) {
        this.updateActiveToolsGroup(this.processDrawTool(id));
    }

    onChanged(parameters: TSettingsParameter[]) {
        // console.log(this.settingsDialog.drawing_tool_id);
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

            // Find the group with the given id
            const group = this.activeToolsGroup.find(g => g.id === this.settingsDialog.drawing_tool_id);

            const drawToolConfig = getDrawTools();
            // If found, remove the item with the given index
            if (group) {
                const index = group.items.findIndex(ite => ite.index == this.settingsDialog.id);

                group.items[index] = {
                    ...configg,
                    ...drawToolConfig[itemm.id],
                    ...{ index: this.settingsDialog.id, num: group.items[index].num },
                };
            }
            // return groups;

            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(
                JSON.stringify(configg),
                this.settingsDialog.id
            );
            this.mainStore.state.saveDrawings();
        }
    }

    deleteItemWithIndex(groups: TActiveDrawingToolItem[], searchIndex: number, searchId: string) {
        // Find the group with the given id
        const group = groups.find(g => g.id === searchId);

        // If found, remove the item with the given index
        if (group) {
            group.items = group.items.filter(item => item.index !== searchIndex);
        }
        return groups;
    }

    onDeleted(indx?: number) {
        let targetItem: TActiveDrawingItem;

        if (indx !== undefined) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.removeDrawingTool(indx);

            for (const group of this.activeToolsGroup) {
                const foundItem = group.items.find(item => item.index === indx);
                if (foundItem) {
                    targetItem = group;
                }
            }

            if (targetItem) {
                this.deleteItemWithIndex(this.activeToolsGroup, indx, targetItem.id);

                this.mainStore.crosshair.onDeletedDrawing();

                this.activeToolsGroup.forEach(group => {
                    group.items.forEach(item => {
                        if (item.index > indx) {
                            item.index--;
                            if (targetItem?.id === group.id) {
                                item.num--;
                            }
                        }
                    });
                });
            }
            // Log the event
            if (this.activeDrawing) {
                logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
            }
        }
    }

    onSetting(indx?: number) {
        if (indx !== undefined) {
            let targetItem;
            for (const group of this.activeToolsGroup) {
                const foundItem = group.items.find(item => item.index === indx);
                if (foundItem) {
                    targetItem = foundItem;
                }
            }
            if (targetItem) {
                this.showDrawToolDialog(targetItem);
            }
        }
    }

    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }

    onDrawingHover(_dx: number, _dy: number, _epoch: number, _quote: string) {
        return this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingHover(_dx, _dy, _epoch, _quote);
    }
}
