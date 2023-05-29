import { TEngineInitializer } from 'src/types';

export const createChartElement = () => {
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

    return flutterChartElement;
};
