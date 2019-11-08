import React  from 'react';
import { CloseIcon } from './Icons.jsx';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
    title,
    setOpen,
    enableTabular,
}) => (
    <div
        className={`${className || 'cq-dialog'} ${enableTabular ? 'cq-dialog--tabular' : ''} ${open ? ' open' : ''}`}
        onClick={onContainerClick}
    >
        {title ? (
            <div className="cq-dialog__head">
                <div className="cq-dialog__head--title">{title}</div>
                <div className="cq-dialog__head--action">
                    <CloseIcon
                        onClick={() => setOpen(false)}
                    />
                </div>
            </div>
        ) : ''}
        <div className="cq-dialog__body">
            {children}
        </div>
    </div>
);

export default Dialog;
