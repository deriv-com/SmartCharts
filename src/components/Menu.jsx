import React, { Component } from 'react';
import contextAware from '../contextAware';

class Menu extends Component {
    onContextReady(context) {
        this._context = context;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected
            && !nextProps.selected
            && this._context) {
            this._context.stx.modalEnd();
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
        const { selected, setOpen } = this.props;
        if (selected
            && setOpen
            && !(this.dropdown.contains(e.target) || this.menuBtn.contains(e.target))) {
            setOpen(false);
        }
    };

    closeOnEscape = (e) => {
        const { selected, setOpen } = this.props;
        if (selected && e.keyCode === 27 && setOpen) {
            setOpen(false);
        }
    };

    mouseEnterDropdown = (e) => this.onMouseInDropdown(e, true);
    mouseLeaveDropdown = (e) => this.onMouseInDropdown(e, false);

    onMouseInDropdown = (e, isMouseEnter) => {
        const { selected } = this.props;
        if (selected
            && this._context
            && this.dropdown.contains(e.target)) {
            if (isMouseEnter) {
                this._context.stx.modalBegin();
            } else {
                this._context.stx.modalEnd();
            }
        }
    }

    render() {
        const { selected, className, setOpen, menuBtn, children } = this.props;

        return (
            <div className={`ciq-menu ${className || ''} ${selected ? 'stxMenuActive' : ''}`}>
                <div
                    ref={el => this.menuBtn = el}
                    className="cq-menu-btn"
                    onClick={() => {setOpen(!selected);}}
                >
                    {menuBtn}
                </div>
                <div
                    ref={el => this.dropdown = el}
                    className="cq-menu-dropdown"
                    onMouseEnter={this.mouseEnterDropdown}
                    onMouseLeave={this.mouseLeaveDropdown}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default contextAware(Menu);
