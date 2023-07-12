import 'package:deriv_chart/deriv_chart.dart';

/// Calculates the width of yAxis
double calculateYAxisWidth(List<Tick> ticks, ChartTheme theme, int pipSize) {
  if (ticks.isEmpty) {
    return 60;
  } else {
    final double width = labelWidth(
      ticks.first.close,
      theme.gridStyle.yLabelStyle,
      pipSize,
    );

    return width + theme.gridStyle.labelHorizontalPadding * 2;
  }
}
