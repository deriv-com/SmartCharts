import 'package:chart_app/src/markers/helpers/paint_functions/paint_vertical_line.dart';
import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:chart_app/src/markers/web_marker.dart';
import 'package:flutter/material.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:chart_app/src/markers/helpers/paint_functions/paint_end_marker.dart';
import 'package:chart_app/src/markers/helpers/paint_functions/paint_start_marker.dart';
import 'package:chart_app/src/markers/helpers/paint_functions/paint_start_line.dart';

/// Tick contract painter
class TickMarkerIconPainter extends MarkerGroupIconPainter {
  @override
  void paintMarkerGroup(
    Canvas canvas,
    Size size,
    ChartTheme theme,
    MarkerGroup markerGroup,
    EpochToX epochToX,
    QuoteToY quoteToY,
  ) {
    final Map<MarkerType, Offset> points = <MarkerType, Offset>{};

    for (final WebMarker marker in markerGroup.markers) {
      final Offset center = Offset(
        epochToX(marker.epoch),
        quoteToY(marker.quote),
      );

      if (marker.markerType != null) {
        points[marker.markerType!] = center;
      }

      _drawMarker(canvas, size, theme, marker, center, markerGroup.style);
    }

    _drawBarriers(canvas, points, markerGroup.style);
  }

  void _drawBarriers(
      Canvas canvas, Map<MarkerType, Offset> points, MarkerStyle style) {
    final Paint paint = Paint()..color = style.backgroundColor;
    final Offset? _entryOffset = points[MarkerType.entry];
    final Offset? _entryTickOffset = points[MarkerType.entryTick];
    final Offset? _startOffset = points[MarkerType.start];
    final Offset? _latestOffset = points[MarkerType.latestTick];
    final Offset? _endOffset = points[MarkerType.end];
    final Offset? _exitOffset = points[MarkerType.exit];

    if (_entryOffset != null) {
      paintHorizontalDashedLine(
        canvas,
        _startOffset!.dx,
        _entryOffset.dx,
        _startOffset.dy,
        style.backgroundColor,
        1,
        dashWidth: 1,
        dashSpace: 1,
      );
    }

    if (_entryOffset != null && (_latestOffset != null || _endOffset != null)) {
      canvas.drawLine(_entryOffset, _latestOffset ?? _endOffset!, paint);
    }

    if (_entryOffset != null && _entryTickOffset != null) {
      paintVerticalLine(
        canvas,
        _entryOffset,
        _entryTickOffset,
        style,
        1,
        dashWidth: 2,
        dashSpace: 2,
      );
    }

    if (_exitOffset != null && _endOffset != null) {
      paintVerticalLine(
        canvas,
        _exitOffset,
        _endOffset,
        style,
        1,
        dashWidth: 2,
        dashSpace: 2,
      );
    }
  }

  void _drawMarker(Canvas canvas, Size size, ChartTheme theme, WebMarker marker,
      Offset anchor, MarkerStyle style) {
    final Paint paint = Paint()..color = style.backgroundColor;
    switch (marker.markerType) {
      case MarkerType.activeStart:
        paintStartLine(canvas, size, marker, anchor, style);
        break;
      case MarkerType.start:
        _drawStartPoint(canvas, size, theme, marker, anchor, style);
        break;
      case MarkerType.entry:
        canvas.drawCircle(
          anchor,
          2,
          paint,
        );
        break;
      case MarkerType.end:
        paintEndMarker(canvas, theme, anchor - const Offset(1, 20), style);
        break;
      case MarkerType.exit:
        canvas.drawCircle(
          anchor,
          2,
          paint,
        );
        break;
      case MarkerType.tick:
        _drawTickPoint(canvas, anchor, paint);
        break;
      default:
        break;
    }
  }

  void _drawTickPoint(Canvas canvas, Offset anchor, Paint paint) {
    canvas.drawCircle(
      anchor,
      2,
      paint,
    );
  }

  void _drawStartPoint(Canvas canvas, Size size, ChartTheme theme,
      WebMarker marker, Offset anchor, MarkerStyle style) {
    if (marker.quote != 0) {
      paintStartMarker(canvas, anchor - const Offset(10, 20), style, 20);
    }

    if (marker.text != null) {
      final TextStyle textStyle = TextStyle(
        color: marker.color ?? style.backgroundColor,
        fontSize: style.activeMarkerText.fontSize,
        fontWeight: FontWeight.bold,
        backgroundColor: theme.base08Color,
      );

      final TextPainter textPainter = makeTextPainter(marker.text!, textStyle);

      final Offset iconShift =
          Offset(textPainter.width / 2, 20 + textPainter.height);

      paintWithTextPainter(
        canvas,
        painter: textPainter,
        anchor: anchor - iconShift,
        anchorAlignment: Alignment.centerLeft,
      );
    }
  }
}
