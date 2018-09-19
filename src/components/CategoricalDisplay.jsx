import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    CategoryIconMap, ItemIconMap, ActiveOptionsIconMap,
} from './Icons.jsx';
import Favorite from './Favorite.jsx';
import SearchInput from './SearchInput.jsx';
import '../../sass/components/_categorical-display.scss';

const Icon = ({ id }) => {
    if (!id || !ItemIconMap[id]) { return ''; }
    const ItemIcon = ItemIconMap[id];
    return <ItemIcon className={`ic-${id}`} />;
};

const ItemLeft = ({ item: { itemId, display } }) => (
    <div className="left">
        <Icon id={itemId} />
        <span className="ciq-item-display">{display}</span>
    </div>
);

const ItemRight = ({ favoritesId, item: { dataObject, itemId } }) => (
    <div className="right">
        {(dataObject && (dataObject.exchange_is_open === undefined || dataObject.exchange_is_open)) ? '' : <span className="closed-market">{t.translate('CLOSED')}</span>}
        <Favorite
            category={favoritesId}
            id={itemId}
        />
    </div>
);

const ActiveOption = ({ opt, item }) => {
    const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
    return (
        <span
            className={`ic-${opt.id}`}
            onClick={e => opt.onClick && opt.onClick(item.dataObject, e)}
        >
            {ActiveOptionIcon && <ActiveOptionIcon />}
            {opt.renderChild && opt.renderChild(item)}
        </span>
    );
};

const ActiveOptions = ({ activeOptions, item }) => (
    activeOptions && (
        <span className="cq-active-options">
            {activeOptions.map(opt => (
                <ActiveOption key={opt.id} opt={opt} item={item} />
            ))}
        </span>
    )
);

const Filter = ({ activeCategoryKey, handleFilterClick, category, isMobile }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    const isActive = activeCategoryKey === category.categoryId;
    return (
        <div
            className={`cq-filter ${isActive ? 'cq-active-filter' : ''} ${!isMobile ? 'cq-hover-style' : ''}`}
            onClick={e => handleFilterClick(category, e)}
        >
            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />}
            <span className="cq-filter-text">{t.translate(category.categoryName)}</span>
        </div>);
};

const FilterPanel = ({ filteredItems, handleFilterClick, activeCategoryKey, isMobile }) => (
    <div className="cq-filter-panel">
        { filteredItems.map(category => (
            <Filter
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                isMobile={isMobile}
            />
        ))}
    </div>
);

const CategoricalDisplay = ({
    isMobile,
    placeholderText,
    filterText,
    setFilterText,
    handleFilterClick,
    hasActiveItems,
    filteredItems,
    getItemCount,
    onSelectItem,
    activeOptions,
    setScrollPanel,
    setCategoryElement,
    activeCategoryKey,
    favoritesId,
    isScrollingDown,
    updateScrollSpy,
    scrollUp,
    scrollDown,
    isShown,
}) => {
    const renderItem = item => (
        <div
            className={`cq-item ${item.selected ? 'selected ' : ''}`}
            onClick={e => item.enabled && onSelectItem(item.dataObject, e)}
            disabled={!item.enabled}
            key={item.itemId}
        >
            <ItemLeft item={item} />
            <ItemRight item={item} favoritesId={favoritesId} />
        </div>);

    const renderActiveItem = item => (
        <div
            className="cq-active-item"
            key={item.display}
        >
            <ItemLeft item={item} />
            <div className="right">
                <ActiveOptions activeOptions={activeOptions} item={item} />
                <Favorite
                    category={favoritesId}
                    id={item.itemId}
                />
            </div>
        </div>);

    return (
        <div className="cq-categorical-display">
            <div className={`cq-lookup-filters ${isScrollingDown ? 'scroll-down' : ''}`}>
                {isShown // render search only when dialog is opened allows us to focus on mount
                && (
                    <SearchInput
                        placeholder={placeholderText}
                        value={filterText}
                        onChange={setFilterText}
                    />
                )}
                <FilterPanel
                    filteredItems={filteredItems}
                    handleFilterClick={handleFilterClick}
                    activeCategoryKey={activeCategoryKey}
                    isMobile={isMobile}
                />
            </div>
            <PerfectScrollbar
                className="cq-scroll-panel"
                ref={setScrollPanel}
                onScrollY={e => updateScrollSpy(e)}
                onScrollUp={scrollUp}
                onScrollDown={scrollDown}
            >
                <div className="results-panel">
                    { filteredItems.map(category => (getItemCount(category) > 0 || category.emptyDescription) && (
                        <div
                            key={category.categoryId}
                            className={`category category-${category.categoryId}`}
                            ref={el => setCategoryElement(el, category.categoryId)}
                        >
                            <div className="category-title">{t.translate(category.categoryName)}</div>
                            { category.hasSubcategory
                                ? category.data.map(subcategory => getItemCount(subcategory) > 0 && (
                                    <div
                                        className="category-content"
                                        key={subcategory.subcategoryName}
                                    >
                                        <div className="subcategory">{t.translate(subcategory.subcategoryName)}</div>
                                        { subcategory.data.map(renderItem)}
                                    </div>
                                ))
                                : category.data.length > 0 && (
                                    <div className="category-content">
                                        {category.data.map((category.categoryId === 'active' && hasActiveItems) ? renderActiveItem : renderItem)}
                                    </div>
                                )}
                            { getItemCount(category) === 0 && category.emptyDescription && (
                                <div className="category-content">
                                    <div className="empty-category">{t.translate(category.emptyDescription)}</div>
                                </div>
                            )}
                        </div>
                    )) }
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default CategoricalDisplay;
