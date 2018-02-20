import { observable } from 'mobx';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';
import ChartTypeStore from './ChartTypeStore';
import TogglesStore from './TogglesStore';
import ComparisonStore from './ComparisonStore';

export default class MainStore {
    @observable timeperiod = new TimeperiodStore(this);
    @observable chart = new ChartStore(this);
    @observable comparison = new ComparisonStore(this);
    @observable chartType = new ChartTypeStore(this);
    @observable toggles = new TogglesStore(this);
}
