import { observable, action, reaction, computed } from 'mobx';
import { createObjectFromLocalStorage, getIntervalInSeconds } from '../utils';
import MenuStore from './MenuStore';
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

export default class ViewStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'templates' });
        this.ViewsMenu = this.menu.connect(Menu);
        reaction(
            () => this.menu.dialog.open,
            () => {
                if (ViewStore.views.length === 0) {
                    this.updateRoute('new');
                } else {
                    this.updateRoute('main');
                }

                if (this.menu.dialog.open) {
                    this.templateName = '';
                }
            }
        );
    }

    @observable static views = createObjectFromLocalStorage('cq-views') || [];
    @observable templateName = '';
    @observable currentRoute = 'main';
    @observable isInputActive;
    @observable routes = {
        add: () => this.saveViews(),
        main: () => this.updateRoute('add'),
        cancel: () => this.onCancel(),
        overwrite: () => this.overwrite(),
    };

    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    get loader() {
        return this.mainStore.loader;
    }

    @computed get sortedItems() {
        return [...ViewStore.views].sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    static updateLocalStorage() {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(ViewStore.views));
    }

    @action.bound onChange(e) {
        if (this.currentRoute === 'overwrite') {
            return;
        }
        this.templateName = e.target.value;
    }

    @action.bound onSubmit(e) {
        if (e.keyCode === 13) {
            this.saveViews();
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Save Template');
        }
    }

    @action.bound onCancel() {
        this.templateName = '';
        this.updateRoute('main');
    }

    @action.bound updateRoute(name) {
        this.currentRoute = name;
    }

    @action.bound saveViews() {
        if (ViewStore.views.some(x => x.name.toLowerCase().trim() === this.templateName.toLowerCase().trim())) {
            this.updateRoute('overwrite');
        } else if (this.templateName.trim().length > 0) {
            this.updateRoute('main');
            const layout = this.stx.exportLayout();
            ViewStore.views.push({ name: this.templateName.trim(), layout });
            ViewStore.updateLocalStorage();
            this.templateName = '';
        }
    }

    @action.bound overwrite() {
        const layout = this.stx.exportLayout();
        const templateIndex = ViewStore.views.findIndex(x => x.name.toLowerCase() === this.templateName.toLowerCase());
        ViewStore.views[templateIndex].layout = layout;
        ViewStore.views[templateIndex].name = this.templateName.trim();
        ViewStore.updateLocalStorage();
        this.updateRoute('main');
        this.templateName = '';
    }

    @action.bound remove(idx, e) {
        ViewStore.views = this.sortedItems.filter((x, index) => idx !== index);
        e.nativeEvent.is_item_removed = true;
        ViewStore.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove Template');
    }

    @action.bound removeAll() {
        ViewStore.views = [];
        ViewStore.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove All Templates');
        this.updateRoute('new');
    }

    @action.bound applyLayout(idx, e) {
        if (e.nativeEvent.is_item_removed) {
            return;
        }
        if (this.loader) {
            this.loader.show();
        }
        this.mainStore.state.setChartIsReady(false);
        const stx = this.stx;
        const granularity = getIntervalInSeconds(ViewStore.views[idx].layout);

        this.mainStore.timeperiod.onGranularityChange(granularity);
        const importLayout = () => {
            const finishImportLayout = () => {
                stx.changeOccurred('layout');
                this.mainStore.studies.updateActiveStudies();
                if (this.loader) {
                    this.loader.hide();
                    this.mainStore.paginationLoader.updateOnPagination(false);
                }
                this.mainStore.state.setChartIsReady(true);
                this.mainStore.state.setChartGranularity(granularity);
            };
            stx.importLayout(ViewStore.views[idx].layout, {
                managePeriodicity: true,
                preserveTicksAndCandleWidth: true,
                cb: finishImportLayout,
            });
            // This condition is to make spline chart appear as spline chart
            // Both line chart and spline chart are of type mountain but with different tensions
            let chartType = ViewStore.views[idx].layout.chartType;
            if (chartType === 'mountain') {
                const tension = ViewStore.views[idx].layout.tension;
                if (tension === 0.5) {
                    chartType = 'spline';
                }
            }
            this.mainStore.chartType.setType(chartType);
            this.mainStore.state.setChartType(chartType);
            this.menu.setOpen(false);
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Load Template');
        };
        setTimeout(importLayout, 100);
    }

    @action.bound onToggleNew() {
        this.updateRoute('main');
    }

    @action.bound inputRef(ref) {
        if (ref) {
            ref.focus();
            this.isInputActive = true;
        }
    }

    @action.bound onFocus() {
        this.isInputActive = true;
    }

    @action.bound onBlur() {
        this.isInputActive = false;
    }
}
