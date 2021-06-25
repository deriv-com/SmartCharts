import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { createElement } from './ui/utils';

const inChartPrefix = 'cq-inchart-';

type TRenderInsideChartProps = {
    at: string;
    hideInScrollToEpoch?: boolean;
};

// Render given Components under stx-holder to position it relative to the active symbol chart.
const RenderInsideChart: React.FC<TRenderInsideChartProps> = ({ at = 'holder', children, hideInScrollToEpoch }) => {
    const { chart, state } = useStores();
    const { contextPromise } = chart;
    const { isChartReady, isChartScrollingToEpoch } = state;

    const [container, setContainer] = React.useState<HTMLElement>();
    React.useEffect(() => {
        contextPromise?.then((context: any) => {
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

export default observer(RenderInsideChart);
