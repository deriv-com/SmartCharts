import PropTypes            from 'prop-types';
import React                from 'react';
import { connect }          from '../store/Connect';
import NotificationBadge    from './NotificationBadge.jsx';
import { ComparisonIcon }   from './Icons.jsx';

const Comparison = ({
    ComparisonSelector,
    ComparisonMenu,
    menuOpen,
    isMobile,
    activeComparisonsNo,
}) => (
    <ComparisonMenu
        className="cq-comparison-new cq-symbols-display"
        isMobile={isMobile}
        title={isMobile ? t.translate('Comparison') : ''}
    >
        <ComparisonMenu.Title>
            <ComparisonIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Comparison')}
            />
            <NotificationBadge notificationCount={activeComparisonsNo} />
        </ComparisonMenu.Title>
        <ComparisonMenu.Body>
            <ComparisonSelector />
        </ComparisonMenu.Body>
    </ComparisonMenu>
);

Comparison.propTypes = {
    ComparisonSelector: PropTypes.any.isRequired,
    ComparisonMenu: PropTypes.any.isRequired,
    menuOpen: PropTypes.bool,
    isMobile: PropTypes.bool,
    activeComparisonsNo: PropTypes.number,
};

Comparison.defaultProps = {
    menuOpen: false,
    isMobile: false,
    activeComparisonsNo: 1,
};

export default connect(({ comparison: c, chart }) => ({
    ComparisonSelector: c.ComparisonSelector,
    ComparisonMenu: c.ComparisonMenu,
    menuOpen: c.menu.open,
    isMobile: chart.isMobile,
    activeComparisonsNo: c.comparisonSymbols.length,
}))(Comparison);
