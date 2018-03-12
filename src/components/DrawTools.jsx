import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import { DrawIcon, DeleteIcon, MeasureIcon } from './Icons.jsx';
import '../../sass/_draw-tools.scss';

const DrawTools = ({
    clearAll,
    noTool,
    selectTool,
    clearDrawings,
    Menu,
    menuOpen,
    DrawList,
}) => {
    return (
        <Menu
            className="ciq-draw-tools"
        >
            <Menu.Title>
                <DrawIcon
                    className={`${menuOpen ? 'active' : ''}`}
                    tooltip-title="Draw tools" />
            </Menu.Title>

            <Menu.Body>
                <div className='ciq-bars'>
                    <div onClick={clearDrawings}>
                        <DeleteIcon />
                        Clear All
                    </div>
                    <div onClick={() => selectTool('measure')}>
                        <MeasureIcon />
                        Measure
                    </div>
                </div>
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
        menuOpen: dt.menu.open,
        DrawList: dt.list.connect(List),
    })
)(DrawTools);
