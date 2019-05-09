import React from 'react';
import {
    CategoryIconMap,
} from '../Icons.jsx';

const Filter = ({ clickedCategoryKey, activeCategoryKey, handleFilterClick, category, isMobile }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    const isActive = clickedCategoryKey && clickedCategoryKey.length ? clickedCategoryKey === category.categoryId : activeCategoryKey === category.categoryId;
    return (
        <div
            className={`cq-filter ${isActive ? 'cq-active-filter' : ''} ${!isMobile ? 'cq-hover-style' : ''}`}
            onClick={e => handleFilterClick(category, e)}
        >
            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />}
            <span className="cq-filter-text">{t.translate(category.categoryName)}</span>
        </div>
    );
};

export const FilterPanel = ({ filteredItems, handleFilterClick, clickedCategoryKey, activeCategoryKey, isMobile }) => (
    <div className="cq-filter-panel">
        { filteredItems.map(category => (
            <Filter
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                clickedCategoryKey={clickedCategoryKey}
                isMobile={isMobile}
            />
        ))}
    </div>
);
