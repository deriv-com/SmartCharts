import { observable, action } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';
import MenuStore from './MenuStore';
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

export default class ViewStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'templates' });
        this.ViewsMenu = this.menu.connect(Menu);
    }

    @observable static views = createObjectFromLocalStorage('cq-views') || [];
    @observable scrollPanel;
    @observable templateName = '';
    @observable currentRoute = 'main';
    @observable routes = {
        add: () => this.saveViews(),
        main: () => this.updateRoute('add'),
        cancel: () => this.onCancel(),
        overwrite: () => this.overwrite(),
    };

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get loader() { return this.mainStore.loader; }

    static updateLocalStorage() {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(ViewStore.views));
    }

    @action.bound onChange(e) {
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
        if (ViewStore.views.some(x => x.name.toLowerCase() === this.templateName.toLowerCase())) {
            this.updateRoute('overwrite');
        } else if (this.templateName.length > 0) {
            this.updateRoute('main');
            const layout = this.stx.exportLayout();
            ViewStore.views.push({ name: this.templateName, layout });
            ViewStore.updateLocalStorage();
            this.templateName = '';
        }
    }

    @action.bound overwrite() {
        const layout = this.stx.exportLayout();
        const templateIndex = ViewStore.views.findIndex(x => x.name.toLowerCase() === this.templateName.toLowerCase());
        ViewStore.views[templateIndex].layout = layout;
        ViewStore.views[templateIndex].name = this.templateName;
        ViewStore.updateLocalStorage();
        this.updateRoute('main');
        this.templateName = '';
    }

    @action.bound remove(idx, e) {
        ViewStore.views = ViewStore.views.filter((x, index) => idx !== index);
        e.nativeEvent.is_item_removed = true;
        ViewStore.updateLocalStorage();
        logEvent(LogCategories.ChartControl, LogActions.Template, 'Remove Template');
    }

    @action.bound applyLayout(idx, e) {
        if (e.nativeEvent.is_item_removed) { return; }
        if (this.loader) { this.loader.show(); }
        const stx = this.stx;

        const importLayout = () => {
            const finishImportLayout = () => {
                stx.changeOccurred('layout');
                this.mainStore.studies.updateActiveStudies();
                if (this.loader) { this.loader.hide(); }
            };
            stx.importLayout(ViewStore.views[idx].layout, {
                managePeriodicity: true,
                preserveTicksAndCandleWidth: true,
                cb: finishImportLayout,
            });
            this.menu.setOpen(false);
            logEvent(LogCategories.ChartControl, LogActions.Template, 'Load Template');
        };
        setTimeout(importLayout, 100);
    }

    inputRef = (ref) => {
        if (ref) {
            ref.focus();
        }
    }
}
