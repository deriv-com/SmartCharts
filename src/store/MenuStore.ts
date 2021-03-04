import { action, computed, reaction, observable } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Dialog.jsx' was resolved to ... Remove this comment to see the full error message
import Dialog from '../components/Dialog.jsx';
export default class MenuStore {
    DropDownDialog: any;
    dialog: any;
    mainStore: any;
    constructor(mainStore: any, options: any) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
        reaction(() => this.open, () => this.blurInput());
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
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    dialogStatus = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    route = '';
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get open() {
        return this.dialog.open;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setOpen(val: any) {
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
            (document.activeElement as any).blur();
            stx.modalEnd();
        }
        else {
            stx.modalBegin();
        }
        stx.allowZoom = !this.open;
        if (!this.open) {
            this.mainStore.state.setEnableScroll();
        }
        else {
            this.mainStore.state.setDisableScroll();
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onTitleClick(e: any) {
        if (e) {
            e.stopPropagation();
        }
        this.setOpen(!this.open);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    handleDialogStatus() {
        this.dialogStatus = this.open;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    handleCloseDialog() {
        this.dialogStatus = false;
        setTimeout(() => this.setOpen(false), 300);
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(({ chart: c, chartSetting }: any) => ({
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
