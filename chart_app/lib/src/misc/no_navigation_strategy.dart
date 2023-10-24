import 'dart:async';
import 'dart:ui' as ui;
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

/// To skip navigations in flutter
/// NoNavigationStrategy
class NoNavigationStrategy extends UrlStrategy {
  Object? _state;

  @override
  ui.VoidCallback addPopStateListener(EventListener fn) => () {};

  @override
  void pushState(Object? state, String title, String url) {
    _state = state;
  }

  @override
  void replaceState(Object? state, String title, String url) {
    _state = state;
  }

  @override
  Future<void> go(int count) {
    final Completer<void> completer = Completer<void>();
    Timer(Duration.zero, () {
      completer.complete();
    });
    return completer.future;
  }

  @override
  String getPath() => '';

  @override
  Object? getState() => _state;

  @override
  String prepareExternalUrl(String internalUrl) => '';
}
