import 'dart:convert';

import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/add_ons/add_ons_repository.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:flutter/material.dart';
import 'package:collection/collection.dart' show IterableExtension;

/// State and methods of chart web adapter config.
class IndicatorsModel extends ChangeNotifier {
  /// Initialize
  IndicatorsModel(this._controller);

  late final ChartController _controller;

  /// Indicators repo
  final AddOnsRepository<IndicatorConfig> indicatorsRepo =
      AddOnsRepository<IndicatorConfig>(
    onEditCallback: JsInterop.indicators?.onEdit,
    onRemoveCallback: JsInterop.indicators?.onRemove,
    onSwapCallback: JsInterop.indicators?.onSwap,
  );

  /// Drawing tools repo
  final AddOnsRepository<DrawingToolConfig> drawingToolsRepo =
      AddOnsRepository<DrawingToolConfig>();

  /// To add or update an indicator
  void addOrUpdateIndicator(String dataString, int? index) {
    final Map<String, dynamic> config = json.decode(dataString)..remove('id');

    final IndicatorConfig? indicatorConfig = IndicatorConfig.fromJson(config);

    if (indicatorConfig != null) {
      index != null && index > -1
          ? indicatorsRepo.updateAt(index, indicatorConfig)
          : indicatorsRepo.add(indicatorConfig);
    }
  }

  /// To remove an existing indicator
  void removeIndicator(int index) {
    indicatorsRepo.remove(index);
  }

  /// To clear all indicators
  void clearIndicators() {
    indicatorsRepo.clear();
  }

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip>? getTootipContent(int epoch) {
    final List<ChartData>? chartDataList = _controller.getChartDataList?.call();

    final List<JsIndicatorTooltip> tooltipContent = <JsIndicatorTooltip>[];

    if (chartDataList == null) {
      return null;
    }

    for (final ChartData item in chartDataList) {
      if (item is AwesomeOscillatorSeries) {
        final Tick? tick =
            item.entries?.firstWhereOrNull((Tick t) => t.epoch == epoch);

        final String quote = tick?.quote.toStringAsFixed(2) ?? '';

        tooltipContent.add(JsIndicatorTooltip(
            name: 'AwesomeOscillator', values: <String>[quote]));
      }
    }
    return tooltipContent;
  }
}
