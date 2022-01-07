import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useStores } from 'src/store';
import DrawToolsStore from 'src/store/DrawToolsStore';
import { ArrayElement, TIcon, TMainStore } from 'src/types';
import '../../sass/components/_draw_tools.scss';
import { ActiveIcon, DeleteIcon, DrawToolIcon, EmptyStateIcon, SettingIcon } from './Icons';
import Menu from './Menu';
import NotificationBadge from './NotificationBadge';
import Scroll from './Scroll';

type TActivePanelViewProps = {
    enabled: boolean;
    children?: React.ReactNode;
};

type TActiveDrawToolsListProps = {
    activeDrawToolsGroup: TMainStore['drawTools']['activeToolsGroup'];
    onSetting: TMainStore['drawTools']['onSetting'];
    onDelete: TMainStore['drawTools']['onDeleted'];
};

type InfoProps = {
    Icon?: TIcon;
    text?: string;
    num?: string | number;
    bars?: number | null;
};

type DrawToolsProps = {
    portalNodeId?: string;
};

type TActiveDrawToolsListGroupProps = {
    group: ArrayElement<TMainStore['drawTools']['activeToolsGroup']>;
    onSetting: TMainStore['drawTools']['onSetting'];
    onDelete: TMainStore['drawTools']['onDeleted'];
};

type TActiveDrawToolsListItemProps = {
    item: ArrayElement<ArrayElement<TMainStore['drawTools']['activeToolsGroup']>['items']>;
    onSetting: TMainStore['drawTools']['onSetting'];
    onDelete: TMainStore['drawTools']['onDeleted'];
};

type TDrawToolsListProps = {
    items: DrawToolsStore['drawToolsItems'];
    onClick: DrawToolsStore['selectTool'];
};

const ActivePanelView = ({ enabled, children }: TActivePanelViewProps) =>
    enabled ? (
        <div className='sc-dtools--empty'>
            <EmptyStateIcon />
            <p>{t.translate('You have no active drawings yet.')}</p>
        </div>
    ) : (
        <React.Fragment>{children}</React.Fragment>
    );

const Info = ({ Icon, text, num, bars }: InfoProps) => (
    <div className='info'>
        {Icon ? <Icon className='icon' /> : ''}
        <div className='text'>
            <span>{t.translate(text, { num: num || ' ' })}</span>
            {bars ? <small>({bars} bars)</small> : ''}
        </div>
    </div>
);

const DrawToolsList = ({ items, onClick }: TDrawToolsListProps) => (
    <div className='sc-dtools__list'>
        {items.map(Item => (
            <div key={Item.id} className='sc-dtools__list__item' onClick={() => onClick(Item.id)}>
                <Info Icon={Item.icon} text={Item.text} />
            </div>
        ))}
    </div>
);

const ActiveDrawToolsListItem = ({ item, onSetting, onDelete }: TActiveDrawToolsListItemProps) => (
    <div className='sc-dtools__list__item'>
        <Info Icon={item.icon} text={item.text} bars={item.bars} num={item.num} />
        <div className='actions'>
            <SettingIcon onClick={() => onSetting(item.index)} />
            <DeleteIcon onClick={() => onDelete(item.index)} />
        </div>
    </div>
);

const ActiveDrawToolsListGroup = ({ group, onSetting, onDelete }: TActiveDrawToolsListGroupProps) => (
    <div className='sc-dtools__category'>
        <div className='sc-dtools__category__head'>{t.translate(group.name, { num: ' ' })}</div>
        <div className='sc-dtools__category__body'>
            <div className='sc-dtools__list'>
                {group.items.map(item => (
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

const ActiveDrawToolsList = ({ activeDrawToolsGroup, onSetting, onDelete }: TActiveDrawToolsListProps) => (
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

const DrawTools = ({ portalNodeId }: DrawToolsProps) => {
    const { drawTools } = useStores();

    const {
        clearAll,
        selectTool,
        drawToolsItems,
        activeToolsNo: activeDrawToolsItemsNo,
        activeToolsGroup: activeDrawToolsGroup,
        onDeleted: onDelete,
        onSetting,
        updatePortalNode,
        menuStore,
    } = drawTools;

    const menuOpen = menuStore.open;

    updatePortalNode(portalNodeId);
    return (
        <Menu
            store={menuStore}
            className='sc-dtools'
            title={t.translate('Drawing tools')}
            tooltip={t.translate('Drawing tools')}
            modalMode
            enableTabular
            portalNodeId={portalNodeId}
        >
            <Menu.Title>
                <div className={classNames('sc-dtools__menu', { 'sc-dtools__menu--active': menuOpen })}>
                    <DrawToolIcon />
                    <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                </div>
            </Menu.Title>

            <Menu.Body>
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
            </Menu.Body>
        </Menu>
    );
};

export default observer(DrawTools);
