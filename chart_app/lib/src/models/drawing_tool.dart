import 'dart:convert';

import 'package:chart_app/src/add_ons/add_ons_repository.dart';
import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:flutter/material.dart';
import 'dart:math';

/// State and methods of chart web adapter config.
class DrawingToolModel {
  // drawingTools.drawingToolsRepo=drawingToolsRepo;
  /// Initialize
  DrawingToolModel();

  /// Drawing tools repo
  final AddOnsRepository<DrawingToolConfig> drawingToolsRepo =
      AddOnsRepository<DrawingToolConfig>(
    onEditCallback: (int i) => JsInterop.drawingTool?.onEdit?.call(i),
    onRemoveCallback: (int i) => JsInterop.drawingTool?.onRemove?.call(i),
    onSwapCallback: (int x, int y) => JsInterop.drawingTool?.onSwap?.call(x, y),
  );

  ///
  final DrawingTools drawingTools = DrawingTools();

  ///
  void selectDrawing(DrawingToolConfig config) {
    drawingTools.onDrawingToolSelection(config);
  }

  ///
  AddOnsRepository<DrawingToolConfig> getDrawingTool() => drawingToolsRepo;

  ///
  DrawingTools getDrawingTools() => drawingTools;

  /// To add a drawing
  // void addDrawing(String dataString, int? index) {
  void addOrUpdateDrawing(String dataString, int? index) {
    final Map<String, dynamic> config = json.decode(dataString)..remove('id');

    DrawingToolConfig? drawingToolConfig = DrawingToolConfig.fromJson(config);

    if (index != null && index > -1) {
      drawingToolConfig = drawingToolConfig.copyWith(
          configId: drawingToolsRepo.items[index].toJson()['configId'],
          edgePoints: drawingToolsRepo.items[index].toJson()['edgePoints'],
          drawingData: drawingToolsRepo.items[index].toJson()['drawingData']);

      drawingTools.drawingToolsRepo!.updateAt(index, drawingToolConfig);
    } else {
      drawingTools.onDrawingToolSelection(drawingToolConfig);
    }
  }

  /// To remove an existing drawing tool
  void removeDrawingTool(int index) {
    drawingToolsRepo.remove(index);
  }

  /// To get the tool name from config
  String getTypeOfSelectedDrawingTool(DrawingToolConfig config) {
    if (config is VerticalDrawingToolConfig) {
      return 'vertical';
    } else if (config is LineDrawingToolConfig) {
      return 'line';
    } else if (config is RayDrawingToolConfig) {
      return 'ray';
    } else if (config is ContinuousDrawingToolConfig) {
      return 'continuous';
    } else {
      return 'nil';
    }
  }

  /// To clear all drawing tool
  void clearDrawingTool() {
    drawingTools.clearDrawingToolSelection();
    drawingToolsRepo.clear();
  }

  ///
  int? getDrawingHover(int dx, int dy, int epoch, String quote) {
    for (int i = 0; i < drawingToolsRepo.items.length; i++) {
      final DrawingToolConfig config = drawingTools.drawingToolsRepo!.items[i];
      if (config is VerticalDrawingToolConfig) {
        if ((epoch - config.edgePoints[0].epoch).abs() < 3600) {
          return i;
        }
      } else if (config is LineDrawingToolConfig &&
          config.edgePoints.length > 1) {
        if (isHoverOnLine(
            Offset(config.edgePoints[0].epoch as double,
                config.edgePoints[0].quote),
            Offset(config.edgePoints[1].epoch as double,
                config.edgePoints[1].quote),
            Offset(epoch as double, double.parse(quote)),
            0.1)) {
          return i;
        }
      } else if (config is RayDrawingToolConfig &&
          config.edgePoints.length > 1) {
        if (isHoverOnLine(
            Offset(config.edgePoints[0].epoch as double,
                config.edgePoints[0].quote),
            Offset(config.edgePoints[1].epoch as double,
                config.edgePoints[1].quote),
            Offset(epoch as double, double.parse(quote)),
            0.1)) {
          return i;
        }
      } else if (config is ContinuousDrawingToolConfig &&
          config.edgePoints.length > 1) {}
    }

    return null;
  }
}

/// if hover is on line of drawing; Vertical
// bool isHoverOnLine(Offset linePosition, Offset hoverPosition,
//     {double tolerance = 4000}) {
//   return (hoverPosition.dx - linePosition.dx).abs() < tolerance;
// }

// Line Drawing
bool isHoverOnLine(Offset p1, Offset p2, Offset hover, double tolerance) {
  double distance = (p2.dy - p1.dy) * hover.dx -
      (p2.dx - p1.dx) * hover.dy +
      p2.dx * p1.dy -
      p2.dy * p1.dx;

  distance =
      distance.abs() / sqrt(pow(p2.dx - p1.dx, 2) + pow(p2.dy - p1.dy, 2));

  return distance < tolerance;
}
