import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TDrawingToolConfig, TIcon, TSettingsParameter } from 'src/types';
import set from 'lodash.set';
import { capitalize, hexToInt, intToHexColor } from 'src/components/ui/utils';
import MainStore from '.';
import { defaultdrawToolsConfigs, getDefaultDrawingConfig, getDrawTools } from '../Constant';
import { clone, formatCamelCase, isLiteralObject, safeParse, transformStudiesforTheme } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';

export type TEdgePoints = {
    epoch: number;
    quote: number;
};

export type TActiveDrawingItem = {
    title: string;
    text: string;
    id: string;
    config: TDrawingToolConfig;
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
    lineStyle?: { color: { value: number }; thickness: number };
    fillStyle?: { color: { value: number }; thickness: number };
    [key: string]: any;
};

export type TDrawingEditParameter =
    | {
          category: string;
          defaultValue: string;
          path: string;
          title: string;
          type: string;
          value: string;
      }
    | TSettingsParameter;

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
            onLoad: action.bound,
        });

        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'draw-tool' });

        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: (id: string) => {
                const drawToolsItems = this.drawingToolsRepoArray();
                const index = drawToolsItems?.findIndex(item => item.configId === id);
                if (index !== undefined && index > -1) {
                    this.onDeleted(index);
                }
            },
            onChanged: (items: TDrawingEditParameter[]) => this.onChanged(items),
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

    getDrawToolsItems = () => {
        const drawTools = getDrawTools();
        return Object.keys(drawTools).map(key => drawTools[key]);
    };

    drawingToolsRepoArray = () => {
        return this.mainStore.chartAdapter.flutterChart?.drawingTool
            .getDrawingToolsRepoItems()
            .map(item => safeParse(item))
            .filter(item => item)
            .filter(item => {
                return !(item.drawingData.isDrawingFinished == false);
            });
    };

    onContextReady = () => {
        document.addEventListener('keydown', this.closeOnEscape, false);
        document.addEventListener('dblclick', this.doubleClick);
    };

    closeOnEscape = (e: KeyboardEvent) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.clearDrawingToolSelect();
            // drawingTools.selectedDrawingTool = null;
            this.seletedDrawToolConfig = null;
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
    }

    // Callback that gets called when theme is changed
    updateTheme() {
        this.activeToolsGroup.forEach(item =>
            item.items.forEach(data => {
                transformStudiesforTheme(data.parameters, this.mainStore.chartSetting.theme);
                this.onChanged(data.parameters, data.index);
            })
        );
    }

    // Callback that runs when the chart is loaded
    onLoad(drawings: TDrawingCreatedConfig[]) {
        this.activeToolsGroup = [];
        drawings.forEach((item: TDrawingCreatedConfig) => {
            if (typeof item === 'string') {
                item = safeParse(item);
            }

            if (!item) {
                return;
            }

            const drawingName = item.name.replace('dt_', '');
            if (drawingName) {
                const finalItem = this.processDrawTool(drawingName);

                finalItem.config = item;

                finalItem.parameters.forEach((params: TDrawingEditParameter) => {
                    if (params.path) {
                        if (['lineStyle', 'fillStyle'].includes(params.path)) {
                            params.value = intToHexColor(item[params.path]?.color?.value ?? item[params.path]?.color);
                        } else if (params.path == 'enableLabel') {
                            params.value = item[params.path];
                        }
                    }
                });
                this.updateActiveToolsGroup(finalItem);
            }
        });
    }

    // Function that show the setting dialog for drawing tool
    showDrawToolDialog(drawing: TActiveDrawingItem) {
        logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Edit ${drawing.name}`);
        if (drawing) {
            let title = formatCamelCase(drawing.name || '');

            const parameters = defaultdrawToolsConfigs[drawing.id]().parameters;
            parameters.map(p => (p.value = clone(p.defaultValue)));

            title = `${drawing.title} ${drawing.num || ''}`;
            this.settingsDialog.title = title;
            this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
            this.settingsDialog.items = drawing.parameters;
            this.settingsDialog.formTitle = t.translate('Result');
            this.settingsDialog.id = drawing.config.configId;
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
        finalItem.lineStyle = {
            color: finalItem.lineStyle,
        };
        if (finalItem.fillStyle) {
            finalItem.fillStyle = {
                color: finalItem.fillStyle,
            };
        }

        delete finalItem.parameters;

        if (finalItem) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.addOrUpdateDrawing(JSON.stringify(finalItem));
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
        const drawToolsItem = this.drawingToolsRepoArray();
        if (drawToolsItem) {
            this.onLoad(drawToolsItem);
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
    }


    saveTemplate(name:string){
        this.mainStore.chartAdapter.flutterChart?.drawingTool.saveTemplate(name);
    }
    
    applyTemplate(name:string){
        this.mainStore.chartAdapter.flutterChart?.drawingTool.applyTemplate(name);
    }

    removeTemplate(name:string){
        this.mainStore.chartAdapter.flutterChart?.drawingTool.removeTemplate(name);
    }

    removeAllTemplate(){
        this.mainStore.chartAdapter.flutterChart?.drawingTool.removeAllTemplate();
    }
    

    /// Callback that runs after the creation of the drawing tool in flutter charts
    onCreation() {
        if (this.seletedDrawToolConfig !== null) {
            this.updateActiveToolsGroup(this.seletedDrawToolConfig);
            const drawingToolsItem = this.drawingToolsRepoArray();
            if (!drawingToolsItem) {
                return;
            }

            this.activeToolsGroup.forEach(item => {
                item.items.forEach(data => {
                    if (drawingToolsItem[data.index]) {
                        const config: TDrawingCreatedConfig = drawingToolsItem[data.index];
                        if (config) {
                            if (
                                this.seletedDrawToolConfig?.id &&
                                this.seletedDrawToolConfig.id === 'channel' &&
                                this.seletedDrawToolConfig.index === data.index
                            ) {
                                const edgePoints = config.edgePoints;
                                if (edgePoints && edgePoints.length === 2) {
                                    const incrementedConfig = drawingToolsItem[data.index + 1];
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
                    }
                });
            });

            /// for continuous, re-initializing it with updated index
            if (this.seletedDrawToolConfig.id === 'continuous') {
                const finalItem = this.processDrawTool(this.seletedDrawToolConfig.id);
                this.seletedDrawToolConfig = clone(finalItem);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.selectTool(this.seletedDrawToolConfig!.id);
            } else {
                /// for other tools, making config to null
                this.seletedDrawToolConfig = null;
            }
        }
    }

    /// When any of the property of a drawing tool is changed (lineStyle,fillStyle)
    /// OnUpdate runs after this function as well
    onChanged(parameters: TDrawingEditParameter[], drawingIndex?: number) {
        let index;
        this.mainStore.chartAdapter.flutterChart?.drawingTool.clearDrawingToolSelect();

        const drawToolsItem = this.drawingToolsRepoArray();
        if (!drawToolsItem) {
            return;
        }

        if (!drawingIndex && drawingIndex !== 0) {
            index = drawToolsItem.findIndex(item => item.configId === this.settingsDialog.id);
        } else {
            index = drawingIndex;
        }

        if (index === -1) return;

        const selectedConfig = drawToolsItem[index];

        parameters.forEach(item => {
            if (!item.path) {
                return;
            }
            if (item.type == 'colorpicker') {
                selectedConfig[item.path].color = hexToInt(item.value as string);
            } else if (item.type == 'switch') {
                selectedConfig[item.path] = item.value;
            }
        });
        this.mainStore.chartAdapter.flutterChart?.drawingTool.editDrawing(JSON.stringify(selectedConfig), index);
    }

    /// Callback that runs when drawingTool is Deleted
    onDeleted(index?: number) {
        if (index !== undefined) {
            this.mainStore.chartAdapter.flutterChart?.drawingTool.removeDrawingTool(index);
            this.onUpdate();
            this.mainStore.crosshair.removeDrawingToolToolTip();
            /// Log the event
            if (index) {
                logEvent(LogCategories.ChartControl, LogActions.DrawTools, `Remove ${index}`);
            }
        }
    }

    /// When the settings are opened for a drawing tools
    onSetting(index?: number) {
        if (index !== undefined) {
            let targetItem;
            for (const group of this.activeToolsGroup) {
                const foundItem = group.items.find(item => item.index === index);
                if (foundItem) {
                    targetItem = foundItem;
                }
            }
            if (targetItem) {
                this.showDrawToolDialog(targetItem);
            }
        }
    }

    /// Update portal node
    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
