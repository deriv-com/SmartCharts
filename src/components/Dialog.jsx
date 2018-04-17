import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/_ciq-dialog.scss';

class Dialog extends Component {
    render() {
        const {
            open,
            children,
            onContainerClick,
            className,
        } = this.props;

        return (
            <div
                className={(className || 'cq-dialog') + (open ? ' open' : '')}
                onClick={onContainerClick}
                >
                {children}
            </div>
        );
    }
}

export default Dialog;
