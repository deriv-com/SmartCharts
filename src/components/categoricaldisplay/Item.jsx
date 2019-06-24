import React from 'react';
import {
    ItemIconMap, ActiveOptionsIconMap,
} from '../Icons.jsx';
import Favorite from '../Favorite.jsx';

const Icon = ({ id }) => {
    if (!id || !ItemIconMap[id]) { return ''; }
    const ItemIcon = ItemIconMap[id];
    return <ItemIcon className={`ic-${id}`} />;
};

const ItemLeft = ({ item: { itemId, display } }) => (
    <div className="left">
        <Icon id={itemId} />
        <span className="ciq-item-display">{display}</span>
    </div>
);

const ItemRight = ({ favoritesId, item: { dataObject, itemId } }) => (
    <div className="right">
        {(dataObject && (dataObject.exchange_is_open === undefined || dataObject.exchange_is_open)) ? '' : <span className="closed-market">{t.translate('CLOSED')}</span>}
        <Favorite
            category={favoritesId}
            id={itemId}
        />
    </div>
);

const ActiveOption = ({ opt, item }) => {
    const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
    return (
        <span
            className={`ic-${opt.id}`}
            onClick={e => opt.onClick && opt.onClick(item.dataObject, e)}
        >
            {ActiveOptionIcon && <ActiveOptionIcon />}
            {opt.renderChild && opt.renderChild(item)}
        </span>
    );
};

const ActiveOptions = ({ activeOptions, item }) => (
    activeOptions && (
        <span className="cq-active-options">
            {activeOptions.map(opt => (
                <ActiveOption key={opt.id} opt={opt} item={item} />
            ))}
        </span>
    )
);

export const NormalItem = ({ onSelectItem, item, disableAll, favoritesId, id }) => {
    const itemClass = id ? `${id}-subcategory-item-${item.itemId}` : `subcategory-item-${item.itemId}`;

    return (
        <div
            className={`cq-item ${item.selected ? 'selected ' : ''} ${itemClass}`}
            onClick={e => item.enabled && onSelectItem(item.dataObject, e)}
            disabled={!item.enabled || disableAll}
        >
            <ItemLeft item={item} />
            <ItemRight item={item} favoritesId={favoritesId} />
        </div>
    );
};

export const ActiveItem = ({ item, favoritesId, activeOptions }) => (
    <div
        className="cq-active-item"
    >
        <ItemLeft item={item} />
        <div className="right">
            <ActiveOptions activeOptions={activeOptions} item={item} />
            <Favorite
                category={favoritesId}
                id={item.itemId}
            />
        </div>
    </div>
);
