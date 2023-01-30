import 'package:deriv_chart/deriv_chart.dart';
import 'package:js/js.dart';

/// JS Interop
@JS('window.jsInterop')
class JsInterop {
  /// Called when the chart has loaded
  external static void onChartLoad();

  /// Called when visible area is change
  external static void onVisibleAreaChanged(int leftEpoch, int rightEpoch);

  /// Called when visible quote area is change
  external static void onQuoteAreaChanged(double topQuote, double bottomQuote);

  /// Called to load additional history
  external static void loadHistory(JsLoadHistoryReq request);

  /// Called when candle or point is dismissed.
  external static void onCrosshairDisappeared();

  /// Called when the crosshair is moved.
  external static void onCrosshairHover(
      double dx, double dy, int epoch, String quote);

  /// Indicator options
  external static JsIndicators? indicators;
}

@JS()
@anonymous

/// Load history props
class JsLoadHistoryReq {
  /// JsLoadHistoryReq Object
  external factory JsLoadHistoryReq({int count, int end});

  /// No of ticks/candles
  external int count;

  /// End time
  external int end;
}

@JS()
@anonymous

/// Payload for new chart init
class JSNewChart {
  /// Whether the chart should be showing live data or not.
  external bool get isLive;

  /// Whether data fit mode is enabled.
  external bool get dataFitEnabled;

  /// Granularity of the chart data
  external int get granularity;

  /// Style of the chart
  external String get chartType;

  /// Dart theme or light theme
  external String get theme;
}

@JS()
@anonymous

/// Marker group props
class JSMarkerGroupUpdate {
  /// List of markers belongs to a contract
  external List<JsMarker> markers;

  /// Contract type
  external String type;

  /// Color of the markers
  external String? get color;
}

@JS()
@anonymous

/// Marker props
class JsMarker {
  /// Quote
  external double get quote;

  /// Epoch
  external int get epoch;

  /// Marker text
  external String get text;

  /// Marker type
  external String get type;
}

@JS()
@anonymous

/// Quote props
class JsQuote {
  /// Close value of the candle/tick
  external double get Close;

  /// High value of the candle
  external double? get High;

  /// Low value of the candle
  external double? get Low;

  /// Open value of the candle
  external double? get Open;

  /// Date of the quote data
  external String get Date;
}

@JS()
@anonymous

/// Indicator props
class JsIndicators {
  /// Called when an indicator is to be removed
  external OnRemoveCallback? onRemove;

  /// Called when an indicator is to be edited
  external OnRemoveCallback? onEdit;
}
