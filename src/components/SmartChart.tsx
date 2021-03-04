// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { Provider } from 'mobx-react';
import MainStore from '../store';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Chart.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import Chart from './Chart.jsx';

const SmartChart = ({
    children,
    ...props
}: any) => {
    const store = React.useRef();

    if (!store.current) {
        store.current = new MainStore();
    }

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Provider {...store.current}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Chart {...props}>{children}</Chart>
        </Provider>
    );
};

export default SmartChart;
