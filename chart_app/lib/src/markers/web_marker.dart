import 'package:deriv_chart/deriv_chart.dart';

/// Type of marker.
enum MarkerType {
  /// Active start marker.
  activeStart,

  /// Start marker.
  start,

  /// Entry marker.
  entry,

  /// Latest tick marker.
  latestTick,

  /// Tick marker.
  tick,

  /// End marker.
  end,

  /// Exit marker.
  exit,
}

/// Chart open position marker.
// ignore: must_be_immutable
class WebMarker extends Marker {
  /// Initializes.
  WebMarker({
    required int epoch,
    required double quote,
    required MarkerDirection direction,
    this.markerType,
    this.text,
  }) : super(epoch: epoch, quote: quote, direction: direction);

  /// Type of marker.
  final MarkerType? markerType;

  /// Text displayed on the marker.
  final String? text;
}
