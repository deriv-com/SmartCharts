/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Loader from './Loader.jsx';

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
            chartPanelTop,
            chartControlsWidgets,
            AggregateChartSettingsDialog,
            topWidgets,
            showCountdown = false,
        } = this.props;

        const currentLang = lang || ((setting && setting.language) ? setting.language.key : 'en');
        t.setLanguage(currentLang);
        const currentPosition = `cq-chart-control-${(setting && setting.position && !isMobile) ? setting.position : 'bottom'}`;
        const currentMode = `${isMobile ? 'smartcharts-mobile' : ''}`;
        const array = React.Children.toArray(children);
        const insideHolder = array.filter(c => !/(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const insideSubHolder = array.filter(c => /(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const renderTopWidgets = topWidgets || defaultTopWidgets;
        const defaultTheme = (setting && setting.theme) ? setting.theme : 'light';
        const defaultCandleCountdown = (setting && setting.candleCountdown) ? setting.candleCountdown : false;

        // TO DO : this part should move the ChartSetting Store
        CIQ.localStorageSetItem('smartchart-setting', JSON.stringify({
            position: ((setting && setting.position && !isMobile) ? setting.position : 'bottom'),
            language: currentLang,
            theme: (typeof theme === 'string') ? theme : defaultTheme,
            candleCountdown: showCountdown || defaultCandleCountdown,
        }));

        return (
            <cq-context
                ref={(root) => { this.root = root; }}
                class={`smartcharts-${(typeof theme === 'string') ? theme : defaultTheme}`}
            >
                <div className={`${currentMode} ${currentPosition}`}>
                    <div className="ciq-chart-area">
                        <div className="ciq-chart">
                            <RenderInsideChart at="holder">
                                {insideHolder}
                            </RenderInsideChart>
                            <RenderInsideChart at="subholder">
                                {insideSubHolder}
                            </RenderInsideChart>
                            <div className="cq-top-ui-widgets" style={{ top: chartPanelTop }}>
                                { renderTopWidgets() }
                            </div>
                            <ChartControls widgets={chartControlsWidgets} />
                            <Crosshair />
                            <div className="chartContainer primary" />
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

export default connect(({ chart, drawTools, studies, chartSetting, chartType }) => ({
    contextPromise: chart.contextPromise,
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
    DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
    AggregateChartSettingsDialog : chartType.settingsDialog.connect(SettingsDialog),
    isChartAvailable: chart.isChartAvailable,
    chartPanelTop: chart.chartPanelTop,
    setting: chartSetting,
}))(Chart);
