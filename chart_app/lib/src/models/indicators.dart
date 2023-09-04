import 'dart:convert';
import 'dart:math';

import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/add_ons/add_ons_repository.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:collection/collection.dart' show IterableExtension;

/// State and methods of chart web adapter config.
class IndicatorsModel {
  /// Initialize
  IndicatorsModel();

  /// Indicators repo
  final AddOnsRepository<IndicatorConfig> indicatorsRepo =
      AddOnsRepository<IndicatorConfig>(
    onEditCallback: (int i) => JsInterop.indicators?.onEdit?.call(i),
    onRemoveCallback: (int i) => JsInterop.indicators?.onRemove?.call(i),
    onSwapCallback: (int x, int y) => JsInterop.indicators?.onSwap?.call(x, y),
  );

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

  /// Binary search
  int? binarySearch(List<Tick> ticks, int epoch, int min, int max) {
    if (max >= min) {
      final int mid = ((max + min) / 2).floor();
      if (epoch == ticks[mid].epoch) {
        return mid;
      } else if (epoch > ticks[mid].epoch) {
        return binarySearch(ticks, epoch, mid + 1, max);
      } else {
        return binarySearch(ticks, epoch, min, mid - 1);
      }
    }
    return null;
  }

  String? _getQuote(List<Tick>? entries, int epoch, int pipSize,
      {int offset = 0}) {
    final List<Tick> ticks = entries ?? <Tick>[];

    final int? index = binarySearch(ticks, epoch, 0, ticks.length - 1);

    final Tick? tick = index != null ? ticks[index - offset] : null;

    return tick?.quote.toStringAsFixed(pipSize);
  }

  /// Gets the tooltip content for indicator series
  List<JsIndicatorTooltip?>? getTooltipContent(
    List<Series> seriesList,
    List<IndicatorConfig> indicatorConfigsList,
    int epoch,
    int pipSize,
  ) {
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
          values: <String?>[_getQuote(item.entries, epoch, pipSize)],
        ));
      } else if (item is DPOSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: DPOIndicatorConfig.name, values: <String?>[
          _getQuote(
            item.dpoSeries.entries,
            epoch,
            pipSize,
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
                pipSize,
                offset: min(
                    item.gatorConfig.jawOffset, item.gatorConfig.teethOffset),
              ),
              _getQuote(
                item.gatorBottomSeries.entries,
                epoch,
                pipSize,
                offset: min(
                    item.gatorConfig.teethOffset, item.gatorConfig.lipsOffset),
              )
            ]));
      } else if (item is MACDSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: MACDIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.macdSeries.entries, epoch, pipSize),
              _getQuote(item.signalMACDSeries.entries, epoch, pipSize),
              _getQuote(item.macdHistogramSeries.entries, epoch, pipSize)
            ]));
      } else if (item is ROCSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: ROCIndicatorConfig.name, values: <String?>[
          _getQuote(item.entries, epoch, pipSize),
        ]));
      } else if (item is RSISeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: RSIIndicatorConfig.name, values: <String?>[
          _getQuote(item.entries, epoch, pipSize),
        ]));
      } else if (item is StochasticOscillatorSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: StochasticOscillatorIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.fastPercentStochasticIndicatorSeries.entries,
                  epoch, pipSize),
              _getQuote(
                  item.slowStochasticIndicatorSeries.entries, epoch, pipSize),
            ]));
      } else if (item is SMISeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: SMIIndicatorConfig.name, values: <String?>[
          _getQuote(item.smiSeries.entries, epoch, pipSize),
          _getQuote(item.smiSignalSeries.entries, epoch, pipSize),
        ]));
      } else if (item is WilliamsRSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: WilliamsRIndicatorConfig.name,
            values: <String?>[_getQuote(item.entries, epoch, pipSize)]));
      } else if (item is AroonSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: AroonIndicatorConfig.name,
            values: <String?>[
              _getQuote(item.aroonUpSeries.entries, epoch, pipSize),
              _getQuote(item.aroonDownSeries.entries, epoch, pipSize),
            ]));
      } else if (item is ADXSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: ADXIndicatorConfig.name, values: <String?>[
          _getQuote(item.positiveDISeries.entries, epoch, pipSize),
          _getQuote(item.negativeDISeries.entries, epoch, pipSize),
          _getQuote(item.adxSeries.entries, epoch, pipSize),
          if (item.config.showHistogram)
            _getQuote(item.adxHistogramSeries.entries, epoch, pipSize),
        ]));
      } else if (item is CCISeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: CCIIndicatorConfig.name,
            values: <String?>[_getQuote(item.entries, epoch, pipSize)]));
      } else if (item is IchimokuCloudSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: IchimokuCloudIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.conversionLineSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.baseLineSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.spanASeries.entries,
                epoch,
                pipSize,
                offset: item.config.baseLinePeriod,
              ),
              _getQuote(
                item.spanBSeries.entries,
                epoch,
                pipSize,
                offset: item.config.baseLinePeriod,
              ),
              _getQuote(
                item.laggingSpanSeries.entries,
                epoch,
                pipSize,
                offset: item.config.laggingSpanOffset,
              ),
            ]));
      } else if (item is ParabolicSARSeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: ParabolicSARConfig.name, values: <String?>[
          _getQuote(
            item.entries,
            epoch,
            pipSize,
          )
        ]));
      } else if (item is BollingerBandSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: BollingerBandsIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.upperSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.middleSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.lowerSeries.entries,
                epoch,
                pipSize,
              )
            ]));
      } else if (item is DonchianChannelsSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: DonchianChannelIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.upperChannelSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.middleChannelSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.lowerChannelSeries.entries,
                epoch,
                pipSize,
              )
            ]));
      } else if (item is MASeries) {
        tooltipContent.add(
            JsIndicatorTooltip(name: MAIndicatorConfig.name, values: <String?>[
          _getQuote(
            item.entries,
            epoch,
            pipSize,
          )
        ]));
      } else if (item is MAEnvSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: MAEnvIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.upperSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.middleSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.lowerSeries.entries,
                epoch,
                pipSize,
              )
            ]));
      } else if (item is RainbowSeries) {
        final List<String?> values = item.rainbowSeries
            .map((DataSeries<Tick> series) => _getQuote(
                  series.entries,
                  epoch,
                  pipSize,
                ))
            .toList();

        tooltipContent.add(JsIndicatorTooltip(
          name: RainbowIndicatorConfig.name,
          values: values,
        ));
      } else if (item is AlligatorSeries) {
        //TODO : enable offset after fixing in the flutter charts
        tooltipContent.add(JsIndicatorTooltip(
            name: AlligatorIndicatorConfig.name,
            values: <String?>[
              if (item.jawSeries != null)
                _getQuote(
                  item.jawSeries!.entries,
                  epoch,
                  pipSize,
                  // offset: item.alligatorOptions.jawOffset,
                ),
              if (item.teethSeries != null)
                _getQuote(
                  item.teethSeries!.entries,
                  epoch,
                  pipSize,
                  // offset: item.alligatorOptions.teethOffset,
                ),
              if (item.lipsSeries != null)
                _getQuote(
                  item.lipsSeries!.entries,
                  epoch,
                  pipSize,
                  // offset: item.alligatorOptions.lipsOffset,
                )
            ]));
      } else if (item is FractalChaosBandSeries) {
        tooltipContent.add(JsIndicatorTooltip(
            name: FractalChaosBandIndicatorConfig.name,
            values: <String?>[
              _getQuote(
                item.fcbHighSeries.entries,
                epoch,
                pipSize,
              ),
              _getQuote(
                item.fcbLowSeries.entries,
                epoch,
                pipSize,
              )
            ]));
      } else {
        tooltipContent.add(null);
      }
    }
    return tooltipContent;
  }
}
