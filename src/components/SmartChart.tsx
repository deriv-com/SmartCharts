import React from 'react';
import { useStores, getContext } from 'src/store';
import { TChartProps } from 'src/types';
import Chart from './Chart';

const SmartChart: React.FC<TChartProps> = ({ children, ...props }) => {
    const store = useStores();
    const context = getContext();

    const Provider = context.Provider;

    return (
        <Provider value={store}>
            <Chart {...props}>{children}</Chart>
        </Provider>
    );
};

export default SmartChart;
