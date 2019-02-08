import React from 'react';
import { ItemIconMap, SymbolPlaceholderIcon, ArrowIcon } from './Icons.jsx';

export const SymbolInfo = ({
    symbol,
    ChartPrice,
}) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    return (
        <>
            {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
            <div className="cq-symbol-info">
                <div className="cq-symbol">{symbol.name}</div>
                <ChartPrice />
            </div>
        </>
    );
};

export const SymbolSelectButton = ({
    symbol,
    ChartPrice,
}) => (
    <div className="cq-symbol-select-btn">
        <SymbolInfo symbol={symbol} ChartPrice={ChartPrice} />
        <ArrowIcon className="cq-symbol-dropdown" />
    </div>
);

export const ChartPrice = ({
    isVisible,
    status,
    todayChange,
    todayChangePercent,
    SpotPrice,
}) => (
    isVisible && (
        <div className="cq-chart-price">
            <SpotPrice className="cq-current-price" />
            <div className="divider">-</div>
            <div className={`cq-change ${status}`}>
                <span className="cq-todays-change">{todayChange || 0}</span>
                <span className="cq-todays-change-percent">({todayChangePercent}%)</span>&nbsp;
            </div>
        </div>
    )
);
