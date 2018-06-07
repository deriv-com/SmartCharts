import { action } from 'mobx';

const allDialogs = [];

export default class RoutingStore {
    @action.bound handleRouting() {
        window.addEventListener('hashchange', () => {
            const hash = window.history.state.urlPath.replace('#', '');
            if (hash === '') {
                this.closeAll();
            }
        }, false);
    }

    @action.bound registerDialog(dialogStore) {
        allDialogs.push(dialogStore);
    }

    @action.bound closeAll() {
        allDialogs.forEach(m => m.setOpen(false));
    }
}
