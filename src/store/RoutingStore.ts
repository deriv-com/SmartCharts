import { action } from 'mobx';

const allDialogs: any = [];

export default class RoutingStore {
    mainStore: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound handleRouting() {
        window.addEventListener(
            'hashchange',
            () => {
                const hash = window.history.state.urlPath.replace('#', '');
                if (hash === '') {
                    this.closeAll();
                }
            },
            false
        );
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateRoute(route: any, dialogStatus: any) {
        const enableRouting = this.mainStore.chart.enableRouting;
        if (enableRouting && dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
            window.history.pushState({ urlPath: `#${route}` }, '', `#${route}`);
        } else if (enableRouting && !dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound registerDialog(dialogStore: any) {
        allDialogs.push(dialogStore);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound closeAll() {
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'm' implicitly has an 'any' type.
        allDialogs.forEach(m => m.setOpen(false));
    }
}
