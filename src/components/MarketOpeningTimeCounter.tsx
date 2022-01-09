import React from 'react';
import ChartTitleStore from 'src/store/ChartTitleStore';
import { displayMilliseconds } from '../utils/index';
import ServerTime from '../utils/ServerTime';

type TMarketOpeningTimeCounterProps = {
    symbolOpenTime: ChartTitleStore['symbolOpenTime'];
};

export const MarketOpeningTimeCounter = ({ symbolOpenTime }: TMarketOpeningTimeCounterProps) => {
    const [time, setTime] = React.useState(0);

    const timeUntilOpenTime = React.useMemo(() => {
        let output = null;
        const { openTime } = symbolOpenTime || {};
        if (openTime) {
            output = displayMilliseconds(openTime.getTime() - time);
        }
        return output;
    }, [symbolOpenTime, time]);

    React.useEffect(() => {
        const serverTime = ServerTime.getInstance();
        const timer = setInterval(() => setTime(serverTime.getLocalDate().getTime()), 1000);
        return () => clearInterval(timer);
    }, []);

    return <span>{timeUntilOpenTime}</span>;
};
