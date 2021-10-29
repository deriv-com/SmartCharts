import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import '../../sass/components/_chart-title.scss';

type TChartTitleProps = {
    containerId?: string;
    enabled?: boolean;
    portalNodeId?: string;
    searchInputClassName?: string;
    open?: boolean;
    open_market?: string;
    isNestedList?: boolean;
    onChange?: (x: string) => void;
};

const ChartTitle: React.FC<TChartTitleProps> = props => {
    const { chartTitle, chart, chartSetting } = useStores();
    const { isMobile } = chart;

    const { theme } = chartSetting;
    const {
        ChartTitleMenu,
        currentSymbol,
        MarketSelector,
        setSymbol,
        SymbolSelectButton,
        onMouseEnter,
        onMouseLeave,
        updateProps,
    } = chartTitle;
    const onChange = props.onChange || setSymbol;
    const setMenuOpen = chartTitle.menu.setOpen;

    const { containerId, enabled, portalNodeId, searchInputClassName, open, open_market, isNestedList } = props;

    React.useEffect(() => {
        const { ...otherProps } = props;
        updateProps(otherProps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, open_market]);

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
                    onSelectItem={(x: any) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol);
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
            document.getElementById(containerId) as HTMLElement
        );
    }

    return ChartTitleContainer;
};

export default observer(ChartTitle);
