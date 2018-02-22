import React, { Fragment } from 'react';
import { connect } from '../store/Connect';
import Menu_ from './Menu.jsx';
import SymbolsCategoricalDisplay from './SymbolsCategoricalDisplay.jsx';

const Menu = Menu_.connectBy(stores => stores.chartTitle.menu);

const ChartTitle = ({
    todayChange,
    todayChangePercentage,
    currentPrice,
    isVisible,
    isPriceUp,
    isMenuOpened,
    activeSymbols,
    symbolName,
    onSelectItem
}) => {
    return (
        <Menu className="cq-chart-title stx-show" hidden>
            <Menu.Title>
                {isVisible &&
                <div className="cq-symbol-select-btn">
                    <div className="cq-symbol">{symbolName}</div>
                    <div className="cq-chart-price">
                        <div className="cq-current-price">{currentPrice.toFixed(2)}</div>
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
        currentPrice: c.currentPrice,
        isPriceUp: c.isPriceUp,
        isVisible: c.isVisible,
        symbolName: c.symbolName,
        isMenuOpened: c.menu.open,
        onSelectItem: c.onSelectItem
    })
)(ChartTitle);
