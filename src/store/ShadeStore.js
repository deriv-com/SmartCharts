import { observable } from 'mobx';
import { connect } from './Connect';

export default class ShadeStore {
    @observable top = 0;
    @observable bottom = 0;
    @observable isVisible = false;
    @observable className;

    constructor(shadeName) {
        this.className = shadeName;
    }

    connect = connect(() => ({
        top: this.top,
        bottom: this.bottom,
        isVisible: this.isVisible,
        className: this.className,
    }));
}
