import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setScrollPanel,
    updateScrollSpy,
    scrollUp,
    isMobile,
    scrollDown,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    scrollSpace
}) => (
    <div className="cq-categorical-display">
        <div className={`cq-lookup-filters`}
            style={{height: isMobile ? (42 + (scrollSpace*1.2)) : false}}>
            <div className="cq-lookup-panel"
                style={{
                    height: isMobile ? scrollSpace : false,
                    opacity: isMobile ? (scrollSpace/50) : false
                }}>
                {/* render search only when dialog is opened allows us to focus on mount */}
                <SearchInput />
            </div>
            <FilterPanel />
        </div>
        <PerfectScrollbar
            className="cq-scroll-panel"
            ref={setScrollPanel}
            onScrollY={e => updateScrollSpy(e)}
            onScrollUp={scrollUp}
            onScrollDown={scrollDown}
        >
            <ResultsPanel
                onSelectItem={onSelectItem}
            />
        </PerfectScrollbar>
    </div>
);

export default CategoricalDisplay;
