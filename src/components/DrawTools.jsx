import React from 'react';
import { connect } from '../store/Connect';
import { DrawIcon, ClearIcon, MeasureIcon, CloseIcon } from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';

const DrawTools = ({
    clearAll,
    selectTool,
    DrawToolsMenu,
    menuOpen,
    DrawList,
    closeMenu,
    isMobile,
}) => (
    <DrawToolsMenu
        className="ciq-draw-tools"
    >
        <DrawToolsMenu.Title>
            <DrawIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Draw tools')}
            />
        </DrawToolsMenu.Title>

        <DrawToolsMenu.Body>
            <div className="title">
                <div className="ciq-bars-title">{t.translate('Draw tools')}</div>
                {isMobile ? <CloseIcon className="icon-close-menu" onClick={closeMenu} /> : '' }
            </div>
            <div className="body">
                <div className="cq-draw-buttons">
                    <div className="cq-draw-button" onClick={clearAll}>
                        <ClearIcon />
                        <span>{t.translate('Clear All')}</span>
                    </div>
                    <div
                        className="cq-draw-button"
                        onClick={() => selectTool('measure')}
                        style={{ display: 'none'  /* TODO: measurement tool doesn't show measurement */ }}
                    >
                        <MeasureIcon />
                        <span>{t.translate('Measure')}</span>
                    </div>
                </div>
                <DrawList />
            </div>
        </DrawToolsMenu.Body>
    </DrawToolsMenu>
);

export default connect(({ drawTools: dt }) => ({
    clearAll: dt.clearAll,
    selectTool: dt.selectTool,
    DrawToolsMenu: dt.DrawToolsMenu,
    menuOpen: dt.menu.open,
    DrawList: dt.DrawList,
    closeMenu: dt.menu.onTitleClick,
    isMobile: dt.mainStore.chart.isMobile,
}))(DrawTools);
