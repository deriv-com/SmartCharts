import React from 'react';
import { action } from 'mobx';
import { inject } from 'mobx-react';
import { TMainStore } from '../types';

type TStoredComponent = {
    mainStore: TMainStore;
};

type TStoredComponentProps = Readonly<TStoredComponent> & Readonly<{ children?: React.ReactNode; }>

export type TStoredComponentChildProps = {
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

type TReactComponent<P> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>
    | React.FC<P>;

type StoreClass<T> = { new (mainStore: TMainStore): T };

type BaseStore = {
    updateProps?: (props: TStoredComponentProps) => void;
    destructor?: () => void;
};

function connectMainStore<Store, I>(
    mapperFunction: TStoresToProps<Store, I>
): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<Omit<C, keyof I>> {
    // Combine both stores and props, with props taking precedence
    const mapStoresAndProps = (mainStore: Store, props: I /* , context */) => ({
        ...mapperFunction(mainStore),
        ...props,
    });
    return <C>(WrappedComponent: TReactComponent<C>) =>
        (inject(mapStoresAndProps)(WrappedComponent) as unknown) as TReactComponent<Omit<C, keyof I>>;
}
function connectCustomStore<Store, I>(
    mapperFunction: TStoresToProps<Store, I>,
    CustomStore: StoreClass<Store>
): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<Omit<C, keyof I>> {
    return <C>(WrappedComponent: TReactComponent<C>) => {
        class StoredComponent extends React.Component<TStoredComponent> {
            injectedComponent: TReactComponent<C>;
            store: Store & BaseStore;
            static displayName: string;
            constructor(props: TStoredComponentProps) {
                super(props);
                const { mainStore } = this.props;
                this.store = new CustomStore(mainStore);
                const mapStoresAndProps = (_mainStore: TMainStore, nextProps: TStoredComponentChildProps) => ({
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
        return inject(mainStore => ({ mainStore }))(StoredComponent as TReactComponent<unknown>) as TReactComponent<Omit<C, keyof I>>;
    };
}
// if store is not defined, main store is used
export function connect<Store, I>(mapperFunction: TStoresToProps<Store, I>, CustomStore?: StoreClass<Store>): <C>(WrappedComponent: TReactComponent<C>) => TReactComponent<Omit<C, keyof I>> {
    if (CustomStore === undefined) {
        return connectMainStore<Store, I>(mapperFunction);
    }
    return connectCustomStore<Store, I>(mapperFunction, CustomStore);
}
