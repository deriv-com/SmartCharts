import { action, computed, observable, reaction, makeObservable, when } from 'mobx';
import { ChangeEvent, KeyboardEvent } from 'react';
import MainStore from '.';
import Context from '../components/ui/Context';
import { TCustomEvent, TGranularity, TLayout } from '../types';
import { clone, createObjectFromLocalStorage } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';

export type TViews = {
    name: string;
    layout: TLayout;
}[];
export default class ViewStore {
    templateName = '';
    currentRoute = 'main';
    isInputActive = false;
    views: TViews = createObjectFromLocalStorage('chart-views') || [];
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
            onBlur: action.bound,
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

    get loader() {
        return this.mainStore.loader;
    }

    get sortedItems() {
        return [...this.views].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    }

    updateLocalStorage() {
        localStorage.setItem('chart-views', JSON.stringify(this.views));
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

    getLayout(): TLayout {
        return {
            chartType: this.mainStore.state.chartType,
            granularity: this.mainStore.state.granularity,
            timeUnit: this.mainStore.state.timeperiodStore.timeUnit,
            studyItems: this.mainStore.studies.activeItems,
            crosshair: this.mainStore.crosshair.state,
            drawTools: this.mainStore.drawTools.activeToolsGroup,
            msPerPx: this.mainStore.chartAdapter.msPerPx,
        };
    }

    saveViews() {
        if (this.views.some(x => x.name.toLowerCase().trim() === this.templateName.toLowerCase().trim())) {
            this.updateRoute('overwrite');
        } else if (this.templateName.trim().length > 0) {
            this.updateRoute('main');

            this.views.push({ name: this.templateName.trim(), layout: clone(this.getLayout()) });
            this.updateLocalStorage();
            this.mainStore.drawTools.saveTemplate(this.templateName.trim());
            this.templateName = '';
        }
    }

    overwrite() {
        const layout = clone(this.getLayout());
        const templateIndex = this.views.findIndex(x => x.name.toLowerCase() === this.templateName.toLowerCase());
        this.views[templateIndex].layout = layout;
        this.views[templateIndex].name = this.templateName.trim();
        this.updateLocalStorage();
        this.updateRoute('main');
        this.templateName = '';
    }

    remove(idx: number, e: TCustomEvent) {
        this.mainStore.drawTools.removeTemplate(this.views[idx].name);
        this.views = this.sortedItems.filter((_x, index) => idx !== index);
        e.nativeEvent.is_item_removed = true;
        this.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove Template');
    }

    removeAll() {
        this.views = [];
        this.mainStore.drawTools.removeAllTemplate();
        this.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove All Templates');
        this.updateRoute('new');
    }

    applyLayout(
        idx: number,
        name: string,
        e: TCustomEvent,
        onGranularity: (granularity?: TGranularity) => void,
        onChartType: (chartType?: string) => void
    ) {
        if (e.nativeEvent.is_item_removed) {
            return;
        }
        this.mainStore.crosshair.updateVisibility(false);
        const { layout } = this.sortedItems[idx];

        onGranularity(layout.granularity);
        onChartType(layout.chartType);

        // to not show tooltip while chart is loading
        this.mainStore.crosshair.setCrosshairState(0);
        this.mainStore.drawTools.applyTemplate(name);
        this.restoreLayout(clone(layout));
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Load Template');
    }

    async restoreLayout(layout: TLayout) {
        const finishImportLayout = () => {
            if (this.loader) {
                this.loader.hide();
                this.mainStore.paginationLoader.updateOnPagination(false);
            }
            this.mainStore.state.setChartIsReady(true);

            if (layout.granularity !== undefined) {
                this.mainStore.timeperiod.setGranularity(layout.granularity);
            }
        };

        if (this.loader) {
            this.loader.show();
        }

        this.mainStore.chartAdapter.msPerPx = layout.msPerPx;

        this.mainStore.state.setChartIsReady(false);

        if (layout.chartType !== undefined) {
            this.mainStore.chartType.setChartType(layout.chartType);
        }
        this.menuStore.setOpen(false);

        await when(() => this.mainStore.chartAdapter.isChartLoaded);

        this.mainStore.studies.restoreStudies(layout.studyItems || []);

        if (typeof layout.crosshair === 'number') {
            this.mainStore.crosshair.setLayoutCrosshair(layout.crosshair);
        }

        finishImportLayout();
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
