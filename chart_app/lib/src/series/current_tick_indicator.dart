import 'package:deriv_chart/deriv_chart.dart';

/// CurrentTickIndicator
class CurrentTickIndicator extends TickIndicator {
  /// Initializes a CurrentTickIndicator.
  CurrentTickIndicator(
    Tick tick, {
    String? id,
    this.dataFitEnabled = false,
    HorizontalBarrierStyle? style,
    HorizontalBarrierVisibility visibility = HorizontalBarrierVisibility.normal,
  }) : super(
          tick,
          id: id,
          style: style,
          visibility: visibility,
        );

  /// Whether the dataFit is enabled or not
  bool dataFitEnabled;

  @override
  bool shouldRepaint(ChartData? previous) {
    /// To fix the animation issue when the chart is in data fit mode.
    if (dataFitEnabled) {
      return true;
    }
    return super.shouldRepaint(previous);
  }
}
