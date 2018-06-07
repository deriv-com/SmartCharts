import { action } from 'mobx';

const allDialogs = [];

export default class RoutingStore {
    @action.bound handleRouting() {
        let timer;
        window.addEventListener('hashchange', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const hash = window.history.state.urlPath.replace('#', '');
                if (hash === '') {
                    this.closeAll();
                }
            }, 200);
        }, false);
    }

    @action.bound registerDialog(dialogStore) {
        allDialogs.push(dialogStore);
    }

    @action.bound closeAll() {
        allDialogs.forEach(m => m.setOpen(false));
    }
}
