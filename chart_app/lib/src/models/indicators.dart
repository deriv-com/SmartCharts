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

  String? _getQuote(List<Tick>? entries, int epoch,
      {int pipSize = 2, int offset = 0}) {
    final Tick? tickAtEpoch =
        entries?.firstWhereOrNull((Tick t) => t.epoch == epoch);

    Tick? tick = tickAtEpoch;

    if (offset != 0 && tickAtEpoch != null) {
      final int index = entries!.indexOf(tickAtEpoch);
      tick = entries[index - offset];
    }

    return tick?.quote.toStringAsFixed(pipSize);
  }

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip?>? getTootipContent(int epoch) {
    final List<Series> seriesList =
        _controller.getSeriesList?.call() ?? <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        _controller.getIndicatorConfigsList?.call() ?? <IndicatorConfig>[];

    final List<Series> sortedSeriesList = <Series>[];

    indicatorConfigsList.forEachIndexed((int index, IndicatorConfig config) {
      final int configIndex = indicatorsRepo.items.indexOf(config);
      if (configIndex > -1) {
        sortedSeriesList.insert(configIndex, seriesList[index]);
      }
    });

    final List<JsIndicatorTooltip?> tooltipContent = <JsIndicatorTooltip>[];

    for (final ChartData item in sortedSeriesList) {
      if (item is AwesomeOscillatorSeries) {
        final String? quote = _getQuote(item.entries, epoch);
        tooltipContent.add(JsIndicatorTooltip(
            name: 'AwesomeOscillator', values: <String?>[quote]));
      } else if (item is DPOSeries) {
        final String? quote = _getQuote(item.dpoSeries.entries, epoch,
            offset: item.dpoSeries.offset);
        tooltipContent
            .add(JsIndicatorTooltip(name: 'dpo', values: <String?>[quote]));
      } else {
        tooltipContent.add(null);
      }
    }
    return tooltipContent;
  }
}
