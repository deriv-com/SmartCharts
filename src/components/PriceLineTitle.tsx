import React from 'react';

type TPriceLineTitleProps = {
    color: React.CSSProperties['color'];
    opacity: React.CSSProperties['opacity'];
    title: string;
    yAxiswidth: number;
};

const PriceLineTitle = ({ color, yAxiswidth, title, opacity }: TPriceLineTitleProps) => (
    <div className='title-wrapper' style={{ color, right: yAxiswidth, opacity }}>
        <span className='title'>{title}</span>
    </div>
);

export default PriceLineTitle;
