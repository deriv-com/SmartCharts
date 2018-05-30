import React from 'react';
import { TradeStartLine, TradeEndLine } from './VerticalLine.jsx';
import { MobxProvider } from '../store/Connect';
import Chart from './Chart.jsx';
import MainStore from '../store';

class SmartChart extends React.Component {
    async componentDidMount() {
        this.mainStore.chart.isMobile = this.props.isMobile || false;
        this.mainStore.chart.onSymbolChange = this.props.onSymbolChange;
    }
    componentWillReceiveProps({ onSymbolChange }) {
        if (onSymbolChange && this.mainStore.chart.onSymbolChange !== onSymbolChange) {
            this.mainStore.chart.onSymbolChange = onSymbolChange;
        }
    }

    get chart() { return this.mainStore.chart; }
    get stx() { return this.chart.stxx; }
    mainStore = new MainStore();

    addTradeStartLine() {
        const start = new TradeStartLine({ stx: this.stx });
        return start;
    }
    addTradeEndLine() {
        const end = new TradeEndLine({ stx: this.stx });
        return end;
    }
    render() {
        const { children, ...props } = this.props;

        return (
            <MobxProvider store={this.mainStore}>
                <Chart {...props} >
                    {children}
                </Chart>
            </MobxProvider>
        );
    }
}

export default SmartChart;
