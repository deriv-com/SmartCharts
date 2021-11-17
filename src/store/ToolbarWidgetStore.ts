import { action, reaction } from 'mobx';
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

    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);

        // Hide the indicator tooltip
        const chartNode = this.chartStore.chartNode;
        if (chartNode) {
            (chartNode.querySelector('.stx_sticky') as HTMLElement).style.display = 'none';
        }
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
