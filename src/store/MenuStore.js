import { observable, action, computed, reaction } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

const allMenues = [];

export default class MenuStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore();
        reaction(() => this.open, () => this.blurInput());
        allMenues.push(this);
    }

    get context() { return this.mainStore.chart.context; }

    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(val) { this.dialog.setOpen(val); }

    blurInput() {
        if(this.open === false) {
            document.activeElement.blur();
            this.context.stx.modalEnd();
        } else {
            this.context.stx.modalBegin();
        }
    }

    @action.bound onTitleClick(e) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
        this.setOpen(!this.open);
    }

    connect = connect(() => ({
        open: this.open,
        onTitleClick: this.onTitleClick,
        DropdownDialog: this.dialog.connect(Dialog),
    }))
}
