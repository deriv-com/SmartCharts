import MenuStore from './MenuStore';
import Menu from '../components/Menu';

export default class ChartModeStore {
    ChartTypeMenu: any;
    mainStore: any;
    menu: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'chart-mode' });
        this.ChartTypeMenu = this.menu.connect(Menu);
    }
}
