import { observable, action, makeObservable } from 'mobx';

export default class AnimatedPriceStore {
    className = '';
    price = 0;
    isIncrease = false;
    status = '';
    oldPrice = 0;

    constructor() {
        makeObservable(this, {
            price: observable,
            isIncrease: observable,
            status: observable,
            setPrice: action.bound
        });
    }

    setPrice(val: number, prevPrice: number): void {
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
