import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:deriv_chart/deriv_chart.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Storage key of saved indicators.
const String addOnsKey = 'addOns';

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

///
typedef OnLoadCallback = void Function(List config);

/// Holds indicators/drawing tools that were added to the Chart during runtime.
class AddOnsRepository<T extends AddOnConfig> extends ChangeNotifier
    implements Repository<T> {
  /// Initializes
  AddOnsRepository(
      {required this.createAddOn,
      this.onAddCallback,
      this.onEditCallback,
      this.onRemoveCallback,
      this.onSwapCallback,
      this.onUpdateCallback,
      this.onLoadCallback})
      : _addOns = <T>[];

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

  /// Loads user selected indicators or drawing tools from shared preferences.
  void loadFromPrefs(SharedPreferences prefs) {
    _prefs = prefs;

    if (!prefs.containsKey(addOnsKey)) {
      // No saved indicators or drawing tools.
      return;
    }

    final List<String> encodedAddOns = prefs.getStringList(addOnsKey)!;
    items.clear();

    for (final String encodedAddOn in encodedAddOns) {
      final T addOnConfig = createAddOn.call(jsonDecode(encodedAddOn));
      items.add(addOnConfig);
    }
    onLoadCallback?.call(items);
  }

  /// Adds a new indicator or drawing tool.
  @override
  void add(T addOnConfig) {
    _addOns.add(addOnConfig);
    onAddCallback?.call(addOnConfig);
    _writeToPrefs();
    notifyListeners();
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void editAt(int index) {
    onEditCallback?.call(index);
    _writeToPrefs();
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void updateAt(int index, T addOnConfig) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }

    _addOns[index] = addOnConfig;
    _writeToPrefs();
    onUpdateCallback?.call(index, addOnConfig);

    notifyListeners();
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
        addOnsKey,
        items.map((T config) => jsonEncode(config.toJson())).toList(),
      );
    }
  }
}
