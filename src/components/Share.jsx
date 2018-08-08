import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import {
    ShareIcon,
    CloseIcon,
} from './Icons.jsx';
import '../../sass/components/_ciq-share.scss';


const Share = ({
    ShareMenu,
    menuOpen,
    downloadCSV,
    downloadPNG,
    closeMenu,
    isLoadingPNG,
}) => (
    <ShareMenu className="cq-share">
        <ShareMenu.Title>
            <ShareIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Share')}
            />
        </ShareMenu.Title>
        <ShareMenu.Body>
            <div className="title">
                <div className="title-text">{t.translate('Share / Download Chart')}</div>
                <CloseIcon
                    className="icon-close-menu"
                    onClick={() => closeMenu()}
                />
            </div>
            <div className="body">
                <div className="caption2">{t.translate('Download chart')}</div>
                <div className="content">
                    <div
                        className="download-btn"
                        onClick={downloadPNG}
                    > PNG {isLoadingPNG && <span className="cq-loading" />}
                    </div>
                    <div
                        className="download-btn"
                        onClick={downloadCSV}
                    > CSV
                    </div>
                </div>
            </div>
        </ShareMenu.Body>
    </ShareMenu>
);

export default connect(({ share: s }) => ({
    ShareMenu: s.menu.connect(Menu),
    menuOpen: s.menu.dialog.open,
    downloadPNG: s.downloadPNG,
    downloadCSV: s.downloadCSV,
    closeMenu: s.menu.onTitleClick,
    isLoadingPNG: s.isLoadingPNG,
}))(Share);
