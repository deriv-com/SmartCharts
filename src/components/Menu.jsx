import React, { Component, Fragment } from 'react';
import {connect} from '../store/Connect';

class Menu extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.isOpened !== nextProps.isOpened) {
            if (!nextProps.isOpened && this._context) {
                document.activeElement.blur();
                this._context.stx.modalEnd();
            }
            if (nextProps.isOpened) {
                const { onOpen } = this.props;
                if (onOpen) onOpen();
            }
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
        document.addEventListener('keydown', this.closeOnEscape);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keydown', this.closeOnEscape);
    }

    handleClickOutside = (e) => {
        const { isOpened, setOpen } = this.props;
        if (isOpened
            && setOpen
            && !(this.dropdown.contains(e.target) || this.menuBtn.contains(e.target))) {
            setOpen(false);
        }
    };

    closeOnEscape = (e) => {
        const { isOpened, setOpen } = this.props;
        if (isOpened && e.keyCode === 27 && setOpen) {
            setOpen(false);
        }
    };

    mouseEnterDropdown = (e) => this.handleMouseInDropdown(e, true);
    mouseLeaveDropdown = (e) => this.handleMouseInDropdown(e, false);

    handleMouseInDropdown = (e, isMouseEnter) => {
        const { isOpened } = this.props;
        if (isOpened
            && this.props.context
            && this.dropdown.contains(e.target)) {
            if (isMouseEnter) {
                this.props.context.stx.modalBegin();
            } else {
                this.props.context.stx.modalEnd();
            }
        }
    }

    render() {
        const { isOpened, className, setOpen, menuBtn, children } = this.props;
        const first = React.Children.map(children, (child, i) => i === 0 ? child : null);
        const rest  = React.Children.map(children, (child, i) => i !== 0 ? child : null);

        return (
            <div className={`ciq-menu ${className || ''} ${isOpened ? 'stxMenuActive' : ''}`}>
                <div
                    ref={el => this.menuBtn = el}
                    className="cq-menu-btn"
                    onClick={() => {setOpen(!isOpened);}}
                >
                    {first}
                </div>
                <div
                    ref={el => this.dropdown = el}
                    className="cq-menu-dropdown"
                    onMouseEnter={this.mouseEnterDropdown}
                    onMouseLeave={this.mouseLeaveDropdown}
                >
                    {rest}
                </div>
            </div>
        );
    }
}

const MenuConnected = connect(
    ({chart}) => ({
        context: chart.context
    })
)(Menu);

MenuConnected.Title = ({children}) => <span> {children} </span>;
MenuConnected.Body  = ({children}) => <Fragment> {children} </Fragment>;

export default MenuConnected;
