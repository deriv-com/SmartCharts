import { observable, action } from 'mobx';
import { connect } from './Connect';

const allDialogs = [];

export default class DialogStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        allDialogs.push(this);
    }

    @observable open = false;

    @action.bound setOpen(val) {
        if (this.open !== val) {
            this.open = val;
            if (this.open) { setTimeout(() => this.register(), 100); } else { this.unregister(); }
        }
        if (this.open === true) { // close others.
            allDialogs.filter(m => m !== this).forEach(m => m.setOpen(false));
        }
    }

    handleClickOutside = (e) => {
        let isRightClick = false;
        if ('which' in e) { isRightClick = e.which == 3; } else if ('button' in e) { isRightClick = e.button == 2; }

        if (!e.isHandledByDialog && !isRightClick) {
            this.setOpen(false);
        }
    };
    closeOnEscape = (e) => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.setOpen(false);
        }
    };

    @action.bound register() {
        document.addEventListener('click', this.handleClickOutside, false);
        document.addEventListener('keydown', this.closeOnEscape, false);
    }

    @action.bound unregister() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.closeOnEscape);
    }

    @action.bound onContainerClick(e) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
    }

    @action.bound closeAll() {
        allDialogs.forEach(m => m.setOpen(false));
    }


    connect = connect(() => ({
        open: this.open,
        setOpen: this.setOpen,
        onTitleClick: this.onTitleClick,
        onContainerClick: this.onContainerClick,
        chartHeight: this.mainStore.chart.chartHeight,
        chartContainerHeight: this.mainStore.chart.chartContainerHeight,
    }));
}
