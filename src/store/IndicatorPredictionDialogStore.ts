import { computed, action, observable } from 'mobx';
import MainStore from '.';
import MenuStore from './MenuStore';

export default class IndicatorPredictionDialogStore {
    @observable dialogPortalNodeId?: string;
    mainStore: MainStore;
    menuStore: MenuStore;
    scrollPanel?: HTMLElement;

    constructor({ mainStore }: { mainStore: MainStore }) {
        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'indicator-setting' });
    }

    @computed get open() {
        return this.menuStore.open;
    }

    @action.bound setOpen(value: boolean) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menuStore.setOpen(value);
    }

    @action.bound handleCancel() {
        this.setOpen(false);
    }

    @action.bound handleContinue() {
        this.mainStore.studies.deletePredictionStudies();
        setTimeout(() => {
            this.mainStore.timeperiod.changeGranularity(0);
            this.handleCancel();
        }, 100);
    }
}
