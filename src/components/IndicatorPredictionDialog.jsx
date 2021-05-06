import React from 'react';
import '../../sass/components/_settings-dialog.scss';

const IndicatorPredictionDialog = ({ SettingDialogMenu, dialogPortalNodeId }) => (
    <SettingDialogMenu
        className='cq-modal--settings'
        modalMode
        emptyMenu
        enableOverlay // this temprary, we remove it when all menus convert to modal
        portalNodeId={dialogPortalNodeId}
    >
        <SettingDialogMenu.Title />
        <SettingDialogMenu.Body>
            <div className='cq-chart-settings'>
                <strong>Are you sure?</strong>
                <p>
                    Some of your active indicators don’t support 1-tick intervals. If you change to a 1-tick interval,
                    these indicators will be removed from your chart.
                </p>
            </div>
        </SettingDialogMenu.Body>
    </SettingDialogMenu>
);
export default IndicatorPredictionDialog;
