import React from 'react';
import '../../../sass/components/_categorical-display.scss';
import Scrollbars from 'tt-react-custom-scrollbars';

const CategoricalDisplay = ({
    onSelectItem,
    updateScrollSpy,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    isMobile,
    height,
}) => (
    <div
        className="cq-categorical-display"
        style={{ height }}
    >
        <div className="cq-lookup-filters">
            <SearchInput />
            <FilterPanel />
        </div>
        <Scrollbars
            className="cq-scroll-panel"
            onScroll={updateScrollSpy}
            ref={setScrollPanel}
            style={{ width: isMobile ? '100%' : '66%' }}
        >
            <ResultsPanel
                onSelectItem={onSelectItem}
            />
        </Scrollbars>
    </div>
);

export default CategoricalDisplay;
