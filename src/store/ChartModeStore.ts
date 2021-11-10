import { TMainStore } from 'src/types';
import MenuStore from './MenuStore';
import Menu from '../components/Menu';

export default class ChartModeStore {
    ChartTypeMenu: any;
    mainStore: TMainStore;
    menu: any;
    constructor(mainStore: TMainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'chart-mode' });
        this.ChartTypeMenu = this.menu.connect(Menu);
    }
}
