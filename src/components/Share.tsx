// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { DownloadIcon, PngIcon, CsvIcon } from './Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import { InlineLoader } from './Loader.jsx';
import '../../sass/components/_download.scss';

const Share = ({
    Dialog,
    menuOpen,
    downloadCSV,
    downloadPNG,
    isLoadingPNG,
    portalNodeId,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Dialog
        className='sc-download-menu'
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        title={t.translate('Download')}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        tooltip={t.translate('Download')}
        modalMode
        isFullscreen
        portalNodeId={portalNodeId}
    >
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Dialog.Title>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className={classNames('sc-download__menu', { 'sc-download__menu--active': menuOpen })}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <DownloadIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </Dialog.Title>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Dialog.Body>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-download'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <InlineLoader className='sc-download__item' onClick={downloadPNG} enabled={isLoadingPNG}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <PngIcon />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span className='sc-download__item__label'> {t.translate('PNG')} </span>
                </InlineLoader>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-download__item' onClick={downloadCSV}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <CsvIcon />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span className='sc-download__item__label'> {t.translate('CSV')}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </Dialog.Body>
    </Dialog>
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ share: d }) => ({
    Dialog: d.Dialog,
    menuOpen: d.menu.dialog.open,
    downloadPNG: d.downloadPNG,
    downloadCSV: d.downloadCSV,
    isLoadingPNG: d.isLoadingPNG,
}))(Share);
