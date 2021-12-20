import React from 'react';
import { observer } from 'mobx-react-lite';
import { CategoryIconMap } from '../Icons';
import { TCategorizedSymbolItem, TCategorizedSymbols } from '../../binaryapi/ActiveSymbols';

export type TFilterPanelProps = {
    filteredItems: TCategorizedSymbols;
    handleFilterClick: (categoryId: string) => void;
    focusedCategoryKey: string | null;
    activeCategoryKey: string;
    isSearching: boolean;
};

type TFilterItemProps = {
    focusedCategoryKey: string | null;
    activeCategoryKey: string;
    handleFilterClick: (categoryId: string) => void;
    isSearching: boolean;
    category: TCategorizedSymbolItem;
};

const FilterItemIcon = React.memo(({ categoryId }: { categoryId: string }) => {
    const CategoryIcon = CategoryIconMap[categoryId as keyof typeof CategoryIconMap];
    return CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />;
});

const FilterItem = React.memo(
    ({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category, isSearching }: TFilterItemProps) => {
        const isActive =
            focusedCategoryKey && focusedCategoryKey.length
                ? focusedCategoryKey === category.categoryId
                : activeCategoryKey === category.categoryId;
        return (
            <div
                className={`sc-mcd__filter__item ${isActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
                onClick={() => handleFilterClick(category.categoryId)}
            >
                <FilterItemIcon categoryId={category.categoryId} />
                {t.translate(category.categoryName)}
            </div>
        );
    }
);

const FilterPanel = ({
    filteredItems,
    handleFilterClick,
    focusedCategoryKey,
    activeCategoryKey,
    isSearching,
}: TFilterPanelProps) => (
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

export default observer(FilterPanel);
