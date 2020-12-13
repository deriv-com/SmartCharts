import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
import Chart from './Chart.jsx';

const mainStore = new MainStore();
const SmartChart = ({ children, ...props }) => (
    <Provider {...mainStore}>
        <Chart {...props}>
            {children}
        </Chart>
    </Provider>
);

export default SmartChart;
