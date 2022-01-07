import { observer } from 'mobx-react-lite';
import React from 'react';
import ReactDOM from 'react-dom';
import { TProcessedSymbolItem } from 'src/binaryapi/ActiveSymbols';
import { useStores } from 'src/store';
import { TOpenMarket } from 'src/types';
import '../../sass/components/_chart-title.scss';
import { CategoricalDisplay } from './categoricaldisplay';
import Menu from './Menu';
import { SymbolSelectButton } from './SymbolSelectButton';

export type TChartTitleProps = {
    containerId?: string;
    enabled?: boolean;
    portalNodeId?: string;
    searchInputClassName?: string;
    open?: boolean;
    open_market?: TOpenMarket | null;
    isNestedList?: boolean;
    onChange?: (x: string) => void;
};

const ChartTitle = (props: TChartTitleProps) => {
    const { chartTitle, chart, chartSetting } = useStores();
    const { isMobile } = chart;

    const { theme } = chartSetting;
    const {
        menuStore,
        currentSymbol,
        categoricalDisplay,
        setSymbol,
        onMouseEnter,
        onMouseLeave,
        updateProps,
    } = chartTitle;
    const onChange = props.onChange || setSymbol;
    const setMenuOpen = menuStore.setOpen;

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
        <Menu
            store={menuStore}
            enabled={enabled}
            className='cq-chart-title stx-show cq-symbols-display'
            isFullscreen
            portalNodeId={portalNodeId}
            title={isMobile ? t.translate('Underlying Assets') : ''}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Menu.Title>
                <SymbolSelectButton />
            </Menu.Title>
            <Menu.Body>
                <CategoricalDisplay
                    store={categoricalDisplay}
                    isNestedList={isNestedList}
                    searchInputClassName={searchInputClassName}
                    onSelectItem={(x: TProcessedSymbolItem) => {
                        if (x.symbol !== currentSymbol.symbol) {
                            onChange(x.symbol);
                        }
                        setMenuOpen(false);
                    }}
                />
            </Menu.Body>
        </Menu>
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
