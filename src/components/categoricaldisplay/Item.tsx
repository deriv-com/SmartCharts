// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Icons.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import { ItemIconMap, ActiveOptionsIconMap } from '../Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Favorite.jsx' was resolved to '/Users/b... Remove this comment to see the full error message
import Favorite from '../Favorite.jsx';

const Icon = React.memo(({
    id,
}: any) => {
    if (!id || !ItemIconMap[id]) {
        return '';
    }
    const ItemIcon = ItemIconMap[id];
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return <ItemIcon className={`ic-${id}`} />;
});

const ItemName = React.memo(({
    item: { itemId, display },
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-mcd__item__name'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Icon id={itemId} />
        {display}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
));

const ItemDetail = React.memo(({
    favoritesId,
    item: { dataObject, itemId },
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-mcd__item__detail'>
        {dataObject && (dataObject.exchange_is_open === undefined || dataObject.exchange_is_open) ? (
            ''
        ) : (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <span className='closed-market'>{t.translate('CLOSED')}</span>
        )}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Favorite category={favoritesId} id={itemId} />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
));

const ActiveOption = ({
    opt,
    item,
}: any) => {
    const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className={`ic-${opt.id}`} onClick={(e: any) => opt.onClick && opt.onClick(item.dataObject, e)}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {ActiveOptionIcon && <ActiveOptionIcon />}
            {opt.renderChild && opt.renderChild(item)}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    );
};

const ActiveOptions = ({
    activeOptions,
    item,
}: any) =>
    activeOptions && (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className='sc-active-options'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {activeOptions.map((opt: any) => <ActiveOption key={opt.id} opt={opt} item={item} />)}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    );

export const NormalItem = React.memo(({
    onSelectItem,
    item,
    disableAll,
    favoritesId,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div
        className={`sc-mcd__item sc-mcd__item--${item.itemId} ${item.selected ? 'sc-mcd__item--selected ' : ''}`}
        onClick={(e: any) => item.enabled && onSelectItem(item.dataObject, e)}
        disabled={!item.enabled || disableAll}
    >
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ItemName item={item} />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ItemDetail item={item} favoritesId={favoritesId} />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
));

export const ActiveItem = ({
    item,
    favoritesId,
    activeOptions,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-active-item'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ItemName item={item} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-mcd__item__detail'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ActiveOptions activeOptions={activeOptions} item={item} />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Favorite category={favoritesId} id={item.itemId} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);
