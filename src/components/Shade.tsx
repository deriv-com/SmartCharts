import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

const Shade = ({ store }: any) => {
    const { visible, className, setShadeRef } = store;

    return (
        <div className={classNames('shade', className, { hidden: !visible })} ref={setShadeRef} style={{ top: -120 }} />
    );
};

export default observer(Shade);
