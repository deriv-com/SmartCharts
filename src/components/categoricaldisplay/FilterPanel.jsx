import React from 'react';
import {
    CategoryIconMap,
} from '../Icons.jsx';

const Filter = React.memo(({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category, isMobile }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    const isActive = focusedCategoryKey && focusedCategoryKey.length ? focusedCategoryKey === category.categoryId : activeCategoryKey === category.categoryId;
    return (
        <div
            className={`cq-filter ${isActive ? 'cq-active-filter' : ''} ${!isMobile ? 'cq-hover-style' : ''}`}
            onClick={e => handleFilterClick(category, e)}
        >
            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />}
            <span className="cq-filter-text">{t.translate(category.categoryName)}</span>
        </div>
    );
});

export const FilterPanel = ({ filteredItems, handleFilterClick, focusedCategoryKey, activeCategoryKey, isMobile }) => (
    <div className="cq-filter-panel">
        { filteredItems.map(category => (
            <Filter
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                focusedCategoryKey={focusedCategoryKey}
                isMobile={isMobile}
            />
        ))}
    </div>
);
