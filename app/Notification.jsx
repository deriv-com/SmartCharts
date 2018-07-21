import React from 'react';
import './_ciq-notification.scss';

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

        /**
            message removing has an animation which animate 300ms so,
            first of all, I set hide=true to start animation then after
            the animated finish, I remove the message for the store
        */
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

    removeByCategory({ category }) {
        this.state.messages.map((msg) => {
            if (msg.category === category) {
                this.onRemove(msg.id);
            }
        });
    }

    render() {
        const { notifier } = this.props;

        notifier.message(e => this.onMessage(e));
        notifier.removeByCategory(e => this.removeByCategory(e));

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
