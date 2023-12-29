import 'package:chart_app/src/interop/js_interop.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// CustomLinePainter
class CustomLinePainter extends LinePainter {
  /// Intialize
  CustomLinePainter(DataSeries<Tick> series) : super(series);

  @override
  void onPaintData(
    Canvas canvas,
    Size size,
    EpochToX epochToX,
    QuoteToY quoteToY,
    AnimationInfo animationInfo,
  ) {
    super.onPaintData(canvas, size, epochToX, quoteToY, animationInfo);
    JsInterop.onMainSeriesPaint(animationInfo.currentTickPercent);
  }
}
