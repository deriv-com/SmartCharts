import React from 'react';
import classNames from 'classnames';
import { ArrowIcon, CategoryIconMap } from '../Icons.jsx';
import { stringToSlug } from '../../utils';

function getItemCount(category) {
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

const EmptyCategory = React.memo(({ category }) => (
    <div className='sc-mcd__category__content'>
        <div className='empty-category'>{t.translate(category.emptyDescription)}</div>
    </div>
));

const CategoryTitleLeft = React.memo(({ isNestedList, category }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];
    return (
        <span className='category-title-left'>
            {isNestedList ? CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} /> : ''}
            {t.translate(category.categoryName)}
        </span>
    );
});

const CategoryTitle = ({ category, activeHeadKey, isNestedList, handleTitleClick }) => (
    <div
        className={classNames('sc-mcd__category__head', {
            'has-subtitle': category.categorySubtitle,
            active: category.active,
        })}
        onClick={() => handleTitleClick(category.categoryId)}
    >
        <CategoryTitleLeft isNestedList={isNestedList} category={category} />
        {((category.categoryNamePostfixShowIfActive && activeHeadKey === category.categoryId) ||
            !category.categoryNamePostfixShowIfActive) &&
            category.categoryNamePostfix && (
                <span className='category-name-postfix'>{category.categoryNamePostfix}</span>
            )}
        {category.categorySubtitle && <div className='category-subtitle'>{t.translate(category.categorySubtitle)}</div>}
        {isNestedList ? <ArrowIcon className='arrow' /> : ''}
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
}) => (
    <div
        className={classNames('sc-mcd__category', `sc-mcd__category--${category.categoryId}`, {
            'sc-mcd__category--has-subtitle': category.categorySubtitle,
            'sc-mcd__category--active': category.active,
        })}
        ref={el => setCategoryElement(el, category.categoryId)}
    >
        {(isNestedList || !category.hasSubcategory) && (
            <CategoryTitle
                category={category}
                activeHeadKey={activeHeadKey}
                isNestedList={isNestedList}
                handleTitleClick={handleTitleClick}
            />
        )}
        {category.hasSubcategory
            ? category.data.map(
                  subcategory =>
                      getItemCount(subcategory) > 0 && (
                          <div
                              className={classNames(
                                  'sc-mcd__category__content',
                                  `sc-mcd__category__content--${stringToSlug(subcategory.subcategoryName)}`,
                                  'sc-mcd__category__content--has-subcategory'
                              )}
                              key={subcategory.subcategoryName}
                          >
                              <div className='subcategory'>{t.translate(subcategory.subcategoryName)}</div>
                              {subcategory.data.map(item => (
                                  <Item
                                      key={item.display}
                                      item={item}
                                      onSelectItem={onSelectItem}
                                      disableAll={disableAll}
                                  />
                              ))}
                          </div>
                      )
              )
            : category.data.length > 0 && (
                  <div className='sc-mcd__category__content'>
                      {category.data.map((item, idx) => (
                          <Item
                              key={`${item.display}-${idx}`} // eslint-disable-line react/no-array-index-key
                              item={item}
                              onSelectItem={onSelectItem}
                              disableAll={disableAll}
                          />
                      ))}
                  </div>
              )}
        {categoryItemCount === 0 && category.emptyDescription && <EmptyCategory category={category} />}
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
}) =>
    filteredItems.map(category => {
        const categoryItemCount = getItemCount(category);
        return (
            (categoryItemCount > 0 || category.emptyDescription) && (
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
