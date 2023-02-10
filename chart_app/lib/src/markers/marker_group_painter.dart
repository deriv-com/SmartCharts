import 'dart:ui';

import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:chart_app/src/markers/marker_group_series.dart';

/// A [SeriesPainter] for painting [MarkerGroupPainter] data.
class MarkerGroupPainter extends SeriesPainter<MarkerGroupSeries> {
  /// Initializes
  MarkerGroupPainter(MarkerGroupSeries series, this.markerGroupIconPainter)
      : super(series);

  /// Marker painter which is based on trade type
  final MarkerGroupIconPainter markerGroupIconPainter;

  @override
  void onPaint({
    required Canvas canvas,
    required Size size,
    required EpochToX epochToX,
    required QuoteToY quoteToY,
    required AnimationInfo animationInfo,
  }) {
    for (final MarkerGroup markerGroup in series.visibleMarkerGroupList) {
      markerGroupIconPainter.paintMarkerGroup(
        canvas,
        size,
        theme,
        markerGroup,
        epochToX,
        quoteToY,
      );
    }
  }
}
