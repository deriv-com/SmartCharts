/* eslint-disable no-use-before-define,react/no-multi-comp,react/sort-comp,no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, Provider } from 'mobx-react';
import { isBoxedObservable, isObservable, isObservableArray, isObservableMap, toJS, action } from 'mobx';

const SPECIAL_REACT_KEYS = { children: true, key: true, ref: true };

export class MobxProvider extends Provider {
    getChildContext() {
        const stores = {};

        // inherit stores
        const baseStores = this.context.mobxStores;
        if (baseStores) {
            for (const key in baseStores) { // eslint-disable-line
                stores[key] = baseStores[key];
            }
        }

        // add own stores
        for (const key in this.props.store) { // eslint-disable-line
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

const unboxProps = (props) => {
    const unboxedProps = {};
    Object.keys(props).forEach((key) => {
        const value = props[key];
        let result;

        if (isObservableArray(value)) {
            result = value.peek();
        } else if (isObservableMap(value)) {
            result = value.toJS();
        } else if (isBoxedObservable(value)) {
            result = value.get();
        } else if (isObservable(value)) {
            result = toJS(value);
        } else {
            result = value;
        }

        unboxedProps[key] = result;
    });

    return unboxedProps;
};

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
        return unboxProps(injectedProps);
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

const connect_v2 = (Store, mapStoresToProps, handleProps) => {
    class UnboxedComponent extends Component {
        static contextTypes = { mobxStores: PropTypes.object };
        static childContextTypes = { mobxStores: PropTypes.object };
        getChildContext() { return { mobxStores: this.store }; }

        handlePropsAction = action(handleProps || (() => {}));

        componentWillReceiveProps(nextProps) {
            this.handlePropsAction(this.store, nextProps);
        }
        componentWillMount() {
            this.store = new Store(this.context.mobxStores);
            this.injectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent.WrappedComponent);
            this.injectedComponent.displayName = `inject-${UnboxedComponent.displayName}`;
        }
        componentDidMount() {
            if (handleProps) { handleProps(this.store, this.props); }
        }

        componentWillUnmount() {
            if (this.store && this.store.destructor) {
                this.store.destructor();
            }
        }

        shouldComponentUpdate(nextProps) { return false; }

        render() {
            return React.createElement(this.injectedComponent);
        }
    }

    // wrap the mapping function usually passed to mobx-react's inject method
    // so that it additionally unboxes any observables
    const unboxedMapStoresToProps = (stores, props, context) => {
        const injectedProps = mapStoresToProps(stores, props, context);
        Object.assign(injectedProps, props);
        return unboxProps(injectedProps);
    };

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
