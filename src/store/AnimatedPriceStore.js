import { observable, action } from 'mobx';
import { connect } from './Connect';

export default class AnimatedPriceStore {
    @observable price = '';
    @observable showStable = true;
    @observable isIncrease = false;
    oldPrice = '';

    @action.bound setPrice(val) {
        const oldVal = +this.oldPrice;
        const newVal = +val;
        let isIncrease = false;
        if (newVal > oldVal) {
            isIncrease = true;
        } else if (newVal === oldVal) {
            return;
        }
        this.price = val;
        this.oldPrice = this.price;
        this.showStable = false;
        setTimeout(this.enableShowStable, 150);
        this.isIncrease = isIncrease;
    }

    @action.bound enableShowStable() {
        this.showStable = true;
    }

    connect = connect(() => ({
        price: this.price,
        showStable: this.showStable,
        isIncrease: this.isIncrease,
        className: this.className,
    }));
}
