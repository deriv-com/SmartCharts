import React from 'react';
import { Provider } from 'mobx-react';
import Chart from './Chart';
import { useStores } from 'src/store';

const SmartChart = ({ children, ...props }: any) => {
    const store = useStores();
    return (
        <Provider {...store}>
            <Chart {...props}>{children}</Chart>
        </Provider>
    );
};

export default SmartChart;
