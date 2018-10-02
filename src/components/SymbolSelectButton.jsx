import React from 'react';
import { ItemIconMap, SymbolPlaceholderIcon, ArrowIcon } from './Icons.jsx';

export const SymbolInfo = ({
    symbol,
}) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    return (
        <>
            {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
            <div className="cq-symbol-info">
                <div className="cq-market">{symbol.market_display_name}</div>
                <div className="cq-symbol">{symbol.name}</div>
            </div>
        </>
    );
};

export const SymbolSelectButton = ({
    symbol,
    ChartPrice,
}) => (
    <div className="cq-symbol-select-btn">
        <SymbolInfo symbol={symbol} />
        <ChartPrice />
        <ArrowIcon className="cq-symbol-dropdown" />
    </div>
);

export const ChartPrice = ({
    isVisible,
    status,
    todayChange,
    SpotPrice,
}) => (
    isVisible && (
        <div className="cq-chart-price">
            <SpotPrice className="cq-current-price" />
            <div className={`cq-change ${status}`}>
                <span className="cq-todays-change">{todayChange || 0}</span>&nbsp;
            </div>
        </div>
    )
);
