import _ from 'lodash';
import { action, observable, reaction, when, makeObservable } from 'mobx';
import React from 'react';
import Context from 'src/components/ui/Context';
import { getUniqueId, hexToInt } from 'src/components/ui/utils';
import { TActiveItem, TIndicatorConfig, TIndicatorParameter, TObject } from 'src/types';
import MainStore from '.';
import MaximizeIcon from '../../sass/icons/chart/ic-maximize.svg';
import MinimizeIcon from '../../sass/icons/common/ic-minimize.svg';
import { IndicatorCatTrendDarkIcon, IndicatorCatTrendLightIcon } from '../components/Icons';
import { getIndicatorsTree, DefaultIndicatorConfigs } from '../Constant';
import { prepareIndicatorName, renderSVGString } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';

type THelperInput = {
    defaultInput: number;
    heading: string;
    name: string;
    type: string;
    value: number;
    options?: Record<string, string> | null;
};

type THelperOutput = {
    color: string;
    defaultOutput: string;
    heading: string;
    name: string;
};

type THelperParameter = {
    color: string;
    value: string;
    defaultColor: string;
    defaultValue: string;
    heading: string;
    name: string;
};

type TValueObject = {
    [key: string]: string;
};

type TStudyItems = {
    category: string;
    defaultValue: string | number | TValueObject;
    id: string;
    min?: number;
    options?: Record<string, string> | null;
    step?: number;
    title: string;
    type: string;
    value: string | number | TValueObject;
};

export default class StudyLegendStore {
    mainStore: MainStore;
    menuStore: MenuStore;
    searchInput: React.RefObject<HTMLInputElement>;
    settingsDialog: SettingsDialogStore;
    selectedTab = 1;
    filterText = '';
    activeItems: TActiveItem[] = [];
    infoItem: (TActiveItem & { disabledAddBtn?: boolean }) | null = null;
    portalNodeIdChanged? = '';

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            selectedTab: observable,
            filterText: observable,
            activeItems: observable,
            infoItem: observable,
            portalNodeIdChanged: observable,
            onSelectItem: action.bound,
            //  updateIndicatorHeight: action.bound,
            updateStyle: action.bound,
            updateProps: action.bound,
            editStudy: action.bound,
            deleteStudy: action.bound,
            updateStudy: action.bound,

            deletePredictionStudies: action.bound,
            deleteAllStudies: action.bound,
            onStudyRemoved: action.bound,
            onSelectTab: action.bound,
            setFilterText: action.bound,
            onInfoItem: action.bound,
            updatePortalNode: action.bound,
        });

        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
        this.menuStore = new MenuStore(mainStore, { route: 'indicators' });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: this.deleteStudy,
            favoritesId: 'indicators',
            onChanged: (items: TIndicatorParameter[]) => this.updateStudy(items),
        });
        this.searchInput = React.createRef();
        reaction(
            () => this.menuStore.open,
            () => {
                if (!this.menuStore.open) {
                    this.setFilterText('');
                }
                setTimeout(() => {
                    if (this.searchInput && this.searchInput.current) this.searchInput.current.focus();
                }, 400);
            }
        );
    }
    previousStudies: Record<string, typeof CIQ.Studies.StudyDescriptor> = {};
    searchInputClassName?: string;

    onContextReady = () => {
        // this.stx.addEventListener('studyOverlayEdit', this.editStudy);
        // this.stx.addEventListener('studyPanelEdit', this.editStudy);
        // // to remove studies if user has already more than 5
        // this.removeExtraStudies();
        // this.stx.append('createDataSet', this.renderLegend);
        // this.stx.append('drawPanels', this.handleDrawPanels);
        // this.stx.append('panelClose', this.onStudyRemoved);
        // this.renderLegend();
    };
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get indicatorRatio() {
        return this.mainStore.chart;
    }
    get items() {
        return [...getIndicatorsTree()].map(indicator => {
            // the only icon which is different on light/dark is trend
            if (indicator.name === 'trend') {
                indicator.icon =
                    this.mainStore.chartSetting.theme === 'light'
                        ? IndicatorCatTrendLightIcon
                        : IndicatorCatTrendDarkIcon;
            }
            return indicator;
        });
    }
    get searchedItems() {
        return [...getIndicatorsTree()]
            .map(category => {
                category.foundItems = (category.items.filter(
                    item => item.name.toLowerCase().indexOf(this.filterText.toLowerCase().trim()) !== -1
                ) as unknown) as TActiveItem[];
                return category;
            })
            .filter(category => category.foundItems?.length);
    }

    get hasPredictionIndicator() {
        return (this.activeItems || []).filter((item: TActiveItem) => item.isPrediction).length > 0;
    }

    get maxAllowedItem() {
        return this.mainStore.chart.isMobile ? 2 : 5;
    }

    transform = (value: any) => {
        if (_.isString(value) && (value.startsWith('#') || value.toLowerCase().startsWith('0x'))) {
            return hexToInt(value);
        } else if (_.isObject(value)) {
            const map = value as Record<string, any>;
            Object.keys(value).forEach(key => {
                map[key] = this.transform(map[key]);
            });
        } else if (_.isArray(value)) {
            value.map(item => this.transform(item));
        }

        return value;
    };

    addOrUpdateIndicator = (activeItem: TActiveItem) => {
        const params = activeItem.parameters.reduce((acc, item) => {
            const { path, paths, value } = item;

            if (_.isObject(value) && paths) {
                const map = value as Record<string, any>;
                const keys = Object.keys(map);
                keys.forEach(key => {
                    _.set(acc, paths[key], map[key]);
                });
            } else if (path) {
                _.set(acc, path, value);
            }

            return acc;
        }, activeItem.config || {});

        const config: TIndicatorConfig = {
            id: activeItem.id,
            name: activeItem.name,
            ...this.transform(params),
        };
        console.log('Add/Update Indicator', config);
        this.mainStore.chartAdapter.flutterChart?.config.addOrUpdateIndicator(JSON.stringify(config));
    };

    onSelectItem(indicatorName: string) {
        this.onInfoItem(null);

        if (this.activeItems.length >= this.maxAllowedItem) return;

        // const heightRatio = this.indicatorRatio.indicatorHeightRatio(addedIndicator + 1);
        this.changeStudyPanelTitle();
        // setTimeout(this.updateIndicatorHeight, 20);
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Add ${indicatorName}`);
        this.mainStore.chart.setYaxisWidth();

        const props = this.getIndicatorProps(indicatorName);
        const { parameters, config } = this.getDefaultIndicatorConfig(indicatorName);

        if (props && parameters) {
            parameters.map(p => (p.value = _.clone(p.defaultValue)));
            const nameObj = prepareIndicatorName(this.settingsDialog.name, parameters);

            const item: TActiveItem = {
                ...props,
                id: getUniqueId(),
                name: props.name,
                config,
                parameters,
                bars: nameObj.bars,
            };

            this.activeItems.push(item);

            this.addOrUpdateIndicator(item);
        }
    }

    restoreStudies(activeItems: TActiveItem[]) {
        this.deleteAllStudies();

        activeItems.forEach(activeItem => {
            this.addOrUpdateIndicator(activeItem);

            const props = this.getIndicatorProps(activeItem.name);
            _.extend(activeItem, props || {});
        });

        this.activeItems = activeItems;
    }
    // updateIndicatorHeight() {
    //     const addedIndicator = Object.keys(this.stx.panels).filter(id => id !== 'chart').length;
    //     const heightRatio = this.indicatorRatio.indicatorHeightRatio(addedIndicator);
    //     Object.keys(this.stx.panels).forEach((id, index) => {
    //         if (index === 0) {
    //             return;
    //         }
    //         const panelObj = this.stx.panels[id];
    //         panelObj.percent = heightRatio.percent;
    //     });
    //     this.stx.draw();
    //     this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
    //     this.stx.draw();
    // }
    // Temporary prevent user from adding more than 5 indicators
    // TODO All traces can be removed after new design for studies
    updateStyle() {
        const should_minimise_last_digit = Object.keys(this.stx.panels).length > 2;
        this.mainStore.state.setShouldMinimiseLastDigit(should_minimise_last_digit);
    }
    updateProps({ searchInputClassName }: { searchInputClassName?: string }) {
        this.searchInputClassName = searchInputClassName;
    }

    editStudyById(id: string) {
        const activeItem = this.activeItems.find(i => i.id === id);
        if (activeItem) this.editStudy(activeItem);
    }

    editStudy(study: TActiveItem) {
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Edit ${study.name}`);

        this.settingsDialog.id = study.id;
        this.settingsDialog.name = study.name;
        this.settingsDialog.items = study.parameters;
        this.settingsDialog.title = study.title;
        this.settingsDialog.formTitle = t.translate('Result');
        this.settingsDialog.formClassname = `form--${study.id.toLowerCase().replace(/ /g, '-')}`;
        // TODO:
        // const description = StudyInfo[study.sd.type];
        // this.settingsDialog.description = description || t.translate("No description yet");
        this.settingsDialog.description = '';
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        this.settingsDialog.setOpen(true);
    }
    deleteStudy(id: string) {
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Remove ${id}`);

        this.mainStore.chartAdapter.flutterChart?.config.removeIndicator(id);

        _.remove(this.activeItems, item => item.id === id);
        // this.renderLegend();

        //setTimeout(this.updateIndicatorHeight, 20);
    }
    updateStudy(parameters: TIndicatorParameter[]) {
        this.changeStudyPanelTitle();
        //  this.settingsDialog.title = t.translate(this.helper.sd.libraryEntry.name);

        const props = this.getIndicatorProps(this.settingsDialog.name);
        const { config } = this.getDefaultIndicatorConfig(this.settingsDialog.name) || {};

        if (props && parameters) {
            const nameObj = prepareIndicatorName(this.settingsDialog.name, parameters);

            const item: TActiveItem = {
                ...props,
                id: this.settingsDialog.id,
                bars: nameObj.bars,
                parameters,
                config,
            };

            this.addOrUpdateIndicator(item);
        }
    }
    changeStudyPanelTitle() {
        // Remove numbers from the end of indicator titles in mobile
        if (this.mainStore.chart.isMobile) {
            this.mainStore.state.saveLayout();
        }
    }
    shouldRenderLegend() {
        const stx = this.stx;
        if (!stx.layout.studies) {
            return false;
        }
        // Logic to determine if the studies have changed, otherwise don't re-create the legend
        if (CIQ.objLength(this.previousStudies) === CIQ.objLength(stx.layout.studies)) {
            let foundAChange = false;
            for (const id in stx.layout.studies) {
                if (!this.previousStudies[id]) {
                    foundAChange = true;
                    break;
                }
            }
            if (!foundAChange) {
                return false;
            }
        }
        this.previousStudies = CIQ.shallowClone(stx.layout.studies);
        return true;
    }
    handleDrawPanels = () => {
        if (this.stx) {
            const panels = Object.keys(this.stx.panels);
            const panelsLen = panels.length;
            panels.forEach((id, index) => {
                if (index === 0) {
                    return;
                }

                const panelObj = this.stx.panels[id];
                if (this.mainStore.chart.isMobile) {
                    if (panelObj.up.className.indexOf('show') !== -1) {
                        panelObj.up.className = 'stx-btn-panel';
                    }
                    if (panelObj.down.className.indexOf('show') !== -1) {
                        panelObj.down.className = 'stx-btn-panel';
                    }
                    if (panelObj.solo.className.indexOf('show') !== -1) {
                        panelObj.solo.className = 'stx-btn-panel';
                    }
                    if (panelObj.close.className.indexOf('show') !== -1) {
                        panelObj.close.className = 'stx-btn-panel';
                    }
                }
                const sd = this.stx.layout.studies[id];
                const isSolo = panelObj.solo.getAttribute('class').includes('stx_solo_lit');
                if (sd) {
                    const nameObj = prepareIndicatorName(sd.name);
                    if (nameObj.name.trim() !== sd.name.trim()) {
                        panelObj.title.innerHTML = nameObj.bars ? `${nameObj.name} (${nameObj.bars})` : nameObj.name;
                    }

                    // Regarding the ChartIQ.js, codes under Line 34217, edit function
                    // not mapped, this is a force to map edit function for indicators
                    if (sd.editFunction && panelObj && !panelObj.editFunction) {
                        this.stx.setPanelEdit(panelObj, sd.editFunction);
                    }
                }

                if (index === 1 || isSolo) {
                    // Hide the up arrow from first indicator to prevent user
                    // from moving the indicator panel above the main chart
                    panelObj.up.style.display = 'none';
                }

                if (index === panelsLen - 1 || isSolo) {
                    panelObj.down.style.display = 'none';
                }

                // Mean chart + 1 indicator
                if (panelsLen === 2) {
                    panelObj.solo.style.display = 'none';
                }

                // Updating Max/Min icon
                if (panelObj.solo.style.display !== 'none') {
                    const soloIcon = isSolo ? MinimizeIcon : MaximizeIcon;
                    const InnerSoloPanel = panelObj.solo.querySelector('.stx-ico-focus');
                    if (InnerSoloPanel.querySelector('svg').getAttribute('id') !== soloIcon.id) {
                        InnerSoloPanel.innerHTML = renderSVGString(soloIcon);
                    }
                }
            });
        }
    };
    /**
     * Gets called continually in the draw animation loop.
     * Be careful not to render unnecessarily. */
    renderLegend = () => {
        if (!this.context || !this.shouldRenderLegend()) {
            return;
        }
        // Temporary prevent user from adding more than 5 indicators
        // All traces can be removed after new design for studies
        this.updateStyle();
    };

    getIndicatorProps = (indicator: string) => {
        return _.flatMap(getIndicatorsTree(), collection => collection.items).find(item => item?.name === indicator);
    };

    getDefaultIndicatorConfig = (indicator: keyof typeof DefaultIndicatorConfigs) => {
        return DefaultIndicatorConfigs[indicator];
    };

    deletePredictionStudies() {
        const stx = this.stx;
        if (stx) {
            (this.activeItems || [])
                .filter((item: TActiveItem) => item.isPrediction)
                .forEach((item: TActiveItem) => {
                    this.deleteStudy(item.dataObject.sd);
                });
            //setTimeout(this.updateIndicatorHeight, 20);
        }
    }

    deleteAllStudies() {
        this.activeItems.forEach(activeItem => this.deleteStudy(activeItem.id));
        this.activeItems = [];
    }

    onStudyRemoved() {
        //  setTimeout(this.updateIndicatorHeight, 20);
    }
    onSelectTab(tabIndex: number) {
        this.setFilterText('');
        this.selectedTab = tabIndex;
        this.onInfoItem(null);
    }
    setFilterText(filterText: string) {
        this.selectedTab = filterText !== '' ? 0 : 1;
        this.filterText = filterText;
    }

    onInfoItem(study: TActiveItem | null) {
        this.infoItem = study
            ? {
                  ...study,
                  disabledAddBtn: study.isPrediction && this.mainStore.timeperiod.isTick,
              }
            : study;
    }
    updatePortalNode(portalNodeId?: string) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
