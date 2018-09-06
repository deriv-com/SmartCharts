import React from 'react';
import { connect } from '../store/Connect';
import { DeleteIcon } from './Icons.jsx';
import '../../sass/components/_comparison-list.scss';

const ComparisonList = ({
    comparisonSymbols,
    animatedPrices,
    onDeleteItem,
}) => (
    <div className="cq-comparison">
        {comparisonSymbols.map((item, i) => {
            const AnimatedPrice = animatedPrices[i];
            if (!AnimatedPrice) { return null; }
            return (
                <div key={item.symbolObject.symbol} className="cq-comparison-item">
                    <span className="left">
                        <span className="cq-comparison-swatch" style={{ backgroundColor: item.color }} />
                        <span className="cq-comparison-label">{item.symbolObject.name}</span>
                    </span>
                    <span className="right">
                        <AnimatedPrice />
                        <DeleteIcon className="ciq-close" onClick={() => onDeleteItem(item.symbolObject)} />
                    </span>
                </div>);
        })}
    </div>
);

export default connect(({ comparisonList: c }) => ({
    comparisonSymbols: c.comparisonSymbols,
    animatedPrices: c.animatedPrices,
    onDeleteItem: c.onDeleteItem,
}))(ComparisonList);
