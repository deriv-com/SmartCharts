import React from 'react';
import { observer } from 'mobx-react-lite';
import CategoricalDisplayStore from 'src/store/CategoricalDisplayStore';
import { TProcessedSymbolItem } from 'src/binaryapi/ActiveSymbols';
import Scroll from '../Scroll';
import '../../../sass/components/_categorical-display.scss';
import SearchInput from '../SearchInput';
import ResultsPanel from './ResultsPanel';
import NormalItem from './Item';
import FilterPanel from './FilterPanel';

type TCategoricalDisplayProps = {
    store: CategoricalDisplayStore;
    searchInputClassName?: string;
    isNestedList?: boolean;
    id?: string;
    onSelectItem?: (item: TProcessedSymbolItem) => void;
    disableAll?: boolean;
};

const CategoricalDisplay = ({
    store,
    id,
    searchInputClassName,
    disableAll,
    isNestedList,
    onSelectItem: onSelectItemProp,
}: TCategoricalDisplayProps) => {
    const {
        updateScrollSpy,
        setScrollPanel,
        setFilterText,
        searchInput,
        height,
        filterText,
        placeholderText,
        handleTitleClick,
        filteredItems,
        setCategoryElement,
        activeHeadKey,
        favoritesId,
        handleFilterClick,
        focusedCategoryKey,
        activeCategoryKey,
    } = store;

    const onSelectItem = onSelectItemProp || store.onSelectItem;

    const { isMobile } = store.chart;

    const innerPanel = (
        <ResultsPanel
            onSelectItem={(item: TProcessedSymbolItem) => {
                onSelectItem?.(item);
                setFilterText('');
            }}
            disableAll={disableAll}
            isNestedList={isNestedList}
            handleTitleClick={handleTitleClick}
            filteredItems={filteredItems}
            setCategoryElement={setCategoryElement}
            activeHeadKey={activeHeadKey}
            ItemType={NormalItem}
            favoritesId={favoritesId}
        />
    );

    return (
        <div className={`sc-mcd ${isNestedList ? 'sc-mcd--nested' : ''}`} style={{ height }} id={id}>
            {!isMobile && (
                <div className='sc-mcd__tabs'>
                    <div className='sc-mcd__tabs__head'>{t.translate('Markets')}</div>
                    <div className='sc-mcd__tabs__body'>
                        {!isNestedList && (
                            <FilterPanel
                                filteredItems={filteredItems}
                                handleFilterClick={handleFilterClick}
                                activeCategoryKey={activeCategoryKey}
                                focusedCategoryKey={focusedCategoryKey}
                                isSearching={filterText !== ''}
                            />
                        )}
                    </div>
                </div>
            )}
            <div className='sc-mcd__content'>
                <div className='sc-mcd__content__head'>
                    <SearchInput
                        placeholder={placeholderText}
                        searchInputClassName={searchInputClassName}
                        value={filterText}
                        onChange={setFilterText}
                        searchInput={searchInput}
                    />
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

export default observer(CategoricalDisplay);
