import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setScrollPanel,
    isScrollingDown,
    updateScrollSpy,
    scrollUp,
    scrollDown,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    isMobile,
    scrollSpace
}) => (
    <div className="cq-categorical-display">
        <div className={`cq-lookup-filters ${isScrollingDown ? '' : ''}`}>
            <div className="cq-lookup-panel"
                style={{height: isMobile ? (44 + (scrollSpace*1.2)) : false}}
                >
                <SearchInput />
                <FilterPanel />
            </div>
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
