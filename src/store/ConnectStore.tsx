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

type TConnectStoreWrapperProps = {
    StoreClass: TStoreClass;
    children(store?: TStoreProps): ReactElement;
    [x: string]: any;
};

const ConnectStoreWrapper: React.FC<TConnectStoreWrapperProps> = ({ StoreClass, ...props }) => {
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

const connectStore = (BaseComponent: React.FunctionComponent<any>, StoreClass: TStoreClass) => {
    const Component: React.FC = ({ children, ...props }) => (
        <ConnectStoreWrapper StoreClass={StoreClass} {...props}>
            {(store: TStoreProps) => (
                <BaseComponent store={store} {...props}>
                    {children}
                </BaseComponent>
            )}
        </ConnectStoreWrapper>
    );

    return Component;
};

export default connectStore;
