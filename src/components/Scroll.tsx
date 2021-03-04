import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
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
}) => {
    const handleRef = _ref => {
        setScrollPanel(_ref);
        if (setPanel) setPanel(_ref);
    };

    return (
        <div
            ref={handleRef}
            className={classNames('sc-scrollbar', className, {
                'sc-scrollbar--freeze': freeze,
                'sc-scrollbar--auto-hide': autoHide,
                'sc-scrollbar--hover': isHover,
            })}
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
