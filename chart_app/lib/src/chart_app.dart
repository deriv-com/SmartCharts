import 'dart:math';
import 'dart:ui';

import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/misc/wrapped_controller.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/models/drawing_tool.dart';
import 'package:chart_app/src/models/indicators.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// ChartApp
class ChartApp {
  /// Constructor
  ChartApp(this.configModel, this.feedModel, this.indicatorsModel,
      this.drawingToolModel);

  /// ChartConfigModel
  ChartConfigModel configModel;

  /// ChartFeedModel
  ChartFeedModel feedModel;

  /// Indicators config
  IndicatorsModel indicatorsModel;

  /// drawingtool config
  DrawingToolModel drawingToolModel;

  /// WrappedController
  WrappedController wrappedController = WrappedController();

  bool _prevShowChart = false;

  /// height of xAxis
  double xAxisHeight = 24;

  /// width of yAxis
  double yAxisWidth = 60;

  /// width of current tick label
  double currentTickWidth = 60;

  /// Whether chart is mounted or not.
  bool isMounted = false;

  void _processChartVisibilityChange(bool showChart) {
    if (showChart) {
      /// To prevent controller functions being called before mount.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        isMounted = true;
      });
    } else {
      isMounted = false;
    }
  }

  /// Gets the chart visibility
  bool getChartVisibilitity() {
    final bool showChart = feedModel.isFeedLoaded;

    if (showChart != _prevShowChart) {
      _processChartVisibilityChange(showChart);
    }

    _prevShowChart = showChart;
    return showChart;
  }

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    configModel.newChart(payload);
    drawingToolModel.newChart(payload);
    feedModel.newChart();
  }

  /// Calculates the width of yAxis and sets the height of xAxis
  void calculateTickWidth() {
    yAxisWidth = calculateYAxisWidth(
      feedModel.ticks,
      configModel.theme,
      configModel.pipSize,
    );
    xAxisHeight = configModel.theme.gridStyle.xLabelsAreaHeight;

    currentTickWidth = calculateCurrentTickWidth(
      feedModel.ticks,
      const TextStyle(
        fontSize: 12,
        height: 1.3,
        fontWeight: FontWeight.w600,
        color: Colors.white,
        fontFeatures: <FontFeature>[FontFeature.tabularFigures()],
      ),
      configModel.pipSize,
    );
  }

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip?>? getTooltipContent(int epoch, int pipSize) {
    final List<Series> seriesList =
        wrappedController.getSeriesList() ?? <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        wrappedController.getConfigsList() as List<IndicatorConfig>? ??
            <IndicatorConfig>[];

    return indicatorsModel.getTooltipContent(
      seriesList,
      indicatorConfigsList,
      epoch,
      pipSize,
    );
  }

  /// Gets the quote interval as granularity to fix 2s ticks.
  int getQuotesInterval() {
    final int granularity = configModel.granularity ?? 1000;

    // The current charts expect the granularity of the ticks.
    // Sometimes the feed misses a tick and the chart zoom
    // doesn't work properly.
    // The 2 tick symbols are hard coded here to fix the scaling issue.
    // To do: Make flutter chart independent of the granularity.
    // Flutter chart should do the x-axis calculations from the first epoch
    // and last epoch.
    final RegExp regex = RegExp(r'^(RDBEAR|RDBULL|R_)');

    if (granularity == 1000 && regex.hasMatch(configModel.symbol)) {
      return 2000;
    }

    return granularity;
  }

  /// Gets the hover index for indicator series
  int? getIndicatorHoverIndex(double x, double y, Function getClosestEpoch,
      int granularity, int bottomIndicatorIndex) {
    final List<Series> seriesList =
        wrappedController.getChartController().getSeriesList?.call() ??
            <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        wrappedController.getChartController().getConfigsList != null
            ? wrappedController.getChartController().getConfigsList!.call()
                as List<IndicatorConfig>
            : <IndicatorConfig>[];

    final int? value = indicatorsModel.getIndicatorHoverIndex(
      seriesList,
      indicatorConfigsList,
      wrappedController,
      getClosestEpoch,
      granularity,
      x,
      y,
      bottomIndicatorIndex,
    );

    return value;
  }

  /// To add or update an indicator
  void addOrUpdateIndicator(String dataString, int? index) {
    indicatorsModel.addOrUpdateIndicator(dataString, index);

    // A hack to fix the indicator style not being
    // updated when the chart is not moved.
    // TO DO: Add a proper fix
    final Random random = Random();
    final int randomNumber = random.nextInt(100);
    wrappedController.scroll(randomNumber >= 50 ? 0.2 : -0.2);
  }
}
