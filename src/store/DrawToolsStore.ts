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

export type TEdgePoints = {
    epoch: number;
    quote: number;
};

type TDrawingPart = {
    chartConfig?: { pipsize: number; granularity: number };
    class_name_key: string;
    drawingPart: string | { index: number };
    edgePoint?: TEdgePoints;
    startPoint?: { x: number; y: number };
    isDrawingFinished?: boolean;
    startEdgePoint?: TEdgePoints;
    middleEdgePoint?: TEdgePoints;
    endEdgePoint?: TEdgePoints;
    [key: string]: any; /// Allows any other string key with values of any type
};

export type TActiveDrawingItem = {
    title: string;
    text: string;
    id: string;
    config: Record<string, any>;
    parameters: TSettingsParameter[];
    bars?: number;
    key?: string;
    icon?: TIcon | undefined;
    name: string;
    lineStyle?: {
        color: number;
    };
    fillStyle?: {
        color: number;
    };
    num: number;
    index: number;
};
export type TRestoreFinalItem = {
    name: string;
    title: string;
    pattern: string;
    lineStyle?: { color: number };
    fillStyle?: { color: number };
    [key: string]: any;
};
export type TRestoreDrawingList = {
    index: number;
    data: TRestoreFinalItem;
};

export type TActiveDrawingToolItem = {
    id: string;
    items: TActiveDrawingItem[];
};

export type TDrawingCreatedConfig = {
    configId: string;
    edgePoints: TEdgePoints[];
    isOverlay: boolean;
    pattern: { index: number };
    [key: string]: any;
};

/// TODO: Integrate draw tools with flutter charts

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
        /// if (!this.context) return;
    }

    onRightClickDrawing() {
        /// this.showDrawToolDialog(drawing);
        return true;
    }

    async restoreDrawings(activeItems: TActiveDrawingToolItem[]) {
        const drawingPart = ['marker', 'line', 'rectangle'];
        const drawingPartMap: {
            Ray: string;
            Continuous: string;
            [key: string]: any;
        } = {
            Ray: 'rayValue',
            Continuous: 'continuousValue',
        };

        const activeDrawingItems = [...activeItems];
        let drawingList: any = [];

        activeDrawingItems.forEach((drawing, index) => {
            drawing.items.forEach((data, itemIndex) => {
                const drawingParts: any[] = [];
                const drawingToolLabel = this.getDrawingToolProps(data.id);

                activeItems[index].items[itemIndex] = { ...activeItems[index].items[itemIndex], ...drawingToolLabel };

                data.config.drawingData.drawingParts.forEach((item: TDrawingPart) => {
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

                const finalItem: TRestoreFinalItem = {
                    ...data.config,
                    ...{ name: data.name, title: data.title, pattern: 'solid', lineStyle: data.lineStyle },
                };

                if (data.fillStyle) {
                    finalItem.fillStyle = data.fillStyle;
                }

                drawingList.push({ index: data.index, data: finalItem });
            });
        });

        drawingList = drawingList.sort((x: TRestoreFinalItem, y: TRestoreFinalItem) => x.index - y.index);

        this.mainStore.chartAdapter.flutterChart?.drawingTool.clearDrawingTool();

        drawingList.forEach((item: TRestoreDrawingList) => {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addDrawing(JSON.stringify(item.data));
        });
        this.activeToolsGroup = activeItems;
    }

    // Function that show the setting dialog for drawing tool
    showDrawToolDialog(drawing: TActiveDrawingItem) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        /// const dontDeleteMe = drawing.abort(); /// eslint-disable-line no-unused-vars
        if (drawing) {
            let title = formatCamelCase(drawing.name || '');

            const parameters = defaultdrawToolsConfigs[drawing.id]().parameters;
            parameters.map(p => (p.value = clone(p.defaultValue)));

            title = `${drawing.title} ${drawing.num || ''}`;
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

    // Callback to remove all drawings
    clearAll() {
        this.activeToolsGroup = [];
        window.flutterChart?.drawingTool.clearDrawingTool();
        this.mainStore.state.saveDrawings();
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
    }

    // Getting Props for drawing tool
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

    // Callback that runs when a drawing tool is selected
    selectTool(id: string) {
        this.menuStore.setOpen(false);
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Add ${id}`);
        /// If found, remove the item with the given index
        const finalItem = this.processDrawTool(id);
        this.seletedDrawToolConfig = clone(finalItem);
        delete finalItem.parameters;
        if (finalItem) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(finalItem), -1);
        }
    }

    /// Used to add item in activeToolsGroup
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

    /// The common function (now only responsible for creating finalItem)
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

    /// This callback run when any of the drawing is dragged, used to save updated drawing config
    onUpdate(index: number, config: TDrawingCreatedConfig) {
        const drawingName = this.mainStore.chartAdapter.flutterChart?.drawingTool.getTypeOfSelectedDrawingTool(config);

        // Find the group item containing the drawing tool
        const groupItem = this.activeToolsGroup.find(item => item.id === drawingName);

        if (groupItem) {
            // Find the item in the group by index
            const itemToUpdate = groupItem.items.find(item => item.index === index);

            if (itemToUpdate) {
                if (drawingName == 'trend') {
                    /// TODO
                    /// const filteredConfig = { ...config };
                } else {
                    itemToUpdate.config = config;
                }
                this.mainStore.state.saveDrawings();
            }
        }
    }

    /// Callback that runs on the creation of the drawing tool
    onCreation() {
        if (this.seletedDrawToolConfig !== null) {
            this.updateActiveToolsGroup(this.seletedDrawToolConfig);
            const drawingTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();
            this.activeToolsGroup.map(item => {
                item.items.map(data => {
                    const config: TDrawingCreatedConfig | undefined =
                        drawingTools?.drawingToolsRepo?._addOns[data.index];

                    if (config) {
                        if (this.seletedDrawToolConfig?.id && this.seletedDrawToolConfig.id === 'channel') {
                            const edgePoints = config?.edgePoints;

                            if (edgePoints && edgePoints.length == 2) {
                                const incrementedConfig = drawingTools?.drawingToolsRepo?._addOns[data.index + 1];
                                if (incrementedConfig) {
                                    data.config = incrementedConfig;
                                }
                            } else {
                                data.config = config;
                            }
                        } else {
                            data.config = config;
                        }
                    }
                });
            });

            /// for continuous, re-initializing it with updated index
            if (this.seletedDrawToolConfig.id == 'continuous') {
                const finalItem = this.processDrawTool(this.seletedDrawToolConfig.id);
                this.seletedDrawToolConfig = clone(finalItem);
            } else {
                /// for other tools, making config to null
                this.seletedDrawToolConfig = null;
            }
            this.mainStore.state.saveDrawings();
        }
    }

    /// When any of the property of a drawing tool is changed (lineStyle,fillStyle)
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
                if (selectedItem && selectedItem.lineStyle && selectedItem.parameters) {
                    selectedItem.parameters = parameters;
                    selectedItem.lineStyle.color = selectedConfig.lineStyle.color.value;
                    if (selectedConfig.fillStyle && selectedItem.fillStyle) {
                        selectedItem.fillStyle.color = transformedParams.fillStyle.color;
                    }
                }

                this.mainStore.state.saveDrawings();

                this.mainStore.chartAdapter.flutterChart?.drawingTool.editDrawing(
                    selectedConfig,
                    parseInt(this.settingsDialog.id)
                );
            }
        }
    }

    /// Deleting the item from the activeToolsGroup
    deleteItemWithIndex(groups: TActiveDrawingToolItem[], searchIndex: number, searchId: string) {
        /// Find the group with the given id
        const group = groups.find(g => g.id === searchId);

        /// If found, remove the item with the given index
        if (group) {
            group.items = group.items.filter(item => item.index !== searchIndex);
        }
        this.mainStore.state.saveDrawings();
        return groups;
    }

    /// Finding item from the activeToolsGroup by its property {index:number}
    findItem(activeTools: TActiveDrawingToolItem[], indx: number) {
        let targetItem = null;
        const targetGroup = activeTools.find(group => group.items.some(item => item.index === indx));
        if (targetGroup) {
            targetItem = targetGroup;
        }
        return targetItem;
    }

    /// Callback that runs when drawingTool is Deleted
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
            /// Log the event
            if (this.activeDrawing) {
                logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${this.activeDrawing.name}`);
            }
        }
    }

    /// When the settings are opened for a drawing tools
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

    /// Clone to OnSetting for testing
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

    /// Will be deleted
    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }

    /// Callback to check if the drawing is hovered
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
