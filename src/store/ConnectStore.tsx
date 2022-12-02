import React from 'react';
import { TBarrierBaseProps } from 'src/components/Barrier';
import { TMarkerBaseProps } from 'src/components/Marker';
import { useConstructor } from 'src/hooks';
import { TBarrierUpdateProps } from 'src/types';
import TMainStore, { useStores } from '.';
import MarkerStore from './MarkerStore';

type TWrappedComponentsProps = TBarrierBaseProps | TMarkerBaseProps;

type TStoreClass = {
    new (mainStore: TMainStore): TWrappedComponentsProps['store'];
};

type TConnectStoreWrapperProps = TBarrierUpdateProps &
    MarkerStore & {
        StoreClass: TStoreClass;
        children: (store?: TWrappedComponentsProps['store']) => JSX.Element;
        [x: string]: unknown;
    };

const ConnectStoreWrapper = ({
    StoreClass,
    ...props
}: Partial<TConnectStoreWrapperProps> & Required<Pick<TConnectStoreWrapperProps, 'StoreClass' | 'children'>>) => {
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

const connectStore = <B, C>(BaseComponent: (props: B) => React.ReactElement | null, StoreClass: TStoreClass) => {
    const Component = ({ children, ...props }: C & { children?: React.ReactNode }) => (
        <ConnectStoreWrapper StoreClass={StoreClass} {...props}>
            {store => (
                <BaseComponent store={store} {...((props as unknown) as B)}>
                    {children}
                </BaseComponent>
            )}
        </ConnectStoreWrapper>
    );

    return Component;
};

export default connectStore;
