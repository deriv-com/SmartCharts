import ChartAdapterStore from 'src/store/ChartAdapterStore';
import { TEngineInitializer } from 'src/types';

type TProps = {
    onChartLoad: ChartAdapterStore['onChartLoad'];
};

export const createChartElement = ({ onChartLoad }: TProps) => {
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
                const appRunner = await engineInitializer.initializeEngine({
                    hostElement: window.flutterChartElement,
                });
                appRunner?.runApp();
            },
        },
    };

    // @ts-ignore
    import(/* webpackChunkName: "flutter-chart-adapter", webpackPreload: true */ 'chart/main.dart.js');

    return flutterChartElement;
};
