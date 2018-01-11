# BinaryChartIQ

Binary.com charting library based on chartiq.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the project
- use `yarn analyze` to run webpack-bundle-analyzer
- use `gh-pages` to deploy demo to gh-pages

## Line Class
```js
const line = new Line({
    stx       : stx,              // chart instance
    lineColor : Line.COLOR_RED,   // optional, defaults to Line.COLOR_GREEN
    shadeState: Line.SHADE_BELOW, // optional, defaults to Line.SHADE_NONE
    shadeColor: Line.COLOR_RED,   // optional, defaults to Line.COLOR_GREEN
    price     : null,             // optional, defaults to chartQoute.Close
    visible   : false,            // optional, defaults to true   
    pipSize   : 2,                // number of digits to show for price
});

line.visible = true;                // show the line
line.lineColor = Line.COLOR_GREEN;  // change line color
line.price += 0.3;                  // update the price
line.shadeState = Line.SHADE_ABOVE; // change shade direction

// TODO: To be implemented
line.draggable = true; // false
line.dashStyle = Line.DOTTED; // Line.NORMAL
```
