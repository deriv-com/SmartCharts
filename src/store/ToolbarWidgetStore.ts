import { action, reaction, makeObservable } from 'mobx';
import MainStore from '.';

export default class ToolbarWidgetStore {
    mainStore: MainStore;
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    get chartStore() {
        return this.mainStore.chart;
    }

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            onMouseEnter: action.bound,
            onMouseLeave: action.bound
        });

        this.mainStore = mainStore;

        reaction(
            () => [
                this.mainStore.chartMode.menuStore.open,
                this.mainStore.drawTools.menuStore.open,
                this.mainStore.studies.menuStore.open,
                this.mainStore.share.menuStore.open,
                this.mainStore.view.menuStore.open,
            ],
            () => {
                // Check if all floating toolbar component dialog close
                if (
                    !this.mainStore.chartMode.menuStore.open &&
                    !this.mainStore.drawTools.menuStore.open &&
                    !this.mainStore.studies.menuStore.open &&
                    !this.mainStore.share.menuStore.open &&
                    !this.mainStore.view.menuStore.open
                ) {
                    this.onMouseLeave();
                }
            }
        );
    }

    onMouseEnter() {
        this.crosshairStore.updateVisibility(false);

        // Hide the indicator tooltip
        const chartNode = this.chartStore.chartNode;
        if (chartNode) {
            (chartNode.querySelector('.stx_sticky') as HTMLElement).style.display = 'none';
        }
    }

    onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
