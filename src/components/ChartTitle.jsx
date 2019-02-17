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
    onChange,
    SymbolSelectButton,
    setMenuOpen,
}) => {
    if (!currentSymbol) { return null; }

    return (
        <ChartTitleMenu
            enabled={enabled}
            className="cq-chart-title stx-show cq-symbols-display"
            isFullscreen
            title={isMobile ? t.translate('Underlying Assets') : ''}
        >
            <ChartTitleMenu.Title>
                <SymbolSelectButton />
            </ChartTitleMenu.Title>
            <ChartTitleMenu.Body>
                <MarketSelector
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
}))(ChartTitle);
