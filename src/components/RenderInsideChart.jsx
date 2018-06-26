import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createElement } from './ui/utils';

const inChartPrefix = 'cq-inchart-';

// Render given Components under stx-holder to position it relative to the active symbol chart.
class RenderInsideChart extends PureComponent {
    static contextTypes = { promise: PropTypes.object };

    componentDidMount() {
        const at = this.props && this.props.at || 'holder';

        this.context.promise.then((context) => {
            const nodeName = `${inChartPrefix}${at}`;
            // reuse existing node when possible:
            let elem = context.topNode.querySelector(`.${nodeName}`);
            if (!elem) {
                elem = createElement(`<div class="${nodeName}"></div>`);
                context.stx.chart.panel[at].appendChild(elem);
            }
            this.marker = elem;
            this.forceUpdate(); // force render to be called after setting marker
        });
    }

    render() {
        if (this.marker) {
            return ReactDOM.createPortal(
                this.props.children,
                this.marker,
            );
        }
        return (null);
    }
}

export default RenderInsideChart;
