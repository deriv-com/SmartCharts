import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-title.scss';

const ChartTitle = ({
    currentSymbol,
    ChartTitleMenu,
    MarketSelector,
    SymbolSelectButton,
    setMenuOpen,
    onChange,
    enabled,
    isMobile,
}) => {
    if (!currentSymbol) { return null; }

    return (
        <ChartTitleMenu
            enabled={enabled}
            className="cq-chart-title stx-show cq-symbols-display"
            isFullscreen
            title={isMobile ? t.translatable('Underlying Assets') : ''}
        >
            <ChartTitleMenu.Title>
                <SymbolSelectButton />
            </ChartTitleMenu.Title>
            <ChartTitleMenu.Body>
                <MarketSelector
                    onSelectItem={(x) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol);
                        }
                        setMenuOpen(false);
                    }}
                />
            </ChartTitleMenu.Body>
        </ChartTitleMenu>
    );
};

export default connect(({ chartTitle: c, chart }) => ({
    currentSymbol: c.currentSymbol,
    ChartTitleMenu: c.ChartTitleMenu,
    MarketSelector: c.MarketSelector,
    setMenuOpen: c.menu.setOpen,
    onChange: c.setSymbol,
    SymbolSelectButton: c.SymbolSelectButton,
    isMobile: chart.isMobile,
}))(ChartTitle);
