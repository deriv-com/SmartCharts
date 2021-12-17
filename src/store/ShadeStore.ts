import { observable } from 'mobx';

export default class ShadeStore {
    _div: HTMLElement | null = null;
    @observable className = '';
    @observable visible = false;

    constructor(className: string) {
        this.className = className;
    }

    setPosition = ({ top, bottom, right }: Record<string, number>) => {
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

            this._div.style.transform = pos as string;
        }
    };

    setShadeRef = (ref: HTMLElement | null) => {
        this._div = ref;
    };
}
