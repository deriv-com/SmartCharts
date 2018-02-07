/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';

import '../sass/demo.scss';

import BinaryChartiq from './BinaryChartiq.js';

// TODO: addNewChart will need to support multiple charts
window.chart = BinaryChartiq.addNewChart({
    selector: '#root',
});
