import PropTypes            from 'prop-types';
import React                from 'react';
import NotificationBadge    from './NotificationBadge.jsx';
import { connect }          from '../store/Connect';
import { IndicatorIcon }    from './Icons.jsx';

const StudyLegend = ({
    isOpened,
    setOpen,
    StudyMenu,
    menuOpen,
    StudyCategoricalDisplay,
    isMobile,
    activeStudiesNo,
    searchInputClassName,
}) => (
    <StudyMenu
        className="ciq-studies"
        isOpened={isOpened}
        setOpen={setOpen}
        isMobile={isMobile}
        title={isMobile ? t.translate('Indicators') : ''}
    >
        <StudyMenu.Title>
            <IndicatorIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Indicators')}
            />
            <NotificationBadge notificationCount={activeStudiesNo} />
        </StudyMenu.Title>
        <StudyMenu.Body>
            <StudyCategoricalDisplay searchInputClassName={searchInputClassName} />
        </StudyMenu.Body>
    </StudyMenu>
);

StudyLegend.propTypes = {
    isOpened: PropTypes.bool,
    setOpen: PropTypes.func,
    StudyMenu: PropTypes.any.isRequired,
    menuOpen: PropTypes.bool,
    StudyCategoricalDisplay: PropTypes.any.isRequired,
    isMobile: PropTypes.bool,
    activeStudiesNo: PropTypes.number,
};

StudyLegend.defaultProps = {
    setOpen: () => null,
    activeStudiesNo: 1,
};

export default connect(({ studies: st, chart }) => ({
    isOpened: st.open,
    setOpen: st.setOpen,
    StudyMenu: st.StudyMenu,
    menuOpen: st.menu.open,
    StudyCategoricalDisplay: st.StudyCategoricalDisplay,
    isMobile: chart.isMobile,
    activeStudiesNo: st.activeStudies.data.length,
}))(StudyLegend);
