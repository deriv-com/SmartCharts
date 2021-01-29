import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
import Chart from './Chart.jsx';

const SmartChart = ({ children, ...props }) => {
    const customStore = React.useRef();
    if (!customStore.current) {
        customStore.current = new MainStore();
    }
    return (
        <Provider {...customStore.current}>
            <Chart {...props}>{children}</Chart>
        </Provider>
    );
};

export default SmartChart;
