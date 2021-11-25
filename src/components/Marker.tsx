import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import connectStore from 'src/store/ConnectStore';
import '../../sass/components/_markers.scss';
import MarkerStore from '../store/MarkerStore';

export type TMarkerProps = {
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

const BarrierWrapper = connectStore<TMarkerProps>(observer(Marker), MarkerStore);

export default BarrierWrapper;
