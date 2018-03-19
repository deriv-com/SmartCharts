import { observable, action, computed, when } from 'mobx';

export default class NotificationStore {
    constructor(mainStore) {
        this.mainStore = mainStore;

        setTimeout(() => {
            this.messages.push( {
                text:  'This product is currently in beta. Unexpected errors may occur.',
                type: 'warning', // warning|info|error
                hide: false,
            });
        }, 5*1000);
    }

    @observable messages = [];

    @action.bound addWarning(text) {
        this.messages = this.messages.filter(m => m.text !== text);
        this.messages.push( {
            text:  text,
            type: 'warning',
            hide: false,
        });
    }

    @action.bound remove(inx) {
        this.messages[inx].hide = true;
        setTimeout(() => {
            this.messages.splice(inx, 1);
        }, 300);
    }
}
