import React from 'react';
import Scrollbars from 'tt-react-custom-scrollbars';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NotificationBadge from './NotificationBadge.jsx';
import { connect } from '../store/Connect';
import { IndicatorIcon, ActiveStateIcon, EmptyStateIcon, SettingIcon, DeleteIcon, InfoCircleIcon } from './Icons.jsx';
import '../../sass/components/_sc-studies.scss';

const EmptyView = () => (
    <div className="sc-studies--empty">
        <EmptyStateIcon />
        <p>{t.translate('You have no active indicators yet.')}</p>
    </div>
);

const NoResultView = () => (
    <div className="sc-studies--empty">
        <EmptyStateIcon />
        <p>{t.translate('No result found.')}</p>
    </div>
);

const IndicatorList = ({ items, onSelectItem, onDeleteItem, onEditItem, onInfoItem, disableAll }) => (
    <div className="sc-studies__list">
        {items.map(Item => (
            <div
                key={`item--${Item.id}`}
                className={`sc-studies__list__item ${disableAll ? 'sc-studies__list__item--disabled' : ''}`}
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

const TabularDisplaySearchPanel = ({ categories, onSelectItem, disableAll }) => (
    <Scrollbars
        autoHeight
        autoHeightMax={360}
        className="sc-studies__scroll"
    >
        {categories.map(Category => (
            <div key={Category.id} className="sc-studies__category">
                <div className="sc-studies__category__head">
                    {Category.name}
                </div>
                <div className="sc-studies__category__body">
                    <IndicatorList
                        items={Category.foundItems}
                        onSelectItem={onSelectItem}
                        disableAll={disableAll}
                    />
                </div>
            </div>
        ))}
    </Scrollbars>
);

const TabularDisplayActivePanel = ({ items, onDeleteItem, onEditItem, clearAll }) => (
    <React.Fragment>
        <div className="sc-studies__panel__head">
            <p>{t.translate('Up to 5 active indicators allowed.')}</p>
            <button
                type="button"
                className="sc-btn sc-btn--sm sc-btn--outline-secondary"
                onClick={() => clearAll()}
            >
                {t.translate('Clear All')}
            </button>
        </div>
        <div className="sc-studies__panel__body">
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
            <div className="sc-studies__panel">
                {
                    searchedCategories.length
                        ? (
                            <TabularDisplaySearchPanel
                                categories={searchedCategories}
                                onSelectItem={onSelectItem}
                                disableAll={activeItems.length === 5}
                            />
                        )
                        : (<NoResultView />)
                }
            </div>
        </TabPanel>
        <TabPanel key="panel--active">
            <div className="sc-studies__panel">
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
                <div className="sc-studies__panel">
                    <Scrollbars
                        autoHeight
                        autoHeightMax={360}
                        className="sc-studies__scroll"
                    >
                        <IndicatorList
                            onSelectItem={onSelectItem}
                            onInfoItem={onInfoItem}
                            items={Category.items}
                            disableAll={activeItems.length === 5}
                        />
                    </Scrollbars>
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
        className="sc-studies"
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
                <div className="sc-studies__info">
                    <p>
                        {infoItem.description}
                    </p>
                    <button
                        type="button"
                        className="sc-btn sc-btn--primary sc-btn--w100"
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
    isMobile: chart.isMobile,
    activeStudiesNo: st.activeItems.length,
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
