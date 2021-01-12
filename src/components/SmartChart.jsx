import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
import Chart from './Chart.jsx';

const SmartChart = ({ children, ...props }) => {
    const store = React.useRef();

    if (!store.current) {
        store.current = new MainStore();
    }

    return (
        <Provider {...store.current}>
            <Chart {...props}>{children}</Chart>
        </Provider>
    );
};

export default SmartChart;
