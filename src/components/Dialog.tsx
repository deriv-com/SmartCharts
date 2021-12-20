import React, { useEffect } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import DialogStore from 'src/store/DialogStore';
import { CloseIcon } from './Icons';
import '../../sass/components/_dialog.scss';

export type TDialogProps = {
    store: DialogStore;
    className?: string;
    enableTabular?: boolean;
    title?: string;
    handleCloseDialog?: () => void;
    customHead?: React.ReactElement;
    children?: React.ReactNode;
};

const Dialog = ({
    store,
    children,
    className = '',
    title,
    customHead,
    enableTabular = false,
    handleCloseDialog,
}: TDialogProps) => {
    const { updateCloseCallback, onContainerClick } = store;
    useEffect(() => updateCloseCallback(handleCloseDialog));
    return (
        <div
            className={classNames('sc-dialog', className, { 'sc-dialog--tabular': enableTabular })}
            onClick={onContainerClick}
        >
            {title && (
                <div className='sc-dialog__head'>
                    <div className='sc-dialog__head--title'>{title}</div>
                    {customHead && <div className='sc-dialog__head--custom'>{customHead}</div>}
                    <div className='sc-dialog__head--action'>
                        <CloseIcon onClick={handleCloseDialog} />
                    </div>
                </div>
            )}
            <div className='sc-dialog__body'>{children}</div>
        </div>
    );
};

export default observer(Dialog);
