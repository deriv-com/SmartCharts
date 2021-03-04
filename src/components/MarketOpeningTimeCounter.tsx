// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { displayMilliseconds } from '../utils/index';
import ServerTime from '../utils/ServerTime';

export const MarketOpeningTimeCounter = ({
    symbolOpenTime,
}: any) => {
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

    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    return <span>{timeUntilOpenTime}</span>;
};
