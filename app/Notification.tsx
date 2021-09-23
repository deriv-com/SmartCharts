import React from 'react';
import './_ciq-notification.scss';

const Notification = ({ notifier }: any) => {
    const [messages, setMessages] = React.useState([]);
    const messages_ref = React.useRef<any>(messages);
    messages_ref.current = messages;
    const onRemove = React.useCallback(id => {
        setMessages(
            messages_ref.current.map((message: any) => ({
                ...message,
                hide: message.id === id ? true : message.hide,
            }))
        );
        /**
            message removing has an animation which animate 300ms so,
            first of all, I set hide=true to start animation then after
            the animated finish, I remove the message for the store
        */
        setTimeout(() => {
            setMessages(messages_ref.current.filter((x: any) => x.id !== id));
        }, 300);
    }, []);
    React.useEffect(() => {
        const onMessage = (message: any, duration = 10) => {
            const msg = {
                type: 'warning',
                ...message,
                id: new Date().getTime(),
                hide: false,
            };
            setMessages(messages_ref.current.concat([msg]));
            if (duration > 0) {
                setTimeout(() => onRemove(msg.id), duration * 1000);
            }
        };
        const onRemoveByCategory = (category: any) => {
            messages_ref.current.map((msg: any) => {
                if (msg.category === category) {
                    onRemove(msg.id);
                }
            });
        };
        notifier.onMessage(onMessage);
        notifier.onRemoveByCategory(onRemoveByCategory);
    }, [notifier, onRemove]);
    return (
        <div className='cq-notifications'>
            {messages.map(message => (
                <div
                    key={(message as any).id}
                    className={`notification ${(message as any).type} ${(message as any).hide ? 'hide' : ''}`}
                >
                    <span className={`ic-icon icon-notification-${(message as any).type}`} />
                    <div className='text'> {(message as any).text} </div>
                    <span onClick={() => onRemove((message as any).id)} className='close-icon' />
                </div>
            ))}
        </div>
    );
};
export default Notification;
