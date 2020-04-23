import { observable, action, computed } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import Menu from '../components/Menu.jsx';

export default class SettingsDialogStore {
    @observable items = []; // [{id: '', title: '', value: ''}]
    @observable title = '';
    @observable formTitle = '';
    @observable description = '';

    @observable activeTab = 'settings'; // 'settings' | 'description'
    @computed get showTabs() { return !!this.description; }
    @observable scrollPanel;

    constructor({ mainStore, getContext, onChanged, onDeleted }) {
        this.mainStore = mainStore;
        this.getContext = getContext;
        this.onChanged = onChanged;
        this.onDeleted = onDeleted;
        this.menu = new MenuStore(mainStore, { route:'indicator-setting' });
        this.SettingDialogMenu = this.menu.connect(Menu);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get theme() { return this.mainStore.chartSetting.theme; }

    @computed get open() { return this.menu.open; }
    @action.bound setOpen(value) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop(0);
        }
        return this.menu.setOpen(value);
    }

    @action.bound onResetClick() {
        const items = this.items.map(item => ({ ...item, value: item.defaultValue }));
        this.items = items;
        this.onChanged(items);
    }

    @action.bound onItemDelete() {
        this.menu.setOpen(false);
        if (this.onDeleted) this.onDeleted();
    }

    @action.bound onItemChange(id, newValue) {
        const item = this.items.find(x => x.id === id);
        if (item && item.value !== newValue) {
            item.value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
    }

    @computed get itemGroups() {
        const restGroup = [];
        const groups = [];
        groups.push({
            key: '%K',
            fields: [],
        });
        groups.push({
            key: '%D',
            fields: [],
        });
        groups.push({
            key: 'OverBought',
            fields: [],
        });
        groups.push({
            key: 'OverSold',
            fields: [],
        });
        groups.push({
            key: 'Show Zones',
            fields: [],
        });

        for (const index in this.items) {
            const title = this.items[index].title;
            const group = groups.find(x => title.indexOf(x.key) !== -1);
            if (group) {
                group.fields.push(this.items[index]);
            } else {
                restGroup.push(this.items[index]);
            }
        }

        groups.unshift({
            key: this.formTitle || this.title,
            fields: restGroup,
        });

        return groups;
    }
    @action.bound setScrollPanel(element) {
        this.scrollPanel =  element;
    }

    connect = connect(() => ({
        items: this.items,
        itemGroups: this.itemGroups,
        title: this.title,
        description: this.description,
        showTabs: this.showTabs,
        onResetClick: this.onResetClick,
        onItemChange: this.onItemChange,
        onItemActive: this.onItemActive,
        onItemDelete: this.onItemDelete,
        SettingDialogMenu: this.SettingDialogMenu,
        open: this.open,
        theme: this.theme,
        setScrollPanel: this.setScrollPanel,
        close: this.menu.handleCloseDialog,
    }));
}
