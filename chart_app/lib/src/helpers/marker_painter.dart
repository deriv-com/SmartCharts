import 'package:chart_app/src/chart_app.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// Gets painter for a contract based on the contract type
MarkerGroupIconPainter getMarkerGroupPainter(ChartApp app) {
  final int fontSize = app.configModel.isMobile ? 10 : 14;
  switch (app.configModel.contractType) {
    case 'DigitContract':
      return DigitMarkerIconPainter(pipSize: app.configModel.pipSize);

    case 'AccumulatorContract':
      return AccumulatorMarkerIconPainter(fontSize: fontSize.toDouble());

    default:
      return TickMarkerIconPainter();
  }
}
