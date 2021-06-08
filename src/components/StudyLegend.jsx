import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import NotificationBadge from './NotificationBadge.jsx';
import Tooltip from './Tooltip.jsx';
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
} from './Icons.jsx';
import '../../sass/components/_studylegend.scss';
import { TooltipsContent } from '../Constant.js';

const StudyIcon = ({ Icon, props }) => <Icon {...props} />;

const EmptyView = () => (
    <div className='sc-studies--empty'>
        <EmptyStateIcon />
        <p>{t.translate('You have no active indicators yet.')}</p>
    </div>
);

const NoResultView = ({ text }) => (
    <div className='sc-studies--empty'>
        <strong>
            {t.translate('No results for')} “{text}”
        </strong>
        <p>{t.translate('Try checking your spelling or use a different term')}</p>
    </div>
);

const IndicatorList = ({ items, onSelectItem, onDeleteItem, onEditItem, onInfoItem, disableAll, isTick }) => (
    <div className='sc-studies__list'>
        {items.map(Item => (
            <div
                key={`item--${Item.id}`}
                className={classNames('sc-studies__list__item ', {
                    'sc-studies__list__item--disabled': disableAll,
                    'sc-studies__list__item--disabled-prediction': Item.isPrediction && isTick,
                })}
            >
                <Tooltip
                    className='sc-studies__list__item__box'
                    enabled={
                        !!((onEditItem || onDeleteItem) && Item.bars && Item.bars.length > 30) ||
                        (Item.isPrediction && isTick)
                    }
                    content={
                        Item.isPrediction && isTick
                            ? TooltipsContent.predictionIndicator
                            : `${Item.name} ${Item.bars ? `(${Item.bars})` : ''}`
                    }
                >
                    <div className='info' onClick={() => (onSelectItem ? onSelectItem(Item.id) : null)}>
                        <StudyIcon Icon={Item.icon} />
                        <div className='text'>
                            <span>{Item.name}</span>
                            {Item.bars && <small>({Item.bars})</small>}
                        </div>
                    </div>
                    <div className='detail'>
                        {onInfoItem && <InfoCircleIcon className='ic-info' onClick={() => onInfoItem(Item)} />}
                        {onEditItem && <SettingIcon onClick={() => onEditItem(Item.dataObject)} />}
                        {onDeleteItem && <DeleteIcon onClick={() => onDeleteItem(Item.dataObject.sd)} />}
                    </div>
                </Tooltip>
            </div>
        ))}
    </div>
);

const TabularDisplaySearchPanel = ({ categories, onSelectItem, onInfoItem, disableAll, isTick }) => (
    <Scroll autoHide>
        {categories.map(Category => (
            <div key={Category.id} className='sc-studies__category'>
                <div className='sc-studies__category__head'>{Category.name}</div>
                <div className='sc-studies__category__body'>
                    <IndicatorList
                        items={Category.foundItems}
                        onSelectItem={onSelectItem}
                        onInfoItem={onInfoItem}
                        disableAll={disableAll}
                        isTick={isTick}
                    />
                </div>
            </div>
        ))}
    </Scroll>
);

const TabularDisplayActivePanel = ({ items, onDeleteItem, onEditItem, clearAll, isMobile }) => (
    <React.Fragment>
        <div className='sc-studies__panel__head'>
            <p>
                {isMobile
                    ? t.translate('Up to 2 active indicators allowed.')
                    : t.translate('Up to 5 active indicators allowed.')}
            </p>
            <button type='button' className='sc-btn sc-btn--sm sc-btn--outline-secondary' onClick={() => clearAll()}>
                {t.translate('Clear all')}
            </button>
        </div>
        <div className='sc-studies__panel__content sc-studies__panel__content--active'>
            <IndicatorList items={items} onDeleteItem={onDeleteItem} onEditItem={onEditItem} />
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
    isTick,
}) => (
    <Tabs className='tabs--vertical' selectedIndex={selectedTab} onSelect={onSelectTab}>
        <TabList>
            <Tab key='hidden' className='hidden' />
            <Tab key='active'>
                <ActiveIcon />
                <span>{t.translate('Active')}</span>
                <NotificationBadge notificationCount={activeItems.length} />
            </Tab>
            {categories.map(Category => (
                <Tab key={`tab--${Category.id}`}>
                    <StudyIcon Icon={Category.icon} />
                    <span>{Category.name}</span>
                </Tab>
            ))}
        </TabList>
        <TabPanel key='panel--search'>
            <div className='sc-studies__panel sc-studies__panel--search'>
                {searchedCategories.length ? (
                    <TabularDisplaySearchPanel
                        categories={searchedCategories}
                        onSelectItem={onSelectItem}
                        onInfoItem={onInfoItem}
                        disableAll={activeItems.length === (isMobile ? 2 : 5)}
                        isTick={isTick}
                    />
                ) : (
                    <NoResultView text={searchQuery} />
                )}
            </div>
        </TabPanel>
        <TabPanel key='panel--active'>
            <div className='sc-studies__panel sc-studies__panel--active'>
                {activeItems.length ? (
                    <TabularDisplayActivePanel
                        clearAll={clearAll}
                        items={activeItems}
                        onDeleteItem={onDeleteItem}
                        onEditItem={onEditItem}
                        isMobile={isMobile}
                    />
                ) : (
                    <EmptyView />
                )}
            </div>
        </TabPanel>
        {categories.map(Category => (
            <TabPanel key={`panel--${Category.id}`}>
                <div className='sc-studies__panel'>
                    <h3>{Category.name}</h3>
                    <IndicatorList
                        onSelectItem={onSelectItem}
                        onInfoItem={onInfoItem}
                        items={Category.items}
                        disableAll={activeItems.length === maxAllowedItem}
                        isTick={isTick}
                    />
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
    isTick,
}) => {
    updatePortalNode(portalNodeId);
    return (
        <StudyMenu
            className='sc-studies'
            isOpened={isOpened}
            setOpen={setOpen}
            isMobile={isMobile}
            title={t.translate('Indicators')}
            tooltip={t.translate('Indicators')}
            modalMode
            enableTabular
            portalNodeId={portalNodeId}
            customHead={
                infoItem ? (
                    <div className='sc-dialog__head--info'>
                        <BackIcon onClick={() => onInfoItem(null)} />
                        {infoItem.name}
                    </div>
                ) : (
                    <div className='sc-dialog__head--search'>
                        <SearchInput />
                    </div>
                )
            }
        >
            <StudyMenu.Title>
                <div className={`sc-studies__menu ${menuOpen ? 'sc-studies__menu--active' : ''}`}>
                    <IndicatorIcon />
                    <NotificationBadge notificationCount={activeStudiesNo} />
                </div>
            </StudyMenu.Title>
            <StudyMenu.Body>
                {infoItem && (
                    <div className='sc-studies__info'>
                        <Scroll autoHide height='360px' className='sc-studies__info__content'>
                            <p>{infoItem.description}</p>
                        </Scroll>
                        <div className='sc-studies__info__footer'>
                            <Tooltip enabled={infoItem.disabledAddBtn} content={TooltipsContent.predictionIndicator}>
                                <button
                                    type='button'
                                    className='sc-btn sc-btn--primary sc-btn--w100'
                                    onClick={() => onSelectItem(infoItem.id)}
                                    disabled={infoItem.disabledAddBtn}
                                >
                                    {t.translate('Add')}
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                )}
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
                    isTick={isTick}
                />
            </StudyMenu.Body>
        </StudyMenu>
    );
};

export default connect(({ studies: st, chart, timeperiod }) => ({
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
    isTick: timeperiod.isTick,
}))(StudyLegend);
