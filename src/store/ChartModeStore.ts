import MenuStore from './MenuStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';

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
