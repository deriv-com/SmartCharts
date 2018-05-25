import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/components/_ciq-dialog.scss';

class Dialog extends Component {
    render() {
        const {
            open,
            children,
            onContainerClick,
            className,
            isMobile
        } = this.props;

        const inner_style = ( isMobile && open) ? {
            height: (window.innerHeight - 48 )+'px',
            width: window.innerWidth+'px'
        } : {};

        return (
            <div
                className={(className || 'cq-dialog') + (open ? ' open' : '')}
                onClick={onContainerClick}
                style={inner_style}
                >
                {children}
            </div>
        );
    }
}

export default Dialog;
