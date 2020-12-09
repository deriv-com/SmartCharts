/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import '../../sass/components/_toolbar-widget.scss';

const ToolbarWidget = ({ position = 'top', children, context, onMouseEnter, onMouseLeave }) => {
    if (!context) return '';

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

export default connect(({ chart, toolbarWidget }) => ({
    context: chart.context,
    onMouseEnter: toolbarWidget.onMouseEnter,
    onMouseLeave: toolbarWidget.onMouseLeave,
}))(ToolbarWidget);
