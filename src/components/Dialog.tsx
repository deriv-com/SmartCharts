import React, { useEffect } from 'react';

import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CloseIcon } from './Icons';
import '../../sass/components/_dialog.scss';

const Dialog = ({
    children,
    onContainerClick,
    className = '',
    title,
    customHead,
    enableTabular = false,
    handleCloseDialog,
    updateCloseCallback,
}: any) => {
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

export default Dialog;
