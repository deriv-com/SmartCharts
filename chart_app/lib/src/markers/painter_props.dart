/// PainterProps
class PainterProps {
  /// Initialize
  PainterProps(this.zoom, this.yAxisWidth, {required this.isMobile});

  /// Specifies zoom of the chart w.r.t to msPerPx.
  final double zoom;

  /// Width of y-axis
  final double yAxisWidth;

  /// Whether it is in mobile mode or not.
  final bool isMobile;
}
