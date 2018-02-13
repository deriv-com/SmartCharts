/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';

import '../sass/demo.scss';

import BinaryChartiq from './BinaryChartiq.jsx';
import Chart from './components/Chart.jsx';


// TODO: addNewChart will need to support multiple charts
const bchart = BinaryChartiq.addNewChart({
    selector: '#root',
});

Chart.getConnectionManager().send({
    active_symbols: 'brief',
    product_type: 'basic',
}).then((data) => {
    bchart.symbols = data;
});

window.chart = bchart;
