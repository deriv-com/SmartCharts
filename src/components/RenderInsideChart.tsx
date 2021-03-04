// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactDOM from 'react-dom';
import { createElement } from './ui/utils';
import { connect } from '../store/Connect';

const inChartPrefix = 'cq-inchart-';

// Render given Components under stx-holder to position it relative to the active symbol chart.
const RenderInsideChart = ({
    at = 'holder',
    children,
    contextPromise,
    isChartReady,
    isChartScrollingToEpoch,
    hideInScrollToEpoch,
}: any) => {
    const [container, setContainer] = React.useState();
    React.useEffect(() => {
        contextPromise.then((context: any) => {
            const nodeName = `${inChartPrefix}${at}`;
            // reuse existing node when possible:
            let elem = context.topNode.querySelector(`.${nodeName}`);
            if (!elem) {
                elem = createElement(`<div class="${nodeName}"></div>`);
                context.stx.chart.panel[at].appendChild(elem);
            }

            setContainer(elem);
        });
    }, [at, contextPromise]);

    if (!isChartReady) return null;
    if (hideInScrollToEpoch && isChartScrollingToEpoch) return null;
    if (container) {
        return ReactDOM.createPortal(children, container);
    }
    return null;
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
    state,
}: any) => ({
    contextPromise: chart.contextPromise,
    isChartReady: state.isChartReady,
    isChartScrollingToEpoch: state.isChartScrollingToEpoch,
}))(RenderInsideChart);
