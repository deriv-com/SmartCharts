import React, { useEffect }  from 'react';
import { CloseIcon } from './Icons.jsx';
import '../../sass/components/dialog.scss';

const Dialog = ({
    children,
    onContainerClick,
    className = '',
    title,
    customHead,
    enableTabular = false,
    handleCloseDialog,
    updateCloseCallback,
}) => {
    useEffect(() => updateCloseCallback(handleCloseDialog));
    return (
        <div
            className={`sc-dialog ${className} ${enableTabular ? 'sc-dialog--tabular' : ''}`}
            onClick={onContainerClick}
        >
            {title && (
                <div className="sc-dialog__head">
                    <div className="sc-dialog__head--title">{title}</div>
                    {customHead && (<div className="sc-dialog__head--custom">{customHead}</div>)}
                    <div className="sc-dialog__head--action">
                        <CloseIcon onClick={handleCloseDialog} />
                    </div>
                </div>
            ) }
            <div className="sc-dialog__body">
                {children}
            </div>
        </div>
    );
};

export default Dialog;
