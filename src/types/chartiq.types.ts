import '../../chartiq/development/js/chartiq.js';

export type TCIQChartEngineChart = typeof CIQ.ChartEngine.Chart;

export type TCIQAddEventListener<C> = {
    type: string[] | string;
    cb: C;
};

export type TCIQAppend<C> = {
    method: string;
    func: C;
};

export type TCustomEvent = Event & {
    displacementY: number;
    isHandledByDialog: boolean;
    nativeEvent: {
        isHandledByDialog: boolean;
        is_item_removed: boolean;
    }
};