import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import '../../sass/_draw-tools.scss';
import KeystrokeHub from './ui/KeystrokeHub';


const DrawTools = ({
    clearAll,
    noTool,
    selectTool,
    clearDrawings,
    Menu,
    DrawList,
}) => {
    return (
        <Menu
            className="ciq-draw-tools"
        >
            <Menu.Title>
                <span className="ciq-icon ciq-ic-draw-tools"></span>
            </Menu.Title>
            <Menu.Body>
                <div className="row" onClick={noTool}>None</div>
                <div className="row" onClick={clearDrawings}>Clear Drawings</div>
                <div className="row" onClick={() => selectTool('measure')}>Measure</div>
                <DrawList />
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
        DrawList: dt.list.connect(List),
    })
)(DrawTools);
