import { action, reaction } from 'mobx';

export default class ToolbarWidgetStore {
    mainStore: any;
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    get chartStore() {
        return this.mainStore.chart;
    }

    constructor(mainStore: any) {
        this.mainStore = mainStore;

        reaction(
            () => [
                this.mainStore.chartMode.menu.open,
                this.mainStore.drawTools.menu.open,
                this.mainStore.studies.menu.open,
                this.mainStore.share.menu.open,
                this.mainStore.view.menu.open,
            ],
            () => {
                // Check if all floating toolbar component dialog close
                if (
                    !this.mainStore.chartMode.menu.open &&
                    !this.mainStore.drawTools.menu.open &&
                    !this.mainStore.studies.menu.open &&
                    !this.mainStore.share.menu.open &&
                    !this.mainStore.view.menu.open
                ) {
                    this.onMouseLeave();
                }
            }
        );
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);

        // Hide the indicator tooltip
        const chartNode = this.chartStore.chartNode;
        if (chartNode) {
            chartNode.querySelector('.stx_sticky').style.display = 'none';
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }
}
