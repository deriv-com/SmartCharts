import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'package:chart_app/src/helper.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/indicators_config.dart';

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

  /// Active marker
  ActiveMarker? activeMarker;

  /// Whether the chart should be showing live data or not.
  bool isLive = false;

  /// Starts in data fit mode and adds a data-fit button.
  bool dataFitEnabled = false;

  /// Whether to use digit contract painter or non-digit contract painter
  bool isDigitContract = false;

  late final ChartController _controller;

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
      final List<Marker> markers = <Marker>[];

      isDigitContract = _markerGroup.type == 'DigitContract';

      for (final JsMarker _marker in _markerGroup.markers) {
        markers.add(Marker(
          quote: _marker.quote,
          epoch: _marker.epoch,
          text: _marker.text,
          markerType: MarkerType.values.byName(_marker.type),
          direction: MarkerDirection.up,
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

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    granularity = payload.granularity;
    isLive = payload.isLive;
    dataFitEnabled = payload.dataFitEnabled;

    if (payload.chartType.isNotEmpty) {
      style = ChartStyle.values.byName(payload.chartType);
    }

    if (payload.theme.isNotEmpty) {
      theme = payload.theme == 'dark'
          ? ChartDefaultDarkTheme()
          : ChartDefaultLightTheme();
    }

    notifyListeners();
  }

  /// Scroll chart visible area to the newest data.
  void scale(double payload) {
    final double scale = payload;
    _controller.scale(scale);
  }
}
