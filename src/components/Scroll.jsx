import React from 'react';
import { connect }  from '../store/Connect';
import '../../sass/components/scroll.scss';

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
}) => {
    const handleRef = (_ref) => {
        setScrollPanel(_ref);
        if (setPanel) setPanel(_ref);
    };

    return (
        <div
            ref={handleRef}
            className={`sc-scrollbar ${freeze ? 'sc-scrollbar--freeze' : ''} ${className || ''} ${autoHide ? 'sc-scrollbar--auto-hide' : ''} ${isHover ? 'sc-scrollbar--hover' : ''}`}
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
