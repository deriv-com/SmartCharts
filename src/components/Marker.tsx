import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import connectStore from 'src/store/ConnectStore';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

type TMarkerProps = {
    store: MarkerStore;
};

const Marker: React.FC<TMarkerProps> = ({ store, children }) => {
    const { display, left, bottom, className } = store;

    return (
        <div className={classNames('stx-marker', className)} style={{ display, left, bottom }}>
            {children}
        </div>
    );
};

const BarrierWrapper = connectStore(observer(Marker), MarkerStore);

export default BarrierWrapper;
