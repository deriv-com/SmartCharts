import { action, observable, reaction } from 'mobx';

export default class ScrollStore {
    @observable isHover = false;
    @observable scrollPanel?: HTMLElement;

    constructor() {
        reaction(
            () => this.scrollPanel,
            () => {
                if (!this.scrollPanel) {
                    return;
                }
                this.scrollPanel.addEventListener('mouseover', this.handleMouseOver);
                this.scrollPanel.addEventListener('mouseout', this.handleMouseOut);
            }
        );
    }

    @action.bound handleMouseOver() {
        if (!this.isHover) this.isHover = true;
    }
    @action.bound handleMouseOut() {
        if (this.isHover) this.isHover = false;
    }

    @action.bound setScrollPanel(element: HTMLElement) {
        if (!this.scrollPanel) this.scrollPanel = element;
    }
}
