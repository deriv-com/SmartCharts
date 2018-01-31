/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CIQ from 'chartiq'; // eslint-disable-line

import '../sass/demo.scss';

import BinaryChartiq from './BinaryChartiq.jsx';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <cq-ui-manager />
                <BinaryChartiq id={1} />
                <BinaryChartiq id={2} />
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);

