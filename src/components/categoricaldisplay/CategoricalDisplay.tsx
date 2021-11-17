import React from 'react';
import { observer } from 'mobx-react-lite';
import CategoricalDisplayStore from 'src/store/CategoricalDisplayStore';
import { TProcessedSymbolItem, TSubCategoryDataItem } from 'src/binaryapi/ActiveSymbols';
import Scroll from '../Scroll';
import '../../../sass/components/_categorical-display.scss';
import SearchInput from '../SearchInput';
import { ResultsPanel } from './ResultsPanel';
import { ActiveItem, NormalItem } from './Item';

type TCategoricalDisplayProps = {
    store: CategoricalDisplayStore;
    searchInputClassName?: string;
    isNestedList?: boolean;
    id?: string;
    onSelectItem?: (item: TProcessedSymbolItem) => void;
    disableAll?: boolean;
};

export type TItemTypeProps = {
    getActiveCategory: CategoricalDisplayStore['getActiveCategory'];
    categoryId?: string;
    item: TSubCategoryDataItem;
    favoritesId: string;
    onSelectItem?: TCategoricalDisplayProps['onSelectItem'];
    disableAll?: boolean;
};

const ItemType: React.FC<TItemTypeProps> = ({ getActiveCategory, categoryId, ...props }) => {
    if (categoryId === 'active' && getActiveCategory !== undefined) {
        console.log('ActiveItem');
        return <ActiveItem {...props} />;
    }

    return <NormalItem {...props} />;
};

const CategoricalDisplay: React.FC<TCategoricalDisplayProps> = ({
    store,
    id,
    searchInputClassName,
    disableAll,
    isNestedList,
    onSelectItem: onSelectItemProp,
}) => {
    const {
        updateScrollSpy,
        setScrollPanel,
        FilterPanel,
        setFilterText,
        searchInput,
        height,
        filterText,
        placeholderText,
        handleTitleClick,
        filteredItems,
        setCategoryElement,
        activeHeadKey,
        getActiveCategory,
        favoritesId,
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
            ItemType={ItemType}
            favoritesId={favoritesId}
            getActiveCategory={getActiveCategory}
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
