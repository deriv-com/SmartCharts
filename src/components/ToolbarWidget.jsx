/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_toolbar-widget.scss';


const ToolbarWidget = ({
    position,
    children,
    context,
    onMouseEnter,
    onMouseLeave,
}) => {
    if (!context) return '';

    return (
        <div
            className={`ciq-toolbar-widget ciq-toolbar-widget--${(position || 'top')}`}
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
