import React from 'react';
import { CategoryIconMap } from '../Icons.jsx';

const FilterItemIcon = React.memo(({ categoryId }) => {
    const CategoryIcon = CategoryIconMap[categoryId];
    return CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />;
});

const FilterItem = React.memo(({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category, isSearching }) => {
    const isActive =
        focusedCategoryKey && focusedCategoryKey.length
            ? focusedCategoryKey === category.categoryId
            : activeCategoryKey === category.categoryId;
    return (
        <div
            className={`sc-mcd__filter__item ${isActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
            onClick={e => handleFilterClick(category.categoryId, e)}
        >
            <FilterItemIcon categoryId={category.categoryId} />
            {t.translate(category.categoryName)}
        </div>
    );
});

export const FilterPanel = ({
    filteredItems,
    handleFilterClick,
    focusedCategoryKey,
    activeCategoryKey,
    isSearching,
}) => (
    <div className='sc-mcd__filter'>
        {filteredItems.map(category => (
            <FilterItem
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                focusedCategoryKey={focusedCategoryKey}
                isSearching={isSearching}
            />
        ))}
    </div>
);
