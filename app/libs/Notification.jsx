import React from 'react';
import { alertIconMap, CloseIcon } from '../../src/components/Icons.jsx';
import '../../sass/components/_ciq-notification.scss';


const Notification = ({ notifier }) => (
    <div className="cq-notifications">
        {notifier.messages.map((message) => {
            const AlertIcon = alertIconMap[message.type];
            return (
                <div
                    key={message.text}
                    className={`notification ${message.type} ${message.hide ? 'hide' : ''}`}
                >
                    <AlertIcon />
                    <div className="text"> {message.text} </div>
                    <CloseIcon
                        className="close-icon"
                        onClick={() => notifier.remove(message.id)}
                    />
                </div>
            );
        })}
    </div>
);

export default Notification;
