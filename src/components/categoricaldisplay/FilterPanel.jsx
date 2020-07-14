import React from 'react';
import {
    CategoryIconMap,
} from '../Icons.jsx';

const FilterCategoryIcon = React.memo(({ categoryId }) => {
    const CategoryIcon = CategoryIconMap[categoryId];
    return (CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />);
});

const Filter = React.memo(({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category }) => {
    const isActive = focusedCategoryKey && focusedCategoryKey.length ? focusedCategoryKey === category.categoryId : activeCategoryKey === category.categoryId;
    return (
        <div
            className={`sc-filter ${isActive ? 'sc-active-filter' : ''}`}
            onClick={e => handleFilterClick(category.categoryId, e)}
        >
            <FilterCategoryIcon categoryId={category.categoryId} />
            <span className="sc-filter-text">{t.translate(category.categoryName)}</span>
        </div>
    );
});

export const FilterPanel = ({ filteredItems, handleFilterClick, focusedCategoryKey, activeCategoryKey }) => (
    <div className="sc-filter-panel">
        {filteredItems.map(category => (
            <Filter
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                focusedCategoryKey={focusedCategoryKey}
            />
        ))}
    </div>
);
