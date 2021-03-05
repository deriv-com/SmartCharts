import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Chart' was resolved to '/Users/balak... Remove this comment to see the full error message
import Chart from './Chart';

const SmartChart = ({ children, ...props }: any) => {
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
