import 'dart:ui';

import 'package:chart_app/src/markers/marker_group.dart';
import 'package:chart_app/src/markers/painter_props.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// Foundation class for painting marker group on canvas
abstract class MarkerGroupIconPainter extends MarkerIconPainter {
  /// Paints single marker
  @override
  void paintMarker(
    Canvas canvas,
    Offset center,
    Offset anchor,
    MarkerDirection direction,
    MarkerStyle style,
  ) {}

  /// Paints marker group
  void paintMarkerGroup(
    Canvas canvas,
    Size size,
    ChartTheme theme,
    MarkerGroup markerGroup,
    EpochToX epochToX,
    QuoteToY quoteToY,
    PainterProps painterProps,
  );
}
