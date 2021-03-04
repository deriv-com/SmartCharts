import { action, observable, reaction } from 'mobx';

export default class ScrollStore {
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isHover;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable scrollPanel;

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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound handleMouseOver() {
        if (!this.isHover) this.isHover = true;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound handleMouseOut() {
        if (this.isHover) this.isHover = false;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setScrollPanel(element: any) {
        if (!this.scrollPanel) this.scrollPanel = element;
    }
}
