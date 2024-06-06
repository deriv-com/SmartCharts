import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { ChartTypes, Intervals, STATE } from 'src/Constant';
import { getTimeIntervalName } from 'src/utils';
import MainStore from '.';
import Context from '../components/ui/Context';
import DialogStore from './DialogStore';

export default class MenuStore {
    dialogStore: DialogStore;
    mainStore: MainStore;
    constructor(mainStore: MainStore, options: { route: string }) {
        makeObservable(this, {
            dialogStatus: observable,
            route: observable,
            open: computed,
            setOpen: action.bound,
            onTitleClick: action.bound,
            handleDialogStatus: action.bound,
            handleCloseDialog: action.bound,
        });

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
    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get routingStore() {
        return this.mainStore.routing;
    }
    dialogStatus = false;
    route = '';
    get open() {
        return this.dialogStore.open;
    }
    setOpen(val: boolean) {
        this.dialogStore.setOpen(val);
        /**
         *  Update the url hash by considering the dialog `route` and `open`
         */
        this.routingStore.updateRoute(this.route, val);
    }
    blurInput() {
        setTimeout(this.handleDialogStatus, 300);
    }
    onTitleClick(e: React.MouseEvent) {
        if (e) {
            e.stopPropagation();
        }
        this.setOpen(!this.open);
    }
    handleDialogStatus() {
        if (this.route === 'indicators') {
            this.mainStore.state.stateChange(STATE.INDICATORS_MODAL_TOGGLE, {
                is_open: this.open,
            });
        }
        this.dialogStatus = this.open;
    }
    handleCloseDialog() {
        this.dialogStatus = false;
        setTimeout(() => this.setOpen(false), 300);
    }
}
