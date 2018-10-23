import React from 'react';
import { connect } from '../store/Connect';
import { DrawIcon, ClearIcon, MeasureIcon } from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';
import TranslationText from './TranslationText.jsx';

const DrawTools = ({
    clearAll,
    selectTool,
    DrawToolsMenu,
    menuOpen,
    DrawList,
}) => (
    <DrawToolsMenu
        className="ciq-draw-tools"
        title={t.translatable('Draw tools')}
    >
        <DrawToolsMenu.Title>
            <DrawIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translatable('Draw tools')}
            />
        </DrawToolsMenu.Title>

        <DrawToolsMenu.Body>
            <div className="body">
                <div className="cq-draw-buttons">
                    <div className="cq-draw-button" onClick={clearAll}>
                        <ClearIcon />
                        <TranslationText value={t.translatable('Clear All')} />
                    </div>
                    <div
                        className="cq-draw-button"
                        onClick={() => selectTool('measure')}
                        style={{ display: 'none'  /* TODO: measurement tool doesn't show measurement */ }}
                    >
                        <MeasureIcon />
                        <TranslationText value={t.translatable('Measure')} />
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
}))(DrawTools);
