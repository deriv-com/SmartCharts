import React from 'react';
import { when } from 'mobx';
import { FavoriteIcon } from '../components/Icons';

class FavoritesStore {
    favorites = {};
    get context() { return this.mainStore.chart.context; }
    get layout() { return this.context.stx.layout; }
    constructor({ mainStore, id }) {
        this.id = id;
        this.mainStore = mainStore;
        when(() => this.context, this.loadFavorites);
    }

    isFavorite(key) {
        return !!this.favorites[key];
    }

    getFavoriteIcon(key) {
        return (
            <FavoriteIcon
                onClick={() => this.toggleFavorite(key)}
                className={`ciq-favorite ${this.favorites[key] ? 'ciq-active-favorite' : ''}`}
            />
        );
    }

    toggleFavorite(key) {
        if (this.favorites[key]) {
            delete this.favorites[key];
        } else {
            this.favorites[key] = true;
        }

        this.saveFavorites();
    }

    saveFavorites() {
        if (!this.layout.favorites) { this.layout.favorites = {}; }

        this.layout.favorites[this.id] = Object.keys(this.favorites);

        this.mainStore.state.saveLayout();
    }

    loadFavorites = () => {
        if (this.layout.favorites && this.layout.favorites[this.id]) {
            for (const fav of this.layout.favorites[this.id]) {
                this.favorites[fav] = true;
            }
        }
    }
}

export default FavoritesStore;
