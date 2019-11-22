import React                   from 'react';

const PriceLineTitle = ({
    color,
    yAxiswidth,
    title,
}) => (
    <div className="title-wrapper" style={{ color, right: yAxiswidth }}>
        <span className="title">{title}</span>
    </div>
);

export default PriceLineTitle;
