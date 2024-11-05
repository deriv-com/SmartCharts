import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/series/custom_line_series.dart';
import 'package:deriv_chart/deriv_chart.dart' hide CandleSeries;
import 'package:flutter/material.dart';
import '../series/candle_series.dart';

/// Gets the data series
DataSeries<Tick> getDataSeries(
    ChartFeedModel feedModel, ChartConfigModel configModel, int granularity) {
  final List<Tick> ticks = feedModel.ticks;
  final double opacity = configModel.isSymbolClosed ? 0.32 : 1;
  final bool isLightMode = configModel.theme is ChartDefaultLightTheme;
  // Min granularity 1m
  if (ticks is List<Candle> && granularity >= 60000) {
    final CandleStyle style = CandleStyle(
      positiveColor: Color.fromRGBO(0, 195, 144, opacity),
      negativeColor: Color.fromRGBO(222, 0, 64, opacity),
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
      color: isLightMode
          ? Color.fromRGBO(0, 0, 0, opacity)
          : Color.fromRGBO(255, 255, 255, opacity),
      hasArea: true,
    ),
  );
}
