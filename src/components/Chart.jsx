import PropTypes            from 'prop-types';
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
/* css + scss */
import '../../sass/main.scss';

import './ui';

import ChartControls from './ChartControls.jsx';
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
import PaginationLoader from './PaginationLoader.jsx';

const defaultTopWidgets = () => (
    <>
        <ChartTitle />
        <AssetInformation />
        <ComparisonList />
    </>
);

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

    render() {
        const {
            bottomWidgets,
            DrawToolsSettingsDialog,
            StudySettingsDialog,
            isMobile = false,
            isOnPagination,
            isChartAvailable,
            barriers = [],
            children,
            chartControlsWidgets,
            AggregateChartSettingsDialog,
            topWidgets: TopWidgets,
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

Chart.propTypes = {
    requestAPI: PropTypes.func.isRequired,
    requestSubscribe: PropTypes.func.isRequired,
    requestForget: PropTypes.func.isRequired,
    id: PropTypes.string,
    granularity: PropTypes.oneOf([
        0, 60, 120, 180, 300, 600,
        900, 1800, 3600, 7200,
        14400, 28800, 86400,
    ]),
    symbol: PropTypes.string,
    chartType: PropTypes.oneOf(['mountain', 'line',
        'colored_line', 'spline', 'baseline',
        'candle', 'colored_bar', 'hollow_candle',
        'heikinashi', 'kagi', 'linebreak',
        'renko', 'rangebars', 'pandf', 'table']),
    startEpoch: PropTypes.number,
    endEpoch: PropTypes.number,
    chartControlsWidgets: PropTypes.any,
    onSettingsChange: PropTypes.func,
    onMessage: PropTypes.func,
    isMobile: PropTypes.bool,
    enableRouting: PropTypes.bool,
    removeAllComparisons: PropTypes.bool,
    topWidgets: PropTypes.func,
    settings: PropTypes.object,
    bottomWidgets: PropTypes.any,
    DrawToolsSettingsDialog: PropTypes.any.isRequired,
    StudySettingsDialog: PropTypes.any.isRequired,
    isOnPagination: PropTypes.bool,
    isChartAvailable: PropTypes.bool,
    barriers: PropTypes.array,
    AggregateChartSettingsDialog: PropTypes.any.isRequired,
    chartContainerHeight: PropTypes.number,
    containerWidth: PropTypes.number,
    isDrawing: PropTypes.any,
    theme: PropTypes.string,
    position: PropTypes.string,
    showLastDigitStats: PropTypes.bool,
    isConnectionOpened: PropTypes.bool,
    isAnimationEnabled: PropTypes.bool,
    scrollToEpoch: PropTypes.number,
    scrollToEpochOffset: PropTypes.number,
    zoom: PropTypes.number,
    clearChart: PropTypes.bool,
    onExportLayout: PropTypes.func,
    importedLayout: PropTypes.func,
};

Chart.defaultProps = {
    granularity: 0,
    symbol: 'R_100',
    chartType: 'mountain',
    onSettingsChange: () => null,
    onMessage: () => null,
    topWidgets: defaultTopWidgets,
    settings: {},
    bottomWidgets: () => null,
    barriers: [],
    chartContainerHeight: 500,
    containerWidth: 480,
    theme: 'light',
    position: 'bottom',
    isAnimationEnabled: true,
    scrollToEpoch: 0,
    scrollToEpochOffset: 0,
    zoom: 0,
};

export default connect(({ chart, drawTools, studies, chartSetting, chartType, state, drawingCursor }) => ({
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog : studies.StudySettingsDialog,
    DrawToolsSettingsDialog : drawTools.DrawToolsSettingsDialog,
    AggregateChartSettingsDialog : chartType.AggregateChartSettingsDialog,
    isChartAvailable: chart.isChartAvailable,
    updateProps: state.updateProps,
    chartContainerHeight: chart.chartContainerHeight,
    containerWidth: chart.containerWidth,
    isChartClosed: state.isChartClosed,
    isDrawing: drawingCursor.isDrawing,
    theme: chartSetting.theme,
    position: chartSetting.position,
    showLastDigitStats:state.showLastDigitStats,
    isOnPagination: state.isOnPagination,
}))(Chart);
