import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setScrollPanel,
    updateScrollSpy,
    scrollUp,
    scrollDown,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    isScrollingDown
}) => (
    <div className="cq-categorical-display">
        <div className={`cq-lookup-filters ${isScrollingDown ? 'scroll-down' : ''}`}>
            <SearchInput />
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
