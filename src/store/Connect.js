import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, Provider } from 'mobx-react';
import { action } from 'mobx';

const connect_v2 = (Store, mapStoresToProps, handleProps) => {
    // wrap the mapping function usually passed to mobx-react's inject method
    // so that it additionally unboxes any observables
    const unboxedMapStoresToProps = (stores, props, context) => {
        const injectedProps = mapStoresToProps(stores, props, context);
        Object.assign(injectedProps, props);
        return injectedProps;
    };

    class UnboxedComponent extends Component {
        handlePropsAction = action(handleProps || (() => {}));
        static contextTypes = { mobxStores: PropTypes.object };
        static childContextTypes = { mobxStores: PropTypes.object };

        getChildContext() { return { mobxStores: this.store }; }

        componentWillMount() {
            this.store = new Store(this.context.mobxStores);
            this.injectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent.WrappedComponent);
            this.injectedComponent.displayName = `inject-${UnboxedComponent.displayName}`;
        }

        componentDidMount() {
            if (handleProps) { this.handlePropsAction(this.store, this.props); }
        }

        componentWillReceiveProps(nextProps) {
            this.handlePropsAction(this.store, nextProps);
        }

        shouldComponentUpdate(/* nextProps */) { return false; }

        componentWillUnmount() {
            if (this.store && this.store.destructor) {
                this.store.destructor();
            }
        }

        render() {
            return React.createElement(this.injectedComponent);
        }
    }

    // apply the mobx store injection with our wrapped function
    // const InjectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent);
    return (WrappedComponent) => {
        UnboxedComponent.WrappedComponent = WrappedComponent;
        // make some nice names that will show up in the React Devtools
        const wrappedDisplayName = WrappedComponent.displayName
            || WrappedComponent.name
            || (WrappedComponent.constructor && WrappedComponent.constructor.name)
            || 'Unknown';
        // InjectedComponent.displayName = `inject-${wrappedDisplayName}`;
        UnboxedComponent.displayName = `unbox-${wrappedDisplayName}`;

        // let sub components like Menu.Body or List.Item work.
        Object.keys(WrappedComponent).forEach((key) => {
            const SubComponent = WrappedComponent[key];
            if (!/^childContextTypes$/.test(key) && typeof SubComponent === 'function') {
                UnboxedComponent[key] = SubComponent;
            }
        });

        return UnboxedComponent;
    };
};

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

export class MobxProvider extends Provider {
    getChildContext() {
        const stores = {};

        // inherit stores
        const baseStores = this.context.mobxStores;
        if (baseStores) {
            for (const key in baseStores) {
                stores[key] = baseStores[key];
            }
        }

        // add own stores
        for (const key in this.props.store) {
            if (!SPECIAL_REACT_KEYS[key]) {
                stores[key] = this.props.store[key];
            }
        }

        return {
            mobxStores: stores,
        };
    }
}
const isFunction = fn => typeof (fn) === 'function';

const isShallowEqual = (a, b) => (
    Object.keys(a).every(key => (
        (isFunction(a[key]) && isFunction(b[key])) || a[key] === b[key]
    ))
);

export const connect = (...args) => {
    if (args.length > 1) {
        return connect_v2(...args);
    }
    const mapStoresToProps = args[0];
    class UnboxedComponent extends Component {
        shouldComponentUpdate(nextProps) {
            return !isShallowEqual(nextProps, this.props);
        }

        render() {
            const WC = UnboxedComponent.WrappedComponent;
            return WC ? React.createElement(WC, this.props) : null;
        }
    }

    // wrap the mapping function usually passed to mobx-react's inject method
    // so that it additionally unboxes any observables
    const unboxedMapStoresToProps = (stores, props, context) => {
        const injectedProps = mapStoresToProps(stores, props, context);
        Object.assign(injectedProps, props);
        return injectedProps;
    };

    // apply the mobx store injection with our wrapped function
    const InjectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent);
    return (WrappedComponent) => {
        UnboxedComponent.WrappedComponent = WrappedComponent;
        // make some nice names that will show up in the React Devtools
        const wrappedDisplayName = WrappedComponent.displayName
            || WrappedComponent.name
            || (WrappedComponent.constructor && WrappedComponent.constructor.name)
            || 'Unknown';
        InjectedComponent.displayName = `inject-${wrappedDisplayName}`;
        UnboxedComponent.displayName = `unbox-${wrappedDisplayName}`;

        // let sub components like Menu.Body or List.Item work.
        Object.keys(WrappedComponent).forEach((key) => {
            const SubComponent = WrappedComponent[key];
            if (!/^childContextTypes$/.test(key) && typeof SubComponent === 'function') {
                InjectedComponent[key] = SubComponent;
            }
        });

        return InjectedComponent;
    };
};
