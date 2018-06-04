import { observable, action } from 'mobx';
import { connect } from './Connect';

export default class AnimatedPriceStore {
    @observable price = '';
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
        this.isIncrease = isIncrease;
    }

    connect = connect(() => ({
        price: this.price,
        isIncrease: this.isIncrease,
        className: this.className,
    }));
}
