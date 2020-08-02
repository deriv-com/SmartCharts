import React from 'react';
import { CategoryIconMap } from '../Icons.jsx';

const FilterCategoryIcon = React.memo(({ categoryId }) => {
    const CategoryIcon = CategoryIconMap[categoryId];
    return (CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />);
});

const Filter = React.memo(({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category }) => {
    const isActive = focusedCategoryKey && focusedCategoryKey.length ? focusedCategoryKey === category.categoryId : activeCategoryKey === category.categoryId;
    return (
        <div
            className={`sc-mcd__filter__item ${isActive ? 'sc-mcd__filter__item--selected' : ''}`}
            onClick={e => handleFilterClick(category.categoryId, e)}
        >
            <FilterCategoryIcon categoryId={category.categoryId} />
            {t.translate(category.categoryName)}
        </div>
    );
});

export const FilterPanel = ({ filteredItems, handleFilterClick, focusedCategoryKey, activeCategoryKey }) => (
    <div className="sc-mcd__filter">
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
