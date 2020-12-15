import MenuStore from './MenuStore';
import Menu from '../components/Menu.jsx';

export default class ChartModeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'chart-mode' });
        this.ChartTypeMenu = this.menu.connect(Menu);
    }
}
