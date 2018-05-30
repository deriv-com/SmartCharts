import html2canvas from 'html2canvas';
import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import { downloadFileInBrowser, findAncestor } from './utils';

export default class ShareStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({ getContext: () => this.mainStore.chart.context });

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

    defaultCopyTooltipText = t.translate('Copy to clipboard');
    @observable copyTooltip = this.defaultCopyTooltipText;
    @action.bound resetCopyTooltip() { this.copyTooltip = this.defaultCopyTooltipText; }
    onCopyDone = (successful) => {
        this.copyTooltip = successful ? t.translate('Copied!') : t.translate('Failed!');
    }
    bitlyUrl = 'https://api-ssl.bitly.com/v3';
    accessToken = '837c0c4f99fcfbaca55ef9073726ef1f6a5c9349';
    @observable loading = false;
    @observable urlGenerated = false;
    @observable shortUrlFailed = false;


    @observable shareLink = '';

    fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
    }
    refereshShareLink = () => {
        let self = this;
        if (!this.context || !this.menu.dialog.open) { return; }

        const layoutData = this.stx.exportLayout(true);
        layoutData.favorites = [];

        const json = JSON.stringify(layoutData);
        const parts = json.match(/.{1,1800}/g);

        this.shortUrlFailed = false;
        this.loading = true;
        this.shareLink = '';

        let hashPromise = Promise.resolve('NONE');
        parts.forEach((part) => {
            hashPromise = hashPromise.then(hash => this.shortenBitlyAsync(part, hash));
        });

        hashPromise
            .then((hash) => {
                if (hash) {
                    self.shareLink = `https://bit.ly/${hash}`;
                    self.urlGenerated = true;
                } else {
                    self.shortUrlFailed = true;
                    self.urlGenerated = false;
                }
                self.loading = false;
            })
            .catch((error) => {
                self.loading = false;
                self.urlGenerated = false;
            });
    }
    shortenBitlyAsync(payload, hash) {
        const href = window.location.href;
        let origin = (this.shareOrigin && href.startsWith(this.shareOrigin)) ? href : this.shareOrigin;
        origin = origin.replace('localhost', '127.0.0.1'); // make it work on localhost

        const shareLink = encodeURIComponent(`${origin}?${hash}#${payload}`);

        return fetch(`${this.bitlyUrl}/shorten?access_token=${this.accessToken}&longUrl=${shareLink}`)
            .then(response => response.json())
            .then((response) =>  {
                if (response.status_code == 200) {
                    return response.data.url.split('bit.ly/')[1];
                }
                return null;
            });
    }
    expandBitlyAsync(hash, payload) {
        if (hash === 'NONE') {
            return Promise.resolve(payload);
        }
        const bitlyLink = `${window.location.protocol}//bit.ly/${hash}`;
        return fetch(`${this.bitlyUrl}/expand?access_token=${this.accessToken}&shortUrl=${bitlyLink}`)
            .then(response => response.json())
            .then((response) =>  {
                if (response.status_code === 200) {
                    const href = response.data.expand[0].long_url;
                    const encodedJsonPart = href.split('#').slice(1).join('#');
                    const url = href.split('#')[0];
                    const hash = url.split('?')[1];

                    payload = decodeURIComponent(encodedJsonPart) + payload;

                    if (hash == 'NONE') {
                        return payload;
                    }
                    return this.expandBitlyAsync(hash, payload);
                }
                return null;
            });
    }
    @action.bound downloadPNG() {
        this.menu.setOpen(false);
        const root = findAncestor(this.stx.container, 'ciq-chart-area');
        html2canvas(root).then((canvas) => {
            const content = canvas.toDataURL('image/png');
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
        if (!navigator.clipboard) {
            this.onCopyDone(this.copyWithExecCommand());
        } else {
            this.copyWithNavigator().then(this.onCopyDone);
        }
    }

    onInputRef = (ref) => { this.inputRef = ref; }
    onContextReady = () => { };
}

