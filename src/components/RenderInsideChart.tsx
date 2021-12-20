import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactDOM from 'react-dom';
import { useStores } from 'src/store';
import Context from './ui/Context';
import { createElement } from './ui/utils';

const inChartPrefix = 'cq-inchart-';

type TRenderInsideChartProps = {
    at: string;
    hideInScrollToEpoch?: boolean;
    children?: React.ReactNode;
};

// Render given Components under stx-holder to position it relative to the active symbol chart.
const RenderInsideChart = ({ at = 'holder', children, hideInScrollToEpoch }: TRenderInsideChartProps) => {
    const { chart, state } = useStores();
    const { contextPromise } = chart;
    const { isChartReady, isChartScrollingToEpoch } = state;

    const [container, setContainer] = React.useState<HTMLElement>();
    React.useEffect(() => {
        contextPromise?.then((context: Context) => {
            const nodeName = `${inChartPrefix}${at}`;
            // reuse existing node when possible:
            let elem = context.topNode?.querySelector(`.${nodeName}`);
            if (!elem) {
                elem = createElement(`<div class="${nodeName}"></div>`) as HTMLElement;
                context.stx.chart.panel[at].appendChild(elem);
            }

            setContainer(elem as HTMLElement);
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
