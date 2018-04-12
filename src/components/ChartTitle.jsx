import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';
import {ItemIconMap, SymbolPlaceholderIcon} from './Icons.jsx';

const ChartTitle = ({
    todayChange,
    todayChangePercentage,
    isVisible,
    isShowChartPrice,
    isPriceUp,
    currentSymbol,
    Menu,
    CategoricalDisplay,
    AnimatedPrice,
}) => {
    const SymbolIcon = ItemIconMap[currentSymbol.symbol] || SymbolPlaceholderIcon;
    return (
        <Menu className="cq-chart-title stx-show cq-symbols-display">
            <Menu.Title>
                {isVisible &&
                <div className="cq-symbol-select-btn">
                    {SymbolIcon && <SymbolIcon className={`ic-${currentSymbol.symbol}`} />}
                    <div className="cq-symbol-info">
                        <div className="cq-market">{currentSymbol.market_display_name}</div>
                        <div className="cq-symbol">{currentSymbol.name}</div>
                    </div>
                    {isShowChartPrice &&
                    <div className="cq-chart-price">
                        <AnimatedPrice className="cq-current-price" />
                        <div className={`cq-change ${isPriceUp ? 'stx-up' : 'stx-down'}`}>
                            <span className="cq-todays-change">{todayChange}</span>&nbsp;
                            {/*<span className="cq-todays-change-pct">({todayChangePercentage})</span>*/}
                        </div>
                    </div>}
                </div>}
            </Menu.Title>
            <Menu.Body>
                <CategoricalDisplay />
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ chartTitle: c }) => ({
        todayChange: c.todayChange,
        todayChangePercentage: c.todayChangePercentage,
        isPriceUp: c.isPriceUp,
        isVisible: c.isVisible,
        isShowChartPrice: c.isShowChartPrice,
        currentSymbol: c.currentSymbol,
        Menu: c.menu.connect(Menu),
        CategoricalDisplay: c.categoricalDisplay.connect(CategoricalDisplay),
        AnimatedPrice: c.animatedPrice.connect(AnimatedPrice),
    })
)(ChartTitle);
