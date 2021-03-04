import { observable } from 'mobx';
import { connect } from './Connect';

export default class ShadeStore {
    _div: any;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable className = '';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable visible = false;

    setPosition = ({
        top,
        bottom,
        right,
    }: any) => {
        if (this._div) {
            let pos = null;
            if (bottom && top) {
                // between shade
                const y = (bottom + top) / 2 + 60;
                // manually scale from default 120px (_barrier.scss)
                const scale = (bottom - top) / 120.0;
                pos = `translate(${-right}px, ${y}px) scale(1, ${scale})`;
            } else if (bottom) {
                // above shade
                pos = `translate(${-right}px, ${bottom}px)`;
            } else if (top) {
                // below shade
                pos = `translate(${-right}px, ${top + 120}px)`;
            }

            this._div.style.transform = pos;
        }
    };

    constructor(className: any) {
        this.className = className;
    }

    setShadeRef = (ref: any) => {
        this._div = ref;
    };

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(() => ({
        visible: this.visible,
        className: this.className,
        setShadeRef: this.setShadeRef,
    }));
}
