import { action, observable, reaction, makeObservable } from 'mobx';

export default class ScrollStore {
    isHover = false;
    scrollPanel?: HTMLElement;

    constructor() {
        makeObservable(this, {
            isHover: observable,
            scrollPanel: observable,
            handleMouseOver: action.bound,
            handleMouseOut: action.bound,
            setScrollPanel: action.bound
        });

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

    handleMouseOver() {
        if (!this.isHover) this.isHover = true;
    }
    handleMouseOut() {
        if (this.isHover) this.isHover = false;
    }

    setScrollPanel(element: HTMLElement) {
        if (!this.scrollPanel) this.scrollPanel = element;
    }
}
