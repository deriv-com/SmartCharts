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
        console.warn('todo csv');
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
