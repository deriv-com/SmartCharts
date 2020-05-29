import { observable } from 'mobx';
import { connect } from './Connect';

export default class ShadeStore {
    @observable className = '';
    @observable visible = false;

    setPosition = ({
        top,
        bottom,
        right,
    }) => {
        if (this._div) {
            let pos = null;
            if (bottom && top) { // between shade
                const y = (bottom + top) / 2 + 60;
                // manually scale from default 120px (_barrier.scss)
                const scale = (bottom - top) / 120.0;
                pos = `translate(${-right}px, ${y}px) scale(1, ${scale})`;
            } else if (bottom) { // above shade
                pos = `translate(${-right}px, ${bottom}px)`;
            } else if (top) { // below shade
                pos = `translate(${-right}px, ${top + 120}px)`;
            }

            this._div.style.transform = pos;
        }
    }

    constructor(className)  {
        this.className = className;
    }

    setShadeRef = (ref) =>  {
        this._div = ref;
    }

    connect = connect(() => ({
        visible: this.visible,
        className: this.className,
        setShadeRef: this.setShadeRef,
    }));
}
