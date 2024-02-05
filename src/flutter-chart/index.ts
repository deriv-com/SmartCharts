import ChartAdapterStore from 'src/store/ChartAdapterStore';
import { TEngineInitializer } from 'src/types';

type TCreateChartElementProps = {
    onChartLoad: ChartAdapterStore['onChartLoad'];
};

export const createChartElement = ({ onChartLoad }: TCreateChartElementProps) => {
    // Chart element is set in a window element for faster initialization
    if (window.flutterChartElement) {
        onChartLoad();
        return;
    }

    setupListeners();

    const flutterChartElement = document.createElement('div');
    flutterChartElement.classList.add('flutter-chart');

    window.flutterChartElement = flutterChartElement;

    window._flutter = {
        loader: {
            didCreateEngineInitializer: async (engineInitializer: TEngineInitializer) => {
                window._flutter.appRunner = await engineInitializer.initializeEngine({
                    assetBase: '/',
                    hostElement: window.flutterChartElement,
                });
                window._flutter.initState.isEngineIntialized = true;

                runChartApp();
            },
        },
        initState: {
            isInitialRunCompleted: false,
            isEngineIntialized: false,
            isMounted: false,
        },
    };

    // @ts-expect-error chart dynamic load
    import(/* webpackChunkName: "flutter-chart-adapter", webpackPreload: true */ 'chart/main.dart.js');

    return flutterChartElement;
};

const setupListeners = () => {
    const listener = (ev: KeyboardEvent) => {
        // To fix a trackjs issue caused by some keyboard events that don't contain `key` or `code` props.
        // https://github.com/flutter/engine/blob/f20657354d8b53baafcec55650830ead89adf3e9/lib/web_ui/lib/src/engine/keyboard_binding.dart#L386
        if (!ev.key || !ev.code) {
            ev.stopImmediatePropagation();
        }
    };

    window.addEventListener('keydown', listener, true);
    window.addEventListener('keyup', listener, true);
};

export const runChartApp = () => {
    if (window._flutter.initState.isMounted) {
        window._flutter.appRunner?.runApp();
        window._flutter.initState.isInitialRunCompleted = true;
    }
};
