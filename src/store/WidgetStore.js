import { observable, action, when } from 'mobx';

export default class WidgetStore {
    @observable stx;

    get chart() { return this.mainStore.chart; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => { this.stx = this.mainStore.chart.context.stx; };

    @action.bound onHome() {
        this.stx.home();
    }

    @action.bound onFullscreen() {
        if (document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen) {
            this.closeFullscreen();
        } else {
            this.openFullscreen();
        }
    }

    openFullscreen = () => {
        if (this.chart.rootNode.requestFullscreen) {
            this.chart.rootNode.requestFullscreen();
        } else if (this.chart.rootNode.mozRequestFullScreen) { /* Firefox */
            this.chart.rootNode.mozRequestFullScreen();
        } else if (this.chart.rootNode.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            this.chart.rootNode.webkitRequestFullscreen();
        } else if (this.chart.rootNode.msRequestFullscreen) { /* IE/Edge */
            this.chart.rootNode.msRequestFullscreen();
        }
    }

    closeFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}
