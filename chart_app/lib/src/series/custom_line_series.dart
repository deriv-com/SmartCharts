import 'package:chart_app/src/painters/custom_line_painter.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// CustomLineSeries
class CustomLineSeries extends LineSeries {
  /// Initializes a line series.
  CustomLineSeries(
    List<Tick> entries, {
    String? id,
    LineStyle? style,
    HorizontalBarrierStyle? lastTickIndicatorStyle,
  }) : super(
          entries,
          id: id,
          style: style,
          lastTickIndicatorStyle: lastTickIndicatorStyle,
        );

  @override
  SeriesPainter<DataSeries<Tick>> createPainter() => CustomLinePainter(
        this,
      );
}
