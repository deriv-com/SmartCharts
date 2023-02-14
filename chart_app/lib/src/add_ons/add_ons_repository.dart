import 'package:flutter/material.dart';
import 'package:deriv_chart/deriv_chart.dart';

/// Storage key of saved indicators.
const String addOnsKey = 'addOns';

/// Called when an addOn is to be edited
///
/// [id] is the id of the addOn to be edited
typedef OnEditCallback = void Function(int index);

/// Holds indicators/drawing tools that were added to the Chart during runtime.
class AddOnsRepository<T extends AddOnConfig> extends ChangeNotifier
    implements Repository<T> {
  /// Initializes
  AddOnsRepository({this.onEditCallback, this.onRemoveCallback})
      : _addOns = <T>[];

  final List<T> _addOns;

  /// List of indicators or drawing tools.
  @override
  List<T> get items => _addOns;

  /// Callback to open edit dialog.
  OnEditCallback? onEditCallback;

  /// Callback to remove an indicator.
  OnEditCallback? onRemoveCallback;

  /// Adds a new indicator or drawing tool and updates storage.
  @override
  void add(T addOnConfig) {
    _addOns.add(addOnConfig);
    notifyListeners();
  }

  /// Updates indicator or drawing tool at [index] and updates storage.
  @override
  void editAt(
    int index,
  ) {
    onEditCallback?.call(index);
  }

  /// Updates indicator or drawing tool at [index] and updates storage.
  @override
  void updateAt(int index, T addOnConfig) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }
    _addOns[index] = addOnConfig;

    notifyListeners();
  }

  /// Removes indicator/drawing tool at [index] from repository and updates storage.
  @override
  void removeAt(int index) {
    if (index < 0 || index >= _addOns.length) {
      return;
    }
    _addOns.removeAt(index);

    onRemoveCallback?.call(index);

    notifyListeners();
  }
}
