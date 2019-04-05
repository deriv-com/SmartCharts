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

import ChartControls, { RenderDefaultControls } from './ChartControls.jsx';
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
            topWidgets,
            chartContainerHeight,
            containerWidth,
            isDrawing,
            theme,
            position,
            showLastDigitStats,
        } = this.props;

        const currentPosition = `cq-chart-control-${(position && !isMobile) ? position : 'bottom'}`;
        const contextWidth =  !isMobile ? `smartcharts-${containerWidth}` : '';
        const TopWidgets = topWidgets || defaultTopWidgets;
        const BottomWidgets = !bottomWidgets && showLastDigitStats ? LastDigitStats : bottomWidgets;

        return (
            <div className={`smartcharts smartcharts-${theme} ${contextWidth}`}>
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
                                <div className="ciq-chart">
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
                                <ChartControls widgets={chartControlsWidgets} />
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
    id                              : PropTypes.string,
    endEpoch                        : PropTypes.number,
    granularity                     : PropTypes.number,
    symbol                          : PropTypes.string,
    chartType                       : PropTypes.string,
    requestAPI                      : PropTypes.func.isRequired,
    requestSubscribe                : PropTypes.func.isRequired,
    requestForget                   : PropTypes.func.isRequired,
    onSettingsChange                : PropTypes.func,
    onMessage                       : PropTypes.func,
    isMobile                        : PropTypes.bool,
    enableRouting                   : PropTypes.bool,
    removeAllComparisons            : PropTypes.bool,
    topWidgets                      : PropTypes.func,
    settings                        : PropTypes.object,
    bottomWidgets                   : PropTypes.any,
    DrawToolsSettingsDialog         : PropTypes.any.isRequired,
    StudySettingsDialog             : PropTypes.any.isRequired,
    isOnPagination                  : PropTypes.bool,
    isChartAvailable                : PropTypes.bool,
    barriers                        : PropTypes.array,
    chartControlsWidgets            : PropTypes.any,
    AggregateChartSettingsDialog    : PropTypes.any.isRequired,
    chartContainerHeight            : PropTypes.number,
    containerWidth                  : PropTypes.number,
    isDrawing                       : PropTypes.bool,
    theme                           : PropTypes.string,
    position                        : PropTypes.string,
    showLastDigitStats              : PropTypes.bool,
};

Chart.defaultProps = {
    id                              : '1',
    endEpoch                        : null,
    granularity                     : 0,
    symbol                          : undefined,
    chartType                       : 'mountain',
    onSettingsChange                : () => null,
    onMessage                       : () => null,
    isMobile                        : false,
    enableRouting                   : false,
    removeAllComparisons            : false,
    topWidgets                      : defaultTopWidgets,
    settings                        : {},
    bottomWidgets                   : () => null,
    isOnPagination                  : false,
    isChartAvailable                : false,
    barriers                        : [],
    chartControlsWidgets            : RenderDefaultControls,
    chartContainerHeight            : 500,
    containerWidth                  : 480,
    isDrawing                       : false,
    theme                           : 'light',
    position                        : 'bottom',
    showLastDigitStats              : false,
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
    isDrawing: drawingCursor.isDrawing,
    theme: chartSetting.theme,
    position: chartSetting.position,
    showLastDigitStats:state.showLastDigitStats,
    isOnPagination: state.isOnPagination,
}))(Chart);
