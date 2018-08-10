import React from 'react';
import { connect } from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import { DrawIcon, ClearIcon, MeasureIcon, CloseIcon } from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';

const DrawTools = ({
    clearAll,
    selectTool,
    Menu,
    menuOpen,
    DrawList,
    closeMenu,
    isMobile,
}) => (
    <Menu
        className="ciq-draw-tools"
    >
        <Menu.Title>
            <DrawIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Draw tools')}
            />
        </Menu.Title>

        <Menu.Body>
            <div className="title">
                <div className="ciq-bars-title">
                    {t.translate('Draw tools')}
                </div>
                {isMobile ? <CloseIcon className="icon-close-menu" onClick={closeMenu} /> : '' }
            </div>
            <div className="body">
                <div className="cq-draw-buttons">
                    <div className="cq-draw-button">
                        <ClearIcon
                            className="ciq-tooltip"
                            onClick={clearAll}
                            tooltip-title={t.translate('Clear All')}
                        />
                        <span>
                            {t.translate('Clear All')}
                        </span>
                    </div>
                    <div className="cq-draw-button" style={{ display: 'none'  /* TODO: measurement tool doesn't show measurement */ }}>
                        {' '}
}
                        <MeasureIcon
                            className="ciq-tooltip"
                            onClick={() => selectTool('measure')}
                            tooltip-title={t.translate('Measure')}
                        />
                        <span>
                            {t.translate('Measure')}
                        </span>
                    </div>
                </div>
                <DrawList />
            </div>
        </Menu.Body>
    </Menu>
);

export default connect(({ drawTools: dt }) => ({
    clearAll: dt.clearAll,
    selectTool: dt.selectTool,
    Menu: dt.menu.connect(Menu),
    menuOpen: dt.menu.open,
    DrawList: dt.list.connect(List),
    closeMenu: dt.menu.onTitleClick,
    isMobile: dt.mainStore.chart.isMobile,
}))(DrawTools);
