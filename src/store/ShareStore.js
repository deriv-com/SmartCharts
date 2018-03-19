import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import { downloadFileInBrowser, findAncestor } from './utils';

export default class ShareStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({getContext: () => this.mainStore.chart.context});

        when(() => this.context, this.onContextReady);
        reaction(() => this.menu.open, this.refereshShareLink);
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

    @observable copyTooltip = 'Copy to clipboard';
    @action.bound resetCopyTooltip() { this.copyTooltip = 'Copy to clipboard'; }
    onCopyDone = (successful) => {
        this.copyTooltip = successful ? 'Copied!' : 'Failed!';
    }

    @observable shareLink = '';
    refereshShareLink = () => {
        if(!this.context) { return; }

        const layoutData = this.stx.exportLayout(true);
        const json = JSON.stringify(layoutData);

        const origin = window.location.origin === 'http://localhost:8080' ?
            window.location.origin : 'https://charts.binary.com';
        this.shareLink = `${origin}#${encodeURIComponent(json)}`;
    }
    @action.bound downloadPNG() {
        this.menu.setOpen(false);
        const root = findAncestor(this.stx.container, 'ciq-chart-area');
        html2canvas(root).then((canvas) => {
            const content = canvas.toDataURL("image/png");
            downloadFileInBrowser(
                `${new Date().toUTCString()}.png`,
                content,
                'image/png;',
            );
        });
    }
    @action.bound downloadCSV() {
        const isTick = this.timeUnit === 'tick';
        const header = `Date,Time,${isTick ? this.marketDisplayName : 'Open,High,Low,Close'}`;
        const lines = [header];
        stx.masterData.forEach(row => {
            const {DT, Open, High, Low, Close} = row;

            const year = DT.getUTCFullYear();
            const month = DT.getUTCMonth() + 1; //months from 1-12
            const day = DT.getUTCDate();
            const hours = DT.getUTCHours();
            const minutes = DT.getUTCMinutes();
            // const seconds = DT.getUTCSeconds();

            const date = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
            const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
            if(isTick && Close) { lines.push(`${date},${time},${Close}`); }
            if(!isTick && Open && High && Low && Close) {
                lines.push([
                    date,
                    time,
                    Open.toFixed(this.decimalPlaces),
                    High.toFixed(this.decimalPlaces),
                    Low.toFixed(this.decimalPlaces),
                    Close.toFixed(this.decimalPlaces)
                ].join(','));
            }
        });

        downloadFileInBrowser(
            `${this.marketDisplayName} (${this.timeperiodDisplay}).csv`,
            lines.join('\n'),
            'text/csv;charset=utf-8;',
        );
    }

    copyWithExecCommand() {
        this.inputRef.focus();
        this.inputRef.select();

        let successful = false;
        try {
            successful = document.execCommand('copy');
        } catch (e) { }
        return successful;
    }
    copyWithNavigator() {
        const text = this.shareLink;
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    }


    @action.bound copyToClipboard() {
        this.refereshShareLink();
        if(!navigator.clipboard) {
            this.onCopyDone(this.copyWithExecCommand());
        } else {
            this.copyWithNavigator().then(this.onCopyDone);
        }
    }

    onInputRef = (ref) => this.inputRef = ref;
    onContextReady = () => { };
}

