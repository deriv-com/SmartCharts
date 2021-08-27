import React from 'react';
import { observable, action, when, reaction } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import SettingsDialog from '../components/SettingsDialog.jsx';
import Menu from '../components/Menu.jsx';
import SearchInput from '../components/SearchInput.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
import { getIndicatorsTree, ExcludedStudies } from '../Constant';
import { prepareIndicatorName, renderSVGString } from '../utils';
import { IndicatorCatTrendLightIcon, IndicatorCatTrendDarkIcon } from '../components/Icons.jsx';
import MaximizeIcon from '../../sass/icons/chart/ic-maximize.svg';
import MinimizeIcon from '../../sass/icons/common/ic-minimize.svg';

// TODO:
// import StudyInfo from '../study-info';

const updateFieldHeading = (heading, type) => {
    const names = ['%D', '%K'];
    if (heading.toLowerCase() === type.toLowerCase() || heading === 'Result') {
        return 'Color';
    }
    if (names.indexOf(heading) > 0) {
        return `${heading} Color`;
    }
    return heading;
};

export default class StudyLegendStore {
    constructor(mainStore) {
        this.excludedStudies = ExcludedStudies;
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore(mainStore, { route: 'indicators' });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: () => this.deleteStudy(this.helper.sd),
            favoritesId: 'indicators',
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
        this.StudyMenu = this.menu.connect(Menu);
        this.StudySettingsDialog = this.settingsDialog.connect(SettingsDialog);

        this.searchInput = React.createRef();
        this.SearchInput = connect(() => ({
            placeholder: t.translate('Search'),
            value: this.filterText,
            onChange: this.setFilterText,
            searchInput: this.searchInput,
            searchInputClassName: 'searchInputClassName',
        }))(SearchInput);

        reaction(
            () => this.menu.open,
            () => {
                if (!this.menu.open) {
                    this.setFilterText('');
                }
                setTimeout(() => {
                    if (this.searchInput && this.searchInput.current) this.searchInput.current.focus();
                }, 400);
            }
        );
    }

    previousStudies = {};
    searchInputClassName;
    @observable selectedTab = 1;
    @observable filterText = '';
    @observable activeItems = [];
    @observable infoItem = null;
    @observable portalNodeIdChanged;

    onContextReady = () => {
        this.stx.addEventListener('studyOverlayEdit', this.editStudy);
        this.stx.addEventListener('studyPanelEdit', this.editStudy);

        // to remove studies if user has already more than 5
        // and remove studies which are excluded
        this.removeExtraStudies();
        this.stx.append('createDataSet', this.renderLegend);
        this.stx.append('drawPanels', this.handleDrawPanels);
        this.stx.append('panelClose', this.onStudyRemoved);
        this.renderLegend();
    };

    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    get indicatorRatio() {
        return this.mainStore.chart;
    }

    get items() {
        return [...getIndicatorsTree()].map(indicator => {
            // the only icon which is different on light/dark is trend
            if (indicator.id === 'trend') {
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
                category.foundItems = category.items.filter(
                    item => item.name.toLowerCase().indexOf(this.filterText.toLowerCase().trim()) !== -1
                );
                return category;
            })
            .filter(category => category.foundItems.length);
    }

    get chartActiveStudies() {
        return (this.activeItems || []).filter(item => item.dataObject.sd.panel === 'chart');
    }

    get hasPredictionIndicator() {
        return (this.activeItems || []).filter(item => item.isPrediction).length > 0;
    }

    get maxAllowedItem() {
        return this.mainStore.chart.isMobile ? 2 : 5;
    }

    @action.bound removeExtraStudies() {
        if (this.stx.layout && this.stx.layout.studies) {
            Object.keys(this.stx.layout.studies).forEach((study, idx) => {
                const type = this.stx.layout.studies[study].type;
                if (idx >= this.maxAllowedItem || this.excludedStudies[type]) {
                    setTimeout(() => {
                        CIQ.Studies.removeStudy(this.stx, this.stx.layout.studies[study]);
                        this.renderLegend();
                    }, 0);
                }
            });
        }
    }

    @action.bound onSelectItem(item) {
        this.onInfoItem(null);
        const addedIndicator = Object.keys(this.stx.layout.studies || []).length;
        if (this.stx.layout && addedIndicator < this.maxAllowedItem) {
            const heightRatio = this.indicatorRatio.indicatorHeightRatio(addedIndicator + 1);
            CIQ.Studies.studyLibrary[item].panelHeight = heightRatio.height + 20;
            const sd = CIQ.Studies.addStudy(this.stx, item);
            CIQ.Studies.studyLibrary[item].panelHeight = null;
            this.changeStudyPanelTitle(sd);
            setTimeout(this.updateIndicatorHeight, 20);
            logEvent(LogCategories.ChartControl, LogActions.Indicator, `Add ${item}`);
            this.mainStore.chart.setYaxisWidth();
        }
    }

    @action.bound updateIndicatorHeight() {
        const addedIndicator = Object.keys(this.stx.panels).filter(id => id !== 'chart').length;

        const heightRatio = this.indicatorRatio.indicatorHeightRatio(addedIndicator);
        Object.keys(this.stx.panels).forEach((id, index) => {
            if (index === 0) {
                return;
            }
            const panelObj = this.stx.panels[id];
            panelObj.percent = heightRatio.percent;
        });
        this.stx.draw();
        this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
        this.stx.draw();
    }

    // Temporary prevent user from adding more than 5 indicators
    // TODO All traces can be removed after new design for studies
    @action.bound updateStyle() {
        const should_minimise_last_digit = Object.keys(this.stx.panels).length > 2;
        this.mainStore.state.setShouldMinimiseLastDigit(should_minimise_last_digit);
    }

    @action.bound updateProps({ searchInputClassName }) {
        this.searchInputClassName = searchInputClassName;
    }

    @action.bound editStudy(study) {
        const helper = new CIQ.Studies.DialogHelper(study);
        this.helper = helper;
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Edit ${helper.name}`);

        const attributes = helper.attributes;
        const inputs = helper.inputs.map(inp => ({
            id: inp.name,
            title: t.translate(inp.heading),
            value: inp.value,
            defaultValue: inp.defaultInput,
            type: inp.type === 'checkbox' ? 'switch' : inp.type,
            options: inp.options || null,
            ...attributes[inp.name], // {min:1, max: 20}
            category: 'inputs',
        }));
        const outputs = helper.outputs.map(out => ({
            id: out.name,
            title: t.translate(updateFieldHeading(out.heading, study.sd.type)),
            defaultValue: out.defaultOutput,
            value: out.color,
            type: 'colorpicker',
            category: 'outputs',
        }));
        const parameters = helper.parameters.map(par => {
            const shared = {
                title: t.translate(par.heading),
                ...attributes[par.name],
                category: 'parameters',
            };
            if (par.defaultValue.constructor === Boolean) {
                return {
                    ...shared,
                    id: `${par.name}Enabled`,
                    value: par.value,
                    defaultValue: par.defaultValue,
                    type: 'switch',
                };
            }

            if (par.defaultValue.constructor === Number) {
                return {
                    ...shared,
                    id: par.name,
                    type: 'numbercolorpicker',
                    defaultValue: {
                        Color: par.defaultColor,
                        Value: par.defaultValue,
                    },
                    value: {
                        Color: par.color,
                        Value: par.value,
                    },
                };
            }
            throw new Error('Unrecognised parameter!');
        });

        this.settingsDialog.id = study.sd.type;
        this.settingsDialog.items = [...outputs, ...inputs, ...parameters];
        this.settingsDialog.title = study.sd.libraryEntry.name;
        this.settingsDialog.formTitle = t.translate('Result');
        this.settingsDialog.formClassname = `form--${study.sd.type.toLowerCase().replace(/ /g, '-')}`;
        // TODO:
        // const description = StudyInfo[study.sd.type];
        // this.settingsDialog.description = description || t.translate("No description yet");
        this.settingsDialog.description = '';
        this.settingsDialog.dialogPortalNodeId = this.portalNodeIdChanged;
        this.settingsDialog.setOpen(true);
    }

    @action.bound deleteStudy(study) {
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Remove ${study.name}`);
        if (!study.permanent) {
            // Need to run this in the nextTick because the study legend can be removed by this click
            // causing the underlying chart to receive the mousedown (on IE win7)
            setTimeout(() => {
                CIQ.Studies.removeStudy(this.stx, study);
                this.renderLegend();
            }, 0);
            setTimeout(this.updateIndicatorHeight, 20);
        }
    }

    @action.bound updateStudy(study, items) {
        const updates = {};
        for (const { id, category, value, type } of items) {
            let isChanged;
            if (type === 'numbercolorpicker') {
                isChanged =
                    study[category][`${id}Color`] !== value.Color || study[category][`${id}Value`] !== value.Value;
            } else {
                isChanged = study[category][id] !== value;
            }

            if (isChanged) {
                updates[category] = updates[category] || {};
                if (typeof value === 'object') {
                    for (const suffix in value) {
                        updates[category][`${id}${suffix}`] = value[suffix];
                    }
                } else {
                    updates[category][id] = value;
                }
            }
        }
        if (Object.keys(updates).length === 0) return;

        this.helper.updateStudy(updates);
        this.updateActiveStudies();
        this.stx.draw();
        this.changeStudyPanelTitle(this.helper.sd);
        this.settingsDialog.title = t.translate(this.helper.sd.libraryEntry.name);
    }

    changeStudyPanelTitle(sd) {
        // Remove numbers from the end of indicator titles in mobile
        if (this.mainStore.chart.isMobile) {
            this.stx.panels[sd.panel].display = sd.type;
            this.stx.draw();
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
        const panelsLen = Object.keys(this.stx.panels).length;
        Object.keys(this.stx.panels).forEach((id, index) => {
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
    };

    /**
     * Gets called continually in the draw animation loop.
     * Be careful not to render unnecessarily. */
    renderLegend = () => {
        if (!this.context || !this.shouldRenderLegend()) {
            return;
        }

        this.updateActiveStudies();
        // Temporary prevent user from adding more than 5 indicators
        // All traces can be removed after new design for studies
        this.updateStyle();
    };

    @action.bound setReachedLimit() {
        const hasReachedLimit = this.activeStudies.data.length >= 5;
        this.hasReachedLimits = hasReachedLimit;
    }

    @action.bound updateActiveStudies() {
        const stx = this.stx;
        const activeItems = [];

        Object.keys(stx.layout.studies || []).forEach(id => {
            const sd = stx.layout.studies[id];
            if (sd.customLegend) {
                return;
            }
            const studyObjCategory = getIndicatorsTree().find(category =>
                category.items.find(item => item.id === sd.type)
            );
            const studyObj = studyObjCategory.items.find(item => item.id === sd.type);
            if (studyObj) {
                const nameObj = prepareIndicatorName(sd.name);

                activeItems.push({
                    ...studyObj,
                    id: sd.inputs.id,
                    bars: nameObj.bars,
                    name: nameObj.name,
                    dataObject: {
                        stx,
                        sd,
                        inputs: sd.inputs,
                        outputs: sd.outputs,
                        parameters: sd.parameters,
                    },
                });
            }
        });
        this.activeItems = activeItems;
    }

    @action.bound deletePredictionStudies() {
        const stx = this.stx;
        if (stx) {
            (this.activeItems || [])
                .filter(item => item.isPrediction)
                .forEach(item => {
                    this.deleteStudy(item.dataObject.sd);
                });
            setTimeout(this.updateIndicatorHeight, 20);
        }
    }

    @action.bound deleteAllStudies() {
        const stx = this.stx;
        if (stx) {
            Object.keys(stx.layout.studies || []).forEach(id => {
                this.deleteStudy(stx.layout.studies[id]);
            });
            setTimeout(this.updateIndicatorHeight, 20);
        }
    }

    @action.bound clearStudies() {
        if (this.context) {
            this.context.advertised.Layout.clearStudies();
        }
    }

    @action.bound onStudyRemoved() {
        this.updateActiveStudies();
        setTimeout(this.updateIndicatorHeight, 20);
    }

    @action.bound onSelectTab(tabIndex) {
        this.setFilterText('');
        this.selectedTab = tabIndex;
        this.onInfoItem(null);
    }

    @action.bound setFilterText(filterText) {
        this.selectedTab = filterText !== '' ? 0 : 1;
        this.filterText = filterText;
    }

    @action.bound onInfoItem(study) {
        this.infoItem = study
            ? {
                  ...study,
                  disabledAddBtn: study.isPrediction && this.mainStore.timeperiod.isTick,
              }
            : study;
    }

    @action.bound updatePortalNode(portalNodeId) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
