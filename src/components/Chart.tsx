// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './RenderInsideChart.jsx' was resolved to '... Remove this comment to see the full error message
import RenderInsideChart from './RenderInsideChart.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTitle.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTitle from './ChartTitle.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import Loader from './Loader.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Barrier.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Barrier from './Barrier.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './BottomWidget.jsx' was resolved to '/User... Remove this comment to see the full error message
import BottomWidget from './BottomWidget.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './BottomWidgetsContainer.jsx' was resolved... Remove this comment to see the full error message
import BottomWidgetsContainer from './BottomWidgetsContainer.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './NavigationWidget.jsx' was resolved to '/... Remove this comment to see the full error message
import NavigationWidget from './NavigationWidget.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './HighestLowestMarker.jsx' was resolved to... Remove this comment to see the full error message
import HighestLowestMarker from './HighestLowestMarker.jsx';
/* css + scss */
import '../../sass/main.scss';
import 'react-tabs/style/react-tabs.css';

import './ui';

// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartControls.jsx' was resolved to '/Use... Remove this comment to see the full error message
import ChartControls from './ChartControls.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartFooter.jsx' was resolved to '/Users... Remove this comment to see the full error message
import ChartFooter from './ChartFooter.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Crosshair.jsx' was resolved to '/Users/b... Remove this comment to see the full error message
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PaginationLoader.jsx' was resolved to '/... Remove this comment to see the full error message
import PaginationLoader from './PaginationLoader.jsx';

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

    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div
            id={id || chartId}
            className={classNames('smartcharts', `smartcharts-${theme}`, {
                'smartcharts--navigation-widget': enabledNavigationWidget,
                'smartcharts--loading': isLoading,
                'smartcharts--has-markers': children && children.length,
                [`smartcharts-${containerWidth}`]: !isMobile,
            })}
        >
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div
                className={classNames({
                    'smartcharts-mobile': isMobile,
                    'smartcharts-desktop': !isMobile,
                })}
            >
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='cq-context' ref={rootRef}>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div
                        className={classNames({
                            [`cq-chart-control-${position}`]: hasPosition,
                            'cq-chart-control-bottom': !hasPosition,
                        })}
                    >
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='ciq-chart-area'>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <div className={classNames('ciq-chart', { 'closed-chart': isChartClosed })}>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <RenderInsideChart at='holder'>
                                    {barriers.map((barr: any, idx: any) => (
                                        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <Barrier
                                            key={`barrier-${idx}`} // eslint-disable-line react/no-array-index-key
                                            {...barr}
                                        />
                                    ))}
                                </RenderInsideChart>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <RenderInsideChart at='subholder'>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    {!isCandle && !isSpline && isHighestLowestMarkerEnabled && <HighestLowestMarker />}
                                </RenderInsideChart>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <RenderInsideChart at='subholder' hideInScrollToEpoch>
                                    {children}
                                </RenderInsideChart>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <RenderInsideChart at='subholder'>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <PaginationLoader />
                                </RenderInsideChart>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='cq-top-ui-widgets'>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <TopWidgets />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </div>
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                <div className='chartContainer' style={{ height: chartContainerHeight }}>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <Crosshair />
                                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                </div>
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                {enabledNavigationWidget && <NavigationWidget onCrosshairChange={onCrosshairChange} />}
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                {toolbarWidget && <ToolbarWidget />}
                                {!isChartAvailable && (
                                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                    <div className='cq-chart-unavailable'>
                                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                                        {t.translate('Chart data is not available for this symbol.')}
                                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                                    </div>
                                )}
                                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                <BottomWidgetsContainer>
                                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                                    <BottomWidget bottomWidgets={bottomWidgets} />
                                </BottomWidgetsContainer>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </div>
                            {chartControlsWidgets !== null && !enabledChartFooter && (
                                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ChartControls widgets={chartControlsWidgets} />
                            )}
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            {enabledChartFooter && <ChartFooter />}
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <Loader />
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        </div>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <DrawToolsSettingsDialog />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <AggregateChartSettingsDialog />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <StudySettingsDialog />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div id='smartcharts_modal' className='ciq-modal' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
    drawTools,
    studies,
    chartSetting,
    chartType,
    state,
    loader,
}: any) => ({
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
