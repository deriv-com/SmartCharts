import { computed, action, observable, makeObservable } from 'mobx';
import MainStore from '.';
import MenuStore from './MenuStore';

export default class IndicatorPredictionDialogStore {
    dialogPortalNodeId?: string;
    mainStore: MainStore;
    menuStore: MenuStore;
    scrollPanel?: HTMLElement;

    constructor({ mainStore }: { mainStore: MainStore }) {
        makeObservable(this, {
            dialogPortalNodeId: observable,
            open: computed,
            setOpen: action.bound,
            handleCancel: action.bound,
            handleContinue: action.bound
        });

        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'indicator-setting' });
    }

    get open() {
        return this.menuStore.open;
    }

    setOpen(value: boolean) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menuStore.setOpen(value);
    }

    handleCancel() {
        this.setOpen(false);
    }

    handleContinue() {
        this.mainStore.studies.deletePredictionStudies();
        setTimeout(() => {
            this.mainStore.timeperiod.changeGranularity(0);
            this.handleCancel();
        }, 100);
    }
}
