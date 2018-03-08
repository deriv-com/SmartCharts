import React, { Component, Fragment } from 'react';
import {CategoryIconMap, ItemIconMap, SearchIcon,
    SymbolPlaceholderIcon, ActiveOptionsIconMap } from './Icons.jsx';

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
}) => {
    const renderIcon = (item) => {
        if (!item.itemId) {return '';}
        const ItemIcon = ItemIconMap[`${item.itemId.toLowerCase()}`];
        if (!ItemIcon) {return <SymbolPlaceholderIcon/>;}
        return <ItemIcon className={`ic-${item.itemId}`} />;
    };
    const renderText = (item) => <span className="ciq-item-display">{item.display}</span>;

    const renderItem = (item, k) =>
        <div
            className={`cq-item ${item.selected ? 'selected ' : ''}`}
            onClick={() => onSelectItem(item.dataObject)}
            key={k}
            disabled={!item.enabled}
        >
            {renderIcon(item)}{renderText(item)}
        </div>;

    const renderActiveItem = (item, k) =>
        <div
            className="cq-active-item"
            key={k}
        >
            {renderIcon(item)}{renderText(item)}
            {activeOptions &&
            <span className="cq-active-options">
                {activeOptions.map((opt, i) => {
                    const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
                    return (
                        <span
                            key={`active-opt-${i}`}
                            className={`ic-${opt.id}`}
                            onClick={() => opt.onClick && opt.onClick(item.dataObject)}
                        >
                            {ActiveOptionIcon && <ActiveOptionIcon />}
                            {opt.renderChild && opt.renderChild(item)}
                        </span>
                    );
                })}
            </span>}
        </div>;

    return (
        <div className="cq-categorical-display">
            <div className="cq-lookup-filters">
                <div className="cq-lookup-input">
                    <input
                        ref={setSearchInput}
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
                            onClick={() => handleFilterClick(category)}
                        >
                            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`}/>}
                            {category.categoryName}
                        </div>);
                })}
            </div>
            <div className="cq-scroll-panel" ref={setScrollPanel}>
                <div className="results-panel">
                    { filteredItems.map((category, i) =>
                        getItemCount(category) > 0 &&
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
                                ) : category.data.map((i === 0 && hasActiveItems) ? renderActiveItem : renderItem)
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
