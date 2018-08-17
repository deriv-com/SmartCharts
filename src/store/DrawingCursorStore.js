import { action, observable, when } from 'mobx';

export default class DrawingCursorStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @observable isDrawing;
    @observable top;
    @observable left;
    @observable display;

    onContextReady = () => {
        this.stx.append('mousemoveinner', this.onMouseMove);
        this.stx.container.addEventListener('touchend', this.onTouchEnd);
    };

    @action.bound onMouseMove = (epX, epY) => {
        this.isDrawing = this.stx.currentVectorParameters.vectorType;

        if (this.isDrawing) {
            this.display = 'block';
            this.left = epX;
            this.top = epY - 16;
        } else {
            this.display = 'none';
        }
    }

    @action.bound onTouchEnd = () => {
        // A delay is needed to remove drawing cursor after drawing ends on touch end in mobile
        setTimeout(this.updateDisplay, 500);
    }

    @action.bound updateDisplay = () => {
        this.isDrawing = this.stx.currentVectorParameters.vectorType;
        if (!this.isDrawing) {
            this.display = 'none';
        }
    }
}
