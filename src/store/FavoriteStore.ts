// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'even... Remove this comment to see the full error message
import EventEmitter from 'event-emitter-es6';
import { action, observable } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';

function loadFavorites() {
    const local = createObjectFromLocalStorage('cq-favorites');
    if (!local) {
        return;
    }

    const favorites = {};
    for (const categoryName in local) {
        const category = {};
        for (const id of local[categoryName]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            category[id] = true;
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        favorites[categoryName] = category;
    }

    return favorites;
}

class FavoriteStore {
    static get EVENT_FAVORITES_UPDATE() {
        return 'EVENT_FAVORITES_UPDATE';
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable favoritesMap = loadFavorites() || {
        indicators: {},
        'chartTitle&Comparison': {},
    };

    // @ts-expect-error ts-migrate(7008) FIXME: Member 'instance' implicitly has an 'any' type.
    static instance;

    _emitter: any;

    static getInstance() {
        if (!FavoriteStore.instance) {
            FavoriteStore.instance = new FavoriteStore();
        }

        return FavoriteStore.instance;
    }

    constructor() {
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    onFavoriteUpdate(callback: any) {
        this._emitter.on(FavoriteStore.EVENT_FAVORITES_UPDATE, callback);
    }

    offFavoriteUpdate(callback: any) {
        this._emitter.off(FavoriteStore.EVENT_FAVORITES_UPDATE, callback);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound isFavorite(category: any, id: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return id in this.favoritesMap[category];
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound toggleFavorite(category: any, id: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const cat = this.favoritesMap[category];
        if (cat[id]) {
            delete cat[id];
        } else {
            cat[id] = true;
        }
        this._emitter.emit(FavoriteStore.EVENT_FAVORITES_UPDATE, { category, id, value: cat[id] || false });
        // this.favoritesMap = { ...this.favoritesMap }; // force observable to update
        this.saveFavorites();
    }

    saveFavorites() {
        const favorites = {};
        for (const categoryName in this.favoritesMap) {
            const category = [];
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            for (const id in this.favoritesMap[categoryName]) {
                category.push(id);
            }
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            favorites[categoryName] = category;
        }
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.localStorageSetItem('cq-favorites', JSON.stringify(favorites));
    }
}

export default FavoriteStore;
