import React from 'react';
import { connect } from '../store/Connect';
import {
    DownloadIcon,
    PngIcon,
    CsvIcon,
} from './Icons.jsx';
import '../../sass/components/_ciq-download.scss';

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
}) => (
    <Dialog
        className="cq-download-menu"
        title={t.translate('Download')}
        newStyle
    >
        <Dialog.Title>
            <DownloadIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Download')}
            />
        </Dialog.Title>
        <Dialog.Body>
            <div className="cq-download">
                <div
                    className={`cq-download__item ${isLoadingPNG ? 'cq-download__item--loading' : ''}`}
                    onClick={downloadPNG}
                >
                    <PngIcon />
                    <span className="cq-download__item__label"> {t.translate('PNG')} </span>
                    {isLoadingPNG && <Loading />}
                </div>
                <div
                    className="cq-download__item"
                    onClick={downloadCSV}
                >
                    <CsvIcon />
                    <span className="cq-download__item__label"> {t.translate('CSV')}</span>
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
