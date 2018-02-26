import { observable, observe, action, computed, reaction, autorunAsync } from 'mobx';
import { connect } from './Connect';

export default class AnimatedPriceStore {
    @observable price = '';
    @observable showStable = true;
    @observable isIncrease = false;
    oldPrice = '';

    @action.bound setPrice(val) {
        this.price = val;
        const oldVal = +this.oldPrice;
        const newVal = +this.price;
        let isIncrease = false;
        if (newVal > oldVal) {isIncrease = true;}
        else if (newVal === oldVal) {
            this.setShowStable(true);
            return false;
        }
        this.setShowStable(false);
        setTimeout(() => this.setShowStable(true), 0);
        this.oldPrice = this.price;
        this.isIncrease = isIncrease;
    }

    @action.bound setShowStable(val) {
        this.showStable = val;
    }

    connect = connect(() => ({
        price: this.price,
        showStable: this.showStable,
        isIncrease: this.isIncrease,
        className: this.className
    }));
}
