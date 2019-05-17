import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from '../store/Connect';
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

ChartTitle.propTypes = {
    chartId: PropTypes.string,
    ChartTitleMenu: PropTypes.any.isRequired,
    enabled: PropTypes.bool,
    isMobile: PropTypes.bool,
    MarketSelector: PropTypes.any.isRequired,
    onChange: PropTypes.func,
    setMenuOpen: PropTypes.func,
};

ChartTitle.defaultProps = {
    enabled: true,
    onChange: () => null,
    setMenuOpen: () => null,
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
