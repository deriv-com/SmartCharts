import React from 'react';
import { action } from 'mobx';
import { inject } from 'mobx-react';
import { TMainStore } from '../types';

export type TReactComponent<P> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>
    | React.FC<P>;

export type TStoredComponent = {
    mainStore: TMainStore;
    children?: React.ReactNode;
};

export type TStoredComponentProps = {
    color?: string;
    draggable: boolean;
    hideBarrierLine?: boolean;
    hideOffscreenLine?: boolean;
    hidePriceLines: boolean;
    high: number;
    lineStyle?: string;
    low?: number;
    mainStore: TMainStore;
    onChange: () => typeof action;
    onChartBarrierChange: () => typeof action;
    relative: boolean;
    shade?: string;
    shadeColor?: string;
    title?: string;
}

type TStoresToProps<S, I> = (store: S) => I;

type StoreClass<T> = { new (mainStore: TMainStore): T };

type BaseStore = {
    updateProps?: (props: TStoredComponent) => void;
    destructor?: () => void;
};

function connectMainStore<Store, I>(
    mapperFunction: TStoresToProps<Store, I>
): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<I> {
    // Combine both stores and props, with props taking precedence
    const mapStoresAndProps = (mainStore: Store, props: I /* , context */) => ({
        ...mapperFunction(mainStore),
        ...props,
    });
    return <C>(WrappedComponent: TReactComponent<C>) =>
        (inject(mapStoresAndProps)(WrappedComponent as TReactComponent<unknown>) as TReactComponent<I>);
}
function connectCustomStore<Store, I>(
    mapperFunction: TStoresToProps<Store, I>,
    CustomStore: StoreClass<Store>
): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<I> {
    return <C>(WrappedComponent: TReactComponent<C>) => {
        class StoredComponent extends React.Component<TStoredComponent> {
            injectedComponent: TReactComponent<C>;
            store: Store & BaseStore;
            static displayName: string;
            constructor(props: TStoredComponent) {
                super(props);
                const { mainStore } = this.props;
                this.store = new CustomStore(mainStore);
                const mapStoresAndProps = (_mainStore: TMainStore, nextProps: I) => ({
                    ...mapperFunction(this.store),
                    ...nextProps,
                });
                if (this.store.updateProps) {
                    this.store.updateProps(props);
                }
                this.injectedComponent = inject(mapStoresAndProps)(WrappedComponent);
            }
            componentDidUpdate() {
                if (this.store.updateProps) {
                    this.store.updateProps(this.props);
                }
            }
            componentWillUnmount() {
                if (this.store.destructor) {
                    this.store.destructor();
                }
            }
            render() {
                return React.createElement(this.injectedComponent);
            }
        }
        // make some nice names that will show up in the React Devtools
        const wrappedDisplayName =
            WrappedComponent.displayName ||
            WrappedComponent.name ||
            (WrappedComponent.constructor && WrappedComponent.constructor.name) ||
            'Unknown';

        StoredComponent.displayName = `unbox-${wrappedDisplayName}`;
        return inject(mainStore => ({ mainStore }))(StoredComponent as TReactComponent<unknown>) as TReactComponent<I>;
    };
}
// if store is not defined, main store is used
export function connect<Store, I>(mapperFunction: TStoresToProps<Store, I>, CustomStore?: StoreClass<Store>): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<I> {
    if (CustomStore === undefined) {
        return connectMainStore<Store, I>(mapperFunction);
    }
    return connectCustomStore<Store, I>(mapperFunction, CustomStore);
}
