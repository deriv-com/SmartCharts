import React from 'react';

type TCallbackType<T> = ((value: T) => void) | null;
// this hook mimics this.setState({ state: value, ... }, () => callbackFunc());
export const useStateCallback = <T>(initial_state: T): [T, (current_state: T, cb: TCallbackType<T>) => void] => {
    const [state, setState] = React.useState<T>(initial_state);
    const callbackRef = React.useRef<TCallbackType<T>>(null);

    const setStateCallback = (current_state: T, cb: TCallbackType<T>) => {
        callbackRef.current = cb;
        setState(current_state);
    };

    React.useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(state);
            callbackRef.current = null;
        }
    }, [state]);

    return [state, setStateCallback];
};
