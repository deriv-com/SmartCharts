import React, { Component, Fragment } from 'react';

const CategoricalDisplay = ({
    placeholderText,
    setSearchInput,
    setResultsPanel,
    setFilterText,
    handleFilterClick,
    handleInputClick,
    hasActiveItems,
    filteredItems,
    getItemCount,
    onSelectItem
}) => {
    const renderItem = (item, k) => <div className={`cq-item ${item.selected ? 'selected ' : ''}`} onClick={() => onSelectItem(item.symbolObj)} key={k} disabled={!item.enabled}>{item.display}</div>;
    const renderActiveItem = (item, k) => <div className="cq-active-item" key={k}>{item.display}</div>;

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
                </div>
                { filteredItems.map((category, i) =>
                    <div key={i}
                        className="cq-filter"
                        onClick={() => handleFilterClick(category)}
                    >
                        {category.categoryName}
                    </div>
                )}
            </div>
            <cq-scroll>
                <div className="results-panel" ref={setResultsPanel}>
                    { filteredItems.map((category, i) =>
                        getItemCount(category) > 0 &&
                        <Fragment key={i}>
                            <div className={`category-title category-${category.categoryId}`}>{category.categoryName}</div>
                            <div className="category">
                                { category.hasSubcategory ? category.data.map((subcategory, j) =>
                                    getItemCount(subcategory) > 0 &&
                                    <Fragment key={j}>
                                        <div className="subcategory">{subcategory.subcategoryName}</div>
                                        { subcategory.data.map(renderItem)}
                                    </Fragment>
                                ) : category.data.map((i === 0 && hasActiveItems) ? renderActiveItem : renderItem)
                                }
                            </div>
                        </Fragment>
                    ) }
                </div>
            </cq-scroll>
        </div>
    );
};

export default CategoricalDisplay;
