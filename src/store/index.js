import { observable } from 'mobx';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';

let main_store = null;

export default class MainStore {
    @observable timeperiod = new TimeperiodStore(this);
    @observable chart = new ChartStore(this);

    static get Instance() {
        if (!main_store) {
            main_store = new MainStore();
            window.main_store = main_store;
        }
        return main_store;
    }
}
