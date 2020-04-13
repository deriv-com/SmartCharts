import { action } from 'mobx';

export default class ToolbarWidgetStore {
    get crosshairStore() { return this.mainStore.crosshair; }

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
