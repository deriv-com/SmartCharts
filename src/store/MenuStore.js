import { action, computed, reaction, observable, when } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

export default class MenuStore {
    constructor(mainStore, options) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
        reaction(() => this.open, () => this.blurInput());
        when(() => this.mainStore.chart.context, this.onContextReady);
        if (options && options.route) { this.route = options.route; }
        this.DropDownDialog = this.dialog.connect(Dialog);
    }

    get context() { return this.mainStore.chart.context; }

    onContextReady = () => {
        this.modalNode = this.mainStore.chart.modalNode;
    };

    get routingStore() {
        return this.mainStore.routing;
    }

    @observable modalNode = null;
    @observable route = '';
    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(val) {
        this.dialog.setOpen(val);
        /**
         *  Update the url hash by considering the dialog `route` and `open`
         */
        this.routingStore.updateRoute(this.route, val);
    }

    blurInput() {
        const stx = this.context.stx;
        if (this.open === false) {
            document.activeElement.blur();
            stx.modalEnd();
        } else {
            stx.modalBegin();
        }

        stx.allowScroll = stx.allowZoom = !this.open;
    }


    @action.bound onTitleClick(e) {
        if (e) {
            e.stopPropagation();
        }
        this.setOpen(!this.open);
    }

    connect = connect(() => ({
        setOpen: this.setOpen,
        open: this.open,
        onTitleClick: this.onTitleClick,
        DropdownDialog: this.DropDownDialog,
        modalNode: this.modalNode,
        isMobile: this.mainStore.chart.isMobile,
    }))
}
