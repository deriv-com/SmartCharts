import React from 'react';
import Chart from './Chart';

const SmartChart = ({ children, ...props }: any) => {
    return <Chart {...props}>{children}</Chart>;
};

export default SmartChart;
