import 'package:flutter/material.dart';
import 'markers/marker_group_icon_painter.dart';
import 'markers/marker_icon_painters/accumulator_marker_icon_painter.dart';
import 'markers/marker_icon_painters/digit_marker_icon_painter.dart';
import 'markers/marker_icon_painters/tick_marker_icon_painter.dart';

/// Gets [Color] instance from hex code
Color getColorFromHex(String hexColor) =>
    Color(int.parse(hexColor.replaceAll('#', '0xff')));

/// Gets painter for a contract based on the contract type
MarkerGroupIconPainter getMarkerGroupPainter(
  BuildContext context,
  String? type,
) {
  final MediaQueryData media = MediaQuery.of(context);
  final double width = media.size.width;
  final double height = media.size.height;

  switch (type) {
    case 'DigitContract':
      return DigitMarkerIconPainter();

    case 'AccumulatorContract':
      return AccumulatorMarkerIconPainter(width, height);
  }

  return TickMarkerIconPainter();
}
