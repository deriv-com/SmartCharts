import { computed, action } from 'mobx';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';
import { connect } from '../store/Connect';

export default class AlertDialogStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.dialog = new DialogStore(mainStore);
    }

    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(val) {
        this.dialog.setOpen(val,false); 
    }
   
    connect = connect(() => ({
        onClose: () => { this.setOpen(false) },
        Dialog: this.dialog.connect(Dialog),
    }));
}