import React from 'react';
import { connect } from '../store/Connect';
import {
    DownloadIcon,
    CloseIcon,
    PngIcon,
    CsvIcon,
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
            <DownloadIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Download')}
            />
        </ShareMenu.Title>
        <ShareMenu.Body>
            <div className="title">
                <div className="title-text">{t.translate('Download Chart')}</div>
                <CloseIcon
                    className="icon-close-menu"
                    onClick={() => closeMenu()}
                />
            </div>
            <div className="body">
                <div className="content">
                    <div className="ciq-list ciq-list-download">
                        <div
                            className="ciq-list-item"
                            onClick={downloadPNG}
                        >
                            <span className="ciq-icon-text">
                                {t.translate('Download as PNG')}
                                {isLoadingPNG && <span className="cq-loading" />}
                            </span>
                            <PngIcon />
                        </div>
                        <div
                            className="ciq-list-item"
                            onClick={downloadCSV}
                        >
                            <span className="ciq-icon-text">
                                {t.translate('Download as CSV')}
                            </span>
                            <CsvIcon />
                        </div>
                    </div>
                </div>
            </div>
        </ShareMenu.Body>
    </ShareMenu>
);

export default connect(({ share: s }) => ({
    ShareMenu: s.ShareMenu,
    menuOpen: s.menu.dialog.open,
    downloadPNG: s.downloadPNG,
    downloadCSV: s.downloadCSV,
    closeMenu: s.menu.onTitleClick,
    isLoadingPNG: s.isLoadingPNG,
}))(Share);
