/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/Chart.jsx';
import {TradeEndLine, TradeStartLine} from './components/VerticalLine.jsx';
import MainStore from './store';
import {MobxProvider} from './store/Connect';
import Barrier from './components/Barrier.jsx';
import './SplinePlotter';
import PendingPromise from './utils/PendingPromise';

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
                <Chart lang="en" {...props} >
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
    PendingPromise,
};

export default {
    Barrier,
    SmartChart,
    TradeStartLine,
    TradeEndLine,
    PendingPromise,
};
