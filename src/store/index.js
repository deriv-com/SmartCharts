import { observable } from 'mobx';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';
import ComparisonStore from './ComparisonStore';

export default class MainStore {
    @observable timeperiod = new TimeperiodStore(this);
    @observable chart = new ChartStore(this);
    @observable comparison = new ComparisonStore(this);
}
