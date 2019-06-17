import React from 'react';
import NotificationBadge from './NotificationBadge.jsx';
import { connect } from '../store/Connect';
import { IndicatorIcon } from './Icons.jsx';

const StudyLegend = ({
    isOpened,
    setOpen,
    StudyMenu,
    menuOpen,
    StudyCategoricalDisplay,
    isMobile,
    activeStudiesNo,
    searchInputClassName,
    ItemWrapper,
    itemWrapperProps,
    disableAll,
    hasReachedLimitListener,
    updateProps,
}) => {
    updateProps({ ItemWrapper, itemWrapperProps, disableAll, hasReachedLimitListener });

    return (
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
                <StudyCategoricalDisplay
                    searchInputClassName={searchInputClassName}
                    ItemWrapper={ItemWrapper}
                    itemWrapperProps={itemWrapperProps}
                    disableAll={disableAll}
                />
            </StudyMenu.Body>
        </StudyMenu>
    );
};

export default connect(({ studies: st, chart }) => ({
    isOpened: st.open,
    setOpen: st.setOpen,
    StudyMenu: st.StudyMenu,
    menuOpen: st.menu.open,
    StudyCategoricalDisplay: st.StudyCategoricalDisplay,
    isMobile: chart.isMobile,
    activeStudiesNo: st.activeStudies.data.length,
    ItemWrapper: st.ItemWrapper,
    itemWrapperProps: st.itemWrapperProps,
    disableAll: st.hasReachedLimits,
    hasReachedLimitListener: st.hasReachedLimitListener,
    updateProps: st.updateProps,
}))(StudyLegend);
