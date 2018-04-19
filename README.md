# SmartCharts

Binary.com charting library using chartiq.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the library
- use `yarn build:app` to build the [charts.binary.com](https://charts.binary.com/) app
- use `yarn analyze` to run webpack-bundle-analyzer

## Quick Start
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

### Manual Deployment

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

