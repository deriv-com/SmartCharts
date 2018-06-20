import { observable, action, when } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';
import MenuStore from './MenuStore';
import DialogStore from './DialogStore';

export default class ViewStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore);
        this.dialog = new DialogStore(mainStore);
        when(() => this.context, this.onContextReady);
    }

    @observable templateName = '';
    @observable views = [];
    @observable routes = {
        current: 'main',
        add: () => this.saveViews(),
        main: () => this.updateRoute('add'),
        cancel: () => {this.updateRoute('main');this.dialog.setOpen(false,false)},
    };

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get loader() { return this.mainStore.loader; }

    onContextReady = () => {
        const views = createObjectFromLocalStorage('cq-views');
        if (views) { this.views = views; }
    }

    updateLocalStorage = () => {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(this.views));
    }

    @action.bound onChange(e) {
        this.templateName = e.target.value;
    }

    @action.bound onSubmit(e) {
        if (e.keyCode === 13) {
            this.saveViews();
        }
    }

    @action.bound updateRoute(name) {
        this.routes.current = name;
    }

    @action.bound saveViews() {
        if (this.views.some(x=>x.name.toLowerCase() === this.templateName.toLowerCase())){
            this.dialog.setOpen(true , false);
        }
        else if (this.templateName.length > 0) {
            this.updateRoute('main');
            const layout = this.stx.exportLayout();
            this.views.push({ name: this.templateName, layout });
            this.updateLocalStorage();
            this.templateName = '';
        }
    }

    @action.bound onOverwrite() {
        if (this.templateName.length > 0) {
            const layout = this.stx.exportLayout();
            var templateIndex = this.views.findIndex(x => x.name.toLowerCase() === this.templateName.toLowerCase());
            this.views[templateIndex].layout = layout;
            this.views[templateIndex].name = this.templateName;
            this.updateLocalStorage();
        }
        this.updateRoute('main');
        this.templateName = '';
        this.dialog.setOpen(false , false);
    }

    @action.bound remove(idx, e) {
        this.views.splice(idx, 1);
        e.nativeEvent.is_item_removed = true;
        this.updateLocalStorage();
    }

    @action.bound setOpen(value) {
        return this.dialog.setOpen(value);
    }

    applyLayout = (idx, e) => {
        if (e.nativeEvent.is_item_removed) { return; }
        if (this.loader) { this.loader.show(); }
        const stx = this.stx;

        const importLayout = () => {
            stx.importLayout(this.views[idx].layout, true, true);
            if (stx.changeCallback) { stx.changeCallback(stx, 'layout'); }
            stx.dispatch('layout', {
                stx,
            });
            if (this.loader) { this.loader.hide(); }
        };
        setTimeout(importLayout, 100);
    }

    inputRef = (ref) => {
        if (ref) { ref.focus(); }
    }
}
