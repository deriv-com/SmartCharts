import { observable, action } from 'mobx';

export default class ChartHistory {
    @observable date;

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound onChange(date) {
        console.log('date', date);
    }
}
