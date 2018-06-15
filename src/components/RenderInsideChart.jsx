import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createElement } from './ui/utils';

// Render given Components under stx-holder to position it relative to the active symbol chart.
class RenderInsideChart extends PureComponent {
    static contextTypes = { promise: PropTypes.object };

    componentDidMount() {
        const at = this.props && this.props.at || 'holder';

        this.context.promise.then((context) => {
            const stx = context.stx;
            const elem = createElement('<div></div>');
            const marker = stx.chart.panel[at].appendChild(elem);
            this.marker = marker;
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
