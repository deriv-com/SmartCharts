import { action, computed, observable, reaction } from 'mobx';
import { TObject, TSettingsItem, TSettingsItemGroup } from 'src/types';
import MainStore from '.';
import Context from '../components/ui/Context';
import MenuStore from './MenuStore';

type TSettingsDialogStoreProps = {
    mainStore: MainStore;
    onChanged: (items: TSettingsItem[]) => void;
    getContext?: (stx: typeof CIQ.ChartEngine) => Context;
    onDeleted?: (indx?: number) => void;
    favoritesId?: string;
};

export default class SettingsDialogStore {
    getContext?: (stx: typeof CIQ.ChartEngine) => Context;
    mainStore: MainStore;
    menuStore: MenuStore;
    onChanged: (items: TSettingsItem[]) => void;
    onDeleted?: () => void;
    @observable
    items: TSettingsItem[] = []; // [{id: '', title: '', value: ''}]
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
    dialogPortalNodeId?: string;
    @observable
    freezeScroll = false;
    constructor({ mainStore, getContext, onChanged, onDeleted }: TSettingsDialogStoreProps) {
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
                dropdowns.forEach((dropdown: Element) => {
                    dropdown.addEventListener('click', () => setTimeout(() => this.checkDropdownOpen(), 50));
                });
                this.setFreezeScroll(false);
            },
            {
                delay: 300,
            }
        );
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get stx(): Context['stx'] {
        return this.context?.stx;
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
        dropdowns.forEach((dropdown: Element) => {
            if (dropdown.className.indexOf('active') !== -1) freezeScroll = true;
        });
        this.setFreezeScroll(freezeScroll);
    };
    @action.bound
    setFreezeScroll(status: boolean) {
        this.freezeScroll = status;
    }
    @action.bound
    setOpen(value: boolean) {
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
    onItemChange(id: string, newValue: string | number | boolean | TObject) {
        const item = this.items.find(x => x.id === id);
        if (item && item.value !== newValue) {
            item.value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
    }
    @computed
    get itemGroups() {
        const restGroup: TSettingsItem[] = [];
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
    setScrollPanel(element: HTMLElement) {
        this.scrollPanel = element;
    }
}
