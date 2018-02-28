import { observable, action, computed, reaction } from 'mobx';
import { connect } from './Connect';

const allDialogs = [];

export default class DialogStore {
    constructor() {
        allDialogs.push(this);
    }

    @observable open = false;

    @action.bound setOpen(val) {
        this.open = val;
        if(this.open === true) { // close others.
            allDialogs.filter(m => m !== this).forEach(m => m.setOpen(false));
        }
    }

    handleClickOutside = (e) => {
        if(!e.isHandledByDialog) {
            this.setOpen(false);
        }
    };
    closeOnEscape = (e) => {
        const ESCAPE = 27;
        if(e.keyCode === ESCAPE) {
            this.setOpen(false);
        }
    };

    @action.bound init() {
        document.addEventListener('click', this.handleClickOutside, false);
        document.addEventListener('keydown', this.closeOnEscape, false);
    }

    @action.bound destroy() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.closeOnEscape);
    }

    @action.bound onContainerClick(e) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
    }

    connect = connect(() => ({
        open: this.open,
        setOpen: this.setOpen,
        init: this.init,
        destroy: this.destroy,
        onTitleClick: this.onTitleClick,
        onContainerClick: this.onContainerClick,
    }))
}