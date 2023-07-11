import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/accumulator_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/digit_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/tick_marker_icon_painter.dart';

/// Gets painter for a contract based on the contract type
MarkerGroupIconPainter getMarkerGroupPainter(
  String? type,
) {
  switch (type) {
    case 'DigitContract':
      return DigitMarkerIconPainter();

    case 'AccumulatorContract':
      return AccumulatorMarkerIconPainter();

    case 'AccumulatorContractInContractDetails':
      return AccumulatorMarkerIconPainter(
        hasPersistentBorders: true,
      );
  }

  return TickMarkerIconPainter();
}
