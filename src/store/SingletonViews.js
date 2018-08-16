import { observable } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';

let singletonViews = null;

class SingletonViews {
    constructor() {
        if (!singletonViews) {
            singletonViews = this;
        }
        this.views = createObjectFromLocalStorage('cq-views') || [];
        return singletonViews;
    }

    @observable views = [];

    updateLocalStorage = () => {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(this.views));
    }
}
export default SingletonViews;
