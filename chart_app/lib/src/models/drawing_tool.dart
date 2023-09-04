import 'dart:convert';

import 'package:chart_app/src/add_ons/add_ons_repository.dart';
import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/interop/js_interop.dart';

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

  /// To add a drawing
  // void addDrawing(String dataString, int? index) {
  void addOrUpdateDrawing(String dataString, int? index) {
    final Map<String, dynamic> config = json.decode(dataString)..remove('id');

    DrawingToolConfig? drawingToolConfig = DrawingToolConfig.fromJson(config);

    if (drawingToolConfig != null) {
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
  }

  /// To remove an existing drawing tool
  void removeDrawingTool(int index) {
    drawingToolsRepo.remove(index);
  }

  /// To clear all drawing tool
  void clearDrawingTool() {
    drawingTools.clearDrawingToolSelection();
    drawingToolsRepo.clear();
  }
}
