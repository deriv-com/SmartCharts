import 'package:flutter/material.dart';
import 'package:collection/collection.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// Storage key of saved indicators.
const String addOnsKey = 'addOns';

/// Called when an addOn is to be edited
///
/// [id] is the id of the addOn to be edited
typedef OnEditCallback = void Function(int index);

/// Swaps two elements of a list.
typedef OnSwapCallback = void Function(int index1, int index2);

/// Holds indicators/drawing tools that were added to the Chart during runtime.
class AddOnsRepository<T extends AddOnConfig> extends ChangeNotifier
    implements Repository<T> {
  /// Initializes
  AddOnsRepository({
    this.onEditCallback,
    this.onRemoveCallback,
    this.onSwapCallback,
  }) : _addOns = <T>[];

  final List<T> _addOns;

  /// List of indicators or drawing tools.
  @override
  List<T> get items => _addOns;

  /// Callback to open edit dialog.
  OnEditCallback? onEditCallback;

  /// Callback to remove an indicator.
  OnEditCallback? onRemoveCallback;

  /// Callback to swap two elements of a list.
  OnSwapCallback? onSwapCallback;

  /// Adds a new indicator or drawing tool.
  @override
  void add(T addOnConfig) {
    _addOns.add(addOnConfig);
    notifyListeners();
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void edit(T config) {
    final int index = items.indexOf(config);
    onEditCallback?.call(index);
  }

  /// Updates indicator or drawing tool at [index].
  @override
  void updateAt(int index, T addOnConfig) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }
    _addOns[index] = addOnConfig;

    notifyListeners();
  }

  /// Removes indicator/drawing tool at [index] from repository.
  @override
  void remove(T config) {
    final int index = items.indexOf(config);

    if (index < 0 || index >= _addOns.length) {
      return;
    }
    _addOns.removeAt(index);

    onRemoveCallback?.call(index);

    notifyListeners();
  }

  /// Removes indicator/drawing tool at [index] from repository.
  void removeAt(int index) {
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
    onSwapCallback?.call(index1, index2);
    notifyListeners();
  }
}
