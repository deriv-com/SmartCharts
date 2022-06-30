import { action, computed, observable, reaction, makeObservable } from 'mobx';
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
    items: TSettingsItem[] = []; // [{id: '', title: '', value: ''}]
    title = '';
    formTitle = '';
    formClassname = '';
    description = '';
    activeTab = 'settings'; // 'settings' | 'description'
    get showTabs() {
        return !!this.description;
    }
    scrollPanel?: HTMLElement;
    dialogPortalNodeId?: string;
    freezeScroll = false;
    constructor({ mainStore, getContext, onChanged, onDeleted }: TSettingsDialogStoreProps) {
        makeObservable(this, {
            items: observable,
            title: observable,
            formTitle: observable,
            formClassname: observable,
            description: observable,
            activeTab: observable,
            showTabs: computed,
            scrollPanel: observable,
            dialogPortalNodeId: observable,
            freezeScroll: observable,
            open: computed,
            setFreezeScroll: action.bound,
            setOpen: action.bound,
            onResetClick: action.bound,
            onItemDelete: action.bound,
            onItemChange: action.bound,
            itemGroups: computed,
            setScrollPanel: action.bound
        });

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
    setFreezeScroll(status: boolean) {
        this.freezeScroll = status;
    }
    setOpen(value: boolean) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menuStore.setOpen(value);
    }
    onResetClick() {
        const items = this.items.map(item => ({ ...item, value: item.defaultValue }));
        this.items = items;
        this.onChanged(items);
    }
    onItemDelete() {
        this.menuStore.setOpen(false);
        if (this.onDeleted) this.onDeleted();
    }
    onItemChange(id: string, newValue: string | number | boolean | TObject) {
        const item = this.items.find(x => x.id === id);
        if (item && item.value !== newValue) {
            item.value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
    }
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
    setScrollPanel(element: HTMLElement) {
        this.scrollPanel = element;
    }
}
