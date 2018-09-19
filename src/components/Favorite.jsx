import React, { Component } from 'react';
import { computed } from 'mobx';
import { FavoriteIcon } from './Icons.jsx';
import { connect } from '../store/Connect';

class Favorite extends Component {
    onClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true; // prevent close dialog
        const { category, id, toggleFavorite } = this.props;
        toggleFavorite(category, id);
    };

    @computed get isFavorite() {
        const { category, id, favoritesMap } = this.props;
        const cat = favoritesMap[category];
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

export default connect(({ favorites: f }) => ({
    toggleFavorite: f.toggleFavorite,
    favoritesMap: f.favoritesMap,
}))(Favorite);
