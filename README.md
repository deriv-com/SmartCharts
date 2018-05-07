# SmartCharts

[![npm (scoped)](https://img.shields.io/npm/v/@binary-com/smartcharts.svg)](https://www.npmjs.com/package/@binary-com/smartcharts) [![Build Status](https://travis-ci.org/binary-com/SmartCharts.svg?branch=dev)](https://travis-ci.org/binary-com/SmartCharts)

SmartCharts is both the name of the app ([charts.binary.com](https://charts.binary.com/)) and the charting library. You can install the library to your project via:

    yarn add @binary-com/smartcharts

**Important Note:** the license for the library is tied to the `binary.com` domain name; it will not work in github pages.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the library
- use `yarn build:app` to build the [charts.binary.com](https://charts.binary.com/) app
- use `yarn analyze` to run webpack-bundle-analyzer

> Note: eventhough both `yarn build` and `yarn build:app` outputs `smartcharts.js` and `smartcharts.css`, **they are not the same files**. One outputs a library and the the other outputs an app.

## Usage 

### Quick Start

In the `app` folder, we provide a working webpack project that uses the smartcharts library. Simply `cd` to that directory and run:

    yarn install
    yarn start

The sample app should be running in http://localhost:8080. 

Refer to library usage inside `app/index.jsx`:

```jsx
import { SmartChart } from '@binary-com/smartcharts';

class App extends React.Component {
    render() {
        return (
            <SmartChart
                onSymbolChange={(symbol) => console.log('Symbol has changed to:', symbol)}
                requestSubscribe={({ symbol, granularity, ... }, cb) => {}}   // Passes the whole req object
                requestForget={({ symbol, granularity }, cb) => {}}         // cb is exactly the same reference passed to subscribe
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

 - The ChartIQ library and the smartcharts CSS file will need to be copied from the npm library (remember to include in your `index.html`). In the example we use the `copy-webpack-plugin` webpack plugin to do this:
 
 ```js
new CopyWebpackPlugin([
    { from: './node_modules/@binary-com/smartcharts/dist/chartiq.min.js' },
    { from: './node_modules/@binary-com/smartcharts/dist/smartcharts.css' },
])
```

 - You need to expose `CIQ` (the ChartIQ library) as a global object:
 
```js
externals: {
    CIQ: 'CIQ'
}
```

### API

> Note: Props will take precedence over values set by the library.

Props marked with `*` are **mandatory**:

| Props | Description |
--------|--------------
requestAPI* | SmartCharts will make single API calls by passing the request input directly to this method, and expects a `Promise` to be returned.
requestSubscribe* | SmartCharts will make streaming calls via this method. `requestSubscribe` expects 2 parameters `(request, callback) => {}`: the `request` input and a `callback` in which response will be passed to for each time a response is available. Keep track of this `callback` as SmartCharts will pass this to you to forget the subscription (via `requestForget`).
requestForget* | When SmartCharts no longer needs a subscription (made via `requestSubscribe`), it will call this method (passing in the `callback` passed from `requestSubscribe`) to halt the subscription.
lang | Sets the language.
chartControlsWidgets | Render function for chart control widgets. Refer to [Customising Components](#customising-components).
topWidgets | Render function for top widgets. Refer to [Customising Components](#customising-components).

### Customising Components

We offer library users full control on deciding which of the top widgets and chart control buttons to be displayed by overriding the render methods themselves. To do this you pass in a function to `chartControlsWidgets` or `topWidgets`.

For example, we want to remove all the chart control buttons, and for top widgets to just show the comparison list (refer `app/index.jsx`):

```jsx
import { ComparisonList } from '@binary-com/smartcharts';

const renderTopWidgets = () => (
    <React.Fragment>
        <div>Hi I just replaced the top widgets!</div>
        <ComparisonList />
    </React.Fragment>
);

const App = () => (
    <SmartChart
        topWidgets={renderTopWidgets}
        chartControlsWidgets={()=>{}}
    >
    </SmartChart>
);
```

Here are the following components you can import:
 - Top widgets:
    - `<ChartTitle />`
    - `<AssetInformation />`
    - `<ComparisonList />`
 - Chart controls:
    - `<CrosshairToggle />`
    - `<ChartTypes />`
    - `<StudyLegend />`
    - `<Comparison />`
    - `<DrawTools />`
    - `<Views />`
    - `<Share />`
    - `<Timeperiod />`
    - `<ChartSize />`
    - `<ChartSetting />`
 
## Contribute

To contribute to SmartCharts, fork this project and checkout the `dev` branch. When adding features or performing bug fixes, it is recommended you make a separate branch off `dev`. Prior to sending pull requests, make sure all unit tests passed:

    yarn test

Once your changes have been merged to `dev`, it will immediately deployed to [charts.binary.com/beta](https://charts.binary.com/beta/). 

## Developer Notes

### Separation of App and Library

There should be a clear distinction between developing for app and developing for library. Library source code is all inside `src` folder, whereas app source code is inside `app`.

Webpack determines whether to build an app or library depending on whether an environment variable `BUILD_MODE` is set to `app`. Setting this variable switches the entry point of the project, but on the **same** `webpack.config.js` (the one on the root folder). The `webpack.config.js` and `index.html` in the `app` folder is never actually used in this process; they serve as a guide to how to use the smartcharts library as an npm package. We do it this way to develop the app to have hot reload available when we modify library files.

### Translations

All strings that need to be translated must be inside `t.translate()`:

```js
t.translate('[currency] [amount] payout if the last tick.', { 
    currency: 'USD',
    amount: 43.12
});
t.setLanguage('fr'); // components need to be rerendered for changes to take affect
```

Each time a new translation string is added to the code, you need to update the `messages.pot` via:

    yarn translations

Once the new `messages.pot` is merged into the `dev` branch, it will automatically be updated in [CrowdIn](https://crowdin.com/project/smartcharts/settings#files). You should expect to see a PR with the title **New Crowdin translations**
 in a few minutes; this PR will update the `*.po` files.

## Manual Deployment

### Deploy to NPM

    yarn build && yarn publish

### Deploy to [charts.binary.com](https://charts.binary.com/)

> Note: This is usually not required, since Travis will automatically deploy to [charts.binary.com](https://charts.binary.com/) and [charts.binary.com/beta](https://charts.binary.com/beta/) when `master` and `dev` is updated.

The following commands will build and deploy to charts.binary.com (*Make sure you are in the right branch!*); you will need push access to this repository for the commands to work:

    yarn deploy:beta        # charts.binary.com/beta
    yarn deploy:production  # charts.binary.com

### Deploy to Github Pages

As ChartIQ license is tied to the `binary.com` domain name, we provide developers with a `binary.sx` to test out the library on their Github Pages.

For each feature/fix you want to add we recommend you deploy an instance of SmartCharts for it (e.g. `brucebinary.binary.sx/featureA`, `brucebinary.binary.sx/featureB`). To deploy SmartCharts to your github pages, you first need to setup your `gh-pages` branch:

 1. Make sure you have a `binary.sx` subdomain pointed to your `github.io` page first (e.g. `brucebinary.binary.sx -> brucebinary.github.io`). 
 2. In your `gh-pages` branch, add a `CNAME` in your project root folder, and push that file to your branch, for example:
 
 ```bash
 git checkout -b gh-pages origin/gh-pages # if you already checkout from remote execute: git checkout gh-pages
 echo 'brucebinary.binary.sx' > CNAME # substitute with your domain
 git add --all
 git commit -m 'add CNAME'
 git push origin gh-pages
 ```
 
Here on, to deploy a folder (e.g. `myfoldername`):

    yarn build-travis && yarn gh-pages:folder myfoldername

Now you should be able to see your SmartCharts app on `brucebinary.binary.sx/myfoldername`.

Alternatively you can deploy directly to the domain itself (note that this **erases all folders**; could be useful for cleanup). In our example, the following command will deploy to `brucebinary.binary.sx`:

    yarn build-travis && yarn gh-pages

> Note: `yarn build-travis` will add hashing inside `index.html`; **do not push those changes to git!**
