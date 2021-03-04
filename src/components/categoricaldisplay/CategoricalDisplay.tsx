// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Scroll.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Scroll from '../Scroll.jsx';
import '../../../sass/components/_categorical-display.scss';

const CategoricalDisplay = ({
    onSelectItem,
    setFilterText,
    updateScrollSpy,
    setScrollPanel,
    ResultsPanel,
    FilterPanel,
    height,
    id,
    SearchInput,
    searchInputClassName,
    disableAll,
    isNestedList,
    isMobile,
}: any) => {
    const innerPanel = (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={`sc-mcd ${isNestedList ? 'sc-mcd--nested' : ''}`} style={{ height }} id={id}>
            {!isMobile && (
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='sc-mcd__tabs'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-mcd__tabs__head'>{t.translate('Markets')}</div>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='sc-mcd__tabs__body'>{!isNestedList && <FilterPanel />}</div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            )}
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-mcd__content'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-mcd__content__head'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <SearchInput searchInputClassName={searchInputClassName} />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-mcd__content__body'>
                    {isMobile ? (
                        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <div className='sc-mcd__content__body__scroll' onScroll={updateScrollSpy} ref={setScrollPanel}>
                            {innerPanel}
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    ) : (
                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Scroll autoHide onScroll={updateScrollSpy} setPanel={setScrollPanel}>
                            {innerPanel}
                        </Scroll>
                    )}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

export default CategoricalDisplay;
