import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { TMainStore } from 'src/types';
import Scroll from './Scroll';
import NotificationBadge from './NotificationBadge';
import { DrawToolIcon, ActiveIcon, DeleteIcon, SettingIcon, EmptyStateIcon } from './Icons';
import '../../sass/components/_draw_tools.scss';
import { useStores } from 'src/store';

type TActivePanelViewProps = {
    enabled: boolean;
};

const ActivePanelView: React.FC<TActivePanelViewProps> = ({ enabled, children }) =>
    enabled ? (
        <div className='sc-dtools--empty'>
            <EmptyStateIcon />
            <p>{t.translate('You have no active drawings yet.')}</p>
        </div>
    ) : (
        <React.Fragment>{children ? children : null}</React.Fragment>
    );

type InfoProps = {
    Icon: (props: any) => JSX.Element;
    text: string;
    num?: number;
    bars?: any;
};

const Info: React.FC<InfoProps> = ({ Icon, text, num, bars }) => (
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

type TActiveDrawToolsListProps = {
    activeDrawToolsGroup: TMainStore['drawTools']['activeToolsGroup'];
    onSetting: TMainStore['drawTools']['onSetting'];
    onDelete: TMainStore['drawTools']['onDeleted'];
};

const ActiveDrawToolsList: React.FC<TActiveDrawToolsListProps> = ({ activeDrawToolsGroup, onSetting, onDelete }) => (
    <Scroll autoHide height={320}>
        {activeDrawToolsGroup.map(group =>
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

type DrawToolsProps = {
    portalNodeId: string;
};

const DrawTools: React.FC<DrawToolsProps> = ({ portalNodeId }) => {
    const { drawTools } = useStores();

    const {
        clearAll,
        selectTool,
        DrawToolsMenu,
        drawToolsItems,
        activeToolsNo: activeDrawToolsItemsNo,
        activeToolsGroup: activeDrawToolsGroup,
        onDeleted: onDelete,
        onSetting,
        updatePortalNode,
    } = drawTools;

    const menuOpen = drawTools.menu.open;

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
                            {t.translate('Active')}
                            <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                        </Tab>
                        <Tab>
                            <DrawToolIcon />
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

export default observer(DrawTools);
