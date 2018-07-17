import React from 'react';
import { MobxProvider } from '../store/Connect';
import Chart from './Chart.jsx';
import MainStore from '../store';

class SmartChart extends React.Component {
    get chart() { return this.mainStore.chart; }
    get stx() { return this.chart.stxx; }
    mainStore = new MainStore();

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
