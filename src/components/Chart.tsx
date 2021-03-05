import React from 'react';
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './RenderInsideChart' was resolved to '... Remove this comment to see the full error message
import RenderInsideChart from './RenderInsideChart';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTitle' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTitle from './ChartTitle';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader' was resolved to '/Users/bala... Remove this comment to see the full error message
import Loader from './Loader';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Barrier' was resolved to '/Users/bal... Remove this comment to see the full error message
import Barrier from './Barrier';
// @ts-expect-error ts-migrate(6142) FIXME: Module './BottomWidget' was resolved to '/User... Remove this comment to see the full error message
import BottomWidget from './BottomWidget';
// @ts-expect-error ts-migrate(6142) FIXME: Module './BottomWidgetsContainer' was resolved... Remove this comment to see the full error message
import BottomWidgetsContainer from './BottomWidgetsContainer';
// @ts-expect-error ts-migrate(6142) FIXME: Module './NavigationWidget' was resolved to '/... Remove this comment to see the full error message
import NavigationWidget from './NavigationWidget';
// @ts-expect-error ts-migrate(6142) FIXME: Module './HighestLowestMarker' was resolved to... Remove this comment to see the full error message
import HighestLowestMarker from './HighestLowestMarker';
/* css + scss */
import '../../sass/main.scss';
import 'react-tabs/style/react-tabs.css';

import './ui';

// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartControls' was resolved to '/Use... Remove this comment to see the full error message
import ChartControls from './ChartControls';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartFooter' was resolved to '/Users... Remove this comment to see the full error message
import ChartFooter from './ChartFooter';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Crosshair' was resolved to '/Users/b... Remove this comment to see the full error message
import Crosshair from './Crosshair';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PaginationLoader' was resolved to '/... Remove this comment to see the full error message
import PaginationLoader from './PaginationLoader';

const Chart = (props: any) => {
    const rootRef = React.useRef();

    React.useEffect(() => {
        const { updateProps, init, ...otherProps } = props;
        initGA();
        logPageView();
        updateProps(otherProps);
        init(rootRef.current, otherProps);

        return () => {
            props.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const { updateProps, init, ...otherProps } = props;
        updateProps(otherProps);
    });

    const defaultTopWidgets = () => <ChartTitle />;

    const {
        id,
        chartId,
        DrawToolsSettingsDialog,
        StudySettingsDialog,
        isCandle,
        isSpline,
        isMobile = false,
        isChartAvailable,
        isHighestLowestMarkerEnabled,
        barriers = [],
        children,
        chartControlsWidgets,
        AggregateChartSettingsDialog,
        topWidgets,
        chartContainerHeight,
        containerWidth,
        isChartClosed,
        theme,
        position,
        bottomWidgets,
        enabledChartFooter = true,
        enabledNavigationWidget = true,
        toolbarWidget,
        onCrosshairChange,
        isLoading,
    } = props;

    const hasPosition = chartControlsWidgets && position && !isMobile;
    const TopWidgets = topWidgets || defaultTopWidgets;
    // if there are any markers, then increase the subholder z-index
    const ToolbarWidget = toolbarWidget;

    return (
        <div
            id={id || chartId}
            className={classNames('smartcharts', `smartcharts-${theme}`, {
                'smartcharts--navigation-widget': enabledNavigationWidget,
                'smartcharts--loading': isLoading,
                'smartcharts--has-markers': children && children.length,
                [`smartcharts-${containerWidth}`]: !isMobile,
            })}
        >
            <div
                className={classNames({
                    'smartcharts-mobile': isMobile,
                    'smartcharts-desktop': !isMobile,
                })}
            >
                <div className='cq-context' ref={rootRef}>
                    <div
                        className={classNames({
                            [`cq-chart-control-${position}`]: hasPosition,
                            'cq-chart-control-bottom': !hasPosition,
                        })}
                    >
                        <div className='ciq-chart-area'>
                            <div className={classNames('ciq-chart', { 'closed-chart': isChartClosed })}>
                                <RenderInsideChart at='holder'>
                                    {barriers.map((barr: any, idx: any) => (
                                        <Barrier
                                            key={`barrier-${idx}`} // eslint-disable-line react/no-array-index-key
                                            {...barr}
                                        />
                                    ))}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder'>
                                    {!isCandle && !isSpline && isHighestLowestMarkerEnabled && <HighestLowestMarker />}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder' hideInScrollToEpoch>
                                    {children}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder'>
                                    <PaginationLoader />
                                </RenderInsideChart>
                                <div className='cq-top-ui-widgets'>
                                    <TopWidgets />
                                </div>
                                <div className='chartContainer' style={{ height: chartContainerHeight }}>
                                    <Crosshair />
                                </div>
                                {enabledNavigationWidget && <NavigationWidget onCrosshairChange={onCrosshairChange} />}
                                {toolbarWidget && <ToolbarWidget />}
                                {!isChartAvailable && (
                                    <div className='cq-chart-unavailable'>
                                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                                        {t.translate('Chart data is not available for this symbol.')}
                                    </div>
                                )}
                                <BottomWidgetsContainer>
                                    <BottomWidget bottomWidgets={bottomWidgets} />
                                </BottomWidgetsContainer>
                            </div>
                            {chartControlsWidgets !== null && !enabledChartFooter && (
                                <ChartControls widgets={chartControlsWidgets} />
                            )}
                            {enabledChartFooter && <ChartFooter />}
                            <Loader />
                        </div>
                    </div>
                </div>
                <DrawToolsSettingsDialog />
                <AggregateChartSettingsDialog />
                <StudySettingsDialog />
                <div id='smartcharts_modal' className='ciq-modal' />
            </div>
        </div>
    );
};

export default connect(({ chart, drawTools, studies, chartSetting, chartType, state, loader }: any) => ({
    chartId: chart.chartId,
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog: studies.StudySettingsDialog,
    DrawToolsSettingsDialog: drawTools.DrawToolsSettingsDialog,
    AggregateChartSettingsDialog: chartType.AggregateChartSettingsDialog,
    isCandle: chartType.isCandle,
    isChartAvailable: chart.isChartAvailable,
    isSpline: chartType.isSpline,
    updateProps: state.updateProps,
    chartContainerHeight: chart.chartContainerHeight,
    containerWidth: chart.containerWidth,
    isChartClosed: state.isChartClosed,
    theme: chartSetting.theme,
    position: chartSetting.position,
    isHighestLowestMarkerEnabled: chartSetting.isHighestLowestMarkerEnabled,
    isLoading: loader.isActive,
}))(Chart);
