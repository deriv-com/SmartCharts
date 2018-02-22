import { observable, action, reaction } from 'mobx';

let activeMenu;

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
        else {
            this.context.stx.modalBegin();
        }
    }

    @action.bound setOpen(val) {
        if(this.open === val) return;
        this.open = val;
        if(this.open) {
            // Only one menu should be opened at a time
            if(activeMenu) activeMenu.setOpen(false);
            activeMenu = this;
        } else {
            activeMenu = undefined;
        }
    }

    handleClickOutside = (e) => {
        if(!e.isHandledByMenu) {
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

    @action.bound onTitleClick(e) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByMenu = true;
        this.setOpen(!this.open);
    }
    @action.bound onBodyClick(e) {
        // e.stopPropagation();
        e.nativeEvent.isHandledByMenu = true;
    }
}
