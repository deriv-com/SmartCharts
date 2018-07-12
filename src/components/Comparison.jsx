import React from 'react';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import NotificationBadge from './NotificationBadge.jsx';
import { ComparisonIcon } from './Icons.jsx';

const Comparison = ({
    CategoricalDisplay,
    Menu,
    menuOpen,
    onCloseMenu,
    isMobile,
    activeComparisonsNo,
}) => (
    <Menu
        className="cq-comparison-new cq-symbols-display"
        isMobile={isMobile}
    >
        <Menu.Title>
            <ComparisonIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Comparison')}
            />
            <NotificationBadge notificationCount={activeComparisonsNo} />
        </Menu.Title>
        <Menu.Body>
            <CategoricalDisplay
                dialogTitle={t.translate('Comparison')}
                closeMenu={() => onCloseMenu()}
            />
        </Menu.Body>
    </Menu>
);

export default connect(({ comparison: c }) => ({
    CategoricalDisplay: c.categoricalDisplay.connect(CategoricalDisplay),
    Menu: c.menu.connect(Menu),
    menuOpen: c.menu.open,
    onCloseMenu: c.menu.onTitleClick,
    isMobile: c.categoricalDisplay.isMobile,
    activeComparisonsNo: c.mainStore.chart.comparisonSymbols.length,
}))(Comparison);
