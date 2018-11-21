import React from 'react';
import { connect } from '../store/Connect';
import { DrawIcon, ClearIcon, MeasureIcon } from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';

const DrawTools = ({
    clearAll,
    selectTool,
    DrawToolsMenu,
    menuOpen,
    drawToolsItems,
}) => (
    <DrawToolsMenu
        className="ciq-draw-tools"
        title={t.translate('Draw tools')}
    >
        <DrawToolsMenu.Title>
            <DrawIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Draw tools')}
            />
        </DrawToolsMenu.Title>

        <DrawToolsMenu.Body>
            <div className="body">
                <div
                    data-simplebar
                    className="ciq-list"
                >
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
                    {drawToolsItems.map(it => (
                        <div
                            key={it.id}
                            className="ciq-list-item"
                            onClick={() => selectTool(it.id)}
                        >
                            {it.text}
                        </div>
                    ))}
                </div>

            </div>
        </DrawToolsMenu.Body>
    </DrawToolsMenu>
);

export default connect(({ drawTools: dt }) => ({
    clearAll: dt.clearAll,
    selectTool: dt.selectTool,
    DrawToolsMenu: dt.DrawToolsMenu,
    menuOpen: dt.menu.open,
    drawToolsItems: dt.drawToolsItems,
}))(DrawTools);
