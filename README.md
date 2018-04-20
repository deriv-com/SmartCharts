# SmartCharts

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

## Quick Start

To see how to configure smartcharts for your webpack project, refer to `app/webpack.config.js` (_this config is not used in the app development; refer to [this section](#separation-of-app-and-library) for more details_).

```jsx
import {
    SmartChart,
    Barrier,
    TradeStartLine,
    TradeEndLine
} from 'smartcharts';

class App extends React.Component {
    render() {
        return (
            <SmartChart>
                <Barrier 
                    color='green'
                    shade='above'
                    onBarrierChange={console.warn.bind(console)}
                />
                <TradeEndLine followsCurrentQuote />
                <TradeStartLine quote={(new Date).getTime() | 0} />
            </SmartChart>
        );
    }
};
```

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
 
### Contribute

To contribute to SmartCharts, fork this project and checkout the `dev` branch. When adding features or performing bug fixes, it is recommended you make a separate branch off `dev`. Prior to sending pull requests, make sure all unit tests passed:

    yarn test

> Note: When you send pull requests, remember to set the base branch to `dev`.

Once your changes have been merged to `dev`, it will immediately deployed to [charts.binary.com/beta](https://charts.binary.com/beta/). 

### Developer Notes

#### Separation of App and Library

There should be a clear distinction between developing for app and developing for library. Library source code is all inside `src` folder, whereas app source code is inside `app`.

Webpack determines whether to build an app or library depending on whether an environment variable `BUILD_MODE` is set to `app`. Setting this variable switches the entry point of the project, but on the **same** `webpack.config.js` (the one on the root folder). The `webpack.config.js` and `index.html` in the `app` folder is never actually used in this process; they serve as a guide to how to use the smartcharts library as an npm package. We do it this way to develop the app to have hot reload available when we modify library files.



### Manual Deployment

#### Deploy to NPM

    yarn build && yarn publish

#### Deploy to [charts.binary.com](https://charts.binary.com/)

> Note: This is usually not required, since Travis will automatically deploy to [charts.binary.com](https://charts.binary.com/) and [charts.binary.com/beta](https://charts.binary.com/beta/) when `master` and `dev` is updated.

The following commands will build and deploy to charts.binary.com (*Make sure you are in the right branch!*); you will need push access to this repository for the commands to work:

    yarn deploy:beta        # charts.binary.com/beta
    yarn deploy:production  # charts.binary.com

### Barrier Component
```jsx
<Barrier
    color?='red|green'
    shade?='above|below|between|outside|single_none|double_none'
    high?={number}
    low?={number}
    relative?={boolean}
    draggable?={boolean}
    onBarrierChange?={({high,low}) => any}
/>
```

### TradeStartLine (& TradeEndLine)
```jsx
<TradeStartLine
    followsCurrentQuote?={boolean}
    quote={number}
/>
```


![](https://bruceoutdoors.files.wordpress.com/2018/01/screen-shot-2018-01-25-at-5-07-39-pm.png)

