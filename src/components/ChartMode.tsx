/* eslint-disable jsx-a11y/no-static-element-interactions */

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import { TGranularity } from 'src/types';
import '../../sass/components/_chart-mode.scss';
import ChartTypes from './ChartTypes';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
} from './Icons';
import Menu from './Menu';
import Timeperiod from './Timeperiod';


type TChartModeProps = {
    portalNodeId?: string;
    onChartType: (chartType?: string | undefined) => void;
    onGranularity: (granularity?: TGranularity) => void;
};

const TypeMap = {
    line: TypeAreaGrayscaleIcon,
    candles: TypeCandleGrayscaleIcon,
    ohlc: TypeOhlcGrayscaleIcon,
    hollow: TypeHollowGrayscaleIcon,
};

const ChartMode = ({ onChartType, onGranularity, portalNodeId }: TChartModeProps) => {
    const { chart, chartMode, chartType, timeperiod, state } = useStores();
    const { menuStore } = chartMode;
    const { allowTickChartTypeOnly } = state;
    const { isMobile } = chart;
    const { type } = chartType;
    const { display: displayInterval } = timeperiod;
    const menuOpen = chartMode.menuStore.open;

    const TypeIcon = TypeMap[type.id as keyof typeof TypeMap];

    return (
        <Menu
            className='ciq-display sc-chart-mode'
            title={t.translate('Chart types')}
            tooltip={t.translate('Chart types')}
            modalMode
            isFullscreen
            portalNodeId={portalNodeId}
            store={menuStore}
        >
            <Menu.Title>
                <div className={classNames('sc-chart-mode__menu', { 'sc-chart-mode__menu--active': menuOpen })}>
                    <span className='sc-chart-mode__menu__timeperiod'>{displayInterval}</span>
                    <TypeIcon tooltip-title={t.translate(type.text)} />
                </div>
            </Menu.Title>
            <Menu.Body>
                <div className='sc-chart-mode__section'>
                    <div className='sc-chart-mode__section__item'>
                        <ChartTypes newDesign onChange={onChartType} />
                    </div>
                    <div className='sc-chart-mode__section__item'>
                        <Timeperiod newDesign portalNodeId={portalNodeId} onChange={onGranularity} />
                    </div>
                </div>
                {allowTickChartTypeOnly && (
                    <div
                        className={classNames('sc-chart-mode__section__text', {
                            'sc-chart-mode__section__text--mobile': isMobile,
                        })}
                    >
                        {t.translate('Only selected charts and time intervals are available for this trade type.')}
                    </div>
                )}
            </Menu.Body>
        </Menu>
    );
};

export default observer(ChartMode);
