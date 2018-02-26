import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import List_ from './List.jsx';
import '../../sass/_draw-tools.scss';
import KeystrokeHub from './ui/KeystrokeHub';

const List = connect(
    ({ drawTools: dt }) => ({
        isOpen: dt.menu.open,
        height: 250,
    })
)(List_);

const DrawTools = ({
    clearAll,
    noTool,
    selectTool,
    clearDrawings,
    Menu,
}) => {
    return (
        <Menu
            className="ciq-draw-tools"
        >
            <Menu.Title>
                <span className="ciq-icon ciq-ic-draw-tools"></span>
            </Menu.Title>
            <Menu.Body>
                <List>
                    <div className="row" onClick={noTool}>None</div>
                    <div className="row" onClick={clearDrawings}>Clear Drawings</div>
                    <div className="row" onClick={() => selectTool('measure')}>Measure</div>
                    <cq-separator />
                    <div className="row" onClick={() => selectTool('annotation')}>Annotation</div>
                    <div className="row" onClick={() => selectTool('average')}>Average Line</div>
                    <div className="row" onClick={() => selectTool('callout')}>Callout</div>
                    <div className="row" onClick={() => selectTool('channel')}>Channel</div>
                    <div className="row" onClick={() => selectTool('continuous')}>Continuous</div>
                    <div className="row" onClick={() => selectTool('crossline')}>Crossline</div>
                    <div className="row" onClick={() => selectTool('freeform')}>Doodle</div>
                    <div className="row" onClick={() => selectTool('ellipse')}>Ellipse</div>
                    <div className="row" onClick={() => selectTool('fibonacci')}>Fibonacci</div>
                    <div className="row" onClick={() => selectTool('fibarc')}>Fib Arc</div>
                    <div className="row" onClick={() => selectTool('fibfan')}>Fib Fan</div>
                    <div className="row" onClick={() => selectTool('fibtimezone')}>Fib Time Zone</div>
                    <div className="row" onClick={() => selectTool('gannfan')}>Gann Fan</div>
                    <div className="row" onClick={() => selectTool('gartley')}>Gartley</div>
                    <div className="row" onClick={() => selectTool('horizontal')}>Horizontal</div>
                    <div className="row" onClick={() => selectTool('line')}>Line</div>
                    <div className="row" onClick={() => selectTool('pitchfork')}>Pitchfork</div>
                    <div className="row" onClick={() => selectTool('quadrant')}>Quadrant Lines</div>
                    <div className="row" onClick={() => selectTool('ray')}>Ray</div>
                    <div className="row" onClick={() => selectTool('rectangle')}>Rectangle</div>
                    <div className="row" onClick={() => selectTool('regression')}>Regression Line</div>
                    <div className="row" onClick={() => selectTool('segment')}>Segment</div>
                    <div className="row" onClick={() => selectTool('arrow')}>Shape - Arrow</div>
                    <div className="row" onClick={() => selectTool('check')}>Shape - Check</div>
                    <div className="row" onClick={() => selectTool('xcross')}>Shape - Cross</div>
                    <div className="row" onClick={() => selectTool('focusarrow')}>Shape - Focus</div>
                    <div className="row" onClick={() => selectTool('heart')}>Shape - Heart</div>
                    <div className="row" onClick={() => selectTool('star')}>Shape - Star</div>
                    <div className="row" onClick={() => selectTool('speedarc')}>Speed Resistance Arc</div>
                    <div className="row" onClick={() => selectTool('speedline')}>Speed Resistance Line</div>
                    <div className="row" onClick={() => selectTool('timecycle')}>Time Cycle</div>
                    <div className="row" onClick={() => selectTool('tirone')}>Tirone Levels</div>
                    <div className="row" onClick={() => selectTool('vertical')}>Vertical</div>
                </List>
            </Menu.Body>
        </Menu>
    );
};

export default connect(
    ({ drawTools: dt }) => ({
        clearAll: dt.clearAll,
        noTool: dt.noTool,
        selectTool: dt.selectTool,
        clearDrawings: dt.clearDrawings,
        Menu: dt.menu.connect(Menu),
    })
)(DrawTools);
