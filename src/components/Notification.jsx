import React, { Component } from 'react';
import {connect} from '../store/Connect';
import { WarningIcon, CloseIcon, } from '../components/Icons.jsx';
import '../../sass/_ciq-notification.scss';

const Notification = ({
    open,
    setOpen,
    text,
    type, /* warning|info|error */
}) => (
    <div className={`cq-notification ${type} ${open ? 'open' : ''}`}>
        <WarningIcon />
        <div className='text'> {text} </div>
        <CloseIcon
            className='close-icon'
            onClick={() => setOpen(false)}
        />
    </div>
);

export default connect(
    ({notification: n}) => ({
        open: n.open,
        setOpen: n.setOpen,
        text: n.text,
        type: n.type
    })
)(Notification);

//This is Beta version and therefore unexpected issues are possible.
