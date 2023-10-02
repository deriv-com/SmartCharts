import 'package:chart_app/src/series/time_interval_painter.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// CurrentTickIndicator
class TimeIntervalIndicator extends Barrier {
  /// Initializes a TimeIntervalIndicator.
  TimeIntervalIndicator(
    double value, {
    int? epoch,
    String? id,
    String? title,
    bool longLine = true,
    HorizontalBarrierStyle? style,
  }) : super(
          id: id,
          title: title,
          epoch: epoch,
          value: value,
          style: style,
          longLine: longLine,
        );

  @override
  bool shouldRepaint(ChartData? previous) => true;

  @override
  SeriesPainter<Series> createPainter() =>
      TimeIntervalPainter<TimeIntervalIndicator>(this);

  @override
  BarrierObject createObject() => BarrierObject(leftEpoch: epoch, value: value);
}
