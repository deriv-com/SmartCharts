import { action, reaction } from 'mobx';
import { TMainStore } from 'src/types';

export default class ToolbarWidgetStore {
    mainStore: TMainStore;
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    get chartStore() {
        return this.mainStore.chart;
    }

    constructor(mainStore: TMainStore) {
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
            chartNode.querySelector('.stx_sticky').style.display = 'none';
        }
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
