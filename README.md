# BinaryChartIQ

Binary.com charting library based on chartiq.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the project
- use `yarn analyze` to run webpack-bundle-analyzer
- use `yarn gh-pages` to deploy demo to gh-pages

## Quick Start

```js
const chart = BinaryChartiq.addNewChart({
    selector: '#mychart',
    symbols: active_symbols // https://developers.binary.com/api/#active_symbols
});

const stxx = chart.getChartEngine(); // Access the ChartIQ chart engine
chart.symbols = active_symbols; // You can set symbols later
```

## API Documentation

### Barrier Class
```js
const barrier = chart.barrier;

barrier.barrierColor = BarrierStore.BARRIER_COLOR_RED;    // use either BarrierStore.BARRIER_COLOR_RED or BarrierStore.BARRIER_COLOR_GREEN
barrier.visible = true;
barrier.high_barrier = 9000;                   // set price of high barrier
barrier.low_barrier = 8900;
barrier.relative = true; // tweak absolute and relative barrier from here
barrier.shadeState = BarrierStore.SHADE_BETWEEN; // use one of 6 presets in BarrierStore.SHADE_*
barrier.draggable = true;                   // choose whether user can interact with barriers

barrier.onBarrierChanged(({high_barrier, low_barrier}) => {
    // ...do something with barrier changes
});

```

### DateLine Class

```js
const dl = new DateLine({
    stx       : stx,        // chart instance
    epoch     : 1516765840, // defaults to current datetime           
    visible   : false,      // optional, defaults to true   
});

dl.followsCurrentQuote = true; // if enabled, date line follows the current datetime
dl.epoch = 1516765840; // get/set epoch (not used if followsCurrentQuote is true).
dl.visible = true;     // show/hide DateLine

```

The API for `TradeStartLine` and `TradeEndLine` is the same as `DateLine`:

![](https://bruceoutdoors.files.wordpress.com/2018/01/screen-shot-2018-01-25-at-5-07-39-pm.png)

