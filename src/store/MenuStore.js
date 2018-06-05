import { action, computed, reaction, observable } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

export default class MenuStore {
    constructor(mainStore) {
        this.getContext = () => mainStore.chart.context;
        this.dialog = new DialogStore(mainStore);
        reaction(() => this.open, () => this.blurInput());
    }

    get context() { return this.getContext(); }

    @observable tag = '';
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

    @action.bound setTag(tag) { this.tag = tag; }


    @action.bound onTitleClick(e) {
        if (e) {
            e.stopPropagation();
        }
        if (!this.open && this.tag) {
            window.location.hash = '';
            window.location.hash = this.tag;
        } else if (this.open && this.tag) {
            window.location.hash = '';
        }

        this.setOpen(!this.open);
    }

    connect = connect(() => ({
        setOpen: this.setOpen,
        open: this.open,
        onTitleClick: this.onTitleClick,
        DropdownDialog: this.dialog.connect(Dialog),
    }))
}
