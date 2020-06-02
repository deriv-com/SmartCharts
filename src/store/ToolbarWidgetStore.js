import { action, reaction } from 'mobx';

export default class ToolbarWidgetStore {
    get crosshairStore() { return this.mainStore.crosshair; }

    constructor(mainStore) {
        this.mainStore = mainStore;

        reaction(() => [
            this.mainStore.chartMode.menu.open,
            this.mainStore.drawTools.menu.open,
            this.mainStore.studies.menu.open,
            this.mainStore.share.menu.open,
            this.mainStore.view.menu.open,
        ], () => {
            // Check if all floating toolbar component dialog close
            if (
                !this.mainStore.chartMode.menu.open
                    && !this.mainStore.drawTools.menu.open
                    && !this.mainStore.studies.menu.open
                    && !this.mainStore.share.menu.open
                    && !this.mainStore.view.menu.open
            ) {
                this.onMouseLeave();
            }
        });
    }

    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
