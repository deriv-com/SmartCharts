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
    ChartTitleMenu,
    MarketSelector,
    SpotPrice,
    onCloseMenu,
    setMenuOpen,
    onChange,
    enabled,
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
            {isVisible && isShowChartPrice
            && (
                <div className="cq-chart-price">
                    <SpotPrice className="cq-current-price" />
                    <div className={`cq-change ${isPriceUp ? 'stx-up' : 'stx-down'}`}>
                        <span className="cq-todays-change">{todayChange || 0}</span>&nbsp;
                    </div>
                </div>
            )}
            <ArrowIcon className="cq-symbol-dropdown" />
        </div>
    );

    return (
        <ChartTitleMenu
            enabled={enabled}
            className={chartTitleClassName}
            isFullscreen
        >
            <ChartTitleMenu.Title>
                {chartTitleContent}
            </ChartTitleMenu.Title>
            <ChartTitleMenu.Body>
                <MarketSelector
                    onSelectItem={(x) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol);
                        }
                        setMenuOpen(false);
                    }}
                    dialogTitle={t.translate('Underlying Assets')}
                    closeMenu={() => onCloseMenu()}
                />
            </ChartTitleMenu.Body>
        </ChartTitleMenu>
    );
};

export default connect(({ chartTitle: c }) => ({
    todayChange: c.todayChange,
    isPriceUp: c.animatedPrice.isIncrease,
    isVisible: c.isVisible,
    isShowChartPrice: c.isShowChartPrice,
    currentSymbol: c.currentSymbol,
    ChartTitleMenu: c.menu.connect(Menu),
    MarketSelector: c.categoricalDisplay.connect(CategoricalDisplay),
    SpotPrice: c.animatedPrice.connect(AnimatedPrice),
    onCloseMenu: c.menu.onTitleClick,
    setMenuOpen: c.menu.setOpen,
    onChange: c.setSymbol,
    isMobile: c.categoricalDisplay.isMobile,
}))(ChartTitle);
