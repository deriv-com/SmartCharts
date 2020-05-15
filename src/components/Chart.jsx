import React, { Component } from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';
import ChartTitle from './ChartTitle.jsx';
import Loader from './Loader.jsx';
import Barrier from './Barrier.jsx';
import BottomWidget from './BottomWidget.jsx';
import BottomWidgetsContainer from './BottomWidgetsContainer.jsx';
import NavigationWidget from './NavigationWidget.jsx';
import HighestLowestMarker from './HighestLowestMarker.jsx';
/* css + scss */
import '../../sass/main.scss';
import 'react-tabs/style/react-tabs.css';

import './ui';

import ChartControls from './ChartControls.jsx';
import ChartFooter from './ChartFooter.jsx';
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
import PaginationLoader from './PaginationLoader.jsx';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.root = React.createRef();
    }

    componentDidMount() {
        const { updateProps, init, ...props } = this.props;
        initGA();
        logPageView();
        updateProps(props);
        init(this.root.current, props);
    }

    componentDidUpdate(prevProps) {
        const { updateProps, init, ...props } = this.props;
        const { updateProps: prevUpdateProps, init: prevInit, ...previousProps } = prevProps;

        if (previousProps !== props) {
            updateProps(props);
        }
    }

    componentWillUnmount() {
        this.props.destroy();
    }

    defaultTopWidgets = () => (
        <>
            <ChartTitle />
        </>
    );

    render() {
        const {
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
        } = this.props;

        const currentPosition = `cq-chart-control-${(chartControlsWidgets && position && !isMobile) ? position : 'bottom'}`;
        const contextWidth =  !isMobile ? `smartcharts-${containerWidth}` : '';
        const TopWidgets = topWidgets || this.defaultTopWidgets;
        // if there are any markers, then increase the subholder z-index
        const HasMarkers = children && children.length ? 'smartcharts--has-markers' : '';
        const ToolbarWidget = toolbarWidget;

        return (
            <div className={`smartcharts smartcharts-${theme} ${enabledNavigationWidget ? 'smartcharts--navigation-widget' : ''} ${isLoading ? 'smartcharts--loading' : ''} ${HasMarkers} ${contextWidth}`}>
                <div className={`smartcharts-${isMobile ? 'mobile' : 'desktop'}`}>
                    <div
                        className="cq-context"
                        ref={this.root}
                    >
                        <div className={`${currentPosition}`}>
                            <div className="ciq-chart-area">
                                <div className={`ciq-chart ${isChartClosed ? 'closed-chart' : ''}`}>
                                    <RenderInsideChart at="holder">
                                        {barriers.map((barr, idx) => (
                                            <Barrier
                                                key={`barrier-${idx}`} // eslint-disable-line react/no-array-index-key
                                                {...barr}
                                            />
                                        ))}
                                    </RenderInsideChart>
                                    <RenderInsideChart at="subholder">
                                        {
                                            !isCandle && !isSpline && isHighestLowestMarkerEnabled
                                                && <HighestLowestMarker />
                                        }
                                    </RenderInsideChart>
                                    <RenderInsideChart at="subholder" hideInScrollToEpoch>
                                        {children}
                                    </RenderInsideChart>
                                    <RenderInsideChart at="subholder">
                                        <PaginationLoader />
                                    </RenderInsideChart>
                                    <div className="cq-top-ui-widgets">
                                        <TopWidgets />
                                    </div>
                                    <div className="chartContainer" style={{ height: chartContainerHeight }}>
                                        <Crosshair />
                                    </div>
                                    {
                                        enabledNavigationWidget
                                            && <NavigationWidget onCrosshairChange={onCrosshairChange} />
                                    }
                                    { toolbarWidget
                                        && <ToolbarWidget />
                                    }
                                    {!isChartAvailable && (
                                        <div className="cq-chart-unavailable">
                                            {t.translate('Chart data is not available for this symbol.')}
                                        </div>
                                    )}
                                    <BottomWidgetsContainer>
                                        <BottomWidget bottomWidgets={bottomWidgets} />
                                    </BottomWidgetsContainer>
                                </div>
                                { chartControlsWidgets !== null && !enabledChartFooter
                                    && <ChartControls widgets={chartControlsWidgets} />
                                }
                                {
                                    enabledChartFooter
                                        && <ChartFooter />
                                }
                                <Loader />
                            </div>
                        </div>
                    </div>
                    <DrawToolsSettingsDialog />
                    <AggregateChartSettingsDialog />
                    <StudySettingsDialog />
                    <div id="smartcharts_modal" className="ciq-modal" />
                </div>
            </div>
        );
    }
}

export default connect(({
    chart,
    drawTools,
    studies,
    chartSetting,
    chartType,
    state,
    loader,
}) => ({
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog : studies.StudySettingsDialog,
    DrawToolsSettingsDialog : drawTools.DrawToolsSettingsDialog,
    AggregateChartSettingsDialog : chartType.AggregateChartSettingsDialog,
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
