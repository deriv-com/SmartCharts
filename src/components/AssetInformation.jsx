import React from 'react';
import '../../sass/components/_ciq-asset-information.scss';

const AssetInformation = () => (
    <div className="ciq-asset-information" style={{ visibility: 'hidden' }}>
        <div>
            <div>{ t.translate('SPOT') }:</div>
            <div className="ciq-ai-spot" />
        </div>
        <div>
            <div>{ t.translate('OPEN') }:</div>
            <div className="ciq-ai-open" />
        </div>
        <div>
            <div>{ t.translate('CLOSE') }:</div>
            <div className="ciq-ai-close" />
        </div>
        <div>
            <div>{ t.translate('HIGH') }:</div>
            <div className="ciq-ai-high" />
        </div>
        <div>
            <div>{ t.translate('LOW') }:</div>
            <div className="ciq-ai-low" />
        </div>
    </div>

);

export default AssetInformation;
