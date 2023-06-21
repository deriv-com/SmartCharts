import 'dart:convert';
import 'dart:math';

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
  List<JsIndicatorTooltip?>? getTooltipContent(int epoch) {
    final List<Series> seriesList =
        _controller.getSeriesList?.call() ?? <Series>[];
    final List<IndicatorConfig> indicatorConfigsList =
        _controller.getIndicatorConfigsList?.call() ?? <IndicatorConfig>[];

    final List<Series> sortedSeriesList = <Series>[...seriesList];

    indicatorConfigsList.forEachIndexed((int index, IndicatorConfig config) {
      final int configIndex = indicatorsRepo.items.indexOf(config);
      if (configIndex > -1) {
        sortedSeriesList[configIndex] = seriesList[index];
      }
    });

    final List<JsIndicatorTooltip?> tooltipContent = <JsIndicatorTooltip>[];

    for (final ChartData item in sortedSeriesList) {
      if (item is AwesomeOscillatorSeries) {
        tooltipContent.add(JsIndicatorTooltip(
          name: AwesomeOscillatorIndicatorConfig.name,
          values: <String?>[_getQuote(item.entries, epoch)],
        ));
      } else if (item is DPOSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: DPOIndicatorConfig.name, values: <String?>[
          _getQuote(
            item.dpoSeries.entries,
            epoch,
            offset: item.dpoSeries.offset,
          )
        ]));
      } else if (item is GatorSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: GatorIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.gatorTopSeries.entries,
                epoch,
                offset: min(
                    item.gatorConfig.jawOffset, item.gatorConfig.teethOffset),
              ),
              _getQuote(
                item.gatorBottomSeries.entries,
                epoch,
                offset: min(
                    item.gatorConfig.teethOffset, item.gatorConfig.lipsOffset),
              )
            ]));
      } else if (item is MACDSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: MACDIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.macdSeries.entries, epoch),
              _getQuote(item.signalMACDSeries.entries, epoch),
              _getQuote(item.macdHistogramSeries.entries, epoch)
            ]));
      } else if (item is ROCSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: ROCIndicatorConfig.name, values: <String?>[
          _getQuote(item.entries, epoch),
        ]));
      } else if (item is RSISeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: RSIIndicatorConfig.name, values: <String?>[
          _getQuote(item.entries, epoch),
        ]));
      } else if (item is StochasticOscillatorSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: StochasticOscillatorIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                  item.fastPercentStochasticIndicatorSeries.entries, epoch),
              _getQuote(item.slowStochasticIndicatorSeries.entries, epoch),
            ]));
      } else if (item is SMISeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: SMIIndicatorConfig.name, values: <String?>[
          _getQuote(item.smiSeries.entries, epoch),
          _getQuote(item.smiSignalSeries.entries, epoch),
        ]));
      } else if (item is WilliamsRSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: WilliamsRIndicatorConfig.name,
            values: <String?>[_getQuote(item.entries, epoch)]));
      } else if (item is AroonSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: AroonIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.aroonUpSeries.entries, epoch),
              _getQuote(item.aroonDownSeries.entries, epoch),
            ]));
      } else if (item is ADXSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: ADXIndicatorConfig.name, values: <String?>[
          _getQuote(item.positiveDISeries.entries, epoch),
          _getQuote(item.negativeDISeries.entries, epoch),
          _getQuote(item.adxSeries.entries, epoch),
          if (item.config.showHistogram)
            _getQuote(item.adxHistogramSeries.entries, epoch),
        ]));
      } else if (item is CCISeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: CCIIndicatorConfig.name,
            values: <String?>[_getQuote(item.entries, epoch)]));
      } else if (item is IchimokuCloudSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: IchimokuCloudIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.conversionLineSeries.entries, epoch),
              _getQuote(item.baseLineSeries.entries, epoch),
              _getQuote(item.spanASeries.entries, epoch,
                  offset: item.config.baseLinePeriod),
              _getQuote(item.spanBSeries.entries, epoch,
                  offset: item.config.baseLinePeriod),
              _getQuote(item.laggingSpanSeries.entries, epoch,
                  offset: item.config.laggingSpanOffset),
            ]));
      } else if (item is ParabolicSARSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: ParabolicSARConfig.name,
            values: <String?>[_getQuote(item.entries, epoch)]));
      } else if (item is BollingerBandSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: BollingerBandsIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.upperSeries.entries, epoch),
              _getQuote(item.middleSeries.entries, epoch),
              _getQuote(item.lowerSeries.entries, epoch)
            ]));
      } else if (item is DonchianChannelsSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: DonchianChannelIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.upperChannelSeries.entries, epoch),
              _getQuote(item.middleChannelSeries.entries, epoch),
              _getQuote(item.lowerChannelSeries.entries, epoch)
            ]));
      } else if (item is MASeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: MAIndicatorConfig.name,
            values: <String?>[_getQuote(item.entries, epoch)]));
      } else if (item is MAEnvSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: MAEnvIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.upperSeries.entries, epoch),
              _getQuote(item.middleSeries.entries, epoch),
              _getQuote(item.lowerSeries.entries, epoch)
            ]));
      } else if (item is RainbowSeries) {
        final List<String?> values = item.rainbowSeries
            .map((DataSeries<Tick> series) => _getQuote(series.entries, epoch))
            .toList();

        tooltipContent.add(JsIndicatorTooltip(
          name: RainbowIndicatorConfig.name,
          values: values,
        ));
      } else if (item is AlligatorSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: AlligatorIndicatorConfig.name,
            values: <String?>[
              if (item.jawSeries != null)
                _getQuote(
                  item.jawSeries!.entries,
                  epoch,
                  offset: item.jawOffset,
                ),
              if (item.teethSeries != null)
                _getQuote(
                  item.teethSeries!.entries,
                  epoch,
                  offset: item.teethOffset,
                ),
              if (item.lipsSeries != null)
                _getQuote(
                  item.lipsSeries!.entries,
                  epoch,
                  offset: item.lipsOffset,
                )
            ]));
      } else {
        tooltipContent.add(null);
      }
    }
    return tooltipContent;
  }
}
