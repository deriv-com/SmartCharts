import { TMainStore } from 'src/types';
import MenuStore from './MenuStore';

export default class ChartModeStore {
    mainStore: TMainStore;
    menuStore: MenuStore;
    constructor(mainStore: TMainStore) {
        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'chart-mode' });
    }
}
