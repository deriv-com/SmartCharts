import React, { Component, Fragment } from 'react';
import CategoricalDisplay from './CategoricalDisplay.jsx';
import { connect } from '../store/Connect';

const SymbolsCategoricalDisplay = ({
    categorizedSymbols,
    ...props
}) => {
    return (
        <CategoricalDisplay
            {...props}
            categorizedItems={categorizedSymbols}
            placeholderText={'"AUD/JPY" or "Apple"'}
        />
    );
};

SymbolsCategoricalDisplay.connectBy = selector => {
    const Connected = connect(
        (stores) => {
            const s = selector(stores);
            return {
                categorizedSymbols: s.categorizedSymbols,
                ...s,
            };
        }
    )(SymbolsCategoricalDisplay);
    return Connected;
}

export default SymbolsCategoricalDisplay;

