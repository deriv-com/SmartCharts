import React from 'react';
import { connect } from '../store/Connect';

const ComparisonList = ({
    comparisonSymbols,
    animatedPrices,
    onDeleteItem,
}) => {
    return (
        <div className="cq-comparison">
            {comparisonSymbols.map((item, i) => {
                const AnimatedPrice = animatedPrices[i];
                return (
                    <div key={`compare-${i}`} className="cq-comparison-item">
                        <span className="left">
                            <span className="cq-comparison-swatch" style={{backgroundColor: item.color}} />
                            <span className="cq-comparison-label">{item.symbolObject.name}</span>
                        </span>
                        <span className="right">
                            <span className={`cq-comparison-loader ${item.price ? '' : 'stx-show'}`} />
                            <AnimatedPrice />
                            <span className="ciq-close" onClick={() => onDeleteItem(item.symbolObject)}/>
                        </span>
                    </div>);
            })}
        </div>
    );
};

export default connect(
    ({ comparisonList: c }) => ({
        comparisonSymbols: c.comparisonSymbols,
        animatedPrices: c.animatedPrices,
        onDeleteItem: c.onDeleteItem,
    })
)(ComparisonList);
