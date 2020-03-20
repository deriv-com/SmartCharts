import React from 'react';
import { ArrowIcon, CategoryIconMap } from '../Icons.jsx';

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

const EmptyCategory = ({ category }) => (
    getItemCount(category) === 0 && category.emptyDescription && (
        <div className="category-content">
            <div className="empty-category">{t.translate(category.emptyDescription)}</div>
        </div>
    )
);

const CategoryTitleClassName = (categoryId, activeHeadKey, activeHeadTop, categorySubtitle, active) => {
    let TitleClassName = '';
    if (activeHeadKey === categoryId) {
        TitleClassName = activeHeadTop < 0 ? 'sticky-bottom' : 'sticky-top';
    }

    return `category-title ${TitleClassName} ${categorySubtitle ? 'has-subtitle' : ''} ${active ? 'active' : ''}`;
};

const CategoryTitle = ({ category, activeHeadKey, activeHeadTop, activeHeadOffset, isNestedList, handleTitleClick }) => {
    const CategoryIcon = CategoryIconMap[category.categoryId];

    return (
        <div
            className={CategoryTitleClassName(category.categoryId, activeHeadKey, activeHeadTop, category.categorySubtitle, category.active)}
            style={{ top: (activeHeadKey === category.categoryId) ? activeHeadOffset : null }}
            onClick={() => handleTitleClick(category.categoryId)}
        >
            <span className="category-title-left">
                {isNestedList ? (CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />) : ''}
                {t.translate(category.categoryName)}
            </span>
            {
                ((category.categoryNamePostfixShowIfActive && activeHeadKey === category.categoryId)
                    || !category.categoryNamePostfixShowIfActive)
                && category.categoryNamePostfix
                && (
                    <span className="category-name-postfix">
                        {category.categoryNamePostfix}
                    </span>
                )
            }
            {
                category.categorySubtitle && (
                    <div className="category-subtitle">
                        {t.translate(category.categorySubtitle)}
                    </div>
                )
            }
            { isNestedList ? (<ArrowIcon />) : ''}
        </div>
    );
};

const Category = ({ category, Item, setCategoryElement, onSelectItem, activeHeadKey, activeHeadTop, activeHeadOffset, disableAll, isNestedList, handleTitleClick }) => (
    <div
        style={{ height: '392px' }}
        className={`category category-${category.categoryId} ${category.categorySubtitle ? 'category-has-subtitle' : ''} ${category.active ? 'active' : ''}`}
        ref={el => setCategoryElement(el, category.categoryId)}
    >
        <CategoryTitle
            category={category}
            activeHeadKey={activeHeadKey}
            activeHeadTop={activeHeadTop}
            activeHeadOffset={activeHeadOffset}
            isNestedList={isNestedList}
            handleTitleClick={handleTitleClick}
        />
        { category.hasSubcategory
            ? category.data.map(subcategory => getItemCount(subcategory) > 0 && (
                <div
                    className="category-content has-subcategory"
                    key={subcategory.subcategoryName}
                >
                    <div className="subcategory">{t.translate(subcategory.subcategoryName)}</div>
                    { subcategory.data.map(item => (
                        <Item
                            key={item.display}
                            item={item}
                            onSelectItem={onSelectItem}
                            disableAll={disableAll}
                        />
                    ))}
                </div>
            ))
            : category.data.length > 0 && (
                <div className="category-content">
                    {category.data.map((item, idx) => (
                        <Item
                            key={`${item.display}-${idx}`}// eslint-disable-line react/no-array-index-key
                            item={item}
                            onSelectItem={onSelectItem}
                            disableAll={disableAll}
                        />
                    ))}
                </div>
            )}
        <EmptyCategory category={category} />
    </div>
);

export const ResultsPanel = React.memo(({ filteredItems, onSelectItem, getItemType, setCategoryElement, activeHeadKey, activeHeadTop, activeHeadOffset, disableAll, isNestedList, handleTitleClick }) => (
    <div className="results-panel" style={{ height: '392px' }}>
        { filteredItems.map(category => (getItemCount(category) > 0 || category.emptyDescription) && (
            <Category
                key={category.categoryId}
                Item={getItemType(category.categoryId)}
                category={category}
                setCategoryElement={setCategoryElement}
                onSelectItem={onSelectItem}
                activeHeadKey={activeHeadKey}
                activeHeadTop={activeHeadTop}
                activeHeadOffset={activeHeadOffset}
                disableAll={disableAll}
                isNestedList={isNestedList}
                handleTitleClick={handleTitleClick}
            />
        )) }
    </div>
));
