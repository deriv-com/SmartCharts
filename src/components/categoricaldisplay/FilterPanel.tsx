import React from 'react';
import { CategoryIconMap } from '../Icons';
import { TCategory } from '../../types';

export type TFilterPanelProps = {
    filteredItems: Array<TCategory>;
    handleFilterClick: (categoryId: string) => void;
    focusedCategoryKey: string | null;
    activeCategoryKey: string;
    isSearching: boolean;
};

const FilterItemIcon = React.memo(({ categoryId }: any) => {
    const CategoryIcon = CategoryIconMap[categoryId as keyof typeof CategoryIconMap];
    return CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />;
});

const FilterItem = React.memo(
    ({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category, isSearching }: any) => {
        const isActive =
            focusedCategoryKey && focusedCategoryKey.length
                ? focusedCategoryKey === category.categoryId
                : activeCategoryKey === category.categoryId;
        return (
            <div
                className={`sc-mcd__filter__item ${isActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
                onClick={(e: any) => handleFilterClick(category.categoryId, e)}
            >
                <FilterItemIcon categoryId={category.categoryId} />
                {t.translate(category.categoryName)}
            </div>
        );
    }
);

export const FilterPanel: React.FC<TFilterPanelProps> = ({
    filteredItems,
    handleFilterClick,
    focusedCategoryKey,
    activeCategoryKey,
    isSearching,
}) => (
    <div className='sc-mcd__filter'>
        {filteredItems.map((category: TCategory) => (
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