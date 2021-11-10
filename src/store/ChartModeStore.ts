import { TMainStore } from 'src/types';
import MenuStore from './MenuStore';
import Menu, { TMenuProps } from '../components/Menu';
import { TMainStore } from '../types';
import { TReactComponent } from './Connect';

export default class ChartModeStore {
    ChartTypeMenu: React.ReactNode;
    mainStore: TMainStore;
    menu: MenuStore;
    constructor(mainStore: TMainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'chart-mode' });
        this.ChartTypeMenu = this.menu.connect(Menu as TReactComponent<TMenuProps>);
    }
}
