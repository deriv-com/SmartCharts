import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/marker_icon_painters/tick_marker_icon_painter.dart';
import 'package:chart_app/src/markers/web_marker.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// Accumulator contract painter
class AccumulatorMarkerIconPainter extends TickMarkerIconPainter {
  /// Constructor
  AccumulatorMarkerIconPainter(
    this.width,
    this.height, {
    this.hasPersistentBorders = false,
  });

  /// Width of the canvas
  double width;

  /// Height of the canvas
  double height;

  /// Closed borders
  bool hasPersistentBorders;

  @override
  void paintMarkerGroup(
    Canvas canvas,
    Size size,
    ChartTheme theme,
    MarkerGroup markerGroup,
    EpochToX epochToX,
    QuoteToY quoteToY,
  ) {
    super
        .paintMarkerGroup(canvas, size, theme, markerGroup, epochToX, quoteToY);

    canvas.save();

    final Map<MarkerType, Offset> points = <MarkerType, Offset>{};
    Color? fillColor;

    for (final WebMarker marker in markerGroup.markers) {
      final Offset center = Offset(
        epochToX(marker.epoch),
        quoteToY(marker.quote),
      );

      if (marker.markerType != null) {
        points[marker.markerType!] = center;
      }

      if (marker.markerType == MarkerType.highBarrier) {
        fillColor = marker.color;
      }
    }

    final Offset? _lowBarrier = points[MarkerType.lowBarrier];
    final Offset? _highBarrier = points[MarkerType.highBarrier];

    if (_lowBarrier != null && _highBarrier != null) {
      _drawShadedBarriers(
        canvas: canvas,
        startLeft: _lowBarrier.dx,
        high: _highBarrier.dy,
        style: markerGroup.style,
        low: _lowBarrier.dy,
        fillColor: fillColor,
      );
    }

    canvas.restore();
  }

  void _drawShadedBarriers({
    required Canvas canvas,
    required double startLeft,
    required double high,
    required MarkerStyle style,
    required double low,
    Color? fillColor,
  }) {
    final Paint paint = Paint()
      ..color = style.backgroundColor
      ..style = PaintingStyle.stroke;

    final double right = width - 60;
    final double bottom = height - 30;

    final bool isTopVisible =
        high < bottom && (high >= 0 || !hasPersistentBorders);
    final bool isBottomVisible = low < bottom;
    // using 2 instead of 0 to distance the top barrier line
    // from the top of the chart and make it clearly visible:
    final double persistentTop = high < 0 && hasPersistentBorders ? 2 : bottom;
    final double displayedTop = isTopVisible ? high : persistentTop;
    final double displayedBottom = isBottomVisible ? low : bottom;
    final bool isStartLeftVisible = startLeft < right;

    if (!isStartLeftVisible) {
      return;
    }

    if (isTopVisible || hasPersistentBorders) {
      canvas.drawCircle(
        Offset(startLeft, displayedTop),
        1.5,
        paint,
      );

      paintHorizontalDashedLine(
        canvas,
        startLeft,
        right,
        displayedTop,
        style.backgroundColor,
        1.5,
        dashWidth: 2,
      );
    }
    if (isBottomVisible || hasPersistentBorders) {
      canvas.drawCircle(
        Offset(startLeft, displayedBottom),
        1.5,
        paint,
      );

      paintHorizontalDashedLine(
        canvas,
        startLeft,
        right,
        displayedBottom,
        style.backgroundColor,
        1.5,
        dashWidth: 2,
      );
    }

    final Paint rectPaint = Paint()
      ..color = fillColor ?? const Color.fromRGBO(55, 124, 252, 0.08);

    canvas.drawRect(
        Rect.fromLTRB(startLeft, displayedTop, right, displayedBottom),
        rectPaint);
  }
}
