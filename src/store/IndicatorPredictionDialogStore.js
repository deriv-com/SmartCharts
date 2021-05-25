import { computed, action, observable } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import Menu from '../components/Menu.jsx';

export default class IndicatorPredictionDialogStore {
    @observable dialogPortalNodeId = null;

    constructor({ mainStore }) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'indicator-setting' });
        this.SettingDialogMenu = this.menu.connect(Menu);
    }

    @computed get open() {
        return this.menu.open;
    }

    @action.bound setOpen(value) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menu.setOpen(value);
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

    connect = connect(() => ({
        onCancel: this.handleCancel,
        onContinue: this.handleContinue,
        Dialog: this.SettingDialogMenu,
        dialogPortalNodeId: this.dialogPortalNodeId,
    }));
}
