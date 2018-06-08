import { action, computed, reaction, observable } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

export default class MenuStore {
    constructor(mainStore, options) {
        this.mainStore = mainStore;
        this.getContext = () => mainStore.chart.context;
        this.dialog = new DialogStore(mainStore);
        reaction(() => this.open, () => this.blurInput());
        if (options && options.route) { this.route = options.route; }
    }

    get context() { return this.getContext(); }
    get routingStore() {
        return this.mainStore.routing;
    }

    @observable route = '';
    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(val) { this.dialog.setOpen(val); }

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
        /**
         *  Update the url hash by considering the dialog `route` and `open`
         */
        this.routingStore.updateRoute(this.route, this.open);
    }

    connect = connect(() => ({
        setOpen: this.setOpen,
        open: this.open,
        onTitleClick: this.onTitleClick,
        DropdownDialog: this.dialog.connect(Dialog),
    }))
}
