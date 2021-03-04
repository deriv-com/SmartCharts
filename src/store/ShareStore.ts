import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import { downloadFileInBrowser } from '../utils';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

export default class ShareStore {
    Dialog: any;
    mainStore: any;
    menu: any;
    screenshotArea: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route: 'download' });
        when(() => this.context, this.onContextReady);
        this.Dialog = this.menu.connect(Menu);
    }

    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get timeUnit() {
        return this.mainStore.timeperiod.timeUnit;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get timeperiodDisplay() {
        return this.mainStore.timeperiod.display;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol.name;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isLoadingPNG = false;

    createNewTab() {
        // Create a new tab for browsers that doesn't support HTML5 download attribute
        return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform) ? window.open() : null;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound downloadPNG() {
        this.isLoadingPNG = true;
        const newTab = this.createNewTab();

        // @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
        import(/* webpackChunkName: "html2canvas" */ '../../chartiq/html2canvas.min.js').then(html2canvas => {
            // since react rerenders is not immediate, we use CIQ.appendClassName to
            // immediately append/unappend class name before taking screenshot.
            this.screenshotArea.classList.add('ciq-chart--screenshot');
            setTimeout(() => {
                html2canvas.default(this.screenshotArea).then((canvas: any) => this._onCanvasReady(canvas, newTab));
            }, 0);
        });

        logEvent(LogCategories.ChartControl, LogActions.Download, 'Download PNG');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound _onCanvasReady(canvas: any, newTab: any) {
        const content = canvas.toDataURL('image/png');
        downloadFileInBrowser(`${new Date().toUTCString()}.png`, content, 'image/png;', newTab);
        this.isLoadingPNG = false;
        this.screenshotArea.classList.remove('ciq-chart--screenshot');
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound downloadCSV() {
        const isTick = this.timeUnit === 'tick';
        const header = `Date,Time,${isTick ? this.marketDisplayName : 'Open,High,Low,Close'}`;
        const lines = [header];
        const totalItemCount = this.stx.masterData.length;
        const allowableItems =
            totalItemCount <= 100
                ? this.stx.masterData
                : this.stx.masterData.slice(totalItemCount - 100, totalItemCount);

        allowableItems.forEach(({
            DT,
            Open,
            High,
            Low,
            Close,
        }: any) => {
            const year = DT.getFullYear();
            const month = DT.getMonth() + 1; // months from 1-12
            const day = DT.getDate();
            const hours = DT.getHours();
            const minutes = DT.getMinutes();
            const seconds = DT.getSeconds();
            const formattedSeconds = seconds > 9 ? `:${seconds}` : `:0${seconds}`;

            const date = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
            const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}${
                isTick ? formattedSeconds : ''
            }`;
            if (isTick && Close) {
                lines.push(`${date},${time},${Close}`);
            }
            if (!isTick && Open && High && Low && Close) {
                lines.push(
                    [
                        date,
                        time,
                        Open.toFixed(this.decimalPlaces),
                        High.toFixed(this.decimalPlaces),
                        Low.toFixed(this.decimalPlaces),
                        Close.toFixed(this.decimalPlaces),
                    ].join(',')
                );
            }
        });
        downloadFileInBrowser(
            `${this.marketDisplayName} (${this.timeperiodDisplay}).csv`,
            lines.join('\n'),
            'text/csv;charset=utf-8;',
            this.createNewTab()
        );

        logEvent(LogCategories.ChartControl, LogActions.Download, 'Download CSV');
    }

    onContextReady = () => {
        this.screenshotArea = this.context.topNode.querySelector('.ciq-chart');
    };
}
