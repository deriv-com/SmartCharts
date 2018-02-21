import { observable, action, computed, reaction, autorunAsync } from 'mobx';
import { getTimeUnit } from './utils';

export default class MenuStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        reaction(() => this.open, () => this.blurInput());
    }

    get context() { return this.mainStore.chart.context; }

    @observable open = false;

    blurInput() {
        if(this.open === false) {
            document.activeElement.blur();
            this.context.stx.modalEnd();
        }
    }

    @action.bound setOpen(val) {
        this.open = val;
    }

    handleClickOutside = (e) => {
        console.warn('handleClickOutside()', this.open);
        if(!e.isHandledByMenu) {
            this.open = false;
        }
    };
    closeOnEscape = (e) => { this.open = false; };

    @action.bound init() {
        document.addEventListener('click', this.handleClickOutside, false);
        document.addEventListener('keydown', this.closeOnEscape, false);
    }

    @action.bound destroy() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.closeOnEscape);
    }

    @action.bound onTitleClick(e) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByMenu = true;
        this.open = !this.open;
    }
    @action.bound onBodyClick(e) {
        // e.stopPropagation();
        e.nativeEvent.isHandledByMenu = true;
    }

    @action.bound onMouseEntrBody() {
        this.context.stx.modalBegin();
    }

    @action.bound onMouseLeaveBody() {
        this.context.stx.modalBegin();
    }
}
