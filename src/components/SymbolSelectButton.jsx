import React from 'react';
import classNames from 'classnames';
import { ItemIconMap, SymbolPlaceholderIcon, ArrowIcon, TimeIcon } from './Icons.jsx';
import { MarketOpeningTimeCounter } from './MarketOpeningTimeCounter.jsx';

export const SymbolInfo = ({ symbol, ChartPrice, isSymbolOpen, symbolOpenTime }) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    const hasOpenTime = !isSymbolOpen && symbolOpenTime.openTime;
    const hasNoOpenTime = !isSymbolOpen && !symbolOpenTime.openTime;
    return (
        <>
            {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
            <div className='cq-symbol-info'>
                <div className={classNames('cq-symbol', { 'closed-no-opentime': hasNoOpenTime })}>{symbol.name}</div>
                {isSymbolOpen && <ChartPrice />}
                {hasOpenTime && <ClosedSymbol symbolOpenTime={symbolOpenTime} />}
            </div>
        </>
    );
};
export const SymbolSelectButton = ({ symbol, ChartPrice, isSymbolOpen, symbolOpenTime }) => (
    <div className='cq-symbol-select-btn'>
        <SymbolInfo
            symbol={symbol}
            ChartPrice={ChartPrice}
            symbolOpenTime={symbolOpenTime}
            isSymbolOpen={isSymbolOpen}
        />
        {!isSymbolOpen && <div className='cq-symbol-closed-text'>{t.translate('CLOSED')}</div>}
        <ArrowIcon className='cq-symbol-dropdown' />
    </div>
);
export const ChartPrice = ({ isVisible, status, todayChange, todayChangePercent, SpotPrice }) =>
    isVisible && (
        <div className='cq-chart-price'>
            <SpotPrice className='cq-current-price' />
            <div className='divider'>-</div>
            <div className={classNames('cq-change', status)}>
                <span className='cq-todays-change'>{todayChange || 0}</span>
                <span className='cq-todays-change-percent'>({todayChangePercent}%)</span>&nbsp;
            </div>
        </div>
    );

const ClosedSymbol = symbolOpenTime => (
    <div className='cq-chart-closed'>
        <TimeIcon className='cq-closed-icon' />
        <div className='cq-closed-opening'>
            {t.translate('Opens in:')} &nbsp;
            <span className='cq-closed-opening-time'>
                <MarketOpeningTimeCounter symbolOpenTime={symbolOpenTime} />
            </span>
        </div>
    </div>
);
