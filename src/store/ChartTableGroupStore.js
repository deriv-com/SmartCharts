import { observable, action } from 'mobx';

export default class ChartTableGroupStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @observable classname = '';
    @observable top = 0;

    @action.bound updateProps({ ele, item }) {
        const boundingClient = ele.getBoundingClientRect();

        if (this.top !== boundingClient.top) {
            this.top = boundingClient.top;
            this.updateOnScroll(item.key, boundingClient);
        }
    }

    @action.bound updateOnScroll(key, bound) {
        const heightOffset = 90;
        const groupTitleHeight = 44;
        let classname = '';

        const fromTop = bound.top - heightOffset;
        const fromBottom = bound.height + bound.top - heightOffset - groupTitleHeight;

        if (fromTop <= 0 && fromBottom >= 0) {
            classname = 'sticky-top';
        } else if (fromTop <= 0 && fromBottom <= 0  && fromBottom > -44) {
            classname = 'sticky-bottom';
        }

        this.classname = classname;
    }
}
