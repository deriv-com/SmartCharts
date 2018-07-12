import React from 'react';
import './_ciq-notification.scss';

import CloseIcon from './icons/ic-close.svg';
import Warning from './icons/warning.svg';
import Error from './icons/error.svg';
import Success from './icons/success.svg';
import Info from './icons/info.svg';


const alertIconMaps = {
    info: Info,
    success: Success,
    warning: Warning,
    error: Error,
};

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }
    onMessage(message, duration = 10) {
        const messages = this.state.messages;
        message.id = (new Date()).getTime();
        message.type = message.type || 'warning';
        message.hide = false;

        messages.push(message);
        this.setState({
            messages,
        });

        if (duration > 0) {
            setTimeout(() => this.onRemove(message.id), duration * 1000);
        }
    }
    onRemove(id) {
        let messages = this.state.messages.map((x) => {
            x.hide = x.id === id ? true : x.hide;
            return x;
        });
        this.setState({
            messages,
        });

        setTimeout(() => {
            messages = messages.filter(x => x.id !== id);
            this.setState({
                messages,
            });
        }, 300);
    }
    onRemoveAll() {
        this.state.messages.forEach((x) => {
            this.onRemove(x.id);
        });
    }

    render() {
        const { notifier } = this.props;
        notifier.onCallback((e) => {
            if (e.action === 'message') {
                this.onMessage(e.data);
            } else if (e.action === 'removeall') {
                this.onRemoveAll();
            }
        });

        return (
            <div className="cq-notifications">
                {this.state.messages.map((message) => {
                    const AlertIcon = alertIconMaps[message.type];
                    return (
                        <div
                            key={message.id}
                            className={`notification ${message.type} ${message.hide ? 'hide' : ''}`}
                        >
                            <img className="ic-icon-img" src={AlertIcon} alt={message.type} />
                            <div className="text"> {message.text} </div>
                            <span
                                onClick={() => this.onRemove(message.id)}
                            >
                                <img
                                    className="close-icon"
                                    src={CloseIcon}
                                    alt="delete icon"
                                />
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }
}


export default Notification;
