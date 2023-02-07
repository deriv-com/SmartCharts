import { action, computed, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TQuote } from 'src/types';
import MainStore from '.';
import { downloadFileInBrowser, is_browser } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import MenuStore from './MenuStore';

type TNodeToManipulate = {
    parent: ParentNode | null;
    child: HTMLElement | SVGSVGElement;
};

export default class ShareStore {
    mainStore: MainStore;
    menuStore: MenuStore;
    screenshotArea?: Element | null;

    isLoadingPNG = false;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            timeUnit: computed,
            timeperiodDisplay: computed,
            marketDisplayName: computed,
            decimalPlaces: computed,
            isLoadingPNG: observable,
            downloadPNG: action.bound,
            _onCanvasReady: action.bound,
            downloadCSV: action.bound,
        });

        this.mainStore = mainStore;
        this.menuStore = new MenuStore(mainStore, { route: 'download' });
        when(() => !!this.context, this.onContextReady);
    }

    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get stx(): Context['stx'] {
        return this.context?.stx;
    }

    get timeUnit() {
        return this.mainStore.timeperiod.timeUnit;
    }
    get timeperiodDisplay() {
        return this.mainStore.timeperiod.display;
    }
    get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol?.name;
    }
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol?.decimal_places;
    }

    createNewTab() {
        // Create a new tab for older iOS browsers that don't support HTML5 download attribute
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? window.open() : null;
    }

    downloadPNG() {
        this.isLoadingPNG = true;
        const newTab = this.createNewTab();

        import(/* webpackChunkName: "html2canvas" */ '../../chartiq/html2canvas.min.js' as string).then(html2canvas => {
            // since react rerenders is not immediate, we use CIQ.appendClassName to
            // immediately append/unappend class name before taking screenshot.
            this.screenshotArea?.classList.add('ciq-chart--screenshot');
            // There is no html2canvas version able to render our svgs on a screenshot (tried 0.5.0-beta4 as well),
            // the below workaround lets us temporarily replace svgs with imgs on canvas before taking a screenshot:
            const nodesToRecover: TNodeToManipulate[] = [];
            const nodesToRemove: TNodeToManipulate[] = [];
            const svgIcons = this.screenshotArea?.querySelectorAll('svg') || [];
            svgIcons.forEach(svg => {
                const parentNode = svg.parentNode;
                const canvas = document.createElement('canvas');
                canvas.width = Number(getComputedStyle(svg).width.match(/[0-9]+/));
                canvas.height = Number(getComputedStyle(svg).height.match(/[0-9]+/));
                const context = canvas.getContext('2d');
                const rgbColor = getComputedStyle(svg).fill;
                if (rgbColor) {
                    const hexColorDigitPart = rgbColor
                        .split(',')
                        .map(item => Number(item.replace(/\D+/g, '')).toString(16).padStart(2, '0'))
                        .join('');
                    if (context && hexColorDigitPart > '333333') {
                        context.fillStyle = getComputedStyle(svg).fill;
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        context.globalCompositeOperation = 'destination-in';
                    }
                }
                const image = new Image();
                image.src = svg.querySelector('use')?.getAttribute?.('xlink:href') || '';
                image.onload = () => {
                    if (context) {
                        context.drawImage(image, 0, 0);
                    }
                    if (!is_browser.Firefox() && !is_browser.Safari()) {
                        nodesToRecover.push({
                            parent: parentNode,
                            child: svg,
                        });
                        parentNode?.removeChild(svg);
                        nodesToRemove.push({
                            parent: parentNode,
                            child: canvas,
                        });
                        parentNode?.appendChild(canvas);
                    }
                };
            });

            setTimeout(() => {
                html2canvas.default(this.screenshotArea).then((canvas: HTMLCanvasElement) => {
                    this._onCanvasReady(canvas, newTab);
                    // replacing the added imgs on canvas back with svgs after downloading a screenshot:
                    if (!is_browser.Firefox() && !is_browser.Safari()) {
                        nodesToRemove.forEach(pair => {
                            if (pair?.parent?.contains(pair.child) && pair.child instanceof HTMLCanvasElement) {
                                pair.parent?.removeChild?.(pair.child);
                            }
                        });
                        nodesToRecover.forEach(pair => {
                            pair.parent?.appendChild(pair.child);
                        });
                    }
                });
            }, 100);
        });
        logEvent(LogCategories.ChartControl, LogActions.Download, 'Download PNG');
    }

    _onCanvasReady(canvas: HTMLCanvasElement, newTab: Window | null) {
        const content = canvas.toDataURL('image/png');
        downloadFileInBrowser(`${new Date().toUTCString()}.png`, content, 'image/png;', newTab);
        this.isLoadingPNG = false;
        this.screenshotArea?.classList.remove('ciq-chart--screenshot');
    }

    downloadCSV() {
        const isTick = this.timeUnit === 'tick';
        const header = `Date,Time,${isTick ? this.marketDisplayName : 'Open,High,Low,Close'}`;
        const lines = [header];
        const totalItemCount = this.stx.masterData.length;
        const allowableItems =
            totalItemCount <= 100
                ? this.stx.masterData
                : this.stx.masterData.slice(totalItemCount - 100, totalItemCount);

        allowableItems.forEach(({ DT, Open, High, Low, Close }: Required<TQuote>) => {
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
        this.screenshotArea = (this.context?.topNode as HTMLElement).querySelector('.ciq-chart');
    };
}
