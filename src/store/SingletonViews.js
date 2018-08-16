import { observable } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';

let instance = null;

class SingletonViews {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.views = createObjectFromLocalStorage('cq-views') || [];

        return instance;
    }

    @observable views = [];

    updateLocalStorage = () => {
        CIQ.localStorageSetItem('cq-views', JSON.stringify(this.views));
    }

    get views() {
        return this._views;
    }

    set views(value) {
        CIQ.localStorageSetItem('cq-views', value);
        this._views = value;
    }
}
export default SingletonViews;
