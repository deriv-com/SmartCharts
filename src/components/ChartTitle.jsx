import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from '../store/Connect';
import '../../sass/components/_chart-title.scss';

class ChartTitle extends Component {
    componentDidUpdate(prevProps) {
        const { updateProps, ...props } = this.props;
        const { updateProps: prevUpdateProps, ...previousProps } = prevProps;
        if (previousProps.open_market !== props.open_market || previousProps.open !== props.open) {
            updateProps(props);
        }
    }

    render() {
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
            isNestedList,
        } = this.props;

        if (!currentSymbol) {
            return null;
        }

        const ChartTitleContainer = (
            <ChartTitleMenu
                enabled={enabled}
                className='cq-chart-title stx-show cq-symbols-display'
                isFullscreen
                portalNodeId={portalNodeId}
                title={isMobile ? t.translate('Underlying Assets') : ''}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <ChartTitleMenu.Title>
                    <SymbolSelectButton />
                </ChartTitleMenu.Title>
                <ChartTitleMenu.Body>
                    <MarketSelector
                        portalNodeId={portalNodeId}
                        isNestedList={isNestedList}
                        searchInputClassName={searchInputClassName}
                        onSelectItem={x => {
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
                <div className={`smartcharts-${theme}`}>{ChartTitleContainer}</div>,
                document.getElementById(containerId)
            );
        }

        return ChartTitleContainer;
    }
}

export default connect(({ chartTitle: c, chart, state, chartSetting }) => ({
    chartId: state.chartId,
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
