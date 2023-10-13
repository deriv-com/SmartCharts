import 'dart:convert';
import 'dart:js_interop';
import 'dart:math';
import 'dart:ui';

import 'package:chart_app/src/misc/wrapped_controller.dart';

import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/add_ons/add_ons_repository.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:collection/collection.dart' show IterableExtension;
import 'package:flutter/material.dart';

/// State and methods of chart web adapter config.
class IndicatorsModel {
  /// Initialize
  IndicatorsModel();

  /// Indicators repo
  final AddOnsRepository<IndicatorConfig> indicatorsRepo =
      AddOnsRepository<IndicatorConfig>(
    createAddOn: (Map<String, dynamic> map) => IndicatorConfig.fromJson(map),
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
                  offset: item.alligatorOptions.jawOffset,
                ),
              if (item.teethSeries != null)
                _getQuote(
                  item.teethSeries!.entries,
                  epoch,
                  pipSize,
                  offset: item.alligatorOptions.teethOffset,
                ),
              if (item.lipsSeries != null)
                _getQuote(
                  item.lipsSeries!.entries,
                  epoch,
                  pipSize,
                  offset: item.alligatorOptions.lipsOffset,
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

  /// Gets indicator hover index
  int? getIndicatorHoverIndex(
    List<Series> seriesList,
    List<IndicatorConfig> indicatorConfigsList,
    WrappedController controller,
    Function? getClosestEpoch,
    int granularity,
    double x,
    double y,
    int bottomIndicatorIndex,
  ) {
    int configIndex = 0;
    Series? bottomItemIndicator;
    final List<Series> sortedSeriesList = <Series>[...seriesList];

    indicatorConfigsList.forEachIndexed((int index, IndicatorConfig config) {
      configIndex = indicatorsRepo.items.indexOf(config);

      if (configIndex > -1) {
        sortedSeriesList[configIndex] = seriesList[index];
      }
    });

    if (bottomIndicatorIndex > -1) {
      bottomItemIndicator = sortedSeriesList[bottomIndicatorIndex];
    } else {
      bottomItemIndicator = null;
    }

    final Offset target = Offset(x, y);
    final int? epoch =
        getClosestEpoch?.call(controller.getEpochFromX(x), granularity);

    if (bottomItemIndicator != null && bottomIndicatorIndex != null) {
      if (bottomItemIndicator is AwesomeOscillatorSeries) {
        final List<Tick> aoEntries = bottomItemIndicator.entries ?? <Tick>[];
       
        if (isPointOnIndicator(
          aoEntries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is GatorSeries) {
        final List<Tick> gatorBottomEntries =
            bottomItemIndicator.gatorBottomSeries.entries ?? <Tick>[];

        final List<Tick> gatorTopEntries =
            bottomItemIndicator.gatorTopSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
              gatorBottomEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.gatorBottomSeries.offset,
            ) |
            isPointOnIndicator(
              gatorTopEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.gatorTopSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is CCISeries) {
        final List<Tick> cciEntries = bottomItemIndicator.entries ?? <Tick>[];
        if (isPointOnIndicator(
          cciEntries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is MACDSeries) {
        final List<Tick> macdEntries =
            bottomItemIndicator.macdSeries.entries ?? <Tick>[];

        final List<Tick> signalMACDSeries =
            bottomItemIndicator.signalMACDSeries.entries ?? <Tick>[];

        final List<Tick> macdHistogramSeries =
            bottomItemIndicator.macdHistogramSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
              macdEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.macdSeries.offset,
            ) |
            isPointOnIndicator(
              signalMACDSeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.signalMACDSeries.offset,
            ) |
            isPointOnIndicator(
              macdHistogramSeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.macdHistogramSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is StochasticOscillatorSeries) {
        final List<Tick> fastEntries =
            bottomItemIndicator.fastPercentStochasticIndicatorSeries.entries ??
                <Tick>[];

        final List<Tick> slowEntries =
            bottomItemIndicator.slowStochasticIndicatorSeries.entries ??
                <Tick>[];

        if (isPointOnIndicator(
              fastEntries,
              controller,
              target,
              epoch,
                offset: bottomItemIndicator
                    .fastPercentStochasticIndicatorSeries.offset
            ) |
            isPointOnIndicator(
              slowEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.slowStochasticIndicatorSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is WilliamsRSeries) {
        final List<Tick> williamEntries =
            bottomItemIndicator.entries ?? <Tick>[];
        if (isPointOnIndicator(
          williamEntries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is SMISeries) {
        final List<Tick> smiSignalEntries =
            bottomItemIndicator.smiSignalSeries.entries ?? <Tick>[];

        final List<Tick> smiSeries =
            bottomItemIndicator.smiSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
              smiSignalEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.smiSignalSeries.offset,
            ) |
            isPointOnIndicator(
              smiSeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.smiSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is RSISeries) {
        final List<Tick> rsiSeries = bottomItemIndicator.entries ?? <Tick>[];
        if (isPointOnIndicator(
          rsiSeries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is ROCSeries) {
        final List<Tick> rocSeries = bottomItemIndicator.entries ?? <Tick>[];
        if (isPointOnIndicator(
          rocSeries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is DPOSeries) {
        final List<Tick> dpoEntries =
            bottomItemIndicator.dpoSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
          dpoEntries,
          controller,
          target,
          epoch,
          offset: bottomItemIndicator.dpoSeries.offset,
        )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is ADXSeries) {
        final List<Tick> positiveSeries =
            bottomItemIndicator.positiveDISeries.entries ?? <Tick>[];
        final List<Tick> negativeDISeries =
            bottomItemIndicator.negativeDISeries.entries ?? <Tick>[];

        final List<Tick> adxSeries =
            bottomItemIndicator.adxSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
              positiveSeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.positiveDISeries.offset,
            ) |
            isPointOnIndicator(
              negativeDISeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.negativeDISeries.offset,
            ) |
            isPointOnIndicator(
              adxSeries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.adxSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      } else if (bottomItemIndicator is AroonSeries) {
        final List<Tick> aroonUpEntries =
            bottomItemIndicator.aroonUpSeries.entries ?? <Tick>[];

        final List<Tick> aroonDownEntries =
            bottomItemIndicator.aroonDownSeries.entries ?? <Tick>[];

        if (isPointOnIndicator(
              aroonUpEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.aroonUpSeries.offset,
            ) |
            isPointOnIndicator(
              aroonDownEntries,
              controller,
              target,
              epoch,
              offset: bottomItemIndicator.aroonDownSeries.offset,
            )) {
          return bottomIndicatorIndex;
        }
      }
    } else {
      for (int index = sortedSeriesList.length - 1; index >= 0; index--) {
        final ChartData item = sortedSeriesList[index];
        if (item is BollingerBandSeries) {
          final List<Tick> middleEntries =
              item.middleSeries.entries ?? <Tick>[];
          final List<Tick> upperEntries = item.upperSeries.entries ?? <Tick>[];
          final List<Tick> lowerEntries = item.lowerSeries.entries ?? <Tick>[];
             
          // // get the tick and next tick from epoch
          if (isPointOnIndicator(middleEntries, controller, target, epoch,
                  offset: item.middleSeries.offset) |
              isPointOnIndicator(lowerEntries, controller, target, epoch,
                  offset: item.lowerSeries.offset) |
              isPointOnIndicator(upperEntries, controller, target, epoch,
                  offset: item.upperSeries.offset)) {
            return index;
          }
        } else if (item is DonchianChannelsSeries) {
          final List<Tick> middleChannelEntries =
              item.middleChannelSeries.entries ?? <Tick>[];
          final List<Tick> lowerChannelEntries =
              item.lowerChannelSeries.entries ?? <Tick>[];
          final List<Tick> upperChannelEntries =
              item.upperChannelSeries.entries ?? <Tick>[];
          if (isPointOnIndicator(
                middleChannelEntries,
                controller,
                target,
                epoch,
              ) |
              isPointOnIndicator(
                lowerChannelEntries,
                controller,
                target,
                epoch,
              ) |
              isPointOnIndicator(
                upperChannelEntries,
                controller,
                target,
                epoch,
              )) {
            return index;
          }
        } else if (item is MASeries) {
          final List<Tick> maEntries = item.entries ?? <Tick>[];

          if (isPointOnIndicator(maEntries, controller, target, epoch,
              offset: item.offset)) {
            return index;
          }
        } else if (item is IchimokuCloudSeries) {
          final List<Tick> ichimokuBaseEntries =
              item.baseLineSeries.entries ?? <Tick>[];

          final List<Tick> ichimoksuConversionEntries =
              item.conversionLineSeries.entries ?? <Tick>[];

          final List<Tick> ichimoksuSpanAEntries =
              item.spanASeries.entries ?? <Tick>[];

          final List<Tick> ichimoksuSpanBEntries =
              item.spanBSeries.entries ?? <Tick>[];

          final List<Tick> ichimoksuLaggingSpanEntries =
              item.laggingSpanSeries.entries ?? <Tick>[];

          if (isPointOnIndicator(
                ichimoksuConversionEntries,
                controller,
                target,
                epoch,
                  offset: item.conversionLineSeries.offset
              ) |
              isPointOnIndicator(
                ichimokuBaseEntries,
                controller,
                target,
                epoch,
                  offset: item.baseLineSeries.offset
              ) |
              isPointOnIndicator(
                  ichimoksuLaggingSpanEntries, controller, target, epoch,
                offset: item.config.laggingSpanOffset,
              ) |
              isPointOnIndicator(
                  ichimoksuSpanBEntries, controller, target, epoch,
                offset: item.config.baseLinePeriod,
              ) |
              isPointOnIndicator(
                ichimoksuSpanAEntries,
                controller,
                target,
                epoch,
                offset: item.config.baseLinePeriod,
              )) {
            return index;
          }
        } else if (item is MAEnvSeries) {
          final List<Tick> lowerEntries = item.lowerSeries.entries ?? <Tick>[];
          final List<Tick> middleEntries =
              item.middleSeries.entries ?? <Tick>[];
          final List<Tick> upperEntries = item.upperSeries.entries ?? <Tick>[];

          if (isPointOnIndicator(
                lowerEntries,
                controller,
                target,
                epoch,
                offset: item.lowerSeries.offset,
              ) |
              isPointOnIndicator(
                middleEntries,
                controller,
                target,
                epoch,
                offset: item.middleSeries.offset,
              ) |
              isPointOnIndicator(
                upperEntries,
                controller,
                target,
                epoch,
                offset: item.upperSeries.offset,
              )) {
            return index;
          }
        } else if (item is ParabolicSARSeries) {
          final List<Tick> parabolicSeries = item.entries ?? <Tick>[];
          if (isPointOnIndicator(
            parabolicSeries,
            controller,
            target,
            epoch,
              offset: item.offset
          )) {
            return index;
          }
        } else if (item is ZigZagSeries) {
          final List<Tick> zigZagSeries = item.entries ?? <Tick>[];
          
          if (isPointOnZigZagIndicator(
            zigZagSeries,
            controller,
            target,
            epoch,
          )) {
            return index;
          }
        } else if (item is FractalChaosBandSeries) {
          final List<Tick> fcbHighEntries =
              item.fcbHighSeries.entries ?? <Tick>[];
          final List<Tick> fcbLowEntries =
              item.fcbLowSeries.entries ?? <Tick>[];

          if (isPointOnIndicator(
                fcbHighEntries,
                controller,
                target,
                epoch,
                offset: item.fcbHighSeries.offset,
              ) |
              isPointOnIndicator(
                fcbLowEntries,
                controller,
                target,
                epoch,
                offset: item.fcbLowSeries.offset,
              )) {
            return index;
          }
        } else if (item is RainbowSeries) {
          bool isClick = false;
          for (int i = 0; i < item.rainbowSeries.length; i++) {
            isClick = isPointOnIndicator(
              item.rainbowSeries[i].entries ?? <Tick>[],
              controller,
              target,
              epoch,
                offset: item.rainbowSeries[i].offset
            );

            if (isClick) {
              return index;
            }
          }
        } else if (item is AlligatorSeries) {
          final List<Tick> teethEntries = item.teethSeries!.entries ?? <Tick>[];

          final List<Tick> jawEntries = item.jawSeries!.entries ?? <Tick>[];

          final List<Tick> lipEntries = item.lipsSeries!.entries ?? <Tick>[];

          if (isPointOnIndicator(
                teethEntries,
                controller,
                target,
                epoch,
                offset: item.alligatorOptions.teethOffset,
              ) |
              isPointOnIndicator(
                jawEntries,
                controller,
                target,
                epoch,
                offset: item.alligatorOptions.jawOffset,
              ) |
              isPointOnIndicator(
                lipEntries,
                controller,
                target,
                epoch,
                offset: item.alligatorOptions.lipsOffset,
              )) {
            return index;
          }
        }
      }
    }
    return null;
  }

  /// Function to check if the hover is on indicator
  bool isPointOnIndicator(
    List<Tick> entries,
    WrappedController controller,
    Offset target,
    int? epoch, {
    int offset = 0,
  }) {
    final int? index = binarySearch(entries, epoch!, 0, entries.length - 1);

    if (index != null) {
      final int quoteIndex = index - offset;

      if (quoteIndex <= entries.length - 1) {
        final Tick prevIndex = entries[quoteIndex - 1];
        final Tick currIndex = entries[quoteIndex];

        final double prevQuote =
            controller.getCrosshairController().getYFromQuote(prevIndex.quote)!;

        final double currentQuote =
            controller.getCrosshairController().getYFromQuote(currIndex.quote)!;

        final Rect rect = Rect.fromPoints(
          Offset(
            controller.getXFromEpoch(entries[index - 1].epoch)!,
            prevQuote,
          ),
          Offset(
            controller.getXFromEpoch(entries[index].epoch)!,
            currentQuote,
          ),
        );

        if (rect.inflate(10).contains(target)) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }

  /// IF NUMBER IS ODD
  bool isOdd(int number) => number % 2 != 0;

  /// Function to check if the hover is on zigzag indicator
  bool isPointOnZigZagIndicator(List<Tick> entries,
      WrappedController controller, Offset target, int? epoch,
      {int offset = 0}) {
    final Tick? endPoint = entries[entries.length - 1];

    // endEntries.firstWhereOrNull((element) => !element.quote.isNaN);
    final int midEntry = entries.length ~/ 2;

    final List<Tick> startEntries = entries.sublist(1, midEntry);

    final Tick? startPoint =
        startEntries.firstWhereOrNull((Tick element) => !element.quote.isNaN);

    final Offset lineStart = Offset(
        controller.getXFromEpoch(startPoint!.epoch)!,
        controller.getYFromQuote(startPoint.quote)!);

    final Offset lineEnd = Offset(controller.getXFromEpoch(endPoint!.epoch)!,
        controller.getYFromQuote(endPoint.quote)!);

    // Calculate the distance from the point to the line using the cross product
    final double distance =
        ((target.dy - lineStart.dy) * (lineEnd.dx - lineStart.dx) -
                (target.dx - lineStart.dx) * (lineEnd.dy - lineStart.dy)) /
            lineStart.distanceSquared;

    // The point is on the line if the distance is close to 0
    return distance.abs() < 0.005;
  }
}
