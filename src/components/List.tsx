import React from 'react';
import Scroll from './Scroll';
import '../../sass/components/_ciq-list.scss';

type TListProps<T> = {
    height: number;
    items: T[];
    onItemClick: (idx: number, item: T) => void;
    children: React.ReactNode;
};

const List = <T extends { id: string }>({ height, items, onItemClick, children }: TListProps<T>) => {
    const renderRow = typeof children === 'function' ? children : (item: any) => item.text;
    // eslint-disable-next-line no-useless-concat
    const itemClassName = (it: any) =>
        'ciq-list-item' + ` ${it.disabled ? 'disabled' : ''}` + ` ${it.active ? 'active' : ''}`;
    return (
        <Scroll className='ciq-list' autoHide height={height ? `${height}px` : ''}>
            {items.map((it: T, idx: number) => (
                <div key={it.id} className={itemClassName(it)} onClick={() => onItemClick(idx, it)}>
                    {renderRow(it)}
                </div>
            ))}
        </Scroll>
    );
};

export default List;
