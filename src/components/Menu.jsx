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
                    ref={el => this.menuBtn = el}
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

Menu.connectBy = selector => {
    const Connected = connect(
        (stores) => {
            const s = selector(stores);
            return {
                open: s.open,
                className: s.className,
                setOpen: s.setOpen,
                children: s.children,
                init: s.init,
                destroy: s.destroy,
                onTitleClick: s.onTitleClick,
                onBodyClick: s.onBodyClick,
            }
        }
    )(Menu);
    Connected.Title = ({children}) => children;
    Connected.Body  = ({children}) => children;
    return Connected;
}

export default Menu;
