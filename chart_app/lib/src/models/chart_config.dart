import 'dart:js';
import 'dart:js_util';
import 'package:chart_app/src/helpers/color.dart';
import 'package:deriv_chart/deriv_chart.dart' hide ChartDefaultDarkTheme;
import 'package:flutter/material.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import './chart_default_dark_theme.dart';

/// State and methods of chart web adapter config.
class ChartConfigModel extends ChangeNotifier {
  /// Initialize
  ChartConfigModel();

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
  bool startWithDataFitMode = false;

  /// Specifies whether the symbol is closed or not.
  bool isSymbolClosed = false;

  /// Specifies the zoom level of the chart.
  double? msPerPx;

  /// Specifies the left margin to prevent overlap.
  double? leftMargin;

  /// Specifies the right padding.
  int? rightPadding;

  /// Type of the contract
  String? contractType;

  /// Market symbol
  String symbol = '';

  /// Pip size of the chart
  int pipSize = 4;

  /// Whether the crosshair cursor should be shown or not.
  bool showCrosshair = true;

  /// Specifies if it is in mobile mode
  bool isMobile = false;

  /// Specifies the margin of yAxis.
  JSYAxisMargin? yAxisMargin;

  /// Show the time interval
  bool showTimeInterval = false;

  /// Remaining time when the timeInterval is shown
  String remainingTime = '--:--';

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

  /// Get remaining time of the chart
  void setRemainingTime(String time) {
    remainingTime = time;
    notifyListeners();
  }

  /// Update markers
  void updateContracts(List<JSContractsUpdate> _markerGroupList) {
    markerGroupList = <MarkerGroup>[];

    for (final JSContractsUpdate _markerGroup in _markerGroupList) {
      final List<ChartMarker> markers = <ChartMarker>[];

      contractType = _markerGroup.type;

      for (final JsMarker _marker in _markerGroup.markers) {
        if (_marker.quote != null &&
            _marker.epoch != null &&
            _marker.type != null) {
          markers.add(ChartMarker(
            quote: _marker.quote!,
            epoch: _marker.epoch! * 1000,
            text: _marker.text,
            markerType: MarkerType.values.byName(_marker.type!),
            direction: MarkerDirection.up,
            color: _marker.color != null
                ? getColorFromString(_marker.color!)
                : null,
          ));
        }
      }

      Color _bgColor = Colors.white;

      if (_markerGroup.color != null) {
        _bgColor = getColorFromString(_markerGroup.color!);
      }

      markerGroupList.add(
        MarkerGroup(
          markers,
          type: _markerGroup.type,
          style: MarkerStyle(
            backgroundColor: _bgColor,
          ),
          props: _toMap(_markerGroup.props),
        ),
      );
    }
    notifyListeners();
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

  /// To update leftMargin
  void updateLeftMargin(double _leftMargin) {
    leftMargin = _leftMargin;
    notifyListeners();
  }

  /// To update leftMargin
  void updateRightPadding(int _rightPadding) {
    rightPadding = _rightPadding;
    notifyListeners();
  }

  /// To update the symbol open status
  // ignore: avoid_positional_boolean_parameters
  void setSymbolClosed(bool _isSymbolClosed) {
    isSymbolClosed = _isSymbolClosed;
    notifyListeners();
  }

  /// To set the time interval
  // ignore: avoid_positional_boolean_parameters
  void toggleTimeIntervalVisibility(bool showInterval) {
    showTimeInterval = showInterval;
    notifyListeners();
  }

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    granularity = payload.granularity;
    isLive = payload.isLive;
    startWithDataFitMode = payload.startWithDataFitMode;
    msPerPx = payload.msPerPx;
    pipSize = payload.pipSize ?? 4;
    isMobile = payload.isMobile;
    yAxisMargin = payload.yAxisMargin;
    symbol = payload.symbol ?? '';

    if (payload.chartType != null && payload.chartType!.isNotEmpty) {
      style = ChartStyle.values.byName(payload.chartType!);
    }

    if (payload.theme != null && payload.theme!.isNotEmpty) {
      theme = payload.theme == 'dark'
          ? ChartDefaultDarkTheme()
          : ChartDefaultLightTheme();
    }

    notifyListeners();
  }

  /// Converts a JavaScript object to a Dart Map<String, dynamic>.
  ///
  /// This method extracts specific properties from a JavaScript object and
  /// converts them into a Dart map. It only includes properties that are
  /// defined in the [propertiesToExtract] list and have non-null values.
  ///
  /// To extend this method's functionality:
  /// 1. Add new property names to the [propertiesToExtract] list
  /// 2. For properties that need default values when not present in the input,
  ///    add a check after the extraction loop:
  ///    ```dart
  ///    if (!result.containsKey('propertyName')) {
  ///      result['propertyName'] = defaultValue;
  ///    }
  ///    ```
  ///
  /// Parameters:
  /// - [props]: The JavaScript object to convert. Can be null.
  ///
  /// Returns:
  /// - A Map<String, dynamic> containing the extracted properties.
  ///   If [props] is null, returns an empty map.
  ///
  /// Example usage:
  /// ```dart
  /// final Map<String, dynamic> dartMap = _toMap(jsObject);
  /// ```
  Map<String, dynamic> _toMap(JsObject? props) {
    if (props == null) {
      return <String, dynamic>{};
    }

    final Map<String, dynamic> result = <String, dynamic>{};

    // List of properties we want to extract
    final List<String> propertiesToExtract = <String>[
      'hasPersistentBorders',
      // Add additional properties to extract here
    ];

    // Extract only the properties we want (don't include non-user-defined
    // properties)
    for (final String name in propertiesToExtract) {
      final dynamic value = getProperty(props, name);
      if (value != null) {
        result[name] = value;
      }
    }

    return result;
  }
}
