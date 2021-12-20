import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import '../../sass/components/_indicator_prediction_dialog.scss';
import Menu from './Menu';

const IndicatorPredictionDialog = () => {
    const { timeperiod } = useStores();

    const {
        menuStore,
        dialogPortalNodeId,
        handleCancel: onCancel,
        handleContinue: onContinue,
    } = timeperiod.predictionIndicator;

    return (
        <Menu
            store={menuStore}
            className='cq-dialog--indicator-prediction'
            modalMode
            emptyMenu
            portalNodeId={dialogPortalNodeId}
        >
            <Menu.Title />
            <Menu.Body>
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
            </Menu.Body>
        </Menu>
    );
};

export default observer(IndicatorPredictionDialog);
