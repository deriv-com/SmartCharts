import 'dart:async';
import 'dart:ui' as ui;
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

/// To skip navigations in flutter
/// NoNavigationStrategy
class NoNavigationStrategy extends HashUrlStrategy {
  @override
  ui.VoidCallback addPopStateListener(EventListener fn) => () {};

  @override
  void pushState(Object? state, String title, String url) {}

  @override
  void replaceState(Object? state, String title, String url) {}

  @override
  Future<void> go(int count) {
    final Completer<void> completer = Completer<void>();
    Timer(Duration.zero, () {
      completer.complete();
    });
    return completer.future;
  }
}
