import smartcharts from 'smartcharts';
import React from 'react';

// TODO: addNewChart will need to support multiple charts
const bchart = smartcharts.addNewChart({
    selector: '#root',
});

bchart.connectionManager.send({
    active_symbols: 'brief',
    product_type: 'basic',
}).then((data) => {
    bchart.symbols = data;
});

window.chart = bchart;
