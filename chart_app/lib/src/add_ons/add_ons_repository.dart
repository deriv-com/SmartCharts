import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Called to create an AddOnConfig object from a map.
typedef CreateAddOn<T extends AddOnConfig> = T Function(
    Map<String, dynamic> map);

/// Called when an addOn is created
typedef OnAddCallback = void Function(AddOnConfig config);

/// Called when an addOn is to be edited
///
/// [id] is the id of the addOn to be edited
typedef OnEditCallback = void Function(int index);

/// Swaps two elements of a list.
typedef OnSwapCallback = void Function(int index1, int index2);

/// Allow Updation when dragged (drawing tool)
typedef OnUpdateCallback = void Function(int index1, AddOnConfig config);

/// OnLoadCallback
typedef OnLoadCallback = void Function(List<dynamic> config);

/// Holds indicators/drawing tools that were added to the Chart during runtime.
class AddOnsRepository<T extends AddOnConfig> extends ChangeNotifier
    implements Repository<T> {
  /// Initializes
  AddOnsRepository({
    required this.createAddOn,
    this.onAddCallback,
    this.onEditCallback,
    this.onRemoveCallback,
    this.onSwapCallback,
    this.onUpdateCallback,
    this.onLoadCallback,
    this.getKey,
  }) : _addOns = <T>[];

  final List<T> _addOns;

  /// List of indicators or drawing tools.
  @override
  List<T> get items => _addOns;

  SharedPreferences? _prefs;

  /// Called to create an AddOnConfig object from a map.
  CreateAddOn<T> createAddOn;

  /// Callback to add an addon.
  OnAddCallback? onAddCallback;

  /// Callback to open edit dialog.
  OnEditCallback? onEditCallback;

  /// Callback to remove an addon.
  OnEditCallback? onRemoveCallback;

  ///
  OnUpdateCallback? onUpdateCallback;

  /// Callback to swap two elements of a list.
  OnSwapCallback? onSwapCallback;

  /// Callback when prefs are loaded
  OnLoadCallback? onLoadCallback;

  /// To get the key of the addOns
  String Function()? getKey;

  String get _addOnsKey => getKey?.call() ?? 'addOns_${T.toString()}';

  /// Loads user selected indicators or drawing tools from shared preferences.
  void loadFromPrefs(SharedPreferences prefs) {
    _prefs = prefs;

    items.clear();

    if (!prefs.containsKey(_addOnsKey)) {
      onLoadCallback?.call(<T>[]);
      // No saved indicators or drawing tools.
      return;
    }

    final List<String> encodedAddOns = prefs.getStringList(_addOnsKey)!;

    for (final String encodedAddOn in encodedAddOns) {
      try {
        final T addOnConfig = createAddOn.call(jsonDecode(encodedAddOn));
        items.add(addOnConfig);
      } on Exception catch (e) {
        continue;
      }
    }
    // ignore: always_specify_types
    onLoadCallback?.call(items.map((e) => jsonEncode(e)).toList());
  }

  /// Adds a new indicator or drawing tool.
  @override
  void add(T addOnConfig) {
    _addOns.add(addOnConfig);
    _writeToPrefs();
    notifyListeners();
    onAddCallback?.call(addOnConfig);
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void editAt(int index) {
    _writeToPrefs();
    onEditCallback?.call(index);
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void updateAt(int index, T addOnConfig) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }

    _addOns[index] = addOnConfig;
    _writeToPrefs();
    notifyListeners();
    onUpdateCallback?.call(index, addOnConfig);
  }

  /// Removes indicator/drawing tool at [index] from repository and calls `onRemoveCallback`
  @override
  void removeAt(int index) {
    remove(index);
    _writeToPrefs();
    onRemoveCallback?.call(index);
  }

  /// Removes indicator/drawing tool at [index] from repository.
  void remove(int index) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }
    _addOns.removeAt(index);

    notifyListeners();
  }

  /// Swaps two elements of this list.
  @override
  void swap(int index1, int index2) {
    _addOns.swap(index1, index2);
    _writeToPrefs();
    onSwapCallback?.call(index1, index2);
    notifyListeners();
  }

  /// To clear all indicators
  @override
  void clear() {
    _addOns.clear();
    _writeToPrefs();
    notifyListeners();
  }

  Future<void> _writeToPrefs() async {
    if (_prefs != null) {
      await _prefs!.setStringList(
        _addOnsKey,
        items.map((T config) => jsonEncode(config.toJson())).toList(),
      );
    }
  }

  @override
  bool getHiddenStatus(int index) {
    // TODO(Jim): implement getHiddenStatus
    throw UnimplementedError();
  }

  @override
  void update() {
    // TODO(Jim): implement update
  }

  @override
  void updateHiddenStatus({required int index, required bool hidden}) {
    // TODO(Jim): implement updateHiddenStatus
  }
}
