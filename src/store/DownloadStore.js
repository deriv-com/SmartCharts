import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import { loadScript, downloadFileInBrowser } from '../utils';
import PendingPromise from '../utils/PendingPromise';
import Menu from '../components/Menu.jsx';

const html2canvasCDN = 'https://charts.binary.com/dist/html2canvas.min.js';

export default class DownloadStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route:'download' });
        when(() => this.context, this.onContextReady);
        this.ShareMenu = this.menu.connect(Menu);
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

    loadHtml2Canvas() {
        if (this._promise_html2canas) {
            return this._promise_html2canvas;
        }
        this._promise_html2canvas = new PendingPromise();
        loadScript(html2canvasCDN, () => this._promise_html2canvas.resolve());
        return this._promise_html2canvas;
    }

    @action.bound downloadPNG() {
        this.isLoadingPNG = true;
        this.loadHtml2Canvas()
            .then(() => window.html2canvas(this.screenshotArea))
            .then(() => {
                // since react rerenders is not immediate, we use CIQ.appendClassName to
                // immediately append/unappend class name before taking screenshot.
                CIQ.appendClassName(this.screenshotArea, 'ciq-screenshot');
                window.html2canvas(this.screenshotArea).then(this._onCanvasReady);
            });
    }

    @action.bound _onCanvasReady(canvas) {
        const content = canvas.toDataURL('image/png');
        downloadFileInBrowser(
            `${new Date().toUTCString()}.png`,
            content,
            'image/png;',
        );
        this.isLoadingPNG = false;
        CIQ.unappendClassName(this.screenshotArea, 'ciq-screenshot');
    }

    @action.bound downloadCSV() {
        const isTick = this.timeUnit === 'tick';
        const header = `Date,Time,${isTick ? this.marketDisplayName : 'Open,High,Low,Close'}`;
        const lines = [header];
        this.stx.masterData.forEach((row) => {
            const {
                DT, Open, High, Low, Close,
            } = row;

            const year = DT.getUTCFullYear();
            const month = DT.getUTCMonth() + 1; // months from 1-12
            const day = DT.getUTCDate();
            const hours = DT.getUTCHours();
            const minutes = DT.getUTCMinutes();
            // const seconds = DT.getUTCSeconds();

            const date = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
            const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
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
        );
    }

    onContextReady = () => {
        this.screenshotArea = this.context.topNode.querySelector('.ciq-chart');
    };
}
