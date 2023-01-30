import _ from 'lodash';
import { action, observable, reaction, when, makeObservable } from 'mobx';
import React from 'react';
import Context from 'src/components/ui/Context';
import { getUniqueId, hexToInt } from 'src/components/ui/utils';
import { TActiveItem, TIndicatorConfig, TSettingsParameter } from 'src/types';
import MainStore from '.';
import { IndicatorCatTrendDarkIcon, IndicatorCatTrendLightIcon } from '../components/Icons';
import { getIndicatorsTree, DefaultIndicatorConfigs } from '../Constant';
import { prepareIndicatorName } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';

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
            updateStyle: action.bound,
            updateProps: action.bound,
            editStudy: action.bound,
            deleteStudy: action.bound,
            updateStudy: action.bound,

            deletePredictionStudies: action.bound,
            deleteAllStudies: action.bound,
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
            onChanged: (items: TSettingsParameter[]) => this.updateStudy(items),
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
    searchInputClassName?: string;

    onContextReady = () => {
        // to remove studies if user has already more than 5

        this.renderLegend();
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
        this.mainStore.chartAdapter.flutterChart?.config.addOrUpdateIndicator(JSON.stringify(config));
        this.mainStore.state.saveLayout();
    };

    onSelectItem(indicatorName: string) {
        this.onInfoItem(null);

        if (this.activeItems.length >= this.maxAllowedItem) return;

        this.changeStudyPanelTitle();
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Add ${indicatorName}`);

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

    // Temporary prevent user from adding more than 5 indicators
    // TODO All traces can be removed after new design for studies
    updateStyle() {
        const should_minimise_last_digit = this.mainStore.studies.activeItems.length > 2;
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
        this.renderLegend();
        this.mainStore.state.saveLayout();
    }
    updateStudy(parameters: TSettingsParameter[]) {
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

    /**
     * Gets called continually in the draw animation loop.
     * Be careful not to render unnecessarily. */
    renderLegend = () => {
        if (!this.context) {
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
        this.deleteAllStudies();
    }

    deleteAllStudies() {
        this.activeItems.forEach(activeItem => this.deleteStudy(activeItem.id));
        this.activeItems = [];
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
