import { when } from 'mobx';

export default class AssetInformationStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }
    get isTick() {
        return this.mainStore.timeperiod.timeUnit === 'tick';
    }

    get context() { return this.mainStore.chart.context; }
    get visible() { return !this.mainStore.chart.isMobile && this.mainStore.chartSetting.assetInformation; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.prepend('headsUpHR', this.update);
    };

    _container = null;
    _spot = null;
    _open = null;
    _close = null;
    _high = null;
    _low  = null;


    update = () => {
        // do not query dom on each frame
        if (!this._container) {
            this._container = this.context.topNode.querySelector('.ciq-asset-information');

            this._spot = this._container.querySelector('.ciq-ai-spot');
            this._open = this._container.querySelector('.ciq-ai-open');
            this._close = this._container.querySelector('.ciq-ai-close');
            this._high = this._container.querySelector('.ciq-ai-high');
            this._low = this._container.querySelector('.ciq-ai-low');
        }
        const container = this._container;

        if (!this.visible) {
            container.style.visibility = 'hidden';
            return;
        }

        const bar = this.stx.barFromPixel(this.stx.cx);
        const prices = this.stx.chart.xaxis[bar];

        if (!prices) {
            return;
        }


        const {
            Open, High, Low, Close,
        } = prices.data || { };

        if (!Open && !High && !Low && !Close) {
            container.style.visibility = 'hidden';
            return;
        }

        container.style.visibility = 'visible';

        if (this.isTick) {
            const children = container.children;
            const visibility = this.isTick ? 'hidden' : 'visible';

            for (let idx = 1; idx < children.length; ++idx) {
                children[idx].style.visibility = visibility;
            }
        }


        if (this._container) {
            this._open.textContent = (Open && !this.isTick) ? Open.toFixed(this.decimalPlaces) : '';
            this._high.textContent = (High && !this.isTick) ? High.toFixed(this.decimalPlaces) : '';
            this._low.textContent = (Low && !this.isTick) ? Low.toFixed(this.decimalPlaces) : '';
            this._close.textContent = (Close && !this.isTick) ? Close.toFixed(this.decimalPlaces) : '';
            this._spot.textContent = Close ? Close.toFixed(this.decimalPlaces) : null;
        }
    }
}
