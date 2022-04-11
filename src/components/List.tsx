import React from 'react';
import { observer } from 'mobx-react-lite';
import ListStore, { TListItem } from 'src/store/ListStore';
import Scroll from './Scroll';
import '../../sass/components/_ciq-list.scss';

type TListProps = {
    height: number;
    children: React.ReactNode;
    store: ListStore;
};

const List = ({ height, store, children }: TListProps) => {
    const { getItems, onItemClick } = store;
    const renderRow = typeof children === 'function' ? children : (item: TListItem) => item.text;
    const itemClassName = (it: TListItem) =>
        // eslint-disable-next-line no-useless-concat
        'ciq-list-item' + ` ${it.disabled ? 'disabled' : ''}` + ` ${it.active ? 'active' : ''}`;
    return (
        <Scroll className='ciq-list' autoHide height={height ? `${height}px` : ''}>
            {getItems().map((it, idx: number) => (
                <div key={it.id} className={itemClassName(it)} onClick={() => onItemClick(idx, it)}>
                    {renderRow(it)}
                </div>
            ))}
        </Scroll>
    );
};

export default observer(List);
