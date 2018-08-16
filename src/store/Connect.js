import { inject } from 'mobx-react';

// if store is not defined, main store is used
export const connect = (mapperFunction, CustomStore) => {
    let mapStoresAndProps;
    if (CustomStore !== undefined) {
        let store;
        mapStoresAndProps = (mainStore, props /* , context */) => {
            if (store === undefined) {
                store = new CustomStore(mainStore);
            }
            return {
                ...mapperFunction(store),
                ...props,
            };
        };
    } else {
        // Combine both stores and props, with props taking precedence
        mapStoresAndProps = (mainStore, props /* , context */) => ({
            ...mapperFunction(mainStore),
            ...props,
        });
    }

    return WrappedComponent => inject(mapStoresAndProps)(WrappedComponent);
};
