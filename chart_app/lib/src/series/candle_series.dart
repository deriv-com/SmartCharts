import 'package:deriv_chart/deriv_chart.dart' hide OHLCTypeSeries;
import 'package:deriv_chart/src/deriv_chart/chart/data_visualization/chart_series/ohlc_series/ohlc_type_series.dart';
import './candle_painter.dart';

/// CandleStick series
class CandleSeries extends OHLCTypeSeries {
  /// Initializes
  CandleSeries(
    List<Candle> entries, {
    String? id,
    String? painterType,
    CandleStyle? style,
    HorizontalBarrierStyle? lastTickIndicatorStyle,
  }) : super(
          entries,
          id ?? 'CandleSeries',
          style: style,
          lastTickIndicatorStyle: lastTickIndicatorStyle,
        );

  @override
  SeriesPainter<DataSeries<Candle>> createPainter() => CandlePainter(this);
}
