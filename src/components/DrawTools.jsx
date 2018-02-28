import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import '../../sass/_draw-tools.scss';

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
                <span className="ciq-icon ciq-ic-draw-tools" />
            </Menu.Title>
            <Menu.Body>
                <div className='ciq-bars'>
                    <div onClick={clearDrawings}>
                        <span className="ciq-icon ciq-ic-clear-all" />
                        Clear All
                    </div>
                    <div onClick={() => selectTool('measure')}>
                        <span className="ciq-icon ciq-ic-measure" />
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
        DrawList: dt.list.connect(List),
    })
)(DrawTools);
