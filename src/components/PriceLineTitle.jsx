import React                   from 'react';

const PriceLineTitle = ({
    color,
    yAxiswidth,
    title,
    opacity,
}) => (
    <div className="title-wrapper" style={{ color, right: yAxiswidth, opacity }}>
        <span className="title">{title}</span>
    </div>
);

export default PriceLineTitle;
