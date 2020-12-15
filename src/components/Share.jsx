import React from 'react';
import { connect } from '../store/Connect';
import { DownloadIcon, PngIcon, CsvIcon } from './Icons.jsx';
import { InlineLoader } from './Loader.jsx';
import '../../sass/components/_download.scss';

const Share = ({ Dialog, menuOpen, downloadCSV, downloadPNG, isLoadingPNG, portalNodeId }) => (
    <Dialog
        className='sc-download-menu'
        title={t.translate('Download')}
        tooltip={t.translate('Download')}
        modalMode
        isFullscreen
        portalNodeId={portalNodeId}
    >
        <Dialog.Title>
            <div className={`sc-download__menu ${menuOpen ? 'sc-download__menu--active' : ''}`}>
                <DownloadIcon />
            </div>
        </Dialog.Title>
        <Dialog.Body>
            <div className='sc-download'>
                <InlineLoader className='sc-download__item' onClick={downloadPNG} enabled={isLoadingPNG}>
                    <PngIcon />
                    <span className='sc-download__item__label'> {t.translate('PNG')} </span>
                </InlineLoader>
                <div className='sc-download__item' onClick={downloadCSV}>
                    <CsvIcon />
                    <span className='sc-download__item__label'> {t.translate('CSV')}</span>
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
