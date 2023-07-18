import 'package:chart_app/src/markers/web_marker.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// Chart open position marker.
class MarkerGroup implements Comparable<MarkerGroup> {
  /// Initialize marker group
  MarkerGroup(
    this.markers, {
    required this.type,
    this.id,
    this.style = const MarkerStyle(),
  });

  /// Marker entries.
  final List<WebMarker> markers;

  /// Marker group id.
  final String? id;

  /// The `MarkerStyle` to paint the markers.
  final MarkerStyle style;

  /// Marker group type.
  final String type;

  @override
  int compareTo(covariant MarkerGroup other) {
    final int epoch = markers.isNotEmpty ? markers.first.epoch : 0;
    final int otherEpoch =
        other.markers.isNotEmpty ? other.markers.first.epoch : 0;
    return epoch.compareTo(otherEpoch);
  }
}
