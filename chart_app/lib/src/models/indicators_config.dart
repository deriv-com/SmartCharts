import 'dart:convert';

import 'package:chart_app/src/interop/js_interop.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:flutter/material.dart';

/// State and methods of chart web adapter config.
class IndicatorsConfig extends ChangeNotifier {
  /// Indicators repo
  final AddOnsRepository<IndicatorConfig> indicatorsRepo =
      AddOnsRepository<IndicatorConfig>(
    IndicatorConfig,
    onRemoveAddOn: JsInterop.indicators?.onRemove,
    onEditAddOn: JsInterop.indicators?.onEdit,
  );

  /// To add or update an indicator
  void addOrUpdateIndicator(String dataString) {
    final Map<String, dynamic> config = json.decode(dataString);

    final int index = indicatorsRepo.addOns
        .indexWhere((IndicatorConfig addOn) => addOn.id == config['id']);

    final IndicatorConfig? indicatorConfig =
        IndicatorConfig.fromJson(config, 'name');

    if (indicatorConfig != null) {
      index > -1
          ? indicatorsRepo.updateAt(index, indicatorConfig)
          : indicatorsRepo.add(indicatorConfig);
    }
  }

  /// To remove an existing indicator
  void removeIndicator(String id) {
    final int index = indicatorsRepo.addOns
        .indexWhere((IndicatorConfig addOn) => addOn.id == id);
    indicatorsRepo.removeAt(index);
  }
}
