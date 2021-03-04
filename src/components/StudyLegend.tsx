// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// @ts-expect-error ts-migrate(6142) FIXME: Module './NotificationBadge.jsx' was resolved to '... Remove this comment to see the full error message
import NotificationBadge from './NotificationBadge.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Scroll.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Scroll from './Scroll.jsx';
import { connect } from '../store/Connect';
import {
    IndicatorIcon,
    ActiveIcon,
    EmptyStateIcon,
    SettingIcon,
    DeleteIcon,
    InfoCircleIcon,
    BackIcon,
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
} from './Icons.jsx';
import '../../sass/components/_studylegend.scss';

const StudyIcon = ({
    Icon,
    props,
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
}: any) => <Icon {...props} />;

const EmptyView = () => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-studies--empty'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <EmptyStateIcon />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <p>{t.translate('You have no active indicators yet.')}</p>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const NoResultView = ({
    text,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-studies--empty'>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <strong>
            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
            {t.translate('No results for')} “{text}”
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </strong>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <p>{t.translate('Try checking your spelling or use a different term')}</p>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const IndicatorList = ({
    items,
    onSelectItem,
    onDeleteItem,
    onEditItem,
    onInfoItem,
    disableAll,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='sc-studies__list'>
        {items.map((Item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Tooltip
            key={`item--${Item.id}`}
            className={`sc-studies__list__item ${disableAll && 'sc-studies__list__item--disabled'}`}
            enabled={!!((onEditItem || onDeleteItem) && Item.bars && Item.bars.length > 30)}
            content={`${Item.name} ${Item.bars ? `(${Item.bars})` : ''}`}
>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='info' onClick={() => (onSelectItem ? onSelectItem(Item.id) : null)}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <StudyIcon Icon={Item.icon} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='text'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <span>{Item.name}</span>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    {Item.bars && <small>({Item.bars})</small>}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='detail'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {onInfoItem && <InfoCircleIcon className='ic-info' onClick={() => onInfoItem(Item)} />}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {onEditItem && <SettingIcon onClick={() => onEditItem(Item.dataObject)} />}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                {onDeleteItem && <DeleteIcon onClick={() => onDeleteItem(Item.dataObject.sd)} />}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
</Tooltip>
))}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

const TabularDisplaySearchPanel = ({
    categories,
    onSelectItem,
    onInfoItem,
    disableAll,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Scroll autoHide>
        {categories.map((Category: any) => (
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
<div key={Category.id} className='sc-studies__category'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-studies__category__head'>{Category.name}</div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-studies__category__body'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <IndicatorList
                    items={Category.foundItems}
                    onSelectItem={onSelectItem}
                    onInfoItem={onInfoItem}
                    disableAll={disableAll}
                />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
</div>
))}
    </Scroll>
);

const TabularDisplayActivePanel = ({
    items,
    onDeleteItem,
    onEditItem,
    clearAll,
    isMobile,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <React.Fragment>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-studies__panel__head'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <p>
                {isMobile
                    ? // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                      t.translate('Up to 2 active indicators allowed.')
                    : // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                      t.translate('Up to 5 active indicators allowed.')}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </p>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <button type='button' className='sc-btn sc-btn--sm sc-btn--outline-secondary' onClick={() => clearAll()}>
                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                {t.translate('Clear all')}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </button>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='sc-studies__panel__content sc-studies__panel__content--active'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <IndicatorList items={items} onDeleteItem={onDeleteItem} onEditItem={onEditItem} />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    </React.Fragment>
);

const TabularDisplay = ({
    onSelectTab,
    selectedTab,
    categories,
    searchedCategories,
    onSelectItem,
    onDeleteItem,
    onEditItem,
    onInfoItem,
    activeItems,
    clearAll,
    searchQuery,
    isMobile,
    maxAllowedItem,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Tabs className='tabs--vertical' selectedIndex={selectedTab} onSelect={onSelectTab}>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <TabList>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Tab key='hidden' className='hidden' />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Tab key='active'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ActiveIcon />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span>{t.translate('Active')}</span>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <NotificationBadge notificationCount={activeItems.length} />
            </Tab>
            {categories.map((Category: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Tab key={`tab--${Category.id}`}>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <StudyIcon Icon={Category.icon} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span>{Category.name}</span>
</Tab>
))}
        </TabList>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <TabPanel key='panel--search'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-studies__panel'>
                {searchedCategories.length ? (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <TabularDisplaySearchPanel
                        categories={searchedCategories}
                        onSelectItem={onSelectItem}
                        onInfoItem={onInfoItem}
                        disableAll={activeItems.length === (isMobile ? 2 : 5)}
                    />
                ) : (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <NoResultView text={searchQuery} />
                )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </TabPanel>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <TabPanel key='panel--active'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-studies__panel sc-studies__panel--active'>
                {activeItems.length ? (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <TabularDisplayActivePanel
                        clearAll={clearAll}
                        items={activeItems}
                        onDeleteItem={onDeleteItem}
                        onEditItem={onEditItem}
                        isMobile={isMobile}
                    />
                ) : (
                    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <EmptyView />
                )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </TabPanel>
        {categories.map((Category: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<TabPanel key={`panel--${Category.id}`}>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-studies__panel'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <h3>{Category.name}</h3>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <IndicatorList
                    onSelectItem={onSelectItem}
                    onInfoItem={onInfoItem}
                    items={Category.items}
                    disableAll={activeItems.length === maxAllowedItem}
                />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
</TabPanel>
))}
    </Tabs>
);

const StudyLegend = ({
    isOpened,
    setOpen,
    StudyMenu,
    menuOpen,
    isMobile,
    activeStudiesNo,
    items,
    searchedItems,
    SearchInput,
    searchQuery,
    selectedTab,
    onSelectTab,
    onSelectItem,
    onInfoItem,
    activeItems,
    deleteAll,
    deleteStudy,
    editStudy,
    infoItem,
    portalNodeId,
    updatePortalNode,
    maxAllowedItem,
}: any) => {
    updatePortalNode(portalNodeId);
    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <StudyMenu
            className='sc-studies'
            isOpened={isOpened}
            setOpen={setOpen}
            isMobile={isMobile}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title={t.translate('Indicators')}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            tooltip={t.translate('Indicators')}
            modalMode
            enableTabular
            portalNodeId={portalNodeId}
            customHead={
                infoItem ? (
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div className='sc-dialog__head--info'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <BackIcon onClick={() => onInfoItem(null)} />
                        {infoItem.name}
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                ) : (
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div className='sc-dialog__head--search'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <SearchInput />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                )
            }
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <StudyMenu.Title>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className={`sc-studies__menu ${menuOpen ? 'sc-studies__menu--active' : ''}`}>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <IndicatorIcon />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <NotificationBadge notificationCount={activeStudiesNo} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            </StudyMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <StudyMenu.Body>
                {infoItem && (
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div className='sc-studies__info'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <Scroll autoHide height='360px' className='studies__info__content'>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <p>{infoItem.description}</p>
                        </Scroll>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <button
                            type='button'
                            className='sc-btn sc-btn--primary sc-btn--w100'
                            onClick={() => onSelectItem(infoItem.id)}
                        >
                            {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                            {t.translate('Add')}
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </button>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                )}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <TabularDisplay
                    onSelectTab={onSelectTab}
                    selectedTab={selectedTab}
                    categories={items}
                    searchedCategories={searchedItems}
                    onSelectItem={onSelectItem}
                    onDeleteItem={deleteStudy}
                    onEditItem={editStudy}
                    onInfoItem={onInfoItem}
                    activeItems={activeItems}
                    clearAll={deleteAll}
                    searchQuery={searchQuery}
                    isMobile={isMobile}
                    maxAllowedItem={maxAllowedItem}
                />
            </StudyMenu.Body>
        </StudyMenu>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    studies: st,
    chart,
}: any) => ({
    isOpened: st.open,
    setOpen: st.setOpen,
    StudyMenu: st.StudyMenu,
    menuOpen: st.menu.open,
    isMobile: chart.isMobile,
    activeStudiesNo: st.activeItems.length,
    deleteAll: st.deleteAllStudies,
    items: st.items,
    searchedItems: st.searchedItems,
    SearchInput: st.SearchInput,
    searchQuery: st.filterText,
    selectedTab: st.selectedTab,
    onSelectTab: st.onSelectTab,
    onSelectItem: st.onSelectItem,
    activeItems: st.activeItems,
    deleteStudy: st.deleteStudy,
    editStudy: st.editStudy,
    onInfoItem: st.onInfoItem,
    infoItem: st.infoItem,
    updatePortalNode: st.updatePortalNode,
    maxAllowedItem: st.maxAllowedItem,
}))(StudyLegend);
