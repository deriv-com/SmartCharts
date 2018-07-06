import React from 'react';
import { alertIconMap, CloseIcon } from '../src/components/Icons.jsx';
import '../sass/components/_ciq-notification.scss';


const Notification = ({ messages, onRemove }) => (
    <div className="cq-notifications">
        {messages.map((message) => {
            const AlertIcon = alertIconMap[message.type];
            return (
                <div
                    key={message.id}
                    className={`notification ${message.type} ${message.hide ? 'hide' : ''}`}
                >
                    <AlertIcon />
                    <div className="text"> {message.text} </div>
                    <CloseIcon
                        className="close-icon"
                        onClick={() => onRemove(message.id)}
                    />
                </div>
            );
        })}
    </div>
);

export default Notification;
