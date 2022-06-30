import { action, computed, observable, reaction, makeObservable } from 'mobx';
import { ChangeEvent, KeyboardEvent } from 'react';
import MainStore from '.';
import Context from '../components/ui/Context';
import { TCustomEvent, TGranularity } from '../types';
import { createObjectFromLocalStorage, getIntervalInSeconds } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';

export type TViews = {
    name: string;
    layout: {
        chartType: string;
        tension: number;
        timeUnit?: string | number;
        interval?: string | number;
    };
}[];
export default class ViewStore {
    templateName = '';
    currentRoute = 'main';
    isInputActive = false;
    views: TViews = createObjectFromLocalStorage('cq-views') || [];
    routes = {
        add: () => this.saveViews(),
        main: () => this.updateRoute('add'),
        cancel: () => this.onCancel(),
        overwrite: () => this.overwrite(),
    };
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            templateName: observable,
            currentRoute: observable,
            isInputActive: observable,
            routes: observable,
            views: observable,
            sortedItems: computed,
            onChange: action.bound,
            onSubmit: action.bound,
            onCancel: action.bound,
            updateRoute: action.bound,
            saveViews: action.bound,
            overwrite: action.bound,
            remove: action.bound,
            removeAll: action.bound,
            applyLayout: action.bound,
            onToggleNew: action.bound,
            inputRef: action.bound,
            onFocus: action.bound,
            onBlur: action.bound
        });

        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'templates' });
        reaction(
            () => this.menuStore.dialogStore.open,
            () => {
                if (this.views.length === 0) {
                    this.updateRoute('new');
                } else {
                    this.updateRoute('main');
                }

                if (this.menuStore.dialogStore.open) {
                    this.templateName = '';
                }
            }
        );
    }

    mainStore: MainStore;
    menuStore: MenuStore;


    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get stx(): Context['stx'] {
        return this.context?.stx;
    }
    get loader() {
        return this.mainStore.loader;
    }

    get sortedItems() {
        return [...this.views].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    }

    updateLocalStorage() {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(this.views));
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        if (this.currentRoute === 'overwrite') {
            return;
        }
        this.templateName = e.target.value;
    }

    onSubmit(e: KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            this.saveViews();
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Save Template');
        }
    }

    onCancel() {
        this.templateName = '';
        this.updateRoute('main');
    }

    updateRoute(name: string) {
        this.currentRoute = name;
    }

    saveViews() {
        if (this.views.some(x => x.name.toLowerCase().trim() === this.templateName.toLowerCase().trim())) {
            this.updateRoute('overwrite');
        } else if (this.templateName.trim().length > 0) {
            this.updateRoute('main');
            const layout = this.stx.exportLayout();
            this.views.push({ name: this.templateName.trim(), layout });
            this.updateLocalStorage();
            this.templateName = '';
        }
    }

    overwrite() {
        const layout = this.stx.exportLayout();
        const templateIndex = this.views.findIndex(x => x.name.toLowerCase() === this.templateName.toLowerCase());
        this.views[templateIndex].layout = layout;
        this.views[templateIndex].name = this.templateName.trim();
        this.updateLocalStorage();
        this.updateRoute('main');
        this.templateName = '';
    }

    remove(idx: number, e: TCustomEvent) {
        this.views = this.sortedItems.filter((_x, index) => idx !== index);
        e.nativeEvent.is_item_removed = true;
        this.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove Template');
    }

    removeAll() {
        this.views = [];
        this.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove All Templates');
        this.updateRoute('new');
    }

    applyLayout(idx: number, e: TCustomEvent) {
        if (e.nativeEvent.is_item_removed) {
            return;
        }
        if (this.loader) {
            this.loader.show();
        }
        this.mainStore.state.setChartIsReady(false);
        const sortedItems = this.sortedItems[idx].layout;
        const stx = this.stx;
        const granularity = getIntervalInSeconds(sortedItems) as TGranularity;

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
            stx.importLayout(sortedItems, {
                managePeriodicity: true,
                preserveTicksAndCandleWidth: true,
                cb: finishImportLayout,
            });
            // This condition is to make spline chart appear as spline chart
            // Both line chart and spline chart are of type mountain but with different tensions
            let chartType = sortedItems.chartType;
            if (chartType === 'mountain') {
                const tension = sortedItems.tension;
                if (tension === 0.5) {
                    chartType = 'spline';
                }
            }
            this.mainStore.chartType.setType(chartType as string);
            this.mainStore.state.setChartType(chartType);
            this.menuStore.setOpen(false);
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Load Template');
        };
        setTimeout(importLayout, 100);
    }

    onToggleNew() {
        this.updateRoute('main');
    }

    inputRef(ref: HTMLElement | null) {
        if (ref) {
            ref.focus();
            this.isInputActive = true;
        }
    }

    onFocus() {
        this.isInputActive = true;
    }

    onBlur() {
        this.isInputActive = false;
    }
}
