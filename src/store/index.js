import { observable } from 'mobx';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';
import ChartTypeStore from './ChartTypeStore';
import TogglesStore from './TogglesStore';
import StudyLegendStore from './StudyLegendStore';
import ComparisonStore from './ComparisonStore';
import ChartTitleStore from './ChartTitleStore';

export default class MainStore {
    @observable timeperiod = new TimeperiodStore(this);
    @observable chart = new ChartStore(this);
    @observable chartType = new ChartTypeStore(this);
    @observable toggles = new TogglesStore(this);
    @observable studies = new StudyLegendStore(this);
    @observable comparison = new ComparisonStore(this);
    @observable chartTitle = new ChartTitleStore(this);
}
