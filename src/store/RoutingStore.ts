import { action } from 'mobx';
import MainStore from '.';
import DialogStore from './DialogStore';

const allDialogs: DialogStore[] = [];

export default class RoutingStore {
    mainStore: MainStore;
    constructor(mainStore: MainStore) {
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

    @action.bound updateRoute(route: string, dialogStatus: boolean) {
        const enableRouting = this.mainStore.chart.enableRouting;
        if (enableRouting && dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
            window.history.pushState({ urlPath: `#${route}` }, '', `#${route}`);
        } else if (enableRouting && !dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
        }
    }

    @action.bound registerDialog(dialogStore: DialogStore) {
        allDialogs.push(dialogStore);
    }

    @action.bound closeAll() {
        allDialogs.forEach((m: DialogStore) => m.setOpen(false));
    }
}
