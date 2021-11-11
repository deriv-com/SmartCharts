import React from 'react';
import { observer } from 'mobx-react-lite';
import CategoricalDisplayStore from 'src/store/CategoricalDisplayStore';
import Scroll from '../Scroll';
import '../../../sass/components/_categorical-display.scss';

type TCategoricalDisplay = {
    store: CategoricalDisplayStore;
    searchInputClassName?: string;
    isNestedList?: boolean;
    id?: string;
    onSelectItem: (item: any) => void;
    disableAll?: boolean;
};

const CategoricalDisplay: React.FC<TCategoricalDisplay> = ({
    store,
    id,
    searchInputClassName,
    disableAll,
    isNestedList,
    onSelectItem: onSelectItemProp,
}) => {
    const { updateScrollSpy, setScrollPanel, ResultsPanel, FilterPanel, SearchInput, setFilterText, height } = store;

    const onSelectItem = onSelectItemProp || store.onSelectItem;

    const { isMobile } = store.chart;

    const innerPanel = (
        <ResultsPanel
            onSelectItem={(item: any) => {
                onSelectItem(item);
                setFilterText('');
            }}
            id={id}
            disableAll={disableAll}
            isNestedList={isNestedList}
        />
    );

    return (
        <div className={`sc-mcd ${isNestedList ? 'sc-mcd--nested' : ''}`} style={{ height }} id={id}>
            {!isMobile && (
                <div className='sc-mcd__tabs'>
                    <div className='sc-mcd__tabs__head'>{t.translate('Markets')}</div>
                    <div className='sc-mcd__tabs__body'>{!isNestedList && <FilterPanel />}</div>
                </div>
            )}
            <div className='sc-mcd__content'>
                <div className='sc-mcd__content__head'>
                    <SearchInput searchInputClassName={searchInputClassName} />
                </div>
                <div className='sc-mcd__content__body'>
                    {isMobile ? (
                        <div className='sc-mcd__content__body__scroll' onScroll={updateScrollSpy} ref={setScrollPanel}>
                            {innerPanel}
                        </div>
                    ) : (
                        <Scroll autoHide onScroll={updateScrollSpy} setPanel={setScrollPanel}>
                            {innerPanel}
                        </Scroll>
                    )}
                </div>
            </div>
        </div>
    );
};

export default observer(CategoricalDisplay);
