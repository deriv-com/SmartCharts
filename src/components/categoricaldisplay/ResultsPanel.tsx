import React from 'react';
import classNames from 'classnames';
import { ArrowIcon, CategoryIconMap } from '../Icons';
import { stringToSlug } from '../../utils';
import { TCategorizedSymbolItem, TCategorizedSymbols, TSubCategory} from '../../binaryapi/ActiveSymbols';
import { TReactComponent } from '../../store/Connect';

export type TResultsPanelProps = {
    filteredItems: TCategorizedSymbols;
    onSelectItem?: (item: TCategorizedSymbolItem<TSubCategory | string>) => void;
    getItemType: (categoryId: string) => TReactComponent<{ activeOptions: any[] | undefined; favoritesId: string; }> | TReactComponent<{ favoritesId: string; }>;
    setCategoryElement: (element: HTMLElement | null, id: string) => void;
    activeHeadKey: null | string;
    disableAll?: boolean;
    isNestedList?: boolean;
    handleTitleClick: (categoryId: string) => void;
};

function getItemCount(category: TCategorizedSymbolItem<TSubCategory>) {
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

const EmptyCategory = React.memo(({ category }: any) => (
    <div className='sc-mcd__category__content'>
        <div className='empty-category'>{t.translate(category.emptyDescription)}</div>
    </div>
));

const CategoryTitleLeft = React.memo(({ isNestedList, category }: any) => {
    const CategoryIcon = CategoryIconMap[category.categoryId as keyof typeof CategoryIconMap];
    return (
        <span className='category-title-left'>
            {isNestedList ? CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} /> : ''}
            {t.translate(category.categoryName)}
        </span>
    );
});

const CategoryTitle = ({ category, activeHeadKey, isNestedList, handleTitleClick }: any) => (
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
}: any) => (
    <div
        className={classNames('sc-mcd__category', `sc-mcd__category--${category.categoryId}`, {
            'sc-mcd__category--has-subtitle': category.categorySubtitle,
            'sc-mcd__category--active': category.active,
        })}
        ref={(el: any) => setCategoryElement(el, category.categoryId)}
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
                  (subcategory: any) =>
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
                              {subcategory.data.map((item: any) => (
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
                      {category.data.map((item: any, idx: any) => (
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

export const ResultsPanel: React.FC<TResultsPanelProps> = ({
    filteredItems,
    onSelectItem,
    getItemType,
    setCategoryElement,
    activeHeadKey,
    disableAll,
    isNestedList,
    handleTitleClick,
}) => (
    <>
        {filteredItems.map((category: TCategorizedSymbolItem<TSubCategory>) => {
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
        })}
    </>
);
