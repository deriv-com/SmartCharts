import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';

export default class ChartSettingStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({getContext: () => this.mainStore.chart.context});

        this.restoreSetting();
        // when(() => this.context, this.onContextReady);
        // reaction(() => this.menu.open, this.restoreSetting);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {};

    @observable view = '';
    @observable language = '';
    @observable position = '';
    @observable theme = '';

    restoreSetting() {

        try {
            let setting_string = CIQ.localStorage.getItem('setting'),
                setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

            this.language = setting.language;
            this.position = setting.position;
            this.theme = setting.theme;

        }catch (e){

        }
    }

    saveSetting() {
        CIQ.localStorageSetItem(`setting`, JSON.stringify({
            language: this.language,
            position: this.position,
            theme: this.theme
        }));
    }


    @action.bound setLanguage(lng) {
        this.language = lng;

        this.saveSetting();

        window.location.reload();
    }


    @computed get hasActiveView() {
        return this.view !== '' ? true : false;
    }

    @action.bound clearView() {
        this.view = '';
    }

    @computed get isViewLanguage() {
        return this.view === 'language';
    }

    @action.bound onViewLanguage() {
        this.view = 'language';
    }

}


