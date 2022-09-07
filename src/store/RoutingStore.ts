import { action, makeObservable } from 'mobx';
import MainStore from '.';
import DialogStore from './DialogStore';

const allDialogs: DialogStore[] = [];

export default class RoutingStore {
    mainStore: MainStore;
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            handleRouting: action.bound,
            updateRoute: action.bound,
            registerDialog: action.bound,
            closeAll: action.bound
        });

        this.mainStore = mainStore;
    }

    handleRouting() {
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

    updateRoute(route: string, dialogStatus: boolean) {
        const enableRouting = this.mainStore.chart.enableRouting;
        if (enableRouting && dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
            window.history.pushState({ urlPath: `#${route}` }, '', `#${route}`);
        } else if (enableRouting && !dialogStatus && route) {
            window.history.replaceState({ urlPath: '#' }, '', '#');
        }
    }

    registerDialog(dialogStore: DialogStore) {
        allDialogs.push(dialogStore);
    }

    closeAll() {
        allDialogs.forEach((m: DialogStore) => m.setOpen(false));
    }
}
