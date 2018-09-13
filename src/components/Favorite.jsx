import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { FavoriteIcon } from './Icons.jsx';
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

class Favorite extends Component {
    @observable static favoritesMap = loadFavorites() || {
        indicators: {},
        'chartTitle&Comparison': {},
    };

    @action.bound static toggleFavorite(category, id) {
        const cat = Favorite.favoritesMap[category];
        if (cat[id]) {
            delete cat[id];
        } else {
            cat[id] = true;
        }
        Favorite.saveFavorites();
    }

    static saveFavorites() {
        const favorites = {};
        for (const categoryName in Favorite.favoritesMap) {
            const category = [];
            for (const id in Favorite.favoritesMap[categoryName]) {
                category.push(id);
            }
            favorites[categoryName] = category;
        }
        CIQ.localStorageSetItem('cq-favorites', JSON.stringify(favorites));
    }

    onClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true; // prevent close dialog
        const { category, id } = this.props;
        Favorite.toggleFavorite(category, id);
    };

    @computed get isFavorite() {
        const { category, id } = this.props;
        const cat = Favorite.favoritesMap[category];
        return id in cat;
    }

    render() {
        return (
            <FavoriteIcon
                onClick={this.onClick}
                className={`ciq-favorite ${this.isFavorite ? 'ciq-active-favorite' : ''}`}
            />
        );
    }
}

export default Favorite;
