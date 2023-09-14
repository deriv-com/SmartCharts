import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TIcon, TSettingsParameter } from 'src/types';
import set from 'lodash.set';
import { capitalize, hexToInt } from 'src/components/ui/utils';
import MainStore from '.';
import { defaultdrawToolsConfigs, getDefaultDrawingConfig, getDrawTools } from '../Constant';
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

type TDrawConfig = {
    lineStyle: { color: { value: number } };
    fillStyle?: { color: { value: number } };
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
    lineStyle?: {};
    fillStyle?: {};
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
    seletedDrawToolConfig: TActiveDrawingItem | null = null;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            activeToolsGroup: observable,
            portalNodeIdChanged: observable,
            activeToolsNo: computed,
            destructor: action.bound,
            onRightClickDrawing: action.bound,
            drawingFinished: action.bound,
            clearAll: action.bound,
            updateActiveToolsGroup: action.bound,
            showDrawToolDialog: action.bound,
            selectTool: action.bound,
            onChanged: action.bound,
            onDeleted: action.bound,
            onSetting: action.bound,
            updatePortalNode: action.bound,
            onCreation: action.bound,
            restoreDrawings: action.bound,
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

      
    async restoreDrawings(activeItems: TActiveDrawingToolItem[]) {
        const drawingPartMap = {
            Ray: 'RayLine',
            Continuous: 'ContinuousLine',
        };

        const activeDrawingItems = [...activeItems];
        let drawingList: any = [];

        const drawingPart = ['marker', 'line', 'rectangle'];
        activeDrawingItems.forEach(drawing => {
            drawing.items.forEach(data => {
                const drawingParts: any[] = [];
                data.config.drawingData.drawingParts.forEach(item => {
                    drawingParts.push({
                        ...item,
                        ...{
                            class_name_key: `${drawingPartMap[data.title] || data.title}Drawing`,
                            drawingPart:
                                typeof item.drawingPart === 'string'
                                    ? item.drawingPart
                                    : drawingPart[item.drawingPart.index],
                        },
                    });
                });

                data.config.drawingData.drawingParts = drawingParts;

                const finalItem = {
                    ...data.config,
                    ...{ name: data.name, title: data.title, pattern: 'solid', lineStyle: data.lineStyle },
                };
                if (data.fillStyle) {
                    finalItem['fillStyle'] = data.fillStyle;
                }

                // this.mainStore.chartAdapter.flutterChart?.drawingTool.addDrawing(JSON.stringify(finalItem));
                drawingList.push({ index: data.index, data: finalItem });
            });
        });

        drawingList = drawingList.sort((x, y) => x.index - y.index);

        this.mainStore.chartAdapter.flutterChart?.drawingTool.clearDrawingTool();

        drawingList.forEach(item => {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addDrawing(JSON.stringify(item.data));
        });

        this.activeToolsGroup = activeItems;

    }

    showDrawToolDialog(drawing: TActiveDrawingItem) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        // const dontDeleteMe = drawing.abort(); // eslint-disable-line no-unused-vars
        if (drawing) {
            let title = formatCamelCase(drawing.name || '');

            const parameters = defaultdrawToolsConfigs[drawing.id]().parameters;
            parameters.map(p => (p.value = clone(p.defaultValue)));

            title = `${drawing.title} ${drawing.num || ''}`;

            // console.log('checking drawing', drawing);
            // this.activeDrawing.highlighted = false;
            // this.activeDrawing = drawing;
            this.settingsDialog.title = title;
            this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
            this.settingsDialog.items = drawing.parameters;
            this.settingsDialog.formTitle = t.translate('Result');
            this.settingsDialog.id = JSON.stringify(drawing.index);
            this.settingsDialog.drawing_tool_id = drawing.id;
            this.settingsDialog.formClassname = 'form--drawing-tool';
            this.settingsDialog.setOpen(true);
        }
    }

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
        // If found, remove the item with the given index

        const finalItem = this.processDrawTool(id);
        this.seletedDrawToolConfig = clone(finalItem);
        delete finalItem.parameters;
        // console.log('Final Item', finalItem);
        if (finalItem) {
            // this.mainStore.chartAdapter.flutterChart?.drawingTool.clearDrawingToolSelect();
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(finalItem), -1);
            this.mainStore.state.saveDrawings();
            // this.mainStore.crosshair.selectedDrawingHoverClick();
        }
    }

    updateActiveToolsGroup(finalItem: TActiveDrawingItem) {
        const activeTools = [...this.activeToolsGroup];
        const groupIndex = activeTools.findIndex(item => item.id === finalItem.id);

        if (groupIndex === -1) {
            activeTools.push({
                id: finalItem.id,
                items: [finalItem],
            });
        } else {
            const item = activeTools[groupIndex];
            item.items.push({ ...finalItem, ...{ num: item.items.length } });
            activeTools[groupIndex] = item;
        }
        this.activeToolsGroup = activeTools;
        this.mainStore.state.saveDrawings();
    }

    // The common function (now only responsible for creating finalItem)
    processDrawTool(id: string) {
        const drawToolsConfig = getDrawTools();
        const props = drawToolsConfig[id];

        const { parameters, config } = getDefaultDrawingConfig(id);
        let finalItem = null;

        if (props && parameters) {
            parameters.map(p => (p.value = clone(p.defaultValue)));

            const item = {
                config,
                parameters,
                bars: '0',
                ...props,
            };

            const params = item.parameters.reduce((acc, it) => {
                const { path, paths, value } = it;

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
                parameters,
                ...{ index: this.activeToolsNo },
            };
        }

        return finalItem;
    }

    // onUpdate(index,config){
    //    const drawingName= this.mainStore.chartAdapter.flutterChart?.drawingTool.getTypeOfSelectedDrawingTool(config);
    //    const groupItem=this.activeToolsGroup.find(item=>item.id==drawingName);
    //     const groupIndex=groupItem?.items.find(it=>it.index==index);
    //     groupIndex.config=config;
    //     this.mainStore.state.saveDrawings();
    // }

    onUpdate(index, config) {
        const drawingName = this.mainStore.chartAdapter.flutterChart?.drawingTool.getTypeOfSelectedDrawingTool(config);

        // Find the group item containing the drawing tool
        const groupItem = this.activeToolsGroup.find(item => item.id === drawingName);

        if (groupItem) {
            // Find the item in the group by index
            const itemToUpdate = groupItem.items.find(item => item.index === index);

            if (itemToUpdate) {
                // Update the config of the found item
                itemToUpdate.config = config;
                this.mainStore.state.saveDrawings();
            }
        }
    }

    onCreation() {
        if (this.seletedDrawToolConfig) {
            this.updateActiveToolsGroup(this.seletedDrawToolConfig);
            const drawingTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();
            this.activeToolsGroup.map(item => {
                item.items.map(data => {
                    if (this.seletedDrawToolConfig.id === 'channel') {
                        data.config = drawingTools?.drawingToolsRepo?._addOns[data.index + 1];
                    } else {
                        data.config = drawingTools.drawingToolsRepo?._addOns[data.index];
                    }
                });
            });
            this.seletedDrawToolConfig = null;
            this.mainStore.state.saveDrawings();
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

            const tools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();
            if (tools) {
                const selectedConfig: TDrawConfig = tools.drawingToolsRepo._addOns[parseInt(this.settingsDialog.id)];

                const transformedParams = this.transform(params);

                selectedConfig.lineStyle.color.value = transformedParams.lineStyle.color;
                if (selectedConfig.fillStyle) {
                    selectedConfig.fillStyle.color.value = transformedParams.fillStyle.color;
                }

                const selectedGroup = this.activeToolsGroup.find(
                    item => item.id === this.settingsDialog.drawing_tool_id
                );
                const selectedItem = selectedGroup?.items.find(
                    group => group.index === parseInt(this.settingsDialog.id)
                );
                if (selectedItem && selectedItem.parameters) {
                    selectedItem.parameters = parameters;
                    selectedItem.lineStyle.color = selectedConfig.lineStyle.color.value;
                    if (selectedConfig.fillStyle) {
                        selectedItem.fillStyle.color = transformedParams.fillStyle.color;
                    }
                }

                this.mainStore.state.saveDrawings();

                console.log(selectedConfig);
                this.mainStore.chartAdapter.flutterChart?.drawingTool.editDrawing(
                    selectedConfig,
                    parseInt(this.settingsDialog.id)
                );
            }
        }
    }

    deleteItemWithIndex(groups: TActiveDrawingToolItem[], searchIndex: number, searchId: string) {
        // Find the group with the given id
        const group = groups.find(g => g.id === searchId);

        // If found, remove the item with the given index
        if (group) {
            group.items = group.items.filter(item => item.index !== searchIndex);
        }
        this.mainStore.state.saveDrawings();
        return groups;
    }

    findItem(activeTools: TActiveDrawingToolItem[], indx: number) {
        let targetItem = null;
        const targetGroup = activeTools.find(group => group.items.some(item => item.index === indx));
        if (targetGroup) {
            targetItem = targetGroup;
        }
        return targetItem;
    }

    onDeleted(indx?: number | string) {
        let activeTools = this.activeToolsGroup;

        if (indx !== undefined) {
            if (typeof indx === 'string') {
                indx = parseInt(indx);
            }

            this.mainStore.chartAdapter.flutterChart?.drawingTool.removeDrawingTool(indx);

            const targetItem = this.findItem(activeTools, indx);

            if (targetItem) {
                activeTools = this.deleteItemWithIndex(activeTools, indx, targetItem.id);

                activeTools.forEach(group => {
                    group.items.forEach(item => {
                        if (item.index > (indx as number)) {
                            item.index--;
                            if (targetItem?.id === group.id) {
                                item.num--;
                            }
                        }
                    });
                });
            }
            this.activeToolsGroup = activeTools;
            this.mainStore.state.saveDrawings();
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

    onRightClickSetting(indx?: number) {
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

    onDrawingHover(
        _dx: number,
        _dy: number,
        _epoch: number,
        _quote: string,
        quoteToY: (quote: number) => number,
        epochToX: (epoch: number) => number
    ) {
        return this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingHover(
            _dx,
            _dy,
            _epoch,
            _quote,
            quoteToY,
            epochToX
        );
    }
}
