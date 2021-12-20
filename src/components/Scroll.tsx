import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_scroll.scss';

type TScrollProps = {
    className?: string;
    autoHide?: boolean;
    freeze?: boolean;
    height?: string | number;
    width?: string | number;
    setPanel?: (ref: HTMLDivElement) => void;
    onScroll?: (ev: React.UIEvent<HTMLElement>) => void;
    children?: React.ReactNode;
};

const Scroll = ({
    children,
    className,
    height,
    width,
    autoHide,
    freeze = false,
    onScroll = () => null,
    setPanel,
}: TScrollProps) => {
    const { scroll } = useStores();

    const { setScrollPanel, isHover } = scroll;

    const handleRef = (_ref: HTMLDivElement) => {
        setScrollPanel(_ref);
        if (setPanel) setPanel(_ref);
    };

    return (
        <div
            ref={handleRef}
            className={classNames('sc-scrollbar', className, {
                'sc-scrollbar--freeze': freeze,
                'sc-scrollbar--auto-hide': autoHide,
                'sc-scrollbar--hover': isHover,
            })}
            onScroll={onScroll}
            style={{
                maxHeight: height || '100%',
                maxWidth: width || 'none',
            }}
        >
            {children}
        </div>
    );
};

export default observer(Scroll);
