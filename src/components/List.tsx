import React from 'react'; // @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll';
import '../../sass/components/_ciq-list.scss';

const List = ({ height, items, onItemClick, children }: any) => {
    const hasFunctionAsChildren = typeof children === 'function';
    const renderRow = hasFunctionAsChildren ? children : (item: any) => item.text;
    // eslint-disable-next-line no-useless-concat
    const itemClassName = (it: any) =>
        'ciq-list-item' + ` ${it.disabled ? 'disabled' : ''}` + ` ${it.active ? 'active' : ''}`;
    return (
        <Scroll className='ciq-list' autoHeight autoHide style={height && { height: `${height}px` }}>
            {items.map((it: any, idx: any) => (
                <div key={it.id} className={itemClassName(it)} onClick={() => onItemClick(idx, it)}>
                    {renderRow(it)}
                </div>
            ))}
        </Scroll>
    );
};

export default List;
