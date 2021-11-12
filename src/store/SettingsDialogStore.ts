import { observable, action, computed, reaction } from 'mobx';
import { TSettingsItemGroup, TSettingsItems } from 'src/types';
import { connect } from './Connect';
import MenuStore from './MenuStore';
import MainStore from '.';

export default class SettingsDialogStore {
    getContext: any;
    mainStore: MainStore;
    menuStore: MenuStore;
    onChanged: any;
    onDeleted: any;
    onItemActive: any;
    @observable
    items: TSettingsItems[] = []; // [{id: '', title: '', value: ''}]
    @observable
    title = '';
    @observable
    formTitle = '';
    @observable
    formClassname = '';
    @observable
    description = '';
    @observable
    activeTab = 'settings'; // 'settings' | 'description'
    @computed
    get showTabs() {
        return !!this.description;
    }
    @observable
    scrollPanel?: HTMLElement;
    @observable
    dialogPortalNodeId = null;
    @observable
    freezeScroll = false;
    constructor({ mainStore, getContext, onChanged, onDeleted }: any) {
        this.mainStore = mainStore;
        this.getContext = getContext;
        this.onChanged = onChanged;
        this.onDeleted = onDeleted;
        this.menuStore = new MenuStore(mainStore, { route: 'indicator-setting' });
        reaction(
            () => this.open,
            () => {
                if (!this.scrollPanel || !this.open) {
                    return;
                }
                const dropdowns = this.scrollPanel.querySelectorAll('.sc-color-picker, .sc-dropdown');
                this.scrollPanel.addEventListener('click', () => {
                    this.setFreezeScroll(false);
                });
                dropdowns.forEach((dropdown: any) => {
                    dropdown.addEventListener('click', () => setTimeout(() => this.checkDropdownOpen(), 50));
                });
                this.setFreezeScroll(false);
            },
            {
                delay: 300,
            }
        );
    }
    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    get theme() {
        return this.mainStore.chartSetting.theme;
    }
    @computed
    get open() {
        return this.menuStore.open;
    }
    checkDropdownOpen = () => {
        let freezeScroll = false;
        if (!this.scrollPanel) {
            return;
        }
        const dropdowns = this.scrollPanel.querySelectorAll('.sc-color-picker, .sc-dropdown');
        dropdowns.forEach((dropdown: any) => {
            if (dropdown.className.indexOf('active') !== -1) freezeScroll = true;
        });
        this.setFreezeScroll(freezeScroll);
    };
    @action.bound
    setFreezeScroll(status: any) {
        this.freezeScroll = status;
    }
    @action.bound
    setOpen(value: any) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menuStore.setOpen(value);
    }
    @action.bound
    onResetClick() {
        const items = this.items.map(item => ({ ...item, value: item.defaultValue }));
        this.items = items;
        this.onChanged(items);
    }
    @action.bound
    onItemDelete() {
        this.menuStore.setOpen(false);
        if (this.onDeleted) this.onDeleted();
    }
    @action.bound
    onItemChange(id: any, newValue: any) {
        const item = this.items.find(x => (x as any).id === id);
        if (item && (item as any).value !== newValue) {
            (item as any).value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
    }
    @computed
    get itemGroups() {
        const restGroup: TSettingsItems[] = [];
        const groups: TSettingsItemGroup[] = [];
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
    @action.bound
    setScrollPanel(element: any) {
        this.scrollPanel = element;
    }
    connect = connect(() => ({
        items: this.items,
        itemGroups: this.itemGroups,
        title: this.title,
        formClassname: this.formClassname,
        description: this.description,
        showTabs: this.showTabs,
        onResetClick: this.onResetClick,
        onItemChange: this.onItemChange,
        onItemActive: this.onItemActive,
        onItemDelete: this.onItemDelete,
        menuStore: this.menuStore,
        open: this.open,
        theme: this.theme,
        setScrollPanel: this.setScrollPanel,
        close: this.menuStore.handleCloseDialog,
        dialogPortalNodeId: this.dialogPortalNodeId,
        freezeScroll: this.freezeScroll,
    }));
}
