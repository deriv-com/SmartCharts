import React, { ReactElement } from 'react';
import { useConstructor } from 'src/hooks';
import { TMainStore } from 'src/types';
import { useStores } from '.';

type TStoreProps = {
    updateProps: (props: any) => void;
    destructor: () => void;
};

type TStoreClass = {
    new (mainStore: TMainStore): TStoreProps;
};

type TMainStoreWrapperProps = {
    StoreClass: TStoreClass;
    children(store?: TStoreProps): ReactElement;
};

const MainStoreWrapper: React.FC<TMainStoreWrapperProps> = ({ StoreClass, ...props }) => {
    const store = useStores();
    const storeRef = React.useRef<TStoreProps>();

    useConstructor(() => {
        storeRef.current = new StoreClass(store);
    });

    React.useEffect(() => {
        storeRef.current?.updateProps?.(props);
    });

    React.useEffect(() => {
        return () => {
            storeRef.current?.destructor?.();
        };
    }, []);

    return <React.Fragment>{props.children(storeRef.current)}</React.Fragment>;
};

export default MainStoreWrapper;
