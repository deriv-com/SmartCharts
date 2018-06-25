import React from 'react';
import {
    alertIconMap,
    ArrowDownIcon
} from './Icons.jsx';
import '../../sass/components/_ciq-alert-dialog.scss';

const AlertDialog = ({
    Dialog,
    alertTitle,
    closeDisplay,
    sureDisplay,
    onClose,
    onSure
}) => (
    <Dialog className="cq-dialog cq-alert-dialog">
        <div className="alrt-title">
            <alertIconMap.warning/>
            <span>
                {alertTitle}
            </span>
        </div>
        <div className="alrt-buttons">
            <div
                onClick={onClose}
                >{closeDisplay}
            </div>
            <div
                onClick={onSure}
                >{sureDisplay}
            </div>
        </div>
        <ArrowDownIcon/>
    </Dialog>
);

export default AlertDialog;