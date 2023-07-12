import 'package:chart_app/src/helpers/chart.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_data.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// ChartApp
class ChartApp {
  /// Constructor
  ChartApp(this.configModel, this.dataModel, this.controller);

  /// ChartConfigModel
  ChartConfigModel configModel;

  /// ChartDataModel
  ChartDataModel dataModel;

  /// ChartController
  ChartController controller;

  bool _prevShowChart = false;

  /// width of yAxis
  double yAxisWidth = 60;

  void _processChartVisibilityChange() {
    yAxisWidth = calculateYAxisWidth(
      dataModel.ticks,
      configModel.theme,
      configModel.pipSize,
    );
  }

  /// Gets the chart visibility
  bool getChartVisibilitity() {
    final bool showChart =
        dataModel.ticks.isNotEmpty && dataModel.isChartDataLoaded;

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
}
