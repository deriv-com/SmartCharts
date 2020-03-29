import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from '../store/Connect';
import {
    DrawToolIcon,
    ActiveIcon,
    DeleteIcon,
    SettingIcon,
    EmptyStateIcon,
} from './Icons.jsx';
import '../../sass/components/_draw-tools.scss';


const EmptyView = () => (
    <div className="ciq-draw-tools--empty">
        <EmptyStateIcon />
        <p>{t.translate('You have no active drawings yet.')}</p>
    </div>
);

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
                    {Item.icon ? (<Item.icon />) : ''}
                    <span>{Item.text}</span>
                </div>
                <div className="ciq-draw-tools__list__item__actions">
                    {Item.bars ? (<small>({Item.bars} bars)</small>) : ''}
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
            <DrawToolIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Draw tools')}
            />
        </DrawToolsMenu.Title>

        <DrawToolsMenu.Body>
            <Tabs className="tabs--vertical">
                <TabList>
                    <Tab><ActiveIcon />{t.translate('Active')}</Tab>
                    <Tab><DrawToolIcon />{t.translate('All drawings')}</Tab>
                </TabList>
                <TabPanel>
                    <div className="ciq-draw-tools__panel">
                        {
                            (activeDrawToolsItems && activeDrawToolsItems.length)
                                ? (
                                <>
                                    <div className="ciq-draw-tools__panel__head">
                                        <button type="button" className="sc-btn sc-btn--sm sc-btn--outline-secondary" onClick={clearAll}>
                                            <span>{t.translate('Clear all')}</span>
                                        </button>
                                    </div>
                                    <div className="ciq-draw-tools__panel__content">
                                        <ActiveDrawToolsList
                                            items={activeDrawToolsItems}
                                            onSetting={onSetting}
                                            onDelete={onDelete}
                                        />
                                    </div>
                                </>
                                )
                                : (<EmptyView />)
                        }
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
