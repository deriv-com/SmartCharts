// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
import '../../sass/components/_ciq-list.scss';

const List = ({
    height,
    items,
    onItemClick,
    children,
}: any) => {
    const hasFunctionAsChildren = typeof children === 'function';
    const renderRow = hasFunctionAsChildren ? children : (item: any) => item.text;
    // eslint-disable-next-line no-useless-concat
    const itemClassName = (it: any) => 'ciq-list-item' + ` ${it.disabled ? 'disabled' : ''}` + ` ${it.active ? 'active' : ''}`;
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Scroll className='ciq-list' autoHeight autoHide style={height && { height: `${height}px` }}>
            {items.map((it: any, idx: any) => (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div key={it.id} className={itemClassName(it)} onClick={() => onItemClick(idx, it)}>
                    {renderRow(it)}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            ))}
        </Scroll>
    );
};

export default List;
