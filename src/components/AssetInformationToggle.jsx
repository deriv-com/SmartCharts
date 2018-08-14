import React from 'react';
import { Switch } from './Form.jsx';

const AssetInformationToggle = ({
    value,
    onChange,
}) => (
    <div className="ciq-list-item">
        <span className="ciq-icon-text">{t.translate('Asset Information')}</span>
        <div className="ciq-action">
            <Switch
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

export default AssetInformationToggle;
