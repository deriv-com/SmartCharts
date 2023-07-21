import 'package:deriv_chart/deriv_chart.dart';

/// WrappedController
/// To prevent controller exceptions
class WrappedController {
  /// ChartController
  final ChartController _chartController = ChartController();

  /// Gets chart controller
  ChartController getChartController() => _chartController;

  /// Scales the chart.
  double? scale(double scale) {
    try {
      return _chartController.onScale?.call(scale);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Scroll chart visible area.
  void scroll(double pxShift) {
    try {
      _chartController.onScroll?.call(pxShift);
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  void scrollToLastTick() {
    try {
      _chartController.scrollToLastTick();
    } on Exception catch (_) {
      return;
    }
  }

  /// Scroll chart visible area to the newest data.
  // ignore: avoid_positional_boolean_parameters
  void toggleDataFitMode(bool dataFitMode) {
    try {
      _chartController.toggleDataFitMode?.call(enableDataFit: dataFitMode);
    } on Exception catch (_) {
      return;
    }
  }

  /// Called to get epoch from x position
  int? getEpochFromX(double x) {
    try {
      return _chartController.getEpochFromX?.call(x);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get quote from y position
  double? getQuoteFromY(double y) {
    try {
      return _chartController.getQuoteFromY?.call(y);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get X position from epoch
  double? getXFromEpoch(int epoch) {
    try {
      return _chartController.getXFromEpoch?.call(epoch);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get Y position from quote
  double? getYFromQuote(double quote) {
    try {
      return _chartController.getYFromQuote?.call(quote);
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get msPerPx
  double? getMsPerPx() {
    try {
      return _chartController.getMsPerPx?.call();
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get List of Series
  List<Series>? getSeriesList() {
    try {
      return _chartController.getSeriesList?.call();
    } on Exception catch (_) {
      return null;
    }
  }

  /// Called to get List of Configs
  List<AddOnConfig>? getConfigsList() {
    try {
      return _chartController.getConfigsList?.call();
    } on Exception catch (_) {
      return null;
    }
  }
}
