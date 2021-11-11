import { observable, action, when } from 'mobx';
import debounce from 'lodash.debounce';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DebouncedFunc } from 'lodash';
import Context from '../components/ui/Context';
import { TMainStore } from '../types';

let activeDialog: DialogStore | undefined;

export default class DialogStore {
    mainStore: TMainStore;
    constructor(mainStore: TMainStore) {
        this.mainStore = mainStore;
        when(
            () => !!this.context,
            () => {
                this.routingStore.registerDialog(this);
            }
        );
    }

    get context(): Context {
        return this.mainStore.chart.context;
    }
    get routingStore() {
        return this.mainStore.routing;
    }

    @observable open = false;
    onClose = () => this.setOpen(false);
    setOpen = debounce(
        (val: boolean) => {
            this.openDialog(val);
        },
        10,
        { leading: true, trailing: false }
    );

    @action.bound openDialog(val: boolean) {
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

    handleClickOutside = (e: React.MouseEvent | Event | UIEvent) => {
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
    closeOnEscape = (e: React.KeyboardEvent | Event) => {
        const ESCAPE = 27;
        if ((e as React.KeyboardEvent).keyCode === ESCAPE) {
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

    @action.bound onContainerClick(e: React.MouseEvent) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
    }

    @action.bound updateCloseCallback(onClose: () => void | undefined) {
        if (onClose !== undefined) {
            this.onClose = onClose;
        }
    }
}

export type TDialogStoreConnectedProps = {
    open: boolean;
    setOpen: DebouncedFunc<(val: boolean) => void>;
    onClose: () => void | undefined;
    updateCloseCallback: (onClose: () => void | undefined) => void;
    onContainerClick: (e: React.MouseEvent) => void;
    isMobile: boolean;
};