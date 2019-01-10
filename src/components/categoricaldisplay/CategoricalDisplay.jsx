import React from 'react';
import '../../../sass/components/_categorical-display.scss';
import SimpleBar from 'simplebar-react';

const CategoricalDisplay = ({
    onSelectItem,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    SearchInput,
}) => (
    <div
        className="cq-categorical-display"
        ref={setScrollPanel}
    >
        <div className="cq-lookup-filters">
            <SearchInput />
            <FilterPanel />
        </div>
        <SimpleBar
            className="cq-scroll-panel"
        >
            <ResultsPanel
                onSelectItem={onSelectItem}
            />
        </SimpleBar>
    </div>
);

export default CategoricalDisplay;
