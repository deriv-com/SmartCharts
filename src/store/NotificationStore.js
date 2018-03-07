import { observable, action, computed, when } from 'mobx';

export default class NotificationStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        setTimeout(() => this.open = true, 5*1000);
    }

    @observable open = false;
    @observable text = 'This is Beta version and therefore unexpected issues are possible.';
    @observable type = 'warning'; // warning|info|error

    @action.bound setOpen(value) {
        this.open = value;
    }
}