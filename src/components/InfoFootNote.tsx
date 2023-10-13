import classNames from 'classnames';
import React from 'react';

type InfoFootNoteProps = {
    className?: string;
    isMobile?: boolean;
    text: string;
};

const InfoFootNote = ({ className, isMobile, text }: InfoFootNoteProps) => (
    <div
        className={classNames('info-foot-note', className, {
            [`${className}--mobile`]: isMobile,
        })}
    >
        {text}
    </div>
);

InfoFootNote.defaultProps = {
    className: '',
    isMobile: false,
};

export default React.memo(InfoFootNote);
