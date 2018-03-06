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
                style={{display: open ? 'block' : 'none'}}
                className={className || 'cq-dialog'}
                onClick={onContainerClick}
            >
                {children}
            </div>
        );
    }
}

export default Dialog;
