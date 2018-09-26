import { action, observable } from 'mobx';
import { createObjectFromLocalStorage } from '../utils';

function loadFavorites() {
    const local = createObjectFromLocalStorage('cq-favorites');
    if (!local) { return; }

    const favorites = {};
    for (const categoryName in local) {
        const category = {};
        for (const id of local[categoryName]) {
            category[id] = true;
        }
        favorites[categoryName] = category;
    }

    return favorites;
}

class FavoriteStore {
    @observable favoritesMap = loadFavorites() || {
        indicators: {},
        'chartTitle&Comparison': {},
    };

    static instance;

    static getInstance() {
        if (!FavoriteStore.instance) {
            FavoriteStore.instance = new FavoriteStore();
        }

        return FavoriteStore.instance;
    }

    @action.bound toggleFavorite(category, id) {
        const cat = this.favoritesMap[category];
        if (cat[id]) {
            delete cat[id];
        } else {
            cat[id] = true;
        }
        this.favoritesMap = { ...this.favoritesMap }; // force observable to update
        this.saveFavorites();
    }

    saveFavorites() {
        const favorites = {};
        for (const categoryName in this.favoritesMap) {
            const category = [];
            for (const id in this.favoritesMap[categoryName]) {
                category.push(id);
            }
            favorites[categoryName] = category;
        }
        CIQ.localStorageSetItem('cq-favorites', JSON.stringify(favorites));
    }
}

export default FavoriteStore;
