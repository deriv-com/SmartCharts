import { observable, action } from 'mobx';
import { connect } from './Connect';

export default class AnimatedPriceStore {
    className: any;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable price = '';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isIncrease = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable status = '';
    oldPrice = '';

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setPrice(val: any, prevPrice: any) {
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

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(() => ({
        price: this.price,
        isIncrease: this.isIncrease,
        status: this.status,
        className: this.className,
    }));
}
