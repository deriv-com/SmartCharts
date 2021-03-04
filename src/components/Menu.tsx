// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactDOM from 'react-dom';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { CSSTransition } from 'react-transition-group';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './MenuMobile.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import MenuMobile from './MenuMobile.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CloseIcon } from './Icons.jsx';

const Menu = ({
    open,
    dialogStatus,
    className,
    children,
    title,
    tooltip,
    onTitleClick,
    DropdownDialog,
    isMobile,
    isFullscreen,
    portalNodeId,
    enabled = true,
    shouldRenderDialogs,
    handleCloseDialog,
    onMouseEnter,
    onMouseLeave,
    theme,
    enableTabular,
    ready,
    customHead,
    emptyMenu,
    modalMode,
}: any) => {
    const onOverlayClick = (e: any) => {
        if (e.target.className === 'cq-modal__overlay') {
            handleCloseDialog();
        }
    };

    if (!ready) return '';

    const first = React.Children.map(children, (child: any, i: any) => (i === 0 ? child : null));
    const rest = React.Children.map(children, (child: any, i: any) => (i !== 0 ? child : null));
    if (modalMode) {
        const portalNode = document.getElementById(portalNodeId || 'smartcharts_modal');
        if (!portalNode) return '';

        const newDialog = ReactDOM.createPortal(
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className={`smartcharts-${theme}`}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div
                    className={classNames({
                        'smartcharts-mobile': isMobile,
                        'smartcharts-desktop': !isMobile,
                    })}
                >
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div
                        className={classNames('cq-modal-dropdown', className, {
                            stxMenuActive: open,
                        })}
                    >
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='cq-modal__overlay' onClick={onOverlayClick}>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <CSSTransition appear in={dialogStatus} timeout={300} classNames='sc-dialog' unmountOnExit>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <DropdownDialog
                                    isMobile={isMobile}
                                    isFullscreen={isFullscreen}
                                    title={title}
                                    handleCloseDialog={handleCloseDialog}
                                    enableTabular={enableTabular}
                                    customHead={customHead}
                                >
                                    {rest}
                                </DropdownDialog>
                            </CSSTransition>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>,
            portalNode
        );

        if (emptyMenu) {
            return open && newDialog;
        }

        return (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Tooltip
                className={classNames('ciq-menu', className || '', {
                    stxMenuActive: enabled && open,
                    'ciq-enabled': enabled,
                    'ciq-disabled': !enabled,
                })}
                content={tooltip}
                enabled={tooltip}
                position='right'
            >
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div
                    className='cq-menu-btn'
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={enabled ? onTitleClick : () => null}
                >
                    {first}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {enabled && open && newDialog}
            </Tooltip>
        );
    }

    const oldDropdown = shouldRenderDialogs && (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DropdownDialog
            className={classNames('cq-menu-dropdown', {
                'cq-menu-dropdown-enter-done': dialogStatus,
            })}
            isMobile={isMobile}
            isFullscreen={isFullscreen}
        >
            {title && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='title'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='title-text'>{title}</div>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <CloseIcon className='icon-close-menu' onClick={onTitleClick} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            )}
            {rest}
        </DropdownDialog>
    );

    return (
        (enabled && (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className={classNames('ciq-menu ciq-enabled', className, { stxMenuActive: open })}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div
                    className='cq-menu-btn'
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onTitleClick}
                >
                    {first}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {(isMobile && portalNodeId && (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <MenuMobile
                        className={className}
                        open={open}
                        menu_element={oldDropdown}
                        portalNodeId={portalNodeId}
                        onClick={onOverlayClick}
                    />
                )) ||
                    oldDropdown}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        )) || (
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className={classNames('ciq-menu ciq-disabled', className)}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='cq-menu-btn' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    {first}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        )
    );
};

Menu.Title = ({
    children,
}: any) => children;
Menu.Body = ({
    children,
}: any) => children;

export default Menu;
