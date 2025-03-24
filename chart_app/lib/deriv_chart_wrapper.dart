import 'dart:collection';
import 'dart:math';
import 'dart:ui';

import 'package:chart_app/src/chart_app.dart';
import 'package:chart_app/src/helpers/marker_painter.dart';
import 'package:chart_app/src/helpers/series.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/misc/crosshair_controller.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:chart_app/src/models/drawing_tool.dart';
import 'package:chart_app/src/models/indicators.dart';
import 'package:chart_app/src/series/blink_tick_indicator.dart';
import 'package:chart_app/src/series/current_tick_indicator.dart';
import 'package:chart_app/src/series/time_interval_indicator.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

/// DerivChartWrapper
class DerivChartWrapper extends StatefulWidget {
  /// Initialize
  const DerivChartWrapper({
    required this.app,
    required this.onVisibleAreaChanged,
    Key? key,
  }) : super(key: key);

  /// ChartApp
  final ChartApp app;

  /// Called when chart is scrolled or zoomed.
  final VisibleAreaChangedCallback onVisibleAreaChanged;

  @override
  State<DerivChartWrapper> createState() => DerivChartWrapperState();
}

/// DerivChartWrapperState
class DerivChartWrapperState extends State<DerivChartWrapper> {
  /// Initialize
  DerivChartWrapperState() {
    _useLowAnimation = _shouldUseLowAnimation();
  }

  /// Epochs
  int? leftBoundEpoch, rightBoundEpoch;

  /// App
  ChartApp get app => widget.app;

  /// ConfigModel
  ChartConfigModel get configModel => widget.app.configModel;

  /// IndicatorsModel
  IndicatorsModel get indicatorsModel => widget.app.indicatorsModel;

  /// ChartFeedModel
  ChartFeedModel get feedModel => widget.app.feedModel;

  /// DrawingToolModel
  DrawingToolModel get drawingToolModel => widget.app.drawingToolModel;

  bool _useLowAnimation = false;

  final EdgeInsets _minFitPadding = const EdgeInsets.only(left: 16, right: 120);

  @override
  void initState() {
    super.initState();
  }

  bool _shouldUseLowAnimation() {
    final String userAgent = html.window.navigator.userAgent;

    final List<String> devices = <String>[
      'Android',
      'iPhone',
      'iPad',
      'Mac',
      'Windows'
    ];

    return !devices.any((String device) => userAgent.contains(device));
  }

  double? _getVerticalPaddingFraction(double height) {
    if (configModel.yAxisMargin != null && height != 0) {
      // We are converting yAxisMargin to verticalPaddingFraction to make it
      // compatible with ChartIQ.
      // TO DO: Do a proper fix once ChartIQ is removed
      final double multiplier = configModel.startWithDataFitMode ? 1.5 : 1.25;
      final double verticalPaddingFraction = (max(
                  configModel.yAxisMargin!.top ?? 0,
                  configModel.yAxisMargin!.bottom ?? 0) *
              multiplier) /
          height;

      return verticalPaddingFraction.clamp(0.1, 0.45);
    }
    return null;
  }

  double _getMaxCurrentTickOffset(int? rightPadding) {
    final double currentTickOffset =
        configModel.startWithDataFitMode ? 150 : 300;
    return configModel.isMobile
        ? currentTickOffset / 1.25
        : currentTickOffset + (rightPadding ?? 0);
  }

  double _getMinIntervalWidth() {
    if (configModel.startWithDataFitMode &&
        configModel.style == ChartStyle.line) {
      return 0.1;
    }
    return 1;
  }

  double _getMaxIntervalWidth() {
    if (configModel.startWithDataFitMode &&
        configModel.style == ChartStyle.line &&
        feedModel.ticks.length <= 10) {
      return 160;
    }
    return 80;
  }

  Duration _getAnimationDuration({required bool isTickGranularity}) {
    if (!isTickGranularity) {
      return const Duration(milliseconds: 30);
    }

    final int visibleEpoch = (rightBoundEpoch ?? 0) - (leftBoundEpoch ?? 0);
    // 15 mins
    const int minEpochToScrollSmooth = 15 * 60 * 1000;

    if (visibleEpoch > minEpochToScrollSmooth ||
        indicatorsModel.indicatorsRepo.items.length >= 2) {
      return const Duration(milliseconds: 30);
    }

    if (_useLowAnimation) {
      return const Duration(milliseconds: 100);
    }

    return const Duration(milliseconds: 250);
  }

  int? _getRightPadding(bool isTickGranularity, int granularity, double width) {
    if (configModel.rightPadding != null && configModel.rightPadding! > 0) {
      return configModel.rightPadding!;
    }

    if (isTickGranularity &&
        configModel.startWithDataFitMode &&
        configModel.style == ChartStyle.line &&
        feedModel.ticks.length <= 10) {
      final int msDataDuration = feedModel.ticks.length * granularity;
      final double pxTargetDataWidth = width - _minFitPadding.horizontal;

      final double _minMsPerPx = granularity / _getMaxIntervalWidth();
      final double _maxMsPerPx = granularity / _getMinIntervalWidth();
      final double msPerPx = msDataDuration / pxTargetDataWidth;
      final double clampedMsPerPx = msPerPx.clamp(_minMsPerPx, _maxMsPerPx);

      if (msPerPx >= clampedMsPerPx) {
        final int extraRightPadding = granularity ~/ (clampedMsPerPx * 2);
        return extraRightPadding;
      }

      final double msPerPxDiff = clampedMsPerPx - msPerPx;

      /// Added one granularity because tick_history will have one extra tick
      /// to indicate the start
      final int extraRightPadding =
          (msPerPxDiff * pxTargetDataWidth + granularity) ~/
              (clampedMsPerPx * 2);

      return extraRightPadding;
    }
    return null;
  }

  EdgeInsets? _getDataFitPadding(int? rightPadding) {
    if (rightPadding != null && rightPadding > 0) {
      return EdgeInsets.only(
        left: _minFitPadding.left,
        right: _minFitPadding.right + rightPadding,
      );
    }
    return null;
  }

  void _onCrosshairHover(
    Offset globalPosition,
    Offset localPosition,
    EpochToX epochToX,
    QuoteToY quoteToY,
    EpochFromX epochFromX,
    QuoteFromY quoteFromY,
    AddOnConfig? config,
  ) {
    final CrosshairController controller =
        app.wrappedController.getCrosshairController();

    int? index;

    if (config != null) {
      index = indicatorsModel.indicatorsRepo.items
          .indexOf(config as IndicatorConfig);
    }

    // ignore: cascade_invocations
    controller
      ..getEpochFromX_ = epochFromX
      ..getQuoteFromY_ = quoteFromY
      ..getXFromEpoch_ = epochToX
      ..getYFromQuote_ = quoteToY;

    JsInterop.onCrosshairHover(
      globalPosition.dx,
      globalPosition.dy,
      localPosition.dx,
      localPosition.dy,
      index,
    );
  }

  @override
  Widget build(BuildContext context) => MultiProvider(
        providers: <ChangeNotifierProvider<ChangeNotifier>>[
          ChangeNotifierProvider<ChartConfigModel>.value(value: configModel),
          ChangeNotifierProvider<ChartFeedModel>.value(value: feedModel)
        ],
        child: Scaffold(
          body: LayoutBuilder(
            builder: (BuildContext _, BoxConstraints constraints) => Center(
              child: Column(
                children: <Widget>[
                  Expanded(child: Consumer2<ChartConfigModel, ChartFeedModel>(
                      builder: (BuildContext context,
                          ChartConfigModel configModel,
                          ChartFeedModel feedModel,
                          Widget? child) {
                    final int granularity = app.getQuotesInterval();

                    final bool isTickGranularity = granularity < 60000;

                    final bool isLightMode =
                        configModel.theme is ChartDefaultLightTheme;

                    final DataSeries<Tick> mainSeries =
                        getDataSeries(feedModel, configModel, granularity);

                    final Color latestTickColor = isLightMode
                        ? Color.fromRGBO(
                            0, 0, 0, configModel.isSymbolClosed ? 0.32 : 1)
                        : Color.fromRGBO(255, 255, 255,
                            configModel.isSymbolClosed ? 0.32 : 1);

                    final Duration animationDuration = _getAnimationDuration(
                        isTickGranularity: isTickGranularity);

                    final int? rightPadding = _getRightPadding(
                        isTickGranularity, granularity, constraints.maxWidth);

                    return DerivChart(
                      activeSymbol: configModel.symbol,
                      mainSeries: mainSeries,
                      annotations: feedModel.ticks.isNotEmpty
                          ? <Barrier>[
                              if (configModel.isLive)
                                CurrentTickIndicator(
                                  feedModel.ticks.last,
                                  id: 'last_tick_indicator',
                                  style: HorizontalBarrierStyle(
                                      labelPadding: 8,
                                      color: latestTickColor,
                                      hasArrow: false,
                                      textStyle: TextStyle(
                                        fontSize: 12,
                                        height: 1.3,
                                        fontWeight: FontWeight.w600,
                                        color: isLightMode
                                            ? Colors.white
                                            : Colors.black,
                                        fontFeatures: const <FontFeature>[
                                          FontFeature.tabularFigures()
                                        ],
                                      )),
                                  visibility: HorizontalBarrierVisibility
                                      .keepBarrierLabelVisible,
                                ),
                              if (configModel.isLive)
                                BlinkingTickIndicator(feedModel.ticks.last,
                                    id: 'blink_tick_indicator',
                                    visibility: HorizontalBarrierVisibility
                                        .keepBarrierLabelVisible,
                                    style: HorizontalBarrierStyle(
                                      color: isLightMode
                                          ? Colors.black
                                          : Colors.white,
                                    )),
                              if (app.configModel.showTimeInterval &&
                                  !isTickGranularity)
                                TimeIntervalIndicator(
                                  app.configModel.remainingTime,
                                  feedModel.ticks.last.close,
                                  longLine: false,
                                  style: HorizontalBarrierStyle(
                                    color: isLightMode
                                        ? Colors.black
                                        : Colors.white,
                                    hasArrow: false,
                                    textStyle: TextStyle(
                                      fontSize: 12,
                                      height: 1.3,
                                      fontWeight: FontWeight.w600,
                                      color: isLightMode
                                          ? Colors.white
                                          : Colors.black,
                                      fontFeatures: const <FontFeature>[
                                        FontFeature.tabularFigures()
                                      ],
                                    ),
                                  ),
                                ),
                            ]
                          : null,
                      pipSize: configModel.pipSize,
                      granularity: granularity,
                      controller: app.wrappedController.getChartController(),
                      theme: configModel.theme,
                      onVisibleAreaChanged: (int leftEpoch, int rightEpoch) {
                        if (!feedModel.waitingForHistory &&
                            feedModel.ticks.isNotEmpty &&
                            leftEpoch < feedModel.ticks.first.epoch) {
                          feedModel.loadHistory(2500);
                        }
                        leftBoundEpoch = leftEpoch;
                        rightBoundEpoch = rightEpoch;
                        widget.onVisibleAreaChanged(leftEpoch, rightEpoch);
                        JsInterop.onVisibleAreaChanged(leftEpoch, rightEpoch);
                      },
                      onQuoteAreaChanged:
                          (double topQuote, double bottomQuote) {
                        JsInterop.onQuoteAreaChanged(topQuote, bottomQuote);
                      },
                      markerSeries: MarkerGroupSeries(
                        SplayTreeSet<Marker>(),
                        markerGroupList: configModel.markerGroupList,
                        markerGroupIconPainter: getMarkerGroupPainter(app),
                      ),
                      drawingToolsRepo: drawingToolModel.drawingToolsRepo,
                      drawingTools: drawingToolModel.drawingTools,
                      indicatorsRepo: indicatorsModel.indicatorsRepo,
                      dataFitEnabled: configModel.startWithDataFitMode,
                      showCrosshair: configModel.showCrosshair,
                      isLive: configModel.isLive,
                      onCrosshairDisappeared: JsInterop.onCrosshairDisappeared,
                      onCrosshairHover: _onCrosshairHover,
                      chartAxisConfig: ChartAxisConfig(
                        maxCurrentTickOffset:
                            _getMaxCurrentTickOffset(rightPadding),
                      ),
                      msPerPx: configModel.startWithDataFitMode
                          ? null
                          : configModel.msPerPx,
                      minIntervalWidth: _getMinIntervalWidth(),
                      maxIntervalWidth: _getMaxIntervalWidth(),
                      dataFitPadding: _getDataFitPadding(rightPadding),
                      bottomChartTitleMargin: configModel.leftMargin != null
                          ? EdgeInsets.only(left: configModel.leftMargin!)
                          : null,
                      verticalPaddingFraction:
                          _getVerticalPaddingFraction(constraints.maxHeight),
                      showDataFitButton: false,
                      showScrollToLastTickButton: false,
                      loadingAnimationColor: Colors.transparent,
                      showCurrentTickBlinkAnimation: false,
                      currentTickAnimationDuration: animationDuration,
                      quoteBoundsAnimationDuration: animationDuration,
                    );
                  }))
                ],
              ),
            ),
          ),
        ),
      );
}
