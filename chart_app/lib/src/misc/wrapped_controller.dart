import 'package:deriv_chart/deriv_chart.dart';

/// WrappedController
class WrappedController {
  /// ChartController
  final ChartController chartController = ChartController();

  /// Scales the chart.
  double? scale(double scale) {
    try {
      return chartController.onScale?.call(scale);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Scroll chart visible area.
  void scroll(double pxShift) {
    try {
      chartController.onScroll?.call(pxShift);
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  void scrollToLastTick() {
    try {
      chartController.scrollToLastTick();
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  // ignore: avoid_positional_boolean_parameters
  void toggleDataFitMode(bool dataFitMode) {
    try {
      chartController.toggleDataFitMode?.call(enableDataFit: dataFitMode);
    } on Exception catch (_) {
      return;
    }
  }

  /// Called to get epoch from x position
  int? getEpochFromX(double x) {
    try {
      return chartController.getEpochFromX?.call(x);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get quote from y position
  double? getQuoteFromY(double y) {
    try {
      return chartController.getQuoteFromY?.call(y);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get X position from epoch
  double? getXFromEpoch(int epoch) {
    try {
      return chartController.getXFromEpoch?.call(epoch);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get Y position from quote
  double? getYFromQuote(double quote) {
    try {
      return chartController.getYFromQuote?.call(quote);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get msPerPx
  double? getMsPerPx() {
    try {
      return chartController.getMsPerPx?.call();
    } on Exception catch (_) {
      return null;
    }
  }
}
