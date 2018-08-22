import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
import Chart from './Chart.jsx';

class SmartChart extends React.Component {
    mainStore = new MainStore();

    get chart() { return this.mainStore.chart; }

    get stx() { return this.chart.stxx; }

    render() {
        const { children, ...props } = this.props;

        return (
            <Provider {...this.mainStore}>
                <Chart {...props}>
                    {children}
                </Chart>
            </Provider>
        );
    }
}

export default SmartChart;
