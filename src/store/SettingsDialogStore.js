import { observable, action, computed } from 'mobx';
import { connect } from './Connect';
import Dialog from '../components/Dialog.jsx';
import MenuStore from './MenuStore';

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
        this.menu = new MenuStore(mainStore, { route:'indicator-setting' });
        this.Dialog = this.menu.dialog.connect(Dialog);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @computed get open() { return this.menu.open; }
    @action.bound setOpen(value) {
        return this.menu.setOpen(value);
    }

    @action.bound onDeleteClick() {
        this.onDeleted();
        this.menu.setOpen(false);
    }

    @action.bound onStarClick() {
        this.stared = !this.stared;
        this.onStared(this.stared);
    }

    @action.bound onTabClick(id) {
        this.activeTab = id;
    }

    @action.bound onResetClick() {
        const items = this.items.map(item => ({ ...item, value: item.defaultValue }));
        this.items = items;
        this.onChanged(items);
    }

    @action.bound onItemChange(id, newValue) {
        const item = this.items.find(x => x.id === id);
        if (item && item.value !== newValue) {
            item.value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
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
        Dialog: this.Dialog,
        open: this.open,
    }));
}
