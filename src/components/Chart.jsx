/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line
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
            showCandleCountdown = false,
        } = this.props;

        const currentLang = lang || ((setting && setting.language) ? setting.language.key : 'en');
        t.setLanguage(currentLang);

        const array = React.Children.toArray(children);
        const insideHolder = array.filter(c => !/(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const insideSubHolder = array.filter(c => /(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const renderTopWidgets = topWidgets || defaultTopWidgets;

        const contextClassName = () => {
            let className = '';
            className += (typeof theme === 'string' ) ? ` smartcharts-${theme}`
                : ` smartcharts-${(setting && setting.theme) ? setting.theme : 'light'}`;
            return className;
        };

        CIQ.localStorageSetItem(`smartchart-setting`, JSON.stringify({
            language: currentLang ,
            theme: (typeof theme === 'string' ) ? theme : ((setting && setting.theme) ? setting.theme : 'light'),
            candleCountdown :showCandleCountdown || ((setting && setting.candleCountdown) ? setting.candleCountdown : false)
        }));

        return (
            <cq-context ref={(root) => { this.root = root; }} class={contextClassName()}>
                <div className={isMobile ? 'smartcharts-mobile' : ''}>
                    <div className="ciq-chart-area">
                        <div className="ciq-chart">
                            <RenderInsideChart at='holder'>
                                {insideHolder}
                            </RenderInsideChart>
                            <RenderInsideChart at='subholder'>
                                {insideSubHolder}
                            </RenderInsideChart>
                            <div className="cq-top-ui-widgets" style={{top: chartPanelTop}}>
                                { renderTopWidgets() }
                            </div>
                            <ChartControls widgets={chartControlsWidgets} />
                            <Crosshair />
                            <div className="chartContainer primary"> </div>
                            <Loader />
                            {!isChartAvailable &&
                                <div className="cq-chart-unavailable">
                                    {t.translate('Chart data is not available for this symbol.')}
                                </div>}
                        </div>
                    </div>
                    <DrawToolsSettingsDialog />
                    <StudySettingsDialog />
                    <Notification />
                </div>
            </cq-context>
        );
    }
}

export default connect(
    ({chart, drawTools, studies, chartSetting, chartType }) => ({
        contextPromise: chart.contextPromise,
        init: chart.init,
        destroy: chart.destroy,
        StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
        DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
        AggregateChartSettingsDialog : chartType.settingsDialog.connect(SettingsDialog),
        isChartAvailable: chart.isChartAvailable,
        chartPanelTop: chart.chartPanelTop,
        setting: chartSetting,
    })
)(Chart);
