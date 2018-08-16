import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { action } from 'mobx';

const connect_v2 = (Store, mapStoresToProps, handleProps) => {
    // wrap the mapping function usually passed to mobx-react's inject method
    // so that it additionally unboxes any observables
    const unboxedMapStoresToProps = (stores, props, context) => {
        const injectedProps = mapStoresToProps(stores, props, context);
        return {
            ...injectedProps,
            ...props,
        };
    };

    class UnboxedComponent extends Component {
        static contextTypes = { mobxStores: PropTypes.object };
        static childContextTypes = { mobxStores: PropTypes.object };

        getChildContext() { return { mobxStores: this.store }; }

        componentWillMount() {
            this.store = new Store(this.context.mobxStores);
            this.injectedComponent = inject(unboxedMapStoresToProps)(UnboxedComponent.WrappedComponent);
            this.injectedComponent.displayName = `inject-${UnboxedComponent.displayName}`;
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

        handlePropsAction = action(handleProps || (() => {}));

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

export const connect = (...args) => {
    if (args.length > 1) {
        return connect_v2(...args);
    }
    const mapStoresToProps = args[0];

    // Combine both stores and props, with props taking precedence
    const mapStoresAndProps = (allStores, props /* , context */) => ({
        ...mapStoresToProps(allStores),
        ...props,
    });

    return WrappedComponent => inject(mapStoresAndProps)(WrappedComponent);
};
