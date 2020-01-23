import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import { downloadFileInBrowser } from '../utils';
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

export default class ShareStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route:'download' });
        when(() => this.context, this.onContextReady);
        this.Dialog = this.menu.connect(Menu);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @computed get timeUnit() { return this.mainStore.timeperiod.timeUnit; }
    @computed get timeperiodDisplay() { return this.mainStore.timeperiod.display; }
    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol.market_display_name;
    }
    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }
    @observable isLoadingPNG = false;

    createNewTab() {
        // Create a new tab for browsers that doesn't support HTML5 download attribute
        return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform) ? window.open() : null;
    }

    @action.bound downloadPNG() {
        this.isLoadingPNG = true;
        const newTab = this.createNewTab();

        import(/* webpackChunkName: "html2canvas" */ '../../chartiq/html2canvas.min.js')
            .then((html2canvas) => {
                // since react rerenders is not immediate, we use CIQ.appendClassName to
                // immediately append/unappend class name before taking screenshot.
                CIQ.appendClassName(this.screenshotArea, 'ciq-screenshot');
                html2canvas.default(this.screenshotArea).then(canvas => this._onCanvasReady(canvas, newTab));
            });

        logEvent(LogCategories.ChartControl, LogActions.Download, 'Download PNG');
    }

    @action.bound _onCanvasReady(canvas, newTab) {
        const content = canvas.toDataURL('image/png');
        downloadFileInBrowser(
            `${new Date().toUTCString()}.png`,
            content,
            'image/png;',
            newTab,
        );
        this.isLoadingPNG = false;
        CIQ.unappendClassName(this.screenshotArea, 'ciq-screenshot');
    }

    @action.bound downloadCSV() {
        const isTick = this.timeUnit === 'tick';
        const header = `Date,Time,${isTick ? this.marketDisplayName : 'Open,High,Low,Close'}`;
        const lines = [header];
        const totalItemCount = this.stx.masterData.length;
        const allowableItems = (totalItemCount <= 100)
            ? this.stx.masterData
            : this.stx.masterData.slice(totalItemCount - 100, totalItemCount);

        allowableItems.forEach(({ DT, Open, High, Low, Close }) => {
            const year = DT.getFullYear();
            const month = DT.getMonth() + 1; // months from 1-12
            const day = DT.getDate();
            const hours = DT.getHours();
            const minutes = DT.getMinutes();
            const seconds = DT.getSeconds();
            const formattedSeconds = seconds > 9 ? `:${seconds}` : `:0${seconds}`;

            const date = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
            const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}${isTick ? formattedSeconds : ''}`;
            if (isTick && Close) { lines.push(`${date},${time},${Close}`); }
            if (!isTick && Open && High && Low && Close) {
                lines.push([
                    date,
                    time,
                    Open.toFixed(this.decimalPlaces),
                    High.toFixed(this.decimalPlaces),
                    Low.toFixed(this.decimalPlaces),
                    Close.toFixed(this.decimalPlaces),
                ].join(','));
            }
        });
        downloadFileInBrowser(
            `${this.marketDisplayName} (${this.timeperiodDisplay}).csv`,
            lines.join('\n'),
            'text/csv;charset=utf-8;',
            this.createNewTab(),
        );

        logEvent(LogCategories.ChartControl, LogActions.Download, 'Download CSV');
    }

    onContextReady = () => {
        this.screenshotArea = this.context.topNode.querySelector('.ciq-chart');
    };
}
