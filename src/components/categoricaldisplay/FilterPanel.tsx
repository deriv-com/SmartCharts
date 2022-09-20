import React from 'react';
import { observer } from 'mobx-react-lite';
import { CategoryIconMap, ArrowIcon } from '../Icons';
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

const FilterGroup = React.memo(
    ({ focusedCategoryKey, activeCategoryKey, handleFilterClick, category, isSearching }: any) => {
        const [isGroupActive, setIsGroupActive] = React.useState(false);
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <>
                <div
                    className={`sc-mcd__filter__item ${isGroupActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FilterItemIcon categoryId={category.categoryId} />
                    {t.translate(category.categoryName)}
                    <ArrowIcon className={`sc-mcd__filter__group-icon ${isOpen && 'sc-mcd__filter__group-icon--open'}`} />
                </div>
                
                <div className={`sc-mcd__filter__subgroups ${isOpen && 'sc-mcd__filter__subgroups--open'}`}>
                    {category.subgroups.map((subgroup: any) => {
                        const isActive =
                            focusedCategoryKey && focusedCategoryKey.length
                                ? focusedCategoryKey === subgroup.categoryId
                                : activeCategoryKey === subgroup.categoryId;
                        if (isActive && !isGroupActive) {
                            setIsGroupActive(true);
                        } else if (isGroupActive) {
                            category.subgroups.filter((el: any) => el.categoryId === focusedCategoryKey).length === 0 && setIsGroupActive(false);
                        }
                        return (
                            <div
                                className={`sc-mcd__filter__subgroups-item ${isGroupActive ? 'sc-mcd__filter__item--active' : ''} ${isActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
                                onClick={() => handleFilterClick(subgroup.categoryId)}
                            >
                                {t.translate(subgroup.categoryName)}
                            </div>
                        )
                    })}
                </div>
            </>
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
        {filteredItems.map((category: TCategorizedSymbolItem) => {
            if (category.hasSubgroup){
                return (
                    <FilterGroup
                        key={category.categoryId}
                        category={category}
                        filteredItems={filteredItems}
                        handleFilterClick={handleFilterClick}
                        activeCategoryKey={activeCategoryKey}
                        focusedCategoryKey={focusedCategoryKey}
                        isSearching={isSearching}
                    />
                )
            }
            return (
            <FilterItem
                key={category.categoryId}
                category={category}
                handleFilterClick={handleFilterClick}
                activeCategoryKey={activeCategoryKey}
                focusedCategoryKey={focusedCategoryKey}
                isSearching={isSearching}
            />
        )})}
    </div>
);

export default observer(FilterPanel);
