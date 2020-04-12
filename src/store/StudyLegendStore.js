import React from 'react';
import { observable, action, when, reaction } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';
import SettingsDialog from '../components/SettingsDialog.jsx';
import Menu from '../components/Menu.jsx';
import SearchInput from '../components/SearchInput.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';
import {
    IndicatorCatTrendLightIcon,
    IndicatorCatTrendDarkIcon,
} from '../components/Icons.jsx';
import { IndicatorsTree, ExcludedStudies } from '../Constant';

// TODO:
// import StudyInfo from '../study-info';

const StudyNameRegex = /[^a-z0-9 \-\%\,\)\(]/gi; /* eslint-disable-line */
const getStudyBars = (name, type) => name.replace(StudyNameRegex, '').trim().replace(type.trim(), '').trim();
const capitalizeFirstLetter = (string) => {
    const str = string.replace(StudyNameRegex, '');
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default class StudyLegendStore {
    constructor(mainStore) {
        this.excludedStudies = ExcludedStudies;
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore(mainStore, { route:'indicators' });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: () => this.deleteStudy(this.helper),
            favoritesId: 'indicators',
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
        this.StudyMenu = this.menu.connect(Menu);
        this.StudySettingsDialog = this.settingsDialog.connect(SettingsDialog);

        this.searchInput = React.createRef();
        this.SearchInput = connect(() => ({
            placeholder: 'Search',
            value: this.filterText,
            onChange: this.setFilterText,
            searchInput: this.searchInput,
            searchInputClassName: 'searchInputClassName',
        }))(SearchInput);

        reaction(() => this.menu.open, () => {
            if (!this.menu.open) {
                this.setFilterText('');
            }
            setTimeout(() => {
                if (this.searchInput && this.searchInput.current) this.searchInput.current.focus();
            }, 200);
        });
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.callbacks.studyOverlayEdit = this.editStudy;
        this.stx.callbacks.studyPanelEdit = this.editStudy;

        // to remove studies if user has already more than 5
        // and remove studies which are excluded
        this.removeExtraStudies();
        this.stx.append('createDataSet', this.renderLegend);
        this.stx.append('drawPanels', () => {
            const panelsLen = Object.keys(this.stx.panels).length;
            Object.keys(this.stx.panels).forEach((id, index) => {
                if (index !== 0) {
                    const panelObj = this.stx.panels[id];
                    const sd = this.stx.layout.studies[id];
                    if (sd) {
                        panelObj.title.innerHTML = `${sd.type} <span class="bars">${getStudyBars(sd.name, sd.type)}</span>`;

                        // Regarding the ChartIQ.js, codes under Line 34217, edit function
                        // not mapped, this is a force to map edit function for indicators
                        if (sd.editFunction) { this.stx.setPanelEdit(panelObj, sd.editFunction); }
                    }

                    if (index === 1) {
                        // Hide the up arrow from first indicator to prevent user
                        // from moving the indicator panel above the main chart
                        panelObj.up.style.display = 'none';
                    }
                    if (index === (panelsLen - 1)) {
                        panelObj.down.style.display = 'none';
                    }
                }
            });
        });
        this.renderLegend();
    };

    previousStudies = { };
    searchInputClassName;
    @observable selectedTab = 1;
    @observable filterText = '';
    @observable activeItems = [];
    @observable infoItem = null;
    @observable portalNodeIdChanged;

    get items() {
        return [...IndicatorsTree].map((indicator) => {
            // the only icon which is different on light/dark is trend
            if (indicator.id === 'trend') {
                indicator.icon = this.mainStore.chartSetting.theme === 'light' ? IndicatorCatTrendLightIcon : IndicatorCatTrendDarkIcon;
            }

            return indicator;
        });
    }

    get searchedItems() {
        return [...IndicatorsTree]
            .map((category) => {
                category.foundItems = category.items.filter(item => item.name.toLowerCase().indexOf(this.filterText.toLowerCase().trim()) !== -1);
                return category;
            })
            .filter(category => category.foundItems.length);
    }

    get chartActiveStudies() {
        return (this.activeItems || []).filter(item => item.dataObject.sd.panel === 'chart');
    }

    @action.bound removeExtraStudies() {
        if (this.stx.layout && this.stx.layout.studies) {
            Object.keys(this.stx.layout.studies).forEach((study, idx) => {
                const type = this.stx.layout.studies[study].type;
                if (idx >= 5 || this.excludedStudies[type]) {
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
        if (this.stx.layout && Object.keys(this.stx.layout.studies || []).length < 5) {
            const sd = CIQ.Studies.addStudy(this.stx, item);
            this.changeStudyPanelTitle(sd);
            logEvent(LogCategories.ChartControl, LogActions.Indicator, `Add ${item}`);
            this.menu.setOpen(false);
        }
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
            title: t.translate(out.heading),
            defaultValue: out.defaultOutput,
            value: out.color,
            type: 'colorpicker',
            category: 'outputs',
        }));
        const parameters = helper.parameters.map((par) => {
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
        this.settingsDialog.title = t.translate(study.sd.libraryEntry.name);
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
        }
    }
    @action.bound updateStudy(study, items) {
        const updates = { };
        for (const { id, category, value, type } of items) {
            let isChanged;
            if (type === 'numbercolorpicker') {
                isChanged = study[category][`${id}Color`] !== value.Color
                    || study[category][`${id}Value`] !== value.Value;
            } else {
                isChanged = study[category][id] !== value;
            }

            if (isChanged) {
                updates[category] = updates[category] || { };
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
        if (!stx.layout.studies) { return false; }

        // Logic to determine if the studies have changed, otherwise don't re-create the legend
        if (CIQ.objLength(this.previousStudies) === CIQ.objLength(stx.layout.studies)) {
            let foundAChange = false;
            for (const id in stx.layout.studies) {
                if (!this.previousStudies[id]) {
                    foundAChange = true;
                    break;
                }
            }
            if (!foundAChange) { return false; }
        }

        this.previousStudies = CIQ.shallowClone(stx.layout.studies);
        return true;
    }

    /**
     * Gets called continually in the draw animation loop.
     * Be careful not to render unnecessarily. */
    renderLegend = () => {
        if (!this.shouldRenderLegend()) { return; }

        this.updateActiveStudies();
        // Temporary prevent user from adding more than 5 indicators
        // All traces can be removed after new design for studies
        this.updateStyle();
    };

    @action.bound updateActiveStudies() {
        const stx = this.stx;
        const studies = [];
        const activeItems = [];
        Object.keys(stx.layout.studies || []).forEach((id) => {
            const sd = stx.layout.studies[id];
            if (sd.customLegend) { return; }
            const studyObjCategory = IndicatorsTree.find(category => category.items.find(item => item.id === sd.type));
            const studyObj = studyObjCategory.items.find(item => item.id === sd.type);
            if (studyObj) {
                const bars = getStudyBars(sd.name, sd.type);
                const name = this.mainStore.chart.isMobile ? t.translate(sd.libraryEntry.name) : sd.inputs.display;

                activeItems.push({
                    ...studyObj,
                    bars,
                    name: capitalizeFirstLetter(name.replace(bars, '')),
                    dataObject: {
                        stx,
                        sd,
                        inputs: sd.inputs,
                        outputs: sd.outputs,
                        parameters: sd.parameters,
                    },
                });
            }

            studies.push({
                enabled: true,
                display:this.mainStore.chart.isMobile ? t.translate(sd.libraryEntry.name) : sd.inputs.display,
                dataObject: {
                    stx,
                    sd,
                    inputs: sd.inputs,
                    outputs: sd.outputs,
                    parameters: sd.parameters,
                },
            });
        });

        this.activeItems = activeItems;
    }

    @action.bound deleteAllStudies() {
        const stx = this.stx;
        if (stx) {
            Object.keys(stx.layout.studies || []).forEach((id) => {
                this.deleteStudy(stx.layout.studies[id]);
            });
        }
    }

    @action.bound clearStudies() {
        if (this.context) {
            this.context.advertised.Layout.clearStudies();
        }
    }

    @action.bound onSelectTab(tabIndex) {
        this.selectedTab = tabIndex;
        this.onInfoItem(null);
    }

    @action.bound setFilterText(filterText) {
        this.selectedTab = (filterText !== '') ? 0 : 1;
        this.filterText = filterText;
    }

    @action.bound onInfoItem(study) {
        this.infoItem = study;
    }

    @action.bound updatePortalNode(portalNodeId) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
