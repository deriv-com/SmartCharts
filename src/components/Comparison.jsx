import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import { ComparisonIcon } from './Icons.jsx';

const Comparison = ({
    CategoricalDisplay,
    Menu,
    menuOpen,
    isMobile
}) => {
    return (
        <Menu
            className="cq-comparison-new cq-symbols-display"
        >
            <Menu.Title>
                <ComparisonIcon
                    className={`${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate("Comparison")} />
            </Menu.Title>
            <Menu.Body>
                {isMobile?<CategoricalDisplay />:<CategoricalDisplay />}
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        CategoricalDisplay: c.categoricalDisplay.connect(CategoricalDisplay),
        Menu: c.menu.connect(Menu),
        menuOpen: c.menu.open,
        isMobile: c.mainStore.chart.isMobile,
    })
)(Comparison);
