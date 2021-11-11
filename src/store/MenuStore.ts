import { action, computed, reaction, observable } from 'mobx';
import { connect, TReactComponent } from './Connect';
import DialogStore from './DialogStore';
import { TDialogProps } from '../components/Dialog';
import MainStore from '.';
import ChartStore from './ChartStore';
import Context from '../components/ui/Context';

type TDropdownDialog = TReactComponent<Partial<TDialogProps | ChartStore> & { isFullscreen: boolean }>

export default class MenuStore {
    dialogStore: DialogStore;
    mainStore: MainStore;
    constructor(mainStore: MainStore, options: { route: string}) {
        this.mainStore = mainStore;
        this.dialogStore = new DialogStore(mainStore);
        reaction(
            () => this.open,
            () => this.blurInput()
        );
        if (options && options.route) {
            this.route = options.route;
        }
    }
    get context(): Context {
        return this.mainStore.chart.context;
    }
    get routingStore() {
        return this.mainStore.routing;
    }
    @observable
    dialogStatus = false;
    @observable
    route = '';
    @computed
    get open() {
        return this.dialogStore.open;
    }
    @action.bound
    setOpen(val: boolean) {
        this.dialogStore.setOpen(val);
        /**
         *  Update the url hash by considering the dialog `route` and `open`
         */
        this.routingStore.updateRoute(this.route, val);
    }
    blurInput() {
        const stx: Context["stx"] = this.context.stx;
        setTimeout(this.handleDialogStatus, 300);
        if (this.open === false) {
            (document.activeElement as HTMLElement).blur();
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
    @action.bound
    onTitleClick (e: React.MouseEvent) {
        if (e) {
            e.stopPropagation();
        }
        this.setOpen(!this.open);
    }
    @action.bound
    handleDialogStatus() {
        this.dialogStatus = this.open;
    }
    @action.bound
    handleCloseDialog() {
        this.dialogStatus = false;
        setTimeout(() => this.setOpen(false), 300);
    }
    connect = connect(({ chart: c, chartSetting }: MainStore) => ({
        ready: c.context,
        setOpen: this.setOpen,
        open: this.open,
        dialogStatus: this.dialogStatus,
        onTitleClick: this.onTitleClick,
        handleCloseDialog: this.handleCloseDialog,
        dialogStore: this.dialogStore,
        isMobile: c.isMobile,
        shouldRenderDialogs: c.shouldRenderDialogs,
        theme: chartSetting.theme,
    }));
}

export type TMenuStoreConnectedProps = {
    ready: boolean;
    setOpen: (val: boolean) => void;
    open: boolean;
    dialogStatus: boolean;
    onTitleClick: (e: React.MouseEvent) => void;
    handleCloseDialog: () => void;
    DropdownDialog: TDropdownDialog;
    isMobile: boolean;
    shouldRenderDialogs: boolean;
    theme: string;
};