import { action, computed, reaction } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

const allMenues = [];

export default class MenuStore {
    constructor({ getContext }) {
        this.getContext = getContext;
        this.dialog = new DialogStore();
        reaction(() => this.open, () => this.blurInput());
        allMenues.push(this);
    }

    get context() { return this.getContext(); }

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
    }

    connect = connect(() => ({
        setOpen: this.setOpen,
        open: this.open,
        onTitleClick: this.onTitleClick,
        DropdownDialog: this.dialog.connect(Dialog),
    }))
}
