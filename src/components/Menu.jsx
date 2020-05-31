import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Tooltip from './Tooltip.jsx';

class Menu extends Component {
    onOverlayClick = (e) => {
        if (e.target.className === 'cq-modal__overlay') {
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
            enableTabular,
            ready,
            customHead,
            emptyMenu,
        } = this.props;

        if (!ready) return '';

        const first = React.Children.map(children, (child, i) => (i === 0 ? child : null));
        const rest  = React.Children.map(children, (child, i) => (i !== 0 ? child : null));
        const portalNode = document.getElementById(portalNodeId || 'smartcharts_modal');
        const modalDropdown = (
            <div className={`cq-modal-dropdown ${className || ''} ${open && 'stxMenuActive'}`}>
                <div
                    className="cq-modal__overlay"
                    onClick={this.onOverlayClick}
                >
                    {
                        (shouldRenderDialogs
                        && (
                            <CSSTransition
                                appear
                                in={dialogStatus}
                                timeout={300}
                                classNames="sc-dialog"
                                unmountOnExit
                            >
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
                        ))
                    }
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
            return (open && newDialog);
        }

        return (
            enabled && (
                <Tooltip
                    className={`ciq-menu ciq-enabled ${className || ''} ${open && 'stxMenuActive'}`}
                    content={tooltip}
                    enabled={tooltip}
                    position="right"
                >
                    <div
                        className="cq-menu-btn"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={onTitleClick}
                    >
                        {first}
                    </div>
                    {open && newDialog}
                </Tooltip>
            ) || (
                <Tooltip
                    className={`ciq-menu ciq-disabled ${className || ''}`}
                    content={tooltip}
                    enabled={tooltip}
                    position="right"
                >
                    <div
                        className="cq-menu-btn"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {first}
                    </div>
                </Tooltip>
            )
        );
    }
}

Menu.Title = ({ children }) => children;
Menu.Body  = ({ children }) => children;

export default Menu;
