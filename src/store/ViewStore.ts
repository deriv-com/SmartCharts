import { observable, action, reaction, computed } from 'mobx';
import { createObjectFromLocalStorage, getIntervalInSeconds } from '../utils';
import MenuStore from './MenuStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

export default class ViewStore {
    constructor(mainStore: any) {
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable static views = createObjectFromLocalStorage('cq-views') || [];
    ViewsMenu: any;
    mainStore: any;
    menu: any;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable templateName = '';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable currentRoute = 'main';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isInputActive;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get sortedItems() {
        return [...ViewStore.views].sort((a, b) => (a.name < b.name ? -1 : 1));
    }

    static updateLocalStorage() {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.localStorageSetItem('cq-views', JSON.stringify(ViewStore.views));
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onChange(e: any) {
        if (this.currentRoute === 'overwrite') {
            return;
        }
        this.templateName = e.target.value;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onSubmit(e: any) {
        if (e.keyCode === 13) {
            this.saveViews();
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Save Template');
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onCancel() {
        this.templateName = '';
        this.updateRoute('main');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateRoute(name: any) {
        this.currentRoute = name;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound saveViews() {
        if (ViewStore.views.some((x: any) => x.name.toLowerCase().trim() === this.templateName.toLowerCase().trim())) {
            this.updateRoute('overwrite');
        } else if (this.templateName.trim().length > 0) {
            this.updateRoute('main');
            const layout = this.stx.exportLayout();
            ViewStore.views.push({ name: this.templateName.trim(), layout });
            ViewStore.updateLocalStorage();
            this.templateName = '';
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound overwrite() {
        const layout = this.stx.exportLayout();
        const templateIndex = ViewStore.views.findIndex((x: any) => x.name.toLowerCase() === this.templateName.toLowerCase());
        ViewStore.views[templateIndex].layout = layout;
        ViewStore.views[templateIndex].name = this.templateName.trim();
        ViewStore.updateLocalStorage();
        this.updateRoute('main');
        this.templateName = '';
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound remove(idx: any, e: any) {
        ViewStore.views = this.sortedItems.filter((x, index) => idx !== index);
        e.nativeEvent.is_item_removed = true;
        ViewStore.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove Template');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound removeAll() {
        ViewStore.views = [];
        ViewStore.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove All Templates');
        this.updateRoute('new');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound applyLayout(idx: any, e: any) {
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onToggleNew() {
        this.updateRoute('main');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound inputRef(ref: any) {
        if (ref) {
            ref.focus();
            this.isInputActive = true;
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onFocus() {
        this.isInputActive = true;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onBlur() {
        this.isInputActive = false;
    }
}
