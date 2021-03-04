// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { FavoriteIcon } from './Icons.jsx';
import FavoriteStore from '../store/FavoriteStore';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

const Favorite = ({
    category,
    id,
}: any) => {
    const [store] = React.useState(FavoriteStore.getInstance());
    const [is_favorite, setFavorite] = React.useState(false);

    const onClick = React.useCallback(
        (e: any) => {
            e.stopPropagation();
            e.nativeEvent.isHandledByDialog = true; // prevent close dialog
            store.toggleFavorite(category, id);
        },
        [store, category, id]
    );
    const onFavoriteUpdate = React.useCallback(() => {
        const isFavorite = store.isFavorite(category, id);
        if (isFavorite !== is_favorite) {
            setFavorite(isFavorite);
            logEvent(LogCategories.CategoricalDisplay, LogActions.Favorite, `${isFavorite ? 'Add ' : 'Remove '} ${id}`);
        }
    }, [store, category, id, is_favorite]);

    React.useEffect(() => {
        if (store && store.onFavoriteUpdate) {
            store.onFavoriteUpdate(onFavoriteUpdate);
            setFavorite(store.isFavorite(category, id));
        }
    }, [store, category, id, onFavoriteUpdate]);

    return !category || !id ? null : (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FavoriteIcon
            onClick={onClick}
            className={classNames('ciq-favorite', {
                'ciq-active-favorite': is_favorite,
            })}
        />
    );
};

export default Favorite;
