import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NotificationBadge from './NotificationBadge.jsx';
import { connect } from '../store/Connect';
import { IndicatorIcon, ActiveStateIcon, EmptyStateIcon, SettingIcon, DeleteIcon, InfoCircleIcon } from './Icons.jsx';
import '../../sass/components/_ciq-indicator.scss';

const EmptyView = () => (
    <div className="ciq-indicator--empty">
        <EmptyStateIcon />
        <p>{t.translate('You have no active indicators yet.')}</p>
    </div>
);

const NoResultView = () => (
    <div className="ciq-indicator--empty">
        <EmptyStateIcon />
        <p>{t.translate('No result found.')}</p>
    </div>
);

const IndicatorList = ({ items, onSelectItem, onDeleteItem, onEditItem, onInfoItem }) => (
    <div className="ciq-indicator__list">
        {items.map(Item => (
            <div
                key={`item--${Item.id}`}
                className="ciq-indicator__list__item"
            >
                <div
                    className="info"
                    onClick={() => (onSelectItem ? onSelectItem(Item.id) : null)}
                >
                    <Item.icon />
                    {Item.name}
                </div>
                <div className="detail">
                    {Item.bars ? (<span>{Item.bars}</span>) : ''}
                    {onInfoItem ? (<InfoCircleIcon className="ic-info" onClick={() => onInfoItem(Item)} />) : ''}
                    {onEditItem ? (<SettingIcon onClick={() => onEditItem(Item.dataObject)} />) : ''}
                    {onDeleteItem ? (<DeleteIcon onClick={() => onDeleteItem(Item.dataObject.sd)} />) : ''}
                </div>
            </div>
        ))}
    </div>
);

const TabularDisplaySearchPanel = ({ categories, onSelectItem }) => (
    <Scrollbars
        autoHeight
        autoHeightMax={360}
        className="ciq-indicator__scroll"
    >
        {categories.map(Category => (
            <div key={Category.id} className="ciq-indicator__category">
                <div className="ciq-indicator__category__head">
                    {Category.name}
                </div>
                <div className="ciq-indicator__category__body">
                    <IndicatorList
                        items={Category.foundItems}
                        onSelectItem={onSelectItem}
                    />
                </div>
            </div>
        ))}
    </Scrollbars>
);

const TabularDisplayActivePanel = ({ items, onDeleteItem, onEditItem, clearAll }) => (
    <React.Fragment>
        <div className="ciq-indicator__panel__head">
            <p>{t.translate('Up to 5 active indicators allowed.')}</p>
            <button
                type="button"
                className="btn btn--sm btn--outline-secondary"
                onClick={() => clearAll()}
            >
                {t.translate('Clear All')}
            </button>
        </div>
        <div className="ciq-indicator__panel__body">
            <IndicatorList
                items={items}
                onDeleteItem={onDeleteItem}
                onEditItem={onEditItem}
            />
        </div>
    </React.Fragment>
);


const TabularDisplay = ({ onSelectTab, selectedTab, categories, searchedCategories, onSelectItem, onDeleteItem, onEditItem, onInfoItem, activeItems, clearAll }) => (
    <Tabs
        className="tabs--vertical"
        selectedIndex={selectedTab}
        onSelect={onSelectTab}
    >
        <TabList>
            <Tab key="hidden" className="hidden" />
            <Tab key="active">
                <ActiveStateIcon />
                {t.translate('Active')}
                {
                    activeItems.length
                        ? (<span className="budget">{activeItems.length}</span>)
                        : ''
                }
            </Tab>
            {categories.map(Category => (
                <Tab key={`tab--${Category.id}`}>
                    <Category.icon />
                    {Category.name}
                </Tab>
            ))}
        </TabList>
        <TabPanel key="panel--search">
            <div className="ciq-indicator__panel">
                {
                    searchedCategories.length
                        ? (
                            <TabularDisplaySearchPanel
                                categories={searchedCategories}
                                onSelectItem={onSelectItem}
                            />
                        )
                        : (<NoResultView />)
                }
            </div>
        </TabPanel>
        <TabPanel key="panel--active">
            <div className="ciq-indicator__panel">
                {
                    activeItems.length
                        ? (
                            <TabularDisplayActivePanel
                                clearAll={clearAll}
                                items={activeItems}
                                onDeleteItem={onDeleteItem}
                                onEditItem={onEditItem}
                            />
                        )
                        : (<EmptyView />)
                }
            </div>
        </TabPanel>
        {categories.map(Category => (
            <TabPanel key={`panel--${Category.id}`}>
                <div className="ciq-indicator__panel">
                    <IndicatorList
                        onSelectItem={onSelectItem}
                        onInfoItem={onInfoItem}
                        items={Category.items}
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
    selectedTab,
    onSelectTab,
    onSelectItem,
    onInfoItem,
    activeItems,
    deleteAll,
    deleteStudy,
    editStudy,
    infoItem,
}) => (
    <StudyMenu
        className="ciq-indicator"
        isOpened={isOpened}
        setOpen={setOpen}
        isMobile={isMobile}
        title={t.translate('Indicators')}
        subTitle={infoItem ? infoItem.name : null}
        onBack={() => onInfoItem(null)}
        newStyle
        enableTabular
    >
        <StudyMenu.Title>
            <IndicatorIcon
                className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                tooltip-title={t.translate('Indicators')}
            />
            <NotificationBadge notificationCount={activeStudiesNo} />
        </StudyMenu.Title>
        <StudyMenu.Body>
            <SearchInput />
            {infoItem ? (
                <div className="ciq-indicator__info">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => onSelectItem(infoItem.id)}
                    >
                        {t.translate('Add')}
                    </button>
                </div>
            ) : ''}
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
            />
        </StudyMenu.Body>
    </StudyMenu>
);

export default connect(({ studies: st, chart }) => ({
    isOpened: st.open,
    setOpen: st.setOpen,
    StudyMenu: st.StudyMenu,
    menuOpen: st.menu.open,
    StudyCategoricalDisplay: st.StudyCategoricalDisplay,
    isMobile: chart.isMobile,
    activeStudiesNo: st.activeStudies.data.length,
    disableAll: st.hasReachedLimits,
    deleteAll: st.deleteAllStudies,
    items: st.items,
    searchedItems: st.searchedItems,
    SearchInput: st.SearchInput,
    selectedTab: st.selectedTab,
    onSelectTab: st.onSelectTab,
    onSelectItem: st.onSelectItem,
    activeItems: st.activeItems,
    deleteStudy: st.deleteStudy,
    editStudy: st.editStudy,
    onInfoItem: st.onInfoItem,
    infoItem: st.infoItem,
}))(StudyLegend);
