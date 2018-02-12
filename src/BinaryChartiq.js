/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import '../chartiq/splines';
import * as html2canvas from 'html2canvas';
import Chart from './components/Chart.jsx';
import ConnectionManager from './ConnectionManager';
import StreamManager from './StreamManager';

// chartiq accesses html2canvas from global scope
window.html2canvas = html2canvas;

class BinaryChartiq {
    static addNewChart(params) {
        const chart = new BinaryChartiq(params);
        return chart;
    }

    static initConnection() {
        if (BinaryChartiq._connectionManager === undefined) {
            BinaryChartiq._connectionManager = new ConnectionManager({
                appId: 1,
                language: 'en',
                endpoint: 'wss://frontend.binaryws.com/websockets/v3',
            });
            BinaryChartiq._streamManager = new StreamManager(BinaryChartiq._connectionManager);
        }
    }

    static getConnectionManager() {
        BinaryChartiq.initConnection();
        return BinaryChartiq._connectionManager;
    }

    static getStreamManager() {
        BinaryChartiq.initConnection();
        return BinaryChartiq._streamManager;
    }

    set symbols(s) {
        this._updateRender({ symbols: s });
    }

    constructor({ selector, symbols }) {
        this.selector = selector;
        if (symbols) this.symbols = symbols;

        this._updateRender();
    }

    getChartEngine() {
        const context = $$$('cq-context', $$$(this.selector));
        return context.CIQ.UI.context.stx;
    }

    _updateRender(props) {
        ReactDOM.render(
            <Chart id={this.selector.slice(1, this.selector.length)} {...props} />,
            $$$(this.selector),
        );
    }
}

export default BinaryChartiq;
