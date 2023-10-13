import classNames from 'classnames';
import React from 'react';

type InfoFootnoteProps = {
    className?: string;
    isMobile?: boolean;
    text: string;
};

const InfoFootnote = ({ className, isMobile, text }: InfoFootnoteProps) => (
    <div
        className={classNames('info-footnote', className, {
            [`${className}--mobile`]: isMobile,
        })}
    >
        {text}
    </div>
);

InfoFootnote.defaultProps = {
    className: '',
    isMobile: false,
};

export default React.memo(InfoFootnote);
