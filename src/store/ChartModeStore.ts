import MainStore from '.';
import MenuStore from './MenuStore';
import Menu, { TMenuProps } from '../components/Menu';
import { TReactComponent } from './Connect';

export default class ChartModeStore {
    ChartTypeMenu: TReactComponent<TMenuProps>;
    mainStore: MainStore;
    menu: MenuStore;
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'chart-mode' });
        this.ChartTypeMenu = this.menu.connect(Menu as React.FC<TMenuProps>);
    }
}
