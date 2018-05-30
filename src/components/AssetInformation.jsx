import React, { Component } from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-asset-information.scss';

const AssetInformation = ({
    price,
    open,
    close,
    high,
    low,
    visible,
}) => (
    <div
        className={`ciq-asset-information ${!visible ? 'hide' : ''}`}
    >
        {price && <div> <div>{t.translate('PRICE')}:</div> <div>{price}</div> </div>}
        {open && <div> <div>{t.translate('OPEN')}:</div> <div>{open}</div> </div>}
        {close && <div> <div>{t.translate('CLOSE')}:</div> <div>{close}</div> </div>}
        {high && <div> <div>{t.translate('HIGH')}:</div> <div>{high}</div> </div>}
        {low && <div> <div>{t.translate('LOW')}:</div> <div>{low}</div> </div>}
    </div>
);

export default connect(({ assetInformation: ai }) => ({
    price: ai.price,
    open: ai.open,
    close: ai.close,
    high: ai.high,
    low: ai.low,
    visible: ai.visible,
}))(AssetInformation);

