import 'dart:collection';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

import 'src/helper.dart';
import 'src/models/chart_data.dart';
import 'src/models/chart_config.dart';
import 'src/interop/dart_interop.dart';
import 'src/interop/js_interop.dart';
import 'src/markers/marker_group_series.dart';

void main() {
  runApp(const DerivChartApp());
}

/// The start of the application.
class DerivChartApp extends StatelessWidget {
  /// Initialize
  const DerivChartApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) => MaterialApp(
        theme: ThemeData.light(),
        home: const _DerivChartWebAdapter(),
      );
}

class _DerivChartWebAdapter extends StatefulWidget {
  const _DerivChartWebAdapter({Key? key}) : super(key: key);

  @override
  State<_DerivChartWebAdapter> createState() => _DerivChartWebAdapterState();
}

class _DerivChartWebAdapterState extends State<_DerivChartWebAdapter> {
  _DerivChartWebAdapterState() {
    chartConfigModel = ChartConfigModel(_controller);
    initDartInterop(chartConfigModel, chartDataModel, _controller);
    JsInterop.onChartLoad();
  }

  final ChartController _controller = ChartController();

  final ChartDataModel chartDataModel = ChartDataModel();
  late final ChartConfigModel chartConfigModel;
  late int rightBoundEpoch;
  bool isFollowMode = false;

  void onVisibilityChange(html.Event ev) {
    if (chartConfigModel.dataFitEnabled || chartDataModel.ticks.isEmpty) {
      return;
    }

    if (html.document.visibilityState == 'visible' && isFollowMode) {
      chartConfigModel.scrollToLastTick();
    }

    if (html.document.visibilityState == 'hidden') {
      isFollowMode = rightBoundEpoch > chartDataModel.ticks.last.epoch;
    }
  }

  @override
  void initState() {
    super.initState();
    html.document.addEventListener('visibilitychange', onVisibilityChange);
  }

  @override
  void dispose() {
    super.dispose();
    html.document.removeEventListener('visibilitychange', onVisibilityChange);
  }

  DataSeries<Tick> _getDataSeries(ChartStyle style) {
    if (chartDataModel.ticks is List<Candle>) {
      switch (style) {
        case ChartStyle.candles:
          return CandleSeries(chartDataModel.ticks as List<Candle>);
        case ChartStyle.hollow:
          return HollowCandleSeries(chartDataModel.ticks as List<Candle>);
        case ChartStyle.ohlc:
          return OhlcCandleSeries(chartDataModel.ticks as List<Candle>);
        default:
          break;
      }
    }
    return LineSeries(
      chartDataModel.ticks,
      style: const LineStyle(hasArea: true),
    );
  }

  @override
  Widget build(BuildContext context) => MultiProvider(
        providers: <ChangeNotifierProvider<dynamic>>[
          ChangeNotifierProvider<ChartConfigModel>.value(
              value: chartConfigModel),
          ChangeNotifierProvider<ChartDataModel>.value(value: chartDataModel)
        ],
        child: Scaffold(
          body: Center(
            child: Column(
              children: <Widget>[
                Expanded(
                  child: Consumer2<ChartConfigModel, ChartDataModel>(builder:
                      (BuildContext context, ChartConfigModel chartConfigModel,
                          ChartDataModel chartDataModel, Widget? child) {
                    if (chartDataModel.ticks.isEmpty) {
                      return const SizedBox.shrink();
                    }

                    final DataSeries<Tick> mainSeries =
                        _getDataSeries(chartConfigModel.style);

                    return DerivChart(
                      mainSeries: mainSeries,
                      annotations: chartDataModel.ticks.length > 4
                          ? <Barrier>[
                              if (chartConfigModel.isLive)
                                TickIndicator(
                                  chartDataModel.ticks.last,
                                  style: const HorizontalBarrierStyle(
                                    color: Colors.redAccent,
                                    labelShape: LabelShape.pentagon,
                                    hasBlinkingDot: true,
                                    hasArrow: false,
                                  ),
                                  visibility: HorizontalBarrierVisibility
                                      .keepBarrierLabelVisible,
                                ),
                            ]
                          : null,
                      granularity: chartConfigModel.granularity ?? 1000,
                      controller: _controller,
                      theme: chartConfigModel.theme,
                      onVisibleAreaChanged: (int leftEpoch, int rightEpoch) {
                        if (!chartDataModel.waitingForHistory &&
                            chartDataModel.ticks.isNotEmpty &&
                            leftEpoch < chartDataModel.ticks.first.epoch) {
                          chartDataModel.loadHistory(2500);
                        }
                        rightBoundEpoch = rightEpoch;
                        JsInterop.onVisibleAreaChanged(leftEpoch, rightEpoch);
                      },
                      onQuoteAreaChanged:
                          (double topQuote, double bottomQuote) {
                        JsInterop.onQuoteAreaChanged(topQuote, bottomQuote);
                      },
                      markerSeries: MarkerGroupSeries(
                        SplayTreeSet<Marker>(),
                        markerGroupList: chartConfigModel.markerGroupList,
                        markerGroupIconPainter: getMarkerGroupPainter(
                          context,
                          chartConfigModel.contractType,
                        ),
                      ),
                      drawingToolsRepo:
                          chartConfigModel.indicators.drawingToolsRepo,
                      indicatorsRepo:
                          chartConfigModel.indicators.indicatorsRepo,
                      dataFitEnabled: chartConfigModel.dataFitEnabled,
                      showCrosshair: chartConfigModel.showCrosshair,
                      isLive: chartConfigModel.isLive,
                      onCrosshairDisappeared: JsInterop.onCrosshairDisappeared,
                      onCrosshairHover:
                          (PointerHoverEvent ev, int epoch, String quote) {
                        JsInterop.onCrosshairHover(
                            ev.position.dx, ev.position.dy, epoch, quote);
                      },
                      maxCurrentTickOffset: 300,
                      msPerPx: chartConfigModel.msPerPx,
                      leftMargin: chartConfigModel.leftMargin,
                    );
                  }),
                ),
              ],
            ),
          ),
        ),
      );
}
