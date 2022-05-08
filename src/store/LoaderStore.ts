import { observable, action, makeObservable } from 'mobx';

export default class LoaderStore {
    isActive = false;
    currentState: string | boolean = false;
    states: Record<string, string | boolean> = {};

    constructor() {
        makeObservable(this, {
            isActive: observable,
            currentState: observable,
            setState: action.bound,
            show: action.bound,
            hide: action.bound
        });

        this.states = {
            'chart-engine': t.translate('Retrieving Chart Engine...'),
            'market-symbol': t.translate('Retrieving Market Symbols...'),
            'trading-time': t.translate('Retrieving Trading Times...'),
            'chart-data': t.translate('Retrieving Chart Data...'),
        };
    }

    setState(state: string) {
        if (!this.states[state]) {
            console.error('Wrong state requested!');
            return;
        }
        this.currentState = this.states[state];
    }

    show() {
        this.isActive = true;
    }

    hide() {
        this.isActive = false;
    }
}
