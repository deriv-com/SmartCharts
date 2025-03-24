import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:chart_app/src/interop/js_interop.dart';
import 'package:deriv_chart/deriv_chart.dart' hide AddOnsRepository;
import 'package:chart_app/src/add_ons/add_ons_repository.dart';

/// State and methods of chart web adapter config.
class DrawingToolModel {
  /// Initialize
  DrawingToolModel() {
    drawingToolsRepo = AddOnsRepository<DrawingToolConfig>(
      createAddOn: (Map<String, dynamic> map) =>
          DrawingToolConfig.fromJson(map),
      onAddCallback: (AddOnConfig config) {
        final DrawingToolConfig drawingToolConfig = config as DrawingToolConfig;
        if (drawingToolConfig.drawingData != null &&
            drawingToolConfig.drawingData!.isDrawingFinished) {
          JsInterop.drawingTool?.onAdd?.call();
        }
      },
      onLoadCallback: (List<dynamic> items) {
        JsInterop.drawingTool?.onLoad?.call(items);
      },
      onUpdateCallback: (int index, AddOnConfig config) {
        JsInterop.drawingTool?.onUpdate?.call(index, config);
      },
      getKey: () => 'drawings_$symbol',
    );

    drawingTools = DrawingTools(
      onMouseEnterCallback: (int index) =>
          JsInterop.drawingTool?.onMouseEnter?.call(index),
      onMouseExitCallback: (int index) =>
          JsInterop.drawingTool?.onMouseExit?.call(index),
    )..drawingToolsRepo = drawingToolsRepo;
  }

  /// Symbol of the chart
  String symbol = '';

  /// Drawing tools repo
  late AddOnsRepository<DrawingToolConfig> drawingToolsRepo;

  /// DrawingTools
  late DrawingTools drawingTools;

  /// Initialize new chart
  void newChart(JSNewChart payload) {
    symbol = payload.symbol ?? '';
    _loadSavedDrawingTools();
  }

  Future<void> _loadSavedDrawingTools() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    drawingToolsRepo.loadFromPrefs(prefs);
  }

  /// To select a drawing
  void selectDrawing(DrawingToolConfig config) {
    drawingTools.onDrawingToolSelection(config);
  }

  /// function to get drawtool items
  // List<DrawingToolConfig>? getDrawingToolsRepoItems() => drawingToolsRepo.items;

  ///
  List<String> getDrawingToolsRepoItems() =>
      drawingToolsRepo.items.map((e) => jsonEncode(e)).toList();

  /// To add a drawing
  void addOrUpdateDrawing(String dataString) {
    final Map<String, dynamic> config = json.decode(dataString)..remove('id');
    final DrawingToolConfig drawingToolConfig =
        DrawingToolConfig.fromJson(config);
    drawingTools.onDrawingToolSelection(drawingToolConfig);
  }

  /// To remove an existing drawing tool
  void removeDrawingTool(int index) {
    drawingToolsRepo.removeAt(index);
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
    } else if (config is TrendDrawingToolConfig) {
      return 'trend';
    } else if (config is HorizontalDrawingToolConfig) {
      return 'Horizontal';
    } else if (config is ChannelDrawingToolConfig) {
      return 'channel';
    } else if (config is FibfanDrawingToolConfig) {
      return 'fibfan';
    } else if (config is RectangleDrawingToolConfig) {
      return 'rectangle';
    } else {
      return '';
    }
  }

  /// To edit a drawing
  void editDrawing(String dataString, int index) {
    final Map<String, dynamic> config = json.decode(dataString)..remove('id');

    DrawingToolConfig? drawingToolConfig = DrawingToolConfig.fromJson(config);

    drawingToolConfig = drawingToolConfig.copyWith(
      configId: drawingToolConfig.configId,
      edgePoints: drawingToolConfig.edgePoints,
      drawingData: DrawingData(
        id: drawingToolConfig.configId!,
        drawingParts: drawingToolConfig.drawingData!.drawingParts,
        isDrawingFinished: true,
      ),
    );

    drawingToolsRepo.updateAt(index, drawingToolConfig);
  }

  /// To clear the selection of drawing tool
  void clearDrawingToolSelect() {
    drawingTools.clearDrawingToolSelection();
  }

  /// To clear all drawing tool
  void clearDrawingTool() {
    drawingTools.clearDrawingToolSelection();
    drawingToolsRepo.clear();
  }
}
