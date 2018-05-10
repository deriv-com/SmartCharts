import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {
    ShareIcon,
    CopyIcon
} from './Icons.jsx';
import '../../sass/components/_ciq-share.scss';


const Share = ({
    Menu,
    menuOpen,
    loading,
    urlGenerated,
    refereshShareLink,
    shareLink,
    downloadCSV,
    downloadPNG,
    copyToClipboard,
    resetCopyTooltip,
    copyTooltip,
    onInputRef,
}) => {
    return (
        <Menu className="cq-share">
            <Menu.Title>
                <ShareIcon
                    className = {`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate("Share")}
                />
            </Menu.Title>
            <Menu.Body>
                <div className='title'> {t.translate('Share / Download Chart')} </div>
                <div className='body'>

                    <div className='caption1'>{t.translate('Share link')}</div>
                    <div className="loading"
                        style={{display: (loading ? 'block' : 'none')}}
                    ></div>
                    <div className='content'
                        style={{display: ((!loading && !urlGenerated) ? 'flex' : 'none' )}}>
                        <div
                            className='download-btn'
                            onClick={refereshShareLink}
                        >
                            {t.translate('Retry')}
                        </div>
                    </div>
                    <div className='content'
                        style={{display: ((!loading && urlGenerated) ? 'flex' : 'none' )}}
                    >
                        <input
                            ref={onInputRef}
                            value={shareLink}
                        />
                        <CopyIcon
                            className='tooltip'
                            onClick={copyToClipboard}
                            onMouseOut={resetCopyTooltip}
                            tooltip-title={copyTooltip}
                        />
                    </div>

                    <div className='caption2'>{t.translate('Download chart')}</div>
                    <div className='content'>
                        <div
                            className='download-btn'
                            onClick={downloadPNG}
                        > PNG </div>
                        <div
                            className='download-btn'
                            onClick={downloadCSV}
                        > CSV </div>
                    </div>
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default connect(({share: s}) => ({
    Menu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    loading: s.loading,
    urlGenerated: s.urlGenerated,
    refereshShareLink: s.refereshShareLink,
    shareLink: s.shareLink,
    downloadPNG: s.downloadPNG,
    downloadCSV: s.downloadCSV,
    copyToClipboard: s.copyToClipboard,
    onInputRef: s.onInputRef,
    resetCopyTooltip:  s.resetCopyTooltip,
    copyTooltip: s.copyTooltip,
}))(Share);
