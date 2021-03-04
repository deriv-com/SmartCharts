import React from 'react';
import { displayMilliseconds } from '../utils/index';
import ServerTime from '../utils/ServerTime';

export const MarketOpeningTimeCounter = ({ symbolOpenTime }) => {
    const [time, setTime] = React.useState(0);

    const timeUntilOpenTime = React.useMemo(() => {
        let output = null;
        const {
            symbolOpenTime: { openTime },
        } = symbolOpenTime || {};
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
