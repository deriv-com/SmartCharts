import 'package:chart_app/src/series/blinking_tick_indicator.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

///A class for Tick Painter.
class BlinkingTickPainter<T extends BlinkingTickIndicator>
    extends SeriesPainter<T> {
  /// Initializes [series].
  BlinkingTickPainter(T series) : super(series);

  ///
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
    print('paint - ${DateTime.now().second}');

    canvas.drawCircle(
      Offset(epochToX(series.epoch as int), quoteToY(series.value as double)),
      _paint.strokeWidth * animationInfo.currentTickPercent,
      Paint()..color = _paint.color,
    );
  }
}
