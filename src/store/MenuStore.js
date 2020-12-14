import { action, computed, reaction, observable } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

export default class MenuStore {
    constructor(mainStore, options) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
        reaction(
            () => this.open,
            () => this.blurInput()
        );
        if (options && options.route) {
            this.route = options.route;
        }
        this.DropDownDialog = this.dialog.connect(Dialog);
    }

    get context() {
        return this.mainStore.chart.context;
    }

    get routingStore() {
        return this.mainStore.routing;
    }

    @observable dialogStatus = false;
    @observable route = '';
    @computed get open() {
        return this.dialog.open;
    }
    @action.bound setOpen(val) {
        this.dialog.setOpen(val);
        /**
         *  Update the url hash by considering the dialog `route` and `open`
         */
        this.routingStore.updateRoute(this.route, val);
    }

    blurInput() {
        const stx = this.context.stx;
        setTimeout(this.handleDialogStatus, 300);

        if (this.open === false) {
            document.activeElement.blur();
            stx.modalEnd();
        } else {
            stx.modalBegin();
        }

        stx.allowZoom = !this.open;

        if (!this.open) {
            this.mainStore.state.setEnableScroll();
        } else {
            this.mainStore.state.setDisableScroll();
        }
    }

    @action.bound onTitleClick(e) {
        if (e) {
            e.stopPropagation();
        }
        this.setOpen(!this.open);
    }

    @action.bound handleDialogStatus() {
        this.dialogStatus = this.open;
    }

    @action.bound handleCloseDialog() {
        this.dialogStatus = false;
        setTimeout(() => this.setOpen(false), 300);
    }

    connect = connect(({ chart: c, chartSetting }) => ({
        ready: c.context,
        setOpen: this.setOpen,
        open: this.open,
        dialogStatus: this.dialogStatus,
        onTitleClick: this.onTitleClick,
        handleCloseDialog: this.handleCloseDialog,
        DropdownDialog: this.DropDownDialog,
        isMobile: c.isMobile,
        shouldRenderDialogs: c.shouldRenderDialogs,
        theme: chartSetting.theme,
    }));
}
