import React, {PureComponent} from 'react';
import contextAware from '../contextAware';
import { createElement } from './ui/utils';
import ReactDOM from 'react-dom';
import { MobxProvider } from '../store/Connect';

class RenderInsideChart extends PureComponent {
    onContextReady (context) {
        const stx = context.stx;
        const elem = createElement(`<div></div>`);
        const marker = stx.panels.chart.holder.appendChild(elem);
        ReactDOM.render(
            <MobxProvider store={context.mainStore}>
                <React.Fragment>
                    {this.props.children}
                </React.Fragment>
            </MobxProvider>,
            marker
        );
    }

    render () {
        return (null);
    }
};

export default contextAware(RenderInsideChart);
