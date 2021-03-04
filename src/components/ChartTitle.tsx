// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import ReactDOM from 'react-dom';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-title.scss';

const ChartTitle = (props: any) => {
    const {
        chartId,
        ChartTitleMenu,
        containerId,
        currentSymbol,
        enabled,
        isMobile,
        MarketSelector,
        portalNodeId,
        onChange,
        SymbolSelectButton,
        setMenuOpen,
        searchInputClassName,
        theme,
        onMouseEnter,
        onMouseLeave,
        open,
        open_market,
        isNestedList,
    } = props;

    React.useEffect(() => {
        const { updateProps, ...otherProps } = props;
        updateProps(otherProps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, open_market]);

    if (!currentSymbol) {
        return null;
    }

    const ChartTitleContainer = (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ChartTitleMenu
            enabled={enabled}
            className='cq-chart-title stx-show cq-symbols-display'
            isFullscreen
            portalNodeId={portalNodeId}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title={isMobile ? t.translate('Underlying Assets') : ''}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTitleMenu.Title>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <SymbolSelectButton />
            </ChartTitleMenu.Title>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartTitleMenu.Body>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <MarketSelector
                    portalNodeId={portalNodeId}
                    isNestedList={isNestedList}
                    searchInputClassName={searchInputClassName}
                    onSelectItem={(x: any) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol, chartId);
                        }
                        setMenuOpen(false);
                    }}
                />
            </ChartTitleMenu.Body>
        </ChartTitleMenu>
    );

    if (containerId) {
        return ReactDOM.createPortal(
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className={`smartcharts-${theme}`}>{ChartTitleContainer}</div>,
            document.getElementById(containerId)
        );
    }

    return ChartTitleContainer;
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chartTitle: c,
    chart,
    chartSetting,
}: any) => ({
    chartId: chart.chartId,
    ChartTitleMenu: c.ChartTitleMenu,
    currentSymbol: c.currentSymbol,
    isMobile: chart.isMobile,
    MarketSelector: c.MarketSelector,
    onChange: c.setSymbol,
    setMenuOpen: c.menu.setOpen,
    SymbolSelectButton: c.SymbolSelectButton,
    onMouseEnter: c.onMouseEnter,
    onMouseLeave: c.onMouseLeave,
    updateProps: c.updateProps,
    theme: chartSetting.theme,
}))(ChartTitle);
