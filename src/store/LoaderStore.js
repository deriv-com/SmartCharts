import { observable, action } from 'mobx';


export default class LoaderStore {
    @observable isActive = false;
    @observable currentState = false;
    states = {};

    constructor() {
        this.states = {
            'chart-engine': t.translate('Retrieving Chart Engine...'),
            'market-symbol': t.translate('Retrieving market symbols...'),
            'trading-time': t.translate('Retrieving trading times...'),
            'chart-data': t.translate('Retrieving Chart Data...'),
        };
    }

    @action.bound setState(_state) {
        if (!this.states[_state]) {
            console.error('Wrong state requested!');
            return;
        }
        this.currentState = this.states[_state];
    }

    @action.bound show() {
        this.isActive = true;
    }

    @action.bound hide() {
        this.isActive = false;
    }
}
