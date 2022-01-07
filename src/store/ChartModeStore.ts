import MainStore from '.';
import MenuStore from './MenuStore';

export default class ChartModeStore {
    mainStore: MainStore;
    menuStore: MenuStore;
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'chart-mode' });
    }
}
