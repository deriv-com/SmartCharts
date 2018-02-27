import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';

const ChartTitle = ({
    todayChange,
    todayChangePercentage,
    isVisible,
    isPriceUp,
    symbolName,
    Menu,
    CategoricalDisplay,
    AnimatedPrice,
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
                            <span className="cq-todays-change">{todayChange}</span>
                            (<span className="cq-todays-change-pct">{todayChangePercentage}</span>)
                        </div>
                    </div>
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
        symbolName: c.symbolName,
        Menu: c.menu.connect(Menu),
        CategoricalDisplay: c.categoricalDisplay.connect(CategoricalDisplay),
        AnimatedPrice: c.animatedPrice.connect(AnimatedPrice),
    })
)(ChartTitle);
