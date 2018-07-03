/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
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

import '../Plugin';
import './ui';

import ChartControls from './ChartControls.jsx';
import SettingsDialog from './SettingsDialog.jsx';
import Notification from './Notification.jsx';
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
        this.props.init(this.root, this.props);
    }

    componentWillUnmount() {
        this.props.destroy();
    }

    render() {
        const {
            DrawToolsSettingsDialog,
            StudySettingsDialog,
            children,
            lang,
            isMobile = false,
            theme,
            isChartAvailable,
            setting,
            barriers,
            chartPanelTop,
            chartControlsWidgets,
            AggregateChartSettingsDialog,
            topWidgets,
            hasOpenMenu,
            hasTitleOpenMenu,
            showCountdown = false,
            chartContainerHeight,
        } = this.props;

        const currentLang = lang || ((setting && setting.language) ? setting.language.key : 'en');
        t.setLanguage(currentLang);
        const currentPosition = `cq-chart-control-${(setting && setting.position && !isMobile) ? setting.position : 'bottom'}`;
        const currentMode = `${isMobile ? 'smartcharts-mobile' : ''}`;
        const array = React.Children.toArray(children);
        const insideSubHolder = array.filter(c => /(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const renderTopWidgets = topWidgets || defaultTopWidgets;

        const defaultTheme = (setting && setting.theme) ? setting.theme : 'light';
        const defaultCandleCountdown = (setting && setting.countdown) ? setting.countdown : false;

        document.getElementById('root').style.setProperty('--view-height', window.innerHeight +'px');

        // TO DO : this part should move the ChartSetting Store
        CIQ.localStorageSetItem('smartchart-setting', JSON.stringify({
            position: ((setting && setting.position && !isMobile) ? setting.position : 'bottom'),
            language: currentLang,
            theme: (typeof theme === 'string') ? theme : defaultTheme,
            countdown: showCountdown || defaultCandleCountdown,
        }));

        return (
            <cq-context
                ref={(root) => { this.root = root; }}
                class={`smartcharts-${(typeof theme === 'string') ? theme : defaultTheme} ${isMobile && hasOpenMenu ? 'cq-dialog-context':''}`}
            >
                <div className={`${currentMode} ${currentPosition}`}>
                    <div className="ciq-chart-area">
                        <div className="ciq-chart">
                            <RenderInsideChart at="holder">
                                {barriers && barriers.length > 0 && barriers.map((barr, idx) => (
                                    <Barrier
                                        key={`barrier-${idx}`}
                                        {...barr}
                                    />
                                ))}
                            </RenderInsideChart>
                            <RenderInsideChart at="subholder">
                                {insideSubHolder}
                            </RenderInsideChart>
                            <div className={`cq-top-ui-widgets ${isMobile && hasTitleOpenMenu ? 'open':''}`}
                                 style={isMobile && hasOpenMenu ? {} : { top: chartPanelTop}}>
                                { renderTopWidgets() }
                            </div>
                            <ChartControls widgets={chartControlsWidgets} hasOpenMenu={hasOpenMenu}/>
                            <div className="chartContainer primary" style={{ height: chartContainerHeight }}>
                                <Crosshair />
                            </div>
                            <Loader />
                            {!isChartAvailable &&
                                <div className="cq-chart-unavailable">
                                    {t.translate('Chart data is not available for this symbol.')}
                                </div>}
                        </div>
                    </div>
                    <DrawToolsSettingsDialog />
                    <AggregateChartSettingsDialog />
                    <StudySettingsDialog />
                    <Notification />
                </div>
            </cq-context>
        );
    }
}

export default connect(({ chart, drawTools, studies, chartSetting,
    chartTitle, chartType, comparison, view, share, timeperiod }) => ({
    contextPromise: chart.contextPromise,
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
    DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
    AggregateChartSettingsDialog : chartType.settingsDialog.connect(SettingsDialog),
    isChartAvailable: chart.isChartAvailable,
    chartPanelTop: chart.chartPanelTop,
    setting: chartSetting,
    chartContainerHeight: chart.chartContainerHeight,
    hasOpenMenu: (
        chartTitle.menu.open ||
        chartType.menu.open ||
        studies.menu.open ||
        comparison.menu.open ||
        drawTools.menu.open ||
        view.menu.open ||
        share.menu.open ||
        timeperiod.menu.open ||
        chartSetting.menu.open
    ),
    hasTitleOpenMenu: chartTitle.menu.open
}))(Chart);
