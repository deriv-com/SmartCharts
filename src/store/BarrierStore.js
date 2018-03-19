import { observable, action, computed, when } from 'mobx';
import { connect } from './Connect';
import PriceLineStore from './PriceLineStore';
import PriceLine from '../components/PriceLine.jsx';

export default class BarrierStore {
    @observable visible = true;

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.highPriceLine = new PriceLineStore(mainStore);
        this.lowPriceLine = new PriceLineStore(mainStore);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get chart() { return this.stx.chart; }

    onContextReady = () => {

    };

    connect = connect(() => ({
        HighPriceLine: this.highPriceLine.connect(PriceLine),
        LowPriceLine: this.lowPriceLine.connect(PriceLine),
        visible: this.visible,
        className: this.className
    }));
}
