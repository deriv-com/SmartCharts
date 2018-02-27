import React, { Component } from 'react';
import '../../sass/_ciq-list.scss';

const List = ({
    height,
    selectedIdx,
    items,
    onItemClick,
    onItemRef,
    onRootRef
}) => {
    return (
        <div
            className='ciq-list'
            style={{height: `${height}px`}}
            ref={onRootRef}
        >
            {items.map((it, idx) => (
                <div
                    key={it.id}
                    className={`ciq-list-item ${idx === selectedIdx ? 'selected' : ''}`}
                    onClick={() => onItemClick(idx, it)}
                    ref={ref => onItemRef(idx, ref)}
                >
                    {it.text}
                </div>
            ))}
        </div>
    );
};

export default List;
