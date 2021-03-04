// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Icons.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import { ArrowIcon, CategoryIconMap } from '../Icons.jsx';
import { stringToSlug } from '../../utils';

function getItemCount(category: any) {
    let count = 0;
    if (category.hasSubcategory) {
        for (const sub of category.data) {
            count += sub.data.length;
        }
    } else {
        count += category.data.length;
    }

    return count;
}

const EmptyCategory = React.memo(({
    category,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-mcd__category__content'>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='empty-category'>{t.translate(category.emptyDescription)}</div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
));

const CategoryTitleLeft = React.memo(({
    isNestedList,
    category,
}: any) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className='category-title-left'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {isNestedList ? CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} /> : ''}
            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
            {t.translate(category.categoryName)}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </span>
    );
});

const CategoryTitle = ({
    category,
    activeHeadKey,
    isNestedList,
    handleTitleClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div
        className={classNames('sc-mcd__category__head', {
            'has-subtitle': category.categorySubtitle,
            active: category.active,
        })}
        onClick={() => handleTitleClick(category.categoryId)}
    >
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <CategoryTitleLeft isNestedList={isNestedList} category={category} />
        {((category.categoryNamePostfixShowIfActive && activeHeadKey === category.categoryId) ||
            !category.categoryNamePostfixShowIfActive) &&
            category.categoryNamePostfix && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <span className='category-name-postfix'>{category.categoryNamePostfix}</span>
            )}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        {category.categorySubtitle && <div className='category-subtitle'>{t.translate(category.categorySubtitle)}</div>}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {isNestedList ? <ArrowIcon className='arrow' /> : ''}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const Category = ({
    category,
    categoryItemCount,
    Item,
    setCategoryElement,
    onSelectItem,
    activeHeadKey,
    disableAll,
    isNestedList,
    handleTitleClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div
        className={classNames('sc-mcd__category', `sc-mcd__category--${category.categoryId}`, {
            'sc-mcd__category--has-subtitle': category.categorySubtitle,
            'sc-mcd__category--active': category.active,
        })}
        ref={(el: any) => setCategoryElement(el, category.categoryId)}
    >
        {(isNestedList || !category.hasSubcategory) && (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <CategoryTitle
                category={category}
                activeHeadKey={activeHeadKey}
                isNestedList={isNestedList}
                handleTitleClick={handleTitleClick}
            />
        )}
        {category.hasSubcategory
            ? category.data.map(
                  (subcategory: any) => getItemCount(subcategory) > 0 && (
                      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                      <div
                          className={classNames(
                              'sc-mcd__category__content',
                              `sc-mcd__category__content--${stringToSlug(subcategory.subcategoryName)}`,
                              'sc-mcd__category__content--has-subcategory'
                          )}
                          key={subcategory.subcategoryName}
                      >
                          {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                          <div className='subcategory'>{t.translate(subcategory.subcategoryName)}</div>
                          {subcategory.data.map((item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Item
                              key={item.display}
                              item={item}
                              onSelectItem={onSelectItem}
                              disableAll={disableAll}
/>
))}
                      {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                      </div>
                  )
              )
            : category.data.length > 0 && (
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <div className='sc-mcd__category__content'>
                      {category.data.map((item: any, idx: any) => (
                          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                          <Item
                              key={`${item.display}-${idx}`} // eslint-disable-line react/no-array-index-key
                              item={item}
                              onSelectItem={onSelectItem}
                              disableAll={disableAll}
                          />
                      ))}
                  {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                  </div>
              )}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {categoryItemCount === 0 && category.emptyDescription && <EmptyCategory category={category} />}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export const ResultsPanel = ({
    filteredItems,
    onSelectItem,
    getItemType,
    setCategoryElement,
    activeHeadKey,
    disableAll,
    isNestedList,
    handleTitleClick,
}: any) =>
    filteredItems.map((category: any) => {
        const categoryItemCount = getItemCount(category);
        return (
            (categoryItemCount > 0 || category.emptyDescription) && (
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Category
                    key={category.categoryId}
                    Item={getItemType(category.categoryId)}
                    category={category}
                    categoryItemCount={categoryItemCount}
                    setCategoryElement={setCategoryElement}
                    onSelectItem={onSelectItem}
                    activeHeadKey={activeHeadKey}
                    disableAll={disableAll}
                    isNestedList={isNestedList}
                    handleTitleClick={handleTitleClick}
                />
            )
        );
    });
