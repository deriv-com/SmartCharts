import { observable } from 'mobx';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';
import ChartTypeStore from './ChartTypeStore';
import TogglesStore from './TogglesStore';

export default class MainStore {
    @observable timeperiod = new TimeperiodStore(this);
    @observable chart = new ChartStore(this);
    @observable chartType = new ChartTypeStore(this);
    @observable toggles = new TogglesStore(this);
}
