import { observable, action, when } from 'mobx';
import MenuStore from './MenuStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Constant.js' was resolved to '/Users/ba... Remove this comment to see the full error message
import { Languages } from '../Constant.js';
export default class ChartSettingStore {
    ChartSettingMenu: any;
    mainStore: any;
    menu: any;
    constructor(mainStore: any) {
        this.defaultLanguage = this.languages[0];
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'setting' });
        this.ChartSettingMenu = this.menu.connect(Menu);
        when(() => this.context, () => {
            this.setSettings(mainStore.state.settings);
        });
    }
    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    languages = [];
    defaultLanguage = {};
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'onSettingsChange' implicitly has an 'any' ... Remove this comment to see the full error message
    onSettingsChange;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    language = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    position = 'bottom';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    theme = 'light';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    countdown = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    historical = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isAutoScale = true;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isHighestLowestMarkerEnabled = true;
    setSettings(settings: any) {
        if (settings === undefined) {
            return;
        }
        const { countdown, historical, language, position, isAutoScale, isHighestLowestMarkerEnabled, theme, activeLanguages, } = settings;
        if (!((!activeLanguages && Languages.every((x: any) => this.languages.find(y => (y as any).key === x.key))) ||
            (activeLanguages &&
                this.languages.length === activeLanguages.length &&
                this.languages.every(x => activeLanguages.indexOf((x as any).key.toUpperCase()) !== -1)))) {
            this.updateActiveLanguage(activeLanguages);
        }
        if (theme !== undefined) {
            this.setTheme(theme);
        }
        if (position !== undefined) {
            this.setPosition(position);
        }
        if (countdown !== undefined) {
            this.showCountdown(countdown);
        }
        if (language !== undefined) {
            this.setLanguage(language);
        }
        if (historical !== undefined) {
            this.setHistorical(historical);
        }
        if (isAutoScale !== undefined) {
            this.setAutoScale(isAutoScale);
        }
        if (isHighestLowestMarkerEnabled !== undefined) {
            this.toggleHighestLowestMarker(isHighestLowestMarkerEnabled);
        }
    }
    saveSetting() {
        if (this.onSettingsChange) {
            this.onSettingsChange({
                countdown: this.countdown,
                historical: this.historical,
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                language: this.language.key,
                position: this.position,
                isAutoScale: this.isAutoScale,
                isHighestLowestMarkerEnabled: this.isHighestLowestMarkerEnabled,
                theme: this.theme,
            });
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateActiveLanguage(activeLanguages: any) {
        if (activeLanguages) {
            this.languages = activeLanguages
                .map((lngKey: any) => Languages.find((lng: any) => lng.key.toUpperCase() === lngKey) || null)
                .filter((x: any) => x);
        }
        else
            this.languages = Languages;
        // set default language as the first item of active languages or Eng
        this.defaultLanguage = this.languages[0];
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if ((this.language && !this.languages.find(x => (x as any).key === this.language.key)) || !this.language) {
            this.setLanguage((this.languages[0] as any).key);
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setLanguage(lng: any) {
        if (!this.languages.length) {
            return;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.language && lng === this.language.key) {
            return;
        }
        // @ts-expect-error ts-migrate(2322) FIXME: Type '{}' is not assignable to type 'null'.
        this.language = this.languages.find(item => (item as any).key === lng) || this.defaultLanguage;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        t.setLanguage(this.language.key);
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, `Change language to ${this.language.key}`);
        this.saveSetting();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setTheme(theme: any) {
        if (this.theme === theme) {
            return;
        }
        this.theme = theme;
        if (this.context) {
            this.mainStore.state.setChartTheme(theme);
            this.mainStore.crosshair.setFloatPriceLabelStyle(theme);
        }
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, `Change theme to ${theme}`);
        this.saveSetting();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setPosition(value: any) {
        if (this.position === value) {
            return;
        }
        this.position = value;
        if (this.context) {
            this.stx.clearStyles();
        }
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, 'Change Position');
        this.saveSetting();
        /**
         * Chart should fix its height & width after the position changed,
         * for that purpose we stay some 10 ms so that position varaible update
         * on chart context then ask chart to update itself hight & width
         */
        setTimeout(() => {
            this.mainStore.chart.resizeScreen();
        }, 10);
        this.menu.setOpen(false);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    showCountdown(value: any) {
        if (this.countdown === value) {
            return;
        }
        this.countdown = value;
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, `${value ? 'Show' : 'Hide'} Countdown`);
        this.saveSetting();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setHistorical(value: any) {
        if (this.historical === value) {
            return;
        }
        this.historical = value;
        this.isHighestLowestMarkerEnabled = !value;
        this.saveSetting();
        /**
         * Chart should fix its height & width after the position changed,
         * for that purpose we stay some 10 ms so that position varaible update
         * on chart context then ask chart to update itself hight & width
         */
        setTimeout(() => {
            this.mainStore.chart.resizeScreen();
        }, 10);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setAutoScale(value: any) {
        if (this.isAutoScale === value) {
            return;
        }
        this.isAutoScale = value;
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, ` Change AutoScale to ${value}`);
        this.saveSetting();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    toggleHighestLowestMarker(value: any) {
        if (this.isHighestLowestMarkerEnabled === value) {
            return;
        }
        this.isHighestLowestMarkerEnabled = value;
        logEvent(LogCategories.ChartControl, LogActions.ChartSetting, ` ${value ? 'Show' : 'Hide'} HighestLowestMarker.`);
        this.saveSetting();
    }
}
