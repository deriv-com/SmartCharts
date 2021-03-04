// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './NotificationBadge.jsx' was resolved to '... Remove this comment to see the full error message
import NotificationBadge from './NotificationBadge.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { DrawToolIcon, ActiveIcon, DeleteIcon, SettingIcon, EmptyStateIcon } from './Icons.jsx';
import '../../sass/components/_draw_tools.scss';

const ActivePanelView = ({
    enabled,
    children,
}: any) =>
    enabled ? (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-dtools--empty'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <EmptyStateIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <p>{t.translate('You have no active drawings yet.')}</p>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    ) : (
        children
    );

const Info = ({
    Icon,
    text,
    num,
    bars,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='info'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {Icon ? <Icon className='icon' /> : ''}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='text'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span>{t.translate(text, { num: num || ' ' })}</span>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            {bars ? <small>({bars} bars)</small> : ''}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const DrawToolsList = ({
    items,
    onClick,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-dtools__list'>
        {items.map((Item: any) => (
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
<div key={Item.id} className='sc-dtools__list__item' onClick={() => onClick(Item.id)}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Info Icon={Item.icon} text={Item.text} />
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>
))}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const ActiveDrawToolsListItem = ({
    item,
    onSetting,
    onDelete,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-dtools__list__item'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Info Icon={item.icon} text={item.text} bars={item.bars} num={item.num} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='actions'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SettingIcon onClick={() => onSetting(item.index)} />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DeleteIcon onClick={() => onDelete(item.index)} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const ActiveDrawToolsListGroup = ({
    group,
    onSetting,
    onDelete,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-dtools__category'>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-dtools__category__head'>{t.translate(group.name, { num: ' ' })}</div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-dtools__category__body'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-dtools__list'>
                {group.items.map((item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<ActiveDrawToolsListItem
                    key={`${item.index}`}
                    item={item}
                    onSetting={onSetting}
                    onDelete={onDelete}
/>
))}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const ActiveDrawToolsList = ({
    activeDrawToolsGroup,
    onSetting,
    onDelete,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Scroll autoHide height={320}>
        {activeDrawToolsGroup.map((group: any) => group.items && group.items.length === 1 ? (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <ActiveDrawToolsListItem
                key={group.key}
                item={group.items[0]}
                onSetting={onSetting}
                onDelete={onDelete}
            />
        ) : (
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <DrawToolsMenu
            className='sc-dtools'
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title={t.translate('Drawing tools')}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            tooltip={t.translate('Drawing tools')}
            modalMode
            enableTabular
            portalNodeId={portalNodeId}
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DrawToolsMenu.Title>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className={classNames('sc-dtools__menu', { 'sc-dtools__menu--active': menuOpen })}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <DrawToolIcon />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </DrawToolsMenu.Title>

            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <DrawToolsMenu.Body>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Tabs className='tabs--vertical'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <TabList>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <Tab>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <ActiveIcon />
                            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                            {t.translate('Active')}
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <NotificationBadge notificationCount={activeDrawToolsItemsNo} />
                        </Tab>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <Tab>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <DrawToolIcon />
                            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                            {t.translate('All drawings')}
                        </Tab>
                    </TabList>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <TabPanel>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='sc-dtools__panel'>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <ActivePanelView enabled={!activeDrawToolsItemsNo}>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='sc-dtools__panel__head'>
                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                    <button
                                        type='button'
                                        className='sc-btn sc-btn--sm sc-btn--outline-secondary'
                                        onClick={clearAll}
                                    >
                                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                        <span>{t.translate('Clear all')}</span>
                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                    </button>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </div>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='sc-dtools__panel__content sc-dtools__panel__content--active'>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <ActiveDrawToolsList
                                        activeDrawToolsGroup={activeDrawToolsGroup}
                                        onSetting={onSetting}
                                        onDelete={onDelete}
                                    />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </div>
                            </ActivePanelView>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    </TabPanel>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <TabPanel>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='sc-dtools__panel'>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <div className='sc-dtools__panel__content'>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <DrawToolsList items={drawToolsItems} onClick={selectTool} />
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </div>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    </TabPanel>
                </Tabs>
            </DrawToolsMenu.Body>
        </DrawToolsMenu>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
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
