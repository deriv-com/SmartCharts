import { observable, action } from 'mobx';

export default class LoaderStore {
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isActive = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable currentState = false;
    states = {};

    constructor() {
        this.states = {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            'chart-engine': t.translate('Retrieving Chart Engine...'),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            'market-symbol': t.translate('Retrieving Market Symbols...'),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            'trading-time': t.translate('Retrieving Trading Times...'),
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            'chart-data': t.translate('Retrieving Chart Data...'),
        };
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setState(state: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!this.states[state]) {
            console.error('Wrong state requested!');
            return;
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this.currentState = this.states[state];
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound show() {
        this.isActive = true;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound hide() {
        this.isActive = false;
    }
}
