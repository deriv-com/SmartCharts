/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTypes' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTypes from './ChartTypes';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Timeperiod' was resolved to '/Users/... Remove this comment to see the full error message
import Timeperiod from './Timeperiod';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
    // @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
} from './Icons';
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
        <ChartTypeMenu
            className='ciq-display sc-chart-mode'
            title={t.translate('Chart types')}
            tooltip={t.translate('Chart types')}
            modalMode
            isFullscreen
            portalNodeId={portalNodeId}
        >
            <ChartTypeMenu.Title>
                <div className={classNames('sc-chart-mode__menu', { 'sc-chart-mode__menu--active': menuOpen })}>
                    <span className='sc-chart-mode__menu__timeperiod'>{displayInterval}</span>
                    <TypeIcon tooltip-title={t.translate(Type.text)} />
                </div>
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className='sc-chart-mode__section'>
                    <div className='sc-chart-mode__section__item'>
                        <ChartTypes newDesign onChange={onChartType} />
                    </div>
                    <div className='sc-chart-mode__section__item'>
                        <Timeperiod newDesign onChange={onGranularity} />
                    </div>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default connect(({ chartMode, chartType, timeperiod }: any) => ({
    ChartTypeMenu: chartMode.ChartTypeMenu,
    menuOpen: chartMode.menu.open,
    Type: chartType.type,
    displayInterval: timeperiod.display,
}))(ChartMode);
