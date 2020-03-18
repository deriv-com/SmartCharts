import React, { useEffect }  from 'react';
import { CloseIcon } from './Icons.jsx';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    children,
    onContainerClick,
    className,
    title,
    enableTabular,
    handleCloseDialog,
    updateCloseCallback,
}) => {
    useEffect(() => updateCloseCallback(handleCloseDialog));

    return (
        <div
            className={`cq-dialog ${className || ''} ${enableTabular ? 'cq-dialog--tabular' : ''}`}
            onClick={onContainerClick}
        >
            {title ? (
                <div className="cq-dialog__head">
                    <div className="cq-dialog__head--title">{title}</div>
                    <div className="cq-dialog__head--action">
                        <CloseIcon onClick={handleCloseDialog} />
                    </div>
                </div>
            ) : ''}
            <div className="cq-dialog__body">
                {children}
            </div>
        </div>
    );
};

export default Dialog;
