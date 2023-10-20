import 'dart:async';
import 'dart:ui' as ui;
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

/// To skip navigations in flutter
/// NoNavigationStrategy
class NoNavigationStrategy extends UrlStrategy {
  final BrowserPlatformLocation _platformLocation =
      const BrowserPlatformLocation();

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

  @override
  String getPath() => '';

  @override
  Object? getState() => _platformLocation.state;

  @override
  String prepareExternalUrl(String internalUrl) => '';
}
