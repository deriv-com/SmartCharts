import { observable, action } from 'mobx';
import TimeperiodStore from './TimeperiodStore';

let main_store = null;

export default class MainStore {
    @observable timeperiod = new TimeperiodStore();

    static get Instance() {
        if (!main_store) {
            main_store = new MainStore();
            window.main_store = main_store;
        }
        return main_store;
    }
}
