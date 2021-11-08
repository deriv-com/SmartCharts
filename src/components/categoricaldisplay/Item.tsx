import React from 'react';
import { ItemIconMap, ActiveOptionsIconMap } from '../Icons';
import Favorite from '../Favorite';
import { TCategory, TCategoricalItem } from '../../types';

export type TActiveItemProps = {
    item: TCategoricalItem;
    favoritesId: string;
    activeOptions: any;
};

export type TNormalItemProps = {
    onSelectItem?: (item: TCategory) => void;
    item: TCategoricalItem;
    disableAll: boolean,
    favoritesId: string;
};

const Icon = React.memo(({ id }: any) => {
    if (!id || !ItemIconMap[id]) {
        return '';
    }
    const ItemIcon = ItemIconMap[id];
    return <ItemIcon className={`ic-${id}`} />;
});

const ItemName = React.memo(({ item: { itemId, display } }: any) => (
    <div className='sc-mcd__item__name'>
        <Icon id={itemId} />
        {display}
    </div>
));

const ItemDetail = React.memo(({ favoritesId, item: { dataObject, itemId } }: any) => (
    <div className='sc-mcd__item__detail'>
        {dataObject && (dataObject.exchange_is_open === undefined || dataObject.exchange_is_open) ? (
            ''
        ) : (
            <span className='closed-market'>{t.translate('CLOSED')}</span>
        )}
        <Favorite category={favoritesId} id={itemId} />
    </div>
));

const ActiveOption = ({ opt, item }: any) => {
    const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
    return (
        <span className={`ic-${opt.id}`} onClick={(e: any) => opt.onClick && opt.onClick(item.dataObject, e)}>
            {ActiveOptionIcon && <ActiveOptionIcon />}
            {opt.renderChild && opt.renderChild(item)}
        </span>
    );
};

const ActiveOptions = ({ activeOptions, item }: any) =>
    activeOptions && (
        <span className='sc-active-options'>
            {activeOptions.map((opt: any) => (
                <ActiveOption key={opt.id} opt={opt} item={item} />
            ))}
        </span>
    );

export const NormalItem = React.memo(({ onSelectItem, item, disableAll, favoritesId }: any) => (
    <div
        className={`sc-mcd__item sc-mcd__item--${item.itemId} ${item.selected ? 'sc-mcd__item--selected ' : ''}`}
        onClick={(e: any) => item.enabled && onSelectItem(item.dataObject, e)}
        disabled={!item.enabled || disableAll}
    >
        <ItemName item={item} />
        <ItemDetail item={item} favoritesId={favoritesId} />
    </div>
));

export const ActiveItem = ({ item, favoritesId, activeOptions }: any) => (
    <div className='sc-active-item'>
        <ItemName item={item} />
        <div className='sc-mcd__item__detail'>
            <ActiveOptions activeOptions={activeOptions} item={item} />
            <Favorite category={favoritesId} id={item.itemId} />
        </div>
    </div>
);
