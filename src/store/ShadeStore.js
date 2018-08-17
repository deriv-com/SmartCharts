import { observable } from 'mobx';
import { connect } from './Connect';

export default class ShadeStore {
    @observable top = 0;
    @observable bottom = 0;
    @observable visible = false;
    @observable className = '';

    constructor(className)  {
        this.className = className;
    }

    connect = connect(() => ({
        top: this.top,
        bottom: this.bottom,
        visible: this.visible,
        className: this.className,
    }));
}
