import { observable, action, computed, reaction } from 'mobx';
import { connect } from './Connect';
import MenuStore from './MenuStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
export default class SettingsDialogStore {
    SettingDialogMenu: any;
    getContext: any;
    mainStore: any;
    menu: any;
    onChanged: any;
    onDeleted: any;
    onItemActive: any;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    items = []; // [{id: '', title: '', value: ''}]
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    title = '';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    formTitle = '';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    formClassname = '';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    description = '';
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    activeTab = 'settings'; // 'settings' | 'description'
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get showTabs() {
        return !!this.description;
    }
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    scrollPanel;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    dialogPortalNodeId = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    freezeScroll = false;
    constructor({ mainStore, getContext, onChanged, onDeleted }: any) {
        this.mainStore = mainStore;
        this.getContext = getContext;
        this.onChanged = onChanged;
        this.onDeleted = onDeleted;
        this.menu = new MenuStore(mainStore, { route: 'indicator-setting' });
        this.SettingDialogMenu = this.menu.connect(Menu);
        reaction(() => this.open, () => {
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
        }, {
            delay: 300,
        });
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
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get open() {
        return this.menu.open;
    }
    checkDropdownOpen = () => {
        let freezeScroll = false;
        if (!this.scrollPanel) {
            return;
        }
        const dropdowns = this.scrollPanel.querySelectorAll('.sc-color-picker, .sc-dropdown');
        dropdowns.forEach((dropdown: any) => {
            if (dropdown.className.indexOf('active') !== -1)
                freezeScroll = true;
        });
        this.setFreezeScroll(freezeScroll);
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setFreezeScroll(status: any) {
        this.freezeScroll = status;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setOpen(value: any) {
        if (value && this.scrollPanel) {
            this.scrollPanel.scrollTop = 0;
        }
        return this.menu.setOpen(value);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onResetClick() {
        // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
        const items = this.items.map(item => ({ ...item, value: item.defaultValue }));
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'never[]'.
        this.items = items;
        this.onChanged(items);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onItemDelete() {
        this.menu.setOpen(false);
        if (this.onDeleted)
            this.onDeleted();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onItemChange(id: any, newValue: any) {
        const item = this.items.find(x => (x as any).id === id);
        if (item && (item as any).value !== newValue) {
            (item as any).value = newValue;
            this.items = this.items.slice(0); // force array update
            this.onChanged(this.items);
        }
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get itemGroups() {
        const restGroup: any = [];
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
            const item = this.items[index];
            const title = (item as any).title;
            const group = groups.find(x => title.indexOf(x.key) !== -1);
            if (group) {
                (item as any).subtitle = title.replace(group.key, '').trim();
                group.fields.push(item);
            }
            else {
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
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setScrollPanel(element: any) {
        this.scrollPanel = element;
    }
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
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
        SettingDialogMenu: this.SettingDialogMenu,
        open: this.open,
        theme: this.theme,
        setScrollPanel: this.setScrollPanel,
        close: this.menu.handleCloseDialog,
        dialogPortalNodeId: this.dialogPortalNodeId,
        freezeScroll: this.freezeScroll,
    }));
}
