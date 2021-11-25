import { observable, action } from 'mobx';

export default class AnimatedPriceStore {
    className = '';
    @observable price = 0;
    @observable isIncrease = false;
    @observable status = '';
    oldPrice = 0;

    @action.bound setPrice(val: number, prevPrice: number): void {
        const oldVal = prevPrice || +this.oldPrice;
        const newVal = +val;
        let isIncrease = false;
        if (newVal > oldVal) {
            isIncrease = true;
            this.status = 'up';
        } else if (newVal < oldVal) {
            this.status = 'down';
        } else {
            this.status = '';
            return;
        }
        this.price = val;
        this.oldPrice = this.price;
        this.isIncrease = isIncrease;
    }
}
