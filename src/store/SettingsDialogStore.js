import { observable, action, computed, reaction } from 'mobx';
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
    @observable dialogPortalNodeId = null;
    @observable freezeScroll = false;

    constructor({ mainStore, getContext, onChanged, onDeleted }) {
        this.mainStore = mainStore;
        this.getContext = getContext;
        this.onChanged = onChanged;
        this.onDeleted = onDeleted;
        this.menu = new MenuStore(mainStore, { route:'indicator-setting' });
        this.SettingDialogMenu = this.menu.connect(Menu);

        reaction(() => (this.scrollPanel && this.open), () => {
            if (!this.scrollPanel || !this.open) { return; }

            const rootEle = this.scrollPanel.container;
            const dropdowns = rootEle.querySelectorAll('.sc-color-picker, .sc-dropdown');
            rootEle.addEventListener('click', () => {
                this.setFreezeScroll(false);
            });
            dropdowns.forEach((dropdown) => {
                dropdown.addEventListener('click', () => setTimeout(() => this.checkDropdownOpen(), 50));
            });
            this.setFreezeScroll(false);
        });
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get theme() { return this.mainStore.chartSetting.theme; }

    @computed get open() { return this.menu.open; }
    @action.bound checkDropdownOpen() {
        let freezeScroll = false;
        if (!this.scrollPanel) { return; }
        const dropdowns = this.scrollPanel.container.querySelectorAll('.sc-color-picker, .sc-dropdown');
        dropdowns.forEach((dropdown) => {
            if (dropdown.className.indexOf('active') !== -1) freezeScroll = true;
        });

        this.setFreezeScroll(freezeScroll);
    }
    @action.bound setFreezeScroll(status) {
        this.freezeScroll = status;
    }

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
        const groupNames = [
            '%K', '%D',
            'Lagging Span', 'Leading Span A', 'Leading Span B', 'Base Line', 'Conversion Line',
            'Increasing Bar', 'Decreasing Bar', 'Signal', 'Jaw', 'Teeth', 'Lips',
            'OverBought', 'OverSold',
            'Show Zones',
            'Show Lines',
            'Show Fractals',
        ];
        const groups = groupNames.map(item => ({ key: item, fields: [] }));

        for (const index in this.items) {
            const item = this.items[index];
            const title = item.title;
            const group = groups.find(x => title.indexOf(x.key) !== -1);
            if (group) {
                item.subtitle = title.replace(group.key, '').trim();
                group.fields.push(item);
            } else {
                restGroup.push(item);
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
        dialogPortalNodeId: this.dialogPortalNodeId,
        freezeScroll: this.freezeScroll,
    }));
}
