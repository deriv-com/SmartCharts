import React, {PureComponent} from 'react';
import { createElement } from './ui/utils';
import ReactDOM from 'react-dom';
import { MobxProvider } from '../store/Connect';
import PropTypes from 'prop-types';

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = { children: null };
    }

    componentDidMount() {
        this.setState({children: this.props.children});
    }

    render() {
        return this.state.children;
    }
}
// Render given Components under stx-holder to position it relative to the active symbol chart.
// NOTE: Do NOT place this component as root; props will not update properly.
class RenderInsideChart extends PureComponent {
    static contextTypes = { promise: PropTypes.object, mobxStores: PropTypes.object };

    componentDidMount() {
        const at = this.props && this.props.at || 'holder';

        this.context.promise.then((context) => {
            const stx = context.stx;
            const elem = createElement(`<div></div>`);
            const marker = stx.chart.panel[at].appendChild(elem);
            ReactDOM.render(
                <MobxProvider store={this.context.mobxStores}>
                    <Wrapper ref={r => this.wrapper = r}>
                        {this.props.children}
                    </Wrapper>
                </MobxProvider>,
                marker
            );
        });
    }

    render () {
        if(this.wrapper) {
            setTimeout(() => this.wrapper.setState({children: this.props.children}), 0);
        }
        return (null);
    }
}

export default RenderInsideChart;
