// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ItemIconMap, SymbolPlaceholderIcon, ArrowIcon, TimeIcon } from './Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './MarketOpeningTimeCounter.jsx' was resolv... Remove this comment to see the full error message
import { MarketOpeningTimeCounter } from './MarketOpeningTimeCounter.jsx';

export const SymbolInfo = ({
    symbol,
    ChartPrice,
    isSymbolOpen,
    symbolOpenTime,
}: any) => {
    const SymbolIcon = ItemIconMap[symbol.symbol] || SymbolPlaceholderIcon;
    const hasOpenTime = !isSymbolOpen && symbolOpenTime.openTime;
    const hasNoOpenTime = !isSymbolOpen && !symbolOpenTime.openTime;
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {SymbolIcon && <SymbolIcon className={`ic-${symbol.symbol}`} />}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='cq-symbol-info'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className={classNames('cq-symbol', { 'closed-no-opentime': hasNoOpenTime })}>{symbol.name}</div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {isSymbolOpen && <ChartPrice />}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {hasOpenTime && <ClosedSymbol symbolOpenTime={symbolOpenTime} />}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </>
    );
};
export const SymbolSelectButton = ({
    symbol,
    ChartPrice,
    isSymbolOpen,
    symbolOpenTime,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='cq-symbol-select-btn'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <SymbolInfo
            symbol={symbol}
            ChartPrice={ChartPrice}
            symbolOpenTime={symbolOpenTime}
            isSymbolOpen={isSymbolOpen}
        />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        {!isSymbolOpen && <div className='cq-symbol-closed-text'>{t.translate('CLOSED')}</div>}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ArrowIcon className='cq-symbol-dropdown' />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);
export const ChartPrice = ({
    isVisible,
    status,
    todayChange,
    todayChangePercent,
    SpotPrice,
}: any) =>
    isVisible && (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='cq-chart-price'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SpotPrice className='cq-current-price' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='divider'>-</div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className={classNames('cq-change', status)}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span className='cq-todays-change'>{todayChange || 0}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span className='cq-todays-change-percent'>({todayChangePercent}%)</span>&nbsp;
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );

const ClosedSymbol = (symbolOpenTime: any) => (
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
<div className='cq-chart-closed'>
    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
    <TimeIcon className='cq-closed-icon' />
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    <div className='cq-closed-opening'>
        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
        {t.translate('Opens in:')} &nbsp;
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <span className='cq-closed-opening-time'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <MarketOpeningTimeCounter symbolOpenTime={symbolOpenTime} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>
);
