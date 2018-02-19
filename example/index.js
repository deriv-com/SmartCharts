import BinaryChartiq from '../dist/binarychartiq';


// TODO: addNewChart will need to support multiple charts
const bchart = BinaryChartiq.addNewChart({
    selector: '#root',
});

bchart.connectionManager.send({
    active_symbols: 'brief',
    product_type: 'basic',
}).then((data) => {
    bchart.symbols = data;
});

window.chart = bchart;
