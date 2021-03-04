// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';

export const usePrevious = (value: any) => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};
