import React from 'react';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    SearchInput,
}) => (
    <div className="cq-categorical-display">
        <div className="cq-lookup-filters">
            <SearchInput />
            <FilterPanel />
        </div>
        <div
            className="cq-scroll-panel"
            ref={setScrollPanel}
        >
            <ResultsPanel
                onSelectItem={onSelectItem}
            />
        </div>
    </div>
);

export default CategoricalDisplay;
