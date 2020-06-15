import React    from 'react';
import Scroll   from '../Scroll.jsx';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = React.memo(({
    onSelectItem,
    updateScrollSpy,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    height,
    id,
    searchInputClassName,
    disableAll,
    isNestedList,
}) => {
    const innerPanel = (
        <ResultsPanel
            onSelectItem={onSelectItem}
            id={id}
            disableAll={disableAll}
            isNestedList={isNestedList}
        />
    );
    return (
        <div
            className={`cq-categorical-display ${isNestedList ? 'cq-categorical-display--nested' : ''}`}
            style={{ height }}
            id={id}
        >
            <div className="cq-lookup-filters">
                <SearchInput searchInputClassName={searchInputClassName} />
                {!isNestedList && <FilterPanel /> }
            </div>
            <Scroll
                autoHide
                onScroll={updateScrollSpy}
                setPanel={setScrollPanel}
            >
                {innerPanel}
            </Scroll>
        </div>
    );
});

export default CategoricalDisplay;
