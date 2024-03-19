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
            handleContinue: action.bound,
            setHandleCancel: action,
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleCancel() {
        this.setOpen(false);
    }

    setHandleCancel(newHandleCancel: () => void) {
        this.handleCancel = newHandleCancel.bind(this);
    }

    handleContinue() {
        this.mainStore.timeperiod.setGranularity(0);
        this.mainStore.studies.deletePredictionStudies();
        setTimeout(() => {
            this.setOpen(false);
        }, 100);
    }
}
