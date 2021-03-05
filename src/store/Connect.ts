import React from 'react';
import { inject } from 'mobx-react';

function connectMainStore(mapperFunction: any) {
    // Combine both stores and props, with props taking precedence
    const mapStoresAndProps = (mainStore: any, props: any /* , context */) => ({
        ...mapperFunction(mainStore),
        ...props,
    });
    return (WrappedComponent: any) => inject(mapStoresAndProps)(WrappedComponent);
}
function connectCustomStore(mapperFunction: any, CustomStore: any) {
    return (WrappedComponent: any) => {
        class StoredComponent extends React.Component<React.FC> {
            injectedComponent: any;
            props: any;
            store: any;
            constructor(props: any) {
                super(props);
                const { mainStore } = this.props;
                this.store = new CustomStore(mainStore);
                const mapStoresAndProps = (_mainStore: any, nextProps: any) => ({
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

        (StoredComponent as any).displayName = `unbox-${wrappedDisplayName}`;
        return inject(mainStore => ({ mainStore }))(StoredComponent);
    };
}
// if store is not defined, main store is used
export function connect(mapperFunction: any, CustomStore?: any) {
    if (CustomStore === undefined) {
        return connectMainStore(mapperFunction);
    }
    return connectCustomStore(mapperFunction, CustomStore);
}
