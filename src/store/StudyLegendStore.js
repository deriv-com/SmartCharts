import React from 'react';
import { observable, action, when, reaction } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import SettingsDialogStore from './SettingsDialogStore';
import SettingsDialog from '../components/SettingsDialog.jsx';
import Menu from '../components/Menu.jsx';
import { CategoricalDisplay } from '../components/categoricaldisplay';
import SearchInput from '../components/SearchInput.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';
import {
    IndicatorCatMomentumIcon,
    IndicatorCatTrendIcon,
    IndicatorCatVolatilityIcon,
    IndicatorCatAveragesIcon,
    IndicatorCatOtherIcon,
    IndicatorAwesomeOscillatorIcon,
    IndicatorDTrendedIcon,
    IndicatorGatorIcon,
    IndicatorMacdIcon,
    IndicatorRateChangeIcon,
    IndicatorRSIIcon,
    IndicatorStochasticOscillatorIcon,
    IndicatorStochasticMomentumIcon,
    IndicatorWilliamPercentIcon,
    IndicatorAroonIcon,
    IndicatorAdxIcon,
    IndicatorCommodityChannelIndexIcon,
    IndicatorIchimokuIcon,
    IndicatorParabolicIcon,
    IndicatorZigZagIcon,
    IndicatorBollingerIcon,
    IndicatorDonchianIcon,
    IndicatorAveragesIcon,
    IndicatorEnvelopeIcon,
    IndicatorAlligatorIcon,
    IndicatorFractalChaosIcon,
} from '../components/Icons.jsx';

// TODO:
// import StudyInfo from '../study-info';

const getStudyBars = (name, type) => {
    const str = (name.replace(type, '').trim());
    return str.slice(str.indexOf('('));
};

const IndicatorsTree = [
    {
        id: 'momentum',
        name: t.translate('Momentum'),
        icon: IndicatorCatMomentumIcon,
        items: [
            { id: 'Awesome', name: t.translate('Awesome Oscillator'), icon: IndicatorAwesomeOscillatorIcon },
            { id: 'Detrended', name: t.translate('Detrended Price Oscillator'), icon: IndicatorDTrendedIcon },
            { id: 'Gator', name: t.translate('Gator Oscillator'), icon: IndicatorGatorIcon },
            { id: 'macd', name: t.translate('MACD'), icon: IndicatorMacdIcon },
            { id: 'Price ROC', name: t.translate('Rate of Change'), icon: IndicatorRateChangeIcon },
            { id: 'rsi', name: t.translate('Relative Strength Index (RSI)'), icon: IndicatorRSIIcon },
            { id: 'stochastics', name: t.translate('Stochastic Oscillator'), icon: IndicatorStochasticOscillatorIcon },
            { id: 'Stch Mtm', name: t.translate('Stochastic Momentum index'), icon: IndicatorStochasticMomentumIcon },
            { id: 'Williams %R', name: t.translate('William\'s Percent Range'), icon: IndicatorWilliamPercentIcon },
        ],
    },
    {
        id: 'trend',
        name: t.translate('Trend'),
        icon: IndicatorCatTrendIcon,
        items: [
            { id: 'Aroon', name: t.translate('Aroon'), icon: IndicatorAroonIcon },
            { id: 'ADX', name: t.translate('ADX/DMS'), icon: IndicatorAdxIcon },
            { id: 'CCI', name: t.translate('Commodity Channel Index'), icon: IndicatorCommodityChannelIndexIcon },
            { id: 'Ichimoku', name: t.translate('Ichimoku Clouds'), icon: IndicatorIchimokuIcon },
            { id: 'Parabolic', name: t.translate('Parabolic SAR'), icon:  IndicatorParabolicIcon },
            { id: 'ZigZag', name: t.translate('Zig Zag'), icon: IndicatorZigZagIcon },
        ],
    },
    {
        id: 'volatility',
        name: t.translate('Volatility'),
        icon: IndicatorCatVolatilityIcon,
        items: [
            { id: 'Bollinger Bands', name: t.translate('Bollinger Bands'), icon: IndicatorBollingerIcon },
            { id: 'Donchian Channel', name: t.translate('Donchian Channel'), icon: IndicatorDonchianIcon },
        ],
    },
    {
        id: 'moving-averages',
        name: t.translate('Moving averages'),
        icon: IndicatorCatAveragesIcon,
        items: [
            { id: 'ma', name: t.translate('Moving averages'), icon: IndicatorAveragesIcon },
            { id: 'MA Env', name: t.translate('Moving Average Envelope'), icon: IndicatorEnvelopeIcon },
        ],
    },
    {
        id: 'others',
        name: t.translate('Others'),
        icon: IndicatorCatOtherIcon,
        items: [
            { id: 'Alligator', name: t.translate('Alligator'), icon: IndicatorAlligatorIcon },
            { id: 'Fractal Chaos Bands', name: t.translate('Fractal Chaos Band'), icon: IndicatorFractalChaosIcon },
        ],
    },
];

export default class StudyLegendStore {
    constructor(mainStore) {
        this.excludedStudies = {
            Beta: true,
            // volume is not supported in chart
            Klinger: true,
            'Trade Vol': true,
            'Vol ROC': true,
            'Price Vol': true,
            'Pos Vol': true,
            'Neg Vol': true,
            'On Bal Vol': true,
            'Vol Osc': true,
            volume: true,
            'vol undr': true,
            'vol profile': true,
            'W MFI': true,
            EOM: true,
            'Chaikin MF': true,
            Twiggs: true,
            // end volume
            'Aroon Osc': true,
            'Lin R2': true,
            'Lin Fcst': true,
            'Lin Incpt': true,
            'Time Fcst': true,
            'VT Filter': true,
            TRIX: true,
            'STD Dev': true,
            Swing: true,
            'Acc Swing': true,
            'Price ROC': true,
            Momentum: true,
            'Hist Vol': true,
            'Pretty Good': true,
            Ultimate: true,
            'Chaikin Vol': true,
            'Price Osc': true,
            'True Range': true,
            ATR: true,
            'Ehler Fisher': true,
            Schaff: true,
            QStick: true,
            Coppock: true,
            'Chande Mtm': true,
            'Chande Fcst': true,
            'Intraday Mtm': true,
            RAVI: true,
            'Random Walk': true,
            'High Low': true,
            'High-Low': true,
            'Med Price': true,
            'Fractal Chaos': true,
            GAPO: true,
            'Prime Number Bands': true,
            'Prime Number': true,
            HHV: true,
            LLV: true,
            'Mass Idx': true,
            Keltner: true,
            'Elder Ray': true,
            'Elder Force': true,
            'LR Slope': true,
            COG: true,
            'Typical Price': true,
            'Weighted Close': true,
            'M Flow': true,
            'W Acc Dist': true,
            'val lines': true,
            correl: true,
            PMO: true,
            'Rel Vol': true,
            'ATR Bands': true,
            'STARC Bands': true,
            'ATR Trailing Stop': true,
            'Boll BW': true,
            'Boll %b': true,
            'Rel Vig': true,
            'Elder Impulse': true,
            'Pivot Points': true,
            VWAP: true,
            AVWAP: true,
            'P Rel': true,
            'Perf Idx': true,
            Ulcer: true,
            'Bal Pwr': true,
            'Trend Int': true,
            Choppiness: true,
            Disparity: true,
            'Rainbow MA': true,
            'Rainbow Osc': true,
            'Pring KST': true,
            'Pring Sp-K': true,
            Darvas: true,
            Supertrend: true,
            Vortex: true,
            PSY: true,
            'MA Dev': true,
            Shinohara: true,
            'VT HZ Filter': true,
        };
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore(mainStore, { route:'indicators' });
        this.categoricalDisplay = new CategoricalDisplayStore({
            activeOptions: [
                { id: 'edit', onClick: item => this.editStudy(item) },
                { id: 'delete', onClick: item => this.deleteStudy(item) },
            ],
            getIsShown: () => this.menu.open,
            getCategoricalItems: () => this.categorizedStudies,
            getActiveCategory: () => this.activeStudies,
            onSelectItem: this.onSelectItem.bind(this),
            placeholderText: t.translate('"Mass Index" or "Doji Star"'),
            favoritesId: 'indicators',
            mainStore,
            searchInputClassName: () => this.searchInputClassName,
            limitInfo: t.translate('Up to 5 active indicators allowed.'),
        });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: () => this.deleteStudy(this.helper),
            favoritesId: 'indicators',
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
        this.StudyCategoricalDisplay = this.categoricalDisplay.connect(CategoricalDisplay);
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
    @observable hasReachedLimits = false;
    @observable activeStudies = {
        categoryName: t.translate('Active'),
        categoryNamePostfix: '',
        categoryId: 'active',
        hasSubcategory: false,
        emptyDescription: t.translate('There are no active indicators yet.'),
        data: [],
    };

    @observable selectedTab = 1;
    @observable filterText = '';
    @observable activeItems = [];
    @observable infoItem = null;

    get categorizedStudies() {
        return IndicatorsTree.map(indicatorGroup => ({
            categoryName: indicatorGroup.name,
            categoryId: indicatorGroup.id,
            categorySubtitle: t.translate('Up to 5 active indicators allowed.'),
            hasSubcategory: false,
            data: indicatorGroup.items.map(item => ({
                enabled: true,
                display: item.name,
                icon: item.icon,
                dataObject: item.id,
                itemId: item.id,
            })),
        }));
    }


    get items() { return [...IndicatorsTree]; }

    get searchedItems() {
        return [...IndicatorsTree]
            .map((category) => {
                category.foundItems = category.items.filter(item => item.name.toLowerCase().indexOf(this.filterText.toLowerCase().trim()) !== -1);
                return category;
            })
            .filter(category => category.foundItems.length);
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

    @action.bound setReachedLimit() {
        const hasReachedLimit = this.activeStudies.data.length >= 5;
        this.hasReachedLimits = hasReachedLimit;
    }

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
                activeItems.push({
                    ...studyObj,
                    bars: getStudyBars(sd.name, sd.type),
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

        this.activeStudies.data = studies;
        this.activeStudies.categoryNamePostfix = `(${studies.length}/5)`;
        this.setReachedLimit();
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
    }

    @action.bound setFilterText(filterText) {
        this.selectedTab = (filterText !== '') ? 0 : 1;
        this.filterText = filterText;
    }

    @action.bound onInfoItem(study) {
        this.infoItem = study;
    }
}
