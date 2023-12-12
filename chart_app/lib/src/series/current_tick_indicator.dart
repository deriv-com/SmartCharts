import 'package:deriv_chart/deriv_chart.dart';

/// CurrentTickIndicator
class CurrentTickIndicator extends TickIndicator {
  /// Initializes a CurrentTickIndicator.
  CurrentTickIndicator(
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
}
