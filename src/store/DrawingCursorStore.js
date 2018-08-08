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
        this.crosshairX = this.stx.container.querySelector('.stx_crosshair_x');
        this.crosshairY = this.stx.container.querySelector('.stx_crosshair_y');
        this.stx.container.addEventListener('mousemove', this.onMouseMove);
        this.stx.container.addEventListener('touchmove', this.onMouseMove);
        this.stx.container.addEventListener('touchend', this.onTouchEnd);
    };

    @action.bound onMouseMove = (e) => {
        e.preventDefault();
        this.isDrawing = this.stx.currentVectorParameters.vectorType;

        if (this.isDrawing) {
            this.display = 'block';
            this.left = `${this.crosshairX.offsetLeft}px`;
            this.top = `${this.crosshairY.offsetTop - 16}px`;
        } else {
            this.display = 'none';
        }
    }

    @action.bound onTouchEnd = (e) => {
        e.preventDefault();
        // A delay is needed to remove drawing cursor after drawing ends on touch end in mobile
        setTimeout(this.updateDisplay(), 500);
    }

    @action.bound updateDisplay = () => {
        this.isDrawing = this.stx.currentVectorParameters.vectorType;
        if (!this.isDrawing) {
            this.display = 'none';
        }
    }
}
