/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/Chart.jsx';
import ConnectionManager from './ConnectionManager';
import StreamManager from './StreamManager';
import {TradeEndLine, TradeStartLine} from './draw/DateLine';
import MainStore from './store';
import {MobxProvider} from './store/Connect';
import Barrier from './components/Barrier.jsx';
import './SplinePlotter';

class SmartChart extends React.Component {
    mainStore = new MainStore();
    get chart() { return this.mainStore.chart; }
    get stx() { return this.chart.stxx; }
    get connectionManager() { return this.chart.connectionManager; }

    async componentDidMount() {
        let activeSymbols = this.props && this.props.activeSymbols;
        if(!activeSymbols) {
            const data = await this.connectionManager.send({
                active_symbols: 'brief',
                product_type: 'basic',
            });
            activeSymbols = data.active_symbols;
        }
        this.chart.setActiveSymbols(activeSymbols);
    }

    componentWillReceiveProps({activeSymbols}) {
        if(activeSymbols && activeSymbols !== this.chart.activeSymbols) {
            this.chart.setActiveSymbols(activeSymbols);
        }
    }

    render() {
        const {children} = this.props;
        return (
            <MobxProvider store={this.mainStore}>
                <Chart>
                    {children}
                </Chart>
            </MobxProvider>
        );
    }
    addTradeStartLine() {
        const start = new TradeStartLine({ stx: this.stx });
        return start;
    }
    addTradeEndLine() {
        const end = new TradeEndLine({ stx: this.stx });
        return end;
    }
}
export { Barrier, SmartChart };

export default {
    SmartChart,
    Barrier,
};

// class BinaryChartiq {
//     getChartEngine() {
//         if (!this._stx) {
//             const context = $$$('cq-context', $$$(this.selector));
//             this._stx = context.CIQ.UI.context.stx;
//         }
//         return this._stx;
//     }
//     addTradeStartLine() {
//         const start = new TradeStartLine({ stx: this.getChartEngine() });
//         return start;
//     }
//     addTradeEndLine() {
//         const end = new TradeEndLine({ stx: this.getChartEngine() });
//         return end;
//     }
// }

