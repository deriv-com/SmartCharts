import 'package:chart_app/src/series/blinking_tick_indicator.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'dart:ui' as ui;

///A class for Tick Painter.
class BlinkingTickPainter<T extends BlinkingTickIndicator>
    extends HorizontalBarrierPainter<T> {
  /// Initializes [series].
  BlinkingTickPainter(T series) : super(series);

  /// Paint
  late Paint _paint;

  @override
  void onPaint({
    required Canvas canvas,
    required Size size,
    required EpochToX epochToX,
    required QuoteToY quoteToY,
    required AnimationInfo animationInfo,
  }) {
    _paint = Paint()
      ..style = PaintingStyle.fill
      ..strokeWidth = 4
      ..color = Colors.redAccent;

    /// Animated Value
    double? animatedValue;

    /// Epoch X
    double? dotX;

    if (series.previousObject == null) {
      animatedValue = series.value;
      if (series.epoch != null) {
        dotX = epochToX(series.epoch!);
      }
    } else {
      final BarrierObject previousBarrier = series.previousObject!;
      animatedValue = series.value;

      animatedValue = ui.lerpDouble(
        previousBarrier.value,
        series.value,
        animationInfo.currentTickPercent,
      );

      if (series.epoch != null && series.previousObject!.leftEpoch != null) {
        dotX = ui.lerpDouble(
          epochToX(series.previousObject!.leftEpoch!),
          epochToX(series.epoch!),
          animationInfo.currentTickPercent,
        );
      }
    }

    final double y = quoteToY(animatedValue!);

    // print('current tick percent - ${animationInfo.currentTickPercent}');
    // print('paint - ${DateTime.now().second}');

    if (animationInfo.currentTickPercent > 0.85) {
      canvas.drawCircle(
        Offset(dotX as double, y),
        animationInfo.currentTickPercent * 9,
        Paint()..color = _paint.color.withOpacity(0.2),
      );
    }

    canvas.drawCircle(
      Offset(dotX as double, y),
      4,
      Paint()..color = _paint.color,
    );
  }
}
