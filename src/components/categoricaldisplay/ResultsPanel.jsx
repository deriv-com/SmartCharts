import React from 'react';

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

const CategoryTitleClassName = (categoryId, activeHeadKey, activeHeadTop) => {
    let TitleClassName = '';
    if (activeHeadKey === categoryId) {
        TitleClassName = activeHeadTop < 0 ? 'stikcy-bottom' : 'stikcy-top';
    }

    return `category-title ${TitleClassName}`;
};


const Category = ({ category, Item, setCategoryElement, onSelectItem, activeHeadKey, activeHeadTop, activeHeadOffset }) => (
    <div
        className={`category category-${category.categoryId}`}
        ref={el => setCategoryElement(el, category.categoryId)}
    >
        <div
            className={CategoryTitleClassName(category.categoryId, activeHeadKey, activeHeadTop)}
            style={{ top: (activeHeadKey === category.categoryId) ? activeHeadOffset : null }}
        >{t.translate(category.categoryName)}
        </div>
        { category.hasSubcategory
            ? category.data.map(subcategory => getItemCount(subcategory) > 0 && (
                <div
                    className="category-content"
                    key={subcategory.subcategoryName}
                >
                    <div className="subcategory">{t.translate(subcategory.subcategoryName)}</div>
                    { subcategory.data.map(item => (
                        <Item
                            key={item.display}
                            item={item}
                            onSelectItem={onSelectItem}
                        />
                    ))}
                </div>
            ))
            : category.data.length > 0 && (
                <div className="category-content">
                    {category.data.map(item => (
                        <Item
                            key={item.display}
                            item={item}
                            onSelectItem={onSelectItem}
                        />
                    ))}
                </div>
            )}
        { getItemCount(category) === 0 && category.emptyDescription && (
            <div className="category-content">
                <div className="empty-category">{t.translate(category.emptyDescription)}</div>
            </div>
        )}
    </div>
);

export const ResultsPanel = ({ filteredItems, onSelectItem, getItemType, setCategoryElement, activeHeadKey, activeHeadTop, activeHeadOffset }) => (
    <div className="results-panel">
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
            />
        )) }
    </div>
);
