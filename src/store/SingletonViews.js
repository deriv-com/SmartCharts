import { observable } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';

let singletonViews = null;

class SingletonViews {
    constructor(mainStore) {
        if (!singletonViews) {
            singletonViews = this;
        }
        this.mainStore = mainStore;
        this.views = createObjectFromLocalStorage('cq-views') || [];
        return singletonViews;
    }

    @observable views = [];

    updateLocalStorage = () => {
        if (!this.mainStore.state.chartId) return;
        CIQ.localStorageSetItem('cq-views', JSON.stringify(this.views));
    }
}
export default SingletonViews;
