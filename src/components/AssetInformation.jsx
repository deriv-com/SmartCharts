import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-asset-information.scss';
import TranslationText from './TranslationText.jsx';

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
        {price && <div> <span><TranslationText value={t.translatable('SPOT')} />:</span> <span>{price}</span> </div>}
        {open && <div> <span><TranslationText value={t.translatable('OPEN')} />:</span> <span>{open}</span> </div>}
        {close && <div> <span><TranslationText value={t.translatable('CLOSE')} />:</span>  <span>{close}</span> </div>}
        {high && <div> <span><TranslationText value={t.translatable('HIGH')} />:</span>  <span>{high}</span> </div>}
        {low && <div> <span><TranslationText value={t.translatable('LOW')} />:</span>  <span>{low}</span> </div>}
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
