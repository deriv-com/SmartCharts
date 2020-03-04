import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import MenuMobile from './MenuMobile.jsx';
import { CloseIcon } from './Icons.jsx';

class Menu extends Component {
    onOverlayClick = (e) => {
        if (e.target.className === 'cq-menu-overlay') {
            this.props.setOpen(false);
        }
    };

    render() {
        const {
            open,
            className,
            children,
            title,
            tooltip,
            onTitleClick,
            DropdownDialog,
            isMobile,
            isFullscreen,
            modalNode,
            portalNodeId,
            enabled = true,
            shouldRenderDialogs,
            onMouseEnter,
            onMouseLeave,
            theme,
            newStyle, // this props will remove after we apply new design
            // to all of components
        } = this.props;

        const first = React.Children.map(children, (child, i) => (i === 0 ? child : null));
        const rest  = React.Children.map(children, (child, i) => (i !== 0 ? child : null));
        if (newStyle) {
            const portalNode = document.getElementById(portalNodeId || 'smartcharts_modal');
            const newDropdown = (shouldRenderDialogs
                && (
                    <DropdownDialog
                        className="cq-dialog"
                        isMobile={isMobile}
                        isFullscreen={isFullscreen}
                        title={title}
                        enableOverlay
                        isPortal={portalNode}
                    >
                        {rest}
                    </DropdownDialog>
                ));
            const modalDropdown = (
                <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                    <div
                        className="cq-menu-overlay"
                        onClick={this.onOverlayClick}
                    >
                        {newDropdown}
                    </div>
                </div>
            );
            const newDialog = (isMobile && modalNode)
                ? ReactDOM.createPortal(
                    modalDropdown,
                    modalNode,
                ) : ReactDOM.createPortal(
                    <div className={`smartcharts-${theme}`}>
                        {modalDropdown}
                    </div>,
                    portalNode,
                );

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
                        {tooltip ? (<div className="tooltip tooltip--right">{tooltip}</div>) : ''}
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
                        {tooltip ? (<div className="tooltip tooltip--right">{tooltip}</div>) : ''}
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
                    {(isMobile && (portalNodeId || modalNode))
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
