import React    from 'react';
import Scroll   from '../Scroll.jsx';
import '../../../sass/components/categorical-display.scss';

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
    isMobile,
}) => (
    <div
        className={`sc-mcd ${isNestedList ? 'sc-mcd--nested' : ''}`}
        style={{ height }}
        id={id}
    >
        {!isMobile && (
            <div className="sc-mcd__tabs">
                <div className="sc-mcd__tabs__head">
                    {t.translate('Markets')}
                </div>
                <div className="sc-mcd__tabs__body">
                    {!isNestedList && <FilterPanel /> }
                </div>
            </div>
        )}
        <div className="sc-mcd__content">
            <div className="sc-mcd__content__head">
                <SearchInput searchInputClassName={searchInputClassName} />
            </div>
            <div className="sc-mcd__content__body">
                <Scroll
                    autoHide
                    onScroll={updateScrollSpy}
                    setPanel={setScrollPanel}
                    isBypassed={isMobile}
                    className={isMobile ? 'sc-mcd__content__body_scroll' : ''}
                >
                    <ResultsPanel
                        onSelectItem={onSelectItem}
                        id={id}
                        disableAll={disableAll}
                        isNestedList={isNestedList}
                    />
                </Scroll>
            </div>
        </div>
    </div>
));

export default CategoricalDisplay;
