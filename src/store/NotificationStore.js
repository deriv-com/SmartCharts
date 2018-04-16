import { observable, action, computed, when } from 'mobx';

let notificationId = 0;

export default class NotificationStore {
    static get TYPE_ERROR()   { return 'error';   }
    static get TYPE_MESSAGE() { return 'message'; }
    static get TYPE_WARNING() { return 'warning'; }
    static get TYPE_SUCCESS() { return 'success'; }

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @observable messages = [];

    // Duration is in seconds; set to < 0 if you want the notification to remain indefinitely
    @action.bound notify(text, type = NotificationStore.TYPE_WARNING, duration = 10) {
        this.messages = this.messages.filter(m => m.text !== text);
        const id = notificationId++;
        this.messages.push( {
            id,
            text,
            type,
            hide: false,
        });
        if (duration > 0) {
            setTimeout(() => this.removeById(id), duration * 1000);
        }
    }

    removeById(id) {
        this.messages.map((msg, i) => {
            if (msg.id === id) {
                this.remove(i);
            }
        });
    }

    @action.bound remove(inx) {
        this.messages[inx].hide = true;
        setTimeout(() => {
            this.messages.splice(inx, 1);
        }, 300);
    }
}
