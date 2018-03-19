import React, { Component } from 'react';
import {connect} from '../store/Connect';
import { WarningIcon, CloseIcon, } from '../components/Icons.jsx';
import '../../sass/_ciq-notification.scss';

const Notification = ({
    messages,
    remove,
}) => (
    <div className='cq-notifications'>
        {messages.map(({text, type, hide}, inx) => (
            <div
                key={text}
                className={`notification ${type} ${hide ? 'hide' : ''}`}
            >
                <WarningIcon />
                <div className='text'> {text} </div>
                <CloseIcon
                    className='close-icon'
                    onClick={() => remove(inx)}
                />
            </div>
        ))}
    </div>
);

export default connect(
    ({notification: n}) => ({
        messages: n.messages.map(m => ({...m})),
        remove: n.remove,
    })
)(Notification);

//This is Beta version and therefore unexpected issues are possible.
