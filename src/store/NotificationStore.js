import { observable, action, computed, when } from 'mobx';

export default class NotificationStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @observable open = true;
    @observable text = 'This is Beta version and therefore unexpected issues are possible.';
    @observable type = 'warning'; // warning|info|error

    @action.bound setOpen(value) {
        this.open = value;
    }
}