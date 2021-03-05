import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { DownloadIcon, PngIcon, CsvIcon } from './Icons';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader' was resolved to '/Users/bala... Remove this comment to see the full error message
import { InlineLoader } from './Loader';
import '../../sass/components/_download.scss';

const Share = ({ Dialog, menuOpen, downloadCSV, downloadPNG, isLoadingPNG, portalNodeId }: any) => (
    <Dialog
        className='sc-download-menu'
        title={t.translate('Download')}
        tooltip={t.translate('Download')}
        modalMode
        isFullscreen
        portalNodeId={portalNodeId}
    >
        <Dialog.Title>
            <div className={classNames('sc-download__menu', { 'sc-download__menu--active': menuOpen })}>
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
