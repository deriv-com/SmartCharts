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
    isShown,
    ResultsPanel,
    FilterPanel,
    SearchInput,
}) => (
    <div className="cq-categorical-display">
        <div className={`cq-lookup-filters ${isScrollingDown ? 'scroll-down' : ''}`}>
            {/* render search only when dialog is opened allows us to focus on mount */}
            {isShown && <SearchInput />}
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
