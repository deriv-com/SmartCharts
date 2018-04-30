/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/Chart.jsx';
import ConnectionManager from './ConnectionManager';
import StreamManager from './StreamManager';
import {TradeEndLine, TradeStartLine} from './components/VerticalLine.jsx';
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
        this.mainStore.chart.isMobile = this.props.isMobile || false;
        this.chart.setActiveSymbols(activeSymbols);
        this.mainStore.chart.onSymbolChange = this.props.onSymbolChange;
    }
    componentWillReceiveProps({activeSymbols, onSymbolChange}) {
        if(activeSymbols && activeSymbols !== this.chart.activeSymbols) {
            this.chart.setActiveSymbols(activeSymbols);
        }
        if(onSymbolChange && this.mainStore.chart.onSymbolChange !== onSymbolChange) {
            this.mainStore.chart.onSymbolChange = onSymbolChange;
        }
    }

    render() {
        const {children, isMobile, theme} = this.props;

        return (
            <MobxProvider store={this.mainStore}>
                <Chart lang="en" isMobile={isMobile} theme={theme}>
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
export {
    Barrier,
    SmartChart,
    TradeStartLine,
    TradeEndLine,
};

export default {
    SmartChart,
    Barrier,
    TradeStartLine,
    TradeEndLine,
};
