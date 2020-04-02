import React from 'react';
import { connect } from '../store/Connect';
import {
    DownloadIcon,
    PngIcon,
    CsvIcon,
} from './Icons.jsx';
import '../../sass/components/download.scss';

const Loading = () => (
    <div className="loading">
        <span className="loading__bullet" />
        <span className="loading__bullet" />
        <span className="loading__bullet" />
        <span className="loading__bullet" />
    </div>
);

const Share = ({
    Dialog,
    menuOpen,
    downloadCSV,
    downloadPNG,
    isLoadingPNG,
    portalNodeId,
}) => (
    <Dialog
        className="sc-download-menu"
        title={t.translate('Download')}
        tooltip={t.translate('Download')}
        newStyle
        isFullscreen
        portalNodeId={portalNodeId}
    >
        <Dialog.Title>
            <div className={`sc-download__menu ${menuOpen ? 'sc-download__menu--active' : ''}`}>
                <DownloadIcon />
            </div>
        </Dialog.Title>
        <Dialog.Body>
            <div className="sc-download">
                <div
                    className={`sc-download__item ${isLoadingPNG ? 'sc-download__item--loading' : ''}`}
                    onClick={downloadPNG}
                >
                    <PngIcon />
                    <span className="sc-download__item__label"> {t.translate('PNG')} </span>
                    {isLoadingPNG && <Loading />}
                </div>
                <div
                    className="sc-download__item"
                    onClick={downloadCSV}
                >
                    <CsvIcon />
                    <span className="sc-download__item__label"> {t.translate('CSV')}</span>
                </div>
            </div>
        </Dialog.Body>
    </Dialog>
);

export default connect(({ share: d }) => ({
    Dialog: d.Dialog,
    menuOpen: d.menu.dialog.open,
    downloadPNG: d.downloadPNG,
    downloadCSV: d.downloadCSV,
    isLoadingPNG: d.isLoadingPNG,
}))(Share);
