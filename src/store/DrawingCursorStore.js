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
        this.stx.container.addEventListener('mousemove', this.onMouseMove);
        this.stx.container.addEventListener('touchmove', this.onMouseMove);
        this.stx.container.addEventListener('touchend', this.onTouchEnd);
    };

    @action.bound onMouseMove = (e) => {
        e.preventDefault();
        this.isDrawing = this.stx.currentVectorParameters.vectorType;
        const crosshairX = this.stx.container.getElementsByClassName('stx_crosshair_x')[0];
        const crosshairY = this.stx.container.getElementsByClassName('stx_crosshair_y')[0];

        if (this.isDrawing) {
            this.display = 'block';
            this.left = `${crosshairX.offsetLeft}px`;
            this.top = `${crosshairY.offsetTop - 16}px`;
        } else {
            this.display = 'none';
        }
    }

    @action.bound onTouchEnd = (e) => {
        e.preventDefault();
        setTimeout(() => {
            this.updateDisplay();
        }, 500);
    }

    @action.bound updateDisplay = () => {
        this.isDrawing = this.stx.currentVectorParameters.vectorType;
        if (!this.isDrawing) {
            this.display = 'none';
        }
    }
}
