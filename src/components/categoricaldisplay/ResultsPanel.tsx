import React from 'react';
import classNames from 'classnames';
import { ArrowIcon, CategoryIconMap, InfoCircleIcon } from '../Icons';
import { stringToSlug } from '../../utils';
import {
    TCategorizedSymbolItem,
    TCategorizedSymbols,
    TProcessedSymbolItem,
    TSubCategory,
    TSubCategoryData,
    TSubCategoryDataItem,
} from '../../binaryapi/ActiveSymbols';
import { TNormalItemProps } from './Item';
import { useStores } from 'src/store';

export type TResultsPanelProps = {
    filteredItems: TCategorizedSymbols;
    onSelectItem?: (item: TProcessedSymbolItem) => void;
    ItemType: (props: TNormalItemProps) => React.ReactElement | null;
    setCategoryElement: (element: HTMLElement | null, id: string) => void;
    activeHeadKey: null | string;
    disableAll?: boolean;
    isNestedList?: boolean;
    handleTitleClick: (categoryId: string) => void;
    favoritesId: string;
};

export type TCategoryProps = {
    handleTitleClick: TResultsPanelProps['handleTitleClick'];
    hasSubgroup?: boolean;
    disableAll: TResultsPanelProps['disableAll'];
    isNestedList: TResultsPanelProps['isNestedList'];
    activeHeadKey: TResultsPanelProps['activeHeadKey'];
    onSelectItem: TResultsPanelProps['onSelectItem'];
    categoryItemCount: number;
    setCategoryElement: TResultsPanelProps['setCategoryElement'];
    ItemType: TResultsPanelProps['ItemType'];
    category: TCategorizedSymbolItem<TSubCategory | TSubCategoryDataItem>;
    favoritesId: string;
};

type TEmptyCategoryProps = {
    category: TCategoryProps['category'];
};

type TCategoryTitleLeftProps = {
    isNestedList: boolean;
    category: TCategoryProps['category'];
};

type TCategoryTitleProps = {
    isNestedList: boolean;
    category: TCategoryProps['category'];
    handleTitleClick: TCategoryProps['handleTitleClick'];
    hasSubgroup?: boolean;
    activeHeadKey: TCategoryProps['activeHeadKey'];
};

function getItemCount(category: TSubCategory | TCategorizedSymbolItem) {
    let count = 0;
    if ('categoryName' in category && category.hasSubgroup) {
        category.subgroups.forEach(subgroup => {
            for (const sub of subgroup.data) {
                count += sub.data.length;
            }
        });
    } else if ('categoryName' in category && category.hasSubcategory) {
        for (const sub of category.data) {
            count += sub.data.length;
        }
    } else {
        count += category.data.length;
    }

    return count;
}

const EmptyCategory = React.memo(({ category }: TEmptyCategoryProps) => (
    <div className='sc-mcd__category__content'>
        <div className='empty-category'>{t.translate(category.emptyDescription)}</div>
    </div>
));

const CategoryTitleLeft = React.memo(({ isNestedList, category }: TCategoryTitleLeftProps) => {
    const CategoryIcon = CategoryIconMap[category.categoryId as keyof typeof CategoryIconMap];
    return (
        <span className={classNames('category-title-left', {
            'category-title-left__subgroup': !CategoryIcon,
        })}
        >
            {isNestedList && CategoryIcon ? <CategoryIcon className={`ic-${category.categoryId}`} /> : <div className='category-title-left__placeholder' />}
            {t.translate(category.categoryName)}
        </span>
    );
});

const CategoryTitle = ({ category, activeHeadKey, isNestedList, handleTitleClick }: TCategoryTitleProps) => (
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
        {!category.hasSubgroup && isNestedList ? <ArrowIcon className='arrow' /> : ''}
    </div>
);

const ROWsubCategoryMapper: {[key: string]: string} = {
    commodity_basket: 'basket-indices/#options',
    forex_basket: 'basket-indices/#options',
    random_index: 'synthetic/#options',
    crash_index: 'synthetic/#multipliers',
    random_daily: 'synthetic/#options',
    jump_index: 'synthetic/#options',
    step_index: 'synthetic/#multipliers',
    major_pairs: 'forex/#options',
    minor_pairs: 'forex/#options',
    americas_OTC: 'stock/#options',
    asia_oceania_OTC: 'stock/#options',
    europe_OTC: 'stock/#options',
    non_stable_coin: 'cryptocurrencies/#multipliers',
    energy: 'commodities/#options',
    metals: 'commodities/#options',
};

const EUsubCategoryMapper: {[key: string]: string} = {
    random_index: 'synthetic/#multipliers',
    crash_index: 'synthetic/#multipliers',
    major_pairs: 'forex/#multipliers',
    non_stable_coin: 'cryptocurrencies/#multipliers',
};


const redirectLink = (subCategoryId: string, is_eu_client: boolean) => {
    const DEFAULT_LANGUAGE = 'EN';
    const lang_from_url = new URLSearchParams(window.location.search).get('lang')?.toLowerCase() || DEFAULT_LANGUAGE.toLowerCase();
    const add_EU_suffix = is_eu_client ? 'eu.' : '';
    const link_mapper = is_eu_client ? EUsubCategoryMapper[subCategoryId] : ROWsubCategoryMapper[subCategoryId];
    let link;
    if (!link_mapper) {
        if(is_eu_client) {
            link = `https://eu.deriv.com/${lang_from_url}`;
        }else {
            link = `https://deriv.com/${lang_from_url}`;
        }
    } else {
        link = `https://${add_EU_suffix}deriv.com/${lang_from_url}/markets/${link_mapper}/`;
    }


    return link;
};

const RedirectIcon = ({ subcategoryId }: { subcategoryId: string }) => {
    const { state } = useStores();
    const { is_eu_country } = state;
    const derivComLink = redirectLink(subcategoryId, !!is_eu_country);

    return ( 
        <a href={derivComLink} target='_blank' rel='noreferrer'>
            <InfoCircleIcon />
        </a>
    );
};

const Category = ({
    category,
    categoryItemCount,
    ItemType,
    setCategoryElement,
    onSelectItem,
    activeHeadKey,
    disableAll,
    isNestedList,
    handleTitleClick,
    hasSubgroup,
    favoritesId,
}: TCategoryProps) => (
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
                isNestedList={!!isNestedList}
                handleTitleClick={handleTitleClick}
                hasSubgroup={hasSubgroup}
            />
        )}
        {!category.hasSubgroup && category.hasSubcategory
            ? (category.data as TSubCategory[])
                  .filter(subcategory => getItemCount(subcategory) > 0)
                  .map(subcategory => (
                      <div
                          className={classNames(
                              'sc-mcd__category__content',
                              `sc-mcd__category__content--${stringToSlug(subcategory.subcategoryName)}`,
                              'sc-mcd__category--has-subgroup',
                              'sc-mcd__category__content--has-subcategory'
                          )}
                          key={subcategory.subcategoryName}
                      >
                          <div className='subcategory'>
                            {t.translate(subcategory.subcategoryName)}
                            <RedirectIcon subcategoryId={subcategory.subcategoryId} />
                          </div>
                          {subcategory.data.map(item => (
                              <ItemType
                                  key={item.display}
                                  item={item}
                                  onSelectItem={onSelectItem}
                                  disableAll={disableAll}
                                  favoritesId={favoritesId}
                              />
                          ))}
                      </div>
                  ))
            : !category.hasSubgroup && category.data.length > 0 && (
                  <div className='sc-mcd__category__content'>
                      {(category.data as TSubCategoryData).map((item, idx) => (
                          <ItemType
                              key={`${item.display}-${idx}`} // eslint-disable-line react/no-array-index-key
                              item={item}
                              onSelectItem={onSelectItem}
                              disableAll={disableAll}
                              favoritesId={favoritesId}
                          />
                      ))}
                  </div>
              )}
        {categoryItemCount === 0 && category.emptyDescription && <EmptyCategory category={category} />}
    </div>
);

const ResultsPanel = ({
    filteredItems,
    onSelectItem,
    ItemType,
    setCategoryElement,
    activeHeadKey,
    disableAll,
    isNestedList,
    handleTitleClick,
    favoritesId,
}: TResultsPanelProps) => (
    <>
        {filteredItems.map((category: TCategorizedSymbolItem) => {
            const categoryItemCount = getItemCount(category);
            if (!category.hasSubgroup) {
                return (
                    (categoryItemCount > 0 || category.emptyDescription) && (
                        <Category
                            key={category.categoryId}
                            ItemType={ItemType}
                            category={category}
                            categoryItemCount={categoryItemCount}
                            setCategoryElement={setCategoryElement}
                            onSelectItem={onSelectItem}
                            activeHeadKey={activeHeadKey}
                            disableAll={disableAll}
                            isNestedList={isNestedList}
                            handleTitleClick={handleTitleClick}
                            favoritesId={favoritesId}
                        />
                    )
                );
            } 
                return (
                    (categoryItemCount > 0 || category.emptyDescription) && (
                        <React.Fragment key={category.categoryId}>
                            <Category
                                key={category.categoryId}
                                ItemType={ItemType}
                                category={category}
                                categoryItemCount={categoryItemCount}
                                setCategoryElement={setCategoryElement}
                                onSelectItem={onSelectItem}
                                activeHeadKey={activeHeadKey}
                                disableAll={disableAll}
                                isNestedList={isNestedList}
                                handleTitleClick={handleTitleClick}
                                favoritesId={favoritesId}
                            />
                            {
                                category.subgroups?.map((subgroup: TCategorizedSymbolItem) => {
                                    if (getItemCount(subgroup) > 0) {
                                        return (
                                            <Category
                                                key={subgroup.categoryId}
                                                ItemType={ItemType}
                                                category={subgroup}
                                                categoryItemCount={categoryItemCount}
                                                setCategoryElement={setCategoryElement}
                                                onSelectItem={onSelectItem}
                                                activeHeadKey={activeHeadKey}
                                                disableAll={disableAll}
                                                isNestedList={isNestedList}
                                                handleTitleClick={handleTitleClick}
                                                hasSubgroup
                                                favoritesId={favoritesId}
                                            />
                                        );
                                    }
                                })
                            }
                        </React.Fragment>
                    )
                );
            
        })}
    </>
);

export default ResultsPanel;
