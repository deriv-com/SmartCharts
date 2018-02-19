import $ from 'jquery';
import CIQ from 'chartiq';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import Menu from './Menu.jsx';
import { connect } from '../store/Connect';

const Comparison = ({
    filteredSymbols,
    open,
    setOpen,
    onSelectItem,
}) => {
    return (
        <Menu
            className="cq-comparison-new cq-categorical-display"
            isOpened={open}
            setOpen={setOpen}
            onOpen={() => this.comparisonInput.focus()}
            menuBtn={
                <span className="ciq-icon ciq-ic-comparison" />
            }
        >
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
                        placeholder=""
                    />
                </div>
                { filteredSymbols.map((category, i) =>
                    <div key={i} className="cq-filter">{category.categoryName}</div>
                )}
            </div>
            <cq-scroll>
                { filteredSymbols.map((category, i) =>
                    <React.Fragment key={i}>
                        <div className="category-title" id={`category-${category.categoryName}`.replace(/ /g, '')}>{category.categoryName}</div>
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
            </cq-scroll>
        </Menu>
    );
};

export default connect(
    ({ comparison: c }) => ({
        filteredSymbols: c.filteredSymbols,
        open: c.open,
        setOpen: c.setOpen,
        onSelectItem: c.onSelectItem
    })
)(Comparison);
