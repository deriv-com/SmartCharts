import React from 'react';
import { observable } from 'mobx';

export default class ChartPropsStore {
    constructor(mainStore) {
        this.defaultLanguage = { key: 'en', name: 'English'};
        this.mainStore = mainStore;
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {};

    defaultLanguage = {};
    @observable view = '';
    @observable language = '';
    @observable position = '';
    @observable theme = '';
    @observable countdown = false;
    @observable assetInformation = false;

    restoreSetting() {
        const setting = this.mainStore.chart.settings;
        this.isMobile = this.mainStore.chart.isMobile;
        this.view = '';
        if (setting) {
            if (setting.language) {
                this.language = setting.language;
            } else {
                this.language = this.defaultLanguage;
            }
            this.position = setting.position || 'bottom';
            this.theme = setting.theme || 'light';
            this.countdown = setting.countdown;
            this.assetInformation = this.mainStore.assetInformation.visible;
        } else {
            this.language = this.defaultLanguage;
            this.position = 'bottom';
            this.theme = 'light';
            this.countdown = false;
            this.assetInformation = true;
        }
    }

    setLanguage = (lng) => {
        this.language = lng;
        window.location.reload();
    }

    setTheme = (value) => {
        this.theme = value ? 'dark' : 'light';
        this.stx.clearStyles();
    }
  
    setPosition = (value) => {
        this.position = value;
        this.mainStore.chart.stxx.clearStyles();
        this.mainStore.chart.updateHeight(value);
    }
   
    setCountdown = (value) => {
        this.countdown = value;
        this.mainStore.timeperiod.showCountdown(value);
    }

    setAssetInformation(value)
    {
        this.assetInformation = value;
        this.mainStore.assetInformation.setVisible(value);
    }
}