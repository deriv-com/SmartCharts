import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';
import { ItemIconMap, SymbolPlaceholderIcon, ArrowIcon } from './Icons.jsx';
import '../../sass/components/_chart-title.scss';

const ChartTitle = ({
    todayChange,
    isVisible,
    isShowChartPrice,
    isPriceUp,
    currentSymbol,
    Menu,
    MarketSelector,
    AnimatedPrice,
    onCloseMenu,
    enabled = true,
}) => {
    if (!currentSymbol) { return null; }

    const chartTitleClassName = 'cq-chart-title stx-show cq-symbols-display';
    const SymbolIcon = ItemIconMap[currentSymbol.symbol] || SymbolPlaceholderIcon;
    const chartTitleContent = (
        <div className="cq-symbol-select-btn">
            {SymbolIcon && <SymbolIcon className={`ic-${currentSymbol.symbol}`} />}
            <div className="cq-symbol-info">
                <div className="cq-market">{currentSymbol.market_display_name}</div>
                <div className="cq-symbol">{currentSymbol.name}</div>
            </div>
            {isVisible && isShowChartPrice &&
            <div className="cq-chart-price">
                <AnimatedPrice className="cq-current-price" />
                <div className={`cq-change ${isPriceUp ? 'stx-up' : 'stx-down'}`}>
                    <span className="cq-todays-change">{todayChange || 0}</span>&nbsp;
                </div>
            </div>}
            <ArrowIcon className="cq-symbol-dropdown" />
        </div>
    );

    return (
        enabled && (
            <Menu
                className={chartTitleClassName}
                isFullscreen
            >
                <Menu.Title>
                    {chartTitleContent}
                </Menu.Title>
                <Menu.Body>
                    <MarketSelector
                        dialogTitle={t.translate('Underlying Assets')}
                        closeMenu={() => onCloseMenu()}
                    />
                </Menu.Body>
            </Menu>)
        || (
            <div className={chartTitleClassName}>
                { chartTitleContent }
            </div>
        )
    );
};

export default connect(({ chartTitle: c }) => ({
    todayChange: c.todayChange,
    isPriceUp: c.animatedPrice.isIncrease,
    isVisible: c.isVisible,
    isShowChartPrice: c.isShowChartPrice,
    currentSymbol: c.currentSymbol,
    Menu: c.menu.connect(Menu),
    MarketSelector: c.categoricalDisplay.connect(CategoricalDisplay),
    AnimatedPrice: c.animatedPrice.connect(AnimatedPrice),
    onCloseMenu: c.menu.onTitleClick,
    isMobile: c.categoricalDisplay.isMobile,
}))(ChartTitle);
