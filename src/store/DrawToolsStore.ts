import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TIcon, TSettingsParameter } from 'src/types';
import set from 'lodash.set';
import { capitalize, hexToInt, intToHexColor } from 'src/components/ui/utils';
import MainStore from '.';
import { defaultdrawToolsConfigs, getDefaultDrawingConfig, getDrawTools } from '../Constant';
import { clone, formatCamelCase, isLiteralObject, transformStudiesforTheme } from '../utils';
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


export type TEdgePoints = {
    epoch: number;
    quote: number;
};

// type TDrawingPart = {
//     chartConfig?: { pipsize: number; granularity: number };
//     class_name_key: string;
//     drawingPart: string | { index: number };
//     edgePoint?: TEdgePoints;
//     startPoint?: { x: number; y: number };
//     isDrawingFinished?: boolean;
//     startEdgePoint?: TEdgePoints;
//     middleEdgePoint?: TEdgePoints;
//     endEdgePoint?: TEdgePoints;
//     [key: string]: any; /// Allows any other string key with values of any type
// };

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

    updateTheme() {
        this.activeToolsGroup.forEach(item =>
            item.items.forEach(data => {
                transformStudiesforTheme(data.parameters, this.mainStore.chartSetting.theme);
                this.settingsDialog.id = JSON.stringify(data.index);
                this.settingsDialog.drawing_tool_id = data.id;
                this.onChanged(data.parameters);
            })
        );
    }

    // callback that runs when the chart is loaded
    onLoad(drawings: TDrawingCreatedConfig[]) {
        // console.log(drawings);
        // console.log(this.s)
        this.activeToolsGroup = [];
        drawings.forEach((item: TDrawingCreatedConfig) => {
            const drawingName = this.mainStore.chartAdapter.flutterChart?.drawingTool.getTypeOfSelectedDrawingTool(
                item
            );
            if (drawingName) {
                const finalItem = this.processDrawTool(drawingName.toLowerCase());

                finalItem.config = item;

                // console.log(item.lineStyle.color.value, finalItem.parameters[0]);
                finalItem.parameters[0].value = intToHexColor(item.lineStyle.color.value);
                if (item.fillStyle) {
                    finalItem.parameters[1].value = intToHexColor(item.fillStyle.color.value);
                }

                this.updateActiveToolsGroup(finalItem);
            }
        });
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
        //this.mainStore.state.saveDrawings();
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, 'Clear All');
    }

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

    /// The common function (now only responsible for creating finalItem)
    processDrawTool(id: string) {
        const drawToolsConfig = getDrawTools();
        const props = drawToolsConfig[id];

        const { parameters, config } = getDefaultDrawingConfig(id);

        transformStudiesforTheme(parameters, this.mainStore.chartSetting.theme);
        transformStudiesforTheme(config, this.mainStore.chartSetting.theme);

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

            const drawingData = {
                id: item.id,
                name: `dt_${id}`,
                title: capitalize(item.id),
                ...this.transform(params),
            };

            const drawToolConfig = getDrawTools();

            finalItem = {
                ...drawingData,
                ...drawToolConfig[id],
                parameters,
                ...{ index: this.activeToolsNo },
            };
        }

        return finalItem;
    }

    /// This callback run when any of the drawing is dragged, used to save updated drawing config
    onUpdate() {
        const drawTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();
        if (drawTools?.drawingToolsRepo._addOns) {
            this.onLoad(drawTools?.drawingToolsRepo._addOns);
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
        // //this.mainStore.state.saveDrawings();
    }

    /// Callback that runs on the creation of the drawing tool
    onCreation() {
        if (this.seletedDrawToolConfig !== null) {
            this.updateActiveToolsGroup(this.seletedDrawToolConfig);
            const drawingTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();

            this.activeToolsGroup.forEach(item => {
                item.items.forEach(data => {
                    const config: TDrawingCreatedConfig = drawingTools?.drawingToolsRepo?._addOns[data.index] || {
                        configId: '',
                        edgePoints: [],
                        isOverlay: false,
                        pattern: { index: 0 },
                    };

                    if (config) {
                        if (
                            this.seletedDrawToolConfig?.id &&
                            this.seletedDrawToolConfig.id === 'channel' &&
                            this.seletedDrawToolConfig.index === data.index
                        ) {
                            const edgePoints = config.edgePoints;
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
            //this.mainStore.state.saveDrawings();
        }
    }

    /// When any of the property of a drawing tool is changed (lineStyle,fillStyle)
    onChanged(parameters: TSettingsParameter[]) {
        const props = getDrawTools()[this.settingsDialog.drawing_tool_id];
        const { config } = defaultdrawToolsConfigs[this.settingsDialog.drawing_tool_id]();

        transformStudiesforTheme(parameters, this.mainStore.chartSetting.theme);

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
                const selectedConfig: TDrawingCreatedConfig =
                    tools.drawingToolsRepo._addOns[parseInt(this.settingsDialog.id)];

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

                this.mainStore.chartAdapter.flutterChart?.drawingTool.editDrawing(
                    selectedConfig,
                    parseInt(this.settingsDialog.id)
                );
            }
        }
    }

    /// Callback that runs when drawingTool is Deleted
    onDeleted(indx?: number | string) {
        if (indx !== undefined) {
            if (typeof indx === 'string') {
                indx = parseInt(indx);
            }

            this.mainStore.chartAdapter.flutterChart?.drawingTool.removeDrawingTool(indx);
            const drawTools = this.mainStore.chartAdapter.flutterChart?.drawingTool.getDrawingTools();
            if (drawTools?.drawingToolsRepo._addOns) {
                this.onLoad(drawTools?.drawingToolsRepo._addOns);
            }
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
}
