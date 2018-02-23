import { observable, observe, action, computed, reaction, autorunAsync } from 'mobx';

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
        if (newVal > oldVal) isIncrease = true;
        else if (newVal === oldVal) {
            this.showStable = true;
            return false;
        }
        this.showStable = false;
        setTimeout(() => {
            this.showStable = true;
        }, 0);
        this.oldPrice = this.price;
        this.isIncrease = isIncrease;
    }
}
