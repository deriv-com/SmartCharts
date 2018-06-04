import React from 'react';
import '../../sass/components/_ciq-list.scss';

const List = ({
    height,
    selectedIdx,
    items,
    onItemClick,
    onItemRef,
    onRootRef,
    children,
}) => {
    const hasFunctionAsChildren = (typeof children === 'function');
    const renderRow = hasFunctionAsChildren ? children : (item => item.text);
    const itemClassName = (it, idx) => 'ciq-list-item' +
               ` ${idx === selectedIdx ? 'selected' : ''}` +
               ` ${it.disabled ? 'disabled' : ''}` +
               ` ${it.active ? 'active' : ''}`;
    return (
        <div
            className="ciq-list"
            style={height && { height: `${height}px` }}
            ref={onRootRef}
        >
            {items.map((it, idx) => (
                <div
                    key={it.id}
                    className={itemClassName(it, idx)}
                    onClick={() => onItemClick(idx, it)}
                    ref={ref => onItemRef(idx, ref)}
                >
                    {renderRow(it)}
                </div>
            ))}
        </div>
    );
};

export default List;
