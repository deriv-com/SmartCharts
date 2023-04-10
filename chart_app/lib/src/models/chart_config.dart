import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/web_marker.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'package:chart_app/src/helper.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/indicators_config.dart';
import 'package:flutter/scheduler.dart';

/// State and methods of chart web adapter config.
class ChartConfigModel extends ChangeNotifier {
  /// Initialize
  ChartConfigModel(this._controller);

  /// Style of the chart
  ChartStyle style = ChartStyle.line;

  /// Granularity
  int? granularity;

  /// Theme of the chart
  ChartTheme theme = ChartDefaultLightTheme();

  /// Markers
  List<MarkerGroup> markerGroupList = <MarkerGroup>[];

  /// Whether the chart should be showing live data or not.
  bool isLive = true;

  /// Starts in data fit mode and adds a data-fit button.
  bool dataFitEnabled = false;

  /// Type of the contract
  String? contractType;

  late final ChartController _controller;

  /// Whether the crosshair cursor should be shown or not.
  bool showCrosshair = true;

  /// Indicators config
  IndicatorsConfig indicatorsConfig = IndicatorsConfig();

  /// To update style of the chart
  // ignore: avoid_positional_boolean_parameters
  void updateLiveStatus(bool _isLive) {
    isLive = _isLive;
    notifyListeners();
  }

  /// To update style of the chart
  void updateChartStyle(String chartStyle) {
    style = ChartStyle.values.byName(chartStyle);
    notifyListeners();
  }

  /// Update markers
  void updateMarkers(List<JSMarkerGroupUpdate> _markerGroupList) {
    markerGroupList = <MarkerGroup>[];

    for (final JSMarkerGroupUpdate _markerGroup in _markerGroupList) {
      final List<WebMarker> markers = <WebMarker>[];

      contractType = _markerGroup.type;

      for (final JsMarker _marker in _markerGroup.markers) {
        markers.add(WebMarker(
          quote: _marker.quote,
          epoch: _marker.epoch,
          text: _marker.text,
          markerType: MarkerType.values.byName(_marker.type),
          direction: MarkerDirection.up,
          color: _marker.color != null ? getColorFromHex(_marker.color!) : null,
        ));
      }

      Color _bgColor = Colors.white;

      if (_markerGroup.color != null) {
        _bgColor = getColorFromHex(_markerGroup.color!);
      }

      markerGroupList.add(
        MarkerGroup(
          markers,
          style: MarkerStyle(
            backgroundColor: _bgColor,
          ),
        ),
      );
    }
  }

  /// To update the theme of the chart
  void updateTheme(String _theme) {
    theme =
        _theme == 'dark' ? ChartDefaultDarkTheme() : ChartDefaultLightTheme();
    notifyListeners();
  }

  /// To update the theme of the chart
  // ignore: avoid_positional_boolean_parameters
  void updateCrosshairVisibility(bool _showCrosshair) {
    showCrosshair = _showCrosshair;
    notifyListeners();
  }

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    granularity = payload.granularity;
    isLive = payload.isLive;
    dataFitEnabled = payload.dataFitEnabled;

    if (payload.chartType != null && payload.chartType!.isNotEmpty) {
      style = ChartStyle.values.byName(payload.chartType!);
    }

    if (payload.theme != null && payload.theme!.isNotEmpty) {
      theme = payload.theme == 'dark'
          ? ChartDefaultDarkTheme()
          : ChartDefaultLightTheme();
    }

    if (!dataFitEnabled && isLive) {
      scrollToLastTick();
    }

    notifyListeners();
  }

  /// Scroll chart visible area to the newest data.
  void scale(double payload) {
    final double scale = payload;
    _controller.scale(scale);
  }

  /// Scroll chart visible area to the newest data.
  void scrollToLastTick() => SchedulerBinding.instance
      .addPostFrameCallback((_) => _controller.scrollToLastTick());
}
