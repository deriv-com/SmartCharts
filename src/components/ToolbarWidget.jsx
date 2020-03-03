/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_toolbar-widget.scss';


const ToolbarWidget = ({
    position,
    children,
    context,
}) => {
    if (!context) return '';

    return (
        <div className={`ciq-toolbar-widget ciq-toolbar-widget--${(position || 'top')}`}>
            {children}
        </div>
    );
};


export default connect(({ chart }) => ({
    context: chart.context,
}))(ToolbarWidget);
