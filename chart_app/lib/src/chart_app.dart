import 'package:chart_app/src/helpers/chart.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/models/indicators.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

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

  /// Whether chart is mounted or not.
  bool isMounted = false;

  void _processChartVisibilityChange(bool showChart) {
    yAxisWidth = calculateYAxisWidth(
      feedModel.ticks,
      configModel.theme,
      configModel.pipSize,
    );

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
    feedModel.newChart();
  }

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip?>? getTooltipContent(int epoch, int pipSize) {
    final List<Series> seriesList =
        controller.getSeriesList?.call() ?? <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        controller.getConfigsList != null
            ? controller.getConfigsList!.call() as List<IndicatorConfig>
            : <IndicatorConfig>[];

    return indicatorsModel.getTooltipContent(
      seriesList,
      indicatorConfigsList,
      epoch,
      pipSize,
    );
  }

  /// Gets the quote interval as granularity to fix 2s ticks.
  int? getQuotesInterval() {
    if (feedModel.isFeedLoaded && feedModel.ticks.length > 1) {
      final Tick previousTick = feedModel.ticks[feedModel.ticks.length - 2];
      final Tick lastTick = feedModel.ticks.last;
      if (previousTick.epoch != lastTick.epoch) {
        return feedModel.ticks.last.epoch - previousTick.epoch;
      }
    }
    return configModel.granularity;
  }

  /// Scales the chart.
  double? scale(double scale) {
    try {
      return controller.scale(scale);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Scroll chart visible area.
  void scroll(double pxShift) {
    try {
      controller.scroll(pxShift);
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  void scrollToLastTick() {
    try {
      controller.scrollToLastTick();
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  // ignore: avoid_positional_boolean_parameters
  void toggleDataFitMode(bool dataFitMode) {
    try {
      controller.toggleDataFitMode?.call(dataFitMode);
    } on Exception catch (_) {
      return;
    }
  }

  /// Called to get epoch from x position
  int? getEpochFromX(double x) {
    try {
      return controller.getEpochFromX?.call(x);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get quote from y position
  double? getQuoteFromY(double y) {
    try {
      return controller.getQuoteFromY?.call(y);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get X position from epoch
  double? getXFromEpoch(int epoch) {
    try {
      return controller.getXFromEpoch?.call(epoch);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get Y position from quote
  double? getYFromQuote(double quote) {
    try {
      return controller.getYFromQuote?.call(quote);
    } on Exception catch (_) {
      return null;
    }
  }
}
