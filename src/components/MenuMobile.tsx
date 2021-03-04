// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactDOM from 'react-dom';
import { connect } from '../store/Connect';
import '../../sass/components/_menu-dropdown.scss';

const MenuMobile = ({
    className,
    menu_element,
    portalNodeId,
    open,
    onClick,
    theme,
}: any) => {
    // fix to remove body background scrolling when scrolling on absolute element
    const disableBodyScroll = () => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'string'.
            document.body.style.overflow = null;
        }
    };

    disableBodyScroll();
    if (!portalNodeId) return menu_element;
    return ReactDOM.createPortal(
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`smartcharts-portal ${open ? 'smartcharts-portal--open' : ''}`}>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className={`smartcharts smartcharts-${theme}`}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='smartcharts-mobile'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='cq-modal__overlay' onClick={onClick}>
                            {menu_element}
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>,
        document.getElementById(portalNodeId)
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chartSetting,
}: any) => ({
    theme: chartSetting.theme,
}))(MenuMobile);
