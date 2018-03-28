import React, { Component } from 'react';
import {connect} from '../store/Connect';

class Menu extends Component {
    render() {
        const {
            open,
            className,
            children,
            onTitleClick,
            DropdownDialog,
        } = this.props;
        const first = React.Children.map(children, (child, i) => i === 0 ? child : null);
        const rest  = React.Children.map(children, (child, i) => i !== 0 ? child : null);

        return (
            <div className={`ciq-menu ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                <div
                    className="cq-menu-btn"
                    // onClick={onTitleClick}
                    ref={el => el && el.addEventListener('stxtap', onTitleClick)}
                >
                    {first}
                </div>
                <DropdownDialog className='cq-menu-dropdown'>
                    {rest}
                </DropdownDialog>
            </div>
        );
    }
}

Menu.Title = ({children}) => children;
Menu.Body  = ({children}) => children;

export default Menu;
