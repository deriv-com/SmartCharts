import React from 'react';
import { TradeStartLine } from './VerticalLine.jsx';
import {MobxProvider} from '../store/Connect';
import Chart from './Chart.jsx';
import MainStore from '../store';

class SmartChart extends React.Component {
    mainStore = new MainStore();
    get chart() { return this.mainStore.chart; }
    get stx() { return this.chart.stxx; }

    async componentDidMount() {
        this.mainStore.chart.isMobile = this.props.isMobile || false;
        this.mainStore.chart.onSymbolChange = this.props.onSymbolChange;
    }
    componentWillReceiveProps({onSymbolChange}) {
        if(onSymbolChange && this.mainStore.chart.onSymbolChange !== onSymbolChange) {
            this.mainStore.chart.onSymbolChange = onSymbolChange;
        }
    }

    render() {
        const {children, ...props } = this.props;

        return (
            <MobxProvider store={this.mainStore}>
                <Chart {...props} >
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

export default SmartChart;
