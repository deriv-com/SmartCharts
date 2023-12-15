import 'dart:ui';

import 'package:chart_app/src/markers/helpers/convert_range.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:chart_app/src/markers/painter_props.dart';
import 'package:chart_app/src/misc/wrapped_controller.dart';
import 'package:chart_app/src/markers/marker_group_series.dart';

/// A [SeriesPainter] for painting [MarkerGroupPainter] data.
class MarkerGroupPainter extends SeriesPainter<MarkerGroupSeries> {
  /// Initializes
  MarkerGroupPainter(
    MarkerGroupSeries series,
    this.markerGroupIconPainter, {
    required this.controller,
    required this.yAxisWidth,
    required this.isMobile,
    required this.granularity,
  }) : super(series);

  /// Marker painter which is based on trade type
  final MarkerGroupIconPainter markerGroupIconPainter;

  /// WrappedController
  final WrappedController controller;

  /// yAxisWidth
  final double yAxisWidth;

  /// Whether it is in mobile mode or not.
  final bool isMobile;

  /// Granulatiry of the chart.
  final int granularity;

  @override
  void onPaint({
    required Canvas canvas,
    required Size size,
    required EpochToX epochToX,
    required QuoteToY quoteToY,
    required AnimationInfo animationInfo,
  }) {
    final double? msPerPx = controller.getMsPerPx();

    final double zoom = msPerPx != null
        ? convertRange(msPerPx / granularity, 0, 1, 0.8, 1.2)
        : 1;

    for (final MarkerGroup markerGroup in series.visibleMarkerGroupList) {
      markerGroupIconPainter.paintMarkerGroup(
        canvas,
        size,
        theme,
        markerGroup,
        epochToX,
        quoteToY,
        PainterProps(zoom, yAxisWidth, isMobile: isMobile),
      );
    }
  }
}
