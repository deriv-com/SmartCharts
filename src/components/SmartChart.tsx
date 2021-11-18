import React from 'react';
import { useStores, getContext } from 'src/store';
import Chart from './Chart';

const SmartChart: React.FC<any> = ({ children, ...props }) => {
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
