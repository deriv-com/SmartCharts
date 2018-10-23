import React from 'react';
import { connect } from '../store/Connect';
import {
    DownloadIcon,
    PngIcon,
    CsvIcon,
} from './Icons.jsx';
import TranslationText from './TranslationText.jsx';
import '../../sass/components/_ciq-download.scss';


const Share = ({
    ShareMenu,
    menuOpen,
    downloadCSV,
    downloadPNG,
    isLoadingPNG,
}) => (
    <ShareMenu
        className="cq-download"
        title={t.translatable('Download Chart')}
    >
        <ShareMenu.Title>
            <DownloadIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translatable('Download')}
            />
        </ShareMenu.Title>
        <ShareMenu.Body>
            <div className="body">
                <div className="content">
                    <div className="ciq-list ciq-list-download">
                        <div
                            className="ciq-list-item"
                            onClick={downloadPNG}
                        >
                            <span>
                                <TranslationText className="ciq-icon-text" value={t.translatable('Download as PNG')} />
                                {isLoadingPNG && <span className="cq-loading" />}
                            </span>
                            <PngIcon />
                        </div>
                        <div
                            className="ciq-list-item"
                            onClick={downloadCSV}
                        >
                            <TranslationText className="ciq-icon-text" value={t.translatable('Download as CSV')} />
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
    isLoadingPNG: d.isLoadingPNG,
}))(Share);
