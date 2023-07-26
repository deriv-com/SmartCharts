import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_scroll.scss';
import { HomeIcon } from './Icons';

const ScrollToRecent = () => {
    const { chart, chartAdapter } = useStores();

    const { epochBounds, isFeedLoaded } = chartAdapter;

    const { feed } = chart;

    const onClick = () => {
        chartAdapter.flutterChart?.app.scrollToLastTick();
    };

    const quotes = feed?.quotes;

    if (quotes === undefined || isFeedLoaded === false || quotes.length === 0) return null;

    const lastQuoteTime = quotes[quotes.length - 1].DT?.getTime();

    if (!lastQuoteTime) return null;

    if (epochBounds.rightEpoch > lastQuoteTime) return null;

    return (
        <div className='scroll_to_recent' onClick={onClick}>
            <HomeIcon />
        </div>
    );
};

export default observer(ScrollToRecent);
