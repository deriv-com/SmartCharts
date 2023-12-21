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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import(/* webpackChunkName: "flutter-chart-adapter", webpackPreload: true */ 'chart/main.dart.js');

    return flutterChartElement;
};

export const runChartApp = () => {
    if (window._flutter.initState.isMounted) {
        window._flutter.appRunner?.runApp();
        window._flutter.initState.isInitialRunCompleted = true;
    }
};
