import React, { Component } from 'react';
import {stxtap} from '../store/utils';

class Menu extends Component {

    onOverlayClick(e) {
        if (e.target.className === 'cq-menu-overlay') {
            this.props.setOpen(false);
        }
    }

    render() {
        const {
            open,
            className,
            children,
            onTitleClick,
            DropdownDialog,
            isMobile,
            isFullscreen
        } = this.props;
        const first = React.Children.map(children, (child, i) => i === 0 ? child : null);
        const rest  = React.Children.map(children, (child, i) => i !== 0 ? child : null);

        return (
            <div className={`ciq-menu ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                <div
                    className="cq-menu-btn"
                    ref={el => stxtap(el, onTitleClick)}
                >
                    {first}
                </div>
                <div
                    className="cq-menu-overlay"
                    onClick={this.onOverlayClick.bind(this)}
                    >
                    <DropdownDialog
                        className='cq-menu-dropdown'
                        isMobile={isMobile}
                        isFullscreen={isFullscreen}
                        >
                        {rest}
                    </DropdownDialog>
                </div>
            </div>
        );
    }
}

Menu.Title = ({children}) => children;
Menu.Body  = ({children}) => children;

export default Menu;
