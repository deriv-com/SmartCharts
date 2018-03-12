import React, { Component } from 'react';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';

const TopWidgets = () => (
    <div className="cq-top-ui-widgets">
        <ChartTitle />
        <AssetInformation />
        <ComparisonList />
    </div>
);

export default TopWidgets;
