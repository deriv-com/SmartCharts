import React from 'react';
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
}) => {
    const [container, setContainer] = React.useState();
    React.useEffect(() => {
        contextPromise.then(context => {
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

export default connect(({ chart, state }) => ({
    contextPromise: chart.contextPromise,
    isChartReady: state.isChartReady,
    isChartScrollingToEpoch: state.isChartScrollingToEpoch,
}))(RenderInsideChart);
