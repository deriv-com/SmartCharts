import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/_ciq-asset-information.scss';

const AssetInformation = ({
    price,
    open,
    close,
    high,
    low,
}) => (
    <div className='ciq-asset-information'>
        <div className='info'> <div>PRICE:</div> <div>{price}</div> </div>
        <div className='info'> <div>OPEN:</div> <div>{open}</div> </div>
        <div className='info'> <div>CLOSE:</div> <div>{close}</div> </div>
        <div className='info'> <div>HIGH:</div> <div>{high}</div> </div>
        <div className='info'> <div>LOW:</div> <div>{low}</div> </div>
    </div>
);

export default connect(
    ({assetInformation: ai}) => ({
        price: ai.price,
        open: ai.open,
        close: ai.close,
        high: ai.high,
        low: ai.low,
    })
)(AssetInformation);

