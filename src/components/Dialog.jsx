import React  from 'react';
import { CloseIcon, BackIcon } from './Icons.jsx';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
    title,
    subTitle,
    onBack,
    setOpen,
    enableTabular,
    enableOverlay,
    isPortal,
}) => (
    <>
        {enableOverlay ? (
            <div className={`${isPortal ? 'cq-dialog-portal' : 'cq-dialog-overlay'} ${open ? 'cq-dialog-active' : ''}`}>
                <div
                    className={`${className || 'cq-dialog'} ${enableTabular ? 'cq-dialog--tabular' : ''} ${open ? ' open' : ''}`}
                    onClick={onContainerClick}
                >
                    {title ? (
                        <div className="cq-dialog__head">
                            <div className="cq-dialog__head--title">{title}</div>
                            {
                                subTitle
                                    ? (
                                        <div className="cq-dialog__head--subtitle">
                                            <BackIcon onClick={() => onBack()} />
                                            {subTitle}
                                        </div>
                                    ) : ''
                            }
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
            </div>
        ) : (
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
        )}
    </>
);


export default Dialog;
