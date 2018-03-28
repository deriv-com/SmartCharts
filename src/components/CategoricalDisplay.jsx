import React, { Component, Fragment } from 'react';
import {CategoryIconMap, ItemIconMap, SearchIcon,
    SymbolPlaceholderIcon, ActiveOptionsIconMap, FavoriteIcon } from './Icons.jsx';

const CategoricalDisplay = ({
    placeholderText,
    setSearchInput,
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
    handleInputClick,
    onFavoritedItem,
    favoritesId,
    favoritesMap,
}) => {
    const renderIcon = (item) => {
        if (!item.itemId) {return '';}
        const ItemIcon = ItemIconMap[item.itemId] || SymbolPlaceholderIcon;
        return <ItemIcon className={`ic-${item.itemId}`}/>;
    };
    const renderText = (item) => <span className="ciq-item-display">{item.display}</span>;
    const renderFavorite = (item) => {
        if (!item.itemId || !favoritesId) {return '';}
        return <span
            onClick={(e) => onFavoritedItem(item, e)}
            className={`ciq-favorite ${favoritesMap[item.itemId] ? 'ciq-active-favorite' : ''}`}>
            <FavoriteIcon />
        </span>;
    };

    const renderLeft = (item) =>
        <div className="left">
            {renderIcon(item)}
            {renderText(item)}
        </div>;

    const renderItem = (item, k) =>
        <div
            className={`cq-item ${item.selected ? 'selected ' : ''}`}
            onClick={(e) => item.enabled && onSelectItem(item.dataObject, e)}
            key={k}
            disabled={!item.enabled}
        >
            {renderLeft(item)}
            <div className="right">
                {renderFavorite(item)}
            </div>
        </div>;

    const renderActiveItem = (item, k) =>
        <div
            className="cq-active-item"
            key={k}
        >
            {renderLeft(item)}
            <div className="right">
                {activeOptions &&
                <span className="cq-active-options">
                    {activeOptions.map((opt, i) => {
                        const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
                        return (
                            <span
                                key={`active-opt-${i}`}
                                className={`ic-${opt.id}`}
                                onClick={(e) => opt.onClick && opt.onClick(item.dataObject, e)}
                            >
                                {ActiveOptionIcon && <ActiveOptionIcon />}
                                {opt.renderChild && opt.renderChild(item)}
                            </span>
                        );
                    })}
                </span>}
                {renderFavorite(item)}
            </div>
        </div>;

    return (
        <div className="cq-categorical-display">
            <div className="cq-lookup-filters">
                <div className="cq-lookup-input">
                    <input
                        ref={setSearchInput}
                        onClick={handleInputClick}
                        onChange={e => setFilterText(e.target.value)}
                        type="text"
                        spellCheck="off"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        placeholder={placeholderText}
                    />
                    <SearchIcon />
                </div>
                { filteredItems.map((category, i) => {
                    const CategoryIcon = CategoryIconMap[category.categoryId];
                    const isActive = activeCategoryKey === category.categoryId;
                    return (
                        <div key={i}
                            className={`cq-filter ${isActive ? 'cq-active-filter' : ''}`}
                            // onClick={(e) => handleFilterClick(category, e)}
                            ref={el => el && el.addEventListener('stxtap', e => handleFilterClick(category, e))}
                         >
                            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`}/>}
                            {category.categoryName}
                        </div>);
                })}
            </div>
            <div className="cq-scroll-panel" ref={setScrollPanel}>
                <div className="results-panel">
                    { filteredItems.map((category, i) =>
                        (getItemCount(category) > 0 || category.emptyDescription) &&
                            <div
                                key={`cat-${i}`}
                                className={`category category-${category.categoryId}`}
                                ref={(el) => setCategoryElement(el, category.categoryId)}
                            >
                                <div className="category-title">{category.categoryName}</div>
                                <div className="category-content">
                                    { category.hasSubcategory ? category.data.map((subcategory, j) =>
                                        getItemCount(subcategory) > 0 &&
                                    <Fragment key={j}>
                                        <div className="subcategory">{subcategory.subcategoryName}</div>
                                        { subcategory.data.map(renderItem)}
                                    </Fragment>
                                    ) : category.data.map((category.categoryId === 'active' && hasActiveItems) ? renderActiveItem : renderItem)
                                    }
                                    { getItemCount(category) === 0 && category.emptyDescription &&
                                    <div className="empty-category">{category.emptyDescription}</div>
                                    }
                                </div>
                            </div>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default CategoricalDisplay;
