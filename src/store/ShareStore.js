import { observable, action, reaction, computed, autorunAsync, when } from 'mobx';
import MenuStore from './MenuStore';
import { downloadFileInBrowser, findAncestor } from './utils';

export default class ShareStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({getContext: () => this.mainStore.chart.context});

        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @observable copyTooltip = 'Copy to clipboard';
    @action.bound resetCopyTooltip() { this.copyTooltip = 'Copy to clipboard'; }
    onCopyDone = (successful) => {
        this.copyTooltip = successful ? 'Copied!' : 'Failed!';
    }

    @computed get shareLink() {
        if(!this.context) {return '';}
        const layoutData = this.stx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        return `https://charts.binary.com?data=${encodeURIComponent(json)}`;
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
        if(!navigator.clipboard) {
            this.onCopyDone(this.copyWithExecCommand());
        } else {
            this.copyWithNavigator().then(this.onCopyDone);
        }
    }

    onInputRef = (ref) => this.inputRef = ref;
    onContextReady = () => { };
}
