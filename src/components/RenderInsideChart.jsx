import React, {PureComponent} from 'react';
import { createElement } from './ui/utils';
import ReactDOM from 'react-dom';
import { MobxProvider } from '../store/Connect';
import PropTypes from 'prop-types';

// Render given Components under stx-holder to position it relative to the active symbol chart.
// NOTE: Do NOT place this component as root; props will not update properly.
class RenderInsideChart extends PureComponent {
    static contextTypes = { promise: PropTypes.object, mobxStores: PropTypes.object };

    componentDidMount() {
        this.context.promise.then((context) => {
            const stx = context.stx;
            const elem = createElement(`<div></div>`);
            const marker = stx.panels.chart.holder.appendChild(elem);
            ReactDOM.render(
                <MobxProvider store={this.context.mobxStores}>
                    <React.Fragment>
                        {this.props.children}
                    </React.Fragment>
                </MobxProvider>,
                marker
            );
        });
    }

    render () {
        return (null);
    }
};

export default RenderInsideChart;
