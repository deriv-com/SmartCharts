# BinaryChartIQ

Binary.com charting library based on chartiq.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the project
- use `yarn analyze` to run webpack-bundle-analyzer
- use `yarn gh-pages` to deploy demo to gh-pages

## Barrier Class
```js
const barrier = new Barrier({
    stx       : stx,                        // chart instance
    shadeState: Barrier.SHADE_BELOW,        // optional
    shadeColor: 'rgba(140, 193, 118, 0.3)', // optional
    visible   : false,                      // optional, defaults to true   
});

barrier.lineColor = Barrier.LINE_COLOR_RED;    // use either Barrier.LINE_COLOR_RED or Barrier.LINE_COLOR_GREEN
barrier.visible = true;                        // show/hide barrier
barrier.lineColor = Barrier.LINE_COLOR_GREEN;  // change line color
barrier.high_barrier = 9000;                   // set price of high barrier
barrier.low_barrier = 8900;
barrier.relative = true; // tweak absolute and relative barrier from here
barrier.shadeState = Barrier.SHADE_BETWEEN; // use one of 6 presets in Barrier.SHADE_*
barrier.draggable = true;                   // choose whether user can interact with barriers

barrier.onBarrierChanged(({high_barrier, low_barrier}) => {
    // ...do something with barrier changes
});

```

## DateLine Class

Inherited by TradeStart and TradeEnd.

```js
const dl = new DateLine({
    stx       : stx,        // chart instance
    epoch     : 1516765840, // defaults to current datetime           
    visible   : false,      // optional, defaults to true   
});

dl.isFollowNow = true; // if enabled, date line follows the current datetime
dl.epoch = 1516765840; // get/set epoch (not used if isFollowNow is true).
dl.visible = true;     // show/hide DateLine

```
