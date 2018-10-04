import React from 'react';
import './_ciq-notification.scss';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
        props.notifier.onMessage(this.onMessage);
        props.notifier.onRemoveByCategory(this.onRemoveByCategory);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.messages.length !== nextState.messages.length;
    }

    onMessage = (message, duration = 10) => {
        const msg = {
            type: 'warning',
            ...message,
            id: new Date().getTime(),
            hide: false,
        };

        this.setState(prevState => ({ messages: prevState.messages.concat([msg]) }));

        if (duration > 0) {
            setTimeout(() => this.onRemove(msg.id), duration * 1000);
        }
    };

    onRemove(id) {
        this.setState(prevState => ({
            messages: prevState.messages.map(message => ({ ...message, hide: message.id === id ? true : message.hide })),
        }));

        /**
            message removing has an animation which animate 300ms so,
            first of all, I set hide=true to start animation then after
            the animated finish, I remove the message for the store
        */
        setTimeout(() => {
            this.setState(prevState => ({
                messages: prevState.messages.filter(x => x.id !== id),
            }));
        }, 300);
    }

    onRemoveAll() {
        this.state.messages.forEach((x) => {
            this.onRemove(x.id);
        });
    }

    onRemoveByCategory = (category) => {
        this.state.messages.map((msg) => {
            if (msg.category === category) {
                this.onRemove(msg.id);
            }
        });
    };

    render() {
        return (
            <div className="cq-notifications">
                {this.state.messages.map(message => (
                    <div
                        key={message.id}
                        className={`notification ${message.type} ${message.hide ? 'hide' : ''}`}
                    >
                        <span
                            className={`ic-icon icon-notification-${message.type}`}
                        />
                        <div className="text"> {message.text} </div>
                        <span onClick={() => this.onRemove(message.id)} className="close-icon" />
                    </div>
                ))}
            </div>
        );
    }
}


export default Notification;
