import { observable, action, computed, when } from 'mobx';

export default class NotificationStore {
    static get TYPE_ERROR()   { return 'error';   }
    static get TYPE_MESSAGE() { return 'message'; }
    static get TYPE_WARNING() { return 'warning'; }
    static get TYPE_SUCCESS() { return 'success'; }

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @observable messages = [];

    @action.bound notify(text, type = NotificationStore.TYPE_WARNING) {
        this.messages = this.messages.filter(m => m.text !== text);
        this.messages.push( {
            text,
            type,
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
