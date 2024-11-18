<h1 align="center">
  SmartCharts
</h1>

SmartCharts is both the name of the app ([charts.binary.com](https://charts.binary.com/)) and the charting library.

[![npm](https://img.shields.io/badge/npm->=9-blue)](https://www.npmjs.com/package/@deriv/deriv-charts) ![node](https://img.shields.io/badge/node-%3E%3D18-blue.svg)

## In this document:

-   [Pre-installation](#pre-installation)
-   [Quick start](#quick-start)
-   [Usage](#Usage)
-   [How to contribute](#how-to-contribute)
-   [Manage translations](#manage-translations)
-   [Manage releases](#manage-releases)
-   [FAQ](#faq)

## Pre-installation

Before running or contribute to this project, you need to have the setup of the following packages in your environment:

-   node
-   npm
-   git (for `contribution`)

## Quick start

1.  **Fork the project**

    In order to work on your own version of the Deriv application, please fork the project to your own repo.

2.  **Clone using SSH**

    ```sh
    git clone git@github.com:deriv-com/SmartCharts.git
    ```

3.  **Enter project directory**

In the `app` folder, we provide a working webpack project that uses the smartcharts library. Simply `cd` to that directory.

4.  **Install your dependencies:**

    ```sh
    npm install
    ```

5.  **To start developing:**

    ```sh
    npm start
    ```

6.  **Open the source code and start editing!**

    The sample app should be running in `http://localhost:8080`.

### Other useful commands:

- use `npm install` to install dependencies
- use `npm start` to launch webpack dev server
- use `npm run build` to build the library
- use `npm run build:app` to build the [charts.binary.com](https://charts.binary.com/) app
- use `npm run analyze` to run webpack-bundle-analyzer
- use `npm run test` to run unit tests
- use `npm run coverage` to see test coverage

> Note: eventhough both `npm run build` and `npm run build:app` outputs `smartcharts.js` and `smartcharts.css`, **they are not the same files**. One outputs a library and the the other outputs an app.

## Usage

You can install the library using one of the following commands:

Using npm:

```bash
$ npm install @deriv/deriv-chart
```

Using yarn:

```bash
$ yarn add @deriv/deriv-chart
```

**Important Note:** the license for the library is tied to the `binary.com` domain name; it will not work in github pages.

You can add the library to your project using the following commands:

    yarn add @deriv/deriv-chart      # Release
    yarn add @deriv/deriv-chart@beta # Beta

You can refer to library usage inside `app/index.jsx`:

```jsx
import { SmartChart } from '@deriv/deriv-chart';

class App extends React.Component {
    render() {
        return (
            <SmartChart
                requestSubscribe={({ tick_history, granularity, ... }, cb) => {}}   // Passes the whole request object
                requestForget={({ tick_history, granularity, ... }, cb) => {}}      // request object and cb is exactly the same reference passed to subscribe
                // for active_symbols, trading_times, ... (NOT streaming)
                requestAPI={({...}) => Promise} // whole request object, shouldn't contain req_id
            />
        );
    }
};
```

SmartCharts expects library user to provide `requestSubscribe`, `requestForget` and `requestAPI`. Refer to [API](#api) for more details.

The job of loading the active symbols or trading times or stream data from cache or retrieving from websocket is therefore NOT the responsibility of SmartCharts but the host application. SmartCharts simply makes the requests and expect a response in return.

Some important notes on your webpack.config.js (refer to `app/webpack.config.js`):

- smartcharts CSS file will need to be copied from the npm library (remember to include in your `index.html`).
- smartcharts consist of a few chunks (which has filenames `*.smartcharts.*`), which it downloads asynchronously during runtime. Therefore, it needs to know where the library user places its chunks via the `setSmartChartsPublicPath` function:

```js
import { setSmartChartsPublicPath } from "@deriv/deriv-chart";

// SmartCharts chunk are deployed to https://mysite.com/dist/*
setSmartChartsPublicPath("/dist/");
```

We can use the `copy-webpack-plugin` webpack plugin to copy over SmartCharts chunks:

```js
new CopyWebpackPlugin([
  { from: "./node_modules/@deriv/deriv-chart/dist/*.smartcharts.*" },
  { from: "./node_modules/@deriv/deriv-chart/dist/smartcharts.css" },
]);
```
### API

> Note: Props will take precedence over values set by the library.

Props marked with `*` are **mandatory**:

| Props                     | Description                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| requestAPI\*              | SmartCharts will make single API calls by passing the request input directly to this method, and expects a `Promise` to be returned.                                                                                                                                                                                                                             |
| requestSubscribe\*        | SmartCharts will make streaming calls via this method. `requestSubscribe` expects 2 parameters `(request, callback) => {}`: the `request` input and a `callback` in which response will be passed to for each time a response is available. Keep track of this `callback` as SmartCharts will pass this to you to forget the subscription (via `requestForget`). |
| requestForget\*           | When SmartCharts no longer needs a subscription (made via `requestSubscribe`), it will call this method (passing in `request` and `callback` passed from `requestSubscribe`) to halt the subscription.                                                                                                                                                           |
| id                        | Uniquely identifies a chart's indicators, symbol and layout; saving them to local storage and loading them when page refresh. If not set, SmartCharts renders a fresh chart with default values on each refresh. Defaults to `undefined`.                                                                                                           |
| getMarketsOrder           | Callback function to set/order the active symbols category. `active_symbols` is passed to the callback and an array of markets is expected in return. Allowed values are `forex`, `basket_index`, `indices`, `stocks`, `commodities`, `synthetic_index` and `cryptocurrency`. Defaults to `undefined`                                                                                                 |
| getIndicatorHeightRatio           | Callback function to set/order the height of the active indicators that attach to the bottom of the chart. The chart pass two parameters, `chart_height` and `indicator_count` and the callback should return an object that contains two parameters, `height` and `percent` which `height` present the height of each indicator in pixel and the `percent` present the percentage of height compare to chart height. Example:  `getIndicatorHeightRatio: (chart_height, indicator_count) => ({height, percent})` . Defaults to `undefined`                                                                                       |
| symbol                    | Sets the main chart symbol. Defaults to `R_100`. Refer [Props vs UI](#props-vs-ui) for usage details.                                                                                                                                                                                                                                                            |
| initialData               | Set initial data that the library requires for booting up. Refer [initialData](#initial-data) for usage details.                                                                                                                                                                                                                                                      |
| feedCall                  | Enable/Disable the feed call for getting requirement resources. Default is `{activeSymbols: true,tradingTimes: true}`                                                                                                                                                                                                                                             |
| granularity               | Sets the granularity of the chart. Allowed values are 60, 120, 180, 300, 600, 900, 1800, 3600, 7200, 14400, 28800, 86400. Defaults to 0. Refer [Props vs UI](#props-vs-ui) for usage details.                                                                                                                                                                    |
| chartType                 | Sets the chartType. Choose between `mountain` (Line), `line` (Dot), `colored_line` (Colored Dot), `spline`, `baseline`, `candle`, `colored_bar` (OHLC), `hollow_candle`, `heikinashi`, `kagi`, `linebreak`, `renko`, `rangebars`, and `pandf` (Point & Figure). Defaults to `mountain`. Refer [Props vs UI](#props-vs-ui) for usage details.                     |
| contractInfo                 | An object of `ProposalOpenContract` type. Includes data of a contract for which ticks are currently being drawn. Includes such data as `tick_stream` array, `tick_count` number, `underlying` string, etc. Required for `shouldDrawTicksFromContractInfo` prop to work. Defaults to an `{}` empty object.                   |
| startEpoch                | Set the start epoch of the chart                                                                                                                                                                                                                                                                                                                                 |
| endEpoch                  | Set the end epoch of the chart                                                                                                                                                                                                                                                                                                                                   |
| chartControlsWidgets      | Render function for chart control widgets. Set to `null` if you want to hide chart controls. Refer to [Customising Components](#customising-components).                                                                                                                                                                                                         |
| topWidgets                | Render function for top widgets. Refer to [Customising Components](#customising-components).                                                                                                                                                                                                                                                                     |
| bottomWidgets             | Render function for bottom widgets. Refer to [Customising Components](#customising-components).                                                                                                                                                                                                                                                                  |
| toolbarWidget             | Render function for floating toolbar widgets. Refer to [Customising Components](#customising-components).                                                                                                                                                                                                                                                        |
| isMobile                  | Switch between mobile or desktop view. Defaults to `false`.                                                                                                                                                                                                                                                                                                      |
| onSettingsChange          | Callback that will be fired each time a setting is changed.                                                                                                                                                                                                                                                                                                      |
| stateChangeListener       | Callback that will be fired on chart state change, It will return two parameters `(state, option)`. An state, and an option that is related to desire state. Chart has three states that are: `INITIAL` , `READY` and `SCROLL_TO_LEFT`.                                                                                                                          |
| settings                  | Sets the chart settings. Refer to [Chart Settings](#chart-settings)                                                                                                                                                                                                                                                                                              |
| barriers                  | Draw chart barriers. Refer to [Barriers API](#barriers-api) for usage details                                                                                                                                                                                                                                                                                    |
| enableRouting             | Enable routing for dialogs. Defaults to `false`                                                                                                                                                                                                                                                                                                                  |
| isConnectionOpened        | Sets the connection status. If set, upon reconnection smartcharts will either patch missing tick data or refresh the chart, depending on granularity; if not set, it is assumed that connection is always opened. Defaults to `undefined`.                                                                                                                       |
| onMessage                 | SmartCharts will send notifications via this callback, should it be provided. Each notification will have the following structure: `{ text, type, category }`.                                                                                                                                                                                                   |
| isAnimationEnabled        | Determine whether chart animation is enabled or disabled. It may needs to be disabled for better performance. Defaults to `true`.                                                                                                                                                                                                                                |
| isVerticalScrollEnabled   | Determine whether verticall scroll on the chart outside Y-axis is disabled while it is forced on the nearest scrollable parent instead. It may need to be disabled for mobile app version to scroll the page up or down instead of the chart. In this case, when scroll delta exceeds 10px, the page will be force-scrolled fully in a respective direction. Defaults to `true`.                                                                                                                                                                                                                                |
| showLastDigitStats        | Shows last digits stats. Defaults to `false`.                                                                                                                                                                                                                                                                                                                    |
| scrollToEpoch             | Scrolls the chart to the leftmost side and sets the last spot/bar as the first visible spot/bar in the chart. Also, it disables scrolling until the chart reaches the 3/4 of the width of the main pane of the chart. Defaults to `null`.                                                                                                                        |
                                                         |
| clearChart                | Clear the chart.                                                                                                                                                                                                                                                                                                                                                 |
| onExportLayout            | Export the layout and send it back using this callback.                                                                                                                                                                                                                                                                                                          |
| importedLayout            | The layout to be imported to chart. It should be the layout that was exported in onExportLayout;                                                                                                                                                                                                                                                                 |
| shouldDrawTicksFromContractInfo         | Determine whether SmartCharts should draw ticks on the chart based on `contractInfo` object, which contains data from `proposal_open_contract` API response, instead of ticks from `ticks_history` API response. Should be used together with `contractInfo` prop described above, otherwise `ticks_history` API response will be used for drawing ticks as usual. Defaults to `false`.                                                                                                                                                                                                                                                   |
| shouldFetchTradingTimes   | Determine whether an API call for fetching trading times is necessary for the new chart or not. Defaults to `true`                                                                                                                                                                                                                                                   |
| should_zoom_out_on_yaxis  | Forces y-axis to zoom out. Overrides `top` and `bottom` values of `yAxisMargin` prop. Defaults to `undefined`.                                                                                                                                                                                                                                                   |
| shouldFetchTickHistory    | Determine whether an API call for fetching tick history is necessary for the new chart or not. Defaults to `true`                                                                                                                                                                                                                                                   |
| allTicks                  | Provides all_ticks contract data for chart rendering when contract with duration = 'ticks' . Defaults to `undefined`                                                                                                                                                                                                                                              |
| maxTick                   | Set the max number of first points/candles in the visible chart area. The value should be number greater than zero. Defaults to `undefined`                                                                                                                                                                                                                      |
| crosshair                 | Set state of Crosshair Component. Allowed values are undefined, 0,1,2. Defaults to `undefined`                                                                                                                                                                                                                                                                   |
| crosshairTooltipLeftAllow | Set max left position which chart allow to render left side tooltip of crosshair, if mouse position before this size, the crosshair tooltip move to right side of mouse, if set `null` then chart specify `315px` as default value. Defaults to `null`                                                                                                           |
| zoom                      | Zoom in and Zoom out the chart. the value should be `1` or `-1`. If the value is `1` the chart will be zoomed in, and if the value is `-1` it zoomed out.                                                                                                                                                                                                        |
| yAxisMargin               | Set the margins of chart yAxis. It's an object that takes two parameters, `bottom` for margin bottom of chart, and `top` for the top margin of chart.                                                                                                                                                                                                            |
| enableScroll              | Enable/disable scroll feature in chart. Scroll gets disable on chart scale `1:1` and enable whenever user zoom in/out. This property override that feature . Defaults to `true`                                                                                                                                                                                  |
| enableZoom                | Enable/disable zoom feature in chart. Defaults to `true`                                                                                                                                                                                                                                                                                                         |

### Chart Settings

| Attribute                    | Description                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| countdown                    | Show Countdown. Defaults to `false`.                                                                                                  |
| theme                        | Sets the chart theme. themes are (`dark\|light`), and default is `light`.                                                             |
| lang                         | Sets the language. Defaults to `en`.                                                                                                  |
| minimumLeftBars              | The default number of bars to display on the chart. It's used in combination with `whitespace` setting in order to adjust white space width. Please refer to `whitespace` below for more details. Defaults to `undefined`.                                                                                                  |
| position                     | Sets the position of the chart controls. Choose between `left` and `bottom`. In mobile this is always `bottom`. Defaults to `bottom`. |
| enabledNavigationWidget      | Show or hide navigation widget. Defaults to `false`                                                                                   |
| isHighestLowestMarkerEnabled | Show or hide the highest and lowest tick on the chart. Defaults to `false`.                                                           |
| whitespace                    | The default width of whitespace between the right edge of the chart and the y-axis. It should be used in combination with `minimumLeftBars` setting value. For more details, please refer to stxx.preferences.whitespace in CIQ documentation. Defaults to `undefined`.                                                                                                  |

#### InitialData

Initial data property designed to pass prepared chart data in case you don't want to wait for Feed data or if you simply want to make the chart render quicker on its initial load. It gets the properties below and all of them are optional, so if you pass the data, the chart will use that data, but if you pass `null` instead, the chart will default to the Feed call and get the data from API.
**notice:** these data are only use for initialing sequence and after that, chart request on Feed to get data.
| Attribute | Description | Sample Data |
| --- | --- | --- |
| activeSymbols | An array of active symbols (available markets) is used to load the market selector. Default is `null`. This value would update in the chart is user toggle property of `refreshActiveSymbols` that cause the chart to request for activeSymbols on the Feed | `[{ allow_forward_starting: 0, display_name: 'AUD Basket', exchange_is_open: 1, is_trading_suspended: 0, market: 'basket_index', market_display_name: 'Basket Indices', pip: 0.001, submarket: 'forex_basket', submarket_display_name: 'Forex Basket', symbol: 'WLDAUD', symbol_type: 'forex_basket' }, ...]`
|tradingTimes | An array of markets trading time is used to determine close/open markets. Default is `null`. The chart will request new data via Feed in a sequence that is calculated regards markets trading time. | `{trading_times: {markets: [{ name: 'Forex', submarkets: [{ name: 'Major Pairs', symbols: [{name: 'AUD/JPY', symbol: 'frxAUDJPY', times: { close: ['23:59:59'], open: ['00:00:00'], settlement: '23:59:59' }, trading_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],events: [{ dates: 'Fridays', descrip: 'Closes early (at 20:55)' },{ dates: '2020-12-25', descrip: 'Christmas Day' },{ dates: '2021-01-01', descrip: "New Year's Day" }], ...}, ]},...]...],}}`
| masterData | An array of ticks that are used to load the graph (candles). Default is `null`. If the Feed is available, the chart will call `fetchInitialData` via Feed to get the initial ticks, for old data it calls `fetchPaginationData` and receives new ticks constantly. If this property is filled, chart user `symbol` property and `setting` property (to extract chart type and interval) and the masterData to load the graph. **Notice:** chart interval in the setting property should be the same as masterData epoch/Date property. If the symbol property does not fill, the chart uses the `symbol` property that exists in the localStorage with the key of `layout-*`, and if that property also does not fill, the chart throws a console error. **(if the desired symbol does not fill in the `symbol` property or `layout-*` localStorage, it caused the chart to just load the given masterData and does not call for the `fetchInitialData` API)**. | `[{"Date":"2020-11-16T04:28:00", "Close":8287.85}, {"Date":"2020-11-16T04:26:00", "Open":8283.25,"High":8293.750015,"Low":8278.75,"Close":8293.75},...]`

#### Barriers API

`barriers` props accepts an array of barrier configurations:

```jsx
<SmartChart
  barriers={[
    {
      color: "green",
      shade: "above",
      hidePriceLines: false, // default false
      onChange: console.warn.bind(console),
    },
  ]}
/>
```

Attributes marked with `*` are **mandatory**:

| Attribute            | Description                                                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shadeColor           | Barrier shade color. Defaults to `green`.                                                                                                                                          |
| color                | Price line color. Defaults to `#000`.                                                                                                                                              |
| shade                | Shade type; choose between `NONE_SINGLE`, `NONE_DOUBLE`, `ABOVE`, `BELOW`, `OUTSIDE` or `BETWEEN`. Defaults to `NONE_SINGLE`.                                                      |
| hideBarrierLine      | hide/show the barrier line. Can be used to show only the title. Defaults to `false`.                                                                                               |
| hideOffscreenLine    | hide/show the barrier line when it is offscreen. Defaults to `false`.                                                                                                              |
| hideOffscreenBarrier | hide/show the barrier line & title when it is offscreen. Defaults to `false`.                                                                                                      |
| hidePriceLines       | hide/show the price lines. Defaults to `false`.                                                                                                                                    |
| lineStyle            | Sets the style of the price lines; choose between `dotted`, `dashed`, or `solid`. Defaults to `dashed`.                                                                            |
| onChange             | When price of high or low barrier changes (including when switched toggling `relative` or setting `high\|low`), `onChange` will pass the high and low barriers as `{ high, low }`. |
| relative             | Toggle between relative and absolute barriers. Defaults to `false`.                                                                                                                |
| draggable            | Toggles whether users can drag the price lines and change the barrier directly from the chart. Defaults to `true`.                                                                 |
| title                | Title text of the barrier                                                                                                                                                          |
| isSingleBarrier      | Shows only High barrier, stops low barrier & shades from rendering when the flag is true. Defaults to `false`.                                                                     |
| showOffscreenArrows  | hide/show arrows with direction when the barrier is offscreen. Defaults to `false`.                                                                                                |
| opacityOnOverlap     | Sets the opacity of the barrier when it is overlapping with other barrier.                                                                                                         |
| high\*               | Sets the price of the high barrier.                                                                                                                                                |
| low\*                | Sets the price of the low barrier.                                                                                                                                                 |
#### Marker API

Use `FastMarker` to render given components inside the chart.
Markers provide a way for developers to place DOM elements that are positioned based on date, values or tick location inside the chart. Also, please note that this `FastMarker` implementation does not factor the width and height of the marker: this is expensive to calculate, so we expect you to offset this in CSS.
`FastMarker` will keep the marker position on the chart.
It can be imported from `@deriv/deriv-chart` package either as `FastMarker`, or simply as `Marker`.

```jsx
<SmartChart>
  <FastMarker
    markerRef={setRef}
    className="your-css-class"
  >
    <your content here/>
  </FastMarker>
</SmartChart>

```

USAGE:

- `setRef({setPosition, div})` will be called onMount.
- `setRef(null)` will be called when the marker unmounts.
- `div` is the dom element containing the marker with `your-css-class`
  - any content update should be done using `div` and vanilla js
  - use `div.querySelector('...')` to get a dom reference in order to update your content.
  - avoid doning expensive DOM operations on `div` such as style changes.
- `setPosition({epoch, price})` is a function that you will use to update the `div` position.
  - epoch is the tick unix epoch from api
  - price is the tick price, it could be `null` if you want to draw a vertical line.
- call `setPosition({epoch: null, price: null})` to hide the marker.

PROPS:

- `markerRef` (required): pass the `setRef` callback using this property
- `className` (optional): avoid expoensive css transition or keyframe animations on this class.

### Raw Marker API

Get a raw callback with underlying canvas2dcontext.
This component is used to render directly into the chart canvas.

PROPS:

- `epoch_array`: array of epoch values to get coordinates for.
- `draw_callback`: called on every frame with ({ctx, points}).
  - `points` will be an array of [{left, top, epoch}] in pixels.
  - `ctx` is the Context2dDrawingContext

### Customising Components

We offer library users full control on deciding which of the top widgets and chart control buttons to be displayed by overriding the render methods themselves. To do this you pass in a function to `chartControlsWidgets` or `topWidgets`.

For example, we want to remove all the chart control buttons, and for top widgets to just show the comparison list (refer `app/index.jsx`):

```jsx
import { ChartMode, ToolbarWidget } from "@deriv/deriv-chart";

const renderTopWidgets = () => (
  <React.Fragment>
    <div>Hi I just replaced the top widgets!</div>
    <ChartMode />
  </React.Fragment>
);

const renderBottomWidgets = () => (
  <React.Fragment>
    <div>Hi, I am a bottom widget!</div>
  </React.Fragment>
);

const renderToolbarWidgets = () => (
  <ToolbarWidget position="top">
    <div>Hi I just replaced the top widgets!</div>
    <ChartMode />
  </ToolbarWidget>
);

const App = () => (
  <SmartChart
    bottomWidgets={renderBottomWidgets}
    topWidgets={renderTopWidgets}
    toolbarWidget={renderToolbarWidgets}
    chartControlsWidgets={() => {}}
  ></SmartChart>
);
```

Here are the following components you can import:

- Top widgets:
  - `<ChartTitle enabled={true} onChange={(symbol) => {}} open_market={null} />`
- Chart controls:
  - `<CrosshairToggle enabled={true} />`
  - `<ChartTypes enabled={true} onChange={(chartType) => {}} />`
  - `<StudyLegend />`
  - `<DrawTools />`
  - `<Views onChartType={(chartType) => {}} onGranularity={(granularity) => {}} />`
  - `<Share />`
  - `<Timeperiod enabled={true} onChange={(chartType) => {}} />`
  - `<ChartSize />`
  - `<ChartSetting />`
- Toolbar Widget
  - `<ChartMode onChartType={(chartType) => {}} onGranularity={(granularity) => {}} />`

> Note: ChartMode and Views have the same type of props. It includes required `onChartType` and `onGranularity` callbacks and an optional `portalNodeId`.


### Props vs UI

Certain chart parameters can be set either by props or from the chart UI:

- `symbol` - set by `<ChartTitle />`
- `granularity` - set by `<TimePeriod >`
- `chartType` - set by `<ChartTypes />`

This creates conflicts in deciding which is the single source of truth. To circumvent this, if these props are set (not `undefined`), selecting options in its corresponding components will not have any affect on the chart; the prop values take precedence. To have control over both the UI and the props, we provide library users the option to _override_ component behaviour via `onChange` prop. For example, to retrieve the symbol a client chooses:

```jsx
<ChartTitle
  open_market={{
    category: 'forex',
    subcategory: 'minor-pairs',
    market: 'frxAUDCAD'
  }}
  onChange={(symbol) => {
    /* ...Pass to symbol prop in <SmartCharts /> */
  }}
/>
```

See available components and their props in [Customising Components](#customising-components).

#### ChartTitle

| Attribute    | Description                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------- |
| onChange     | When symbol/market changes, this method call. `(symbol) => { }`                                     |
| isNestedList | Change the theme of Dropdown, if set to `true` it shows a dropdown nested style. Default is `false` |
| open_market | Sepecify the visible market on the market selector scroll. it accept `{category: '', subcategory: '', market: ''}` . Default is `null` |


#### ToolbarWidget

| Attribute | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
| position  | determine the position of toolbar, which can be `top, bottom`. Default is `top` |


## How to contribute


1. Create branch from the latest `master` branch

    ```sh
    git checkout master
    git pull upstream master
    git checkout -b [_your_branch_name]
    ```

2. Make your changes

3. Make pull request

-   Push your changes to your origin

    ```sh
    git push -u origin [_your_branch_name]
    ```

**Important Note:** Prior to sending pull requests, make sure all unit tests passed:

    ```sh
    npm run test
    ```

-  Once your changes have been merged to `master`, it will immediately deployed to [charts.binary.com/beta](https://charts.binary.com/beta/).

-   Make sure to change the PR base to `master` branch

-   Click on the autogenerated link from terminal to open the PR


## Manage releases / deployment process
### Library deployment / publishing to NPM

To publish to production:

    ```sh
    npm run build && npm publish
    ```

To publish to beta:

    ```sh
    npm run build && npm publish --tag beta
    ```
### Staging / Production deployment
#### 1) Staging deployment:

- Any pull request merged to `master` branch will be automatically deployed to charts.binary.com/beta.

#### 2) Production deployment:

- Production deployment is handled with tagging, ideally, we will create the tag with the prefix `production_v{{version_number}}` from `master` branch and push the tag to initiate the production release pipeline.

NOTE: _Write access is required for this action_

Example:

i) `git tag production_v20180901 -m 'release production'`

ii) `git push origin production_v20180901`


## Manage translations

All strings that need to be translated must be inside `t.translate()`:

```js
t.translate("[currency] [amount] payout if the last tick.", {
  currency: "USD",
  amount: 43.12,
});
t.setLanguage("fr", callback_function); // components need to be rerendered for changes to take affect
```

Each time a new translation string is added to the code, you need to update the `messages.pot` via:

    npm run translations

Once the new `messages.pot` is merged into the `master` branch, it will automatically be updated in [CrowdIn](https://crowdin.com/project/smartcharts/settings#files). You should expect to see a PR with the title 

**New Crowdin translations**
in a few minutes; this PR will update the `*.po` files.

## Developer Notes

### Developer Workflow

We organise the development in Trello. Here is the standard workflow of how a feature/bug fix is added:

1.  When an issue/feature is raised, it is added to `Backlog` list. For each card added, it should have a "QA Checklist" (Add checklist to card) for QA to verify that the feature/bug fix has been successfully implemented.
2.  In a meeting, if feature/bug fix is set to be completed for next release, it will be labeled as `Next Release` and placed in `Bugs/Todo` list.
3.  Cards are assigned to developers by adding them to the card; manager gets added to every card.
4.  If a developer is actively working on a card, he places the card in `In Development`; otherwise it should be placed back into `Bugs/Todo` list.
5.  Once the feature/bug fix is implemented, the developer needs put 2 things in the card before placing his card in `Review` list.:
    - **PR**: Link to the PR.
    - **Test Link**: Link to github pages that has the changes; this is for QA to verify. Refer to [this section](#deploy-to-github-pages) for instructions on how to deploy.
6.  If reviewer requests changes, he will place the card back to the `In Development` list. This back and forth continues until the reviewer passes the PR by marking it as `approved` in Github.
7.  Reviewer places the reviewed card into `QA` list.
8.  If the card fails QA check, QA can comment on the card on what failed, and place the card back to `In Development` list. If QA passes the changes, QA will place the card from `QA` to `Ready`; this card is now ready to be merged to `master`.
9.  Once the card is merged to `master`, it is placed in `Deployed to BETA` list.
10. When it is time to take all changes in `beta` and deploy in production, manager will merge `master` into `master`, and place all cards in `Deployed to BETA` to `Released`.

### Debugging NPM Package

Some issues only show up for library users, so it is helpful to test the NPM package before deploying it to library users. You can do this by building the library directly into the node_modules directory of an app that uses the SmartCharts library. For example to test the library build on binary-static you can execute:

    npm run watch '../binary-static/node_modules/@deriv/deriv-chart/dist'

Now each time you make any change, it will overwrite the SmartCharts library inside the `node_modules` folder.

### Separation of App and Library

There should be a clear distinction between developing for app and developing for library. Library source code is all inside `src` folder, whereas app source code is inside `app`.

Webpack determines whether to build an app or library depending on whether an environment variable `BUILD_MODE` is set to `app`. Setting this variable switches the entry point of the project (app build mode uses `app/index.jsx` while library uses `src/index.js`). We do it this way to develop the app to have hot reload available when we modify library files.

### Dealing With SVGs

SmartCharts has 2 ways of utilizing SVG files: as CSS background image and as external SVG.

##### CSS Background Image SVG

These SVG are added inline into the CSS via [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg). Currently the only place where this is used is the loader, because if the external SVG is not loaded yet we would at least want a loading screen to be present.

##### External SVG

The SVG files included in the `js` and `jsx` files are automatically put together into a sprite sheet. Manipulating external SVG can be tricky - developers can only control stroke and fill color of the whole SVG file via CSS:

```scss
.ic-icon.active {
  svg {
    stroke: #2e8836;
    fill: #ff3d38;
  }
}
```

**Important Note:** These stroke and fill colors will not be affected by CSS if the corresponding attributes are declared in the SVG file. Therefore, it is not uncommon SmartCharts developers would need to tweak the SVG files by hand to be able to manipulate its color.

This has much less freedom compared to [inline SVG](https://github.com/MoOx/react-svg-inline) where a developer can control individual parts of the SVG, but having external SVG results in a much smaller library, and allows parts of the code not rendered by React to use them. External SVG is also cached by the browser (using shadow DOM), so though the same SVG may be used multiple times, only one copy exists in the DOM.

### State Management and the `connect` Method

SmartCharts uses a variation of [Mobdux](https://medium.com/@cameronfletcher92/mobdux-combining-the-good-parts-of-mobx-and-redux-61bac90ee448) to assist with state management using Mobx.

Each component consists of 2 parts: a **template** (`*.jsx` file), and a **store** (`*Store.js` file). There are 3 scenarios in which the [`connect`](https://github.com/deriv-com/SmartCharts/blob/dev/src/store/Connect.js) method is used:

##### 1. Main Components: The component is tied directly to the main store.

Examples: `<ChartTitle />`, `<TimePeriod />`, `<Views />`...

Each component here is mapped to a corresponding store in the main store. **Only one copy of this component may exist per `<SmartChart />` instance**, and its state is managed by the main store tree (defined as `mainStore` in SmartCharts). Here you pass a `mapperFunction` that would be applied directly to the main store:

```jsx
function mapperFunction(mainStore) {
  return {
    value: mainStore.subStore.value,
  };
}

export default connect(mapperFunction)(MyComponent);
```

Connections in the scenario #1 should be done in the `jsx` file, to keep consistent with other components. Except for the component tied to the main store (`Chart.jsx`), all components using this method should be SFC (Stateless Functional Components), and have the lifecycle managed by the main store.

##### 2. Subcomponents: Component is connected inside a store

Examples: `<Menu />`, `<List />`, `<CategoricalDisplay />`...

This is used when multiple copies of a store needs to exist in the same state tree. Here we do the connection inside the constructor of a child of the main store and pass it as a prop to the template. For example `<ChartTitle />` needs a `<Menu />`, so in `ChartTitleStore` we create an instance of `MenuStore` and connect it:

```js
export default class ChartTitleStore {
  constructor(mainStore) {
    this.menu = new MenuStore(mainStore);
    this.ChartTitleMenu = this.menu.connect(Menu);
    // ...
  }
  // ...
}
```

The `connect` method for subcomponents are defined in its store (instead of the template file) that contains its own `mapperFunction`:

```js
export default class MenuStore {
  // ...
  connect = connect(() => ({
    setOpen: this.setOpen,
    open: this.open,
  }));
}
```

We then pass the connected component in `ChartTitle.jsx`:

```js
export default connect(({ chartTitle: c }) => ({
  ChartTitleMenu: c.ChartTitleMenu,
}))(ChartTitle);
```

> **Note**: Do NOT connect subcomponents in another connect method; `connect` creates a new component each time it is called, and a `mapperFunction` is called every time a mobx reaction or prop update is triggered.

##### 3. Independent Components: components that are not managed by the main store

Examples: `<Barrier />`, `<ChartMode />`

Independent components is able to access the main store, but the main store has no control over independent components. As such, each independent component manages its own life cycle. Here is the interface for its store:

```js
class IndependentStore {
  constructor(mainStore) {}
  updateProps(nextProps) {} // intercept the props from the component
  destructor() {} // called on componentWillUnmount
}
```

This enables library users to use multiple copies of a component without connecting it, because mounting an independent component will also create its own store (refer to [`Marker API`](#marker-api) to see usage example of such a component). Therefore, for each independent component you connect you will also need to pass its store class (not an instance but the class itself) as a second parameter to the `connect` function:

```jsx
function mapperFunction(customStore) {
  return {
    value: customStore.value,
  };
}

export default connect(
  mapperFunction,
  MyStoreClass // Required argument for independent components
)(MyIndependentComponent);
```

Note that **for independent components, the `mapperFunction` is applied to the store instance**, not the main store. Should you need to access any value from the main store, you can do this via the `mainStore` passed to the constructor of each independent store class.


