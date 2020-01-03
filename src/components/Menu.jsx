import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
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
            onTitleClick,
            DropdownDialog,
            isMobile,
            isFullscreen,
            modalNode,
            enabled = true,
            shouldRenderDialogs,
            onMouseEnter,
            onMouseLeave,
            newStyle, // this props will remove after we apply new design
            // to all of components
        } = this.props;

        const first = React.Children.map(children, (child, i) => (i === 0 ? child : null));
        const rest  = React.Children.map(children, (child, i) => (i !== 0 ? child : null));

        if (newStyle) {
            const newDropdown = (shouldRenderDialogs
                && (
                    <DropdownDialog
                        className="cq-dialog"
                        isMobile={isMobile}
                        isFullscreen={isFullscreen}
                        title={title}
                        enableOverlay
                    >
                        {rest}
                    </DropdownDialog>
                ));
            const newDialog = (isMobile && modalNode)
                        && ReactDOM.createPortal(
                            <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                                <div
                                    className="cq-menu-overlay"
                                    onClick={this.onOverlayClick}
                                >
                                    {newDropdown}
                                </div>
                            </div>,
                            modalNode,
                        )
                    || newDropdown;
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
                    {(isMobile && modalNode)
                    && ReactDOM.createPortal(
                        <div className={`cq-modal-dropdown ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                            <div
                                className="cq-menu-overlay"
                                onClick={this.onOverlayClick}
                            >
                                {oldDropdown}
                            </div>
                        </div>,
                        modalNode,
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
