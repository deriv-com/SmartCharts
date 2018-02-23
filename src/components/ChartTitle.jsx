import React from 'react';
import { connect } from '../store/Connect';
import Menu_ from './Menu.jsx';
import SymbolsCategoricalDisplay_ from './SymbolsCategoricalDisplay.jsx';
import AnimatedPrice_ from './AnimatedPrice.jsx';

const Menu = Menu_.connectBy(stores => stores.chartTitle.menu);
const AnimatedPrice = AnimatedPrice_.connectBy(stores => stores.chartTitle.currentPrice);
const SymbolsCategoricalDisplay = SymbolsCategoricalDisplay_.connectBy(stores => stores.chartTitle.symbolsCategoricalDisplay);

const ChartTitle = ({
    todayChange,
    todayChangePercentage,
    isVisible,
    isPriceUp,
    isMenuOpened,
    activeSymbols,
    symbolName,
    onSelectItem
}) => {
    return (
        <Menu className="cq-chart-title stx-show">
            <Menu.Title>
                {isVisible &&
                <div className="cq-symbol-select-btn">
                    <div className="cq-symbol">{symbolName}</div>
                    <div className="cq-chart-price">
                        <AnimatedPrice className="cq-current-price" />
                        <div className={`cq-change ${isPriceUp ? 'stx-up' : 'stx-down'}`}>
                            <span className="ico" />
                            <span className="cq-todays-change">{todayChange}</span> (<span className="cq-todays-change-pct">{todayChangePercentage}</span>)
                        </div>
                    </div>
                </div>}
            </Menu.Title>
            <Menu.Body>
                <SymbolsCategoricalDisplay
                    isShown={isMenuOpened}
                    activeSymbols={activeSymbols}
                    onSelectItem={onSelectItem}
                />
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ chartTitle: c }) => ({
        todayChange: c.todayChange,
        activeSymbols: c.activeSymbols,
        todayChangePercentage: c.todayChangePercentage,
        isPriceUp: c.isPriceUp,
        isVisible: c.isVisible,
        symbolName: c.symbolName,
        isMenuOpened: c.menu.open,
        onSelectItem: c.onSelectItem
    })
)(ChartTitle);
