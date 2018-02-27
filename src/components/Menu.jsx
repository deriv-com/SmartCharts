import React, { Component } from 'react';
import {connect} from '../store/Connect';

class Menu extends Component {
    componentDidMount() { this.props.init(); }
    componentWillUnmount() { this.props.destroy(); }

    render() {
        const {
            open,
            className,
            children,
            onTitleClick,
            onBodyClick,
        } = this.props;
        const first = React.Children.map(children, (child, i) => i === 0 ? child : null);
        const rest  = React.Children.map(children, (child, i) => i !== 0 ? child : null);

        return (
            <div className={`ciq-menu ${className || ''} ${open ? 'stxMenuActive' : ''}`}>
                <div
                    className="cq-menu-btn"
                    onClick={onTitleClick}
                >
                    {first}
                </div>
                <div
                    className="cq-menu-dropdown"
                    onClick={onBodyClick}
                >
                    {rest}
                </div>
            </div>
        );
    }
}

Menu.Title = ({children}) => children;
Menu.Body  = ({children}) => children;

export default Menu;
