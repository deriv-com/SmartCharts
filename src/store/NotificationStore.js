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
    @action.bound notify({
        text, type = NotificationStore.TYPE_WARNING, duration = 10, category,
    }) {
        this.messages = this.messages.filter(m => m.text !== text);
        const id = notificationId++;
        this.messages.push({
            id,
            text,
            type,
            category,
            hide: false,
        });
        if (duration > 0) {
            setTimeout(() => this.removeById(id), duration * 1000);
        }
    }

    removeByCategory(category) {
        this.messages.map((msg, idx) => { // eslint-disable-line array-callback-return
            if (msg.category === category) {
                this.remove(idx);
            }
        });
    }

    removeById(id) {
        const inx = this.messages.findIndex(msg => msg.id === id);
        if (inx !== -1) { this.remove(inx); }
    }

    @action.bound remove(inx) {
        this.messages[inx].hide = true;
        setTimeout(() => {
            this.messages.splice(inx, 1);
        }, 300);
    }
}
