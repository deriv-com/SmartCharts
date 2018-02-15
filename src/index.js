/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import '../chartiq/splines';
import * as html2canvas from 'html2canvas';
import Chart from './components/Chart.jsx';
import ConnectionManager from './ConnectionManager';
import StreamManager from './StreamManager';
import {TradeEndLine, TradeStartLine} from './draw/DateLine';
import Barrier from './draw/Barrier';
import MainStore from './store';
import {MobxProvider} from './store/Connect';

// chartiq accesses html2canvas from global scope
window.html2canvas = html2canvas;

class BinaryChartiq {
    static addNewChart(params) {
        const chart = new BinaryChartiq(params);
        return chart;
    }

    get connectionManager() {
        return this.mainStore.chart.connectionManager;
    }

    set symbols(symbols) {
        this.mainStore.chart.setSymbols(symbols);
        // this.render({ symbols: symbols });
    }

    constructor({ selector, symbols }) {
        this.selector = selector;
        if (symbols) {this.symbols = symbols;}

        this.mainStore = new MainStore();
        this.render();
    }

    getChartEngine() {
        if (!this._stx) {
            const context = $$$('cq-context', $$$(this.selector));
            this._stx = context.CIQ.UI.context.stx;
        }

        return this._stx;
    }

    addTradeStartLine() {
        const start = new TradeStartLine({ stx: this.getChartEngine() });
        return start;
    }

    addTradeEndLine() {
        const end = new TradeEndLine({ stx: this.getChartEngine() });
        return end;
    }

    addBarrier() {
        const barrier = new Barrier({ stx: this.getChartEngine() });
        return barrier;
    }

    render(props) {
        ReactDOM.render(
            <MobxProvider store={this.mainStore}>
                <Chart />
            </MobxProvider>,
            $$$(this.selector),
        );
    }
}

export default BinaryChartiq;
