/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/Chart.jsx';

class BinaryChartiq {
    static addNewChart(params) {
        const chart = new BinaryChartiq(params);
        return chart;
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
