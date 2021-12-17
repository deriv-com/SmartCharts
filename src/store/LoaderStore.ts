import { observable, action } from 'mobx';

export default class LoaderStore {
    @observable isActive = false;
    @observable currentState: string | boolean = false;
    states: Record<string, string | boolean> = {};

    constructor() {
        this.states = {
            'chart-engine': t.translate('Retrieving Chart Engine...'),
            'market-symbol': t.translate('Retrieving Market Symbols...'),
            'trading-time': t.translate('Retrieving Trading Times...'),
            'chart-data': t.translate('Retrieving Chart Data...'),
        };
    }

    @action.bound setState(state: string) {
        if (!this.states[state]) {
            console.error('Wrong state requested!');
            return;
        }
        this.currentState = this.states[state];
    }

    @action.bound show() {
        this.isActive = true;
    }

    @action.bound hide() {
        this.isActive = false;
    }
}
