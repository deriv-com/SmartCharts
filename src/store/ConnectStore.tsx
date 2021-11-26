import React from 'react';
import { TBarrierProps } from 'src/components/Barrier';
import { TMarkerProps } from 'src/components/Marker';
import { useConstructor } from 'src/hooks';
import TMainStore, { useStores } from '.';
import { TUpdatePropsParams } from './BarrierStore';
import MarkerStore from './MarkerStore';

type TWrappedComponentsProps = TBarrierProps | TMarkerProps;

type TStoreClass = {
    new (mainStore: TMainStore): TWrappedComponentsProps['store'];
};

type TConnectStoreWrapperProps = TUpdatePropsParams &
    MarkerStore & {
        StoreClass: TStoreClass;
        children: (store?: TWrappedComponentsProps['store']) => JSX.Element;
        [x: string]: unknown;
    };

const ConnectStoreWrapper: React.FC<
    Partial<TConnectStoreWrapperProps> & Required<Pick<TConnectStoreWrapperProps, 'StoreClass' | 'children'>>
> = ({ StoreClass, ...props }) => {
    const store = useStores();
    const storeRef = React.useRef<TWrappedComponentsProps['store']>();

    useConstructor(() => {
        storeRef.current = new StoreClass(store);
    });

    React.useEffect(() => {
        storeRef.current?.updateProps?.(props as TConnectStoreWrapperProps);
    });

    React.useEffect(() => {
        return () => {
            storeRef.current?.destructor?.();
        };
    }, []);

    return <React.Fragment>{props.children(storeRef.current)}</React.Fragment>;
};

const connectStore = <P,>(BaseComponent: React.FC<P>, StoreClass: TStoreClass) => {
    const Component: React.FC<unknown> = ({ children, ...props }) => (
        <ConnectStoreWrapper StoreClass={StoreClass} {...props}>
            {store => (
                <BaseComponent store={store} {...(props as P)}>
                    {children as React.ReactElement}
                </BaseComponent>
            )}
        </ConnectStoreWrapper>
    );

    return Component;
};

export default connectStore;
