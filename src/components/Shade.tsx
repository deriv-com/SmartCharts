import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import ShadeStore from 'src/store/ShadeStore';

type TShadeProps = {
    store: ShadeStore;
};

const Shade = ({ store }: TShadeProps) => {
    const { visible, className, setShadeRef } = store;

    return (
        <div className={classNames('shade', className, { hidden: !visible })} ref={setShadeRef} style={{ top: -120 }} />
    );
};

export default observer(Shade);
