import 'package:chart_app/src/helpers/chart.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/models/indicators.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

/// ChartApp
class ChartApp {
  /// Constructor
  ChartApp(
    this.configModel,
    this.feedModel,
    this.indicatorsModel,
    this.controller,
  );

  /// ChartConfigModel
  ChartConfigModel configModel;

  /// ChartFeedModel
  ChartFeedModel feedModel;

  /// Indicators config
  IndicatorsModel indicatorsModel;

  /// ChartController
  ChartController controller;

  bool _prevShowChart = false;

  /// width of yAxis
  double yAxisWidth = 60;

  void _processChartVisibilityChange() {
    yAxisWidth = calculateYAxisWidth(
      feedModel.ticks,
      configModel.theme,
      configModel.pipSize,
    );
  }

  /// Gets the chart visibility
  bool getChartVisibilitity() {
    final bool showChart =
        feedModel.ticks.isNotEmpty && feedModel.isChartDataLoaded;

    if (showChart != _prevShowChart) {
      _processChartVisibilityChange();

      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (showChart) {
          // 300 millisecond for the chart to complete animation
          Future<void>.delayed(const Duration(milliseconds: 300), () {
            JsInterop.onChartMountChange(showChart);
          });
        } else {
          JsInterop.onChartMountChange(showChart);
        }
      });
    }

    _prevShowChart = showChart;
    return showChart;
  }

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    configModel.newChart(payload);
    feedModel.newChart();
  }

  /// Scroll chart visible area to the newest data.
  void scrollToLastTick() => SchedulerBinding.instance
      .addPostFrameCallback((_) => controller.scrollToLastTick());

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip?>? getTooltipContent(int epoch, int pipSize) {
    final List<Series> seriesList =
        controller.getSeriesList?.call() ?? <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        controller.getIndicatorConfigsList?.call() ?? <IndicatorConfig>[];

    return indicatorsModel.getTooltipContent(
      seriesList,
      indicatorConfigsList,
      epoch,
      pipSize,
    );
  }
}
