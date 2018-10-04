import { Component } from 'react';
import ReactDOM from 'react-dom';
import { createElement } from './ui/utils';
import { connect } from '../store/Connect';

const inChartPrefix = 'cq-inchart-';

// Render given Components under stx-holder to position it relative to the active symbol chart.
class RenderInsideChart extends Component {
    constructor(props) {
        super(props);
        const { at = 'holder', contextPromise } = props;

        this.state = {container : null};

        contextPromise.then((context) => {
            const nodeName = `${inChartPrefix}${at}`;
            // reuse existing node when possible:
            let elem = context.topNode.querySelector(`.${nodeName}`);
            if (!elem) {
                elem = createElement(`<div class="${nodeName}"></div>`);
                context.stx.chart.panel[at].appendChild(elem);
            }
          
            this.setState({container : elem});
        });
    }

    shouldComponentUpdate(nextProps , nextState){
        return this.state.container && this.state.container !== nextState.container;
    }

    render() {
        if (this.container) {
            return ReactDOM.createPortal(
                this.props.children,
                this.container,
            );
        }
        return (null);
    }
}

export default connect(({ chart }) => ({
    contextPromise: chart.contextPromise,
}))(RenderInsideChart);
