import React from 'react';
import '../../../sass/components/_categorical-display.scss';
import Scrollbars from 'tt-react-custom-scrollbars';

const CategoricalDisplay = React.memo(({
    onSelectItem,
    updateScrollSpy,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    SearchInput,
    isMobile,
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
            {
                isMobile
                    ? (
                        <div
                            className="sc-scrollbar cq-scroll-panel"
                            onScroll={updateScrollSpy}
                            ref={setScrollPanel}
                        >
                            {innerPanel}
                        </div>
                    )
                    : (
                        <Scrollbars
                            autoHide
                            className="sc-scrollbar cq-scroll-panel"
                            onScroll={updateScrollSpy}
                            ref={setScrollPanel}
                        >
                            {innerPanel}
                        </Scrollbars>
                    )
            }
        </div>
    );
});

export default CategoricalDisplay;
