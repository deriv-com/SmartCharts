import React from 'react';
import { connect } from '../store/Connect';
import {
    DownloadIcon,
    CloseIcon,
    PngIcon,
    CsvIcon,
} from './Icons.jsx';
import '../../sass/components/_ciq-download.scss';


const Share = ({
    ShareMenu,
    menuOpen,
    downloadCSV,
    downloadPNG,
    closeMenu,
    isLoadingPNG,
}) => (
    <ShareMenu className="cq-download">
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

export default connect(({ share: d }) => ({
    ShareMenu: d.ShareMenu,
    menuOpen: d.menu.dialog.open,
    downloadPNG: d.downloadPNG,
    downloadCSV: d.downloadCSV,
    closeMenu: d.menu.onTitleClick,
    isLoadingPNG: d.isLoadingPNG,
}))(Share);
