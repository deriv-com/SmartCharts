import 'package:chart_app/src/chart_app.dart';
import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/accumulator_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/digit_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/tick_marker_icon_painter.dart';

/// Gets painter for a contract based on the contract type
MarkerGroupIconPainter getMarkerGroupPainter(ChartApp app) {
  switch (app.configModel.contractType) {
    case 'DigitContract':
      return DigitMarkerIconPainter(pipSize: app.configModel.pipSize);

    case 'AccumulatorContract':
      return AccumulatorMarkerIconPainter();

    default:
      return TickMarkerIconPainter();
  }
}
