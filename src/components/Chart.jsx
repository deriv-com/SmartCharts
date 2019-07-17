import React, { Component } from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Loader from './Loader.jsx';
import Barrier from './Barrier.jsx';
import BottomWidgetsContainer from './BottomWidgetsContainer.jsx';
import CurrentSpot from './CurrentSpot.jsx';
import DrawingCursor from './DrawingCursor.jsx';
import ChartTable from './ChartTable.jsx';
import LastDigitStats from './LastDigitStats.jsx';
import HighestLowestMarker from './HighestLowestMarker.jsx';
/* css + scss */
import '../../sass/main.scss';

import './ui';

import ChartControls from './ChartControls.jsx';
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
import PaginationLoader from './PaginationLoader.jsx';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.modalNode = React.createRef();
        this.root = React.createRef();
    }

    componentDidMount() {
        const { updateProps, init, ...props } = this.props;
        initGA();
        logPageView();
        updateProps(props);
        init(this.root.current, this.modalNode.current, props);
    }

    componentWillReceiveProps(nextProps) {
        const { updateProps, ...props } = nextProps;
        updateProps(props);
    }

    componentWillUnmount() {
        this.props.destroy();
    }

    defaultTopWidgets = () => (
        <>
            <ChartTitle />
            <AssetInformation />
            <ComparisonList />
        </>
    );

    render() {
        const {
            bottomWidgets,
            DrawToolsSettingsDialog,
            StudySettingsDialog,
            isCandle,
            isSpline,
            isMobile = false,
            isOnPagination,
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
            isDrawing,
            theme,
            position,
            showLastDigitStats,
        } = this.props;

        const currentPosition = `cq-chart-control-${(chartControlsWidgets && position && !isMobile) ? position : 'bottom'}`;
        const contextWidth =  !isMobile ? `smartcharts-${containerWidth}` : '';
        const TopWidgets = topWidgets || this.defaultTopWidgets;
        const BottomWidgets = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;
        // if there are any markers, then increase the subholder z-index
        const HasMarkers = children && children.length ? 'smartcharts--has-markers' : '';

        return (
            <div className={`smartcharts smartcharts-${theme} ${contextWidth} ${HasMarkers}`}>
                <div
                    className={`smartcharts-${isMobile ? 'mobile' : 'desktop'}`}
                    ref={this.modalNode}
                >
                    <div
                        className="cq-context"
                        ref={this.root}
                    >
                        <div className={` ${currentPosition}`}>
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
                                    <RenderInsideChart at="subholder">
                                        {children}

                                        {
                                            isOnPagination
                                                && <PaginationLoader />
                                        }
                                        <CurrentSpot />
                                    </RenderInsideChart>
                                    <div className="cq-top-ui-widgets">
                                        <TopWidgets />
                                    </div>
                                    <div className={`chartContainer ${isDrawing ? 'ciq-draw-mode' : ''}`} style={{ height: chartContainerHeight }}>
                                        <Crosshair />
                                        <DrawingCursor />
                                    </div>
                                    <Loader />
                                    {!isChartAvailable && (
                                        <div className="cq-chart-unavailable">
                                            {t.translate('Chart data is not available for this symbol.')}
                                        </div>
                                    )}
                                    <BottomWidgetsContainer>
                                        {
                                            BottomWidgets
                                                && <BottomWidgets />
                                        }
                                    </BottomWidgetsContainer>
                                </div>
                                { chartControlsWidgets !== null
                                    && <ChartControls widgets={chartControlsWidgets} />
                                }
                            </div>
                        </div>
                    </div>
                    <DrawToolsSettingsDialog />
                    <AggregateChartSettingsDialog />
                    <StudySettingsDialog />
                    <ChartTable />
                </div>
            </div>
        );
    }
}

export default connect(({ chart, drawTools, studies, chartSetting, chartType, state, drawingCursor }) => ({
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
    isDrawing: drawingCursor.isDrawing,
    theme: chartSetting.theme,
    position: chartSetting.position,
    showLastDigitStats:state.showLastDigitStats,
    isOnPagination: state.isOnPagination,
    isHighestLowestMarkerEnabled: chartSetting.isHighestLowestMarkerEnabled,
}))(Chart);
