import React from 'react';
import Scroll from '../Scroll.jsx';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setFilterText,
    updateScrollSpy,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    height,
    id,
    SearchInput,
    searchInputClassName,
    disableAll,
    isNestedList,
    isMobile,
}) => {
    const innerPanel = (
        <ResultsPanel
            onSelectItem={item => {
                onSelectItem(item);
                setFilterText('');
            }}
            id={id}
            disableAll={disableAll}
            isNestedList={isNestedList}
        />
    );
    return (
        <div className={`sc-mcd ${isNestedList ? 'sc-mcd--nested' : ''}`} style={{ height }} id={id}>
            {!isMobile && (
                <div className='sc-mcd__tabs'>
                    <div className='sc-mcd__tabs__head'>{t.translate('Markets')}</div>
                    <div className='sc-mcd__tabs__body'>{!isNestedList && <FilterPanel />}</div>
                </div>
            )}
            <div className='sc-mcd__content'>
                <div className='sc-mcd__content__head'>
                    <SearchInput searchInputClassName={searchInputClassName} />
                </div>
                <div className='sc-mcd__content__body'>
                    {isMobile ? (
                        <div className='sc-mcd__content__body__scroll' onScroll={updateScrollSpy} ref={setScrollPanel}>
                            {innerPanel}
                        </div>
                    ) : (
                        <Scroll autoHide onScroll={updateScrollSpy} setPanel={setScrollPanel}>
                            {innerPanel}
                        </Scroll>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoricalDisplay;
