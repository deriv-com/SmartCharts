import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './NotificationBadge' was resolved to '... Remove this comment to see the full error message
import NotificationBadge from './NotificationBadge';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { DrawToolIcon, ActiveIcon, DeleteIcon, SettingIcon, EmptyStateIcon } from './Icons';
import '../../sass/components/_draw_tools.scss';

const ActivePanelView = ({ enabled, children }: any) =>
    enabled ? (
        <div className='sc-dtools--empty'>
            <EmptyStateIcon />
            <p>{t.translate('You have no active drawings yet.')}</p>
        </div>
    ) : (
        children
    );

const Info = ({ Icon, text, num, bars }: any) => (
    <div className='info'>
        {Icon ? <Icon className='icon' /> : ''}
        <div className='text'>
            <span>{t.translate(text, { num: num || ' ' })}</span>
            {bars ? <small>({bars} bars)</small> : ''}
        </div>
    </div>
);

const DrawToolsList = ({ items, onClick }: any) => (
    <div className='sc-dtools__list'>
        {items.map((Item: any) => (
            <div key={Item.id} className='sc-dtools__list__item' onClick={() => onClick(Item.id)}>
                <Info Icon={Item.icon} text={Item.text} />
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove
                this comment to see the full error message
            </div>
        ))}
    </div>
);

const ActiveDrawToolsListItem = ({ item, onSetting, onDelete }: any) => (
    <div className='sc-dtools__list__item'>
        <Info Icon={item.icon} text={item.text} bars={item.bars} num={item.num} />
        <div className='actions'>
            <SettingIcon onClick={() => onSetting(item.index)} />
            <DeleteIcon onClick={() => onDelete(item.index)} />
        </div>
    </div>
);

const ActiveDrawToolsListGroup = ({ group, onSetting, onDelete }: any) => (
    <div className='sc-dtools__category'>
        <div className='sc-dtools__category__head'>{t.translate(group.name, { num: ' ' })}</div>
        <div className='sc-dtools__category__body'>
            <div className='sc-dtools__list'>
                {group.items.map((item: any) => (
                    <ActiveDrawToolsListItem
                        key={`${item.index}`}
                        item={item}
                        onSetting={onSetting}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    </div>
);

const ActiveDrawToolsList = ({ activeDrawToolsGroup, onSetting, onDelete }: any) => (
    <Scroll autoHide height={320}>
        {activeDrawToolsGroup.map((group: any) =>
            group.items && group.items.length === 1 ? (
                <ActiveDrawToolsListItem
                    key={group.key}
                    item={group.items[0]}
                    onSetting={onSetting}
                    onDelete={onDelete}
                />
            ) : (
                <ActiveDrawToolsListGroup key={group.key} group={group} onSetting={onSetting} onDelete={onDelete} />
            )
        )}
    </Scroll>
);

const DrawTools = ({
    clearAll,
    selectTool,
    DrawToolsMenu,
    menuOpen,
    drawToolsItems,
    activeDrawToolsItemsNo,
    activeDrawToolsGroup,
    onSetting,
    onDelete,
    portalNodeId,
    updatePortalNode,
}: any) => {
    updatePortalNode(portalNodeId);
    return (
        <DrawToolsMenu
            className='sc-dtools'
            title={t.translate('Drawing tools')}
            tooltip={t.translate('Drawing tools')}
            modalMode
            enableTabular
            portalNodeId={portalNodeId}
        >
            <DrawToolsMenu.Title>
                <div className={classNames('sc-dtools__menu', { 'sc-dtools__menu--active': menuOpen })}>
                    <DrawToolIcon />
                    <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                </div>
            </DrawToolsMenu.Title>

            <DrawToolsMenu.Body>
                <Tabs className='tabs--vertical'>
                    <TabList>
                        <Tab>
                            <ActiveIcon />
                            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                            {t.translate('Active')}
                            <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                        </Tab>
                        <Tab>
                            <DrawToolIcon />
                            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                            {t.translate('All drawings')}
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <div className='sc-dtools__panel'>
                            <ActivePanelView enabled={!activeDrawToolsItemsNo}>
                                <div className='sc-dtools__panel__head'>
                                    <button
                                        type='button'
                                        className='sc-btn sc-btn--sm sc-btn--outline-secondary'
                                        onClick={clearAll}
                                    >
                                        <span>{t.translate('Clear all')}</span>
                                    </button>
                                </div>
                                <div className='sc-dtools__panel__content sc-dtools__panel__content--active'>
                                    <ActiveDrawToolsList
                                        activeDrawToolsGroup={activeDrawToolsGroup}
                                        onSetting={onSetting}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </ActivePanelView>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='sc-dtools__panel'>
                            <div className='sc-dtools__panel__content'>
                                <DrawToolsList items={drawToolsItems} onClick={selectTool} />
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </DrawToolsMenu.Body>
        </DrawToolsMenu>
    );
};

export default connect(({ drawTools: dt }) => ({
    clearAll: dt.clearAll,
    selectTool: dt.selectTool,
    DrawToolsMenu: dt.DrawToolsMenu,
    menuOpen: dt.menu.open,
    drawToolsItems: dt.drawToolsItems,
    activeDrawToolsItemsNo: dt.activeToolsNo,
    activeDrawToolsGroup: dt.activeToolsGroup,
    onSetting: dt.onSetting,
    onDelete: dt.onDeleted,
    updatePortalNode: dt.updatePortalNode,
}))(DrawTools);
