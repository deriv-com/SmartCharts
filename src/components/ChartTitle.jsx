import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-title.scss';

const ChartTitle = ({
    currentSymbol,
    ChartTitleMenu,
    MarketSelector,
    onCloseMenu,
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
            title={isMobile ? t.translate('Underlying Assets') : ''}
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
                    closeMenu={onCloseMenu}
                />
            </ChartTitleMenu.Body>
        </ChartTitleMenu>
    );
};

export default connect(({ chartTitle: c, chart }) => ({
    currentSymbol: c.currentSymbol,
    ChartTitleMenu: c.ChartTitleMenu,
    MarketSelector: c.MarketSelector,
    onCloseMenu: c.menu.onTitleClick,
    setMenuOpen: c.menu.setOpen,
    onChange: c.setSymbol,
    SymbolSelectButton: c.SymbolSelectButton,
    isMobile: chart.isMobile,
}))(ChartTitle);
