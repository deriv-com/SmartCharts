import React, { Component } from 'react';
import { FavoriteIcon } from './Icons.jsx';
import FavoriteStore from '../store/FavoriteStore';
import { logEvent } from '../utils/ga';

class Favorite extends Component {
    store = FavoriteStore.getInstance();

    constructor(props) {
        super(props);
        this.store.onFavoriteUpdate(this.onFavoriteUpdate);
        this.isFavorite = this.store.isFavorite;
        this.toggleFavorite = this.store.toggleFavorite;
        const { category, id } = this.props;
        this.state = { isFavorite: this.isFavorite(category, id) };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isFavorite !== nextState.isFavorite;
    }

    componentWillUnmount() {
        this.store.offFavoriteUpdate(this.onFavoriteUpdate);
    }

    onFavoriteUpdate = () => {
        const { category, id } = this.props;
        const isFavorite = this.isFavorite(category, id);
        if (isFavorite !== this.state.isFavorite) {
            this.setState({ isFavorite });
            logEvent('Categorical Display', 'Favorite', `${isFavorite ? 'Add ' : 'Remove '} ${id}`);
        }
    };

    onClick = (e) => {
        e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true; // prevent close dialog
        const { category, id } = this.props;
        this.toggleFavorite(category, id);
    };

    render() {
        const { category, id } = this.props;
        const { isFavorite } = this.state;
        if (!category || !id) return null;

        return (
            <FavoriteIcon
                onClick={this.onClick}
                className={`ciq-favorite ${isFavorite ? 'ciq-active-favorite' : ''}`}
            />
        );
    }
}

export default Favorite;
