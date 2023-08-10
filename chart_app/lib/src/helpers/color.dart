import 'package:flutter/material.dart';

/// Converts a hex, rgb, or rgba color string to Color object.
// Works with opacity values as well.
// e.g.:
//       "#000"                    -> Color(0xff000000)
//       "#cc3333"                 -> Color(0xffcc3333)
//       "#cc3333dd"               -> Color(0xddcc3333)
//       "rgb(204, 44, 81)"        -> Color(0xffcc2c51)
//       "rgba(204, 44, 81, 0.20)" -> Color(0x33cc2c51)
//       "rgba(204, 44, 81, 0.80)" -> Color(0xcccc2c51)
Color getColorFromString(String color) {
  String colorStr = color;
  final RegExp hexColorRegex =
      RegExp(r'^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$');
  if (colorStr.startsWith('rgba')) {
    final List<String> rgbaList =
        colorStr.substring(5, colorStr.length - 1).split(',');
    return Color.fromRGBO(int.parse(rgbaList[0]), int.parse(rgbaList[1]),
        int.parse(rgbaList[2]), double.parse(rgbaList[3]));
  } else if (colorStr.startsWith('rgb')) {
    final List<int> rgbList = colorStr
        .substring(4, colorStr.length - 1)
        .split(',')
        .map((String c) => int.parse(c))
        .toList();
    return Color.fromRGBO(rgbList[0], rgbList[1], rgbList[2], 1);
  } else if (hexColorRegex.hasMatch(colorStr)) {
    if (colorStr.length == 4) {
      colorStr = colorStr + colorStr.substring(1, 4);
    }
    if (colorStr.length == 7) {
      final int colorValue = int.parse(colorStr.substring(1), radix: 16);
      return Color(colorValue).withOpacity(1);
    } else {
      final int colorValue = int.parse(colorStr.substring(1, 7), radix: 16);
      final double opacityValue =
          int.parse(colorStr.substring(7), radix: 16).toDouble() / 255;
      return Color(colorValue).withOpacity(opacityValue);
    }
  } else if (colorStr.isEmpty) {
    throw UnsupportedError('Empty color field found.');
  } else if (colorStr == 'none') {
    return Colors.transparent;
  } else {
    throw UnsupportedError(
        'Only hex, rgb, or rgba color format currently supported.');
  }
}
