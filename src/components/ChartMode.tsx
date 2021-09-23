/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import ChartTypes from './ChartTypes';
import Timeperiod from './Timeperiod';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
} from './Icons';
import '../../sass/components/_chart-mode.scss';

type TChartModeProps = {
    portalNodeId: string;
    onChartType: any;
    onGranularity: (granularity: number) => void;
};

const TypeMap = {
    mountain: TypeAreaGrayscaleIcon,
    candle: TypeCandleGrayscaleIcon,
    colored_bar: TypeOhlcGrayscaleIcon,
    hollow_candle: TypeHollowGrayscaleIcon,
};

const ChartMode: React.FC<TChartModeProps> = ({ onChartType, onGranularity, portalNodeId }) => {
    const { chartMode, chartType, timeperiod } = useStores();

    const { ChartTypeMenu } = chartMode;
    const { type } = chartType;
    const { display: displayInterval } = timeperiod;
    const menuOpen = chartMode.menu.open;

    const TypeIcon = TypeMap[type.id as keyof typeof TypeMap];
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
                    <TypeIcon tooltip-title={t.translate(type.text)} />
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

export default observer(ChartMode);
