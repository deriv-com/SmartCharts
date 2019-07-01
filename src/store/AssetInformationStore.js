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

    update = () => {
        const container = this.context.topNode.querySelector('.ciq-asset-information');
        if (!this.visible) {
            container.innerHTML = '';
            return;
        }

        const bar = this.stx.barFromPixel(this.stx.cx);
        const prices = this.stx.chart.xaxis[bar];

        if (!prices) { return; }

        const {
            Open, High, Low, Close,
        } = prices.data || { };
        const open = (Open && !this.isTick) ? Open.toFixed(this.decimalPlaces) : null;
        const high = (High && !this.isTick) ? High.toFixed(this.decimalPlaces) : null;
        const low = (Low && !this.isTick) ? Low.toFixed(this.decimalPlaces) : null;
        const close = (Close && !this.isTick) ? Close.toFixed(this.decimalPlaces) : null;
        const price = Close ? Close.toFixed(this.decimalPlaces) : null;

        // The value of the div is set by VanillaJS to improve the preformace of the chart.
        if (container) {
            container.innerHTML = `
                ${price ? `<div> <div>${t.translate('SPOT')}:</div> <div>${price}</div> </div>`  : ''}
                ${open  ? `<div> <div>${t.translate('OPEN')}:</div> <div>${open}</div> </div>`   : ''}
                ${close ? `<div> <div>${t.translate('CLOSE')}:</div> <div>${close}</div> </div>` : ''}
                ${high  ? `<div> <div>${t.translate('HIGH')}:</div> <div>${high}</div> </div>`   : ''}
                ${low   ? `<div> <div>${t.translate('LOW')}:</div> <div>${low}</div> </div>`     : ''}`;
        }
    }
}
