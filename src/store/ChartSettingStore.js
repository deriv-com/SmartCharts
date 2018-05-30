import React from 'react';
import { observable, action, computed } from 'mobx';
import MenuStore from './MenuStore';
import { createObjectFromLocalStorage } from '../utils';
import { FlagIcons } from './../components/Icons.jsx';

export default class ChartSettingStore {
    constructor(mainStore) {
        this.defaultLanguage = this.languages[0];
        this.mainStore = mainStore;
        this.menu = new MenuStore({ getContext: () => this.mainStore.chart.context });
        this.restoreSetting();
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {};
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
            key: 'ja',
            name: '日本語',
            icon: <FlagIcons.Japan />,
        }, {
            key: 'zh_tw',
            name: '繁體中文',
            icon: <FlagIcons.ChineseTraditional />,
        }, {
            key: 'pl',
            name: 'Polish',
            icon: <FlagIcons.Poland />,
        },
    ];
    defaultLanguage = {};
    @observable view = '';
    @observable language = '';
    @observable position = '';
    @observable theme = '';
    @observable candleCountdown = false;

    restoreSetting() {
        const setting = createObjectFromLocalStorage('smartchart-setting');

        if (setting) {
            /**
             * Language
             * check language in the list
             * if not exits set default that is `en`
             */
            const language = this.languages.find(item => item.key === setting.language);
            if (language) {
                this.language = language;
            } else {
                this.language = this.defaultLanguage;
            }
            this.position = setting.position === 'bottom' ? 'bottom' : 'left';
            this.theme = setting.theme === 'light' ? 'light' : 'dark';
            this.candleCountdown = setting.candleCountdown;
        } else {
            this.language = this.defaultLanguage;
            this.position = 'bottom';
            this.theme = 'light';
            this.candleCountdown = false;
        }
    }

    saveSetting() {
        CIQ.localStorageSetItem('smartchart-setting', JSON.stringify({
            language: this.language.key,
            position: this.position,
            theme: this.theme,
            candleCountdown :this.candleCountdown,
        }));
    }

    @action.bound setView(view) {
        this.view = view || '';
    }

    @action.bound setLanguage(lng) {
        this.language = lng;
        this.saveSetting();
        window.location.reload();
    }

    @computed get getLanguage() {
        return this.language ? this.language : this.defaultLanguage;
    }

    @action.bound setTheme(value) {
        this.theme = value ? 'dark' : 'light';
        this.stx.clearStyles();
        this.saveSetting();
    }

    @action.bound showCandleCountdown(value) {
        this.candleCountdown = value;
        this.mainStore.timeperiod.showCandleCountdown(value);
        this.saveSetting();
    }
}

