import { observable, action, computed } from 'mobx';
import { connect } from './Connect';
import DialogStore from './DialogStore';
import Dialog from '../components/Dialog.jsx';

export default class SettingsDialogStore {
    @observable items = []; // [{id: '', title: '', value: ''}]
    @observable title = '';
    @observable stared = false;
    @observable description = '';

    @observable activeTab = 'settings'; // 'settings' | 'description'
    @computed get showTabs() { return !!this.description; }

    constructor({
        mainStore, getContext, onDeleted, onStared, onChanged,
    }) {
        this.getContext = getContext;
        this.onDeleted = onDeleted;
        this.onStared = onStared;
        this.onChanged = onChanged;

        this.dialog = new DialogStore(mainStore);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @computed get open() { return this.dialog.open; }
    @action.bound setOpen(value) {
        return this.dialog.setOpen(value);
    }

    @action.bound onDeleteClick() {
        this.onDeleted();
        this.dialog.setOpen(false);
    }

    @action.bound onStarClick() {
        this.stared = !this.stared;
        this.onStared(this.stared);
    }
    @action.bound onTabClick(id) {
        this.activeTab = id;
    }
    @action.bound onResetClick() {
        const items = this.items.map((item) => {
            const clone = JSON.parse(JSON.stringify(item));
            clone.value = clone.defaultValue;
            return clone;
        });
        this.items = items;
        this.onChanged(items);
    }
    @action.bound onItemChange(id, newValue) {
        const items = this.items.map((item) => {
            const clone = JSON.parse(JSON.stringify(item));
            if (item.id === id) { clone.value = newValue; }
            return clone;
        });
        this.items = items;
        this.onChanged(items);
    }

    connect = connect(() => ({
        items: this.items,
        title: this.title,
        description: this.description,
        activeTab: this.activeTab,
        showTabs: this.showTabs,
        stared: this.stared,
        setOpen: this.setOpen,
        isFavoritable: !!this.onStared,
        onTabClick: this.onTabClick,
        onDeleteClick: this.onDeleted ? this.onDeleteClick : undefined,
        onStarClick: this.onStarClick,
        onResetClick: this.onResetClick,
        onItemChange: this.onItemChange,
        Dialog: this.dialog.connect(Dialog),
    }));
}
