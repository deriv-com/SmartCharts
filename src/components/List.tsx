import React from 'react';
import Scroll from './Scroll.jsx';
import '../../sass/components/_ciq-list.scss';

const List = ({ height, items, onItemClick, children }) => {
    const hasFunctionAsChildren = typeof children === 'function';
    const renderRow = hasFunctionAsChildren ? children : item => item.text;
    // eslint-disable-next-line no-useless-concat
    const itemClassName = it => 'ciq-list-item' + ` ${it.disabled ? 'disabled' : ''}` + ` ${it.active ? 'active' : ''}`;
    return (
        <Scroll className='ciq-list' autoHeight autoHide style={height && { height: `${height}px` }}>
            {items.map((it, idx) => (
                <div key={it.id} className={itemClassName(it)} onClick={() => onItemClick(idx, it)}>
                    {renderRow(it)}
                </div>
            ))}
        </Scroll>
    );
};

export default List;
