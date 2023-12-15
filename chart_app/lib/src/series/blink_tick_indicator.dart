import 'package:chart_app/src/painters/blink_tick_painter.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// BlinkingTickIndicator
class BlinkingTickIndicator extends TickIndicator {
  /// Initializes a BlinkingTickIndicator.
  BlinkingTickIndicator(
    Tick tick, {
    String? id,
    HorizontalBarrierStyle? style,
    HorizontalBarrierVisibility visibility = HorizontalBarrierVisibility.normal,
  }) : super(
          tick,
          id: id,
          style: style,
          visibility: visibility,
        );

  @override
  bool shouldRepaint(ChartData? previous) => true;

  @override
  SeriesPainter<Series> createPainter() =>
      BlinkingTickPainter<BlinkingTickIndicator>(this);
}
