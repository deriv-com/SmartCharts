// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Icons.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import { CategoryIconMap } from '../Icons.jsx';

const FilterItemIcon = React.memo(({
    categoryId,
}: any) => {
    const CategoryIcon = CategoryIconMap[categoryId];
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    return CategoryIcon && <CategoryIcon className={`ic-${categoryId}`} />;
});

const FilterItem = React.memo(({
    focusedCategoryKey,
    activeCategoryKey,
    handleFilterClick,
    category,
    isSearching,
}: any) => {
    const isActive =
        focusedCategoryKey && focusedCategoryKey.length
            ? focusedCategoryKey === category.categoryId
            : activeCategoryKey === category.categoryId;
    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div
            className={`sc-mcd__filter__item ${isActive && !isSearching ? 'sc-mcd__filter__item--selected' : ''}`}
            onClick={(e: any) => handleFilterClick(category.categoryId, e)}
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <FilterItemIcon categoryId={category.categoryId} />
            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
            {t.translate(category.categoryName)}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
});

export const FilterPanel = ({
    filteredItems,
    handleFilterClick,
    focusedCategoryKey,
    activeCategoryKey,
    isSearching,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-mcd__filter'>
        {filteredItems.map((category: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<FilterItem
            key={category.categoryId}
            category={category}
            handleFilterClick={handleFilterClick}
            activeCategoryKey={activeCategoryKey}
            focusedCategoryKey={focusedCategoryKey}
            isSearching={isSearching}
/>
))}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);
