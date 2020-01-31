import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from '../store/Connect';
import { DrawIcon, DeleteIcon, SettingIcon } from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';


const DrawToolsList = ({ items, onClick }) => (
    <Scrollbars
        autoHeight
        autoHeightMax={360}
        className="ciq-draw-tools__list"
    >
        {items.map(Item => (
            <div
                key={Item.id}
                className="ciq-draw-tools__list__item"
                onClick={() => onClick(Item.id)}
            >
                <div className="ciq-draw-tools__list__item__text">
                    <Item.icon />
                    <span>{Item.text}</span>
                </div>
            </div>
        ))}
    </Scrollbars>
);

const ActiveDrawToolsList = ({ items, onSetting, onDelete }) => (
    <Scrollbars
        autoHeight
        autoHeightMax={360}
        className="ciq-draw-tools__list"
    >
        {items.map(Item => (
            <div
                key={`${Item.index}`}
                className="ciq-draw-tools__list__item"
            >
                <div className="ciq-draw-tools__list__item__text">
                    <Item.icon />
                    <span>{Item.text}</span>
                </div>
                <div className="ciq-draw-tools__list__item__actions">
                    <small>(0 bars)</small>
                    <SettingIcon onClick={() => onSetting(Item.index)} />
                    <DeleteIcon onClick={() => onDelete(Item.index)} />
                </div>
            </div>
        ))}
    </Scrollbars>
);

const DrawTools = ({
    clearAll,
    selectTool,
    DrawToolsMenu,
    menuOpen,
    drawToolsItems,
    activeDrawToolsItems,
    onSetting,
    onDelete,
}) => (
    <DrawToolsMenu
        className="ciq-draw-tools"
        title={t.translate('Drawing tools')}
        newStyle
        enableTabular
    >
        <DrawToolsMenu.Title>
            <DrawIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Draw tools')}
            />
        </DrawToolsMenu.Title>

        <DrawToolsMenu.Body>
            <Tabs className="tabs--vertical">
                <TabList>
                    <Tab>Active</Tab>
                    <Tab>All drawings</Tab>
                </TabList>
                <TabPanel>
                    <div className="ciq-draw-tools__panel">
                        <div className="ciq-draw-tools__panel__head">
                            <button type="button" className="btn" onClick={clearAll}>
                                <span>{t.translate('Clear All')}</span>
                            </button>
                        </div>
                        <div className="ciq-draw-tools__panel__content">
                            <ActiveDrawToolsList
                                items={activeDrawToolsItems}
                                onSetting={onSetting}
                                onDelete={onDelete}
                            />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="ciq-draw-tools__panel">
                        <div className="ciq-draw-tools__panel__content">
                            <DrawToolsList
                                items={drawToolsItems}
                                onClick={selectTool}
                            />
                        </div>
                    </div>
                </TabPanel>
            </Tabs>
        </DrawToolsMenu.Body>
    </DrawToolsMenu>
);
export default connect(({ drawTools: dt }) => ({
    clearAll: dt.clearAll,
    selectTool: dt.selectTool,
    DrawToolsMenu: dt.DrawToolsMenu,
    menuOpen: dt.menu.open,
    drawToolsItems: dt.drawToolsItems,
    activeDrawToolsItems: dt.activeTools,
    onSetting: dt.onSetting,
    onDelete: dt.onDeleted,
}))(DrawTools);
