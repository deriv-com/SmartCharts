import { observable, action, computed, when } from 'mobx';

export default class AssetInformationStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
    }

    @observable price = 0;
    @observable open = 0;
    @observable high = 0;
    @observable low = 0;
    @observable close = 0;
}
