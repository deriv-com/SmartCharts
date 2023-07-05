import 'package:chart_app/src/markers/marker_group_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/accumulator_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/digit_marker_icon_painter.dart';
import 'package:chart_app/src/markers/marker_icon_painters/tick_marker_icon_painter.dart';
import 'package:flutter/material.dart';

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

    case 'AccumulatorContractInContractDetails':
      return AccumulatorMarkerIconPainter(
        width,
        height,
        hasPersistentBorders: true,
      );
  }

  return TickMarkerIconPainter();
}
