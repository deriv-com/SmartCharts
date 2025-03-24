import 'package:chart_app/src/series/time_interval_painter.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// CurrentTickIndicator
class TimeIntervalIndicator extends HorizontalBarrier {
  /// Initializes a TimeIntervalIndicator.
  TimeIntervalIndicator(
    this.timePeriod,
    double value, {
    int? epoch,
    String? id,
    String? title,
    bool longLine = true,
    HorizontalBarrierStyle? style,
  }) : super(
          value,
          id: id,
          title: title,
          epoch: epoch,
          style: style,
          longLine: longLine,
        );

  /// Time String
  String timePeriod = '--:--';

  // TODO: optimizing the shouldRepaint
  @override
  bool shouldRepaint(ChartData? previous) => true;

  @override
  SeriesPainter<Series> createPainter() =>
      TimeIntervalPainter<TimeIntervalIndicator>(this);
}
