import $ from 'jquery';
import CIQ from 'chartiq';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';

const Comparison = ({
    filteredSymbols,
    isOpened,
    setOpen,
    onSelectItem,
}) => {
    return (
        <Menu
            className="cq-comparison-new cq-categorical-display"
            isOpened={isOpened}
            setOpen={setOpen}
            onOpen={() => this.comparisonInput.focus()}
        >
            <Menu.Title>
                <span className="ciq-icon ciq-ic-comparison" />
            </Menu.Title>
            <Menu.Body>
                <div className="cq-lookup-filters">
                    <div className="cq-lookup-input">
                        <input
                            ref={(input) => { this.comparisonInput = input; }}
                            onClick={() => this.comparisonInput.focus()}
                            id="symbol"
                            cq-focus=""
                            type="text"
                            spellCheck="off"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            name="symbol"
                            placeholder={'"AUD/JPY" or "Apple"'}
                        />
                    </div>
                    { filteredSymbols.map((category, i) =>
                        <div key={i}
                            className="cq-filter cq-item"
                            onClick={() => document.getElementById(`category-${category.categoryId}`).scrollIntoView()}
                        >
                            {category.categoryName}
                        </div>
                    )}
                </div>
                <cq-scroll>
                    <div className="filtered-symbols">
                        { filteredSymbols.map((category, i) =>
                            <React.Fragment key={i}>
                                <div className="category-title" id={`category-${category.categoryId}`}>{category.categoryName}</div>
                                <div className="category">
                                    { category.data.map((subcategory, j) =>
                                        <React.Fragment key={j}>
                                            <div className="subcategory">{subcategory.subcategoryName}</div>
                                            { subcategory.data.map((item, k) =>
                                                <div className="cq-item" onClick={() => onSelectItem(item.symbolObj)} key={k}>{item.display}</div>
                                            )}
                                        </React.Fragment>
                                    )}
                                </div>
                            </React.Fragment>
                        ) }
                    </div>
                </cq-scroll>
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        filteredSymbols: c.filteredSymbols,
        isOpened: c.isOpened,
        setOpen: c.setOpen,
        onSelectItem: c.onSelectItem
    })
)(Comparison);
