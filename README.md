# SmartCharts

Binary.com charting library using chartiq.

## Commands:
- use `yarn install` to install dependencies
- use `yarn start` to launch webpack dev server
- use `yarn build` to build the project
- use `yarn analyze` to run webpack-bundle-analyzer
- use `yarn gh-pages` to deploy demo to gh-pages

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
        
![](https://bruceoutdoors.files.wordpress.com/2018/01/screen-shot-2018-01-25-at-5-07-39-pm.png)

