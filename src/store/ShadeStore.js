import { observable } from 'mobx';

export default class ShadeStore {
    @observable top = 0;

    @observable bottom = 0;

    @observable visible = false;

    clone() {
        return {
            top: this.top,
            bottom: this.bottom,
            visible: this.visible,
        };
    }
}
