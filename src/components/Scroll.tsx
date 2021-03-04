// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
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
}: any) => {
    const handleRef = (_ref: any) => {
        setScrollPanel(_ref);
        if (setPanel) setPanel(_ref);
    };

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ scroll: s }) => ({
    setScrollPanel: s.setScrollPanel,
    isHover: s.isHover,
}))(Scroll);
