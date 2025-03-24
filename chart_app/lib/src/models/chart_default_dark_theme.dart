import 'package:deriv_chart/src/theme/text_styles.dart';
import 'package:flutter/material.dart';
import 'package:deriv_chart/deriv_chart.dart';
import '../helpers/color.dart';

/// An implementation of [ChartDefaultTheme] which provides access to
/// dark theme-related colors and styles for the chart package.
class ChartDefaultDarkTheme extends ChartDefaultTheme {
  @override
  Color get accentRedColor => Color(0xFFCC2E3D);

  @override
  Color get accentGreenColor => Color(0xFF00A79E);

  @override
  Color get accentYellowColor => Color(0xFFFFAD3A);

  @override
  Color get base01Color => Color(0xFFFFFFFF);

  @override
  Color get base02Color => Color(0xFFEAECED);

  @override
  Color get base03Color => Color(0xFFC2C2C2);

  @override
  Color get base04Color => Color(0xFF6E6E6E);

  @override
  Color get base05Color => Color(0xFF3E3E3E);

  @override
  Color get base06Color => Color(0xFF323738);

  @override
  Color get base07Color => getColorFromString('rgba(255, 255, 255, 0.04)');

  @override
  Color get base08Color => getColorFromString('rgba(24, 28, 37, 1)');

  @override
  TextStyle get overLine => TextStyles.overLine;

  @override
  Color get hoverColor => Color(0xFF242828);
}
