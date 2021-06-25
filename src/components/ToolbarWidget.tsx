/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_toolbar-widget.scss';

type TToolbarWidgetProps = {
    position: string;
};

const ToolbarWidget: React.FC<TToolbarWidgetProps> = ({ position = 'top', children }) => {
    const { chart, toolbarWidget } = useStores();
    const { context } = chart;
    const { onMouseEnter, onMouseLeave } = toolbarWidget;

    if (!context) return null;

    return (
        <div
            className={classNames('sc-toolbar-widget', {
                [`sc-toolbar-widget--${position}`]: !!position,
            })}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    );
};

export default observer(ToolbarWidget);
