import 'dart:js';

import 'dart:html' as html;
import 'dart:js_util';

import 'package:chart_app/src/chart_app.dart';
import 'package:chart_app/src/misc/crosshair_controller.dart';
import 'package:chart_app/src/models/indicators.dart';
import 'package:chart_app/src/models/chart_config.dart';
import 'package:chart_app/src/models/chart_feed.dart';

/// Refactor the code later with JSExport once the below issue is resolved.
/// https://github.com/dart-lang/sdk/issues/50721

/// Initialize
void initDartInterop(ChartApp app) {
  final JsObject dartInterop = JsObject(context['Object']);
  setProperty(dartInterop, 'config', _exposeConfigModel(app.configModel));
  setProperty(
      dartInterop, 'indicators', _exposeIndicatorsModel(app.indicatorsModel));
  setProperty(dartInterop, 'feed', _exposeDataModel(app.feedModel));
  setProperty(dartInterop, 'app', _exposeApp(app));
  setProperty(dartInterop, 'crosshair', _exposeCrosshair(app));
  setProperty(html.window, 'flutterChart', dartInterop);
}

JsObject _exposeApp(ChartApp app) {
  final JsObject jsObject = JsObject(context['Object']);

  setProperty(
    jsObject,
    'getYAxisWidth',
    allowInterop(() => app.yAxisWidth),
  );

  setProperty(
    jsObject,
    'newChart',
    allowInterop(app.newChart),
  );

  setProperty(
    jsObject,
    'getTooltipContent',
    allowInterop(app.getTooltipContent),
  );

  setProperty(
    jsObject,
    'getIndicatorHoverIndex',
    allowInterop(app.getIndicatorHoverIndex),
  );

  setProperty(jsObject, 'getXFromEpoch',
      allowInterop(app.wrappedController.getXFromEpoch));

  setProperty(jsObject, 'getYFromQuote',
      allowInterop(app.wrappedController.getYFromQuote));

  setProperty(jsObject, 'getEpochFromX',
      allowInterop(app.wrappedController.getEpochFromX));

  setProperty(jsObject, 'getQuoteFromY',
      allowInterop(app.wrappedController.getQuoteFromY));

  setProperty(jsObject, 'scale', allowInterop(app.wrappedController.scale));

  setProperty(jsObject, 'scroll', allowInterop(app.wrappedController.scroll));

  setProperty(
    jsObject,
    'scrollToLastTick',
    allowInterop(
      app.wrappedController.scrollToLastTick,
    ),
  );

  setProperty(
    jsObject,
    'toggleDataFitMode',
    allowInterop(app.wrappedController.toggleDataFitMode),
  );

  return jsObject;
}

JsObject _exposeCrosshair(ChartApp app) {
  final JsObject crosshair = JsObject(context['Object']);

  final CrosshairController controller =
      app.wrappedController.getCrosshairController();

  setProperty(
      crosshair, 'getXFromEpoch', allowInterop(controller.getXFromEpoch));

  setProperty(
      crosshair, 'getYFromQuote', allowInterop(controller.getYFromQuote));

  setProperty(
      crosshair, 'getEpochFromX', allowInterop(controller.getEpochFromX));

  setProperty(
      crosshair, 'getQuoteFromY', allowInterop(controller.getQuoteFromY));

  return crosshair;
}

JsObject _exposeDataModel(ChartFeedModel model) {
  final JsObject feedModel = JsObject(context['Object']);

  setProperty(
    feedModel,
    'onTickHistory',
    allowInterop(model.onTickHistory),
  );

  setProperty(
    feedModel,
    'onNewTick',
    allowInterop(model.onNewTick),
  );

  setProperty(
    feedModel,
    'onNewCandle',
    allowInterop(model.onNewCandle),
  );

  return feedModel;
}

JsObject _exposeConfigModel(ChartConfigModel model) {
  final JsObject chartConfig = JsObject(context['Object']);

  setProperty(
    chartConfig,
    'updateTheme',
    allowInterop(model.updateTheme),
  );

  setProperty(
    chartConfig,
    'newChart',
    allowInterop(model.newChart),
  );

  setProperty(
    chartConfig,
    'updateChartStyle',
    allowInterop(model.updateChartStyle),
  );

  setProperty(
    chartConfig,
    'updateMarkers',
    allowInterop(model.updateMarkers),
  );

  setProperty(
    chartConfig,
    'updateLiveStatus',
    allowInterop(model.updateLiveStatus),
  );

  setProperty(
    chartConfig,
    'updateCrosshairVisibility',
    allowInterop(model.updateCrosshairVisibility),
  );

  setProperty(
    chartConfig,
    'updateLeftMargin',
    allowInterop(model.updateLeftMargin),
  );

  setProperty(
    chartConfig,
    'setSymbolClosed',
    allowInterop(model.setSymbolClosed),
  );

  return chartConfig;
}

JsObject _exposeIndicatorsModel(IndicatorsModel model) {
  final JsObject chartConfig = JsObject(context['Object']);

  setProperty(
    chartConfig,
    'addOrUpdateIndicator',
    allowInterop(model.addOrUpdateIndicator),
  );

  setProperty(
    chartConfig,
    'removeIndicator',
    allowInterop(model.removeIndicator),
  );

  setProperty(
    chartConfig,
    'clearIndicators',
    allowInterop(model.clearIndicators),
  );

  return chartConfig;
}
