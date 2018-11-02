import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-history.scss';


const ChartHistory = () => (
    <div className="ciq-chart-history" />
);

export default connect(({ chartHistory }) => ({
    onChange: chartHistory.onChange,
}))(ChartHistory);
