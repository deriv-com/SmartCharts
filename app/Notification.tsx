import React from 'react';
import './_ciq-notification.scss';

const Notification = ({ notifier }: any) => {
    const [messages, setMessages] = React.useState([]);
    const messages_ref = React.useRef();
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'never[]' is not assignable to type 'undefine... Remove this comment to see the full error message
    messages_ref.current = messages;
    const onRemove = React.useCallback(id => {
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        setMessages(messages_ref.current.map((message: any) => ({
            ...message,
            hide: message.id === id ? true : message.hide,
        })));
        /**
            message removing has an animation which animate 300ms so,
            first of all, I set hide=true to start animation then after
            the animated finish, I remove the message for the store
        */
        setTimeout(() => {
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
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
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
            setMessages(messages_ref.current.concat([msg]));
            if (duration > 0) {
                setTimeout(() => onRemove(msg.id), duration * 1000);
            }
        };
        const onRemoveByCategory = (category: any) => {
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
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
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<div className='cq-notifications'>
            {messages.map(message => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<div key={(message as any).id} className={`notification ${(message as any).type} ${(message as any).hide ? 'hide' : ''}`}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <span className={`ic-icon icon-notification-${(message as any).type}`} />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <div className='text'> {(message as any).text} </div>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <span onClick={() => onRemove((message as any).id)} className='close-icon' />
</div>
))}
</div>
);
};
export default Notification;
