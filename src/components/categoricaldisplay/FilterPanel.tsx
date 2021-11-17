import React from 'react';
import { CategoryIconMap } from '../Icons';
import { TCategorizedSymbolItem, TCategorizedSymbols } from '../../binaryapi/ActiveSymbols';

export type TFilterPanelProps = {
    filteredItems: TCategorizedSymbols;
    handleFilterClick: (categoryId: string) => void;
    focusedCategoryKey: string | null;
    activeCategoryKey: string;
    isSearching: boolean;
};

const FilterItemIcon = React.memo(({ categoryId }: { categoryId: string }) => {
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
                onClick={e => handleFilterClick(category.categoryId, e)}
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
        {filteredItems.map((category: TCategorizedSymbolItem) => (
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
