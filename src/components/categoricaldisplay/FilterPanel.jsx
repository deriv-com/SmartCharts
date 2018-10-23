import React from 'react';
import {
    CategoryIconMap,
} from '../Icons.jsx';
import TranslationText from '../TranslationText.jsx';

const Filter = ({ activeCategoryKey, handleFilterClick, category, isMobile }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    const isActive = activeCategoryKey === category.categoryId;
    return (
        <div
            className={`cq-filter ${isActive ? 'cq-active-filter' : ''} ${!isMobile ? 'cq-hover-style' : ''}`}
            onClick={e => handleFilterClick(category, e)}
        >
            {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />}
            <TranslationText className="cq-filter-text" value={category.categoryName} />
        </div>);
};

export const FilterPanel = ({ filteredItems, handleFilterClick, activeCategoryKey, isMobile }) => (
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
