import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Loader from './Loader.jsx';
import Barrier from './Barrier.jsx';

/* css + scss */
import '../../sass/app.scss';

import './ui';

import ChartControls from './ChartControls.jsx';
import SettingsDialog from './SettingsDialog.jsx';
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';

const defaultTopWidgets = () => (
    <Fragment>
        <ChartTitle />
        <AssetInformation />
        <ComparisonList />
    </Fragment>
);

class Chart extends Component {
    static childContextTypes = { promise: PropTypes.object };

    getChildContext() {
        return { promise: this.props.contextPromise };
    }

    componentDidMount() {
        const { updateProps, init, ...props } = this.props;
        updateProps(props);
        init(this.root, this.modalNode, props);
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
            DrawToolsSettingsDialog,
            StudySettingsDialog,
            isMobile = false,
            isChartAvailable,
            setting : { position, theme },
            barriers = [],
            children,
            chartControlsWidgets,
            AggregateChartSettingsDialog,
            topWidgets,
            chartContainerHeight,
            containerWidth,
        } = this.props;

        const currentPosition = `cq-chart-control-${(position && !isMobile) ? position : 'bottom'}`;
        const contextWidth =  !isMobile ? `smartcharts-${containerWidth}` : '';
        const TopWidgets = topWidgets || defaultTopWidgets;

        return (
            <div
                className={`smartcharts smartcharts-${theme} ${contextWidth} smartcharts-${isMobile ? 'mobile' : 'desktop'}`}
                ref={(modalNode) => { this.modalNode = modalNode; }}
            >
                <div
                    className="cq-context"
                    ref={(root) => { this.root = root; }}
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
                                </RenderInsideChart>
                                <div className="cq-top-ui-widgets">
                                    <TopWidgets />
                                </div>
                                <div className="chartContainer primary" style={{ height: chartContainerHeight }}>
                                    <Crosshair />
                                </div>
                                <Loader />
                                {!isChartAvailable && (
                                    <div className="cq-chart-unavailable">
                                        {t.translate('Chart data is not available for this symbol.')}
                                    </div>
                                )}
                            </div>
                            <ChartControls widgets={chartControlsWidgets} />
                        </div>
                    </div>
                </div>
                <DrawToolsSettingsDialog />
                <AggregateChartSettingsDialog />
                <StudySettingsDialog />
            </div>
        );
    }
}

export default connect(({ chart, drawTools, studies, chartSetting, chartType, state }) => ({
    contextPromise: chart.contextPromise,
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
    DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
    AggregateChartSettingsDialog : chartType.settingsDialog.connect(SettingsDialog),
    isChartAvailable: chart.isChartAvailable,
    setting: chartSetting,
    updateProps: state.updateProps,
    chartContainerHeight: chart.chartContainerHeight,
    containerWidth: chart.containerWidth,
}))(Chart);
