/* eslint-disable jsx-a11y/no-static-element-interactions */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTypes.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTypes from './ChartTypes.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Timeperiod.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import Timeperiod from './Timeperiod.jsx';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
} from './Icons.jsx';
import '../../sass/components/_chart-mode.scss';

const TypeMap = {
    mountain: TypeAreaGrayscaleIcon,
    candle: TypeCandleGrayscaleIcon,
    colored_bar: TypeOhlcGrayscaleIcon,
    hollow_candle: TypeHollowGrayscaleIcon,
};

const ChartMode = ({
    ChartTypeMenu,
    menuOpen,
    onChartType,
    onGranularity,
    Type,
    displayInterval,
    portalNodeId,
}: any) => {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const TypeIcon = TypeMap[Type.id];
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ChartTypeMenu
            className='ciq-display sc-chart-mode'
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title={t.translate('Chart types')}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            tooltip={t.translate('Chart types')}
            modalMode
            isFullscreen
            portalNodeId={portalNodeId}
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTypeMenu.Title>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className={classNames('sc-chart-mode__menu', { 'sc-chart-mode__menu--active': menuOpen })}>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span className='sc-chart-mode__menu__timeperiod'>{displayInterval}</span>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <TypeIcon tooltip-title={t.translate(Type.text)} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </ChartTypeMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTypeMenu.Body>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-chart-mode__section'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-chart-mode__section__item'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <ChartTypes newDesign onChange={onChartType} />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-chart-mode__section__item'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <Timeperiod newDesign onChange={onGranularity} />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chartMode,
    chartType,
    timeperiod,
}: any) => ({
    ChartTypeMenu: chartMode.ChartTypeMenu,
    menuOpen: chartMode.menu.open,
    Type: chartType.type,
    displayInterval: timeperiod.display,
}))(ChartMode);
