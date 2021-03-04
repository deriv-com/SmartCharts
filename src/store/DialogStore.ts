import { observable, action, when } from 'mobx';
import debounce from 'lodash.debounce';
import { connect } from './Connect';

let activeDialog;

export default class DialogStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(
            () => this.context,
            () => {
                this.routingStore.registerDialog(this);
            }
        );
    }

    get context() {
        return this.mainStore.chart.context;
    }
    get routingStore() {
        return this.mainStore.routing;
    }

    @observable open = false;
    onClose = () => this.setOpen(false);
    setOpen = debounce(
        val => {
            this.openDialog(val);
        },
        10,
        { leading: true, trailing: false }
    );

    @action.bound openDialog(val) {
        if (this.open !== val) {
            this.open = val;
            if (this.open) {
                // As we combine dialogs with the menu, so for opening
                // the items which has no menu, this trigger right after
                // firing open action, this delay prevent that issue.
                setTimeout(this.register, 100);
            } else {
                this.unregister();
            }

            if (val === true) {
                // close active dialog.
                if (activeDialog) {
                    activeDialog.openDialog(false);
                }
                activeDialog = this;
            } else {
                activeDialog = undefined;
            }
        }
    }

    handleClickOutside = e => {
        let isRightClick = false;
        if ('which' in e) {
            isRightClick = e.which === 3;
        } else if ('button' in e) {
            isRightClick = e.button === 2;
        }

        if (!e.isHandledByDialog && !isRightClick) {
            this.onClose();
        }
    };
    closeOnEscape = e => {
        const ESCAPE = 27;
        if (e.keyCode === ESCAPE) {
            this.onClose();
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

    @action.bound updateCloseCallback(onClose) {
        if (onClose !== undefined) {
            this.onClose = onClose;
        }
    }

    connect = connect(() => ({
        open: this.open,
        setOpen: this.setOpen,
        onClose: this.onClose,
        updateCloseCallback: this.updateCloseCallback,
        onContainerClick: this.onContainerClick,
        isMobile: this.mainStore.chart.isMobile,
    }));
}
