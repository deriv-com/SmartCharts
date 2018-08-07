import React from 'react';
import { observable, action } from 'mobx';
import MenuStore from './MenuStore';
import { FlagIcons } from '../components/Icons.jsx';

export default class ChartSettingStore {
    constructor(mainStore) {
        this.defaultLanguage = this.languages[0];
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'setting' });
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    languages = [
        {
            key: 'en',
            name: 'English',
            icon: <FlagIcons.USD />,
        }, {
            key: 'pt',
            name: 'Português',
            icon: <FlagIcons.Portugal />,
        }, {
            key: 'de',
            name: 'Deutsch',
            icon: <FlagIcons.German />,
        }, {
            key: 'ru',
            name: 'Русский',
            icon: <FlagIcons.Russia />,
        }, {
            key: 'fr',
            name: 'French',
            icon: <FlagIcons.French />,
        }, {
            key: 'th',
            name: 'Thai',
            icon: <FlagIcons.Thailand />,
        }, {
            key: 'id',
            name: 'Indonesia',
            icon: <FlagIcons.Indonesia />,
        }, {
            key: 'vi',
            name: 'Tiếng Việt',
            icon: <FlagIcons.Vietnam />,
        }, {
            key: 'it',
            name: 'Italiano',
            icon: <FlagIcons.Italy />,
        }, {
            key: 'zh_cn',
            name: '简体中文',
            icon: <FlagIcons.Chinese />,
        }, {
            key: 'pl',
            name: 'Polish',
            icon: <FlagIcons.Poland />,
        }, {
            key: 'zh_tw',
            name: '繁體中文',
            icon: <FlagIcons.ChineseTraditional />,
        },
    ];
    defaultLanguage = {};
    onSettingsChange;
    @observable assetInformation = true;
    @observable view = '';
    @observable language = this.languages[0];
    @observable position = 'bottom';
    @observable theme = 'light';
    @observable countdown = false;

    @action.bound setSettings(settings) {
        if (settings === undefined) { return; }
        const { theme, position, countdown, language, assetInformation } = settings;
        if (theme            !== undefined) { this.setTheme(theme); }
        if (position         !== undefined) { this.setPosition(position); }
        if (countdown        !== undefined) { this.showCountdown(countdown); }
        if (language         !== undefined) { this.setLanguage(language); }
        if (assetInformation !== undefined) { this.setAssetInformation(assetInformation); }
    }

    saveSetting() {
        if (this.onSettingsChange) {
            this.onSettingsChange({
                language: this.language.key,
                position: this.position,
                theme: this.theme,
                countdown: this.countdown,
                assetInformation: this.assetInformation,
            });
        }
    }

    @action.bound setView(view) {
        this.view = view || '';
    }

    @action.bound setLanguage(lng) {
        if (lng === this.language.key) { return; }
        this.language = this.languages.find(item => item.key === lng);
        t.setLanguage(lng);
        this.saveSetting();
    }

    @action.bound setTheme(theme) {
        if (this.theme === theme) { return; }
        this.theme = theme;
        if (this.context) { this.stx.clearStyles(); }
        this.saveSetting();
    }

    @action.bound setPosition(value) {
        if (this.position === value) { return; }
        this.position = value;
        if (this.context) { this.stx.clearStyles(); }
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

    @action.bound setAssetInformation(value) {
        if (this.assetInformation === value) { return; }
        this.assetInformation = value;
        this.saveSetting();
    }

    @action.bound showCountdown(value) {
        if (this.countdown === value) { return; }
        this.countdown = value;
        this.mainStore.timeperiod.showCountdown(value);
        this.saveSetting();
    }
}
