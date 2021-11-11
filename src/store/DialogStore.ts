import { observable, action, when } from 'mobx';
import debounce from 'lodash.debounce';
import { TMainStore } from 'src/types';

let activeDialog: any;

export default class DialogStore {
    mainStore: TMainStore;
    constructor(mainStore: TMainStore) {
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
        (val: any) => {
            this.openDialog(val);
        },
        10,
        { leading: true, trailing: false }
    );

    @action.bound openDialog(val: any) {
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

    handleClickOutside = (e: any) => {
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
    closeOnEscape = (e: any) => {
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

    @action.bound onContainerClick(e: any) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
    }

    @action.bound updateCloseCallback(onClose: any) {
        if (onClose !== undefined) {
            this.onClose = onClose;
        }
    }
}
