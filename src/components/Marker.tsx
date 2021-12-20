import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import connectStore from 'src/store/ConnectStore';
import '../../sass/components/_markers.scss';
import MarkerStore from '../store/MarkerStore';

export type TMarkerBaseProps = {
    store: MarkerStore;
    children?: React.ReactNode;
};

const Marker = ({ store, children }: TMarkerBaseProps): React.ReactElement => {
    const { display, left, bottom, className } = store;

    return (
        <div className={classNames('stx-marker', className)} style={{ display, left, bottom }}>
            {children}
        </div>
    );
};

const MarkerWrapper = connectStore<TMarkerBaseProps, void>(observer(Marker), MarkerStore);

export default MarkerWrapper;
