import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/series/custom_line_series.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// Gets the data series
DataSeries<Tick> getDataSeries(
    ChartFeedModel feedModel, ChartConfigModel configModel, int granularity) {
  final List<Tick> ticks = feedModel.ticks;
  final double opacity = configModel.isSymbolClosed ? 0.32 : 1;
// rgb(249,84,84)
  // Min granularity 1m
  if (ticks is List<Candle> && granularity >= 60000) {
    final CandleStyle? style = CandleStyle(
      positiveColor: Color.fromRGBO(249, 84, 84, opacity),
      negativeColor: Color.fromRGBO(76, 175, 80, opacity),
      neutralColor: Color.fromRGBO(85, 89, 117, opacity),
          );

    switch (configModel.style) {
      case ChartStyle.candles:
        return CandleSeries(ticks, style: style);
      case ChartStyle.hollow:
        return HollowCandleSeries(ticks, style: style);
      case ChartStyle.ohlc:
        return OhlcCandleSeries(ticks, style: style);
      default:
        break;
    }
  }
  return CustomLineSeries(
    ticks,
    style: LineStyle(
      color: Color.fromRGBO(133, 172, 176, opacity),
      hasArea: true,
    ),
  );
}
