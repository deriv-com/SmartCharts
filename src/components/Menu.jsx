import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import MenuMobile from './MenuMobile.jsx';
import { CloseIcon } from './Icons.jsx';

class Menu extends Component {
    onOverlayClick = (e) => {
        if (e.target.className === 'cq-menu-overlay') {
            this.props.handleCloseDialog();
        }
    };

    render() {
        const {
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
            ready,
            emptyMenu,
            newStyle, // this props will remove after we apply new design
            // to all of components
        } = this.props;

        if (!ready) return '';

        const first = React.Children.map(children, (child, i) => (i === 0 ? child : null));
        const rest  = React.Children.map(children, (child, i) => (i !== 0 ? child : null));
        if (newStyle) {
            const portalNode = document.getElementById(portalNodeId || 'smartcharts_modal');
            const newDropdown = (shouldRenderDialogs
                && (
                    <CSSTransition
                        appear
                        in={dialogStatus}
                        timeout={300}
                        classNames="cq-dialog"
                        unmountOnExit
                    >
                        <DropdownDialog
                            isMobile={isMobile}
                            isFullscreen={isFullscreen}
                            title={title}
                            handleCloseDialog={handleCloseDialog}
                        >
                            {rest}
                        </DropdownDialog>
                    </CSSTransition>
                ));
            const modalDropdown = (
                <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                    <div
                        className="cq-menu-overlay"
                        onClick={this.onOverlayClick}
                    >
                        <div className={`${portalNode ? 'cq-dialog-portal' : 'cq-dialog-overlay'}`}>
                            {newDropdown}
                        </div>
                    </div>
                </div>
            );
            const newDialog = ReactDOM.createPortal(
                <div className={`smartcharts-${theme}`}>
                    <div className={`smartcharts-${isMobile ? 'mobile' : 'desktop'}`}>
                        {modalDropdown}
                    </div>
                </div>,
                portalNode,
            );

            if (emptyMenu) {
                return (open ? newDialog : '');
            }

            return (
                enabled && (
                    <div className={`ciq-menu ciq-enabled ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                        <div
                            className="cq-menu-btn"
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onClick={onTitleClick}
                        >
                            {first}
                        </div>
                        {tooltip ? (<div className="sc-tooltip sc-tooltip--right">{tooltip}</div>) : ''}
                        {open ? newDialog : ''}
                    </div>
                ) || (
                    <div className={`ciq-menu ciq-disabled ${className || ''}`}>
                        <div
                            className="cq-menu-btn"
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        >
                            {first}
                        </div>
                        {tooltip ? (<div className="sc-tooltip sc-tooltip--right">{tooltip}</div>) : ''}
                    </div>
                )
            );
        }

        const oldDropdown = (shouldRenderDialogs
            && (
                <CSSTransition
                    in={open}
                    timeout={150}
                    classNames="cq-menu-dropdown"
                    unmountOnExit
                >
                    <DropdownDialog
                        className="cq-menu-dropdown"
                        isMobile={isMobile}
                        isFullscreen={isFullscreen}
                    >
                        {title
                    && (
                        <div className="title">
                            <div className="title-text">{title}</div>
                            <CloseIcon
                                className="icon-close-menu"
                                onClick={onTitleClick}
                            />
                        </div>
                    )
                        }
                        {rest}
                    </DropdownDialog>
                </CSSTransition>
            ));

        return (

            enabled && (
                <div className={`ciq-menu ciq-enabled ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                    <div
                        className="cq-menu-btn"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={onTitleClick}
                    >
                        {first}
                    </div>
                    {(isMobile && portalNodeId)
                    && (
                        <MenuMobile
                            className={className}
                            open={open}
                            menu_element={oldDropdown}
                            portalNodeId={portalNodeId}
                            onClick={this.onOverlayClick}
                        />
                    )
                || (oldDropdown)}
                </div>
            ) || (
                <div className={`ciq-menu ciq-disabled ${className || ''}`}>
                    <div
                        className="cq-menu-btn"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {first}
                    </div>
                </div>
            )
        );
    }
}

Menu.Title = ({ children }) => children;
Menu.Body  = ({ children }) => children;

export default Menu;
