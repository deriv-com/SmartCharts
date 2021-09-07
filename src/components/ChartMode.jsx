/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import ChartTypes from './ChartTypes.jsx';
import Timeperiod from './Timeperiod.jsx';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
} from './Icons.jsx';
import '../../sass/components/_chart-mode.scss';

const TypeMap = {
    mountain: TypeAreaGrayscaleIcon,
    candle: TypeCandleGrayscaleIcon,
    colored_bar: TypeOhlcGrayscaleIcon,
    hollow_candle: TypeHollowGrayscaleIcon,
};

const ChartMode = ({ ChartTypeMenu, menuOpen, onChartType, onGranularity, Type, displayInterval, portalNodeId }) => {
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
                        <Timeperiod newDesign portalNodeId={portalNodeId} onChange={onGranularity} />
                    </div>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default connect(({ chartMode, chartType, timeperiod }) => ({
    ChartTypeMenu: chartMode.ChartTypeMenu,
    menuOpen: chartMode.menu.open,
    Type: chartType.type,
    displayInterval: timeperiod.display,
}))(ChartMode);
