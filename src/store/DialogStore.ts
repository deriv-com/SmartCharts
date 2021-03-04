import { observable, action, when } from 'mobx';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import debounce from 'lodash.debounce';
import { connect } from './Connect';

let activeDialog: any;

export default class DialogStore {
    mainStore: any;
    constructor(mainStore: any) {
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable open = false;
    onClose = () => this.setOpen(false);
    setOpen = debounce(
        (val: any) => {
            this.openDialog(val);
        },
        10,
        { leading: true, trailing: false }
    );

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound register() {
        document.addEventListener('click', this.handleClickOutside, false);
        document.addEventListener('keydown', this.closeOnEscape, false);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound unregister() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.closeOnEscape);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onContainerClick(e: any) {
        /* TODO: why stopPropagation() is not working ಠ_ಠ */
        // e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateCloseCallback(onClose: any) {
        if (onClose !== undefined) {
            this.onClose = onClose;
        }
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(() => ({
        open: this.open,
        setOpen: this.setOpen,
        onClose: this.onClose,
        updateCloseCallback: this.updateCloseCallback,
        onContainerClick: this.onContainerClick,
        isMobile: this.mainStore.chart.isMobile,
    }));
}
