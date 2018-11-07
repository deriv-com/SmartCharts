import { observable, action } from 'mobx';
import moment from 'moment';

export default class ChartHistory {
    @observable date = moment().format('DD MMMM YYYY');
    @observable time = 0;

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @action.bound onChange(date) {
        console.log('date', date);
    }
}
