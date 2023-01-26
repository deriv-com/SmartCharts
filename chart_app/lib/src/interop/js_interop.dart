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

  ///
  external static void loadHistory(JsLoadHistoryReq request);

  ///
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
  external bool get isLive;
  external bool get dataFitEnabled;
  external int get granularity;
  external String get chartType;
  external String get theme;
}

@JS()
@anonymous
class JSMarkerGroupUpdate {
  external List<JsMarker> markers;
  external String type;
  external String? get color;
}

@JS()
@anonymous
class JsMarker {
  external double get quote;
  external int get epoch;
  external String get text;
  external String get type;
}

@JS()
@anonymous
class JsQuote {
  external double get Close;
  external double? get High;
  external double? get Low;
  external double? get Open;
  external String get Date;
}

@JS()
@anonymous

/// JsIndicators
class JsIndicators {
  /// Called when an indicator is to be removed
  external OnRemoveCallback? onRemove;

  /// Called when an indicator is to be edited
  external OnRemoveCallback? onEdit;
}
