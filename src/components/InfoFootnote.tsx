import classNames from 'classnames';
import React from 'react';

type InfoFootnoteProps = {
    className?: string;
    isMobile?: boolean;
    text: string;
};

const InfoFootnote = ({ className, isMobile, text }: InfoFootnoteProps) => (
    <div
        className={classNames(className,{
            [`${className}--mobile`]: isMobile,
        })}
    >
        {text}
    </div>
);

InfoFootnote.defaultProps = {
    className: 'info-footnote',
    isMobile: false,
};

export default React.memo(InfoFootnote);
