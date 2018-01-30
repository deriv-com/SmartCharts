/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CIQ from 'chartiq'; // eslint-disable-line

import StreamManager from './StreamManager';
import Feed from './Feed';
import ActiveSymbolDriver from './ActiveSymbolDriver';
import ConnectionManager from './ConnectionManager';
import Context from './components/ui/Context';

import '../chartiq/html2canvas';
import '../chartiq/iscroll';


/* css + scss */
import '../css/stx-chart.css';
import '../sass/chartiq.scss';

import './AddOns';
import './Plugin';

import './components/Attribution';
import './components/ChartTitle';
import './components/Close';
import './components/ColorPicker';
import './components/Comparison';
import './components/DrawingToolbar';
import './components/FibSettingsDialog';
import './components/Loader';
import './components/Lookup';
import './components/Menu';
import './components/MenuDropDown';
import './components/Redo';
import './components/Scroll';
import './components/ShowRange';
import './components/StudyContext';
import './components/StudyDialog';
import './components/StudyInput';
import './components/StudyLegend';
import './components/StudyOutput';
import './components/StudyParameter';
import './components/Swatch';
import './components/Toggle';
import './components/Undo';
import './components/ViewDialog';
import './components/Views';
import './components/Clickable';
import ChartControls from './components/ChartControls.jsx';
import PendingPromise from './utils/PendingPromise';

import Barrier from './draw/Barrier';
import BinaryChartiq from './BinaryChartiq.jsx';
import DateLine, { TradeStartLine, TradeEndLine } from './draw/DateLine';
import { createElement } from './components/ui/utils';

window.Barrier = Barrier;
window.DateLine = DateLine;
window.BinaryChartiq = BinaryChartiq;

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <cq-ui-manager />
                <BinaryChartiq />
                {/*<BinaryChartiq />*/}
            </React.Fragment>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);

