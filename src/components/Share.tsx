import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { DownloadIcon, PngIcon, CsvIcon } from './Icons';
import { InlineLoader } from './Loader';
import '../../sass/components/_download.scss';

type TShareProps = {
    portalNodeId?: string;
};

const Share: React.FC<TShareProps> = ({ portalNodeId }) => {
    const { share } = useStores();
    const { Dialog, menu, downloadCSV, downloadPNG, isLoadingPNG } = share;
    const { open: menuOpen } = menu.dialog;

    return (
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
};

export default observer(Share);
