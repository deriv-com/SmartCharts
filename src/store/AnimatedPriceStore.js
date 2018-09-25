import { observable, action } from 'mobx';
import { connect } from './Connect';

export default class AnimatedPriceStore {
    @observable price = '';
    @observable isIncrease = false;
    @observable status = '';
    oldPrice = '';

    @action.bound setPrice(val, prevPrice) {
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

    connect = connect(() => ({
        price: this.price,
        isIncrease: this.isIncrease,
        status: this.status,
        className: this.className,
    }));
}
