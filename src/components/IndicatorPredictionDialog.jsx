import React from 'react';
import '../../sass/components/_indicator_prediction_dialog.scss';

const IndicatorPredictionDialog = ({ Dialog, dialogPortalNodeId, onCancel, onContinue }) => (
    <Dialog
        className='cq-dialog--indicator-prediction'
        modalMode
        emptyMenu
        enableOverlay // this temprary, we remove it when all menus convert to modal
        portalNodeId={dialogPortalNodeId}
    >
        <Dialog.Title />
        <Dialog.Body>
            <div className='cq-indicator-prediction'>
                <strong>{t.translate('Are you sure?')}</strong>
                <p>
                    {t.translate(
                        'Some of your active indicators don’t support 1-tick intervals. If you change to a 1-tick interval, these indicators will be removed from your chart.'
                    )}
                </p>
                <div className='cq-indicator-prediction__footer'>
                    <button type='button' className='sc-btn sc-btn--outline-secondary' onClick={onCancel}>
                        {t.translate('Cancel')}
                    </button>
                    <button type='button' className='sc-btn sc-btn--primary' onClick={onContinue}>
                        {t.translate('Continue')}
                    </button>
                </div>
            </div>
        </Dialog.Body>
    </Dialog>
);

export default IndicatorPredictionDialog;
