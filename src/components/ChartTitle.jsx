import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-title.scss';

const ChartTitle = ({
    chartId,
    ChartTitleMenu,
    currentSymbol,
    enabled,
    isMobile,
    MarketSelector,
    portalNode,
    onChange,
    SymbolSelectButton,
    setMenuOpen,
    searchInputClassName,
    onMouseEnter,
    onMouseLeave,
}) => {
    if (!currentSymbol) { return null; }

    return (
        <ChartTitleMenu
            enabled={enabled}
            className="cq-chart-title stx-show cq-symbols-display"
            isFullscreen
            portalNode={portalNode}
            title={isMobile ? t.translate('Underlying Assets') : ''}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <ChartTitleMenu.Title>
                <SymbolSelectButton />
            </ChartTitleMenu.Title>
            <ChartTitleMenu.Body>
                <MarketSelector
                    searchInputClassName={searchInputClassName}
                    onSelectItem={(x) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol, chartId);
                        }
                        setMenuOpen(false);
                    }}
                />
            </ChartTitleMenu.Body>
        </ChartTitleMenu>
    );
};

export default connect(({ chartTitle: c, chart, state }) => ({
    chartId           : state.chartId,
    ChartTitleMenu    : c.ChartTitleMenu,
    currentSymbol     : c.currentSymbol,
    isMobile          : chart.isMobile,
    MarketSelector    : c.MarketSelector,
    onChange          : c.setSymbol,
    setMenuOpen       : c.menu.setOpen,
    SymbolSelectButton: c.SymbolSelectButton,
    onMouseEnter      : c.onMouseEnter,
    onMouseLeave      : c.onMouseLeave,
}))(ChartTitle);
