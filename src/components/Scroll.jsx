import React from 'react';
import { connect }  from '../store/Connect';
import '../../sass/components/_scroll.scss';

const Scroll = ({
    children,
    className,
    height,
    width,
    setScrollPanel,
    isHover,
    autoHide,
    freeze = false,
    onScroll = () => null,
    setPanel,
    isBypassed,
}) => {
    const handleRef = (_ref) => {
        setScrollPanel(_ref);
        if (setPanel) setPanel(_ref);
    };
    const _classname = isBypassed
        ? ''
        : `sc-scrollbar ${autoHide ? 'sc-scrollbar--auto-hide' : ''} ${isHover ? 'sc-scrollbar--hover' : ''} ${freeze ? 'sc-scrollbar--freeze' : ''}`;

    return (
        <div
            ref={handleRef}
            className={`${_classname} ${className || ''}`}
            onScroll={onScroll}
            style={{
                maxHeight: height || '100%',
                maxWidth: width || 'none',
            }}
        >
            {children}
        </div>
    );
};

export default connect(({ scroll: s }) => ({
    setScrollPanel: s.setScrollPanel,
    isHover: s.isHover,
}))(Scroll);
