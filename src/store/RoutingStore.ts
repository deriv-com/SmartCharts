import { action } from 'mobx';

const allDialogs: any = [];

export default class RoutingStore {
    mainStore: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
    }

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

    @action.bound updateRoute(route: any, dialogStatus: any) {
        const enableRouting = this.mainStore.chart.enableRouting;
        if (enableRouting && dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
            window.history.pushState({ urlPath: `#${route}` }, '', `#${route}`);
        } else if (enableRouting && !dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
        }
    }

    @action.bound registerDialog(dialogStore: any) {
        allDialogs.push(dialogStore);
    }

    @action.bound closeAll() {
        allDialogs.forEach((m: any) => m.setOpen(false));
    }
}
