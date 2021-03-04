/* eslint-disable jsx-a11y/no-static-element-interactions */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
import '../../sass/components/_toolbar-widget.scss';

const ToolbarWidget = ({
    position = 'top',
    children,
    context,
    onMouseEnter,
    onMouseLeave,
}: any) => {
    if (!context) return '';

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div
            className={classNames('sc-toolbar-widget', {
                [`sc-toolbar-widget--${position}`]: !!position,
            })}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
    toolbarWidget,
}: any) => ({
    context: chart.context,
    onMouseEnter: toolbarWidget.onMouseEnter,
    onMouseLeave: toolbarWidget.onMouseLeave,
}))(ToolbarWidget);
